import { css, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { fireAction } from "../shared/actions";
import { tokens } from "../shared/styles";
import { faceStyles } from "../shared/face";
import { computeLabel, computeHelper, dropdown, layoutFields } from "../shared/form";
import type { PieceConfig } from "../shared/types";

export interface ClockConfig extends PieceConfig {
  variant?: "analog" | "digital";
  seconds?: boolean;
  /** Printed outside the clock, at `title_position` (default above). */
  title?: string;
  title_position?: "above" | "below" | "left" | "right";
  /** Toggle entity (e.g. an alarm switch): a small LED on the clock, lit while on; tap it to switch. */
  alarm_entity?: string;
}

@customElement("rams-clock")
export class RamsClock extends Piece<ClockConfig> {
  protected defaultFrame = "none" as const;
  /** The clock draws its own face, so a title can sit outside it. */
  protected hostFrame = false;
  @state() private now = new Date();
  private timer?: number;

  static styles = [
    tokens,
    faceStyles,
    css`
      .face { position: relative; display: grid; place-items: center; overflow: hidden; container-type: inline-size; }
      svg { height: 100%; max-width: 100%; aspect-ratio: 1; }
      .dots { stroke: var(--_ink); }
      .hand { stroke: var(--_ink); stroke-linecap: round; transform-origin: 60px 60px; }
      .sec { stroke: var(--_honey); transform-origin: 60px 60px; }
      .hub { fill: var(--_ink); }
      .digital { font-family: var(--rams-mono, ui-monospace, "SF Mono", Menlo, monospace); font-size: clamp(14px, 24cqw, 40px); letter-spacing: 0.02em; white-space: nowrap; }
      .digital.sec { font-size: clamp(12px, 15cqw, 34px); }
      /* the alarm lamp: dark glass, lit while the alarm is on */
      .led { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; padding: 0; border: 0; border-radius: 50%; background: var(--_lens); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.35); cursor: pointer; }
      .led.on { background: var(--_active); box-shadow: 0 0 max(var(--_glow), 5px) 1px color-mix(in srgb, var(--_active) 85%, transparent); }
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
        { name: "title", selector: { text: {} } },
        dropdown("title_position", [["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
        { name: "alarm_entity", selector: { entity: { domain: ["input_boolean", "switch"] } } },
        ...layoutFields(),
      ],
      computeLabel,
      computeHelper,
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
    const digital = c.variant === "digital";
    const alarm = c.alarm_entity ? this.hass?.states[c.alarm_entity]?.state === "on" : false;
    const led = c.alarm_entity ? html`<button class="led ${alarm ? "on" : ""}" aria-label="Alarm" @click=${this.toggleAlarm}></button>` : nothing;
    // A digital clock is a display: recessed by default. An analog one sits on the plate.
    const frame = c.frame ?? (digital ? "recessed" : this.defaultFrame);
    const pos = c.title ? (c.title_position ?? "above") : "";
    const hourDeg = ((h % 12) + m / 60) * 30;
    const minDeg = (m + s / 60) * 6;
    const pad = (n: number) => String(n).padStart(2, "0");
    const dial = digital
      ? html`<span class="digital ${c.seconds ? "sec" : ""}">${pad(h)}:${pad(m)}${c.seconds ? `:${pad(s)}` : ""}</span>`
      : svg`<svg viewBox="0 0 120 120">
      <circle class="dots" cx="60" cy="60" r="50" fill="none" stroke-width="3" stroke-linecap="round" stroke-dasharray="0 26.18" transform="rotate(-90 60 60)" />
      <line class="hand" x1="60" y1="60" x2="60" y2="38" stroke-width="4" style="transform: rotate(${hourDeg}deg)" />
      <line class="hand" x1="60" y1="60" x2="60" y2="22" stroke-width="3" style="transform: rotate(${minDeg}deg)" />
      ${c.seconds ? svg`<line class="sec" x1="60" y1="68" x2="60" y2="12" stroke-width="1" style="transform: rotate(${s * 6}deg)" />` : nothing}
      <circle class="hub" cx="60" cy="60" r="4.5" />
    </svg>`;
    return html`<div class="wrap ${pos}">
      ${pos ? html`<span class="outer">${c.title}</span>` : nothing}
      <div class="face ${frame === "none" ? "" : frame}">${dial}${led}</div>
    </div>`;
  }
}
