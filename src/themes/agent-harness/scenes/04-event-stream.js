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
  const SDKS = ['OpenAI Agents SDK', 'Google Gemini', 'Pydantic AI'];
  // Layout grid, final positions: the agents column on the left (x 140-500), the lane in the middle (x 600-1040),
  // the console on the right (x 1140-1780), 100 px apart. The agents column and the console share their top
  // (y 227) and bottom (y 817).
  const AGENT = { x: 320, y0: 302, gap: 220, w: 360, h: 150 }; // three equal tiles, 70 px apart
  const agentY = i => AGENT.y0 + i * AGENT.gap;
  const LANE = { x: 820, y: 522, w: 440, h: 76 };
  // where chips enter and leave the lane: the widest chip (APPROVAL, about 113 px) stays inside it
  LANE.entry = LANE.x - LANE.w / 2 + 70; LANE.exit = LANE.x + LANE.w / 2 - 62;
  // guide curve from agent i into the lane: chips ride it from MERGE_FROM on, emerging from under the tile.
  // The curves turn early enough that a chip rising from the lowest agent passes clear of the SAME EVENTS tag
  // (6 px for the widest chip).
  const guide = i => [[AGENT.x + AGENT.w / 2 + 8, agentY(i)], [540, agentY(i)], [490, LANE.y], [LANE.entry, LANE.y]];
  const MERGE_FROM = 0.1;
  // chip n leaves agent n % 3 every CHIP_EVERY seconds, until the scene ends; it curves into the lane, then runs
  // along it. A pool of CHIP_POOL elements is recycled: chip n uses element n % CHIP_POOL. The pool size is a
  // multiple of the 5 types and the 3 agents, so an element keeps its type and agent, and it outlasts a chip's
  // life (CHIP_POOL * CHIP_EVERY > CHIP_MERGE + CHIP_LANE), so an element is free again when it is reused.
  const CHIP_EVERY = 0.6, CHIP_MERGE = 0.7, CHIP_LANE = 1.4, CHIP_POOL = 15;
  const CONSOLE = { x: 1460, y: 522, w: 640, h: 590, row0: 88, rowGap: 62, rowH: 46 };
  const BAR_W = 540; // replay track, from the play icon to 32 px before the console's right edge
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
  // status tags of the HUMAN_ROW and TOTAL_ROW marks, as [label, statusTag kind]
  const MARK_TAGS = [['HUMAN', 'wait'], ['COST', 'reused']];
  const LAST_ROW = ROWS.length - 1;

  const chipCss = (type, fontSize) => ({
    ...EVENT_TYPES[type], fontSize, letterSpacing: '.1em', padding: '4px 10px 4px calc(10px + .1em)',
    border: '1.5px solid', borderRadius: '4px', whiteSpace: 'nowrap',
  });
  // Console row chip and tag text: a 22 px line makes them 32 px tall with their padding and border (the 1.5 px
  // border is drawn 1 px wide at this scale), an even height, so they center on whole pixels in their 46 px row
  const CONSOLE_LINE = 22, CONSOLE_TAG_H = 32;
  // the same chip, as inline HTML for the console rows (fixed width so the row texts line up)
  const chipHtml = type => {
    const css = EVENT_TYPES[type];
    return `<span class="mono" style="display:inline-block;width:132px;text-align:center;font-size:16px;`
      + `line-height:${CONSOLE_LINE}px;`
      + `letter-spacing:.1em;padding:4px 0 4px .1em;border:1.5px solid ${css.borderColor};border-radius:4px;`
      + `background:${css.background};color:${type === 'TOKENS' ? '#5B6475' : css.color}">${type}</span>`;
  };
  const linear = p => p;
  const cubic = (a, b, c, d, u) => {
    const v = 1 - u;
    return v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d;
  };

  scene({
    chapter: 4, title: 'One event stream',
    // the chapter header reads before the first subtitle; the final composition holds before the fade
    pre: 1.5, post: 2.0,
    // agents and lane first, centered; then the camera follows the stream to the console as it slides in,
    // and the final layout spans the grid (x 140-1780) with no offset
    shift: (t, c) => pan(t, [370, 0], [[c[1], 0, 0]], 0.9),
    subs: [
      {
        text: "Every agent publishes the same <b>event stream</b>: turns, model calls, tool calls, approvals and token usage.",
        after: 1.2,
      },
      {
        text: "Watch an agent live: each event shows up in the console as soon as it happens.",
        after: 1.8,
      },
      {
        text: "Or replay it afterward: exactly what it did, what it cost and where a human stepped in.",
        after: 0.8,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.lane = E(root, '', 'tile', { width: LANE.w + 'px', height: LANE.h + 'px', borderColor: C.uv });
      s.laneL = E(root,
        `<div style="display:flex;align-items:center;gap:12px">${ICON('stream', 26, C.ink, 1.8)}`
        + '<span>Agent event stream</span></div>', 'lbl', { color: 'var(--ink)' });
      // 18 px so the tag stays narrower than the lane, clear of the chips curving in from the lowest agent
      s.same = tag(root, 'Same events for every agent', 'uv');
      Object.assign(s.same.style, { fontSize: '18px', lineHeight: '24px' });
      s.chips = Array.from({ length: CHIP_POOL }, (_, k) => {
        const type = TYPE_ORDER[k % TYPE_ORDER.length];
        return E(root, type, 'mono', chipCss(type, '16px'));
      });
      // the agent tiles sit above the chips, so a chip slides out from under its tile
      s.agents = SDKS.map(sdk => E(root,
        `<div style="flex:none">${ICON('agent', 56, C.ink, 1.8)}</div><div style="margin-left:18px">`
        + '<div class="mono" style="font-size:16px;letter-spacing:.12em;color:var(--slate)">AGENT</div>'
        + `<div style="font-size:26px;margin-top:4px;white-space:nowrap">${sdk}</div></div>`,
        'tile', {
          width: AGENT.w + 'px', height: AGENT.h + 'px', display: 'flex', alignItems: 'center', padding: '0 24px',
          textAlign: 'left',
        }));
      s.guides = SDKS.map((_, i) => {
        const [p0, p1, p2, p3] = guide(i);
        return path(s.svg, `M ${p0} C ${p1} ${p2} ${p3}`, C.line, 2, false);
      });
      const laneEnd = LANE.x + LANE.w / 2 + 8, consoleStart = CONSOLE.x - CONSOLE.w / 2 - 8;
      s.feed = path(s.svg, `M ${laneEnd} ${LANE.y} L ${consoleStart} ${LANE.y}`, C.uv, 3, true);

      // console: a white card with mono event rows, a LIVE / REPLAY badge and a replay bar
      s.console = E(root,
        '<div class="mono" style="position:absolute;left:28px;top:26px;font-size:20px;letter-spacing:.14em;'
        + `display:flex;gap:12px;align-items:center">${ICON('eye', 24, '#141414', 1.8)} CONSOLE</div>`,
        'paper', { width: CONSOLE.w + 'px', height: CONSOLE.h + 'px' });
      const badgeCss = color => ({
        left: 'auto', right: '24px', top: '22px', display: 'flex', alignItems: 'center', gap: '8px',
        fontSize: '16px', letterSpacing: '.12em', padding: '4px 10px 4px calc(10px + .12em)', borderRadius: '4px',
        border: `1.5px solid ${color}`, color, transformOrigin: 'right center',
      });
      s.live = E(s.console,
        `<span class="dot" style="width:10px;height:10px;border-radius:50%;background:${C.red}"></span>LIVE`,
        'mono', { ...badgeCss(C.red), background: 'rgba(255,90,95,.1)' });
      s.live.dot = s.live.querySelector('.dot');
      s.replay = E(s.console, `${ICON('play', 14, C.uv, 2.4)}REPLAY`, 'mono',
        { ...badgeCss(C.uv), background: 'rgba(68,76,231,.1)' });
      s.marks = [HUMAN_ROW, TOTAL_ROW].map(i => E(s.console, '', '', {
        left: '14px', top: (CONSOLE.row0 - 4 + i * CONSOLE.rowGap) + 'px', width: (CONSOLE.w - 28) + 'px',
        height: (CONSOLE.rowH + 8) + 'px', borderRadius: 'var(--rs)',
        background: i === HUMAN_ROW ? 'rgba(182,100,255,.16)' : 'rgba(68,76,231,.12)',
        borderLeft: `4px solid ${i === HUMAN_ROW ? C.violet : C.uv}`,
      }));
      s.scan = E(s.console, '', '', {
        left: '14px', width: (CONSOLE.w - 28) + 'px', height: (CONSOLE.rowH + 8) + 'px',
        background: 'rgba(68,76,231,.2)', borderRadius: 'var(--rs)',
      });
      s.rows = ROWS.map(([type, text], i) => E(s.console,
        `${chipHtml(type)}<span style="margin-left:20px;${i === TOTAL_ROW ? 'font-weight:700' : ''}">${text}</span>`,
        'mono', {
          left: '28px', top: (CONSOLE.row0 + i * CONSOLE.rowGap) + 'px', fontSize: '22px', whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'center', height: CONSOLE.rowH + 'px',
        }));
      s.tags = [HUMAN_ROW, TOTAL_ROW].map(i => {
        const e = statusTag(s.console);
        // centered on its row
        Object.assign(e.style, {
          left: 'auto', right: '28px',
          top: (CONSOLE.row0 + (CONSOLE.rowH - CONSOLE_TAG_H) / 2 + i * CONSOLE.rowGap) + 'px',
          fontSize: '16px', lineHeight: CONSOLE_LINE + 'px', transformOrigin: 'right center',
        });
        return e;
      });
      // replay bar: play icon, track, filled part up to the playhead, playhead
      s.bar = E(s.console,
        `${ICON('play', 24, C.uv, 2.2)}<div class="track" style="position:relative;margin-left:16px;width:${BAR_W}px;`
        + 'height:6px;border-radius:3px;background:#D5DAE3"><div class="fill" style="position:absolute;left:0;top:0;'
        + `height:6px;border-radius:3px;background:${C.uv}"></div><div class="head" style="position:absolute;top:-8px;`
        + `width:12px;height:22px;margin-left:-6px;border-radius:3px;background:${C.uv}"></div></div>`,
        '', {
          left: '28px', top: (CONSOLE.row0 + LAST_ROW * CONSOLE.rowGap + CONSOLE.rowH + 30) + 'px', display: 'flex',
          alignItems: 'center',
        });
      s.bar.fill = s.bar.querySelector('.fill'); s.bar.head = s.bar.querySelector('.head');
    },
    update(t, c, s) {
      // stream: the agents appear one by one, then the lane, then chips leave the agents in turn and merge into it.
      // The flow is an endless loop: it starts at chipsFrom on the story clock t, but its chips move on the ambient
      // clock g. In the live player g may run ahead of t, so the flow can start mid-way: it fades in just before
      // chipsFrom, when no chip shows yet in frozen frames (there g equals t)
      const chipsFrom = c[0] + 3.0;
      const g = ambientTime(this);
      const flowIn = P(t, chipsFrom - 0.3, 0.3, linear);
      s.agents.forEach((e, i) => {
        const p = P(t, c[0] + 0.1 + i * 0.4, 0.5, backOut);
        place(e, AGENT.x, agentY(i), p, clamp(p * 2));
        // the tile lights up as it emits a chip
        const sinceLast = (g - chipsFrom - i * CHIP_EVERY) % (3 * CHIP_EVERY);
        const emitting = t >= chipsFrom && g >= chipsFrom + i * CHIP_EVERY && sinceLast < 0.25;
        e.style.borderColor = emitting ? C.uv : C.line;
      });
      s.guides.forEach((line, i) => draw(line, P(t, c[0] + 1.8 + i * 0.1, 0.6)));
      place(s.lane, LANE.x, LANE.y, 1, P(t, c[0] + 1.9, 0.5));
      place(s.laneL, LANE.x, LANE.y - LANE.h / 2 - 34, 1, P(t, c[0] + 2.0, 0.5));
      const sp = P(t, c[0] + 5.0, 0.45, backOut);
      place(s.same, LANE.x, LANE.y + LANE.h / 2 + 46, sp, clamp(sp * 2));
      s.chips.forEach((e, k) => {
        // the latest chip this element carries: k, k + CHIP_POOL, k + 2 * CHIP_POOL...
        const cycle = Math.max(0, Math.floor((g - chipsFrom - k * CHIP_EVERY) / (CHIP_POOL * CHIP_EVERY)));
        const leave = chipsFrom + (k + cycle * CHIP_POOL) * CHIP_EVERY;
        let x, y;
        if (g < leave + CHIP_MERGE) {
          const u = lerp(MERGE_FROM, 1, clamp((g - leave) / CHIP_MERGE));
          const [p0, p1, p2, p3] = guide(k % 3);
          x = cubic(p0[0], p1[0], p2[0], p3[0], u);
          y = cubic(p0[1], p1[1], p2[1], p3[1], u);
        } else {
          x = lerp(LANE.entry, LANE.exit, clamp((g - leave - CHIP_MERGE) / CHIP_LANE));
          y = LANE.y;
        }
        const end = leave + CHIP_MERGE + CHIP_LANE;
        const o = g < leave ? 0 : P(g, leave, 0.12, linear) * (1 - P(g, end - 0.25, 0.25, linear));
        place(e, x, y, 1, o * flowIn);
      });

      // console: rows arrive live one by one; then it switches to replay, rewinds, and sweeps them again
      const rowAt = i => c[1] + 1.6 + i * 0.6;
      const toReplay = c[2] + 0.3, rewind = c[2] + 1.6, sweep = c[2] + 2.9, sweepD = 3.3;
      const cp = P(t, c[1] + 0.3, 0.6);
      place(s.console, lerp(CONSOLE.x + 120, CONSOLE.x, cp), CONSOLE.y, 1, cp);
      draw(s.feed, P(t, c[1] + 0.9, 0.5));
      s.live.style.opacity = P(t, c[1] + 1.0, 0.3) * (t < toReplay ? 1 : 0);
      s.live.dot.style.opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.cos(G * 6));
      s.replay.style.opacity = t < toReplay ? 0 : 1;
      s.replay.style.transform = `scale(${swell(t, toReplay, 0.15)})`;
      s.bar.style.opacity = P(t, toReplay, 0.3);
      // playhead: at the end when the replay starts, rewound to the start, then swept forward
      let head = 1 - P(t, rewind, 0.8);
      if (t >= sweep) head = clamp((t - sweep) / sweepD);
      s.bar.fill.style.width = (head * BAR_W) + 'px';
      s.bar.head.style.left = (head * BAR_W) + 'px';
      s.rows.forEach((r, i) => {
        const p = P(t, rowAt(i), 0.3);
        showRow(r, p);
        // a row dims while the playhead is before it
        const reached = clamp(1 + (head - i / LAST_ROW) * 12);
        r.style.opacity = p * lerp(0.3, 1, reached);
      });
      const scanning = win(t, sweep, sweep + sweepD + 0.3, 0.2);
      s.scan.style.opacity = scanning;
      s.scan.style.top = (CONSOLE.row0 - 4 + head * LAST_ROW * CONSOLE.rowGap) + 'px';
      // where a human stepped in and what it cost stay marked once the sweep reaches them
      [HUMAN_ROW, TOTAL_ROW].forEach((row, j) => {
        const at = sweep + sweepD * row / LAST_ROW;
        s.marks[j].style.opacity = P(t, at, 0.3);
        const [label, kind] = MARK_TAGS[j];
        setStatus(s.tags[j], label, kind);
        s.tags[j].style.opacity = P(t, at, 0.25);
        s.tags[j].style.transform = `scale(${swell(t, at, 0.14)})`;
      });
    }
  });
}
