/** Small builders for ha-form schemas, so every piece offers the same fields in the same words. */
const LABELS: Record<string, string> = {
  columns: "width in panel (grid units)",
  rows: "height in panel (grid units)",
  selected_when: "active when",
  alert_when: "warning when",
  state_colours: "colour by state",
  value_colours: "colour by value",
};

export const computeLabel = (s: { name: string }): string => LABELS[s.name] ?? s.name.replace(/_/g, " ");

const HELPERS: Record<string, string> = {
  player_from: "Optional. An input_select that says where to play, for example your music output selector. A tapped tile then plays on the player it names; the player above is the fallback.",
  players: "Optional. Which player goes with which option. Left empty, an option is matched by name: Kitchen finds media_player.kitchen_ma or media_player.kitchen.",
  entities: "Optional, instead of the entity: several at once, for example all your speakers. The ruler shows the one that is playing; a touch sets the value on every one of them.",
  options: "Optional. Rename an option, give it an icon, put them in another order or leave one out. Type each option exactly as the entity names it. Left empty: all of the entity's options, as named.",
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

export const SIZES: Array<[string, string]> = [["small", "Small"], ["medium", "Medium"], ["large", "Large"]];

/** Size in a panel (collapsed: a standalone card is sized in HA's Layout tab) and, where it has one, the frame. */
export const layoutFields = (frame = true) => [
  {
    type: "expandable",
    name: "",
    title: "Size in panel",
    schema: [{ type: "grid", name: "", schema: [num("columns", 1, 12), num("rows", 1, 12)] }],
  },
  ...(frame ? [dropdown("frame", FRAMES)] : []),
];

export const actionFields = () => [
  { name: "tap_action", selector: { ui_action: {} } },
  { name: "hold_action", selector: { ui_action: {} } },
];
