// ===================== 3. A WORKFLOW THAT WAITS
// The block keeps every name declared in this file local to this scene.
{
  // Chapters 3 and 4 share this layout: steps on top, the app on the left, Temporal on the right
  const ROW_Y = 200;
  const APP = { x: 470, y: 470 };
  const CLOCK = { x: 277, y: 745 };
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
      s.jr = makeHistory(root);
      s.still = E(s.jr, `${ICON('hourglass', 16, '#FFFFFF', 2.2)} STILL WAITING`, 'mono', {
        left: 'auto', right: '36px', top: (74 + 3 * 44) + 'px', fontSize: '15px', letterSpacing: '.1em',
        padding: '4px 10px', borderRadius: '4px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center',
        gap: '6px', background: C.violet, color: '#FFFFFF', transformOrigin: 'right center',
      });
      s.causes = ['Deploy', 'Restart'].map(l => tag(root, l));
      // oversized so it still covers the whole stage once the scene is shifted
      s.flash = E(root, '', '', { width: '2400px', height: '1400px', background: C.red });
    },
    update(t, c, s) {
      // the Workflow runs its first lines, each step saved in the history before the next one starts
      const started = c[0] + 1.8, checkOn = c[0] + 2.1, checked = c[0] + 3.0, askOn = c[0] + 3.4;
      const asked = c[0] + 4.4, waitOn = c[1] + 0.6;
      const saved = [started + 0.2, checked + 0.2, asked + 0.2];
      const crashAt = c[2] + 4.0;
      const [sx, sy] = shakeAt(t, crashAt);
      const dead = t >= crashAt;

      const states = [
        t >= checked ? 2 : t >= checkOn ? 1 : 0,
        t >= waitOn ? 4 : t >= askOn ? 1 : 0,
        0, 0,
      ];
      placeStepRow(s.steps, t, c[0] + 0.1, states, sx, sy);

      // app instance A: runs the Workflow, then waits with nothing running, then crashes
      const aIn = P(t, c[0] + 0.3, 0.5, backOut);
      place(s.A, APP.x + sx, APP.y + sy, aIn, clamp(aIn * 2));
      if (dead) setAppStatus(s.A, 'CRASHED', 'crashed');
      else if (t >= waitOn + 0.4) setAppStatus(s.A, 'WAITING, NOTHING RUNNING', 'waiting');
      else setAppStatus(s.A, t >= started ? 'RUNNING THE WORKFLOW' : '', t >= started ? 'running' : 'idle');
      const pos = P(t, checked + 0.3, 0.3) + P(t, c[1] + 0.2, 0.3);
      const cursorOn = t >= started && !dead;
      setWfCursor(s.A, pos, P(t, started, 0.3) * (1 - P(t, crashAt, 0.2)));
      const lineStates = [
        t >= checked ? 1 : 0,
        t >= asked ? 1 : 0,
        t >= waitOn ? 2 : 0,
        0, 0,
      ];
      lineStates.forEach((st, i) => {
        const current = st === 0 && cursorOn && Math.round(pos) === i;
        setWfLine(s.A, i, current ? 3 : st, P(t, crashAt + 0.2 + i * 0.1, 0.8, easeIn));
      });
      s.A.vide.style.opacity = P(t, crashAt + 1.1, 0.4);

      // the clock starts with the wait and keeps turning through the deploy and the restart
      const cp = P(t, c[1] + 1.2, 0.5, backOut);
      const hours = 9 + Math.max(0, t - (c[1] + 1.4)) * 0.6;
      setWaitClock(s.clock, hours, t < c[1] + 4.2 ? 1 : t < c[2] + 2.4 ? 2 : 3);
      place(s.clock, CLOCK.x, CLOCK.y, cp, clamp(cp * 2));
      s.causes.forEach((e, i) => {
        const p = P(t, c[2] + 2.2 + i * 0.9, 0.45, backOut);
        place(e, 580 + i * 160 + sx, CLOCK.y + sy, p, clamp(p * 2) * (1 - P(t, crashAt + 1.6, 0.4)));
      });
      place(s.flash, 960, 540, 1, flashAt(t, crashAt) * 0.4);

      // Temporal and its Event History, outside the app: untouched by the crash
      place(s.temporal, 1380, 555, 1, P(t, c[0] + 0.6, 0.5));
      s.temporal.out.style.color = t >= c[2] + 0.4 ? C.ink : C.slate;
      place(s.jr, HIST.x, HIST.y, 1, P(t, c[0] + 0.8, 0.5));
      s.jr.rows.forEach((_, i) => showRow(s.jr, i, i < 3 ? P(t, saved[i] - 0.1, 0.3) : 0));
      // the saved rows pulse once when the subtitle points at the history
      [0, 1, 2].forEach(i => {
        const pulse = c[2] + 0.6 + i * 0.15;
        setRowTag(s.jr, i, t, 'SAVED', t >= pulse ? pulse : saved[i], P(t, saved[i], 0.25));
      });
      [3, 4, 5].forEach(i => setRowTag(s.jr, i, t, 'SAVED', 0, 0));
      setWaitLine(s.jr, P(t, waitOn + 0.3, 0.4));
      s.jr.scan.style.opacity = 0;
      s.jr.done.style.opacity = 0;
      const still = P(t, crashAt + 1.2, 0.3);
      s.still.style.opacity = still;
      s.still.style.transform = `scale(${1 + 0.14 * Math.max(0, 1 - Math.abs(t - crashAt - 1.3) / 0.25)})`;
    }
  });
}
