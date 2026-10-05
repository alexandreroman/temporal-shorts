// ===================== 3. THE USUAL FIX: PLUMBING
// The code card in the middle gets boxed in by plumbing tiles, wired to it; then a LINES OF CODE bar shows the
// plumbing outgrowing the business logic, and bugs pop on the plumbing.
// The block keeps every name declared in this file local to this scene.
{
  // Middle column: BUSINESS LOGIC label, code card, LINES OF CODE bar; one column of 3 tiles on each side,
  // as tall as the middle column (420 px), centered on Y0.
  const Y0 = 540;
  const CARD = { x: 960, y: Y0 - 50 };
  const TILE = { w: 250, h: 120, leftX: 405, rightX: 1515, pitch: 150 };
  // the tiles in popping order, alternating sides; wireY: where the wire meets the card edge
  const PLUMBING = [
    { icon: 'retry', label: 'Retry loops', side: -1, row: 0 },
    { icon: 'table', label: 'Status table', side: 1, row: 0 },
    { icon: 'queue', label: 'Message queue', side: -1, row: 1 },
    { icon: 'clock', label: 'Timers', side: 1, row: 1 },
    { icon: 'trash', label: 'Cleanup jobs', side: -1, row: 2 },
    { icon: 'key', label: 'Idempotency keys', side: 1, row: 2 },
  ];
  const tileX = p => (p.side < 0 ? TILE.leftX : TILE.rightX);
  const tileY = p => Y0 + (p.row - 1) * TILE.pitch;
  const wireY = p => CARD.y + (p.row - 1) * 80;
  // LINES OF CODE bar: business logic stays thin, plumbing grows to fill the rest (whole pixels at rest)
  const BAR = { w: 640, h: 40, biz: 96, gap: 4 };
  const plumbingWidth = BAR.w - BAR.biz - BAR.gap;
  // tiles that get a bug, in popping order
  const BUGGY = [0, 3, 4, 1];

  scene({
    chapter: 3, title: 'The usual fix: plumbing',
    // laid out around (960, 540), lifted to the center of the free band (960, 522)
    shift: [0, -18],
    subs: [
      {
        text: "So developers add plumbing around the code: retries, status tables, queues, timers, cleanup jobs.",
        after: 0.6,
      },
      {
        text: "Soon the plumbing outweighs the business logic, and every corner case is a new bug to chase.",
        after: 0.8,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.card = makeCodeCard(root);
      s.cardL = E(root, 'Business logic', 'lbl', { fontSize: '18px' });
      // wires run from the tile's inner edge to the card edge, with horizontal tangents at both ends
      s.wires = PLUMBING.map(p => {
        const x0 = tileX(p) - p.side * (TILE.w / 2 + 4), x1 = CARD.x + p.side * (s.card.w / 2 + 4);
        const mx = (x0 + x1) / 2;
        return path(s.svg, `M ${x0} ${tileY(p)} C ${mx} ${tileY(p)} ${mx} ${wireY(p)} ${x1} ${wireY(p)}`,
          C.slate, 2, false);
      });
      s.tiles = PLUMBING.map(p => iconTile(root, p.icon, p.label, TILE.w, TILE.h));
      s.bugs = BUGGY.map(() => E(root, ICON('bug', 28, C.red, 1.8), '', {
        width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#141414', border: '1.5px solid ' + C.red, borderRadius: '50%',
      }));
      s.bar = E(root,
        '<div class="lbl" style="font-size:16px;text-align:center">Lines of code</div>'
        + `<div style="position:relative;height:${BAR.h}px;margin-top:10px;background:rgba(248,250,252,.06);`
        + 'border-radius:var(--rs);overflow:hidden">'
        + `<div class="biz" style="position:absolute;left:0;top:0;bottom:0;background:${C.neon}"></div>`
        + `<div class="plumb" style="position:absolute;left:${BAR.biz + BAR.gap}px;top:0;bottom:0;`
        + `background:${C.red}"></div></div>`
        + '<div style="display:flex;justify-content:space-between;margin-top:10px">'
        + '<span class="lbl bizL" style="font-size:15px;color:var(--neon)">Business logic</span>'
        + '<span class="lbl plumbL" style="font-size:15px;color:var(--red)">Plumbing</span></div>',
        '', { width: BAR.w + 'px' });
      s.biz = s.bar.querySelector('.biz'); s.plumb = s.bar.querySelector('.plumb');
      s.bizL = s.bar.querySelector('.bizL'); s.plumbL = s.bar.querySelector('.plumbL');
    },
    update(t, c, s) {
      const cp = P(t, c[0] + 0.1, 0.6, backOut);
      place(s.card, CARD.x, CARD.y, cp, clamp(cp * 2));
      place(s.cardL, CARD.x, CARD.y - s.card.h / 2 - 26, 1, P(t, c[0] + 0.5, 0.4));

      // plumbing tiles pop in as the subtitle names them, each wired to the card
      const bugAt = BUGGY.map((_, k) => c[1] + 3.6 + k * 0.35);
      PLUMBING.forEach((p, i) => {
        const at = c[0] + 1.4 + i * 0.7;
        const tp = P(t, at, 0.45, backOut);
        const k = BUGGY.indexOf(i);
        const buggy = k >= 0 && t >= bugAt[k];
        place(s.tiles[i], tileX(p), tileY(p), tp, clamp(tp * 2));
        s.tiles[i].style.borderColor = buggy ? C.red : C.line;
        s.wires[i].setAttribute('stroke', buggy ? C.red : C.slate);
        draw(s.wires[i], P(t, at + 0.2, 0.4), 0.6);
      });

      // LINES OF CODE bar under the card: the business logic stays thin, the plumbing grows
      const barTop = CARD.y + s.card.h / 2 + 36;
      place(s.bar, CARD.x, barTop + 49, 1, P(t, c[1] + 0.2, 0.4));
      s.biz.style.width = Math.round(BAR.biz * P(t, c[1] + 0.5, 0.5)) + 'px';
      s.bizL.style.opacity = P(t, c[1] + 0.7, 0.4);
      const grow = P(t, c[1] + 1.2, 2.2);
      s.plumb.style.width = (grow < 1 ? plumbingWidth * grow : plumbingWidth) + 'px';
      s.plumbL.style.opacity = P(t, c[1] + 1.4, 0.4);

      // bugs pop on the corner of several plumbing tiles
      s.bugs.forEach((e, k) => {
        const p = PLUMBING[BUGGY[k]];
        const bp = P(t, bugAt[k], 0.4, backOut);
        place(e, tileX(p) + TILE.w / 2 - 6, tileY(p) - TILE.h / 2 + 6, bp, clamp(bp * 2));
      });
    }
  });
}
