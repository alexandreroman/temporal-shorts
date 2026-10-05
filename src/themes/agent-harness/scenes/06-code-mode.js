// ===================== 6. CODE MODE
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 6, title: 'Code Mode',
    shift: [0, 0],
    subs: [
      {
        text: "With Code Mode, the model writes a short Python script instead of calling tools one at a time.",
        after: 0.6,
      },
      {
        text: "Loops, conditions and parallel calls in one turn, and every call stays durable, approved and visible.",
        after: 0.6,
      },
    ],
    // placeholder until the scene is built: its title, centered in the free band
    build(root, s) {
      s.title = E(root, 'Code Mode', '', { fontSize: '96px', letterSpacing: '-2px' });
    },
    update(t, c, s) {
      place(s.title, 960, 522, 1, P(t, 0.15, 0.9));
    }
  });
}
