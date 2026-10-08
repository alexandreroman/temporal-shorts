// ===================== 7. TEMPORAL TODAY
// The block keeps every name declared in this file local to this scene.
{
  // Two columns: customers and team on the left, valuation on the right
  // the customers tile on top of the team tile, 60 px apart, from y 330 to 850 like the chart
  const LEFT = { x: 530, w: 820 };
  const CUSTOMERS = { top: 330, h: 290 };
  const TEAM = { h: 170, bottom: 850 };
  const NAMES = ['Netflix', 'Snap', 'NVIDIA', 'Salesforce', 'Shopify'];
  const CHART = { x: 1400, y: 590, w: 800, h: 520 };
  // valuations in billions of dollars; bar heights are proportional to them
  const ROUNDS = [
    { date: '2022', value: 1.5, label: '$1.5B' },
    { date: '2025', value: 1.72, label: '$1.72B' },
    { date: 'Feb 2026', value: 5, label: '$5B' },
    { date: 'Sep 2026', value: 12.55, label: '$12.55B' },
  ];
  const BAR = { w: 124, maxH: 300, baseline: 420, x0: 136, gap: 176 }; // inside the chart tile
  const LAST = ROUNDS.length - 1;
  const barH = value => Math.round(BAR.maxH * value / ROUNDS[LAST].value);

  scene({
    chapter: 7, title: 'Temporal today',
    // the customers tile alone in the middle, then the whole layout as the chart comes in
    shift: (t, c) => pan(t, [430, 47], [[c[1], 0, -68]], 0.8),
    subs: [
      {
        text: "Today, more than 4,300 companies pay for it, "
          + "including Netflix, Snap, NVIDIA, Salesforce and Shopify.",
        after: 0.4,
      },
      {
        text: "In September 2026, investors valued Temporal at $12.55 billion. The team has doubled in a year.",
        after: 1.0,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);

      s.customers = makeCounter(root, 'Paying customers', LEFT.w);

      s.customers.style.height = CUSTOMERS.h + 'px';
      s.customers.insertAdjacentHTML('beforeend',
        '<div style="position:absolute;left:24px;right:24px;bottom:28px;height:50px;overflow:hidden">'
        + '<div class="belt" style="display:flex;gap:16px;width:max-content"></div></div>');
      // the names on a belt: two copies of the list, so it can loop once it starts moving
      s.belt = s.customers.querySelector('.belt');
      s.names = [...NAMES, ...NAMES].map(name => {
        const e = tag(s.belt, name);
        Object.assign(e.style, { position: 'static', fontSize: '20px' });
        return e;
      });

      s.team = makeCounter(root, 'Employees', LEFT.w);
      s.team.note.textContent = 'DOUBLED IN A YEAR';
      s.team.note.style.color = C.violet;
      s.team.style.height = TEAM.h + 'px';

      s.chart = E(root, '<div class="lbl" style="position:absolute;left:24px;top:18px;padding-left:0;font-size:16px">'
        + 'Valuation</div>', 'tile', { width: CHART.w + 'px', height: CHART.h + 'px' });
      s.chart.insertAdjacentHTML('beforeend',
        `<div style="position:absolute;left:40px;right:40px;top:${BAR.baseline}px;border-top:1.5px solid ${C.line}">`
        + '</div>');
      s.bars = ROUNDS.map((round, i) => {
        const x = BAR.x0 + i * BAR.gap - BAR.w / 2;
        const highlighted = i === LAST;
        const bar = E(s.chart, '', '', {
          left: x + 'px', top: (BAR.baseline - barH(round.value)) + 'px', width: BAR.w + 'px',
          height: barH(round.value) + 'px', borderRadius: '6px 6px 0 0', transformOrigin: '50% 100%',
          background: highlighted ? `linear-gradient(180deg, ${C.violet}, ${C.uv})` : 'rgba(148,163,184,.28)',
        });
        bar.value = E(s.chart, round.label, 'mono', {
          left: x + 'px', width: BAR.w + 'px', textAlign: 'center',
          top: (BAR.baseline - barH(round.value) - (highlighted ? 52 : 42)) + 'px',
          fontSize: highlighted ? '32px' : '24px', color: highlighted ? C.ink : C.slate,
        });
        bar.date = E(s.chart, round.date, 'lbl', {
          left: (x - 20) + 'px', width: (BAR.w + 40) + 'px', textAlign: 'center', top: (BAR.baseline + 18) + 'px',
          fontSize: '18px',
        });
        return bar;
      });
      // the trend through the tops of the bars, and a burst of light at the last one
      const tops = ROUNDS.map((round, i) => [BAR.x0 + i * BAR.gap, BAR.baseline - barH(round.value)]);
      s.trendSvg = document.createElementNS(SVGNS, 'svg');
      Object.assign(s.trendSvg.style, { position: 'absolute', left: 0, top: 0, overflow: 'visible' });
      s.trendSvg.setAttribute('width', CHART.w); s.trendSvg.setAttribute('height', CHART.h);
      s.chart.appendChild(s.trendSvg);
      // 70 px over the bar tops, above the value labels; it levels off just left of the last label to stay clear of it
      const points = tops.map(([x, y]) => [x, y - 70]);
      points.splice(LAST, 0, [tops[LAST][0] - 70, tops[LAST][1] - 70]);
      s.trend = path(s.trendSvg, 'M ' + points.map(([x, y]) => `${x} ${y}`).join(' L '), C.violet, 3, false);
      s.trend.style.filter = 'drop-shadow(0 0 6px rgba(182,100,255,.8))';
      const [lx, ly] = tops[LAST];
      s.burstAt = [lx, ly - 70];
      s.rays = Array.from({ length: 10 }, (_, k) => {
        const a = (k / 10) * Math.PI * 2;
        return path(s.trendSvg, `M ${lx + Math.cos(a) * 20} ${ly - 70 + Math.sin(a) * 20} `
          + `L ${lx + Math.cos(a) * 64} ${ly - 70 + Math.sin(a) * 64}`, C.neon, 2.5, false);
      });
      s.burst = makeSpark(s.chart, 18, '219,255,75');
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      // customers: the count rolls up, then the names pop in as the subtitle reads them, then the belt starts to
      // move (ambient loop, driven by G)
      rise(s.customers, LEFT.x, CUSTOMERS.top + CUSTOMERS.h / 2, P(t, c[0] + 0.2, 0.5));
      const counted = P(t, c[0] + 0.4, 1.8);
      s.customers.n.textContent = Math.round(4300 * counted).toLocaleString('en-US') + (counted >= 1 ? '+' : '');
      s.names.forEach((e, i) => {
        // the second copy of the list only shows once the belt moves
        const at = i < NAMES.length ? c[0] + 2.6 + i * 0.35 : c[0] + 4.6;
        const p = P(t, at, 0.45, backOut);
        e.style.opacity = clamp(p * 2);
        e.style.transform = `scale(${p})`;
      });
      const beltFrom = c[0] + 5.0;
      const moving = Math.max(0, G - this.start - beltFrom) * 45 * (t >= beltFrom ? 1 : 0);
      const loop = s.names[NAMES.length].offsetLeft - s.names[0].offsetLeft;
      s.belt.style.transform = loop > 0 ? `translateX(${-(moving % loop).toFixed(2)}px)` : '';

      // valuation: the bars grow one by one, the last one highlighted; then the team
      place(s.chart, CHART.x, CHART.y, 1, P(t, c[1] + 0.1, 0.4));
      s.bars.forEach((bar, i) => {
        const at = c[1] + 0.4 + i * 0.45;
        const grow = P(t, at, 0.6);
        bar.style.opacity = grow > 0 ? 1 : 0;
        bar.style.transform = `scaleY(${grow})`;
        bar.value.style.opacity = P(t, at + 0.5, 0.3);
        bar.date.style.opacity = P(t, c[1] + 0.2, 0.4);
      });
      const last = s.bars[LAST].value;
      last.style.transform = `scale(${swell(t, c[1] + 2.2, 0.25)})`;
      // the trend line climbs over the bars, then a burst of light on $12.55B
      draw(s.trend, P(t, c[1] + 2.0, 0.9));
      const burst = c[1] + 2.8;
      s.rays.forEach((ray, k) => {
        const r = P(t, burst + (k % 2) * 0.06, 0.6);
        draw(ray, r, r > 0 && r < 1 ? 1 - r : 0);
      });
      place(s.burst, ...s.burstAt, 1 + 0.6 * win(t, burst, burst + 0.3, 0.15), P(t, burst - 0.1, 0.2));
      // the team: the count rolls up too
      rise(s.team, LEFT.x, TEAM.bottom - TEAM.h / 2, P(t, c[1] + 3.8, 0.5));
      s.team.n.textContent = Math.round(570 * P(t, c[1] + 3.9, 1.0));
    }
  });
}
