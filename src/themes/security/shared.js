// ===================== Security with Temporal helpers (shared by the scenes of this theme)

// ---------- extra icons (stroke, 24 grid, same style as ICONS in engine.js); `shield`, `key`, `lock` and `server`
// come from the engine set
Object.assign(ICONS, {
  // a closed door in its frame, with its handle: no inbound port
  door: '<path d="M3 21h18M6 21V3h12v18"/><path d="M14.5 11v2.5"/>',
  // an identity badge on its clip: a photo and a name line
  badge: '<rect x="4" y="5" width="16" height="16"/><path d="M10 2.5h4V7h-4z"/><circle cx="12" cy="11.5" r="2"/>'
    + '<path d="M8.5 17.5c.7-1.4 2-2.1 3.5-2.1s2.8.7 3.5 2.1"/>',
  // a key management service (KMS): a vault holding a key
  kms: '<rect x="3" y="4" width="18" height="16"/><circle cx="8.5" cy="12" r="2.5"/><path d="M11 12h6.5M15.5 12v2.5"/>',
});

// ---------- the running example: Nora sends €25,000 to Leo, one payload carried through every chapter
// The payload's fields, [key, value], in the order the card lists them
const TRANSFER = [
  ['from', 'FR76 3000 6000 0112 3456 7890 189'],
  ['to', 'DE89 3704 0044 0532 0130 00'],
  ['name', 'Leo Martin'],
  ['amount', '€25,000'],
];
// Glyphs of the ciphertext that replaces a scrambled value (the base64 alphabet)
const CIPHER_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// Ciphertext glyph of character `col` of field `row`: always the same, so a sealed payload reads the same in every
// scene; `salt` draws another glyph (the flicker at the front of a scramble)
const cipherGlyph = (row, col, salt = 0) =>
  CIPHER_GLYPHS[Math.floor(hash(row * 97 + col + salt) * CIPHER_GLYPHS.length)];

// ---------- padlock
// How far the shackle of an open padlock rises above the body, in units of its 24 grid
const LOCK_LIFT = 4;
// Seal progress at which the shackle of setLock() lands in the body (backOut first reaches 1 there)
const LOCK_SHUT = 0.37;
// Stroke padlock in a size px box (24 grid, like ICON('lock')), open or shut by setLock(). Its body is filled with
// the stage black, so the shackle's legs hide inside it as the lock snaps shut. css: extra styles of its box.
function makeLock(p, size, stroke = 1.8, css = {}) {
  const e = E(p,
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke-width="${stroke}"`
    + ' stroke-linecap="square" stroke-linejoin="miter" style="display:block;overflow:visible">'
    + '<path class="shackle" d="M8 11V7a4 4 0 0 1 8 0v4"/>'
    + `<rect x="5" y="11" width="14" height="10" fill="${C.bg}"/><path d="M12 15v2"/></svg>`,
    '', { width: size + 'px', height: size + 'px', ...css });
  e.size = size;
  e.svg = e.querySelector('svg');
  e.shackle = e.querySelector('.shackle');
  return e;
}
// seal: 0 open (the shackle lifted out of the body) to 1 shut. Pass a linear progress: the shackle snaps down with a
// backOut overshoot, dipping into the body before it settles, and the lock turns neon and flashes as it lands.
function setLock(lock, seal) {
  const s = clamp(seal);
  const lift = (1 - backOut(s)) * LOCK_LIFT;
  lock.shackle.setAttribute('transform', `translate(0 ${-lift})`);
  const shut = s >= LOCK_SHUT;
  lock.svg.setAttribute('stroke', shut ? C.neon : C.ink);
  // a steady glow once shut, brighter for an instant as the shackle lands
  const glow = shut ? 0.6 + 0.4 * Math.max(0, 1 - (s - LOCK_SHUT) / 0.4) : 0;
  lock.svg.style.filter = glow
    ? `drop-shadow(0 0 ${Math.round(lock.size * 0.3 * glow)}px rgba(${RGB.neon},${(0.8 * glow).toFixed(3)}))`
    : 'none';
}

// ---------- the payload card
// A value with its first characters replaced by ciphertext, left to right, as s goes from 0 to 1: the ciphertext
// in violet, then two flickering glyphs at its front, then the clear rest. Spaces stay spaces and the font is
// monospace, so the value keeps its width.
function scrambledHtml(row, text, s) {
  if (s <= 0) return text;
  const n = Math.round(clamp(s) * text.length);
  const frontEnd = s < 1 ? Math.min(text.length, n + 2) : n;
  const flicker = Math.floor(s * 90); // the front glyphs change several times per scrambled character
  const glyph = (col, salt) => (text[col] === ' ' ? ' ' : cipherGlyph(row, col, salt));
  let cipher = '', front = '';
  for (let col = 0; col < n; col++) cipher += glyph(col, 0);
  for (let col = n; col < frontEnd; col++) front += glyph(col, 1000 + flicker * 31);
  return `<span style="color:${C.violet}">${cipher}</span><span style="color:${C.slate}">${front}</span>`
    + text.slice(frontEnd);
}
// The payload card of the transfer, w px wide: a PAYLOAD heading, the fields of TRANSFER (key above value, in
// monospace) and a padlock on its top edge. Every size follows w (at 420 px, the values are 19 px), so cards of two
// widths look alike, one a scaled copy of the other; pass an even w, so the card rests on whole pixels. Returns the
// card, with .rows[i].e and .rows[i].value (the row and value elements of field i), .lock, .w and .h (its size in
// px); setPayload() sets its state.
function makePayload(p, { w = 420 } = {}) {
  const u = w / 420;
  const px = n => Math.round(n * u);
  const pad = { top: px(24), x: px(20), bottom: px(20) };
  const head = { line: px(20), font: 14 * u, gap: px(12) };
  const key = { line: px(18), font: 14 * u };
  const value = { line: px(26), font: 19 * u };
  const rowGap = px(10);
  const content = pad.top + head.line + head.gap + TRANSFER.length * (key.line + value.line)
    + (TRANSFER.length - 1) * rowGap + pad.bottom;
  const h = 2 * Math.ceil(content / 2); // even, so the card centers on whole pixels
  const badge = 2 * px(20); // the lock's round badge, even, so it centers on whole pixels

  const rowsHtml = TRANSFER.map(([k], i) => `<div class="row" style="margin-top:${i ? rowGap : 0}px">`
    + `<div class="mono" style="font-size:${key.font}px;line-height:${key.line}px;color:${C.slate}">${k}</div>`
    + `<div class="mono value" style="font-size:${value.font}px;line-height:${value.line}px;white-space:pre"></div>`
    + '</div>').join('');
  const card = E(p,
    `<div class="alarm" style="position:absolute;inset:-1.5px;border:1.5px solid ${C.red};border-radius:var(--r);`
    + `background:rgba(${RGB.red},.12);opacity:0"></div>`
    + `<div class="mono" style="font-size:${head.font}px;line-height:${head.line}px;letter-spacing:.14em;`
    + `color:${C.slate};margin-bottom:${head.gap}px">PAYLOAD</div>`
    + rowsHtml,
    'tile', {
      width: w + 'px', height: h + 'px', textAlign: 'left',
      padding: `${pad.top}px ${pad.x}px ${pad.bottom}px`,
    });
  // centered on the card's top edge; offsets from the padding box, inside the card's 1.5 px border
  const lockBadge = E(card, '', '', {
    left: (w - badge) / 2 - 1.5 + 'px', top: -badge / 2 - 1.5 + 'px', width: badge + 'px', height: badge + 'px',
    borderRadius: '50%', background: C.bg, border: `1.5px solid ${C.line}`, opacity: 1,
  });
  const lockSize = 2 * px(12);
  // centered in the badge, offsets from inside its 1.5 px border
  card.lock = makeLock(lockBadge, lockSize, 1.9, {
    left: (badge - lockSize) / 2 - 1.5 + 'px', top: (badge - lockSize) / 2 - 1.5 + 'px', opacity: 1,
  });
  card.lockBadge = lockBadge;
  card.alarm = card.querySelector('.alarm');
  card.rows = [...card.querySelectorAll('.row')].map((e, i) => ({ e, value: e.querySelector('.value'), i }));
  card.u = u;
  card.w = w;
  card.h = h;
  setPayload(card);
  return card;
}
// State of a payload card: seal (0 to 1, a linear progress) snaps its lock shut (see setLock); scramble (0 to 1)
// turns its values into ciphertext left to right (scrambledHtml), one number for every field or an array of one per
// field (to scramble the IBANs alone); red (0 to 1) tints the card for an alarm. With no state, the card is open
// and in clear.
function setPayload(card, { seal = 0, scramble = 0, red = 0 } = {}) {
  setLock(card.lock, seal);
  card.lockBadge.style.borderColor = seal >= LOCK_SHUT ? C.neon : C.line;
  card.rows.forEach(row => {
    const s = Array.isArray(scramble) ? scramble[row.i] : scramble;
    const html = scrambledHtml(row.i, TRANSFER[row.i][1], s);
    // rewritten only when it changes: the same state always gives the same text
    if (row.value._html !== html) {
      row.value.innerHTML = html;
      row.value._html = html;
    }
  });
  card.alarm.style.opacity = clamp(red);
  card.style.boxShadow = glowShadow(RGB.red, clamp(red), { blur: Math.round(40 * card.u), alpha: 0.45 });
}

// ---------- the journey lane
// Stage coordinates of the lane shared by every lane scene, at camera rest (scale 1), left to right: YOUR
// ENVIRONMENT (env, a box) with the Worker in it, the wire from x0 to x1, TEMPORAL (a box) with the Event History
// and the Web UI, and the TEMPORAL PROXY box at the environment's right edge (from chapter 6). Every lane scene
// reads them: adjust them here, never in a scene.
const LANE = {
  env: { x: 120, y: 190, w: 700, h: 650 },
  worker: { x: 300, y: 515 },
  wire: { x0: 820, x1: 1100, y: 515 },
  temporal: { x: 1100, y: 190, w: 700, h: 650 },
  history: { x: 1450, y: 470 },
  ui: { x: 1450, y: 760 },
  proxy: { x: 760, y: 515 },
};
// Hand-off from the intro to chapter 1: the payload card in the Worker, its center and width. The intro's card flies
// there and shrinks to this width; chapter 1 opens on it. Below the Worker's center, under the panel's heading.
const PAYLOAD_IN_WORKER = { x: LANE.worker.x, y: LANE.worker.y + 30, w: 320 };

// ---------- camera and motion
// Camera framing eased between stops, like pan(): from and each stop give [x, y, scale], the stage point (x, y)
// centered on (960, 515) at that scale; a stop is [at, x, y, scale, d = 0.9]. Returns the offsets for
// setCamera(cam, t, dur, { ...shot(t, from, stops), enter: 1, exit: 1 }), in whole pixels. setCamera() scales
// around (960, 540), hence the 25 px between 540 and 515 in dy.
function shot(t, from, stops) {
  let [x, y, scale] = from;
  for (const [at, sx, sy, ss, d = 0.9] of stops) {
    const p = P(t, at, d);
    x = lerp(x, sx, p);
    y = lerp(y, sy, p);
    scale = lerp(scale, ss, p);
  }
  return { scale, dx: Math.round((960 - x) * scale), dy: Math.round((540 - y) * scale - 25) };
}
// Shake of an alarm hit at `at`, as [dx, dy] in whole pixels: a new hashed offset every frame (1/30 s), up to amp
// px, dying out over d seconds; [0, 0] outside [at, at + d], so the composition rests on the same pixels before and
// after
function shake(t, at, amp, d = 0.4) {
  const u = (t - at) / d;
  if (u < 0 || u >= 1) return [0, 0];
  const frame = Math.floor((t - at) * 30);
  const k = amp * (1 - u);
  return [Math.round((hash(frame * 2 + 1) * 2 - 1) * k), Math.round((hash(frame * 2 + 2) * 2 - 1) * k)];
}
