---
name: "Subtitle layout"
description: "Subtitles are 30 px, max 1760 px wide, single line; no second line under 3 words"
type: feedback
---

# Subtitle layout

Subtitles use 30 px text in a box at most 1760 px wide (aligned with the
80 px header margins). Every subtitle fits on one line. A subtitle never has a second line with fewer than 3 words.

**Why:** orphan words on a second line look sloppy; larger sizes (34 to 38 px
at 1560 px) always leave 3 to 6 orphans.

**How to apply:** after lengthening a subtitle, measure the rendered width of
`#sub` in the page; if it no longer fits, rephrase or re-run a size/width
search rather than accepting an orphan.
