// ===================== 7. READ THE SIGNALS
// The recap: a table of the four causes of a growing backlog, one row each, under the headings SYMPTOM, SIGNAL and
// FIX. Starts on chapter 6's last frame (a hard cut): the small parts of the Worker diagram that start the rows (a full
// Slot grid, a Poller, a cache cell, a full CPU meter, see RECAP), into which chapter 6 shrinks its bottleneck
// components; each row grows from its part, and lights up as the subtitle names its cause. Under the table, the
// tuning loop draws in as the second subtitle reads it: CHANGE ONE SETTING, WATCH THE SIGNALS, NEXT BOTTLENECK, and an
// arrow back to the start. Last, the rows and the loop leave in turn while the Slot grid part grows into the outro's
// mini Worker: the outro starts on this chapter's last frame (another hard cut).
// The block keeps every name declared in this file local to this scene.
{
  // The four causes, in the order the first subtitle names them (name: its words in the subtitle), each row starting
  // with its part (RECAP_PARTS, in the same order). The signal: an SDK metric (named without the temporal_ prefix, as
  // in the docs headings) and its reading, or plain words (signalText) in the text font; the fix: what to change, and
  // the Worker option that does it.
  const ROWS = [
    {
      name: 'full Slots', symptom: 'Slots full, CPU low',
      metric: 'worker_task_slots_available', reading: 'at 0',
      fix: 'More Slots', option: 'maxConcurrentActivityTaskExecutions',
    },
    {
      name: 'slow Pollers', symptom: 'Slots free, long wait',
      metric: 'activity_schedule_to_start_latency', reading: 'high',
      fix: 'Poller Autoscaling', option: 'activityTaskPollerBehavior',
    },
    {
      name: 'a small cache', symptom: 'Evictions, replays',
      metric: 'sticky_cache_total_forced_eviction', reading: 'rising',
      fix: 'More memory, larger cache', option: 'maxCachedWorkflows',
    },
    {
      name: 'full CPU', symptom: 'CPU at 100%',
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
    "A growing backlog has four common causes: full Slots, slow Pollers, a small cache or a full CPU.",
    "Change one setting at a time, watch the signals, then look for the next bottleneck.",
  ];
  // Seconds after its subtitle starts when it reads `name`: 16 characters per second, plus 0.3 s, as useCaseScene
  const namedAt = (text, name) => text.indexOf(name) / 16 + 0.3;

  // Final stage coordinates (no shift), every size even, on the theme's grid (GRID). The composition spans
  // y 196..836, centered on y 515: the column headings and the 4 rows (y 232..708, see RECAP), then the loop a zone
  // gap under them: its pills (y 748..798) and the arrow back, which runs 36 px under them.
  // Column lefts, from the rows' outer left edge: 32 px of padding on either side of the rows (RECAP.partLeft), the
  // symptoms 40 px right of the parts, then equal gaps (100 px) after the widest symptom (248 px) and the widest
  // signal (492 px), measured; the widest fix ends 32 px inside the rows' right edge
  const COL = { symptom: 150, signal: 498, fix: 1090 };
  const LOOP = { top: RECAP.rowTop + 3 * RECAP.pitch + RECAP.rowH + GRID.zone, w: 360, h: 50, xs: [460, 960, 1460] };
  LOOP.backY = LOOP.top + LOOP.h + 36;
  const rowTop = i => recapRowY(i) - RECAP.rowH / 2;
  // Each row grows from its part, from GROW.at + i * GROW.stagger over GROW.d s: a tile around the part (partLeft px
  // on either side) that widens to the row's full width
  const GROW = { at: 0.3, stagger: 0.15, d: 0.8, fromW: 2 * RECAP.partLeft + RECAP_PART.w };
  // The move into the outro, from OUT.lead s before the end: the rows slide out to the right in turn, away from the
  // first row's part, then the loop's pills down, OUT.stagger s apart, each over OUT.leave s; from OUT.growAt s into
  // the move, once the rows are nearly gone, that part grows into the outro's mini Worker over OUT.grow s
  const OUT = { lead: 2.2, leave: 0.45, stagger: 0.08, rowDx: 200, loopDy: 40, growAt: 0.35, grow: 1.3 };

  // The offset of a row's content from its outer edge: Chromium draws the 1.5 px border of a tile 1 px wide
  const BORDER = 1;
  // A cell of a row, at x from the row's outer left edge, as high as the row, its content centered vertically on
  // whole pixels; its parts sit on one baseline, 12 px apart
  const cell = (x, html, css = '') => `<div style="position:absolute;left:${x - BORDER}px;top:-${BORDER}px;`
    + `height:${RECAP.rowH}px;display:flex;align-items:center;white-space:nowrap;${css}">`
    + `<div style="display:flex;align-items:baseline;gap:12px">${html}</div></div>`;

  // A row of the table, after its part (see makeRecapPart): the symptom, the signal (metric in mono, its reading in
  // red; plain words as the symptom) and the fix (the Worker option after it, in slate mono)
  function makeRow(root, row) {
    const textCss = 'font-size:28px;line-height:36px';
    const reading = row.reading ? `<span style="color:${C.red}">${row.reading}</span>` : '';
    const signal = row.metric
      ? cell(COL.signal, `<span>${row.metric}</span>${reading}`, 'font-family:Mono;font-size:20px;line-height:28px')
      : cell(COL.signal, row.signalText, textCss);
    const option = row.option
      ? `<span class="mono" style="font-size:18px;line-height:28px;color:${C.slate}">${row.option}</span>`
      : '';
    return E(root,
      cell(COL.symptom, row.symptom, textCss) + signal + cell(COL.fix, `<span>${row.fix}</span>${option}`, textCss),
      'tile', { height: RECAP.rowH + 'px', textAlign: 'left' });
  }

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
      s.rows = ROWS.map(row => makeRow(root, row));
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
      // subtitle names its cause, until the next one is named (the last one for 1.2 s)
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
        e.style.borderColor = t >= litAt[i] && t < litUntil ? C.uv : C.line;
        // the first row's part grows into the outro's Worker (below); the others leave with their rows
        if (i > 0) showRecapPart(s.parts[i], i, 1 - out, { dx });
      });

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
      const [partX, partY] = recapPartCenter(0);
      const x = lerp(partX, OUTRO_WORKER.x + OUTRO_SHIFT[0], m), y = lerp(partY, OUTRO_WORKER.y + OUTRO_SHIFT[1], m);
      const fromScale = RECAP_PART.w / s.worker.w;
      const scale = lerp(fromScale, 1, m);
      const crossFade = P(t, growAt, 0.3, linear);
      setOutroWorker(s.worker);
      place(s.worker, x, y, scale, crossFade);
      showRecapPart(s.parts[0], 0, 1 - crossFade, {
        dx: Math.round(x - partX), dy: Math.round(y - partY), s: scale / fromScale,
      });
    },
  });
}
