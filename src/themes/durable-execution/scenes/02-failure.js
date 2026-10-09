// ===================== 2. WHEN A STEP FAILS
// Step row on top, ORDER #1042 status tile and CARD CHARGED counter below, one under each half of the row.
// Everyday failures slam down on the links and snap them, then the server crashes after Charge card: the order is
// stuck. Restarting from the top charges the card a second time.
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
  // c[0]: each cause slams down on its word, the link under it snaps with a burst of sparks, the tiles on each side
  // jolt and flicker red, and the whole row kicks; the link mends a second later. accent: the cause's own touch,
  // the clock of Timeout ticks, the tiles next to Restart blink off and on.
  const CAUSES = [
    { label: 'Network cut', icon: 'plug', at: 2.0, accent: null },
    { label: 'Timeout', icon: 'clock', at: 2.9, accent: 'tick' },
    { label: 'Restart', icon: 'retry', at: 4.1, accent: 'blink' },
  ];
  // the tag falls DROP.h px in DROP.d s and lands at the cause's time; the link mends from HEAL.at s after the hit,
  // over HEAL.d s: everything is back at rest long before the tags fade out at c[1] - 0.45
  const DROP = { h: 50, d: 0.16 };
  // widening and flattening of a tag at its impact; it stretches the other way on the rebound
  const SQUASH = { x: 0.14, y: 0.2 };
  const HEAL = { at: 1.0, d: 0.3 };
  // sparks flying out of the break: [angle in degrees, 0 pointing right and -90 up, distance in px]. A fixed table
  // keeps every frame deterministic; at most 60 px, they stay clear of the tags above.
  const SPARKS = [[-150, 50], [-105, 60], [-60, 52], [-20, 40], [25, 44], [70, 56], [120, 48], [165, 40]];
  // damped shake of the tiles next to a failing link, as dx: 12 px, swinging at 55 rad/s for 0.45 s
  const jolt = (t, a) => dampedShake(t, a, 12, 0.45, 55 * 0.45 / Math.PI);
  // much smaller vertical kick of the whole row at each hit, as dy (the crash shake is 12 by 8 px): 4 px, swinging at
  // 60 rad/s for 0.3 s
  const kick = (t, a) => dampedShake(t, a, 4, 0.3, 60 * 0.3 / Math.PI);
  // the border of the tiles next to a failing link flickers red, 0.07 s on, 0.07 s off, three times
  const flickerOn = (t, a) => t >= a && t < a + 0.42 && Math.floor((t - a) / 0.07) % 2 === 0;
  // Restart: the tiles go dark twice, 0.1 s each
  const blinkOff = (t, a) => t >= a && t < a + 0.4 && Math.floor((t - a) / 0.1) % 2 === 1;
  // Timeout: the clock hand ticks a quarter turn every 0.15 s, four times, back to its resting angle
  const tickAngle = (t, a) => (t >= a && t < a + 0.6 ? (Math.floor((t - a) / 0.15) + 1) * 90 : 0);
  // squash of a landing tag: 1 at the impact, a stretch (negative) on the rebound, 0 at rest 0.25 s later
  const squash = (t, a) => {
    if (t < a) return 0;
    const u = clamp((t - a) / 0.25);
    return (1 - u) ** 2 * Math.cos(u * Math.PI * 3);
  };
  const svgLine = svg => {
    const l = document.createElementNS(SVGNS, 'line');
    l.setAttribute('stroke-width', 3);
    l.setAttribute('stroke-linecap', 'round');
    l.style.opacity = 0;
    svg.appendChild(l);
    return l;
  };
  const svgRing = svg => {
    const ring = document.createElementNS(SVGNS, 'circle');
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', C.red);
    ring.setAttribute('stroke-width', 3);
    ring.style.opacity = 0;
    svg.appendChild(ring);
    return ring;
  };
  const setLine = (l, x1, y1, x2, y2, color, o) => {
    l.setAttribute('x1', x1); l.setAttribute('y1', y1);
    l.setAttribute('x2', x2); l.setAttribute('y2', y2);
    l.setAttribute('stroke', color);
    l.style.opacity = o;
  };
  // the link between tiles i and i + 1 (see stepLinks()), snapped at its middle from `hit` until it mends: a ring at
  // the break, two halves pulled apart, their broken ends bent away from each other, and the sparks. Returns whether
  // the break shows (the link itself hides meanwhile).
  const placeBreak = (brk, i, t, hit) => {
    const healAt = hit + HEAL.at, healed = healAt + HEAL.d;
    const broken = t >= hit && t < healed;
    if (!broken) {
      brk.ring.style.opacity = 0;
      brk.halves.forEach(l => { l.style.opacity = 0; });
      brk.sparks.forEach(l => { l.style.opacity = 0; });
      return false;
    }
    const xa = ROW.x0 + i * ROW.gap + ROW.w / 2 + 2;
    const xb = ROW.x0 + (i + 1) * ROW.gap - ROW.w / 2 - 2;
    const xm = (xa + xb) / 2;
    const open = P(t, hit, 0.08, backOut) * (1 - P(t, healAt, HEAL.d));
    const gap = 28 * open, bend = 7 * open;
    // red and crackling while broken, back to the plain link color as it mends
    const mending = t >= healAt;
    const crackle = !mending && t < hit + 0.4 && Math.floor((t - hit) / 0.07) % 2 === 1 ? 0.55 : 1;
    const color = mending ? C.line : C.red;
    brk.halves.forEach(l => l.setAttribute('stroke-width', mending ? 2 : 3));
    setLine(brk.halves[0], xa, ROW.y, xm - gap / 2, ROW.y + bend, color, crackle);
    setLine(brk.halves[1], xm + gap / 2, ROW.y - bend, xb, ROW.y, color, crackle);
    // a red ring that widens and fades within 0.25 s
    const f = clamp((t - hit) / 0.25);
    brk.ring.setAttribute('cx', xm); brk.ring.setAttribute('cy', ROW.y);
    brk.ring.setAttribute('r', 4 + 22 * (1 - (1 - f) ** 2));
    brk.ring.style.opacity = 1 - f;
    // sparks: each streak flies out along its angle, shrinking and fading within 0.4 s; each link turns the table
    const u = clamp((t - hit) / 0.4), out = 1 - (1 - u) ** 3, len = 16 * (1 - u) + 2;
    brk.sparks.forEach((l, k) => {
      const [deg, dist] = SPARKS[k];
      const a = (deg + i * 17) * Math.PI / 180, r = dist * out;
      const r0 = Math.max(0, r - len), cos = Math.cos(a), sin = Math.sin(a);
      setLine(l, xm + cos * r0, ROW.y + sin * r0, xm + cos * r, ROW.y + sin * r, C.red, 1 - u);
    });
    return true;
  };
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
        stopLead: 0.45, // the failure causes fade out from c[1] - 0.45
      },
      { text: "Restart it from the top, and the card is charged a second time. The customer pays twice.", after: 1.2 },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.steps = makeStepRow(root, s.svg, ORDER_STEPS, ROW.x0, ROW.gap, ROW.y, ROW.w, ROW.h);
      s.status = makeStatusTile(root);
      // same size and centered contents as the status tile
      s.charge = makeCharge(root, BOTTOM.w, true);
      s.causes = CAUSES.map(cause => {
        const e = tag(root, `${ICON(cause.icon, 24, C.red, 2)}${cause.label}`, 'red');
        // one fixed whole-pixel size for the three tags, centered on their links: equal gaps between them
        Object.assign(e.style, {
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '250px', height: '50px',
        });
        e.icon = e.querySelector('svg');
        return e;
      });
      s.breaks = s.steps.links.map(() => ({
        halves: [svgLine(s.svg), svgLine(s.svg)],
        ring: svgRing(s.svg),
        sparks: SPARKS.map(() => svgLine(s.svg)),
      }));
      s.bolt = E(root, ICON('bolt', 100, C.red, 1.6));
      s.crash = fixedTag(root, 'Server crash', 'red big', 310, 66);
      s.flash = makeFlash(root);
      const [x0, x1] = s.steps.xs, top = ROW.y - ROW.h / 2 - 6;
      s.redo = makeRestartArc(root, s.svg, `M ${x1 - 40} ${top} Q ${(x0 + x1) / 2} ${top - 130} ${x0 + 40} ${top}`,
        'Start over', C.red, { width: '148px', height: '26px', textAlign: 'center' });
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
      // step row; at each hit the whole row kicks, the tiles next to the link jolt and flicker red (Restart: they
      // blink off and on), the link snaps
      s.steps.tiles.forEach((e, i) => {
        stepState(e, states[i]);
        let dx = sx, dy = sy, o = 1;
        CAUSES.forEach((cause, k) => {
          const hit = c[0] + cause.at;
          dy += kick(t, hit);
          const nextToLink = k === i || k + 1 === i;
          if (!nextToLink) return;
          dx += jolt(t, hit);
          if (flickerOn(t, hit)) e.style.borderColor = C.red;
          if (cause.accent === 'blink' && blinkOff(t, hit)) o = 0.15;
        });
        const p = backPop(t, 0.1 + i * 0.12);
        place(e, s.steps.xs[i] + dx, ROW.y + dy, p.s, p.o * o);
      });
      s.steps.links.forEach((l, i) => {
        const broken = placeBreak(s.breaks[i], i, t, c[0] + CAUSES[i].at);
        draw(l, P(t, 0.5 + i * 0.12, 0.35), broken ? 0 : 1);
      });
      // the tags fall onto their spots and land with a squash, their bottom edge kept on the spot (the 50 px tag
      // shrinks by SQUASH.y * sq of its height around its center)
      s.causes.forEach((e, i) => {
        const land = c[0] + CAUSES[i].at;
        const fall = P(t, land - DROP.d, DROP.d, easeIn), sq = squash(t, land);
        const y = TOP_Y - DROP.h * (1 - fall) + SQUASH.y * sq * 25;
        const o = P(t, land - DROP.d, 0.06) * (1 - P(t, c[1] - 0.45, 0.35));
        place(e, (s.steps.xs[i] + s.steps.xs[i + 1]) / 2, y, 1, o);
        if (sq !== 0) e.style.transform += ` scale(${1 + SQUASH.x * sq}, ${1 - SQUASH.y * sq})`;
        if (CAUSES[i].accent === 'tick') {
          const angle = tickAngle(t, land);
          e.icon.style.transform = angle ? `rotate(${angle}deg)` : '';
        }
      });
      // order status: PENDING, stuck after the crash, PENDING again once restarted
      const isStuck = t >= stuck && t < restart;
      setStatusTile(s.status, isStuck);
      const stp = backPop(t, 0.3), stuckPop = bumpAt(t, stuck);
      place(s.status, BOTTOM.statusX + sx, BOTTOM_Y + sy, stp.s * (1 + 0.06 * stuckPop), stp.o);
      // card charged: $42 when Charge card completes, $84 when it completes a second time
      const paid1 = r1[0][1], paid2 = r2[0][1], twice = t >= paid2;
      if (twice) setCounter(s.charge, '$84', 'CHARGED TWICE!', { noteColor: C.red, numColor: C.red });
      else setCounter(s.charge, t >= paid1 ? '$42' : '$0');
      s.charge.style.borderColor = twice ? C.red : C.line;
      const bump = bumpAt(t, paid1) + bumpAt(t, paid2);
      const cp = backPop(t, 0.4);
      place(s.charge, BOTTOM.chargeX + sx, BOTTOM_Y + sy, cp.s * (1 + 0.06 * bump), cp.o);
      // crash: red flash, bolt over the running step, SERVER CRASH until the restart
      placeFlash(s.flash, t, crashAt);
      place(s.bolt, s.steps.xs[1], TOP_Y, popIn(t, crashAt).s, win(t, crashAt, crashAt + 1.5, 0.2));
      place(s.crash, CRASH_X, TOP_Y, popIn(t, crashAt + 0.1, 0.08).s, win(t, crashAt + 0.1, c[2] + 0.3, 0.25));
      // restart: "Start over" arrow back to the first step, kept until the end
      placeRestartArc(s.redo, t, c[2] + 0.3, (s.steps.xs[0] + s.steps.xs[1]) / 2, ROW.y - ROW.h / 2 - 6 - 65 - 36);
    }
  });
}
