# Script and timeline: Durable AI Agents

Subtitles are the only narration (no audio). Each subtitle lasts as long
as its text needs (`autoDur` in `src/engine.js`), plus its `after` pause.
Run `make timeline THEME=durable-ai-agents` for the live values; the start
times below are a snapshot from 2026-10-06.

Each entry gives the subtitle start time and its exact text, then what the
animation shows.

## Audience and goal

The video explains to a non-technical audience, in seven topics:

1. LLM calls (text in, text out);
2. an LLM is stateless by design;
3. the context window;
4. tools;
5. the agentic loop and the definition of an agent;
6. what happens when the agent crashes midway;
7. the benefits of Temporal and Durable Execution, including budget
   savings: previous LLM calls are not lost, so they are not redone to
   rebuild the context.

## Intro

- **0:01** AI agents search, book and send emails for us. But how do they
  actually work?
  - Visuals: Temporal logo, title "How does an AI agent work?", LLM orb with
    orbiting tool icons.

## 01 LLM calls

- **0:08** At the heart of every AI agent is an LLM: a large language model,
  like those from OpenAI, Anthropic or Google.
  - Visuals: Orb appears, tags OPENAI / ANTHROPIC / GOOGLE.
- **0:16** An app sends it some text. The model reads it, then writes a reply,
  word by word.
  - Visuals: App window, "LLM call" arrow, question card flies in, reply typed
    word by word.
- **0:22** That's an LLM call: text in, text out. Nothing more.
  - Visuals: TEXT IN -> orb -> TEXT OUT.

## 02 Stateless by design

- **0:28** Surprise: the model has no memory. Tell it your name…
  - Visuals: Call 1: "Hi, I'm Alex." / "Nice to meet you, Alex!", "Alex" bubble
    above orb.
- **0:33** …then ask again in the next call. It has already forgotten.
  - Visuals: Bubble wiped, NOT KEPT label above the orb, Call 2: "What's my
    name?" / "I don't know…" (red).
- **0:39** That's by design: LLMs are stateless. So the app resends the whole
  conversation with every call.
  - Visuals: STATELESS tag, "Full history" card sent, "You're Alex!".

## 03 The context window

- **0:47** Everything sent to the model fits on one page: the context window.
  Instructions, history, documents, the new question.
  - Visuals: Page fills with an instructions block, then the history: chat
    lines, a "price-list.pdf" message and the new question, tagged NEW; size
    gauge.
- **0:56** It's the only thing the model sees. It has a size limit, and every
  word on it is billed, at every call.
  - Visuals: Vision cone, "Yesterday's email: not in context"; the history
    grows as new messages are appended one by one, NEW moving to the latest
    question, until the gauge is FULL; token counter "billed at every call".

## 04 Tools

- **1:05** The model can't check the weather or send an email. So we give it
  tools.
  - Visuals: Crossed-out icons, toolbox: Weather / Calendar / Email / Web
    search.
- **1:11** When it needs one, the model writes a request: “use the Weather
  tool, for Paris”. The app runs it…
  - Visuals: Request card (tool: weather, city: Paris) goes to the app, app
    calls the tool, "18°C, sunny".
- **1:19** …adds the result to the context, and calls the model again.
  - Visuals: "Full context" bundle, Call 2, answer card.

## 05 The agentic loop

- **1:25** Repeat until the goal is reached: think, act, observe. That's the
  agentic loop.
  - Visuals: Think / Act / Observe loop with travelling token.
- **1:32** “Book lunch with Marie on Thursday”: check the calendar, find a
  restaurant, book a table, send the invite.
  - Visuals: 4 loop turns, each fills a task row, GOAL REACHED.
- **1:40** An AI agent is a model, plus tools, plus a loop, working toward a
  goal.
  - Visuals: MODEL + TOOLS + LOOP = AI AGENT.

## 06 When the agent crashes

- **1:47** Now the app running the agent crashes just before the invite goes
  out. Restarts, deploys, outages: it happens every day.
  - Visuals: 4 steps; steps 1 to 3 complete, each adding 2 APP MEMORY blocks
    (each with its step icon, LLM blocks in UV, tool blocks in black), LLM
    CALLS BILLED counter (3), ticket "1 booking" once the booking result is
    in memory (6 blocks); step 4 (Invite) starts, then flash + bolt +
    APP CRASH before its LLM call, Invite crossed out; tags RESTART / DEPLOY
    / OUTAGE.
- **1:56** The context lived in the app's memory, not in the LLM. It's gone, so
  the agent has to start over.
  - Visuals: The 6 memory blocks fall (booking result included), EMPTY,
    "Start over" arrow from Invite back to Calendar.
- **2:03** Every LLM call is made, and paid for, a second time, just to rebuild
  the context. And the table gets booked twice.
  - Visuals: Steps 1 to 3 re-run and refill the memory, counter 6 with
    "+3 wasted", the booking runs again: "2 BOOKINGS!".

## 07 Durable Execution with Temporal

- **2:13** Durable Execution with Temporal fixes this. Temporal keeps an Event
  History of the agent, outside the app.
  - Visuals: Large Temporal logo flies into the header of a TEMPORAL panel
    ("outside the app") holding an empty EVENT HISTORY; on the left APP INSTANCE
    A with its APP MEMORY, LLM CALLS BILLED at 0; the 4 step tiles on top.
- **2:21** After each LLM call or tool call, Temporal saves the result in the
  history before the agent moves on.
  - Visuals: Steps 1 to 3: for each row the app works (LLM rows bill a call), a
    RESULT card travels from the app to Temporal, the row appears with SAVED, a
    block with the step icon joins APP MEMORY, only then the step is checked;
    counter 3, ticket "1 booking".
- **2:28** If the app crashes, another copy runs the agent again from the start.
  For every step already saved…
  - Visuals: Step 4 starts, flash + shake, A CRASHED, memory blocks fall
    (EMPTY), "APP CRASHED HERE" line under row 6 and tinted kept rows; APP
    INSTANCE B takes over with an empty memory, steps reset, "From the start"
    arrow, step 1 runs.
- **2:35** …Temporal hands back the result from the history. The LLM isn't
  called again: the context is rebuilt for free.
  - Visuals: Replay: rows 1 to 6 highlighted in turn, tags REUSED, RESULT cards
    travel back and refill APP MEMORY, steps re-check, counter stays 3 with "NOT
    RE-BILLED"; tags "REUSED, NOT RE-BILLED" / "REUSED, NOT RE-RUN"; step 4 runs
    for real: counter 4, rows 7 and 8 SAVED, AGENT COMPLETE.
- **2:43** No saved LLM call is paid for twice, and no saved step runs again.
  Plus retries, human waits and full visibility.
  - Visuals: "43% less LLM spend in this example", "4 vs 7 LLM calls", then 4
    tiles: Saved steps reused / Automatic retries / Waits for humans / Full
    visibility.

## Outro

- **2:53** Durable AI agents keep their progress and your budget.
  - Visuals: "Durable AI agents", KEEP THEIR PROGRESS AND YOUR BUDGET, Temporal
    logo.

## Budget figure

The budget numbers are deliberately illustrative ("in this example"):
4 steps = 4 LLM calls. Chapters 6 and 7 crash at the same point: after
step 3's result (the booking) is in APP MEMORY, before step 4's LLM call.
Without durable execution the restart re-runs those 3 steps, booking
included, so 7 calls in total (3/7 ≈ 43% wasted); with Temporal the 3 saved
steps are reused, so 4 calls and 1 booking.

The "in this example" label stays next to the percentage on screen, and
the figures follow the step count if the scenario changes.
