// ===================== 1. THE BACKLOG GROWS
// Starts on the intro's last frame (a hard cut): its queue strip glides left and widens into the "orders" lane as the
// TEMPORAL panel fades in around it, and its small WORKER glides and grows into the WORKER A panel, its 10 busy Slots
// becoming the closed Worker's grid, centered in the panel under its ACTIVITY SLOTS label. Black Friday: the ORDERS /
// MIN readout climbs tenfold and task chips stream into the queue faster than the Worker takes them: each one lands
// in a Slot as it frees up. The queue overflows, BACKLOG and SCHEDULE-TO-START climb in red, and two metric lines
// under them read the same values: temporal_cloud_v1_approximate_backlog_count and
// temporal_activity_schedule_to_start_latency. A dashed "+ WORKER" ghost is crossed out, and a WHAT IS FULL? tag lands
// on the Worker, above its Slots. Last, ORDERS / MIN, the metric lines, the ghost and the tag fade out: chapter 2
// starts on this scene's last frame (another hard cut).
// The block keeps every name declared in this file local to this scene.
{
  // the intro's strip and mini Worker glide into the diagram from MORPH.at, over MORPH.d s; then the diagram's own
  // lane, panel and Slots, identical to them by then, take over
  const MORPH = { at: 0.1, d: 1.3 };
  const HANDOFF = MORPH.at + MORPH.d;
  // where the intro leaves its mini Worker
  const { w: MINI_W, h: MINI_H } = miniWorkerSize(INTRO_WORKER.cols, INTRO_WORKER.rows);
  const MINI_FROM = { left: INTRO_WORKER.x - MINI_W / 2, top: INTRO_WORKER.y - MINI_H / 2, w: MINI_W, h: MINI_H };
  // ORDERS / MIN: a readout like BACKLOG, in the meter column under the Worker; its x10 tag (72 x 40) astride its
  // top right corner, centered between the end of its label (x 1023) and the "+ WORKER" ghost (x 1120), about 12 px
  // from each, and 20 px under the WORKER panel
  const { meter } = DIAGRAM;
  const ORDERS = { left: meter.left, top: meter.top.cpu, w: meter.w, h: meter.h };
  const TIMES10 = { x: 1072, y: ORDERS.top, w: 72 };
  // WHAT IS FULL? (66 px high): the Slots move down DROP px to make room for it, 20 px above their label, so the tag,
  // the label and the grid (y 274..469) stay centered as a group in the Worker panel
  const DROP = 43;
  const WHAT_X = DIAGRAM.worker.left + DIAGRAM.worker.w / 2, WHAT_Y = 307;
  // the extras (ORDERS / MIN, the metric lines, the ghost, WHAT IS FULL?) fade out OUT_LEAD s before the end, so the
  // scene ends on the frame chapter 2 starts from
  const OUT_LEAD = 1.6;
  // the arrivals: RATE tasks a second from the cut on, a SURGE once the queue overflows (c[1])
  const RATE = 8, SURGE = 2300;

  // The intro's mini Worker at morph progress m: its panel grows from the intro's place into the WORKER A panel, its
  // header fades out early, and its Slots move into the closed Worker's grid, growing to the diagram's Slot size
  const placeMorphingWorker = (mini, m) => {
    const { worker, slot } = DIAGRAM;
    const left = lerp(MINI_FROM.left, worker.left, m), top = lerp(MINI_FROM.top, worker.top, m);
    mini.w = lerp(MINI_FROM.w, worker.w, m);
    mini.h = lerp(MINI_FROM.h, worker.h, m);
    Object.assign(mini.style, { width: mini.w + 'px', height: mini.h + 'px' });
    place(mini, left + mini.w / 2, top + mini.h / 2, 1, 1);
    const center = [worker.left + worker.w / 2, worker.top + worker.h / 2];
    mini.cells.forEach((cell, i) => {
      const [fromX, fromY] = mini.cellAt(i);
      const [toX, toY] = closedSlotCenter(i, 0);
      const at = [lerp(fromX, toX - center[0], m), lerp(fromY, toY - center[1], m)];
      placeMiniCell(mini, cell, at, lerp(MINI.w, slot.w, m), lerp(MINI.h, slot.h, m));
    });
  };

  scene({
    chapter: 1, title: 'The backlog grows',
    pre: 1.5, post: 2.0,
    // hard cuts on both ends: the intro ends on this scene's first frame, chapter 2 starts on its last one
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds with WHAT IS FULL? on screen, then plays the extras' fade-out and the cut in one go
    holdBeforeEnd: OUT_LEAD + 0.1,
    subs: [
      {
        text: "Black Friday: the shop gets ten times more orders than usual, and every order is a Temporal Workflow.",
        after: 1.2,
      },
      {
        text: "Tasks pile up in the <b>Task Queue</b>: the <b>backlog</b> grows, and each order waits longer to start.",
        after: 2.0,
      },
      { text: "The first reflex is to add more Workers. Before that, find out what is actually full.", after: 2.0 },
    ],
    build(root, s) {
      s.dg = makeWorkerDiagram(root);
      // the intro's strip and mini Worker, until the diagram takes over (the lane holds up to the diagram's 11 chips)
      s.lane = makeQueueLane(root, null, 'act');
      s.mini = makeMiniWorker(root, 'WORKER', INTRO_WORKER.cols, INTRO_WORKER.rows);
      s.orders = makeReadout(root, 'Orders / min', ORDERS.w, ORDERS.h);
      s.times10 = fixedTag(root, '&times;10', 'violet solid', TIMES10.w);
      // 29 + 2 x 4 + 3 = 40 px high, with less padding than a pill: it stands on the readout's edge
      Object.assign(s.times10.style, { lineHeight: '29px', padding: '4px 12px 4px calc(12px + .1em)' });
      s.ghost = makeGhost(root, '+ WORKER', 110);
      s.what = fixedTag(root, `${ICON('search', 26, C.violet, 2)}What is full?`, 'violet solid big', null, { gap: 14 });
    },
    update(t, c, s) {
      const outAt = this.dur - OUT_LEAD;
      // c[0]: the orders climb tenfold, and tasks stream in faster than the Worker takes them (one every 0.9 s):
      // every Slot is busy, and each task waits for one to free up, just before it leaves the queue. The steady icons
      // of the busy Slots match those of the tasks landing in them (see steadySlotIcon); the last task lands before
      // the extras fade out, so every Slot is busy at the cut, as chapter 2 starts. 25 tasks, a multiple of the five
      // Activities, so the queued chips show the icons chapter 2 starts with.
      const rush = c[0] + 0.9;
      const flow = { lane: 'act', from: c[0] + 1.2, every: 0.9, count: 25, freeAhead: 1.0, slots: [0, 3, 6, 9, 2] };
      // the queue starts from the intro's count; c[1]: it overflows, thousands of tasks wait; c[2]: it keeps growing,
      // up to the count chapter 2 starts from at the end
      const departed = flowDeparted(flow, t);
      const settled = AT_CUT.ch1.act + RATE * this.dur - flow.count + SURGE;
      const queue = AT_CUT.ch1.act + RATE * t - departed + SURGE * P(t, c[1] + 0.4, 4.0, easeIn)
        + (AT_CUT.ch2.act - settled) * P(t, c[2], this.dur - c[2], linear);
      const wait = 0.2 + 37.8 * P(t, c[1] + 0.4, 4.0, easeIn) + 6 * P(t, c[2], 6.0, linear);
      const growing = t >= c[1] + 0.4;
      const trend = growing ? 'up' : null;

      // the morph: the intro's strip and mini Worker glide into place, then the diagram's own parts take over
      const m = P(t, MORPH.at, MORPH.d);
      const morphing = t < HANDOFF;
      resizeLane(s.lane, lerp(INTRO_LANE.w, DIAGRAM.lane.w, m), lerp(INTRO_LANE.cap, DIAGRAM.lane.cap, m));
      const laneLeft = lerp(INTRO_LANE.left, DIAGRAM.lane.left, m), laneY = lerp(INTRO_LANE.y, DIAGRAM.midY, m);
      placeQueueLane(s.lane, laneLeft, laneY, morphing ? 1 : 0, { queue });
      placeMorphingWorker(s.mini, m);
      s.mini.style.opacity = morphing ? 1 : 0;
      s.mini.style.visibility = morphing ? 'visible' : 'hidden';
      setAppStatus(s.mini, 'BUSY', 'running');
      setPanelHeader(s.mini, 1 - P(t, MORPH.at, 0.4));
      s.mini.cells.forEach((cell, i) => setSlot(cell, 'busy', steadySlotIcon(i)));

      const whatIn = P(t, c[2] + 3.2, 0.5) * (1 - P(t, outAt + 0.1, 0.5));
      const after = morphing ? 0 : 1;
      placeWorkerDiagram(s.dg, t, {
        show: {
          temporal: P(t, 0.7, 0.7), lanes: after, worker: after, slots: after, slotsLabel: P(t, HANDOFF + 0.1, 0.4),
          pollers: 0, wfSlots: 0, cache: 0,
          backlog: P(t, HANDOFF + 0.2, 0.5), wait: P(t, HANDOFF + 0.3, 0.5), cpu: 0, mem: 0, code: 0,
        },
        split: 0,
        queue: { act: Math.max(0, queue) },
        flows: [flow],
        slots: { busy: 10, closed: 1, drop: Math.round(DROP * whatIn) },
        backlog: { trend },
        wait: { text: formatWait(wait), trend },
        // c[1]: the metrics behind the two readouts, as the backlog starts to grow; chapter 2 shows none
        metrics: [
          {
            name: 'temporal_cloud_v1_approximate_backlog_count', value: withCommas(Math.floor(Math.max(0, queue))),
            color: trendColor(trend), at: c[1] + 0.6, out: outAt,
          },
          {
            name: 'temporal_activity_schedule_to_start_latency', value: formatWait(wait),
            color: trendColor(trend), at: c[1] + 1.0, out: outAt,
          },
        ],
        status: ['BUSY', 'running'],
      });
      setPanelHeader(s.dg.worker, P(t, HANDOFF, 0.4));

      const extras = 1 - P(t, outAt, 0.4);
      const orders = lerp(120, 1200, P(t, rush, 3.0));
      setReadout(s.orders, withCommas(orders), C.ink, swell(t, rush + 3.0, 0.08));
      place(s.orders, ORDERS.left + ORDERS.w / 2, ORDERS.top + ORDERS.h / 2, 1, P(t, c[0] + 0.3, 0.5) * extras);
      const x10 = popIn(t, rush + 3.0);
      place(s.times10, TIMES10.x, TIMES10.y, x10.s, x10.o * extras);

      // c[2]: "+ WORKER" rises, is struck through once "add more Workers" is read, then WHAT IS FULL? lands as the
      // Slots make room for it
      const ghostIn = P(t, c[2] + 0.4, 0.5);
      placeGhost(s.ghost, t, ghostIn, ghostIn * extras, c[2] + 2.7, extras);
      const what = backPop(t, c[2] + 3.4);
      fitTag(s.what);
      place(s.what, WHAT_X, WHAT_Y, what.s, what.o * extras);
    },
  });
}
