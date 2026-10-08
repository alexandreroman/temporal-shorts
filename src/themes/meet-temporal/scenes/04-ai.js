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
  // the coins that pile up in the bill, one per call: flat discs seen slightly from the side, each 9 px above the
  // last, on the tile's right; the stack's bottom 22 px above the tile's bottom (in tile pixels)
  const COIN = { w: 64, h: 26, step: 9, x: LIST.w - 24 - 32, bottom: BILL_H - 22, drop: 40 };
  const TURN = 1.5; // seconds per turn of the loop, one step each, as in durable-ai-agents
  const RERUN_TURN = 2.0; // the reruns after the restart run slower, so each step billed again reads
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
    shift: (t, c) => pan(t, AGENT_START.shift, [[c[2], 10, 0]], 0.6),
    subs: [
      {
        text: "AI agents are long processes too: many LLM calls, tools to run, and waits for a person.",
        after: 0.4,
      },
      {
        text: "Every LLM call costs time and money. Without Durable Execution, a crash means starting over.",
        // the crash plays in held stages, then a held restart, then the three steps run again, slower
        after: 9.3,
      },
      // the message card: there is a better way
      { text: "There's a better way: with Durable Execution, an agent never loses its progress.", after: 1.2 },
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
      // the restart banner over the loop, a rewind icon turning in it
      s.restartTag = E(root,
        `<span class="rw" style="display:block">${ICON('retry', 34, C.violet, 2.4)}</span>`
        + '<span>Restarting from step 1</span>', 'mono', {
          fontSize: '28px', letterSpacing: '.12em', textTransform: 'uppercase', color: C.ink,
          background: 'var(--violet-solid)', border: '2px solid ' + C.violet, borderRadius: 'var(--r)',
          padding: '16px 30px 16px 24px', display: 'flex', alignItems: 'center', gap: '16px', whiteSpace: 'nowrap',
          boxShadow: '0 0 36px rgba(182,100,255,.5)',
        });
      s.restartTag.rw = s.restartTag.querySelector('.rw');

      s.list = makeStepList(root, 'Book lunch with Marie on Thursday.', LUNCH_STEPS, LIST.w);
      // the run the agent is on, on the goal card: RUN 1, then RUN 2 after the restart
      s.list.goal.insertAdjacentHTML('beforeend', '<div class="run mono" style="position:absolute;right:16px;'
        + 'top:10px;font-size:14px;letter-spacing:.12em;padding:3px 9px 3px calc(9px + .12em);border-radius:4px;'
        + `border:1.5px solid ${C.uv};color:${C.uv}">RUN 1</div>`);
      s.run = s.list.goal.querySelector('.run');
      // the light that wipes the list back to empty steps at the restart
      s.wipe = E(root, '', '', {
        width: LIST.w + 'px', height: '6px', borderRadius: '3px', background: C.violet,
        boxShadow: '0 0 22px 6px rgba(182,100,255,.6)',
      });
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
        r.insertAdjacentHTML('beforeend', '<div class="again mono" style="position:absolute;right:22px;top:50%;'
          + 'transform:translateY(-50%);font-size:15px;letter-spacing:.12em;color:var(--violet);opacity:0">'
          + 'RUNNING AGAIN</div>');
        r.again = r.querySelector('.again');
        r.dust = Array.from({ length: 8 }, (_, k) => {
          const e = makeSpark(root, 4 + Math.round(hash(i * 40 + k) * 3), k % 2 ? '219,255,75' : '255,90,95');
          Object.assign(e, { u: hash(i * 40 + k + 7), drift: (hash(i * 40 + k + 13) - 0.5) * 60 });
          return e;
        });
      });
      s.bill = makeCounter(root, 'LLM calls billed', LIST.w);
      s.bill.style.height = BILL_H + 'px';
      // coins dropping on the bill when a call is paid again
      // the coin stack, clipped to the tile: six coins, the first run's in neon, the reruns' in red
      s.bill.style.overflow = 'hidden';
      s.coins = [0, 1, 2, 3, 4, 5].map(i => {
        const [face, rim] = i < 3 ? [C.neon, C.neonDark] : [C.red, '#B83B3F'];
        return E(s.bill,
          `<svg width="${COIN.w}" height="${COIN.h}" viewBox="0 0 64 26" style="display:block;overflow:visible">`
          + `<path d="M1 9v8a31 8 0 0 0 62 0V9" fill="${rim}"/>`
          + `<ellipse cx="32" cy="9" rx="31" ry="8" fill="${face}"/>`
          + '<ellipse cx="32" cy="9" rx="20" ry="4.5" fill="none" stroke="rgba(20,20,20,.35)" stroke-width="1.5"/>'
          + '</svg>');
      });
      s.bill.n.style.transformOrigin = '0 100%';
      s.bill.note.style.color = C.red;
      s.flash = makeFlash(root);

      s.builtOn = E(root, 'Built on Temporal', 'lbl');
      s.companies = COMPANIES.map(name => {
        const e = tag(root, name);
        Object.assign(e.style, { width: LIST.w + 'px', textAlign: 'center' });
        return e;
      });

      // the message card, centered on the stage once the failed run has cleared: the official logo, a large line
      // with "better" glowing violet, DURABLE EXECUTION under it, on a soft violet glow
      s.cardGlow = E(root, '', '', {
        width: '1100px', height: '700px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(182,100,255,.28) 0%, rgba(68,76,231,.12) 45%, '
          + 'rgba(68,76,231,0) 70%)',
      });
      s.cardLogo = E(root, `<img src="${LOGO}" style="height:64px;display:block">`);
      s.cardLine = E(root, 'There\'s a <span style="color:var(--violet);text-shadow:0 0 28px rgba(182,100,255,.7)">'
        + 'better</span> way', '', { fontSize: '108px', lineHeight: 1.1, whiteSpace: 'nowrap' });
      s.cardKicker = E(root, 'Durable Execution', 'lbl', { fontSize: '30px', color: 'var(--violet)' });
      // the ring that leaves the card and condenses around the durable loop
      s.condense = E(root, '', '', {
        borderRadius: '50%', border: '4px solid ' + C.uv, boxShadow: '0 0 24px rgba(68,76,231,.9)',
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
      // the restart, held: the loop re-forms, the banner shows, the token rewinds back to THINK and the list is
      // wiped back to empty steps; then steps 1 to 3 run again, slower
      const rewindAt = restart + 0.2, wipeAt = restart + 0.5;
      const rerun = [0, 1, 2].map(i => restart + 2.1 + i * RERUN_TURN);
      // step 4's turn: it starts just before the crash, which freezes the token mid-arc
      const lastTurn = crashAt - 0.5;
      // the failed run clears for the message card, which gives way to the durable loop with subtitle 4
      const clearAt = c[2], cardOut = c[3] - 0.7, durable = c[3] + 0.2;
      const condenseEnd = c[3] + 0.3;
      // the durable loop turns once more in subtitle 3 (not billed: the bill is gone)
      const turns = [...[...firstRun, lastTurn].map(a => [a, TURN]), ...rerun.map(a => [a, RERUN_TURN]),
        [c[3] + 0.9, TURN]];
      const crashed = t >= crashAt && t < restart;
      const glitch = crashGlitch(t, crashAt + 0.35);
      const [sx, sy] = shakeAt(t, crashAt);

      // where the token is on the loop, in degrees from the top; null between turns and after the crash
      let deg = null;
      turns.forEach(([a, d]) => {
        if (t >= a && t < a + d && !crashed) deg = -90 + 360 * ease((t - a) / d);
      });
      const frozenDeg = -90 + 360 * ease((crashAt - lastTurn) / TURN);
      // the rewind: from where the crash caught it, the token runs backwards a full turn, back to THINK
      const rewinding = t >= restart && t < rewindAt + 1.4;
      if (rewinding) deg = lerp(frozenDeg, -90 - 360, ease(P(t, rewindAt, 1.2, x => x)));

      // the arcs stay whole through the impact, are shards from the break until the pieces fly back
      const shattered = t >= breakAt && t < restart;
      const dim = P(t, breakAt, 0.6) * (1 - P(t, restart - 0.6, 0.6));
      const gx = sx + glitch.dx;
      placeAgentLoop(s.loop, t, loopAt, {
        deg: crashed ? null : deg, centerAt: c[0] + 1.2, centerO: 1 - win(t, crashAt, restart + 2.0, 0.25),
        arcO: shattered ? 0 : 1, q: crashed ? P(t, crashAt + 0.2, 0.3) : 0, dx: gx, dy: sy,
        // THINK is there from the first frame: the previous chapter's AI hub turned into it
        thinkIn: -1,
        // the loop clears for the message card, and comes back inside the Temporal ring
        o: 1 - P(t, clearAt, 0.5) * (1 - P(t, c[3] - 0.4, 0.5)),
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
      // (behind it while rewinding too, so the tail follows the backward run)
      s.comet.forEach((e, k) => {
        const tailDeg = rewinding ? deg + (k + 1) * 6 : deg - (k + 1) * 6;
        if (crashed || deg === null || (!rewinding && tailDeg < -90) || (rewinding && tailDeg > frozenDeg)) {
          place(e, 0, 0, 1, 0);
          return;
        }
        const [x, y] = s.loop.pos(tailDeg);
        place(e, x, y, 1, 0.55 - 0.08 * k);
      });
      // the durable loop: a Temporal ring draws around it, a dashed ring turns on it (ambient, driven by G)
      draw(s.ring, t >= condenseEnd ? 1 : 0, 1);
      draw(s.ringDash, P(t, condenseEnd + 0.3, 0.4), 0.6);
      s.ringDash.setAttribute('stroke-dashoffset', -G * 30);
      s.svg.style.transform = `translate(${sx}px,${sy}px)`;
      // the restart banner, over the loop as it re-forms, its rewind icon turning backwards
      const rp = P(t, restart - 0.3, 0.45, backOut);
      place(s.restartTag, LOOP.cx, LOOP.cy - 20, rp, clamp(rp * 2) * (1 - P(t, restart + 1.9, 0.3)));
      s.restartTag.rw.style.transform = `rotate(${(-200 * Math.max(0, t - restart + 0.3)).toFixed(1)}deg)`;
      // the agent also waits for a person: said in the first subtitle
      const wp = P(t, firstRun[2] + 0.4, 0.45, backOut);
      place(s.wait, LOOP.cx, WAIT_Y, wp, clamp(wp * 2) * (1 - P(t, c[1] + 0.2, 0.4)));

      // the goal and its steps, as in durable-ai-agents: each row slides in during its turn, highlighted while it
      // runs, its result and check showing as the turn ends
      const sideOut = P(t, clearAt, 0.5);
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
          // the wipe passes the row, bottom to top, and leaves it an empty step to do again
          const cleared = P(t, wipeAt + (2 - i) * 0.2, 0.25);
          if (cleared > 0) {
            r.style.opacity = (lerp(0.45, 1, cleared) * (1 - sideOut)).toFixed(3);
            r.style.color = C.slate;
          }
        } else {
          r.res.style.transform = '';
          r.ko.style.opacity = 0;
          if (t >= redo) {
            // rerun: RUNNING AGAIN while its turn runs, then its result and check
            r.style.color = '';
            r.res.style.opacity = P(t, redo + 1.4, 0.3);
            r.ck.style.opacity = P(t, redo + 1.55, 0.25);
            r.style.borderColor = (t > redo && t < redo + RERUN_TURN) ? C.violet : C.line;
          }
        }
        r.again.style.opacity = t >= redo ? win(t, redo + 0.1, redo + 1.45, 0.2) : 0;
        // the particles of the result fall and fade
        const f = P(t, at + 0.35, 0.8, x => x);
        r.dust.forEach(e => {
          const x0 = LIST.x - 244 + e.u * 190, y0 = LIST.rowY + i * LIST.gap + 14;
          place(e, x0 + e.drift * f + sx, y0 + 50 * f + 90 * f * f + sy, 1, f > 0 && f < 1 ? 1 - f : 0);
        });
      });
      // the wipe: a bar of light sweeps up the list, from under step 3 to over step 1
      const wp2 = P(t, wipeAt, 0.6, x => x);
      place(s.wipe, LIST.x + sx, lerp(LIST.rowY + 2 * LIST.gap + 50, LIST.rowY - 50, wp2) + sy, 1,
        wp2 > 0 && wp2 < 1 ? 1 : 0);
      // RUN 1, then RUN 2 in red after the restart, with a swell
      const run2 = t >= wipeAt + 0.6;
      if (s.run.textContent !== (run2 ? 'RUN 2' : 'RUN 1')) s.run.textContent = run2 ? 'RUN 2' : 'RUN 1';
      s.run.style.color = s.run.style.borderColor = run2 ? C.red : C.uv;
      s.run.style.transform = `scale(${swell(t, wipeAt + 0.6, 0.25)})`;
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
      // the money spent is not lost: the bill stays in place, fully visible, through the whole crash
      rise(s.bill, LIST.x, BILL_Y, P(t, c[0] + 0.6, 0.5) * (1 - sideOut));
      // the count swells as it ticks up
      const billed = [...firstRun, ...rerun];
      const lastCall = billed.filter(a => t >= a).pop();
      s.bill.n.style.transform = lastCall === undefined ? '' : `scale(${swell(t, lastCall, 0.14)})`;
      // at each call a coin drops from just above its place and lands on the stack with a small bounce and a
      // glint; the stack keeps growing, the reruns' red coins on top of the first run's
      s.coins.forEach((e, i) => {
        const at = billed[i];
        const land = P(t, at, 0.35, easeIn);
        const bounce = Math.sin(Math.PI * clamp((t - at - 0.35) / 0.2)) * 3;
        const y = COIN.bottom - COIN.h / 2 - i * COIN.step - (1 - land) * COIN.drop - bounce;
        place(e, COIN.x, Math.round(y * 100) / 100, 1, P(t, at, 0.1));
        const glint = win(t, at + 0.35, at + 0.55, 0.1);
        e.style.filter = glint > 0 ? `drop-shadow(0 0 ${Math.round(10 * glint)}px rgba(255,255,255,.8))` : '';
      });
      placeFlash(s.flash, t, crashAt);

      // the loop becomes durable with Temporal, then the companies that build on it
      place(s.temporal, PANEL.x, PANEL.y, 1, P(t, durable, 0.5));
      rise(s.builtOn, LIST.x, COMPANY.y0 - 70, P(t, durable + 0.5, 0.5), 12);
      const companyIn = [c[3] + 0.8, c[3] + 2.6, c[3] + 3.0, c[3] + 3.4];
      s.companies.forEach((e, i) => {
        const p = P(t, companyIn[i], 0.45, backOut);
        place(e, LIST.x, COMPANY.y0 + i * COMPANY.gap, p, clamp(p * 2));
      });

      // the message card: the logo glows up, the line rises as its letters close in, DURABLE EXECUTION follows; it
      // holds, then fades as its ring leaves it and condenses around the loop (in the scene, the stage center is
      // at (950, 515) once the shift has moved to [10, 0])
      const CARD = { x: 950, y: 515 };
      const out = 1 - P(t, cardOut, 0.4);
      place(s.cardGlow, CARD.x, CARD.y, 1 + 0.04 * Math.sin(G * 1.4), P(t, clearAt + 0.4, 0.8) * out);
      const lg = P(t, clearAt + 0.5, 0.7);
      place(s.cardLogo, CARD.x, CARD.y - 135, lerp(0.92, 1, ease(lg)), lg * out);
      s.cardLogo.style.filter = lg > 0 && lg < 1 ? `drop-shadow(0 0 ${Math.round(24 * (1 - lg))}px `
        + 'rgba(182,100,255,.9))' : '';
      const lp2 = P(t, clearAt + 0.9, 0.9);
      rise(s.cardLine, CARD.x, CARD.y, lp2 * out, 24);
      s.cardLine.style.letterSpacing = `${lerp(0.12, -0.02, ease(lp2)).toFixed(4)}em`;
      rise(s.cardKicker, CARD.x, CARD.y + 110, P(t, clearAt + 1.6, 0.5) * out, 12);
      // the ring condenses from around the card onto the loop, where the drawn Temporal ring takes over
      const cp = P(t, cardOut, condenseEnd - cardOut);
      const size = Math.round(lerp(880, 2 * RING_R, cp));
      s.condense.style.width = s.condense.style.height = size + 'px';
      place(s.condense, lerp(CARD.x, LOOP.cx, cp), lerp(CARD.y, LOOP.cy, cp), 1,
        cp > 0 && t < condenseEnd ? Math.min(1, cp * 3) : 0);
    }
  });
}
