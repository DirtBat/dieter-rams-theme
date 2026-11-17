import { css } from "lit";

/**
 * The key, drawn once: a beige-grey cap with a recessed dish, an optional dot (the colour a state rule gives it),
 * a warning LED above and the printed name below. Buttons, switches and the keypad share it.
 *
 * The key fills the room it is given. The dish is a circle on a squarish key and a pill on a long or tall one
 * (a container query on the key's room decides), so a 1x2, 4x1 or tall key needs no extra option.
 */
export const keyStyles = css`
  .cell { height: 100%; min-height: var(--_row); display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 0; }
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
  .key.tall { width: 50%; }
  /* down: the key stays in while active */
  .key.down, .key:active { background: var(--_down); box-shadow: var(--_pressed); transform: translateY(1px); }

  /* the dish */
  .key::before {
    content: ""; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    height: 62%; aspect-ratio: 1; border-radius: 50%;
    background: radial-gradient(120% 140% at 50% 15%, var(--_cap) 0%, var(--_dish) 100%);
    box-shadow: var(--_inset), 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  .key.tall::before { height: calc(100% - 20px); width: 56%; aspect-ratio: auto; border-radius: 999px; }
  @container (min-aspect-ratio: 13/10) {
    .key:not(.tall)::before { height: 62%; width: calc(100% - 20px); aspect-ratio: auto; border-radius: 999px; }
  }
  @container (max-aspect-ratio: 10/13) {
    .key:not(.tall)::before { height: calc(100% - 20px); width: 62%; aspect-ratio: auto; border-radius: 999px; }
  }
  .key > * { position: relative; z-index: 1; }

  /* the dot: only where a state rule (or a keypad mode) gives the key a colour */
  .dot { width: 11px; height: 11px; border-radius: 50%; background: var(--t); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.25), 0 0 var(--_glow) 1px color-mix(in srgb, var(--t) 70%, transparent); }
  .red { --t: var(--_red); } .orange { --t: var(--_orange); } .blue { --t: var(--_blue); } .green { --t: var(--_green); } .grey { --t: var(--_grey); }
`;
