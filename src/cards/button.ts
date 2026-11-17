import { css, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { Press } from "../shared/press";
import { readState, type StateRules } from "../shared/state-rules";
import { tokens } from "../shared/styles";
import { keyStyles } from "../shared/key";
import { actionFields, computeLabel, computeHelper, dropdown, layoutFields } from "../shared/form";
import { clamp, defaultRange, readNumber, writeNumber } from "../shared/entity-value";
import type { PieceConfig } from "../shared/types";

export interface ButtonConfig extends PieceConfig, StateRules {
  entity?: string;
  /** Printed below the key. Defaults to the entity name. */
  name?: string;
  /** Square (default) fills the size it is given; tall is half as wide, in the same box. */
  shape?: "square" | "tall";
  /** Climate only: tap changes the target temperature by this amount. For other entities use a perform-action tap action. */
  adjust_by?: number;
}

/**
 * A key. The cap is blank; the dot shows the colour a state rule gives it, the LED above lights on a warning,
 * and the name is printed below. Size it with the Layout tab (or columns and rows in a panel).
 */
@customElement("rams-button")
export class RamsButton extends Piece<ButtonConfig> {
  protected hostFrame = false;
  protected minRows = true;
  private press = new Press(this, () => this.config, () => this.step());

  static styles = [tokens, keyStyles, css`:host { display: block; }`];

  static getStubConfig(): ButtonConfig {
    return { type: "custom:rams-button", name: "Button", columns: 2, rows: 2 };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
        dropdown("shape", [["square", "Square"], ["tall", "Tall"]]),
        ...layoutFields(false),
        ...actionFields(),
        {
          type: "expandable",
          name: "",
          title: "State rules",
          schema: [
            { name: "rules_entity", selector: { entity: {} } },
            { name: "selected_when", selector: { state: { multiple: true } }, context: { filter_entity: "entity" } },
            { name: "alert_when", selector: { state: { multiple: true } }, context: { filter_entity: "entity" } },
            {
              name: "state_colours",
              selector: {
                object: {
                  multiple: true,
                  label_field: "state",
                  fields: {
                    state: { selector: { state: {} }, required: true },
                    tone: { selector: { select: { mode: "dropdown", options: ["red", "orange", "blue", "green", "grey"] } }, required: true },
                  },
                },
              },
            },
            { name: "adjust_by", selector: { number: { step: "any", mode: "box" } } },
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

  /** Climate stepper: the only case that needs more than a perform-action. */
  private step(): boolean {
    const c = this.config;
    if (!c?.adjust_by || !c.entity?.startsWith("climate.") || !this.hass) return false;
    const now = readNumber(this.hass, c.entity);
    if (now !== undefined) void writeNumber(this.hass, c.entity, clamp(now + c.adjust_by, defaultRange(this.hass, c.entity)));
    return true;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const view = readState(this.hass, c.entity, c);
    const name = c.name || String(this.hass?.states[c.entity ?? ""]?.attributes.friendly_name ?? "");
    const cls = ["key", c.shape === "tall" ? "tall" : "", view.active ? "down" : "", view.tone ?? ""].filter(Boolean).join(" ");
    return html`<div class="cell">
      <i class="led ${view.alert ? "on" : ""}"></i>
      <div class="keyarea"><button class=${cls} @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}>
        ${view.tone ? html`<i class="dot"></i>` : nothing}
      </button></div>
      <div class="txt">${name}</div>
    </div>`;
  }
}
