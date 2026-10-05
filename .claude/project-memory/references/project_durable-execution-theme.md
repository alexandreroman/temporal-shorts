---
name: "Durable Execution theme story"
description: "durable-execution: order #1042, server then Worker, money stake, crash point, idempotency, rasters"
type: project
---

# Durable Execution theme story

Scope: the `durable-execution` theme (Introduction to Durable Execution).
The script and its example table live in `docs/durable-execution/script.md`.

- One running example: online order #1042, $42, four Activities, each
  calling another service (`chargeCard`, `reserveItem`, `shipPackage`,
  `emailReceipt`).
- Vocabulary: the machine running the code is "the server" in chapters 1
  to 3 (before Temporal) and "the Worker" from chapter 5 on, subtitles
  included (WORKER A, WORKER B, "OUTSIDE THE WORKERS").
- Money is the stake: a CARD CHARGED counter reads $84 "CHARGED TWICE!"
  without Durable Execution and stays at $42 ("NOT RE-CHARGED", "CHARGED
  ONCE") with Temporal.
- Crash point: the Worker crashes while `shipPackage` runs, after
  `chargeCard` and `reserveItem` are saved; Worker B replays from the start,
  Temporal hands back the two saved results, then `shipPackage` runs for
  real.
- Accuracy: Temporal runs Activities at least once and they still need to
  be idempotent, so the video never presents idempotency keys as plumbing
  Temporal removes (the chapter 3 tiles are retry loops, status table,
  message queue, timers, cleanup jobs, recovery scripts).
- Rasters: a `will-change` layer keeps the raster of the first frame drawn
  after its content changes or it appears. In this theme, tags, counters
  and pills change text at scale 1 on whole-pixel offsets, and their pops
  start 0.1 s after the change (`bumpAt` in the theme's `shared.js`).
  Render-order checks screenshot every stepped frame, as the renderer does.

**Why:** a single concrete example with a money stake makes the mechanism
easy to follow and matches how Temporal replays Workflow code against
recorded Activity results; the idempotency rule keeps the claims true.

**How to apply:** keep the example, the vocabulary split, the crash point,
the idempotency rule and the raster rule consistent across scenes,
subtitles and the script when editing this theme.
