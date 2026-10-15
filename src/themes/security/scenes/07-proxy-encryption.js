// ===================== 7. ENCRYPTION WITHOUT CODE CHANGES
// Opens inside the TEMPORAL PROXY box, on the push that ended chapter 6 (PROXY_SHOT), and holds that shot while the
// content comes to it: TEMPORAL slides closer and narrows into a close layout, where it lists the payloads it stores.
// A payload card rides in from a Worker, in clear, and is sealed inside the proxy (lock and scramble): NO CODE CHANGE.
// YOUR KMS comes in beside the proxy and a DATA KEY appears in it: the data key seals the next card (AES-256-GCM) and
// makes a trip to the KMS, which wraps it with the KMS key; the wrapped key leaves with the payload, the KMS key stays
// put. The data key rotates twice, 1 to 2 to 3, each new payload sealed with the current one while the stored ones keep
// theirs; NEVER LEAVES on the KMS key. Then the dramatic beat: the link to the KMS snaps with red sparks, a gate drops
// at the proxy's exit, the next card slams into it in clear, CALL FAILED, and FAIL CLOSED stamps onto the empty wire.
// The link heals, and the camera pulls back once, out of the proxy to the whole fleet (FULL_LANE_SHOT): the proxy's
// built-in Codec Server decrypts row 2 for a CLI and the Web UI window, while TEMPORAL keeps only ciphertext. The
// chapter clears onto chapter 8's first frame. The camera holds, then pulls back out and left, one way.
// The block keeps every name declared in this file local to this scene.
{
  // One screen px at PROXY_SHOT, in stage px: the parts that only the close shot shows are sized in screen px (n * U)
  const U = 1 / PROXY_SHOT[2];
  const px = n => `${n * U}px`;

  // from c[0]: TEMPORAL slides into its close layout as chapter 6's Namespace fades (close, closeD); NO CODE CHANGE
  const T0 = { close: -0.3, closeD: 0.8, noCode: 2.3 };
  // from c[1]: YOUR KMS pops in and its link to the proxy draws (kms, link, linkD); the DATA KEY pops in (key)
  const T1 = { kms: 0.2, link: 0.6, linkD: 0.6, key: 1.0 };
  // from c[2]: the data key rotates twice (flips); the KMS key NEVER LEAVES (never); the stored payloads that keep
  // the first data key light up (keep)
  const T2 = { flips: [0.2, 2.6], never: 2.2, keep: 5.1 };
  // from c[3]: the link snaps (snap); the gate drops at the proxy's exit (gate); CALL FAILED and FAIL CLOSED slam in
  // (callFailed, failClosed, slamD)
  const T3 = { snap: 0.3, gate: 0.55, callFailed: 1.7, failClosed: 2.3, slamD: 0.17 };
  // from c[4]: the link heals and the failed card goes back (heal); the camera pulls back to FULL_LANE_SHOT (pull,
  // pullD); the Codec Server pops into the proxy (codec); the CLI and the Web UI open (windows, 0.15 s apart); row 2
  // goes to the proxy in ciphertext (fetch) and out to both windows (deliver), each tripD long; TEMPORAL keeps
  // ciphertext (ciphertext)
  const T4 = {
    heal: 0.2, pull: 0.9, pullD: 1.5, codec: 2.3, windows: 2.5, fetch: 3.2, deliver: 3.8, tripD: 0.6,
    ciphertext: 5.0,
  };
  // the ending, in seconds before the end: the windows close and everything 07 added clears (clear, clearD)
  const END = { clear: 1.1, clearD: 0.5 };

  // The payloads that go through the proxy, one card each: from, the Worker it leaves (WORKERS); cue and at, when it
  // leaves, seconds after c[cue]; ride, how long it takes to reach the proxy; seal, when the data key seals it, seconds
  // after it leaves; out and outD, when it leaves the proxy for Temporal and how long it takes; key, the number of the
  // data key that seals it; wrap, the one whose data key makes the trip to the KMS (the others get theirs at once);
  // fails, the card that the closed gate stops (sealed by nothing, it stays in clear). The first card is sealed before
  // the data key shows, so its key shows only in TEMPORAL's list.
  const RUNS = [
    { from: 2, cue: 0, at: 0.3, ride: 1.2, seal: 1.6, out: 3.1, outD: 0.9, key: 1, noKey: true },
    { from: 4, cue: 1, at: 0.5, ride: 1.1, seal: 1.5, out: 4.3, outD: 0.9, key: 1, wrap: true },
    { from: 0, cue: 2, at: 0.5, ride: 0.8, seal: 1.05, out: 1.8, outD: 0.7, key: 2 },
    { from: 3, cue: 2, at: 2.4, ride: 0.8, seal: 1.05, out: 1.8, outD: 0.7, key: 3 },
    { from: 1, cue: 3, at: 0.8, ride: 0.75, fails: true },
  ];
  // the data key's trip to the KMS and back, seconds after its card is sealed: it leaves (go), takes tripD each way,
  // is wrapped at the KMS (stay seconds there), then docks on its card's bottom edge (dockD)
  const WRAP = { go: 0.7, tripD: 0.6, stay: 0.3, dockD: 0.35 };

  // The cards of this chapter, drawn at the close shot's size, so the layout check measures them as the shot frames
  // them (168 px: 403 px on screen, values 18.2 px)
  const CARD = { w: 168 };
  CARD.h = payloadLayout(CARD.w).h;
  // inside the proxy: where a card is sealed, in the room under the proxy's name; where the failed card stops, its
  // right edge on the gate
  const SEAL = { x: PROXY.x, y: 567 };
  const GATE = { x: PROXY.x + PROXY.w / 2, w: 8 };
  const STOP = { x: GATE.x - GATE.w / 2 - CARD.w / 2 - 1, y: SEAL.y };
  // the DATA KEY in the proxy, between its name and the card: center and size
  const DATA_KEY = { x: PROXY.x, y: 474, w: 84, h: 26 };
  // YOUR KMS, in your environment beside the proxy, above the connections (on screen x 149-590, y 199-420): center
  // and size
  const KMS = { x: 1184, y: 430, w: 184, h: 92 };
  // the KMS link: from the KMS's right edge to the data key's left edge, a corner on the way down at x; it breaks at
  // breakY
  const LINK = {
    x0: KMS.x + KMS.w / 2, y0: KMS.y, x: 1304, x1: DATA_KEY.x - DATA_KEY.w / 2, y1: DATA_KEY.y, breakY: 452,
  };
  // NO CODE CHANGE, in your environment under the connections (on screen, about 400, 720)
  const NO_CODE = { x: 1197, y: 600 };
  // TEMPORAL in the close layout: its left edge and width (on screen x 1373-1790); the TLS tube shortens with it
  const CLOSE_ZONE = { x: 1602, y: FLEET.y, w: 174, h: FLEET.h };
  // TEMPORAL's list of stored payloads in the close shot, one row per card that went through, each with its wrapped
  // data key: a row's size, drawn smaller (closeK) between the tube's mouth (24 px into the zone) and the zone's right
  // edge, 8 px clear of each, and centered on the tube; label: the list's label, top: the first row, pitch: from one
  // row to the next (all center y)
  const ROW = { w: 196, h: 32 };
  const CLOSE_ROW = { left: CLOSE_ZONE.x + 32, right: CLOSE_ZONE.x + CLOSE_ZONE.w - 8 };
  ROW.closeK = (CLOSE_ROW.right - CLOSE_ROW.left) / ROW.w;
  const LIST_AT = { x: (CLOSE_ROW.left + CLOSE_ROW.right) / 2, label: 456, top: 482, pitch: 27 };
  // The same list at camera rest, where the message is that TEMPORAL keeps ciphertext only: larger rows of ciphertext
  // alone (no key), spread down TEMPORAL's column under its logo, clear of the tube's mouth (x: their center; w and h:
  // a row's size; label, top, pitch as above), and CIPHERTEXT ONLY under them (cipherY)
  const WIDE_LIST = {
    x: FLEET.proxyTemporal.x + FLEET.proxyTemporal.w - 12 - 88, w: 176, h: 46, label: 266, top: 344, pitch: 76,
    cipherY: 690,
  };
  // the Codec Server, in the proxy box under its name, at camera rest: center and size
  const CODEC = { x: PROXY.x, y: 558, w: 172, h: 136 };
  // the CLI and the Web UI windows, which open over the SDK client's and the Web UI's tiles: their slots, the
  // connections they read through (in s.links) and their titles and event lines
  const READERS = [
    { slot: FLEET_CLIENTS[0], link: 6, title: 'TEMPORAL CLI', event: 'ActivityTaskCompleted', body: '#0B0B0B' },
    { slot: FLEET_CLIENTS[1], link: 7, title: 'TEMPORAL WEB UI', event: 'Activity completed', body: '#111111' },
  ];
  // the IBAN on two lines in a window, and the name
  const IBAN = TRANSFER[0][1];
  const READER_VALUES = [IBAN.slice(0, 19), IBAN.slice(20), TRANSFER[2][1]];
  // the seeds of their ciphertext (scrambledHtml): the IBAN's first line reads as stored row 2 (storedCipher(1))
  const READER_SEEDS = [11, 111, 211];
  // the red sparks that burst from the link as it snaps: how many, how long each one flies
  const SPARKS = { n: 12, life: 0.7 };

  // The card's way in from its Worker: along the Worker's track in the channel, then into the proxy, to `end`
  const rideIn = (run, end) => [[850, WORKERS[run.from].trackY], [1210, WORKERS[run.from].trackY],
    [1330, end.y], [end.x, end.y]];
  // Its way out, from where it was sealed, through the tube to its row in TEMPORAL's list
  const rideOut = row => [[SEAL.x, SEAL.y], [1560, LANE.wire.y], [row[0] - 80, row[1]], row];
  // The center of row i of TEMPORAL's list in the close shot, and in the wide one
  const closeRow = i => [LIST_AT.x, LIST_AT.top + i * LIST_AT.pitch];
  const wideRow = i => [WIDE_LIST.x, WIDE_LIST.top + i * WIDE_LIST.pitch];
  // The point at progress p along a path element, from its end back to its start if `back`
  function alongPath(pathEl, p, back = false) {
    const point = pathEl.getPointAtLength(pathEl._L * clamp(back ? 1 - p : p));
    return [point.x, point.y];
  }
  // Shows only the last q (0 to 1) of a path's length, with opacity o: a line that shrinks toward its end
  function drawTail(pathEl, q, o = 1) {
    const L = pathEl._L;
    pathEl.setAttribute('stroke-dasharray', `${L * clamp(q)} ${L}`);
    pathEl.setAttribute('stroke-dashoffset', -L * (1 - clamp(q)));
    pathEl.style.opacity = q > 0.001 ? o : 0;
  }
  // A tag of the close shot, sized in screen px (font): its HTML after the leading icon of a statusTag kind, in that
  // kind's look; solid, an opaque fill for a tag over other parts
  function closeTag(root, html, kind, font, solid = null) {
    const { icon, ...look } = STATUS_KINDS[kind];
    const lead = icon ? ICON(icon[0], font * U, icon[1], icon[2]) : '';
    const e = E(root, lead + html, 'mono', {
      fontSize: px(font), lineHeight: px(font * 1.4), letterSpacing: '.1em', padding: `${px(6)} ${px(14)}`,
      borderRadius: px(6), whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: px(8),
      border: `${px(2)} solid`, ...look,
    });
    if (solid) e.style.background = solid;
    return e;
  }
  // YOUR KMS: its name, the KMS key (e.kmsKey, its icon) and the key servers it can be; NEVER LEAVES beside the key
  // (e.never)
  function makeKms(root) {
    const e = E(root,
      `<div style="position:absolute;left:${px(22)};top:${px(18)};display:flex;align-items:center;gap:${px(10)}">`
      + `${ICON('kms', 26 * U, C.slate, 1.8)}<span class="lbl" style="font-size:${px(20)};color:var(--ink)">`
      + 'Your KMS</span></div>'
      + `<div style="position:absolute;left:${px(22)};top:${px(62)};display:flex;align-items:center;gap:${px(12)}">`
      + `<div class="kms-key">${ICON('key', 50 * U, C.violet, 1.9)}</div>`
      + `<span class="mono" style="font-size:${px(18)};letter-spacing:.12em;color:${C.violet}">KMS KEY</span></div>`
      + `<div class="mono" style="position:absolute;left:${px(22)};top:${px(144)};font-size:${px(15)};`
      + `line-height:${px(25)};letter-spacing:.06em;color:${C.slate};white-space:nowrap">`
      + 'AWS KMS · AZURE KEY VAULT<br>GCP KMS · YOUR KEY SERVER</div>',
      'tile', { width: KMS.w + 'px', height: KMS.h + 'px', textAlign: 'left' });
    e.kmsKey = e.querySelector('.kms-key');
    e.never = closeTag(e, 'NEVER LEAVES', 'ok', 15);
    Object.assign(e.never.style, { left: 'auto', right: px(22), top: px(70) });
    return e;
  }
  // The DATA KEY: a key, then its name and number (e.num, which flips over as it rotates) over its cipher (e.cipher)
  function makeDataKey(root) {
    const e = E(root,
      `${ICON('key', 26 * U, C.neon, 2)}<div style="text-align:left">`
      + `<div class="mono" style="font-size:${px(18)};line-height:${px(24)};letter-spacing:.08em">DATA KEY `
      + '<span class="num" style="display:inline-block">1</span></div>'
      + `<div class="cipher mono" style="font-size:${px(14)};line-height:${px(18)};letter-spacing:.08em;`
      + `color:${C.slate}">AES-256-GCM</div></div>`,
      '', {
        width: DATA_KEY.w + 'px', height: DATA_KEY.h + 'px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: px(12), background: C.bg, border: `${px(2)} solid ${C.neon}`,
        borderRadius: px(8),
      });
    e.num = e.querySelector('.num');
    e.cipher = e.querySelector('.cipher');
    return e;
  }
  // The tag of a card's data key, a fixed width so it never moves as its text changes: DATA KEY n on its way to the
  // KMS, then WRAPPED KEY n, behind a lock (setKeyTag)
  const makeKeyTag = root => closeTag(root, '', 'wait', 15, 'var(--violet-solid)');
  function setKeyTag(e, n, wrapped) {
    const icon = ICON(wrapped ? 'lock' : 'key', 16 * U, wrapped ? C.violet : C.neon, 2);
    setHtml(e, `${icon}${wrapped ? 'WRAPPED' : 'DATA'} KEY ${n}`);
    Object.assign(e.style, { width: px(200), justifyContent: 'center', borderStyle: wrapped ? 'solid' : 'dashed' });
  }
  // The ciphertext of stored payload i, its first n glyphs (the same glyphs in both lists and in the windows)
  const storedCipher = (i, n) => Array.from({ length: n }, (_, col) => cipherGlyph(i + 10, col)).join('');
  // A row of the close shot's list (ROW): ciphertext, then the payload's wrapped data key behind the violet lock of
  // the cards' WRAPPED KEY tag; a wrapped key is ciphertext too, which only your KMS can unwrap
  const makeListRow = (root, i, key) => E(root,
    `<span class="mono" style="font-size:16px;color:${C.violet}">${storedCipher(i, 5)}</span>`
    + `<span class="key mono" style="margin-left:auto;display:flex;align-items:center;gap:4px;font-size:15px;`
    + `line-height:20px;letter-spacing:.04em;padding:0 5px;border:1.5px solid ${C.violet};border-radius:4px;`
    + `color:${C.violet}">${ICON('lock', 13, C.violet, 2.2)}WRAPPED ${key}</span>`,
    '', {
      width: ROW.w + 'px', height: ROW.h + 'px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px',
      background: C.bg, border: `1.5px solid ${C.lineLight}`, borderRadius: 'var(--rs)',
    });
  // A row of the wide shot's list: a neon lock and the payload's ciphertext, at camera rest (values 18.5 px on screen)
  const makeWideRow = (root, i) => E(root,
    `${ICON('lock', 18, C.neon, 2.2)}<span class="mono" style="font-size:21px;color:${C.violet}">`
    + `${storedCipher(i, 8)}</span>`,
    '', {
      width: WIDE_LIST.w + 'px', height: WIDE_LIST.h + 'px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '10px', background: C.bg, border: `1.5px solid ${C.lineLight}`,
      borderRadius: 'var(--rs)',
    });
  // A window that reads the payload through the proxy, in the dark look of the Temporal Web UI: a title bar, then row
  // 2 of the Event History (its event line) and the payload's IBAN, on two lines, and name, keys above values
  // (win.values, set by setReader)
  function makeReader(root, { title, event, body }) {
    const dot = '<i style="display:block;width:9px;height:9px;border-radius:50%;background:#4B5363"></i>';
    const key = text => `<div class="mono" style="margin-top:10px;font-size:16px;line-height:20px;color:${C.slate}">`
      + `${text}</div>`;
    const value = '<div class="mono value" style="font-size:21px;line-height:27px;white-space:pre"></div>';
    const win = E(root,
      `<div style="height:36px;background:#191919;border-bottom:1px solid ${C.line};display:flex;align-items:center;`
      + `gap:7px;padding-left:14px">${dot}${dot}${dot}<span class="mono" style="margin-left:10px;font-size:16px;`
      + `letter-spacing:.12em;color:${C.slate}">${title}</span></div>`
      + '<div style="padding:14px 18px 0">'
      + `<div class="mono" style="font-size:17px;line-height:24px;white-space:nowrap">`
      + `<span style="color:${C.slate}">2</span>`
      + `&nbsp; ${event}</div>`
      + key('from') + value + value + key('name') + value + '</div>',
      '', {
        width: FLEET.tile.w + 'px', height: FLEET.tile.h + 'px', background: body, border: `1.5px solid ${C.line}`,
        borderRadius: 'var(--r)', overflow: 'hidden', textAlign: 'left',
      });
    win.values = [...win.querySelectorAll('.value')];
    return win;
  }
  // clear (0 to 1): the window's values turn from ciphertext to clear, left to right
  function setReader(win, clear) {
    win.values.forEach((e, i) => setHtml(e, scrambledHtml(READER_SEEDS[i], READER_VALUES[i], 1 - clear, true)));
  }
  // A small pill that carries the payload along a connection: its text in ciphertext (violet) or in clear (neon)
  const makePacket = (root, html, color) => E(root, html, 'mono', {
    height: '30px', lineHeight: '27px', padding: '0 12px', fontSize: '16px', whiteSpace: 'pre',
    background: C.bg, border: `1.5px solid ${color}`, borderRadius: 'var(--rs)', color,
    boxShadow: `0 0 16px rgba(${color === C.neon ? RGB.neon : RGB.violet},.45)`,
  });

  scene({
    chapter: 7, title: 'Encryption without code changes',
    // hard cuts: chapter 6 ends on this chapter's first frame, this chapter on the next one's (FULL_LANE_SHOT)
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the decrypted windows, then plays the clear-up and the cut in one go
    holdBeforeEnd: END.clear + 0.1,
    subs: [
      { text: "The proxy can also encrypt every payload on its way out, with no change to Worker code." },
      // the data key's trip to the KMS and the card's way out
      {
        text: "Payloads are sealed with short-lived data keys, wrapped by a key you own in your <b>KMS</b>.",
        after: 0.6,
      },
      // the second rotation and its card
      { text: "Data keys rotate on their own, and the proxy never holds your KMS key.", after: 1.0 },
      // a hold on the alarm
      { text: "If the KMS can't be reached, the call fails: nothing leaves in clear.", after: 1.6 },
      // the pull-back and the round trip, then a hold to read the windows
      { text: "Its built-in Codec Server lets the Web UI and the CLI show the decrypted payloads.", after: 2.0 },
    ],
    build(stage, s) {
      // chapter 6's parts first, in its order, so the cut shows the same stack
      const root = s.cam = makeCamera(stage);
      Object.assign(s, makeFleet(root));
      s.band = makeProxyBand(root);
      s.tube = makeTube(root, PROXY_TUBE);
      s.proxy = makeProxy(root);
      s.sparks = s.apps.map(() => makeSpark(root, 10, RGB.violet));
      s.outSparks = [0, 1].map(() => makeSpark(root, 12, RGB.violet));
      s.sent = makePayload(root, { w: PROXY_CARD.w });
      s.sentNs = proxyCardTag(root, namespaceHtml(FULL_NS.length, false), PROXY_CARD.nsW);
      s.sentKey = proxyCardTag(root, `${ICON('key', 17, C.violet, 2)}API KEY`, PROXY_CARD.keyW);

      // this chapter's parts: TEMPORAL's list, YOUR KMS and its link, the DATA KEY, the gate
      s.listLabel = E(root, 'Stored payloads', 'lbl', { fontSize: '16px', width: ROW.w + 'px', paddingLeft: '0' });
      s.rows = RUNS.filter(run => !run.fails).map((run, i) => makeListRow(root, i, run.key));
      s.wideLabel = E(root, 'Stored<br>payloads', 'lbl', {
        fontSize: '21px', lineHeight: '28px', width: WIDE_LIST.w + 'px', paddingLeft: '0',
      });
      s.wideRows = s.rows.map((_, i) => makeWideRow(root, i));
      s.cipherTag = E(root, 'Ciphertext<br>only', 'lbl', {
        width: WIDE_LIST.w + 'px', padding: '8px 0', fontSize: '21px', lineHeight: '28px', textAlign: 'center',
        color: C.violet, border: `1.5px solid ${C.violet}`, borderRadius: 'var(--rs)', background: VERDICT_FILL.wait,
      });
      s.kms = makeKms(root);
      s.top = svgLayer(root);
      const { x0, y0, x, x1, y1, breakY } = LINK;
      const r = 8;
      s.linkPath = path(s.top, `M ${x0} ${y0} H ${x - r} Q ${x} ${y0} ${x} ${y0 + r} V ${y1 - r}`
        + ` Q ${x} ${y1} ${x + r} ${y1} H ${x1}`, C.violet, 2, false);
      s.linkA = path(s.top, `M ${x0} ${y0} H ${x - r} Q ${x} ${y0} ${x} ${y0 + r} V ${breakY}`, C.violet, 2, false);
      s.linkB = path(s.top, `M ${x} ${breakY} V ${y1 - r} Q ${x} ${y1} ${x + r} ${y1} H ${x1}`, C.violet, 2, false);
      s.breakMark = E(root, ICON('x', 22 * U, C.red, 2.6));
      s.dataKey = makeDataKey(root);
      s.gate = E(root, '', '', {
        width: GATE.w + 'px', height: PROXY_TUBE.h + 'px', borderRadius: px(4), transformOrigin: 'center top',
        background: `repeating-linear-gradient(-45deg, ${C.red} 0 ${px(10)}, var(--red-solid) ${px(10)} ${px(20)})`,
        border: `${px(2)} solid ${C.red}`, boxShadow: `0 0 ${px(24)} rgba(${RGB.red},.6)`,
      });
      s.codec = E(root,
        `${ICON('server', 26, C.ink, 1.8)}<div class="lbl" style="font-size:21px;line-height:26px;color:var(--ink);`
        + 'text-align:center;margin-top:8px">Codec<br>Server</div><div class="mono" style="font-size:21px;'
        + `letter-spacing:.12em;padding-left:.12em;color:${C.violet};margin-top:6px">BUILT IN</div>`,
        'tile', {
          width: CODEC.w + 'px', height: CODEC.h + 'px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', background: C.bg,
        });
      s.readers = READERS.map(reader => makeReader(root, reader));

      // the cards of the runs, each with its data key's tag and the key that flies onto it
      s.runs = RUNS.map(() => {
        const card = makePayload(root, { w: CARD.w });
        const keyTag = makeKeyTag(root);
        const fly = E(root, ICON('key', 26 * U, C.neon, 2.2), '', {
          filter: `drop-shadow(0 0 ${px(8)} rgba(${RGB.neon},.8))`,
        });
        return { card, keyTag, fly };
      });
      s.fetch = makePacket(root, scrambledHtml(READER_SEEDS[0], IBAN.slice(0, 9), 1), C.violet);
      s.deliver = READERS.map(() => makePacket(root, IBAN.slice(0, 9), C.neon));
      s.noCode = closeTag(root, 'NO CODE CHANGE', 'ok', 20, 'var(--neon-solid)');
      s.callFailed = closeTag(root, 'CALL FAILED', 'denied', 18, 'var(--red-solid)');
      s.failClosed = E(root, 'FAIL CLOSED', 'mono', {
        fontSize: px(30), lineHeight: px(40), letterSpacing: '.12em', padding: `${px(10)} ${px(22)}`,
        paddingLeft: `calc(${px(22)} + .12em)`, border: `${px(3)} solid ${C.red}`, borderRadius: px(8),
        color: C.red, background: 'var(--red-solid)', whiteSpace: 'nowrap', fontWeight: 700,
        boxShadow: `0 0 ${px(30)} rgba(${RGB.red},.5)`,
      });
      s.sealRipples = RUNS.map(() => makeRipples(root, 2, RGB.violet));
      s.wrapRipples = makeRipples(root, 2, RGB.violet);
      s.gateRipples = makeRipples(root, 2, RGB.red);
      s.snapSparks = Array.from({ length: SPARKS.n }, () => makeSpark(root, 5, RGB.red));
      s.healSpark = makeSpark(root, 6, RGB.violet);
      // the flash covers the stage, outside the camera
      s.flash = makeFlash(stage);
    },
    update(t, c, s) {
      const runAt = run => c[run.cue] + run.at;
      const snapAt = c[3] + T3.snap, healAt = c[4] + T4.heal;
      const failRun = RUNS[RUNS.length - 1];
      const hitAt = runAt(failRun) + failRun.ride;
      const failClosedHit = c[3] + T3.failClosed + T3.slamD;
      const pullAt = c[4] + T4.pull;
      const clearAt = this.dur - END.clear;
      const clear = P(t, clearAt, END.clearD);

      // the camera: chapter 6's push into the proxy, held; then one pull-back, out of the proxy to the whole fleet.
      // The snap, the slam and the stamp jolt it.
      const cam = shot(t, PROXY_SHOT, [[pullAt, ...FULL_LANE_SHOT, T4.pullD]]);
      const jolts = [shake(t, snapAt, 5, 0.3), shake(t, hitAt, 12, 0.4), shake(t, failClosedHit, 4, 0.25)];
      const shakeX = jolts.reduce((sum, [dx]) => sum + dx, 0), shakeY = jolts.reduce((sum, [, dy]) => sum + dy, 0);
      setCamera(s.cam, t, this.dur, { ...cam, dx: cam.dx + shakeX, dy: cam.dy + shakeY, enter: 1, exit: 1 });
      placeFlash(s.flash, t, hitAt, 0.3);
      // what the close shot crops at the frame's edge stays dimmed until the pull-back frames it whole, in the last
      // part of the move
      const wide = P(t, pullAt, T4.pullD);
      const reveal = clamp((wide - 0.7) / 0.3);
      const offShot = lerp(OFF_SHOT, 1, reveal);
      // what only the close shot shows leaves with the pull-back
      const closeOnly = 1 - P(t, pullAt, T4.pullD * 0.6);

      // the lane: TEMPORAL slides into its close layout, near the proxy, and back out with the pull-back
      const zoneIn = P(t, c[0] + T0.close, T0.closeD) * (1 - wide);
      const temporalZone = lerpZone(PROXY_ZONES.temporal, CLOSE_ZONE, zoneIn);
      placeLane(s.lane, {
        ...BARE_WORKERS_HANDOFF.lane, envZone: PROXY_ZONES.env, temporalZone, env: offShot, temporal: offShot,
      });
      frameLaneEdges(s.lane, cam);

      // the Workers with their two lines, and the other apps; the SDK client hides while YOUR KMS sits over it
      s.tiles.forEach((tile, w) => {
        gearSpin(tile, 1);
        place(tile, WORKERS[w].x, WORKERS[w].y, 1, offShot);
        tile.lines.forEach((line, k) => setText(line, WORKER_LINES[k]));
        tile.lines[1].style.color = C.violet;
      });
      // the SDK client and the Web UI, cropped by the close shot into the header and subtitle bands, fade out with
      // TEMPORAL's move, and come back once the pull-back frames them whole
      const clientsO = lerp(OFF_SHOT * (1 - P(t, c[0] + T0.close, 0.5)), 1, reveal);
      s.clients.forEach((tile, i) => place(tile, FLEET_CLIENTS[i].x, FLEET_CLIENTS[i].y, 1, clientsO));

      // the connections and their light; the proxy's connection to TEMPORAL follows TEMPORAL's edge
      s.links.forEach((link, i) => {
        draw(link, 1, offShot);
        sparkOnPath(s.sparks[i], link, (G / PROXY_FLOW_PERIOD + i / s.apps.length) % 1);
        s.sparks[i].style.opacity = (+s.sparks[i].style.opacity * offShot).toFixed(3);
      });
      setD(s.out, `M ${PROXY_WIRE.x0} ${PROXY_WIRE.y} L ${temporalZone.x - 4} ${PROXY_WIRE.y}`);
      // nothing leaves while the call fails: the wire dims and its light stops
      const failed = P(t, hitAt, 0.3) * (1 - P(t, healAt, 0.4));
      draw(s.out, 1, 1 - 0.6 * failed);
      s.outSparks.forEach((spark, k) => {
        sparkOnPath(spark, s.out, (G / (PROXY_FLOW_PERIOD / 2) + k / 2) % 1);
        spark.style.opacity = (+spark.style.opacity * (1 - failed)).toFixed(3);
      });

      // the TLS tube, as long as the way to TEMPORAL, dimmed while the call fails; its label smaller in the close shot
      const tubeX1 = temporalZone.x + 12;
      const tubeMid = (PROXY_TUBE.x0 + tubeX1) / 2;
      const tubeGeom = { ...PROXY_TUBE, x1: tubeX1, label: { x: tubeMid, y: PROXY_TUBE.label.y } };
      placeTube(s.tube, tubeGeom, {
        o: (1 - 0.55 * failed) * (1 - clear), label: 1 - clear, labelS: lerp(1, 0.55, zoneIn),
      });
      s.tube.flow.style.opacity = 1 - failed;

      // the proxy, its glow swelling as it seals a card and as its Codec Server decrypts
      const glowAt = [...RUNS.filter(run => !run.fails).map(run => runAt(run) + run.seal), c[4] + T4.deliver - 0.1];
      const glow = Math.max(0, ...glowAt.map(at => 1 - Math.abs(t - at - 0.15) / 0.4));
      placeProxy(s.proxy, { glow });

      // chapter 6's card in its Namespace, dimmed, fades out with the Namespace as TEMPORAL moves in
      const sentO = OFF_SHOT * (1 - P(t, c[0] + T0.close, 0.5));
      place(s.band, PROXY_BAND.x, PROXY_BAND.y, 1, sentO);
      s.band.style.borderColor = C.violet;
      s.band.style.background = `rgba(${RGB.violet},.1)`;
      s.band.style.boxShadow = glowShadow(RGB.violet, 1, { blur: 36, alpha: 0.4 });
      setPayload(s.sent);
      s.sent.style.borderColor = C.neon;
      s.sent.style.boxShadow = glowShadow(RGB.neon, 1, { blur: 24, alpha: 0.4 });
      const { card: sentAt } = PROXY_BAND;
      place(s.sent, sentAt.x, sentAt.y, PROXY_CARD.k, sentO);
      s.sentNs.style.color = C.neon;
      s.sentNs.style.borderColor = C.neon;
      place(s.sentNs, sentAt.x, sentAt.y + PROXY_CARD.h / 2, 1, sentO);
      place(s.sentKey, sentAt.x, sentAt.y + PROXY_CARD.keyDy, 1, sentO);

      // YOUR KMS beside the proxy, and its link to the data key; the KMS key NEVER LEAVES
      const kmsPop = backPop(t, c[1] + T1.kms);
      const kmsDown = P(t, snapAt, 0.2) * (1 - P(t, healAt, 0.3));
      place(s.kms, KMS.x, KMS.y, kmsPop.s, kmsPop.o * closeOnly);
      s.kms.style.borderColor = kmsDown > 0.5 ? C.red : C.line;
      const never = popIn(t, c[2] + T2.never);
      s.kms.never.style.opacity = never.o * (1 - kmsDown);
      s.kms.never.style.transform = `scale(${never.s})`;

      // the link draws from the KMS to the data key. The dramatic beat: it snaps in the middle, both halves recoil
      // in red and red sparks burst from the break; then it heals.
      const linkIn = P(t, c[1] + T1.link, T1.linkD, linear);
      const recoil = P(t, snapAt, 0.25, easeOut) * (1 - P(t, healAt, 0.35));
      const broken = t >= snapAt && t < healAt + 0.35;
      const linkColor = broken ? C.red : C.violet;
      [s.linkA, s.linkB].forEach(half => half.setAttribute('stroke', linkColor));
      draw(s.linkA, Math.min(clamp(linkIn * 2), 1 - 0.5 * recoil), closeOnly);
      if (broken) drawTail(s.linkB, 1 - 0.5 * recoil, closeOnly);
      else draw(s.linkB, clamp(linkIn * 2 - 1), closeOnly);
      const mark = popIn(t, snapAt + 0.05, 0.3);
      place(s.breakMark, LINK.x, LINK.breakY, mark.s, mark.o * (1 - P(t, healAt, 0.2)) * closeOnly);
      s.snapSparks.forEach((spark, i) => {
        const age = t - snapAt;
        if (age <= 0 || age >= SPARKS.life) {
          place(spark, 0, 0, 1, 0);
          return;
        }
        const angle = hash(i + 800) * Math.PI * 2;
        const speed = 40 + 60 * hash(i + 900);
        const x = LINK.x + Math.cos(angle) * speed * age;
        const y = LINK.breakY + Math.sin(angle) * speed * age + 90 * age * age;
        place(spark, x, y, 1, 1 - age / SPARKS.life);
      });
      // the healed link carries a violet pulse from the KMS to the data key
      sparkOnPath(s.healSpark, s.linkPath, P(t, healAt + 0.35, 0.5, linear));
      s.healSpark.style.opacity = (+s.healSpark.style.opacity * closeOnly).toFixed(3);

      // the DATA KEY, which shows its cipher once it first seals a card; it rotates twice, its number flipping over,
      // and dims while the KMS can't be reached
      const keyPop = backPop(t, c[1] + T1.key);
      const keyDown = P(t, snapAt + 0.1, 0.25) * (1 - P(t, healAt, 0.3));
      place(s.dataKey, DATA_KEY.x, DATA_KEY.y, keyPop.s, keyPop.o * (1 - 0.55 * keyDown) * closeOnly);
      s.dataKey.style.borderColor = keyDown > 0.5 ? C.red : C.neon;
      s.dataKey.style.borderStyle = keyDown > 0.5 ? 'dashed' : 'solid';
      const flipsDone = T2.flips.filter(at => t >= c[2] + at).length;
      const flipAt = c[2] + T2.flips[Math.max(0, flipsDone - 1)];
      // the old number turns away in the 0.15 s before each flip, the new one turns in after it
      const nextAt = c[2] + T2.flips[Math.min(flipsDone, T2.flips.length - 1)];
      const turnAway = flipsDone < T2.flips.length ? P(t, nextAt - 0.15, 0.15, easeIn) : 0;
      const turnIn = flipsDone > 0 ? 1 - P(t, flipAt, 0.15, easeOut) : 0;
      setText(s.dataKey.num, String(1 + flipsDone));
      const angle = 90 * Math.max(turnAway, turnIn);
      s.dataKey.num.style.transform = angle > 0 ? `perspective(${px(60)}) rotateX(${angle.toFixed(2)}deg)` : 'none';
      s.dataKey.style.transform += ` scale(${swell(t, flipAt, flipsDone ? 0.12 : 0).toFixed(4)})`;
      const firstKeySeal = runAt(RUNS[1]) + RUNS[1].seal;
      s.dataKey.cipher.style.opacity = P(t, firstKeySeal, 0.3);

      // the cards: each rides in from its Worker, in clear, and is sealed in the proxy (the data key flies onto its
      // lock); the first one with the data key sends that key to the KMS, which wraps it; each goes out with its
      // wrapped key through the tube into TEMPORAL's list, as a row with its key's number
      let row = 0;
      RUNS.forEach((run, i) => {
        const { card, keyTag, fly } = s.runs[i];
        const at = runAt(run);
        const sealAt = at + run.seal;
        const end = run.fails ? STOP : SEAL;
        const rideP = P(t, at, run.ride, run.fails ? p => p * p : ease);
        let [x, y] = bezier(rideIn(run, end), rideP);
        let k = 1, o = P(t, at, 0.15);
        const rowI = run.fails ? -1 : row++;
        if (!run.fails) {
          const out = P(t, at + run.out, run.outD);
          if (out > 0) {
            [x, y] = bezier(rideOut(closeRow(rowI)), out);
            k = lerp(1, 0.4, out);
            o *= 1 - P(out, 0.6, 0.4, linear);
          }
          setPayload(card, { seal: P(t, sealAt, 0.35, linear), scramble: P(t, sealAt + 0.1, 0.5, linear) });
        } else {
          // the failed card jolts back off the gate, red, and goes back to its Worker once the call has failed
          x += dampedShake(t, hitAt, 10, 0.45, 3);
          const back = P(t, healAt, 0.8);
          if (back > 0) [x, y] = bezier(rideIn(run, end), 1 - back);
          o *= 1 - P(t, healAt + 0.3, 0.5);
          setPayload(card, { red: P(t, hitAt, 0.15) * (1 - P(t, healAt, 0.5)) });
        }
        place(card, x, y, k, o);
        placeRipples(s.sealRipples[i], t, sealAt + 0.35 * LOCK_SHUT, x, y - CARD.h / 2, 12, 110,
          { d: 0.8, step: 0.15 });
        if (run.fails) placeRipples(s.gateRipples, t, hitAt, GATE.x, SEAL.y, 30, 150, { d: 0.7, step: 0.14 });

        // the data key flies from the DATA KEY onto the card's lock as it seals it
        const flyP = P(t, sealAt - 0.3, 0.3);
        const flyOn = !run.noKey && !run.fails && flyP > 0 && t < sealAt + 0.1;
        place(fly, lerp(DATA_KEY.x - DATA_KEY.w / 2 + 14, x, flyP), lerp(DATA_KEY.y, y - CARD.h / 2, flyP), 1,
          flyOn ? 1 : 0);

        // its data key's tag: it docks on the card's bottom edge, at once or after the trip to the KMS
        const dock = [x, y + k * CARD.h / 2 + 1];
        if (run.noKey || run.fails) {
          place(keyTag, 0, 0, 1, 0);
        } else if (run.wrap) {
          const goAt = sealAt + WRAP.go, wrapAt = goAt + WRAP.tripD, backAt = wrapAt + WRAP.stay;
          const dockAt = backAt + WRAP.tripD;
          let tagAt = alongPath(s.linkPath, P(t, goAt, WRAP.tripD), true);
          if (t >= backAt) tagAt = alongPath(s.linkPath, P(t, backAt, WRAP.tripD));
          const docking = P(t, dockAt, WRAP.dockD);
          if (docking > 0) tagAt = [lerp(LINK.x1, dock[0], docking), lerp(LINK.y1, dock[1], docking)];
          setKeyTag(keyTag, run.key, t >= wrapAt + 0.15);
          const tagPop = popIn(t, goAt);
          place(keyTag, tagAt[0], tagAt[1], k * tagPop.s * swell(t, wrapAt + 0.05, 0.25), tagPop.o * o);
          placeRipples(s.wrapRipples, t, wrapAt + 0.05, LINK.x0, LINK.y0, 20, 120, { d: 0.7, step: 0.15 });
          s.kms.kmsKey.style.transform = `scale(${swell(t, wrapAt, 0.3).toFixed(4)})`;
          s.kms.kmsKey.style.filter = `drop-shadow(0 0 ${px(14 * win(t, wrapAt - 0.1, wrapAt + 0.4, 0.15))} `
            + `rgba(${RGB.violet},.9))`;
        } else {
          setKeyTag(keyTag, run.key, true);
          const tagPop = popIn(t, sealAt + 0.35);
          place(keyTag, dock[0], dock[1], k * tagPop.s, tagPop.o * o);
        }

        // its row in TEMPORAL's list rises in as it lands; the pull-back carries the row toward the wide list as it
        // fades, and the wide list's row comes in once the shot holds it
        if (run.fails) return;
        const landed = P(t, at + run.out + run.outD - 0.15, 0.3);
        const [closeX, closeY] = closeRow(rowI), [wideX, wideY] = wideRow(rowI);
        const rowE = s.rows[rowI];
        place(rowE, lerp(closeX, wideX, wide), lerp(closeY, wideY, wide) + (1 - landed) * 6,
          lerp(ROW.closeK, 1, wide), landed * closeOnly);
        place(s.wideRows[rowI], wideX, wideY, 1, landed * reveal * (1 - clear));
        // the payloads that keep the first data key light up once the key has rotated
        const keep = run.key === 1 ? win(t, c[2] + T2.keep, c[2] + T2.keep + 0.6, 0.2) : 0;
        rowE.querySelector('.key').style.boxShadow = glowShadow(RGB.neon, keep, { blur: 12, alpha: 0.8 });
        rowE.style.borderColor = keep > 0.5 ? C.neon : C.lineLight;
      });
      const firstLanded = P(t, runAt(RUNS[0]) + RUNS[0].out + RUNS[0].outD - 0.15, 0.3);
      place(s.listLabel, lerp(LIST_AT.x, WIDE_LIST.x, wide), lerp(LIST_AT.label, WIDE_LIST.label, wide),
        lerp(ROW.closeK, 1, wide), firstLanded * closeOnly);
      place(s.wideLabel, WIDE_LIST.x, WIDE_LIST.label, 1, reveal * (1 - clear));

      // NO CODE CHANGE, in your environment, where the Workers' connections come from
      const noCode = popIn(t, c[0] + T0.noCode);
      place(s.noCode, NO_CODE.x, NO_CODE.y, noCode.s, noCode.o * closeOnly);

      // the gate drops across the proxy's exit as the KMS link snaps, and lifts as it heals
      const gate = P(t, c[3] + T3.gate, 0.25, backOut) * (1 - P(t, healAt + 0.05, 0.25));
      place(s.gate, GATE.x, PROXY_TUBE.y, 1, gate > 0.001 ? closeOnly : 0);
      s.gate.style.transform += ` scaleY(${clamp(gate, 0, 1.2).toFixed(3)})`;
      // CALL FAILED slams onto the failed card's bottom edge; FAIL CLOSED stamps onto the empty wire
      const healed = 1 - P(t, healAt, 0.3);
      const callSlam = P(t, c[3] + T3.callFailed, T3.slamD, easeIn);
      place(s.callFailed, STOP.x, STOP.y + CARD.h / 2 + 1, lerp(1.7, 1, callSlam),
        P(t, c[3] + T3.callFailed, 0.08, linear) * healed);
      const stamp = P(t, c[3] + T3.failClosed, T3.slamD, easeIn);
      place(s.failClosed, tubeMid, PROXY_TUBE.y, lerp(2.2, 1, stamp),
        P(t, c[3] + T3.failClosed, 0.08, linear) * healed, -8);

      // after the pull-back: the proxy's built-in Codec Server, and the CLI and the Web UI, which open over their
      // tiles in ciphertext. Row 2 goes from TEMPORAL into the proxy in ciphertext, the Codec Server decrypts it and
      // sends it on to both windows, which show it in clear; TEMPORAL keeps ciphertext only.
      const codecPop = backPop(t, c[4] + T4.codec);
      const decryptAt = c[4] + T4.deliver - 0.1;
      place(s.codec, CODEC.x, CODEC.y, codecPop.s * swell(t, decryptAt, 0.1), codecPop.o * (1 - clear));
      s.codec.style.borderColor = t >= decryptAt ? C.violet : C.line;
      const fetch = P(t, c[4] + T4.fetch, T4.tripD);
      const [fromX, fromY] = wideRow(1);
      const [fetchX, fetchY] = bezier([[fromX, fromY], [fromX - 60, LANE.wire.y], [PROXY_WIRE.x1, LANE.wire.y],
        [PROXY_WIRE.x0 + 10, LANE.wire.y]], fetch);
      place(s.fetch, fetchX, fetchY, 1, fetch > 0 && fetch < 1 ? 1 : 0);
      const deliver = P(t, c[4] + T4.deliver, T4.tripD);
      const delivered = c[4] + T4.deliver + T4.tripD;
      READERS.forEach((reader, i) => {
        const winE = s.readers[i];
        const open = backPop(t, c[4] + T4.windows + 0.15 * i);
        const closing = 1 - 0.15 * clear;
        place(winE, reader.slot.x, reader.slot.y, lerp(0.6, 1, open.s) * closing, open.o * (1 - clear));
        setReader(winE, P(t, delivered, 0.5, linear));
        const lit = P(t, delivered + 0.4, 0.2) * (1 - P(t, delivered + 1.2, 0.5));
        winE.style.borderColor = lit > 0.5 ? C.neon : C.line;
        winE.style.boxShadow = glowShadow(RGB.neon, lit, { blur: 30, alpha: 0.5 });
        const [px1, py1] = alongPath(s.links[reader.link], deliver, true);
        place(s.deliver[i], px1, py1, 1, deliver > 0 && deliver < 1 ? 1 : 0);
      });
      const cipherIn = popIn(t, c[4] + T4.ciphertext);
      place(s.cipherTag, WIDE_LIST.x, WIDE_LIST.cipherY, cipherIn.s, cipherIn.o * (1 - clear));
    }
  });
}
