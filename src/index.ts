import "./cards/button";
import "./cards/selector";
import "./cards/display";
import "./cards/label";
import "./cards/panel";
import "./cards/ruler";
import "./cards/artwork";
import "./cards/clock";
import "./cards/list";
import "./cards/keypad";
import "./cards/shelf";
import "./cards/dial";

declare const __BUILT__: string;
// Shows in the browser console which build is loaded, to tell a stale cached file from a current one.
console.info(`%c RAMS CARDS %c built ${__BUILT__}`, "background:#261201;color:#fff", "");

const w = window as unknown as { customCards?: Array<Record<string, unknown>> };
w.customCards = w.customCards ?? [];
w.customCards.push(
  { type: "rams-panel", name: "Dieter Rams Panel", description: "Container: a plate with pieces on an N-column grid", preview: true },
  { type: "rams-display", name: "Dieter Rams Display", description: "Text block: one or two lines, optional frame", preview: true },
  { type: "rams-label", name: "Dieter Rams Label", description: "Heading for a group of pieces: half a row high, optional hairline", preview: true },
  { type: "rams-ruler", name: "Dieter Rams Ruler", description: "Scale with pointer or centre bar; optional touch to set", preview: true },
  { type: "rams-artwork", name: "Dieter Rams Artwork", description: "Picture with playing LED and optional media keys", preview: true },
  { type: "rams-clock", name: "Dieter Rams Clock", description: "Analogue or digital clock", preview: true },
  { type: "rams-list", name: "Dieter Rams List", description: "List of entities with state and optional keys", preview: true },
  { type: "rams-keypad", name: "Dieter Rams Keypad", description: "Alarm code entry and mode keys", preview: true },
  { type: "rams-shelf", name: "Dieter Rams Shelf", description: "Artwork tiles generated from a list", preview: true },
  { type: "rams-button", name: "Dieter Rams Button", description: "Key in three shapes (square, wide, round) with an optional lamp and state colours", preview: true },
  { type: "rams-selector", name: "Dieter Rams Selector", description: "Knob or lever with one stop per option: a select, an input_select, or an on/off switch", preview: true },
  { type: "rams-dial", name: "Dieter Rams Dial", description: "Round scale with a needle, a red mark and a target pointer; any arc, value from an entity or fixed", preview: true },
);
