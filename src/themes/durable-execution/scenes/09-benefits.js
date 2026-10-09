// ===================== 9. WHAT YOU GET
// "You write the business logic", the Temporal logo line, then the four things Temporal handles, one tile at a time.
// The block keeps every name declared in this file local to this scene.
{
  // The headline, the Temporal logo line, then a row of benefit tiles, all centered on x=960; the tile row, the use
  // cases' row (USE_CASE_ROW) lower and shorter, with their type scale, sets the width of the composition
  // (x 120..1800)
  const HEADLINE_Y = 274, HANDLES_Y = 406;
  const BEN = { ...USE_CASE_ROW, y: 672, h: 260 };
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
        text: "You write the business logic. Temporal handles retries, crashes and waits, with full visibility.",
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
      s.ben = BENEFITS.map(([icon, label]) => iconTile(root, icon, label, BEN.w, BEN.h, C.ink, USE_CASE_TYPE));
    },
    update(t, c, s) {
      // you write the logic, Temporal handles the rest
      const hp = P(t, c[0] + 0.4, 0.6);
      rise(s.headline, 960, HEADLINE_Y, hp, 20);
      place(s.handles, 960, HANDLES_Y, 1, P(t, c[0] + 1.9, 0.5));
      // the tiles pop in one by one as the subtitle names what Temporal handles: "retries", "crashes", "waits",
      // "visibility" (word position at 16 characters per second, plus 0.3 s)
      const at = [c[0] + 3.25, c[0] + 3.8, c[0] + 4.55, c[0] + 5.6];
      s.ben.forEach((e, i) => {
        const p = backPop(t, at[i]);
        place(e, useCaseX(i, BEN.pitch), BEN.y, p.s, p.o);
      });
    }
  });
}
