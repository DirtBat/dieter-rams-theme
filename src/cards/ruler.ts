import { css, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { clamp, defaultRange, readNumber, writeNumber } from "../shared/entity-value";
import { tokens } from "../shared/styles";
import type { PieceConfig } from "../shared/types";

export interface RulerConfig extends PieceConfig {
  entity?: string;
  attribute?: string;
  min?: number;
  max?: number;
  step?: number;
  /** Zero (or the middle) is at the centre; the value is drawn as a bar from the centre. */
  centre?: boolean;
  /** A second mark, e.g. the target next to the measured value. */
  target_entity?: string;
  target_attribute?: string;
  /** Tap or drag on the scale sets the value on the entity. */
  interactive?: boolean;
  /** Show min / middle / max under the scale. */
  labels?: boolean;
  unit?: string;
}

@customElement("rams-ruler")
export class RamsRuler extends Piece<RulerConfig> {
  @state() private drag?: number;

  static styles = [
    tokens,
    css`
      :host { display: block; height: 100%; min-width: 0; }
      .wrap { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 4px; padding: 0 2px; }
      .track { position: relative; height: 24px; touch-action: none; }
      .track.interactive { cursor: pointer; }
      .line { position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: var(--_muted); }
      .tick { position: absolute; top: 50%; width: 1px; height: 6px; background: var(--_muted); transform: translateY(-50%); }
      .tick.major { height: 12px; }
      .bar { position: absolute; top: 50%; height: 4px; transform: translateY(-50%); background: var(--_ink); }
      .pointer { position: absolute; top: 2px; bottom: 2px; width: 3px; margin-left: -1.5px; background: var(--_active); }
      .target { position: absolute; top: 0; height: 8px; width: 3px; margin-left: -1.5px; background: var(--_honey, var(--_muted)); }
      .labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--_muted); }
    `,
  ];

  static getStubConfig(): RulerConfig {
    return { type: "custom:rams-ruler", labels: true };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "attribute", selector: { attribute: {} } },
        { name: "target_entity", selector: { entity: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "min", selector: { number: { step: "any", mode: "box" } } },
            { name: "max", selector: { number: { step: "any", mode: "box" } } },
            { name: "step", selector: { number: { step: "any", mode: "box" } } },
            { name: "unit", selector: { text: {} } },
            { name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } },
            { name: "rows", selector: { number: { min: 1, max: 6, mode: "box" } } },
          ],
        },
        { name: "centre", selector: { boolean: {} } },
        { name: "labels", selector: { boolean: {} } },
        { name: "interactive", selector: { boolean: {} } },
      ],
      computeLabel: (s: { name: string }) => s.name.replace(/_/g, " "),
    };
  }

  private range() {
    const c = this.config!;
    const d = defaultRange(this.hass, c.entity);
    return { min: c.min ?? d.min, max: c.max ?? d.max, step: c.step ?? d.step };
  }

  private frac(v: number | undefined, min: number, max: number): number | undefined {
    return v === undefined ? undefined : Math.min(1, Math.max(0, (v - min) / (max - min)));
  }

  private fromPointer(e: PointerEvent, el: HTMLElement) {
    const r = this.range();
    const box = el.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
    return clamp(r.min + f * (r.max - r.min), r);
  }

  private onDown = (e: PointerEvent) => {
    if (!this.config?.interactive) return;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    this.drag = this.fromPointer(e, el);
  };
  private onMove = (e: PointerEvent) => {
    if (this.drag === undefined) return;
    this.drag = this.fromPointer(e, e.currentTarget as HTMLElement);
  };
  private onUp = () => {
    const c = this.config;
    if (this.drag !== undefined && c?.entity && this.hass) void writeNumber(this.hass, c.entity, this.drag);
    this.drag = undefined;
  };

  private fmt(v: number): string {
    const s = Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100);
    return `${v > 0 && this.config?.centre ? "+" : ""}${s}${this.config?.unit ?? ""}`;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const { min, max } = this.range();
    const value = this.drag ?? readNumber(this.hass, c.entity, c.attribute);
    const f = this.frac(value, min, max);
    const tf = this.frac(readNumber(this.hass, c.target_entity, c.target_attribute), min, max);
    const ticks = Array.from({ length: 21 }, (_, i) => i / 20);
    const pct = (x: number) => `${x * 100}%`;
    const bar = f === undefined ? nothing : c.centre ? html`<div class="bar" style="left:${pct(Math.min(f, 0.5))};width:${pct(Math.abs(f - 0.5))}"></div>` : nothing;
    return html`<div class="wrap">
      <div class="track ${c.interactive ? "interactive" : ""}" @pointerdown=${this.onDown} @pointermove=${this.onMove} @pointerup=${this.onUp} @pointercancel=${this.onUp}>
        <div class="line"></div>
        ${ticks.map((t) => html`<div class="tick ${t === 0 || t === 0.5 || t === 1 ? "major" : ""}" style="left:${pct(t)}"></div>`)}
        ${bar}
        ${tf === undefined ? nothing : html`<div class="target" style="left:${pct(tf)}"></div>`}
        ${f === undefined || c.centre ? nothing : html`<div class="pointer" style="left:${pct(f)}"></div>`}
      </div>
      ${c.labels ? html`<div class="labels"><span>${this.fmt(min)}</span>${c.centre ? html`<span>${this.fmt(0)}</span>` : nothing}<span>${this.fmt(max)}</span></div>` : nothing}
    </div>`;
  }
}
