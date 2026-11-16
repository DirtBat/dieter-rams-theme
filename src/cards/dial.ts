import { css, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { clamp, readNumber, writeNumber } from "../shared/entity-value";
import { tokens } from "../shared/styles";
import { computeLabel, computeHelper, layoutFields, num } from "../shared/form";
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
  /** The scale's first and last angle in degrees: 0 is straight up, positive is clockwise. -90 to 90 is a horizontal VU style arc, 30 to 150 a vertical one on the right. */
  start_angle?: number;
  end_angle?: number;
  /** Tap or drag on the scale sets the value on the entity. */
  interactive?: boolean;
}

const R = 72;
const rad = (deg: number) => (deg * Math.PI) / 180;
/** Point on a circle around the centre (0, 0); angle 0 is up, clockwise. */
const at = (deg: number, r: number): [number, number] => [r * Math.sin(rad(deg)), -r * Math.cos(rad(deg))];

/** A scale on any arc with a floating needle. No centre knob: the whole arc is the touch target. */
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
    return { type: "custom:rams-dial", min: 0, max: 100, interval: 10, value: 40, start_angle: -90, end_angle: 90, columns: 6, rows: 3 };
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
            num("start_angle", -360, 360, { step: 5 }),
            num("end_angle", -360, 360, { step: 5 }),
            { name: "unit", selector: { text: {} } },
            { name: "label", selector: { text: {} } },
          ],
        },
        { name: "interactive", selector: { boolean: {} } },
        ...layoutFields(),
      ],
      computeLabel,
      computeHelper,
    };
  }

  private range() {
    const c = this.config!;
    return { min: c.min ?? 0, max: c.max ?? 100, step: c.interval ?? 1 };
  }

  /** Start and end angle; the end is always after the start and the arc at most a full circle. */
  private angles(): [number, number] {
    const c = this.config!;
    const start = c.start_angle ?? -90;
    const end = c.end_angle ?? 90;
    return [start, Math.min(start + 360, Math.max(start + 1, end))];
  }

  private at(f: number, r: number): [number, number] {
    const [a0, a1] = this.angles();
    return at(a0 + f * (a1 - a0), r);
  }

  /** The drawing area: the arc, the end labels and the centre text, whatever the angles are. */
  private box(): [number, number, number, number] {
    const [a0, a1] = this.angles();
    const pts: Array<[number, number]> = [at(a0, R + 14), at(a1, R + 14), [0, 34 + (this.config?.unit ? 12 : 0)]];
    for (let a = Math.ceil(a0 / 90) * 90; a <= a1; a += 90) pts.push(at(a, R + 4));
    if (this.config?.label) pts.push([0, -R - 16]);
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs) - 4, y0 = Math.min(...ys) - 4;
    return [x0 - 8, y0, Math.max(...xs) + 4 - x0 + 16, Math.max(...ys) + 4 - y0];
  }

  private fromPointer(e: PointerEvent): number {
    const el = e.currentTarget as SVGElement;
    const rect = el.getBoundingClientRect();
    const [bx, by, bw, bh] = this.box();
    const k = Math.min(rect.width / bw, rect.height / bh);
    const px = (e.clientX - (rect.left + (rect.width - bw * k) / 2)) / k + bx;
    const py = (e.clientY - (rect.top + (rect.height - bh * k) / 2)) / k + by;
    const [a0, a1] = this.angles();
    let a = (Math.atan2(px, -py) * 180) / Math.PI; // 0 up, clockwise
    while (a < a0) a += 360;
    while (a >= a0 + 360) a -= 360;
    if (a > a1) a = a - a1 < a0 + 360 - a ? a1 : a0; // in the gap: nearer end
    const r = this.range();
    return clamp(r.min + ((a - a0) / (a1 - a0)) * (r.max - r.min), r);
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
    const [a0, a1] = this.angles();
    const value = this.drag ?? (c.entity ? readNumber(this.hass, c.entity, c.attribute) : c.value);
    const f = value === undefined ? undefined : Math.min(1, Math.max(0, (value - min) / (max - min)));
    const count = Math.min(60, Math.max(1, Math.round((max - min) / step)));
    const ticks = Array.from({ length: count + 1 }, (_, i) => i / count);
    const shown = value === undefined ? "\u2013" : String(Math.round(value * 10) / 10);
    const [x0, y0, w, h] = this.box();
    const [sx, sy] = at(a0, R), [ex, ey] = at(a1, R);
    const large = a1 - a0 > 180 ? 1 : 0;
    const endLabel = (a: number, text: number) => {
      const [x, y] = at(a, R + 12);
      const s = Math.sin(rad(a));
      return svg`<text class="end" x=${x} y=${y + 3} text-anchor=${s > 0.4 ? "start" : s < -0.4 ? "end" : "middle"}>${text}</text>`;
    };
    return html`<svg viewBox="${x0} ${y0} ${w} ${h}" class=${c.interactive ? "interactive" : ""} @pointerdown=${this.onDown} @pointermove=${this.onMove} @pointerup=${this.onUp} @pointercancel=${this.onUp}>
      ${svg`<path class="arc" d="M ${sx} ${sy} A ${R} ${R} 0 ${large} 1 ${ex} ${ey}" />
      ${ticks.map((t, i) => {
        const major = i === 0 || i === count || (count % 2 === 0 && i === count / 2);
        const [x1, y1] = this.at(t, R);
        const [x2, y2] = this.at(t, R - (major ? 12 : 7));
        return svg`<line class="tick ${major ? "major" : ""}" x1=${x1} y1=${y1} x2=${x2} y2=${y2} />`;
      })}
      ${f === undefined ? nothing : svg`<line class="needle" x1=${this.at(f, R * 0.5)[0]} y1=${this.at(f, R * 0.5)[1]} x2=${this.at(f, R - 6)[0]} y2=${this.at(f, R - 6)[1]} />`}
      ${endLabel(a0, min)}${endLabel(a1, max)}
      <text class="num" x="0" y="26">${shown}</text>
      ${c.unit ? svg`<text class="unit" x="0" y="38">${c.unit}</text>` : nothing}
      ${c.label ? svg`<text class="lab" x="0" y=${-R - 8}>${c.label}</text>` : nothing}`}
    </svg>`;
  }
}
