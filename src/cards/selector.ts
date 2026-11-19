import { css, html, nothing, svg, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { formEditor } from "../shared/form-editor";
import { tokens } from "../shared/styles";
import { faceStyles } from "../shared/face";
import { readState, TONES, type StateRules } from "../shared/state-rules";
import { computeLabel, computeHelper, dropdown, layoutFields } from "../shared/form";
import type { PieceConfig } from "../shared/types";

export interface SelectorOption {
  /** The option exactly as the entity names it. */
  option: string;
  /** What is printed instead of the option. */
  label?: string;
  icon?: string;
}

export interface SelectorConfig extends PieceConfig, Pick<StateRules, "rules_entity" | "alert_when" | "state_colours"> {
  /** An input_select or select: its options are the stops, in its order. Or an on/off entity (input_boolean, switch, light, fan): two stops, off and on. */
  entity?: string;
  title?: string;
  title_position?: "above" | "below" | "left" | "right";
  /** Rename, give an icon to, reorder or leave out options. Empty: all of the entity's options as named. */
  options?: SelectorOption[];
  /** The direction the lever moves from the first option to the last. */
  orientation?: "right" | "left" | "down" | "up";
  /** Which side of the lever the labels are on (a side that does not fit the orientation is turned to the nearest one that does). */
  labels_position?: "above" | "below" | "left" | "right";
  /** What each stop prints: its icon if it has one, else its label (default); labels only; icon and label; or nothing. */
  show?: "auto" | "labels" | "both" | "none";
  size?: "small" | "medium" | "large";
  /** A lever on a slot (default), or a rotary knob with the options around it. A knob only uses right or left of the orientation: the direction it turns from the first option. */
  shape?: "lever" | "knob";
  /** Knob only: a round cap with a stripe (default), or a pointer: a round body with a slim tab, as measured from a Braun knob, that points at the option, with a thin scale arc round the options. */
  cap?: "round" | "pointer";
  /** A status lamp: one above or below the lever, lit in the colour the state rules give the current option; or one on each option, lit on the current one. Not both. */
  light?: "none" | "above" | "below" | "options";
  /** A line from each label to its stop (hooked on a horizontal lever). Ignored when each option has its own lamp. */
  lines?: boolean;
  /** A tap on the lever (a knob has left and right halves instead, and does not wrap) moves it one stop, toward the last option (default) or toward the first, and wraps around. */
  cycle?: "forward" | "backward";
}

const KNOB = { small: 104, medium: 128, large: 156 } as const;
/** On/off entities: two stops, off then on, switched with turn_off / turn_on. */
const BOOLEAN = ["input_boolean", "switch", "light", "fan"];
const SIZES = { small: { fs: 9, p: 26, ico: 16 }, medium: { fs: 11, p: 30, ico: 20 }, large: { fs: 14, p: 36, ico: 24 } } as const;

/** A selector for an input_select, select or on/off entity: a lever on a slot, or a knob, with one stop per option. Tap the lever to step, tap another stop to go there. With two options it is an on/off switch. */
@customElement("rams-selector")
export class RamsSelector extends Piece<SelectorConfig> {
  protected hostFrame = false;
  protected minRows = true;

  static styles = [
    tokens,
    faceStyles,
    css`
      :host { display: block; }
      /* a horizontal lever and its title sit together in the middle of the cell; a vertical one takes the cell's height */
      .wrap { justify-content: center; }
      .face.h { flex: none; }
      .wrap.left .face.h, .wrap.right .face.h { flex: 1; }
      .face { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; padding: 0; overflow: visible; }
      .ctl { box-sizing: border-box; min-width: 0; display: flex; gap: 4px; }
      .ctl.h { flex-direction: column; width: 100%; max-width: calc(var(--n) * 110px); }
      .ctl.v { flex: 1; align-self: stretch; min-height: 0; flex-direction: row; justify-content: center; gap: 8px; }
      .slot { position: relative; flex: none; box-sizing: border-box; border-radius: 4px; background-color: var(--_slot, #2b2118); box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6); }
      /* a fine brushed grain, along the travel */
      .h .slot { width: 100%; height: var(--p); background-image: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 3px); }
      .v .slot { width: var(--p); height: 100%; background-image: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 3px); }
      .stops { position: absolute; inset: 0; display: grid; }
      .h .stops { grid-template-columns: repeat(var(--n), 1fr); }
      .v .stops { grid-template-rows: repeat(var(--n), 1fr); }
      .stop { all: unset; cursor: pointer; -webkit-tap-highlight-color: transparent; }
      /* the lever: graphite with ribs across the travel, and a white stripe */
      .lever { position: absolute; border-radius: 3px; --_g: color-mix(in srgb, var(--_slot, #2b2118) 38%, #bdbab4); background-color: var(--_g); box-shadow: 0 calc(var(--p) * 0.08) calc(var(--p) * 0.1) rgba(0, 0, 0, 0.7), 0 1px 1px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.14); pointer-events: none; transition: left 0.12s ease-out, top 0.12s ease-out; }
      .h .lever { top: 3px; bottom: 3px; left: calc(var(--i) * 100% / var(--n) + 3px); width: calc(100% / var(--n) - 6px); background-image: repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.22) 0 1px, rgba(255, 255, 255, 0.35) 1px 2px, transparent 2px 5px); }
      .v .lever { left: 3px; right: 3px; top: calc(var(--i) * 100% / var(--n) + 3px); height: calc(100% / var(--n) - 6px); background-image: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.22) 0 1px, rgba(255, 255, 255, 0.35) 1px 2px, transparent 2px 5px); }
      .lever::after { content: ""; position: absolute; background: #fff; border-radius: 1px; box-shadow: 0 0 1px rgba(255, 255, 255, 0.6), 0 0 0 0.5px rgba(0, 0, 0, 0.25); }
      .h .lever::after { top: 22%; bottom: 22%; left: 50%; width: 3px; margin-left: -1.5px; }
      .v .lever::after { left: 22%; right: 22%; top: 50%; height: 3px; margin-top: -1.5px; }
      .lever.none { opacity: 0.4; }
      /* the knob: options sit round it from a start angle; the box is square and everything inside is in cqmin of it */
      /* the knob fills the room it is given (--S is the least it needs): a square as big as fits beside the lamp, with text and shadow scaling along */
      .face.k { flex: 1; align-self: stretch; min-height: var(--S); container-type: size; }
      .knobbox { position: relative; flex: none; width: min(62cqw, calc(100cqh - var(--lampH))); height: min(62cqw, calc(100cqh - var(--lampH))); container-type: size; }
      .knobbox .lab { font-size: max(var(--fs), 8.6cqmin); }
      .knobbox .ico { --mdc-icon-size: max(var(--ico), 14cqmin); width: max(var(--ico), 14cqmin); height: max(var(--ico), 14cqmin); }
      .knobbox .lamp.sm { width: max(8px, 6cqmin); height: max(8px, 6cqmin); }
      .knobbox .disc { pointer-events: none; position: absolute; left: calc(50% - 24cqmin); top: calc(50% - 24cqmin); width: 48cqmin; height: 48cqmin; border-radius: 50%; box-sizing: border-box; border: 0; padding: 0; cursor: pointer;
        background: radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--_slot, #2b2118) 38%, #d4d1ca) 0 58%, color-mix(in srgb, var(--_slot, #2b2118) 38%, #bdbab4) 59% 100%);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 0 0 2.5cqmin var(--_slot, #2b2118); transform: rotate(var(--a)); transition: transform 0.15s ease-out; -webkit-tap-highlight-color: transparent; }
      .knobbox .disc::after { content: ""; position: absolute; left: calc(50% - 1.5px); top: 10%; width: 3px; height: 30%; background: #fff; border-radius: 1px; box-shadow: 0 0 1px rgba(255, 255, 255, 0.6), 0 0 0 0.5px rgba(0, 0, 0, 0.25); }
      .knobbox .disc.none { opacity: 0.4; }
      /* pointer cap: a brushed-metal teardrop turning about its round end, the scale arc beyond its tip */
      .knobbox .disc.ptr { left: calc(50% - 31cqmin); top: calc(50% - 31cqmin); width: 62cqmin; height: 62cqmin; border-radius: 0; background: none; box-shadow: none; overflow: visible; }
      .knobbox .disc.ptr::after { content: none; }
      .disc.ptr svg { width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 4cqmin 3cqmin rgba(0, 0, 0, 0.32)) drop-shadow(0 1cqmin 1cqmin rgba(0, 0, 0, 0.45)); }
      .arc { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
      .arc path, .arc line { stroke: var(--_muted); stroke-width: 0.9; fill: none; stroke-linecap: round; }
      /* two halves: left steps toward the left of the scale, right toward the right; nothing at either end */
      .half { all: unset; position: absolute; top: calc(50% - 28cqmin); width: 28cqmin; height: 56cqmin; cursor: pointer; -webkit-tap-highlight-color: transparent; }
      .half.l { left: calc(50% - 28cqmin); border-radius: 28cqmin 0 0 28cqmin; } .half.r { left: 50%; border-radius: 0 28cqmin 28cqmin 0; }
      .half.off { cursor: default; }
      .ray { position: absolute; left: 50%; top: 50%; width: 0; height: 0; transform: rotate(var(--r)); }
      .ray .tick { position: absolute; left: -0.5px; top: -33cqmin; width: 1px; height: 5cqmin; background: var(--_muted); }
      .ray .pip { position: absolute; left: -4px; top: calc(-33cqmin - 4px); display: flex; align-items: center; justify-content: center; width: 8px; height: 8px; }
      .pt { position: absolute; left: calc(50% + var(--ux) * var(--pr) * 1cqmin); top: calc(50% + var(--uy) * var(--pr) * 1cqmin); transform: translate(calc(-50% + var(--ux) * 50%), calc(-50% + var(--uy) * 50%)); }
      .pt .lab { flex-direction: row; gap: 4px; padding: 0; white-space: nowrap; }
      .pt.ux-1 .lab { flex-direction: row; } .pt.ux-l .lab { flex-direction: row-reverse; }
      .pt .lab.ico-only { gap: 0; }
      .labels { display: grid; min-width: 0; }
      .h .labels { grid-template-columns: repeat(var(--n), 1fr); width: 100%; }
      .v .labels { grid-template-rows: repeat(var(--n), 1fr); flex: none; width: max-content; max-width: 70%; }
      /* from the slot outward: line, lamp, icon, text. The lamp and icon sit in lanes of their own, so they line up whatever the text. */
      .lab { all: unset; box-sizing: border-box; min-width: 0; display: flex; align-items: center; gap: 4px; padding: 0 1px; cursor: pointer; font-size: var(--fs); letter-spacing: 0.08em; text-transform: uppercase; color: var(--_muted); -webkit-tap-highlight-color: transparent; }
      .lab.on { color: var(--_ink); }
      .lab span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .h .lab { flex-direction: column; justify-content: center; gap: 3px; }
      .h .labels.before .lab { flex-direction: column-reverse; }
      .v .lab { flex-direction: row; justify-content: flex-start; gap: 8px; padding: 0; }
      .v .labels.before .lab { flex-direction: row-reverse; }
      .v .labels.before .lab span { text-align: right; }
      .lead { flex: none; background: var(--_muted); }
      .v .lead { width: 8px; height: 1px; }
      /* horizontal: a hook. A bar on the text side runs to the middle of the cell, where the stop is, and drops to the slot. Odd middle: straight. */
      .h .lead { width: 50%; height: 8px; background: none; border: 0 solid var(--_muted); }
      .h .lab.l { align-items: flex-start; text-align: left; } .h .lab.r { align-items: flex-end; text-align: right; } .h .lab.m { align-items: center; text-align: center; }
      .h .lab.l .lead { align-self: flex-start; border-right-width: 1px; } .h .lab.r .lead { align-self: flex-end; border-left-width: 1px; }
      .h .lab.m .lead { align-self: center; width: 0; border-left-width: 1px; }
      .h .labels.before .lab.l .lead, .h .labels.before .lab.r .lead { border-top-width: 1px; }
      .h .labels.after .lab.l .lead, .h .labels.after .lab.r .lead { border-bottom-width: 1px; }
      .lane { flex: none; display: flex; align-items: center; justify-content: center; width: 12px; height: 12px; }
      .v .lane { width: 8px; }
      .ico { --mdc-icon-size: var(--ico); flex: none; display: inline-flex; width: var(--ico); height: var(--ico); }
      .lamp.sm { width: 8px; height: 8px; }
      .lamp { flex: none; width: 12px; height: 12px; border-radius: 50%; background: var(--_lens); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.35); }
      .lamp.on { background: var(--l); box-shadow: 0 0 max(var(--_glow), 6px) 1px color-mix(in srgb, var(--l) 85%, transparent), inset 0 0 2px rgba(255, 255, 255, 0.6); }
      .lamp.red { --l: var(--_alert); } .lamp.orange { --l: var(--_orange); } .lamp.blue { --l: var(--_blue); } .lamp.green { --l: var(--_green); } .lamp.grey { --l: var(--_grey); }
    `,
  ];

  static getStubConfig(): SelectorConfig {
    return {
      type: "custom:rams-selector",
      title: "Mode",
      options: [{ option: "off", label: "off" }, { option: "auto", label: "auto" }, { option: "manual", label: "manual" }],
      columns: 6,
      rows: 2,
    };
  }

  static getConfigElement(): Promise<HTMLElement> {
    return formEditor(this.getConfigForm());
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: { domain: ["input_select", "select", ...BOOLEAN] } } },
        { name: "title", selector: { text: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            dropdown("title_position", [["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
            dropdown("shape", [["lever", "Lever"], ["knob", "Knob"]]),
            dropdown("cap", [["round", "Round cap (knob)"], ["pointer", "Pointer (knob)"]]),
            dropdown("orientation", [["right", "Right: first option on the left"], ["left", "Left: first option on the right"], ["down", "Down: first option on top"], ["up", "Up: first option at the bottom"]]),
            dropdown("show", [["auto", "Icon if set, else label"], ["labels", "Labels only"], ["both", "Icons and labels"], ["none", "None: no labels or icons"]]),
            dropdown("size", [["small", "Small"], ["medium", "Medium"], ["large", "Large"]]),
            dropdown("labels_position", [["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
            dropdown("light", [["none", "None"], ["above", "One above"], ["below", "One below"], ["options", "One on each option"]]),
            { name: "lines", selector: { boolean: {} } },
            dropdown("cycle", [["forward", "Toward the last option"], ["backward", "Toward the first option"]]),
          ],
        },
        {
          name: "options",
          selector: {
            object: {
              multiple: true,
              label_field: "option",
              description_field: "label",
              fields: {
                option: { label: "Option", required: true, selector: { text: {} } },
                label: { label: "Label", selector: { text: {} } },
                icon: { label: "Icon", selector: { icon: {} } },
              },
            },
          },
        },
        ...layoutFields(false),
        {
          type: "expandable",
          name: "",
          title: "State rules",
          schema: [
            { name: "rules_entity", selector: { entity: {} } },
            { name: "alert_when", selector: { state: { multiple: true } }, context: { filter_entity: "entity" } },
            {
              name: "state_colours",
              selector: {
                object: {
                  multiple: true,
                  label_field: "state",
                  fields: {
                    state: { label: "State", required: true, selector: { text: {} } },
                    tone: { label: "Colour", required: true, selector: { select: { mode: "dropdown", options: TONES.filter(([v]) => v !== "neutral").map(([value, label]) => ({ value, label })) } } },
                  },
                },
              },
            },
          ],
        },
      ],
      computeLabel,
      computeHelper,
    };
  }

  protected actionable(): boolean {
    return !!this.config?.entity || super.actionable();
  }

  /** The stops in the entity's order (or as the options list gives them). */
  private stops(): Array<Required<Pick<SelectorOption, "option" | "label">> & { icon?: string }> {
    const c = this.config!;
    if (c.options?.length) return c.options.filter((o) => o?.option !== undefined).map((o) => ({ option: String(o.option), label: o.label?.trim() ? o.label : String(o.option), icon: o.icon || undefined }));
    if (this.isBoolean()) return [{ option: "off", label: "off" }, { option: "on", label: "on" }];
    const options = c.entity ? this.hass?.states[c.entity]?.attributes.options : undefined;
    return Array.isArray(options) ? options.map((o) => ({ option: String(o), label: String(o) })) : [];
  }

  /** The colour of an option's own lamp: lit on the current option, in the colour its state rule gives it. With rules set, an option without one stays dark. */
  private lampTone(option: string): string | undefined {
    const c = this.config!;
    const judged = this.hass?.states[c.rules_entity ?? c.entity ?? ""]?.state;
    if (judged !== option) return undefined;
    if (!c.state_colours?.length) return "red";
    const tone = c.state_colours.find((r) => r.state === option)?.tone;
    return tone && tone !== "neutral" ? tone : undefined;
  }

  private vertical(): boolean {
    return this.config?.orientation === "down" || this.config?.orientation === "up";
  }

  private reversed(): boolean {
    return this.config?.orientation === "left" || this.config?.orientation === "up";
  }

  private current(): number {
    const state = this.config?.entity ? this.hass?.states[this.config.entity]?.state : undefined;
    return state === undefined ? -1 : this.stops().findIndex((s) => s.option === state);
  }

  private isBoolean(): boolean {
    return BOOLEAN.includes(this.config?.entity?.split(".")[0] ?? "");
  }

  private select(option: string): void {
    const c = this.config;
    const domain = c?.entity?.split(".")[0];
    if (!c?.entity || !this.hass) return;
    if (this.isBoolean()) void this.hass.callService("homeassistant", option === "on" ? "turn_on" : "turn_off", { entity_id: c.entity });
    else if (domain === "input_select" || domain === "select") void this.hass.callService(domain, "select_option", { entity_id: c.entity, option });
  }

  /** A tap on the current stop steps on; a tap on another stop goes there. */
  private choose(i: number): void {
    const stops = this.stops();
    if (!stops.length) return;
    const now = this.current();
    if (i !== now) return this.select(stops[i].option);
    const step = this.config?.cycle === "backward" ? -1 : 1;
    this.select(stops[(now + step + stops.length) % stops.length].option);
  }

  /** In a panel with no rows set, ask for the rows the control needs; the lever, labels, lamp and title must fit. */
  protected updated(): void {
    const c = this.config;
    if (!c || typeof c.rows === "number") return;
    const stops = this.stops();
    const n = stops.length;
    const z = SIZES[c.size ?? "small"];
    const light = c.light === "above" || c.light === "below" ? 17 : 0;
    const pos = c.title_position ?? "below";
    const title = c.title?.trim() && pos !== "left" && pos !== "right" ? 18 : 0;
    const show = c.show ?? "auto";
    const own = c.light === "options";
    const icon = show !== "labels" && show !== "none" && stops.some((x) => x.icon);
    const text = show === "labels" || show === "both" || (show === "auto" && stops.some((x) => !x.icon));
    const body = icon && text && show === "both" ? z.ico + 3 + z.fs + 4 : icon ? z.ico : text ? z.fs + 4 : 0;
    const labels = body || own ? body + (own ? 15 : 0) + (c.lines && !own ? 8 : 0) + 4 : 0;
    if (c.shape === "knob") return this.reportRows(this.rowsFor(KNOB[c.size ?? "small"] + light + title + 4));
    const need = this.vertical() ? n * z.p + light + title + 4 : z.p + labels + light + title + 4;
    this.reportRows(this.rowsFor(need));
  }

  /** The stop one step toward the left (-1) or right (1) of the scale, or -1 at the end. A knob does not wrap. */
  private nudgeTo(side: -1 | 1, dir: number): number {
    const n = this.stops().length;
    const now = this.current();
    if (now < 0) return n ? 0 : -1;
    const i = now + side * dir;
    return i < 0 || i >= n ? -1 : i;
  }

  private nudge(side: -1 | 1, dir: number): void {
    const i = this.nudgeTo(side, dir);
    if (i >= 0) this.select(this.stops()[i].option);
  }

  /** Knob: the options are spread round the top, the cap turns to the current one. */
  private knob(c: SelectorConfig, stops: ReturnType<RamsSelector["stops"]>, now: number, show: string, z: (typeof SIZES)[keyof typeof SIZES], lamp: TemplateResult | typeof nothing, title: string, pos: string, own: boolean, lines: boolean): TemplateResult {
    const n = stops.length;
    const ptr = c.cap === "pointer";
    // the pointer is a big control: six options would fill a half circle, so each step is 36 degrees (fewer options use less of the arc)
    const step = n < 2 ? 0 : ptr ? Math.min(36, 270 / (n - 1)) : Math.min(60, n === 2 ? 90 : 270 / (n - 1));
    const dir = c.orientation === "left" || c.orientation === "up" ? -1 : 1;
    const angle = (i: number) => (-(step * (n - 1)) / 2 + i * step) * dir;
    const S = KNOB[c.size ?? "small"];
    const cap = now < 0 ? 0 : angle(now);
    const at = (a: number, r: number) => `${(50 + r * Math.sin((a * Math.PI) / 180)).toFixed(2)} ${(50 - r * Math.cos((a * Math.PI) / 180)).toFixed(2)}`;
    const arc = ptr && n > 1
      ? svg`<svg class="arc" viewBox="0 0 100 100"><path d="M ${at(angle(0), 38)} A 38 38 0 ${step * (n - 1) > 180 ? 1 : 0} ${dir === 1 ? 1 : 0} ${at(angle(n - 1), 38)}" />${stops.map((_, i) => svg`<line x1=${at(angle(i), 38).split(" ")[0]} y1=${at(angle(i), 38).split(" ")[1]} x2=${at(angle(i), 35.5).split(" ")[0]} y2=${at(angle(i), 35.5).split(" ")[1]} />`)}</svg>`
      : nothing;
    const drop = ptr
      ? svg`<svg viewBox="-31 -31 62 62"><defs><linearGradient id="rams-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9d8d3" /><stop offset="0.55" stop-color="#a9a8a3" /><stop offset="1" stop-color="#8f8e89" /></linearGradient></defs><path d="M10.05 -5.8 L3.35 -17.57 Q1.86 -20.18 1.86 -23.18 L1.86 -31.9 A1.86 1.86 0 0 0 -1.86 -31.9 L-1.86 -23.18 Q-1.86 -20.18 -3.35 -17.57 L-10.05 -5.8 A11.6 11.6 0 1 0 10.05 -5.8 Z" fill="url(#rams-metal)" stroke="rgba(0,0,0,0.25)" stroke-width="0.4" stroke-linejoin="round" /></svg>`
      : nothing;
    const pts = stops.map((s, i) => {
      const a = angle(i);
      const rad = (a * Math.PI) / 180;
      const ux = Math.round(Math.sin(rad) * 1000) / 1000;
      const uy = Math.round(-Math.cos(rad) * 1000) / 1000;
      const hasIcon = show !== "labels" && show !== "none" && !!s.icon;
      const icon = hasIcon ? html`<ha-icon class="ico" .icon=${s.icon}></ha-icon>` : nothing;
      const text = show === "labels" || show === "both" || (show === "auto" && !hasIcon) ? html`<span>${s.label}</span>` : nothing;
      const tone = own ? this.lampTone(s.option) : undefined;
      const lampEl = own ? html`<span class="ray" style="--r:${a}deg"><span class="pip" style=${ptr ? "top: calc(-38cqmin - 4px)" : ""}><i class="lamp sm ${tone ? `on ${tone}` : ""}"></i></span></span>` : nothing;
      const tick = lines && !ptr ? html`<span class="ray" style="--r:${a}deg"><i class="tick"></i></span>` : nothing;
      const reach = ptr ? (own ? 45 : 42) : own ? 41 : lines ? 39 : 35;
      const side = ux < -0.3 ? "ux-l" : "ux-1";
      return html`${lampEl}${tick}<span class="pt ${side}" style="--ux:${ux}; --uy:${uy}; --pr:${reach}"><button class="lab ${i === now ? "on" : ""}" title=${s.label} @click=${() => this.choose(i)}>${icon}${text}</button></span>`;
    });
    return html`<div class="wrap ${pos}">
      ${pos ? html`<span class="outer">${title}</span>` : nothing}
      <div class="face k" style="overflow: visible; gap: 12px; --S:${S}px; --lampH:${c.light === "above" || c.light === "below" ? 24 : 0}px">${c.light === "below" ? nothing : lamp}
        <div class="knobbox" style="--a:${cap}deg; --fs:${z.fs}px; --ico:${z.ico}px">${arc}${pts}<span class="disc ${ptr ? "ptr" : ""} ${now < 0 ? "none" : ""}">${drop}</span><button class="half l ${this.nudgeTo(-1, dir) < 0 ? "off" : ""}" aria-label="Previous" @click=${() => this.nudge(-1, dir)}></button><button class="half r ${this.nudgeTo(1, dir) < 0 ? "off" : ""}" aria-label="Next" @click=${() => this.nudge(1, dir)}></button></div>
      ${c.light === "below" ? lamp : nothing}</div>
    </div>`;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const vertical = this.vertical();
    const stops = this.stops();
    const n = Math.max(1, stops.length);
    const order = stops.map((_, i) => i);
    if (this.reversed()) order.reverse();
    const now = this.current();
    const slotIndex = now < 0 ? 0 : order.indexOf(now);
    const show = c.show ?? "auto";
    const z = SIZES[c.size ?? "small"];
    const lines = !!c.lines && c.light !== "options";
    const side = c.labels_position ?? (vertical ? "right" : "above");
    // above/below on a vertical lever mean left/right, left/right on a horizontal one mean above/below
    const before = vertical ? side === "left" || side === "above" : side === "above" || side === "left";
    const view = readState(this.hass, c.entity, c);
    const lamp = c.light === "above" || c.light === "below" ? html`<i class="lamp ${view.signal ? `on ${view.signal}` : ""}"></i>` : nothing;
    const title = c.title?.trim() ?? "";
    const pos = title ? (c.title_position ?? "below") : "";
    const own = c.light === "options";
    const labels =
      show === "none" && !own && !lines
        ? nothing
        : html`<div class="labels ${before ? "before" : "after"}">${order.map((i) => {
            const s = stops[i];
            const hasIcon = show !== "labels" && show !== "none" && !!s.icon;
            const icon = hasIcon ? html`<ha-icon class="ico" .icon=${s.icon}></ha-icon>` : nothing;
            const text = show === "labels" || show === "both" || (show === "auto" && !hasIcon) ? html`<span>${s.label}</span>` : nothing;
            const vi = order.indexOf(i);
            const half = Math.floor(n / 2);
            const where = n === 1 || (n % 2 === 1 && vi === half) ? "m" : vi < half ? "l" : "r";
            const tone = own ? this.lampTone(s.option) : undefined;
            return html`<button class="lab ${where} ${i === now ? "on" : ""}" title=${s.label} @click=${() => this.choose(i)}>${lines ? html`<i class="lead"></i>` : nothing}${own ? html`<span class="lane"><i class="lamp sm ${tone ? `on ${tone}` : ""}"></i></span>` : nothing}${icon}${text}</button>`;
          })}</div>`;
    if (c.shape === "knob") return this.knob(c, stops, now, show, z, lamp, title, pos, own, lines);
    const slot = html`<div class="slot"><div class="stops">${order.map((i) => html`<button class="stop" aria-label=${stops[i].label} @click=${() => this.choose(i)}></button>`)}</div><i class="lever ${now < 0 ? "none" : ""}"></i></div>`;
    const ctl = html`<div class="ctl ${vertical ? "v" : "h"}" style="--n:${n}; --i:${slotIndex}; --p:${z.p}px; --fs:${z.fs}px; --ico:${z.ico}px">${before ? labels : nothing}${slot}${before ? nothing : labels}</div>`;
    return html`<div class="wrap ${pos}">
      ${pos ? html`<span class="outer">${title}</span>` : nothing}
      <div class="face ${vertical ? "v" : "h"}">${c.light === "below" ? nothing : lamp}${ctl}${c.light === "below" ? lamp : nothing}</div>
    </div>`;
  }
}
