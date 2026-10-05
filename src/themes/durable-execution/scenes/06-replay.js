// ===================== 6. WHEN A WORKER CRASHES
// Stub: the subtitles are final; build() and update() show a placeholder until the scene is animated.
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 6, title: 'When a Worker crashes',
    // laid out around the stage center (960, 540), lifted to the center of the free band (960, 522)
    shift: [0, -18],
    subs: [
      {
        text: "Now the Worker crashes mid-order. "
          + "Another Worker picks up the Workflow and runs its code from the start.",
        after: 1.0,
      },
      {
        text: "For every step already in the history, Temporal hands back the saved result: no second charge.",
        after: 1.0,
      },
      { text: "Then the Workflow carries on exactly where it stopped, as if nothing had happened.", after: 1.0 },
    ],
    build(root, s) {
      s.t = E(root, 'When a Worker crashes', 'lbl', { fontSize: '28px' });
    },
    update(t, c, s) {
      place(s.t, 960, 540, 1, P(t, 0.15, 0.6));
    }
  });
}
