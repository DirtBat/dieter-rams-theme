import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { tokens } from "../shared/styles";
import type { PieceConfig } from "../shared/types";

export interface ListConfig extends PieceConfig {
  entity?: string;
  /** Attribute holding the list. Without it, the state is parsed as a JSON list. */
  attribute?: string;
  /** Key of each item that gives the main text. Items that are plain strings need no key. */
  primary_key?: string;
  secondary_key?: string;
  title?: string;
  empty_text?: string;
  /** Show at most this many items, then "+n more". */
  max_items?: number;
}

@customElement("rams-list")
export class RamsList extends Piece<ListConfig> {
  static styles = [
    tokens,
    css`
      :host { display: block; min-width: 0; }
      .list { display: flex; flex-direction: column; gap: var(--_gap); }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); height: 24px; display: flex; align-items: center; }
      .item { box-sizing: border-box; height: 24px; display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 0 10px; font-size: 12px; border-radius: var(--_radius); border: var(--_border); background: var(--_cap); }
      .item span:last-child { color: var(--_muted); }
      .empty, .more { font-size: 12px; color: var(--_muted); padding: 0 2px; }
    `,
  ];

  static getStubConfig(): ListConfig {
    return { type: "custom:rams-list", columns: 12, rows: "auto" as unknown as number, empty_text: "None" };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "entity", selector: { entity: {} } },
        { name: "attribute", selector: { attribute: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "primary_key", selector: { text: {} } },
            { name: "secondary_key", selector: { text: {} } },
            { name: "max_items", selector: { number: { min: 1, max: 50, mode: "box" } } },
            { name: "empty_text", selector: { text: {} } },
            { name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } },
          ],
        },
      ],
      computeLabel: (s: { name: string }) => s.name.replace(/_/g, " "),
    };
  }

  private items(): unknown[] {
    const c = this.config!;
    const e = c.entity ? this.hass?.states[c.entity] : undefined;
    if (!e) return [];
    const raw = c.attribute ? e.attributes[c.attribute] : e.state;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  private text(item: unknown, key?: string): string {
    if (item && typeof item === "object") return key ? String((item as Record<string, unknown>)[key] ?? "") : "";
    return key ? "" : String(item);
  }

  protected updated(_changed: PropertyValues): void {
    const box = this.renderRoot.querySelector(".list") as HTMLElement | null;
    if (box) this.reportRows(this.rowsFor(box.offsetHeight));
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const all = this.items();
    const max = c.max_items ?? all.length;
    const shown = all.slice(0, max);
    return html`<div class="list">
      ${c.title ? html`<div class="title">${c.title}</div>` : nothing}
      ${shown.length === 0 && c.empty_text ? html`<div class="empty">${c.empty_text}</div>` : nothing}
      ${shown.map((i) => html`<div class="item"><span>${this.text(i, c.primary_key)}</span><span>${this.text(i, c.secondary_key)}</span></div>`)}
      ${all.length > shown.length ? html`<div class="more">+${all.length - shown.length} more</div>` : nothing}
    </div>`;
  }
}
