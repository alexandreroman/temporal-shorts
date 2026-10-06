// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  scene({
    pre: 0.4, post: 2.6,
    shift: [0, 51],
    subs: [{ text: "Durable AI agents keep their progress and your budget." }],
    build(root, s) {
      s.t = makeEndCard(root, 'Durable AI agents', 'KEEP THEIR PROGRESS AND YOUR BUDGET');
      s.llm = makeLLM(root, 120, '');
    },
    update(t, c, s) {
      place(s.t, 960, 560, 1, P(t, 0.3, 0.8));
      const p = P(t, 0.1, 0.7, backOut);
      place(s.llm.root, 960, 286, p, clamp(p * 2));
      llmState(s.llm, { lookY: 0.4 });
    }
  });
}
