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
    const html = scrambledHtml(row.i, TRANSFER[row.i][1], s, fromRight);
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
// ENVIRONMENT (env) with the Worker panel in it, the wire from x0 to x1, TEMPORAL with the Event History and the Web
// UI, the TEMPORAL PROXY box at the environment's right edge (from chapter 6) and the closed door on that edge. The
// two zones give their top left corner and size, the other parts their center (and size). Every lane scene reads
// them: adjust them here, never in a scene.
const LANE = {
  env: { x: 120, y: 190, w: 640, h: 650 },
  worker: { x: 340, y: 515, w: 380, h: 392 },
  wire: { x0: 760, x1: 1160, y: 515 },
  temporal: { x: 1160, y: 190, w: 640, h: 650 },
  history: { x: 1560, y: 515, w: 392, h: 260 },
  ui: { x: 1480, y: 760 },
  proxy: { x: 700, y: 515 },
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
// A zone's caption, centered 24 px above its bottom edge; hidden until a scene sets its opacity (zone.cap)
const zoneCaption = text => '<div class="cap lbl" style="position:absolute;left:0;right:0;bottom:24px;'
  + `text-align:center;font-size:18px;color:var(--ink);opacity:0">${text}</div>`;

// The slate EMPTY note of the lane's Event History, centered across the card, 150 px under its top
const historyEmptyNote = () => '<div class="empty mono" style="position:absolute;left:0;right:0;top:150px;'
  + `text-align:center;font-size:18px;letter-spacing:.14em;padding-left:.14em;color:${C.slateDark}">EMPTY</div>`;

// The lane's parts (LANE), in their stacking order: the two zones, an SVG layer (the environment's dashed edge and the
// wire, an arrow to TEMPORAL; scenes draw their own strokes in it, under the panels), the Worker panel running the
// TransferWorkflow, the empty Event History card and the closed door. placeLane() shows them.
function makeLane(root) {
  const { env, temporal, worker, history, wire } = LANE;
  const lane = {};
  lane.env = E(root,
    '<div class="head lbl" style="position:absolute;left:24px;top:20px;padding-left:0;font-size:18px">'
    + 'Your environment</div>' + zoneCaption('Your code runs here'),
    '', {
      width: env.w + 'px', height: env.h + 'px', background: 'rgba(148,163,184,.04)', borderRadius: 'var(--r)',
    });
  lane.env.head = lane.env.querySelector('.head');
  lane.env.cap = lane.env.querySelector('.cap');
  // clipped, for the light sweep of the Namespaces (makeNamespaces)
  lane.temporal = E(root,
    `<img class="head" src="${LOGO}" style="position:absolute;left:24px;top:20px;height:34px;display:block">`
    + zoneCaption('Never your code'),
    'tile', {
      width: temporal.w + 'px', height: temporal.h + 'px', borderColor: C.uv, background: '#17182A',
      overflow: 'hidden',
    });
  lane.temporal.head = lane.temporal.querySelector('.head');
  lane.temporal.cap = lane.temporal.querySelector('.cap');

  lane.svg = svgLayer(root);
  // the environment's dashed edge, in two halves from the wire's exit on its right edge round to its left edge
  const right = env.x + env.w, bottom = env.y + env.h, r = 10;
  lane.envEdges = [
    `M ${right} ${wire.y} V ${env.y + r} A ${r} ${r} 0 0 0 ${right - r} ${env.y} H ${env.x + r}`
      + ` A ${r} ${r} 0 0 0 ${env.x} ${env.y + r} V ${wire.y}`,
    `M ${right} ${wire.y} V ${bottom - r} A ${r} ${r} 0 0 1 ${right - r} ${bottom} H ${env.x + r}`
      + ` A ${r} ${r} 0 0 1 ${env.x} ${bottom - r} V ${wire.y}`,
  ].map(d => path(lane.svg, d, C.slate, 2, false));
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
// pushes up under the chapter header. The Worker runs, its gear turning; the door is in its slate and white look.
// The zone captions (env.cap, temporal.cap) keep the opacity a scene gives them.
function placeLane(lane, o = {}) {
  const { env = 1, temporal = 1, worker = 1, history = 1, wire = 1, door = 1, heads = 1 } = o;
  lane.env.head.style.opacity = heads;
  lane.temporal.head.style.opacity = heads;
  const center = zone => [zone.x + zone.w / 2, zone.y + zone.h / 2];
  place(lane.env, ...center(LANE.env), 1, env);
  lane.envEdges.forEach(edge => drawDashed(edge, 1, env));
  place(lane.temporal, ...center(LANE.temporal), 1, temporal);
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
// The tube: a glass pipe with neon walls, a neon ring at each mouth and a flow of light running along it toward
// Temporal; then its TLS label (tube.label). placeTube() shows them.
function makeTube(root) {
  const w = TUBE.x1 - TUBE.x0, h = TUBE.h;
  const mouth = side => `<div style="position:absolute;${side}:-12px;top:-2px;width:24px;height:${h}px;`
    + `border:2px solid ${C.neon};border-radius:50%"></div>`;
  const tube = E(root,
    '<div class="flow" style="position:absolute;inset:0;background-image:repeating-linear-gradient(90deg,'
    + `rgba(${RGB.neon},0) 0 40px,rgba(${RGB.neon},.16) 40px 42px)"></div>${mouth('left')}${mouth('right')}`,
    '', {
      width: w + 'px', height: h + 'px', borderTop: `2px solid ${C.neon}`, borderBottom: `2px solid ${C.neon}`,
      background: `linear-gradient(to bottom, rgba(${RGB.neon},.16), rgba(${RGB.neon},.03) 45%, `
        + `rgba(${RGB.neon},.08))`,
      boxShadow: `0 0 28px rgba(${RGB.neon},.22)`,
    });
  tube.flow = tube.querySelector('.flow');
  tube.label = fixedTag(root, `${ICON('lock', 18, C.neon, 2)}TLS`, 'neon solid', 112);
  Object.assign(tube.label.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' });
  return tube;
}
// The tube drawn from its Worker end up to drawn (0 to 1), with opacity o, and its label with opacity label. Its
// light flows on the ambient clock G, so it runs on across the cut into chapter 3.
function placeTube(tube, drawn, o = 1, label = 1) {
  place(tube, (TUBE.x0 + TUBE.x1) / 2, TUBE.y, 1, drawn > 0 ? o : 0);
  // the clip keeps the glow round the tube, and cuts it on the right while it draws
  tube.style.clipPath = drawn < 1 ? `inset(-40px ${((1 - drawn) * 100).toFixed(3)}% -40px -40px)` : 'none';
  tube.flow.style.backgroundPosition = `${((G * 90) % 42).toFixed(2)}px 0`;
  place(tube.label, TUBE.label.x, TUBE.label.y, 1, label * o);
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
// the right of the others; and the light sweep, inside TEMPORAL. placeNamespaces() shows them.
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
  const sweep = E(lane.temporal, '', '', {
    top: '-1.5px', width: NS_SWEEP_W + 'px', height: LANE.temporal.h + 'px',
    background: `linear-gradient(90deg, rgba(${RGB.ink},0), rgba(${RGB.ink},.28), rgba(${RGB.ink},0))`,
  });
  return { bands, sweep };
}
// Center of the padlock on the band of Namespace i (one of the others)
const nsLockAt = i => [NS_BAND.x + NS_BAND.w / 2 - 39, NAMESPACES[i].y];
// split (0 to 1): the light sweeps across TEMPORAL from left to right and reveals the bands as it passes; lit (0 to
// 1): payments turns violet and glows while the others dim; seals: one seal per other Namespace, top to bottom (see
// setLock; its padlock shows once its seal starts); o: the opacity of every band.
function placeNamespaces(ns, split, lit = 0, seals = [0, 0], o = 1) {
  const sweepX = lerp(-NS_SWEEP_W / 2, LANE.temporal.w + NS_SWEEP_W / 2, split); // from TEMPORAL's left edge
  ns.sweep.style.transform = `translateX(${(sweepX - NS_SWEEP_W / 2).toFixed(2)}px)`;
  ns.sweep.style.opacity = split > 0 && split < 1 ? 1 : 0;
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

// ---------- the Event History that stores the payload (chapters 3 and 4)
// The Event History once it stores the payload, at camera rest: it grows from the lane's history (LANE.history) to
// this center and size, inside TEMPORAL, with room under it for the Search Attributes of chapter 4
const HIST = { x: 1480, y: 486, w: 560, h: 452 };
// Its rows; row 2 holds the payload. HIST_ROW: each row's top in the card, the row height and the text size.
const HIST_ROWS = [
  'Workflow started: transfer', 'Activity completed: debitAccount', 'Activity scheduled: creditAccount',
];
const HIST_ROW = { tops: [60, 100, 404], h: 32, font: 18 };
// The payload chip of row 2: the payload card itself, at the lane's size (PAYLOAD_IN_WORKER.w), left-aligned with the
// rows' text and 148 px under the card's top. Its center (x, y) and size (w, h), and tagY, the center of its verdict
// tag (READABLE, then NEVER SEES YOUR PAYLOADS), which straddles its bottom edge.
const HIST_CHIP = { w: PAYLOAD_IN_WORKER.w, h: payloadLayout(PAYLOAD_IN_WORKER.w).h };
HIST_CHIP.x = HIST.x - HIST.w / 2 + 70 + HIST_CHIP.w / 2;
HIST_CHIP.y = HIST.y - HIST.h / 2 + 148 + HIST_CHIP.h / 2;
HIST_CHIP.tagY = HIST_CHIP.y + HIST_CHIP.h / 2;
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
  card.chip = makePayload(root, { w: HIST_CHIP.w });
  return card;
}
// grow (0 to 1): the card grows from the lane's history, EMPTY, to HIST, as EMPTY fades; o: the opacity of the card
// and its chip; rows: the progress of each row as it slides in (showRow); saved: the opacity of each row's SAVED tag;
// chip: the opacity of the chip, which rests at HIST_CHIP.
function placeStoredHistory(card, { grow = 1, o = 1, rows = [1, 1, 1], saved = [1, 1, 1], chip = 1 } = {}) {
  const { history } = LANE;
  // even sizes, so the card rests on whole pixels
  card.style.width = 2 * Math.round(lerp(history.w, HIST.w, grow) / 2) + 'px';
  card.style.height = 2 * Math.round(lerp(history.h, HIST.h, grow) / 2) + 'px';
  place(card, Math.round(lerp(history.x, HIST.x, grow)), Math.round(lerp(history.y, HIST.y, grow)), 1, o);
  card.empty.style.opacity = 1 - clamp(grow * 3);
  card.rows.forEach((row, i) => showRow(row, rows[i], 26, true));
  card.tags.forEach((tag, i) => {
    setStatus(tag, 'SAVED', 'saved');
    tag.style.opacity = saved[i];
  });
  place(card.chip, HIST_CHIP.x, HIST_CHIP.y, 1, chip * o);
}
// The verdict tag on the payload chip (statusTag, 30 px high, so it centers on whole pixels); setChipVerdict() sets it
function makeChipVerdict(root) {
  const e = statusTag(root, { font: 15, icon: 15 });
  e.style.height = '30px';
  return e;
}
// The opaque fill of each verdict kind: the tag straddles the chip's edge, which must not show through it
const VERDICT_FILL = { denied: 'var(--red-solid)', wait: 'var(--violet-solid)' };
// The verdict tag at HIST_CHIP.tagY: its label and kind (setStatus; 'denied' or 'wait'), its scale and opacity, and
// flip, its height as it flips over (1 flat on the chip, 0 edge on)
function setChipVerdict(e, label, kind, { s = 1, o = 1, flip = 1 } = {}) {
  setStatus(e, label, kind);
  e.style.background = VERDICT_FILL[kind];
  place(e, HIST_CHIP.x, HIST_CHIP.tagY, s, o);
  if (flip < 1) e.style.transform += ` scaleY(${flip.toFixed(3)})`;
}

// ---------- the Web UI (chapters 3 and 4)
// The Web UI window, at camera rest: between the zones, above the wire (chapter 4 moves it into your environment)
const WEBUI = { x: 960, y: 330, w: 360, h: 190 };
// The fields of the payload that the Web UI shows: their rows in TRANSFER (the IBAN it comes from, and the name)
const WEBUI_FIELDS = [0, 2];
// The Web UI window, in the dark look of the Temporal Web UI: a title bar (win.caption, its text), then row 2 of the
// Event History and the payload's IBAN and name, keys above values. win.lines: the row and the two fields, which
// slide in; setWebUI() sets the values.
function makeWebUI(root) {
  const dot = '<i style="display:block;width:9px;height:9px;border-radius:50%;background:#4B5363"></i>';
  const field = (row, i) => `<div class="line" style="margin-top:${i ? 8 : 12}px">`
    + `<div class="mono" style="font-size:12px;line-height:16px;color:${C.slate}">${TRANSFER[row][0]}</div>`
    + '<div class="mono value" style="font-size:15px;line-height:22px;white-space:pre;margin:0 -8px;padding:0 8px;'
    + 'border-radius:4px"></div></div>';
  const win = E(root,
    `<div style="height:36px;background:#191919;border-bottom:1px solid ${C.line};display:flex;align-items:center;`
    + `gap:7px;padding-left:14px">${dot}${dot}${dot}<span class="ttl mono" style="margin-left:12px;font-size:12px;`
    + `letter-spacing:.14em;color:${C.slate}">TEMPORAL WEB UI</span></div>`
    + '<div style="padding:12px 20px 0">'
    + `<div class="line mono" style="font-size:14px;line-height:20px"><span style="color:${C.slate}">2</span>`
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
    const html = scrambledHtml(row, TRANSFER[row][1], scramble);
    if (value._html !== html) {
      value.innerHTML = html;
      value._html = html;
    }
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
// the card at its tube scale (TUBE.k) crossing into payments (card); the whip then eases the camera to the history
// (to) and the card to it (cardTo) over d seconds. Chapter 2 plays its first `cut` seconds and ends there (fadeOut:
// 0); chapter 3 opens there (fadeIn: 0) and plays the rest: read both sides from tubeWhip(). At the cut: placeLane()
// with `lane` (the environment and the Worker, cropped at the left edge, dimmed), placeTube(tube, 1),
// placeNamespaces(ns, 1, 1, [1, 1]).
const TUBE_HANDOFF = {
  from: [1164, 515, 1.1], to: [LANE.history.x, LANE.history.y, 1.6],
  card: [TUBE.x1 - 62, TUBE.y], cardTo: [LANE.history.x, LANE.history.y],
  d: 0.7, cut: 0.25,
  lane: { env: OFF_SHOT, worker: OFF_SHOT, wire: 0, door: 0 },
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
// the stored Event History (placeStoredHistory, every row and SAVED tag shown) and of its chip, in clear and red
// (setPayload red: 1), with its READABLE verdict, all cropped at the frame's right edge.
const REWIND_HANDOFF = {
  shot: [575, 506, 1.5],
  lane: { env: OFF_SHOT, temporal: OFF_SHOT, history: 0, door: 0, heads: 0 },
  stored: OFF_SHOT,
};
// Chapter 4 to 5: the pull-back that chapter 4 ends on and chapter 5 opens on, [x, y, scale] for shot(): the whole
// lane, a little smaller than at rest, with room round it. WIDE_LANE: the lane's opacities there (placeLane; the
// others are 1): the bare lane, the Worker running with no card, the wire, TEMPORAL with no history.
const WIDE_SHOT = [960, 515, 0.88];
const WIDE_LANE = { history: 0, door: 0 };

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
