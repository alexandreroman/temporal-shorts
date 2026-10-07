// ===================== 4. WHY IT MATTERS FOR AI
// The block keeps every name declared in this file local to this scene.
{
  // The agentic loop on the left (think, act, observe, as in durable-ai-agents), the bill and the progress on the
  // right; the AI companies take the place of the bill once the loop is durable
  const LOOP = { cx: 560, cy: 540 };
  const WAIT_Y = LOOP.cy + 275; // the "waits for a person" tag, under the loop
  const PANEL = { x: 560, y: 520, w: 800, h: 740 };
  const SIDE = { x: 1460, w: 560 };
  const BILL_Y = 380, PROGRESS_Y = 610;
  const TOTAL_STEPS = 6;
  const TRACK_W = 370; // progress bar track, in px: the fill rests on whole pixels
  const COMPANIES = ['OpenAI · Codex', 'Cursor', 'Lovable', 'Replit'];
  const COMPANY = { y0: 370, gap: 80, w: SIDE.w };

  // Progress tile: a label, a bar that fills step by step and an "n / 6" count
  function makeProgress(root) {
    const e = E(root,
      '<div class="lbl" style="font-size:16px;padding-left:0">Agent progress</div>'
      + '<div style="display:flex;align-items:center;gap:20px;margin-top:18px">'
      + `<div style="width:${TRACK_W}px;height:18px;border-radius:4px;background:rgba(248,250,252,.08);`
      + 'overflow:hidden">'
      + '<div class="fill" style="height:100%;width:0"></div></div>'
      + '<div class="count mono" style="font-size:26px;width:110px;text-align:right;white-space:nowrap">0 / 6</div>'
      + '</div>'
      + '<div class="lost mono" style="font-size:18px;letter-spacing:.12em;color:var(--red);margin-top:14px;opacity:0">'
      + 'PROGRESS LOST</div>',
      'tile', { width: SIDE.w + 'px', textAlign: 'left', padding: '18px 24px 16px' });
    e.fill = e.querySelector('.fill'); e.count = e.querySelector('.count'); e.lost = e.querySelector('.lost');
    return e;
  }

  scene({
    chapter: 4, title: 'Why it matters for AI',
    // the loop and the bill, then the durable loop and the companies: the pan runs as the bill fades out
    shift: (t, c) => pan(t, [-62, 14], [[c[2] + 0.2, 10, 0]], 0.6),
    subs: [
      {
        text: "AI agents are long processes too: many LLM calls, tools to run, and waits for a person.",
        after: 0.4,
      },
      {
        text: "Every LLM call costs time and money. Without Durable Execution, a crash means starting over.",
        after: 0.8,
      },
      { text: "OpenAI built Codex on Temporal, and Cursor, Lovable and Replit rely on it too.", after: 1.2 },
    ],
    build(root, s) {
      // built first, so the loop and its arcs sit on top of it
      s.temporal = makeTemporalPanel(root, PANEL.w, PANEL.h, {
        logoAt: [24, 20], noteAt: [24, 25], font: 18, note: 'Durable agent',
      });
      s.svg = svgLayer(root);
      s.loop = makeAgentLoop(root, s.svg, LOOP.cx, LOOP.cy);
      // the same arcs in red, shown over the slate ones while the agent has crashed
      s.redArcs = s.loop.arcPaths.map(d => path(s.svg, d, C.red, 2.5));
      s.wait = E(root, `${ICON('user', 22, C.violet, 2)}<span>Waits for a person</span>`, 'pill violet', {
        display: 'flex', alignItems: 'center', gap: '10px',
      });
      s.over = E(root, 'Start<br>over', 'lbl', {
        textAlign: 'center', color: 'var(--red)', fontSize: '24px', lineHeight: 1.4,
      });

      s.bill = makeCounter(root, 'LLM calls billed', SIDE.w);
      s.bill.note.style.color = C.red;
      s.progress = makeProgress(root);
      s.flash = makeFlash(root);

      s.builtOn = E(root, 'Built on Temporal', 'lbl');
      s.companies = COMPANIES.map(name => {
        const e = tag(root, name);
        Object.assign(e.style, { width: COMPANY.w + 'px', textAlign: 'center' });
        return e;
      });
    },
    update(t, c, s) {
      // each turn runs the loop once, think -> act -> observe, and bills one LLM call as it starts
      const firstRun = [c[0] + 1.6, c[0] + 3.8, c[1] + 0.2, c[1] + 2.4];
      const crashAt = c[1] + 3.5;
      const restart = c[1] + 4.6; // the agent starts over, from step 1
      const durable = c[2] + 0.2;
      const TURN = 2.0; // seconds per turn
      // the first run, the first turn after the restart, then a turn of the durable loop (not billed: the bill is gone)
      const turnStarts = [...firstRun, restart, c[2] + 0.9];
      const crashed = t >= crashAt && t < restart;
      const [sx, sy] = shakeAt(t, crashAt);

      // where the token is on the loop, in degrees from the top; null between turns and after the crash
      let deg = null;
      turnStarts.forEach(a => {
        if (t >= a && t < a + TURN && !crashed) deg = -90 + 360 * ease((t - a) / TURN);
      });

      const red = win(t, crashAt, restart, 0.25);
      placeAgentLoop(s.loop, t, c[0] + 0.1, {
        deg, centerAt: c[0] + 1.2, centerO: 1 - red, arcO: 1 - red, q: crashed ? P(t, crashAt + 0.3, 0.3) : 0,
        dx: sx, dy: sy,
      });
      s.redArcs.forEach(a => draw(a, 1, red));
      s.svg.style.transform = `translate(${sx}px,${sy}px)`;
      place(s.over, LOOP.cx + sx, LOOP.cy + sy, 1, red);
      // the agent also waits for a person: said in the first subtitle
      const wp = P(t, c[0] + 4.2, 0.45, backOut);
      place(s.wait, LOOP.cx, WAIT_Y, wp, clamp(wp * 2) * (1 - P(t, c[1] + 0.2, 0.4)));

      // the bill keeps adding up: the calls made again after the crash are paid a second time
      const calls = turnStarts.slice(0, firstRun.length + 1).filter(a => t >= a).length;
      const paidAgain = calls - firstRun.length;
      s.bill.n.textContent = calls;
      s.bill.n.style.color = paidAgain > 0 ? C.red : C.ink;
      s.bill.note.textContent = paidAgain > 0 ? `+${paidAgain} PAID AGAIN` : '';
      // the bill stands out while the subtitle says what each call costs
      s.bill.style.borderColor = win(t, c[1] + 0.2, c[1] + 2.4, 0.3) > 0.5 ? C.violet : C.line;
      const sideOut = P(t, durable, 0.4);
      rise(s.bill, SIDE.x + sx, BILL_Y + sy, P(t, c[0] + 0.6, 0.5) * (1 - sideOut));

      // progress: one step per completed turn; the crash drains it, then the first step is done again
      const stepsBefore = at => firstRun.filter(a => at >= a + TURN).length;
      let steps, fill;
      if (t < crashAt) {
        steps = stepsBefore(t);
        fill = steps;
      } else {
        steps = t >= restart + TURN ? 1 : 0;
        fill = lerp(stepsBefore(crashAt), 0, P(t, crashAt + 0.2, 0.5)) + P(t, restart + TURN, 0.3);
      }
      s.progress.count.textContent = `${steps} / ${TOTAL_STEPS}`;
      s.progress.fill.style.width = Math.round(fill / TOTAL_STEPS * TRACK_W) + 'px';
      s.progress.fill.style.background = crashed ? C.red : `linear-gradient(90deg, ${C.violet}, ${C.uv})`;
      s.progress.lost.style.opacity = win(t, crashAt + 0.3, c[2], 0.3);
      s.progress.style.borderColor = crashed ? C.red : C.line;
      rise(s.progress, SIDE.x + sx, PROGRESS_Y + sy, P(t, c[0] + 0.8, 0.5) * (1 - sideOut));
      placeFlash(s.flash, t, crashAt);

      // the loop becomes durable with Temporal, then the companies that build on it
      place(s.temporal, PANEL.x, PANEL.y, 1, P(t, durable, 0.5));
      rise(s.builtOn, SIDE.x, COMPANY.y0 - 70, P(t, durable + 0.5, 0.5), 12);
      const companyIn = [c[2] + 0.8, c[2] + 2.6, c[2] + 3.0, c[2] + 3.4];
      s.companies.forEach((e, i) => {
        const p = P(t, companyIn[i], 0.45, backOut);
        place(e, SIDE.x, COMPANY.y0 + i * COMPANY.gap, p, clamp(p * 2));
      });
    }
  });
}
