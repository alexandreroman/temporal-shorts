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

**Why:** a coding agent shows the user any moment of a video, and the
exact moment it changed, to check the work in the browser. Paused,
because the link is for inspecting a frame. The reload rule lets a
`make serve` hot reload after an edit keep the viewer where they are. A
fragment, not a query, because `?t=` must keep rendering frames
pixel-identical without player code.

**How to apply:** to show a moment, and after every visual change, use
`http://localhost:<port>/themes/<theme>/#t=<time>` on the `make serve`
port, started if needed, with times from `make timeline THEME=<theme>`;
open it in a browser when one is available. A reload, or the same URL
in an open tab, keeps the current position: change the fragment to jump.
