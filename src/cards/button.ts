import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { Press } from "../shared/press";
import { readState, TONES, type StateRules, type Tone } from "../shared/state-rules";
import { tokens } from "../shared/styles";
import { actionFields, computeLabel, computeHelper, dropdown, layoutFields, SIZES } from "../shared/form";
import { clamp, defaultRange, readNumber, writeNumber } from "../shared/entity-value";
import type { PieceConfig } from "../shared/types";

type Position = "inside" | "above" | "below" | "beside";

export interface ButtonConfig extends PieceConfig, StateRules {
  entity?: string;
  /** The only text: the key legend, or the caption outside the key (see `label_position`). Defaults to the entity name. */
  name?: string;
  /** Show the entity state (a date for scenes) inside the key; the name then moves to the label position. */
  show_state?: boolean;
  label_position?: Position;
  shape?: "key" | "round";
  /** Colour of the key. */
  tone?: Tone;
  /** How the colour shows: a stripe on a white key, or the whole key (cap). Neutral looks the same either way. */
  tone_style?: "stripe" | "cap";
  /** Text size. */
  size?: "small" | "medium" | "large";
  /** Text alignment. The tone stripe sits on the opposite side. */
  align?: "start" | "center" | "end";
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
  protected minRows = true;
  private press = new Press(this, () => this.config, () => this.step());

  static styles = [
    tokens,
    css`
      :host { display: block; }
      .cell { --sz: 13px; height: 100%; min-height: var(--_row); display: flex; flex-direction: column; align-items: stretch; justify-content: center; gap: 3px; min-width: 0; }
      .cell.beside { flex-direction: row; align-items: center; gap: var(--_gap); }
      .cell.above { flex-direction: column-reverse; }
      .cell.below { flex-direction: column; }
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
        font: inherit; font-size: var(--sz, 13px); cursor: pointer; user-select: none;
      }
      /* the key's room: the key fills it, a round key is the biggest circle that fits, never an oval */
      .keyarea { flex: 1; min-height: 0; min-width: 0; display: flex; align-items: center; justify-content: center; container-type: size; }
      .beside .keyarea { flex: none; height: 100%; aspect-ratio: 1; }
      .round { border-radius: 50%; padding: 0; width: min(100cqw, 100cqh); height: min(100cqw, 100cqh); }

      /* frame of the key itself */
      .f-raised { box-shadow: var(--_raised); }
            .btn:active { box-shadow: var(--_pressed); filter: brightness(0.96); }

      .red { --t: var(--_red); } .orange { --t: var(--_orange); } .blue { --t: var(--_blue); } .green { --t: var(--_green); } .grey { --t: var(--_grey); }
      /* tone stripe at rest, opposite the text alignment */
      .stripe.toned::before { content: ""; position: absolute; top: 6px; width: 16px; height: 3px; border-radius: 2px; background: var(--t); box-shadow: 0 0 var(--_glow) calc(var(--_glow) / 4) color-mix(in srgb, var(--t) 80%, transparent); }
      .stripe.a-center::before { left: 50%; transform: translateX(-50%); }
      .stripe.a-start::before { right: 8px; }
      .stripe.a-end::before { left: 8px; }
      .cap { background: color-mix(in srgb, var(--t) var(--_cap-rest), var(--_cap)); color: var(--_ink-on); box-shadow: var(--_raised), 0 0 calc(var(--_glow) * 1.5) color-mix(in srgb, var(--t) 35%, transparent); }
      .cap .small { color: inherit; opacity: 0.85; }
      .cap.active { background: color-mix(in srgb, var(--t) var(--_cap-on), var(--_cap-on-mix)); box-shadow: var(--_pressed), 0 0 calc(var(--_glow) * 2) color-mix(in srgb, var(--t) 55%, transparent); }
      .a-start { align-items: flex-start; text-align: left; }
      .a-end { align-items: flex-end; text-align: right; }

      /* active: the key stays down (darker body, inset shadow); the tone stripe is unchanged */
      :host([size="small"]) .cell { --sz: 11px; }
      :host([size="large"]) .cell { --sz: 16px; }
      .active { background: var(--_down); box-shadow: var(--_pressed); }
      .small { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      .alert .small { color: inherit; opacity: 0.85; }

      /* warning: red key + triangle */
      .alert { background: var(--_alert); color: var(--_ink-on); border-color: rgba(0, 0, 0, 0.25); box-shadow: 0 0 calc(var(--_glow) * 1.5) color-mix(in srgb, var(--_alert) 50%, transparent); }
      .alert::before { background: rgba(255, 255, 255, 0.7); }
      .warn { width: 11px; height: 10px; flex: none; }
      .row { display: flex; align-items: center; gap: 5px; }

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
        {
          type: "grid",
          name: "",
          schema: [
            dropdown("label_position", [["inside", "Inside"], ["above", "Above"], ["below", "Below"], ["beside", "Beside"]]),
            { name: "show_state", selector: { boolean: {} } },
            dropdown("shape", [["key", "Key"], ["round", "Round"]]),
            dropdown("tone", TONES),
            dropdown("tone_style", [["stripe", "Stripe"], ["cap", "Full colour"]]),
            dropdown("size", SIZES),
            dropdown("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]]),
          ],
        },
        ...layoutFields(false),
        ...actionFields(),
        {
          type: "expandable",
          name: "",
          title: "State rules",
          schema: [
            { name: "selected_when", selector: { state: { multiple: true } }, context: { filter_entity: "entity" } },
            { name: "alert_when", selector: { state: { multiple: true } }, context: { filter_entity: "entity" } },
            { name: "adjust_by", selector: { number: { step: "any", mode: "box" } } },
          ],
        },
      ],
      computeLabel,
      computeHelper,
    };
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (changed.has("config")) this.setAttribute("size", this.config?.size ?? "medium");
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
    const name = c.name || String(this.hass?.states[c.entity ?? ""]?.attributes.friendly_name ?? "");
    const pos = c.label_position ?? "inside";
    const shape = c.shape ?? "key";
    const tone = c.tone ?? "neutral";
    const align = c.align ?? "center";
    const state = c.show_state ? readable(view.state, this.hass?.config?.time_zone) : "";
        const cls = [
      "btn", "f-raised", shape === "round" ? "round" : "", tone !== "neutral" ? `${tone} toned ${c.tone_style === "cap" ? "cap" : "stripe"}` : "", `a-${align}`,
      view.alert ? "alert" : view.active ? "active" : "",
    ].filter(Boolean).join(" ");
    const triangle = view.alert ? html`<svg class="warn" viewBox="0 0 12 11"><path d="M6 0l6 11H0z" fill="currentColor" /></svg>` : nothing;
    // Inside the key: the state when shown, otherwise the name (unless the name sits outside).
    const main = state || (pos === "inside" ? name : "");
    const small = state && pos === "inside" ? name : "";
    const caption = pos === "inside" ? "" : name;
    const key = html`<div class="keyarea"><button class=${cls} @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}>
      ${small ? html`<span class="small">${small}</span>` : nothing}
      ${main || view.alert ? html`<span class="row">${triangle}${main}</span>` : nothing}
    </button></div>`;
    return html`<div class="cell ${pos}">${key}${caption ? html`<div class="txt">${caption}</div>` : nothing}</div>`;
  }
}
