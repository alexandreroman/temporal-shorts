// ===================== 7. DURABLE EXECUTION WITH TEMPORAL
// The block keeps every name declared in this file local to this scene.
{
  // Event History rows: the LLM call of each step (its action, lowercase), then its tool result
  const JR = STEPS.flatMap(step => [
    `LLM call: ${step.action[0].toLowerCase()}${step.action.slice(1)}`, `${step.tool}: ${step.result}`,
  ]);
  const isLLM = i => i % 2 === 0;
  // Chapter 7 layout: app on the left, Temporal on the right, both under the step tiles
  const APP = { x: 470, y: 445 };
  const MEM = { x: 470, y: 469, slot0: 162, slotGap: 88, slotY: 484 }; // memory panel and its block slots
  const HIST = { x: 1380, y: 580, cardX: 1050, row0: 447, rowGap: 44 }; // Event History card and its rows
  const memSlot = i => MEM.slot0 + i * MEM.slotGap;
  const rowY = i => HIST.row0 + i * HIST.rowGap;
  // the big intro logo flies into the TEMPORAL panel header from c[0] + FLIGHT.at, for FLIGHT.d seconds
  const FLIGHT = { at: 1.9, d: 0.8 };
  scene({
    chapter: 7, title: 'Durable Execution with Temporal',
    // AGENT COMPLETE lands at c[3] + 5.75: the final composition holds ~2 s before the fade
    post: 0.5,
    // logo, then the app and Temporal panels; the pan runs with the logo flight
    shift: (t, c) => pan(t, [0, -18], [[c[0] + FLIGHT.at, 0, 32]], FLIGHT.d),
    subs: [
      {
        text: "<b>Durable Execution</b> with Temporal fixes this. "
          + "Temporal keeps an Event History of the agent, outside the app.",
        after: 0.3,
      },
      {
        text: "After each LLM call or tool call, Temporal saves the result in the history before the agent moves on.",
        after: 0.2,
      },
      { text: "If the app crashes, another copy runs the agent again from the start." },
      {
        text: "For each saved step, Temporal returns the result from the history. "
          + "The LLM isn't called again: the context is rebuilt for free.",
        after: 0.3,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.steps = makeStepRow(root, s.svg, STEP_TILES, 465, 330, 200, 260, 104);
      s.restart = path(s.svg, 'M 1440 140 Q 960 40 480 140', C.violet, 3);
      s.restartL = E(root, 'From the start', 'lbl', { color: C.violet });
      // app side, mirroring chapter 6: instance panel, its memory, the LLM bill and the booking
      s.A = makeAppPanel(root, 'APP INSTANCE A', 780, 310); s.B = makeAppPanel(root, 'APP INSTANCE B', 780, 310);
      s.mem = makeMemory(root, 732, 210);
      s.mblocks = makeMemBlocks(root, 8, 76, 56);
      s.bill = makeBill(root);
      s.bill.note.style.color = C.neon;
      s.ticket = makeTicket(root);
      // Temporal side: the Event History lives in Temporal, outside the app (the logo flies into the header)
      s.temporal = makeTemporalPanel(root, 920, 530, { noteAt: [24, 24] });
      // rows 1-6 survive the crash: tinted block + crash line under them
      const rowsHtml = JR.map((txt, i) => `<span style="color:${isLLM(i) ? C.uv : '#141414'}">${txt}</span>`);
      s.jr = makeHistoryCard(root, rowsHtml, {
        w: 880, h: 440, rowTop: i => 70 + i * 44, font: 21, tagTop: i => 74 + i * 44, tag: { border: false },
        crash: { keptTop: 64, keptH: 262, cutTop: 330, label: 'APP CRASHED HERE', labelX: '66%', labelFont: 13 },
        scanH: 42,
      });
      s.saveCards = JR.map((_, i) => makeResultCard(root, isLLM(i)));
      s.reuseCards = JR.slice(0, 6).map((_, i) => makeResultCard(root, isLLM(i)));
      s.flash = makeFlash(root);
      s.done = tag(root, 'Agent complete', 'neon');
      s.logo = E(root, `<img src="${LOGO}" style="height:150px;display:block">`);
    },
    update(t, c, s) {
      // first run: each row is worked on, then saved, and only then the agent moves on
      const write = [0, 1, 2, 3, 4, 5].map(i => c[1] + 0.3 + i * 1.05).concat([c[3] + 2.9, c[3] + 3.95]);
      const saved = write.map(w => w + 0.85);
      const crashAt = c[2] + 0.8, bOn = crashAt + 1.8, reset = bOn + 0.3, rerun = bOn + 1.3;
      // replay: saved rows 1-6 are handed back one by one, then their tags explain why it matters;
      // the replay ends at told[0]
      const replay = [0, 1, 2, 3, 4, 5].map(i => c[3] + 0.2 + i * 0.4);
      const reused = replay.map(q => q + 0.05), told = replay.map((_, i) => c[3] + 2.6 + i * 0.1);
      const [sx, sy] = shakeAt(t, crashAt);
      const dead = t >= crashAt;

      // Temporal logo: big intro, then it flies into the header of the Temporal panel, where it stays
      const lp = P(t, c[0] + 0.1, 0.7, backOut), fl = P(t, c[0] + FLIGHT.at, FLIGHT.d);
      const logoScale = lp * lerp(1 + 0.06 * P(t, c[0] + 1.2, 0.6), 34 / 150, fl);
      place(s.logo, lerp(960, 1005, fl), lerp(540, 325, fl), logoScale, clamp(lp * 2));
      place(s.temporal, 1380, 555, 1, P(t, c[0] + 2.4, 0.5));
      place(s.jr, HIST.x, HIST.y, 1, P(t, c[0] + 2.6, 0.5));

      // steps
      const states = [0, 1, 2, 3].map(i => {
        if (t < reset) {
          if (i === 3) return dead ? 3 : t >= c[2] + 0.2 ? 1 : 0;
          return t >= saved[2 * i + 1] + 0.1 ? 2 : t >= write[2 * i] ? 1 : 0;
        }
        if (i === 3) return t >= saved[7] + 0.1 ? 2 : t >= c[3] + 2.8 ? 1 : 0;
        const start = i === 0 ? rerun : replay[2 * i];
        return t >= replay[2 * i + 1] + 0.35 ? 2 : t >= start ? 1 : 0;
      });
      placeStepRow(s.steps, t, c[0] + 2.5, states, sx, sy);
      draw(s.restart, P(t, bOn + 0.5, 0.8), 1 - P(t, c[3] + 0.3, 0.4));
      place(s.restartL, 960, 115, 1, P(t, bOn + 0.9, 0.35) * (1 - P(t, c[3] + 0.3, 0.4)));

      // app instances: A runs then crashes, B takes over in the same place
      const aIn = P(t, c[0] + 2.3, 0.5, backOut);
      place(s.A, APP.x + sx, APP.y + sy, aIn, clamp(aIn * 2) * (1 - P(t, bOn, 0.3)));
      if (dead) setAppStatus(s.A, 'CRASHED', 'crashed');
      else setAppStatus(s.A, 'RUNNING THE AGENT', t >= write[0] ? 'running' : 'idle');
      place(s.B, APP.x, APP.y, 1, P(t, bOn + 0.3, 0.35));
      if (t < replay[0]) setAppStatus(s.B, 'TAKING OVER', t >= rerun ? 'running' : 'idle');
      else if (t < told[0]) setAppStatus(s.B, 'REPLAYING…', 'running');
      else setAppStatus(s.B, 'RUNNING THE AGENT', 'running');

      // app memory: filled as results are saved, emptied by the crash, refilled from the history
      place(s.mem, MEM.x + sx, MEM.y + sy, 1, P(t, c[0] + 2.5, 0.45));
      s.mem.style.borderColor = t > crashAt && t < bOn ? C.red : C.line;
      s.mem.empty.style.opacity = P(t, crashAt + 1.1, 0.4) * (1 - P(t, bOn, 0.3));
      s.mblocks.forEach((b, i) => {
        if (t < bOn) {
          const grow = i < 6 ? P(t, saved[i], 0.35, backOut) : 0;
          placeMemBlock(b, memSlot(i), MEM.slotY, grow, P(t, crashAt + 0.3 + i * 0.08, 0.8, easeIn), sx, sy);
        } else {
          const back = i < 6 ? replay[i] + 0.33 : saved[i];
          placeMemBlock(b, memSlot(i), MEM.slotY, P(t, back, 0.35, backOut), 0);
        }
      });

      // LLM call counter: only the 4 real calls are billed; the replay costs nothing
      const calls = [0, 2, 4, 6].filter(i => t >= write[i]).length;
      setBill(s.bill, calls, 0, 'NOT RE-BILLED');
      const notBilled = win(t, replay[0], c[3] + 2.8, 0.3);
      s.bill.note.style.opacity = notBilled;
      s.bill.style.borderColor = notBilled > 0.5 ? C.neon : C.line;
      place(s.bill, 270 + sx, 720 + sy, P(t, c[0] + 2.7, 0.45, backOut), P(t, c[0] + 2.7, 0.4));
      // the booking is made once and never repeated
      const tp = P(t, saved[5], 0.45, backOut);
      place(s.ticket, 660, 720, tp * (1 + 0.15 * win(t, reused[5], reused[5] + 0.5, 0.2)), clamp(tp * 2));

      // result cards: app -> Temporal when saving, Temporal -> app when replaying
      s.saveCards.forEach((e, i) => {
        const w = write[i];
        fly(e, t, w + 0.35, memSlot(i), MEM.slotY, w + 0.4, 0.4, HIST.cardX, rowY(i), w + 0.8, HIST.cardX, rowY(i));
      });
      s.reuseCards.forEach((e, i) => {
        const q = replay[i];
        fly(e, t, q, HIST.cardX, rowY(i), q + 0.05, 0.28, memSlot(i), MEM.slotY, q + 0.33, memSlot(i), MEM.slotY);
      });

      // Event History rows and their status tags
      markCrash(s.jr, P(t, crashAt + 0.7, 0.4), P(t, crashAt + 0.3, 0.3));
      s.jr.rows.forEach((r, i) => showRow(r, P(t, saved[i] - 0.1, 0.3)));
      s.jr.tags.forEach((e, i) => {
        const isReused = i < 6 && t >= reused[i], isTold = i < 6 && t >= told[i];
        if (isTold) setStatus(e, isLLM(i) ? 'REUSED, NOT RE-BILLED' : 'REUSED, NOT RE-RUN', 'reused');
        else if (isReused) setStatus(e, 'REUSED', 'reused');
        else setStatus(e, 'SAVED', 'saved');
        const switchedAt = isTold ? told[i] : isReused ? reused[i] : saved[i];
        e.style.opacity = P(t, saved[i], 0.25);
        e.style.transform = `scale(${swell(t, switchedAt, 0.14)})`;
      });
      const scanning = replay.findIndex(q => t >= q && t < q + 0.4);
      setScan(s.jr, 68 + Math.max(0, scanning) * 44, scanning >= 0 ? 1 : 0);
      place(s.done, 1380, 872, P(t, saved[7] + 0.5, 0.45, backOut), P(t, saved[7] + 0.5, 0.35));
      placeFlash(s.flash, t, crashAt);
    }
  });
}
