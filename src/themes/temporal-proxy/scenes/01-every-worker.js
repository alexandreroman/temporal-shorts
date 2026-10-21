// ===================== 1. SECURITY IN EVERY WORKER
// Opens on the bare fleet that the intro ends on (placeBareFleet), in WIDE_SHOT, and holds that framing (the alarm
// shakes it). A light sweeps over the Workers as the subtitle reads "every Worker"; then each Worker stacks the same
// four chips (ADDRESS, CERTIFICATE, API KEY, CODEC) in step with the words and opens a connection of its own to
// Temporal, which lists the six connections. One Worker has no CODEC chip: its empty slot blinks red (NO CODEC) and
// its payload card goes out in clear into TEMPORAL, where a red IN CLEAR alarm slams onto it with a flash, a shake and
// rings. Then every chip drops off every Worker and the connections, the list and the card go, leaving the bare fleet
// that chapter 2 opens on.
// The block keeps every name declared in this file local to this scene.
{
  // from c[0]: the light sweeps over the Workers (every, everyStep from one column to the next, everyD); each chip
  // drops into its slot as the subtitle names it (chips, chipStep from one Worker to the next, chipD); each Worker's
  // connection draws once its address is in (link, linkD); then light flows along the connections (flow)
  const T0 = {
    every: 0.9, everyStep: 0.12, everyD: 0.4, chips: [2.5, 3.1, 3.45, 4.1], chipStep: 0.07, chipD: 0.35, link: 0.2,
    linkD: 0.6, flow: 4.6,
  };
  // from c[1]: the empty CODEC slot blinks red (missing, blinks of blink seconds); the card leaves that Worker in clear
  // (card, cardD); IN CLEAR slams onto it (slam, slamD)
  const T1 = { missing: 0.3, blink: 0.12, card: 1.8, cardD: 1.2, slam: 3.4, slamD: 0.16 };
  // the ending, in seconds before the end: the chips fall off (fall), each after a hashed delay (up to spread), over
  // fallD; the card, its alarm and the connections clear (clear). Everything has gone 0.4 s before the cut.
  const END = { fall: 1.6, spread: 0.5, fallD: 0.7, clear: 0.45 };
  // the Worker that forgets its codec (in WORKERS) and the CODEC chip (in WORKER_CHIPS)
  const FORGETFUL = 5;
  const CODEC = 3;
  // TEMPORAL's list of the six connections, under its logo: its center x, its label's top, the rows' top, pitch,
  // height and width
  const LIST = { x: FLEET.temporal.x + FLEET.temporal.w / 2, label: 226, top: 256, pitch: 36, h: 32, w: 560 };
  // the payload card that goes out in clear: a larger card (its values render at 19 px at 0.88), where it lands, in
  // TEMPORAL under the list, its padlock about 20 px clear of the last row, and the scale it leaves the Worker at
  const CARD = { w: 480, x: LIST.x, k0: 0.25 };
  CARD.h = payloadLayout(CARD.w).h;
  CARD.y = LIST.top + WORKERS.length * LIST.pitch + 38 + CARD.h / 2;
  // how far a chip falls when it drops off, px, and how far it may tilt, degrees
  const FALL = { drop: 140, tilt: 40 };
  // how long the light takes to run along a connection, seconds
  const FLOW_PERIOD = 2.4;

  // The center of slot i (WORKER_CHIPS) of the Worker w, on the stage
  const slotCenter = (w, i) => [w.x, w.y - WORKER_TILE.h / 2 + workerSlotTop(i) + WORKER_TILE.chipH / 2];

  scene({
    chapter: 1, title: 'Security in every Worker',
    // hard cuts: the intro ends on this chapter's first frame, this chapter on the next one's (placeBareFleet)
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the alarm, then plays the fall and the cut in one go
    holdBeforeEnd: END.fall + 0.1,
    subs: [
      { text: "Without it, every Worker carries an address, credentials and encryption code.", after: 0.3 },
      // the alarm, then a hold on it before the fall
      { text: "Forget the codec in one Worker, and its payloads go out in clear.", after: 1.2 },
    ],
    build(stage, s) {
      // the bare fleet first, in the intro's order, so the cut shows the same stack
      const root = s.cam = makeCamera(stage);
      s.fleet = makeFleet(root, TEMPORAL_LINK_END);
      s.listLabel = E(root, 'Connections', 'lbl', { fontSize: '17px', width: LIST.w + 'px', paddingLeft: '0' });
      s.rows = WORKERS.map((w, i) => makeConnectionRow(root, `worker-${i + 1}`, w.lang, LIST));
      // the forgetful Worker's empty CODEC slot, outlined in red
      s.missing = makeMissingChip(root, 'NO CODEC');
      s.sparks = WORKERS.map(() => makeSpark(root, 12, RGB.violet));
      s.card = makePayload(root, { w: CARD.w });
      s.alarm = makeRipples(root, 2, RGB.red);
      // in the alarm look of the red verdicts, with its own icon
      s.inClear = makeAlarmTag(root, `${ICON('eye', 20, C.bg, 2.4)}In clear`, 200);
      // the flash covers the stage, outside the camera
      s.flash = makeFlash(stage);
    },
    update(t, c, s) {
      const cardAt = c[1] + T1.card;
      const hitAt = c[1] + T1.slam + T1.slamD;
      const fallAt = this.dur - END.fall;
      const cleared = 1 - P(t, fallAt, END.clear);

      // the camera holds the wide shot; the alarm shakes it
      const cam = shot(t, WIDE_SHOT, []);
      const [shakeX, shakeY] = shake(t, hitAt, 10, 0.4);
      setCamera(s.cam, t, this.dur, { ...cam, dx: cam.dx + shakeX, dy: cam.dy + shakeY, enter: 1, exit: 1 });
      placeFlash(s.flash, t, hitAt, 0.3);

      // the bare fleet, as the intro left it; this chapter's chips, connections and borders go over it
      placeBareFleet(s.fleet, cam);

      // the Workers: the light sweeps over them, then each gets its chips, one at a time, as the subtitle names them
      // (the forgetful Worker never gets its codec); at the end they fall off, each after a hashed delay
      s.fleet.tiles.forEach((tile, w) => {
        const slot = WORKERS[w];
        tile.chips.forEach((chip, k) => {
          const at = c[0] + T0.chips[k] + w * T0.chipStep;
          const fall = P(t, fallAt + END.spread * hash(w * 4 + k + 60), END.fallD, linear);
          if (t < at || fall >= 1) return;
          const shown = w === FORGETFUL && k === CODEC ? 0 : 1;
          // it drops into its slot with a little bounce
          const drop = P(t, at, T0.chipD, backOut);
          const tilt = (hash(w * 4 + k + 90) * 2 - 1) * FALL.tilt * fall;
          chip.style.opacity = shown * P(t, at, 0.15) * (1 - fall);
          chip.style.transform = `translateY(${((drop - 1) * 22 + FALL.drop * fall * fall).toFixed(2)}px) `
            + `rotate(${tilt.toFixed(2)}deg)`;
        });
        const everyAt = c[0] + T0.every + slot.col * T0.everyStep;
        const sweeping = t >= everyAt && t < everyAt + T0.everyD;
        // the forgetful Worker turns red while its card is out, until the chapter clears
        const alarmed = w === FORGETFUL && t >= cardAt && t < fallAt + END.clear;
        tile.style.borderColor = alarmed ? C.red : sweeping ? C.neon : C.violet;
      });

      // each Worker's own connection to Temporal draws once its address is in; light runs along it on the ambient
      // clock. The forgetful Worker's turns red as its card goes out. They go with the chips.
      const linksO = 1 - P(t, fallAt + 0.2, 0.5);
      const flow = P(t, c[0] + T0.flow, 0.5) * linksO;
      s.fleet.links.forEach((link, w) => {
        const drawAt = c[0] + T0.chips[0] + w * T0.chipStep + T0.link;
        draw(link, P(t, drawAt, T0.linkD), linksO);
        link.setAttribute('stroke', w === FORGETFUL && t >= cardAt ? C.red : C.slate);
        sparkOnPath(s.sparks[w], link, (G / FLOW_PERIOD + w / WORKERS.length) % 1, flow);
        // its row in TEMPORAL's list rises in as the connection arrives
        const arrived = P(t, drawAt + T0.linkD - 0.1, 0.4);
        rise(s.rows[w], LIST.x, LIST.top + w * LIST.pitch + LIST.h / 2, arrived * linksO, 16);
        s.rows[w].style.borderColor = w === FORGETFUL && t >= cardAt ? C.red : C.lineLight;
      });
      const listLabel = P(t, c[0] + T0.chips[0] + T0.link + T0.linkD - 0.3, 0.4) * linksO;
      place(s.listLabel, LIST.x, LIST.label + 10, 1, listLabel);

      // the forgotten codec: its empty slot blinks red, then stays outlined
      const forgetful = WORKERS[FORGETFUL];
      const missingAt = c[1] + T1.missing;
      const blinking = t - missingAt < 4 * T1.blink;
      const blinkOn = Math.floor((t - missingAt) / T1.blink) % 2 === 0;
      const missingO = t < missingAt ? 0 : blinking && !blinkOn ? 0.25 : 1;
      place(s.missing, ...slotCenter(forgetful, CODEC), 1, missingO * cleared);

      // the dramatic beat: the card leaves that Worker in clear and goes out into Temporal, growing as it goes; IN
      // CLEAR slams onto it from above its size, red rings, a red flash and a shake, and the card turns red
      const cardP = P(t, cardAt, T1.cardD);
      const [cardX, cardY] = bezier([[forgetful.x, forgetful.y], [forgetful.x + 200, forgetful.y],
        [CARD.x - 300, CARD.y], [CARD.x, CARD.y]], cardP);
      setPayload(s.card, { red: P(t, hitAt, 0.2) });
      place(s.card, cardX, cardY, lerp(CARD.k0, 1, cardP), P(t, cardAt, 0.15) * cleared);
      const tagY = CARD.y + CARD.h / 2;
      const slam = P(t, c[1] + T1.slam, T1.slamD, easeIn);
      place(s.inClear, CARD.x, tagY, lerp(1.7, 1, slam), P(t, c[1] + T1.slam, 0.08, linear) * cleared);
      placeRipples(s.alarm, t, hitAt, CARD.x, tagY, 60, 200, { d: 0.8, step: 0.16 });
    }
  });
}
