// ===================== 1. LLM CALLS
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 1, title: 'LLM calls',
    // pans with the LLM moves: alone with its chips, then app + LLM + cards, then text in / text out
    shift: (t, c) => pan(t, [-2, 29], [[c[1], 40, 30], [c[2], 8, 68]], 0.9),
    subs: [
      {
        text: "At the heart of every AI agent is an LLM: a large language model, "
          + "like those from OpenAI, Anthropic or Google.",
      },
      { text: "An app sends it some text. The model reads it, then writes a reply, word by word.", after: 0.8 },
      { text: "That's an LLM call: text in, text out. Nothing more.", after: 0.4 },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.llm = makeLLM(root, 240);
      s.chips = ['OpenAI', 'Anthropic', 'Google'].map(n => tag(root, n));
      s.app = makeApp(root);
      s.arrow = path(s.svg, 'M 600 430 L 1310 430', C.slate, 2.5);
      s.arrowL = E(root, 'LLM call', 'lbl', { color: 'var(--ink)' });
      s.q = makeCard(root, "Write one line about the sea.", 'user');
      s.a = makeCard(root, "The sea whispers its secrets to the pebbles.", 'llm', null, 560);
      s.inP = tag(root, 'Text in', 'violet big'); s.outP = tag(root, 'Text out', 'uv big');
      s.ar1 = path(s.svg, 'M 610 430 L 815 430', C.violet, 3); s.ar2 = path(s.svg, 'M 1105 430 L 1300 430', C.uv, 3);
    },
    update(t, c, s) {
      const mv1 = P(t, c[1], 0.9), mv2 = P(t, c[2], 0.9);
      const pop = P(t, c[0], 0.8, backOut);
      place(s.llm.root, 960 + 490 * mv1 - 490 * mv2, 430, pop, clamp(pop * 2));
      llmState(s.llm, { think: win(t, c[1] + 2.3, c[1] + 3.0, 0.2), look: -mv1 * (1 - mv2) });
      s.chips.forEach((ch, i) => {
        const p = P(t, c[0] + 2.4 + i * 0.25, 0.45, backOut);
        place(ch, 960 + (i - 1) * 230, 650, p, clamp(p * 2) * (1 - P(t, c[1], 0.4)));
      });
      const out = P(t, c[2], 0.5);
      const ap = P(t, c[1] + 0.2, 0.6, backOut);
      place(s.app, 420, 430, ap, clamp(ap * 2) * (1 - out));
      draw(s.arrow, P(t, c[1] + 0.5, 0.6), 1 - out);
      place(s.arrowL, 955, 398, 1, P(t, c[1] + 0.8, 0.4) * (1 - out));
      fly(s.q, t, c[1] + 0.6, 420, 260, c[1] + 1.0, 1.0, 1180, 260, c[1] + 2.0, 1450, 430);
      const aa = P(t, c[1] + 3.0, 0.4, backOut), af = P(t, c[1] + 5.2, 0.9);
      place(s.a, lerp(1250, 560, af), lerp(690, 720, af), aa, clamp(aa * 2) * (1 - out));
      typeWords(s.a, clamp((t - (c[1] + 3.1)) / 2.0));
      place(s.inP, 480, 430, P(t, c[2] + 0.5, 0.5, backOut), P(t, c[2] + 0.5, 0.4));
      place(s.outP, 1440, 430, P(t, c[2] + 1.3, 0.5, backOut), P(t, c[2] + 1.3, 0.4));
      draw(s.ar1, P(t, c[2] + 0.8, 0.4)); draw(s.ar2, P(t, c[2] + 1.1, 0.4));
    }
  });
}
