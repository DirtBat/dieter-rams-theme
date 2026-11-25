import { css, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { clamp, readNumber, shownNumber, writeNumber } from "../shared/entity-value";
import { tokens } from "../shared/styles";
import { faceStyles } from "../shared/face";
import { Press } from "../shared/press";
import { actionFields, computeLabel, computeHelper, dropdown, layoutFields, num } from "../shared/form";
import { pick } from "../shared/stub";
import type { Hass, PieceConfig } from "../shared/types";

export interface DialConfig extends PieceConfig {
  /** Value from an entity (a sensor, or a helper) ... */
  entity?: string;
  /** Several entities as one: shows the first that is playing (else the first); a touch sets the value on all of them. Replaces entity. */
  entities?: string[];
  attribute?: string;
  /** A second entity, such as a setpoint: a dark pointer outside the scale. A climate entity gives its target temperature. */
  setpoint?: string;
  /** ... or a fixed value. */
  value?: number;
  min?: number;
  max?: number;
  /** Distance between the small tick marks, and the step when set by touch. */
  interval?: number;
  /** Distance between the thick tick marks. Empty: only the first and the last. */
  major?: number;
  unit?: string;
  /** Printed with the dial: below it (default), or above, left or right of it, or inside the arc. */
  title?: string;
  title_position?: "inside" | "above" | "below" | "left" | "right";
  /** Earlier name of title. */
  label?: string;
  /** The number under the scale: shown (default) or not, when the red mark says enough. */
  show?: "all" | "none";
  /** Where the number sits: under the scale at the left, in the middle (default) or at the right, or in the centre of the gauge. */
  align?: "start" | "center" | "end" | "inside";
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
const POINTER = 10;
const MARK_IN = 14;
const NUMBER_H = 28;
/** The title printed above or below the scale, with its gap. */
const TITLE_H = 17;
const END_GAP = 8;

/** A scale on any arc with one red mark at the value. The arc is as large as the room allows; the number sits right under it. */
@customElement("rams-dial")
export class RamsDial extends Piece<DialConfig> {
  private press = new Press(this, () => (this.actionable() ? this.config : undefined));

  constructor() {
    super();
    this.addEventListener("pointerdown", this.press.down);
    this.addEventListener("pointerup", this.press.up);
    this.addEventListener("pointerleave", this.press.up);
    this.addEventListener("click", this.press.click);
  }

  /** Tap and hold actions work unless touch to set is on: then a touch sets the value. */
  protected actionable(): boolean {
    return !this.config?.interactive && super.actionable();
  }

  protected honourRows = true;
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
      :host([frame="backlit"]) { background: var(--_backlit-bg); color: var(--_backlit-ink); --_ink: var(--_backlit-ink); --_muted: color-mix(in srgb, var(--_backlit-ink) 72%, transparent); }
      :host([frame="black"]) { background: var(--_led-bg); color: var(--_led-ink); --_ink: var(--_led-ink); --_muted: color-mix(in srgb, var(--_led-ink) 62%, transparent); }
      :host([frame="recessed"]) { background: var(--_lcd-bg); color: var(--_lcd-ink); --_ink: var(--_lcd-ink); --_muted: var(--_lcd-muted); }
      .dial { height: 100%; min-height: max(72px, var(--_min, 0px)); display: flex; flex-direction: column; }
      .room { box-sizing: border-box; flex: 1; min-height: 0; padding: 4px 0; display: flex; flex-direction: column; justify-content: flex-start; overflow: hidden; }
      svg { display: block; flex: none; width: 100%; touch-action: none; }
      .face { display: block; }
      .arc { fill: none; stroke: var(--_muted); stroke-width: 1.5; }
      .tick { stroke: var(--_muted); stroke-width: 1.5; }
      .tick.major { stroke: var(--_ink); stroke-width: 2.5; }
      .pointer { fill: var(--_ink); }
      .mark { stroke: var(--_red); stroke-width: 3.5; stroke-linecap: butt; }
      .unit, .lab, .end { fill: var(--_muted); letter-spacing: 0.1em; text-transform: uppercase; }
      .lab { font-size: 10px; text-anchor: middle; }
      .vt { flex: none; height: 12px; line-height: 12px; } .vt.below { margin-top: 5px; } .vt.above { margin-bottom: 5px; }
      .cnum { fill: var(--_ink); }
      .cunit { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; fill: var(--_muted); }
      .num { flex: none; box-sizing: border-box; height: ${NUMBER_H}px; margin-top: 4px; padding: 0 2px; display: flex; align-items: baseline; justify-content: center; gap: 3px; font-size: 24px; line-height: ${NUMBER_H}px; color: var(--_ink); }
      .num.start { justify-content: flex-start; } .num.end { justify-content: flex-end; }
      .num small { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      .interactive { cursor: pointer; }
    `,
  ];

  /** Your thermostat if there is one (the red mark is the room temperature, the dark pointer the target), else a fixed example. */
  static getStubConfig(hass?: Hass): DialConfig {
    const e = pick(hass, ["climate"], (x) => typeof x.attributes.current_temperature === "number");
    const arc = { start_angle: -120, end_angle: 120, columns: 6, rows: 3 };
    if (e) return { type: "custom:rams-dial", entity: e.entity_id, attribute: "current_temperature", setpoint: e.entity_id, min: Number(e.attributes.min_temp ?? 7), max: Number(e.attributes.max_temp ?? 35), interval: 1, major: 5, unit: "\u00b0C", title: String(e.attributes.friendly_name ?? "Temperature"), ...arc };
    return { type: "custom:rams-dial", title: "Temperature", unit: "\u00b0C", min: 10, max: 30, interval: 1, major: 5, value: 21, ...arc };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "entity", selector: { entity: {} } },
        { name: "entities", selector: { entity: { multiple: true } } },
        { name: "attribute", selector: { attribute: {} }, context: { filter_entity: "entity" } },
        { name: "setpoint", selector: { entity: {} } },
        { name: "interactive", selector: { boolean: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            num("min", undefined, undefined, { step: "any" }),
            num("max", undefined, undefined, { step: "any" }),
            { name: "unit", selector: { text: {} } },
            num("value", undefined, undefined, { step: "any" }),
            num("interval", undefined, undefined, { step: "any" }),
            num("major", undefined, undefined, { step: "any" }),
          ],
        },
        {
          type: "grid",
          name: "",
          schema: [
            num("start_angle", -360, 360, { step: 5 }),
            num("end_angle", -360, 360, { step: 5 }),
            dropdown("show", [["all", "Scale and number"], ["none", "Scale only"]]),
            dropdown("title_position", [["inside", "Inside"], ["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
            dropdown("align", [["start", "Below, left"], ["center", "Below"], ["end", "Below, right"], ["inside", "Centre of the gauge"]], { label: "Number position" }),
          ],
        },
        ...layoutFields(),
        ...actionFields(),
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
    return this.config?.title_position === "inside";
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
    const out = this.config?.setpoint ? POINTER + 1 : MARK_OUT;
    for (const a of angles) {
      pts.push(at(a, r + out), at(a, r - MAJOR));
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
    if (this.centred !== undefined) {
      const n = this.numberBox(r);
      pts.push([n.x - n.w / 2, n.y - n.size * 0.5], [n.x + n.w / 2, n.y + n.size * 0.4]);
    }
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
  /** The browser took the gesture (for example to scroll): drop the drag, write nothing. */
  private onCancel = () => {
    this.drag = undefined;
  };
  private onUp = () => {
    if (this.drag !== undefined && this.hass) for (const e of this.all()) void writeNumber(this.hass, e, this.drag);
    this.drag = undefined;
  };

  /** The scale, in a room of w x h pixels (the number's line already taken off). */
  private scale(w: number, h: number, value: number | undefined, numberText?: string): { svg: TemplateResult; height: number } {
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
    const sp = c.setpoint ? readNumber(this.hass, c.setpoint) : undefined;
    const pointer = (v: number) => {
      const a = a0 + Math.min(1, Math.max(0, frac(v))) * (a1 - a0);
      const t: [number, number] = [Math.cos(rad(a)), Math.sin(rad(a))];
      const [ax, ay] = at(a, r + 1), [bx, by] = at(a, r + POINTER);
      return svg`<polygon class="pointer" points="${ax},${ay} ${bx + t[0] * 4.5},${by + t[1] * 4.5} ${bx - t[0] * 4.5},${by - t[1] * 4.5}" />`;
    };
    const [m1x, m1y] = f === undefined ? [0, 0] : this.at(f, r + MARK_OUT);
    const [m2x, m2y] = f === undefined ? [0, 0] : this.at(f, r - MARK_IN);
    return {
      height,
      svg: html`<svg viewBox="${vx} ${vy} ${w} ${height}" style="height:${height}px" class=${c.interactive ? "interactive" : ""} @pointerdown=${this.onDown} @pointermove=${this.onMove} @pointerup=${this.onUp} @pointercancel=${this.onCancel}>
        ${svg`<path class="arc" d="M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}" />
        ${minors.map((t) => tick(t, MINOR, ""))}
        ${majors.map((t) => tick(t, MAJOR, "major"))}
        ${f === undefined ? nothing : svg`<line class="mark" x1=${m1x} y1=${m1y} x2=${m2x} y2=${m2y} />`}
        ${sp === undefined ? nothing : pointer(sp)}
        ${endLabel(a0, min)}${endLabel(a1, max)}
        ${numberText === undefined ? nothing : this.centreNumber(r, numberText)}
        ${this.inside() && this.text() ? svg`<text class="lab" x=${(sx + ex) / 2} y=${top - 10}>${this.text()}</text>` : nothing}`}
      </svg>`,
    };
  }

  /** The shown number while it sits in the centre of the gauge (set by render), else undefined. */
  private centred?: string;

  /** Where the centred number goes: for a half circle or less, centred between the arc's ends with its bottom on the line between them, as large as fits inside the scale; for a bigger arc, the middle of the circle. */
  private numberBox(r: number): { x: number; y: number; size: number; w: number } {
    const [a0, a1] = this.angles();
    const text = this.centred ?? "";
    const unit = this.config?.unit ? this.config.unit.length * 7 + 6 : 0;
    const wide = (s: number) => text.length * s * 0.58 + unit;
    const fit = (chord: number) => Math.max(0, (chord - unit) / Math.max(1, text.length * 0.58));
    if (a1 - a0 > 180) {
      const size = Math.max(14, Math.min(48, r * 0.55, fit(r * 1.3)));
      return { x: 0, y: 0, size, w: wide(size) };
    }
    const x = (at(a0, r)[0] + at(a1, r)[0]) / 2;
    const base = Math.max(at(a0, r)[1], at(a1, r)[1]);
    const inner = Math.min(...[a0, a1, ...(a0 < 0 && a1 > 0 ? [0] : [])].map((a) => at(a, r - MAJOR)[1]));
    const room = base - inner;
    const chord = Math.abs(at(a1, r)[0] - at(a0, r)[0]) - 2 * MAJOR;
    const size = Math.max(12, Math.min(48, r * 0.6, room * 0.85, fit(chord * 0.92)));
    return { x, y: base - size * 0.36, size, w: wide(size) };
  }

  /** The number in the centre of the gauge: in the middle of the arc, or for a half circle or less, in the middle of the half disc. */
  private centreNumber(r: number, text: string): TemplateResult {
    const c = this.config!;
    const [a0, a1] = this.angles();
    const { x, y, size } = this.numberBox(r);
    return svg`<text class="cnum" x=${x} y=${y} text-anchor="middle" dominant-baseline="central" style="font-size:${size}px">${text}${c.unit ? svg`<tspan class="cunit" dx="3">${c.unit}</tspan>` : nothing}</text>`;
  }

  /** The entities the dial stands for. */
  private all(): string[] {
    const c = this.config;
    return c?.entities?.length ? c.entities : c?.entity ? [c.entity] : [];
  }

  /** The one whose value is shown: the first that is playing or on, else the first. */
  private lead(): string | undefined {
    const list = this.all();
    return list.find((e) => ["playing", "paused", "buffering", "on"].includes(this.hass?.states[e]?.state ?? "")) ?? list[0];
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const value = this.drag ?? (this.all().length ? readNumber(this.hass, this.lead(), c.attribute) : c.value);
    const showNumber = c.show !== "none";
    const centred = showNumber && c.align === "inside";
    const { w, h } = this.room;
    const shown = value === undefined ? "\u2013" : shownNumber(this.hass, this.lead(), c.attribute, value, this.drag !== undefined);
    const ready = w > 0 && h > 0;
    this.centred = centred ? shown : undefined;
    const pos = c.title_position ?? "below";
    const stacked = !this.inside() && !!this.text() && (pos === "below" || pos === "above");
    const title = stacked ? html`<div class="outer vt ${pos}">${this.text()}</div>` : nothing;
    const dial = html`<div class="dial"><div class="room">
      ${pos === "above" ? title : nothing}
      ${ready ? this.scale(w, Math.max(20, h - 8 - (stacked ? TITLE_H : 0) - (showNumber && !centred ? NUMBER_H + 4 : 0)), value, centred ? shown : undefined).svg : nothing}
      ${ready && showNumber && !centred ? html`<div class="num ${c.align ?? "center"}">${shown}${c.unit ? html`<small>${c.unit}</small>` : nothing}</div>` : nothing}
      ${pos === "below" ? title : nothing}
    </div></div>`;
    const outside = !this.inside() && !!this.text() && !stacked;
    if (!outside) return dial;
    return html`<div class="wrap ${c.title_position ?? "below"}"><div class="outer">${this.text()}</div><div class="face">${dial}</div></div>`;
  }
}
