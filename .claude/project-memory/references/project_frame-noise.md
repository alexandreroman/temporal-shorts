---
name: "Frame capture noise in the progress bar"
description: "Pixel comparisons show run-to-run noise on row y=65 (the #segs bar edge)"
type: project
---

# Frame capture noise in the progress bar

Two headless captures of the same sources are not always pixel-identical:
the anti-aliased edge of the filled `#segs` progress segment (row y=65,
x between 1300 and 1841) varies by 1 to 2 levels per channel from one run
to the next. Every other pixel is stable.

**Why:** Chromium rasterizes that fractional-width gradient fill slightly
differently between runs, even with `--disable-gpu`.

**How to apply:** when checking that a refactor keeps frames identical,
treat differences confined to row y=65 with a delta of 2 or less as noise;
any other difference is a real change.
