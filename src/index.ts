import "./cards/button";
import "./cards/display";
import "./cards/panel";
import "./cards/ruler";
import "./cards/artwork";
import "./cards/clock";
import "./cards/list";
import "./cards/keypad";
import "./cards/shelf";

const w = window as unknown as { customCards?: Array<Record<string, unknown>> };
w.customCards = w.customCards ?? [];
w.customCards.push(
  { type: "rams-panel", name: "Rams panel", description: "Container: a plate with pieces on an N-column grid" },
  { type: "rams-display", name: "Rams display", description: "Text block: one or two lines, optional frame" },
  { type: "rams-ruler", name: "Rams ruler", description: "Scale with pointer or centre bar; optional touch to set" },
  { type: "rams-artwork", name: "Rams artwork", description: "Square picture with playing LED" },
  { type: "rams-clock", name: "Rams clock", description: "Analog or digital clock" },
  { type: "rams-list", name: "Rams list", description: "Dynamic list from an entity attribute" },
  { type: "rams-keypad", name: "Rams keypad", description: "Alarm code entry and mode keys" },
  { type: "rams-shelf", name: "Rams shelf", description: "Artwork tiles generated from a list" },
  { type: "rams-button", name: "Rams button", description: "Key or round button" },
);
