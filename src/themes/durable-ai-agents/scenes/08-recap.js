// ===================== 8. WHAT YOU GET
// The payoff: the LLM calls saved in this example, then the other benefits, one tile at a time.
// The block keeps every name declared in this file local to this scene.
{
  const BENEFITS = [
    ['book', 'Saved steps reused'], ['retry', 'Automatic retries'],
    ['user', 'Waits for humans'], ['eye', 'Full visibility'],
  ];
  // The budget line over the use cases' row of 4 tiles (USE_CASE_ROW), lower and shorter, with their type scale;
  // the whole composition (y 268-762) is centered on y 515
  const BUDGET_Y = 326;
  const BEN = { ...USE_CASE_ROW, y: 617, h: 290 };
  scene({
    chapter: 8, title: 'What you get',
    subs: [
      {
        text: "No saved LLM call is paid for twice, and no saved step runs again. "
          + "Plus retries, human waits and full visibility.",
        // the last tile lands at c[0] + 5.65; the full composition then holds over 2 s before the fade
        after: 0.7,
      },
    ],
    build(root, s) {
      s.budget = E(root,
        `<div style="display:flex;align-items:center;gap:26px">${ICON('coin', 76, C.neon, 1.6)}<div>`
        + '<div style="font-size:60px;line-height:1.1">43% fewer LLM calls '
        + '<span class="lbl" style="font-size:20px">in this example</span></div>'
        + '<div class="mono" style="font-size:30px;letter-spacing:.06em;color:var(--slate);margin-top:10px">'
        + '<span style="color:var(--neon)">4</span> vs 7 LLM calls</div></div></div>');
      // the first tile, the benefit this video demonstrates, is highlighted
      s.ben = BENEFITS.map(([icon, label], i) => iconTile(root, icon, label, BEN.w, BEN.h,
        i === 0 ? C.neon : C.ink, USE_CASE_TYPE));
      s.ben[0].style.borderColor = C.neon;
    },
    update(t, c, s) {
      // the budget line first, then one tile per benefit
      rise(s.budget, 960, BUDGET_Y, P(t, c[0] + 0.5, 0.6), 20);
      const at = [c[0] + 2.2, c[0] + 3.4, c[0] + 4.3, c[0] + 5.2];
      s.ben.forEach((e, i) => {
        const p = backPop(t, at[i]);
        place(e, useCaseX(i), BEN.y, p.s, p.o);
      });
    }
  });
}
