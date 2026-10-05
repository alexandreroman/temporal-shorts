// ===================== 2. SURVIVES CRASHES
// The block keeps every name declared in this file local to this scene.
{
  // One agent turn: model steps (UV rows) and tool steps (black rows), as in the reference chapter 7
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
  // Layout: step tiles on top; the app and its counters on the left, Temporal and its Event History on the right
  const ROW = { x0: 300, gap: 330, y: 190, w: 230, h: 110 };
  const APP = { x: 480, y: 435, w: 640, h: 260, lblY: 437, chipY: 487 };
  const COUNTER = { y: 670, w: 310, h: 170 };
  const TEMPORAL = { x: 1320, y: 530, w: 880, h: 450 };
  const HIST = { x: 1320, y: 560, w: 840, h: 350, row0: 66, rowGap: 52, cardX: 1010 };
  const rowTop = i => HIST.row0 + i * HIST.rowGap; // inside the Event History card
  const rowY = i => HIST.y - HIST.h / 2 + rowTop(i) + 18; // on the stage, where result cards land

  // the step tiles in a row joined by thin links (the reference makeStepRow, with this turn's five steps)
  const makeTurnRow = (root, svg) => {
    const xs = STEPS.map((_, i) => ROW.x0 + i * ROW.gap);
    const links = xs.slice(1).map((x, i) => {
      const d = `M ${xs[i] + ROW.w / 2 + 2} ${ROW.y} L ${x - ROW.w / 2 - 2} ${ROW.y}`;
      return path(svg, d, C.line, 2, false);
    });
    const tiles = STEPS.map(st => makeStep(root, st.icon, st.label, ROW.w, ROW.h));
    return { xs, tiles, links };
  };
  // small card carrying one step result between the app and Temporal (model results in UV, tool results in green)
  const makeResultCard = (p, model) => {
    return E(p, '<span class="mono" style="font-size:15px;letter-spacing:.12em;padding-left:.12em">RESULT</span>', '', {
      background: model ? '#E6E7FC' : '#F3FBD2', color: '#141414', padding: '6px 14px',
      borderLeft: `5px solid ${model ? C.uv : '#9DB82A'}`, borderRadius: 'var(--rs)',
    });
  };
  // counter tile at a fixed height, its content centered vertically, so both columns end on the same line
  const makeTallCounter = (p, label) => {
    const e = makeCounter(p, label, COUNTER.w);
    Object.assign(e.style, {
      height: COUNTER.h + 'px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
    });
    return e;
  };

  scene({
    chapter: 2, title: 'Survives crashes',
    shift: [0, 77],
    subs: [
      {
        text: "Every model call and tool call is saved in the agent's Temporal history as soon as it completes.",
        after: 0.6,
      },
      { text: "If the app crashes mid-turn, another copy picks up the agent exactly where it left off.", after: 0.6 },
      { text: "Saved results are reused, not redone: no token is paid twice, and no tool runs twice.", after: 0.6 },
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
      s.temporal = E(root,
        `<img src="${LOGO}" style="position:absolute;left:26px;top:24px;height:34px;display:block">`
        + '<div class="lbl" style="position:absolute;right:24px;top:30px;font-size:16px">Outside the app</div>',
        'tile', { width: TEMPORAL.w + 'px', height: TEMPORAL.h + 'px', borderColor: C.uv });
      s.jr = E(root,
        '<div class="mono" style="position:absolute;left:26px;top:20px;font-size:18px;letter-spacing:.14em;'
        + `color:#141414;display:flex;gap:10px;align-items:center">${ICON('book', 22, '#141414', 1.8)}`
        + ' EVENT HISTORY</div>',
        '', {
          width: HIST.w + 'px', height: HIST.h + 'px', background: '#F8FAFC', color: '#141414',
          borderRadius: 'var(--r)',
        });
      // rows 1-4 survive the crash: tinted block + crash line under them
      s.kept = E(s.jr, '', '', {
        left: '14px', top: (rowTop(0) - 6) + 'px', width: (HIST.w - 28) + 'px', height: (3 * HIST.rowGap + 50) + 'px',
        background: 'rgba(68,76,231,.08)', borderLeft: '4px solid ' + C.uv, borderRadius: 'var(--rs)',
        transform: 'none',
      });
      s.cut = E(s.jr,
        '<span class="mono" style="position:absolute;left:56%;top:-10px;transform:translateX(-50%);background:#F8FAFC;'
        + `padding:0 10px;font-size:13px;line-height:18px;letter-spacing:.12em;color:${C.red};white-space:nowrap">`
        + 'APP CRASHED HERE</span>',
        '', {
          left: '26px', top: (rowTop(4) - 7) + 'px', width: (HIST.w - 52) + 'px', height: '0',
          borderTop: '2px dashed ' + C.red, transform: 'none',
        });
      s.scan = E(s.jr, '', '', {
        left: '18px', width: (HIST.w - 36) + 'px', height: '42px', background: 'rgba(182,100,255,.28)',
        transform: 'none', borderRadius: 'var(--rs)',
      });
      s.rows = STEPS.map((st, i) => E(s.jr,
        `<span style="color:#8A93A6;display:inline-block;width:34px">${i + 1}</span>`
        + `<span style="color:${isModel(i) ? C.uv : '#141414'}">${st.row}</span>`,
        'mono', {
          left: '26px', top: rowTop(i) + 'px', fontSize: '22px', whiteSpace: 'nowrap', padding: '4px 10px',
          transform: 'none', width: (HIST.w - 52) + 'px',
        }));
      s.tags = STEPS.map((_, i) => {
        const e = statusTag(s.jr);
        Object.assign(e.style, {
          left: 'auto', right: '36px', top: (rowTop(i) + 5) + 'px', transformOrigin: 'right center',
        });
        return e;
      });
      s.saveCards = STEPS.map((_, i) => makeResultCard(root, isModel(i)));
      s.reuseCards = STEPS.slice(0, 4).map((_, i) => makeResultCard(root, isModel(i)));
      // oversized so it still covers the whole stage once the scene is shifted
      s.flash = E(root, '', '', { width: '2400px', height: '1400px', background: C.red });
    },
    update(t, c, s) {
      // first run (instance A): each step runs, its result is saved, and only then the next step starts
      const run = [0, 1, 2, 3].map(i => c[0] + 1.2 + i * 1.3);
      // step 5 starts, the app crashes, instance B takes over and replays rows 1-4, then step 5 runs for real
      const firstTry = c[1] + 0.2, crashAt = c[1] + 1.0, bOn = crashAt + 0.9, reset = bOn + 0.2;
      const replay = [0, 1, 2, 3].map(i => bOn + 0.6 + i * 0.65);
      run.push(c[1] + 5.2);
      const rerun = run[4], saved = run.map(r => r + 0.9);
      // then the tags explain why it matters, the counters glow and the turn completes
      const told = replay.map((_, i) => c[2] + 0.4 + i * 0.15);
      const glow = c[2] + 1.4, doneAt = c[2] + 2.6;
      const [sx, sy] = shakeAt(t, crashAt);
      const dead = t >= crashAt, onA = t < bOn;
      // the app side shakes with the crash; Temporal, outside the app, stays still
      const ax = onA ? sx : 0, ay = onA ? sy : 0;

      // steps: before the reset, instance A runs them; after it, rows 1-4 re-check without running
      const states = STEPS.map((_, i) => {
        if (t < reset) {
          if (i === 4) return dead ? 3 : t >= firstTry ? 1 : 0;
          return t >= saved[i] + 0.1 ? 2 : t >= run[i] ? 1 : 0;
        }
        if (i === 4) return t >= saved[4] + 0.1 ? 2 : t >= rerun ? 1 : 0;
        return t >= replay[i] + 0.35 ? 2 : 0;
      });
      s.steps.tiles.forEach((e, i) => {
        stepState(e, states[i]);
        const p = P(t, c[0] + 0.2 + i * 0.12, 0.45, backOut);
        place(e, s.steps.xs[i] + ax, ROW.y + ay, p, clamp(p * 2));
      });
      s.steps.links.forEach((l, i) => draw(l, P(t, c[0] + 0.6 + i * 0.12, 0.35)));

      // app instances: A runs then crashes, B takes over in the same place
      const aIn = P(t, c[0] + 0.1, 0.5, backOut);
      place(s.A, APP.x + ax, APP.y + ay, aIn, clamp(aIn * 2) * (1 - P(t, bOn, 0.3)));
      if (dead) setAppStatus(s.A, 'CRASHED', 'crashed');
      else setAppStatus(s.A, 'RUNNING THE AGENT', t >= run[0] ? 'running' : 'idle');
      place(s.B, APP.x, APP.y, 1, P(t, reset, 0.35));
      if (t < replay[0]) setAppStatus(s.B, 'TAKING OVER', 'idle');
      else if (t < rerun) setAppStatus(s.B, 'REPLAYING…', 'running');
      else if (t < doneAt) setAppStatus(s.B, 'RUNNING THE AGENT', 'running');
      else setAppStatus(s.B, 'IDLE', 'idle');

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
          place(e, APP.x + ax, APP.chipY + ay + fall * 120, 1, win(t, firstTry, bOn, 0.15) * (1 - fall), fall * -12);
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
      const lblOn = Math.max(win(t, run[0], bOn, 0.15) * (1 - fall), win(t, replay[0], doneAt - 0.45, 0.15));
      place(s.chipLbl, APP.x + ax, APP.lblY + ay, 1, lblOn);
      const dp = P(t, doneAt, 0.45, backOut);
      place(s.done, APP.x, APP.chipY - 25, dp, clamp(dp * 2));

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
        e.style.boxShadow = `0 0 ${Math.round(28 * g)}px rgba(219,255,75,${(0.3 * g).toFixed(2)})`;
      });
      // the number pops when it changes
      const bump = (at) => 0.12 * Math.max(0, 1 - Math.abs(t - at - 0.1) / 0.25);
      s.billed.n.style.transform = `scale(${1 + bump(saved[0]) + bump(saved[2]) + bump(saved[4])})`;
      s.booked.n.style.transform = `scale(${1 + bump(saved[3])})`;
      const counterIn = i => P(t, c[0] + 0.5 + i * 0.12, 0.45, backOut);
      const counterX = [APP.x - APP.w / 2 + COUNTER.w / 2, APP.x + APP.w / 2 - COUNTER.w / 2];
      [s.billed, s.booked].forEach((e, i) => {
        place(e, counterX[i] + ax, COUNTER.y + ay, counterIn(i), clamp(counterIn(i) * 2));
      });

      // Temporal panel: faded in at native size (no scale), so the header logo stays pixel-aligned
      place(s.temporal, TEMPORAL.x, TEMPORAL.y, 1, P(t, c[0] + 0.3, 0.5));
      place(s.jr, HIST.x, HIST.y, 1, P(t, c[0] + 0.45, 0.5));

      // result cards: app -> Temporal when saving, Temporal -> app when replaying
      s.saveCards.forEach((e, i) => {
        const r = run[i];
        const [x1, y1] = [HIST.cardX, rowY(i)];
        fly(e, t, r + 0.45, APP.x + ax, APP.chipY + ay, r + 0.5, 0.4, x1, y1, r + 0.9, x1, y1);
      });
      s.reuseCards.forEach((e, i) => {
        const q = replay[i];
        fly(e, t, q, HIST.cardX, rowY(i), q + 0.05, 0.25, APP.x, APP.chipY, q + 0.3, APP.x, APP.chipY);
      });

      // Event History rows and their status tags
      s.kept.style.opacity = P(t, crashAt + 0.7, 0.4);
      s.cut.style.opacity = P(t, crashAt + 0.3, 0.3);
      s.rows.forEach((r, i) => {
        const p = P(t, saved[i] - 0.1, 0.3);
        r.style.opacity = p;
        r.style.transform = `translateX(${(1 - p) * 26}px)`;
      });
      s.tags.forEach((e, i) => {
        const isReused = i < 4 && t >= replay[i] + 0.05, isTold = i < 4 && t >= told[i];
        if (isTold) setStatus(e, isModel(i) ? 'REUSED, NOT RE-BILLED' : 'REUSED, NOT RE-RUN', 'reused');
        else if (isReused) setStatus(e, 'REUSED', 'reused');
        else setStatus(e, 'SAVED', 'saved');
        const switchedAt = isTold ? told[i] : isReused ? replay[i] + 0.05 : saved[i];
        e.style.opacity = P(t, saved[i], 0.25);
        e.style.transform = `scale(${1 + 0.14 * Math.max(0, 1 - Math.abs(t - switchedAt - 0.1) / 0.25)})`;
      });
      const scanning = replay.findIndex(q => t >= q && t < q + 0.5);
      s.scan.style.opacity = scanning >= 0 ? 1 : 0;
      s.scan.style.top = (rowTop(Math.max(0, scanning)) - 2) + 'px';
      place(s.flash, 960, 540, 1, flashAt(t, crashAt) * 0.4);
    }
  });
}
