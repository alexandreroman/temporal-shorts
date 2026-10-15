// ===================== 2. HOW A WORKER TAKES WORK
// The Worker diagram builds up piece by piece. The "orders" lane splits into Workflow Tasks and Activity Tasks; the
// WORKER panel fills in: Pollers with their poll lines, the Workflow Slots and the 10 Activity Slots. One task jumps
// from the queue through a Poller into a free Slot, then the other Slots fill, the CPU and MEMORY meters rise with
// them and the poll lines stop once no Slot is free. Last, the WORKFLOW CACHE fills with orders, and two Workflow
// Tasks hit cached orders, which flash.
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 2, title: 'How a Worker takes work',
    pre: 1.5, post: 2.0,
    subs: [
      {
        text: "Workflow Tasks and Activity Tasks wait in two separate queues, even under one Task Queue name.",
        after: 1.5,
      },
      {
        text: "A <b>Poller</b> in the Worker asks a queue for a task, but only while a <b>Slot</b> is free.",
        after: 2.0,
      },
      {
        text: "A Slot is the permission to run one task. The task itself uses the Worker's CPU and memory.",
        after: 2.0,
      },
      {
        text: "The <b>Workflow cache</b> keeps Workflows in memory, so their next task skips replaying the history.",
        after: 2.0,
      },
    ],
    build(root, s) {
      s.dg = makeWorkerDiagram(root);
    },
    update(t, c, s) {
      // c[1]: one task jumps into the first free Slot; c[2]: the 9 others fill; c[3]: two Workflow Tasks, each
      // hitting a cached order
      const first = { lane: 'act', from: c[1] + 2.6, every: 1, count: 1, slots: [SLOT_ORDER[0]] };
      const fill = { lane: 'act', from: c[2] + 0.8, every: 0.35, count: 9, slots: freeSlots(10, 1) };
      const workflows = { lane: 'wf', from: c[3] + 2.4, every: 1.4, count: 2, hold: 1.0, slots: [0, 1] };
      const hits = [[1, flowLandAt(workflows, 0)], [3, flowLandAt(workflows, 1)]];
      // the CPU and the memory follow the busy Slots; the cache adds a little memory as it fills
      const busy = flowLanded(first, t) + flowLanded(fill, t);
      const cacheFillAt = c[3] + 0.7;
      const cached = P(t, cacheFillAt, 1.2, linear);
      placeWorkerDiagram(s.dg, t, {
        show: {
          temporal: P(t, 0.2, 0.5), lanes: P(t, 0.4, 0.5), worker: P(t, 0.3, 0.5),
          pollers: P(t, c[1] + 0.4, 0.5), slots: P(t, c[1] + 0.8, 0.5), wfSlots: P(t, c[1] + 0.8, 0.5),
          cpu: P(t, c[2] + 0.3, 0.5), mem: P(t, c[2] + 0.4, 0.5), cache: P(t, c[3] + 0.3, 0.5), code: 0,
        },
        split: P(t, c[0] + 0.9, 0.9),
        queue: { wf: 6, act: 2800 + 12 * t },
        flows: [first, fill, workflows],
        cache: { cells: 4, filledAt: [cacheFillAt, 0.3], hits },
        cpu: 2 + 3.3 * busy,
        mem: { use: 0.12 + 0.025 * busy + 0.08 * cached },
        backlog: { trend: 'up' },
        wait: { text: '44 s', trend: 'up' },
      });
    },
  });
}
