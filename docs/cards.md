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

## Candidates (decide later)
| Candidate | Why | Alternative |
|---|---|---|
| `rams-keypad` or code entry | Digit keys must accumulate a code before arming; a panel of buttons cannot hold that state | use HA's native alarm panel card inside a panel |
| `rams-shelf` | Radio / album tiles generated from `input_select.music_favourites_data`; a fixed panel needs one artwork card per station | write each station as an artwork piece |
| `rams-list` | Dynamic list, e.g. health / offline devices from a sensor attribute | HA's native entities or markdown card inside a panel |

## Not built, use HA's own
Cameras (picture-entity), history graphs, anything else HA already has: a panel accepts any card as a piece.
