// ===================== INTRO
// The block keeps every name declared in this file local to this scene.
{
  // the symbol sits in the middle of the orbit, centered on the title block (y 440)
  const ORBIT = { x: 1450, y: 440, rx: 400, ry: 290 };
  const SYMBOL_SIZE = 260;
  // everyday apps that run on Temporal: shopping, payments, rides, streaming, AI
  const ORBIT_ICONS = ['cart', 'card', 'car', 'play', 'sparkle'];
  scene({
    pre: 1.0,
    shift: [-150, 82],
    subs: [
      { text: "Many apps you use every day run on Temporal. What is it, and where does it come from?", after: 0.5 },
    ],
    build(root, s) {
      s.t = makeTitleBlock(root, 'AN INTRODUCTION FOR EVERYONE', 'What is<br>Temporal?',
        'THE STORY OF DURABLE EXECUTION');
      s.glow = E(root, '', '', {
        width: '560px', height: '560px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(182,100,255,.30) 0%, rgba(68,76,231,.12) 40%, rgba(68,76,231,0) 68%)',
      });
      // built before the symbol, so an orbiting icon passing behind it goes under it
      s.orb = ORBIT_ICONS.map(n => E(root, ICON(n, 50, C.ink, 1.6)));
      s.symbol = E(root, `<img src="${SYMBOL}" style="width:${SYMBOL_SIZE}px;height:${SYMBOL_SIZE}px;display:block">`);
    },
    update(t, c, s) {
      rise(s.t, 640, 440, P(t, 0.15, 0.9));
      const p = P(t, 0.4, 0.9, backOut);
      place(s.symbol, ORBIT.x, ORBIT.y, p, clamp(p * 2));
      // the glow breathes slowly (ambient, driven by G)
      place(s.glow, ORBIT.x, ORBIT.y, 1 + 0.04 * Math.sin(G * 1.6), P(t, 0.6, 0.9));
      s.orb.forEach((e, i) => {
        const a = G * 0.4 + i * (Math.PI * 2 / ORBIT_ICONS.length), pp = P(t, 0.9 + i * 0.15, 0.6, backOut);
        const depth = 0.45 + 0.55 * (Math.sin(a) + 1) / 2;
        place(e, ORBIT.x + Math.cos(a) * ORBIT.rx, ORBIT.y + Math.sin(a) * ORBIT.ry, pp, clamp(pp * 2) * depth);
      });
    }
  });
}
