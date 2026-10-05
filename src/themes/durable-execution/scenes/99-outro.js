// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  // the 4 order steps, all done: small tiles joined by links, each with a neon check badge
  const ROW = { x0: 765, gap: 130, y: 324, size: 90 };
  const makeDoneTile = (p, icon) => {
    const e = iconTile(p, icon, null, ROW.size, ROW.size);
    e.insertAdjacentHTML('beforeend',
      '<div class="ok" style="position:absolute;right:-14px;top:-14px;width:32px;height:32px;display:flex;'
      + `align-items:center;justify-content:center;background:#141414;border:1.5px solid ${C.neon};`
      + `border-radius:var(--rs)">${ICON('check', 20, C.neon, 2.6)}</div>`);
    e.ok = e.querySelector('.ok');
    return e;
  };
  scene({
    pre: 0.4, post: 2.6,
    shift: [0, 10],
    subs: [
      { text: "Durable Execution: your code runs to completion, whatever fails along the way." },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      const xs = ORDER_STEPS.map((_, i) => ROW.x0 + i * ROW.gap);
      s.links = [0, 1, 2].map(i => path(s.svg,
        `M ${xs[i] + ROW.size / 2 + 2} ${ROW.y} L ${xs[i + 1] - ROW.size / 2 - 2} ${ROW.y}`, C.line, 2, false));
      s.tiles = ORDER_STEPS.map(step => makeDoneTile(root, step.icon));
      s.t = E(root,
        '<div style="font-size:104px;letter-spacing:-3px;line-height:1.04">Durable Execution</div>'
        + '<div class="mono" style="font-size:24px;letter-spacing:.14em;color:var(--violet);margin-top:30px">'
        + 'YOUR CODE RUNS TO COMPLETION</div>'
        + `<img src="${LOGO}" style="height:70px;display:block;margin:76px auto 0">`,
        '', { textAlign: 'center' });
    },
    update(t, c, s) {
      place(s.t, 960, 600, 1, P(t, 0.3, 0.8));
      // tiles pop in one after the other, then each step gets its check
      s.tiles.forEach((e, i) => {
        const p = P(t, 0.1 + i * 0.12, 0.45, backOut);
        place(e, ROW.x0 + i * ROW.gap, ROW.y, p, clamp(p * 2));
        const ok = P(t, 0.8 + i * 0.25, 0.35, backOut);
        e.ok.style.opacity = clamp(ok * 2);
        e.ok.style.transform = `scale(${ok})`;
        e.style.borderColor = ok >= 0.5 ? C.neon : C.line;
      });
      s.links.forEach((l, i) => draw(l, P(t, 0.5 + i * 0.12, 0.35)));
    }
  });
}
