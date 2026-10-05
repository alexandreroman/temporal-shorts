// ===================== OUTRO
// Stub: the subtitles are final; build() and update() show a placeholder until the scene is animated.
// The block keeps every name declared in this file local to this scene.
{
  scene({
    pre: 0.4, post: 2.6,
    // laid out around the stage center (960, 540), lifted to the center of the free band (960, 522)
    shift: [0, -18],
    subs: [
      { text: "Durable Execution: your code runs to completion, whatever fails along the way." },
    ],
    build(root, s) {
      s.t = E(root, 'Durable Execution', 'lbl', { fontSize: '28px' });
    },
    update(t, c, s) {
      place(s.t, 960, 540, 1, P(t, 0.15, 0.6));
    }
  });
}
