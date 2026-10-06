# Fonts

Temporal's brand typefaces are Aeonik (display/body) and Noto Sans Mono
(labels). Noto Sans Mono is open source and used as is. Aeonik is
proprietary and was not available, so Instrument Sans stands in for it:

| Role in CSS                                   | Font                         | Weights  |
| --------------------------------------------- | ---------------------------- | -------- |
| `Brand` (titles, subtitles, body)             | Instrument Sans (stand-in)   | 400, 700 |
| `Mono` (labels, message cards, event history) | Noto Sans Mono (brand)       | 400, 700 |

`scripts/setup.sh` downloads the Fontsource woff2 files into this folder, at
a pinned package version; the `@font-face` rules in `src/styles.css` load
them.

If you get the real Aeonik files, add them here and point the `Brand`
`@font-face` at them; check titles afterwards with `make preview`, since
metrics differ and some lines may re-wrap.
