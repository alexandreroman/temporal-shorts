// ===================== 7. WHAT YOU CAN BUILD
// The use cases the pattern fits: one tile per kind of decision, each with examples, lit as the subtitle names it.
// The block keeps every name declared in this file local to this scene.
{
  // The row of tiles spans the content frame, 40 px apart, on the line y=522, like the recap's
  const USES = [
    ['check', 'Approvals', 'expenses, purchases, leave'],
    ['eye', 'Reviews', 'content, code, loan files'],
    ['pen', 'Signatures', 'contracts, offers, NDAs'],
    ['bot', 'AI agent approvals', 'actions, tool calls'],
  ];
  const TILE = { w: (FRAME.x1 - FRAME.x0 - 3 * FRAME.gap) / 4, h: 300, y: 522 };
  const tileX = i => FRAME.x0 + TILE.w / 2 + i * (TILE.w + FRAME.gap);

  scene({
    chapter: 7, title: 'What you can build',
    // laid out centered at (960, 522) on the content frame
    subs: [
      {
        text: "Sam's laptop is one case: any step where a person decides fits the same pattern.",
        // the last tile lands at c[0] + 4.25, within the subtitle
      },
      {
        text: "Approvals, reviews, signatures, a user confirming an AI agent's tool call: the Workflow waits, then carries on.",
        // the last tile is lit until c[1] + 3.9; the full row then holds through this pause until the fade
        after: 0.6,
      },
    ],
    build(root, s) {
      s.uses = USES.map(([icon, label, example]) => useCaseTile(root, icon, label, example, TILE.w, TILE.h,
        { size: 64, stroke: 1.6, font: 22, gap: 22, exampleFont: 20 }));
    },
    update(t, c, s) {
      // one tile at a time while "any step where a person decides" reads, then each lights up as it is named
      s.uses.forEach((e, i) => {
        const p = P(t, c[0] + 1.4 + i * 0.8, 0.45, backOut);
        place(e, tileX(i), TILE.y, p, clamp(p * 2));
        const named = c[1] + 0.3 + i * 0.9;
        e.style.borderColor = t >= named && t < named + 0.9 ? C.uv : C.line;
      });
    }
  });
}
