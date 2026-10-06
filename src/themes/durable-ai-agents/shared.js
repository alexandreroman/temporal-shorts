// ===================== Durable AI Agents helpers (shared by the scenes of this theme)
// Extra icons, same style as the engine set: 24 grid, stroke only, square caps.
Object.assign(ICONS, {
  sun: '<circle cx="12" cy="12" r="4"/>'
    + '<path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  food: '<path d="M7 3v18M4 3v5a3 3 0 0 0 6 0V3M17 21V3c-2.5 2-3 6-1 9h1"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M15 9.2c-.6-.9-1.7-1.4-3-1.4-1.7 0-3 .9-3 2.1 0 2.8 6 1.5 6 4.3'
    + ' 0 1.2-1.3 2.1-3 2.1-1.4 0-2.6-.6-3.1-1.6M12 6v1.8M12 16.3V18"/>',
});
// The 4 steps of the lunch booking: tile icon and label, the action of chapter 5, then the tool and its result
const STEPS = [
  { icon: 'cal', label: 'Calendar', action: 'Check the calendar', tool: 'Calendar', result: 'Thu 12:30 is free' },
  { icon: 'search', label: 'Restaurant', action: 'Find a restaurant', tool: 'Search', result: 'Chez Paulette' },
  { icon: 'food', label: 'Booking', action: 'Book a table', tool: 'Booking', result: 'table for 2, confirmed' },
  { icon: 'mail', label: 'Invite', action: 'Invite Marie', tool: 'Email', result: 'invite sent' },
];
// The steps as [icon, label], for makeStepRow
const STEP_TILES = STEPS.map(step => [step.icon, step.label]);

// The app of chapters 1, 2 and 4: a window with a gear that gearSpin() turns while the app works.
// Its .app* styles are in this theme's index.html.
function makeApp(parent) {
  const root = E(parent, `
   <div class="app-win">
     <div class="app-bar"><i></i><i></i><i></i></div>
     <div class="app-lines"><b style="width:70%"></b><b style="width:45%"></b><b style="width:60%"></b></div>
     <div class="app-gear">${ICON('gear', 46, '#F8FAFC')}</div>
   </div>
   <div class="app-label">APP</div>`, 'app');
  root.gear = root.querySelector('.app-gear');
  return root;
}

// ===================== shared by chapters 6 and 7 (crash vs Durable Execution)
function makeMemory(p, w, h) {
  const e = E(p,
    panelLabel('server', 'App memory', 'left:22px;top:16px')
    + `<div class="empty mono" style="position:absolute;left:0;right:0;top:${h / 2 - 8}px;text-align:center;`
    + 'font-size:26px;letter-spacing:.14em;padding-left:.14em;color:var(--red);opacity:0">EMPTY</div>',
    'tile', { width: w + 'px', height: h + 'px', textAlign: 'left' });
  e.empty = e.querySelector('.empty');
  return e;
}
// context blocks held in the app's memory: LLM results and tool results alternate,
// two per step, each centring the icon of its step (same colours as the Event History rows)
function makeMemBlocks(p, n, w, h) {
  return Array.from({ length: n }, (_, i) => {
    const isTool = i % 2 === 1;
    const icon = ICON(STEPS[Math.floor(i / 2)].icon, Math.round(h / 2), isTool ? '#141414' : C.uv, 1.8);
    const b = E(p, icon, '', {
      width: w + 'px', height: h + 'px', background: isTool ? C.neonTint : C.uvTint, borderRadius: 'var(--rs)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    });
    b.tilt = isTool ? 40 : -35;
    return b;
  });
}
// grow: pop-in progress; fall: crash progress (the block drops, tilts and fades)
function placeMemBlock(b, x, y, grow, fall, dx = 0, dy = 0, o = 1) {
  place(b, x + dx, y + fall * 300 + dy, grow, clamp(grow * 2) * (1 - fall) * o, fall * b.tilt);
}
// LLM calls billed: a counter tile (red note) with a strip of 8 cells, one per call
function makeBill(p) {
  const e = makeCounter(p, 'LLM calls billed', 380);
  e.style.height = '200px';
  e.note.style.color = C.red;
  const cell = '<i style="display:block;width:30px;height:16px;background:rgba(248,250,252,.08);'
    + 'border-radius:3px"></i>';
  e.insertAdjacentHTML('beforeend',
    `<div class="sq" style="display:flex;gap:6px;margin-top:10px">${cell.repeat(8)}</div>`);
  e.cells = e.querySelectorAll('.sq i');
  return e;
}
// n calls billed, the last `wasted` of them in red; note: the text next to the number
function setBill(b, n, wasted, note = wasted ? `+${wasted} wasted` : '') {
  b.n.textContent = n; b.n.style.color = wasted ? C.red : C.ink;
  b.note.textContent = note;
  b.cells.forEach((q, i) => q.style.background = i < n ? (i >= n - wasted ? C.red : C.uv) : 'rgba(248,250,252,.08)');
}
function makeTicket(p) {
  const e = E(p,
    `<div style="display:flex;align-items:center;gap:12px">${ICON('ticket', 34, C.ink, 1.6)}`
    + '<span class="n mono" style="font-size:20px;letter-spacing:.08em">1 BOOKING</span></div>',
    '', { padding: '10px 16px', border: '1.5px solid ' + C.slate, borderRadius: 'var(--rs)' });
  e.n = e.querySelector('.n');
  return e;
}
