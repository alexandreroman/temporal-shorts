// ===================== 2. WHEN A STEP FAILS
// Stub: the subtitles are final; build() and update() show a placeholder until the scene is animated.
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 2, title: 'When a step fails',
    // laid out around the stage center (960, 540), lifted to the center of the free band (960, 522)
    shift: [0, -18],
    subs: [
      {
        text: "But in real life, things fail: networks drop, services time out, servers restart for a deploy.",
        after: 0.4,
      },
      {
        text: "Here, the server crashes right after charging the card. The order is stuck: paid, but never shipped.",
        after: 0.8,
      },
      { text: "Restart it from the top, and the card is charged a second time. The customer pays twice.", after: 1.2 },
    ],
    build(root, s) {
      s.t = E(root, 'When a step fails', 'lbl', { fontSize: '28px' });
    },
    update(t, c, s) {
      place(s.t, 960, 540, 1, P(t, 0.15, 0.6));
    }
  });
}
