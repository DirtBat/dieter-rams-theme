import type { Hass, HassEntity } from "./types";

/**
 * Help for a card's example in the card picker: pick an entity from the user's own house, so the preview shows a live card.
 * Without a fitting entity the card falls back to fixed example values.
 */
export function pick(hass: Hass | undefined, domains: string[], ok: (e: HassEntity) => boolean = () => true): HassEntity | undefined {
  return Object.values(hass?.states ?? {}).find(
    (e) => domains.includes(e.entity_id.split(".")[0]) && e.state !== "unavailable" && e.state !== "unknown" && ok(e),
  );
}

export const pickAll = (hass: Hass | undefined, domains: string[], max: number, ok?: (e: HassEntity) => boolean): HassEntity[] =>
  Object.values(hass?.states ?? {})
    .filter((e) => domains.includes(e.entity_id.split(".")[0]) && e.state !== "unavailable" && e.state !== "unknown" && (ok?.(e) ?? true))
    .slice(0, max);

export const numeric = (e: HassEntity): boolean => e.state.trim() !== "" && !Number.isNaN(Number(e.state));
