// ===================== OUTRO
// Opens on the proxy box that chapter 5 ends on, alone, small at the top, wearing its 1.0 badge (OUTRO_SHOT); the end
// card fades in under it as a neon ring leaves the badge and the box's glow swells once.
// The block keeps every name declared in this file local to this scene.
{
  // the end card's center on screen, under the box (OUTRO_BOX): the box and the card, measured, span y 214-815,
  // centered on y 515
  const CARD_Y = 657;
  // the ring and the glow's swell, as the end card comes in
  const PULSE_AT = 0.5;

  scene({
    pre: 0.4, post: 2.6,
    // a hard cut: chapter 5 ends on this scene's first frame
    fadeIn: 0,
    subs: [
      { text: "Credentials and encryption leave your Workers for one place you control." },
    ],
    build(stage, s) {
      // the box and its badge in a camera layer framed as chapter 5 leaves them; the end card on the stage
      const root = s.cam = makeCamera(stage);
      s.box = makeProxy(root);
      s.badge = makeVersionBadge(root);
      s.rings = makeRipples(root, 2, RGB.neon);
      s.card = makeEndCard(stage, 'Temporal Proxy 1.0', 'SECURITY OUT OF YOUR WORKER CODE');
    },
    update(t, c, s) {
      const cam = shot(t, OUTRO_SHOT, []);
      setCamera(s.cam, t, this.dur, { ...cam, enter: 1, exit: 1 });
      const swellGlow = Math.max(0, 1 - Math.abs(t - PULSE_AT - 0.2) / 0.6);
      placeProxy(s.box, { glow: swellGlow });
      const badgeY = PROXY.y + VERSION_BADGE.dy;
      place(s.badge, PROXY.x, badgeY, swell(t, PULSE_AT, 0.08));
      placeRipples(s.rings, t, PULSE_AT, PROXY.x, badgeY, 120, 420, { d: 1.0, step: 0.2 });
      place(s.card, 960, CARD_Y, 1, P(t, 0.3, 0.8));
    }
  });
}
