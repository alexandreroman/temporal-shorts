// ===================== 4. THE POLLERS CAN'T KEEP UP
// The Worker diagram as chapter 3 leaves it: 50 Activity Slots, half of them free, the CPU at 45%, the queue growing.
// The two Activity Pollers bring in one task every 1.6 s while their poll lines keep pulsing. A
// temporal_activity_schedule_to_start_latency metric line climbs in red under the Slots available one, and the Pollers
// get a red outline and a BOTTLENECK tag. The code card gains activityTaskPollerBehavior: { type: 'autoscaling' }:
// the column grows to 5 Pollers, tasks stream through them into the free Slots, the tag turns FIXED, the backlog and
// the wait fall. Last, the Slots fill and the CPU climbs to 80%.
// The block keeps every name declared in this file local to this scene.
{
  const SLOTS = 50;
  // 25 Slots steadily busy, as chapter 3 ends; the stream fills 19 of the free ones, 44 busy in the end
  const BUSY = 25;
  const STREAM = 19;
  const STREAM_TARGETS = freeSlots(SLOTS, BUSY).slice(0, STREAM);
  // the trickle before the Pollers scale visits the 6 Slots that the stream leaves free
  const TRICKLE_TARGETS = SLOT_ORDER.slice(BUSY + STREAM);
  // the CPU and the memory follow the busy Slots: 45% and 60% with 25 busy, 80% and 80% with 44
  const cpuOf = busy => lerp(45, 80, (busy - BUSY) / STREAM);
  const memOf = busy => lerp(0.6, 0.8, (busy - BUSY) / STREAM);

  scene({
    chapter: 4, title: "The Pollers can't keep up",
    pre: 1.5, post: 2.0,
    subs: [
      {
        text: "Now Slots sit free while the queue still grows, and the CPU has room to spare.",
        after: 1.5,
      },
      {
        text: "Tasks wait a long time before they start: the Pollers can't fetch them fast enough.",
        after: 2.0,
      },
      {
        text: "Turn on <b>Poller Autoscaling</b>: the Worker adds Pollers when tasks wait and removes them when idle.",
        after: 1.0,
      },
      { text: "Tasks reach the free Slots again, and the CPU starts to climb.", after: 2.0 },
    ],
    build(root, s) {
      s.dg = makeWorkerDiagram(root);
    },
    update(t, c, s) {
      // c[2]: the line goes in, then the Pollers grow from 2 to 5 as "adds Pollers" is read, and tasks stream through
      // them into the free Slots, one every 0.45 s, well into c[3]
      const insertAt = c[2] + 0.5;
      const growAt = c[2] + 2.4;
      const streamFrom = growAt + 0.6;
      // until then, a task every 1.6 s, each one done 2.4 s after it lands
      const trickle = {
        lane: 'act', from: 0.6, every: 1.6, count: Math.floor((growAt - 0.6) / 1.6), hold: 2.4,
        slots: TRICKLE_TARGETS,
      };
      const stream = {
        lane: 'act', from: streamFrom, every: 0.45, count: STREAM, slots: STREAM_TARGETS,
        icon: k => steadySlotIcon(STREAM_TARGETS[k]),
      };
      const streamed = flowHolding(stream, t);
      const available = SLOTS - BUSY - streamed - flowHolding(trickle, t);

      // the queue grows until the stream starts, then falls; the wait climbs to 44 s, then falls to 3 s
      const act = 2880 + 20 * Math.min(t, streamFrom) - 175 * Math.max(0, t - streamFrom);
      const climbFrom = 0.3, climbTo = c[1] + 0.8;
      const wait = lerp(28, 44, P(t, climbFrom, climbTo - climbFrom, linear)) - 41 * P(t, streamFrom, 7.0);
      const trend = t < streamFrom ? 'up' : 'down';
      placeWorkerDiagram(s.dg, t, {
        queue: { wf: 6, act },
        flows: [trickle, stream],
        slots: { n: SLOTS, busy: BUSY },
        pollers: { act: 5, grow: { from: 2, at: growAt } },
        cpu: cpuOf(BUSY + streamed),
        mem: { use: memOf(BUSY + streamed) },
        backlog: { trend },
        wait: { text: formatWait(wait), trend },
        metrics: [
          { name: 'temporal_worker_task_slots_available', value: String(available), at: 0 },
          {
            name: 'temporal_activity_schedule_to_start_latency', value: formatWait(wait), color: trendColor(trend),
            at: c[1] + 0.8,
          },
        ],
        code: {
          swap: { slots: ['50', -1] },
          insert: { poller: insertAt },
          light: ['poller', insertAt + 0.1, c[2] + 4.2],
        },
        marks: { pollers: { at: c[1] + 2.6, fixedAt: streamFrom + 0.8, out: c[3] + 1.5 } },
      });
    },
  });
}
