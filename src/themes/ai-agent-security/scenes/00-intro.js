// ===================== INTRO
// The block keeps every name declared in this file local to this scene.
{
  scene({
    pre: 1.0,
    subs: [
      {
        text: "AI agents now read our emails, change our data and spend our money. What happens when one goes wrong?",
      },
    ],
    build(root, s) {
      s.t = makeTitleBlock(root, 'AN EXPLAINER FOR EVERYONE', 'Who keeps an AI agent<br>in check?',
        'REAL INCIDENTS, AND HOW TEMPORAL HELPS');
    },
    update(t, c, s) {
      rise(s.t, 960, 515, P(t, 0.15, 0.9));
    }
  });
}
