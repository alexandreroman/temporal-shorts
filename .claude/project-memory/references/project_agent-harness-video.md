---
name: "Agent Harness video: audience and story"
description: "agent-harness theme: developer audience, travel example, SDK names, claims backed by the harness docs, pans"
type: project
---

# Agent Harness video: audience and story

Scope: the `agent-harness` theme. Its seven topics, their order and every
subtitle live in `docs/agent-harness/script.md`.

- Audience: **developers and technical leads** who know what an AI agent is
  (a model, tools and a loop) but not necessarily Temporal.
- The turn is a core concept: the harness runs the outer turn loop (a
  message starts a turn, the developer's agentic loop runs inside it, the
  reply streams back, the harness waits for the next message). Chapter 1
  introduces it; later chapters build on it ("mid-turn", "in one turn").
- Pacing: every scene takes its time: about 1.5 s before the first
  subtitle, each animation state readable for at least ~1.5 s, each
  subtitle's result held at least 2 s before the next one, and about 2 s on
  the final composition before the fade.
- Chapter 5 shows subagents as the harness runs them: the parent starts a
  child workflow instance (`start_travel`), sends it typed messages, then
  closes it (`stop_travel`); the parent messages it through its generated
  `travel_plan_trip` tool; a child never outlives its parent.
- Running example: a travel agent planning a 3-night trip to Lisbon, with
  the harness's real example tool names in code font (`search_flights`,
  `search_hotels`, `book_flight`, `book_hotel`) and one set of figures
  across chapters: $480 flight, $390 hotel, $25 tour, $895 trip total.
- Vocabulary: the runtime is "the app", as in
  [On-screen vocabulary](feedback_vocabulary.md); the SDKs are "OpenAI
  Agents SDK", "Google Gen AI SDK" and "Pydantic AI"; subtitles name
  features by what they do, never by API names.
- Accuracy: every claim, on-screen code and UI detail matches what the
  harness does and documents, e.g. approval rules list exact tool names
  (no wildcards) and on-screen Python is valid as written. Source of truth:
  https://github.com/temporal-community/temporal-agent-harness (`README.md`,
  `docs/internal/what-the-harness-adds.md`, `docs/internal/core-concepts.md`).
- Centering: chapter scenes are laid out in final coordinates, with no
  `shift` (see
  [Agent Harness layout grid](feedback_agent-harness-layout-grid.md));
  chapter 1 eases with `pan()` while its SDK tags fade, chapter 4 while its
  console slides in, and chapter 7 while its UI window enters.

**Why:** the audience writes code and will spot an invented feature or
broken snippet; one example with consistent figures keeps the chapters
connected.

**How to apply:** check new subtitles, labels and code against the harness
docs and these rules before building frames.
