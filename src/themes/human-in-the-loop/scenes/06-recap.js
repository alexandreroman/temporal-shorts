// ===================== 6. WHAT YOU GET
// The recap: one tile per thing the Workflow does for you, then the use cases the same pattern fits.
// The block keeps every name declared in this file local to this scene.
{
  // Both rows of tiles span the content frame, 40 px apart, on the line y=522: the benefits leave the slots that
  // the use cases then take
  const BENEFITS = [
    ['hourglass', 'Waits for days'], ['retry', 'Survives restarts'],
    ['check', 'No step redone'], ['bell', 'Sends reminders'],
  ];
  const USES = [['check', 'Approvals'], ['eye', 'Reviews'], ['pen', 'Signatures'], ['bot', 'AI agent checks']];
  const TILE = { w: (FRAME.x1 - FRAME.x0 - 3 * FRAME.gap) / 4, h: 300, y: 522 };
  const tileX = i => FRAME.x0 + TILE.w / 2 + i * (TILE.w + FRAME.gap);
  const makeTile = (p, icon, label) => iconTile(p, icon, label, TILE.w, TILE.h, C.ink,
    { size: 64, stroke: 1.6, font: 22, gap: 22 });

  scene({
    chapter: 6, title: 'What you get',
    // laid out centered at (960, 522) on the content frame, in both phases
    subs: [
      {
        text: "The Workflow waits for days with no code running, survives restarts and deploys, "
          + "and never redoes a step.",
        // the last tile lands at c[0] + 4.45: the full row reads to the end of the subtitle and this pause
        after: 0.6,
      },
      {
        text: "Approvals, reviews, signatures, an AI agent asking before it acts: the same pattern fits them all.",
        // the last tile lands at c[1] + 2.95; the full row holds through this pause until the fade
        after: 1.8,
      },
    ],
    build(root, s) {
      s.benefits = BENEFITS.map(([icon, label]) => makeTile(root, icon, label));
      s.uses = USES.map(([icon, label]) => makeTile(root, icon, label));
    },
    update(t, c, s) {
      // one benefit tile at a time, each lighting up as it lands; they all fade out before the first use case lands
      const out = P(t, c[1], 0.4);
      s.benefits.forEach((e, i) => {
        const at = c[0] + 0.7 + i * 1.1;
        const p = P(t, at, 0.45, backOut);
        place(e, tileX(i), TILE.y, p, clamp(p * 2) * (1 - out));
        e.style.borderColor = t >= at && t < at + 1.0 ? C.uv : C.line;
      });

      // the same pattern, wherever a person decides
      s.uses.forEach((e, i) => {
        const p = P(t, c[1] + 0.4 + i * 0.7, 0.45, backOut);
        place(e, tileX(i), TILE.y, p, clamp(p * 2));
      });
    }
  });
}
