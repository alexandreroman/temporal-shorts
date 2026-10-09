// ===================== 7. CALLBACK TOOLS
// The block keeps every name declared in this file local to this scene.
{
  // Layout grid: one column centered on the stage (x 740-1180), from the app tile down to the laptop tile; it
  // starts at y 196 and ends at y 880, as the zones of chapter 6. The chapter title names it, so it has no heading.
  const TOP = 196, BOTTOM = 880;
  // The app (agent on a Temporal worker) calls a tool that runs where it can't reach, on the user's laptop: the
  // laptop tile sits under the app, at the column width
  const COL = { x: 960, w: 440, appH: 260, laptopH: 170 };
  COL.appY = TOP + COL.appH / 2;
  COL.laptopY = BOTTOM - COL.laptopH / 2;
  // the dashed request line, straight down from the app to the laptop
  const ARROW = { top: TOP + COL.appH + 10, bottom: BOTTOM - COL.laptopH - 10 };
  // the durable wait card slides out from under the app tile, 12 px below it, over the line
  const WAIT = { h: 124 };
  WAIT.y = TOP + COL.appH + 12 + WAIT.h / 2;
  // the agent icon in the app tile, and the pause badge 16 px right of it while the agent waits
  const AGENT_ICON = { size: 72, y: TOP + 80 + 36 };
  const PAUSE = { x: COL.x + AGENT_ICON.size / 2 + 16 + 22, y: AGENT_ICON.y };
  const WAITS = ['5 SEC', '1 MIN', '1 H', '9 H', '1 DAY', '2 DAYS'];

  // the app tile: cloud header, the agent inside and where it runs; e.agent holds the agent icon, which dims while
  // the agent waits
  const makeApp = p => {
    const e = E(p,
      '<div style="position:absolute;left:24px;top:20px;display:flex;align-items:center;gap:12px">'
      + ICON('cloud', 30, C.ink, 1.8)
      + '<span class="mono" style="font-size:20px;letter-spacing:.12em">THE APP</span></div>'
      + '<div style="position:absolute;left:0;right:0;top:80px;display:flex;flex-direction:column;align-items:center">'
      + `<div class="agent">${ICON('agent', AGENT_ICON.size, C.violet, 1.8)}</div>`
      + '<div class="mono" style="font-size:22px;letter-spacing:.12em;padding-left:.12em;margin-top:12px">AGENT</div>'
      + '<div style="font-size:24px;color:var(--slate);margin-top:8px">on a Temporal worker</div></div>',
      'tile', { width: COL.w + 'px', height: COL.appH + 'px', borderColor: C.violet });
    e.agent = e.querySelector('.agent');
    return e;
  };

  scene({
    chapter: 7, title: 'Callback tools',
    // the chapter header reads before the first subtitle; the final composition holds before the fade
    pre: 1.5, post: 2.0,
    // laid out at final positions, centered on the stage, so no offset is needed
    subs: [
      {
        text: "<b>Callback tools</b> run where the agent can't reach, like the user's laptop or a private network.",
        after: 0.3,
      },
      {
        text: 'The agent waits durably for the result, for seconds or days, without tying up compute.',
        // the result is back in the app at c[1] + 5.7; post then holds it
        after: 0.3,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);

      // callback tool: the agent asks the user's laptop to read a local file, then waits durably for the result
      s.app = makeApp(root);
      s.arrow = path(s.svg, `M ${COL.x} ${ARROW.top} L ${COL.x} ${ARROW.bottom}`, C.slate, 2.5, true, '8,8');
      s.laptop = makeStep(root, 'laptop', "User's laptop", COL.w, COL.laptopH);
      // durable wait: a clock racing through the waiting time (as in chapter 3), and the worker left free
      s.wait = makeWaitCard(root, COL.w, WAIT.h, { gap: 8 });
      // in the card's flow, under the clock
      s.free = statusTag(s.wait);
      Object.assign(s.free.style, { position: 'relative', marginTop: '12px' });
      s.pause = makePauseBadge(root);
      // opaque pill colors, so the dashed arrow does not show through the cards traveling on it
      s.call = callCard(root, 'read_file', '"trip.md"', 'violet solid');
      s.result = callCard(root, 'result', '"Lisbon, 3 nights"', 'uv solid');
    },
    update(t, c, s) {
      // ---- c[0]: the app and the laptop it can't reach; the call travels down to the laptop, which runs it
      const appIn = backPop(t, c[0] + 0.2, 0.5);
      place(s.app, COL.x, COL.appY, appIn.s, appIn.o);
      const laptopIn = backPop(t, c[0] + 0.6, 0.5);
      place(s.laptop, COL.x, COL.laptopY, laptopIn.s, laptopIn.o);
      // the laptop runs the tool from the call's arrival until just before the result leaves (in c[1])
      const resultAt = c[1] + 4.5;
      stepState(s.laptop, t >= resultAt - 0.1 ? 2 : t >= c[0] + 3.3 ? 1 : 0);
      draw(s.arrow, P(t, c[0] + 1.0, 0.7));
      // down the line, then into the laptop
      fly(s.call, t, c[0] + 1.9, COL.x, ARROW.top + 30, c[0] + 2.2, 0.6, COL.x, ARROW.bottom - 30,
        c[0] + 2.9, COL.x, COL.laptopY);

      // ---- c[1]: the agent waits durably, the worker free (the agent icon dims), while the clock races from
      // seconds to days; then the card slides back and the result comes up the line into the app
      const waitIn = P(t, c[1] + 0.3, 0.4) * (1 - P(t, resultAt - 0.3, 0.3));
      s.app.agent.style.opacity = 1 - 0.6 * waitIn;
      s.app.style.borderColor = waitIn > 0.5 ? C.line : C.violet;
      const pp = backPop(t, c[1] + 0.3);
      place(s.pause, PAUSE.x, PAUSE.y, pp.s, pp.o * (1 - P(t, resultAt - 0.3, 0.3)));
      place(s.wait, COL.x, WAIT.y - 12 * (1 - waitIn), 1, waitIn);
      setWaitRace(s.wait, WAITS, clamp((t - c[1] - 1.0) / 2.8));
      setStatus(s.free, 'NO COMPUTE HELD', 'ok');
      popScale(s.free, backPop(t, c[1] + 1.5, 0.5));
      fly(s.result, t, resultAt, COL.x, ARROW.bottom - 30, resultAt + 0.3, 0.8, COL.x, ARROW.top + 30,
        resultAt + 1.2, COL.x, COL.appY);
    }
  });
}
