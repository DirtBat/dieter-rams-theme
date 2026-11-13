import { css } from "lit";

/**
 * Design tokens as roles. A HA theme may set any --rams-* variable; the fallback is the light theme.
 * Components use the internal --_ names only, never a raw colour.
 *
 * Rounding comes from one base radius: key = radius, panel plate = radius + gap, so the corners share a centre.
 */
export const tokens = css`
  :host {
    --_plate: var(--rams-plate, #f5f4f0);
    --_cap: var(--rams-cap, #ffffff);
    --_field: var(--rams-field, #eae9e3);
    --_ink: var(--rams-ink, #261201);
    --_ink-on: var(--rams-ink-on, #ffffff);
    --_muted: var(--rams-muted, #736356);
    --_red: var(--rams-red, #c8362b);
    --_orange: var(--rams-orange, #e8801a);
    --_blue: var(--rams-blue, #2f5fa8);
    --_green: var(--rams-green, #3e8e5a);
    --_grey: var(--rams-grey, #8a8a86);
    --_active: var(--rams-active, var(--_orange));
    --_honey: var(--rams-honey, var(--_orange));
    --_alert: var(--rams-alert, var(--_red));
    --_border: var(--rams-border, 1px solid rgba(38, 18, 1, 0.18));
    --_raised: var(--rams-raised, 0 2px 3px rgba(38, 18, 1, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.8));
    --_pressed: var(--rams-pressed, inset 0 2px 3px rgba(38, 18, 1, 0.25));
    --_inset: var(--rams-inset, inset 0 2px 3px rgba(38, 18, 1, 0.12));
    --_radius: var(--rams-radius, 6px);
    --_row: var(--rams-row, 56px);
    --_gap: var(--rams-gap, 8px);
    font-family: var(--rams-font, "Helvetica Neue", Helvetica, Arial, sans-serif);
    color: var(--_ink);
    display: block;
    height: 100%;
    min-width: 0;
    box-sizing: border-box;
  }
  /* Frame: the piece's own box. The base class reflects config.frame to the host attribute. */
  :host([frame="outline"]),
  :host([frame="recessed"]),
  :host([frame="raised"]) {
    border: var(--_border);
    border-radius: var(--_radius);
    padding: 0 var(--_fpad, var(--_gap));
  }
  :host([frame="recessed"]) { background: var(--_field); box-shadow: var(--_inset); }
  :host([frame="raised"]) { background: var(--_cap); box-shadow: var(--_raised); }
`;
