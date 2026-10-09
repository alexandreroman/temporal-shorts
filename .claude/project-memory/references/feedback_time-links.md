---
name: "Timecode links after every page change"
description: "Every report of a change to a theme or home page gives a make serve link with #t= to each changed moment"
type: feedback
---

# Timecode links after every page change

Every report of a change that alters what a page shows (a scene, a
subtitle, a label, the home page) ends with one link per changed moment:
`http://localhost:<port>/themes/<theme>/#t=<time>` on the `make serve`
port (`CASPER_PORT`, else 8000), started if needed, with the time taken
from `make timeline THEME=<theme>` a second or more inside the changed
subtitle window, or at the exact moment of a transient change. The home
page gets `http://localhost:<port>/`. This holds for changes made by
subagents too: their report carries the times, the final answer the
links.

**Why:** the user checks every visual change in the live player; a
timecode link goes straight to the frame, with no searching through the
video.

**How to apply:** after a commit that changes pixels, list each changed
moment with its link, grouped by theme; a change with no visible effect
(a refactor that keeps frames identical) needs no link, and the report
says so.
