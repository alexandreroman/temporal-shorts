# Script and timeline: Temporal Agent Harness (English)

Subtitles are the only narration (no audio). Timings are computed in
`src/engine.js` from text length (`autoDur`: chars / 16 + 0.6 s, clamped
2.4 to 8 s), plus per-subtitle `after` pauses. Run
`make timeline THEME=agent-harness` for the live values; the start times
below are a snapshot from 2026-10-06.

Each entry gives the subtitle start time and its exact text, then what the
animation shows.

## Audience and goal

The video presents Temporal Agent Harness, an experimental, open-source
project from Temporal: a Temporal-native harness that runs AI agents as
durable Temporal Workflows while their authors keep writing the agentic loop
with the AI SDK they already use (OpenAI Agents SDK, Google Gen AI SDK,
Pydantic AI).

The audience is developers and technical leads who know what an AI agent is
(a model, tools and a loop, as told in the `durable-ai-agents` video) but not
necessarily Temporal. The video stays concrete and light on jargon: it names
the harness features through what they do for an agent, never through API
names, and it always calls the program running the agent "the app".

The video teaches, in order:

1. the harness wraps the agentic loop you write with your own AI SDK, runs
   every agent as a durable Temporal Workflow, and drives it turn by turn:
   a message starts a turn, your loop runs inside it, the reply streams
   back;
2. crash recovery mid-turn: saved model and tool results are reused, so no
   token is paid twice and no tool runs twice;
3. human-in-the-loop approvals: a policy decides which tool calls need a
   person; a gated call waits durably, for minutes or days; auto mode lets
   code or a model approve routine calls and escalates the rest;
4. one standardized event stream for every agent, whatever its SDK, to watch
   live or replay;
5. typed, self-describing agents that other agents call as tools;
6. Code Mode: the model writes a script over its tools, and every call inside
   stays durable, approved and visible;
7. callback tools and typed React and Svelte SDKs, for real products.

The running example is a travel agent, as in the harness's own examples:
`search_flights`, `search_hotels`, `book_flight`, `book_hotel`, a trip to
Lisbon.

## Intro

- **0:02** Meet Temporal Agent Harness: an experimental project to build
  durable AI agents on Temporal.
  - Visuals: Temporal logo, kicker "AN EXPERIMENTAL PROJECT", title
    "Temporal Agent Harness", violet line "DURABLE AI AGENTS, WITH THE SDKS
    YOU ALREADY USE"; on the right an LLM orb inside a slowly turning dashed
    UV ring (the harness) carrying four capability icons (retry, person,
    eye, layers).

## 01 An agent harness

- **0:12** An AI agent is a model, plus tools, plus a loop. You write that
  loop with the AI SDK you already know.
  - Visuals: "YOUR AGENTIC LOOP": MODEL orb, Flights and Hotels tiles joined
    by three curved arrows, a neon token travelling round the loop; tags
    OPENAI AGENTS SDK / GOOGLE GEN AI SDK / PYDANTIC AI.
- **0:21** The harness doesn't replace your loop, it wraps it: every agent
  runs as a durable Temporal Workflow.
  - Visuals: the SDK tags fade; a UV frame draws around the loop, headed by
    the Temporal logo and "AGENT HARNESS", with a "TEMPORAL WORKFLOW" pill
    on its bottom edge; the label becomes "YOUR LOOP", the token keeps
    turning.
- **0:29** A message starts a turn: the harness runs your loop, streams the
  reply, then waits for the next message.
  - Visuals: MESSAGES on the left, REPLIES on the right of the frame; "Plan
    a trip to Lisbon, 3 nights" enters the frame and opens TURN 1 (RUNNING,
    "RUN BY THE HARNESS"); the loop makes a lap; the AGENT reply "Your
    trip: flight $480, hotel $390, tour $25." is typed word by word and
    TURN 1 shows ENDED; the loop dims: "WAITING FOR THE NEXT MESSAGE".
- **0:39** The next message opens turn 2. The agent stays alive between
  turns, with its state intact.
  - Visuals: "Make it 4 nights" opens TURN 2, the loop laps again, "Updated:
    4 nights, hotel $520." is typed under the first reply and TURN 2 shows
    ENDED.
- **0:47** An LLM call is one step. A turn is the whole job behind one
  message: often many model and tool calls.
  - Visuals: the frame gives way to a comparison: AN LLM CALL, ONE STEP
    (`text in` → Model → `text out`) above A TURN, THE WHOLE JOB BEHIND ONE
    MESSAGE: from the user message to the reply, Model, `search_flights`,
    Model, `search_hotels`, Model appear one by one, linked in a wave.
- **0:57** The harness saves each call as it completes, and streams the
  whole turn as one unit.
  - Visuals: each call gets SAVED in turn; violet arrows retrace the whole
    turn and a bracket under it reads STREAMED AS ONE TURN.
- **1:05** It adds what is painful to build yourself: crash recovery,
  approvals, observability, composition.
  - Visuals: the harness frame returns; four capability tiles plug into the
    frame in subtitle order, two on each side, aligned with the frame's top
    and bottom edges: Crash recovery / Human approvals / Observability /
    Composition.

## 02 Survives crashes

- **1:18** Every model call and tool call is saved in the agent's Temporal
  history as soon as it completes.
  - Visuals: five step tiles (PLAN, SEARCH FLIGHTS, PICK, BOOK FLIGHT,
    REPLY); APP INSTANCE A works on step 1, then step 2: each finished step
    sends a RESULT card to the EVENT HISTORY of the TEMPORAL panel (outside
    the app), where its row appears with SAVED (Model: plan the trip /
    search_flights: 3 flights found); MODEL CALLS BILLED counts the model
    steps.
- **1:27** The next step starts only after the previous result is saved,
  outside the app.
  - Visuals: steps 3 and 4 run the same way (Model: pick the $480 flight /
    book_flight: booked, $480), each starting once the previous row shows
    SAVED; MODEL CALLS BILLED 2, FLIGHTS BOOKED 1.
- **1:34** If the app crashes mid-turn, another copy picks up the agent
  exactly where it left off.
  - Visuals: step 5 starts, flash + shake, A turns red (CRASHED), "APP
    CRASHED HERE" under row 4 and the saved rows tinted; APP INSTANCE B
    takes over (TAKING OVER).
- **1:41** Instance B replays the history: steps 1 to 4 return their saved
  results, then step 5 runs for real.
  - Visuals: rows 1 to 4 are handed back one by one (REUSED, "STEP n: FROM
    THE HISTORY"), the steps re-check without running, the counters show
    NOT RE-BILLED / NOT RE-RUN; step 5 then runs and is SAVED (Model: write
    the reply).
- **1:51** Saved results are reused, not redone: no token is paid twice, and
  no tool runs twice.
  - Visuals: tags "REUSED, NOT RE-BILLED" (model rows) and "REUSED, NOT
    RE-RUN" (tool rows); counters glow: MODEL CALLS BILLED 3 "NOT 5",
    FLIGHTS BOOKED 1 "ONLY ONCE"; TURN COMPLETE.

## 03 Human approvals

- **2:01** Some tool calls need a person's OK first, like a payment. The
  approval policy decides which ones.
  - Visuals: the AGENT sends tool calls along a lane through the APPROVAL
    POLICY gate and its RULES (`search_flights` ALLOW, `search_hotels`
    ALLOW, everything else ASK) to TOOLS: `search_flights` and
    `search_hotels` are ALLOWED; `book_flight $480` stops at the gate:
    NEEDS APPROVAL.
- **2:10** The call pauses inside the Workflow, for minutes or days, then
  resumes as soon as someone approves.
  - Visuals: pause badge, DURABLE WAIT clock racing from "5 MIN" to "2
    DAYS", a request line to YOU; APPROVE is pressed, the call becomes
    APPROVED, passes the gate and runs: BOOKED.
- **2:20** Auto mode lets code or a model approve routine calls, judged
  against criteria you define.
  - Visuals: an AUTO MODE judge docks on the gate with its rule "approve:
    hotel under $500"; `book_hotel $210` parks while the judge works, then
    is AUTO-APPROVED and runs.
- **2:28** Anything unclear, like a $2,400 hotel, still goes to a human.
  - Visuals: `book_hotel $2,400` parks, is ESCALATED and drops to YOU.

## 04 One event stream

- **2:37** Every agent publishes the same event stream: turns, model calls,
  tool calls, approvals and token usage.
  - Visuals: three agents (OpenAI Agents SDK, Google Gen AI SDK, Pydantic
    AI) emit typed event chips (TURN, MODEL, TOOL, APPROVAL, TOKENS) that
    merge into one AGENT EVENT STREAM lane: "SAME EVENTS FOR EVERY AGENT".
- **2:46** Watch an agent live: each event shows up in the console as soon
  as it happens.
  - Visuals: the view pans to a CONSOLE fed by the lane; seven event rows
    appear one by one under a LIVE badge.
- **2:53** Or replay it afterward: exactly what it did, what it cost and
  where a human stepped in.
  - Visuals: the badge switches to REPLAY, the playhead rewinds and sweeps
    the rows again; "approved by a human" gets a HUMAN tag and "turn ended
    · 2,140 tokens" a COST tag.

## 05 Typed, composable agents

- **3:04** An agent is more than text in, text out: it exposes typed
  operations, with their inputs and outputs.
  - Visuals: "TEXT IN, TEXT OUT" struck out in red on the left; the
    TravelAgent card on the right lists its OPERATIONS, INPUT then
    OUTPUT: `plan_trip(destination: str, nights: int) → Itinerary`,
    `set_budget(max_usd: float) → Ack`.
- **3:12** Other agents read that interface and add its operations to their
  own tools.
  - Visuals: SELF-DESCRIBING tag; the struck pill gives way to a Trip
    planner agent with its TOOLS (`search_web`); a dashed arrow "READS ITS
    INTERFACE" arches from TravelAgent to the Trip planner, and `plan_trip`
    joins its tools, tagged "FROM TravelAgent".
- **3:20** A typed request goes in, TravelAgent does the work, and a typed
  result comes back.
  - Visuals: a TYPED REQUEST (`plan_trip`, `destination: "Lisbon"`,
    `nights: 3`) travels to TravelAgent, whose row works, and a TYPED
    RESULT (`Itinerary`, `total_usd: 895`) comes back: the tool row checks.

## 06 Code Mode

- **3:30** With Code Mode, the model writes a short Python script instead of
  calling tools one at a time.
  - Visuals: ONE CALL AT A TIME: a model and three tool tiles ping-pong six
    times (6 ROUND TRIPS), then dim; CODE MODE: a SCRIPT WRITTEN BY THE
    MODEL is typed: `asyncio.gather(search_flights, search_hotels)`, `min`
    by price, `book_flight(best)`.
- **3:39** Loops, conditions and parallel calls all run inside the script,
  in one turn.
  - Visuals: the script runs: both searches run at once and are SAVED;
    "best: $480" on the `min` line.
- **3:46** Every call stays durable, approved and visible, and the whole
  script takes one round trip, not six.
  - Visuals: `book_flight` passes an APPROVAL gate (APPROVED), runs and is
    SAVED; under the dimmed side, "6 ROUND TRIPS vs 1 ROUND TRIP"; EVERY
    CALL: DURABLE / APPROVED / VISIBLE.

## 07 Built for real products

- **3:58** Callback tools run on the user's own device: the agent asks, the
  laptop runs the tool and replies.
  - Visuals: CALLBACK TOOLS: THE APP (agent on a Temporal worker) sends
    `read_file "trip.md"` to the USER'S LAPTOP, which runs it and sends the
    result back.
- **4:06** Typed React and Svelte SDKs turn your agent into a live, typed
  session inside your product UI.
  - Visuals: the view pans; YOUR UI: a trip planner in a browser window
    ("Lisbon, 3 nights", flight, hotel, tour, TOTAL $895, Book), linked by
    a TYPED SESSION; a TYPED SDKS row: REACT / SVELTE.
- **4:14** Durable, observable, composable agents with human approvals,
  built with the AI SDKs you already use.
  - Visuals: six recap tiles, one per chapter, as the subtitle names them:
    Survives crashes / Event stream / Typed subagents / Human approvals /
    Code Mode / Your AI SDK.

## Outro

- **4:24** Temporal Agent Harness is experimental and open source. Try the
  examples and build your own agents.
  - Visuals: LLM orb, takeaway title "Your agent, harnessed", violet line
    "YOUR LOOP AND YOUR SDKS, RUN DURABLY BY TEMPORAL", EXPERIMENTAL tag,
    Temporal logo.
