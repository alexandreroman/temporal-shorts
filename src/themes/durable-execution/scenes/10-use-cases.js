// ===================== 10. WHAT YOU CAN BUILD
// What Workflows are used for: one tile per use case, each with an example, lit as the subtitle names it.
// The block keeps every name declared in this file local to this scene.
{
  // A row of 4 tiles as wide and as far apart as the recap's (x 180..1740), centered on (960, 522)
  const USES = [
    ['coin', 'Money transfers', 'debit, credit, never twice'],
    ['cal', 'Subscriptions', 'bill every month, for years'],
    ['table', 'Data pipelines', 'a nightly batch resumes'],
    ['cloud', 'Cloud provisioning', 'a cluster comes up in steps'],
  ];
  const TILE = { y: 522, w: 360, h: 280, pitch: 400 };
  // Seconds after c[1] when subtitle 2 names each tile; a tile stays lit until the next one is named
  const NAMED_AT = [0.3, 1.35, 2.3, 3.3];
  const LAST_LIT = 1.2;

  scene({
    chapter: 10, title: 'What you can build',
    subs: [
      {
        text: "Order #1042 is one example: any process that must run to the end fits a Workflow.",
        // the last tile lands at c[0] + 4.45, within the subtitle
      },
      {
        text: "Money transfers, subscriptions, data pipelines, cloud provisioning: "
          + "a crash never leaves any of them half done.",
        // the last tile is lit until c[1] + 4.5; the full row then holds through the end of the subtitle and
        // this pause until the fade
        after: 0.6,
      },
    ],
    build(root, s) {
      s.uses = USES.map(([icon, label, example]) => useCaseTile(root, icon, label, example, TILE.w, TILE.h));
    },
    update(t, c, s) {
      // one tile at a time while "any process that must run to the end" reads, then each lights up as it is named
      s.uses.forEach((e, i) => {
        const p = P(t, c[0] + 1.6 + i * 0.8, 0.45, backOut);
        place(e, 960 + (i - 1.5) * TILE.pitch, TILE.y, p, clamp(p * 2));
        const litFrom = c[1] + NAMED_AT[i];
        const litUntil = i + 1 < NAMED_AT.length ? c[1] + NAMED_AT[i + 1] : litFrom + LAST_LIT;
        e.style.borderColor = t >= litFrom && t < litUntil ? C.uv : C.line;
      });
    }
  });
}
