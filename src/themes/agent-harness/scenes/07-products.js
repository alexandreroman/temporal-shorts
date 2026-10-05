// ===================== 7. BUILT FOR REAL PRODUCTS
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 7, title: 'Built for real products',
    shift: [0, 0],
    subs: [
      {
        text: "Callback tools run on the user's own device, and typed React and Svelte SDKs power your product UI.",
        after: 0.6,
      },
      {
        text: "Durable, observable, composable agents with human approvals, built with the AI SDKs you already use.",
        after: 0.6,
      },
    ],
    // placeholder until the scene is built: its title, centered in the free band
    build(root, s) {
      s.title = E(root, 'Built for real products', '', { fontSize: '96px', letterSpacing: '-2px' });
    },
    update(t, c, s) {
      place(s.title, 960, 522, 1, P(t, 0.15, 0.9));
    }
  });
}
