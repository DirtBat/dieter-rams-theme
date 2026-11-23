# dieter-rams-theme

Home Assistant cards in a Braun / Dieter Rams-inspired design language, written from scratch (TypeScript + Lit, one built file `dist/dieter-rams-theme.js`).
Everything is editable in the HA visual editor. Status: in use. The editors and the card picker are tested in the lab harness; behaviour in a real Home Assistant instance is checked by hand after each release.

## The idea: lego
- **`rams-panel`**: container. Draws the plate, has N columns, holds any pieces (and nested panels). Pieces are added, moved and configured in the visual editor.
- **Pieces**: small cards that take `columns` and `rows` on the panel grid (rows count in half steps).
  - `rams-button`: a key in three shapes (square, wide, round), an optional lamp, state colours, tap and hold actions, and a stepper for thermostats
  - `rams-display`: text block with one or two lines, an optional lamp and icon, frames from none to a backlit screen
  - `rams-label`: a heading for a group of pieces, half a row high, with an optional hairline
  - `rams-ruler`: a scale with a pointer or centre bar and an optional target mark; touch to set
  - `rams-dial`: a round scale with a needle, a red mark and a target pointer; any arc
  - `rams-selector`: a knob or lever with one stop per option (a select, an input_select or an on/off switch)
  - `rams-artwork`, `rams-shelf`: cover pictures with a playing lamp and media keys
  - `rams-clock` (analogue or digital), `rams-list` (entities with state and optional keys), `rams-keypad` (alarm code entry)
- Frames: none, outline, raised plate, and three displays: light by day and green at night, always green backlit, or black with yellow-green light.
- Titles are printed below by default.
- Colours and depth are roles (`--rams-*` CSS variables) with built-in light defaults; a HA theme can override them (night).

## Layout
```
src/shared/      types, tokens (styles.ts), Piece base class, actions, state rules
src/cards/       one file per card; panel-editor.ts isolates the use of HA's internal stack editor
src/index.ts     registers the cards
docs/            spec, palette, feasibility findings
reference/       the earlier CSS visual study (look only; not the code base)
spikes/          throwaway experiments
```

## Build
`npm install && npm run build` writes `dist/dieter-rams-theme.js`. The built file is committed, so the repo can be installed with HACS.

## Install (HACS)
HACS > three-dot menu > Custom repositories > add `https://github.com/DirtBat/dieter-rams-theme`, type **Dashboard**. Download it from HACS (Frontend), then reload the browser. HACS registers the resource itself.

Manual alternative: copy `dist/dieter-rams-theme.js` to `/config/www/` and add `/local/dieter-rams-theme.js` as a dashboard resource (type: module).
