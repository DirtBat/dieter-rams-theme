import { css, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { Press } from "../shared/press";
import { canWarn, readState, TONES, type StateRules, type Tone } from "../shared/state-rules";
import { tokens } from "../shared/styles";
import { fitKey, keyStyles } from "../shared/key";
import { actionFields, computeLabel, computeHelper, dropdown, layoutFields } from "../shared/form";
import { clamp, defaultRange, readNumber, writeNumber } from "../shared/entity-value";
import type { PieceConfig } from "../shared/types";

export interface ButtonConfig extends PieceConfig, StateRules {
  entity?: string;
  /** The key's text. Defaults to the entity name. */
  name?: string;
  /** Icon printed on the key (the standard HA icon picker; the entity's own icon is offered as a hint). */
  icon?: string;
  /** Where the text goes: below (default), above, left, right, or printed on the key. */
  label_position?: "below" | "above" | "left" | "right" | "inside";
  /** Square (default) fills the size it is given; tall is half as wide, in the same box; round is a dome, always a circle. */
  shape?: "square" | "tall" | "round";
  /** Colours the whole key. A state rule's colour shows as a dot instead. */
  tone?: Tone;
  /** Climate only: tap changes the target temperature by this amount. For other entities use a perform-action tap action. */
  adjust_by?: number;
}

/**
 * A key. The dot shows the colour a state rule gives it, the LED above lights on a warning, and the name is
 * printed below (or above, left, right, or on the key). Size it with the Layout tab (or columns and rows in a panel).
 */
@customElement("rams-button")
export class RamsButton extends Piece<ButtonConfig> {
  protected hostFrame = false;
  protected minRows = true;
  private press = new Press(this, () => this.config, () => this.step());
  @state() private fit = { n: 1, m: 1, u: 0 };
  private ro?: ResizeObserver;

  /** Measure the key's room, so the key is a square or a whole number of squares whatever the grid gives it. */
  protected firstUpdated(): void {
    const area = this.renderRoot.querySelector(".keyarea");
    if (!area) return;
    this.ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      const f = fitKey(width, height);
      if (f.n !== this.fit.n || f.m !== this.fit.m || Math.abs(f.u - this.fit.u) > 0.5) this.fit = f;
    });
    this.ro.observe(area);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.ro?.disconnect();
  }

  static styles = [tokens, keyStyles, css`:host { display: block; }`];

  static getStubConfig(): ButtonConfig {
    return { type: "custom:rams-button", name: "Button", columns: 2, rows: 2 };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
        { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } },
        {
          type: "grid",
          name: "",
          schema: [
            dropdown("label_position", [["below", "Below"], ["above", "Above"], ["left", "Left"], ["right", "Right"], ["inside", "Inside"]]),
            dropdown("shape", [["square", "Square"], ["tall", "Tall"], ["round", "Round"]]),
            dropdown("tone", TONES),
          ],
        },
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

  private keySize(shape?: string): string {
    const { n, m, u } = this.fit;
    if (shape === "round" || !u) return "";
    return `--u:${u}px; width:${(shape === "tall" ? n / 2 : n) * u}px; height:${m * u}px`;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const view = readState(this.hass, c.entity, c);
    const name = c.name || String(this.hass?.states[c.entity ?? ""]?.attributes.friendly_name ?? "");
    const pos = c.label_position ?? "below";
    const tone = c.tone && c.tone !== "neutral" ? c.tone : "";
    const cls = ["key", c.shape ?? "", tone ? `filled ${tone}` : "", view.active ? "down" : ""].filter(Boolean).join(" ");
    return html`<div class="cell ${pos === "inside" ? "below" : pos}">
      <div class="stack">
        <i class="led ${canWarn(this.hass, c.entity, c) ? (view.alert ? "on" : "") : "off"}"></i>
        <div class="keyarea"><button class=${cls} style=${this.keySize(c.shape)} data-n=${this.fit.n} data-m=${this.fit.m} @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}>
          ${view.tone ? html`<i class="dot ${view.tone}"></i>` : nothing}
          ${c.icon ? html`<ha-icon class="ico" .icon=${c.icon}></ha-icon>` : nothing}
          ${pos === "inside" && name ? html`<span class="legend">${name}</span>` : nothing}
        </button></div>
      </div>
      ${pos === "inside" ? html`<div class="txt"></div>` : html`<div class="txt">${name}</div>`}
    </div>`;
  }
}
