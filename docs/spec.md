# Scaffolding spec v0.2

Supersedes the HA project doc `design-scaffolding-spec-2026-11-13.md` (v0.1). Changes follow the 13 Nov review.

## Layers
1. Scaffolding (grid, atoms, clusters): `src/atoms.css`, `src/clusters.css`
2. Skin (roles, themes, elevation): `src/tokens.css`, `src/themes/`
3. Editor (HA custom card with form editor): not started; every atom below lists its editable fields

## Grid rules
- Section = 12 columns, gap 8px, row unit 56px. Card internal grid = its own column span, same gap and row.
- R1 all items in a row have the same height (every row is one unit; tiles span whole rows)
- R2 cluster atoms sit on the outer grid (CSS subgrid); the plate bleeds 3px into the gap
- R3 round button cell is 2 x 1; the circle is as tall as the cell (56px) or 38px with a label above, centred, and shrinks to the cell width when the section is narrower (below 376px the circle is smaller than 56px but stays round)
- R4 artwork and dial are square: columns = 2 x rows

## Atoms (v0.2)
| Atom | Class | Cells | Editable | Fixed |
|---|---|---|---|---|
| Key | `.rm-key` | 2-6 x 1 | action, label, LED source, tone (neutral / dark / alert) | height, bevel, LED |
| Round | `.rm-round` | 2 x 1 | action, glyph or text (<= 4 chars), optional label above, tone (neutral / active / dark / alert) | size, ring |
| Tile | `.rm-tile` | 6-12 x 1-3 | entity, label, unit, 0-2 side values, optional ruler (min, max, value, target) | arrangement |
| LCD | `.rm-lcd` | 4-12 x 1-2 | entity or text, small caption, dot (ok / active / alert) | mono type, recessed field |
| Artwork | `.rm-art` | 4x2, 6x3 | picture source, caption, playing LED | square |
| Dial | `.rm-dial` | 6x3 | seconds on/off | hands, dots |

Merged: the status strip is now an LCD (same atom, one row). The display field is an LCD with `data-big`.

## Decisions from the 13 Nov review
- Depth: level 2 only (outline + one small soft shadow, raised = pressable, pressed/recessed = inset). No gradients, no photographic shadows. Shadows are theme tokens (`--rm-raised`, `--rm-pressed`, `--rm-inset`).
- Night theme: anthracite panels on black, grey caps, no outline, no shadow (tokens set to `none`).
- Outline is a theme token (`--rm-border`) and lighter than in the first mockup (1px, 28% ink, no heavy ring).
- LCD: no ghost digits. A "88.8" ghost only means something if every segment is drawn, and the same field has to show text (climate advice). So: clean monospace, recessed field, small caption.
- Round buttons with a label above (Braun tuner style) stay on the grid: the cell is 2 x 1, the cap shrinks to 38px, the whole cell is the touch target.
- Typeface: Helvetica Neue stack for labels (see below), system monospace for LCD.

## Typeface note
As far as I know, Braun product graphics of the Rams period used Akzidenz-Grotesk, later Helvetica and Univers; the Braun wordmark is a separate drawn logotype (Wolfgang Schmittel, 1950s). The Rams Foundation colours text does not discuss type. Helvetica Neue is on iOS and macOS, so no web font is needed on an iPad; Arial/Inter is the fallback. Not verified against a primary source.

## Preview
`preview/index.html` (open in a browser; no build). Controls: theme (light / night / savee), section width (320-520px), 12-column overlay.

## Open
1. Cluster = one card with slots (assumed) or atoms only
2. Check R3 on the real tablet width
3. Night: dark-tone keys ("all off", "night mode") are low contrast against the plate. Decide whether they need a hairline in night
4. Prototype the Light cluster form editor to test repeatable list fields (scenes, toggles)
