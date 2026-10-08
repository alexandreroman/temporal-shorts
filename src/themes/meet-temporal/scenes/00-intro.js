// ===================== INTRO
// The block keeps every name declared in this file local to this scene.
{
  // the symbol sits in the middle of the orbit, centered on the title block (y 440)
  const ORBIT = { x: 1450, y: 440, rx: 400, ry: 290 };
  const SYMBOL_SIZE = 260;
  // everyday apps that run on Temporal: shopping, payments, rides, streaming, AI
  const ORBIT_ICONS = ['cart', 'card', 'car', 'play', 'sparkle'];
  const TRAIL = [0.05, 0.1, 0.15]; // how far each ghost of an orbiting icon lags behind it, in radians
  const PARTICLES = 40;
  scene({
    pre: 1.0,
    shift: [-150, 82],
    subs: [
      { text: "Many apps you use every day run on Temporal. What is it, and where does it come from?", after: 0.5 },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.t = makeTitleBlock(root, 'AN INTRODUCTION FOR EVERYONE', 'What is<br>Temporal?',
        'THE STORY OF DURABLE EXECUTION');
      s.glow = E(root, '', '', {
        width: '560px', height: '560px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(182,100,255,.30) 0%, rgba(68,76,231,.12) 40%, rgba(68,76,231,0) 68%)',
      });
      // stars that converge on the symbol as it draws itself: each starts at a hashed angle and distance
      s.particles = Array.from({ length: PARTICLES }, (_, i) => {
        const e = makeSpark(root, 4 + Math.round(hash(i * 3) * 5), i % 3 ? '248,250,252' : '182,100,255');
        e.angle = hash(i * 3 + 1) * Math.PI * 2;
        e.dist = 420 + hash(i * 3 + 2) * 520;
        e.delay = hash(i * 7) * 0.7;
        return e;
      });
      // built before the symbol, so an orbiting icon passing behind it goes under it; each icon trails three fainter
      // copies of itself
      s.orb = ORBIT_ICONS.map(n => ({
        icon: E(root, ICON(n, 50, C.ink, 1.6)),
        ghosts: TRAIL.map(() => E(root, ICON(n, 50, C.violet, 1.6))),
      }));
      s.symbol = makeDrawnSymbol(root, SYMBOL_SIZE);
      s.ripples = makeRipples(root, 2, '182,100,255');
    },
    update(t, c, s) {
      // a slow push-in until the title card settles, then the zoom-through into chapter 1
      setCamera(s.cam, t, this.dur, { scale: lerp(0.96, 1, P(t, 0, 5.0)), enter: 1 });
      rise(s.t, 640, 440, P(t, 0.15, 0.9));

      // the stars converge, then the symbol draws itself and fills in, with a ripple as it completes
      s.particles.forEach(e => {
        const p = P(t, 0.1 + e.delay, 1.2, easeIn);
        const d = e.dist * (1 - p);
        const o = p > 0 && p < 1 ? Math.min(1, p * 4) * 0.9 : 0;
        place(e, ORBIT.x + Math.cos(e.angle) * d, ORBIT.y + Math.sin(e.angle) * d * 0.8, 1 - 0.6 * p, o);
      });
      place(s.symbol, ORBIT.x, ORBIT.y, 1 + 0.06 * win(t, 2.5, 2.9, 0.2), P(t, 0.8, 0.2));
      setSymbolDraw(s.symbol, P(t, 0.9, 1.6), P(t, 2.3, 0.6));
      placeRipples(s.ripples, t, 2.6, ORBIT.x, ORBIT.y, SYMBOL_SIZE, SYMBOL_SIZE * 2.2);
      // the glow breathes slowly (ambient, driven by G)
      place(s.glow, ORBIT.x, ORBIT.y, 1 + 0.04 * Math.sin(G * 1.6), P(t, 1.6, 0.9));

      s.orb.forEach(({ icon, ghosts }, i) => {
        const pp = P(t, 2.6 + i * 0.15, 0.6, backOut);
        const at = a => [ORBIT.x + Math.cos(a) * ORBIT.rx, ORBIT.y + Math.sin(a) * ORBIT.ry];
        const depth = a => 0.45 + 0.55 * (Math.sin(a) + 1) / 2;
        const a = G * 0.4 + i * (Math.PI * 2 / ORBIT_ICONS.length);
        place(icon, ...at(a), pp, clamp(pp * 2) * depth(a));
        ghosts.forEach((g, k) => {
          const ga = a - TRAIL[k];
          place(g, ...at(ga), pp * (1 - 0.12 * (k + 1)), clamp(pp * 2) * depth(ga) * (0.35 - 0.1 * k));
        });
      });
    }
  });
}
