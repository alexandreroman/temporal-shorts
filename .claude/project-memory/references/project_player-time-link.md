---
name: "Player time links"
description: "#t=<time> opens a theme's live player paused there; ?t= is frame capture only"
type: project
---

# Player time links

A `#t=<time>` URL fragment (seconds or `m:ss`) opens a theme's live
player paused at that time; editing it in an open tab seeks there,
paused. A reload keeps the sessionStorage position over the fragment.
`?t=` is reserved for the frozen frame-capture mode.

**Why:** a coding agent hands the user a link to the exact moment it
changed, to check the work in the browser. Paused, because the link is
for inspecting a frame. The reload rule lets a `make serve` hot reload
after an edit keep the viewer where they are. A fragment, not a query,
because `?t=` must keep rendering frames pixel-identical without player
code.

**How to apply:** after a visual change, give
`http://localhost:${CASPER_PORT:-8000}/themes/<theme>/#t=<seconds>`,
with times from `make timeline THEME=<theme>`.
