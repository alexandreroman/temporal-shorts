// ===================== 7. FULL VISIBILITY
// A stylized Temporal web UI window: the Workflows list (running, completed, failed), then the details page of
// order #1042 with its Activity timeline and the crash it survived, then order #1044 retrying shipPackage live
// until it completes.
// The block keeps every name declared in this file local to this scene.
{
  // Window: 1560 x 770, centered at (960, 522) (x 180..1740, y 137..907): a top bar (logo, namespace) and a
  // navigation rail frame the page area, where the pages swap like a navigation. Every part is laid out on whole
  // pixels inside its parent, so the text rests sharp.
  const WIN = { x: 960, y: 522, w: 1560, h: 770, bar: 64, rail: 76 };
  const PAGE = { w: WIN.w - WIN.rail, h: WIN.h - WIN.bar, pad: 48 }; // 1484 x 706
  const CONTENT_W = PAGE.w - 2 * PAGE.pad; // 1388: tables and cards span x 48..1436 of the page
  const PAGE_BG = '#151518', CHROME_BG = '#1E1E24', CARD_BG = 'var(--surface)';
  const RULE = 'rgba(58,65,80,.7)'; // thin rules inside cards (table rows, lanes)
  const LOGO_H = 28;

  // Workflows list: title row, then a table of 6 rows, most recent first
  const TABLE = { top: 114, headH: 48, rowH: 84 };
  const COL = { status: 32, id: 312, type: 724, start: 1096 }; // left edge of each column, from the table's left
  const LIST_ROWS = [
    { id: 'order-1045', status: 'running', start: '2026-10-05 14:06:48' },
    { id: 'order-1044', status: 'running', start: '2026-10-05 14:05:30' },
    { id: 'order-1043', status: 'completed', start: '2026-10-05 14:04:02' },
    { id: 'order-1042', status: 'completed', start: '2026-10-05 14:02:11' },
    { id: 'order-1041', status: 'failed', start: '2026-10-05 14:00:37' },
    { id: 'order-1040', status: 'completed', start: '2026-10-05 13:58:54' },
  ];
  const OPENED_ROW = LIST_ROWS.findIndex(row => row.id === 'order-1042');

  // Details page: breadcrumb, title and status, summary card, then the timeline card (and, for a running
  // Workflow, the pending Activity card beside it, both on the same top and bottom lines)
  const SUMMARY = { top: 136, h: 92 };
  // Timeline card: an axis in seconds (64 px per second on both pages), one 70 px lane per Activity, its label in
  // the 250 px column on the left; x(s) is the card x of second s
  const TL = { top: 260, h: 410, padX: 32, labelW: 250, pxPerS: 64, tickY: 70, gridTop: 100, laneTop: 104,
    laneH: 70, barH: 30 };
  const tlX = s => TL.padX + TL.labelW + s * TL.pxPerS;
  const laneTop = i => TL.laneTop + i * TL.laneH;
  const laneMid = i => laneTop(i) + TL.laneH / 2;
  const PENDING_GAP = 32;

  // Order #1042, as in chapter 6: Worker A crashes while shipPackage runs, the retry runs on Worker B
  const ORDER_1042 = {
    id: 'order-1042', status: 'completed', width: CONTENT_W, axisEnd: 15, tick: 3,
    workers: ['WORKER A', 'WORKER A', 'WORKER A, THEN B', 'WORKER B'],
    summary: { start: '2026-10-05 14:02:11', end: '2026-10-05 14:02:25', duration: '14.6s' },
    // [lane, from, to, outcome] in seconds; the failed attempt ends at the crash
    bars: [[0, 0.2, 1.4, 'completed'], [1, 1.5, 2.3, 'completed'], [2, 2.4, 4.0, 'failed'],
      [2, 11.9, 14.0, 'completed'], [3, 14.1, 14.5, 'completed']],
    crashAt: 4.0,
  };
  // Order #1044, running: shipPackage fails twice (Carrier timeout) and is retried after 1s, then 2s, as in
  // chapter 4; its card leaves room for the pending Activity card
  const ORDER_1044 = {
    id: 'order-1044', status: 'running', width: 1024, axisEnd: 10, tick: 2,
    workers: ['WORKER A', 'WORKER A', 'WORKER A', 'WORKER A'],
    summary: { start: '2026-10-05 14:05:30', end: 'In progress', duration: '2.3s' },
    bars: [[0, 0.1, 1.3, 'completed'], [1, 1.4, 2.2, 'completed'], [2, 2.3, 3.3, 'failed'],
      [2, 4.3, 5.3, 'failed'], [2, 7.3, 9.4, 'completed'], [3, 9.5, 9.9, 'completed']],
    waits: [[3.3, 4.3, '1s'], [5.3, 7.3, '2s']],
    attempts: [2.3, 4.3, 7.3], // start of each shipPackage attempt
    finishedAt: 10.0,
    endText: '2026-10-05 14:05:40',
  };
  // c[2] plays order #1044 live, in real time, from second 2.3 of its timeline (chargeCard and reserveItem done)
  // to its end
  const LIVE = { from: 2.3, rate: 1 }; // video seconds per timeline second

  const STATUS = {
    running: { label: 'Running', color: '#FFFFFF', bg: C.uv, edge: C.uv },
    completed: { label: 'Completed', color: C.neon, bg: 'rgba(219,255,75,.08)', edge: C.neon },
    failed: { label: 'Failed', color: C.red, bg: 'rgba(255,90,95,.12)', edge: C.red },
  };
  const BAR_STYLE = {
    completed: { bg: 'rgba(219,255,75,.16)', edge: C.neon },
    failed: { bg: 'rgba(255,90,95,.24)', edge: C.red },
    running: { bg: 'rgba(68,76,231,.6)', edge: C.uv },
  };

  // inline style of an absolutely positioned static part (plain div, no layer of its own)
  const at = (left, top) => `position:absolute;left:${left}px;top:${top}px;`;
  const label = (text, size = 15) =>
    `<span class="lbl" style="font-size:${size}px;padding-left:0">${text}</span>`;
  const ring = (size, color) => `<div style="width:${size}px;height:${size}px;border:${size > 16 ? 3 : 2.5}px solid `
    + `rgba(248,250,252,.25);border-top-color:${color};border-radius:50%"></div>`;
  // a layer of its own, positioned on whole pixels inside its parent and visible (update sets what changes)
  const part = (parent, html, css = {}, cls = '') => {
    const e = E(parent, html, cls, { transform: 'none', ...css });
    e.style.opacity = 1;
    return e;
  };

  // ---------- status badge: fixed size, so its edges stay put when the status changes
  const makeBadge = (parent, css = {}) => part(parent, '', {
    width: '176px', height: '38px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px',
    fontSize: '16px', letterSpacing: '.1em', textTransform: 'uppercase', borderRadius: 'var(--rs)',
    whiteSpace: 'nowrap', ...css,
  }, 'mono');
  // innerHTML only changes with the status, at native size (pop: see bumpAt)
  const setBadge = (badge, status, pop = 0) => {
    if (badge._status !== status) {
      badge._status = status;
      const st = STATUS[status];
      const icon = status === 'running' ? `<div class="spin">${ring(16, '#FFFFFF')}</div>`
        : ICON(status === 'completed' ? 'check' : 'x', 18, st.color, 2.6);
      badge.innerHTML = `${icon}<span>${st.label}</span>`;
      badge.style.color = st.color;
      badge.style.background = st.bg;
      badge.style.boxShadow = `inset 0 0 0 1.5px ${st.edge}`;
      badge.spin = badge.querySelector('.spin');
    }
    if (badge.spin) badge.spin.style.transform = `rotate(${G * 400}deg)`;
    badge.style.transform = `scale(${1 + 0.12 * pop})`;
  };

  // ---------- window chrome: top bar (logo, namespace) and navigation rail (Workflows active)
  const makeWindow = root => {
    const railIcons = ['list', 'clock', 'queue', 'gear'].map((icon, i) => {
      const active = i === 0;
      const box = active ? `background:rgba(68,76,231,.28);box-shadow:inset 0 0 0 1.5px ${C.uv};` : '';
      return `<div style="${at(14, 28 + i * 68)}width:48px;height:48px;border-radius:var(--rs);${box}`
        + `display:flex;align-items:center;justify-content:center">`
        + `${ICON(icon, 26, active ? C.ink : '#6B7486', 1.8)}</div>`;
    }).join('');
    return E(root,
      `<div style="${at(0, 0)}width:${WIN.w}px;height:${WIN.bar}px;background:${CHROME_BG};`
      + `border-bottom:1.5px solid ${C.line}">`
      + `<img src="${LOGO}" style="${at(28, (WIN.bar - LOGO_H) / 2)}height:${LOGO_H}px;display:block">`
      + `<div style="position:absolute;right:28px;top:13px;height:38px;display:flex;align-items:center;gap:14px">`
      + label('Namespace')
      + `<div class="mono" style="height:38px;display:flex;align-items:center;gap:10px;padding:0 12px 0 16px;`
      + `font-size:18px;border-radius:var(--rs);box-shadow:inset 0 0 0 1.5px ${C.line}">default`
      + `${ICON('chevron', 18, C.slate, 2)}</div></div></div>`
      + `<div style="${at(0, WIN.bar)}width:${WIN.rail}px;height:${PAGE.h}px;background:${CHROME_BG};`
      + `border-right:1.5px solid ${C.line}">${railIcons}`
      + `<div style="${at(14, PAGE.h - 72)}width:48px;height:48px;display:flex;align-items:center;`
      + `justify-content:center">${ICON('user', 26, '#6B7486', 1.8)}</div></div>`,
      '', {
        width: WIN.w + 'px', height: WIN.h + 'px', background: PAGE_BG, borderRadius: 'var(--r)', overflow: 'hidden',
      });
  };
  // the window's edge, drawn over its pages (a border on the window would shift its parts off whole pixels)
  const makeFrame = win => part(win, '', {
    width: WIN.w + 'px', height: WIN.h + 'px', borderRadius: 'var(--r)', boxShadow: `inset 0 0 0 1.5px ${C.line}`,
  });
  // a page of the window, under the top bar and right of the rail (hidden until update shows it)
  const makePage = win => E(win, '', '', {
    left: WIN.rail + 'px', top: WIN.bar + 'px', width: PAGE.w + 'px', height: PAGE.h + 'px',
  });
  // a dark card with a thin edge (inset shadow, so its parts keep whole-pixel offsets)
  const cardCss = (w, h) => `width:${w}px;height:${h}px;background:${CARD_BG};border-radius:var(--r);`
    + `box-shadow:inset 0 0 0 1.5px ${C.line};`;

  // ---------- Workflows list page
  const makeListPage = win => {
    const page = makePage(win);
    const tableH = TABLE.headH + LIST_ROWS.length * TABLE.rowH;
    const heads = Object.entries({ status: 'Status', id: 'Workflow ID', type: 'Type', start: 'Start' })
      .map(([col, text]) => `<div style="${at(COL[col], 0)}height:${TABLE.headH}px;display:flex;`
        + `align-items:center">${label(text)}</div>`).join('');
    page.innerHTML =
      `<div style="${at(PAGE.pad, 34)}height:48px;display:flex;align-items:center;gap:18px">`
      + '<span style="font-size:40px;line-height:48px">Workflows</span>'
      + `<span class="mono" style="font-size:18px;color:${C.slate};padding:4px 12px;border-radius:var(--rs);`
      + `box-shadow:inset 0 0 0 1.5px ${C.line}">${LIST_ROWS.length}</span></div>`
      + `<div class="mono" style="position:absolute;right:${PAGE.pad}px;top:34px;width:520px;height:48px;`
      + `display:flex;align-items:center;gap:12px;padding:0 18px;font-size:18px;color:${C.slate};`
      + `border-radius:var(--rs);box-shadow:inset 0 0 0 1.5px ${C.line}">${ICON('search', 20, C.slate, 2)}`
      + `<span>WorkflowType = <span style="color:${C.ink}">"placeOrder"</span></span></div>`
      + `<div class="table" style="${at(PAGE.pad, TABLE.top)}${cardCss(CONTENT_W, tableH)}">${heads}</div>`;
    const table = page.querySelector('.table');
    page.rows = LIST_ROWS.map((row, i) => {
      const cell = (col, html, css) => `<div style="${at(COL[col], 0)}height:${TABLE.rowH}px;display:flex;`
        + `align-items:center;${css}">${html}</div>`;
      const e = E(table,
        cell('id', `<span class="id">${row.id}</span>`, 'font-size:22px')
        + cell('type', 'placeOrder', `font-size:22px;color:#CBD5E1`)
        + cell('start', row.start, `font-size:20px;color:${C.slate}`),
        'mono', {
          left: '0', top: (TABLE.headH + i * TABLE.rowH) + 'px', width: CONTENT_W + 'px',
          height: TABLE.rowH + 'px', boxShadow: `inset 0 1px 0 ${RULE}`,
        });
      e.idCell = e.querySelector('.id');
      e.badge = makeBadge(e, { left: COL.status + 'px', top: (TABLE.rowH - 38) / 2 + 'px' });
      e.workflowStatus = row.status;
      return e;
    });
    return page;
  };

  // ---------- Workflow details page: breadcrumb, title + badge, summary, timeline (+ pending Activity card)
  const makeDetailsPage = (win, order) => {
    const page = makePage(win);
    const summaryFields = [
      ['Type', 'placeOrder', 132], ['Start', order.summary.start, 251], ['End', order.summary.end, 251],
      ['Duration', order.summary.duration, 87], ['Task queue', 'orders', 107],
    ].map(([name, value, w]) => `<div style="width:${w}px">${label(name)}`
      + `<div class="mono v" style="font-size:22px;margin-top:8px;white-space:nowrap">${value}</div></div>`).join('');
    page.innerHTML =
      `<div class="mono" style="${at(PAGE.pad, 26)}font-size:17px;color:${C.slate}">`
      + `Workflows<span style="padding:0 12px">/</span><span style="color:${C.ink}">${order.id}</span></div>`
      + `<div class="title" style="${at(PAGE.pad, 64)}height:48px;display:flex;align-items:center;gap:26px">`
      + `<span style="font-size:40px;line-height:48px">${order.id}</span></div>`
      + `<div class="summary" style="${at(PAGE.pad, SUMMARY.top)}${cardCss(CONTENT_W, SUMMARY.h)}display:flex;`
      + `align-items:center;justify-content:space-between;padding:0 ${TL.padX}px">${summaryFields}</div>`
      + `<div class="tl" style="${at(PAGE.pad, TL.top)}${cardCss(order.width, TL.h)}"></div>`;
    page.badge = makeBadge(page.querySelector('.title'), { position: 'relative' });
    const values = page.querySelectorAll('.summary .v');
    page.endV = values[2]; page.durationV = values[3];
    page.tl = makeTimeline(page.querySelector('.tl'), order);
    return page;
  };

  // Timeline card content: header with legend, axis ticks and grid, one lane per Activity, bars and labels
  const makeTimeline = (card, order) => {
    const w = order.width, gridH = laneTop(ORDER_STEPS.length) - TL.gridTop;
    const legend = [['completed', 'Completed'], ['failed', 'Failed'], ['running', 'Running']]
      .map(([kind, text]) => `<div style="display:flex;align-items:center;gap:8px"><i style="display:block;`
        + `width:14px;height:14px;border-radius:3px;background:${BAR_STYLE[kind].bg};`
        + `box-shadow:inset 0 0 0 1.5px ${BAR_STYLE[kind].edge}"></i>${label(text)}</div>`).join('');
    let html = `<div style="${at(TL.padX, 22)}height:24px;display:flex;align-items:center">`
      + `${label('Timeline', 16)}</div>`
      + `<div style="position:absolute;right:${TL.padX}px;top:22px;height:24px;display:flex;gap:24px">`
      + `${legend}</div>`
      + `<div style="${at(tlX(0), TL.gridTop)}width:${tlX(order.axisEnd) - tlX(0)}px;height:1.5px;`
      + `background:${C.line}"></div>`;
    for (let s = 0; s <= order.axisEnd; s += order.tick) {
      html += `<div class="mono" style="${at(tlX(s) - 30, TL.tickY - 9)}width:60px;text-align:center;font-size:15px;`
        + `line-height:18px;color:${C.slate}">${s}s</div>`
        + `<div style="${at(tlX(s), TL.gridTop)}width:1px;height:${gridH}px;background:${RULE}"></div>`;
    }
    ORDER_STEPS.forEach((step, i) => {
      if (i > 0) {
        html += `<div style="${at(TL.padX, laneTop(i))}width:${w - 2 * TL.padX}px;height:1px;`
          + `background:${RULE}"></div>`;
      }
      html += `<div class="mono" style="${at(TL.padX, laneTop(i) + 13)}font-size:22px;line-height:26px">`
        + `${step.fn}</div>`
        + `<div style="${at(TL.padX, laneTop(i) + 41)}line-height:18px">${label(order.workers[i])}</div>`;
    });
    card.innerHTML = html;
    const tl = { order };
    tl.bars = order.bars.map(([lane, from]) => part(card, '', {
      left: Math.round(tlX(from)) + 'px', top: (laneMid(lane) - TL.barH / 2) + 'px', height: TL.barH + 'px',
      borderRadius: '4px',
    }));
    tl.durations = order.bars.map(([lane, from, to]) => part(card, `${(to - from).toFixed(1)}s`, {
      // on the card color, so a grid line never crosses the text
      left: Math.round(tlX(to)) + 6 + 'px', top: (laneMid(lane) - 11) + 'px', fontSize: '17px', lineHeight: '22px',
      padding: '0 6px', background: CARD_BG,
    }, 'mono'));
    if (order.crashAt !== undefined) {
      const x = Math.round(tlX(order.crashAt));
      tl.crashLine = part(card, '', {
        left: (x - 1) + 'px', top: TL.gridTop + 'px', width: '0', borderLeft: `2px dashed ${C.red}`,
      });
      tl.crashLabel = part(card, 'Worker crashed', {
        left: (x + 14) + 'px', top: (laneMid(2) - 9) + 'px', color: C.red, fontSize: '15px', lineHeight: '18px',
      }, 'lbl');
      tl.crashH = gridH;
    }
    // waits between attempts: a thin line growing through the gap, its length knocked out of it in the middle
    tl.waits = (order.waits || []).map(([from, to, text]) => {
      const x0 = Math.round(tlX(from)) + 8, x1 = Math.round(tlX(to)) - 8;
      const line = part(card, '', { left: x0 + 'px', top: (laneMid(2) - 1) + 'px', height: '0',
        borderTop: '2px solid rgba(148,163,184,.55)' });
      line.len = x1 - x0;
      const note = part(card, text, {
        left: Math.round((x0 + x1) / 2 - 16) + 'px', top: (laneMid(2) - 10) + 'px', width: '32px',
        textAlign: 'center', fontSize: '16px', lineHeight: '20px', color: C.slate, background: CARD_BG,
      }, 'mono');
      return { from, to, line, note };
    });
    tl.spin = part(card, ring(18, C.violet));
    return tl;
  };
  // Draws the timeline at second `now` of the order's run: a bar shows the part of its attempt before `now`,
  // running (UV) until it ends; `grow(k)`, if given, overrides the shown fraction of bar k (replayed history)
  const setTimeline = (tl, now, grow = null) => {
    let running = null;
    tl.order.bars.forEach(([lane, from, to, outcome], k) => {
      const p = grow ? grow(k) : clamp((now - from) / (to - from));
      const kind = grow || now >= to ? outcome : 'running';
      const style = BAR_STYLE[kind];
      const bar = tl.bars[k];
      bar.style.width = Math.round(p * (tlX(to) - tlX(from))) + 'px';
      bar.style.background = style.bg;
      bar.style.boxShadow = `inset 0 0 0 1.5px ${style.edge}`;
      bar.style.opacity = p > 0 ? 1 : 0;
      if (!grow && p > 0 && p < 1) running = { lane, x: tlX(from) + p * (tlX(to) - tlX(from)) };
      tl.durations[k].style.opacity = outcome === 'completed' ? P(p, 0.98, 0.02) : 0;
    });
    tl.waits.forEach(wait => {
      const p = clamp((now - wait.from) / (wait.to - wait.from));
      wait.line.style.width = Math.round(p * wait.line.len) + 'px';
      wait.line.style.opacity = p > 0 ? 1 : 0;
      wait.note.style.opacity = p > 0 ? 1 : 0;
    });
    // running spinner, just past the growing end of the running bar
    tl.spin.style.opacity = running ? 1 : 0;
    if (running) tl.spin.style.transform = `translate(${Math.round(running.x) + 10}px,${laneMid(running.lane) - 9}px)`;
    tl.spin.firstChild.style.transform = `rotate(${G * 400}deg)`;
  };

  // ---------- pending Activity card (order #1044): shipPackage, its attempt count, last failure, retry policy
  const makePendingCard = (page, order) => {
    const left = PAGE.pad + order.width + PENDING_GAP, w = CONTENT_W - order.width - PENDING_GAP;
    const card = part(page,
      `<div style="${at(TL.padX, 22)}height:24px;display:flex;align-items:center">`
      + `${label('Pending activities', 16)}</div>`,
      { left: left + 'px', top: TL.top + 'px', width: w + 'px', height: TL.h + 'px', background: CARD_BG,
        borderRadius: 'var(--r)', boxShadow: `inset 0 0 0 1.5px ${C.line}` });
    card.spin = part(card, ring(18, C.violet), { left: (w - TL.padX - 24) + 'px', top: '23px' });
    const field = (top, name) => `<div style="${at(0, top)}line-height:18px">${label(name)}</div>`;
    card.info = part(card,
      `<div class="mono" style="${at(0, 0)}font-size:26px;line-height:32px">shipPackage</div>`
      + field(66, 'Attempt') + field(160, 'Last failure') + field(254, 'Retry policy')
      + `<div class="mono" style="${at(0, 280)}font-size:18px;line-height:24px;color:${C.slate}">`
      + 'exponential, unlimited</div>',
      { left: TL.padX + 'px', top: '76px', width: (w - 2 * TL.padX) + 'px', height: '304px' });
    card.attempt = part(card.info, '', { left: '0', top: '90px', fontSize: '30px', lineHeight: '36px',
      transformOrigin: 'left center' }, 'mono');
    card.failure = part(card.info, 'Carrier timeout', { left: '0', top: '186px', fontSize: '22px',
      lineHeight: '28px', color: C.red }, 'mono');
    card.none = part(card, 'None', { left: TL.padX + 'px', top: '76px', fontSize: '22px', lineHeight: '32px',
      color: C.slate }, 'mono');
    return card;
  };

  // ---------- mouse pointer (its tip at the top left corner of the element)
  const makePointer = win => E(win,
    '<svg width="30" height="36" viewBox="0 0 20 24" style="display:block"><path d="M2 2v17l4.5-4 3 7 3-1.3-2.9-6.7'
    + `h5.9z" fill="${C.ink}" stroke="#141414" stroke-width="1.4" stroke-linejoin="round"/></svg>`);

  scene({
    chapter: 7, title: 'Full visibility',
    // the window is laid out centered at (960, 522)
    shift: [0, 0],
    subs: [
      {
        text: "Temporal also shows every Workflow in its <b>web UI</b>: which ones are running, completed or failed.",
        after: 1.0,
      },
      {
        text: "Open order #1042: its timeline shows every Activity, how long it took, and the crash it survived.",
        after: 1.2,
      },
      {
        text: "While a Workflow runs, you see an Activity retrying, its attempt count and its last error, live.",
        after: 3.0,
      },
    ],
    build(root, s) {
      s.win = makeWindow(root);
      s.list = makeListPage(s.win);
      s.order1042 = makeDetailsPage(s.win, ORDER_1042);
      s.order1044 = makeDetailsPage(s.win, ORDER_1044);
      s.pending = makePendingCard(s.order1044, ORDER_1044);
      s.frame = makeFrame(s.win);
      s.pointer = makePointer(s.win);
    },
    update(t, c, s) {
      // the window fades in and rises onto whole pixels
      const wp = P(t, c[0] - 0.3, 0.5);
      place(s.win, WIN.x, WIN.y + Math.round((1 - wp) * 20), 1, wp);
      // pages swap like a navigation: the old page fades out, the new one fades in and rises 12 px
      const showPage = (page, inAt, outAt) => {
        const p = P(t, inAt, 0.35);
        page.style.opacity = p * (1 - P(t, outAt, 0.3));
        page.style.transform = `translateY(${Math.round((1 - p) * 12)}px)`;
        page.style.visibility = page.style.opacity > 0.001 ? 'visible' : 'hidden';
      };
      showPage(s.list, -Infinity, c[1]);
      showPage(s.order1042, c[1] + 0.25, c[2]);
      showPage(s.order1044, c[2] + 0.25, Infinity);

      // ---- c[0]: the rows come in quickly; each status badge bumps as the subtitle names it, then the pointer
      // hovers order-1042
      const named = { running: c[0] + 4.06, completed: c[0] + 4.63, failed: c[0] + 5.44 };
      const hover = P(t, c[0] + 6.2, 0.2);
      s.list.rows.forEach((row, i) => {
        const p = P(t, c[0] + 0.4 + i * 0.08, 0.35);
        row.style.opacity = p;
        row.style.transform = `translateY(${Math.round((1 - p) * 10)}px)`;
        setBadge(row.badge, row.workflowStatus, bumpAt(t, named[row.workflowStatus]));
        const hovered = i === OPENED_ROW ? hover : 0;
        row.style.background = `rgba(68,76,231,${(0.16 * hovered).toFixed(3)})`;
        row.idCell.style.textDecoration = hovered > 0.5 ? 'underline' : 'none';
      });
      // pointer: glides from the lower right of the table onto the order-1042 ID, clicks it at c[1]
      const rowY = WIN.bar + TABLE.top + TABLE.headH + (OPENED_ROW + 0.5) * TABLE.rowH;
      const idX = WIN.rail + PAGE.pad + COL.id;
      const glide = P(t, c[0] + 5.7, 0.6);
      const px = Math.round(lerp(idX + 520, idX + 84, glide)), py = Math.round(lerp(rowY + 170, rowY + 2, glide));
      s.pointer.style.transform = `translate(${px - 3}px,${py - 3}px)`;
      s.pointer.style.opacity = P(t, c[0] + 5.6, 0.2) * (1 - P(t, c[1] + 0.1, 0.25));

      // ---- c[1]: order-1042: the bars grow in time order on "every Activity" (each duration shows as its bar
      // ends), the crash marker on "the crash it survived"
      const p42 = s.order1042;
      setBadge(p42.badge, 'completed');
      setTimeline(p42.tl, 0, k => P(t, c[1] + 2.0 + k * 0.45, 0.45));
      const crash = c[1] + 4.9;
      p42.tl.crashLine.style.height = Math.round(P(t, crash, 0.3) * p42.tl.crashH) + 'px';
      p42.tl.crashLine.style.opacity = t >= crash ? 1 : 0;
      p42.tl.crashLabel.style.opacity = P(t, crash + 0.2, 0.25);

      // ---- c[2]: order-1044 live: shipPackage fails twice, waits 1s then 2s, attempt 3 succeeds, then
      // emailReceipt runs and the Workflow completes
      const o44 = ORDER_1044, p44 = s.order1044, pending = s.pending;
      const liveAt = c[2] + 0.7;
      const videoAt = sec => liveAt + (sec - LIVE.from) * LIVE.rate; // video time of second `sec` of the run
      const now = clamp(LIVE.from + (t - liveAt) / LIVE.rate, LIVE.from, o44.finishedAt);
      setTimeline(p44.tl, now);
      const finished = t >= videoAt(o44.finishedAt);
      setBadge(p44.badge, finished ? 'completed' : 'running', bumpAt(t, videoAt(o44.finishedAt)));
      p44.durationV.textContent = now.toFixed(1) + 's';
      p44.endV.textContent = finished ? o44.endText : o44.summary.end;
      p44.endV.style.color = finished ? C.ink : C.slate;
      // pending card: the attempt count steps up (and bumps) with each retry, the last failure shows after the
      // first one; once attempt 3 succeeds, the card is left with no pending Activity
      const attempt = o44.attempts.filter(a => now >= a).length;
      const lastRetry = o44.attempts.findLast(a => now >= a);
      pending.attempt.textContent = String(attempt);
      pending.attempt.style.transform = `scale(${1 + 0.14 * (attempt > 1 ? bumpAt(t, videoAt(lastRetry)) : 0)})`;
      pending.failure.style.opacity = P(t, videoAt(o44.bars[2][2]), 0.25);
      const shipped = videoAt(o44.bars[4][2]);
      pending.info.style.opacity = 1 - P(t, shipped + 0.2, 0.3);
      pending.none.style.opacity = P(t, shipped + 0.5, 0.3);
      pending.spin.style.opacity = 1 - P(t, shipped, 0.2);
      pending.spin.firstChild.style.transform = `rotate(${G * 400}deg)`;
    }
  });
}
