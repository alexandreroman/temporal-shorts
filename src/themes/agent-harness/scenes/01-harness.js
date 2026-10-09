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
  const TOKEN_AT = 4.4, LEG = 0.9;
  // the beat of a turn, in seconds after its cue (c[2] for turn 1, c[3] for turn 2): the message comes in, the
  // turn runs one lap of the loop, the reply streams out and the turn ends
  const BEAT = { msg: 0.3, arrow: 0.7, run: 1.3 };
  BEAT.reply = BEAT.run + 3 * LEG;
  BEAT.ended = BEAT.reply + 2.5;
  // after turn 1, the harness waits for the next message (until c[3])
  BEAT.wait = BEAT.ended + 1.2;
  // the token's runs round the loop, as [start, legs]: the free run of c[0] and c[1] stops on the model at the
  // end of its last full lap before turn 1, then each turn runs one lap
  const tokenRuns = c => {
    const first = c[0] + TOKEN_AT, turn1 = c[2] + BEAT.run;
    const laps = Math.floor((turn1 - first) / (3 * LEG));
    return [[first, 3 * laps], [turn1, 3], [c[3] + BEAT.run, 3]];
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
  // the SDK tags sit well below the loop, where the frame's bottom edge comes later: the available SDKs on a
  // first row, the planned ones on a second, each row headed by its label. Every tag has the width of the widest,
  // so the two rows line up column by column; Google ADK sits under Google Gemini, sharing the Google column
  const SDKS = ['OpenAI Agents SDK', 'Google Gemini', 'Pydantic AI'];
  const PLANNED_SDKS = ['Strands Agents', 'Google ADK', 'LangGraph'];
  const SDK = { y: LOOP.cy + 310, h: 50, rowGap: 20, labelW: 112, tagW: 340, gap: 28 };
  SDK.plannedY = SDK.y + SDK.h + SDK.rowGap;
  // when each row's label fades in and its first tag pops, in seconds after c[0]; the tags of a row follow 0.2 s
  // apart
  const SDK_AT = [5.9, 6.9];
  // the turn beat uses the side columns before the capability tiles take them: messages on the left, replies on
  // the right. Headings on the harness header's center line, cards below with explicit even heights (2 or 1
  // lines of text), so their centers rest on whole pixels
  const COL = { left: capX(-1), right: capX(1), headY: FRAME.y0 + 38, top: FRAME.y0 + 79, gap: 40 };
  const CARD_H = { msg1: 124, reply1: 124, msg2: 88, reply2: 124 };
  const msg1Y = COL.top + CARD_H.msg1 / 2;
  const reply1Y = COL.top + CARD_H.reply1 / 2;
  const msg2Y = COL.top + CARD_H.msg1 + COL.gap + CARD_H.msg2 / 2;
  const reply2Y = COL.top + CARD_H.reply1 + COL.gap + CARD_H.reply2 / 2;
  // the turn badge sits on the header's center line, right-aligned on the header's margin inside the frame
  const BADGE_RIGHT = FRAME.x1 - 26;
  // c[4] compares one LLM call (top row) with one turn (bottom row), on the content frame (x 140 to 1780,
  // y 150 to 880). Headings on the left edge; the turn runs from the message card to the reply card, its model
  // calls on one line and its tool calls on a lower one, a bracket under the whole turn. Chips and cards have
  // even heights, so their whole-pixel centers rest on whole pixels
  const CMP = {
    left: 140, right: 1780, head1Top: 150, stripTop: 242, stripH: 50, head2Top: 411,
    cardW: 340, cardY: 584, modelY: 584, toolY: 742, chipH: 50, statusH: 30, statusGap: 10,
    xs: [660, 810, 960, 1110, 1260], bracketY: 855, tick: 16,
  };
  // the calls of one turn: [tool or Model, chip class]; model calls on even indexes
  const TURN_CALLS = [['Model', 'uv'], ['search_flights', ''], ['Model', 'uv'], ['search_hotels', ''], ['Model', 'uv']];
  const isModelCall = i => i % 2 === 0;
  const callY = i => (isModelCall(i) ? CMP.modelY : CMP.toolY);
  // the SAVED status sits on the outer side of its chip: above the model calls, below the tool calls
  const statusY = i => {
    const off = CMP.chipH / 2 + CMP.statusGap + CMP.statusH / 2;
    return isModelCall(i) ? callY(i) - off : callY(i) + off;
  };
  // the links of the turn, in flow order: message card to the first call, call to call (an S-curve from the
  // bottom of a model chip down to the top of a tool chip, or back up), last call to the reply card
  const turnLinks = () => {
    const { xs, chipH, cardW, left, right, modelY } = CMP;
    const links = [`M ${left + cardW + 8} ${modelY} H ${xs[0] - 53 - 8}`];
    for (let i = 0; i + 1 < xs.length; i++) {
      const down = isModelCall(i);
      const x0 = xs[i] + (down ? 20 : 30), x1 = xs[i + 1] - (down ? 30 : 20);
      const y0 = callY(i) + (down ? 1 : -1) * (chipH / 2 + 6);
      const y1 = callY(i + 1) + (down ? -1 : 1) * (chipH / 2 + 8);
      const ym = (y0 + y1) / 2;
      links.push(`M ${x0} ${y0} C ${x0} ${ym} ${x1} ${ym} ${x1} ${y1}`);
    }
    links.push(`M ${xs[xs.length - 1] + 53 + 8} ${modelY} H ${right - cardW - 8}`);
    return links;
  };
  // the comparison beat of c[4], in seconds after its cue: the rows appear, then each call pops after the link
  // that leads to it, and the reply comes out
  const CMP_AT = { head1: 0.3, strip: 0.6, head2: 1.4, msg: 1.6, call0: 2.5, callGap: 1.0, link: 0.4 };
  CMP_AT.reply = CMP_AT.call0 + TURN_CALLS.length * CMP_AT.callGap;
  // the durability beat of c[5]: each call is saved, and streams live at once: the link leading to it draws and
  // the chip lights. After the last call, the reply streams, the bracket closes under the turn and the pill pops
  const SAVE_AT = { saved0: 0.5, savedGap: 1.2, seg: 0.35 };
  const savedAt = i => SAVE_AT.saved0 + i * SAVE_AT.savedGap;
  SAVE_AT.reply = savedAt(TURN_CALLS.length - 1) + SAVE_AT.seg;
  SAVE_AT.streamed = SAVE_AT.reply + 0.5;
  // a straight arrow drawn inline in a flex row, its head filled explicitly (see arrowHead in engine.js)
  const inlineArrow = (w, color) => `<svg width="${w}" height="14" viewBox="0 0 ${w} 14" style="display:block">`
    + `<path d="M1.5 7 H ${w - 8}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`
    + `<path d="M${w - 12} 1.5 L${w} 7 L${w - 12} 12.5 z" fill="${color}"/></svg>`;
  // a label block on the left edge: an ink heading over a slate sub-label
  const makeHeading = (p, title, sub, top) => E(p,
    `<div class="lbl" style="color:var(--ink)">${title}</div>`
    + `<div class="lbl" style="font-size:16px;margin-top:8px">${sub}</div>`,
    '', { left: CMP.left + 'px', top: top + 'px' });
  scene({
    chapter: 1, title: 'An agent harness',
    // the loop with its SDK tags sits higher than the taller framed loop: pan while the tags fade out
    shift: (t, c) => pan(t, [0, -82], [[c[1], 0, 0]], 0.9),
    // every state holds long enough to be read: the header before the first subtitle, the last tiles at the end
    pre: 1.5,
    post: 2.0,
    subs: [
      {
        text: "An AI agent is a model, plus tools, plus a loop. You write that loop with the AI SDK you already know.",
        // the planned SDKs land at c[0] + 7.75 and read for 2 s before the tags fade
        after: 2.5,
      },
      {
        text: "The harness doesn't replace your loop, it wraps it: every agent runs as a durable Temporal Workflow.",
        after: 1.0,
      },
      {
        text: "A message starts a <b>turn</b>: the harness runs your loop, streams the reply, "
          + "then waits for the next message.",
        after: 2.5,
      },
      {
        text: "The next message opens turn 2. The agent stays alive between turns, with its state intact.",
        after: 1.9,
      },
      {
        text: "An LLM call is one <b>step</b>. A turn lasts until the agent is idle again: often many model and tool calls.",
        after: 2.5,
      },
      {
        text: "The harness saves each call as it completes, and streams every step of the turn live.",
        after: 2.7,
      },
      {
        text: "It adds what is painful to build yourself: crash recovery, approvals, observability, composition.",
        after: 0.8,
      },
    ],
    build(root, s) {
      const { x0, x1, y0, y1, r } = FRAME;
      // created first, so the frame tint stays under the arcs and the loop
      s.frameBg = E(root, '', '', {
        left: x0 + 'px', top: y0 + 'px', width: (x1 - x0) + 'px', height: (y1 - y0) + 'px',
        background: 'rgba(68,76,231,.07)', borderRadius: 'var(--r)',
      });
      s.svg = svgLayer(root);
      s.arcs = NODES.map((_, i) => path(s.svg, arcD(i), C.slate, 2.5, true));
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
      s.token = makeToken(root);
      s.llm = makeLLM(root, ORB, 'MODEL');
      s.tools = [iconTile(root, 'plane', 'Flights', TILE.w, TILE.h), iconTile(root, 'bed', 'Hotels', TILE.w, TILE.h)];
      s.loopL = E(root, 'Your agentic loop', 'lbl', { color: 'var(--ink)' });
      s.yourL = E(root, 'Your loop', 'lbl', { color: 'var(--ink)' });
      // the SDKs your loop is written with: the available ones, then the planned ones, dashed and dimmed
      const sdkTag = (name, planned) => {
        const look = planned ? `border-style:dashed;border-color:${C.slate};color:${C.slate};background:none;` : '';
        return `<span class="pill" style="width:${SDK.tagW}px;display:flex;align-items:center;justify-content:center;`
          + `gap:10px;${look}">${ICON('code', 22, C.slate, 1.8)}${name}</span>`;
      };
      const sdkRow = (label, names, planned) => E(root,
        `<span class="lbl" style="width:${SDK.labelW}px;font-size:16px;text-align:right">${label}</span>`
        + names.map(name => sdkTag(name, planned)).join(''),
        '', { display: 'flex', alignItems: 'center', gap: SDK.gap + 'px' });
      s.sdkRows = [sdkRow('Available', SDKS, false), sdkRow('Planned', PLANNED_SDKS, true)];
      // header on whole pixels at native size: official logo, a thin rule, then the label
      s.header = E(root,
        `<img src="${LOGO}" style="height:32px;display:block">`
        + '<div style="width:1.5px;height:26px;background:#4B5363"></div>'
        + '<span class="lbl" style="color:var(--ink)">Agent harness</span>',
        '', {
          left: (x0 + 26) + 'px', top: (y0 + 22) + 'px',
          display: 'flex', alignItems: 'center', gap: '16px',
        });
      // opaque UV tint so the frame line does not show through the pill
      s.workflow = tag(root, 'Temporal Workflow', 'uv solid');
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
      s.reply1 = card('Your trip: flight $480, hotel $390.', 'llm', 'AGENT', CARD_H.reply1);
      s.msg2 = card('Add a city tour', 'user', 'USER', CARD_H.msg2);
      s.reply2 = card('Added: Tram 28 tour $25. Total $895.', 'llm', 'AGENT', CARD_H.reply2);
      // the empty slot where the next message lands while the harness waits
      s.slot = E(root, 'Waiting for the next message', 'lbl', {
        width: CAP.w + 'px', height: CARD_H.msg2 + 'px', fontSize: '16px', border: `1.5px dashed ${C.slate}`,
        borderRadius: 'var(--r)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      });
      // each arrow runs from a card's inner edge to the frame's edge (or back), its head on the far end; the reply
      // leaves on the first message's line, so the two read as one flow through the harness
      const inX0 = CAP.outerX0 + CAP.w + 8, inX1 = FRAME.x0 - 5;
      s.in1 = path(s.svg, `M ${inX0} ${msg1Y} H ${inX1}`, C.violet, 2.5, true);
      s.in2 = path(s.svg, `M ${inX0} ${msg2Y} H ${inX1}`, C.violet, 2.5, true);
      const outX0 = FRAME.x1 + 5, outX1 = CAP.outerX1 - CAP.w - 8;
      s.out1 = path(s.svg, `M ${outX0} ${msg1Y} H ${outX1}`, C.uv, 2.5, true);
      s.out2 = path(s.svg, `M ${outX0} ${reply2Y} H ${outX1}`, C.uv, 2.5, true);
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
      s.status = statusTag(s.badge.firstChild, { font: 16 });
      Object.assign(s.status.style, {
        position: 'relative', opacity: 1, width: '124px', height: '32px', justifyContent: 'center',
      });
      // c[4]: one LLM call, a compact strip on the top row, deliberately short against the long turn row below
      s.callHead = makeHeading(root, 'An LLM call', 'One step', CMP.head1Top);
      const codeText = text => `<span class="mono" style="font-size:22px;color:var(--slate)">${text}</span>`;
      s.callStrip = E(root, codeText('text in') + inlineArrow(64, C.slate), '', {
        left: CMP.left + 'px', top: CMP.stripTop + 'px', height: CMP.stripH + 'px',
        display: 'flex', alignItems: 'center', gap: '16px',
      });
      const model = callCard(s.callStrip, 'Model', '', 'uv');
      Object.assign(model.style, { position: 'relative', opacity: 1 });
      s.callStrip.insertAdjacentHTML('beforeend', inlineArrow(64, C.slate) + codeText('text out'));
      // one turn, on the bottom row: slate links under the chips, and their violet copies for the stream
      s.turnHead = makeHeading(root, 'A turn', 'Until the agent is idle again', CMP.head2Top);
      s.turnLinks = turnLinks().map(d => path(s.svg, d, C.slate, 2.5, true));
      s.streamLinks = turnLinks().map(d => path(s.svg, d, C.violet, 3, true));
      const { left, right, bracketY, tick } = CMP;
      s.bracket = path(s.svg, `M ${left} ${bracketY - tick} V ${bracketY} H ${right} V ${bracketY - tick}`,
        C.violet, 2.5, false);
      s.turnMsg = card('Plan a trip to Lisbon, 3 nights', 'user', 'USER', CARD_H.msg1);
      s.turnReply = card('Your trip: flight $480, hotel $390.', 'llm', 'AGENT', CARD_H.reply1);
      [s.turnMsg, s.turnReply].forEach(e => { e.style.width = CMP.cardW + 'px'; });
      s.calls = TURN_CALLS.map(([name, cls]) => callCard(root, name, '', cls));
      s.saved = TURN_CALLS.map(() => {
        const e = statusTag(root, { font: 16 });
        e.style.height = CMP.statusH + 'px';
        return e;
      });
      // opaque violet tint, so the bracket line does not show through the pill
      s.streamed = tag(root, 'Streamed live, replayable', 'violet solid');
    },
    update(t, c, s) {
      // c[0]: the model, then the tools, then the arcs of the loop; its label and the token, then the SDK tags
      const pM = P(t, c[0] + 0.2, 0.5, backOut);
      const pF = P(t, c[0] + 1.7, 0.5, backOut);
      const pH = P(t, c[0] + 1.9, 0.5, backOut);
      // the harness and its loop leave the stage to the comparison of c[4] and c[5], then come back for c[6]
      const harnessO = 1 - P(t, c[4], 0.5) * (1 - P(t, c[6] + 0.3, 0.5));
      // the loop dims while the harness waits between turn 1 and turn 2
      const idle = P(t, c[2] + BEAT.wait, 0.4) * (1 - P(t, c[3] + BEAT.run - 0.3, 0.3));
      // the token hides with the loop, and comes back only once the model is fully lit again
      const tokenAway = P(t, c[2] + BEAT.wait, 0.4) * (1 - P(t, c[3] + BEAT.run, 0.2));
      const loopO = (1 - 0.5 * idle) * harnessO;
      s.arcs.forEach((a, i) => draw(a, P(t, c[0] + 3.0 + i * 0.3, 0.45), loopO));
      // token: one eased leg per node, so it slows down as it reaches each node and slips behind it. Between runs
      // it rests hidden behind the model, so it hides whenever the harness is not fully lit: a dimmed or fading
      // model would show it through
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
      const harnessLit = harnessO === 1 ? 1 : 0;
      place(s.token, tx, ty, 1, P(t, c[0] + TOKEN_AT, 0.3) * (1 - tokenAway) * harnessLit);
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
      const rename = P(t, c[1] + 1.0, 0.5);
      place(s.loopL, LOOP.cx, LOOP.cy - 20, 1, P(t, c[0] + TOKEN_AT, 0.5) * (1 - rename));
      place(s.yourL, LOOP.cx, LOOP.cy - 20, 1, rename * loopO);
      // the available SDKs, then the planned ones: each row's label fades in, then its tags pop one by one
      const sdkOut = P(t, c[1], 0.4);
      s.sdkRows.forEach((row, r) => {
        place(row, LOOP.cx, r === 0 ? SDK.y : SDK.plannedY, 1, 1 - sdkOut);
        const [label, ...tags] = row.children;
        label.style.opacity = P(t, c[0] + SDK_AT[r] - 0.1, 0.4);
        tags.forEach((e, i) => {
          const p = P(t, c[0] + SDK_AT[r] + i * 0.2, 0.45, backOut);
          e.style.transform = `scale(${p})`;
          e.style.opacity = clamp(p * 2);
        });
      });
      // c[1]: the label becomes YOUR LOOP (above), the frame draws around the loop, then its header and the
      // Workflow pill appear
      s.frame.forEach(f => draw(f, P(t, c[1] + 2.4, 1.2), harnessO));
      s.frameBg.style.opacity = P(t, c[1] + 3.9, 0.6) * harnessO;
      s.header.style.opacity = P(t, c[1] + 3.9, 0.5) * harnessO;
      const pW = P(t, c[1] + 5.4, 0.45, backOut);
      place(s.workflow, LOOP.cx, FRAME.y1, pW, clamp(pW * 2) * harnessO);
      // c[2]: a message comes in and opens turn 1, the token runs a lap of your loop, the reply streams out and
      // the turn ends; the harness waits. c[3]: the second message runs turn 2 the same way. All of it fades out
      // at c[4], and the side columns stay free for the capability tiles of c[6]
      const out = 1 - P(t, c[4], 0.5);
      const b1 = c[2], b2 = c[3];
      const heads = P(t, b1 + 0.1, 0.5) * out;
      place(s.msgL, COL.left, COL.headY, 1, heads);
      place(s.replyL, COL.right, COL.headY, 1, heads);
      const p1 = P(t, b1 + BEAT.msg, 0.45, backOut);
      place(s.msg1, COL.left, msg1Y, p1, clamp(p1 * 2) * out);
      draw(s.in1, P(t, b1 + BEAT.arrow, 0.4), out);
      // the badge pops as the message enters the frame, then its status swells briefly at each change
      const pB = P(t, b1 + BEAT.run, 0.45, backOut);
      s.badge.style.transform = `scale(${pB})`;
      s.badge.style.opacity = clamp(P(t, b1 + BEAT.run, 0.45) * 2) * out;
      const turn2 = t >= b2 + BEAT.run;
      s.turnN.textContent = turn2 ? '2' : '1';
      const ended = t >= (turn2 ? b2 : b1) + BEAT.ended;
      setStatus(s.status, ended ? 'ENDED' : 'RUNNING', ended ? 'ok' : 'wait');
      const statusSwell = Math.max(...[b1 + BEAT.ended, b2 + BEAT.run, b2 + BEAT.ended].map(at => swell(t, at, 0.08)));
      s.status.style.transform = `scale(${statusSwell})`;
      // each reply streams out word by word once its lap is back on the model, the second under the first
      draw(s.out1, P(t, b1 + BEAT.reply, 0.3), out);
      const pR1 = P(t, b1 + BEAT.reply + 0.1, 0.45, backOut);
      place(s.reply1, COL.right, reply1Y, pR1, clamp(pR1 * 2) * out);
      typeWords(s.reply1, clamp((t - (b1 + BEAT.reply + 0.2)) / 1.4));
      draw(s.out2, P(t, b2 + BEAT.reply, 0.3), out);
      const pR2 = P(t, b2 + BEAT.reply + 0.1, 0.45, backOut);
      place(s.reply2, COL.right, reply2Y, pR2, clamp(pR2 * 2) * out);
      typeWords(s.reply2, clamp((t - (b2 + BEAT.reply + 0.2)) / 1.0));
      // the empty slot breathes while the harness waits (an ambient loop), then the second message takes its place
      const breathe = 0.8 + 0.2 * Math.cos((ambientTime(this) - b1 - BEAT.wait) * 4);
      const slotO = P(t, b1 + BEAT.wait, 0.4) * (1 - P(t, b2 + BEAT.msg, 0.3));
      place(s.slot, COL.left, msg2Y, 1, slotO * breathe * out);
      const p2 = P(t, b2 + BEAT.msg, 0.45, backOut);
      place(s.msg2, COL.left, msg2Y, p2, clamp(p2 * 2) * out);
      draw(s.in2, P(t, b2 + BEAT.arrow, 0.4), out);
      // c[4]: the LLM call row, then the turn row: each call pops after the link leading to it, then the reply.
      // c[5]: each call streams live as soon as it is saved, then the reply, and the bracket closes under the turn.
      // All of it fades out at c[6]
      const cmpO = 1 - P(t, c[6], 0.4);
      const b4 = c[4], b5 = c[5];
      const fadeIn = (e, at) => {
        const o = P(t, b4 + at, 0.4) * cmpO;
        e.style.opacity = o;
        e.style.visibility = o > 0.001 ? 'visible' : 'hidden';
      };
      fadeIn(s.callHead, CMP_AT.head1);
      showRow(s.callStrip, P(t, b4 + CMP_AT.strip, 0.5) * cmpO);
      fadeIn(s.turnHead, CMP_AT.head2);
      const pMsg = P(t, b4 + CMP_AT.msg, 0.45, backOut);
      place(s.turnMsg, CMP.left + CMP.cardW / 2, CMP.cardY, pMsg, clamp(pMsg * 2) * cmpO);
      // link k leads into call k and streams as soon as call k is saved; the last one, into the reply card,
      // streams once the last call is lit
      const streamAt = k => b5 + (k < TURN_CALLS.length ? savedAt(k) : SAVE_AT.reply);
      s.turnLinks.forEach((l, k) => {
        const at = k < TURN_CALLS.length ? CMP_AT.call0 + k * CMP_AT.callGap : CMP_AT.reply;
        draw(l, P(t, b4 + at - CMP_AT.link, CMP_AT.link), cmpO);
        draw(s.streamLinks[k], P(t, streamAt(k), SAVE_AT.seg, linear), cmpO);
      });
      s.calls.forEach((e, i) => {
        const p = P(t, b4 + CMP_AT.call0 + i * CMP_AT.callGap, 0.4, backOut);
        // the chip lights violet and swells as the stream reaches it
        const litAt = streamAt(i) + SAVE_AT.seg;
        place(e, CMP.xs[i], callY(i), p * swell(t, litAt, 0.08), clamp(p * 2) * cmpO);
        e.style.borderColor = t >= litAt ? C.violet : (isModelCall(i) ? C.uv : '');
        const pS = P(t, b5 + savedAt(i), 0.3, backOut);
        setStatus(s.saved[i], 'SAVED', 'ok');
        place(s.saved[i], CMP.xs[i], statusY(i), pS, clamp(pS * 2) * cmpO);
      });
      const pReply = P(t, b4 + CMP_AT.reply, 0.45, backOut);
      place(s.turnReply, CMP.right - CMP.cardW / 2, CMP.cardY, pReply, clamp(pReply * 2) * cmpO);
      // the bracket draws under the turn as the reply streams, then the pill pops on it
      draw(s.bracket, P(t, b5 + SAVE_AT.reply, SAVE_AT.streamed - SAVE_AT.reply, linear), cmpO);
      const pSt = P(t, b5 + SAVE_AT.streamed, 0.45, backOut);
      place(s.streamed, 960, CMP.bracketY, pSt, clamp(pSt * 2) * cmpO);
      // c[6]: each capability pops beside the frame as the subtitle names it, and plugs in with a short link
      CAPS.forEach(([, , side, row], i) => {
        const a = c[6] + 1.6 + i * 1.2;
        const p = P(t, a, 0.45, backOut);
        place(s.caps[i], capX(side), capY(row), p, clamp(p * 2));
        draw(s.links[i], P(t, a + 0.3, 0.3));
        const pp = P(t, a + 0.55, 0.3, backOut);
        place(s.plugs[i], frameX(side), capY(row), pp, clamp(pp * 2));
      });
    }
  });
}
