// ===================== 7. READ THE SIGNALS
// The recap: a table of the four causes of a growing backlog, one row each, under the headings SYMPTOM, SIGNAL and
// FIX. Each row starts with a small part of the Worker diagram (a full Slot grid, a Poller, a cache cell, a full CPU
// meter) and lights up as the subtitle names its cause. Under the table, the tuning loop draws in as the second
// subtitle reads it: CHANGE ONE SETTING, WATCH THE SIGNALS, NEXT BOTTLENECK, and an arrow back to the start.
// The block keeps every name declared in this file local to this scene.
{
  // The four causes, in the order the first subtitle names them (name: its words in the subtitle). The signal: an SDK
  // metric (named without the temporal_ prefix, as in the docs headings) and its reading, or plain words (signalText)
  // in the text font; the fix: what to change, and the Worker option that does it.
  const ROWS = [
    {
      name: 'full Slots', part: 'slots', symptom: 'Slots full, CPU low',
      metric: 'worker_task_slots_available', reading: 'at 0',
      fix: 'More Slots', option: 'maxConcurrentActivityTaskExecutions',
    },
    {
      name: 'slow Pollers', part: 'poller', symptom: 'Slots free, long wait',
      metric: 'activity_schedule_to_start_latency', reading: 'high',
      fix: 'Poller Autoscaling', option: 'activityTaskPollerBehavior',
    },
    {
      name: 'a small cache', part: 'cache', symptom: 'Evictions, replays',
      metric: 'sticky_cache_total_forced_eviction', reading: 'rising',
      fix: 'More memory, larger cache', option: 'maxCachedWorkflows',
    },
    {
      name: 'full CPU', part: 'cpu', symptom: 'CPU at 100%',
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
  // y 196..836, centered on y 515: the column headings (24 px high, a label gap above the rows), 4 rows of 104 px a
  // gutter apart (y 232..708), then the loop a zone gap under them: its pills (y 748..798) and the arrow back, which
  // runs 36 px under them.
  const TABLE = { left: 120, w: 1680, headTop: 196, rowH: 104 };
  TABLE.rowTop = TABLE.headTop + 24 + GRID.label;
  TABLE.pitch = TABLE.rowH + GRID.gutter;
  // Column lefts, from the rows' outer left edge: 32 px of padding on either side of the rows, the symptoms 40 px
  // right of the parts, then equal gaps (100 px) after the widest symptom (248 px) and the widest signal (492 px),
  // measured; the widest fix ends 32 px inside the rows' right edge
  const COL = { part: 32, symptom: 150, signal: 498, fix: 1090 };
  // The part drawn at the start of each row: 78 x 34 px
  const PART = { w: 78, h: 34 };
  const LOOP = { top: TABLE.rowTop + 3 * TABLE.pitch + TABLE.rowH + GRID.zone, w: 360, h: 50, xs: [460, 960, 1460] };
  LOOP.backY = LOOP.top + LOOP.h + 36;
  const rowY = i => TABLE.rowTop + TABLE.rowH / 2 + i * TABLE.pitch;

  // The offset of a row's content from its outer edge: Chromium draws the 1.5 px border of a tile 1 px wide
  const BORDER = 1;
  // A cell of a row, at x from the row's outer left edge, as high as the row, its content centered vertically on
  // whole pixels; its parts sit on one baseline, 12 px apart
  const cell = (x, html, css = '') => `<div style="position:absolute;left:${x - BORDER}px;top:-${BORDER}px;`
    + `height:${TABLE.rowH}px;display:flex;align-items:center;white-space:nowrap;${css}">`
    + `<div style="display:flex;align-items:baseline;gap:12px">${html}</div></div>`;

  // The small parts of the Worker diagram, each in a PART box: callbacks to the chapters of each cause
  // - a full Slot grid: 3 x 2 busy Slots
  function makeSlotsPart(box) {
    for (let i = 0; i < 6; i++) {
      const slot = makeSlot(box, 22, 14, {
        left: (i % 3) * 28 + 'px', top: Math.floor(i / 3) * 20 + 'px', borderRadius: '3px', opacity: 1,
      });
      Object.assign(slot.style, SLOT_LOOKS.busy);
    }
  }
  // - a Poller with its poll line, whose dashes flow from the queue into the Poller (see update)
  function makePollerPart(box) {
    box.insertAdjacentHTML('beforeend',
      `<svg width="${PART.w}" height="${PART.h}" style="position:absolute;left:0;top:0">`
      + `<path d="M 2 17 L 52 17" stroke="${C.violet}" stroke-width="2" stroke-linecap="round"`
      + ' stroke-dasharray="5,7"/></svg>');
    box.line = box.querySelector('path');
    E(box, '', '', {
      left: '56px', top: '6px', width: '22px', height: '22px', borderRadius: '50%',
      border: '2px solid ' + C.violet, background: 'var(--surface)', opacity: 1,
    });
  }
  // - a WORKFLOW CACHE cell holding an order, of the diagram's size
  function makeCachePart(box) {
    const { w, h } = DIAGRAM.cache;
    const slot = makeSlot(box, w, h, {
      left: (PART.w - w) / 2 + 'px', top: (PART.h - h) / 2 + 'px', fontFamily: 'Mono', fontSize: '16px',
      borderColor: C.uv, background: `rgba(${RGB.uv},.22)`, opacity: 1,
    });
    slot.textContent = '#1042';
  }
  // - a full CPU meter: its value over a red bar
  function makeCpuPart(box) {
    E(box, '100%', 'mono', {
      right: '0', left: 'auto', top: '-2px', fontSize: '16px', lineHeight: '18px', color: C.red, opacity: 1,
    });
    E(box, '', '', {
      top: '20px', width: PART.w + 'px', height: '14px', borderRadius: '3px', background: C.red, opacity: 1,
    });
  }
  const PART_MAKERS = { slots: makeSlotsPart, poller: makePollerPart, cache: makeCachePart, cpu: makeCpuPart };

  // A row of the table: its part, then the symptom, the signal (metric in mono, its reading in red; plain words as the
  // symptom) and the fix (the Worker option after it, in slate mono)
  function makeRow(root, row) {
    const textCss = 'font-size:28px;line-height:36px';
    const reading = row.reading ? `<span style="color:${C.red}">${row.reading}</span>` : '';
    const signal = row.metric
      ? cell(COL.signal, `<span>${row.metric}</span>${reading}`, 'font-family:Mono;font-size:20px;line-height:28px')
      : cell(COL.signal, row.signalText, textCss);
    const option = row.option
      ? `<span class="mono" style="font-size:18px;line-height:28px;color:${C.slate}">${row.option}</span>`
      : '';
    const e = E(root,
      cell(COL.symptom, row.symptom, textCss) + signal + cell(COL.fix, `<span>${row.fix}</span>${option}`, textCss),
      'tile', { width: TABLE.w + 'px', height: TABLE.rowH + 'px', textAlign: 'left' });
    e.partBox = E(e, '', '', {
      left: (COL.part - BORDER) + 'px', top: ((TABLE.rowH - PART.h) / 2 - BORDER) + 'px',
      width: PART.w + 'px', height: PART.h + 'px', opacity: 1,
    });
    PART_MAKERS[row.part](e.partBox);
    return e;
  }

  scene({
    chapter: 7, title: 'Read the signals',
    pre: 1.5, post: 2.0,
    subs: [
      // the last row is lit until c[0] + 6.9, then the table holds to the end of this pause
      { text: SUBS[0], after: 1.5 },
      // the arrow back closes the loop at c[1] + 5.6; the whole loop holds to the end of this pause, then the fade
      { text: SUBS[1], after: 2.0 },
    ],
    build(root, s) {
      const heading = (text, col) => E(root, text, 'lbl', {
        left: (TABLE.left + col) + 'px', top: TABLE.headTop + 'px', fontSize: '18px', lineHeight: '24px',
        paddingLeft: '0',
      });
      s.headings = [heading('Symptom', COL.symptom), heading('Signal', COL.signal), heading('Fix', COL.fix)];
      s.rows = ROWS.map(row => makeRow(root, row));
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
    },
    update(t, c, s) {
      // the headings and the rows rise in, 0.25 s apart; each row lights up as the first subtitle names its cause,
      // until the next one is named (the last one for 1.2 s)
      const headO = P(t, c[0] + 0.2, 0.4);
      s.headings.forEach(e => { e.style.opacity = headO; });
      const litAt = ROWS.map(row => c[0] + namedAt(SUBS[0], row.name));
      s.rows.forEach((e, i) => {
        rise(e, TABLE.left + TABLE.w / 2, rowY(i), P(t, c[0] + 0.2 + i * 0.25, 0.4), 16);
        const litUntil = i + 1 < litAt.length ? litAt[i + 1] : litAt[i] + 1.2;
        e.style.borderColor = t >= litAt[i] && t < litUntil ? C.uv : C.line;
      });
      // the poll line of the Poller part flows on the ambient clock, as in the diagram
      s.rows[1].partBox.line.setAttribute('stroke-dashoffset', -G * 40);

      // the loop: each pill pops in, lit, as the second subtitle reads it, the arrow to it drawing just before; the
      // arrow back follows the last pill, and the first pill lights up again as it arrives
      const stepAt = STEPS.map(step => c[1] + namedAt(SUBS[1], step.name));
      const backAt = stepAt[stepAt.length - 1] + 0.6;
      const closedAt = backAt + 0.5;
      s.steps.forEach((e, i) => {
        const p = backPop(t, stepAt[i]);
        place(e, LOOP.xs[i], LOOP.top + LOOP.h / 2, p.s, p.o);
        const litUntil = i + 1 < stepAt.length ? stepAt[i + 1] : backAt;
        const lit = (t >= stepAt[i] && t < litUntil) || (i === 0 && t >= closedAt && t < closedAt + 1.2);
        e.style.borderColor = lit ? C.uv : C.lineLight;
      });
      s.arrows.forEach((arrow, i) => draw(arrow, P(t, stepAt[i + 1] - 0.35, 0.35)));
      draw(s.back, P(t, backAt, 0.5));
    },
  });
}
