---
name: "Airy layout and consistent details"
description: "Frames use the free band generously; arrowheads match their stroke; uniform tiles; labels sized to the logo"
type: feedback
---

# Airy layout and consistent details

- Compositions use the free band generously (about x 120 to 1800, y 130 to
  920, keeping the header and subtitle clearances): components get room
  to breathe, with generous gaps, rather than a compact cluster in the
  middle of the stage.
- An arrowhead has exactly the color of its stroke in every browser,
  Safari included: its marker carries an explicit `fill`, never
  `context-stroke` (unsupported by WebKit). In `durable-execution`, the
  theme's `arrow()` helper builds such markers.
- In `durable-execution`, tiles of one group share the same border; one
  tile never gets a different border to stand out (the chapter 7 benefit
  tiles look alike).
- A label set next to the Temporal logo is sized to the logo's wordmark,
  never larger than it.

**Why:** the frames are reviewed closely; cramped layouts, mismatched
arrowheads, a lone odd border and an oversized label beside the logo all
read as mistakes.

**How to apply:** after building or moving a scene, check that its
composition spreads across the free band, every arrowhead matches its
stroke, grouped tiles look alike and logo-side labels stay proportionate.
