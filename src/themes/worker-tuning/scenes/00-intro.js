// ===================== INTRO
// Title on the left; on the right, a queue of task chips flowing into a small WORKER panel whose 10 Slots are all
// busy. Now and then a Slot frees up and the head of the queue jumps in, but new tasks arrive faster, so the queue
// keeps growing and its "+N" count climbs. Last, the title fades out while the queue and the Worker go on: a hard cut
// hands them to chapter 1, where they become its Task Queue lane and its WORKER A panel.
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
  // the title fades out over TITLE_OUT.d s, from TITLE_OUT.lead s before the end
  const TITLE_OUT = { lead: 1.2, d: 0.6 };
  // a Slot frees up every DEPART.every s from DEPART.first; the head of the queue flies into it within FLY s, none
  // in flight or swelling as the subtitle ends, when make social captures the title card. Task k lands in Slot
  // DEPART.slots[k] with the icon chapter 1 gives that Slot (steadySlotIcon), so the Worker the intro leaves is the
  // one chapter 1 starts with.
  const DEPART = { first: 2.6, every: 1.4, slots: [5, 3, 1, 9, 7] };
  const FLY = 0.55;
  const departAt = k => DEPART.first + k * DEPART.every;
  // tasks arrived by t, from 2 at first, ever faster from ARRIVE s, up to the count chapter 1 starts from at the end
  const ARRIVE = 1.4;
  const arrived = (t, end) => {
    const x = clamp((t - ARRIVE) / (end - ARRIVE));
    return 2 + (QUEUE_AT_CUT.ch1 + DEPART.slots.length - 2) * (0.35 * x + 0.65 * x * x);
  };

  scene({
    // the title settles before the subtitle; after it, the title page holds about 1.5 s, then the title fades out
    pre: 1.5, post: 0.5,
    // a hard cut: the queue and the Worker play on into chapter 1, whose first frame is this scene's last one
    fadeOut: 0,
    // presenter mode holds on the title page, then plays the title's fade-out and the cut in one go
    holdBeforeEnd: TITLE_OUT.lead + 0.1,
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
      s.lane = makeLane(root, null, 'act', { w: INTRO_LANE.w, cap: INTRO_LANE.cap });
      s.worker = makeMiniWorker(root, 'WORKER', INTRO_WORKER.cols, INTRO_WORKER.rows);
      s.fly = makeTaskChip(root, 'act');
    },
    update(t, c, s) {
      const titleIn = P(t, 0.3, 1.2);
      rise(s.t, TITLE.left + TITLE.w / 2, 515, titleIn);
      s.t.style.opacity = titleIn * (1 - P(t, this.dur - TITLE_OUT.lead, TITLE_OUT.d));
      const laneY = INTRO_LANE.y;
      const pop = backPop(t, 0.9, 0.7);
      place(s.worker, INTRO_WORKER.x, INTRO_WORKER.y, pop.s, pop.o);
      setAppStatus(s.worker, 'BUSY', 'running');

      // departures so far, and the one in flight
      const departed = DEPART.slots.filter((_, k) => t >= departAt(k)).length;
      const flying = departed > 0 && t < departAt(departed - 1) + FLY ? departed - 1 : null;
      const queue = Math.max(0, arrived(t, this.dur) - departed);
      const shift = departed > 0 ? P(t, departAt(departed - 1), 0.3) : 1;
      placeLane(s.lane, INTRO_LANE.left, laneY, P(t, 1.2, 0.5), { queue, departed, shift });

      // every Slot is busy, but for the one a task just left: it frees 0.35 s before the next task flies in
      s.worker.cells.forEach((cell, i) => {
        // the departures that refill this Slot: the last one landed gives it its task's icon
        const refills = DEPART.slots.map((_, k) => k).filter(k => DEPART.slots[k] === i);
        const landed = refills.filter(k => t >= departAt(k) + FLY).pop();
        const freed = refills.some(k => t >= departAt(k) - 0.35 && t < departAt(k) + FLY);
        // a Slot waiting for a refill holds another task than the one it gets
        let icon = steadySlotIcon(i);
        if (landed !== undefined) icon = activityIcon(landed);
        else if (refills.length > 0) icon = activityIcon(i * 2 + 1);
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
        const x = lerp(laneHeadX(s.lane, INTRO_LANE.left), INTRO_WORKER.x + cx, p);
        const y = lerp(laneY, INTRO_WORKER.y + cy, p);
        place(s.fly, x, y, 1 - 0.3 * p, 1);
      }
    },
  });
}
