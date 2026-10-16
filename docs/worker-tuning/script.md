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
to tell apart the four common causes of one symptom, a growing backlog.

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

Scenes never fade into each other: each one opens on the previous one's
last frame (a hard cut), and when the content changes, from the diagram
to the recap table and from the table to the end card, components travel
into what comes next. Only the video's opening and closing fade.

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

Poller and Workflow Slot counts are schematic: the diagram draws 2
Workflow Pollers, 2 Workflow Slots, and 2 Activity Pollers growing to 5
with autoscaling, where the TypeScript defaults are higher (pollers
`min(10, slots)`, 40 Workflow Slots; autoscaling starts at 5 and goes up
to 100). Activity Slot counts and the cache size are the Worker's
explicit settings in the story.

Out of scope: resource-based tuners (the docs recommend fixed-size slot
suppliers for most workloads), rate limits and Task Queue partitions.

## Intro

- **0:02** Your Task Queue is backing up and orders are waiting. Which
  Worker setting do you change?
  - Visuals: Temporal logo, kicker "A GUIDE FOR DEVELOPERS AND SRES",
    title "Why is my Task Queue backing up?", tagline "TUNE TEMPORAL
    WORKERS, ONE BOTTLENECK AT A TIME"; on the right a strip of task
    chips flows into a small WORKER whose 10 Slots (2 x 5) are all busy,
    and the queue keeps growing; the title fades out while the queue and
    the Worker play on, and chapter 1 starts on the same frame.

## 01 The backlog grows

- **0:12** Black Friday: the shop gets ten times more orders than usual,
  and every order is a Temporal Workflow.
  - Visuals: an orders counter speeds up ("ORDERS / MIN" x10); order
    chips stream into the "orders" Task Queue. The intro's strip glides
    into the TEMPORAL panel as the "orders" lane, and its Worker grows
    into WORKER A, its 10 Activity Slots (2 x 5) centered under ACTIVITY
    SLOTS, all busy: each task waits in the queue until a Slot frees up,
    then lands in it.
- **0:20** Tasks pile up in the Task Queue: the backlog
  grows, and each order waits longer to start.
  - Visuals: the queue lengthens; the BACKLOG counter
    (`ApproximateBacklogCount`) climbs in red; a SCHEDULE-TO-START readout
    rises.
- **0:29** The first reflex is to add more Workers. Before that, find out
  what is actually full.
  - Visuals: a dashed "+ WORKER" ghost appears, crossed out; a magnifier
    tag "WHAT IS FULL?" lands in WORKER A as the Slots move down beneath
    it; then the ghost, ORDERS / MIN and the tag fade, and chapter 2
    starts on the same frame.

## 02 How a Worker takes work

- **0:40** Workflow Tasks and Activity Tasks wait in two separate queues,
  even under one Task Queue name.
  - Visuals: the Worker opens up: its Slots move into one row beside the
    Activity lane as the TEMPORAL panel splits the "orders" Task Queue
    into two lanes, WORKFLOW TASKS (UV chips) and ACTIVITY TASKS (chips
    with step icons).
- **0:49** A Poller in the Worker asks a queue for a task, but only
  while a Slot is free.
  - Visuals: the WORKER A panel fills in; Pollers hang off each lane on
    right-angle connectors whose dashes flow from the queue to the
    Pollers; a task travels along the connector, through a Poller, into a
    free Slot.
- **0:56** A Slot is the permission to run one task. The task itself uses
  the Worker's CPU and memory.
  - Visuals: the Slot grid lights; CPU and MEMORY meters under the Worker
    rise as Slots fill.
- **1:05** The Workflow cache keeps Workflows in memory, so their
  next task skips replaying the history.
  - Visuals: the WORKFLOW CACHE strip fills with order cells (#1042,
    #1043, ...); a Workflow Task hits a cached cell, which flashes.

## 03 Every Slot is busy

- **1:17** The Worker is set for normal days: 10 Activity Slots. All 10
  are busy, and the CPU sits at 35%.
  - Visuals: the chapter opens on chapter 2's last frame (a hard cut). The
    code card shows `maxConcurrentActivityTaskExecutions: 10` and
    `maxCachedWorkflows: 500`, the settings for normal days; the 10 Activity
    Slots are violet; CPU 35%.
- **1:25** Tasks wait for a Slot, not for the machine: the Slots
  available metric stays at zero.
  - Visuals: the Slot grid gets a red outline and a BOTTLENECK tag; the
    metric line `temporal_worker_task_slots_available` reads 0.
- **1:33** Raise the limit from 10 to 50 Slots, and five times more tasks
  run at once.
  - Visuals: the code line lights up, 10 becomes 50; the grid grows to 50
    Slots, which fill to 45 (the metric line reads 5); the tag turns neon
    (FIXED); the backlog falls.
- **1:42** Throughput climbs, yet the backlog grows again. Something else
  is the limit now.
  - Visuals: the Slots drain from 45 to 25 as tasks trickle in, one
    every 1.6 s, while the queue lengthens again.

## 04 The Pollers can't keep up

- **1:53** Now Slots sit free while the queue still grows, and the CPU has
  room to spare.
  - Visuals: the chapter opens on chapter 3's last frame (a hard cut). Half
    the Slots empty, the poll lines flowing; CPU 45%; the queue grows.
- **2:01** Tasks wait a long time before they start: the Pollers can't
  fetch them fast enough.
  - Visuals: the Pollers get the red outline and BOTTLENECK tag; a
    second metric line, `temporal_activity_schedule_to_start_latency`,
    reads 44 s.
- **2:09** Turn on Poller Autoscaling: the Worker adds Pollers when
  tasks wait and removes them when idle.
  - Visuals: the code card gains `activityTaskPollerBehavior: { type:
    'autoscaling' }`; the Activity Pollers grow from 2 to 5; tasks stream
    into the free Slots; the tag turns neon.
- **2:16** Tasks reach the free Slots again, and the CPU starts to climb.
  - Visuals: the Slots fill to 44; the CPU meter rises to 80%; the backlog and
    SCHEDULE-TO-START fall (3.0 s). Before the cut, the metric lines sink out.

## 05 The cache runs out

- **2:27** More orders are open at once than the Workflow cache can hold.
  - Visuals: the chapter opens on chapter 4's last frame (a hard cut). Open
    orders wait as dashed cells (#1046, #1047, ...) beside the full WORKFLOW
    CACHE strip, with a "+N" count; MEMORY turns red.
- **2:33** The cache evicts Workflows. An evicted Workflow replays its
  whole Event History on its next task.
  - Visuals: a cell slides out in red (EVICTED) and hands its place to a
    waiting order; the evicted order's next Workflow Task takes a Workflow
    Slot, which turns dashed with a turning retry icon; the status reads
    REPLAYING; four evictions in all.
- **2:42** Replays burn CPU and hold Slots without moving any order
  forward.
  - Visuals: the cache gets the red outline and BOTTLENECK tag; the
    metric lines `temporal_sticky_cache_total_forced_eviction` (46/s) and
    `temporal_workflow_task_replay_latency` (892 ms) climb; the CPU meter
    jumps to 96%; the Workflow lane lengthens.
- **2:49** Give the Worker more memory and a larger cache: open orders
  stay cached, and replays stop.
  - Visuals: MEMORY 2 GB becomes 4 GB; the code line `maxCachedWorkflows: 500`
    lights and becomes 2000; the strip widens to 7 cells and the waiting
    orders move in; the metric lines read 0/s and "no replays" in neon; the
    tag turns neon; CPU 88%. Before the cut, the metric lines and the FIXED
    tag sink out.

## 06 The CPU is full

- **3:01** Now renderInvoice keeps the CPU at 100%: every task slows down
  and holds its Slot longer.
  - Visuals: the chapter opens on chapter 5's last frame (a hard cut). A wave
    of invoice chips runs through the queue and fills two Slots in three;
    the CPU meter pins at 100% in red with the BOTTLENECK tag; the busy
    Slots drop from 44 to 36, the others stay free.
- **3:09** More Slots would not help: a Slot adds no CPU. This Worker has
  used all the CPU it has.
  - Visuals: the code card fades; a dashed "+ SLOTS" ghost takes its
    place, crossed out.
- **3:17** This is the moment to add Workers: B and C poll the same Task
  Queue and share the load.
  - Visuals: MEMORY fades; WORKER B and WORKER C slide in from the right
    under WORKER A, compact panels with 5 Slots and a CPU gauge each;
    their poll line branches off the Activity lane's connector and tasks
    travel along it to them; the CPU meters settle at 60, 62 and 58%;
    A's CPU tag turns neon (FIXED).
- **3:26** The backlog drains, and new orders start right away again.
  - Visuals: the queues empty; BACKLOG falls to 0 and SCHEDULE-TO-START to 0.3
    s, in neon. Then the diagram leaves in turn while the Slot grid, the
    Pollers, the cache and the CPU meter shrink into the row icons of chapter
    7's table.

## 07 Read the signals

- **3:36** A growing backlog has four common causes: full Slots, slow
  Pollers, a small cache or a full CPU.
  - Visuals: each row grows from its icon (the cache icon reads #1049, the
    order the diagram ends with). A table of four rows, SYMPTOM / SIGNAL /
    FIX: Slots full, CPU low / `worker_task_slots_available` at 0 / More Slots
    (`maxConcurrentActivityTaskExecutions`); Slots free, long wait /
    `activity_schedule_to_start_latency` high / Poller Autoscaling
    (`activityTaskPollerBehavior`); evictions, replays /
    `sticky_cache_total_forced_eviction` rising / More memory, larger cache
    (`maxCachedWorkflows`); CPU at 100% / CPU usage / More Workers; each row
    starts with a small icon of the diagram (Slots, a Poller, a cache cell, a
    full CPU bar) and lights as it is named.
- **3:44** Change one setting at a time, watch the signals, then look for
  the next bottleneck.
  - Visuals: under the table, three pills CHANGE ONE SETTING → WATCH THE
    SIGNALS → NEXT BOTTLENECK, each appearing as it is read, then an arrow
    back to the first closes the loop. Then the rows and the loop slide out,
    and the Slot icon grows into the outro's Worker.

## Outro

- **3:55** Tune one bottleneck at a time, and your Temporal Workers keep
  up when traffic spikes.
  - Visuals: the outro opens on that Worker; the end card builds under it. A
    small Worker panel with its Slots, title "Tuning Temporal Workers",
    tagline "WORKERS THAT KEEP UP WITH YOUR TRAFFIC", Temporal logo.
