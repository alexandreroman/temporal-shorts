---
name: "Arrow heads in Safari"
description: "agent-harness arrows use arrowPath(): explicit head fill, since WebKit ignores context-stroke"
type: project
---

# Arrow heads in Safari

The engine's arrow marker (`src/engine.js`, `svgLayer()` / `path()`) fills
the head with `fill="context-stroke"`. WebKit (Safari) does not render it,
so in the live HTML player the heads do not match the arrow body.

**Why:** viewers open the HTML players in Safari too; Chromium (the render)
shows no difference.

**How to apply:** in the `agent-harness` theme, every arrow is drawn with
`arrowPath(svg, d, color, w, dash = null)` from the theme's `shared.js`. It
adds one marker per SVG layer and color with an explicit `fill`, same
geometry as the engine's, so rendered frames stay pixel-identical. Plain
lines (`arrow = false`) use the engine's `path()`.
