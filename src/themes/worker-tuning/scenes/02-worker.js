// ===================== 2. HOW A WORKER TAKES WORK
// Starts on chapter 1's last frame (a hard cut): the closed Worker, its 10 busy Activity Slots centered in the panel.
// The Worker opens up: as the "orders" lane splits into Workflow Tasks and Activity Tasks, the Slot grid moves into one
// row, level with the Activity lane, and the Worker's status turns from BUSY to RUNNING. The WORKER panel fills in: the
// Pollers, the Workflow Slots, while the Activity Slots light up. One Slot frees up: its poll lines pulse, a task jumps
// from the queue through a Poller into it, and the poll lines stop, no Slot being free. The CPU and MEMORY meters show
// up, and the other Slots free up and take a task in turn. Last, the WORKFLOW CACHE fills with orders, and two Workflow
// Tasks hit cached orders, which flash. Chapter 3 starts on this chapter's last frame (another hard cut).
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 2, title: 'How a Worker takes work',
    pre: 1.5, post: 2.0,
    // hard cuts on both ends: chapter 1 ends on this chapter's first frame, chapter 3 starts on its last one
    fadeIn: 0, fadeOut: 0,
    subs: [
      {
        text: "<b>Workflow Tasks</b> and <b>Activity Tasks</b> wait in two separate queues, "
          + "even under one Task Queue name.",
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
      // every Activity Slot is busy, as chapter 1 leaves them; c[1]: the first Slot frees up, and a task jumps into it;
      // c[2]: the 9 others free up and take a task in turn; c[3]: two Workflow Tasks, each hitting a cached order.
      // The steady icons of the busy Slots match those of the tasks landing in them (see steadySlotIcon).
      const first = { lane: 'act', from: c[1] + 2.6, every: 1, count: 1, freeAhead: 1.3, slots: [SLOT_ORDER[0]] };
      const fill = {
        lane: 'act', from: c[2] + 0.8, every: 0.35, count: 9, freeAhead: 0.5, slots: freeSlots(10, 1),
      };
      const workflows = { lane: 'wf', from: c[3] + 2.4, every: 1.4, count: 2, hold: 1.0, slots: [0, 1] };
      const hits = [[1, flowLandAt(workflows, 0)], [3, flowLandAt(workflows, 1)]];
      // the CPU and the memory follow the busy Slots, up to the values chapter 3 starts from with all 10 busy; the
      // cache adds a little memory as it fills
      const busy = 10 - freeingSlots([first, fill], t).length;
      const cacheFillAt = c[3] + 0.7;
      const cached = P(t, cacheFillAt, 1.2, linear);
      const next = AT_CUT.ch3;
      // c[0]: the Worker opens up as the lane splits, its status turning from BUSY to RUNNING (a quick fade) as the
      // Slots start moving
      const openAt = c[0] + 0.9;
      const open = P(t, openAt, 0.9);
      const running = t >= openAt;
      placeWorkerDiagram(s.dg, t, {
        show: {
          pollers: P(t, c[1] + 0.4, 0.5), wfSlots: P(t, c[1] + 0.8, 0.5),
          cpu: P(t, c[2] + 0.3, 0.5), mem: P(t, c[2] + 0.4, 0.5), cache: P(t, c[3] + 0.3, 0.5), code: 0,
        },
        split: open,
        // the Workflow lane fills as it opens; the Activity lane grows from the count chapter 1 leaves to the one
        // chapter 3 starts from
        queue: { wf: next.wf * open, act: lerp(AT_CUT.ch2.act, next.act, t / this.dur) },
        flows: [first, fill, workflows],
        slots: { busy: 10, glow: c[1] + 0.8, closed: 1 - open },
        cache: { cells: 4, filledAt: [cacheFillAt, 0.3], hits },
        cpu: lerp(2, next.cpu, busy / 10),
        mem: { use: next.mem - 0.025 * (10 - busy) - 0.08 * (1 - cached) },
        backlog: { trend: 'up' },
        // as chapter 1 leaves it
        wait: { text: formatWait(next.wait), trend: 'up' },
        status: running ? ['RUNNING', 'running'] : ['BUSY', 'running'],
      });
      s.dg.worker.st.style.opacity = running ? P(t, openAt, 0.25) : 1 - P(t, openAt - 0.25, 0.25);
    },
  });
}
