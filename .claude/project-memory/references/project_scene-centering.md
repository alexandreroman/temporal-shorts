---
name: "Scene centering"
description: "Every scene composition is centered at (960, 522) with its measured shift field"
type: project
---

# Scene centering

Each scene's composition is centered at (960, 522), within about 15 px: the
middle of the free band between the chapter header (bottom near y=84) and the
subtitle box (top near y=960). Intro and outro use the same target.

- The scene field `shift` (`[dx, dy]` or `(t, c) => [dx, dy]`) translates the
  scene root; `pan(t, from, stops, d)` in `src/engine.js` eases between
  offsets for scenes whose layout changes between phases.
- Offsets are measured from the rendered content box, not guessed.
- Pans are keyed to `c[i]` and placed where content already fades or moves;
  differences under about 25 px use a single offset.
- Build-ups keep the offset of the completed composition; brief one-off
  elements do not drive the offset.
- Full-screen flashes are oversized (2400x1400) so they cover the stage under
  any shift.

**Why:** element coordinates are laid out on the full 1080 px stage, so
without a shift a composition sits high and off-center in the free band.

**How to apply:** after moving or adding elements in a scene, re-measure its
content box and update its `shift`; check frames with `make preview`.
