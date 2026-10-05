// ===================== 4. THE DECISION ARRIVES
// The block keeps every name declared in this file local to this scene.
{
  // same layout as chapter 3, which ends with the Workflow waiting and app instance A gone
  const ROW_Y = 200;
  const APP = { x: 470, y: 470 };
  const CLOCK = { x: 277, y: 745 };
  const MARIA = { x: 200, y: 450 }, CARD = { x: 580, y: 470 };
  scene({
    chapter: 4, title: 'The decision arrives',
    shift: [0, 38],
    subs: [
      {
        text: "Three days later, Maria taps Approve. "
          + "Temporal delivers the decision to the Workflow as a <b>Signal</b>.",
        after: 1.4,
      },
      {
        text: "Any running copy of the app picks it up, replays the history, and resumes right after the wait.",
        after: 1.6,
      },
      {
        text: "The order is placed and Sam is notified. No step was redone, and nothing was lost along the way.",
        after: 1.8,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.steps = makeStepRow(root, s.svg, ROW_Y);
      s.maria = makeAvatar(root, 'Maria, manager');
      s.card = makeApprovalCard(root);
      s.signal = tag(root, 'Signal: approved', 'neon');
      // solid background: the pill leaves from the white card and must stay readable over it
      s.signal.style.background = '#1B1B1F';
      s.B = makeWorkflowApp(root, 'APP INSTANCE B');
      s.clock = makeWaitClock(root, 'Waiting for Maria');
      s.ticket = makeTicket(root, '1 ORDER');
      s.temporal = makeTemporalPanel(root);
      s.jr = makeHistory(root);
    },
    update(t, c, s) {
      const tap = c[0] + 1.6, signalIn = c[0] + 3.5;
      // replay: rows 1 to 4 are read back one by one, the cursor follows without redoing the steps
      const replay = [0, 1, 2, 3].map(i => c[1] + 1.3 + i * 0.5);
      const resumed = replay[3] + 0.5;
      const orderOn = c[2] + 0.3, ordered = c[2] + 1.3, notifyOn = c[2] + 1.7, notified = c[2] + 2.7;
      const saved = [-1, -1, -1, signalIn + 0.1, ordered + 0.2, notified + 0.2];
      const complete = notified + 0.6;

      const states = [
        2,
        t >= resumed ? 2 : 4,
        t >= ordered ? 2 : t >= orderOn ? 1 : 0,
        t >= notified ? 2 : t >= notifyOn ? 1 : 0,
      ];
      placeStepRow(s.steps, t, -1, states);

      // Maria approves on her card, three days later
      const left = P(t, c[1], 0.4);
      const mp = P(t, c[0] + 0.2, 0.5, backOut);
      place(s.maria, MARIA.x, MARIA.y, mp, clamp(mp * 2) * (1 - left));
      const kp = P(t, c[0] + 0.4, 0.5, backOut);
      place(s.card, CARD.x, CARD.y, kp, clamp(kp * 2) * (1 - left));
      tapApprove(s.card, t, tap);
      setClock(s.card.clk, 9 + Math.min(t, signalIn) * 0.6);
      // the Signal leaves the Approve button and lands in the history, in the slot of the waiting line
      fly(s.signal, t, tap + 0.5, CARD.x - 100, CARD.y + 100, tap + 0.8, 0.9, HIST.cardX + 150, rowY(3),
        signalIn - 0.2, HIST.cardX + 150, rowY(3));

      // the clock stops once the answer is in
      setWaitClock(s.clock, 9 + Math.min(t, signalIn) * 0.6, 3);
      s.clock.cap.textContent = t >= signalIn ? 'Answer received' : 'Waiting for Maria';
      s.clock.cap.style.color = t >= signalIn ? C.neon : C.slate;
      place(s.clock, CLOCK.x, CLOCK.y, 1, 1);

      // app instance B takes over in the place of A
      const bIn = P(t, c[1] + 0.5, 0.5, backOut);
      place(s.B, APP.x, APP.y, bIn, clamp(bIn * 2));
      if (t < replay[0]) setAppStatus(s.B, 'TAKING OVER', 'idle');
      else if (t < resumed) setAppStatus(s.B, 'REPLAYING…', 'running');
      else if (t < complete) setAppStatus(s.B, 'RESUMED AFTER THE WAIT', 'running');
      else setAppStatus(s.B, 'WORKFLOW COMPLETE', 'idle');
      // the cursor jumps quickly through the replayed lines, then moves at the pace of the real steps
      const pos = P(t, replay[1], 0.2) + P(t, replay[2], 0.2) + P(t, replay[3], 0.2) + P(t, ordered + 0.3, 0.3);
      const cursorOn = t >= replay[0] && t < complete;
      setWfCursor(s.B, pos, P(t, replay[0], 0.2) * (1 - P(t, complete, 0.3)));
      const lineDone = [replay[1], replay[2], replay[3], ordered, notified];
      lineDone.forEach((at, i) => {
        const current = cursorOn && Math.round(pos) === i;
        setWfLine(s.B, i, t >= at ? 1 : current ? 3 : 0);
      });

      // the order is placed once
      const tp = P(t, ordered, 0.45, backOut);
      place(s.ticket, 660, CLOCK.y, tp, clamp(tp * 2));
      s.ticket.style.borderColor = C.neon;

      // Event History: rows 1 to 3 already saved, the Signal replaces the waiting line, then the last steps
      place(s.temporal, 1380, 555, 1, 1);
      place(s.jr, HIST.x, HIST.y, 1, 1);
      s.jr.rows.forEach((_, i) => {
        showRow(s.jr, i, i < 3 ? 1 : P(t, saved[i] - 0.1, 0.3));
        const isReplayed = i < 4 && t >= replay[i];
        const at = isReplayed ? replay[i] : saved[i];
        setRowTag(s.jr, i, t, isReplayed ? 'REPLAYED' : 'SAVED', at, i < 3 ? 1 : P(t, saved[i], 0.25));
      });
      setWaitLine(s.jr, 1 - P(t, signalIn - 0.2, 0.3));
      const scanning = replay.findIndex(q => t >= q && t < q + 0.5);
      s.jr.scan.style.opacity = scanning >= 0 ? 1 : 0;
      s.jr.scan.style.top = (68 + Math.max(0, scanning) * 44) + 'px';
      const dp = P(t, complete, 0.45, backOut);
      s.jr.done.style.opacity = clamp(dp * 2);
      s.jr.done.style.transform = `translateX(-50%) scale(${dp})`;
    }
  });
}
