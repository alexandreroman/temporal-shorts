// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  const AVATAR_SIZE = 110;
  const AVATAR_X = [895, 1025]; // 20 px apart, centered on the title
  const AVATAR_Y = 271;
  // a small constellation around the founders: star points, and the lines that join them (indexes into STARS;
  // -1 and -2 are the two faces)
  const STARS = [[700, 210], [760, 330], [640, 300], [1220, 200], [1170, 330], [1290, 290]];
  const LINKS = [[-1, 1], [1, 0], [0, 2], [1, 2], [-2, 4], [4, 3], [3, 5], [4, 5]];
  scene({
    pre: 0.4, post: 2.6,
    holdBeforeEnd: CAMERA_EXIT, // presenter mode holds before the exit zoom
    shift: [0, 55],
    subs: [
      { text: "Temporal keeps code running whatever fails, from everyday apps to AI agents." },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.svg = svgLayer(root);
      const point = i => (i === -1 ? [AVATAR_X[0], AVATAR_Y] : i === -2 ? [AVATAR_X[1], AVATAR_Y] : STARS[i]);
      s.links = LINKS.map(([a, b]) => path(s.svg, `M ${point(a).join(' ')} L ${point(b).join(' ')}`,
        'rgba(182,100,255,.45)', 1.5, false));
      s.stars = STARS.map((_, i) => makeSpark(root, 6 + (i % 3) * 2, i % 2 ? '182,100,255' : '248,250,252'));
      s.t = makeEndCard(root, 'Meet Temporal', 'DURABLE EXECUTION FOR APPS AND AI AGENTS');
      // the two founders
      s.founders = FOUNDERS.map(f => makeFace(root, f, AVATAR_SIZE));
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      place(s.t, 960, 560, 1, P(t, 0.3, 0.8));
      s.founders.forEach((e, i) => {
        const p = P(t, 0.1 + i * 0.15, 0.7, backOut);
        place(e, AVATAR_X[i], AVATAR_Y, p, clamp(p * 2));
      });
      // the stars light up, then the constellation draws from the faces outward; the stars twinkle (ambient, G)
      s.stars.forEach((e, i) => {
        const twinkle = 0.75 + 0.25 * Math.sin(G * 2.2 + i * 1.7);
        place(e, ...STARS[i], 1, P(t, 0.8 + i * 0.12, 0.4) * twinkle);
      });
      s.links.forEach((l, i) => draw(l, P(t, 1.2 + i * 0.15, 0.5)));
    }
  });
}
