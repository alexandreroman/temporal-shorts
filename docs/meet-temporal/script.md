# Script and timeline: Meet Temporal

Subtitles are the only narration (no audio). Each subtitle lasts as long
as its text needs (`autoDur` in `src/engine.js`), plus its `after` pause.
Run `make timeline THEME=meet-temporal` for the live values; the start
times below are a snapshot from 2026-10-07.

Each entry gives the subtitle start time and its exact text, then what the
animation shows.

## Audience and goal

Someone who has never heard of Temporal learns who created it, where it
comes from, what it does, where the company stands today and why it
matters for AI. The video follows the founders, Maxim Fateev and Samar
Abbas, from their careers at Microsoft and Amazon (careers only, no
countries of origin) through the lineage Amazon Simple Workflow Service,
Microsoft Durable Task Framework, Uber Cadence, then Temporal, explains
Durable Execution with the order of the series (ORDER, CHARGE, SHIP,
EMAIL), and ends on the company's figures and its AI customers.

The format is a short company introduction, not an explainer: there is no
"What you get" recap chapter, and the outro sums up. Companies are named
in plain text, with no third-party logos; LLM providers are named by
company, never by model.

### Sources

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
    right the official Temporal symbol, large, on a soft violet glow, with
    orbiting everyday-app icons: cart, card, car, play, AI spark.

## 01 Two engineers

- **0:09** Meet Maxim Fateev and Samar Abbas, the two engineers who created
  Temporal.
  - Visuals: The official photo of the two founders, large and centered,
    framed with a UV border and glow and a dark vignette; a mono name under
    each person: SAMAR ABBAS (CO-FOUNDER, CEO) on the left, MAXIM FATEEV
    (CO-FOUNDER, CTO) on the right.
- **0:14** Maxim joined Amazon in Seattle in 2002 and became tech lead of
  its messaging platform.
  - Visuals: The photo gives way to two founder cards side by side, each
    with the face cropped from the photo in a violet ring: MAXIM FATEEV
    (CO-FOUNDER, CTO), SAMAR ABBAS (CO-FOUNDER, CEO). Under Maxim's card, his
    career draws step by step: an arrow, the tile AMAZON · 2002 (SEATTLE),
    an arrow, the tile MESSAGING PLATFORM (TECH LEAD).
- **0:21** Samar started at Microsoft, then joined Maxim's team at Amazon:
  that is where they met.
  - Visuals: Under Samar's card, a long arrow to the tile MICROSOFT, bottom
    aligned with MESSAGING PLATFORM; both careers curve into a shared tile
    between the columns, SAME TEAM (AMAZON); the M and S markers land in it
    and it turns violet.

## 02 From Amazon to Uber

- **0:29** At Amazon, they built Simple Workflow Service, launched in 2012,
  to run long processes reliably.
  - Visuals: A horizontal timeline with four milestones; the M and S
    markers ride the line, the travelled part violet. The first milestone
    lights up: 2012, tile AMAZON / "Simple Workflow Service" /
    LONG-RUNNING PROCESSES.
- **0:37** Back at Microsoft, Samar co-created the Durable Task Framework,
  the base of Azure Durable Functions.
  - Visuals: S travels to the second milestone (no year): tile MICROSOFT /
    "Durable Task Framework" / AZURE DURABLE FUNCTIONS.
- **0:44** In 2015, both joined Uber and built Cadence. Open source since
  2017, it ran Uber Eats orders.
  - Visuals: M and S meet at the third milestone: 2017, tile UBER /
    "Cadence" / OPEN SOURCE, UBER EATS.
- **0:51** In October 2019, they left Uber to found Temporal: Cadence's
  successor, open source under MIT.
  - Visuals: Both travel to the last milestone: 2019 in violet, a
    highlighted tile (UV border and glow) THEIR OWN COMPANY / official
    Temporal logo / OPEN SOURCE, MIT LICENSE.

## 03 What Temporal does

- **1:00** The idea is Durable Execution: an app runs in steps, and Temporal
  records each one outside the app.
  - Visuals: Step tiles ORDER / CHARGE / SHIP / EMAIL on top; APP INSTANCE
    A on the left with a STEPS card (take the order, charge the card, ship
    the package, email the receipt); TEMPORAL panel ("OUTSIDE THE APP")
    with an EVENT HISTORY on the right. Steps 1 and 2 run; each result
    flies from the app into the history, where rows 1 "Order #1042
    received" and 2 "Card charged: $42" are SAVED; step 3 starts.
- **1:07** If the app crashes, another copy picks up right where it left
  off. No progress is lost.
  - Visuals: Crash during SHIP: shake, red flash, APP INSTANCE A CRASHED,
    its lines fall out, EMPTY; "APP CRASHED HERE" under the saved rows.
    APP INSTANCE B takes over, rows 1 and 2 turn REPLAYED and its lines
    come back checked; it resumes at step 3: rows 3 "Package shipped" and 4
    "Receipt emailed" are SAVED, every tile checked, ORDER COMPLETE.

## 04 Temporal today

- **1:16** Temporal 1.0 shipped in 2020, then Temporal Cloud, a managed
  service. The code stays open source.
  - Visuals: Three tiles across the top: "Temporal 1.0" (2020), an arrow
    to "Temporal Cloud" (MANAGED SERVICE), then "Open source" (MIT
    LICENSE).
- **1:23** Today, more than 4,300 companies pay for it, including Netflix,
  Snap, NVIDIA, Salesforce and Shopify.
  - Visuals: PAYING CUSTOMERS tile, "4,300+", then the names as mono pills
    one by one: NETFLIX, SNAP, NVIDIA, SALESFORCE, SHOPIFY.
- **1:31** In September 2026, investors valued Temporal at $12.55 billion.
  The team has doubled in a year.
  - Visuals: VALUATION chart, bars proportional to the value, growing one
    by one: 2022 $1.5B, 2025 $1.72B, FEB 2026 $5B, SEP 2026 $12.55B (the
    last one violet to UV, its value larger); then the EMPLOYEES tile
    "570", DOUBLED IN A YEAR.

## 05 Why it matters for AI

- **1:40** AI agents are long processes too: many LLM calls, tools to run,
  and waits for a person.
  - Visuals: An agent loop (LLM orb on top, TOOL tile and PERSON avatar
    below, "AGENT LOOP" in the middle) with a neon token running round it;
    on the right LLM CALLS BILLED counts each turn and AGENT PROGRESS fills
    one step per turn (out of 6).
- **1:46** Every LLM call costs time and money. Without Durable Execution,
  a crash means starting over.
  - Visuals: The bill stands out; after 3 steps, a crash: shake, red
    flash, red loop, "START OVER", the LLM puzzled, AGENT PROGRESS drains
    to 0 / 6, PROGRESS LOST. The loop restarts from step 1 and the bill
    keeps adding: 5, "+1 PAID AGAIN".
- **1:54** OpenAI built Codex on Temporal, and Cursor, Lovable and Replit
  rely on it too.
  - Visuals: The bill and the progress fade out; a TEMPORAL panel ("DURABLE
    AGENT") frames the loop, which runs again; BUILT ON TEMPORAL with pills
    OPENAI · CODEX, then CURSOR, LOVABLE, REPLIT.

## Outro

- **2:01** Temporal keeps code running whatever fails, from everyday apps
  to AI agents.
  - Visuals: The two founders' faces, cropped from the photo, side by side,
    title "Meet Temporal", tagline "DURABLE EXECUTION FOR APPS AND AI
    AGENTS", Temporal logo.
