// ===================== 2. WAITING IS THE HARD PART
// The block keeps every name declared in this file local to this scene.
{
  const APP = { x: 960, y: 400, w: 600, h: 330 };
  const LINE = { y: 700, x0: 560, x1: 1360 }; // day timeline: DAY 1 at x0, DAY 3 at x1
  const RESTART_X = 1060, DEPLOY_X = 1260;
  const CHIPS = ['Request #1042', 'Step: approval', 'Waiting for Maria'];
  // hand-made plumbing around the app, and the tangled links between all of it
  const PLUMBING = [
    ['db', 'Database', 400, 300], ['flag', 'Status flags', 400, 560],
    ['clock', 'Scheduled jobs', 1520, 300], ['code', 'Resume code', 1520, 560],
  ];
  const LINKS = [
    'M 525 300 C 620 300, 560 470, 660 470',
    'M 525 560 C 610 560, 570 330, 660 330',
    'M 1395 300 C 1300 300, 1360 470, 1260 470',
    'M 1395 560 C 1310 560, 1350 330, 1260 330',
    'M 400 230 C 420 150, 1500 150, 1520 230',
    'M 525 590 C 900 690, 1060 160, 1395 270',
    'M 1395 590 C 1020 690, 860 160, 525 270',
  ];
  scene({
    chapter: 2, title: 'Waiting is the hard part',
    // the timeline under the app, then the plumbing around it: pans as the timeline fades out
    shift: (t, c) => pan(t, [0, 28], [[c[1], 0, 100]]),
    subs: [
      {
        text: "But the app can't simply pause for three days. Its memory lives on one machine, and machines restart.",
        after: 1.4,
      },
      {
        text: "So teams build the waiting by hand: a database, status flags, scheduled jobs, code to resume later.",
        after: 1.4,
      },
      {
        text: "That's a lot of plumbing to get right. One missed case, and a request is stuck, or ordered twice.",
        after: 1.6,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.links = LINKS.map(d => path(s.svg, d, C.slate, 2, false));
      s.line = path(s.svg, `M ${LINE.x0} ${LINE.y} L ${LINE.x1} ${LINE.y}`, C.line, 3, false);
      s.days = [1, 2, 3].map(n => E(root, 'Day ' + n, 'lbl'));
      s.ticks = [0, 1, 2].map(() => E(root, '', '', { width: '3px', height: '18px', background: C.slate }));
      s.restartM = E(root, '', '', { width: '2px', height: '40px', background: C.red });
      s.deployM = E(root, '', '', { width: '2px', height: '40px', background: C.slate });
      s.restart = tag(root, 'Restart', 'red'); s.deploy = tag(root, 'Deploy');
      s.marker = E(root, '', '', {
        width: '20px', height: '20px', background: C.violet, borderRadius: '50%',
        boxShadow: '0 0 18px 4px rgba(182,100,255,.45)',
      });
      s.app = makeAppPanel(root, 'APP', APP.w, APP.h);
      s.mem = E(s.app,
        '<div class="lbl" style="position:absolute;left:20px;top:16px;display:flex;gap:10px;align-items:center;'
        + `padding-left:0">${ICON('server', 22, C.slate, 1.8)} App memory</div>`
        + '<div class="vide mono" style="position:absolute;left:0;right:0;top:58px;text-align:center;font-size:26px;'
        + 'letter-spacing:.14em;padding-left:.14em;color:var(--red);opacity:0">EMPTY</div>',
        'tile', {
          left: '24px', top: '76px', width: (APP.w - 48) + 'px', height: '230px', textAlign: 'left',
          transform: 'none', background: 'rgba(248,250,252,.03)',
        });
      s.mem.style.opacity = 1;
      s.vide = s.mem.querySelector('.vide');
      s.chips = CHIPS.map((txt, i) => E(s.mem, txt, 'mono', {
        left: '20px', top: (58 + i * 54) + 'px', fontSize: '20px', color: '#141414', background: '#E6E7FC',
        padding: '8px 14px', borderRadius: 'var(--rs)', whiteSpace: 'nowrap',
      }));
      s.lost = tag(root, 'Request lost', 'red');
      s.flash = E(root, '', '', { width: '2400px', height: '1400px', background: C.red });
      s.tiles = PLUMBING.map(([icon, label]) => iconTile(root, icon, label, 250, 140));
      s.stuck = tag(root, 'Request stuck', 'red big'); s.twice = tag(root, 'Ordered twice', 'red big');
    },
    update(t, c, s) {
      const crashAt = c[0] + 4.8, back = c[1] + 0.2;
      const [sx, sy] = shakeAt(t, crashAt);
      const lineOut = P(t, c[1], 0.4);

      // the app waits with its request in memory; the restart wipes it
      const ap = P(t, c[0] + 0.1, 0.6, backOut);
      place(s.app, APP.x + sx, APP.y + sy, ap, clamp(ap * 2));
      if (t >= crashAt && t < back) setAppStatus(s.app, 'RESTARTED', 'crashed');
      else setAppStatus(s.app, 'WAITING FOR MARIA', 'waiting');
      s.chips.forEach((e, i) => {
        // first shown from c[0], dropped by the crash, then back once teams save it by hand
        const grow = t < back ? P(t, c[0] + 0.6 + i * 0.25, 0.35) : P(t, c[1] + 2.0, 0.5);
        const fall = t < back ? P(t, crashAt + 0.2 + i * 0.12, 0.8, easeIn) : 0;
        e.style.opacity = grow * (1 - fall);
        e.style.transform = `translateY(${fall * 260}px) rotate(${fall * (i % 2 ? 22 : -18)}deg)`;
      });
      s.vide.style.opacity = win(t, crashAt + 1.0, back, 0.4);
      place(s.lost, APP.x, APP.y + 61, P(t, crashAt + 1.4, 0.45, backOut), win(t, crashAt + 1.4, back, 0.3));
      place(s.flash, 960, 540, 1, flashAt(t, crashAt) * 0.4);

      // day timeline: the marker walks from DAY 1 and stops at the restart
      const lp = P(t, c[0] + 0.3, 0.5);
      draw(s.line, lp, 1 - lineOut);
      [0, 1, 2].forEach(i => {
        const x = lerp(LINE.x0, LINE.x1, i / 2);
        place(s.ticks[i], x, LINE.y, 1, lp * (1 - lineOut));
        place(s.days[i], x, LINE.y + 40, 1, lp * (1 - lineOut));
      });
      const mo = P(t, c[0] + 0.6, 0.4) * (1 - lineOut);
      place(s.restartM, RESTART_X, LINE.y - 22, 1, mo); place(s.deployM, DEPLOY_X, LINE.y - 22, 1, mo);
      place(s.restart, RESTART_X, LINE.y - 66, 1, mo); place(s.deploy, DEPLOY_X, LINE.y - 66, 1, mo);
      const walk = clamp((t - (c[0] + 0.8)) / (crashAt - (c[0] + 0.8)));
      place(s.marker, lerp(LINE.x0, RESTART_X, walk), LINE.y, 1, P(t, c[0] + 0.8, 0.3) * (1 - lineOut));

      // hand-made plumbing: tiles pop with their names, the tangled links draw in between
      s.tiles.forEach((e, i) => {
        const [, , x, y] = PLUMBING[i];
        const p = P(t, c[1] + 2.2 + i * 0.7, 0.45, backOut);
        place(e, x, y, p, clamp(p * 2));
      });
      const bad = t >= c[2] + 2.6;
      s.links.forEach((l, i) => {
        l.setAttribute('stroke', bad && (i === 1 || i === 5) ? C.red : C.slate);
        draw(l, P(t, c[1] + 2.6 + i * 0.35, 0.6));
      });
      const p1 = P(t, c[2] + 2.6, 0.45, backOut), p2 = P(t, c[2] + 4.2, 0.45, backOut);
      place(s.stuck, 740, 690, p1, clamp(p1 * 2));
      place(s.twice, 1180, 690, p2, clamp(p2 * 2));
    }
  });
}
