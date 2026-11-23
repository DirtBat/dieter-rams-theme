import { formatValue } from "../shared/entity-value";
import { css, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { formEditor } from "../shared/form-editor";
import { tokens } from "../shared/styles";
import { faceStyles } from "../shared/face";
import { actionFields, computeLabel, computeHelper, layoutFields } from "../shared/form";
import { Press } from "../shared/press";
import { readState, TONES, type Tone } from "../shared/state-rules";
import { numeric, pick } from "../shared/stub";
import type { Hass, PieceConfig } from "../shared/types";

type Size = "small" | "medium" | "large";

export interface DisplayConfig extends PieceConfig {
  /** Line above the value. */
  title?: string;
  /** Fixed text for the value line. Ignored when an entity is set. */
  text?: string;
  entity?: string;
  /** Icon before the value (the standard HA icon picker). */
  icon?: string;
  /** Show this attribute instead of the state. */
  attribute?: string;
  unit?: string;
  /** Warning (red outline and triangle) while the entity state is one of these. Default: automatic for problem-type binary sensors. */
  alert_when?: string[];
  rules_entity?: string;
  /** A colour per state, instead of red for every warning. */
  state_colours?: Array<{ state: string; tone: Tone }>;
  /** A colour per number: above or below a value. */
  value_colours?: Array<{ when: "above" | "below"; value: number; tone: Tone }>;
  /** Where the title goes: inside the box (default), or printed outside it. */
  title_position?: "inside" | "above" | "below" | "left" | "right";
  /** A status lamp in the display: left or right of the text, or alone. It lights in the colour the state rules give, and the display then stays unfilled. */
  light?: "none" | "left" | "right" | "only";
  /** What the display prints: title and value (default), the value only, the title only, or none (an icon and the light alone). An outside title is not affected. */
  show?: "all" | "value" | "title" | "none";
  size?: Size;
  align?: "start" | "center" | "end";
}

@customElement("rams-display")
export class RamsDisplay extends Piece<DisplayConfig> {
  protected defaultFrame = "recessed" as const;
  /** The display draws its own box (the face), so a title can sit outside it. */
  protected hostFrame = false;
  private press = new Press(this, () => (this.actionable() ? this.config : undefined));

  protected signal(): string | undefined {
    if (this.lamp()) return undefined;
    return readState(this.hass, this.config?.entity, this.config ?? {}).signal;
  }

  private lamp(): boolean {
    return !!this.config?.light && this.config.light !== "none";
  }

  static styles = [
    tokens,
    faceStyles,
    css`
      /* the lamp and the text are one group, centred; spare room goes outside it */
      .box { box-sizing: border-box; height: 100%; display: flex; align-items: center; gap: 8px; }
      .box.lamp-right { flex-direction: row-reverse; }
      .box.lamp-only { justify-content: center; }
      .block { flex: 1; min-width: 0; overflow: hidden; display: flex; flex-direction: column; justify-content: center; gap: 2px; }
      .start .block { align-items: flex-start; text-align: left; }
      .center .block { align-items: center; text-align: center; }
      .end .block { align-items: flex-end; text-align: right; }
      /* no text: the icon and the lamp sit together, on the side the alignment says */
      .notext .block { flex: none; }
      /* icon and lamp on one centre line */
      .noval .ico { margin: 0; }
      .notext.start { justify-content: flex-start; } .notext.center { justify-content: center; } .notext.end { justify-content: flex-end; }
      .notext.lamp-right.start { justify-content: flex-end; } .notext.lamp-right.end { justify-content: flex-start; }
      /* a lamp with its label beside it: the lamp keeps a fixed column, so lamps line up from card to card, and the label takes all the room that is left, next to its lamp */
      .wrap.lamp-only.left .face, .wrap.lamp-only.right .face { flex: none; width: 28px; }
      .wrap.lamp-only.left .outer, .wrap.lamp-only.right .outer { flex: 1; max-width: none; }
      .wrap.lamp-only.right .outer { text-align: left; }
      .wrap.lamp-only.left .outer { text-align: right; }
      .has-title { padding: 8px 0; }
      .lamp { flex: none; width: 12px; height: 12px; border-radius: 50%; background: var(--_lens); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.35); }
      .lamp-only .lamp { width: 16px; height: 16px; }
      .lamp.on { background: var(--l); box-shadow: 0 0 max(var(--_glow), 6px) 1px color-mix(in srgb, var(--l) 85%, transparent), inset 0 0 2px rgba(255, 255, 255, 0.6); }
      .lamp.red { --l: var(--_alert); } .lamp.orange { --l: var(--_orange); } .lamp.blue { --l: var(--_blue); } .lamp.green { --l: var(--_green); } .lamp.grey { --l: var(--_grey); }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      /* icon and text on one centre line; the unit sits on the text's baseline */
      .value { display: flex; align-items: center; line-height: 1.1; }
      .txt { display: flex; align-items: baseline; gap: 3px; white-space: nowrap; }
      .ico { --mdc-icon-size: 1em; flex: none; display: inline-flex; align-items: center; justify-content: center; width: 1em; height: 1em; margin-right: 6px; }
      .small .value { font-size: 12px; }
      .medium .value { font-size: 20px; }
      .large .value { font-size: 44px; letter-spacing: -0.02em; }
      .unit { font-size: 0.4em; color: var(--_muted); letter-spacing: 0; }
    `,
  ];

  /** A large LCD with the value of one of your number sensors and its unit. */
  static getStubConfig(hass?: Hass): DisplayConfig {
    const e = pick(hass, ["sensor"], numeric);
    if (!e) return { type: "custom:rams-display", title: "Temperature", text: "21.5", unit: "\u00b0C", size: "large", frame: "recessed", columns: 6, rows: 2 };
    const unit = typeof e.attributes.unit_of_measurement === "string" ? e.attributes.unit_of_measurement : undefined;
    return { type: "custom:rams-display", title: String(e.attributes.friendly_name ?? "Value"), entity: e.entity_id, ...(unit ? { unit } : {}), size: "large", frame: "recessed", columns: 6, rows: 2 };
  }

  static getConfigElement(): Promise<HTMLElement> {
    return formEditor(this.getConfigForm());
  }

  static getConfigForm() {
    const dropdown = (name: string, options: Array<[string, string]>) => ({
      name,
      selector: { select: { mode: "dropdown", options: options.map(([value, label]) => ({ value, label })) } },
    });
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "text", selector: { text: {} } },
        { name: "entity", selector: { entity: {} } },
        { name: "attribute", selector: { attribute: {} }, context: { filter_entity: "entity" } },
        { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "unit", selector: { text: {} } },
            dropdown("size", [["small", "Small"], ["medium", "Medium"], ["large", "Large"]]),
            dropdown("show", [["all", "Title and value"], ["value", "Value only"], ["title", "Title only"], ["none", "Icon and light only"]]),
            dropdown("title_position", [["inside", "Inside"], ["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
            dropdown("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]]),
            dropdown("light", [["none", "None"], ["left", "Left"], ["right", "Right"], ["only", "Only the light"]]),
          ],
        },
        ...layoutFields(),
        ...actionFields(),
        {
          type: "expandable",
          name: "",
          title: "State rules",
          schema: [
            { name: "rules_entity", selector: { entity: {} } },
            { name: "alert_when", selector: { state: { multiple: true } }, context: { filter_entity: "entity" } },
            {
              name: "value_colours",
              selector: {
                object: {
                  multiple: true,
                  label_field: "value",
                  description_field: "when",
                  fields: {
                    when: { label: "When the number is", required: true, selector: { select: { mode: "dropdown", options: [{ value: "above", label: "Above" }, { value: "below", label: "Below" }] } } },
                    value: { label: "Value", required: true, selector: { number: { mode: "box", step: "any" } } },
                    tone: { label: "Colour", required: true, selector: { select: { mode: "dropdown", options: TONES.filter(([v]) => v !== "neutral").map(([value, label]) => ({ value, label })) } } },
                  },
                },
              },
            },
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

  private value(): string {
    const c = this.config!;
    if (!c.entity) return c.text ?? "";
    const entity = this.hass?.states[c.entity];
    if (!entity) return "";
    return formatValue(this.hass, c.entity, c.attribute);
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const title = c.title?.trim() ?? "";
    const outside = c.title_position && c.title_position !== "inside" && !!title;
    const inside = !!title && !outside;
    const light = this.lamp() ? c.light! : "none";
    const show = c.show ?? "all";
    const notext = show === "none" && light !== "only";
    const showTitle = inside && (show === "all" || show === "title");
    const showValue = show === "all" || show === "value";
    const cls = [c.align ?? "start", c.size ?? "medium", showTitle && light !== "only" ? "has-title" : "", notext ? "notext" : "", !showValue ? "noval" : "", light !== "none" ? `lamp-${light}` : ""].filter(Boolean).join(" ");
    const tone = light !== "none" ? readState(this.hass, c.entity, c).signal : undefined;
    const face = [c.frame ?? this.defaultFrame, this.hasAttribute("signal") ? "sig" : ""].filter((x) => x && x !== "none").join(" ");
    return html`<div class="wrap ${outside ? c.title_position : ""} ${light === "only" ? "lamp-only" : ""}">
      ${outside ? html`<span class="outer">${title}</span>` : nothing}
      <div class="face ${face}" @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}>
        <div class="box ${cls}">
          ${light !== "none" ? html`<i class="lamp ${tone ? `on ${tone}` : ""}"></i>` : nothing}
          ${light === "only" ? nothing : html`<div class="block">
            ${showTitle ? html`<span class="title">${title}</span>` : nothing}
            <span class="value">${c.icon ? html`<ha-icon class="ico" .icon=${c.icon}></ha-icon>` : nothing}${showValue ? html`<span class="txt">${this.value()}${c.unit ? html`<span class="unit">${c.unit}</span>` : nothing}</span>` : nothing}</span>
          </div>`}
        </div>
      </div>
    </div>`;
  }
}
