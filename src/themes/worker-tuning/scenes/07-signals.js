// ===================== 7. READ THE SIGNALS
// The recap: a table under the headings SYMPTOM, SIGNAL and FIX, whose first row is the symptom, a growing backlog,
// with the backlog metrics to watch first, then, a zone gap under it, one row for each of its four causes. Starts on
// chapter 6's last frame (a hard cut): the small parts of the Worker diagram that start the rows (a queue strip, a
// full Slot grid, a Poller, a cache cell, a full CPU meter, see RECAP), into which chapter 6 shrinks its Activity lane
// and its bottleneck components; each row grows from its part. Each row lights up as the first subtitle names it: the
// symptom first, then the causes. Under the table, the tuning loop draws in as the second subtitle reads it: CHANGE
// ONE SETTING, WATCH THE SIGNALS, NEXT BOTTLENECK, and an arrow back to the start. Last, the rows and the loop leave in
// turn while the Slot grid part grows into the outro's mini Worker: the outro starts on this chapter's last frame
// (another hard cut).
// The block keeps every name declared in this file local to this scene.
{
  // The symptom, then the four causes, in the order the first subtitle names them (name: its words in the subtitle),
  // each row starting with its part (RECAP_PARTS, in the same order). The signal: metrics (named without their
  // temporal_ or temporal_cloud_v1_ prefix, as in the docs headings), one per line, each with its reading, or plain
  // words (signalText) in the text font; the fix: what to change, and the Worker option that does it, on a second line.
  // The symptom's metrics are those to watch first, as the badge on its row says: the backlog of the Task Queue (server
  // or Temporal Cloud metrics), then the wait (an SDK metric); the limits' metrics are SDK metrics.
  const ROWS = [
    {
      name: 'A growing backlog', symptom: 'Backlog grows, tasks wait',
      metrics: [
        ['approximate_backlog_count', 'rising'], ['approximate_backlog_age', 'older'],
        ['schedule_to_start_latency', 'high'],
      ],
      fix: 'Find the full limit below', option: '',
    },
    {
      name: 'Slots', symptom: 'Slots full, CPU low',
      metrics: [['worker_task_slots_available', 'at 0']],
      fix: 'More Slots, if downstream keeps up', option: 'maxConcurrentActivityTaskExecutions',
    },
    {
      name: 'Pollers', symptom: 'Slots free, long wait',
      metrics: [['activity_schedule_to_start_latency', 'high']],
      fix: 'Poller Autoscaling', option: 'activityTaskPollerBehavior',
    },
    {
      name: 'cache', symptom: 'Evictions, replays',
      metrics: [['sticky_cache_total_forced_eviction', 'high rate']],
      fix: 'More memory, larger cache', option: 'maxCachedWorkflows',
    },
    {
      name: 'CPU', symptom: 'CPU at 100%',
      signalText: 'CPU usage',
      fix: 'More Workers', option: '',
    },
  ];
  // The loop, in the order the second subtitle reads it (name: its words in the subtitle)
  const STEPS = [
    { name: 'Change one setting', label: 'Change one setting' },
    { name: 'watch the signals', label: 'Watch the signals' },
    { name: 'next bottleneck', label: 'Next bottleneck' },
  ];
  const SUBS = [
    "A growing backlog often comes from one of four Worker limits: Slots, Pollers, cache or CPU.",
    "Change one setting at a time, watch the signals, then look for the next bottleneck.",
  ];
  // Seconds after its subtitle starts when it reads `name`: 16 characters per second, plus 0.3 s, as useCaseScene
  const namedAt = (text, name) => text.indexOf(name) / 16 + 0.3;

  // Final stage coordinates (no shift), every size even, on the theme's grid (GRID). The composition spans
  // y 150..880, the whole content frame: the column headings and the 5 rows (y 150..754, see RECAP), then the loop a
  // zone gap under them: its pills (y 794..844) and the arrow back, which runs 36 px under them (y 880).
  // Column lefts, from the rows' outer left edge: 32 px of padding on either side of the rows (RECAP.partLeft), the
  // symptoms 40 px right of the parts, then equal gaps (96 px) after the widest symptom (324 px) and the widest
  // signal (528 px), measured; the widest fix (453 px) ends 32 px inside the rows' right edge
  const COL = { symptom: 150, signal: 570, fix: 1194 };
  const LOOP = { top: recapRowY(ROWS.length - 1) + RECAP.rowH / 2 + GRID.zone, w: 360, h: 50, xs: [460, 960, 1460] };
  LOOP.backY = LOOP.top + LOOP.h + 36;
  // The symptom row stands apart: a gradient border, a glow (FRAME), a light violet tint and a WATCH FIRST
  // badge, a violet pill as chapter 1's x10 tag in 16 px type, w x h px, astride its top border, its right edge on the
  // row's inner padding line (GRID.pad), whole pixels; small enough to end 20 px clear of the fix under it (measured)
  const BADGE = { text: 'Watch first', w: 148, h: 32 };
  BADGE.x = RECAP.left + RECAP.w - GRID.pad - BADGE.w / 2;
  // Its frame: a border `border` px wide in the brand gradient, violet to UV from left to right, over the row's own
  // border, and under the row a soft violet glow, blur px wide and spread px out, at alpha; both show over `in` s once
  // the row has its full width. When the subtitle names the row, the glow swells to swellAlpha over swellUp s and eases
  // back over swellDown s, in place of the UV border of the other rows.
  const FRAME = { border: 2, blur: 28, spread: 2, alpha: 0.35, swellAlpha: 0.6, in: 0.4, swellUp: 0.3, swellDown: 0.8 };
  // The symptom row's background: the tile's surface under a light violet tint
  const SYMPTOM_BACKGROUND = `linear-gradient(rgba(${RGB.violet},.06), rgba(${RGB.violet},.06)), var(--surface)`;
  const rowTop = i => recapRowY(i) - RECAP.rowH / 2;
  // Each row grows from its part, from GROW.at + i * GROW.stagger over GROW.d s: a tile around the part (partLeft px
  // on either side) that widens to the row's full width
  const GROW = { at: 0.3, stagger: 0.15, d: 0.8, fromW: 2 * RECAP.partLeft + RECAP_PART.w };
  // The move into the outro, from OUT.lead s before the end: the rows slide out to the right in turn, away from the
  // Slot grid part (GROWING), then the loop's pills down, OUT.stagger s apart, each over OUT.leave s; from OUT.growAt s
  // into the move, once the rows are nearly gone, that part grows into the outro's mini Worker over OUT.grow s
  const OUT = { lead: 2.2, leave: 0.45, stagger: 0.08, rowDx: 200, loopDy: 40, growAt: 0.35, grow: 1.3 };
  const GROWING = RECAP_PARTS.indexOf('slots');

  // A cell of a row, at x from the row's outer left edge, as high as the row, its content centered vertically on
  // whole pixels; its parts sit on one baseline, 12 px apart
  const cell = (x, html, css = '', h = RECAP.rowH) => `<div style="position:absolute;left:${x - TILE_BORDER}px;`
    + `top:-${TILE_BORDER}px;height:${h}px;display:flex;align-items:center;white-space:nowrap;${css}">`
    + `<div style="display:flex;align-items:baseline;gap:12px">${html}</div></div>`;
  // 24 px lines, so that the symptom's 3 metrics fit its row with room to spare
  const metricCss = 'font-family:Mono;font-size:20px;line-height:24px';

  // A row of the table, after its part (see makeRecapPart): the symptom, the signal (its metrics in mono, one per line,
  // each followed by its reading in red; plain words as the symptom) and the fix (the Worker option under it, in slate
  // mono)
  const makeRow = (root, row) => {
    const textCss = 'font-size:28px;line-height:36px';
    const metricLine = ([metric, reading]) => '<div style="display:flex;align-items:baseline;gap:12px">'
      + `<span>${metric}</span><span style="color:${C.red}">${reading}</span></div>`;
    const signal = row.metrics
      ? cell(COL.signal, `<div>${row.metrics.map(metricLine).join('')}</div>`, metricCss)
      : cell(COL.signal, row.signalText, textCss);
    const option = row.option
      ? `<div class="mono" style="font-size:18px;line-height:28px;color:${C.slate}">${row.option}</div>`
      : '';
    return E(root,
      cell(COL.symptom, row.symptom, textCss) + signal + cell(COL.fix, `<div>${row.fix}${option}</div>`, textCss),
      'tile', { height: RECAP.rowH + 'px', textAlign: 'left' });
  };

  scene({
    chapter: 7, title: 'Read the signals',
    pre: 1.5, post: 2.0,
    // hard cuts on both ends: chapter 6 ends on this chapter's first frame, the outro starts on its last one
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the whole table and loop, then plays the move into the outro and the cut in one go; the
    // header leaves as the move starts
    holdBeforeEnd: OUT.lead + 0.1,
    headerOutAt: (c, dur) => dur - OUT.lead,
    subs: [
      // the last row is lit until c[0] + 6.9, then the table holds to the end of this pause
      { text: SUBS[0], after: 1.5 },
      // the arrow back closes the loop at c[1] + 5.6; the whole loop holds to the end of this pause, then the move
      { text: SUBS[1], after: 2.0 },
    ],
    build(root, s) {
      const heading = (text, col) => E(root, text, 'lbl', {
        left: (RECAP.left + col) + 'px', top: RECAP.headTop + 'px', fontSize: '18px', lineHeight: '24px',
        paddingLeft: '0',
      });
      s.headings = [heading('Symptom', COL.symptom), heading('Signal', COL.signal), heading('Fix', COL.fix)];
      // the symptom row's glow, under the rows: an empty box of the row's full size whose outer shadow shows round
      // the row, so it follows neither the row's width while it grows nor its fade-in
      const rowBox = { width: RECAP.w + 'px', height: RECAP.rowH + 'px', borderRadius: 'var(--r)' };
      s.glow = E(root, '', '', rowBox);
      s.rows = ROWS.map(row => makeRow(root, row));
      s.rows[0].style.background = SYMPTOM_BACKGROUND;
      // ... and its gradient border, over the row: a gradient box masked down to its padding ring
      s.border = E(root, '', '', {
        ...rowBox, padding: FRAME.border + 'px', background: `linear-gradient(90deg, ${C.violet}, ${C.uv})`,
        mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
      });
      s.badge = fixedTag(root, BADGE.text, 'violet solid', BADGE.w, { h: BADGE.h });
      // smaller than a pill, with less padding: it stands on the row's border, as the x10 tag
      Object.assign(s.badge.style, { fontSize: '16px', lineHeight: '22px', padding: '4px 10px 4px calc(10px + .1em)' });
      // the parts above their rows, which grow from them; the parts are there from the start, as chapter 6 leaves them
      s.parts = ROWS.map((row, i) => makeRecapPart(root, i));
      s.svg = svgLayer(root);
      const { top, w, h, xs, backY } = LOOP;
      const mid = top + h / 2;
      // an arrow from each pill to the next, 16 px clear of both
      s.arrows = xs.slice(1).map((x, i) => path(s.svg, `M ${xs[i] + w / 2 + 16} ${mid} L ${x - w / 2 - 16} ${mid}`,
        C.violet, 3));
      // the arrow back: down from the last pill, under the loop and up into the first one, 16 px clear of both as the
      // arrows between them, its corners rounded
      const first = xs[0], last = xs[xs.length - 1], r = 14;
      s.back = path(s.svg,
        `M ${last} ${top + h + 16} L ${last} ${backY - r} Q ${last} ${backY} ${last - r} ${backY} `
        + `L ${first + r} ${backY} Q ${first} ${backY} ${first} ${backY - r} L ${first} ${top + h + 16}`,
        C.violet, 3);
      s.steps = STEPS.map(step => fixedTag(root, step.label, '', w));
      s.worker = makeOutroWorker(root);
    },
    update(t, c, s) {
      const outAt = this.dur - OUT.lead;
      // the move into the outro: the rows slide out in turn, the first one from outAt, then the loop's pills
      const rowOut = i => P(t, outAt + i * OUT.stagger, OUT.leave, easeIn);
      const loopOut = i => P(t, outAt + (ROWS.length + i) * OUT.stagger, OUT.leave, easeIn);

      // the rows grow from their parts, 0.15 s apart, then the headings show; each row lights up as the first
      // subtitle names it, the symptom then its causes, until the next one is named (the last one for 1.2 s)
      const headO = P(t, GROW.at + 0.6, 0.4) * (1 - rowOut(0));
      s.headings.forEach(e => { e.style.opacity = headO; });
      const litAt = ROWS.map(row => c[0] + namedAt(SUBS[0], row.name));
      s.rows.forEach((e, i) => {
        const growAt = GROW.at + i * GROW.stagger;
        const grow = P(t, growAt, GROW.d);
        const out = rowOut(i);
        const dx = Math.round(OUT.rowDx * out);
        e.style.width = Math.round(lerp(GROW.fromW, RECAP.w, grow)) + 'px';
        // the tile clips its cells while it grows
        e.style.overflow = grow < 1 ? 'hidden' : '';
        showAt(e, RECAP.left + dx, rowTop(i), P(t, growAt, 0.25, linear) * (1 - out));
        const litUntil = i + 1 < litAt.length ? litAt[i + 1] : litAt[i] + 1.2;
        // the symptom row's glow swells instead (below)
        const lit = i > 0 && t >= litAt[i] && t < litUntil;
        e.style.borderColor = lit ? C.uv : C.line;
        // the Slot grid part grows into the outro's Worker (below); the others leave with their rows
        if (i !== GROWING) showRecapPart(s.parts[i], i, 1 - out, { dx });
      });
      // the symptom row's frame shows once the row has its full width, its glow swells as the row is named, and both
      // slide out with the row, on the same pixels
      const frameOut = rowOut(0);
      const frameO = P(t, GROW.at + GROW.d, FRAME.in) * (1 - frameOut);
      const frameX = RECAP.left + Math.round(OUT.rowDx * frameOut);
      const swell = P(t, litAt[0], FRAME.swellUp) * (1 - P(t, litAt[0] + FRAME.swellUp, FRAME.swellDown));
      const alpha = lerp(FRAME.alpha, FRAME.swellAlpha, swell);
      s.glow.style.boxShadow = `0 0 ${FRAME.blur}px ${FRAME.spread}px rgba(${RGB.violet},${alpha.toFixed(3)})`;
      showAt(s.glow, frameX, rowTop(0), frameO);
      showAt(s.border, frameX, rowTop(0), frameO);
      // the badge pops in as the symptom row reaches its full width, and slides out with it
      const badgeIn = popIn(t, GROW.at + GROW.d - 0.2);
      const badgeOut = rowOut(0);
      place(s.badge, BADGE.x + Math.round(OUT.rowDx * badgeOut), rowTop(0), badgeIn.s, badgeIn.o * (1 - badgeOut));

      // the loop: each pill pops in, lit, as the second subtitle reads it, the arrow to it drawing just before; the
      // arrow back follows the last pill, and the first pill lights up again as it arrives. The pills slide down and
      // out in turn with the move, the arrows fading with the first one.
      const stepAt = STEPS.map(step => c[1] + namedAt(SUBS[1], step.name));
      const backAt = stepAt[stepAt.length - 1] + 0.6;
      const closedAt = backAt + 0.5;
      s.steps.forEach((e, i) => {
        const p = backPop(t, stepAt[i]);
        const out = loopOut(i);
        place(e, LOOP.xs[i], LOOP.top + LOOP.h / 2 + Math.round(OUT.loopDy * out), p.s, p.o * (1 - out));
        const litUntil = i + 1 < stepAt.length ? stepAt[i + 1] : backAt;
        const lit = (t >= stepAt[i] && t < litUntil) || (i === 0 && t >= closedAt && t < closedAt + 1.2);
        e.style.borderColor = lit ? C.uv : C.lineLight;
      });
      const arrowsO = 1 - loopOut(0);
      s.arrows.forEach((arrow, i) => draw(arrow, P(t, stepAt[i + 1] - 0.35, 0.35), arrowsO));
      draw(s.back, P(t, backAt, 0.5), arrowsO);

      // the Slot grid part grows into the outro's mini Worker, at its place in the outro (with the outro's shift):
      // the Worker grows from the part's width, the part fading out under it as it fades in
      const growAt = outAt + OUT.growAt;
      const m = P(t, growAt, OUT.grow);
      const [partX, partY] = recapPartCenter(GROWING);
      const x = lerp(partX, OUTRO_WORKER.x + OUTRO_SHIFT[0], m), y = lerp(partY, OUTRO_WORKER.y + OUTRO_SHIFT[1], m);
      const fromScale = RECAP_PART.w / s.worker.w;
      const scale = lerp(fromScale, 1, m);
      const crossFade = P(t, growAt, 0.3, linear);
      setOutroWorker(s.worker);
      place(s.worker, x, y, scale, crossFade);
      showRecapPart(s.parts[GROWING], GROWING, 1 - crossFade, {
        dx: Math.round(x - partX), dy: Math.round(y - partY), s: scale / fromScale,
      });
    },
  });
}
