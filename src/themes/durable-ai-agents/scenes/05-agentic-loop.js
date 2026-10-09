// ===================== 5. THE AGENTIC LOOP
// The block keeps every name declared in this file local to this scene.
{
  const LOOP = { cx: 560, cy: 500 };
  scene({
    chapter: 5, title: 'The agentic loop',
    // loop + steps (the loop waits on the left for its steps), then the formula as the loop fades; each phase
    // centered on y 515
    shift: (t, c) => pan(t, [-76, 43], [[c[2], 0, 56]], 0.6),
    subs: [
      { text: "Repeat until the goal is reached: think, act, observe. That's the <b>agentic loop</b>.", after: 0.6 },
      {
        text: '"Book lunch with Marie on Thursday": '
          + 'check the calendar, find a restaurant, book a table, send the invite.',
        after: 1.0,
      },
      { text: "An AI agent is a model, plus tools, plus a loop, working toward a goal.", after: 0.5 },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.loop = makeAgentLoop(root, s.svg, LOOP.cx, LOOP.cy);
      s.list = makeStepList(root, "Book lunch with Marie on Thursday.", LUNCH_STEPS);
      s.exit = tag(root, 'Goal reached', 'neon');
      const pill = (cls, text) => `<span class="pill ${cls}" style="position:static">${text}</span>`;
      s.formula = E(root, '<div style="display:flex;align-items:center;gap:22px;font-size:40px">'
        + pill('violet big', 'Model') + '<span>+</span>' + pill('big', 'Tools') + '<span>+</span>'
        + pill('big', 'Loop') + '<span>=</span>' + pill('uv big', 'AI agent') + '</div>');
      s.goalF = E(root, 'working toward a goal', 'lbl', { fontSize: '24px' });
    },
    update(t, c, s) {
      const out = P(t, c[2], 0.6);
      const turns = [[c[0] + 2.0, 2.6]].concat([0, 1, 2, 3].map(i => [c[1] + 0.8 + i * 1.5, 1.5]));
      let deg = null;
      turns.forEach(([a, d]) => { if (t >= a && t < a + d) deg = -90 + 360 * ease((t - a) / d); });
      placeAgentLoop(s.loop, t, c[0] + 0.1, { deg, centerAt: c[0] + 3.0, o: 1 - out });
      placeStepList(s.list, t, {
        x: 1440, goalY: 210, rowY: 335, goalAt: c[1] + 0.1, turnStarts: [0, 1, 2, 3].map(i => c[1] + 0.8 + i * 1.5),
        o: 1 - out,
      });
      // GOAL REACHED under the steps, as far from the last one as the goal card from the first one
      const ep = backPop(t, c[1] + 7.0);
      place(s.exit, 1440, 753, ep.s, ep.o * (1 - out));
      place(s.formula, 960, 410, 1.15 * P(t, c[2] + 0.4, 0.6, backOut), P(t, c[2] + 0.4, 0.5));
      place(s.goalF, 960, 530, 1, P(t, c[2] + 2.6, 0.5));
    }
  });
}
