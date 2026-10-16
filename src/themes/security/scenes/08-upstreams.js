// ===================== 8. CHANGE TEMPORAL, NOT YOUR CODE
// Opens on the whole fleet that chapter 7 pulled back to (WIDE_SHOT) and holds it. TEMPORAL splits into two
// upstreams: your own Temporal Service on top, Self-hosted and lit, the proxy's connection bending up to it, and
// Temporal Cloud under it (the official lockup above "Cloud"), dim. A ROUTING switch docks under the proxy. Then
// the dramatic beat: the switch flips from SELF-HOSTED to CLOUD, the connection tears off the self-hosted service and
// redraws down to Temporal Cloud with a spark running along it, and Temporal Cloud lights up, while the Workers and
// their two lines stay perfectly still: WORKERS UNCHANGED. The camera holds; the default fade-out plays the camera
// zoom-through (setCamera) into the next scene.
// The block keeps every name declared in this file local to this scene.
{
  // from c[0]: TEMPORAL narrows to the top upstream (split, splitD) as Temporal Cloud rises in under it (cloud); the
  // ROUTING switch docks under the proxy (routing); it flips as "Temporal Cloud instead" is read (flip); the
  // connection tears off the self-hosted service (tear, tearD) and redraws to Temporal Cloud (redraw, redrawD);
  // WORKERS UNCHANGED once Temporal Cloud has lit up, just after "Workers" is read (unchanged; its position at 16
  // characters per second plus 0.3 s is 4.24)
  const T0 = {
    split: 0, splitD: 0.8, cloud: 0.4, routing: 1.0, flip: 2.6, tear: 2.8, tearD: 0.3, redraw: 3.2, redrawD: 0.7,
    unchanged: 4.4,
  };
  // the two upstreams, one above the other on TEMPORAL's side: your own Temporal Service (self-hosted) and Temporal
  // Cloud; the zones' rectangles
  const SELF_ZONE = { x: 1640, y: FLEET.y, w: 260, h: 350 };
  const CLOUD_ZONE = { x: 1640, y: FLEET.y + FLEET.h - 350, w: 260, h: 350 };
  // the proxy's connection: from the box's right edge, a corner at x, to 4 px short of an upstream's left edge, level
  // with its middle
  const WIRE = { x0: PROXY_WIRE.x0, x: 1585, x1: SELF_ZONE.x - 4, r: 10 };
  const selfY = SELF_ZONE.y + SELF_ZONE.h / 2, cloudY = CLOUD_ZONE.y + CLOUD_ZONE.h / 2;
  // the self-hosted service's opacity once the connection has left it: out of use, still readable
  const SELF_DIM = 0.6;
  // inside each upstream: its icon, in the middle
  const UPSTREAM = { icon: 52 };
  // the ROUTING switch, the proxy's setting: a panel docked under the proxy box, on a 15 px stem, where your
  // environment is empty (on the environment's edge, as the box is), as wide as the box; its label is 21 px (18.5 on
  // screen), its options 19 px (16.7 on screen), so the longer one fits the box's width. Its content sits PAD px
  // inside its border all round: the label's capitals (LABEL.top: its line's top, the capitals starting about 5 px
  // under it) and the track's bottom, as far as the track's left edge.
  const PAD = 14;
  const LABEL = { top: 9, font: 21 };
  // its track, from the panel's top left corner (under the label, as far below its capitals as before), and its
  // knob's size, its inset in the track (centered across it, inside its border) and its travel: the options' spacing
  const TRACK = { left: PAD, top: 48, w: 30, h: 70 };
  const KNOB = { size: 24 };
  KNOB.inset = (TRACK.w - 2 * TILE_BORDER - KNOB.size) / 2;
  KNOB.travel = TRACK.h - 2 * TILE_BORDER - KNOB.size - 2 * KNOB.inset;
  // the panel's center and size, its top 15 px under the proxy box, its height round the track
  const ROUTING = { x: PROXY.x, w: PROXY.w, h: TRACK.top + TRACK.h + PAD + 2 * TILE_BORDER };
  ROUTING.y = PROXY.y + PROXY.h / 2 + 15 + ROUTING.h / 2;
  const STEM = { y0: PROXY.y + PROXY.h / 2, y1: ROUTING.y - ROUTING.h / 2 };
  // the two options: their left edge and line height; each option's line centered on a knob stop (tops)
  const OPTIONS = { left: 56, font: 19, line: 28 };
  const firstStop = TRACK.top + TILE_BORDER + KNOB.inset + KNOB.size / 2;
  OPTIONS.tops = [firstStop, firstStop + KNOB.travel].map(y => y - OPTIONS.line / 2);
  // the sparks that fly off the self-hosted service as the connection tears off it: how many, how long each one flies
  const TEAR = { n: 8, life: 0.5 };
  // The two upstreams' titles, a pair: the official lockup at the zone's heading place (the lane's TEMPORAL heading
  // grows to it from its 34 px as TEMPORAL splits), then under it the upstream's name in the brand font: Self-hosted
  // and Cloud (logo: the lockup's height, its wordmark about 20 px on screen; name: its top and size, 21 px on screen)
  const TITLE = { logo: 40, laneLogo: ZONE_LOGO_H, nameTop: 72, name: 24 };
  // Both titles are centered in their box: the lockup's left edge, on a whole pixel (the lockup's viewBox is 1570 x
  // 410), and the lane heading's resting left edge before the split (zoneHeading())
  TITLE.logoLeft = Math.round((SELF_ZONE.w - TITLE.logo * 1570 / 410) / 2);

  // SVG path of the proxy's connection to the point (x1, y): straight when y is within half a pixel of the wire's
  // line, else bending at WIRE.x with rounded corners
  const wireD = (x1, y) => {
    const y0 = PROXY_WIRE.y;
    if (Math.abs(y - y0) < 0.5) return `M ${WIRE.x0} ${y0} L ${x1} ${y0}`;
    return roundedPath([[WIRE.x0, y0], [WIRE.x, y0], [WIRE.x, y], [x1, y]], WIRE.r);
  };
  // An upstream's body: its name, centered under its heading's lockup, and its icon in the middle
  const upstreamBody = (name, icon) => {
    return `<div style="position:absolute;left:0;right:0;top:${TITLE.nameTop}px;font-size:${TITLE.name}px;`
      + `line-height:30px;text-align:center;color:#F2F2F2">${name}</div>`
      + '<div style="position:absolute;left:0;right:0;top:50%;display:flex;justify-content:center;'
      + `transform:translateY(-50%);margin-top:${UPSTREAM.icon / 2}px">`
      + `${ICON(icon, UPSTREAM.icon, C.slate, 1.6)}</div>`;
  };

  scene({
    chapter: 8, title: 'Change Temporal, not your code',
    // a hard cut: chapter 7 ends on this chapter's first frame; the default fade-out to the next scene
    fadeIn: 0,
    subs: [
      // the switch and its new connection, then a hold on WORKERS UNCHANGED
      {
        text: "Point the proxy at Temporal Cloud instead of your own Service: Workers don't change.",
        after: 1.4,
      },
    ],
    build(stage, s) {
      // chapter 7's parts first, in its order, so the cut shows the same stack
      const root = s.cam = makeCamera(stage);
      Object.assign(s, makeFleet(root));
      // the self-hosted service's body, in the lane's TEMPORAL zone, and Temporal Cloud
      s.self = E(root, upstreamBody('Self-hosted', 'server'), '', {
        width: SELF_ZONE.w + 'px', height: SELF_ZONE.h + 'px',
      });
      s.cloud = E(root,
        `<img src="${LOGO}" style="position:absolute;left:${TITLE.logoLeft}px;top:${ZONE_LABEL_INSET.head}px;`
        + `height:${TITLE.logo}px;display:block">${upstreamBody('Cloud', 'cloud')}`,
        'tile', {
          width: CLOUD_ZONE.w + 'px', height: CLOUD_ZONE.h + 'px', borderColor: C.uv, background: C.temporalSurface,
        });
      s.proxy = makeProxy(root);
      s.sparks = s.apps.map(() => makeSpark(root, 10, RGB.violet));
      s.outSparks = [0, 1].map(() => makeSpark(root, 12, RGB.violet));

      // the ROUTING switch on its stem: its label, its track and knob, and its two options
      s.stem = path(s.lane.svg, `M ${PROXY.x} ${STEM.y0} V ${STEM.y1}`, C.violet, 2.5, false);
      s.routing = E(root,
        `<div class="lbl" style="position:absolute;left:${TRACK.left}px;top:${LABEL.top}px;padding-left:0;`
        + `font-size:${LABEL.font}px">`
        + 'Routing</div>'
        + `<div style="position:absolute;left:${TRACK.left}px;top:${TRACK.top}px;width:${TRACK.w}px;`
        + `height:${TRACK.h}px;border:1px solid ${C.violet};border-radius:${TRACK.w / 2}px">`
        + `<div class="knob" style="position:absolute;left:${KNOB.inset}px;top:${KNOB.inset}px;width:${KNOB.size}px;`
        + `height:${KNOB.size}px;`
        + `border-radius:50%;background:${C.violet};box-shadow:0 0 12px rgba(${RGB.violet},.8)"></div></div>`
        + ['SELF-HOSTED', 'CLOUD'].map((name, i) => `<div class="option mono" style="position:absolute;`
          + `left:${OPTIONS.left}px;top:${OPTIONS.tops[i]}px;font-size:${OPTIONS.font}px;line-height:${OPTIONS.line}px;`
          + `letter-spacing:.02em">${name}</div>`).join(''),
        'tile', { width: ROUTING.w + 'px', height: ROUTING.h + 'px', textAlign: 'left', background: C.bg });
      s.knob = s.routing.querySelector('.knob');
      s.options = [...s.routing.querySelectorAll('.option')];
      s.click = makeRipples(root, 2, RGB.neon);
      s.headSpark = makeSpark(root, 14, RGB.violet);
      s.tearSparks = Array.from({ length: TEAR.n }, () => makeSpark(root, 6, RGB.violet));
      s.landing = makeRipples(root, 2, RGB.violet);
      // 19 px (16.7 px on screen), as NO SECRETS in chapter 6, in the same place: clearly narrower than the tile above
      s.unchanged = statusTag(root, { font: 19, icon: 19 });
      s.unchanged.style.height = UNDER_WORKERS.h + 'px';
      s.unchanged.style.letterSpacing = '.04em';
    },
    update(t, c, s) {
      const flipAt = c[0] + T0.flip, tearAt = c[0] + T0.tear, redrawAt = c[0] + T0.redraw;
      const landAt = redrawAt + T0.redrawD;

      // the camera holds the whole fleet; the default fade-out zooms through to the next scene
      const cam = shot(t, WIDE_SHOT, []);
      setCamera(s.cam, t, this.dur, { ...cam, enter: 1 });

      // the lane: TEMPORAL narrows to the self-hosted service on top, which dims once the connection leaves it
      const split = P(t, c[0] + T0.split, T0.splitD);
      const selfDim = P(t, tearAt, 0.3);
      const selfZone = lerpZone(PROXY_ZONES.temporal, SELF_ZONE, split);
      // YOUR ENVIRONMENT's line grows with it, so both headings keep one center line
      const headH = Math.round(lerp(TITLE.laneLogo, TITLE.logo, split)) + 'px';
      s.lane.temporal.head.style.height = headH;
      s.lane.env.head.style.lineHeight = headH;
      // the heading glides to the centered place as it grows
      s.lane.temporal.headFrame.style.left = Math.round(lerp(ZONE_LABEL_INSET.left, TITLE.logoLeft, split)) + 'px';
      placeLane(s.lane, {
        ...BARE_WORKERS_HANDOFF.lane, envZone: PROXY_ZONES.env, temporalZone: selfZone,
        temporal: lerp(1, SELF_DIM, selfDim),
      });
      frameLaneEdges(s.lane, cam);
      place(s.self, selfZone.x + selfZone.w / 2, selfZone.y + selfZone.h / 2, 1, split * lerp(1, SELF_DIM, selfDim));
      // Temporal Cloud rises in under it, dim, and lights up as the new connection reaches it
      const cloudLit = P(t, landAt, 0.3);
      rise(s.cloud, CLOUD_ZONE.x + CLOUD_ZONE.w / 2, CLOUD_ZONE.y + CLOUD_ZONE.h / 2,
        P(t, c[0] + T0.cloud, 0.6) * lerp(0.45, 1, cloudLit));
      s.cloud.style.borderColor = cloudLit > 0.5 ? C.uv : C.line;
      const swellGlow = Math.max(0, 1 - Math.abs(t - landAt - 0.15) / 0.5);
      s.cloud.style.boxShadow = glowShadow(RGB.violet, Math.max(cloudLit * 0.5, swellGlow), { blur: 40, alpha: 0.5 });
      placeRipples(s.landing, t, landAt, CLOUD_ZONE.x, cloudY, 40, 220, { d: 0.8, step: 0.16 });

      // the Workers with their two lines and the other apps stay perfectly still; their connections and light run on
      s.tiles.forEach((tile, w) => {
        gearSpin(tile, 1);
        place(tile, WORKERS[w].x, WORKERS[w].y, 1, 1);
        tile.lines.forEach((line, k) => setText(line, WORKER_LINES[k]));
        tile.lines[1].style.color = C.violet;
      });
      s.clients.forEach((tile, i) => place(tile, FLEET_CLIENTS[i].x, FLEET_CLIENTS[i].y, 1, 1));
      s.links.forEach((link, i) => {
        draw(link, 1);
        sparkOnPath(s.sparks[i], link, (G / PROXY_FLOW_PERIOD + i / s.apps.length) % 1);
      });

      // the proxy's connection bends up to the self-hosted service as TEMPORAL splits. The dramatic beat: the switch
      // flips, the connection tears off the self-hosted service, sparks flying, and redraws down to Temporal Cloud
      // with a spark running at its head.
      const redrawing = t >= redrawAt;
      setD(s.out, redrawing ? wireD(WIRE.x1, cloudY)
        : wireD(lerp(PROXY_WIRE.x1 - 4, WIRE.x1, split), lerp(PROXY_WIRE.y, selfY, split)));
      const redraw = P(t, redrawAt, T0.redrawD, easeOut);
      draw(s.out, redrawing ? redraw : 1 - P(t, tearAt, T0.tearD, easeIn));
      sparkOnPath(s.headSpark, s.out, redrawing ? redraw : 0);
      const outLight = 1 - P(t, tearAt, 0.15) * (1 - P(t, landAt, 0.4));
      s.outSparks.forEach((spark, k) => sparkOnPath(spark, s.out, (G / (PROXY_FLOW_PERIOD / 2) + k / 2) % 1, outLight));
      s.tearSparks.forEach((spark, i) => {
        const age = t - tearAt;
        if (age <= 0 || age >= TEAR.life) {
          place(spark, 0, 0, 1, 0);
          return;
        }
        // thrown back toward the proxy, off the self-hosted service's edge
        const angle = Math.PI * (0.55 + 0.9 * hash(i + 1200));
        const speed = 120 + 160 * hash(i + 1300);
        const x = WIRE.x1 + Math.cos(angle) * speed * age;
        const y = selfY + Math.sin(angle) * speed * age + 300 * age * age;
        place(spark, x, y, 1, 1 - age / TEAR.life);
      });

      // the proxy, with a swell of its glow as the switch flips; the ROUTING switch on its stem under it
      placeProxy(s.proxy, { glow: Math.max(0, 1 - Math.abs(t - flipAt - 0.15) / 0.5) });
      const routingPop = backPop(t, c[0] + T0.routing);
      place(s.routing, ROUTING.x, ROUTING.y, routingPop.s, routingPop.o);
      draw(s.stem, P(t, c[0] + T0.routing - 0.15, 0.2));
      const flip = P(t, flipAt, 0.3, backOut);
      s.knob.style.transform = `translateY(${(KNOB.travel * flip).toFixed(2)}px)`;
      const toCloud = t >= flipAt + 0.15;
      s.options.forEach((option, i) => {
        const active = (i === 1) === toCloud;
        option.style.color = active ? C.ink : C.slate;
      });
      s.routing.style.borderColor = t >= flipAt && t < flipAt + 0.6 ? C.neon : C.line;
      const knobY = ROUTING.y - ROUTING.h / 2 + TILE_BORDER + firstStop + KNOB.travel;
      placeRipples(s.click, t, flipAt + 0.2, ROUTING.x - ROUTING.w / 2 + TRACK.left + TRACK.w / 2, knobY, 20, 120,
        { d: 0.6, step: 0.14 });

      // the Workers did not change
      const unchanged = popIn(t, c[0] + T0.unchanged);
      setStatus(s.unchanged, 'WORKERS UNCHANGED', 'ok');
      place(s.unchanged, UNDER_WORKERS.x, UNDER_WORKERS.y, unchanged.s, unchanged.o);
    }
  });
}
