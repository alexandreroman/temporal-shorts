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
        // the crash plays in held stages, then the three steps run again
        after: 5.5,
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
      // the big PROGRESS LOST label of the crash, over the broken loop
      s.lost = E(root, 'Progress lost', 'mono', {
        fontSize: '44px', letterSpacing: '.14em', paddingLeft: 'calc(34px + .14em)', paddingRight: '34px',
        lineHeight: '84px', textTransform: 'uppercase', color: C.red, background: 'var(--red-solid)',
        border: '3px solid ' + C.red, borderRadius: 'var(--r)', whiteSpace: 'nowrap',
        boxShadow: '0 0 40px rgba(255,90,95,.55)',
      });
      // each done row's check turns into a red cross as its result is lost, and the result dissolves into particles
      s.list.rows.forEach((r, i) => {
        r.insertAdjacentHTML('beforeend', '<div class="ko" style="position:absolute;right:22px;top:50%;'
          + `margin-top:-16px;opacity:0">${ICON('x', 32, C.red, 2.6)}</div>`);
        r.ko = r.querySelector('.ko');
        r.dust = Array.from({ length: 8 }, (_, k) => {
          const e = makeSpark(root, 4 + Math.round(hash(i * 40 + k) * 3), k % 2 ? '219,255,75' : '255,90,95');
          Object.assign(e, { u: hash(i * 40 + k + 7), drift: (hash(i * 40 + k + 13) - 0.5) * 60 });
          return e;
        });
      });
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
      // the crash, in held stages: impact (the token stops dead mid-arc in step 4's turn, shake, flash, glitch),
      // break (the arcs shatter and drift down, the token fades, the nodes dim red), loss (each done row loses its
      // result, top to bottom, and PROGRESS LOST holds), then the restart: START OVER, the pieces fly back and
      // steps 1 to 3 run again
      const crashAt = c[1] + 2.8;
      const breakAt = crashAt + 0.8, lossAt = crashAt + 2.0;
      const restart = crashAt + 4.6;
      const lostAt = crashAt + 2.4;
      const rerun = [0, 1, 2].map(i => restart + 0.2 + i * TURN);
      // step 4's turn: it starts just before the crash, which freezes the token mid-arc
      const lastTurn = crashAt - 0.5;
      const durable = c[2] + 0.2;
      // the durable loop turns once more in subtitle 3 (not billed: the bill is gone)
      const turnStarts = [...firstRun, lastTurn, ...rerun, c[2] + 0.9];
      const crashed = t >= crashAt && t < restart;
      const glitch = crashGlitch(t, crashAt + 0.35);
      const [sx, sy] = shakeAt(t, crashAt);

      // where the token is on the loop, in degrees from the top; null between turns and after the crash
      let deg = null;
      turnStarts.forEach(a => {
        if (t >= a && t < a + TURN && !crashed) deg = -90 + 360 * ease((t - a) / TURN);
      });
      const frozenDeg = -90 + 360 * ease((crashAt - lastTurn) / TURN);

      // the arcs stay whole through the impact, are shards from the break until the pieces fly back
      const shattered = t >= breakAt && t < restart;
      const dim = P(t, breakAt, 0.6) * (1 - P(t, restart - 0.6, 0.6));
      const gx = sx + glitch.dx;
      placeAgentLoop(s.loop, t, loopAt, {
        deg: crashed ? null : deg, centerAt: c[0] + 1.2, centerO: 1 - win(t, crashAt, restart + 0.9, 0.25),
        arcO: shattered ? 0 : 1, q: crashed ? P(t, crashAt + 0.2, 0.3) : 0, dx: gx, dy: sy,
        // THINK is there from the first frame: the previous chapter's AI hub turned into it
        thinkIn: -1,
      });
      // the token stops dead where the crash caught it, then fades out as the loop breaks
      if (crashed) {
        const [x, y] = s.loop.pos(frozenDeg);
        place(s.loop.token, x + gx, y + sy, 1, 1 - P(t, breakAt, 0.8));
      }
      // the nodes dim to red while the loop is broken
      [s.loop.act, s.loop.observe].forEach(e => {
        e.style.borderColor = dim > 0.5 ? C.red : (e === s.loop.act ? C.neon : C.uv);
        e.style.opacity = (parseFloat(e.style.opacity) * (1 - 0.4 * dim)).toFixed(3);
      });
      s.loop.think.root.style.filter = dim > 0 ? `grayscale(${(0.7 * dim).toFixed(3)})` : '';
      s.loop.labels.forEach(e => { e.style.color = dim > 0.5 ? C.red : 'var(--ink)'; });
      // the shards drift and fall slowly through the break, rest dimmed, then fly back into place at the restart
      const fallT = clamp((t - breakAt) / 1.2) * 1.2 * (1 - P(t, restart - 0.6, 0.6));
      s.shards.forEach(shard => {
        const dx = shard.vx * fallT * 0.5, dy = shard.vy * fallT * 0.5 + 110 * fallT * fallT;
        shard.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)}) `
          + `rotate(${(shard.spin * fallT * 0.5).toFixed(2)} ${shard.mid[0]} ${shard.mid[1]})`);
        draw(shard, 1, shattered ? 1 - 0.6 * P(t, lossAt, 0.6) * (1 - P(t, restart - 0.6, 0.3)) : 0);
      });
      // the token's comet tail: sparks along the loop behind it, smaller and fainter
      s.comet.forEach((e, k) => {
        if (crashed || deg === null || deg - (k + 1) * 6 < -90) {
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
      // START OVER in the loop's middle once PROGRESS LOST has gone, as the pieces fly back
      place(s.over, LOOP.cx, LOOP.cy, 1, win(t, restart - 0.3, restart + 0.9, 0.25));
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
      // the loss: each done row, top to bottom, has its result corrupted, then dissolving into falling particles,
      // its check turned into a red cross that vanishes, and greys out until the agent redoes it from step 1
      s.list.rows.slice(0, 3).forEach((r, i) => {
        const step = LUNCH_STEPS[i];
        const at = lossAt + i * 0.35, redo = rerun[i];
        const corrupt = t >= at && t < at + 0.35;
        const text = corrupt ? scramble(step.result, step.result.length, Math.floor((G - this.start) * 20))
          : step.result;
        if (r.res.textContent !== text) r.res.textContent = text;
        r.res.style.color = corrupt ? C.red : C.neon;
        if (t >= at && t < redo) {
          const gone = P(t, at + 0.35, 0.3);
          r.res.style.opacity = 1 - gone;
          r.res.style.transform = `translateY(${(gone * 10).toFixed(2)}px)`;
          r.ck.style.opacity = 0;
          r.ko.style.opacity = 1 - P(t, at + 0.6, 0.3);
          r.style.opacity = ((1 - 0.55 * P(t, at + 0.3, 0.4)) * (1 - sideOut)).toFixed(3);
        } else {
          r.res.style.transform = '';
          r.ko.style.opacity = 0;
          if (t >= redo) {
            r.res.style.opacity = P(t, redo + 1.05, 0.3);
            r.ck.style.opacity = P(t, redo + 1.15, 0.25);
            r.style.borderColor = (t > redo && t < redo + TURN) ? C.violet : C.line;
          }
        }
        // the particles of the result fall and fade
        const f = P(t, at + 0.35, 0.8, x => x);
        r.dust.forEach(e => {
          const x0 = LIST.x - 244 + e.u * 190, y0 = LIST.rowY + i * LIST.gap + 14;
          place(e, x0 + e.drift * f + sx, y0 + 50 * f + 90 * f * f + sy, 1, f > 0 && f < 1 ? 1 - f : 0);
        });
      });
      // PROGRESS LOST pops over the broken loop with a jolt and a glow, and holds until the restart
      const lp = P(t, lostAt, 0.45, backOut);
      const [jx, jy] = shakeAt(t, lostAt - 0.1);
      place(s.lost, LOOP.cx + jx * 0.6, LOOP.cy - 20 + jy * 0.6, lp, clamp(lp * 2) * (1 - P(t, restart - 0.6, 0.3)));

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
