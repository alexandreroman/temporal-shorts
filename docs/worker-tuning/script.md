# Script and timeline: Tuning Temporal Workers

Subtitles are the only narration (no audio). Each subtitle lasts as long
as its text needs (`autoDur` in `src/engine.js`), plus its `after` pause.
Run `make timeline THEME=worker-tuning` for the live values; the start
times below are a snapshot from 2026-10-15.

Each entry gives the subtitle start time and its exact text, then what the
animation shows.

## Audience and goal

The video is a guide for developers and SREs who already run Temporal
Workers: they know what a Workflow and an Activity are, and they watch a
Task Queue back up under load. It teaches how a Worker takes work and how
to tell apart the four causes of one symptom, a growing backlog.

It is inspired by the Temporal Worker Tuning Simulator
(https://github.com/cvilenio/temporal-worker-tuning-simulator), a teaching
simulator of Pollers, Slots, the Workflow cache and Worker resources. The
video takes its concepts only: its visuals are drawn with the series'
components, and no code, image or color comes from the simulator, which
carries no license.

The video teaches, in order:

1. a growing backlog is a symptom: find what is full before adding
   Workers;
2. how a Worker takes work: Workflow Tasks and Activity Tasks wait in two
   separate queues; a Poller asks for a task only while a Slot is free; a
   Slot is the permission to run one task, which then uses the Worker's
   CPU and memory; the Workflow cache keeps Workflows in memory so their
   next task skips a replay;
3. full Slots with a low CPU: raise the Slot limit;
4. free Slots, a long schedule-to-start and a low CPU: the Pollers fetch
   too slowly; turn on Poller Autoscaling;
5. a cache too small: evictions force replays of the Event History, which
   burn CPU and hold Slots; give the Worker more memory and a larger cache;
6. a full CPU: more Slots add no CPU; only then add Workers;
7. change one setting at a time, then look for the next bottleneck: fixing
   one limit moves the constraint somewhere else.

Each bottleneck chapter follows one grammar: the symptom (the queue
grows), what is full (a red outline and a BOTTLENECK tag on the
component), the setting (a line of `Worker.create` changes in the code
card), the relief (a neon tag, the backlog falls) and the next bottleneck
already showing, which leads into the next chapter.

The running example is the shop of the `durable-execution` video on Black
Friday: orders arrive ten times faster than usual, and each order is a
Workflow of five Activities, `chargeCard`, `reserveItem`, `renderInvoice`
(a CPU-heavy PDF), `shipPackage` and `emailReceipt`. One set of figures
runs through the video: 10 Activity Slots, raised to 50; a Workflow cache
of 500 raised to 2000 with the memory going from 2 GB to 4 GB; Worker A,
then Workers B and C.

### Sources

Every setting, default and metric comes from the Temporal documentation
and the TypeScript SDK (v1.24.0):

- `WorkerOptions` (`packages/worker/src/worker-options.ts` in
  temporalio/sdk-typescript): `maxConcurrentActivityTaskExecutions`
  (default 100 without a tuner), `activityTaskPollerBehavior`
  (`{ type: 'autoscaling' }`), `maxCachedWorkflows` (default computed from
  the heap size).
- https://docs.temporal.io/develop/worker-performance (configuration,
  metrics, task-queues, workflow-cache): "Temporal recommends using Poller
  Autoscaling for the majority of use cases"; more slots when the hosts
  are underutilized and `worker_task_slots_available` is depleted; more
  pollers when slots are available and `schedule_to_start` is long; "If
  currently provisioned Worker hosts are fully utilized ..., additional
  Workers hosts have to be provisioned"; a high rate of forced evictions
  means the cache is too small, to increase "if your Worker resources can
  accommodate it".
- https://docs.temporal.io/references/sdk-metrics:
  `temporal_worker_task_slots_available`,
  `temporal_activity_schedule_to_start_latency`,
  `temporal_sticky_cache_total_forced_eviction`,
  `temporal_workflow_task_replay_latency`.
- https://docs.temporal.io/cli/command-reference/task-queue#describe:
  `ApproximateBacklogCount`.

Out of scope: resource-based tuners (the docs recommend fixed-size slot
suppliers for most workloads), rate limits and Task Queue partitions.

## Intro

- **0:01** Your Task Queue is backing up and orders are waiting. Which
  Worker setting do you change?
  - Visuals: Temporal logo, kicker "A GUIDE FOR DEVELOPERS AND SRES",
    title "Why is my Task Queue backing up?", tagline "TUNE TEMPORAL
    WORKERS, ONE BOTTLENECK AT A TIME"; on the right a queue of task
    chips flows into a small WORKER panel whose Slots are all busy, and
    the queue keeps growing.

## 01 The backlog grows

- **0:00** Black Friday: the shop gets ten times more orders than usual,
  and every order is a Temporal Workflow.
  - Visuals: an orders counter speeds up ("ORDERS / MIN" x10); order
    chips stream into the "orders" Task Queue.
- **0:00** Tasks pile up in the Task Queue: the backlog
  grows, and each order waits longer to start.
  - Visuals: the queue lengthens; the BACKLOG counter
    (`ApproximateBacklogCount`) climbs in red; a SCHEDULE-TO-START readout
    rises.
- **0:00** The first reflex is to add more Workers. Before that, find out
  what is actually full.
  - Visuals: a dashed "+ WORKER" ghost appears, crossed out; a magnifier
    tag "WHAT IS FULL?" over the Worker.

## 02 How a Worker takes work

- **0:00** Workflow Tasks and Activity Tasks wait in two separate queues,
  even under one Task Queue name.
  - Visuals: the TEMPORAL panel splits the "orders" Task Queue into two
    lanes, WORKFLOW TASKS (UV chips) and ACTIVITY TASKS (chips with step
    icons).
- **0:00** A Poller in the Worker asks a queue for a task, but only
  while a Slot is free.
  - Visuals: the WORKER A panel draws in; Pollers sit at the end of each
    lane, a dashed poll line pulsing toward the queue; a task jumps from
    the queue through a Poller into a free Slot.
- **0:00** A Slot is the permission to run one task. The task itself uses
  the Worker's CPU and memory.
  - Visuals: the Slot grid lights; CPU and MEMORY meters under the Worker
    rise as Slots fill.
- **0:00** The Workflow cache keeps Workflows in memory, so their
  next task skips replaying the history.
  - Visuals: the WORKFLOW CACHE strip fills with order cells (#1042,
    #1043, ...); a Workflow Task hits a cached cell, which flashes.

## 03 Every Slot is busy

- **0:00** The Worker was set for normal days: 10 Activity Slots. All 10
  are busy, and the CPU sits at 35%.
  - Visuals: the code card shows `maxConcurrentActivityTaskExecutions:
    10`; the 10 Activity Slots are violet; CPU 35%.
- **0:00** Tasks wait for a Slot, not for the machine: the Slots
  available metric stays at zero.
  - Visuals: the Slot grid gets a red outline and a BOTTLENECK tag; a
    readout `worker_task_slots_available` shows 0.
- **0:00** Raise the limit from 10 to 50 Slots, and five times more tasks
  run at once.
  - Visuals: the code line lights up, 10 becomes 50; the grid grows to 50
    Slots, which fill; the tag turns neon (FIXED); the backlog falls.
- **0:00** Throughput climbs, yet the backlog grows again. Something else
  is the limit now.
  - Visuals: Slots start to empty while the queue lengthens again.

## 04 The Pollers can't keep up

- **0:00** Now Slots sit free while the queue still grows, and the CPU has
  room to spare.
  - Visuals: half the Slots empty; CPU 45%; the queue grows.
- **0:00** Tasks wait a long time before they start: the Pollers can't
  fetch them fast enough.
  - Visuals: the Pollers get the red outline and BOTTLENECK tag; the
    `activity_schedule_to_start_latency` readout is high.
- **0:00** Turn on Poller Autoscaling: the Worker adds Pollers when
  tasks wait and removes them when idle.
  - Visuals: the code card gains `activityTaskPollerBehavior: { type:
    'autoscaling' }`; more Pollers appear; tasks stream into the free
    Slots; the tag turns neon.
- **0:00** Tasks reach the free Slots again, and the CPU starts to climb.
  - Visuals: the Slots fill; the CPU meter rises to 80%.

## 05 The cache runs out

- **0:00** More orders are open at once than the Workflow cache can hold.
  - Visuals: open orders press on the full WORKFLOW CACHE strip; MEMORY
    near full.
- **0:00** The cache evicts Workflows. An evicted Workflow replays its
  whole Event History on its next task.
  - Visuals: a cell slides out in red (EVICTED); its next Workflow Task
    takes a Slot that turns dashed with the retry icon (REPLAY).
- **0:00** Replays burn CPU and hold Slots without moving any order
  forward.
  - Visuals: the cache gets the red outline and BOTTLENECK tag; readouts
    `sticky_cache_total_forced_eviction` and
    `workflow_task_replay_latency` climb; the CPU meter jumps.
- **0:00** Give the Worker more memory and a larger cache: open orders
  stay cached, and replays stop.
  - Visuals: MEMORY 2 GB becomes 4 GB; the code line
    `maxCachedWorkflows: 500` becomes 2000; the strip widens; the tag
    turns neon.

## 06 The CPU is full

- **0:00** Now renderInvoice keeps the CPU at 100%: every task slows down
  and holds its Slot longer.
  - Visuals: invoice chips fill the Slots; the CPU meter pins at 100% in
    red with the BOTTLENECK tag; some Slots stay free.
- **0:00** More Slots would not help: a Slot adds no CPU. This Worker has
  reached the limit of its machine.
  - Visuals: a dashed "+ SLOTS" ghost, crossed out.
- **0:00** This is the moment to add Workers: B and C poll the same Task
  Queue and share the load.
  - Visuals: WORKER B and WORKER C slide in beside WORKER A, their Pollers
    reaching the same lanes; the CPU meters settle around 60%.
- **0:00** The backlog drains, and new orders start right away again.
  - Visuals: the queue empties; BACKLOG falls to 0 in neon.

## 07 Read the signals

- **0:00** A growing backlog has four causes: full Slots, slow Pollers, a
  small cache or a full CPU.
  - Visuals: a table of four rows, SYMPTOM / SIGNAL / FIX: Slots full, CPU
    low / `worker_task_slots_available` at 0 / more Slots; Slots free,
    long wait / `activity_schedule_to_start_latency` / Poller Autoscaling;
    evictions, replays / `sticky_cache_total_forced_eviction` / more
    memory, larger cache; CPU at 100% / CPU usage / more Workers; each row
    lights as it is named.
- **0:00** Change one setting at a time, watch the signals, then look for
  the next bottleneck.
  - Visuals: a loop CHANGE ONE SETTING → WATCH → NEXT BOTTLENECK under
    the table.

## Outro

- **0:00** Tune one bottleneck at a time, and your Temporal Workers keep
  up when traffic spikes.
  - Visuals: a small Worker panel with its Slots, title "Tuning Temporal
    Workers", tagline "FIND WHAT IS FULL, FIX IT, LOOK AGAIN", Temporal
    logo.
