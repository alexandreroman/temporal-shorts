// ===================== 6. WHAT YOU GET
// The recap: one tile per thing the Workflow does for you.
// The block keeps every name declared in this file local to this scene.
{
  // The row of tiles spans the content frame, 40 px apart, on the line y=522
  const BENEFITS = [
    ['hourglass', 'Waits for days'], ['retry', 'Survives restarts'],
    ['check', 'No step redone'], ['bell', 'Sends reminders'],
  ];
  const TILE = { w: (FRAME.x1 - FRAME.x0 - 3 * FRAME.gap) / 4, h: 300, y: 522 };
  const tileX = i => FRAME.x0 + TILE.w / 2 + i * (TILE.w + FRAME.gap);

  scene({
    chapter: 6, title: 'What you get',
    // laid out centered at (960, 522) on the content frame
    subs: [
      {
        text: "The Workflow waits for days with no code running, survives restarts and deploys, "
          + "and never redoes a step.",
        // the last tile lands at c[0] + 4.45: the full row reads to the end of the subtitle and this pause, about
        // 3 s before the fade
        after: 0.6,
      },
    ],
    build(root, s) {
      s.benefits = BENEFITS.map(([icon, label]) => iconTile(root, icon, label, TILE.w, TILE.h, C.ink,
        { size: 64, stroke: 1.6, font: 22, gap: 22 }));
    },
    update(t, c, s) {
      // one benefit tile at a time, each lighting up as it lands
      s.benefits.forEach((e, i) => {
        const at = c[0] + 0.7 + i * 1.1;
        const p = P(t, at, 0.45, backOut);
        place(e, tileX(i), TILE.y, p, clamp(p * 2));
        e.style.borderColor = t >= at && t < at + 1.0 ? C.uv : C.line;
      });
    }
  });
}
