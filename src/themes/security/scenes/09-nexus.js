// ===================== 9. ACROSS NAMESPACES WITH NEXUS
// Temporal Nexus, on Temporal Cloud's side: a wide Temporal Cloud zone (the official lockup followed by "Cloud")
// holds the payments Namespace on the left, where Nora's transfer Workflow runs, the fraud team's Namespace on the
// right, where the screenTransfer handler and its Task Queue live, and between them the Nexus Endpoint
// fraud-screening, a gate: its tile over its ALLOWLIST's, a violet line on their center axis closing the opening
// between them. The transfer Workflow's call runs up to that line. The dramatic beat: a call from the analytics
// Namespace slams into the gate (a red flash, a shake): NOT ON ALLOWLIST; then the call from payments is checked
// against the allowlist, ALLOWED, the gate opens and the call reaches the handler. A veil drops
// over the fraud Namespace: its Namespace, Task Queue and implementation are not exposed to callers. Then an mTLS
// tube replaces the call line, the payload card, already sealed by the caller's Worker, rides it behind the veil, and
// the result comes back sealed too, by the handler. The camera holds; the engine's zoom-through brings the scene in
// and plays into the next one.
// The block keeps every name declared in this file local to this scene.
{
  // The Temporal Cloud zone, the scene's whole space: left, top and size, centered on (960, 515)
  const ZONE = { x: 120, y: 170, w: 1680, h: 690 };
  // The call line: the stage y where calls leave the transfer Workflow, pass the Endpoint and reach the handler; the
  // mTLS tube's axis and the middle of the Namespaces' column (y 250-830), so the gate's two tiles match
  const CALL_Y = 540;
  // The mTLS tube's height: the theme's TLS tube as chapter 2 shows it on screen (TUBE.h at its 1.4 zoom), a little
  // lower to fit between the Namespace headings and the gate's tiles
  const TUBE_H = 240;
  // How far the tiles sit inside a Namespace, as its heading does, px
  const INSET = 20;
  // The tiles inside the Namespaces, left, top and size: the transfer Workflow (WORKFLOW) and the fraud team's
  // handler (HANDLER), mirrored, both on the tube's top and bottom lines; the fraud Task Queue (QUEUE) across fraud
  // under the handler, its top in line with analytics'
  const WORKFLOW = { x: 180, y: CALL_Y - TUBE_H / 2, w: 240, h: TUBE_H };
  const HANDLER = { x: 1500, y: CALL_Y - TUBE_H / 2, w: 240, h: TUBE_H };
  // The Namespaces, left, top and size: payments and analytics, the callers, stacked on the left; fraud, the
  // handler's, on the right, mirroring them; all three INSET px round their tiles. headTop: their heading's top, px
  // under their top edge (analytics: centered).
  const PAYMENTS = { x: 160, y: 250, w: 620, h: WORKFLOW.y + WORKFLOW.h + INSET - 250, headTop: 20 };
  const ANALYTICS = { x: 160, y: 720, w: 620, h: 110, headTop: 32 };
  const FRAUD = { x: 1140, y: 250, w: 620, h: 580, headTop: 20 };
  const QUEUE = { x: FRAUD.x + INSET, y: ANALYTICS.y, w: FRAUD.w - 2 * INSET, h: FRAUD.y + FRAUD.h - INSET - 720 };
  // A Namespace heading, as in chapter 2: the NAMESPACE label and the name, their sizes and line heights, px; its
  // verdict tag (19 px, in the theme's red verdict size) sits on the right of the heading, centered on it
  const NS_HEAD = { label: 14, labelLine: 18, name: 22, nameLine: 28 };
  NS_HEAD.h = NS_HEAD.labelLine + NS_HEAD.nameLine;
  const VERDICT = { font: 19, h: 34 };
  // A heading of this scene's tiles: uppercase mono, letter-spaced, its size and line height, px
  const HEAD = { font: 18, line: 26 };
  // Inside a tile, px: its heading's top, the text inset from its sides; its rows (a key over a value) are centered
  // in the room under the heading, ROW.gap apart
  const TILE = { headTop: 18, inset: 20 };
  const ROW = { key: 14, keyLine: 18, value: 20, valueLine: 28, gap: 12 };
  // What each tile shows: its rows, [key, value]
  const WORKFLOW_ROWS = [
    ['type', 'TransferWorkflow'], ['endpoint', 'fraud-screening'], ['operation', 'screenTransfer'],
  ];
  const HANDLER_ROWS = [
    ['operation', 'screenTransfer'], ['starts workflow', 'ScreenWorkflow'], ['activity', 'scoreRisk'],
  ];
  // The Endpoint, a gate on x 960 between the Namespaces, as wide as the gaps on its sides allow: its two tiles, top
  // (the Endpoint's name) and bottom (its allowlist), 20 px clear of the tube, as tall as each other, the top one's top
  // and the bottom one's bottom in line with the Namespaces'; and, on the gate's center axis, its line (bar: its
  // width, as chapter 4's Data Converter gate), which closes the opening between them
  const GATE = { x: 960, w: 220, bar: 2 };
  GATE.open = { top: CALL_Y - TUBE_H / 2 - 20, bottom: CALL_Y + TUBE_H / 2 + 20 };
  GATE.top = { y: FRAUD.y, h: GATE.open.top - FRAUD.y };
  GATE.bottom = { y: GATE.open.bottom, h: FRAUD.y + FRAUD.h - GATE.open.bottom };
  GATE.left = GATE.x - GATE.w / 2;
  // A gate tile's stack, centered in it, px: its icon, the gap under it, its heading line, the gap under that; then
  // the Endpoint's name (a value line) or the allowlist's one row (its size)
  const STACK = { icon: 28, iconGap: 10, gap: 14 };
  const ALLOW_ROW = { w: 160, h: 40 };
  // the middle y of the allowlist's row, at the bottom of its tile's stack
  const ALLOW_ROW_Y = GATE.bottom.y + GATE.bottom.h / 2
    + (STACK.icon + STACK.iconGap + HEAD.line + STACK.gap + ALLOW_ROW.h) / 2 - ALLOW_ROW.h / 2;
  // The calls, as SVG paths: the transfer Workflow's, from its tile's right edge along the call line to the handler's
  // tile, its first part (CALL_TO_GATE of its length) up to the gate's line; the analytics call, from its Namespace's
  // right edge, up through the gap beside the gate and into the opening, to the gate's line (HIT: where it hits). The
  // round caps end under the tiles and the line.
  const BAR_LEFT = GATE.x - GATE.bar / 2;
  const CALL_D = `M ${WORKFLOW.x + WORKFLOW.w} ${CALL_Y} H ${HANDLER.x}`;
  const CALL_TO_GATE = (BAR_LEFT - WORKFLOW.x - WORKFLOW.w) / (HANDLER.x - WORKFLOW.x - WORKFLOW.w);
  const HIT = { x: BAR_LEFT, y: CALL_Y + 60 };
  const ANALYTICS_Y = ANALYTICS.y + ANALYTICS.h / 2;
  const DENY_FROM = ANALYTICS.x + ANALYTICS.w;
  const DENY_MID = (DENY_FROM + GATE.left) / 2;
  const DENY_D = `M ${DENY_FROM} ${ANALYTICS_Y} C ${DENY_MID} ${ANALYTICS_Y} ${DENY_MID} ${HIT.y} ${GATE.left} ${HIT.y}`
    + ` H ${HIT.x}`;
  // The mTLS tube between the Namespaces, in the theme's TLS tube look (makeTube): from the transfer Workflow's tile,
  // its mouth ring (24 px wide) 16 px clear of it, to 24 px inside fraud, where the veil covers its end. Its label, a
  // big pill (chapter 2's TLS label as it shows on screen), sits where chapter 2 puts it: 168 px right of the tube's
  // start and 24 px above it, clear of payments' heading row.
  const NEXUS_TUBE = { x0: WORKFLOW.x + WORKFLOW.w + 16 + 12, x1: FRAUD.x + 24, y: CALL_Y, h: TUBE_H };
  const TUBE_LABEL = { w: 180, h: 66 };
  NEXUS_TUBE.label = { x: NEXUS_TUBE.x0 + 168, y: CALL_Y - TUBE_H / 2 - 24 - TUBE_LABEL.h / 2 };
  // The payload card in the tube: as wide as chapter 2's card in its tube on screen (PAYLOAD_IN_WORKER.w at its scale
  // and zoom), built at that width so it rests on whole pixels. Where it waits in payments, 16 px clear of the tube's
  // mouth ring and INSET px from payments' right edge, and where it is hidden under the veil, fully inside fraud.
  const CARD = { w: 284 };
  const CARD_AT = {
    x: (NEXUS_TUBE.x0 + 12 + 16 + PAYMENTS.x + PAYMENTS.w - INSET) / 2, hiddenX: FRAUD.x + CARD.w / 2 + 20,
  };
  // The sealed result that comes back: its size, its padlock badge and padlock, its one field (TRANSFER's ciphertext
  // glyphs for row `row`, so its glyphs differ from the payload's) and its center y in the tube
  const RESULT = { w: 160, h: 104, badge: 28, lock: 16, key: 'decision', value: 'approve', row: 4, y: CALL_Y + 6 };

  // the beats, in seconds from their cue. c[0]: the transfer Workflow (workflow) and the handler (handler) come in,
  // the Namespaces light up (across), the gate rises (gate), its line draws down (bar, barD) and the call line draws
  // to it (call, callD). c[1]: the analytics call (deny, denyD) hits the gate; the payments call (allow, allowD)
  // reaches it, the allowlist row lights, ALLOWED (allowed), the gate opens (open) and the call goes on to the handler
  // (pass, passD); the veil wipes over fraud (veil, veilD), its caption (caption). c[2]: the tube draws (tube,
  // tubeD), its label (label); the payload card, sealed by the caller's Worker, comes out (card) and rides behind the
  // veil (ride, rideD); the result comes back (back, backD)
  const T0 = { workflow: 1.3, handler: 2.6, gate: 3.9, bar: 4.3, barD: 0.4, across: 4.4, call: 5.4, callD: 0.6 };
  const T1 = {
    deny: 1.0, denyD: 0.45, allow: 2.5, allowD: 0.5, allowed: 3.2, open: 3.3, pass: 3.5, passD: 0.5, veil: 4.2,
    veilD: 0.7, caption: 4.8,
  };
  const T2 = { tube: 0.3, tubeD: 0.9, label: 2.4, card: 3.3, ride: 3.8, rideD: 1.1, back: 5.0, backD: 1.2 };

  // A tile heading: uppercase mono, letter-spaced, the trailing spacing offset by as much padding on the left when
  // centered (css: its position)
  const headHtml = (text, css = '') => `<div class="mono" style="${css}font-size:${HEAD.font}px;`
    + `line-height:${HEAD.line}px;letter-spacing:.1em;color:${C.ink}">${text}</div>`;
  // A Namespace: its border, its NAMESPACE label and name at the top left (headTop px under its top edge, INSET px
  // from its left edge), and its verdict tag on the right of the heading (box.verdict, hidden)
  function makeNamespaceBox(root, box, name) {
    // offsets from inside the 1.5 px border, so its text rests on whole pixels
    const top = box.headTop - 1.5;
    const e = E(root,
      `<div style="position:absolute;left:${INSET - 1.5}px;top:${top}px">`
      + `<div class="mono" style="font-size:${NS_HEAD.label}px;line-height:${NS_HEAD.labelLine}px;letter-spacing:.14em;`
      + `color:${C.slate}">NAMESPACE</div>`
      + `<div class="mono" style="font-size:${NS_HEAD.name}px;line-height:${NS_HEAD.nameLine}px">${name}</div></div>`,
      '', { width: box.w + 'px', height: box.h + 'px', border: `1.5px solid ${C.line}`, borderRadius: 'var(--r)' });
    e.verdict = statusTag(e, { font: VERDICT.font, icon: VERDICT.font });
    Object.assign(e.verdict.style, {
      left: 'auto', right: INSET - 1.5 + 'px', top: top + NS_HEAD.h / 2 - VERDICT.h / 2 + 'px',
      height: VERDICT.h + 'px', transformOrigin: 'right center',
    });
    return e;
  }
  // A tile of the box's size: its heading, then its rows, a key over a value, centered in the room under it
  function makeInfoTile(root, box, heading, rows) {
    const rowH = ROW.keyLine + ROW.valueLine;
    const headBottom = TILE.headTop + HEAD.line;
    const block = rows.length * rowH + (rows.length - 1) * ROW.gap;
    const rowsTop = Math.round(headBottom + (box.h - headBottom - block) / 2);
    const rowsHtml = rows.map(([key, value], i) => `<div style="position:absolute;left:${TILE.inset - 1.5}px;`
      + `top:${rowsTop + i * (rowH + ROW.gap) - 1.5}px">`
      + `<div class="mono" style="font-size:${ROW.key}px;line-height:${ROW.keyLine}px;color:${C.slate}">${key}</div>`
      + `<div class="mono" style="font-size:${ROW.value}px;line-height:${ROW.valueLine}px">${value}</div></div>`)
      .join('');
    return E(root,
      headHtml(heading, `position:absolute;left:${TILE.inset - 1.5}px;top:${TILE.headTop - 1.5}px;`) + rowsHtml,
      'tile', { width: box.w + 'px', height: box.h + 'px', textAlign: 'left' });
  }
  // The fraud Task Queue: its heading on the left, its name on the right, on one line
  const makeQueueTile = root => E(root,
    headHtml('TASK QUEUE') + `<div class="mono" style="font-size:${ROW.value}px">fraud-tq</div>`,
    'tile', {
      width: QUEUE.w + 'px', height: QUEUE.h + 'px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: `0 ${TILE.inset}px`,
    });
  // A tile of the gate, of height h: its icon, its heading and what it holds (html), stacked and centered, in the
  // gate's violet
  const makeGateTile = (root, h, icon, heading, html) => E(root,
    ICON(icon, STACK.icon, C.violet, 1.8)
    + headHtml(heading, `margin-top:${STACK.iconGap}px;padding-left:.1em;`)
    + `<div style="margin-top:${STACK.gap}px">${html}</div>`,
    'tile', {
      width: GATE.w + 'px', height: h + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', borderColor: C.violet, background: 'var(--violet-solid)',
    });
  // The gate's top tile: the Endpoint's kind and its name
  const makeEndpointBlock = root => makeGateTile(root, GATE.top.h, 'gateway', 'NEXUS ENDPOINT',
    `<div class="mono" style="font-size:${ROW.value}px;line-height:${ROW.valueLine}px">fraud-screening</div>`);
  // The gate's bottom tile: ALLOWLIST and its one row, payments (block.row, its check block.check)
  function makeAllowlistBlock(root) {
    const block = makeGateTile(root, GATE.bottom.h, 'shield', 'ALLOWLIST',
      `<div class="row" style="width:${ALLOW_ROW.w}px;height:${ALLOW_ROW.h}px;display:flex;align-items:center;`
      + 'justify-content:center;gap:8px;border:1.5px solid;border-radius:var(--rs);'
      + `background:${C.bg}"><span class="check">${ICON('check', 18, C.slate, 2.6)}</span>`
      + `<span class="mono" style="font-size:${ROW.value}px">payments</span></div>`);
    block.row = block.querySelector('.row');
    block.check = block.querySelector('.check svg');
    return block;
  }
  // The veil over fraud's inside, within its border: a frosted, hatched pane, an eye struck through and what is not
  // exposed to callers. update() wipes it in from the gate's side.
  const makeVeil = root => E(root,
    ICON('eyeOff', 44, C.slate, 1.8)
    + '<div class="lbl" style="margin-top:16px;font-size:18px;line-height:24px;color:var(--ink)">'
    + 'Not exposed to callers</div>'
    + `<div style="margin-top:8px;font-size:18px;line-height:26px;color:${C.slate}">`
    + 'Namespace, Task Queue, implementation</div>',
    '', {
      width: FRAUD.w - 3 + 'px', height: FRAUD.h - 3 + 'px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', borderRadius: 'calc(var(--r) - 1.5px)',
      background: `repeating-linear-gradient(135deg, rgba(${RGB.ink},.05) 0 2px, rgba(${RGB.ink},0) 2px 14px), `
        + '#1A1B2C',
    });
  // The sealed result: a small card in the payload card's look, RESULT and one field in ciphertext, its padlock shut
  // on its top edge
  function makeSealedResult(root) {
    const { w, h, badge, lock } = RESULT;
    const card = E(root,
      `<div class="mono" style="font-size:14px;line-height:18px;letter-spacing:.14em;color:${C.slate};`
      + 'margin-bottom:10px">RESULT</div>'
      + `<div class="mono" style="font-size:14px;line-height:18px;color:${C.slate}">${RESULT.key}</div>`
      + `<div class="mono" style="font-size:19px;line-height:26px;white-space:pre">`
      + `${scrambledHtml(RESULT.row, RESULT.value, 1)}</div>`,
      'tile', { width: w + 'px', height: h + 'px', textAlign: 'left', padding: '16px 20px' });
    // centered on the card's top edge, offsets from inside its 1.5 px border
    const lockBadge = E(card, '', '', {
      left: (w - badge) / 2 - 1.5 + 'px', top: -badge / 2 - 1.5 + 'px', width: badge + 'px', height: badge + 'px',
      borderRadius: '50%', background: C.bg, border: `1.5px solid ${C.neon}`, opacity: 1,
    });
    const padlock = makeLock(lockBadge, lock, 1.9, {
      left: (badge - lock) / 2 - 1.5 + 'px', top: (badge - lock) / 2 - 1.5 + 'px', opacity: 1,
    });
    setLock(padlock, 1);
    return card;
  }
  // Pops a Namespace's verdict in at `at`: its label and kind ('alarm', the theme's red verdict, or 'ok')
  function popVerdict(box, t, label, kind, at) {
    if (kind === 'alarm') setAlarmTag(box.verdict, label);
    else setStatus(box.verdict, label, kind);
    const pop = popIn(t, at);
    box.verdict.style.opacity = pop.o;
    box.verdict.style.transform = `scale(${pop.s})`;
  }
  // The center of a box given by its left, top and size
  const center = box => [box.x + box.w / 2, box.y + box.h / 2];

  scene({
    chapter: 9, title: 'Across Namespaces with Nexus',
    subs: [
      {
        text: "With <b>Temporal Nexus</b>, your Workflow can call another team's service, across Namespaces, "
          + 'through an <b>Endpoint</b>.',
        // the call line reaches the gate at c[0] + 6.0: the setting then holds before the calls
        after: 0.4,
      },
      {
        text: 'The Endpoint lets in only the Namespaces on its <b>allowlist</b>, and callers never need to know '
          + 'what is behind it.',
      },
      {
        text: 'Calls between Namespaces travel over <b>mTLS</b>, and your Data Converter still encrypts the payloads.',
        // the result lands at c[2] + 6.2: it then holds about 1.4 s before the fade
        after: 1.0,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.zone = makeCloudZone(root);
      Object.assign(s.zone.style, { width: ZONE.w + 'px', height: ZONE.h + 'px' });
      // payments, the caller's Namespace, in violet
      s.payments = makeNamespaceBox(root, PAYMENTS, 'payments');
      Object.assign(s.payments.style, { borderColor: C.violet, background: `rgba(${RGB.violet},.08)` });
      balanceTagLabel(s.payments.verdict, 'ok');
      s.analytics = makeNamespaceBox(root, ANALYTICS, 'analytics');
      balanceTagLabel(s.analytics.verdict, 'alarm');
      s.fraud = makeNamespaceBox(root, FRAUD, 'fraud');
      s.endpoint = makeEndpointBlock(root);
      s.allowlist = makeAllowlistBlock(root);

      // the calls, under the tiles and the tube
      s.svg = svgLayer(root);
      s.call = path(s.svg, CALL_D, C.slate, 2.5, false);
      s.deny = path(s.svg, DENY_D, C.slate, 2.5, false);
      s.workflow = makeInfoTile(root, WORKFLOW, 'WORKFLOW', WORKFLOW_ROWS);
      s.handler = makeInfoTile(root, HANDLER, 'HANDLER', HANDLER_ROWS);
      s.queue = makeQueueTile(root);

      s.tube = makeTube(root, NEXUS_TUBE);
      // its label names mTLS, cased as written (a pill sets its text in capitals), in a big pill: chapter 2's TLS
      // label at its zoom
      s.tube.label.classList.add('big');
      s.tube.label.innerHTML = `${ICON('lock', 24, C.neon, 2)}mTLS`;
      Object.assign(s.tube.label.style, { width: TUBE_LABEL.w + 'px', textTransform: 'none' });
      s.card = makePayload(root, { w: CARD.w });
      s.result = makeSealedResult(root);
      // over the tube's end and the cards, which go behind it
      s.veil = makeVeil(root);

      // the gate's line, over the calls' ends: drawn down from the Endpoint's tile to the allowlist's, as chapter 4's
      // Data Converter gate, and lifted back up to open the gate
      s.bar = E(root, '', '', {
        width: GATE.bar + 'px', height: GATE.open.bottom - GATE.open.top + 'px', transformOrigin: 'center top',
      });
      s.denySpark = makeSpark(root, 12, RGB.ink);
      s.callSpark = makeSpark(root, 12, RGB.ink);
      s.redRipples = makeRipples(root, 2, RGB.red);
      s.allowRipples = makeRipples(root, 2, RGB.neon);
      s.landing = makeRipples(root, 2, RGB.violet);
      // the flash covers the stage, outside the camera
      s.flash = makeFlash(stage);
    },
    update(t, c, s) {
      const hitAt = c[1] + T1.deny + T1.denyD;
      const allowAt = c[1] + T1.allow + T1.allowD;

      // the camera holds; the analytics call's hit shakes it. The engine's zoom-through in and out.
      const [shakeX, shakeY] = shake(t, hitAt, 10, 0.4);
      setCamera(s.cam, t, this.dur, { dx: shakeX, dy: shakeY });
      placeFlash(s.flash, t, hitAt, 0.3);

      // the zone and the Namespaces; payments, the caller's, glows violet; all three light up as the subtitle says
      // "across Namespaces"
      place(s.zone, ...center(ZONE), 1, 1);
      const across = Math.max(0, 1 - Math.abs(t - c[0] - T0.across - 0.15) / 0.4);
      [[s.payments, PAYMENTS], [s.analytics, ANALYTICS], [s.fraud, FRAUD]].forEach(([box, rect]) => {
        place(box, ...center(rect), swell(t, c[0] + T0.across, 0.015), 1);
        const mine = box === s.payments;
        box.style.boxShadow = glowShadow(RGB.violet, Math.max(mine ? 0.5 : 0, across), { blur: 36, alpha: 0.4 });
      });
      s.analytics.style.borderColor = t >= hitAt ? C.red : C.line;

      // the transfer Workflow, then the fraud team's handler and its Task Queue
      const workflowPop = backPop(t, c[0] + T0.workflow);
      place(s.workflow, ...center(WORKFLOW), workflowPop.s, workflowPop.o);
      const handlerPop = backPop(t, c[0] + T0.handler);
      place(s.handler, ...center(HANDLER), handlerPop.s, handlerPop.o);
      const queuePop = backPop(t, c[0] + T0.handler + 0.12);
      place(s.queue, ...center(QUEUE), queuePop.s, queuePop.o);

      // the Endpoint rises between the Namespaces, its line draws down to close the opening, and the call line draws
      // to it
      const gate = P(t, c[0] + T0.gate, 0.5);
      rise(s.endpoint, GATE.x, GATE.top.y + GATE.top.h / 2, gate);
      rise(s.allowlist, GATE.x, GATE.bottom.y + GATE.bottom.h / 2, P(t, c[0] + T0.gate + 0.1, 0.5));
      const pass = P(t, c[1] + T1.pass, T1.passD, linear);
      const toGate = P(t, c[0] + T0.call, T0.callD, linear);
      const tubeAt = c[2] + T2.tube;
      draw(s.call, lerp(toGate * CALL_TO_GATE, 1, pass), 1 - P(t, tubeAt, T2.tubeD));

      // The dramatic beat: the analytics call races to the gate and slams into its line, which flashes red (a flash, a
      // shake, red rings): NOT ON ALLOWLIST
      const deny = P(t, c[1] + T1.deny, T1.denyD, easeIn);
      draw(s.deny, deny, 0.8 * (1 - P(t, hitAt, 0.3)));
      sparkOnPath(s.denySpark, s.deny, deny);
      placeRipples(s.redRipples, t, hitAt, HIT.x, HIT.y, 40, 200, { d: 0.8, step: 0.15 });
      popVerdict(s.analytics, t, 'NOT ON ALLOWLIST', 'alarm', hitAt + 0.1);
      const red = t >= hitAt && t < hitAt + 0.7;
      s.allowlist.style.borderColor = red ? C.red : C.violet;

      // the payments call reaches the gate: its row on the allowlist lights up, ALLOWED, the line lifts and the call
      // goes on to the handler
      const allow = P(t, c[1] + T1.allow, T1.allowD, linear);
      sparkOnPath(s.callSpark, s.call, t < allowAt ? CALL_TO_GATE * allow : lerp(CALL_TO_GATE, 1, pass));
      const listed = t >= allowAt;
      s.allowlist.row.style.borderColor = listed ? C.neon : C.lineLight;
      s.allowlist.check.setAttribute('stroke', listed ? C.neon : C.slate);
      s.allowlist.row.style.boxShadow = glowShadow(RGB.neon, listed ? 0.5 : 0, { blur: 16, alpha: 0.5 });
      placeRipples(s.allowRipples, t, allowAt, GATE.x, ALLOW_ROW_Y, 60, 240,
        { d: 0.6, step: 0.14 });
      popVerdict(s.payments, t, 'ALLOWED', 'ok', c[1] + T1.allowed);
      const opened = P(t, c[1] + T1.open, 0.3);
      const barShown = P(t, c[0] + T0.bar, T0.barD) * (1 - opened);
      place(s.bar, GATE.x, (GATE.open.top + GATE.open.bottom) / 2, 1, barShown > 0 ? 1 : 0);
      s.bar.style.transform += ` scaleY(${barShown.toFixed(3)})`;
      s.bar.style.background = red ? C.red : C.violet;
      s.bar.style.boxShadow = glowShadow(RGB.red, red ? 1 : 0, { blur: 18, alpha: 0.8 });

      // what is behind the Endpoint is not exposed to callers: a veil wipes over fraud from the gate's side
      const veil = P(t, c[1] + T1.veil, T1.veilD);
      place(s.veil, ...center(FRAUD), 1, veil > 0 ? 1 : 0);
      s.veil.style.clipPath = `inset(0 ${((1 - veil) * 100).toFixed(3)}% 0 0)`;
      [...s.veil.children].forEach(child => {
        child.style.opacity = P(t, c[1] + T1.caption, 0.3);
      });

      // the calls between the Namespaces travel in an mTLS tube
      const labelPop = popIn(t, c[2] + T2.label);
      placeTube(s.tube, NEXUS_TUBE, { drawn: P(t, tubeAt, T2.tubeD, linear), label: labelPop.o, labelS: labelPop.s });

      // the payload card comes out of the transfer Workflow already sealed by the caller's Data Converter, in its
      // Worker, and rides behind the veil
      const cardPop = backPop(t, c[2] + T2.card);
      const ride = P(t, c[2] + T2.ride, T2.rideD);
      setPayload(s.card, { seal: 1, scramble: 1 });
      const cardX = lerp(CARD_AT.x, CARD_AT.hiddenX, ride);
      place(s.card, cardX, CALL_Y, cardPop.s, ride < 1 ? cardPop.o : 0);

      // the handler's result comes back sealed too, out from behind the veil into payments
      const back = P(t, c[2] + T2.back, T2.backD);
      const landAt = c[2] + T2.back + T2.backD;
      place(s.result, lerp(CARD_AT.hiddenX, CARD_AT.x, back), RESULT.y, 1, back > 0 ? 1 : 0);
      placeRipples(s.landing, t, landAt, CARD_AT.x, RESULT.y, RESULT.w, 240, { d: 0.6, step: 0.14 });
    }
  });
}
