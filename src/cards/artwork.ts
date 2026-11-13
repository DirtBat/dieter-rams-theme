import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import { fireAction } from "../shared/actions";
import { tokens } from "../shared/styles";
import { actionFields, computeLabel, layoutFields } from "../shared/form";
import type { PieceConfig } from "../shared/types";

export interface ArtworkConfig extends PieceConfig {
  /** Entity whose picture is shown (media player, camera ...). */
  entity?: string;
  /** Fixed picture, used when no entity is set or the entity has none. */
  image?: string;
  caption?: string;
  /** Show the LED while this entity is playing (defaults to `entity`). */
  playing_entity?: string;
  /** Media player entity: show previous / play-pause / next keys on the picture. */
  controls?: boolean;
}

@customElement("rams-artwork")
export class RamsArtwork extends Piece<ArtworkConfig> {
  protected defaultFrame = "raised" as const;
  static styles = [
    tokens,
    css`
      :host { --_fpad: 0px; overflow: hidden; }
      .art { position: relative; box-sizing: border-box; height: 100%; background: var(--_field) center / cover no-repeat; cursor: pointer; }
      .cap { position: absolute; left: 6px; bottom: 6px; padding: 2px 5px; border-radius: 2px; font-size: 11px; background: var(--_cap); color: var(--_ink); }
      .ctl { position: absolute; left: 6px; right: 6px; bottom: 6px; display: flex; gap: 6px; justify-content: center; }
      .ctl button { flex: 1; max-width: 56px; height: 28px; border-radius: var(--_radius); border: var(--_border); background: var(--_cap); color: var(--_ink); box-shadow: var(--_raised); font: inherit; font-size: 10px; cursor: pointer; }
      .led { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--_active); }
    `,
  ];

  static getStubConfig(): ArtworkConfig {
    return { type: "custom:rams-artwork", columns: 4 };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "image", selector: { text: {} } },
        { name: "caption", selector: { text: {} } },
        { name: "playing_entity", selector: { entity: {} } },
        { name: "controls", selector: { boolean: {} } },
        layoutFields(),
        ...actionFields(),
      ],
      computeLabel,
    };
  }

  private onTap = () => {
    if (this.config) fireAction(this, this.config, "tap");
  };

  protected actionable(): boolean {
    return !!this.config?.entity || super.actionable();
  }

  /** Without a height, the artwork is square: its height in rows follows its width. */
  private observer?: ResizeObserver;
  protected firstUpdated(_c: PropertyValues): void {
    this.observer = new ResizeObserver(() => this.fit());
    this.observer.observe(this);
  }
  disconnectedCallback(): void {
    this.observer?.disconnect();
    super.disconnectedCallback();
  }
  protected updated(_c: PropertyValues): void {
    this.fit();
  }
  private fit(): void {
    if (this.config && typeof this.config.rows !== "number") this.reportRows(Math.max(1, Math.round((this.offsetWidth + 8) / 64)));
  }

  private media(service: string): void {
    const e = this.config?.entity;
    if (e) void this.hass?.callService("media_player", service, { entity_id: e });
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const picture = (c.entity && (this.hass?.states[c.entity]?.attributes.entity_picture as string | undefined)) || c.image || "";
    const playing = this.hass?.states[c.playing_entity ?? c.entity ?? ""]?.state === "playing";
    return html`<div class="art" style=${picture ? `background-image:url('${picture}')` : ""} @click=${this.onTap}>
      ${c.caption ? html`<span class="cap">${c.caption}</span>` : nothing}
      ${playing ? html`<span class="led"></span>` : nothing}
      ${c.controls ? html`<div class="ctl" @click=${(e: Event) => e.stopPropagation()}>
        <button @click=${() => this.media("media_previous_track")}>&#9664;&#9664;</button>
        <button @click=${() => this.media("media_play_pause")}>${playing ? "II" : "▶"}</button>
        <button @click=${() => this.media("media_next_track")}>&#9654;&#9654;</button>
      </div>` : nothing}
    </div>`;
  }
}
