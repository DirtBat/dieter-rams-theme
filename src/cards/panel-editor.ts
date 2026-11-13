/**
 * Panel editor. Reuses Home Assistant's own stack-card editor to add, move and configure the pieces.
 * That component is internal to HA (not a documented API), so all contact with it lives in this file.
 * If it is missing, the editor falls back to a plain notice and the YAML editor stays available.
 */
import { html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { actionFields, computeLabel, dropdown, FRAMES, num } from "../shared/form";
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
    const editor = this.renderRoot.querySelector("hui-stack-card-editor") as unknown as { setConfig(c: unknown): void; shadowRoot?: ShadowRoot } | null;
    this.hideStackTitle(editor?.shadowRoot);
    const cards = this.config?.cards ?? [];
    if (editor && cards !== this.lastCards) {
      this.lastCards = cards;
      editor.setConfig({ type: "vertical-stack", cards });
    }
  }

  /** The stack editor brings its own "Title" field; the panel has a real one, so hide the stray copy. */
  private hideStackTitle(root?: ShadowRoot | null): void {
    if (!root || root.querySelector("style[data-rams]")) return;
    const style = document.createElement("style");
    style.dataset.rams = "";
    style.textContent = "ha-form { display: none; }";
    root.append(style);
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.config || !this.hass) return nothing;
    const c = this.config;
    const schema = [
      { name: "title", selector: { text: {} } },
      { type: "grid", name: "", schema: [num("columns", 1, 24), num("spacing", 0, 24), dropdown("frame", FRAMES)] },
      ...actionFields(),
    ];
    const data = { ...c, columns: c.columns ?? 12, spacing: c.spacing ?? 8, frame: c.frame ?? "raised" };
    return html`
      <ha-form .hass=${this.hass} .data=${data} .schema=${schema} .computeLabel=${(s: { name: string }) => (s.name === "columns" ? "grid columns" : computeLabel(s))} @value-changed=${this.columnsChanged}></ha-form>
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
