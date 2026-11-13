import { css, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { tokens } from "../shared/styles";
import { computeLabel, layoutFields } from "../shared/form";
import type { PieceConfig } from "../shared/types";

type Size = "small" | "medium" | "large";

export interface DisplayConfig extends PieceConfig {
  /** Line above the value. */
  title?: string;
  /** Fixed text for the value line. Ignored when an entity is set. */
  text?: string;
  entity?: string;
  /** Show this attribute instead of the state. */
  attribute?: string;
  unit?: string;
  size?: Size;
  align?: "start" | "center" | "end";
}

@customElement("rams-display")
export class RamsDisplay extends Piece<DisplayConfig> {
  protected defaultFrame = "recessed" as const;
  static styles = [
    tokens,
    css`
            .box { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; overflow: hidden; }
      .start { align-items: flex-start; text-align: left; }
      .center { align-items: center; text-align: center; }
      .end { align-items: flex-end; text-align: right; }
      .box.has-title { justify-content: flex-start; padding: 8px 0; }
      .has-title .value { flex: 1; display: flex; align-items: center; }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      .value { line-height: 1.1; }
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
        {
          type: "grid",
          name: "",
          schema: [
            { name: "attribute", selector: { attribute: {} } },
            { name: "unit", selector: { text: {} } },
            dropdown("size", [["small", "Small"], ["medium", "Medium"], ["large", "Large"]]),
            dropdown("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]]),
          ],
        },
        layoutFields(),
      ],
      computeLabel,
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
    const cls = [c.align ?? "start", c.size ?? "medium", c.title ? "has-title" : ""].filter(Boolean).join(" ");
    return html`<div class="box ${cls}">
      ${c.title ? html`<span class="title">${c.title}</span>` : nothing}
      <span class="value">${this.value()}${c.unit ? html`<span class="unit">${c.unit}</span>` : nothing}</span>
    </div>`;
  }
}
