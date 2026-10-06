---
name: "Frame capture noise"
description: "Pixel comparisons show tiny run-to-run specks and small render-order differences on anti-aliased curves"
type: project
---

# Frame capture noise

Two headless captures of the same sources are not always pixel-identical.
Two kinds of differences are capture noise, not source changes:

- **Specks:** isolated pixels on tile edges and corners vary by 1 to 2
  levels (rarely up to 6), a few pixels per frame at most.
- **Render order:** a frame rendered in a fresh page and the same frame
  reached after other frames can differ on anti-aliased curves and
  rotations (SVG arcs and connectors, rounded corners, the orb's eyes and
  edge, clock and dial hands): a few dozen pixels, delta up to about 60.
  Chromium re-rasterizes only the changed area, and edges that cannot sit
  on whole pixels come out slightly differently.

**Why:** the renderer splits a video into segments drawn by parallel
workers that start at arbitrary frames, so a frame must look the same
whichever frames came before it. Elements carry no per-element
compositing layer (`.abs` sets no `will-change`), and resting elements sit
on whole pixels (pill line heights in px, status tags rounded to even
widths, whole-number shifts), which keeps the remaining differences to
these curves.

**How to apply:** when checking that a change keeps frames identical, treat
specks with a delta of 2 or less as noise, and capture the same sequence
of times before and after. To check render-order independence, render
sample frames in fresh pages and compare them with a sequential capture:
anything beyond the curves above (a straight edge, a text block, a tag
shifted by a pixel) is a half-pixel geometry to fix.
