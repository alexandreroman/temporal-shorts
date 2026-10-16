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
// One grid spaces every part of the theme (GRID):
// - pad: the inner padding of every panel (left, right and bottom; their headers sit 24 px in too) and of the text
//   of the tiles and metric lines
// - gutter: between the components of one zone: tiles side by side or stacked, metric lines, Worker panels
// - zone: between zones: the TEMPORAL and WORKER panels, the top and bottom bands (the poll lines run in this gap)
// - cell: between cells: Activity Slots, Workflow Slots, cache cells, Pollers, the mini Worker's Slots
// - label: from a label (labelH px high) to the component it names
// - corner: the radius of the poll lines' rounded corners
const GRID = { pad: 24, gutter: 20, zone: 40, cell: 12, label: 12, labelH: 21, corner: 8 };
// The layout, inside the content frame x 120..1800, y 150..880:
// - Top band, y 150..592: the TEMPORAL panel (x 120..820) holds the "orders" Task Queue as two lanes, Workflow
//   Tasks (middle y 285) and Activity Tasks (y 464); the WORKER panel (x 860..1800) takes them: a Poller column
//   centered on x 936, level with each lane, then the Workflow Slots and the WORKFLOW CACHE on the Workflow row, the
//   Activity Slot grid (10 per row, up to 5 rows centered on y 464) on the Activity row. Every cell sits on the
//   grid's 10 columns (x 1028..1776, on the panel's right padding line): the Workflow Slots on columns 0 and 1, the
//   cache on columns 3 to 9. The labels of the Workflow row sit on y 224 in both panels, 12 px above the row's
//   tallest part (its 2 Pollers); ACTIVITY SLOTS sits 12 px above the grid's top row.
// - Chapters 1 and 2 open on a closed Worker: one "orders" lane, and the 10 Activity Slots in 2 rows of 5, the grid
//   and its ACTIVITY SLOTS label centered as a group in the WORKER panel (see `closed` in the slots state).
// - Bottom band, y 632..880, its columns on the panels' edges, in two rows a gutter apart, those of the CPU and
//   MEMORY meters (x 860..1100, y 632..746 and 766..880): under TEMPORAL (x 120..820), the BACKLOG and
//   SCHEDULE-TO-START readouts on the first row, up to two metric lines on the second; right of the meters, the
//   Worker.create() code card with its tab (x 1120..1800), as high as the band at its tallest, 6 lines.
// - The poll lines join each lane's right end to its Pollers with right angles: out of the lane, along the line,
//   down or up a trunk in the middle of the gap between the panels (x 840), then into each Poller.
const DIAGRAM = {
  temporal: { left: 120, top: 150, w: 700, h: 442 },
  worker: { left: 860, top: 150, w: 940, h: 442 },
  // middles of the Workflow and Activity lanes and of the Worker rows they feed; midY: the single lane of chapter 1,
  // before the Task Queue splits into two, in the middle of the panel
  wfY: 285, actY: 464, midY: 371,
  // top of the labels on the Workflow row (both panels), 20 px under the panel headers
  labelTop: 224,
  // lane track: x 144..796, 52 px high; queued chips every `pitch` px from the head (28 px inside its right end),
  // at most `cap` of them, then a "+N" count at its left end; its label sits labelTop px above its middle
  lane: { left: 144, w: 652, h: 52, pitch: 48, cap: 11, headInset: 28, labelTop: 61 },
  chip: { act: 40, wf: 28 },
  // Pollers: 22 px circles, `pitch` px apart, centered on their lane, in a column centered on x 936, between the
  // panel's padding line (x 884) and a gutter of 40 px before the Slots; its BOTTLENECK tag (x 872..1000) stays
  // clear of the panel edge and of ACTIVITY SLOTS
  poller: { x: 936, size: 22, pitch: 34, max: { wf: 2, act: 5 } },
  // the poll lines' trunk, in the middle of the gap between the panels
  trunkX: 840,
  // Slots: w x h cells; Activity Slots in rows of `cols` from x 1028 (x 1028..1776 for 10), up to `max`
  slot: { left: 1028, w: 64, h: 32, pitchX: 76, pitchY: 44, cols: 10, max: 50 },
  // the closed Worker's grid: 2 rows of `cols` Slots, x 1146..1514, y 350..426, its label on y 317..338, so the
  // label and the grid, 109 px high together, sit centered in the WORKER panel (y 150..592)
  closed: { left: 1146, top: 350, cols: 5 },
  wfSlots: 2,
  // WORKFLOW CACHE: a strip of order cells on the Slot columns 3 to 9 (x 1256..1776), up to `max`
  cache: { left: 1256, w: 64, h: 32, pitch: 76, max: 7 },
  // the bottom band, as high as the code card and its tab, and as two meters a gutter apart
  band: { top: 632, h: 248 },
  // the readouts on the meters' first row, as high as them
  readout: { w: 340, left: { backlog: 120, wait: 480 } },
  // the metric lines on the meters' second row: two lines a gutter apart, the first on its top line, the second on
  // its bottom line
  metric: { left: 120, w: 700, h: 47 },
  meter: { left: 860, w: 240, h: 114, top: { cpu: 632, mem: 766 } },
  // code card x 1120..1800, y 666..880, under its WORKER tab (y 632..666), 6 lines high whatever it shows; 18 px
  // code, so the longest line (54 characters) fits
  code: { left: 1120, top: 666, w: 680, font: 18, lineH: 30, padY: 17, padX: 24, gutter: 34 },
};
// The compact CPU gauge of a Worker panel (Workers B and C of chapter 6, and Worker A's CPU meter once chapter 6 docks
// it into the WORKER panel): no tile round it, w px wide, its right edge on the panel's right padding line; the CPU
// label and the value on the header's line, labelTop and valueTop px under the panel's top, the bar barTop px under it
const GAUGE = { w: 112, labelTop: 20, valueTop: 16, barTop: 71, barH: 14 };
// Where the CPU meter docks in the WORKER panel: the gauge's box, from the value's top to the bar's bottom
// (x 1664..1776, y 166..235), where the panel's status sits otherwise
const CPU_GAUGE = {
  left: DIAGRAM.worker.left + DIAGRAM.worker.w - GRID.pad - GAUGE.w,
  top: DIAGRAM.worker.top + GAUGE.valueTop,
  w: GAUGE.w,
  h: GAUGE.barTop + GAUGE.barH - GAUGE.valueTop,
};
// Right end of the lanes, where the poll lines leave them
const LANE_EXIT_X = DIAGRAM.lane.left + DIAGRAM.lane.w;
// Middle of a lane ('wf' or 'act') at split (see the split state): both lanes sit on midY before the split
const laneMidY = (lane, split) => Math.round(lerp(DIAGRAM.midY, lane === 'wf' ? DIAGRAM.wfY : DIAGRAM.actY, split));

// ---------- right-angle connectors (see roundedPath(), with GRID.corner)
// The points of the poll line from the end of a lane whose middle is laneY to a Poller at (x, y): along the lane's
// line to the trunk, along the trunk, then into the Poller. Every line starts at the lane's end, so the lines of one
// lane share their first segments and their dashes, which flow from the lane to the Pollers (see draw()).
const pollRoute = (laneY, x, y) => [[LANE_EXIT_X + 3, laneY], [DIAGRAM.trunkX, laneY], [DIAGRAM.trunkX, y], [x, y]];

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
    width: size, height: size, background: 'var(--surface)', border: '1px solid ' + C.lineLight,
    borderRadius: 'var(--rs)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  });
}
// The icon of an Activity Task chip; the DOM is only rewritten when it changes
function setChipIcon(chip, icon) {
  setHtml(chip, ICON(icon, 22, C.ink, 1.8));
}
// Lane of a Task Queue: a track, an optional label above it, up to `cap` queued chips and a "+N" count of the tasks
// beyond them. lane: 'wf' or 'act', the kind of chips; w: the track width.
function makeQueueLane(root, label, lane, { w = DIAGRAM.lane.w, cap = DIAGRAM.lane.cap } = {}) {
  return {
    lane, w, cap,
    track: E(root, '', '', {
      width: w + 'px', height: DIAGRAM.lane.h + 'px', background: `rgba(${RGB.ink},.03)`,
      border: '1px solid ' + C.line, borderRadius: 'var(--rs)',
    }),
    label: label ? E(root, label, 'lbl', { fontSize: '16px' }) : null,
    more: E(root, '', 'mono', { fontSize: '16px', lineHeight: '20px', color: C.slate, whiteSpace: 'nowrap' }),
    chips: Array.from({ length: cap }, () => makeTaskChip(root, lane)),
  };
}
// Resizes a lane: a track w px wide, holding up to `cap` queued chips (at most the cap it was made with; a fractional
// cap shows the next chip fading in at its place, from the overflow)
function resizeLane(lane, w, cap) {
  lane.w = w;
  lane.cap = cap;
  lane.track.style.width = w + 'px';
}
// x of the head of a lane whose track starts at x: the queued chip next out
const laneHeadX = (lane, x) => x + lane.w - DIAGRAM.lane.headInset;
// Places a lane, its track's left end at x and its middle at y, with opacity o (labelO: its label's). Options:
// - queue: the tasks waiting; a fractional part is the tail task arriving, sliding in from the left
// - departed: how many tasks have left the head so far: queued chip p is task departed + p, which picks its icon
//   (iconOf(k), Activity lanes only)
// - shift: 0 to 1, how far the queue has moved up since the last departure (1 at rest); past the cap, the tail
//   chip fades in at its place as the queue moves, coming from the overflow
function placeQueueLane(lane, x, y, o, { queue = 0, departed = 0, shift = 1, iconOf = activityIcon, labelO = 1 } = {}) {
  const { pitch } = DIAGRAM.lane;
  place(lane.track, x + lane.w / 2, y, 1, o);
  if (lane.label) showAt(lane.label, x, y - DIAGRAM.lane.labelTop, o * labelO);
  const shown = Math.min(queue, lane.cap);
  const overflow = queue > lane.cap;
  const headX = laneHeadX(lane, x);
  lane.chips.forEach((chip, p) => {
    const a = clamp(shown - p);
    const fromOverflow = overflow && p === lane.cap - 1;
    // queued chips sit one pitch further out until the queue has moved up; an arriving tail slides in from the left,
    // unless it comes from the overflow
    const cx = headX - p * pitch - (fromOverflow ? 0 : (1 - shift) * pitch) - (overflow ? 0 : (1 - a) * pitch);
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
    width: w + 'px', height: h + 'px', border: '1px solid', borderRadius: '5px',
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
// Middle of Activity Slot i in the closed Worker's grid, moved down by drop px
function closedSlotCenter(i, drop) {
  const { w, h, pitchX, pitchY } = DIAGRAM.slot;
  const { left, top, cols } = DIAGRAM.closed;
  return [left + w / 2 + (i % cols) * pitchX, top + drop + h / 2 + Math.floor(i / cols) * pitchY];
}
// Middle of Workflow Slot i
const wfSlotCenter = i => [DIAGRAM.slot.left + DIAGRAM.slot.w / 2 + i * DIAGRAM.slot.pitchX, DIAGRAM.wfY];
// Middle of Poller i of n on a lane whose middle is laneY
const pollerY = (laneY, i, n) => laneY + (i - (n - 1) / 2) * DIAGRAM.poller.pitch;

// ---------- task flows: chips from a lane through a Poller into a Slot
// A flow is a stream of tasks, a pure function of time: { lane, from, every, count, hold, slots, icon, freeAhead }.
// Task k (0 to count - 1) leaves the head of its lane ('wf' or 'act') at from + k * every, passes a Poller FLIGHT.leg
// s later and lands in Slot slots[k % slots.length] FLIGHT.land s after leaving; it holds that Slot `hold` seconds
// (default: for good). icon(k): the icon of an Activity Task (default: the lane's icons, see taskIcon). freeAhead
// (Activity flows only): the busy Slot a task lands in shows free from freeAhead s before it lands, its previous task
// done, so tasks land in Slots as they free up.
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
// Activity Slots that sit free at t, waiting for a task of the flows that lands within its flow's `freeAhead` seconds
function freeingSlots(flows, t) {
  const slots = [];
  for (const flow of flows) {
    if (flow.lane !== 'act' || !flow.freeAhead) continue;
    for (let k = 0; k < flow.count; k++) {
      const land = flowLandAt(flow, k);
      if (t >= land - flow.freeAhead && t < land) slots.push(flow.slots[k % flow.slots.length]);
    }
  }
  return slots;
}
// Where a chip is u seconds after leaving the head: along its lane and the poll line to the Poller (route: the
// points from the head to the Poller), then to the Slot (each leg eased)
function flightPoint(u, route, slot) {
  if (u < FLIGHT.leg) return pointAlong(route, ease(u / FLIGHT.leg));
  const poller = route[route.length - 1];
  const p = ease((u - FLIGHT.leg) / (FLIGHT.land - FLIGHT.leg));
  return [lerp(poller[0], slot[0], p), lerp(poller[1], slot[1], p)];
}

// ---------- readouts, meters, metric lines
// Readout tile, w x h: a label over a large value (see setReadout)
function makeReadout(p, label, w, h) {
  const e = E(p,
    `<div class="lbl" style="position:absolute;left:22px;top:20px;font-size:16px">${label}</div>`
    + '<div class="v" style="position:absolute;left:24px;bottom:12px;font-size:60px;line-height:60px;'
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
// Insets of a meter tile's label, value and bar, from its padding box
const METER_INSET = { labelLeft: 22, labelTop: 20, valueRight: 24, valueTop: 16, bar: 24 };
// Meter tile, w x h: a label and a value on top, a bar gauge under them (see setMeter)
function makeMeter(p, label, w, h) {
  const { labelLeft, labelTop, valueRight, valueTop, bar } = METER_INSET;
  const barW = w - 2 * bar;
  const e = E(p,
    `<div class="lbl" style="position:absolute;left:${labelLeft}px;top:${labelTop}px;font-size:16px">${label}</div>`
    + `<div class="v mono" style="position:absolute;right:${valueRight}px;top:${valueTop}px;font-size:24px;`
    + 'line-height:30px;transform-origin:right center"></div>'
    + `<div style="position:absolute;left:${bar}px;bottom:${bar}px;width:${barW}px;height:${GAUGE.barH}px;`
    + `border-radius:3px;background:rgba(${RGB.ink},.08);overflow:hidden">`
    + '<div class="fill" style="height:100%;width:0"></div></div>',
    'tile', { width: w + 'px', height: h + 'px', textAlign: 'left' });
  e.lbl = e.querySelector('.lbl');
  e.v = e.querySelector('.v');
  e.fill = e.querySelector('.fill');
  e.bar = e.fill.parentElement;
  e.barW = barW;
  return e;
}
// The CPU meter's outer box at dock: 0, its tile in the bottom band; 1, the compact gauge in the WORKER panel
// (CPU_GAUGE, plus the tile's border, TILE_BORDER); whole pixels in between
function cpuMeterBox(dock) {
  const { meter } = DIAGRAM;
  const b = TILE_BORDER;
  const at = (from, to) => Math.round(lerp(from, to, dock));
  return {
    left: at(meter.left, CPU_GAUGE.left - b), top: at(meter.top.cpu, CPU_GAUGE.top - b),
    w: at(meter.w, CPU_GAUGE.w + 2 * b), h: at(meter.h, CPU_GAUGE.h + 2 * b),
  };
}
// Places the CPU meter at cpu % and dock (see cpuMeterBox), with opacity o: on its way into the WORKER panel, the tile
// narrows round its label, value and bar, which move to the gauge's places, and its border and background fade out
function placeCpuMeter(e, cpu, dock, o) {
  const { labelLeft, labelTop, valueRight, valueTop, bar } = METER_INSET;
  const box = cpuMeterBox(dock);
  const at = (from, to) => Math.round(lerp(from, to, dock)) + 'px';
  Object.assign(e.style, { width: box.w + 'px', height: box.h + 'px' });
  Object.assign(e.lbl.style, { left: at(labelLeft, 0), top: at(labelTop, GAUGE.labelTop - GAUGE.valueTop) });
  Object.assign(e.v.style, { right: at(valueRight, 0), top: at(valueTop, 0) });
  e.barW = Math.round(lerp(DIAGRAM.meter.w - 2 * bar, GAUGE.w, dock));
  Object.assign(e.bar.style, { left: at(bar, 0), bottom: at(bar, 0), width: e.barW + 'px' });
  const red = cpu >= 90;
  setMeter(e, cpu / 100, Math.round(cpu) + '%', red);
  if (dock > 0) {
    // the frame fades on the last quarter of the way only: a solid tile crosses the panel's parts, not a clear one
    const kept = Math.round(clamp((1 - dock) * 4) * 100);
    e.style.borderColor = `color-mix(in srgb, ${red ? C.red : C.line} ${kept}%, transparent)`;
    e.style.background = `color-mix(in srgb, var(--surface) ${kept}%, transparent)`;
  } else {
    e.style.background = '';
  }
  place(e, box.left + box.w / 2, box.top + box.h / 2, 1, o);
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
      padding: `0 ${GRID.pad}px`, fontSize: '17px', whiteSpace: 'nowrap',
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

// ---------- the "+ WORKER" (chapter 1) and "+ SLOTS" (chapter 6) ghosts: the reflex fix, struck through
// A dashed panel in the place of the code card (with its tab), the whole band high, its label in 30 px mono; it also
// keeps the composition centered on y 515, which the hard cuts leave no shift to do
const GHOST = { left: DIAGRAM.code.left, top: DIAGRAM.band.top, w: DIAGRAM.code.w, h: DIAGRAM.band.h, label: 30 };
GHOST.x = GHOST.left + GHOST.w / 2;
GHOST.y = GHOST.top + GHOST.h / 2;
// The ghost and its red strike, strikeHalfW px on either side of its middle (in a layer of its own, over the ghost)
function makeGhost(root, label, strikeHalfW) {
  const ghost = E(root,
    `<div class="mono" style="font-size:${GHOST.label}px;letter-spacing:.1em;padding-left:.1em;color:var(--slate)">`
    + label + '</div>',
    '', {
      width: GHOST.w + 'px', height: GHOST.h + 'px', border: '2px dashed ' + C.lineLight, borderRadius: 'var(--r)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    });
  const svg = svgLayer(root);
  const { x, y } = GHOST;
  ghost.strike = path(svg, `M ${x - strikeHalfW} ${y} L ${x + strikeHalfW} ${y}`, C.red, 4, false);
  return ghost;
}
// Places a ghost: risen by p (see rise()), with opacity o; from strikeAt on, its border turns red and the strike draws
// across it, with opacity strikeO
function placeGhost(ghost, t, p, o, strikeAt, strikeO) {
  rise(ghost, GHOST.x, GHOST.y, p);
  ghost.style.opacity = o;
  ghost.style.borderColor = t >= strikeAt ? C.red : C.lineLight;
  draw(ghost.strike, P(t, strikeAt, 0.35, easeOut), strikeO);
}

// ---------- bottleneck markers: a red outline round a part and a BOTTLENECK tag, which turn neon (FIXED)
// A tag's height: 21 px of line, 8 of padding and 3 of border, so a tag centered on a whole pixel rests on whole pixels
const TAG_H = 32;
function makeMark(root) {
  // the tag after the outline, so that it covers the outline where they cross
  const box = E(root, '', '', { border: '2px solid ' + C.red, borderRadius: 'var(--r)' });
  const tag = statusTag(root);
  tag.style.lineHeight = '21px';
  return { box, tag };
}
// The top left corner of a tag w px wide by an outline box at spot (see placeMark)
function tagCorner(box, spot, w, minLeft) {
  if (spot === 'left') return [box.left - 20 - w, Math.round(box.top + box.h / 2 - TAG_H / 2)];
  const left = spot === 'above-right' ? box.left + box.w - w : box.left + box.w / 2 - w / 2;
  const top = spot === 'astride' ? box.top - TAG_H / 2 : box.top - 38;
  return [Math.max(minLeft, left), top];
}
// box: { left, top, w, h } of the outline; spot: where the tag sits, 'above' (centered over the outline),
// 'above-right' (over its right end), 'astride' (centered on its top edge) or 'left' (20 px left of it, centered on
// its middle); m: { at, fixedAt, out }, when the marker shows (BOTTLENECK), turns FIXED and fades out (undefined:
// hidden); minLeft: the leftmost x of the tag, which keeps it clear of a label on its left
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
  const [left, top] = tagCorner(box, spot, w, minLeft);
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
  dg.lanes = { wf: makeQueueLane(root, 'Workflow Tasks', 'wf'), act: makeQueueLane(root, 'Activity Tasks', 'act') };
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
  // the poll lines run above the panels, from the end of each lane to its Pollers; their `d` is set on each frame.
  // The layer, not each line, is translucent, so the segments that lines share look like those of a single line.
  dg.svg = svgLayer(root);
  dg.svg.style.opacity = 0.85;
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
  dg.backlog = makeReadout(root, 'Backlog', readout.w, meter.h);
  dg.wait = makeReadout(root, 'Schedule-to-start', readout.w, meter.h);
  dg.metrics = [makeMetricLine(root, metric.w, metric.h), makeMetricLine(root, metric.w, metric.h)];
  dg.cpu = makeMeter(root, 'CPU', meter.w, meter.h);
  dg.mem = makeMeter(root, 'Memory', meter.w, meter.h);
  dg.code = makeWorkerCode(root);
  dg.marks = { slots: makeMark(root), pollers: makeMark(root), cache: makeMark(root), cpu: makeMark(root) };
  return dg;
}

// ---------- placing the diagram
// Places the whole diagram at time t, from one state object; every field is optional, so a chapter sets only what
// it shows, phase by phase (its values may depend on t and on its cues c[i]):
// - show: { temporal, lanes, worker, pollers, wfSlots, slots, slotsLabel, cache, backlog, wait, cpu, mem, code },
//   the opacity of each part, 1 by default (slotsLabel, the ACTIVITY SLOTS label: that of the slots by default)
// - split: 0 to 1, from one "orders" lane (chapter 1) to two lanes, Workflow Tasks above Activity Tasks (default 1)
// - queue: { wf, act }, the tasks waiting in each lane (see placeQueueLane); taskIcon(k): the icon of Activity Task k
//   of its lane (default activityIcon)
// - flows: task flows from the lanes into the Slots (see FLIGHT), in order of their `from`
// - slots: { n, grow, busy, replay, icon, glow, closed, drop }, the Activity Slots: n of them (default 10); grow
//   { from, at }: the grid grows from `from` Slots at `at` (its rows spread out, then the new Slots pop in); busy: how
//   many are steadily busy, in SLOT_ORDER, besides those the flows hold; replay: indices of the Slots replaying;
//   icon(i): the icon of a steadily busy Slot; glow: when the grid and its ACTIVITY SLOTS label light up briefly (an
//   emphasis); closed: 0 to 1, from the diagram's row to the closed Worker's centered grid (default 0); drop: how far
//   the closed grid moves down, making room for a tag above it (default 0)
// - wfSlots: { busy, replay }, the Workflow Slots (busy: how many, from the first)
// - pollers: { wf, act, grow, polling }: Pollers per lane (default 2 each, up to DIAGRAM.poller.max); grow { from,
//   at }: Activity Pollers from `from` on pop in at `at`; polling { wf, act }: whether a lane's poll lines flow
//   (default: while the lane has a free Slot)
// - cache: { cells, grow, filledAt, hits, evictions }: cells (default 4, up to DIAGRAM.cache.max) holding orders
//   #1042, #1043...; grow { from, at }: the strip widens; filledAt [at, every]: cell i fills at at + i * every
//   (default: filled); hits [[cell, at]]: the cell flashes; evictions [{ cell, at, next }]: its order slides out in
//   red and order `next` takes its place
// - cpu: 0 to 100 (red from 90); cpuDock: 0 to 1, from the CPU meter's tile in the bottom band to the compact gauge
//   in the WORKER panel's header (default 0; see placeCpuMeter); mem: { use, gb, swapAt }, the share used (red from
//   0.9), the size shown in GB (1 shows '1 GB') and when it last changed (a swell)
// - backlog: { n, trend }, the BACKLOG count (default: the Activity lane's queue, as the backlog metrics count each
//   task type on its own) and its trend, 'up' (red) or 'down' (neon); wait: { text, trend }, the SCHEDULE-TO-START
//   value ('38 s')
// - metrics: up to 2 metric lines [{ name, value, at, out, color }], each rising in at `at` and, if `out` is set,
//   sinking out at `out` (see placeBottomBand)
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
  placeSlots(dg, t, state, layout, flights, show('slots'), show('wfSlots'), state.show?.slotsLabel ?? show('slots'));
  placePollers(dg, t, state, layout, flights, show('pollers'));
  placeFlights(dg, t, state, layout, flights, show('lanes'), { wf: show('wfSlots'), act: show('slots') });
  placeCache(dg, t, state.cache ?? {}, show('cache'));
  placeBottomBand(dg, t, state, show);
  placeCode(dg.code, t, state.code ?? {}, show('code'));
  placeMarks(dg, t, state, layout);
}

// The Activity Slot grid at t: n Slots, the rows its layout has (fractional while it grows), how each Slot shows
// ({ s, o } for place()), and how closed the Worker is (see the slots state)
function slotLayout({ n = 10, grow, closed = 0, drop = 0 }, t) {
  if (!grow) return { n, closed, drop, rowsAt: () => slotRows(n), shownAt: () => ({ s: 1, o: 1 }) };
  const spread = P(t, grow.at, 0.5);
  const fromRows = slotRows(grow.from), toRows = slotRows(n);
  return {
    n, closed, drop,
    // the rows spread out first, then the new Slots pop in, 0.02 s apart
    rowsAt: () => lerp(fromRows, toRows, spread),
    shownAt: i => (i < grow.from ? { s: 1, o: 1 } : backPop(t, grow.at + 0.45 + (i - grow.from) * 0.02, 0.35)),
  };
}
// Middle of Activity Slot i at t, on whole pixels: while the grid grows, each row eases from its place in the old
// layout to its place in the new one; while the Worker opens or closes, each Slot eases between the diagram's row and
// the closed Worker's grid
function slotPoint(layout, i) {
  const rows = layout.rowsAt();
  const low = Math.floor(rows), high = Math.ceil(rows);
  const [x, y0] = slotCenter(i, low);
  const [, y1] = slotCenter(i, high);
  const y = lerp(y0, y1, rows - low);
  const [closedX, closedY] = closedSlotCenter(i, layout.drop);
  return [Math.round(lerp(x, closedX, layout.closed)), Math.round(lerp(y, closedY, layout.closed))];
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
    const laneO = lane === 'wf' ? o * split : o;
    placeQueueLane(dg.lanes[lane], DIAGRAM.lane.left, laneMidY(lane, split), laneO, {
      queue: state.queue?.[lane] ?? 0, departed, shift, iconOf, labelO: split,
    });
  }
}
// Activity and Workflow Slots: steadily busy ones, then those the flows hold (a swell as each task lands), those
// freeing up for a flow's next task, replays
function placeSlots(dg, t, state, layout, flights, slotsO, wfO, labelO) {
  const { n = 10, busy = 0, replay = [], icon = steadySlotIcon, glow } = state.slots ?? {};
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
  freeingSlots(state.flows ?? [], t).forEach(i => { looks[i] = { look: 'free', icon: null, s: 1 }; });
  replay.forEach(i => { looks[i] = { look: 'replay', icon: null, s: 1 }; });
  (state.wfSlots?.replay ?? []).forEach(i => { wfLooks[i] = { look: 'replay', s: 1 }; });
  const light = glow === undefined ? 0 : win(t, glow, glow + 1.0, 0.3);
  const cellGlow = glowShadow(RGB.violet, light, { blur: 18, spread: 2, alpha: 0.7 });
  dg.slots.forEach((cell, i) => {
    if (i >= n) {
      place(cell, 0, 0, 1, 0);
      return;
    }
    setSlot(cell, looks[i].look, looks[i].icon);
    const [x, y] = slotPoint(layout, i);
    const shown = layout.shownAt(i);
    cell.style.boxShadow = cellGlow;
    place(cell, x, y, shown.s * looks[i].s, shown.o * slotsO);
  });
  dg.wfSlots.forEach((cell, i) => {
    setSlot(cell, wfLooks[i].look);
    const [x, y] = wfSlotCenter(i);
    place(cell, x, y, wfLooks[i].s, wfO);
  });
  const { labelTop, slot } = DIAGRAM;
  showAt(dg.labels.wfSlots, slot.left, labelTop, wfO);
  const [firstX, firstY] = slotPoint(layout, 0);
  showAt(dg.labels.slots, firstX - slot.w / 2, firstY - slot.h / 2 - GRID.label - GRID.labelH, labelO);
  dg.labels.slots.style.color = light > 0.5 ? C.violet : '';
  dg.labels.slots.style.textShadow = glowShadow(RGB.violet, light, { blur: 14, alpha: 0.8 });
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
// Pollers and their poll lines: a line pulses from the lane to its Poller (dashes flowing on the ambient clock G,
// see draw()) while its lane is polling; a Poller glows as a chip passes it
function placePollers(dg, t, state, layout, flights, o) {
  const pollers = state.pollers ?? {};
  const act = activityPollers(pollers, t);
  const nWf = pollers.wf ?? 2;
  const split = state.split ?? 1;
  const columns = {
    wf: {
      n: nWf, working: nWf, laneY: laneMidY('wf', split), y: i => pollerY(DIAGRAM.wfY, i, nWf),
      shown: () => ({ s: 1, o: 1 }),
    },
    act: { n: act.n, working: act.working, laneY: laneMidY('act', split), y: act.y, shown: act.shown },
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
  freeingSlots(state.flows ?? [], t).forEach(i => busyAct.delete(i));
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
      setD(line, roundedPath(pollRoute(col.laneY, x - size / 2 - 3, y), GRID.corner));
      draw(line, 1, polling[lane] && i < col.n ? shown.o * o : 0);
    });
  }
  showAt(dg.labels.pollers, x - 48, DIAGRAM.labelTop, o);
}
// Chips in flight: from the head of their lane, along the poll line to a Poller, into their Slot, shrinking a little
// on the way. slotsO: { wf, act }, the opacity of each lane's Slots: past the Poller, a chip fades to it, so it
// vanishes into a Worker whose Slots are hidden
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
    const laneY = laneMidY(lane, split);
    const headX = laneHeadX(dg.lanes[lane], DIAGRAM.lane.left);
    // the Poller it passes: (k mod the working Pollers), as placePollers lights it; a closed Worker shows no
    // Pollers, and its chips pass their column level with the lane, straight into the Slots
    const pollerAt = lane === 'wf' ? pollerY(DIAGRAM.wfY, f.k % nWf, nWf) : act.y(f.k % act.working);
    const route = [[headX, laneY], ...pollRoute(laneY, DIAGRAM.poller.x, lerp(pollerAt, laneY, layout.closed))];
    const slotIndex = f.flow.slots[f.k % f.flow.slots.length];
    const slot = lane === 'wf' ? wfSlotCenter(slotIndex) : slotPoint(layout, slotIndex);
    const u = t - f.leave;
    const [x, y] = flightPoint(u, route, slot);
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
  const backlogN = backlog.n ?? queue.act ?? 0;
  const readoutY = meter.top.cpu + meter.h / 2;
  setReadout(dg.backlog, withCommas(Math.floor(backlogN)), trendColor(backlog.trend));
  place(dg.backlog, readout.left.backlog + readout.w / 2, readoutY, 1, show('backlog'));
  const wait = state.wait ?? { text: '0.2 s' };
  setReadout(dg.wait, wait.text, trendColor(wait.trend));
  place(dg.wait, readout.left.wait + readout.w / 2, readoutY, 1, show('wait'));
  dg.metrics.forEach((e, i) => {
    const m = state.metrics?.[i];
    if (!m) {
      place(e, 0, 0, 1, 0);
      return;
    }
    setMetricLine(e, m.name, m.value, m.color);
    const top = meter.top.mem + i * (metric.h + GRID.gutter);
    const shown = P(t, m.at, 0.4) * (1 - P(t, m.out ?? Infinity, 0.4));
    rise(e, metric.left + metric.w / 2, top + metric.h / 2, shown, 12);
  });
  placeCpuMeter(dg.cpu, state.cpu ?? 0, state.cpuDock ?? 0, show('cpu'));
  const mem = state.mem ?? {};
  const use = mem.use ?? 0.3;
  const size = mem.gb === undefined ? '' : mem.gb + ' GB';
  setMeter(dg.mem, use, size, use >= 0.9, mem.swapAt === undefined ? 1 : swell(t, mem.swapAt, 0.25));
  place(dg.mem, meter.left + meter.w / 2, meter.top.mem + meter.h / 2, 1, show('mem'));
}
// The code card at t: inserted lines open (the lines under them slide down; the card keeps the height of all its
// lines), values swap with a swell, and one line may be highlighted
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
  const light = code.light;
  setCodeLine(card, light ? rowOf[light[0]] : 0, light ? win(t, light[1], light[2], 0.25) : 0);
  place(card, left + w / 2, top + card.h / 2, 1, o);
}
// The bottleneck markers, round the part each one names (the Activity Slots: on the diagram's grid, not a closed one)
function placeMarks(dg, t, state, layout) {
  const marks = state.marks ?? {};
  const pad = 8;
  const { slot, cache, poller } = DIAGRAM;
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
  // the CPU meter, the outline on its own border: a tile needs no room round it. Docked in the WORKER panel, the
  // gauge has no outline, which would crowd the panel's top: its tag sits on its left, and its own red shows the rest.
  const dock = state.cpuDock ?? 0;
  if (dock < 1) {
    placeMark(dg.marks.cpu, t, cpuMeterBox(dock), 'astride', marks.cpu);
  } else {
    placeMark(dg.marks.cpu, t, CPU_GAUGE, 'left', marks.cpu);
    place(dg.marks.cpu.box, 0, 0, 1, 0);
  }
}

// ---------- mini Worker (intro, outro): a WORKER panel holding a small grid of Activity Slots
// Cells GRID.cell apart, GRID.pad from the panel's edges, under a header `head` px high; placed from the panel's
// padding edge, TILE_BORDER inside its outer edge, so they rest on whole pixels
const MINI = { w: 56, h: 32, pitchX: 56 + GRID.cell, pitchY: 32 + GRID.cell, pad: GRID.pad, head: 72 };
// Size of a mini Worker panel holding cols x rows Slots
const miniWorkerSize = (cols, rows) => ({
  w: MINI.pad * 2 + (cols - 1) * MINI.pitchX + MINI.w,
  h: MINI.head + (rows - 1) * MINI.pitchY + MINI.h + MINI.pad,
});
// cols x rows Slots under the panel name; returns the panel, with w and h, its size, cells (see setSlot) and
// cellAt(i), the middle of cell i from the panel's center
function makeMiniWorker(root, name, cols, rows) {
  const { w, h } = miniWorkerSize(cols, rows);
  const panel = makeAppPanel(root, name, w, h, { font: 18 });
  Object.assign(panel, { w, h });
  panel.cellAt = i => [
    -w / 2 + MINI.pad + MINI.w / 2 + (i % cols) * MINI.pitchX,
    -h / 2 + MINI.head + MINI.h / 2 + Math.floor(i / cols) * MINI.pitchY,
  ];
  panel.cells = Array.from({ length: cols * rows }, (_, i) => {
    const cell = makeSlot(panel, MINI.w, MINI.h, { opacity: 1 });
    placeMiniCell(panel, cell, panel.cellAt(i), MINI.w, MINI.h);
    return cell;
  });
  return panel;
}
// Places a cell of a mini Worker, cw x ch px, its middle at [x, y] from the panel's center; panel.w and panel.h hold
// the panel's current size
function placeMiniCell(panel, cell, [x, y], cw, ch) {
  Object.assign(cell.style, {
    width: cw + 'px', height: ch + 'px',
    left: (panel.w / 2 + x - cw / 2 - TILE_BORDER) + 'px', top: (panel.h / 2 + y - ch / 2 - TILE_BORDER) + 'px',
  });
}
// Opacity of an app panel's header: its gear and name, and its status
function setPanelHeader(panel, o) {
  panel.firstElementChild.style.opacity = o;
  panel.st.style.opacity = o;
}

// ---------- the hard cuts: from the intro to the outro, each scene ends on the next one's first frame
// The values carried across the cuts, as each chapter starts: the scene before it ends on them. act and wf: the tasks
// waiting in the Activity and Workflow lanes; wait: SCHEDULE-TO-START, in seconds; cpu: in %; mem: the share of memory
// used; gb: the Worker's memory, in GB (raised by chapter 5: at about 600 cached Workflows per GB of heap in the
// TypeScript SDK, a cache of 500 nearly fills 1 GB). Activity counts sit half-way between whole counts, so the counts
// shown on either side of a cut agree; Workflow counts are whole, so that no chip is half-way in.
const AT_CUT = {
  ch1: { act: 45.5 },
  ch2: { act: 2800.5 },
  ch3: { wf: 6, act: 3240.5, wait: 44, cpu: 35, mem: 0.45, gb: 1 },
  ch4: { wf: 6, act: 2880.5, wait: 28, cpu: 45, mem: 0.6, gb: 1 },
  ch5: { wf: 6, act: 900.5, wait: 0.8, cpu: 80, mem: 0.8, gb: 1 },
  ch6: { wf: 4, act: 990.5, wait: 1.2, cpu: 88, mem: 0.4, gb: 4 },
};
// The task flows of a chapter that ends on a cut are done REST_LEAD s before its end: no task flies, swells or frees
// its Slot as the cut comes, so the cut and the hold of presenter mode before it fall on a still frame. Each chapter
// takes a multiple of five tasks from the Activity lane: its queued chips then show at the cut the icons the next
// chapter starts with (see placeQueueLane).
const REST_LEAD = 0.4;
// The parts that only one chapter shows (a metric line, a FIXED tag) leave LEAVE_LEAD s before its end, over 0.4 s;
// presenter mode holds just before (holdBeforeEnd)
const LEAVE_LEAD = 1.0;

// The Workflow cache of chapters 5 and 6. Chapter 5's 4 cells hold #1042 to #1045 and the open orders from
// #1046 on (firstWaiting) wait for a cell: the cache evicts the orders of the cells `evicted`, in turn, each eviction
// handing its cell to the next waiting order, then it grows to 7 cells, which take the orders after them.
const CACHE_ORDERS = { firstWaiting: 1046, evicted: [3, 1, 2, 0], from: 4 };
// The order in cache cell i once chapter 5 has evicted and grown the cache: chapter 6 starts with it
function finalCacheOrder(i) {
  const { firstWaiting, evicted, from } = CACHE_ORDERS;
  const eviction = evicted.indexOf(i);
  return firstWaiting + (eviction >= 0 ? eviction : evicted.length + i - from);
}

// The intro's queue strip and mini Worker, which chapter 1 picks up where the intro leaves them: the Worker panel on
// the frame's right edge (x 1424..1800, y 429..601), the strip a zone gap before it (x 1064..1384), its middle level
// with that of the panel's 2 rows of Slots (y 539)
const INTRO_WORKER_SIZE = miniWorkerSize(5, 2);
const INTRO_WORKER = { x: 1800 - INTRO_WORKER_SIZE.w / 2, y: 515, cols: 5, rows: 2 };
const INTRO_WORKER_TOP = INTRO_WORKER.y - INTRO_WORKER_SIZE.h / 2;
const INTRO_LANE_W = 320;
const INTRO_LANE = {
  left: 1800 - INTRO_WORKER_SIZE.w - GRID.zone - INTRO_LANE_W, w: INTRO_LANE_W, cap: 5,
  y: INTRO_WORKER_TOP + MINI.head + MINI.h / 2 + MINI.pitchY / 2,
};

// ---------- the recap table of chapter 7, and the parts of the diagram that start its rows
// Chapter 6 ends with the Activity lane and its four bottleneck components shrunk into these parts, on the table's
// rows, where chapter 7 starts: the rows then grow from them. Final stage coordinates (no shift), every size even: the
// column headings (24 px high) a label gap above 5 rows of 96 px, a gutter apart, except after the first one, the
// symptom: `split` px, which sets it apart from the four limits under it; each row's part partLeft px inside its left
// edge. With chapter 7's loop under them, the table fills the content frame from its top (y 150).
const RECAP = { left: 120, w: 1680, headTop: 150, rowH: 96, split: 28, partLeft: 32 };
RECAP.rowTop = RECAP.headTop + 24 + GRID.label;
RECAP.pitch = RECAP.rowH + GRID.gutter;
// Middle of row i: 0 is the symptom, 1 to 4 the limits
const recapRowY = i => RECAP.rowTop + RECAP.rowH / 2 + i * RECAP.pitch + (i > 0 ? RECAP.split - GRID.gutter : 0);
// The part drawn at the start of each row, w x h px, in the order of the rows: the Task Queue, then one per bottleneck
const RECAP_PART = { w: 78, h: 34 };
const RECAP_PARTS = ['queue', 'slots', 'poller', 'cache', 'cpu'];
// Middle of the part of row i
const recapPartCenter = i => [RECAP.left + RECAP.partLeft + RECAP_PART.w / 2, recapRowY(i)];
// The small parts, each drawn in its box:
// - a Task Queue: a lane track as wide as the part, 3 queued Activity Task chips in it, half the diagram's size,
//   `pitch` px apart from the head on the right
const RECAP_QUEUE = { h: 30, chip: 20, icon: 12, pitch: 24 };
function makeQueuePart(box) {
  const { h, chip, icon, pitch } = RECAP_QUEUE;
  E(box, '', '', {
    top: (RECAP_PART.h - h) / 2 + 'px', width: RECAP_PART.w + 'px', height: h + 'px',
    background: `rgba(${RGB.ink},.03)`, border: '1px solid ' + C.line, borderRadius: 'var(--rs)', opacity: 1,
  });
  const headX = RECAP_PART.w / 2 + pitch;
  for (let k = 0; k < 3; k++) {
    E(box, ICON(activityIcon(k), icon, C.ink, 1.8), '', {
      left: headX - k * pitch - chip / 2 + 'px', top: (RECAP_PART.h - chip) / 2 + 'px', width: chip + 'px',
      height: chip + 'px', background: 'var(--surface)', border: '1px solid ' + C.lineLight, borderRadius: '4px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1,
    });
  }
}
// - a full Slot grid: 3 x 2 busy Slots, 22 x 14 px, 28 and 20 px apart (see recapSlotCenter)
const RECAP_SLOT = { w: 22, h: 14, pitchX: 28, pitchY: 20 };
// Middle of Slot j of the Slot grid part, from the part's top left corner
const recapSlotCenter = j => [
  RECAP_SLOT.w / 2 + (j % 3) * RECAP_SLOT.pitchX, RECAP_SLOT.h / 2 + Math.floor(j / 3) * RECAP_SLOT.pitchY,
];
function makeSlotsPart(box) {
  for (let j = 0; j < 6; j++) {
    const [x, y] = recapSlotCenter(j);
    const slot = makeSlot(box, RECAP_SLOT.w, RECAP_SLOT.h, {
      left: x - RECAP_SLOT.w / 2 + 'px', top: y - RECAP_SLOT.h / 2 + 'px', borderRadius: '3px', opacity: 1,
    });
    Object.assign(slot.style, SLOT_LOOKS.busy);
  }
}
// - a Poller of the diagram's size, on the right, with its poll line, whose dashes flow from the queue into the Poller
//   (see showRecapPart)
const RECAP_POLLER_X = 56 + DIAGRAM.poller.size / 2;
function makePollerPart(box) {
  box.insertAdjacentHTML('beforeend',
    `<svg width="${RECAP_PART.w}" height="${RECAP_PART.h}" style="position:absolute;left:0;top:0">`
    + `<path d="M 2 17 L 52 17" stroke="${C.violet}" stroke-width="2" stroke-linecap="round"`
    + ' stroke-dasharray="5,7"/></svg>');
  box.line = box.querySelector('path');
  E(box, '', '', {
    left: RECAP_POLLER_X - DIAGRAM.poller.size / 2 + 'px', top: '6px', width: '22px', height: '22px',
    borderRadius: '50%', border: '2px solid ' + C.violet, background: 'var(--surface)', opacity: 1,
  });
}
// - a WORKFLOW CACHE cell, of the diagram's size, in the middle, holding the order of the first cell as chapter 6
//   leaves the cache
function makeCachePart(box) {
  const { w, h } = DIAGRAM.cache;
  const slot = makeSlot(box, w, h, {
    left: (RECAP_PART.w - w) / 2 + 'px', top: (RECAP_PART.h - h) / 2 + 'px', fontFamily: 'Mono', fontSize: '16px',
    borderColor: C.uv, background: `rgba(${RGB.uv},.22)`, opacity: 1,
  });
  slot.textContent = '#' + finalCacheOrder(0);
}
// - a full CPU meter: its value over a red bar
function makeCpuPart(box) {
  E(box, '100%', 'mono', {
    right: '0', left: 'auto', top: '-2px', fontSize: '16px', lineHeight: '18px', color: C.red, opacity: 1,
  });
  E(box, '', '', {
    top: '20px', width: RECAP_PART.w + 'px', height: '14px', borderRadius: '3px', background: C.red, opacity: 1,
  });
}
const RECAP_PART_MAKERS = {
  queue: makeQueuePart, slots: makeSlotsPart, poller: makePollerPart, cache: makeCachePart, cpu: makeCpuPart,
};
// The part of row i, hidden until showRecapPart shows it
function makeRecapPart(root, i) {
  const box = E(root, '', '', { width: RECAP_PART.w + 'px', height: RECAP_PART.h + 'px' });
  RECAP_PART_MAKERS[RECAP_PARTS[i]](box);
  return box;
}
// Shows the part of row i at its place, moved dx, dy px (whole pixels) and scaled by s, with opacity o
function showRecapPart(box, i, o, { dx = 0, dy = 0, s = 1 } = {}) {
  const [x, y] = recapPartCenter(i);
  showAt(box, x - RECAP_PART.w / 2 + dx, y - RECAP_PART.h / 2 + dy, o);
  box.style.transform = s === 1 ? '' : `scale(${s})`;
  // the Poller's poll line flows on the ambient clock, as in the diagram (see draw())
  if (box.line) box.line.setAttribute('stroke-dashoffset', -G * 40);
}

// ---------- the outro's mini Worker, above the end card
// 4 x 2 Slots, busy with the five steps of an order and a few free: a Worker that keeps up. The outro's shift moves it
// down, with the end card; chapter 7 ends with its Slot grid part grown into it, at the same place.
const OUTRO_SHIFT = [0, 80];
const OUTRO_WORKER = { x: 960, y: 238, cols: 4, rows: 2, free: [3, 6] };
function makeOutroWorker(root) {
  return makeMiniWorker(root, 'WORKER', OUTRO_WORKER.cols, OUTRO_WORKER.rows);
}
// Its status and Slots, on every frame: its gear turns on the ambient clock
function setOutroWorker(panel) {
  setAppStatus(panel, '', 'running');
  panel.cells.forEach((cell, i) => setSlot(cell, OUTRO_WORKER.free.includes(i) ? 'free' : 'busy', activityIcon(i)));
}
