# Script and timeline: Introduction to Durable Execution

Subtitles are the only narration (no audio). Timings are computed in
`src/engine.js` from text length (`autoDur`: chars / 16 + 0.6 s, clamped
2.4 to 8 s), plus per-subtitle `after` pauses. Run
`make timeline THEME=durable-execution` for the live values; the start times
below are a snapshot from 2026-10-05.

Each entry gives the subtitle start time and its exact text, then what the
animation shows.

## Audience and story

The video introduces the principles of Durable Execution with Temporal
Workflows, outside any AI context, to everyone: developers new to Temporal
and tech-curious viewers alike. The only code on screen is a four-line
function.

One example runs through the whole video: online order #1042, $42, four
steps, each calling another service:

| Step          | Function       | Icon    | Service   | History result   |
| ------------- | -------------- | ------- | --------- | ---------------- |
| Charge card   | `chargeCard`   | `card`  | Payments  | $42 paid         |
| Reserve item  | `reserveItem`  | `box`   | Warehouse | item reserved    |
| Ship package  | `shipPackage`  | `truck` | Carrier   | tracking 1Z-48   |
| Email receipt | `emailReceipt` | `mail`  | Email     | receipt sent     |

The code, shown in a white code card:

```js
async function placeOrder(order) {
  await chargeCard(order);
  await reserveItem(order);
  await shipPackage(order);
  await emailReceipt(order);
}
```

Vocabulary: before Temporal enters (chapters 1 to 3) the machine running the
code is "the server"; from chapter 5 on it is "the Worker". The order's
money is tracked by a CARD CHARGED counter in dollars.

## Intro

- **0:00** Payments, orders, sign-ups: most apps run processes made of
  several steps. What if one fails halfway?
  - Visuals: Temporal logo, kicker "AN INTRODUCTION FOR EVERYONE", title
    "What is Durable Execution?", violet line "WITH TEMPORAL WORKFLOWS". On
    the right, a vertical chain of the 4 step icons; a neon pulse runs down
    the chain in a loop and checks each step; step 3 flashes red, retries,
    then passes.

## 01 A process in many steps

- **0:00** Take an online order. Behind the Buy button, four steps run one
  after the other.
  - Visuals: Order card "Order #1042, Sneakers, $42" with a BUY button that
    is pressed, then the 4 step tiles pop in, joined by links.
- **0:00** Charge the card, reserve the item, ship the package, email the
  receipt. Each step calls another service.
  - Visuals: The steps run in turn (spinner, then neon check); under each,
    a link draws down to its service (PAYMENTS, WAREHOUSE, CARRIER, EMAIL).
- **0:00** For a developer, it's a short function: four calls, in order.
  Simple, as long as nothing fails.
  - Visuals: Services fade; the code card appears, a highlight walks its
    four `await` lines, ORDER COMPLETE.

## 02 When a step fails

- **0:00** But in real life, things fail: networks drop, services time out,
  servers restart for a deploy.
  - Visuals: Step row, order status, CARD CHARGED counter ($0); tags
    NETWORK CUT / TIMEOUT / RESTART pop in.
- **0:00** Here, the server crashes right after charging the card. The
  order is stuck: paid, but never shipped.
  - Visuals: Charge card runs and checks, counter $42; Reserve item runs,
    red flash + shake + bolt, SERVER CRASH; Reserve item fails, status
    "PAID, NOT SHIPPED" in red.
- **0:00** Restart it from the top, and the card is charged a second time.
  The customer pays twice.
  - Visuals: "Start over" arrow, steps reset and re-run, counter $84 in red
    with "CHARGED TWICE!".

## 03 The usual fix: plumbing

- **0:00** So developers add plumbing around the code: retries, status
  tables, queues, timers, cleanup jobs.
  - Visuals: The code card in the middle; plumbing tiles pop in around it,
    wired to it: RETRY LOOPS, STATUS TABLE, MESSAGE QUEUE, TIMERS, CLEANUP
    JOBS, IDEMPOTENCY KEYS.
- **0:00** Soon the plumbing outweighs the business logic, and every corner
  case is a new bug to chase.
  - Visuals: LINES OF CODE bar: BUSINESS LOGIC (neon) stays thin while
    PLUMBING (red) grows; red bug marks pop on the plumbing tiles.

## 04 Durable Execution with Temporal

- **0:00** Durable Execution takes another path: your code runs to
  completion, even when servers fail.
  - Visuals: Plumbing falls away; Temporal logo; the code card alone with a
    neon RUNS TO COMPLETION badge.
- **0:00** With Temporal, you write the process as a Workflow, and each
  step that calls a service as an Activity.
  - Visuals: The code card gets a WORKFLOW header; each `await` line links
    to an ACTIVITY tile on the right (the 4 step icons).
- **0:00** If an Activity fails, Temporal retries it automatically, with
  growing delays, until it succeeds.
  - Visuals: Ship package fails ("Carrier timeout"); attempt dots on a
    retry line: 1 failed, retry in 1s, 2 failed, retry in 2s, 3 succeeds;
    AUTOMATIC RETRIES.

## 05 The Event History

- **0:00** Your code runs on your own servers, called Workers. Temporal
  keeps an Event History, outside the Workers.
  - Visuals: Left, WORKER A panel holding the code card; right, a TEMPORAL
    panel (official logo header, "OUTSIDE THE WORKERS") holding an EVENT
    HISTORY card; CARD CHARGED counter ($0) under the Worker.
- **0:00** Each Activity result is saved in the history before the
  Workflow moves on to the next step.
  - Visuals: Row 1 "Workflow started" SAVED; for each line the highlight
    sits on it (spinner), a RESULT card travels from the Worker to the
    history, the row appears with SAVED, only then the highlight moves on:
    rows 2 and 3, counter $42; Ship package starts.

## 06 When a Worker crashes

- **0:00** Now the Worker crashes mid-order. Another Worker picks up the
  Workflow and runs its code from the start.
  - Visuals: Same layout, rows 1 to 3 saved, `shipPackage` running; red
    flash + shake, WORKER A CRASHED, "WORKER CRASHED HERE" line under row 3
    and tinted kept rows; WORKER B takes over, the highlight jumps back to
    the first line ("From the start").
- **0:00** For every step already in the history, Temporal hands back the
  saved result: no second charge.
  - Visuals: Replay: the highlight walks lines 1 and 2, each history row
    lights up, a RESULT card travels back to the Worker; tags REUSED, then
    "REUSED, NOT RE-CHARGED" / "REUSED, NOT RE-RUN"; counter stays $42 with
    NOT RE-CHARGED.
- **0:00** Then the Workflow carries on exactly where it stopped, as if
  nothing had happened.
  - Visuals: `shipPackage` and `emailReceipt` run for real, rows 4 and 5
    SAVED, row 6 "Workflow completed", ORDER COMPLETE, counter "CHARGED
    ONCE".

## 07 What you get

- **0:00** A Workflow can even wait for days, for a delivery or a reply,
  without tying up a server.
  - Visuals: Code `await sleep('30 days')`; a day counter fast-forwards
    from day 1 to day 30 while the Worker shows IDLE; on day 30 the next
    line runs.
- **0:00** You write the business logic. Temporal handles retries, state
  and recovery, with full visibility.
  - Visuals: 4 tiles: Automatic retries / Survives crashes / Waits for
    days / Full visibility.

## Outro

- **0:00** Durable Execution: your code runs to completion, whatever fails
  along the way.
  - Visuals: The 4 step tiles checked, title "Durable Execution", violet
    line "YOUR CODE RUNS TO COMPLETION", Temporal logo.
