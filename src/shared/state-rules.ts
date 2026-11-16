import type { Hass } from "./types";

export type Tone = "neutral" | "red" | "orange" | "blue" | "green" | "grey";

export const TONES: Array<[string, string]> = [
  ["neutral", "Neutral"], ["red", "Red"], ["orange", "Orange"], ["blue", "Blue"], ["green", "Green"], ["grey", "Grey"],
];

export interface StateRules {
  /** A colour per state: the piece is filled with this tone while the judged entity is in that state. Wins over alert_when. */
  state_colours?: Array<{ state: string; tone: Tone }>;
  /** A colour per value: the piece is filled with this tone while the number is above or below the value. State colours win; among value rows the strictest one that matches wins. */
  value_colours?: Array<{ when: "above" | "below"; value: number; tone: Tone }>;
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

/** The strictest matching row: the highest "above", else the lowest "below". */
function valueTone(state: string, rows: StateRules["value_colours"]): Tone | undefined {
  const v = Number(state);
  if (!rows || state === "" || Number.isNaN(v)) return undefined;
  const above = rows.filter((r) => r.when !== "below" && v > Number(r.value)).sort((a, b) => Number(b.value) - Number(a.value))[0];
  const below = rows.filter((r) => r.when === "below" && v < Number(r.value)).sort((a, b) => Number(a.value) - Number(b.value))[0];
  return (above ?? below)?.tone;
}

const same = (a: string | undefined, b: string): boolean => (a ?? "").trim().toLowerCase() === b.toLowerCase();

export function readState(hass: Hass | undefined, entity: string | undefined, rules: StateRules): StateView {
  const own = entity ? hass?.states[entity] : undefined;
  const judged = rules.rules_entity ?? entity;
  const e = judged ? hass?.states[judged] : undefined;
  const state = e?.state ?? "";
  const auto = !rules.alert_when && !!e && judged!.startsWith("binary_sensor.") && state === "on" && WARNING_CLASSES.includes(String(e.attributes.device_class));
  const alert = auto || !!rules.alert_when?.some((w) => same(w, state));
  const hit = state ? rules.state_colours?.find((r) => same(r.state, state))?.tone : undefined;
  const byValue = hit ?? valueTone(state, rules.value_colours);
  return {
    state: own?.state ?? "",
    alert,
    active: (rules.selected_when ?? ACTIVE_STATES).some((a) => same(a, state)),
    signal: byValue && byValue !== "neutral" ? byValue : alert ? "red" : undefined,
  };
}
