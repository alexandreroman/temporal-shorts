// ===================== INTRO
// Title on the left; on the right, a queue of task chips flowing into a small WORKER panel whose Slots are all busy.
// Now and then a Slot frees up and the head of the queue jumps in, but new tasks arrive faster, so the queue keeps
// growing and its "+N" count climbs.
// The block keeps every name declared in this file local to this scene.
{
  // the title block's measured size (888.9 x 442.7), rounded up to even numbers so its centered box rests on whole
  // pixels; type and gaps a little larger than the default title block, so the composition spans the 440 px minimum
  const TITLE = {
    left: 120, w: 890, h: 444,
    sizes: {
      logoH: 64, logoGap: 52, kickerFont: 24, titleFont: 92, titleLineHeight: 1.08, titleGap: 26, taglineGap: 40,
    },
  };
  // the queue ends 40 px before the Worker panel (x 1486..1800), level with its middle row of Slots
  const WORKER = { x: 1643, y: 515, cols: 4, rows: 3 };
  const LANE = { left: 1066, w: 380, cap: 6 };
  // a Slot frees up every DEPART.every s from DEPART.first; the head of the queue flies into it within FLY s
  const DEPART = { first: 2.6, every: 1.5, slots: [5, 2, 7, 0, 6] };
  const FLY = 0.55;
  // tasks waiting at t: a few at first, then arrivals ever faster
  const arrived = t => 2 + 2.6 * Math.max(0, t - 1.4) + 0.3 * Math.max(0, t - 1.4) ** 2;
  const departAt = k => DEPART.first + k * DEPART.every;

  scene({
    // the title settles before the subtitle; after it, the title page holds about 2 s, then fades
    pre: 1.5, post: 0.5,
    subs: [
      {
        text: "Your Task Queue is backing up and orders are waiting. Which Worker setting do you change?",
        after: 2.0,
      },
    ],
    build(root, s) {
      s.t = makeTitleBlock(root, 'A GUIDE FOR DEVELOPERS AND SRES', 'Why is my Task Queue<br>backing up?',
        'TUNE TEMPORAL WORKERS, ONE BOTTLENECK AT A TIME', TITLE.sizes);
      Object.assign(s.t.style, { width: TITLE.w + 'px', height: TITLE.h + 'px' });
      s.lane = makeLane(root, null, 'act', { w: LANE.w, cap: LANE.cap });
      s.worker = makeMiniWorker(root, 'WORKER', WORKER.cols, WORKER.rows);
      s.fly = makeTaskChip(root, 'act');
    },
    update(t, c, s) {
      rise(s.t, TITLE.left + TITLE.w / 2, 515, P(t, 0.3, 1.2));
      const laneY = WORKER.y + s.worker.cellAt(WORKER.cols)[1];
      const pop = backPop(t, 0.9, 0.7);
      place(s.worker, WORKER.x, WORKER.y, pop.s, pop.o);
      setAppStatus(s.worker, 'BUSY', 'running');

      // departures so far, and the one in flight
      const departed = DEPART.slots.filter((_, k) => t >= departAt(k)).length;
      const flying = departed > 0 && t < departAt(departed - 1) + FLY ? departed - 1 : null;
      const queue = Math.max(0, arrived(t) - departed);
      const shift = departed > 0 ? P(t, departAt(departed - 1), 0.3) : 1;
      placeLane(s.lane, LANE.left, laneY, P(t, 1.2, 0.5), { queue, departed, shift });

      // every Slot is busy, but for the one a task just left: it frees 0.35 s before the next task flies in
      s.worker.cells.forEach((cell, i) => {
        // the departures that refill this Slot: the last one landed gives it its task's icon
        const refills = DEPART.slots.map((_, k) => k).filter(k => DEPART.slots[k] === i);
        const landed = refills.filter(k => t >= departAt(k) + FLY).pop();
        const freed = refills.some(k => t >= departAt(k) - 0.35 && t < departAt(k) + FLY);
        const icon = landed === undefined ? activityIcon(i * 2 + 1) : activityIcon(landed);
        setSlot(cell, freed ? 'free' : 'busy', icon);
        cell.style.transform = landed === undefined ? '' : `scale(${swell(t, departAt(landed) + FLY, 0.15)})`;
      });
      if (flying === null) {
        place(s.fly, 0, 0, 1, 0);
      } else {
        const at = departAt(flying);
        setChipIcon(s.fly, activityIcon(flying));
        const [cx, cy] = s.worker.cellAt(DEPART.slots[flying]);
        const p = P(t, at, FLY);
        const x = lerp(laneHeadX(s.lane, LANE.left), WORKER.x + cx, p), y = lerp(laneY, WORKER.y + cy, p);
        place(s.fly, x, y, 1 - 0.3 * p, 1);
      }
    },
  });
}
