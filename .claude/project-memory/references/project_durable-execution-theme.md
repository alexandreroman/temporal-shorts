---
name: "Durable Execution theme story"
description: "durable-execution: order #1042, server then Worker, money stake, crash point and replay order, idempotency"
type: project
---

# Durable Execution theme story

Scope: the `durable-execution` theme (Introduction to Durable Execution).
The example, the vocabulary split (the server, then the Worker) and the
on-screen code live in `docs/durable-execution/script.md` (Audience and
story).

- Money is the stake: a CARD CHARGED counter reads $84 "CHARGED TWICE!"
  without Durable Execution and stays at $42 ("NOT RE-CHARGED", "CHARGED
  ONCE") with Temporal.
- Crash point: Worker A crashes while `shipPackage` runs, after
  `chargeCard` and `reserveItem` are saved. Temporal retries `shipPackage`
  on Worker B (it detects the loss through the Activity's Start-To-Close
  timeout, 10 seconds in the code); once that attempt completes, Worker B
  runs the Workflow from the start, Temporal hands back the three saved
  results, then `emailReceipt` runs.
- Code on screen is real Temporal TypeScript SDK code.
- Accuracy: Temporal runs Activities at least once and they still need to
  be idempotent, so the video never presents idempotency keys as plumbing
  Temporal removes (the chapter 3 tiles are retry loops, status table,
  message queue, timers, cleanup jobs, recovery scripts).

**Why:** a single concrete example with a money stake makes the mechanism
easy to follow; the crash point, replay order and idempotency rule match
how Temporal retries Activities and replays Workflow code against recorded
results.

**How to apply:** keep the example, the vocabulary split, the crash point
and replay order, the real-code rule and the idempotency rule consistent
across scenes, subtitles and the script when editing this theme.
