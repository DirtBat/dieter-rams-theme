import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { readState, TONES, type StateRules } from "../shared/state-rules";
import { tokens } from "../shared/styles";
import { keyStyles } from "../shared/key";
import { computeLabel, computeHelper, layoutFields } from "../shared/form";
import type { PieceConfig } from "../shared/types";

type Mode = "home" | "away" | "night" | "vacation" | "disarm";
const MODES: [Mode, string][] = [["home", "Home"], ["away", "Away"], ["night", "Night"], ["vacation", "Vacation"], ["disarm", "Disarm"]];

export interface KeypadConfig extends PieceConfig, Pick<StateRules, "state_colours"> {
  entity?: string;
  /** The keys under the keypad: arm modes, and a Disarm key. Home, away and night when not set. */
  modes?: Mode[];
}

const IDLE_MS = 30_000;

/**
 * Code entry for an alarm panel, after the default Alarmo keypad: a code field that shows the alarm state,
 * the digits 1 to 9, clear, 0 and confirm. The code lives only in this element while typing; it is never stored in a config.
 */
@customElement("rams-keypad")
export class RamsKeypad extends Piece<KeypadConfig> {
  @state() private code = "";
  private idle?: number;

  static styles = [
    tokens,
    keyStyles,
    css`
      :host { display: flex; flex-direction: column; justify-content: center; min-width: 0; }
      /* a framed keypad has the same margin above and below as at the sides */
      :host([frame="outline"]), :host([frame="recessed"]), :host([frame="raised"]) { padding-block: var(--_gap); }
      /* one centred block: the screen and the keys share the same width and margins (12px all round) */
      .pad { box-sizing: border-box; padding: 12px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: var(--_row); gap: var(--_gap); width: min(100%, calc(3 * var(--_row) + 2 * var(--_gap) + 24px)); margin: 0 auto; }
      .key:disabled { opacity: 0.4; pointer-events: none; }
      .key.filled.orange:disabled { opacity: 1; }
      /* the screen is the display: the same recessed LCD, filled with a tone for a state */
      .screen { grid-column: 1 / -1; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; border-radius: var(--_radius); background: var(--_lcd-bg); color: var(--_lcd-ink); border: var(--_border); box-shadow: var(--_inset); font-size: 12px; }
      .screen.sig { background: var(--_sig); color: var(--_ink-on); border-color: rgba(0, 0, 0, 0.25); box-shadow: 0 0 calc(var(--_glow) * 1.5) color-mix(in srgb, var(--_sig) 50%, transparent); }
      .sig.red { --_sig: var(--_alert); } .sig.orange { --_sig: var(--_orange); } .sig.blue { --_sig: var(--_blue); } .sig.green { --_sig: var(--_green); } .sig.grey { --_sig: var(--_grey); }
      .dots { display: flex; gap: 10px; }
      .dots b { width: 10px; height: 10px; border-radius: 50%; border: 2px solid currentColor; box-sizing: border-box; }
      .dots b.f { background: currentColor; }
      .state { text-transform: lowercase; opacity: 0.8; }
      /* each key in its own cell; the key is always a circle, the biggest that fits */
      .keyarea { min-height: 0; }
      .legend { font-size: 18px; font-weight: 400; }
      .legend.sm { font-size: 11px; font-weight: 500; letter-spacing: 0.02em; }
    `,
  ];

  static getStubConfig(): KeypadConfig {
    return { type: "custom:rams-keypad", columns: 12 };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: { domain: "alarm_control_panel" } } },
        { name: "modes", selector: { select: { multiple: true, mode: "list", options: MODES.map(([value, label]) => ({ value, label })) } } },
        {
          name: "state_colours",
          selector: {
            object: {
              multiple: true,
              label_field: "state",
              fields: {
                state: { label: "State", required: true, selector: { text: {} } },
                tone: { label: "Colour", required: true, selector: { select: { mode: "dropdown", options: TONES.filter(([v]) => v !== "neutral").map(([value, label]) => ({ value, label })) } } },
              },
            },
          },
        },
        ...layoutFields(),
      ],
      computeLabel,
      computeHelper,
    };
  }

  private touch(): void {
    window.clearTimeout(this.idle);
    this.idle = window.setTimeout(() => (this.code = ""), IDLE_MS);
  }

  private press(d: string): void {
    this.code = (this.code + d).slice(0, 8);
    this.touch();
  }

  private call(service: string): void {
    const c = this.config;
    if (!c?.entity || !this.hass) return;
    const data: Record<string, unknown> = { entity_id: c.entity };
    if (this.code) data.code = this.code;
    void this.hass.callService("alarm_control_panel", service, data);
    this.code = "";
  }

  protected updated(_c: PropertyValues): void {
    const pad = this.renderRoot.querySelector<HTMLElement>(".pad");
    const gap = parseFloat(getComputedStyle(this).getPropertyValue("--_gap")) || 8;
    const framed = !!this.getAttribute("frame") && this.getAttribute("frame") !== "none";
    if (pad) this.reportRows(this.rowsFor(pad.offsetHeight + (framed ? 2 * gap + 2 : 0)));
  }

  private cap(legend: string, onTap: () => void, tone = "", disabled = false, small = false): TemplateResult {
    return html`<div class="keyarea"><button class="key round ${tone ? `filled ${tone}` : ""}" ?disabled=${disabled} @click=${onTap}><span class="legend ${small ? "sm" : ""}">${legend}</span></button></div>`;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const alarm = (c.entity && this.hass?.states[c.entity]?.state) || "";
    // Triggered, pending and armed away are red unless "colour by state" says otherwise.
    const rows = [...(c.state_colours ?? []), ...["triggered", "pending", "armed_away"].map((state) => ({ state, tone: "red" as const }))];
    const view = readState(this.hass, c.entity, { state_colours: rows });
    const modes = MODES.filter(([m]) => (c.modes ?? ["home", "away", "night"]).includes(m));
    const needCode = !!this.hass?.states[c.entity ?? ""]?.attributes.code_arm_required;
    return html`<div class="pad">
      <div class="screen ${view.signal ? `sig ${view.signal}` : ""}">
        <div class="dots">${Array.from({ length: Math.max(4, this.code.length) }, (_, i) => html`<b class=${i < this.code.length ? "f" : ""}></b>`)}</div>
        <span class="state">${alarm.replace(/_/g, " ")}</span>
      </div>
      ${["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => this.cap(d, () => this.press(d)))}
      ${this.cap("✕", () => (this.code = ""))}
      ${this.cap("0", () => this.press("0"))}
      ${this.cap("✓", () => this.call("alarm_disarm"), "green", !this.code || alarm === "disarmed")}
      ${modes.map(([m, label]) => m === "disarm"
        ? this.cap(label, () => this.call("alarm_disarm"), "", alarm === "disarmed" || !this.code, true)
        : this.cap(label, () => this.call(`alarm_arm_${m}`), alarm === `armed_${m}` ? "orange" : "", alarm !== "disarmed" || (needCode && !this.code), true))}
    </div>`;
  }
}
