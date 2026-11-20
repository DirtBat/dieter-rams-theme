import { css, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { formEditor } from "../shared/form-editor";
import { tokens } from "../shared/styles";
import { actionFields, computeHelper, computeLabel, dropdown, num, SIZES } from "../shared/form";
import { Press } from "../shared/press";
import { readState, TONES, type Tone } from "../shared/state-rules";
import type { PieceConfig } from "../shared/types";

export interface LabelConfig extends PieceConfig {
  /** The words. Ignored when an entity is set. */
  text?: string;
  entity?: string;
  /** Print this attribute instead of the entity's state. */
  attribute?: string;
  unit?: string;
  /** Icon before the text (the standard HA icon picker). */
  icon?: string;
  size?: "small" | "medium" | "large";
  align?: "start" | "center" | "end";
  /** A hairline: under the text, over it, or on both sides of it. */
  line?: "none" | "below" | "above" | "beside";
  rules_entity?: string;
  state_colours?: Array<{ state: string; tone: Tone }>;
  value_colours?: Array<{ when: "above" | "below"; value: number; tone: Tone }>;
}

/**
 * A heading for a group of pieces in a panel. It is half a row high (24 px on the default grid), so it does not
 * cost the panel a whole row the way a display does.
 */
@customElement("rams-label")
export class RamsLabel extends Piece<LabelConfig> {
  protected hostFrame = false;
  private press = new Press(this, () => (this.actionable() ? this.config : undefined));

  protected signal(): string | undefined {
    return readState(this.hass, this.config?.entity, this.config ?? {}).signal;
  }

  static styles = [
    tokens,
    css`
      :host { display: block; min-width: 0; }
      .lab { box-sizing: border-box; height: 100%; min-height: 0; display: flex; align-items: center; gap: 10px; min-width: 0; color: var(--_ink); }
      .lab.start { justify-content: flex-start; } .lab.center { justify-content: center; } .lab.end { justify-content: flex-end; }
      .t { display: inline-flex; align-items: baseline; gap: 3px; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-transform: uppercase; letter-spacing: 0.1em; color: var(--_muted); }
      :host([signal]) .t { color: var(--_sig); }
      .ico { --mdc-icon-size: 1.2em; flex: none; align-self: center; margin-right: 4px; }
      .unit { font-size: 0.85em; letter-spacing: 0; }
      .small .t { font-size: 11px; }
      .medium .t { font-size: 14px; }
      .large .t { font-size: 18px; letter-spacing: 0.06em; }
      .rule { flex: 1; min-width: 12px; height: 1px; background: color-mix(in srgb, var(--_muted) 55%, transparent); }
      .lab.below, .lab.above { position: relative; }
      .lab.below::after, .lab.above::after { content: ""; position: absolute; left: 0; right: 0; height: 1px; background: color-mix(in srgb, var(--_muted) 55%, transparent); }
      .lab.below::after { bottom: 0; } .lab.above::after { top: 0; }
      :host([actionable]) .lab { cursor: pointer; }
    `,
  ];

  static getStubConfig(): LabelConfig {
    return { type: "custom:rams-label", text: "Section", line: "below" };
  }

  static getConfigElement(): Promise<HTMLElement> {
    return formEditor(this.getConfigForm());
  }

  static getConfigForm() {
    const tones = TONES.filter(([v]) => v !== "neutral").map(([value, label]) => ({ value, label }));
    return {
      schema: [
        { name: "text", selector: { text: {} } },
        { name: "entity", selector: { entity: {} } },
        { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "attribute", selector: { attribute: {} }, context: { filter_entity: "entity" } },
            { name: "unit", selector: { text: {} } },
            dropdown("size", SIZES),
            dropdown("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]]),
            dropdown("line", [["none", "None"], ["below", "Below the text"], ["above", "Above the text"], ["beside", "Both sides of the text"]]),
          ],
        },
        {
          type: "expandable",
          name: "",
          title: "Size in panel",
          schema: [{ type: "grid", name: "", schema: [num("columns", 1, 24), num("rows", 0.5, 12, { step: 0.5 })] }],
        },
        ...actionFields(),
        {
          type: "expandable",
          name: "",
          title: "State rules",
          schema: [
            { name: "rules_entity", selector: { entity: {} } },
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
                    tone: { label: "Colour", required: true, selector: { select: { mode: "dropdown", options: tones } } },
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
                    tone: { label: "Colour", required: true, selector: { select: { mode: "dropdown", options: tones } } },
                  },
                },
              },
            },
          ],
        },
      ],
      computeLabel,
      computeHelper: (s: { name: string }) =>
        s.name === "rows" ? "Only used inside a Rams panel. A label is half a row high (0.5) unless you say otherwise." : computeHelper(s),
    };
  }

  /** A label defaults to half a row; the panel reads this. */
  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 1, min_rows: 1 };
  }

  private value(): string {
    const c = this.config!;
    if (!c.entity) return c.text ?? "";
    const e = this.hass?.states[c.entity];
    if (!e) return "";
    return c.attribute ? String(e.attributes[c.attribute] ?? "") : e.state;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const line = c.line ?? "none";
    const beside = line === "beside";
    const align = beside ? "center" : (c.align ?? "start");
    const cls = [align, c.size ?? "small", line === "below" || line === "above" ? line : ""].filter(Boolean).join(" ");
    return html`<div class="lab ${cls}" @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}>
      ${beside ? html`<i class="rule"></i>` : nothing}
      <span class="t">${c.icon ? html`<ha-icon class="ico" .icon=${c.icon}></ha-icon>` : nothing}${this.value()}${c.unit ? html`<span class="unit">${c.unit}</span>` : nothing}</span>
      ${beside ? html`<i class="rule"></i>` : nothing}
    </div>`;
  }
}
