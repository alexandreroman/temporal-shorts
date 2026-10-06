---
name: "Arrow heads in Safari"
description: "engine path() fills each arrow head with its line color: one marker per SVG layer and color"
type: project
---

# Arrow heads in Safari

The engine's `path()` (`src/engine.js`) gives each arrow head an explicit
fill equal to its line color, through `arrowHead(svg, color)`: one marker
per SVG layer and color, created on first use in that layer's `<defs>`,
cached on the layer, with document-unique ids. Every theme draws arrows
with `path()`.

**Why:** WebKit (Safari) does not render `fill="context-stroke"`, so heads
filled that way come out black in the live HTML player opened in Safari,
while Chromium (the render) shows them right.

**How to apply:** draw arrows with `path(svg, d, color, w)`; never fill a
marker with `context-stroke`. A change to arrow heads is checked in both
Chromium frames and WebKit (Playwright's WebKit).
