// ===================== 5. DEADLINES AND REMINDERS
// The block keeps every name declared in this file local to this scene.
{
  const LINE = { y: 380, x0: 285, dayW: 270 }; // DAY 0 to DAY 5, one day every dayW pixels
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
  const CARD = { y: 656, w: 1100, h: rowTop(TIMER_ROWS.length) - HROW.gap + HROW.h + 24 };
  const USES = [['check', 'Approvals'], ['eye', 'Reviews'], ['pen', 'Signatures'], ['bot', 'AI agent checks']];
  scene({
    chapter: 5, title: 'Deadlines and reminders',
    // the timeline and its history, then the use-case tiles as the timeline fades out
    shift: (t, c) => pan(t, [-19, 24], [[c[1], 0, 62]], 0.6),
    subs: [
      {
        text: "No answer? The Workflow can also wait on a timer: a reminder after two days, escalate after five.",
        after: 1.4,
      },
      {
        text: "Approvals, reviews, signatures, an AI agent asking before it acts: the same pattern fits them all.",
        after: 1.8,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.line = path(s.svg, `M ${dayX(0)} ${LINE.y} L ${dayX(5)} ${LINE.y}`, C.line, 3, false);
      s.done = path(s.svg, `M ${dayX(0)} ${LINE.y} L ${dayX(5)} ${LINE.y}`, C.violet, 3, false);
      s.ticks = [0, 1, 2, 3, 4, 5].map(() => E(root, '', '', { width: '3px', height: '22px', background: C.slate }));
      s.days = [0, 1, 2, 3, 4, 5].map(d => E(root, 'Day ' + d, 'lbl'));
      s.marker = E(root, ICON('hourglass', 30, C.ink, 2), '', {
        width: '54px', height: '54px', background: C.violet, borderRadius: '50%', display: 'flex',
        alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 22px 6px rgba(182,100,255,.4)',
      });
      s.events = EVENTS.map(([, icon, label]) => ({
        tile: E(root, ICON(icon, 58, C.ink, 1.6), 'tile', {
          width: '124px', height: '124px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }),
        tag: tag(root, label, 'violet'),
        stem: E(root, '', '', { width: '2px', height: '50px' }),
      }));
      s.jr = makeHistory(root, TIMER_ROWS, CARD.w, CARD.h);
      s.durable = tag(root, 'Timers are durable too', 'uv big');
      s.uses = USES.map(([icon, label]) => iconTile(root, icon, label, 330, 230));
    },
    update(t, c, s) {
      const out = P(t, c[1], 0.5);
      // the marker walks about 0.7 s per day: DAY 2 near c[0] + 1.8, DAY 5 near c[0] + 3.8
      const walkOn = c[0] + 0.4, perDay = 0.68;
      const dayAt = d => walkOn + d * perDay;
      const lp = P(t, c[0] + 0.05, 0.5);
      draw(s.line, lp, 1 - out);
      [0, 1, 2, 3, 4, 5].forEach(d => {
        const p = P(t, c[0] + 0.1 + d * 0.05, 0.3) * (1 - out);
        place(s.ticks[d], dayX(d), LINE.y, 1, p);
        place(s.days[d], dayX(d), LINE.y + 46, 1, p);
      });
      const walk = clamp((t - walkOn) / (5 * perDay));
      draw(s.done, walk, 1 - out);
      place(s.marker, lerp(dayX(0), dayX(5), walk), LINE.y, 1, P(t, c[0] + 0.2, 0.3) * (1 - out));
      s.events.forEach(({ tile, tag: e, stem }, i) => {
        const [day] = EVENTS[i];
        // the request is already out when the marker starts walking
        const firedAt = day === 0 ? c[0] + 0.3 : dayAt(day);
        const fired = t >= firedAt;
        const p = P(t, c[0] + 0.1 + i * 0.1, 0.45, backOut);
        tile.style.borderColor = fired ? C.violet : C.line;
        place(tile, dayX(day), LINE.y - 130, p, clamp(p * 2) * (1 - out));
        stem.style.background = fired ? C.violet : C.line;
        place(stem, dayX(day), LINE.y - 43, 1, P(t, c[0] + 0.3, 0.3) * (1 - out));
        const tp = P(t, firedAt, 0.45, backOut);
        place(e, dayX(day), LINE.y - 236, tp, clamp(tp * 2) * (1 - out));
      });

      // Temporal writes each timer to the Event History, so the timers survive restarts like the wait itself
      place(s.jr, 960, CARD.y, 1, P(t, c[0] + 0.2, 0.4) * (1 - out));
      const saved = [c[0] + 0.7, c[0] + 0.9, dayAt(2) + 0.2, dayAt(5) + 0.2];
      saved.forEach((at, i) => {
        showRow(s.jr, i, P(t, at - 0.1, 0.3));
        setRowTag(s.jr, i, t, 'SAVED', at, P(t, at, 0.25));
      });
      const dp = P(t, c[0] + 4.5, 0.45, backOut);
      place(s.durable, 960, CARD.y + CARD.h / 2 + 56, dp, clamp(dp * 2) * (1 - out));

      // the same pattern, wherever a person decides
      s.uses.forEach((e, i) => {
        const p = P(t, c[1] + 0.4 + i * 0.7, 0.45, backOut);
        place(e, 435 + i * 350, 460, p, clamp(p * 2));
      });
    }
  });
}
