# Cards (13 Nov 2026)

Principle: as few card types as possible. Anything that is only a combination of pieces is a panel configuration, not a card.

## Core set (v1)
| Card | Role | Main options | Covers (from current Mies / Rams studies) | Status |
|---|---|---|---|---|
| `rams-panel` | Container: plate, N columns, holds pieces and nested panels | columns | every cluster: thermostat, light block, scenes, transport, alarm, volume row | done |
| `rams-button` | Key: blank cap with a dish, state dot, warning LED above, name printed below | entity, name, shape (square, tall), alert_when, selected_when, colour by state, rules_entity, tap/hold action, columns, rows | tabs, scenes, presets, toggles, openings, shutters, transport, - / + | rebuilt 2026-11-17, in lab only |
| `rams-switch` | On/off switch: lever left = off, right = on, LED above, name below | entity, name, alert_when, selected_when, rules_entity, tap/hold action, columns, rows | boolean toggles | new 2026-11-17, in lab only |
| `rams-display` | Text block, 1-2 lines | title, text or entity/attribute, unit, size, align, frame (none / outline / recessed) | big values, side values, captions, LCD, status and advice strips, verdict, now-playing title block | done |
| `rams-ruler` | Scale with pointer | entity, min, max, step, target entity, centre-zero variant, captions, optional touch to set | temperature scale and trend, dimmer level, volume | done: scale with pointer, centre-zero bar, target mark, touch to set (tested: drag sets a number helper) |
| `rams-artwork` | Square picture | picture source (entity picture or image), caption, playing LED, tap action | now-playing cover, radio / album / podcast tiles | done (entity picture or fixed image, caption, playing LED) |
| `rams-clock` | Time | analog dial or digital, seconds, alarm key | the cleaner clock | done (uses the HA time zone) |

## Behaviours (both done 13 Nov)
- **Stepper** on the button: increase / decrease an entity or attribute by a step within min / max (temperature target, light level). HA has no relative "set temperature", and templates are not allowed, so the card must do it.
- **Touch to set** on the ruler: tap or drag to set a number / light / volume value.

## Dynamic and stateful cards (decided 13 Nov: all three are in; all built 13 Nov)
| Card | Role | Design notes | Open |
|---|---|---|---|
| `rams-keypad` | Code entry after the default Alarmo keypad: code field with the alarm state, round keys 1-9, clear, 0, confirm | entity, arm_mode, colour by state | alarm panel | rebuilt 2026-11-17, in lab only. Confirm disarms an armed alarm and arms a disarmed one; the code is sent only when typed. Triggered, pending and armed away are red by default. |
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
- `frame: none | outline | recessed | raised` on every piece and on the panel plate. Defaults: panel raised, display recessed, artwork raised, others none.
- Key: size follows the Layout tab (or columns/rows in a panel); a 1x2, 4x1 or 2x1 key is just a bigger key, the dish becomes a pill when the key is long, tall or carries text. `shape`: square, tall (half as wide, same box) or round (a dome on a dark ring, always a circle). `label_position`: below (default), above, left, right or inside. `tone` colours the whole key; a colour from the state rules shows as a dot. The LED above lights on a warning (`alert_when` or an automatic warning); active (`selected_when`) keeps the key pressed in. `icon` is optional, with the standard HA icon picker. Removed: show_state, tone_style, size, align (old configs ignore them).
- Warnings: red key + triangle. Automatic for binary sensors with problem-type device classes; `alert_when` overrides.
- Actions: tap and hold on every piece and on the panel (panel action fires only where no piece handles the press). Default tap toggles toggleable domains, otherwise opens more-info.
- `adjust_by` only for climate entities; elsewhere use a perform-action tap action (e.g. `input_number.decrement`).
- List: multiple entities (name, state, dot), optional toggle or cover keys. Per row (2026-11-18): `icon`; `lamp` (lights on a warning, `alert_when` as one or several states separated by commas, or automatic for problem-type binary sensors; `lamp_tone` sets its colour, default red); `show`: all (default), name, value, or none for just the icon and lamp. Rows without an icon or lamp keep the same indent.
- Dial (new): half-round scale, needle, no centre knob; value from entity or fixed; min, max, interval; optional touch to set.
- Artwork: square from its width when no height is set; optional media keys.
- Panel: working title; stray stack-editor title hidden; pieces default to full panel width; editor says "width / height (grid units)".

- Nested panels (2026-11-18): an inner panel reports the rows it needs to the outer one, so the pieces after it flow around it and never overlap. A blank key name on the left or right prints no label. Inside another panel, `columns` is also the panel's width in the parent's grid units (so its pieces share the parent's grid unit), `rows` is its height (a minimum), and its rows share any spare height so no blank strip is left. The editor has a "Size in panel" section with `rows`.
- Spacing (2026-11-17): a key, its LED and its name are one group, centred in the card's room with one 5px gap; spare room goes outside the group. Applies to button and switch; the display centres its title and value the same way. Round keys are always a circle.
- Display `show`: all (title and value, default), value (value only), title (title only) or none (icon and light only). An outside title always prints. The icon and the lamp share one centre line. A lit lamp's glow is no longer clipped at the display's or the list's edge.
- Display `light`: none (default), left, right or only the light. A status lamp that lights in the colour the state rules give (red for a warning); the display then stays unfilled. With `only` it is a standalone warning light; an outside title labels it.
- Display (2026-11-17): `title_position` inside, above, below, left or right; optional `icon`. The LCD is grey-green by day and a backlit grey-green by night. An optional amber display is for a later iteration. Attribute pickers (display, dial, ruler, shelf) now get the entity as context; before, they stayed greyed out.
- Clock (2026-11-17): thinner hands and dots; optional title printed outside (above, below, left, right); the digital clock is a recessed LCD like the display; the alarm is a small LED on the clock (tap to switch). Ruler: orientation horizontal or vertical (lowest value at the bottom); min, max and a target mark were already there.
