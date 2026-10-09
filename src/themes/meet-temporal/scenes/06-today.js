// ===================== 6. TEMPORAL TODAY
// The block keeps every name declared in this file local to this scene.
{
  // Three beats. The customers: one dot per paying customer ignites in waves over the band while a counter rolls to
  // 4,300+; then the team, a block of 285 dots that split in two, 570. All the dots then condense into the Temporal
  // symbol. The SDKs: their eight languages orbit out of the symbol onto a ring, five AI frameworks plug in as a row
  // of tiles under it. The valuation: the camera rides a rising line over a grid, through its funding rounds, up to
  // $12.55B. Stage pixels; the content frame runs from y 150 to 880

  // ---------- beat 1: customers and team, drawn on a canvas over the band (it counts as the beat's content)
  const BAND = { x: 960, y: 515, w: 1640, h: 720 };
  const BAND_LEFT = BAND.x - BAND.w / 2, BAND_TOP = BAND.y - BAND.h / 2;
  const CUSTOMERS = 4300;
  // when each customer's dot ignites, in seconds after the waves start: rings spreading from the middle, rippling
  const IGNITE_D = 4.2;
  const DOTS = Array.from({ length: CUSTOMERS }, (_, i) => {
    const x = BAND_LEFT + 12 + hash(i * 3 + 1) * (BAND.w - 24), y = BAND_TOP + 12 + hash(i * 3 + 2) * (BAND.h - 24);
    const d = Math.hypot((x - BAND.x) / (BAND.w / 2), (y - BAND.y) / (BAND.h / 2)) / Math.SQRT2;
    const ripple = 0.06 * Math.sin(d * 22);
    return {
      x, y, off: IGNITE_D * clamp(0.82 * d + ripple + 0.12 * hash(i * 3 + 3)),
      rgb: hash(i * 7) < 0.55 ? RGB.ink : hash(i * 7) < 0.85 ? RGB.violet : RGB.uv,
    };
  });
  const OFFSETS = DOTS.map(dot => dot.off).sort((a, b) => a - b);
  const IGNITED_ALL = OFFSETS[OFFSETS.length - 1];
  // how many dots have ignited `since` seconds after the waves start
  const ignitedBy = since => {
    let lo = 0, hi = OFFSETS.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (OFFSETS[mid] <= since) lo = mid + 1; else hi = mid;
    }
    return lo;
  };
  // the team: 285 dots on a grid of 15 columns, each splitting into two side by side: 30 columns, 570 dots
  const TEAM = { x: 1340, y: 400, cols: 15, rows: 19, step: 13 };
  const teamDot = (col, row, half) => [
    TEAM.x + (2 * col + half + 0.5 - TEAM.cols) * TEAM.step, TEAM.y + (row - (TEAM.rows - 1) / 2) * TEAM.step,
  ];
  // the two columns while the team shows: the customers on the left, the team on the right, their numbers level
  const NUMBER_Y = 640, LABEL_Y = 736;
  const LEFT_X = 580;

  // ---------- the Temporal symbol at the middle, and the points of its outline the dots condense onto
  const SYMBOL_SIZE = 170;
  // the SDK beat's composition, centered on 515: the ring of language tiles (y 177 to 639) around the symbol, then
  // 72 px under it the AI framework tiles in two rows of three (y 711 to 853). The ring turns slowly once its tiles
  // have landed; its radii keep at least 32 px between its tiles at every angle
  const SYM = { x: 960, y: 408 };
  const RING = { rx: 340, ry: 185 };
  // one turn of the ring, in seconds
  const ORBIT = 50;
  const SYMBOL_POINTS = (() => {
    const svg = document.createElementNS(SVGNS, 'svg');
    const p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('d', SYMBOL_PATH.d);
    svg.appendChild(p);
    const [vx, vy, vw] = SYMBOL_PATH.viewBox.split(' ').map(Number);
    const k = SYMBOL_SIZE / vw, L = p.getTotalLength(), n = 900;
    return Array.from({ length: n }, (_, i) => {
      const pt = p.getPointAtLength(L * i / n);
      return [SYM.x + (pt.x - vx - vw / 2) * k, SYM.y + (pt.y - vy - vw / 2) * k];
    });
  })();

  // ---------- beat 2: the SDKs. Language tiles, a logo each, on an ellipse round the symbol, each linked to it,
  // then the AI framework tiles in two rows under it (centers, stage pixels)
  const LANG_CHIP = { w: 92, h: 92 };
  // each logo's size in its tile, matched by eye to an even visual weight: square marks about 52 px, wide marks up to
  // 68 px wide, Java's tall cup 54 px tall; each size leaves even margins, so the logo rests on whole pixels
  const LOGO_SIZE = {
    'Go': [66, 26], 'Java': [40, 54], 'Python': [52, 52], 'TypeScript': [50, 50], '.NET': [66, 26], 'PHP': [68, 36],
    'Ruby': [52, 52], 'Rust': [54, 54],
  };
  // each tile's angle on the ring, clockwise from the top left, in reading order (degrees), and its place on the
  // ring turned by rot (radians), on whole pixels
  const LANG_DEG = [247.5, 292.5, 337.5, 22.5, 67.5, 112.5, 157.5, 202.5];
  const ringAt = (k, rot = 0) => {
    const a = LANG_DEG[k] * Math.PI / 180 + rot;
    return [Math.round(SYM.x + RING.rx * Math.cos(a)), Math.round(SYM.y + RING.ry * Math.sin(a))];
  };
  // the five frameworks, then a sixth tile: and more
  const AI = ['OpenAI Agents SDK', 'Vercel AI SDK', 'Pydantic AI', 'Google ADK', 'LangGraph'];
  const AI_CHIP = { w: 340, h: 60, gapX: 32, gapY: 22 };
  const AI_Y = [741, 823];
  const AI_AT = [...AI, 'more'].map((_, j) => [960 + (j % 3 - 1) * (AI_CHIP.w + AI_CHIP.gapX),
    AI_Y[Math.floor(j / 3)]]);
  // the tiles of both groups: one style, well rounded
  const TILE = { background: '#17182A', color: C.ink, border: '1.5px solid ' + C.uv, fontSize: '24px', gap: '14px',
    padding: '0 24px', borderRadius: '22px' };

  // ---------- beat 3: the valuation, drawn on a full-stage canvas. The rounds as world points (x right, y up the
  // value), joined by three curves; the camera keeps the head of the line at HEAD while it climbs
  const ROUNDS = [
    { date: 'Feb 2022', value: 1.5, label: '$1.5B', series: 'Series B', at: [0, 0] },
    { date: 'Mar 2025', value: 1.72, label: '$1.72B', series: 'Series C', at: [520, -20] },
    { date: 'Feb 2026', value: 5, label: '$5B', series: 'Series D', at: [1000, -290] },
    { date: 'Sep 2026', value: 12.55, label: '$12.55B', series: 'Series E', at: [1260, -1000] },
  ];
  // each curve's control points, from one round to the next
  const CURVES = [
    [[0, 0], [200, 0], [360, -10], [520, -20]],
    [[520, -20], [700, -30], [860, -120], [1000, -290]],
    [[1000, -290], [1100, -410], [1200, -700], [1260, -1000]],
  ];
  const HEAD = [1100, 640];
  // at rest: the whole chart at 55% on the right (its middle at screen x 1360), the value on the left, clear of it
  const REST = { at: [630, -500], scale: 0.55, x: 1290, valueX: 560 };
  // On the settled chart (screen pixels), a vertical measuring bracket right of the SEP 2026 point, from the 2022
  // value's height (the line's start) up to the $12.55B point's, with dashed guides from both points; its label
  // rotated beside its middle, its end values to its right
  const FEB22 = [Math.round(REST.x + (0 - REST.at[0]) * REST.scale), Math.round(515 + (0 - REST.at[1]) * REST.scale)];
  const SEP26 = [Math.round(REST.x + (1260 - REST.at[0]) * REST.scale),
    Math.round(515 + (-1000 - REST.at[1]) * REST.scale)];
  const BRACKET = { x: SEP26[0] + 54, bottom: FEB22[1], top: SEP26[1], tick: 10 };
  const GRID = 80;
  const STARS = Array.from({ length: 220 }, (_, i) => ({
    x: hash(i * 5 + 11) * 1920, y: hash(i * 5 + 12) * 1080, r: 0.6 + hash(i * 5 + 13) * 1.4,
    depth: 0.15 + hash(i * 5 + 14) * 0.35,
  }));
  const SPARKS = Array.from({ length: 40 }, (_, i) => ({
    a: hash(i * 9 + 1) * Math.PI * 2, v: 260 + hash(i * 9 + 2) * 520, life: 0.6 + hash(i * 9 + 3) * 0.6,
  }));

  // A number in the brand font with a violet glow, centered on its box
  const makeNumber = (root, font) => E(root, '', '', {
    fontSize: font + 'px', fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em', whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums', color: C.ink, textShadow: `0 0 40px rgba(${RGB.violet},.65)`,
  });
  const makeLabel = (root, text) => E(root, text, 'lbl', { fontSize: '24px', color: C.slate, whiteSpace: 'nowrap' });
  // A chip: its content centered, a fixed size; css: its colors
  const makeChip = (root, html, size, css) => E(root, html, 'mono', {
    width: size.w + 'px', height: size.h + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '12px', fontSize: '22px', whiteSpace: 'nowrap', borderRadius: 'var(--rs)', ...css,
  });

  scene({
    chapter: 6, title: 'Temporal today',
    subs: [
      // the waves and the count, the team doubling, then the dots condense into the symbol
      { text: "Today, more than 4,300 companies pay for Temporal, and the team has doubled in a year.", after: 9.6 },
      // the eight languages, one after the other, then a hold
      { text: "Its open source SDKs support Go, Java, Python, TypeScript, .NET, PHP, Ruby and Rust.", after: 1.0 },
      // the five AI frameworks, then a hold
      {
        text: "And they plug into AI frameworks: OpenAI Agents SDK, Vercel AI SDK, Pydantic AI, Google ADK, "
          + "LangGraph, and more.",
        after: 1.2,
      },
      // the climb and the arrival; the chart settles before the next subtitle
      { text: "In September 2026, investors valued Temporal at $12.55 billion.", after: 1.8 },
      // on the settled chart, a bracket from 2022 to 2026, ×8; then, by the value, CORE INFRASTRUCTURE FOR AI
      { text: "That's more than 8 times its 2022 value: investors see it as core infrastructure for AI.", after: 1.6 },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // beat 3's canvas and its arrival bloom first, under everything else
      s.chartCanvas = document.createElement('canvas');
      s.chartCanvas.width = 1920; s.chartCanvas.height = 1080;
      s.chart = E(root, '', '', { width: '1920px', height: '1080px' });
      s.chart.appendChild(s.chartCanvas);
      s.bloom = E(root, '', '', {
        width: '2400px', height: '1400px',
        background: `radial-gradient(circle at center, rgba(255,255,255,.85) 0, rgba(${RGB.violet},.45) 18%, `
          + `rgba(${RGB.uv},.15) 36%, rgba(${RGB.uv},0) 60%)`,
      });
      s.rings = makeRipples(root, 3, RGB.neon);
      // beat 1's canvas over the band
      s.dotsCanvas = document.createElement('canvas');
      s.dotsCanvas.width = BAND.w; s.dotsCanvas.height = BAND.h;
      s.dots = E(root, '', '', { width: BAND.w + 'px', height: BAND.h + 'px' });
      s.dots.appendChild(s.dotsCanvas);
      s.burst = E(root, '', '', {
        width: '900px', height: '900px', borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${RGB.neon},.5) 0, rgba(${RGB.violet},.25) 35%, `
          + `rgba(${RGB.violet},0) 70%)`,
      });
      s.custNum = makeNumber(root, 200);
      s.custLabel = makeLabel(root, 'Paying customers');
      s.teamNum = makeNumber(root, 140);
      s.teamLabel = makeLabel(root, 'Employees');
      // the stamp: neon, a fixed even width, so it rests on whole pixels
      // sized to its text (307 px with its padding) with a margin
      s.stamp = fixedTag(root, '×2 in a year', 'neon solid big', 316);
      s.stamp.style.boxShadow = `0 0 30px rgba(${RGB.neon},.4)`;

      // beat 2: the links under the chips, the symbol, the chips, and the filter that draws the logos in ink
      s.links = svgLayer(root);
      const edgePoint = ([x, y], size, r) => {
        // where the link from the symbol reaches the chip's box, and where it leaves the symbol's circle
        const dx = x - SYM.x, dy = y - SYM.y, d = Math.hypot(dx, dy);
        const t1 = Math.min(Math.abs((size.w / 2 + 8) / (dx || 1e-6)), Math.abs((size.h / 2 + 8) / (dy || 1e-6)));
        return [[SYM.x + dx / d * r, SYM.y + dy / d * r], [x - dx * Math.min(1, t1), y - dy * Math.min(1, t1)]];
      };
      const linkD = ([[x0, y0], [x1, y1]]) => `M ${x0} ${y0} L ${x1} ${y1}`;
      s.langLinks = LANGUAGES.map((_, k) => path(s.links, linkD(edgePoint(ringAt(k), LANG_CHIP, SYMBOL_SIZE / 2 + 12)),
        C.uv, 2, false));
      // a link follows its tile as the ring turns: its line redrawn, its length measured again
      s.setLink = (k, at) => {
        const link = s.langLinks[k];
        link.setAttribute('d', linkD(edgePoint(at, LANG_CHIP, SYMBOL_SIZE / 2 + 12)));
        link._L = link.getTotalLength();
      };
      // Each logo, a monochrome mark, in ink: an SVG filter floods its shape (its opaque parts) with the ink colour
      s.inkDefs = document.createElementNS(SVGNS, 'svg');
      Object.assign(s.inkDefs.style, { position: 'absolute', width: 0, height: 0 });
      s.inkDefs.innerHTML = '<filter id="logo-ink" color-interpolation-filters="sRGB">'
        + `<feFlood flood-color="${C.ink}"/><feComposite in2="SourceAlpha" operator="in"/></filter>`;
      root.appendChild(s.inkDefs);
      s.symbolGlow = E(root, '', '', {
        width: '460px', height: '460px', borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${RGB.violet},.35) 0, `
          + `rgba(${RGB.uv},.12) 45%, rgba(${RGB.uv},0) 70%)`,
      });
      s.symbol = E(root, `<img src="${SYMBOL}" style="width:${SYMBOL_SIZE}px;height:${SYMBOL_SIZE}px;display:block">`);
      // the logo alone, the subtitle names the language; whole-pixel sizes keep its edges crisp
      s.langs = LANGUAGES.map(([name, logo]) => makeChip(root,
        `<img src="${logo}" alt="${name}" width="${LOGO_SIZE[name][0]}" height="${LOGO_SIZE[name][1]}" `
        + 'style="display:block;filter:url(#logo-ink)">', LANG_CHIP, { ...TILE, padding: '0' }));
      s.ais = AI.map(name => makeChip(root, `${ICON('sparkle', 24, C.violet, 1.8)}<span>${name}</span>`, AI_CHIP,
        TILE));
      // and more: the same tile, dashed and a little dimmer
      s.ais.push(makeChip(root, `${ICON('plus', 24, C.violet, 2)}<span style="opacity:.75">and more</span>`,
        AI_CHIP, { ...TILE, border: '1.5px dashed ' + C.uv }));

      // beat 3's labels: the rounds, then the valuation
      s.rounds = ROUNDS.slice(0, 3).map(round => E(root,
        `<div class="lbl" style="font-size:16px;color:var(--slate)">${round.date}</div>`
        + `<div style="font-size:34px;font-weight:700;line-height:1.15;color:var(--ink)">${round.label}</div>`
        + `<div class="lbl" style="font-size:14px;color:var(--violet)">${round.series}</div>`,
        'tile', { width: '176px', height: '104px', padding: '12px 0', textAlign: 'center', background: '#17182A' }));
      s.value = makeNumber(root, 200);
      s.valueLabel = makeLabel(root, 'Valuation · September 2026');
      // the ×8 bracket: its dashed guides, its line drawn bottom to top with an arrowhead, its ticks, its pulse, its
      // label and its end values; the AI tag under the value, a fixed even width
      const guide = (x0, y, x1) => {
        const g = path(s.links, `M ${x0} ${y} L ${x1} ${y}`, C.slate, 1.5, false);
        g.setAttribute('stroke-dasharray', '5 7');
        return g;
      };
      s.guides = [guide(FEB22[0] + 16, BRACKET.bottom, BRACKET.x), guide(SEP26[0] + 16, BRACKET.top, BRACKET.x)];
      s.bracket = path(s.links, `M ${BRACKET.x} ${BRACKET.bottom} L ${BRACKET.x} ${BRACKET.top + 4}`, C.violet, 2.5,
        true);
      s.bracketTick = path(s.links, `M ${BRACKET.x - BRACKET.tick} ${BRACKET.bottom} L ${BRACKET.x + BRACKET.tick} `
        + `${BRACKET.bottom}`, C.violet, 2.5, false);
      s.bracketPulse = makeSpark(root, 14, RGB.violet);
      s.bracketLabel = E(root, '×8 since 2022', 'mono', {
        fontSize: '22px', lineHeight: '28px', letterSpacing: '.12em', paddingLeft: '.12em', textTransform: 'uppercase',
        color: C.ink, whiteSpace: 'nowrap',
      });
      s.bracketEnds = ['$1.5B', '$12.55B'].map(text => E(root, text, 'mono', {
        width: '80px', fontSize: '16px', lineHeight: '20px', color: C.slate, whiteSpace: 'nowrap',
      }));
      s.aiTag = fixedTag(root, 'Core infrastructure for AI', 'neon solid', 440);
      s.aiTag.style.boxShadow = `0 0 26px rgba(${RGB.neon},.3)`;
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      const waves = c[0] + 0.3;
      const full = waves + IGNITED_ALL;
      const teamIn = full + 2.4, splitAt = teamIn + 1.0, splitD = 2.0, stampAt = splitAt + splitD + 0.3;
      const gather = c[1] - 2.4;
      const symbolIn = c[1] - 1.0;

      // ---------- beat 1
      // the customers' dots: each flashes as it ignites, then glows softly (twinkling on G); they dim to a starry
      // backdrop while the team shows, then all flow into the symbol's outline as it gathers
      const g = s.dotsCanvas.getContext('2d');
      g.clearRect(0, 0, BAND.w, BAND.h);
      const backdrop = 1 - 0.7 * P(t, teamIn - 0.4, 0.8);
      const toSymbol = i => SYMBOL_POINTS[i % SYMBOL_POINTS.length];
      const gatherP = i => ease(P(t, gather + 0.5 * hash(i * 13 + 5), 1.1));
      const fadeAll = 1 - P(t, symbolIn, 0.5);
      DOTS.forEach((dot, i) => {
        const since = t - waves - dot.off;
        if (since < 0 || fadeAll <= 0) return;
        const flash = Math.max(0, 1 - since / 0.4);
        const twinkle = 0.75 + 0.25 * Math.sin(G * 2.3 + i);
        const f = gatherP(i), [sx, sy] = toSymbol(i);
        const x = lerp(dot.x, sx, f) - BAND_LEFT, y = lerp(dot.y, sy, f) - BAND_TOP;
        g.globalAlpha = clamp((0.55 + 0.45 * flash) * twinkle * lerp(backdrop, 1, f)) * fadeAll;
        g.fillStyle = `rgb(${dot.rgb})`;
        const r = 1.2 + 2.2 * flash;
        g.fillRect(x - r / 2, y - r / 2, r, r);
      });
      // the team: 285 dots pop in on their grid, then each splits in two, column after column
      const teamO = P(t, teamIn, 0.5) * fadeAll;
      let split = 0;
      for (let col = 0; col < TEAM.cols; col++) {
        const at = splitAt + (col / TEAM.cols) * (splitD - 0.4);
        const sp = P(t, at, 0.4, backOut);
        if (t >= at + 0.2) split += TEAM.rows;
        for (let row = 0; row < TEAM.rows; row++) {
          const n = CUSTOMERS + col * TEAM.rows + row;
          [0, 1].forEach(half => {
            if (teamO <= 0) return;
            const [x1, y1] = teamDot(col, row, half), [x0] = teamDot(col, row, 0.5);
            const f = gatherP(n * 2 + half), [sx, sy] = toSymbol(n * 2 + half);
            const x = lerp(lerp(x0, x1, sp), sx, f) - BAND_LEFT, y = lerp(y1, sy, f) - BAND_TOP;
            const pop = P(t, teamIn + 0.4 * hash(n), 0.3);
            g.globalAlpha = teamO * pop;
            g.fillStyle = half ? `rgb(${RGB.neon})` : `rgb(${RGB.ink})`;
            const r = sp > 0 && sp < 1 ? 4 : 3;
            g.fillRect(x - r / 2, y - r / 2, r, r);
          });
        }
      }
      g.globalAlpha = 1;
      place(s.dots, BAND.x, BAND.y, 1, t >= waves && fadeAll > 0 ? 1 : 0);

      // the count rolls with the ignitions, blurring while it races; a pop and a burst of light at 4,300+
      const count = Math.min(CUSTOMERS, ignitedBy(t - waves));
      const rate = count - Math.min(CUSTOMERS, ignitedBy(t - waves - 0.1));
      const done = t >= full;
      const custText = count.toLocaleString('en-US') + (done ? '+' : '');
      if (s.custNum.textContent !== custText) s.custNum.textContent = custText;
      s.custNum.style.filter = !done && rate > 0 ? `blur(${Math.min(3, rate / 60).toFixed(2)}px)` : '';
      // to the left column as the team comes in
      const toLeft = ease(P(t, teamIn - 0.6, 0.8));
      const out1 = 1 - P(t, gather, 0.4);
      place(s.custNum, Math.round(lerp(960, LEFT_X, toLeft)), Math.round(lerp(460, NUMBER_Y, toLeft)),
        lerp(1, 0.7, toLeft) * swell(t, full, 0.12), P(t, waves, 0.3) * out1);
      place(s.custLabel, Math.round(lerp(960, LEFT_X, toLeft)), Math.round(lerp(592, LABEL_Y, toLeft)), 1,
        P(t, waves + 0.6, 0.4) * out1);
      place(s.burst, 960, 460, lerp(0.4, 1.4, P(t, full, 0.7)), win(t, full, full + 0.7, 0.2) * 0.9);
      // the team's count, 285 then up to 570 with the splits, then the stamp
      const teamText = String(285 + split);
      if (s.teamNum.textContent !== teamText) s.teamNum.textContent = teamText;
      place(s.teamNum, TEAM.x, NUMBER_Y, swell(t, stampAt - 0.2, 0.1), P(t, teamIn, 0.4) * out1);
      place(s.teamLabel, TEAM.x, LABEL_Y, 1, P(t, teamIn + 0.3, 0.4) * out1);
      const st = P(t, stampAt, 0.35, easeIn);
      // under the team's label, tilted, at least 20 px clear of the label and of 570
      place(s.stamp, TEAM.x, LABEL_Y + 84, lerp(1.8, 1, st), clamp(st * 3) * out1, lerp(-18, -6, st));

      // ---------- beat 2
      // the symbol takes the dots' place; then the languages orbit out of it, one after the other, each landing
      // with a pop and its link drawn back to the symbol; then the AI frameworks, a row of tiles under the ring.
      // As the climb starts, all fly down and off
      const exitAt = c[3] + 0.05;
      const exit = P(t, exitAt, 0.7, easeIn);
      const away = (x, y) => [x + (x - SYM.x) * 0.4 * exit, y + 520 * exit];
      const symO = P(t, symbolIn, 0.5) * (1 - exit);
      place(s.symbol, ...away(SYM.x, SYM.y), swell(t, c[1] + 0.1, 0.08), symO);
      place(s.symbolGlow, ...away(SYM.x, SYM.y), 1 + 0.04 * Math.sin(G * 1.6), symO * 0.9);
      const langAt = k => c[1] + 0.6 + k * 0.45;
      // once all have landed, the ring turns slowly clockwise, gathering speed over 3 s (keyed to t)
      const spinFrom = langAt(LANGUAGES.length - 1) + 1.0;
      const spin = Math.max(0, t - spinFrom);
      const rot = (spin < 3 ? spin * spin / 6 : spin - 1.5) * 2 * Math.PI / ORBIT;
      s.langs.forEach((e, k) => {
        const p = ease(P(t, langAt(k), 0.8));
        const [tx, ty] = ringAt(k, rot);
        s.setLink(k, [tx, ty]);
        // a spiral: from the symbol, sweeping 70 degrees as it moves out
        const a = Math.atan2((ty - SYM.y) / RING.ry, (tx - SYM.x) / RING.rx) - (1 - p) * 70 * Math.PI / 180;
        const x = SYM.x + RING.rx * p * Math.cos(a), y = SYM.y + RING.ry * p * Math.sin(a);
        const landed = t > langAt(k) + 0.8;
        const [ex, ey] = away(landed ? tx : x, landed ? ty : y);
        place(e, Math.round(ex), Math.round(ey), lerp(0.4, 1, p) * swell(t, langAt(k) + 0.8, 0.12),
          clamp(p * 3) * (1 - exit));
        draw(s.langLinks[k], P(t, langAt(k) + 0.75, 0.3), 0.7 * (1 - P(t, exitAt, 0.3)));
      });
      const aiAt = j => c[2] + 0.4 + j * 0.7;
      // the AI frameworks: a row of tiles under the ring, one after the other, each rising in with a calm pop
      s.ais.forEach((e, j) => {
        const pop = popIn(t, aiAt(j), 0.08), rise = Math.round(16 * (1 - ease(P(t, aiAt(j), 0.4))));
        const [ex, ey] = away(AI_AT[j][0], AI_AT[j][1] + rise);
        place(e, Math.round(ex), Math.round(ey), pop.s, pop.o * (1 - exit));
      });
      // the last one, and more, glows softly as it arrives
      const more = win(t, aiAt(AI.length) + 0.2, aiAt(AI.length) + 1.4, 0.4);
      s.ais[AI.length].style.boxShadow = glowShadow(RGB.violet, more, { blur: 30, alpha: 0.5 });

      // ---------- beat 3
      // the timing of the climb: the grid and the first round, then each curve, the last one a surge
      const climb = c[3] + 0.6;
      const segs = [[climb + 0.2, 1.4, ease], [climb + 1.6, 1.2, linear], [climb + 2.8, 1.0, easeIn]];
      const arrive = segs[2][0] + segs[2][1];
      const settle = ease(P(t, arrive + 0.5, 1.3));
      let seg = 0, u = 0;
      segs.forEach(([at, d, fn], i) => {
        if (t >= at) { seg = i; u = fn(P(t, at, d)); }
      });
      const head = bezier(CURVES[seg], u);
      const value = t < segs[0][0] ? ROUNDS[0].value : lerp(ROUNDS[seg].value, ROUNDS[seg + 1].value, u);
      // the camera: on the head while it climbs, then easing out to the whole chart at rest; a shake on arrival
      const [kx, ky] = shakeAt(t, arrive - 0.15);
      const camAt = [lerp(head[0], REST.at[0], settle), lerp(head[1], REST.at[1], settle)];
      const anchor = [lerp(HEAD[0], REST.x, settle) + kx, lerp(HEAD[1], 515, settle) + ky];
      const zoom = lerp(1, REST.scale, settle);
      const toScreen = ([wx, wy]) => [anchor[0] + (wx - camAt[0]) * zoom, anchor[1] + (wy - camAt[1]) * zoom];
      const chartO = P(t, climb - 0.3, 0.5) * lerp(1, 0.7, settle);
      const cg = s.chartCanvas.getContext('2d');
      cg.clearRect(0, 0, 1920, 1080);
      if (chartO > 0) {
        cg.globalAlpha = chartO;
        // the stars drift slower than the grid, which drifts slower than the chart: three depths
        STARS.forEach(star => {
          const x = ((star.x - camAt[0] * star.depth) % 1920 + 1920) % 1920;
          const y = ((star.y - camAt[1] * star.depth) % 1080 + 1080) % 1080;
          cg.fillStyle = 'rgba(232,234,255,.7)';
          cg.fillRect(x, y, star.r, star.r);
        });
        cg.strokeStyle = 'rgba(148,163,184,.12)';
        cg.lineWidth = 1;
        const step = GRID * zoom;
        const ox = ((anchor[0] - camAt[0] * zoom * 0.6) % step + step) % step;
        const oy = ((anchor[1] - camAt[1] * zoom * 0.6) % step + step) % step;
        cg.beginPath();
        for (let x = ox; x < 1920; x += step) { cg.moveTo(x, 0); cg.lineTo(x, 1080); }
        for (let y = oy; y < 1080; y += step) { cg.moveTo(0, y); cg.lineTo(1920, y); }
        cg.stroke();
        // the line, drawn up to the head, glowing, its newest part brightest
        cg.lineCap = 'round';
        const curvePoints = (i, upTo) => Array.from({ length: 41 },
          (_, n) => toScreen(bezier(CURVES[i], upTo * n / 40)));
        const drawn = [0, 1, 2].filter(i => i < seg || (i === seg && t >= segs[0][0]));
        drawn.forEach(i => {
          const pts = curvePoints(i, i < seg ? 1 : u);
          cg.shadowColor = `rgba(${RGB.violet},.9)`;
          cg.shadowBlur = 18;
          cg.strokeStyle = i === 2 ? C.neon : C.violet;
          cg.lineWidth = i === 2 ? 5 : 4;
          cg.beginPath();
          pts.forEach(([x, y], n) => (n ? cg.lineTo(x, y) : cg.moveTo(x, y)));
          cg.stroke();
        });
        cg.shadowBlur = 0;
        // the rounds' markers, each flashing as the line reaches it
        ROUNDS.forEach((round, i) => {
          const reached = i === 0 ? segs[0][0] : segs[i - 1][0] + segs[i - 1][1];
          if (t < reached - 0.05) return;
          const [x, y] = toScreen(round.at);
          const fl = win(t, reached, reached + 0.5, 0.1);
          cg.fillStyle = i === 3 ? C.neon : C.ink;
          cg.beginPath(); cg.arc(x, y, 7 + 8 * fl, 0, Math.PI * 2); cg.fill();
          if (fl > 0) {
            cg.strokeStyle = `rgba(${RGB.neon},${(0.8 * fl).toFixed(3)})`;
            cg.lineWidth = 3;
            cg.beginPath(); cg.arc(x, y, 14 + 40 * (1 - fl), 0, Math.PI * 2); cg.stroke();
          }
        });
        // the head: a bright comet while it climbs
        if (t >= segs[0][0] && t < arrive + 0.2) {
          const [hx, hy] = toScreen(head);
          const glow = cg.createRadialGradient(hx, hy, 0, hx, hy, 46);
          glow.addColorStop(0, 'rgba(255,255,255,.95)');
          glow.addColorStop(0.3, `rgba(${RGB.neon},.6)`);
          glow.addColorStop(1, `rgba(${RGB.neon},0)`);
          cg.fillStyle = glow;
          cg.beginPath(); cg.arc(hx, hy, 46, 0, Math.PI * 2); cg.fill();
        }
        // the arrival: sparks thrown out of the last round, falling and fading
        const [px, py] = toScreen(ROUNDS[3].at);
        SPARKS.forEach(sp => {
          const age = t - arrive;
          if (age <= 0 || age >= sp.life) return;
          const at = a => [px + Math.cos(sp.a) * sp.v * a, py + Math.sin(sp.a) * sp.v * a + 380 * a * a];
          const [x0, y0] = at(Math.max(0, age - 0.06)), [x1, y1] = at(age);
          cg.strokeStyle = `rgba(${RGB.neon},${(1 - age / sp.life).toFixed(3)})`;
          cg.lineWidth = 2.5;
          cg.beginPath(); cg.moveTo(x0, y0); cg.lineTo(x1, y1); cg.stroke();
        });
        cg.globalAlpha = 1;
      }
      place(s.chart, 960, 540, 1, chartO > 0 ? 1 : 0);
      const [px, py] = toScreen(ROUNDS[3].at);
      place(s.bloom, px, py, 1, win(t, arrive - 0.05, arrive + 0.5, 0.15) * 0.9);
      placeRipples(s.rings, t, arrive, px, py, 40, 900);
      // the rounds' labels, above and left of their markers, flashing as the line reaches them; they fade near the
      // frame's edges as the camera moves on, and as the chart settles
      s.rounds.forEach((e, i) => {
        const reached = i === 0 ? segs[0][0] : segs[i - 1][0] + segs[i - 1][1];
        const [x, y] = toScreen(ROUNDS[i].at);
        const lx = x - 100, ly = y - 76;
        const edge = clamp((880 - (ly + 52)) / 60) * clamp((lx - 88 - 120) / 60) * clamp((ly - 52 - 150) / 40);
        place(e, Math.round(lx), Math.round(ly), swell(t, reached, 0.14), P(t, reached - 0.1, 0.3) * edge
          * (1 - P(t, arrive + 0.3, 0.5)));
        e.style.borderColor = win(t, reached, reached + 0.6, 0.15) > 0.5 ? C.neon : C.line;
      });
      // the value: racing with the head, blurred while it surges, then to the middle, big, with its label
      const valueText = '$' + value.toFixed(2) + 'B';
      if (s.value.textContent !== valueText) s.value.textContent = valueText;
      const speed = seg === 2 && t < arrive ? P(t, segs[2][0], segs[2][1], easeIn) : 0;
      s.value.style.filter = speed > 0.05 ? `blur(${(2.5 * speed).toFixed(2)}px)` : '';
      place(s.value, Math.round(lerp(700, REST.valueX, settle) + kx), Math.round(lerp(300, 480, settle) + ky),
        lerp(0.5, 1, settle) * swell(t, arrive, 0.1), P(t, climb, 0.4));
      place(s.valueLabel, REST.valueX, 610, 1, P(t, arrive + 1.2, 0.5));
      // c[4]: the ×8 bracket draws over the climb with a pulse, its label pops; then the AI tag, as the subtitle
      // reaches its phrase
      const bracketAt = c[4] + 0.5;
      s.guides.forEach(g => { g.style.opacity = (0.8 * P(t, bracketAt - 0.3, 0.4)).toFixed(3); });
      draw(s.bracketTick, P(t, bracketAt - 0.1, 0.2));
      // the pulse rides the head of the line as it draws
      const bracketP = P(t, bracketAt, 0.9);
      draw(s.bracket, bracketP);
      sparkOnPath(s.bracketPulse, s.bracket, bracketP);
      const bl = popIn(t, bracketAt + 0.8);
      // rotated, reading bottom to top, its middle 34 px right of the bracket
      place(s.bracketLabel, BRACKET.x + 34, Math.round((BRACKET.top + BRACKET.bottom) / 2), bl.s, bl.o, -90);
      s.bracketEnds.forEach((e, k) => place(e, BRACKET.x + 22 + 40, k ? BRACKET.top : BRACKET.bottom, 1,
        P(t, bracketAt + (k ? 0.9 : 0), 0.3)));
      const ai = backPop(t, c[4] + 2.8);
      place(s.aiTag, REST.valueX, 690, ai.s, ai.o);
    }
  });
}
