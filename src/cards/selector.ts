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
  /** A Home Assistant scene this option turns on. With scenes on the options the entity is not needed: the current option is the scene turned on last. */
  scene?: string;
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
  /** A lever on a slot (default), or a rotary knob with the options around it. A knob puts its labels where `labels_position` says (above by default) and turns its axis to match; `orientation` is for the lever. */
  shape?: "lever" | "knob";
  /** Knob only: a round cap with a stripe (default), or a pointer: a round body with a slim tab, as measured from a Braun knob, that points at the option, with a thin scale arc round the options. */
  cap?: "round" | "pointer";
  /** Knob only: normal reads first option on the left (labels above or below) or on top (labels left or right); reversed turns that round. */
  order?: "normal" | "reversed";
  /** A status lamp: one above or below the lever, lit in the colour the state rules give the current option; or one on each option, lit on the current one. Not both. */
  light?: "none" | "above" | "below" | "options";
  /** A line from each label to its stop (hooked on a horizontal lever). Ignored when each option has its own lamp. */
  lines?: boolean;
  /** A tap on the lever (a knob has left and right halves instead, and does not wrap) moves it one stop, toward the last option (default) or toward the first, and wraps around. */
}

const KNOB = { small: 104, medium: 128, large: 156 } as const;
/** On/off entities: two stops, off then on, switched with turn_off / turn_on. */
const BOOLEAN = ["input_boolean", "switch", "light", "fan"];
/** Degrees between two options on a knob. The pointer is a big control: six options fill a half circle, fewer use less of it. */
/** Degrees between options. Labels at the side stand in one column, so their fan must not pass 180 degrees or the column would fold back on itself. */
const knobStep = (n: number, pointer: boolean, side = false): number => {
  if (n < 2) return 0;
  const step = pointer ? Math.min(36, 270 / (n - 1)) : Math.min(60, n === 2 ? 90 : 270 / (n - 1));
  return side ? Math.min(step, 180 / (n - 1)) : step;
};
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
      /* a flex column, so the card fills the height its rows give it even where the host's own height is not known (sections view) */
      :host { display: flex; flex-direction: column; }
      .wrap { flex: 1; }
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
      .face.k { flex: 1; align-self: stretch; min-height: 0; }
      .kslot { flex: 1; min-height: 0; align-self: stretch; position: relative; }
      .knobbox { position: absolute; left: 50%; top: 50%; width: var(--_K, var(--S)); height: var(--_K, var(--S)); transform: translate(calc(-50% + var(--_dx, 0px)), calc(-50% + var(--_dy, 0px))); container-type: size; }
      .knobbox .lab { font-size: max(var(--fs), 8.6cqmin); }
      .knobbox .ico { --mdc-icon-size: max(var(--ico), 14cqmin); width: max(var(--ico), 14cqmin); height: max(var(--ico), 14cqmin); }
      .knobbox .lamp.sm { width: max(8px, 6cqmin); height: max(8px, 6cqmin); }
      /* round cap: spun metal with a sheen that stays put while the red dot turns; the shadow falls the same way whatever the position */
      .knobbox .disc { pointer-events: none; position: absolute; left: calc(50% - 24cqmin); top: calc(50% - 24cqmin); width: 48cqmin; height: 48cqmin; border-radius: 50%; box-sizing: border-box;
        background:
          radial-gradient(circle, transparent 0 62%, rgba(0, 0, 0, 0.1) 100%),
          repeating-radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.03) 0 0.3cqmin, rgba(255, 255, 255, 0.04) 0.3cqmin 0.6cqmin),
          conic-gradient(from 20deg, #d8d6d1, #eceae6 14%, #c4c2bc 28%, #e3e1dc 42%, #bbb9b3 56%, #dfddd8 70%, #c7c5bf 84%, #d8d6d1);
        box-shadow: 0 4cqmin 4cqmin rgba(0, 0, 0, 0.28), 0 1cqmin 1cqmin rgba(0, 0, 0, 0.45), 0 0 0 0.3cqmin rgba(0, 0, 0, 0.3), inset 0 0.5cqmin 0.5cqmin rgba(255, 255, 255, 0.75), inset 0 -0.5cqmin 0.5cqmin rgba(0, 0, 0, 0.18); }
      .disc .turn { position: absolute; inset: 0; transform: rotate(var(--a)); transition: transform 0.15s ease-out; }
      /* a small red triangle pointing out to the rim */
      .disc .dot { position: absolute; left: calc(50% - 3.2cqmin); top: 2.8cqmin; width: 6.4cqmin; height: 6.4cqmin; clip-path: polygon(50% 0, 100% 100%, 0 100%); background: linear-gradient(180deg, #e8685c, var(--_alert, #c8362b) 55%, #a82c22); }
      .knobbox .disc.none { opacity: 0.4; }
      /* pointer cap: a brushed-metal teardrop turning about its round end, the scale arc beyond its tip */
      .knobbox .disc.ptr { left: calc(50% - 31cqmin); top: calc(50% - 31cqmin); width: 62cqmin; height: 62cqmin; border-radius: 0; background: none; box-shadow: none; overflow: visible; filter: drop-shadow(0 4cqmin 3cqmin rgba(0, 0, 0, 0.32)) drop-shadow(0 1cqmin 1cqmin rgba(0, 0, 0, 0.45)); }
      .disc.ptr svg { width: 100%; height: 100%; overflow: visible; }
      .arc { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
      .arc path, .arc line { stroke: var(--_muted); stroke-width: 0.9; fill: none; stroke-linecap: round; }
      /* two halves: left steps toward the left of the scale, right toward the right (top and bottom when the labels are at the side); nothing at either end */
      .half { all: unset; position: absolute; top: calc(50% - 28cqmin); width: 28cqmin; height: 56cqmin; cursor: pointer; -webkit-tap-highlight-color: transparent; }
      .half.l { left: calc(50% - 28cqmin); border-radius: 28cqmin 0 0 28cqmin; } .half.r { left: 50%; border-radius: 0 28cqmin 28cqmin 0; }
      .knobbox.tb .half.l { left: calc(50% - 28cqmin); top: calc(50% - 28cqmin); width: 56cqmin; height: 28cqmin; border-radius: 28cqmin 28cqmin 0 0; }
      .knobbox.tb .half.r { left: calc(50% - 28cqmin); top: 50%; width: 56cqmin; height: 28cqmin; border-radius: 0 0 28cqmin 28cqmin; }
      .half.off { cursor: default; }
      .ray { position: absolute; left: 50%; top: 50%; width: 0; height: 0; transform: rotate(var(--r)); }
      .ray .tick { position: absolute; left: -0.5px; top: -33cqmin; width: 1px; height: 5cqmin; background: var(--_muted); }
      .ray .pip { position: absolute; left: -4px; top: calc(-33cqmin - 4px); display: flex; align-items: center; justify-content: center; width: 8px; height: 8px; }
      .pt { position: absolute; left: calc(50% + var(--ax) * var(--pr) * 1cqmin); top: calc(50% + var(--ay) * var(--pr) * 1cqmin); transform: translate(calc(-50% + var(--ux) * 50%), calc(-50% + var(--uy) * 50%)); }
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
            dropdown("order", [["normal", "Normal: first on the left or on top"], ["reversed", "Reversed"]]),
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
                scene: { label: "Scene to turn on", selector: { entity: { domain: "scene" } } },
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
    return !!this.config?.entity || this.sceneMode() || super.actionable();
  }

  /** The stops in the entity's order (or as the options list gives them). */
  private stops(): Array<Required<Pick<SelectorOption, "option" | "label">> & { icon?: string; scene?: string }> {
    const c = this.config!;
    if (c.options?.length) return c.options.filter((o) => o?.option !== undefined).map((o) => ({ option: String(o.option), label: o.label?.trim() ? o.label : String(o.option), icon: o.icon || undefined, scene: o.scene || undefined }));
    if (this.isBoolean()) return [{ option: "off", label: "off" }, { option: "on", label: "on" }];
    const options = c.entity ? this.hass?.states[c.entity]?.attributes.options : undefined;
    return Array.isArray(options) ? options.map((o) => ({ option: String(o), label: String(o) })) : [];
  }

  /** True when the options turn on HA scenes instead of setting an entity. */
  private sceneMode(): boolean {
    return !this.config?.entity && !!this.config?.options?.some((o) => o?.scene);
  }

  /** In scene mode the current option is the scene turned on last: a scene's state is the time it was last turned on. */
  private sceneCurrent(): number {
    let best = -1;
    let at = 0;
    this.stops().forEach((st, i) => {
      const t = st.scene ? Date.parse(this.hass?.states[st.scene]?.state ?? "") : NaN;
      if (!Number.isNaN(t) && t > at) { at = t; best = i; }
    });
    return best;
  }

  /** The option the rules judge: the entity's state, or in scene mode the current scene's option. */
  private judgedOption(): string | undefined {
    const c = this.config!;
    if (this.sceneMode()) return this.stops()[this.sceneCurrent()]?.option;
    return this.hass?.states[c.rules_entity ?? c.entity ?? ""]?.state;
  }

  /** The colour of an option's own lamp: lit on the current option, in the colour its state rule gives it. With rules set, an option without one stays dark. */
  private lampTone(option: string): string | undefined {
    const c = this.config!;
    const judged = this.judgedOption();
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
    if (this.sceneMode()) return this.sceneCurrent();
    const state = this.config?.entity ? this.hass?.states[this.config.entity]?.state : undefined;
    return state === undefined ? -1 : this.stops().findIndex((s) => s.option === state);
  }

  private isBoolean(): boolean {
    return BOOLEAN.includes(this.config?.entity?.split(".")[0] ?? "");
  }

  private select(option: string): void {
    const c = this.config;
    const domain = c?.entity?.split(".")[0];
    if (this.sceneMode()) {
      const scene = this.stops().find((st) => st.option === option)?.scene;
      if (scene && this.hass) void this.hass.callService("scene", "turn_on", { entity_id: scene });
      return;
    }
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
    this.select(stops[(now + 1) % stops.length].option);
  }

  private watched?: Element;
  private watcher?: ResizeObserver;

  /** The angle of each option round the knob, in degrees clockwise from straight up. The fan is centred on the side the labels are on. */
  private knobAngles(): number[] {
    const c = this.config;
    const n = this.stops().length;
    const step = knobStep(n, c?.cap === "pointer", c?.labels_position === "left" || c?.labels_position === "right");
    const side = c?.labels_position ?? "above";
    const centre = side === "right" ? 90 : side === "below" ? 180 : side === "left" ? 270 : 0;
    // reading order: first on the left (labels above or below) or on top (left or right); reversed turns it round
    const dir = (side === "below" || side === "left" ? -1 : 1) * (c?.order === "reversed" ? -1 : 1);
    const half = (step * (n - 1)) / 2;
    // labels at the side stand in a column: space the options evenly down it (not evenly round the arc), so that the labels at
    // the ends of a long fan do not pile up. With two or three options both ways give the same angles.
    if (side === "left" || side === "right") {
      const k = Math.sin((half * Math.PI) / 180);
      return Array.from({ length: n }, (_, i) => centre + dir * (n < 2 ? 0 : (Math.asin(k * ((2 * i) / (n - 1) - 1)) * 180) / Math.PI));
    }
    return Array.from({ length: n }, (_, i) => centre + dir * (-half + i * step));
  }

  /** What the knob's drawing covers, as fractions of its square measured from its centre (y down): the cap, the labels and the scale. */
  private knobExtent(): { minX: number; maxX: number; minY: number; maxY: number } {
    const c = this.config;
    const ptr = c?.cap === "pointer";
    const show = c?.show ?? "auto";
    const stops = this.stops();
    const chars = show === "none" ? 0 : Math.max(0, ...stops.map((x) => (show === "labels" || show === "both" || !x.icon ? x.label.length : 0)));
    const lw = chars ? Math.min(0.9, 0.07 * chars + 0.05) + (show === "both" ? 0.1 : 0) : show === "none" ? 0.04 : 0.14;
    const lh = 0.1;
    const reach = ptr ? (c?.light === "options" ? 0.49 : 0.42) : c?.light === "options" ? 0.44 : 0.38;
    let minX = ptr ? -0.13 : -0.27, maxX = -minX, minY = minX, maxY = maxX;
    for (const a of this.knobAngles()) {
      const sx = Math.sin((a * Math.PI) / 180), sy = -Math.cos((a * Math.PI) / 180);
      const tb = c?.labels_position === "left" || c?.labels_position === "right";
      const col = c?.labels_position === "left" ? -1 : 1;
      const cx = tb ? col * (reach + lw / 2) : reach * sx + (sx * lw) / 2, cy = tb ? (ptr ? 0.38 : 0.33) * sy : reach * sy + (sy * lh) / 2;
      minX = Math.min(minX, cx - lw / 2); maxX = Math.max(maxX, cx + lw / 2);
      minY = Math.min(minY, cy - lh / 2); maxY = Math.max(maxY, cy + lh / 2);
      if (ptr) { minX = Math.min(minX, 0.34 * sx - 0.03); maxX = Math.max(maxX, 0.34 * sx + 0.03); minY = Math.min(minY, 0.34 * sy - 0.03); maxY = Math.max(maxY, 0.34 * sy + 0.03); }
    }
    return { minX, maxX, minY, maxY: maxY + 0.03 };
  }

  /** The knob is the biggest square whose drawing fits the card, centred. Measured, as the card's own height is not known to CSS in every layout. */
  private fitKnob = (): void => {
    const slot = this.shadowRoot?.querySelector<HTMLElement>(".kslot");
    if (!slot) return;
    const e = this.knobExtent();
    const floor = KNOB[this.config?.size ?? "small"] * 0.6;
    const k = Math.floor(Math.max(floor, Math.min(slot.clientWidth / (e.maxX - e.minX), slot.clientHeight / (e.maxY - e.minY))));
    const set = (name: string, v: string) => this.style.getPropertyValue(name) !== v && this.style.setProperty(name, v);
    set("--_K", `${k}px`);
    set("--_dx", `${Math.round(-((e.minX + e.maxX) / 2) * k)}px`);
    set("--_dy", `${Math.round(-((e.minY + e.maxY) / 2) * k)}px`);
  };

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.watcher?.disconnect();
    this.watcher = undefined;
    this.watched = undefined;
  }

  /** In a panel with no rows set, ask for the rows the control needs; the lever, labels, lamp and title must fit. */
  protected updated(): void {
    const c = this.config;
    const face = this.shadowRoot?.querySelector(".kslot") ?? undefined;
    if (face !== this.watched) {
      this.watcher?.disconnect();
      this.watched = face;
      if (face) {
        this.watcher ??= new ResizeObserver(this.fitKnob);
        this.watcher.observe(face);
      }
    }
    this.fitKnob();
    if (!c || this.rowsSet() !== undefined) return;
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
    if (c.shape === "knob") {
      const e = this.knobExtent();
      return this.reportRows(this.rowsFor(KNOB[c.size ?? "small"] * (e.maxY - e.minY) + light + title + 4));
    }
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
    const step = knobStep(n, ptr, c.labels_position === "left" || c.labels_position === "right");
    const angles = this.knobAngles();
    const angle = (i: number) => angles[i];
    const turn = n > 1 && angles[n - 1] > angles[0] ? 1 : 0;
    // nudging: toward the left (or the top, with labels at the side) is the previous option, unless the order is reversed
    const sgn = c.order === "reversed" ? -1 : 1;
    const tb = c.labels_position === "left" || c.labels_position === "right";
    const S = KNOB[c.size ?? "small"];
    // no option matches the entity's state (unknown, unavailable, or a different spelling): rest in the middle of the fan, dimmed
    const cap = now < 0 ? (angles[0] + angles[n - 1]) / 2 : angle(now);
    const at = (a: number, r: number) => `${(50 + r * Math.sin((a * Math.PI) / 180)).toFixed(2)} ${(50 - r * Math.cos((a * Math.PI) / 180)).toFixed(2)}`;
    // the scale arc, on both caps (not when each option has its own lamp); the lamps sit on the same circle
    const rm = ptr ? 38 : 33;
    const arc = n > 1 && !own
      ? svg`<svg class="arc" viewBox="0 0 100 100"><path d="M ${at(angle(0), rm)} A ${rm} ${rm} 0 ${step * (n - 1) > 180 ? 1 : 0} ${turn} ${at(angle(n - 1), rm)}" />${stops.map((_, i) => svg`<line x1=${at(angle(i), rm).split(" ")[0]} y1=${at(angle(i), rm).split(" ")[1]} x2=${at(angle(i), rm - 2.5).split(" ")[0]} y2=${at(angle(i), rm - 2.5).split(" ")[1]} />`)}</svg>`
      : nothing;
    const drop = ptr
      ? svg`<svg viewBox="-31 -31 62 62"><defs><linearGradient id="rams-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9d8d3" /><stop offset="0.55" stop-color="#a9a8a3" /><stop offset="1" stop-color="#8f8e89" /></linearGradient></defs><path d="M10.05 -5.8 L3.35 -17.57 Q1.86 -20.18 1.86 -23.18 L1.86 -31.9 A1.86 1.86 0 0 0 -1.86 -31.9 L-1.86 -23.18 Q-1.86 -20.18 -3.35 -17.57 L-10.05 -5.8 A11.6 11.6 0 1 0 10.05 -5.8 Z" fill="url(#rams-metal)" stroke="rgba(0,0,0,0.25)" stroke-width="0.4" stroke-linejoin="round" /></svg>`
      : nothing;
    const pts = stops.map((s, i) => {
      const a = angle(i);
      const rad = (a * Math.PI) / 180;
      const ax = Math.round(Math.sin(rad) * 1000) / 1000;
      const ay = Math.round(-Math.cos(rad) * 1000) / 1000;
      // labels at the side stand in a straight column, text flush against it; above and below they follow the arc
      const sideSign = c.labels_position === "left" ? -1 : 1;
      const ux = tb ? sideSign : ax;
      const uy = tb ? 0 : ay;
      const bx = tb ? sideSign : ax;
      // at the side a label is centred on its marker (the tick of the arc or the lamp), which sits on the circle of radius rm
      const reach = ptr ? (own ? 49 : 42) : own ? 44 : 38;
      const ayv = tb ? (ay * rm) / reach : ay;
      const hasIcon = show !== "labels" && show !== "none" && !!s.icon;
      const icon = hasIcon ? html`<ha-icon class="ico" .icon=${s.icon}></ha-icon>` : nothing;
      const text = show === "labels" || show === "both" || (show === "auto" && !hasIcon) ? html`<span>${s.label}</span>` : nothing;
      const tone = own ? this.lampTone(s.option) : undefined;
      const lampEl = own ? html`<span class="ray" style="--r:${a}deg"><span class="pip" style="top: calc(-${rm}cqmin - 4px)"><i class="lamp sm ${tone ? `on ${tone}` : ""}"></i></span></span>` : nothing;
      const side = ux < -0.3 ? "ux-l" : "ux-1";
      return html`${lampEl}<span class="pt ${side}" style="--ax:${bx}; --ay:${ayv}; --ux:${ux}; --uy:${uy}; --pr:${reach}"><button class="lab ${i === now ? "on" : ""}" title=${s.label} @click=${() => this.choose(i)}>${icon}${text}</button></span>`;
    });
    return html`<div class="wrap ${pos}">
      ${pos ? html`<span class="outer">${title}</span>` : nothing}
      <div class="face k" style="overflow: visible; gap: 12px; --S:${S}px">${c.light === "below" ? nothing : lamp}
        <div class="kslot"><div class="knobbox ${tb ? "tb" : ""}" style="--a:${cap}deg; --fs:${z.fs}px; --ico:${z.ico}px">${arc}${pts}<span class="disc ${ptr ? "ptr" : ""} ${now < 0 ? "none" : ""}"><span class="turn">${ptr ? drop : html`<i class="dot"></i>`}</span></span><button class="half l ${this.nudgeTo(-1, sgn) < 0 ? "off" : ""}" aria-label=${tb ? "Up" : "Left"} @click=${() => this.nudge(-1, sgn)}></button><button class="half r ${this.nudgeTo(1, sgn) < 0 ? "off" : ""}" aria-label=${tb ? "Down" : "Right"} @click=${() => this.nudge(1, sgn)}></button></div></div>
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
    if (this.sceneMode()) {
      const cur = this.judgedOption();
      const tone = c.state_colours?.find((r) => r.state === cur)?.tone;
      view.signal = cur === undefined ? undefined : tone && tone !== "neutral" ? tone : tone === "neutral" ? undefined : "red";
    }
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
