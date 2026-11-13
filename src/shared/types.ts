/** Minimal Home Assistant types. We only declare what the cards use. */
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface Hass {
  states: Record<string, HassEntity>;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<void>;
  formatEntityState?(entity: HassEntity): string;
  localize?(key: string): string;
  config?: { time_zone?: string };
}

export interface ActionConfig {
  action: string;
  [key: string]: unknown;
}

/** How a piece's own box is drawn. The same four values everywhere. */
export type Frame = "none" | "outline" | "recessed" | "raised";

/** Fields every piece accepts: its size on the panel grid, its frame and its actions. */
export interface PieceConfig {
  type: string;
  /** Width in grid units. Default: the full width of the panel. */
  columns?: number;
  /** Height in grid units. */
  rows?: number;
  frame?: Frame;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
}
