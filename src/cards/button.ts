import { css, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { formEditor } from "../shared/form-editor";
import { Press } from "../shared/press";
import { canWarn, readState, TONES, type StateRules, type Tone } from "../shared/state-rules";
import { tokens } from "../shared/styles";
import { fitKey, keyStyles } from "../shared/key";
import { actionFields, computeLabel, computeHelper, dropdown, layoutFields } from "../shared/form";
import { clamp, defaultRange, readNumber, writeNumber } from "../shared/entity-value";
import type { PieceConfig } from "../shared/types";

/** The black frame round a square key, in px. */
const FRAME = 3;

export interface ButtonConfig extends PieceConfig, StateRules {
  entity?: string;
  /** The key's text. Defaults to the entity name. */
  name?: string;
  /** Icon printed on the key (the standard HA icon picker; the entity's own icon is offered as a hint). */
  icon?: string;
  /** Where the text goes: below (default), above, left, right, or printed on the key. */
  label_position?: "below" | "above" | "left" | "right" | "inside";
  /** Square (default): always a square, the biggest that fits, in a black cut-out; tall is half as wide as high; round is a dome, always a circle. */
  shape?: "square" | "tall" | "round";
  /** Colours the whole key. A state rule's colour then replaces it while the rule matches; a key with no tone shows the rule's colour as a dot. */
  tone?: Tone;
  /** Colours the icon (same colours as tone). Neutral keeps the key's ink. */
  icon_tone?: Tone;
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

  /**
   * Measure the room left for the key (the card minus the LED and the name), so the key is a square or a whole
   * number of squares whatever the grid gives it, and the key, LED and name stay one compact group.
   */
  protected firstUpdated(): void {
    const cell = this.renderRoot.querySelector(".cell");
    if (!cell) return;
    this.ro = new ResizeObserver(() => this.measure());
    this.ro.observe(cell);
  }

  protected updated(): void {
    this.measure();
  }

  private measure(): void {
    const cell = this.renderRoot.querySelector<HTMLElement>(".cell");
    if (!cell) return;
    const side = cell.classList.contains("left") || cell.classList.contains("right");
    const led = cell.querySelector<HTMLElement>(".led");
    const txt = cell.querySelector<HTMLElement>(".txt");
    const gap = 5;
    const aw = cell.clientWidth - (side && txt ? txt.offsetWidth + gap : 0);
    const ah = cell.clientHeight - (led ? led.offsetHeight + gap : 0) - (!side && txt ? txt.offsetHeight + gap : 0);
    const w = Math.max(aw, 24), h = Math.max(ah, 24);
    // a round key is always a circle: its room is the biggest square
    const sq = this.isSquare();
    const f = this.config?.shape === "tall" ? fitKey(w, h) : { n: 1, m: 1, u: Math.max(0, Math.min(w, sq ? h - 2 * FRAME : h)) };
    if (f.n !== this.fit.n || f.m !== this.fit.m || Math.abs(f.u - this.fit.u) > 0.5) this.fit = f;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.ro?.disconnect();
  }

  static styles = [tokens, keyStyles, css`:host { display: block; }`];

  static getStubConfig(): ButtonConfig {
    return { type: "custom:rams-button", name: "Button", columns: 2, rows: 2 };
  }

  static getConfigElement(): Promise<HTMLElement> {
    return formEditor(this.getConfigForm());
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
            dropdown("icon_tone", TONES),
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
                    state: { label: "State", selector: { text: {} }, required: true },
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

  /** Anything that is not round or tall is a square key (an old or unknown shape such as "key" included). */
  private isSquare(): boolean {
    return this.config?.shape !== "round" && this.config?.shape !== "tall";
  }

  private areaSize(): string {
    const { n, m, u } = this.fit;
    if (!u) return "width:0; height:0";
    const sq = this.isSquare();
    return `width:${n * u}px; height:${m * u + (sq ? 2 * FRAME : 0)}px`;
  }

  private keySize(shape?: string): string {
    const { n, m, u } = this.fit;
    if (shape === "round" || !u) return "";
    if (shape !== "tall") return `--u:${u}px; width:${u}px; height:${u}px`;
    return `--u:${u}px; width:${(shape === "tall" ? n / 2 : n) * u}px; height:${m * u}px`;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const view = readState(this.hass, c.entity, c);
    const name = c.name || String(this.hass?.states[c.entity ?? ""]?.attributes.friendly_name ?? "");
    const pos = c.label_position ?? "below";
    const own = c.tone && c.tone !== "neutral" ? c.tone : "";
    // a coloured key takes the colour a state rule gives it; a plain key shows it as a dot
    const tone = own ? (view.tone ?? own) : "";
    const square = this.isSquare();
    const cls = ["key", square ? "sq" : "", c.shape === "round" || c.shape === "tall" ? c.shape : "", tone ? `filled ${tone}` : "", view.active ? "down" : ""].filter(Boolean).join(" ");
    return html`<div class="cell ${pos === "inside" ? "below" : pos}">
      <div class="stack">
        <i class="led ${canWarn(this.hass, c.entity, c) ? (view.alert ? "on" : "") : "off"}"></i>
        <div class="keyarea" style=${this.areaSize()}>${square ? html`<i class="plate"></i>` : nothing}<button class=${cls} style=${this.keySize(c.shape)} data-n=${this.fit.n} data-m=${this.fit.m} @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}>
          ${view.tone && !own ? html`<i class="dot ${view.tone}"></i>` : nothing}
          ${c.icon ? html`<ha-icon class="ico ${c.icon_tone && c.icon_tone !== "neutral" ? `tinted ${c.icon_tone}` : ""}" .icon=${c.icon}></ha-icon>` : nothing}
          ${pos === "inside" && name ? html`<span class="legend">${name}</span>` : nothing}
        </button></div>
      </div>
      ${pos === "inside" || (!name.trim() && (pos === "left" || pos === "right")) ? nothing : html`<div class="txt">${name}</div>`}
    </div>`;
  }
}
