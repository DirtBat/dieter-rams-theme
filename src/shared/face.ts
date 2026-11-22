import { css } from "lit";

/**
 * A piece's own box ("face") with an optional title printed outside it: above, below, left or right.
 * The piece draws .wrap > .outer + .face. The face carries the frame (outline, recessed, backlit, black, raised) and, for a signalled
 * piece, the tone fill (.sig).
 */
export const faceStyles = css`
  :host { display: block; }
  .wrap { height: 100%; display: flex; flex-direction: column; gap: 5px; min-width: 0; }
  /* the title comes first in the markup: that is "above" (column) and "left" (row) */
  .wrap.below { flex-direction: column-reverse; }
  .wrap.left { flex-direction: row; align-items: center; }
  .wrap.right { flex-direction: row-reverse; align-items: center; }
  .outer { flex: none; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--_muted); text-align: center; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .left .outer, .right .outer { max-width: 40%; }
  .face { flex: 1; min-width: 0; min-height: 0; box-sizing: border-box; }
  .left .face, .right .face { align-self: stretch; }
  .face.outline, .face.recessed, .face.backlit, .face.black, .face.raised { border: var(--_border); border-radius: var(--_radius); padding: 0 var(--_gap); }
  .face.outline { background: transparent; }
  .face.raised { background: var(--_cap); box-shadow: var(--_raised); }
  .face.recessed { background: var(--_lcd-bg); color: var(--_lcd-ink); --_ink: var(--_lcd-ink); --_muted: var(--_lcd-muted); box-shadow: var(--_inset); }
  .face.backlit { background: var(--_backlit-bg); color: var(--_backlit-ink); --_ink: var(--_backlit-ink); --_muted: color-mix(in srgb, var(--_backlit-ink) 72%, transparent); box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.45), inset 0 3px 6px -2px rgba(255, 255, 255, 0.25); }
  .face.black { background: var(--_led-bg); color: var(--_led-ink); --_ink: var(--_led-ink); --_muted: color-mix(in srgb, var(--_led-ink) 62%, transparent); box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.8); text-shadow: 0 0 6px color-mix(in srgb, var(--_led-ink) 40%, transparent); }
  .face.sig { background: var(--_sig); color: var(--_ink-on); --_ink: var(--_ink-on); --_muted: color-mix(in srgb, var(--_ink-on) 78%, transparent); border-radius: var(--_radius); box-shadow: 0 0 calc(var(--_glow) * 1.5) color-mix(in srgb, var(--_sig) 50%, transparent); }
`;
