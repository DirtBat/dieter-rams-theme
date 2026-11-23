/** Small builders for ha-form schemas, so every piece offers the same fields in the same words. */
const LABELS: Record<string, string> = {
  columns: "Width in panel (grid units)",
  rows: "Height in panel (grid units)",
  selected_when: "Active when",
  alert_when: "Warning when",
  state_colours: "Colour by state",
  value_colours: "Colour by value",
  rules_entity: "Judge by another entity",
  title_position: "Title position",
  label_position: "Label position",
  labels_position: "Labels position",
  tone: "Key colour",
  icon_tone: "Icon colour",
  adjust_by: "Change a thermostat by",
  light: "Lamp",
  cap: "Knob style",
  order: "Knob order",
  orientation: "Direction",
  lines: "Lines from labels to stops",
  kind: "Show only this type",
  per_row: "Tiles per row",
  player_from: "Play on the player named by",
  players: "Player for each option",
  major: "Thick ticks every",
  interval: "Ticks every",
  step: "Step when set by touch",
  number: "Show the number",
  labels: "Show the end values",
  centre: "Zero in the centre",
  start_angle: "Start angle",
  end_angle: "End angle",
};

const capital = (t: string): string => t.charAt(0).toUpperCase() + t.slice(1);

export const computeLabel = (s: { name: string; label?: string }): string => s.label ?? LABELS[s.name] ?? capital(s.name.replace(/_/g, " "));

const HELPERS: Record<string, string> = {
  light: "The lamp above the key. Automatic shows a lamp only when you set warning states; None shows no lamp and takes no room; the others always show it.",
  frame: "How the box looks. The three displays are for screens: light by day and green at night, always green backlit, or black with yellow-green light.",
  title_position: "Where the title is printed. Default: below.",
  adjust_by: "Thermostats only: a tap changes the target temperature by this much, for example 0.5. For anything else use a tap action.",
  kind: "Optional. Only the items of this kind (for example radio or album); empty shows all.",
  per_row: "How many tiles stand next to each other.",
  options: "Optional. Rename an option, give it an icon, put them in another order or leave one out. Type each option exactly as the entity names it. Left empty: all of the entity's options, as named. To turn on HA scenes instead, leave the entity empty and give each option a scene: the current option is then the scene turned on last.",
  player_from: "Optional. An input_select that says where to play, for example one that names the room to play in. A tapped tile then plays on the player it names; the player above is the fallback.",
  players: "Optional. Which player goes with which option. Left empty, an option is matched by its name: the option Kitchen finds the media player called Kitchen.",
  entities: "Optional, instead of the entity: several at once, for example all your speakers. The ruler shows the one that is playing; a touch sets the value on every one of them.",
  labels_position: "Above or below a horizontal lever, left or right of a vertical one. A side that does not fit is turned to the nearest that does.",
  setpoint: "Optional. A second entity, for example the heating setpoint: a dark pointer outside the scale. A climate entity gives its target temperature.",
  rules_entity: "Optional. Judge the rules below by another entity's state, for example a level sensor. The lists below then offer that entity's states.",
  selected_when: "Type a state if it is not listed.",
  alert_when: "Type a state if it is not listed.",
  state_colours: "Optional. A colour for each state, instead of red for every warning. A state listed here wins over \"warning when\".",
  value_colours: "Optional. Colour the piece when the number is above or below a value, for example CO2 above 1000. The strictest matching row wins.",
  value: "A fixed value. Used only when no entity is set. The red mark sits at the value; nothing is drawn when there is none.",
  interval: "Distance between the small tick marks. On an interactive dial it is also the step.",
  major: "Distance between the thick tick marks, counted from the minimum. Empty: only the first and the last.",
  columns: "Only used inside a Rams panel. A standalone card is sized in the Layout tab.",
  rows: "Only used inside a Rams panel. A standalone card is sized in the Layout tab.",
};

export const computeHelper = (s: { name: string; helper?: string }): string | undefined => s.helper ?? HELPERS[s.name];

export const num = (name: string, min?: number, max?: number, extra: Record<string, unknown> = {}) => ({
  name,
  selector: { number: { min, max, mode: "box", ...extra } },
});

export const dropdown = (name: string, options: Array<[string, string]>, extra: { label?: string; helper?: string } = {}) => ({
  name,
  ...extra,
  selector: { select: { mode: "dropdown", options: options.map(([value, label]) => ({ value, label })) } },
});

export const FRAMES: Array<[string, string]> = [["none", "None"], ["outline", "Outline"], ["raised", "Raised plate"], ["recessed", "Display: light by day, green at night"], ["backlit", "Display: green backlit, day and night"], ["black", "Display: black with yellow-green light"]];

export const SIZES: Array<[string, string]> = [["small", "Small"], ["medium", "Medium"], ["large", "Large"]];

/** Size in a panel (collapsed: a standalone card is sized in HA's Layout tab) and, where it has one, the frame. */
export const layoutFields = (frame = true) => [
  {
    type: "expandable",
    name: "",
    title: "Size in panel",
    schema: [{ type: "grid", name: "", schema: [num("columns", 1, 24), num("rows", 0.5, 24, { step: 0.5 })] }],
  },
  ...(frame ? [dropdown("frame", FRAMES)] : []),
];

export const actionFields = () => [
  { name: "tap_action", selector: { ui_action: {} } },
  { name: "hold_action", selector: { ui_action: {} } },
];
