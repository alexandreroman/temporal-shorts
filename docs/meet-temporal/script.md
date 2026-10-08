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

- **0:11** Meet Maxim Fateev and Samar Abbas. In 2004, Maxim was tech lead
  of Simple Queue Service at Amazon.
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
- **0:18** In 2009 at Amazon, they led the launch of Simple Workflow
  Service, to run long processes reliably.
  - Visuals: Maxim's face travels to 2009 with a motion trail; Samar's name
    fades and his face flies to 2009: AMAZON / "Simple Workflow Service" /
    AWS WORKFLOW SERVICE.
- **0:25** In 2014 at Microsoft, Samar co-created the Durable Task
  Framework, the base of Azure Durable Functions.
  - Visuals: Samar travels to 2014: MICROSOFT / "Durable Task Framework" /
    AZURE DURABLE FUNCTIONS.
- **0:33** In 2015, both reunited at Uber to create Cadence. Open source
  since 2017, it ran Uber Eats orders.
  - Visuals: Both faces reach 2015: UBER / "Cadence" / UBER'S WORKFLOW
    ENGINE.
- **0:41** In October 2019, they left Uber to found Temporal: Cadence's
  successor, open source under MIT.
  - Visuals: Both travel to 2019: a highlighted tile (UV border and glow)
    THEIR OWN COMPANY / official Temporal logo / OPEN SOURCE, MIT LICENSE
    arrives with a bloom of light and violet ripples.

## 02 What Temporal does

- **0:49** The idea is Durable Execution: an app runs in steps, and Temporal
  records each one outside the app.
  - Visuals: Step tiles ORDER / CHARGE / SHIP / EMAIL on top; APP INSTANCE
    A on the left with a STEPS card (take the order, charge the card, ship
    the package, email the receipt); TEMPORAL panel ("OUTSIDE THE APP")
    with an EVENT HISTORY on the right. Steps 1 and 2 run; each result
    runs as a neon pulse along a cable into the history, where rows 1
    "Order #1042 received" and 2 "Card charged: $42" are SAVED; step 3
    starts.
- **0:57** If the app crashes, a new copy of the app starts and takes
  over.
  - Visuals: Crash during SHIP: a glitch (color fringes, torn bars,
    scanlines), shake, red flash; APP INSTANCE A CRASHED, its lines fall
    out, EMPTY, "APP CRASHED HERE" under the saved rows; A stays on screen,
    dead, for a moment. Then APP INSTANCE B rises into its place, booting
    behind a scanline (STARTING, then TAKING OVER), tagged NEW APP
    INSTANCE; A fades out only once B is there.
- **1:02** It gets the saved results back from the history, then picks up
  where it left off. No progress is lost.
  - Visuals: Replay, row by row: each saved row of the Event History is
    highlighted and turns REPLAYED, its result runs back to B as a violet
    pulse, and the step ticks on B without running again (REPLAYING…).
    Then B resumes at step 3: SHIP runs and is saved ("Package shipped"),
    then EMAIL ("Receipt emailed"), every tile checked; ORDER COMPLETE
    holds before the cut.

## 03 Where Temporal is used

- **1:11** A Workflow is any process that must finish correctly: payments,
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
- **1:19** Teams also run infrastructure, data pipelines and, more and
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

- **1:29** AI agents are long processes too: many LLM calls, tools to run,
  and waits for a person.
  - Visuals: The chapter opens on that same LLM orb and its halo, already
    at its final place: the halo fades into the LLM's own glow while the
    rest of the agentic loop of Durable AI Agents emerges around it: THINK
    (the LLM orb) on top, ACT (neon play tile) and OBSERVE (eye tile)
    below, "AGENTIC LOOP" in the middle. On the right, as in Durable AI
    Agents chapter 5, the goal card "Book lunch with Marie on Thursday."
    (YOU, with a discreet "RUN 1" tag), then one row per step: a neon
    token with a comet tail runs one turn of the loop per step (1.5 s), the
    node it passes swelling, the LLM thinking at THINK; each row slides in
    highlighted while its turn runs, its result and check appearing at the
    end: Check the calendar
    (Thu 12:30 is free), Find a restaurant (Chez Paulette), Book a table
    (table for 2, confirmed). LLM CALLS BILLED counts one call per turn
    (3): at each call the count swells and a neon coin drops onto a stack
    inside the tile, with a small bounce and a glint; a violet "WAITS FOR A
    PERSON" tag shows under the loop.
- **1:35** Every LLM call costs time and money. Without Durable Execution,
  a crash means starting over.
  - Visuals: The bill stands out. Then the crash, in held stages. Impact:
    the token stops dead mid-arc in step 4's turn (the invite), the screen
    shakes, a red flash and a glitch, the LLM shows a question mark.
    Break: the loop's arcs crack into red pieces that drift and fall
    slowly, the token fades out, the nodes and their labels dim to red.
    Loss: top to bottom, each done row's result is corrupted into glyphs,
    then dissolves into falling particles, its check turns into a red
    cross that vanishes, and the row greys out; a big red PROGRESS LOST
    pops over the broken loop with a jolt and a glow, and holds. The bill
    stays as it is, fully visible: the money spent is not lost. Restart,
    held: a violet "RESTARTING FROM STEP 1" banner with a rewind icon
    turning backwards replaces PROGRESS LOST over the loop, the pieces fly
    back and the loop re-forms, and the token reappears where it stopped
    and rewinds backwards a full turn, back to THINK; a bar of light wipes
    up the list, leaving the three steps empty, to do again, and the goal
    card's "RUN 1" tag turns to a red "RUN 2". Then the agent runs steps 1
    to 3 again, at a calmer pace (2 s a turn): each row reads "RUNNING
    AGAIN" while its turn runs, then gets its result and check, and each
    LLM call is billed again, a red coin landing on top of the stack: 4,
    5, 6, "+3 PAID AGAIN", the pile now twice as high as what was useful. A red
    WITHOUT TEMPORAL tag then holds over the loop, on that outcome: six LLM
    calls billed for three useful steps.
- **1:51** Let's rewind and run the same agent with Temporal.
  - Visuals: A VCR rewind: a blinking REWIND display with a timecode
    counting backwards in the top left corner, tracking noise bands and
    scanlines over the stage, a color fringe; the failed run plays
    backwards, fast: the reruns undo and the red coins fly back up out of
    the stack (6 to 3), the list rewinds to its greyed rows, PROGRESS LOST
    and the crash un-happen, the token runs backwards round the loop, the
    first run's rows slide out and the neon coins leave, back to the start:
    the goal card, empty steps, 0 billed. The tape stops with a jolt and
    PLAY shows for a moment.
- **1:56** There's a better way: with Durable Execution, an agent never
  loses its progress.
  - Visuals: The failed run clears: the loop, the steps and the bill fade
    out. A message card on the dark stage, on a soft violet glow: the
    official Temporal logo glows up, "There's a better way" rises below it
    (108 px, "better" in violet with a glow) as its letters close in, then
    DURABLE EXECUTION in violet mono; it holds. Then the card fades while
    a glowing UV ring leaves it and condenses around the loop, which comes
    back inside it.
- **2:03** With Temporal, every step the agent takes is saved in an Event
  History, outside the app.
  - Visuals: The loop, inside its Temporal ring, now runs in APP INSTANCE A
    on the left, a WITH TEMPORAL tag in its middle. On the right, a
    TEMPORAL panel ("OUTSIDE THE APP") with an EVENT HISTORY, and under it
    a fresh LLM CALLS BILLED tile. The agent runs steps 1 to 3, one turn
    each: its LLM call (an "LLM CALL" card from THINK) and its tool result
    (a "TOOL CALL" card from ACT) fly into the history, where the rows "LLM
    call: check the calendar", "Calendar: Thu 12:30 is free", and so on
    turn SAVED; a neon coin lands on the bill at each call: 1, 2, 3.
- **2:11** After a crash, the agent gets its saved results back and
  resumes at the invite: nothing is paid twice.
  - Visuals: Crash before the invite: shake, red flash, a bolt and APP
    CRASH on the dimmed loop, APP INSTANCE A CRASHED; the history keeps
    its six rows, tinted, over "APP CRASHED HERE". A leaves; APP INSTANCE B
    slides into its place with a violet glow, NEW APP INSTANCE in the
    loop's middle. Replay: each saved row is highlighted, turns REUSED and
    hands its result back to the loop, then reads "REUSED, NOT RE-BILLED"
    (LLM calls) or "REUSED, NOT RE-RUN" (tools); the bill stays at 3, "NOT
    RE-BILLED". Then the invite runs for real: LLM call 4, a coin lands,
    rows 7 "LLM call: invite Marie" and 8 "Email: invite sent" SAVED, AGENT
    COMPLETE in the loop.
- **2:20** That's why OpenAI built Codex on Temporal, and Cursor, Lovable
  and Replit rely on it too.
  - Visuals: The completed state holds; next to the bill's 4, "INSTEAD OF
    7" (the failed run's six calls plus the invite it never reached).

## 05 Open source and Cloud

- **2:29** Temporal is open source: Temporal 1.0 shipped in 2020, and anyone
  can run it on their own servers.
  - Visuals: Three tiles across the top, one by one: "Open source" (MIT
    LICENSE), "Temporal 1.0" (2020), "Self-hosted" (ON YOUR OWN SERVERS).
- **2:36** Temporal Cloud runs the service for you. Your code stays in your
  environment: Temporal never sees it.
  - Visuals: On the right, TEMPORAL CLOUD (UV border, official logo):
    "Temporal Service" and three bars SECURITY & COMPLIANCE, CONTROL PLANE
    & SCALE, HIGH AVAILABILITY; on the left, YOUR ENVIRONMENT (dashed slate
    border, "YOUR APP, YOUR CODE"): YOUR APP with a small Workflow card and
    TEMPORAL SDK · OPEN SOURCE; then NEVER SEES YOUR CODE.
- **2:44** Connections only go out from your side, and data stays encrypted
  end to end.
  - Visuals: A one-way arrow draws from your environment to Temporal Cloud,
    OUTBOUND ONLY, mTLS; neon packets flow out along it; an inbound attempt
    from the cloud bounces off your side (red cross). A piece of data,
    "card: $42", leaves your app, scrambles into glyphs as it leaves your
    environment and lands encrypted in the Temporal Service; END-TO-END
    ENCRYPTION, its lock snapping shut.

## 06 Temporal today

- **2:52** Today, more than 4,300 companies pay for it, including Netflix,
  Snap, NVIDIA, Salesforce and Shopify.
  - Visuals: PAYING CUSTOMERS, alone in the middle: the count rolls up to
    "4,300+", then the names pop in as mono pills (NETFLIX, SNAP, NVIDIA,
    SALESFORCE, SHOPIFY) and start moving on a belt.
- **3:00** In September 2026, investors valued Temporal at $12.55 billion.
  The team has doubled in a year.
  - Visuals: The customers tile moves left as the VALUATION chart comes in:
    bars proportional to the value grow one by one, 2022 $1.5B, 2025
    $1.72B, FEB 2026 $5B, SEP 2026 $12.55B (the last one violet to UV), a
    violet trend line climbs over them and a burst of light lands on
    $12.55B; then the EMPLOYEES tile rolls up to "570", DOUBLED IN A YEAR.

## Outro

- **3:08** Temporal keeps code running whatever fails, from everyday apps
  to AI agents.
  - Visuals: The two founders' faces, cropped from the photo, side by side,
    in a small constellation of twinkling stars and lines; title "Meet
    Temporal", tagline "DURABLE EXECUTION FOR APPS AND AI AGENTS", Temporal
    logo.
