// ===================== 5. THE SAME WORK IN EVERY WORKER
// Opens on the bare lane that chapter 4 pulled back to (WIDE_SHOT), and holds that framing: as the pull-back lands,
// the lane opens into the fleet layout (FLEET), sized for it. Your environment grows, TEMPORAL grows to the right, and
// the Worker shrinks into the first of six slots; five copies peel off it, one after the other, each with its
// language. Every Worker stacks the same four chips (ADDRESS, CERTIFICATE, API KEY, CODEC) and opens a connection of
// its own to Temporal, which lists the six connections. A ROTATE pill sweeps between the rows and each Worker flashes
// UPDATE as it passes. One Worker has no CODEC chip: its payload card goes out in clear into TEMPORAL, where a red IN
// CLEAR alarm slams onto it with a flash and a shake. Then every chip drops off every Worker and the connections go,
// leaving the bare Workers (BARE_WORKERS_HANDOFF). The camera holds still (the alarm shakes it).
// The block keeps every name declared in this file local to this scene.
{
  // from c[0]: the lane opens into the fleet layout from the scene's first frame, as chapter 4's pull-back lands
  // (open, openD); the copies peel off the first Worker (copies, copyStep, copyD); the language tags pop in (langs,
  // langStep); each chip drops into its slot
  // (chips, as the subtitle names it, chipStep from one Worker to the next, chipD), and each Worker's connection draws
  // once its address is in (link, linkD); then light flows along the connections (flow)
  const T0 = {
    open: -0.6, openD: 0.8, copies: -0.2, copyStep: 0.1, copyD: 0.6, langs: 2.4, langStep: 0.08,
    chips: [3.25, 3.8, 4.15, 4.6], chipStep: 0.07, chipD: 0.35, link: 0.2, linkD: 0.6, flow: 5.0,
  };
  // from c[1]: the ROTATE pill pops in, sweeps between the rows (sweep, sweepD) and pops out; each Worker flashes
  // UPDATE for flashD seconds as the pill passes it
  const T1 = { pill: 0.2, sweep: 0.5, sweepD: 2.4, pillOut: 3.0, flashD: 0.8 };
  // from c[2]: the empty CODEC slot blinks red (missing, blinks of blink seconds); the card leaves that Worker in clear
  // (card, cardD); IN CLEAR slams onto it (slam, slamD)
  const T2 = { missing: 0.3, blink: 0.12, card: 1.8, cardD: 1.2, slam: 3.4, slamD: 0.16 };
  // the ending, in seconds before the end: the chips fall off (fall), each after a hashed delay (up to spread), over
  // fallD; the card, its alarm and the connections clear (clear)
  const END = { fall: 2.0, spread: 0.5, fallD: 0.7, clear: 0.45 };
  // the Worker that forgets its codec (in WORKERS) and the CODEC chip (in WORKER_CHIPS)
  const FORGETFUL = 5;
  const CODEC = 3;
  // the lane's Worker panel shrinks into the first slot at this scale (FLEET.tile is about its size there)
  const MORPH_K = 0.75;
  // the ROTATE pill's path between the rows: from x0 to x1, on the channel's line; its size, low enough to leave
  // the channel's edges clear (h: 36 px in a 62 px channel)
  const PILL = { x0: WORKERS[0].x - 100, x1: WORKERS[2].x + 100, w: 200, h: 36 };
  // TEMPORAL's list of the six connections, under its logo: its label's top, the rows' top, pitch, height and width
  const LIST = { x: FLEET.temporal.x + FLEET.temporal.w / 2, label: 226, top: 256, pitch: 36, h: 32, w: 560 };
  // the payload card that goes out in clear: a larger card (its values render at 19 px at 0.88), where it lands, in
  // TEMPORAL under the list, its padlock about 20 px clear of the last row, and the scale it leaves the Worker at
  const CARD = { w: 480, x: LIST.x, k0: 0.25 };
  CARD.h = payloadLayout(CARD.w).h;
  CARD.y = LIST.top + WORKERS.length * LIST.pitch + 38 + CARD.h / 2;
  // the UPDATE panel, which flips over a Worker's two credential chips (CERTIFICATE and API KEY), as wide and as high
  // as both: its size and its offset from the tile's center
  const UPDATE = {
    w: FLEET.tile.w - 2 * WORKER_TILE.inset, h: workerSlotTop(2) + WORKER_TILE.chipH - workerSlotTop(1),
    dy: (workerSlotTop(1) + workerSlotTop(2) + WORKER_TILE.chipH) / 2 - FLEET.tile.h / 2,
  };
  // how far a chip falls when it drops off, px, and how far it may tilt, degrees
  const FALL = { drop: 140, tilt: 40 };
  // how long the light takes to run along a connection, seconds
  const FLOW_PERIOD = 2.4;

  // The center of slot i (WORKER_CHIPS) of the Worker w, on the stage
  const slotCenter = (w, i) => [w.x, w.y - FLEET.tile.h / 2 + workerSlotTop(i) + WORKER_TILE.chipH / 2];

  scene({
    chapter: 5, title: 'The same work in every Worker',
    // hard cuts: chapter 4 ends on this chapter's first frame, this chapter on the next one's (BARE_WORKERS_HANDOFF)
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the alarm, then plays the fall and the cut in one go
    holdBeforeEnd: END.fall + 0.1,
    subs: [
      {
        text: "Now repeat that in every Worker, in every language: address, credentials, encryption code.",
        after: 0.3,
      },
      { text: "Rotate a certificate or a key, and every Worker must pick it up." },
      // the alarm, then a hold on it before the fall
      { text: "Forget the codec in one Worker, and its payloads go out in clear.", after: 1.6 },
    ],
    build(stage, s) {
      // the lane first, in chapter 4's order, so the cut shows the same stack
      const root = s.cam = makeCamera(stage);
      s.lane = makeLane(root);
      // each Worker's connection to Temporal, under the tiles
      s.links = WORKERS.map(w => path(s.lane.svg, fleetLinkD(w, FLEET.temporal.x - 4), C.slate, 2, false));
      s.tiles = WORKERS.map(w => makeWorkerTile(root, w));
      // TEMPORAL's list: one row per connection, the Worker's name and language, and a quiet VERIFIED: Temporal
      // checked the credentials that Worker presented (as in chapter 2), it does not keep them
      s.listLabel = E(root, 'Connections', 'lbl', { fontSize: '17px', width: LIST.w + 'px', paddingLeft: '0' });
      s.rows = WORKERS.map((w, i) => E(root,
        `<span class="mono" style="font-size:18px">worker-${i + 1} <span style="color:${C.slate}">·</span> `
        + `${w.lang}</span><span class="mono" style="display:flex;align-items:center;gap:6px;font-size:16px;`
        + `letter-spacing:.1em;color:${C.neon}">${ICON('check', 16, C.neon, 2.6)}VERIFIED</span>`,
        '', {
          width: LIST.w + 'px', height: LIST.h + 'px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 14px', border: `1px solid ${C.lineLight}`,
          borderRadius: 'var(--rs)',
        }));
      s.updates = WORKERS.map(() => E(root, `${ICON('retry', 22, C.neon, 2.2)}UPDATE`, 'mono', {
        width: UPDATE.w + 'px', height: UPDATE.h + 'px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '12px', fontSize: '22px', letterSpacing: '.12em', color: C.neon,
        border: `1px solid ${C.neon}`, borderRadius: 'var(--rs)', background: 'var(--neon-solid)',
        boxShadow: `0 0 18px rgba(${RGB.neon},.4)`,
      }));
      // the forgetful Worker's empty CODEC slot, outlined in red
      s.missing = E(root, 'NO CODEC', 'mono', {
        width: UPDATE.w + 'px', height: WORKER_TILE.chipH + 'px', lineHeight: (WORKER_TILE.chipH - 3) + 'px',
        textAlign: 'center', fontSize: '19px', letterSpacing: '.1em', paddingLeft: '.1em', color: C.red,
        border: `1px dashed ${C.red}`,
        borderRadius: 'var(--rs)', background: `rgba(${RGB.red},.1)`,
      });
      s.pill = fixedTag(root, `${ICON('retry', 20, C.violet, 2)}Rotate`, 'violet solid', PILL.w, {
        h: PILL.h, gap: 10,
      });
      Object.assign(s.pill.style, { fontSize: '20px', lineHeight: '24px', paddingTop: '0', paddingBottom: '0' });
      s.sparks = WORKERS.map(() => makeSpark(root, 12, RGB.violet));
      s.card = makePayload(root, { w: CARD.w });
      s.alarm = makeRipples(root, 2, RGB.red);
      // in the theme's alarm look (STATUS_KINDS.alarm), like the other red verdicts
      s.inClear = fixedTag(root, `${ICON('eye', 20, C.bg, 2.4)}In clear`, 'red', 200, { gap: 10 });
      Object.assign(s.inClear.style, { background: C.red, color: C.bg, borderColor: C.red, fontWeight: '700' });
      // the flash covers the stage, outside the camera
      s.flash = makeFlash(stage);
    },
    update(t, c, s) {
      const openAt = c[0] + T0.open;
      const cardAt = c[2] + T2.card;
      const hitAt = c[2] + T2.slam + T2.slamD;
      const fallAt = this.dur - END.fall;
      const cleared = 1 - P(t, fallAt, END.clear);

      // the lane, as chapter 4 left it, opens into the fleet layout: the zones grow, the wire goes, and the Worker
      // panel shrinks into the first slot, where the first Worker tile takes over
      const open = P(t, openAt, T0.openD);
      const handoff = BARE_WORKERS_HANDOFF.lane;
      const takeOver = P(t, openAt + T0.openD - 0.35, 0.35);
      placeLane(s.lane, {
        ...WIDE_LANE,
        envZone: lerpZone(LANE.env, handoff.envZone, open),
        temporalZone: lerpZone(LANE.temporal, handoff.temporalZone, open),
        wire: 1 - P(t, openAt, 0.4),
      });

      // the camera holds chapter 4's wide shot, which the fleet layout fills; the alarm shakes it
      const cam = shot(t, BARE_WORKERS_HANDOFF.shot, []);
      const [shakeX, shakeY] = shake(t, hitAt, 10, 0.4);
      setCamera(s.cam, t, this.dur, { ...cam, dx: cam.dx + shakeX, dy: cam.dy + shakeY, enter: 1, exit: 1 });
      frameLaneEdges(s.lane, cam);
      placeFlash(s.flash, t, hitAt, 0.3);
      const first = WORKERS[0];
      place(s.lane.worker, lerp(LANE.worker.x, first.x, open), lerp(LANE.worker.y, first.y, open),
        lerp(1, MORPH_K, open), 1 - takeOver);

      // the Workers: the copies peel off the first one to their slots, one after the other; each gets its language,
      // then its chips, one at a time, as the subtitle names them (the forgetful Worker never gets its codec)
      s.tiles.forEach((tile, w) => {
        const slot = WORKERS[w];
        gearSpin(tile, 1);
        if (w === 0) {
          place(tile, slot.x, slot.y, 1, takeOver);
        } else {
          const copy = P(t, c[0] + T0.copies + (w - 1) * T0.copyStep, T0.copyD);
          place(tile, lerp(first.x, slot.x, copy), lerp(first.y, slot.y, copy), lerp(0.92, 1, copy),
            clamp(copy * 6));
        }
        const lang = popIn(t, c[0] + T0.langs + w * T0.langStep);
        popScale(tile.langTag, lang);
        tile.chips.forEach((chip, k) => {
          const at = c[0] + T0.chips[k] + w * T0.chipStep;
          const shown = w === FORGETFUL && k === CODEC ? 0 : 1;
          // it drops into its slot with a little bounce; at the end it falls off, after a hashed delay
          const drop = P(t, at, T0.chipD, backOut);
          const fall = P(t, fallAt + END.spread * hash(w * 4 + k + 60), END.fallD, linear);
          const tilt = (hash(w * 4 + k + 90) * 2 - 1) * FALL.tilt * fall;
          chip.style.opacity = shown * P(t, at, 0.15) * (1 - fall);
          chip.style.transform = `translateY(${((drop - 1) * 22 + FALL.drop * fall * fall).toFixed(2)}px) `
            + `rotate(${tilt.toFixed(2)}deg)`;
        });
      });

      // each Worker's own connection to Temporal draws once its address is in; light runs along it on the ambient
      // clock. The forgetful Worker's turns red as its card goes out. They go with the chips.
      const linksO = 1 - P(t, fallAt + 0.2, 0.5);
      const flow = P(t, c[0] + T0.flow, 0.5) * linksO;
      s.links.forEach((link, w) => {
        draw(link, P(t, c[0] + T0.chips[0] + w * T0.chipStep + T0.link, T0.linkD), linksO);
        link.setAttribute('stroke', w === FORGETFUL && t >= cardAt ? C.red : C.slate);
        sparkOnPath(s.sparks[w], link, (G / FLOW_PERIOD + w / WORKERS.length) % 1, flow);
        // its row in TEMPORAL's list rises in as the connection arrives
        const arrived = P(t, c[0] + T0.chips[0] + w * T0.chipStep + T0.link + T0.linkD - 0.1, 0.4);
        rise(s.rows[w], LIST.x, LIST.top + w * LIST.pitch + LIST.h / 2, arrived * linksO, 16);
        s.rows[w].style.borderColor = w === FORGETFUL && t >= cardAt ? C.red : C.lineLight;
      });
      const listLabel = P(t, c[0] + T0.chips[0] + T0.link + T0.linkD - 0.3, 0.4) * linksO;
      place(s.listLabel, LIST.x, LIST.label + 10, 1, listLabel);

      // the rotation: the ROTATE pill sweeps between the rows, and each Worker flashes UPDATE as it passes: its
      // border lights up neon and the UPDATE panel flips over its credential chips, then flips back
      const pillPop = backPop(t, c[1] + T1.pill);
      const pillX = lerp(PILL.x0, PILL.x1, P(t, c[1] + T1.sweep, T1.sweepD, linear));
      place(s.pill, pillX, LANE.wire.y, pillPop.s, pillPop.o * (1 - P(t, c[1] + T1.pillOut, 0.3)));
      s.updates.forEach((tag, w) => {
        const slot = WORKERS[w];
        const passAt = c[1] + T1.sweep + T1.sweepD * (slot.x - PILL.x0) / (PILL.x1 - PILL.x0) + 0.1 * slot.row;
        const flip = P(t, passAt, 0.15, easeOut) * (1 - P(t, passAt + T1.flashD - 0.15, 0.15, easeIn));
        place(tag, slot.x, slot.y + UPDATE.dy, 1, flip > 0 ? 1 : 0);
        tag.style.transform += ` scaleY(${flip.toFixed(3)})`;
        const flashing = t >= passAt && t < passAt + T1.flashD;
        // the forgetful Worker turns red while its card is out, until the chapter clears
        const alarmed = w === FORGETFUL && t >= cardAt && t < fallAt + END.clear;
        s.tiles[w].style.borderColor = alarmed ? C.red : flashing ? C.neon : C.violet;
      });

      // the forgotten codec: its empty slot blinks red, then stays outlined
      const forgetful = WORKERS[FORGETFUL];
      const missingAt = c[2] + T2.missing;
      const blinking = t - missingAt < 4 * T2.blink;
      const blinkOn = Math.floor((t - missingAt) / T2.blink) % 2 === 0;
      const missingO = t < missingAt ? 0 : blinking && !blinkOn ? 0.25 : 1;
      place(s.missing, ...slotCenter(forgetful, CODEC), 1, missingO * cleared);

      // the dramatic beat: the card leaves that Worker in clear and goes out into Temporal, growing as it goes; IN
      // CLEAR slams onto it from above its size, red rings, a red flash and a shake, and the card turns red
      const cardP = P(t, cardAt, T2.cardD);
      const [cardX, cardY] = bezier([[forgetful.x, forgetful.y], [forgetful.x + 200, forgetful.y],
        [CARD.x - 300, CARD.y], [CARD.x, CARD.y]], cardP);
      setPayload(s.card, { red: P(t, hitAt, 0.2) });
      place(s.card, cardX, cardY, lerp(CARD.k0, 1, cardP), P(t, cardAt, 0.15) * cleared);
      const tagY = CARD.y + CARD.h / 2;
      const slam = P(t, c[2] + T2.slam, T2.slamD, easeIn);
      place(s.inClear, CARD.x, tagY, lerp(1.7, 1, slam), P(t, c[2] + T2.slam, 0.08, linear) * cleared);
      placeRipples(s.alarm, t, hitAt, CARD.x, tagY, 60, 200, { d: 0.8, step: 0.16 });
    }
  });
}
