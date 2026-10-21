// ===================== 3. ENCRYPTION WITH YOUR KEYS
// Opens on the proxy stage that chapter 2 ends on (placeProxyStage), in PROXY_SHOT, and holds that shot while the
// content comes to it. YOUR KMS pops in on the proxy's left, over the dimmed Workers, linked to the proxy's side under
// its name. A payload card rides in from a Worker, in clear, under the KMS and its link; a DATA KEY appears in the
// proxy, its key flies onto the card's lock and seals it (lock and scramble, violet rings): NO CODE CHANGE. The data
// key travels to the KMS, which wraps it, and comes back WRAPPED to dock on the card, which goes out through the TLS
// tube into TEMPORAL's stored payloads, a row of ciphertext with its wrapped key, never a key Temporal could use.
// Before the cut, this chapter's parts leave, so it ends on the proxy stage that chapter 4 opens on. The camera holds.
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
  // the chapter's own parts leave over LEAVE_D seconds from LEAVE_BEFORE seconds before the end, gone 0.2 s before
  // the cut
  const LEAVE_BEFORE = 0.6;
  const LEAVE_D = 0.4;

  // the Worker whose card goes through the proxy (in WORKERS): the bottom right one, clear of YOUR KMS
  const SENDER = 5;
  // the card, drawn at the close shot's size (168 px: 252 px on screen)
  const CARD = { w: 168 };
  CARD.h = payloadLayout(CARD.w).h;
  // inside the proxy: where the card is sealed, in the room under the proxy's name, and the DATA KEY above it, about
  // 20 px from both the name and the card (and the key icon in its tag, from its center, where the key that flies
  // onto the card starts)
  const SEAL = { x: PROXY.x, y: 571 };
  const DATA_KEY = { x: PROXY.x, y: 483, icon: [-50, 0] };
  // YOUR KMS on the proxy's left, over the top right Worker, at the top of the close shot (on screen x 101-542,
  // y 175-415): center and size. It stays above the DATA KEY's row, so its link reaches the proxy under its name.
  const KMS = { x: 906, y: 368, w: 294, h: 160 };
  // The KMS link: from the KMS's bottom edge at x, down to the DATA KEY's row, then into the proxy's side, where it
  // ends 4 px short of the box (end), as the Workers' connections do. The data key's trip (kmsTrip) runs along the
  // same line on to the DATA KEY's center (x1), inside the box, where the key tag covers it. x keeps the travelling
  // tag (200 screen px wide) about 50 px clear of the box, so it never crosses the proxy's name.
  const LINK = { x: 960, y0: KMS.y + KMS.h / 2, y1: DATA_KEY.y, end: PROXY.linkEnd, x1: DATA_KEY.x };
  // NO CODE CHANGE, in your environment under the connections, its right edge about under YOUR KMS's, beside the
  // sending Worker's lines, clear of them on its left (on screen about 400, 794): low enough to balance YOUR KMS at the
  // top of the shot round the content frame's middle
  const NO_CODE = { x: 958, y: 700 };
  // the Worker that YOUR KMS covers (in WORKERS): its language tag and lines fade out under the KMS, so no clipped
  // label shows past it
  const COVERED = 2;
  // TEMPORAL's stored payloads, in the room of the Namespace band (PROXY_BAND): a row's size, its label's center y and
  // the row's center
  const ROW = { w: 196, h: 32 };
  const LIST = { x: PROXY_BAND.x, label: 470, row: 506 };

  // The card's way in from its Worker: it leaves the Worker's track in the channel and drops to the sealing row at
  // once, so it rides in more than 20 px under YOUR KMS and its link, then straight into the proxy
  const rideIn = () => [[860, WORKERS[SENDER].trackY], [860, SEAL.y + 45], [1000, SEAL.y], [SEAL.x, SEAL.y]];
  // Its way out, from where it was sealed, through the tube to its row in TEMPORAL's list
  const rideOut = () => [[SEAL.x, SEAL.y], [1330, WIRE_Y], [LIST.x - 80, LIST.row], [LIST.x, LIST.row]];
  // A tag of the close shot, sized in screen px (font; see scaledTag)
  const closeTag = (root, html, kind, font, opts = {}) => scaledTag(root, html, kind, font, { ...opts, u: U });

  scene({
    chapter: 3, title: 'Encryption with your keys',
    // hard cuts: chapter 2 ends on this chapter's first frame, this chapter on the next one's (placeProxyStage)
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the stored row, then plays the leaving and the cut in one go
    holdBeforeEnd: LEAVE_BEFORE + 0.1,
    subs: [
      { text: "It encrypts your payloads with data keys wrapped by your <b>KMS</b>, with no Worker code change." },
    ],
    build(stage, s) {
      // the proxy fleet first, in chapter 2's order, so the cut shows the same stack
      const root = s.cam = makeCamera(stage);
      s.fleet = makeProxyFleet(root);
      // TEMPORAL's stored payloads
      s.listLabel = E(root, 'Stored payloads', 'lbl', { fontSize: '16px', width: ROW.w + 'px', paddingLeft: '0' });
      s.row = makeStoredRow(root, 0, 1, ROW);
      // YOUR KMS and its link to the proxy, over the proxy box's edge
      s.kms = makeKms(root, KMS, U);
      s.top = svgLayer(root);
      const { x, y0, y1, end, x1 } = LINK;
      s.link = path(s.top, roundedPath([[x, y0], [x, y1], [end, y1]], 8), C.violet, 2, false);
      // the data key's way to the KMS and back, never drawn (path() leaves it hidden)
      s.trip = path(s.top, roundedPath([[x, y0], [x, y1], [x1, y1]], 8), C.violet, 2, false);
      s.wrapRipples = makeRipples(root, 2, RGB.violet);
      // the card, its data key and the key that flies onto its lock
      s.card = makePayload(root, { w: CARD.w });
      s.keyTag = makeKeyTag(root, U);
      s.fly = E(root, ICON('key', 26 * U, C.neon, 2.2), '', {
        filter: `drop-shadow(0 0 ${8 * U}px rgba(${RGB.neon},.8))`,
      });
      s.noCode = closeTag(root, 'NO CODE CHANGE', 'ok', 20, { solid: 'var(--neon-solid)' });
      s.sealRipples = makeRipples(root, 2, RGB.violet);
    },
    update(t, c, s) {
      const { fleet } = s;
      const left = 1 - P(t, this.dur - LEAVE_BEFORE, LEAVE_D);
      const sealAt = c[0] + T0.seal;

      // the camera holds the close shot on the proxy
      const cam = shot(t, PROXY_SHOT, []);
      setCamera(s.cam, t, this.dur, { ...cam, enter: 1, exit: 1 });

      // the proxy stage, as chapter 2 left it; this chapter's parts go over it. The proxy glows as it seals the card.
      placeProxyStage(fleet, cam);
      const sealPulse = Math.max(0, 1 - Math.abs(t - sealAt - 0.15) / 0.4);
      placeProxy(fleet.proxy, { glow: sealPulse });

      // YOUR KMS beside the proxy, over a Worker whose labels fade under it, and its link to the proxy's side
      const kmsPop = backPop(t, c[0] + T0.kms);
      place(s.kms, KMS.x, KMS.y, kmsPop.s, kmsPop.o * left);
      const covered = fleet.tiles[COVERED];
      [covered.langTag, ...covered.lines].forEach(label => {
        label.style.opacity = 1 - kmsPop.o * left;
      });
      draw(s.link, P(t, c[0] + T0.link, T0.linkD, linear), left);

      // the dramatic beat: the card rides in from its Worker, in clear; the DATA KEY pops in, its key flies onto the
      // card's lock and seals it (lock shut, values scrambled, violet rings)
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
      const trip = kmsTrip(s.trip, t, goAt, WRAP);
      const keyPop = popIn(t, c[0] + T0.key);
      let tagAt = t < goAt ? [DATA_KEY.x, DATA_KEY.y] : trip.at;
      const dock = [x, y + k * CARD.h / 2 + 1];
      const docking = P(t, trip.backAt + WRAP.tripD, WRAP.dockD);
      if (docking > 0) tagAt = [lerp(LINK.x1, dock[0], docking), lerp(LINK.y1, dock[1], docking)];
      setKeyTag(s.keyTag, 1, trip.wrapped);
      place(s.keyTag, tagAt[0], tagAt[1], (docking > 0 ? k : 1) * keyPop.s * swell(t, trip.wrapAt + 0.05, 0.25),
        keyPop.o * (out > 0 ? cardO : 1));
      placeRipples(s.wrapRipples, t, trip.wrapAt + 0.05, LINK.x, LINK.y0, 20, 120, { d: 0.7, step: 0.15 });
      const kmsGlow = win(t, trip.wrapAt - 0.1, trip.wrapAt + 0.4, 0.15);
      s.kms.kmsKey.style.transform = `scale(${swell(t, trip.wrapAt, 0.3).toFixed(4)})`;
      s.kms.kmsKey.style.filter = `drop-shadow(0 0 ${(14 * U * kmsGlow).toFixed(2)}px rgba(${RGB.violet},.9))`;

      // NO CODE CHANGE, in your environment, where the Workers' connections come from
      const noCode = popIn(t, c[0] + T0.noCode);
      place(s.noCode, NO_CODE.x, NO_CODE.y, noCode.s, noCode.o * left);

      // TEMPORAL's stored payloads: the sealed card lands as a row of ciphertext with its wrapped key
      const landed = P(t, c[0] + T0.out + T0.outD - 0.15, 0.3);
      place(s.listLabel, LIST.x, LIST.label, 1, P(t, c[0] + T0.out, 0.4) * left);
      place(s.row, LIST.x, LIST.row + (1 - landed) * 6, 1, landed * left);
    }
  });
}
