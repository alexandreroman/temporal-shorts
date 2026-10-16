// ===================== 6. WHAT YOU GET
// The recap: one tile per thing the Workflow does for you.
// The block keeps every name declared in this file local to this scene.
{
  // The use cases' row of 4 tiles (USE_CASE_ROW), with their type scale
  const BENEFITS = [
    ['hourglass', 'Waits for days'], ['retry', 'Survives restarts'],
    ['check', 'Saved steps kept'], ['bell', 'Sends reminders'],
  ];

  scene({
    chapter: 6, title: 'What you get',
    subs: [
      {
        text: "The Workflow waits for days with no code running, survives restarts and deploys, "
          + "and never redoes a saved step.",
        // the last tile lands at c[0] + 4.45: the full row reads to the end of the subtitle and this pause, about
        // 3 s before the fade
        after: 0.6,
      },
    ],
    build(root, s) {
      s.benefits = makeRecapRow(root, BENEFITS, USE_CASE_ROW.h);
    },
    update(t, c, s) {
      // one benefit tile at a time, each lighting up as it lands
      const at = BENEFITS.map((_, i) => c[0] + 0.7 + i * 1.1);
      placeRecapRow(s.benefits, t, at, USE_CASE_ROW.y, 1.0);
    }
  });
}
