# Script and timeline: Temporal Agent Harness (English)

Subtitles are the only narration (no audio). Timings are computed in
`src/engine.js` from text length (`autoDur`: chars / 16 + 0.6 s, clamped
2.4 to 8 s), plus per-subtitle `after` pauses. Run
`make timeline THEME=agent-harness` for the live values; the start times
below are a snapshot from 2026-10-05.

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

1. the harness wraps the agentic loop you write with your own AI SDK, and
   runs every agent as a durable Temporal Workflow;
2. crash recovery mid-turn: saved model and tool results are reused, so no
   token is paid twice and no tool runs twice;
3. human-in-the-loop approvals: a policy decides which tool calls need a
   person; a gated call waits durably, for minutes or days; auto mode lets
   code or a model approve routine calls and escalates the rest;
4. one standardized event stream for every agent, whatever its SDK, to watch
   live or replay;
5. typed, self-describing agents that other agents drive as tools;
6. Code Mode: the model writes a script over its tools, and every call inside
   stays durable, approved and visible;
7. callback tools and typed React and Svelte SDKs, for real products.

The running example is a travel agent, as in the harness's own examples:
`search_flights`, `search_hotels`, `book_flight`, `book_hotel`, a trip to
Lisbon.

## Intro

- **0:01** Meet Temporal Agent Harness: an experimental project to build
  durable AI agents on Temporal.
  - Visuals: Temporal logo, kicker "AN EXPERIMENTAL PROJECT", title
    "Temporal Agent Harness", violet line "DURABLE AI AGENTS, WITH THE SDKS
    YOU ALREADY USE"; on the right an LLM orb inside a slowly turning dashed
    UV ring (the harness) carrying four capability icons (retry, person,
    eye, layers).

## 01 An agent harness

- **0:09** An AI agent is a model, plus tools, plus a loop. You write that
  loop with the AI SDK you already know.
  - Visuals: "YOUR AGENTIC LOOP": MODEL orb, Flights and Hotels tiles joined
    by three curved arrows, a neon token travelling round the loop; tags
    OPENAI AGENTS SDK / GOOGLE GEN AI SDK / PYDANTIC AI.
- **0:17** The harness doesn't replace your loop, it wraps it: every agent
  runs as a durable Temporal Workflow.
  - Visuals: the SDK tags fade; a UV frame draws around the loop, headed by
    the Temporal logo and "AGENT HARNESS", with a "TEMPORAL WORKFLOW" pill
    on its bottom edge; the label becomes "YOUR LOOP", the token keeps
    turning.
- **0:25** It adds what is painful to build yourself: crash recovery,
  approvals, observability, composition.
  - Visuals: four capability tiles plug into the frame in subtitle order,
    two on each side: Crash recovery / Human approvals / Observability /
    Composition.

## 02 Survives crashes

- **0:33** Every model call and tool call is saved in the agent's Temporal
  history as soon as it completes.
  - Visuals: five step tiles (PLAN, SEARCH FLIGHTS, PICK, BOOK FLIGHT,
    REPLY); APP INSTANCE A shows the step at work; each finished step sends
    a RESULT card to the EVENT HISTORY of the TEMPORAL panel (outside the
    app), where its row appears with SAVED (Model: plan the trip /
    search_flights: 3 flights found / Model: pick the $480 flight /
    book_flight: booked, $480); MODEL CALLS BILLED 2, FLIGHTS BOOKED 1.
- **0:41** If the app crashes mid-turn, another copy picks up the agent
  exactly where it left off.
  - Visuals: step 5 starts, flash + shake, A turns red (CRASHED), "APP
    CRASHED HERE" under row 4; APP INSTANCE B takes over, rows 1 to 4 are
    handed back one by one (REUSED, "STEP n: FROM THE HISTORY"), the steps
    re-check without running, the counters show NOT RE-BILLED / NOT RE-RUN;
    step 5 then runs for real and is SAVED (Model: write the reply).
- **0:48** Saved results are reused, not redone: no token is paid twice, and
  no tool runs twice.
  - Visuals: tags "REUSED, NOT RE-BILLED" (model rows) and "REUSED, NOT
    RE-RUN" (tool rows); counters glow: MODEL CALLS BILLED 3 "NOT 5",
    FLIGHTS BOOKED 1 "ONLY ONCE"; TURN COMPLETE.

## 03 Human approvals

- **0:55** Some tool calls need a person's OK first, like a payment. The
  approval policy decides which ones.
  - Visuals: the AGENT sends tool calls along a lane through the APPROVAL
    POLICY gate and its RULES (`search_flights` ALLOW, `search_hotels`
    ALLOW, everything else ASK) to TOOLS:
    `search_flights` and `search_hotels` are ALLOWED; `book_flight $480`
    stops at the gate: NEEDS APPROVAL.
- **1:03** The call pauses inside the Workflow, for minutes or days, then
  resumes as soon as someone approves.
  - Visuals: pause badge, DURABLE WAIT clock racing from "5 MIN" to "2
    DAYS", a request line to YOU; APPROVE is pressed, the call becomes
    APPROVED, passes the gate and runs: BOOKED.
- **1:10** Auto mode lets code or a model approve routine calls. Anything
  unclear still goes to a human.
  - Visuals: an AUTO MODE judge docks on the gate with its rule "approve:
    hotel under $500"; `book_hotel $210` is AUTO-APPROVED; `book_hotel
    $2,400` is ESCALATED and goes to YOU.

## 04 One event stream

- **1:19** Every agent publishes the same event stream: turns, model calls,
  tool calls, approvals and token usage.
  - Visuals: three agents (OpenAI Agents SDK, Google Gen AI SDK, Pydantic
    AI) emit typed event chips (TURN, MODEL, TOOL, APPROVAL, TOKENS) that
    merge into one AGENT EVENT STREAM lane: "SAME EVENTS FOR EVERY AGENT".
- **1:26** Watch an agent live, or replay exactly what it did, what it cost
  and where a human stepped in.
  - Visuals: the view pans to a CONSOLE fed by the lane; seven event rows
    appear under a LIVE badge; it switches to REPLAY, the playhead rewinds
    and sweeps the rows again; "approved by a human" gets a HUMAN tag and
    "turn ended · 2,140 tokens" a COST tag.

## 05 Typed, composable agents

- **1:35** An agent is more than text in, text out: it exposes typed
  operations, with their inputs and outputs.
  - Visuals: "TEXT IN, TEXT OUT" struck out in red; the TravelAgent card
    lists its OPERATIONS, INPUT then OUTPUT: `plan_trip(destination: str,
    nights: int) → Itinerary`, `set_budget(max_usd: float) → Ack`.
- **1:42** It describes itself, so other agents can drive it as a tool:
  multi-agent systems with real contracts.
  - Visuals: SELF-DESCRIBING tag; a Trip planner (PARENT AGENT) above
    TravelAgent and CalendarAgent, linked by TYPED CONTRACT lines; a request
    (`plan_trip`, `destination: "Lisbon", nights: 3`) travels down into
    TravelAgent, a result (`Itinerary`, `total_usd: 895`) comes back up,
    the parent checks.

## 06 Code Mode

- **1:51** With Code Mode, the model writes a short Python script instead of
  calling tools one at a time.
  - Visuals: ONE CALL AT A TIME: a model and three tool tiles ping-pong six
    times (ROUND TRIPS 6), then dim; CODE MODE: a SCRIPT WRITTEN BY THE
    MODEL is typed: `asyncio.gather(search_flights, search_hotels)`, `min`
    by price, `book_flight(best)`.
- **1:58** Loops, conditions and parallel calls in one turn, and every call
  stays durable, approved and visible.
  - Visuals: the script runs: both searches fan out at once and check,
    "best: $480", `book_flight` passes an APPROVAL gate (APPROVED) and runs;
    each call SAVED; tags DURABLE / APPROVED / VISIBLE; "6 vs 1 round
    trip".

## 07 Built for real products

- **2:07** Callback tools run on the user's own device, and typed React and
  Svelte SDKs power your product UI.
  - Visuals: CALLBACK TOOLS: THE APP (agent on a Temporal worker) sends
    `read_file "trip.md"` to the USER'S LAPTOP, which runs it and sends the
    result back; YOUR UI: a trip planner in a browser window ("Lisbon, 3
    nights", flight, hotel, tour, TOTAL $895, Book), linked by a TYPED
    SESSION; tags REACT / SVELTE.
- **2:15** Durable, observable, composable agents with human approvals,
  built with the AI SDKs you already use.
  - Visuals: six recap tiles, one per chapter, as the subtitle names them:
    Survives crashes / Event stream / Typed subagents / Human approvals /
    Code Mode / Your AI SDK.

## Outro

- **2:23** Temporal Agent Harness is experimental and open source. Try the
  examples and build your own agents.
  - Visuals: LLM orb, takeaway title "Build durable AI agents", violet line
    "WITH TEMPORAL AGENT HARNESS AND THE SDKS YOU ALREADY USE", EXPERIMENTAL
    tag, Temporal logo.
