// ===================== 2. ONE GATEWAY, NO SECRETS
// Opens on the bare fleet that chapter 1 ends on (placeBareFleet), in WIDE_SHOT. YOUR ENVIRONMENT widens as TEMPORAL
// narrows to the right, and the TEMPORAL PROXY box slides onto the environment's right edge, landing with a violet
// glow and rings. The Workers' connections converge on it and one violet connection leaves it for Temporal. Each
// Worker types two lines only, the proxy's local address and a short Namespace name: NO SECRETS. Then a payload card
// leaves a Worker and rides its connection into the proxy as the camera pushes right and in to PROXY_SHOT, where it
// holds: at the proxy the card gains, one at a time, each with a click and neon rings, the TLS tube to Temporal, the
// API KEY and the full Namespace name (payments typed over into payments.a1b2c), and goes out through the tube into its
// Namespace in Temporal: CREDENTIALS IN ONE PLACE. Before the cut the card, its tags, the Namespace and that tag leave,
// so the chapter ends on the proxy stage that chapter 3 opens on (placeProxyStage). The camera travels one way: right
// and in.
// The block keeps every name declared in this file local to this scene.
{
  // from c[0]: the environment widens (widen, widenD); the proxy slides in (proxy, proxyD) and lands; the connections
  // draw, one after the other (links, linkStep, linkD); the proxy's own connection to Temporal draws (out, outD); light
  // flows along them (flow); each Worker's two lines type in, one Worker after the other (address, namespace, step,
  // typeD); NO SECRETS pops in under the Workers
  const T0 = {
    widen: 0, widenD: 0.9, proxy: 0.7, proxyD: 0.7, links: 1.5, linkStep: 0.1, linkD: 0.6, out: 2.5, outD: 0.5,
    flow: 2.9, address: 3.3, namespace: 3.9, step: 0.08, typeD: 0.45, noSecrets: 4.7,
  };
  // from c[1]: the card leaves its Worker and rides its connection into the proxy (card, cardD) as the camera pushes
  // right and in (cam, camD); it gains the TLS tube (tls, tubeD), the API KEY (key) and the full Namespace name (ns,
  // typed over nsD); its Namespace rises in (band); the card goes out through the tube into it (exit, exitD);
  // CREDENTIALS IN ONE PLACE
  const T1 = {
    card: 0.1, cardD: 1.4, cam: 0.3, camD: 1.5, tls: 1.9, tubeD: 0.5, key: 2.6, ns: 3.3, nsD: 0.6, band: 3.5,
    exit: 4.3, exitD: 0.8, credentials: 5.3,
  };
  // the chapter's own parts (the card, its tags, the Namespace, CREDENTIALS IN ONE PLACE) leave over LEAVE_D seconds
  // from LEAVE_BEFORE seconds before the end, gone 0.2 s before the cut
  const LEAVE_BEFORE = 0.6;
  const LEAVE_D = 0.4;

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
  // how far the proxy slides in from the right, px
  const SLIDE = 180;

  // The first round(p * length) characters of text: it types in as p goes from 0 to 1
  const typed = (text, p) => text.slice(0, Math.round(clamp(p) * text.length));

  scene({
    chapter: 2, title: 'One gateway, no secrets',
    // hard cuts: chapter 1 ends on this chapter's first frame (placeBareFleet), this chapter on the next one's
    // (placeProxyStage)
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the card in its Namespace, then plays the leaving and the cut in one go
    holdBeforeEnd: LEAVE_BEFORE + 0.1,
    subs: [
      // a pause for NO SECRETS
      { text: "<b>Temporal Proxy</b> is one gateway in your network: Workers only know a local address.", after: 0.5 },
      // the three gains and the way out, then a hold to read them before the leaving
      { text: "On the way out, it adds TLS, the credentials and the full Namespace name.", after: 1.6 },
    ],
    build(stage, s) {
      // the fleet first, in chapter 1's order, so the cut shows the same stack; the proxy's parts with it, hidden
      const root = s.cam = makeCamera(stage);
      s.fleet = makeProxyFleet(root);
      s.landing = makeRipples(root, 2, RGB.violet);
      // 19 px (16.7 px on screen at 0.88)
      s.noSecrets = statusTag(root, { font: 19, icon: 19 });
      s.noSecrets.style.height = UNDER_WORKERS.h + 'px';
      setStatus(s.noSecrets, 'NO SECRETS', 'ok');
      s.band = makeProxyBand(root, PROXY_BAND);
      s.credentials = statusTag(root, { font: 15, icon: 15 });
      s.credentials.style.height = '30px';
      setStatus(s.credentials, 'CREDENTIALS IN ONE PLACE', 'wait');
      // opaque: the environment's dashed edge runs behind it
      s.credentials.style.background = VERDICT_FILL.wait;
      // the card and its tags, over the proxy and the tube
      s.card = makePayload(root, { w: CARD.w });
      s.ns = proxyCardTag(root, '', CARD.nsW);
      s.key = proxyCardTag(root, `${ICON('key', 17, C.violet, 2)}API KEY`, CARD.keyW);
      s.clicks = [0, 1, 2].map(() => makeRipples(root, 2, RGB.neon));
    },
    update(t, c, s) {
      const { fleet } = s;
      const leaveAt = this.dur - LEAVE_BEFORE;
      const proxyLand = c[0] + T0.proxy + T0.proxyD;
      const tlsAt = c[1] + T1.tls, keyAt = c[1] + T1.key, nsAt = c[1] + T1.ns, nsDone = nsAt + T1.nsD;
      const exitAt = c[1] + T1.exit, landAt = exitAt + T1.exitD;
      const clicks = [tlsAt, keyAt + 0.2, nsDone];
      const left = 1 - P(t, leaveAt, LEAVE_D);

      // the camera: the wide shot on the fleet, then right and in with the card, to the close shot on the proxy
      const cam = shot(t, WIDE_SHOT, [[c[1] + T1.cam, ...PROXY_SHOT, T1.camD]]);
      setCamera(s.cam, t, this.dur, { ...cam, enter: 1, exit: 1 });
      // what the close shot crops at the frame's edge dims as the camera pushes in: the zones, the Workers and their
      // connections
      const push = P(t, c[1] + T1.cam, T1.camD);
      const dim = lerp(1, OFF_SHOT, push);

      // the zones, as chapter 1 left them: the environment widens to make room for the proxy on its right edge, as
      // TEMPORAL narrows to the right
      const widen = P(t, c[0] + T0.widen, T0.widenD);
      placeZones(fleet.lane, {
        envZone: lerpZone(FLEET_ZONES.env, PROXY_ZONES.env, widen),
        temporalZone: lerpZone(FLEET_ZONES.temporal, PROXY_ZONES.temporal, widen),
        env: dim, temporal: dim,
      });
      frameLaneEdges(fleet.lane, cam);

      // the Workers, bare, then each with its two lines: the proxy's local address and the short Namespace name
      fleet.tiles.forEach((tile, w) => {
        placeBareWorker(tile, WORKERS[w], dim);
        const typeAt = k => c[0] + (k ? T0.namespace : T0.address) + w * T0.step;
        tile.lines.forEach((line, k) => setText(line, typed(WORKER_LINES[k], P(t, typeAt(k), T0.typeD, linear))));
        tile.lines[1].style.color = C.violet;
      });
      // under the Workers, out of the frame once the camera pushes in
      const noSecrets = popIn(t, c[0] + T0.noSecrets);
      place(s.noSecrets, UNDER_WORKERS.x, UNDER_WORKERS.y, noSecrets.s, noSecrets.o * (1 - push));

      // the proxy slides onto the environment's right edge and lands with a violet glow and rings; each click at the
      // proxy swells its glow again
      const slide = P(t, c[0] + T0.proxy, T0.proxyD, backOut);
      const pulse = at => Math.max(0, 1 - Math.abs(t - at) / 0.5);
      const glow = Math.max(pulse(proxyLand), ...clicks.map(pulse));
      placeProxy(fleet.proxy, { dx: (1 - slide) * SLIDE, o: P(t, c[0] + T0.proxy, 0.3), glow });
      placeRipples(s.landing, t, proxyLand, PROXY.x, PROXY.y, 320, 600, { d: 0.9, step: 0.18 });

      // the Workers' connections converge on the proxy, and one connection leaves it for Temporal; light runs along
      // them on the ambient clock. The sender's lights up as its card rides it.
      const cardAt = c[1] + T1.card;
      const riding = t >= cardAt && t < cardAt + T1.cardD;
      fleet.links.forEach((link, i) => {
        draw(link, P(t, c[0] + T0.links + i * T0.linkStep, T0.linkD), dim);
        link.setAttribute('stroke', i === SENDER && riding ? C.ink : C.slate);
      });
      draw(fleet.out, P(t, c[0] + T0.out, T0.outD));
      const flow = P(t, c[0] + T0.flow, 0.5);
      flowFleetLight(fleet, flow * dim, flow);

      // the dramatic beat: the card leaves its Worker and rides its connection into the proxy, in clear with only its
      // short Namespace name. There it gains, one at a time, each with a click: the TLS tube to Temporal (its border
      // turns neon), the API KEY, and the full Namespace name, typed over the short one. Then it goes out through the
      // tube into its Namespace in Temporal.
      const sender = WORKERS[SENDER];
      const ride = P(t, cardAt, T1.cardD);
      let [cardX, cardY] = pointAlong([[sender.x, sender.y], [sender.x, sender.trackY],
        [PROXY.linkEnd, sender.trackY], [IN_PROXY.x, IN_PROXY.y]], ride);
      const exit = P(t, exitAt, T1.exitD);
      if (exit > 0) {
        [cardX, cardY] = bezier([[IN_PROXY.x, IN_PROXY.y], [PROXY_TUBE.x0 + 40, PROXY_TUBE.y - GROUP.dy],
          [PROXY_TUBE.x1 - 60, PROXY_TUBE.y - GROUP.dy], [PROXY_BAND.card.x, PROXY_BAND.card.y]], exit);
      }
      const cardO = P(t, cardAt, 0.2) * left;
      const cardK = lerp(0.25, CARD.k, P(t, cardAt, 0.4));
      setPayload(s.card);
      const tls = t >= tlsAt;
      s.card.style.borderColor = tls ? C.neon : '';
      if (tls) s.card.style.boxShadow = glowShadow(RGB.neon, 1, { blur: 24, alpha: 0.4 });
      const click = at => swell(t, at, 0.12);
      place(s.card, cardX, cardY, cardK * click(tlsAt), cardO);
      const nsTyped = typed(FULL_NS.slice(WORKER_LINES[1].length), P(t, nsAt, T1.nsD, linear));
      setHtml(s.ns, namespaceHtml(WORKER_LINES[1].length + nsTyped.length, t >= nsAt && t < nsDone + 0.3));
      s.ns.style.color = t >= nsAt ? C.neon : C.ink;
      s.ns.style.borderColor = t >= nsDone ? C.neon : C.violet;
      place(s.ns, cardX, cardY + CARD.nsDy, click(nsDone), cardO);
      const keyPop = backPop(t, keyAt, 0.35);
      place(s.key, cardX, cardY + CARD.keyDy, keyPop.s * click(keyAt + 0.2), keyPop.o * cardO);
      clicks.forEach((at, k) => {
        placeRipples(s.clicks[k], t, at, IN_PROXY.x, IN_PROXY.y + GROUP.dy, 160, 360, { d: 0.7, step: 0.14 });
      });

      // the TLS tube draws from the proxy to Temporal, its label pops in above it
      const label = popIn(t, tlsAt + 0.2);
      placeTube(fleet.tube, PROXY_TUBE, { drawn: P(t, tlsAt, T1.tubeD, linear), label: label.o, labelS: label.s });

      // the payments Namespace rises in, in Temporal, under its full name, and lights up as the card lands in it
      const bandIn = P(t, c[1] + T1.band, 0.5);
      const lit = P(t, landAt, 0.3);
      place(s.band, PROXY_BAND.x, PROXY_BAND.y + (1 - bandIn) * 24, 1, bandIn * left);
      s.band.style.borderColor = lit > 0 ? C.violet : C.line;
      s.band.style.background = `rgba(${RGB.violet},${(0.03 + 0.07 * lit).toFixed(3)})`;
      s.band.style.boxShadow = glowShadow(RGB.violet, lit, { blur: 36, alpha: 0.4 });

      // the credentials live in one place: the proxy
      const credentials = popIn(t, c[1] + T1.credentials);
      place(s.credentials, CREDENTIALS.x, CREDENTIALS.y, credentials.s, credentials.o * left);
    }
  });
}
