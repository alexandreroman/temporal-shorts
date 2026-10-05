// ===================== 3. THE USUAL FIX: PLUMBING
// Stub: the subtitles are final; build() and update() show a placeholder until the scene is animated.
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 3, title: 'The usual fix: plumbing',
    // laid out around the stage center (960, 540), lifted to the center of the free band (960, 522)
    shift: [0, -18],
    subs: [
      {
        text: "So developers add plumbing around the code: retries, status tables, queues, timers, cleanup jobs.",
        after: 0.6,
      },
      {
        text: "Soon the plumbing outweighs the business logic, and every corner case is a new bug to chase.",
        after: 0.8,
      },
    ],
    build(root, s) {
      s.t = E(root, 'The usual fix: plumbing', 'lbl', { fontSize: '28px' });
    },
    update(t, c, s) {
      place(s.t, 960, 540, 1, P(t, 0.15, 0.6));
    }
  });
}
