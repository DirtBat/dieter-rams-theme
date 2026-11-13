# Cards (13 Nov 2026)

Principle: as few card types as possible. Anything that is only a combination of pieces is a panel configuration, not a card.

## Core set (v1)
| Card | Role | Main options | Covers (from current Mies / Rams studies) | Status |
|---|---|---|---|---|
| `rams-panel` | Container: plate, N columns, holds pieces and nested panels | columns | every cluster: thermostat, light block, scenes, transport, alarm, volume row | done |
| `rams-button` | Key or round, 1-2 lines | entity, name, label or state line, shape, tone, alert_when, selected_when, tap/hold action, columns, rows | tabs, scenes, presets, toggles, openings, shutters, alarm modes, transport, keypad digits, - / + | done (needs stepper, see below) |
| `rams-display` | Text block, 1-2 lines | title, text or entity/attribute, unit, size, align, frame (none / outline / recessed) | big values, side values, captions, LCD, status and advice strips, verdict, now-playing title block | done |
| `rams-ruler` | Scale with pointer | entity, min, max, step, target entity, centre-zero variant, captions, optional touch to set | temperature scale and trend, dimmer level, volume | next |
| `rams-artwork` | Square picture | picture source (entity picture or image), caption, playing LED, tap action | now-playing cover, radio / album / podcast tiles | planned |
| `rams-clock` | Time | analog dial or digital, seconds, alarm key | the cleaner clock | planned |

## Behaviours the core cards still need
- **Stepper** on the button: increase / decrease an entity or attribute by a step within min / max (temperature target, light level). HA has no relative "set temperature", and templates are not allowed, so the card must do it.
- **Touch to set** on the ruler: tap or drag to set a number / light / volume value.

## Dynamic and stateful cards (decided 13 Nov: all three are in)
| Card | Role | Design notes | Open |
|---|---|---|---|
| `rams-keypad` | Alarm code entry | One piece: code dots, digit keys (round, 3 x 4), and mode keys (disarm / arm home / arm away / arm night, chosen in the form). Digits are collected inside the piece; the code is never stored in the config (it is typed each time) and goes only to the alarm service call. Fills the panel width: digits in one half, mode keys in the other. | Entities with no code required: show only mode keys |
| `rams-shelf` | Radio / album / podcast / playlist tiles from data | Reads items from an entity (state or attribute, JSON list). Each item becomes an artwork tile. Options: source entity and attribute, kind filter, tiles per row, target media player, tap action (play item on the player). Outlined / LED while that item plays. | Needs the real format of `input_select.music_favourites_data` (see below) |
| `rams-list` | Dynamic text list | Reads a list from an entity attribute (e.g. `sensor.health_offline_list`, attribute `devices` = list of name / area). Options: entity, attribute, which keys give the main and second line, empty text, max items ("+n more"), optional tap action. Item height is half a grid row (two items per row unit). | none |

Shared point: both data-driven cards have a height that depends on the data. Plan: the piece declares `rows: auto` and the panel measures it and sets the row span to whole rows, so the grid stays intact. To prototype.

Needed from the user: a sample of what `input_select.music_favourites_data` holds (state and attributes) so the shelf reads the real format. Not guessed.

## Not built, use HA's own
Cameras (picture-entity), history graphs, anything else HA already has: a panel accepts any card as a piece.
