import { css, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { fireAction } from "../shared/actions";
import { tokens } from "../shared/styles";
import type { ActionConfig, PieceConfig } from "../shared/types";

export interface ArtworkConfig extends PieceConfig {
  /** Entity whose picture is shown (media player, camera ...). */
  entity?: string;
  /** Fixed picture, used when no entity is set or the entity has none. */
  image?: string;
  caption?: string;
  /** Show the LED while this entity is playing (defaults to `entity`). */
  playing_entity?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
}

@customElement("rams-artwork")
export class RamsArtwork extends Piece<ArtworkConfig> {
  static styles = [
    tokens,
    css`
      :host { display: block; height: 100%; min-width: 0; }
      .art { position: relative; box-sizing: border-box; height: 100%; overflow: hidden; border-radius: var(--_radius); border: var(--_border); box-shadow: var(--_raised); background: var(--_field) center / cover no-repeat; cursor: pointer; }
      .cap { position: absolute; left: 6px; bottom: 6px; padding: 2px 5px; border-radius: 2px; font-size: 11px; background: var(--_cap); color: var(--_ink); }
      .led { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--_active); }
    `,
  ];

  static getStubConfig(): ArtworkConfig {
    return { type: "custom:rams-artwork", columns: 4, rows: 2 };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "image", selector: { text: {} } },
        { name: "caption", selector: { text: {} } },
        { name: "playing_entity", selector: { entity: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } },
            { name: "rows", selector: { number: { min: 1, max: 6, mode: "box" } } },
          ],
        },
        { name: "tap_action", selector: { ui_action: {} } },
        { name: "hold_action", selector: { ui_action: {} } },
      ],
      computeLabel: (s: { name: string }) => s.name.replace(/_/g, " "),
    };
  }

  private onTap = () => {
    if (this.config) fireAction(this, this.config, "tap");
  };

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const picture = (c.entity && (this.hass?.states[c.entity]?.attributes.entity_picture as string | undefined)) || c.image || "";
    const playing = this.hass?.states[c.playing_entity ?? c.entity ?? ""]?.state === "playing";
    return html`<div class="art" style=${picture ? `background-image:url('${picture}')` : ""} @click=${this.onTap}>
      ${c.caption ? html`<span class="cap">${c.caption}</span>` : nothing}
      ${playing ? html`<span class="led"></span>` : nothing}
    </div>`;
  }
}
