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
function placeStepRow(row, t, a, states) {
  row.tiles.forEach((e, i) => {
    stepState(e, states[i]);
    const p = P(t, a + i * 0.12, 0.45, backOut);
    place(e, row.xs[i], row.y, p, clamp(p * 2));
  });
  row.links.forEach((l, i) => draw(l, P(t, a + 0.4 + i * 0.12, 0.35)));
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
// (hidden until card.hdr.style.opacity is set).
// Returns the card element with: w, h, lines (one div per line), bar (highlight, see setCodeLine), hdr (tab or null)
// and lineY(i): y of the middle of line i relative to the card center.
function makeCodeCard(parent, opts = {}) {
  const { lines = ORDER_CODE, header = null, w = CODE.w } = opts;
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
    card.hdr = E(card, `${ICON('code', 18, '#FFFFFF', 2)}<span>${header}</span>`, 'mono', {
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

// ---------- TEMPORAL panel: official logo header and an "outside the Workers" note, UV border (holds the Event
// History card)
function makeTemporalPanel(p, w, h) {
  return E(p,
    `<img src="${LOGO}" style="position:absolute;left:26px;top:22px;height:34px;display:block">`
    + '<div class="lbl" style="position:absolute;right:24px;top:30px;font-size:16px">Outside the Workers</div>',
    'tile', { width: w + 'px', height: h + 'px', borderColor: C.uv });
}

// ---------- Event History card
// Row i spans HIST.row0 + i * HIST.rowGap (from the card top) over HIST.rowGap px; the rows below a crash line
// sit lower, see makeHistory.
const HIST = { row0: 66, rowGap: 44, padBottom: 14 };
const uvName = fn => `<span style="color:${C.uv}">${fn}</span>`;
const HISTORY_ROWS = [
  'Workflow started: order #1042',
  ...ORDER_STEPS.map(step => `${uvName(step.fn)}: ${step.result}`),
  'Workflow completed',
];
// rows: HTML of each row; the rows from crashRow on sit crashGap px lower, leaving room for the
// "WORKER CRASHED HERE" line. Returns the card element with: h, rows, tags (one per row, see setHistoryTag),
// kept + cut (crash marks, see markEventHistoryCrash) and scan (row highlight, see setHistoryScan).
function makeHistory(p, rows, w, crashRow, crashGap) {
  const h = HIST.row0 + rows.length * HIST.rowGap + crashGap + HIST.padBottom;
  const rowTop = i => HIST.row0 + i * HIST.rowGap + (i >= crashRow ? crashGap : 0);
  const card = E(p,
    '<div class="mono" style="position:absolute;left:26px;top:20px;font-size:18px;letter-spacing:.14em;'
    + `color:#141414;display:flex;gap:10px;align-items:center">${ICON('book', 22, '#141414', 1.8)}`
    + ' EVENT HISTORY</div>',
    '', { width: w + 'px', height: h + 'px', background: '#F8FAFC', color: '#141414', borderRadius: 'var(--r)' });
  card.h = h;
  // kept rows: tinted block over the rows that survive the crash, and a dashed line in the room under them
  card.kept = E(card, '', '', {
    left: '14px', top: (HIST.row0 - 2) + 'px', width: (w - 28) + 'px', height: (crashRow * HIST.rowGap + 4) + 'px',
    background: 'rgba(68,76,231,.08)', borderLeft: '4px solid ' + C.uv, borderRadius: 'var(--rs)', transform: 'none',
  });
  card.cut = E(card,
    '<span class="mono" style="position:absolute;left:58%;top:-10px;transform:translateX(-50%);background:#F8FAFC;'
    + `padding:0 10px;font-size:13px;line-height:18px;letter-spacing:.12em;color:${C.red};white-space:nowrap">`
    + 'WORKER CRASHED HERE</span>',
    '', {
      left: '26px', top: (HIST.row0 + crashRow * HIST.rowGap + crashGap / 2 - 1) + 'px', width: (w - 52) + 'px',
      height: '0', borderTop: '2px dashed ' + C.red, transform: 'none',
    });
  card.scan = E(card, '', '', {
    left: '18px', width: (w - 36) + 'px', height: HIST.rowGap + 'px', background: 'rgba(182,100,255,.28)',
    borderRadius: 'var(--rs)', transform: 'none',
  });
  card.rows = rows.map((html, i) => E(card,
    `<span style="color:#8A93A6;display:inline-block;width:34px">${i + 1}</span>${html}`,
    'mono', {
      left: '26px', top: rowTop(i) + 'px', height: HIST.rowGap + 'px',
      lineHeight: HIST.rowGap + 'px', fontSize: '21px', whiteSpace: 'nowrap', padding: '0 10px', transform: 'none',
    }));
  card.tags = rows.map((_, i) => E(card, '', 'mono', {
    left: 'auto', right: '28px', top: (rowTop(i) + HIST.rowGap / 2) + 'px', fontSize: '15px',
    letterSpacing: '.1em', padding: '4px 10px', borderRadius: '4px', whiteSpace: 'nowrap', display: 'flex',
    alignItems: 'center', gap: '6px', transformOrigin: 'right center', transform: 'translateY(-50%)',
  }));
  return card;
}
// Row i slides in from the right with progress p (on whole pixels, so its text always rasters the same way)
function showHistoryRow(hist, i, p) {
  hist.rows[i].style.opacity = clamp(p);
  hist.rows[i].style.transform = `translateX(${Math.round((1 - clamp(p)) * 26)}px)`;
}
// Status tag of row i: 'SAVED' (neon check on black) or any 'REUSED…' label (white on UV).
// pop: 0 to 1, a brief scale bump; use bumpAt(t, switchTime) so the label switches and shows at native size.
// innerHTML only changes with the label.
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
// Highlight row i (a fractional i slides between rows) with opacity o
function setHistoryScan(hist, i, o) {
  hist.scan.style.top = (HIST.row0 + i * HIST.rowGap) + 'px';
  hist.scan.style.opacity = clamp(o);
}

// ---------- small animation helpers
// Brief bump (0 to 1 and back to 0) for a pop on a change or an appearance at `at`. It stays exactly 0 until
// 0.1 s after `at`, so the element is at native size on the frames where its content changes or it first shows:
// Chromium rasters a layer then and keeps that raster, so a scaled first raster would blur it for good.
const bumpAt = (t, at) => win(t, at + 0.1, at + 0.25, 0.15);
// Tick, spinner and cross of a status tile, on its top right corner (the markup of makeStep, see stepState)
function addStatusMarks(e) {
  e.insertAdjacentHTML('beforeend',
    '<div class="spin" style="position:absolute;right:12px;top:12px;width:26px;height:26px;'
    + `border:3px solid rgba(182,100,255,.25);border-top-color:${C.violet};border-radius:50%;opacity:0"></div>`
    + `<div class="ok" style="position:absolute;right:8px;top:8px;opacity:0">${ICON('check', 32, C.neon, 2.6)}</div>`
    + `<div class="ko" style="position:absolute;right:8px;top:8px;opacity:0">${ICON('x', 32, C.red, 2.6)}</div>`);
  e.spin = e.querySelector('.spin'); e.ok = e.querySelector('.ok'); e.ko = e.querySelector('.ko');
  return e;
}

// ---------- crash effects
// screen shake around a crash, as [dx, dy]
function shakeAt(t, crashAt) {
  const k = Math.max(0, 1 - Math.abs(t - crashAt - 0.2) / 0.4);
  return [Math.sin(G * 90) * 12 * k, Math.cos(G * 77) * 8 * k];
}
// red flash intensity (0 to 1) peaking at the crash
function flashAt(t, crashAt) { return Math.max(0, 1 - Math.abs(t - crashAt) / 0.28); }

// ---------- one shot for chapters 5 and 6: Worker panel with the code card on the left, CARD CHARGED counter
// and order status under it, TEMPORAL panel with the Event History on the right. Both chapters build it with
// the same coordinates, so the cut from chapter 5 to chapter 6 reads as one continuous shot.
// Coordinates are on the 1080 px stage; EH.shift centers the composition at (960, 522).
const EH = {
  shift: [10, -63],
  worker: { x: 450, y: 470 },
  temporal: { x: 1420, y: 515, w: 760, h: 490 },
  histW: 700,
  histTop: 348, // the history card hangs 78 px below the top of the TEMPORAL panel, under its logo header
  charge: { x: 270, y: 800 },
  orderLeft: 470, // the order status pill is left-aligned next to the counter (its width follows its text)
  crashRow: 3, // the Worker crashes while row 4 (shipPackage) is running
  crashGap: 40, // room above row 4 for the "WORKER CRASHED HERE" line
  lineEndX: 688, // RESULT chips leave and reach the code at the right end of the lines
  spinX: 740, // running spinner, at the right end of the highlighted line
  rowStartX: 1190, // RESULT chips reach and leave the history at the start of the row text
};
// Stage y of code line i and of history row i (rows below the crash line sit EH.crashGap lower)
const ehLineY = i => EH.worker.y + WORKER.codeDy - (CODE.padY * 2 + ORDER_CODE.length * CODE.lineH) / 2
  + CODE.padY + (i + 0.5) * CODE.lineH;
const ehRowY = i => EH.histTop + HIST.row0 + (i + 0.5) * HIST.rowGap + (i >= EH.crashRow ? EH.crashGap : 0);
// Activity timing of the shot: an Activity started at `run` sends its RESULT at run + RESULT_LAG, and its
// history row is saved SAVE_LAG later
const RESULT_LAG = 0.5, SAVE_LAG = 0.6;

// Builds the shot: one Worker panel per name (stacked in the same place), then the code card (WORKFLOW tab),
// its spinner, the counter, the order status, the TEMPORAL panel and the Event History with room for the crash line
function makeEventHistoryShot(root, workerNames) {
  const shot = {};
  shot.workers = workerNames.map(name => makeWorkerPanel(root, name));
  shot.code = makeCodeCard(root, { header: 'Workflow' });
  shot.code.hdr.style.opacity = 1;
  shot.spin = E(root,
    '<div style="width:26px;height:26px;border:3px solid rgba(182,100,255,.3);'
    + `border-top-color:${C.violet};border-radius:50%"></div>`);
  shot.spin.ring = shot.spin.firstChild;
  shot.charge = makeCharge(root);
  shot.order = makeOrderStatus(root);
  shot.temporal = makeTemporalPanel(root, EH.temporal.w, EH.temporal.h);
  shot.hist = makeHistory(root, HISTORY_ROWS, EH.histW, EH.crashRow, EH.crashGap);
  return shot;
}
// Places everything but the Worker panels (o: opacity of each part; [sx, sy]: shake of the Worker side)
function placeEventHistoryShot(shot, o, sx = 0, sy = 0) {
  place(shot.code, EH.worker.x + sx, EH.worker.y + WORKER.codeDy + sy, 1, o.code);
  place(shot.charge, EH.charge.x, EH.charge.y, 1 + 0.06 * (o.chargePop || 0), o.charge);
  // left-aligned: the pill keeps its left edge when its status text changes
  place(shot.order, EH.orderLeft, EH.charge.y, 1, o.order);
  shot.order.style.transform = `translate(${EH.orderLeft}px,${EH.charge.y}px) translate(0,-50%)`;
  place(shot.temporal, EH.temporal.x, EH.temporal.y, 1, o.temporal);
  place(shot.hist, EH.temporal.x, EH.histTop + shot.hist.h / 2, 1, o.hist);
}
// Running spinner at the right end of code line i (fractional i follows the sliding highlight)
function setCodeSpinner(shot, i, o, sx = 0, sy = 0) {
  place(shot.spin, EH.spinX + sx, ehLineY(i) + sy, 1, o);
  shot.spin.ring.style.transform = `rotate(${G * 400}deg)`;
}
// Spinner opacity for an Activity running from `run` until its RESULT leaves
const runningSpin = (t, run) => win(t, run + 0.2, run + RESULT_LAG, 0.15);
// RESULT chip of step i (code line i, history row i): appears at `at` at the end of the code line, flies to the
// start of the history row and is absorbed there
function flyResultToHistory(chip, t, at, i) {
  fly(chip, t, at, EH.lineEndX, ehLineY(i), at + 0.1, 0.45, EH.rowStartX, ehRowY(i),
    at + 0.55, EH.rowStartX, ehRowY(i));
}
// The way back when replaying: from the start of history row i to the end of code line i
function flyResultToCode(chip, t, at, i) {
  fly(chip, t, at, EH.rowStartX, ehRowY(i), at + 0.1, 0.45, EH.lineEndX, ehLineY(i),
    at + 0.55, EH.lineEndX, ehLineY(i));
}
// Crash marks of the shot: rows 1-3 tinted (oKept), "WORKER CRASHED HERE" in the room above row 4 (oCut)
function markEventHistoryCrash(hist, oKept, oCut) {
  hist.kept.style.opacity = clamp(oKept);
  hist.cut.style.opacity = clamp(oCut);
}
// Arrow whose head is filled with the stroke color. The engine's shared marker fills its head with
// `context-stroke`, which WebKit ignores (black heads in Safari): this one gets its own marker per color, with an
// explicit fill, added once to the svg's <defs> and reused. draw() reads p._marker on every frame.
function arrow(svg, d, color, w, dash = null) {
  const p = path(svg, d, color, w, true, dash);
  const id = `ah${svg.parentNode.dataset.k}-${color.replace(/[^0-9a-z]/gi, '')}`;
  if (!svg.querySelector(`#${id}`)) {
    const marker = document.createElementNS(SVGNS, 'marker');
    marker.id = id;
    const attrs = { viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 5, markerHeight: 5,
      orient: 'auto-start-reverse' };
    for (const [name, value] of Object.entries(attrs)) marker.setAttribute(name, value);
    const head = document.createElementNS(SVGNS, 'path');
    head.setAttribute('d', 'M0,0 L10,5 L0,10 z');
    head.setAttribute('fill', color);
    marker.appendChild(head);
    svg.querySelector('defs').appendChild(marker);
  }
  p._marker = `url(#${id})`;
  return p;
}
