// ===================== 3. ENCRYPTION WITH YOUR KEYS
// Opens on the proxy stage that chapter 2 ends on (placeProxyStage), in PROXY_SHOT, and holds that shot while the
// content comes to it. YOUR KMS pops in on the proxy's left, over the dimmed Workers, linked to the proxy. A payload
// card rides in from a Worker, in clear; a DATA KEY appears in the proxy, its key flies onto the card's lock and seals
// it (lock and scramble, violet rings): NO CODE CHANGE. The data key travels to the KMS, which wraps it, and comes
// back WRAPPED to dock on the card, which goes out through the TLS tube into TEMPORAL's stored payloads, a row of
// ciphertext with its wrapped key, never a key Temporal could use. Then the proxy runs with ENCRYPTION REQUIRED: the
// KMS link is cut, the proxy restarts and does not come up, a red REFUSED TO START slams onto it with a flash, a shake
// and rings, and its connection to Temporal stays dark. The link comes back and the proxy starts, neon. Before the
// cut, this chapter's parts leave, so it ends on the proxy stage that chapter 4 opens on. The camera holds.
// The block keeps every name declared in this file local to this scene.
{
  // One screen px at PROXY_SHOT, in stage px: the parts that only the close shot shows are sized in screen px (n * U)
  const U = 1 / PROXY_SHOT[2];

  // from c[0]: YOUR KMS pops in (kms) and its link to the proxy draws (link, linkD); the card leaves its Worker and
  // rides into the proxy (card, ride); the DATA KEY pops in (key); it seals the card (seal); NO CODE CHANGE; the data
  // key leaves for the KMS (wrap, see WRAP); the card goes out to TEMPORAL's list (out, outD)
  const T0 = {
    kms: 0.1, link: 0.4, linkD: 0.5, card: 0.3, ride: 1.2, key: 0.9, seal: 1.7, noCode: 2.3, wrap: 2.3, out: 3.9,
    outD: 0.9,
  };
  // the data key's trip to the KMS and back (kmsTrip): tripD each way, stay seconds at the KMS while it wraps it, then
  // it docks on the card's bottom edge (dockD)
  const WRAP = { tripD: 0.45, stay: 0.3, dockD: 0.25 };
  // from c[1]: ENCRYPTION REQUIRED pops in the proxy (required); the KMS link is cut (cut); the proxy goes down to
  // restart (down); REFUSED TO START slams onto it (slam, slamD); the link comes back (back, backD) and the proxy
  // starts (start)
  const T1 = { required: 0.2, cut: 0.9, down: 1.4, slam: 2.2, slamD: 0.16, back: 3.9, backD: 0.5, start: 4.5 };
  // the chapter's own parts leave over LEAVE_D seconds from LEAVE_BEFORE seconds before the end, gone 0.2 s before
  // the cut
  const LEAVE_BEFORE = 0.6;
  const LEAVE_D = 0.4;

  // the Worker whose card goes through the proxy (in WORKERS): the bottom right one, clear of YOUR KMS
  const SENDER = 5;
  // the card, drawn at the close shot's size (168 px: 252 px on screen)
  const CARD = { w: 168 };
  CARD.h = payloadLayout(CARD.w).h;
  // inside the proxy: where the card is sealed, in the room under the proxy's name, and the DATA KEY above it (and the
  // key icon in its tag, from its center, where the key that flies onto the card starts)
  const SEAL = { x: PROXY.x, y: 571 };
  const DATA_KEY = { x: PROXY.x, y: 478, icon: [-50, 0] };
  // the verdicts, in the room under the proxy's name, between the DATA KEY's row and the box's bottom edge
  const VERDICT = { x: PROXY.x, y: 572 };
  // YOUR KMS on the proxy's left, just above the Workers' connections (on screen x 101-542, y 250-472): center and size
  const KMS = { x: 906, y: 412, w: 294, h: 148 };
  // the KMS link: from the KMS's right edge, a corner at x on the way down, to the DATA KEY, under it (its key's way
  // to the KMS and back, see kmsTrip)
  const LINK = { x0: KMS.x + KMS.w / 2, y0: KMS.y + 14, x: 1067, x1: DATA_KEY.x, y1: DATA_KEY.y };
  // where the cut shows on the link: on its way down
  const CUT = { x: LINK.x, y: (LINK.y0 + LINK.y1) / 2 };
  // NO CODE CHANGE, in your environment under the connections, its right edge about under YOUR KMS's, clear of the
  // Worker's lines on its left (on screen about 400, 702)
  const NO_CODE = { x: 958, y: 640 };
  // the Worker that YOUR KMS covers (in WORKERS): its lines fade out under the KMS, so no clipped text shows past it
  const COVERED = 2;
  // TEMPORAL's stored payloads, in the room of the Namespace band (PROXY_BAND): a row's size, its label's center y and
  // the row's center
  const ROW = { w: 196, h: 32 };
  const LIST = { x: PROXY_BAND.x, label: 470, row: 506 };

  // The card's way in from its Worker: along the Worker's track in the channel, then into the proxy
  const rideIn = () => [[860, WORKERS[SENDER].trackY], [1010, WORKERS[SENDER].trackY], [1090, SEAL.y],
    [SEAL.x, SEAL.y]];
  // Its way out, from where it was sealed, through the tube to its row in TEMPORAL's list
  const rideOut = () => [[SEAL.x, SEAL.y], [1330, WIRE_Y], [LIST.x - 80, LIST.row], [LIST.x, LIST.row]];
  // A tag of the close shot, sized in screen px (font; see scaledTag)
  const closeTag = (root, html, kind, font, opts = {}) => scaledTag(root, html, kind, font, { ...opts, u: U });

  scene({
    chapter: 3, title: 'Encryption with your keys',
    // hard cuts: chapter 2 ends on this chapter's first frame, this chapter on the next one's (placeProxyStage)
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the restarted proxy, then plays the leaving and the cut in one go
    holdBeforeEnd: LEAVE_BEFORE + 0.1,
    subs: [
      { text: "It encrypts every payload with data keys wrapped by your <b>KMS</b>, with no Worker code change." },
      // the restart, then a moment on it before the leaving
      { text: "With encryption required, the proxy refuses to start without a key: it <b>fails closed</b>.", after: 0.6 },
    ],
    build(stage, s) {
      // the proxy fleet first, in chapter 2's order, so the cut shows the same stack
      const root = s.cam = makeCamera(stage);
      s.fleet = makeProxyFleet(root);
      // TEMPORAL's stored payloads
      s.listLabel = E(root, 'Stored payloads', 'lbl', { fontSize: '16px', width: ROW.w + 'px', paddingLeft: '0' });
      s.row = makeStoredRow(root, 0, 1, ROW);
      // YOUR KMS and its link to the proxy, over the proxy box's edge; the cut on it
      s.kms = makeKms(root, KMS, U);
      s.top = svgLayer(root);
      const { x0, y0, x, x1, y1 } = LINK;
      s.link = path(s.top, roundedPath([[x0, y0], [x, y0], [x, y1], [x1, y1]], 8), C.violet, 2, false);
      s.cut = E(root, ICON('x', 20 * U, C.bg, 3), '', {
        width: 30 * U + 'px', height: 30 * U + 'px', borderRadius: '50%', background: C.red, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      });
      s.wrapRipples = makeRipples(root, 2, RGB.violet);
      // the proxy's state: ENCRYPTION REQUIRED, then REFUSED TO START in the theme's red verdict look, then STARTED
      s.required = closeTag(root, `${ICON('lock', 15 * U, C.violet, 2)}ENCRYPTION REQUIRED`, 'wait', 15,
        { solid: 'var(--violet-solid)' });
      s.refused = closeTag(root, 'REFUSED TO START', 'alarm', 19);
      s.refused.style.fontWeight = '700';
      s.started = closeTag(root, 'STARTED', 'ok', 19, { solid: 'var(--neon-solid)' });
      // the card, its data key and the key that flies onto its lock
      s.card = makePayload(root, { w: CARD.w });
      s.keyTag = makeKeyTag(root, U);
      s.fly = E(root, ICON('key', 26 * U, C.neon, 2.2), '', {
        filter: `drop-shadow(0 0 ${8 * U}px rgba(${RGB.neon},.8))`,
      });
      s.noCode = closeTag(root, 'NO CODE CHANGE', 'ok', 20, { solid: 'var(--neon-solid)' });
      s.sealRipples = makeRipples(root, 2, RGB.violet);
      s.alarm = makeRipples(root, 2, RGB.red);
      s.startRipples = makeRipples(root, 2, RGB.neon);
      // the flash covers the stage, outside the camera
      s.flash = makeFlash(stage);
    },
    update(t, c, s) {
      const { fleet } = s;
      const left = 1 - P(t, this.dur - LEAVE_BEFORE, LEAVE_D);
      const sealAt = c[0] + T0.seal;
      const hitAt = c[1] + T1.slam + T1.slamD;
      const startAt = c[1] + T1.start;

      // the camera holds the close shot on the proxy; the alarm shakes it
      const cam = shot(t, PROXY_SHOT, []);
      const [shakeX, shakeY] = shake(t, hitAt, 10, 0.4);
      setCamera(s.cam, t, this.dur, { ...cam, dx: cam.dx + shakeX, dy: cam.dy + shakeY, enter: 1, exit: 1 });
      placeFlash(s.flash, t, hitAt, 0.3);

      // the proxy stage, as chapter 2 left it; this chapter's parts go over it
      placeProxyStage(fleet, cam);

      // The proxy goes down to restart and stays down without its key: dimmed, its border slate, then red once
      // it refuses to start; its connection to Temporal and the light on every connection go dark. It starts again,
      // neon, once the link is back.
      const down = P(t, c[1] + T1.down, 0.3) * (1 - P(t, startAt, 0.3));
      const refused = t >= hitAt && t < startAt;
      const sealPulse = Math.max(0, 1 - Math.abs(t - sealAt - 0.15) / 0.4);
      const startPulse = Math.max(0, 1 - Math.abs(t - startAt - 0.2) / 0.6);
      placeProxy(fleet.proxy, { glow: Math.max(sealPulse, startPulse) });
      // the box stays opaque, so the environment's edge never shows through it: its shield and name dim
      fleet.proxy.firstElementChild.style.opacity = lerp(1, 0.45, down);
      fleet.proxy.style.borderColor = refused ? C.red : down > 0.5 ? C.slate : C.violet;
      const dark = lerp(1, OFF_SHOT, down);
      draw(fleet.out, 1, dark);
      flowFleetLight(fleet, OFF_SHOT * (1 - down), 1 - down);
      placeTube(fleet.tube, PROXY_TUBE, { dim: dark, label: dark });
      placeRipples(s.startRipples, t, startAt, PROXY.x, PROXY.y, 260, 560, { d: 0.9, step: 0.18 });

      // YOUR KMS beside the proxy, and its link to the DATA KEY. The link is cut (red, a cross on it, the KMS out of
      // reach), then draws again from the KMS.
      const kmsPop = backPop(t, c[0] + T0.kms);
      const cut = t >= c[1] + T1.cut && t < c[1] + T1.back;
      const unreachable = P(t, c[1] + T1.cut, 0.2) * (1 - P(t, c[1] + T1.back, 0.3));
      place(s.kms, KMS.x, KMS.y, kmsPop.s, kmsPop.o * lerp(1, 0.45, unreachable) * left);
      fleet.tiles[COVERED].lines.forEach(line => {
        line.style.opacity = 1 - kmsPop.o * left;
      });
      const linkDrawn = t < c[1] + T1.back
        ? P(t, c[0] + T0.link, T0.linkD, linear) : P(t, c[1] + T1.back, T1.backD, linear);
      draw(s.link, linkDrawn, (cut ? 0.7 : 1) * left);
      s.link.setAttribute('stroke', cut ? C.red : C.violet);
      const cutPop = popIn(t, c[1] + T1.cut, 0.3);
      place(s.cut, CUT.x, CUT.y, cutPop.s, cut ? cutPop.o : 0);

      // the dramatic beat of c[0]'s story: the card rides in from its Worker, in clear; the DATA KEY pops in, its key
      // flies onto the card's lock and seals it (lock shut, values scrambled, violet rings)
      const cardAt = c[0] + T0.card;
      let [x, y] = bezier(rideIn(), P(t, cardAt, T0.ride));
      let k = lerp(0.4, 1, P(t, cardAt, 0.5));
      let cardO = P(t, cardAt, 0.15);
      const out = P(t, c[0] + T0.out, T0.outD);
      if (out > 0) {
        [x, y] = bezier(rideOut(), out);
        k = lerp(1, 0.4, out);
        cardO *= 1 - P(out, 0.6, 0.4, linear);
      }
      setPayload(s.card, { seal: P(t, sealAt, 0.35, linear), scramble: P(t, sealAt + 0.1, 0.5, linear) });
      place(s.card, x, y, k, cardO);
      placeRipples(s.sealRipples, t, sealAt + 0.35 * LOCK_SHUT, x, y - CARD.h / 2, 12, 110, { d: 0.8, step: 0.15 });
      const flyP = P(t, sealAt - 0.3, 0.3);
      const [iconDx, iconDy] = DATA_KEY.icon;
      place(s.fly, lerp(DATA_KEY.x + iconDx * U, x, flyP), lerp(DATA_KEY.y + iconDy, y - CARD.h / 2, flyP), 1,
        flyP > 0 && t < sealAt + 0.1 ? 1 : 0);

      // the data key: DATA KEY 1 in the proxy; once it has sealed the card, it travels to the KMS, which wraps it
      // (the KMS key swells and glows, violet rings), and comes back WRAPPED to dock on the card's bottom edge, with
      // which it leaves
      const goAt = c[0] + T0.wrap;
      const trip = kmsTrip(s.link, t, goAt, WRAP);
      const keyPop = popIn(t, c[0] + T0.key);
      let tagAt = t < goAt ? [DATA_KEY.x, DATA_KEY.y] : trip.at;
      const dock = [x, y + k * CARD.h / 2 + 1];
      const docking = P(t, trip.backAt + WRAP.tripD, WRAP.dockD);
      if (docking > 0) tagAt = [lerp(LINK.x1, dock[0], docking), lerp(LINK.y1, dock[1], docking)];
      setKeyTag(s.keyTag, 1, trip.wrapped);
      place(s.keyTag, tagAt[0], tagAt[1], (docking > 0 ? k : 1) * keyPop.s * swell(t, trip.wrapAt + 0.05, 0.25),
        keyPop.o * (out > 0 ? cardO : 1));
      placeRipples(s.wrapRipples, t, trip.wrapAt + 0.05, LINK.x0, LINK.y0, 20, 120, { d: 0.7, step: 0.15 });
      const kmsGlow = win(t, trip.wrapAt - 0.1, trip.wrapAt + 0.4, 0.15);
      s.kms.kmsKey.style.transform = `scale(${swell(t, trip.wrapAt, 0.3).toFixed(4)})`;
      s.kms.kmsKey.style.filter = `drop-shadow(0 0 ${(14 * U * kmsGlow).toFixed(2)}px rgba(${RGB.violet},.9))`;

      // NO CODE CHANGE, in your environment, where the Workers' connections come from, until the proxy's trouble
      const noCode = popIn(t, c[0] + T0.noCode);
      place(s.noCode, NO_CODE.x, NO_CODE.y, noCode.s, noCode.o * (1 - P(t, c[1], 0.3)));

      // TEMPORAL's stored payloads: the sealed card lands as a row of ciphertext with its wrapped key
      const landed = P(t, c[0] + T0.out + T0.outD - 0.15, 0.3);
      place(s.listLabel, LIST.x, LIST.label, 1, P(t, c[0] + T0.out, 0.4) * left);
      place(s.row, LIST.x, LIST.row + (1 - landed) * 6, 1, landed * left);

      // c[1]: the proxy runs with encryption required; without its key, it refuses to start: REFUSED TO START slams
      // onto it from above its size, with red rings, a red flash and a shake. Once the link is back, it starts: STARTED.
      const required = popIn(t, c[1] + T1.required);
      place(s.required, DATA_KEY.x, DATA_KEY.y, required.s, required.o * left);
      const slam = P(t, c[1] + T1.slam, T1.slamD, easeIn);
      const refusedO = P(t, c[1] + T1.slam, 0.08, linear) * (1 - P(t, startAt - 0.2, 0.2));
      place(s.refused, VERDICT.x, VERDICT.y, lerp(1.7, 1, slam), refusedO);
      placeRipples(s.alarm, t, hitAt, VERDICT.x, VERDICT.y, 60, 220, { d: 0.8, step: 0.16 });
      const started = popIn(t, startAt);
      place(s.started, VERDICT.x, VERDICT.y, started.s, started.o * left);
    }
  });
}
