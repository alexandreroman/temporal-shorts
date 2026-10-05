---
name: "Visual design decisions"
description: "Layout, alignment and Event History choices for the video frames"
type: feedback
---

# Visual design decisions

- Icon + label tiles are centered horizontally and vertically (`iconTile`,
  centered flex), never positioned with fixed margins.
- Centered letter-spaced labels get a `padding-left` equal to their
  `letter-spacing`, so the trailing spacing does not shift them left.
- Temperatures are written without a space: "18°C".
- Blocks in a row inside a panel (chapter 6 APP MEMORY) are spread evenly:
  the side margins equal the gaps between blocks.
- Tags and labels keep about 20 px of clear space from neighboring
  components (the chapter 3 FULL tag above the size gauge).
- The end card shows the slogan and the Temporal logo, without a URL. The
  mascot sits above the title with the same gap as the slogan to the logo
  (about 86 px).
- "Agent complete" in chapter 7 has clear space above it, below the Event
  History.
- Chapter 7 mirrors chapter 6: same step tiles, APP MEMORY panel and
  LLM CALLS BILLED counter, with a TEMPORAL panel (official logo header,
  "OUTSIDE THE APP") holding the Event History. Each row gets a SAVED tag
  when written; an "APP CRASHED HERE" line and a tinted block mark the rows
  that survive the crash; replayed rows turn REUSED, then "REUSED, NOT
  RE-BILLED" (LLM calls) or "REUSED, NOT RE-RUN" (tool results).

**Why:** frames are reviewed closely; misaligned icons and unclear durability
undermine the explainer.

**How to apply:** check alignment on full-size `make preview T="<t> --full"`
frames
for every new tile or label.
