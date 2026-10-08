// ===================== 4. WHERE TEMPORAL IS USED
// The block keeps every name declared in this file local to this scene.
{
  // Four category tiles side by side across the free band, each with a UV header and three examples; the AI tile
  // lights up last, leading into the next chapter
  const TILE = { w: 390, h: 420, gap: 40, y: 522 };
  const TILE_X = [0, 1, 2, 3].map(i => 120 + TILE.w / 2 + i * (TILE.w + TILE.gap));
  const HEADER_H = 72;
  const EXAMPLE = { top: 132, gap: 92 }; // first example line, inside the tile, and the spacing between lines
  const CATEGORIES = [
    { name: 'Process', examples: ['Payments', 'Orders', 'Bookings'] },
    { name: 'Lifecycle', examples: ['Subscriptions', 'User accounts', 'Inventory'] },
    { name: 'Operational', examples: ['CI/CD', 'Provisioning', 'Data pipelines'] },
    { name: 'AI', examples: ['Agents', 'RAG flows', 'Model training'] },
  ];
  const AI = CATEGORIES.length - 1;

  // Category tile: a UV header (the category in bold, then WORKFLOWS lighter), then one line per example, each with
  // a small violet square in front
  function makeCategory(root, { name, examples }) {
    const tile = E(root,
      `<div class="hdr mono" style="position:absolute;left:0;right:0;top:0;height:${HEADER_H}px;display:flex;`
      + `align-items:center;justify-content:center;gap:14px;background:${C.uv};border-radius:9px 9px 0 0;`
      + 'font-size:24px;letter-spacing:.1em;padding-left:.1em;text-transform:uppercase;color:#FFFFFF">'
      + `<b>${name}</b><span style="opacity:.7">Workflows</span></div>`,
      'tile', { width: TILE.w + 'px', height: TILE.h + 'px', overflow: 'hidden' });
    tile.hdr = tile.querySelector('.hdr');
    tile.examples = examples.map((text, i) => E(tile,
      `<i style="display:inline-block;width:10px;height:10px;background:${C.violet};border-radius:2px;`
      + `margin-right:20px;vertical-align:middle"></i>${text}`,
      '', { left: '44px', top: (EXAMPLE.top + i * EXAMPLE.gap) + 'px', fontSize: '32px', whiteSpace: 'nowrap' }));
    return tile;
  }

  scene({
    chapter: 4, title: 'Where Temporal is used',
    // laid out centered at (960, 522) on the free band
    subs: [
      {
        text: "A <b>Workflow</b> is any process that must finish correctly: payments, orders, bookings, subscriptions.",
        after: 0.4,
      },
      { text: "Teams also run infrastructure, data pipelines and, more and more, AI on Temporal.", after: 1.2 },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.tiles = CATEGORIES.map(category => makeCategory(root, category));
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      // the tiles come in one by one, then their examples, slate; each example turns white once the subtitle reads it
      const tileIn = [c[0] + 0.3, c[0] + 0.6, c[0] + 0.9, c[0] + 1.2];
      // [tile, example, when the subtitle reads it]
      const reads = [
        [0, 0, c[0] + 3.6], [0, 1, c[0] + 4.1], [0, 2, c[0] + 4.6], [1, 0, c[0] + 5.3],
        [2, 0, c[1] + 1.0], [2, 2, c[1] + 2.0],
      ];
      const aiOn = c[1] + 3.6;
      // once the AI tile lights up, it grows and the others step back, leading into the next chapter
      const focus = P(t, aiOn, 0.6);
      s.tiles.forEach((tile, i) => {
        const p = P(t, tileIn[i], 0.8);
        const glow = i === AI ? P(t, aiOn, 0.5) : 0;
        const scale = i === AI ? 1 + 0.05 * focus : 1 - 0.03 * focus;
        // each tile swings in on its left edge, like a card turned over
        place(tile, TILE_X[i], TILE.y, scale, clamp(p * 1.6) * (i === AI ? 1 : 1 - 0.55 * focus));
        const turn = ((1 - ease(p)) * 75).toFixed(2);
        tile.style.transform += ` perspective(1400px) translateX(${-TILE.w / 2}px) rotateY(${turn}deg)`
          + ` translateX(${TILE.w / 2}px)`;
        tile.style.borderColor = glow > 0.5 ? C.violet : C.line;
        tile.style.boxShadow = `0 0 ${Math.round(60 * glow)}px rgba(182,100,255,${(0.45 * glow).toFixed(3)})`;
        tile.hdr.style.background = glow > 0
          ? `linear-gradient(90deg, rgba(182,100,255,${glow.toFixed(3)}), ${C.uv})` : C.uv;
        tile.examples.forEach((e, k) => {
          showRow(e, P(t, tileIn[i] + 0.5 + k * 0.15, 0.4), 26, true);
          const hit = reads.find(([ti, ki]) => ti === i && ki === k);
          const read = (hit && t >= hit[2]) || (i === AI && glow > 0.5);
          e.style.color = read ? C.ink : C.slate;
        });
      });
    }
  });
}
