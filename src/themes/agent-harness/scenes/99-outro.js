// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  scene({
    // the end card stays on screen well after the subtitle
    pre: 1.0, post: 3.0,
    shift: [0, 50],
    subs: [
      {
        text: "Temporal Agent Harness is experimental and open source. Try the examples and build your own agents.",
        after: 1.5,
      },
    ],
    build(root, s) {
      s.t = makeEndCard(root, 'Temporal Agent Harness', 'YOUR LOOP AND YOUR SDKS, RUN DURABLY BY TEMPORAL',
        { pill: 'Experimental' });
      s.llm = makeLLM(root, 120, '');
    },
    update(t, c, s) {
      placeEndCard(s.t, t, 0.4, 0.9);
      const p = backPop(t, 0.2, 0.8);
      // the same gap from the LLM to the title as in the durable-ai-agents end card
      place(s.llm.root, 960, 246, p.s, p.o);
      llmState(s.llm, { lookY: 0.4 });
    }
  });
}
