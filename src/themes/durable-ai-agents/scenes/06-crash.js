// ===================== 6. CRASH
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 6, title: 'When the agent crashes',
    shift: [-55, 62],
    subs: [
      {
        text: "Now the app running the agent crashes just before the invite goes out. "
          + "Restarts, deploys, outages: it happens every day.",
        after: 0.4,
      },
      {
        text: "The context lived in the app's memory, not in the LLM. It's gone, so the agent has to start over.",
        after: 0.4,
      },
      {
        text: "Every LLM call is made, and paid for, a second time, just to rebuild the context. "
          + "And the table gets booked twice.",
        after: 1.2,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.steps = makeStepRow(root, s.svg, STEP_TILES, 420, 360, 290, 280, 140);
      s.ticket = makeTicket(root);
      s.mem = makeMemory(root, 860, 200);
      s.mblocks = makeMemBlocks(root, 6, 76, 56);
      s.bill = makeBill(root);
      s.bolt = E(root, ICON('bolt', 150, C.red, 1.6));
      s.flash = makeFlash(root);
      s.crash = tag(root, 'App crash', 'red big');
      s.causes = ['Restart', 'Deploy', 'Outage'].map(l => tag(root, l));
      s.redo = path(s.svg, 'M 1500 210 Q 965 80 430 205', C.red, 3);
      s.redoL = E(root, 'Start over', 'lbl', { color: C.red });
    },
    update(t, c, s) {
      const crashAt = c[0] + 3.9, restart = c[1] + 2.2;
      const [sx, sy] = shakeAt(t, crashAt);
      // first run: steps 1 to 3 complete (3 LLM calls, booking included), then step 4 starts and the app
      // crashes before its LLM call, at the same point as chapter 7
      const r1 = [[c[0] + 0.3, c[0] + 1.3], [c[0] + 1.4, c[0] + 2.4], [c[0] + 2.5, c[0] + 3.5], [c[0] + 3.6, 1e9]];
      const r2 = [[c[2] + 0.2, c[2] + 0.9], [c[2] + 1.0, c[2] + 1.7], [c[2] + 1.8, c[2] + 2.6], [1e9, 1e9]];
      const states = [0, 1, 2, 3].map(i => {
        let st = 0;
        const [a, b] = t < restart ? r1[i] : r2[i];
        if (t >= a) st = t >= b ? 2 : 1;
        if (t < restart && i === 3 && t >= crashAt) st = 3;
        return st;
      });
      placeStepRow(s.steps, t, 0.1, states, sx, sy);
      // LLM call counter
      const calls = [c[0] + 0.3, c[0] + 1.4, c[0] + 2.5, c[2] + 0.2, c[2] + 1.0, c[2] + 1.8].filter(x => t >= x).length;
      setBill(s.bill, calls, Math.max(0, calls - 3));
      place(s.bill, 1560 + sx, 630 + sy, P(t, 0.3, 0.45, backOut), P(t, 0.3, 0.4));
      // ticket
      const two = t >= c[2] + 2.6;
      s.ticket.n.textContent = two ? '2 BOOKINGS!' : '1 BOOKING';
      s.ticket.style.borderColor = two ? C.red : C.slate; s.ticket.n.style.color = two ? C.red : C.ink;
      const tp = P(t, c[0] + 3.5, 0.45, backOut);
      place(s.ticket, 1140 + sx, 435, tp * (1 + 0.2 * win(t, c[2] + 2.6, c[2] + 3.2, 0.2)), clamp(tp * 2));
      // memory
      place(s.mem, 720 + sx, 630 + sy, 1, P(t, 0.3, 0.45));
      s.mem.style.borderColor = t > crashAt && t < restart ? C.red : C.line;
      s.mem.empty.style.opacity = P(t, c[1] + 1.2, 0.4) * (1 - P(t, restart, 0.3));
      const add1 = [0.8, 1.3, 1.9, 2.4, 3.0, 3.5].map(x => c[0] + x);
      const add2 = [0.6, 0.9, 1.4, 1.7, 2.3, 2.6].map(x => c[2] + x);
      // left-aligned like chapter 7's slots: 20 px panel margin, then 76 px blocks every 88 px (12 px gaps)
      const slot0 = 720 - 860 / 2 + 20 + 76 / 2;
      s.mblocks.forEach((b, i) => {
        const x = slot0 + i * 88, y = 650;
        if (t < restart) {
          placeMemBlock(b, x, y, P(t, add1[i], 0.35, backOut), P(t, c[1] + 0.3 + i * 0.1, 0.8, easeIn), sx, sy);
        } else {
          placeMemBlock(b, x, y, P(t, add2[i], 0.35, backOut), 0, sx, sy);
        }
      });
      placeFlash(s.flash, t, crashAt);
      const bp = P(t, crashAt, 0.35, backOut);
      place(s.bolt, 1650, 190, bp, win(t, crashAt, crashAt + 1.5, 0.2));
      place(s.crash, 1560, 440, bp, win(t, crashAt + 0.1, c[1] + 0.3, 0.25));
      s.causes.forEach((e, i) => {
        const p = P(t, c[0] + 4.8 + i * 0.3, 0.4, backOut);
        place(e, 330 + i * 230, 440, p, clamp(p * 2) * (1 - P(t, c[1], 0.35)));
      });
      draw(s.redo, P(t, c[1] + 2.4, 0.8), 1 - P(t, c[2] + 3.0, 0.4));
      place(s.redoL, 965, 122, 1, P(t, c[1] + 2.9, 0.35) * (1 - P(t, c[2] + 3.0, 0.4)));
    }
  });
}
