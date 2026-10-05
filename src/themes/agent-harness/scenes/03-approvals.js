// ===================== 3. HUMAN APPROVALS
// The block keeps every name declared in this file local to this scene.
{
  // Layout, in final stage coordinates (shift 0) on the content frame x 140-1780, y 150-880: three columns
  // crossed by one horizontal lane the calls travel along. Left, the agent; center, the gate column (AUTO MODE
  // and its rule on top, reserved from the start, then the APPROVAL POLICY block above the lane, its RULES
  // below it, the person at the bottom); right, the tools. Related components keep 40 px gutters.
  const TOP = 150, BOTTOM = 880, LEFT = 140, RIGHT = 1780, GUTTER = 40;
  const CALL_W = 280, CALL_H = 48; // a tool call chip
  const TAG_DY = 54; // a status tag sits under its call, 13 px clear of it
  // the gate column: blocks wide enough for the rules' full tool names and for YOU beside its two buttons
  const GATE = { x: 960, w: 380 };
  GATE.x0 = GATE.x - GATE.w / 2; GATE.x1 = GATE.x + GATE.w / 2;
  const JUDGE = { y0: TOP, h: 64 };
  const RULE_CARD = { y0: JUDGE.y0 + JUDGE.h + 12, h: 40 }; // attached under AUTO MODE
  const POLICY = { y0: RULE_CARD.y0 + RULE_CARD.h + GUTTER, h: 142 };
  // the lane runs between the policy block and its rules, with 20 px on each side of a passing call
  const LANE = POLICY.y0 + POLICY.h + 20 + CALL_H / 2;
  const RULES = { y0: LANE + CALL_H / 2 + 20, h: 164 };
  // the person and the two buttons span the column width, GUTTER apart; their bottom is the content bottom.
  // The buttons have an even height and an even gap, so they rest on whole pixels.
  const YOU = { w: 170, h: 140, buttonW: 170, buttonH: 48, buttonGap: 12 };
  YOU.y = BOTTOM - YOU.h / 2; YOU.x = GATE.x0 + YOU.w / 2; YOU.buttonX = GATE.x1 - YOU.buttonW / 2;
  YOU.buttonDy = (YOU.buttonH + YOU.buttonGap) / 2; // from the person's center to each button's center
  // the agent's orb touches the left edge, centered on the lane
  const ORB = 200;
  const AGENT = { x: LEFT + ORB / 2, y: LANE };
  const FROM = [AGENT.x + ORB / 2 + GUTTER + CALL_W / 2, LANE]; // where a call pops out, next to the agent
  // where a gated call stops, GUTTER in front of the gate; the durable wait tile sits above it, its top
  // aligned with the policy block's
  const PARK = { x: GATE.x0 - GUTTER - CALL_W / 2, y: LANE };
  const WAIT = { y0: POLICY.y0, y1: LANE - CALL_H / 2 - GUTTER };
  // the tools panel spans from the column top down to the rules' bottom; 3 rows 150 px apart under its header
  const TOOLS = { x0: GATE.x1 + 120, x1: RIGHT, y0: TOP, y1: RULES.y0 + RULES.h };
  TOOLS.rowX = (TOOLS.x0 + TOOLS.x1) / 2;
  TOOLS.rows = [0, 1, 2].map(i => TOOLS.y0 + 125 + i * 150);
  const EXIT_X = GATE.x1 + 90; // past the gate, where a call turns toward its tool row
  const WAITS = ['5 MIN', '30 MIN', '3 H', '9 H', '1 DAY', '2 DAYS'];

  // position along a route: starts at `from`, then eases to each [at, d, x, y] leg in turn (legs may overlap)
  const routeAt = (t, from, legs) => {
    let [x, y] = from;
    for (const [a, d, lx, ly] of legs) { const p = P(t, a, d); x = lerp(x, lx, p); y = lerp(y, ly, p); }
    return [x, y];
  };
  // legs from the gate's lane, through the gate, into a tool row; the call crosses the gate GATE_HIT after `at`
  // and lands in its row LAND after `at`
  const through = (at, row) => [[at, 0.8, EXIT_X, LANE], [at + 0.65, 0.7, TOOLS.rowX, TOOLS.rows[row]]];
  const GATE_HIT = 0.42, LAND = 1.4;
  // 0 -> 1 -> 0 over [at, at + d]
  const bump = (t, at, d) => Math.sin(Math.PI * clamp((t - at) / d));

  // status tag under a call, a little larger than the shared one: 'ok' (allowed, approved, done) or 'wait'
  const makeTag = p => {
    const e = statusTag(p);
    Object.assign(e.style, { fontSize: '17px', paddingLeft: 'calc(10px + .1em)' });
    return e;
  };

  scene({
    chapter: 3, title: 'Human approvals',
    // the chapter header reads before the first subtitle; the final composition holds before the fade
    pre: 1.5, post: 2.0,
    // laid out in final coordinates: the gate column reserves the AUTO MODE space from the start
    shift: [0, 0],
    subs: [
      {
        text: "Some tool calls need a person's OK first, like a payment. The approval policy decides which ones.",
        after: 2.3,
      },
      {
        text: "The call pauses inside the Workflow, for minutes or days, then resumes as soon as someone approves.",
        after: 2.4,
      },
      { text: 'Auto mode lets code or a model approve routine calls, judged against criteria you define.', after: 1.4 },
      { text: 'Anything unclear, like a $2,400 hotel, still goes to a human.', after: 1.45 },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.lane = path(s.svg, `M ${AGENT.x + ORB / 2 + 20} ${LANE} L ${TOOLS.x0 - 20} ${LANE}`, C.line, 2, false, '6,12');
      // from under the parked call's tag, down to the person's left edge
      const askY0 = LANE + TAG_DY + 30, askX1 = GATE.x0 - 12;
      const askD = `M ${PARK.x} ${askY0} C ${PARK.x} ${YOU.y - 40} ${PARK.x + 40} ${YOU.y} ${askX1} ${YOU.y}`;
      s.ask = arrowPath(s.svg, askD, C.violet, 2.5, '8,8');
      s.agent = makeLLM(root, ORB, 'AGENT');

      // the gate: policy block above the lane, its rules below it, by tool name (the catch-all row in slate)
      s.gate = iconTile(root, 'shield', 'Approval policy', GATE.w, POLICY.h);
      const rule = (name, verdict, nameColor, verdictColor) =>
        '<div style="display:flex;justify-content:space-between;padding:5px 12px;border-radius:var(--rs)">'
        + `<span style="color:${nameColor}">${name}</span>`
        + `<span style="color:${verdictColor};letter-spacing:.1em">${verdict}</span></div>`;
      s.rules = E(root,
        '<div class="lbl" style="font-size:16px;margin-bottom:8px">Rules</div>'
        + rule('search_flights', 'ALLOW', C.ink, C.neon) + rule('search_hotels', 'ALLOW', C.ink, C.neon)
        + rule('everything else', 'ASK', C.slate, C.violet),
        'tile mono', {
          width: GATE.w + 'px', height: RULES.h + 'px', fontSize: '18px', padding: '16px 14px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        });
      // rule rows, in order: search_flights, search_hotels, everything else
      s.ruleRows = [...s.rules.children].slice(1);
      // AUTO MODE's rule card, created first so it slides out from under the AUTO MODE tile
      s.rule = E(root, 'approve: hotel under $500', 'mono', {
        width: GATE.w + 'px', height: RULE_CARD.h + 'px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '20px', background: C.ink, color: '#141414',
        borderLeft: '5px solid ' + C.uv, borderRadius: 'var(--rs)', whiteSpace: 'nowrap',
      });
      s.judge = E(root,
        `${ICON('bolt', 30, C.ink, 1.8)}<span class="mono" style="font-size:19px;letter-spacing:.1em">AUTO MODE</span>`,
        'tile', {
          width: GATE.w + 'px', height: JUDGE.h + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '12px',
        });

      s.tools = E(root,
        '<div class="lbl" style="position:absolute;left:22px;top:16px;display:flex;gap:10px;align-items:center">'
        + `${ICON('gear', 22, C.slate, 1.8)} Tools</div>`,
        'tile', { width: (TOOLS.x1 - TOOLS.x0) + 'px', height: (TOOLS.y1 - TOOLS.y0) + 'px', textAlign: 'left' });

      // the person who approves, with the two buttons
      s.you = iconTile(root, 'user', 'You', YOU.w, YOU.h);
      const button = label => E(root, label, 'pill', {
        width: YOU.buttonW + 'px', height: YOU.buttonH + 'px', padding: '0 0 0 .1em',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      });
      s.approve = button('Approve'); s.deny = button('Deny');

      // durable wait: a clock racing through the waiting time, and a pause badge on the parked call
      s.wait = E(root,
        '<div class="lbl" style="font-size:16px">Durable wait</div>'
        + '<div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-top:10px">'
        + `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${C.violet}" stroke-width="1.8"`
        + ' stroke-linecap="square" style="display:block"><circle cx="12" cy="12" r="9"/>'
        + '<path class="mh" d="M12 12V5.5"/><path class="hh" d="M12 12h4"/></svg>'
        + `<span class="mono" style="font-size:22px;letter-spacing:.06em;color:${C.violet}">WAITING `
        + '<span class="d" style="display:inline-block;min-width:6.6ch;text-align:left"></span></span></div>',
        'tile', {
          width: CALL_W + 'px', height: (WAIT.y1 - WAIT.y0) + 'px', borderColor: C.violet,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        });
      s.waitD = s.wait.querySelector('.d');
      s.minute = s.wait.querySelector('.mh'); s.hour = s.wait.querySelector('.hh');
      s.pause = E(root, ICON('pause', 22, C.violet, 1.8), '', {
        width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: OPAQUE.violet, border: '1.5px solid ' + C.violet, borderRadius: 'var(--rs)',
      });

      // tool calls, in order of appearance; created last so they travel over the gate
      const calls = [
        ['search_flights', ''], ['search_hotels', ''], ['book_flight', '$480'],
        ['book_hotel', '$210'], ['book_hotel', '$2,400'],
      ];
      s.calls = calls.map(([name, arg]) => {
        const e = callCard(root, name, arg, 'uv');
        Object.assign(e.style, { width: CALL_W + 'px', textAlign: 'center' });
        return e;
      });
      s.tags = s.calls.map(() => makeTag(root));
    },
    update(t, c, s) {
      // c[0]: the two searches pop next to the agent and cross the gate one after the other; book_flight stops
      const pop = [c[0] + 1.2, c[0] + 3.4, c[0] + 5.6];
      const parkFlight = pop[2] + 1.1;
      // c[1]: the durable wait, then the person approves and the flight is booked
      const approve = c[1] + 4.5, approved = c[1] + 4.8;
      // c[2]: AUTO MODE docks on the gate and approves the cheap hotel
      const hotelPop = c[2] + 1.8, hotelParked = hotelPop + 1.1, autoOk = c[2] + 3.6;
      // c[3]: the expensive hotel stops at the gate, AUTO MODE escalates it and it drops to the person
      const bigPop = c[3] + 0.5, bigParked = bigPop + 1.1, escalate = c[3] + 2.3, drop = c[3] + 3.3;
      const atYou = drop + 0.8;
      // when each call heads through the gate: search_flights, search_hotels, book_flight, the cheap book_hotel
      const cross = [pop[0] + 0.5, pop[1] + 0.5, c[1] + 6.0, c[2] + 4.4];
      const booked = cross[2] + LAND, hotelLands = cross[3] + LAND;
      // the gate flashes neon as a call crosses it, and turns violet while a call waits for a person in front of it
      const crossing = cross.some(at => Math.abs(t - at - GATE_HIT) < 0.22);
      const flightWaits = t >= parkFlight && t < approved;
      const hotelWaits = t >= escalate && t < drop + 0.4;

      // agent, gate, tools, person
      const ap = P(t, c[0], 0.6, backOut);
      place(s.agent.root, AGENT.x, AGENT.y, ap, clamp(ap * 2));
      const think = win(t, c[0] + 0.6, pop[2], 0.3) + win(t, c[2] + 0.9, bigPop, 0.3);
      llmState(s.agent, { think, look: 1 });
      draw(s.lane, P(t, c[0] + 0.6, 0.6));
      const gateColor = crossing ? C.neon : (flightWaits || hotelWaits) ? C.violet : C.line;
      [s.gate, s.rules].forEach((e, i) => {
        const p = P(t, c[0] + 0.2 + i * 0.1, 0.5, backOut);
        e.style.borderColor = gateColor;
        place(e, GATE.x, i === 0 ? POLICY.y0 + POLICY.h / 2 : RULES.y0 + RULES.h / 2, p, clamp(p * 2));
      });
      // the rule a call matches lights up: each search its own ALLOW row, the bookings the ASK row
      const searchLit = i => t >= cross[i] + 0.2 && t < cross[i] + 1.2;
      const hotelAsks = (t >= hotelParked && t < autoOk + 0.8) || (t >= bigParked && t < drop + 0.4);
      const ruleLit = [searchLit(0), searchLit(1), flightWaits || hotelAsks];
      s.ruleRows.forEach((row, i) => {
        const litColor = i < 2 ? 'rgba(219,255,75,.12)' : 'rgba(182,100,255,.18)';
        row.style.background = ruleLit[i] ? litColor : 'transparent';
      });
      const tp = P(t, c[0] + 0.4, 0.5, backOut);
      place(s.tools, TOOLS.rowX, (TOOLS.y0 + TOOLS.y1) / 2, tp, clamp(tp * 2));

      const yp = P(t, c[0] + 0.6, 0.5, backOut);
      const youWaits = (t >= c[1] + 1.4 && t < approve + 0.05) || t >= atYou;
      const youActs = t >= approve + 0.05 && t < cross[2];
      s.you.style.borderColor = youActs ? C.neon : youWaits ? C.violet : C.line;
      place(s.you, YOU.x, YOU.y, yp, clamp(yp * 2));
      const pressed = t >= approve + 0.05 && t < c[2] + 0.2;
      s.approve.className = 'abs pill' + (pressed ? ' neon' : '');
      const bp = P(t, c[0] + 0.75, 0.45, backOut), dp = P(t, c[0] + 0.85, 0.45, backOut);
      place(s.approve, YOU.buttonX, YOU.y - YOU.buttonDy, bp * (1 - 0.08 * bump(t, approve, 0.25)), clamp(bp * 2));
      place(s.deny, YOU.buttonX, YOU.y + YOU.buttonDy, dp, clamp(dp * 2));

      // tool calls: pop out next to the agent, then follow their route; tags ride under them
      const placeCall = (i, appear, legs, cls, fade = Infinity) => {
        const popIn = P(t, appear, 0.45, backOut);
        const [x, y] = routeAt(t, FROM, legs);
        const o = clamp(popIn * 2) * (1 - P(t, fade, 0.4));
        s.calls[i].className = 'abs pill ' + cls;
        s.calls[i].style.background = OPAQUE[cls];
        place(s.calls[i], x, y, popIn, o);
        return [x, y, o];
      };
      // the tag pops at popAt, swells briefly at swellAt (a status change), and hides from hideAt: it is
      // too wide to follow its call through the gate, so it pops again once the call has landed
      const placeTag = (i, [x, y, o], popAt, label, kind, swellAt = Infinity, hideAt = Infinity) => {
        setStatus(s.tags[i], label, kind);
        const popIn = P(t, popAt, 0.4, backOut);
        const scale = popIn * (1 + 0.12 * bump(t, swellAt, 0.3));
        place(s.tags[i], x, y + TAG_DY, scale, o * clamp(popIn * 2) * (1 - P(t, hideAt, 0.2)));
      };
      // a call that stops in front of the gate: from the agent to the parking spot, 0.3 s after it pops
      const toPark = at => [at + 0.3, 0.8, PARK.x, PARK.y];

      // c[0]: two searches pass the gate, book_flight stops in front of it; the searches leave in c[2]
      const f0 = placeCall(0, pop[0], through(cross[0], 0), 'uv', c[2]);
      placeTag(0, f0, cross[0] + LAND, 'ALLOWED', 'ok');
      const f1 = placeCall(1, pop[1], through(cross[1], 1), 'uv', c[2] + 0.1);
      placeTag(1, f1, cross[1] + LAND, 'ALLOWED', 'ok');

      // c[1]: book_flight waits durably, the person approves, the call goes through and runs;
      // in c[2] the booked flight moves up to the first row
      const flightLegs = [toPark(pop[2]), ...through(cross[2], 2), [c[2] + 0.3, 0.6, TOOLS.rowX, TOOLS.rows[0]]];
      const f2 = placeCall(2, pop[2], flightLegs, flightWaits ? 'violet' : 'uv');
      if (t < approved) placeTag(2, f2, parkFlight + 0.2, 'NEEDS APPROVAL', 'wait');
      else if (t < booked) placeTag(2, f2, parkFlight + 0.2, 'APPROVED', 'ok', approved, cross[2]);
      else placeTag(2, f2, booked, 'BOOKED', 'ok');

      const pp = P(t, c[1] + 0.3, 0.45, backOut);
      // the 44 px pause badge sits 8 px left of the parked call
      place(s.pause, PARK.x - CALL_W / 2 - 30, PARK.y, pp, clamp(pp * 2) * (1 - P(t, approved, 0.3)));
      const wp = P(t, c[1] + 0.6, 0.45, backOut);
      place(s.wait, PARK.x, (WAIT.y0 + WAIT.y1) / 2, wp, clamp(wp * 2) * (1 - P(t, approved + 0.1, 0.3)));
      // the waiting time races from minutes to days; the clock hands spin with it
      const race = clamp((t - c[1] - 1.2) / 2.8);
      s.waitD.textContent = WAITS[Math.min(WAITS.length - 1, Math.floor(race * WAITS.length))];
      s.minute.setAttribute('transform', `rotate(${race * 360 * 12} 12 12)`);
      s.hour.setAttribute('transform', `rotate(${race * 360} 12 12)`);
      draw(s.ask, P(t, c[1] + 1.0, 0.6), 1 - P(t, approved + 0.1, 0.3));

      // c[2] and c[3]: the AUTO MODE judge docks on the gate; it weighs each hotel parked in front of the gate
      // (UV), approves the cheap one (neon) and escalates the expensive one (violet)
      const jp = P(t, c[2] + 0.3, 0.5);
      const judging = (t >= hotelParked && t < autoOk - 0.1) || (t >= bigParked && t < escalate - 0.1);
      const judgeOk = t >= autoOk - 0.1 && t < autoOk + 1.2;
      const judgeUnsure = t >= escalate - 0.1 && t < drop + 0.4;
      const judgeColor = judgeOk ? C.neon : judgeUnsure ? C.violet : judging ? C.uv : C.line;
      s.judge.style.borderColor = judgeColor;
      place(s.judge, GATE.x, JUDGE.y0 + JUDGE.h / 2 - 30 * (1 - jp), 1, jp);
      // its rule slides out from under it
      const rp = P(t, c[2] + 0.8, 0.4);
      s.rule.style.borderLeftColor = judgeColor === C.line ? C.uv : judgeColor;
      place(s.rule, GATE.x, RULE_CARD.y0 + RULE_CARD.h / 2 - 12 * (1 - rp), 1, rp);

      const h0 = placeCall(3, hotelPop, [toPark(hotelPop), ...through(cross[3], 1)], 'uv');
      if (t < hotelLands) placeTag(3, h0, autoOk + 0.1, 'AUTO-APPROVED', 'ok', Infinity, cross[3]);
      else placeTag(3, h0, hotelLands, 'AUTO-APPROVED', 'ok');
      // the escalated call drops from the gate to the person
      const h1Legs = [toPark(bigPop), [drop, 0.8, PARK.x, YOU.y]];
      const h1 = placeCall(4, bigPop, h1Legs, t >= escalate ? 'violet' : 'uv');
      placeTag(4, h1, escalate + 0.1, 'ESCALATED', 'wait');
    }
  });
}
