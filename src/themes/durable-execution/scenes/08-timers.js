// ===================== 8. DURABLE TIMERS
// The Worker (code card, status) on the left, Temporal (Event History, durable timer) on the right, on the lines of
// chapters 5 and 6. The Workflow sleeps 30 days: the timer is saved in the history, so the Worker holds nothing,
// restarts and gets a new version meanwhile; on day 30 Temporal wakes the Workflow up, a Worker replays its history
// and runs the next line.
// The block keeps every name declared in this file local to this scene.
{
  const WAIT_CODE = [
    'await shipPackage(order);',
    '// wait for the delivery',
    "await sleep('30 days');",
    'await askForReview(order);',
  ];
  const SHIP_LINE = 0, SLEEP_LINE = 2, REVIEW_LINE = 3;
  const ROWS = [
    `${uvName('shipPackage')}: tracking 1Z-48`,
    'TimerStarted: 30 days',
    'TimerFired',
    `${uvName('askForReview')}: review requested`,
  ];
  const SHIP_ROW = 0, STARTED_ROW = 1, FIRED_ROW = 2, REVIEW_ROW = 3;
  const DAYS = 30;
  const TICK_D = 0.18; // length of a day tick of the timer

  // Two panels on the lines of chapters 5 and 6: the Worker x 120..920, Temporal x 1056..1800, both y 152..892.
  // Inside each, 32 px from its sides: a card on top (both end at y 572) and a status block under it (both
  // y 612..860: 40 px under the cards, 32 px above the panel bottoms). Every size is even, so all rest on whole pixels.
  const WK = { x: 520, y: 522, w: 800, h: 740 };
  const TP = { x: 1428, y: 522, w: 744, h: 740 };
  // code card: x 152..888, y 278..572, 126 px below the panel top (under its tab), 4 lines of 60 px
  const CODE_CARD = { x: 520, y: 425, w: 736, font: 28, lineH: 60, padY: 27 };
  // history card: x 1088..1768, y 232..572, 80 px below the panel top (under the logo header), 4 rows of 60 px
  const HIST_CARD = { x: 1428, y: 402, w: 680, h: 340 };
  const BLOCK = { y: 736, h: 248 };
  const BAR_W = 628; // timer progress bar: the block's width less 26 px on each side
  // chips leave and reach the code 72 px inside the card's right edge, and the history at the start of the row text;
  // WAKE UP lands on the sleep line short of its clock badge
  const LINE_END_X = 816, ROW_START_X = 1208, WAKE_X = 740;
  const lineY = i => CODE_CARD.y - (CODE_CARD.padY * 2 + WAIT_CODE.length * CODE_CARD.lineH) / 2
    + CODE_CARD.padY + (i + 0.5) * CODE_CARD.lineH;
  const rowY = i => HIST_CARD.y - HIST_CARD.h / 2 + HIST.row0 + (i + 0.5) * HIST.rowGap;

  // Worker status shown in the block: label, icon (spin: a running spinner) and colors
  const STATUS = {
    running: { text: 'RUNNING', icon: 'spin', color: C.ink },
    free: { text: 'FREE FOR OTHER WORK', icon: 'pause', color: C.ink },
    restarting: { text: 'RESTARTING…', icon: 'power', color: C.slate },
    deploying: { text: 'DEPLOYING V2…', icon: 'upload', color: C.slate },
    deployed: { text: 'V2 DEPLOYED', icon: 'upload', color: C.ink },
    replaying: { text: 'REPLAYING…', icon: 'retry', color: C.ink },
  };
  const ICON_COLOR = { pause: C.slate, power: C.slate, upload: C.violet, retry: C.violet };

  // badge (28 x 28) at the right end of code line i, inside the card
  const makeLineBadge = (card, i, html, background) => E(card, html, '', {
    left: (card.w - 48) + 'px', top: (card.padY + i * card.lineH + (card.lineH - 28) / 2) + 'px',
    width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background, borderRadius: 'var(--rs)', transform: 'none',
  });
  const spinnerRing = size => `<div style="width:${size}px;height:${size}px;border:3px solid rgba(182,100,255,.3);`
    + `border-top-color:${C.violet};border-radius:50%"></div>`;
  // RESULT-style chip with another label
  const makeChip = (p, label) => {
    const chip = makeResultCard(p);
    chip.firstChild.textContent = label;
    return chip;
  };
  // Worker status block: a label, then one icon and one text, swapped by setStatusBlock
  const makeStatusBlock = p => {
    const icons = Object.keys(ICON_COLOR)
      .map(name => `<div data-icon="${name}" style="position:absolute;inset:0;opacity:0">`
        + `${ICON(name, 48, ICON_COLOR[name], 1.8)}</div>`).join('');
    const e = E(p,
      '<div class="lbl" style="position:absolute;left:26px;top:24px;font-size:18px">Worker status</div>'
      + '<div style="position:absolute;left:0;right:0;top:56px;bottom:16px;display:flex;align-items:center;'
      + 'justify-content:center;gap:24px">'
      + `<div class="ic" style="position:relative;width:48px;height:48px">${icons}`
      + `<div data-icon="spin" style="position:absolute;inset:3px;opacity:0">${spinnerRing(42)}</div></div>`
      + '<div class="tx mono" style="font-size:36px;letter-spacing:.08em;white-space:nowrap"></div></div>',
      'tile', { width: CODE_CARD.w + 'px', height: BLOCK.h + 'px' });
    e.icons = [...e.querySelectorAll('[data-icon]')];
    e.ring = e.querySelector('[data-icon="spin"]').firstChild;
    e.tx = e.querySelector('.tx');
    return e;
  };
  const setStatusBlock = (block, key) => {
    const st = STATUS[key];
    if (block._key !== key) {
      block._key = key;
      block.tx.textContent = st.text;
      block.tx.style.color = st.color;
    }
    block.icons.forEach(e => { e.style.opacity = e.dataset.icon === st.icon ? 1 : 0; });
    block.ring.style.transform = `rotate(${G * 400}deg)`;
  };
  // Durable timer block: label and status on top, clock + DAY n / 30, then the progress bar
  const makeTimerBlock = p => {
    const e = E(p,
      '<div class="lbl" style="position:absolute;left:26px;top:24px;font-size:18px">Durable timer</div>'
      + '<div class="st lbl" style="position:absolute;right:26px;top:24px;font-size:18px"></div>'
      + '<div style="position:absolute;left:26px;top:70px;display:flex;align-items:center;gap:26px">'
      // the hand turns on its own layer, so its turns never re-raster the dial under it
      + '<div style="position:relative;width:80px;height:80px">'
      + '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="square"'
      + ` style="display:block"><circle cx="12" cy="12" r="9" stroke="${C.ink}"/></svg>`
      + '<div class="hand" style="position:absolute;inset:0;will-change:transform">'
      + '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="square"'
      + ` style="display:block"><path d="M12 12V6.5" stroke="${C.violet}"/></svg></div></div>`
      // tabular digits: the line only shifts once, from day 9 to day 10
      + '<div style="font-size:88px;line-height:1;white-space:nowrap">DAY <span class="n" '
      + 'style="font-variant-numeric:tabular-nums"></span>'
      + `<span class="mono" style="font-size:38px;color:var(--slate)"> / ${DAYS}</span></div></div>`
      + `<div style="position:absolute;left:26px;top:196px;width:${BAR_W}px;height:12px;border-radius:6px;`
      + 'background:rgba(248,250,252,.12);overflow:hidden"><div class="bar" style="height:100%;border-radius:6px">'
      + '</div></div>',
      'tile', { width: HIST_CARD.w + 'px', height: BLOCK.h + 'px', textAlign: 'left' });
    e.hand = e.querySelector('.hand'); e.n = e.querySelector('.n'); e.bar = e.querySelector('.bar');
    e.st = e.querySelector('.st');
    return e;
  };

  scene({
    chapter: 8, title: 'Durable timers',
    // the two panels span x 120..1800 and y 152..892, centered on (960, 522)
    shift: [0, 0],
    subs: [
      {
        text: "A Workflow can even <b>wait for days</b>, for a delivery or a reply, without tying up a Worker.",
        after: 0.4,
      },
      {
        text: "The timer is saved in the Event History, so Worker restarts and deploys during the wait change nothing.",
        after: 0.3,
      },
      {
        text: "On day 30, Temporal wakes the Workflow up: a Worker replays its history and runs the next line.",
        after: 0.8,
      },
    ],
    build(root, s) {
      s.workers = ['WORKER A', 'WORKER B'].map(name => makeAppPanel(root, name, WK.w, WK.h));
      const { w, font, lineH, padY } = CODE_CARD;
      s.code = makeCodeCard(root, { lines: WAIT_CODE, header: 'Workflow', file: 'workflows.ts', w, font, lineH, padY });
      s.code.hdr.style.opacity = 1;
      s.code.lines[1].style.color = '#7C8698'; // the comment line, slate like the punctuation
      const check = ICON('check', 20, C.neon, 2.6);
      s.checks = [SHIP_LINE, SLEEP_LINE, REVIEW_LINE].map(i => makeLineBadge(s.code, i, check, '#141414'));
      s.sleeping = makeLineBadge(s.code, SLEEP_LINE, ICON('clock', 20, '#FFFFFF', 2.2), C.uv);
      s.spin = makeLineBadge(s.code, 0, spinnerRing(26), 'none');
      s.status = makeStatusBlock(root);
      s.temporal = makeTemporalPanel(root, TP.w, TP.h, TEMPORAL_HEADER);
      s.hist = makeHistory(root, ROWS, HIST_CARD.w, HIST_CARD.h, ROWS.length, 0);
      s.timer = makeTimerBlock(root);
      s.chips = {
        ship: makeResultCard(root), start: makeChip(root, 'START TIMER'), wake: makeChip(root, 'WAKE UP'),
        review: makeResultCard(root),
      };
    },
    update(t, c, s) {
      const [workerA, workerB] = s.workers;
      // c[0]: shipPackage runs and is saved, the Workflow starts its timer, the Worker lets go
      const shipAt = c[0] + 0.9, shipRes = shipAt + RESULT_LAG, shipSaved = shipRes + SAVE_LAG;
      const sleepAt = shipSaved + 0.3, startChip = sleepAt + 0.3, timerSaved = startChip + SAVE_LAG;
      const freeAt = timerSaved + 0.4;
      // c[1]: the days go by; the Worker restarts, then version 2 is deployed (Worker B)
      const restartAt = c[1] + 1.6, backAt = restartAt + 1.2;
      const deployAt = c[1] + 3.8, swapAt = deployAt + 0.4, deployedAt = deployAt + 1.0, settledAt = deployAt + 2.2;
      // c[2]: day 30, the timer fires, Temporal wakes the Workflow up, the Worker replays then runs askForReview
      const fireAt = c[2] + 0.4, firedSaved = fireAt + 0.4, wakeAt = firedSaved + 0.3;
      const replayAt = wakeAt + 0.8, replaySleep = replayAt + 0.5, slept = replaySleep + 0.3;
      const runAt = slept + 0.4, reviewRes = runAt + RESULT_LAG, reviewSaved = reviewRes + SAVE_LAG;
      const doneAt = reviewSaved + 0.3;

      // Worker A, then Worker B in the same place (cross-fade, so the code card never floats without a panel)
      const wp = P(t, c[0] + 0.1, 0.5, backOut);
      const swap = P(t, swapAt, 0.5);
      place(workerA, WK.x, WK.y, wp, clamp(wp * 2) * (1 - swap));
      place(workerB, WK.x, WK.y, 1, swap);

      let status = 'running';
      if (t >= freeAt) status = 'free';
      if (t >= restartAt && t < backAt) status = 'restarting';
      if (t >= deployAt) status = 'deploying';
      if (t >= deployedAt) status = 'deployed';
      if (t >= settledAt) status = 'free';
      if (t >= replayAt) status = 'replaying';
      if (t >= runAt) status = 'running';
      if (t >= doneAt) status = 'free';
      const busy = status === 'running' || status === 'replaying';
      setAppStatus(workerA, 'VERSION 1', busy ? 'running' : 'stopped');
      setAppStatus(workerB, 'VERSION 2', busy ? 'running' : 'stopped');
      setStatusBlock(s.status, status);
      place(s.status, WK.x, BLOCK.y, 1, P(t, c[0] + 0.6, 0.4));

      // the code card dims while no Worker runs it (restart, deploy)
      const down = win(t, restartAt, backAt, 0.3) + win(t, deployAt, deployedAt + 0.2, 0.3);
      place(s.code, CODE_CARD.x, CODE_CARD.y, 1, P(t, c[0] + 0.4, 0.4) * (1 - 0.65 * down));

      // code highlight: shipPackage, then the sleep line until the Worker lets go; on wake-up it replays from the
      // top to the sleep line (already fired), then runs askForReview
      let line = lerp(SHIP_LINE, SLEEP_LINE, P(t, sleepAt, 0.3));
      line = lerp(line, SHIP_LINE, P(t, replayAt - 0.3, 0.05));
      line = lerp(line, SLEEP_LINE, P(t, replaySleep, 0.25));
      line = lerp(line, REVIEW_LINE, P(t, runAt, 0.25));
      const barOn = P(t, shipAt, 0.3) * (1 - P(t, freeAt, 0.4)) + P(t, replayAt, 0.2) * (1 - P(t, doneAt, 0.4));
      setCodeLine(s.code, line, barOn);
      const spinOn = win(t, shipAt + 0.2, shipRes, 0.15) + win(t, runAt + 0.2, reviewRes, 0.15);
      s.spin.style.top = (CODE_CARD.padY + line * CODE_CARD.lineH + (CODE_CARD.lineH - 28) / 2) + 'px';
      s.spin.style.opacity = spinOn;
      s.spin.firstChild.style.transform = `rotate(${G * 400}deg)`;
      // checks: shipPackage once saved, the sleep line once the replay passes it, askForReview once saved
      [shipSaved, slept, reviewSaved].forEach((at, i) => {
        const pop = popIn(t, at);
        s.checks[i].style.opacity = pop.o;
        s.checks[i].style.transform = `scale(${pop.s})`;
      });
      // the sleep line carries a clock while the Workflow waits, until the replay checks it
      const zz = popIn(t, timerSaved);
      s.sleeping.style.opacity = zz.o * (1 - P(t, slept - 0.2, 0.2));
      s.sleeping.style.transform = `scale(${zz.s})`;

      // Temporal and its Event History
      const tp = P(t, c[0] + 0.3, 0.5, backOut);
      place(s.temporal, TP.x, TP.y, tp, clamp(tp * 2));
      place(s.hist, HIST_CARD.x, HIST_CARD.y, 1, P(t, c[0] + 0.6, 0.4));
      const written = [shipSaved, timerSaved, firedSaved, reviewSaved];
      written.forEach((at, i) => {
        showHistoryRow(s.hist, i, P(t, at - 0.1, 0.3));
        // TimerStarted bumps again as the Worker restarts: it stays in the history
        const bump = i === STARTED_ROW ? bumpAt(t, at) + bumpAt(t, restartAt) + bumpAt(t, deployAt) : bumpAt(t, at);
        setHistoryTag(s.hist, i, 'SAVED', 'saved', P(t, at, 0.25), bump);
      });
      markCrash(s.hist, 0, 0);
      // the TimerStarted row stays lit while the Worker comes and goes; then the replay reads the history: the
      // shipPackage row, then TimerFired (the sleep returns at once)
      const replayRow = t < replaySleep ? SHIP_ROW : FIRED_ROW;
      if (t < fireAt) setHistoryScan(s.hist, STARTED_ROW, 0.6 * win(t, c[1] + 0.4, fireAt - 0.3, 0.4));
      else setHistoryScan(s.hist, replayRow, win(t, replayAt, runAt, 0.15));

      // durable timer: day 1 once saved, resting until c[1]; then one tick per day until day 30, when it fires. On
      // each tick the day changes, the hand turns once and the bar grows a step, then all rest until the next tick
      // (still moments the 0.5x player can stretch)
      place(s.timer, TP.x, BLOCK.y, 1, P(t, timerSaved, 0.3));
      const firstTick = c[1] - 0.2, tickGap = (fireAt - firstTick) / (DAYS - 1);
      const ticks = clamp(Math.floor((t - firstTick) / tickGap) + 1, 0, DAYS - 1);
      const turns = ticks > 0 ? ticks - 1 + P(t, firstTick + (ticks - 1) * tickGap, TICK_D) : 0;
      const done = t >= fireAt;
      s.timer.n.textContent = 1 + ticks;
      s.timer.hand.style.transform = `rotate(${(turns % 1) * 360}deg)`; // 0 at rest
      s.timer.bar.style.width = (turns / (DAYS - 1) * 100) + '%';
      s.timer.bar.style.background = done ? C.neon : `linear-gradient(90deg, ${C.violet}, ${C.uv})`;
      s.timer.st.textContent = done ? 'Time is up' : 'Sleeping';
      s.timer.st.style.color = done ? C.neon : C.slate;

      // chips: shipPackage's RESULT, START TIMER to the history, WAKE UP back to the sleep line, then
      // askForReview's RESULT
      flyChip(s.chips.ship, t, shipRes, LINE_END_X, lineY(SHIP_LINE), ROW_START_X, rowY(SHIP_ROW));
      flyChip(s.chips.start, t, startChip, LINE_END_X, lineY(SLEEP_LINE), ROW_START_X, rowY(STARTED_ROW));
      flyChip(s.chips.wake, t, wakeAt, ROW_START_X, rowY(FIRED_ROW), WAKE_X, lineY(SLEEP_LINE));
      flyChip(s.chips.review, t, reviewRes, LINE_END_X, lineY(REVIEW_LINE), ROW_START_X, rowY(REVIEW_ROW));
    }
  });
}
