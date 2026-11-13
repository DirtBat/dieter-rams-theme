import { css, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { fireAction } from "../shared/actions";
import { readState, type StateRules, type Tone } from "../shared/state-rules";
import { tokens } from "../shared/styles";
import { clamp, defaultRange, readNumber, writeNumber } from "../shared/entity-value";
import type { ActionConfig, PieceConfig } from "../shared/types";

export interface ButtonConfig extends PieceConfig, StateRules {
  entity?: string;
  name?: string;
  /** Small line above the name. */
  label?: string;
  /** Use the entity state as the small line above the name. */
  show_state?: boolean;
  shape?: "key" | "round";
  tone?: Tone;
  /** Stepper: tap changes the entity's number by this amount (negative to decrease). Replaces tap_action. */
  adjust_by?: number;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
}

const HOLD_MS = 500;

@customElement("rams-button")
export class RamsButton extends Piece<ButtonConfig> {
  private holdTimer?: number;
  private held = false;

  static styles = [
    tokens,
    css`
      :host { display: block; height: 100%; min-width: 0; }
      .btn {
        box-sizing: border-box; height: 100%; width: 100%;
        display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2px;
        background: var(--_cap); color: var(--_ink);
        border: var(--_border); border-radius: var(--_radius); box-shadow: var(--_raised);
        font: inherit; font-size: 13px; cursor: pointer; user-select: none; position: relative; padding: 0 6px;
      }
      .btn:active { box-shadow: var(--_pressed); filter: brightness(0.94); }
      .small { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      .dark { background: var(--_cap-dark); color: var(--_cap-dark-ink); }
      .alert { background: var(--_alert); color: var(--_alert-ink); }
      .alert .small, .dark .small { color: inherit; opacity: 0.8; }
      .selected { outline: 2px solid var(--_ink); outline-offset: -2px; }
      /* round: a circle as tall as the cell, centred */
      .round-cell { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; }
      .round-cell .small { text-transform: none; letter-spacing: 0; }
      .round { aspect-ratio: 1; height: auto; width: min(100%, var(--_row)); flex: 0 1 auto; border-radius: 50%; padding: 0; }
      .round-cell.has-label .round { width: min(100%, 38px); }
    `,
  ];

  static getStubConfig(): ButtonConfig {
    return { type: "custom:rams-button", name: "Button" };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
        { name: "label", selector: { text: {} } },
        { name: "show_state", selector: { boolean: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "shape", selector: { select: { mode: "dropdown", options: [{ value: "key", label: "Key" }, { value: "round", label: "Round" }] } } },
            { name: "tone", selector: { select: { mode: "dropdown", options: [{ value: "neutral", label: "Neutral" }, { value: "dark", label: "Dark" }, { value: "alert", label: "Alert" }] } } },
            { name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } },
            { name: "rows", selector: { number: { min: 1, max: 6, mode: "box" } } },
            { name: "adjust_by", selector: { number: { step: "any", mode: "box" } } },
          ],
        },
        {
          type: "expandable",
          name: "",
          title: "State rules",
          schema: [
            { name: "alert_when", selector: { select: { multiple: true, custom_value: true, options: [] } } },
            { name: "selected_when", selector: { select: { multiple: true, custom_value: true, options: [] } } },
          ],
        },
        { name: "tap_action", selector: { ui_action: {} } },
        { name: "hold_action", selector: { ui_action: {} } },
      ],
      computeLabel: (s: { name: string }) => s.name.replace(/_/g, " "),
    };
  }

  private down = () => {
    this.held = false;
    this.holdTimer = window.setTimeout(() => {
      this.held = true;
      if (this.config) fireAction(this, this.config, "hold");
    }, HOLD_MS);
  };
  private up = () => window.clearTimeout(this.holdTimer);
  private onTap = () => {
    const c = this.config;
    if (this.held || !c) return;
    if (c.adjust_by && c.entity && this.hass) {
      const now = readNumber(this.hass, c.entity);
      if (now === undefined) return;
      const range = defaultRange(this.hass, c.entity);
      void writeNumber(this.hass, c.entity, clamp(now + c.adjust_by, range));
      return;
    }
    fireAction(this, c, "tap");
  };

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const view = readState(this.hass, c.entity, c);
    const tone = view.alert ? "alert" : (c.tone ?? "neutral");
    const small = c.show_state ? view.state : c.label;
    const shape = c.shape ?? "key";
    const cls = [shape === "round" ? "btn round" : "btn", tone !== "neutral" ? tone : "", view.selected ? "selected" : ""].filter(Boolean).join(" ");
    const button = html`<button class=${cls} @pointerdown=${this.down} @pointerup=${this.up} @pointerleave=${this.up} @click=${this.onTap}>
      ${shape === "key" && small ? html`<span class="small">${small}</span>` : nothing}
      <span>${c.name ?? ""}</span>
    </button>`;
    if (shape === "key") return button;
    return html`<div class="round-cell ${small ? "has-label" : ""}">${small ? html`<span class="small">${small}</span>` : nothing}${button}</div>`;
  }
}
