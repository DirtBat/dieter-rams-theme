import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Piece } from "../shared/piece";
import "./button";
import { fireAction } from "../shared/actions";
import { tokens } from "../shared/styles";
import { actionFields, computeLabel, computeHelper, dropdown, layoutFields } from "../shared/form";
import { pick } from "../shared/stub";
import type { Hass, PieceConfig } from "../shared/types";

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
  /** Width to height of the picture. Square when not set. */
  proportion?: "square" | "4:3" | "3:2" | "16:9" | "3:4" | "2:3";
  /** Stream a camera live instead of showing its still. */
  live?: boolean;
  /** Frame the picture like a CRT screen: black bezel, tinted glass. */
  screen?: boolean;
}

const RATIO: Record<string, number> = { square: 1, "4:3": 4 / 3, "3:2": 3 / 2, "16:9": 16 / 9, "3:4": 3 / 4, "2:3": 2 / 3 };

@customElement("rams-artwork")
export class RamsArtwork extends Piece<ArtworkConfig> {
  protected defaultFrame = "raised" as const;
  protected honourRows = true;
  static styles = [
    tokens,
    css`
      :host { --_fpad: 0px; overflow: hidden; }
      .art { position: relative; box-sizing: border-box; height: 100%; min-height: var(--_min, 0px); background: var(--_field) center / cover no-repeat; cursor: pointer; }
      .art img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .art.screen { border: 9px solid #1e1f20; border-radius: 22px / 18px; background-color: #8a9a88; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 0 18px rgba(0, 0, 0, 0.45); overflow: hidden; }
      .art.screen::after { content: ""; position: absolute; inset: 0; pointer-events: none; border-radius: 12px / 10px; background: linear-gradient(160deg, rgba(150, 175, 150, 0.28), rgba(90, 110, 95, 0.22)); mix-blend-mode: multiply; box-shadow: inset 0 0 22px rgba(0, 0, 0, 0.4); }
      .cap { position: absolute; left: 6px; bottom: 6px; padding: 2px 5px; border-radius: 2px; font-size: 11px; background: var(--_cap); color: var(--_ink); }
      /* the transport keys are the Rams wide keys, on the picture */
      .ctl { position: absolute; left: 8px; right: 8px; bottom: 8px; display: flex; gap: 8px; justify-content: center; }
      .ctl > span { flex: 1; max-width: 96px; height: 30px; display: block; }
      .ctl rams-button { height: 100%; }
      .led { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--_active); box-shadow: 0 0 var(--_glow) color-mix(in srgb, var(--_active) 80%, transparent); }
    `,
  ];

  /** The cover of a media player that has one, with transport keys; else an empty frame with a caption. */
  static getStubConfig(hass?: Hass): ArtworkConfig {
    const e = pick(hass, ["media_player"], (x) => typeof x.attributes.entity_picture === "string");
    return e ? { type: "custom:rams-artwork", entity: e.entity_id, controls: true, columns: 4, rows: 3 } : { type: "custom:rams-artwork", caption: "Now playing", columns: 4, rows: 3 };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "caption", selector: { text: {} } },
        { name: "entity", selector: { entity: {} } },
        { name: "image", selector: { text: {} } },
        { name: "playing_entity", selector: { entity: {} } },
        { name: "live", selector: { boolean: {} } },
        { name: "controls", selector: { boolean: {} } },
        dropdown("proportion", [["square", "Square"], ["4:3", "4:3"], ["3:2", "3:2"], ["16:9", "16:9"], ["3:4", "3:4 portrait"], ["2:3", "2:3 portrait"]]),
        { name: "screen", selector: { boolean: {} } },
        ...layoutFields(),
        ...actionFields(),
      ],
      computeLabel,
      computeHelper,
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
    if (this.config && typeof this.config.rows !== "number") this.reportRows(Math.max(1, Math.round((this.offsetWidth / (RATIO[this.config.proportion ?? "square"] ?? 1) + 8) / 64)));
  }

  /** One transport key: a Rams wide key that runs a media_player service on the entity. Pressed while the player plays, when it is the play key. */
  private key(icon: string, title: string, service: string, lit = false): TemplateResult {
    const entity = this.config?.entity;
    const config = {
      type: "custom:rams-button",
      icon,
      name: "",
      shape: "wide",
      light: "none",
      label_position: "inside",
      rows: 0.5,
      ...(lit ? { entity: this.config?.playing_entity ?? entity, selected_when: ["playing"] } : {}),
      tap_action: { action: "perform-action", perform_action: `media_player.${service}`, target: { entity_id: entity } },
    };
    return html`<span title=${title}><rams-button .hass=${this.hass} .config=${config}></rams-button></span>`;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c) return nothing;
    const picture = (c.entity && (this.hass?.states[c.entity]?.attributes.entity_picture as string | undefined)) || c.image || "";
    const playing = this.hass?.states[c.playing_entity ?? c.entity ?? ""]?.state === "playing";
    const stream = c.live && c.entity?.startsWith("camera.") && picture ? picture.replace("/camera_proxy/", "/camera_proxy_stream/") : "";
    return html`<div class="art ${c.screen ? "screen" : ""}" style=${picture && !stream ? `background-image:url('${picture}')` : ""} @click=${this.onTap}>
      ${stream ? html`<img src=${stream} alt="" />` : nothing}
      ${c.caption ? html`<span class="cap">${c.caption}</span>` : nothing}
      ${playing ? html`<span class="led"></span>` : nothing}
      ${c.controls ? html`<div class="ctl" @click=${(e: Event) => e.stopPropagation()}>
        ${this.key("mdi:skip-previous", "Previous", "media_previous_track")}
        ${this.key(playing ? "mdi:pause" : "mdi:play", playing ? "Pause" : "Play", "media_play_pause", true)}
        ${this.key("mdi:skip-next", "Next", "media_next_track")}
      </div>` : nothing}
    </div>`;
  }
}
