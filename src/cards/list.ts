import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { fireAction } from "../shared/actions";
import { tokens } from "../shared/styles";
import { computeLabel, dropdown, layoutFields, num } from "../shared/form";
import type { Hass, HassEntity, PieceConfig } from "../shared/types";

export interface ListConfig extends PieceConfig {
  title?: string;
  /** The entities to list: name, state and a state dot per row. */
  entities?: string[];
  /** Small line under the name: the entity's device class, or this attribute. */
  attribute?: string;
  /** Optional key on every row: toggle, or up/down for covers. */
  keys?: "none" | "toggle" | "cover";
  max_items?: number;
  empty_text?: string;
}

const ON = ["on", "open", "playing", "home", "unlocked"];
const PROBLEM = ["problem", "safety", "smoke", "gas", "carbon_monoxide", "moisture", "tamper", "battery", "heat"];

@customElement("rams-list")
export class RamsList extends Piece<ListConfig> {
  static styles = [
    tokens,
    css`
      :host { height: auto; }
      .list { display: flex; flex-direction: column; }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); padding: 2px 0 6px; }
      .row { display: flex; align-items: center; gap: var(--_gap); min-height: 40px; box-sizing: border-box; padding: 4px 0; border-top: var(--_border); cursor: pointer; font-size: 13px; }
      .title + .row, .row:first-child { border-top: 0; }
      .dot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: var(--_grey); }
      .dot.on { background: var(--_green); }
      .dot.alert { background: var(--_red); }
      .name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .name small { display: block; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      .val { color: var(--_muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
      .key { flex: none; min-width: 34px; height: 28px; padding: 0 6px; box-sizing: border-box; border-radius: var(--_radius); border: var(--_border); background: var(--_cap); box-shadow: var(--_raised); color: var(--_ink); font: inherit; font-size: 11px; cursor: pointer; }
      .key:active { box-shadow: var(--_pressed); }
      .empty, .more { font-size: 12px; color: var(--_muted); padding: 4px 0; }
    `,
  ];

  static getStubConfig(): ListConfig {
    return { type: "custom:rams-list", entities: [] };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "entities", selector: { entity: { multiple: true } } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "attribute", selector: { text: {} } },
            dropdown("keys", [["none", "None"], ["toggle", "Toggle key"], ["cover", "Up / down keys"]]),
            num("max_items", 1, 50),
            { name: "empty_text", selector: { text: {} } },
          ],
        },
        layoutFields(),
      ],
      computeLabel,
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

  protected updated(_c: PropertyValues): void {
    const box = this.renderRoot.querySelector(".list") as HTMLElement | null;
    if (box) this.reportRows(this.rowsFor(box.offsetHeight + 2));
  }

  private row(id: string): TemplateResult {
    const c = this.config!;
    const e = this.hass?.states[id];
    if (!this.hass || !e) return html`<div class="row"><span class="dot"></span><span class="name">${id}</span><span class="val">n/a</span></div>`;
    const name = String(e.attributes.friendly_name ?? id);
    const small = c.attribute ? String(e.attributes[c.attribute] ?? "") : String(e.attributes.device_class ?? "");
    const alert = id.startsWith("binary_sensor.") && e.state === "on" && PROBLEM.includes(String(e.attributes.device_class));
    const dot = alert ? "alert" : ON.includes(e.state) ? "on" : "";
    const keys = c.keys === "toggle"
      ? html`<button class="key" @click=${(ev: Event) => this.call(ev, "homeassistant", "toggle", id)}>${e.state === "on" ? "on" : "off"}</button>`
      : c.keys === "cover"
        ? html`<button class="key" @click=${(ev: Event) => this.call(ev, "cover", "open_cover", id)}>&#9650;</button><button class="key" @click=${(ev: Event) => this.call(ev, "cover", "close_cover", id)}>&#9660;</button>`
        : nothing;
    return html`<div class="row" @click=${() => this.more(id)}>
      <span class="dot ${dot}"></span>
      <span class="name">${name}${small ? html`<small>${small.replace(/_/g, " ")}</small>` : nothing}</span>
      <span class="val">${this.value(this.hass, e)}</span>${keys}
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
      ${all.length > shown.length ? html`<div class="more">+${all.length - shown.length} more</div>` : nothing}
    </div>`;
  }
}
