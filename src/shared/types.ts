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
}

export interface ActionConfig {
  action: string;
  [key: string]: unknown;
}

/** Fields every piece accepts: its size on the panel grid. */
export interface PieceConfig {
  type: string;
  columns?: number;
  rows?: number;
}
