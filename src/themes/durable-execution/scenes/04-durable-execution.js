// ===================== 4. DURABLE EXECUTION WITH TEMPORAL
// Stub: the subtitles are final; build() and update() show a placeholder until the scene is animated.
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 4, title: 'Durable Execution with Temporal',
    // laid out around the stage center (960, 540), lifted to the center of the free band (960, 522)
    shift: [0, -18],
    subs: [
      {
        text: "<b>Durable Execution</b> takes another path: your code runs to completion, even when servers fail.",
        after: 0.5,
      },
      {
        text: "With Temporal, you write the process as a <b>Workflow</b>, "
          + "and each step that calls a service as an <b>Activity</b>.",
        after: 0.6,
      },
      {
        text: "If an Activity fails, Temporal retries it automatically, with growing delays, until it succeeds.",
        after: 1.2,
      },
    ],
    build(root, s) {
      s.t = E(root, 'Durable Execution with Temporal', 'lbl', { fontSize: '28px' });
    },
    update(t, c, s) {
      place(s.t, 960, 540, 1, P(t, 0.15, 0.6));
    }
  });
}
