// ===================== Temporal Agent Harness helpers (shared by the scenes of this theme)

// Extra icons, same style as the engine set: 24 grid, stroke only, square caps.
// This file is loaded by this theme only, so the other themes keep the engine set as is.
Object.assign(ICONS, {
  plane: '<path d="M12 2.5c.9 0 1.4.9 1.4 2.2v4.6l7.6 4.4v2.1l-7.6-2.3v4.2l2.4 1.8v1.8L12 20.3l-3.8 1v-1.8'
    + 'l2.4-1.8v-4.2L3 15.8v-2.1l7.6-4.4V4.7c0-1.3.5-2.2 1.4-2.2z"/>',
  bed: '<path d="M3 5v15M3 16h18v4M11 16v-5h8a2 2 0 0 1 2 2v3"/><circle cx="7" cy="13" r="2"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  lock: '<rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 7.7-8 9-4.6-1.3-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  pause: '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>',
  laptop: '<rect x="5" y="5" width="14" height="10"/><path d="M5 15l-2 4h18l-2-4"/>',
  phone: '<rect x="7" y="3" width="10" height="18"/><path d="M11 18h2"/>',
  browser: '<rect x="3" y="4" width="18" height="16"/><path d="M3 9h18M6 6.5h.01M8.5 6.5h.01"/>',
  layers: '<path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5"/>',
  stream: '<path d="M3 7h11M3 12h17M3 17h11M17 9l3 3-3 3"/>',
  cloud: '<path d="M7 19h10.5a4.5 4.5 0 0 0 .4-9A6 6 0 0 0 6.3 11.6 3.8 3.8 0 0 0 7 19z"/>',
  agent: '<rect x="4" y="8" width="16" height="12" rx="3"/><circle cx="12" cy="3.8" r="1.3"/>'
    + '<path d="M12 5.1V8M9 12.5v2M15 12.5v2"/>',
});

// Tool-call chip: the tool name (e.g. book_flight) followed by a slate argument (e.g. $480).
// A .pill in normal case; cls adds pill colors (uv, violet, neon, red). e.arg holds the argument.
function callCard(p, name, arg = '', cls = '') {
  const e = E(p, `${name}<span class="arg" style="color:var(--slate)">${arg ? ' ' + arg : ''}</span>`, 'pill ' + cls, {
    textTransform: 'none', letterSpacing: '.02em', fontSize: '22px', padding: '9px 18px 9px calc(18px + .02em)',
  });
  e.arg = e.querySelector('.arg');
  return e;
}

// Small status label (e.g. on an Event History row); its text and colors are set by setStatus().
// The transparent border keeps the same size across kinds.
function statusTag(p) {
  return E(p, '', 'mono', {
    fontSize: '15px', letterSpacing: '.1em', padding: '4px 10px', borderRadius: '4px', border: '1.5px solid',
    whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px',
  });
}
const STATUS_KINDS = {
  saved: { background: '#141414', color: C.neon, borderColor: 'transparent' },
  reused: { background: C.uv, color: '#FFFFFF', borderColor: 'transparent' },
  wait: { background: 'rgba(182,100,255,.14)', color: C.violet, borderColor: C.violet },
  bad: { background: 'rgba(255,90,95,.1)', color: C.red, borderColor: C.red },
};
// kind: 'saved' (with a check), 'reused', 'wait' or 'bad'; the DOM is only rewritten when label or kind changes
function setStatus(e, label, kind) {
  const key = kind + ':' + label;
  if (e._l === key) return;
  e._l = key;
  e.innerHTML = kind === 'saved' ? ICON('check', 16, C.neon, 2.6) + label : label;
  Object.assign(e.style, STATUS_KINDS[kind]);
}

// Counter tile: small label, big number and a short mono note next to it (e.g. MODEL CALLS BILLED: 3)
function makeCounter(p, label, w = 300) {
  const e = E(p,
    `<div class="lbl" style="font-size:16px">${label}</div>`
    + '<div style="display:flex;align-items:baseline;gap:14px;margin-top:6px">'
    + '<div class="n" style="font-size:84px;line-height:1">0</div>'
    + '<div class="note mono" style="font-size:20px;letter-spacing:.08em;white-space:nowrap"></div></div>',
    'tile', { width: w + 'px', textAlign: 'left', padding: '18px 24px' });
  e.n = e.querySelector('.n'); e.note = e.querySelector('.note');
  return e;
}
function setCounter(e, n, note = '', noteColor = C.neon) {
  e.n.textContent = n;
  e.note.textContent = note; e.note.style.color = noteColor;
}

// App instance panel: spinning gear and name at the top left, status text at the top right
function makeAppPanel(p, name, w, h) {
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
// state: 'idle', 'running' (the gear spins) or 'crashed' (red)
function setAppStatus(app, text, state) {
  const crashed = state === 'crashed';
  app.st.textContent = text;
  app.st.style.color = crashed ? C.red : C.slate;
  app.style.borderColor = crashed ? C.red : C.violet;
  gearSpin(app, state === 'running' ? 1 : 0);
}

// screen shake around a crash, as [dx, dy]
function shakeAt(t, crashAt) {
  const k = Math.max(0, 1 - Math.abs(t - crashAt - 0.2) / 0.4);
  return [Math.sin(G * 90) * 12 * k, Math.cos(G * 77) * 8 * k];
}
// red flash intensity (0 to 1) peaking at the crash
function flashAt(t, crashAt) { return Math.max(0, 1 - Math.abs(t - crashAt) / 0.28); }
