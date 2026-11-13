/**
 * Panel editor. Reuses Home Assistant's own stack-card editor to add, move and configure the pieces.
 * That component is internal to HA (not a documented API), so all contact with it lives in this file.
 * If it is missing, the editor falls back to a plain notice and the YAML editor stays available.
 */
import { html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import type { Hass, PieceConfig } from "../shared/types";
import type { PanelConfig } from "./panel";

interface CardHelpers {
  createCardElement(config: unknown): HTMLElement;
}

class RamsPanelEditor extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @property({ attribute: false }) lovelace?: unknown;
  @property({ attribute: false }) private config?: PanelConfig;
  private stackOk = !!customElements.get("hui-stack-card-editor");

  setConfig(config: PanelConfig): void {
    this.config = config;
  }

  private emit(config: PanelConfig): void {
    this.lastCards = config.cards;   // the stack editor already shows these
    this.config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  private columnsChanged = (e: CustomEvent) => {
    e.stopPropagation();
    this.emit({ ...this.config!, ...(e.detail.value as Partial<PanelConfig>) });
  };

  private cardsChanged = (e: CustomEvent) => {
    e.stopPropagation();
    this.emit({ ...this.config!, cards: (e.detail.config.cards ?? []) as PieceConfig[] });
  };

  private lastCards?: PieceConfig[];

  /** Hand the current pieces to HA's stack editor, only when they changed from outside it. */
  protected updated(): void {
    const editor = this.renderRoot.querySelector("hui-stack-card-editor") as unknown as { setConfig(c: unknown): void } | null;
    const cards = this.config?.cards ?? [];
    if (editor && cards !== this.lastCards) {
      this.lastCards = cards;
      editor.setConfig({ type: "vertical-stack", cards });
    }
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.config || !this.hass) return nothing;
    const schema = [{ name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } }];
    return html`
      <ha-form .hass=${this.hass} .data=${{ columns: this.config.columns ?? 12 }} .schema=${schema} .computeLabel=${(s: { name: string }) => s.name} @value-changed=${this.columnsChanged}></ha-form>
      ${this.stackOk
        ? html`<hui-stack-card-editor
            .hass=${this.hass}
            .lovelace=${this.lovelace}
            @config-changed=${this.cardsChanged}
          ></hui-stack-card-editor>`
        : html`<p>The visual piece editor is not available in this Home Assistant version. Use "Show code editor" to edit the cards.</p>`}
    `;
  }
}

if (!customElements.get("rams-panel-editor")) customElements.define("rams-panel-editor", RamsPanelEditor);

/** Make HA load its stack editor (it is lazy-loaded) before our editor is shown. */
export async function loadPanelEditor(): Promise<HTMLElement> {
  try {
    const helpers: CardHelpers = await (window as unknown as { loadCardHelpers(): Promise<CardHelpers> }).loadCardHelpers();
    helpers.createCardElement({ type: "vertical-stack", cards: [] });
    await customElements.whenDefined("hui-vertical-stack-card");
    await (customElements.get("hui-vertical-stack-card") as unknown as { getConfigElement(): Promise<unknown> }).getConfigElement();
    await customElements.whenDefined("hui-stack-card-editor");
  } catch {
    /* fall through: the editor shows its fallback notice */
  }
  return document.createElement("rams-panel-editor");
}
