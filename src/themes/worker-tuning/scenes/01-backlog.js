// ===================== 1. THE BACKLOG GROWS
// The Worker diagram, closed: the TEMPORAL panel holds the "orders" Task Queue as one lane, the WORKER panel only its
// 10 Activity Slots, all busy. Black Friday: the ORDERS / MIN readout climbs tenfold and task chips stream into the
// queue faster than the Worker takes them: each one lands in a Slot as it frees up. The queue overflows, BACKLOG and SCHEDULE-TO-START climb in red. A dashed "+ WORKER" ghost
// is crossed out, and a WHAT IS FULL? tag lands on the Worker, above its Slots.
// The block keeps every name declared in this file local to this scene.
{
  // ORDERS / MIN: a readout like BACKLOG, under the Worker; its x10 tag astride its top right corner
  const ORDERS = { left: DIAGRAM.worker.left, top: DIAGRAM.readout.top, w: DIAGRAM.readout.w, h: DIAGRAM.readout.h };
  // the "+ WORKER" ghost: a dashed panel right of ORDERS / MIN, 40 px away, its label struck through
  const GHOST = { left: 1180, top: DIAGRAM.readout.top, w: 620, h: 264, label: 30 };
  const GHOST_X = GHOST.left + GHOST.w / 2, GHOST_Y = GHOST.top + GHOST.h / 2;
  // WHAT IS FULL?: centered on the Worker panel, and between its header (bottom y 201) and the ACTIVITY SLOTS label
  // (top y 404), some 68 px clear of each
  const WHAT_X = DIAGRAM.worker.left + DIAGRAM.worker.w / 2, WHAT_Y = 302;

  scene({
    chapter: 1, title: 'The backlog grows',
    pre: 1.5, post: 2.0,
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
      s.orders = makeReadout(root, 'Orders / min', ORDERS.w, ORDERS.h);
      s.times10 = fixedTag(root, '&times;10', 'violet solid', 84);
      s.ghost = E(root,
        `<div class="mono" style="font-size:${GHOST.label}px;letter-spacing:.1em;padding-left:.1em;color:var(--slate)">`
        + '+ WORKER</div>',
        '', {
          width: GHOST.w + 'px', height: GHOST.h + 'px', border: '2px dashed ' + C.lineLight, borderRadius: 'var(--r)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        });
      s.svg = svgLayer(root);
      s.strike = path(s.svg, `M ${GHOST_X - 110} ${GHOST_Y} L ${GHOST_X + 110} ${GHOST_Y}`, C.red, 4, false);
      s.what = tag(root, `${ICON('search', 26, C.violet, 2)}What is full?`, 'violet solid big');
      // whole-pixel width (measured: 370 px), so the centered tag rests on whole pixels
      Object.assign(s.what.style, {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', width: '370px',
      });
    },
    update(t, c, s) {
      // c[0]: the orders climb tenfold, and tasks stream in (2.4 a second) faster than the Worker takes them (one
      // every 0.9 s): every Slot is busy, and each task waits for one to free up, just before it leaves the queue.
      // The steady icons of the busy Slots match those of the tasks landing in them (see steadySlotIcon); the last
      // task lands before the scene fades out, so every Slot is busy at the cut, as chapter 2 starts.
      const rush = c[0] + 0.9;
      const flow = { lane: 'act', from: c[0] + 1.2, every: 0.9, count: 28, freeAhead: 1.0, slots: [0, 3, 6, 9, 2] };
      // c[1]: the queue overflows: thousands of tasks wait; c[2]: it keeps growing
      const waiting = 4 + 2.4 * Math.max(0, t - rush) + 2370 * P(t, c[1] + 0.4, 4.0, easeIn)
        + 400 * P(t, c[2], 6.0, linear);
      const departed = flowDeparted(flow, t);
      const wait = 0.2 + 37.8 * P(t, c[1] + 0.4, 4.0, easeIn) + 6 * P(t, c[2], 6.0, linear);
      const growing = t >= c[1] + 0.4;
      const worker = P(t, 0.3, 0.5);
      placeWorkerDiagram(s.dg, t, {
        show: {
          temporal: P(t, 0.2, 0.5), lanes: P(t, 0.5, 0.5), worker, slots: worker,
          pollers: 0, wfSlots: 0, cache: 0,
          backlog: P(t, 0.7, 0.5), wait: P(t, 0.8, 0.5), cpu: 0, mem: 0, code: 0,
        },
        split: 0,
        queue: { act: Math.max(0, waiting - departed) },
        flows: [flow],
        slots: { busy: 10 },
        backlog: { trend: growing ? 'up' : null },
        wait: { text: formatWait(wait), trend: growing ? 'up' : null },
        status: ['BUSY', 'running'],
      });

      const orders = lerp(120, 1200, P(t, rush, 3.0));
      setReadout(s.orders, withCommas(orders), C.ink, swell(t, rush + 3.0, 0.08));
      place(s.orders, ORDERS.left + ORDERS.w / 2, ORDERS.top + ORDERS.h / 2, 1, P(t, c[0] + 0.3, 0.5));
      const x10 = popIn(t, rush + 3.0);
      place(s.times10, ORDERS.left + ORDERS.w - 52, ORDERS.top, x10.s, x10.o);

      // c[2]: "+ WORKER" rises, is struck through once "add more Workers" is read, then WHAT IS FULL? lands
      const strikeAt = c[2] + 2.7;
      rise(s.ghost, GHOST_X, GHOST_Y, P(t, c[2] + 0.4, 0.5));
      s.ghost.style.borderColor = t >= strikeAt ? C.red : C.lineLight;
      draw(s.strike, P(t, strikeAt, 0.35, easeOut));
      const what = backPop(t, c[2] + 3.4);
      place(s.what, WHAT_X, WHAT_Y, what.s, what.o);
    },
  });
}
