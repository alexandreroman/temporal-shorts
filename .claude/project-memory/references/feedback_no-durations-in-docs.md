---
name: "No video durations in docs"
description: "Docs never state a video's length; make timeline is the source of truth"
type: feedback
---

# No video durations in docs

README.md, CLAUDE.md, `docs/<theme>/script.md` headings and theme
descriptions never state how long a video is (e.g. "2 min 59", "a 3-minute
video", "(2:59)").

**Why:** the length moves with every subtitle edit, so a written duration
goes stale silently.

**How to apply:** describe a theme by its topic and audience only; point to
`make timeline` for the live length. Videos have no maximum length. The
per-subtitle start times in `docs/<theme>/script.md` are a dated
snapshot and stay too.
