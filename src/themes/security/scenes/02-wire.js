// ===================== 2. ON THE WIRE
// Opens on the push-in that ended chapter 1 (WIRE_SHOT). A neon TLS tube draws along the wire and the payload card
// rides it toward Temporal while an eavesdropper's beam scans it and reads only ciphertext. The gap between the zones
// turns out to be the PUBLIC INTERNET; a private corridor (PRIVATE LINK) seals the tube off from it, the eavesdropper
// loses sight of the wire and a PRIVATE-ONLY RULE tag snaps on. The Worker's identity badge slides into the shot and
// turns VERIFIED; an unknown client comes in under the wire and is REJECTED. TEMPORAL splits into three Namespaces
// under a sweep of light, the card enters payments only, and the camera starts its whip right (TUBE_HANDOFF) into
// chapter 3. The camera only moves forward: right along the lane, its scale never shrinking (1.35, 1.4, then the
// whip's 1.6); what the story needs from the Worker comes to it.
// The block keeps every name declared in this file local to this scene.
{
  // camera framings, [x, y, scale] for shot(): along the tube as the card rides it (from, then to, held while the
  // identities come to the camera: it centers the tube), then on TEMPORAL's Namespaces, from the tube's mouth to the
  // bands' right edge (TUBE_HANDOFF.from)
  const TUBE_FROM = [760, 548, 1.4];
  const TUBE_TO = [(TUBE.x0 + TUBE.x1) / 2, 548, 1.4];
  // the move into the tube shot, from c[0]: start and duration
  const TUBE_AT = 0.6, TUBE_D = 1.0;
  const NS_SHOT = TUBE_HANDOFF.from;
  // the card's stops in the tube, at TUBE.k: by the Worker, then by TEMPORAL's edge
  const RIDE = { x0: TUBE.x0 + 120, x1: TUBE.x1 - 120 };
  // the outsiders under the wire, between the zones, one after the other, their tops in line (top): the eavesdropper
  // (spyH high), then the unknown client (clientH), which holds one line under its name. Inside a tile, px from its
  // padding box: its heading's top, with its verdict tag (VERDICT) on the right of the same line, its second row's
  // top, and the inset of both from its sides.
  const OUTSIDER = {
    x: (LANE.wire.x0 + LANE.wire.x1) / 2, top: 672, w: 340, spyH: 120, clientH: 88,
    headTop: 14.5, rowTop: 50.5, inset: 14.5,
  };
  // a verdict tag: its text size and height, centered on the heading's line (icon 22 px high)
  const VERDICT = { font: 14, h: 28 };
  VERDICT.top = OUTSIDER.headTop + 11 - VERDICT.h / 2;
  // the beam rises from the eavesdropper's top to the tube's bottom wall, spread over BEAM_W there
  const BEAM_FROM = OUTSIDER.top;
  const BEAM_W = 120;
  // ciphertext glyphs on the eavesdropper's readout: two lines of NOISE_COLS, which fill it; GLYPHS of them pour down
  // the beam
  const NOISE_COLS = 30;
  const GLYPHS = 8;
  // the identity badge: it leaves the Worker's top right, at the shot's left edge, and slides in over the tube's
  // label to land above the tube's end, by TEMPORAL's edge, inside the tube shot, in line with the outsiders' tiles
  const BADGE = { x: OUTSIDER.x, y: 350, w: OUTSIDER.w, h: 120, route: [[540, 340], [690, 315], [860, 325]] };
  // the private connectivity beat, at camera rest, in the gap between the zones, where the wire crosses the network:
  // the PUBLIC INTERNET band fills the gap 12 px inside the zones' edges, from 3 px under the tube shot's content
  // band's top to 3 px over its bottom, its heading (headTop px under its top) centered; the corridor spans the gap
  // from edge to edge, its rails (rail px thick) gap px outside the tube's walls, its PRIVATE LINK label above it on
  // the TLS label's line; the PRIVATE-ONLY RULE tag sits halfway between the corridor and the outsiders' tiles
  const GAP = { x0: LANE.env.x + LANE.env.w, x1: LANE.temporal.x };
  const TUBE_BAND = contentBand(shot(0, TUBE_TO, []));
  const PUBLIC = { x0: GAP.x0 + 12, x1: GAP.x1 - 12, y0: Math.ceil(TUBE_BAND.top) + 3,
    y1: Math.floor(TUBE_BAND.bottom) - 3, headTop: 14 };
  const CORRIDOR = { gap: 8, rail: 3 };
  CORRIDOR.h = TUBE.h + 2 * (CORRIDOR.gap + CORRIDOR.rail);
  const RULE_Y = (TUBE.y + CORRIDOR.h / 2 + OUTSIDER.top) / 2;
  // the unknown client's request, up to TEMPORAL's edge under the tube, where a red barrier stops it
  const BARRIER = { x: LANE.temporal.x, y: 660, h: 100 };
  const REQUEST_PATH = `M 1070 ${OUTSIDER.top + 3} Q 1120 630 ${BARRIER.x - 6} ${BARRIER.y}`;
  // the beats, in seconds from their cue: c[0] the tube and the eavesdropper, c[1] the private link, c[2] the
  // identities, c[3] the split
  const T0 = { door: 0, tube: 0.1, tubeD: 0.8, label: 0.7, lift: 0.6, liftD: 0.7, ride: 1.4, rideD: 3.0,
    spy: 1.0, beam: 1.4, lock: 2.6, unlock: 3.8 };
  const T1 = { band: 0.1, bandD: 0.5, corridor: 0.9, corridorD: 0.9, label: 1.5, dim: 1.4, dimD: 0.8, blind: 1.8,
    rule: 2.8 };
  const T2 = { spyOut: 0.1, badge: 0.6, badgeD: 1.2, scan: 2.0, scanD: 0.6, verified: 2.6, client: 3.4,
    request: 3.9, requestD: 0.4 };
  const T3 = { out: 0.1, cam: 0.2, sweep: 1.1, sweepD: 0.9, lit: 2.0, locks: [2.4, 2.6], enter: 3.2, enterD: 0.6 };

  // A line of ciphertext glyphs for the readout: `salt` picks another draw of them
  const noiseLine = (row, salt) => Array.from({ length: NOISE_COLS }, (_, col) => cipherGlyph(row + 7, col, salt))
    .join('');
  // An outsider's tile, h px high: an icon and a name, in the identity badge's type, then a second row (HTML) under
  // them, and its verdict tag on the right of its heading (tile.verdict, an alarm tag, hidden)
  function makeOutsider(root, h, icon, name, color, rowHtml, look) {
    const { w, inset, headTop } = OUTSIDER;
    const tile = E(root,
      `<div style="position:absolute;left:${inset}px;top:${headTop}px;display:flex;gap:8px;align-items:center">`
      + `${ICON(icon, 22, color, 1.8)}<span class="lbl" style="font-size:14px;color:${color}">${name}</span></div>`
      + rowHtml,
      'tile', { width: w + 'px', height: h + 'px', textAlign: 'left', ...look });
    tile.verdict = statusTag(tile, { font: VERDICT.font, icon: VERDICT.font });
    Object.assign(tile.verdict.style, {
      left: 'auto', right: inset + 'px', top: VERDICT.top + 'px', height: VERDICT.h + 'px',
      transformOrigin: 'right center', opacity: 0,
    });
    balanceTagLabel(tile.verdict, 'alarm');
    return tile;
  }
  // A heading of the private connectivity beat: an icon and a label, in the outsiders' heading type, in color
  const beatHeading = (root, icon, label, color) => E(root,
    `${ICON(icon, 22, color, 1.8)}<span class="lbl" style="font-size:14px;color:${color}">${label}</span>`, '',
    { display: 'flex', gap: '8px', alignItems: 'center' });
  // Pops an outsider's verdict in, with the label of an alarm tag (setAlarmTag), at `at`
  function popVerdict(tile, t, label, at) {
    setAlarmTag(tile.verdict, label);
    const pop = popIn(t, at);
    tile.verdict.style.opacity = pop.o;
    tile.verdict.style.transform = `scale(${pop.s})`;
  }

  scene({
    chapter: 2, title: 'On the wire',
    // hard cuts: chapter 1 ends on this chapter's first frame, this chapter in the whip that chapter 3 lands
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the Namespaces, then plays the start of the whip and the cut in one go
    holdBeforeEnd: TUBE_HANDOFF.cut + 0.1,
    subs: [
      { text: "On its way out, the payload travels over <b>TLS</b>, so nobody on the network can read it." },
      {
        text: "With Temporal Cloud, AWS PrivateLink or Google Private Service Connect keep it off the "
          + "public internet.",
      },
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
      // the PUBLIC INTERNET band and the private corridor, under the tube: the corridor's opaque fill hides the band
      // round the tube, and its rails end on the zones' edges
      s.publicNet = E(root, '', '', {
        width: (PUBLIC.x1 - PUBLIC.x0) + 'px', height: (PUBLIC.y1 - PUBLIC.y0) + 'px',
        background: `rgba(${RGB.red},.06)`, border: `1.5px dashed rgba(${RGB.red},.55)`, borderRadius: 'var(--r)',
      });
      s.publicHead = beatHeading(root, 'globe', 'Public internet', C.red);
      s.corridor = E(root, '', '', {
        width: (GAP.x1 - GAP.x0) + 'px', height: CORRIDOR.h + 'px',
        borderTop: `${CORRIDOR.rail}px solid ${C.violet}`, borderBottom: `${CORRIDOR.rail}px solid ${C.violet}`,
        background: `linear-gradient(rgba(${RGB.violet},.07), rgba(${RGB.violet},.07)), ${C.bg}`,
      });
      s.tube = makeTube(root, TUBE);

      s.spy = makeOutsider(root, OUTSIDER.spyH, 'eye', 'Eavesdropper', C.red,
        `<div class="readout mono" style="position:absolute;left:${OUTSIDER.inset}px;right:${OUTSIDER.inset}px;`
        + `top:${OUTSIDER.rowTop}px;height:52px;`
        + `padding:4px 12px;font-size:15px;line-height:22px;white-space:pre;text-align:center;color:${C.slate};`
        + `background:rgba(0,0,0,.3);border:1px solid ${C.line};border-radius:var(--rs)"></div>`,
        { borderColor: `rgba(${RGB.red},.7)`, background: '#211617' });
      s.spy.readout = s.spy.querySelector('.readout');
      s.client = makeOutsider(root, OUTSIDER.clientH, 'server', 'Unknown client', C.ink,
        `<div class="mono" style="position:absolute;left:${OUTSIDER.inset}px;top:${OUTSIDER.rowTop}px;font-size:15px;`
        + `color:${C.slate}">`
        + 'no credentials</div>', {});
      // sized for the 1.4 tube shot: its tabs render at 17 px, its heading and verdict at 18 px or more. VERIFIED,
      // of the outsiders' verdicts' size, centers on the heading's line (21.5 px under the padding box's top) and ends
      // with the tabs.
      s.badge = E(root,
        '<div style="position:absolute;left:14.5px;top:10.5px;display:flex;gap:8px;align-items:center">'
        + `${ICON('badge', 22, C.ink, 1.8)}<span class="lbl" style="font-size:14px;color:var(--ink)">Identity</span>`
        + '</div>'
        + ['mTLS CERTIFICATE · YOUR CA', 'API KEY'].map((text, i) => '<div class="mono" style="position:absolute;'
          + `left:14.5px;right:14.5px;top:${44.5 + i * 36}px;height:28px;line-height:25px;padding-left:10px;`
          + `font-size:12px;letter-spacing:.06em;border:1.5px solid ${C.lineLight};border-radius:var(--rs)">`
          + `${text}</div>`).join(''),
        'tile', { width: BADGE.w + 'px', height: BADGE.h + 'px', textAlign: 'left' });
      s.badge.scan = E(s.badge, '', '', {
        left: '0', width: '100%', height: '2px', background: C.neon, boxShadow: `0 0 10px 2px rgba(${RGB.neon},.5)`,
      });
      s.verified = statusTag(s.badge, { font: VERDICT.font, icon: VERDICT.font });
      Object.assign(s.verified.style, {
        left: 'auto', right: '14.5px', top: 21.5 - VERDICT.h / 2 + 'px', height: VERDICT.h + 'px',
        transformOrigin: 'right center',
      });
      balanceTagLabel(s.verified, 'ok');

      s.card = makePayload(root, { w: PAYLOAD_IN_WORKER.w });
      // the beam's scan line on the tube, over the card it reads, and the glyphs it pulls down
      s.scanBar = E(root, '', '', {
        width: '4px', height: (TUBE.h - 12) + 'px', background: C.red, borderRadius: '2px',
        boxShadow: `0 0 14px 3px rgba(${RGB.red},.55)`,
      });
      s.glyphs = Array.from({ length: GLYPHS }, () => E(root, '', 'mono', { fontSize: '17px', color: C.red }));
      s.privateLabel = beatHeading(root, 'shield', 'Private link', C.violet);
      s.rule = statusTag(root, { font: VERDICT.font, icon: VERDICT.font });
      s.rule.style.height = VERDICT.h + 'px';
      balanceTagLabel(s.rule, 'ok');
      s.requestHead = makeSpark(root, 12, RGB.ink);
      s.barrier = E(root, '', '', {
        width: '6px', height: BARRIER.h + 'px', background: C.red, borderRadius: '3px',
        boxShadow: `0 0 18px 4px rgba(${RGB.red},.6)`,
      });
      s.redRipples = makeRipples(root, 2, RGB.red);
      s.lockRipples = [0, 1].map(() => makeRipples(root, 2, RGB.neon));
      // the flash covers the stage, outside the camera
      s.flash = makeFlash(stage);
    },
    update(t, c, s) {
      const whipAt = this.dur - TUBE_HANDOFF.cut;
      const whip = tubeWhip(t - whipAt);
      const rejectAt = c[2] + T2.request + T2.requestD;

      // the camera, forward only: along the tube with the card, held there while the private link and the identities
      // come to it, on to the Namespaces, then the whip toward the Event History; the rejection shakes it
      const cam = t < whipAt ? shot(t, WIRE_SHOT, [
        [c[0] + TUBE_AT, ...TUBE_FROM, TUBE_D], [c[0] + 1.6, ...TUBE_TO, 2.6], [c[3] + T3.cam, ...NS_SHOT, 1.0],
      ]) : whip.camera;
      const [shakeX, shakeY] = shake(t, rejectAt, 10, 0.4);
      setCamera(s.cam, t, this.dur, { ...cam, dx: cam.dx + shakeX, dy: cam.dy + shakeY, enter: 1, exit: 1 });
      placeFlash(s.flash, t, rejectAt, 0.3);

      // the lane, as chapter 1 left it; the tube replaces the wire, and the door, its work done, fades. What a held
      // shot crops at the frame's edge stays dimmed (the zones) or dims with the move into the shot (the Worker,
      // with the tube shot). The history and the headings come back with the move to the Namespaces, which frames
      // the history and the bands whole; TEMPORAL's zone, cropped there too, stays dimmed behind its bands.
      const onTube = P(t, c[0] + TUBE_AT, TUBE_D);
      const onNs = P(t, c[3] + T3.cam, 1.0);
      const end = { temporal: 1, history: 1, heads: 1, ...TUBE_HANDOFF.lane };
      placeLane(s.lane, {
        env: lerp(WIRE_LANE.env, end.env, onNs), worker: lerp(1, end.worker, onTube),
        temporal: lerp(WIRE_LANE.temporal, end.temporal, onNs), history: lerp(WIRE_LANE.history, end.history, onNs),
        heads: lerp(WIRE_LANE.heads, end.heads, onNs),
        wire: 1 - P(t, c[0] + T0.tube, T0.tubeD), door: 1 - P(t, c[0] + T0.door, 0.4),
      });
      // after placeLane(), whose zones it clips
      frameLaneEdges(s.lane, cam);
      placeTube(s.tube, TUBE, { drawn: P(t, c[0] + T0.tube, T0.tubeD, linear), label: popIn(t, c[0] + T0.label).o });
      s.tube.label.style.transform += ` scale(${popIn(t, c[0] + T0.label).s})`;

      // the card: out of the Worker into the tube, along it to TEMPORAL's edge, into payments, then the whip
      const lift = P(t, c[0] + T0.lift, T0.liftD);
      let cardX = lerp(PAYLOAD_IN_WORKER.x, RIDE.x0, lift);
      const cardY = lerp(PAYLOAD_IN_WORKER.y, TUBE.y, lift);
      const rideAt = c[0] + T0.ride;
      const rideX = at => lerp(RIDE.x0, RIDE.x1, P(at, rideAt, T0.rideD));
      cardX = t < rideAt ? cardX : rideX(t);
      cardX = lerp(cardX, TUBE_HANDOFF.card[0], P(t, c[3] + T3.enter, T3.enterD));
      const [x, y] = t < whipAt ? [cardX, cardY] : whip.card;
      place(s.card, x, y, lerp(1, TUBE.k, lift));

      // the eavesdropper rises under the wire; its beam searches the tube from TEMPORAL's side, locks on the card
      // and follows it, its readout flickering with ciphertext, then lets go: UNREADABLE
      rise(s.spy, OUTSIDER.x, OUTSIDER.top + OUTSIDER.spyH / 2, P(t, c[0] + T0.spy, 0.5)
        * (1 - P(t, c[2] + T2.spyOut, 0.3)));
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
      // the readout: listening, then the ciphertext the beam reads, redrawn 15 times a second, then frozen; once the
      // corridor seals the tube off, no traffic at all
      const salt = locked ? 1 + Math.floor(t * 15) : 0;
      const blind = t >= c[1] + T1.blind;
      let readout = `${noiseLine(0, salt)}\n${noiseLine(1, salt)}`;
      if (t < lockAt) readout = 'LISTENING';
      if (blind) readout = 'NO TRAFFIC';
      setText(s.spy.readout, readout);
      s.spy.readout.style.color = t < lockAt || blind ? C.slate : C.red;
      s.glyphs.forEach((e, i) => {
        const f = ((t - lockAt) * 1.6 + i / GLYPHS) % 1;
        const gx = lerp(beamX + (hash(i + 40) - 0.5) * 80, OUTSIDER.x, f);
        e.textContent = cipherGlyph(i, Math.floor(t * 15), 500);
        place(e, gx, lerp(tubeBottom - 10, BEAM_FROM + 20, f), 1, locked ? Math.sin(Math.PI * f) : 0);
      });
      popVerdict(s.spy, t, 'UNREADABLE', unlockAt + 0.1);

      // the gap between the zones lights up as the PUBLIC INTERNET, round the eavesdropper; a private corridor draws
      // across it round the tube, toward TEMPORAL, and the band dims away behind it: the eavesdropper is left on the
      // public side, with no traffic to see. The PRIVATE-ONLY RULE snaps on, the rails flaring; all of it clears for
      // the identities.
      const beatOut = 1 - P(t, c[2] + T2.spyOut, 0.3);
      const bandO = P(t, c[1] + T1.band, T1.bandD) * lerp(1, OFF_SHOT, P(t, c[1] + T1.dim, T1.dimD)) * beatOut;
      place(s.publicNet, (PUBLIC.x0 + PUBLIC.x1) / 2, (PUBLIC.y0 + PUBLIC.y1) / 2, 1, bandO);
      place(s.publicHead, OUTSIDER.x, PUBLIC.y0 + PUBLIC.headTop + 11, 1, bandO);
      const corridor = P(t, c[1] + T1.corridor, T1.corridorD);
      place(s.corridor, (GAP.x0 + GAP.x1) / 2, TUBE.y, 1, corridor > 0 ? beatOut : 0);
      // the clip cuts the glow at the zones' edges, where the rails end, and on the right while the corridor draws
      s.corridor.style.clipPath = `inset(-40px ${((1 - corridor) * 100).toFixed(3)}% -40px 0)`;
      const ruleAt = c[1] + T1.rule;
      const flare = t >= ruleAt ? 1 - P(t, ruleAt, 0.8) : 0;
      s.corridor.style.boxShadow = glowShadow(RGB.violet, 0.5 + 0.5 * flare, { blur: 24 + 16 * flare, alpha: 0.5 });
      const label = popIn(t, c[1] + T1.label);
      place(s.privateLabel, OUTSIDER.x, TUBE.label.y, label.s, label.o * beatOut);
      setStatus(s.rule, 'PRIVATE-ONLY RULE', 'ok');
      const rule = popIn(t, ruleAt);
      place(s.rule, OUTSIDER.x, RULE_Y, rule.s, rule.o * beatOut);

      // the identity badge slides out of the Worker, along an arc over the tube, to TEMPORAL's edge; a scan line
      // checks it, and it turns VERIFIED
      const badgeP = P(t, c[2] + T2.badge, T2.badgeD);
      const [bx, by] = bezier([...BADGE.route, [BADGE.x, BADGE.y]], badgeP);
      const out2 = 1 - P(t, c[3] + T3.out, 0.4);
      // it stays small as it passes over the TLS label, and grows to its size on the way to its place, so it
      // clears both the label and the frame's top edge
      place(s.badge, bx, by, lerp(0.3, 1, badgeP * badgeP), P(t, c[2] + T2.badge, 0.2) * out2);
      const scan = P(t, c[2] + T2.scan, T2.scanD, linear);
      s.badge.scan.style.top = Math.round(scan * (BADGE.h - 5)) + 'px';
      s.badge.scan.style.opacity = scan > 0 && scan < 1 ? 1 : 0;
      const verifiedAt = c[2] + T2.verified;
      placeStatusTag(s.verified, t, 'VERIFIED', 'ok', P(t, verifiedAt, 0.2), verifiedAt);
      s.badge.style.borderColor = t >= verifiedAt ? C.neon : C.line;

      // an unknown client tries to connect: its request hits a red barrier at TEMPORAL's edge (flash, shake) and
      // bounces off; REJECTED
      rise(s.client, OUTSIDER.x, OUTSIDER.top + OUTSIDER.clientH / 2, P(t, c[2] + T2.client, 0.5) * out2);
      s.client.style.borderColor = t >= rejectAt ? C.red : C.line;
      const request = P(t, c[2] + T2.request, T2.requestD, easeIn);
      draw(s.request, request, 0.8 * (1 - P(t, rejectAt, 0.3)));
      sparkOnPath(s.requestHead, s.request, request);
      const barrier = t >= rejectAt ? 1 - P(t, rejectAt + 0.2, 0.6) : 0;
      place(s.barrier, BARRIER.x, BARRIER.y, 1, barrier);
      placeRipples(s.redRipples, t, rejectAt, BARRIER.x, BARRIER.y, 40, 200, { d: 0.8, step: 0.15 });
      popVerdict(s.client, t, 'REJECTED', rejectAt + 0.1);

      // TEMPORAL splits into Namespaces under a sweep of light: payments lights up, the other two dim and lock
      const lockSeal = T3.locks.map(at => P(t, c[3] + at, 0.5, linear));
      placeNamespaces(s.ns, P(t, c[3] + T3.sweep, T3.sweepD, linear), P(t, c[3] + T3.lit, 0.5), lockSeal);
      const others = NAMESPACES.map((ns, i) => i).filter(i => !NAMESPACES[i].mine);
      s.lockRipples.forEach((rings, k) => {
        const [lx, ly] = nsLockAt(others[k]);
        placeRipples(rings, t, c[3] + T3.locks[k] + 0.5 * LOCK_SHUT, lx, ly, 30, 100, { d: 0.8, step: 0.2 });
      });
    }
  });
}
