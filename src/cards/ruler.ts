import { css, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { clamp, defaultRange, readNumber, writeNumber } from "../shared/entity-value";
import { tokens } from "../shared/styles";
import { computeLabel, computeHelper, dropdown, layoutFields, num } from "../shared/form";
import type { PieceConfig } from "../shared/types";

export interface RulerConfig extends PieceConfig {
  entity?: string;
  /** Several entities as one: the ruler shows the first that is playing (else the first), and a touch sets the value on all of them. Replaces entity. */
  entities?: string[];
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
  /** A fixed value, used when no entity is set. */
  value?: number;
  /** Distance between the small tick marks. Empty: twenty steps over the scale. */
  interval?: number;
  /** Distance between the thick tick marks, counted from the minimum. Empty: first, middle and last. */
  major?: number;
  /** Printed with the ruler: above, below, left or right of it. */
  title?: string;
  title_position?: "above" | "below" | "left" | "right";
  /** The value as a number under the scale. */
  number?: boolean;
  /** Where that number sits. */
  align?: "start" | "center" | "end";
}

@customElement("rams-ruler")
export class RamsRuler extends Piece<RulerConfig> {
  @state() private drag?: number;

  static styles = [
    tokens,
    css`
      :host { display: block; height: 100%; min-width: 0; }
      .t { height: 100%; display: flex; flex-direction: column; gap: 5px; min-width: 0; }
      .t.below { flex-direction: column-reverse; }
      .t.left { flex-direction: row; align-items: center; } .t.right { flex-direction: row-reverse; align-items: center; }
      .t > .wrap { flex: 1; min-width: 0; min-height: 0; }
      .outer { flex: none; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--_muted); text-align: center; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .left .outer, .right .outer { max-width: 40%; }
      .num { font-size: 12px; color: var(--_ink); line-height: 1.1; }
      .num.start { text-align: left; } .num.center { text-align: center; } .num.end { text-align: right; }
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
        { name: "entities", selector: { entity: { multiple: true } } },
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
        {
          type: "grid",
          name: "",
          schema: [
            num("value", undefined, undefined, { step: "any" }),
            num("interval", undefined, undefined, { step: "any" }),
            num("major", undefined, undefined, { step: "any" }),
            { name: "title", selector: { text: {} } },
            dropdown("title_position", [["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
            dropdown("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]]),
          ],
        },
        dropdown("orientation", [["horizontal", "Horizontal"], ["vertical", "Vertical"]]),
        { name: "number", selector: { boolean: {} } },
        { name: "centre", selector: { boolean: {} } },
        { name: "labels", selector: { boolean: {} } },
        { name: "interactive", selector: { boolean: {} } },
        ...layoutFields(),
      ],
      computeLabel,
      computeHelper,
    };
  }

  /** The entities the ruler stands for. */
  private all(): string[] {
    const c = this.config;
    return c?.entities?.length ? c.entities : c?.entity ? [c.entity] : [];
  }

  /** The one whose value is shown: the first that is playing or on, else the first. */
  private lead(): string | undefined {
    const list = this.all();
    return list.find((e) => ["playing", "paused", "buffering", "on"].includes(this.hass?.states[e]?.state ?? "")) ?? list[0];
  }

  private range() {
    const c = this.config!;
    const d = defaultRange(this.hass, this.lead());
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
    if (this.drag !== undefined && this.hass) for (const e of this.all()) void writeNumber(this.hass, e, this.drag);
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
    const value = this.drag ?? (this.all().length ? readNumber(this.hass, this.lead(), c.attribute) : c.value);
    const f = this.frac(value, min, max);
    const tf = this.frac(readNumber(this.hass, c.target_entity, c.target_attribute), min, max);
    const span = max - min;
    const steps = c.interval && c.interval > 0 && span > 0 ? Math.min(200, Math.max(1, Math.round(span / c.interval))) : 20;
    const ticks = Array.from({ length: steps + 1 }, (_, i) => i / steps);
    const isMajor = (t: number) => (c.major && c.major > 0 ? Math.abs(Math.round((t * span) / c.major) * c.major - t * span) < span * 1e-6 || t === 0 || t === 1 : t === 0 || t === 0.5 || t === 1);
    const vertical = c.orientation === "vertical";
    const pct = (x: number) => `${x * 100}%`;
    // along the scale: left for horizontal, bottom for vertical
    const at = (x: number) => `${vertical ? "bottom" : "left"}:${pct(x)}`;
    const bar = f === undefined || !c.centre ? nothing
      : html`<div class="bar" style="${at(Math.min(f, 0.5))};${vertical ? "height" : "width"}:${pct(Math.abs(f - 0.5))}"></div>`;
    const title = c.title?.trim() ?? "";
    const ruler = html`<div class="wrap ${vertical ? "v" : ""}">
      <div class="track ${c.interactive ? "interactive" : ""}" @pointerdown=${this.onDown} @pointermove=${this.onMove} @pointerup=${this.onUp} @pointercancel=${this.onUp}>
        <div class="line"></div>
        ${ticks.map((t) => html`<div class="tick ${isMajor(t) ? "major" : ""}" style="${at(t)}"></div>`)}
        ${bar}
        ${tf === undefined ? nothing : html`<div class="target" style="${at(tf)}"></div>`}
        ${f === undefined || c.centre ? nothing : html`<div class="pointer" style="${at(f)}"></div>`}
      </div>
      ${c.number && value !== undefined ? html`<div class="num ${c.align ?? "center"}">${this.fmt(value)}</div>` : nothing}
      ${c.labels ? html`<div class="labels"><span>${this.fmt(min)}</span>${c.centre ? html`<span>${this.fmt(0)}</span>` : nothing}<span>${this.fmt(max)}</span></div>` : nothing}
    </div>`;
    return title ? html`<div class="t ${c.title_position ?? "above"}"><span class="outer">${title}</span>${ruler}</div>` : ruler;
  }
}
