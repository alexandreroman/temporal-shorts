// ===================== 7. BUILT FOR REAL PRODUCTS
// The block keeps every name declared in this file local to this scene.
{
  // Left: the app (agent on a Temporal worker) calls a tool that runs on the user's laptop
  const LEFT = { x: 500, labelY: 270, appY: 425, appW: 380, appH: 250, laptopY: 785 };
  const ARROW = { top: LEFT.appY + LEFT.appH / 2 + 10, bottom: LEFT.laptopY - 85 };
  // Right: the product UI, linked to the agent by a typed session
  const UI = { x: 1300, y: 550, w: 720, h: 450, tagY: 815 };
  const LINK = { y: LEFT.appY, from: LEFT.x + LEFT.appW / 2 + 4, to: UI.x - UI.w / 2 - 4 };
  // Recap tiles, in the order of the subtitle
  const RECAP = [
    ['retry', 'Survives crashes'], ['stream', 'Event stream'], ['layers', 'Typed subagents'],
    ['user', 'Human approvals'], ['code', 'Code Mode'], ['agent', 'Your AI SDK'],
  ];
  const RECAP_AT = [0.6, 1.2, 1.9, 3.0, 3.9, 4.9];
  const recapX = i => 590 + (i % 3) * 370;
  const recapY = i => 405 + Math.floor(i / 3) * 250;

  // the app tile: cloud header, the agent inside and where it runs
  const makeAppTile = p => E(p,
    '<div style="position:absolute;left:22px;top:18px;display:flex;align-items:center;gap:10px">'
    + ICON('cloud', 26, C.ink, 1.8)
    + '<span class="mono" style="font-size:18px;letter-spacing:.12em">THE APP</span></div>'
    + '<div style="position:absolute;left:0;right:0;top:78px;display:flex;flex-direction:column;align-items:center">'
    + ICON('agent', 56, C.violet, 1.8)
    + '<div class="mono" style="font-size:20px;letter-spacing:.12em;padding-left:.12em;margin-top:10px">AGENT</div>'
    + '<div style="font-size:22px;color:var(--slate);margin-top:6px">on a Temporal worker</div></div>',
    'tile', { width: LEFT.appW + 'px', height: LEFT.appH + 'px', borderColor: C.violet });

  // one itinerary row of the trip planner: icon, item and price
  const planRow = (icon, item, price) => '<div class="row" style="display:flex;align-items:center;gap:18px;'
    + `height:62px;padding:0 20px;border:1.5px solid ${C.line};border-radius:var(--rs);margin-top:12px;opacity:0">`
    + `${ICON(icon, 28, C.ink, 1.7)}<span style="flex:1;font-size:24px">${item}</span>`
    + `<span class="mono" style="font-size:22px;color:var(--slate)">${price}</span></div>`;
  // browser window holding a small trip planner (top bar with three dots, as makeApp)
  const makePlanner = p => {
    const e = E(p,
      `<div style="height:40px;border-bottom:1.5px solid ${C.line};display:flex;gap:8px;align-items:center;`
      + 'padding-left:16px"><i></i><i></i><i></i></div>'
      + '<div style="padding:24px 30px">'
      + '<div style="font-size:38px;line-height:1.15">Lisbon, 3 nights</div>'
      + '<div class="lbl" style="font-size:16px;padding-left:0;margin-top:6px">Trip planner</div>'
      + planRow('plane', 'Flight to Lisbon', '$480')
      + planRow('bed', 'Hotel in Alfama', '$390')
      + planRow('ticket', 'Tram 28 tour', '$25')
      + '<div class="foot" style="display:flex;align-items:center;justify-content:space-between;margin-top:18px;'
      + 'opacity:0"><span class="mono" style="font-size:22px;color:var(--slate)">TOTAL <span style="color:var(--ink)">'
      + '$895</span></span><span style="font-size:24px;background:var(--uv);padding:10px 34px;'
      + 'border-radius:var(--rs)">Book</span></div></div>',
      'tile', { width: UI.w + 'px', height: UI.h + 'px', textAlign: 'left', overflow: 'hidden' });
    e.querySelectorAll('i').forEach(dot => Object.assign(dot.style, {
      width: '10px', height: '10px', background: C.slate, opacity: 0.6, borderRadius: '2px',
    }));
    e.rows = [...e.querySelectorAll('.row')];
    e.foot = e.querySelector('.foot');
    return e;
  };

  scene({
    chapter: 7, title: 'Built for real products',
    // callback tools and the product UI, then the recap tiles, centered on their own, as the first phase fades
    shift: (t, c) => pan(t, [-25, -36], [[c[1], 0, -8]], 0.5),
    subs: [
      {
        text: "Callback tools run on the user's own device, and typed React and Svelte SDKs power your product UI.",
        after: 0.6,
      },
      {
        text: "Durable, observable, composable agents with human approvals, built with the AI SDKs you already use.",
        after: 0.6,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);

      // callback tool: the agent asks the user's laptop to read a local file
      s.lblL = E(root, 'Callback tools', 'lbl');
      s.app = makeAppTile(root);
      s.arrow = arrowPath(s.svg, `M ${LEFT.x} ${ARROW.top} L ${LEFT.x} ${ARROW.bottom}`, C.slate, 2.5, '8,8');
      s.laptop = makeStep(root, 'laptop', "User's laptop", 300, 150);
      // opaque pill colors, so the dashed arrow does not show through the cards traveling on it
      s.call = callCard(root, 'read_file', '"trip.md"', 'violet');
      s.call.style.background = OPAQUE.violet;
      s.result = callCard(root, 'result', '"Lisbon, 3 nights"', 'uv');
      s.result.style.background = OPAQUE.uv;

      // the product UI, built with the typed React or Svelte SDK
      s.lblR = E(root, 'Your UI', 'lbl');
      s.planner = makePlanner(root);
      s.link = arrowPath(s.svg, `M ${LINK.from} ${LINK.y} L ${LINK.to} ${LINK.y}`, C.uv, 3);
      s.linkL = E(root, 'Typed session', 'lbl', { fontSize: '18px', color: C.ink });
      s.pulse = E(root, '', '', {
        width: '14px', height: '14px', background: C.uv, borderRadius: '3px',
        boxShadow: '0 0 14px 4px rgba(68,76,231,.6)',
      });
      s.sdks = ['React', 'Svelte'].map(name => tag(root, name, 'uv'));

      // recap
      s.recap = RECAP.map(([icon, label]) => iconTile(root, icon, label, 330, 210));
    },
    update(t, c, s) {
      const out = 1 - P(t, c[1], 0.5);
      const pop = at => P(t, c[0] + at, 0.45, backOut);

      // ---- c[0], left: the call travels to the laptop, which runs it and sends the result back
      place(s.lblL, LEFT.x, LEFT.labelY, 1, P(t, c[0] + 0.1, 0.4) * out);
      const appIn = pop(0.1);
      place(s.app, LEFT.x, LEFT.appY, appIn, clamp(appIn * 2) * out);
      const laptopIn = pop(0.3);
      place(s.laptop, LEFT.x, LEFT.laptopY, laptopIn, clamp(laptopIn * 2) * out);
      stepState(s.laptop, t >= c[0] + 2.8 ? 2 : t >= c[0] + 2.0 ? 1 : 0);
      draw(s.arrow, P(t, c[0] + 0.6, 0.4), out);
      fly(s.call, t, c[0] + 1.0, LEFT.x, ARROW.top + 30, c[0] + 1.2, 0.7, LEFT.x, ARROW.bottom - 30,
        c[0] + 1.95, LEFT.x, LEFT.laptopY);
      fly(s.result, t, c[0] + 2.8, LEFT.x, ARROW.bottom - 30, c[0] + 3.0, 0.6, LEFT.x, ARROW.top + 30,
        c[0] + 3.65, LEFT.x, LEFT.appY);

      // ---- c[0], right: the trip planner UI, then its typed session with the agent
      const uiIn = pop(3.4);
      place(s.lblR, UI.x, LEFT.labelY, 1, P(t, c[0] + 3.4, 0.4) * out);
      place(s.planner, UI.x, UI.y, uiIn, clamp(uiIn * 2) * out);
      s.planner.rows.forEach((row, i) => showRow(row, P(t, c[0] + 3.8 + i * 0.2, 0.35), 24));
      s.planner.foot.style.opacity = P(t, c[0] + 4.4, 0.35);
      draw(s.link, P(t, c[0] + 4.6, 0.5), out);
      place(s.linkL, (LINK.from + LINK.to) / 2, LINK.y - 30, 1, P(t, c[0] + 4.9, 0.35) * out);
      // session traffic: a pulse runs along the link once it is drawn
      const pulseStart = c[0] + 5.1;
      const lap = ((t - pulseStart) % 1.1) / 1.1;
      const pulseOn = t >= pulseStart ? Math.sin(Math.PI * lap) : 0;
      place(s.pulse, lerp(LINK.from + 10, LINK.to - 16, lap), LINK.y, 1, pulseOn * out);
      s.sdks.forEach((e, i) => {
        const p = pop(5.4 + i * 0.2);
        place(e, UI.x - 90 + i * 180, UI.tagY, p, clamp(p * 2) * out);
      });

      // ---- c[1]: the recap, one tile per feature, as the subtitle names them; each lights up as it lands
      s.recap.forEach((e, i) => {
        const at = c[1] + RECAP_AT[i];
        const p = P(t, at, 0.45, backOut);
        place(e, recapX(i), recapY(i), p, clamp(p * 2));
        e.style.borderColor = t >= at && t < at + 1.0 ? C.uv : C.line;
      });
    }
  });
}
