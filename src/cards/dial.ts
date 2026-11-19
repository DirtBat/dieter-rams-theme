import { css, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { clamp, readNumber, writeNumber } from "../shared/entity-value";
import { tokens } from "../shared/styles";
import { faceStyles } from "../shared/face";
import { computeLabel, computeHelper, dropdown, layoutFields, num } from "../shared/form";
import type { PieceConfig } from "../shared/types";

export interface DialConfig extends PieceConfig {
  /** Value from an entity (a sensor, or a helper) ... */
  entity?: string;
  attribute?: string;
  /** ... or a fixed value. */
  value?: number;
  min?: number;
  max?: number;
  /** Distance between the small tick marks, and the step when set by touch. */
  interval?: number;
  /** Distance between the thick tick marks. Empty: only the first and the last. */
  major?: number;
  unit?: string;
  /** Printed with the dial: inside the arc (default), or above, below, left or right of it. */
  title?: string;
  title_position?: "inside" | "above" | "below" | "left" | "right";
  /** Earlier name of title. */
  label?: string;
  /** The number under the scale: shown (default) or not, when the red mark says enough. */
  show?: "all" | "none";
  /** Where the number sits under the scale. */
  align?: "start" | "center" | "end";
  /** The scale's first and last angle in degrees: 0 is straight up, positive is clockwise. -90 to 90 is a horizontal VU style arc, 30 to 150 a vertical one on the right. */
  start_angle?: number;
  end_angle?: number;
  /** Tap or drag on the scale sets the value on the entity. */
  interactive?: boolean;
}

const rad = (deg: number) => (deg * Math.PI) / 180;
/** Point on a circle around the centre (0, 0); angle 0 is up, clockwise. */
const at = (deg: number, r: number): [number, number] => [r * Math.sin(rad(deg)), -r * Math.cos(rad(deg))];

/** Drawn in pixels, so text and marks keep their size and only the radius follows the room. */
const MINOR = 7;
const MAJOR = 12;
const MARK_OUT = 4;
const MARK_IN = 14;
const NUMBER_H = 28;
const END_GAP = 8;

/** A scale on any arc with one red mark at the value. The arc is as large as the room allows; the number sits right under it. */
@customElement("rams-dial")
export class RamsDial extends Piece<DialConfig> {
  @state() private drag?: number;
  @state() private room = { w: 0, h: 0 };
  private watcher?: ResizeObserver;
  private watched?: Element;
  /** Where the svg's top left sits in dial coordinates, for touch. */
  private origin: [number, number] = [0, 0];

  static styles = [
    tokens,
    faceStyles,
    css`
      :host([frame="recessed"]) { background: var(--_lcd-bg); color: var(--_lcd-ink); --_ink: var(--_lcd-ink); --_muted: var(--_lcd-muted); }
      .dial { height: 100%; min-height: 72px; }
      .room { box-sizing: border-box; height: 100%; padding: 4px 0; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
      svg { display: block; flex: none; width: 100%; touch-action: none; }
      .face { display: block; }
      .arc { fill: none; stroke: var(--_muted); stroke-width: 1.5; }
      .tick { stroke: var(--_muted); stroke-width: 1.5; }
      .tick.major { stroke: var(--_ink); stroke-width: 2.5; }
      .mark { stroke: var(--_red); stroke-width: 3.5; stroke-linecap: butt; }
      .unit, .lab, .end { fill: var(--_muted); letter-spacing: 0.06em; text-transform: uppercase; }
      .lab { font-size: 10px; text-anchor: middle; }
      .num { flex: none; box-sizing: border-box; height: ${NUMBER_H}px; margin-top: 4px; padding: 0 2px; display: flex; align-items: baseline; justify-content: center; gap: 3px; font-size: 24px; line-height: ${NUMBER_H}px; color: var(--_ink); }
      .num.start { justify-content: flex-start; } .num.end { justify-content: flex-end; }
      .num small { font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
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
        { name: "attribute", selector: { attribute: {} }, context: { filter_entity: "entity" } },
        {
          type: "grid",
          name: "",
          schema: [
            num("value", undefined, undefined, { step: "any" }),
            num("min", undefined, undefined, { step: "any" }),
            num("max", undefined, undefined, { step: "any" }),
            num("interval", undefined, undefined, { step: "any" }),
            num("major", undefined, undefined, { step: "any" }),
            num("start_angle", -360, 360, { step: 5 }),
            num("end_angle", -360, 360, { step: 5 }),
            { name: "unit", selector: { text: {} } },
            { name: "title", selector: { text: {} } },
            dropdown("title_position", [["inside", "Inside"], ["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
            dropdown("show", [["all", "Scale and number"], ["none", "Scale only"]]),
            dropdown("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]]),
          ],
        },
        { name: "interactive", selector: { boolean: {} } },
        ...layoutFields(),
      ],
      computeLabel,
      computeHelper,
    };
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.watcher?.disconnect();
    this.watcher = this.watched = undefined;
  }

  protected updated(): void {
    const el = this.renderRoot.querySelector(".room");
    if (!el || el === this.watched) return;
    this.watcher ??= new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width), h = Math.round(e.contentRect.height);
      if (w !== this.room.w || h !== this.room.h) this.room = { w, h };
    });
    if (this.watched) this.watcher.unobserve(this.watched);
    this.watcher.observe(el);
    this.watched = el;
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

  private text(): string {
    return (this.config?.title ?? this.config?.label ?? "").trim();
  }

  private inside(): boolean {
    return !this.config?.title_position || this.config.title_position === "inside";
  }

  /** Text size of the end numbers: it follows the dial a little, within limits. */
  private endSize(r: number): number {
    return Math.min(13, Math.max(10, r * 0.13));
  }

  /** The bounding box of everything drawn at radius r: the arc, the marks, the end numbers, an inside title. */
  private bounds(r: number): [number, number, number, number] {
    const [a0, a1] = this.angles();
    const { min, max } = this.range();
    const fs = this.endSize(r);
    const pts: Array<[number, number]> = [];
    const angles = [a0, a1];
    for (let a = Math.ceil(a0 / 90) * 90; a < a1; a += 90) angles.push(a);
    for (let a = a0; a < a1; a += 5) angles.push(a);
    for (const a of angles) {
      pts.push(at(a, r + MARK_OUT), at(a, r - MAJOR));
    }
    const label = (a: number, value: number) => {
      const [x, y] = at(a, r + END_GAP);
      const sin = Math.sin(rad(a));
      const w = String(value).length * fs * 0.62;
      const left = sin > 0.4 ? x : sin < -0.4 ? x - w : x - w / 2;
      pts.push([left, y - fs * 0.65], [left + w, y + fs * 0.35]);
    };
    label(a0, min);
    label(a1, max);
    const title = this.inside() ? this.text() : "";
    if (title) {
      const top = Math.min(...pts.map((p) => p[1]));
      const cx = (at(a0, r)[0] + at(a1, r)[0]) / 2;
      const w = title.length * 6.4;
      pts.push([cx - w / 2, top - 18], [cx + w / 2, top - 8]);
    }
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  }

  /** The largest radius whose drawing fits the room. */
  private radius(w: number, h: number): number {
    let lo = 12, hi = 4000;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      const [x0, y0, x1, y1] = this.bounds(mid);
      if (x1 - x0 <= w && y1 - y0 <= h) lo = mid;
      else hi = mid;
    }
    return lo;
  }

  private fromPointer(e: PointerEvent): number {
    const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
    const px = e.clientX - rect.left + this.origin[0];
    const py = e.clientY - rect.top + this.origin[1];
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

  /** The scale, in a room of w x h pixels (the number's line already taken off). */
  private scale(w: number, h: number, value: number | undefined): { svg: TemplateResult; height: number } {
    const c = this.config!;
    const { min, max, step } = this.range();
    const [a0, a1] = this.angles();
    const r = this.radius(w, h);
    const [bx0, by0, bx1, by1] = this.bounds(r);
    const height = Math.ceil(by1 - by0) + 4;
    const vx = (bx0 + bx1) / 2 - w / 2, vy = by0 - 2;
    this.origin = [vx, vy];
    const span = max - min;
    const frac = (v: number) => (v - min) / span;
    const count = Math.min(100, Math.max(1, Math.round(span / step)));
    const majors: number[] = [0, 1];
    if (c.major && c.major > 0) for (let v = min + c.major; v < max - span * 1e-6; v += c.major) majors.push(frac(v));
    const isMajor = (f: number) => majors.some((m) => Math.abs(m - f) < 1e-6);
    const minors = Array.from({ length: count + 1 }, (_, i) => i / count).filter((f) => !isMajor(f));
    const tick = (f: number, len: number, cls: string) => {
      const [x1, y1] = this.at(f, r);
      const [x2, y2] = this.at(f, r - len);
      return svg`<line class="tick ${cls}" x1=${x1} y1=${y1} x2=${x2} y2=${y2} />`;
    };
    const [sx, sy] = at(a0, r), [ex, ey] = at(a1, r);
    const large = a1 - a0 > 180 ? 1 : 0;
    const fs = this.endSize(r);
    const endLabel = (a: number, text: number) => {
      const [x, y] = at(a, r + END_GAP);
      const s = Math.sin(rad(a));
      return svg`<text class="end" style="font-size:${fs}px" x=${x} y=${y + fs * 0.35} text-anchor=${s > 0.4 ? "start" : s < -0.4 ? "end" : "middle"}>${text}</text>`;
    };
    const top = Math.min(...[a0, a1, ...[...Array(4).keys()].map((k) => k * 90).filter((a) => a > a0 && a < a1)].map((a) => at(a, r + MARK_OUT)[1]));
    const f = value === undefined ? undefined : Math.min(1, Math.max(0, frac(value)));
    const [m1x, m1y] = f === undefined ? [0, 0] : this.at(f, r + MARK_OUT);
    const [m2x, m2y] = f === undefined ? [0, 0] : this.at(f, r - MARK_IN);
    return {
      height,
      svg: html`<svg viewBox="${vx} ${vy} ${w} ${height}" style="height:${height}px" class=${c.interactive ? "interactive" : ""} @pointerdown=${this.onDown} @pointermove=${this.onMove} @pointerup=${this.onUp} @pointercancel=${this.onUp}>
        ${svg`<path class="arc" d="M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}" />
        ${minors.map((t) => tick(t, MINOR, ""))}
        ${majors.map((t) => tick(t, MAJOR, "major"))}
        ${f === undefined ? nothing : svg`<line class="mark" x1=${m1x} y1=${m1y} x2=${m2x} y2=${m2y} />`}
        ${endLabel(a0, min)}${endLabel(a1, max)}
        ${this.inside() && this.text() ? svg`<text class="lab" x=${(sx + ex) / 2} y=${top - 10}>${this.text()}</text>` : nothing}`}
      </svg>`,
    };
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const value = this.drag ?? (c.entity ? readNumber(this.hass, c.entity, c.attribute) : c.value);
    const showNumber = c.show !== "none";
    const { w, h } = this.room;
    const shown = value === undefined ? "\u2013" : String(Math.round(value * 10) / 10);
    const ready = w > 0 && h > 0;
    const dial = html`<div class="dial"><div class="room">
      ${ready ? this.scale(w, Math.max(20, h - 8 - (showNumber ? NUMBER_H + 4 : 0)), value).svg : nothing}
      ${ready && showNumber ? html`<div class="num ${c.align ?? "center"}">${shown}${c.unit ? html`<small>${c.unit}</small>` : nothing}</div>` : nothing}
    </div></div>`;
    const outside = !this.inside() && !!this.text();
    if (!outside) return dial;
    return html`<div class="wrap ${c.title_position}"><div class="outer">${this.text()}</div><div class="face">${dial}</div></div>`;
  }
}
