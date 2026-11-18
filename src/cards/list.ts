import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { readState, TONES, type Tone } from "../shared/state-rules";
import { Piece } from "../shared/piece";
import { fireAction } from "../shared/actions";
import { tokens } from "../shared/styles";
import { computeLabel, computeHelper, dropdown, layoutFields, num } from "../shared/form";
import type { Hass, HassEntity, PieceConfig } from "../shared/types";

/** What a row prints: name and value (default), only one of them, or neither (an icon and a lamp is enough). */
export type RowShow = "all" | "name" | "value" | "none";

export interface ListRow {
  entity: string;
  name?: string;
  /** A coloured dot before the name (a fixed category, not a state). */
  category?: Tone;
  /** An icon before the name. */
  icon?: string;
  /** A small lamp that lights on a warning (see alert_when). */
  lamp?: boolean;
  /** Colour of the lit lamp. Default red. */
  lamp_tone?: Tone;
  /** States that light the lamp, one or several separated by commas. Default: automatic for problem-type binary sensors. */
  alert_when?: string | string[];
  show?: RowShow;
}

/** A row: just an entity id, or an entity with its own name, icon, lamp and category. */
export type ListEntry = string | ListRow;

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
const parse = (e: ListEntry): ListRow => (typeof e === "string" ? { entity: e } : e);
const states = (a: ListRow["alert_when"]): string[] | undefined => {
  const l = (Array.isArray(a) ? a : (a ?? "").split(",")).map((x) => String(x).trim()).filter(Boolean);
  return l.length ? l : undefined;
};

const COLOURS: Record<string, string> = { red: "var(--_red)", orange: "var(--_orange)", blue: "var(--_blue)", green: "var(--_green)", grey: "var(--_grey)" };

@customElement("rams-list")
export class RamsList extends Piece<ListConfig> {
  static styles = [
    tokens,
    css`
      :host { --sz: 14px; }
      :host([size="small"]) { --sz: 12px; }
      :host([size="large"]) { --sz: 18px; }
      /* the side padding keeps a lit lamp's glow inside the clipped area */
      .list { display: flex; flex-direction: column; height: 100%; overflow: hidden; padding: 0 6px; margin: 0 -6px; font-size: var(--sz); }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); padding: 2px 0 6px; flex: none; }
      .row { display: flex; align-items: center; gap: var(--_gap); box-sizing: border-box; padding: 6px 0; cursor: pointer; flex: none; }
      .dot.spacer, .lamp.spacer { background: none; box-shadow: none; }
      .lamp { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--_lens); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.35); }
      .lamp.on { background: var(--l); box-shadow: 0 0 max(var(--_glow), 5px) 1px color-mix(in srgb, var(--l) 85%, transparent), inset 0 0 2px rgba(255, 255, 255, 0.6); }
      .ico { --mdc-icon-size: 1.3em; flex: none; color: var(--_ink); }
      .ico.spacer { display: inline-block; width: 1.3em; }
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
                icon: { selector: { icon: {} } },
                show: { label: "show", selector: { select: { mode: "dropdown", options: [{ value: "all", label: "Name and value" }, { value: "name", label: "Name only" }, { value: "value", label: "Value only" }, { value: "none", label: "Icon and lamp only" }] } } },
                lamp: { label: "lamp", selector: { boolean: {} } },
                alert_when: { label: "lamp lights when", selector: { text: {} } },
                lamp_tone: { label: "lamp colour", selector: { select: { mode: "dropdown", options: TONES.filter(([v]) => v !== "neutral").map(([value, label]) => ({ value, label })) } } },
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
        ...layoutFields(),
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

  private any(key: "icon" | "lamp"): boolean {
    return (this.config?.entities ?? []).some((e) => !!parse(e)[key]);
  }

  private row(entry: ListEntry): TemplateResult {
    const c = this.config!;
    const r = parse(entry);
    const { entity: id, name: own, category } = r;
    const show = r.show ?? "all";
    const e = this.hass?.states[id];
    const dot = category && COLOURS[category] ? html`<span class="dot" style="--c:${COLOURS[category]}"></span>` : this.categorised ? html`<span class="dot spacer"></span>` : nothing;
    const icon = r.icon ? html`<ha-icon class="ico" .icon=${r.icon}></ha-icon>` : this.any("icon") ? html`<span class="ico spacer"></span>` : nothing;
    if (!this.hass || !e) return html`<div class="row">${dot}${icon}<span class="name">${own || id}</span><span class="val">n/a</span></div>`;
    const name = own || String(e.attributes.friendly_name ?? id);
    const small = c.attribute ? String(e.attributes[c.attribute] ?? "") : String(e.attributes.device_class ?? "");
    const alert = readState(this.hass, id, { alert_when: states(r.alert_when) }).alert;
    const lamp = r.lamp ? html`<i class="lamp ${alert ? "on" : ""}" style="--l:${COLOURS[r.lamp_tone ?? "red"] ?? COLOURS.red}"></i>` : this.any("lamp") ? html`<i class="lamp spacer"></i>` : nothing;
    const keys = c.keys === "toggle"
      ? html`<button class="key" @click=${(ev: Event) => this.call(ev, "homeassistant", "toggle", id)}>${e.state === "on" ? "on" : "off"}</button>`
      : c.keys === "cover"
        ? html`<button class="key" @click=${(ev: Event) => this.call(ev, "cover", "open_cover", id)}>&#9650;</button><button class="key" @click=${(ev: Event) => this.call(ev, "cover", "close_cover", id)}>&#9660;</button>`
        : nothing;
    return html`<div class="row" @click=${() => this.more(id)}>
      ${dot}${icon}${lamp}
      ${show === "all" || show === "name" ? html`<span class="name">${small ? html`<small>${small.replace(/_/g, " ")}</small>` : nothing}${name}</span>` : nothing}
      ${show === "all" || show === "value" ? html`<span class="val ${alert ? "alert" : ""}" style=${show === "value" ? "margin-left:auto" : ""}>${this.value(this.hass, e)}</span>` : nothing}${keys}
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
