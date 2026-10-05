---
name: "Frame capture noise"
description: "Pixel comparisons show run-to-run noise on row y=65, small specks, and rare layer re-rasters"
type: project
---

# Frame capture noise

Two headless captures of the same sources are not always pixel-identical.
Three kinds of differences are capture noise, not source changes:

- **Progress bar edge:** the anti-aliased edge of the filled `#segs`
  segment (row y=65, x between 1300 and 1841) varies by 1 to 2 levels per
  channel from one run to the next.
- **Specks:** isolated pixels on tile edges and corners vary by 1 to 2
  levels, a few dozen pixels per frame at most. In chapter 7 they sit on
  the step tiles, the memory panel corner (around x 827-835, y 596-605)
  and the LLM bill corner. They vary between pages that render the exact
  same sequence of frames.
- **Rare layer re-raster:** about one page in fifteen draws some moving or
  scaled elements (row slide-ins, step tiles, panel labels) with a
  different sub-pixel raster: deltas up to about 140 on their text, over
  a few hundred to a few thousand pixels, and every later frame of that
  page carries the same difference.

**Why:** Chromium rasterizes fractional-width fills, tile edges and
composited layers (`.abs` sets `will-change`) slightly differently between
runs, even with `--disable-gpu`, and the raster tasks run asynchronously.

**How to apply:** when checking that a change keeps frames identical,
treat row y=65 and specks with a delta of 2 or less as noise. For any
larger difference, capture the same sequence again in a few fresh pages:
a difference that shows up in only one page is a re-raster; a difference
that repeats every time is a real change. A resting element that differs
depending on which frames were rendered before it in the same page is a
real defect: a scaled-down element keeps the raster of an earlier scale,
so resting elements are drawn at their native size.
