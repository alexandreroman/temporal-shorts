// ===================== 5. TYPED, COMPOSABLE AGENTS
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 5, title: 'Typed, composable agents',
    shift: [0, 0],
    subs: [
      {
        text: "An agent is more than text in, text out: it exposes typed operations, with their inputs and outputs.",
        after: 0.6,
      },
      {
        text: "It describes itself, so other agents can drive it as a tool: multi-agent systems with real contracts.",
        after: 0.6,
      },
    ],
    // placeholder until the scene is built: its title, centered in the free band
    build(root, s) {
      s.title = E(root, 'Typed, composable agents', '', { fontSize: '96px', letterSpacing: '-2px' });
    },
    update(t, c, s) {
      place(s.title, 960, 522, 1, P(t, 0.15, 0.9));
    }
  });
}
