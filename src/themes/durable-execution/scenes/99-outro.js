// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  // the 4 order steps, all done: small tiles joined by links, each with a neon check badge
  const ROW = { x0: 705, gap: 170, y: 277, size: 110 };
  const makeDoneTile = (p, icon) => {
    const e = iconTile(p, icon, null, ROW.size, ROW.size);
    e.insertAdjacentHTML('beforeend',
      '<div class="ok" style="position:absolute;right:-16px;top:-16px;width:38px;height:38px;display:flex;'
      + `align-items:center;justify-content:center;background:${C.bg};border:1.5px solid ${C.neon};`
      + `border-radius:var(--rs)">${ICON('check', 24, C.neon, 2.6)}</div>`);
    e.ok = e.querySelector('.ok');
    return e;
  };
  scene({
    pre: 0.4, post: 2.6,
    shift: [0, 60],
    subs: [
      { text: "Durable Execution: your code runs to completion, whatever fails along the way." },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.links = stepLinks(s.svg, ORDER_STEPS.map((_, i) => ROW.x0 + i * ROW.gap), ROW.y, ROW.size);
      s.tiles = ORDER_STEPS.map(step => makeDoneTile(root, step.icon));
      s.t = makeEndCard(root, 'Durable Execution', 'YOUR CODE RUNS TO COMPLETION');
    },
    update(t, c, s) {
      // the tiles' bottom edge sits as far above the title's letters as the tagline sits above the logo
      place(s.t, 960, 560, 1, P(t, 0.3, 0.8));
      // tiles pop in one after the other, then each step gets its check
      s.tiles.forEach((e, i) => {
        const p = backPop(t, 0.1 + i * 0.12);
        place(e, ROW.x0 + i * ROW.gap, ROW.y, p.s, p.o);
        const okAt = 0.8 + i * 0.25, ok = popIn(t, okAt);
        e.ok.style.opacity = ok.o;
        e.ok.style.transform = `scale(${ok.s})`;
        e.style.borderColor = t >= okAt ? C.neon : C.line;
      });
      s.links.forEach((l, i) => draw(l, P(t, 0.5 + i * 0.12, 0.35)));
    }
  });
}
