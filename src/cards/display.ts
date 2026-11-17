import { css, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { tokens } from "../shared/styles";
import { faceStyles } from "../shared/face";
import { actionFields, computeLabel, computeHelper, layoutFields } from "../shared/form";
import { Press } from "../shared/press";
import { readState, TONES, type Tone } from "../shared/state-rules";
import type { PieceConfig } from "../shared/types";

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
    return readState(this.hass, this.config?.entity, this.config ?? {}).signal;
  }

  static styles = [
    tokens,
    faceStyles,
    css`
      .box { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; overflow: hidden; }
      .start { align-items: flex-start; text-align: left; }
      .center { align-items: center; text-align: center; }
      .end { align-items: flex-end; text-align: right; }
      .box.has-title { justify-content: flex-start; padding: 8px 0; }
      .has-title .value { flex: 1; display: flex; align-items: center; }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      .value { line-height: 1.1; }
      .ico { --mdc-icon-size: 1em; margin-right: 6px; vertical-align: -0.12em; }
      .small .value { font-size: 12px; }
      .medium .value { font-size: 20px; }
      .large .value { font-size: 44px; letter-spacing: -0.02em; }
      .unit { font-size: 0.4em; color: var(--_muted); margin-left: 3px; letter-spacing: 0; }
    `,
  ];

  static getStubConfig(): DisplayConfig {
    return { type: "custom:rams-display", title: "Title", text: "Value", size: "medium" };
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
        { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "attribute", selector: { attribute: {} }, context: { filter_entity: "entity" } },
            { name: "unit", selector: { text: {} } },
            dropdown("title_position", [["inside", "Inside"], ["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
            dropdown("size", [["small", "Small"], ["medium", "Medium"], ["large", "Large"]]),
            dropdown("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]]),
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
    return c.attribute ? String(entity.attributes[c.attribute] ?? "") : entity.state;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const outside = c.title_position && c.title_position !== "inside" && !!c.title;
    const inside = !!c.title && !outside;
    const cls = [c.align ?? "start", c.size ?? "medium", inside ? "has-title" : ""].filter(Boolean).join(" ");
    const face = [c.frame ?? this.defaultFrame, this.hasAttribute("signal") ? "sig" : ""].filter((x) => x && x !== "none").join(" ");
    return html`<div class="wrap ${outside ? c.title_position : ""}">
      ${outside ? html`<span class="outer">${c.title}</span>` : nothing}
      <div class="face ${face}" @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}>
        <div class="box ${cls}">
          ${inside ? html`<span class="title">${c.title}</span>` : nothing}
          <span class="value">${c.icon ? html`<ha-icon class="ico" .icon=${c.icon}></ha-icon>` : nothing}${this.value()}${c.unit ? html`<span class="unit">${c.unit}</span>` : nothing}</span>
        </div>
      </div>
    </div>`;
  }
}
