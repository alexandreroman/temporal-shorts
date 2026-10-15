// ===================== Security with Temporal helpers (shared by the scenes of this theme)

// ---------- extra icons (stroke, 24 grid, same style as ICONS in engine.js); `shield`, `key`, `lock`, `server` and
// `cloud` come from the engine set
Object.assign(ICONS, {
  // a closed door in its frame, with its handle: no inbound port
  door: '<path d="M3 21h18M6 21V3h12v18"/><path d="M14.5 11v2.5"/>',
  // an identity badge on its clip: a photo and a name line
  badge: '<rect x="4" y="5" width="16" height="16"/><path d="M10 2.5h4V7h-4z"/><circle cx="12" cy="11.5" r="2"/>'
    + '<path d="M8.5 17.5c.7-1.4 2-2.1 3.5-2.1s2.8.7 3.5 2.1"/>',
  // a key management service (KMS): a vault holding a key
  kms: '<rect x="3" y="4" width="18" height="16"/><circle cx="8.5" cy="12" r="2.5"/><path d="M11 12h6.5M15.5 12v2.5"/>',
  // a globe, its equator and a meridian: a network address
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/>'
    + '<path d="M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3z"/>',
  // a browser window: its title bar and two dots
  window: '<rect x="3" y="4" width="18" height="16"/><path d="M3 9h18M6.5 6.5h.01M9.5 6.5h.01"/>',
  // a key struck through, its bow low on the left and its shaft rising to the right, broken where the slash
  // crosses it: no secret held
  keyOff: '<circle cx="5.5" cy="18.5" r="3.5"/><path d="M8 16l2-2M14 10l6.5-6.5M17 7l2 2M19.5 4.5l1.5 1.5"/>'
    + '<path d="M3.5 3.5l17 17"/>',
  // a medical cross, outlined: health data
  medical: '<path d="M9 3.5h6V9h5.5v6H15v5.5H9V15H3.5V9H9z"/>',
});

// ---------- DOM writes that skip unchanged values: update() runs every frame, and rewriting the same HTML, text or
// path costs a relayout for nothing
// Sets an element's HTML, rewritten only when it changes
function setHtml(e, html) {
  if (e._html !== html) {
    e.innerHTML = html;
    e._html = html;
  }
}
// Sets an element's text, rewritten only when it changes
function setText(e, text) {
  if (e._text !== text) {
    e.textContent = text;
    e._text = text;
  }
}
// Sets a path's d, and its length (for draw()), only when it changes
function setD(pathEl, d) {
  if (pathEl._d === d) return;
  pathEl.setAttribute('d', d);
  pathEl._L = pathEl.getTotalLength();
  pathEl._d = d;
}

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
// A value with its first characters replaced by ciphertext, left to right, as s goes from 0 to 1 (right to left with
// fromRight): the ciphertext in violet, then two flickering glyphs at its front, then the clear rest. Spaces stay
// spaces and the font is monospace, so the value keeps its width. Each character's ciphertext glyph depends only on
// its place, so both directions end on the same ciphertext.
function scrambledHtml(row, text, s, fromRight = false) {
  if (s <= 0) return text;
  const len = text.length;
  const n = Math.round(clamp(s) * len);
  const frontN = s < 1 ? Math.min(len - n, 2) : 0;
  const flicker = Math.floor(s * 90); // the front glyphs change several times per scrambled character
  const glyphs = (from, to, salt) => {
    let out = '';
    for (let col = from; col < to; col++) out += text[col] === ' ' ? ' ' : cipherGlyph(row, col, salt);
    return out;
  };
  const cipherHtml = (from, to) => `<span style="color:${C.violet}">${glyphs(from, to, 0)}</span>`;
  const frontHtml = (from, to) => `<span style="color:${C.slate}">${glyphs(from, to, 1000 + flicker * 31)}</span>`;
  if (fromRight) {
    const clearEnd = len - n - frontN;
    return text.slice(0, clearEnd) + frontHtml(clearEnd, len - n) + cipherHtml(len - n, len);
  }
  return cipherHtml(0, n) + frontHtml(n, n + frontN) + text.slice(n + frontN);
}
// The sizes of a payload card w px wide (see makePayload), in px: every size follows w (at 420 px, the values are
// 19 px). valueTop(i): the top of the value line of field i, from the top of the card's padding box.
function payloadLayout(w) {
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
  const valueTop = i => pad.top + head.line + head.gap + i * (key.line + value.line + rowGap) + key.line;
  return { u, px, pad, head, key, value, rowGap, h, badge, valueTop };
}
// The payload card of the transfer, w px wide: a PAYLOAD heading, the fields of TRANSFER (key above value, in
// monospace) and a padlock on its top edge. Every size follows w (payloadLayout), so cards of two widths look alike,
// one a scaled copy of the other; pass an even w, so the card rests on whole pixels. Returns the card, with
// .rows[i].e and .rows[i].value (the row and value elements of field i), .lock, .w and .h (its size in px);
// setPayload() sets its state.
function makePayload(p, { w = 420 } = {}) {
  const { u, px, pad, head, key, value, rowGap, h, badge } = payloadLayout(w);

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
// field (to scramble the IBANs alone), right to left with fromRight; red (0 to 1) tints the card for an alarm. With
// no state, the card is open and in clear.
function setPayload(card, { seal = 0, scramble = 0, red = 0, fromRight = false } = {}) {
  setLock(card.lock, seal);
  card.lockBadge.style.borderColor = seal >= LOCK_SHUT ? C.neon : C.line;
  card.rows.forEach(row => {
    const s = Array.isArray(scramble) ? scramble[row.i] : scramble;
    setHtml(row.value, scrambledHtml(row.i, TRANSFER[row.i][1], s, fromRight));
  });
  card.alarm.style.opacity = clamp(red);
  card.style.boxShadow = glowShadow(RGB.red, clamp(red), { blur: Math.round(40 * card.u), alpha: 0.45 });
}

// ---------- the journey lane
// Stage coordinates of the lane shared by every lane scene, at camera rest (scale 1), left to right: YOUR
// ENVIRONMENT (env) with the Worker panel in it, the wire from x0 to x1, TEMPORAL with the Event History and the Web
// UI (ui: the size of the Web UI window, and its place under the stored Event History, where its dashed outline rests
// in chapter 4; the close layout of chapters 3 and 4 shows the window on the history's right, see CLOSE) and the
// closed door on the environment's edge. The two zones give their top left corner and size, the other parts their
// center (and size). Every lane scene reads them: adjust them here, never in a scene. From chapter 5, the lane opens
// into the fleet layout (FLEET), with the TEMPORAL PROXY box (PROXY) from chapter 6.
const LANE = {
  env: { x: 120, y: 190, w: 640, h: 650 },
  worker: { x: 340, y: 515, w: 380, h: 392 },
  wire: { x0: 760, x1: 1160, y: 515 },
  temporal: { x: 1160, y: 190, w: 640, h: 650 },
  history: { x: 1560, y: 515, w: 392, h: 260 },
  ui: { x: 1350, y: 741, w: 300, h: 150 },
  door: { x: 760, y: 720 },
};
// Hand-off from the intro to chapter 1: the payload card in the Worker, its center and width. The intro's card flies
// there and shrinks to this width; chapter 1 opens on it. In the Worker panel, under its heading and code line.
const PAYLOAD_IN_WORKER = { x: LANE.worker.x, y: LANE.worker.y + 55, w: 340 };

// Draws path p as a dashed line up to prog (0 to 1) of its length, with opacity o: dashes of `dash` px, `gap` px
// apart, which stay in place as it draws (draw() makes its dashes flow)
function drawDashed(p, prog, o = 1, dash = 10, gap = 8) {
  const drawn = p._L * clamp(prog);
  const period = dash + gap;
  const full = Math.floor(drawn / period);
  const parts = [];
  for (let i = 0; i < full; i++) parts.push(dash, gap);
  parts.push(Math.min(drawn - full * period, dash), p._L + period);
  p.setAttribute('stroke-dasharray', parts.join(' '));
  p.style.opacity = prog > 0.001 ? o : 0;
}
// SVG path of a rounded rectangle (top left corner x, y; size w, h; corner radius r), clockwise from the middle of its
// top edge, for an outline that draws itself
const roundRectD = (x, y, w, h, r) => `M ${x + w / 2} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w} ${y + r}`
  + ` V ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + h - r}`
  + ` V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`;
// How far a zone's labels sit inside it: its heading under its top edge, its caption above its bottom edge, in px
const ZONE_LABEL_INSET = { head: 20, cap: 24 };
// A zone's heading (zone.head), 24 px from its left edge, inside a frame of its own (zone.headFrame): placeLane() sets
// the heading's opacity, frameLaneEdges() the frame's
const zoneHeading = html => '<div class="head-frame" style="position:absolute;left:24px;'
  + `top:${ZONE_LABEL_INSET.head}px">${html}</div>`;
// A zone's caption (zone.cap), centered, inside a frame of its own (zone.capFrame) like the heading; hidden until a
// scene sets its opacity
const zoneCaption = text => '<div class="cap-frame" style="position:absolute;left:0;right:0;'
  + `bottom:${ZONE_LABEL_INSET.cap}px"><div class="cap lbl" style="text-align:center;font-size:18px;`
  + `color:var(--ink);opacity:0">${text}</div></div>`;

// The slate EMPTY note of the lane's Event History, centered across the card, 150 px under its top
const historyEmptyNote = () => '<div class="empty mono" style="position:absolute;left:0;right:0;top:150px;'
  + `text-align:center;font-size:18px;letter-spacing:.14em;padding-left:.14em;color:${C.slateDark}">EMPTY</div>`;

// Number of lanes built so far: it makes the id of each lane's clip path unique in the document
let laneClipCount = 0;
// The content frame's top and bottom on the stage, in px (see the layout check)
const CONTENT_FRAME = { top: 150, bottom: 880 };
// The stage band that the shot cam shows inside the content frame, { top, bottom } in stage y: cam, the scale and dy
// of shot() given to setCamera() (with an enter and exit zoom of 1), without the shake, which moves an element and its
// clip together
function contentBand({ scale, dy }) {
  // setCamera() scales round (960, 540) and then moves by dy: the stage y that lands on a screen y
  const stageY = screenY => 540 + (screenY - 540 - dy) / scale;
  return { top: stageY(CONTENT_FRAME.top), bottom: stageY(CONTENT_FRAME.bottom) };
}
// Clips an element whose box spans stage y top to top + h (at scale 1) to the content band of the shot cam, so a close
// shot never runs it under the chapter header or the subtitles; no clip when it lies inside. For the zones only, which
// show as their border and fill: content is either wholly in a shot or dimmed at its edge, never cut by a clip, and
// the zones' labels fade out before the clip reaches them (frameLaneEdges).
function clipToContent(el, top, h, cam) {
  const band = contentBand(cam);
  const cutTop = Math.max(0, band.top - top), cutBottom = Math.max(0, top + h - band.bottom);
  el.style.clipPath = cutTop > 0 || cutBottom > 0
    ? `inset(${cutTop.toFixed(2)}px -200px ${cutBottom.toFixed(2)}px -200px)` : 'none';
}
// Clips the lane's zones and the environment's dashed edge to the content frame for the shot cam (see contentBand).
// At rest they lie inside the frame and show whole. A zone's heading fades out as the frame's top edge moves from the
// zone's top edge down to the heading, and its caption likewise at the bottom, so the clip never cuts a label: both
// show whole until the clip starts, and are gone before it reaches them. It reads the camera and the zones alone, as
// placeLane() placed them in the same frame: call it after placeLane(). So the two sides of a match cut agree.
function frameLaneEdges(lane, cam) {
  const { top, bottom } = contentBand(cam);
  lane.frameClip.setAttribute('y', top.toFixed(2));
  lane.frameClip.setAttribute('height', (bottom - top).toFixed(2));
  const { zones } = lane;
  [[lane.env, zones.env], [lane.temporal, zones.temporal]].forEach(([el, zone]) => {
    clipToContent(el, zone.y, zone.h, cam);
    const zoneBottom = zone.y + zone.h;
    const headRoom = clamp((zone.y + ZONE_LABEL_INSET.head - top) / ZONE_LABEL_INSET.head);
    const capRoom = clamp((bottom - (zoneBottom - ZONE_LABEL_INSET.cap)) / ZONE_LABEL_INSET.cap);
    el.headFrame.style.opacity = headRoom;
    el.capFrame.style.opacity = capRoom;
  });
}

// A zone's rectangle as a string, to tell when it has moved
const zoneKey = ({ x, y, w, h }) => `${x},${y},${w},${h}`;
// The zone rectangle at progress p from zone a to zone b, on whole pixels with even sizes, so the zone rests on whole
// pixels
const lerpZone = (a, b, p) => ({
  x: Math.round(lerp(a.x, b.x, p)), y: Math.round(lerp(a.y, b.y, p)),
  w: 2 * Math.round(lerp(a.w, b.w, p) / 2), h: 2 * Math.round(lerp(a.h, b.h, p) / 2),
});
// The environment's dashed edge round the zone env (LANE.env, or a wider one), as two SVG paths: halves from the
// wire's exit on its right edge round to its left edge
function envEdgeDs(env) {
  const right = env.x + env.w, bottom = env.y + env.h, r = 10, y = LANE.wire.y;
  return [
    `M ${right} ${y} V ${env.y + r} A ${r} ${r} 0 0 0 ${right - r} ${env.y} H ${env.x + r}`
      + ` A ${r} ${r} 0 0 0 ${env.x} ${env.y + r} V ${y}`,
    `M ${right} ${y} V ${bottom - r} A ${r} ${r} 0 0 1 ${right - r} ${bottom} H ${env.x + r}`
      + ` A ${r} ${r} 0 0 1 ${env.x} ${bottom - r} V ${y}`,
  ];
}

// The lane's parts (LANE), in their stacking order: the two zones, an SVG layer (the environment's dashed edge and the
// wire, an arrow to TEMPORAL; scenes draw their own strokes in it, under the panels), the Worker panel running the
// TransferWorkflow, the empty Event History card and the closed door. placeLane() shows them.
function makeLane(root) {
  const { env, temporal, worker, history, wire } = LANE;
  const lane = {};
  lane.env = E(root,
    zoneHeading('<div class="head lbl" style="padding-left:0;font-size:18px">Your environment</div>')
    + zoneCaption('Your code runs here'),
    '', {
      width: env.w + 'px', height: env.h + 'px', background: 'rgba(148,163,184,.04)', borderRadius: 'var(--r)',
    });
  lane.temporal = E(root,
    zoneHeading(`<img class="head" src="${LOGO}" style="height:34px;display:block">`) + zoneCaption('Never your code'),
    'tile', { width: temporal.w + 'px', height: temporal.h + 'px', borderColor: C.uv, background: '#17182A' });
  [lane.env, lane.temporal].forEach(zone => {
    zone.head = zone.querySelector('.head');
    zone.headFrame = zone.querySelector('.head-frame');
    zone.cap = zone.querySelector('.cap');
    zone.capFrame = zone.querySelector('.cap-frame');
  });

  lane.svg = svgLayer(root);
  // the environment's dashed edge (placeLane() redraws it when the zone moves)
  lane.envEdges = envEdgeDs(env).map(d => path(lane.svg, d, C.slate, 2, false));
  lane.envKey = zoneKey(env);
  // the dashed edge shows only inside the content frame, so a close shot never runs it under the chapter header or
  // the subtitles (see frameLaneEdges)
  laneClipCount += 1;
  const clip = document.createElementNS(SVGNS, 'clipPath');
  clip.id = `lane-frame-${laneClipCount}`;
  clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
  lane.frameClip = document.createElementNS(SVGNS, 'rect');
  const whole = { x: -4000, y: -4000, width: 10000, height: 10000 };
  Object.entries(whole).forEach(([name, value]) => lane.frameClip.setAttribute(name, value));
  clip.appendChild(lane.frameClip);
  lane.svg.querySelector('defs').appendChild(clip);
  lane.envEdges.forEach(edge => edge.setAttribute('clip-path', `url(#${clip.id})`));
  lane.wire = path(lane.svg, `M ${worker.x + worker.w / 2} ${wire.y} L ${temporal.x - 4} ${wire.y}`, C.slate, 2.5);

  lane.worker = makeAppPanel(root, 'WORKER', worker.w, worker.h);
  lane.worker.insertAdjacentHTML('beforeend', '<div class="mono" style="position:absolute;left:24px;top:66px;'
    + `font-size:18px;line-height:26px;color:var(--slate)"><span style="color:${C.violet}">workflow</span> `
    + 'TransferWorkflow</div>');
  lane.history = makeHistoryCard(root, [], { w: history.w, h: history.h, rowTop: () => 0, tagTop: () => 0 });
  lane.history.insertAdjacentHTML('beforeend', historyEmptyNote());
  // on the dashed edge, which it hides
  lane.door = E(root, ICON('door', 32, C.ink, 1.8), '', {
    width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: C.bg, border: `1.5px solid ${C.slate}`, borderRadius: 'var(--rs)',
  });
  lane.door.icon = lane.door.querySelector('svg');
  return lane;
}
// Shows the lane's parts in place, each with its opacity in o (1 by default): env (with its dashed edge), temporal,
// worker, history, wire, door, and heads, the zones' headings (YOUR ENVIRONMENT and the logo), which a close shot
// pushes up under the chapter header (frameLaneEdges also fades them out at the frame's top edge); close, TEMPORAL's
// widening into the close layout (CLOSE); envZone and temporalZone, the zones' rectangles when they move away from
// LANE's (the fleet layout, FLEET; see lerpZone). The Worker runs, its gear turning; the door is in its slate and white
// look. The zone captions (env.cap, temporal.cap) keep the opacity a scene gives them.
function placeLane(lane, o = {}) {
  const { env = 1, temporal = 1, worker = 1, history = 1, wire = 1, door = 1, heads = 1, close = 0 } = o;
  lane.env.head.style.opacity = heads;
  lane.temporal.head.style.opacity = heads;
  const center = zone => [zone.x + zone.w / 2, zone.y + zone.h / 2];
  const envZone = o.envZone ?? LANE.env;
  if (lane.envKey !== zoneKey(envZone)) {
    lane.env.style.width = envZone.w + 'px';
    lane.env.style.height = envZone.h + 'px';
    envEdgeDs(envZone).forEach((d, i) => {
      const edge = lane.envEdges[i];
      edge.setAttribute('d', d);
      edge._L = edge.getTotalLength();
    });
    lane.envKey = zoneKey(envZone);
  }
  place(lane.env, ...center(envZone), 1, env);
  lane.envEdges.forEach(edge => drawDashed(edge, 1, env));
  // close (0 to 1): TEMPORAL widens to the close layout of chapters 3 and 4 (CLOSE.zone); even widths, so the zone
  // rests on whole pixels
  const temporalZone = o.temporalZone ?? LANE.temporal;
  const zone = {
    ...temporalZone,
    x: Math.round(lerp(temporalZone.x, CLOSE.zone.x, close)),
    w: 2 * Math.round(lerp(temporalZone.w, CLOSE.zone.w, close) / 2),
  };
  lane.temporal.style.width = zone.w + 'px';
  lane.temporal.style.height = zone.h + 'px';
  place(lane.temporal, ...center(zone), 1, temporal);
  // what frameLaneEdges() clips and fades the labels by
  lane.zones = { env: envZone, temporal: zone };
  place(lane.worker, LANE.worker.x, LANE.worker.y, 1, worker);
  setAppStatus(lane.worker, 'RUNNING', 'running');
  place(lane.history, LANE.history.x, LANE.history.y, 1, history);
  draw(lane.wire, 1, wire);
  place(lane.door, LANE.door.x, LANE.door.y, 1, door);
  lane.door.style.borderColor = C.slate;
  lane.door.icon.setAttribute('stroke', C.ink);
}

// ---------- the TLS tube (chapters 2 and 3)
// The TLS tube along the wire, at camera rest: from the Worker panel's right edge (x0) to 24 px inside TEMPORAL (x1),
// where the payments Namespace begins, on the wire's line y, h px high. The payload card rides it at scale k; its TLS
// label sits above it, centered on label.
const TUBE = { x0: LANE.worker.x + LANE.worker.w / 2, x1: LANE.temporal.x + 24, y: LANE.wire.y, h: 176, k: 0.6 };
TUBE.label = { x: TUBE.x0 + 120, y: TUBE.y - TUBE.h / 2 - 42 };
// A TLS tube along a connection, for its geometry geom (TUBE, or PROXY_TUBE from chapter 6: x0 and x1, its ends; y,
// its line; h, its height; label, its label's center): a glass pipe with neon walls, a neon ring at each mouth and a
// flow of light inside it (tube.flow) running toward Temporal; then its TLS label (tube.label). placeTube() shows them.
function makeTube(root, { x0, x1, h }) {
  const mouth = side => `<div style="position:absolute;${side}:-12px;top:-2px;width:24px;height:${h}px;`
    + `border:2px solid ${C.neon};border-radius:50%"></div>`;
  const tube = E(root,
    '<div class="flow" style="position:absolute;inset:0;background-image:repeating-linear-gradient(90deg,'
    + `rgba(${RGB.neon},0) 0 40px,rgba(${RGB.neon},.16) 40px 42px)"></div>${mouth('left')}${mouth('right')}`,
    '', {
      width: (x1 - x0) + 'px', height: h + 'px', borderTop: `2px solid ${C.neon}`,
      borderBottom: `2px solid ${C.neon}`,
      background: `linear-gradient(to bottom, rgba(${RGB.neon},.16), rgba(${RGB.neon},.03) 45%, `
        + `rgba(${RGB.neon},.08))`,
      boxShadow: `0 0 28px rgba(${RGB.neon},.22)`,
    });
  tube.flow = tube.querySelector('.flow');
  tube.label = fixedTag(root, `${ICON('lock', 18, C.neon, 2)}TLS`, 'neon solid', 112);
  Object.assign(tube.label.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' });
  return tube;
}
// The tube from x0 to x1 of geom (see makeTube; a scene may pass a shorter x1, the tube's width follows), drawn from
// its x0 end up to drawn (0 to 1), with opacity o; its label at geom.label with opacity label (o by default) and scale
// labelS. Its light flows on the ambient clock G, so it runs on across a cut.
function placeTube(tube, geom, { drawn = 1, o = 1, label = o, labelS = 1 } = {}) {
  const { x0, x1, y } = geom;
  tube.style.width = (x1 - x0) + 'px';
  place(tube, (x0 + x1) / 2, y, 1, drawn > 0 ? o : 0);
  // the clip keeps the glow round the tube, and cuts it on the right while it draws
  tube.style.clipPath = drawn < 1 ? `inset(-40px ${((1 - drawn) * 100).toFixed(3)}% -40px -40px)` : 'none';
  tube.flow.style.backgroundPosition = `${((G * 90) % 42).toFixed(2)}px 0`;
  place(tube.label, geom.label.x, geom.label.y, labelS, label);
}

// ---------- the Namespaces (chapters 2 and 3)
// The Namespaces inside TEMPORAL, top to bottom: each one's name, the middle y and height of its band. The Worker's
// own, payments, surrounds the Event History, level with the wire and the tube.
const NAMESPACES = [
  { name: 'support', y: 310, h: 86 },
  { name: 'payments', y: 515, h: 300, mine: true },
  { name: 'analytics', y: 720, h: 86 },
];
// The bands span TEMPORAL 24 px inside its sides: their center x and width
const NS_BAND = { x: LANE.temporal.x + LANE.temporal.w / 2, w: LANE.temporal.w - 48 };
// The light that sweeps across TEMPORAL as it splits into Namespaces, px wide
const NS_SWEEP_W = 160;
// The Namespace bands, under the lane's SVG layer and the Event History, each labelled at its top left, a padlock on
// the right of the others; and the light sweep over them, in a box across TEMPORAL's width that holds only the bands'
// height (12 px round them), so the sweep stays inside a close shot that crops TEMPORAL itself. placeNamespaces()
// shows them.
function makeNamespaces(lane) {
  const bands = NAMESPACES.map(ns => {
    // offsets from inside the band's 1.5 px border, so its label and lock rest on whole pixels
    const labelTop = (ns.mine ? 20 : (ns.h - 44) / 2) - 1.5;
    const band = E(lane.temporal.parentNode,
      `<div style="position:absolute;left:18.5px;top:${labelTop}px">`
      + `<div class="mono" style="font-size:13px;line-height:18px;letter-spacing:.14em;color:${C.slate}">`
      + 'NAMESPACE</div>'
      + `<div class="mono" style="font-size:20px;line-height:26px">${ns.name}</div></div>`,
      '', { width: NS_BAND.w + 'px', height: ns.h + 'px', border: `1.5px solid ${C.line}`, borderRadius: 'var(--r)' });
    lane.svg.before(band);
    band.ns = ns;
    if (!ns.mine) {
      band.lock = makeLock(band, 30, 1.9, { left: NS_BAND.w - 54 - 1.5 + 'px', top: (ns.h - 30) / 2 - 1.5 + 'px' });
    }
    return band;
  });
  const first = NAMESPACES[0], last = NAMESPACES[NAMESPACES.length - 1];
  const top = first.y - first.h / 2 - 12, bottom = last.y + last.h / 2 + 12;
  const sweepBox = E(lane.temporal.parentNode, '', '', {
    left: LANE.temporal.x + 'px', top: top + 'px', width: LANE.temporal.w + 'px', height: (bottom - top) + 'px',
    overflow: 'hidden',
  });
  lane.svg.before(sweepBox);
  const sweep = E(sweepBox, '', '', {
    width: NS_SWEEP_W + 'px', height: '100%', opacity: 1,
    background: `linear-gradient(90deg, rgba(${RGB.ink},0), rgba(${RGB.ink},.28), rgba(${RGB.ink},0))`,
  });
  return { bands, sweep, sweepBox };
}
// Center of the padlock on the band of Namespace i (one of the others)
const nsLockAt = i => [NS_BAND.x + NS_BAND.w / 2 - 39, NAMESPACES[i].y];
// split (0 to 1): the light sweeps across TEMPORAL from left to right and reveals the bands as it passes; lit (0 to
// 1): payments turns violet and glows while the others dim; seals: one seal per other Namespace, top to bottom (see
// setLock; its padlock shows once its seal starts); o: the opacity of every band.
function placeNamespaces(ns, split, lit = 0, seals = [0, 0], o = 1) {
  const sweepX = lerp(-NS_SWEEP_W / 2, LANE.temporal.w + NS_SWEEP_W / 2, split); // from TEMPORAL's left edge
  ns.sweep.style.transform = `translateX(${(sweepX - NS_SWEEP_W / 2).toFixed(2)}px)`;
  ns.sweepBox.style.opacity = split > 0 && split < 1 ? 1 : 0;
  const bandLeft = NS_BAND.x - NS_BAND.w / 2 - LANE.temporal.x;
  let other = 0;
  ns.bands.forEach(band => {
    const reveal = clamp((sweepX - bandLeft) / NS_BAND.w);
    const bandO = band.ns.mine ? 1 : 1 - 0.4 * lit;
    place(band, NS_BAND.x, band.ns.y, 1, reveal > 0 ? bandO * o : 0);
    band.style.clipPath = reveal < 1 ? `inset(-40px ${((1 - reveal) * 100).toFixed(3)}% -40px -40px)` : 'none';
    if (band.ns.mine) {
      band.style.borderColor = lit > 0 ? C.violet : C.uv;
      band.style.background = `rgba(${RGB.violet},${(0.03 + 0.07 * lit).toFixed(3)})`;
      band.style.boxShadow = glowShadow(RGB.violet, lit, { blur: 36, alpha: 0.4 });
    } else {
      const seal = seals[other++];
      setLock(band.lock, seal);
      band.lock.style.opacity = seal > 0 ? 1 : 0;
    }
  });
}

// ---------- the Event History that stores the payload, and the Web UI (chapters 3 and 4)
// Inside TEMPORAL, at camera rest: the stored Event History, with the Web UI's place (LANE.ui) under it; in the close
// layout (CLOSE), the history on the left and a column on its right, the Web UI over the viewers (chapter 3) or the
// Search Attributes (chapter 4). The Event History grows from the lane's (LANE.history) to HIST, 24 px clear of the
// TLS tube's mouth on its left.
const HIST = { x: 1480, y: 454, w: 560, h: 392 };
// Its rows; row 2 holds the payload. HIST_ROW: each row's top in the card, the row height and the text size.
const HIST_ROWS = [
  'Workflow started: transfer', 'Activity completed: debitAccount', 'Activity scheduled: creditAccount',
];
const HIST_ROW = { tops: [56, 92, 346], h: 32, font: 18 };
// The payload chip of row 2: the payload card itself, a lane-size card (PAYLOAD_IN_WORKER.w) shown at scale k,
// left-aligned with the rows' text and 138 px under the card's top. Its center (x, y), its size on the stage (w, h)
// and tagY, the center of its verdict tag (READABLE, then NEVER SEES YOUR PAYLOADS), which straddles its bottom edge,
// 3 px low, clear of its last value.
const HIST_CHIP = { k: 0.8 };
HIST_CHIP.w = PAYLOAD_IN_WORKER.w * HIST_CHIP.k;
HIST_CHIP.h = payloadLayout(PAYLOAD_IN_WORKER.w).h * HIST_CHIP.k;
HIST_CHIP.x = HIST.x - HIST.w / 2 + 70 + HIST_CHIP.w / 2;
HIST_CHIP.y = HIST.y - HIST.h / 2 + 138 + HIST_CHIP.h / 2;
HIST_CHIP.tagY = HIST_CHIP.y + HIST_CHIP.h / 2 + 3;
// The close shot that reads the small text of TEMPORAL, [x, y, scale] for shot(): the stored history, centered; at 1.6
// the chip's values render at 19.7 px and its labels at 14.5 px. TEMPORAL's zone, cut by the frame there, dims.
const HIST_SHOT = [HIST.x, HIST.y, 1.6];
// The close layout of TEMPORAL in HIST_SHOT, when the message needs more than the history: rather than the camera
// moving, the content comes to it. The zone widens on both sides (zone: its left edge x and width; it narrows back
// before any wider shot), the history slides left (hist: its center x) and a column comes in on its right, the Web
// UI (ui: its center y, LANE.ui's size) over a slot of the same size (slot: its center y; the viewers in chapter 3,
// the Search Attributes in chapter 4). On screen it spans x 160-1760 and y 201-829.
const CLOSE = { zone: { x: 956, w: 1048 }, hist: { x: 1260 }, column: { x: 1830 }, ui: { y: 367 }, slot: { y: 541 } };
// How far the history and its chip move left in the close layout, at progress `close` (0 to 1)
const closeDx = close => Math.round(lerp(0, CLOSE.hist.x - HIST.x, close));
// The stored Event History: the white card (HIST) with its rows, a SAVED tag per row and the lane history's EMPTY
// note, then its payload chip (card.chip, a makePayload). placeStoredHistory() shows them; the chip's state
// (setPayload) stays with the scenes.
function makeStoredHistory(root) {
  const card = makeHistoryCard(root, HIST_ROWS, {
    w: HIST.w, h: HIST.h, font: HIST_ROW.font, rowH: HIST_ROW.h, rowTop: i => HIST_ROW.tops[i],
    tagTop: i => HIST_ROW.tops[i] + (HIST_ROW.h - 24) / 2, tagRight: 20, tag: { font: 12, icon: 12 },
  });
  card.tags.forEach(tag => { tag.style.height = '24px'; });
  card.insertAdjacentHTML('beforeend', historyEmptyNote());
  card.empty = card.querySelector('.empty');
  card.chip = makePayload(root, { w: PAYLOAD_IN_WORKER.w });
  return card;
}
// grow (0 to 1): the card grows from the lane's history, EMPTY, to HIST, as EMPTY fades; o: the opacity of the card;
// rows: the progress of each row as it slides in (showRow); saved: the opacity of each row's SAVED tag; chip: the
// opacity of the chip, which rests at HIST_CHIP; close: the slide of both into the close layout (closeDx).
function placeStoredHistory(card, { grow = 1, o = 1, rows = [1, 1, 1], saved = [1, 1, 1], chip = 1, close = 0 } = {}) {
  const { history } = LANE;
  // even sizes, so the card rests on whole pixels
  card.style.width = 2 * Math.round(lerp(history.w, HIST.w, grow) / 2) + 'px';
  card.style.height = 2 * Math.round(lerp(history.h, HIST.h, grow) / 2) + 'px';
  const dx = closeDx(close);
  place(card, Math.round(lerp(history.x, HIST.x, grow)) + dx, Math.round(lerp(history.y, HIST.y, grow)), 1, o);
  card.empty.style.opacity = 1 - clamp(grow * 3);
  card.rows.forEach((row, i) => showRow(row, rows[i], 26, true));
  card.tags.forEach((tag, i) => {
    setStatus(tag, 'SAVED', 'saved');
    tag.style.opacity = saved[i];
  });
  place(card.chip, HIST_CHIP.x + dx, HIST_CHIP.y, HIST_CHIP.k, chip);
}
// The verdict tag on the payload chip (statusTag, 30 px high, so it centers on whole pixels); setChipVerdict() sets it
function makeChipVerdict(root) {
  const e = statusTag(root, { font: 14, icon: 14 });
  e.style.height = '30px';
  return e;
}
// The opaque fill of each verdict kind: the tag straddles the chip's edge, which must not show through it
const VERDICT_FILL = { denied: 'var(--red-solid)', wait: 'var(--violet-solid)' };
// The verdict tag at HIST_CHIP.tagY: its label and kind (setStatus; 'denied' or 'wait'), its scale and opacity, flip,
// its height as it flips over (1 flat on the chip, 0 edge on), and close, the chip's slide (closeDx)
function setChipVerdict(e, label, kind, { s = 1, o = 1, flip = 1, close = 0 } = {}) {
  setStatus(e, label, kind);
  e.style.background = VERDICT_FILL[kind];
  place(e, HIST_CHIP.x + closeDx(close), HIST_CHIP.tagY, s, o);
  if (flip < 1) e.style.transform += ` scaleY(${flip.toFixed(3)})`;
}

// The Web UI window (LANE.ui), and the fields of the payload it shows: their rows in TRANSFER (the IBAN it comes from,
// and the name)
const WEBUI = LANE.ui;
const WEBUI_FIELDS = [0, 2];
// The Web UI window, in the dark look of the Temporal Web UI: a title bar (win.caption, its text), then row 2 of the
// Event History and the payload's IBAN and name, keys above values. win.lines: the row and the two fields, which
// slide in; setWebUI() sets the values.
function makeWebUI(root) {
  const dot = '<i style="display:block;width:8px;height:8px;border-radius:50%;background:#4B5363"></i>';
  const field = row => '<div class="line" style="margin-top:6px">'
    + `<div class="mono" style="font-size:11px;line-height:14px;color:${C.slate}">${TRANSFER[row][0]}</div>`
    + '<div class="mono value" style="font-size:13px;line-height:20px;white-space:pre;margin:0 -6px;padding:0 6px;'
    + 'border-radius:4px"></div></div>';
  const win = E(root,
    `<div style="height:30px;background:#191919;border-bottom:1px solid ${C.line};display:flex;align-items:center;`
    + `gap:6px;padding-left:12px">${dot}${dot}${dot}<span class="ttl mono" style="margin-left:10px;font-size:11px;`
    + `letter-spacing:.14em;color:${C.slate}">TEMPORAL WEB UI</span></div>`
    + '<div style="padding:10px 16px 0">'
    + `<div class="line mono" style="font-size:13px;line-height:18px"><span style="color:${C.slate}">2</span>`
    + '&nbsp; Activity completed</div>'
    + WEBUI_FIELDS.map(field).join('') + '</div>',
    '', {
      width: WEBUI.w + 'px', height: WEBUI.h + 'px', background: '#111111', border: `1.5px solid ${C.line}`,
      borderRadius: 'var(--r)', overflow: 'hidden', textAlign: 'left',
    });
  win.caption = win.querySelector('.ttl');
  win.lines = [...win.querySelectorAll('.line')];
  win.values = [...win.querySelectorAll('.value')];
  setWebUI(win);
  return win;
}
// scramble (0 to 1): the values turn into the payload's ciphertext, the same glyphs as the card's (scrambledHtml);
// red (0 to 1): the IBAN's line lights up red
function setWebUI(win, { scramble = 0, red = 0 } = {}) {
  win.values.forEach((value, i) => {
    const row = WEBUI_FIELDS[i];
    setHtml(value, scrambledHtml(row, TRANSFER[row][1], scramble));
  });
  win.values[0].style.background = `rgba(${RGB.red},${(0.24 * clamp(red)).toFixed(3)})`;
}

// ---------- the Data Converter (chapter 4)
// The Data Converter in your environment, between the Worker panel and the environment's right edge, at camera rest:
// its tile (the key and its labels) above the gate that the payload card passes through, level with the card in the
// Worker. x: their center; tile and gate: each one's center y and size.
const CONVERTER = {
  x: (LANE.worker.x + LANE.worker.w / 2 + LANE.env.x + LANE.env.w) / 2,
  tile: { y: 330, w: 200, h: 110 },
  gate: { y: PAYLOAD_IN_WORKER.y, h: 300 },
};

// ---------- the fleet of Workers (chapters 5 to 8)
// The fleet layout, in stage px, sized for chapter 4's wide shot (WIDE_SHOT, 0.88), which frames stage x 5-1915 and
// y 100-930 as the content frame x 120-1800, y 150-880: the zones grow to y 150-880 (y, h; on screen y 193-836).
// env and temporal: the zones' left edge and width in chapter 5, YOUR ENVIRONMENT holding the Workers and TEMPORAL
// wide enough for a card; proxyEnv and proxyTemporal: from chapter 6, the environment wider, its right edge on the
// proxy box (PROXY), and TEMPORAL narrower, at the right end. The tiles (tile: their size, the lane's Worker panel at
// 0.75) sit in a grid of two rows (rows: their center y) and up to four columns (cols: their center x): the Workers
// in the first three, the SDK client and the Web UI in the fourth (chapter 6 on). Between the rows runs the channel,
// on the wire's line, where each tile's connection has a track of its own, `track` px from the next (fleetLinkD).
const FLEET = {
  y: 150, h: 730,
  env: { x: 20, w: 990 }, temporal: { x: 1240, w: 660 },
  proxyEnv: { x: 20, w: 1410 }, proxyTemporal: { x: 1680, w: 220 },
  tile: { w: 296, h: 276 },
  rows: [353, 677],
  cols: [192, 512, 832, 1152],
  track: 6,
};
// The zone rectangles of the fleet layout for placeLane(): chapter 5's, and chapter 6's on, with the proxy
const fleetZone = ({ x, w }) => ({ x, y: FLEET.y, w, h: FLEET.h });
const FLEET_ZONES = { env: fleetZone(FLEET.env), temporal: fleetZone(FLEET.temporal) };
const PROXY_ZONES = { env: fleetZone(FLEET.proxyEnv), temporal: fleetZone(FLEET.proxyTemporal) };
// The fleet tile at column col and row row: its center (x, y) and the y of its connection's track in the channel. A
// tile's track lies closer to the channel's middle the further left its column, so no connection crosses another
// tile's link down to its track.
function fleetSlot(col, row) {
  const offset = (col + 0.5) * FLEET.track;
  return { col, row, x: FLEET.cols[col], y: FLEET.rows[row], trackY: LANE.wire.y + (row ? offset : -offset) };
}
// The six Workers of chapters 5 to 8, two in each language: lang, the language of its code (a key of LANGUAGE_LOGOS),
// and its slot (fleetSlot)
const WORKERS = [
  ['Go', 0, 0], ['Java', 1, 0], ['TypeScript', 2, 0], ['Java', 0, 1], ['TypeScript', 1, 1], ['Go', 2, 1],
].map(([lang, col, row]) => ({ lang, ...fleetSlot(col, row) }));
// The other apps that connect through the proxy from chapter 6, in the fourth column: name, icon and slot
const FLEET_CLIENTS = [['SDK client', 'code', 3, 0], ['Web UI', 'window', 3, 1]]
  .map(([name, icon, col, row]) => ({ name, icon, ...fleetSlot(col, row) }));
// SVG path of a fleet tile's connection, up to x1: from the middle of the tile's edge on the channel side, along its
// track (a rounded corner between them)
function fleetLinkD({ x, row, trackY }, x1) {
  const edgeY = row ? FLEET.rows[1] - FLEET.tile.h / 2 : FLEET.rows[0] + FLEET.tile.h / 2;
  const r = 4, dir = row ? -1 : 1;
  return `M ${x} ${edgeY} V ${trackY - dir * r} Q ${x} ${trackY} ${x + r} ${trackY} H ${x1}`;
}

// The official logo of each Workers' language (their sources and licenses are in the README of their folder), its
// size in a Worker tile, px, and named when the logo spells the language's name, which the tag then leaves out
const LANGUAGE_LOGOS = {
  Go: { url: assetUrl('assets/languages/go.svg'), w: 48, h: 18, named: true },
  Java: { url: assetUrl('assets/languages/java.svg'), w: 16, h: 22 },
  TypeScript: { url: assetUrl('assets/languages/typescript.svg'), w: 19, h: 19 },
};
// The SVG filter that paints a logo in ink, its shape untouched; added to the stage by the first Worker tile
const LOGO_INK_ID = 'security-logo-ink';
function addLogoInkFilter() {
  if (document.getElementById(LOGO_INK_ID)) return;
  const svg = document.createElementNS(SVGNS, 'svg');
  Object.assign(svg.style, { position: 'absolute', width: 0, height: 0 });
  svg.innerHTML = `<filter id="${LOGO_INK_ID}" color-interpolation-filters="sRGB"><feFlood flood-color="${C.ink}"/>`
    + '<feComposite in2="SourceAlpha" operator="in"/></filter>';
  stage.appendChild(svg);
}
// The four chips a Worker carries in chapter 5, top to bottom: icon and label
const WORKER_CHIPS = [['globe', 'Address'], ['badge', 'Certificate'], ['key', 'API key'], ['lock', 'Codec']];
// Inside a Worker tile, px from its top: the chips' slots (chipTop, chipH apart by chipGap), inset px from its sides;
// the two lines of chapter 6 take the first two slots. At 0.88, the chips' labels render at 16.7 px, the lines at
// 18.5 px.
const WORKER_TILE = { chipTop: 100, chipH: 34, chipGap: 6, inset: 20 };
const workerSlotTop = i => WORKER_TILE.chipTop + i * (WORKER_TILE.chipH + WORKER_TILE.chipGap);
// A Worker tile of the fleet (FLEET.tile) for worker (WORKERS): the gear and WORKER, the language tag with its logo
// (tile.langTag), then its four chips (tile.chips, hidden) and two code lines in the first two slots (tile.lines,
// empty). The scenes show its parts; gearSpin() turns its gear (tile.gear).
function makeWorkerTile(root, worker) {
  addLogoInkFilter();
  const logo = LANGUAGE_LOGOS[worker.lang];
  const name = logo.named ? '' : `<span class="mono" style="font-size:16px">${worker.lang}</span>`;
  const inset = WORKER_TILE.inset;
  const slot = (i, css) => `position:absolute;left:${inset}px;right:${inset}px;top:${workerSlotTop(i)}px;`
    + `height:${WORKER_TILE.chipH}px;${css}`;
  const tile = E(root,
    `<div style="position:absolute;left:${inset}px;top:16px;display:flex;align-items:center;gap:12px">`
    + `<div class="gear">${ICON('gear', 30, C.ink, 1.8)}</div>`
    + '<span class="mono" style="font-size:20px;letter-spacing:.1em">WORKER</span></div>'
    + `<div class="lang" style="position:absolute;left:${inset}px;top:56px;height:32px;display:flex;`
    + `align-items:center;gap:8px;padding:0 12px;border:1.5px solid ${C.lineLight};border-radius:var(--rs)">`
    + `<img src="${logo.url}" alt="" width="${logo.w}" height="${logo.h}" style="display:block;`
    + `filter:url(#${LOGO_INK_ID})">${name}</div>`
    + WORKER_CHIPS.map(([icon, label], i) => `<div class="chip" style="${slot(i, 'display:flex;align-items:center;'
      + `gap:10px;padding-left:12px;border:1.5px solid ${C.lineLight};border-radius:var(--rs);background:${C.bg};`
      + `opacity:0`)}">${ICON(icon, 20, C.violet, 1.9)}<span class="mono" style="font-size:19px;letter-spacing:.08em">`
      + `${label.toUpperCase()}</span></div>`).join('')
    + [0, 1].map(i => `<div class="code mono" style="${slot(i, `font-size:21px;line-height:${WORKER_TILE.chipH}px;`
      + 'white-space:pre')}"></div>`).join(''),
    'tile', { width: FLEET.tile.w + 'px', height: FLEET.tile.h + 'px', textAlign: 'left', borderColor: C.violet });
  tile.gear = tile.querySelector('.gear');
  tile.langTag = tile.querySelector('.lang');
  tile.chips = [...tile.querySelectorAll('.chip')];
  tile.lines = [...tile.querySelectorAll('.code')];
  return tile;
}

// ---------- Temporal Proxy (chapters 6 to 8)
// The TEMPORAL PROXY box: centered on the right edge of the widened environment (PROXY_ZONES.env), on the wire's
// line, its size; head: its shield and name at its top (top, the shield's size, the gap under it, the
// name's line height) and where they end, px under the box's top, which leaves the room under them to what the proxy
// handles
const PROXY = { x: FLEET.proxyEnv.x + FLEET.proxyEnv.w, y: LANE.wire.y, w: 200, h: 300 };
PROXY.head = { top: 22, icon: 32, gap: 10, line: 22 };
PROXY.head.bottom = PROXY.head.top + PROXY.head.icon + PROXY.head.gap + PROXY.head.line;
// Where the apps' connections end on the box's left, 4 px short of its edge, so their round caps stay off its border
PROXY.linkEnd = PROXY.x - PROXY.w / 2 - 4;
// The proxy's connection to TEMPORAL, from the box's right edge to TEMPORAL's left edge in the fleet layout
const PROXY_WIRE = { x0: PROXY.x + PROXY.w / 2, x1: FLEET.proxyTemporal.x, y: LANE.wire.y };
// The TEMPORAL PROXY box: a violet tile, its shield and name at its top (21 px: 18.5 px on screen at 0.88; with no
// letter spacing, unlike a label, so the name fits the box on one line, 10 px clear of each side). placeProxy() shows
// it.
function makeProxy(root) {
  const { top, icon, gap, line } = PROXY.head;
  return E(root,
    `<div style="position:absolute;left:0;right:0;top:${top}px;display:flex;flex-direction:column;`
    + `align-items:center;gap:${gap}px">${ICON('shield', icon, C.violet, 1.8)}`
    + `<div class="lbl" style="font-size:21px;line-height:${line}px;letter-spacing:0;padding-left:0;`
    + 'color:var(--ink)">Temporal Proxy</div></div>',
    'tile', {
      width: PROXY.w + 'px', height: PROXY.h + 'px', borderColor: C.violet, background: 'var(--violet-solid)',
    });
}
// The proxy box at PROXY moved by dx, with opacity o and a violet glow of strength glow (0 to 1)
function placeProxy(box, { dx = 0, o = 1, glow = 0 } = {}) {
  place(box, PROXY.x + dx, PROXY.y, 1, o);
  box.style.boxShadow = glowShadow(RGB.violet, 0.35 + 0.65 * clamp(glow), { blur: 48, alpha: 0.55 });
}
// The parts of the fleet with the proxy that chapters 6 to 8 build first, in this order, so their match cuts show the
// same stack: the lane (makeLane), every app's connection to the proxy (links, under the tiles, one per app of apps:
// the Workers, then the SDK client and the Web UI), the proxy's connection to TEMPORAL (out, an arrow; setD() may
// redraw it), the Worker tiles (tiles) and the other apps' tiles (clients). The scenes place them.
function makeFleet(root) {
  const lane = makeLane(root);
  const apps = [...WORKERS, ...FLEET_CLIENTS];
  const links = apps.map(app => path(lane.svg, fleetLinkD(app, PROXY.linkEnd), C.slate, 2, false));
  const { x0, x1, y } = PROXY_WIRE;
  const out = path(lane.svg, `M ${x0} ${y} L ${x1 - 4} ${y}`, C.violet, 3);
  const tiles = WORKERS.map(worker => makeWorkerTile(root, worker));
  const clients = FLEET_CLIENTS.map(app => iconTile(root, app.icon, app.name, FLEET.tile.w, FLEET.tile.h));
  return { lane, apps, links, out, tiles, clients };
}
// The two lines each Worker knows from chapter 6 on: the proxy's local address and the short Namespace name. FULL_NS:
// the full Namespace name that the proxy writes over the short one on the way out.
const WORKER_LINES = ['proxy:7233', 'payments'];
const FULL_NS = 'payments.a1b2c';
// How long the light takes to run along a connection to or from the proxy, seconds
const PROXY_FLOW_PERIOD = 2.0;
// Where a tag about the Workers sits in the fleet layout, centered under them (NO SECRETS, WORKERS UNCHANGED)
const UNDER_WORKERS = {
  x: (WORKERS[0].x + WORKERS[2].x) / 2, y: (FLEET.rows[1] + FLEET.tile.h / 2 + FLEET.y + FLEET.h) / 2,
};
// The TLS tube that the proxy adds on the way out (chapters 6 and 7): from the box's right edge to 12 px inside
// TEMPORAL, on the wire's line, high enough to hold the card and its tags; its label above it
const PROXY_TUBE = { x0: PROXY_WIRE.x0, x1: PROXY_WIRE.x1 + 12, y: LANE.wire.y, h: 176 };
PROXY_TUBE.label = { x: (PROXY_TUBE.x0 + PROXY_TUBE.x1) / 2, y: PROXY_TUBE.y - PROXY_TUBE.h / 2 - 36 };
// The card that goes through the proxy in chapter 6, a lane-size card at scale k, with its Namespace tag straddling
// its bottom edge and the API KEY under it (tagH: their height; nsW and keyW: their widths; tagGap: the gap between
// them); h: its height on the stage; keyDy: from its center to the API KEY's
const PROXY_CARD = { w: PAYLOAD_IN_WORKER.w, k: 0.45, tagH: 28, nsW: 172, keyW: 124, tagGap: 6 };
PROXY_CARD.h = payloadLayout(PROXY_CARD.w).h * PROXY_CARD.k;
PROXY_CARD.keyDy = PROXY_CARD.h / 2 + PROXY_CARD.tagH / 2 + PROXY_CARD.tagGap + PROXY_CARD.tagH;
// The payments Namespace inside TEMPORAL that the card goes into in chapter 6: its center and size; card: where the
// card rests in it, under its name
const PROXY_BAND = { x: FLEET.proxyTemporal.x + FLEET.proxyTemporal.w / 2, y: LANE.wire.y, w: 180, h: 250 };
PROXY_BAND.card = { x: PROXY_BAND.x, y: PROXY_BAND.y - PROXY_BAND.h / 2 + 64 + PROXY_CARD.h / 2 };
// The payments Namespace band (PROXY_BAND), labelled with its full name at its top left
const makeProxyBand = root => E(root,
  '<div style="position:absolute;left:16.5px;top:12.5px">'
  + `<div class="mono" style="font-size:12px;line-height:18px;letter-spacing:.14em;color:${C.slate}">NAMESPACE</div>`
  + `<div class="mono" style="font-size:18px;line-height:26px">${FULL_NS}</div></div>`,
  '', {
    width: PROXY_BAND.w + 'px', height: PROXY_BAND.h + 'px', border: `1.5px solid ${C.line}`, borderRadius: 'var(--r)',
  });
// A small tag beside the card (PROXY_CARD): a fixed width w, its HTML centered, in the violet look
const proxyCardTag = (root, html, w) => E(root, html, 'mono', {
  width: w + 'px', height: PROXY_CARD.tagH + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: '6px', fontSize: '16px', letterSpacing: '.06em', whiteSpace: 'pre', border: `1.5px solid ${C.violet}`,
  borderRadius: 'var(--rs)', background: 'var(--violet-solid)',
});
// The Namespace tag's text: the full name's room always laid out (the tag's font is monospace), its first `shown`
// characters visible and the rest invisible, so the visible text never moves as it types and the full name sits
// centered; the caret, if `caret`, overlays the next character's cell (past the last one once the name is whole)
function namespaceHtml(shown, caret) {
  const cursor = caret
    ? `<span style="position:absolute;top:0;left:calc(${shown} * (1ch + .06em))">▌</span>` : '';
  return `<span style="position:relative">${FULL_NS.slice(0, shown)}`
    + `<span style="opacity:0">${FULL_NS.slice(shown)}</span>${cursor}</span>`;
}

// ---------- the recap tiles (chapters 9 and 10)
// The benefits of the recap, [icon, label], one tile each in the use cases' row (USE_CASE_ROW); a <br> splits a label
// that would crowd its tile
const RECAP = [
  ['door', 'No inbound ports'], ['badge', 'Verified<br>connections'], ['key', 'Your keys only'],
  ['keyOff', 'No secrets<br>in Workers'],
];
// The label height of the recap and use-case tiles, in lines (padTileLabel): one label in a row may take two lines,
// and the tiles keep their icons aligned
const TILE_LABEL_LINES = 2;
// The padlock badge centered on a recap tile's top edge, as on the payload card: its diameter and the padlock's size,
// px, both even, so they center on whole pixels
const RECAP_BADGE = { size: 56, lock: 32 };
// A recap tile of USE_CASE_ROW's size and type scale for a benefit of RECAP, with its padlock badge (.badge, .lock),
// open and unlit until setRecapTile() sets its state. Chapter 9 lands these tiles; chapter 10 opens on them, padlocks
// shut, and flips them over into the use cases.
function makeRecapTile(p, [icon, label]) {
  const { w, h } = USE_CASE_ROW;
  const { size, lock } = RECAP_BADGE;
  const tile = iconTile(p, icon, label, w, h, C.ink, USE_CASE_TYPE);
  padTileLabel(tile, TILE_LABEL_LINES);
  // offsets from the tile's padding box, inside its 1.5 px border; out of the flex flow, as absolutely positioned
  tile.badge = E(tile, '', '', {
    left: (w - size) / 2 - 1.5 + 'px', top: -size / 2 - 1.5 + 'px', width: size + 'px', height: size + 'px',
    borderRadius: '50%', background: C.bg, border: `1.5px solid ${C.line}`, opacity: 1,
  });
  // centered in the badge, offsets from inside its 1.5 px border
  tile.lock = makeLock(tile.badge, lock, 1.9, {
    left: (size - lock) / 2 - 1.5 + 'px', top: (size - lock) / 2 - 1.5 + 'px', opacity: 1,
  });
  setRecapTile(tile);
  return tile;
}
// State of a recap tile: seal (0 to 1, a linear progress) snaps its padlock shut (setLock), which turns the badge's
// border neon; lit gives the tile the UV border of a tile that lights up
function setRecapTile(tile, { seal = 0, lit = false } = {}) {
  setLock(tile.lock, seal);
  tile.badge.style.borderColor = seal >= LOCK_SHUT ? C.neon : C.line;
  tile.style.borderColor = lit ? C.uv : C.line;
}

// ---------- hand-offs (match cuts: a chapter ends on the next one's first frame, see the plan's motion direction)
// Opacity of a lane part that a held shot crops at the frame's edge: dimmed below half, out of focus, so the shot
// reads as a framing and the layout check measures what it frames
const OFF_SHOT = 0.3;
// Chapter 1 to 2: the framing chapter 1 pushes in to at its end and chapter 2 opens on, [x, y, scale] for shot(): the
// Worker and its card on the left, the wire's start in the middle. WIRE_LANE: the lane's opacities there (placeLane):
// the zones, pushed off the frame, dimmed below half, their headings and the history hidden.
const WIRE_SHOT = [620, 515, 1.35];
const WIRE_LANE = { env: OFF_SHOT, temporal: OFF_SHOT, history: 0, heads: 0 };
// Chapter 2 to 3: the whip right, from the Namespaces to the Event History. Chapter 2 frames TEMPORAL's split (from),
// the card at its tube scale (TUBE.k) crossing into payments (card); the whip then eases the camera to the close shot
// of the stored history (to: HIST_SHOT, where chapter 3 holds as the history grows) and the card to the lane's
// history (cardTo) over d seconds. Chapter 2 plays its first `cut` seconds and ends there (fadeOut:
// 0); chapter 3 opens there (fadeIn: 0) and plays the rest: read both sides from tubeWhip(). At the cut: placeLane()
// with `lane` (the environment and the Worker, cropped at the left edge, dimmed), placeTube(tube, TUBE),
// placeNamespaces(ns, 1, 1, [1, 1]).
const TUBE_HANDOFF = {
  from: [1153, 515, 1.4], to: HIST_SHOT,
  card: [TUBE.x1 - 62, TUBE.y], cardTo: [LANE.history.x, LANE.history.y],
  d: 0.7, cut: 0.25,
  lane: { env: OFF_SHOT, worker: OFF_SHOT, temporal: OFF_SHOT, wire: 0, door: 0 },
};
// The whip u seconds after it starts (chapter 2: u = t - (dur - TUBE_HANDOFF.cut); chapter 3: u = t +
// TUBE_HANDOFF.cut): camera, the shot() offsets, and card, the card's center
function tubeWhip(u) {
  const { from, to, card, cardTo, d } = TUBE_HANDOFF;
  const p = P(u, 0, d);
  return {
    camera: shot(u, from, [[0, ...to, d]]),
    card: [lerp(card[0], cardTo[0], p), lerp(card[1], cardTo[1], p)],
  };
}
// Chapter 3 to 4: the rewind. A copy of the payload card streaks back from the Event History to the Worker as the
// camera whips left; both land 0.15 s before chapter 3 ends, and chapter 4 opens there. shot: the framing, [x, y,
// scale] for shot(), on the Worker with the card in clear at PAYLOAD_IN_WORKER and room on its right for the Data
// Converter (CONVERTER). lane: the lane's opacities (placeLane; the others are 1): the zones, pushed off the frame,
// dimmed, their headings and the lane's history hidden, the wire back where the TLS tube was. stored: the opacity of
// the stored Event History (placeStoredHistory, every row and SAVED tag shown, card and chip alike) and of the
// chip's READABLE verdict; the chip is in clear and red (setPayload red: 1); all are cropped at the frame's right
// edge. The Web UI and the viewers are gone.
const REWIND_HANDOFF = {
  shot: [575, 506, 1.5],
  lane: { env: OFF_SHOT, temporal: OFF_SHOT, history: 0, door: 0, heads: 0 },
  stored: OFF_SHOT,
};
// Chapter 4 to 5: the pull-back that chapter 4 ends on and chapter 5 opens on, [x, y, scale] for shot(): the whole
// lane, a little smaller than at rest, with room round it. WIDE_LANE: the lane's opacities there (placeLane; the
// others are 1): the bare lane, the Worker running with no card, the wire, TEMPORAL with its logo only (the stored
// history, the Web UI and the Search Attributes have faded out). Call frameLaneEdges() with the camera.
const WIDE_SHOT = [960, 515, 0.88];
const WIDE_LANE = { history: 0, door: 0 };
// Chapter 5 to 6: the six Workers, bare, that chapter 5 ends on once their chips have fallen, and chapter 6 opens on.
// shot: the framing, [x, y, scale] for shot(), chapter 4's wide shot, which chapter 5 holds throughout. lane:
// placeLane()'s options there (the others are 1): the fleet layout of chapter 5 (FLEET_ZONES), the lane's Worker panel,
// wire, history and door hidden. The six Worker tiles (makeWorkerTile at WORKERS, built after the lane) show their
// gear turning and their language tag, no chip and no code line. Nothing else shows. Call placeLane(), then
// frameLaneEdges() with the camera.
const BARE_WORKERS_HANDOFF = {
  shot: WIDE_SHOT,
  lane: { envZone: FLEET_ZONES.env, temporalZone: FLEET_ZONES.temporal, worker: 0, wire: 0, history: 0, door: 0 },
};
// Chapter 6 to 7: the push into the TEMPORAL PROXY box that chapter 6 ends on and chapter 7 opens on, [x, y, scale]
// for shot(): the box fills the content frame's height (y 155-875). See chapter 6's header for what shows there.
const PROXY_SHOT = [PROXY.x, PROXY.y, 2.4];
// Chapter 7 to 8: the pull-back out of the proxy that chapter 7 ends on and chapter 8 opens on, [x, y, scale] for
// shot(): the whole fleet with the proxy, in chapter 4's wide shot. What shows there, every part at full opacity: the
// lane in the proxy layout (placeLane() with BARE_WORKERS_HANDOFF.lane and PROXY_ZONES), the six Workers with their two
// lines (WORKER_LINES), the SDK client and the Web UI, the eight connections and the proxy's connection to TEMPORAL
// (PROXY_WIRE) with their light (PROXY_FLOW_PERIOD), and the proxy box; TEMPORAL holds only its logo. Call
// frameLaneEdges() with the camera.
const FULL_LANE_SHOT = WIDE_SHOT;

// ---------- camera and motion
// Camera framing eased between stops, like pan(): from and each stop give [x, y, scale], the stage point (x, y)
// centered on (960, 515) at that scale; a stop is [at, x, y, scale, d = 0.9]. Returns the offsets for
// setCamera(cam, t, dur, { ...shot(t, from, stops), enter: 1, exit: 1 }), in whole pixels. setCamera() scales
// around (960, 540), hence the 25 px between 540 and 515 in dy.
// It eases each framing's offsets, together with the scale, rather than its center: every stage point's screen
// position is then a straight blend of its positions in the two framings, so it moves one way. Easing the center
// and the scale together would swing points far from the center out and back when the scale changes.
function shot(t, from, stops) {
  const offsets = (x, y, scale) => ({ dx: (960 - x) * scale, dy: (540 - y) * scale - 25 });
  let { dx, dy } = offsets(...from);
  let scale = from[2];
  for (const [at, sx, sy, ss, d = 0.9] of stops) {
    const p = P(t, at, d);
    const to = offsets(sx, sy, ss);
    dx = lerp(dx, to.dx, p);
    dy = lerp(dy, to.dy, p);
    scale = lerp(scale, ss, p);
  }
  return { scale, dx: Math.round(dx), dy: Math.round(dy) };
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
