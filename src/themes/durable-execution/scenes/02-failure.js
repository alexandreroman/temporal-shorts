// ===================== 2. WHEN A STEP FAILS
// Step row on top, ORDER #1042 status tile and CARD CHARGED counter below, one under each half of the row.
// Everyday failures strike the links, then the server crashes after Charge card: the order is stuck. Restarting
// from the top charges the card a second time.
// The block keeps every name declared in this file local to this scene.
{
  const ROW = { x0: 375, gap: 390, y: 430, w: 290, h: 170 };
  // band above the row (tags, bolt, arrow), 175 px over its middle, and below it (status, counter), 130 px under it
  const TOP_Y = ROW.y - 175, BOTTOM_Y = ROW.y + ROW.h / 2 + 130 + 100;
  // the status tile and the counter share one size and centered contents, each spanning a pair of steps: the status
  // tile from the first step's left edge to the second step's right edge, the counter from the third step's left
  // edge to the last step's right edge
  const BOTTOM = { w: ROW.gap + ROW.w, h: 200, statusX: ROW.x0 + ROW.gap / 2, chargeX: ROW.x0 + ROW.gap * 2.5 };
  const CRASH_X = ROW.x0 + ROW.gap * 2; // SERVER CRASH centered over Ship package
  // c[0]: each cause pops in on its word; the link under it flashes red and the tiles on each side jolt
  const CAUSES = [
    { label: 'Network cut', icon: 'plug', at: 2.0 },
    { label: 'Timeout', icon: 'clock', at: 2.9 },
    { label: 'Restart', icon: 'retry', at: 4.1 },
  ];
  // small damped shake of the tiles next to a failing link, as dx
  const jolt = (t, a) => (t < a ? 0 : Math.sin((t - a) * 55) * 7 * (1 - clamp((t - a) / 0.45)));
  // ORDER #1042 status tile, laid out like the CARD CHARGED counter: label, status line, note
  const makeStatusTile = root => {
    const e = E(root,
      '<div class="lbl" style="font-size:16px;display:flex;gap:10px;align-items:center;justify-content:center">'
      + `${ICON('bag', 22, C.slate, 1.8)} Order #1042</div>`
      + '<div class="st mono" style="font-size:34px;line-height:84px;letter-spacing:.06em;padding-left:.06em;'
      + 'margin-top:10px;white-space:nowrap"></div>'
      + '<div class="w mono" style="font-size:18px;letter-spacing:.1em;padding-left:.1em;margin-top:12px;'
      + 'white-space:nowrap"></div>',
      'tile', { width: BOTTOM.w + 'px', height: BOTTOM.h + 'px', padding: '20px 24px' });
    e.st = e.querySelector('.st'); e.w = e.querySelector('.w');
    return e;
  };
  // PENDING, or PAID, NOT SHIPPED and STUCK in red
  const setStatusTile = (e, stuck) => {
    e.st.textContent = stuck ? 'PAID, NOT SHIPPED' : 'PENDING';
    e.st.style.color = stuck ? C.red : C.slate;
    e.w.textContent = stuck ? 'STUCK' : '';
    e.w.style.color = C.red;
    e.style.borderColor = stuck ? C.red : C.line;
  };

  scene({
    chapter: 2, title: 'When a step fails',
    // measured: every phase (row, bottom band, top band with tags, crash or arrow) centered within 4 px
    shift: [0, -13],
    subs: [
      {
        text: "But in real life, things fail: networks drop, services time out, servers restart for a deploy.",
        after: 0.4,
      },
      {
        text: "Here, the server crashes right after charging the card. The order is stuck: paid, but never shipped.",
        after: 0.8,
      },
      { text: "Restart it from the top, and the card is charged a second time. The customer pays twice.", after: 1.2 },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.steps = makeStepRow(root, s.svg, ORDER_TILES, ROW.x0, ROW.gap, ROW.y, ROW.w, ROW.h);
      s.status = makeStatusTile(root);
      s.charge = makeCharge(root);
      // same size and centered contents as the status tile
      s.charge.style.width = BOTTOM.w + 'px';
      s.charge.style.textAlign = 'center';
      s.charge.querySelector('.lbl').style.justifyContent = 'center';
      s.charge.w.style.paddingLeft = '.1em';
      s.causes = CAUSES.map(cause => {
        const e = tag(root, `${ICON(cause.icon, 24, C.red, 2)}${cause.label}`, 'red');
        // one fixed whole-pixel size for the three tags, centered on their links: equal gaps between them
        Object.assign(e.style, {
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '250px', height: '50px',
        });
        return e;
      });
      s.bolt = E(root, ICON('bolt', 100, C.red, 1.6));
      s.crash = tag(root, 'Server crash', 'red big');
      Object.assign(s.crash.style, { width: '310px', height: '66px', textAlign: 'center' });
      s.flash = makeFlash(root);
      const [x0, x1] = s.steps.xs, top = ROW.y - ROW.h / 2 - 6;
      s.redo = path(s.svg, `M ${x1 - 40} ${top} Q ${(x0 + x1) / 2} ${top - 130} ${x0 + 40} ${top}`, C.red, 3);
      s.redoL = E(root, 'Start over', 'lbl', { color: C.red, width: '148px', height: '26px', textAlign: 'center' });
    },
    update(t, c, s) {
      const crashAt = c[1] + 2.4, stuck = c[1] + 3.8, restart = c[2] + 1.2;
      const [sx, sy] = shakeAt(t, crashAt);
      // [start, end] of each step's run: before the crash, then after the restart
      const r1 = [[c[1] + 0.3, c[1] + 1.3], [c[1] + 1.4, 1e9], [1e9, 1e9], [1e9, 1e9]];
      const r2 = [[c[2] + 1.5, c[2] + 2.6], [c[2] + 2.7, c[2] + 3.7], [c[2] + 3.8, 1e9], [1e9, 1e9]];
      const states = [0, 1, 2, 3].map(i => {
        const [a, b] = t < restart ? r1[i] : r2[i];
        if (t < restart && i === 1 && t >= crashAt) return 3;
        return t < a ? 0 : t < b ? 1 : 2;
      });
      // step row; the tiles next to a failing link jolt, the link flashes red
      s.steps.tiles.forEach((e, i) => {
        stepState(e, states[i]);
        let dx = sx;
        CAUSES.forEach((cause, k) => { if (k === i || k + 1 === i) dx += jolt(t, c[0] + cause.at); });
        const p = P(t, 0.1 + i * 0.12, 0.45, backOut);
        place(e, s.steps.xs[i] + dx, ROW.y + sy, p, clamp(p * 2));
      });
      s.steps.links.forEach((l, i) => {
        const hit = win(t, c[0] + CAUSES[i].at, c[0] + CAUSES[i].at + 0.6, 0.12);
        l.setAttribute('stroke', hit > 0.5 ? C.red : C.line);
        draw(l, P(t, 0.5 + i * 0.12, 0.35));
      });
      s.causes.forEach((e, i) => {
        const p = popIn(t, c[0] + CAUSES[i].at, 0.08);
        place(e, (s.steps.xs[i] + s.steps.xs[i + 1]) / 2, TOP_Y, p.s, p.o * (1 - P(t, c[1] - 0.45, 0.35)));
      });
      // order status: PENDING, stuck after the crash, PENDING again once restarted
      const isStuck = t >= stuck && t < restart;
      setStatusTile(s.status, isStuck);
      const stp = P(t, 0.3, 0.45, backOut), stuckPop = bumpAt(t, stuck);
      place(s.status, BOTTOM.statusX + sx, BOTTOM_Y + sy, stp * (1 + 0.06 * stuckPop), clamp(stp * 2));
      // card charged: $42 when Charge card completes, $84 when it completes a second time
      const paid1 = r1[0][1], paid2 = r2[0][1], twice = t >= paid2;
      if (twice) setCharge(s.charge, 84, 'CHARGED TWICE!', C.red, C.red);
      else setCharge(s.charge, t >= paid1 ? 42 : 0);
      s.charge.style.borderColor = twice ? C.red : C.line;
      const bump = bumpAt(t, paid1) + bumpAt(t, paid2);
      const cp = P(t, 0.4, 0.45, backOut);
      place(s.charge, BOTTOM.chargeX + sx, BOTTOM_Y + sy, cp * (1 + 0.06 * bump), clamp(cp * 2));
      // crash: red flash, bolt over the running step, SERVER CRASH until the restart
      placeFlash(s.flash, t, crashAt);
      place(s.bolt, s.steps.xs[1], TOP_Y, popIn(t, crashAt).s, win(t, crashAt, crashAt + 1.5, 0.2));
      place(s.crash, CRASH_X, TOP_Y, popIn(t, crashAt + 0.1, 0.08).s, win(t, crashAt + 0.1, c[2] + 0.3, 0.25));
      // restart: "Start over" arrow back to the first step, kept until the end
      draw(s.redo, P(t, c[2] + 0.3, 0.8));
      place(s.redoL, (s.steps.xs[0] + s.steps.xs[1]) / 2, ROW.y - ROW.h / 2 - 6 - 65 - 36, 1, P(t, c[2] + 0.8, 0.35));
    }
  });
}
