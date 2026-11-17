import { css } from "lit";

/** How many unit squares fit a box: n wide or m tall (never both), and the side of one square. */
export function fitKey(w: number, h: number): { n: number; m: number; u: number } {
  if (w <= 0 || h <= 0) return { n: 1, m: 1, u: 0 };
  const n = w >= h ? Math.max(1, Math.round(w / h)) : 1;
  const m = w >= h ? 1 : Math.max(1, Math.round(h / w));
  return { n, m, u: Math.min(w / n, h / m) };
}

/**
 * The key, drawn once: a beige-grey cap with a recessed dish, an optional dot (the colour a state rule gives it),
 * a warning LED above and the printed name below. Buttons, switches and the keypad share it.
 *
 * A key is a square, or a whole number of squares (1x2, 4x1, 2x2 ...): the card's box decides how many fit and the
 * key never stretches off-square. The dish is a circle on a square key and a pill on a long or tall one.
 */
export const keyStyles = css`
  .cell { height: 100%; min-height: var(--_row); display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 0; }
  .cell.above { flex-direction: column-reverse; }
  .cell.left { flex-direction: row-reverse; }
  .cell.right { flex-direction: row; }
  /* the LED and the key, together; the name sits beside or above it */
  .stack { flex: 1; min-height: 0; min-width: 0; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .cell.left .stack, .cell.right .stack { width: auto; align-self: stretch; }
  .cell.left .txt, .cell.right .txt { max-width: 45%; }
  /* name beside the key: key and LED sit next to it, not in the middle of the leftover room */
  .cell.right .stack { align-items: flex-end; } .cell.right .keyarea { justify-content: flex-end; }
  .cell.left .stack { align-items: flex-start; } .cell.left .keyarea { justify-content: flex-start; }
  .led { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--_lens); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.35); }
  .led.on { background: var(--_alert); box-shadow: 0 0 max(var(--_glow), 5px) 1px color-mix(in srgb, var(--_alert) 85%, transparent), inset 0 0 2px rgba(255, 255, 255, 0.6); }
  .txt { flex: none; min-height: 13px; max-width: 100%; box-sizing: border-box; padding: 0 2px; font-size: 10px; line-height: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--_muted); text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* the key's room: the key fills it */
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

  /* the dish: a circle on a square key, a pill on a long (n > 1) or tall (m > 1) one. --u is the key's unit square. */
  .key::before {
    content: ""; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    height: calc(var(--u, 56px) * 0.76); aspect-ratio: 1; border-radius: 50%;
    background: radial-gradient(120% 140% at 50% 15%, var(--_cap) 0%, var(--_dish) 100%);
    box-shadow: var(--_inset), 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  .key:not([data-n="1"])::before { width: calc(100% - var(--u) * 0.24); aspect-ratio: auto; border-radius: 999px; }
  .key:not([data-m="1"])::before { height: calc(100% - var(--u) * 0.24); width: calc(var(--u) * 0.76); aspect-ratio: auto; border-radius: 999px; }
  .key.tall::before { height: calc(100% - var(--u) * 0.24); width: 62%; aspect-ratio: auto; border-radius: 999px; }
  /* text printed on the key sits on a pill-shaped dish */
  .key:has(.legend):not(.round)::before { height: calc(var(--u, 56px) * 0.62); width: calc(100% - 12px); aspect-ratio: auto; border-radius: 999px; }
  .key > * { position: relative; z-index: 1; }
  .ico { --mdc-icon-size: 22px; flex: none; }
  .key.round .ico { --mdc-icon-size: 18px; }
  .key:has(.legend) { flex-direction: column; gap: 2px; }
  .legend { max-width: 86%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; line-height: 1.1; }

  /* a toned key: the whole key takes the colour */
  .key.filled { --c: var(--t); color: var(--_ink-on); }
  .key.filled:not(.round) { background: linear-gradient(180deg, color-mix(in srgb, var(--c) 92%, #fff), var(--c)); box-shadow: var(--_raised), 0 0 var(--_glow) 1px color-mix(in srgb, var(--c) 45%, transparent); }
  .key.filled:not(.round)::before { background: radial-gradient(120% 140% at 50% 15%, color-mix(in srgb, var(--c) 90%, #fff) 0%, color-mix(in srgb, var(--c) 80%, #000) 100%); }

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
