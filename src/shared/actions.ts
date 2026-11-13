import type { ActionConfig } from "./types";

/** Hand an action to Home Assistant, which runs toggle / more-info / perform-action / navigate etc. */
export function fireAction(node: HTMLElement, config: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig }, action: "tap" | "hold"): void {
  node.dispatchEvent(new CustomEvent("hass-action", { detail: { config, action }, bubbles: true, composed: true }));
}
