// ===================== 5. THE CACHE RUNS OUT
// Starts on chapter 4's last frame (a hard cut): 50 Activity Slots, 44 busy, 5 Activity Pollers, the CPU at 80% and
// the backlog falling. Open orders line up against the full WORKFLOW CACHE and the MEMORY meter nears full. The cache
// evicts #1045 (EVICTED), the next order takes its cell, and the next Workflow Task of #1045 takes a Workflow Slot
// that turns dashed, its retry icon spinning: a replay. More evictions follow, both Workflow Slots replay, the cache
// gets a red outline and a BOTTLENECK tag, the eviction and replay metrics climb, the CPU jumps and the backlog grows
// again. The memory goes from 1 GB to 4 GB, the maxCachedWorkflows line of the code card lights and goes from 500 to
// 2000, and the strip widens: the waiting orders move into its new cells, the tag turns FIXED and the replays stop.
// Last, the tag and the metric lines leave: chapter 6 starts on this chapter's last frame (another hard cut).
// The block keeps every name declared in this file local to this scene.
{
  const SLOTS = 50;
  const BUSY = 44;
  // the open orders waiting for a cache cell: n dashed cells right of the 4-cell strip, 24 px from its outline (x
  // 1580..1720), then, a cell gap after them, a "+N" count of the others, which ends inside the panel's padding line
  const PRESS = { left: 1580, n: 2 };
  PRESS.countLeft = PRESS.left + PRESS.n * DIAGRAM.cache.pitch;
  const pressX = r => PRESS.left + DIAGRAM.cache.w / 2 + r * DIAGRAM.cache.pitch;
  const cellX = i => cacheCellLeft(i) + DIAGRAM.cache.w / 2;
  // the first order waiting: the 4 cells hold #1042 to #1045
  const FIRST_WAITING = CACHE_ORDERS.firstWaiting;
  // the cells the cache evicts, in turn; eviction j hands its cell to order FIRST_WAITING + j
  const EVICTED_CELLS = CACHE_ORDERS.evicted;
  // the strip grows from 4 to 7 cells: the 3 new ones take the next orders, the 2 waiting then (the 4 evictions used
  // 4 orders) and one more, set before the scene starts so that no eviction shows
  const GROWN = { from: CACHE_ORDERS.from, to: DIAGRAM.cache.max };
  const NEW_CELLS = Array.from({ length: GROWN.to - GROWN.from }, (_, j) => ({
    cell: GROWN.from + j, at: -10, next: finalCacheOrder(GROWN.from + j),
  }));
  // the Activity Tasks that keep coming into the 6 free Slots: 30 of them, a multiple of the five order steps (see
  // REST_LEAD), each one holding its Slot WORK.hold s
  const WORK = { from: 0.6, count: 30, hold: 2.6 };
  // the metric values: forced evictions per second, and the replay latency of an order's short history (five
  // Activities), in ms; after the fix, the latency of the few replays left falls back to `from`
  const EVICTIONS = { from: 6, peak: 46 };
  const REPLAY_MS = { from: 12, peak: 58 };

  // Where waiting order `order` is at t, as { x, o }: it arrives at the end of the line, moves up as each eviction
  // frees a cell, slides into the cell its eviction frees, or into a new cell when the strip grows
  const waitingOrder = (order, t, evictions, firstAt, growAt) => {
    const j = order - FIRST_WAITING;
    // the first PRESS.n orders line up at the start; the others arrive as the line moves up
    const arriveAt = j < PRESS.n ? firstAt + j * 0.4 : evictions[j - PRESS.n].at + 0.6;
    const moved = evictions.slice(0, j).reduce((sum, ev) => sum + P(t, ev.at + 0.2, 0.4), 0);
    const rank = j - moved;
    const arrive = P(t, arriveAt, 0.4);
    const ev = evictions[j];
    if (ev && t >= ev.at) {
      // into the freed cell, then the cell itself shows the order (placeCache refills it 0.5 s after the eviction)
      const p = P(t, ev.at, 0.5);
      return { x: lerp(pressX(0), cellX(ev.cell), p), o: 1 - P(t, ev.at + 0.4, 0.2) };
    }
    // an arriving order fades in at its place, clear of the "+N" count right of the line; a growing strip takes the
    // line: each order slides 20 px left into its new cell and fades as that cell pops in to show it (placeCache pops
    // the new cells 0.12 s apart)
    const x = pressX(rank);
    const grow = P(t, growAt - 0.3, 0.4);
    const newCell = GROWN.from + Math.round(rank);
    return { x: lerp(x, cellX(newCell), grow), o: arrive * (1 - P(t, growAt + 0.05 + rank * 0.12, 0.2)) };
  };

  scene({
    chapter: 5, title: 'The cache runs out',
    pre: 1.5, post: 2.0,
    // hard cuts on both ends: chapter 4 ends on this chapter's first frame, chapter 6 starts on its last one
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds with the FIXED tag and the metric lines on screen, then plays their exit and the cut in one
    // go
    holdBeforeEnd: LEAVE_LEAD + 0.1,
    subs: [
      { text: "More orders are open at once than the Workflow cache can hold.", after: 1.5 },
      {
        text: "The cache <b>evicts</b> Workflows. "
          + "An evicted Workflow replays its whole Event History on its next task.",
        after: 2.0,
      },
      { text: "Replays burn CPU and hold Workflow Slots before the order can move forward.", after: 2.0 },
      {
        text: "Give the Worker more memory and a larger cache: open orders stay cached, and replays become rare.",
        after: 2.0,
      },
    ],
    build(root, s) {
      s.dg = makeWorkerDiagram(root);
      const waitingCell = () => makeSlot(root, DIAGRAM.cache.w, DIAGRAM.cache.h, {
        fontFamily: 'Mono', fontSize: '16px', color: C.slate, borderStyle: 'dashed', borderColor: C.lineLight,
        background: 'transparent',
      });
      // every order that waits during the scene: the first PRESS.n, then one more per eviction
      s.waiting = Array.from({ length: PRESS.n + EVICTED_CELLS.length }, (_, j) => {
        const cell = waitingCell();
        cell.textContent = '#' + (FIRST_WAITING + j);
        return cell;
      });
      s.more = E(root, '', 'mono', { fontSize: '16px', lineHeight: '20px', color: C.slate, whiteSpace: 'nowrap' });
      // as high as the bottleneck tags: it rests on whole pixels
      s.evicted = markTag(root);
    },
    update(t, c, s) {
      // c[0]: the open orders line up; c[1]: the first eviction, then the replay of #1045; c[2]: three more
      // evictions, a second replay; c[3]: the memory grows, the cache line lights and its value swaps, the strip
      // grows, and the replays stop
      const evictions = [c[1] + 0.8, c[2] + 0.2, c[2] + 1.5, c[2] + 2.8].map((at, j) => ({
        cell: EVICTED_CELLS[j], at, next: FIRST_WAITING + j,
      }));
      const memAt = c[3] + 0.6, lightAt = c[3] + 1.4, swapAt = c[3] + 2.3, growAt = c[3] + 2.9;
      const fixAt = c[3] + 3.8;
      // the next Workflow Task of an evicted order replays in a Workflow Slot, which it holds until the fix
      const replayFlow = (from, slot) => ({
        lane: 'wf', from, every: 1, count: 1, slots: [slot], hold: fixAt - (from + FLIGHT.land),
      });
      const replays = [replayFlow(c[1] + 2.6, 0), replayFlow(c[2] + 0.7, 1)];
      const replaying = replays.filter(f => t >= flowLandAt(f, 0) && t < fixAt).map(f => f.slots[0]);
      const replayFrom = flowLandAt(replays[0], 0);
      // Workflow Tasks that find their order in the cache: two before the evictions, three after the fix
      const hitsBefore = { lane: 'wf', from: c[0] + 1.4, every: 1.6, count: 2, hold: 0.9, slots: [0, 1] };
      const hitsAfter = { lane: 'wf', from: fixAt + 0.6, every: 1.2, count: 3, hold: 0.8, slots: [0, 1, 0] };
      const hits = [
        [2, flowLandAt(hitsBefore, 0)], [0, flowLandAt(hitsBefore, 1)],
        [5, flowLandAt(hitsAfter, 0)], [1, flowLandAt(hitsAfter, 1)], [6, flowLandAt(hitsAfter, 2)],
      ];
      // the Activity Tasks keep coming into the 6 free Slots, at a pace that has the last one done REST_LEAD s
      // before the end
      const work = {
        lane: 'act', from: WORK.from, count: WORK.count, hold: WORK.hold, slots: freeSlots(SLOTS, BUSY),
        every: (this.dur - REST_LEAD - FLIGHT.land - WORK.hold - WORK.from) / (WORK.count - 1),
      };

      // the backlog falls on from where chapter 4 leaves it, grows again once the replays start, and falls after the
      // fix to where chapter 6 starts; so does the wait
      const start = AT_CUT.ch5, next = AT_CUT.ch6;
      const clogged = P(t, replayFrom, fixAt - replayFrom, linear);
      const clogging = start.act - 8 * Math.min(t, replayFrom) + 640 * clogged;
      const act = lerp(clogging, next.act, P(t, fixAt, this.dur - fixAt, linear));
      const wf = lerp(start.wf + 36 * clogged, next.wf, P(t, fixAt, 2.0));
      const trend = t >= replayFrom && t < fixAt ? 'up' : 'down';
      const wait = lerp(start.wait + 6 * P(t, replayFrom, 4.0), next.wait, P(t, fixAt, 2.0));
      // the memory nears full; more of it shrinks the share used, then the larger cache takes some of it
      const crowded = start.mem + 0.12 * P(t, c[0] + 1.0, 1.5);
      const raised = crowded * start.gb / next.gb;
      const memUse = lerp(lerp(crowded, raised, P(t, memAt, 0.6)), next.mem, P(t, growAt, 0.6));
      const cells = lerp(GROWN.from, GROWN.to, P(t, growAt, 0.6));
      const fixed = t >= fixAt;
      const outAt = this.dur - LEAVE_LEAD;
      const replayMs = fixed ? REPLAY_MS.from : Math.round(lerp(REPLAY_MS.from, REPLAY_MS.peak, P(t, c[2] + 1.2, 2.5)));
      placeWorkerDiagram(s.dg, t, {
        queue: { wf, act },
        flows: [hitsBefore, work, ...replays, hitsAfter],
        slots: { n: SLOTS, busy: BUSY },
        wfSlots: { replay: replaying },
        pollers: { act: 5, polling: { wf: replaying.length < DIAGRAM.wfSlots } },
        // cells: fractional while the strip widens, so its outline follows the new cells as they pop in
        cache: {
          cells, grow: t >= growAt ? { from: GROWN.from, at: growAt } : undefined, hits,
          evictions: [...NEW_CELLS, ...evictions],
        },
        cpu: lerp(start.cpu + 16 * P(t, c[2] + 1.4, 0.8), next.cpu, P(t, fixAt, 1.0)),
        mem: { use: memUse, gb: t >= memAt ? next.gb : start.gb, swapAt: memAt },
        backlog: { trend },
        wait: { text: formatWait(wait), trend },
        // the metric lines and the cache's tag sink out before the cut, as chapter 6 shows none
        metrics: [
          {
            name: 'temporal_sticky_cache_total_forced_eviction', at: c[2] + 0.8, out: outAt,
            value: fixed ? '0/s' : Math.round(lerp(EVICTIONS.from, EVICTIONS.peak, P(t, c[2] + 0.8, 2.5))) + '/s',
            color: fixed ? C.neon : C.red,
          },
          {
            name: 'temporal_workflow_task_replay_latency', at: c[2] + 1.2, out: outAt,
            value: replayMs + ' ms',
            color: fixed ? C.neon : C.red,
          },
        ],
        code: {
          swap: { slots: ['50', -10], cache: ['2000', swapAt] },
          insert: { poller: -10 },
          light: ['cache', lightAt, swapAt + 2.0],
        },
        status: replaying.length > 0 ? ['REPLAYING', 'running'] : ['RUNNING', 'running'],
        marks: { cache: { at: c[2] + 0.3, fixedAt: fixAt, out: outAt } },
      });
      // a replaying Slot's retry icon turns backwards, on the ambient clock
      replaying.forEach(i => {
        s.dg.wfSlots[i].firstElementChild.style.transform = `rotate(${(-G * 180) % 360}deg)`;
      });

      // the open orders waiting for a cell, and the count of the others
      s.waiting.forEach((cell, j) => {
        const { x, o } = waitingOrder(FIRST_WAITING + j, t, evictions, c[0] + 0.6, growAt);
        place(cell, Math.round(x), DIAGRAM.wfY, 1, o);
      });
      const others = 140 + 30 * Math.max(0, t - c[0]);
      s.more.textContent = '+' + withCommas(others);
      // the count fades out before the strip grows: its last new cell pops in where the count was
      showAt(s.more, PRESS.countLeft, DIAGRAM.wfY - 10, P(t, c[0] + 1.8, 0.4) * (1 - P(t, growAt - 0.3, 0.3)));

      // EVICTED over the first evicted cell until the replay has started, a label gap above the strip, and 20 px clear
      // of the WORKFLOW CACHE label at least, as the bottleneck tag
      const first = evictions[0];
      placeStatusTag(s.evicted, t, 'EVICTED', 'denied', win(t, first.at, replayFrom + 1.0, 0.3), first.at);
      const tagW = parseFloat(s.evicted.style.width) || 0;
      const minLeft = DIAGRAM.cache.left + s.dg.labels.cache.offsetWidth + 20;
      s.evicted.style.left = Math.max(minLeft, cellX(first.cell) - tagW / 2) + 'px';
      s.evicted.style.top = (DIAGRAM.wfY - DIAGRAM.cache.h / 2 - GRID.label - TAG_H) + 'px';
    },
  });
}
