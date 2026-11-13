import { css, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { Press } from "../shared/press";
import { readState, TONES, type StateRules, type Tone } from "../shared/state-rules";
import { tokens } from "../shared/styles";
import { actionFields, computeLabel, dropdown, layoutFields } from "../shared/form";
import { clamp, defaultRange, readNumber, writeNumber } from "../shared/entity-value";
import type { PieceConfig } from "../shared/types";

type Position = "inside" | "above" | "below" | "beside";

export interface ButtonConfig extends PieceConfig, StateRules {
  entity?: string;
  /** Text on the key. */
  name?: string;
  /** Small text: inside above the name, or outside the key, see `label_position`. */
  label?: string;
  /** Use the entity state (a date for scenes) as the small text. */
  show_state?: boolean;
  label_position?: Position;
  shape?: "key" | "round";
  /** Colour: a stripe on the key at rest, the key's fill while active. */
  tone?: Tone;
  /** Text alignment. The tone stripe sits on the opposite side. */
  align?: "start" | "center" | "end";
  /** Show the active state as a lit lamp instead of filling the key. */
  lamp?: boolean;
  /** Climate only: tap changes the target temperature by this amount. For other entities use a perform-action tap action. */
  adjust_by?: number;
}

/** Scene states are timestamps: show them as a short date. */
function readable(state: string, tz?: string): string {
  if (!/^\d{4}-\d\d-\d\dT/.test(state)) return state;
  const d = new Date(state);
  if (isNaN(d.getTime())) return state;
  return new Intl.DateTimeFormat("en-GB", { timeZone: tz, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(d);
}

@customElement("rams-button")
export class RamsButton extends Piece<ButtonConfig> {
  protected hostFrame = false;
  private press = new Press(this, () => this.config, () => this.step());

  static styles = [
    tokens,
    css`
      .cell { height: 100%; display: flex; flex-direction: column; align-items: stretch; justify-content: center; gap: 3px; min-width: 0; }
      .cell.beside { flex-direction: row; align-items: center; gap: var(--_gap); }
      .cell.above { flex-direction: column; }
      .cell.below { flex-direction: column-reverse; }
      .txt { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); text-align: center; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .beside .txt { text-align: left; font-size: 12px; text-transform: none; letter-spacing: 0; color: var(--_ink); }
      .beside .txt small { display: block; font-size: 11px; color: var(--_muted); }
      .above .txt, .below .txt { flex: none; }

      .btn {
        --t: var(--_ink);
        position: relative; box-sizing: border-box; width: 100%; height: 100%; min-height: 0; min-width: 0;
        display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2px; padding: 0 8px;
        background: var(--_cap); color: var(--_ink);
        border: var(--_border); border-radius: var(--_radius);
        font: inherit; font-size: 13px; cursor: pointer; user-select: none;
      }
      /* the key's room: the key fills it, a round key is the biggest circle that fits, never an oval */
      .keyarea { flex: 1; min-height: 0; min-width: 0; display: flex; align-items: center; justify-content: center; container-type: size; }
      .beside .keyarea { flex: none; height: 100%; aspect-ratio: 1; }
      .round { border-radius: 50%; padding: 0; width: min(100cqw, 100cqh); height: min(100cqw, 100cqh); }

      /* frame of the key itself */
      .f-raised { box-shadow: var(--_raised); }
      .f-recessed { background: var(--_field); box-shadow: var(--_inset); }
      .f-none { border-color: transparent; background: transparent; }
      .btn:active { box-shadow: var(--_pressed); filter: brightness(0.96); }

      .red { --t: var(--_red); } .orange { --t: var(--_orange); } .blue { --t: var(--_blue); } .green { --t: var(--_green); } .grey { --t: var(--_grey); }
      /* tone stripe at rest, opposite the text alignment */
      .toned::before { content: ""; position: absolute; top: 6px; width: 16px; height: 3px; border-radius: 2px; background: var(--t); }
      .a-center::before { left: 50%; transform: translateX(-50%); }
      .a-start::before { right: 8px; }
      .a-end::before { left: 8px; }
      .a-start { align-items: flex-start; text-align: left; }
      .a-end { align-items: flex-end; text-align: right; }

      /* active: filled in the tone (neutral fills with ink) */
      .active:not(.lamp) { background: var(--t); color: var(--_ink-on); border-color: rgba(0, 0, 0, 0.25); box-shadow: var(--_pressed); }
      .active:not(.lamp)::before { background: rgba(255, 255, 255, 0.7); }
      .small { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      .active:not(.lamp) .small, .alert .small { color: inherit; opacity: 0.85; }

      /* warning: red key + triangle */
      .alert { background: var(--_alert); color: var(--_ink-on); border-color: rgba(0, 0, 0, 0.25); }
      .alert::before { background: rgba(255, 255, 255, 0.7); }
      .warn { width: 11px; height: 10px; flex: none; }
      .row { display: flex; align-items: center; gap: 5px; }

      /* lamp: a lit dot in the corner */
      .lampdot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; border-radius: 50%; background: rgba(38, 18, 1, 0.16); }
      .lamp.active .lampdot { background: var(--t); box-shadow: 0 0 6px 2px color-mix(in srgb, var(--t) 55%, transparent); }
      .alert .lampdot { background: #fff; box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.55); }
    `,
  ];

  static getStubConfig(): ButtonConfig {
    return { type: "custom:rams-button", name: "Button", columns: 3 };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
        { name: "label", selector: { text: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            dropdown("label_position", [["inside", "Inside"], ["above", "Above"], ["below", "Below"], ["beside", "Beside"]]),
            { name: "show_state", selector: { boolean: {} } },
            dropdown("shape", [["key", "Key"], ["round", "Round"]]),
            dropdown("tone", TONES),
            dropdown("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]]),
            { name: "lamp", selector: { boolean: {} } },
          ],
        },
        layoutFields(),
        ...actionFields(),
        {
          type: "expandable",
          name: "",
          title: "State rules",
          schema: [
            { name: "selected_when", selector: { select: { multiple: true, custom_value: true, options: [] } } },
            { name: "alert_when", selector: { select: { multiple: true, custom_value: true, options: [] } } },
            { name: "adjust_by", selector: { number: { step: "any", mode: "box" } } },
          ],
        },
      ],
      computeLabel,
    };
  }

  protected actionable(): boolean {
    return !!this.config?.entity || super.actionable();
  }

  /** Climate stepper: the only case that needs more than a perform-action. */
  private step(): boolean {
    const c = this.config;
    if (!c?.adjust_by || !c.entity?.startsWith("climate.") || !this.hass) return false;
    const now = readNumber(this.hass, c.entity);
    if (now !== undefined) void writeNumber(this.hass, c.entity, clamp(now + c.adjust_by, defaultRange(this.hass, c.entity)));
    return true;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const view = readState(this.hass, c.entity, c);
    const pos = c.label_position ?? "inside";
    const shape = c.shape ?? "key";
    const tone = c.tone ?? "neutral";
    const align = c.align ?? "center";
    const state = c.show_state ? readable(view.state, this.hass?.config?.time_zone) : "";
    const frame = c.frame ?? "raised";
    const cls = [
      "btn", `f-${frame}`, shape === "round" ? "round" : "", tone !== "neutral" ? `${tone} toned` : "", `a-${align}`,
      view.alert ? "alert" : view.active ? "active" : "", c.lamp ? "lamp" : "",
    ].filter(Boolean).join(" ");
    const triangle = view.alert ? html`<svg class="warn" viewBox="0 0 12 11"><path d="M6 0l6 11H0z" fill="currentColor" /></svg>` : nothing;
    const inside = pos === "inside" ? (c.label ?? state) : "";
    const key = html`<div class="keyarea"><button class=${cls} @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}>
      ${c.lamp || view.alert ? html`<span class="lampdot"></span>` : nothing}
      ${inside ? html`<span class="small">${inside}</span>` : nothing}
      ${c.name || view.alert ? html`<span class="row">${triangle}${c.name ?? ""}</span>` : nothing}
    </button></div>`;
    if (pos === "inside") return html`<div class="cell">${key}</div>`;
    const text = c.label ?? (c.show_state ? state : "");
    const second = pos === "beside" && c.label && c.show_state ? state : "";
    return html`<div class="cell ${pos}">
      ${key}${text || second ? html`<div class="txt">${text}${second ? html`<small>${second}</small>` : nothing}</div>` : nothing}
    </div>`;
  }
}
