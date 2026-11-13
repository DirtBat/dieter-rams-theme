import { css, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { fireAction } from "../shared/actions";
import { tokens } from "../shared/styles";
import type { PieceConfig } from "../shared/types";

export interface ClockConfig extends PieceConfig {
  variant?: "analog" | "digital";
  seconds?: boolean;
  /** Toggle entity (e.g. an alarm switch): shows a small key on the clock, lit while on. */
  alarm_entity?: string;
}

@customElement("rams-clock")
export class RamsClock extends Piece<ClockConfig> {
  @state() private now = new Date();
  private timer?: number;

  static styles = [
    tokens,
    css`
      :host { display: block; height: 100%; min-width: 0; }
      .face { position: relative; box-sizing: border-box; height: 100%; display: grid; place-items: center; border-radius: 12px; border: var(--_border); box-shadow: var(--_raised); background: var(--_cap); }
      svg { height: 100%; max-width: 100%; aspect-ratio: 1; }
      .dots { stroke: var(--_ink); }
      .hand { stroke: var(--_ink); stroke-linecap: round; transform-origin: 60px 60px; }
      .sec { stroke: var(--_honey); transform-origin: 60px 60px; }
      .hub { fill: var(--_ink); }
      .digital { font-family: var(--rams-mono, ui-monospace, "SF Mono", Menlo, monospace); font-size: 30px; letter-spacing: 0.02em; }
      .key { position: absolute; top: -4px; right: 14%; width: 22%; height: 7px; border-radius: 2px; border: var(--_border); background: var(--_cap-dark); cursor: pointer; }
      .key.on { background: var(--_active); }
    `,
  ];

  static getStubConfig(): ClockConfig {
    return { type: "custom:rams-clock", variant: "analog", columns: 6, rows: 3 };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "variant", selector: { select: { mode: "dropdown", options: [{ value: "analog", label: "Analog" }, { value: "digital", label: "Digital" }] } } },
        { name: "seconds", selector: { boolean: {} } },
        { name: "alarm_entity", selector: { entity: { domain: ["input_boolean", "switch"] } } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } },
            { name: "rows", selector: { number: { min: 1, max: 6, mode: "box" } } },
          ],
        },
      ],
      computeLabel: (s: { name: string }) => s.name.replace(/_/g, " "),
    };
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.timer = window.setInterval(() => (this.now = new Date()), 1000);
  }
  disconnectedCallback(): void {
    window.clearInterval(this.timer);
    super.disconnectedCallback();
  }

  /** Wall-clock parts in the Home Assistant time zone (falls back to the browser's). */
  private parts() {
    const tz = this.hass?.config?.time_zone;
    const f = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "numeric", minute: "numeric", second: "numeric", hourCycle: "h23" });
    const p = Object.fromEntries(f.formatToParts(this.now).map((x) => [x.type, Number(x.value)]));
    return { h: p.hour ?? 0, m: p.minute ?? 0, s: p.second ?? 0 };
  }

  private toggleAlarm = (e: Event) => {
    e.stopPropagation();
    if (this.config?.alarm_entity) fireAction(this, { entity: this.config.alarm_entity, tap_action: { action: "toggle" } }, "tap");
  };

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const { h, m, s } = this.parts();
    const alarm = c.alarm_entity ? this.hass?.states[c.alarm_entity]?.state === "on" : false;
    const key = c.alarm_entity ? html`<div class="key ${alarm ? "on" : ""}" @click=${this.toggleAlarm}></div>` : nothing;
    if (c.variant === "digital") {
      const pad = (n: number) => String(n).padStart(2, "0");
      return html`<div class="face"><span class="digital">${pad(h)}:${pad(m)}${c.seconds ? `:${pad(s)}` : ""}</span>${key}</div>`;
    }
    const hourDeg = ((h % 12) + m / 60) * 30;
    const minDeg = (m + s / 60) * 6;
    return html`<div class="face">${svg`<svg viewBox="0 0 120 120">
      <circle class="dots" cx="60" cy="60" r="50" fill="none" stroke-width="4" stroke-linecap="round" stroke-dasharray="0 26.18" transform="rotate(-90 60 60)" />
      <line class="hand" x1="60" y1="60" x2="60" y2="38" stroke-width="6" style="transform: rotate(${hourDeg}deg)" />
      <line class="hand" x1="60" y1="60" x2="60" y2="22" stroke-width="5" style="transform: rotate(${minDeg}deg)" />
      ${c.seconds ? svg`<line class="sec" x1="60" y1="68" x2="60" y2="12" stroke-width="1.5" style="transform: rotate(${s * 6}deg)" />` : nothing}
      <circle class="hub" cx="60" cy="60" r="6" />
    </svg>`}${key}</div>`;
  }
}
