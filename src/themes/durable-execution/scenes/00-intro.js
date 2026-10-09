// ===================== INTRO
// Title on the left; on the right, the 4 order steps as a vertical chain. A neon pulse runs down the chain in
// a loop and checks each step; Ship package fails first, retries, then passes (a hint of what Temporal does).
// The block keeps every name declared in this file local to this scene.
{
  // tile centers every `pitch` px, links in between; badge: size of the status badge right of each tile
  const CHAIN = { x: 1500, y: 522, tile: 132, pitch: 188, badge: 44 };
  const TITLE_X = 700; // center of the title block, level with the middle of the chain
  const tileY = i => CHAIN.y + (i - 1.5) * CHAIN.pitch;
  const gap = CHAIN.tile / 2 + 2; // links stop 2 px short of the tiles
  const linkPath = i => `M ${CHAIN.x} ${tileY(i) + gap} L ${CHAIN.x} ${tileY(i + 1) - gap}`;
  // one pass of the pulse, in seconds from the start of the loop: arrival on each tile, then the retry of tile 2
  const LOOP = { start: 1.5, period: 5.6, arrive: [0, 0.75, 1.5, 3.55], fail: 2, retry: 2.1, pass: 2.8, reset: 4.9 };
  const travel = 0.5; // the pulse leaves a tile `arrive + 0.25`, reaches the next one `travel` s later

  scene({
    pre: 1.0,
    // title + chain, measured: centered at (960, 522) in the content frame (y 150-880), within the centering
    // tolerance of its middle, y 515
    shift: [18, 0],
    subs: [
      {
        text: "Payments, orders, sign-ups: most apps run processes made of several steps. What if one fails halfway?",
        after: 1.0,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.t = makeTitleBlock(root, 'AN INTRODUCTION FOR EVERYONE', 'What is Durable<br>Execution?',
        'WITH TEMPORAL WORKFLOWS', {
          logoH: 64, logoGap: 52, kickerFont: 24, titleFont: 128, titleGap: 26, taglineFont: 26, taglineGap: 40,
        });
      // whole-pixel box (measured content: 893.8 x 509), so the centered block lands on whole pixels
      Object.assign(s.t.style, { width: '894px', height: '510px' });
      s.links = [0, 1, 2].map(i => path(s.svg, linkPath(i), C.line, 2, false));
      s.lit = [0, 1, 2].map(i => path(s.svg, linkPath(i), C.neon, 2.5, false)); // neon trail of the pulse
      s.tiles = ORDER_STEPS.map(step => iconTile(root, step.icon, null, CHAIN.tile, CHAIN.tile, C.ink,
        { size: 58, stroke: 1.7 }));
      // status badge to the right of each tile: check, failure cross or retry arrow
      s.badges = ORDER_STEPS.map(() => {
        const b = E(root,
          `<div class="ok" style="position:absolute;inset:0">${ICON('check', CHAIN.badge, C.neon, 2.6)}</div>`
          + `<div class="ko" style="position:absolute;inset:0">${ICON('x', CHAIN.badge, C.red, 2.6)}</div>`
          + `<div class="re" style="position:absolute;inset:0">${ICON('retry', CHAIN.badge, C.violet, 2.4)}</div>`,
          '', { width: CHAIN.badge + 'px', height: CHAIN.badge + 'px' });
        b.ok = b.querySelector('.ok'); b.ko = b.querySelector('.ko'); b.re = b.querySelector('.re');
        return b;
      });
      s.dot = makeGlowDot(root, 18, RGB.neon, { blur: 20 });
    },
    update(t, c, s) {
      rise(s.t, TITLE_X, CHAIN.y, P(t, 0.15, 0.9));
      // time inside the current pass of the pulse (negative before the first pass). The pulse is an ambient loop,
      // so it runs on G: the live player sees the scene as still once the tiles are in. The intro starts at 0, so
      // in frozen mode (G = t) it plays exactly as on the timeline. Any negative u leaves the chain unlit.
      const u = t < LOOP.start ? -1 : (G - LOOP.start) % LOOP.period;
      const fade = 1 - P(u, LOOP.reset, 0.4); // checks and neon links fade out before the next pass
      const hitAt = i => (i === LOOP.fail ? LOOP.pass : LOOP.arrive[i]); // when step i passes
      s.tiles.forEach((e, i) => {
        const p = P(t, 0.5 + i * 0.15, 0.5, backOut);
        place(e, CHAIN.x, tileY(i), p, clamp(p * 2));
        const failed = i === LOOP.fail && u >= LOOP.arrive[i] && u < LOOP.retry;
        const retrying = i === LOOP.fail && u >= LOOP.retry && u < LOOP.pass;
        const passed = u >= hitAt(i);
        let border = C.line;
        if (failed) border = C.red;
        else if (retrying) border = C.violet;
        else if (passed && fade > 0.5) border = C.neon;
        e.style.borderColor = border;
        // brief glow as the pulse lands: red when the step fails, neon when it passes
        const landed = failed ? LOOP.arrive[i] : hitAt(i);
        const g = win(u, landed, landed + 0.15, 0.15);
        const rgb = failed ? RGB.red : RGB.neon;
        e.style.boxShadow = glowShadow(rgb, g, { blur: 30, alpha: 0.5 });
        // badge: the check pops in and fades with the reset; the cross and the retry arrow show while they last
        const b = s.badges[i];
        const pop = passed ? popIn(u, hitAt(i)) : { o: 1, s: 1 };
        const shown = passed ? fade * pop.o : failed || retrying ? 1 : 0;
        place(b, CHAIN.x + CHAIN.tile / 2 + 44, tileY(i), pop.s, shown);
        b.ok.style.opacity = passed ? 1 : 0;
        b.ko.style.opacity = failed ? 1 : 0;
        b.re.style.opacity = retrying ? 1 : 0;
        b.re.style.transform = `rotate(${retrying ? (u - LOOP.retry) * 360 : 0}deg)`;
      });
      s.links.forEach((l, i) => draw(l, P(t, 0.9 + i * 0.12, 0.35)));
      // the pulse: drawn link by link, as a dot leading a neon stroke
      let dotO = 0, dotY = 0;
      s.lit.forEach((l, i) => {
        const leave = hitAt(i) + 0.25;
        const p = clamp((u - leave) / travel);
        draw(l, p, fade);
        if (u >= leave && u < leave + travel) {
          dotO = 1;
          dotY = lerp(tileY(i) + CHAIN.tile / 2, tileY(i + 1) - CHAIN.tile / 2, p);
        }
      });
      place(s.dot, CHAIN.x, dotY, 1, dotO);
    }
  });
}
