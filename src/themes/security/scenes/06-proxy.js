// ===================== 6. MEET TEMPORAL PROXY
// Opens on the bare Workers that chapter 5 ended on (BARE_WORKERS_HANDOFF), in chapter 4's wide shot. Your environment
// widens as TEMPORAL narrows to the right, an SDK client and the Web UI join the Workers, and the TEMPORAL PROXY box
// slides into the environment's right edge with a violet glow. Every app's
// connection converges on it, and one connection leaves it for Temporal. Each Worker learns two lines only, the
// proxy's local address and a short Namespace name: NO SECRETS. Then the camera pushes in toward the proxy as a
// payload card leaves a Worker in a plain connection: at the proxy it gains, one at a time, the TLS tube, the API KEY
// and the full Namespace name (payments typed over into payments.a1b2c), each with a click, and goes out to Temporal:
// CREDENTIALS IN ONE PLACE. The chapter ends pushing into the proxy box (PROXY_SHOT), where the box fills the content
// frame's height: only the box, the TLS tube and its label stay bright; everything else is dimmed (OFF_SHOT), faded
// out (the SDK client and the Web UI, which it crops into the header and subtitle bands) or out of the frame. The camera travels one way: right and in.
// The block keeps every name declared in this file local to this scene.
{
  // camera framings, [x, y, scale] for shot(): from c[2], on the proxy's side of the fleet, the two right columns, the
  // proxy, the TLS tube and TEMPORAL whole (x 230-1690, y 158-872 on screen; text renders at 1.2x), on the way from
  // the wide shot to PROXY_SHOT
  const SEND_SHOT = [1292, 515, 1.2];
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
  // the card and its tags (PROXY_CARD); GROUP: the group of the three, from the card's center (dy: to its middle)
  const CARD = PROXY_CARD;
  const GROUP = { top: -CARD.h / 2, bottom: CARD.keyDy + CARD.tagH / 2 };
  GROUP.dy = (GROUP.top + GROUP.bottom) / 2;
  // inside the proxy, the group is centered in the room under its name
  const IN_PROXY = { x: PROXY.x, y: PROXY.y + PROXY.head.bottom / 2 - GROUP.dy };
  // CREDENTIALS IN ONE PLACE, under the proxy
  const CREDENTIALS = { x: PROXY.x, y: PROXY.y + PROXY.h / 2 + 38 };

  // The point at progress p (0 to 1) along a route of straight legs between points, at constant speed
  const alongRoute = (points, p) => {
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
  };
  // The first round(p * length) characters of text: it types in as p goes from 0 to 1
  const typed = (text, p) => text.slice(0, Math.round(clamp(p) * text.length));

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
      Object.assign(s, makeFleet(root));
      s.band = makeProxyBand(root);
      s.tube = makeProxyTube(root, s.out);
      s.proxy = makeProxy(root);
      s.landing = makeRipples(root, 2, RGB.violet);
      s.sparks = s.apps.map(() => makeSpark(root, 10, RGB.violet));
      s.outSparks = [0, 1].map(() => makeSpark(root, 12, RGB.violet));
      // 19 px (16.7 px on screen), as WORKERS UNCHANGED in chapter 8, in the same place
      s.noSecrets = statusTag(root, { font: 19, icon: 19 });
      s.noSecrets.style.height = UNDER_WORKERS.h + 'px';
      balanceTagLabel(s.noSecrets, 'ok');
      s.credentials = statusTag(root, { font: 15, icon: 15 });
      s.credentials.style.height = '30px';
      balanceTagLabel(s.credentials, 'wait');
      // the card and its tags, over the proxy and the tube
      s.card = makePayload(root, { w: CARD.w });
      s.ns = proxyCardTag(root, '', CARD.nsW);
      s.key = proxyCardTag(root, `${ICON('key', 17, C.violet, 2)}API KEY`, CARD.keyW);
      s.clicks = [0, 1, 2].map(() => makeRipples(root, 2, RGB.neon));
    },
    update(t, c, s) {
      const pushAt = this.dur - PUSH_BEFORE_END;
      const proxyLand = c[0] + T0.proxy + T0.proxyD;
      const tlsAt = c[2] + T2.tls, keyAt = c[2] + T2.key, nsAt = c[2] + T2.ns, nsDone = nsAt + T2.nsD;
      const exitAt = c[2] + T2.exit, landAt = exitAt + T2.exitD;

      // the camera: chapter 4's wide shot on the fleet, then right and in toward the proxy with the card, then into
      // the proxy box
      const cam = shot(t, BARE_WORKERS_HANDOFF.shot, [
        [c[2] + T2.cam, ...SEND_SHOT, T2.camD], [pushAt, ...PROXY_SHOT, PUSH_D],
      ]);
      setCamera(s.cam, t, this.dur, { ...cam, enter: 1, exit: 1 });
      // what each shot crops at the frame's edge dims as the camera moves into it: the environment, the two left
      // columns and TEMPORAL with the push toward the proxy; the two right columns, the Namespace and the card in it
      // with the push into the proxy box
      const send = P(t, c[2] + T2.cam, T2.camD);
      const push = P(t, pushAt, PUSH_D);
      const dimSend = lerp(1, OFF_SHOT, send);
      const dimPush = lerp(1, OFF_SHOT, push);
      const columnO = col => (col < 2 ? dimSend : dimPush);

      // the lane, as chapter 5 left it; the environment widens to make room for the SDK client, the Web UI and the
      // proxy on its right edge, as TEMPORAL narrows to the right
      const widen = P(t, c[0] + T0.widen, T0.widenD);
      placeLane(s.lane, {
        ...BARE_WORKERS_HANDOFF.lane,
        envZone: lerpZone(FLEET_ZONES.env, PROXY_ZONES.env, widen),
        temporalZone: lerpZone(FLEET_ZONES.temporal, PROXY_ZONES.temporal, widen),
        env: dimSend, temporal: dimSend,
      });
      frameLaneEdges(s.lane, cam);

      // the Workers, bare, then each with its two lines: the proxy's local address and the short Namespace name
      s.tiles.forEach((tile, w) => {
        const slot = WORKERS[w];
        gearSpin(tile, 1);
        place(tile, slot.x, slot.y, 1, columnO(slot.col));
        const typeAt = k => c[1] + (k ? T1.namespace : T1.address) + w * T1.step;
        setText(tile.lines[0], typed(WORKER_LINES[0], P(t, typeAt(0), T1.typeD, linear)));
        setText(tile.lines[1], typed(WORKER_LINES[1], P(t, typeAt(1), T1.typeD, linear)));
        tile.lines[1].style.color = C.violet;
      });
      // the SDK client and the Web UI: the push into the proxy crops them into the header and subtitle bands, so they
      // fade out early in the push, as chapter 7 keeps them until its pull-back
      const clientsOut = 1 - P(t, pushAt, PUSH_D * 0.6);
      s.clients.forEach((tile, i) => {
        const pop = backPop(t, c[0] + T0.clients + i * T0.clientStep);
        place(tile, FLEET_CLIENTS[i].x, FLEET_CLIENTS[i].y, pop.s, pop.o * clientsOut);
      });
      // under the Workers, out of the frame once the camera pushes toward the proxy
      const noSecrets = popIn(t, c[1] + T1.noSecrets);
      setStatus(s.noSecrets, 'NO SECRETS', 'ok');
      place(s.noSecrets, UNDER_WORKERS.x, UNDER_WORKERS.y, noSecrets.s, noSecrets.o * (1 - send));

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
        sparkOnPath(s.sparks[i], link, (G / PROXY_FLOW_PERIOD + i / s.apps.length) % 1, flow * o);
      });
      draw(s.out, P(t, c[0] + T0.out, T0.outD));
      s.outSparks.forEach((spark, k) => sparkOnPath(spark, s.out, (G / (PROXY_FLOW_PERIOD / 2) + k / 2) % 1, flow));

      // the dramatic beat: the card leaves its Worker and rides its connection into the proxy, in clear with only
      // its short Namespace name. There it gains, one at a time, each with a click: the TLS tube to Temporal (its
      // border turns neon), the API KEY, and the full Namespace name, typed over the short one. Then it goes out
      // through the tube into its Namespace in Temporal.
      const sender = WORKERS[SENDER];
      const ride = P(t, cardAt, T2.cardD);
      let [cardX, cardY] = alongRoute([[sender.x, sender.y], [sender.x, sender.trackY],
        [PROXY.linkEnd, sender.trackY], [IN_PROXY.x, IN_PROXY.y]], ride);
      const exit = P(t, exitAt, T2.exitD);
      if (exit > 0) {
        [cardX, cardY] = bezier([[IN_PROXY.x, IN_PROXY.y], [PROXY_TUBE.x0 + 40, PROXY_TUBE.y - GROUP.dy],
          [PROXY_TUBE.x1 - 60, PROXY_TUBE.y - GROUP.dy], [PROXY_BAND.card.x, PROXY_BAND.card.y]], exit);
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
      const nsTyped = typed(FULL_NS.slice(WORKER_LINES[1].length), P(t, nsAt, T2.nsD, linear));
      setHtml(s.ns, namespaceHtml(WORKER_LINES[1].length + nsTyped.length, t >= nsAt && t < nsDone + 0.3));
      s.ns.style.color = t >= nsAt ? C.neon : C.ink;
      s.ns.style.borderColor = t >= nsDone ? C.neon : C.violet;
      place(s.ns, cardX, cardY + CARD.nsDy, click(nsDone), cardO);
      const keyPop = backPop(t, keyAt, 0.35);
      place(s.key, cardX, cardY + CARD.keyDy, keyPop.s * click(keyAt + 0.2), keyPop.o * cardO);
      [tlsAt, keyAt + 0.2, nsDone].forEach((at, k) => {
        placeRipples(s.clicks[k], t, at, IN_PROXY.x, IN_PROXY.y + GROUP.dy, 160, 360, { d: 0.7, step: 0.14 });
      });

      // the TLS tube draws from the proxy to Temporal, its label pops in above it
      const label = popIn(t, tlsAt + 0.2);
      placeTube(s.tube, PROXY_TUBE, { drawn: P(t, tlsAt, T2.tubeD, linear), label: label.o, labelS: label.s });

      // the payments Namespace waits in Temporal, under its full name, and lights up as the card lands in it
      const lit = P(t, landAt, 0.3);
      // it rises in, then dims in place as the push into the proxy crops it
      const bandIn = P(t, c[2] + T2.band, 0.5);
      place(s.band, PROXY_BAND.x, PROXY_BAND.y + (1 - bandIn) * 24, 1, bandIn * dimPush);
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
