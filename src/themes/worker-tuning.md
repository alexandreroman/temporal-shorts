# Tuning Temporal Workers

How Temporal Workers take work, and how to find and fix the bottleneck behind a
growing Task Queue backlog.

[Watch the video](/themes/worker-tuning/)

Your Task Queue is backing up and orders are waiting. Which Worker setting do
you change?

## Chapter 1: The backlog grows

[Watch from 0:11](/themes/worker-tuning/#t=11)

Black Friday: the shop gets ten times more orders than usual, and every order is
a Temporal Workflow. Tasks pile up in the Task Queue: the backlog grows, and
each order waits longer to start. The first reflex is to add more Workers.
Before that, find out what is actually full.

## Chapter 2: How a Worker takes work

[Watch from 0:39](/themes/worker-tuning/#t=39)

Workflow Tasks and Activity Tasks wait in two separate queues, even under one
Task Queue name. A Poller in the Worker asks a queue for a task, but only while
a Slot is free. A Slot is the permission to run one task. The task itself uses
the Worker's CPU and memory. The Workflow cache keeps Workflows in memory, so
their next task skips replaying the history.

## Chapter 3: Every Slot is busy

[Watch from 1:16](/themes/worker-tuning/#t=76)

The Worker is set for normal days: 10 Activity Slots. All 10 are busy, and the
CPU sits at 35%. Tasks wait for a Slot, not for the machine: the Slots available
metric stays at zero. Raise the limit from 10 to 50 Slots, and five times more
tasks run at once. Throughput climbs, yet the backlog grows again. Something
else is the limit now.

## Chapter 4: The Pollers can't keep up

[Watch from 1:52](/themes/worker-tuning/#t=112)

Now Slots sit free while the queue still grows, and the CPU has room to spare.
Tasks wait a long time before they start: the Pollers can't fetch them fast
enough. Turn on Poller Autoscaling: the Worker adds Pollers when tasks wait and
removes them when idle. Tasks reach the free Slots again, and the CPU starts to
climb.

## Chapter 5: The cache runs out

[Watch from 2:26](/themes/worker-tuning/#t=146)

More orders are open at once than the Workflow cache can hold. The cache evicts
Workflows. An evicted Workflow replays its whole Event History on its next task.
Replays burn CPU and hold Workflow Slots before the order can move forward. Give
the Worker more memory and a larger cache: open orders stay cached, and replays
become rare.

## Chapter 6: The CPU is full

[Watch from 3:01](/themes/worker-tuning/#t=181)

Now renderInvoice keeps the CPU at 100%: every task slows down and holds its
Slot longer. More Slots would not help: a Slot adds no CPU. This Worker has used
all the CPU it has. Add Workers on more hosts: B and C poll the same Task Queue
and share the load. The backlog drains, and new orders start right away again.

## Chapter 7: Read the signals

[Watch from 3:35](/themes/worker-tuning/#t=215)

A growing backlog often comes from one of four Worker limits: Slots, Pollers,
cache or CPU. Change one setting at a time, watch the signals, then look for the
next bottleneck.

## Outro

[Watch from 3:55](/themes/worker-tuning/#t=235)

Tune one bottleneck at a time, and your Temporal Workers keep up when traffic
spikes.
