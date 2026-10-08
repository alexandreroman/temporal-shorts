// ===================== 4. WHY IT MATTERS FOR AI
// The block keeps every name declared in this file local to this scene.
{
  // The agentic loop on the left (think, act, observe, as in durable-ai-agents), the bill and the progress on the
  // right; the AI companies take the place of the bill once the loop is durable
  const LOOP = AGENT_LOOP;
  const LLM_AT = { x: LOOP.cx, y: LOOP.cy - LOOP.r }; // the THINK node, where the carried glow condenses
  const WAIT_Y = LOOP.cy + 275; // the "waits for a person" tag, under the loop
  const PANEL = { x: 560, y: 520, w: 800, h: 740 };
  const SIDE = { x: 1460, w: 560 };
  const BILL_Y = 380, PROGRESS_Y = 610;
  const TOTAL_STEPS = 6;
  const COMET = 6; // sparks trailing the token
  const SHARDS_PER_ARC = 4; // the pieces each arc breaks into at the crash
  const RING_R = 338; // the Temporal ring that wraps the durable loop
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
    fadeIn: 0.001, // a hard cut: the previous chapter ends on this chapter's first frame
    // the loop and the bill, then the durable loop and the companies: the pan runs as the bill fades out
    shift: (t, c) => pan(t, AGENT_START.shift, [[c[2] + 0.2, 10, 0]], 0.6),
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
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // the halo the LLM node arrives with from the previous chapter, which settles into the LLM's own glow
      s.carry = E(root, '', '', {
        width: HANDOFF_HALO.size + 'px', height: HANDOFF_HALO.size + 'px', borderRadius: '50%',
        background: HALO_BACKGROUND,
      });
      // built first, so the loop and its arcs sit on top of it
      s.temporal = makeTemporalPanel(root, PANEL.w, PANEL.h, {
        logoAt: [24, 20], noteAt: [24, 25], font: 18, note: 'Durable agent',
      });
      s.svg = svgLayer(root);
      s.loop = makeAgentLoop(root, s.svg, LOOP.cx, LOOP.cy, LOOP.r);
      // the same blink as the orb the previous chapter's AI hub turned into
      s.loop.think.seed = AGENT_LLM.seed;
      // at the crash the loop shatters: each arc breaks into red pieces that fall, then fly back at the restart
      const { think, act, observe } = LOOP_DEG;
      const arcEnds = [[think + 27, act - 27], [act + 27, observe - 27], [observe + 27, think + 333]];
      s.shards = arcEnds.flatMap(([a0, a1], k) => Array.from({ length: SHARDS_PER_ARC }, (_, j) => {
        const from = lerp(a0, a1, j / SHARDS_PER_ARC) + 1.5, to = lerp(a0, a1, (j + 1) / SHARDS_PER_ARC) - 1.5;
        const [x0, y0] = s.loop.pos(from), [x1, y1] = s.loop.pos(to);
        const shard = path(s.svg, `M ${x0} ${y0} A 220 220 0 0 1 ${x1} ${y1}`, C.red, 2.5, false);
        const n = k * SHARDS_PER_ARC + j;
        Object.assign(shard, {
          mid: s.loop.pos((from + to) / 2), vx: (hash(n * 5) - 0.5) * 220, vy: -60 - hash(n * 5 + 1) * 160,
          spin: (hash(n * 5 + 2) - 0.5) * 300,
        });
        return shard;
      }));
      // the Temporal ring that forms around the durable loop, and a dashed ring turning on it
      const ring = r => `M ${LOOP.cx} ${LOOP.cy - r} A ${r} ${r} 0 1 1 ${LOOP.cx - 0.01} ${LOOP.cy - r}`;
      s.ring = path(s.svg, ring(RING_R), C.uv, 4, false);
      s.ring.style.filter = 'drop-shadow(0 0 10px rgba(68,76,231,.9))';
      s.ringDash = path(s.svg, ring(RING_R), C.violet, 2, false, '6 18');
      s.comet = Array.from({ length: COMET }, (_, k) => makeSpark(root, 16 - 2 * k, '219,255,75'));
      // coins dropping on the bill when a call is paid again
      s.coins = [0, 1, 2].map(() => E(root, ICON('coin', 44, C.neon, 1.8)));
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
      // the scene opens on the LLM node the previous chapter's AI hub turned into, at its final place and size, with
      // its halo; no entrance zoom, so the node never moves: the halo fades into the LLM's own glow and the rest of
      // the loop emerges around it
      setCamera(s.cam, t, this.dur, { enter: 1 });
      place(s.carry, LLM_AT.x, LLM_AT.y, 1, HANDOFF_HALO.o * (1 - P(t, 0.2, 1.0)));
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
      const broken = t >= crashAt && t < restart;
      placeAgentLoop(s.loop, t, c[0] + 0.1, {
        deg, centerAt: c[0] + 1.2, centerO: 1 - red, arcO: broken ? 0 : 1,
        q: crashed ? P(t, crashAt + 0.3, 0.3) : 0, dx: sx, dy: sy,
        // THINK is there from the first frame: the previous chapter's AI hub turned into it
        thinkIn: -1,
      });
      // the shards fall under gravity for 0.9 s, rest, then fly back into place just before the restart
      const fall = Math.min(Math.max(t - crashAt, 0), 0.9) * (1 - P(t, restart - 0.5, 0.5));
      s.shards.forEach(shard => {
        const dx = shard.vx * fall, dy = shard.vy * fall + 520 * fall * fall;
        shard.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)}) `
          + `rotate(${(shard.spin * fall).toFixed(2)} ${shard.mid[0]} ${shard.mid[1]})`);
        draw(shard, 1, broken ? 1 : 0);
      });
      // the token's comet tail: sparks along the loop behind it, smaller and fainter
      s.comet.forEach((e, k) => {
        if (deg === null || deg - (k + 1) * 6 < -90) {
          place(e, 0, 0, 1, 0);
          return;
        }
        const [x, y] = s.loop.pos(deg - (k + 1) * 6);
        place(e, x, y, 1, 0.55 - 0.08 * k);
      });
      // the durable loop: a Temporal ring draws around it, a dashed ring turns on it (ambient, driven by G)
      draw(s.ring, P(t, durable + 0.2, 1.0), 1);
      draw(s.ringDash, P(t, durable + 1.0, 0.4), 0.6);
      s.ringDash.setAttribute('stroke-dashoffset', -G * 30);
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
      // three coins drop onto the bill as the restarted call is paid again, bounce and fade
      s.coins.forEach((e, i) => {
        const at = restart + i * 0.18;
        const p = P(t, at, 0.5, backOut);
        const x = SIDE.x - 120 + i * 64, y = lerp(BILL_Y - 220, BILL_Y - 36, p);
        place(e, x, y, 1, clamp(P(t, at, 0.1) * 2) * (1 - P(t, at + 0.9, 0.4)));
      });

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
