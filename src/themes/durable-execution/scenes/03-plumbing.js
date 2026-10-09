// ===================== 3. THE USUAL FIX: PLUMBING
// The code card in the middle gets boxed in by plumbing tiles, wired to it; then a LINES OF CODE bar shows the
// plumbing outgrowing the business logic, and a swarm of bugs infests the plumbing: bug badges land on the tiles
// faster and faster, each one shaking its tile.
// The block keeps every name declared in this file local to this scene.
{
  // One column of 3 tiles on each side, symmetric about the card (x 175-465 and 1455-1745, 155 px from the card);
  // the card is centered on the middle row (Y0), with the BUSINESS LOGIC label above it and the LINES OF CODE bar
  // below it, as wide as the card, its bottom edge level with the bottom tiles. Y0 is 7 px under the content frame's
  // middle (y 515), within its centering tolerance
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
  const BAR = { w: CODE.w, h: 44, biz: 96, gap: 4 };
  const plumbingWidth = BAR.w - BAR.biz - BAR.gap;
  const BAR_HALF_H = 56.5; // half the measured height (113 px) of the bar block: its edges land on whole pixels
  // Bug badges in landing order; at: when the badge lands (s after c[1]). The first four land one by one, then the
  // pace quickens until every tile is buggy and four of them carry a second badge, all before the subtitle ends.
  // dx, dy: where the 50 px badge lands, from the tile center in whole px, fully inside the tile (10 px from its
  // border: |dx| <= 110, |dy| <= 40) at irregular, hand-picked spots. The icon spans y -45 to 7 (x -26 to 26) and the
  // label y 19 to 45, up to 113 px either side, so most badges sit in the upper part beside the icon (|dx| >= 61,
  // dy <= -12); only the short TIMERS label leaves room for one in the lower part. A tile with two badges has one
  // on each side. angle: a small tilt of the bug inside its round badge, in degrees, hand-picked within 25 degrees
  // of upright so it still reads as a bug, different for each one; it is fixed, so the badge pops in already tilted.
  const BUGS = [
    { tile: 0, dx: 82, dy: -30, angle: -18, at: 3.6 },
    { tile: 3, dx: -86, dy: 22, angle: 12, at: 3.95 },
    { tile: 4, dx: -74, dy: -34, angle: -8, at: 4.3 },
    { tile: 1, dx: 100, dy: -22, angle: 22, at: 4.65 },
    { tile: 2, dx: -102, dy: -26, angle: -24, at: 4.92 },
    { tile: 5, dx: 70, dy: -32, angle: 6, at: 5.15 },
    { tile: 0, dx: -96, dy: -16, angle: 16, at: 5.34 },
    { tile: 3, dx: 92, dy: -28, angle: -12, at: 5.5 },
    { tile: 4, dx: 104, dy: -14, angle: 25, at: 5.63 },
    { tile: 1, dx: -84, dy: -36, angle: -4, at: 5.74 },
  ];

  // Short decaying shake of an element hit at `at`, as [dx, dy] in px: five half swings of amp px across, four of
  // 0.4 amp up and down, within 0.35 s
  const jolt = (t, at, amp) => [dampedShake(t, at, amp, 0.35, 5), dampedShake(t, at, amp * 0.4, 0.35, 4)];
  // Sum of the jolts of every hit in `hits`
  function jolts(t, hits, amp) {
    let dx = 0, dy = 0;
    for (const at of hits) {
      const [x, y] = jolt(t, at, amp);
      dx += x; dy += y;
    }
    return [dx, dy];
  }
  // Red flicker after each of `hits`: on and off every 0.06 s for 0.36 s, fading, as an intensity from 0 to 1
  function flicker(t, hits) {
    let k = 0;
    for (const at of hits) {
      const u = t - at;
      if (u >= 0 && u < 0.36 && Math.floor(u / 0.06) % 2 === 0) k = Math.max(k, 1 - u / 0.36);
    }
    return k;
  }
  // Red glow around a tile at flicker intensity k; '' leaves the tile's own style
  const redGlow = k => (k > 0
    ? `0 0 0 2px rgba(${RGB.red},${k.toFixed(3)}), 0 0 30px rgba(${RGB.red},${(0.7 * k).toFixed(3)})`
    : '');

  scene({
    chapter: 3, title: 'The usual fix: plumbing',
    // laid out in the content frame (y 150-880) around (960, Y0)
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
      s.bugs = BUGS.map(b => {
        const badge = E(root, ICON('bug', 30, C.red, 1.8), '', {
          width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: C.bg, border: '1.5px solid ' + C.red, borderRadius: '50%',
        });
        // only the bug turns, not the round badge around it
        badge.querySelector('svg').style.transform = `rotate(${b.angle}deg)`;
        return badge;
      });
      s.bar = E(root,
        '<div class="lbl" style="font-size:18px;text-align:center">Lines of code</div>'
        + `<div style="position:relative;height:${BAR.h}px;margin-top:12px;background:rgba(${RGB.ink},.06);`
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
      const cp = backPop(t, c[0] + 0.1, 0.6);
      place(s.card, CARD.x, CARD.y, cp.s, cp.o);
      place(s.cardL, CARD.x, CARD.y - s.card.h / 2 - 38, 1, P(t, c[0] + 0.5, 0.4));

      const landings = BUGS.map(b => c[1] + b.at); // when each bug badge lands, in scene time

      // plumbing tiles pop in on their words, each wired to the card; a tile turns red with its wire when its first
      // bug lands, and jolts and flickers red with every bug that lands on it
      const tileJolts = PLUMBING.map((p, i) => {
        const at = c[0] + p.at;
        const tp = backPop(t, at);
        const hits = landings.filter((_, k) => BUGS[k].tile === i);
        const buggy = hits.some(h => t >= h);
        const [dx, dy] = jolts(t, hits, 7);
        place(s.tiles[i], tileX(p) + dx, tileY(p) + dy, tp.s, tp.o);
        s.tiles[i].style.borderColor = buggy ? C.red : C.line;
        s.tiles[i].style.boxShadow = redGlow(flicker(t, hits));
        s.wires[i].setAttribute('stroke', buggy ? C.red : C.slate);
        draw(s.wires[i], P(t, at + 0.2, 0.4), 0.6);
        return [dx, dy];
      });

      // LINES OF CODE bar under the card: the business logic stays thin, the plumbing grows, and pulses brighter as
      // each bug lands
      const barBottom = Y0 + TILE.pitch + TILE.h / 2; // level with the bottom of the bottom tiles
      place(s.bar, CARD.x, barBottom - BAR_HALF_H, 1, P(t, c[1] + 0.2, 0.4));
      s.biz.style.width = Math.round(BAR.biz * P(t, c[1] + 0.5, 0.5)) + 'px';
      s.bizL.style.opacity = P(t, c[1] + 0.7, 0.4);
      const grow = P(t, c[1] + 1.2, 2.2);
      s.plumb.style.width = Math.round(plumbingWidth * grow) + 'px';
      s.plumbL.style.opacity = P(t, c[1] + 1.4, 0.4);
      const pulse = Math.max(0, ...landings.map(at => bumpAt(t, at)));
      s.plumb.style.filter = pulse > 0 ? `brightness(${(1 + 0.3 * pulse).toFixed(3)})` : '';

      // bug badges land inside the tiles, and shake with them
      s.bugs.forEach((e, k) => {
        const b = BUGS[k];
        const p = PLUMBING[b.tile];
        const [joltX, joltY] = tileJolts[b.tile];
        const bp = popIn(t, landings[k]);
        place(e, tileX(p) + b.dx + joltX, tileY(p) + b.dy + joltY, bp.s, bp.o);
      });
    }
  });
}
