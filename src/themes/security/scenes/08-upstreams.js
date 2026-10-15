// ===================== 8. CHANGE TEMPORAL, NOT YOUR CODE
// Opens on the whole fleet that chapter 7 pulled back to (FULL_LANE_SHOT) and holds it. TEMPORAL splits into two
// upstreams: your own Temporal Service on top, SELF-HOSTED and lit, the proxy's connection bending up to it, and
// Temporal Cloud under it (the official lockup followed by "Cloud"), dim. A ROUTING switch pops into the proxy. Then
// the dramatic beat: the switch flips from SELF-HOSTED to CLOUD, the connection tears off the self-hosted service and
// redraws down to Temporal Cloud with a spark running along it, and Temporal Cloud lights up, while the Workers and
// their two lines stay perfectly still: WORKERS UNCHANGED. The camera holds; the default fade-out plays the engine's
// zoom-through into the next scene.
// The block keeps every name declared in this file local to this scene.
{
  // from c[0]: TEMPORAL narrows to the top upstream (split, splitD) as Temporal Cloud rises in under it (cloud); the
  // ROUTING switch pops into the proxy (routing); it flips (flip); the connection tears off the self-hosted service
  // (tear, tearD) and redraws to Temporal Cloud (redraw, redrawD); WORKERS UNCHANGED (unchanged)
  const T0 = {
    split: 0, splitD: 0.8, cloud: 0.4, routing: 1.0, flip: 3.4, tear: 3.6, tearD: 0.3, redraw: 4.0, redrawD: 0.7,
    unchanged: 5.2,
  };
  // the two upstreams, one above the other on TEMPORAL's side: your own Temporal Service (self-hosted) and Temporal
  // Cloud; the zones' rectangles
  const SELF_ZONE = { x: 1640, y: FLEET.y, w: 260, h: 350 };
  const CLOUD_ZONE = { x: 1640, y: FLEET.y + FLEET.h - 350, w: 260, h: 350 };
  // the proxy's connection: from the box's right edge, a corner at x, to 4 px short of an upstream's left edge, level
  // with its middle
  const WIRE = { x0: PROXY_WIRE.x0, x: 1585, x1: SELF_ZONE.x - 4, r: 10 };
  const selfY = SELF_ZONE.y + SELF_ZONE.h / 2, cloudY = CLOUD_ZONE.y + CLOUD_ZONE.h / 2;
  // inside each upstream: its label under its heading (SELF-HOSTED), and its icon, in the middle
  const UPSTREAM = { label: 72, icon: 52 };
  // the ROUTING switch, in the proxy box under its name: center and size
  const ROUTING = { x: PROXY.x, y: 552, w: 184, h: 160 };
  // its track, from the panel's top left corner, and its knob's size, inset in the track and travel; its two options'
  // left edge and tops
  const TRACK = { left: 14, top: 48, w: 26, h: 92 };
  const KNOB = { size: 20, inset: 1.5 };
  KNOB.travel = TRACK.h - 3 - KNOB.size - 2 * KNOB.inset;
  const OPTIONS = { left: 52, tops: [52, 110] };
  // the sparks that fly off the self-hosted service as the connection tears off it: how many, how long each one flies
  const TEAR = { n: 8, life: 0.5 };
  // Temporal Cloud's title: the official lockup, 34 px high, then "Cloud" in the brand font, its capitals as tall as
  // the wordmark's and on its baseline (the measures of meet-temporal's chapter 5: the lockup's viewBox is 1570x410
  // units, its capitals run from y 519 to its baseline at y 684.7, 805 being the image's bottom; Instrument Sans
  // capitals are 0.72 em tall), a word space after it
  const CLOUD_UNIT = 34 / 410;
  const CLOUD_TITLE = {
    rise: Math.round((805 - 684.7) * CLOUD_UNIT), font: +((684.7 - 519) * CLOUD_UNIT / 0.72).toFixed(2),
  };
  CLOUD_TITLE.gap = Math.round(0.2 * CLOUD_TITLE.font);

  // SVG path of the proxy's connection to the point (x1, y): straight when y is on the wire's line, else bending at
  // WIRE.x with rounded corners
  function wireD(x1, y) {
    const { x0, x } = WIRE;
    const y0 = PROXY_WIRE.y, dy = y - y0;
    if (Math.abs(dy) < 0.5) return `M ${x0} ${y0} L ${x1} ${y0}`;
    const r = Math.min(WIRE.r, Math.abs(dy) / 2), dir = Math.sign(dy);
    return `M ${x0} ${y0} H ${x - r} Q ${x} ${y0} ${x} ${y0 + dir * r} V ${y - dir * r} Q ${x} ${y} ${x + r} ${y}`
      + ` H ${x1}`;
  }
  // Sets a path's d, and its length, only when it changes
  function setD(pathEl, d) {
    if (pathEl._d === d) return;
    pathEl.setAttribute('d', d);
    pathEl._L = pathEl.getTotalLength();
    pathEl._d = d;
  }
  // An upstream's body: its label (if any) under its heading, and its icon in the middle
  function upstreamBody(label, icon) {
    const labelHtml = label ? `<div class="lbl" style="position:absolute;left:24px;top:${UPSTREAM.label}px;`
      + `padding-left:0;font-size:18px;color:var(--ink)">${label}</div>` : '';
    return labelHtml + `<div style="position:absolute;left:0;right:0;top:50%;display:flex;justify-content:center;`
      + `transform:translateY(-50%);margin-top:${UPSTREAM.icon / 2}px">${ICON(icon, 52, C.slate, 1.6)}</div>`;
  }

  scene({
    chapter: 8, title: 'Change Temporal, not your code',
    // a hard cut: chapter 7 ends on this chapter's first frame; the default fade-out to the next scene
    fadeIn: 0,
    subs: [
      // the switch and its new connection, then a hold on WORKERS UNCHANGED
      {
        text: "Moving from your own Temporal Service to Temporal Cloud is a proxy setting: Workers don't change.",
        after: 1.4,
      },
    ],
    build(stage, s) {
      // chapter 7's parts first, in its order, so the cut shows the same stack
      const root = s.cam = makeCamera(stage);
      s.lane = makeLane(root);
      s.apps = [...WORKERS, ...FLEET_CLIENTS];
      const proxyLeft = PROXY.x - PROXY.w / 2 - 4;
      s.links = s.apps.map(app => path(s.lane.svg, fleetLinkD(app, proxyLeft), C.slate, 2, false));
      s.out = path(s.lane.svg, wireD(PROXY_WIRE.x1 - 4, PROXY_WIRE.y), C.violet, 3);
      s.tiles = WORKERS.map(w => makeWorkerTile(root, w));
      s.clients = FLEET_CLIENTS.map(app => iconTile(root, app.icon, app.name, FLEET.tile.w, FLEET.tile.h));
      // the self-hosted service's body, in the lane's TEMPORAL zone, and Temporal Cloud
      s.self = E(root, upstreamBody('Self-hosted', 'server'), '', {
        width: SELF_ZONE.w + 'px', height: SELF_ZONE.h + 'px',
      });
      s.cloud = E(root,
        '<div style="position:absolute;left:24px;top:20px;height:34px;line-height:0;white-space:nowrap">'
        + `<img src="${LOGO}" style="height:34px;vertical-align:-${CLOUD_TITLE.rise}px">`
        + `<span style="font-size:${CLOUD_TITLE.font}px;margin-left:${CLOUD_TITLE.gap}px;color:#F2F2F2">Cloud</span>`
        + '</div>' + upstreamBody(null, 'cloud'),
        'tile', { width: CLOUD_ZONE.w + 'px', height: CLOUD_ZONE.h + 'px', borderColor: C.uv, background: '#17182A' });
      s.proxy = makeProxy(root);
      s.sparks = s.apps.map(() => makeSpark(root, 10, RGB.violet));
      s.outSparks = [0, 1].map(() => makeSpark(root, 12, RGB.violet));

      // the ROUTING switch: its label, its track and knob, and its two options
      s.routing = E(root,
        '<div class="lbl" style="position:absolute;left:14px;top:14px;padding-left:0;font-size:16px">Routing</div>'
        + `<div style="position:absolute;left:${TRACK.left}px;top:${TRACK.top}px;width:${TRACK.w}px;`
        + `height:${TRACK.h}px;border:1.5px solid ${C.violet};border-radius:${TRACK.w / 2}px">`
        + `<div class="knob" style="position:absolute;left:${KNOB.inset}px;top:${KNOB.inset}px;width:${KNOB.size}px;`
        + `height:${KNOB.size}px;`
        + `border-radius:50%;background:${C.violet};box-shadow:0 0 12px rgba(${RGB.violet},.8)"></div></div>`
        + ['SELF-HOSTED', 'CLOUD'].map((name, i) => `<div class="option mono" style="position:absolute;`
          + `left:${OPTIONS.left}px;top:${OPTIONS.tops[i]}px;font-size:16px;line-height:24px;letter-spacing:.04em">`
          + `${name}</div>`).join(''),
        'tile', { width: ROUTING.w + 'px', height: ROUTING.h + 'px', textAlign: 'left', background: C.bg });
      s.knob = s.routing.querySelector('.knob');
      s.options = [...s.routing.querySelectorAll('.option')];
      s.click = makeRipples(root, 2, RGB.neon);
      s.headSpark = makeSpark(root, 14, RGB.violet);
      s.tearSparks = Array.from({ length: TEAR.n }, () => makeSpark(root, 6, RGB.violet));
      s.landing = makeRipples(root, 2, RGB.violet);
      s.unchanged = statusTag(root, { font: 17, icon: 17 });
      s.unchanged.style.height = '34px';
    },
    update(t, c, s) {
      const flipAt = c[0] + T0.flip, tearAt = c[0] + T0.tear, redrawAt = c[0] + T0.redraw;
      const landAt = redrawAt + T0.redrawD;

      // the camera holds the whole fleet; the default fade-out zooms through to the next scene
      const cam = shot(t, FULL_LANE_SHOT, []);
      setCamera(s.cam, t, this.dur, { ...cam, enter: 1 });

      // the lane: TEMPORAL narrows to the self-hosted service on top, which dims once the connection leaves it
      const split = P(t, c[0] + T0.split, T0.splitD);
      const selfDim = P(t, tearAt, 0.3);
      const selfZone = lerpZone(PROXY_ZONES.temporal, SELF_ZONE, split);
      placeLane(s.lane, {
        ...BARE_WORKERS_HANDOFF.lane, envZone: PROXY_ZONES.env, temporalZone: selfZone,
        temporal: lerp(1, 0.45, selfDim),
      });
      frameLaneEdges(s.lane, cam);
      place(s.self, selfZone.x + selfZone.w / 2, selfZone.y + selfZone.h / 2, 1, split * lerp(1, 0.45, selfDim));
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
        tile.lines.forEach((line, k) => {
          if (line.textContent !== WORKER_LINES[k]) line.textContent = WORKER_LINES[k];
        });
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
      s.outSparks.forEach((spark, k) => {
        sparkOnPath(spark, s.out, (G / (PROXY_FLOW_PERIOD / 2) + k / 2) % 1);
        spark.style.opacity = (+spark.style.opacity * outLight).toFixed(3);
      });
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

      // the proxy, with a swell of its glow as the switch flips; the ROUTING switch in it
      placeProxy(s.proxy, { glow: Math.max(0, 1 - Math.abs(t - flipAt - 0.15) / 0.5) });
      const routingPop = backPop(t, c[0] + T0.routing);
      place(s.routing, ROUTING.x, ROUTING.y, routingPop.s, routingPop.o);
      const flip = P(t, flipAt, 0.3, backOut);
      s.knob.style.transform = `translateY(${(KNOB.travel * flip).toFixed(2)}px)`;
      const toCloud = t >= flipAt + 0.15;
      s.options.forEach((option, i) => {
        const active = (i === 1) === toCloud;
        option.style.color = active ? C.ink : C.slate;
      });
      s.routing.style.borderColor = t >= flipAt && t < flipAt + 0.6 ? C.neon : C.line;
      const knobY = ROUTING.y - ROUTING.h / 2 + TRACK.top + 1.5 + KNOB.inset + KNOB.size / 2 + KNOB.travel;
      placeRipples(s.click, t, flipAt + 0.2, ROUTING.x - ROUTING.w / 2 + TRACK.left + TRACK.w / 2, knobY, 20, 120,
        { d: 0.6, step: 0.14 });

      // the Workers did not change
      const unchanged = popIn(t, c[0] + T0.unchanged);
      setStatus(s.unchanged, 'WORKERS UNCHANGED', 'ok');
      place(s.unchanged, UNDER_WORKERS.x, UNDER_WORKERS.y, unchanged.s, unchanged.o);
    }
  });
}
