// ===================== 7. DURABLE EXECUTION WITH TEMPORAL
// Temporal keeps the agent's Event History outside the app and saves each result before the next step. Then app
// instance A crashes: its memory empties, and the dead instance greys, drops and fades with its context panel. A new
// copy, instance B, slides in to the same place, and Temporal hands it the agent; it runs the agent again from the
// start, gets every saved result back from the history (no LLM call billed again), then runs the last step.
// The block keeps every name declared in this file local to this scene.
{
  // Event History rows: the LLM call of each step (its action, lowercase), then its tool result
  const JR = STEPS.flatMap(step => [
    `LLM call: ${step.action[0].toLowerCase()}${step.action.slice(1)}`, `${step.tool}: ${step.result}`,
  ]);
  const isLLM = i => i % 2 === 0;
  // result card of row i, labeled with the kind of call it comes from, as in the subtitle
  const makeCallCard = (root, i) => makeResultCard(root, isLLM(i), isLLM(i) ? 'LLM CALL' : 'TOOL CALL');
  // Chapter 7 layout: app on the left, Temporal on the right, both under the step tiles
  const APP = { x: 470, y: 445 };
  const MEM = { x: 470, y: 469, slot0: 162, slotGap: 88, slotY: 484 }; // context panel and its block slots
  const HIST = { x: 1380, y: 580, cardX: 1050, row0: 447, rowGap: 44 }; // Event History card and its rows
  // the takeover, in whole pixels: the dead instance A drops 40 px; instance B arrives from 160 px to the left of
  // its resting place
  const DROP = 40;
  const ARRIVE = -160;
  // NEW INSTANCE: astride the top edge of instance B's panel, centered between its name and its TAKING OVER status
  // (about 65 px from each); 6 px low, so it keeps 20 px of clear space under the Calendar tile. Fixed even width:
  // it rests on whole pixels (solid: the panel border does not show through).
  const NEW_TAG = { x: APP.x + 60, y: APP.y - 155 + 6, w: 240 };
  // the agent chip flies from the first Event History row to instance B's status, at the panel's top right
  const STATUS_AT = { x: APP.x + 290, y: APP.y - 155 + 36 };
  const VIOLET_TINT = '#F2E6FF';
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
      // app side, mirroring chapter 6: instance panel, its context, the LLM bill and the booking
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
      s.saveCards = JR.map((_, i) => makeCallCard(root, i));
      s.reuseCards = JR.slice(0, 6).map((_, i) => makeCallCard(root, i));
      // the agent itself, handed to instance B: a call card in violet
      s.handChip = makeResultCard(root, true, 'LUNCH AGENT');
      Object.assign(s.handChip.style, { background: VIOLET_TINT, borderLeftColor: C.violet });
      s.newTag = tag(root, 'New instance', 'violet solid');
      Object.assign(s.newTag.style, { width: NEW_TAG.w + 'px', textAlign: 'center' });
      s.flash = makeFlash(root);
      s.done = tag(root, 'Agent complete', 'neon');
      s.logo = E(root, `<img src="${LOGO}" style="height:150px;display:block">`);
    },
    update(t, c, s) {
      // first run: each row is worked on, then saved, and only then the agent moves on
      const write = [0, 1, 2, 3, 4, 5].map(i => c[1] + 0.3 + i * 1.05).concat([c[3] + 2.9, c[3] + 3.95]);
      const saved = write.map(w => w + 0.85);
      // c[2]: the crash; once the memory blocks have fallen, instance A leaves (aDrop) and instance B arrives (bIn),
      // and the steps reset; Temporal hands B the agent: the chip leaves the history at handOff, as the "From the
      // start" arc draws, and reaches B's status at takeOver; step 1 runs again at rerun
      const crashAt = c[2] + 0.8, aDrop = crashAt + 1.6, bIn = aDrop + 0.6, reset = bIn;
      const handOff = bIn + 0.7, takeOver = handOff + 0.55, rerun = takeOver + 0.3;
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
      draw(s.restart, P(t, handOff, 0.8), 1 - P(t, c[3] + 0.3, 0.4));
      place(s.restartL, 960, 115, 1, P(t, handOff + 0.4, 0.35) * (1 - P(t, c[3] + 0.3, 0.4)));

      // app instance A runs, crashes, then leaves like a dead machine: it greys, drops and fades out
      const aIn = P(t, c[0] + 2.3, 0.5, backOut);
      const aGrey = P(t, aDrop, 0.3);
      const aDropY = Math.round(DROP * P(t, aDrop, 0.6, easeIn));
      const aOn = 1 - P(t, aDrop, 0.6);
      place(s.A, APP.x + sx, APP.y + sy + aDropY, aIn, clamp(aIn * 2) * aOn);
      if (dead) setAppStatus(s.A, 'CRASHED', 'crashed');
      else setAppStatus(s.A, 'RUNNING THE AGENT', t >= write[0] ? 'running' : 'idle');
      // a new copy, instance B, slides in from the left once A is gone, its border glowing violet while it arrives
      // and takes over, gone by c[3] (the glow pulses on G, as an ambient loop); IDLE until the agent chip reaches it
      const bHere = t >= bIn;
      const bDx = Math.round(ARRIVE * (1 - P(t, bIn, 0.7, backOut)));
      place(s.B, APP.x + bDx, APP.y, 1, P(t, bIn, 0.25));
      if (t < takeOver) setAppStatus(s.B, 'IDLE', 'stopped');
      else if (t < replay[0]) setAppStatus(s.B, 'TAKING OVER', t >= rerun ? 'running' : 'idle');
      else if (t < told[0]) setAppStatus(s.B, 'REPLAYING…', 'running');
      else setAppStatus(s.B, 'RUNNING THE AGENT', 'running');
      const glow = P(t, bIn, 0.3) * (1 - P(t, c[3] - 0.3, 0.3));
      if (glow > 0) {
        const pulse = 0.5 + 0.5 * Math.sin(G * Math.PI * 2.4);
        const blur = Math.round(20 + 16 * pulse), spread = Math.round(2 + 4 * pulse);
        s.B.style.boxShadow = `0 0 ${blur}px ${spread}px rgba(182,100,255,${(0.6 * glow).toFixed(3)})`;
        s.B.style.borderColor = C.violet;
      } else {
        s.B.style.boxShadow = '';
      }

      // context: filled as results are saved, emptied by the crash, refilled from the history. The panel moves
      // with the instance on screen (A, then B), so it never floats without its app; both are gone when it switches.
      const memDx = bHere ? bDx : sx, memDy = bHere ? 0 : sy + aDropY;
      const memOn = bHere ? P(t, bIn, 0.25) : aOn;
      place(s.mem, MEM.x + memDx, MEM.y + memDy, 1, P(t, c[0] + 2.5, 0.45) * memOn);
      s.mem.style.borderColor = dead && !bHere ? C.red : C.line;
      s.mem.empty.style.opacity = bHere ? 0 : P(t, crashAt + 1.1, 0.4);
      let greyed = '';
      if (!bHere && aGrey > 0) greyed = `grayscale(${aGrey.toFixed(3)}) brightness(${(1 - 0.35 * aGrey).toFixed(3)})`;
      s.A.style.filter = greyed;
      s.mem.style.filter = greyed;
      // the blocks of A have all fallen before A leaves; B's are empty until the replay
      s.mblocks.forEach((b, i) => {
        if (!bHere) {
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

      // LLM CALL and TOOL CALL cards: app -> Temporal when saving, Temporal -> app when replaying
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
      // takeover: NEW INSTANCE pops on B once it is almost in place and is gone by c[3]; Temporal hands it the agent,
      // a chip from the first history row to its status, which then reads TAKING OVER
      const newAt = bIn + 0.5;
      const newOn = P(t, newAt, 0.2) * (1 - P(t, c[3] - 0.4, 0.3));
      place(s.newTag, NEW_TAG.x + bDx, NEW_TAG.y, swell(t, newAt, 0.14), newOn);
      fly(s.handChip, t, handOff, HIST.cardX, rowY(0), handOff + 0.1, 0.45, STATUS_AT.x, STATUS_AT.y,
        takeOver, STATUS_AT.x, STATUS_AT.y);
    }
  });
}
