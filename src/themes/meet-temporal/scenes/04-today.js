// ===================== 4. TEMPORAL TODAY
// The block keeps every name declared in this file local to this scene.
{
  // Three tiles on top (the product), then two columns: customers and team on the left, valuation on the right
  const TOP = { y: 210, w: 520, h: 130, xs: [380, 960, 1540] };
  const PRODUCT = [
    { name: 'Temporal 1.0', note: '2020' },
    { name: 'Temporal Cloud', note: 'Managed service' },
    { name: 'Open source', note: 'MIT license' },
  ];
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

  // Product tile: a name in the brand font and a mono note under it, centered
  function makeProductTile(root, { name, note }) {
    return E(root,
      `<div style="font-size:38px;letter-spacing:-.5px;line-height:1.1">${name}</div>`
      + `<div class="lbl" style="font-size:18px;margin-top:10px">${note}</div>`,
      'tile', {
        width: TOP.w + 'px', height: TOP.h + 'px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      });
  }

  scene({
    chapter: 4, title: 'Temporal today',
    shift: [0, 25],
    subs: [
      {
        text: "Temporal 1.0 shipped in 2020, then Temporal Cloud, a managed service. The code stays open source.",
        after: 0.4,
      },
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
    build(root, s) {
      s.svg = svgLayer(root);
      s.product = PRODUCT.map(item => makeProductTile(root, item));
      const gapX = TOP.xs[0] + TOP.w / 2;
      s.arrow = path(s.svg, `M ${gapX + 8} ${TOP.y} L ${TOP.xs[1] - TOP.w / 2 - 10} ${TOP.y}`, C.slate, 2.5);

      s.customers = makeCounter(root, 'Paying customers', LEFT.w);
      s.customers.n.textContent = '4,300+';
      s.customers.style.height = CUSTOMERS.h + 'px';
      s.customers.insertAdjacentHTML('beforeend',
        '<div class="names" style="position:absolute;left:24px;right:24px;bottom:28px;display:flex;'
        + 'gap:16px"></div>');
      const names = s.customers.querySelector('.names');
      s.names = NAMES.map(name => {
        const e = tag(names, name);
        Object.assign(e.style, { position: 'static', fontSize: '20px' });
        return e;
      });

      s.team = makeCounter(root, 'Employees', LEFT.w);
      s.team.n.textContent = '570';
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
    },
    update(t, c, s) {
      // product: 1.0, then Cloud, then open source
      const productIn = [c[0] + 0.4, c[0] + 2.4, c[0] + 4.6];
      s.product.forEach((e, i) => rise(e, TOP.xs[i], TOP.y, P(t, productIn[i], 0.5)));
      draw(s.arrow, P(t, productIn[1] - 0.4, 0.4));

      // customers: the count, then the names as the subtitle reads them
      rise(s.customers, LEFT.x, CUSTOMERS.top + CUSTOMERS.h / 2, P(t, c[1] + 0.2, 0.5));
      s.names.forEach((e, i) => {
        const p = P(t, c[1] + 2.6 + i * 0.35, 0.45, backOut);
        e.style.opacity = clamp(p * 2);
        e.style.transform = `scale(${p})`;
      });

      // valuation: the bars grow one by one, the last one highlighted; then the team
      place(s.chart, CHART.x, CHART.y, 1, P(t, c[2] + 0.1, 0.4));
      s.bars.forEach((bar, i) => {
        const at = c[2] + 0.4 + i * 0.45;
        const grow = P(t, at, 0.6);
        bar.style.opacity = grow > 0 ? 1 : 0;
        bar.style.transform = `scaleY(${grow})`;
        bar.value.style.opacity = P(t, at + 0.5, 0.3);
        bar.date.style.opacity = P(t, c[2] + 0.2, 0.4);
      });
      const last = s.bars[LAST].value;
      last.style.transform = `scale(${swell(t, c[2] + 2.2, 0.25)})`;
      rise(s.team, LEFT.x, TEAM.bottom - TEAM.h / 2, P(t, c[2] + 3.8, 0.5));
    }
  });
}
