/** Small builders for ha-form schemas, so every piece offers the same fields in the same words. */
const LABELS: Record<string, string> = {
  columns: "width in panel (grid units)",
  rows: "height in panel (grid units)",
  selected_when: "active when",
  alert_when: "warning when",
};

export const computeLabel = (s: { name: string }): string => LABELS[s.name] ?? s.name.replace(/_/g, " ");

const HELPERS: Record<string, string> = {
  columns: "Only used inside a Rams panel. A standalone card is sized in the Layout tab.",
  rows: "Only used inside a Rams panel. A standalone card is sized in the Layout tab.",
};

export const computeHelper = (s: { name: string }): string | undefined => HELPERS[s.name];

export const num = (name: string, min?: number, max?: number, extra: Record<string, unknown> = {}) => ({
  name,
  selector: { number: { min, max, mode: "box", ...extra } },
});

export const dropdown = (name: string, options: Array<[string, string]>) => ({
  name,
  selector: { select: { mode: "dropdown", options: options.map(([value, label]) => ({ value, label })) } },
});

export const FRAMES: Array<[string, string]> = [["none", "None"], ["outline", "Outline"], ["recessed", "Recessed"], ["raised", "Raised"]];

/** Width, height and frame: on every piece. */
export const layoutFields = () => ({
  type: "grid",
  name: "",
  schema: [num("columns", 1, 12), num("rows", 1, 12), dropdown("frame", FRAMES)],
});

export const actionFields = () => [
  { name: "tap_action", selector: { ui_action: {} } },
  { name: "hold_action", selector: { ui_action: {} } },
];
