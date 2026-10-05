---
name: "Durable Execution theme story"
description: "durable-execution theme: audience, the order #1042 example, server/Worker vocabulary, crash and replay beats"
type: project
---

# Durable Execution theme story

Scope: the `durable-execution` theme (Introduction to Durable Execution).

- Audience: everyone, developers new to Temporal and tech-curious viewers
  alike; no AI context. The only code on screen is the four-line
  `placeOrder` function.
- One running example: online order #1042, $42, four steps, each an
  Activity calling another service: Charge card (`chargeCard`, Payments),
  Reserve item (`reserveItem`, Warehouse), Ship package (`shipPackage`,
  Carrier), Email receipt (`emailReceipt`, Email).
- Vocabulary: the machine running the code is "the server" in chapters 1
  to 3 (before Temporal) and "the Worker" from chapter 5 on (WORKER A,
  WORKER B, "OUTSIDE THE WORKERS"). Temporal terms keep their capitals:
  Workflow, Activity, Worker, Event History.
- Money is the stake, as LLM spend is in `durable-ai-agents`: a CARD
  CHARGED counter shows $84 "CHARGED TWICE!" without Durable Execution and
  stays at $42 ("NOT RE-CHARGED", "CHARGED ONCE") with Temporal.
- Chapter order teaches: steps, failure, plumbing, Durable Execution
  (Workflow, Activities, automatic retries), Event History (saved before
  moving on, outside the Workers), crash and replay, benefits (durable
  timers, visibility).
- Crash and replay: the Worker crashes while `shipPackage` runs, after
  `chargeCard` and `reserveItem` are saved. Worker B replays the code from
  the start; Temporal hands back the two saved results (REUSED, NOT
  RE-CHARGED / NOT RE-RUN), then `shipPackage` runs for real.

**Why:** a single concrete example with a money stake makes the Durable
Execution mechanism easy to follow, and matches how Temporal really
replays Workflow code against recorded Activity results.

**How to apply:** keep the example, the vocabulary split and the crash
point consistent across scenes, subtitles and `docs/durable-execution/
script.md` when editing this theme.
