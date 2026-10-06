---
name: "Human-in-the-Loop story"
description: "human-in-the-loop theme: running example, the ideas it teaches in order, and its visual continuity"
type: project
---

# Human-in-the-Loop story

Scope: the `human-in-the-loop` theme.

- **Running example:** Sam orders a $2,400 laptop; above $1,000, Maria, the
  manager, must approve it. The process has four steps, shown as the same
  step tiles in chapters 1, 3 and 4: CHECK, APPROVAL, ORDER, NOTIFY.
  Subtitles, labels and docs refer to Sam and Maria by name, with no
  pronouns.
- **Ideas, in order:** a step needs a person who may answer in minutes or
  days (ch1); a plain app cannot wait that long, and hand-built waiting
  plumbing is fragile (ch2); the Workflow waits on one line of code, with
  no code running, while Temporal keeps its Event History outside the app
  and survives restarts and deploys (ch3); the decision arrives as a
  Signal, any copy of the app replays the history and resumes right after
  the wait, with no step redone (ch4); durable timers drive reminders and
  escalation (ch5); the recap names what the Workflow gives (waits for
  days, survives restarts, no step redone, sends reminders), and the same
  pattern fits approvals, reviews, signatures and AI agent checks (ch6).
- **Layout continuity:** chapters 3 and 4 share one layout that mirrors
  `durable-ai-agents` chapter 7: step row on top, app instance panel with
  a WORKFLOW card on the left, TEMPORAL panel with the Event History on the
  right. Replayed rows get a REPLAYED tag, except the Signal row, which is
  new to the Workflow and keeps SAVED; "WAITING FOR A SIGNAL" is an
  un-numbered line, since waiting itself is not an event.
- **Shared notes:** the vocabulary of
  [On-screen vocabulary](feedback_vocabulary.md) applies ("the app" runs
  the Workflow); shifts follow [Scene centering](project_scene-centering.md).

**Why:** one concrete, relatable example carries a non-technical audience
from the problem to Temporal's answer, and matches how Temporal really
works (Signals, replay, durable timers).

**How to apply:** keep the example, step names and chapter order
consistent when editing a scene; update `docs/human-in-the-loop/script.md`
with any change.
