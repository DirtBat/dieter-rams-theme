# Palette

Layer 2 (skin) uses roles only (see `src/themes/*.css`). Cards never contain a hex value.

## Sources compared
| Source | What it is | Character |
|---|---|---|
| Four "Dieter Rams" poster palettes (color-hex, from the posters) | Grey-blue / umber / near-black / red; ochre / tan / umber / grey; rust / orange / slate / sand; orange / red / olive / stone | Historically close, but they do not mix freely: five sets of five, each with its own neutrals |
| savee adapted palette | #B87333 copper, #7D8B3F olive, #E3D6C2 cream, #FF6037 orange, #C0392B red, #5F9EA0 teal | Warmer and more saturated; modern. Teal is not Braun |
| Rams Foundation text (rams-foundation.org, colours) | Words only, no hex values. Mostly grey, white, black, metal. Function colours on audio: FM "blood orange", phono "honey yellow", power "leaf green". Yellow second hand (clocks), yellow result key (ET22 calculator). Strong colours only on small items | The rule behind the palette: restraint, few colours, colour = function |

Note: only the poster set with ED8008 / ED3F1C / BF1B1B / 736B1E / D9D2C6 could be fetched from color-hex during this session; the other three were taken from the poster images supplied earlier.

## Decision (v0.1)
Neutrals from the posters (housing #D9DBCC sampled from the poster background, plate #C8C5B9, cap #D9D2C6, ink #261201, muted #736356). Colour only as function, following the Foundation text:

| Role | Colour | Meaning |
|---|---|---|
| active | #ED8008 | on, selected, current value pointer, primary action ("blood orange") |
| on | #736B1E | healthy, power ("leaf green" stand-in) |
| alert | #AD1D1D | arm away, error |
| honey | #BF7C2A | secondary pointer: target value, second hand |
| cool / warm | #AAB7BF / #CC6324 | cooling / heating states |

## Night
Black housing, anthracite plate (#232325), grey caps (#46474B), no outline, no shadow. Orange and red stay as they are, because they carry meaning.

## Alternative
`src/themes/savee.css` holds the savee palette mapped to the same roles. Switch it in the preview to compare. Not chosen.
