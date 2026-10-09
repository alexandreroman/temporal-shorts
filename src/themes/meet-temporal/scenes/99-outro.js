// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  // ---------- Ziggy, Temporal's mascot (a tardigrade), as a constellation
  // Traced from the brand artwork (a 1068x890 image): every point below is in that image's pixels, and ziggyPoint()
  // scales it onto the stage. The traced lines span x 89-762, y 131-766 of the image.
  const ART = { centerX: 425.5, top: 131, height: 635 };
  const ZIGGY_HEIGHT = 430;
  const ZIGGY_TOP = 176; // stage y of the artwork's top line
  const ZIGGY_SCALE = ZIGGY_HEIGHT / ART.height;
  // Whole stage pixels, so the stars rest on whole pixels and the lines run through their centers
  const ziggyPoint = ([x, y]) => [
    Math.round(960 + (x - ART.centerX) * ZIGGY_SCALE),
    Math.round(ZIGGY_TOP + (y - ART.top) * ZIGGY_SCALE),
  ];

  // The body outline, a closed loop drawn clockwise from the top of the head: the back curves down to the tail
  // foot, the belly runs along the bottom, the chest goes back up to the head
  const OUTLINE = [
    [169, 186], [249, 131], [342, 131], [433, 210], [489, 326], [571, 382], [670, 419], [718, 495], [717, 582],
    [731, 628], [762, 677], [728, 718], [683, 710], [639, 661], [574, 701], [482, 706], [408, 661], [360, 634],
    [340, 613], [306, 582], [285, 557], [258, 513], [233, 480], [191, 409], [162, 357], [142, 281],
  ];
  // Strokes that grow out of the outline: each starts at OUTLINE[from] and draws as the outline's pen passes there
  const BRANCHES = [
    { from: 13, points: [[639, 661], [617, 615], [611, 560]] }, // the fold above the tail foot
    { from: 14, points: [[574, 701], [585, 725], [567, 753], [534, 766], [501, 744], [482, 706]] }, // back foot
    { from: 16, points: [[408, 661], [402, 684], [382, 714], [346, 721], [320, 695], [322, 658], [340, 613]] },
    { from: 19, points: [[306, 582], [279, 617], [246, 637], [216, 626], [203, 594], [224, 547], [258, 513]] },
    // the front leg, raised on the left
    { from: 22, points: [[233, 480], [213, 497], [154, 524], [105, 524], [89, 487], [101, 458], [156, 437],
      [191, 409]] },
  ];
  // Strokes inside the body, drawn once the outline is complete: the eye (closed), then the three folds of the
  // body, from the head to the back
  const EYE = [[196, 214], [250, 200], [255, 243], [240, 274], [216, 281], [203, 259]];
  const FOLDS = [
    [[328, 333], [321, 378], [296, 435], [302, 467], [328, 481], [358, 468], [379, 434], [391, 400], [389, 359]],
    [[398, 415], [397, 452], [390, 496], [393, 525], [416, 542], [449, 530], [470, 492], [475, 432]],
    [[481, 488], [475, 542], [490, 585], [527, 610], [555, 595], [563, 560], [563, 520], [569, 502]],
  ];
  // The stars, at the vertices the artwork marks: [x, y, bright]; bright stars are larger, the others dimmer
  const STARS = [
    // outline
    [169, 186, 1], [342, 131, 1], [433, 210, 0], [489, 326, 1], [670, 419, 0], [718, 495, 1], [731, 628, 0],
    [728, 718, 0], [639, 661, 1], [574, 701, 0], [482, 706, 1], [408, 661, 1], [306, 582, 1], [233, 480, 1],
    [162, 357, 1], [142, 281, 0],
    // front leg and feet
    [101, 458, 1], [154, 524, 0], [534, 766, 0], [320, 695, 0], [224, 547, 0], [246, 637, 0],
    // eye
    [250, 200, 0], [255, 243, 0], [216, 281, 0],
    // folds
    [328, 333, 1], [328, 481, 1], [389, 359, 0], [397, 452, 0], [416, 542, 1], [475, 432, 1], [475, 542, 1],
    [527, 610, 0], [569, 502, 1],
  ];
  const LINE_COLOR = 'rgba(180,185,255,.7)';
  const LINE_OPACITY = 0.86; // at rest about rgba(180,185,255,.6); the glow pulse brings the lines to full
  const BRIGHT_STAR = { size: 10, rgb: RGB.ink };
  const DIM_STAR = { size: 6, rgb: '232,234,255' };

  // ---------- title: "Meet" and the official lockup, read as one title "Meet Temporal"
  // The lockup's viewBox is 1570x410 units (405 395 1570 410): its wordmark's capitals run from y 519 to the
  // baseline at y 684.7, and its symbol spans x 414-804, y 405-795.
  const LOCKUP_HEIGHT = 133;
  const LOCKUP_UNIT = LOCKUP_HEIGHT / 410;
  const LOCKUP_WIDTH = 1570 * LOCKUP_UNIT;
  // How far the wordmark's baseline sits above the bottom of the image
  const LOCKUP_BASELINE_RISE = Math.round((805 - 684.7) * LOCKUP_UNIT);
  // "Meet" in the brand font with capitals exactly as tall as the wordmark's: Instrument Sans capitals are
  // 0.72 em tall, and the word is 2.405 em wide, its last letter ending 0.023 em before that
  const MEET_FONT = (684.7 - 519) * LOCKUP_UNIT / 0.72;
  const MEET_WIDTH = Math.ceil(2.405 * MEET_FONT);
  // Clear space from the "t" to the symbol: the lockup's own gap between its symbol and its wordmark, so the
  // symbol sits evenly between the two words
  const MEET_GAP = Math.round((915 - 804) * LOCKUP_UNIT);
  const LOCKUP_MARGIN = Math.round(MEET_GAP - (MEET_WIDTH - 2.382 * MEET_FONT) - (414 - 405) * LOCKUP_UNIT);
  const TITLE_WIDTH = Math.ceil((MEET_WIDTH + LOCKUP_MARGIN + LOCKUP_WIDTH) / 2) * 2;
  // The tagline's capitals start 8 px below its 32 px line box top: 23 px between the title and the tagline
  // leave 34 px of clear space under the symbol, as under the descender of the former text title
  const TAGLINE_GAP = 23;
  const CARD_WIDTH = 800;
  const CARD_HEIGHT = LOCKUP_HEIGHT + TAGLINE_GAP + 32;
  // The title sits 62 px under Ziggy's feet; with Ziggy above, the composition spans y 171-859, centered on 515
  const CARD_Y = ZIGGY_TOP + ZIGGY_HEIGHT + 3 + 62 + CARD_HEIGHT / 2;

  // ---------- timing (scene seconds)
  const STARS_AT = 0.5; // the stars twinkle in one by one, in a seeded order
  const STAR_STEP = 0.04;
  const OUTLINE_AT = 1.5; // then the outline draws, its branches growing as its pen passes them
  const OUTLINE_D = 1.2;
  const BRANCH_D = 0.3;
  const EYE_AT = 2.6;
  const FOLD_AT = 2.7;
  const FOLD_STEP = 0.1;
  const FOLD_D = 0.35;
  const PULSE_AT = 3.3; // the constellation is complete: a glow sweeps across it, left to right
  const PULSE_SWEEP = 0.5;

  const polylinePath = (points, closed) =>
    'M ' + points.map(point => ziggyPoint(point).join(' ')).join(' L ') + (closed ? ' Z' : '');
  const distance = ([x1, y1], [x2, y2]) => Math.hypot(x2 - x1, y2 - y1);

  // The scene time at which the outline's pen, drawing at a steady speed, reaches OUTLINE[index]
  function penReaches(index) {
    let total = 0, reached = 0;
    OUTLINE.forEach((point, i) => {
      const next = OUTLINE[(i + 1) % OUTLINE.length];
      if (i === index) reached = total;
      total += distance(point, next);
    });
    return OUTLINE_AT + OUTLINE_D * reached / total;
  }

  // Title block: "Meet" and the lockup on one line, the violet tagline under it. The lockup image rests its
  // wordmark's baseline on the line's baseline (vertical-align lowers the image's bottom under it), where "Meet"
  // sits too.
  function makeTitleCard(root, tagline) {
    return E(root,
      `<div style="width:${TITLE_WIDTH}px;height:${LOCKUP_HEIGHT}px;margin:0 auto;text-align:left;`
      + 'line-height:0;white-space:nowrap">'
      + `<span style="display:inline-block;width:${MEET_WIDTH}px;font-size:${MEET_FONT}px">Meet</span>`
      + `<img src="${LOGO}" style="height:${LOCKUP_HEIGHT}px;margin-left:${LOCKUP_MARGIN}px;`
      + `vertical-align:-${LOCKUP_BASELINE_RISE}px"></div>`
      + '<div class="mono" style="font-size:24px;line-height:32px;letter-spacing:.14em;padding-left:.14em;'
      + `color:var(--violet);margin-top:${TAGLINE_GAP}px">${tagline}</div>`,
      '', { width: CARD_WIDTH + 'px', height: CARD_HEIGHT + 'px', textAlign: 'center' });
  }

  scene({
    pre: 0.4, post: 2.6,
    holdBeforeEnd: CAMERA_EXIT, // presenter mode holds before the exit zoom
    subs: [
      { text: "Temporal keeps code running whatever fails, from everyday apps to AI agents." },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // a soft violet glow behind Ziggy, lit by the pulse once the constellation is complete
      s.halo = E(root, '', '', {
        width: '640px', height: '520px', borderRadius: '50%',
        background: `radial-gradient(closest-side, rgba(${RGB.uv},.32), rgba(${RGB.uv},0))`,
      });
      s.svg = svgLayer(root);
      s.outline = path(s.svg, polylinePath(OUTLINE, true), LINE_COLOR, 2, false);
      s.branches = BRANCHES.map(b => ({
        line: path(s.svg, polylinePath(b.points, false), LINE_COLOR, 2, false),
        at: penReaches(b.from),
      }));
      s.eye = path(s.svg, polylinePath(EYE, true), LINE_COLOR, 2, false);
      s.folds = FOLDS.map(points => path(s.svg, polylinePath(points, false), LINE_COLOR, 2, false));

      // seeded twinkle-in order: the stars sorted by a hash of their index, each appearing at its rank
      const byHash = STARS.map((_, i) => i).sort((a, b) => hash(a + 17) - hash(b + 17));
      s.stars = STARS.map(([x, y, bright], i) => {
        const look = bright ? BRIGHT_STAR : DIM_STAR;
        const [sx, sy] = ziggyPoint([x, y]);
        return { e: makeSpark(root, look.size, look.rgb), x: sx, y: sy, bright,
          at: STARS_AT + byHash.indexOf(i) * STAR_STEP };
      });
      s.pen = makeSpark(root, 10, RGB.ink);

      s.card = makeTitleCard(root, 'DURABLE EXECUTION FOR APPS AND AI AGENTS');
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      place(s.card, 960, CARD_Y, 1, P(t, 0.3, 0.8));

      // the glow pulse: 0 before and after, 1 as it passes the stage x `x`
      const [left] = ziggyPoint([89, 0]), [right] = ziggyPoint([762, 0]);
      const pulseAt = x => Math.max(0, 1 - Math.abs(t - PULSE_AT - PULSE_SWEEP * (x - left) / (right - left)) / 0.3);

      // lines: the outline at a steady pace with a spark on its pen, its branches as the pen passes them, then
      // the eye and the folds
      const lineOpacity = lerp(LINE_OPACITY, 1, pulseAt(960));
      const outlineProgress = P(t, OUTLINE_AT, OUTLINE_D, linear);
      draw(s.outline, outlineProgress, lineOpacity);
      sparkOnPath(s.pen, s.outline, outlineProgress);
      s.branches.forEach(b => draw(b.line, P(t, b.at, BRANCH_D, linear), lineOpacity));
      draw(s.eye, P(t, EYE_AT, FOLD_D), lineOpacity);
      s.folds.forEach((l, i) => draw(l, P(t, FOLD_AT + i * FOLD_STEP, FOLD_D), lineOpacity));

      // stars: each pops in bright, then settles into a gentle twinkle (ambient, G); the pulse swells them
      s.stars.forEach((star, i) => {
        const appear = backPop(t, star.at, 0.35);
        const wave = Math.sin(G * 2.1 + i * 2.4);
        const twinkle = star.bright ? 0.85 + 0.15 * wave : 0.7 + 0.2 * wave;
        const opacity = appear.o * lerp(1, twinkle, P(t, star.at + 0.2, 0.5));
        place(star.e, star.x, star.y, appear.s * (1 + 0.6 * pulseAt(star.x)), opacity);
      });
      place(s.halo, 960, ZIGGY_TOP + ZIGGY_HEIGHT / 2, 1, 0.3 * P(t, PULSE_AT, 0.4) + 0.18 * pulseAt(960));
    }
  });
}
