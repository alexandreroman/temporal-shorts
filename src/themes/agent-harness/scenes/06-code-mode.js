// ===================== 6. CODE MODE
// The block keeps every name declared in this file local to this scene.
{
  // Layout grid: the left zone spans x 140-700, the right zone x 800-1780 (100 px gutter). Both headings share
  // one baseline; both zones start at y 196 and end at y 880 (the round-trip counts, the EVERY CALL row).
  const TOP = 196, BOTTOM = 880, HEADING_Y = 163;
  // Left: the model orb and its three tools (one column, 40 px gutters), then the round-trip counts
  const LEFT = { x: 420, orbX: 220, orbSize: 160, toolX: 610, toolW: 180, toolH: 158, toolGap: 40 };
  const toolY = i => TOP + LEFT.toolH / 2 + i * (LEFT.toolH + LEFT.toolGap);
  const ORB_Y = toolY(1);
  const ORB_EDGE = LEFT.orbX + LEFT.orbSize / 2 + 4, TOOL_EDGE = LEFT.toolX - LEFT.toolW / 2 - 4; // connector ends
  // the 6 round trips (tool index of each call) and their timing, from c[0] + TRIPS.at: the call travels for
  // `out` seconds, waits `stay` seconds at the tool, and the result travels back for `out` seconds
  const TRIPS = { at: 0.9, gap: 1.1, out: 0.4, stay: 0.1, targets: [0, 1, 0, 1, 0, 2] };
  // "6 round trips vs 1 round trip": two equal count tiles at the zone's edges, "vs" in the gutter between them
  const COUNT = { w: 240, h: 90, y: BOTTOM - 45, x: [140 + 120, 700 - 120] };
  // Right: the script card; its three tools below, equal and spread across its width; SAVED; the closing row
  const CODE = { x: 1290, w: 980, h: 330, lineTop: 92, lineH: 40, textX: 28, numW: 44 };
  CODE.y = TOP + CODE.h / 2;
  const STEP = { w: 300, h: 120, y: 700 };
  STEP.x = [0, 1, 2].map(i => CODE.x - CODE.w / 2 + STEP.w / 2 + i * (CODE.w - STEP.w) / 2);
  const RIGHT = { gateY: 583, savedY: 794, tagH: 48 }; // the gate midway between the card and the steps
  const CARD_BOTTOM = CODE.y + CODE.h / 2 + 4, STEP_TOP = STEP.y - STEP.h / 2 - 6; // where the fan-out arrows run
  const GATE_HALF = 24; // half the height of the approval pill, which sits on the book_flight arrow

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
  const CHAR_W = 14.4; // advance of a 24 px Noto Sans Mono character (0.6 em)
  // left edge of the best: $480 pill, on line 5 (the min line), about 28 px right of the end of its code;
  // rounded, with an even pill height, so the pill rests on whole pixels
  const BEST_LEFT = Math.round(CODE.textX + CODE.numW + lineLength(SCRIPT[4]) * CHAR_W + 28), BEST_H = 42;

  // place() anchored on the element's left edge, so a pill keeps its gap to the code it follows
  const placeLeft = (e, x, y, scale, o) => {
    e.style.transform = `translate(${x}px,${y}px) translateY(-50%) scale(${scale})`;
    e.style.opacity = clamp(o);
    e.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
  };
  // step tile whose label is a tool name in code font (iconTile uppercases its labels)
  const makeToolStep = (p, icon, name) => {
    const e = makeStep(p, icon, name, STEP.w, STEP.h);
    Object.assign(e.querySelector('.mono').style, {
      textTransform: 'none', letterSpacing: '.02em', paddingLeft: '0', fontSize: '20px',
    });
    return e;
  };
  // round-trip count tile: a big number and its label side by side (e.n holds the number)
  const makeTripCount = (p, n, label) => {
    const e = E(p,
      `<div class="n" style="font-size:64px;line-height:1">${n}</div>`
      + `<div class="lbl" style="font-size:18px;color:var(--ink)">${label}</div>`,
      'tile', {
        width: COUNT.w + 'px', height: COUNT.h + 'px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '18px',
      });
    e.n = e.querySelector('.n'); e.label = e.querySelector('.lbl');
    return e;
  };
  // UV pill with an icon before its text, sharing the closing row equally with its neighbors
  const iconPillHtml = (icon, text) => '<span class="pill uv" style="flex:1;display:flex;align-items:center;'
    + `justify-content:center;gap:10px">${ICON(icon, 22, C.ink, 2)}${text}</span>`;

  scene({
    chapter: 6, title: 'Code Mode',
    // the chapter header reads before the first subtitle; the final composition holds before the fade
    pre: 1.5, post: 2.0,
    // laid out at final stage coordinates on the grid (content y 150-880, centered at y 515)
    shift: [0, 0],
    subs: [
      {
        text: "With Code Mode, the model writes a short Python script instead of calling tools one at a time.",
        after: 2.8,
      },
      {
        text: "Loops, conditions and parallel calls all run inside the script, in one turn.",
        after: 1.1,
      },
      {
        text: "Every call stays durable, approved and visible, and the whole script takes one round trip, not six.",
        // the tag row settles at c[2] + 6.65, about 1 s before the window ends; post then holds the final composition
        after: 1.0,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);

      // left: the model calls its tools one at a time
      s.lblL = E(root, 'One call at a time', 'lbl');
      s.links = [0, 1, 2].map(i => path(s.svg, `M ${ORB_EDGE} ${ORB_Y} L ${TOOL_EDGE} ${toolY(i)}`, C.line, 2, false));
      s.llm = makeLLM(root, LEFT.orbSize, 'MODEL');
      s.tools = [['plane', 'Flights'], ['bed', 'Hotels'], ['ticket', 'Booking']]
        .map(([icon, label]) => iconTile(root, icon, label, LEFT.toolW, LEFT.toolH));
      s.trip = E(root, '', 'pill', { fontSize: '16px', lineHeight: '21px', padding: '5px 12px 5px calc(12px + .1em)' });
      // 6 round trips one call at a time, vs 1 for the whole script
      s.counter = makeTripCount(root, 0, 'Round trips');
      s.vs = E(root, 'vs', 'lbl', { fontSize: '22px' });
      s.oneTrip = makeTripCount(root, 1, 'Round trip');
      Object.assign(s.oneTrip.style, { borderColor: C.uv, background: 'var(--uv-solid)' });

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
          `<span style="display:inline-block;width:${CODE.numW}px;color:${C.line}">${i + 1}</span>`
          + '<span class="src"></span>',
          'mono', {
            left: CODE.textX + 'px', top: (lineY(i) - CODE.lineH / 2) + 'px', height: CODE.lineH + 'px',
            lineHeight: CODE.lineH + 'px', fontSize: '24px', whiteSpace: 'pre', transform: 'none',
          });
        e.src = e.querySelector('.src');
        return e;
      });
      s.cursor = E(s.code, '', '', { width: '13px', height: '28px', background: C.violet, borderRadius: '2px' });
      s.best = E(s.code, '<span>best: <span style="color:var(--ink)">$480</span></span>', 'pill violet', {
        textTransform: 'none', letterSpacing: '.02em', fontSize: '22px', padding: '0 14px', color: C.violet,
        height: BEST_H + 'px', display: 'flex', alignItems: 'center', transformOrigin: '0 50%',
      });

      // right: the calls made by the script, straight down from the card to each tool; book_flight via the gate
      const down = (x, y0, y1) => path(s.svg, `M ${x} ${y0} L ${x} ${y1}`, C.uv, 3, true);
      s.fanFlights = down(STEP.x[0], CARD_BOTTOM, STEP_TOP);
      s.fanHotels = down(STEP.x[1], CARD_BOTTOM, STEP_TOP);
      s.toGate = down(STEP.x[2], CARD_BOTTOM, RIGHT.gateY - GATE_HALF - 6);
      s.fromGate = down(STEP.x[2], RIGHT.gateY + GATE_HALF + 2, STEP_TOP);
      s.steps = [['plane', 'search_flights'], ['bed', 'search_hotels'], ['ticket', 'book_flight']]
        .map(([icon, name]) => makeToolStep(root, icon, name));
      s.gate = E(root, '', 'pill');
      s.saved = s.steps.map(() => statusTag(root));
      // what every call keeps: one row spanning the card's width, its label on the card's left edge
      s.tagRow = E(root,
        '<span class="lbl" style="font-size:18px;padding-left:0">Every call</span>'
        + iconPillHtml('retry', 'Durable') + iconPillHtml('shield', 'Approved') + iconPillHtml('eye', 'Visible'),
        '', {
          width: CODE.w + 'px', height: RIGHT.tagH + 'px', display: 'flex', alignItems: 'center', gap: '24px',
        });
      s.tags = [...s.tagRow.querySelectorAll('.pill')];
    },
    update(t, c, s) {
      // ---- c[0], left: six round trips, then the whole side dims
      const dim = lerp(1, 0.35, P(t, c[0] + 7.6, 0.5));
      const leftIn = at => P(t, c[0] + at, 0.5, backOut);
      place(s.lblL, LEFT.x, HEADING_Y, 1, P(t, c[0] + 0.1, 0.4) * dim);
      s.links.forEach((l, i) => draw(l, P(t, c[0] + 0.5 + i * 0.1, 0.4), dim));
      const orbIn = leftIn(0.1);
      place(s.llm.root, LEFT.orbX, ORB_Y, orbIn, clamp(orbIn * 2) * dim);
      s.tools.forEach((e, i) => {
        const p = leftIn(0.3 + i * 0.15);
        place(e, LEFT.toolX, toolY(i), p, clamp(p * 2) * dim);
      });

      // the call card goes out to a tool and comes back as a result, one tool at a time
      const starts = TRIPS.targets.map((_, i) => c[0] + TRIPS.at + i * TRIPS.gap);
      const returned = starts.map(a => a + 2 * TRIPS.out + TRIPS.stay);
      const trip = starts.findLastIndex(a => t >= a);
      let busyTool = -1;
      if (trip >= 0 && t < returned[trip] + 0.05) {
        const a = starts[trip], target = TRIPS.targets[trip];
        const goingOut = t < a + TRIPS.out;
        const u = goingOut
          ? lerp(0.3, 0.75, P(t, a, TRIPS.out))
          : lerp(0.75, 0.3, P(t, a + TRIPS.out + TRIPS.stay, TRIPS.out));
        const x = lerp(ORB_EDGE, TOOL_EDGE, u), y = lerp(ORB_Y, toolY(target), u);
        if (s.trip._out !== goingOut) {
          s.trip._out = goingOut;
          s.trip.textContent = goingOut ? 'call' : 'result';
          // opaque, so the connector does not show through the card traveling on it
          s.trip.className = 'abs pill ' + (goingOut ? 'uv solid' : '');
          s.trip.style.background = goingOut ? '' : 'var(--surface)';
        }
        place(s.trip, x, y, 1, 1);
        // the tool lights up while the call reaches it, waits and turns back
        if (t > a + TRIPS.out - 0.1 && t < a + TRIPS.out + TRIPS.stay + 0.1) busyTool = target;
      } else place(s.trip, 0, 0, 1, 0);
      s.tools.forEach((e, i) => { e.style.borderColor = i === busyTool ? C.violet : C.line; });
      llmState(s.llm, { look: 0.8 });

      // the count dims with its zone, then comes back for the comparison with Code Mode in c[2]
      const trips = returned.filter(r => t >= r).length;
      s.counter.n.textContent = trips;
      s.counter.label.textContent = trips === 1 ? 'Round trip' : 'Round trips';
      const counterIn = leftIn(0.7);
      const compare = P(t, c[2] + 5.2, 0.4);
      place(s.counter, COUNT.x[0], COUNT.y, counterIn, clamp(counterIn * 2) * lerp(dim, 1, compare));

      // ---- c[0], right: the model writes the script instead, at a readable pace (about 36 characters a second)
      const codeIn = P(t, c[0] + 2.2, 0.6, backOut);
      place(s.lblR, CODE.x, HEADING_Y, 1, P(t, c[0] + 2.2, 0.5));
      place(s.code, CODE.x, CODE.y, codeIn, clamp(codeIn * 2));
      const typeStart = c[0] + 2.9, typeEnd = c[0] + 7.5;
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
      const cursorX = CODE.textX + CODE.numW + cursorCol * CHAR_W + 7;
      place(s.cursor, cursorX, lineY(cursorLine), 1, cursorOn * (t < typeEnd ? 1 : blink));

      // ---- c[1]: the script runs, its line highlight slides down from block to block: the gather block
      // (lines 1-4), the min line, then (c[2]) the book_flight line
      const highlight = [
        { at: c[1] + 0.5, from: 0, to: 3 }, { at: c[1] + 4.0, from: 4, to: 4 }, { at: c[2] + 0.3, from: 5, to: 5 },
      ];
      let top = lineY(highlight[0].from), bottom = lineY(highlight[0].to);
      for (const h of highlight.slice(1)) {
        const p = P(t, h.at, 0.4);
        top = lerp(top, lineY(h.from), p);
        bottom = lerp(bottom, lineY(h.to), p);
      }
      s.hl.style.top = (top - CODE.lineH / 2 + 1) + 'px';
      s.hl.style.height = (bottom - top + CODE.lineH - 2) + 'px';
      s.hl.style.opacity = win(t, highlight[0].at, c[2] + 4.6, 0.25);

      // the tools the script calls
      s.steps.forEach((e, i) => {
        const p = P(t, c[1] + 0.2 + i * 0.15, 0.5, backOut);
        place(e, STEP.x[i], STEP.y, p, clamp(p * 2));
      });
      // both searches start at the same time
      draw(s.fanFlights, P(t, c[1] + 0.8, 0.5));
      draw(s.fanHotels, P(t, c[1] + 0.8, 0.5));
      const searchState = t >= c[1] + 2.7 ? 2 : t >= c[1] + 1.3 ? 1 : 0;
      stepState(s.steps[0], searchState);
      stepState(s.steps[1], searchState);
      // the cheapest flight is picked
      const bestIn = P(t, c[1] + 4.2, 0.45, backOut);
      placeLeft(s.best, BEST_LEFT, lineY(4), bestIn, clamp(bestIn * 2));

      // ---- c[2]: book_flight passes the approval gate first
      draw(s.toGate, P(t, c[2] + 0.5, 0.4));
      const gateIn = P(t, c[2] + 0.8, 0.45, backOut);
      const approved = t >= c[2] + 2.1;
      const gateKey = approved ? 'ok' : 'wait';
      if (s.gate._k !== gateKey) {
        s.gate._k = gateKey;
        s.gate.className = 'abs pill ' + (approved ? 'neon' : 'violet');
        s.gate.innerHTML = '<span style="display:flex;align-items:center;gap:10px">'
          + (approved ? ICON('check', 20, C.neon, 2.6) + 'Approved' : ICON('lock', 20, C.violet, 2) + 'Approval')
          + '</span>';
      }
      place(s.gate, STEP.x[2], RIGHT.gateY, gateIn * swell(t, c[2] + 2.1, 0.12), clamp(gateIn * 2));
      draw(s.fromGate, P(t, c[2] + 2.25, 0.3));
      stepState(s.steps[2], t >= c[2] + 3.9 ? 2 : t >= c[2] + 2.6 ? 1 : 0);
      // every call is saved as soon as it completes
      const savedAt = [c[1] + 2.8, c[1] + 2.8, c[2] + 4.0];
      s.saved.forEach((e, i) => {
        setStatus(e, 'SAVED', 'saved');
        const p = P(t, savedAt[i], 0.4, backOut);
        place(e, STEP.x[i], RIGHT.savedY, p, clamp(p * 2));
      });

      // ---- c[2], payoff: the whole script ran in one round trip, against six one call at a time
      place(s.vs, (COUNT.x[0] + COUNT.x[1]) / 2, COUNT.y, 1, compare);
      const oneTripIn = P(t, c[2] + 5.3, 0.45, backOut);
      place(s.oneTrip, COUNT.x[1], COUNT.y, oneTripIn, clamp(oneTripIn * 2));
      // and what every call keeps, right after the payoff
      place(s.tagRow, CODE.x, BOTTOM - RIGHT.tagH / 2, 1, P(t, c[2] + 5.5, 0.4));
      s.tags.forEach((e, i) => {
        const p = P(t, c[2] + 5.6 + i * 0.3, 0.45, backOut);
        e.style.transform = `scale(${p})`;
        e.style.opacity = clamp(p * 2);
      });
    }
  });
}
