// ===================== 4. WHY IT MATTERS FOR AI
// The block keeps every name declared in this file local to this scene.
{
  // The agentic loop (think, act, observe, as in durable-ai-agents) runs durably in an app instance, its steps
  // saved in an Event History outside the app, as in durable-ai-agents chapter 7: a crash in production, a new
  // instance takes over and replays the history, nothing is lost and no LLM call is paid twice
  const LOOP = AGENT_LOOP;
  const COMET = 6; // sparks trailing the token
  // the loop shows at 86% of its size for the whole chapter, in its app panel, about 40 px clear of its header and
  // of the context strip (stage pixels)
  const DL = AGENT_PLACE;
  // a point of the loop (from s.loop.pos) where it shows on the stage of the scene
  const durablePos = ([x, y]) => [DL.x + (x - LOOP.cx) * DL.k, DL.y + (y - LOOP.cy) * DL.k];
  // a point of the loop moved to the nearest one that shows on a whole pixel of the stage
  const snapToPixel = ([x, y]) => [
    LOOP.cx + (Math.round(DL.x + (x - LOOP.cx) * DL.k) - DL.x) / DL.k,
    LOOP.cy + (Math.round(DL.y + (y - LOOP.cy) * DL.k) - DL.y) / DL.k,
  ];

  // Stage pixels. The app panel spans the content frame (y 150 to 880) around the loop, x 140 to 900; the Temporal
  // panel, as high, starts one GUTTER right of it, 840 px wide (x 940 to 1780)
  const APP = { x: DL.x, y: 515, w: 760, h: 730 };
  const GUTTER = 40;
  // Under the loop in the app panel, 24 px from its sides and bottom (as its header): the agent's goal, then in its
  // place the AGENT CONTEXT strip. Inside it, padY from its top and bottom: the label row (its label and, on B,
  // CONTEXT RESTORED, both centered on the row, rowH high), then padY under it the blocks, one per saved row (n), gap
  // px apart; the label, the blocks and the tag pad px from the strip's sides
  const MEM = { w: APP.w - 48, n: 8, bw: 72, bh: 50, gap: 12, pad: 26, padY: 20, rowH: 30 };
  MEM.blockTop = MEM.padY + MEM.rowH + MEM.padY;
  MEM.h = MEM.blockTop + MEM.bh + MEM.padY;
  const MEM_Y = APP.y + APP.h / 2 - 24 - MEM.h / 2;
  const memSlotX = i => APP.x - MEM.w / 2 + MEM.pad + MEM.bw / 2 + i * (MEM.bw + MEM.gap);
  const MEM_SLOT_Y = MEM_Y - MEM.h / 2 + MEM.blockTop + MEM.bh / 2;
  // Inside the Temporal panel, under its header (70 px), the Event History card 20 px from the panel's sides, then
  // the slot of the pills (a callout at a time, then NO PROGRESS LOST and NO TOKENS WASTED side by side, PILL_GAP
  // apart), CALLOUT_GAP clear of the card and of the panel's bottom. The card's header, rows and tags sit 26 px
  // inside it on every side
  const OUTSIDE = { x: APP.x + APP.w / 2 + GUTTER + 420, y: APP.y, w: 840, h: APP.h };
  const HIST_INSET = 20, HIST_TOP = 70, HIST_PAD = 26, CALLOUT_H = 50, CALLOUT_GAP = 30;
  const HIST_H = OUTSIDE.h - HIST_TOP - 2 * CALLOUT_GAP - CALLOUT_H;
  const HIST = {
    x: OUTSIDE.x, y: OUTSIDE.y - OUTSIDE.h / 2 + HIST_TOP + HIST_H / 2, w: OUTSIDE.w - 2 * HIST_INSET, h: HIST_H,
    row0: 78, gap: 57, rowH: 42,
  };
  const CALLOUT_Y = OUTSIDE.y + OUTSIDE.h / 2 - CALLOUT_GAP - CALLOUT_H / 2;
  const PILL = { w: 300, gap: 48 };
  // Each turn of the loop, slow enough to follow the Event History (seconds into the turn): the LLM CALL card
  // leaves THINK and lands on its row at llm, the row turns SAVED, highlighted for HOLD; the TOOL CALL card leaves
  // ACT, lands at tool and its row holds the same; a card flies FLIGHT seconds
  const D_TURN = { d: 3.2, llm: 0.95, tool: 2.35 };
  const HOLD = 0.6, FLIGHT = 0.7;
  // the replay hands back one saved row a second
  const REPLAY_STEP = 1.0;
  // stage-free row geometry: the middle of row i, and where a result card lands on it and leaves it: by its left
  // end, in the gutter, the card's right edge 6 px left of the row's number, so it never covers the row's text
  const rowMid = i => HIST.y - HIST.h / 2 + HIST.row0 + i * HIST.gap + HIST.rowH / 2;
  const CARD_W = 136;
  const CARD_X = HIST.x - HIST.w / 2 + 36 - 6 - CARD_W / 2;

  scene({
    chapter: 4, title: 'Why it matters for AI',
    holdBeforeEnd: CAMERA_EXIT, // presenter mode holds before the exit zoom
    fadeIn: 0, // a hard cut: the previous chapter ends on this chapter's first frame
    shift: AGENT_START.shift,
    subs: [
      // the loop and the panels enter, the goal shows, then the first of three slow turns, each step saved in the
      // history and added to the agent's context
      {
        text: "AI agents are long processes too: many LLM calls, tools to run, and waits for a person.",
        after: 0.4,
      },
      {
        text: "With Temporal, every step the agent takes is saved in an Event History, outside the app.",
        after: 0.7,
      },
      // the crash, held with the history kept and A's context lost, the takeover, the replay row by row that
      // rebuilds the context in B, then the invite and AGENT COMPLETE
      {
        text: "When the app crashes in production, a new instance replays the history: "
          + "the agent keeps its context.",
        after: 8.1,
      },
      // NO PROGRESS LOST, then NO TOKENS WASTED
      { text: "No progress is lost and no tokens are wasted: no LLM call is paid twice.", after: 0.4 },
      { text: "That's why OpenAI built Codex on Temporal, and Cursor, Lovable and Replit rely on it too.", after: 1.4 },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // the halo the LLM node arrives with from the previous chapter, which settles into the LLM's own glow
      s.carry = E(root, '', '', {
        width: HANDOFF_HALO.size + 'px', height: HANDOFF_HALO.size + 'px', borderRadius: '50%',
        background: HALO_BACKGROUND,
      });
      // the app instances that run the loop: built first, so the loop and its arcs sit on top of them
      s.appA = makeAppPanel(root, 'APP INSTANCE A', APP.w, APP.h, APP_TEXT_LARGE);
      s.appB = makeAppPanel(root, 'APP INSTANCE B', APP.w, APP.h, APP_TEXT_LARGE);
      // each instance's AGENT CONTEXT strip: A's fills as the steps run and empties at the crash (CONTEXT LOST);
      // B's starts empty and the replay rebuilds it (CONTEXT RESTORED, then the invite adds its two blocks)
      const memory = () => makeMemory(root, MEM.w, MEM.h, {
        label: 'Agent context', labelAt: [MEM.pad - 2, MEM.padY + 2], emptyText: 'CONTEXT LOST',
      });
      s.memA = memory();
      s.memB = memory();
      s.blocksA = makeMemBlocks(root, 6, MEM.bw, MEM.bh);
      s.blocksB = makeMemBlocks(root, MEM.n, MEM.bw, MEM.bh);
      // on B's strip, level with its label, right-aligned with the last block (CSS right is measured inside the
      // strip's border)
      s.restored = statusTag(s.memB);
      Object.assign(s.restored.style, {
        left: 'auto', right: (MEM.pad - 1) + 'px', top: MEM.padY + 'px', transformOrigin: 'right center',
      });
      // the loop, its arcs and its token's tail on one layer, scaled as a whole
      s.loopLayer = E(root, '', '', {
        width: '1920px', height: '1080px', transformOrigin: `${LOOP.cx}px ${LOOP.cy}px`,
      });
      s.loopLayer.style.opacity = 1;
      s.svg = svgLayer(s.loopLayer);
      // THINK blinks as the orb the previous chapter's AI hub turned into
      s.loop = makeAgentLoop(s.loopLayer, s.svg, LOOP.cx, LOOP.cy, LOOP.r, { seed: AGENT_LLM.seed });
      // the nodes and labels at the nearest point that the layer's scale takes to a whole screen pixel, so the
      // tiles rest on whole pixels: ACT and OBSERVE sit at fractional points of the circle
      s.loop.nodePos = deg => snapToPixel(s.loop.pos(deg));
      // A transparent outline widens what Chromium repaints when a tile's opacity changes: in the scaled layer the
      // tile's anti-aliased edge spills one pixel outside the box it repaints, and would keep the dimmed paint of
      // an earlier frame, so a frame would depend on the frames rendered before it
      [s.loop.act, s.loop.observe].forEach(e => { e.style.outline = '3px solid transparent'; });
      s.comet = Array.from({ length: COMET }, (_, k) => makeSpark(s.loopLayer, 16 - 2 * k, '219,255,75'));
      // the token and its comet pass under the nodes, THINK's face included: moved before the first node, in order
      [s.loop.token, ...s.comet].forEach(e => s.loopLayer.insertBefore(e, s.loop.think.root));
      // the agent's goal, under the loop before the context strip, a fixed whole size, so it rests on whole pixels
      s.goal = makeCard(root, 'Book lunch with Marie on Thursday.', 'user', null, MEM.w);
      // as wide as the strip that takes its place (cards are 640 px at most)
      Object.assign(s.goal.style, { whiteSpace: 'nowrap', height: '88px', maxWidth: 'none' });

      // Temporal with the Event History, outside the app (rows 1 to 6 survive the crash), the result cards between
      // the loop and the history, the pills under it, the crash marks and the takeover tag
      s.outside = makeTemporalPanel(root, OUTSIDE.w, OUTSIDE.h, TEMPORAL_HEADER_LARGE);
      s.history = makeHistoryCard(root, LUNCH_HISTORY, {
        uvRow: isLLMRow, w: HIST.w, h: HIST.h, headerTop: HIST_PAD, rowTop: i => HIST.row0 + i * HIST.gap, font: 22,
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
      const callCard = i => makeCallCard(root, isLLMRow(i), { w: CARD_W });
      s.saveCards = LUNCH_HISTORY.map((_, i) => callCard(i));
      s.reuseCards = LUNCH_HISTORY.slice(0, 6).map((_, i) => callCard(i));
      // the pills under the history, each a fixed even width, so it rests on whole pixels centered
      const pill = (text, kind, w) => {
        const e = tag(root, text, kind);
        Object.assign(e.style, { width: w + 'px', textAlign: 'center' });
        return e;
      };
      s.savedNote = pill('Saved outside the app', 'uv', 380);
      s.keptNote = pill('History kept', 'uv', 240);
      // the outcome, two neon pills with a soft glow
      s.outcome = ['No progress lost', 'No tokens wasted'].map(text => {
        const e = pill(text, 'neon solid', PILL.w);
        e.style.boxShadow = '0 0 28px rgba(219,255,75,.35)';
        return e;
      });
      // the tags in the loop's middle sit 30 px above it, clear of the ACT and OBSERVE tiles
      // the bolt in the panel's top right, clear of its status and of THINK
      s.crash = makeCrashMarks(root, 'App crash', { x: DL.x + 230, y: DL.y - 210, size: 110 },
        { x: DL.x, y: DL.y - 30, w: 280 });
      s.newTag = makeNewTag(root, 'New app instance', 300);
      s.flash = makeFlash(root);
      s.complete = tag(root, 'Agent complete', 'neon solid');
      s.complete.style.width = '256px'; // even, so it rests on whole pixels once centered
    },
    update(t, c, s) {
      // the scene opens on the LLM node the previous chapter's AI hub turned into, at its final place and size, with
      // its halo; no entrance zoom, so the node never moves: the halo fades into the LLM's own glow and the rest of
      // the loop emerges around it, then the app panel and Temporal with its Event History enter
      setCamera(s.cam, t, this.dur, { enter: 1 });
      place(s.carry, ...durablePos(s.loop.nodePos(LOOP_DEG.think)), 1, HANDOFF_HALO.o * (1 - P(t, 0.2, 1.0)));
      const loopAt = c[0] + 0.1;
      // three turns, one step each, every LLM call and tool result saved (the card leaves the loop, lands on its
      // row, the row turns SAVED); the first starts once the loop is drawn and the goal has shown, and ends before
      // the second subtitle, which starts the other two
      const runAt = [c[0] + 3.0, c[1] + 0.3, c[1] + 0.3 + D_TURN.d];
      // the crash before the invite, held with the history kept; A leaves, and is gone before B slides into its
      // place; NEW APP INSTANCE holds before the replay, one row a second; then the invite, run for real
      const crashAt = c[2] + 0.6, aOut = crashAt + 2.2, bOn = aOut + 0.6;
      const replay = [0, 1, 2, 3, 4, 5].map(k => bOn + 1.4 + k * REPLAY_STEP);
      const inviteAt = replay[5] + REPLAY_STEP + 0.4, complete = inviteAt + D_TURN.d + 0.2;
      const stepAt = [...runAt, inviteAt];
      // when each history row is written, its card landing on it
      const saved = LUNCH_HISTORY.map((_, i) => stepAt[Math.floor(i / 2)] + (isLLMRow(i) ? D_TURN.llm : D_TURN.tool));
      const [ax, ay] = shakeAt(t, crashAt);

      // the token runs one turn of the loop per step, think -> act -> observe
      let deg = null;
      stepAt.forEach(a => {
        if (t >= a && t < a + D_TURN.d) deg = -90 + 360 * ease((t - a) / D_TURN.d);
      });
      placeAgentLoop(s.loop, t, loopAt, {
        deg, centerAt: c[0] + 1.2, dx: ax, dy: ay,
        // AGENTIC LOOP stays hidden: the loop's middle is for the crash tag, NEW APP INSTANCE and AGENT COMPLETE
        centerO: 0,
        // THINK is there from the first frame: the previous chapter's AI hub turned into it
        thinkIn: -1,
        // the loop dims while its app is down
        o: 1 - 0.6 * win(t, crashAt, bOn + 0.4, 0.3),
      });
      // the token's comet tail: sparks along the loop behind it, smaller and fainter
      s.comet.forEach((e, k) => {
        const tailDeg = deg === null ? null : deg - (k + 1) * 6;
        if (tailDeg === null || tailDeg < -90) {
          place(e, 0, 0, 1, 0);
          return;
        }
        const [x, y] = s.loop.pos(tailDeg);
        place(e, x, y, 1, 0.55 - 0.08 * k);
      });
      s.svg.style.transform = `translate(${ax}px,${ay}px)`;
      // the loop sits in its place for the whole chapter, at 86% of its size
      s.loopLayer.style.transform = `translate(${DL.x - LOOP.cx}px,${DL.y - LOOP.cy}px) scale(${DL.k})`;
      // under the loop: the agent's goal, then the context strip in its place
      const gp = P(t, c[0] + 0.6, 0.45, backOut);
      place(s.goal, DL.x, MEM_Y, gp, clamp(gp * 2) * (1 - P(t, c[0] + 3.4, 0.3)));

      // The app instances: A runs the loop, crashes before the invite and leaves; B slides into its place, replays
      // the history, then runs the invite
      const leaving = leavingInstance(t, aOut);
      place(s.appA, APP.x + ax, APP.y + ay + leaving.dy, 1, P(t, loopAt, 0.5) * leaving.o);
      s.appA.style.filter = t >= crashAt ? leaving.grey || 'none' : '';
      if (t >= crashAt) setAppStatus(s.appA, 'CRASHED', 'crashed');
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

      // The agent's context, in each instance's strip, which moves with its panel. In A, a block per row as the row
      // is saved; at the crash A's blocks fall and CONTEXT LOST shows until A leaves. B arrives with an empty
      // strip; each replayed row's card lands as a block, the context restored block by block, then the invite
      // adds its blocks
      const memIn = P(t, c[0] + 3.6, 0.4);
      place(s.memA, APP.x + ax, MEM_Y + ay + leaving.dy, 1, memIn * leaving.o);
      s.memA.style.filter = s.appA.style.filter;
      s.memA.style.borderColor = t >= crashAt ? C.red : C.line;
      s.memA.empty.style.opacity = P(t, crashAt + 1.1, 0.4);
      // the blocks drop half as far as placeMemBlock's 300 px, so they fade out before leaving the panel
      s.blocksA.forEach((b, i) => {
        const fall = P(t, crashAt + 0.3 + i * 0.08, 0.8, easeIn);
        placeMemBlock(b, memSlotX(i), MEM_SLOT_Y, P(t, saved[i] - 0.05, 0.35, backOut), fall, ax, ay - fall * 150);
      });
      const bO = t >= bOn ? arriving.o : 0;
      place(s.memB, APP.x + arriving.dx, MEM_Y, 1, bO);
      const landAt = i => (i < 6 ? replay[i] + 0.75 : saved[i] - 0.05);
      s.blocksB.forEach((b, i) => {
        placeMemBlock(b, memSlotX(i), MEM_SLOT_Y, P(t, landAt(i), 0.35, backOut), 0, arriving.dx, 0, bO);
      });
      // CONTEXT RESTORED once the last replayed block has landed, held
      const restoredAt = landAt(5) + 0.45;
      setStatus(s.restored, 'CONTEXT RESTORED', 'ok');
      const rp = popIn(t, restoredAt);
      s.restored.style.opacity = rp.o;
      s.restored.style.transform = `scale(${rp.s})`;
      placeCrashMarks(s.crash, t, crashAt, crashAt + 0.3, aOut, ax, ay);
      placeFlash(s.flash, t, crashAt);
      const cp = P(t, complete, 0.45, backOut);
      place(s.complete, DL.x, DL.y - 25, cp, clamp(cp * 2));

      // Temporal, outside the app, with the Event History: untouched by the crash
      place(s.outside, OUTSIDE.x, OUTSIDE.y, 1, P(t, loopAt + 0.4, 0.5));
      place(s.history, HIST.x, HIST.y, 1, P(t, loopAt + 0.6, 0.5));
      // each result leaves the loop (an LLM call from THINK, a tool result from ACT just after the token passes
      // it), flies to its row's left end and is absorbed there as the row is written
      const [thx, thy] = durablePos(s.loop.pos(LOOP_DEG.think)), [acx, acy] = durablePos(s.loop.pos(LOOP_DEG.act));
      s.saveCards.forEach((e, i) => {
        const leave = saved[i] - FLIGHT - 0.1;
        const [fx, fy] = isLLMRow(i) ? [thx, thy] : [acx, acy];
        fly(e, t, leave, fx, fy, leave + 0.1, FLIGHT, CARD_X, rowMid(i), saved[i] + 0.1, CARD_X, rowMid(i));
      });
      // the replay: each saved row, highlighted, hands its result back from its left end to B, where it lands as
      // a block of the agent's context
      s.reuseCards.forEach((e, i) => {
        const q = replay[i] + 0.15;
        const [tx, ty] = [memSlotX(i), MEM_SLOT_Y];
        fly(e, t, q, CARD_X, rowMid(i), q + 0.1, 0.55, tx, ty, q + 0.65, tx, ty);
      });
      markCrash(s.history, t, crashAt);
      s.history.rows.forEach((r, i) => showRow(r, P(t, saved[i] - 0.05, 0.3)));
      // a row turns SAVED as it is written; on the replay its tag says the result is reused, not paid or run again
      const reusedAt = i => replay[i] + 0.25;
      s.history.tags.forEach((e, i) => {
        const isReused = i < 6 && t >= reusedAt(i);
        const opacity = P(t, saved[i], 0.25);
        if (isReused) placeStatusTag(e, t, reusedLabel(isLLMRow(i)), 'reused', opacity, reusedAt(i));
        else placeStatusTag(e, t, 'SAVED', 'saved', opacity, saved[i]);
      });
      // the row being written or replayed is highlighted: HOLD after it is saved, most of its second on the replay
      const savingRow = saved.findIndex(at => t >= at && t < at + HOLD);
      const replayRow = replay.findIndex(q => t >= q && t < q + REPLAY_STEP - 0.2);
      const scanning = savingRow >= 0 ? savingRow : replayRow;
      scanRow(s.history, scanning);

      // the slot under the history: SAVED OUTSIDE THE APP at the first save, HISTORY KEPT through the crash, then
      // the outcome, NO PROGRESS LOST and NO TOKENS WASTED, side by side, one after the other, held
      const callout = (e, x, at, out) => {
        const pop = popIn(t, at);
        place(e, x, CALLOUT_Y, pop.s, pop.o * (1 - P(t, out, 0.3)));
      };
      callout(s.savedNote, OUTSIDE.x, saved[0] + 0.2, runAt[1] + 0.2);
      callout(s.keptNote, OUTSIDE.x, crashAt + 0.9, replay[0]);
      s.outcome.forEach((e, i) => {
        const x = OUTSIDE.x + (i - 0.5) * (PILL.w + PILL.gap);
        // each grows from 90% to its size with no overshoot, so the pair never gets closer than PILL.gap
        const op = P(t, c[3] + 0.6 + i * 1.2, 0.45, easeOut);
        place(e, x, CALLOUT_Y, lerp(0.9, 1, op), op);
      });
    }
  });
}
