// ===================== 3. EVERY SLOT IS BUSY
// Starts on chapter 2's last frame (a hard cut): the 10 Activity Slots busy, the queues long, the CPU at 35%. The
// code card rises in and shows the normal-days settings, the Slot limit (maxConcurrentActivityTaskExecutions: 10) and
// the cache size (maxCachedWorkflows: 500), and the Slot limit line lights. The Slot grid gets a red outline and a
// BOTTLENECK tag, and a temporal_worker_task_slots_available metric line reads 0. The limit goes from 10 to 50: the
// grid grows to 5 rows, tasks stream into the new Slots, the tag turns FIXED and the backlog falls. Last, the Slots
// start to empty while only a trickle of tasks comes through the Pollers, and the queue grows again. Chapter 4
// starts on this chapter's last frame (another hard cut).
// The block keeps every name declared in this file local to this scene.
{
  const SLOTS = 50;
  // tasks that stream into the new Slots, 10 + 35 = 45 busy in the end; a multiple of the five order steps, so the
  // queued chips keep their icons when the flow gives way to a steady count (see update)
  const FILL = 35;
  const FILL_TARGETS = freeSlots(SLOTS, 10).slice(0, FILL);
  // the Slots drain to 25 busy, where chapter 4 starts; a trickle of tasks visits the 5 Slots that no fill reached, one
  // every TRICKLE.every s, each one holding its Slot TRICKLE.hold s
  const DRAINED = 25;
  const TRICKLE_TARGETS = SLOT_ORDER.slice(10 + FILL);
  const TRICKLE = { count: 5, every: 1.4, hold: 2.0 };
  // the CPU and the memory follow the busy Slots: chapter 2's values with 10 busy, chapter 4's with 25
  const cpuOf = busy => lerp(AT_CUT.ch3.cpu, AT_CUT.ch4.cpu, (busy - 10) / (DRAINED - 10));
  const memOf = busy => lerp(AT_CUT.ch3.mem, AT_CUT.ch4.mem, (busy - 10) / (DRAINED - 10));

  scene({
    chapter: 3, title: 'Every Slot is busy',
    pre: 1.5, post: 2.0,
    // hard cuts on both ends: chapter 2 ends on this chapter's first frame, chapter 4 starts on its last one
    fadeIn: 0, fadeOut: 0,
    subs: [
      {
        text: "The Worker is set for normal days: 10 Activity Slots. All 10 are busy, and the CPU sits at 35%.",
        after: 1.5,
      },
      {
        text: "Tasks wait for a Slot, not for the machine: the Slots available metric stays at zero.",
        after: 2.0,
      },
      { text: "Raise the limit from 10 to 50 Slots, and five times more tasks run at once.", after: 3.0 },
      {
        text: "Throughput climbs, yet the backlog grows again. Something else is the limit now.",
        after: 2.0,
      },
    ],
    build(root, s) {
      s.dg = makeWorkerDiagram(root);
    },
    update(t, c, s) {
      // c[2]: 10 becomes 50 as it is read, the grid grows, then 35 tasks stream into the new Slots
      const swapAt = c[2] + 1.6;
      const growAt = c[2] + 1.9;
      const fill = {
        lane: 'act', from: growAt + 1.0, every: 0.1, count: FILL, slots: FILL_TARGETS,
        icon: k => steadySlotIcon(FILL_TARGETS[k]),
      };
      // c[3]: the fill gives way to 45 steadily busy Slots, which drain while a trickle of tasks comes in, the last
      // one done REST_LEAD s before the end; 5 tasks, a multiple of the five order steps (see REST_LEAD)
      const draining = t >= c[3];
      const trickle = {
        lane: 'act', every: TRICKLE.every, count: TRICKLE.count, hold: TRICKLE.hold, slots: TRICKLE_TARGETS,
        from: this.dur - REST_LEAD - FLIGHT.land - TRICKLE.hold - (TRICKLE.count - 1) * TRICKLE.every,
      };
      const steady = draining ? Math.round(lerp(10 + FILL, DRAINED, P(t, c[3] + 1.0, 3.5, linear))) : 10;
      const busy = steady + (draining ? flowHolding(trickle, t) : flowHolding(fill, t));
      const slotCount = t < growAt ? 10 : SLOTS;
      const available = slotCount - busy;

      // the queue grows from the count chapter 2 leaves, falls while the new Slots fill, then grows again, up to the
      // count chapter 4 starts from; the wait follows
      const start = AT_CUT.ch3, next = AT_CUT.ch4;
      const regrowFrom = c[3] + 0.8;
      const relieved = time => start.act + 12 * time - 1500 * P(time, fill.from, 3.6);
      const regrowth = P(t, regrowFrom, this.dur - regrowFrom, linear);
      const act = relieved(t) + (next.act - relieved(this.dur)) * regrowth;
      const wait = lerp(start.wait - 32 * P(t, fill.from, 3.6), next.wait, regrowth);
      const trend = t < fill.from || t >= regrowFrom ? 'up' : 'down';
      placeWorkerDiagram(s.dg, t, {
        show: { code: P(t, c[0] + 0.3, 0.5) },
        queue: { wf: start.wf, act },
        flows: draining ? [trickle] : [fill],
        slots: { n: slotCount, grow: { from: 10, at: growAt }, busy: steady },
        cpu: cpuOf(busy),
        mem: { use: memOf(busy) },
        backlog: { trend },
        wait: { text: formatWait(wait), trend },
        metrics: [
          {
            name: 'temporal_worker_task_slots_available', value: String(available),
            color: available === 0 ? C.red : C.ink, at: c[1] + 2.6,
          },
        ],
        code: {
          swap: { slots: ['50', swapAt] },
          light: t < c[2] ? ['slots', c[0] + 2.0, c[0] + 5.5] : ['slots', c[2] + 0.4, c[2] + 3.4],
        },
        marks: { slots: { at: c[1] + 0.4, fixedAt: fill.from + 1.7, out: c[3] + 1.0 } },
      });
    },
  });
}
