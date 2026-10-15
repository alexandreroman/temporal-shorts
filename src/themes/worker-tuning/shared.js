// ===================== Tuning Temporal Workers helpers (shared by the scenes of this theme)

// ---------- extra icons (stroke, 24 grid, same style as ICONS in engine.js)
Object.assign(ICONS, {
  // a page with a folded corner and text lines: the PDF invoice that renderInvoice draws
  invoice: '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4M8.5 11h7M8.5 14.5h7M8.5 18h4"/>',
});

// ---------- statusTag kinds of the bottleneck markers (see placeMark): solid, as they stand on an outline
Object.assign(STATUS_KINDS, {
  bottleneck: { background: 'var(--red-solid)', color: C.red, borderColor: C.red },
  fixed: { background: 'var(--neon-solid)', color: C.neon, borderColor: C.neon, icon: ['check', C.neon, 2.6] },
});

// ---------- the running example: the shop of durable-execution on Black Friday. Each order is a Workflow of five
// Activities; renderInvoice draws a PDF and is the CPU-heavy one.
const ORDER_ACTIVITIES = [
  { fn: 'chargeCard', icon: 'card' },
  { fn: 'reserveItem', icon: 'box' },
  { fn: 'renderInvoice', icon: 'invoice' },
  { fn: 'shipPackage', icon: 'truck' },
  { fn: 'emailReceipt', icon: 'mail' },
];
// Icon of Activity Task k of a lane: the five steps of an order, in turn
const activityIcon = k => ORDER_ACTIVITIES[k % ORDER_ACTIVITIES.length].icon;
// A count with thousands separators, the same whatever the locale: 2400 -> '2,400'
const withCommas = n => Math.round(n).toLocaleString('en-US');
// A SCHEDULE-TO-START value in seconds: one decimal below 10 s ('9.4 s', '44 s')
const formatWait = v => (v < 10 ? v.toFixed(1) : String(Math.round(v))) + ' s';
// Shows a label positioned by its top left corner (whole pixels, so its text always rasters the same way)
function showAt(e, left, top, o) {
  e.style.left = left + 'px';
  e.style.top = top + 'px';
  e.style.opacity = clamp(o);
  e.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
}

// ---------- the Worker diagram: the shared stage of chapters 1 to 6
// Final stage coordinates (the chapters have no shift), every size even, so resting parts sit on whole pixels.
// - Top band, y 150..576: the TEMPORAL panel (x 120..700) holds the "orders" Task Queue as two lanes, Workflow
//   Tasks (middle y 280) and Activity Tasks (y 452); the WORKER panel (x 860..1800) takes them: Pollers at x 954,
//   level with each lane, then the Workflow Slots and the WORKFLOW CACHE on the Workflow row, the Activity Slot grid
//   (10 per row, up to 5 rows centered on y 452) on the Activity row. The labels of the Workflow row sit on y 224 in
//   both panels; ACTIVITY SLOTS sits above the grid's top row (y 320 for 5 rows).
// - Bottom band, y 616..880, two columns under the panels: BACKLOG and SCHEDULE-TO-START readouts, then up to two
//   metric lines, under TEMPORAL (x 120..700); CPU and MEMORY meters (x 860..1100) and the Worker.create() code card
//   (x 1140..1800) under the WORKER.
const DIAGRAM = {
  temporal: { left: 120, top: 150, w: 580, h: 426 },
  worker: { left: 860, top: 150, w: 940, h: 426 },
  // middles of the Workflow and Activity lanes and of the Worker rows they feed; midY: the single lane of chapter 1,
  // before the Task Queue splits into two
  wfY: 280, actY: 452, midY: 366,
  // top of the labels on the Workflow row (both panels); ACTIVITY SLOTS sits labelGap px above the Slot grid
  labelTop: 224, labelGap: 31,
  // lane track: x 144..676, 52 px high; queued chips every `pitch` px from the head (28 px inside its right end),
  // at most `cap` of them, then a "+N" count at its left end
  lane: { left: 144, w: 532, h: 52, pitch: 48, cap: 9, headInset: 28 },
  chip: { act: 40, wf: 28 },
  // Pollers: 22 px circles at x 954, `pitch` px apart, centered on their lane; the room on either side of the column
  // holds its BOTTLENECK tag clear of the panel edge and of ACTIVITY SLOTS
  poller: { x: 954, size: 22, pitch: 36, max: { wf: 2, act: 5 } },
  // Slots: w x h cells; Activity Slots in rows of `cols` from x 1036 (x 1036..1762 for 10), up to `max`
  slot: { left: 1036, w: 60, h: 34, pitchX: 74, pitchY: 42, cols: 10, max: 50 },
  wfSlots: 2,
  // WORKFLOW CACHE: a strip of order cells from x 1226, up to `max` (x 1226..1762)
  cache: { left: 1226, w: 60, h: 34, pitch: 68, max: 8 },
  // the readouts as high as the meters beside them; the two metric lines on the MEMORY meter's top and bottom lines
  readout: { top: 616, w: 280, h: 124, left: { backlog: 120, wait: 420 } },
  metric: { left: 120, w: 580, h: 42, tops: [756, 838] },
  meter: { left: 860, w: 240, h: 124, top: { cpu: 616, mem: 756 } },
  // code card x 1140..1800, under its WORKER tab (y 616..650); 18 px code, so the longest line (54 characters) fits
  code: { left: 1140, top: 650, w: 660, font: 18, lineH: 30, padY: 16, padX: 16, gutter: 34 },
};
// Right end of the lanes, where the poll lines reach them
const LANE_EXIT_X = DIAGRAM.lane.left + DIAGRAM.lane.w;

// ---------- task chips and lanes
// Task chip: an Activity Task is a small tile carrying its step's icon (see setChipIcon), a Workflow Task a small UV
// square
function makeTaskChip(root, lane) {
  if (lane === 'wf') {
    const size = DIAGRAM.chip.wf + 'px';
    return E(root, '', '', { width: size, height: size, background: C.uv, borderRadius: '5px' });
  }
  const size = DIAGRAM.chip.act + 'px';
  return E(root, '', '', {
    width: size, height: size, background: 'var(--surface)', border: '1.5px solid ' + C.lineLight,
    borderRadius: 'var(--rs)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  });
}
// The icon of an Activity Task chip; the DOM is only rewritten when it changes
function setChipIcon(chip, icon) {
  if (chip._icon === icon) return;
  chip.innerHTML = ICON(icon, 22, C.ink, 1.8);
  chip._icon = icon;
}
// Lane of a Task Queue: a track, an optional label above it, up to `cap` queued chips and a "+N" count of the tasks
// beyond them. lane: 'wf' or 'act', the kind of chips; w: the track width.
function makeLane(root, label, lane, { w = DIAGRAM.lane.w, cap = DIAGRAM.lane.cap } = {}) {
  return {
    lane, w, cap,
    track: E(root, '', '', {
      width: w + 'px', height: DIAGRAM.lane.h + 'px', background: `rgba(${RGB.ink},.03)`,
      border: '1.5px solid ' + C.line, borderRadius: 'var(--rs)',
    }),
    label: label ? E(root, label, 'lbl', { fontSize: '16px' }) : null,
    more: E(root, '', 'mono', { fontSize: '16px', lineHeight: '20px', color: C.slate, whiteSpace: 'nowrap' }),
    chips: Array.from({ length: cap }, () => makeTaskChip(root, lane)),
  };
}
// x of the head of a lane whose track starts at x: the queued chip next out
const laneHeadX = (lane, x) => x + lane.w - DIAGRAM.lane.headInset;
// Places a lane, its track's left end at x and its middle at y, with opacity o (labelO: its label's). Options:
// - queue: the tasks waiting; a fractional part is the tail task arriving, sliding in from the left
// - departed: how many tasks have left the head so far: queued chip p is task departed + p, which picks its icon
//   (iconOf(k), Activity lanes only)
// - shift: 0 to 1, how far the queue has moved up since the last departure (1 at rest); past the cap, the tail
//   chip fades in at its place as the queue moves, coming from the overflow
function placeLane(lane, x, y, o, { queue = 0, departed = 0, shift = 1, iconOf = activityIcon, labelO = 1 } = {}) {
  const { pitch, h } = DIAGRAM.lane;
  place(lane.track, x + lane.w / 2, y, 1, o);
  if (lane.label) showAt(lane.label, x, y - h / 2 - 30, o * labelO);
  const shown = Math.min(queue, lane.cap);
  const overflow = queue > lane.cap;
  const headX = laneHeadX(lane, x);
  lane.chips.forEach((chip, p) => {
    const a = clamp(shown - p);
    const fromOverflow = overflow && p === lane.cap - 1;
    // queued chips sit one pitch further out until the queue has moved up; an arriving tail slides in from the left
    const cx = headX - p * pitch - (fromOverflow ? 0 : (1 - shift) * pitch) - (1 - a) * pitch;
    if (lane.lane === 'act') setChipIcon(chip, iconOf(departed + p));
    place(chip, cx, y, 1, a * (fromOverflow ? shift : 1) * o);
  });
  const extra = Math.floor(queue) - lane.cap;
  lane.more.textContent = extra > 0 ? '+' + withCommas(extra) : '';
  showAt(lane.more, x + 14, y - 10, extra > 0 ? o : 0);
}

// ---------- Slots
// Looks of a Slot: free (outline), busy (violet fill, the icon of its task), wfBusy (a busy Workflow Slot, UV like
// the Workflow Tasks) and replay (dashed, a retry icon: a Workflow replaying its history)
const SLOT_LOOKS = {
  free: { background: `rgba(${RGB.ink},.03)`, borderColor: C.line, borderStyle: 'solid' },
  busy: { background: `rgba(${RGB.violet},.3)`, borderColor: C.violet, borderStyle: 'solid' },
  wfBusy: { background: `rgba(${RGB.uv},.45)`, borderColor: C.uv, borderStyle: 'solid' },
  replay: { background: `rgba(${RGB.violet},.08)`, borderColor: C.violet, borderStyle: 'dashed' },
};
// Slot cell of w x h px (parent: the stage root, or a mini Worker panel)
function makeSlot(parent, w, h, css = {}) {
  return E(parent, '', '', {
    width: w + 'px', height: h + 'px', border: '1.5px solid', borderRadius: '5px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', ...css,
  });
}
// look: a key of SLOT_LOOKS; icon: the task's icon on a busy Slot (null for none). The DOM is only rewritten when
// they change.
function setSlot(cell, look, icon = null) {
  const key = look + ':' + icon;
  if (cell._key === key) return;
  cell._key = key;
  Object.assign(cell.style, SLOT_LOOKS[look]);
  if (look === 'replay') cell.innerHTML = ICON('retry', 18, C.violet, 2);
  else cell.innerHTML = look === 'busy' && icon ? ICON(icon, 18, C.ink, 1.8) : '';
}
// The order in which Activity Slots fill (`busy` in the state of placeWorkerDiagram), scattered over the grid: the
// first row first (so 10 busy Slots stay the same 10 when the grid grows), then the other rows
const SLOT_ORDER = [
  ...Array.from({ length: 10 }, (_, j) => (j * 3) % 10),
  ...Array.from({ length: 40 }, (_, j) => 10 + (j * 17) % 40),
];
// The Slots of a grid of n that stay free with `busy` of them busy, in filling order: targets for a flow
const freeSlots = (n, busy) => SLOT_ORDER.filter(i => i < n).slice(busy);
// Icon of steadily busy Activity Slot i (the default `icon` of the slots state): a flow that lands its task with this
// icon (its `icon` option) leaves the Slot looking the same once a chapter counts it as steadily busy
const steadySlotIcon = i => activityIcon(i * 2 + Math.floor(i / 10));
const slotRows = n => Math.ceil(n / DIAGRAM.slot.cols);
// Middle of Activity Slot i in a grid of `rows` rows, the rows centered on the Activity lane
function slotCenter(i, rows) {
  const { left, w, pitchX, pitchY, cols } = DIAGRAM.slot;
  const row = Math.floor(i / cols);
  return [left + w / 2 + (i % cols) * pitchX, DIAGRAM.actY + (row - (rows - 1) / 2) * pitchY];
}
// Middle of Workflow Slot i
const wfSlotCenter = i => [DIAGRAM.slot.left + DIAGRAM.slot.w / 2 + i * DIAGRAM.slot.pitchX, DIAGRAM.wfY];
// Middle of Poller i of n on a lane whose middle is laneY
const pollerY = (laneY, i, n) => laneY + (i - (n - 1) / 2) * DIAGRAM.poller.pitch;

// ---------- task flows: chips from a lane through a Poller into a Slot
// A flow is a stream of tasks, a pure function of time: { lane, from, every, count, hold, slots, icon }. Task k
// (0 to count - 1) leaves the head of its lane ('wf' or 'act') at from + k * every, passes a Poller FLIGHT.leg s
// later and lands in Slot slots[k % slots.length] FLIGHT.land s after leaving; it holds that Slot `hold` seconds
// (default: for good). icon(k): the icon of an Activity Task (default: the lane's icons, see taskIcon).
const FLIGHT = { leg: 0.35, land: 0.7 };
const flowLeave = (flow, k) => flow.from + k * flow.every;
// When task k of a flow lands in its Slot: key a cache hit or a meter to it
const flowLandAt = (flow, k) => flowLeave(flow, k) + FLIGHT.land;
// Number of tasks of a flow that have left their lane by t (the epsilon keeps a task leaving exactly at t)
function flowDeparted(flow, t) {
  if (t < flow.from) return 0;
  return Math.min(flow.count, Math.floor((t - flow.from) / flow.every + 1e-9) + 1);
}
// Number of tasks of a flow that have landed in their Slot by t: key the meters to it
const flowLanded = (flow, t) => flowDeparted(flow, t - FLIGHT.land);
// Number of tasks of a flow that hold their Slot at t: landed, and not yet past their `hold`
const flowHolding = (flow, t) => flowLanded(flow, t) - (flow.hold === undefined ? 0 : flowLanded(flow, t - flow.hold));
// Where a chip is u seconds after leaving the head: on its way to the Poller, then to the Slot (each leg eased)
function flightPoint(u, head, poller, slot) {
  if (u < FLIGHT.leg) {
    const p = ease(u / FLIGHT.leg);
    return [lerp(head[0], poller[0], p), lerp(head[1], poller[1], p)];
  }
  const p = ease((u - FLIGHT.leg) / (FLIGHT.land - FLIGHT.leg));
  return [lerp(poller[0], slot[0], p), lerp(poller[1], slot[1], p)];
}

// ---------- readouts, meters, metric lines
// Readout tile, w x h: a label over a large value (see setReadout)
function makeReadout(p, label, w, h) {
  const e = E(p,
    `<div class="lbl" style="position:absolute;left:22px;top:20px;font-size:16px">${label}</div>`
    + '<div class="v" style="position:absolute;left:24px;bottom:20px;font-size:60px;line-height:60px;'
    + 'letter-spacing:-1px;white-space:nowrap;transform-origin:left center"></div>',
    'tile', { width: w + 'px', height: h + 'px', textAlign: 'left' });
  e.v = e.querySelector('.v');
  return e;
}
// text: the value; color: its color; s: its scale (a swell when it changes)
function setReadout(e, text, color = C.ink, s = 1) {
  e.v.textContent = text;
  e.v.style.color = color;
  e.v.style.transform = `scale(${s})`;
}
// Color of a readout that trends: red while it grows (trouble), neon once it falls (relief), ink otherwise
const TREND_COLORS = { up: C.red, down: C.neon };
const trendColor = trend => TREND_COLORS[trend] || C.ink;
// Meter tile, w x h: a label and a value on top, a bar gauge under them (see setMeter)
function makeMeter(p, label, w, h) {
  const barW = w - 48;
  const e = E(p,
    `<div class="lbl" style="position:absolute;left:22px;top:20px;font-size:16px">${label}</div>`
    + '<div class="v mono" style="position:absolute;right:24px;top:16px;font-size:24px;line-height:30px;'
    + 'transform-origin:right center"></div>'
    + `<div style="position:absolute;left:24px;bottom:24px;width:${barW}px;height:14px;border-radius:3px;`
    + `background:rgba(${RGB.ink},.08);overflow:hidden"><div class="fill" style="height:100%;width:0"></div></div>`,
    'tile', { width: w + 'px', height: h + 'px', textAlign: 'left' });
  e.v = e.querySelector('.v');
  e.fill = e.querySelector('.fill');
  e.barW = barW;
  return e;
}
// fill: 0 to 1; text: the value; red: saturated (red bar and value); s: the value's scale (a swell)
function setMeter(e, fill, text, red = false, s = 1) {
  e.fill.style.width = Math.round(clamp(fill) * e.barW) + 'px';
  e.fill.style.background = red ? C.red : `linear-gradient(90deg,${C.uv},${C.violet})`;
  e.v.textContent = text;
  e.v.style.color = red ? C.red : C.ink;
  e.v.style.transform = `scale(${s})`;
  e.style.borderColor = red ? C.red : C.line;
}
// Metric line, w x h: an SDK metric's name in slate, its value on the right (see setMetricLine)
function makeMetricLine(p, w, h) {
  const e = E(p,
    '<span class="n"></span><span class="v"></span>',
    'tile mono', {
      width: w + 'px', height: h + 'px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 18px', fontSize: '17px', whiteSpace: 'nowrap',
    });
  e.n = e.querySelector('.n');
  e.v = e.querySelector('.v');
  e.n.style.color = C.slate;
  return e;
}
function setMetricLine(e, name, value, color = C.ink) {
  e.n.textContent = name;
  e.v.textContent = value;
  e.v.style.color = color;
}

// ---------- the Worker.create() code card
// Its lines, in order: `value` marks the number a chapter swaps, `inserted` a line that only shows once a chapter
// inserts it (see the code state of placeWorkerDiagram). The normal-days settings, the Slot limit and the cache size,
// show whenever the card does; chapter 4 inserts the Poller line between them.
const WORKER_CODE = [
  { key: 'open', src: 'const worker = await Worker.create({' },
  { key: 'queue', src: "  taskQueue: 'orders'," },
  { key: 'slots', src: '  maxConcurrentActivityTaskExecutions: 10,', value: '10' },
  { key: 'poller', src: "  activityTaskPollerBehavior: { type: 'autoscaling' },", inserted: true },
  { key: 'cache', src: '  maxCachedWorkflows: 500,', value: '500' },
  { key: 'close', src: '});' },
];
// Wraps the first `value` of a code line in its own span, so it can be swapped and swell: the value is plain text
// between highlightJs spans
function wrapValue(line, value) {
  const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const at = node.data.indexOf(value);
    if (at < 0) continue;
    const rest = node.splitText(at);
    rest.splitText(value.length);
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.textContent = value;
    rest.replaceWith(span);
    return span;
  }
  throw new Error(`No ${value} in the code line ${line.textContent}`);
}
// The code card, its WORKER tab and worker.ts file name shown, every line built (WORKER_CODE)
function makeWorkerCode(root) {
  const { w, font, lineH, padY, padX, gutter } = DIAGRAM.code;
  const card = makeCodeCard(root, {
    lines: WORKER_CODE.map(line => line.src), header: 'Worker', file: 'worker.ts', w, font, lineH, padY, padX, gutter,
  });
  card.hdr.style.opacity = 1;
  card.values = {};
  WORKER_CODE.forEach((line, i) => {
    if (line.value) card.values[line.key] = wrapValue(card.lines[i], line.value);
  });
  return card;
}

// ---------- bottleneck markers: a red outline round a part and a BOTTLENECK tag, which turn neon (FIXED)
function makeMark(root) {
  // the tag after the outline, so that it covers the outline where they cross
  const box = E(root, '', '', { border: '2px solid ' + C.red, borderRadius: 'var(--r)' });
  const tag = statusTag(root);
  tag.style.lineHeight = '21px'; // 21 + 8 + 3 = 32 px high, so a tag centered on a whole pixel rests on whole pixels
  return { box, tag };
}
// box: { left, top, w, h } of the outline; spot: where the tag sits, 'above' (centered over the outline),
// 'above-right' (over its right end) or 'astride' (centered on its top edge); m: { at, fixedAt, out }, when the
// marker shows (BOTTLENECK), turns FIXED and fades out (undefined: hidden); minLeft: the leftmost x of the tag, which
// keeps it clear of a label on its left
function placeMark(mark, t, box, spot, m, minLeft = -Infinity) {
  const on = m ? P(t, m.at, 0.3) * (1 - P(t, m.out ?? Infinity, 0.4)) : 0;
  const fixed = m && m.fixedAt !== undefined && t >= m.fixedAt;
  Object.assign(mark.box.style, { width: box.w + 'px', height: box.h + 'px' });
  mark.box.style.borderColor = fixed ? C.neon : C.red;
  mark.box.style.boxShadow = glowShadow(fixed ? RGB.neon : RGB.red, on, { blur: 18, alpha: 0.35 });
  place(mark.box, box.left + box.w / 2, box.top + box.h / 2, 1, on);
  if (!m) {
    mark.tag.style.opacity = 0;
    return;
  }
  setStatus(mark.tag, fixed ? 'FIXED' : 'BOTTLENECK', fixed ? 'fixed' : 'bottleneck');
  const w = parseFloat(mark.tag.style.width) || 0;
  const right = box.left + box.w;
  const left = Math.max(minLeft, spot === 'above-right' ? right - w : box.left + box.w / 2 - w / 2);
  const top = spot === 'astride' ? box.top - 16 : box.top - 38;
  mark.tag.style.left = left + 'px';
  mark.tag.style.top = top + 'px';
  mark.tag.style.opacity = on;
  mark.tag.style.transform = `scale(${swell(t, fixed ? m.fixedAt : m.at, 0.14)})`;
}

// ---------- building the diagram
// Header note of the TEMPORAL panel: the Task Queue's name, in code case
const QUEUE_NOTE = 'Task Queue <span style="text-transform:none;color:var(--ink)">orders</span>';
// Builds the whole Worker diagram, hidden until placeWorkerDiagram shows it; name: the Worker's. The parts are made
// in drawing order: panels, lanes and labels, Slots and cache, poll lines, Pollers, chips, then the bottom band and
// the bottleneck markers on top.
function makeWorkerDiagram(root, name = 'WORKER A') {
  const { temporal, worker, slot, cache, readout, metric, meter } = DIAGRAM;
  const dg = {};
  dg.temporal = makeTemporalPanel(root, temporal.w, temporal.h, { ...TEMPORAL_HEADER_LARGE, note: QUEUE_NOTE });
  dg.worker = makeAppPanel(root, name, worker.w, worker.h, APP_TEXT_LARGE);
  dg.lanes = { wf: makeLane(root, 'Workflow Tasks', 'wf'), act: makeLane(root, 'Activity Tasks', 'act') };
  const label = text => E(root, text, 'lbl', { fontSize: '16px' });
  // POLLERS is centered on the Poller column: a fixed even width, its text centered
  dg.labels = {
    pollers: E(root, 'Pollers', 'lbl', { fontSize: '16px', width: '96px', textAlign: 'center' }),
    wfSlots: label('Workflow Slots'), slots: label('Activity Slots'), cache: label('Workflow cache'),
  };
  dg.slots = Array.from({ length: slot.max }, () => makeSlot(root, slot.w, slot.h));
  dg.wfSlots = Array.from({ length: DIAGRAM.wfSlots }, () => makeSlot(root, slot.w, slot.h));
  // each cache cell has a ghost of the same size, the evicted order sliding out
  const cacheCell = () => makeSlot(root, cache.w, cache.h, { fontFamily: 'Mono', fontSize: '16px' });
  dg.cache = Array.from({ length: cache.max }, () => {
    const cell = cacheCell();
    cell.ghost = cacheCell();
    Object.assign(cell.ghost.style, { borderColor: C.red, color: C.red, background: `rgba(${RGB.red},.12)` });
    return cell;
  });
  // the poll lines run above the panels, from each Poller to the end of its lane; their `d` is set on each frame
  dg.svg = svgLayer(root);
  const pollLine = () => path(dg.svg, 'M 0 0 L 1 0', C.violet, 2, false, '5,7');
  const { max } = DIAGRAM.poller;
  dg.pollLines = { wf: Array.from({ length: max.wf }, pollLine), act: Array.from({ length: max.act }, pollLine) };
  const poller = () => E(root, '', '', {
    width: DIAGRAM.poller.size + 'px', height: DIAGRAM.poller.size + 'px', borderRadius: '50%',
    border: '2px solid ' + C.violet, background: 'var(--surface)',
  });
  dg.pollers = { wf: Array.from({ length: max.wf }, poller), act: Array.from({ length: max.act }, poller) };
  // chips in flight, reused in turn
  dg.flying = {
    wf: Array.from({ length: 6 }, () => makeTaskChip(root, 'wf')),
    act: Array.from({ length: 14 }, () => makeTaskChip(root, 'act')),
  };
  dg.backlog = makeReadout(root, 'Backlog', readout.w, readout.h);
  dg.wait = makeReadout(root, 'Schedule-to-start', readout.w, readout.h);
  dg.metrics = metric.tops.map(() => makeMetricLine(root, metric.w, metric.h));
  dg.cpu = makeMeter(root, 'CPU', meter.w, meter.h);
  dg.mem = makeMeter(root, 'Memory', meter.w, meter.h);
  dg.code = makeWorkerCode(root);
  dg.marks = { slots: makeMark(root), pollers: makeMark(root), cache: makeMark(root), cpu: makeMark(root) };
  return dg;
}

// ---------- placing the diagram
// Places the whole diagram at time t, from one state object; every field is optional, so a chapter sets only what
// it shows, phase by phase (its values may depend on t and on its cues c[i]):
// - show: { temporal, lanes, worker, pollers, wfSlots, slots, cache, backlog, wait, cpu, mem, code }, the opacity
//   of each part, 1 by default
// - split: 0 to 1, from one "orders" lane (chapter 1) to two lanes, Workflow Tasks above Activity Tasks (default 1)
// - queue: { wf, act }, the tasks waiting in each lane (see placeLane); taskIcon(k): the icon of Activity Task k of
//   its lane (default activityIcon)
// - flows: task flows from the lanes into the Slots (see FLIGHT), in order of their `from`
// - slots: { n, grow, busy, replay, icon }, the Activity Slots: n of them (default 10); grow { from, at }: the grid
//   grows from `from` Slots at `at` (its rows spread out, then the new Slots pop in); busy: how many are steadily
//   busy, in SLOT_ORDER, besides those the flows hold; replay: indices of the Slots replaying; icon(i): the icon of
//   a steadily busy Slot
// - wfSlots: { busy, replay }, the Workflow Slots (busy: how many, from the first)
// - pollers: { wf, act, grow, polling }: Pollers per lane (default 2 each, up to DIAGRAM.poller.max); grow { from,
//   at }: Activity Pollers from `from` on pop in at `at`; polling { wf, act }: whether a lane's poll lines pulse
//   (default: while the lane has a free Slot)
// - cache: { cells, grow, filledAt, hits, evictions }: cells (default 4, up to DIAGRAM.cache.max) holding orders
//   #1042, #1043...; grow { from, at }: the strip widens; filledAt [at, every]: cell i fills at at + i * every
//   (default: filled); hits [[cell, at]]: the cell flashes; evictions [{ cell, at, next }]: its order slides out in
//   red and order `next` takes its place
// - cpu: 0 to 100 (red from 90); mem: { use, label, swapAt }, the share used (red from 0.9), the size shown
//   ('2 GB') and when it last changed (a swell)
// - backlog: { n, trend }, the BACKLOG count (default: the lanes' queues added up) and its trend, 'up' (red) or
//   'down' (neon); wait: { text, trend }, the SCHEDULE-TO-START value ('38 s')
// - metrics: up to 2 metric lines [{ name, value, at, color }], each rising in at `at`
// - code: { swap, insert, light }: swap { slots: [value, at], cache: [value, at] } replaces a value (10, 500) at
//   `at`; insert { poller: at } opens the inserted Poller line; light [key, from, to] highlights a line ('slots',
//   'poller', 'cache')
// - status: [text, state], the WORKER panel's status (see setAppStatus; default ['RUNNING', 'running'])
// - marks: { slots, pollers, cache, cpu }, the bottleneck markers, each { at, fixedAt, out } (see placeMark)
function placeWorkerDiagram(dg, t, state = {}) {
  const show = key => state.show?.[key] ?? 1;
  const { temporal, worker } = DIAGRAM;
  place(dg.temporal, temporal.left + temporal.w / 2, temporal.top + temporal.h / 2, 1, show('temporal'));
  place(dg.worker, worker.left + worker.w / 2, worker.top + worker.h / 2, 1, show('worker'));
  const [statusText, statusState] = state.status ?? ['RUNNING', 'running'];
  setAppStatus(dg.worker, statusText, statusState);

  const layout = slotLayout(state.slots ?? {}, t);
  const flights = flowFlights(state, t);
  placeLanes(dg, t, state, show('lanes'));
  placeSlots(dg, t, state, layout, flights, show('slots'), show('wfSlots'));
  placePollers(dg, t, state, layout, flights, show('pollers'));
  placeFlights(dg, t, state, layout, flights, show('lanes'), { wf: show('wfSlots'), act: show('slots') });
  placeCache(dg, t, state.cache ?? {}, show('cache'));
  placeBottomBand(dg, t, state, show);
  placeCode(dg.code, t, state.code ?? {}, show('code'));
  placeMarks(dg, t, state, layout);
}

// The Activity Slot grid at t: n Slots, the rows its layout has (fractional while it grows) and how each Slot shows
// ({ s, o } for place())
function slotLayout({ n = 10, grow }, t) {
  if (!grow) return { n, rowsAt: () => slotRows(n), shownAt: () => ({ s: 1, o: 1 }) };
  const spread = P(t, grow.at, 0.5);
  const fromRows = slotRows(grow.from), toRows = slotRows(n);
  return {
    n,
    // the rows spread out first, then the new Slots pop in, 0.02 s apart
    rowsAt: () => lerp(fromRows, toRows, spread),
    shownAt: i => (i < grow.from ? { s: 1, o: 1 } : backPop(t, grow.at + 0.45 + (i - grow.from) * 0.02, 0.35)),
  };
}
// Middle of Activity Slot i at t, on whole pixels: while the grid grows, each row eases from its place in the old
// layout to its place in the new one
function slotPoint(layout, i) {
  const rows = layout.rowsAt();
  const low = Math.floor(rows), high = Math.ceil(rows);
  const [x, y0] = slotCenter(i, low);
  const [, y1] = slotCenter(i, high);
  return [x, Math.round(lerp(y0, y1, rows - low))];
}

// Every task of the flows that has left its lane and still flies or holds its Slot at t:
// { flow, k, index, leave, land, until }, index being its number in its lane (it picks its icon)
function flowFlights(state, t) {
  const flights = [];
  const base = { wf: 0, act: 0 };
  for (const flow of state.flows ?? []) {
    const hold = flow.hold ?? Infinity;
    const departed = flowDeparted(flow, t);
    for (let k = 0; k < departed; k++) {
      const leave = flowLeave(flow, k), land = leave + FLIGHT.land;
      if (t < land + hold) flights.push({ flow, k, index: base[flow.lane] + k, leave, land, until: land + hold });
    }
    base[flow.lane] += flow.count;
  }
  return flights;
}
// Tasks of a lane that have left by t, and when the last one left
function laneDepartures(state, lane, t) {
  let departed = 0, lastLeave = -Infinity, every = Infinity;
  for (const flow of state.flows ?? []) {
    if (flow.lane !== lane) continue;
    const n = flowDeparted(flow, t);
    departed += n;
    if (n > 0) {
      lastLeave = Math.max(lastLeave, flowLeave(flow, n - 1));
      every = flow.every;
    }
  }
  return { departed, lastLeave, every };
}
// The two lanes: one "orders" lane before the split (the Activity lane, in the middle), two lanes after it
function placeLanes(dg, t, state, o) {
  const split = state.split ?? 1;
  const iconOf = state.taskIcon ?? activityIcon;
  for (const lane of ['wf', 'act']) {
    const { departed, lastLeave, every } = laneDepartures(state, lane, t);
    // the queue moves up after each departure, quicker than the departures come
    const shift = P(t, lastLeave, Math.min(0.3, every * 0.9));
    const laneY = lane === 'wf' ? DIAGRAM.wfY : DIAGRAM.actY;
    const y = Math.round(lerp(DIAGRAM.midY, laneY, split));
    const laneO = lane === 'wf' ? o * split : o;
    placeLane(dg.lanes[lane], DIAGRAM.lane.left, y, laneO, {
      queue: state.queue?.[lane] ?? 0, departed, shift, iconOf, labelO: split,
    });
  }
}
// Activity and Workflow Slots: steadily busy ones, then those the flows hold (a swell as each task lands), replays
function placeSlots(dg, t, state, layout, flights, slotsO, wfO) {
  const { n = 10, busy = 0, replay = [], icon = steadySlotIcon } = state.slots ?? {};
  const iconOf = state.taskIcon ?? activityIcon;
  const looks = dg.slots.map(() => ({ look: 'free', icon: null, s: 1 }));
  SLOT_ORDER.filter(i => i < n).slice(0, busy).forEach(i => { looks[i] = { look: 'busy', icon: icon(i), s: 1 }; });
  const wfLooks = dg.wfSlots.map((_, i) => ({ look: i < (state.wfSlots?.busy ?? 0) ? 'wfBusy' : 'free', s: 1 }));
  for (const f of flights) {
    if (t < f.land) continue;
    const slot = f.flow.slots[f.k % f.flow.slots.length];
    const s = swell(t, f.land, 0.12);
    if (f.flow.lane === 'act') looks[slot] = { look: 'busy', icon: f.flow.icon?.(f.k) ?? iconOf(f.index), s };
    else wfLooks[slot] = { look: 'wfBusy', s };
  }
  replay.forEach(i => { looks[i] = { look: 'replay', icon: null, s: 1 }; });
  (state.wfSlots?.replay ?? []).forEach(i => { wfLooks[i] = { look: 'replay', s: 1 }; });
  dg.slots.forEach((cell, i) => {
    if (i >= n) {
      place(cell, 0, 0, 1, 0);
      return;
    }
    setSlot(cell, looks[i].look, looks[i].icon);
    const [x, y] = slotPoint(layout, i);
    const shown = layout.shownAt(i);
    place(cell, x, y, shown.s * looks[i].s, shown.o * slotsO);
  });
  dg.wfSlots.forEach((cell, i) => {
    setSlot(cell, wfLooks[i].look);
    const [x, y] = wfSlotCenter(i);
    place(cell, x, y, wfLooks[i].s, wfO);
  });
  const { labelTop, labelGap, slot } = DIAGRAM;
  showAt(dg.labels.wfSlots, slot.left, labelTop, wfO);
  showAt(dg.labels.slots, slot.left, slotPoint(layout, 0)[1] - slot.h / 2 - labelGap, slotsO);
}
// The Activity Pollers at t: n of them in the end, `working` of them taking tasks (those shown before they grow), the
// y of Poller i and how it shows ({ s, o }): while they grow, the column spreads out like the Slots
function activityPollers(pollers, t) {
  const n = pollers.act ?? 2;
  const grow = pollers.grow;
  if (!grow) return { n, working: n, y: i => pollerY(DIAGRAM.actY, i, n), shown: () => ({ s: 1, o: 1 }) };
  const spread = P(t, grow.at, 0.4);
  return {
    n,
    working: t < grow.at ? grow.from : n,
    y: i => Math.round(lerp(pollerY(DIAGRAM.actY, Math.min(i, grow.from - 1), grow.from),
      pollerY(DIAGRAM.actY, i, n), spread)),
    shown: i => (i < grow.from ? { s: 1, o: 1 } : backPop(t, grow.at + 0.3 + (i - grow.from) * 0.12, 0.35)),
  };
}
// Pollers and their poll lines: a line pulses toward the lane (dashes flowing on the ambient clock G, see draw())
// while its lane is polling; a Poller glows as a chip passes it
function placePollers(dg, t, state, layout, flights, o) {
  const pollers = state.pollers ?? {};
  const act = activityPollers(pollers, t);
  const nWf = pollers.wf ?? 2;
  const columns = {
    wf: {
      n: nWf, working: nWf, laneY: DIAGRAM.wfY, y: i => pollerY(DIAGRAM.wfY, i, nWf), shown: () => ({ s: 1, o: 1 }),
    },
    act: { n: act.n, working: act.working, laneY: DIAGRAM.actY, y: act.y, shown: act.shown },
  };
  // a lane polls while it has a free Slot, unless the state says otherwise
  const nSlots = layout.n;
  const busyAct = new Set(SLOT_ORDER.filter(i => i < nSlots).slice(0, state.slots?.busy ?? 0));
  const busyWf = new Set(Array.from({ length: state.wfSlots?.busy ?? 0 }, (_, i) => i));
  for (const f of flights) {
    if (t < f.land) continue;
    const slot = f.flow.slots[f.k % f.flow.slots.length];
    (f.flow.lane === 'act' ? busyAct : busyWf).add(slot);
  }
  const polling = {
    wf: pollers.polling?.wf ?? busyWf.size < DIAGRAM.wfSlots,
    act: pollers.polling?.act ?? busyAct.size < nSlots,
  };
  const { x, size } = DIAGRAM.poller;
  for (const lane of ['wf', 'act']) {
    const col = columns[lane];
    dg.pollers[lane].forEach((e, i) => {
      const shown = i < col.n ? col.shown(i) : { s: 1, o: 0 };
      const y = col.y(i);
      // a chip passes Poller (k mod n) FLIGHT.leg s after leaving
      const glow = Math.max(0, ...flights
        .filter(f => f.flow.lane === lane && f.k % col.working === i)
        .map(f => win(t, f.leave + FLIGHT.leg - 0.12, f.leave + FLIGHT.leg + 0.2, 0.1)));
      e.style.boxShadow = glowShadow(RGB.violet, glow, { blur: 18, spread: 3, alpha: 0.8 });
      e.style.background = glow > 0.5 ? C.violet : 'var(--surface)';
      place(e, x, y, shown.s, shown.o * o);
      const line = dg.pollLines[lane][i];
      line.setAttribute('d', `M ${x - size / 2 - 3} ${y} L ${LANE_EXIT_X + 3} ${col.laneY}`);
      draw(line, 1, polling[lane] && i < col.n ? 0.85 * shown.o * o : 0);
    });
  }
  showAt(dg.labels.pollers, x - 48, DIAGRAM.labelTop, o);
}
// Chips in flight: from the head of their lane, through a Poller, into their Slot, shrinking a little on the way.
// slotsO: { wf, act }, the opacity of each lane's Slots: past the Poller, a chip fades to it, so it vanishes into a
// Worker whose Slots are hidden (chapter 1)
function placeFlights(dg, t, state, layout, flights, o, slotsO) {
  const used = { wf: 0, act: 0 };
  const iconOf = state.taskIcon ?? activityIcon;
  const nWf = state.pollers?.wf ?? 2;
  const act = activityPollers(state.pollers ?? {}, t);
  const split = state.split ?? 1;
  for (const f of flights) {
    if (t >= f.land) continue;
    const lane = f.flow.lane;
    const chip = dg.flying[lane][used[lane]++ % dg.flying[lane].length];
    if (lane === 'act') setChipIcon(chip, f.flow.icon?.(f.k) ?? iconOf(f.index));
    const laneY = lane === 'wf' ? DIAGRAM.wfY : DIAGRAM.actY;
    const head = [laneHeadX(dg.lanes[lane], DIAGRAM.lane.left), lerp(DIAGRAM.midY, laneY, split)];
    // the Poller it passes: (k mod the working Pollers), as placePollers lights it
    const poller = lane === 'wf'
      ? [DIAGRAM.poller.x, pollerY(laneY, f.k % nWf, nWf)]
      : [DIAGRAM.poller.x, act.y(f.k % act.working)];
    const slotIndex = f.flow.slots[f.k % f.flow.slots.length];
    const slot = lane === 'wf' ? wfSlotCenter(slotIndex) : slotPoint(layout, slotIndex);
    const u = t - f.leave;
    const [x, y] = flightPoint(u, head, poller, slot);
    const inWorker = P(u, FLIGHT.leg, FLIGHT.land - FLIGHT.leg);
    place(chip, x, y, 1 - 0.2 * inWorker, o * lerp(1, slotsO[lane], P(u, FLIGHT.leg, 0.15)));
  }
  for (const lane of ['wf', 'act']) {
    dg.flying[lane].forEach((chip, i) => {
      if (i >= used[lane]) place(chip, 0, 0, 1, 0);
    });
  }
}
// Left end of the cache strip's cell i
const cacheCellLeft = i => DIAGRAM.cache.left + i * DIAGRAM.cache.pitch;
// The order in cache cell i at t: #1042 + i, or the order of its last eviction; also the one it evicted last
function cacheOrders(i, t, evictions) {
  let order = 1042 + i, evicted = null, evictedAt = null;
  for (const ev of evictions) {
    if (ev.cell !== i || t < ev.at) continue;
    evicted = order;
    evictedAt = ev.at;
    order = ev.next;
  }
  return { order, evicted, evictedAt };
}
// The WORKFLOW CACHE strip: its cells fill, flash on a hit, and lose their order on an eviction
function placeCache(dg, t, cache, o) {
  const { cells = 4, grow, filledAt, hits = [], evictions = [] } = cache;
  const { w, h } = DIAGRAM.cache;
  showAt(dg.labels.cache, DIAGRAM.cache.left, DIAGRAM.labelTop, o);
  dg.cache.forEach((cell, i) => {
    const ghost = cell.ghost;
    let shown = i < cells ? 1 : 0;
    if (grow && i >= grow.from && i < cells) shown = backPop(t, grow.at + (i - grow.from) * 0.12, 0.4).o;
    const fill = filledAt ? popIn(t, filledAt[0] + i * filledAt[1]) : { o: 1, s: 1 };
    const { order, evicted, evictedAt } = cacheOrders(i, t, evictions);
    // after an eviction, the cell stays empty until the next order comes in, 0.5 s later
    const refill = evictedAt === null ? fill : popIn(t, evictedAt + 0.5);
    const filled = refill.o > 0;
    const hit = Math.max(0, ...hits.filter(([c]) => c === i).map(([, at]) => win(t, at, at + 0.35, 0.12)));
    cell.textContent = filled ? '#' + order : '';
    Object.assign(cell.style, {
      borderStyle: filled ? 'solid' : 'dashed',
      borderColor: filled ? C.uv : C.line,
      background: filled ? `rgba(${RGB.uv},${(0.22 + 0.5 * hit).toFixed(3)})` : 'transparent',
      color: `rgba(${RGB.ink},${Math.max(refill.o, 0).toFixed(3)})`,
      boxShadow: glowShadow(RGB.uv, hit, { blur: 22, spread: 2, alpha: 0.9 }),
    });
    const x = cacheCellLeft(i) + w / 2, y = DIAGRAM.wfY;
    place(cell, x, y, filled ? refill.s : 1, shown * o);
    // the evicted order slides down out of the strip in red, fading out
    const out = evictedAt === null ? 1 : P(t, evictedAt, 0.6, easeIn);
    ghost.textContent = evicted === null ? '' : '#' + evicted;
    place(ghost, x, y + Math.round(out * 46), 1, evictedAt === null ? 0 : (1 - out) * o);
  });
}
// Readouts, metric lines and meters
function placeBottomBand(dg, t, state, show) {
  const { readout, metric, meter } = DIAGRAM;
  const queue = state.queue ?? {};
  const backlog = state.backlog ?? {};
  const backlogN = backlog.n ?? (queue.wf ?? 0) + (queue.act ?? 0);
  setReadout(dg.backlog, withCommas(Math.floor(backlogN)), trendColor(backlog.trend));
  place(dg.backlog, readout.left.backlog + readout.w / 2, readout.top + readout.h / 2, 1, show('backlog'));
  const wait = state.wait ?? { text: '0.2 s' };
  setReadout(dg.wait, wait.text, trendColor(wait.trend));
  place(dg.wait, readout.left.wait + readout.w / 2, readout.top + readout.h / 2, 1, show('wait'));
  dg.metrics.forEach((e, i) => {
    const m = state.metrics?.[i];
    if (!m) {
      place(e, 0, 0, 1, 0);
      return;
    }
    setMetricLine(e, m.name, m.value, m.color);
    rise(e, metric.left + metric.w / 2, metric.tops[i] + metric.h / 2, P(t, m.at, 0.4), 12);
  });
  const cpu = state.cpu ?? 0;
  setMeter(dg.cpu, cpu / 100, Math.round(cpu) + '%', cpu >= 90);
  place(dg.cpu, meter.left + meter.w / 2, meter.top.cpu + meter.h / 2, 1, show('cpu'));
  const mem = state.mem ?? {};
  const use = mem.use ?? 0.3;
  setMeter(dg.mem, use, mem.label ?? '2 GB', use >= 0.9, mem.swapAt === undefined ? 1 : swell(t, mem.swapAt, 0.25));
  place(dg.mem, meter.left + meter.w / 2, meter.top.mem + meter.h / 2, 1, show('mem'));
}
// The code card at t: inserted lines open (the lines under them slide down and the card grows), values swap with a
// swell, and one line may be highlighted
function placeCode(card, t, code, o) {
  const { left, top, w, padY, lineH } = DIAGRAM.code;
  const rowOf = {};
  let row = 0, number = 0;
  WORKER_CODE.forEach((spec, i) => {
    const line = card.lines[i];
    const at = code.insert?.[spec.key];
    const open = spec.inserted ? (at === undefined ? 0 : P(t, at, 0.4)) : 1;
    rowOf[spec.key] = row;
    line.style.top = (padY + row * lineH) + 'px';
    line.style.opacity = spec.inserted ? (at === undefined ? 0 : P(t, at + 0.25, 0.3)) : 1;
    if (open >= 0.5) number += 1;
    line.firstChild.textContent = number;
    row += open;
  });
  for (const [key, span] of Object.entries(card.values)) {
    const swap = code.swap?.[key];
    const swapped = swap && t >= swap[1];
    span.textContent = swapped ? swap[0] : WORKER_CODE.find(spec => spec.key === key).value;
    span.style.transform = swap ? `scale(${swell(t, swap[1], 0.3)})` : '';
  }
  const h = padY * 2 + row * lineH;
  card.style.height = h + 'px';
  const light = code.light;
  setCodeLine(card, light ? rowOf[light[0]] : 0, light ? win(t, light[1], light[2], 0.25) : 0);
  place(card, left + w / 2, top + h / 2, 1, o);
}
// The bottleneck markers, round the part each one names
function placeMarks(dg, t, state, layout) {
  const marks = state.marks ?? {};
  const pad = 8;
  const { slot, cache, poller, meter } = DIAGRAM;
  // the Activity Slot grid, from its first row to its last one, following the rows while the grid grows: the rows are
  // centered on the Activity lane, so the outline opens evenly up and down as they spread out
  const gridW = (slot.cols - 1) * slot.pitchX + slot.w;
  const gridTop = slotPoint(layout, 0)[1] - slot.h / 2;
  const gridBottom = 2 * DIAGRAM.actY - gridTop;
  placeMark(dg.marks.slots, t, {
    left: slot.left - pad, top: gridTop - pad, w: gridW + 2 * pad, h: gridBottom - gridTop + 2 * pad,
  }, 'above-right', marks.slots);
  // the Activity Pollers' column, from its first Poller to its last one, following them while the column spreads out
  const act = activityPollers(state.pollers ?? {}, t);
  const pollPad = 10;
  const colTop = act.y(0) - poller.size / 2 - pollPad;
  const colBottom = act.y(act.n - 1) + poller.size / 2 + pollPad;
  placeMark(dg.marks.pollers, t, {
    left: poller.x - poller.size / 2 - pollPad, top: colTop, w: poller.size + 2 * pollPad, h: colBottom - colTop,
  }, 'above', marks.pollers);
  // the cache strip; over a short strip, the tag stays 20 px right of the WORKFLOW CACHE label
  const cells = state.cache?.cells ?? 4;
  placeMark(dg.marks.cache, t, {
    left: cache.left - pad, top: DIAGRAM.wfY - cache.h / 2 - pad,
    w: (cells - 1) * cache.pitch + cache.w + 2 * pad, h: cache.h + 2 * pad,
  }, 'above-right', marks.cache, cache.left + dg.labels.cache.offsetWidth + 20);
  // the CPU meter
  placeMark(dg.marks.cpu, t, {
    left: meter.left - pad, top: meter.top.cpu - pad, w: meter.w + 2 * pad, h: meter.h + 2 * pad,
  }, 'astride', marks.cpu);
}

// ---------- mini Worker (intro, outro): a WORKER panel holding a small grid of Activity Slots
const MINI = { w: 56, h: 32, pitchX: 70, pitchY: 42, pad: 24, head: 72 };
// cols x rows Slots under the panel name; returns the panel, with cells (see setSlot) and cellAt(i), the middle of
// cell i from the panel's center
function makeMiniWorker(root, name, cols, rows) {
  const w = MINI.pad * 2 + (cols - 1) * MINI.pitchX + MINI.w;
  const h = MINI.head + (rows - 1) * MINI.pitchY + MINI.h + MINI.pad;
  const panel = makeAppPanel(root, name, w, h, { font: 18 });
  panel.cellAt = i => [
    -w / 2 + MINI.pad + MINI.w / 2 + (i % cols) * MINI.pitchX,
    -h / 2 + MINI.head + MINI.h / 2 + Math.floor(i / cols) * MINI.pitchY,
  ];
  panel.cells = Array.from({ length: cols * rows }, (_, i) => {
    const [x, y] = panel.cellAt(i);
    return makeSlot(panel, MINI.w, MINI.h, {
      left: (w / 2 + x - MINI.w / 2) + 'px', top: (h / 2 + y - MINI.h / 2) + 'px', opacity: 1,
    });
  });
  return panel;
}
