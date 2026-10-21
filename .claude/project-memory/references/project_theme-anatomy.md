---
name: "Themes: shared anatomy and stories"
description: "Everything about the themes: structure, layout, subtitles, vocabulary, docs, checks, new-theme files, each story"
type: project
---

# Themes: shared anatomy and stories

Every theme is a short silent video in one series: burned-in subtitles, no
soundtrack, Temporal brand (see [Temporal brand rules](project_brand.md)),
delivered as a 1920x1080 30 fps MP4 plus an SRT. All themes follow the
anatomy below; the story, the running example, the number of chapters and
the visuals belong to each theme (last section).

## Page and home card

- `<meta name="markdown-title">` is "<card title> with Temporal"
  ("Durable AI Agents with Temporal"); a card title that already contains
  "Temporal" stands alone ("Temporal Agent Harness").
- `<title>` and `<meta name="description">` are written for search results
  (see [Search engine optimization of the site](project_seo.md)); the
  description is one sentence ending with a period, about the topic, and
  the card's `.theme-text` is a shorter form of it.
- Same page skeleton everywhere: `#stage` with `#sky`, `#band`, `#hdr`,
  `#segs`, `#mark`, `#subw > #sub`; scripts `../../engine.js`,
  `../../shared.js`, `shared.js`, scenes `00-intro.js` to `99-outro.js`,
  `../../player.js`, `boot()`.
- `#mark`, the corner symbol of chapter scenes: see
  [Official Temporal logo](reference_logo.md).
- Home card: `a.theme` > `.theme-icon` (24x24 stroke SVG with a comment
  naming what it shows and its hover animation), `.theme-title`,
  `.theme-text`; see [Home page design](feedback_home-page.md).

## Scenes

- One scene per chapter: `00-intro.js`, `01-…` to `NN-…`, `99-outro.js`.
  Line 1 is `// ===================== N. CHAPTER TITLE`, the scene `title`
  in caps (or `INTRO`, `OUTRO`), then an optional comment describing the
  scene, then the comment "The block keeps every name declared in this
  file local to this scene." and the `{ … }` block.
- Intro: `makeTitleBlock(root, kicker, titleHtml, tagline)` on the left
  (official logo, slate mono kicker, two-line title, violet mono tagline),
  a theme visual on the right, one subtitle. The kicker names the audience
  or format ("AN EXPLAINER FOR EVERYONE", "AN EXPERIMENTAL PROJECT"); the
  title is a question for explainers ("How does an AI agent work?") or
  the product name; the uppercase tagline ties the topic to Temporal. A
  product title splits after "Temporal" ("Temporal<br>Agent Harness",
  "Temporal<br>Proxy 1.0"): a version number stays with the product name,
  never alone on a line, which reads unbalanced. This
  title card is the theme's `social.png` (README.md, Social link
  previews).
- Chapters: `chapter` and `title` drive the `NN / TITLE` header and the
  segment bars; titles are short sentence-case phrases ("When a step
  fails").
- Recap: **What you get** has its own scene file after the topic
  chapters. Recap tiles and subtitles live there, never in a topic
  chapter, so every chapter title stays true to its content.
- Use cases: every explainer has a **What you can build** chapter after
  the recap, right before the outro (`NN-use-cases.js`); a product
  presentation (agent-harness) and a guide (worker-tuning) end on their
  recap. Topic lists in
  `script.md` leave out both chapters.
  - The scene is one `useCaseScene({ chapter, uses, namedAt, subs })`
    call (`src/shared.js`). 4 `useCaseTile`s (icon, uppercase label,
    lowercase slate example line) land during the first of 2 subtitles
    ("<running example> is one example: any … fits"); the second names the
    4 tiles in order and ends on the benefit; each tile lights (UV border)
    as its name is read: `namedAt` offsets from `c[1]` = name position at
    16 characters per second + 0.3 s, the last one lit for
    `USE_CASE_LAST_LIT` (1.2 s). Opt-in options, off by default:
    `labelLines` (room for two-line labels in every tile, so icons stay
    aligned), `front` (tiles that flip in 3D from the previous scene's
    tiles in the same slots), `camera` and `fadeIn` (for a match cut from
    the recap); security uses them.
  - Tiles are concrete use cases, named scenarios matched to the audience
    ("Fraud reviews", "Money transfers", "Deep research"), never generic
    actions or broad categories ("Approvals", "Payments", "Documents").
    Examples are short concrete phrases ("a flagged payment waits"),
    about 340 px at most in the tile.
  - One row shared by every theme, `USE_CASE_ROW` in `src/shared.js`: 4
    tiles of 384x460 px, 48 px apart, x 120-1800, centered on y 515; type
    scale `USE_CASE_TYPE` (icon 96, label 26), example line 20 px in
    `useCaseTile`. Recaps of 4 tiles use the same width, pitch and type
    scale.
  - An AI use case reads as a person confirming an agent's action or tool
    call ("AI agent approvals", "chatbots with human approval").
  - The user picks the use cases: propose 2 or 3 sets of 4 tiles, with
    examples, before building the chapter.
- meet-temporal has neither chapter (see its section below).
- Outro: `makeEndCard(root, title, tagline, { pill })` in every theme,
  same sizes everywhere: the theme name as title, cased as on its home
  card ("Durable AI Agents"), a violet uppercase tagline stating the
  benefit, an optional violet pill ("Experimental" for agent-harness), the
  official logo, no URL. A small theme visual sits above the title, at
  about the tagline-to-logo gap.
- Pacing: intro `pre: 1.0`, outro `pre: 0.4, post: 2.6` (about 3 s of
  hold after the last subtitle), engine defaults in chapters.
  agent-harness is slower (below).
- Animations fit within their subtitle window (duration plus `after`);
  `after` grows when they do not.

## Layout

- Content frame and `make layout`: see README.md. Only brief one-off
  effects (flash, glitch, crash bolt, flying coin, a pop's overshoot)
  leave the frame. Horizontally, compositions spread over about
  x 120-1800.
- Scenes have generous gaps, not a compact cluster in the middle. A dense
  scene fits by tightening gaps first, then component heights (rows,
  panels, tiles); font sizes and CSS scaling stay untouched. A thin scene
  grows its tiles, type and gaps.
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
- Centering: the scene `shift` is a fixed whole-number `[dx, dy]`, one
  compromise across phases, measured from the rendered content box;
  `pan(t, from, stops, d)` eases between offsets only where content
  already fades or moves. Brief one-off elements do not drive the offset;
  clearance above the subtitles beats exact centering. Full-screen
  flashes are oversized (`makeFlash`, 2400x1400).

## Story beats and vocabulary

- The Temporal arc repeats: the problem without Temporal (crash, lost
  progress, duplicated side effect, hand-built plumbing), then a Workflow,
  an Event History saved outside the app before the next step, a crash,
  another instance replaying the history and resuming with no saved step redone.
  A theme whose audience knows the problem opens on the solution.
- Shared components carry it: step rows (`makeStepRow`, `makeStep`), app
  panel (`makeAppPanel`), TEMPORAL panel (`makeTemporalPanel`, "Outside the
  app"), Event History card (`makeHistoryCard`, `markCrash`, "APP CRASHED
  HERE"), status tags (`statusTag`), crash effects (`shakeAt`,
  `makeFlash`, `crashGlitch`, `makeCrashMarks`), the takeover by a new
  instance (`leavingInstance`, `arrivingInstance`, `setArrivalGlow`,
  `makeNewTag`, `makeHandOffCard`).
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
  apostrophes. Each subtitle is complete on its own (no "…"
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
frames (`--full`, see README.md). Capture noise is described in
[Frame capture noise](project_frame-noise.md).

## Files a new theme touches

The checklist is README.md, "Add a theme". The memory side: a section
below and the card order in [Home page design](feedback_home-page.md).

## Per theme

### meet-temporal

- For people who have never heard of Temporal: the founders and where they come
  from, the lineage, what Temporal does, where it is used, why it matters for
  AI, Temporal Cloud, Temporal today. Length is no constraint: every beat gets
  the time it needs to read (held states, slow dramatic moments) rather than
  being rushed to save seconds. Every fact is sourced (`### Sources` in
  `script.md`); unsourced claims stay out (founders' degrees, customers named
  only by investors, a Cloud GA date).
- No "What you get" recap: a short company introduction, the outro sums
  up. Six chapters: Where it comes from (the video opens straight on
  the founders' timeline, no separate founders chapter), What Temporal
  does, Where Temporal is used, Why it matters for AI, How Temporal
  Cloud works, Temporal today. Source material includes a Temporal deck
  from the user, not in the repository (slide 3 use cases, slide 5
  timeline, slides 6-7 on Temporal Cloud; slide 4, customer proof
  points, stays out). Ch5 makes three points without service internals:
  Workers run the customer's code in their environment (Temporal Cloud
  holds no app code), Temporal Cloud orchestrates Workflows and
  Activities and persists their history, and payloads can be encrypted
  with the customer's keys (Data Converter, in each Worker) so Temporal
  never sees them; connections are outbound only, authenticated by mTLS
  or API key, over the internet or private connectivity. Its right zone is
  titled with the lockup followed by "Cloud". Simple Workflow Service is
  dated 2009, the launch Max and Samar led.
- Founders are told by their careers only, never by country of origin: Maxim
  Fateev (co-founder, CTO) and Samar Abbas (co-founder, CEO). Lineage: 2004
  Simple Queue Service (Maxim tech lead), 2009 Simple Workflow Service, 2014
  Durable Task Framework (Microsoft, base of Azure Durable Functions), 2015
  Uber (where they create Cadence, open source 2017; the tile reads
  Cadence), 2019 Temporal (MIT). Ch1 opens on "20 YEARS
  IN THE MAKING" in large type, which shrinks into the heading, where it stands
  alone, as the timeline draws in. The founders appear as faces cropped from the
  official photo (`src/assets/temporal-founders.jpg`, temporal.io/about), never
  the full photo. Third-party companies and AI frameworks appear as text, never
  as logos; programming languages show their official logos
  (src/assets/languages/, sources and licenses in its README.md).
- Ch6 figures are dated (Series E, September 2026: $12.55B valuation,
  4,300+ paying customers, 570 employees): refresh them with each funding
  announcement. The valuation chart shows every round with a reported
  valuation: Series A (Oct 2020, "~$75M", a PitchBook estimate, the tilde
  marking it), B (Feb 2022, $1.5B), B-Prime (Feb 2023, $1.5B), C, D, E;
  the seed has no reported valuation. The "×8" multiple runs from Feb
  2022, the first officially reported valuation. Ch4 names OpenAI (Codex),
  Cursor, Lovable.
- Ch4 shows only the durable agent: an AI agent run with Temporal that
  crashes in production; the Event History keeps every step, a new app
  instance replays it and finishes, ending on NO PROGRESS LOST and NO
  TOKENS WASTED. The theme shows the Temporal run only.
- Ch2 is the short series arc: steps run strictly one after the other,
  each saved before the next starts. Ch1 uses `pre: 2.0`.
- Outro departs from `makeEndCard`: a constellation of Ziggy, Temporal's
  mascot (a tardigrade), drawn star by star then line by line; the title
  is "Meet" followed by the official lockup, "Meet" matching the
  wordmark's size and baseline, and the tagline closes the card.
- Motion goes beyond the series framework: cinematic, creative animations
  (stroke drawing, camera moves, trails, glitch crashes, particles, 3D
  flips, scrambles), at least one strong moment per chapter, still
  on-brand and deterministic. Engine additions stay opt-in, the other
  themes render unchanged.

### durable-execution

- Introduction for everyone; its end card title is "Durable Execution",
  the topic without the card's "Introduction to". Order #1042 for $42,
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
- Ch10 use cases, in order: money transfers (coin, "debit, credit, never
  twice"), subscriptions (calendar), data pipelines (table), AI agents
  (bot, "a long task survives crashes"). AI agents is a required use case
  in this theme: it matters most to the audience, and it closes the list.

### human-in-the-loop

- Sam orders a $2,400 laptop; above $1,000, Maria, the manager, approves.
  Steps CHECK, APPROVAL, ORDER, NOTIFY, the same tiles in ch1, ch3, ch4.
- Ideas in order: a step needs a person who may answer in minutes or days
  (ch1); a plain app cannot wait that long and hand-built waiting is
  fragile (ch2); the Workflow waits on one line with no code running,
  Temporal keeps the history outside the app (ch3); the decision arrives
  as a Signal, any copy replays and resumes after the wait (ch4); durable
  timers drive reminders and escalation (ch5, a single subtitle); recap
  (ch6); the use cases
  the pattern fits: fraud reviews (flag), identity checks (ID card), deploy
  approvals (upload), and AI agent approvals, a person confirming an
  agent's action or tool call (ch7).
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
  back every saved result (no LLM call, CONTEXT rebuilt for free), then
  the first unsaved step runs. The LLM CALLS BILLED counter stays put
  during replay; the recap states "43% fewer LLM calls in this example"
  (`### Budget figure` in `script.md`): it counts calls, not spend, as
  the wasted calls are the early ones with the smallest context.
- Ch7 mirrors ch6: same step tiles, CONTEXT panel and LLM CALLS BILLED
  counter, plus a TEMPORAL panel holding the Event History. Rows get SAVED
  when written; "APP CRASHED HERE" and a tinted block mark the rows that
  survive; replayed rows turn "REUSED, NOT RE-BILLED" (LLM) or "REUSED,
  NOT RE-RUN" (tools). CONTEXT blocks: 76x56 px, left-aligned 20 px
  from the panel edge, 12 px apart, two per step in Event History colors
  (UV icon for LLM, black icon for tool).
- Ch3 context window: messages slide in one by one; the Size gauge moves
  with each row but fills as the square of the page fill, since every call
  resends the whole history plus instructions: the quadratic growth of the
  context size is the point of the gauge; FULL pops as the page fills.
  A fixed-width token counter, "billed so far", bottom aligned with the
  page, shows with the gauge and follows it (12,400 at FULL); each step
  plays a money-spent effect (coin bump, a coin flying off in a direction
  that changes at each step, from a fixed list, "+N").
- Ch9 use cases, in order: deep research, multi-agent (a lead agent and
  its helpers), chatbots with human approval, background agents (clock,
  "watch for days, then act").
- Pans: ch1, ch5, ch7.
- The ch8 recap's first tile, the budget benefit, is neon: the one tile of
  a group that stands out on purpose.

### agent-harness

- Developers and technical leads who know an agent is a model, tools and
  a loop, not necessarily Temporal. Every claim, on-screen code and UI
  detail matches the harness docs
  (https://github.com/temporal-community/temporal-agent-harness:
  `README.md`, `docs/internal/what-the-harness-adds.md`,
  `docs/internal/core-concepts.md`): exact tool names in approval rules,
  valid Python. SDKs: "OpenAI Agents SDK", "Google Gemini",
  "Pydantic AI" (the README and deck labels), with Google ADK, Strands
  Agents and LangGraph marked as planned; subtitles name features by what
  they do, not by API.
- Ch3 auto mode shows its three verdicts: approve, deny (the call never
  runs, the reason goes back to the model) and escalate to a person. Ch7
  callback tools reach the user's laptop or a private network, and the
  agent waits durably for the result without tying up compute (one
  callback target on screen: USER'S LAPTOP). Ch8 typed sessions shows the
  path agent Python class → generated TypeScript types → UI; on-screen
  TypeScript follows the harness-codegen shape (`initData` first, `null`
  for an agent with no init data, then `handlers: {name: {input;
  output}}`, `states`). Ch9 is the recap.
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
- Grid: content frame x 140-1780, y 150-880; multi-zone scenes touch both sides;
  tops, bottoms and headings aligned; gutters 40 px within a zone, 80-120 px
  between zones; chapters place elements at final positions, with no fixed
  `shift`; ch2 is the model. Pans: ch1 (SDK tags fade), ch4 (console slides in),
  ch8 (code column centered alone, then the UI window enters).

### worker-tuning

- A guide for developers and SREs who already run Workers: one symptom, a
  growing Task Queue backlog, and its four causes, told as one Black
  Friday night where each fix moves the bottleneck: Slots (ch3), Pollers
  (ch4), the Workflow cache (ch5), the CPU (ch6). Ch1's first reflex,
  "add more Workers?", gets its answer only in ch6, once the CPU is full;
  the recap says a growing backlog "often comes from one of four Worker
  limits", never that it has only four causes. Ch7, "Read
  the signals", is the recap (symptom / signal / fix table and the loop
  change one setting, watch, next bottleneck); no "What you can build"
  chapter, as for agent-harness.
- Inspired by the Temporal Worker Tuning Simulator
  (https://github.com/cvilenio/temporal-worker-tuning-simulator), concepts
  only: the repository has no license, so no code, image or color comes
  from it.
- Every setting, default and metric matches the Temporal docs and the
  TypeScript SDK (`### Sources` in `script.md`): defaults are 100 Activity
  Slots, so the story's Worker is set to 10 "for normal days"; the Poller
  fix is Poller Autoscaling (`activityTaskPollerBehavior: { type:
  'autoscaling' }`), never a manual poller count, as the docs recommend;
  more Workers only when the hosts are fully used. Figures stay
  realistic: replay latency in milliseconds, a fixed schedule-to-start
  below 1 s, the cache sized from memory (~600 Workflows per GB in TS),
  BACKLOG as the Activity Task queue's count (ApproximateBacklogCount is
  per task type). Key metrics appear where the story needs them: backlog
  count and schedule-to-start in ch1, execution latency in ch6, a WATCH
  FIRST strip in ch7. Poller and Workflow
  Slot counts in the diagram are schematic (2 Pollers growing to 5, 2
  Workflow Slots), stated as such in `script.md`. Resource-based tuners,
  rate limits and partitions stay out.
- Running example: the durable-execution shop, orders x10; five
  Activities, `chargeCard`, `reserveItem`, `renderInvoice` (CPU-heavy
  PDF, `invoice` icon), `shipPackage`, `emailReceipt`. One set of figures:
  10 Activity Slots raised to 50; cache 500 raised to 2000 with memory
  1 GB to 4 GB; Workers A, then B and C. The code card shows both
  "normal days" settings (10 Slots, cache 500) from ch3 on.
- One stage for ch1-6, the Worker diagram (`makeWorkerDiagram`,
  `placeWorkerDiagram` in its `shared.js`): TEMPORAL panel with the
  Workflow and Activity lanes, WORKER panel with Pollers, Slots and the
  WORKFLOW CACHE, readouts, CPU and MEMORY meters, the `Worker.create()`
  code card; a bottleneck gets a red outline and BOTTLENECK tag, then a
  neon FIXED tag. Each bottleneck chapter: symptom, what is full, the
  setting, relief, the next bottleneck showing.
- Connectors between TEMPORAL and the Workers are right-angle elbows
  (horizontal, vertical run in the gap, horizontal), and their dashed flow
  and the task chips move left to right, from the Task Queue to the
  Pollers: a Poller takes work from Temporal.
- The intro's queue strip and mini Worker (10 Slots, 2 x 5) carry into
  ch1 on a hard cut and grow into the diagram; ch1 to ch2 is a hard cut
  too, where the centered 2 x 5 grid opens into the diagram row.
- Slower pacing, as agent-harness: `pre: 1.5, post: 2.0` on chapters,
  intro `pre: 1.5`, outro `pre: 1.0, post: 3.0`.

### security

- Security teams, tech leads and CISOs evaluating Temporal: technical,
  no code or configuration on screen. Kicker "AN EXPLAINER FOR SECURITY
  TEAMS", title "Who can see your Workflow data?". Running example: Nora
  sends €25,000 to Leo, one payload card (two IBANs, a name, the amount)
  in every chapter; the euro goes with the IBANs.
- The story follows that payload along one journey lane (YOUR
  ENVIRONMENT, the wire, TEMPORAL): where the code runs and outbound-only
  polling (ch1), TLS, private connectivity (AWS PrivateLink or Google
  Private Service Connect; never the Web UI, never Azure), identity and
  Namespace isolation (ch2), the Event History storing it readable (ch3),
  the Data Converter, Search Attributes and Workflow IDs in clear, and the
  Codec Server (ch4), the same work in every Worker
  (ch5), then Temporal Proxy: a gateway holding the address, credentials
  and Namespace (ch6), encryption with the customer's KMS, data key
  rotation, built-in Codec Server (ch7), switching upstreams with no Worker
  change (ch8), calls across Namespaces with Temporal Nexus (ch9: the transfer
  Workflow in `payments` calls the fraud team's Endpoint `fraud-screening`,
  operation `screenTransfer`, handled in `fraud`; the Endpoint's allowlist
  refuses `analytics` and lets `payments` in; a veil marks fraud's
  Namespace, Task Queue and implementation as not exposed to callers
  (decoupling: callers never need to know them, never "cannot see" them);
  the payload, sealed by the caller's Worker from its first frame, rides an
  mTLS tube and the result comes back sealed by the handler; Temporal Cloud
  only, mTLS never claimed for self-hosted),
  Temporal Cloud's compliance (ch10: SOC 2 Type 2 certified, HIPAA, GDPR
  and CCPA compliant, yearly third-party audits and pen tests, reports in
  the Temporal Trust Center; no other framework, no logos), recap (ch11),
  use cases (ch12: health claims, KYC onboarding, payroll runs, AI agents
  on customer data). Every Proxy claim follows docs.temporal.io and the
  temporal-proxy repository, every Nexus claim the Nexus docs and their
  security page, every compliance claim trust.temporal.io and the Temporal
  Cloud security model (`### Sources` in `script.md`).
- Out of scope: SSO, roles, audit logs, and the pre-release status of
  Temporal Proxy, which the video never mentions.
- Nothing on screen implies Temporal stores credentials or keys: TEMPORAL
  shows connections as VERIFIED, and stored payloads carry "WRAPPED n"
  (the wrapped data key that travels with the payload), never "KEY".
- Cinematic like meet-temporal: one continuous film. Chapters hand off
  through match cuts (`fadeOut: 0` / `fadeIn: 0` on shared hand-off
  constants in the theme's `shared.js`), the camera (`shot()`) frames,
  pushes and whips along the lane following
  [Camera moves within a scene](feedback_camera-moves.md), across cuts
  too; one dramatic beat per chapter. Elements the camera crops during a
  hold dim to `OFF_SHOT` (0.3); zone borders clip to the content frame,
  headings fade instead of being cut; held shots whose message is small
  text render values at 18 px and labels at 14 px or more.
- Red verdict tags (UNREADABLE, REJECTED, READABLE, IN CLEAR, NOT ON
  ALLOWLIST) share a theme-only style: bold near-black text on solid red,
  about 19-20 px on screen, in their tile's heading row, never straddling a
  border.
- 08 → 09, 09 → 10, 10 → 11 and 12 → outro use the camera zoom-through
  (`setCamera`); ch9 and ch10 hold Temporal Cloud's side alone, each in a
  Temporal Cloud zone titled with the lockup followed by "Cloud"
  (`makeCloudZone()`, shared with meet-temporal). Ch8 holds a single
  subtitle. 11's recap tiles flip in 3D into 12's use-case tiles in the
  same slots. The recap tiles carry padlock badges above them, so the
  camera lowers both chapters by `RECAP_DY` to center the composition with
  its badges: 12's use-case row sits 14 px below `USE_CASE_ROW`.

### temporal-proxy

- A news short on Temporal Proxy 1.0 (v1.0.0, published on GitHub on
  2026-10-16) for security teams, platform teams and developers who run
  Workers: technical, no code or configuration on screen apart from the
  Worker lines `proxy:7233` / `payments`. Kicker "PRODUCT NEWS, OCTOBER
  2026", title "Temporal" / "Proxy 1.0"; intro and outro share the
  tagline "SECURE EVERY WORKFLOW FROM ONE PLACE" (user decision);
  markdown-title "Temporal Proxy 1.0".
- The video says "ready for production" and "supported", never "Public
  Preview", "GA" or "generally available" (user decision). Every claim
  follows the release, the temporal-proxy README and
  docs.temporal.io/production-deployment/temporal-proxy (`### Sources`).
- Five chapters: security in every team (ch1: the six Workers belong to
  three teams, PAYMENTS, ORDERS and FRAUD, a column of two each, and
  their chips diverge, a codec version per Worker, expiring certificates,
  API keys in env vars, until no two match; no payload goes out in clear;
  the dramatic beat is a solid red NO CENTRAL CONTROL verdict under the
  Workers, on the spot of ch2's NO SECRETS), one gateway, no secrets
  (ch2), encryption with your keys (ch3, one subtitle, "your payloads",
  not "every payload": the proxy seals codec-capable payloads and Search
  Attributes stay in clear; the dramatic beat is the data key sealing the
  card in the proxy, then wrapped at YOUR KMS, at the top of the shot and
  linked into the proxy's side under its name, and the sealed card stored
  as ciphertext and WRAPPED 1; fail-closed encryption stays out of the
  video), security as a shared service (ch4: the proxy in a
  PLATFORM TEAM zone inside YOUR ENVIRONMENT, the Workers in three team
  zones typing their team's Namespace, one Namespace band per team in
  TEMPORAL, a POLICY panel whose four rules are per-Namespace encryption,
  client authentication, encryption required and metrics; the dramatic
  beat is the policy sweeping out along every team's connection, each team
  COVERED), why 1.0 matters (ch5, one subtitle: a version track up to 0.10
  whose 1.0 slot lights up, READY FOR PRODUCTION and SUPPORTED, then the
  badge rises onto the proxy box). The install formats stay out of the
  video. A news short ends on its last topic chapter: no "What you get"
  recap, no "What you can build" chapter.
- Running example: the security theme's transfer card (`TRANSFER`, Nora
  sends €25,000 to Leo). The security components it shares with security
  (payload card, zones, TLS tube, verdict tags, Worker tiles, proxy box,
  YOUR KMS, the data key tag and its trip to the KMS, stored payload rows,
  `shot()`) live in `src/shared.js`; its own layout (`FLEET`, `PROXY` at
  x 1259, `WIDE_SHOT`, `PROXY_SHOT`, `SERVICE`, `SERVICE_SHOT`) is in its
  `shared.js`. In the close shot the dimmed Worker tiles clip to the
  content frame and their headings fade (`frameWorker()`), as the zones do
  (`frameLaneEdges()`). The shared service shrinks the Worker tiles
  through a camera layer of their own (`workerCam`, sizeless), so the
  layout check measures them at their smaller resting size.
- Spacing follows the agent-harness grid, measured on screen: about 40 px
  between tiles in a zone, 120 px between zones (152 px in ch4, where the
  TLS label sits between YOUR ENVIRONMENT and TEMPORAL, 20 px clear of
  each), 36-40 px from a zone's border and heading to its content; YOUR
  KMS sits 114 px clear of the proxy box. In ch4 the Worker tiles turn
  compact on their way into the team zones (`SERVICE_TILE`, 200 x 100 at
  0.9: WORKER and the Namespace line, the language tag and `proxy:7233`
  fading), so their text stays about 18 px on screen. Ch3's NO CODE
  CHANGE sits under the proxy, where ch2's CREDENTIALS IN ONE PLACE sits.
- Cinematic like security, one continuous film: every boundary is a match
  cut on a canonical state built by one function both sides call: intro to
  ch1 and ch1 to ch2 on `placeBareFleet()` in `WIDE_SHOT`; ch2 to ch3 and
  ch3 to ch4 on `placeProxyStage()` in `PROXY_SHOT`; ch4 to ch5 on
  `placeServiceStage()` at `SERVICE_REST` in `SERVICE_SHOT`; ch5 to the
  outro on the proxy box alone with its neon 1.0 badge in `OUTRO_SHOT`.
  The camera pushes right and in during ch2, holds in ch3, then pulls back
  left and out in ch4 and again in ch5. The intro's visual lives in a
  camera held at `WIDE_SHOT`; the 1.0 badge (`makeVersionBadge`) ties the
  intro, ch5 and the outro.

**Why:** the themes form one series under the Temporal brand, reviewed
closely frame by frame: a viewer moving between them meets the same title
card, header, layout, vocabulary and end card, and each new theme starts
from a known checklist.

**How to apply:** when creating or editing a theme, follow this note;
depart from the shared anatomy only where the audience calls for it, and
record the departure in the theme's section.
