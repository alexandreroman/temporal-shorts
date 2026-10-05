# Project Memory

> When a new decision **contradicts** an existing
> memory note, do NOT silently override it.
> Instead: surface the conflict, quote the
> existing memory, explain how the new decision
> differs, and ask for explicit confirmation
> before updating. **Do NOT take any action** —
> no tool calls, no file writes — until confirmed.

> **Note wording** — state permanent facts in the
> present tense. A note read out of context must
> not reveal what it replaces or what just
> happened. Ban narration markers: "now", "no
> longer", "previously / used to", "reverses /
> replaces", "kept", "changed to", "reintroduce",
> "the user asked to". Phrase prohibitions
> positively ("the API is versioned under /v2"),
> not as the negation of a former state. Test:
> remove the note from its context — if a sentence
> only makes sense knowing the prior state,
> rewrite it.

- [Video objective and audience](references/project_objective.md) — durable-ai-agents: 7 topics, non-technical audience, ≤ 3:00
- [Durable Execution theme story](references/project_durable-execution-theme.md) — order #1042, server then Worker, replay
- [Airy layout and consistent details](references/feedback_airy-layout.md) — fill the free band, shared edges, arrowhead = stroke color, uniform tiles
- [Temporal brand rules](references/project_brand.md) — colors, style, fonts, icons and their source
- [Official Temporal logo](references/reference_logo.md) — official lockup only, cropped viewBox
- [On-screen vocabulary](references/feedback_vocabulary.md) — "the app" for the runtime, company names for LLMs
- [Budget figure](references/project_budget-figure.md) — 4 vs 7 calls, 43%, always "in this example"
- [Visual design decisions](references/feedback_visual-design.md) — 20 px clearance, left-aligned 76x56 step-icon memory blocks, ch7 mirrors ch6
- [Subtitle layout](references/feedback_subtitles.md) — 30 px, 1760 px, one line, no orphan under 3 words
- [Visual verification workflow](references/feedback_verification.md) — preview inside subtitle windows; animations fit duration + `after`
- [Frame capture noise](references/project_frame-noise.md) — row y=65, delta-2 specks, rare re-rasters; native-size resting elements
- [Scene centering](references/project_scene-centering.md) — centered at (960, 522), fixed measured `shift`; `pan()` only in ch1, ch5, ch7
- [Durable Execution story](references/project_durable-execution-story.md) — Temporal keeps history, saved before next step, replay
- [Home page design](references/feedback_home-page.md) — equal stretched cards, count-agnostic grid, card order, no "silent"
- [HTML links and viewing](references/project_html-links.md) — cards link to `themes/<theme>/`, home button to `/`; view pages with `make serve` only
- [No video durations in docs](references/feedback_no-durations-in-docs.md) — length is never written; `make timeline` is the source
- [Player 0.5x speed](references/project_player-speed.md) — 0.5x stretches still moments only; ambient loops read G
- [Human-in-the-Loop story](references/project_hitl-story.md) — Sam's laptop, Maria approves; ch3/ch4 mirror ch7; Signal, replay, timers
