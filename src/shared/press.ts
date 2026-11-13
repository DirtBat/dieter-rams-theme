import { fireAction } from "./actions";
import type { ActionConfig } from "./types";

type Actions = { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig };

/** Tap and hold for any element: wire `down`, `up` and `click` to its pointer events. */
export class Press {
  private timer?: number;
  private held = false;
  constructor(
    private node: HTMLElement,
    private actions: () => Actions | undefined,
    /** Return true to handle the tap yourself instead of firing tap_action. */
    private onTap?: () => boolean,
  ) {}

  down = (): void => {
    this.held = false;
    this.timer = window.setTimeout(() => {
      const a = this.actions();
      if (!a?.hold_action || a.hold_action.action === "none") return;
      this.held = true;
      fireAction(this.node, a, "hold");
    }, 500);
  };
  up = (): void => window.clearTimeout(this.timer);
  click = (): void => {
    const a = this.actions();
    if (this.held || !a) return;
    if (this.onTap?.()) return;
    fireAction(this.node, a, "tap");
  };
}
