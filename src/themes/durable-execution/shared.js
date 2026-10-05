// ===================== Introduction to Durable Execution helpers (shared by the scenes of this theme)

// ---------- extra icons (stroke, 24 grid, same style as ICONS in engine.js)
Object.assign(ICONS, {
  card: '<rect x="2.5" y="5" width="19" height="14"/><path d="M2.5 9.5h19M6 15h5"/>',
  box: '<path d="M12 3l8.5 4.5v9L12 21l-8.5-4.5v-9z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9M7.8 5.3l8.5 4.5"/>',
  truck: '<path d="M14 18V5H2v13h3M9 18h6M19 18h3v-5l-4-5h-4"/><circle cx="7" cy="18" r="2"/>'
    + '<circle cx="17" cy="18" r="2"/>',
  bag: '<path d="M4.5 8h15l-1 13h-13z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2.5"/>',
  bug: '<path d="M8 10h8v5a4 4 0 0 1-8 0z"/><path d="M9.5 10V9a2.5 2.5 0 0 1 5 0v1M12 13v6"/>'
    + '<path d="M3 14h5M16 14h5M4 9l4 2M20 9l-4 2M4.5 20l3.8-2.2M19.5 20l-3.8-2.2"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/>',
  plug: '<path d="M9 3v4M15 3v4M6 7h12v3a6 6 0 0 1-12 0zM12 16v5"/>',
  table: '<rect x="3" y="4" width="18" height="16"/><path d="M3 9h18M3 14.5h18M9 9v11"/>',
  queue: '<rect x="2.5" y="5" width="5" height="9"/><rect x="9.5" y="5" width="5" height="9"/>'
    + '<rect x="16.5" y="5" width="5" height="9"/><path d="M3 18.5h17M17.5 16l2.5 2.5-2.5 2.5"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L20 3M16.5 6.5l3 3M14 9l2 2"/>',
  trash: '<path d="M4 6h16M9 6V3.5h6V6M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9.5C7.5 20 4 17 4 12V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
});

// ---------- the running example: order #1042, four steps, each calling another service
const ORDER_STEPS = [
  { icon: 'card', label: 'Charge card', fn: 'chargeCard', service: 'Payments', result: '$42 paid' },
  { icon: 'box', label: 'Reserve item', fn: 'reserveItem', service: 'Warehouse', result: 'item reserved' },
  { icon: 'truck', label: 'Ship package', fn: 'shipPackage', service: 'Carrier', result: 'tracking 1Z-48' },
  { icon: 'mail', label: 'Email receipt', fn: 'emailReceipt', service: 'Email', result: 'receipt sent' },
];

// The 4 steps of the order, as tiles in a row joined by thin links
function makeStepRow(root, svg, x0, gap, y, w, h) {
  const xs = ORDER_STEPS.map((_, i) => x0 + i * gap);
  const links = [0, 1, 2].map(i => {
    const d = `M ${xs[i] + w / 2 + 2} ${y} L ${xs[i + 1] - w / 2 - 2} ${y}`;
    return path(svg, d, C.line, 2, false);
  });
  const tiles = ORDER_STEPS.map(step => makeStep(root, step.icon, step.label, w, h));
  return { xs, y, tiles, links };
}
// states: one stepState value per tile; tiles pop in from a, links draw just after
function placeStepRow(row, t, a, states, dx = 0, dy = 0, o = 1) {
  row.tiles.forEach((e, i) => {
    stepState(e, states[i]);
    const p = P(t, a + i * 0.12, 0.45, backOut);
    place(e, row.xs[i] + dx, row.y + dy, p, clamp(p * 2) * o);
  });
  row.links.forEach((l, i) => draw(l, P(t, a + 0.4 + i * 0.12, 0.35), o));
}

// ---------- code card: white card showing a few lines of JavaScript, one div per line
// Card height = 2 * padY + lines * lineH (256 px for the 6 lines of the order code).
const CODE = { w: 640, font: 24, lineH: 36, padY: 20, padX: 20, gutter: 40, tabH: 34 };
const ORDER_CODE = [
  'async function placeOrder(order) {',
  ...ORDER_STEPS.map(step => `  await ${step.fn}(order);`),
  '}',
];
// Light syntax coloring of one plain JavaScript line (no HTML): keywords UV, strings violet,
// called function names bold, punctuation slate
function highlightJs(line) {
  const token = /('[^']*')|\b(async|function|await|return|const)\b|([A-Za-z_]\w*)(?=\()|([(){};,.])/g;
  return line.replace(token, (m, str, kw, fn, punct) => {
    if (str) return `<span style="color:${C.violet}">${str}</span>`;
    if (kw) return `<span style="color:${C.uv}">${kw}</span>`;
    if (fn) return `<span style="font-weight:700">${fn}</span>`;
    return `<span style="color:#7C8698">${punct}</span>`;
  });
}
// opts.lines: plain JavaScript lines (default: the order code); opts.header: label of the tab on top of the card
// (hidden until card.hdr.style.opacity is set), with opts.headerIcon.
// Returns the card element with: w, h, lines (one div per line), bar (highlight, see setCodeLine), hdr (tab or null)
// and lineY(i): y of the middle of line i relative to the card center.
function makeCodeCard(parent, opts = {}) {
  const { lines = ORDER_CODE, header = null, headerIcon = 'code', w = CODE.w } = opts;
  const h = CODE.padY * 2 + lines.length * CODE.lineH;
  const card = E(parent, '', '', {
    width: w + 'px', height: h + 'px', background: '#F8FAFC', color: '#141414', borderRadius: 'var(--r)',
  });
  card.w = w; card.h = h;
  // the highlight sits under the text, so it is created first
  card.bar = E(card, '', '', {
    left: '8px', width: (w - 16) + 'px', height: CODE.lineH + 'px', borderRadius: 'var(--rs)', transform: 'none',
  });
  card.lines = lines.map((src, i) => {
    const e = E(card,
      `<span style="display:inline-block;width:${CODE.gutter}px;color:#B4BCCB">${i + 1}</span>${highlightJs(src)}`,
      'mono', {
        left: CODE.padX + 'px', top: (CODE.padY + i * CODE.lineH) + 'px', height: CODE.lineH + 'px',
        lineHeight: CODE.lineH + 'px', fontSize: CODE.font + 'px', whiteSpace: 'pre', transform: 'none',
      });
    e.style.opacity = 1;
    return e;
  });
  card.hdr = null;
  if (header) {
    // a tab standing on the top edge, so showing it never moves the code
    card.hdr = E(card, `${ICON(headerIcon, 18, '#FFFFFF', 2)}<span>${header}</span>`, 'mono', {
      left: '18px', top: -CODE.tabH + 'px', height: CODE.tabH + 'px', padding: '0 14px 0 12px', display: 'flex',
      alignItems: 'center', gap: '8px', background: C.uv, color: '#FFFFFF', fontSize: '15px', letterSpacing: '.12em',
      textTransform: 'uppercase', borderRadius: 'var(--rs) var(--rs) 0 0', transform: 'none', whiteSpace: 'nowrap',
    });
  }
  card.lineY = i => -h / 2 + CODE.padY + (i + 0.5) * CODE.lineH;
  return card;
}
// Highlight line i (0-based; a fractional i slides between lines) with opacity o
function setCodeLine(card, i, o, color = 'rgba(182,100,255,.28)') {
  card.bar.style.top = (CODE.padY + i * CODE.lineH) + 'px';
  card.bar.style.background = color;
  card.bar.style.opacity = clamp(o);
}

// ---------- CARD CHARGED counter (340 x 200 tile)
function makeCharge(p) {
  const e = E(p,
    '<div class="lbl" style="font-size:16px;display:flex;gap:10px;align-items:center">'
    + `${ICON('card', 22, C.slate, 1.8)} Card charged</div>`
    + '<div class="n" style="font-size:84px;line-height:1;margin-top:10px">$0</div>'
    + '<div class="w mono" style="font-size:18px;letter-spacing:.1em;margin-top:12px;white-space:nowrap"></div>',
    'tile', { width: '340px', height: '200px', textAlign: 'left', padding: '20px 24px' });
  e.n = e.querySelector('.n'); e.w = e.querySelector('.w');
  return e;
}
// note: small line under the amount, e.g. 'CHARGED TWICE!' (red) or 'NOT RE-CHARGED' (neon); '' hides it
function setCharge(e, dollars, note = '', noteColor = C.red, numColor = C.ink) {
  e.n.textContent = '$' + dollars; e.n.style.color = numColor;
  e.w.textContent = note; e.w.style.color = noteColor;
}

// ---------- order status pill: "ORDER #1042 | PENDING"
function makeOrderStatus(p) {
  const e = E(p,
    `<div style="display:flex;align-items:center;gap:14px">${ICON('bag', 30, C.ink, 1.6)}`
    + '<span class="mono" style="font-size:20px;letter-spacing:.08em">ORDER #1042</span>'
    + `<span style="width:1.5px;height:24px;background:${C.line}"></span>`
    + '<span class="st mono" style="font-size:20px;letter-spacing:.08em"></span></div>',
    '', { padding: '10px 18px', border: '1.5px solid ' + C.slate, borderRadius: 'var(--rs)', whiteSpace: 'nowrap' });
  e.st = e.querySelector('.st');
  return e;
}
// color tints the status text and the border, e.g. C.red for 'PAID, NOT SHIPPED', C.neon for 'COMPLETE'
function setOrderStatus(e, text, color = C.slate) {
  e.st.textContent = text; e.st.style.color = color;
  e.style.borderColor = color;
}

// ---------- RESULT chip carrying an Activity result between the Worker and the history (UV, like the
// Activity names in the history rows)
function makeResultCard(p) {
  return E(p, '<span class="mono" style="font-size:15px;letter-spacing:.12em;padding-left:.12em">RESULT</span>', '', {
    background: '#E6E7FC', color: '#141414', padding: '6px 14px', borderLeft: `5px solid ${C.uv}`,
    borderRadius: 'var(--rs)', whiteSpace: 'nowrap',
  });
}

// ---------- Worker panel: gear + name on the left, status on the right (700 x 400 holds a code card,
// centered 42 px below the panel center, with room for its header tab)
const WORKER = { w: 700, h: 400, codeDy: 42 };
function makeWorkerPanel(p, name, w = WORKER.w, h = WORKER.h) {
  const e = E(p,
    '<div style="position:absolute;left:24px;top:20px;display:flex;align-items:center;gap:12px">'
    + `<div class="gear">${ICON('gear', 30, C.ink, 1.8)}</div>`
    + `<span class="mono" style="font-size:20px;letter-spacing:.1em">${name}</span></div>`
    + '<div class="st mono" style="position:absolute;right:24px;top:26px;font-size:16px;letter-spacing:.08em;'
    + 'color:var(--slate)"></div>',
    'tile', { width: w + 'px', height: h + 'px', textAlign: 'left' });
  e.gear = e.querySelector('.gear'); e.st = e.querySelector('.st');
  return e;
}
// state: 'idle', 'running' (the gear spins, violet border) or 'crashed' (red)
function setWorkerStatus(panel, text, state) {
  const crashed = state === 'crashed';
  panel.st.textContent = text;
  panel.st.style.color = crashed ? C.red : C.slate;
  panel.style.borderColor = crashed ? C.red : state === 'running' ? C.violet : C.line;
  gearSpin(panel, state === 'running' ? 1 : 0);
}

// ---------- TEMPORAL panel: official logo header and a note, UV border (holds the Event History card)
function makeTemporalPanel(p, w, h, note = 'Outside the Workers') {
  return E(p,
    `<img src="${LOGO}" style="position:absolute;left:26px;top:22px;height:34px;display:block">`
    + `<div class="lbl" style="position:absolute;right:24px;top:30px;font-size:16px">${note}</div>`,
    'tile', { width: w + 'px', height: h + 'px', borderColor: C.uv });
}

// ---------- Event History card
// Row i spans HIST.row0 + i * HIST.rowGap (from the card top) over HIST.rowGap px; see hist.rowY(i).
const HIST = { w: 800, row0: 66, rowGap: 44, padBottom: 14 };
const uvName = fn => `<span style="color:${C.uv}">${fn}</span>`;
const HISTORY_ROWS = [
  'Workflow started: order #1042',
  ...ORDER_STEPS.map(step => `${uvName(step.fn)}: ${step.result}`),
  'Workflow completed',
];
// rows: HTML of each row. Returns the card element with: w, h, rows, tags (one per row, see setHistoryTag),
// kept + cut (crash marks, see markHistoryCrash), scan (row highlight, see setHistoryScan)
// and rowY(i): y of the middle of row i relative to the card center.
function makeHistory(p, rows = HISTORY_ROWS, w = HIST.w) {
  const h = HIST.row0 + rows.length * HIST.rowGap + HIST.padBottom;
  const card = E(p,
    '<div class="mono" style="position:absolute;left:26px;top:20px;font-size:18px;letter-spacing:.14em;'
    + `color:#141414;display:flex;gap:10px;align-items:center">${ICON('book', 22, '#141414', 1.8)}`
    + ' EVENT HISTORY</div>',
    '', { width: w + 'px', height: h + 'px', background: '#F8FAFC', color: '#141414', borderRadius: 'var(--r)' });
  card.w = w; card.h = h;
  // kept rows: tinted block over the rows that survive a crash, and a dashed line under them
  card.kept = E(card, '', '', {
    left: '14px', top: (HIST.row0 - 2) + 'px', width: (w - 28) + 'px', background: 'rgba(68,76,231,.08)',
    borderLeft: '4px solid ' + C.uv, borderRadius: 'var(--rs)', transform: 'none',
  });
  card.cut = E(card,
    '<span class="mono" style="position:absolute;left:58%;top:-10px;transform:translateX(-50%);background:#F8FAFC;'
    + `padding:0 10px;font-size:13px;line-height:18px;letter-spacing:.12em;color:${C.red};white-space:nowrap">`
    + 'WORKER CRASHED HERE</span>',
    '', { left: '26px', width: (w - 52) + 'px', height: '0', borderTop: '2px dashed ' + C.red, transform: 'none' });
  card.scan = E(card, '', '', {
    left: '18px', width: (w - 36) + 'px', height: HIST.rowGap + 'px', background: 'rgba(182,100,255,.28)',
    borderRadius: 'var(--rs)', transform: 'none',
  });
  card.rows = rows.map((html, i) => E(card,
    `<span style="color:#8A93A6;display:inline-block;width:34px">${i + 1}</span>${html}`,
    'mono', {
      left: '26px', top: (HIST.row0 + i * HIST.rowGap) + 'px', height: HIST.rowGap + 'px',
      lineHeight: HIST.rowGap + 'px', fontSize: '21px', whiteSpace: 'nowrap', padding: '0 10px', transform: 'none',
    }));
  card.tags = rows.map((_, i) => E(card, '', 'mono', {
    left: 'auto', right: '28px', top: (HIST.row0 + i * HIST.rowGap + HIST.rowGap / 2) + 'px', fontSize: '15px',
    letterSpacing: '.1em', padding: '4px 10px', borderRadius: '4px', whiteSpace: 'nowrap', display: 'flex',
    alignItems: 'center', gap: '6px', transformOrigin: 'right center', transform: 'translateY(-50%)',
  }));
  card.rowY = i => -h / 2 + HIST.row0 + (i + 0.5) * HIST.rowGap;
  return card;
}
// Row i slides in from the right with progress p
function showHistoryRow(hist, i, p) {
  hist.rows[i].style.opacity = clamp(p);
  hist.rows[i].style.transform = `translateX(${(1 - clamp(p)) * 26}px)`;
}
// Status tag of row i: 'SAVED' (neon check on black) or any 'REUSED…' label (white on UV).
// pop: 0 to 1, a brief scale bump when the label switches. innerHTML only changes with the label.
function setHistoryTag(hist, i, label, o, pop = 0) {
  const e = hist.tags[i];
  if (e._l !== label) {
    e._l = label;
    const reused = label.startsWith('REUSED');
    e.innerHTML = reused ? label : ICON('check', 16, C.neon, 2.6) + label;
    e.style.background = reused ? C.uv : '#141414'; e.style.color = reused ? '#FFFFFF' : C.neon;
  }
  e.style.opacity = clamp(o);
  e.style.transform = `translateY(-50%) scale(${1 + 0.14 * pop})`;
}
// Crash marks: the first n rows tinted (oKept) and the "WORKER CRASHED HERE" line under row n (oCut)
function markHistoryCrash(hist, n, oKept, oCut) {
  hist.kept.style.height = (n * HIST.rowGap + 4) + 'px';
  hist.kept.style.opacity = clamp(oKept);
  hist.cut.style.top = (HIST.row0 + n * HIST.rowGap + 2) + 'px';
  hist.cut.style.opacity = clamp(oCut);
}
// Highlight row i (a fractional i slides between rows) with opacity o
function setHistoryScan(hist, i, o) {
  hist.scan.style.top = (HIST.row0 + i * HIST.rowGap) + 'px';
  hist.scan.style.opacity = clamp(o);
}

// ---------- crash effects
// screen shake around a crash, as [dx, dy]
function shakeAt(t, crashAt) {
  const k = Math.max(0, 1 - Math.abs(t - crashAt - 0.2) / 0.4);
  return [Math.sin(G * 90) * 12 * k, Math.cos(G * 77) * 8 * k];
}
// red flash intensity (0 to 1) peaking at the crash
function flashAt(t, crashAt) { return Math.max(0, 1 - Math.abs(t - crashAt) / 0.28); }
