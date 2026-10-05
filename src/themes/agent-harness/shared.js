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
  pause: '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>',
  laptop: '<rect x="5" y="5" width="14" height="10"/><path d="M5 15l-2 4h18l-2-4"/>',
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
// saved: neon on black, for white panels; ok: neon outline, for the dark stage; both carry a check
const STATUS_KINDS = {
  saved: { background: '#141414', color: C.neon, borderColor: 'transparent' },
  ok: { background: 'rgba(219,255,75,.08)', color: C.neon, borderColor: C.neon },
  reused: { background: C.uv, color: '#FFFFFF', borderColor: 'transparent' },
  wait: { background: 'rgba(182,100,255,.14)', color: C.violet, borderColor: C.violet },
};
const CHECKED_KINDS = ['saved', 'ok'];
// kind: 'saved', 'ok', 'reused' or 'wait'; the DOM is only rewritten when label or kind changes
function setStatus(e, label, kind) {
  const key = kind + ':' + label;
  if (e._l === key) return;
  e._l = key;
  e.innerHTML = CHECKED_KINDS.includes(kind) ? ICON('check', 16, C.neon, 2.6) + label : label;
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

// Opaque equivalents of the .pill.uv and .pill.violet tints on the Space Black stage: a pill that sits on
// a line (a lane, a frame, a connector) needs a solid background, or the line shows through it.
const OPAQUE = { uv: '#1D1E3A', violet: '#2B1F35' };

// A list row fades in as it slides into place from dx px to its right (p from 0 to 1)
function showRow(e, p, dx = 26) {
  e.style.opacity = p;
  e.style.transform = `translateX(${(1 - p) * dx}px)`;
}

// Scale of a short swell when a value or status changes at `at`: 1 + amp at its peak, 1 outside it
function swell(t, at, amp) {
  return 1 + amp * Math.max(0, 1 - Math.abs(t - at - 0.1) / 0.25);
}

// Number of arrow head markers created so far: it makes each marker id unique in the document
let arrowHeadCount = 0;

// Arrow path (engine path() with arrow = true) whose head has an explicit fill: the engine's head uses
// fill="context-stroke", which WebKit (Safari) does not render. One marker per SVG layer and color,
// cached on the layer by color, so any CSS color works and no id selector is parsed.
function arrowPath(svg, d, color, w, dash = null) {
  const p = path(svg, d, color, w, true, dash);
  svg._heads ??= new Map();
  if (!svg._heads.has(color)) {
    arrowHeadCount += 1;
    const id = `ah-head-${arrowHeadCount}`;
    const marker = document.createElementNS(SVGNS, 'marker');
    const attrs = { id, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 5, markerHeight: 5,
      orient: 'auto-start-reverse' };
    for (const [name, value] of Object.entries(attrs)) marker.setAttribute(name, value);
    const head = document.createElementNS(SVGNS, 'path');
    head.setAttribute('d', 'M0,0 L10,5 L0,10 z');
    head.setAttribute('fill', color);
    marker.appendChild(head);
    svg.querySelector('defs').appendChild(marker);
    svg._heads.set(color, `url(#${id})`);
  }
  p._marker = svg._heads.get(color);
  return p;
}
