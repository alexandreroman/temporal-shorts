// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  // the 4 order steps, all done: small tiles joined by links, each with a neon check badge
  const ROW = { x0: 705, gap: 170, y: 250, size: 110 };
  const makeDoneTile = (p, icon) => {
    const e = iconTile(p, icon, null, ROW.size, ROW.size);
    e.insertAdjacentHTML('beforeend',
      '<div class="ok" style="position:absolute;right:-16px;top:-16px;width:38px;height:38px;display:flex;'
      + `align-items:center;justify-content:center;background:#141414;border:1.5px solid ${C.neon};`
      + `border-radius:var(--rs)">${ICON('check', 24, C.neon, 2.6)}</div>`);
    e.ok = e.querySelector('.ok');
    return e;
  };
  scene({
    pre: 0.4, post: 2.6,
    shift: [0, 35],
    subs: [
      { text: "Durable Execution: your code runs to completion, whatever fails along the way." },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.links = stepLinks(s.svg, ORDER_STEPS.map((_, i) => ROW.x0 + i * ROW.gap), ROW.y, ROW.size);
      s.tiles = ORDER_STEPS.map(step => makeDoneTile(root, step.icon));
      s.t = E(root,
        '<div style="font-size:124px;letter-spacing:-3.5px;line-height:128px">Durable Execution</div>'
        + '<div class="mono" style="font-size:28px;line-height:36px;letter-spacing:.14em;padding-left:.14em;'
        + 'color:var(--violet);margin-top:34px">YOUR CODE RUNS TO COMPLETION</div>'
        // 82 px high, the logo is exactly 314 px wide: centered in the 1040 px block, it rests on whole pixels
        + `<img src="${LOGO}" style="height:82px;display:block;margin:109px auto 0">`,
        '', { width: '1040px', textAlign: 'center' });
    },
    update(t, c, s) {
      placeOnWholePixels(s.t, 960, 600, P(t, 0.3, 0.8));
      // tiles pop in one after the other, then each step gets its check
      s.tiles.forEach((e, i) => {
        const p = P(t, 0.1 + i * 0.12, 0.45, backOut);
        place(e, ROW.x0 + i * ROW.gap, ROW.y, p, clamp(p * 2));
        const okAt = 0.8 + i * 0.25, ok = popIn(t, okAt);
        e.ok.style.opacity = ok.o;
        e.ok.style.transform = `scale(${ok.s})`;
        e.style.borderColor = t >= okAt ? C.neon : C.line;
      });
      s.links.forEach((l, i) => draw(l, P(t, 0.5 + i * 0.12, 0.35)));
    }
  });
}
