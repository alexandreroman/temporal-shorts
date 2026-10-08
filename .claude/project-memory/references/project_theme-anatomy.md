---
name: "Themes: shared anatomy and stories"
description: "Everything about the themes: structure, layout, subtitles, vocabulary, docs, checks, new-theme files, each story"
type: project
---

# Themes: shared anatomy and stories

Every theme is a silent explainer in one series: burned-in subtitles, no
soundtrack, Temporal brand (see [Temporal brand rules](project_brand.md)),
delivered as a 1920x1080 30 fps MP4 plus an SRT. All themes follow the
anatomy below; the story, the running example, the number of chapters and
the visuals belong to each theme (last section).

## Page and home card

- `<title>` is "<card title> with Temporal" ("Durable AI Agents with
  Temporal"); a card title that already contains "Temporal" stands alone
  ("Temporal Agent Harness").
- `<meta name="description">` is one sentence ending with a period, word
  for word the card's `.theme-text`, about the topic.
- Same page skeleton everywhere: `#stage` with `#sky`, `#band`, `#hdr`,
  `#segs`, `#mark`, `#subw > #sub`; scripts `../../engine.js`,
  `../../shared.js`, `shared.js`, scenes `00-intro.js` to `99-outro.js`,
  `../../player.js`, `boot()`.
- `#mark` is the official Temporal symbol
  (`assets/temporal-symbol-light-cropped.svg`), 32x32, left edge on the
  chapter number (x 80), vertically centered on the subtitle box; fixed
  position, also in the live player; fully visible across chapter scenes,
  fading in with the first and out with the last, never on the intro or
  outro. See [Official Temporal logo](reference_logo.md).
- Home card: `a.theme` > `.theme-icon` (24x24 stroke SVG with a comment
  naming what it shows and its hover animation), `.theme-title`,
  `.theme-text`; see [Home page design](feedback_home-page.md).

## Scenes

- One scene per chapter: `00-intro.js`, `01-…` to `NN-…`, `99-outro.js`.
  Line 1 is `// ===================== N. CHAPTER TITLE`, the scene `title`
  in caps (or `INTRO`, `OUTRO`), then the comment "The block keeps every
  name declared in this file local to this scene." and the `{ … }` block.
- Intro: `makeTitleBlock(root, kicker, titleHtml, tagline)` on the left
  (official logo, slate mono kicker, two-line title, violet mono tagline),
  a theme visual on the right, one subtitle. The kicker names the audience
  or format ("AN EXPLAINER FOR EVERYONE", "AN EXPERIMENTAL PROJECT"); the
  title is a question for explainers ("How does an AI agent work?") or
  the product name; the uppercase tagline ties the topic to Temporal. This
  title card is the theme's `social.png`
  ([Social preview images](feedback_social-previews.md)).
- Chapters: `chapter` and `title` drive the `NN / TITLE` header and the
  segment bars; titles are short sentence-case phrases ("When a step
  fails").
- Recap: **What you get** has its own scene file after the topic
  chapters. Recap tiles and subtitles live there, never in a topic
  chapter, so every chapter title stays true to its content.
- Use cases: in durable-execution, human-in-the-loop and
  durable-ai-agents, a **What you can build** chapter follows the recap,
  right before the outro: 4 `useCaseTile`s (icon, label, slate example
  line) land during the first of 2 subtitles ("<running example> is one
  example: any … fits"), each lit as the second names it. agent-harness
  ends on its recap. Topic lists in `script.md` leave out both chapters.
- Outro: `makeEndCard(root, title, tagline, { pill })` in every theme,
  same sizes everywhere: the theme name as title, cased as on its home
  card ("Durable AI Agents"), a violet uppercase tagline stating the
  benefit, an optional violet pill ("Experimental" for agent-harness), the
  official logo, no URL. A small theme visual sits above the title, at
  about the tagline-to-logo gap.
- Pacing: intro `pre: 1.0`, outro `pre: 0.4, post: 2.6` (about 3 s of
  hold after the last subtitle), engine defaults in chapters.
  agent-harness is slower (below).
- Animations key to `c[i]` and fit within their subtitle window (duration
  plus `after`); `after` grows when they do not. Ambient loops read `G`.

## Layout

- Compositions spread over the free band (about x 120-1800, y 130-920)
  with generous gaps, not a compact cluster in the middle.
- Components share alignment lines, measured in the rendered DOM to the
  pixel: stacked ones share a left or right edge, side-by-side ones a top
  or bottom edge, equal relations get equal gaps; a component whose text
  changes keeps a fixed width.
- Tiles of one group look alike (no odd border to stand out); repeated
  items share one size and even spacing. Icon + label tiles are centered
  (`iconTile`); centered letter-spaced labels get a `padding-left` equal
  to their `letter-spacing`.
- Tags and labels keep about 20 px of clear space from their neighbors; a
  label beside the Temporal logo is never larger than its wordmark.
- Centering: each composition is centered at (960, 522) within about
  25 px, the middle of the free band (header bottom near y 84, subtitle
  top near y 960). The scene `shift` is a fixed whole-number `[dx, dy]`,
  one compromise across phases, measured from the rendered content box;
  `pan(t, from, stops, d)` eases between offsets only where content
  already fades or moves. Brief one-off elements do not drive the offset;
  clearance above the subtitles beats exact centering. Full-screen
  flashes are oversized (`makeFlash`, 2400x1400).
- Arrow heads follow [Arrow heads in Safari](project_arrow-heads-safari.md).

## Story beats and vocabulary

- The Temporal arc repeats: the problem without Temporal (crash, lost
  progress, duplicated side effect, hand-built plumbing), then a Workflow,
  an Event History saved outside the app before the next step, a crash,
  another instance replaying the history and resuming with no step redone.
  A theme whose audience knows the problem opens on the solution.
- Shared components carry it: step rows (`makeStepRow`, `makeStep`), app
  panel (`makeAppPanel`), TEMPORAL panel (`makeTemporalPanel`, "Outside the
  app"), Event History card (`makeHistoryCard`, `markCrash`, "APP CRASHED
  HERE"), status tags (`statusTag`), crash effects (`shakeAt`,
  `makeFlash`). A helper used by two themes lives in `src/shared.js`.
- The runtime is **"the app"** (APP MEMORY, APP CRASH, APP INSTANCE A / B,
  "OUTSIDE THE APP"); "server" would blur with the LLM's server.
  durable-execution, which teaches Workers, says "server" then "Worker".
- LLM providers are named by company (OpenAI, Anthropic, Google), never
  by model. Temperatures read "18°C".
- One concrete running example per theme, with its own step icons; people
  are named, with no pronouns.

## Subtitles

- 30 px text in a box at most 1760 px wide, always on one line: measure
  the rendered `#sub` after lengthening one, rephrase if it wraps.
- Plain present tense, concrete; colons and commas; straight quotes and
  apostrophes; no em dash. Each subtitle is complete on its own (no "…"
  carrying a sentence into the next one).
- `<b>` marks each key term at its first mention.
- The first subtitle is a hook ending in a question, or "Meet …" for a
  product; the outro subtitle states the benefit in one line.
- 2 to 4 subtitles per topic chapter in explainers; the recap holds 1 or 2.

## Docs

- Theme-local `shared.js`: header `// ===================== <Theme name>
  helpers (shared by the scenes of this theme)`; extends `ICONS` with
  `Object.assign`; holds the running example and theme-only components.
- `docs/<theme>/script.md`: `# Script and timeline: <card title>`, the
  shared preamble (subtitles are the only narration, `autoDur` + `after`,
  `make timeline THEME=<theme>`, dated snapshot), `## Audience and goal`
  (supporting material in `###` subsections), `## Intro`, `## 01 <title>`
  … `## NN <title>` matching the scene titles, `## Outro` last. Entries:
  `- **m:ss** <exact subtitle>` then an indented `- Visuals: …`; the
  intro entry names kicker, title and tagline.
- No doc states a video's length (README, CLAUDE.md, scripts, theme
  descriptions): it moves with every subtitle edit and `make timeline` is
  the source. Per-subtitle start times in `script.md` are dated snapshots.

## Checks

Preview times come from `make timeline` and sit a second or more inside a
subtitle window, never in a scene's fade-in. Check alignment on full-size
frames (`make preview THEME=<theme> T="<t> --full"`). Capture noise is
described in [Frame capture noise](project_frame-noise.md).

## Files a new theme touches

Discovery is automatic (any `src/themes/*/index.html`): Makefile, scripts
and CI need no change. By hand: `src/themes/<theme>/` (`index.html`,
`shared.js`, `scenes/`, `social.png` from `make social`); `src/index.html`
(card and home `<meta name="description">`); `src/home.css` (icon hover
animation); `docs/<theme>/script.md`; the theme lists of README.md and
CLAUDE.md; a section below and the card order in
[Home page design](feedback_home-page.md).

## Per theme

### durable-execution

- Introduction for everyone. Order #1042 for $42,
  four steps (`ORDER_STEPS`); vocabulary "the server" (ch1-3), then "the
  Worker" ("Outside the Workers").
- Money is the stake: CARD CHARGED reads $84 "CHARGED TWICE!" without
  Durable Execution, stays $42 ("NOT RE-CHARGED", "CHARGED ONCE") with
  Temporal.
- Worker A crashes while `shipPackage` runs, after `chargeCard` and
  `reserveItem` are saved; Worker B takes over the Workflow, first replays
  it from the start and gets those two saved results back, then carries on
  where it stopped: `shipPackage` runs again (attempt 2, a RETRY chip from
  Temporal), then `emailReceipt`: the replay-then-resume order shared by
  the series.
- Ch7 counts attempts story-true: order-1042 shows "2 • shipPackage" (the
  crash, then Worker B). The live retry up to attempt 3 is order-1045,
  another order on worker-c, named in its subtitle and reached on screen
  through "Back to Workflows" and a click in the list, never by a cut.
  Once attempt 3 succeeds, a click on its Timeline tab ends the chapter on
  the "3 • shipPackage" chart rather than an empty Pending Activities tab.
- On-screen code is real Temporal TypeScript SDK code. Activities run at
  least once and stay idempotent: idempotency keys are never shown as
  plumbing Temporal removes (ch3 tiles: retry loops, status table, message
  queue, timers, cleanup jobs, recovery scripts).

### human-in-the-loop

- Sam orders a $2,400 laptop; above $1,000, Maria, the manager, approves.
  Steps CHECK, APPROVAL, ORDER, NOTIFY, the same tiles in ch1, ch3, ch4.
- Ideas in order: a step needs a person who may answer in minutes or days
  (ch1); a plain app cannot wait that long and hand-built waiting is
  fragile (ch2); the Workflow waits on one line with no code running,
  Temporal keeps the history outside the app (ch3); the decision arrives
  as a Signal, any copy replays and resumes after the wait (ch4); durable
  timers drive reminders and escalation (ch5); recap (ch6); the use cases
  the pattern fits: approvals, reviews, signatures, and AI agent approvals,
  a user confirming an agent's action or tool call (ch7).
- Ch3 and ch4 share the durable-ai-agents ch7 layout: step row on top, app
  panel with a WORKFLOW card left, TEMPORAL panel with the Event History
  right. Replayed rows get REPLAYED, the Signal row keeps SAVED; "WAITING
  FOR A SIGNAL" is an un-numbered line.

### durable-ai-agents

- Non-technical audience; seven topics (`script.md`, Audience and goal),
  the budget-savings topic mandatory: it is Temporal's key business
  message. Lunch with Marie; steps Calendar, Restaurant, Booking, Invite.
- Ch6 and ch7 crash at the same point: after step 3's tool result, before
  step 4's LLM call. Ch7 teaches three ideas in order: Temporal keeps the
  history outside the app; each result is saved before the next step;
  after a crash another copy re-runs from the start and Temporal hands
  back every saved result (no LLM call, APP MEMORY rebuilt for free), then
  the first unsaved step runs. The LLM CALLS BILLED counter stays put
  during replay; the recap states "43% less LLM spend, in this example"
  (`### Budget figure` in `script.md`).
- Ch7 mirrors ch6: same step tiles, APP MEMORY panel and LLM CALLS BILLED
  counter, plus a TEMPORAL panel holding the Event History. Rows get SAVED
  when written; "APP CRASHED HERE" and a tinted block mark the rows that
  survive; replayed rows turn "REUSED, NOT RE-BILLED" (LLM) or "REUSED,
  NOT RE-RUN" (tools). APP MEMORY blocks: 76x56 px, left-aligned 20 px
  from the panel edge, 12 px apart, two per step in Event History colors
  (UV icon for LLM, black icon for tool).
- Ch3 context window: messages slide in one by one; the Size gauge moves
  with each row but fills as the square of the page fill, since every call
  resends the whole history plus instructions; FULL pops as the page fills.
  A fixed-width token counter, "billed so far", bottom aligned with the
  page, shows with the gauge and follows it (12,400 at FULL); each step
  plays a money-spent effect (coin bump, a coin flying off in a direction
  that changes at each step, from a fixed list, "+N").
- Pans: ch1, ch5, ch7.

### agent-harness

- Developers and technical leads who know an agent is a model, tools and
  a loop, not necessarily Temporal. Every claim, on-screen code and UI
  detail matches the harness docs
  (https://github.com/temporal-community/temporal-agent-harness:
  `README.md`, `docs/internal/what-the-harness-adds.md`,
  `docs/internal/core-concepts.md`): exact tool names in approval rules,
  valid Python. SDKs: "OpenAI Agents SDK", "Google Gen AI SDK",
  "Pydantic AI"; subtitles name features by what they do, not by API.
- The turn is the core concept (a message starts a turn, the developer's
  loop runs inside, the reply streams, the harness waits); ch1 introduces
  it. Ch5 subagents: the parent starts a child workflow (`start_travel`),
  messages it through `travel_plan_trip`, closes it (`stop_travel`).
- Running example: a 3-night trip to Lisbon, real tool names in code font
  (`search_flights`, `search_hotels`, `book_flight`, `book_hotel`), one set
  of figures: $480 flight, $390 hotel, $25 tour, $895 total.
- Slower pacing: `pre: 1.5, post: 2.0` on chapters (intro `pre: 1.5`,
  outro `pre: 1.0, post: 3.0`), each state readable about 1.5 s, each
  result held 2 s before the next subtitle; up to 7 subtitles a chapter.
- Grid: content frame x 140-1780, y 150-880; multi-zone scenes touch both
  sides; tops, bottoms and headings aligned; gutters 40 px within a zone,
  80-120 px between zones; elements at final positions, no `shift`; ch2 is
  the model. Pans: ch1 (SDK tags fade), ch4 (console slides in), ch7 (UI
  window enters).

**Why:** the themes form one series under the Temporal brand, reviewed
closely frame by frame: a viewer moving between them meets the same title
card, header, layout, vocabulary and end card, and each new theme starts
from a known checklist.

**How to apply:** when creating or editing a theme, follow this note;
depart from the shared anatomy only where the audience calls for it, and
record the departure in the theme's section.
