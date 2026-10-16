// ===================== INTRO
// Title on the left; on the right, the payload card of the transfer. On a slow loop, its lock snaps shut and its
// IBANs scramble into ciphertext, then back. At the end the card shrinks and flies into the Worker of chapter 1's
// lane (PAYLOAD_IN_WORKER).
// The block keeps every name declared in this file local to this scene.
{
  // title block and card, measured: x 138-1780. The title block spans y 287-743, centered on y 515; the card is
  // centered on y 530, so that with its lock badge it spans y 299-732, centered on y 515 too
  const TITLE = { x: 590, y: 515 };
  const CARD = { x: 1480, y: 530, w: 600 };
  // one pass of the loop, in seconds from its start: the lock snaps shut, the two IBANs scramble one after the
  // other, hold sealed, unscramble, then the lock opens and the card stays in clear until the next pass
  const LOOP = {
    start: 2.2, period: 6.0, seal: 0, sealD: 0.35, ripple: 0.12,
    scramble: 0.45, unscramble: 3.6, scrambleD: 0.9, rowLag: 0.15, open: 4.7,
  };
  const IBAN_ROWS = [0, 1];
  // the ending, in seconds before the end of the scene: the card returns to clear, then flies to the Worker
  const CLEAR_BEFORE_END = 1.6;
  const FLY_BEFORE_END = 1.2;
  const FLY_D = 1.1; // the flight lands 0.1 s before the cut
  const GHOSTS = [0.07, 0.14, 0.21]; // how far each ghost outline of the flying card lags behind it, in progress

  // Seal and scramble of the loop at loop time u (negative before the first pass: open and in clear)
  const loopState = u => {
    if (u < 0) return { seal: 0, scramble: TRANSFER.map(() => 0) };
    const seal = u < LOOP.open ? P(u, LOOP.seal, LOOP.sealD, linear) : 1 - P(u, LOOP.open, LOOP.sealD, linear);
    const scramble = TRANSFER.map((_, i) => {
      if (!IBAN_ROWS.includes(i)) return 0;
      const lag = i * LOOP.rowLag;
      const on = P(u, LOOP.scramble + lag, LOOP.scrambleD, linear);
      const off = P(u, LOOP.unscramble + lag, LOOP.scrambleD, linear);
      return Math.min(on, 1 - off);
    });
    return { seal, scramble };
  };

  scene({
    pre: 1.0,
    // a hard cut: the card lands in the Worker, where chapter 1 opens on it
    fadeOut: 0,
    // presenter mode holds before the card returns to clear, then plays the flight into chapter 1 in one go
    holdBeforeEnd: CLEAR_BEFORE_END,
    subs: [
      {
        text: "A Workflow moves €25,000: account numbers, names, amounts. Who can see that data on its way?",
        after: 1.5,
      },
    ],
    build(root, s) {
      // a soft glow behind the card, sized to stay inside the content frame (y 190-870): the layout check counts it
      s.glow = E(root, '', '', {
        width: '680px', height: '680px', borderRadius: '50%',
        background: haloBackground(0.22, 0.1, 40, 68),
      });
      s.t = makeTitleBlock(root, 'AN EXPLAINER FOR SECURITY TEAMS', 'Who can see your<br>Workflow data?',
        'SECURITY WITH TEMPORAL');
      s.ghosts = GHOSTS.map(() => E(root, '', '', {
        border: `1px solid ${C.violet}`, borderRadius: 'var(--r)',
      }));
      s.card = makePayload(root, { w: CARD.w });
      // the lane-size card that lands in the Worker: it takes over from the large one halfway through the flight
      s.small = makePayload(root, { w: PAYLOAD_IN_WORKER.w });
      s.ripples = makeRipples(root, 2, RGB.neon);
      s.ghosts.forEach(g => Object.assign(g.style, { width: CARD.w + 'px', height: s.card.h + 'px' }));
    },
    update(t, c, s) {
      // the title rises in, and fades out in place as the card takes off
      rise(s.t, TITLE.x, TITLE.y, P(t, 0.15, 0.9));
      s.t.style.opacity = P(t, 0.15, 0.9) * (1 - P(t, this.dur - FLY_BEFORE_END - 0.2, 0.5));

      // the card pops in, its fields slide in one by one
      const pop = backPop(t, 0.5, 0.6);
      s.card.rows.forEach((row, i) => showRow(row.e, P(t, 0.8 + i * 0.12, 0.4), 26, true));

      // the loop runs on the ambient clock G: the live player sees the card as still once it is in. The intro
      // starts at 0, so in frozen mode (G = t) it plays as on the timeline. Before the flight, the card returns to
      // clear and opens, whatever the phase of the loop, as chapter 1 opens on it in clear.
      const u = t < LOOP.start ? -1 : (G - LOOP.start) % LOOP.period;
      const loop = loopState(u);
      const clear = 1 - P(t, this.dur - CLEAR_BEFORE_END, 0.4);
      setPayload(s.card, { seal: loop.seal * clear, scramble: loop.scramble.map(v => v * clear) });
      const sealed = clamp(loop.seal / LOCK_SHUT) * clear; // the glow brightens while the card is sealed
      place(s.glow, CARD.x, CARD.y, 1 + 0.04 * Math.sin(G * 1.4), P(t, 0.6, 0.9) * (0.7 + 0.3 * sealed)
        * (1 - P(t, this.dur - FLY_BEFORE_END, 0.4)));
      const lockY = CARD.y - s.card.h / 2;
      // neon rings from the lock as it snaps shut; none once the card returns to clear
      placeRipples(s.ripples, clear === 1 ? u : -1, LOOP.ripple, CARD.x, lockY, 40, 260);

      // the flight: along a low arc, the card shrinks to the lane size; halfway, the lane-size card takes over at
      // the same size on screen, and lands on whole pixels
      const flyAt = this.dur - FLY_BEFORE_END;
      const route = [
        [CARD.x, CARD.y], [CARD.x - 260, CARD.y - 70],
        [PAYLOAD_IN_WORKER.x + 320, PAYLOAD_IN_WORKER.y - 70], [PAYLOAD_IN_WORKER.x, PAYLOAD_IN_WORKER.y],
      ];
      const ratio = PAYLOAD_IN_WORKER.w / CARD.w;
      const at = p => ({ xy: bezier(route, p), k: lerp(1, ratio, p) });
      const p = P(t, flyAt, FLY_D);
      const now = at(p);
      const swapped = p >= 0.5;
      place(s.card, now.xy[0], now.xy[1], pop.s * now.k, swapped ? 0 : pop.o);
      place(s.small, now.xy[0], now.xy[1], now.k / ratio, swapped ? 1 : 0);
      // fading outlines trail the card while it flies
      s.ghosts.forEach((g, i) => {
        const lag = at(Math.max(0, p - GHOSTS[i]));
        const o = p > 0 && p < 1 ? (0.3 - 0.1 * i) * Math.min(1, p * 5, (1 - p) * 5) : 0;
        place(g, lag.xy[0], lag.xy[1], lag.k, o);
      });
    }
  });
}
