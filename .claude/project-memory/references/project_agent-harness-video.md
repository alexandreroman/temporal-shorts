---
name: "Agent Harness video: audience and story"
description: "agent-harness theme: developer audience, travel example, SDK names, claims backed by the harness docs, pans"
type: project
---

# Agent Harness video: audience and story

Scope: the `agent-harness` theme. Its seven topics, their order and every
subtitle live in `docs/agent-harness/script.md`; the 3:00 limit applies, as
for every theme.

- Audience: **developers and technical leads** who know what an AI agent is
  (a model, tools and a loop) but not necessarily Temporal.
- The turn is a core concept: the harness runs the outer turn loop (a
  message starts a turn, the developer's agentic loop runs inside it, the
  reply streams back, the harness waits for the next message). Chapter 1
  introduces it; later chapters build on it ("mid-turn", "in one turn").
- Pacing: chapter scenes leave time to understand: a beat before the first
  subtitle, ~1 s of rest after each dense animation, and a hold on the
  final composition before the fade; the video still stays ≤ 3:00.
- Running example: a travel agent planning a 3-night trip to Lisbon, with
  the harness's real example tool names in code font (`search_flights`,
  `search_hotels`, `book_flight`, `book_hotel`) and one set of figures
  across chapters ($480 flight, $895 trip total).
- Vocabulary: the runtime is "the app", as in
  [On-screen vocabulary](feedback_vocabulary.md); the SDKs are "OpenAI
  Agents SDK", "Google Gen AI SDK" and "Pydantic AI"; subtitles name
  features by what they do, never by API names.
- Accuracy: every claim, on-screen code and UI detail matches what the
  harness does and documents, e.g. approval rules list exact tool names
  (no wildcards) and on-screen Python is valid as written. Source of truth:
  https://github.com/temporal-community/temporal-agent-harness (`README.md`,
  `docs/internal/what-the-harness-adds.md`, `docs/internal/core-concepts.md`).
- Centering: chapter scenes are laid out in final coordinates with
  `shift: [0, 0]` (see
  [Agent Harness layout grid](feedback_agent-harness-layout-grid.md));
  chapter 1 eases with `pan()` while its SDK tags fade, and chapter 4 while
  its console slides in.

**Why:** the audience writes code and will spot an invented feature or
broken snippet; one example with consistent figures keeps the chapters
connected.

**How to apply:** check new subtitles, labels and code against the harness
docs and these rules before building frames.
