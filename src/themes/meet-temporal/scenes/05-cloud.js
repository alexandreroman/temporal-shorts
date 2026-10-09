// ===================== 5. HOW TEMPORAL CLOUD WORKS
// The block keeps every name declared in this file local to this scene.
{
  // Two zones side by side, both there from the start, as in Temporal's deck: on the left your environment, where
  // your Workers run your Workflow and Activity code, its data going out through a Data Converter; on the right
  // Temporal Cloud, with no application code, which orchestrates the Workflow and Activity tasks and persists their
  // history, encrypted. Stage pixels: the zones share their top and bottom (y 150 to 880) and span x 140 to 1780
  const YOURS = { x: 426, y: 515, w: 572, h: 730 };
  const CLOUD = { x: 1350, y: 515, w: 860, h: 730 };
  // the Workers, 32 px inside your zone, under its label, 20 px apart; their code in a card 16 px inside each one
  const WORKER = { x: 352, w: 360, h: 180, top: 214, gap: 20 };
  const workerY = k => WORKER.top + WORKER.h / 2 + k * (WORKER.h + WORKER.gap);
  const CODE = { top: 60, h: 98, inset: 16, line: 28 };
  const WORKERS = [
    ['workflow order(o)', '  await chargeCard(o)', '  await shipPackage(o)'],
    ['activity chargeCard(o)', '  return charge(o.card)'],
    ['activity shipPackage(o)', '  return ship(o.address)'],
  ];
  // the Data Converter, between the Workers and your zone's edge, where all data leaves and comes back
  const CONV = { x: 628, y: 515, w: 104, h: 180 };
  // the connection: from the Data Converter out to a connector dot on Temporal Cloud's edge
  const DOT = { x: CLOUD.x - CLOUD.w / 2, y: CONV.y, size: 18 };
  // the connection's labels, centered between your zone's edge and Temporal Cloud's
  const LINE_X = (YOURS.x + YOURS.w / 2 + DOT.x) / 2;
  // Inside Temporal Cloud, 24 px from its sides under its logo: ORCHESTRATION, its task queue (four task slots),
  // then PERSISTENCE, its history rows 16 px apart, each with an encrypted payload; 24 px between the two blocks
  const BLOCK = { x: CLOUD.x, w: CLOUD.w - 48 };
  const ORCH = { top: 228, h: 200 };
  const PERS = { top: ORCH.top + ORCH.h + 24, h: 346 };
  const LANE = { left: 20, top: 64, w: BLOCK.w - 40, h: 112 };
  const TASK = { w: 172, h: 44, gap: 12 };
  const TASK_Y = ORCH.top + LANE.top + 64;
  const slotX = i => BLOCK.x - BLOCK.w / 2 + LANE.left + (LANE.w - 4 * TASK.w - 3 * TASK.gap) / 2 + TASK.w / 2
    + i * (TASK.w + TASK.gap);
  const ROW = { top: 66, h: 52, gap: 16 };
  const rowY = i => PERS.top + ROW.top + ROW.h / 2 + i * (ROW.h + ROW.gap);
  const PAYLOAD_X = BLOCK.x + BLOCK.w / 2 - 24 - 16 - 95; // the middle of a row's payload chip (190 px wide)
  // the tasks, in queue order, the Worker each goes to, and the history row its result writes
  const TASKS = [['OrderWorkflow', 0], ['chargeCard', 1], ['shipPackage', 2], ['OrderWorkflow', 0]];
  const HISTORY = [['OrderWorkflow · started', '4be1…07da'], ['chargeCard · completed', '9f3a…c21e'],
    ['shipPackage · completed', '2d7c…a913'], ['OrderWorkflow · completed', '71b0…e5f4']];
  // a task's trip: it slides to the front of the queue, flies to the connector dot, then along the connection
  // and the wire to its Worker; the Worker runs it, and its result goes back the other way into its history row
  const TRIP = { slide: 0.4, toDot: 0.3, route: 1.0, run: 1.1, back: 0.9, toRow: 0.4 };
  const resultAt = d => d + TRIP.slide + TRIP.toDot + TRIP.route + TRIP.run;
  const landAt = d => resultAt(d) + TRIP.back + TRIP.toRow;
  // the payload of the close-up, in clear, then encrypted
  const SECRET = 'card: $42';
  const HEX = '0123456789abcdef';
  // text with its first n characters swapped for hex digits picked by a hash of frame: encrypted data
  const scrambleHex = (text, n, frame) => [...text].map((ch, i) => (i < n && ch !== ' '
    ? HEX[Math.floor(hash(i * 31 + frame) * HEX.length)] : ch)).join('');

  // Temporal Cloud's title: the official lockup, 34 px high, then "Cloud" in the brand font and the wordmark's
  // color, its capitals as tall as the wordmark's and on its baseline. The lockup's viewBox is 1570x410 units: the
  // wordmark's capitals run from y 519 to its baseline at y 684.7, 805 being the image's bottom; Instrument Sans
  // capitals are 0.72 em tall. gap: a word space (0.2 em of that font) after the wordmark's last letter, which ends
  // at the image's right edge
  const CLOUD_UNIT = 34 / 410;
  const CLOUD_TITLE = {
    rise: Math.round((805 - 684.7) * CLOUD_UNIT), font: +((684.7 - 519) * CLOUD_UNIT / 0.72).toFixed(2),
  };
  CLOUD_TITLE.gap = Math.round(0.2 * CLOUD_TITLE.font);
  // A zone with a label at its top left (yours) or the title Temporal Cloud (Temporal's), and a caption at its
  // bottom
  function makeZone(root, zone, caption, mine) {
    const head = mine
      ? '<div class="lbl" style="position:absolute;left:24px;top:20px;padding-left:0;font-size:18px">'
        + 'Your environment</div>'
      : '<div style="position:absolute;left:24px;top:20px;height:34px;line-height:0;white-space:nowrap">'
        + `<img src="${LOGO}" style="height:34px;vertical-align:-${CLOUD_TITLE.rise}px">`
        + `<span style="font-size:${CLOUD_TITLE.font}px;margin-left:${CLOUD_TITLE.gap}px;color:#F2F2F2">Cloud</span>`
        + '</div>';
    const look = mine
      ? { border: '2px dashed ' + C.slate, background: 'rgba(148,163,184,.04)', borderRadius: 'var(--r)' }
      : { borderColor: C.uv, background: '#17182A' };
    const e = E(root, head
      + '<div class="cap lbl" style="position:absolute;left:0;right:0;bottom:24px;text-align:center;font-size:18px;'
      + `color:var(--ink)">${caption}</div>`, mine ? '' : 'tile',
    { width: zone.w + 'px', height: zone.h + 'px', ...look });
    e.cap = e.querySelector('.cap');
    return e;
  }
  // A Worker: an app panel with its code in a card, its keywords in violet
  function makeWorker(root, k, lines) {
    const w = makeAppPanel(root, `WORKER ${k + 1}`, WORKER.w, WORKER.h, { font: 19, statusFont: 15, statusTop: 23 });
    const keyword = /^(\s*)(workflow|activity|await|return)/;
    const code = lines.map(line => '<div style="white-space:pre">'
      + `${line.replace(keyword, `$1<span style="color:${C.violet}">$2</span>`)}</div>`).join('');
    w.insertAdjacentHTML('beforeend',
      `<div class="code mono" style="position:absolute;left:${CODE.inset}px;right:${CODE.inset}px;top:${CODE.top}px;`
      + `height:${CODE.h}px;padding:7px 14px;font-size:19px;line-height:${CODE.line}px;`
      + `background:rgba(248,250,252,.03);border:1.5px solid ${C.line};border-radius:var(--rs)">${code}</div>`);
    w.code = w.querySelector('.code');
    return w;
  }
  // The Data Converter: a lock (its shackle its own path, so it can open and snap shut) over its name, then a key:
  // the encryption keys are yours
  function makeConverter(root) {
    const e = E(root,
      `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="${C.neon}" stroke-width="2"`
      + ' stroke-linecap="square" style="display:block;overflow:visible"><rect x="5" y="11" width="14" height="10"/>'
      + '<path d="M12 15v2"/><path class="shackle" d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
      + '<div style="margin-top:10px;line-height:18px">Data<br>converter</div>'
      + `<div style="margin-top:14px;flex:none">${ICON('key', 18, C.neon, 1.8)}</div>`
      + `<div style="margin-top:6px;font-size:12px;line-height:16px;color:${C.neon}">Your keys</div>`,
      'mono', {
        width: CONV.w + 'px', height: CONV.h + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', fontSize: '14px', letterSpacing: '.08em', paddingLeft: '.08em',
        textTransform: 'uppercase', textAlign: 'center', background: '#1E2418', border: '1.5px solid ' + C.neon,
        borderRadius: 'var(--rs)',
      });
    e.shackle = e.querySelector('.shackle');
    return e;
  }
  // A block of Temporal Cloud: its label (an icon and a name) at its top left
  const makeBlock = (root, icon, name, h) => E(root, panelLabel(icon, name, 'left:22px;top:20px'), 'tile', {
    width: BLOCK.w + 'px', height: h + 'px', textAlign: 'left', background: 'rgba(68,76,231,.12)',
    borderColor: 'rgba(68,76,231,.6)',
  });
  // A history row: its number, its event and its payload, encrypted
  function makeRow(root, i, [event, payload]) {
    const e = E(root,
      `<span style="color:#6B7385;display:inline-block;width:34px">${i + 1}</span><span style="flex:1">${event}</span>`
      + '<span class="pl" style="display:flex;align-items:center;justify-content:center;gap:8px;width:190px;'
      + 'height:34px;'
      + `background:rgba(182,100,255,.16);color:${C.violet};border-radius:var(--rs);font-size:16px">`
      + `${ICON('lock', 16, C.violet, 2)}${payload}</span>`,
      'mono', {
        width: (BLOCK.w - 48) + 'px', height: ROW.h + 'px', display: 'flex', alignItems: 'center',
        padding: '0 16px 0 18px', fontSize: '20px', whiteSpace: 'nowrap', background: 'rgba(248,250,252,.03)',
        border: '1.5px solid ' + C.line, borderRadius: 'var(--rs)',
      });
    e.pl = e.querySelector('.pl');
    return e;
  }

  scene({
    chapter: 5, title: 'How Temporal Cloud works',
    holdBeforeEnd: CAMERA_EXIT, // presenter mode holds before the exit zoom
    subs: [
      {
        text: "With Temporal Cloud, your Workers run your Workflow and Activity code in your own environment.",
        after: 0.4,
      },
      // the first task runs and its result is persisted, the second reaches its Worker
      { text: "Temporal Cloud orchestrates your Workflows and Activities, and persists their history.", after: 1.4 },
      // the close-up of the second task's result, then the last two tasks run and persist
      {
        text: "Data is encrypted with your own keys before it leaves your environment: "
          + "Temporal never sees your payloads.",
        after: 5.4,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.yours = makeZone(root, YOURS, 'Your code runs here', true);
      s.cloud = makeZone(root, CLOUD, 'Only Workflow & Activity data, never your code', false);
      s.workers = WORKERS.map((lines, k) => makeWorker(root, k, lines));
      s.conv = makeConverter(root);
      s.orch = makeBlock(root, 'clock', 'Orchestration · tasks', ORCH.h);
      s.orch.insertAdjacentHTML('beforeend', `<div class="lbl" style="position:absolute;left:${LANE.left}px;`
        + `top:${LANE.top}px;width:${LANE.w}px;height:${LANE.h}px;border:1.5px dashed rgba(148,163,184,.5);`
        + 'border-radius:var(--rs);font-size:13px;padding:12px 0 0 16px;text-align:left">Task queue</div>');
      s.pers = makeBlock(root, 'book', 'Persistence · encrypted', PERS.h);
      s.never = statusTag(s.pers);
      Object.assign(s.never.style, { left: 'auto', right: '20px', top: '18px', transformOrigin: 'right center' });
      s.rows = HISTORY.map((row, i) => makeRow(root, i, row));
      s.svg = svgLayer(root);
      // the wires from each Worker to the Data Converter, the connection out, and the routes the data takes: from
      // a Worker's edge, through the converter, to the connector dot
      const wire = k => `M ${WORKER.x + WORKER.w / 2} ${workerY(k)} C ${WORKER.x + WORKER.w / 2 + 30} ${workerY(k)},`
        + ` ${CONV.x - CONV.w / 2 - 30} ${CONV.y}, ${CONV.x - CONV.w / 2} ${CONV.y}`;
      s.wires = WORKERS.map((_, k) => path(s.svg, wire(k), C.slate, 2, false));
      s.line = path(s.svg, `M ${CONV.x + CONV.w / 2} ${CONV.y} L ${DOT.x - DOT.size / 2 - 8} ${DOT.y}`, C.ink, 3);
      s.routes = WORKERS.map((_, k) => path(s.svg, `${wire(k)} L ${DOT.x} ${DOT.y}`, 'none', 1, false));
      s.dot = E(root, '', '', {
        width: DOT.size + 'px', height: DOT.size + 'px', borderRadius: '50%', background: '#17182A',
        border: '3px solid ' + C.ink,
      });
      s.outbound = E(root, 'Outbound only', 'lbl', { color: 'var(--ink)', fontSize: '16px' });
      s.mtls = E(root, 'mTLS<br>or PrivateLink', 'lbl', { fontSize: '14px', textAlign: 'center', lineHeight: '22px' });
      s.tasks = TASKS.map(([name]) => E(root, name, 'mono', {
        width: TASK.w + 'px', height: TASK.h + 'px', lineHeight: (TASK.h - 3) + 'px', textAlign: 'center',
        fontSize: '18px', background: 'rgba(68,76,231,.35)', border: '1.5px solid ' + C.uv, borderRadius: 'var(--rs)',
      }));
      s.polls = WORKERS.map(() => makeSpark(root, 12, '182,100,255'));
      s.results = TASKS.map(() => makeSpark(root, 14, '219,255,75'));
      // the close-up: one result, in clear, then encrypted
      s.secret = E(root, SECRET, 'mono', {
        fontSize: '20px', padding: '6px 14px', background: C.uvTint, color: '#141414', borderRadius: 'var(--rs)',
        whiteSpace: 'nowrap',
      });
      // the Data Converter on top of all the data that goes through it, so its lock shows as it snaps shut
      root.appendChild(s.conv);
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      const routePoint = (k, p) => s.routes[k].getPointAtLength(s.routes[k]._L * clamp(p));

      // c[0]: both zones, your Workers and their code, the Data Converter and the connection out; each Worker
      // polls Temporal Cloud; the captions: your code runs here, none on Temporal's side
      rise(s.yours, YOURS.x, YOURS.y, P(t, c[0] + 0.2, 0.6));
      rise(s.cloud, CLOUD.x, CLOUD.y, P(t, c[0] + 0.5, 0.6));
      const pollAt = k => c[0] + 3.0 + k * 0.35;
      s.workers.forEach((w, k) => rise(w, WORKER.x, workerY(k), P(t, c[0] + 0.8 + k * 0.2, 0.5), 16));
      rise(s.conv, CONV.x, CONV.y, P(t, c[0] + 1.6, 0.5), 12);
      s.wires.forEach((wire, k) => draw(wire, P(t, c[0] + 1.6 + k * 0.1, 0.4), 0.8));
      draw(s.line, P(t, c[0] + 1.9, 0.6));
      place(s.dot, DOT.x, DOT.y, P(t, c[0] + 2.3, 0.3, backOut), P(t, c[0] + 2.3, 0.2));
      // the labels clear of the payload that crosses on the connection in the close-up
      place(s.outbound, LINE_X, CONV.y - 46, 1, P(t, c[0] + 2.6, 0.4));
      place(s.mtls, LINE_X, CONV.y + 58, 1, P(t, c[0] + 2.8, 0.4));
      s.polls.forEach((e, k) => {
        const p = P(t, pollAt(k), 0.9, x => x);
        if (p <= 0 || p >= 1) {
          place(e, 0, 0, 1, 0);
          return;
        }
        const pt = routePoint(k, p);
        place(e, pt.x, pt.y, 1, Math.min(1, p * 6, (1 - p) * 6));
      });
      s.yours.cap.style.opacity = P(t, c[0] + 3.8, 0.4);
      s.cloud.cap.style.opacity = P(t, c[0] + 4.4, 0.4);
      s.yours.cap.style.transform = `scale(${swell(t, c[0] + 3.9, 0.08)})`;
      s.cloud.cap.style.transform = `scale(${swell(t, c[0] + 4.5, 0.08)})`;

      // c[1]: each task is dispatched to its Worker, which runs it, and its result is persisted in a history row.
      // The second task's result is the close-up of c[2]; the last two run after it
      // the two functions are there with the zone, the queue holding its tasks, the history empty; each poll
      // lights the orchestration block as it arrives
      rise(s.orch, BLOCK.x, ORCH.top + ORCH.h / 2, P(t, c[0] + 0.9, 0.5), 16);
      rise(s.pers, BLOCK.x, PERS.top + PERS.h / 2, P(t, c[0] + 1.1, 0.5), 16);
      const polled = Math.max(0, ...WORKERS.map((_, k) => win(t, pollAt(k) + 0.85, pollAt(k) + 1.25, 0.1)));
      s.orch.style.borderColor = polled > 0.5 ? C.violet : 'rgba(68,76,231,.6)';
      const dispatch = [c[1] + 1.0, c[1] + 4.0, c[2] + 5.6, c[2] + 7.2];
      const queuedAt = i => c[0] + 1.5 + i * 0.15;
      // the close-up: the second result leaves its Worker in clear, enters the Data Converter, whose lock opens
      // and snaps shut, then leaves it encrypted, crosses over and lands in its row
      const out = c[2] + 0.8, inConv = c[2] + 2.0, snap = c[2] + 2.4, crossAt = c[2] + 2.7, atDot = c[2] + 3.9;
      const landed = c[2] + 4.5;
      const rowAt = i => (i === 1 ? landed : landAt(dispatch[i]));
      s.tasks.forEach((e, i) => {
        const d = dispatch[i];
        // its queue slot: each task ahead of it, as it is dispatched, moves it one slot forward
        const shift = dispatch.slice(0, i).map(at => P(t, at, TRIP.slide)).reduce((a, b) => a + b, 0);
        const qx = slotX(i - shift);
        const shown = P(t, queuedAt(i), 0.3);
        const toDot = P(t, d + TRIP.slide, TRIP.toDot, ease), along = P(t, d + TRIP.slide + TRIP.toDot, TRIP.route);
        const k = TASKS[i][1];
        let x = qx, y = TASK_Y, k2 = 1;
        if (toDot > 0 && along <= 0) {
          x = lerp(slotX(0), DOT.x, toDot); y = lerp(TASK_Y, DOT.y, toDot); k2 = lerp(1, 0.8, toDot);
        } else if (along > 0) {
          const pt = routePoint(k, 1 - along);
          x = pt.x; y = pt.y; k2 = 0.8;
        }
        const gone = along >= 1 ? 0 : 1;
        place(e, Math.round(x * 100) / 100, Math.round(y * 100) / 100, k2, shown * gone);
      });
      // each Worker runs its tasks: RUNNING, its code lit
      s.workers.forEach((w, k) => {
        // the close-up's Worker keeps running until its result leaves
        const runs = dispatch.map((d, i) => ({ i, at: d + TRIP.slide + TRIP.toDot + TRIP.route }))
          .filter(r => TASKS[r.i][1] === k);
        const running = runs.some(r => t >= r.at && t < (r.i === 1 ? c[2] + 1.2 : r.at + TRIP.run));
        setAppStatus(w, running ? 'RUNNING' : t >= pollAt(k) ? 'POLLING' : '', running ? 'running' : 'idle');
        w.code.style.borderColor = running ? C.violet : C.line;
        w.code.style.background = running ? 'rgba(182,100,255,.16)' : 'rgba(248,250,252,.03)';
      });
      // the results, but the close-up's, run back as sparks, through the Data Converter, into their rows
      s.results.forEach((e, i) => {
        const r = resultAt(dispatch[i]), k = TASKS[i][1];
        const back = P(t, r, TRIP.back, x => x), toRow = P(t, r + TRIP.back, TRIP.toRow);
        if (i === 1 || back <= 0 || toRow >= 1) {
          place(e, 0, 0, 1, 0);
          return;
        }
        if (toRow <= 0) {
          const pt = routePoint(k, back);
          place(e, pt.x, pt.y, 1, Math.min(1, back * 6));
        } else {
          place(e, lerp(DOT.x, PAYLOAD_X, toRow), lerp(DOT.y, rowY(i), toRow), 1, 1 - toRow * 0.5);
        }
      });
      // each row slides in as its result lands, its payload glowing a moment
      s.rows.forEach((e, i) => {
        const rp = P(t, rowAt(i) - 0.05, 0.3);
        place(e, BLOCK.x + Math.round((1 - rp) * 26), rowY(i), 1, rp);
        e.pl.style.boxShadow = win(t, rowAt(i), rowAt(i) + 0.5, 0.15) > 0.5 ? '0 0 16px rgba(182,100,255,.6)' : '';
      });

      // the close-up of c[2]: the rest dims while the payload makes its journey
      const sp = P(t, c[2] + 0.3, 0.4) * (1 - P(t, c[2] + 5.0, 0.4));
      const dim = e => { e.style.opacity = (parseFloat(e.style.opacity || 1) * (1 - 0.6 * sp)).toFixed(3); };
      [s.workers[0], s.workers[2], s.orch, ...s.tasks, s.yours.cap, s.cloud.cap].forEach(dim);
      s.rows.forEach((e, i) => { if (i !== 1) dim(e); });
      // the payload's position: out of its Worker along the wire, through the converter, along the connection to
      // the dot, then into its row, on its row's payload; it passes under the converter, which hides it a moment
      const pop = P(t, out, 0.4, backOut), leave = P(t, out + 0.4, inConv - out - 0.4);
      const inside = P(t, inConv, crossAt - inConv), cross = P(t, crossAt, atDot - crossAt);
      const drop = P(t, atDot, landed - atDot);
      let sx, sy;
      if (t < inConv) {
        const pt = s.wires[1].getPointAtLength(s.wires[1]._L * leave);
        sx = pt.x; sy = pt.y;
      } else if (t < crossAt) {
        sx = lerp(CONV.x - CONV.w / 2, CONV.x + CONV.w / 2, inside); sy = CONV.y;
      } else if (t < atDot) {
        sx = lerp(CONV.x + CONV.w / 2, DOT.x, cross); sy = DOT.y;
      } else {
        sx = lerp(DOT.x, PAYLOAD_X, drop); sy = lerp(DOT.y, rowY(1), drop);
      }
      // encrypted as the lock snaps shut, while the converter hides it
      const encrypted = P(t, snap, 0.25);
      const frame = Math.floor((G - this.start) * 20);
      const text = encrypted > 0 ? scrambleHex(SECRET, Math.round(encrypted * SECRET.length), frame) : SECRET;
      if (s.secret.textContent !== text) s.secret.textContent = text;
      s.secret.style.background = encrypted > 0.5 ? C.violetTint : C.uvTint;
      const k3 = 1.25 * pop * (1 - 0.35 * drop);
      place(s.secret, Math.round(sx), Math.round(sy), k3, clamp(pop * 2) * (1 - P(t, landed - 0.15, 0.2)));
      // the lock opens as the payload arrives, snaps shut on it, and glows each time data goes through
      const open = P(t, inConv - 0.3, 0.2) * (1 - P(t, snap, 0.15, easeIn));
      s.conv.shackle.setAttribute('transform', `translate(0 ${(-4 * open).toFixed(2)})`);
      const through = [...dispatch.map(d => d + TRIP.slide + TRIP.toDot + TRIP.route * 0.3),
        ...dispatch.map(d => resultAt(d) + TRIP.back * 0.55), snap];
      const glow = Math.max(0, ...through.map(at => win(t, at - 0.1, at + 0.3, 0.1)));
      s.conv.style.boxShadow = glow > 0 ? `0 0 ${Math.round(24 * glow)}px rgba(219,255,75,${(0.45 * glow).toFixed(3)})`
        : '';
      // Temporal Cloud never sees your payloads, held
      setStatus(s.never, 'NEVER SEES YOUR PAYLOADS', 'ok');
      const np = popIn(t, c[2] + 5.0);
      s.never.style.opacity = np.o;
      s.never.style.transform = `scale(${np.s})`;
    }
  });
}
