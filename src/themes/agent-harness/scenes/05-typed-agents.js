// ===================== 5. TYPED, COMPOSABLE AGENTS
// The block keeps every name declared in this file local to this scene.
{
  // typed signature: operation name, then (parameter: type, ...), types in violet
  const sig = (name, params) => `<b>${name}</b><span style="color:var(--slate)">(</span>`
    + params.map(([p, type]) => `${p}<span style="color:var(--slate)">:</span> `
      + `<span style="color:var(--violet)">${type}</span>`).join('<span style="color:var(--slate)">, </span>')
    + '<span style="color:var(--slate)">)</span>';
  const TRAVEL_OPS = [
    [sig('plan_trip', [['request', 'PlanTrip']]), 'Itinerary'],
    [sig('set_budget', [['budget', 'Budget']]), 'Ack'],
  ];

  // Agent card layout, in explicit heights so the rows of both cards line up across the gap
  const CARD = { pad: 28, head: 72, rule: 44, cols: 20, rowH: 70, rowGap: 20 };
  const CARD_H = 2 * CARD.pad + CARD.head + CARD.rule + CARD.cols + 2 * (CARD.rowGap + CARD.rowH);
  // center of row i, measured from the card's center
  const rowDy = i => CARD.pad + CARD.head + CARD.rule + CARD.cols + CARD.rowGap
    + i * (CARD.rowH + CARD.rowGap) + CARD.rowH / 2 - CARD_H / 2;
  const ROW_BG = 'rgba(248,250,252,.04)';
  const ROW_CSS = `display:flex;align-items:center;height:${CARD.rowH}px;margin-top:${CARD.rowGap}px;padding:0 16px;`
    + `border:1.5px solid transparent;border-radius:var(--rs);background:${ROW_BG}`;

  // Layout grid: the Trip planner's column on the left (x 140-520), TravelAgent on the right (x 960-1780), a
  // 440 px gap between them for the calls. TravelAgent stays in place in both phases; in phase 1 the crossed-out
  // pill holds the left column, where the Trip planner appears in phase 2. CARDS_Y balances both phases around
  // y 522, within the centering tolerance of the content frame's middle (y 515): the cards alone in phase 1, the
  // cards and the READS ITS INTERFACE link arching over them in phase 2.
  const CARDS_Y = 545, CARDS_TOP = CARDS_Y - CARD_H / 2;
  const PARENT = { x: 330, y: CARDS_Y, w: 380 };
  const TRAVEL = { x: 1370, y: CARDS_Y, w: 820 };
  const GAP = { x0: PARENT.x + PARENT.w / 2, x1: TRAVEL.x - TRAVEL.w / 2 };
  const GAP_MID = (GAP.x0 + GAP.x1) / 2;
  // the interface link leaves TravelAgent's top, runs at ARCH_Y and drops onto the Trip planner's top
  const ARCH_Y = CARDS_TOP - 56, ARCH_X0 = PARENT.x, ARCH_X1 = GAP.x1 + 140;
  // plan_trip (travel_plan_trip, its generated tool, in the parent) is the first row of both cards: the request runs
  // along its top edge, the result along its bottom edge. Each label sits just outside its arrow, and each value
  // card rides outside its label, so a card in transit never covers an arrow, a label or a card's text.
  const PLAN_Y = CARDS_Y + rowDy(0);
  const REQUEST_Y = PLAN_Y - 30, RESULT_Y = PLAN_Y + 30;
  const LBL_DY = 22; // label center from its arrow
  const VALUE = { w: 310, requestH: 116, resultH: 88, clear: 24 }; // clear: from the label's center to the card
  const REQUEST_CARD_Y = REQUEST_Y - LBL_DY - VALUE.clear - VALUE.requestH / 2;
  const RESULT_CARD_Y = RESULT_Y + LBL_DY + VALUE.clear + VALUE.resultH / 2;
  // value cards travel inside the gap, 18 px from each card (room for the pop-in overshoot)
  const VALUE_X0 = GAP.x0 + 18 + VALUE.w / 2, VALUE_X1 = GAP.x1 - 18 - VALUE.w / 2;
  // where the plan_trip names sit in each card (chip and value cards leave and land there)
  const TRAVEL_NAME_X = GAP.x1 + 107, PARENT_NAME_X = GAP.x0 - PARENT.w + 152, PARENT_NAME_Y = PLAN_Y - 15;
  // the travel_plan_trip chip is wider than TravelAgent's plan_trip: it pops with its text on the name's left edge,
  // so it stays inside the card
  const CHIP_POP_X = GAP.x1 + 155;
  // start_travel and stop_travel ride above the request arrow, 20 px over its label's slot, and are absorbed by
  // TravelAgent's header (its name)
  const CALL_H = 44, CALL_W = 196; // callCard height; width of the longer chip, start_travel
  const CALL_Y = REQUEST_Y - LBL_DY - 8 - 20 - CALL_H / 2; // 8: half the label's height
  const CALL_X0 = GAP.x0 + 18 + CALL_W / 2, CALL_X1 = GAP.x1 - 18 - CALL_W / 2;
  const TRAVEL_HEAD = { x: GAP.x1 + 185, y: CARDS_TOP + CARD.pad + CARD.head / 2 };
  // the instance line sits under TravelAgent, on its left edge: handle and status of the running child workflow
  const INSTANCE_Y = CARDS_Y + CARD_H / 2 + 24 + 17;

  // hex color between a and b (p from 0 to 1), for borders that change with the instance's state
  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const mix = (a, b, p) => `rgb(${rgb(a).map((v, i) => Math.round(lerp(v, rgb(b)[i], p))).join(',')})`;

  // agent card: icon, name and a small label, a column header, then the rows (typed operations or tools)
  const makeAgentCard = (p, name, label, colsHtml, rowsHtml, w) => {
    const e = E(p,
      `<div style="display:flex;align-items:center;gap:16px;height:${CARD.head}px">`
      + `<div style="flex:none">${ICON('agent', 46, C.ink)}</div>`
      + `<div><div style="font-size:34px;line-height:1.1">${name}</div>`
      + `<div class="lbl" style="font-size:15px;padding-left:0;margin-top:4px">${label}</div></div>`
      + '<div class="tagSlot" style="margin-left:auto;display:flex;gap:20px"></div></div>'
      + '<div style="height:2px;background:var(--line);margin:20px 0 22px"></div>' // CARD.rule in total
      + `<div class="cols mono" style="display:flex;height:${CARD.cols}px;line-height:${CARD.cols}px;font-size:14px;`
      + `letter-spacing:.12em;color:var(--slate);padding:0 17.5px">${colsHtml}</div>`
      + rowsHtml,
      'tile', { width: w + 'px', height: CARD_H + 'px', padding: `${CARD.pad}px 28px`, textAlign: 'left' });
    [e.head, e.rule] = e.children;
    e.cols = e.querySelector('.cols');
    e.rows = [...e.querySelectorAll('.row')];
    e.tagSlot = e.querySelector('.tagSlot');
    return e;
  };
  // TravelAgent: one row per typed operation, signature then output type
  const makeTravelCard = p => {
    const outW = 144; // fits the Itinerary type; the arrow is centered between the signature and the type
    const rows = TRAVEL_OPS.map(([signature, out]) => `<div class="row" style="${ROW_CSS}">`
      + `<span class="mono" style="flex:1;font-size:22px;white-space:nowrap">${signature}</span>`
      + '<span class="mono" style="width:40px;text-align:center;font-size:22px;color:var(--slate)">→</span>'
      + `<span style="width:${outW}px"><span class="mono" style="font-size:22px;padding:2px 10px;border-radius:4px;`
      + `border:1.5px solid ${C.uv};background:rgba(68,76,231,.18)">${out}</span></span></div>`).join('');
    const cols = `<span style="flex:1">INPUT</span><span style="width:${outW + 40}px;padding-left:40px">OUTPUT</span>`;
    return makeAgentCard(p, 'TravelAgent', 'Operations', cols, rows, TRAVEL.w);
  };
  // Trip planner: its tools as rows; travel_plan_trip (generated from TravelAgent's plan_trip) is inserted above
  // search_web. That row carries where it comes from, under its name, and a check slot for the result.
  const makeParentCard = p => {
    const rows = `<div class="row" style="${ROW_CSS}">`
      + '<div style="display:flex;flex-direction:column;align-items:flex-start;gap:4px">'
      + '<b class="mono" style="font-size:22px;line-height:26px">travel_plan_trip</b>'
      + '<span class="from mono" style="display:inline-block;font-size:16px;line-height:20px;letter-spacing:.06em;'
      + `padding:2px 8px;border-radius:4px;border:1.5px solid ${C.uv};background:rgba(68,76,231,.16);`
      + 'color:var(--slate);transform-origin:left center">'
      + 'FROM <span style="color:var(--ink)">TravelAgent</span></span></div>'
      + `<span class="ok" style="margin-left:auto;display:flex">${ICON('check', 28, C.neon, 2.6)}</span></div>`
      + `<div class="row" style="${ROW_CSS}"><b class="mono" style="font-size:22px">search_web</b></div>`;
    const e = makeAgentCard(p, 'Trip planner', 'Parent agent', '<span>TOOLS</span>', rows, PARENT.w);
    e.from = e.querySelector('.from');
    e.ok = e.querySelector('.ok');
    return e;
  };
  // light card carrying a typed value along an arrow: a label and the operation or type, then the fields.
  // Its height is 12 + 28 + 6 + 28 per field + 14 px (VALUE.requestH, VALUE.resultH).
  const makeValueCard = (p, label, title, fields, accent) => E(p,
    '<div style="display:flex;align-items:baseline;gap:12px;line-height:28px">'
    + `<span class="mono" style="font-size:16px;letter-spacing:.12em;color:#5B6475">${label}</span>`
    + `<b class="mono" style="font-size:22px">${title}</b></div>`
    + `<div class="mono" style="font-size:20px;line-height:28px;margin-top:6px">${fields}</div>`,
    'paper', {
      width: VALUE.w + 'px', padding: '12px 20px 14px', whiteSpace: 'nowrap', borderLeft: `6px solid ${accent}`,
      boxShadow: '0 10px 30px rgba(0,0,0,.45)',
    });
  const field = (name, value) => `<span style="color:#5B6475">${name}:</span> ${value}`;

  scene({
    chapter: 5, title: 'Typed, composable agents',
    // the chapter header reads before the first subtitle; the final composition holds before the fade
    pre: 1.5, post: 2.0,
    // laid out at final positions on the grid (x 140-1780), so no offset is needed
    subs: [
      {
        text: "An agent is more than text in, text out: it exposes <b>typed operations</b>, with their inputs and outputs.",
        after: 1.0,
      },
      {
        text: "Other agents read that interface and add its operations to their own tools.",
        after: 2.1,
      },
      {
        text: "To use it, the parent starts TravelAgent as a <b>child workflow</b>: a new instance with its own history.",
        after: 0.6,
      },
      {
        text: "A typed request goes in, TravelAgent does the work, and a typed result comes back.",
        after: 2.1,
      },
      {
        text: "When its work is done, the parent closes the instance: a subagent never outlives its parent.",
        after: 0.3,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      // the strike sits on the pill's center line and overhangs its edges by about 4 px, so its ends stay just
      // inside the column's edges (x 140 and 520). A tighter letter spacing fits the big pill in the column.
      s.pill = E(root,
        '<span class="txt">Text in, text out</span>'
        + '<div class="strike" style="position:absolute;left:-5px;right:-5px;top:50%;height:4px;margin-top:-2px;'
        + `background:${C.red};border-radius:2px;transform:rotate(-4deg)"></div>`, 'pill big', {
          width: (PARENT.w - 8) + 'px', height: '56px', letterSpacing: '.05em', padding: '0 0 0 .05em',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        });
      s.pill.txt = s.pill.querySelector('.txt'); s.pill.strike = s.pill.querySelector('.strike');
      s.parent = makeParentCard(root);
      s.travel = makeTravelCard(root);
      // the header tags, side by side: CHILD WORKFLOW (solid UV, a Temporal fact: the parent starts TravelAgent
      // as its child workflow), then SELF-DESCRIBING at the card's right edge
      const headerTag = (text, css = {}) => E(s.travel.tagSlot, text, 'pill uv', {
        position: 'static', display: 'inline-block', fontSize: '16px', lineHeight: '22px',
        padding: '6px 12px 6px calc(12px + .1em)',
        ...css,
      });
      s.child = headerTag('Child workflow', { background: C.uv, color: '#FFFFFF' });
      s.self = headerTag('Self-describing');
      // the three exchanges between the cards, each with its label on its outer side
      const r = 18;
      const arch = `M ${ARCH_X1} ${CARDS_TOP - 10} V ${ARCH_Y + r} Q ${ARCH_X1} ${ARCH_Y} ${ARCH_X1 - r} ${ARCH_Y}`
        + ` H ${ARCH_X0 + r} Q ${ARCH_X0} ${ARCH_Y} ${ARCH_X0} ${ARCH_Y + r} V ${CARDS_TOP - 12}`;
      s.readArrow = path(s.svg, arch, C.slate, 3, true, '9 9');
      s.requestArrow = path(s.svg, `M ${GAP.x0 + 16} ${REQUEST_Y} L ${GAP.x1 - 16} ${REQUEST_Y}`, C.uv, 3, true);
      s.resultArrow = path(s.svg, `M ${GAP.x1 - 16} ${RESULT_Y} L ${GAP.x0 + 16} ${RESULT_Y}`, C.violet, 3, true);
      s.readLbl = E(root, 'Reads its interface', 'lbl', { fontSize: '16px' });
      s.requestLbl = E(root, 'Typed request', 'lbl', { fontSize: '16px' });
      s.resultLbl = E(root, 'Typed result', 'lbl', { fontSize: '16px' });
      s.chip = callCard(root, 'travel_plan_trip', '', 'uv solid');
      // the parent's calls that start and close the TravelAgent instance; solid, so the card's border and rule
      // do not show through a chip being absorbed by the header
      s.start = callCard(root, 'start_travel', '', 'uv solid');
      s.stop = callCard(root, 'stop_travel', '', 'uv solid');
      s.instance = E(root,
        '<span class="lbl" style="font-size:16px;padding-left:0">Instance</span>'
        + '<span class="mono" style="font-size:20px">7c2e91-3f9a1c</span>', '', {
          width: TRAVEL.w + 'px', display: 'flex', alignItems: 'center', gap: '20px',
        });
      s.instance.status = statusTag(s.instance);
      Object.assign(s.instance.status.style, { position: 'static', opacity: 1 });
      s.request = makeValueCard(root, 'REQUEST', 'PlanTrip',
        field('destination', '"Lisbon"') + '<br>' + field('nights', '3'), C.uv);
      s.result = makeValueCard(root, 'RESULT', 'Itinerary', field('total_usd', '895'), C.violet);
    },
    update(t, c, s) {
      // the moment stop_travel reaches TravelAgent (step 5), and the closing that follows
      const closedAt = c[4] + 3.2, closed = P(t, closedAt + 0.3, 0.6);

      // phase 1: "text in, text out" is struck out in the left column, TravelAgent lists its typed operations
      const pp = P(t, c[0] + 0.1, 0.5, backOut);
      place(s.pill, PARENT.x, PARENT.y, pp, clamp(pp * 2) * (1 - P(t, c[1] + 0.7, 0.35)));
      // the strike is drawn from left to right by clipping its end, so it keeps its centered position
      const struck = P(t, c[0] + 1.6, 0.5);
      s.pill.strike.style.clipPath = `inset(0 ${((1 - struck) * 100).toFixed(2)}% 0 0)`;
      s.pill.txt.style.opacity = lerp(1, 0.5, struck);

      const tp = P(t, c[0] + 3.0, 0.5, backOut);
      place(s.travel, TRAVEL.x, TRAVEL.y, tp, clamp(tp * 2));
      // a closed instance dims its content; the card itself stays opaque, so the stage never shows through
      const dim = lerp(1, 0.5, closed);
      s.travel.head.style.opacity = dim;
      s.travel.rule.style.opacity = dim;
      const colsIn = P(t, c[0] + 3.7, 0.3);
      showRow(s.travel.cols, colsIn);
      s.travel.cols.style.opacity = colsIn * dim;
      s.travel.rows.forEach((row, i) => {
        const rowIn = P(t, c[0] + 4.4 + i * 1.0, 0.35);
        showRow(row, rowIn);
        row.style.opacity = rowIn * dim;
      });
      const sp = P(t, c[1] + 0.3, 0.45, backOut);
      s.self.style.opacity = clamp(sp * 2);
      s.self.style.transform = `scale(${sp})`;

      // phase 2: the Trip planner takes the pill's place, with its tools
      const parentIn = P(t, c[1] + 0.9, 0.5, backOut);
      place(s.parent, PARENT.x, PARENT.y, parentIn, clamp(parentIn * 2));
      showRow(s.parent.cols, P(t, c[1] + 1.2, 0.3));

      // step 1: the Trip planner reads TravelAgent's interface and travel_plan_trip joins its tools
      draw(s.readArrow, P(t, c[1] + 2.0, 0.6));
      place(s.readLbl, (ARCH_X0 + ARCH_X1) / 2, ARCH_Y - 26, 1, P(t, c[1] + 2.1, 0.35));
      // the chip pops on TravelAgent's plan_trip, rests there, then travels to the Trip planner's tools
      const copied = c[1] + 3.5;
      fly(s.chip, t, c[1] + 3.1, CHIP_POP_X, PLAN_Y, copied, 0.9, PARENT_NAME_X, PARENT_NAME_Y,
        copied + 1.0, PARENT_NAME_X, PARENT_NAME_Y);
      // search_web sits in the first row, then slides down to make room before the chip lands
      const inserted = P(t, copied + 0.3, 0.5);
      const [planRow, searchRow] = s.parent.rows;
      // the row appears in place once the landed chip has faded (copied + 1.4), so one name shows at a time
      showRow(planRow, P(t, copied + 1.4, 0.3), 0);
      searchRow.style.opacity = P(t, c[1] + 1.3, 0.35);
      searchRow.style.transform = `translateY(${(-(CARD.rowH + CARD.rowGap) * (1 - inserted)).toFixed(2)}px)`;
      const fp = P(t, copied + 1.8, 0.4, backOut);
      s.parent.from.style.opacity = clamp(fp * 2);
      s.parent.from.style.transform = `scale(${fp})`;

      // step 2: the Trip planner starts TravelAgent as its child workflow: start_travel travels along the request
      // arrow into TravelAgent's header, which turns UV and gets its CHILD WORKFLOW tag, then the instance shows up
      const startSent = c[2] + 0.5, started = c[2] + 3.0;
      draw(s.requestArrow, P(t, c[2] + 0.3, 0.5));
      fly(s.start, t, startSent, CALL_X0, CALL_Y, startSent + 1.3, 0.9, CALL_X1, CALL_Y,
        started, TRAVEL_HEAD.x, TRAVEL_HEAD.y);
      const cp = P(t, started + 0.3, 0.45, backOut);
      s.child.style.opacity = clamp(cp * 2);
      s.child.style.transform = `scale(${cp})`;
      const ip = P(t, started + 1.5, 0.4);
      place(s.instance, TRAVEL.x, INSTANCE_Y + 12 * (1 - ip), 1, ip);

      // step 3: the Trip planner calls travel_plan_trip with a typed request; TravelAgent's plan_trip works on it
      const sent = c[3] + 0.3, landed = sent + 1.5;
      place(s.requestLbl, GAP_MID, REQUEST_Y - LBL_DY, 1, P(t, sent + 0.15, 0.35));
      fly(s.request, t, sent + 0.2, VALUE_X0, REQUEST_CARD_Y, sent + 0.6, 0.9, VALUE_X1, REQUEST_CARD_Y,
        landed, TRAVEL_NAME_X, PLAN_Y);
      const answered = c[3] + 3.6;
      const working = win(t, landed + 0.15, answered + 0.2, 0.2);
      const travelPlan = s.travel.rows[0];
      travelPlan.style.borderColor = working > 0.5 ? C.violet : 'transparent';
      travelPlan.style.background = working > 0 ? `rgba(182,100,255,${(0.16 * working).toFixed(3)})` : ROW_BG;
      travelPlan.style.boxShadow = `0 0 ${Math.round(22 * working)}px rgba(182,100,255,${(0.35 * working).toFixed(2)})`;

      // step 4: the typed result comes back and the tool row checks
      const received = answered + 1.5;
      draw(s.resultArrow, P(t, answered, 0.5));
      place(s.resultLbl, GAP_MID, RESULT_Y + LBL_DY, 1, P(t, answered + 0.15, 0.35));
      fly(s.result, t, answered + 0.2, VALUE_X1, RESULT_CARD_Y, answered + 0.6, 0.9, VALUE_X0, RESULT_CARD_Y,
        received, PARENT_NAME_X, PARENT_NAME_Y);
      const ok = P(t, received + 0.25, 0.45, backOut);
      s.parent.ok.style.opacity = clamp(ok * 2);
      s.parent.ok.style.transform = `scale(${ok})`;

      // step 5: when the work is done, stop_travel closes the instance: CLOSED, and TravelAgent dims
      const stopSent = c[4] + 0.8;
      fly(s.stop, t, stopSent, CALL_X0, CALL_Y, stopSent + 1.3, 0.9, CALL_X1, CALL_Y,
        closedAt, TRAVEL_HEAD.x, TRAVEL_HEAD.y);
      const isClosed = t >= closedAt + 0.3;
      setStatus(s.instance.status, isClosed ? 'CLOSED' : 'STARTED', isClosed ? 'closed' : 'wait');
      s.instance.status.style.transform = `scale(${swell(t, closedAt + 0.3, 0.12).toFixed(3)})`;
      // the card is live (UV border and glow) from the start until it is closed (its content dims, see phase 1)
      const live = P(t, started + 0.3, 0.4) * (1 - closed);
      s.travel.style.borderColor = mix(C.line, C.uv, live);
      s.travel.style.boxShadow = `0 0 ${Math.round(28 * live)}px rgba(68,76,231,${(0.35 * live).toFixed(2)})`;
    }
  });
}
