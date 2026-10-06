---
name: "Durable AI Agents: chapter 7 story"
description: "The Event History mechanism durable-ai-agents teaches: who keeps it, when it is written, how replay works"
type: project
---

# Durable AI Agents: chapter 7 story

Scope: the `durable-ai-agents` theme.

Chapter 7 teaches the Event History mechanism in three ideas, each with its
own subtitle beat:

1. **Temporal keeps the history, outside the app** (not the app itself).
2. **Saved before moving on**: after each LLM call or tool call, Temporal
   saves the result; only then does the agent start the next step.
3. **Replay**: after a crash, another copy runs the agent again from the
   start; for every step already saved, Temporal hands back the recorded
   result, so the LLM is not called and the context (APP MEMORY) is rebuilt
   for free. The first unsaved step then runs for real.

Chapters 6 and 7 crash at the same point: after step 3's tool result,
before step 4's LLM call. The budget message rides on the LLM CALLS BILLED
counter, which stays put during replay, followed by "43% less LLM spend, in
this example" (see the Budget figure section of
`docs/durable-ai-agents/script.md`).

**Why:** showing the code re-run while Temporal hands back the recorded
answers explains how the history saves LLM calls, so the budget argument
follows logically; the shared crash point keeps the comparison fair. This
matches how Temporal replays Workflow code against recorded Activity
results.

**How to apply:** keep these three ideas and their order when editing
chapter 7; keep the layout mirrored with chapter 6 (see
[Visual design decisions](feedback_visual-design.md)).
