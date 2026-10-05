---
name: "Agent Harness video: audience and story"
description: "agent-harness theme: developer audience, seven topics, travel-agent example, SDK names, source of truth"
type: project
---

# Agent Harness video: audience and story

Scope: the `agent-harness` theme. The 3:00 limit applies, as for every
theme.

The video presents Temporal Agent Harness, an experimental, open-source
project from Temporal, to **developers and technical leads** who know what an
AI agent is (a model, tools and a loop) but not necessarily Temporal. It
teaches seven topics, one chapter each, in this order:

1. the harness wraps the agentic loop written with your own AI SDK and runs
   every agent as a durable Temporal Workflow;
2. crash recovery mid-turn: saved results are reused, no token paid twice,
   no tool run twice;
3. human approvals: a policy gates tool calls, a gated call waits durably
   for minutes or days, auto mode approves routine calls and escalates the
   rest;
4. one standardized event stream for every agent, watched live or replayed;
5. typed, self-describing agents driven by other agents as tools;
6. Code Mode: the model writes a script over its tools, every call inside
   stays durable, approved and visible;
7. callback tools and typed React and Svelte SDKs for product UIs.

- Running example: a travel agent planning a trip to Lisbon, with the
  harness's real example tool names in code font: `search_flights`,
  `search_hotels`, `book_flight`, `book_hotel`.
- Vocabulary: the runtime is "the app", as in
  [On-screen vocabulary](feedback_vocabulary.md); the SDKs are "OpenAI
  Agents SDK", "Google Gen AI SDK" and "Pydantic AI"; subtitles name
  features by what they do, never by API names (`@agent.accepts`,
  `run_tool`).
- Source of truth for every claim: the `temporal-agent-harness` repository
  (`README.md` and `docs/internal/what-the-harness-adds.md`).

**Why:** the harness is a developer tool; its value is the set of features
it adds around an agent loop the developer already owns, so the video tours
those features with one concrete example and makes no claim the project's
own docs do not support.

**How to apply:** keep the seven topics, their order and the travel example
when editing the theme; check any new subtitle against the harness docs and
the vocabulary above.
