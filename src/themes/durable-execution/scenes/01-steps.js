// ===================== 1. A PROCESS IN MANY STEPS
// Order card with a BUY button on top, the 4 step tiles below it, each step's service under it. Then the order
// card and the services give way to the code card: its highlight walks the 4 calls and runs the matching steps.
// The block keeps every name declared in this file local to this scene.
{
  const ROW = { x0: 375, gap: 390, y: 540, w: 290, h: 170 };
  // order card (136 px tall) and code card (256 px) both 110 px above the row and as wide as the two inner steps
  // (x 620 to 1300); services 150 px below the row, centered under their steps; ORDER COMPLETE (50 px) 50 px below
  const ABOVE_W = 680, ORDER_Y = 277, SERVICE_Y = 798, CODE_Y = 217, DONE_Y = 700;
  const SERVICE_LINK = [ROW.y + ROW.h / 2 + 4, SERVICE_Y - 28]; // y range of the link from a step to its service
  // c[1]: step i runs from RUN0 + i * RUN_GAP for RUN_D seconds, in step with the words of the subtitle
  const RUN0 = 0.2, RUN_GAP = 1.15, RUN_D = 0.9;
  // c[2]: the code highlight sits on the await line of step i from LINE0 + i * LINE_GAP
  const LINE0 = 1.2, LINE_GAP = 0.7;

  const makeOrderCard = root => {
    const e = E(root,
      `<div style="flex:1;display:flex;align-items:center;gap:26px">${ICON('bag', 56, C.ink, 1.6)}`
      + '<div style="text-align:left"><div class="lbl" style="font-size:18px;padding-left:0">Order #1042</div>'
      + '<div style="font-size:44px;line-height:1.1;margin-top:6px">Sneakers</div></div>'
      + '<div style="font-size:54px;margin-left:auto">$42</div>'
      + '<div class="buy mono" style="margin-left:40px;padding:15px 38px 15px calc(38px + .14em);font-size:26px;'
      + `letter-spacing:.14em;border:2px solid ${C.uv};border-radius:var(--rs)">BUY</div></div>`,
      'tile', {
        width: ABOVE_W + 'px', height: '136px', padding: '0 32px 0 24px', display: 'flex', alignItems: 'center',
      });
    e.buy = e.querySelector('.buy');
    return e;
  };
  const makeService = (root, name) => {
    const e = tag(root, `${ICON('server', 24, C.slate, 1.8)}${name}`);
    Object.assign(e.style, {
      display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', lineHeight: '26px',
    });
    return e;
  };

  scene({
    chapter: 1, title: 'A process in many steps',
    // order card + steps, then + services (pans as the first one appears), then code card + steps + ORDER COMPLETE
    // (pans as the services fade; measured compromise: 30 px high before ORDER COMPLETE, 20 px low with it)
    shift: (t, c) => pan(t, [0, 105], [[c[1], 0, 7], [c[2] + 0.1, 0, 128]], 0.9),
    subs: [
      { text: "Take an online order. Behind the Buy button, four steps run one after the other.", after: 0.4 },
      {
        text: "Charge the card, reserve the item, ship the package, email the receipt. "
          + "Each step calls another service.",
        after: 0.8,
      },
      {
        text: "For a developer, it's a short function: four calls, in order. Simple, as long as nothing fails.",
        after: 0.6,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.order = makeOrderCard(root);
      s.steps = makeStepRow(root, s.svg, ORDER_TILES, ROW.x0, ROW.gap, ROW.y, ROW.w, ROW.h);
      const [y0, y1] = SERVICE_LINK;
      s.links = s.steps.xs.map(x => path(s.svg, `M ${x} ${y0} L ${x} ${y1}`, C.line, 2, false));
      s.dots = s.steps.xs.map(() => E(root, '', '', {
        width: '14px', height: '14px', borderRadius: '50%', background: C.uv, boxShadow: `0 0 14px ${C.uv}`,
      }));
      s.services = ORDER_STEPS.map(step => makeService(root, step.service));
      s.code = makeCodeCard(root, { w: ABOVE_W });
      s.done = tag(root, `${ICON('check', 28, C.neon, 2.6)}Order complete`, 'neon');
      // whole-pixel width (content: 295.8 px; the pill is 50 px high), so the centered tag lands on whole pixels
      Object.assign(s.done.style, {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '296px',
      });
    },
    update(t, c, s) {
      // order card: pops in, its BUY button is pressed at `press`
      const press = c[0] + 1.5;
      const out = P(t, c[2], 0.4);
      const op = P(t, c[0] + 0.1, 0.5, backOut);
      place(s.order, 960, ORDER_Y, op, clamp(op * 2) * (1 - out));
      s.order.style.borderColor = t >= press ? C.uv : C.line;
      s.order.buy.style.transform = `scale(${1 - 0.1 * win(t, press - 0.12, press + 0.05, 0.12)})`;
      s.order.buy.style.background = t >= press ? C.uv : 'rgba(68,76,231,.15)';
      s.order.buy.style.boxShadow = t >= press ? `0 0 ${Math.round(24 * (1 - P(t, press, 0.8)))}px ${C.uv}` : 'none';
      // steps: first run in c[1], reset when the code card arrives, then run again line by line in c[2]
      const codeIn = c[2] + 0.4;
      const states = [0, 1, 2, 3].map(i => {
        if (t < codeIn) {
          const a = c[1] + RUN0 + i * RUN_GAP;
          return t < a ? 0 : t < a + RUN_D ? 1 : 2;
        }
        const a = c[2] + LINE0 + i * LINE_GAP;
        return t < a ? 0 : t < a + LINE_GAP ? 1 : 2;
      });
      placeStepRow(s.steps, t, c[0] + 2.0, states);
      // services: a link draws down from the step as it runs, a dot carries the call there and back
      s.services.forEach((e, i) => {
        const x = s.steps.xs[i], a = c[1] + RUN0 + i * RUN_GAP;
        draw(s.links[i], P(t, a, 0.3), 1 - out);
        // fades in without a bump, then its border lights up 0.3 s later
        place(e, x, SERVICE_Y, 1, P(t, a + 0.15, 0.2) * (1 - out));
        // busy while it handles the call, then all four light up together on "Each step calls another service"
        const busy = t >= a + 0.45 && t < a + RUN_D;
        const all = win(t, c[1] + 4.8 + i * 0.12, c[1] + 6.2, 0.3);
        e.style.borderColor = busy || all > 0.5 ? C.uv : '#4B5363';
        const down = P(t, a + 0.3, 0.25, x => x), up = P(t, a + 0.6, 0.25, x => x);
        const y = lerp(lerp(SERVICE_LINK[0], SERVICE_LINK[1], down), SERVICE_LINK[0], up);
        place(s.dots[i], x, y, 1, win(t, a + 0.3, a + 0.85, 0.05));
      });
      // code card: the highlight walks the 4 calls, each lighting its step, then ORDER COMPLETE
      const cp = P(t, codeIn, 0.5);
      rise(s.code, 960, CODE_Y, cp, 20);
      let line = awaitLine(ORDER_CODE, 0);
      for (let i = 1; i < 4; i++) line += P(t, c[2] + LINE0 + i * LINE_GAP, 0.2);
      setCodeLine(s.code, line, P(t, c[2] + LINE0 - 0.2, 0.3) * (1 - P(t, c[2] + LINE0 + 4 * LINE_GAP, 0.3)));
      const dp = popIn(t, c[2] + LINE0 + 4 * LINE_GAP + 0.2, 0.08);
      place(s.done, 960, DONE_Y, dp.s, dp.o);
    }
  });
}
