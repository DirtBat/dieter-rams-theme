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
    --_cap: var(--rams-cap, #e6e3da);
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
    --_down: var(--rams-down, #cfcbc1);
    --_key-edge: var(--rams-key-edge, rgba(38, 18, 1, 0.35));
    --_cutout: var(--rams-cutout, #17110c);
    --_lens: var(--rams-lens, #b9b3a6);
    --_ring: var(--rams-ring, color-mix(in srgb, var(--_plate) 82%, #000));
    --_slot: var(--rams-slot, #2b2118);
    --_lever: var(--rams-lever, #efece4);
    --_dish: color-mix(in srgb, var(--_cap) 88%, #000);
    --_gap: var(--rams-gap, 8px);
    /* night roles: day values make them invisible */
    --_glow: var(--rams-glow, 0px);
    --_cap-rest: var(--rams-cap-rest, 100%);
    --_cap-on: var(--rams-cap-on, 78%);
    --_cap-on-mix: var(--rams-cap-on-mix, #000);
    --_lcd-bg: var(--rams-lcd-bg, var(--_field));
    --_lcd-ink: var(--rams-lcd-ink, var(--_ink));
    --_lcd-muted: color-mix(in srgb, var(--_lcd-ink) 72%, transparent);
    /* the green backlit LCD, as the recessed field is at night: a dim grey-green, lighter at the top where the backlight is, dark ink */
    --_backlit-bg: var(--rams-backlit-bg, linear-gradient(180deg, #98a090 0%, #8b9385 55%, #7d8578 100%));
    --_backlit-ink: var(--rams-backlit-ink, #12160f);
    /* the black display: a black field with yellow-green lights, as on a Braun tuner */
    --_led-bg: var(--rams-led-bg, linear-gradient(180deg, #0a0b08 0%, #12140e 100%));
    --_led-ink: var(--rams-led-ink, #c6e63c);
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
  :host([frame="backlit"]),
  :host([frame="black"]),
  :host([frame="raised"]) {
    border: var(--_border);
    border-radius: var(--_radius);
    padding: 0 var(--_fpad, var(--_gap));
  }
  /* A signalled piece takes the tone as --_sig; the piece itself decides what to fill (the display fills its face). */
  :host([signal="red"]) { --_sig: var(--_alert); }
  :host([signal="orange"]) { --_sig: var(--_orange); }
  :host([signal="blue"]) { --_sig: var(--_blue); }
  :host([signal="green"]) { --_sig: var(--_green); }
  :host([signal="grey"]) { --_sig: var(--_grey); }
  :host([actionable]) { cursor: pointer; }
  :host([frame="recessed"]) { background: var(--_lcd-bg); color: var(--_lcd-ink); --_ink: var(--_lcd-ink); --_muted: var(--_lcd-muted); box-shadow: var(--_inset); }
  :host([frame="raised"]) { background: var(--_cap); box-shadow: var(--_raised); }
  :host([frame="backlit"]) { background: var(--_backlit-bg); color: var(--_backlit-ink); --_ink: var(--_backlit-ink); --_muted: color-mix(in srgb, var(--_backlit-ink) 72%, transparent); box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.45), inset 0 3px 6px -2px rgba(255, 255, 255, 0.25); }
  :host([frame="black"]) { background: var(--_led-bg); color: var(--_led-ink); --_ink: var(--_led-ink); --_muted: color-mix(in srgb, var(--_led-ink) 62%, transparent); --_lcd-ink: var(--_led-ink); box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.8), 0 1px 0 rgba(255, 255, 255, 0.35); text-shadow: 0 0 6px color-mix(in srgb, var(--_led-ink) 40%, transparent); }
`;
