import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { tokens } from "../shared/styles";
import { computeLabel, computeHelper, layoutFields } from "../shared/form";
import type { Hass, PieceConfig } from "../shared/types";

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
  /** Player that plays a tapped tile. With player_from set, this is only the fallback. */
  player?: string;
  /** An input_select or select that says where to play, for example the music output selector. */
  player_from?: string;
  /** Which player goes with which option. Empty: an option is matched by name (the option Kitchen finds the media player called Kitchen). */
  players?: Array<{ option: string; player: string }>;
}

@customElement("rams-shelf")
export class RamsShelf extends Piece<ShelfConfig> {
  static styles = [
    tokens,
    css`
      :host { display: block; min-width: 0; }
      .grid { display: grid; gap: var(--_gap); }
      /* square covers: the picture is the object, a rounded corner would show the picture behind its edge */
      .tile { aspect-ratio: 1; box-sizing: border-box; position: relative; overflow: hidden; border-radius: 0; box-shadow: var(--_raised); background: var(--_field) center / cover no-repeat; cursor: pointer; }
      .led { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; border-radius: 50%; background: var(--_active); box-shadow: 0 0 var(--_glow) color-mix(in srgb, var(--_active) 80%, transparent); }
      .empty { font-size: 12px; color: var(--_muted); }
    `,
  ];

  /** A new shelf starts on the first input_select whose options look like "kind|title|id|picture". */
  static getStubConfig(hass?: Hass): ShelfConfig {
    const found = Object.keys(hass?.states ?? {}).find(
      (id) => id.startsWith("input_select.") && (hass!.states[id].attributes.options as string[] | undefined)?.some((o) => o.split("|").length >= 3),
    );
    return { type: "custom:rams-shelf", columns: 12, per_row: 4, ...(found ? { entity: found } : {}) };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "attribute", selector: { attribute: {} }, context: { filter_entity: "entity" } },
        { name: "player", selector: { entity: { domain: "media_player" } } },
        { name: "player_from", selector: { entity: { domain: ["input_select", "select"] } } },
        {
          name: "players",
          selector: {
            object: {
              multiple: true,
              label_field: "option",
              description_field: "player",
              fields: {
                option: { label: "Option", required: true, selector: { text: {} } },
                player: { label: "Player", required: true, selector: { entity: { domain: "media_player" } } },
              },
            },
          },
        },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "kind", selector: { text: {} } },
            { name: "per_row", selector: { number: { min: 1, max: 8, mode: "box" } } },
          ],
        },
        ...layoutFields(),
      ],
      computeLabel,
      computeHelper,
    };
  }

  private items(): ShelfItem[] {
    const c = this.config!;
    const e = c.entity ? this.hass?.states[c.entity] : undefined;
    if (!e) return [];
    // An input_select reads its options by default.
    const attr = c.attribute ?? (c.entity?.startsWith("input_select.") ? "options" : undefined);
    let raw: unknown = attr ? e.attributes[attr] : e.state;
    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw);
      } catch {
        return [];
      }
    }
    if (!Array.isArray(raw)) return [];
    const list: ShelfItem[] = [];
    for (const r of raw as unknown[]) {
      if (typeof r === "string") {
        // "kind|title|media_content_id|picture"
        const [kind, title, id, ...pic] = r.split("|");
        if (!kind || !id) continue;
        list.push({ kind: kind.trim(), title: title?.trim(), media_content_id: id.trim(), media_content_type: kind.trim(), picture: pic.join("|").trim() || undefined });
      } else if (r && typeof r === "object") {
        list.push(r as ShelfItem);
      }
    }
    return c.kind ? list.filter((i) => i.kind === c.kind) : list;
  }

  /** The player a tile plays on: the one the selector names, else the fixed player. */
  private target(): string | undefined {
    const c = this.config;
    const sel = c?.player_from ? this.hass?.states[c.player_from]?.state : undefined;
    if (sel) {
      const mapped = c?.players?.find((p) => p.option === sel)?.player;
      if (mapped) return mapped;
      const slug = sel.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
      const guess = [`media_player.${slug}_ma`, `media_player.${slug}`].find((id) => this.hass?.states[id]);
      if (guess) return guess;
    }
    return c?.player;
  }

  private play(item: ShelfItem): void {
    const player = this.target();
    if (!player || !this.hass || !item.media_content_id) return;
    void this.hass.callService("media_player", "play_media", {
      entity_id: player,
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
    const player = this.target();
    const playingId = player ? this.hass?.states[player]?.attributes.media_content_id : undefined;
    const playing = player && this.hass?.states[player]?.state === "playing";
    if (items.length === 0) {
      const why = !c.entity ? "Choose an entity" : !this.hass?.states[c.entity] ? `${c.entity} not found` : `No items in ${c.entity}`;
      return html`<div class="empty">${why}</div>`;
    }
    return html`<div class="grid" style="grid-template-columns: repeat(${c.per_row ?? 3}, minmax(0, 1fr))">
      ${items.map(
        (i) => html`<div class="tile" style=${i.picture ? `background-image:url('${i.picture}')` : ""} @click=${() => this.play(i)}>
          ${playing && playingId && playingId === i.media_content_id ? html`<span class="led"></span>` : nothing}
        </div>`,
      )}
    </div>`;
  }
}
