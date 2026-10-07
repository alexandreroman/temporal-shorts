// ===================== 3. WHAT TEMPORAL DOES
// The block keeps every name declared in this file local to this scene.
{
  // The order of the series: its 4 steps as tiles, as lines in the app, and as rows of the Event History
  const STEPS = [['cart', 'Order'], ['card', 'Charge'], ['box', 'Ship'], ['mail', 'Email']];
  const LINES = ['take the order', 'charge the card', 'ship the package', 'email the receipt'];
  const HISTORY = ['Order #1042 received', 'Card charged: $42', 'Package shipped', 'Receipt emailed'];
  // Layout on the free band: the step row on top, the app panel on the left and the TEMPORAL panel on the right
  const ROW = { x0: 270, gap: 460, y: 222, w: 300, h: 120 };
  const APP = { x: 510, y: 602, w: 780, h: 560 };
  const TEMPORAL = { x: 1380, y: 602, w: 840, h: 560 };
  const HIST = { x: TEMPORAL.x, y: TEMPORAL.y + 25, w: TEMPORAL.w - 40, h: TEMPORAL.h - 90 };
  // the STEPS card inside the app panel, and its lines
  const CARD = { left: 24, top: 76, w: APP.w - 48, h: APP.h - 100 };
  const LINE = { top: 70, gap: 86, h: 56 };
  const HROW = { top: 80, gap: 62, h: 44 };
  const rowTop = i => HROW.top + i * HROW.gap;
  // stage points where a saved result leaves the app (end of line i) and lands in the history (the tag slot of row i,
  // where its SAVED tag then appears)
  const lineEnd = i => [APP.x - APP.w / 2 + CARD.left + CARD.w - 150, APP.y - APP.h / 2 + CARD.top + LINE.top
    + i * LINE.gap + LINE.h / 2];
  const tagSlot = i => [HIST.x + HIST.w / 2 - 100, HIST.y - HIST.h / 2 + rowTop(i) + HROW.h / 2];

  // App instance panel holding a STEPS card: one line per step, with a neon check once done
  function makeStepsApp(root, name) {
    const app = makeAppPanel(root, name, APP.w, APP.h, { font: 22, statusFont: 18, statusTop: 25 });
    app.insertAdjacentHTML('beforeend',
      `<div style="position:absolute;left:${CARD.left}px;top:${CARD.top}px;width:${CARD.w}px;height:${CARD.h}px;`
      + `background:rgba(248,250,252,.03);border:1.5px solid ${C.line};border-radius:var(--r)">`
      + panelLabel('code', 'Steps', 'left:20px;top:16px;padding-left:0')
      + `<div class="empty mono" style="position:absolute;left:0;right:0;top:${CARD.h / 2 - 20}px;text-align:center;`
      + 'font-size:30px;letter-spacing:.14em;padding-left:.14em;color:var(--red);opacity:0">EMPTY</div></div>');
    const card = app.lastElementChild;
    app.empty = card.querySelector('.empty');
    app.lines = LINES.map((text, i) => {
      const line = E(card,
        `<span style="color:#6B7385;display:inline-block;width:38px">${i + 1}</span><span class="tx">${text}</span>`
        + `<div class="ok" style="position:absolute;right:18px;top:${(LINE.h - 30) / 2}px">`
        + `${ICON('check', 30, C.neon, 2.6)}</div>`,
        'mono', {
          left: '20px', top: (LINE.top + i * LINE.gap) + 'px', width: (CARD.w - 40) + 'px', height: LINE.h + 'px',
          lineHeight: LINE.h + 'px', fontSize: '26px', whiteSpace: 'nowrap', paddingLeft: '14px',
          borderRadius: 'var(--rs)', borderLeft: '4px solid transparent',
        });
      line.tx = line.querySelector('.tx'); line.ok = line.querySelector('.ok');
      line.tilt = i % 2 ? 22 : -18;
      return line;
    });
    return app;
  }
  // Line state: 0 to run (dim), 1 running (violet bar), 2 done (check); fall (0 to 1) drops it out on a crash
  function setLine(app, i, state, fall = 0) {
    const line = app.lines[i];
    line.tx.style.color = state === 0 ? C.slate : C.ink;
    line.style.background = state === 1 ? 'rgba(182,100,255,.2)' : 'transparent';
    line.style.borderLeftColor = state === 1 ? C.violet : 'transparent';
    line.ok.style.opacity = state === 2 ? 1 : 0;
    line.style.opacity = 1 - fall;
    line.style.transform = `translateY(${fall * 260}px) rotate(${fall * line.tilt}deg)`;
  }

  scene({
    chapter: 3, title: 'What Temporal does',
    // laid out centered at (960, 522) on the free band
    subs: [
      {
        text: "The idea is <b>Durable Execution</b>: an app runs in steps, "
          + "and Temporal records each one outside the app.",
        after: 0.4,
      },
      { text: "If the app crashes, another copy picks up right where it left off. No progress is lost.", after: 1.6 },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.steps = makeStepRow(root, s.svg, STEPS, ROW.x0, ROW.gap, ROW.y, ROW.w, ROW.h);
      s.A = makeStepsApp(root, 'APP INSTANCE A');
      s.B = makeStepsApp(root, 'APP INSTANCE B');
      s.temporal = makeTemporalPanel(root, TEMPORAL.w, TEMPORAL.h, { logoAt: [24, 20], noteAt: [24, 25], font: 18 });
      const rowsHtml = HISTORY.map(text => `<span style="color:#141414">${text}</span>`);
      s.jr = makeHistoryCard(root, rowsHtml, {
        w: HIST.w, h: HIST.h, headerFont: 20, rowTop, font: 23, rowH: HROW.h, tagTop: i => rowTop(i) + 6,
        tag: { font: 18, pad: '4px 12px', icon: 18, border: false },
        crash: {
          keptTop: rowTop(0) - 8, keptH: HROW.gap + HROW.h + 16, cutTop: rowTop(2) - 10,
          label: 'APP CRASHED HERE', labelX: '66%', labelFont: 15,
        },
        scanH: HROW.h + 6,
      });
      s.jr.done = E(s.jr, `${ICON('check', 24, C.neon, 2.6)} ORDER COMPLETE`, 'mono', {
        left: '50%', top: (rowTop(HISTORY.length) + 34) + 'px', fontSize: '20px', letterSpacing: '.12em',
        color: C.neon, background: '#141414', padding: '10px 18px 10px 16px', borderRadius: 'var(--rs)',
        display: 'flex', gap: '10px', alignItems: 'center',
      });
      s.results = STEPS.map(([, label]) => makeResultCard(root, true, label.toUpperCase()));
      s.flash = makeFlash(root);
    },
    update(t, c, s) {
      // first run on app instance A: steps 1 and 2 are done and saved, step 3 runs until the crash
      const crashAt = c[1] + 0.8, bOn = crashAt + 1.2;
      const replay = [bOn + 0.3, bOn + 0.6];
      const rerun = bOn + 0.9; // app instance B runs step 3 again, from its start: it was never saved
      // the steps run one after the other: each starts once the previous result is saved (its result card takes
      // 0.5 s to reach the history), step 4 included
      const run = [c[0] + 1.2, c[0] + 2.6, c[0] + 4.0];
      const done = [c[0] + 2.0, c[0] + 3.4, rerun + 0.9];
      const saved = done.map(d => d + 0.5);
      run.push(saved[2] + 0.3);
      done.push(run[3] + 0.9);
      saved.push(done[3] + 0.5);
      const complete = saved[3] + 0.4;
      const [sx, sy] = shakeAt(t, crashAt);
      const crashed = t >= crashAt;

      const states = [0, 1, 2, 3].map(i => {
        if (i === 2 && crashed && t < rerun) return 3;
        const start = i === 2 && t >= rerun ? rerun : run[i];
        return t >= done[i] ? 2 : t >= start ? 1 : 0;
      });
      placeStepRow(s.steps, t, c[0] + 0.1, states, sx, sy);

      // app instance A runs the steps, then crashes: its lines fall out
      const aIn = P(t, c[0] + 0.3, 0.5, backOut);
      place(s.A, APP.x + sx, APP.y + sy, aIn, clamp(aIn * 2) * (1 - P(t, bOn - 0.3, 0.3)));
      if (crashed) setAppStatus(s.A, 'CRASHED', 'crashed');
      else setAppStatus(s.A, t >= run[0] ? 'RUNNING' : '', t >= run[0] ? 'running' : 'idle');
      LINES.forEach((_, i) => {
        const st = t >= done[i] ? 2 : t >= run[i] ? 1 : 0;
        setLine(s.A, i, st, P(t, crashAt + 0.2 + i * 0.1, 0.8, easeIn));
      });
      s.A.empty.style.opacity = P(t, crashAt + 1.0, 0.3);

      // app instance B takes over: the saved steps come back from the history, then step 3 runs again
      place(s.B, APP.x, APP.y, 1, P(t, bOn, 0.35));
      if (t < replay[0]) setAppStatus(s.B, 'TAKING OVER', 'idle');
      else if (t < rerun) setAppStatus(s.B, 'REPLAYING…', 'running');
      else if (t < complete) setAppStatus(s.B, 'RESUMED AT STEP 3', 'running');
      else setAppStatus(s.B, 'DONE', 'idle');
      LINES.forEach((_, i) => {
        const doneAt = i < 2 ? replay[i] + 0.2 : done[i];
        const runAt = i < 2 ? replay[i] : i === 2 ? rerun : run[3];
        setLine(s.B, i, t >= doneAt ? 2 : t >= runAt ? 1 : 0);
      });

      // Temporal and its Event History, outside the app: untouched by the crash
      place(s.temporal, TEMPORAL.x, TEMPORAL.y, 1, P(t, c[0] + 0.6, 0.5));
      s.temporal.out.style.color = t >= c[0] + 5.0 ? C.ink : C.slate;
      place(s.jr, HIST.x, HIST.y, 1, P(t, c[0] + 0.8, 0.5));
      // each result flies from the app into the history, where its row is saved
      s.results.forEach((e, i) => {
        const [x0, y0] = lineEnd(i), [x1, y1] = tagSlot(i);
        const at = saved[i] - 0.5;
        fly(e, t, at, x0, y0, at + 0.05, 0.4, x1, y1, at + 0.45, x1, y1);
      });
      HISTORY.forEach((_, i) => {
        showRow(s.jr.rows[i], P(t, saved[i] - 0.1, 0.3));
        const isReplayed = i < 2 && t >= replay[i];
        setStatus(s.jr.tags[i], isReplayed ? 'REPLAYED' : 'SAVED', isReplayed ? 'reused' : 'saved');
        s.jr.tags[i].style.opacity = P(t, saved[i], 0.25);
        s.jr.tags[i].style.transform = `scale(${swell(t, isReplayed ? replay[i] : saved[i], 0.14)})`;
      });
      markCrash(s.jr, P(t, crashAt + 0.7, 0.4), P(t, crashAt + 0.3, 0.3));
      const scanning = replay.findIndex(q => t >= q && t < q + 0.4);
      setScan(s.jr, rowTop(Math.max(0, scanning)) - 3, scanning >= 0 ? 1 : 0);
      const dp = P(t, complete, 0.45, backOut);
      s.jr.done.style.opacity = clamp(dp * 2);
      s.jr.done.style.transform = `translateX(-50%) scale(${dp})`;
      placeFlash(s.flash, t, crashAt);
    }
  });
}
