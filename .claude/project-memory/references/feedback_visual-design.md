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
- The end card shows the slogan and the Temporal logo, without a URL.
- "Agent complete" in chapter 7 has clear space above it, below the Event
  History.
- The chapter 7 Event History shows what is persisted and what is not re-run:
  each row gets a SAVED tag when written; an "APP CRASHED HERE" line and a
  tinted block mark the rows that survive the crash; replayed rows turn
  REUSED, then "REUSED, NOT RE-BILLED" (LLM calls) or "REUSED, NOT RE-RUN"
  (tool results).

**Why:** frames are reviewed closely; misaligned icons and unclear durability
undermine the explainer.

**How to apply:** check alignment on full-size `make preview --full` frames
for every new tile or label.
