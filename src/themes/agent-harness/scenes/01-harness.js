// ===================== 1. AN AGENT HARNESS
// The block keeps every name declared in this file local to this scene.
{
  // the agentic loop: the model on top, the two tools below, all on one circle
  const LOOP = { cx: 960, cy: 551, r: 230 };
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
  const TOKEN_AT = 1.6, LEG = 0.9;
  // the turn beat of c[2], in seconds after its cue: the first message runs one lap of the loop as turn 1, the
  // reply streams out, the harness waits, then the second message opens turn 2
  const BEAT = { msg1: 0.2, arrow1: 0.6, run1: 1.0 };
  BEAT.reply = BEAT.run1 + 3 * LEG;
  BEAT.ended = BEAT.reply + 1.3;
  BEAT.wait = BEAT.ended + 0.3;
  BEAT.msg2 = BEAT.wait + 0.8;
  BEAT.arrow2 = BEAT.msg2 + 0.3;
  BEAT.run2 = BEAT.arrow2 + 0.3;
  // the token's runs round the loop, as [start, legs]: the free run of c[0] and c[1] stops on the model at the
  // end of its last full lap before turn 1, then each turn starts a run (the one of turn 2 goes on)
  const tokenRuns = c => {
    const first = c[0] + TOKEN_AT, turn1 = c[2] + BEAT.run1;
    const laps = Math.floor((turn1 - first) / (3 * LEG));
    return [[first, 3 * laps], [turn1, 3], [c[2] + BEAT.run2, Infinity]];
  };
  // legs travelled in the run under way at t, or null while the token rests behind the model
  const tokenLegs = (t, c) => {
    for (const [at, legs] of tokenRuns(c)) {
      const u = (t - at) / LEG;
      if (u >= 0 && u < legs) return u;
    }
    return null;
  };
  // the harness frame around the loop, with its header row above the model; it leaves 60 px or more around
  // the loop, and 50 px between the bottom arc and the Workflow pill on its bottom edge. The frame spans
  // y 151-855, so the pill's bottom stays inside the content frame (y 880)
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
  // the turn beat uses the side columns before the capability tiles take them: messages on the left, replies on
  // the right. Headings on the harness header's center line, cards below with explicit even heights (2, 3 and
  // 1 lines of text), so their centers rest on whole pixels
  const COL = { left: capX(-1), right: capX(1), headY: FRAME.y0 + 38, top: FRAME.y0 + 79, gap: 40 };
  const CARD_H = { msg1: 124, reply: 162, msg2: 88 };
  const msg1Y = COL.top + CARD_H.msg1 / 2;
  const replyY = COL.top + CARD_H.reply / 2;
  const msg2Y = COL.top + CARD_H.msg1 + COL.gap + CARD_H.msg2 / 2;
  // the turn badge sits on the header's center line, right-aligned on the header's margin inside the frame
  const BADGE_RIGHT = FRAME.x1 - 26;
  // type the card's text word by word, p from 0 to 1 (as in durable-ai-agents chapter 1)
  const typeWords = (card, p) => {
    const words = card.full.split(' ');
    const n = Math.round(words.length * clamp(p));
    card.txt.innerHTML = words.map((w, i) => `<span style="opacity:${i < n ? 1 : 0}">${w}</span>`).join(' ');
  };
  scene({
    chapter: 1, title: 'An agent harness',
    // the loop with its SDK tags sits higher than the taller framed loop: pan while the tags fade out
    shift: (t, c) => pan(t, [0, -56], [[c[1], 0, 0]], 0.9),
    pre: 1.0,
    post: 1.2,
    subs: [
      {
        text: "An AI agent is a model, plus tools, plus a loop. You write that loop with the AI SDK you already know.",
        after: 0.9,
      },
      {
        text: "The harness doesn't replace your loop, it wraps it: every agent runs as a durable Temporal Workflow.",
        after: 0.9,
      },
      {
        text: "A message starts a turn: the harness runs your loop, streams the reply, "
          + "then waits for the next message.",
        after: 0.8,
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
      // the turn beat: messages come in from the left, replies stream out to the right
      s.msgL = E(root, 'Messages', 'lbl');
      s.replyL = E(root, 'Replies', 'lbl');
      const card = (text, kind, who, h) => {
        const e = makeCard(root, text, kind, who, CAP.w);
        e.style.height = h + 'px';
        return e;
      };
      s.msg1 = card('Plan a trip to Lisbon, 3 nights', 'user', 'USER', CARD_H.msg1);
      s.reply = card('Your trip: flight $480, hotel $390, tour $25.', 'llm', 'AGENT', CARD_H.reply);
      s.msg2 = card('Make it 4 nights', 'user', 'USER', CARD_H.msg2);
      // the empty slot where the next message lands while the harness waits
      s.slot = E(root, 'Waiting for the next message', 'lbl', {
        width: CAP.w + 'px', height: CARD_H.msg2 + 'px', fontSize: '16px', border: `1.5px dashed ${C.slate}`,
        borderRadius: 'var(--r)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      });
      // each arrow runs from a card's inner edge to the frame's edge (or back), its head on the far end; the reply
      // leaves on the first message's line, so the two read as one flow through the harness
      const inX0 = CAP.outerX0 + CAP.w + 8, inX1 = FRAME.x0 - 5;
      s.in1 = arrowPath(s.svg, `M ${inX0} ${msg1Y} H ${inX1}`, C.violet, 2.5);
      s.in2 = arrowPath(s.svg, `M ${inX0} ${msg2Y} H ${inX1}`, C.violet, 2.5);
      s.out = arrowPath(s.svg, `M ${FRAME.x1 + 5} ${msg1Y} H ${CAP.outerX1 - CAP.w - 8}`, C.uv, 2.5);
      // the turn badge (turn number, then its status) above the line naming who runs the turns; right-aligned,
      // so it pops from its right edge
      s.badge = E(root,
        '<div style="display:flex;align-items:center;gap:14px;height:32px">'
        + '<span class="lbl" style="color:var(--ink)">Turn <span class="n">1</span></span></div>'
        + '<div class="lbl" style="font-size:16px;line-height:20px">Run by the harness</div>',
        '', {
          left: 'auto', right: (1920 - BADGE_RIGHT) + 'px', top: (COL.headY - 16) + 'px',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px',
          transformOrigin: 'right center',
        });
      s.turnN = s.badge.querySelector('.n');
      // a fixed-size tag in the badge's row, so the row keeps its width as the status changes
      s.status = statusTag(s.badge.firstChild);
      Object.assign(s.status.style, {
        position: 'relative', opacity: 1, fontSize: '16px', width: '124px', height: '32px', justifyContent: 'center',
      });
    },
    update(t, c, s) {
      // c[0]: the loop builds, the token starts going round, then the SDK tags pop under it
      const pM = P(t, c[0] + 0.1, 0.5, backOut);
      const pF = P(t, c[0] + 0.3, 0.5, backOut);
      const pH = P(t, c[0] + 0.5, 0.5, backOut);
      // the loop dims while the harness waits between turn 1 and turn 2
      const idle = P(t, c[2] + BEAT.wait, 0.4) * (1 - P(t, c[2] + BEAT.run2 - 0.3, 0.3));
      const loopO = 1 - 0.5 * idle;
      s.arcs.forEach((a, i) => draw(a, P(t, c[0] + 0.8 + i * 0.3, 0.45), loopO));
      // token: one eased leg per node, so it slows down as it reaches each node and slips behind it; between
      // runs it rests behind the model (hidden while the dimmed model would show it through)
      const u = tokenLegs(t, c);
      let near = -1, deg = NODES[0].deg;
      if (u !== null) {
        const leg = Math.floor(u);
        deg = -90 + 120 * (leg + ease(u - leg));
        NODES.forEach((n, i) => {
          const dist = Math.abs((((deg - n.deg) % 360) + 540) % 360 - 180);
          if (dist < 20) near = i;
        });
      }
      const [tx, ty] = loopPos(deg);
      place(s.token, tx, ty, 1, P(t, c[0] + TOKEN_AT, 0.3) * (1 - idle));
      const [mx, my] = loopPos(NODES[0].deg);
      place(s.llm.root, mx, my, pM, clamp(pM * 2) * loopO);
      llmState(s.llm, { think: near === 0 ? 1 : 0, lookY: 0.4 });
      [pF, pH].forEach((p, i) => {
        // rounded, so the tiles rest on whole pixels
        const [x, y] = loopPos(NODES[i + 1].deg).map(Math.round);
        place(s.tools[i], x, y, p, clamp(p * 2) * loopO);
        s.tools[i].style.borderColor = near === i + 1 ? C.violet : C.line;
      });
      // the label names the loop, then becomes YOUR LOOP once the harness wraps it
      const rename = P(t, c[1] + 1.6, 0.5);
      place(s.loopL, LOOP.cx, LOOP.cy - 20, 1, P(t, c[0] + 1.6, 0.5) * (1 - rename));
      place(s.yourL, LOOP.cx, LOOP.cy - 20, 1, rename * loopO);
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
      // half a pixel low, so the 49 px pill rests on whole pixels
      const pW = P(t, c[1] + 4.0, 0.45, backOut);
      place(s.workflow, LOOP.cx, FRAME.y1 + 0.5, pW, clamp(pW * 2));
      // c[2]: a message comes in and opens turn 1, the token runs a lap of your loop, the reply streams out and
      // the turn ends; the harness waits, then a second message opens turn 2. All of it fades out at c[3],
      // before the capability tiles take the side columns
      const out = 1 - P(t, c[3], 0.5);
      const b = c[2];
      const heads = P(t, b + 0.1, 0.5) * out;
      place(s.msgL, COL.left, COL.headY, 1, heads);
      place(s.replyL, COL.right, COL.headY, 1, heads);
      const p1 = P(t, b + BEAT.msg1, 0.45, backOut);
      place(s.msg1, COL.left, msg1Y, p1, clamp(p1 * 2) * out);
      draw(s.in1, P(t, b + BEAT.arrow1, 0.4), out);
      // the badge pops as the message enters the frame; its number swells when turn 2 opens
      const pB = P(t, b + BEAT.run1, 0.45, backOut) * swell(t, b + BEAT.run2, 0.08);
      s.badge.style.transform = `scale(${pB})`;
      s.badge.style.opacity = clamp(P(t, b + BEAT.run1, 0.45) * 2) * out;
      const turn2 = t >= b + BEAT.run2;
      s.turnN.textContent = turn2 ? '2' : '1';
      if (!turn2 && t >= b + BEAT.ended) setStatus(s.status, 'ENDED', 'ok');
      else setStatus(s.status, 'RUNNING', 'wait');
      s.status.style.transform = `scale(${swell(t, b + BEAT.ended, 0.12)})`;
      // the reply streams out word by word once the lap is back on the model
      draw(s.out, P(t, b + BEAT.reply, 0.3), out);
      const pR = P(t, b + BEAT.reply + 0.1, 0.45, backOut);
      place(s.reply, COL.right, replyY, pR, clamp(pR * 2) * out);
      typeWords(s.reply, clamp((t - (b + BEAT.reply + 0.2)) / 1.1));
      // the empty slot breathes while the harness waits, then the second message takes its place
      const breathe = 0.8 + 0.2 * Math.cos((t - b - BEAT.wait) * 4);
      const slotO = P(t, b + BEAT.wait, 0.4) * (1 - P(t, b + BEAT.msg2, 0.3));
      place(s.slot, COL.left, msg2Y, 1, slotO * breathe * out);
      const p2 = P(t, b + BEAT.msg2, 0.45, backOut);
      place(s.msg2, COL.left, msg2Y, p2, clamp(p2 * 2) * out);
      draw(s.in2, P(t, b + BEAT.arrow2, 0.3), out);
      // c[3]: each capability pops beside the frame as the subtitle names it, and plugs in with a short link
      CAPS.forEach(([, , side, row], i) => {
        const a = c[3] + 2.4 + i * 0.8;
        const p = P(t, a, 0.45, backOut);
        place(s.caps[i], capX(side), capY(row), p, clamp(p * 2));
        draw(s.links[i], P(t, a + 0.3, 0.3));
        const pp = P(t, a + 0.55, 0.3, backOut);
        place(s.plugs[i], frameX(side), capY(row), pp, clamp(pp * 2));
      });
    }
  });
}
