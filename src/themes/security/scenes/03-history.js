// ===================== 3. IN THE EVENT HISTORY
// Opens in the whip that ended chapter 2 (TUBE_HANDOFF): the camera lands close on the Event History (HIST_SHOT) with
// the payload card, which docks as the payload chip of row 2 while the history grows into its three rows. The TLS
// tube and its private corridor fade; the camera holds while TEMPORAL widens into its close layout (CLOSE): the
// history slides left and the Web UI comes in on its right, showing the same IBAN in clear to two viewers. READABLE
// slams onto the chip, a lens scans the IBAN and the viewers' eyes turn to it. Then the picture stutters and rewinds:
// a copy of the card streaks back to the Worker as the camera whips left and TEMPORAL narrows back (REWIND_HANDOFF).
// The block keeps every name declared in this file local to this scene.
{
  // the docking, in seconds from c[0], in the close shot the whip lands on (HIST_SHOT): the history grows from the
  // lane's to HIST while the card grows from its tube scale into the chip's place (at, d), and what that shot crops
  // dims (dim, dimD); the rows slide in, then their SAVED tags, one after the other (rows, saved, step)
  const T0 = { at: -0.1, d: 0.9, dim: -0.1, dimD: 0.6, ns: -0.1, rows: 0.6, saved: 1.3, step: 0.15 };
  // from c[1]: the tube fades; TEMPORAL widens into its close layout (close, closeD); the Web UI and the viewers
  // come in; READABLE slams onto the chip; the lens scans the IBAN; the viewers' eyes turn to it
  const T1 = {
    tube: 0, tubeD: 0.6, close: 0.2, closeD: 1.0, webui: 1.2, lines: 1.6, viewers: 1.8, slam: 2.3, slamD: 0.16,
    lens: 2.9, sweep: 3.0, sweepD: 1.4, lensOut: 4.6, eyes: 3.0,
  };
  // the rewind, in seconds before the end: the stutter (stutterD long), then the streak back to the Worker and the
  // whip left (d long), which land 0.15 s before the cut
  const REWIND = { stutter: 1.35, stutterD: 0.35, d: 0.85 };
  // the two viewers under the Web UI, one above the other in the close layout's slot (CLOSE.slot), as wide as the
  // Web UI, as far from each other as from it: their size and centers
  const VIEWER = { w: WEBUI.w, h: 66 };
  const viewersTop = CLOSE.ui.y + WEBUI.h / 2, viewersBottom = CLOSE.slot.y + WEBUI.h / 2;
  const viewerGap = (viewersBottom - viewersTop - 2 * VIEWER.h) / 2;
  VIEWER.ys = [viewersTop + viewerGap + VIEWER.h / 2, viewersBottom - VIEWER.h / 2];
  // the lens over the chip's IBAN: its diameter, its zoom and its margin from the ends of the IBAN as it sweeps
  const LENS = { d: 160, zoom: 2.0, margin: 32 };
  // how far each ghost outline of the streaking card lags behind it, in progress
  const GHOSTS = [0.06, 0.12, 0.18];

  // The IBAN line of the chip (a lane-size card shown at HIST_CHIP.k), in stage coordinates at camera rest, before the
  // close layout moves it (closeDx): its top left corner, its line height and font size, and its width (Mono advances
  // 0.6 em per character)
  const CHIP_LAYOUT = payloadLayout(PAYLOAD_IN_WORKER.w);
  const IBAN = {
    x: HIST_CHIP.x - HIST_CHIP.w / 2 + (1.5 + CHIP_LAYOUT.pad.x) * HIST_CHIP.k,
    y: HIST_CHIP.y - HIST_CHIP.h / 2 + (1.5 + CHIP_LAYOUT.valueTop(0)) * HIST_CHIP.k,
    line: CHIP_LAYOUT.value.line * HIST_CHIP.k, font: CHIP_LAYOUT.value.font * HIST_CHIP.k,
  };
  IBAN.w = TRANSFER[0][1].length * 0.6 * IBAN.font;

  // A viewer's tile: a person and a name, and the eye that marks it once it reads the IBAN (tile.eye), on its right;
  // its person in line with the Web UI's text, its eye as far from its right edge
  const makeViewer = (root, name) => {
    const tile = E(root,
      '<div style="display:flex;align-items:center;gap:12px">'
      + `${ICON('user', 28, C.ink, 1.8)}<span class="lbl" style="font-size:14px;color:var(--ink)">${name}</span></div>`
      + `<div class="eye" style="position:absolute;right:16px;top:${(VIEWER.h - 24) / 2 - 1.5}px;opacity:0">`
      + `${ICON('eye', 24, C.red, 2)}</div>`,
      'tile', {
        width: VIEWER.w + 'px', height: VIEWER.h + 'px', display: 'flex', alignItems: 'center',
        paddingLeft: '16px',
      });
    tile.eye = tile.querySelector('.eye');
    return tile;
  };
  // The lens: a red ring holding a copy of the IBAN, LENS.zoom times larger, and a scan line through its center
  const makeLens = root => {
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
  };
  // The stutter before the rewind, from `at` for d seconds: every 0.05 s the picture jumps sideways (dx, whole px) and
  // splits into red and UV copies `split` px apart; { dx: 0, split: 0 } outside it
  const stutter = (t, at, d) => {
    if (t < at || t >= at + d) return { dx: 0, split: 0 };
    const step = Math.floor((t - at) / 0.05);
    return { dx: Math.round((hash(step + 70) * 2 - 1) * 16), split: 4 + Math.round(hash(step + 90) * 8) };
  };

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
      // built in chapter 2's order (lane, Namespaces, corridor, tube, card last), so the cut shows the same stack
      const root = s.cam = makeCamera(stage);
      s.lane = makeLane(root);
      s.ns = makeNamespaces(s.lane);
      s.corridor = makeCorridor(root);
      s.tube = makeTube(root, TUBE);
      s.hist = makeStoredHistory(root);
      s.webui = makeWebUI(root);
      s.viewers = ['Operator', 'Web UI user'].map(name => makeViewer(root, name));
      s.landing = makeRipples(root, 2, RGB.violet);
      s.card = makePayload(root, { w: PAYLOAD_IN_WORKER.w });
      // the rewind: a copy of the card leaves the chip, under its verdict, with fading outlines behind it
      s.ghosts = GHOSTS.map(() => E(root, '', '', {
        width: PAYLOAD_IN_WORKER.w + 'px', height: CHIP_LAYOUT.h + 'px', border: `1.5px solid ${C.violet}`,
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

      // the camera, one way along the story: the end of the whip onto the history (HIST_SHOT), held while the
      // content comes to it, then the whip left with the rewind; READABLE's landing shakes it, the stutter jolts it
      // and splits its colors
      const cam = t < whipEnd ? whip.camera : shot(t, HIST_SHOT, [[streakAt, ...REWIND_HANDOFF.shot, REWIND.d]]);
      const [shakeX, shakeY] = shake(t, hitAt, 8, 0.35);
      const jolt = stutter(t, stutterAt, REWIND.stutterD);
      setCamera(s.cam, t, this.dur, { ...cam, dx: cam.dx + shakeX + jolt.dx, dy: cam.dy + shakeY, enter: 1, exit: 1 });
      s.cam.style.filter = jolt.split
        ? `drop-shadow(${jolt.split}px 0 0 rgba(${RGB.red},.7)) drop-shadow(${-jolt.split}px 0 0 rgba(${RGB.uv},.7))`
        : 'none';
      placeFlash(s.flash, t, hitAt, 0.18);

      // the lane, as chapter 2 left it. The close shot crops TEMPORAL and the tube at the frame's edges: they dim as
      // the camera settles (TEMPORAL's logo, pushed under the chapter header, fades with the end of the whip); the
      // tube fades out, and TEMPORAL widens into the close layout, then narrows back with the rewind, whose whip
      // left brings the Worker and the wire back into the frame (REWIND_HANDOFF)
      const settled = P(t, c[0] + T0.dim, T0.dimD);
      const away = P(t, streakAt, 0.45);
      const close = P(t, c[1] + T1.close, T1.closeD) * (1 - P(t, streakAt, REWIND.d * 0.8));
      // every part starts as chapter 2 left it (TUBE_HANDOFF.lane, 1 where it says nothing) and ends as chapter 4
      // opens (REWIND_HANDOFF.lane, 1 where it says nothing)
      const open = { env: 1, worker: 1, temporal: 1, history: 1, wire: 1, door: 1, heads: 1, ...TUBE_HANDOFF.lane };
      const rewind = { env: 1, worker: 1, temporal: 1, history: 1, wire: 1, door: 1, heads: 1, ...REWIND_HANDOFF.lane };
      const tubeOut = P(t, c[1] + T1.tube, T1.tubeD);
      const headsOut = P(t, 0, whipEnd);
      placeLane(s.lane, {
        env: lerp(open.env, rewind.env, away),
        // the Worker comes into the frame with the second half of the whip, as it reaches the frame's middle
        worker: lerp(open.worker, rewind.worker, P(t, streakAt + REWIND.d / 2, REWIND.d / 2)),
        temporal: lerp(lerp(open.temporal, OFF_SHOT, settled), rewind.temporal, away),
        history: t < dockAt ? open.history : rewind.history,
        wire: lerp(open.wire, rewind.wire, away),
        door: lerp(open.door, rewind.door, away),
        heads: lerp(lerp(open.heads, 0, headsOut), rewind.heads, away),
        close,
      });
      // after placeLane(), whose zones it clips
      frameLaneEdges(s.lane, cam);
      // the corridor round the tube goes with it. The tube dims over its opaque backing (placeTube's dim), so
      // TEMPORAL's edge never shows through it
      const tubeDim = lerp(1, OFF_SHOT, settled);
      const tubeO = tubeDim * (1 - tubeOut);
      placeCorridor(s.corridor, { o: tubeO });
      placeTube(s.tube, TUBE, { o: 1 - tubeOut, dim: tubeDim, label: tubeO });
      // the Namespaces have made their point: they fade as the history grows over them
      placeNamespaces(s.ns, 1, 1, [1, 1], 1 - P(t, c[0] + T0.ns, 0.4));

      // the history takes over from the lane's (identical at that instant) and grows into its rows; the card grows
      // from its tube scale into the chip's place, where the chip takes over
      // The close layout slides them left; the rewind dims them as it pushes them off the frame.
      const dock = P(t, dockAt, T0.d);
      const storedO = (t >= dockAt ? 1 : 0) * lerp(1, REWIND_HANDOFF.stored, away);
      const dx = closeDx(close);
      placeStoredHistory(s.hist, {
        grow: dock, o: storedO, chip: t >= dockEnd ? storedO : 0, close,
        rows: HIST_ROWS.map((_, i) => P(t, c[0] + T0.rows + i * T0.step, 0.4)),
        saved: HIST_ROWS.map((_, i) => P(t, c[0] + T0.saved + i * T0.step, 0.2)),
      });
      const red = P(t, hitAt, 0.2);
      setPayload(s.hist.chip, { red });
      const [landX, landY] = TUBE_HANDOFF.cardTo;
      const [cardX, cardY] = t < whipEnd ? whip.card : [lerp(landX, HIST_CHIP.x, dock), lerp(landY, HIST_CHIP.y, dock)];
      setPayload(s.card);
      place(s.card, cardX, cardY, lerp(TUBE.k, HIST_CHIP.k, dock), t < dockEnd ? 1 : 0);
      placeRipples(s.landing, t, whipEnd, landX, landY, 120, 420, { d: 0.8, step: 0.15 });

      // the Web UI, under the history, shows the same row, IBAN and name in clear; the viewers come in beside it.
      // The rewind takes them away: before the payload was stored, nobody had seen it.
      const unseen = 1 - P(t, stutterAt, 0.3);
      const webui = backPop(t, c[1] + T1.webui);
      place(s.webui, CLOSE.column.x, CLOSE.ui.y, webui.s, webui.o * unseen);
      s.webui.lines.forEach((line, i) => showRow(line, P(t, c[1] + T1.lines + i * 0.15, 0.4), 20, true));
      setWebUI(s.webui, { red });
      s.viewers.forEach((tile, i) => {
        const eyesAt = c[1] + T1.eyes + i * 0.12;
        rise(tile, CLOSE.column.x, VIEWER.ys[i], P(t, c[1] + T1.viewers + i * 0.15, 0.5) * unseen);
        tile.style.borderColor = t >= eyesAt ? C.red : C.line;
        const eye = popIn(t, eyesAt, 0.3);
        tile.eye.style.opacity = eye.o;
        tile.eye.style.transform = `scale(${eye.s})`;
      });

      // the dramatic beat: READABLE slams onto the chip from above its size, red rings, a red flash and a shake;
      // then a lens sweeps along the clear IBAN, a red scan line through it
      const slam = P(t, slamAt, T1.slamD, easeIn);
      setChipVerdict(s.verdict, 'READABLE', 'alarm', {
        s: lerp(1.7, 1, slam), o: P(t, slamAt, 0.08, linear) * storedO, close,
      });
      placeRipples(s.alarm, t, hitAt, HIST_CHIP.x + dx, HIST_CHIP.tagY, 60, 320, { d: 0.8, step: 0.16 });
      const lensPop = backPop(t, c[1] + T1.lens, 0.35);
      const sweep = P(t, c[1] + T1.sweep, T1.sweepD);
      const ibanX = IBAN.x + dx;
      const lensX = lerp(ibanX + LENS.margin, ibanX + IBAN.w - LENS.margin, sweep);
      const lensY = IBAN.y + IBAN.line / 2;
      place(s.lens, lensX, lensY, lensPop.s, lensPop.o * (1 - P(t, c[1] + T1.lensOut, 0.3)));
      // the zoomed IBAN lines up with the chip's under the lens center (inside the lens's 3 px ring)
      const inner = LENS.d / 2 - 3;
      s.lens.text.style.left = (inner - LENS.zoom * (lensX - ibanX)).toFixed(2) + 'px';
      s.lens.text.style.top = (inner - LENS.zoom * (lensY - IBAN.y)).toFixed(2) + 'px';

      // the rewind: a copy of the card leaves the chip in the close layout (the chip keeps what was stored, and slides
      // back with the history) and streaks back along the wire into the Worker, growing back to its lane size, its red
      // fading, fading outlines behind it
      const streak = P(t, streakAt, REWIND.d);
      const route = [
        [HIST_CHIP.x + closeDx(1), HIST_CHIP.y], [HIST_CHIP.x + closeDx(1) - 360, LANE.wire.y],
        [PAYLOAD_IN_WORKER.x + 360, LANE.wire.y], [PAYLOAD_IN_WORKER.x, PAYLOAD_IN_WORKER.y],
      ];
      const [copyX, copyY] = bezier(route, streak);
      setPayload(s.copy, { red: 1 - P(t, streakAt, 0.3) });
      const copyK = p => lerp(HIST_CHIP.k, 1, p);
      place(s.copy, copyX, copyY, copyK(streak), t >= streakAt ? 1 : 0);
      s.ghosts.forEach((ghost, i) => {
        const lag = Math.max(0, streak - GHOSTS[i]);
        const [gx, gy] = bezier(route, lag);
        const o = streak > 0 && streak < 1 ? (0.35 - 0.1 * i) * Math.min(1, streak * 5, (1 - streak) * 5) : 0;
        place(ghost, gx, gy, copyK(lag), o);
      });
    }
  });
}
