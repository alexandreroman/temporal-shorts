// ===================== 3. A WORKFLOW THAT WAITS
// The block keeps every name declared in this file local to this scene.
{
  const { rowY: ROW_Y, app: APP, strip: STRIP, temporal: TEMPORAL, clock: CLOCK } = WF_LAYOUT;
  // Deploys and restarts that hit the app while the Workflow waits, in order: time after c[2], label, cell of its
  // tag in the strip ([column, row]) and the jolt it gives the app side (peak offset in px). The last one is the
  // restart that stops instance A; it also shakes the app side (shakeAt).
  const HITS = [
    { at: 1.9, label: 'Deploy', cell: [0, 0], kick: [-4, -4] },
    { at: 2.6, label: 'Restart', cell: [1, 0], kick: [5, -3] },
    { at: 3.3, label: 'Deploy', cell: [0, 1], kick: [-5, -3] },
    { at: 4.0, label: 'Restart', cell: [1, 1], kick: [0, -6] },
  ];
  // The tags fill a 2 x 2 grid right of the clock: 160 px wide, 20 px apart across, 30 px from the clock and from
  // the strip's right edge; 50 px high, 14 px apart down, 13 px from the strip's top and bottom edges
  const TAG_W = 160;
  const TAG_X = [STRIP.x + 110, STRIP.x + 290];
  const TAG_Y = [STRIP.y - 32, STRIP.y + 32];
  // Sum of the jolts of the hits at t, as [dx, dy]: each one decays within 0.3 s, so it is exactly 0 between hits
  // and the app side rests on whole pixels
  const joltAt = (t, c) => {
    let x = 0, y = 0;
    HITS.forEach(h => {
      const k = recoil(t, c[2] + h.at);
      x += h.kick[0] * k;
      y += h.kick[1] * k;
    });
    return [x, y];
  };
  scene({
    chapter: 3, title: 'A Workflow that waits',
    // laid out centered at (960, 515) on the content frame (see WF_LAYOUT)
    subs: [
      {
        text: "With Temporal, the whole process is a <b>Workflow</b>: ordinary code that runs the steps in order.",
        after: 1.4,
      },
      {
        text: "When it reaches the approval, the Workflow just waits, as long as it takes. A minute or a month.",
        after: 1.4,
      },
      {
        text: "Temporal keeps its Event History, outside the app. Restarts and deploys come and go; the wait survives.",
        after: 2.0,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.steps = makeLaptopRow(root, s.svg, ROW_Y);
      s.A = makeWorkflowApp(root, 'APP INSTANCE A');
      s.strip = makeClockStrip(root);
      s.clock = makeWaitClock(root, 'Waiting for Maria');
      s.temporal = makeWfTemporalPanel(root);
      s.history = makeOrderHistory(root);
      s.causes = HITS.map(h => fixedTag(root, h.label, '', TAG_W));
      // a neon ring round the Event History card, 10 px out, each time a hit leaves it untouched
      s.ring = E(root, '', '', {
        width: (HIST.w + 20) + 'px', height: (HIST.h + 20) + 'px', border: '2px solid ' + C.neon,
        borderRadius: 'calc(var(--r) + 10px)',
      });
      s.flash = makeFlash(root);
    },
    update(t, c, s) {
      // the Workflow runs its first lines, each step saved in the history before the next one starts
      const started = c[0] + 1.8, checkOn = c[0] + 2.1, checked = c[0] + 3.0, askOn = c[0] + 3.4;
      const asked = c[0] + 4.4, waitOn = c[1] + 0.6;
      const saved = [started + 0.2, checked + 0.2, asked + 0.2];
      const restartAt = c[2] + HITS[HITS.length - 1].at, stillAt = restartAt + 1.2;
      const [joltX, joltY] = joltAt(t, c);
      const [shakeX, shakeY] = shakeAt(t, restartAt);
      const sx = joltX + shakeX, sy = joltY + shakeY;
      const stopped = t >= restartAt;

      const states = [
        t >= checked ? 2 : t >= checkOn ? 1 : 0,
        t >= waitOn ? 4 : t >= askOn ? 1 : 0,
        0, 0,
      ];
      placeLaptopRow(s.steps, t, c[0] + 0.1, states, sx, sy);

      // app instance A: runs the Workflow, then waits with nothing running, then the restart stops it
      const aIn = backPop(t, c[0] + 0.3, 0.5);
      place(s.A, APP.x + sx, APP.y + sy, aIn.s, aIn.o);
      if (stopped) setAppStatus(s.A, 'STOPPED', 'stopped');
      else if (t >= waitOn + 0.4) setAppStatus(s.A, 'WAITING, NO CODE RUNNING', 'waiting');
      else setAppStatus(s.A, t >= started ? 'RUNNING THE WORKFLOW' : '', t >= started ? 'running' : 'idle');
      const pos = P(t, checked + 0.3, 0.3) + P(t, c[1] + 0.2, 0.3);
      const cursorOn = t >= started && !stopped;
      setWfCursor(s.A, pos, P(t, started, 0.3) * (1 - P(t, restartAt, 0.2)));
      const lineStates = [
        t >= checked ? 'done' : 'todo',
        t >= asked ? 'done' : 'todo',
        t >= waitOn ? 'waiting' : 'todo',
        'todo', 'todo',
      ];
      lineStates.forEach((state, i) => {
        const current = state === 'todo' && cursorOn && Math.round(pos) === i;
        setWfLine(s.A, i, current ? 'current' : state, P(t, restartAt + 0.2 + i * 0.1, 0.8, easeIn));
      });
      s.A.empty.style.opacity = P(t, restartAt + 1.1, 0.4);
      // each hit flickers instance A red: its border (grey once stopped, violet before, as set by setAppStatus) and a
      // tint over its background
      const flicker = Math.max(...HITS.map(h => win(t, c[2] + h.at - 0.08, c[2] + h.at + 0.15, 0.1)));
      if (flicker > 0) {
        const border = stopped ? C.line : C.violet;
        const tint = `rgba(${RGB.red},${0.16 * flicker})`;
        s.A.style.borderColor = `color-mix(in srgb, ${C.red} ${Math.round(flicker * 100)}%, ${border})`;
        s.A.style.backgroundImage = `linear-gradient(${tint}, ${tint})`;
      } else {
        s.A.style.backgroundImage = '';
      }

      // the clock starts with the wait: days fly by to DAY 2, rest, then on to DAY 3 through the deploys and
      // restarts; at rest only its seconds hand moves
      const cp = backPop(t, c[1] + 1.2, 0.5);
      const day2 = [waitOn, c[1] + 4.6], day3 = [c[2] + 0.5, c[2] + 5.0];
      const elapsed = waitHours(t, ...day2, DAY2_HOURS) + waitHours(t, ...day3, DAY3_MORNING - DAY2_HOURS);
      setWaitClock(s.clock, elapsed, Math.max(win(t, ...day2, 0.3), win(t, ...day3, 0.3)));
      // the strip arrives with the clock, so it never shows empty
      place(s.strip, STRIP.x, STRIP.y, 1, P(t, c[1] + 1.0, 0.45));
      place(s.clock, CLOCK.x, CLOCK.y, cp.s, cp.o);
      // each tag slams down into its cell (from 1.25x, clear of its neighbors), landing on its hit; they all ride the
      // jolts and leave together
      s.causes.forEach((e, i) => {
        const hit = c[2] + HITS[i].at, [col, row] = HITS[i].cell;
        const land = P(t, hit - 0.25, 0.25, easeIn);
        const o = P(t, hit - 0.25, 0.1) * (1 - P(t, restartAt + 1.6, 0.4));
        place(e, TAG_X[col] + sx, TAG_Y[row] + sy, lerp(1.25, 1, land), o);
      });
      // no bolt and a softer flash than a crash, only on the last restart: a restart is routine, the drama comes
      // from the repetition
      placeFlash(s.flash, t, restartAt, 0.25);

      // Temporal and its Event History, outside the app: never moved by the hits, it lights a neon ring at each one
      place(s.temporal, TEMPORAL.x, TEMPORAL.y, 1, P(t, c[0] + 0.6, 0.5));
      s.temporal.out.style.color = t >= c[2] + 0.4 ? C.ink : C.slate;
      place(s.history, HIST.x, HIST.y, 1, P(t, c[0] + 0.8, 0.5));
      const hold = Math.max(...HITS.map(h => win(t, c[2] + h.at - 0.05, c[2] + h.at + 0.35, 0.12)));
      place(s.ring, HIST.x, HIST.y, 1, 0.9 * hold);
      // the saved rows pulse once when the subtitle points at the history
      saved.forEach((at, i) => {
        showRow(s.history.rows[i], P(t, at - 0.1, 0.3));
        const pulse = c[2] + 0.6 + i * 0.15;
        setRowTag(s.history, i, t, 'SAVED', t >= pulse ? pulse : at, P(t, at, 0.25));
      });
      setWaitLine(s.history, P(t, waitOn + 0.3, 0.4));
      setRowTag(s.history, 3, t, 'STILL WAITING', stillAt, P(t, stillAt, 0.3));
    }
  });
}
