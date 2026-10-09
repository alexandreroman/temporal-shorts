// ===================== 8. TYPED SESSIONS
// The block keeps every name declared in this file local to this scene.
{
  // Layout grid: the code column on the left (x 140-920), the UI window on the right (x 1120-1780). The 200 px gap
  // between them is wider than the 80-120 px zone gutter on purpose: it holds the TYPED SESSION label above the
  // link. Both headings share one baseline; both zones start at y 196 and end at y 880 (the TypeScript card, the
  // SDK row).
  const TOP = 196, BOTTOM = 880, HEADING_Y = 163;
  // Code cards: a 52 px header (file name), then 18 px code lines of 24 px from y 66, 16 px of bottom padding.
  // At 18 px, a Noto Sans Mono character advances 10.8 px: the longest lines (66 characters, 713 px) fit the
  // column with 28 px of padding on each side.
  const CODE = { x: 530, w: 780, head: 52, lineTop: 66, lineH: 24, font: 18, textX: 28, bottom: 16 };
  const cardHeight = lineCount => CODE.lineTop + lineCount * CODE.lineH + CODE.bottom;

  // The agent's Python class (top of the column) and the TypeScript generated from it (bottom of the column).
  // Same names as chapter 5 (TravelAgent, plan_trip, PlanTrip, Itinerary); the state follows the harness's
  // HarnessState / agent.state() API and the TypeScript the shape harness-codegen writes (handlers and states).
  const PYTHON = [
    'class Trip(HarnessState):',
    '    items: list[Item] = []',
    '    total_usd: int = 0',
    '',
    '@agent.defn',
    'class TravelAgent:',
    '    trip = agent.state(Trip)',
    '',
    '    @agent.accepts',
    '    async def plan_trip(self, request: PlanTrip) -> Itinerary: ...',
  ];
  const TYPESCRIPT = [
    'export interface Trip {',
    '  items: Item[];',
    '  total_usd: number;',
    '}',
    'export interface TravelAgent {',
    '  handlers: { plan_trip: { input: PlanTrip; output: Itinerary } };',
    '  states: { trip: Trip };',
    '}',
  ];
  const PY = { h: cardHeight(PYTHON.length) };
  PY.y = TOP + PY.h / 2;
  const TS = { h: cardHeight(TYPESCRIPT.length) };
  TS.y = BOTTOM - TS.h / 2;
  // the GENERATED TYPES arrow runs down the column's center line, 8 px from each card; its label sits to its right
  const GEN = { top: TOP + PY.h + 8, bottom: BOTTOM - TS.h - 8, lblX: CODE.x + 24 };
  // Line pairs that mirror each other across the two cards, as [first, last] line ranges, lit one pair at a time:
  // the state model, the observable state, the message handler
  const PAIRS = [
    { py: [0, 2], ts: [0, 3] },
    { py: [6, 6], ts: [6, 6] },
    { py: [8, 9], ts: [5, 5] },
  ];
  // the Trip fields the UI binds to, in the TypeScript card
  const TS_ITEMS = 1, TS_TOTAL = 2;

  // Right: the product UI, linked to the generated types by a typed session, and the SDKs it is built with, 40 px
  // below it
  const UI = { x: 1450, w: 660, h: 596, tagH: 48 };
  UI.y = TOP + UI.h / 2;
  // the SDK row's box, right-aligned with the window (its right edge at x 1780)
  const SDK_ROW = { w: 440 };
  SDK_ROW.x = UI.x + UI.w / 2 - SDK_ROW.w / 2;
  // the link leaves the TypeScript card between its two Trip fields and enters the UI window
  const LINK = {
    y: BOTTOM - TS.h + CODE.lineTop + 2 * CODE.lineH,
    from: CODE.x + CODE.w / 2 + 4, to: UI.x - UI.w / 2 - 4,
  };

  // Simple syntax colors, as in chapter 6: keywords and decorators violet, types light UV, the rest ink or slate
  const KEYWORDS = new Set(['class', 'async', 'def', 'export', 'interface']);
  const TYPES = new Set(['Trip', 'HarnessState', 'Item', 'TravelAgent', 'PlanTrip', 'Itinerary', 'int', 'number',
    'list']);
  const tokenColor = token => {
    if (token.startsWith('@') || KEYWORDS.has(token)) return C.violet;
    if (TYPES.has(token)) return '#A5ABFF';
    if (/^\w/.test(token)) return C.ink;
    return C.slate;
  };
  const escapeHtml = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const codeHtml = line => line.replace(/@[\w.]+|\w+|[^\w\s]+/g,
    token => `<span style="color:${tokenColor(token)}">${escapeHtml(token)}</span>`);

  // code card: a header with the file name and a tag on the right, a rule, then the code lines. e.highlight(range,
  // tint, color) adds a line highlight behind the code, hidden until update() shows it.
  const makeCodeCard = (p, fileName, tag, tagColor, lines, h) => {
    const e = E(p,
      `<div style="position:absolute;left:24px;right:24px;top:0;height:${CODE.head}px;display:flex;`
      + `align-items:center;gap:10px">${ICON('code', 20, C.slate, 2)}`
      + `<span class="mono" style="font-size:18px">${fileName}</span>`
      + `<span class="lbl" style="margin-left:auto;font-size:15px;color:${tagColor}">${tag}</span></div>`
      + `<div style="position:absolute;left:0;right:0;top:${CODE.head}px;border-top:1.5px solid ${C.line}"></div>`,
      'tile', { width: CODE.w + 'px', height: h + 'px', textAlign: 'left' });
    // line highlights sit in a layer under the code lines
    // the layer stays on, each highlight fades on its own
    const highlights = E(e, '', '', { left: '0', top: '0', opacity: 1 });
    e.highlight = ([first, last], tint, color) => E(highlights, '', '', {
      left: '12px', top: (CODE.lineTop + first * CODE.lineH) + 'px', width: (CODE.w - 24) + 'px',
      height: ((last - first + 1) * CODE.lineH) + 'px', background: tint, borderLeft: '3px solid ' + color,
      borderRadius: 'var(--rs)',
    });
    e.lines = lines.map((line, i) => E(e, codeHtml(line), 'mono', {
      left: CODE.textX + 'px', top: (CODE.lineTop + i * CODE.lineH) + 'px', height: CODE.lineH + 'px',
      lineHeight: CODE.lineH + 'px', fontSize: CODE.font + 'px', whiteSpace: 'pre',
    }));
    return e;
  };
  const PAIR_TINT = `rgba(${RGB.violet},.16)`, BIND_TINT = `rgba(${RGB.uv},.24)`;

  // binding badge on the UI: the field of the agent's typed state shown there (e.g. trip.items)
  const badgeHtml = (cls, field) => `<span class="${cls} pill uv" style="text-transform:none;letter-spacing:.02em;`
    + 'font-size:16px;line-height:23px;padding:0 10px;opacity:0">' + field + '</span>';
  // one itinerary row of the trip planner: icon, item and price
  const planRow = (icon, item, price) => '<div class="row" style="display:flex;align-items:center;gap:22px;'
    + `height:84px;padding:0 26px;border:1.5px solid ${C.line};border-radius:var(--rs);margin-top:16px;opacity:0">`
    + `${ICON(icon, 34, C.ink, 1.7)}<span style="flex:1;font-size:30px">${item}</span>`
    + `<span class="mono" style="font-size:28px;color:var(--slate)">${price}</span></div>`;
  // browser window holding a small trip planner (top bar with three dots), with the badges of its bound fields:
  // trip.items at the right end of the label line, over the rows, and trip.total_usd beside the total
  const makePlanner = p => {
    const e = E(p,
      `<div style="height:48px;border-bottom:1.5px solid ${C.line};display:flex;gap:10px;align-items:center;`
      + 'padding-left:20px"><i></i><i></i><i></i></div>'
      + '<div style="padding:30px 44px">'
      + '<div style="font-size:52px;line-height:1.15">Lisbon, 3 nights</div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;height:24px;margin-top:8px">'
      + '<span class="lbl" style="font-size:18px;padding-left:0">Trip planner</span>'
      + badgeHtml('items', 'trip.items') + '</div>'
      + planRow('plane', 'Flight to Lisbon', '$480')
      + planRow('bed', 'Hotel in Alfama', '$390')
      + planRow('ticket', 'Tram 28 tour', '$25')
      + '<div class="foot" style="display:flex;align-items:center;gap:24px;margin-top:30px;opacity:0">'
      + '<span class="mono" style="font-size:28px;color:var(--slate)">TOTAL <span style="color:var(--ink)">'
      + `$895</span></span>${badgeHtml('total', 'trip.total_usd')}`
      + '<span style="margin-left:auto;font-size:28px;background:var(--uv);padding:14px 48px;'
      + 'border-radius:var(--rs)">Book</span></div></div>',
      'tile', { width: UI.w + 'px', height: UI.h + 'px', textAlign: 'left', overflow: 'hidden' });
    e.querySelectorAll('i').forEach(dot => Object.assign(dot.style, {
      width: '12px', height: '12px', background: C.slate, opacity: 0.6, borderRadius: '2px',
    }));
    e.rows = [...e.querySelectorAll('.row')];
    e.foot = e.querySelector('.foot');
    e.itemsBadge = e.querySelector('.items');
    e.totalBadge = e.querySelector('.total');
    return e;
  };

  scene({
    chapter: 8, title: 'Typed sessions',
    // the chapter header reads before the first subtitle; the final composition holds before the fade
    pre: 1.5, post: 2.0,
    // laid out at final stage coordinates on the grid; while the code column stands alone (c[0]) the camera
    // centers it, then eases back as the UI window enters
    shift: (t, c) => pan(t, [960 - CODE.x, 0], [[c[1], 0, 0]], 1.0),
    subs: [
      {
        text: "The harness generates <b>TypeScript types</b> from your agent's Python class: "
          + 'its state and its messages.',
        // the last line pair lights at c[0] + 6.7 and reads for 2 s before the UI window enters
        after: 1.8,
      },
      {
        text: "Typed React and Svelte SDKs turn your agent into a live, typed session inside your product UI.",
        // the SDK pills land at c[1] + 6.9 and read for 2 s before the window ends; post then holds the final
        // composition
        after: 2.2,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);

      // left: the agent's Python class, the generated types arrow, the generated TypeScript
      s.lblL = E(root, 'Your agent', 'lbl');
      s.python = makeCodeCard(root, 'travel_agent.py', 'Python', C.slate, PYTHON, PY.h);
      s.gen = path(s.svg, `M ${CODE.x} ${GEN.top} L ${CODE.x} ${GEN.bottom}`, C.violet, 3, true);
      s.genL = E(root, 'Generated types', 'lbl', { fontSize: '16px', color: C.ink });
      s.ts = makeCodeCard(root, 'client_sdk/TravelAgent.ts', 'Generated', C.violet, TYPESCRIPT, TS.h);
      // the highlights of each mirrored pair, one in each card, and the UV highlights of the bound Trip fields
      s.pairs = PAIRS.map(pair => [
        s.python.highlight(pair.py, PAIR_TINT, C.violet),
        s.ts.highlight(pair.ts, PAIR_TINT, C.violet),
      ]);
      s.bindItems = s.ts.highlight([TS_ITEMS, TS_ITEMS], BIND_TINT, C.uv);
      s.bindTotal = s.ts.highlight([TS_TOTAL, TS_TOTAL], BIND_TINT, C.uv);

      // right: the product UI, built on the generated types with the React or Svelte SDK
      s.lblR = E(root, 'Your UI', 'lbl');
      s.planner = makePlanner(root);
      s.link = path(s.svg, `M ${LINK.from} ${LINK.y} L ${LINK.to} ${LINK.y}`, C.uv, 3, true);
      s.linkL = E(root, 'Typed session', 'lbl', { fontSize: '16px', color: C.ink });
      s.pulse = makeGlowDot(root, 14, RGB.uv, { radius: '3px', spread: 4, alpha: 0.6 });
      // the typed SDKs: one row under the window, its content pushed to the box's right edge, which sits on the
      // window's right edge; a box of fixed even width rests on whole pixels (its content is about 428 px wide)
      s.sdkRow = E(root,
        '<span class="lbl" style="font-size:18px;padding-left:0">Typed SDKs</span>'
        + '<span class="pill uv">React</span><span class="pill uv">Svelte</span>',
        '', {
          width: SDK_ROW.w + 'px', height: UI.tagH + 'px', display: 'flex', alignItems: 'center',
          justifyContent: 'flex-end', gap: '24px',
        });
      s.sdks = [...s.sdkRow.querySelectorAll('.pill')];
      // the pills fill the row's height, so they rest on the content bottom; they grow from their bottom edge, so
      // the pop's overshoot stays above it
      s.sdks.forEach(e => Object.assign(e.style, {
        height: UI.tagH + 'px', paddingTop: '0', paddingBottom: '0', display: 'flex', alignItems: 'center',
        transformOrigin: 'center bottom',
      }));
    },
    update(t, c, s) {
      const pop = at => backPop(t, at, 0.5);
      const showLines = (card, at) => card.lines.forEach((line, i) => showRow(line, P(t, at + i * 0.08, 0.3), 16));

      // ---- c[0]: the Python class, then the TypeScript generated from it; matching lines light up pair by pair
      place(s.lblL, CODE.x, HEADING_Y, 1, P(t, c[0] + 0.1, 0.4));
      const pyIn = pop(c[0] + 0.2);
      place(s.python, CODE.x, PY.y, pyIn.s, pyIn.o);
      showLines(s.python, c[0] + 0.6);
      draw(s.gen, P(t, c[0] + 1.8, 0.5));
      placeLeft(s.genL, GEN.lblX, (GEN.top + GEN.bottom) / 2, P(t, c[0] + 2.0, 0.4));
      const tsIn = pop(c[0] + 2.4);
      place(s.ts, CODE.x, TS.y, tsIn.s, tsIn.o);
      showLines(s.ts, c[0] + 2.8);
      // each pair reads about 1.4 s; the last one stays lit until the UI window starts to enter
      const pairStarts = [c[0] + 3.9, c[0] + 5.3, c[0] + 6.7];
      const pairEnds = [c[0] + 5.3, c[0] + 6.7, c[1] + 0.2];
      s.pairs.forEach(([py, ts], i) => {
        const lit = win(t, pairStarts[i], pairEnds[i], 0.3);
        py.style.opacity = lit;
        ts.style.opacity = lit;
      });

      // ---- c[1]: the trip planner UI, its typed session with the generated types, then the fields it binds
      const uiIn = pop(c[1] + 0.5);
      place(s.lblR, UI.x, HEADING_Y, 1, P(t, c[1] + 0.5, 0.5));
      place(s.planner, UI.x, UI.y, uiIn.s, uiIn.o);
      s.planner.rows.forEach((row, i) => showRow(row, P(t, c[1] + 1.2 + i * 0.4, 0.4), 24));
      s.planner.foot.style.opacity = P(t, c[1] + 2.5, 0.4);
      draw(s.link, P(t, c[1] + 3.2, 0.6));
      place(s.linkL, (LINK.from + LINK.to) / 2, LINK.y - 28, 1, P(t, c[1] + 3.6, 0.4));
      // session traffic: once the link is drawn, a pulse runs along it in an endless loop. It starts on the story
      // clock t but runs its laps on the ambient clock, which equals t in frozen frames
      const pulseStart = c[1] + 3.9, pulseLap = 1.4;
      const lap = ((ambientTime(this) - pulseStart) % pulseLap) / pulseLap;
      const pulseOn = t >= pulseStart ? Math.sin(Math.PI * lap) : 0;
      place(s.pulse, lerp(LINK.from + 10, LINK.to - 16, lap), LINK.y, 1, pulseOn);
      // bindings: the rows read trip.items, then the total reads trip.total_usd; each lights its Trip field
      const itemsAt = c[1] + 4.4, totalAt = c[1] + 5.4;
      s.bindItems.style.opacity = P(t, itemsAt, 0.3);
      popScale(s.planner.itemsBadge, pop(itemsAt + 0.1));
      s.planner.rows.forEach(row => { row.style.borderColor = t >= itemsAt + 0.15 ? C.uv : C.line; });
      s.bindTotal.style.opacity = P(t, totalAt, 0.3);
      popScale(s.planner.totalBadge, pop(totalAt + 0.1));
      place(s.sdkRow, SDK_ROW.x, BOTTOM - UI.tagH / 2, 1, P(t, c[1] + 6.0, 0.4));
      s.sdks.forEach((e, i) => popScale(e, pop(c[1] + 6.1 + i * 0.3)));
    }
  });
}
