// ===================== Security with Temporal helpers (shared by the scenes of this theme)

// ---------- extra icons (stroke, 24 grid, same style as ICONS in engine.js); `shield`, `key`, `lock`, `server`,
// `cloud`, `kms`, `globe` and `badge` come from the engine set
Object.assign(ICONS, {
  // a closed door in its frame, with its handle: no inbound port
  door: '<path d="M3 21h18M6 21V3h12v18"/><path d="M14.5 11v2.5"/>',
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

// SVG path of a rounded rectangle (top left corner x, y; size w, h; corner radius r), clockwise from the middle of its
// top edge, for an outline that draws itself
const roundRectD = (x, y, w, h, r) => `M ${x + w / 2} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w} ${y + r}`
  + ` V ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + h - r}`
  + ` V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`;
// The slate EMPTY note of the lane's Event History, centered across the card, 140 px under its top: in the middle of
// the room under the heading
const historyEmptyNote = () => '<div class="empty mono" style="position:absolute;left:0;right:0;top:140px;'
  + `text-align:center;font-size:18px;letter-spacing:.14em;padding-left:.14em;color:${C.slateDark}">EMPTY</div>`;

// The lane's parts (LANE), in their stacking order: the two zones and an SVG layer with the environment's dashed edge
// (makeZones), the wire in that layer, an arrow to TEMPORAL (scenes draw their own strokes in it, under the panels),
// the Worker panel running the TransferWorkflow, the empty Event History card and the closed door. placeLane() shows
// them.
function makeLane(root) {
  const { env, temporal, worker, history, wire } = LANE;
  const lane = makeZones(root, {
    env, temporal, edgeY: wire.y, captions: { env: 'Your code runs here', temporal: 'Your code never runs here' },
  });
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
  // close (0 to 1): TEMPORAL widens to the close layout of chapters 3 and 4 (CLOSE.zone); even widths, so the zone
  // rests on whole pixels
  const temporalZone = o.temporalZone ?? LANE.temporal;
  const zone = {
    ...temporalZone,
    x: Math.round(lerp(temporalZone.x, CLOSE.zone.x, close)),
    w: 2 * Math.round(lerp(temporalZone.w, CLOSE.zone.w, close) / 2),
  };
  placeZones(lane, { envZone: o.envZone ?? LANE.env, temporalZone: zone, env, temporal, heads });
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
  tile: { w: WORKER_TILE.w, h: WORKER_TILE.h },
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

// ---------- Temporal Proxy (chapters 6 to 8)
// The TEMPORAL PROXY box (makeProxy): centered on the right edge of the widened environment (PROXY_ZONES.env), on the
// wire's line; its size and head as PROXY_BOX's
const PROXY = { x: FLEET.proxyEnv.x + FLEET.proxyEnv.w, y: LANE.wire.y, ...PROXY_BOX };
// Where the apps' connections end on the box's left, 4 px short of its edge, so their round caps stay off its border
PROXY.linkEnd = PROXY.x - PROXY.w / 2 - 4;
// The proxy's connection to TEMPORAL, from the box's right edge to TEMPORAL's left edge in the fleet layout
const PROXY_WIRE = { x0: PROXY.x + PROXY.w / 2, x1: FLEET.proxyTemporal.x, y: LANE.wire.y };
// The proxy box at PROXY moved by dx, with opacity o and a violet glow of strength glow (0 to 1)
function placeProxy(box, { dx = 0, o = 1, glow = 0 } = {}) {
  place(box, PROXY.x + dx, PROXY.y, 1, o);
  setProxyGlow(box, glow);
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
