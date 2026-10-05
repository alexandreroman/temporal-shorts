// ===================== 1. AN AGENT HARNESS
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 1, title: 'An agent harness',
    shift: [0, 0],
    subs: [
      {
        text: "An AI agent is a model, plus tools, plus a loop. You write that loop with the AI SDK you already know.",
        after: 0.6,
      },
      {
        text: "The harness doesn't replace your loop, it wraps it: every agent runs as a durable Temporal Workflow.",
        after: 0.6,
      },
      {
        text: "It adds what is painful to build yourself: crash recovery, approvals, observability, composition.",
        after: 0.6,
      },
    ],
    // placeholder until the scene is built: its title, centered in the free band
    build(root, s) {
      s.title = E(root, 'An agent harness', '', { fontSize: '96px', letterSpacing: '-2px' });
    },
    update(t, c, s) {
      place(s.title, 960, 522, 1, P(t, 0.15, 0.9));
    }
  });
}
