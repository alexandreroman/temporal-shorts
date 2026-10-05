// ===================== 2. SURVIVES CRASHES
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 2, title: 'Survives crashes',
    shift: [0, 0],
    subs: [
      {
        text: "Every model call and tool call is saved in the agent's Temporal history as soon as it completes.",
        after: 0.6,
      },
      { text: "If the app crashes mid-turn, another copy picks up the agent exactly where it left off.", after: 0.6 },
      { text: "Saved results are reused, not redone: no token is paid twice, and no tool runs twice.", after: 0.6 },
    ],
    // placeholder until the scene is built: its title, centered in the free band
    build(root, s) {
      s.title = E(root, 'Survives crashes', '', { fontSize: '96px', letterSpacing: '-2px' });
    },
    update(t, c, s) {
      place(s.title, 960, 522, 1, P(t, 0.15, 0.9));
    }
  });
}
