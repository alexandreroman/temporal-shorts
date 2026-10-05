// ===================== 4. ONE EVENT STREAM
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 4, title: 'One event stream',
    shift: [0, 0],
    subs: [
      {
        text: "Every agent publishes the same event stream: turns, model calls, tool calls, approvals and token usage.",
        after: 0.6,
      },
      {
        text: "Watch an agent live, or replay exactly what it did, what it cost and where a human stepped in.",
        after: 0.6,
      },
    ],
    // placeholder until the scene is built: its title, centered in the free band
    build(root, s) {
      s.title = E(root, 'One event stream', '', { fontSize: '96px', letterSpacing: '-2px' });
    },
    update(t, c, s) {
      place(s.title, 960, 522, 1, P(t, 0.15, 0.9));
    }
  });
}
