// ===================== 5. OPEN SOURCE AND CLOUD
// The block keeps every name declared in this file local to this scene.
{
  // Three tiles on top (open source, Temporal 1.0, self-hosted), then the Temporal Cloud diagram: your environment
  // on the left, Temporal Cloud on the right, a one-way arrow between them
  const TOP = { y: 212, w: 520, h: 120, xs: [380, 960, 1540] };
  const PRODUCT = [
    { name: 'Open source', note: 'MIT license' },
    { name: 'Temporal 1.0', note: '2020' },
    { name: 'Self-hosted', note: 'On your own servers' },
  ];
  const YOURS = { x: 410, y: 605, w: 580, h: 540 };
  const CLOUD = { x: 1450, y: 605, w: 700, h: 540 };
  const ARROW = { x0: YOURS.x + YOURS.w / 2, x1: CLOUD.x - CLOUD.w / 2, y: 560 };
  const ARROW_X = (ARROW.x0 + ARROW.x1) / 2;
  const APP = { x: YOURS.x, y: 590, w: 500, h: 360 };
  const SERVICE = { x: CLOUD.x, y: 475, w: 620, h: 170 };
  const BARS = ['Security & compliance', 'Control plane & scale', 'High availability'];
  const BAR = { y0: 600, gap: 62, w: 620, h: 50 };
  const NEVER_Y = 826;
  const PACKETS = 4; // data packets flowing out along the arrow
  const SECRET = 'card: $42'; // the data that leaves your environment, encrypted on the way
  const DATA_LANDING = { x: SERVICE.x, y: SERVICE.y + 48 }; // inside the Temporal Service box, under its title
  // the data's lane over the arrow: its 38 px chip clears the arrow's packets by 12 px
  const DATA_LANE = ARROW.y - 36;

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
  // Your environment: a dashed slate zone, labelled on top and at the bottom
  function makeYourZone(root) {
    return E(root,
      '<div class="lbl" style="position:absolute;left:24px;top:20px;padding-left:0;font-size:18px">'
      + 'Your environment</div>'
      + '<div class="lbl" style="position:absolute;left:0;right:0;bottom:22px;font-size:18px;text-align:center;'
      + 'color:var(--ink)">Your app, your code</div>',
      '', {
        width: YOURS.w + 'px', height: YOURS.h + 'px', border: '2px dashed ' + C.slate, borderRadius: 'var(--r)',
        background: 'rgba(148,163,184,.04)',
      });
  }
  // Your app: an app panel with a small Workflow card (a title and four step bars) and the SDK chip under it
  function makeYourApp(root) {
    const app = makeAppPanel(root, 'YOUR APP', APP.w, APP.h, { font: 20, statusFont: 16, statusTop: 24 });
    const bars = [0, 1, 2, 3].map(i => `<i style="position:absolute;left:24px;top:${56 + i * 32}px;width:`
      + `${[220, 260, 190, 240][i]}px;height:14px;border-radius:3px;background:${C.uvTint}"></i>`).join('');
    app.insertAdjacentHTML('beforeend',
      '<div style="position:absolute;left:24px;right:24px;top:76px;height:196px;background:rgba(248,250,252,.03);'
      + `border:1.5px solid ${C.line};border-radius:var(--r)">`
      + panelLabel('code', 'Workflow', 'left:20px;top:14px;padding-left:0') + bars + '</div>'
      + '<div class="pill uv" style="position:absolute;left:24px;right:24px;bottom:20px;text-align:center;'
      + 'font-size:18px;line-height:24px">Temporal SDK · open source</div>');
    return app;
  }
  // Temporal Cloud: UV zone with the official logo and a "Cloud" label in its header
  function makeCloudZone(root) {
    return E(root,
      `<img src="${LOGO}" style="position:absolute;left:24px;top:20px;height:34px;display:block">`
      + '<div class="lbl" style="position:absolute;right:24px;top:26px;font-size:18px;color:var(--ink)">Cloud</div>',
      'tile', { width: CLOUD.w + 'px', height: CLOUD.h + 'px', borderColor: C.uv, background: '#17182A' });
  }

  scene({
    chapter: 5, title: 'Open source and Cloud',
    holdBeforeEnd: CAMERA_EXIT, // presenter mode holds before the exit zoom
    // laid out centered at (960, 522) on the free band
    subs: [
      {
        text: "Temporal is open source: Temporal 1.0 shipped in 2020, and anyone can run it on their own servers.",
        after: 0.4,
      },
      {
        text: "Temporal Cloud runs the service for you. Your code stays in your environment: Temporal never sees it.",
        after: 0.6,
      },
      { text: "Connections only go out from your side, and data stays encrypted end to end.", after: 1.4 },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.product = PRODUCT.map(item => makeProductTile(root, item));
      s.yours = makeYourZone(root);
      s.app = makeYourApp(root);
      s.cloud = makeCloudZone(root);
      s.service = E(root, 'Temporal Service', '', {
        width: SERVICE.w + 'px', height: SERVICE.h + 'px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '40px', letterSpacing: '-.5px', background: 'rgba(68,76,231,.22)',
        paddingBottom: '50px', // the title sits in the upper part, the encrypted data lands under it
        border: '1.5px solid ' + C.uv, borderRadius: 'var(--r)',
      });
      s.bars = BARS.map(text => E(root, text, 'mono', {
        width: BAR.w + 'px', height: BAR.h + 'px', lineHeight: BAR.h + 'px', textAlign: 'center',
        fontSize: '18px', letterSpacing: '.12em', paddingLeft: '.12em', textTransform: 'uppercase',
        background: C.uv, color: '#FFFFFF', borderRadius: 'var(--rs)',
      }));
      s.never = tag(root, 'Never sees your code', 'neon');
      s.svg = svgLayer(root);
      s.arrow = path(s.svg, `M ${ARROW.x0 + 16} ${ARROW.y} L ${ARROW.x1 - 14} ${ARROW.y}`, C.ink, 3);
      s.outbound = E(root, 'Outbound only', 'lbl', { color: 'var(--ink)', fontSize: '18px' });
      s.mtls = E(root, 'mTLS', 'lbl', { fontSize: '15px' });
      // the lock's shackle is its own path, so it can snap shut
      s.encrypted = E(root,
        `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${C.neon}" stroke-width="2"`
        + ' stroke-linecap="square" style="display:block;overflow:visible"><rect x="5" y="11" width="14" height="10"/>'
        + '<path d="M12 15v2"/><path class="shackle" d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
        + '<span>End-to-end encryption</span>',
        'pill neon solid', { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' });
      s.shackle = s.encrypted.querySelector('.shackle');
      // data packets flowing out, an inbound attempt bounced back, and a piece of data encrypted on its way
      s.packets = Array.from({ length: PACKETS }, () => makeSpark(root, 10, '219,255,75'));
      s.inbound = makeSpark(root, 14, '255,90,95');
      s.block = E(root, ICON('x', 30, C.red, 3));
      s.data = E(root, SECRET, 'mono', {
        fontSize: '20px', padding: '6px 12px', background: C.uvTint, color: '#141414', borderRadius: 'var(--rs)',
        whiteSpace: 'nowrap',
      });
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      // open source first, then Temporal 1.0, then running it yourself, as the subtitle reads them
      const productIn = [c[0] + 0.4, c[0] + 1.8, c[0] + 4.4];
      s.product.forEach((e, i) => rise(e, TOP.xs[i], TOP.y, P(t, productIn[i], 0.5)));

      // Temporal Cloud runs the service, then your environment keeps your code
      rise(s.cloud, CLOUD.x, CLOUD.y, P(t, c[1] + 0.3, 0.6));
      rise(s.service, SERVICE.x, SERVICE.y, P(t, c[1] + 0.7, 0.5), 16);
      s.bars.forEach((e, i) => rise(e, CLOUD.x, BAR.y0 + i * BAR.gap, P(t, c[1] + 1.0 + i * 0.2, 0.45), 16));
      rise(s.yours, YOURS.x, YOURS.y, P(t, c[1] + 2.2, 0.6));
      rise(s.app, APP.x, APP.y, P(t, c[1] + 2.5, 0.5), 16);
      const np = P(t, c[1] + 4.6, 0.45, backOut);
      place(s.never, CLOUD.x, NEVER_Y, np, clamp(np * 2));

      // the one-way connection, from your side out to Temporal Cloud, then encryption end to end
      draw(s.arrow, P(t, c[2] + 0.3, 0.7));
      // the labels sit under the arrow, so the data crossing above it never passes over them
      place(s.outbound, ARROW_X, ARROW.y + 25, 1, P(t, c[2] + 0.8, 0.4));
      place(s.mtls, ARROW_X, ARROW.y + 54, 1, P(t, c[2] + 1.1, 0.4));
      const ep = P(t, c[2] + 3.0, 0.45, backOut);
      place(s.encrypted, ARROW_X, ARROW.y + 130, ep, clamp(ep * 2));
      // the lock snaps shut as the tag lands
      const snap = P(t, c[2] + 3.4, 0.2, easeIn);
      s.shackle.setAttribute('transform', `translate(0 ${(-4 * (1 - snap)).toFixed(2)})`);

      // once the arrow is drawn, packets flow out continuously (ambient loop, driven by G)
      const flowing = P(t, c[2] + 1.0, 0.4);
      s.packets.forEach((e, k) => {
        const phase = (G * 0.7 + k / PACKETS) % 1;
        const x = lerp(ARROW.x0 + 24, ARROW.x1 - 30, phase);
        place(e, x, ARROW.y, 1, flowing * Math.min(1, phase * 8, (1 - phase) * 8));
      });
      // an inbound attempt from Temporal Cloud bounces off your environment's edge
      const inbound = c[2] + 1.4;
      const go = P(t, inbound, 0.6, easeIn), back = P(t, inbound + 0.6, 0.5);
      const ix = lerp(lerp(ARROW.x1 - 20, ARROW.x0 + 20, go), ARROW.x1 - 120, back);
      place(s.inbound, ix, ARROW.y + 84, 1, win(t, inbound, inbound + 1.0, 0.15));
      const bp = P(t, inbound + 0.6, 0.3, backOut);
      place(s.block, ARROW.x0 + 16, ARROW.y + 84, bp, win(t, inbound + 0.6, inbound + 1.6, 0.2));

      // a piece of data leaves your app and crosses over, encrypted as it leaves your environment; it stays
      // encrypted in Temporal Cloud
      const sent = c[2] + 2.2;
      const dp = P(t, sent, 1.4);
      // it rises out of the app into a lane just above the arrow (DATA_LANE), crosses over in it, and drifts into
      // the Temporal Service box
      const dx = lerp(APP.x + 100, DATA_LANDING.x, dp);
      const lift = (1 - Math.cos(Math.PI * clamp((dx - APP.x - 100) / (ARROW.x0 - 10 - APP.x - 100)))) / 2;
      const dy = lerp(lerp(APP.y + 20, DATA_LANE, lift), DATA_LANDING.y, clamp((dx - ARROW.x1) / (DATA_LANDING.x
        - ARROW.x1)));
      const encrypted = clamp((dx - (ARROW.x0 - 40)) / 120);
      // the glyphs flicker on the ambient clock G counted from the scene's start (equal to t in rendered frames),
      // so the live player sees a still scene once the data has landed
      s.data.textContent = scramble(SECRET, Math.round(encrypted * SECRET.length), Math.floor((G - this.start) * 20));
      s.data.style.background = encrypted > 0.5 ? C.neonTint : C.uvTint;
      place(s.data, Math.round(dx), Math.round(dy), 1, P(t, sent - 0.2, 0.3) * (1 - P(t, c[2] + 5.2, 0.4)));
    }
  });
}
