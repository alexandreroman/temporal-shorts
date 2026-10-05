---
name: "Durable Execution story"
description: "The Event History mechanism the video teaches: who keeps it, when it is written, how replay works"
type: project
---

# Durable Execution story

Chapter 7 teaches the Event History mechanism in three ideas, each with its
own subtitle beat:

1. **Temporal keeps the history, outside the app** (not the app itself).
2. **Saved before moving on**: after each LLM call or tool call, Temporal
   saves the result; only then does the agent start the next step.
3. **Replay**: after a crash, another copy runs the agent again from the
   start; for every step already saved, Temporal hands back the recorded
   result, so the LLM is not called and the context (APP MEMORY) is rebuilt
   for free. The first unsaved step then runs for real.

The budget message rides on the LLM CALLS BILLED counter, which stays put
during replay, followed by "43% less LLM spend, in this example" (see
[Budget figure](project_budget-figure.md)).

**Why:** a scanning "replays the history" bar told viewers *that* the history
exists but not how it saves LLM calls; showing the code re-run with answers
coming from Temporal makes the budget argument follow logically. This matches
how Temporal really replays Workflow code against recorded Activity results.

**How to apply:** keep these three ideas and their order when editing
chapter 7; keep the layout mirrored with chapter 6 (see
[Visual design decisions](feedback_visual-design.md)).
