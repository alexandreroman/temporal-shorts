// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  scene({
    pre: 0.4, post: 2.6,
    // centers the end card on y 515 until a theme visual sits above it
    shift: [0, -45],
    subs: [
      { text: "With Temporal, your agents act within your rules, and every step stays on the record." },
    ],
    build(root, s) {
      s.t = makeEndCard(root, 'AI Agent Security', 'POWERFUL AGENTS, KEPT IN CHECK');
    },
    update(t, c, s) {
      placeEndCard(s.t, t);
    }
  });
}
