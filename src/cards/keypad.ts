import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { tokens } from "../shared/styles";
import { computeLabel, layoutFields } from "../shared/form";
import type { PieceConfig } from "../shared/types";
import "./button";

type Mode = "disarm" | "arm_home" | "arm_away" | "arm_night";

const MODE_LABEL: Record<Mode, string> = { disarm: "Disarm", arm_home: "Arm home", arm_away: "Arm away", arm_night: "Night mode" };
const MODE_SERVICE: Record<Mode, string> = { disarm: "alarm_disarm", arm_home: "alarm_arm_home", arm_away: "alarm_arm_away", arm_night: "alarm_arm_night" };

export interface KeypadConfig extends PieceConfig {
  entity?: string;
  modes?: Mode[];
}

const IDLE_MS = 30_000;
const NO_ACTION = { action: "none" };

/** Alarm code entry. The code lives only in this element while typing; it is never stored in a config. */
@customElement("rams-keypad")
export class RamsKeypad extends Piece<KeypadConfig> {
  @state() private code = "";
  private idle?: number;

  static styles = [
    tokens,
    css`
      :host { display: block; min-width: 0; }
      .pad { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); grid-auto-rows: var(--_row); gap: var(--_gap); }
      .screen { grid-column: 1 / -1; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; border-radius: var(--_radius); background: var(--_field); border: var(--_border); box-shadow: var(--_inset); font-size: 12px; }
      .dots { display: flex; gap: 10px; }
      .dots b { width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--_ink); box-sizing: border-box; }
      .dots b.f { background: var(--_ink); }
      .state { color: var(--_muted); text-transform: lowercase; }
      .digit, .mode, .digit > div, .mode > div { height: 100%; }
      .digit { grid-column: span 2; }
      .mode { grid-column: 7 / -1; }
    `,
  ];

  static getStubConfig(): KeypadConfig {
    return { type: "custom:rams-keypad", columns: 12, modes: ["disarm", "arm_home", "arm_away", "arm_night"] };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: { domain: "alarm_control_panel" } } },
        { name: "modes", selector: { select: { multiple: true, mode: "list", options: (Object.keys(MODE_LABEL) as Mode[]).map((value) => ({ value, label: MODE_LABEL[value] })) } } },
        layoutFields(),
      ],
      computeLabel,
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

  private key(label: string, cls: string, onTap: () => void, extra: Record<string, unknown> = {}): TemplateResult {
    return html`<div class=${cls} @click=${onTap}><rams-button .hass=${this.hass} .config=${{ type: "custom:rams-button", name: label, tap_action: NO_ACTION, ...extra }}></rams-button></div>`;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const state = (c.entity && this.hass?.states[c.entity]?.state) || "";
    const modes = c.modes ?? ["disarm", "arm_home", "arm_away", "arm_night"];
    const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const modeTone: Record<Mode, string> = { disarm: "neutral", arm_home: "neutral", arm_away: "red", arm_night: "blue" };
    return html`<div class="pad">
      <div class="screen">
        <div class="dots">${Array.from({ length: Math.max(4, this.code.length) }, (_, i) => html`<b class=${i < this.code.length ? "f" : ""}></b>`)}</div>
        <span class="state">${state.replace(/_/g, " ")}</span>
      </div>
      ${digits.map((d) => this.key(d, "digit", () => this.press(d), { shape: "round" }))}
      ${this.key("clr", "digit", () => (this.code = ""), { shape: "round", tone: "grey" })}
      ${this.key("0", "digit", () => this.press("0"), { shape: "round" })}
      ${this.key("⌫", "digit", () => (this.code = this.code.slice(0, -1)), { shape: "round" })}
      ${modes.map((m, i) => html`<div class="mode" style="grid-row: ${2 + i}">${this.key(MODE_LABEL[m], "", () => this.runMode(m), { tone: modeTone[m], selected_when: [] })}</div>`)}
    </div>`;
  }
}
