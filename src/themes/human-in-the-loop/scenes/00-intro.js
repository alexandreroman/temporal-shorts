// ===================== INTRO
// The block keeps every name declared in this file local to this scene.
{
  const ORBIT = { x: 1510, y: 440, rx: 430, ry: 300, speed: 0.4 }; // the card is centered on the title block (y 440)
  scene({
    pre: 1.0,
    shift: [-155, 42],
    subs: [
      {
        text: "Some processes need a person to decide: approve a purchase, review a contract. How does the app wait?",
        after: 0.8,
      },
    ],
    build(root, s) {
      s.t = makeTitleBlock(root, 'AN EXPLAINER FOR EVERYONE', 'How does an app<br>wait for a person?',
        'HUMAN-IN-THE-LOOP WITH TEMPORAL', { titleFont: 100, titleLineHeight: 1.04 });
      // built before the card, so an orbiting icon passing a corner goes behind it
      s.orb = ['user', 'mail', 'bell', 'hourglass', 'check', 'cal'].map(n => E(root, ICON(n, 50, C.ink, 1.6)));
      s.card = makeApprovalCard(root, 1.4);
    },
    update(t, c, s) {
      rise(s.t, 640, 440, P(t, 0.15, 0.9));
      const p = backPop(t, 0.4, 0.9);
      place(s.card, ORBIT.x, ORBIT.y, p.s, p.o);
      // the mini clock ticks: the minute hand jumps one minute every half second (ambient, driven by G)
      setClock(s.card.clk, REQUEST_HOUR + Math.floor(G * 2) / 60);
      s.orb.forEach((e, i) => {
        const pp = backPop(t, 0.9 + i * 0.15, 0.6), at = orbitAt(i, s.orb.length, ORBIT);
        place(e, at.x, at.y, pp.s, pp.o * at.depth);
      });
    }
  });
}
