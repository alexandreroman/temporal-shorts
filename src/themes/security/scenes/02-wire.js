// ===================== 2. ON THE WIRE
// Opens on the push-in that ended chapter 1 (WIRE_SHOT). A neon TLS tube draws along the wire and the payload card
// rides it toward Temporal while an eavesdropper's beam scans it and reads only ciphertext. The Worker's identity
// badge is checked and turns VERIFIED; an unknown client is REJECTED. TEMPORAL splits into three Namespaces under a
// sweep of light, the card enters payments only, and the camera starts its whip right (TUBE_HANDOFF) into chapter 3.
// The block keeps every name declared in this file local to this scene.
{
  // camera framings, [x, y, scale] for shot(): along the tube as the card rides it (from, then to), then back to
  // the whole way from the Worker to TEMPORAL for the identity check, then on TEMPORAL's Namespaces
  const TUBE_FROM = [760, 560, 1.4];
  const TUBE_TO = [900, 560, 1.4];
  const ID_SHOT = [960, 515, 1.1];
  // the move into the tube shot, from c[0]: start and duration
  const TUBE_AT = 0.6, TUBE_D = 1.0;
  const NS_SHOT = TUBE_HANDOFF.from;
  // the card's stops in the tube, at TUBE.k: by the Worker, then by TEMPORAL's edge
  const RIDE = { x0: TUBE.x0 + 120, x1: TUBE.x1 - 120 };
  // the outsiders under the wire, between the zones, one after the other: the eavesdropper, then the unknown client;
  // their verdict tags straddle their bottom edge
  const OUTSIDER = { x: (LANE.wire.x0 + LANE.wire.x1) / 2, y: 735, w: 320, h: 132 };
  const VERDICT_Y = OUTSIDER.y + OUTSIDER.h / 2;
  // the beam rises from the eavesdropper's top to the tube's bottom wall, spread over BEAM_W there
  const BEAM_FROM = OUTSIDER.y - OUTSIDER.h / 2;
  const BEAM_W = 120;
  // ciphertext glyphs on the eavesdropper's readout: two lines of NOISE_COLS; GLYPHS of them pour down the beam
  const NOISE_COLS = 24;
  const GLYPHS = 8;
  // the identity badge: it leaves the Worker's top right and lands above the tube's end, by TEMPORAL's edge
  const BADGE = { x: 990, y: 330, w: 320, h: 150, from: [450, 380] };
  // the unknown client's request, up to TEMPORAL's edge, where a red barrier stops it
  const REQUEST_PATH = `M 1050 676 Q 1110 650 ${LANE.temporal.x - 6} 628`;
  const BARRIER = { x: LANE.temporal.x, y: 625, h: 150 };
  // the beats, in seconds from their cue: c[0] the tube and the eavesdropper, c[1] the identities, c[2] the split
  const T0 = { door: 0, tube: 0.1, tubeD: 0.8, label: 0.7, lift: 0.6, liftD: 0.7, ride: 1.4, rideD: 3.0,
    spy: 1.0, beam: 1.4, lock: 2.6, unlock: 3.8 };
  const T1 = { cam: 0.2, spyOut: 0.1, badge: 0.6, badgeD: 1.2, scan: 2.0, scanD: 0.6, verified: 2.6, client: 3.4,
    request: 3.9, requestD: 0.4 };
  const T2 = { out: 0.1, cam: 0.2, sweep: 1.1, sweepD: 0.9, lit: 2.0, locks: [2.4, 2.6], enter: 3.2, enterD: 0.6 };

  // A line of ciphertext glyphs for the readout: `salt` picks another draw of them
  const noiseLine = (row, salt) => Array.from({ length: NOISE_COLS }, (_, col) => cipherGlyph(row + 7, col, salt))
    .join('');
  // An outsider's tile: an icon and a name, then a second row (HTML) under them
  function makeOutsider(root, icon, name, color, rowHtml, look) {
    return E(root,
      '<div style="position:absolute;left:18.5px;top:14.5px;display:flex;gap:10px;align-items:center">'
      + `${ICON(icon, 26, color, 1.8)}<span class="lbl" style="font-size:16px;color:${color}">${name}</span></div>`
      + rowHtml,
      'tile', { width: OUTSIDER.w + 'px', height: OUTSIDER.h + 'px', textAlign: 'left', ...look });
  }
  // A verdict tag (statusTag), 30 px high so it centers on whole pixels
  function makeVerdict(root) {
    const e = statusTag(root, { font: 15, icon: 15 });
    Object.assign(e.style, { height: '30px', background: C.bg });
    return e;
  }

  scene({
    chapter: 2, title: 'On the wire',
    // hard cuts: chapter 1 ends on this chapter's first frame, this chapter in the whip that chapter 3 lands
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the Namespaces, then plays the start of the whip and the cut in one go
    holdBeforeEnd: TUBE_HANDOFF.cut + 0.1,
    subs: [
      { text: "On its way out, the payload travels over <b>TLS</b>, so nobody on the network can read it." },
      // REJECTED, then a hold to read it
      { text: "The Worker proves who it is: a certificate from your own CA, or an API key.", after: 0.6 },
      { text: "Each <b>Namespace</b> is isolated: the Worker reaches only the Namespace its credentials allow." },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.lane = makeLane(root);
      s.ns = makeNamespaces(s.lane);
      // the eavesdropper's beam and the client's request, under the tube and the tiles
      s.beam = document.createElementNS(SVGNS, 'polygon');
      s.beam.setAttribute('fill', `rgba(${RGB.red},.16)`);
      s.beam.setAttribute('stroke', `rgba(${RGB.red},.5)`);
      s.beam.setAttribute('stroke-width', '1.5');
      s.lane.svg.appendChild(s.beam);
      s.request = path(s.lane.svg, REQUEST_PATH, C.slate, 2.5, false);
      s.tube = makeTube(root);

      s.spy = makeOutsider(root, 'eye', 'Eavesdropper', C.red,
        '<div class="readout mono" style="position:absolute;left:18.5px;right:18.5px;top:52.5px;height:52px;'
        + `padding:4px 12px;font-size:15px;line-height:22px;white-space:pre;color:${C.slate};`
        + `background:rgba(0,0,0,.3);border:1px solid ${C.line};border-radius:var(--rs)"></div>`,
        { borderColor: `rgba(${RGB.red},.7)`, background: '#211617' });
      s.spy.readout = s.spy.querySelector('.readout');
      s.client = makeOutsider(root, 'server', 'Unknown client', C.ink,
        `<div class="mono" style="position:absolute;left:18.5px;top:62.5px;font-size:15px;color:${C.slate}">`
        + 'no credentials</div>', {});
      s.badge = E(root,
        '<div style="position:absolute;left:18.5px;top:14.5px;display:flex;gap:10px;align-items:center">'
        + `${ICON('badge', 26, C.ink, 1.8)}<span class="lbl" style="font-size:16px;color:var(--ink)">Identity</span>`
        + '</div>'
        + ['mTLS CERTIFICATE · YOUR CA', 'API KEY'].map((text, i) => '<div class="mono" style="position:absolute;'
          + `left:18.5px;right:18.5px;top:${54.5 + i * 42}px;height:34px;line-height:31px;padding-left:12px;`
          + `font-size:14px;letter-spacing:.06em;border:1.5px solid ${C.lineLight};border-radius:var(--rs)">`
          + `${text}</div>`).join(''),
        'tile', { width: BADGE.w + 'px', height: BADGE.h + 'px', textAlign: 'left' });
      s.badge.scan = E(s.badge, '', '', {
        left: '0', width: '100%', height: '2px', background: C.neon, boxShadow: `0 0 10px 2px rgba(${RGB.neon},.5)`,
      });
      s.verified = statusTag(s.badge, { font: 14, icon: 14 });
      Object.assign(s.verified.style, {
        left: 'auto', right: '16.5px', top: '14.5px', transformOrigin: 'right center',
      });

      s.card = makePayload(root, { w: PAYLOAD_IN_WORKER.w });
      // the beam's scan line on the tube, over the card it reads, and the glyphs it pulls down
      s.scanBar = E(root, '', '', {
        width: '4px', height: (TUBE.h - 12) + 'px', background: C.red, borderRadius: '2px',
        boxShadow: `0 0 14px 3px rgba(${RGB.red},.55)`,
      });
      s.glyphs = Array.from({ length: GLYPHS }, () => E(root, '', 'mono', { fontSize: '17px', color: C.red }));
      s.requestHead = makeSpark(root, 12, RGB.ink);
      s.barrier = E(root, '', '', {
        width: '6px', height: BARRIER.h + 'px', background: C.red, borderRadius: '3px',
        boxShadow: `0 0 18px 4px rgba(${RGB.red},.6)`,
      });
      s.redRipples = makeRipples(root, 2, RGB.red);
      s.lockRipples = [0, 1].map(() => makeRipples(root, 2, RGB.neon));
      s.unreadable = makeVerdict(root);
      s.rejected = makeVerdict(root);
      // the flash covers the stage, outside the camera
      s.flash = makeFlash(stage);
    },
    update(t, c, s) {
      const whipAt = this.dur - TUBE_HANDOFF.cut;
      const whip = tubeWhip(t - whipAt);
      const rejectAt = c[1] + T1.request + T1.requestD;

      // the camera: along the tube with the card, back to the whole way for the identities, on to the Namespaces,
      // then the whip toward the Event History; the rejection shakes it
      const cam = t < whipAt ? shot(t, WIRE_SHOT, [
        [c[0] + TUBE_AT, ...TUBE_FROM, TUBE_D], [c[0] + 1.6, ...TUBE_TO, 2.6],
        [c[1] + T1.cam, ...ID_SHOT, 1.0], [c[2] + T2.cam, ...NS_SHOT, 1.0],
      ]) : whip.camera;
      const [shakeX, shakeY] = shake(t, rejectAt, 10, 0.4);
      setCamera(s.cam, t, this.dur, { ...cam, dx: cam.dx + shakeX, dy: cam.dy + shakeY, enter: 1, exit: 1 });
      frameLaneEdges(s.lane, cam);
      placeFlash(s.flash, t, rejectAt, 0.3);

      // the lane, as chapter 1 left it: the zones and the history come back as the camera pulls back; the tube
      // replaces the wire, and the door, its work done, fades. What a held shot crops at the frame's edge dims with
      // the move into that shot: the Worker along the tube, the environment and the Worker on the Namespaces.
      const back = P(t, c[1] + T1.cam, 1.0);
      const undim = k => lerp(k, 1, back);
      const onTube = P(t, c[0] + TUBE_AT, TUBE_D) * (1 - back);
      const onNs = P(t, c[2] + T2.cam, 1.0);
      const workerO = lerp(lerp(1, OFF_SHOT, onTube), TUBE_HANDOFF.lane.worker, onNs);
      placeLane(s.lane, {
        env: lerp(undim(WIRE_LANE.env), TUBE_HANDOFF.lane.env, onNs), worker: workerO,
        temporal: undim(WIRE_LANE.temporal), history: undim(WIRE_LANE.history), heads: undim(WIRE_LANE.heads),
        wire: 1 - P(t, c[0] + T0.tube, T0.tubeD), door: 1 - P(t, c[0] + T0.door, 0.4),
      });
      placeTube(s.tube, P(t, c[0] + T0.tube, T0.tubeD, linear), 1, popIn(t, c[0] + T0.label).o);
      s.tube.label.style.transform += ` scale(${popIn(t, c[0] + T0.label).s})`;

      // the card: out of the Worker into the tube, along it to TEMPORAL's edge, into payments, then the whip
      const lift = P(t, c[0] + T0.lift, T0.liftD);
      let cardX = lerp(PAYLOAD_IN_WORKER.x, RIDE.x0, lift);
      const cardY = lerp(PAYLOAD_IN_WORKER.y, TUBE.y, lift);
      const rideAt = c[0] + T0.ride;
      const rideX = at => lerp(RIDE.x0, RIDE.x1, P(at, rideAt, T0.rideD));
      cardX = t < rideAt ? cardX : rideX(t);
      cardX = lerp(cardX, TUBE_HANDOFF.card[0], P(t, c[2] + T2.enter, T2.enterD));
      const [x, y] = t < whipAt ? [cardX, cardY] : whip.card;
      place(s.card, x, y, lerp(1, TUBE.k, lift));

      // the eavesdropper rises under the wire; its beam searches the tube from TEMPORAL's side, locks on the card
      // and follows it, its readout flickering with ciphertext, then lets go: UNREADABLE
      rise(s.spy, OUTSIDER.x, OUTSIDER.y, P(t, c[0] + T0.spy, 0.5) * (1 - P(t, c[1] + T1.spyOut, 0.3)));
      const lockAt = c[0] + T0.lock, unlockAt = c[0] + T0.unlock;
      const beamOn = P(t, c[0] + T0.beam, 0.3) * (1 - P(t, unlockAt, 0.3));
      const locked = t >= lockAt && t < unlockAt;
      const beamX = t < lockAt ? lerp(TUBE.x1 - 80, rideX(lockAt), P(t, c[0] + T0.beam, lockAt - c[0] - T0.beam))
        : rideX(Math.min(t, unlockAt));
      const tubeBottom = TUBE.y + TUBE.h / 2;
      s.beam.setAttribute('points', `${OUTSIDER.x - 10},${BEAM_FROM} ${OUTSIDER.x + 10},${BEAM_FROM} `
        + `${beamX + BEAM_W / 2},${tubeBottom} ${beamX - BEAM_W / 2},${tubeBottom}`);
      s.beam.style.opacity = beamOn;
      place(s.scanBar, beamX, TUBE.y, 1, beamOn);
      // the readout: listening, then the ciphertext the beam reads, redrawn 15 times a second, then frozen
      const salt = locked ? 1 + Math.floor(t * 15) : 0;
      const readout = t < lockAt ? 'LISTENING' : `${noiseLine(0, salt)}\n${noiseLine(1, salt)}`;
      if (s.spy.readout._text !== readout) {
        s.spy.readout.textContent = readout;
        s.spy.readout._text = readout;
      }
      s.spy.readout.style.color = t < lockAt ? C.slate : C.red;
      s.glyphs.forEach((e, i) => {
        const f = ((t - lockAt) * 1.6 + i / GLYPHS) % 1;
        const gx = lerp(beamX + (hash(i + 40) - 0.5) * 80, OUTSIDER.x, f);
        e.textContent = cipherGlyph(i, Math.floor(t * 15), 500);
        place(e, gx, lerp(tubeBottom - 10, BEAM_FROM + 20, f), 1, locked ? Math.sin(Math.PI * f) : 0);
      });
      const unreadable = popIn(t, unlockAt + 0.1);
      setStatus(s.unreadable, 'UNREADABLE', 'denied');
      place(s.unreadable, OUTSIDER.x, VERDICT_Y, unreadable.s, unreadable.o * (1 - P(t, c[1] + T1.spyOut, 0.3)));

      // the identity badge slides out of the Worker, along an arc over the tube, to TEMPORAL's edge; a scan line
      // checks it, and it turns VERIFIED
      const badgeP = P(t, c[1] + T1.badge, T1.badgeD);
      const [bx, by] = bezier([BADGE.from, [600, 250], [850, 250], [BADGE.x, BADGE.y]], badgeP);
      const out2 = 1 - P(t, c[2] + T2.out, 0.4);
      place(s.badge, bx, by, lerp(0.3, 1, badgeP), P(t, c[1] + T1.badge, 0.2) * out2);
      const scan = P(t, c[1] + T1.scan, T1.scanD, linear);
      s.badge.scan.style.top = Math.round(scan * (BADGE.h - 5)) + 'px';
      s.badge.scan.style.opacity = scan > 0 && scan < 1 ? 1 : 0;
      const verifiedAt = c[1] + T1.verified;
      placeStatusTag(s.verified, t, 'VERIFIED', 'ok', P(t, verifiedAt, 0.2), verifiedAt);
      s.badge.style.borderColor = t >= verifiedAt ? C.neon : C.line;

      // an unknown client tries to connect: its request hits a red barrier at TEMPORAL's edge (flash, shake) and
      // bounces off; REJECTED
      rise(s.client, OUTSIDER.x, OUTSIDER.y, P(t, c[1] + T1.client, 0.5) * out2);
      s.client.style.borderColor = t >= rejectAt ? C.red : C.line;
      const request = P(t, c[1] + T1.request, T1.requestD, easeIn);
      draw(s.request, request, 0.8 * (1 - P(t, rejectAt, 0.3)));
      sparkOnPath(s.requestHead, s.request, request);
      const barrier = t >= rejectAt ? 1 - P(t, rejectAt + 0.2, 0.6) : 0;
      place(s.barrier, BARRIER.x, BARRIER.y, 1, barrier);
      placeRipples(s.redRipples, t, rejectAt, BARRIER.x, BARRIER.y - 3, 40, 200, { d: 0.8, step: 0.15 });
      const rejected = popIn(t, rejectAt + 0.1);
      setStatus(s.rejected, 'REJECTED', 'denied');
      place(s.rejected, OUTSIDER.x, VERDICT_Y, rejected.s, rejected.o * out2);

      // TEMPORAL splits into Namespaces under a sweep of light: payments lights up, the other two dim and lock
      const lockSeal = T2.locks.map(at => P(t, c[2] + at, 0.5, linear));
      placeNamespaces(s.ns, P(t, c[2] + T2.sweep, T2.sweepD, linear), P(t, c[2] + T2.lit, 0.5), lockSeal);
      const others = NAMESPACES.map((ns, i) => i).filter(i => !NAMESPACES[i].mine);
      s.lockRipples.forEach((rings, k) => {
        const [lx, ly] = nsLockAt(others[k]);
        placeRipples(rings, t, c[2] + T2.locks[k] + 0.5 * LOCK_SHUT, lx, ly, 30, 140, { d: 0.8, step: 0.2 });
      });
    }
  });
}
