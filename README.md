# dieter-rams-theme

Home Assistant cards in a Braun / Dieter Rams-inspired design language, written from scratch (TypeScript + Lit, one built file `dist/dieter-rams-theme.js`).
Everything is editable in the HA visual editor. Status: early. `rams-panel`, `rams-button` (with stepper), `rams-display` and `rams-ruler` (with touch to set) work in a real HA instance (tested on 2026.2.3).

## The idea: lego
- **`rams-panel`**: container. Draws the plate, has N columns, holds any pieces (and nested panels). Pieces are added, moved and configured in the visual editor.
- **Pieces**: small cards that take `columns` and `rows` on the panel grid.
  - `rams-button`: key or round, one or two lines, state-driven tone / selected outline, tap and hold actions
  - `rams-display`: text block, one or two lines, frame none / outline / recessed, fixed text or entity value
  - `rams-ruler`: scale with pointer or centre bar, optional target mark, touch to set
  - `rams-artwork`, `rams-clock`, `rams-list`, `rams-keypad`, `rams-shelf`
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
