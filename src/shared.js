// ===================== shared helpers (brand style)
const C = {
  uv: '#444CE7', violet: '#B664FF', neon: '#DBFF4B', red: '#FF5A5F', ink: '#F8FAFC', slate: '#94A3B8', line: '#3A4150',
};
// official Temporal logo (white horizontal lockup)
const LOGO = 'assets/temporal-logo-horizontal-light-cropped.svg';
const tag = (p, html, cls = '') => E(p, html, 'pill ' + cls);
// icon + label centred in the tile; padding-left offsets the trailing letter-spacing
function iconTile(p, icon, label, w, h, col = C.ink) {
  const big = h > 130;
  const labelHtml = label
    ? `<div class="mono" style="font-size:${big ? 20 : 18}px;letter-spacing:.1em;padding-left:.1em;`
      + `text-transform:uppercase;margin-top:12px">${label}</div>`
    : '';
  return E(p, `${ICON(icon, big ? 52 : 42, col)}${labelHtml}`, 'tile', {
    width: w + 'px', height: h + 'px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
  });
}
function makeStep(p, icon, label, w, h) {
  const e = iconTile(p, icon, label, w, h);
  e.insertAdjacentHTML('beforeend',
    '<div class="spin" style="position:absolute;right:12px;top:12px;width:26px;height:26px;'
    + `border:3px solid rgba(182,100,255,.25);border-top-color:${C.violet};border-radius:50%;opacity:0"></div>`
    + `<div class="ok" style="position:absolute;right:8px;top:8px;opacity:0">${ICON('check', 32, C.neon, 2.6)}</div>`
    + `<div class="ko" style="position:absolute;right:8px;top:8px;opacity:0">${ICON('x', 32, C.red, 2.6)}</div>`);
  e.spin = e.querySelector('.spin'); e.ok = e.querySelector('.ok'); e.ko = e.querySelector('.ko');
  return e;
}
// 0 pending, 1 running, 2 done, 3 failed
function stepState(e, st) {
  e.style.borderColor = [C.line, C.violet, C.neon, C.red][st];
  e.spin.style.opacity = st === 1 ? 1 : 0; e.spin.style.transform = `rotate(${G * 400}deg)`;
  e.ok.style.opacity = st === 2 ? 1 : 0; e.ko.style.opacity = st === 3 ? 1 : 0;
}
// fly: appear at (x0,y0) at a, travel to (x1,y1) during [b, b+d], absorbed (shrink+fade) at k if given
function fly(e, t, a, x0, y0, b, d, x1, y1, k = null, kx = 0, ky = 0) {
  const ap = P(t, a, 0.45, backOut), f = P(t, b, d), ab = k === null ? 0 : P(t, k, 0.4, easeIn);
  const x = lerp(lerp(x0, x1, f), kx, ab), y = lerp(lerp(y0, y1, f), ky, ab);
  place(e, x, y, ap * (1 - 0.65 * ab), clamp(ap * 2) * (1 - ab));
}
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
// context blocks held in the app's memory: LLM results and tool results alternate
function makeMemBlocks(p, n, w, h) {
  return Array.from({ length: n }, (_, i) => {
    const b = E(p, '', '', {
      width: w + 'px', height: h + 'px', background: i % 2 ? '#F3FBD2' : '#E6E7FC', borderRadius: 'var(--rs)',
    });
    b.tilt = i % 2 ? 40 : -35;
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
