// ===================== 7. BUILT FOR REAL PRODUCTS
// The block keeps every name declared in this file local to this scene.
{
  // Layout grid: the callback column spans x 140-580, the UI window x 800-1780 (same right zone as chapter 6);
  // the typed session link crosses the gap between them. Both headings share one baseline; both zones start at
  // y 196 and end at y 890 (the laptop tile, the SDK row).
  const TOP = 196, BOTTOM = 890, HEADING_Y = 163;
  // Left: the app (agent on a Temporal worker) calls a tool that runs on the user's laptop
  const LEFT = { x: 360, w: 440, appH: 260, laptopH: 170 };
  LEFT.appY = TOP + LEFT.appH / 2;
  LEFT.laptopY = BOTTOM - LEFT.laptopH / 2;
  const ARROW = { top: TOP + LEFT.appH + 10, bottom: BOTTOM - LEFT.laptopH - 10 };
  // Right: the product UI, linked to the agent by a typed session, and the SDKs it is built with
  const UI = { x: 1290, w: 980, h: 606, tagH: 48 };
  UI.y = TOP + UI.h / 2;
  const LINK = { y: LEFT.appY, from: LEFT.x + LEFT.w / 2 + 4, to: UI.x - UI.w / 2 - 4 };
  // Recap tiles, in the order of the subtitle: 3 columns x 2 rows across the frame, 40 px gutters
  const RECAP = [
    ['retry', 'Survives crashes'], ['stream', 'Event stream'], ['layers', 'Typed subagents'],
    ['user', 'Human approvals'], ['code', 'Code Mode'], ['agent', 'Your AI SDK'],
  ];
  const RECAP_AT = [0.6, 1.2, 1.9, 3.0, 3.9, 4.9];
  const TILE = { w: 520, h: 240, gap: 40 };
  const recapX = i => 140 + TILE.w / 2 + (i % 3) * (TILE.w + TILE.gap);
  const recapY = i => 522 + (Math.floor(i / 3) - 0.5) * (TILE.h + TILE.gap);

  // the app tile: cloud header, the agent inside and where it runs
  const makeAppTile = p => E(p,
    '<div style="position:absolute;left:24px;top:20px;display:flex;align-items:center;gap:12px">'
    + ICON('cloud', 30, C.ink, 1.8)
    + '<span class="mono" style="font-size:20px;letter-spacing:.12em">THE APP</span></div>'
    + '<div style="position:absolute;left:0;right:0;top:80px;display:flex;flex-direction:column;align-items:center">'
    + ICON('agent', 72, C.violet, 1.8)
    + '<div class="mono" style="font-size:22px;letter-spacing:.12em;padding-left:.12em;margin-top:12px">AGENT</div>'
    + '<div style="font-size:24px;color:var(--slate);margin-top:8px">on a Temporal worker</div></div>',
    'tile', { width: LEFT.w + 'px', height: LEFT.appH + 'px', borderColor: C.violet });

  // one itinerary row of the trip planner: icon, item and price
  const planRow = (icon, item, price) => '<div class="row" style="display:flex;align-items:center;gap:22px;'
    + `height:84px;padding:0 26px;border:1.5px solid ${C.line};border-radius:var(--rs);margin-top:18px;opacity:0">`
    + `${ICON(icon, 34, C.ink, 1.7)}<span style="flex:1;font-size:30px">${item}</span>`
    + `<span class="mono" style="font-size:28px;color:var(--slate)">${price}</span></div>`;
  // browser window holding a small trip planner (top bar with three dots, as makeApp)
  const makePlanner = p => {
    const e = E(p,
      `<div style="height:48px;border-bottom:1.5px solid ${C.line};display:flex;gap:10px;align-items:center;`
      + 'padding-left:20px"><i></i><i></i><i></i></div>'
      + '<div style="padding:34px 44px">'
      + '<div style="font-size:52px;line-height:1.15">Lisbon, 3 nights</div>'
      + '<div class="lbl" style="font-size:18px;padding-left:0;margin-top:8px">Trip planner</div>'
      + planRow('plane', 'Flight to Lisbon', '$480')
      + planRow('bed', 'Hotel in Alfama', '$390')
      + planRow('ticket', 'Tram 28 tour', '$25')
      + '<div class="foot" style="display:flex;align-items:center;justify-content:space-between;margin-top:30px;'
      + 'opacity:0"><span class="mono" style="font-size:28px;color:var(--slate)">TOTAL <span style="color:var(--ink)">'
      + '$895</span></span><span style="font-size:28px;background:var(--uv);padding:14px 48px;'
      + 'border-radius:var(--rs)">Book</span></div></div>',
      'tile', { width: UI.w + 'px', height: UI.h + 'px', textAlign: 'left', overflow: 'hidden' });
    e.querySelectorAll('i').forEach(dot => Object.assign(dot.style, {
      width: '12px', height: '12px', background: C.slate, opacity: 0.6, borderRadius: '2px',
    }));
    e.rows = [...e.querySelectorAll('.row')];
    e.foot = e.querySelector('.foot');
    return e;
  };
  // recap tile: a large icon over its label, centered (iconTile, at the size of this grid)
  const makeRecapTile = (p, icon, label) => E(p,
    ICON(icon, 76, C.ink)
    + '<div class="mono" style="font-size:26px;letter-spacing:.1em;padding-left:.1em;text-transform:uppercase;'
    + `margin-top:20px">${label}</div>`,
    'tile', {
      width: TILE.w + 'px', height: TILE.h + 'px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    });

  scene({
    chapter: 7, title: 'Built for real products',
    // laid out at final stage coordinates on the grid: both phases are centered near (960, 521)
    shift: [0, 0],
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
      s.laptop = makeStep(root, 'laptop', "User's laptop", LEFT.w, LEFT.laptopH);
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
      // the typed SDKs: one row centered under the window
      s.sdkRow = E(root,
        '<span class="lbl" style="font-size:18px;padding-left:0">Typed SDKs</span>'
        + '<span class="pill uv">React</span><span class="pill uv">Svelte</span>',
        '', { height: UI.tagH + 'px', display: 'flex', alignItems: 'center', gap: '24px' });
      s.sdks = [...s.sdkRow.querySelectorAll('.pill')];

      // recap
      s.recap = RECAP.map(([icon, label]) => makeRecapTile(root, icon, label));
    },
    update(t, c, s) {
      const out = 1 - P(t, c[1], 0.5);
      const pop = at => P(t, c[0] + at, 0.45, backOut);

      // ---- c[0], left: the call travels to the laptop, which runs it and sends the result back
      place(s.lblL, LEFT.x, HEADING_Y, 1, P(t, c[0] + 0.1, 0.4) * out);
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
      place(s.lblR, UI.x, HEADING_Y, 1, P(t, c[0] + 3.4, 0.4) * out);
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
      place(s.sdkRow, UI.x, BOTTOM - UI.tagH / 2, 1, P(t, c[0] + 5.3, 0.35) * out);
      s.sdks.forEach((e, i) => {
        const p = pop(5.4 + i * 0.2);
        e.style.transform = `scale(${p})`;
        e.style.opacity = clamp(p * 2);
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
