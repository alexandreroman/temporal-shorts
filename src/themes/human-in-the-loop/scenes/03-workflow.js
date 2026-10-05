// ===================== 3. A WORKFLOW THAT WAITS
// The block keeps every name declared in this file local to this scene.
{
  const { rowY: ROW_Y, app: APP, clock: CLOCK, temporal: TEMPORAL } = WF_LAYOUT;
  scene({
    chapter: 3, title: 'A Workflow that waits',
    shift: [0, 38],
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
      s.steps = makeStepRow(root, s.svg, ROW_Y);
      s.A = makeWorkflowApp(root, 'APP INSTANCE A');
      s.clock = makeWaitClock(root, 'Waiting for Maria');
      s.temporal = makeTemporalPanel(root);
      s.jr = makeOrderHistory(root);
      s.causes = ['Deploy', 'Restart'].map(l => tag(root, l));
      // oversized so it still covers the whole stage once the scene is shifted
      s.flash = E(root, '', '', { width: '2400px', height: '1400px', background: C.red });
    },
    update(t, c, s) {
      // the Workflow runs its first lines, each step saved in the history before the next one starts
      const started = c[0] + 1.8, checkOn = c[0] + 2.1, checked = c[0] + 3.0, askOn = c[0] + 3.4;
      const asked = c[0] + 4.4, waitOn = c[1] + 0.6;
      const saved = [started + 0.2, checked + 0.2, asked + 0.2];
      const restartAt = c[2] + 4.0, stillAt = restartAt + 1.2;
      const [sx, sy] = shakeAt(t, restartAt);
      const stopped = t >= restartAt;

      const states = [
        t >= checked ? 2 : t >= checkOn ? 1 : 0,
        t >= waitOn ? 4 : t >= askOn ? 1 : 0,
        0, 0,
      ];
      placeStepRow(s.steps, t, c[0] + 0.1, states, sx, sy);

      // app instance A: runs the Workflow, then waits with nothing running, then the restart stops it
      const aIn = P(t, c[0] + 0.3, 0.5, backOut);
      place(s.A, APP.x + sx, APP.y + sy, aIn, clamp(aIn * 2));
      if (stopped) setAppStatus(s.A, 'STOPPED', 'stopped');
      else if (t >= waitOn + 0.4) setAppStatus(s.A, 'WAITING, NOTHING RUNNING', 'waiting');
      else setAppStatus(s.A, t >= started ? 'RUNNING THE WORKFLOW' : '', t >= started ? 'running' : 'idle');
      const pos = P(t, checked + 0.3, 0.3) + P(t, c[1] + 0.2, 0.3);
      const cursorOn = t >= started && !stopped;
      setWfCursor(s.A, pos, P(t, started, 0.3) * (1 - P(t, restartAt, 0.2)));
      const lineStates = [
        t >= checked ? 1 : 0,
        t >= asked ? 1 : 0,
        t >= waitOn ? 2 : 0,
        0, 0,
      ];
      lineStates.forEach((st, i) => {
        const current = st === 0 && cursorOn && Math.round(pos) === i;
        setWfLine(s.A, i, current ? 3 : st, P(t, restartAt + 0.2 + i * 0.1, 0.8, easeIn));
      });
      s.A.vide.style.opacity = P(t, restartAt + 1.1, 0.4);

      // the clock starts with the wait: days fly by to DAY 2, rest, then on to DAY 3 through the deploy and the
      // restart; at rest only its seconds hand moves
      const cp = P(t, c[1] + 1.2, 0.5, backOut);
      const day2 = [waitOn, c[1] + 4.6], day3 = [c[2] + 0.5, c[2] + 5.0];
      const elapsed = waitHours(t, ...day2, DAY2_HOURS) + waitHours(t, ...day3, DAY3_MORNING - DAY2_HOURS);
      setWaitClock(s.clock, elapsed, Math.max(win(t, ...day2, 0.3), win(t, ...day3, 0.3)));
      place(s.clock, CLOCK.x, CLOCK.y, cp, clamp(cp * 2));
      s.causes.forEach((e, i) => {
        const p = P(t, c[2] + 2.2 + i * 0.9, 0.45, backOut);
        place(e, 580 + i * 160 + sx, CLOCK.y + sy, p, clamp(p * 2) * (1 - P(t, restartAt + 1.6, 0.4)));
      });
      // a softer flash than a crash: a restart is routine
      place(s.flash, 960, 540, 1, flashAt(t, restartAt) * 0.25);

      // Temporal and its Event History, outside the app: untouched by the restart
      place(s.temporal, TEMPORAL.x, TEMPORAL.y, 1, P(t, c[0] + 0.6, 0.5));
      s.temporal.out.style.color = t >= c[2] + 0.4 ? C.ink : C.slate;
      place(s.jr, HIST.x, HIST.y, 1, P(t, c[0] + 0.8, 0.5));
      // the saved rows pulse once when the subtitle points at the history
      saved.forEach((at, i) => {
        showRow(s.jr, i, P(t, at - 0.1, 0.3));
        const pulse = c[2] + 0.6 + i * 0.15;
        setRowTag(s.jr, i, t, 'SAVED', t >= pulse ? pulse : at, P(t, at, 0.25));
      });
      setWaitLine(s.jr, P(t, waitOn + 0.3, 0.4));
      setRowTag(s.jr, 3, t, 'STILL WAITING', stillAt, P(t, stillAt, 0.3));
    }
  });
}
