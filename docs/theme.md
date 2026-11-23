# Theme: day and night

`themes/dieter_rams.yaml` is one HA theme with a light mode (day) and a dark mode (night). Copy it to `/config/themes/`, reload themes, and choose **Dieter Rams** in your profile. Day or night follows HA's Dark mode setting (Auto, Light, Dark) or the `frontend.set_theme` action (`name: Dieter Rams`, `mode: dark`).

The cards have no look of their own beyond the day defaults: everything is a `--rams-*` variable, so without the theme they still render as day.

## Roles

| Variable | Day | Night |
|---|---|---|
| `rams-plate`, `rams-cap`, `rams-field` | warm white surfaces | anthracite surfaces |
| `rams-down` | key that is down: darker than the cap | key that is down: lit |
| `rams-raised`, `rams-pressed`, `rams-inset` | shadows | no drop shadows, hairline edges |
| `rams-glow` | 0 | blur radius of the light around LEDs, lit keys and warnings |
| `rams-cutout-edge` | the light hairline under a square key's black cut-out | transparent in the dark theme |
| `rams-lcd-bg`, `rams-lcd-ink` | green, reflective | amber, lit from the top |

Night: a colour stripe becomes an LED, a full-colour key is backlit, light reaches beyond the key. All treatments are static (no animation, no filters), so they stay light to render.

The theme is not applied inside HA's card editor dialog (HA limitation), so the editor preview shows day values.
