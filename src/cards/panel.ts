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
  /** A screw in each corner of the plate. The plate's padding grows so the pieces never touch them. */
  screws?: boolean;
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
      .plate { display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; height: 100%; padding: var(--_gap); border-radius: calc(var(--_radius) + var(--_gap)); }
      .plate.f-outline, .plate.f-recessed, .plate.f-backlit, .plate.f-black, .plate.f-raised { background: var(--_plate); border: var(--_border); }
      .plate.f-recessed { background: var(--_lcd-bg); color: var(--_lcd-ink); --_ink: var(--_lcd-ink); --_muted: var(--_lcd-muted); --rams-ink: var(--_lcd-ink); --rams-muted: var(--_lcd-muted); box-shadow: var(--_inset); }
      .plate.f-backlit { background: var(--_backlit-bg); color: var(--_backlit-ink); --_ink: var(--_backlit-ink); --_muted: color-mix(in srgb, var(--_backlit-ink) 72%, transparent); --rams-ink: var(--_backlit-ink); --rams-muted: color-mix(in srgb, var(--_backlit-ink) 72%, transparent); box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.45), inset 0 3px 6px -2px rgba(255, 255, 255, 0.25); }
      .plate.f-black { background: var(--_led-bg); color: var(--_led-ink); --_ink: var(--_led-ink); --_muted: color-mix(in srgb, var(--_led-ink) 62%, transparent); --rams-ink: var(--_led-ink); --rams-muted: color-mix(in srgb, var(--_led-ink) 62%, transparent); box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.8), 0 1px 0 rgba(255, 255, 255, 0.35); text-shadow: 0 0 6px color-mix(in srgb, var(--_led-ink) 40%, transparent); }
      .plate.f-raised { box-shadow: var(--_raised); }
      .plate.screwed { position: relative; padding: calc(var(--_gap) + 18px); }
      .screw { position: absolute; width: 11px; height: 11px; border-radius: 50%; box-sizing: border-box; pointer-events: none;
        background: radial-gradient(circle at 38% 30%, color-mix(in srgb, var(--_cap) 70%, #fff), color-mix(in srgb, var(--_cap) 85%, #000) 80%);
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--_ink) 30%, transparent), 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -1px 1px rgba(0, 0, 0, 0.18); }
      .screw::before, .screw::after { content: ""; position: absolute; left: 50%; top: 50%; width: 7px; height: 1.5px; margin: -0.75px 0 0 -3.5px; border-radius: 1px; background: color-mix(in srgb, var(--_ink) 78%, transparent); transform: rotate(45deg); }
      .screw::after { transform: rotate(-45deg); }
      .screw.tl { top: 9px; left: 9px; } .screw.tr { top: 9px; right: 9px; } .screw.bl { bottom: 9px; left: 9px; } .screw.br { bottom: 9px; right: 9px; }
      .plate.f-none { padding: 0; border-radius: 0; }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); padding: 2px 2px calc(var(--_gap) - 2px); }
      /* the grid counts in half rows: two of them and the gap between make one row, so a label (half a row) and a whole row line up */
      .grid { --_half: calc((var(--_row) - var(--_gap)) / 2); display: grid; gap: var(--_gap); grid-auto-rows: var(--_half); }
      /* Inside another panel the cell is a whole number of outer rows: the rows share the spare height instead of leaving a blank strip */
      :host([nested]) .grid { flex: 1; grid-auto-rows: minmax(var(--_half), 1fr); }
      :host([nested]) .grid.natural { flex: none; grid-auto-rows: var(--_half); }
      /* a nested panel with rows set is exactly that many rows, like any piece next to it: its own rows share what is left */
      :host([nested][fixed]) .grid { grid-auto-rows: minmax(0, 1fr); }
      hui-card { min-width: 0; }
    `,
  ];

  static getStubConfig(): PanelConfig {
    // A small example that shows the pieces working together; delete what you do not need.
    const cards: unknown[] = [
      { type: "custom:rams-label", text: "Living room", line: "below", columns: 12 },
      { type: "custom:rams-display", title: "Temperature", text: "21.5", unit: "\u00b0C", size: "large", frame: "recessed", columns: 8, rows: 2 },
      { type: "custom:rams-dial", title: "Target", value: 21, min: 10, max: 30, interval: 1, major: 5, unit: "\u00b0C", start_angle: -120, end_angle: 120, columns: 4, rows: 3 },
      { type: "custom:rams-ruler", value: 40, min: 0, max: 100, interval: 5, major: 25, labels: true, columns: 8, rows: 1 },
      { type: "custom:rams-button", name: "Rewind", icon: "mdi:rewind", shape: "wide", columns: 4, rows: 1 },
      { type: "custom:rams-button", name: "Play", icon: "mdi:play", shape: "wide", tone: "orange", columns: 4, rows: 1 },
      { type: "custom:rams-button", name: "Stop", icon: "mdi:stop", shape: "wide", columns: 4, rows: 1 },
      { type: "custom:rams-button", name: "Lamp", icon: "mdi:lightbulb-outline", columns: 3, rows: 2 },
      { type: "custom:rams-button", name: "Fan", icon: "mdi:fan", columns: 3, rows: 2 },
      { type: "custom:rams-button", name: "Scene", icon: "mdi:palette-outline", shape: "round", columns: 3, rows: 2 },
      { type: "custom:rams-button", name: "Alarm", icon: "mdi:shield-outline", shape: "round", tone: "green", columns: 3, rows: 2 },
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

  /** True when this panel sits inside another panel (through hui-card and shadow roots). */
  private isNested(): boolean {
    let n: Node | null = this.parentNode;
    while (n) {
      n = n instanceof ShadowRoot ? n.host : n;
      if ((n as HTMLElement).localName === "rams-panel") return true;
      n = n.parentNode ?? (n as ShadowRoot).host ?? null;
    }
    return false;
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
    const nested = this.isNested();
    this.toggleAttribute("nested", nested);
    const fixed = nested && typeof this.config?.rows === "number";
    this.toggleAttribute("fixed", fixed);
    // measure the content at its natural row height, then let a nested panel stretch again
    grid.classList.add("natural");
    const natural = px(cs.paddingTop) + px(cs.paddingBottom) + px(cs.borderTopWidth) + px(cs.borderBottomWidth) + title + grid.offsetHeight;
    grid.classList.remove("natural");
    const row = px(cs.getPropertyValue("--_row")) || 56;
    const gap = px(cs.getPropertyValue("--_gap")) || 8;
    const n = Math.max(1, Math.ceil((natural - 0.5 + gap) / (row + gap)));
    this.needed = n;
    // Inside another panel: tell it how many rows this one spans, or the pieces after it flow into its space.
    // Rows set by the user are the height, exactly; otherwise it is what the content needs.
    const span = fixed ? (this.config!.rows as number) : n;
    this.reportRows(span);
    const h = `${span * row + (span - 1) * gap}px`;
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

  /** Rows a card takes: what it says, else one (a label: half a row). */
  private rowsOf(card: PieceConfig): number {
    return typeof card.rows === "number" ? card.rows : card.type === "custom:rams-label" ? 0.5 : 1;
  }

  /** A data-driven piece reports its row count; set the span on its hui-card wrapper. */
  private onRows = (e: Event) => {
    const card = e.composedPath().find((n) => (n as HTMLElement).localName === "hui-card") as HTMLElement | undefined;
    if (card) card.style.gridRow = `span ${(e as CustomEvent<{ rows: number }>).detail.rows * 2}`;
    e.stopPropagation(); // a nested panel's own pieces must not reach the outer panel
  };

  /** The panel's own action fires only when the press did not land on a piece that has its own. */
  private fits = (e: Event) => !e.composedPath().some((n) => (n as HTMLElement).hasAttribute?.("actionable"));
  private onClick = (e: Event) => { if (this.fits(e)) this.press.click(); };
  private onDown = (e: Event) => { if (this.fits(e)) this.press.down(); };

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const cols = c.columns ?? 12;
    const frame = c.frame ?? this.defaultFrame;
    const screws = !!c.screws && frame !== "none";
    return html`<div class="plate f-${frame} ${screws ? "screwed" : ""}" @rams-rows=${this.onRows} @click=${this.onClick} @pointerdown=${this.onDown} @pointerup=${this.press.up} @pointerleave=${this.press.up}>
      ${screws ? html`<i class="screw tl"></i><i class="screw tr"></i><i class="screw bl"></i><i class="screw br"></i>` : nothing}
      ${c.title ? html`<div class="title">${c.title}</div>` : nothing}
      <div class="grid" style="grid-template-columns: repeat(${cols}, minmax(0, 1fr))">
        ${(c.cards ?? []).map(
          (card) => html`<hui-card
            .config=${card}
            .hass=${this.hass}
            style="grid-column: ${card.columns ? `span ${Math.min(card.columns, cols)}` : "1 / -1"}; grid-row: span ${Math.max(1, Math.round(2 * this.rowsOf(card)))}"
          ></hui-card>`,
        )}
      </div>
    </div>`;
  }
}
