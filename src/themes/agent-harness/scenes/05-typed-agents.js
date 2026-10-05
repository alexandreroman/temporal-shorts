// ===================== 5. TYPED, COMPOSABLE AGENTS
// The block keeps every name declared in this file local to this scene.
{
  // typed signature: operation name, then (parameter: type, ...), types in violet
  const sig = (name, params) => `<b>${name}</b><span style="color:var(--slate)">(</span>`
    + params.map(([p, type]) => `${p}<span style="color:var(--slate)">:</span> `
      + `<span style="color:var(--violet)">${type}</span>`).join('<span style="color:var(--slate)">, </span>')
    + '<span style="color:var(--slate)">)</span>';
  const TRAVEL_OPS = [
    [sig('plan_trip', [['destination', 'str'], ['nights', 'int']]), 'Itinerary'],
    [sig('set_budget', [['max_usd', 'float']]), 'Ack'],
  ];
  const CALENDAR_OPS = [
    [sig('free_days', [['month', 'str']]), 'Dates'],
    [sig('add_event', [['day', 'date'], ['title', 'str']]), 'Ack'],
  ];
  const CARD_H = 280;
  // phase 1: the crossed-out pill on the left, TravelAgent in the middle
  const PILL = { x: 490, y: 522 };
  const TRAVEL_SOLO = { x: 1205, y: 522 };
  // phase 2: the parent agent on top, its two subagents below, linked from the parent's sides
  const PARENT = { x: 960, y: 215, w: 460, h: 100 };
  const TRAVEL = { x: 580, y: 730, w: 840 };
  const CALENDAR = { x: 1400, y: 730, w: 680 };
  const CHILD_TOP = TRAVEL.y - CARD_H / 2;
  // typed request and result cards ride down and up just right of the TravelAgent link
  const CARD_X = TRAVEL.x + 20 + 165, CARD_HIGH = 340, CARD_LOW = 500;
  const PLAN_ROW_Y = CHILD_TOP + 176; // plan_trip row, where the request lands and the result leaves

  // agent card: icon and name, OPERATIONS label, INPUT / OUTPUT column labels, one row per typed operation
  function makeAgentCard(p, name, ops, w, outW) {
    const e = E(p,
      `<div style="display:flex;align-items:center;gap:16px"><div style="flex:none">${ICON('agent', 46, C.ink)}</div>`
      + `<div><div style="font-size:32px;line-height:1.1">${name}</div>`
      + '<div class="lbl" style="font-size:15px;padding-left:0;margin-top:4px">Operations</div></div>'
      + '<div class="tagSlot" style="margin-left:auto"></div></div>'
      + '<div style="height:1.5px;background:var(--line);margin:16px 0 12px"></div>'
      + '<div class="cols mono" style="display:flex;font-size:14px;letter-spacing:.12em;color:var(--slate);'
      + 'padding:0 17.5px"><span style="flex:1">INPUT</span>'
      + `<span style="width:${outW + 40}px;padding-left:40px">OUTPUT</span></div>`
      + ops.map(([signature, out]) => '<div class="op" style="display:flex;align-items:center;margin-top:10px;'
        + 'padding:9px 16px;border:1.5px solid transparent;border-radius:var(--rs);background:rgba(248,250,252,.04)">'
        + `<span class="mono" style="flex:1;font-size:22px;white-space:nowrap">${signature}</span>`
        + '<span class="mono" style="width:40px;font-size:22px;color:var(--slate)">→</span>'
        + `<span style="width:${outW}px"><span class="mono" style="font-size:22px;padding:2px 10px;border-radius:4px;`
        + `border:1.5px solid ${C.uv};background:rgba(68,76,231,.18)">${out}</span></span></div>`).join(''),
      'tile', { width: w + 'px', height: CARD_H + 'px', padding: '22px 28px', textAlign: 'left' });
    e.cols = e.querySelector('.cols');
    e.ops = [...e.querySelectorAll('.op')];
    e.tagSlot = e.querySelector('.tagSlot');
    return e;
  }
  // light card carrying a typed value along a link: a label, the operation or type, then the fields
  function makeValueCard(p, label, title, fields, accent) {
    return E(p,
      `<div class="mono" style="font-size:15px;letter-spacing:.12em;color:#5B6475">${label} `
      + `<b style="color:#141414;font-size:18px;letter-spacing:0">${title}</b></div>`
      + `<div class="mono" style="font-size:22px;line-height:1.35;margin-top:4px">${fields}</div>`,
      '', {
        width: '330px', background: '#F8FAFC', color: '#141414', padding: '10px 18px 12px',
        borderLeft: `6px solid ${accent}`, borderRadius: 'var(--r)',
      });
  }
  // a row slides in from the left as it appears
  const showRow = (e, p) => {
    e.style.opacity = p;
    e.style.transform = `translateX(${(1 - p) * 26}px)`;
  };

  scene({
    chapter: 5, title: 'Typed, composable agents',
    // both phases are centered on the same point, so one fixed offset fits
    shift: [10, 4],
    subs: [
      {
        text: "An agent is more than text in, text out: it exposes typed operations, with their inputs and outputs.",
        after: 0.6,
      },
      {
        text: "It describes itself, so other agents can drive it as a tool: multi-agent systems with real contracts.",
        after: 0.6,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.pill = E(root,
        '<span class="txt">Text in, text out</span>'
        + '<div class="strike" style="position:absolute;left:-10px;right:-10px;top:50%;height:4px;margin-top:-2px;'
        + `background:${C.red};border-radius:2px;transform-origin:left center"></div>`, 'pill big');
      s.pill.txt = s.pill.querySelector('.txt'); s.pill.strike = s.pill.querySelector('.strike');
      s.travel = makeAgentCard(root, 'TravelAgent', TRAVEL_OPS, TRAVEL.w, 150);
      s.self = E(s.travel.tagSlot, 'Self-describing', 'pill uv', {
        position: 'static', display: 'inline-block', fontSize: '16px', padding: '6px 12px 6px calc(12px + .1em)',
      });
      s.parent = E(root,
        `<div style="flex:none">${ICON('agent', 46, C.ink)}</div><div style="margin-left:16px">`
        + '<div style="font-size:30px;line-height:1.1">Trip planner</div>'
        + '<div class="lbl" style="font-size:15px;padding-left:0;margin-top:4px">Parent agent</div></div>'
        + `<div class="ok" style="margin-left:auto;flex:none">${ICON('check', 34, C.neon, 2.6)}</div>`,
        'tile', {
          width: PARENT.w + 'px', height: PARENT.h + 'px', display: 'flex', alignItems: 'center', padding: '0 26px',
          textAlign: 'left',
        });
      s.parent.ok = s.parent.querySelector('.ok');
      s.calendar = makeAgentCard(root, 'CalendarAgent', CALENDAR_OPS, CALENDAR.w, 100);
      // links leave the parent's sides and drop onto each subagent
      const linkTo = (fromX, x) => {
        const dir = Math.sign(x - fromX);
        return `M ${fromX} ${PARENT.y} H ${x - dir * 20} Q ${x} ${PARENT.y} ${x} ${PARENT.y + 20} V ${CHILD_TOP - 8}`;
      };
      s.links = [
        path(s.svg, linkTo(PARENT.x - PARENT.w / 2, TRAVEL.x), C.uv, 3),
        path(s.svg, linkTo(PARENT.x + PARENT.w / 2, CALENDAR.x), C.uv, 3),
      ];
      s.contracts = [0, 1].map(() => E(root, 'Typed contract', 'lbl', { color: 'var(--ink)' }));
      s.request = makeValueCard(root, 'REQUEST', 'plan_trip', 'destination: "Lisbon"<br>nights: 3', C.uv);
      s.result = makeValueCard(root, 'RESULT', 'Itinerary', 'total_usd: 1240', C.violet);
    },
    update(t, c, s) {
      // phase 1: "text in, text out" is struck out, TravelAgent lists its typed operations
      const pp = P(t, c[0] + 0.1, 0.5, backOut);
      place(s.pill, PILL.x, PILL.y, pp, clamp(pp * 2) * (1 - P(t, c[1], 0.4)));
      const struck = P(t, c[0] + 1.2, 0.35);
      s.pill.strike.style.transform = `rotate(-5deg) scaleX(${struck})`;
      s.pill.txt.style.opacity = lerp(1, 0.5, struck);

      // phase 2: TravelAgent moves under the parent; the request goes down, the result comes back up
      const move = P(t, c[1] + 0.4, 0.9);
      const tp = P(t, c[0] + 1.6, 0.5, backOut);
      place(s.travel, lerp(TRAVEL_SOLO.x, TRAVEL.x, move), lerp(TRAVEL_SOLO.y, TRAVEL.y, move), tp, clamp(tp * 2));
      showRow(s.travel.cols, P(t, c[0] + 2.3, 0.3));
      s.travel.ops.forEach((row, i) => showRow(row, P(t, c[0] + 2.6 + i * 0.8, 0.35)));
      const sp = P(t, c[1] + 0.15, 0.45, backOut);
      s.self.style.opacity = clamp(sp * 2);
      s.self.style.transform = `scale(${sp})`;

      const parentIn = P(t, c[1] + 1.2, 0.5, backOut);
      place(s.parent, PARENT.x, PARENT.y, parentIn, clamp(parentIn * 2));
      const calIn = P(t, c[1] + 1.4, 0.5, backOut);
      place(s.calendar, CALENDAR.x, CALENDAR.y, calIn, clamp(calIn * 2));
      showRow(s.calendar.cols, P(t, c[1] + 1.5, 0.3));
      s.calendar.ops.forEach(row => showRow(row, P(t, c[1] + 1.6, 0.35)));
      s.links.forEach((link, i) => draw(link, P(t, c[1] + 1.9 + i * 0.15, 0.5)));
      place(s.contracts[0], TRAVEL.x - 122, 420, 1, P(t, c[1] + 2.3, 0.4));
      place(s.contracts[1], CALENDAR.x + 122, 420, 1, P(t, c[1] + 2.45, 0.4));

      const sent = c[1] + 2.8, landed = c[1] + 4.0, answered = c[1] + 4.8, received = c[1] + 6.1;
      fly(s.request, t, sent, CARD_X, CARD_HIGH, sent + 0.2, 0.9, CARD_X, CARD_LOW, landed, TRAVEL.x, PLAN_ROW_Y);
      fly(s.result, t, answered, CARD_X, CARD_LOW, answered + 0.2, 0.9, CARD_X, CARD_HIGH,
        received, PARENT.x, PARENT.y);
      // TravelAgent works on plan_trip between the request landing and the result leaving
      const working = win(t, landed + 0.2, answered + 0.1, 0.2);
      const planRow = s.travel.ops[0];
      planRow.style.borderColor = working > 0.5 ? C.uv : 'transparent';
      planRow.style.background = `rgba(68,76,231,${lerp(0.04, 0.22, working)})`;
      const ok = P(t, received + 0.3, 0.4, backOut);
      s.parent.ok.style.opacity = clamp(ok * 2);
      s.parent.ok.style.transform = `scale(${ok})`;
    }
  });
}
