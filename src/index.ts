import "./cards/button";
import "./cards/display";
import "./cards/panel";
import "./cards/ruler";
import "./cards/artwork";
import "./cards/clock";
import "./cards/list";
import "./cards/keypad";
import "./cards/shelf";
import "./cards/dial";

const w = window as unknown as { customCards?: Array<Record<string, unknown>> };
w.customCards = w.customCards ?? [];
w.customCards.push(
  { type: "rams-panel", name: "Rams panel", description: "Container: a plate with pieces on an N-column grid", preview: true },
  { type: "rams-display", name: "Rams display", description: "Text block: one or two lines, optional frame", preview: true },
  { type: "rams-ruler", name: "Rams ruler", description: "Scale with pointer or centre bar; optional touch to set", preview: true },
  { type: "rams-artwork", name: "Rams artwork", description: "Picture with playing LED and optional media keys", preview: true },
  { type: "rams-clock", name: "Rams clock", description: "Analog or digital clock", preview: true },
  { type: "rams-list", name: "Rams list", description: "List of entities with state and optional keys", preview: true },
  { type: "rams-keypad", name: "Rams keypad", description: "Alarm code entry and mode keys", preview: true },
  { type: "rams-shelf", name: "Rams shelf", description: "Artwork tiles generated from a list", preview: true },
  { type: "rams-button", name: "Rams button", description: "Key or round button", preview: true },
  { type: "rams-dial", name: "Rams dial", description: "Half-round scale with a needle, value from an entity or fixed", preview: true },
);
