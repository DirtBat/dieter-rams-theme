import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { readState, TONES, type Tone } from "../shared/state-rules";
import { Piece } from "../shared/piece";
import { fireAction } from "../shared/actions";
import { tokens } from "../shared/styles";
import { computeLabel, computeHelper, dropdown, layoutFields, num } from "../shared/form";
import type { Hass, HassEntity, PieceConfig } from "../shared/types";

/** A row: just an entity id, or an entity with its own name and a category (shown as a coloured dot). */
export type ListEntry = string | { entity: string; name?: string; category?: Tone };

export interface ListConfig extends PieceConfig {
  title?: string;
  /** The entities to list: name and state per row. A dot shows only for rows with a category. */
  entities?: ListEntry[];
  size?: "small" | "medium" | "large";
  /** Small line under the name: the entity's device class, or this attribute. */
  attribute?: string;
  /** Optional key on every row: toggle, or up/down for covers. */
  keys?: "none" | "toggle" | "cover";
  max_items?: number;
  empty_text?: string;
}

/** One reader for both entry forms. */
const parse = (e: ListEntry): { entity: string; name?: string; category?: Tone } => (typeof e === "string" ? { entity: e } : e);

const COLOURS: Record<string, string> = { red: "var(--_red)", orange: "var(--_orange)", blue: "var(--_blue)", green: "var(--_green)", grey: "var(--_grey)" };

@customElement("rams-list")
export class RamsList extends Piece<ListConfig> {
  static styles = [
    tokens,
    css`
      :host { --sz: 14px; }
      :host([size="small"]) { --sz: 12px; }
      :host([size="large"]) { --sz: 18px; }
      .list { display: flex; flex-direction: column; height: 100%; overflow: hidden; font-size: var(--sz); }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); padding: 2px 0 6px; flex: none; }
      .row { display: flex; align-items: center; gap: var(--_gap); box-sizing: border-box; padding: 6px 0; cursor: pointer; flex: none; }
      .dot.spacer { background: none; }
      .row[hidden], .more[hidden] { display: none; }
      .dot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: var(--c); }
      .name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .name small { display: block; font-size: 0.72em; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); line-height: 1.3; }
      .val { color: var(--_muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
      .val.alert { color: var(--_alert); }
      .key { flex: none; min-width: 34px; height: 28px; padding: 0 6px; box-sizing: border-box; border-radius: var(--_radius); border: var(--_border); background: var(--_cap); box-shadow: var(--_raised); color: var(--_ink); font: inherit; font-size: 11px; cursor: pointer; }
      .key:active { box-shadow: var(--_pressed); }
      .empty, .more { font-size: 0.85em; color: var(--_muted); padding: 4px 0; flex: none; }
    `,
  ];

  static getStubConfig(): ListConfig {
    return { type: "custom:rams-list", entities: [] };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        {
          name: "entities",
          selector: {
            object: {
              multiple: true,
              label_field: "entity",
              fields: {
                entity: { required: true, selector: { entity: {} } },
                name: { selector: { text: {} } },
                category: { selector: { select: { mode: "dropdown", options: TONES.filter(([v]) => v !== "neutral").map(([value, label]) => ({ value, label })) } } },
              },
            },
          },
        },
        {
          type: "grid",
          name: "",
          schema: [
            dropdown("size", [["small", "Small"], ["medium", "Medium"], ["large", "Large"]]),
            { name: "attribute", selector: { text: {} } },
            dropdown("keys", [["none", "None"], ["toggle", "Toggle key"], ["cover", "Up / down keys"]]),
            num("max_items", 1, 50),
            { name: "empty_text", selector: { text: {} } },
          ],
        },
        layoutFields(),
      ],
      computeLabel,
      computeHelper,
    };
  }

  protected actionable(): boolean {
    return true;
  }

  private more(entity: string): void {
    fireAction(this, { entity, tap_action: { action: "more-info" } }, "tap");
  }

  private call(e: Event, domain: string, service: string, entity: string): void {
    e.stopPropagation();
    void this.hass?.callService(domain, service, { entity_id: entity });
  }

  private value(hass: Hass, e: HassEntity): string {
    return hass.formatEntityState ? hass.formatEntityState(e) : `${e.state}${e.attributes.unit_of_measurement ? ` ${e.attributes.unit_of_measurement}` : ""}`;
  }

  private observer?: ResizeObserver;
  protected firstUpdated(): void {
    this.observer = new ResizeObserver(() => this.fit());
    this.observer.observe(this);
  }
  disconnectedCallback(): void {
    this.observer?.disconnect();
    super.disconnectedCallback();
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (changed.has("config")) this.setAttribute("size", this.config?.size ?? "medium");
  }

  protected updated(): void {
    this.fit();
  }

  /** No height set: report the content height to the panel. Height set: clip what does not fit and say how many are hidden. */
  private fit(): void {
    const list = this.renderRoot.querySelector(".list") as HTMLElement | null;
    if (!list) return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>(".row"));
    const more = list.querySelector(".more") as HTMLElement | null;
    rows.forEach((r) => (r.hidden = false));
    if (more) more.hidden = true;
    if (typeof this.config?.rows !== "number") {
      list.style.height = "auto";
      this.reportRows(this.rowsFor(list.offsetHeight + 2));
      return;
    }
    list.style.height = "100%";
    if (list.scrollHeight <= list.clientHeight + 1 || !more) return;
    more.hidden = false;
    more.textContent = "+0 more";
    let hidden = 0;
    for (let i = rows.length - 1; i >= 0 && list.scrollHeight > list.clientHeight + 1; i--) {
      rows[i].hidden = true;
      hidden++;
      more.textContent = `+${hidden} more`;
    }
  }

  /** When some rows have a category dot, the others keep the same indent so the names stay aligned. */
  private get categorised(): boolean {
    return (this.config?.entities ?? []).some((e) => !!parse(e).category);
  }

  private row(entry: ListEntry): TemplateResult {
    const c = this.config!;
    const { entity: id, name: own, category } = parse(entry);
    const e = this.hass?.states[id];
    const dot = category && COLOURS[category] ? html`<span class="dot" style="--c:${COLOURS[category]}"></span>` : this.categorised ? html`<span class="dot spacer"></span>` : nothing;
    if (!this.hass || !e) return html`<div class="row">${dot}<span class="name">${own || id}</span><span class="val">n/a</span></div>`;
    const name = own || String(e.attributes.friendly_name ?? id);
    const small = c.attribute ? String(e.attributes[c.attribute] ?? "") : String(e.attributes.device_class ?? "");
    const alert = readState(this.hass, id, {}).alert;
    const keys = c.keys === "toggle"
      ? html`<button class="key" @click=${(ev: Event) => this.call(ev, "homeassistant", "toggle", id)}>${e.state === "on" ? "on" : "off"}</button>`
      : c.keys === "cover"
        ? html`<button class="key" @click=${(ev: Event) => this.call(ev, "cover", "open_cover", id)}>&#9650;</button><button class="key" @click=${(ev: Event) => this.call(ev, "cover", "close_cover", id)}>&#9660;</button>`
        : nothing;
    return html`<div class="row" @click=${() => this.more(id)}>
      ${dot}
      <span class="name">${small ? html`<small>${small.replace(/_/g, " ")}</small>` : nothing}${name}</span>
      <span class="val ${alert ? "alert" : ""}">${this.value(this.hass, e)}</span>${keys}
    </div>`;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const all = c.entities ?? [];
    const shown = all.slice(0, c.max_items ?? all.length);
    return html`<div class="list">
      ${c.title ? html`<div class="title">${c.title}</div>` : nothing}
      ${shown.length === 0 && c.empty_text ? html`<div class="empty">${c.empty_text}</div>` : nothing}
      ${shown.map((id) => this.row(id))}
      <div class="more" hidden></div>
      ${all.length > shown.length ? html`<div class="more">+${all.length - shown.length} more</div>` : nothing}
    </div>`;
  }
}
