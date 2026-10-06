---
name: "Scene centering"
description: "Compositions centered at (960, 522) with a measured shift; durable-ai-agents pans only in chapters 1, 5, 7"
type: project
---

# Scene centering

Scope: every theme; chapter numbers below refer to `durable-ai-agents`
(the `agent-harness` pans are in
[its own note](project_agent-harness-video.md)).

Each scene's composition is centered at (960, 522), within about 25 px: the
middle of the free band between the chapter header (bottom near y=84) and the
subtitle box (top near y=960). Intro and outro use the same target.

- The scene field `shift` (`[dx, dy]` or `(t, c) => [dx, dy]`) translates the
  scene root. A fixed `[dx, dy]` is the default: elements stay still within
  the scene.
- A fixed-shift scene whose layout changes between phases uses one
  whole-number compromise between the centered offsets of its phases, so each
  phase stays within about 25 px of center (chapter 3: `[-113, 42]`, chapter
  4: `[25, 38]`).
- Chapters 1, 5 and 7 ease between phase offsets with
  `pan(t, from, stops, d)` from `src/engine.js`, keyed to `c[i]` and placed
  where content already fades or moves.
- Offsets are measured from the rendered content box, not guessed.
- Brief one-off elements do not drive the offset.
- Clearance above the subtitle box beats exact centering: chapter 7's panel
  phase sits at y 516 (shift 32) so AGENT COMPLETE keeps about 30 px above
  the subtitles.
- Resting offsets are whole numbers, so resting elements stay
  pixel-aligned; fractional offsets exist only mid-pan.
- Full-screen flashes are oversized (2400x1400, `makeFlash`) so they cover
  the stage under any shift.

**Why:** element coordinates are laid out on the full 1080 px stage, so
without a shift a composition sits high and off-center in the free band; a
composition that slides while its elements stay on screen reads as a glitch
(the chapter 3 window seems to narrow, the chapter 4 tools drift up).

**How to apply:** after moving or adding elements in a scene, re-measure the
content box of each phase and pick one shift that keeps every phase within
about 25 px of center; reach for `pan()` only where content already moves.
Check frames with `make preview`.
