// ===================== 7. WHAT YOU CAN BUILD
// The use cases the pattern fits: one tile per kind of decision, each with an example, lit as the subtitle names it.
// The block keeps every name declared in this file local to this scene.
{
  // The row of tiles spans the content frame, 40 px apart, on the line y=522, like the recap's
  const USES = [
    ['flag', 'Fraud reviews', 'a flagged payment waits'],
    ['idCard', 'Identity checks', 'an analyst verifies an ID'],
    ['upload', 'Deploy approvals', 'a release waits for a go'],
    ['bot', 'AI agent approvals', 'actions, tool calls'],
  ];
  const TILE = { w: (FRAME.x1 - FRAME.x0 - 3 * FRAME.gap) / 4, h: 300, y: 522 };
  const tileX = i => FRAME.x0 + TILE.w / 2 + i * (TILE.w + FRAME.gap);
  // Seconds after c[1] when subtitle 2 names each tile; a tile stays lit until the next one is named
  const NAMED_AT = [0.3, 1.25, 2.3, 3.4];
  const LAST_LIT = 1.2;

  scene({
    chapter: 7, title: 'What you can build',
    // laid out centered at (960, 522) on the content frame
    subs: [
      {
        text: "Sam's laptop is one case: any step where a person decides fits the same pattern.",
        // the last tile lands at c[0] + 4.25, within the subtitle
      },
      {
        text: "Fraud reviews, identity checks, deploy approvals, an AI agent's tool calls: "
          + "the Workflow waits for a person.",
        // the last tile is lit until c[1] + 4.6; the full row then holds through the end of the subtitle and
        // this pause until the fade
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
        const litFrom = c[1] + NAMED_AT[i];
        const litUntil = i + 1 < NAMED_AT.length ? c[1] + NAMED_AT[i + 1] : litFrom + LAST_LIT;
        e.style.borderColor = t >= litFrom && t < litUntil ? C.uv : C.line;
      });
    }
  });
}
