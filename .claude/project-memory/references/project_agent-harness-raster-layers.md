---
name: "Agent Harness: no per-element layers"
description: "agent-harness page sets #stage .abs { will-change: auto } so frames never depend on earlier frames"
type: project
---

# Agent Harness: no per-element layers

The `agent-harness` theme page (`src/themes/agent-harness/index.html`)
overrides the shared `.abs` rule with `#stage .abs { will-change: auto; }`.
Without its own compositing layer, an element is painted fresh every frame,
so a frame looks the same whether a render worker drew it first or after
other frames. With the shared `will-change`, any element that popped in,
swelled or moved could rest with different pixels (thousands of pixels, delta
above 100) depending on the frames rendered before it.

**Why:** the renderer splits the video into segments drawn by parallel
workers that start at arbitrary frames; a layer keeps the raster of earlier
scales and positions, so segments disagree. The override costs no
measurable render time.

**How to apply:** keep the override on this theme's page; scenes need no
per-element `willChange` tweaks. To check a new animation, render a frame
directly in a fresh page and again at the end of a 30 fps sequence that
starts mid-animation: the two must match apart from edge specks (see
[Frame capture noise](project_frame-noise.md)).
