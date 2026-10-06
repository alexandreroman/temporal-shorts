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
  // brackets with a steeper slash than the engine's `code`
  codeSteep: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/>',
  plug: '<path d="M9 3v4M15 3v4M6 7h12v3a6 6 0 0 1-12 0zM12 16v5"/>',
  table: '<rect x="3" y="4" width="18" height="16"/><path d="M3 9h18M3 14.5h18M9 9v11"/>',
  queue: '<rect x="2.5" y="5" width="5" height="9"/><rect x="9.5" y="5" width="5" height="9"/>'
    + '<rect x="16.5" y="5" width="5" height="9"/><path d="M3 18.5h17M17.5 16l2.5 2.5-2.5 2.5"/>',
  trash: '<path d="M4 6h16M9 6V3.5h6V6M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
  // a shield with a check, its point lower than agent-harness's `shield`
  shieldTall: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9.5C7.5 20 4 17 4 12V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
});

// ---------- the running example: order #1042, four steps, each calling another service
const ORDER_STEPS = [
  { icon: 'card', label: 'Charge card', fn: 'chargeCard', service: 'Payments', result: '$42 paid' },
  { icon: 'box', label: 'Reserve item', fn: 'reserveItem', service: 'Warehouse', result: 'item reserved' },
  { icon: 'truck', label: 'Ship package', fn: 'shipPackage', service: 'Carrier', result: 'tracking 1Z-48' },
  { icon: 'mail', label: 'Email receipt', fn: 'emailReceipt', service: 'Email', result: 'receipt sent' },
];
// The 4 steps of the order as [icon, label], for makeStepRow
const ORDER_TILES = ORDER_STEPS.map(step => [step.icon, step.label]);

// ---------- code card: white card showing a few lines of TypeScript, one div per line
// Card height = 2 * padY + lines * lineH (256 px for the 6 lines of the order code).
const CODE = { w: 680, font: 24, lineH: 36, padY: 20, padX: 20, gutter: 40, tabH: 34 };
const ORDER_AWAITS = ORDER_STEPS.map(step => `  await ${step.fn}(order);`);
// Chapters 1 to 3: the order code before Temporal, an ordinary function
const ORDER_CODE = ['async function placeOrder(order: Order) {', ...ORDER_AWAITS, '}'];
// Chapters 5 and 6: the Workflow, as exported from workflows.ts (Temporal TypeScript SDK)
const WORKFLOW_CODE = ['export async function placeOrder(order: Order) {', ...ORDER_AWAITS, '}'];
// Chapter 4: the whole workflows.ts excerpt, the Activities declared above the Workflow (Prettier layout)
const WORKFLOWS_TS = [
  'const { chargeCard, reserveItem, shipPackage, emailReceipt } =',
  '  proxyActivities<typeof activities>({',
  "    startToCloseTimeout: '1 minute',",
  '  });',
  '',
  ...WORKFLOW_CODE,
];
// Index of the `await` line of step i (ORDER_STEPS[i]) in a list of code lines
const awaitLine = (lines, i) => lines.findIndex(line => line.includes(`await ${ORDER_STEPS[i].fn}(`));
// Light syntax coloring of one plain TypeScript line (no HTML): keywords UV, strings violet, called function names
// bold, punctuation slate (angle brackets escaped), everything else (names, types) default ink
function highlightJs(line) {
  const token = /('[^']*')|\b(export|async|function|await|const|typeof)\b|([A-Za-z_]\w*)(?=[(<])|([(){}<>:;,.=])/g;
  const escaped = { '<': '&lt;', '>': '&gt;' };
  return line.replace(token, (m, str, kw, fn, punct) => {
    if (str) return `<span style="color:${C.violet}">${str}</span>`;
    if (kw) return `<span style="color:${C.uv}">${kw}</span>`;
    if (fn) return `<span style="font-weight:700">${fn}</span>`;
    return `<span style="color:#7C8698">${escaped[punct] || punct}</span>`;
  });
}
// opts.lines: plain TypeScript lines (default: the order code); opts.header: label of the tab on top of the card and
// opts.file: file name shown next to it (both hidden until card.hdr.style.opacity is set); opts.font, opts.lineH,
// opts.padY, opts.padX, opts.gutter: text metrics (default: CODE).
// Returns the card element with: w, h, lineH, padY, lines (one div per line), bar (highlight, see setCodeLine),
// hdr (tab or null) and lineY(i): y of the middle of line i relative to the card center.
function makeCodeCard(parent, opts = {}) {
  const {
    lines = ORDER_CODE, header = null, file = null, w = CODE.w, font = CODE.font, lineH = CODE.lineH,
    padY = CODE.padY, padX = CODE.padX, gutter = CODE.gutter,
  } = opts;
  const h = padY * 2 + lines.length * lineH;
  const card = E(parent, '', 'paper', { width: w + 'px', height: h + 'px' });
  card.w = w; card.h = h; card.lineH = lineH; card.padY = padY;
  // the highlight sits under the text, so it is created first
  card.bar = E(card, '', '', {
    left: '8px', width: (w - 16) + 'px', height: lineH + 'px', borderRadius: 'var(--rs)', transform: 'none',
  });
  card.lines = lines.map((src, i) => {
    const e = E(card,
      `<span style="display:inline-block;width:${gutter}px;color:#B4BCCB">${i + 1}</span>${highlightJs(src)}`,
      'mono', {
        left: padX + 'px', top: (padY + i * lineH) + 'px', height: lineH + 'px',
        lineHeight: lineH + 'px', fontSize: font + 'px', whiteSpace: 'pre', transform: 'none',
      });
    e.style.opacity = 1;
    return e;
  });
  card.hdr = null;
  if (header) {
    // a tab standing on the top edge, so showing it never moves the code; the file name follows it, in slate
    const fileLabel = file
      ? `<span style="font-size:16px;letter-spacing:.04em;color:${C.slate}">${file}</span>` : '';
    card.hdr = E(card,
      `<div style="height:${CODE.tabH}px;padding:0 14px 0 12px;display:flex;align-items:center;gap:8px;`
      + `background:${C.uv};color:#FFFFFF;font-size:15px;letter-spacing:.12em;text-transform:uppercase;`
      + `border-radius:var(--rs) var(--rs) 0 0">${ICON('codeSteep', 18, '#FFFFFF', 2)}<span>${header}</span></div>`
      + fileLabel,
      'mono', {
        left: '18px', top: -CODE.tabH + 'px', height: CODE.tabH + 'px', display: 'flex', alignItems: 'center',
        gap: '16px', transform: 'none', whiteSpace: 'nowrap',
      });
  }
  card.lineY = i => -h / 2 + padY + (i + 0.5) * lineH;
  return card;
}
// Highlight n lines from line i (0-based; a fractional i slides between lines) with opacity o
function setCodeLine(card, i, o, color = C.highlight, n = 1) {
  card.bar.style.top = (card.padY + i * card.lineH) + 'px';
  card.bar.style.height = (n * card.lineH) + 'px';
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

// ---------- TEMPORAL panel header (makeTemporalPanel options): the logo and an "outside the Workers" note
const TEMPORAL_HEADER = { logoAt: [26, 22], noteAt: [24, 30], note: 'Outside the Workers' };

// ---------- Event History card
// Row i spans HIST.row0 + i * HIST.rowGap (from the card top) over HIST.rowGap px; the rows below a crash line
// sit lower, see makeHistory.
const HIST = { row0: 76, rowGap: 60 };
const uvName = fn => `<span style="color:${C.uv}">${fn}</span>`;
const HISTORY_ROWS = [
  'Workflow started: order #1042',
  ...ORDER_STEPS.map(step => `${uvName(step.fn)}: ${step.result}`),
  'Workflow completed',
];
// rows: HTML of each row; the rows from crashRow on sit crashGap px lower, leaving room for the
// "WORKER CRASHED HERE" line; w x h: card size (the room under the last row stays free). Returns the
// makeHistoryCard card: its tags are centered on their rows (see setHistoryTag).
function makeHistory(p, rows, w, h, crashRow, crashGap) {
  const rowTop = i => HIST.row0 + i * HIST.rowGap + (i >= crashRow ? crashGap : 0);
  return makeHistoryCard(p, rows, {
    w, h, rowTop, rowH: HIST.rowGap, padY: 0, tagTop: i => rowTop(i) + HIST.rowGap / 2, tagRight: 28,
    tag: { border: false },
    crash: {
      keptTop: HIST.row0 - 2, keptH: crashRow * HIST.rowGap + 4,
      cutTop: HIST.row0 + crashRow * HIST.rowGap + crashGap / 2 - 1,
      label: 'WORKER CRASHED HERE', labelX: '58%', labelFont: 14,
    },
    scanH: HIST.rowGap,
  });
}
// Row i slides in from the right with progress p, on whole pixels
const showHistoryRow = (hist, i, p) => showRow(hist.rows[i], p, 26, true);
// Status tag of row i (label and statusTag kind), centered on its row with opacity o.
// pop: 0 to 1, a brief scale bump; use bumpAt(t, switchTime) so the label switches and shows at native size.
function setHistoryTag(hist, i, label, kind, o, pop = 0) {
  const e = hist.tags[i];
  setStatus(e, label, kind);
  e.style.opacity = clamp(o);
  e.style.transform = `translateY(-50%) scale(${1 + 0.14 * pop})`;
}
// Highlight row i (a fractional i slides between rows) with opacity o
const setHistoryScan = (hist, i, o) => setScan(hist, HIST.row0 + i * HIST.rowGap, o);

// ---------- small animation helpers
// Brief bump (0 to 1 and back to 0) for a pop on a change or an appearance at `at`. It stays exactly 0 until
// 0.1 s after `at`, so the element is at native size on the frames where its content changes or it first shows:
// Chromium rasters a layer then and keeps that raster, so a scaled first raster would blur it for good.
const bumpAt = (t, at) => win(t, at + 0.1, at + 0.25, 0.15);
// Appearance at `at` of a small element (badge, icon, tag, chip), as { o, s } for place(): it fades in at native
// size, then bumps briefly above it (k: height of the bump, 0 for none). A small element never grows from a small
// scale: its layer could keep the raster of that first tiny frame (a neon check vanishes from its dark badge).
const popIn = (t, at, k = 0.14) => ({ o: P(t, at, 0.2), s: 1 + k * bumpAt(t, at) });
// Centers e on (x, y) like place() at scale 1, but on whole pixels, so the native-size logo inside stays sharp
function placeOnWholePixels(e, x, y, o) {
  place(e, x, y, 1, o);
  e.style.transform = `translate(${Math.round(x - e.offsetWidth / 2)}px,${Math.round(y - e.offsetHeight / 2)}px)`;
}

// ---------- one shot for chapters 5 and 6: Worker panel with the code card on the left, CARD CHARGED counter
// and order status under it, TEMPORAL panel with the Event History on the right, with room under its rows for the
// WORKFLOW COMPLETE tag. Both chapters build it with the same coordinates, so the cut from chapter 5 to chapter 6
// reads as one continuous shot.
// Coordinates are on the 1080 px stage; EH.shift centers the composition at (960, 522). Every part sits on a few
// shared lines, and every size is even, so the parts rest on whole pixels:
// - x 120 and 920: left and right edges of the Worker column (Worker panel; counter left, order pill right);
//   x 1056 and 1800: edges of the TEMPORAL panel, 136 px right of the Worker column (room for the chips and arrow)
// - y 152: top of both panels; y 892: bottom of the counter, the pill row and the TEMPORAL panel
// - y 692: top of the counter row; y 792: middle of the counter, the order pill and WORKFLOW COMPLETE
// - 50 px between the Worker panel and the counter row, and between the counter and the order pill
// - the code card and the history card sit 32 px inside the sides of their panel
const EH = {
  shift: [0, 0],
  worker: { x: 520, y: 397, w: 800, h: 490 }, // x 120..920, y 152..642
  // code card: x 152..888, 6 lines of 46 px, its top 126 px below the panel top (under its tab), 36 px of panel
  // under it; 23 px text, so the 48 characters of the export line fit with 20 px to spare
  code: { w: 736, font: 23, lineH: 46, padY: 26, padX: 18, gutter: 36, dy: 45 },
  temporal: { x: 1428, y: 522, w: 744, h: 740 }, // x 1056..1800, y 152..892
  // history card: x 1088..1768, y 232..860, 80 px below the top of the TEMPORAL panel (under its logo header);
  // its 6 rows of 60 px and the crash line end at y 728
  hist: { w: 680, h: 628, top: 232 },
  charge: { x: 310, y: 792, w: 380 }, // counter: x 120..500, y 692..892
  // order status pill: x 550..920, centered on the counter row; its fixed width fits its longest status
  // (ORDER #1042 | COMPLETE), so neither edge moves when the status changes
  order: { left: 550, w: 370 },
  // WORKFLOW COMPLETE (50 px high), in the free room at the bottom of the history card, level with the counter row
  doneY: 792,
  crashRow: 3, // the Worker crashes while row 4 (shipPackage) is running
  crashGap: 60, // room above row 4 for the "WORKER CRASHED HERE" line, one row high
  lineEndX: 816, // RESULT chips leave and reach the code near the card's right edge (72 px inside it)
  spinX: 858, // running spinner, at the right end of the highlighted line (30 px from the card's right edge)
  rowStartX: 1208, // RESULT chips reach and leave the history at the start of the row text (120 px into the card)
};
// Stage y of code line i and of history row i (rows below the crash line sit EH.crashGap lower)
const ehLineY = i => EH.worker.y + EH.code.dy - (EH.code.padY * 2 + WORKFLOW_CODE.length * EH.code.lineH) / 2
  + EH.code.padY + (i + 0.5) * EH.code.lineH;
const ehRowY = i => EH.hist.top + HIST.row0 + (i + 0.5) * HIST.rowGap + (i >= EH.crashRow ? EH.crashGap : 0);
// Code line and history row of step i (ORDER_STEPS[i]): its await line, and the row after "Workflow started"
const ehStepLine = i => awaitLine(WORKFLOW_CODE, i);
const ehStepRow = i => i + 1;
// Activity timing of the shot: an Activity started at `run` sends its RESULT at run + RESULT_LAG, and its
// history row is saved SAVE_LAG later
const RESULT_LAG = 0.5, SAVE_LAG = 0.6;

// Builds the shot: one Worker panel per name (stacked in the same place), then the code card (WORKFLOW tab and
// file name), its spinner, the counter, the order status, the TEMPORAL panel and the Event History with room for
// the crash line
function makeEventHistoryShot(root, workerNames) {
  const shot = {};
  shot.workers = workerNames.map(name => makeAppPanel(root, name, EH.worker.w, EH.worker.h));
  const { w, font, lineH, padY, padX, gutter } = EH.code;
  shot.code = makeCodeCard(root, {
    lines: WORKFLOW_CODE, header: 'Workflow', file: 'workflows.ts', w, font, lineH, padY, padX, gutter,
  });
  shot.code.hdr.style.opacity = 1;
  shot.spin = E(root, spinnerRing(26));
  shot.spin.ring = shot.spin.firstChild;
  shot.charge = makeCharge(root);
  shot.charge.style.width = EH.charge.w + 'px';
  shot.order = makeOrderStatus(root);
  shot.order.style.width = EH.order.w + 'px';
  shot.temporal = makeTemporalPanel(root, EH.temporal.w, EH.temporal.h, TEMPORAL_HEADER);
  shot.hist = makeHistory(root, HISTORY_ROWS, EH.hist.w, EH.hist.h, EH.crashRow, EH.crashGap);
  return shot;
}
// Places everything but the Worker panels (o: opacity of each part; [sx, sy]: shake of the Worker side)
function placeEventHistoryShot(shot, o, sx = 0, sy = 0) {
  place(shot.code, EH.worker.x + sx, EH.worker.y + EH.code.dy + sy, 1, o.code);
  place(shot.charge, EH.charge.x, EH.charge.y, 1 + 0.06 * (o.chargePop || 0), o.charge);
  place(shot.order, EH.order.left + EH.order.w / 2, EH.charge.y, 1, o.order);
  place(shot.temporal, EH.temporal.x, EH.temporal.y, 1, o.temporal);
  place(shot.hist, EH.temporal.x, EH.hist.top + EH.hist.h / 2, 1, o.hist);
}
// Running spinner at the right end of code line i (fractional i follows the sliding highlight)
function setCodeSpinner(shot, i, o, sx = 0, sy = 0) {
  place(shot.spin, EH.spinX + sx, ehLineY(i) + sy, 1, o);
  shot.spin.ring.style.transform = `rotate(${G * 400}deg)`;
}
// Spinner opacity for an Activity running from `run` until its RESULT leaves
const runningSpin = (t, run) => win(t, run + 0.2, run + RESULT_LAG, 0.15);
// RESULT chip flight, like fly() but small: it fades in at native size at `at` (see popIn), travels from (x0, y0)
// to (x1, y1) during [at + 0.1, at + 0.55], then is absorbed there (shrinks and fades)
function flyChip(chip, t, at, x0, y0, x1, y1) {
  const f = P(t, at + 0.1, 0.45), ab = P(t, at + 0.55, 0.4, easeIn);
  place(chip, lerp(x0, x1, f), lerp(y0, y1, f), 1 - 0.65 * ab, P(t, at, 0.2) * (1 - ab));
}
// RESULT chip of step i: appears at `at` at the end of its await line, flies to the start of its history row and
// is absorbed there
function flyResultToHistory(chip, t, at, i) {
  flyChip(chip, t, at, EH.lineEndX, ehLineY(ehStepLine(i)), EH.rowStartX, ehRowY(ehStepRow(i)));
}
// The way back when replaying: from the start of the history row of step i to the end of its await line
function flyResultToCode(chip, t, at, i) {
  flyChip(chip, t, at, EH.rowStartX, ehRowY(ehStepRow(i)), EH.lineEndX, ehLineY(ehStepLine(i)));
}
// ---------- Worker status icons (chapter 8): free (pauseLines), restarting (power), deploying a new version
// (upload); pauseLines is drawn with two lines, agent-harness's `pause` with two bars
Object.assign(ICONS, {
  pauseLines: '<path d="M8.5 5v14M15.5 5v14"/>',
  power: '<path d="M12 3v8"/><path d="M6.3 6.8a8 8 0 1 0 11.4 0"/>',
  upload: '<path d="M12 15V4M7 9l5-5 5 5"/><path d="M4 14v6h16v-6"/>',
});
