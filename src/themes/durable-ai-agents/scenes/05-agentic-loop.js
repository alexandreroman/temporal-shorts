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
      s.goal = makeCard(root, "Book lunch with Marie on Thursday.", 'user', null, 640);
      s.rows = STEPS.map(step => {
        const row = E(root,
          `${ICON(step.icon, 36, C.ink, 1.6)}<div style="flex:1;margin-left:18px">`
          + `<div style="font-size:27px">${step.action}</div>`
          + `<div class="res mono" style="font-size:18px;color:var(--neon);opacity:0">${step.result}</div></div>`
          + `<div class="ck" style="opacity:0">${ICON('check', 32, C.neon, 2.6)}</div>`,
          'tile', {
            width: '640px', height: '88px', display: 'flex', alignItems: 'center', padding: '0 22px', textAlign: 'left',
          });
        row.res = row.querySelector('.res'); row.ck = row.querySelector('.ck'); return row;
      });
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
      place(s.goal, 1440, 210, P(t, c[1] + 0.1, 0.45, backOut), P(t, c[1] + 0.1, 0.4) * (1 - out));
      s.rows.forEach((r, i) => {
        const a = c[1] + 0.8 + i * 1.5, pr = P(t, a + 0.5, 0.35);
        place(r, 1440, 335 + i * 104, 1, pr * (1 - out));
        r.style.transform += ` translateX(${(1 - pr) * 40}px)`;
        r.res.style.opacity = P(t, a + 1.05, 0.3); r.ck.style.opacity = P(t, a + 1.15, 0.25);
        r.style.borderColor = (t > a && t < a + 1.5) ? C.violet : C.line;
      });
      // GOAL REACHED under the steps, as far from the last one as the goal card from the first one
      const ep = P(t, c[1] + 7.0, 0.45, backOut);
      place(s.exit, 1440, 753, ep, clamp(ep * 2) * (1 - out));
      place(s.formula, 960, 410, 1.15 * P(t, c[2] + 0.4, 0.6, backOut), P(t, c[2] + 0.4, 0.5));
      place(s.goalF, 960, 530, 1, P(t, c[2] + 2.6, 0.5));
    }
  });
}
