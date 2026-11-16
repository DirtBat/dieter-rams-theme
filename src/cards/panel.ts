import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { Press } from "../shared/press";
import { tokens } from "../shared/styles";
import type { PieceConfig } from "../shared/types";
import { loadPanelEditor } from "./panel-editor";

export interface PanelConfig extends PieceConfig {
  /** Number of equal columns on this panel's grid. */
  columns?: number;
  /** Space between pieces and around them, in px. The corner radius follows it. */
  spacing?: number;
  title?: string;
  cards?: PieceConfig[];
}

const BASE_GAP = 8;
const BASE_RADIUS = 6;

@customElement("rams-panel")
export class RamsPanel extends Piece<PanelConfig> {
  protected defaultFrame = "raised" as const;
  protected hostFrame = false;

  private press = new Press(this, () => this.config);

  static styles = [
    tokens,
    css`
      .plate { display: block; box-sizing: border-box; height: 100%; padding: var(--_gap); border-radius: calc(var(--_radius) + var(--_gap)); }
      .plate.f-outline, .plate.f-recessed, .plate.f-raised { background: var(--_plate); border: var(--_border); }
      .plate.f-recessed { box-shadow: var(--_inset); }
      .plate.f-raised { box-shadow: var(--_raised); }
      .plate.f-none { padding: 0; border-radius: 0; }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); padding: 2px 2px calc(var(--_gap) - 2px); }
      .grid { display: grid; gap: var(--_gap); grid-auto-rows: var(--_row); }
      hui-card { min-width: 0; }
    `,
  ];

  static getStubConfig(): PanelConfig {
    // A small example that shows the pieces working together; delete what you do not need.
    const key = (name: string, tone: string, style = "stripe") => ({ type: "custom:rams-button", name, tone, tone_style: style, columns: 2, rows: 1 });
    const cards: unknown[] = [
        { type: "custom:rams-display", title: "Temperature", text: "21.5", unit: "\u00b0C", size: "large", columns: 8, rows: 2 },
        { type: "custom:rams-dial", value: 40, min: 0, max: 100, interval: 10, label: "Level", columns: 4, rows: 3 },
        key("Lamp", "orange"),
        key("Fan", "blue"),
        key("Scene", "green", "cap"),
        key("Alarm", "red", "cap"),
    ];
    return { type: "custom:rams-panel", columns: 12, cards: cards as PieceConfig[] };
  }

  static async getConfigElement(): Promise<HTMLElement> {
    return loadPanelEditor();
  }

  /** The most rows the content needs, measured by fit(): HA's Layout tab will not offer fewer. */
  private needed = 1;

  getGridOptions() {
    return { columns: 12, rows: "auto", min_rows: this.needed };
  }

  /** One base radius and one gap: both come from the panel's spacing, so the corners stay concentric. */
  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (!changed.has("config")) return;
    const gap = this.config?.spacing ?? BASE_GAP;
    this.style.setProperty("--rams-gap", `${gap}px`);
    this.style.setProperty("--rams-radius", `${Math.max(2, BASE_RADIUS + (gap - BASE_GAP) / 2)}px`);
  }

  private watcher?: ResizeObserver;

  /**
   * HA sizes a section in whole rows. Round the plate up to an exact number of rows (rows x row height + gaps),
   * so the height HA measures converts back to the same number of rows and never overlaps the next card.
   */
  private fit = (): void => {
    const plate = this.shadowRoot?.querySelector<HTMLElement>(".plate");
    const grid = this.shadowRoot?.querySelector<HTMLElement>(".grid");
    if (!plate || !grid) return;
    const cs = getComputedStyle(plate);
    const px = (v: string) => parseFloat(v) || 0;
    const title = this.shadowRoot?.querySelector<HTMLElement>(".title")?.offsetHeight ?? 0;
    const natural = px(cs.paddingTop) + px(cs.paddingBottom) + px(cs.borderTopWidth) + px(cs.borderBottomWidth) + title + grid.offsetHeight;
    const row = px(cs.getPropertyValue("--_row")) || 56;
    const gap = px(cs.getPropertyValue("--_gap")) || 8;
    const n = Math.max(1, Math.ceil((natural - 0.5 + gap) / (row + gap)));
    this.needed = n;
    const h = `${n * row + (n - 1) * gap}px`;
    if (plate.style.minHeight !== h) plate.style.minHeight = h;
  };

  protected updated(): void {
    const grid = this.shadowRoot?.querySelector<HTMLElement>(".grid");
    if (grid && !this.watcher) {
      this.watcher = new ResizeObserver(this.fit);
      this.watcher.observe(grid);
    }
    this.fit();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.watcher?.disconnect();
    this.watcher = undefined;
  }

  /** A data-driven piece reports its row count; set the span on its hui-card wrapper. */
  private onRows = (e: Event) => {
    const card = e.composedPath().find((n) => (n as HTMLElement).localName === "hui-card") as HTMLElement | undefined;
    if (card) card.style.gridRow = `span ${(e as CustomEvent<{ rows: number }>).detail.rows}`;
  };

  /** The panel's own action fires only when the press did not land on a piece that has its own. */
  private fits = (e: Event) => !e.composedPath().some((n) => (n as HTMLElement).hasAttribute?.("actionable"));
  private onClick = (e: Event) => { if (this.fits(e)) this.press.click(); };
  private onDown = (e: Event) => { if (this.fits(e)) this.press.down(); };

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const cols = c.columns ?? 12;
    return html`<div class="plate f-${c.frame ?? this.defaultFrame}" @rams-rows=${this.onRows} @click=${this.onClick} @pointerdown=${this.onDown} @pointerup=${this.press.up} @pointerleave=${this.press.up}>
      ${c.title ? html`<div class="title">${c.title}</div>` : nothing}
      <div class="grid" style="grid-template-columns: repeat(${cols}, minmax(0, 1fr))">
        ${(c.cards ?? []).map(
          (card) => html`<hui-card
            .config=${card}
            .hass=${this.hass}
            style="grid-column: ${card.columns ? `span ${Math.min(card.columns, cols)}` : "1 / -1"}; grid-row: span ${typeof card.rows === "number" ? card.rows : 1}"
          ></hui-card>`,
        )}
      </div>
    </div>`;
  }
}
