// ===================== 4. WHY IT MATTERS FOR AI
// The block keeps every name declared in this file local to this scene.
{
  // The agentic loop on the left (think, act, observe, as in durable-ai-agents); on the right the agent's goal and
  // its steps, as in durable-ai-agents chapter 5, a coin on each step for its LLM call. After the crash and the VCR
  // rewind, the loop runs durably in an app instance, its steps saved in an Event History outside the app, as in
  // durable-ai-agents chapter 7: a second crash, a new instance takes over and replays, nothing is paid twice
  const LOOP = AGENT_LOOP;
  const TURN = 1.5; // seconds per turn of the loop, one step each, as in durable-ai-agents
  const RERUN_TURN = 2.0; // the reruns after the restart run slower, so each step paid again reads
  const COMET = 6; // sparks trailing the token
  const SHARDS_PER_ARC = 4; // the pieces each arc breaks into at the crash
  // the loop shows at 80% of its size for the whole chapter, centered in its app panel (scene pixels)
  const DL = AGENT_PLACE;
  // a point of the loop (from s.loop.pos) where it shows on the stage of the scene
  const durablePos = ([x, y]) => [DL.x + (x - LOOP.cx) * DL.k, DL.y + (y - LOOP.cy) * DL.k];
  // a point of the loop moved to the nearest one that shows on a whole pixel of the stage
  const snapToPixel = ([x, y]) => [Math.round(x * DL.k) / DL.k, Math.round(y * DL.k) / DL.k];

  // Scene pixels; the shift [10, 0] puts the stage 10 px to the right. The app panel spans the content frame (y 150
  // to 880) around the loop, in both runs; the right column starts one GUTTER right of it, 800 px wide (x 932 to
  // 1732 on screen), for both runs: the switch at PLAY keeps its edges in place
  const APP = { x: DL.x, y: 515, w: 704, h: 730 };
  const GUTTER = 40;
  const RIGHT = { x: APP.x + APP.w / 2 + GUTTER + 400, w: 800 };

  // The failed run's column: the goal card and the four step rows, as wide and as high, GAP apart, spanning the app
  // panel's height: its top and bottom edges are the panel's. The crash hits while step 4 (the invite) runs
  const ROW_H = 118;
  const GAP = 35;
  const COLUMN_TOP = APP.y - APP.h / 2;
  const LIST = {
    x: RIGHT.x, w: RIGHT.w, goalY: COLUMN_TOP + ROW_H / 2, rowY: COLUMN_TOP + ROW_H + GAP + ROW_H / 2,
    gap: ROW_H + GAP,
  };
  // The coin of each step's LLM call, on its row: a flat disc seen slightly from the side, its right edge 20 px left
  // of the row's check (22 px from the row's right, 32 px wide); a call made again stacks a red coin STEP px above.
  // The row's RUNNING AGAIN and PAID AGAIN labels end 20 px left of the coins (px from the row's right)
  const COIN = { w: 40, h: 16, step: 8, x: RIGHT.x + RIGHT.w / 2 - 22 - 32 - 20 - 20 };
  const ROW_LABEL_RIGHT = 22 + 32 + 20 + COIN.w + 20;

  // The durable part's right column: the Temporal panel, as high as the app panel; inside it, under its header
  // (70 px), the Event History card 20 px from the panel's sides, then the slot of one pill at a time (a callout,
  // then NO PROGRESS LOST), CALLOUT_GAP clear of the card and of the panel's bottom. The card's header, rows and
  // tags sit 26 px inside it on every side
  const OUTSIDE = { x: RIGHT.x, y: APP.y, w: RIGHT.w, h: APP.h };
  const HIST_INSET = 20, HIST_TOP = 70, HIST_PAD = 26, CALLOUT_H = 50, CALLOUT_GAP = 30;
  const HIST_H = OUTSIDE.h - HIST_TOP - 2 * CALLOUT_GAP - CALLOUT_H;
  const HIST = {
    x: OUTSIDE.x, y: OUTSIDE.y - OUTSIDE.h / 2 + HIST_TOP + HIST_H / 2, w: OUTSIDE.w - 2 * HIST_INSET, h: HIST_H,
    row0: 78, gap: 58, rowH: 40,
  };
  const CALLOUT_Y = OUTSIDE.y + OUTSIDE.h / 2 - CALLOUT_GAP - CALLOUT_H / 2;
  // the VCR rewind starts VCR_IN after its subtitle and runs VCR_D; the durable part enters half a second after it,
  // as PLAY shows
  const VCR_IN = 0.4, VCR_D = 3.0;
  const DURABLE_AFTER_REWIND = VCR_IN + VCR_D + 0.5;
  // Each durable turn, slow enough to follow the Event History (seconds into the turn): the LLM CALL card leaves
  // THINK and lands on its row at llm, the row turns SAVED, highlighted for HOLD; the TOOL CALL card leaves ACT,
  // lands at tool and its row holds the same; a card flies FLIGHT seconds
  const D_TURN = { d: 3.2, llm: 0.95, tool: 2.35 };
  const HOLD = 0.6, FLIGHT = 0.7;
  // the replay hands back one saved row a second
  const REPLAY_STEP = 1.0;
  // the Event History rows: the LLM call of each step, then its tool's result
  const HISTORY = LUNCH_STEPS.flatMap(step => [
    `LLM call: ${step.action[0].toLowerCase()}${step.action.slice(1)}`, `${step.tool}: ${step.result}`,
  ]);
  const isLLM = i => i % 2 === 0;
  // stage-free row geometry: the middle of row i, and where a result card lands on it and leaves it: by its left
  // end, in the gutter, the card's right edge 6 px left of the row's number, so it never covers the row's text
  const rowMid = i => HIST.y - HIST.h / 2 + HIST.row0 + i * HIST.gap + HIST.rowH / 2;
  const CARD_W = 136;
  const CARD_X = HIST.x - HIST.w / 2 + 36 - 6 - CARD_W / 2;

  // A coin for a row, in the colors [face, rim]
  const makeCoin = (root, [face, rim]) => E(root,
    `<svg width="${COIN.w}" height="${COIN.h}" viewBox="0 0 64 26" style="display:block;overflow:visible">`
    + `<path d="M1 9v8a31 8 0 0 0 62 0V9" fill="${rim}"/>`
    + `<ellipse cx="32" cy="9" rx="31" ry="8" fill="${face}"/>`
    + '<ellipse cx="32" cy="9" rx="20" ry="4.5" fill="none" stroke="rgba(20,20,20,.35)" stroke-width="1.5"/>'
    + '</svg>');
  // A coin paid at `at` drops 16 px onto its place (x, y) with a small bounce; o: its opacity, k: its scale
  function placeCoin(e, t, at, x, y, o, k = 1) {
    const land = P(t, at, 0.3, easeIn);
    const bounce = Math.round(Math.sin(Math.PI * clamp((t - at - 0.3) / 0.2)) * 3);
    place(e, x, y - Math.round((1 - land) * 16) - bounce, k, P(t, at, 0.1) * o);
  }

  scene({
    chapter: 4, title: 'Why it matters for AI',
    holdBeforeEnd: CAMERA_EXIT, // presenter mode holds before the exit zoom
    fadeIn: 0.001, // a hard cut: the previous chapter ends on this chapter's first frame
    shift: AGENT_START.shift,
    subs: [
      {
        text: "AI agents are long processes too: many LLM calls, tools to run, and waits for a person.",
        after: 0.4,
      },
      {
        text: "Every LLM call costs time and money. Without Durable Execution, a crash means starting over.",
        // the crash plays in held stages, then the takeover by app B and a held restart, the three steps run again,
        // slower, then the statement holds over the dimmed run
        after: 14.2,
      },
      // the failed run is rewound like a tape, back to its start; then the durable part enters beside the loop
      { text: "Let's rewind and run the same agent with Temporal.", after: 1.5 },
      // the durable agent: every step saved, slowly enough to follow (three turns), a crash, a takeover that
      // replays the history row by row and pays nothing twice, then the invite and AGENT COMPLETE
      {
        text: "With Temporal, every step the agent takes is saved in an Event History, outside the app.",
        after: 4.5,
      },
      {
        text: "After a crash, the agent gets its saved results back and resumes at the invite: nothing is paid twice.",
        after: 8.8,
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
      // the loop, its arcs and its token's tail on one layer, scaled as a whole
      s.loopLayer = E(root, '', '', {
        width: '1920px', height: '1080px', transformOrigin: `${LOOP.cx}px ${LOOP.cy}px`,
      });
      s.loopLayer.style.opacity = 1;
      s.svg = svgLayer(s.loopLayer);
      s.loop = makeAgentLoop(s.loopLayer, s.svg, LOOP.cx, LOOP.cy, LOOP.r);
      // the nodes and labels at the nearest point that the layer's scale takes to a whole screen pixel, so the
      // tiles rest on whole pixels: ACT and OBSERVE sit at fractional points of the circle
      s.loop.nodePos = deg => snapToPixel(s.loop.pos(deg));
      // A transparent outline widens what Chromium repaints when a tile's opacity changes: in the scaled layer the
      // tile's anti-aliased edge spills one pixel outside the box it repaints, and would keep the dimmed paint of
      // an earlier frame, so a frame would depend on the frames rendered before it
      [s.loop.act, s.loop.observe].forEach(e => { e.style.outline = '3px solid transparent'; });
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
      s.comet = Array.from({ length: COMET }, (_, k) => makeSpark(s.loopLayer, 16 - 2 * k, '219,255,75'));
      // the token and its comet pass under the nodes, THINK's face included: moved before the first node, in order
      [s.loop.token, ...s.comet].forEach(e => s.loopLayer.insertBefore(e, s.loop.think.root));
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
      // the goal card as wide as the rows (cards are 640 px at most) and as high, its text centered vertically
      Object.assign(s.list.goal.style, {
        maxWidth: 'none', height: ROW_H + 'px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      });
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
      // the big PROGRESS LOST label of the crash, over the broken loop; an even width rests on whole pixels centered
      s.lost = E(root, 'Progress lost', 'mono', {
        width: '504px', textAlign: 'center', fontSize: '44px', letterSpacing: '.14em',
        paddingLeft: 'calc(34px + .14em)', paddingRight: '34px',
        lineHeight: '84px', textTransform: 'uppercase', color: C.red, background: 'var(--red-solid)',
        border: '3px solid ' + C.red, borderRadius: 'var(--r)', whiteSpace: 'nowrap',
        boxShadow: '0 0 40px rgba(255,90,95,.55)',
      });
      // each done row's check turns into a red cross as its result is lost, and the result dissolves into particles
      s.list.rows.forEach((r, i) => {
        r.insertAdjacentHTML('beforeend', '<div class="ko" style="position:absolute;right:22px;top:50%;'
          + `margin-top:-16px;opacity:0">${ICON('x', 32, C.red, 2.6)}</div>`);
        r.ko = r.querySelector('.ko');
        // RUNNING AGAIN while the row's step runs again, then PAID AGAIN, left of the row's coins
        const rowLabel = (cls, color, text) => r.insertAdjacentHTML('beforeend', `<div class="${cls} mono" `
          + `style="position:absolute;right:${ROW_LABEL_RIGHT}px;top:50%;transform:translateY(-50%);font-size:15px;`
          + `letter-spacing:.12em;color:${color};opacity:0">${text}</div>`);
        rowLabel('again', 'var(--violet)', 'RUNNING AGAIN');
        rowLabel('paid', 'var(--red)', 'PAID AGAIN');
        r.again = r.querySelector('.again');
        r.paid = r.querySelector('.paid');
        r.dust = Array.from({ length: 8 }, (_, k) => {
          const e = makeSpark(root, 4 + Math.round(hash(i * 40 + k) * 3), k % 2 ? '219,255,75' : '255,90,95');
          Object.assign(e, { u: hash(i * 40 + k + 7), drift: (hash(i * 40 + k + 13) - 0.5) * 60 });
          return e;
        });
      });
      // the coins of steps 1 to 3, over their rows, so they stay bright while the rows dim: a neon coin for the
      // first run's LLM call, a red one for the call made again
      const neonCoin = [C.neon, C.neonDark], redCoin = [C.red, '#B83B3F'];
      s.coins = [0, 1, 2].map(() => ({ first: makeCoin(root, neonCoin), again: makeCoin(root, redCoin) }));
      s.flash = makeFlash(root);

      // the durable part: Temporal with the Event History, outside the app (rows 1 to 6 survive the crash), the
      // result cards between the loop and the history, the callouts under it, the crash marks and the takeover tag
      s.outside = makeTemporalPanel(root, OUTSIDE.w, OUTSIDE.h, { logoAt: [24, 20], noteAt: [24, 25], font: 18 });
      const rowsHtml = HISTORY.map((text, i) => `<span style="color:${isLLM(i) ? C.uv : '#141414'}">${text}</span>`);
      s.history = makeHistoryCard(root, rowsHtml, {
        w: HIST.w, h: HIST.h, headerTop: HIST_PAD, rowTop: i => HIST.row0 + i * HIST.gap, font: 20,
        rowH: HIST.rowH, tagTop: i => HIST.row0 + (HIST.rowH - 28) / 2 + i * HIST.gap, tagRight: HIST_PAD,
        tag: { border: false },
        // the kept block runs from 6 px above row 1 to 4 px under row 6; the crash line sits halfway to row 7
        crash: {
          keptTop: HIST.row0 - 6, keptH: 5 * HIST.gap + HIST.rowH + 10,
          cutTop: HIST.row0 + 5 * HIST.gap + HIST.rowH + (HIST.gap - HIST.rowH) / 2 - 1,
          label: 'APP CRASHED HERE', labelX: '66%', labelFont: 13,
        },
        scanH: HIST.rowH + 8,
      });
      // both kinds of card as wide, so they line up by their right edge in the gutter
      const callCard = i => {
        const e = makeResultCard(root, isLLM(i), isLLM(i) ? 'LLM CALL' : 'TOOL CALL');
        Object.assign(e.style, { width: CARD_W + 'px', textAlign: 'center' });
        return e;
      };
      s.saveCards = HISTORY.map((_, i) => callCard(i));
      s.reuseCards = HISTORY.slice(0, 6).map((_, i) => callCard(i));
      // one callout at a time under the history, each a fixed even width, so it rests on whole pixels centered
      const callout = (text, kind, w) => {
        const e = tag(root, text, kind);
        Object.assign(e.style, { width: w + 'px', textAlign: 'center' });
        return e;
      };
      s.savedNote = callout('Saved outside the app', 'uv', 380);
      s.keptNote = callout('History kept', 'uv', 240);
      // NO PROGRESS LOST, the durable run's answer to the failed run's PROGRESS LOST: a neon pill with a soft glow
      s.noLoss = callout('No progress lost', 'neon solid', 300);
      s.noLoss.style.boxShadow = '0 0 28px rgba(219,255,75,.35)';
      // the tags in the durable loop's middle sit 30 px above it, clear of the ACT and OBSERVE tiles
      s.crash2 = makeCrashMarks(root, 'App crash', { x: DL.x + 250, y: DL.y - 240, size: 110 },
        { x: DL.x, y: DL.y - 30, w: 280 });
      s.newTag = makeNewTag(root, 'New app instance', 300);
      s.flash2 = makeFlash(root);
      s.complete = tag(root, 'Agent complete', 'neon solid');
      s.complete.style.width = '256px'; // even, so it rests on whole pixels once centered

      // the statement before the rewind, over a scrim that dims the failed run: two lines in the brand font,
      // "doesn't survive" in red; built under the VCR display, which shows over the scrim
      s.scrim = E(root, '', '', { width: '2400px', height: '1400px', background: 'var(--bg)' });
      s.msg = E(root, 'Without Temporal, an AI agent<br>'
        + `<span style="color:${C.red}">doesn't survive</span> a production incident.`, '', {
        width: '1600px', textAlign: 'center', fontSize: '60px', lineHeight: '75px', fontWeight: 700, color: C.ink,
      });
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
    },
    update(t, c, s) {
      // the scene opens on the LLM node the previous chapter's AI hub turned into, at its final place and size, with
      // its halo; no entrance zoom, so the node never moves: the halo fades into the LLM's own glow and the rest of
      // the loop emerges around it
      setCamera(s.cam, t, this.dur, { enter: 1 });
      place(s.carry, ...durablePos(s.loop.pos(LOOP_DEG.think)), 1, HANDOFF_HALO.o * (1 - P(t, 0.2, 1.0)));
      // each turn runs the loop once, think -> act -> observe, for one step, and pays one LLM call as it starts:
      // steps 1 to 3, then the crash before step 4 (the invite), then the agent starts over and redoes steps 1 to 3
      // the first turn starts once the whole loop is drawn, a short beat later: the token never runs on an arc that
      // isn't there yet
      const loopAt = c[0] + 0.1;
      const firstRun = [0, 1, 2].map(i => loopAt + AGENT_LOOP_DRAWN + 0.25 + i * TURN);
      // the crash, in held stages: impact (the token stops dead mid-arc in step 4's turn, shake, flash, glitch, app
      // A CRASHED), break (the arcs shatter and drift down, the token fades, the nodes dim red), loss (each done row
      // loses its result, top to bottom, and PROGRESS LOST holds); then A leaves and B slides into its place, NEW
      // APP INSTANCE held; then the restart on B, which has nothing to resume from: the pieces fly back and steps
      // 1 to 3 run again
      const crashAt = c[1] + 2.8;
      const breakAt = crashAt + 0.8, lossAt = crashAt + 2.0;
      const lostAt = crashAt + 2.4;
      const aOut1 = crashAt + 4.4, bOn1 = aOut1 + 0.6;
      const restart = bOn1 + 1.4;
      // the restart, held: the loop re-forms, the banner shows, the token rewinds back to THINK and the list is
      // wiped back to empty steps; then steps 1 to 3 run again, slower
      const rewindAt = restart + 0.2, wipeAt = restart + 0.5;
      const rerun = [0, 1, 2].map(i => restart + 2.1 + i * RERUN_TURN);
      // step 4's turn: it starts just before the crash, which freezes the token mid-arc
      const lastTurn = crashAt - 0.5;
      // after the rewind the failed run's column clears (its steps and coins fade) beside app A, which stays in
      // place around the loop; then Temporal with the Event History enters in the column's place
      const clearAt = c[2] + DURABLE_AFTER_REWIND;
      // the durable run: steps 1 to 3, each LLM call and tool result saved in the Event History (the card leaves
      // the loop, lands on its row, the row turns SAVED); then the crash before the invite, a new app instance
      // that replays the six saved rows (nothing re-billed, nothing re-run), and the invite, run for real
      const durableIn = clearAt + 0.4;
      const runAt = [0, 1, 2].map(i => c[3] + 1.4 + i * D_TURN.d);
      // the crashed app holds, its history kept, then A leaves, and is gone before B slides into its place; NEW
      // APP INSTANCE holds before the replay, one row a second
      const crash2 = c[4] + 0.6, aOut = crash2 + 2.2, bOn = aOut + 0.6;
      const replay = [0, 1, 2, 3, 4, 5].map(k => bOn + 1.4 + k * REPLAY_STEP);
      const inviteAt = replay[5] + REPLAY_STEP + 0.4, complete = inviteAt + D_TURN.d + 0.2;
      const stepAt = [...runAt, inviteAt];
      // when each history row is written, its card landing on it
      const saved = HISTORY.map((_, i) => stepAt[Math.floor(i / 2)] + (isLLM(i) ? D_TURN.llm : D_TURN.tool));
      // NO PROGRESS LOST, once the invite's result is saved
      const noLossAt = saved[7] + 0.3;
      const turns = [...[...firstRun, lastTurn].map(a => [a, TURN]), ...rerun.map(a => [a, RERUN_TURN]),
        ...stepAt.map(a => [a, D_TURN.d])];
      const [ax, ay] = shakeAt(t, crash2);
      // the scene's shift, to place what sits on the screen's own grid
      const [shiftX, shiftY] = AGENT_START.shift;
      // the failed run, then the statement over it (it dims, two lines hold), then its VCR rewind: the tape rewinds
      // it fast to its start (app A, empty steps, no coins), stops and plays; the failed run's states read the
      // tape's clock tf, which runs backwards during the rewind and stays at the start until the durable part
      // takes over
      const msgAt = rerun[2] + RERUN_TURN + 0.3;
      const vcrAt = c[2] + VCR_IN, vcrEnd = vcrAt + VCR_D;
      const msgOut = vcrAt - 0.3;
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
        // the loop dims while its durable app is down
        o: 1 - 0.6 * win(t, crash2, bOn + 0.4, 0.3),
      });
      // AGENTIC LOOP fades with the failed run after PLAY and stays hidden through the durable run: its spot is
      // for the durable run's tags (the crash, NEW APP INSTANCE, AGENT COMPLETE)
      if (t >= clearAt) {
        s.loop.center.style.opacity = (parseFloat(s.loop.center.style.opacity) * (1 - P(t, clearAt, 0.5))).toFixed(3);
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
      s.svg.style.transform = `translate(${sx + ax}px,${sy + ay}px)`;
      // the loop sits in its durable place for the whole chapter, at 80% of its size
      s.loopLayer.style.transform = `translate(${DL.x - LOOP.cx}px,${DL.y - LOOP.cy}px) scale(${DL.k})`;
      // the restart banner, over the loop as it re-forms, its rewind icon turning backwards
      const rp = P(tf, restart - 0.3, 0.45, backOut);
      place(s.restartTag, DL.x, DL.y - 45, rp, clamp(rp * 2) * (1 - P(tf, restart + 1.9, 0.3)));
      s.restartTag.rw.style.transform = `rotate(${(-200 * Math.max(0, tf - restart + 0.3)).toFixed(1)}deg)`;
      // the agent also waits for a person: said in the first subtitle
      const wp = P(tf, firstRun[2] + 0.4, 0.45, backOut);
      place(s.wait, DL.x, DL.y + 240, wp, clamp(wp * 2) * (1 - P(tf, c[1] + 0.2, 0.4)));

      // the goal and its steps, as in durable-ai-agents: each row slides in during its turn, highlighted while it
      // runs, its result and check showing as the turn ends
      const sideOut = P(t, clearAt, 0.5);
      placeStepList(s.list, tf, {
        x: LIST.x + sx, goalY: LIST.goalY + sy, rowY: LIST.rowY + sy, gap: LIST.gap, goalAt: c[0] + 0.3,
        turnStarts: [...firstRun, lastTurn - 0.5], turn: TURN, o: 1 - sideOut,
      });
      // step 4, the invite, is running when the app crashes: it never gets a result; it greys out with the done
      // steps and is wiped back to an empty step with them
      const invite = s.list.rows[3];
      invite.res.style.opacity = 0;
      invite.ck.style.opacity = 0;
      invite.style.color = '';
      if (tf >= crashAt + 0.3) {
        const cleared = P(tf, wipeAt, 0.25);
        const k = cleared > 0 ? lerp(0.45, 1, cleared) : 1 - 0.55 * P(tf, crashAt + 0.3, 0.4);
        invite.style.opacity = (k * (1 - sideOut)).toFixed(3);
        if (cleared > 0) invite.style.color = C.slate;
      }
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
          const cleared = P(tf, wipeAt + (3 - i) * 0.2, 0.25);
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
        r.again.style.opacity = tf >= redo ? win(tf, redo + 0.1, redo + 0.9, 0.2) : 0;
        r.paid.style.opacity = P(tf, redo + 1.0, 0.25);
        // the particles of the result fall and fade
        const f = P(tf, at + 0.35, 0.8, x => x);
        r.dust.forEach(e => {
          const x0 = LIST.x - LIST.w / 2 + 76 + e.u * 190, y0 = LIST.rowY + i * LIST.gap + 14;
          place(e, x0 + e.drift * f + sx, y0 + 50 * f + 90 * f * f + sy, 1, f > 0 && f < 1 ? 1 - f : 0);
        });
      });
      // the wipe: a bar of light sweeps up the list, from under step 4 to over step 1
      const wp2 = P(tf, wipeAt, 0.8, x => x);
      const edge = ROW_H / 2 + GAP / 2;
      place(s.wipe, LIST.x + sx, lerp(LIST.rowY + 3 * LIST.gap + edge, LIST.rowY - edge, wp2) + sy, 1,
        wp2 > 0 && wp2 < 1 ? 1 : 0);
      // RUN 1, then RUN 2 in red after the restart, with a swell
      const run2 = tf >= wipeAt + 0.6;
      if (s.run.textContent !== (run2 ? 'RUN 2' : 'RUN 1')) s.run.textContent = run2 ? 'RUN 2' : 'RUN 1';
      s.run.style.color = s.run.style.borderColor = run2 ? C.red : C.uv;
      s.run.style.transform = `scale(${swell(tf, wipeAt + 0.6, 0.25)})`;
      // PROGRESS LOST pops over the broken loop with a jolt and a glow, and holds until the restart
      const lp = P(tf, lostAt, 0.45, backOut);
      const [jx, jy] = shakeAt(t, lostAt - 0.1);
      place(s.lost, DL.x + jx * 0.6, DL.y - 45 + jy * 0.6, lp, clamp(lp * 2) * (1 - P(tf, aOut1 - 0.2, 0.3)));

      // each LLM call drops a coin on its row as the row slides in; a call made again stacks a red coin on it. The
      // money spent is not lost: the coins stay bright through the whole crash, and swell one after the other
      // while the subtitle says what each call costs
      s.coins.forEach((coin, i) => {
        const x = COIN.x + sx, y = LIST.rowY + i * LIST.gap + sy + COIN.step / 2;
        const k = swell(tf, c[1] + 0.4 + i * 0.15, 0.25);
        placeCoin(coin.first, tf, firstRun[i] + 0.7, x, y, 1 - sideOut, k);
        placeCoin(coin.again, tf, rerun[i] + 0.3, x, y - COIN.step, 1 - sideOut, k);
      });
      placeFlash(s.flash, t, crashAt);

      // The app instances, in the same panel geometry in both runs. In the failed run (on the tape's clock): A runs
      // the loop from the chapter's start, turns CRASHED at the crash and leaves; B slides into its place with
      // nothing to resume from, and starts over. In the durable run (from PLAY): A, already in place, runs the
      // loop, crashes before the invite and leaves; B slides in, replays the history, then runs the invite
      if (t < clearAt) {
        const leaving1 = leavingInstance(tf, aOut1);
        place(s.appA, APP.x + sx, APP.y + sy + leaving1.dy, 1, P(t, loopAt, 0.5) * leaving1.o);
        s.appA.style.filter = leaving1.grey;
        const running = tf >= firstRun[0];
        if (tf >= crashAt) setAppStatus(s.appA, 'CRASHED', 'crashed');
        else setAppStatus(s.appA, running ? 'RUNNING THE AGENT' : '', running ? 'running' : 'idle');
        const arriving1 = arrivingInstance(tf, bOn1);
        place(s.appB, APP.x + arriving1.dx, APP.y, 1, tf >= bOn1 ? arriving1.o : 0);
        setAppStatus(s.appB, tf < restart ? 'TAKING OVER' : 'RUNNING THE AGENT', tf < restart ? 'idle' : 'running');
        setArrivalGlow(s.appB, tf, bOn1, bOn1 + 1.6);
        // NEW APP INSTANCE gives way to the restart banner
        placeNewTag(s.newTag, tf, bOn1 + 0.3, restart - 0.4, DL.x + arriving1.dx, DL.y - 25);
      } else {
        const leaving = leavingInstance(t, aOut);
        place(s.appA, APP.x + ax, APP.y + ay + leaving.dy, 1, leaving.o);
        s.appA.style.filter = t >= crash2 ? leaving.grey || 'none' : '';
        if (t >= crash2) setAppStatus(s.appA, 'CRASHED', 'crashed');
        else setAppStatus(s.appA, t >= runAt[0] ? 'RUNNING THE AGENT' : '', t >= runAt[0] ? 'running' : 'idle');
        const arriving = arrivingInstance(t, bOn);
        place(s.appB, APP.x + arriving.dx, APP.y, 1, t >= bOn ? arriving.o : 0);
        if (t < replay[0]) setAppStatus(s.appB, 'TAKING OVER', 'idle');
        else if (t < inviteAt) setAppStatus(s.appB, 'REPLAYING…', 'running');
        else if (t < complete) setAppStatus(s.appB, 'RUNNING THE AGENT', 'running');
        // AGENT COMPLETE shows in the loop: the status just reads DONE
        else setAppStatus(s.appB, 'DONE', 'idle');
        setArrivalGlow(s.appB, t, bOn, bOn + 1.6);
        placeNewTag(s.newTag, t, bOn + 0.3, replay[0], DL.x + arriving.dx, DL.y - 25);
      }
      placeCrashMarks(s.crash2, t, crash2, crash2 + 0.3, aOut, ax, ay);
      placeFlash(s.flash2, t, crash2);
      const cp2 = P(t, complete, 0.45, backOut);
      place(s.complete, DL.x, DL.y - 25, cp2, clamp(cp2 * 2));

      // Temporal, outside the app, with the Event History: untouched by the crash
      place(s.outside, OUTSIDE.x, OUTSIDE.y, 1, P(t, durableIn, 0.5));
      place(s.history, HIST.x, HIST.y, 1, P(t, durableIn + 0.2, 0.5));
      // each result leaves the loop (an LLM call from THINK, a tool result from ACT just after the token passes
      // it), flies to its row's left end and is absorbed there as the row is written
      const [thx, thy] = durablePos(s.loop.pos(LOOP_DEG.think)), [acx, acy] = durablePos(s.loop.pos(LOOP_DEG.act));
      s.saveCards.forEach((e, i) => {
        const leave = saved[i] - FLIGHT - 0.1;
        const [fx, fy] = isLLM(i) ? [thx, thy] : [acx, acy];
        fly(e, t, leave, fx, fy, leave + 0.1, FLIGHT, CARD_X, rowMid(i), saved[i] + 0.1, CARD_X, rowMid(i));
      });
      // the replay: each saved row, highlighted, hands its result back to the loop from its left end
      s.reuseCards.forEach((e, i) => {
        const q = replay[i] + 0.15;
        const [tx2, ty2] = isLLM(i) ? [thx, thy] : [acx, acy];
        fly(e, t, q, CARD_X, rowMid(i), q + 0.1, 0.55, tx2, ty2, q + 0.65, tx2, ty2);
      });
      markCrash(s.history, P(t, crash2 + 0.7, 0.4), P(t, crash2 + 0.3, 0.3));
      s.history.rows.forEach((r, i) => showRow(r, P(t, saved[i] - 0.05, 0.3)));
      // a row turns SAVED as it is written; on the replay its tag says the result is reused, not paid or run again
      const reusedAt = i => replay[i] + 0.25;
      s.history.tags.forEach((e, i) => {
        const isReused = i < 6 && t >= reusedAt(i);
        if (isReused) setStatus(e, isLLM(i) ? 'REUSED, NOT RE-BILLED' : 'REUSED, NOT RE-RUN', 'reused');
        else setStatus(e, 'SAVED', 'saved');
        e.style.opacity = P(t, saved[i], 0.25);
        e.style.transform = `scale(${swell(t, isReused ? reusedAt(i) : saved[i], 0.14)})`;
      });
      // the row being written or replayed is highlighted: HOLD after it is saved, most of its second on the replay
      const savingRow = saved.findIndex(at => t >= at && t < at + HOLD);
      const replayRow = replay.findIndex(q => t >= q && t < q + REPLAY_STEP - 0.2);
      const scanning = savingRow >= 0 ? savingRow : replayRow;
      setScan(s.history, HIST.row0 - 4 + Math.max(0, scanning) * HIST.gap, scanning >= 0 ? 1 : 0);

      // the slot under the history, one label at a time: the first save, the history kept through the crash, then
      // NO PROGRESS LOST
      const callout = (e, at, out) => {
        const pop = popIn(t, at);
        place(e, OUTSIDE.x, CALLOUT_Y, pop.s, pop.o * (1 - P(t, out, 0.3)));
      };
      callout(s.savedNote, saved[0] + 0.2, runAt[1] + 0.2);
      callout(s.keptNote, crash2 + 0.9, replay[0]);
      // once the invite is saved, NO PROGRESS LOST pops in the slot and holds
      const np = P(t, noLossAt, 0.45, backOut);
      place(s.noLoss, OUTSIDE.x, CALLOUT_Y, np, clamp(np * 2));

      // the statement before the rewind: the failed run dims under the scrim and the two lines rise in, their
      // letter spacing tightening, with one red glitch flicker; they hold, then fade as the rewind starts
      const mIn = P(t, msgAt, 0.7, easeOut);
      const msgO = 1 - P(t, msgOut, 0.35);
      place(s.scrim, 960 - shiftX, 540 - shiftY, 1, 0.75 * P(t, msgAt, 0.5) * msgO);
      const flicker = t >= msgAt + 1.0 && t < msgAt + 1.1;
      place(s.msg, 960 - shiftX + (flicker ? 6 : 0), 515 - shiftY + Math.round(24 * (1 - mIn)), 1, mIn * msgO);
      s.msg.style.letterSpacing = `${(0.06 * (1 - mIn)).toFixed(4)}em`;
      s.msg.style.textShadow = flicker ? '-4px 0 0 rgba(255,90,95,.7)' : '';

      // the VCR rewind: REWIND blinks in the corner over a timecode running backwards, noise bands roll over the
      // stage with scanlines and a color fringe; then the tape stops (a jolt) and PLAY shows for a moment
      const vcrOn = t >= vcrAt - 0.15 && t < vcrEnd + 0.9;
      const rolling = t >= vcrAt && t < vcrEnd;
      const frame = Math.floor(t * 24);
      // in the app panel, centered on it, between its header and THINK (screen x 540, y 240), in the scene
      const OSD = { x: 540 - shiftX, y: 240 - shiftY };
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
        place(e, 960 - shiftX, y - shiftY, 1, noise * 0.35);
      });
      place(s.vcrLines, 960 - shiftX, 540 - shiftY, 1, noise * 0.3);
      const fringe = Math.round(noise * (3 + 4 * hash(frame)));
      const stopJolt = t >= vcrEnd && t < vcrEnd + 0.2 ? Math.round(18 * (1 - (t - vcrEnd) / 0.2)) : 0;
      if (noise > 0.01 || stopJolt) {
        s.cam.style.filter = `drop-shadow(${fringe}px 0 0 rgba(255,90,95,.55)) drop-shadow(${-fringe}px 0 0 `
          + 'rgba(68,76,231,.55))';
        s.cam.style.transform += ` translateY(${stopJolt}px)`;
      } else {
        s.cam.style.filter = '';
      }

    }
  });
}
