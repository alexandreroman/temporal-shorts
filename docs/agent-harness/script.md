# Script and timeline: Temporal Agent Harness (English, TBD)

Subtitles are the only narration (no audio). Timings are computed in
`src/engine.js` from text length (`autoDur`: chars / 16 + 0.6 s, clamped
2.4 to 8 s), plus per-subtitle `after` pauses. Run
`make timeline THEME=agent-harness` for the live values; the start times
below are a snapshot.

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
`search_flights`, `search_hotels`, `book_flight`, a trip to Lisbon.

## Intro

- **0:01** Meet Temporal Agent Harness: an experimental project to build
  durable AI agents on Temporal.
  - Visuals: Temporal logo, kicker "AN EXPERIMENTAL PROJECT", title
    "Temporal Agent Harness", violet line "DURABLE AI AGENTS, WITH THE SDKS
    YOU ALREADY USE"; on the right an LLM orb inside a slowly turning dashed
    UV ring (the harness) carrying four capability icons.

## 01 An agent harness

- **0:08** An AI agent is a model, plus tools, plus a loop. You write that
  loop with the AI SDK you already know.
  - Visuals: "YOUR AGENT": LLM orb and two tool tiles (Flights, Hotels)
    joined by two curved arrows that form a loop, a neon token travelling
    round it; tags OPENAI AGENTS SDK / GOOGLE GEN AI SDK / PYDANTIC AI.
- **0:15** The harness doesn't replace your loop, it wraps it: every agent
  runs as a durable Temporal Workflow.
  - Visuals: the SDK tags fade; a UV frame draws around the loop, labelled
    "TEMPORAL AGENT HARNESS", with a "TEMPORAL WORKFLOW" pill; the loop keeps
    turning inside, labelled "YOUR LOOP".
- **0:22** It adds what is painful to build yourself: crash recovery,
  approvals, observability, composition.
  - Visuals: four capability tiles plug into the frame in subtitle order:
    Crash recovery / Human approvals / Observability / Composition.

## 02 Survives crashes

- **0:30** Every model call and tool call is saved in the agent's Temporal
  history as soon as it completes.
  - Visuals: a turn of five steps (Model: plan the trip, search_flights,
    Model: pick a flight, book_flight, Model: write the reply) run by APP
    INSTANCE A; each finished step sends a RESULT card to the EVENT HISTORY
    held by Temporal (outside the app), where its row appears with SAVED;
    MODEL CALLS BILLED counts the model steps; FLIGHTS BOOKED shows 1.
- **0:37** If the app crashes mid-turn, another copy picks up the agent
  exactly where it left off.
  - Visuals: step 5 starts, flash + shake, APP INSTANCE A turns red
    (CRASHED); APP INSTANCE B takes over; rows 1 to 4 are handed back from
    the history one by one (REUSED) and the steps re-check without running;
    step 5 then runs for real.
- **0:44** Saved results are reused, not redone: no token is paid twice, and
  no tool runs twice.
  - Visuals: model rows tagged "REUSED, NOT RE-BILLED", tool rows "REUSED,
    NOT RE-RUN"; MODEL CALLS BILLED ends at 3 (not 5), FLIGHTS BOOKED stays
    at 1; TURN COMPLETE.

## 03 Human approvals

- **0:51** Some tool calls need a person's OK first, like a payment. The
  approval policy decides which ones.
  - Visuals: the agent sends tool calls to an APPROVAL POLICY gate:
    `search_flights` and `search_hotels` pass (ALLOWED); `book_flight $480`
    stops at the gate: NEEDS APPROVAL.
- **0:58** The call pauses inside the Workflow, for minutes or days, then
  resumes as soon as someone approves.
  - Visuals: the parked call shows a pause icon and a WAITING clock that
    races from minutes to "2 DAYS" (DURABLE WAIT); a person tile (YOU) with
    APPROVE / DENY; APPROVE is pressed, the call goes through and runs:
    BOOKED.
- **1:05** Auto mode lets code or a model approve routine calls. Anything
  unclear still goes to a human.
  - Visuals: an AUTO MODE judge joins the gate with its rule "approve: hotel
    under $500"; `book_hotel $210` is AUTO-APPROVED; `book_hotel $2,400` is
    ESCALATED and goes to the person.

## 04 One event stream

- **1:12** Every agent publishes the same event stream: turns, model calls,
  tool calls, approvals and token usage.
  - Visuals: three agents tagged with their SDK (OpenAI Agents SDK, Google
    Gen AI SDK, Pydantic AI) emit typed event chips (TURN, MODEL, TOOL,
    APPROVAL, TOKENS) that merge into one stream: "SAME EVENTS FOR EVERY
    AGENT".
- **1:19** Watch an agent live, or replay exactly what it did, what it cost
  and where a human stepped in.
  - Visuals: the stream feeds a console: event rows appear under a LIVE
    badge, then a replay bar rewinds and its playhead sweeps the rows again;
    the approval row ("approved by a human") and the token total stand out.

## 05 Typed, composable agents

- **1:26** An agent is more than text in, text out: it exposes typed
  operations, with their inputs and outputs.
  - Visuals: "TEXT IN, TEXT OUT" crossed out; a TravelAgent card lists its
    operations with typed inputs and outputs: `plan_trip(destination,
    nights) → Itinerary`, `set_budget(max_usd) → Ack`.
- **1:33** It describes itself, so other agents can drive it as a tool:
  multi-agent systems with real contracts.
  - Visuals: a Trip planner agent above a Flights agent and a Hotels agent;
    typed requests travel down the links (`destination: "Lisbon", nights:
    3`), typed results come back up; label TYPED CONTRACT.

## 06 Code Mode

- **1:40** With Code Mode, the model writes a short Python script instead of
  calling tools one at a time.
  - Visuals: on the left, a model and its tools ping-pong one call at a time
    (6 ROUND TRIPS, then dimmed); on the right a script is typed: parallel
    `search_flights` and `search_hotels`, `min` by price, `book_flight`.
- **1:47** Loops, conditions and parallel calls in one turn, and every call
  stays durable, approved and visible.
  - Visuals: the script runs: the two searches fan out at once, the cheapest
    flight is picked, `book_flight` passes the approval gate; each call gets
    SAVED; tags DURABLE / APPROVED / VISIBLE, "1 TURN".

## 07 Built for real products

- **1:54** Callback tools run on the user's own device, and typed React and
  Svelte SDKs power your product UI.
  - Visuals: the agent (on a Temporal worker) asks the user's laptop to read
    a local file and gets the result back; a browser window with a trip
    planner UI, tags REACT / SVELTE, linked to the agent by a TYPED SESSION.
- **2:01** Durable, observable, composable agents with human approvals,
  built with the AI SDKs you already use.
  - Visuals: six recap tiles: Survives crashes / Human approvals / Event
    stream / Typed subagents / Code Mode / Your AI SDK.

## Outro

- **2:08** Temporal Agent Harness is experimental and open source. Try the
  examples and build your own agents.
  - Visuals: LLM orb, title "Temporal Agent Harness", violet line "DURABLE AI
    AGENTS, WITH THE SDKS YOU ALREADY USE", EXPERIMENTAL tag, Temporal logo.
