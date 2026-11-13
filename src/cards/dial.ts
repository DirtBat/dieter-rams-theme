import { css, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { clamp, readNumber, writeNumber } from "../shared/entity-value";
import { tokens } from "../shared/styles";
import { computeLabel, layoutFields, num } from "../shared/form";
import type { PieceConfig } from "../shared/types";

export interface DialConfig extends PieceConfig {
  /** Value from an entity (a sensor, or a helper) ... */
  entity?: string;
  attribute?: string;
  /** ... or a fixed value. */
  value?: number;
  min?: number;
  max?: number;
  /** Distance between tick marks, and the step when set by touch. */
  interval?: number;
  unit?: string;
  label?: string;
  /** Tap or drag on the scale sets the value on the entity. */
  interactive?: boolean;
}

const CX = 100, CY = 90, R = 72;

/** A half-round scale with a needle. No centre knob: the whole arc is the touch target. */
@customElement("rams-dial")
export class RamsDial extends Piece<DialConfig> {
  @state() private drag?: number;

  static styles = [
    tokens,
    css`
      svg { display: block; width: 100%; height: 100%; touch-action: none; }
      .arc { fill: none; stroke: var(--_muted); stroke-width: 1; }
      .tick { stroke: var(--_muted); stroke-width: 1; }
      .tick.major { stroke: var(--_ink); stroke-width: 1.5; }
      .needle { stroke: var(--_red); stroke-width: 3; stroke-linecap: round; }
      .num { fill: var(--_ink); font-size: 22px; text-anchor: middle; }
      .unit, .lab, .end { fill: var(--_muted); font-size: 9px; letter-spacing: 0.06em; text-anchor: middle; text-transform: uppercase; }
      .interactive { cursor: pointer; }
    `,
  ];

  static getStubConfig(): DialConfig {
    return { type: "custom:rams-dial", min: 0, max: 100, interval: 10, value: 40, columns: 6, rows: 3 };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "attribute", selector: { attribute: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            num("value", undefined, undefined, { step: "any" }),
            num("min", undefined, undefined, { step: "any" }),
            num("max", undefined, undefined, { step: "any" }),
            num("interval", undefined, undefined, { step: "any" }),
            { name: "unit", selector: { text: {} } },
            { name: "label", selector: { text: {} } },
          ],
        },
        { name: "interactive", selector: { boolean: {} } },
        layoutFields(),
      ],
      computeLabel,
    };
  }

  private range() {
    const c = this.config!;
    return { min: c.min ?? 0, max: c.max ?? 100, step: c.interval ?? 1 };
  }

  private point(f: number, r: number): [number, number] {
    const a = Math.PI * (1 - f);
    return [CX + r * Math.cos(a), CY - r * Math.sin(a)];
  }

  private fromPointer(e: PointerEvent): number {
    const box = (e.currentTarget as SVGElement).getBoundingClientRect();
    const k = Math.min(box.width / 200, box.height / 134);
    const px = (e.clientX - (box.left + (box.width - 200 * k) / 2)) / k;
    const py = (e.clientY - (box.top + (box.height - 134 * k) / 2)) / k;
    const a = Math.min(Math.PI, Math.max(0, Math.atan2(CY - py, px - CX)));
    const r = this.range();
    return clamp(r.min + (1 - a / Math.PI) * (r.max - r.min), r);
  }

  private onDown = (e: PointerEvent) => {
    if (!this.config?.interactive) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    this.drag = this.fromPointer(e);
  };
  private onMove = (e: PointerEvent) => {
    if (this.drag !== undefined) this.drag = this.fromPointer(e);
  };
  private onUp = () => {
    const c = this.config;
    if (this.drag !== undefined && c?.entity && this.hass) void writeNumber(this.hass, c.entity, this.drag);
    this.drag = undefined;
  };

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const { min, max, step } = this.range();
    const value = this.drag ?? (c.entity ? readNumber(this.hass, c.entity, c.attribute) : c.value);
    const f = value === undefined ? undefined : Math.min(1, Math.max(0, (value - min) / (max - min)));
    const count = Math.min(60, Math.max(1, Math.round((max - min) / step)));
    const ticks = Array.from({ length: count + 1 }, (_, i) => i / count);
    const shown = value === undefined ? "–" : String(Math.round(value * 10) / 10);
    const [nx, ny] = f === undefined ? [CX, CY] : this.point(f, R - 6);
    return html`<svg viewBox="0 0 200 134" class=${c.interactive ? "interactive" : ""} @pointerdown=${this.onDown} @pointermove=${this.onMove} @pointerup=${this.onUp} @pointercancel=${this.onUp}>
      ${svg`<path class="arc" d="M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}" />
      ${ticks.map((t, i) => {
        const major = i === 0 || i === count || (count % 2 === 0 && i === count / 2);
        const [x1, y1] = this.point(t, R);
        const [x2, y2] = this.point(t, R - (major ? 12 : 7));
        return svg`<line class="tick ${major ? "major" : ""}" x1=${x1} y1=${y1} x2=${x2} y2=${y2} />`;
      })}
      ${f === undefined ? nothing : svg`<line class="needle" x1=${CX} y1=${CY} x2=${nx} y2=${ny} />`}
      <text class="end" x=${CX - R} y=${CY + 12}>${min}</text>
      <text class="end" x=${CX + R} y=${CY + 12}>${max}</text>
      <text class="num" x=${CX} y=${CY + 28}>${shown}</text>
      ${c.unit ? svg`<text class="unit" x=${CX} y=${CY + 40}>${c.unit}</text>` : nothing}
      ${c.label ? svg`<text class="lab" x=${CX} y="10">${c.label}</text>` : nothing}`}
    </svg>`;
  }
}
