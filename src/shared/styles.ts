import { css } from "lit";

/**
 * Design tokens as roles. A HA theme may set any --rams-* variable; the fallback is the light theme.
 * Components use the internal --_ names only, never a raw colour.
 */
export const tokens = css`
  :host {
    --_plate: var(--rams-plate, #c8c5b9);
    --_cap: var(--rams-cap, #d9d2c6);
    --_cap-dark: var(--rams-cap-dark, #261201);
    --_cap-dark-ink: var(--rams-cap-dark-ink, #d9d2c6);
    --_field: var(--rams-field, #c9ccbf);
    --_ink: var(--rams-ink, #261201);
    --_muted: var(--rams-muted, #736356);
    --_active: var(--rams-active, #ed8008);
    --_alert: var(--rams-alert, #ad1d1d);
    --_alert-ink: var(--rams-alert-ink, #d9d2c6);
    --_border: var(--rams-border, 1px solid rgba(38, 18, 1, 0.28));
    --_raised: var(--rams-raised, 0 2px 3px rgba(38, 18, 1, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.55));
    --_pressed: var(--rams-pressed, inset 0 2px 3px rgba(38, 18, 1, 0.3));
    --_inset: var(--rams-inset, inset 0 2px 3px rgba(38, 18, 1, 0.18));
    --_radius: var(--rams-radius, 5px);
    --_row: var(--rams-row, 56px);
    --_gap: var(--rams-gap, 8px);
    font-family: var(--rams-font, "Helvetica Neue", Helvetica, Arial, sans-serif);
    color: var(--_ink);
  }
`;
