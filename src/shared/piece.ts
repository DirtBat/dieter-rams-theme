import { LitElement, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import type { Frame, Hass, PieceConfig } from "./types";

/**
 * Base class for every piece. Holds hass and config, reflects the frame to the host,
 * and reports data-driven heights to the enclosing panel.
 */
export abstract class Piece<C extends PieceConfig> extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @property({ attribute: false }) protected config?: C;

  /** Frame used when the config sets none. */
  protected defaultFrame: Frame = "none";
  /** False when the piece draws its own box (buttons). */
  protected hostFrame = true;

  setConfig(config: C): void {
    this.config = config;
  }

  /** True when this piece handles taps itself, so the panel's own action stays out of the way. */
  protected actionable(): boolean {
    const c = this.config;
    return [c?.tap_action, c?.hold_action].some((a) => a && a.action !== "none");
  }

  protected willUpdate(changed: PropertyValues): void {
    if (!changed.has("config")) return;
    this.setAttribute("frame", this.hostFrame ? (this.config?.frame ?? this.defaultFrame) : "none");
    this.toggleAttribute("actionable", this.actionable());
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
