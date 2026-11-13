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

  getCardSize(): number {
    return this.config?.rows ?? 1;
  }
}
