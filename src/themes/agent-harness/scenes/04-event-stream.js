// ===================== 4. ONE EVENT STREAM
// The block keeps every name declared in this file local to this scene.
{
  // one color per event type, the same on the dark stage and on the white console
  const EVENT_TYPES = {
    TURN: { background: C.slate, color: '#141414', borderColor: C.slate },
    MODEL: { background: C.uv, color: '#FFFFFF', borderColor: C.uv },
    TOOL: { background: C.ink, color: '#141414', borderColor: '#5B6475' },
    APPROVAL: { background: C.violet, color: '#141414', borderColor: C.violet },
    TOKENS: { background: 'transparent', color: C.slate, borderColor: C.slate },
  };
  const TYPE_ORDER = ['TURN', 'MODEL', 'TOOL', 'APPROVAL', 'TOKENS'];
  const SDKS = ['OpenAI Agents SDK', 'Google Gen AI SDK', 'Pydantic AI'];
  const AGENT = { x: 278, y0: 382, gap: 140, w: 364 }; // agent tiles, stacked on the left
  const agentY = i => AGENT.y0 + i * AGENT.gap;
  const LANE = { x: 870, y: 522, w: 580, entry: 650, exit: 1100 }; // the stream lane and where chips enter and leave it
  // guide curve from agent i into the lane: chips ride it from MERGE_FROM on, so they leave clear of the tile
  const guide = i => [[AGENT.x + AGENT.w / 2 + 8, agentY(i)], [570, agentY(i)], [540, LANE.y], [LANE.entry, LANE.y]];
  const MERGE_FROM = 0.25;
  // chip k leaves agent k % 3 every CHIP_EVERY seconds; it curves into the lane, then runs along it
  const CHIP_EVERY = 0.4, CHIP_MERGE = 0.45, CHIP_LANE = 1.4, CHIP_COUNT = 36;
  const CONSOLE = { x: 1525, y: 522, w: 620, h: 470, row0: 76, rowGap: 46 };
  const ROWS = [
    ['TURN', 'turn started'],
    ['MODEL', 'model call · 812 tokens'],
    ['TOOL', 'tool search_flights'],
    ['APPROVAL', 'book_flight: needs approval'],
    ['APPROVAL', 'approved by a human'],
    ['TOOL', 'tool book_flight · done'],
    ['TOKENS', 'turn ended · 2,140 tokens'],
  ];
  const HUMAN_ROW = 4, TOTAL_ROW = 6;
  const LAST_ROW = ROWS.length - 1;

  const chipCss = (type, fontSize) => ({
    ...EVENT_TYPES[type], fontSize, letterSpacing: '.1em', padding: '4px 10px 4px calc(10px + .1em)',
    border: '1.5px solid', borderRadius: '4px', whiteSpace: 'nowrap',
  });
  // the same chip, as inline HTML for the console rows (fixed width so the row texts line up)
  const chipHtml = type => {
    const css = EVENT_TYPES[type];
    return `<span class="mono" style="display:inline-block;width:118px;text-align:center;font-size:14px;`
      + `letter-spacing:.1em;padding:3px 0 3px .1em;border:1.5px solid ${css.borderColor};border-radius:4px;`
      + `background:${css.background};color:${type === 'TOKENS' ? '#5B6475' : css.color}">${type}</span>`;
  };
  const linear = p => p;
  const cubic = (a, b, c, d, u) => {
    const v = 1 - u;
    return v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d;
  };

  scene({
    chapter: 4, title: 'One event stream',
    // agents and lane first, then the camera follows the stream to the console as it slides in
    shift: (t, c) => pan(t, [332, 0], [[c[1], -6, 0]], 0.9),
    subs: [
      {
        text: "Every agent publishes the same event stream: turns, model calls, tool calls, approvals and token usage.",
        after: 0.6,
      },
      {
        text: "Watch an agent live, or replay exactly what it did, what it cost and where a human stepped in.",
        after: 0.6,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.agents = SDKS.map(sdk => E(root,
        `<div style="flex:none">${ICON('agent', 52, C.ink, 1.8)}</div><div style="margin-left:18px">`
        + '<div class="mono" style="font-size:15px;letter-spacing:.12em;color:var(--slate)">AGENT</div>'
        + `<div style="font-size:26px;margin-top:2px;white-space:nowrap">${sdk}</div></div>`,
        'tile', {
          width: AGENT.w + 'px', height: '104px', display: 'flex', alignItems: 'center', padding: '0 24px',
          textAlign: 'left',
        }));
      s.lane = E(root, '', 'tile', { width: LANE.w + 'px', height: '70px', borderColor: C.uv });
      s.laneL = E(root,
        `<div style="display:flex;align-items:center;gap:12px">${ICON('stream', 26, C.ink, 1.8)}`
        + '<span>Agent event stream</span></div>', 'lbl', { color: 'var(--ink)' });
      s.same = tag(root, 'Same events for every agent', 'uv');
      s.chips = Array.from({ length: CHIP_COUNT }, (_, k) => {
        const type = TYPE_ORDER[k % TYPE_ORDER.length];
        return E(root, type, 'mono', chipCss(type, '16px'));
      });
      s.guides = SDKS.map((_, i) => {
        const [p0, p1, p2, p3] = guide(i);
        return path(s.svg, `M ${p0} C ${p1} ${p2} ${p3}`, C.line, 2, false);
      });
      const laneEnd = LANE.x + LANE.w / 2 + 8, consoleStart = CONSOLE.x - CONSOLE.w / 2 - 8;
      s.feed = path(s.svg, `M ${laneEnd} ${LANE.y} L ${consoleStart} ${LANE.y}`, C.uv, 3);

      // console: a white card with mono event rows, a LIVE / REPLAY badge and a replay bar
      s.console = E(root,
        '<div class="mono" style="position:absolute;left:26px;top:22px;font-size:18px;letter-spacing:.14em;'
        + `display:flex;gap:10px;align-items:center">${ICON('eye', 22, '#141414', 1.8)} CONSOLE</div>`,
        '', {
          width: CONSOLE.w + 'px', height: CONSOLE.h + 'px', background: '#F8FAFC', color: '#141414',
          borderRadius: 'var(--r)',
        });
      const badgeCss = color => ({
        left: 'auto', right: '22px', top: '18px', transform: 'none', display: 'flex', alignItems: 'center', gap: '8px',
        fontSize: '15px', letterSpacing: '.12em', padding: '4px 10px 4px calc(10px + .12em)', borderRadius: '4px',
        border: `1.5px solid ${color}`, color, transformOrigin: 'right center',
      });
      s.live = E(s.console,
        `<span class="dot" style="width:10px;height:10px;border-radius:50%;background:${C.red}"></span>LIVE`,
        'mono', { ...badgeCss(C.red), background: 'rgba(255,90,95,.1)' });
      s.live.dot = s.live.querySelector('.dot');
      s.replay = E(s.console, `${ICON('play', 14, C.uv, 2.4)}REPLAY`, 'mono',
        { ...badgeCss(C.uv), background: 'rgba(68,76,231,.1)' });
      s.marks = [HUMAN_ROW, TOTAL_ROW].map(i => E(s.console, '', '', {
        left: '14px', top: (CONSOLE.row0 - 2 + i * CONSOLE.rowGap) + 'px', width: (CONSOLE.w - 28) + 'px',
        height: '42px', borderRadius: 'var(--rs)', transform: 'none',
        background: i === HUMAN_ROW ? 'rgba(182,100,255,.16)' : 'rgba(68,76,231,.12)',
        borderLeft: `4px solid ${i === HUMAN_ROW ? C.violet : C.uv}`,
      }));
      s.scan = E(s.console, '', '', {
        left: '14px', width: (CONSOLE.w - 28) + 'px', height: '42px', background: 'rgba(68,76,231,.2)',
        borderRadius: 'var(--rs)', transform: 'none',
      });
      s.rows = ROWS.map(([type, text], i) => E(s.console,
        `${chipHtml(type)}<span style="margin-left:18px;${i === TOTAL_ROW ? 'font-weight:700' : ''}">${text}</span>`,
        'mono', {
          left: '26px', top: (CONSOLE.row0 + i * CONSOLE.rowGap) + 'px', fontSize: '20px', whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'center', height: '38px', transform: 'none',
        }));
      s.tags = [HUMAN_ROW, TOTAL_ROW].map(i => {
        const e = statusTag(s.console);
        Object.assign(e.style, {
          left: 'auto', right: '28px', top: (CONSOLE.row0 + 5 + i * CONSOLE.rowGap) + 'px',
          transformOrigin: 'right center',
        });
        return e;
      });
      setStatus(s.tags[0], 'HUMAN', 'wait');
      setStatus(s.tags[1], 'COST', 'reused');
      // replay bar: play icon, track, filled part up to the playhead, playhead
      s.bar = E(s.console,
        `${ICON('play', 22, C.uv, 2.2)}<div class="track" style="position:relative;margin-left:16px;width:500px;`
        + 'height:6px;border-radius:3px;background:#D5DAE3"><div class="fill" style="position:absolute;left:0;top:0;'
        + `height:6px;border-radius:3px;background:${C.uv}"></div><div class="head" style="position:absolute;top:-8px;`
        + `width:12px;height:22px;margin-left:-6px;border-radius:3px;background:${C.uv}"></div></div>`,
        '', { left: '28px', top: '414px', display: 'flex', alignItems: 'center', transform: 'none' });
      s.bar.fill = s.bar.querySelector('.fill'); s.bar.head = s.bar.querySelector('.head');
    },
    update(t, c, s) {
      // stream: chips leave the agents in turn and merge into the lane
      const chipsFrom = c[0] + 1.3;
      s.agents.forEach((e, i) => {
        const p = P(t, c[0] + 0.1 + i * 0.15, 0.5, backOut);
        place(e, AGENT.x, agentY(i), p, clamp(p * 2));
        // the tile lights up as it emits a chip
        const sinceLast = (t - chipsFrom - i * CHIP_EVERY) % (3 * CHIP_EVERY);
        const emitting = t >= chipsFrom + i * CHIP_EVERY && sinceLast < 0.18;
        e.style.borderColor = emitting ? C.uv : C.line;
      });
      s.guides.forEach((g, i) => draw(g, P(t, c[0] + 0.6 + i * 0.1, 0.5)));
      place(s.lane, LANE.x, LANE.y, 1, P(t, c[0] + 0.7, 0.5));
      place(s.laneL, LANE.x, LANE.y - 67, 1, P(t, c[0] + 0.8, 0.5));
      const sp = P(t, c[0] + 3.6, 0.45, backOut);
      place(s.same, LANE.x, LANE.y + 78, sp, clamp(sp * 2));
      s.chips.forEach((e, k) => {
        const leave = chipsFrom + k * CHIP_EVERY;
        let x, y;
        if (t < leave + CHIP_MERGE) {
          const u = lerp(MERGE_FROM, 1, clamp((t - leave) / CHIP_MERGE));
          const [p0, p1, p2, p3] = guide(k % 3);
          x = cubic(p0[0], p1[0], p2[0], p3[0], u);
          y = cubic(p0[1], p1[1], p2[1], p3[1], u);
        } else {
          x = lerp(LANE.entry, LANE.exit, clamp((t - leave - CHIP_MERGE) / CHIP_LANE));
          y = LANE.y;
        }
        const end = leave + CHIP_MERGE + CHIP_LANE;
        const o = t < leave ? 0 : P(t, leave, 0.12, linear) * (1 - P(t, end - 0.25, 0.25, linear));
        place(e, x, y, 1, o);
      });

      // console: rows arrive live, then the replay rewinds and sweeps them again
      const rowAt = i => c[1] + 0.8 + i * 0.32;
      const toReplay = c[1] + 3.0, rewind = c[1] + 3.2, sweep = c[1] + 3.8, sweepD = 1.8;
      const cp = P(t, c[1] + 0.3, 0.6);
      place(s.console, lerp(CONSOLE.x + 120, CONSOLE.x, cp), CONSOLE.y, 1, cp);
      draw(s.feed, P(t, c[1] + 0.7, 0.4));
      const pulse = 1 + 0.15 * Math.max(0, 1 - Math.abs(t - toReplay - 0.1) / 0.25);
      s.live.style.opacity = P(t, c[1] + 0.6, 0.3) * (t < toReplay ? 1 : 0);
      s.live.dot.style.opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.cos(G * 6));
      s.replay.style.opacity = t < toReplay ? 0 : 1;
      s.replay.style.transform = `scale(${pulse})`;
      s.bar.style.opacity = P(t, toReplay, 0.3);
      // playhead: at the end when the replay starts, rewound to the start, then swept forward
      let head = 1 - P(t, rewind, 0.4);
      if (t >= sweep) head = clamp((t - sweep) / sweepD);
      s.bar.fill.style.width = (head * 500) + 'px';
      s.bar.head.style.left = (head * 500) + 'px';
      s.rows.forEach((r, i) => {
        const p = P(t, rowAt(i), 0.3);
        // a row dims while the playhead is before it
        const reached = clamp(1 + (head - i / LAST_ROW) * 12);
        r.style.opacity = p * lerp(0.3, 1, reached);
        r.style.transform = `translateX(${(1 - p) * 26}px)`;
      });
      const scanning = win(t, sweep, sweep + sweepD + 0.3, 0.2);
      s.scan.style.opacity = scanning;
      s.scan.style.top = (CONSOLE.row0 - 2 + head * LAST_ROW * CONSOLE.rowGap) + 'px';
      // where a human stepped in and what it cost stay marked once the sweep reaches them
      [HUMAN_ROW, TOTAL_ROW].forEach((row, j) => {
        const at = sweep + sweepD * row / LAST_ROW;
        s.marks[j].style.opacity = P(t, at, 0.3);
        s.tags[j].style.opacity = P(t, at, 0.25);
        s.tags[j].style.transform = `scale(${1 + 0.14 * Math.max(0, 1 - Math.abs(t - at - 0.1) / 0.25)})`;
      });
    }
  });
}
