// ===================== 6. WHAT YOU GET
// The recap: one tile per thing the Workflow does for you.
// The block keeps every name declared in this file local to this scene.
{
  // The use cases' row of 4 tiles (USE_CASE_ROW), with their type scale
  const BENEFITS = [
    ['hourglass', 'Waits for days'], ['retry', 'Survives restarts'],
    ['check', 'No step redone'], ['bell', 'Sends reminders'],
  ];

  scene({
    chapter: 6, title: 'What you get',
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
      const { w, h } = USE_CASE_ROW;
      s.benefits = BENEFITS.map(([icon, label]) => iconTile(root, icon, label, w, h, C.ink, USE_CASE_TYPE));
    },
    update(t, c, s) {
      // one benefit tile at a time, each lighting up as it lands
      s.benefits.forEach((e, i) => {
        const at = c[0] + 0.7 + i * 1.1;
        const p = P(t, at, 0.45, backOut);
        place(e, 960 + (i - 1.5) * USE_CASE_ROW.pitch, USE_CASE_ROW.y, p, clamp(p * 2));
        e.style.borderColor = t >= at && t < at + 1.0 ? C.uv : C.line;
      });
    }
  });
}
