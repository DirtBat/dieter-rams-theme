# Cards (13 Nov 2026)

Principle: as few card types as possible. Anything that is only a combination of pieces is a panel configuration, not a card.

## Core set (v1)
| Card | Role | Main options | Covers (from current Mies / Rams studies) | Status |
|---|---|---|---|---|
| `rams-panel` | Container: plate, N columns, holds pieces and nested panels | columns | every cluster: thermostat, light block, scenes, transport, alarm, volume row | done |
| `rams-button` | Key: blank cap with a dish, state dot, warning LED above, name printed below | entity, name, shape (square, wide, round), alert_when, selected_when, colour by state, rules_entity, tap/hold action, columns, rows | tabs, scenes, presets, toggles, openings, shutters, transport, - / + | rebuilt 2026-11-17, in lab only |
| `rams-selector` | Lever or knob with one stop per option. Replaces `rams-switch`: with an on/off entity (input_boolean, switch, light, fan) it has two stops, off and on. | entity, title, title_position, options (option, label, icon), shape (lever, knob), cap (round, pointer), size (small, medium, large), orientation (lever), order (knob), labels_position, show (auto, labels, both, none), light (none, above, below, options), lines, state rules, columns, rows | switches, three or more way selectors | done 2026-11-19 |
| `rams-display` | Text block, 1-2 lines | title, text or entity/attribute, unit, size, align, frame (none / outline / recessed) | big values, side values, captions, LCD, status and advice strips, verdict, now-playing title block | done. A lamp-only display with a left or right title keeps the lamp in a fixed 28px column and gives the label all the remaining width, so lamps line up between cards and labels are not cut short. |
| `rams-ruler` | Scale with pointer | entity, min, max, step, target entity, centre-zero variant, captions, optional touch to set | temperature scale and trend, dimmer level, volume | done: scale with pointer, centre-zero bar, target mark, touch to set (tested: drag sets a number helper) |
| `rams-artwork` | Square picture | picture source (entity picture or image), caption, playing LED, tap action | now-playing cover, radio / album / podcast tiles | done (entity picture or fixed image, caption, playing LED). `proportion` (square default, 4:3, 3:2, 16:9, portrait), `live` (camera MJPEG stream instead of the still) and `screen` (black CRT bezel, tinted glass) for camera views. |
| `rams-clock` | Time | analog dial or digital, seconds, alarm key | the cleaner clock | done (uses the HA time zone) |

## Behaviours (both done 13 Nov)
- **Stepper** on the button: increase / decrease an entity or attribute by a step within min / max (temperature target, light level). HA has no relative "set temperature", and templates are not allowed, so the card must do it.
- **Touch to set** on the ruler: tap or drag to set a number / light / volume value.

## Dynamic and stateful cards (decided 13 Nov: all three are in; all built 13 Nov)
| Card | Role | Design notes | Open |
|---|---|---|---|
| `rams-keypad` | The whole alarm card: LCD with the alarm state, round keys 1-9, clear, 0, confirm, and a row of round arm keys (home, away, night) | entity, modes, colour by state, frame | alarm panel | reset 2026-11-20. Confirm only disarms, and is dead until a digit is typed or while disarmed. The arm keys work only while disarmed; the current armed mode stays lit orange; when the panel needs a code to arm, the arm keys wait for a digit. The code is sent only when typed. `modes` picks the keys under the keypad: home, away, night, vacation, and Disarm (same as ✓: dead while disarmed or until a digit is typed). Edge margin 12px, never smaller than the gap between keys. Triggered, pending and armed away are red by default. |
| `rams-shelf` | Radio / album / podcast / playlist tiles from data | Reads items from an entity (state or attribute, JSON list). Each item becomes an artwork tile. Options: source entity and attribute, kind filter, tiles per row, target media player, tap action (play item on the player). Outlined / LED while that item plays. | Needs the real format of `input_select.music_favourites_data` (see below) |
| `rams-list` | Dynamic text list | Reads a list from an entity attribute (e.g. `sensor.health_offline_list`, attribute `devices` = list of name / area). Options: entity, attribute, which keys give the main and second line, empty text, max items ("+n more"), optional tap action. Item height is half a grid row (two items per row unit). | none |

Shared point: both data-driven cards have a height that depends on the data. Plan: the piece declares `rows: auto` and the panel measures it and sets the row span to whole rows, so the grid stays intact. To prototype.

Needed from the user: a sample of what `input_select.music_favourites_data` holds (state and attributes) so the shelf reads the real format. Not guessed.

## Not built, use HA's own
Cameras (picture-entity), history graphs, anything else HA already has: a panel accepts any card as a piece.

## Status 13 Nov, evening
All nine cards are built and tested in a lab HA (2026.2.3): panel, button (stepper), display, ruler (touch to set), artwork, clock, list, keypad (wrong code rejected, right code arms), shelf. `rows: auto` works: list and shelf report their height and the panel sets whole row spans.
Not yet verified: on a real HA with real entities, phone and tablet widths, the shelf against the real favourites data (it expects a list of items with title, picture, kind, media_content_id, media_content_type), the night theme (deliberately last).

## Iteration 2 (13 Nov 2026, local only, not pushed)

- Light plate (#F5F4F0, caps white, fields #EAE9E3), outline on the panel plate, one base radius (6) with plate radius = radius + gap, `spacing` option on the panel (default 8).
- `frame: none | outline | recessed | backlit | black | raised` on every piece and on the panel plate. `recessed` is the LCD that follows day and night (light by day, green backlit at night); `backlit` is that green backlit LCD at any time; `black` is a black field with yellow-green lights (tokens `rams-led-bg`, `rams-led-ink`; `rams-backlit-bg`, `rams-backlit-ink`). Defaults: panel raised, display recessed, artwork raised, others none.
- Key: size follows the Layout tab (or columns/rows in a panel); a 1x2, 4x1 or 2x1 key is just a bigger key, the dish becomes a pill when the key carries text. `shape`: square, wide (a light pill, three times as wide as high) or round (a dome on a dark ring, always a circle). `label_position`: below (default), above, left, right or inside. `tone` colours the whole key; a colour from the state rules shows as a dot. The LED above lights on a warning (`alert_when` or an automatic warning); active (`selected_when`) keeps the key pressed in. `icon` is optional, with the standard HA icon picker. Removed: show_state, tone_style, size, align (old configs ignore them).
- Warnings: red key + triangle. Automatic for binary sensors with problem-type device classes; `alert_when` overrides.
- Actions: tap and hold on every piece and on the panel (panel action fires only where no piece handles the press). Default tap toggles toggleable domains, otherwise opens more-info.
- `adjust_by` only for climate entities; elsewhere use a perform-action tap action (e.g. `input_number.decrement`).
- List: multiple entities (name, state, dot), optional toggle or cover keys. Per row (2026-11-18): `icon`; `lamp` (lights on a warning, `alert_when` as one or several states separated by commas, or automatic for problem-type binary sensors; `lamp_tone` sets its colour, default red); `show`: all (default), name, value, or none for just the icon and lamp. Rows without an icon or lamp keep the same indent.
- Dial (new): half-round scale, needle, no centre knob; value from entity or fixed; min, max, interval; optional touch to set.
- Artwork: square from its width when no height is set; optional media keys.
- Panel: working title; stray stack-editor title hidden; pieces default to full panel width; editor says "width / height (grid units)".

- Nested panels (2026-11-18): an inner panel reports the rows it needs to the outer one, so the pieces after it flow around it and never overlap. A blank key name on the left or right prints no label. Inside another panel, `columns` is also the panel's width in the parent's grid units (so its pieces share the parent's grid unit), `rows` is its height (a minimum), and its rows share any spare height so no blank strip is left. The editor has a "Size in panel" section with `rows`.
- Nested panel with `rows` set is exactly that many rows tall, like the pieces next to it; its own rows share what is left (so a 2-row panel's content rows are a little under one row each). Without `rows` it takes what its content needs.
- Dial (2026-11-18): `title` and `title_position` (inside the arc by default, or above, below, left, right; `label` still works as the old name); `show: none` hides the number in the middle; the number is centred on a dial whose arc runs down the side.
- Dial (2026-11-19): redrawn in pixels. The arc is as large as the room allows and nothing is clipped; the text keeps its size however flat or small the arc is. The needle is now one red mark across the scale at the value (nothing is drawn without a value; `entity` wins over `value`). The number sits right under the scale, `align: start | center | end`. Thick ticks only at the first and last mark, or every `major` units; `interval` is the small ticks.
- Dial `setpoint`: a second entity (a helper, a sensor, or a climate entity's target) drawn as a dark pointer outside the scale, next to the red mark for the value.
- Display: a blank `title` (a space) prints nothing and takes no room; icon, text and unit share one centre line.
- Panel: the content is centred in the plate. HA sizes a panel in whole rows, so a panel whose content plus padding just exceeds N rows is N+1 rows tall; the spare space is now split top and bottom instead of all at the bottom.
- Button: a key with a `tone` takes the colour a state rule gives it while the rule matches (for example a round key that follows the house mode); a key with no tone still shows the rule's colour as a dot. "Colour by state" takes the state as text.
- Editor (button, display, selector): "active when" and "warning when" offer the states of the rules entity when one is set, else of the card's entity. Before, they stayed greyed out on a card with only a rules entity.
- Night: the recessed LCD is a dim grey with a hint of green, with dark ink. A recessed panel now passes its ink to the pieces inside it (before, they kept the light night ink).
- Fixed: an outside title on the display, clock and dial now sits where `title_position` says (above and left were swapped with below and right).
- Switch (2026-11-18): fits one row (56px) by dropping the off/on words when it is short. With `alert_when` (for example a cover's `open`) its lamp lights red; the lever sits right while the entity is open/on.
- Spacing (2026-11-17): a key, its LED and its name are one group, centred in the card's room with one 5px gap; spare room goes outside the group. Applies to button; the display centres its title and value the same way. Round keys are always a circle.
- Display `show`: all (title and value, default), value (value only), title (title only) or none (icon and light only). An outside title always prints. The icon and the lamp share one centre line. A lit lamp's glow is no longer clipped at the display's or the list's edge.
- Display `light`: none (default), left, right or only the light. A status lamp that lights in the colour the state rules give (red for a warning); the display then stays unfilled. With `only` it is a standalone warning light; an outside title labels it.
- Display (2026-11-17): `title_position` inside, above, below, left or right; optional `icon`. The LCD is grey-green by day and a backlit grey-green by night. An optional amber display is for a later iteration. Attribute pickers (display, dial, ruler, shelf) now get the entity as context; before, they stayed greyed out.
- Clock (2026-11-17): thinner hands and dots; optional title printed outside (above, below, left, right); the digital clock is a recessed LCD like the display; the alarm is a small LED on the clock (tap to switch). Ruler: orientation horizontal or vertical (lowest value at the bottom); min, max and a target mark were already there.

## Selector (2026-11-19)
- Replaces `rams-switch`, which is removed. Migrate: `type: custom:rams-selector`, `name` becomes `title`, and set `title_position: below` to keep the name under the switch.
- Lever: tap the lever to step on to the next option (wraps); tap another stop to go there. Labels sit on one side, with optional leading lines (hooked on a horizontal lever) or one lamp per option, never both. Icons replace labels when `show: auto` and an option has an icon.
- Knob: `shape: knob`. The left half steps left on the scale, the right half right, with no wrap. `cap: round` or `cap: pointer` (a round body with a slim tab, 36 degrees per step, shadow).
- The knob needs room: the cap and its scale are a fixed size per `size` (104, 128, 156 px).
- Knob labels: `labels_position` is above (default), below, left or right of the knob, and the fan of options turns to match. At the side the labels stand in a straight column with the text flush against it; above and below they follow the arc. `order` is normal (first option on the left, or on top at the side) or reversed. Both caps draw the same scale arc with a tick at each option (`lines` does not apply to a knob); with `light: options` there is no arc and the lamps sit on its circle. At the side, each label is centred on its tick or lamp. At the side the two active halves are top and bottom instead of left and right.
- Round cap: spun-metal face with a red triangle pointing out at the current option; the shadow falls the same way whatever the position.

## Button (2026-11-20)
- `shape: square` (default) is always a square: the biggest that fits the card minus its lamp and name, centred. It no longer stretches into a pill when the card is wide or tall. `tall` and `round` are unchanged.
- A square key sits in a black cut-out (token `--rams-cutout`, default #17110c). The cut-out reaches half a panel gap past the key on each side, so keys whose columns are no wider than the key itself touch and form one block: the black between two keys is twice the black round the outside.
- `icon_tone` colours the icon with the same colours as `tone` (neutral keeps the key ink). Works on any shape, also on a toned key.
- `light` sets the lamp above the key: automatic (default; a lamp only where warning states are set), none, lit on a warning, lit while on or selected, or both. A state rule gives the lit lamp its colour, otherwise red.

## Panel screws (2026-11-20)
- `screws: true` puts a cross-head screw in each corner of the plate (not with `frame: none`). The padding grows by 18px so no piece touches a screw. Off by default; editor toggle "screws".

## Label (2026-11-20)
- `rams-label`: a heading for a group in a panel. Half a row high (24px on the default grid) instead of a whole row. Options: `text` or `entity` (+ `attribute`, `unit`), `icon`, `size` (small caps 11px, medium 14, large 18), `align`, `line` (none / below / above / beside the text), tap and hold actions, and the state rules (`rules_entity`, `state_colours`, `value_colours`) colour the text.
- The panel grid now counts in half rows (two plus the gap make one row), so existing cards keep their size. `rows: 0.5` or `1.5` works on any card inside a panel; a label defaults to 0.5.

## Ruler and dial: several entities, gauge options (2026-11-20)
- `entities` (ruler and dial) stands for several entities as one: the one that is playing is shown, a touch sets all of them. Use it for one volume over several speakers.
- The ruler took the gauge's options: `title` + `title_position`, `interval` (small ticks), `major` (thick ticks), `value` (fixed), `number` (the value under the scale) + `align`. Left empty it looks as before.

## Shelf: play where the selector says (2026-11-20)
- `player_from` (an input_select or select) makes a tapped tile play on the player that option names; `player` is the fallback. An option is matched by name (Kitchen finds media_player.kitchen_ma or media_player.kitchen); `players` maps options to players when the names differ. The playing LED follows the same player.

## Selector: scenes (2026-11-20)
- An option can carry `scene:` (an HA scene). With scenes on the options and no `entity`, a tap calls `scene.turn_on`, and the current option is the scene turned on last (a scene state is its last-activated time). `light: options` lights that option; `state_colours` colour it. Stale after manual light changes, like any scene.

- Knob with labels at the side: the options are spaced evenly down the label column and the fan stays within 180 degrees, so six or more options do not pile up at the ends (two and three options look as before).

## List: lamp on every row, lamp colour by number (2026-11-21)

- `lamp: true` puts a lamp before every row; `alert_when` (card level) lights it on those states.
- `value_colours` colours the lamp by the row's number: above or below a value, the strictest match wins. A number that matches none lights the lamp grey. Battery example: below 5 red, below 15 orange, above 50 green, anything else grey.
- Works with auto-entities (`card_param: entities`): one list of every battery, sorted by state.
- `compact: true` drops the small device-class line above each name, for a compact list.
- Display: an entity whose device class is timestamp (last boot) prints as a formatted date and time.
- List: `value_attribute` prints an attribute of each entity as its value (a thermostat's `temperature` or `current_temperature`), numbers rounded to one decimal, with an optional `unit` after it. A row shows – when the attribute is missing.

- Knob selector (2026-11-22): options sit at equal angles. The fan never reaches 180 degrees (150 at most), so no option points exactly along the knob's axis. Labels above or below stand in one row, and labels at the side in one column, with the same space between the texts, whatever the lamps do on the arc. Labels shrink a little when they would touch.
- Button `shape: wide` replaces `tall`: a pill in the same light cap colour as the other keys, three times as wide as high. An old `shape: tall` shows as a square key.
- Editor fields now follow one order on every card: name or title, source (entity, attribute, icon), values, looks, size in panel and frame, actions, state rules.

- Display and label print a number through Home Assistant's own formatting, so the entity's display precision applies (a template sensor may hold 0.20000000000000018). The entity's unit is left off: the card prints its `unit` field. Text states print as they are.
- Card picker examples: each card's example (`getStubConfig`) uses one of your own entities when there is a fitting one (a light for the button, a number sensor for the display, a thermostat for the dial, an input_select for the selector, lights for the list, a media player with a cover for the artwork, an alarm panel for the keypad), else fixed example values. They show what is special about the card: the key's lamp, the LCD with its unit, the dial's target pointer, the knob with a lamp on each option, switch keys on the list, transport keys on the artwork.
- Titles (2026-11-23, breaking): every title is printed below its piece unless `title_position` says otherwise (display, dial, ruler, clock and selector; the display and dial can still put it `inside`). Before, the display and dial printed it inside, the ruler and clock above. A display that only shows its title (`show: title`) still prints it inside.
- Controls on a card are the Rams keys, not separate button styles: the artwork's media keys are wide keys (previous, play / pause, next; play is pressed while the player plays) and the list's row keys are small round keys (a power key pressed while the entity is on, or up / down for covers).
- Button: `light: none` now draws no lamp and reserves no room above the key (`auto` still reserves it so keys in a row line up); `name: ""` prints no text (it used to fall back to the entity name); a wide key is the same light cap colour as the other keys and goes down, takes a tone and lights exactly like them (the `rams-graphite` tokens are gone).

## 2026-11-24 consistency pass (breaking changes)
- Frame names in the editor are plain: Raised plate, and three displays (light by day and green at night; green backlit; black with yellow-green light). Stored values are unchanged.
- Dial: any arc, with a red mark and a target pointer. Selector: knob or lever, with the lamp option called "Lamps".
- Lamps: the button, display and selector each label their `light` field for what it is. `light: none` and automatic without warning states show no lamp and take no room.
- Titles default to below on every card. Pieces in a row align to the top; leftover space sits at the bottom.
- Controls on the artwork and list cards are Rams buttons (round or wide), not HA defaults.
- Button: a colour from the state rules fills the key. The small state dot is gone.
- Units (for example °C) are never smaller than 11px. A missing entity shows a dash.
- A panel's own tap action now fires when nothing inside it is actionable. List rows are actionable per row.
- Number fields snap to the step from the minimum and show no float noise.
- The card picker shows a real example when an entity of the right kind exists.
- Tokens removed: `rams-lever`, `rams-cap-rest`, `rams-cap-on`, `rams-cap-on-mix`. Copy the updated theme file after updating.
- The panel editor no longer writes default columns, spacing or frame into the YAML.

## 2026-11-25
- Dial and ruler: `tap_action` and `hold_action` are back (default: no action). They are not used while `interactive` is on, because a touch then sets the value.
- Dial: `align: inside` puts the number in the centre of the gauge; the old centre option is labelled "Below" (stored value unchanged). The field is called "Number position".
- Selector knob: label text follows the Size setting instead of the knob's width, so a wide horizontal knob no longer gets very large labels.
- Dial: with the title above or below, the title sits directly against the gauge instead of at the bottom of the card. The centred number is centred between the arc's ends with its bottom on the line between them, and as large as fits inside the scale.
