// ===================== 4. ENCRYPTED WITH YOUR KEYS
// Opens on the rewind that ended chapter 3 (REWIND_HANDOFF): the payload card back in the Worker. A Data Converter
// comes in beside it; its key turns and the card passes through its gate, which scrambles the fields as they cross,
// glyphs raining off them, before its lock snaps shut. The camera tracks the sealed card along the lane to the Event
// History (HIST_SHOT), as TEMPORAL widens into its close layout (CLOSE), and the card turns the chip into ciphertext:
// READABLE flips into NEVER SEES YOUR PAYLOADS, and the Web UI, on the history's right, shows the same ciphertext.
// Search Attributes stay in clear under it. Last, TEMPORAL narrows back and the camera pulls back to the
// whole lane as the Web UI moves into your environment, growing into a browser, which asks your Codec Server to
// decrypt the payload; then the chapter clears and pulls back further (WIDE_SHOT). The camera travels one way: right
// with the card, then out.
// The block keeps every name declared in this file local to this scene.
{
  const REST = [960, 515, 1];
  // where the card rests once sealed: its left edge just past the gate
  const SEALED_X = CONVERTER.x + 12 + PAYLOAD_IN_WORKER.w / 2;
  // from c[0]: the converter's tile pops in and its gate draws down (tile, gate); the key turns (key); the card
  // passes through the gate (cross, crossD), then its lock snaps shut (seal)
  const T0 = { tile: 0.2, gate: 0.5, gateD: 0.5, key: 1.1, keyD: 0.35, cross: 1.6, crossD: 1.4, seal: 3.05 };
  // from c[1]: the card flies to the chip (fly, flyD) and the camera tracks it there (HIST_SHOT); the verdict flips
  // over; the Web UI comes back, in ciphertext, in the middle of the history's right
  const T1 = { fly: 0.2, flyD: 1.2, flip: 0.15, webui: 2.0 };
  // from c[2]: the Search Attributes strip rises in under the Web UI, which moves up to make room (strip, stripD),
  // its two attributes pop in, a light sweeps across them, their tag pops in; then an IBAN tries to join them and is
  // struck out (secret, strike, secretOut)
  const T2 = {
    strip: 0.2, stripD: 0.5, attrs: 0.6, sweep: 1.3, sweepD: 0.8, tag: 1.9, secret: 2.8, strike: 3.4, secretOut: 4.6,
  };
  // from c[3]: the camera pulls back to the whole lane as the Worker steps aside and the Web UI moves into your
  // environment as a browser (move, moveD); the Codec Server pops in; the payload goes down to it in ciphertext and
  // comes back in clear (down, up, each tripD long); the browser shows it in clear (clear); KEYS NEVER SHARED
  const T3 = { worker: 0.2, move: 0.2, moveD: 1.2, codec: 1.4, down: 2.0, up: 2.7, tripD: 0.6, clear: 3.3, keys: 4.1 };
  // the ending, in seconds before the end: the chapter clears and the camera pulls back to WIDE_SHOT, landing 0.15 s
  // before the cut
  const END = { before: 1.4, clearD: 0.5, d: 1.25 };

  // the browser, the Web UI grown k times as it moves into your environment (its values render at 18 px in the
  // whole lane's shot), in the Worker's place, centered in the environment, and the Codec Server under it; the
  // payload's way down to the Codec Server and back up, beside each other
  const BROWSER = { x: LANE.env.x + LANE.env.w / 2, y: 360, k: 1.4 };
  const CODEC = { x: BROWSER.x, y: 700, w: 360, h: 120 };
  const TRIP = {
    down: BROWSER.x - 60, up: BROWSER.x + 60, y0: BROWSER.y + BROWSER.k * WEBUI.h / 2 + 10,
    y1: CODEC.y - CODEC.h / 2 - 10,
  };
  // KEYS NEVER SHARED, on the border between the zones, where the wire runs while the Worker is there
  const KEYS_TAG = { x: (LANE.wire.x0 + LANE.wire.x1) / 2, y: LANE.wire.y, w: 340 };
  // the Search Attributes panel, in the close layout's slot under the Web UI, as large as it
  const STRIP = { x: CLOSE.column.x, y: CLOSE.slot.y, w: WEBUI.w, h: WEBUI.h };
  // the glyphs that rain off the card as it crosses the gate: how many, and how long each one falls
  const RAIN = { n: 28, life: 0.7 };
  // the first characters of the IBAN, which the trip to the Codec Server carries
  const TRIP_TEXT = TRANSFER[0][1].slice(0, 14);

  // A tile of your keys' holder: an icon over its name, and the violet key with YOUR KEYS (tile.key, see turnKey)
  const makeKeyTile = (root, icon, name, w, h) => {
    const tile = E(root,
      `<div style="display:flex;align-items:center;justify-content:center;gap:10px">${icon}`
      + `<span class="lbl" style="font-size:15px;color:var(--ink)">${name}</span></div>`
      + '<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px">'
      + `<div class="key">${ICON('key', 28, C.violet, 1.9)}</div>`
      + `<span class="mono" style="font-size:14px;letter-spacing:.12em;color:${C.violet}">YOUR KEYS</span></div>`,
      'tile', {
        width: w + 'px', height: h + 'px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      });
    tile.key = tile.querySelector('.key');
    return tile;
  };
  // The key of a key tile turns once round its shaft as turn goes from 0 to 1 (a 3D spin, which ends where it began)
  const turnKey = (tile, turn) => {
    const spinning = turn > 0 && turn < 1;
    tile.key.style.transform = spinning ? `perspective(120px) rotateX(${(360 * turn).toFixed(2)}deg)` : 'none';
  };
  // A Search Attribute in clear: its name, an equals sign and its value, in a rounded box
  const attribute = (name, value, css = '') => `<span class="mono" style="display:inline-block;font-size:12px;`
    + `line-height:26px;padding:0 10px;border:1.5px solid ${C.lineLight};border-radius:var(--rs);${css}">`
    + `${name} <span style="color:${C.slate}">=</span> ${value}</span>`;

  scene({
    chapter: 4, title: 'Encrypted with your keys',
    // hard cuts: chapter 3 ends on this chapter's first frame, this chapter on the next one's (WIDE_SHOT)
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the Codec Server's round trip, then plays the pull-back and the cut in one go
    holdBeforeEnd: END.before + 0.1,
    subs: [
      { text: "A <b>Data Converter</b> encrypts the payload inside the Worker, with your keys, before it leaves." },
      { text: "Temporal stores and passes on only ciphertext: it never sees the IBAN." },
      { text: "<b>Search Attributes</b> stay in clear, so Temporal can index them: keep secrets out of them." },
      // the round trip, then a hold to read it before the pull-back
      {
        text: "To read payloads in the Web UI, a <b>Codec Server</b> you run decrypts them for your browser.",
        after: 0.8,
      },
    ],
    build(stage, s) {
      // the lane and the stored history in chapter 3's order, so the cut shows the same stack
      const root = s.cam = makeCamera(stage);
      s.lane = makeLane(root);
      s.trip = [
        `M ${TRIP.down} ${TRIP.y0} L ${TRIP.down} ${TRIP.y1}`, `M ${TRIP.up} ${TRIP.y1} L ${TRIP.up} ${TRIP.y0}`,
      ].map(d => path(s.lane.svg, d, C.slate, 2));
      s.hist = makeStoredHistory(root);
      // the Web UI's place under the history, a faint dashed outline once the window has moved out
      s.webuiSlot = E(root, '', '', {
        width: WEBUI.w + 'px', height: WEBUI.h + 'px', border: `1.5px dashed ${C.lineLight}`, borderRadius: 'var(--r)',
      });
      s.webui = makeWebUI(root);
      // the label, the two attributes on two lines (the IBAN that tries to join them beside the second), then the
      // INDEXED, NOT ENCRYPTED tag (s.indexed): the attributes and the tag evenly spaced, as much room above the label
      // as under the tag
      s.strip = E(root,
        '<div class="lbl" style="position:absolute;left:16.5px;top:13.5px;font-size:13px;padding-left:0">'
        + 'Search Attributes</div>'
        + `<span class="attr" style="position:absolute;left:16.5px;top:41.5px">`
        + `${attribute('TransferStatus', 'DEBITED')}</span>`
        + '<div style="position:absolute;left:16.5px;top:75.5px;display:flex;gap:6px">'
        + `<span class="attr">${attribute('Region', 'EU')}</span>`
        + `<span class="secret" style="position:relative">${attribute('iban', 'FR76',
          `border:1.5px dashed ${C.red};color:${C.red}`)}`
        + `<i class="strike" style="position:absolute;left:6px;right:6px;top:13px;height:2px;background:${C.red};`
        + 'transform-origin:left center"></i></span></div>'
        + `<div class="sweep" style="position:absolute;top:0;bottom:0;width:120px;background:linear-gradient(90deg,`
        + `rgba(${RGB.ink},0),rgba(${RGB.ink},.16),rgba(${RGB.ink},0))"></div>`,
        'tile', { width: STRIP.w + 'px', height: STRIP.h + 'px', textAlign: 'left', overflow: 'hidden' });
      s.strip.attrs = [...s.strip.querySelectorAll('.attr')];
      s.strip.secret = s.strip.querySelector('.secret');
      s.strip.strike = s.strip.querySelector('.strike');
      s.strip.sweep = s.strip.querySelector('.sweep');
      s.indexed = statusTag(s.strip, { font: 11, icon: 11 });
      Object.assign(s.indexed.style, { left: '16.5px', top: '109.5px', height: '24px' });
      s.codec = makeKeyTile(root, ICON('server', 28, C.ink, 1.8), 'Codec Server', CODEC.w, CODEC.h);
      s.packet = E(root, '', 'mono', {
        width: '190px', height: '34px', lineHeight: '31px', textAlign: 'center', fontSize: '18px', whiteSpace: 'pre',
        background: C.bg, border: `1.5px solid ${C.lineLight}`, borderRadius: 'var(--rs)',
      });
      s.converter = makeKeyTile(root, '', 'Data Converter', CONVERTER.tile.w, CONVERTER.tile.h);
      s.card = makePayload(root, { w: PAYLOAD_IN_WORKER.w });
      // the gate the card passes through, over it: one violet line, as thick as the lane's connections, from the
      // tile's bottom edge to the Worker panel's
      s.gate = E(root, '', '', {
        width: CONVERTER.gate.w + 'px', height: CONVERTER.gate.bottom - CONVERTER.gate.top + 'px',
        background: C.violet, transformOrigin: 'center top',
      });
      s.rain = Array.from({ length: RAIN.n }, () => E(root, '', 'mono', { fontSize: '18px', color: C.violet }));
      s.sealRipples = makeRipples(root, 3, RGB.violet);
      s.landRipples = makeRipples(root, 2, RGB.violet);
      s.chipRipples = makeRipples(root, 2, RGB.neon);
      s.verdict = makeChipVerdict(root);
      s.keys = fixedTag(root, 'Keys never shared', 'violet solid', KEYS_TAG.w);
    },
    update(t, c, s) {
      const crossAt = c[0] + T0.cross;
      const sealAt = c[0] + T0.seal;
      const flyAt = c[1] + T1.fly;
      const landAt = flyAt + T1.flyD;
      const endAt = this.dur - END.before;
      const done = 1 - P(t, endAt, END.clearD); // the chapter clears at the end

      // the camera, one way: on the Worker and the converter; then right along the lane with the sealed card to the
      // history (HIST_SHOT), where the content comes to it; then out, to the whole lane for the browser and the Codec
      // Server, and further out at the end (WIDE_SHOT); the seal jolts it
      const cam = shot(t, REWIND_HANDOFF.shot, [
        [flyAt, ...HIST_SHOT, T1.flyD], [c[3] + T3.move, ...REST, T3.moveD], [endAt, ...WIDE_SHOT, END.d],
      ]);
      const [shakeX, shakeY] = shake(t, sealAt + 0.35 * LOCK_SHUT, 6, 0.3);
      setCamera(s.cam, t, this.dur, { ...cam, dx: cam.dx + shakeX, dy: cam.dy + shakeY, enter: 1, exit: 1 });

      // the lane, as chapter 3 left it. The track to HIST_SHOT crops the Worker, the wire and the converter at the
      // frame's left edge, which dim with it, and widens TEMPORAL into the close layout; TEMPORAL and the environment
      // stay dim (OFF_SHOT) until the pull-back to the whole lane, which narrows TEMPORAL back and brings everything
      // back. The Worker steps aside for the browser with its wire and its Data Converter; the Worker and the wire
      // come back as the chapter clears.
      const track = P(t, flyAt, T1.flyD);
      const wide = P(t, c[3] + T3.move, T3.moveD);
      const close = track * (1 - wide);
      const from = REWIND_HANDOFF.lane;
      const leftSide = lerp(lerp(1, OFF_SHOT, track), 1, wide);
      const stepAside = P(t, c[3] + T3.worker, 0.4);
      const workerAway = stepAside * (1 - P(t, endAt, END.clearD));
      placeLane(s.lane, {
        env: lerp(from.env, 1, wide), temporal: lerp(from.temporal, 1, wide), heads: lerp(from.heads, 1, wide),
        // the wire would run into the widened TEMPORAL: it fades out of the close layout
        worker: leftSide * (1 - workerAway), wire: (1 - close) * (1 - workerAway),
        history: WIDE_LANE.history, door: WIDE_LANE.door, close,
      });
      // after placeLane(), whose zones it clips
      frameLaneEdges(s.lane, cam);
      const converterO = done * lerp(1, OFF_SHOT, track) * (1 - stepAside);

      // the stored history, its chip still in clear and red until the sealed card lands on it: dim at the frame's
      // edge, then wholly in HIST_SHOT. The pull-back for the Codec Server is about your side: Temporal's, sealed,
      // dims behind it.
      const storedO = lerp(lerp(REWIND_HANDOFF.stored, 1, track), OFF_SHOT, wide) * done;
      const dx = closeDx(close);
      placeStoredHistory(s.hist, { o: storedO, chip: storedO, close });
      const sealedChip = t >= landAt;
      setPayload(s.hist.chip, sealedChip ? { seal: 1, scramble: 1 } : { red: 1 - P(t, landAt - 0.3, 0.3) });

      // the Data Converter comes in beside the Worker; its key turns and its gate lights up
      const tilePop = backPop(t, c[0] + T0.tile);
      place(s.converter, CONVERTER.x, CONVERTER.tile.y, tilePop.s, tilePop.o * converterO);
      turnKey(s.converter, P(t, c[0] + T0.key, T0.keyD));
      s.converter.style.borderColor = t >= c[0] + T0.key ? C.violet : C.line;
      // the gate draws down from the tile; it glows softly while the key is armed
      const gate = P(t, c[0] + T0.gate, T0.gateD);
      const { top: gateTop, bottom: gateBottom } = CONVERTER.gate;
      place(s.gate, CONVERTER.x, (gateTop + gateBottom) / 2, 1, (gate > 0 ? 1 : 0) * converterO);
      s.gate.style.transform += ` scaleY(${gate.toFixed(3)})`;
      const armed = P(t, c[0] + T0.key, 0.3) * (1 - P(t, sealAt + 0.6, 0.6));
      s.gate.style.boxShadow = glowShadow(RGB.violet, armed, { blur: 12, alpha: 0.8 });

      // the card passes through the gate: each value turns into ciphertext as it crosses, glyphs raining off it,
      // then the lock snaps shut with violet rings; it then flies to the chip and lands on it, where the chip takes
      // over with the same face
      const cross = P(t, crossAt, T0.crossD);
      let cardX = lerp(PAYLOAD_IN_WORKER.x, SEALED_X, cross);
      let cardY = PAYLOAD_IN_WORKER.y;
      const layout = payloadLayout(PAYLOAD_IN_WORKER.w);
      // the share of each value already past the gate, from its right end (Mono advances 0.6 em per character)
      const textLeft = cardX - PAYLOAD_IN_WORKER.w / 2 + 1.5 + layout.pad.x;
      const scramble = TRANSFER.map(([, value]) => {
        const textW = value.length * 0.6 * layout.value.font;
        return clamp((textLeft + textW - CONVERTER.x) / textW);
      });
      const fly = P(t, flyAt, T1.flyD);
      if (fly > 0) {
        // to where the chip rests in the close layout, which it reaches as the card lands
        const chipX = HIST_CHIP.x + closeDx(1);
        [cardX, cardY] = bezier([[SEALED_X, cardY], [SEALED_X + 200, cardY - 60], [chipX - 260, HIST_CHIP.y - 60],
          [chipX, HIST_CHIP.y]], fly);
      }
      setPayload(s.card, { seal: P(t, sealAt, 0.35, linear), scramble, fromRight: true });
      place(s.card, cardX, cardY, lerp(1, HIST_CHIP.k, fly), sealedChip ? 0 : 1);
      placeRipples(s.sealRipples, t, sealAt + 0.35 * LOCK_SHUT, cardX, cardY - layout.h / 2, 40, 300,
        { d: 0.9, step: 0.15 });
      const cardTop = PAYLOAD_IN_WORKER.y - layout.h / 2;
      s.rain.forEach((glyph, i) => {
        const bornAt = crossAt + T0.crossD * (0.15 + 0.7 * i / RAIN.n);
        const age = t - bornAt;
        if (age < 0 || age > RAIN.life) {
          glyph.style.opacity = 0;
          return;
        }
        const x = CONVERTER.x + 14 + (40 + 140 * hash(i + 400)) * age;
        const y = cardTop + 40 + hash(i + 300) * (layout.h - 60) + (-90 + 60 * hash(i + 500)) * age + 280 * age * age;
        glyph.textContent = cipherGlyph(i, Math.floor(t * 12), 700);
        place(glyph, x, y, 1, Math.sin(Math.PI * age / RAIN.life));
      });

      // the landing: violet rings on the chip; the verdict flips over, READABLE to NEVER SEES YOUR PAYLOADS
      placeRipples(s.landRipples, t, landAt, HIST_CHIP.x + dx, HIST_CHIP.y, 120, 400, { d: 0.9, step: 0.16 });
      const flipAt = landAt + T1.flip;
      const flipped = t >= flipAt;
      const flip = flipped ? P(t, flipAt, 0.15, easeOut) : 1 - P(t, flipAt - 0.15, 0.15, easeIn);
      setChipVerdict(s.verdict, flipped ? 'NEVER SEES YOUR PAYLOADS' : 'READABLE', flipped ? 'wait' : 'alarm', {
        o: storedO, flip, s: flipped ? swell(t, flipAt + 0.1, 0.1) : 1, close,
      });

      // the Web UI comes back on the history's right, showing the same ciphertext, and moves up as the Search
      // Attributes rise in under it; it then leaves Temporal's side for your environment, growing into a browser,
      // which shows the payload in clear once the Codec Server has decrypted it. Once the pull-back has narrowed
      // TEMPORAL back, a faint dashed outline marks the Web UI's place under the history (LANE.ui).
      const webuiPop = backPop(t, c[1] + T1.webui);
      const move = P(t, c[3] + T3.move, T3.moveD);
      const stripIn = P(t, c[2] + T2.strip, T2.stripD);
      const column = [CLOSE.column.x, Math.round(lerp(HIST.y, CLOSE.ui.y, stripIn))];
      const [winX, winY] = bezier([column, [column[0] - 400, column[1] - 120],
        [BROWSER.x + 400, BROWSER.y - 60], [BROWSER.x, BROWSER.y]], move);
      place(s.webui, winX, winY, webuiPop.s * lerp(1, BROWSER.k, move), webuiPop.o * done);
      s.webui.caption.textContent = move >= 0.5 ? 'YOUR BROWSER · WEB UI' : 'TEMPORAL WEB UI';
      place(s.webuiSlot, WEBUI.x, WEBUI.y, 1, 0.6 * P(t, c[3] + T3.move + T3.moveD, 0.4) * done);
      const clearAt = c[3] + T3.clear;
      setWebUI(s.webui, { scramble: 1 - P(t, clearAt, 0.5, linear) });
      const decrypted = P(t, clearAt + 0.4, 0.2) * (1 - P(t, clearAt + 1.2, 0.5));
      s.webui.style.borderColor = decrypted > 0.5 ? C.neon : C.line;
      s.webui.style.boxShadow = glowShadow(RGB.neon, decrypted, { blur: 30, alpha: 0.5 });

      // the Search Attributes strip: two attributes in clear, a light sweeping across them, INDEXED, NOT ENCRYPTED;
      // an IBAN tries to join them and is struck out
      // it leaves with the close layout, as TEMPORAL narrows back
      rise(s.strip, STRIP.x, STRIP.y, stripIn * (1 - wide) * done);
      s.strip.attrs.forEach((e, i) => {
        const pop = backPop(t, c[2] + T2.attrs + i * 0.2, 0.4);
        popScale(e, pop);
      });
      const sweep = P(t, c[2] + T2.sweep, T2.sweepD, linear);
      s.strip.sweep.style.transform = `translateX(${Math.round(lerp(-120, STRIP.w, sweep))}px)`;
      s.strip.sweep.style.opacity = sweep > 0 && sweep < 1 ? 1 : 0;
      placeStatusTag(s.indexed, t, 'INDEXED, NOT ENCRYPTED', 'closed', P(t, c[2] + T2.tag, 0.2), c[2] + T2.tag);
      const secretIn = P(t, c[2] + T2.secret, 0.4);
      s.strip.secret.style.opacity = secretIn * (1 - P(t, c[2] + T2.secretOut, 0.4));
      s.strip.secret.style.transform = `translateX(${Math.round((1 - secretIn) * 30)}px)`;
      s.strip.strike.style.transform = `scaleX(${P(t, c[2] + T2.strike, 0.25).toFixed(3)})`;

      // the Codec Server, with the same key: the payload goes down to it in ciphertext, the key turns, and it comes
      // back up in clear
      const codecPop = backPop(t, c[3] + T3.codec);
      place(s.codec, CODEC.x, CODEC.y, codecPop.s, codecPop.o * done);
      const downAt = c[3] + T3.down, upAt = c[3] + T3.up;
      turnKey(s.codec, P(t, upAt - 0.15, T0.keyD));
      s.codec.style.borderColor = t >= upAt - 0.15 ? C.violet : C.line;
      s.trip.forEach((line, i) => draw(line, P(t, c[3] + T3.codec + 0.3 + i * 0.15, 0.4), 0.8 * done));
      const down = P(t, downAt, T3.tripD), up = P(t, upAt, T3.tripD);
      const goingUp = t >= upAt;
      const packetY = goingUp ? lerp(TRIP.y1, TRIP.y0, up) : lerp(TRIP.y0, TRIP.y1, down);
      const inFlight = t >= downAt && t < upAt + T3.tripD;
      const packetText = goingUp ? TRIP_TEXT : scrambledHtml(0, TRIP_TEXT, 1);
      setHtml(s.packet, packetText);
      s.packet.style.borderColor = goingUp ? C.neon : C.violet;
      place(s.packet, goingUp ? TRIP.up : TRIP.down, packetY, 1, inFlight ? 1 : 0);

      // Temporal's side stays sealed: KEYS NEVER SHARED, and neon rings from the chip's lock
      const keysAt = c[3] + T3.keys;
      const keys = backPop(t, keysAt);
      place(s.keys, KEYS_TAG.x, KEYS_TAG.y, keys.s, keys.o * done);
      placeRipples(s.chipRipples, t, keysAt + 0.1, HIST_CHIP.x, HIST_CHIP.y - HIST_CHIP.h / 2, 30, 160,
        { d: 0.8, step: 0.2 });
    }
  });
}
