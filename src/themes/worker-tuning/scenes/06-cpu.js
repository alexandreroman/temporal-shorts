// ===================== 6. THE CPU IS FULL
// The Worker diagram as chapter 5 leaves it, the cache grown to 7 cells. renderInvoice tasks fill the Slots, the CPU
// pins at 100% in red and gets a BOTTLENECK tag; tasks come in slowly and a few Slots stay free. The code card fades
// out: a dashed "+ SLOTS" ghost rises in its place and is struck through. Then WORKER B and WORKER C slide in, each
// with its own Poller, Slots and CPU meter, their Pollers joined to the Activity lane by a poll line that branches off
// the trunk of Worker A's; tasks fly to them along it, the three CPU meters settle around 60%, the tag turns FIXED,
// and the backlog drains to 0.
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
  const TASKS = { first: 0.4, every: 1.0, count: 16, hold: 3.2 };
  // the orders in the 7 cache cells as chapter 5 ends, set before the scene starts so that no eviction shows
  const CACHED = [1049, 1047, 1048, 1046, 1050, 1051, 1052].map((next, cell) => ({ cell, at: -10, next }));

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

  scene({
    chapter: 6, title: 'The CPU is full',
    pre: 1.5, post: 2.0,
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
    },
    update(t, c, s) {
      // c[0]: the CPU pins at 100%, the Slots fill with invoices, then a few free up; c[1]: the code card gives way
      // to "+ SLOTS", struck through; c[2]: B and C arrive and take tasks, the CPUs settle; c[3]: the queue empties
      const pinAt = c[0] + 0.8;
      const strikeAt = c[1] + 1.6;
      const arriveAt = [c[2] + 0.8, c[2] + 1.2];
      const busAt = c[2] + 1.6;
      const drainFrom = c[2] + 2.4, drainEnd = c[3] + 3.0;
      const fixAt = c[2] + 4.0;

      // invoices fill the Slots in a wave, 2 Slots out of 3, in filling order
      const rankOf = i => SLOT_ORDER.indexOf(i);
      const icon = i => {
        const invoice = rankOf(i) % 3 !== 2 && t >= c[0] + 0.4 + rankOf(i) * 0.05;
        return invoice ? 'invoice' : steadySlotIcon(i);
      };
      const taskIcon = k => (k % 3 !== 2 ? 'invoice' : activityIcon(k));
      // A full CPU: tasks come in one every 1.8 s and hold their Slot 3.6 s; once B and C share the load, A takes
      // one every 0.9 s again
      const slowCount = Math.floor((drainFrom - 0.6) / 1.8);
      const slow = { lane: 'act', from: 0.6, every: 1.8, count: slowCount, hold: 3.6, slots: freeSlots(SLOTS, BUSY) };
      const shared = { lane: 'act', from: drainFrom, every: 0.9, count: 14, hold: 2.0, slots: freeSlots(SLOTS, 40) };
      const freed = Math.min(BUSY - BUSY_SLOW, Math.floor(Math.max(0, t - (c[0] + 2.2)) / 0.3));

      // the queue grows while the CPU is full, then drains to 0 once B and C take tasks
      const drain = P(t, drainFrom, drainEnd - drainFrom);
      // it starts at 990 + 4 = 994, about where chapter 5 leaves it
      const act = (990 + 700 * P(t, c[0], drainFrom - c[0], linear)) * (1 - drain);
      const wf = 4 * (1 - drain);
      const trend = t >= pinAt && t < drainFrom ? 'up' : 'down';
      const wait = lerp(4 + 10 * P(t, pinAt, 5.0), 0.3, drain);
      placeWorkerDiagram(s.dg, t, {
        show: { code: 1 - P(t, c[1] + 0.2, 0.5), mem: 1 - P(t, c[2] + 0.2, 0.4) },
        queue: { wf, act },
        taskIcon,
        flows: [slow, shared],
        slots: { n: SLOTS, busy: BUSY - freed, icon },
        pollers: { act: 5 },
        cache: { cells: DIAGRAM.cache.max, evictions: CACHED },
        cpu: 88 + 12 * P(t, pinAt, 1.2) - 40 * P(t, drainFrom, 1.8),
        mem: { use: 0.55, label: '4 GB' },
        backlog: { trend },
        wait: { text: formatWait(wait), trend },
        code: { swap: { slots: ['50', -10], cache: ['2000', -10] }, insert: { poller: -10 } },
        marks: { cpu: { at: c[0] + 1.6, fixedAt: fixAt } },
      });

      // "+ SLOTS" rises where the code card was, is struck through, and gives way to Workers B and C
      const ghostO = P(t, c[1] + 0.6, 0.5) * (1 - P(t, c[2] + 0.2, 0.4));
      rise(s.ghost, GHOST_X, GHOST_Y, ghostO);
      s.ghost.style.borderColor = t >= strikeAt ? C.red : C.lineLight;
      draw(s.strike, P(t, strikeAt, 0.35, easeOut), 1 - P(t, c[2] + 0.2, 0.4));

      // B and C slide in from the right and glow a moment; their poll line joins them to the lanes
      s.workers.forEach((panel, w) => {
        const arrive = arrivingInstance(t, arriveAt[w]);
        place(panel, NEW.left + NEW.w / 2 - arrive.dx, NEW.tops[w] + NEW.h / 2, 1, arrive.o);
        setAppStatus(panel, '', 'running');
        setArrivalGlow(panel, t, arriveAt[w], arriveAt[w] + 2.6);
        setNewWorkerCpu(panel, (w === 0 ? 62 : 58) * P(t, busAt + 1.0, 1.8));
      });
      s.bus.forEach(line => draw(line, 1, P(t, busAt, 0.4)));

      // tasks fly to B and C in turn along the poll line, each holding a Slot TASKS.hold s
      const headX = laneHeadX(s.dg.lanes.act, DIAGRAM.lane.left);
      const busy = NEW.names.map(() => Array(INSIDE.slots).fill(null));
      let flying = 0;
      for (let k = 0; k < TASKS.count; k++) {
        for (let w = 0; w < NEW.names.length; w++) {
          const leave = busAt + TASKS.first + w * 0.5 + k * TASKS.every;
          const land = leave + FLY;
          const cell = (k + 2 * w) % INSIDE.slots;
          const taskIconName = taskIcon(k * 2 + w);
          if (t >= land && t < land + TASKS.hold) busy[w][cell] = { icon: taskIconName, s: swell(t, land, 0.12) };
          if (t >= leave && t < land && flying < s.chips.length) {
            const chip = s.chips[flying++];
            setChipIcon(chip, taskIconName);
            const u = ease((t - leave) / FLY);
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
    },
  });
}
