# Feasibility: panel card with visually editable child pieces (13 Nov 2026)

Question: can a custom `rams-panel` card hold child cards ("lego pieces") that you add, reorder, delete and configure in the HA visual editor, with no YAML?

Result: **yes**, in a real HA instance (2026.2.3, the newest version installable in the sandbox).

## What was tested
- `rams-panel` (container) with `columns: N`; children are ordinary cards placed with `columns` / `rows` spans on that N-column grid. Rows align because all pieces share one grid. Reproduces the Mies 7-wide volume row (1+1+1+1+1+1+1 over 3+1+3).
- Panel editor = a `columns` field plus HA's own `hui-stack-card-editor` embedded. Gives per-child tabs, add (+ with the full card picker), move left/right, copy, cut, delete, and each child's own form (`getConfigForm`).
- Changing a child's `columns` from the form reflows the live preview immediately.

## Caveats
- `hui-stack-card-editor` is an internal HA component. It is loaded by creating a `vertical-stack` card and awaiting `hui-vertical-stack-card`. It can change between HA versions; not tested on newer versions than 2026.2.3.
- The embedded stack editor shows its own "Title" field, which our card ignores. Needs hiding or accepting.
- A child's `columns` / `rows` live in the child's own config (not HA's `grid_options`), so each piece needs those two fields in its form.
- Not tested: nested panels, performance with many pieces, phone widths, tap actions.

## Fallback if the internal editor breaks
Build on HA's native `grid` / `stack` card (native editor, less control over the plate), or keep children YAML-only (rejected: violates the editable-in-UI rule).

Spike code: `spikes/panel-editor-spike.js` (throwaway; not the base for the real code).
