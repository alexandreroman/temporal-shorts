// ===================== INTRO
// The block keeps every name declared in this file local to this scene.
{
  const ORBIT = { x: 1510, y: 440, rx: 430, ry: 300 }; // the card is centered on the title block (y 440)
  scene({
    pre: 1.0,
    shift: [-155, 82],
    subs: [
      {
        text: "Some processes need a person to decide: approve a purchase, review a contract. How does the app wait?",
        after: 0.8,
      },
    ],
    build(root, s) {
      s.t = E(root,
        `<img src="${LOGO}" style="height:58px;display:block;margin-bottom:46px">`
        + '<div class="mono" style="font-size:22px;letter-spacing:.14em;color:var(--slate)">'
        + 'AN EXPLAINER FOR EVERYONE</div>'
        + '<div style="font-size:100px;line-height:1.04;letter-spacing:-3px;margin-top:22px">'
        + 'How does an app<br>wait for a person?</div>'
        + '<div class="mono" style="font-size:24px;letter-spacing:.12em;color:var(--violet);margin-top:34px">'
        + 'HUMAN-IN-THE-LOOP WITH TEMPORAL</div>');
      // built before the card, so an orbiting icon passing a corner goes behind it
      s.orb = ['user', 'mail', 'bell', 'hourglass', 'check', 'cal'].map(n => E(root, ICON(n, 50, C.ink, 1.6)));
      s.card = makeApprovalCard(root, 1.4);
    },
    update(t, c, s) {
      place(s.t, 640, 440, 1, P(t, 0.15, 0.9));
      s.t.style.transform += ` translateY(${(1 - P(t, 0.15, 0.9)) * 24}px)`;
      const p = P(t, 0.4, 0.9, backOut);
      place(s.card, ORBIT.x, ORBIT.y, p, clamp(p * 2));
      // the mini clock ticks: the minute hand jumps one minute every half second (ambient, driven by G)
      setClock(s.card.clk, REQUEST_HOUR + Math.floor(G * 2) / 60);
      s.orb.forEach((e, i) => {
        const a = G * 0.4 + i * (Math.PI * 2 / 6), pp = P(t, 0.9 + i * 0.15, 0.6, backOut);
        const depth = 0.45 + 0.55 * (Math.sin(a) + 1) / 2;
        place(e, ORBIT.x + Math.cos(a) * ORBIT.rx, ORBIT.y + Math.sin(a) * ORBIT.ry, pp, clamp(pp * 2) * depth);
      });
    }
  });
}
