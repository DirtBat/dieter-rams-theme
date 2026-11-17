import { css, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { Press } from "../shared/press";
import { canWarn, readState, type StateRules } from "../shared/state-rules";
import { tokens } from "../shared/styles";
import { keyStyles } from "../shared/key";
import { actionFields, computeLabel, computeHelper, layoutFields } from "../shared/form";
import type { PieceConfig } from "../shared/types";

export interface SwitchConfig extends PieceConfig, Pick<StateRules, "rules_entity" | "selected_when" | "alert_when"> {
  entity?: string;
  /** Printed below the switch. Defaults to the entity name. */
  name?: string;
}

/** An on/off switch: the lever sits left for off and right for on. Tapping it toggles the entity (or runs the tap action). */
@customElement("rams-switch")
export class RamsSwitch extends Piece<SwitchConfig> {
  protected hostFrame = false;
  protected minRows = true;
  private press = new Press(this, () => this.config);

  static styles = [
    tokens,
    keyStyles,
    css`
      :host { display: block; }
      .well { flex: none; display: flex; flex-direction: column; align-items: center; gap: 4px; }
      .slot { position: relative; box-sizing: border-box; width: 52px; height: 26px; padding: 0; border: 0; border-radius: 4px; background: var(--_slot, #2b2118); box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6); cursor: pointer; -webkit-tap-highlight-color: transparent; }
      .lever { position: absolute; top: 3px; left: 3px; width: 24px; height: 20px; border-radius: 3px; background: linear-gradient(180deg, var(--_lever, #efece4), color-mix(in srgb, var(--_lever, #efece4) 80%, #000)); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5); transition: left 0.12s ease-out; }
      .on .lever { left: 25px; }
      .pos { display: flex; justify-content: space-between; width: 52px; font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--_muted); }
    `,
  ];

  static getStubConfig(): SwitchConfig {
    return { type: "custom:rams-switch", name: "Switch", columns: 2, rows: 2 };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
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

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const view = readState(this.hass, c.entity, c);
    const name = c.name || String(this.hass?.states[c.entity ?? ""]?.attributes.friendly_name ?? "");
    return html`<div class="cell">
      <i class="led ${canWarn(this.hass, c.entity, c) ? (view.alert ? "on" : "") : "off"}"></i>
      <div class="well">
        <button class="slot ${view.active ? "on" : ""}" aria-pressed=${view.active} @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}><i class="lever"></i></button>
        <div class="pos"><span>off</span><span>on</span></div>
      </div>
      <div class="txt">${name}</div>
    </div>`;
  }
}
