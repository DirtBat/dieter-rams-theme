import type { Hass } from "./types";

/**
 * Read and write the one number that matters for an entity, per domain.
 * Percent for light brightness and media volume; native units for climate and number helpers.
 */
export interface Range {
  min: number;
  max: number;
  step: number;
}

const domainOf = (entity: string) => entity.split(".")[0];
const num = (v: unknown): number | undefined => (v === undefined || v === null || v === "" || Number.isNaN(Number(v)) ? undefined : Number(v));

export function readNumber(hass: Hass | undefined, entity: string | undefined, attribute?: string): number | undefined {
  const e = entity ? hass?.states[entity] : undefined;
  if (!e) return undefined;
  if (attribute) return num(e.attributes[attribute]);
  switch (domainOf(e.entity_id)) {
    case "light": {
      const b = num(e.attributes.brightness);
      return e.state === "off" ? 0 : b === undefined ? undefined : Math.round((b / 255) * 100);
    }
    case "media_player": {
      const v = num(e.attributes.volume_level);
      return v === undefined ? undefined : Math.round(v * 100);
    }
    case "climate":
      return num(e.attributes.temperature);
    default:
      return num(e.state);
  }
}

/**
 * The text to print for an entity's state or attribute. A number goes through Home Assistant's own formatting, so the display precision
 * set on the entity applies (a template sensor may hold 0.20000000000000018); the entity's unit is left off because the card prints its own.
 * A timestamp prints as a date and time in the user's format. Any other text is printed as it is.
 */
export function formatValue(hass: Hass | undefined, entity: string | undefined, attribute?: string): string {
  const e = entity ? hass?.states[entity] : undefined;
  if (!e) return "";
  if (attribute) {
    const raw = e.attributes[attribute];
    return typeof raw === "number" && hass?.formatEntityAttributeValue ? stripUnit(hass.formatEntityAttributeValue(e, attribute), e.attributes.unit_of_measurement) : String(raw ?? "");
  }
  if (e.attributes.device_class === "timestamp" && hass?.formatEntityState) return hass.formatEntityState(e);
  if (hass?.formatEntityState && e.state.trim() !== "" && !Number.isNaN(Number(e.state))) return stripUnit(hass.formatEntityState(e), e.attributes.unit_of_measurement);
  return e.state;
}

function stripUnit(text: string, unit: unknown): string {
  return typeof unit === "string" && unit && text.endsWith(unit) ? text.slice(0, -unit.length).trim() : text;
}

export function defaultRange(hass: Hass | undefined, entity: string | undefined): Range {
  const e = entity ? hass?.states[entity] : undefined;
  const a = e?.attributes ?? {};
  switch (e && domainOf(e.entity_id)) {
    case "climate":
      return { min: num(a.min_temp) ?? 7, max: num(a.max_temp) ?? 35, step: num(a.target_temp_step) ?? 0.5 };
    case "input_number":
    case "number":
      return { min: num(a.min) ?? 0, max: num(a.max) ?? 100, step: num(a.step) ?? 1 };
    default:
      return { min: 0, max: 100, step: 1 };
  }
}

export const clamp = (v: number, r: Range): number => Math.min(r.max, Math.max(r.min, Math.round(v / r.step) * r.step));

export async function writeNumber(hass: Hass, entity: string, value: number): Promise<void> {
  const entity_id = entity;
  switch (domainOf(entity)) {
    case "light":
      return hass.callService("light", value <= 0 ? "turn_off" : "turn_on", value <= 0 ? { entity_id } : { entity_id, brightness_pct: value });
    case "media_player":
      return hass.callService("media_player", "volume_set", { entity_id, volume_level: value / 100 });
    case "climate":
      return hass.callService("climate", "set_temperature", { entity_id, temperature: value });
    case "input_number":
      return hass.callService("input_number", "set_value", { entity_id, value });
    case "number":
      return hass.callService("number", "set_value", { entity_id, value });
    default:
      throw new Error(`rams: cannot set a number on ${entity}`);
  }
}
