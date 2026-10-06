# Script and timeline: Introduction to Durable Execution

Subtitles are the only narration (no audio). Each subtitle lasts as long
as its text needs (`autoDur` in `src/engine.js`), plus its `after` pause.
Run `make timeline THEME=durable-execution` for the live values; the start
times below are a snapshot from 2026-10-06.

Each entry gives the subtitle start time and its exact text, then what the
animation shows.

## Audience and story

The video introduces the principles of Durable Execution with Temporal
Workflows, outside any AI context, to everyone: developers new to Temporal
and tech-curious viewers alike. The code on screen is real Temporal
TypeScript SDK code, kept short.

One example runs through the whole video: online order #1042, $42, four
steps, each calling another service:

| Step          | Function       | Icon    | Service   | History result   |
| ------------- | -------------- | ------- | --------- | ---------------- |
| Charge card   | `chargeCard`   | `card`  | Payments  | $42 paid         |
| Reserve item  | `reserveItem`  | `box`   | Warehouse | item reserved    |
| Ship package  | `shipPackage`  | `truck` | Carrier   | tracking 1Z-48   |
| Email receipt | `emailReceipt` | `mail`  | Email     | receipt sent     |

The code, shown in a white code card. Chapters 1 to 3 (before Temporal)
show ordinary code:

```ts
async function placeOrder(order: Order) {
  await chargeCard(order);
  await reserveItem(order);
  await shipPackage(order);
  await emailReceipt(order);
}
```

From chapter 4 on, the card carries a WORKFLOW tab and a `workflows.ts`
label. Chapter 4 shows the excerpt: the Activities obtained with
`proxyActivities`, then the Workflow, an exported async function. Chapters
5 and 6 show the Workflow alone, from `export async function` on:

```ts
const { chargeCard, reserveItem, shipPackage, emailReceipt } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: '10 seconds',
  });

export async function placeOrder(order: Order) {
  await chargeCard(order);
  await reserveItem(order);
  await shipPackage(order);
  await emailReceipt(order);
}
```

Chapter 8 adds a durable timer, `await sleep('30 days');`.

Vocabulary: before Temporal enters (chapters 1 to 3) the machine running the
code is "the server"; from chapter 5 on it is "the Worker". The order's
money is tracked by a CARD CHARGED counter in dollars.

## Intro

- **0:01** Payments, orders, sign-ups: most apps run processes made of
  several steps. What if one fails halfway?
  - Visuals: Temporal logo, kicker "AN INTRODUCTION FOR EVERYONE", title
    "What is Durable Execution?", violet line "WITH TEMPORAL WORKFLOWS". On
    the right, a vertical chain of the 4 step icons; a neon pulse runs down
    the chain in a loop and checks each step; on Ship package it first
    flashes red, shows a retry arrow, then passes.

## 01 A process in many steps

- **0:10** Take an online order. Behind the Buy button, four steps run one
  after the other.
  - Visuals: Order card "ORDER #1042, Sneakers, $42" whose BUY button is
    pressed, then the 4 step tiles pop in below, joined by links.
- **0:16** Charge the card, reserve the item, ship the package, email the
  receipt. Each step calls another service.
  - Visuals: The steps run in turn (spinner, then neon check); as each
    runs, a link draws down to its service (PAYMENTS, WAREHOUSE, CARRIER,
    EMAIL) and a dot carries the call there and back.
- **0:24** For a developer, it's a short function: four calls, in order.
  Simple, as long as nothing fails.
  - Visuals: Order card and services fade; the code card appears above the
    row, a highlight walks its four `await` lines and each line runs its
    step; ORDER COMPLETE.

## 02 When a step fails

- **0:32** But in real life, things fail: networks drop, services time out,
  servers restart for a deploy.
  - Visuals: Step row; under it, two equal tiles, each under two steps: the
    ORDER #1042 status (PENDING) and the CARD CHARGED counter ($0); red
    tags NETWORK CUT / TIMEOUT / RESTART pop in over the links, each
    jolting its neighbors.
- **0:40** Here, the server crashes right after charging the card. The
  order is stuck: paid, but never shipped.
  - Visuals: Charge card runs and checks, counter $42; Reserve item runs,
    red flash + shake + bolt, SERVER CRASH; Reserve item fails, status
    "PAID, NOT SHIPPED" in red with a STUCK note.
- **0:47** Restart it from the top, and the card is charged a second time.
  The customer pays twice.
  - Visuals: Red "Start over" arrow back to Charge card, steps and status
    reset and re-run, counter $84 in red with "CHARGED TWICE!".

## 03 The usual fix: plumbing

- **0:56** So developers add plumbing around the code: retries, status
  tables, queues, timers, cleanup jobs.
  - Visuals: The code card ("BUSINESS LOGIC") in the middle; plumbing tiles
    pop in left and right, each wired to it: RETRY LOOPS, STATUS TABLE,
    MESSAGE QUEUE, TIMERS, CLEANUP JOBS, RECOVERY SCRIPTS.
- **1:03** Soon the plumbing outweighs the business logic, and every corner
  case is a new bug to chase.
  - Visuals: LINES OF CODE bar: BUSINESS LOGIC (neon) stays thin while
    PLUMBING (red) grows; red bug badges pop on four plumbing tiles.

## 04 Durable Execution with Temporal

- **1:12** Durable Execution takes another path: your code runs to
  completion, even when servers fail.
  - Visuals: Temporal logo; the `workflows.ts` card alone, a highlight
    walks the Workflow, a neon RUNS TO COMPLETION badge; a red bolt bounces
    off the card.
- **1:19** With Temporal, you write the process as a Workflow, and each
  step that calls a service as an Activity.
  - Visuals: The card slides left, the badge with it; the `proxyActivities`
    declaration lights up while each `await` line links to an ACTIVITY tile
    on the right (Charge card, Reserve item, Ship package, Email receipt),
    each linked to its service.
- **1:27** If an Activity fails, Temporal retries it automatically, with
  growing delays, until it succeeds.
  - Visuals: Charge card and Reserve item check; Ship package fails
    (CARRIER TIMEOUT); on its link a retry line builds: attempt 1 fails,
    "RETRY IN 1S", attempt 2 fails, "RETRY IN 2S", attempt 3 succeeds;
    AUTOMATIC RETRIES; Email receipt checks.

## 05 The Event History

- **1:36** Your code runs in Workers, programs on your own servers. Temporal
  keeps an Event History, outside the Workers.
  - Visuals: Left, WORKER A panel holding the code card (WORKFLOW tab),
    CARD CHARGED counter ($0) and order status (PENDING); right, a TEMPORAL
    panel (official logo, "OUTSIDE THE WORKERS") holding an empty EVENT
    HISTORY.
- **1:44** Each Activity result is saved in the history before the
  Workflow moves on to the next step.
  - Visuals: Row 1 "Workflow started" SAVED; for each line the highlight
    sits on it with a spinner, a RESULT chip flies from the Worker to the
    history, the row slides in with SAVED, only then the highlight moves
    on: rows 2 and 3, counter $42; `shipPackage` starts.

## 06 When a Worker crashes

- **1:52** Now the Worker crashes mid-order, during shipPackage. Temporal
  retries that Activity on another Worker.
  - Visuals: Same layout, `shipPackage` running; red flash + shake, WORKER
    A CRASHED, "WORKER CRASHED HERE" line under row 3 and tinted kept rows;
    WORKER B appears (IDLE). A RETRY chip flies from the history, under the
    crash line, to the `shipPackage` line: WORKER B shows RETRYING ACTIVITY,
    the line runs (spinner), its RESULT chip flies to the history and row 4
    "shipPackage: tracking 1Z-48" slides in SAVED, below the crash line.
    (In a real run, Temporal detects the lost attempt through the
    Activity's Start-To-Close timeout; the video does not show it.)
- **1:59** Then that Worker runs the Workflow from the start, and Temporal
  hands back every saved result: no second charge.
  - Visuals: WORKER B shows REPLAYING…, a violet "FROM THE START" arrow and
    the highlight go back to line 1; for lines 2, 3 and 4 the history row
    lights up, a RESULT chip flies back to the Worker, tags REUSED, then
    "REUSED, NOT RE-CHARGED" / "REUSED, NOT RE-RUN" / "REUSED, NOT RE-RUN";
    counter stays $42 with NOT RE-CHARGED.
- **2:08** Then the Workflow carries on exactly where it stopped, as if
  nothing had happened.
  - Visuals: `emailReceipt` runs for real, row 5 SAVED, row 6 "Workflow
    completed"; order COMPLETE, counter "CHARGED ONCE", WORKFLOW COMPLETE
    inside the history, under its rows.

## 07 Full visibility

The window reproduces the Temporal Web UI (2.54.1) in dark mode: a text
sidebar (Namespaces, Workflows, Schedules, Batch, Workers, Nexus, Archive,
Docs), the `default` namespace box and the real page layouts, trimmed for
readability.

- **2:16** Temporal also shows every Workflow in its web UI: which ones are
  running, completed or failed.
  - Visuals: The "6 Workflows" page: count pills 1 RUNNING, 4 COMPLETED,
    1 FAILED, a Start Workflow button, filter tabs and a table Status /
    Workflow ID / Run ID / Type / Start with order-1045 (Running) to
    order-1041 (Failed); the pills and badges bump as the subtitle names
    each status; a pointer clicks order-1042.
- **2:23** Open order #1042: its timeline shows every Activity, how long it
  took, and the retry after the crash.
  - Visuals: The order-1042 page: COMPLETED badge before the title, the
    summary grid (Start, End, Duration 16s 112ms, Run ID, Workflow Type,
    Task Queue, Workflow SDK TypeScript), the Timeline tab: a Workflow bar
    over Activity lanes stacked bottom-up (chargeCard, reserveItem,
    "2 • shipPackage" with a red-to-green retried bar, emailReceipt),
    growing in time order with their durations; a video annotation, outside
    the UI style, points at the failed attempt: "WORKER A CRASHED ·
    RETRIED ON WORKER B". The numbers follow the 10-second
    `startToCloseTimeout`: `shipPackage` attempt 1 starts at 2.4 s and is
    lost with Worker A, attempt 2 starts at 13.4 s (timeout at 12.4 s plus
    the 1 s retry interval) and ends at 15.5 s, then `emailReceipt` runs
    from 15.6 s to 16.0 s. Event History (29): the retried Activity writes
    one ActivityTaskStarted, when its last attempt completes.
- **2:32** While a Workflow runs, you see an Activity retrying, its attempt
  count and its last error, live.
  - Visuals: The order-1045 page, RUNNING, Duration counting live, the
    Pending Activities tab: a shipPackage card (STARTED, then SCHEDULED
    during each wait) with Attempt "1 / UNLIMITED" to "3 / UNLIMITED",
    Last Worker Identity worker-b and a Last Failure JSON box ("Carrier
    timeout"); attempt 3 succeeds, "No pending activities", the badge
    turns COMPLETED. The Event History count reads 17 while `shipPackage`
    retries (no event per failed attempt), 23 once it completes (its
    ActivityTaskStarted and ActivityTaskCompleted, a Workflow Task, then
    `emailReceipt` scheduled) and 29 once the Workflow completes.

## 08 Durable timers

- **2:42** A Workflow can even wait for days, for a delivery or a reply,
  without tying up a Worker.
  - Visuals: Left, a WORKER A panel (VERSION 1) with the `workflows.ts`
    card: `shipPackage`, a comment, `await sleep('30 days');`,
    `askForReview`, above a WORKER STATUS block; right, the TEMPORAL panel
    with an EVENT HISTORY card and a DURABLE TIMER block. shipPackage runs,
    row "shipPackage: tracking 1Z-48" SAVED; a START TIMER chip saves row
    "TimerStarted: 30 days"; DAY 1 / 30, SLEEPING; the Worker shows FREE
    FOR OTHER WORK.
- **2:49** The timer is saved in the Event History, so Worker restarts and
  deploys during the wait don't lose it.
  - Visuals: The timer ticks day by day to day 30 while the TimerStarted
    row stays lit; the Worker shows RESTARTING…, then DEPLOYING V2…, and
    WORKER A gives way to WORKER B (VERSION 2).
- **2:57** On day 30, Temporal wakes the Workflow up: a Worker replays its
  history and runs the next line.
  - Visuals: TIME IS UP, row "TimerFired" SAVED; a WAKE UP chip flies to
    the sleep line; Worker B shows REPLAYING… as the highlight walks the
    code with the history rows, then RUNNING on `askForReview`, row
    "askForReview: review requested" SAVED.

## 09 What you get

- **3:05** You write the business logic. Temporal handles retries, state
  and recovery, with full visibility.
  - Visuals: "You write the business logic", Temporal logo + a slate
    "HANDLES THE REST" sized to its wordmark, then 4 identical tiles:
    Automatic retries / Survives crashes / Waits for days / Full
    visibility.

## Outro

- **3:14** Durable Execution: your code runs to completion, whatever fails
  along the way.
  - Visuals: The 4 step tiles checked, title "Durable Execution", violet
    line "YOUR CODE RUNS TO COMPLETION", Temporal logo.
