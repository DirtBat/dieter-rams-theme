import "./cards/button";
import "./cards/display";
import "./cards/panel";

const w = window as unknown as { customCards?: Array<Record<string, unknown>> };
w.customCards = w.customCards ?? [];
w.customCards.push(
  { type: "rams-panel", name: "Rams panel", description: "Container: a plate with pieces on an N-column grid" },
  { type: "rams-display", name: "Rams display", description: "Text block: one or two lines, optional frame" },
  { type: "rams-button", name: "Rams button", description: "Key or round button" },
);
