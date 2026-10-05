---
name: "Agent Harness layout grid"
description: "agent-harness scenes fill the content frame x 140-1780, y 150-880, with aligned zones and even gutters"
type: feedback
---

# Agent Harness layout grid

Every scene of the `agent-harness` theme fills the space and aligns its
zones on one grid:

- Content frame: x 140-1780, y 150-880 (stage coordinates, shift
  included). A scene with several zones spans the full width: its outer
  zones touch x 140 and x 1780; its tallest phase uses most of the height.
- Zones share edges: tops aligned, bottoms aligned, column headings on one
  baseline; the elements of a column share a left edge or a center line.
- Gutters: 40 px between related components, 80 to 120 px between zones,
  the same gutter for the same relation within a scene.
- Repeated items (tiles, rows, steps) share one size and even spacing.
- Elements sit at their final positions; zones stay in place between phases
  where the story allows.
- Chapter 2 ("Survives crashes") is the model: step row and panels aligned
  on x 140 and x 1780, panel bottoms aligned.

**Why:** small compositions floating in the middle of the frame, zones
placed independently and labels crowded against their components read as
unfinished.

**How to apply:** lay out new or edited scenes on this grid, then measure
the content box of each phase (x and y extents) and check alignments on
full-size frames.
