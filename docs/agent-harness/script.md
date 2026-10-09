# Script and timeline: Temporal Agent Harness

Subtitles are the only narration (no audio). Each subtitle lasts as long
as its text needs (`autoDur` in `src/engine.js`), plus its `after` pause.
Run `make timeline THEME=agent-harness` for the live values; the start
times below are a snapshot from 2026-10-09.

Each entry gives the subtitle start time and its exact text, then what the
animation shows.

## Audience and goal

The video presents Temporal Agent Harness, an experimental, open-source
project from Temporal: a Temporal-native harness that runs AI agents as
durable Temporal Workflows while their authors keep writing the agentic loop
with the AI SDK they already use (OpenAI Agents SDK, Google Gemini,
Pydantic AI today; Google ADK, Strands Agents and LangGraph planned).

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
   finished model call is paid again and no finished tool reruns;
3. human-in-the-loop approvals: a policy decides which tool calls need a
   person; a gated call waits durably, for minutes or days; auto mode lets
   code or a model approve routine calls, deny others outright (the tool
   never runs, the model is told why), and escalate the rest to a person;
4. one standardized event stream for every agent, whatever its SDK, to watch
   live or replay;
5. typed, self-describing agents that other agents call as tools;
6. Code Mode: the model writes a script over its tools, and every call inside
   stays durable, gated and visible;
7. callback tools that run where the agent can't reach (the user's laptop,
   a private network) while the agent waits durably for their result,
   without holding compute;
8. typed sessions: TypeScript types generated from the agent's Python class
   (its state and its message handlers), then typed React and Svelte SDKs
   that put the agent in a live, typed session in your UI.

The running example is a travel agent, as in the harness's own examples:
`search_flights`, `search_hotels`, `book_flight`, `book_hotel`, a trip to
Lisbon.

## Intro

- **0:02** Meet Temporal Agent Harness: an experimental project to build
  durable AI agents on Temporal.
  - Visuals: Temporal logo, kicker "AN EXPERIMENTAL PROJECT", title
    "Temporal Agent Harness", tagline "DURABLE AI AGENTS, WITH THE SDKS
    YOU ALREADY USE"; on the right an LLM orb inside a slowly turning dashed
    UV ring (the harness) carrying four capability icons (retry, person,
    eye, layers).

## 01 An agent harness

- **0:12** An AI agent is a model, plus tools, plus a loop. You write that
  loop with the AI SDK you already know.
  - Visuals: "YOUR AGENTIC LOOP", the loop of the `durable-ai-agents`
    video: THINK orb on top, ACT and OBSERVE tiles below, joined by three
    curved arrows, a neon token travelling round the loop, each node
    swelling as it passes; under it, two rows of equal-width SDK tags:
    AVAILABLE: OPENAI AGENTS SDK / GOOGLE GEMINI / PYDANTIC AI, then
    PLANNED, dashed and dimmed: STRANDS AGENTS / GOOGLE ADK / LANGGRAPH,
    GOOGLE ADK under GOOGLE GEMINI.
- **0:22** The harness doesn't replace your loop, it wraps it: every agent
  runs as a durable Temporal Workflow.
  - Visuals: both rows of SDK tags fade; a UV frame draws around the loop,
    headed by the Temporal logo and "AGENT HARNESS", with a "TEMPORAL
    WORKFLOW" pill on its bottom edge; the label becomes "YOUR LOOP", the
    token keeps turning.
- **0:30** A message starts a turn: the harness runs your loop, streams the
  reply, then waits for the next message.
  - Visuals: MESSAGES on the left, REPLIES on the right of the frame; "Plan
    a trip to Lisbon, 3 nights" enters the frame and opens TURN 1 (RUNNING,
    "RUN BY THE HARNESS"); the loop makes a lap; the AGENT reply "Your
    trip: flight $480, hotel $390." is typed word by word and TURN 1 shows
    ENDED; the loop dims: "WAITING FOR THE NEXT MESSAGE".
- **0:40** The next message opens turn 2. The agent stays alive between
  turns, with its state intact.
  - Visuals: "Add a city tour" opens TURN 2, the loop laps again, "Added:
    Tram 28 tour $25. Total $895." is typed under the first reply and TURN 2
    shows ENDED.
- **0:48** Each model or tool call is one step. A turn runs until the agent
  is idle: often many steps.
  - Visuals: the frame gives way to a comparison: A MODEL CALL, ONE STEP
    (`text in` → Model → `text out`, deliberately short) above A TURN, UNTIL
    THE AGENT IS IDLE AGAIN: from the user message to the reply, Model,
    `search_flights`, Model, `search_hotels`, Model appear one by one,
    linked in a wave.
- **0:58** The harness saves each call as it completes, and streams every
  step of the turn live.
  - Visuals: as each call gets SAVED, the violet stream link to it draws and
    the chip lights; a bracket under the whole turn reads STREAMED LIVE,
    REPLAYABLE.
- **1:07** It adds what is painful to build yourself: crash recovery,
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
    sends a MODEL CALL or TOOL CALL card to the EVENT HISTORY of the
    TEMPORAL panel (outside the app), where its row appears with SAVED
    (Model: plan the trip / search_flights: 3 flights found); MODEL CALLS
    BILLED counts the model steps.
- **1:27** The next step starts only after the previous result is saved,
  outside the app.
  - Visuals: steps 3 and 4 run the same way (Model: pick the $480 flight /
    book_flight: booked, $480), each starting once the previous row shows
    SAVED; MODEL CALLS BILLED 2, FLIGHTS BOOKED 1.
- **1:34** If the app crashes mid-turn, another copy picks up the agent
  exactly where it left off.
  - Visuals: step 5 starts; just before the crash, A's border and status
    flicker red and its chip jitters; then flash + shake of the app side
    only, a red bolt strikes A's panel, A turns red (CRASHED) and its chip
    falls; then an "APP CRASH" tag stands in the panel; Temporal stays
    still, with "APP CRASHED HERE" under row 4 and the saved rows tinted.
    Bolt and tag leave with A's status, then A, a dead machine, greys,
    drops and fades out. A new APP INSTANCE B (IDLE) slides in from the left
    to the same place, its border glowing violet, the step tiles clear, and
    a NEW INSTANCE tag pops in where APP CRASH stood. A violet AGENT
    WORKFLOW card flies from the first history row to its status, which
    turns TAKING OVER; the tag fades.
- **1:41** Instance B replays the history: steps 1 to 4 return their saved
  results, then step 5 runs for real.
  - Visuals: B's violet glow fades, then rows 1 to 4 are handed back one by
    one (REUSED, "STEP n: FROM THE HISTORY"), the steps re-check without
    running, the counters show NOT RE-BILLED / NOT RE-RUN; step 5 then runs
    and is SAVED (Model: write the reply).
- **1:51** Saved results are reused, not redone: no finished model call is
  paid again, no finished tool reruns.
  - Visuals: tags "REUSED, NOT RE-BILLED" (model rows) and "REUSED, NOT
    RE-RUN" (tool rows); counters glow: MODEL CALLS BILLED 3 "NOT 5",
    FLIGHTS BOOKED 1 "ONLY ONCE"; TURN COMPLETE.

## 03 Human approvals

- **2:02** Some tool calls need a person's OK first, like a payment. The
  approval policy decides which ones.
  - Visuals: the AGENT sends tool calls along a lane through the APPROVAL
    POLICY gate and its RULES (`search_flights` ALLOW, `search_hotels`
    ALLOW, everything else ASK) to TOOLS: `search_flights` and
    `search_hotels` are ALLOWED; `book_flight $480` stops at the gate:
    NEEDS APPROVAL.
- **2:11** The call pauses inside the Workflow, for minutes or days, then
  resumes as soon as someone approves.
  - Visuals: pause badge, DURABLE WAIT clock racing from "5 MIN" to "2
    DAYS", a request line to YOU; APPROVE is pressed, the call becomes
    APPROVED, passes the gate and runs: BOOKED.
- **2:21** Auto mode lets code or a model approve routine calls, judged
  against criteria you define.
  - Visuals: an AUTO MODE judge docks on the gate with its rules "approve:
    hotel under $500" and "deny: hotel over $5,000"; `book_hotel $390`
    parks while the judge works (UV), then the approve rule lights, and the
    call is AUTO-APPROVED and runs.
- **2:29** It can also deny a call, like a $6,800 suite: the tool never runs
  and the model is told why.
  - Visuals: `book_hotel $6,800` parks while the judge works; the judge
    turns red, the deny rule lights, and the call turns red with a DENIED
    tag; it never reaches TOOLS: it slides back along the lane into the
    AGENT under a red "REASON SENT TO THE MODEL" cue, and the agent thinks.
- **2:36** Calls it escalates, like a $2,400 hotel, still go to a human.
  - Visuals: `book_hotel $2,400` parks, is ESCALATED (matching neither
    rule) and drops to YOU.

## 04 One event stream

- **2:47** Every agent publishes the same event stream: turns, model calls,
  tool calls, approvals and token usage.
  - Visuals: three agents (OpenAI Agents SDK, Google Gemini, Pydantic AI)
    emit typed event chips (TURN, MODEL, TOOL, APPROVAL, TOKENS) that
    merge into one AGENT EVENT STREAM lane: "SAME EVENTS FOR EVERY AGENT".
- **2:55** Watch an agent live: each event shows up in the console as soon
  as it happens.
  - Visuals: the view pans to a CONSOLE fed by the lane; seven event rows
    appear one by one under a LIVE badge.
- **3:03** Or replay it afterward: exactly what it did, what it cost and
  where a human stepped in.
  - Visuals: the badge switches to REPLAY, the playhead rewinds and sweeps
    the rows again; "approved by a human" gets a HUMAN tag and the TURN row
    "turn total · 2,140 tokens" a COST tag.

## 05 Typed, composable agents

- **3:13** An agent is more than text in, text out: it exposes typed
  operations, with their inputs and outputs.
  - Visuals: "TEXT IN, TEXT OUT" struck out in red on the left; the
    TravelAgent card on the right lists its OPERATIONS, INPUT then
    OUTPUT: `plan_trip(request: PlanTrip) → Itinerary`,
    `set_budget(budget: Budget) → Ack`.
- **3:21** Other agents read that interface and add its operations to their
  own tools.
  - Visuals: SELF-DESCRIBING tag; the struck pill gives way to a Trip
    planner agent with its TOOLS (`search_web`); a dashed arrow "READS ITS
    INTERFACE" arches from TravelAgent to the Trip planner, and
    `travel_plan_trip`, the tool generated from `plan_trip`, joins its
    tools, tagged "FROM TravelAgent"; the Trip planner is the PARENT AGENT.
- **3:29** To use it, the parent starts TravelAgent as a child workflow: a
  new instance with its own history.
  - Visuals: a `start_travel` call travels from the parent to TravelAgent,
    which lights up and gets a CHILD WORKFLOW tag; under it, "INSTANCE
    7c2e91-3f9a1c" (the parent's id plus a fresh hex segment) with a
    STARTED tag.
- **3:37** A typed request goes in, TravelAgent does the work, and a typed
  result comes back.
  - Visuals: a TYPED REQUEST (`PlanTrip`, `destination: "Lisbon"`,
    `nights: 3`) travels to TravelAgent, whose row works, and a TYPED
    RESULT (`Itinerary`, `total_usd: 895`) comes back: the tool row checks.
- **3:45** When its work is done, the parent closes the instance: a subagent
  never outlives its parent.
  - Visuals: a `stop_travel` call travels to TravelAgent; its tag turns
    CLOSED and the card dims, while the parent keeps its checked tool row.

## 06 Code Mode

- **3:55** Without Code Mode, the model calls its tools one at a time: one
  round trip per call.
  - Visuals: only the left zone, WITHOUT CODE MODE: a model calls its three
    tool tiles (FLIGHTS, HOTELS, BOOKING) one after the other, a "call" card
    going out to each tool and a "result" card coming back; the counter
    under them goes 1, 2, 3 ROUND TRIPS and holds.
- **4:03** With Code Mode, the model writes a short Python script instead.
  - Visuals: the left zone dims (its counter stays readable) and a thin
    vertical divider draws down between the zones; on the right, WITH CODE
    MODE: a SCRIPT WRITTEN BY THE MODEL is typed, in the shape the harness
    asks for (an async `main()` run by `asyncio.run(main())`, results read
    as dicts): `asyncio.gather` of `search_flights(destination="LIS")` and
    `search_hotels(city="Lisbon")`, `min` by `f["price_usd"]`,
    `return await book_flight(best)`.
- **4:12** Parallel calls and the logic between them run inside the
  script, as one tool call.
  - Visuals: the script runs: both searches run at once and are SAVED;
    "best: $480" on the `min` line.
- **4:19** Every call stays durable, gated and visible, and the whole
  script takes one round trip, not three.
  - Visuals: `book_flight` passes an APPROVAL gate (APPROVED), runs and is
    SAVED; on the bottom line, 1 ROUND TRIP appears under WITH CODE MODE,
    level with 3 ROUND TRIPS across the divider (the dimmed count lights up
    again), then EVERY CALL: DURABLE / GATED / VISIBLE beside it.

## 07 Callback tools

- **4:30** Callback tools run where the agent can't reach, like the user's
  laptop or a private network.
  - Visuals: one centered column: THE APP (agent on a Temporal worker)
    above USER'S LAPTOP, joined by a straight dashed line;
    `read_file "trip.md"` travels down it to the laptop, which starts
    running it.
- **4:37** The agent waits durably for the result, for seconds or days,
  without tying up compute.
  - Visuals: the app tile dims, a pause badge beside the agent; a DURABLE
    WAIT card slides out under the app, its clock racing from "5 SEC" to "2
    DAYS", with a NO COMPUTE HELD tag; the laptop finishes, the card slides
    back and `result "Lisbon, 3 nights"` travels up the line into the app,
    which lights again.

## 08 Typed sessions

- **4:47** The harness generates TypeScript types from your agent's Python
  class: its state and its messages.
  - Visuals: YOUR AGENT, one centered column: a `travel_agent.py` card
    (PYTHON) holds `class Trip(HarnessState)` with `items: list[Item] = []`
    and `total_usd: int = 0`, then `@agent.defn class TravelAgent` with
    `trip = agent.state(Trip)` and an `@agent.accepts` handler
    `async def plan_trip(self, request: PlanTrip) -> Itinerary: ...`; a
    GENERATED TYPES arrow leads down to a `client_sdk/TravelAgent.ts` card
    (GENERATED): `export interface Trip { items: Item[]; total_usd:
    number; }` and `export interface TravelAgent { initData: null;
    handlers: { plan_trip: { input: PlanTrip; output: Itinerary } };
    states: { trip: Trip }; }` (the shape `harness-codegen` writes,
    `initData` null for an agent without init data); matching lines light
    up pair by pair: the Trip model, the observable state, the `plan_trip`
    handler.
- **4:56** Typed React and Svelte SDKs turn your agent into a live, typed
  session inside your product UI.
  - Visuals: the view pans; YOUR UI: a trip planner in a browser window
    ("Lisbon, 3 nights", flight, hotel, tour, TOTAL $895, Book), linked to
    the TypeScript card by a TYPED SESSION; the rows light up with a
    `trip.items` badge and the total gets a `trip.total_usd` badge, each
    lighting its field in the TypeScript card; a TYPED SDKS row: REACT /
    SVELTE.

## 09 What you get

- **5:08** Durable, observable, composable agents with human approvals,
  built with the AI SDKs you already use.
  - Visuals: six recap tiles, the main features, land one by one: Survives
    crashes / Event stream / Typed subagents / Human approvals / Code Mode /
    Your AI SDK.

## Outro

- **5:19** Temporal Agent Harness is experimental and open source. Try the
  examples and build your own agents.
  - Visuals: LLM orb, title "Temporal Agent Harness", tagline "YOUR LOOP
    AND YOUR SDKS, RUN DURABLY BY TEMPORAL", violet "EXPERIMENTAL" pill,
    Temporal logo.
