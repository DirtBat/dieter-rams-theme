import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { tokens } from "../shared/styles";
import type { PieceConfig } from "../shared/types";

/**
 * One entry of the source list. This is the shape the shelf expects; adapt the source (or this reader)
 * to the real favourites data once its format is known.
 */
export interface ShelfItem {
  title?: string;
  picture?: string;
  kind?: string;
  media_content_id?: string;
  media_content_type?: string;
}

export interface ShelfConfig extends PieceConfig {
  /** Entity holding the list. */
  entity?: string;
  /** Attribute with the list. Without it, the state is parsed as a JSON list. */
  attribute?: string;
  /** Only show items of this kind (radio, album, podcast, playlist ...). Empty shows all. */
  kind?: string;
  /** Tiles per row. */
  per_row?: number;
  /** Player that plays a tapped tile. */
  player?: string;
}

@customElement("rams-shelf")
export class RamsShelf extends Piece<ShelfConfig> {
  static styles = [
    tokens,
    css`
      :host { display: block; min-width: 0; }
      .grid { display: grid; gap: var(--_gap); }
      .tile { aspect-ratio: 1; box-sizing: border-box; position: relative; overflow: hidden; border-radius: var(--_radius); border: var(--_border); box-shadow: var(--_raised); background: var(--_field) center / cover no-repeat; cursor: pointer; }
      .led { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--_active); }
      .empty { font-size: 12px; color: var(--_muted); }
    `,
  ];

  static getStubConfig(): ShelfConfig {
    return { type: "custom:rams-shelf", columns: 12, rows: "auto" as unknown as number, per_row: 3 };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "attribute", selector: { attribute: {} } },
        { name: "player", selector: { entity: { domain: "media_player" } } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "kind", selector: { text: {} } },
            { name: "per_row", selector: { number: { min: 1, max: 8, mode: "box" } } },
            { name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } },
          ],
        },
      ],
      computeLabel: (s: { name: string }) => s.name.replace(/_/g, " "),
    };
  }

  private items(): ShelfItem[] {
    const c = this.config!;
    const e = c.entity ? this.hass?.states[c.entity] : undefined;
    if (!e) return [];
    let raw: unknown = c.attribute ? e.attributes[c.attribute] : e.state;
    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw);
      } catch {
        return [];
      }
    }
    const list = Array.isArray(raw) ? (raw as ShelfItem[]) : [];
    return c.kind ? list.filter((i) => i.kind === c.kind) : list;
  }

  private play(item: ShelfItem): void {
    const c = this.config;
    if (!c?.player || !this.hass || !item.media_content_id) return;
    void this.hass.callService("media_player", "play_media", {
      entity_id: c.player,
      media_content_id: item.media_content_id,
      media_content_type: item.media_content_type ?? "music",
    });
  }

  protected updated(_changed: PropertyValues): void {
    const grid = this.renderRoot.querySelector(".grid") as HTMLElement | null;
    if (grid) this.reportRows(this.rowsFor(grid.offsetHeight));
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const items = this.items();
    const playingId = c.player ? this.hass?.states[c.player]?.attributes.media_content_id : undefined;
    const playing = c.player && this.hass?.states[c.player]?.state === "playing";
    if (items.length === 0) return html`<div class="empty">Nothing to show</div>`;
    return html`<div class="grid" style="grid-template-columns: repeat(${c.per_row ?? 3}, minmax(0, 1fr))">
      ${items.map(
        (i) => html`<div class="tile" style=${i.picture ? `background-image:url('${i.picture}')` : ""} @click=${() => this.play(i)}>
          ${playing && playingId && playingId === i.media_content_id ? html`<span class="led"></span>` : nothing}
        </div>`,
      )}
    </div>`;
  }
}
