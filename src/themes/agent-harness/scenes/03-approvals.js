// ===================== 3. HUMAN APPROVALS
// The block keeps every name declared in this file local to this scene.
{
  // Layout: agent on the left, the APPROVAL POLICY gate in the middle (two blocks around the lane the calls
  // travel along), the tools on the right, the person under the gate.
  const LANE = 440;
  const AGENT = { x: 200, y: LANE };
  // the gate blocks are wide enough for the rules' full tool names; their left edge keeps 20 px from the parked call
  const GATE = { x: 860, w: 300, topY: 320, rulesY: 572, rulesH: 184, judgeY: 197 };
  const PARK = { x: 550, y: LANE }; // where a gated call stops, in front of the gate
  // rows 120 px apart, so a status tag stays twice as close to its own call as to the next row
  const TOOLS = { x: 1460, y: 460, h: 440, rowX: 1460, rows: [345, 465, 585] };
  const YOU = { x: 860, y: 770 };
  const FROM = [470, LANE]; // where a call pops out, next to the agent
  const EXIT_X = 1100; // past the gate, where a call turns toward its tool row
  const TAG_DY = 54; // a status tag sits under its call, 13 px clear of it
  const WAITS = ['5 MIN', '30 MIN', '3 H', '9 H', '1 DAY', '2 DAYS'];

  // position along a route: starts at `from`, then eases to each [at, d, x, y] leg in turn (legs may overlap)
  const routeAt = (t, from, legs) => {
    let [x, y] = from;
    for (const [a, d, lx, ly] of legs) { const p = P(t, a, d); x = lerp(x, lx, p); y = lerp(y, ly, p); }
    return [x, y];
  };
  // legs from the gate's lane, through the gate, into a tool row; the call crosses the gate GATE_HIT after `at`
  const through = (at, row) => [[at, 0.8, EXIT_X, LANE], [at + 0.65, 0.55, TOOLS.rowX, TOOLS.rows[row]]];
  const GATE_HIT = 0.42;
  // 0 -> 1 -> 0 over [at, at + d]
  const bump = (t, at, d) => Math.sin(Math.PI * clamp((t - at) / d));
  // like place(), but x is the left edge of the element
  const placeLeft = (e, x, y, o) => {
    e.style.transform = `translate(${x}px,${y}px) translate(0,-50%)`;
    e.style.opacity = clamp(o);
    e.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
  };

  // status tag under a call, a little larger than the shared one: 'ok' (allowed, approved, done) or 'wait'
  const makeTag = p => {
    const e = statusTag(p);
    Object.assign(e.style, { fontSize: '17px', paddingLeft: 'calc(10px + .1em)' });
    return e;
  };

  scene({
    chapter: 3, title: 'Human approvals',
    // one fixed offset fits both the policy phase and the taller auto-mode phase (judge docked on top)
    shift: [30, -1],
    subs: [
      {
        text: "Some tool calls need a person's OK first, like a payment. The approval policy decides which ones.",
        after: 0.6,
      },
      {
        text: "The call pauses inside the Workflow, for minutes or days, then resumes as soon as someone approves.",
        after: 0.6,
      },
      {
        text: "Auto mode lets code or a model approve routine calls. Anything unclear still goes to a human.",
        after: 0.6,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.lane = path(s.svg, `M 300 ${LANE} L 1170 ${LANE}`, C.line, 2, false, '6,12');
      const askD = `M ${PARK.x} 520 C ${PARK.x} 680 600 ${YOU.y} ${YOU.x - 112} ${YOU.y}`;
      s.ask = arrowPath(s.svg, askD, C.violet, 2.5, '8,8');
      s.agent = makeLLM(root, 160, 'AGENT');

      // the gate: policy block above the lane, its rules below it, by tool name (the catch-all row in slate)
      s.gate = iconTile(root, 'shield', 'Approval policy', GATE.w, 160);
      const rule = (name, verdict, nameColor, verdictColor) =>
        '<div style="display:flex;justify-content:space-between;padding:5px 12px;border-radius:var(--rs)">'
        + `<span style="color:${nameColor}">${name}</span>`
        + `<span style="color:${verdictColor};letter-spacing:.1em">${verdict}</span></div>`;
      s.rules = E(root,
        '<div class="lbl" style="font-size:16px;margin-bottom:8px">Rules</div>'
        + rule('search_flights', 'ALLOW', C.ink, C.neon) + rule('search_hotels', 'ALLOW', C.ink, C.neon)
        + rule('everything else', 'ASK', C.slate, C.violet),
        'tile mono', {
          width: GATE.w + 'px', height: GATE.rulesH + 'px', fontSize: '18px', padding: '16px 14px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        });
      // rule rows, in order: search_flights, search_hotels, everything else
      s.ruleRows = [...s.rules.children].slice(1);
      s.judge = E(root,
        `${ICON('bolt', 30, C.ink, 1.8)}<span class="mono" style="font-size:19px;letter-spacing:.1em">AUTO MODE</span>`,
        'tile', {
          width: GATE.w + 'px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '12px',
        });
      s.rule = E(root, 'approve: hotel under $500', 'mono', {
        fontSize: '20px', background: C.ink, color: '#141414', padding: '8px 16px',
        borderLeft: '5px solid ' + C.uv, borderRadius: 'var(--rs)', whiteSpace: 'nowrap',
      });

      s.tools = E(root,
        '<div class="lbl" style="position:absolute;left:22px;top:16px;display:flex;gap:10px;align-items:center">'
        + `${ICON('gear', 22, C.slate, 1.8)} Tools</div>`,
        'tile', { width: '560px', height: TOOLS.h + 'px', textAlign: 'left' });

      // the person who approves, with the two buttons
      s.you = iconTile(root, 'user', 'You', 200, 150);
      const button = label => E(root, label, 'pill', { width: '170px', textAlign: 'center', padding: '9px 0' });
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
        'tile', { width: '280px', padding: '14px 0', borderColor: C.violet });
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
        Object.assign(e.style, { width: '280px', textAlign: 'center' });
        return e;
      });
      s.tags = s.calls.map(() => makeTag(root));
    },
    update(t, c, s) {
      // decision times
      const parkFlight = c[0] + 4.8, approve = c[1] + 3.6, approved = c[1] + 3.9, booked = c[1] + 5.6;
      const autoOk = c[2] + 2.4, escalate = c[2] + 4.4;
      // when each call heads through the gate: search_flights, search_hotels, book_flight, the cheap book_hotel
      const cross = [c[0] + 1.3, c[0] + 2.7, c[1] + 4.3, c[2] + 2.9];
      // the gate flashes neon as a call crosses it, and turns violet while a call waits in front of it
      const crossing = cross.some(at => Math.abs(t - at - GATE_HIT) < 0.22);
      const flightWaits = t >= parkFlight && t < approved;
      const hotelWaits = t >= escalate && t < c[2] + 5.0;

      // agent, gate, tools, person
      const ap = P(t, c[0], 0.6, backOut);
      place(s.agent.root, AGENT.x, AGENT.y, ap, clamp(ap * 2));
      const think = win(t, c[0] + 0.6, c[0] + 4.4, 0.3) + win(t, c[2] + 0.9, c[2] + 3.8, 0.3);
      llmState(s.agent, { think, look: 1 });
      draw(s.lane, P(t, c[0] + 0.6, 0.6));
      const gateColor = crossing ? C.neon : (flightWaits || hotelWaits) ? C.violet : C.line;
      [s.gate, s.rules].forEach((e, i) => {
        const p = P(t, c[0] + 0.2 + i * 0.1, 0.5, backOut);
        e.style.borderColor = gateColor;
        place(e, GATE.x, i === 0 ? GATE.topY : GATE.rulesY, p, clamp(p * 2));
      });
      // the rule a call matches lights up: each search its own ALLOW row, the bookings the ASK row
      const searchLit = i => t >= cross[i] + 0.2 && t < cross[i] + 1.2;
      const askLit = flightWaits || (t >= c[2] + 2.0 && t < c[2] + 5.0);
      const ruleLit = [searchLit(0), searchLit(1), askLit];
      s.ruleRows.forEach((row, i) => {
        const litColor = i < 2 ? 'rgba(219,255,75,.12)' : 'rgba(182,100,255,.18)';
        row.style.background = ruleLit[i] ? litColor : 'transparent';
      });
      const tp = P(t, c[0] + 0.4, 0.5, backOut);
      place(s.tools, TOOLS.x, TOOLS.y, tp, clamp(tp * 2));

      const yp = P(t, c[0] + 0.6, 0.5, backOut);
      const youWaits = (t >= c[1] + 1.2 && t < approve + 0.05) || t >= c[2] + 5.3;
      const youActs = t >= approve + 0.05 && t < c[1] + 4.6;
      s.you.style.borderColor = youActs ? C.neon : youWaits ? C.violet : C.line;
      place(s.you, YOU.x, YOU.y, yp, clamp(yp * 2));
      const pressed = t >= approve + 0.05 && t < c[2] + 0.2;
      s.approve.className = 'abs pill' + (pressed ? ' neon' : '');
      const bp = P(t, c[0] + 0.75, 0.45, backOut), dp = P(t, c[0] + 0.85, 0.45, backOut);
      place(s.approve, YOU.x + 210, YOU.y - 28, bp * (1 - 0.08 * bump(t, approve, 0.25)), clamp(bp * 2));
      place(s.deny, YOU.x + 210, YOU.y + 28, dp, clamp(dp * 2));

      // tool calls: pop out next to the agent, then follow their route; tags ride under them
      const placeCall = (i, appear, legs, cls, fade = Infinity) => {
        const pop = P(t, appear, 0.45, backOut);
        const [x, y] = routeAt(t, FROM, legs);
        const o = clamp(pop * 2) * (1 - P(t, fade, 0.4));
        s.calls[i].className = 'abs pill ' + cls;
        s.calls[i].style.background = OPAQUE[cls];
        place(s.calls[i], x, y, pop, o);
        return [x, y, o];
      };
      // the tag pops at popAt, swells briefly at swellAt (a status change), and hides from hideAt: it is
      // too wide to follow its call through the gate, so it pops again once the call has landed
      const placeTag = (i, [x, y, o], popAt, label, kind, swellAt = Infinity, hideAt = Infinity) => {
        setStatus(s.tags[i], label, kind);
        const pop = P(t, popAt, 0.4, backOut);
        const scale = pop * (1 + 0.12 * bump(t, swellAt, 0.3));
        place(s.tags[i], x, y + TAG_DY, scale, o * clamp(pop * 2) * (1 - P(t, hideAt, 0.2)));
      };

      // c[0]: two searches pass the gate, book_flight stops in front of it; the searches leave in c[2]
      const f0 = placeCall(0, c[0] + 1.0, through(cross[0], 0), 'uv', c[2]);
      placeTag(0, f0, c[0] + 2.6, 'ALLOWED', 'ok');
      const f1 = placeCall(1, c[0] + 2.4, through(cross[1], 1), 'uv', c[2] + 0.1);
      placeTag(1, f1, c[0] + 4.0, 'ALLOWED', 'ok');

      // c[1]: book_flight waits durably, the person approves, the call goes through and runs;
      // in c[2] the booked flight moves up to the first row
      const flightLegs = [
        [c[0] + 4.1, 0.8, PARK.x, PARK.y], ...through(cross[2], 2), [c[2] + 0.3, 0.6, TOOLS.rowX, TOOLS.rows[0]],
      ];
      const f2 = placeCall(2, c[0] + 3.8, flightLegs, flightWaits ? 'violet' : 'uv');
      if (t < approved) placeTag(2, f2, parkFlight + 0.2, 'NEEDS APPROVAL', 'wait');
      else if (t < booked) placeTag(2, f2, parkFlight + 0.2, 'APPROVED', 'ok', approved, cross[2]);
      else placeTag(2, f2, booked, 'BOOKED', 'ok');

      const pp = P(t, c[1] + 0.2, 0.45, backOut);
      place(s.pause, PARK.x - 170, PARK.y, pp, clamp(pp * 2) * (1 - P(t, approved, 0.3)));
      const wp = P(t, c[1] + 0.5, 0.45, backOut);
      place(s.wait, PARK.x, 330, wp, clamp(wp * 2) * (1 - P(t, approved + 0.1, 0.3)));
      // the waiting time races from minutes to days; the clock hands spin with it
      const race = clamp((t - c[1] - 0.9) / 2.4);
      s.waitD.textContent = WAITS[Math.min(WAITS.length - 1, Math.floor(race * WAITS.length))];
      s.minute.setAttribute('transform', `rotate(${race * 360 * 12} 12 12)`);
      s.hour.setAttribute('transform', `rotate(${race * 360} 12 12)`);
      draw(s.ask, P(t, c[1] + 0.7, 0.6), 1 - P(t, approved + 0.1, 0.3));

      // c[2]: the AUTO MODE judge docks on the gate; it approves the cheap hotel and escalates the expensive one
      const jp = P(t, c[2] + 0.3, 0.5);
      const judgeOk = t >= autoOk - 0.1 && t < autoOk + 0.9;
      const judgeUnsure = t >= escalate - 0.1 && t < c[2] + 5.0;
      s.judge.style.borderColor = judgeOk ? C.neon : judgeUnsure ? C.violet : C.line;
      place(s.judge, GATE.x, GATE.judgeY - 30 * (1 - jp), 1, jp);
      const rp = P(t, c[2] + 0.7, 0.4);
      s.rule.style.borderLeftColor = judgeOk ? C.neon : judgeUnsure ? C.violet : C.uv;
      placeLeft(s.rule, GATE.x + GATE.w / 2 + 20 - 20 * (1 - rp), GATE.judgeY, rp);

      const h0 = placeCall(3, c[2] + 1.3, [[c[2] + 1.6, 0.7, PARK.x, PARK.y], ...through(cross[3], 1)], 'uv');
      const hotelLands = c[2] + 4.05;
      if (t < hotelLands) placeTag(3, h0, autoOk + 0.1, 'AUTO-APPROVED', 'ok', Infinity, cross[3]);
      else placeTag(3, h0, hotelLands, 'AUTO-APPROVED', 'ok');
      // the escalated call drops from the gate to the person
      const h1Legs = [[c[2] + 3.6, 0.7, PARK.x, PARK.y], [c[2] + 4.8, 0.7, PARK.x, YOU.y]];
      const h1 = placeCall(4, c[2] + 3.3, h1Legs, t >= escalate ? 'violet' : 'uv');
      placeTag(4, h1, escalate + 0.1, 'ESCALATED', 'wait');
    }
  });
}
