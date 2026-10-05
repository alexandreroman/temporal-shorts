// ===================== 7. WHAT YOU GET
// Stub: the subtitles are final; build() and update() show a placeholder until the scene is animated.
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 7, title: 'What you get',
    // laid out around the stage center (960, 540), lifted to the center of the free band (960, 522)
    shift: [0, -18],
    subs: [
      { text: "A Workflow can even wait for days, for a delivery or a reply, without tying up a server.", after: 1.0 },
      {
        text: "You write the business logic. Temporal handles retries, state and recovery, with full visibility.",
        after: 0.8,
      },
    ],
    build(root, s) {
      s.t = E(root, 'What you get', 'lbl', { fontSize: '28px' });
    },
    update(t, c, s) {
      place(s.t, 960, 540, 1, P(t, 0.15, 0.6));
    }
  });
}
