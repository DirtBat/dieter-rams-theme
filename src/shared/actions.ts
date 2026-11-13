import type { ActionConfig } from "./types";

/** Domains where tapping should switch the entity. For everything else, tap opens more-info. */
const TOGGLE = ["light", "switch", "input_boolean", "fan", "scene", "script", "automation", "cover", "lock", "humidifier", "siren", "group"];

type Actions = { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig };

/** Hand an action to Home Assistant, which runs toggle / more-info / perform-action / navigate etc. */
export function fireAction(node: HTMLElement, config: Actions, action: "tap" | "hold"): void {
  const domain = config.entity?.split(".")[0] ?? "";
  const fallback: ActionConfig = { action: action === "tap" && TOGGLE.includes(domain) ? "toggle" : "more-info" };
  const given = action === "tap" ? config.tap_action : config.hold_action;
  const full = { ...config, [action === "tap" ? "tap_action" : "hold_action"]: given ?? fallback };
  node.dispatchEvent(new CustomEvent("hass-action", { detail: { config: full, action }, bubbles: true, composed: true }));
}
