// ===================== 9. WHAT YOU CAN BUILD
// What durable agents are used for: one tile per kind of agent, each with examples, lit as the subtitle names it.
// The block keeps every name declared in this file local to this scene.
{
  // A row of 4 tiles, a little wider than the recap's to fit the examples (x 180..1740), centered on (960, 522)
  const USES = [
    ['user', 'Customer support', 'answers, refunds, follow-ups'],
    ['search', 'Research', 'hours of reading, one report'],
    ['book', 'Documents', 'invoices, contracts, claims'],
    ['code', 'Coding agents', 'plan, edit, test, repeat'],
  ];
  const TILE = { y: 522, w: 360, h: 280, pitch: 400 };

  scene({
    chapter: 9, title: 'What you can build',
    subs: [
      {
        text: "Lunch with Marie is one example: any agent that works through many steps needs Durable Execution.",
        // the last tile lands at c[0] + 4.45, within the subtitle
      },
      {
        text: "Customer support, research, documents, coding: the longer the task, the more a crash would cost.",
        // the last tile is lit until c[1] + 3.9; the full row then holds through this pause until the fade
        after: 0.6,
      },
    ],
    build(root, s) {
      s.uses = USES.map(([icon, label, example]) => useCaseTile(root, icon, label, example, TILE.w, TILE.h));
    },
    update(t, c, s) {
      // one tile at a time while "any agent that works through many steps" reads, then each lights up as it is named
      s.uses.forEach((e, i) => {
        const p = P(t, c[0] + 1.6 + i * 0.8, 0.45, backOut);
        place(e, 960 + (i - 1.5) * TILE.pitch, TILE.y, p, clamp(p * 2));
        const named = c[1] + 0.3 + i * 0.9;
        e.style.borderColor = t >= named && t < named + 0.9 ? C.uv : C.line;
      });
    }
  });
}
