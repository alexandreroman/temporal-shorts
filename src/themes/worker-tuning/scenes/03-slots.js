// ===================== 3. EVERY SLOT IS BUSY
// The Worker diagram as chapter 2 leaves it: the 10 Activity Slots busy, the queues long, the CPU at 35%. The code
// card shows the Slot limit, maxConcurrentActivityTaskExecutions: 10, and its line lights. The Slot grid gets a red
// outline and a BOTTLENECK tag, and a temporal_worker_task_slots_available metric line reads 0. The limit goes from
// 10 to 50: the grid grows to 5 rows, tasks stream into the new Slots, the tag turns FIXED and the backlog falls.
// Last, the Slots start to empty while only a trickle of tasks comes through the Pollers, and the queue grows again.
// The block keeps every name declared in this file local to this scene.
{
  const SLOTS = 50;
  // tasks that stream into the new Slots, 10 + 35 = 45 busy in the end; a multiple of the five order steps, so the
  // queued chips keep their icons when the flow gives way to a steady count (see update)
  const FILL = 35;
  const FILL_TARGETS = freeSlots(SLOTS, 10).slice(0, FILL);
  // the Slots drain to 25 busy, where chapter 4 starts; a trickle of tasks visits the 5 Slots that no fill reached
  const DRAINED = 25;
  const TRICKLE_TARGETS = SLOT_ORDER.slice(10 + FILL);
  // the CPU and the memory follow the busy Slots: 35% and 45% with 10 busy (chapter 2), 45% and 60% with 25
  const cpuOf = busy => lerp(35, 58, (busy - 10) / 35);
  const memOf = busy => lerp(0.45, 0.8, (busy - 10) / 35);

  scene({
    chapter: 3, title: 'Every Slot is busy',
    pre: 1.5, post: 2.0,
    subs: [
      {
        text: "The Worker was set for normal days: 10 Activity Slots. All 10 are busy, and the CPU sits at 35%.",
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
      // c[3]: the fill gives way to 45 steadily busy Slots, which drain while a task comes in every 1.6 s
      const draining = t >= c[3];
      const trickle = { lane: 'act', from: c[3] + 0.6, every: 1.6, count: 10, hold: 2.4, slots: TRICKLE_TARGETS };
      const steady = draining ? Math.round(lerp(10 + FILL, DRAINED, P(t, c[3] + 1.0, 3.5, linear))) : 10;
      const busy = steady + (draining ? flowHolding(trickle, t) : flowHolding(fill, t));
      const slotCount = t < growAt ? 10 : SLOTS;
      const available = slotCount - busy;

      // the queue grows, falls while the new Slots fill, then grows again
      const relief = P(t, fill.from, 3.6);
      const regrowth = P(t, c[3] + 0.8, 7.0, linear);
      const act = 3240 + 12 * t - 1500 * relief + 700 * regrowth;
      const wait = 44 - 32 * relief + 16 * regrowth;
      const trend = t < fill.from || t >= c[3] + 0.8 ? 'up' : 'down';
      placeWorkerDiagram(s.dg, t, {
        show: { code: P(t, c[0] + 0.3, 0.5) },
        queue: { wf: 6, act },
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
