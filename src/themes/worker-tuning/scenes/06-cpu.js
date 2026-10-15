// ===================== 6. THE CPU IS FULL
// The Worker diagram as chapter 5 leaves it, the cache grown to 8 cells. renderInvoice tasks fill the Slots, the CPU
// pins at 100% in red and gets a BOTTLENECK tag; tasks come in slowly and a few Slots stay free. The code card fades
// out: a dashed "+ SLOTS" ghost rises in its place and is struck through. Then WORKER B and WORKER C slide in, each
// with its own Slots and CPU meter, their Pollers joined to the same two lanes by one dashed poll line; tasks fly to
// them along it, the three CPU meters settle around 60%, the tag turns FIXED, and the backlog drains to 0.
// The block keeps every name declared in this file local to this scene.
{
  const SLOTS = 50;
  // Worker A's steadily busy Slots: 44 as chapter 5 ends, 36 once the CPU is full and tasks come in slowly
  const BUSY = 44, BUSY_SLOW = 36;
  // the "+ SLOTS" ghost fills the code card's place, as the "+ WORKER" ghost of chapter 1 does under the Worker
  const GHOST = { left: 1140, top: DIAGRAM.readout.top, w: 660, h: 264, label: 30 };
  const GHOST_X = GHOST.left + GHOST.w / 2, GHOST_Y = GHOST.top + GHOST.h / 2;
  // Workers B and C: panels in the code card's place, as high as the meters beside them (B level with the CPU
  // meter, C with the MEMORY one); inside, 5 Slots and a CPU gauge on a row `row` px below the panel's top
  const NEW = { left: 1200, w: 600, h: 124, tops: [616, 756], names: ['WORKER B', 'WORKER C'] };
  const INSIDE = { row: 84, slotLeft: 48, slots: 5, cpuLeft: 424, cpuW: 152 };
  const newSlotX = k => NEW.left + INSIDE.slotLeft + MINI.w / 2 + k * MINI.pitchX;
  const portY = w => NEW.tops[w] + INSIDE.row;
  // the poll line of B and C: from each Poller (on its panel's left edge) to a collector at x 1150, between the CPU
  // meter and the panels, along C's row to a trunk in the gap between the two big panels (x 760), then up the trunk
  // to the Activity lane (where it crosses the poll line of A's middle Poller) and on to the Workflow lane
  const BUS = { collector: 1150, trunk: 760, portX: NEW.left - 13 };
  // a task flies to B or C in FLY s, along the poll line; the first one leaves TASKS.first s after the line shows
  const FLY = 1.4;
  const TASKS = { first: 0.4, every: 1.0, count: 16, hold: 3.2 };
  // the orders in the 8 cache cells as chapter 5 ends, set before the scene starts so that no eviction shows
  const CACHED = [1049, 1047, 1048, 1046, 1050, 1051, 1052, 1053].map((next, cell) => ({ cell, at: -10, next }));

  // The middle of a Slot of Worker w, k-th from the left
  const newSlotPoint = (w, k) => [newSlotX(k), portY(w)];
  // The path of a task from the head of the Activity lane to Slot k of Worker w, as points
  function taskPath(headX, w, k) {
    const { collector, trunk } = BUS;
    const viaCollector = w === 0 ? [[collector, portY(1)], [collector, portY(0)]] : [];
    return [
      [headX, DIAGRAM.actY], [trunk, DIAGRAM.actY], [trunk, portY(1)], ...viaCollector, [NEW.left, portY(w)],
      newSlotPoint(w, k),
    ];
  }
  // The point at fraction u of a path's length
  function pointAlong(points, u) {
    const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
    let rest = clamp(u) * lengths.reduce((a, b) => a + b, 0);
    for (let i = 0; i < lengths.length; i++) {
      if (rest <= lengths[i] || i === lengths.length - 1) {
        const p = lengths[i] > 0 ? rest / lengths[i] : 1;
        return [lerp(points[i][0], points[i + 1][0], p), lerp(points[i][1], points[i + 1][1], p)];
      }
      rest -= lengths[i];
    }
    return points[points.length - 1];
  }
  // Worker B or C: an app panel, its Poller astride its left edge, 5 Slots and a CPU gauge. Children are placed from
  // the panel's padding box, inside its 1.5 px border: the offsets put them on whole stage pixels.
  function makeNewWorker(root, name) {
    const inset = 1.5;
    const panel = makeAppPanel(root, name, NEW.w, NEW.h, { font: 18 });
    panel.cells = Array.from({ length: INSIDE.slots }, (_, k) => makeSlot(panel, MINI.w, MINI.h, {
      left: (INSIDE.slotLeft + k * MINI.pitchX - inset) + 'px', top: (INSIDE.row - MINI.h / 2 - inset) + 'px',
      opacity: 1,
    }));
    const size = DIAGRAM.poller.size;
    E(panel, '', '', {
      left: (-size / 2 - inset + 1) + 'px', top: (INSIDE.row - size / 2 - inset) + 'px', width: size + 'px',
      height: size + 'px', borderRadius: '50%', border: '2px solid ' + C.violet, background: 'var(--surface)',
      opacity: 1,
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
      const { collector, trunk, portX } = BUS;
      const exitX = LANE_EXIT_X + 3;
      s.bus = [
        `M ${portX} ${portY(0)} H ${collector} V ${portY(1)}`,
        `M ${portX} ${portY(1)} H ${trunk}`,
        `M ${trunk} ${portY(1)} V ${DIAGRAM.wfY} H ${exitX}`,
      ].map(d => path(s.svg, d, C.violet, 2, false, '5,7'));
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
        cache: { cells: 8, evictions: CACHED },
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
      s.bus.forEach(line => draw(line, 1, 0.85 * P(t, busAt, 0.4)));

      // tasks fly to B and C in turn along the poll line, each holding a Slot TASKS.hold s
      const headX = laneHeadX(s.dg.lanes.act, DIAGRAM.lane.left);
      const busy = NEW.names.map(() => Array(INSIDE.slots).fill(null));
      let flying = 0;
      for (let k = 0; k < TASKS.count; k++) {
        for (let w = 0; w < NEW.names.length; w++) {
          const leave = busAt + TASKS.first + w * 0.5 + k * TASKS.every;
          const land = leave + FLY;
          const slot = (k + 2 * w) % INSIDE.slots;
          const taskIconName = taskIcon(k * 2 + w);
          if (t >= land && t < land + TASKS.hold) busy[w][slot] = { icon: taskIconName, s: swell(t, land, 0.12) };
          if (t >= leave && t < land && flying < s.chips.length) {
            const chip = s.chips[flying++];
            setChipIcon(chip, taskIconName);
            const u = ease((t - leave) / FLY);
            const [x, y] = pointAlong(taskPath(headX, w, slot), u);
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
