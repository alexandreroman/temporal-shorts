// ===================== 1. AN AGENT HARNESS
// The block keeps every name declared in this file local to this scene.
{
  // the agentic loop: the model on top, the two tools below, all on one circle
  const LOOP = { cx: 960, cy: 558, r: 230 };
  const ORB = 140, TILE = { w: 180, h: 150 };
  const loopPos = deg => {
    const a = deg * Math.PI / 180;
    return [LOOP.cx + Math.cos(a) * LOOP.r, LOOP.cy + Math.sin(a) * LOOP.r];
  };
  // loop nodes and the zone each one covers (its size plus a margin), which the arcs stop short of
  const NODES = [
    { deg: -90, covers: (dx, dy) => Math.hypot(dx, dy) < ORB / 2 + 16 }, // model orb
    { deg: 30, covers: (dx, dy) => Math.abs(dx) < TILE.w / 2 + 14 && Math.abs(dy) < TILE.h / 2 + 14 }, // Flights
    { deg: 150, covers: (dx, dy) => Math.abs(dx) < TILE.w / 2 + 14 && Math.abs(dy) < TILE.h / 2 + 14 }, // Hotels
  ];
  // angle where the circle leaves a node's zone, walking from the node's center in direction dir (+1 or -1)
  const exitDeg = (deg, covers, dir) => {
    const [nx, ny] = loopPos(deg);
    let d = deg;
    for (;;) {
      const [x, y] = loopPos(d);
      if (!covers(x - nx, y - ny)) return d;
      d += dir * 0.5;
    }
  };
  // clockwise arc from node i to the next one (the last arc closes the loop back to the model)
  const arcD = i => {
    const from = NODES[i], to = NODES[(i + 1) % NODES.length];
    const toDeg = to.deg > from.deg ? to.deg : to.deg + 360;
    const [x0, y0] = loopPos(exitDeg(from.deg, from.covers, 1));
    const [x1, y1] = loopPos(exitDeg(toDeg, to.covers, -1));
    return `M ${x0} ${y0} A ${LOOP.r} ${LOOP.r} 0 0 1 ${x1} ${y1}`;
  };
  // the token goes round the loop from TOKEN_AT (after c[0]), one leg of LEG seconds per node
  const TOKEN_AT = 1.6, LEG = 1.1;
  // the harness frame around the loop, with its header row above the model; it leaves 60 px or more around
  // the loop, and 50 px between the bottom arc and the Workflow pill on its bottom edge
  const FRAME = { x0: LOOP.cx - 360, x1: LOOP.cx + 360, y0: LOOP.cy - 400, y1: LOOP.cy + 304, r: 10 };
  // capabilities plugged into the frame: [icon, label, side (-1 left, 1 right), row (0 top, 1 bottom)]
  const CAPS = [
    ['retry', 'Crash recovery', -1, 0], ['user', 'Human approvals', -1, 1],
    ['eye', 'Observability', 1, 0], ['layers', 'Composition', 1, 1],
  ];
  // the tiles fill the sides of the content frame (x 140 to 1780): the outer edges on the frame's sides, the top
  // row aligned with the harness frame's top, the bottom row with its bottom (the scene's shift is 0 by then)
  const CAP = { w: 360, h: 190, outerX0: 140, outerX1: 1780 };
  const capX = side => (side < 0 ? CAP.outerX0 + CAP.w / 2 : CAP.outerX1 - CAP.w / 2);
  const capY = row => (row ? FRAME.y1 - CAP.h / 2 : FRAME.y0 + CAP.h / 2);
  // the harness frame's edge on a side, where the link from a tile plugs in
  const frameX = side => (side < 0 ? FRAME.x0 : FRAME.x1);
  // the SDK tags sit well below the loop, where the frame's bottom edge comes later
  const SDK_Y = LOOP.cy + 330;
  scene({
    chapter: 1, title: 'An agent harness',
    // the loop with its SDK tags sits higher than the taller framed loop: pan while the tags fade out
    shift: (t, c) => pan(t, [0, -63], [[c[1], 0, 0]], 0.9),
    subs: [
      {
        text: "An AI agent is a model, plus tools, plus a loop. You write that loop with the AI SDK you already know.",
        after: 0.6,
      },
      {
        text: "The harness doesn't replace your loop, it wraps it: every agent runs as a durable Temporal Workflow.",
        after: 0.6,
      },
      {
        text: "It adds what is painful to build yourself: crash recovery, approvals, observability, composition.",
        after: 0.6,
      },
    ],
    build(root, s) {
      const { x0, x1, y0, y1, r } = FRAME;
      // created first, so the frame tint stays under the arcs and the loop
      s.frameBg = E(root, '', '', {
        left: x0 + 'px', top: y0 + 'px', width: (x1 - x0) + 'px', height: (y1 - y0) + 'px', transform: 'none',
        background: 'rgba(68,76,231,.07)', borderRadius: 'var(--r)',
      });
      s.svg = svgLayer(root);
      s.arcs = NODES.map((_, i) => arrowPath(s.svg, arcD(i), C.slate, 2.5));
      // the frame draws in two halves, from the top center down both sides, meeting at the bottom center
      const cx = LOOP.cx;
      // side 1 runs clockwise down the right edge, side -1 counterclockwise down the left edge
      const halfFrame = side => {
        const x = side > 0 ? x1 : x0, corner = x - side * r, sweep = side > 0 ? 1 : 0;
        return `M ${cx} ${y0} H ${corner} A ${r} ${r} 0 0 ${sweep} ${x} ${y0 + r} `
          + `V ${y1 - r} A ${r} ${r} 0 0 ${sweep} ${corner} ${y1} H ${cx}`;
      };
      s.frame = [1, -1].map(side => path(s.svg, halfFrame(side), C.uv, 3, false));
      // each link runs from the tile's inner edge to the frame's edge
      s.links = CAPS.map(([, , side, row]) =>
        path(s.svg, `M ${capX(side) - side * CAP.w / 2} ${capY(row)} H ${frameX(side)}`, C.uv, 2.5, false));
      // under the nodes, so it slips behind each node it reaches
      s.token = E(root, '', '', {
        width: '22px', height: '22px', background: C.neon, boxShadow: '0 0 22px 6px rgba(219,255,75,.45)',
        borderRadius: '5px',
      });
      s.llm = makeLLM(root, ORB, 'MODEL');
      s.tools = [iconTile(root, 'plane', 'Flights', TILE.w, TILE.h), iconTile(root, 'bed', 'Hotels', TILE.w, TILE.h)];
      s.loopL = E(root, 'Your agentic loop', 'lbl', { color: 'var(--ink)' });
      s.yourL = E(root, 'Your loop', 'lbl', { color: 'var(--ink)' });
      // the SDKs your loop is written with
      const sdks = ['OpenAI Agents SDK', 'Google Gen AI SDK', 'Pydantic AI'];
      s.sdkRow = E(root, sdks.map(n => '<span class="pill" style="display:flex;align-items:center;gap:10px">'
        + `${ICON('code', 22, C.slate, 1.8)}${n}</span>`).join(''), '', { display: 'flex', gap: '28px' });
      s.sdks = [...s.sdkRow.children];
      // header on whole pixels at native size: official logo, a thin rule, then the label
      s.header = E(root,
        `<img src="${LOGO}" style="height:32px;display:block">`
        + '<div style="width:1.5px;height:26px;background:#4B5363"></div>'
        + '<span class="lbl" style="color:var(--ink)">Agent harness</span>',
        '', {
          left: (x0 + 26) + 'px', top: (y0 + 22) + 'px', transform: 'none',
          display: 'flex', alignItems: 'center', gap: '16px',
        });
      // opaque UV tint so the frame line does not show through the pill
      s.workflow = tag(root, 'Temporal Workflow', 'uv');
      s.workflow.style.background = OPAQUE.uv;
      s.caps = CAPS.map(([icon, label]) => {
        const e = iconTile(root, icon, label, CAP.w, CAP.h);
        e.style.borderColor = C.uv;
        return e;
      });
      s.plugs = CAPS.map(() => E(root, '', '', {
        width: '12px', height: '12px', background: C.uv, borderRadius: '50%',
      }));
    },
    update(t, c, s) {
      // c[0]: the loop builds, the token starts going round, then the SDK tags pop under it
      const pM = P(t, c[0] + 0.1, 0.5, backOut);
      const pF = P(t, c[0] + 0.3, 0.5, backOut);
      const pH = P(t, c[0] + 0.5, 0.5, backOut);
      s.arcs.forEach((a, i) => draw(a, P(t, c[0] + 0.8 + i * 0.3, 0.45)));
      // token: one eased leg per node, so it slows down as it reaches each node and slips behind it
      const u = (t - c[0] - TOKEN_AT) / LEG;
      let near = -1;
      if (u >= 0) {
        const leg = Math.floor(u);
        const deg = -90 + 120 * (leg + ease(u - leg));
        const [x, y] = loopPos(deg);
        place(s.token, x, y, 1, P(t, c[0] + TOKEN_AT, 0.3));
        NODES.forEach((n, i) => {
          const dist = Math.abs((((deg - n.deg) % 360) + 540) % 360 - 180);
          if (dist < 20) near = i;
        });
      } else {
        place(s.token, 0, 0, 1, 0);
      }
      const [mx, my] = loopPos(NODES[0].deg);
      place(s.llm.root, mx, my, pM, clamp(pM * 2));
      llmState(s.llm, { think: near === 0 ? 1 : 0, lookY: 0.4 });
      [pF, pH].forEach((p, i) => {
        const [x, y] = loopPos(NODES[i + 1].deg);
        place(s.tools[i], x, y, p, clamp(p * 2));
        s.tools[i].style.borderColor = near === i + 1 ? C.violet : C.line;
      });
      // the label names the loop, then becomes YOUR LOOP once the harness wraps it
      const rename = P(t, c[1] + 1.6, 0.5);
      place(s.loopL, LOOP.cx, LOOP.cy - 20, 1, P(t, c[0] + 1.6, 0.5) * (1 - rename));
      place(s.yourL, LOOP.cx, LOOP.cy - 20, 1, rename);
      const sdkOut = P(t, c[1], 0.4);
      place(s.sdkRow, LOOP.cx, SDK_Y, 1, 1 - sdkOut);
      s.sdks.forEach((e, i) => {
        const p = P(t, c[0] + 3.6 + i * 0.2, 0.45, backOut);
        e.style.transform = `scale(${p})`;
        e.style.opacity = clamp(p * 2);
      });
      // c[1]: the frame draws around the loop, then its header and the Workflow pill appear
      s.frame.forEach(f => draw(f, P(t, c[1] + 1.4, 1.0)));
      s.frameBg.style.opacity = P(t, c[1] + 2.0, 0.6);
      s.header.style.opacity = P(t, c[1] + 2.4, 0.5);
      const pW = P(t, c[1] + 4.0, 0.45, backOut);
      place(s.workflow, LOOP.cx, FRAME.y1, pW, clamp(pW * 2));
      // c[2]: each capability pops beside the frame as the subtitle names it, and plugs in with a short link
      CAPS.forEach(([, , side, row], i) => {
        const a = c[2] + 2.4 + i * 0.8;
        const p = P(t, a, 0.45, backOut);
        place(s.caps[i], capX(side), capY(row), p, clamp(p * 2));
        draw(s.links[i], P(t, a + 0.3, 0.3));
        const pp = P(t, a + 0.55, 0.3, backOut);
        place(s.plugs[i], frameX(side), capY(row), pp, clamp(pp * 2));
      });
    }
  });
}
