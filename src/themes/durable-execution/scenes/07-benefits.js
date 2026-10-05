// ===================== 7. WHAT YOU GET
// The block keeps every name declared in this file local to this scene.
{
  // Phase 1: the Workflow sleeps 30 days (code card and Worker on the left, timer on the right)
  const WAIT_CODE = [
    'await shipPackage(order);',
    '// wait for the delivery',
    "await sleep('30 days');",
    'await askForReview(order);',
  ];
  const SLEEP_LINE = 2, DAYS = 30;
  const CARD = { x: 680, y: 480, w: 600 };
  const WK = { x: 680, y: 670, h: 76 };
  const TIMER = { x: 1310, y: 561, w: 460, h: 330, barW: 380 };
  // Phase 2: the benefit tiles, under the headline and the Temporal logo
  const BENEFITS = [
    ['retry', 'Automatic retries'], ['shield', 'Survives crashes'],
    ['clock', 'Waits for days'], ['eye', 'Full visibility'],
  ];
  // dark badge with a neon check, at the right end of code line i
  const makeLineCheck = (card, i) => E(card, ICON('check', 20, C.neon, 2.6), '', {
    left: (card.w - 48) + 'px', top: (CODE.padY + i * CODE.lineH + 4) + 'px', width: '28px', height: '28px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#141414',
    borderRadius: 'var(--rs)', transform: 'none',
  });
  // timer tile: big clock (its hand turns as the days fly by), DAY n / 30, progress bar and a status line
  const makeTimer = p => {
    const e = E(p,
      `<div class="lbl" style="font-size:16px">Durable timer</div>`
      + '<svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="square"'
      + ` style="display:block;margin:18px auto 0"><circle cx="12" cy="12" r="9" stroke="${C.ink}"/>`
      + `<path class="hand" d="M12 12V6.5" stroke="${C.violet}"/></svg>`
      // tabular digits: the line only shifts once, from day 9 to day 10
      + '<div style="margin-top:10px;white-space:nowrap;font-size:84px;line-height:1">DAY <span class="n" '
      + 'style="font-variant-numeric:tabular-nums">1</span>'
      + '<span class="mono" style="font-size:34px;color:var(--slate)"> / 30</span></div>'
      + `<div style="width:${TIMER.barW}px;height:10px;margin:20px auto 0;border-radius:5px;`
      + 'background:rgba(248,250,252,.12);overflow:hidden"><div class="bar" style="height:100%;border-radius:5px">'
      + '</div></div>'
      + '<div class="st lbl" style="font-size:16px;margin-top:16px"></div>',
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
    // both phases are laid out around (960, 540), lifted to the center of the free band (960, 522)
    shift: [0, -18],
    subs: [
      { text: "A Workflow can even wait for days, for a delivery or a reply, without tying up a Worker.", after: 1.0 },
      {
        text: "You write the business logic. Temporal handles retries, state and recovery, with full visibility.",
        after: 0.8,
      },
    ],
    build(root, s) {
      s.code = makeCodeCard(root, { lines: WAIT_CODE, header: 'Workflow', w: CARD.w });
      s.code.lines[1].style.color = '#7C8698'; // the comment line, slate like the punctuation
      s.checks = [0, SLEEP_LINE, 3].map(i => makeLineCheck(s.code, i));
      s.worker = makeWorkerPanel(root, 'WORKER', CARD.w, WK.h);
      s.timer = makeTimer(root);
      s.headline = E(root,
        `<div style="display:flex;align-items:center;gap:22px">${ICON('code', 60, C.uv, 1.8)}`
        + '<div style="font-size:56px;line-height:1.1;white-space:nowrap">You write the business logic</div></div>');
      s.handles = E(root,
        `<div style="display:flex;align-items:center;gap:20px"><img src="${LOGO}" style="height:44px;display:block">`
        + '<span class="lbl" style="font-size:22px;color:var(--ink)">handles the rest</span></div>');
      // neon on the key outcome only: the Workflow survives crashes
      s.ben = BENEFITS.map(([icon, label]) =>
        iconTile(root, icon, label, 330, 230, icon === 'shield' ? C.neon : C.ink));
    },
    update(t, c, s) {
      // phase 1: shipPackage runs, the Workflow sleeps while the days fly by, then askForReview runs
      const shipAt = c[0] + 0.4, sleepAt = c[0] + 1.4, ffAt = c[0] + 1.8, ffD = 3.0;
      const wakeAt = ffAt + ffD, reviewAt = wakeAt + 0.3;
      const out = P(t, c[1], 0.5);

      const cp = P(t, c[0] + 0.1, 0.5, backOut);
      place(s.code, CARD.x, CARD.y, cp, clamp(cp * 2) * (1 - out));
      s.code.hdr.style.opacity = 1;
      const line = lerp(lerp(0, SLEEP_LINE, P(t, sleepAt, 0.35)), 3, P(t, reviewAt, 0.3));
      setCodeLine(s.code, line, P(t, shipAt, 0.3));
      const checkAt = [shipAt + 0.6, wakeAt + 0.05, reviewAt + 0.8];
      s.checks.forEach((e, i) => {
        const p = P(t, checkAt[i], 0.35, backOut);
        e.style.opacity = clamp(p * 2);
        e.style.transform = `scale(${p})`;
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
      place(s.headline, 960, 358, 1, hp);
      s.headline.style.transform += ` translateY(${(1 - hp) * 20}px)`;
      place(s.handles, 960, 462, 1, P(t, c[1] + 1.9, 0.5));
      // the tiles pop in one by one while the subtitle lists what Temporal handles: the first on "retries",
      // the last on "visibility"
      const at = [c[1] + 3.0, c[1] + 3.8, c[1] + 4.5, c[1] + 5.4];
      s.ben.forEach((e, i) => {
        const p = P(t, at[i], 0.45, backOut);
        place(e, 435 + i * 350, 639, p, clamp(p * 2));
        e.style.borderColor = i === 1 ? C.neon : C.line;
      });
    }
  });
}
