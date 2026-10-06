# Script and timeline: Human-in-the-Loop

Subtitles are the only narration (no audio). Timings are computed in
`src/engine.js` from text length (`autoDur`: chars / 16 + 0.6 s, clamped
2.4 to 8 s), plus per-subtitle `after` pauses. Run
`make timeline THEME=human-in-the-loop` for the live values; the start times
below are a snapshot from 2026-10-05.

Each entry gives the subtitle start time and its exact text, then what the
animation shows.

## Audience and goal

A non-technical audience learns how a Temporal Workflow waits durably for a
person's decision, such as an approval, for minutes or days, then resumes
where it left off. One running example carries the whole video: Sam orders
a $2,400 laptop, above the $1,000 limit, so Maria, the manager, must approve
it. The process has four steps: CHECK the request, APPROVAL by Maria, ORDER
the laptop, NOTIFY Sam.

## Intro

- **0:01** Some processes need a person to decide: approve a purchase,
  review a contract. How does the app wait?
  - Visuals: Temporal logo, kicker "AN EXPLAINER FOR EVERYONE", title "How
    does an app wait for a person?", tagline "HUMAN-IN-THE-LOOP WITH
    TEMPORAL"; on the right a large approval request card ("New laptop for
    Sam", "$2,400", Approve / Reject, a ticking mini clock) with orbiting
    icons.

## 01 A step that needs a person

- **0:10** Take a simple process: Sam orders a new laptop for $2,400. Above
  $1,000, a manager must approve it.
  - Visuals: The 4 step tiles CHECK / APPROVAL / ORDER / NOTIFY, rule pill
    "OVER $1,000: MANAGER APPROVAL", Sam's avatar and purchase request
    card ("New laptop for Sam", "$2,400", "SENT BY SAM"), centered.
- **0:18** The app checks the request, then asks Maria, the manager, to
  approve it. Now it waits for an answer.
  - Visuals: The request card flies into the CHECK tile, which runs and is
    checked; APPROVAL runs; the approval request card flies from the
    APPROVAL tile to Maria ("MARIA, MANAGER"); the APPROVAL tile turns
    WAITING (flipping hourglass).
- **0:26** Maria may answer in two minutes, or in three days: busy in
  meetings, traveling, or on vacation.
  - Visuals: Clock with fast-spinning hands, day counter DAY 1 to DAY 3
    ("WAITING FOR MARIA"), tags IN MEETINGS / TRAVELING / ON VACATION
    stacked next to Maria.

## 02 Waiting is the hard part

- **0:36** But the app can't simply pause for three days. Its memory lives
  on one machine, and machines restart.
  - Visuals: APP panel ("WAITING FOR MARIA") whose APP MEMORY holds
    "Request #1042", "Step: approval", "Waiting for Maria"; a day timeline
    with RESTART and DEPLOY markers; the marker stops at RESTART: the
    memory chips fall, EMPTY, "REQUEST LOST".
- **0:44** So teams build the waiting by hand: a database, status flags,
  scheduled jobs, code to resume later.
  - Visuals: The timeline fades; DATABASE and RESUME CODE pop in beside the
    app, STATUS FLAGS and SCHEDULED JOBS under it, joined by tangled links;
    the memory chips come back, saved by hand, and the app status returns
    to WAITING FOR MARIA.
- **0:53** That's a lot of plumbing to get right. One missed case, and a
  request is stuck, or ordered twice.
  - Visuals: Two links turn red; red tags "REQUEST STUCK" and "ORDERED
    TWICE" under the side tiles.

## 03 A Workflow that waits

- **1:02** With Temporal, the whole process is a Workflow: ordinary code
  that runs the steps in order.
  - Visuals: Step tiles on top; APP INSTANCE A on the left with a WORKFLOW
    card listing the steps as lines (check the request, ask Maria, wait for
    the decision, place the order, notify Sam); TEMPORAL panel ("OUTSIDE
    THE APP") with an EVENT HISTORY on the right. The cursor runs the first
    lines; rows 1 "Workflow started: laptop for Sam", 2 "Request checked:
    $2,400", 3 "Approval requested: Maria" are SAVED as the steps check.
- **1:10** When it reaches the approval, the Workflow just waits, as long as
  it takes. A minute or a month.
  - Visuals: Cursor parked on "wait for the decision" (hourglass), the app
    status reads "WAITING, NO CODE RUNNING" and its gear stops; a pulsing
    "WAITING FOR A SIGNAL" line in the history; a clock strip under the app
    panel fast-forwards the day counter.
- **1:18** Temporal keeps its Event History, outside the app. Restarts and
  deploys come and go; the wait survives.
  - Visuals: "OUTSIDE THE APP" brightens and the SAVED tags pulse; DEPLOY
    and RESTART pills pop next to the clock, a soft flash and shake: APP
    INSTANCE A STOPPED, its WORKFLOW lines fall out, EMPTY; the history
    stays, with a "STILL WAITING" tag on the waiting line.

## 04 The decision arrives

- **1:29** On day three, Maria taps Approve. Temporal delivers the decision
  to the Workflow as a Signal.
  - Visuals: Day counter DAY 3; Maria and the approval card in the left
    column, tap on Approve (it turns "Approved"); a "SIGNAL: APPROVED" pill
    flies into the Event History; row 4 "Signal: approved by Maria" SAVED,
    the clock caption turns "ANSWER RECEIVED".
- **1:37** Any running copy of the app picks it up, replays the history, and
  resumes right after the wait.
  - Visuals: APP INSTANCE B takes over (TAKING OVER, REPLAYING…); rows 1 to
    3 are highlighted in turn and tagged REPLAYED, then row 4, the Signal,
    is read and keeps SAVED (it is new to the Workflow); the WORKFLOW cursor
    runs the first lines again without redoing the steps, passes the wait
    and lands after it ("RESUMED AFTER THE WAIT"); APPROVAL is checked.
- **1:45** The order is placed and Sam is notified. No step was redone, and
  nothing was lost along the way.
  - Visuals: ORDER and NOTIFY run and check; rows 5 "Order placed: laptop"
    and 6 "Sam notified" SAVED; "1 ORDER" ticket; WORKFLOW COMPLETE.

## 05 Deadlines and reminders

- **1:55** No answer? The Workflow can also wait on a timer: a reminder after
  two days, escalation after five.
  - Visuals: Day timeline DAY 0 to DAY 5 with a moving hourglass marker:
    APPROVAL REQUESTED at DAY 0, a bell and "REMINDER SENT" at DAY 2,
    "ESCALATED TO A DIRECTOR" at DAY 5; below, an EVENT HISTORY writes
    "Timer started: reminder in 2 days" and "Timer started: escalation in 5
    days" at DAY 0, "Timer fired: reminder due" at DAY 2, "Timer fired:
    escalation due" at DAY 5, each SAVED; pill "TIMERS ARE DURABLE TOO".
- **2:03** Approvals, reviews, signatures, an AI agent asking before it acts:
  the same pattern fits them all.
  - Visuals: 4 tiles: Approvals / Reviews / Signatures / AI agent checks.

## Outro

- **2:13** Temporal Workflows wait for people as long as it takes, and pick
  up right where they left off.
  - Visuals: Person avatar with a neon check badge, title
    "Human-in-the-Loop", tagline "WAITS AS LONG AS IT TAKES", Temporal
    logo.
