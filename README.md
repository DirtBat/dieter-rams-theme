# dieter-rams

A Braun / Dieter Rams-inspired design language for a Home Assistant wall dashboard, built from scratch.
Status: scaffolding phase. Grid, atoms, clusters, tokens and two themes exist as plain CSS and a static preview. No Home Assistant integration yet.

```
src/tokens.css        grid constants, type
src/themes/           light, night, savee (alternative): role-based colour and elevation tokens
src/atoms.css         key, round, tile, lcd, artwork, dial
src/clusters.css      subgrid tray
preview/index.html    open in a browser, no build
docs/spec.md          rules, atoms, decisions
docs/palette.md       sources compared and the palette decision
tools/shot.py         screenshots via Playwright
```
