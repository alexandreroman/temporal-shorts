// ===================== 6. CODE MODE
// The block keeps every name declared in this file local to this scene.
{
  // Left: one tool call per model round trip. The model orb and its tools, then the round-trip counter.
  const LEFT = { x: 430, labelY: 175, orbX: 250, orbY: 470, toolX: 620, toolY: [330, 470, 610], counterY: 820 };
  const ORB_EDGE = LEFT.orbX + 68, TOOL_EDGE = LEFT.toolX - 92; // where the connectors start and end
  // the 6 round trips (tool index of each call) and their timing, from c[0] + TRIPS.at
  const TRIPS = { at: 0.8, gap: 0.5, out: 0.22, targets: [0, 1, 0, 1, 0, 2] };
  // Right: the script card, the tools it calls, their SAVED statuses and the closing tags
  const CODE = { x: 1310, y: 370, w: 820, h: 320, lineTop: 74, lineH: 38, textX: 28 };
  const RIGHT = { toolX: [1060, 1310, 1560], toolY: 745, gateY: 600, savedY: 835, tagY: 900 };
  const CARD_BOTTOM = CODE.y + CODE.h / 2 + 4;
  const ONE_TRIP_X = LEFT.x + 317; // the 1 ROUND TRIP pill, right of the counter and its "vs"
  // the run highlight: the gather block (lines 1-4), then the min line, then the book_flight line
  const HIGHLIGHT = [{ at: 0.6, from: 0, to: 3 }, { at: 2.4, from: 4, to: 4 }, { at: 3.4, from: 5, to: 5 }];
  const HIGHLIGHT_END = 5.5;

  // Script tokens with simple syntax colors: keywords violet, tool names light UV, the rest ink or slate
  const kw = s => [s, C.violet], tool = s => [s, '#A5ABFF'], str = s => [s, C.ink];
  const id = s => [s, C.ink], pun = s => [s, C.slate];
  const SCRIPT = [
    [
      id('flights'), pun(', '), id('hotels'), pun(' = '), kw('await'), pun(' '), id('asyncio'), pun('.'),
      id('gather'), pun('('),
    ],
    [pun('    '), tool('search_flights'), pun('('), id('to'), pun('='), str('"LIS"'), pun('),')],
    [pun('    '), tool('search_hotels'), pun('('), id('city'), pun('='), str('"Lisbon"'), pun('),')],
    [pun(')')],
    [
      id('best'), pun(' = '), id('min'), pun('('), id('flights'), pun(', '), id('key'), pun('='), kw('lambda'),
      pun(' '), id('f'), pun(': '), id('f'), pun('.'), id('price'), pun(')'),
    ],
    [kw('await'), pun(' '), tool('book_flight'), pun('('), id('best'), pun(')')],
  ];
  const lineLength = line => line.reduce((n, [s]) => n + s.length, 0);
  const TOTAL_CHARS = SCRIPT.reduce((n, line) => n + lineLength(line), 0);

  // HTML of the first `count` characters of a script line, colors kept
  const lineHtml = (line, count) => {
    let html = '', left = count;
    for (const [text, color] of line) {
      if (left <= 0) break;
      html += `<span style="color:${color}">${text.slice(0, left)}</span>`;
      left -= text.length;
    }
    return html;
  };
  // number of characters shown on each script line once `n` characters of the script are typed
  const typedPerLine = n => SCRIPT.map(line => {
    const shown = clamp(n, 0, lineLength(line));
    n -= lineLength(line);
    return shown;
  });
  const lineY = i => CODE.lineTop + i * CODE.lineH;
  // center of the best: $480 pill, on line 5 (the min line) about 20 px right of its end, inside the card
  const BEST_X = CODE.w - 100;
  const CHAR_W = 13.2; // advance of a 22 px JetBrains Mono character

  // step tile whose label is a tool name in code font (iconTile uppercases its labels)
  const makeToolStep = (p, icon, name) => {
    const e = makeStep(p, icon, name, 230, 120);
    Object.assign(e.querySelector('.mono').style, { textTransform: 'none', letterSpacing: '.02em', paddingLeft: '0' });
    return e;
  };
  // UV pill with an icon before its text, as inline HTML for the closing row
  const iconPillHtml = (icon, text) => '<span class="pill uv" style="display:flex;align-items:center;gap:10px">'
    + `${ICON(icon, 22, C.ink, 2)}${text}</span>`;

  scene({
    chapter: 6, title: 'Code Mode',
    // the run phase adds the statuses and tags at the bottom: one compromise offset fits both phases
    shift: [8, -14],
    subs: [
      {
        text: "With Code Mode, the model writes a short Python script instead of calling tools one at a time.",
        after: 0.6,
      },
      {
        text: "Loops, conditions and parallel calls in one turn, and every call stays durable, approved and visible.",
        after: 0.6,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);

      // left: the model calls its tools one at a time
      s.lblL = E(root, 'One call at a time', 'lbl');
      s.links = LEFT.toolY.map(y => path(s.svg, `M ${ORB_EDGE} ${LEFT.orbY} L ${TOOL_EDGE} ${y}`, C.line, 2, false));
      s.llm = makeLLM(root, 130, 'MODEL');
      s.tools = [['plane', 'Flights'], ['bed', 'Hotels'], ['ticket', 'Booking']]
        .map(([icon, label]) => iconTile(root, icon, label, 180, 104));
      s.trip = E(root, '', 'pill', { fontSize: '16px', padding: '5px 12px 5px calc(12px + .1em)' });
      s.counter = makeCounter(root, 'Round trips', 260);
      s.vs = E(root, 'vs', 'lbl', { fontSize: '22px' });
      // a little smaller than .pill.big, so it fits between the counter and the tools
      s.oneTrip = tag(root, '1 round trip', 'uv');
      Object.assign(s.oneTrip.style, { fontSize: '26px', padding: '11px 22px 11px calc(22px + .1em)' });

      // right: the script written by the model, typed line by line
      s.lblR = E(root, 'Code Mode', 'lbl');
      s.code = E(root,
        '<div class="lbl" style="position:absolute;left:24px;top:20px;font-size:16px;padding-left:0;'
        + `display:flex;align-items:center;gap:10px">${ICON('code', 20, C.slate, 2)}Script written by the model</div>`
        + `<div style="position:absolute;left:0;right:0;top:56px;border-top:1.5px solid ${C.line}"></div>`,
        'tile', { width: CODE.w + 'px', height: CODE.h + 'px', textAlign: 'left' });
      // the run highlight sits behind the code lines
      s.hl = E(s.code, '', '', {
        left: '12px', width: (CODE.w - 24) + 'px', background: 'rgba(182,100,255,.16)',
        borderLeft: '3px solid ' + C.violet, borderRadius: 'var(--rs)', transform: 'none',
      });
      s.lines = SCRIPT.map((_, i) => {
        const e = E(s.code,
          `<span style="display:inline-block;width:40px;color:${C.line}">${i + 1}</span><span class="src"></span>`,
          'mono', {
            left: CODE.textX + 'px', top: (lineY(i) - CODE.lineH / 2) + 'px', height: CODE.lineH + 'px',
            lineHeight: CODE.lineH + 'px', fontSize: '22px', whiteSpace: 'pre', transform: 'none',
          });
        e.src = e.querySelector('.src');
        return e;
      });
      s.cursor = E(s.code, '', '', { width: '12px', height: '26px', background: C.violet, borderRadius: '2px' });
      s.best = E(s.code, 'best: <span style="color:var(--ink)">$480</span>', 'pill violet', {
        textTransform: 'none', letterSpacing: '.02em', fontSize: '20px', padding: '5px 14px', color: C.violet,
      });

      // right: the calls made by the script, fanning out from the card
      s.fanFlights = path(s.svg, `M ${CODE.x} ${CARD_BOTTOM} C ${CODE.x} 610, ${RIGHT.toolX[0]} 600, `
        + `${RIGHT.toolX[0]} 680`, C.uv, 3);
      s.fanHotels = path(s.svg, `M ${CODE.x} ${CARD_BOTTOM} L ${CODE.x} 680`, C.uv, 3);
      s.toGate = path(s.svg, `M ${CODE.x} ${CARD_BOTTOM} C ${CODE.x} 580, ${RIGHT.toolX[2]} 560, `
        + `${RIGHT.toolX[2]} ${RIGHT.gateY - 30}`, C.uv, 3);
      s.fromGate = path(s.svg, `M ${RIGHT.toolX[2]} ${RIGHT.gateY + 24} L ${RIGHT.toolX[2]} 680`, C.uv, 3);
      s.steps = [['plane', 'search_flights'], ['bed', 'search_hotels'], ['ticket', 'book_flight']]
        .map(([icon, name]) => makeToolStep(root, icon, name));
      s.gate = E(root, '', 'pill');
      s.saved = s.steps.map(() => statusTag(root));
      // what every call keeps: one row, centered under the tools but not aligned with their columns
      s.tagRow = E(root,
        '<span class="lbl" style="font-size:18px">Every call</span>'
        + iconPillHtml('retry', 'Durable') + iconPillHtml('shield', 'Approved') + iconPillHtml('eye', 'Visible'),
        '', { display: 'flex', alignItems: 'center', gap: '20px' });
      s.tags = [...s.tagRow.querySelectorAll('.pill')];
    },
    update(t, c, s) {
      // ---- c[0], left: six quick round trips, then the whole side dims
      const dim = lerp(1, 0.35, P(t, c[0] + 4.3, 0.5));
      const leftIn = at => P(t, c[0] + at, 0.5, backOut);
      place(s.lblL, LEFT.x, LEFT.labelY, 1, P(t, c[0] + 0.1, 0.4) * dim);
      s.links.forEach((l, i) => draw(l, P(t, c[0] + 0.5 + i * 0.1, 0.4), dim));
      const orbIn = leftIn(0.1);
      place(s.llm.root, LEFT.orbX, LEFT.orbY, orbIn, clamp(orbIn * 2) * dim);
      s.tools.forEach((e, i) => {
        const p = leftIn(0.3 + i * 0.1);
        place(e, LEFT.toolX, LEFT.toolY[i], p, clamp(p * 2) * dim);
      });

      // the call card goes out to a tool and comes back as a result, one tool at a time
      const starts = TRIPS.targets.map((_, i) => c[0] + TRIPS.at + i * TRIPS.gap);
      const returned = starts.map(a => a + 2 * TRIPS.out + 0.03);
      const trip = starts.findLastIndex(a => t >= a);
      let busyTool = -1;
      if (trip >= 0 && t < returned[trip] + 0.05) {
        const a = starts[trip], target = TRIPS.targets[trip];
        const goingOut = t < a + TRIPS.out;
        const u = goingOut
          ? lerp(0.3, 0.75, P(t, a, TRIPS.out))
          : lerp(0.75, 0.3, P(t, a + TRIPS.out + 0.03, TRIPS.out));
        const x = lerp(ORB_EDGE, TOOL_EDGE, u), y = lerp(LEFT.orbY, LEFT.toolY[target], u);
        if (s.trip._out !== goingOut) {
          s.trip._out = goingOut;
          s.trip.textContent = goingOut ? 'call' : 'result';
          s.trip.className = 'abs pill ' + (goingOut ? 'uv' : '');
          // opaque, so the connector does not show through the card traveling on it
          s.trip.style.background = goingOut ? OPAQUE.uv : 'var(--surface)';
        }
        place(s.trip, x, y, 1, 1);
        if (Math.abs(t - a - TRIPS.out) < 0.12) busyTool = target;
      } else place(s.trip, 0, 0, 1, 0);
      s.tools.forEach((e, i) => { e.style.borderColor = i === busyTool ? C.violet : C.line; });
      llmState(s.llm, { look: 0.8 });

      const trips = returned.filter(r => t >= r).length;
      setCounter(s.counter, trips);
      const counterIn = leftIn(0.6);
      place(s.counter, LEFT.x - 30, LEFT.counterY, counterIn, clamp(counterIn * 2) * dim);

      // ---- c[0], right: the model writes the script instead
      const codeIn = P(t, c[0] + 2.3, 0.5, backOut);
      place(s.lblR, CODE.x, LEFT.labelY, 1, P(t, c[0] + 2.3, 0.4));
      place(s.code, CODE.x, CODE.y, codeIn, clamp(codeIn * 2));
      const typeStart = c[0] + 2.8, typeEnd = c[0] + 6.0;
      const shownPerLine = typedPerLine(Math.floor(TOTAL_CHARS * clamp((t - typeStart) / (typeEnd - typeStart))));
      shownPerLine.forEach((shown, i) => {
        const e = s.lines[i];
        if (e._n !== shown) { e._n = shown; e.src.innerHTML = lineHtml(SCRIPT[i], shown); }
        e.style.opacity = shown > 0 ? 1 : 0;
      });
      // the cursor sits after the last typed character
      const cursorLine = Math.max(0, shownPerLine.findLastIndex(n => n > 0));
      const cursorCol = shownPerLine[cursorLine];
      // blinking cursor while typing, gone once the script runs
      const blink = Math.floor(G * 3) % 2 === 0 ? 1 : 0.35;
      const cursorOn = t >= typeStart && t < c[1] + 0.3 ? 1 : 0;
      const cursorX = CODE.textX + 40 + cursorCol * CHAR_W + 6;
      place(s.cursor, cursorX, lineY(cursorLine), 1, cursorOn * (t < typeEnd ? 1 : blink));

      // ---- c[1]: the script runs, its line highlight slides down from block to block (see HIGHLIGHT)
      let top = lineY(HIGHLIGHT[0].from), bottom = lineY(HIGHLIGHT[0].to);
      for (const h of HIGHLIGHT.slice(1)) {
        const p = P(t, c[1] + h.at, 0.3);
        top = lerp(top, lineY(h.from), p);
        bottom = lerp(bottom, lineY(h.to), p);
      }
      s.hl.style.top = (top - CODE.lineH / 2 + 1) + 'px';
      s.hl.style.height = (bottom - top + CODE.lineH - 2) + 'px';
      s.hl.style.opacity = win(t, c[1] + HIGHLIGHT[0].at, c[1] + HIGHLIGHT_END, 0.25);

      // the tools the script calls
      s.steps.forEach((e, i) => {
        const p = P(t, c[1] + 0.1 + i * 0.1, 0.45, backOut);
        place(e, RIGHT.toolX[i], RIGHT.toolY, p, clamp(p * 2));
      });
      // both searches start at the same time
      draw(s.fanFlights, P(t, c[1] + 0.8, 0.4));
      draw(s.fanHotels, P(t, c[1] + 0.8, 0.4));
      const searchState = t >= c[1] + 2.0 ? 2 : t >= c[1] + 1.15 ? 1 : 0;
      stepState(s.steps[0], searchState);
      stepState(s.steps[1], searchState);
      // the cheapest flight is picked
      const bestIn = P(t, c[1] + 2.6, 0.45, backOut);
      place(s.best, BEST_X, lineY(4), bestIn, clamp(bestIn * 2));
      // book_flight passes the approval gate first
      draw(s.toGate, P(t, c[1] + 3.5, 0.4));
      const gateIn = P(t, c[1] + 3.7, 0.4, backOut);
      const approved = t >= c[1] + 4.4;
      const gateKey = approved ? 'ok' : 'wait';
      if (s.gate._k !== gateKey) {
        s.gate._k = gateKey;
        s.gate.className = 'abs pill ' + (approved ? 'neon' : 'violet');
        s.gate.innerHTML = '<span style="display:flex;align-items:center;gap:10px">'
          + (approved ? ICON('check', 20, C.neon, 2.6) + 'Approved' : ICON('lock', 20, C.violet, 2) + 'Approval')
          + '</span>';
      }
      place(s.gate, RIGHT.toolX[2], RIGHT.gateY, gateIn * swell(t, c[1] + 4.4, 0.12), clamp(gateIn * 2));
      draw(s.fromGate, P(t, c[1] + 4.5, 0.3));
      stepState(s.steps[2], t >= c[1] + 5.3 ? 2 : t >= c[1] + 4.75 ? 1 : 0);
      // every call is saved as soon as it completes
      const savedAt = [c[1] + 2.1, c[1] + 2.1, c[1] + 5.4];
      s.saved.forEach((e, i) => {
        setStatus(e, 'SAVED', 'saved');
        const p = P(t, savedAt[i], 0.4, backOut);
        place(e, RIGHT.toolX[i], RIGHT.savedY, p, clamp(p * 2));
      });

      // ---- c[1], payoff: what every call keeps, and one round trip instead of six
      place(s.tagRow, CODE.x, RIGHT.tagY, 1, P(t, c[1] + 5.6, 0.4));
      s.tags.forEach((e, i) => {
        const p = P(t, c[1] + 5.7 + i * 0.2, 0.45, backOut);
        e.style.transform = `scale(${p})`;
        e.style.opacity = clamp(p * 2);
      });
      place(s.vs, LEFT.x + 145, LEFT.counterY, 1, P(t, c[1] + 6.2, 0.3));
      const oneTripIn = P(t, c[1] + 6.3, 0.45, backOut);
      place(s.oneTrip, ONE_TRIP_X, LEFT.counterY, oneTripIn, clamp(oneTripIn * 2));
    }
  });
}
