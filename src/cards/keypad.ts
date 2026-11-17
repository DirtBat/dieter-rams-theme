import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { readState, type StateRules, type Tone } from "../shared/state-rules";
import { tokens } from "../shared/styles";
import { keyStyles } from "../shared/key";
import { computeLabel, computeHelper, layoutFields } from "../shared/form";
import type { PieceConfig } from "../shared/types";

type Mode = "disarm" | "arm_home" | "arm_away" | "arm_night";

const MODE_LABEL: Record<Mode, string> = { disarm: "Disarm", arm_home: "Arm home", arm_away: "Arm away", arm_night: "Night mode" };
const MODE_SERVICE: Record<Mode, string> = { disarm: "alarm_disarm", arm_home: "alarm_arm_home", arm_away: "alarm_arm_away", arm_night: "alarm_arm_night" };
const MODE_STATE: Record<Mode, string> = { disarm: "disarmed", arm_home: "armed_home", arm_away: "armed_away", arm_night: "armed_night" };
const DEFAULT_TONE: Record<Mode, Tone | undefined> = { disarm: undefined, arm_home: undefined, arm_away: "red", arm_night: "blue" };

/** One mode key. A plain mode name is accepted as well, for older configurations. */
export interface ModeKey {
  mode: Mode;
  /** Legend on the key. Defaults to the mode's name. */
  name?: string;
  /** Colour of the dot on the key. */
  tone?: Tone;
}

export interface KeypadConfig extends PieceConfig, Pick<StateRules, "state_colours"> {
  entity?: string;
  modes?: Array<Mode | ModeKey>;
}

const IDLE_MS = 30_000;
const DEFAULT_MODES: Mode[] = ["disarm", "arm_home", "arm_away", "arm_night"];

const parseModes = (modes: KeypadConfig["modes"]): ModeKey[] =>
  (modes?.length ? modes : DEFAULT_MODES).map((m) => (typeof m === "string" ? { mode: m } : m)).filter((m) => m.mode in MODE_LABEL);

/** Alarm code entry. The code lives only in this element while typing; it is never stored in a config. */
@customElement("rams-keypad")
export class RamsKeypad extends Piece<KeypadConfig> {
  @state() private code = "";
  private idle?: number;

  static styles = [
    tokens,
    keyStyles,
    css`
      :host { display: block; min-width: 0; }
      .pad { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); grid-auto-rows: var(--_row); gap: var(--_gap); }
      .screen { grid-column: 1 / -1; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; border-radius: var(--_radius); background: var(--_field); border: var(--_border); box-shadow: var(--_inset); font-size: 12px; }
      .screen.sig { background: var(--_sig); color: var(--_ink-on); border-color: rgba(0, 0, 0, 0.25); box-shadow: 0 0 calc(var(--_glow) * 1.5) color-mix(in srgb, var(--_sig) 50%, transparent); }
      .screen.sig .state { color: inherit; }
      .screen.sig .dots b { border-color: var(--_ink-on); }
      .screen.sig .dots b.f { background: var(--_ink-on); }
      .sig.red { --_sig: var(--_alert); } .sig.orange { --_sig: var(--_orange); } .sig.blue { --_sig: var(--_blue); } .sig.green { --_sig: var(--_green); } .sig.grey { --_sig: var(--_grey); }
      .dots { display: flex; gap: 10px; }
      .dots b { width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--_ink); box-sizing: border-box; }
      .dots b.f { background: var(--_ink); }
      .state { color: var(--_muted); text-transform: lowercase; }
      /* every key sits in its own cell of the pad, on a fixed place, so the digits never move when modes come and go */
      .keyarea { min-height: 0; }
      .legend { font-size: 15px; line-height: 1; }
      .mode .legend { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; }
      .mode .dot { margin-right: 8px; }
    `,
  ];

  static getStubConfig(): KeypadConfig {
    return { type: "custom:rams-keypad", columns: 12, modes: DEFAULT_MODES.map((mode) => ({ mode })) };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: { domain: "alarm_control_panel" } } },
        {
          name: "modes",
          selector: {
            object: {
              multiple: true,
              label_field: "mode",
              fields: {
                mode: { selector: { select: { mode: "dropdown", options: (Object.keys(MODE_LABEL) as Mode[]).map((value) => ({ value, label: MODE_LABEL[value] })) } }, required: true },
                name: { selector: { text: {} } },
                tone: { selector: { select: { mode: "dropdown", options: ["red", "orange", "blue", "green", "grey"] } } },
              },
            },
          },
        },
        {
          name: "state_colours",
          selector: {
            object: {
              multiple: true,
              label_field: "state",
              fields: {
                state: { selector: { text: {} }, required: true },
                tone: { selector: { select: { mode: "dropdown", options: ["red", "orange", "blue", "green", "grey"] } }, required: true },
              },
            },
          },
        },
        ...layoutFields(false),
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

  private runMode(mode: Mode): void {
    const c = this.config;
    if (!c?.entity || !this.hass) return;
    const data: Record<string, unknown> = { entity_id: c.entity };
    if (this.code) data.code = this.code;
    void this.hass.callService("alarm_control_panel", MODE_SERVICE[mode], data);
    this.code = "";
  }

  protected updated(_c: PropertyValues): void {
    this.reportRows(5);
  }

  /** A key with its legend on the cap, placed on a fixed grid cell. */
  private cap(legend: string, col: string, row: number, onTap: () => void, opts: { cls?: string; tone?: Tone; down?: boolean } = {}): TemplateResult {
    return html`<div class="keyarea ${opts.cls ?? ""}" style="grid-column: ${col}; grid-row: ${row}">
      <button class="key ${opts.down ? "down" : ""} ${opts.tone ?? ""}" @click=${onTap}>
        ${opts.tone ? html`<i class="dot"></i>` : nothing}<span class="legend">${legend}</span>
      </button>
    </div>`;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const alarm = (c.entity && this.hass?.states[c.entity]?.state) || "";
    // The screen turns red for triggered and pending by default; "colour by state" rows win.
    const view = readState(this.hass, c.entity, { state_colours: c.state_colours, alert_when: ["triggered", "pending"] });
    const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const modes = parseModes(c.modes);
    return html`<div class="pad">
      <div class="screen ${view.signal ? `sig ${view.signal}` : ""}">
        <div class="dots">${Array.from({ length: Math.max(4, this.code.length) }, (_, i) => html`<b class=${i < this.code.length ? "f" : ""}></b>`)}</div>
        <span class="state">${alarm.replace(/_/g, " ")}</span>
      </div>
      ${digits.map((d, i) => this.cap(d, `${(i % 3) * 2 + 1} / span 2`, 2 + Math.floor(i / 3), () => this.press(d)))}
      ${this.cap("clr", "1 / span 2", 5, () => (this.code = ""))}
      ${this.cap("0", "3 / span 2", 5, () => this.press("0"))}
      ${this.cap("⌫", "5 / span 2", 5, () => (this.code = this.code.slice(0, -1)))}
      ${modes.map((m, i) => this.cap(m.name || MODE_LABEL[m.mode], "8 / -1", 2 + i, () => this.runMode(m.mode), { cls: "mode", tone: m.tone ?? DEFAULT_TONE[m.mode], down: alarm === MODE_STATE[m.mode] }))}
    </div>`;
  }
}
