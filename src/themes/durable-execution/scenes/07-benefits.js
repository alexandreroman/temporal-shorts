// ===================== 7. WHAT YOU GET
// The block keeps every name declared in this file local to this scene.
{
  // Phase 1: the Workflow sleeps 30 days. On the left, the code card and the Worker strip share their left and
  // right edges; on the right, the timer tile spans from the card's top edge to the strip's bottom edge.
  const WAIT_CODE = [
    'await shipPackage(order);',
    '// wait for the delivery',
    "await sleep('30 days');",
    'await askForReview(order);',
  ];
  const SLEEP_LINE = WAIT_CODE.findIndex(line => line.includes('sleep(')), REVIEW_LINE = WAIT_CODE.length - 1;
  const DAYS = 30;
  // code card as in chapters 5 and 6 (26 px text on 44 px lines): 640 x 220, its top edge at y=335
  const CARD = { x: 580, y: 445, w: 640, font: 26, lineH: 44, padY: 22 };
  const WK = { x: 580, y: 699, h: 88 }; // 100 px below the card: y 655..743
  const TIMER = { x: 1360, y: 539, w: 600, h: 408, barW: 470 }; // 160 px right of the card: x 1060..1660, y 335..743
  // Phase 2: the headline, the Temporal logo line, then a row of benefit tiles, all centered on x=960; the tile row
  // (x 180..1740) sets the width of the composition
  const HEADLINE_Y = 274, HANDLES_Y = 406;
  const BEN = { y: 672, w: 360, h: 260, pitch: 400 };
  // logo height on the "handles the rest" line: the label's size and top margin are measured to match its wordmark
  const HANDLES_LOGO_H = 72;
  const BENEFITS = [
    ['retry', 'Automatic retries'], ['shield', 'Survives crashes'],
    ['clock', 'Waits for days'], ['eye', 'Full visibility'],
  ];
  // dark badge with a neon check, at the right end of code line i
  const makeLineCheck = (card, i) => E(card, ICON('check', 20, C.neon, 2.6), '', {
    left: (card.w - 48) + 'px', top: (card.padY + i * card.lineH + (card.lineH - 28) / 2) + 'px',
    width: '28px', height: '28px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#141414',
    borderRadius: 'var(--rs)', transform: 'none',
  });
  // Centers e on (x, y) like place() at scale 1, but on whole pixels, so the native-size logo inside stays sharp
  const placeOnWholePixels = (e, x, y, o) => {
    place(e, x, y, 1, o);
    e.style.transform = `translate(${Math.round(x - e.offsetWidth / 2)}px,${Math.round(y - e.offsetHeight / 2)}px)`;
  };
  // timer tile: big clock (its hand turns as the days fly by), DAY n / 30, progress bar and a status line
  const makeTimer = p => {
    const e = E(p,
      `<div class="lbl" style="font-size:18px">Durable timer</div>`
      + '<svg width="104" height="104" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="square"'
      + ` style="display:block;margin:18px auto 0"><circle cx="12" cy="12" r="9" stroke="${C.ink}"/>`
      + `<path class="hand" d="M12 12V6.5" stroke="${C.violet}"/></svg>`
      // tabular digits: the line only shifts once, from day 9 to day 10
      + '<div style="margin-top:10px;white-space:nowrap;font-size:104px;line-height:1">DAY <span class="n" '
      + 'style="font-variant-numeric:tabular-nums">1</span>'
      + '<span class="mono" style="font-size:42px;color:var(--slate)"> / 30</span></div>'
      + `<div style="width:${TIMER.barW}px;height:12px;margin:22px auto 0;border-radius:6px;`
      + 'background:rgba(248,250,252,.12);overflow:hidden"><div class="bar" style="height:100%;border-radius:6px">'
      + '</div></div>'
      + '<div class="st lbl" style="font-size:18px;margin-top:18px"></div>',
      'tile', {
        width: TIMER.w + 'px', height: TIMER.h + 'px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      });
    e.hand = e.querySelector('.hand'); e.n = e.querySelector('.n'); e.bar = e.querySelector('.bar');
    e.st = e.querySelector('.st');
    return e;
  };
  scene({
    chapter: 7, title: 'What you get',
    // both phases are laid out around the center of the free band (960, 522)
    shift: [0, 0],
    subs: [
      { text: "A Workflow can even wait for days, for a delivery or a reply, without tying up a Worker.", after: 1.0 },
      {
        text: "You write the business logic. Temporal handles retries, state and recovery, with full visibility.",
        after: 0.8,
      },
    ],
    build(root, s) {
      const { w, font, lineH, padY } = CARD;
      s.code = makeCodeCard(root, { lines: WAIT_CODE, header: 'Workflow', file: 'workflows.ts', w, font, lineH, padY });
      s.code.lines[1].style.color = '#7C8698'; // the comment line, slate like the punctuation
      s.checks = [0, SLEEP_LINE, REVIEW_LINE].map(i => makeLineCheck(s.code, i));
      s.worker = makeWorkerPanel(root, 'WORKER', CARD.w, WK.h);
      // the panel lays out its name and status for a 76 px strip: center them vertically in this taller one
      s.worker.firstChild.style.top = (WK.h / 2 - 15) + 'px';
      s.worker.st.style.top = (WK.h / 2 - 9) + 'px';
      s.timer = makeTimer(root);
      s.headline = E(root,
        `<div style="display:flex;align-items:center;gap:24px">${ICON('code', 66, C.uv, 1.8)}`
        + '<div style="font-size:62px;line-height:1.1;white-space:nowrap">You write the business logic</div></div>');
      // the label stays lighter than the logo: slate caps as tall as the wordmark's x-height, on its baseline
      // (both measured on rendered frames)
      s.handles = E(root,
        '<div style="display:flex;align-items:flex-start;gap:22px">'
        + `<img src="${LOGO}" style="height:${HANDLES_LOGO_H}px;display:block">`
        + '<span class="lbl" style="font-size:28px;line-height:28px;margin-top:27px">handles the rest</span>'
        + '</div>');
      s.ben = BENEFITS.map(([icon, label]) => iconTile(root, icon, label, BEN.w, BEN.h));
    },
    update(t, c, s) {
      // phase 1: shipPackage runs, the Workflow sleeps while the days fly by, then askForReview runs
      const shipAt = c[0] + 0.4, sleepAt = c[0] + 1.4, ffAt = c[0] + 1.8, ffD = 3.0;
      const wakeAt = ffAt + ffD, reviewAt = wakeAt + 0.3;
      const out = P(t, c[1], 0.5);

      const cp = P(t, c[0] + 0.1, 0.5, backOut);
      place(s.code, CARD.x, CARD.y, cp, clamp(cp * 2) * (1 - out));
      s.code.hdr.style.opacity = 1;
      const line = lerp(lerp(0, SLEEP_LINE, P(t, sleepAt, 0.35)), REVIEW_LINE, P(t, reviewAt, 0.3));
      setCodeLine(s.code, line, P(t, shipAt, 0.3));
      const checkAt = [shipAt + 0.6, wakeAt + 0.05, reviewAt + 0.8];
      s.checks.forEach((e, i) => {
        const pop = popIn(t, checkAt[i]);
        e.style.opacity = pop.o;
        e.style.transform = `scale(${pop.s})`;
      });

      // the Worker runs the steps (the Workflow is already running), but holds nothing while it sleeps
      const wp = P(t, c[0] + 0.3, 0.5, backOut);
      place(s.worker, WK.x, WK.y, wp, clamp(wp * 2) * (1 - out));
      const running = t < sleepAt + 0.2 || (t >= reviewAt && t < checkAt[2]);
      if (running) setWorkerStatus(s.worker, 'RUNNING', 'running');
      else setWorkerStatus(s.worker, 'FREE FOR OTHER WORK', 'idle');

      // timer: fast-forwards from day 1 to day 30, then fires
      const tp = P(t, c[0] + 0.5, 0.5, backOut);
      place(s.timer, TIMER.x, TIMER.y, tp, clamp(tp * 2) * (1 - out));
      const f = P(t, ffAt, ffD);
      const done = f >= 1;
      s.timer.n.textContent = Math.round(1 + (DAYS - 1) * f);
      s.timer.hand.setAttribute('transform', `rotate(${f * 6 * 360} 12 12)`);
      s.timer.bar.style.width = (f * 100) + '%';
      s.timer.bar.style.background = done ? C.neon : `linear-gradient(90deg, ${C.violet}, ${C.uv})`;
      s.timer.st.textContent = done ? 'Time is up' : t >= ffAt ? 'Sleeping, fast-forward' : 'Sleeping';
      s.timer.st.style.color = done ? C.neon : C.slate;

      // phase 2: you write the logic, Temporal handles the rest
      const hp = P(t, c[1] + 0.4, 0.6);
      placeOnWholePixels(s.headline, 960, HEADLINE_Y, hp);
      s.headline.style.transform += ` translateY(${(1 - hp) * 20}px)`;
      placeOnWholePixels(s.handles, 960, HANDLES_Y, P(t, c[1] + 1.9, 0.5));
      // the tiles pop in one by one while the subtitle lists what Temporal handles: the first on "retries",
      // the last on "visibility"
      const at = [c[1] + 3.0, c[1] + 3.8, c[1] + 4.5, c[1] + 5.4];
      s.ben.forEach((e, i) => {
        const p = P(t, at[i], 0.45, backOut);
        place(e, 960 + (i - 1.5) * BEN.pitch, BEN.y, p, clamp(p * 2));
      });
    }
  });
}
