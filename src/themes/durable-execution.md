# Introduction to Durable Execution with Temporal

How Temporal Workflows survive crashes: Event History, replay, durable timers
and full visibility, shown on an online order that never charges twice.

[Watch the video](/themes/durable-execution/)

Payments, orders, sign-ups: most apps run processes made of several steps. What
if one fails halfway?

## Chapter 1: A process in many steps

[Watch from 0:10](/themes/durable-execution/#t=10)

Take an online order. Behind the Buy button, four steps run one after the other.
Charge the card, reserve the item, ship the package, email the receipt. Each
step calls another service. For a developer, it's a short function: four calls,
in order. Simple, as long as nothing fails.

## Chapter 2: When a step fails

[Watch from 0:33](/themes/durable-execution/#t=33)

But in real life, things fail: networks drop, services time out, servers restart
for a deploy. Here, the server crashes right after charging the card. The order
is stuck: paid, but never shipped. Restart it from the top, and the card is
charged a second time. The customer pays twice.

## Chapter 3: The usual fix: plumbing

[Watch from 0:56](/themes/durable-execution/#t=56)

So developers add plumbing around the code: retries, status tables, queues,
timers, cleanup jobs. Soon the plumbing outweighs the business logic, and every
corner case is a new bug to chase.

## Chapter 4: Durable Execution with Temporal

[Watch from 1:12](/themes/durable-execution/#t=72)

Durable Execution takes another path: your code runs to completion, even when
servers fail. With Temporal, you write the process as a Workflow, and each step
that calls a service as an Activity. If an Activity fails, Temporal retries it
automatically, with growing delays, until it succeeds.

## Chapter 5: The Event History

[Watch from 1:36](/themes/durable-execution/#t=96)

Your code runs in Workers, programs on your own servers. Temporal keeps an Event
History, outside the Workers. Each Activity result is saved in the history
before the Workflow moves on to the next step.

## Chapter 6: When a Worker crashes

[Watch from 1:52](/themes/durable-execution/#t=112)

Now the Worker crashes mid-order, during shipPackage. Another Worker takes over
the Workflow. It first runs the Workflow from the start, and Temporal hands back
every saved result: no second charge. Then the Workflow carries on where it
stopped: shipPackage runs again, and the order completes.

## Chapter 7: Full visibility

[Watch from 2:16](/themes/durable-execution/#t=136)

Temporal also shows every Workflow in its Web UI: which ones are running,
completed or failed. Open order #1042: its timeline shows every Activity, how
long it took, and the retry after the crash. Order #1045 is running: you see
shipPackage retrying, its attempt count and its last error, live.

## Chapter 8: Durable timers

[Watch from 2:45](/themes/durable-execution/#t=165)

A Workflow can even wait for days, for a delivery or a reply, without tying up a
Worker. The timer is saved in the Event History, so Worker restarts and deploys
during the wait don't lose it. On day 30, Temporal wakes the Workflow up: a
Worker replays its history and runs the next line.

## Chapter 9: What you get

[Watch from 3:08](/themes/durable-execution/#t=188)

You write the business logic. Temporal handles retries, crashes and waits, with
full visibility.

## Chapter 10: What you can build

[Watch from 3:16](/themes/durable-execution/#t=196)

Order #1042 is one example: any process that must run to the end fits a
Workflow. Money transfers, subscriptions, data pipelines, AI agents: a crash
never leaves any of them half done.

## Outro

[Watch from 3:31](/themes/durable-execution/#t=211)

Durable Execution: your code runs to completion, whatever fails along the way.
