import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import type { Hass, PieceConfig } from "./types";

/**
 * Base class for every piece. Holds hass and config, and exposes the grid span.
 * The panel reads `columns` and `rows` from the piece's config and sets them on the wrapping element.
 */
export abstract class Piece<C extends PieceConfig> extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @property({ attribute: false }) protected config?: C;

  setConfig(config: C): void {
    this.config = config;
  }

  private lastRows = 0;

  /** Tell the enclosing panel how many grid rows this piece needs (data-driven height). */
  protected reportRows(rows: number): void {
    if (rows === this.lastRows) return;
    this.lastRows = rows;
    this.dispatchEvent(new CustomEvent("rams-rows", { detail: { rows }, bubbles: true, composed: true }));
  }

  /** Convert a measured pixel height to whole grid rows, using the row and gap tokens. */
  protected rowsFor(px: number): number {
    const style = getComputedStyle(this);
    const row = parseFloat(style.getPropertyValue("--_row")) || 56;
    const gap = parseFloat(style.getPropertyValue("--_gap")) || 8;
    return Math.max(1, Math.ceil((px + gap) / (row + gap)));
  }

  getCardSize(): number {
    return this.config?.rows ?? 1;
  }
}
