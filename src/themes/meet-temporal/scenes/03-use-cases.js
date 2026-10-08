// ===================== 3. WHERE TEMPORAL IS USED
// The block keeps every name declared in this file local to this scene.
{
  // A hub-and-spoke map: the Temporal symbol in the middle, four spokes out to four category hubs, each hub with
  // its three examples as icon bubbles fanned out on its outer side
  const CENTER = { x: 960, y: 520 };
  const SYMBOL_SIZE = 120;
  const HUB_SIZE = 150;
  const BUBBLE = { size: 90, r: 160 }; // bubble size and distance from its hub
  const FLOAT = 4; // how far a bubble floats around its place, in px
  // hubs at the four diagonals; `angles`: directions of the hub's three bubbles, away from the center (degrees,
  // clockwise from the x axis)
  const HUBS = [
    { name: 'Process', x: 520, y: 370, angles: [170, 230, 290] },
    { name: 'Lifecycle', x: 1400, y: 370, angles: [250, 310, 10] },
    { name: 'Operational', x: 520, y: 670, angles: [190, 130, 70] },
    { name: 'AI', x: 1400, y: 670, angles: [110, 50, 350] },
  ];
  // the examples of each hub, [icon, label], in the order of its angles
  const EXAMPLES = [
    [['card', 'Payments'], ['cart', 'Orders'], ['ticket', 'Bookings']],
    [['retry', 'Subscriptions'], ['user', 'User accounts'], ['box', 'Inventory']],
    [['code', 'CI/CD'], ['server', 'Provisioning'], ['pipeline', 'Data pipelines']],
    [['sparkle', 'Agents'], ['search', 'RAG flows'], ['chip', 'Model training']],
  ];
  const AI = HUBS.length - 1, OPERATIONAL = 2;
  const bubbleAt = (hub, k) => {
    const a = hub.angles[k] * Math.PI / 180;
    return [hub.x + Math.cos(a) * BUBBLE.r, hub.y + Math.sin(a) * BUBBLE.r];
  };
  // the spoke from the symbol's edge to the hub's edge
  function spokeD(hub) {
    const dx = hub.x - CENTER.x, dy = hub.y - CENTER.y, d = Math.hypot(dx, dy);
    const from = SYMBOL_SIZE / 2 + 16, to = d - HUB_SIZE / 2 - 8;
    return `M ${CENTER.x + dx / d * from} ${CENTER.y + dy / d * from} L ${CENTER.x + dx / d * to} `
      + `${CENTER.y + dy / d * to}`;
  }

  // Round category hub: the category in bold, then WORKFLOWS lighter, on UV
  const makeHub = (root, name) => E(root,
    `<b>${name}</b><span style="opacity:.75;font-size:13px;margin-top:4px">Workflows</span>`, 'mono', {
      width: HUB_SIZE + 'px', height: HUB_SIZE + 'px', borderRadius: '50%', background: C.uv, color: '#FFFFFF',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontSize: '15px', letterSpacing: '.08em', paddingLeft: '.08em', textTransform: 'uppercase',
    });
  // Example bubble: a round tile with a stroke icon, its mono label on its outer side, away from the link to its
  // hub: beside it when the bubble sits mostly left or right of the hub (angle in degrees), else above or under it
  function makeBubble(root, [icon, label], angle) {
    const a = angle * Math.PI / 180;
    let labelAt;
    if (Math.abs(Math.cos(a)) >= 0.6) {
      labelAt = Math.cos(a) < 0 ? 'right:calc(100% + 14px);top:50%;transform:translateY(-50%)'
        : 'left:calc(100% + 14px);top:50%;transform:translateY(-50%)';
    } else {
      labelAt = (Math.sin(a) < 0 ? 'bottom' : 'top') + ':calc(100% + 12px);left:50%;transform:translateX(-50%)';
    }
    const e = E(root,
      `<div class="disc" style="width:${BUBBLE.size}px;height:${BUBBLE.size}px;border-radius:50%;`
      + `background:var(--surface);border:1.5px solid ${C.line};display:flex;align-items:center;`
      + `justify-content:center">${ICON(icon, 40, C.ink, 1.7)}</div>`
      + `<div class="lbl" style="position:absolute;${labelAt};font-size:16px">`
      + `${label}</div>`,
      '', { width: BUBBLE.size + 'px', height: BUBBLE.size + 'px' });
    e.disc = e.querySelector('.disc');
    e.label = e.querySelector('.lbl');
    return e;
  }

  scene({
    chapter: 3, title: 'Where Temporal is used',
    // laid out centered at (960, 522) on the free band
    subs: [
      {
        text: "A <b>Workflow</b> is any process that must finish correctly: payments, orders, bookings, subscriptions.",
        after: 0.4,
      },
      { text: "Teams also run infrastructure, data pipelines and, more and more, AI on Temporal.", after: 1.2 },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.glow = E(root, '', '', {
        width: '420px', height: '420px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(182,100,255,.35) 0%, rgba(68,76,231,.12) 45%, rgba(68,76,231,0) 70%)',
      });
      s.aiGlow = E(root, '', '', {
        width: '640px', height: '640px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(182,100,255,.4) 0%, rgba(68,76,231,.15) 45%, rgba(68,76,231,0) 70%)',
      });
      s.svg = svgLayer(root);
      s.spokes = HUBS.map(hub => path(s.svg, spokeD(hub), C.violet, 2.5, false));
      // hub to bubble links, redrawn every frame as the bubbles float
      s.links = HUBS.map(() => [0, 1, 2].map(() => path(s.svg, 'M 0 0 L 1 1', C.line, 1.5, false)));
      s.symbol = E(root, `<img src="${SYMBOL}" style="width:${SYMBOL_SIZE}px;height:${SYMBOL_SIZE}px;display:block">`);
      s.pulses = HUBS.map(() => makeSpark(root, 16, '182,100,255'));
      s.hubs = HUBS.map(hub => makeHub(root, hub.name));
      s.bubbles = EXAMPLES.map((examples, i) => examples.map((example, k) => makeBubble(root, example,
        HUBS[i].angles[k])));
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      // the symbol glows in the middle, the spokes draw out with a pulse of light, each hub pops as its pulse lands
      place(s.symbol, CENTER.x, CENTER.y, P(t, c[0] + 0.1, 0.5, backOut), P(t, c[0] + 0.1, 0.3));
      place(s.glow, CENTER.x, CENTER.y, 1 + 0.05 * Math.sin(G * 1.5), P(t, c[0] + 0.2, 0.6));
      const spokeAt = i => c[0] + 0.5 + i * 0.18;
      // examples the subtitle reads, [hub, example, when]; they light up and stay lit
      const reads = [
        [0, 0, c[0] + 3.6], [0, 1, c[0] + 4.1], [0, 2, c[0] + 4.6], [1, 0, c[0] + 5.3],
        [2, 0, c[1] + 1.0], [2, 1, c[1] + 1.2], [2, 2, c[1] + 2.0],
      ];
      const opsOn = c[1] + 0.9, aiOn = c[1] + 3.6;
      // once the AI hub lights up it grows and glows while the rest steps back; its glow carries into the next chapter
      const focus = P(t, aiOn, 0.6);
      place(s.aiGlow, HUBS[AI].x, HUBS[AI].y, 0.8 + 0.3 * focus, focus);

      HUBS.forEach((hub, i) => {
        const dim = i === AI ? 1 : 1 - 0.6 * focus;
        const prog = P(t, spokeAt(i), 0.5);
        draw(s.spokes[i], prog, (0.35 + 0.65 * (i === AI ? 1 : 1 - focus)));
        sparkOnPath(s.pulses[i], s.spokes[i], prog);
        const hp = P(t, spokeAt(i) + 0.45, 0.5, backOut);
        const lit = i === AI ? focus : i === OPERATIONAL ? P(t, opsOn, 0.4) : 0;
        place(s.hubs[i], hub.x, hub.y, hp * (1 + 0.12 * (i === AI ? focus : 0)) * swell(t, opsOn, i === OPERATIONAL
          ? 0.08 : 0), clamp(hp * 2) * dim);
        s.hubs[i].style.background = lit > 0.5 ? `linear-gradient(135deg, ${C.violet}, ${C.uv})` : C.uv;
        s.hubs[i].style.boxShadow = `0 0 ${Math.round(50 * lit)}px rgba(182,100,255,${(0.6 * lit).toFixed(3)})`;

        s.bubbles[i].forEach((b, k) => {
          const [bx, by] = bubbleAt(hub, k);
          // a gentle float around its place (ambient, driven by G), each bubble on its own phase
          const phase = (i * 3 + k) * 1.9;
          const x = bx + FLOAT * Math.sin(G * 0.9 + phase), y = by + FLOAT * Math.cos(G * 0.7 + phase);
          const bp = P(t, spokeAt(i) + 0.8 + k * 0.12, 0.45, backOut);
          place(b, x, y, bp, clamp(bp * 2) * dim);
          const hit = reads.find(([hi, ki]) => hi === i && ki === k);
          const read = (hit && t >= hit[2]) || (i === AI && focus > 0.5);
          b.disc.style.borderColor = read ? C.violet : C.line;
          b.disc.style.boxShadow = read ? '0 0 18px rgba(182,100,255,.45)' : 'none';
          b.label.style.color = read ? C.ink : C.slate;
          // the link from the hub's edge to the bubble's edge
          const d = Math.hypot(x - hub.x, y - hub.y);
          const ux = (x - hub.x) / d, uy = (y - hub.y) / d;
          const link = s.links[i][k];
          link.setAttribute('d', `M ${hub.x + ux * (HUB_SIZE / 2 + 6)} ${hub.y + uy * (HUB_SIZE / 2 + 6)} `
            + `L ${x - ux * (BUBBLE.size / 2 + 6)} ${y - uy * (BUBBLE.size / 2 + 6)}`);
          link.style.opacity = clamp(bp * 2) * dim;
        });
      });
    }
  });
}
