// ===================== 9. WHAT YOU GET
// "You write the business logic", the Temporal logo line, then the four things Temporal handles, one tile at a time.
// The block keeps every name declared in this file local to this scene.
{
  // The headline, the Temporal logo line, then a row of benefit tiles, all centered on x=960; the tile row
  // (x 180..1740) sets the width of the composition
  const HEADLINE_Y = 274, HANDLES_Y = 406;
  const BEN = { y: 672, w: 360, h: 260, pitch: 400 };
  // logo height on the "handles the rest" line: the label's size and top margin are measured to match its wordmark
  const HANDLES_LOGO_H = 72;
  const BENEFITS = [
    ['retry', 'Automatic retries'], ['shieldTall', 'Survives crashes'],
    ['clock', 'Waits for days'], ['eye', 'Full visibility'],
  ];
  scene({
    chapter: 9, title: 'What you get',
    // laid out in the content frame (y 150-880) around (960, 522): within the centering tolerance of its middle,
    // y 515
    subs: [
      {
        text: "You write the business logic. Temporal handles retries, state and recovery, with full visibility.",
        after: 0.8,
      },
    ],
    build(root, s) {
      s.headline = E(root,
        `<div style="display:flex;align-items:center;gap:24px">${ICON('code', 66, C.uv, 1.8)}`
        + '<div style="font-size:62px;line-height:1.1;white-space:nowrap">You write the business logic</div></div>');
      // the label stays lighter than the logo: slate caps as tall as the wordmark's x-height, on its baseline
      // (both measured on rendered frames)
      s.handles = E(root,
        '<div style="display:flex;align-items:flex-start;gap:22px">'
        + `<img src="${LOGO}" style="height:${HANDLES_LOGO_H}px;display:block">`
        + '<span class="lbl" style="font-size:28px;line-height:28px;margin-top:27px">handles the rest</span>'
        + '</div>');
      s.ben = BENEFITS.map(([icon, label]) => iconTile(root, icon, label, BEN.w, BEN.h));
    },
    update(t, c, s) {
      // you write the logic, Temporal handles the rest
      const hp = P(t, c[0] + 0.4, 0.6);
      rise(s.headline, 960, HEADLINE_Y, hp, 20);
      place(s.handles, 960, HANDLES_Y, 1, P(t, c[0] + 1.9, 0.5));
      // the tiles pop in one by one while the subtitle lists what Temporal handles: the first on "retries",
      // the last on "visibility"
      const at = [c[0] + 3.0, c[0] + 3.8, c[0] + 4.5, c[0] + 5.4];
      s.ben.forEach((e, i) => {
        const p = P(t, at[i], 0.45, backOut);
        place(e, 960 + (i - 1.5) * BEN.pitch, BEN.y, p, clamp(p * 2));
      });
    }
  });
}
