// ===================== 3. THE USUAL FIX: PLUMBING
// The code card in the middle gets boxed in by plumbing tiles, wired to it; then a LINES OF CODE bar shows the
// plumbing outgrowing the business logic, and bugs pop on the plumbing.
// The block keeps every name declared in this file local to this scene.
{
  // One column of 3 tiles on each side, symmetric about the card (x 175-465 and 1455-1745, 175 px from the card);
  // the card is centered on the middle row (Y0), with the BUSINESS LOGIC label above it and the LINES OF CODE bar
  // below it, as wide as the card, its bottom edge level with the bottom tiles
  const Y0 = 522;
  const CARD = { x: 960, y: Y0 };
  const TILE = { w: 290, h: 150, leftX: 320, rightX: 1600, pitch: 235 };
  // the tiles in popping order, alternating sides; at: when the tile pops in (s after c[0]), on its word in the
  // subtitle; the last one, never named, closes the list right after "cleanup jobs"
  const PLUMBING = [
    { icon: 'retry', label: 'Retry loops', side: -1, row: 0, at: 2.75 },
    { icon: 'table', label: 'Status table', side: 1, row: 0, at: 3.3 },
    { icon: 'queue', label: 'Message queue', side: -1, row: 1, at: 4.25 },
    { icon: 'clock', label: 'Timers', side: 1, row: 1, at: 4.75 },
    { icon: 'trash', label: 'Cleanup jobs', side: -1, row: 2, at: 5.25 },
    { icon: 'code', label: 'Recovery scripts', side: 1, row: 2, at: 5.8 },
  ];
  const tileX = p => (p.side < 0 ? TILE.leftX : TILE.rightX);
  const tileY = p => Y0 + (p.row - 1) * TILE.pitch;
  const wireY = p => CARD.y + (p.row - 1) * 80; // where the wire meets the card edge
  // LINES OF CODE bar: business logic stays thin, plumbing grows to fill the rest (whole pixels at rest)
  const BAR = { w: 640, h: 44, biz: 96, gap: 4 };
  const plumbingWidth = BAR.w - BAR.biz - BAR.gap;
  const BAR_HALF_H = 56.5; // half the measured height (113 px) of the bar block: its edges land on whole pixels
  // tiles that get a bug, in popping order
  const BUGGY = [0, 3, 4, 1];

  scene({
    chapter: 3, title: 'The usual fix: plumbing',
    // laid out around the center of the free band (960, 522)
    shift: [0, 0],
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
      s.cardL = E(root, 'Business logic', 'lbl', { fontSize: '20px' });
      // wires run from the tile's inner edge to the card edge, with horizontal tangents at both ends
      s.wires = PLUMBING.map(p => {
        const x0 = tileX(p) - p.side * (TILE.w / 2 + 4), x1 = CARD.x + p.side * (s.card.w / 2 + 4);
        const mx = (x0 + x1) / 2;
        return path(s.svg, `M ${x0} ${tileY(p)} C ${mx} ${tileY(p)} ${mx} ${wireY(p)} ${x1} ${wireY(p)}`,
          C.slate, 2, false);
      });
      s.tiles = PLUMBING.map(p => iconTile(root, p.icon, p.label, TILE.w, TILE.h));
      s.bugs = BUGGY.map(() => E(root, ICON('bug', 30, C.red, 1.8), '', {
        width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#141414', border: '1.5px solid ' + C.red, borderRadius: '50%',
      }));
      s.bar = E(root,
        '<div class="lbl" style="font-size:18px;text-align:center">Lines of code</div>'
        + `<div style="position:relative;height:${BAR.h}px;margin-top:12px;background:rgba(248,250,252,.06);`
        + 'border-radius:var(--rs);overflow:hidden">'
        + `<div class="biz" style="position:absolute;left:0;top:0;bottom:0;background:${C.neon}"></div>`
        + `<div class="plumb" style="position:absolute;left:${BAR.biz + BAR.gap}px;top:0;bottom:0;`
        + `background:${C.red}"></div></div>`
        + '<div style="display:flex;justify-content:space-between;margin-top:12px">'
        + '<span class="lbl bizL" style="font-size:17px;color:var(--neon)">Business logic</span>'
        + '<span class="lbl plumbL" style="font-size:17px;color:var(--red)">Plumbing</span></div>',
        '', { width: BAR.w + 'px' });
      s.biz = s.bar.querySelector('.biz'); s.plumb = s.bar.querySelector('.plumb');
      s.bizL = s.bar.querySelector('.bizL'); s.plumbL = s.bar.querySelector('.plumbL');
    },
    update(t, c, s) {
      const cp = P(t, c[0] + 0.1, 0.6, backOut);
      place(s.card, CARD.x, CARD.y, cp, clamp(cp * 2));
      place(s.cardL, CARD.x, CARD.y - s.card.h / 2 - 38, 1, P(t, c[0] + 0.5, 0.4));

      // plumbing tiles pop in on their words, each wired to the card
      const bugAt = BUGGY.map((_, k) => c[1] + 3.6 + k * 0.35);
      PLUMBING.forEach((p, i) => {
        const at = c[0] + p.at;
        const tp = P(t, at, 0.45, backOut);
        const k = BUGGY.indexOf(i);
        const buggy = k >= 0 && t >= bugAt[k];
        place(s.tiles[i], tileX(p), tileY(p), tp, clamp(tp * 2));
        s.tiles[i].style.borderColor = buggy ? C.red : C.line;
        s.wires[i].setAttribute('stroke', buggy ? C.red : C.slate);
        draw(s.wires[i], P(t, at + 0.2, 0.4), 0.6);
      });

      // LINES OF CODE bar under the card: the business logic stays thin, the plumbing grows
      const barBottom = Y0 + TILE.pitch + TILE.h / 2; // level with the bottom of the bottom tiles
      place(s.bar, CARD.x, barBottom - BAR_HALF_H, 1, P(t, c[1] + 0.2, 0.4));
      s.biz.style.width = Math.round(BAR.biz * P(t, c[1] + 0.5, 0.5)) + 'px';
      s.bizL.style.opacity = P(t, c[1] + 0.7, 0.4);
      const grow = P(t, c[1] + 1.2, 2.2);
      s.plumb.style.width = Math.round(plumbingWidth * grow) + 'px';
      s.plumbL.style.opacity = P(t, c[1] + 1.4, 0.4);

      // bugs pop on the corner of several plumbing tiles
      s.bugs.forEach((e, k) => {
        const p = PLUMBING[BUGGY[k]];
        const bp = popIn(t, bugAt[k]);
        place(e, tileX(p) + TILE.w / 2 - 6, tileY(p) - TILE.h / 2 + 6, bp.s, bp.o);
      });
    }
  });
}
