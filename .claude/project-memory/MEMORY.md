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

- [Temporal Web UI reference](references/reference_temporal-web-ui.md) — local dev server UI, dark-mode colors, real page layout
- [Arrow heads in Safari](references/project_arrow-heads-safari.md) — engine `path()` fills heads with the line color, no context-stroke
- [Temporal brand rules](references/project_brand.md) — colors, style, Noto Sans Mono + Aeonik stand-in, icons, sources
- [Official Temporal logo](references/reference_logo.md) — official lockup and symbol only, cropped viewBox; corner symbol on chapters
- [Frame capture noise](references/project_frame-noise.md) — delta-2 specks, render-order diffs on curves only; whole-pixel resting elements
- [Home page design](references/feedback_home-page.md) — lockup header, equal cards, count-agnostic grid, order, hover icons, no "silent"
- [HTML links and viewing](references/project_html-links.md) — view pages via make serve only; no make open, no file:// fallback
- [GitHub Pages deployment](references/project_github-pages.md) — HTML only, served at a domain root so the home link / holds
- [Player 0.5x speed](references/project_player-speed.md) — 0.5x stretches still moments only; ambient loops read G
- [Player presenter mode](references/project_player-presenter-mode.md) — no subtitles, 0.5x, holds at cues and fade-outs, arrows move between steps
- [Custom domain](references/project_custom-domain.md) — durable.withtemporal.dev, Cloudflare CNAME to Pages, DNS only, shared zone
- [Social preview images stay current](references/feedback_social-previews.md) — `make social` + commit PNGs on intro, title or home changes
- [Themes: shared anatomy and stories](references/project_theme-anatomy.md) — structure, layout, subtitles, vocabulary, docs, per-theme stories
- [Player time links](references/project_player-time-link.md) — `#t=` opens the player paused there; `?t=` stays frame capture
