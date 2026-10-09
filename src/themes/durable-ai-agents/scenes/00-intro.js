// ===================== INTRO
// The block keeps every name declared in this file local to this scene.
{
  // the orbit of the everyday tasks round the LLM
  const ORBIT = { x: 1460, y: 460, rx: 260, ry: 175, speed: 0.45 };
  scene({
    pre: 1.0,
    shift: [-54, 82],
    subs: [
      { text: "AI agents search, book and send emails for us. But how do they actually work?", after: 0.3 },
    ],
    build(root, s) {
      s.t = makeTitleBlock(root, 'AN EXPLAINER FOR EVERYONE', 'How does an<br>AI agent work?',
        'AND WHY IT NEEDS DURABLE EXECUTION');
      s.llm = makeLLM(root, 250, '');
      s.orb = ['sun', 'cal', 'mail', 'search', 'food'].map(n => E(root, ICON(n, 50, C.ink, 1.6)));
    },
    update(t, c, s) {
      rise(s.t, 700, 440, P(t, 0.15, 0.9));
      const p = backPop(t, 0.4, 0.9);
      place(s.llm.root, ORBIT.x, ORBIT.y, p.s, p.o);
      llmState(s.llm, { look: Math.sin(G * 0.8) * 0.6 });
      s.orb.forEach((e, i) => {
        const pp = backPop(t, 0.9 + i * 0.15, 0.6), at = orbitAt(i, s.orb.length, ORBIT);
        place(e, at.x, at.y, pp.s, pp.o * at.depth);
      });
    }
  });
}
