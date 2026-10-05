// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  scene({
    pre: 0.4, post: 2.6,
    shift: [0, 0],
    subs: [
      {
        text: "Temporal Agent Harness is experimental and open source. Try the examples and build your own agents.",
        after: 0.6,
      },
    ],
    // placeholder until the scene is built: its title, centered in the free band
    build(root, s) {
      s.title = E(root, 'Temporal Agent Harness', '', { fontSize: '96px', letterSpacing: '-2px' });
    },
    update(t, c, s) {
      place(s.title, 960, 522, 1, P(t, 0.15, 0.9));
    }
  });
}
