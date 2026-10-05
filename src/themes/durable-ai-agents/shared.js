// ===================== Durable AI Agents helpers (shared by the scenes of this theme)
const STEPS = [['cal', 'Calendar'], ['search', 'Restaurant'], ['food', 'Booking'], ['mail', 'Invite']];

// ===================== shared by chapters 6 and 7 (crash vs Durable Execution)
// The 4 steps of the lunch booking, as tiles in a row joined by thin links
function makeStepRow(root, svg, x0, gap, y, w, h) {
  const xs = STEPS.map((_, i) => x0 + i * gap);
  const links = [0, 1, 2].map(i => {
    const d = `M ${xs[i] + w / 2 + 2} ${y} L ${xs[i + 1] - w / 2 - 2} ${y}`;
    return path(svg, d, C.line, 2, false);
  });
  const tiles = STEPS.map(([icon, label]) => makeStep(root, icon, label, w, h));
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
function makeMemory(p, w, h) {
  const e = E(p,
    '<div class="lbl" style="position:absolute;left:22px;top:16px;display:flex;gap:10px;align-items:center">'
    + `${ICON('server', 22, C.slate, 1.8)} App memory</div>`
    + `<div class="vide mono" style="position:absolute;left:0;right:0;top:${h / 2 - 8}px;text-align:center;`
    + 'font-size:26px;letter-spacing:.14em;color:var(--red);opacity:0">EMPTY</div>',
    'tile', { width: w + 'px', height: h + 'px', textAlign: 'left' });
  e.vide = e.querySelector('.vide');
  return e;
}
// context blocks held in the app's memory: LLM results and tool results alternate,
// two per step, each centring the icon of its step (same colours as the Event History rows)
function makeMemBlocks(p, n, w, h) {
  return Array.from({ length: n }, (_, i) => {
    const isTool = i % 2 === 1;
    const icon = ICON(STEPS[Math.floor(i / 2)][0], Math.round(h / 2), isTool ? '#141414' : C.uv, 1.8);
    const b = E(p, icon, '', {
      width: w + 'px', height: h + 'px', background: isTool ? '#F3FBD2' : '#E6E7FC', borderRadius: 'var(--rs)',
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
function makeBill(p) {
  const e = E(p,
    '<div class="lbl" style="font-size:16px">LLM calls billed</div>'
    + '<div style="display:flex;align-items:baseline;gap:14px;margin-top:6px">'
    + '<div class="n" style="font-size:84px;line-height:1">0</div>'
    + '<div class="w mono" style="font-size:20px;color:var(--red);letter-spacing:.08em"></div></div>'
    + '<div class="sq" style="display:flex;gap:6px;margin-top:10px"></div>',
    'tile', { width: '380px', height: '200px', textAlign: 'left', padding: '18px 24px' });
  e.n = e.querySelector('.n'); e.w = e.querySelector('.w'); e.sq = e.querySelector('.sq');
  const cell = '<i style="display:block;width:30px;height:16px;background:rgba(248,250,252,.08);'
    + 'border-radius:3px"></i>';
  e.sq.innerHTML = cell.repeat(8);
  e.cells = e.sq.querySelectorAll('i');
  return e;
}
function setBill(b, n, wasted) {
  b.n.textContent = n; b.n.style.color = wasted ? C.red : C.ink;
  b.w.textContent = wasted ? `+${wasted} wasted` : '';
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
// screen shake around a crash, as [dx, dy]
function shakeAt(t, crashAt) {
  const k = Math.max(0, 1 - Math.abs(t - crashAt - 0.2) / 0.4);
  return [Math.sin(G * 90) * 12 * k, Math.cos(G * 77) * 8 * k];
}
// red flash intensity (0 to 1) peaking at the crash
function flashAt(t, crashAt) { return Math.max(0, 1 - Math.abs(t - crashAt) / 0.28); }
