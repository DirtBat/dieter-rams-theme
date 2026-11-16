import type { Hass } from "./types";

export type Tone = "neutral" | "red" | "orange" | "blue" | "green" | "grey";

export const TONES: Array<[string, string]> = [
  ["neutral", "Neutral"], ["red", "Red"], ["orange", "Orange"], ["blue", "Blue"], ["green", "Green"], ["grey", "Grey"],
];

export interface StateRules {
  /** Judge the rules below by this entity's state instead of the card's own entity (e.g. a "level" sensor for an advice text). */
  rules_entity?: string;
  /** Warning (red key + triangle) while the entity state is one of these. Default: automatic, see below. */
  alert_when?: string[];
  /** Active (key filled in its tone) while the state is one of these. Default: on / open / playing. */
  selected_when?: string[];
}

export interface StateView {
  state: string;
  alert: boolean;
  active: boolean;
}

/** Binary sensors with these device classes are warnings when on: HA already marks them as problems. */
const WARNING_CLASSES = ["problem", "safety", "smoke", "gas", "carbon_monoxide", "moisture", "tamper", "battery", "heat"];
const ACTIVE_STATES = ["on", "open", "playing"];

export function readState(hass: Hass | undefined, entity: string | undefined, rules: StateRules): StateView {
  const own = entity ? hass?.states[entity] : undefined;
  const judged = rules.rules_entity ?? entity;
  const e = judged ? hass?.states[judged] : undefined;
  const state = e?.state ?? "";
  const auto = !rules.alert_when && !!e && judged!.startsWith("binary_sensor.") && state === "on" && WARNING_CLASSES.includes(String(e.attributes.device_class));
  return {
    state: own?.state ?? "",
    alert: auto || !!rules.alert_when?.includes(state),
    active: (rules.selected_when ?? ACTIVE_STATES).includes(state),
  };
}
