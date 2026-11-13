import { css, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { tokens } from "../shared/styles";
import type { PieceConfig } from "../shared/types";
import { loadPanelEditor } from "./panel-editor";

export interface PanelConfig extends PieceConfig {
  /** Number of equal columns on this panel's grid. */
  columns?: number;
  cards?: PieceConfig[];
}

@customElement("rams-panel")
export class RamsPanel extends Piece<PanelConfig> {
  static styles = [
    tokens,
    css`
      :host { display: block; }
      .plate { display: grid; gap: var(--_gap); grid-auto-rows: var(--_row); padding: var(--_gap); background: var(--_plate); border-radius: calc(var(--_radius) + 1px); }
      hui-card { min-width: 0; }
    `,
  ];

  static getStubConfig(): PanelConfig {
    return { type: "custom:rams-panel", columns: 6, cards: [] };
  }

  static async getConfigElement(): Promise<HTMLElement> {
    return loadPanelEditor();
  }

  getGridOptions() {
    return { columns: 12, rows: "auto" };
  }

  /** A data-driven piece reports its row count; set the span on its hui-card wrapper. */
  private onRows = (e: Event) => {
    const card = e.composedPath().find((n) => (n as HTMLElement).localName === "hui-card") as HTMLElement | undefined;
    if (card) card.style.gridRow = `span ${(e as CustomEvent<{ rows: number }>).detail.rows}`;
  };

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const cols = c.columns ?? 12;
    return html`<div class="plate" @rams-rows=${this.onRows} style="grid-template-columns: repeat(${cols}, minmax(0, 1fr))">
      ${(c.cards ?? []).map(
        (card) => html`<hui-card
          .config=${card}
          .hass=${this.hass}
          style="grid-column: span ${card.columns ?? 1}; grid-row: span ${typeof card.rows === "number" ? card.rows : 1}"
        ></hui-card>`,
      )}
    </div>`;
  }
}
