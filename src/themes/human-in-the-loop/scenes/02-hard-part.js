// ===================== 2. WAITING IS THE HARD PART
// The block keeps every name declared in this file local to this scene.
{
  // The app panel in the middle of the content frame, and a band 40 px under it that holds the day timeline, then
  // two of the plumbing tiles; both phases fill the same box, so the app never moves.
  const APP = { x: 960, y: 412, w: 800, h: 440 };
  const BAND_Y = APP.y + APP.h / 2 + FRAME.gap + 90; // middle of the 180 px band under the app
  // day timeline exactly as wide as the app: DAY 1 on its left edge, DAY 3 on its right edge
  const LINE = { y: BAND_Y + 18, x0: APP.x - APP.w / 2, x1: APP.x + APP.w / 2 };
  const RESTART_X = 1060, DEPLOY_X = 1260;
  const CHIPS = ['Request #1042', 'Step: approval', 'Waiting for Maria'];
  // Hand-made plumbing on a grid: Database and Resume code on the frame's edges, centered on the app; Status flags
  // and Scheduled jobs in the band, on the app's left and right edges. Tangled links run between all of it.
  const TILE = { w: 340, h: 180, bandW: 300 };
  const PLUMBING = [
    ['db', 'Database', FRAME.x0 + TILE.w / 2, APP.y, TILE.w],
    ['flag', 'Status flags', LINE.x0 + TILE.bandW / 2, BAND_Y, TILE.bandW],
    ['clock', 'Scheduled jobs', LINE.x1 - TILE.bandW / 2, BAND_Y, TILE.bandW],
    ['code', 'Resume code', FRAME.x1 - TILE.w / 2, APP.y, TILE.w],
  ];
  const LINKS = [
    'M 420 412 C 490 412, 490 480, 560 480',
    'M 1500 412 C 1430 412, 1430 344, 1360 344',
    'M 710 672 C 710 652, 1110 652, 1110 632',
    'M 1210 672 C 1210 652, 810 652, 810 632',
    'M 250 502 C 250 700, 900 680, 1060 762',
    'M 1670 502 C 1670 700, 1020 680, 860 762',
  ];
  const BROKEN_LINKS = [2, 4]; // turn red with the failures
  // red tags 40 px under the side tiles they belong to
  const TAG_Y = APP.y + TILE.h / 2 + FRAME.gap + 30;
  scene({
    chapter: 2, title: 'Waiting is the hard part',
    // laid out centered at (960, 522) on the content frame
    shift: [0, 0],
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
      s.days = [1, 2, 3].map(n => E(root, 'Day ' + n, 'lbl', { fontSize: '22px' }));
      s.ticks = [0, 1, 2].map(() => E(root, '', '', { width: '3px', height: '22px', background: C.slate }));
      s.restartM = E(root, '', '', { width: '2px', height: '40px', background: C.red });
      s.deployM = E(root, '', '', { width: '2px', height: '40px', background: C.slate });
      s.restart = tag(root, 'Restart', 'red'); s.deploy = tag(root, 'Deploy');
      s.marker = E(root, '', '', {
        width: '24px', height: '24px', background: C.violet, borderRadius: '50%',
        boxShadow: '0 0 18px 4px rgba(182,100,255,.45)',
      });
      s.app = makeAppPanel(root, 'APP', APP.w, APP.h, APP_TEXT);
      s.mem = E(s.app,
        '<div class="lbl" style="position:absolute;left:20px;top:16px;display:flex;gap:10px;align-items:center;'
        + `padding-left:0">${ICON('server', 22, C.slate, 1.8)} App memory</div>`
        // EMPTY and REQUEST LOST, like the chips, sit in the middle of the space under the APP MEMORY label
        + '<div class="vide mono" style="position:absolute;left:0;right:0;top:129px;text-align:center;font-size:30px;'
        + 'letter-spacing:.14em;padding-left:.14em;color:var(--red);opacity:0">EMPTY</div>',
        'tile', {
          left: '24px', top: '76px', width: (APP.w - 48) + 'px', height: (APP.h - 100) + 'px', textAlign: 'left',
          transform: 'none', background: 'rgba(248,250,252,.03)',
        });
      s.mem.style.opacity = 1;
      s.vide = s.mem.querySelector('.vide');
      s.chips = CHIPS.map((txt, i) => E(s.mem, txt, 'mono', {
        left: '24px', top: (99 + i * 66) + 'px', fontSize: '24px', color: '#141414', background: '#E6E7FC',
        padding: '10px 16px', borderRadius: 'var(--rs)', whiteSpace: 'nowrap',
      }));
      s.lost = tag(root, 'Request lost', 'red big');
      s.flash = makeFlash(root);
      s.tiles = PLUMBING.map(([icon, label, , , w]) => iconTile(root, icon, label, w, TILE.h));
      s.stuck = tag(root, 'Request stuck', 'red big'); s.twice = tag(root, 'Ordered twice', 'red big');
      // solid fill: the tags sit on the tangled links, which must not show through them
      [s.stuck, s.twice].forEach(e => { e.style.background = '#2A191B'; });
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
      place(s.lost, APP.x, APP.y + 79, P(t, crashAt + 1.4, 0.45, backOut), win(t, crashAt + 1.4, back, 0.3));
      placeFlash(s.flash, t, crashAt);

      // day timeline: the marker walks from DAY 1 and stops at the restart
      const lp = P(t, c[0] + 0.3, 0.5);
      draw(s.line, lp, 1 - lineOut);
      [0, 1, 2].forEach(i => {
        const x = lerp(LINE.x0, LINE.x1, i / 2);
        place(s.ticks[i], x, LINE.y, 1, lp * (1 - lineOut));
        place(s.days[i], x, LINE.y + 44, 1, lp * (1 - lineOut));
      });
      const mo = P(t, c[0] + 0.6, 0.4) * (1 - lineOut);
      place(s.restartM, RESTART_X, LINE.y - 24, 1, mo); place(s.deployM, DEPLOY_X, LINE.y - 24, 1, mo);
      place(s.restart, RESTART_X, LINE.y - 70, 1, mo); place(s.deploy, DEPLOY_X, LINE.y - 70, 1, mo);
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
        l.setAttribute('stroke', bad && BROKEN_LINKS.includes(i) ? C.red : C.slate);
        draw(l, P(t, c[1] + 2.6 + i * 0.35, 0.6));
      });
      const p1 = P(t, c[2] + 2.6, 0.45, backOut), p2 = P(t, c[2] + 4.2, 0.45, backOut);
      place(s.stuck, PLUMBING[0][2], TAG_Y, p1, clamp(p1 * 2));
      place(s.twice, PLUMBING[3][2], TAG_Y, p2, clamp(p2 * 2));
    }
  });
}
