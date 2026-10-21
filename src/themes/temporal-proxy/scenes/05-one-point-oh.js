// ===================== 5. WHY 1.0 MATTERS
// Opens on the shared service at rest that chapter 4 ends on (SERVICE_REST), in SERVICE_SHOT, and pulls back once,
// left and out, to OUTRO_SHOT as everything but the proxy box fades out. Under the box, a version track draws: the ten
// 0.x releases, dim, 0.1 to 0.10, then the 1.0 slot, which lights up neon with rings (the dramatic beat), READY FOR
// PRODUCTION and SUPPORTED under it. Then the 1.0 badge rises onto the proxy box as the track and its tags drop
// away, which leaves the box alone, wearing its badge: the outro's first frame.
// The block keeps every name declared in this file local to this scene.
{
  // from c[0]: the camera pulls back (pull, pullD) as the service fades out (fadeD); the track draws (track, trackD)
  // and the 1.0 slot shows, dim (ghost); 1.0 lights up (light); READY FOR PRODUCTION (ready) and SUPPORTED (supported)
  // as the subtitle reads them; the badge rises onto the box (fly, flyD) as the track and its tags leave (leaveD)
  const T0 = {
    pull: -0.5, pullD: 1.4, fadeD: 0.8, track: 0.6, trackD: 0.6, ghost: 0.9, light: 1.4, ready: 1.9, supported: 3.5,
    fly: 4.4, flyD: 0.7, leaveD: 0.5,
  };
  // The track's layout in OUTRO_SHOT, in screen px (see onScreen): its line's ends and height (x0 to the 1.0 slot), the
  // dots of the ten 0.x releases (0.1 to 0.10, the last one as far from the slot's edge as from the dot before it),
  // the 1.0 slot, the faint line on past it (to xEnd, as far from the slot as x0), the labels of the first and last
  // dots (labelDy: under the track), and the two tags stacked under the slot, right-aligned on its right edge, the
  // first 20 px or more under the labels (tags: the first one's center y and the gap between them)
  const RELEASES = 10;
  const TRACK = {
    x0: 309, y: 700, dots: Array.from({ length: RELEASES }, (_, i) => 349 + i * 58), slot: 960, xEnd: 1611,
    labelDy: 30, tags: { y: 786, gap: 14 },
  };
  // One screen px in OUTRO_SHOT, in stage px: the track's parts are sized in screen px (n * U)
  const U = 1 / OUTRO_SHOT[2];
  // The stage point that OUTRO_SHOT shows at screen point (x, y)
  const onScreen = (x, y) => [OUTRO_SHOT[0] + (x - 960) * U, OUTRO_SHOT[1] + (y - 515) * U];
  // The 1.0 slot on the track and the badge's place on the proxy box (makeVersionBadge), stage px
  const SLOT = onScreen(TRACK.slot, TRACK.y);
  const ON_BOX = [PROXY.x, PROXY.y + VERSION_BADGE.dy];
  // The dots' size, px on screen, and how far the leaving parts drop, px on screen
  const DOT = 16;
  const DROP = 30;

  scene({
    chapter: 5, title: 'Why 1.0 matters',
    // hard cuts: chapter 4 ends on this chapter's first frame (SERVICE_REST), this chapter on the outro's (the proxy
    // box alone with its badge in OUTRO_SHOT)
    fadeIn: 0, fadeOut: 0,
    subs: [
      // the badge's rise, then a moment on the box wearing it
      { text: "Version 1.0 is ready for production, and Temporal's support policy covers it.", after: 0.6 },
    ],
    build(stage, s) {
      // the shared service first, in chapter 4's order, so the cut shows the same stack
      const root = s.cam = makeCamera(stage);
      s.service = makeServiceStage(root);
      // the track: its line up to the 1.0 slot, then on past it, faint and dashed
      const svg = svgLayer(root);
      const [x0, y] = onScreen(TRACK.x0, TRACK.y);
      const [slotX] = SLOT;
      const slotLeft = slotX - VERSION_BADGE.w / 2, slotRight = slotX + VERSION_BADGE.w / 2;
      const [xEnd] = onScreen(TRACK.xEnd, TRACK.y);
      s.line = path(svg, `M ${x0} ${y} L ${slotLeft} ${y}`, C.slate, 2 * U, false);
      s.past = path(svg, `M ${slotRight} ${y} L ${xEnd} ${y}`, C.line, 2 * U, false);
      // a faint dashed rise from the 1.0 slot up to the proxy box, the badge's way up
      const boxBottom = PROXY.y + PROXY.h / 2;
      s.riseLine = path(svg, `M ${slotX} ${y - VERSION_BADGE.h / 2} L ${slotX} ${boxBottom}`, C.line, 2 * U, false);
      s.dots = TRACK.dots.map(() => E(root, '', '', {
        width: DOT * U + 'px', height: DOT * U + 'px', borderRadius: '50%', background: C.bg,
        border: `${2 * U}px solid ${C.slate}`,
      }));
      // the first and last releases' labels
      s.labels = ['0.1', `0.${RELEASES}`].map(text => E(root, text, 'mono', { fontSize: 18 * U + 'px', color: C.slate }));
      // the empty 1.0 slot, dashed, which the badge lights up
      s.ghost = E(root, '1.0', 'mono', {
        width: VERSION_BADGE.w + 'px', height: VERSION_BADGE.h + 'px', lineHeight: (VERSION_BADGE.h - 4 * U) + 'px',
        textAlign: 'center', fontSize: VERSION_BADGE.font + 'px', fontWeight: '700', color: C.slate,
        background: C.bg, border: `${2 * U}px dashed ${C.slate}`, borderRadius: 'var(--rs)',
      });
      s.ready = scaledTag(root, 'READY FOR PRODUCTION', 'ok', 18, { u: U, solid: 'var(--neon-solid)' });
      s.supported = scaledTag(root, 'SUPPORTED', 'ok', 18, { u: U, solid: 'var(--neon-solid)' });
      s.badge = makeVersionBadge(root);
      s.rings = makeRipples(root, 2, RGB.neon);
    },
    update(t, c, s) {
      const pullAt = c[0] + T0.pull;
      const flyAt = c[0] + T0.fly;
      const landAt = flyAt + T0.flyD;
      const lightAt = c[0] + T0.light;

      // the camera: the shared service, then one pull-back, left and out, to the outro's framing
      const cam = shot(t, SERVICE_SHOT, [[pullAt, ...OUTRO_SHOT, T0.pullD]]);
      setCamera(s.cam, t, this.dur, { ...cam, enter: 1, exit: 1 });

      // the shared service, as chapter 4 left it, fades out but for the proxy box, whose glow swells as the badge
      // lands on it
      const landPulse = Math.max(0, 1 - Math.abs(t - landAt - 0.1) / 0.5);
      placeServiceStage(s.service, cam, { ...SERVICE_REST, fade: P(t, pullAt, T0.fadeD), glow: landPulse });

      // the track draws under the box, its dots popping in as the line reaches them; it drops away as the badge
      // leaves it
      const leave = P(t, flyAt, T0.leaveD);
      const leaveO = 1 - leave, leaveDy = leave * DROP * U;
      const trackAt = c[0] + T0.track;
      // when the line reaches the dot at dotX
      const dotAt = dotX => trackAt + T0.trackD * (dotX - TRACK.x0) / (TRACK.slot - TRACK.x0);
      draw(s.line, P(t, trackAt, T0.trackD, linear), leaveO);
      s.line.style.transform = `translateY(${leaveDy}px)`;
      drawDashed(s.past, P(t, trackAt + T0.trackD, 0.4, linear), 0.6 * leaveO, 8 * U, 8 * U);
      drawDashed(s.riseLine, P(t, lightAt + 0.3, 0.4, linear), 0.6 * leaveO, 8 * U, 8 * U);
      s.past.style.transform = `translateY(${leaveDy}px)`;
      TRACK.dots.forEach((dotX, i) => {
        const [x, y] = onScreen(dotX, TRACK.y);
        const pop = popIn(t, dotAt(dotX), 0.3);
        place(s.dots[i], x, y + leaveDy, pop.s, pop.o * leaveO);
      });
      // each label shows as its dot pops in
      [0, RELEASES - 1].forEach((i, k) => {
        const dotX = TRACK.dots[i];
        const [x, y] = onScreen(dotX, TRACK.y + TRACK.labelDy);
        place(s.labels[k], x, y + leaveDy, 1, P(t, dotAt(dotX), 0.3) * leaveO);
      });

      // the dramatic beat: the 1.0 slot lights up, the neon badge popping over it with rings; READY FOR PRODUCTION
      // and SUPPORTED under it. Then the badge rises onto the proxy box.
      const [slotX, slotY] = SLOT;
      place(s.ghost, slotX, slotY + leaveDy, 1, P(t, c[0] + T0.ghost, 0.3) * (t < lightAt + 0.2 ? 1 : 0));
      const pop = backPop(t, lightAt, 0.4);
      const up = P(t, flyAt, T0.flyD);
      place(s.badge, slotX, lerp(slotY, ON_BOX[1], up), pop.s, pop.o);
      placeRipples(s.rings, t, lightAt, slotX, slotY, 80 * U, 300 * U, { d: 0.9, step: 0.18 });
      // the tags, stacked under the slot, their right edges on the badge's: their sizes, measured unrounded (stage
      // px), so the edges match to the pixel
      const width = e => parseFloat(getComputedStyle(e).width);
      const height = e => parseFloat(getComputedStyle(e).height);
      const tagsRight = slotX + VERSION_BADGE.w / 2;
      const [, readyY] = onScreen(TRACK.slot, TRACK.tags.y);
      const supportedY = readyY + (height(s.ready) + height(s.supported)) / 2 + TRACK.tags.gap * U;
      [[s.ready, readyY, T0.ready], [s.supported, supportedY, T0.supported]].forEach(([tag, tagY, at]) => {
        const tagPop = popIn(t, c[0] + at);
        place(tag, tagsRight - width(tag) / 2, tagY + leaveDy, tagPop.s, tagPop.o * leaveO);
      });
    }
  });
}
