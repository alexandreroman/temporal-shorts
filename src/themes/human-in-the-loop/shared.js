// ===================== Human-in-the-Loop helpers (shared by the scenes of this theme)
// Extra stroke icons (24 grid), in the hand-drawn style of engine.js
Object.assign(ICONS, {
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 1.8H4.2z"/><path d="M10 21.2h4"/>',
  db: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.5"/><path d="M4.5 5.5v13c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-13'
    + 'M4.5 12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5"/>',
  flag: '<path d="M5 21V3M5 4h13l-3 4.5 3 4.5H5"/>',
  // a screen over a flat base line (agent-harness's `laptop` has a keyboard)
  laptopFlat: '<rect x="5" y="5" width="14" height="10"/><path d="M2.5 19h19"/>',
  clipboard: '<rect x="5" y="4.5" width="14" height="16.5"/><path d="M9 3h6v3H9zM8.5 13.5l2.5 2.5 4.5-5"/>',
  up: '<path d="M12 20V5M6 11l6-6 6 6"/>',
  // an ID card: a portrait (head and shoulders) on the left, two text lines on the right
  idCard: '<rect x="2.5" y="5" width="19" height="14"/><circle cx="8" cy="10.5" r="2"/>'
    + '<path d="M4.5 16.5c0-2 1.6-3 3.5-3s3.5 1 3.5 3M14 10.5h4.5M14 14h4.5"/>',
});

// Horizontal extent of this theme's scenes, x 80 to 1840 inside the 80 px header margins, and the 40 px between
// their zones. Vertically, every scene stays inside the content frame shared by all themes, y 150 to 880.
const FRAME = { x0: 80, x1: 1840, gap: 40 };

// The 4 steps of the laptop order, used by chapters 1, 3 and 4
const STEPS = [['clipboard', 'Check'], ['user', 'Approval'], ['cart', 'Order'], ['mail', 'Notify']];
// Shared step row geometry, so the same tiles sit at the same place in every chapter that shows them:
// the row spans the content frame, CHECK's left edge and NOTIFY's right edge on its edges
const ROW = { w: 344, h: 140 };
ROW.x0 = FRAME.x0 + ROW.w / 2; // center of the first tile
ROW.gap = (FRAME.x1 - FRAME.x0 - ROW.w) / 3; // from one tile center to the next

// The steps as a makeStepRow on the line y; each tile also carries an hourglass for the waiting state (place the
// row with setStep, see placeLaptopRow)
function makeLaptopRow(root, svg, y) {
  const row = makeStepRow(root, svg, STEPS, ROW.x0, ROW.gap, y, ROW.w, ROW.h);
  row.tiles.forEach(e => {
    e.insertAdjacentHTML('beforeend',
      '<div class="hg" style="position:absolute;right:10px;top:10px;opacity:0">'
      + `${ICON('hourglass', 30, C.violet, 2)}</div>`);
    e.hg = e.querySelector('.hg');
  });
  return row;
}
// Hourglass turn in degrees: it rests, then flips over every 2.4 s (idle motion, driven by G)
function hourglassTurn() {
  const flips = Math.floor(G / 2.4), flip = P(G - flips * 2.4, 2.0, 0.4);
  return ((flips + flip) * 180) % 360;
}
// 0 pending, 1 running, 2 done, 3 failed, 4 waiting for a person (violet border, hourglass instead of the spinner)
function setStep(e, st) {
  const waiting = st === 4;
  stepState(e, waiting ? 1 : st);
  if (waiting) e.spin.style.opacity = 0;
  e.hg.style.opacity = waiting ? 1 : 0;
  e.hg.style.transform = `rotate(${hourglassTurn()}deg)`;
}
// states: one setStep value per tile (see placeStepRow)
function placeLaptopRow(row, t, a, states, dx = 0, dy = 0) {
  placeStepRow(row, t, a, states, dx, dy, 1, setStep);
}

// ===================== people and the approval request
// Avatar of a person in the scenes: its size, and how far the circle sits above the line its label is centered on
const AVATAR = { size: 140, dy: 21 };
// Face of an analog clock as SVG markup: 12 ticks, hour, minute and seconds hands (see setClock)
function clockFace(size, col = C.ink) {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = i * Math.PI / 6, r0 = i % 3 === 0 ? 33 : 36;
    const x0 = 50 + Math.sin(a) * r0, y0 = 50 - Math.cos(a) * r0;
    const x1 = 50 + Math.sin(a) * 41, y1 = 50 - Math.cos(a) * 41;
    return `M${x0.toFixed(1)} ${y0.toFixed(1)}L${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }).join('');
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" style="display:block">`
    + `<circle cx="50" cy="50" r="46" stroke="${col}" stroke-width="3"/>`
    + `<path d="${ticks}" stroke="${C.slate}" stroke-width="2.5"/>`
    + `<path class="hh" d="M50 50V28" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`
    + `<path class="mh" d="M50 50V16" stroke="${C.violet}" stroke-width="3.5" stroke-linecap="round"/>`
    + `<path class="sh" d="M50 58V12" stroke="${C.slate}" stroke-width="1.5" stroke-linecap="round"/>`
    + `<circle cx="50" cy="50" r="4" fill="${col}"/></svg>`;
}
// hours: clock time in hours, keyed to the story; the minute hand turns once per hour, the hour hand once per
// 12 hours. The seconds hand is ambient motion: it sweeps once per minute of G, so a resting clock stays alive.
// blur (0 to 1) dims the minute and seconds hands while days fly by: at several turns per second they would
// only flicker.
function setClock(root, hours, blur = 0) {
  root.querySelector('.hh').setAttribute('transform', `rotate(${(hours * 30) % 360} 50 50)`);
  const minute = root.querySelector('.mh'), seconds = root.querySelector('.sh');
  minute.setAttribute('transform', `rotate(${(hours * 360) % 360} 50 50)`);
  minute.style.opacity = 1 - 0.85 * blur;
  seconds.setAttribute('transform', `rotate(${(G * 6) % 360} 50 50)`);
  seconds.style.opacity = 1 - blur;
}
// The approval card in the scenes: its scale k (see makeApprovalCard) and its width at that scale
const APPROVAL_CARD = { k: 1.2, w: 480 };
// White approval request card with a ticking mini clock, Approve (brand UV) and Reject (outline) buttons.
// k scales every size natively (fonts, paddings, width; 400 px wide at 1), so a larger card stays sharp at rest.
function makeApprovalCard(p, k) {
  const px = v => Math.round(v * k) + 'px';
  const button = `flex:1;position:relative;overflow:hidden;font-size:${px(24)};text-align:center;`
    + `padding:${px(12)} 0 ${px(13)};border-radius:var(--rs)`;
  const e = E(p,
    '<div style="display:flex;justify-content:space-between;align-items:center">'
    + `<span class="mono" style="font-size:${px(16)};letter-spacing:.12em;color:#5B6475">APPROVAL REQUEST</span>`
    + `<div class="clk">${clockFace(Math.round(34 * k), '#141414')}</div></div>`
    + `<div style="font-size:${px(30)};margin-top:${px(14)}">New laptop for Sam</div>`
    + `<div style="font-size:${px(54)};line-height:1.1;font-weight:700;letter-spacing:-1px">$2,400</div>`
    + `<div style="display:flex;gap:${px(14)};margin-top:${px(22)}">`
    + `<div class="ap" style="${button};background:${C.uv};color:#FFFFFF">`
    + '<div class="ring" style="position:absolute;left:50%;top:50%;width:120px;height:120px;margin:-60px 0 0 -60px;'
    + 'border-radius:50%;background:rgba(248,250,252,.55);opacity:0"></div>'
    + '<span class="apt" style="position:relative;display:inline-flex;align-items:center;gap:8px">Approve</span></div>'
    + `<div class="rj" style="${button};border:1.5px solid #9AA3B5;color:#141414">Reject</div></div>`,
    'paper', {
      width: px(400), padding: `${px(20)} ${px(26)} ${px(26)}`, borderLeft: `${px(6)} solid ${C.violet}`,
    });
  e.clk = e.querySelector('.clk'); e.ap = e.querySelector('.ap'); e.apt = e.querySelector('.apt');
  e.ring = e.querySelector('.ring'); e.rj = e.querySelector('.rj');
  return e;
}
// Tap on Approve at `at`: a ripple, a neon flash, then the button stays approved (check + "Approved")
function tapApprove(card, t, at) {
  const ripple = P(t, at, 0.5, linear);
  card.ring.style.opacity = t >= at ? 1 - ripple : 0;
  card.ring.style.transform = `scale(${0.2 + 1.6 * ripple})`;
  const approved = t >= at + 0.15;
  const label = approved ? 'approved' : 'approve';
  if (card._l !== label) {
    card._l = label;
    card.apt.innerHTML = approved ? ICON('check', 24, '#141414', 2.6) + 'Approved' : 'Approve';
  }
  card.ap.style.background = approved ? C.neon : C.uv;
  card.ap.style.color = approved ? '#141414' : '#FFFFFF';
  // pressed in, then a small bounce as it turns approved
  const press = win(t, at - 0.1, at + 0.1, 0.1), bounce = win(t, at + 0.15, at + 0.4, 0.15);
  card.ap.style.transform = `scale(${1 - 0.06 * press + 0.06 * bounce})`;
  card.rj.style.opacity = 1 - 0.6 * P(t, at + 0.15, 0.3);
}
// Clock face next to a "DAY n" counter and a caption; used wherever the wait goes on for days
// The group is WAIT_CLOCK_W wide, so layouts can align its edges.
const WAIT_CLOCK_W = 370;
function makeWaitClock(p, caption) {
  const e = E(p,
    `<div class="clk">${clockFace(120)}</div>`
    // fixed text width: a caption change must not move the clock
    + '<div style="width:230px"><div class="day mono" style="font-size:50px;line-height:1;letter-spacing:.04em">'
    + 'DAY 1</div>'
    + `<div class="cap lbl" style="font-size:18px;margin-top:12px;padding-left:0">${caption}</div></div>`,
    '', { display: 'flex', alignItems: 'center', gap: '20px', width: WAIT_CLOCK_W + 'px' });
  e.clk = e.querySelector('.clk'); e.day = e.querySelector('.day'); e.cap = e.querySelector('.cap');
  return e;
}
// The request goes out at 09:00 on DAY 1; every clock of the wait shows the hours elapsed since then
const REQUEST_HOUR = 9;
// Chapters 1 and 3 fast-forward the wait to DAY 3, 11:00, then the clock rests there. Chapter 4 shows it at
// DAY 3, 15:00, later than where chapter 3 left it, so the clock never goes backwards between chapters.
const DAY3_MORNING = 50, DAY3_AFTERNOON = 54; // hours after the request
const DAY2_HOURS = 20; // DAY 2, 05:00: where chapter 3 pauses between its two fast-forwards
// Hours elapsed at time t while the wait fast-forwards from 0 at a to `total` at b; at rest before and after
function waitHours(t, a, b, total) {
  return total * clamp((t - a) / (b - a));
}
// Clock time and DAY counter for `elapsed` hours of waiting; the day turns at midnight
function setWaitClock(e, elapsed, blur = 0) {
  const hours = REQUEST_HOUR + elapsed;
  setClock(e.clk, hours, blur);
  e.day.textContent = 'DAY ' + (1 + Math.floor(hours / 24));
}

// ===================== app and Temporal panels (chapters 2, 3 and 4)
// Text sizes of the app panels (makeAppPanel options): a larger name and status
const APP_TEXT = { font: 22, statusFont: 18, statusTop: 25 };

// Chapters 3 and 4 share one layout on the content frame, y 153-877 around y 515: the step row on top; 30 px under
// it, the app column (instance panel, then 30 px lower a strip with the clock) on the left and the Temporal panel on
// the right, both ending on y 877
const WF_LAYOUT = {
  rowY: 223,
  app: { x: 480, y: 515, w: 800, h: 384 },
  strip: { x: 480, y: 807, w: 800, h: 140 },
  temporal: { x: 1380, y: 600, w: 920, h: 554 },
};
// the wait clock in the strip, 30 px from its left edge
WF_LAYOUT.clock = {
  x: WF_LAYOUT.strip.x - WF_LAYOUT.strip.w / 2 + 30 + WAIT_CLOCK_W / 2, y: WF_LAYOUT.strip.y,
};
// Tile-styled strip under the app panel, holding the clock (and the deploy, the restart or the order)
function makeClockStrip(p) {
  const { w, h } = WF_LAYOUT.strip;
  return E(p, '', 'tile', { width: w + 'px', height: h + 'px' });
}

// The Workflow as plain-English lines, shown inside an app instance panel
const WF_LINES = ['check the request', 'ask Maria', 'wait for the decision', 'place the order', 'notify Sam'];
const WF = { top: 52, gap: 44, h: 42 }; // first line, line spacing and line height inside the WORKFLOW card
function makeWorkflowApp(p, name) {
  const { w, h } = WF_LAYOUT.app;
  const app = makeAppPanel(p, name, w, h, APP_TEXT);
  // the WORKFLOW card: under the 72 px header, 24 px from the other panel edges
  const cardW = w - 48, cardH = h - 96;
  // the card never moves: it is part of the panel's HTML, and only its lines are animated elements
  app.insertAdjacentHTML('beforeend',
    `<div style="position:absolute;left:24px;top:72px;width:${cardW}px;height:${cardH}px;`
    + `background:rgba(248,250,252,.03);border:1.5px solid ${C.line};border-radius:var(--r)">`
    + panelLabel('code', 'Workflow', 'left:20px;top:16px;padding-left:0')
    + `<div class="cur" style="position:absolute;left:12px;width:${cardW - 26}px;height:${WF.h + 2}px;`
    + `background:rgba(182,100,255,.2);border-left:4px solid ${C.violet};border-radius:var(--rs)"></div>`
    // EMPTY sits in the middle of the space under the WORKFLOW label
    + `<div class="empty mono" style="position:absolute;left:0;right:0;top:${(44 + cardH) / 2 - 20}px;`
    + 'text-align:center;font-size:30px;letter-spacing:.14em;padding-left:.14em;color:var(--red);opacity:0">EMPTY</div>'
    + '</div>');
  const card = app.lastElementChild;
  app.cur = card.querySelector('.cur'); app.empty = card.querySelector('.empty');
  app.lines = WF_LINES.map((txt, i) => {
    const line = E(card,
      `<span style="color:#6B7385;display:inline-block;width:38px">${i + 1}</span><span class="tx">${txt}</span>`
      + `<div class="ok" style="position:absolute;right:16px;top:7px">${ICON('check', 28, C.neon, 2.6)}</div>`
      + `<div class="hg" style="position:absolute;right:16px;top:6px">${ICON('hourglass', 28, C.violet, 2)}</div>`,
      'mono', {
        left: '20px', top: (WF.top + i * WF.gap) + 'px', width: (cardW - 40) + 'px', height: WF.h + 'px',
        lineHeight: WF.h + 'px', fontSize: '24px', whiteSpace: 'nowrap', paddingLeft: '10px',
      });
    line.ok = line.querySelector('.ok'); line.hg = line.querySelector('.hg'); line.tx = line.querySelector('.tx');
    line.tilt = i % 2 ? 24 : -20;
    return line;
  });
  return app;
}
// Line state: 0 to run (dim), 1 done (check), 2 waiting (hourglass), 3 under the cursor (bright, no mark yet).
// fall (0 to 1) drops the line out of the card when the app crashes.
function setWfLine(app, i, state, fall = 0) {
  const line = app.lines[i];
  line.tx.style.color = state === 0 ? C.slate : C.ink;
  line.ok.style.opacity = state === 1 ? 1 : 0;
  line.hg.style.opacity = state === 2 ? 1 : 0;
  line.hg.style.transform = `rotate(${hourglassTurn()}deg)`;
  line.style.opacity = 1 - fall;
  line.style.transform = `translateY(${fall * 260}px) rotate(${fall * line.tilt}deg)`;
}
// Cursor bar on line pos (fractional while it moves from one line to the next), with opacity o
function setWfCursor(app, pos, o) {
  app.cur.style.top = (WF.top - 1 + pos * WF.gap) + 'px';
  app.cur.style.opacity = o;
}

// The Temporal panel of chapters 3 and 4: official logo at native size in the header, "OUTSIDE THE APP" on the
// right (e.out)
function makeWfTemporalPanel(p) {
  const { w, h } = WF_LAYOUT.temporal;
  return makeTemporalPanel(p, w, h, { logoAt: [24, 20], noteAt: [24, 25], font: 18 });
}
// Event History rows of the laptop order, in the order Temporal writes them; the Signal row is in UV
const HISTORY = [
  'Workflow started: laptop for Sam', 'Request checked: $2,400', 'Approval requested: Maria',
  'Signal: approved by Maria', 'Order placed: laptop', 'Sam notified',
];
const HROW = { top: 74, gap: 52, h: 40 }; // rows inside an Event History card: first row top, spacing, height
const rowTop = i => HROW.top + i * HROW.gap;
// the chapter 3 and 4 Event History card: 20 px inside the Temporal panel, under its 70 px header
const HIST = {
  x: WF_LAYOUT.temporal.x, y: WF_LAYOUT.temporal.y + 25, w: WF_LAYOUT.temporal.w - 40, h: WF_LAYOUT.temporal.h - 90,
};
// stage y of the middle of row i in that card, where things flying into the history land
const historyRowY = i => HIST.y - HIST.h / 2 + rowTop(i) + HROW.h / 2;
// Kinds of the row tags (see setRowTag): SAVED (neon on black), REPLAYED (white on UV, the look of reused rows),
// STILL WAITING (white on violet)
const ROW_TAG_KINDS = { 'SAVED': 'saved', 'REPLAYED': 'reused', 'STILL WAITING': 'waiting' };
// makeHistoryCard with this theme's sizes: numbered rows (Signal rows in UV) and one status tag per row;
// scanH: height of the row highlight, null for none
function makeHistory(p, rows, w, h, scanH = null) {
  const rowsHtml = rows.map(txt => `<span style="color:${txt.startsWith('Signal') ? C.uv : '#141414'}">${txt}</span>`);
  return makeHistoryCard(p, rowsHtml, {
    w, h, headerFont: 20, rowTop, font: 23, rowH: HROW.h, tagTop: i => rowTop(i) + 4,
    tag: { font: 18, pad: '4px 12px', icon: 18, border: false }, scanH,
  });
}
// The laptop order history of chapters 3 and 4, with a scan highlight for the replay, the pulsing line shown in
// the slot of row 4 while the Workflow waits for the Signal, and WORKFLOW COMPLETE 26 px under the rows
function makeOrderHistory(p) {
  const jr = makeHistory(p, HISTORY, HIST.w, HIST.h, HROW.h + 6);
  // UV, as light violet is too faint on white
  jr.wait = E(jr,
    `<span class="hg" style="display:inline-block">${ICON('hourglass', 22, C.uv, 2.2)}</span>`
    + '<span>WAITING FOR A SIGNAL</span>',
    'mono', {
      left: '74px', top: rowTop(3) + 'px', height: HROW.h + 'px', fontSize: '20px', fontWeight: 700,
      letterSpacing: '.12em', color: C.uv, padding: '0 10px', display: 'flex', gap: '12px', alignItems: 'center',
    });
  jr.wait.hg = jr.wait.querySelector('.hg');
  jr.done = E(jr, `${ICON('check', 24, C.neon, 2.6)} WORKFLOW COMPLETE`, 'mono', {
    left: '50%', top: (rowTop(HISTORY.length - 1) + HROW.h + 26) + 'px', fontSize: '20px', letterSpacing: '.12em',
    color: C.neon, background: '#141414', padding: '10px 18px 10px 16px', borderRadius: 'var(--rs)',
    display: 'flex', gap: '10px', alignItems: 'center',
  });
  return jr;
}
// Status tag of row i, a key of ROW_TAG_KINDS; it pops when its label changes at `at`
function setRowTag(jr, i, t, label, at, o) {
  placeStatusTag(jr.tags[i], t, label, ROW_TAG_KINDS[label], o, at);
}
// The "waiting for a Signal" line pulses while shown
function setWaitLine(jr, o) {
  jr.wait.style.opacity = o * (0.8 + 0.2 * Math.sin(G * 4)); // never below 0.6, so it stays readable
  jr.wait.hg.style.transform = `rotate(${hourglassTurn()}deg)`;
}

