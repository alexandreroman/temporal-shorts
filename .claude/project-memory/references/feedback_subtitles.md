---
name: "Subtitle layout"
description: "Subtitles are 30 px text, at most 1760 px wide, on one line"
type: feedback
---

# Subtitle layout

Subtitles use 30 px text in a box at most 1760 px wide (aligned with the
80 px header margins). Every subtitle fits on one line.

**Why:** a wrapped subtitle leaves orphan words on a second line, which
look sloppy.

**How to apply:** after lengthening a subtitle, measure the rendered width
of `#sub` in the page; if it no longer fits on one line, rephrase it.
