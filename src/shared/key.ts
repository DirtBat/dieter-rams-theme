import { css } from "lit";

/**
 * The key, drawn once: a beige-grey cap with a recessed dish, an optional dot (the colour a state rule gives it),
 * a warning LED above and the printed name below. Buttons, switches and the keypad share it.
 *
 * A key is a square, or a whole number of squares (1x2, 4x1, 2x2 ...): the card's box decides how many fit and the
 * key never stretches off-square. The dish is a circle on a square key; the wide key is a flat graphite oblong with no dish.
 */
export const keyStyles = css`
  /* The key, its LED and its name are one group, centred in whatever room the card has: spare room goes
     outside the group, never between the key and its name. One gap (5px) everywhere. */
  .cell { height: 100%; min-height: var(--_min, var(--_row)); box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; min-width: 0; }
  .cell.above { flex-direction: column-reverse; }
  .cell.left { flex-direction: row-reverse; }
  .cell.right { flex-direction: row; }
  .stack { flex: none; display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .cell.left .txt, .cell.right .txt { max-width: 45%; margin-top: 13px; }
  .cell.left .txt { text-align: right; } .cell.right .txt { text-align: left; }
  .led.off { visibility: hidden; }
  .led.on.orange { --_alert: var(--_orange); } .led.on.blue { --_alert: var(--_blue); } .led.on.green { --_alert: var(--_green); } .led.on.grey { --_alert: var(--_grey); }
  .led { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--_lens); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.35); }
  .led.on { background: var(--_alert); box-shadow: 0 0 max(var(--_glow), 5px) 1px color-mix(in srgb, var(--_alert) 85%, transparent), inset 0 0 2px rgba(255, 255, 255, 0.6); }
  .txt { flex: none; min-height: 13px; max-width: 100%; box-sizing: border-box; padding: 0 2px; font-size: 10px; line-height: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--_muted); text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* the key's room. In a card (.cell) its size is set from the fit, so the group stays compact; in the keypad it fills its grid cell. */
  .cell .keyarea { flex: none; min-height: 0; width: auto; position: relative; align-items: center; }
  /* A square key sits in a black cut-out in the panel. The cut-out is square-cornered (no dips where plates meet) and reaches half a gap past the key at the sides and 3px above and below, so keys side by side
     share one black block: the black between two keys is twice the black round the outside. */
  .plate { position: absolute; top: 0; bottom: 0; left: calc(var(--_gap, 8px) / -2); right: calc(var(--_gap, 8px) / -2); border-radius: 0; background: var(--_cutout); box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.7), 0 1px 0 rgba(255, 255, 255, 0.5); pointer-events: none; }
  .key.sq { flex: none; border-radius: 3px; margin: auto; }
  .keyarea { flex: 1; min-height: 24px; min-width: 0; width: 100%; display: flex; justify-content: center; container-type: size; }
  .key {
    position: relative; box-sizing: border-box; width: 100%; height: 100%; min-width: 0; padding: 0;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--_key-edge); border-radius: var(--_radius);
    background: linear-gradient(180deg, var(--_cap), color-mix(in srgb, var(--_cap) 92%, #000));
    box-shadow: var(--_raised); color: var(--_ink);
    font: inherit; font-size: 14px; cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent;
  }
  /* down: the key stays in while active */
  .key.down, .key:active { background: var(--_down); box-shadow: var(--_pressed); transform: translateY(1px); }

  /* the dish: a circle on a square key, a pill on a long (n > 1) one. --u is the key's unit square. */
  .key::before {
    content: ""; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    height: calc(var(--u, 56px) * 0.86); aspect-ratio: 1; border-radius: 50%;
    /* hollow: shaded at the top edge, catching the light at the bottom */
    background: radial-gradient(circle at 50% 80%, color-mix(in srgb, var(--_cap) 78%, #fff) 0%, var(--_dish) 72%);
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.3), inset 0 -1px 1px rgba(255, 255, 255, 0.55), 0 1px 0 rgba(255, 255, 255, 0.45);
  }
  .key:not([data-n="1"])::before { width: calc(100% - var(--u) * 0.14); aspect-ratio: auto; border-radius: 999px; }
  .key:not([data-m="1"])::before { height: calc(100% - var(--u) * 0.14); width: calc(var(--u) * 0.86); aspect-ratio: auto; border-radius: 999px; }
  /* text printed on the key sits on a pill-shaped dish */
  .key:has(.legend):not(.round)::before { height: calc(var(--u, 56px) * 0.7); width: calc(100% - 10px); aspect-ratio: auto; border-radius: 999px; }
  .key > * { position: relative; z-index: 1; }
  .ico { --mdc-icon-size: 22px; flex: none; }
  .ico.tinted { color: var(--t); }
  .key.round .ico { --mdc-icon-size: 18px; }
  .key:has(.legend) { flex-direction: column; gap: 2px; }
  .legend { max-width: 86%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; line-height: 1.1; }

  /* wide: a flat graphite oblong twice as wide as high, as the transport keys of a Braun cassette deck. No dish, no cut-out. */
  .key.wide { border: 1px solid rgba(0, 0, 0, 0.55); border-radius: 3px; color: var(--_ink-on); background: linear-gradient(180deg, color-mix(in srgb, var(--_graphite) 86%, #fff), var(--_graphite) 40%, color-mix(in srgb, var(--_graphite) 88%, #000)); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 1px 1px rgba(0, 0, 0, 0.4), 0 2px 3px rgba(0, 0, 0, 0.22); }
  .key.wide::before { display: none; }
  .key.wide .ico { --mdc-icon-size: 18px; }
  .key.wide .legend { font-size: 10px; }
  .key.wide.down, .key.wide:active { background: color-mix(in srgb, var(--_graphite) 82%, #000); box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.7); transform: translateY(1px); }

  /* a toned key: the whole key takes the colour */
  .key.filled { --c: var(--t); color: var(--_ink-on); }
  .key.filled:not(.round) { background: linear-gradient(180deg, color-mix(in srgb, var(--c) 92%, #fff), var(--c)); box-shadow: var(--_raised), 0 0 var(--_glow) 1px color-mix(in srgb, var(--c) 45%, transparent); }
  .key.filled:not(.round)::before { background: radial-gradient(circle at 50% 80%, color-mix(in srgb, var(--c) 88%, #fff) 0%, color-mix(in srgb, var(--c) 76%, #000) 75%); }

  /* round: a dome on a dark ring, as on the Braun calculator. Always a circle: the biggest that fits. */
  .key.round {
    --dome: radial-gradient(circle at 38% 28%, color-mix(in srgb, var(--c, var(--_cap)) 78%, #fff) 0%, var(--c, var(--_cap)) 52%, color-mix(in srgb, var(--c, var(--_cap)) 78%, #000) 100%);
    flex: none; align-self: center; width: calc(min(100cqw, 100cqh) - 6px); height: calc(min(100cqw, 100cqh) - 6px); border: 0; border-radius: 50%;
    background: var(--dome);
    box-shadow: 0 0 0 3px var(--_ring), 0 2px 4px rgba(0, 0, 0, 0.35), inset 0 -2px 3px rgba(0, 0, 0, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.45);
  }
  .key.round.filled { box-shadow: 0 0 0 3px var(--_ring), 0 2px 4px rgba(0, 0, 0, 0.35), 0 0 var(--_glow) 1px color-mix(in srgb, var(--c) 55%, transparent), inset 0 -2px 3px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.5); }
  .key.round::before { display: none; }
  .key.round .legend { text-transform: none; letter-spacing: 0; font-size: 11px; font-weight: 500; }
  .key.round.down, .key.round:active { background: var(--dome); filter: brightness(0.88); transform: translateY(1px); }

  /* the dot: only where a state rule (or a keypad mode) gives the key a colour */
  .dot { width: 11px; height: 11px; border-radius: 50%; background: var(--t); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.25), 0 0 var(--_glow) 1px color-mix(in srgb, var(--t) 70%, transparent); }
  .red { --t: var(--_red); } .orange { --t: var(--_orange); } .blue { --t: var(--_blue); } .green { --t: var(--_green); } .grey { --t: var(--_grey); }
`;
