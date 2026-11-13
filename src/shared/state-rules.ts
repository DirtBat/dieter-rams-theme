import type { Hass } from "./types";

export type Tone = "neutral" | "dark" | "alert";

export interface StateRules {
  /** Show the alert tone while the entity state is one of these. */
  alert_when?: string[];
  /** Mark the piece as selected (outline + LED) while the entity state is one of these. */
  selected_when?: string[];
}

export interface StateView {
  state: string;
  alert: boolean;
  selected: boolean;
}

export function readState(hass: Hass | undefined, entity: string | undefined, rules: StateRules): StateView {
  const state = (entity && hass?.states[entity]?.state) || "";
  return {
    state,
    alert: !!rules.alert_when?.includes(state),
    selected: !!rules.selected_when?.includes(state),
  };
}
