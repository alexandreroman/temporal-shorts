// ===================== 3. HUMAN APPROVALS
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 3, title: 'Human approvals',
    shift: [0, 0],
    subs: [
      {
        text: "Some tool calls need a person's OK first, like a payment. The approval policy decides which ones.",
        after: 0.6,
      },
      {
        text: "The call pauses inside the Workflow, for minutes or days, then resumes as soon as someone approves.",
        after: 0.6,
      },
      {
        text: "Auto mode lets code or a model approve routine calls. Anything unclear still goes to a human.",
        after: 0.6,
      },
    ],
    // placeholder until the scene is built: its title, centered in the free band
    build(root, s) {
      s.title = E(root, 'Human approvals', '', { fontSize: '96px', letterSpacing: '-2px' });
    },
    update(t, c, s) {
      place(s.title, 960, 522, 1, P(t, 0.15, 0.9));
    }
  });
}
