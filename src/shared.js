// ===================== shared helpers (brand style)
const C = { uv: '#444CE7', violet: '#B664FF', neon: '#DBFF4B', red: '#FF5A5F', ink: '#F8FAFC', slate: '#94A3B8', line: '#3A4150' };
const tag = (p, html, cls = '') => E(p, html, 'pill ' + cls);
// icon + label centred in the tile; padding-left offsets the trailing letter-spacing
function iconTile(p, icon, label, w = 200, h = 150, col = C.ink) {
  const big = h > 130;
  return E(p, `${ICON(icon, big ? 52 : 42, col)}${label ? `<div class="mono" style="font-size:${big ? 20 : 18}px;letter-spacing:.1em;padding-left:.1em;text-transform:uppercase;margin-top:12px">${label}</div>` : ''}`, 'tile', { width: w + 'px', height: h + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' });
}
function makeStep(p, icon, label, w = 280, h = 140) {
  const e = iconTile(p, icon, label, w, h);
  e.insertAdjacentHTML('beforeend', `<div class="spin" style="position:absolute;right:12px;top:12px;width:26px;height:26px;border:3px solid rgba(182,100,255,.25);border-top-color:${C.violet};border-radius:50%;opacity:0"></div><div class="ok" style="position:absolute;right:8px;top:8px;opacity:0">${ICON('check', 32, C.neon, 2.6)}</div><div class="ko" style="position:absolute;right:8px;top:8px;opacity:0">${ICON('x', 32, C.red, 2.6)}</div>`);
  e.spin = e.querySelector('.spin'); e.ok = e.querySelector('.ok'); e.ko = e.querySelector('.ko');
  return e;
}
// 0 pending, 1 running, 2 done, 3 failed
function stepState(e, st) {
  e.style.borderColor = ['#3A4150', C.violet, C.neon, C.red][st];
  e.spin.style.opacity = st === 1 ? 1 : 0; e.spin.style.transform = `rotate(${G * 400}deg)`;
  e.ok.style.opacity = st === 2 ? 1 : 0; e.ko.style.opacity = st === 3 ? 1 : 0;
}
function slideIn(e, t, a, x0, x1, y, out = 0) { const p = P(t, a, 0.8); place(e, lerp(x0, x1, p), y, 1, P(t, a, 0.3) * (1 - out)); }
// fly: appear at (x0,y0) at a, travel to (x1,y1) during [b, b+d], absorbed (shrink+fade) at k if given
function fly(e, t, a, x0, y0, b, d, x1, y1, k = null, kx = 0, ky = 0) {
  const ap = P(t, a, 0.45, backOut), f = P(t, b, d), ab = k === null ? 0 : P(t, k, 0.4, easeIn);
  place(e, lerp(lerp(x0, x1, f), kx, ab), lerp(lerp(y0, y1, f), ky, ab), ap * (1 - 0.65 * ab), clamp(ap * 2) * (1 - ab));
}
const STEPS = [['cal', 'Calendar'], ['search', 'Restaurant'], ['food', 'Booking'], ['mail', 'Invite']];
