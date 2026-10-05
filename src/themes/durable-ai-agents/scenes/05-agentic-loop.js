// ===================== 5. AGENTIC LOOP
// The block keeps every name declared in this file local to this scene.
{
  const LOOP = { cx: 560, cy: 500, r: 220 };
  const loopPos = deg => {
    const a = deg * Math.PI / 180;
    return [LOOP.cx + Math.cos(a) * LOOP.r, LOOP.cy + Math.sin(a) * LOOP.r];
  };
  const arcD = (d0, d1) => {
    const [x0, y0] = loopPos(d0), [x1, y1] = loopPos(d1);
    return `M ${x0} ${y0} A ${LOOP.r} ${LOOP.r} 0 0 1 ${x1} ${y1}`;
  };
  scene({
    chapter: 5, title: 'The agentic loop',
    // loop + steps (the loop waits on the left for its steps), then the formula as the loop fades
    shift: (t, c) => pan(t, [-76, 66], [[c[2], 0, 63]], 0.6),
    subs: [
      { text: "Repeat until the goal is reached: think, act, observe. That's the <b>agentic loop</b>.", after: 0.6 },
      {
        text: "“Book lunch with Marie on Thursday”: "
          + "check the calendar, find a restaurant, book a table, send the invite.",
        after: 1.0,
      },
      { text: "An AI agent is a model, plus tools, plus a loop, working toward a goal.", after: 0.5 },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      const arcs = [arcD(-90 + 27, 30 - 27), arcD(30 + 27, 150 - 27), arcD(150 + 27, 270 - 27)];
      s.arcs = arcs.map(d => path(s.svg, d, C.slate, 2.5));
      s.nThink = makeLLM(root, 130, '');
      s.nAct = iconTile(root, 'play', '', 130, 130, C.neon); s.nAct.style.borderColor = C.neon;
      s.nObs = iconTile(root, 'eye', '', 130, 130, C.ink); s.nObs.style.borderColor = C.uv;
      s.lThink = E(root, 'Think', 'lbl', { color: 'var(--ink)' });
      s.lAct = E(root, 'Act', 'lbl', { color: 'var(--ink)' });
      s.lObs = E(root, 'Observe', 'lbl', { color: 'var(--ink)' });
      s.center = E(root, 'Agentic<br>loop', 'lbl', {
        textAlign: 'center', color: 'var(--ink)', fontSize: '24px', lineHeight: 1.4,
      });
      s.token = E(root, '', '', {
        width: '22px', height: '22px', background: C.neon, boxShadow: '0 0 22px 6px rgba(219,255,75,.45)',
        borderRadius: '5px',
      });
      s.goal = makeCard(root, "Book lunch with Marie on Thursday.", 'user', null, 640);
      const steps = [
        ['cal', 'Check the calendar', 'Thu 12:30 is free'], ['search', 'Find a restaurant', 'Chez Paulette'],
        ['food', 'Book a table', 'table for 2, confirmed'], ['mail', 'Invite Marie', 'invite sent'],
      ];
      s.rows = steps.map(([i, a, r]) => {
        const row = E(root,
          `${ICON(i, 36, C.ink, 1.6)}<div style="flex:1;margin-left:18px"><div style="font-size:27px">${a}</div>`
          + `<div class="res mono" style="font-size:18px;color:var(--neon);opacity:0">${r}</div></div>`
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
      const pT = P(t, c[0] + 0.1, 0.5, backOut);
      const pA = P(t, c[0] + 0.3, 0.5, backOut);
      const pO = P(t, c[0] + 0.5, 0.5, backOut);
      const turns = [[c[0] + 2.0, 2.6]].concat([0, 1, 2, 3].map(i => [c[1] + 0.8 + i * 1.5, 1.5]));
      let deg = null;
      turns.forEach(([a, d]) => { if (t >= a && t < a + d) deg = -90 + 360 * ease((t - a) / d); });
      const near = d => deg === null ? 0 : Math.max(0, 1 - Math.abs((((deg - d) % 360) + 540) % 360 - 180) / 30);
      const [tx, ty] = loopPos(-90), [ax, ay] = loopPos(30), [ox, oy] = loopPos(150);
      place(s.nThink.root, tx, ty, pT * (1 + 0.12 * near(-90)), clamp(pT * 2) * (1 - out));
      llmState(s.nThink, { think: near(-90) > 0.2 ? 1 : 0, look: 0.5 });
      place(s.nAct, ax, ay, pA * (1 + 0.12 * near(30)), clamp(pA * 2) * (1 - out));
      place(s.nObs, ox, oy, pO * (1 + 0.12 * near(150)), clamp(pO * 2) * (1 - out));
      place(s.lThink, tx - 130, ty, 1, P(t, c[0] + 0.4, 0.4) * (1 - out));
      place(s.lAct, ax, ay + 98, 1, P(t, c[0] + 0.6, 0.4) * (1 - out));
      place(s.lObs, ox, oy + 98, 1, P(t, c[0] + 0.8, 0.4) * (1 - out));
      s.arcs.forEach((a, i) => draw(a, P(t, c[0] + 0.8 + i * 0.3, 0.45), 1 - out));
      place(s.center, LOOP.cx, LOOP.cy, 1, P(t, c[0] + 3.0, 0.5) * (1 - out));
      if (deg !== null) {
        const [x, y] = loopPos(deg);
        place(s.token, x, y, 1, 1 - out);
      } else {
        place(s.token, 0, 0, 1, 0);
      }
      place(s.goal, 1440, 210, P(t, c[1] + 0.1, 0.45, backOut), P(t, c[1] + 0.1, 0.4) * (1 - out));
      s.rows.forEach((r, i) => {
        const a = c[1] + 0.8 + i * 1.5, pr = P(t, a + 0.5, 0.35);
        place(r, 1440, 335 + i * 104, 1, pr * (1 - out));
        r.style.transform += ` translateX(${(1 - pr) * 40}px)`;
        r.res.style.opacity = P(t, a + 1.05, 0.3); r.ck.style.opacity = P(t, a + 1.15, 0.25);
        r.style.borderColor = (t > a && t < a + 1.5) ? C.violet : C.line;
      });
      const ep = P(t, c[1] + 7.0, 0.45, backOut);
      place(s.exit, 1440, 790, ep, clamp(ep * 2) * (1 - out));
      place(s.formula, 960, 410, 1.15 * P(t, c[2] + 0.4, 0.6, backOut), P(t, c[2] + 0.4, 0.5));
      place(s.goalF, 960, 530, 1, P(t, c[2] + 2.6, 0.5));
    }
  });
}
