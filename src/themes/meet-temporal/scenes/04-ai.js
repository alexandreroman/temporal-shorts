// ===================== 4. WHY IT MATTERS FOR AI
// The block keeps every name declared in this file local to this scene.
{
  // The agentic loop on the left (think, act, observe, as in durable-ai-agents); on the right the agent's goal and
  // its steps, as in durable-ai-agents chapter 5, with the LLM calls billed under them. After the crash and the
  // "better way" card, the loop runs durably in an app instance, its steps saved in an Event History outside the
  // app, as in durable-ai-agents chapter 7: a second crash, a new instance takes over and replays, nothing is paid
  // twice
  const LOOP = AGENT_LOOP;
  const LLM_AT = { x: LOOP.cx, y: LOOP.cy - LOOP.r }; // the THINK node, where the carried glow condenses
  const WAIT_Y = LOOP.cy + 301; // the "waits for a person" tag, under the loop, its bottom on the frame's (y 880)
  // the step list in durable-ai-agents' place; the crash comes before step 4, so its row never shows: the bill
  // takes its place, 20 px below the third row
  const LIST = { x: 1440, goalY: 210, rowY: 335, gap: 104, w: 640 };
  const BILL_H = 146;
  const BILL_Y = LIST.rowY + 2 * LIST.gap + 44 + 20 + BILL_H / 2;
  // the coins that pile up in the bill, one per call: flat discs seen slightly from the side, each 9 px above the
  // last, on the tile's right; the stack's bottom 22 px above the tile's bottom (in tile pixels)
  const COIN = { w: 64, h: 26, step: 9, bottom: BILL_H - 22, drop: 40 };
  const TURN = 1.5; // seconds per turn of the loop, one step each, as in durable-ai-agents
  const RERUN_TURN = 2.0; // the reruns after the restart run slower, so each step billed again reads
  const COMET = 6; // sparks trailing the token
  const SHARDS_PER_ARC = 4; // the pieces each arc breaks into at the crash
  const RING_R = 330; // the Temporal ring that wraps the durable loop
  // the durable part: the app instance with the loop on the left; the Temporal panel with the Event History on the
  // right, the bill under it (scene pixels, the shift then at [10, 0]: the stage is 10 px to the right)
  const APP = { x: 560, y: 515, w: 780, h: 730 };
  const OUTSIDE = { x: 1390, y: 432, w: 800, h: 540 };
  const HIST = { x: OUTSIDE.x, y: OUTSIDE.y + 25, w: 760, h: 450, row0: 70, gap: 44 };
  const BILL2 = { x: OUTSIDE.x, y: OUTSIDE.y + OUTSIDE.h / 2 + 20 + BILL_H / 2, w: OUTSIDE.w };
  const D_TURN = 2.0; // seconds per turn of the durable loop: each step and its saved results read
  // the Event History rows: the LLM call of each step, then its tool's result
  const HISTORY = LUNCH_STEPS.flatMap(step => [
    `LLM call: ${step.action[0].toLowerCase()}${step.action.slice(1)}`, `${step.tool}: ${step.result}`,
  ]);
  const isLLM = i => i % 2 === 0;
  // stage-free row geometry: the middle of row i, and where a result card lands on it
  const rowMid = i => HIST.y - HIST.h / 2 + HIST.row0 + i * HIST.gap + 17;
  const CARD_X = HIST.x - HIST.w / 2 + 170;

  // The LLM CALLS BILLED tile, w px wide, with a stack of coins clipped inside it, one per call, in the colors
  // given as [face, rim] pairs
  function makeCoinBill(root, w, colors) {
    const bill = makeCounter(root, 'LLM calls billed', w);
    bill.style.height = BILL_H + 'px';
    bill.style.overflow = 'hidden';
    bill.coins = colors.map(([face, rim]) => E(bill,
      `<svg width="${COIN.w}" height="${COIN.h}" viewBox="0 0 64 26" style="display:block;overflow:visible">`
      + `<path d="M1 9v8a31 8 0 0 0 62 0V9" fill="${rim}"/>`
      + `<ellipse cx="32" cy="9" rx="31" ry="8" fill="${face}"/>`
      + '<ellipse cx="32" cy="9" rx="20" ry="4.5" fill="none" stroke="rgba(20,20,20,.35)" stroke-width="1.5"/>'
      + '</svg>'));
    bill.n.style.transformOrigin = '0 100%';
    bill.coinX = w - 24 - 32;
    return bill;
  }
  // The count of calls made by t (one per time in `billed`), swelling as it ticks; at each call a coin drops from
  // just above its place in the stack and lands with a small bounce and a glint
  function placeCoins(bill, t, billed) {
    const calls = billed.filter(a => t >= a);
    bill.n.textContent = calls.length;
    bill.n.style.transform = calls.length ? `scale(${swell(t, calls[calls.length - 1], 0.14)})` : '';
    bill.coins.forEach((e, i) => {
      const at = billed[i];
      const land = P(t, at, 0.35, easeIn);
      const bounce = Math.sin(Math.PI * clamp((t - at - 0.35) / 0.2)) * 3;
      const y = COIN.bottom - COIN.h / 2 - i * COIN.step - (1 - land) * COIN.drop - bounce;
      place(e, bill.coinX, Math.round(y * 100) / 100, 1, P(t, at, 0.1));
      const glint = win(t, at + 0.35, at + 0.55, 0.1);
      e.style.filter = glint > 0 ? `drop-shadow(0 0 ${Math.round(10 * glint)}px rgba(255,255,255,.8))` : '';
    });
    return calls.length;
  }

  scene({
    chapter: 4, title: 'Why it matters for AI',
    holdBeforeEnd: CAMERA_EXIT, // presenter mode holds before the exit zoom
    fadeIn: 0.001, // a hard cut: the previous chapter ends on this chapter's first frame
    // the loop and its steps, then the card and the durable part: the pan runs as the failed run clears
    shift: (t, c) => pan(t, AGENT_START.shift, [[c[3], 10, 0]], 0.6),
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
      // the failed run is rewound like a tape, back to its start
      { text: "Let's rewind and run the same agent with Temporal.", after: 0.8 },
      // the message card: there is a better way
      { text: "There's a better way: with Durable Execution, an agent never loses its progress.", after: 1.2 },
      // the durable agent: every step saved, a crash, a takeover that replays the history and pays nothing twice
      {
        text: "With Temporal, every step the agent takes is saved in an Event History, outside the app.",
        after: 1.8,
      },
      {
        text: "After a crash, the agent gets its saved results back and resumes at the invite: nothing is paid twice.",
        after: 2.0,
      },
      { text: "That's why OpenAI built Codex on Temporal, and Cursor, Lovable and Replit rely on it too.", after: 1.4 },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // the halo the LLM node arrives with from the previous chapter, which settles into the LLM's own glow
      s.carry = E(root, '', '', {
        width: HANDOFF_HALO.size + 'px', height: HANDOFF_HALO.size + 'px', borderRadius: '50%',
        background: HALO_BACKGROUND,
      });
      // the app instances that run the durable loop: built first, so the loop and its arcs sit on top of them
      s.appA = makeAppPanel(root, 'APP INSTANCE A', APP.w, APP.h, { font: 22, statusFont: 18, statusTop: 25 });
      s.appB = makeAppPanel(root, 'APP INSTANCE B', APP.w, APP.h, { font: 22, statusFont: 18, statusTop: 25 });
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
      // the bill of the failed run: six coins, the first run's in neon, the reruns' in red
      const neonCoin = [C.neon, C.neonDark], redCoin = [C.red, '#B83B3F'];
      s.bill = makeCoinBill(root, LIST.w, [neonCoin, neonCoin, neonCoin, redCoin, redCoin, redCoin]);
      s.bill.note.style.color = C.red;
      s.flash = makeFlash(root);

      // the durable part: Temporal with the Event History, outside the app (rows 1 to 6 survive the crash), the
      // result cards between the loop and the history, the bill, the crash marks and the takeover tag
      s.outside = makeTemporalPanel(root, OUTSIDE.w, OUTSIDE.h, { logoAt: [24, 20], noteAt: [24, 25], font: 18 });
      const rowsHtml = HISTORY.map((text, i) => `<span style="color:${isLLM(i) ? C.uv : '#141414'}">${text}</span>`);
      s.history = makeHistoryCard(root, rowsHtml, {
        w: HIST.w, h: HIST.h, rowTop: i => HIST.row0 + i * HIST.gap, font: 20,
        tagTop: i => HIST.row0 + 4 + i * HIST.gap,
        tag: { border: false },
        crash: {
          keptTop: HIST.row0 - 6, keptH: 6 * HIST.gap - 2, cutTop: HIST.row0 + 6 * HIST.gap - 4,
          label: 'APP CRASHED HERE', labelX: '66%', labelFont: 13,
        },
        scanH: 40,
      });
      const callCard = i => makeResultCard(root, isLLM(i), isLLM(i) ? 'LLM CALL' : 'TOOL CALL');
      s.saveCards = HISTORY.map((_, i) => callCard(i));
      s.reuseCards = HISTORY.slice(0, 6).map((_, i) => callCard(i));
      s.bill2 = makeCoinBill(root, BILL2.w, [neonCoin, neonCoin, neonCoin, neonCoin]);
      s.bill2.note.style.color = C.neon;
      s.crash2 = makeCrashMarks(root, 'App crash', { x: APP.x + 300, y: APP.y - 250, size: 110 },
        { x: LOOP.cx, y: LOOP.cy, w: 280 });
      s.newTag = makeNewTag(root, 'New app instance', 300);
      s.flash2 = makeFlash(root);
      s.complete = tag(root, 'Agent complete', 'neon solid');

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
      // WITHOUT TEMPORAL on the failed run's outcome, WITH TEMPORAL on the durable run, both in the loop's middle
      s.without = tag(root, 'Without Temporal', 'red big solid');
      s.withT = tag(root, 'With Temporal', 'uv big solid');
      // the VCR rewind: an on-screen display in the corner (two rewind triangles and REWIND, then PLAY) with a
      // timecode, tracking noise bands and scanlines over the stage
      const tri = (x, dir) => `<path d="M${x} 2 L${x + 18 * dir} 15 L${x} 28 Z"/>`;
      s.osd = E(root,
        `<svg class="rw" width="40" height="30" viewBox="0 0 40 30" fill="${C.ink}">${tri(20, -1)}${tri(38, -1)}</svg>`
        + `<svg class="pl" width="40" height="30" viewBox="0 0 40 30" fill="${C.ink}">${tri(8, 1)}</svg>`
        + '<span class="lb">REWIND</span><span class="tc" style="margin-left:26px;color:var(--slate)"></span>',
        'mono', {
          fontSize: '34px', letterSpacing: '.1em', color: C.ink, display: 'flex', alignItems: 'center', gap: '16px',
          textShadow: '2px 0 0 rgba(255,90,95,.6), -2px 0 0 rgba(68,76,231,.6)', whiteSpace: 'nowrap',
        });
      s.osd.rw = s.osd.querySelector('.rw'); s.osd.pl = s.osd.querySelector('.pl');
      s.osd.lb = s.osd.querySelector('.lb'); s.osd.tc = s.osd.querySelector('.tc');
      s.vcrBands = [0, 1, 2].map(() => E(root, '', '', {
        width: '2400px',
        background: 'repeating-linear-gradient(90deg, rgba(248,250,252,.5) 0 3px, rgba(248,250,252,0) 3px 9px, '
          + 'rgba(148,163,184,.35) 9px 11px, rgba(248,250,252,0) 11px 17px)',
      }));
      s.vcrLines = E(root, '', '', {
        width: '2400px', height: '1400px',
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.4) 0 2px, rgba(0,0,0,0) 2px 4px)',
      });
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
      const clearAt = c[3], cardOut = c[4] - 0.7;
      const condenseEnd = c[4] + 0.3;
      // the durable run: steps 1 to 3, each LLM call and tool result saved in the Event History (the card leaves
      // the loop, lands on its row, the row turns SAVED); then the crash before the invite, a new app instance
      // that replays the six saved rows (nothing re-billed, nothing re-run), and the invite, run for real
      const durableIn = c[4] - 0.2;
      const runAt = [0, 1, 2].map(i => c[4] + 1.4 + i * 2.2);
      // A leaves once dead, and is gone before B slides into its place
      const crash2 = c[5] + 0.6, aOut = crash2 + 1.1, bOn = crash2 + 1.7;
      const replay = [0, 1, 2, 3, 4, 5].map(k => c[5] + 3.3 + k * 0.45);
      const told = replay.map((_, k) => c[5] + 6.2 + k * 0.1);
      const inviteAt = c[5] + 6.7, complete = inviteAt + 2.2;
      const stepAt = [...runAt, inviteAt];
      // when each history row is written: its LLM call 0.9 s into the turn, its tool result 1.7 s into it
      const saved = HISTORY.map((_, i) => stepAt[Math.floor(i / 2)] + (isLLM(i) ? 0.9 : 1.7));
      const turns = [...[...firstRun, lastTurn].map(a => [a, TURN]), ...rerun.map(a => [a, RERUN_TURN]),
        ...stepAt.map(a => [a, D_TURN])];
      const [ax, ay] = shakeAt(t, crash2);
      // the failed run, then its VCR rewind: WITHOUT TEMPORAL holds on its outcome, then the tape rewinds it fast to
      // its start (empty steps, nothing billed), stops and plays; the failed run's states read the tape's clock tf,
      // which runs backwards during the rewind and stays at the start until the durable part takes over
      const withoutAt = rerun[2] + RERUN_TURN - 0.4;
      const vcrAt = c[2] + 1.0, vcrEnd = vcrAt + 3.0;
      const tapeStart = firstRun[0] - 0.05;
      let tf = t;
      if (t >= vcrAt && t < durableIn) {
        tf = t < vcrEnd ? lerp(vcrAt, tapeStart, ease(P(t, vcrAt, vcrEnd - vcrAt, x => x))) : tapeStart;
      }
      const crashed = tf >= crashAt && tf < restart;
      const glitch = crashGlitch(t, crashAt + 0.35);
      const [sx, sy] = shakeAt(t, crashAt);

      // where the token is on the loop, in degrees from the top; null between turns and after the crash
      let deg = null;
      turns.forEach(([a, d]) => {
        if (tf >= a && tf < a + d && !crashed) deg = -90 + 360 * ease((tf - a) / d);
      });
      const frozenDeg = -90 + 360 * ease((crashAt - lastTurn) / TURN);
      // the rewind: from where the crash caught it, the token runs backwards a full turn, back to THINK
      const rewinding = tf >= restart && tf < rewindAt + 1.4;
      if (rewinding) deg = lerp(frozenDeg, -90 - 360, ease(P(tf, rewindAt, 1.2, x => x)));

      // the arcs stay whole through the impact, are shards from the break until the pieces fly back
      const shattered = tf >= breakAt && tf < restart;
      const dim = P(tf, breakAt, 0.6) * (1 - P(tf, restart - 0.6, 0.6));
      const gx = sx + glitch.dx;
      placeAgentLoop(s.loop, tf, loopAt, {
        deg: crashed ? null : deg, centerAt: c[0] + 1.2, centerO: 1 - win(tf, crashAt, restart + 2.0, 0.25),
        arcO: shattered ? 0 : 1, q: crashed ? P(tf, crashAt + 0.2, 0.3) : 0, dx: gx + ax, dy: sy + ay,
        // THINK is there from the first frame: the previous chapter's AI hub turned into it
        thinkIn: -1,
        // the loop clears for the message card, comes back inside the Temporal ring, and dims while its app is down
        o: (1 - P(t, clearAt, 0.5) * (1 - P(t, c[4] - 0.4, 0.5))) * (1 - 0.6 * win(t, crash2, bOn + 0.4, 0.3)),
      });
      if (t >= clearAt) {
        // AGENTIC LOOP gives way to the crash tag and the NEW APP INSTANCE tag, then to AGENT COMPLETE
        s.loop.center.style.opacity = (parseFloat(s.loop.center.style.opacity)
          * (1 - win(t, crash2, replay[0] + 0.2, 0.2)) * (1 - P(t, complete, 0.3))).toFixed(3);
      }
      // the token stops dead where the crash caught it, then fades out as the loop breaks
      if (crashed) {
        const [x, y] = s.loop.pos(frozenDeg);
        place(s.loop.token, x + gx, y + sy, 1, 1 - P(tf, breakAt, 0.8));
      }
      // the nodes dim to red while the loop is broken
      [s.loop.act, s.loop.observe].forEach(e => {
        e.style.borderColor = dim > 0.5 ? C.red : (e === s.loop.act ? C.neon : C.uv);
        e.style.opacity = (parseFloat(e.style.opacity) * (1 - 0.4 * dim)).toFixed(3);
      });
      s.loop.think.root.style.filter = dim > 0 ? `grayscale(${(0.7 * dim).toFixed(3)})` : '';
      s.loop.labels.forEach(e => { e.style.color = dim > 0.5 ? C.red : 'var(--ink)'; });
      // the shards drift and fall slowly through the break, rest dimmed, then fly back into place at the restart
      const fallT = clamp((tf - breakAt) / 1.2) * 1.2 * (1 - P(tf, restart - 0.6, 0.6));
      s.shards.forEach(shard => {
        const dx = shard.vx * fallT * 0.5, dy = shard.vy * fallT * 0.5 + 110 * fallT * fallT;
        shard.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)}) `
          + `rotate(${(shard.spin * fallT * 0.5).toFixed(2)} ${shard.mid[0]} ${shard.mid[1]})`);
        draw(shard, 1, shattered ? 1 - 0.6 * P(tf, lossAt, 0.6) * (1 - P(tf, restart - 0.6, 0.3)) : 0);
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
      s.svg.style.transform = `translate(${sx + ax}px,${sy + ay}px)`;
      // the restart banner, over the loop as it re-forms, its rewind icon turning backwards
      const rp = P(tf, restart - 0.3, 0.45, backOut);
      place(s.restartTag, LOOP.cx, LOOP.cy - 20, rp, clamp(rp * 2) * (1 - P(tf, restart + 1.9, 0.3)));
      s.restartTag.rw.style.transform = `rotate(${(-200 * Math.max(0, tf - restart + 0.3)).toFixed(1)}deg)`;
      // the agent also waits for a person: said in the first subtitle
      const wp = P(tf, firstRun[2] + 0.4, 0.45, backOut);
      place(s.wait, LOOP.cx, WAIT_Y, wp, clamp(wp * 2) * (1 - P(tf, c[1] + 0.2, 0.4)));

      // the goal and its steps, as in durable-ai-agents: each row slides in during its turn, highlighted while it
      // runs, its result and check showing as the turn ends
      const sideOut = P(t, clearAt, 0.5);
      placeStepList(s.list, tf, {
        x: LIST.x + sx, goalY: LIST.goalY + sy, rowY: LIST.rowY + sy, gap: LIST.gap, goalAt: c[0] + 0.3,
        turnStarts: [...firstRun, c[1] + 99], turn: TURN, o: 1 - sideOut,
      });
      // the loss: each done row, top to bottom, has its result corrupted, then dissolving into falling particles,
      // its check turned into a red cross that vanishes, and greys out until the agent redoes it from step 1
      s.list.rows.slice(0, 3).forEach((r, i) => {
        const step = LUNCH_STEPS[i];
        const at = lossAt + i * 0.35, redo = rerun[i];
        const corrupt = tf >= at && tf < at + 0.35;
        const text = corrupt ? scramble(step.result, step.result.length, Math.floor((G - this.start) * 20))
          : step.result;
        if (r.res.textContent !== text) r.res.textContent = text;
        r.res.style.color = corrupt ? C.red : C.neon;
        if (tf >= at && tf < redo) {
          const gone = P(tf, at + 0.35, 0.3);
          r.res.style.opacity = 1 - gone;
          r.res.style.transform = `translateY(${(gone * 10).toFixed(2)}px)`;
          r.ck.style.opacity = 0;
          r.ko.style.opacity = 1 - P(tf, at + 0.6, 0.3);
          r.style.opacity = ((1 - 0.55 * P(tf, at + 0.3, 0.4)) * (1 - sideOut)).toFixed(3);
          // the wipe passes the row, bottom to top, and leaves it an empty step to do again
          const cleared = P(tf, wipeAt + (2 - i) * 0.2, 0.25);
          if (cleared > 0) {
            r.style.opacity = (lerp(0.45, 1, cleared) * (1 - sideOut)).toFixed(3);
            r.style.color = C.slate;
          }
        } else {
          r.res.style.transform = '';
          r.ko.style.opacity = 0;
          if (tf >= redo) {
            // rerun: RUNNING AGAIN while its turn runs, then its result and check
            r.style.color = '';
            r.res.style.opacity = P(tf, redo + 1.4, 0.3);
            r.ck.style.opacity = P(tf, redo + 1.55, 0.25);
            r.style.borderColor = (tf > redo && tf < redo + RERUN_TURN) ? C.violet : C.line;
          }
        }
        r.again.style.opacity = tf >= redo ? win(tf, redo + 0.1, redo + 1.45, 0.2) : 0;
        // the particles of the result fall and fade
        const f = P(tf, at + 0.35, 0.8, x => x);
        r.dust.forEach(e => {
          const x0 = LIST.x - 244 + e.u * 190, y0 = LIST.rowY + i * LIST.gap + 14;
          place(e, x0 + e.drift * f + sx, y0 + 50 * f + 90 * f * f + sy, 1, f > 0 && f < 1 ? 1 - f : 0);
        });
      });
      // the wipe: a bar of light sweeps up the list, from under step 3 to over step 1
      const wp2 = P(tf, wipeAt, 0.6, x => x);
      place(s.wipe, LIST.x + sx, lerp(LIST.rowY + 2 * LIST.gap + 50, LIST.rowY - 50, wp2) + sy, 1,
        wp2 > 0 && wp2 < 1 ? 1 : 0);
      // RUN 1, then RUN 2 in red after the restart, with a swell
      const run2 = tf >= wipeAt + 0.6;
      if (s.run.textContent !== (run2 ? 'RUN 2' : 'RUN 1')) s.run.textContent = run2 ? 'RUN 2' : 'RUN 1';
      s.run.style.color = s.run.style.borderColor = run2 ? C.red : C.uv;
      s.run.style.transform = `scale(${swell(tf, wipeAt + 0.6, 0.25)})`;
      // PROGRESS LOST pops over the broken loop with a jolt and a glow, and holds until the restart
      const lp = P(tf, lostAt, 0.45, backOut);
      const [jx, jy] = shakeAt(t, lostAt - 0.1);
      place(s.lost, LOOP.cx + jx * 0.6, LOOP.cy - 20 + jy * 0.6, lp, clamp(lp * 2) * (1 - P(tf, restart - 0.6, 0.3)));

      // the bill keeps adding up: the calls made again after the crash are paid a second time, a coin each
      const calls = placeCoins(s.bill, tf, [...firstRun, ...rerun]);
      const paidAgain = calls - firstRun.length;
      s.bill.n.style.color = paidAgain > 0 ? C.red : C.ink;
      s.bill.note.textContent = paidAgain > 0 ? `+${paidAgain} PAID AGAIN` : '';
      // the bill stands out while the subtitle says what each call costs
      s.bill.style.borderColor = win(tf, c[1] + 0.2, c[1] + 2.4, 0.3) > 0.5 ? C.violet : C.line;
      // the money spent is not lost: the bill stays in place, fully visible, through the whole crash
      rise(s.bill, LIST.x, BILL_Y, P(t, c[0] + 0.6, 0.5) * (1 - sideOut));
      placeFlash(s.flash, t, crashAt);

      // the durable part. The app instances: A runs the loop, crashes before the invite and leaves; B slides into
      // its place, replays the history, then runs the invite
      const aIn = P(t, durableIn, 0.5);
      const leaving = leavingInstance(t, aOut);
      place(s.appA, APP.x + ax, APP.y + ay + leaving.dy, 1, aIn * leaving.o);
      s.appA.style.filter = t >= crash2 ? leaving.grey || 'none' : '';
      if (t >= crash2) setAppStatus(s.appA, 'CRASHED', 'crashed');
      else setAppStatus(s.appA, t >= runAt[0] ? 'RUNNING THE AGENT' : '', t >= runAt[0] ? 'running' : 'idle');
      const arriving = arrivingInstance(t, bOn);
      place(s.appB, APP.x + arriving.dx, APP.y, 1, t >= bOn ? arriving.o : 0);
      if (t < replay[0]) setAppStatus(s.appB, 'TAKING OVER', 'idle');
      else if (t < told[0]) setAppStatus(s.appB, 'REPLAYING…', 'running');
      else if (t < complete) setAppStatus(s.appB, 'RUNNING THE AGENT', 'running');
      // AGENT COMPLETE shows in the loop: the status just reads DONE
      else setAppStatus(s.appB, 'DONE', 'idle');
      setArrivalGlow(s.appB, t, bOn, bOn + 1.6);
      placeNewTag(s.newTag, t, bOn + 0.3, replay[0], LOOP.cx + arriving.dx, LOOP.cy);
      placeCrashMarks(s.crash2, t, crash2, crash2 + 0.3, aOut, ax, ay);
      placeFlash(s.flash2, t, crash2);
      const cp2 = P(t, complete, 0.45, backOut);
      place(s.complete, LOOP.cx, LOOP.cy, cp2, clamp(cp2 * 2));

      // Temporal, outside the app, with the Event History: untouched by the crash
      place(s.outside, OUTSIDE.x, OUTSIDE.y, 1, P(t, durableIn + 0.4, 0.5));
      place(s.history, HIST.x, HIST.y, 1, P(t, durableIn + 0.6, 0.5));
      // each result leaves the loop (an LLM call from THINK, a tool result from ACT), lands on its row, saved
      const [thx, thy] = s.loop.pos(LOOP_DEG.think), [acx, acy] = s.loop.pos(LOOP_DEG.act);
      s.saveCards.forEach((e, i) => {
        const at = saved[i] - 0.45;
        const [fx, fy] = isLLM(i) ? [thx, thy] : [acx, acy];
        fly(e, t, at, fx, fy, at + 0.05, 0.4, CARD_X, rowMid(i), at + 0.45, CARD_X, rowMid(i));
      });
      // the replay: each saved row hands its result back to the loop
      s.reuseCards.forEach((e, i) => {
        const q = replay[i];
        const [tx2, ty2] = isLLM(i) ? [thx, thy] : [acx, acy];
        fly(e, t, q, CARD_X, rowMid(i), q + 0.05, 0.3, tx2, ty2, q + 0.35, tx2, ty2);
      });
      markCrash(s.history, P(t, crash2 + 0.7, 0.4), P(t, crash2 + 0.3, 0.3));
      s.history.rows.forEach((r, i) => showRow(r, P(t, saved[i] - 0.1, 0.3)));
      s.history.tags.forEach((e, i) => {
        const isReused = i < 6 && t >= replay[i], isTold = i < 6 && t >= told[i];
        if (isTold) setStatus(e, isLLM(i) ? 'REUSED, NOT RE-BILLED' : 'REUSED, NOT RE-RUN', 'reused');
        else if (isReused) setStatus(e, 'REUSED', 'reused');
        else setStatus(e, 'SAVED', 'saved');
        const switchedAt = isTold ? told[i] : isReused ? replay[i] : saved[i];
        e.style.opacity = P(t, saved[i], 0.25);
        e.style.transform = `scale(${swell(t, switchedAt, 0.14)})`;
      });
      const scanning = replay.findIndex(q => t >= q && t < q + 0.45);
      setScan(s.history, HIST.row0 - 2 + Math.max(0, scanning) * HIST.gap, scanning >= 0 ? 1 : 0);

      // the bill of the durable run: one call per step, 3 before the crash, none on the replay, then the invite:
      // 4 calls instead of the failed run's 7
      placeCoins(s.bill2, t, stepAt);
      const notBilled = win(t, replay[0], inviteAt, 0.3);
      const finalNote = P(t, c[6] + 0.8, 0.4);
      // next to the big count: "4 INSTEAD OF 7", the failed run's 6 calls plus the invite it never reached
      const note = finalNote > 0 ? 'INSTEAD OF 7' : notBilled > 0 ? 'NOT RE-BILLED' : '';
      if (s.bill2.note.textContent !== note) s.bill2.note.textContent = note;
      s.bill2.note.style.opacity = Math.max(notBilled, finalNote);
      s.bill2.style.borderColor = notBilled > 0.5 || finalNote > 0.5 ? C.neon : C.line;
      rise(s.bill2, BILL2.x, BILL2.y, P(t, durableIn + 0.8, 0.5));

      // WITHOUT TEMPORAL holds on the failed run's outcome until the rewind; WITH TEMPORAL on the durable run's
      // first steps
      const wo = P(t, withoutAt, 0.45, backOut);
      place(s.without, LOOP.cx, LOOP.cy, wo, clamp(wo * 2) * (1 - P(t, vcrAt - 0.2, 0.3)));
      const wi = P(t, durableIn + 0.8, 0.45, backOut);
      place(s.withT, LOOP.cx, LOOP.cy, wi, clamp(wi * 2) * (1 - P(t, crash2 - 0.4, 0.3)));
      // AGENTIC LOOP gives way to either tag
      if ((t >= withoutAt && t < vcrAt) || (t >= durableIn + 0.8 && t < crash2)) s.loop.center.style.opacity = 0;

      // the VCR rewind: REWIND blinks in the corner over a timecode running backwards, noise bands roll over the
      // stage with scanlines and a color fringe; then the tape stops (a jolt) and PLAY shows for a moment
      const vcrOn = t >= vcrAt - 0.15 && t < vcrEnd + 0.9;
      const rolling = t >= vcrAt && t < vcrEnd;
      const frame = Math.floor(t * 24);
      // the stage's top left under the header, in the scene (shifted by [-62, 14] then)
      const OSD = { x: 160 + 200 + 62, y: 190 - 14 };
      s.osd.style.opacity = 0;
      if (vcrOn) {
        const playing = t >= vcrEnd;
        place(s.osd, OSD.x, OSD.y, 1, playing ? 1 - P(t, vcrEnd + 0.6, 0.3) : (Math.floor(t * 3) % 2 ? 1 : 0.55));
        s.osd.rw.style.display = playing ? 'none' : 'block';
        s.osd.pl.style.display = playing ? 'block' : 'none';
        const label = playing ? 'PLAY' : 'REWIND';
        if (s.osd.lb.textContent !== label) s.osd.lb.textContent = label;
        // the tape's timecode, h:mm:ss:ff, from the failed run's start
        const tape = Math.max(0, tf - tapeStart), fr = Math.floor((tape % 1) * 30);
        const tc = `0:00:${String(Math.floor(tape)).padStart(2, '0')}:${String(fr).padStart(2, '0')}`;
        if (s.osd.tc.textContent !== tc) s.osd.tc.textContent = tc;
      }
      const noise = rolling ? 1 : win(t, vcrEnd, vcrEnd + 0.25, 0.05);
      s.vcrBands.forEach((e, i) => {
        e.style.height = Math.round(30 + hash(frame * 3 + i) * 60) + 'px';
        const y = ((frame * 37 + i * 400 + Math.floor(hash(frame + i * 7) * 120)) % 1300) - 110;
        place(e, 960 + 62, y - 14, 1, noise * 0.35);
      });
      place(s.vcrLines, 960 + 62, 540 - 14, 1, noise * 0.3);
      const fringe = Math.round(noise * (3 + 4 * hash(frame)));
      const stopJolt = t >= vcrEnd && t < vcrEnd + 0.2 ? Math.round(18 * (1 - (t - vcrEnd) / 0.2)) : 0;
      if (noise > 0.01 || stopJolt) {
        s.cam.style.filter = `drop-shadow(${fringe}px 0 0 rgba(255,90,95,.55)) drop-shadow(${-fringe}px 0 0 `
          + 'rgba(68,76,231,.55))';
        s.cam.style.transform += ` translateY(${stopJolt}px)`;
      } else {
        s.cam.style.filter = '';
      }

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
