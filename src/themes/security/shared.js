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
  // a crosshair: a penetration test
  target: '<circle cx="12" cy="12" r="7.5"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6"/>',
  // a gateway: an arch on two posts, an arrow passing through it: a Nexus Endpoint
  gateway: '<path d="M4 21V9a8 6 0 0 1 16 0v12"/><path d="M8 15h8M13 12l3 3-3 3"/>',
  // an eye struck through: hidden from view
  eyeOff: '<path d="M2 12c3-6 17-6 20 0-3 6-17 6-20 0z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/>',
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
// Seal progress at which the shackle of setLock() lands in the body (backOut first reaches 1 there)
const LOCK_SHUT = 0.37;
// A lockSvg() padlock in a size px box, open or shut by setLock(). Its body is filled with the stage black, so the
// shackle's legs hide inside it as the lock snaps shut. css: extra styles of its box.
function makeLock(p, size, stroke = 1.8, css = {}) {
  const e = E(p, lockSvg(size, { stroke, fill: C.bg }), '', { width: size + 'px', height: size + 'px', ...css });
  e.size = size;
  e.svg = e.querySelector('svg');
  return e;
}
// seal: 0 open (the shackle lifted out of the body) to 1 shut. Pass a linear progress: the shackle snaps down with a
// backOut overshoot, dipping into the body before it settles, and the lock turns neon and flashes as it lands.
function setLock(lock, seal) {
  const s = clamp(seal);
  const lift = (1 - backOut(s)) * LOCK_LIFT;
  liftShackle(lock.svg, lift);
  const shut = s >= LOCK_SHUT;
  lock.svg.setAttribute('stroke', shut ? C.neon : C.ink);
  // a steady glow once shut, brighter for an instant as the shackle lands
  const glow = shut ? 0.6 + 0.4 * Math.max(0, 1 - (s - LOCK_SHUT) / 0.4) : 0;
  lock.svg.style.filter = glow
    ? `drop-shadow(0 0 ${Math.round(lock.size * 0.3 * glow)}px rgba(${RGB.neon},${(0.8 * glow).toFixed(3)}))`
    : 'none';
}

// The round padlock badge centered on the top edge of a box w px wide (the payload card, a recap tile, the sealed
// result): a badge `badge` px across, in the stage black with a line border, and a makeLock() padlock lockSize px
// in its middle; pass even sizes, so both center on whole pixels. The scenes set the border color and the lock's state.
// Both are placed from the padding box of their parent, TILE_BORDER inside its outer edge.
function makeLockBadge(parent, w, badge, lockSize) {
  const e = E(parent, '', '', {
    left: (w - badge) / 2 - TILE_BORDER + 'px', top: -badge / 2 - TILE_BORDER + 'px', width: badge + 'px',
    height: badge + 'px', borderRadius: '50%', background: C.bg, border: `1px solid ${C.line}`, opacity: 1,
  });
  const inset = (badge - lockSize) / 2 - TILE_BORDER;
  const lock = makeLock(e, lockSize, 1.9, { left: inset + 'px', top: inset + 'px', opacity: 1 });
  return { badge: e, lock };
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
    `<div class="alarm" style="position:absolute;inset:-${TILE_BORDER}px;border:1px solid ${C.red};`
    + `border-radius:var(--r);background:rgba(${RGB.red},.12);opacity:0"></div>`
    + `<div class="mono" style="font-size:${head.font}px;line-height:${head.line}px;letter-spacing:.14em;`
    + `color:${C.slate};margin-bottom:${head.gap}px">PAYLOAD</div>`
    + rowsHtml,
    'tile', {
      width: w + 'px', height: h + 'px', textAlign: 'left',
      padding: `${pad.top}px ${pad.x}px ${pad.bottom}px`,
    });
  const { badge: lockBadge, lock } = makeLockBadge(card, w, badge, 2 * px(12));
  card.lockBadge = lockBadge;
  card.lock = lock;
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
  history: { x: 1574, y: 515, w: 392, h: 260 },
  ui: { x: 1350, y: 750, w: 300, h: 150 },
  door: { x: 760, y: 720 },
};
// Hand-off from the intro to chapter 1: the payload card in the Worker, its center and width. The intro's card flies
// there and shrinks to this width; chapter 1 opens on it. In the Worker panel, under its heading and code line.
// layout: the sizes of a card of that width (payloadLayout), the lane-size card of every lane scene.
const PAYLOAD_IN_WORKER = { x: LANE.worker.x, y: LANE.worker.y + 55, w: 340 };
PAYLOAD_IN_WORKER.layout = payloadLayout(PAYLOAD_IN_WORKER.w);

// The environment's dashed edge, the theme's boundary look: a slate stroke `width` px wide, dashes of `dash` px, `gap`
// px apart (chapter 9's Nexus gate draws its boundary in it too)
const ENV_EDGE = { width: 2, dash: 10, gap: 8 };
// Draws path p as a dashed line up to prog (0 to 1) of its length, with opacity o: dashes of `dash` px, `gap` px
// apart, which stay in place as it draws (draw() makes its dashes flow)
function drawDashed(p, prog, o = 1, dash = ENV_EDGE.dash, gap = ENV_EDGE.gap) {
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
// How far a zone's labels sit inside it: its heading under its top edge and from its left edge, its caption above its
// bottom edge, in px
const ZONE_LABEL_INSET = { head: 20, left: 24, cap: 24 };
// The height of TEMPORAL's heading, the official lockup, px; YOUR ENVIRONMENT's line is as high
const ZONE_LOGO_H = 34;
// A zone's heading (zone.head), inside a frame of its own (zone.headFrame): placeLane() sets the heading's opacity,
// frameLaneEdges() the frame's
const zoneHeading = html => '<div class="head-frame" style="position:absolute;'
  + `left:${ZONE_LABEL_INSET.left}px;top:${ZONE_LABEL_INSET.head}px">${html}</div>`;
// A zone's caption (zone.cap), centered, inside a frame of its own (zone.capFrame) like the heading; hidden until a
// scene sets its opacity
const zoneCaption = text => '<div class="cap-frame" style="position:absolute;left:0;right:0;'
  + `bottom:${ZONE_LABEL_INSET.cap}px"><div class="cap lbl" style="text-align:center;font-size:18px;`
  + `color:var(--ink);opacity:0">${text}</div></div>`;

// The slate EMPTY note of the lane's Event History, centered across the card, 140 px under its top: in the middle of
// the room under the heading
const historyEmptyNote = () => '<div class="empty mono" style="position:absolute;left:0;right:0;top:140px;'
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
    // its line as high as TEMPORAL's logo, so both headings share a center line
    zoneHeading(`<div class="head lbl" style="padding-left:0;font-size:18px;line-height:${ZONE_LOGO_H}px">`
      + 'Your environment</div>')
    + zoneCaption('Your code runs here'),
    // a transparent border as thick as TEMPORAL's, so both zones' labels sit as far from their edges
    '', {
      width: env.w + 'px', height: env.h + 'px', background: 'rgba(148,163,184,.04)', borderRadius: 'var(--r)',
      border: '1px solid transparent',
    });
  lane.temporal = E(root,
    zoneHeading(`<img class="head" src="${LOGO}" style="height:${ZONE_LOGO_H}px;display:block">`)
    + zoneCaption('Your code never runs here'),
    'tile', { width: temporal.w + 'px', height: temporal.h + 'px', borderColor: C.uv, background: C.temporalSurface });
  [lane.env, lane.temporal].forEach(zone => {
    zone.head = zone.querySelector('.head');
    zone.headFrame = zone.querySelector('.head-frame');
    zone.cap = zone.querySelector('.cap');
    zone.capFrame = zone.querySelector('.cap-frame');
  });

  lane.svg = svgLayer(root);
  // the environment's dashed edge (placeLane() redraws it when the zone moves)
  lane.envEdges = envEdgeDs(env).map(d => path(lane.svg, d, C.slate, ENV_EDGE.width, false));
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
    background: C.bg, border: `1px solid ${C.slate}`, borderRadius: 'var(--rs)',
  });
  lane.door.icon = lane.door.querySelector('svg');
  return lane;
}
// The opacities of the lane's parts that placeLane() shows: every part shown, unless a scene says otherwise
const LANE_SHOWN = { env: 1, temporal: 1, worker: 1, history: 1, wire: 1, door: 1, heads: 1 };
// Shows the lane's parts in place, each with its opacity in o (LANE_SHOWN by default): env (with its dashed edge),
// temporal, worker, history, wire, door, and heads, the zones' headings (YOUR ENVIRONMENT and the logo), which a close
// shot pushes up under the chapter header (frameLaneEdges also fades them out at the frame's top edge); close,
// TEMPORAL's widening into the close layout (CLOSE); envZone and temporalZone, the zones' rectangles when they move
// away from LANE's (the fleet layout, FLEET; see lerpZone). The Worker runs, its gear turning; the door is in its slate
// and white look. The zone captions (env.cap, temporal.cap) keep the opacity a scene gives them.
function placeLane(lane, o = {}) {
  const { env, temporal, worker, history, wire, door, heads } = { ...LANE_SHOWN, ...o };
  const { close = 0 } = o;
  lane.env.head.style.opacity = heads;
  lane.temporal.head.style.opacity = heads;
  const center = zone => [zone.x + zone.w / 2, zone.y + zone.h / 2];
  const envZone = o.envZone ?? LANE.env;
  if (lane.envKey !== zoneKey(envZone)) {
    lane.env.style.width = envZone.w + 'px';
    lane.env.style.height = envZone.h + 'px';
    envEdgeDs(envZone).forEach((d, i) => setD(lane.envEdges[i], d));
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
// The TLS tube along the wire, at camera rest: from the Worker panel's right edge (x0) to TEMPORAL's left edge (x1),
// each mouth centered on its edge, on the wire's line y, h px high. The payload card rides it at scale k; its TLS
// label sits above it, centered on label.
const TUBE = { x0: LANE.worker.x + LANE.worker.w / 2, x1: LANE.temporal.x, y: LANE.wire.y, h: 184, k: 0.6 };
TUBE.label = { x: TUBE.x0 + 120, y: TUBE.y - TUBE.h / 2 - 42 };
// How far the ring of a tube's mouth reaches past the tube's end, px: half the mouth's width
const TUBE_MOUTH = 12;
// The width of a tube's label pill (makeTube), px: the regular one, and the big one of chapter 9
const TUBE_LABEL_W = { regular: 112, big: 180 };
// A TLS tube along a connection, for its geometry geom (TUBE, or PROXY_TUBE from chapter 6: x0 and x1, its ends; y,
// its line; h, its height; label, its label's center): a glass pipe with neon walls, a neon ring at each mouth and a
// flow of light inside it (tube.flow) running toward Temporal; then its TLS label (tube.label). placeTube() shows them.
// Its glass lies on an opaque body in the fill `body` (the stage's by default; a tube inside a zone takes the zone's
// fill): build the tube after the lines it crosses (zone borders, dashed edges, rails, Namespace bands), which then
// stop at its walls, so it reads as one channel. Its mouths are opaque too, their face filled like the body: the
// edge of the tile or panel it leaves (the Worker's, at the tube's x0) stops at the mouth's ring instead of showing
// inside it. Whatever rides inside it (a card, a connection) goes after it. Under it, a backing in the same fill
// (tube.backing), mouths included, which keeps the tube opaque while placeTube() dims it. label: the protocol its
// label names, cased as written (a pill sets its text in capitals); big: the label in a big pill (TUBE_LABEL_W).
function makeTube(root, { x0, x1, h }, { body = C.bg, label = 'TLS', big = false } = {}) {
  const glass = `linear-gradient(to bottom, rgba(${RGB.neon},.16), rgba(${RGB.neon},.03) 45%, rgba(${RGB.neon},.08))`;
  // the mouth spans the tube's border box (top -2px, under its top wall), so its face's gradient, set on its padding
  // box, lines up with the body's
  const mouth = side => `<div style="position:absolute;${side}:-${TUBE_MOUTH}px;top:-2px;`
    + `width:${2 * TUBE_MOUTH}px;height:${h}px;`
    + `border:2px solid ${C.neon};border-radius:50%;background:${glass};background-color:${body}"></div>`;
  const backingMouth = side => `<div style="position:absolute;${side}:-${TUBE_MOUTH}px;top:0;`
    + `width:${2 * TUBE_MOUTH}px;height:${h}px;border-radius:50%;background:${body}"></div>`;
  const backing = E(root, backingMouth('left') + backingMouth('right'), '',
    { width: (x1 - x0) + 'px', height: h + 'px', background: body });
  const tube = E(root,
    '<div class="flow" style="position:absolute;inset:0;background-image:repeating-linear-gradient(90deg,'
    + `rgba(${RGB.neon},0) 0 40px,rgba(${RGB.neon},.16) 40px 42px)"></div>${mouth('left')}${mouth('right')}`,
    '', {
      width: (x1 - x0) + 'px', height: h + 'px', borderTop: `2px solid ${C.neon}`,
      borderBottom: `2px solid ${C.neon}`,
      background: glass,
      backgroundColor: body,
      boxShadow: `0 0 28px rgba(${RGB.neon},.22)`,
    });
  tube.backing = backing;
  tube.flow = tube.querySelector('.flow');
  const labelHtml = `${ICON('lock', big ? 24 : 18, C.neon, 2)}${label}`;
  const labelW = big ? TUBE_LABEL_W.big : TUBE_LABEL_W.regular;
  tube.label = fixedTag(root, labelHtml, big ? 'neon solid big' : 'neon solid', labelW, { gap: 8 });
  tube.label.style.textTransform = 'none';
  return tube;
}
// The tube from x0 to x1 of geom (see makeTube; a scene may pass a shorter x1, the tube's width follows), drawn from
// its x0 end up to drawn (0 to 1), with opacity o, dimmed to dim (OFF_SHOT when the frame crops it); its label at
// geom.label with opacity label (o by default) and scale labelS. Its light flows on the ambient clock G, so it runs on
// across a cut. A dimmed tube lies on its backing, at opacity o, so the lines it crosses never show through it; at
// full strength its own body hides them, and the backing stays hidden.
function placeTube(tube, geom, { drawn = 1, o = 1, dim = 1, label = o, labelS = 1 } = {}) {
  const { x0, x1, y } = geom;
  const shown = drawn > 0 ? o : 0;
  // the clip keeps the glow round the tube, and cuts it on the right while it draws
  const clip = drawn < 1 ? `inset(-40px ${((1 - drawn) * 100).toFixed(3)}% -40px -40px)` : 'none';
  [tube, tube.backing].forEach(el => {
    el.style.width = (x1 - x0) + 'px';
    el.style.clipPath = clip;
  });
  place(tube, (x0 + x1) / 2, y, 1, shown * dim);
  place(tube.backing, (x0 + x1) / 2, y, 1, dim < 1 ? shown : 0);
  tube.flow.style.backgroundPosition = `${((G * 90) % 42).toFixed(2)}px 0`;
  place(tube.label, geom.label.x, geom.label.y, labelS, label);
}

// ---------- the private corridor (chapters 2 and 3)
// The private link round the TLS tube where it crosses the network, at camera rest: it spans the gap between the
// zones from edge to edge (x0 to x1), its two rails rail px thick, gap px outside the tube's walls, h px high in all
const CORRIDOR = { x0: LANE.env.x + LANE.env.w, x1: LANE.temporal.x, gap: 8, rail: 3 };
CORRIDOR.h = TUBE.h + 2 * (CORRIDOR.gap + CORRIDOR.rail);
// The corridor (CORRIDOR): two violet rails and an opaque fill between them, which hides what lies behind the tube
// there. Build it under the tube; placeCorridor() shows it.
function makeCorridor(root) {
  return E(root, '', '', {
    width: (CORRIDOR.x1 - CORRIDOR.x0) + 'px', height: CORRIDOR.h + 'px',
    borderTop: `${CORRIDOR.rail}px solid ${C.violet}`, borderBottom: `${CORRIDOR.rail}px solid ${C.violet}`,
    background: `linear-gradient(rgba(${RGB.violet},.07), rgba(${RGB.violet},.07)), ${C.bg}`,
    boxShadow: glowShadow(RGB.violet, 0.5, { blur: 24, alpha: 0.5 }),
  });
}
// The corridor drawn from its left end up to drawn (0 to 1), toward TEMPORAL, with opacity o. The clip cuts its glow
// at the zones' edges, where the rails end, and on the right while it draws.
function placeCorridor(corridor, { drawn = 1, o = 1 } = {}) {
  place(corridor, (CORRIDOR.x0 + CORRIDOR.x1) / 2, TUBE.y, 1, drawn > 0 ? o : 0);
  corridor.style.clipPath = `inset(-40px ${((1 - drawn) * 100).toFixed(3)}% -40px 0)`;
}

// ---------- the Namespaces (chapters 2 and 3)
// The Namespaces inside TEMPORAL, top to bottom: each one's name, the middle y and height of its band. The Worker's
// own, payments, surrounds the Event History, level with the wire and the tube.
const NAMESPACES = [
  { name: 'support', y: 310, h: 86 },
  { name: 'payments', y: 515, h: 300, mine: true },
  { name: 'analytics', y: 720, h: 86 },
];
// The bands span TEMPORAL from 20 px clear of the TLS tube's mouth, on its left edge, to 10 px inside its right side:
// their center x and width. Wide enough for the Event History, which sits right of TEMPORAL's center (LANE.history),
// to keep 20 px clear of payments' right edge as of its top and bottom.
const NS_BAND_EDGES = { left: TUBE.x1 + TUBE_MOUTH + 20, right: LANE.temporal.x + LANE.temporal.w - 10 };
const NS_BAND = {
  x: (NS_BAND_EDGES.left + NS_BAND_EDGES.right) / 2, w: NS_BAND_EDGES.right - NS_BAND_EDGES.left,
};
// The light that sweeps across TEMPORAL as it splits into Namespaces, px wide
const NS_SWEEP_W = 160;
// The Namespace bands, under the lane's SVG layer and the Event History, each labelled at its top left, a padlock on
// the right of the others; and the light sweep over them, in a box across TEMPORAL's width that holds only the bands'
// height (12 px round them), so the sweep stays inside a close shot that crops TEMPORAL itself. placeNamespaces()
// shows them.
function makeNamespaces(lane) {
  const bands = NAMESPACES.map(ns => {
    // offsets from the band's padding box, TILE_BORDER inside its edge
    const labelTop = (ns.mine ? 20 : (ns.h - 44) / 2) - TILE_BORDER;
    const band = E(lane.temporal.parentNode,
      `<div style="position:absolute;left:${20 - TILE_BORDER}px;top:${labelTop}px">`
      + `<div class="mono" style="font-size:13px;line-height:18px;letter-spacing:.14em;color:${C.slate}">`
      + 'NAMESPACE</div>'
      + `<div class="mono" style="font-size:20px;line-height:26px">${ns.name}</div></div>`,
      '', { width: NS_BAND.w + 'px', height: ns.h + 'px', border: `1px solid ${C.line}`, borderRadius: 'var(--r)' });
    lane.svg.before(band);
    band.ns = ns;
    if (!ns.mine) {
      band.lock = makeLock(band, 30, 1.9, {
        left: NS_BAND.w - 54 - TILE_BORDER + 'px', top: (ns.h - 30) / 2 - TILE_BORDER + 'px',
      });
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

// The red alarm look of this theme's verdicts (UNREADABLE, REJECTED, READABLE; IN CLEAR in its pill): a solid red
// fill under dark bold text, which reads at a glance. A statusTag kind of this theme only, so other themes keep theirs.
STATUS_KINDS.alarm = { background: C.red, color: C.bg, borderColor: C.red, icon: ['x', C.bg, 2.8] };
// Sets statusTag e to the alarm look with that label, in bold
function setAlarmTag(e, label) {
  e.style.fontWeight = '700';
  setStatus(e, label, 'alarm');
}
// Sets a verdict tag's label and kind: 'alarm' (setAlarmTag) or another statusTag kind (setStatus), in regular weight
function setVerdict(e, label, kind) {
  if (kind === 'alarm') {
    setAlarmTag(e, label);
  } else {
    e.style.fontWeight = '';
    setStatus(e, label, kind);
  }
}
// A verdict tag in the heading row of a tile or a Namespace (a statusTag, its icon as large as its text, font px):
// h px high, its right edge `right` px and its top `top` px from the parent's padding box; it pops from its right
// edge (popVerdict) and stays hidden until then
function makeHeadingVerdict(parent, { font, h, right, top }) {
  const e = statusTag(parent, { font, icon: font });
  Object.assign(e.style, {
    left: 'auto', right: right + 'px', top: top + 'px', height: h + 'px', transformOrigin: 'right center',
  });
  return e;
}
// Pops verdict tag e in at `at`, with its label and kind (see setVerdict)
function popVerdict(e, t, label, kind, at) {
  setVerdict(e, label, kind);
  popScale(e, popIn(t, at));
}

// ---------- the Event History that stores the payload, and the Web UI (chapters 3 and 4)
// Inside TEMPORAL, at camera rest: the stored Event History, with the Web UI's place (LANE.ui) under it; in the close
// layout (CLOSE), the history on the left and a column on its right, the Web UI over the viewers (chapter 3) or the
// Search Attributes (chapter 4). The Event History grows from the lane's (LANE.history) to STORED_HIST, 28 px clear of
// the TLS tube's mouth on its left.
const STORED_HIST = { x: 1480, y: 460, w: 560, h: 398 };
// Its rows; row 2 holds the payload. HIST_ROW: each row's top in the card, the row height and the text size.
const HIST_ROWS = [
  'Workflow started: TransferWorkflow', 'Activity completed: debitAccount', 'Activity scheduled: creditAccount',
];
const HIST_ROW = { tops: [56, 92, 352], h: 32, font: 18 };
// The payload chip of row 2: the payload card itself, a lane-size card (PAYLOAD_IN_WORKER.w) shown at scale k,
// left-aligned with the rows' text and 143 px under the card's top, its padlock and verdict tag as far from rows 2
// and 3. Its center (x, y), its size on the stage (w, h)
// and tagY, the center of its verdict tag (READABLE, then NEVER SEES YOUR PAYLOADS), which straddles its bottom edge,
// 3 px low, clear of its last value.
const HIST_CHIP = { k: 0.8 };
HIST_CHIP.w = PAYLOAD_IN_WORKER.w * HIST_CHIP.k;
HIST_CHIP.h = PAYLOAD_IN_WORKER.layout.h * HIST_CHIP.k;
HIST_CHIP.x = STORED_HIST.x - STORED_HIST.w / 2 + 70 + HIST_CHIP.w / 2;
HIST_CHIP.y = STORED_HIST.y - STORED_HIST.h / 2 + 143 + HIST_CHIP.h / 2;
HIST_CHIP.tagY = HIST_CHIP.y + HIST_CHIP.h / 2 + 3;
// The close shot that reads the small text of TEMPORAL, [x, y, scale] for shot(): the stored history, centered; at 1.6
// the chip's values render at 19.7 px and its labels at 14.5 px. TEMPORAL's zone, cut by the frame there, dims.
const HIST_SHOT = [STORED_HIST.x, STORED_HIST.y, 1.6];
// The close layout of TEMPORAL in HIST_SHOT, when the message needs more than the history: rather than the camera
// moving, the content comes to it. The zone widens on both sides (zone: its left edge x and width; it narrows back
// before any wider shot), the history slides left (hist: its center x) and a column comes in on its right, the Web
// UI (ui: its center y, LANE.ui's size) over a slot of the same size (slot: its center y; the viewers in chapter 3,
// the Search Attributes in chapter 4). On screen it spans x 160-1760 and y 201-829.
const CLOSE = {
  zone: { x: 956, w: 1048 }, hist: { x: 1260 }, column: { x: 1830 },
  // the Web UI and the slot, 24 px apart, centered on the history
  ui: { y: STORED_HIST.y - (LANE.ui.h + 24) / 2 }, slot: { y: STORED_HIST.y + (LANE.ui.h + 24) / 2 },
};
// How far the history and its chip move left in the close layout, at progress `close` (0 to 1)
const closeDx = close => Math.round(lerp(0, CLOSE.hist.x - STORED_HIST.x, close));
// The stored Event History: the white card (STORED_HIST) with its rows, a SAVED tag per row and the lane history's
// EMPTY note, then its payload chip (card.chip, a makePayload). placeStoredHistory() shows them; the chip's state
// (setPayload) stays with the scenes.
function makeStoredHistory(root) {
  const card = makeHistoryCard(root, HIST_ROWS, {
    w: STORED_HIST.w, h: STORED_HIST.h, font: HIST_ROW.font, rowH: HIST_ROW.h, rowTop: i => HIST_ROW.tops[i],
    tagTop: i => HIST_ROW.tops[i] + (HIST_ROW.h - 24) / 2, tagRight: 20, tag: { font: 12, icon: 12 },
  });
  card.tags.forEach(tag => {
    tag.style.height = '24px';
  });
  card.insertAdjacentHTML('beforeend', historyEmptyNote());
  card.empty = card.querySelector('.empty');
  card.chip = makePayload(root, { w: PAYLOAD_IN_WORKER.w });
  return card;
}
// grow (0 to 1): the card grows from the lane's history, EMPTY, to STORED_HIST, as EMPTY fades; o: the opacity of the
// card; rows: the progress of each row as it slides in (showRow); saved: the opacity of each row's SAVED tag; chip: the
// opacity of the chip, which rests at HIST_CHIP; close: the slide of both into the close layout (closeDx).
function placeStoredHistory(card, { grow = 1, o = 1, rows = [1, 1, 1], saved = [1, 1, 1], chip = 1, close = 0 } = {}) {
  const { history } = LANE;
  // even sizes, so the card rests on whole pixels
  card.style.width = 2 * Math.round(lerp(history.w, STORED_HIST.w, grow) / 2) + 'px';
  card.style.height = 2 * Math.round(lerp(history.h, STORED_HIST.h, grow) / 2) + 'px';
  const dx = closeDx(close);
  const x = Math.round(lerp(history.x, STORED_HIST.x, grow)) + dx;
  place(card, x, Math.round(lerp(history.y, STORED_HIST.y, grow)), 1, o);
  card.empty.style.opacity = 1 - clamp(grow * 3);
  card.rows.forEach((row, i) => showRow(row, rows[i], 26, true));
  card.tags.forEach((tag, i) => {
    setStatus(tag, 'SAVED', 'saved');
    tag.style.opacity = saved[i];
  });
  place(card.chip, HIST_CHIP.x + dx, HIST_CHIP.y, HIST_CHIP.k, chip);
}
// The verdict tag on the payload chip (statusTag, 30 px high, so it centers on whole pixels; 13 px, so its longest
// label leaves the chip's corners clear); setChipVerdict() sets and centers it
function makeChipVerdict(root) {
  const e = statusTag(root, { font: 13, icon: 13 });
  e.style.height = '30px';
  return e;
}
// The opaque fill of each verdict kind: the tag straddles the chip's edge, which must not show through it
const VERDICT_FILL = { alarm: C.red, wait: 'var(--violet-solid)' };
// The verdict tag at HIST_CHIP.tagY: its label and kind ('alarm' or 'wait', see setVerdict), its scale and opacity,
// flip, its height as it flips over (1 flat on the chip, 0 edge on), and close, the chip's slide (closeDx)
function setChipVerdict(e, label, kind, { s = 1, o = 1, flip = 1, close = 0 } = {}) {
  setVerdict(e, label, kind);
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
    `<div style="height:30px;background:${WEB_UI.panel};border-bottom:1px solid ${C.line};display:flex;`
    + `align-items:center;gap:6px;padding-left:12px">${dot}${dot}${dot}<span class="ttl mono" style="margin-left:10px;`
    + `font-size:11px;letter-spacing:.14em;color:${C.slate}">TEMPORAL WEB UI</span></div>`
    + '<div style="padding:10px 16px 0">'
    + `<div class="line mono" style="font-size:13px;line-height:18px"><span style="color:${C.slate}">2</span>`
    + '&nbsp; Activity completed</div>'
    + WEBUI_FIELDS.map(field).join('') + '</div>',
    '', {
      width: WEBUI.w + 'px', height: WEBUI.h + 'px', background: WEB_UI.page, border: `1px solid ${C.line}`,
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
// its tile (the key and its labels) and, hanging from the tile's bottom edge down to the Worker panel's bottom edge,
// the gate that the payload card passes through; the tile's top in line with the Worker panel's. x: their center
// line; tile: its center y and size; gate: its top and bottom y and its width.
const CONVERTER = {
  x: (LANE.worker.x + LANE.worker.w / 2 + LANE.env.x + LANE.env.w) / 2,
  tile: { y: LANE.worker.y - LANE.worker.h / 2 + 45, w: 200, h: 90 },
};
CONVERTER.gate = { top: CONVERTER.tile.y + CONVERTER.tile.h / 2, bottom: LANE.worker.y + LANE.worker.h / 2, w: 2 };

// ---------- the fleet of Workers (chapters 5 to 8)
// The fleet layout, in stage px, sized for chapter 4's wide shot (WIDE_SHOT, 0.88), which frames stage x 5-1915 and
// y 100-930 as the content frame x 120-1800, y 150-880: the zones grow to y 150-880 (y, h; on screen y 193-836).
// env and temporal: the zones' left edge and width in chapter 5, YOUR ENVIRONMENT holding the Workers and TEMPORAL
// wide enough for a card; proxyEnv and proxyTemporal: from chapter 6, the environment wider, its right edge on the
// proxy box (PROXY), and TEMPORAL narrower, at the right end. The tiles (tile: their size, about the lane's Worker
// panel at 0.75) sit in a grid of two rows (rows: their center y) and up to four columns (cols: their center x):
// the Workers in the first three, the SDK client and the Web UI in the fourth (chapter 6 on). Between the rows runs
// the channel, on the wire's line, where each tile's connection has a track of its own, `track` px from the next
// (fleetLinkD). The environment's left edge leaves the Workers as much room on their left as chapter 5's right edge
// on their right; the zones' widths are even (lerpZone).
const FLEET = {
  y: 150, h: 730,
  env: { x: 17, w: 990 }, temporal: { x: 1240, w: 660 },
  proxyEnv: { x: 17, w: 1414 }, proxyTemporal: { x: 1680, w: 220 },
  tile: { w: 296, h: 262 },
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
  return roundedPath([[x, edgeY], [x, trackY], [x1, trackY]], 4);
}

// The official logo of each Workers' language (their sources and licenses are in the README of their folder), its
// size in a Worker tile, px, and named when the logo spells the language's name, which the tag then leaves out
const LANGUAGE_LOGOS = {
  Go: { url: assetUrl('assets/languages/go.svg'), w: 48, h: 18, named: true },
  Java: { url: assetUrl('assets/languages/java.svg'), w: 16, h: 22 },
  TypeScript: { url: assetUrl('assets/languages/typescript.svg'), w: 19, h: 19 },
};
// The four chips a Worker carries in chapter 5, top to bottom: icon and label
const WORKER_CHIPS = [['globe', 'Address'], ['badge', 'Certificate'], ['key', 'API key'], ['lock', 'Codec']];
// Inside a Worker tile, px from its top: the chips' slots (chipTop, chipH apart by chipGap), inset px from its sides;
// the two lines of chapter 6 take the first two slots. The last chip ends about as far above the tile's bottom as
// the gear sits under its top. At 0.88, the chips' labels render at 16.7 px, the lines at 18.5 px.
const WORKER_TILE = { chipTop: 96, chipH: 34, chipGap: 5, inset: 20 };
const workerSlotTop = i => WORKER_TILE.chipTop + i * (WORKER_TILE.chipH + WORKER_TILE.chipGap);
// A Worker tile of the fleet (FLEET.tile) for worker (WORKERS): the gear and WORKER, the language tag with its logo
// (tile.langTag), then its four chips (tile.chips, hidden) and two code lines in the first two slots (tile.lines,
// empty). The scenes show its parts; gearSpin() turns its gear (tile.gear).
function makeWorkerTile(root, worker) {
  addInkFilter();
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
    + `align-items:center;gap:8px;padding:0 12px;border:1px solid ${C.lineLight};border-radius:var(--rs)">`
    + `<img src="${logo.url}" alt="" width="${logo.w}" height="${logo.h}" style="display:block;`
    + `filter:url(#${INK_FILTER_ID})">${name}</div>`
    + WORKER_CHIPS.map(([icon, label], i) => `<div class="chip" style="${slot(i, 'display:flex;align-items:center;'
      + `gap:10px;padding-left:12px;border:1px solid ${C.lineLight};border-radius:var(--rs);background:${C.bg};`
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
// Where a tag about the Workers sits in the fleet layout, centered under them, between their bottom row and your
// environment's bottom edge (NO SECRETS, WORKERS UNCHANGED): its center and height
const UNDER_WORKERS = {
  x: (WORKERS[0].x + WORKERS[2].x) / 2, y: (FLEET.rows[1] + FLEET.tile.h / 2 + FLEET.y + FLEET.h) / 2, h: 32,
};
// The TLS tube that the proxy adds on the way out (chapters 6 and 7): from the box's right edge to 12 px inside
// TEMPORAL, on the wire's line, high enough to hold the card and its tags; its label above it
const PROXY_TUBE = { x0: PROXY_WIRE.x0, x1: PROXY_WIRE.x1 + 12, y: LANE.wire.y, h: 176 };
PROXY_TUBE.label = { x: (PROXY_TUBE.x0 + PROXY_TUBE.x1) / 2, y: PROXY_TUBE.y - PROXY_TUBE.h / 2 - 36 };
// The tube out of the proxy (PROXY_TUBE), over TEMPORAL's edge, and the proxy's connection to TEMPORAL (out, from
// makeFleet()), which runs inside it, lifted into an SVG layer of its own over the tube's opaque body. Build it after
// makeFleet(), before the proxy box, which stays over the connection's start.
function makeProxyTube(root, out) {
  const tube = makeTube(root, PROXY_TUBE);
  svgLayer(root).appendChild(out);
  return tube;
}
// The card that goes through the proxy in chapter 6, a lane-size card at scale k, with its Namespace tag under it and
// the API KEY under that (tagH: their height; nsW and keyW: their widths; gap: the clear space between the card and
// each tag, 14 px: 16.8 px on screen in chapter 6's shot, 33.6 px in the push into the proxy); h: its height on the
// stage; nsDy and keyDy: from its center to the Namespace tag's and to the API KEY's
const PROXY_CARD = { w: PAYLOAD_IN_WORKER.w, k: 0.45, tagH: 28, nsW: 156, keyW: 124, gap: 14 };
PROXY_CARD.h = payloadLayout(PROXY_CARD.w).h * PROXY_CARD.k;
PROXY_CARD.nsDy = PROXY_CARD.h / 2 + PROXY_CARD.gap + PROXY_CARD.tagH / 2;
PROXY_CARD.keyDy = PROXY_CARD.nsDy + PROXY_CARD.tagH + PROXY_CARD.gap;
// The payments Namespace inside TEMPORAL that the card goes into in chapter 6: its center and size; card: where the
// card rests in it, under its name, its padlock clear of the name; the API KEY ends about as far above the band's
// bottom edge as the tags are apart
const PROXY_BAND = { x: FLEET.proxyTemporal.x + FLEET.proxyTemporal.w / 2, y: LANE.wire.y, w: 180, h: 280 };
PROXY_BAND.card = { x: PROXY_BAND.x, y: PROXY_BAND.y - PROXY_BAND.h / 2 + 78 + PROXY_CARD.h / 2 };
// The payments Namespace band (PROXY_BAND), labelled with its full name at its top left, 18 px from its left edge and
// 14 px under its top edge (offsets from its padding box, TILE_BORDER inside them)
const makeProxyBand = root => E(root,
  `<div style="position:absolute;left:${18 - TILE_BORDER}px;top:${14 - TILE_BORDER}px">`
  + `<div class="mono" style="font-size:12px;line-height:18px;letter-spacing:.14em;color:${C.slate}">NAMESPACE</div>`
  + `<div class="mono" style="font-size:18px;line-height:26px">${FULL_NS}</div></div>`,
  '', {
    width: PROXY_BAND.w + 'px', height: PROXY_BAND.h + 'px', border: `1px solid ${C.line}`, borderRadius: 'var(--r)',
  });
// A small tag beside the card (PROXY_CARD): a fixed width w, its HTML centered, in the violet look; 15 px (18 px on
// screen in chapter 6's shot), so the full Namespace name leaves room on both sides in its band
const proxyCardTag = (root, html, w) => E(root, html, 'mono', {
  width: w + 'px', height: PROXY_CARD.tagH + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: '6px', fontSize: '15px', letterSpacing: '.06em', whiteSpace: 'pre', border: `1px solid ${C.violet}`,
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

// ---------- the recap tiles (chapters 11 and 12)
// The benefits of the recap, [icon, label], one tile each in the use cases' row (USE_CASE_ROW); a <br> splits a label
// that would crowd its tile
const BENEFITS = [
  ['door', 'No inbound ports'], ['badge', 'Verified<br>clients'], ['key', 'Your keys only'],
  ['keyOff', 'No secrets<br>in Workers'],
];
// The label height of the recap and use-case tiles, in lines (padTileLabel): one label in a row may take two lines,
// and the tiles keep their icons aligned
const TILE_LABEL_LINES = 2;
// The padlock badge centered on a recap tile's top edge, as on the payload card: its diameter and the padlock's size,
// px, both even, so they center on whole pixels
const RECAP_BADGE = { size: 56, lock: 32 };
// How far the camera of chapters 11 and 12 moves the recap row down from USE_CASE_ROW, px: the badges rise half their
// size above the tiles, so the row comes down by half that, which centers badges and tiles together on y 515. Chapter
// 12 keeps it, so its use-case tiles flip in the recap tiles' slots.
const RECAP_DY = RECAP_BADGE.size / 4;
// A recap tile of USE_CASE_ROW's size and type scale for one of BENEFITS, with its padlock badge (.badge, .lock),
// open and unlit until setRecapTile() sets its state. Chapter 11 lands these tiles; chapter 12 opens on them, padlocks
// shut, and flips them over into the use cases.
function makeRecapTile(p, [icon, label]) {
  const { w, h } = USE_CASE_ROW;
  const { size, lock } = RECAP_BADGE;
  const tile = iconTile(p, icon, label, w, h, C.ink, USE_CASE_TYPE);
  padTileLabel(tile, TILE_LABEL_LINES);
  // the padlock badge (tile.badge, tile.lock), out of the flex flow, as absolutely positioned
  Object.assign(tile, makeLockBadge(tile, w, size, lock));
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
// with `lane` (the environment and the Worker, cropped at the left edge, dimmed), placeCorridor(corridor),
// placeTube(tube, TUBE), placeNamespaces(ns, 1, 1, [1, 1]).
const TUBE_HANDOFF = {
  from: [1153, 515, 1.4], to: HIST_SHOT,
  card: [TUBE.x1 - 38, TUBE.y], cardTo: [LANE.history.x, LANE.history.y],
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
// chip's READABLE verdict; the chip is in clear and red (setPayload red: 1); all rest just past the frame's right
// edge, so no sliver of them shows. The Web UI and the viewers are gone.
const REWIND_HANDOFF = {
  shot: [555, 506, 1.5],
  lane: { env: OFF_SHOT, temporal: OFF_SHOT, history: 0, door: 0, heads: 0 },
  stored: OFF_SHOT,
};
// The wide shot, [x, y, scale] for shot(): the whole lane, a little smaller than at rest, with room round it; the
// fleet layout (FLEET) fills it. Chapter 4 pulls back to it and chapters 5 and 6 open on it; chapter 7 pulls back to
// it, out of the proxy, and chapter 8 opens on it. Chapter 4 to 5: WIDE_LANE, the lane's opacities there (placeLane;
// the others are 1): the bare lane, the Worker running with no card, the wire, TEMPORAL with its logo only (the stored
// history, the Web UI and the Search Attributes have faded out). Chapter 7 to 8: the whole fleet with the proxy, every
// part at full opacity: the lane in the proxy layout (placeLane() with BARE_WORKERS_HANDOFF.lane and PROXY_ZONES), the
// six Workers with their two lines (WORKER_LINES), the SDK client and the Web UI, the eight connections and the
// proxy's connection to TEMPORAL (PROXY_WIRE) with their light (PROXY_FLOW_PERIOD), and the proxy box; TEMPORAL holds
// only its logo. Call frameLaneEdges() with the camera.
const WIDE_SHOT = [960, 515, 0.88];
const WIDE_LANE = { history: 0, door: 0 };
// Chapter 5 to 6: the six Workers, bare, that chapter 5 ends on once their chips have fallen, and chapter 6 opens on,
// in WIDE_SHOT, which chapter 5 holds throughout. lane: placeLane()'s options there (the others are 1): the fleet
// layout of chapter 5 (FLEET_ZONES), the lane's Worker panel, wire, history and door hidden. The six Worker tiles
// (makeWorkerTile at WORKERS, built after the lane) show their gear turning and their language tag, no chip and no
// code line. Nothing else shows. Call placeLane(), then frameLaneEdges() with the camera.
const BARE_WORKERS_HANDOFF = {
  lane: { envZone: FLEET_ZONES.env, temporalZone: FLEET_ZONES.temporal, worker: 0, wire: 0, history: 0, door: 0 },
};
// Chapter 6 to 7: the push into the TEMPORAL PROXY box that chapter 6 ends on and chapter 7 opens on, [x, y, scale]
// for shot(): the box fills the content frame's height (y 155-875). See chapter 6's header for what shows there.
const PROXY_SHOT = [PROXY.x, PROXY.y, 2.4];

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
