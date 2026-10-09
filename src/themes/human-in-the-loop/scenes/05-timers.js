// ===================== 5. DEADLINES AND REMINDERS
// The block keeps every name declared in this file local to this scene.
{
  const LINE = { y: 395, x0: 285, dayW: 270 }; // DAY 0 to DAY 5, one day every dayW pixels
  const dayX = d => LINE.x0 + d * LINE.dayW;
  // events on the timeline, [day, icon, what happens]: the request, then the two timers set by the Workflow
  const EVENTS = [
    [0, 'user', 'Approval requested'], [2, 'bell', 'Reminder sent'], [5, 'up', 'Escalated to a director'],
  ];
  // the Event History rows of the timers: both start at DAY 0, then each fires on its day
  const TIMER_ROWS = [
    'Timer started: reminder in 2 days', 'Timer started: escalation in 5 days',
    'Timer fired: reminder due', 'Timer fired: escalation due',
  ];
  // the Event History card is exactly as wide as the timeline (DAY 0 to DAY 5), 30 px under its day labels
  const CARD = { w: 5 * LINE.dayW, h: rowTop(TIMER_ROWS.length) - HROW.gap + HROW.h + 24 };
  CARD.y = LINE.y + 90 + CARD.h / 2;
  scene({
    chapter: 5, title: 'Deadlines and reminders',
    // laid out on the content frame, y 154-875 around y 515: event tags, tiles 30 px above the line, the timeline,
    // the Event History card, then the pill 30 px under it
    subs: [
      {
        text: "No answer? The Workflow can also wait on a <b>timer</b>: "
          + "a reminder after two days, escalation after five.",
        // the pill lands at c[0] + 4.95: the finished timeline reads to the end of the subtitle and this pause
        after: 1.4,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.line = path(s.svg, `M ${dayX(0)} ${LINE.y} L ${dayX(5)} ${LINE.y}`, C.line, 3, false);
      s.done = path(s.svg, `M ${dayX(0)} ${LINE.y} L ${dayX(5)} ${LINE.y}`, C.violet, 3, false);
      s.ticks = [0, 1, 2, 3, 4, 5].map(() => E(root, '', '', { width: '3px', height: '22px', background: C.slate }));
      s.days = [0, 1, 2, 3, 4, 5].map(d => E(root, 'Day ' + d, 'lbl', { fontSize: '22px' }));
      s.marker = E(root, ICON('hourglass', 30, C.ink, 2), '', {
        width: '54px', height: '54px', background: C.violet, borderRadius: '50%', display: 'flex',
        alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 22px 6px rgba(${RGB.violet},.4)`,
      });
      s.events = EVENTS.map(([, icon, label]) => ({
        tile: iconTile(root, icon, null, 124, 124, C.ink, { size: 58, stroke: 1.6 }),
        tag: tag(root, label, 'violet'),
        stem: E(root, '', '', { width: '2px', height: '30px' }),
      }));
      s.history = makeHistory(root, TIMER_ROWS, CARD.w, CARD.h);
      s.durable = tag(root, 'Timers are durable too', 'uv big');
    },
    update(t, c, s) {
      // the marker walks about 0.7 s per day: DAY 2 near c[0] + 1.8, DAY 5 near c[0] + 3.8
      const walkOn = c[0] + 0.4, perDay = 0.68;
      const dayAt = d => walkOn + d * perDay;
      const lp = P(t, c[0] + 0.05, 0.5);
      draw(s.line, lp);
      [0, 1, 2, 3, 4, 5].forEach(d => {
        const p = P(t, c[0] + 0.1 + d * 0.05, 0.3);
        place(s.ticks[d], dayX(d), LINE.y, 1, p);
        place(s.days[d], dayX(d), LINE.y + 48, 1, p);
      });
      const walk = clamp((t - walkOn) / (5 * perDay));
      draw(s.done, walk);
      place(s.marker, lerp(dayX(0), dayX(5), walk), LINE.y, 1, P(t, c[0] + 0.2, 0.3));
      s.events.forEach(({ tile, tag: e, stem }, i) => {
        const [day] = EVENTS[i];
        // the request is already out when the marker starts walking
        const firedAt = day === 0 ? c[0] + 0.3 : dayAt(day);
        const fired = t >= firedAt;
        const p = backPop(t, c[0] + 0.1 + i * 0.1);
        tile.style.borderColor = fired ? C.violet : C.line;
        place(tile, dayX(day), LINE.y - 110, p.s, p.o);
        stem.style.background = fired ? C.violet : C.line;
        place(stem, dayX(day), LINE.y - 33, 1, P(t, c[0] + 0.3, 0.3));
        const tp = backPop(t, firedAt);
        place(e, dayX(day), LINE.y - 216, tp.s, tp.o);
      });

      // Temporal writes each timer to the Event History, so the timers survive restarts like the wait itself
      place(s.history, dayX(0) + CARD.w / 2, CARD.y, 1, P(t, c[0] + 0.2, 0.4));
      const saved = [c[0] + 0.7, c[0] + 0.9, dayAt(2) + 0.2, dayAt(5) + 0.2];
      saved.forEach((at, i) => {
        showRow(s.history.rows[i], P(t, at - 0.1, 0.3));
        setRowTag(s.history, i, t, 'SAVED', at, P(t, at, 0.25));
      });
      const dp = backPop(t, c[0] + 4.5);
      place(s.durable, dayX(0) + CARD.w / 2, CARD.y + CARD.h / 2 + 63, dp.s, dp.o);
    }
  });
}
