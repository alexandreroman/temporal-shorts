// ===================== 5. HOW TEMPORAL CLOUD WORKS
// The block keeps every name declared in this file local to this scene.
{
  // Two zones side by side, as in Temporal's deck: on the left, your application with its Workflow, managed by you
  // in your environment; on the right, the Temporal Service with its internals, managed by Temporal in Temporal's
  // environment; an arrow from the app to the service. Stage pixels: the zones share their top and bottom (y 150 to
  // 880) and span x 140 to 1780
  const YOURS = { x: 420, y: 515, w: 560, h: 730 };
  const CLOUD = { x: 1320, y: 515, w: 920, h: 730 };
  // each zone's caption, 24 px above its bottom
  const CAPTION_BOTTOM = 24;
  // your app, 32 px inside your zone: its header, then the Workflow card 24 px inside it, its activity rows, and the
  // SDK chip 24 px under the card and above the panel's bottom
  const APP = { x: YOURS.x, top: YOURS.y - YOURS.h / 2 + 32, w: YOURS.w - 64 };
  const CARD = { left: 24, top: 76, w: APP.w - 48 };
  const ROW = { top: 66, h: 72, gap: 22, inset: 20 };
  CARD.h = ROW.top + 4 * ROW.h + 3 * ROW.gap + 24;
  const CHIP_H = 48;
  APP.h = CARD.top + CARD.h + 24 + CHIP_H + 24;
  APP.y = APP.top + APP.h / 2;
  // the order of chapter 2, its steps run as the Workflow's activities
  const ACTIVITIES = [['cart', 'take the order'], ['card', 'charge the card'], ['box', 'ship the package'],
    ['mail', 'email the receipt']];
  // the Temporal Service, 40 px inside its zone under the logo: its title, the Front End bar, then the five
  // internals, the dispatch links between them (LINK_GAP high), all 24 px inside the box
  const SERVICE = { x: CLOUD.x, top: CLOUD.y - CLOUD.h / 2 + 78, w: CLOUD.w - 80 };
  const FRONT = { top: 80, h: 52 };
  const LINK_GAP = 36;
  // the five internals span the Front End bar's width (the box's inner width, inside its 1.5 px borders, less 24 px
  // on each side): 5 x 145 + 4 x 16 = 789 px
  const PART = { top: FRONT.top + FRONT.h + LINK_GAP, h: 112, gap: 16, w: 145 };
  SERVICE.h = PART.top + PART.h + 24;
  SERVICE.y = SERVICE.top + SERVICE.h / 2;
  const PARTS = [['book', ['History', 'Service']], ['retry', ['Matching', 'Service']], ['gear', ['Worker', 'Service']],
    ['search', ['Elasticsearch']], ['db', ['DB']]];
  // the four built-in qualities under the service box, 24 px under it, 14 px apart; the last ends at y 798, level
  // with your app's bottom, 35 px above the captions
  const BARS = ['Security & compliance', 'Custom persistence', 'Control plane & scale', 'High availability'];
  const BAR = { h: 50, gap: 14 };
  BAR.y0 = SERVICE.top + SERVICE.h + 24 + BAR.h / 2;
  // the arrow from the app's edge to a connector dot on the service box's edge, level with the Front End bar
  const ARROW = { x0: APP.x + APP.w / 2 + 8, x1: SERVICE.x - SERVICE.w / 2, y: SERVICE.top + FRONT.top + FRONT.h / 2 };
  const DOT = 18;
  // stage points of the service internals
  const partX = i => SERVICE.x - SERVICE.w / 2 + 1.5 + 24 + PART.w / 2 + i * (PART.w + PART.gap);
  const FRONT_BOTTOM = SERVICE.top + FRONT.top + FRONT.h;
  const PART_TOP = SERVICE.top + PART.top;
  // each run of an activity: its row lights, a request runs along the arrow, then (once the service shows) into the
  // Front End, which dispatches it to the History Service and to one more internal (its index in PARTS)
  const RUN = { step: 1.1, light: 0.9, send: 0.25, travel: 0.55 };
  const DISPATCH_TO = [1, 2, 3, 4];

  // A zone: a caption at its bottom; the outline is dashed slate for yours, UV for Temporal's
  function makeZone(root, zone, caption, mine) {
    const look = mine
      ? { border: '2px dashed ' + C.slate, background: 'rgba(148,163,184,.04)', borderRadius: 'var(--r)' }
      : { borderColor: C.uv, background: '#17182A' };
    const e = E(root,
      (mine ? '' : `<img src="${LOGO}" style="position:absolute;left:24px;top:20px;height:34px;display:block">`)
      + `<div class="cap lbl" style="position:absolute;left:0;right:0;bottom:${CAPTION_BOTTOM}px;text-align:center;`
      + `font-size:18px;color:var(--ink)">${caption}</div>`,
      mine ? '' : 'tile', { width: zone.w + 'px', height: zone.h + 'px', ...look });
    e.cap = e.querySelector('.cap');
    return e;
  }
  // Your application: an app panel with a Workflow card of four activity rows and the SDK chip
  function makeYourApp(root) {
    const app = makeAppPanel(root, 'YOUR APPLICATION', APP.w, APP.h, { font: 20, statusFont: 16, statusTop: 24 });
    app.insertAdjacentHTML('beforeend',
      `<div style="position:absolute;left:${CARD.left}px;top:${CARD.top}px;width:${CARD.w}px;height:${CARD.h}px;`
      + `background:rgba(248,250,252,.03);border:1.5px solid ${C.line};border-radius:var(--r)">`
      + panelLabel('code', 'Workflow', 'left:20px;top:18px;padding-left:0') + '</div>'
      + `<div class="pill uv" style="position:absolute;left:24px;right:24px;bottom:24px;height:${CHIP_H}px;`
      + 'padding-top:0;padding-bottom:0;line-height:45px;text-align:center;font-size:18px">'
      + 'Temporal SDK · open source</div>');
    const card = app.lastElementChild.previousElementSibling;
    app.rows = ACTIVITIES.map(([icon, text], i) => E(card,
      `${ICON(icon, 28, C.ink, 1.7)}<span style="flex:1;margin-left:16px">${text}</span>`
      + '<span class="lbl" style="font-size:13px">Activity</span>',
      'mono', {
        left: ROW.inset + 'px', top: (ROW.top + i * (ROW.h + ROW.gap)) + 'px',
        width: (CARD.w - 2 * ROW.inset - 3) + 'px',
        height: ROW.h + 'px', display: 'flex', alignItems: 'center', padding: '0 18px', fontSize: '22px',
        whiteSpace: 'nowrap', border: '1.5px solid ' + C.line, borderRadius: 'var(--rs)',
      }));
    return app;
  }
  // The Temporal Service box: its title, the Front End bar and the five internals (an icon and a label each)
  function makeService(root) {
    const box = E(root,
      '<div style="position:absolute;left:0;right:0;top:20px;text-align:center;font-size:34px;letter-spacing:-.5px;'
      + 'line-height:40px">Temporal Service</div>',
      '', {
        width: SERVICE.w + 'px', height: SERVICE.h + 'px', background: 'rgba(68,76,231,.16)',
        border: '1.5px solid ' + C.uv, borderRadius: 'var(--r)',
      });
    box.front = E(box, 'Front End Service', 'mono', {
      left: '24px', top: FRONT.top + 'px', width: (SERVICE.w - 51) + 'px', height: FRONT.h + 'px',
      lineHeight: (FRONT.h - 3) + 'px', textAlign: 'center', fontSize: '18px', letterSpacing: '.12em',
      paddingLeft: '.12em', textTransform: 'uppercase', background: '#20224A', border: '1.5px solid ' + C.uv,
      borderRadius: 'var(--rs)',
    });
    box.parts = PARTS.map(([icon, lines], i) => E(box,
      `${ICON(icon, 30, C.ink, 1.7)}<div style="margin-top:10px;line-height:18px">${lines.join('<br>')}</div>`,
      'mono', {
        left: (24 + i * (PART.w + PART.gap)) + 'px', top: PART.top + 'px', width: PART.w + 'px', height: PART.h + 'px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
        letterSpacing: '.06em', textTransform: 'uppercase', textAlign: 'center', background: '#20224A',
        border: '1.5px solid ' + C.line, borderRadius: 'var(--rs)',
      }));
    return box;
  }
  // A built-in quality: a UV bar, dim until it lights, with a neon check at its right
  const makeBar = (root, text) => {
    const e = E(root,
      `<span>${text}</span><div class="ck" style="position:absolute;right:20px;top:${(BAR.h - 26) / 2}px;opacity:0">`
      + `${ICON('check', 26, C.neon, 2.6)}</div>`,
      'mono', {
        width: SERVICE.w + 'px', height: BAR.h + 'px', lineHeight: BAR.h + 'px', textAlign: 'center',
        fontSize: '18px', letterSpacing: '.12em', paddingLeft: '.12em', textTransform: 'uppercase',
        color: '#FFFFFF', borderRadius: 'var(--rs)',
      });
    e.ck = e.querySelector('.ck');
    return e;
  };

  scene({
    chapter: 5, title: 'How Temporal Cloud works',
    holdBeforeEnd: CAMERA_EXIT, // presenter mode holds before the exit zoom
    subs: [
      {
        text: "With Temporal Cloud, your Workflow code keeps running in your environment, on the open source SDK.",
        after: 0.4,
      },
      // the first run of the four activities ends before the service shows
      {
        text: "Temporal's team manages the Temporal Service, so you don't run a complex, highly available cluster.",
        after: 2.0,
      },
      // the second run, through the service, ends before the bars light
      { text: "Security, compliance, scale and high availability come built in.", after: 1.4 },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.yours = makeZone(root, YOURS, 'Managed by you, in your environment', true);
      s.app = makeYourApp(root);
      s.cloud = makeZone(root, CLOUD, "Managed by Temporal, in Temporal's environment", false);
      s.service = makeService(root);
      s.bars = BARS.map(text => makeBar(root, text));
      s.svg = svgLayer(root);
      s.arrow = path(s.svg, `M ${ARROW.x0} ${ARROW.y} L ${ARROW.x1 - DOT / 2 - 10} ${ARROW.y}`, C.ink, 3);
      s.dot = E(root, '', '', {
        width: DOT + 'px', height: DOT + 'px', borderRadius: '50%', background: '#17182A',
        border: '3px solid ' + C.ink,
      });
      // the dispatch links, from the Front End's bottom to the top of each internal
      s.links = PARTS.map((_, i) => path(s.svg, `M ${partX(i)} ${FRONT_BOTTOM + 4} L ${partX(i)} ${PART_TOP - 4}`,
        C.violet, 2, false));
      // a request per run along the arrow, and its two dispatches inside the service
      s.requests = [0, 1, 2, 3, 4, 5, 6, 7].map(() => makeSpark(root, 14, '219,255,75'));
      s.dispatches = [0, 1, 2, 3].map(() => [makeSpark(root, 12, '182,100,255'), makeSpark(root, 12, '182,100,255')]);
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      // c[0]: your zone, your app and its Workflow, then the arrow; the four activities run, each sending a request
      // out; c[1]: the Temporal Service and its internals, then the activities run again, each request dispatched
      // inside; c[2]: the four built-in qualities light one by one
      rise(s.yours, YOURS.x, YOURS.y, P(t, c[0] + 0.2, 0.6));
      rise(s.app, APP.x, APP.y, P(t, c[0] + 0.5, 0.5), 16);
      s.app.rows.forEach((r, i) => showRow(r, P(t, c[0] + 0.9 + i * 0.15, 0.35), 26, true));
      s.yours.cap.style.opacity = P(t, c[0] + 1.6, 0.4);
      draw(s.arrow, P(t, c[0] + 2.0, 0.6));
      place(s.dot, ARROW.x1, ARROW.y, P(t, c[0] + 2.4, 0.3, backOut), P(t, c[0] + 2.4, 0.2));

      const runs = [
        ...[0, 1, 2, 3].map(k => ({ at: c[0] + 2.9 + k * RUN.step, k, inside: false })),
        ...[0, 1, 2, 3].map(k => ({ at: c[1] + 3.0 + k * RUN.step, k, inside: true })),
      ];
      const running = runs.some(r => t >= r.at && t < r.at + RUN.light);
      setAppStatus(s.app, running ? 'RUNNING' : '', running ? 'running' : 'idle');
      s.app.rows.forEach((row, i) => {
        const lit = runs.some(r => r.k === i && t >= r.at && t < r.at + RUN.light);
        row.style.borderColor = lit ? C.violet : C.line;
        row.style.background = lit ? 'rgba(182,100,255,.2)' : 'transparent';
      });
      runs.forEach((r, n) => {
        sparkOnPath(s.requests[n], s.arrow, P(t, r.at + RUN.send, RUN.travel, x => x));
        if (!r.inside) return;
        // the request lands on the Front End, which dispatches it to History and to one more internal
        const out = r.at + RUN.send + RUN.travel;
        const [toHistory, toOther] = s.dispatches[r.k];
        sparkOnPath(toHistory, s.links[0], P(t, out + 0.1, 0.35, x => x));
        sparkOnPath(toOther, s.links[DISPATCH_TO[r.k]], P(t, out + 0.1, 0.35, x => x));
      });

      // the Temporal Service, managed by Temporal; its internals pop in one by one, then the links draw
      rise(s.cloud, CLOUD.x, CLOUD.y, P(t, c[1] + 0.2, 0.6));
      rise(s.service, SERVICE.x, SERVICE.y, P(t, c[1] + 0.6, 0.5), 16);
      const front = s.service.front;
      front.style.opacity = P(t, c[1] + 1.0, 0.35);
      const landed = runs.filter(r => r.inside).map(r => r.at + RUN.send + RUN.travel);
      const flash = Math.max(0, ...landed.map(at => win(t, at - 0.05, at + 0.3, 0.1)));
      front.style.boxShadow = flash > 0 ? `0 0 ${Math.round(18 * flash)}px rgba(219,255,75,${(0.5 * flash).toFixed(3)})`
        : '';
      s.service.parts.forEach((e, i) => {
        const p = P(t, c[1] + 1.3 + i * 0.15, 0.4, backOut);
        e.style.opacity = clamp(p * 2);
        e.style.transform = `scale(${p.toFixed(4)})`;
        // an internal glows violet as a dispatch lands on it
        const hits = runs.filter(r => r.inside && (i === 0 || DISPATCH_TO[r.k] === i))
          .map(r => r.at + RUN.send + RUN.travel + 0.45);
        const glow = Math.max(0, ...hits.map(at => win(t, at - 0.05, at + 0.3, 0.1)));
        e.style.borderColor = glow > 0.5 ? C.violet : C.line;
      });
      s.links.forEach((l, i) => draw(l, P(t, c[1] + 2.2 + i * 0.08, 0.3), 0.8));
      // the two captions contrast who manages what: yours, then Temporal's, each swelling as it shows
      s.cloud.cap.style.opacity = P(t, c[1] + 1.9, 0.4);
      s.yours.cap.style.transform = `scale(${swell(t, c[1] + 2.4, 0.08)})`;
      s.cloud.cap.style.transform = `scale(${swell(t, c[1] + 2.9, 0.08)})`;

      // the built-in qualities: dim bars once the service shows, each lit in turn with a glow and a check
      s.bars.forEach((e, i) => {
        rise(e, SERVICE.x, BAR.y0 + i * (BAR.h + BAR.gap), P(t, c[1] + 2.0 + i * 0.1, 0.4), 12);
        const at = c[2] + 0.5 + i * 0.7;
        const lit = P(t, at, 0.3);
        e.style.background = `rgba(68,76,231,${(0.25 + 0.75 * lit).toFixed(3)})`;
        e.style.color = lit > 0.5 ? '#FFFFFF' : C.slate;
        const glow = win(t, at, at + 0.6, 0.15);
        e.style.boxShadow = glow > 0 ? `0 0 ${Math.round(24 * glow)}px rgba(68,76,231,${(0.8 * glow).toFixed(3)})`
          : '';
        e.ck.style.opacity = P(t, at + 0.15, 0.25);
      });
    }
  });
}
