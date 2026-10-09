// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  scene({
    pre: 0.4, post: 2.6,
    shift: [0, 51],
    subs: [{ text: "Durable AI agents keep their progress and your budget." }],
    build(root, s) {
      s.t = makeEndCard(root, 'Durable AI Agents', 'KEEP THEIR PROGRESS AND YOUR BUDGET');
      s.llm = makeLLM(root, 120, '');
    },
    update(t, c, s) {
      placeEndCard(s.t, t);
      const p = backPop(t, 0.1, 0.7);
      place(s.llm.root, 960, 286, p.s, p.o);
      llmState(s.llm, { lookY: 0.4 });
    }
  });
}
