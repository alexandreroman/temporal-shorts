# Script and timeline: Durable AI Agents

Subtitles are the only narration (no audio). Each subtitle lasts as long
as its text needs (`autoDur` in `src/engine.js`), plus its `after` pause.
Run `make timeline THEME=durable-ai-agents` for the live values; the start
times below are a snapshot from 2026-10-07.

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

### Budget figure

The budget numbers are deliberately illustrative ("in this example"):
4 steps = 4 LLM calls. Chapters 6 and 7 crash at the same point: after
step 3's result (the booking) is in CONTEXT, before step 4's LLM call.
Without durable execution the restart re-runs those 3 steps, booking
included, so 7 calls in total (3/7 ≈ 43% wasted); with Temporal the 3 saved
steps are reused, so 4 calls and 1 booking.

The "in this example" label stays next to the percentage on screen, and
the figures follow the step count if the scenario changes.

## Intro

- **0:01** AI agents search, book and send emails for us. But how do they
  actually work?
  - Visuals: Temporal logo, kicker "AN EXPLAINER FOR EVERYONE", title "How
    does an AI agent work?", tagline "AND WHY IT NEEDS DURABLE EXECUTION"; on
    the right an LLM orb with orbiting tool icons.

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

- **0:28** Surprise: the model has no memory. Tell it your name.
  - Visuals: Call 1: "Hi, I'm Alex." / "Nice to meet you, Alex!", "Alex" bubble
    above orb.
- **0:33** Then ask again in the next call: it has already forgotten.
  - Visuals: Bubble wiped, NOT KEPT label above the orb, Call 2: "What's my
    name?" / "I don't know…" (red).
- **0:39** That's by design: LLMs are stateless. So the app resends the whole
  conversation with every call.
  - Visuals: STATELESS tag, "Full history" card sent, "You're Alex!".

## 03 The context window

- **0:47** Everything sent to the model fits on one page: the context window.
  Instructions, history, documents, the new question.
  - Visuals: Page fills with an instructions block, then the history block:
    the chat lines slide in one by one, then a "price-list.pdf" message and
    the new question, tagged NEW. With each message, the size gauge and a
    token counter "billed so far" (bottom aligned with the page) rise as
    the square of the page fill, since every call resends the whole page;
    at each step the counter's coin bumps, a coin flies off, each time in
    another direction, and "+N" rises.
- **0:56** It's the only thing the model sees. It has a size limit, and every
  word on it is billed, at every call.
  - Visuals: Vision cone, "Yesterday's email: not in context"; the history
    grows as new messages are appended one by one, NEW moving to the latest
    question, the gauge and the counter rising with each, until the gauge
    is FULL at 12,400 tokens.

## 04 Tools

- **1:05** The model can't check the weather or send an email. So we give it
  tools.
  - Visuals: Crossed-out icons, toolbox: Weather / Calendar / Email / Web
    search.
- **1:11** When it needs one, the model writes a request: "use the Weather
  tool, for Paris". The app runs it.
  - Visuals: Request card (tool: weather, city: Paris) goes to the app, app
    calls the tool, "18°C, sunny".
- **1:19** The app adds the result to the context, then calls the model
  again.
  - Visuals: "Full context" bundle, Call 2, answer card.

## 05 The agentic loop

- **1:26** Repeat until the goal is reached: think, act, observe. That's the
  agentic loop.
  - Visuals: Think / Act / Observe loop with travelling token.
- **1:32** "Book lunch with Marie on Thursday": check the calendar, find a
  restaurant, book a table, send the invite.
  - Visuals: 4 loop turns, each fills a task row, GOAL REACHED.
- **1:41** An AI agent is a model, plus tools, plus a loop, working toward a
  goal.
  - Visuals: MODEL + TOOLS + LOOP = AI AGENT.

## 06 When the agent crashes

- **1:47** Now the app running the agent crashes just before the invite goes
  out. Restarts, deploys, outages: it happens every day.
  - Visuals: 4 steps above APP INSTANCE A (RUNNING THE AGENT), which holds
    the CONTEXT panel; steps 1 to 3 complete, each adding 2 memory blocks
    (each with its step icon, LLM blocks in UV, tool blocks in black), LLM
    CALLS BILLED counter (3), ticket "1 booking" once the booking result is
    in memory (6 blocks); step 4 (Invite) starts, then flash + bolt +
    APP CRASH before its LLM call, Invite crossed out, A CRASHED with red
    borders; tags RESTART / DEPLOY / OUTAGE.
- **1:56** The context lived in the app's memory, not in the LLM. It's gone, so
  the agent has to start over.
  - Visuals: The 6 memory blocks fall (booking result included), EMPTY.
    Instance A greys, drops and fades with its memory; APP INSTANCE B slides
    in to the same place with a pulsing violet glow, a NEW INSTANCE tag and
    an empty memory, status STARTING OVER: no history to resume from. The
    steps reset and a "Start over" arrow draws from Invite back to Calendar.
    The tag and glow fade.
- **2:03** Every LLM call is made, and paid for, a second time, just to rebuild
  the context. And the table gets booked twice.
  - Visuals: Instance B starts RUNNING THE AGENT again: steps 1 to 3
    re-run and refill its memory. Each LLM call is billed again and hits
    the counter: the number swells, the tile jolts
    and flashes red with a red glow, and a red "+1 CALL" chip with a coin
    pops out of its top and floats up as it fades; after the third, the
    counter rests at 6 "+3 wasted" with a red border. The booking runs
    again: once the last chip is gone, the ticket flies from under the
    counter to the middle of the stage, between the steps and the panels,
    growing to 1.5 times its size, then slams to "2 BOOKINGS!" (strong
    swell, jolt, red glow) and a second ticket stacks behind it; both stay
    there until the end of the chapter.

## 07 Durable Execution with Temporal

- **2:13** Durable Execution with Temporal fixes this. Temporal keeps an Event
  History of the agent, outside the app.
  - Visuals: Large Temporal logo flies into the header of a TEMPORAL panel
    ("outside the app") holding an empty EVENT HISTORY; on the left APP INSTANCE
    A with its CONTEXT, LLM CALLS BILLED at 0; the 4 step tiles on top.
- **2:21** After each LLM call or tool call, Temporal saves the result in the
  history before the agent moves on.
  - Visuals: Steps 1 to 3: for each row the app works (LLM rows bill a call), an
    LLM CALL or TOOL CALL card travels from the app to Temporal, the row appears
    with SAVED, a block with the step icon joins CONTEXT, only then the step
    is checked; counter 3, ticket "1 booking".
- **2:29** If the app crashes, another copy runs the agent again from the
  start.
  - Visuals: Step 4 starts, flash + shake, A CRASHED, memory blocks fall
    (EMPTY), "APP CRASHED HERE" line under row 6 and tinted kept rows. The dead
    instance A greys, drops and fades with its CONTEXT; APP INSTANCE B slides
    in to the same place with a pulsing violet glow and a "NEW INSTANCE" tag,
    with an empty memory, and the steps reset. A violet "LUNCH AGENT" chip
    flies from the first Event History row to B's status, which turns from
    IDLE to TAKING OVER, as the "From the start" arrow draws; step 1 runs. The
    tag and glow fade before the replay.
- **2:34** For each saved step, Temporal returns the result from the
  history. The LLM isn't called again: the context is rebuilt for free.
  - Visuals: Replay: rows 1 to 6 highlighted in turn, tags REUSED, LLM CALL and
    TOOL CALL cards travel back and refill CONTEXT, steps re-check, counter
    stays 3 with "NOT RE-BILLED"; tags "REUSED, NOT RE-BILLED" / "REUSED, NOT
    RE-RUN"; step 4 runs for real: counter 4, rows 7 and 8 SAVED, AGENT
    COMPLETE.

## 08 What you get

- **2:43** No saved LLM call is paid for twice, and no saved step runs again.
  Plus retries, human waits and full visibility.
  - Visuals: "43% less LLM spend in this example", "4 vs 7 LLM calls", then 4
    tiles: Saved steps reused / Automatic retries / Waits for humans / Full
    visibility.

## 09 What you can build

- **2:53** Lunch with Marie is one example: any agent that works through many
  steps needs Durable Execution.
  - Visuals: 4 use-case tiles pop in one at a time, each with its examples
    in slate under the label: DEEP RESEARCH (magnifier) "hours of reading,
    one report" / MULTI-AGENT (a lead bot linked to two helpers) "a lead
    agent and its helpers" / CHATBOTS (bot) "acts once a person approves" /
    BACKGROUND AGENTS (clock) "watch for days, then act".
- **3:00** Deep research, multi-agent teams, chatbots with human approval,
  background agents: all survive crashes.
  - Visuals: The full row; each tile lights up in turn as the subtitle
    names it.

## Outro

- **3:09** Durable AI agents keep their progress and your budget.
  - Visuals: LLM orb, title "Durable AI Agents", tagline "KEEP THEIR
    PROGRESS AND YOUR BUDGET", Temporal logo.
