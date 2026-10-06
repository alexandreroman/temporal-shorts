// ===================== 8. WHAT YOU GET
// The payoff: the budget saved in this example, then the other benefits, one tile at a time.
// The block keeps every name declared in this file local to this scene.
{
  const BENEFITS = [
    ['book', 'Saved steps reused'], ['retry', 'Automatic retries'],
    ['user', 'Waits for humans'], ['eye', 'Full visibility'],
  ];
  scene({
    chapter: 8, title: 'What you get',
    // the budget line over a row of 4 tiles (x 270-1650, y 305-740 once shifted), centered on (960, 522)
    shift: [0, -5],
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
        `<div style="display:flex;align-items:center;gap:22px">${ICON('coin', 64, C.neon, 1.6)}<div>`
        + '<div style="font-size:52px;line-height:1.1">43% less LLM spend '
        + '<span class="lbl" style="font-size:18px">in this example</span></div>'
        + '<div class="mono" style="font-size:26px;letter-spacing:.06em;color:var(--slate);margin-top:8px">'
        + '<span style="color:var(--neon)">4</span> vs 7 LLM calls</div></div></div>');
      // the first tile, the benefit this video demonstrates, is highlighted
      s.ben = BENEFITS.map(([icon, label], i) => iconTile(root, icon, label, 330, 230, i === 0 ? C.neon : C.ink));
      s.ben[0].style.borderColor = C.neon;
    },
    update(t, c, s) {
      // the budget line first, then one tile per benefit
      rise(s.budget, 960, 360, P(t, c[0] + 0.5, 0.6), 20);
      const at = [c[0] + 2.2, c[0] + 3.4, c[0] + 4.3, c[0] + 5.2];
      s.ben.forEach((e, i) => {
        const p = P(t, at[i], 0.45, backOut);
        place(e, 435 + i * 350, 630, p, clamp(p * 2));
      });
    }
  });
}
