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

- [Durable AI Agents: objective and audience](references/project_objective.md) — 7 topics, non-technical audience, budget message
- [Durable Execution theme story](references/project_durable-execution-theme.md) — money stake, crash in shipPackage, retry then replay
- [Temporal Web UI reference](references/reference_temporal-web-ui.md) — local dev server UI, dark-mode colors, real page layout
- [Airy layout and consistent details](references/feedback_airy-layout.md) — fill the free band, shared edges, uniform tiles, logo-side labels
- [Agent Harness video: audience and story](references/project_agent-harness-video.md) — developers, travel example, claims match the harness docs
- [Arrow heads in Safari](references/project_arrow-heads-safari.md) — engine `path()` fills heads with the line color, no context-stroke
- [Agent Harness layout grid](references/feedback_agent-harness-layout-grid.md) — content frame x 140-1780, y 150-880, aligned zones
- [Temporal brand rules](references/project_brand.md) — colors, style, Noto Sans Mono + Aeonik stand-in, icons, sources
- [Official Temporal logo](references/reference_logo.md) — official lockup only, cropped viewBox
- [On-screen vocabulary](references/feedback_vocabulary.md) — "the app" for the runtime, company names for LLMs
- [Visual design decisions](references/feedback_visual-design.md) — 20 px clearance, left-aligned 76x56 step-icon memory blocks, ch7 mirrors ch6
- [Subtitle layout](references/feedback_subtitles.md) — 30 px text, box at most 1760 px wide, one line
- [Visual verification workflow](references/feedback_verification.md) — preview inside subtitle windows; animations fit duration + `after`
- [Frame capture noise](references/project_frame-noise.md) — delta-2 specks, render-order diffs on curves only; whole-pixel resting elements
- [Scene centering](references/project_scene-centering.md) — centered at (960, 522), measured shift; durable-ai-agents pans ch1, ch5, ch7
- [Durable AI Agents: chapter 7 story](references/project_durable-ai-agents-story.md) — history outside the app, saved before next step, replay
- [Home page design](references/feedback_home-page.md) — equal stretched cards, count-agnostic grid, card order, no "silent"
- [HTML links and viewing](references/project_html-links.md) — view pages via make serve only; no make open, no file:// fallback
- [GitHub Pages deployment](references/project_github-pages.md) — HTML only, served at a domain root so the home link / holds
- [No video durations in docs](references/feedback_no-durations-in-docs.md) — length is never written; `make timeline` is the source
- [Player 0.5x speed](references/project_player-speed.md) — 0.5x stretches still moments only; ambient loops read G
- [Human-in-the-Loop story](references/project_hitl-story.md) — Sam's laptop, Maria approves; ch3/ch4 mirror DAA ch7; Signal, replay, timers
- [Custom domain](references/project_custom-domain.md) — durable.withtemporal.dev, Cloudflare CNAME to Pages, DNS only, shared zone
