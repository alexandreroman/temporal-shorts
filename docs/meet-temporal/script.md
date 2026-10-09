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

- Temporal deck provided by the user (slides 3 and 5): the use case
  categories, the 20-year timeline
- Temporal deck provided by the user, slides 6 ("Temporal Cloud: how does
  it work?") and 7 ("Temporal Cloud: security"): chapter 05's two zones,
  outbound mTLS or private connectivity, Workers and code on the customer's
  side, encryption by a Data Converter with the customer's keys
- https://docs.temporal.io/dataconversion (Data Converters and codecs,
  chapter 05)
- https://docs.temporal.io/encyclopedia/temporal-sdks (the SDK languages of
  chapter 06)
- https://docs.temporal.io/ai (the AI framework integrations of chapter 06)
- The languages' monochrome logos, chapter 06: see
  `src/assets/languages/README.md` (Go and .NET white logos from their
  brand pages; Python, TypeScript, PHP, Ruby and Rust from Simple Icons,
  CC0; Java from devicon's java-plain, MIT, as Oracle publishes no reusable
  logo file)
- https://docs.temporal.io/cloud/security (the Temporal Cloud claims of
  chapter 05)
- https://temporal.io/blog/samars-journey (Cadence became the standard way
  to build reliable stateful apps inside Uber)
- https://github.com/temporalio/temporal (README: "Temporal is a mature
  technology that originated as a fork of Uber's Cadence", developed by
  "a startup by the creators of Cadence")
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

- **0:10** Meet Maxim Fateev and Samar Abbas, the creators of Temporal.
  - Visuals: The chapter opens before the subtitle on its heading, "20
    years in the making" ("20 years" in violet), very large in the middle:
    its letters close in from wide apart, sharpening, with a violet glow.
    While it is large, "20 years" is put forward: a white-to-violet light
    runs through its letters, a violet glow blooms around them, they pop,
    and a burst of sparkles fades out. It then shrinks up to the top, "20
    years" keeping a faint glow. The founders' faces (cropped from
    the official photo) pop in under it, each with its name beside it:
    MAXIM FATEEV (CO-FOUNDER, CTO) on the left, SAMAR ABBAS (CO-FOUNDER,
    CEO) on the right.
- **0:15** Temporal's ideas come from projects they built at Amazon,
  Microsoft and Uber.
  - Visuals: The composition rises as a timeline draws in below, its five
    milestones appearing one after the other as dim slots, years shown:
    the journey ahead. The names fade; Maxim's face flies with a trail onto
    2004 in a smooth 1.2 s arc, and 2004 lights up: AMAZON / "Simple Queue
    Service" / TECH LEAD: MAXIM. Then, with no subtitle, Maxim moves along
    and Samar flies onto 2009: AMAZON / "Simple Workflow Service" / AWS
    WORKFLOW SERVICE; Samar travels on to 2014: MICROSOFT / "Durable Task
    Framework" / AZURE DURABLE FUNCTIONS.
- **0:24** 2015: at Uber, they create Cadence. It becomes the standard for
  Uber's critical processes.
  - Visuals: Both faces reach 2015: UBER / "Cadence" / UBER'S WORKFLOW
    ENGINE.
- **0:30** 2019: they found Temporal, a fork of Cadence, to bring it to
  every company.
  - Visuals: Both travel to 2019; a thin violet arch labelled FORK draws
    from 2015 to 2019, then a highlighted tile (UV border and glow) THEIR
    OWN COMPANY / official Temporal logo / OPEN SOURCE, MIT LICENSE arrives
    with a short bloom of light and quick violet ripples, settled before
    the subtitle ends.

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
- **0:46** If the app crashes, a new copy of the app starts and takes
  over.
  - Visuals: Crash during SHIP: a glitch (color fringes, torn bars,
    scanlines), shake, red flash; APP INSTANCE A CRASHED, its lines fall
    out, EMPTY, "APP CRASHED HERE" under the saved rows; A stays on screen,
    dead, for a moment. Then APP INSTANCE B rises into its place, booting
    behind a scanline (STARTING, then TAKING OVER), tagged NEW APP
    INSTANCE; A fades out only once B is there.
- **0:51** It gets the saved results back from the history, then picks up
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
- **1:08** Teams also run infrastructure, data pipelines and, more and
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
    rest of the agentic loop of Durable AI Agents emerges around it, at 86%
    of its size: THINK (the LLM orb) on top, ACT (neon play tile) and
    OBSERVE (eye tile) below. APP INSTANCE A frames it, and TEMPORAL
    ("OUTSIDE THE APP") with an empty EVENT HISTORY enters on the right;
    the two panels share their top and bottom edges, 40 px apart. Under the
    loop, the goal card "Book lunch with Marie on Thursday." (YOU) shows,
    then an AGENT CONTEXT strip in its place, inside the app panel. The
    agent runs
    its first step, slowly (3.2 s a turn): a neon token with a comet tail
    runs round the loop, passing under the nodes; its LLM call, an "LLM
    CALL" card, leaves THINK, flies to the history and docks at its row's
    left end, never over the row's text; the row "LLM call: check the
    calendar" is written and turns SAVED, highlighted for a moment, and
    "SAVED OUTSIDE THE APP" shows under the history; then a "TOOL CALL"
    card leaves ACT as the token passes it, and "Calendar: Thu 12:30 is
    free" is saved the same way. Each saved row also adds a block to the
    agent's context, with its step's icon: UV-tinted for an LLM call,
    neon-tinted for a tool result.
- **1:24** With Temporal, every step the agent takes is saved in an Event
  History, outside the app.
  - Visuals: Steps 2 and 3 run the same way: "LLM call: find a
    restaurant", "Search: Chez Paulette", "LLM call: book a table",
    "Booking: table for 2, confirmed", each SAVED, the context growing to
    six blocks.
- **1:31** When the app crashes in production, a new instance replays the
  history: the agent keeps its context.
  - Visuals: Crash before the invite: shake, red flash, a bolt and APP
    CRASH on the dimmed loop, APP INSTANCE A CRASHED; A's context blocks
    fall and fade, and a red CONTEXT LOST shows in its strip. The history
    keeps its six rows, tinted, over "APP CRASHED HERE", and "HISTORY KEPT"
    shows under it; the crashed state holds. A leaves; APP INSTANCE B
    slides into its place with a violet glow and an empty context strip,
    NEW APP INSTANCE held in the loop's middle. Replay, one row a second:
    each saved row is highlighted, its tag turns "REUSED, NOT RE-BILLED"
    (LLM calls) or "REUSED, NOT RE-RUN" (tools), and its card flies from
    the row's left end down to B's strip, where it lands as a block: the
    context is rebuilt block by block, and a neon CONTEXT RESTORED tag pops
    on the strip and holds. Then the invite runs for real at the same slow
    pace: rows 7 "LLM call: invite Marie" and 8 "Email: invite sent" are
    saved and add their two blocks, and AGENT COMPLETE shows in the
    loop.
- **1:46** No progress is lost and no tokens are wasted: no LLM call is
  paid twice.
  - Visuals: Under the history, two compact neon pills with a soft glow
    pop in turn, side by side: NO PROGRESS LOST, then NO TOKENS WASTED.
- **1:52** That's why OpenAI built Codex on Temporal, and Cursor, Lovable
  and Replit rely on it too.
  - Visuals: The completed state holds.

## 05 How Temporal Cloud works

- **2:01** With Temporal Cloud, your Workers run your Workflow and Activity
  code in your own environment.
  - Visuals: As on slides 6 and 7 of Temporal's deck, two zones of equal
    width from the start. On the left, YOUR ENVIRONMENT (dashed slate):
    three Workers spread evenly, each an app panel with its code (WORKER 1
    the order Workflow, WORKER 2 and 3 the chargeCard and shipPackage
    Activities), wired to a DATA CONVERTER level with WORKER 2 (a neon lock,
    a key and YOUR KEYS); caption YOUR CODE RUNS HERE. A connection draws
    from the converter to a dot on Temporal Cloud's edge, labelled OUTBOUND
    ONLY, mTLS OR PRIVATELINK. On the right, Temporal Cloud, titled with the
    official logo followed by "Cloud", with its two functions: ORCHESTRATION
    · TASK QUEUE, holding a single OrderWorkflow task, and
    PERSISTENCE, an empty history; its caption reads ONLY WORKFLOW &
    ACTIVITY DATA, NEVER YOUR CODE. The Workers poll out to Temporal Cloud
    one after the other (a violet pulse that lights the orchestration
    block) and read POLLING.
- **2:10** Temporal Cloud orchestrates your Workflows and Activities, and
  persists their history.
  - Visuals: Slowly, a beat at a time, one task at a time in the queue;
    PERSISTENCE records each event the moment it happens, as a simplified
    Event History, each new row glowing as it lands: its number, the
    Workflow or Activity, its state (STARTED, SCHEDULED or COMPLETED) in a
    quiet slate right-aligned column, and, for events with data,
    a locked, encrypted payload chip in the last column. Event 1, OrderWorkflow
    STARTED. The OrderWorkflow task leaves the queue, flies to the dot,
    back along the connection, over the Data Converter and down to WORKER 1,
    which runs the Workflow from the top, its code lit a line at a time, and
    stops at `await chargeCard(o)`: WAITING, the line faintly lit. Its
    request, a violet "schedule chargeCard" card, travels out over the
    converter into the queue, where the chargeCard task appears: event 2,
    chargeCard SCHEDULED. The task is dispatched to WORKER 2, event 3,
    chargeCard STARTED (no payload), and WORKER 2 runs it.
- **2:24** Data is encrypted with your own keys before it leaves your
  environment: Temporal never sees your payloads.
  - Visuals: The rest dims for a close-up: the chargeCard result, "card:
    $42", leaves WORKER 2 in clear and holds over the Data Converter, in
    full view; the lock opens, the key glows, the lock snaps shut and the
    text scrambles in place, once, into the ciphertext "9f3a…c21e", which
    then stays fixed as it crosses over slowly and lands as event 4,
    chargeCard COMPLETED, with that same chip. NEVER SEES YOUR PAYLOADS
    pops on the history and holds. Then the Workflow takes over again: a new
    OrderWorkflow task resumes WORKER 1 where it paused, its highlight
    moving on to `await shipPackage(o)`, WAITING; "schedule shipPackage"
    reaches the queue, event 5, shipPackage SCHEDULED; the task is
    dispatched to WORKER 3, event 6, shipPackage STARTED, runs, and its
    result lands as event 7, shipPackage COMPLETED. A last OrderWorkflow
    task resumes WORKER 1 past its last line: the Workflow returns, DONE,
    event 8, OrderWorkflow COMPLETED. The history shows its last five
    events: before events 6, 7 and 8 land, the list scrolls up one row, the
    oldest rows fading out at its top edge, the numbers counting on.

## 06 Temporal today

- **2:58** Today, more than 4,300 companies pay for Temporal, and the team
  has doubled in a year.
  - Visuals: A dark stage. One tiny dot per paying customer, 4,300 at
    seeded places over the band, ignites in rippling waves from the middle
    while a huge counter, PAYING CUSTOMERS, rolls up with them, blurred as
    it races, and lands on "4,300+" with a pop and a burst of light. The
    dots dim to a starry backdrop as the count moves left and the team
    comes in on the right: 285 dots on a grid, EMPLOYEES 285; column after
    column each dot splits in two, the count climbing to 570, and a neon
    ×2 IN A YEAR stamp slams on. Then every dot flows into the outline of
    the Temporal symbol, which takes their place in the middle.
- **3:13** Its open source SDKs support Go, Java, Python, TypeScript, .NET,
  PHP, Ruby and Rust.
  - Visuals: Eight rounded logo tiles, each the language's logo alone in
    monochrome ink, spiral out of the symbol one after the other in
    reading order onto an elliptical ring around it, each landing with a
    pop and a thin UV link back to the symbol. Once all have landed, the
    ring turns slowly round the symbol, the tiles upright, the links
    following them.
- **3:20** And they plug into AI frameworks: OpenAI Agents SDK, Vercel AI
  SDK, Pydantic AI, Google ADK, LangGraph.
  - Visuals: Under the ring, in the same rounded tile style, two rows of
    three tiles appear one by one with a calm pop: OpenAI Agents SDK, Vercel
    AI SDK, Pydantic AI, Google ADK, LangGraph (each with a violet sparkle),
    and a dashed "and more" tile with a plus, last, glowing softly.
- **3:29** In September 2026, investors valued Temporal at $12.55 billion.
  - Visuals: The chips and the symbol fall away as the camera starts to
    rise over a dark grid and parallax stars, riding the head of a glowing
    line: it reaches FEB 2022 $1.5B (Series B), MAR 2025 $1.72B (Series C)
    and FEB 2026 $5B (Series D), each marker and label flashing as the line
    hits it, with the value racing above; then a near-vertical neon surge
    to SEP 2026, the value blurring to $12.55B, and the arrival: a shake, a
    flash bloom, shockwave rings and sparks. The camera pulls back to the
    whole climb on the right, and "$12.55B" holds huge on the left,
    VALUATION · SEPTEMBER 2026 under it.

## Outro

- **3:40** Temporal keeps code running whatever fails, from everyday apps
  to AI agents.
  - Visuals: A constellation of Ziggy, Temporal's mascot, a tardigrade:
    its stars twinkle in one by one, then its lines draw stroke by stroke,
    around the body, along the feet, then the eye and the folds of its
    body, and a soft glow sweeps across the finished constellation. Below,
    the title "Meet" followed by the Temporal logo, and the tagline
    "DURABLE EXECUTION FOR APPS AND AI AGENTS".
