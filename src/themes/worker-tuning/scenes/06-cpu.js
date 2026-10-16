// ===================== 6. THE CPU IS FULL
// Starts on chapter 5's last frame (a hard cut), the cache grown to 7 cells. renderInvoice tasks fill the queue and
// the Slots in a wave, the CPU pins at 100% in red and gets a BOTTLENECK tag; tasks come in slowly and a few Slots stay
// free. The code card fades out: a dashed "+ SLOTS" ghost rises in its place and is struck through. Then WORKER B and
// WORKER C slide in, each with its own Poller, Slots and CPU meter, their Pollers joined to the Activity lane by a poll
// line that branches off the trunk of Worker A's; tasks fly to them along it, the three CPU meters settle around 60%,
// the tag turns FIXED, and the backlog drains to 0. Last, the move into the recap: the four bottleneck components (the
// Activity Slot grid, the Activity Pollers, the Workflow cache, the CPU meter) shrink into the small parts that start
// the rows of chapter 7's table, at their places, while the rest of the diagram leaves in turn; chapter 7 starts on
// this chapter's last frame (another hard cut).
// The block keeps every name declared in this file local to this scene.
{
  const SLOTS = 50;
  // Worker A's steadily busy Slots: 44 as chapter 5 ends, 36 once the CPU is full and tasks come in slowly
  const BUSY = 44, BUSY_SLOW = 36;
  const { band, meter, code, slot } = DIAGRAM;
  // the "+ SLOTS" ghost fills the code card's place, as the "+ WORKER" ghost of chapter 1 does
  const GHOST = { left: code.left, top: band.top, w: code.w, h: band.h, label: 30 };
  const GHOST_X = GHOST.left + GHOST.w / 2, GHOST_Y = GHOST.top + GHOST.h / 2;
  // Workers B and C: panels in the code card's column, as high as the meters beside them (B level with the CPU
  // meter, C with the MEMORY one). Inside, on a row `row` px below the panel's top, 20 px above its bottom: a Poller
  // under the gear, 5 Slots of the diagram's size from under the name (x 1186..1554), and a CPU gauge on the panel's
  // right padding line (x 1594..1776, the right edge of Worker A's Slots)
  const NEW = {
    left: code.left, w: code.w, h: meter.h, tops: [meter.top.cpu, meter.top.mem], names: ['WORKER B', 'WORKER C'],
  };
  const INSIDE = { row: 78, pollerX: GRID.pad + 11, slotLeft: 66, slots: 5, cpuLeft: 474, cpuW: 182 };
  const newSlotX = k => NEW.left + INSIDE.slotLeft + slot.w / 2 + k * slot.pitchX;
  const portY = w => NEW.tops[w] + INSIDE.row;
  // the poll line of B and C: from the Activity lane down the trunk of Worker A's poll lines (x 840), on down to C's
  // row, along it under the CPU meter (where the MEMORY meter was) to a collector in the gutter before the panels
  // (x 1110), then on into C's Poller, or up the collector into B's
  const BUS = { collector: NEW.left - GRID.gutter / 2, pollerX: NEW.left + INSIDE.pollerX };
  // a task flies to B or C in FLY s, along the poll line; the first one leaves TASKS.first s after the line shows
  const FLY = 1.4;
  const TASKS = { first: 0.4, every: 1.0, hold: 3.2 };
  // the orders in the 7 cache cells as chapter 5 ends, set before the scene starts so that no eviction shows
  const CACHED = Array.from({ length: DIAGRAM.cache.max }, (_, cell) => ({
    cell, at: -10, next: finalCacheOrder(cell),
  }));
  // The move into the recap, from MOVE.lead s before the end: the rest of the diagram leaves in groups (LEAVING), each
  // sliding away over MOVE.leave s, `at` s into the move; from MOVE.travelAt s on, the four bottleneck components
  // shrink into their parts on the recap's rows (RECAP_PARTS), MOVE.stagger s apart, each over MOVE.travel s, then fade
  // into them over MOVE.handOver s. The chapter's tasks are all done by then (see REST_LEAD).
  const MOVE = { lead: 2.4, leave: 0.5, travelAt: 0.2, stagger: 0.1, travel: 1.2, handOver: 0.3 };
  // the groups that leave: the TEMPORAL panel and its lanes to the left, the readouts down, Worker A's panel with its
  // labels, Workflow Slots and Workflow Pollers up, B and C to the right; the poll lines fade first
  const LEAVING = {
    temporal: { at: 0, dx: -160, dy: 0 }, band: { at: 0.1, dx: 0, dy: 80 }, frame: { at: 0.2, dx: 0, dy: -60 },
    helpers: { at: 0.3, dx: 200, dy: 0 },
  };
  const LINES_OUT = 0.3;

  // The points of the poll line from the Activity lane's end to the Poller of Worker w: A's route to the trunk, down
  // to C's row, then into C's Poller, or along C's row to the collector and up into B's
  function busRoute(w) {
    const route = pollRoute(DIAGRAM.actY, BUS.pollerX - DIAGRAM.poller.size / 2 - 3, portY(1));
    if (w === 1) return route;
    const toCollector = route.slice(0, 3).concat([[BUS.collector, portY(1)], [BUS.collector, portY(w)]]);
    return toCollector.concat([[route[3][0], portY(w)]]);
  }
  // The path of a task from the head of the Activity lane to Slot k of Worker w, as points: along the poll line, then
  // on along the Slot row
  const taskPath = (headX, w, k) => [
    [headX, DIAGRAM.actY], ...busRoute(w).slice(0, -1), [BUS.pollerX, portY(w)], [newSlotX(k), portY(w)],
  ];
  // Worker B or C: an app panel, its Poller, 5 Slots and a CPU gauge. Children are placed from the panel's padding
  // box, inside its border, drawn 1 px wide (see MINI.border): the offsets put them on whole stage pixels.
  function makeNewWorker(root, name) {
    const inset = MINI.border;
    const panel = makeAppPanel(root, name, NEW.w, NEW.h, { font: 18 });
    panel.cells = Array.from({ length: INSIDE.slots }, (_, k) => makeSlot(panel, slot.w, slot.h, {
      left: (INSIDE.slotLeft + k * slot.pitchX - inset) + 'px', top: (INSIDE.row - slot.h / 2 - inset) + 'px',
      opacity: 1,
    }));
    const size = DIAGRAM.poller.size;
    E(panel, '', '', {
      left: (INSIDE.pollerX - size / 2 - inset) + 'px', top: (INSIDE.row - size / 2 - inset) + 'px',
      width: size + 'px', height: size + 'px', borderRadius: '50%', border: '2px solid ' + C.violet,
      background: 'var(--surface)', opacity: 1,
    });
    panel.insertAdjacentHTML('beforeend',
      `<div class="lbl" style="position:absolute;left:${INSIDE.cpuLeft - inset}px;top:${20 - inset}px;`
      + 'font-size:16px">CPU</div>'
      + `<div class="v mono" style="position:absolute;right:${24 - inset}px;top:${16 - inset}px;font-size:24px;`
      + 'line-height:30px"></div>'
      + `<div style="position:absolute;left:${INSIDE.cpuLeft - inset}px;top:${INSIDE.row - 7 - inset}px;`
      + `width:${INSIDE.cpuW}px;height:14px;border-radius:3px;background:rgba(${RGB.ink},.08);overflow:hidden">`
      + '<div class="fill" style="height:100%;width:0"></div></div>');
    panel.cpuValue = panel.querySelector('.v');
    panel.cpuFill = panel.querySelector('.fill');
    panel.cpuFill.style.background = `linear-gradient(90deg,${C.uv},${C.violet})`;
    return panel;
  }
  function setNewWorkerCpu(panel, cpu) {
    panel.cpuValue.textContent = Math.round(cpu) + '%';
    panel.cpuFill.style.width = Math.round(cpu / 100 * INSIDE.cpuW) + 'px';
  }

  // Fades an element by o, on top of the opacity it was given this frame
  function fadeBy(e, o) {
    const opacity = parseFloat(e.style.opacity) * o;
    e.style.opacity = opacity;
    e.style.visibility = opacity <= 0.001 ? 'hidden' : 'visible';
  }
  // Moves an element that the diagram placed this frame with place() dx, dy px further, and fades it by o
  function slideAway(e, dx, dy, o) {
    e.style.transform = `translate(${dx}px,${dy}px) ${e.style.transform}`;
    fadeBy(e, o);
  }
  // The same for a label that the diagram placed this frame with showAt()
  function slideLabelAway(e, dx, dy, o) {
    e.style.left = parseFloat(e.style.left) + dx + 'px';
    e.style.top = parseFloat(e.style.top) + dy + 'px';
    fadeBy(e, o);
  }
  // The parts of the diagram in each group that leaves (see LEAVING), placed or labels
  function leavingGroups(dg) {
    const { lanes } = dg;
    return {
      temporal: {
        placed: [dg.temporal, lanes.wf.track, lanes.act.track, ...lanes.wf.chips, ...lanes.act.chips],
        labels: [lanes.wf.label, lanes.act.label, lanes.wf.more, lanes.act.more],
      },
      band: { placed: [dg.backlog, dg.wait], labels: [] },
      frame: { placed: [dg.worker, ...dg.wfSlots, ...dg.pollers.wf], labels: Object.values(dg.labels) },
    };
  }
  // Slot j of the Slot grid part that Activity Slot i shrinks into: the grid's 10 columns and 5 rows fold into the
  // part's 3 and 2
  const partSlotOf = i => Math.floor((i % DIAGRAM.slot.cols) * 3 / DIAGRAM.slot.cols)
    + 3 * Math.floor(Math.floor(i / DIAGRAM.slot.cols) * 2 / slotRows(SLOTS));
  // Where each element of the bottleneck components rests in the diagram, where it ends in its part, its scale there
  // and whether it stays to the end: [element, from, to, scale, stays], component by component in the order of the
  // recap's rows. Of the elements that end on the same spot, one stays: the others fade out on the way.
  function shrinkingComponents(dg) {
    const partCorner = i => [recapPartCenter(i)[0] - RECAP_PART.w / 2, recapPartCenter(i)[1] - RECAP_PART.h / 2];
    const slotPart = partCorner(0);
    const slots = dg.slots.map((cell, i) => {
      const j = partSlotOf(i);
      const [x, y] = recapSlotCenter(j);
      const stays = dg.slots.findIndex((_, other) => partSlotOf(other) === j) === i;
      return [cell, slotCenter(i, slotRows(SLOTS)), [slotPart[0] + x, slotPart[1] + y], RECAP_SLOT.w / slot.w, stays];
    });
    const pollerAt = [partCorner(1)[0] + RECAP_POLLER_X, recapRowY(1)];
    const pollers = dg.pollers.act.map((e, i) => [
      e, [DIAGRAM.poller.x, pollerY(DIAGRAM.actY, i, DIAGRAM.poller.max.act)], pollerAt, 1, i === 0,
    ]);
    const cache = dg.cache.map((cell, i) => [
      cell, [cacheCellLeft(i) + DIAGRAM.cache.w / 2, DIAGRAM.wfY], recapPartCenter(2), 1, i === 0,
    ]);
    const meterAt = [meter.left + meter.w / 2, meter.top.cpu + meter.h / 2];
    const cpu = [[dg.cpu, meterAt, recapPartCenter(3), RECAP_PART.w / meter.w, true]];
    return [slots, pollers, cache, cpu];
  }

  scene({
    chapter: 6, title: 'The CPU is full',
    pre: 1.5, post: 2.0,
    // hard cuts on both ends: chapter 5 ends on this chapter's first frame, chapter 7 starts on its last one
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the drained backlog, then plays the move into the recap and the cut in one go; the
    // header leaves as the move starts
    holdBeforeEnd: MOVE.lead + 0.1,
    headerOutAt: (c, dur) => dur - MOVE.lead,
    subs: [
      {
        text: "Now renderInvoice keeps the CPU at 100%: every task slows down and holds its Slot longer.",
        after: 2.0,
      },
      {
        text: "More Slots would not help: a Slot adds no CPU. This Worker has used all the CPU it has.",
        after: 2.0,
      },
      {
        text: "This is the moment to add Workers: B and C poll the same Task Queue and share the load.",
        after: 2.0,
      },
      { text: "The backlog drains, and new orders start right away again.", after: 2.0 },
    ],
    build(root, s) {
      s.dg = makeWorkerDiagram(root);
      s.ghost = E(root,
        `<div class="mono" style="font-size:${GHOST.label}px;letter-spacing:.1em;padding-left:.1em;color:var(--slate)">`
        + '+ SLOTS</div>',
        '', {
          width: GHOST.w + 'px', height: GHOST.h + 'px', border: '2px dashed ' + C.lineLight, borderRadius: 'var(--r)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        });
      s.svg = svgLayer(root);
      s.strike = path(s.svg, `M ${GHOST_X - 95} ${GHOST_Y} L ${GHOST_X + 95} ${GHOST_Y}`, C.red, 4, false);
      // in the poll lines' layer of the diagram, where they share Worker A's segments seamlessly
      s.bus = NEW.names.map((_, w) => path(s.dg.svg, roundedPath(busRoute(w)), C.violet, 2, false, '5,7'));
      s.workers = NEW.names.map(name => makeNewWorker(root, name));
      s.chips = Array.from({ length: 6 }, () => makeTaskChip(root, 'act'));
      s.leaving = leavingGroups(s.dg);
      s.shrinking = shrinkingComponents(s.dg);
      s.parts = RECAP_PARTS.map((_, i) => makeRecapPart(root, i));
    },
    update(t, c, s) {
      // c[0]: the CPU pins at 100%, invoices fill the queue and the Slots, then a few Slots free up; c[1]: the code
      // card gives way to "+ SLOTS", struck through; c[2]: B and C arrive and take tasks, the CPUs settle; c[3]: the
      // queue empties; last, the move into the recap
      const pinAt = c[0] + 0.8;
      const strikeAt = c[1] + 1.6;
      const arriveAt = [c[2] + 0.8, c[2] + 1.2];
      const busAt = c[2] + 1.6;
      const drainFrom = c[2] + 2.4, drainEnd = c[3] + 3.0;
      const fixAt = c[2] + 4.0;
      const moveAt = this.dur - MOVE.lead;

      // A full CPU: tasks come in one every 1.8 s and hold their Slot 3.6 s; once B and C share the load, A takes
      // one every 0.9 s again, each holding its Slot 2 s, the last one done before the move
      const slowCount = Math.floor((drainFrom - 0.6) / 1.8);
      const slow = { lane: 'act', from: 0.6, every: 1.8, count: slowCount, hold: 3.6, slots: freeSlots(SLOTS, BUSY) };
      const sharedCount = Math.floor((moveAt - REST_LEAD - 2.0 - FLIGHT.land - drainFrom) / 0.9) + 1;
      const shared = {
        lane: 'act', from: drainFrom, every: 0.9, count: sharedCount, hold: 2.0, slots: freeSlots(SLOTS, 40),
      };
      const freed = Math.min(BUSY - BUSY_SLOW, Math.floor(Math.max(0, t - (c[0] + 2.2)) / 0.3));

      // invoices come in a wave from waveAt, 2 tasks out of 3: through the Slots in filling order, and through the
      // queue from its head (queued chip p is task departed + p, see placeLane)
      const waveAt = c[0] + 0.4;
      const isInvoice = k => k % 3 !== 2;
      const rankOf = i => SLOT_ORDER.indexOf(i);
      const icon = i => (isInvoice(rankOf(i)) && t >= waveAt + rankOf(i) * 0.05 ? 'invoice' : steadySlotIcon(i));
      const headAtWave = flowDeparted(slow, waveAt);
      const taskIcon = k => {
        const invoice = isInvoice(k) && t >= waveAt + Math.max(0, k - headAtWave) * 0.05;
        return invoice ? 'invoice' : activityIcon(k);
      };

      // the queue grows on from where chapter 5 leaves it while the CPU is full, then drains to 0 once B and C take
      // tasks
      const start = AT_CUT.ch6;
      const drain = P(t, drainFrom, drainEnd - drainFrom);
      const act = (start.act + 700 * P(t, c[0], drainFrom - c[0], linear)) * (1 - drain);
      const wf = start.wf * (1 - drain);
      const trend = t >= pinAt && t < drainFrom ? 'up' : 'down';
      const wait = lerp(start.wait + 10 * P(t, pinAt, 5.0), 0.3, drain);
      placeWorkerDiagram(s.dg, t, {
        show: { code: 1 - P(t, c[1] + 0.2, 0.5), mem: 1 - P(t, c[2] + 0.2, 0.4) },
        queue: { wf, act },
        taskIcon,
        flows: [slow, shared],
        slots: { n: SLOTS, busy: BUSY - freed, icon },
        pollers: { act: 5 },
        cache: { cells: DIAGRAM.cache.max, evictions: CACHED },
        cpu: start.cpu + 12 * P(t, pinAt, 1.2) - 40 * P(t, drainFrom, 1.8),
        mem: { use: start.mem, label: '4 GB' },
        backlog: { trend },
        wait: { text: formatWait(wait), trend },
        code: { swap: { slots: ['50', -10], cache: ['2000', -10] }, insert: { poller: -10 } },
        // the tag leaves as the CPU meter starts its move
        marks: { cpu: { at: c[0] + 1.6, fixedAt: fixAt, out: moveAt } },
      });

      // "+ SLOTS" rises where the code card was, is struck through, and gives way to Workers B and C
      const ghostO = P(t, c[1] + 0.6, 0.5) * (1 - P(t, c[2] + 0.2, 0.4));
      rise(s.ghost, GHOST_X, GHOST_Y, ghostO);
      s.ghost.style.borderColor = t >= strikeAt ? C.red : C.lineLight;
      draw(s.strike, P(t, strikeAt, 0.35, easeOut), 1 - P(t, c[2] + 0.2, 0.4));

      // B and C slide in from the right and glow a moment; their poll line joins them to the lanes. They slide out to
      // the right with the move.
      const leave = group => P(t, moveAt + LEAVING[group].at, MOVE.leave, easeIn);
      const helpersOut = leave('helpers');
      s.workers.forEach((panel, w) => {
        const arrive = arrivingInstance(t, arriveAt[w]);
        const dx = Math.round(LEAVING.helpers.dx * helpersOut) - arrive.dx;
        place(panel, NEW.left + NEW.w / 2 + dx, NEW.tops[w] + NEW.h / 2, 1, arrive.o * (1 - helpersOut));
        setAppStatus(panel, '', 'running');
        setArrivalGlow(panel, t, arriveAt[w], arriveAt[w] + 2.6);
        setNewWorkerCpu(panel, (w === 0 ? 62 : 58) * P(t, busAt + 1.0, 1.8));
      });
      const linesO = 1 - P(t, moveAt, LINES_OUT);
      s.bus.forEach(line => draw(line, 1, P(t, busAt, 0.4) * linesO));

      // tasks fly to B and C in turn along the poll line, each holding a Slot TASKS.hold s, the last ones landing
      // before the move
      const taskCount = Math.floor((moveAt - REST_LEAD - FLY - busAt - TASKS.first - 0.5) / TASKS.every) + 1;
      const headX = laneHeadX(s.dg.lanes.act, DIAGRAM.lane.left);
      const busy = NEW.names.map(() => Array(INSIDE.slots).fill(null));
      let flying = 0;
      for (let k = 0; k < taskCount; k++) {
        for (let w = 0; w < NEW.names.length; w++) {
          const leaveAt = busAt + TASKS.first + w * 0.5 + k * TASKS.every;
          const land = leaveAt + FLY;
          const cell = (k + 2 * w) % INSIDE.slots;
          const taskIconName = taskIcon(k * 2 + w);
          if (t >= land && t < land + TASKS.hold) busy[w][cell] = { icon: taskIconName, s: swell(t, land, 0.12) };
          if (t >= leaveAt && t < land && flying < s.chips.length) {
            const chip = s.chips[flying++];
            setChipIcon(chip, taskIconName);
            const u = ease((t - leaveAt) / FLY);
            const [x, y] = pointAlong(taskPath(headX, w, cell), u);
            place(chip, x, y, 1 - 0.2 * P(u, 0.85, 0.15, linear), 1);
          }
        }
      }
      s.chips.forEach((chip, i) => {
        if (i >= flying) place(chip, 0, 0, 1, 0);
      });
      s.workers.forEach((panel, w) => panel.cells.forEach((cell, k) => {
        const task = busy[w][k];
        setSlot(cell, task ? 'busy' : 'free', task ? task.icon : null);
        cell.style.transform = task ? `scale(${task.s})` : '';
      }));

      // the move into the recap: the poll lines fade (their opacity only: draw() sets no visibility), the other groups
      // slide away in turn
      if (t >= moveAt) {
        for (const lane of ['wf', 'act']) {
          s.dg.pollLines[lane].forEach(line => { line.style.opacity = parseFloat(line.style.opacity) * linesO; });
        }
        for (const [group, parts] of Object.entries(s.leaving)) {
          const p = leave(group);
          const { dx, dy } = LEAVING[group];
          parts.placed.forEach(e => slideAway(e, Math.round(dx * p), Math.round(dy * p), 1 - p));
          parts.labels.forEach(e => slideLabelAway(e, Math.round(dx * p), Math.round(dy * p), 1 - p));
        }
      }
      // ... while each bottleneck component shrinks into its part of the recap, which fades in as it arrives
      s.shrinking.forEach((elements, k) => {
        const travelAt = moveAt + MOVE.travelAt + k * MOVE.stagger;
        const m = P(t, travelAt, MOVE.travel);
        const handOver = P(t, travelAt + MOVE.travel, MOVE.handOver, linear);
        const merge = P(t, travelAt, MOVE.travel * 0.6, linear);
        if (m > 0) {
          for (const [e, from, to, scale, stays] of elements) {
            const o = (1 - handOver) * (stays ? 1 : 1 - merge);
            place(e, lerp(from[0], to[0], m), lerp(from[1], to[1], m), lerp(1, scale, m), o);
          }
        }
        showRecapPart(s.parts[k], k, handOver);
      });
    },
  });
}
