// ===================== 2. SURVIVES CRASHES
// Step row on top; APP INSTANCE A and its two counters on the left, the TEMPORAL panel and its Event History on
// the right. A runs the turn and each result is saved in the history; at step 5 the app glitches, then crashes: a
// red bolt strikes its panel and APP CRASH stands where the step was, while Temporal stays still. Once both are
// gone, the dead instance A greys, drops and fades, a new instance B slides in to the same place, and Temporal hands
// it the agent's Workflow (as the Worker takeover in durable-execution chapter 6). B replays steps 1 to 4 from the
// history and runs step 5 for real.
// The block keeps every name declared in this file local to this scene.
{
  // One agent turn: model steps (UV rows) and tool steps (black rows), as in durable-ai-agents chapter 7
  const STEPS = [
    { icon: 'agent', label: 'Plan', call: ['Model:', 'plan the trip'], row: 'Model: plan the trip' },
    {
      icon: 'search', label: 'Search flights', call: ['search_flights', 'Lisbon'],
      row: 'search_flights: 3 flights found',
    },
    { icon: 'agent', label: 'Pick', call: ['Model:', 'pick a flight'], row: 'Model: pick the $480 flight' },
    { icon: 'plane', label: 'Book flight', call: ['book_flight', '$480'], row: 'book_flight: booked, $480' },
    { icon: 'agent', label: 'Reply', call: ['Model:', 'write the reply'], row: 'Model: write the reply' },
  ];
  const isModel = i => STEPS[i].icon === 'agent';
  // result card of step i, labeled with the kind of call it comes from, as in the subtitle
  const makeStepCard = (root, i) => makeCallCard(root, isModel(i), { modelLabel: 'MODEL CALL' });
  // Layout: step tiles on top; the app and its counters on the left, Temporal and its Event History on the right.
  // The step row spans exactly the width of the components below it, from LEFT to RIGHT. On the content frame
  // y 150-880: the step row's top at 150, the panels 86 px below it, the counters and the TEMPORAL panel ending at 880.
  const LEFT = 140, RIGHT = 1780;
  const ROW = { w: 240, h: 110, y: 205 };
  const ROW_GAP = (RIGHT - LEFT - ROW.w) / 4; // center to center: five tiles, equal gaps
  const APP = { x: 465, y: 499, w: 650, h: 306, lblY: 493, chipY: 549 };
  // the crash on A: APP CRASH centered between the step label and the chip (where TURN COMPLETE shows later), the
  // bolt in the panel's right part, clear of the status text above it and of the tag on its left
  const CRASH_TAG = { x: APP.x, y: (APP.lblY + APP.chipY) / 2, w: 250 };
  const BOLT = { x: 715, y: 483, size: 140 };
  // the takeover (see TAKEOVER): the dead instance A drops 40 px, faded out by then, 8 px above the counters.
  // NEW INSTANCE stands where APP CRASH stood on A: the top edge has no room for it between the panel name and the
  // status. Fixed even size, so it rests on whole pixels.
  const NEW_TAG = { w: 250, h: 52 };
  // the Workflow card flies from the first history row to B's status, at the panel's top right (inside the panel)
  const STATUS_AT = { x: APP.x + APP.w / 2 - 100, y: APP.y - APP.h / 2 + 38 };
  const COUNTER = { y: 790, w: 305, h: 180 };
  const TEMPORAL = { x: 1340, y: 613, w: 880, h: 534 };
  const HIST = { x: 1340, y: 648, w: 824, h: 404, row0: 80, rowGap: 62 };
  const CARD_X = HIST.x - HIST.w / 2 + 110; // where result cards land, on the left part of the rows
  const rowTop = i => HIST.row0 + i * HIST.rowGap; // inside the Event History card
  const rowY = i => HIST.y - HIST.h / 2 + rowTop(i) + 18; // on the stage, where result cards land

  // the step tiles in a row joined by thin links, with this turn's five steps
  const makeTurnRow = (root, svg) => {
    const steps = STEPS.map(st => [st.icon, st.label]);
    return makeStepRow(root, svg, steps, LEFT + ROW.w / 2, ROW_GAP, ROW.y, ROW.w, ROW.h);
  };
  // counter tile at a fixed height, its content centered vertically, so both columns end on the same line
  const makeTallCounter = (p, label) => {
    const e = makeCounter(p, label, COUNTER.w, { h: COUNTER.h });
    Object.assign(e.style, { display: 'flex', flexDirection: 'column', justifyContent: 'center' });
    return e;
  };

  scene({
    chapter: 2, title: 'Survives crashes',
    // the chapter header reads before the first subtitle; the final composition holds before the fade
    pre: 1.5, post: 2.0,
    subs: [
      {
        text: "Every model call and tool call is saved in the agent's Temporal history as soon as it completes.",
        after: 1.75,
      },
      { text: 'The next step starts only after the previous result is saved, outside the app.', after: 2.2 },
      { text: "If the app crashes mid-turn, another copy picks up the agent exactly where it left off.", after: 0.6 },
      {
        text: 'Instance B replays the history: steps 1 to 4 return their saved results, then step 5 runs for real.',
        after: 2.5,
      },
      {
        text: 'Saved results are reused, not redone: no finished model call is paid again, no finished tool reruns.',
        after: 0.5,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.steps = makeTurnRow(root, s.svg);
      // app side: instance A, then instance B in the same place, showing the step at work
      s.A = makeAppPanel(root, 'APP INSTANCE A', APP.w, APP.h);
      s.B = makeAppPanel(root, 'APP INSTANCE B', APP.w, APP.h);
      s.chipLbl = E(root, '', 'lbl', { fontSize: '16px' });
      s.chips = STEPS.map((st, i) => callCard(root, st.call[0], st.call[1], isModel(i) ? 'uv' : ''));
      s.done = tag(root, 'Turn complete', 'neon');
      s.billed = makeTallCounter(root, 'Model calls billed');
      s.booked = makeTallCounter(root, 'Flights booked');
      // Temporal side, outside the app: native-size logo header (whole pixels, never scaled) and the Event History
      s.temporal = makeTemporalPanel(root, TEMPORAL.w, TEMPORAL.h, { logoAt: [28, 30], noteAt: [28, 36] });
      // rows 1-4 survive the crash: tinted block + crash line under them
      s.history = makeHistoryCard(root, STEPS.map(st => st.row), {
        uvRow: isModel, w: HIST.w, h: HIST.h, rowTop, tagTop: i => rowTop(i) + 5,
        crash: {
          keptTop: rowTop(0) - 8, keptH: 3 * HIST.rowGap + 54, cutTop: rowTop(4) - 8,
          label: 'APP CRASHED HERE', labelX: '56%', labelFont: 13,
        },
        scanH: 42, scanDy: -2,
      });
      s.saveCards = STEPS.map((_, i) => makeStepCard(root, i));
      s.reuseCards = STEPS.slice(0, 4).map((_, i) => makeStepCard(root, i));
      // the agent's Workflow, handed to instance B
      s.handCard = makeHandOffCard(root, 'AGENT WORKFLOW');
      s.newTag = makeNewTag(root, 'New instance', NEW_TAG.w, NEW_TAG.h);
      // the solid tag hides the tail of the falling step chip
      s.crash = makeCrashMarks(root, 'App crash', BOLT, CRASH_TAG);
      s.flash = makeFlash(root);
    },
    update(t, c, s) {
      // first run (instance A), two steps per subtitle: each step runs, its result card leaves at r + CARD_AT,
      // lands in the history at r + SAVE_AT where its row reads SAVED, and only then the next step starts
      const CARD_AT = 1.2, SAVE_AT = 2.1;
      const run = [c[0] + 1.0, c[0] + 4.2, c[1] + 0.6, c[1] + 3.8];
      // c[2]: step 5 starts, the app glitches then crashes; A's CRASHED status, bolt and tag leave from aOut
      const firstTry = c[2] + 0.4, crashAt = c[2] + 2.0, tagAt = crashAt + 0.45;
      const aOut = crashAt + 1.5;
      // then A leaves (aDrop), B arrives (bIn, the reset of the step row) and Temporal hands it the Workflow: the card
      // leaves the history at handOff and reaches B's status at takeOver
      const aDrop = aOut + 0.25, bIn = aDrop + 0.6, handOff = bIn + 0.9, takeOver = handOff + 0.55;
      const reset = bIn;
      // c[3]: B replays rows 1-4 one by one, then step 5 runs for real
      const replay = [0, 1, 2, 3].map(i => c[3] + 0.5 + i * 1.2);
      run.push(c[3] + 5.4);
      const rerun = run[4], saved = run.map(r => r + SAVE_AT);
      // c[4]: the tags explain why it matters, the counters glow and the turn completes
      const told = replay.map((_, i) => c[4] + 0.5 + i * 0.3);
      const glow = c[4] + 2.2, doneAt = c[4] + 3.9;
      const [sx, sy] = shakeAt(t, crashAt);
      const dead = t >= crashAt, onA = t < bIn;
      // the app side shakes with the crash; Temporal, outside the app, stays still
      const ax = onA ? sx : 0, ay = onA ? sy : 0;
      // the failure builds up before the crash: A's border and status flicker red, the running chip jitters
      const glitch = crashGlitch(t, crashAt);

      // steps: before the reset, instance A runs them; after it, rows 1-4 re-check without running
      const states = STEPS.map((_, i) => {
        if (t < reset) {
          if (i === 4) return dead ? 3 : t >= firstTry ? 1 : 0;
          return t >= saved[i] + 0.1 ? 2 : t >= run[i] ? 1 : 0;
        }
        if (i === 4) return t >= saved[4] + 0.1 ? 2 : t >= rerun ? 1 : 0;
        return t >= replay[i] + 0.7 ? 2 : 0; // checked once its result card is back in the app
      });
      placeStepRow(s.steps, t, c[0] + 0.2, states, ax, ay);

      // instance A runs, crashes, then leaves like a dead machine: it greys, drops and fades out
      const aIn = P(t, c[0] + 0.1, 0.5, backOut);
      const leave = leavingInstance(t, aDrop);
      place(s.A, APP.x + ax, APP.y + ay + leave.dy, aIn, clamp(aIn * 2) * leave.o);
      if (dead) setAppStatus(s.A, 'CRASHED', 'crashed');
      else setAppStatus(s.A, 'RUNNING THE AGENT', t >= run[0] ? 'running' : 'idle');
      glitchPanel(s.A, glitch);
      s.A.st.style.opacity = 1 - P(t, aOut, 0.25);
      s.A.style.filter = leave.grey;
      // a new instance B slides in from the left once A is gone, its border glowing violet while it arrives and
      // takes over; IDLE until the Workflow card reaches it
      const arrive = arrivingInstance(t, bIn);
      place(s.B, APP.x + arrive.dx, APP.y, 1, arrive.o);
      if (t < takeOver) setAppStatus(s.B, 'IDLE', 'stopped');
      else if (t < replay[0]) setAppStatus(s.B, 'TAKING OVER', 'running');
      else if (t < rerun) setAppStatus(s.B, 'REPLAYING…', 'running');
      else if (t < doneAt) setAppStatus(s.B, 'RUNNING THE AGENT', 'running');
      else setAppStatus(s.B, 'IDLE', 'idle');
      setArrivalGlow(s.B, t, bIn, replay[0] - 0.3);

      // the step at work in the app, shown until the next one starts: run for real, or handed back from
      // the history during the replay. Each chip fades out before the next fades in, so texts never overlap.
      const nextRun = [run[1], run[2], run[3], firstTry];
      const nextReplay = [replay[1], replay[2], replay[3], rerun];
      const chipOn = s.chips.map((_, i) => {
        if (i === 4) return win(t, rerun, doneAt - 0.45, 0.15);
        const live = win(t, run[i], nextRun[i] - 0.15, 0.15);
        const back = win(t, replay[i], nextReplay[i] - 0.12, 0.12);
        return Math.max(live, back);
      });
      // step 5 on instance A falls with the crash
      const fall = P(t, crashAt + 0.1, 0.6, easeIn);
      s.chips.forEach((e, i) => {
        if (i === 4 && t < reset) {
          const x = APP.x + ax + glitch.dx;
          place(e, x, APP.chipY + ay + fall * 120, 1, win(t, firstTry, aOut, 0.15) * (1 - fall), fall * -12);
        } else {
          place(e, APP.x + ax, APP.chipY + ay, 1, chipOn[i]);
        }
      });
      // label over the chip: the step number, or where its result comes from during the replay
      const replaying = t >= reset && t < rerun;
      let step;
      if (t < reset) step = t >= firstTry ? 4 : Math.max(0, run.filter(r => t >= r).length - 1);
      else step = replaying ? Math.max(0, replay.filter(q => t >= q).length - 1) : 4;
      s.chipLbl.textContent = replaying ? `Step ${step + 1}: from the history` : `Step ${step + 1} of 5`;
      s.chipLbl.style.color = replaying ? C.violet : C.slate;
      // A's label goes out at once with the crash, before APP CRASH pops in where it was
      const lblOff = P(t, crashAt + 0.1, 0.2);
      const lblOn = Math.max(win(t, run[0], aOut, 0.15) * (1 - lblOff), win(t, replay[0], doneAt - 0.45, 0.15));
      place(s.chipLbl, APP.x + ax, APP.lblY + ay, 1, lblOn);
      const dp = P(t, doneAt, 0.45, backOut);
      place(s.done, APP.x, (APP.lblY + APP.chipY) / 2, dp, clamp(dp * 2));

      // counters: only the 3 real model calls are billed and the flight is booked once; the replay costs nothing
      const calls = [0, 2, 4].filter(i => t >= saved[i]).length;
      const billedGlow = P(t, glow, 0.4), bookedGlow = P(t, glow + 0.5, 0.4);
      const notBilled = win(t, replay[0], rerun, 0.3);
      setCounter(s.billed, calls, billedGlow > 0 ? 'NOT 5' : 'NOT RE-BILLED');
      s.billed.note.style.opacity = Math.max(notBilled, billedGlow);
      const booked = t >= saved[3] ? 1 : 0;
      setCounter(s.booked, booked, bookedGlow > 0 ? 'ONLY ONCE' : 'NOT RE-RUN');
      s.booked.note.style.opacity = Math.max(win(t, replay[3], rerun, 0.3), bookedGlow);
      [[s.billed, billedGlow, notBilled], [s.booked, bookedGlow, 0]].forEach(([e, g, hint]) => {
        e.n.style.color = g > 0.5 ? C.neon : C.ink;
        e.style.borderColor = g > 0.5 || hint > 0.5 ? C.neon : C.line;
        e.style.boxShadow = glowShadow(RGB.neon, g, { blur: 28, alpha: 0.3 });
      });
      // the number pops when it changes (the model calls are saved far apart, so their swells never overlap)
      const billedSwell = Math.max(...[0, 2, 4].map(i => swell(t, saved[i], 0.12)));
      s.billed.n.style.transform = `scale(${billedSwell})`;
      s.booked.n.style.transform = `scale(${swell(t, saved[3], 0.12)})`;
      const counterIn = i => P(t, c[0] + 0.5 + i * 0.12, 0.45, backOut);
      const counterX = [APP.x - APP.w / 2 + COUNTER.w / 2, APP.x + APP.w / 2 - COUNTER.w / 2];
      [s.billed, s.booked].forEach((e, i) => {
        place(e, counterX[i] + ax, COUNTER.y + ay, counterIn(i), clamp(counterIn(i) * 2));
      });

      // Temporal panel: faded in at native size (no scale), so the header logo stays pixel-aligned
      place(s.temporal, TEMPORAL.x, TEMPORAL.y, 1, P(t, c[0] + 0.3, 0.5));
      place(s.history, HIST.x, HIST.y, 1, P(t, c[0] + 0.45, 0.5));

      // MODEL CALL and TOOL CALL cards: app -> Temporal when saving, Temporal -> app when replaying
      s.saveCards.forEach((e, i) => {
        const r = run[i];
        const [x1, y1] = [CARD_X, rowY(i)];
        fly(e, t, r + CARD_AT, APP.x + ax, APP.chipY + ay, r + CARD_AT + 0.15, 0.7, x1, y1, r + SAVE_AT, x1, y1);
      });
      s.reuseCards.forEach((e, i) => {
        const q = replay[i];
        fly(e, t, q, CARD_X, rowY(i), q + 0.1, 0.6, APP.x, APP.chipY, q + 0.7, APP.x, APP.chipY);
      });

      // Event History rows and their status tags
      markCrash(s.history, t, crashAt);
      s.history.rows.forEach((r, i) => showRow(r, P(t, saved[i] - 0.1, 0.3)));
      s.history.tags.forEach((e, i) => {
        const isReused = i < 4 && t >= replay[i] + 0.05, isTold = i < 4 && t >= told[i];
        const label = isTold ? reusedLabel(isModel(i)) : isReused ? 'REUSED' : 'SAVED';
        const switchedAt = isTold ? told[i] : isReused ? replay[i] + 0.05 : saved[i];
        placeStatusTag(e, t, label, isTold || isReused ? 'reused' : 'saved', P(t, saved[i], 0.25), switchedAt);
      });
      const scanning = replay.findIndex(q => t >= q && t < q + 1.0);
      scanRow(s.history, scanning);
      // crash: red flash and a bolt strikes A's panel; once step 5's chip has mostly fallen out, APP CRASH stands
      // in the panel. Both shake with the app side and leave with A's CRASHED status, before A drops.
      placeFlash(s.flash, t, crashAt);
      placeCrashMarks(s.crash, t, crashAt, tagAt, aOut, ax, ay);
      // takeover: NEW INSTANCE pops in B once it is almost in place and is gone at c[3], before the replay, so a
      // presenter hold there shows the panel at rest; Temporal hands it the agent's Workflow, a card from the first
      // history row to its status, which then reads TAKING OVER
      placeNewTag(s.newTag, t, bIn + 0.5, c[3] - 0.3, CRASH_TAG.x + arrive.dx, CRASH_TAG.y);
      flyChip(s.handCard, t, handOff, CARD_X, rowY(0), STATUS_AT.x, STATUS_AT.y);
    }
  });
}
