// ===================== 2. WHAT TEMPORAL DOES
// The block keeps every name declared in this file local to this scene.
{
  // The order of the series: its 4 steps as tiles, as lines in the app, and as rows of the Event History
  const STEPS = [['cart', 'Order'], ['card', 'Charge'], ['box', 'Ship'], ['mail', 'Email']];
  const LINES = ['take the order', 'charge the card', 'ship the package', 'email the receipt'];
  const HISTORY = ['Order #1042 received', 'Card charged: $42', 'Package shipped', 'Receipt emailed'];
  // Layout on the free band: the step row on top, the app panel on the left and the TEMPORAL panel on the right
  const ROW = { x0: 270, gap: 460, y: 215, w: 300, h: 120 };
  const APP = { x: 510, y: 595, w: 780, h: 560 };
  const TEMPORAL = { x: 1380, y: 595, w: 840, h: 560 };
  const HIST = { x: TEMPORAL.x, y: TEMPORAL.y + 25, w: TEMPORAL.w - 40, h: TEMPORAL.h - 90 };
  // the STEPS card inside the app panel, and its lines
  const CARD = { left: 24, top: 76, w: APP.w - 48, h: APP.h - 100 };
  const LINE = { top: 62, gap: 80, h: 56 };
  // the history rows level with the app's lines, as far apart: row i's middle on line i's, so each saved result
  // runs straight across from its line to its row
  // (the lines sit inside the STEPS card's border, 1.5 px, which renders as 2)
  const LINE_MID_Y = APP.y - APP.h / 2 + CARD.top + 2 + LINE.top + LINE.h / 2;
  const HROW = { gap: LINE.gap, h: 44 };
  HROW.top = LINE_MID_Y - (HIST.y - HIST.h / 2) - HROW.h / 2;
  // NEW APP INSTANCE in the STEPS card, centered in the space under the last line (stage y)
  const NEW_TAG_Y = APP.y - APP.h / 2 + CARD.top + (LINE.top + 3 * LINE.gap + LINE.h + CARD.h) / 2;
  const rowTop = i => HROW.top + i * HROW.gap;
  // stage points where a saved result leaves the app (end of line i) and lands in the history (the tag slot of row i,
  // where its SAVED tag then appears)
  const lineEnd = i => [APP.x - APP.w / 2 + CARD.left + CARD.w - 20, APP.y - APP.h / 2 + CARD.top + LINE.top
    + i * LINE.gap + LINE.h / 2];
  const rowEntry = i => [HIST.x - HIST.w / 2 + 14, HIST.y - HIST.h / 2 + rowTop(i) + HROW.h / 2];
  // the cable a result runs along: from the end of line i, across the gap between the panels, into row i
  function cableD(i) {
    const [x0, y0] = lineEnd(i), [x1, y1] = rowEntry(i);
    return `M ${x0} ${y0} C ${x0 + 90} ${y0}, ${x1 - 90} ${y1}, ${x1} ${y1}`;
  }
  const GLITCH_BARS = 7;

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
    chapter: 2, title: 'What Temporal does',
    holdBeforeEnd: CAMERA_EXIT, // presenter mode holds before the exit zoom
    // laid out centered at (960, 515) on the free band, inside the content frame (y 155 to 875)
    subs: [
      {
        text: "The idea is <b>Durable Execution</b>: an app runs in steps, "
          + "and Temporal records each one outside the app.",
        after: 0.4,
      },
      { text: "If the app crashes, a new copy of the app starts and takes over.", after: 0.6 },
      {
        text: "It gets the saved results back from the history, then picks up where it left off. No progress is lost.",
        after: 1.2,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.svg = svgLayer(root);
      s.steps = makeStepRow(root, s.svg, STEPS, ROW.x0, ROW.gap, ROW.y, ROW.w, ROW.h);
      s.A = makeStepsApp(root, 'APP INSTANCE A');
      s.B = makeStepsApp(root, 'APP INSTANCE B');
      s.temporal = makeTemporalPanel(root, TEMPORAL.w, TEMPORAL.h, { logoAt: [24, 20], noteAt: [24, 25], font: 18 });
      s.history = makeHistoryCard(root, HISTORY, {
        w: HIST.w, h: HIST.h, headerFont: 20, rowTop, font: 23, rowH: HROW.h, tagTop: i => rowTop(i) + 6,
        tag: { font: 18, pad: '4px 12px', icon: 18, border: false },
        crash: {
          keptTop: rowTop(0) - 8, keptH: HROW.gap + HROW.h + 16, cutTop: rowTop(2) - (HROW.gap - HROW.h) / 2 - 1,
          label: 'APP CRASHED HERE', labelX: '66%', labelFont: 15,
        },
        scanH: HROW.h + 6,
      });
      // ORDER COMPLETE in the space under the last row, as far from it as from the card's bottom; a fixed even
      // width, so it rests on whole pixels centered
      const DONE_H = 46;
      const doneTop = rowTop(HISTORY.length - 1) + HROW.h + (HIST.h - rowTop(HISTORY.length - 1) - HROW.h - DONE_H) / 2;
      s.history.done = E(s.history, `${ICON('check', 24, C.neon, 2.6)} ORDER COMPLETE`, 'mono', {
        left: '50%', top: doneTop + 'px', width: '270px', height: DONE_H + 'px', fontSize: '20px',
        letterSpacing: '.12em', color: C.neon, background: '#141414', padding: '0 18px 0 16px',
        borderRadius: 'var(--rs)', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center',
      });
      // each result runs as a neon pulse along a cable into the history; replayed results run back in violet
      s.cableSvg = svgLayer(root);
      s.cables = STEPS.map((_, i) => path(s.cableSvg, cableD(i), C.violet, 2, false));
      s.pulses = STEPS.map(() => makeSpark(root, 16, '219,255,75'));
      s.backPulses = [0, 1].map(() => makeSpark(root, 16, '182,100,255'));
      s.newTag = tag(root, 'New app instance', 'violet solid');
      // instance B boots behind a scanline
      s.bootLine = E(root, '', '', {
        width: APP.w + 'px', height: '3px', background: C.violet, boxShadow: '0 0 18px 4px rgba(182,100,255,.6)',
      });
      s.flash = makeFlash(root);
      // the crash glitch: torn horizontal bars and scanlines over the whole stage
      s.glitchBars = Array.from({ length: GLITCH_BARS }, (_, j) => E(root, '', '', {
        width: '1920px', background: j % 2 ? 'rgba(68,76,231,.45)' : 'rgba(255,90,95,.45)',
      }));
      s.scanlines = E(root, '', '', {
        width: '2400px', height: '1400px',
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.35) 0 2px, rgba(0,0,0,0) 2px 5px)',
      });
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      // in held beats: the crash on app instance A (it stays dead a moment), a new app instance B arrives where A
      // was, B replays the history row by row, then resumes at step 3
      const crashAt = c[1] + 0.6, bOn = c[1] + 2.2, aGone = c[1] + 3.0;
      const replay = [c[2] + 0.6, c[2] + 1.8];
      const rerun = c[2] + 3.2; // app instance B runs step 3 again, from its start: it was never saved
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
      // once crashed it stays on screen, dead (red border, CRASHED, EMPTY), until B has arrived
      place(s.A, APP.x + sx, APP.y + sy, aIn, clamp(aIn * 2) * (1 - 0.25 * P(t, crashAt + 0.8, 0.4))
        * (1 - P(t, aGone, 0.4)));
      if (crashed) setAppStatus(s.A, 'CRASHED', 'crashed');
      else setAppStatus(s.A, t >= run[0] ? 'RUNNING' : '', t >= run[0] ? 'running' : 'idle');
      LINES.forEach((_, i) => {
        const st = t >= done[i] ? 2 : t >= run[i] ? 1 : 0;
        setLine(s.A, i, st, P(t, crashAt + 0.2 + i * 0.1, 0.8, easeIn));
      });
      s.A.empty.style.opacity = P(t, crashAt + 1.0, 0.3);

      // app instance B arrives where A was: it rises into place as it boots behind a scanline, labelled as a new
      // instance; then the saved steps come back from the history, and step 3 runs again
      const arrive = P(t, bOn, 0.8);
      const boot = P(t, bOn + 0.2, 0.8);
      place(s.B, APP.x, Math.round(APP.y + (1 - ease(arrive)) * 60), 1, t >= bOn ? clamp(arrive * 3) : 0);
      s.B.style.clipPath = `inset(0 0 ${((1 - boot) * 100).toFixed(2)}% 0)`;
      place(s.bootLine, APP.x, APP.y - APP.h / 2 + boot * APP.h, 1, boot > 0 && boot < 1 ? 1 : 0);
      const tp = P(t, bOn + 0.6, 0.45, backOut);
      // the tag sits in the empty space at the bottom of B's STEPS card
      place(s.newTag, APP.x, NEW_TAG_Y, tp, clamp(tp * 2) * (1 - P(t, c[2] + 0.2, 0.4)));
      if (t < bOn + 1.0) setAppStatus(s.B, 'STARTING', 'idle');
      else if (t < replay[0]) setAppStatus(s.B, 'TAKING OVER', 'idle');
      else if (t < rerun) setAppStatus(s.B, 'REPLAYING…', 'running');
      else if (t < complete) setAppStatus(s.B, 'RESUMED AT STEP 3', 'running');
      else setAppStatus(s.B, 'DONE', 'idle');
      // steps 1 and 2 tick as their results come back, without running again
      LINES.forEach((_, i) => {
        if (i < 2) {
          setLine(s.B, i, t >= replay[i] + 0.4 ? 2 : 0);
          return;
        }
        const runAt = i === 2 ? rerun : run[3];
        setLine(s.B, i, t >= done[i] ? 2 : t >= runAt ? 1 : 0);
      });

      // Temporal and its Event History, outside the app: untouched by the crash
      place(s.temporal, TEMPORAL.x, TEMPORAL.y, 1, P(t, c[0] + 0.6, 0.5));
      s.temporal.out.style.color = t >= c[0] + 5.0 ? C.ink : C.slate;
      place(s.history, HIST.x, HIST.y, 1, P(t, c[0] + 0.8, 0.5));
      // each result runs along its cable into the history, where its row is saved; during the replay the saved
      // results run back to app instance B
      s.cables.forEach((cable, i) => {
        const at = saved[i] - 0.5;
        const back = i < 2 ? win(t, replay[i] - 0.1, replay[i] + 0.6, 0.1) : 0;
        draw(cable, P(t, at, 0.2), Math.max((1 - P(t, saved[i], 0.4)) * 0.7, back * 0.7));
        sparkOnPath(s.pulses[i], cable, P(t, at + 0.1, 0.4));
        if (i < 2) {
          const q = P(t, replay[i], 0.45);
          sparkOnPath(s.backPulses[i], cable, q > 0 && q < 1 ? 1 - q : 0);
        }
      });
      HISTORY.forEach((_, i) => {
        showRow(s.history.rows[i], P(t, saved[i] - 0.1, 0.3));
        const isReplayed = i < 2 && t >= replay[i];
        const opacity = P(t, saved[i], 0.25);
        if (isReplayed) placeStatusTag(s.history.tags[i], t, 'REPLAYED', 'reused', opacity, replay[i]);
        else placeStatusTag(s.history.tags[i], t, 'SAVED', 'saved', opacity, saved[i]);
      });
      markCrash(s.history, t, crashAt);
      const scanning = replay.findIndex(q => t >= q - 0.2 && t < q + 0.7);
      scanRow(s.history, scanning);
      const dp = P(t, complete, 0.45, backOut);
      s.history.done.style.opacity = clamp(dp * 2);
      s.history.done.style.transform = `translateX(-50%) scale(${dp})`;
      placeFlash(s.flash, t, crashAt);

      // the crash glitch: color fringes on the whole composition, torn bars and scanlines, re-drawn 24 times a
      // second from hashed values
      const frame = Math.floor(t * 24);
      const k = win(t, crashAt - 0.02, crashAt + 0.55, 0.05) * (0.5 + 0.5 * hash(frame));
      const fringe = Math.round(2 + 10 * k * hash(frame + 1));
      s.cam.style.filter = k > 0.01 ? `drop-shadow(${fringe}px 0 0 rgba(255,90,95,.8)) `
        + `drop-shadow(${-fringe}px 0 0 rgba(68,76,231,.8))` : 'none';
      s.glitchBars.forEach((e, j) => {
        // hidden outside the glitch, and left in place there, so the scene stays still for the live player
        if (k <= 0.01) {
          place(e, 960, 540, 1, 0);
          return;
        }
        e.style.height = Math.round(4 + hash(frame * 11 + j) * 26) + 'px';
        const shown = hash(frame * 17 + j) > 0.3 ? k * 0.8 : 0;
        place(e, 960 + (hash(frame * 13 + j) - 0.5) * 160, hash(frame * 7 + j) * 1080, 1, shown);
      });
      place(s.scanlines, 960, 540, 1, k * 0.6);
    }
  });
}
