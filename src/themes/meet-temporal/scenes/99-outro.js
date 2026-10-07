// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  const AVATAR_SIZE = 110;
  const AVATAR_X = [895, 1025]; // 20 px apart, centered on the title
  scene({
    pre: 0.4, post: 2.6,
    shift: [0, 55],
    subs: [
      { text: "Temporal keeps code running whatever fails, from everyday apps to AI agents." },
    ],
    build(root, s) {
      s.t = makeEndCard(root, 'Meet Temporal', 'DURABLE EXECUTION FOR APPS AND AI AGENTS');
      // the two founders
      s.founders = FOUNDERS.map(f => makeFace(root, f, AVATAR_SIZE));
    },
    update(t, c, s) {
      place(s.t, 960, 560, 1, P(t, 0.3, 0.8));
      s.founders.forEach((e, i) => {
        const p = P(t, 0.1 + i * 0.15, 0.7, backOut);
        place(e, AVATAR_X[i], 271, p, clamp(p * 2));
      });
    }
  });
}
