import type { Hass } from "./types";

export type Tone = "neutral" | "red" | "orange" | "blue" | "green" | "grey";

export const TONES: Array<[string, string]> = [
  ["neutral", "Neutral"], ["red", "Red"], ["orange", "Orange"], ["blue", "Blue"], ["green", "Green"], ["grey", "Grey"],
];

export interface StateRules {
  /** A colour per state: the piece is filled with this tone while the judged entity is in that state. Wins over alert_when. */
  state_colours?: Array<{ state: string; tone: Tone }>;
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
  /** The tone to fill a piece with now, if any: a colour for this state, else red for a warning. */
  signal?: Tone;
}

/** Binary sensors with these device classes are warnings when on: HA already marks them as problems. */
const WARNING_CLASSES = ["problem", "safety", "smoke", "gas", "carbon_monoxide", "moisture", "tamper", "battery", "heat"];
const ACTIVE_STATES = ["on", "open", "playing"];

const same = (a: string | undefined, b: string): boolean => (a ?? "").trim().toLowerCase() === b.toLowerCase();

export function readState(hass: Hass | undefined, entity: string | undefined, rules: StateRules): StateView {
  const own = entity ? hass?.states[entity] : undefined;
  const judged = rules.rules_entity ?? entity;
  const e = judged ? hass?.states[judged] : undefined;
  const state = e?.state ?? "";
  const auto = !rules.alert_when && !!e && judged!.startsWith("binary_sensor.") && state === "on" && WARNING_CLASSES.includes(String(e.attributes.device_class));
  const alert = auto || !!rules.alert_when?.some((w) => same(w, state));
  const hit = state ? rules.state_colours?.find((r) => same(r.state, state))?.tone : undefined;
  return {
    state: own?.state ?? "",
    alert,
    active: (rules.selected_when ?? ACTIVE_STATES).some((a) => same(a, state)),
    signal: hit && hit !== "neutral" ? hit : alert ? "red" : undefined,
  };
}
