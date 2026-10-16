// ===================== 5. THE AGENTIC LOOP
// The block keeps every name declared in this file local to this scene.
{
  const LOOP = { cx: 560, cy: 500 };
  // the step list: the goal card and the rows, 640 px wide, the rows 104 px apart; each step takes a 1.5 s turn
  const LIST = { w: 640, gap: 104 };
  const TURN = 1.5;
  // The agent's goal and its steps: the user's goal card (YOU), then one row per step (icon, action, a neon result
  // line and a check, both hidden until the step is done)
  const makeStepList = (root, goalText, steps) => {
    const goal = makeCard(root, goalText, 'user', null, LIST.w);
    const rows = steps.map(step => {
      const row = E(root,
        `${ICON(step.icon, 36, C.ink, 1.6)}<div style="flex:1;margin-left:18px">`
        + `<div style="font-size:27px">${step.action}</div>`
        + `<div class="res mono" style="font-size:18px;color:var(--neon);opacity:0">${step.result}</div></div>`
        + `<div class="ck" style="opacity:0">${ICON('check', 32, C.neon, 2.6)}</div>`,
        'tile', {
          width: LIST.w + 'px', height: '88px', display: 'flex', alignItems: 'center', padding: '0 22px',
          textAlign: 'left',
        });
      row.res = row.querySelector('.res'); row.ck = row.querySelector('.ck'); return row;
    });
    return { goal, rows };
  };
  // Places the goal card at (x, goalY), popping in at goalAt, and the rows from rowY. Row i slides in half a second
  // into its turn (turnStarts[i]), shows its result and its check at the end of the turn, and has a violet border
  // while its turn runs; o: opacity of the whole list
  const placeStepList = (list, t, { x, goalY, rowY, goalAt, turnStarts, o }) => {
    place(list.goal, x, goalY, P(t, goalAt, 0.45, backOut), P(t, goalAt, 0.4) * o);
    list.rows.forEach((r, i) => {
      const a = turnStarts[i], pr = P(t, a + 0.5, 0.35);
      place(r, x, rowY + i * LIST.gap, 1, pr * o);
      r.style.transform += ` translateX(${(1 - pr) * 40}px)`;
      r.res.style.opacity = P(t, a + 1.05, 0.3); r.ck.style.opacity = P(t, a + 1.15, 0.25);
      r.style.borderColor = (t > a && t < a + TURN) ? C.violet : C.line;
    });
  };
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
      const turnStarts = [0, 1, 2, 3].map(i => c[1] + 0.8 + i * TURN);
      const turns = [[c[0] + 2.0, 2.6]].concat(turnStarts.map(a => [a, TURN]));
      let deg = null;
      turns.forEach(([a, d]) => { if (t >= a && t < a + d) deg = -90 + 360 * ease((t - a) / d); });
      placeAgentLoop(s.loop, t, c[0] + 0.1, { deg, centerAt: c[0] + 3.0, o: 1 - out });
      placeStepList(s.list, t, { x: 1440, goalY: 210, rowY: 335, goalAt: c[1] + 0.1, turnStarts, o: 1 - out });
      // GOAL REACHED under the steps, as far from the last one as the goal card from the first one
      const ep = backPop(t, c[1] + 7.0);
      place(s.exit, 1440, 753, ep.s, ep.o * (1 - out));
      place(s.formula, 960, 410, 1.15 * P(t, c[2] + 0.4, 0.6, backOut), P(t, c[2] + 0.4, 0.5));
      place(s.goalF, 960, 530, 1, P(t, c[2] + 2.6, 0.5));
    }
  });
}
