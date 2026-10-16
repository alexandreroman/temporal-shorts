// ===================== 4. THE POLLERS CAN'T KEEP UP
// Starts on chapter 3's last frame (a hard cut): 50 Activity Slots, half of them free, the CPU at 45%, the queue
// growing.
// The two Activity Pollers bring in one task every 1.6 s while their poll lines keep pulsing. A
// temporal_activity_schedule_to_start_latency metric line climbs in red under the Slots available one, and the Pollers
// get a red outline and a BOTTLENECK tag. The code card gains activityTaskPollerBehavior: { type: 'autoscaling' }:
// the column grows to 5 Pollers, tasks stream through them into the free Slots, the tag turns FIXED, the backlog and
// the wait fall. Last, the Slots fill and the CPU climbs to 80%, and the two metric lines sink out: chapter 5 starts on
// this chapter's last frame (another hard cut).
// The block keeps every name declared in this file local to this scene.
{
  const SLOTS = 50;
  // 25 Slots steadily busy, as chapter 3 ends; the stream fills 19 of the free ones, 44 busy in the end
  const BUSY = 25;
  const STREAM = 19;
  const STREAM_TARGETS = freeSlots(SLOTS, BUSY).slice(0, STREAM);
  // the trickle before the Pollers scale visits the 6 Slots that the stream leaves free: 11 tasks, so that the chapter
  // takes 30 tasks from the queue, a multiple of the five order steps (see REST_LEAD)
  const TRICKLE_TARGETS = SLOT_ORDER.slice(BUSY + STREAM);
  const TRICKLE_COUNT = 11;
  // the CPU and the memory follow the busy Slots: chapter 3's values with 25 busy, chapter 5's with 44
  const cpuOf = busy => lerp(AT_CUT.ch4.cpu, AT_CUT.ch5.cpu, (busy - BUSY) / STREAM);
  const memOf = busy => lerp(AT_CUT.ch4.mem, AT_CUT.ch5.mem, (busy - BUSY) / STREAM);

  scene({
    chapter: 4, title: "The Pollers can't keep up",
    pre: 1.5, post: 2.0,
    // hard cuts on both ends: chapter 3 ends on this chapter's first frame, chapter 5 starts on its last one
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds with the metric lines on screen, then plays their exit and the cut in one go
    holdBeforeEnd: LEAVE_LEAD + 0.1,
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
      const trickle = { lane: 'act', from: 0.6, every: 1.6, count: TRICKLE_COUNT, hold: 2.4, slots: TRICKLE_TARGETS };
      const stream = {
        lane: 'act', from: streamFrom, every: 0.45, count: STREAM, slots: STREAM_TARGETS,
        icon: k => steadySlotIcon(STREAM_TARGETS[k]),
      };
      const streamed = flowHolding(stream, t);
      const available = SLOTS - BUSY - streamed - flowHolding(trickle, t);

      // the queue grows from the count chapter 3 leaves until the stream starts, then falls to the count chapter 5
      // starts from; the wait climbs to 44 s, then falls to chapter 5's
      const start = AT_CUT.ch4, next = AT_CUT.ch5;
      const peak = start.act + 20 * streamFrom;
      const fall = P(t, streamFrom, this.dur - streamFrom, linear);
      const act = t < streamFrom ? start.act + 20 * t : lerp(peak, next.act, fall);
      const climbFrom = 0.3, climbTo = c[1] + 0.8;
      const wait = lerp(lerp(start.wait, 44, P(t, climbFrom, climbTo - climbFrom, linear)), next.wait,
        P(t, streamFrom, 7.0));
      const trend = t < streamFrom ? 'up' : 'down';
      const outAt = this.dur - LEAVE_LEAD;
      placeWorkerDiagram(s.dg, t, {
        queue: { wf: start.wf, act },
        flows: [trickle, stream],
        slots: { n: SLOTS, busy: BUSY },
        pollers: { act: 5, grow: { from: 2, at: growAt } },
        cpu: cpuOf(BUSY + streamed),
        mem: { use: memOf(BUSY + streamed), gb: start.gb },
        backlog: { trend },
        wait: { text: formatWait(wait), trend },
        metrics: [
          // already there as chapter 3 ends; both sink out before the cut, as chapter 5 shows none
          { name: 'temporal_worker_task_slots_available', value: String(available), at: -1, out: outAt },
          {
            name: 'temporal_activity_schedule_to_start_latency', value: formatWait(wait), color: trendColor(trend),
            at: c[1] + 0.8, out: outAt,
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
