import { css, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { clamp, defaultRange, readNumber, writeNumber } from "../shared/entity-value";
import { tokens } from "../shared/styles";
import { computeLabel, computeHelper, dropdown, layoutFields } from "../shared/form";
import type { PieceConfig } from "../shared/types";

export interface RulerConfig extends PieceConfig {
  entity?: string;
  attribute?: string;
  /** Horizontal (default) or vertical: the lowest value at the bottom. */
  orientation?: "horizontal" | "vertical";
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
      /* vertical: the same scale turned up, lowest value at the bottom */
      .wrap.v { flex-direction: row; align-items: stretch; justify-content: center; gap: 6px; }
      .v .track { width: 24px; height: auto; flex: none; }
      .v .line { left: 50%; right: auto; top: 0; bottom: 0; width: 1px; height: auto; }
      .v .tick { left: 50%; top: auto; width: 6px; height: 1px; transform: translateX(-50%); }
      .v .tick.major { width: 12px; height: 1px; }
      .v .bar { left: 50%; top: auto; width: 4px; height: auto; transform: translateX(-50%); }
      .v .pointer { left: 2px; right: 2px; top: auto; width: auto; height: 3px; margin: 0 0 -1.5px 0; }
      .v .target { left: 0; top: auto; width: 8px; height: 3px; margin: 0 0 -1.5px 0; }
      .v .labels { flex-direction: column-reverse; align-items: flex-start; }
    `,
  ];

  static getStubConfig(): RulerConfig {
    return { type: "custom:rams-ruler", labels: true };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "attribute", selector: { attribute: {} }, context: { filter_entity: "entity" } },
        { name: "target_entity", selector: { entity: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "min", selector: { number: { step: "any", mode: "box" } } },
            { name: "max", selector: { number: { step: "any", mode: "box" } } },
            { name: "step", selector: { number: { step: "any", mode: "box" } } },
            { name: "unit", selector: { text: {} } },
          ],
        },
        dropdown("orientation", [["horizontal", "Horizontal"], ["vertical", "Vertical"]]),
        { name: "centre", selector: { boolean: {} } },
        { name: "labels", selector: { boolean: {} } },
        { name: "interactive", selector: { boolean: {} } },
        ...layoutFields(),
      ],
      computeLabel,
      computeHelper,
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
    const f = this.config?.orientation === "vertical"
      ? Math.min(1, Math.max(0, 1 - (e.clientY - box.top) / box.height))
      : Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
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
    const vertical = c.orientation === "vertical";
    const pct = (x: number) => `${x * 100}%`;
    // along the scale: left for horizontal, bottom for vertical
    const at = (x: number) => `${vertical ? "bottom" : "left"}:${pct(x)}`;
    const bar = f === undefined || !c.centre ? nothing
      : html`<div class="bar" style="${at(Math.min(f, 0.5))};${vertical ? "height" : "width"}:${pct(Math.abs(f - 0.5))}"></div>`;
    return html`<div class="wrap ${vertical ? "v" : ""}">
      <div class="track ${c.interactive ? "interactive" : ""}" @pointerdown=${this.onDown} @pointermove=${this.onMove} @pointerup=${this.onUp} @pointercancel=${this.onUp}>
        <div class="line"></div>
        ${ticks.map((t) => html`<div class="tick ${t === 0 || t === 0.5 || t === 1 ? "major" : ""}" style="${at(t)}"></div>`)}
        ${bar}
        ${tf === undefined ? nothing : html`<div class="target" style="${at(tf)}"></div>`}
        ${f === undefined || c.centre ? nothing : html`<div class="pointer" style="${at(f)}"></div>`}
      </div>
      ${c.labels ? html`<div class="labels"><span>${this.fmt(min)}</span>${c.centre ? html`<span>${this.fmt(0)}</span>` : nothing}<span>${this.fmt(max)}</span></div>` : nothing}
    </div>`;
  }
}
