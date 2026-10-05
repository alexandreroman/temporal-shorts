// ===================== Human-in-the-Loop helpers (shared by the scenes of this theme)
// Extra stroke icons (24 grid), in the hand-drawn style of engine.js
Object.assign(ICONS, {
  hourglass: '<path d="M6 3h12M6 21h12"/><path d="M8 3v3.5l4 5.5-4 5.5V21M16 3v3.5L12 12l4 5.5V21"/>'
    + '<path d="M10 18.5h4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2.2"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 1.8H4.2z"/><path d="M10 21.2h4"/>',
  db: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.5"/><path d="M4.5 5.5v13c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-13'
    + 'M4.5 12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5"/>',
  flag: '<path d="M5 21V3M5 4h13l-3 4.5 3 4.5H5"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  cart: '<path d="M2 4h3l2.5 11h11L21 7H6.2"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
  laptop: '<rect x="5" y="5" width="14" height="10"/><path d="M2.5 19h19"/>',
  clipboard: '<rect x="5" y="4.5" width="14" height="16.5"/><path d="M9 3h6v3H9zM8.5 13.5l2.5 2.5 4.5-5"/>',
  pen: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3M13 20.5h8"/>',
  bot: '<rect x="4" y="8" width="16" height="12"/><path d="M12 4.5V8M9 13h.01M15 13h.01M9.5 16.5h5"/>'
    + '<circle cx="12" cy="3.5" r="1"/>',
  up: '<path d="M12 20V5M6 11l6-6 6 6"/>',
});

// The 4 steps of the laptop order, used by chapters 1, 3 and 4
const STEPS = [['clipboard', 'Check'], ['user', 'Approval'], ['cart', 'Order'], ['mail', 'Notify']];
// Shared step row geometry, so the same tiles sit at the same place in every chapter that shows them
const ROW = { x0: 465, gap: 330, w: 260, h: 104 };

// The steps as tiles in a row joined by thin links; each tile also carries an hourglass for the waiting state
function makeStepRow(root, svg, y) {
  const xs = STEPS.map((_, i) => ROW.x0 + i * ROW.gap);
  const links = [0, 1, 2].map(i => {
    const d = `M ${xs[i] + ROW.w / 2 + 2} ${y} L ${xs[i + 1] - ROW.w / 2 - 2} ${y}`;
    return path(svg, d, C.line, 2, false);
  });
  const tiles = STEPS.map(([icon, label]) => {
    const e = makeStep(root, icon, label, ROW.w, ROW.h);
    e.insertAdjacentHTML('beforeend',
      '<div class="hg" style="position:absolute;right:10px;top:10px;opacity:0">'
      + `${ICON('hourglass', 28, C.violet, 2)}</div>`);
    e.hg = e.querySelector('.hg');
    return e;
  });
  return { xs, y, tiles, links };
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
// states: one setStep value per tile; tiles pop in from a, links draw just after
function placeStepRow(row, t, a, states, dx = 0, dy = 0, o = 1) {
  row.tiles.forEach((e, i) => {
    setStep(e, states[i]);
    const p = P(t, a + i * 0.12, 0.45, backOut);
    place(e, row.xs[i] + dx, row.y + dy, p, clamp(p * 2) * o);
  });
  row.links.forEach((l, i) => draw(l, P(t, a + 0.4 + i * 0.12, 0.35), o));
}

// ===================== people and the approval request
// Round avatar with a person icon and a label under it; place() centers the circle
function makeAvatar(p, label, size = 110, ring = C.violet) {
  const e = E(p,
    `<div style="width:${size}px;height:${size}px;border-radius:50%;border:2px solid ${ring};`
    + 'background:var(--surface);display:flex;align-items:center;justify-content:center">'
    + `${ICON('user', Math.round(size / 2), C.ink, 1.6)}</div>`
    + (label ? `<div class="lbl" style="position:absolute;left:50%;top:calc(100% + 16px);transform:translateX(-50%);`
      + `color:var(--ink)">${label}</div>` : ''),
    '', { width: size + 'px', height: size + 'px' });
  return e;
}
// Face of an analog clock as SVG markup: 12 ticks, hour and minute hands (see setClock)
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
    + `<circle cx="50" cy="50" r="4" fill="${col}"/></svg>`;
}
// hours: clock time in hours; the minute hand turns once per hour, the hour hand once per 12 hours
function setClock(root, hours) {
  root.querySelector('.hh').setAttribute('transform', `rotate(${(hours * 30) % 360} 50 50)`);
  root.querySelector('.mh').setAttribute('transform', `rotate(${(hours * 360) % 360} 50 50)`);
}
// White approval request card with a ticking mini clock, Approve (brand UV) and Reject (outline) buttons.
// k scales every size natively (fonts, paddings, width), so a larger card stays sharp at rest.
function makeApprovalCard(p, k = 1) {
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
    '', {
      width: px(400), background: C.ink, color: '#141414', padding: `${px(20)} ${px(26)} ${px(26)}`,
      borderLeft: `${px(6)} solid ${C.violet}`, borderRadius: 'var(--r)',
    });
  e.clk = e.querySelector('.clk'); e.ap = e.querySelector('.ap'); e.apt = e.querySelector('.apt');
  e.ring = e.querySelector('.ring'); e.rj = e.querySelector('.rj');
  return e;
}
// Tap on Approve at `at`: a ripple, a neon flash, then the button stays approved (check + "Approved")
function tapApprove(card, t, at) {
  const ripple = P(t, at, 0.5, x => x);
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
function makeWaitClock(p, caption, size = 110) {
  const e = E(p,
    `<div class="clk">${clockFace(size)}</div>`
    // fixed text width: a caption change must not move the clock
    + '<div style="width:260px"><div class="day mono" style="font-size:46px;line-height:1;letter-spacing:.04em">'
    + 'DAY 1</div>'
    + `<div class="cap lbl" style="font-size:18px;margin-top:10px;padding-left:0">${caption}</div></div>`,
    '', { display: 'flex', alignItems: 'center', gap: '24px' });
  e.clk = e.querySelector('.clk'); e.day = e.querySelector('.day'); e.cap = e.querySelector('.cap');
  return e;
}
function setWaitClock(e, hours, day) {
  setClock(e.clk, hours);
  e.day.textContent = 'DAY ' + day;
}

// ===================== app and Temporal panels (chapters 2, 3 and 4)
// App panel: gear + name on the left of the header, a status text on the right
function makeAppPanel(p, name, w, h) {
  return E(p,
    '<div style="position:absolute;left:24px;top:20px;display:flex;align-items:center;gap:12px">'
    + `<div class="gear">${ICON('gear', 30, C.ink, 1.8)}</div>`
    + `<span class="mono" style="font-size:20px;letter-spacing:.1em">${name}</span></div>`
    + '<div class="st mono" style="position:absolute;right:24px;top:26px;font-size:16px;letter-spacing:.08em;'
    + 'color:var(--slate)"></div>',
    'tile', { width: w + 'px', height: h + 'px', textAlign: 'left' });
}
// state: 'idle', 'running' (the gear spins), 'waiting' (violet, gear still) or 'crashed' (red)
function setAppStatus(app, text, state) {
  const gear = app.querySelector('.gear'), st = app.querySelector('.st');
  st.textContent = text;
  st.style.color = { crashed: C.red, waiting: C.violet }[state] || C.slate;
  app.style.borderColor = state === 'crashed' ? C.red : C.violet;
  gear.style.transform = `rotate(${state === 'running' ? G * 220 : 0}deg)`;
  gear.style.opacity = state === 'running' ? 1 : 0.35;
}

// The Workflow as plain-English lines, shown inside an app instance panel
const WF_LINES = ['check the request', 'ask Maria', 'wait for the decision', 'place the order', 'notify Sam'];
const WF = { top: 54, gap: 40 }; // first line and line spacing inside the WORKFLOW card
function makeWorkflowApp(p, name) {
  const app = makeAppPanel(p, name, 780, 360);
  const card = E(app,
    '<div class="lbl" style="position:absolute;left:20px;top:16px;display:flex;gap:10px;align-items:center;'
    + `padding-left:0">${ICON('code', 22, C.slate, 1.8)} Workflow</div>`
    + '<div class="cur" style="position:absolute;left:12px;width:706px;height:38px;background:rgba(182,100,255,.2);'
    + `border-left:4px solid ${C.violet};border-radius:var(--rs)"></div>`
    + '<div class="vide mono" style="position:absolute;left:0;right:0;top:118px;text-align:center;font-size:26px;'
    + 'letter-spacing:.14em;padding-left:.14em;color:var(--red);opacity:0">EMPTY</div>',
    '', {
      left: '24px', top: '76px', width: '732px', height: '260px', background: 'rgba(248,250,252,.03)',
      border: '1.5px solid ' + C.line, borderRadius: 'var(--r)', transform: 'none',
    });
  card.style.opacity = 1; // E() creates hidden elements; the card always shows with its panel
  app.cur = card.querySelector('.cur'); app.vide = card.querySelector('.vide');
  app.lines = WF_LINES.map((txt, i) => {
    const line = E(card,
      `<span style="color:#6B7385;display:inline-block;width:34px">${i + 1}</span><span class="tx">${txt}</span>`
      + `<div class="ok" style="position:absolute;right:16px;top:5px">${ICON('check', 26, C.neon, 2.6)}</div>`
      + `<div class="hg" style="position:absolute;right:16px;top:4px">${ICON('hourglass', 26, C.violet, 2)}</div>`,
      'mono', {
        left: '20px', top: (WF.top + i * WF.gap) + 'px', width: '692px', height: '36px', lineHeight: '36px',
        fontSize: '22px', whiteSpace: 'nowrap', paddingLeft: '10px', transform: 'none',
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

// Temporal panel: official logo at native size in the header, "OUTSIDE THE APP" on the right
function makeTemporalPanel(p) {
  const e = E(p,
    `<img src="${LOGO}" style="position:absolute;left:24px;top:20px;height:34px;display:block">`
    + '<div class="out lbl" style="position:absolute;right:24px;top:26px;font-size:16px">Outside the app</div>',
    'tile', { width: '920px', height: '530px', borderColor: C.uv });
  e.out = e.querySelector('.out');
  return e;
}
// Event History rows, in the order Temporal writes them; row 4 (the Signal) is in UV
const HISTORY = [
  'Workflow started: laptop for Sam', 'Request checked: $2,400', 'Approval requested: Maria',
  'Signal: approved by Maria', 'Order placed: laptop', 'Sam notified',
];
const HIST = { x: 1380, y: 580, cardX: 1050, row0: 448, rowGap: 44 }; // Event History card and its rows
const rowY = i => HIST.row0 + i * HIST.rowGap;
// White Event History card: numbered rows with status tags, a scan highlight and the "waiting for a Signal" line.
// rows, w and h default to the laptop order of chapters 3 and 4; Signal rows are written in UV.
function makeHistory(p, rows = HISTORY, w = 880, h = 440) {
  const jr = E(p,
    '<div class="mono" style="position:absolute;left:26px;top:20px;font-size:18px;letter-spacing:.14em;'
    + `color:#141414;display:flex;gap:10px;align-items:center">${ICON('book', 22, '#141414', 1.8)}`
    + ' EVENT HISTORY</div>',
    '', { width: w + 'px', height: h + 'px', background: '#F8FAFC', color: '#141414', borderRadius: 'var(--r)' });
  jr.scan = E(jr, '', '', {
    left: '18px', width: (w - 36) + 'px', height: '42px', background: 'rgba(182,100,255,.28)', transform: 'none',
    borderRadius: 'var(--rs)',
  });
  jr.rows = rows.map((txt, i) => E(jr,
    `<span style="color:#8A93A6;display:inline-block;width:34px">${i + 1}</span>`
    + `<span style="color:${txt.startsWith('Signal') ? C.uv : '#141414'}">${txt}</span>`,
    'mono', {
      left: '26px', top: (70 + i * 44) + 'px', fontSize: '21px', whiteSpace: 'nowrap', padding: '4px 10px',
      transform: 'none', width: (w - 52) + 'px',
    }));
  jr.tags = rows.map((_, i) => E(jr, '', 'mono', {
    left: 'auto', right: '36px', top: (74 + i * 44) + 'px', fontSize: '15px', letterSpacing: '.1em',
    padding: '4px 10px', borderRadius: '4px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center',
    gap: '6px', transformOrigin: 'right center',
  }));
  // un-numbered line in the slot of row 4 while the Workflow waits; UV, as light violet is too faint on white
  jr.wait = E(jr,
    `<span class="hg" style="display:inline-block">${ICON('hourglass', 22, C.uv, 2.2)}</span>`
    + '<span>WAITING FOR A SIGNAL</span>',
    'mono', {
      left: '70px', top: (70 + 3 * 44) + 'px', fontSize: '18px', fontWeight: 700, letterSpacing: '.12em', color: C.uv,
      padding: '7px 10px', display: 'flex', gap: '12px', alignItems: 'center', transform: 'none',
    });
  jr.wait.hg = jr.wait.querySelector('.hg');
  jr.done = E(jr, `${ICON('check', 22, C.neon, 2.6)} WORKFLOW COMPLETE`, 'mono', {
    left: '50%', top: '370px', fontSize: '18px', letterSpacing: '.12em', color: C.neon, background: '#141414',
    padding: '10px 18px 10px 16px', borderRadius: 'var(--rs)', display: 'flex', gap: '10px', alignItems: 'center',
  });
  return jr;
}
// Row i fades in from the right just before it is saved
function showRow(jr, i, p) {
  jr.rows[i].style.opacity = p;
  jr.rows[i].style.transform = `translateX(${(1 - p) * 26}px)`;
}
// Status tag of row i: 'SAVED' (neon on black) or 'REPLAYED' (white on UV); pops when its label changes at `at`
function setRowTag(jr, i, t, label, at, o) {
  const e = jr.tags[i];
  if (e._l !== label) {
    e._l = label;
    const saved = label === 'SAVED';
    e.innerHTML = saved ? ICON('check', 16, C.neon, 2.6) + label : label;
    e.style.background = saved ? '#141414' : C.uv; e.style.color = saved ? C.neon : '#FFFFFF';
  }
  e.style.opacity = o;
  e.style.transform = `scale(${1 + 0.14 * Math.max(0, 1 - Math.abs(t - at - 0.1) / 0.25)})`;
}
// The "waiting for a Signal" line pulses while shown
function setWaitLine(jr, o) {
  jr.wait.style.opacity = o * (0.8 + 0.2 * Math.sin(G * 4)); // never below 0.6, so it stays readable
  jr.wait.hg.style.transform = `rotate(${hourglassTurn()}deg)`;
}

// ===================== small shared pieces
function makeTicket(p, text) {
  const e = E(p,
    `<div style="display:flex;align-items:center;gap:12px">${ICON('laptop', 34, C.ink, 1.6)}`
    + `<span class="n mono" style="font-size:20px;letter-spacing:.08em">${text}</span></div>`,
    '', { padding: '10px 16px', border: '1.5px solid ' + C.slate, borderRadius: 'var(--rs)' });
  e.n = e.querySelector('.n');
  return e;
}
// screen shake around a crash, as [dx, dy]
function shakeAt(t, crashAt) {
  const k = Math.max(0, 1 - Math.abs(t - crashAt - 0.2) / 0.4);
  return [Math.sin(G * 90) * 12 * k, Math.cos(G * 77) * 8 * k];
}
// red flash intensity (0 to 1) peaking at the crash
function flashAt(t, crashAt) { return Math.max(0, 1 - Math.abs(t - crashAt) / 0.28); }
