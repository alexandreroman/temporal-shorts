# Fonts

Temporal's brand typefaces are Aeonik (display/body) and Noto Sans Mono (labels).
Aeonik is proprietary and was not available, so the video uses stand-ins:

| Role in CSS | Stand-in | Weights |
|---|---|---|
| `Brand` (titles, subtitles, body) | Instrument Sans | 400, 700 |
| `Mono` (labels, message cards, event history) | JetBrains Mono | 400, 700 |

`scripts/setup.sh` downloads the Fontsource woff2 files into this folder.
The original render used the static TTFs `InstrumentSans-Regular.ttf`, `InstrumentSans-Bold.ttf`,
`JetBrainsMono-Regular.ttf`, `JetBrainsMono-Bold.ttf`. If you drop those here they take priority
(see the `@font-face` rules in `src/index.html`). The result is visually the same.

If you get the real Aeonik files, add them here and point the `Brand` @font-face at them;
check titles afterwards with `make preview`, since metrics differ and some lines may re-wrap.
