# Script and timeline: Meet Temporal

Subtitles are the only narration (no audio). Each subtitle lasts as long
as its text needs (`autoDur` in `src/engine.js`), plus its `after` pause.
Run `make timeline THEME=meet-temporal` for the live values; the start
times below are a snapshot from 2026-10-08.

Each entry gives the subtitle start time and its exact text, then what the
animation shows.

## Audience and goal

Someone who has never heard of Temporal learns who created it, where it
comes from, what it does, where it is used, why it matters for AI, how it
is offered (open source and Temporal Cloud) and where the company stands
today. The video opens on the founders, Maxim Fateev and Samar Abbas
(their careers only, no countries of origin), inside 20 years of lineage:
Amazon Simple Queue Service and Simple Workflow Service, Microsoft Durable
Task Framework, Uber Cadence, then Temporal, laid out after the user's
deck (slide 5). It explains Durable Execution with the order of the series
(ORDER, CHARGE, SHIP, EMAIL), then the kinds of Workflows teams run, why AI
agents need it, the open source and Cloud offer, and ends on the company's
figures.

The format is a short company introduction, not an explainer: there is no
"What you get" recap chapter, and the outro sums up. Companies are named
in plain text, with no third-party logos; LLM providers are named by
company, never by model.

This theme moves more than the others: every scene zooms through at its
cuts (it grows from 94% as it fades in and on to 106% as it fades out),
and each chapter has a cinematic moment, listed in its visuals.

### Sources

- Temporal deck provided by the user (slides 3, 5, 6, 7): the use case
  categories, the 20-year timeline, Temporal Cloud and its security
- https://docs.temporal.io/cloud/security (the Temporal Cloud claims of
  chapter 05)
- https://temporal.io/blog/samars-journey
- https://temporal.io/about (also the source of the founders' photo,
  `src/assets/temporal-founders.jpg`: "Portrait of Temporal Co-Founders,
  Maxim Fateev and Samar Abbas")
- https://temporal.io/blog/oss-startups-podcast
- https://dev.to/codestorypodcast/s8-e28-maxim-fateev-temporal
- https://www.uber.com/en-US/blog/open-source-orchestration-tool-cadence-overview/
- https://temporal.io/blog/temporal-v1-announcement
- https://temporal.io/news/temporal-raises-550m-at-a-12-55b-valuation
- https://temporal.io/blog/temporal-raises-usd300m-series-d-at-a-usd5b-valuation
- https://techcrunch.com/2025/03/31/temporal-lands-146-million-at-a-flat-valuation-eyes-agentic-ai-expansion
- https://sdtimes.com/temporal-io-raises-103-million-series-b-company-valuation-passes-1-5-billion/
- https://temporal.io/blog/improving-java-sdk-codex-openai
- https://temporal.io/resources/case-studies/replit-uses-temporal-to-power-replit-agent-reliably-at-scale

## Intro

- **0:01** Many apps you use every day run on Temporal. What is it, and
  where does it come from?
  - Visuals: Temporal logo, kicker "AN INTRODUCTION FOR EVERYONE", title
    "What is Temporal?", tagline "THE STORY OF DURABLE EXECUTION"; on the
    right, stars converge and the official Temporal symbol draws itself
    stroke by stroke, then fills in with a ripple, on a soft violet glow;
    everyday-app icons orbit it with light trails (cart, card, car, play,
    AI spark); a slow camera push-in.

## 01 Where it comes from

- **0:11** Meet Maxim Fateev and Samar Abbas. In 2004, Maxim led Amazon's
  Simple Queue Service.
  - Visuals: The chapter opens before the subtitle on its heading, "20
    years in the making" ("20 years" in violet), very large in the middle:
    its letters close in from wide apart, sharpening, with a violet glow.
    While it is large, "20 years" is put forward: a white-to-violet light
    runs through its letters, a violet glow blooms around them, they pop,
    and a burst of sparkles fades out. It then shrinks up to the top, "20
    years" keeping a faint glow. The founders' faces (cropped from
    the official photo) pop in under it, each with its name beside it:
    MAXIM FATEEV (CO-FOUNDER, CTO) on the left, SAMAR ABBAS (CO-FOUNDER,
    CEO) on the right. The composition rises as a timeline of five
    milestones draws in below; Maxim's name fades and his face flies with
    a trail onto 2004, which lights up: AMAZON / "Simple Queue Service" /
    TECH LEAD: MAXIM.
- **0:17** In 2009, they launched Amazon's Simple Workflow Service.
  - Visuals: Maxim's face travels to 2009 with a motion trail; Samar's name
    fades and his face flies to 2009: AMAZON / "Simple Workflow Service" /
    AWS WORKFLOW SERVICE.
- **0:21** In 2014, Samar co-created Microsoft's Durable Task Framework.
  - Visuals: Samar travels to 2014: MICROSOFT / "Durable Task Framework" /
    AZURE DURABLE FUNCTIONS.
- **0:26** In 2015, they reunited at Uber to create Cadence, open source
  since 2017.
  - Visuals: Both faces reach 2015: UBER / "Cadence" / UBER'S WORKFLOW
    ENGINE.
- **0:31** In 2019, they founded Temporal, the open source successor of
  Cadence.
  - Visuals: Both travel to 2019: a highlighted tile (UV border and glow)
    THEIR OWN COMPANY / official Temporal logo / OPEN SOURCE, MIT LICENSE
    arrives with a bloom of light and violet ripples.

## 02 What Temporal does

- **0:38** The idea is Durable Execution: an app runs in steps, and Temporal
  records each one outside the app.
  - Visuals: Step tiles ORDER / CHARGE / SHIP / EMAIL on top; APP INSTANCE
    A on the left with a STEPS card (take the order, charge the card, ship
    the package, email the receipt); TEMPORAL panel ("OUTSIDE THE APP")
    with an EVENT HISTORY on the right. Steps 1 and 2 run; each result
    runs as a neon pulse along a cable into the history, where rows 1
    "Order #1042 received" and 2 "Card charged: $42" are SAVED; step 3
    starts.
- **0:45** If the app crashes, a new copy of the app starts and takes
  over.
  - Visuals: Crash during SHIP: a glitch (color fringes, torn bars,
    scanlines), shake, red flash; APP INSTANCE A CRASHED, its lines fall
    out, EMPTY, "APP CRASHED HERE" under the saved rows; A stays on screen,
    dead, for a moment. Then APP INSTANCE B rises into its place, booting
    behind a scanline (STARTING, then TAKING OVER), tagged NEW APP
    INSTANCE; A fades out only once B is there.
- **0:50** It gets the saved results back from the history, then picks up
  where it left off. No progress is lost.
  - Visuals: Replay, row by row: each saved row of the Event History is
    highlighted and turns REPLAYED, its result runs back to B as a violet
    pulse, and the step ticks on B without running again (REPLAYING…).
    Then B resumes at step 3: SHIP runs and is saved ("Package shipped"),
    then EMAIL ("Receipt emailed"), every tile checked; ORDER COMPLETE
    holds before the cut.

## 03 Where Temporal is used

- **1:00** A Workflow is any process that must finish correctly: payments,
  orders, bookings, subscriptions.
  - Visuals: A compact hub-and-spoke map: the official Temporal symbol,
    large, glows in the middle; four short spokes draw out with a pulse of
    light, and a round UV hub pops at the end of each: PROCESS, LIFECYCLE,
    OPERATIONAL, AI, each with WORKFLOWS. Around each hub, three icon
    bubbles pop in a cascade and float gently, joined to it by thin links,
    their labels on the outer side: Payments, Orders, Bookings;
    Subscriptions, User accounts, Inventory; CI/CD, Provisioning, Data
    pipelines; Agents, RAG flows, Model training. All hubs and bubbles stay
    equal: no domain is highlighted.
- **1:07** Teams also run infrastructure, data pipelines and, more and
  more, AI on Temporal.
  - Visuals: The map holds; once the subtitle is read, AI invades the
    screen: the rest of the map fades while the AI hub and its halo swell
    until the disc fills the whole stage, a violet light glowing in it;
    "WORKFLOWS" fades as it grows and "AI" glides to the center, so the
    full screen shows a big "AI" alone, held a moment. Then it contracts to
    where the next chapter's LLM node appears, at its size; "AI" fades and
    the UV fill gives way to the violet LLM orb and its eyes, so the hub
    becomes the agent across the cut.

## 04 Why it matters for AI

- **1:17** AI agents are long processes too: many LLM calls, tools to run,
  and waits for a person.
  - Visuals: The chapter opens on that same LLM orb and its halo, already
    at its final place: the halo fades into the LLM's own glow while the
    rest of the agentic loop of Durable AI Agents emerges around it, at 80%
    of its size: THINK (the LLM orb) on top, ACT (neon play tile) and
    OBSERVE (eye tile) below. APP INSTANCE A frames it, and TEMPORAL
    ("OUTSIDE THE APP") with an empty EVENT HISTORY enters on the right;
    the two panels share their top and bottom edges, 40 px apart. Under the
    loop, the goal card "Book lunch with Marie on Thursday." (YOU) shows,
    then a violet "WAITS FOR A PERSON" pill in its place. The agent runs
    its first step, slowly (3.2 s a turn): a neon token with a comet tail
    runs round the loop, passing under the nodes; its LLM call, an "LLM
    CALL" card, leaves THINK, flies to the history and docks at its row's
    left end, never over the row's text; the row "LLM call: check the
    calendar" is written and turns SAVED, highlighted for a moment, and
    "SAVED OUTSIDE THE APP" shows under the history; then a "TOOL CALL"
    card leaves ACT as the token passes it, and "Calendar: Thu 12:30 is
    free" is saved the same way.
- **1:24** With Temporal, every step the agent takes is saved in an Event
  History, outside the app.
  - Visuals: Steps 2 and 3 run the same way: "LLM call: find a
    restaurant", "Search: Chez Paulette", "LLM call: book a table",
    "Booking: table for 2, confirmed", each SAVED.
- **1:31** When the app crashes in production, a new instance gets the
  saved results back and resumes.
  - Visuals: Crash before the invite: shake, red flash, a bolt and APP
    CRASH on the dimmed loop, APP INSTANCE A CRASHED; the history keeps
    its six rows, tinted, over "APP CRASHED HERE", and "HISTORY KEPT" shows
    under it; the crashed state holds. A leaves; APP INSTANCE B slides into
    its place with a violet glow, NEW APP INSTANCE holds in the loop's
    middle. Replay, one row a second: each saved row is highlighted, its
    tag turns "REUSED, NOT RE-BILLED" (LLM calls) or "REUSED, NOT RE-RUN"
    (tools), and its card flies from the row's left end back to THINK or
    ACT. Then the invite runs for real at the same slow pace: rows 7 "LLM
    call: invite Marie" and 8 "Email: invite sent" are saved, and AGENT
    COMPLETE shows in the loop.
- **1:46** No progress is lost and no tokens are wasted: no LLM call is
  paid twice.
  - Visuals: Under the history, two compact neon pills with a soft glow
    pop in turn, side by side: NO PROGRESS LOST, then NO TOKENS WASTED.
- **1:52** That's why OpenAI built Codex on Temporal, and Cursor, Lovable
  and Replit rely on it too.
  - Visuals: The completed state holds.

## 05 Open source and Cloud

- **2:00** Temporal is open source: Temporal 1.0 shipped in 2020, and anyone
  can run it on their own servers.
  - Visuals: Three tiles across the top, one by one: "Open source" (MIT
    LICENSE), "Temporal 1.0" (2020), "Self-hosted" (ON YOUR OWN SERVERS).
- **2:08** Temporal Cloud runs the service for you. Your code stays in your
  environment: Temporal never sees it.
  - Visuals: On the right, TEMPORAL CLOUD (UV border, official logo):
    "Temporal Service" and three bars SECURITY & COMPLIANCE, CONTROL PLANE
    & SCALE, HIGH AVAILABILITY; on the left, YOUR ENVIRONMENT (dashed slate
    border, "YOUR APP, YOUR CODE"): YOUR APP with a small Workflow card and
    TEMPORAL SDK · OPEN SOURCE; then NEVER SEES YOUR CODE.
- **2:16** Connections only go out from your side, and data stays encrypted
  end to end.
  - Visuals: A one-way arrow draws from your environment to Temporal Cloud,
    OUTBOUND ONLY, mTLS; neon packets flow out along it; an inbound attempt
    from the cloud bounces off your side (red cross). A piece of data,
    "card: $42", leaves your app, scrambles into glyphs as it leaves your
    environment and lands encrypted in the Temporal Service; END-TO-END
    ENCRYPTION, its lock snapping shut.

## 06 Temporal today

- **2:24** Today, more than 4,300 companies pay for it, including Netflix,
  Snap, NVIDIA, Salesforce and Shopify.
  - Visuals: PAYING CUSTOMERS, alone in the middle: the count rolls up to
    "4,300+", then the names pop in as mono pills (NETFLIX, SNAP, NVIDIA,
    SALESFORCE, SHOPIFY) and start moving on a belt.
- **2:31** In September 2026, investors valued Temporal at $12.55 billion.
  The team has doubled in a year.
  - Visuals: The customers tile moves left as the VALUATION chart comes in:
    bars proportional to the value grow one by one, 2022 $1.5B, 2025
    $1.72B, FEB 2026 $5B, SEP 2026 $12.55B (the last one violet to UV), a
    violet trend line climbs over them and a burst of light lands on
    $12.55B; then the EMPLOYEES tile rolls up to "570", DOUBLED IN A YEAR.

## Outro

- **2:40** Temporal keeps code running whatever fails, from everyday apps
  to AI agents.
  - Visuals: A constellation of Ziggy, Temporal's mascot, a tardigrade:
    its stars twinkle in one by one, then its lines draw stroke by stroke,
    around the body, along the feet, then the eye and the folds of its
    body, and a soft glow sweeps across the finished constellation. Below,
    the title "Meet" followed by the Temporal logo, and the tagline
    "DURABLE EXECUTION FOR APPS AND AI AGENTS".
