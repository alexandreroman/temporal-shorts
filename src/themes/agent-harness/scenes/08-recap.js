// ===================== 8. WHAT YOU GET
// The recap: one tile per feature the video presents, landing one at a time.
// The block keeps every name declared in this file local to this scene.
{
  // Recap tiles, one chapter each: 3 columns x 2 rows across the frame (x 140-1780), 40 px gutters, centered on
  // (960, 522); they land 1 s apart
  const RECAP = [
    ['retry', 'Survives crashes'], ['stream', 'Event stream'], ['layers', 'Typed subagents'],
    ['user', 'Human approvals'], ['code', 'Code Mode'], ['agent', 'Your AI SDK'],
  ];
  const TILE = { w: 520, h: 240, gap: 40 };
  const recapX = i => 140 + TILE.w / 2 + (i % 3) * (TILE.w + TILE.gap);
  const recapY = i => 522 + (Math.floor(i / 3) - 0.5) * (TILE.h + TILE.gap);

  // recap tile: a large icon over its label, at the size of this grid
  const makeRecapTile = (p, icon, label) => iconTile(p, icon, label, TILE.w, TILE.h, C.ink,
    { size: 76, font: 26, gap: 20 });

  scene({
    chapter: 8, title: 'What you get',
    // the chapter header reads before the subtitle; the full grid holds before the fade
    pre: 1.5, post: 2.0,
    subs: [
      {
        text: "Durable, observable, composable agents with human approvals, built with the AI SDKs you already use.",
        // the last tile lands at c[0] + 6.15 and the full grid reads for 2 s before the window ends
        after: 1.0,
      },
    ],
    build(root, s) {
      s.recap = RECAP.map(([icon, label]) => makeRecapTile(root, icon, label));
    },
    update(t, c, s) {
      // one tile per feature, 1 s apart; each lights up as it lands
      s.recap.forEach((e, i) => {
        const at = c[0] + 0.7 + i;
        const p = P(t, at, 0.45, backOut);
        place(e, recapX(i), recapY(i), p, clamp(p * 2));
        e.style.borderColor = t >= at && t < at + 1.0 ? C.uv : C.line;
      });
    }
  });
}
