// ===================== 6. MEET TEMPORAL PROXY
// Opens on the bare Workers that chapter 5 ended on (BARE_WORKERS_HANDOFF). Your environment widens, an SDK client and
// the Web UI join the Workers, and the TEMPORAL PROXY box slides into its right edge with a violet glow. Every app's
// connection converges on it, and one connection leaves it for Temporal. Each Worker learns two lines only, the
// proxy's local address and a short Namespace name: NO SECRETS. Then the camera pushes in toward the proxy as a
// payload card leaves a Worker in a plain connection: at the proxy it gains, one at a time, the TLS tube, the API KEY
// and the full Namespace name (payments typed over into payments.a1b2c), each with a click, and goes out to Temporal:
// CREDENTIALS IN ONE PLACE. The chapter ends pushing into the proxy box (PROXY_SHOT), where the box fills the content
// frame's height: only the box, the TLS tube and its label stay bright; everything else is dimmed (OFF_SHOT) or out
// of the frame. The camera travels one way: right and in.
// The block keeps every name declared in this file local to this scene.
{
  // camera framings, [x, y, scale] for shot(): from c[2], on the proxy's side of the fleet, the two right columns, the
  // proxy, the TLS tube and TEMPORAL whole (x 120-1800 on screen; text renders at 1.35x), on the way to PROXY_SHOT
  const SEND_SHOT = [1200, 515, 1.35];
  // the push-in into the proxy that ends the chapter: it starts PUSH_BEFORE_END seconds before the end and lands
  // 0.15 s before the cut
  const PUSH_BEFORE_END = 1.3;
  const PUSH_D = 1.15;
  // from c[0]: the environment widens (widen, widenD); the SDK client and the Web UI pop in (clients, clientStep); the
  // proxy slides in (proxy, proxyD) and lands; the connections draw, one after the other (links, linkStep, linkD); the
  // proxy's own connection to Temporal draws (out, outD); light flows along them (flow)
  const T0 = {
    widen: 0, widenD: 0.9, clients: 0.6, clientStep: 0.15, proxy: 0.9, proxyD: 0.7, links: 2.0, linkStep: 0.1,
    linkD: 0.6, out: 3.4, outD: 0.5, flow: 3.7,
  };
  // from c[1]: each Worker's two lines type in, one Worker after the other (address, namespace, step, typeD); NO
  // SECRETS pops in under the Workers
  const T1 = { address: 1.2, namespace: 2.4, step: 0.1, typeD: 0.5, noSecrets: 4.0 };
  // from c[2]: the card leaves its Worker and rides its connection into the proxy (card, cardD) as the camera pushes
  // in (cam, camD); it gains the TLS tube (tls, tubeD), the API KEY (key) and the full Namespace name (ns, typed over
  // nsD); it goes out through the tube to Temporal (exit, exitD), where its Namespace waits (band); CREDENTIALS IN ONE
  // PLACE
  const T2 = {
    card: 0.2, cardD: 1.4, cam: 0.6, camD: 1.4, tls: 2.3, tubeD: 0.5, key: 3.2, ns: 4.0, nsD: 0.6, band: 4.4,
    exit: 4.9, exitD: 0.8, credentials: 5.9,
  };

  // the Worker whose card goes through the proxy (in WORKERS)
  const SENDER = 2;
  // the two lines each Worker knows: the proxy's local address and the short Namespace name, and the full Namespace
  // name the proxy writes over it
  const ADDRESS = 'proxy:7233';
  const SHORT_NS = 'payments';
  const FULL_NS = 'payments.a1b2c';
  // the card, at scale k, with its Namespace tag straddling its bottom edge and the API KEY under it (TAG: their
  // height and the tags' widths, px; the gap between them); groupDy: from the card's center to the middle of the
  // group of the three
  const CARD = { w: PAYLOAD_IN_WORKER.w, k: 0.45 };
  CARD.h = payloadLayout(CARD.w).h * CARD.k;
  const TAG = { h: 26, nsW: 152, keyW: 110, gap: 6 };
  const KEY_DY = CARD.h / 2 + TAG.h / 2 + TAG.gap + TAG.h;
  const GROUP = { top: -CARD.h / 2, bottom: KEY_DY + TAG.h / 2 };
  GROUP.dy = (GROUP.top + GROUP.bottom) / 2;
  // inside the proxy, the group is centered in the room under its name
  const IN_PROXY = { x: PROXY.x, y: PROXY.y + PROXY.head.bottom / 2 - GROUP.dy };
  // the TLS tube, from the proxy's right edge to 12 px inside TEMPORAL, on the wire's line, high enough to hold the
  // group; its label above it
  const TUBE6 = { x0: PROXY_WIRE.x0, x1: FLEET.temporalX + 12, y: LANE.wire.y, h: 176 };
  TUBE6.label = { x: (TUBE6.x0 + TUBE6.x1) / 2, y: TUBE6.y - TUBE6.h / 2 - 36 };
  // the payments Namespace inside TEMPORAL, the card's destination: its center and size; the card lands under its
  // name
  const BAND = { x: (FLEET.temporalX + LANE.temporal.x + LANE.temporal.w) / 2, y: LANE.wire.y, w: 180, h: 250 };
  const IN_BAND = { x: BAND.x, y: BAND.y - BAND.h / 2 + 64 + CARD.h / 2 };
  // NO SECRETS, centered under the Workers; CREDENTIALS IN ONE PLACE, under the proxy
  const NO_SECRETS = { x: (WORKERS[0].x + WORKERS[2].x) / 2, y: 812 };
  const CREDENTIALS = { x: PROXY.x, y: PROXY.y + PROXY.h / 2 + 38 };
  // how long the light takes to run along a connection, seconds
  const FLOW_PERIOD = 2.0;

  // The point at progress p (0 to 1) along a route of straight legs between points, at constant speed
  function alongRoute(points, p) {
    const legs = points.slice(1).map((b, i) => Math.hypot(b[0] - points[i][0], b[1] - points[i][1]));
    let left = clamp(p) * legs.reduce((a, b) => a + b, 0);
    for (let i = 0; i < legs.length; i++) {
      if (left <= legs[i] || i === legs.length - 1) {
        const u = legs[i] ? clamp(left / legs[i]) : 1;
        return [lerp(points[i][0], points[i + 1][0], u), lerp(points[i][1], points[i + 1][1], u)];
      }
      left -= legs[i];
    }
    return points[points.length - 1];
  }
  // The first round(p * length) characters of text: it types in as p goes from 0 to 1
  const typed = (text, p) => text.slice(0, Math.round(clamp(p) * text.length));
  // Sets an element's text, rewritten only when it changes
  function setText(e, text) {
    if (e._text !== text) {
      e.textContent = text;
      e._text = text;
    }
  }
  // A small tag beside the card: a fixed width w, its HTML centered, in the violet look
  const cardTag = (root, html, w) => E(root, html, 'mono', {
    width: w + 'px', height: TAG.h + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '6px', fontSize: '14px', letterSpacing: '.06em', whiteSpace: 'pre', border: `1.5px solid ${C.violet}`,
    borderRadius: 'var(--rs)', background: 'var(--violet-solid)',
  });

  scene({
    chapter: 6, title: 'Meet Temporal Proxy',
    // hard cuts: chapter 5 ends on this chapter's first frame, this chapter on the next one's (PROXY_SHOT)
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the card in Temporal, then plays the push-in and the cut in one go
    holdBeforeEnd: PUSH_BEFORE_END,
    subs: [
      { text: "Meet <b>Temporal Proxy</b>: one gateway in your network, between your apps and Temporal." },
      { text: "Workers only know a local address and a short Namespace name: no certificate, no API key." },
      // the three gains and the way out, then a hold to read them before the push-in
      { text: "On the way out, the proxy adds TLS, the credentials and the full Namespace name.", after: 2.0 },
    ],
    build(stage, s) {
      // the lane and the Worker tiles first, in chapter 5's order, so the cut shows the same stack
      const root = s.cam = makeCamera(stage);
      s.lane = makeLane(root);
      const proxyLeft = PROXY.x - PROXY.w / 2 - 4;
      // every app's connection to the proxy, under the tiles, and the proxy's own connection to Temporal
      s.apps = [...WORKERS, ...FLEET_CLIENTS];
      s.links = s.apps.map(app => path(s.lane.svg, fleetLinkD(app, proxyLeft), C.slate, 2, false));
      const { x0, x1, y } = PROXY_WIRE;
      s.out = path(s.lane.svg, `M ${x0} ${y} L ${x1 - 4} ${y}`, C.violet, 3);
      s.tiles = WORKERS.map(w => makeWorkerTile(root, w));
      s.clients = FLEET_CLIENTS.map(app => iconTile(root, app.icon, app.name, FLEET.tile.w, FLEET.tile.h));
      s.band = E(root,
        '<div style="position:absolute;left:16.5px;top:12.5px">'
        + `<div class="mono" style="font-size:12px;line-height:18px;letter-spacing:.14em;color:${C.slate}">`
        + 'NAMESPACE</div>'
        + `<div class="mono" style="font-size:18px;line-height:26px">${FULL_NS}</div></div>`,
        '', { width: BAND.w + 'px', height: BAND.h + 'px', border: `1.5px solid ${C.line}`, borderRadius: 'var(--r)' });
      s.tube = glassTube(root, TUBE6.x1 - TUBE6.x0, TUBE6.h);
      s.tlsLabel = fixedTag(root, `${ICON('lock', 18, C.neon, 2)}TLS`, 'neon solid', 112);
      Object.assign(s.tlsLabel.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' });
      s.proxy = makeProxy(root);
      s.landing = makeRipples(root, 2, RGB.violet);
      s.sparks = s.apps.map(() => makeSpark(root, 10, RGB.violet));
      s.outSparks = [0, 1].map(() => makeSpark(root, 12, RGB.violet));
      s.noSecrets = statusTag(root, { font: 16, icon: 16 });
      s.noSecrets.style.height = '32px';
      s.credentials = statusTag(root, { font: 15, icon: 15 });
      s.credentials.style.height = '30px';
      // the card and its tags, over the proxy and the tube
      s.card = makePayload(root, { w: CARD.w });
      s.ns = cardTag(root, '', TAG.nsW);
      s.key = cardTag(root, `${ICON('key', 16, C.violet, 2)}API KEY`, TAG.keyW);
      s.clicks = [0, 1, 2].map(() => makeRipples(root, 2, RGB.neon));
    },
    update(t, c, s) {
      const pushAt = this.dur - PUSH_BEFORE_END;
      const proxyLand = c[0] + T0.proxy + T0.proxyD;
      const tlsAt = c[2] + T2.tls, keyAt = c[2] + T2.key, nsAt = c[2] + T2.ns, nsDone = nsAt + T2.nsD;
      const exitAt = c[2] + T2.exit, landAt = exitAt + T2.exitD;

      // the camera: at rest on the fleet, then right and in toward the proxy with the card, then into the proxy box
      const cam = shot(t, BARE_WORKERS_HANDOFF.shot, [
        [c[2] + T2.cam, ...SEND_SHOT, T2.camD], [pushAt, ...PROXY_SHOT, PUSH_D],
      ]);
      setCamera(s.cam, t, this.dur, { ...cam, enter: 1, exit: 1 });
      frameLaneEdges(s.lane, cam);
      // what each shot crops at the frame's edge dims as the camera moves into it: the environment, the two left
      // columns and TEMPORAL with the push toward the proxy; the two right columns, the Namespace and the card in it
      // with the push into the proxy box
      const send = P(t, c[2] + T2.cam, T2.camD);
      const push = P(t, pushAt, PUSH_D);
      const dimSend = lerp(1, OFF_SHOT, send);
      const dimPush = lerp(1, OFF_SHOT, push);
      const columnO = col => (col < 2 ? dimSend : dimPush);

      // the lane, as chapter 5 left it; the environment widens to make room for the SDK client, the Web UI and the
      // proxy on its right edge
      placeLane(s.lane, {
        ...BARE_WORKERS_HANDOFF.lane,
        envW: lerp(FLEET.envW, FLEET.proxyEnvW, P(t, c[0] + T0.widen, T0.widenD)),
        env: dimSend, temporal: dimSend,
      });

      // the Workers, bare, then each with its two lines: the proxy's local address and the short Namespace name
      s.tiles.forEach((tile, w) => {
        const slot = WORKERS[w];
        gearSpin(tile, 1);
        place(tile, slot.x, slot.y, 1, columnO(slot.col));
        const typeAt = k => c[1] + (k ? T1.namespace : T1.address) + w * T1.step;
        setText(tile.lines[0], typed(ADDRESS, P(t, typeAt(0), T1.typeD, linear)));
        setText(tile.lines[1], typed(SHORT_NS, P(t, typeAt(1), T1.typeD, linear)));
        tile.lines[1].style.color = C.violet;
      });
      s.clients.forEach((tile, i) => {
        const pop = backPop(t, c[0] + T0.clients + i * T0.clientStep);
        place(tile, FLEET_CLIENTS[i].x, FLEET_CLIENTS[i].y, pop.s, pop.o * columnO(FLEET_CLIENTS[i].col));
      });
      // under the Workers, out of the frame once the camera pushes toward the proxy
      const noSecrets = popIn(t, c[1] + T1.noSecrets);
      setStatus(s.noSecrets, 'NO SECRETS', 'ok');
      place(s.noSecrets, NO_SECRETS.x, NO_SECRETS.y, noSecrets.s, noSecrets.o * (1 - send));

      // the proxy slides into the environment's right edge and lands with a violet glow and rings
      const slide = P(t, c[0] + T0.proxy, T0.proxyD, backOut);
      const landGlow = Math.max(0, 1 - Math.abs(t - proxyLand) / 0.6);
      placeProxy(s.proxy, { dx: (1 - slide) * 180, o: P(t, c[0] + T0.proxy, 0.3), glow: landGlow });
      placeRipples(s.landing, t, proxyLand, PROXY.x, PROXY.y, 320, 600, { d: 0.9, step: 0.18 });

      // every app's connection converges on the proxy, and one connection leaves it for Temporal; light runs along
      // them on the ambient clock. The sender's lights up as its card rides it.
      const cardAt = c[2] + T2.card;
      const riding = t >= cardAt && t < cardAt + T2.cardD;
      const flow = P(t, c[0] + T0.flow, 0.5);
      s.links.forEach((link, i) => {
        const o = columnO(s.apps[i].col);
        draw(link, P(t, c[0] + T0.links + i * T0.linkStep, T0.linkD), o);
        link.setAttribute('stroke', i === SENDER && riding ? C.ink : C.slate);
        sparkOnPath(s.sparks[i], link, (G / FLOW_PERIOD + i / s.apps.length) % 1);
        s.sparks[i].style.opacity = (+s.sparks[i].style.opacity * flow * o).toFixed(3);
      });
      draw(s.out, P(t, c[0] + T0.out, T0.outD));
      s.outSparks.forEach((spark, k) => {
        sparkOnPath(spark, s.out, (G / (FLOW_PERIOD / 2) + k / 2) % 1);
        spark.style.opacity = (+spark.style.opacity * flow).toFixed(3);
      });

      // the dramatic beat: the card leaves its Worker and rides its connection into the proxy, in clear with only
      // its short Namespace name. There it gains, one at a time, each with a click: the TLS tube to Temporal (its
      // border turns neon), the API KEY, and the full Namespace name, typed over the short one. Then it goes out
      // through the tube into its Namespace in Temporal.
      const sender = WORKERS[SENDER];
      const trackEnd = PROXY.x - PROXY.w / 2 - 4;
      const ride = P(t, cardAt, T2.cardD);
      let [cardX, cardY] = alongRoute([[sender.x, sender.y], [sender.x, sender.trackY], [trackEnd, sender.trackY],
        [IN_PROXY.x, IN_PROXY.y]], ride);
      const exit = P(t, exitAt, T2.exitD);
      if (exit > 0) {
        [cardX, cardY] = bezier([[IN_PROXY.x, IN_PROXY.y], [TUBE6.x0 + 40, TUBE6.y - GROUP.dy],
          [TUBE6.x1 - 60, TUBE6.y - GROUP.dy], [IN_BAND.x, IN_BAND.y]], exit);
      }
      const inBand = P(t, landAt, 0.01);
      // in the band, it dims with it as the push into the proxy crops them
      const cardO = P(t, cardAt, 0.2) * lerp(1, dimPush, inBand);
      const cardK = lerp(0.25, CARD.k, P(t, cardAt, 0.4));
      setPayload(s.card);
      const tls = t >= tlsAt;
      s.card.style.borderColor = tls ? C.neon : '';
      const click = at => swell(t, at, 0.12);
      place(s.card, cardX, cardY, cardK * click(tlsAt), cardO);
      if (tls) s.card.style.boxShadow = glowShadow(RGB.neon, 1, { blur: 24, alpha: 0.4 });
      const nsText = typed(FULL_NS.slice(SHORT_NS.length), P(t, nsAt, T2.nsD, linear));
      const caret = t >= nsAt && t < nsDone + 0.3 ? '▌' : '';
      setText(s.ns, `${SHORT_NS}${nsText}${caret}`);
      s.ns.style.color = t >= nsAt ? C.neon : C.ink;
      s.ns.style.borderColor = t >= nsDone ? C.neon : C.violet;
      place(s.ns, cardX, cardY + CARD.h / 2, click(nsDone), cardO);
      const keyPop = backPop(t, keyAt, 0.35);
      place(s.key, cardX, cardY + KEY_DY, keyPop.s * click(keyAt + 0.2), keyPop.o * cardO);
      [tlsAt, keyAt + 0.2, nsDone].forEach((at, k) => {
        placeRipples(s.clicks[k], t, at, IN_PROXY.x, IN_PROXY.y + GROUP.dy, 160, 360, { d: 0.7, step: 0.14 });
      });

      // the TLS tube draws from the proxy to Temporal, its label pops in above it
      const tube = P(t, tlsAt, T2.tubeD, linear);
      place(s.tube, (TUBE6.x0 + TUBE6.x1) / 2, TUBE6.y, 1, tube > 0 ? 1 : 0);
      s.tube.style.clipPath = tube < 1 ? `inset(-40px ${((1 - tube) * 100).toFixed(3)}% -40px -40px)` : 'none';
      s.tube.flow.style.backgroundPosition = `${((G * 90) % 42).toFixed(2)}px 0`;
      const label = popIn(t, tlsAt + 0.2);
      place(s.tlsLabel, TUBE6.label.x, TUBE6.label.y, label.s, label.o);

      // the payments Namespace waits in Temporal, under its full name, and lights up as the card lands in it
      const lit = P(t, landAt, 0.3);
      rise(s.band, BAND.x, BAND.y, P(t, c[2] + T2.band, 0.5) * dimPush);
      s.band.style.borderColor = lit > 0 ? C.violet : C.line;
      s.band.style.background = `rgba(${RGB.violet},${(0.03 + 0.07 * lit).toFixed(3)})`;
      s.band.style.boxShadow = glowShadow(RGB.violet, lit, { blur: 36, alpha: 0.4 });

      // the credentials live in one place: the proxy
      const credentialsAt = c[2] + T2.credentials;
      const credentials = popIn(t, credentialsAt);
      setStatus(s.credentials, 'CREDENTIALS IN ONE PLACE', 'wait');
      // opaque: the environment's dashed edge runs behind it
      s.credentials.style.background = VERDICT_FILL.wait;
      place(s.credentials, CREDENTIALS.x, CREDENTIALS.y, credentials.s, credentials.o * (1 - P(t, pushAt, 0.4)));
    }
  });
}
