// ===================== 4. WHY IT MATTERS FOR AI
// The block keeps every name declared in this file local to this scene.
{
  // The agentic loop on the left (think, act, observe, as in durable-ai-agents); on the right the agent's goal and
  // its steps, as in durable-ai-agents chapter 5, with the LLM calls billed under them; the AI companies take
  // their place once the loop is durable
  const LOOP = AGENT_LOOP;
  const LLM_AT = { x: LOOP.cx, y: LOOP.cy - LOOP.r }; // the THINK node, where the carried glow condenses
  const WAIT_Y = LOOP.cy + 301; // the "waits for a person" tag, under the loop, its bottom on the frame's (y 880)
  const PANEL = { x: 560, y: 515, w: 800, h: 730 };
  // the step list in durable-ai-agents' place; the crash comes before step 4, so its row never shows: the bill
  // takes its place, 20 px below the third row
  const LIST = { x: 1440, goalY: 210, rowY: 335, gap: 104, w: 640 };
  const BILL_H = 146;
  const BILL_Y = LIST.rowY + 2 * LIST.gap + 44 + 20 + BILL_H / 2;
  const TURN = 1.5; // seconds per turn of the loop, one step each, as in durable-ai-agents
  const COMET = 6; // sparks trailing the token
  const SHARDS_PER_ARC = 4; // the pieces each arc breaks into at the crash
  const RING_R = 330; // the Temporal ring that wraps the durable loop
  const COMPANIES = ['OpenAI · Codex', 'Cursor', 'Lovable', 'Replit'];
  const COMPANY = { y0: 370, gap: 80 };

  scene({
    chapter: 4, title: 'Why it matters for AI',
    holdBeforeEnd: CAMERA_EXIT, // presenter mode holds before the exit zoom
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
        after: 1.7,
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
      s.wait = E(root, `${ICON('user', 22, C.violet, 2)}<span>Waits for a person</span>`, 'pill violet', {
        display: 'flex', alignItems: 'center', gap: '10px',
      });
      s.over = E(root, 'Start<br>over', 'lbl', {
        textAlign: 'center', color: 'var(--red)', fontSize: '24px', lineHeight: 1.4,
      });

      s.list = makeStepList(root, 'Book lunch with Marie on Thursday.', LUNCH_STEPS, LIST.w);
      s.lost = tag(root, 'Progress lost', 'red solid');
      s.bill = makeCounter(root, 'LLM calls billed', LIST.w);
      s.bill.style.height = BILL_H + 'px';
      // coins dropping on the bill when a call is paid again
      s.coins = [0, 1, 2].map(() => E(root, ICON('coin', 44, C.neon, 1.8)));
      s.bill.note.style.color = C.red;
      s.flash = makeFlash(root);

      s.builtOn = E(root, 'Built on Temporal', 'lbl');
      s.companies = COMPANIES.map(name => {
        const e = tag(root, name);
        Object.assign(e.style, { width: LIST.w + 'px', textAlign: 'center' });
        return e;
      });
    },
    update(t, c, s) {
      // the scene opens on the LLM node the previous chapter's AI hub turned into, at its final place and size, with
      // its halo; no entrance zoom, so the node never moves: the halo fades into the LLM's own glow and the rest of
      // the loop emerges around it
      setCamera(s.cam, t, this.dur, { enter: 1 });
      place(s.carry, LLM_AT.x, LLM_AT.y, 1, HANDOFF_HALO.o * (1 - P(t, 0.2, 1.0)));
      // each turn runs the loop once, think -> act -> observe, for one step, and bills one LLM call as it starts:
      // steps 1 to 3, then the crash before step 4 (the invite), then the agent starts over and redoes steps 1 to 3
      // the first turn starts once the whole loop is drawn, a short beat later: the token never runs on an arc that
      // isn't there yet
      const loopAt = c[0] + 0.1;
      const firstRun = [0, 1, 2].map(i => loopAt + AGENT_LOOP_DRAWN + 0.25 + i * TURN);
      const crashAt = c[1] + 3.0;
      const restart = c[1] + 3.8;
      const rerun = [0, 1, 2].map(i => restart + i * TURN);
      const durable = c[2] + 0.2;
      // the durable loop turns once more in subtitle 3 (not billed: the bill is gone)
      const turnStarts = [...firstRun, ...rerun, c[2] + 0.9];
      const crashed = t >= crashAt && t < restart;
      const [sx, sy] = shakeAt(t, crashAt);

      // where the token is on the loop, in degrees from the top; null between turns and after the crash
      let deg = null;
      turnStarts.forEach(a => {
        if (t >= a && t < a + TURN && !crashed) deg = -90 + 360 * ease((t - a) / TURN);
      });

      const red = win(t, crashAt, restart, 0.25);
      const broken = t >= crashAt && t < restart;
      placeAgentLoop(s.loop, t, loopAt, {
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
      const wp = P(t, firstRun[2] + 0.4, 0.45, backOut);
      place(s.wait, LOOP.cx, WAIT_Y, wp, clamp(wp * 2) * (1 - P(t, c[1] + 0.2, 0.4)));

      // the goal and its steps, as in durable-ai-agents: each row slides in during its turn, highlighted while it
      // runs, its result and check showing as the turn ends
      const sideOut = P(t, durable, 0.4);
      placeStepList(s.list, t, {
        x: LIST.x + sx, goalY: LIST.goalY + sy, rowY: LIST.rowY + sy, gap: LIST.gap, goalAt: c[0] + 0.3,
        turnStarts: [...firstRun, c[1] + 99], turn: TURN, o: 1 - sideOut,
      });
      // after the crash the done steps lose their results: greyed until the agent redoes them from step 1
      if (t >= crashAt) {
        s.list.rows.slice(0, 3).forEach((r, i) => {
          const redo = rerun[i];
          const lost = P(t, crashAt + 0.2, 0.3) * (1 - P(t, redo, 0.2));
          r.style.opacity = ((1 - 0.55 * lost) * (1 - sideOut)).toFixed(3);
          r.res.style.opacity = t < redo ? 1 - P(t, crashAt + 0.2, 0.3) : P(t, redo + 1.05, 0.3);
          r.ck.style.opacity = t < redo ? 1 - P(t, crashAt + 0.2, 0.3) : P(t, redo + 1.15, 0.25);
          r.style.borderColor = (t > redo && t < redo + TURN) ? C.violet : C.line;
        });
      }
      const lp = P(t, crashAt + 0.4, 0.45, backOut);
      place(s.lost, LIST.x + sx, LIST.rowY + 1.5 * LIST.gap + sy, lp, clamp(lp * 2) * (1 - P(t, restart + 0.2, 0.3)));

      // the bill keeps adding up: the calls made again after the crash are paid a second time
      const calls = [...firstRun, ...rerun].filter(a => t >= a).length;
      const paidAgain = calls - firstRun.length;
      s.bill.n.textContent = calls;
      s.bill.n.style.color = paidAgain > 0 ? C.red : C.ink;
      s.bill.note.textContent = paidAgain > 0 ? `+${paidAgain} PAID AGAIN` : '';
      // the bill stands out while the subtitle says what each call costs
      s.bill.style.borderColor = win(t, c[1] + 0.2, c[1] + 2.4, 0.3) > 0.5 ? C.violet : C.line;
      rise(s.bill, LIST.x + sx, BILL_Y + sy, P(t, c[0] + 0.6, 0.5) * (1 - sideOut));
      // a coin drops onto the bill each time a call is paid again, bounces and fades
      s.coins.forEach((e, i) => {
        const at = rerun[i];
        const p = P(t, at, 0.5, backOut);
        const x = LIST.x + 120 + i * 64, y = lerp(BILL_Y - 90, BILL_Y - 14, p);
        place(e, x, y, 1, clamp(P(t, at, 0.1) * 2) * (1 - P(t, at + 0.9, 0.4)));
      });
      placeFlash(s.flash, t, crashAt);

      // the loop becomes durable with Temporal, then the companies that build on it
      place(s.temporal, PANEL.x, PANEL.y, 1, P(t, durable, 0.5));
      rise(s.builtOn, LIST.x, COMPANY.y0 - 70, P(t, durable + 0.5, 0.5), 12);
      const companyIn = [c[2] + 0.8, c[2] + 2.6, c[2] + 3.0, c[2] + 3.4];
      s.companies.forEach((e, i) => {
        const p = P(t, companyIn[i], 0.45, backOut);
        place(e, LIST.x, COMPANY.y0 + i * COMPANY.gap, p, clamp(p * 2));
      });
    }
  });
}
