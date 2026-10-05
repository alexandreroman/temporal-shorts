// ===================== 2. WHEN A STEP FAILS
// Step row on top, order status and CARD CHARGED counter below. Everyday failures strike the links, then the
// server crashes after Charge card: the order is stuck. Restarting from the top charges the card a second time.
// The block keeps every name declared in this file local to this scene.
{
  const ROW = { x0: 480, gap: 320, y: 470, w: 260, h: 140 };
  const TOP_Y = 330, BOTTOM_Y = 690; // band above the row (tags, bolt, arrow) and below it (status, counter)
  // the status pill grows to the right from a fixed left edge, mirroring the counter's right edge (1450) about x=960
  const STATUS_LEFT = 470, CHARGE_X = 1280;
  // c[0]: each cause pops in on its word; the link under it flashes red and the tiles on each side jolt
  const CAUSES = [
    { label: 'Network cut', icon: 'plug', at: 2.0 },
    { label: 'Timeout', icon: 'clock', at: 2.9 },
    { label: 'Restart', icon: 'retry', at: 4.1 },
  ];
  // small damped shake of the tiles next to a failing link, as dx
  const jolt = (t, a) => (t < a ? 0 : Math.sin((t - a) * 55) * 7 * (1 - clamp((t - a) / 0.45)));

  scene({
    chapter: 2, title: 'When a step fails',
    // measured compromise: row + bottom band alone sit 27 px low, with the top band (tags, crash, arrow) 20 px high
    shift: [0, -46],
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
      s.steps = makeStepRow(root, s.svg, ROW.x0, ROW.gap, ROW.y, ROW.w, ROW.h);
      s.status = makeOrderStatus(root);
      s.status.style.transformOrigin = 'left center';
      s.charge = makeCharge(root);
      s.causes = CAUSES.map(cause => {
        const e = tag(root, `${ICON(cause.icon, 24, C.red, 2)}${cause.label}`, 'red');
        Object.assign(e.style, { display: 'flex', alignItems: 'center', gap: '10px' });
        return e;
      });
      s.bolt = E(root, ICON('bolt', 100, C.red, 1.6));
      s.crash = tag(root, 'Server crash', 'red big');
      // oversized so it still covers the whole stage once the scene is shifted
      s.flash = E(root, '', '', { width: '2400px', height: '1400px', background: C.red });
      const [x0, x1] = s.steps.xs, top = ROW.y - ROW.h / 2 - 6;
      s.redo = path(s.svg, `M ${x1 - 30} ${top} Q ${(x0 + x1) / 2} ${top - 90} ${x0 + 30} ${top}`, C.red, 3);
      s.redoL = E(root, 'Start over', 'lbl', { color: C.red });
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
        const p = P(t, c[0] + CAUSES[i].at, 0.4, backOut);
        place(e, (s.steps.xs[i] + s.steps.xs[i + 1]) / 2, TOP_Y, p, clamp(p * 2) * (1 - P(t, c[1] - 0.45, 0.35)));
      });
      // order status: PENDING, stuck after the crash, PENDING again once restarted
      const isStuck = t >= stuck && t < restart;
      setOrderStatus(s.status, isStuck ? 'PAID, NOT SHIPPED' : 'PENDING', isStuck ? C.red : C.slate);
      const stp = P(t, 0.3, 0.45, backOut), stuckPop = bumpAt(t, stuck);
      place(s.status, 0, 0, 1, clamp(stp * 2));
      s.status.style.transform = `translate(${STATUS_LEFT + sx}px,${BOTTOM_Y + sy}px) translate(0,-50%) `
        + `scale(${stp * (1 + 0.12 * stuckPop)})`;
      // card charged: $42 when Charge card completes, $84 when it completes a second time
      const paid1 = r1[0][1], paid2 = r2[0][1], twice = t >= paid2;
      if (twice) setCharge(s.charge, 84, 'CHARGED TWICE!', C.red, C.red);
      else setCharge(s.charge, t >= paid1 ? 42 : 0);
      s.charge.style.borderColor = twice ? C.red : C.line;
      const bump = bumpAt(t, paid1) + bumpAt(t, paid2);
      const cp = P(t, 0.4, 0.45, backOut);
      place(s.charge, CHARGE_X + sx, BOTTOM_Y + sy, cp * (1 + 0.1 * bump), clamp(cp * 2));
      // crash: red flash, bolt over the running step, SERVER CRASH until the restart
      place(s.flash, 960, 540, 1, flashAt(t, crashAt) * 0.4);
      const bp = P(t, crashAt, 0.35, backOut);
      place(s.bolt, s.steps.xs[1], TOP_Y, bp, win(t, crashAt, crashAt + 1.5, 0.2));
      place(s.crash, 1200, TOP_Y, bp, win(t, crashAt + 0.1, c[2] + 0.3, 0.25));
      // restart: "Start over" arrow back to the first step, kept until the end
      draw(s.redo, P(t, c[2] + 0.3, 0.8));
      place(s.redoL, (s.steps.xs[0] + s.steps.xs[1]) / 2, TOP_Y - 14, 1, P(t, c[2] + 0.8, 0.35));
    }
  });
}
