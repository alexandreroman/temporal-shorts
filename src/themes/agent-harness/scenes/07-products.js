// ===================== 7. CALLBACK TOOLS, TYPED SESSIONS
// The block keeps every name declared in this file local to this scene.
{
  // Layout grid: the callback column spans x 140-580, the UI window x 800-1780 (same right zone as chapter 6);
  // the typed session link crosses the gap between them. That 220 px gap is wider than the 80-120 px zone
  // gutter on purpose: it holds the TYPED SESSION label above the link. Both headings share one baseline; both
  // zones start at y 196 and end at y 880 (the laptop tile, the SDK row).
  const TOP = 196, BOTTOM = 880, HEADING_Y = 163;
  // Left: the app (agent on a Temporal worker) calls a tool that runs where it can't reach, on the user's laptop:
  // the laptop tile sits under the app, at the column width
  const LEFT = { x: 360, w: 440, appH: 260, laptopH: 170 };
  LEFT.appY = TOP + LEFT.appH / 2;
  LEFT.laptopY = BOTTOM - LEFT.laptopH / 2;
  // the dashed request line, straight down from the app to the laptop
  const ARROW = { top: TOP + LEFT.appH + 10, bottom: BOTTOM - LEFT.laptopH - 10 };
  // the durable wait card slides out from under the app tile, 12 px below it, over the line
  const WAIT = { h: 124 };
  WAIT.y = TOP + LEFT.appH + 12 + WAIT.h / 2;
  // the agent icon in the app tile, and the pause badge 16 px right of it while the agent waits
  const AGENT_ICON = { size: 72, y: TOP + 80 + 36 };
  const PAUSE = { x: LEFT.x + AGENT_ICON.size / 2 + 16 + 22, y: AGENT_ICON.y };
  const WAITS = ['5 SEC', '1 MIN', '1 H', '9 H', '1 DAY', '2 DAYS'];
  // Right: the product UI, linked to the agent by a typed session, and the SDKs it is built with, 40 px below it
  const UI = { x: 1290, w: 980, h: 596, tagH: 48 };
  UI.y = TOP + UI.h / 2;
  const LINK = { y: LEFT.appY, from: LEFT.x + LEFT.w / 2 + 4, to: UI.x - UI.w / 2 - 4 };

  // the app tile: cloud header, the agent inside and where it runs
  const makeAppTile = p => E(p,
    '<div style="position:absolute;left:24px;top:20px;display:flex;align-items:center;gap:12px">'
    + ICON('cloud', 30, C.ink, 1.8)
    + '<span class="mono" style="font-size:20px;letter-spacing:.12em">THE APP</span></div>'
    + '<div style="position:absolute;left:0;right:0;top:80px;display:flex;flex-direction:column;align-items:center">'
    + `<div class="agent">${ICON('agent', AGENT_ICON.size, C.violet, 1.8)}</div>`
    + '<div class="mono" style="font-size:22px;letter-spacing:.12em;padding-left:.12em;margin-top:12px">AGENT</div>'
    + '<div style="font-size:24px;color:var(--slate);margin-top:8px">on a Temporal worker</div></div>',
    'tile', { width: LEFT.w + 'px', height: LEFT.appH + 'px', borderColor: C.violet });
  // the app tile, with a handle on its agent icon, which dims while the agent waits
  const makeApp = p => {
    const e = makeAppTile(p);
    e.agent = e.querySelector('.agent');
    return e;
  };

  // one itinerary row of the trip planner: icon, item and price
  const planRow = (icon, item, price) => '<div class="row" style="display:flex;align-items:center;gap:22px;'
    + `height:84px;padding:0 26px;border:1.5px solid ${C.line};border-radius:var(--rs);margin-top:16px;opacity:0">`
    + `${ICON(icon, 34, C.ink, 1.7)}<span style="flex:1;font-size:30px">${item}</span>`
    + `<span class="mono" style="font-size:28px;color:var(--slate)">${price}</span></div>`;
  // browser window holding a small trip planner (top bar with three dots, as makeApp)
  const makePlanner = p => {
    const e = E(p,
      `<div style="height:48px;border-bottom:1.5px solid ${C.line};display:flex;gap:10px;align-items:center;`
      + 'padding-left:20px"><i></i><i></i><i></i></div>'
      + '<div style="padding:30px 44px">'
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

  scene({
    chapter: 7, title: 'Callback tools, typed sessions',
    // the chapter header reads before the first subtitle; the final composition holds before the fade
    pre: 1.5, post: 2.0,
    // laid out at final stage coordinates on the grid (centered near (960, 521)); while the callback column
    // stands alone (c[0] and c[1]) the camera centers it, then eases back as the UI window enters
    shift: (t, c) => pan(t, [600, 0], [[c[2], 0, 0]], 1.0),
    subs: [
      {
        text: "<b>Callback tools</b> run where the agent can't reach, like the user's laptop or a private network.",
        after: 0.3,
      },
      {
        text: 'The agent waits durably for the result, for seconds or days, without tying up compute.',
        // the result is back in the app at c[1] + 5.7 and reads for 2 s before the UI window enters
        after: 1.55,
      },
      {
        text: "Typed React and Svelte SDKs turn your agent into a live, typed session inside your product UI.",
        // the SDK pills land at c[2] + 5.9 and read for 2 s before the window ends; post then holds the final
        // composition
        after: 1.2,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);

      // callback tool: the agent asks the user's laptop to read a local file, then waits durably for the result
      s.lblL = E(root, 'Callback tools', 'lbl');
      s.app = makeApp(root);
      s.arrow = path(s.svg, `M ${LEFT.x} ${ARROW.top} L ${LEFT.x} ${ARROW.bottom}`, C.slate, 2.5, true, '8,8');
      s.laptop = makeStep(root, 'laptop', "User's laptop", LEFT.w, LEFT.laptopH);
      // durable wait: a clock racing through the waiting time (as in chapter 3), and the worker left free
      s.wait = E(root,
        '<div class="lbl" style="font-size:16px">Durable wait</div>'
        + '<div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-top:8px">'
        + `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${C.violet}" stroke-width="1.8"`
        + ' stroke-linecap="square" style="display:block"><circle cx="12" cy="12" r="9"/>'
        + '<path class="mh" d="M12 12V5.5"/><path class="hh" d="M12 12h4"/></svg>'
        + `<span class="mono" style="font-size:22px;letter-spacing:.06em;color:${C.violet}">WAITING `
        + '<span class="d" style="display:inline-block;min-width:6.6ch;text-align:left"></span></span></div>',
        'tile', {
          width: LEFT.w + 'px', height: WAIT.h + 'px', borderColor: C.violet,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        });
      s.waitD = s.wait.querySelector('.d');
      s.minute = s.wait.querySelector('.mh'); s.hour = s.wait.querySelector('.hh');
      // in the card's flow, under the clock
      s.free = statusTag(s.wait);
      Object.assign(s.free.style, { position: 'relative', marginTop: '12px' });
      s.pause = E(root, ICON('pause', 22, C.violet, 1.8), '', {
        width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--violet-solid)', border: '1.5px solid ' + C.violet, borderRadius: 'var(--rs)',
      });
      // opaque pill colors, so the dashed arrow does not show through the cards traveling on it
      s.call = callCard(root, 'read_file', '"trip.md"', 'violet solid');
      s.result = callCard(root, 'result', '"Lisbon, 3 nights"', 'uv solid');

      // the product UI, built with the typed React or Svelte SDK
      s.lblR = E(root, 'Your UI', 'lbl');
      s.planner = makePlanner(root);
      s.link = path(s.svg, `M ${LINK.from} ${LINK.y} L ${LINK.to} ${LINK.y}`, C.uv, 3, true);
      s.linkL = E(root, 'Typed session', 'lbl', { fontSize: '18px', color: C.ink });
      s.pulse = E(root, '', '', {
        width: '14px', height: '14px', background: C.uv, borderRadius: '3px',
        boxShadow: '0 0 14px 4px rgba(68,76,231,.6)',
      });
      // the typed SDKs: one row centered under the window, in a box of fixed even width so it rests on whole
      // pixels (its content is about 428 px wide)
      s.sdkRow = E(root,
        '<span class="lbl" style="font-size:18px;padding-left:0">Typed SDKs</span>'
        + '<span class="pill uv">React</span><span class="pill uv">Svelte</span>',
        '', {
          width: '440px', height: UI.tagH + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '24px',
        });
      s.sdks = [...s.sdkRow.querySelectorAll('.pill')];
    },
    update(t, c, s) {
      const pop = at => P(t, at, 0.5, backOut);

      // ---- c[0]: the app and the laptop it can't reach; the call travels down to the laptop, which runs it
      place(s.lblL, LEFT.x, HEADING_Y, 1, P(t, c[0] + 0.1, 0.4));
      const appIn = pop(c[0] + 0.2);
      place(s.app, LEFT.x, LEFT.appY, appIn, clamp(appIn * 2));
      const laptopIn = pop(c[0] + 0.6);
      place(s.laptop, LEFT.x, LEFT.laptopY, laptopIn, clamp(laptopIn * 2));
      // the laptop runs the tool from the call's arrival until just before the result leaves (in c[1])
      const resultAt = c[1] + 4.5;
      stepState(s.laptop, t >= resultAt - 0.1 ? 2 : t >= c[0] + 3.3 ? 1 : 0);
      draw(s.arrow, P(t, c[0] + 1.0, 0.7));
      // down the line, then into the laptop
      fly(s.call, t, c[0] + 1.9, LEFT.x, ARROW.top + 30, c[0] + 2.2, 0.6, LEFT.x, ARROW.bottom - 30,
        c[0] + 2.9, LEFT.x, LEFT.laptopY);

      // ---- c[1]: the agent waits durably, the worker free (the agent icon dims), while the clock races from
      // seconds to days; then the card slides back and the result comes up the line into the app
      const waitIn = P(t, c[1] + 0.3, 0.4) * (1 - P(t, resultAt - 0.3, 0.3));
      s.app.agent.style.opacity = 1 - 0.6 * waitIn;
      s.app.style.borderColor = waitIn > 0.5 ? C.line : C.violet;
      const pp = P(t, c[1] + 0.3, 0.45, backOut);
      place(s.pause, PAUSE.x, PAUSE.y, pp, clamp(pp * 2) * (1 - P(t, resultAt - 0.3, 0.3)));
      place(s.wait, LEFT.x, WAIT.y - 12 * (1 - waitIn), 1, waitIn);
      const race = clamp((t - c[1] - 1.0) / 2.8);
      s.waitD.textContent = WAITS[Math.min(WAITS.length - 1, Math.floor(race * WAITS.length))];
      s.minute.setAttribute('transform', `rotate(${race * 360 * 12} 12 12)`);
      s.hour.setAttribute('transform', `rotate(${race * 360} 12 12)`);
      setStatus(s.free, 'NO COMPUTE HELD', 'ok');
      const freeIn = pop(c[1] + 1.5);
      s.free.style.transform = `scale(${freeIn})`;
      s.free.style.opacity = clamp(freeIn * 2);
      fly(s.result, t, resultAt, LEFT.x, ARROW.bottom - 30, resultAt + 0.3, 0.8, LEFT.x, ARROW.top + 30,
        resultAt + 1.2, LEFT.x, LEFT.appY);

      // ---- c[2]: the trip planner UI, then its typed session with the agent and the SDKs it is built with
      const uiIn = pop(c[2] + 0.5);
      place(s.lblR, UI.x, HEADING_Y, 1, P(t, c[2] + 0.5, 0.5));
      place(s.planner, UI.x, UI.y, uiIn, clamp(uiIn * 2));
      s.planner.rows.forEach((row, i) => showRow(row, P(t, c[2] + 1.2 + i * 0.4, 0.4), 24));
      s.planner.foot.style.opacity = P(t, c[2] + 2.5, 0.4);
      draw(s.link, P(t, c[2] + 3.2, 0.6));
      place(s.linkL, (LINK.from + LINK.to) / 2, LINK.y - 30, 1, P(t, c[2] + 3.6, 0.4));
      // session traffic: once the link is drawn, a pulse runs along it in an endless loop. It starts on the story
      // clock t but runs its laps on the ambient clock, which equals t in frozen frames
      const pulseStart = c[2] + 3.9, pulseLap = 1.4;
      const lap = ((ambientTime(this) - pulseStart) % pulseLap) / pulseLap;
      const pulseOn = t >= pulseStart ? Math.sin(Math.PI * lap) : 0;
      place(s.pulse, lerp(LINK.from + 10, LINK.to - 16, lap), LINK.y, 1, pulseOn);
      place(s.sdkRow, UI.x, BOTTOM - UI.tagH / 2, 1, P(t, c[2] + 5.0, 0.4));
      s.sdks.forEach((e, i) => {
        const p = pop(c[2] + 5.1 + i * 0.3);
        e.style.transform = `scale(${p})`;
        e.style.opacity = clamp(p * 2);
      });
    }
  });
}
