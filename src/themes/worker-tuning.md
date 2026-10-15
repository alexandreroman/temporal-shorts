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

## Outro

[Watch from 1:16](/themes/worker-tuning/#t=76)

Tune one bottleneck at a time, and your Temporal Workers keep up when traffic
spikes.
