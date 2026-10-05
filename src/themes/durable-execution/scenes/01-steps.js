// ===================== 1. A PROCESS IN MANY STEPS
// Stub: the subtitles are final; build() and update() show a placeholder until the scene is animated.
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 1, title: 'A process in many steps',
    // laid out around the stage center (960, 540), lifted to the center of the free band (960, 522)
    shift: [0, -18],
    subs: [
      { text: "Take an online order. Behind the Buy button, four steps run one after the other.", after: 0.4 },
      {
        text: "Charge the card, reserve the item, ship the package, email the receipt. "
          + "Each step calls another service.",
        after: 0.8,
      },
      {
        text: "For a developer, it's a short function: four calls, in order. Simple, as long as nothing fails.",
        after: 0.6,
      },
    ],
    build(root, s) {
      s.t = E(root, 'A process in many steps', 'lbl', { fontSize: '28px' });
    },
    update(t, c, s) {
      place(s.t, 960, 540, 1, P(t, 0.15, 0.6));
    }
  });
}
