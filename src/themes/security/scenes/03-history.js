// ===================== 3. IN THE EVENT HISTORY
// Opens in the whip that ended chapter 2 (TUBE_HANDOFF): the camera lands on the Event History with the payload card,
// which docks as the payload chip of row 2 while the history grows into its three rows and the camera pulls back to
// the whole lane. The TLS tube gives way to the plain wire, and the Web UI shows the same IBAN in clear to two viewers.
// READABLE slams onto the chip, a lens scans the IBAN and the viewers' eyes turn to it. Then the picture stutters and
// rewinds: a copy of the card streaks back to the Worker as the camera whips left (REWIND_HANDOFF).
// The block keeps every name declared in this file local to this scene.
{
  const REST = [960, 515, 1];
  // the docking, in seconds from c[0]: the history grows from the lane's to HIST while the card grows from its tube
  // scale into the chip's place (at, d); the camera pulls back to the whole lane (cam, camD); the rows slide in, then
  // their SAVED tags, one after the other (rows, saved, step)
  const T0 = { at: -0.1, d: 0.9, cam: 0.1, camD: 1.3, ns: -0.1, rows: 0.6, saved: 1.3, step: 0.15 };
  // from c[1]: the tube gives way to the wire; the Web UI and the viewers come in; READABLE slams onto the chip; the
  // lens scans the IBAN; the viewers' eyes turn to it
  const T1 = {
    tube: 0, tubeD: 0.6, webui: 0.5, lines: 0.9, viewers: 1.5, slam: 2.3, slamD: 0.16,
    lens: 2.9, sweep: 3.0, sweepD: 1.4, lensOut: 4.6, eyes: 3.0,
  };
  // the rewind, in seconds before the end: the stutter (stutterD long), then the streak back to the Worker and the
  // whip left (d long), which land 0.15 s before the cut
  const REWIND = { stutter: 1.35, stutterD: 0.35, d: 0.85 };
  // the two viewers by the Web UI, under the wire: their centers and size
  const VIEWER = { xs: [868, 1052], y: 660, w: 168, h: 110 };
  // the lens over the chip's IBAN: its diameter, its zoom and its margin from the ends of the IBAN as it sweeps
  const LENS = { d: 200, zoom: 2.2, margin: 46 };
  // how far each ghost outline of the streaking card lags behind it, in progress
  const GHOSTS = [0.06, 0.12, 0.18];

  // The IBAN line of the chip, in stage coordinates at camera rest: its top left corner, its line height and font
  // size, and its width (Mono advances 0.6 em per character)
  const CHIP_LAYOUT = payloadLayout(HIST_CHIP.w);
  const IBAN = {
    x: HIST_CHIP.x - HIST_CHIP.w / 2 + 1.5 + CHIP_LAYOUT.pad.x,
    y: HIST_CHIP.y - HIST_CHIP.h / 2 + 1.5 + CHIP_LAYOUT.valueTop(0),
    line: CHIP_LAYOUT.value.line, font: CHIP_LAYOUT.value.font,
  };
  IBAN.w = TRANSFER[0][1].length * 0.6 * IBAN.font;

  // A viewer's tile: a person and a name, and the eye that marks it once it reads the IBAN (tile.eye)
  function makeViewer(root, name) {
    const tile = E(root,
      '<div style="display:flex;flex-direction:column;align-items:center;gap:12px">'
      + `${ICON('user', 34, C.ink, 1.8)}<span class="lbl" style="font-size:14px;color:var(--ink)">${name}</span></div>`
      + `<div class="eye" style="position:absolute;right:10px;top:10px;opacity:0">${ICON('eye', 24, C.red, 2)}</div>`,
      'tile', {
        width: VIEWER.w + 'px', height: VIEWER.h + 'px', display: 'flex', alignItems: 'center',
        justifyContent: 'center',
      });
    tile.eye = tile.querySelector('.eye');
    return tile;
  }
  // The lens: a red ring holding a copy of the IBAN, LENS.zoom times larger, and a scan line through its center
  function makeLens(root) {
    const lens = E(root,
      `<div class="mono" style="position:absolute;white-space:pre;color:${C.ink};font-size:${IBAN.font * LENS.zoom}px;`
      + `line-height:${IBAN.line * LENS.zoom}px">${TRANSFER[0][1]}</div>`
      + `<div style="position:absolute;left:50%;top:0;bottom:0;width:3px;margin-left:-1.5px;background:${C.red};`
      + `box-shadow:0 0 12px 2px rgba(${RGB.red},.6)"></div>`,
      '', {
        width: LENS.d + 'px', height: LENS.d + 'px', borderRadius: '50%', overflow: 'hidden', background: '#1B1B1F',
        border: `3px solid ${C.red}`, boxShadow: `0 0 34px rgba(${RGB.red},.45)`,
      });
    lens.text = lens.firstElementChild;
    return lens;
  }
  // The stutter before the rewind, from `at` for d seconds: every 0.05 s the picture jumps sideways (dx, whole px) and
  // splits into red and UV copies `split` px apart; { dx: 0, split: 0 } outside it
  function stutter(t, at, d) {
    if (t < at || t >= at + d) return { dx: 0, split: 0 };
    const step = Math.floor((t - at) / 0.05);
    return { dx: Math.round((hash(step + 70) * 2 - 1) * 16), split: 4 + Math.round(hash(step + 90) * 8) };
  }

  scene({
    chapter: 3, title: 'In the Event History',
    // hard cuts: chapter 2 ends in the whip that this chapter lands, this chapter on the next one's first frame
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the readable history, then plays the stutter, the rewind and the cut in one go
    holdBeforeEnd: REWIND.stutter + 0.1,
    subs: [
      { text: "Temporal saves the payload in the <b>Event History</b>: that's how a Workflow resumes after a crash." },
      // the lens and the eyes, then a hold on the readable IBAN before the rewind
      {
        text: "TLS only protects the trip: once stored, the IBAN is readable by anyone who can read the history.",
        after: 1.0,
      },
    ],
    build(stage, s) {
      // built in chapter 2's order (lane, Namespaces, tube, card last), so the cut shows the same stack
      const root = s.cam = makeCamera(stage);
      s.lane = makeLane(root);
      s.ns = makeNamespaces(s.lane);
      // the viewers' sight lines, flowing up to the Web UI's IBAN
      s.sight = VIEWER.xs.map((x, i) => path(s.lane.svg,
        `M ${x} ${VIEWER.y - VIEWER.h / 2 - 8} L ${WEBUI.x - 30 + 60 * i} ${WEBUI.y + WEBUI.h / 2 + 8}`,
        C.red, 2, false, '6 7'));
      s.tube = makeTube(root);
      s.hist = makeStoredHistory(root);
      s.webui = makeWebUI(root);
      s.viewers = ['Operator', 'Web UI user'].map(name => makeViewer(root, name));
      s.landing = makeRipples(root, 2, RGB.violet);
      s.card = makePayload(root, { w: PAYLOAD_IN_WORKER.w });
      // the rewind: a copy of the card leaves the chip, under its verdict, with fading outlines behind it
      s.ghosts = GHOSTS.map(() => E(root, '', '', {
        width: HIST_CHIP.w + 'px', height: HIST_CHIP.h + 'px', border: `1.5px solid ${C.violet}`,
        borderRadius: 'var(--r)',
      }));
      s.copy = makePayload(root, { w: PAYLOAD_IN_WORKER.w });
      s.verdict = makeChipVerdict(root);
      s.alarm = makeRipples(root, 2, RGB.red);
      s.lens = makeLens(root);
      // the flash covers the stage, outside the camera
      s.flash = makeFlash(stage);
    },
    update(t, c, s) {
      const { d: whipD, cut } = TUBE_HANDOFF;
      const whipEnd = whipD - cut;
      const whip = tubeWhip(t + cut);
      const dockAt = c[0] + T0.at;
      const dockEnd = dockAt + T0.d;
      const slamAt = c[1] + T1.slam;
      const hitAt = slamAt + T1.slamD;
      const stutterAt = this.dur - REWIND.stutter;
      const streakAt = stutterAt + REWIND.stutterD;

      // the camera: the end of the whip onto the history, the pull-back to the whole lane, then the whip left with
      // the rewind; READABLE's landing shakes it, the stutter jolts it and splits its colors
      const cam = t < whipEnd ? whip.camera : shot(t, TUBE_HANDOFF.to, [
        [c[0] + T0.cam, ...REST, T0.camD], [streakAt, ...REWIND_HANDOFF.shot, REWIND.d],
      ]);
      const [shakeX, shakeY] = shake(t, hitAt, 8, 0.35);
      const jolt = stutter(t, stutterAt, REWIND.stutterD);
      setCamera(s.cam, t, this.dur, { ...cam, dx: cam.dx + shakeX + jolt.dx, dy: cam.dy + shakeY, enter: 1, exit: 1 });
      s.cam.style.filter = jolt.split
        ? `drop-shadow(${jolt.split}px 0 0 rgba(${RGB.red},.7)) drop-shadow(${-jolt.split}px 0 0 rgba(${RGB.uv},.7))`
        : 'none';
      placeFlash(s.flash, t, hitAt, 0.18);

      // the lane, as chapter 2 left it: the zone headings, which the close-up pushes under the chapter header, fade
      // with the end of the whip; they, the environment and the Worker come back with the pull-back; the tube gives
      // way to the wire; the whip left dims what its framing crops (REWIND_HANDOFF)
      const back = P(t, c[0] + T0.cam, T0.camD);
      const away = P(t, streakAt, 0.45);
      const rewind = REWIND_HANDOFF.lane;
      const tubeOut = P(t, c[1] + T1.tube, T1.tubeD);
      placeLane(s.lane, {
        env: lerp(lerp(TUBE_HANDOFF.lane.env, 1, back), rewind.env, away),
        worker: lerp(TUBE_HANDOFF.lane.worker, 1, back),
        temporal: lerp(1, rewind.temporal, away),
        history: t < dockAt ? 1 : rewind.history,
        wire: tubeOut, door: rewind.door, heads: lerp(lerp(1 - P(t, 0, whipEnd), 1, back), rewind.heads, away),
      });
      placeTube(s.tube, 1, 1 - tubeOut);
      // the Namespaces have made their point: they fade as the history grows over them
      placeNamespaces(s.ns, 1, 1, [1, 1], 1 - P(t, c[0] + T0.ns, 0.4));

      // the history takes over from the lane's (identical at that instant) and grows into its rows; the card grows
      // from its tube scale into the chip's place, where the chip takes over
      const dock = P(t, dockAt, T0.d);
      const storedO = t >= dockAt ? lerp(1, REWIND_HANDOFF.stored, away) : 0;
      placeStoredHistory(s.hist, {
        grow: dock, o: storedO, chip: t >= dockEnd ? 1 : 0,
        rows: HIST_ROWS.map((_, i) => P(t, c[0] + T0.rows + i * T0.step, 0.4)),
        saved: HIST_ROWS.map((_, i) => P(t, c[0] + T0.saved + i * T0.step, 0.2)),
      });
      const red = P(t, hitAt, 0.2);
      setPayload(s.hist.chip, { red });
      const [landX, landY] = TUBE_HANDOFF.cardTo;
      const [cardX, cardY] = t < whipEnd ? whip.card : [lerp(landX, HIST_CHIP.x, dock), lerp(landY, HIST_CHIP.y, dock)];
      setPayload(s.card);
      place(s.card, cardX, cardY, lerp(TUBE.k, 1, dock), t < dockEnd ? 1 : 0);
      placeRipples(s.landing, t, whipEnd, landX, landY, 120, 420, { d: 0.8, step: 0.15 });

      // the Web UI shows the same row, IBAN and name in clear; the viewers come in under it. The rewind takes them
      // away: before the payload was stored, nobody had seen it.
      const unseen = 1 - P(t, stutterAt, 0.3);
      const webui = backPop(t, c[1] + T1.webui);
      place(s.webui, WEBUI.x, WEBUI.y, webui.s, webui.o * unseen);
      s.webui.lines.forEach((line, i) => showRow(line, P(t, c[1] + T1.lines + i * 0.15, 0.4), 20, true));
      setWebUI(s.webui, { red });
      s.viewers.forEach((tile, i) => {
        const eyesAt = c[1] + T1.eyes + i * 0.12;
        rise(tile, VIEWER.xs[i], VIEWER.y, P(t, c[1] + T1.viewers + i * 0.15, 0.5) * unseen);
        tile.style.borderColor = t >= eyesAt ? C.red : C.line;
        const eye = popIn(t, eyesAt, 0.3);
        tile.eye.style.opacity = eye.o;
        tile.eye.style.transform = `scale(${eye.s})`;
        draw(s.sight[i], P(t, eyesAt, 0.5), 0.8 * unseen);
      });

      // the dramatic beat: READABLE slams onto the chip from above its size, red rings, a red flash and a shake;
      // then a lens sweeps along the clear IBAN, a red scan line through it
      const slam = P(t, slamAt, T1.slamD, easeIn);
      setChipVerdict(s.verdict, 'READABLE', 'denied', {
        s: lerp(1.7, 1, slam), o: P(t, slamAt, 0.08, linear) * storedO,
      });
      placeRipples(s.alarm, t, hitAt, HIST_CHIP.x, HIST_CHIP.tagY, 60, 320, { d: 0.8, step: 0.16 });
      const lensPop = backPop(t, c[1] + T1.lens, 0.35);
      const sweep = P(t, c[1] + T1.sweep, T1.sweepD);
      const lensX = lerp(IBAN.x + LENS.margin, IBAN.x + IBAN.w - LENS.margin, sweep);
      const lensY = IBAN.y + IBAN.line / 2;
      place(s.lens, lensX, lensY, lensPop.s, lensPop.o * (1 - P(t, c[1] + T1.lensOut, 0.3)));
      // the zoomed IBAN lines up with the chip's under the lens center (inside the lens's 3 px ring)
      const inner = LENS.d / 2 - 3;
      s.lens.text.style.left = (inner - LENS.zoom * (lensX - IBAN.x)).toFixed(2) + 'px';
      s.lens.text.style.top = (inner - LENS.zoom * (lensY - IBAN.y)).toFixed(2) + 'px';

      // the rewind: a copy of the card leaves the chip (the chip keeps what was stored) and streaks back along the
      // wire into the Worker, its red fading, fading outlines behind it
      const streak = P(t, streakAt, REWIND.d);
      const route = [
        [HIST_CHIP.x, HIST_CHIP.y], [HIST_CHIP.x - 360, LANE.wire.y],
        [PAYLOAD_IN_WORKER.x + 360, LANE.wire.y], [PAYLOAD_IN_WORKER.x, PAYLOAD_IN_WORKER.y],
      ];
      const [copyX, copyY] = bezier(route, streak);
      setPayload(s.copy, { red: 1 - P(t, streakAt, 0.3) });
      place(s.copy, copyX, copyY, 1, t >= streakAt ? 1 : 0);
      s.ghosts.forEach((ghost, i) => {
        const [gx, gy] = bezier(route, Math.max(0, streak - GHOSTS[i]));
        const o = streak > 0 && streak < 1 ? (0.35 - 0.1 * i) * Math.min(1, streak * 5, (1 - streak) * 5) : 0;
        place(ghost, gx, gy, 1, o);
      });
    }
  });
}
