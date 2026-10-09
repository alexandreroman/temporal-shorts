// ===================== 5. HOW TEMPORAL CLOUD WORKS
// The block keeps every name declared in this file local to this scene.
{
  // Two zones side by side, both there from the start, as in Temporal's deck: on the left your environment, where
  // your Workers run your Workflow and Activity code, its data going out through a Data Converter; on the right
  // Temporal Cloud, with no application code, which orchestrates the Workflow and Activity tasks and persists their
  // history, encrypted. Stage pixels: the zones, as wide, share their top and bottom (y 150 to 880) and span x 120
  // to 1800, 200 px apart for the connection and its labels
  const YOURS = { x: 490, y: 515, w: 740, h: 730 };
  const CLOUD = { x: 1430, y: 515, w: 740, h: 730 };
  // the Workers, 32 px inside your zone, spread evenly between its label (bottom at y 195) and its caption (top at
  // y 831): the same gap (21 px) above, between and under them; their code in a card 24 px inside each one, its
  // text 24 px inside the card
  const WORKER = { x: 382, w: 460, h: 184 };
  WORKER.gap = (831 - 195 - 3 * WORKER.h) / 4;
  WORKER.top = 195 + WORKER.gap;
  const workerY = k => WORKER.top + WORKER.h / 2 + k * (WORKER.h + WORKER.gap);
  const CODE = { top: 58, h: 104, inset: 24, line: 28 };
  const WORKERS = [
    ['workflow order(o)', '  await chargeCard(o)', '  await shipPackage(o)'],
    ['activity chargeCard(o)', '  return charge(o.card)'],
    ['activity shipPackage(o)', '  return ship(o.address)'],
  ];
  // the Data Converter, 60 px right of the Workers (the wires' run), level with WORKER 2, where all data leaves and
  // comes back
  const CONV = { x: 732, y: workerY(1), w: 120, h: 180 };
  // the connection: from the Data Converter out to a connector dot on Temporal Cloud's edge
  const DOT = { x: CLOUD.x - CLOUD.w / 2, y: CONV.y, size: 18 };
  // the connection's labels, centered between your zone's edge and Temporal Cloud's
  const LINE_X = (YOURS.x + YOURS.w / 2 + DOT.x) / 2;
  // Inside Temporal Cloud, 24 px from its sides under its logo: ORCHESTRATION, its task queue, which holds one task
  // at a time, then PERSISTENCE, its four history rows 20 px apart, each with an encrypted payload; 24 px between
  // the two blocks, the last one 24 px above the caption's clear space (y 798)
  const BLOCK = { x: CLOUD.x, w: CLOUD.w - 48 };
  const LANE = { left: 20, top: 60, w: BLOCK.w - 40, h: 84 };
  const ORCH = { top: 228, h: LANE.top + LANE.h + 24 };
  const PERS = { top: ORCH.top + ORCH.h + 24 };
  PERS.h = 798 - PERS.top;
  const TASK = { w: 192, h: 48 };
  // the queue's head, in the middle of its lane, where each task waits to be dispatched
  const QUEUE = [BLOCK.x, ORCH.top + LANE.top + LANE.h / 2];
  const ROW = { top: 68, h: 56, gap: 20 };
  const rowY = i => PERS.top + ROW.top + ROW.h / 2 + i * (ROW.h + ROW.gap);
  const PAYLOAD_X = BLOCK.x + BLOCK.w / 2 - 24 - 16 - 105; // the middle of a row's payload chip (210 px wide)
  // The tasks, in the order Temporal queues them, and the Worker each goes to: the Workflow task starts the
  // Workflow, which runs until it awaits chargeCard; the chargeCard task runs; a new Workflow task resumes the
  // Workflow until it awaits shipPackage; the shipPackage task runs; a last Workflow task resumes it to its end
  const TASKS = [['OrderWorkflow', 0], ['chargeCard', 1], ['OrderWorkflow', 0], ['shipPackage', 2],
    ['OrderWorkflow', 0]];
  // the Workflow's requests to schedule its Activities, as it pauses on each await
  const SCHEDULES = ['schedule chargeCard', 'schedule shipPackage'];
  const HISTORY = [['OrderWorkflow · started', '4be1…07da'], ['chargeCard · completed', '9f3a…c21e'],
    ['shipPackage · completed', '2d7c…a913'], ['OrderWorkflow · completed', '71b0…e5f4']];
  // a task's trip, slow enough to follow: it flies from the queue to the connector dot, then along the connection,
  // over the Data Converter and down to its Worker; the Worker runs it a code line (step) at a time; what it sends
  // back (a schedule request or a result) goes the other way, then on to the queue or to its history row
  const TRIP = { toDot: 0.8, route: 1.6, step: 0.9, back: 1.5, toQueue: 0.6, toRow: 0.8 };
  const arriveAt = d => d + TRIP.toDot + TRIP.route;
  // a Worker's edge, where data leaves it and tasks reach it
  const workerEdge = k => [WORKER.x + WORKER.w / 2, workerY(k)];
  // the gate just above the Data Converter, where data passes over it in full view, and the connection's start
  const GATE = [CONV.x, CONV.y - CONV.h / 2 - 34];
  const LINE_START = [CONV.x + CONV.w / 2 + 40, CONV.y];
  // a point at progress f (0 to 1, eased) along straight legs joining points, each leg taking its share of the length
  function pointOnLegs(points, f) {
    const lens = points.slice(1).map((pt, i) => Math.hypot(pt[0] - points[i][0], pt[1] - points[i][1]));
    let d = ease(clamp(f)) * lens.reduce((a, b) => a + b, 0);
    for (let i = 0; i < lens.length; i++) {
      if (d <= lens[i] || i === lens.length - 1) {
        const u = lens[i] ? Math.min(1, d / lens[i]) : 1;
        return [lerp(points[i][0], points[i + 1][0], u), lerp(points[i][1], points[i + 1][1], u)];
      }
      d -= lens[i];
    }
    return points[points.length - 1];
  }
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
    const code = lines.map(line => '<div style="white-space:pre;margin:0 -8px;padding:0 8px;border-radius:4px">'
      + `${line.replace(keyword, `$1<span style="color:${C.violet}">$2</span>`)}</div>`).join('');
    w.insertAdjacentHTML('beforeend',
      `<div class="code mono" style="position:absolute;left:${CODE.inset}px;right:${CODE.inset}px;top:${CODE.top}px;`
      + `height:${CODE.h}px;padding:10px ${CODE.inset - 1.5}px;font-size:19px;line-height:${CODE.line}px;`
      + `background:rgba(248,250,252,.03);border:1.5px solid ${C.line};border-radius:var(--rs)">${code}</div>`);
    w.code = w.querySelector('.code');
    w.lines = [...w.code.children];
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
      + `<div class="key" style="margin-top:14px;flex:none">${ICON('key', 18, C.neon, 1.8)}</div>`
      + `<div style="margin-top:6px;font-size:12px;line-height:16px;color:${C.neon}">Your keys</div>`,
      'mono', {
        width: CONV.w + 'px', height: CONV.h + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', fontSize: '14px', letterSpacing: '.08em', paddingLeft: '.08em',
        textTransform: 'uppercase', textAlign: 'center', background: '#1E2418', border: '1.5px solid ' + C.neon,
        borderRadius: 'var(--rs)',
      });
    e.shackle = e.querySelector('.shackle');
    e.key = e.querySelector('.key');
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
      + '<span class="pl" style="display:flex;align-items:center;justify-content:center;gap:8px;width:210px;'
      + 'height:40px;'
      + `background:rgba(182,100,255,.16);color:${C.violet};border-radius:var(--rs);font-size:18px">`
      + `${ICON('lock', 18, C.violet, 2)}${payload}</span>`,
      'mono', {
        width: (BLOCK.w - 48) + 'px', height: ROW.h + 'px', display: 'flex', alignItems: 'center',
        padding: '0 16px 0 18px', fontSize: '22px', whiteSpace: 'nowrap', background: 'rgba(248,250,252,.03)',
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
        // the three polls, one after the other, then the two captions
        after: 2.9,
      },
      // the first task runs and its result is persisted, then the second reaches its Worker and runs
      { text: "Temporal Cloud orchestrates your Workflows and Activities, and persists their history.", after: 7.6 },
      // the close-up of the second task's result, then the last two tasks run and persist
      {
        text: "Data is encrypted with your own keys before it leaves your environment: "
          + "Temporal never sees your payloads.",
        // the close-up, then the Workflow resumes, schedules shipPackage, which runs, and completes
        after: 24.4,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.yours = makeZone(root, YOURS, 'Your code runs here', true);
      s.cloud = makeZone(root, CLOUD, 'Only Workflow & Activity data, never your code', false);
      s.workers = WORKERS.map((lines, k) => makeWorker(root, k, lines));
      s.conv = makeConverter(root);
      s.orch = makeBlock(root, 'clock', 'Orchestration · task queue', ORCH.h);
      s.orch.insertAdjacentHTML('beforeend', `<div style="position:absolute;left:${LANE.left}px;`
        + `top:${LANE.top}px;width:${LANE.w}px;height:${LANE.h}px;border:1.5px dashed rgba(148,163,184,.5);`
        + 'border-radius:var(--rs)"></div>');
      // its payloads show locked; NEVER SEES YOUR PAYLOADS takes the label row's right
      s.pers = makeBlock(root, 'book', 'Persistence', PERS.h);
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
        // opaque, so nothing it passes over shows through its text
        fontSize: '20px', background: '#2B2F78', border: '1.5px solid ' + C.uv, borderRadius: 'var(--rs)',
      }));
      // the Workflow's schedule requests: violet, opaque, so nothing shows through their text
      s.schedules = SCHEDULES.map(text => E(root, text, 'mono', {
        fontSize: '17px', padding: '8px 14px', background: '#3A2766', color: C.ink,
        border: '1.5px solid ' + C.violet, borderRadius: 'var(--rs)', whiteSpace: 'nowrap',
      }));
      s.polls = WORKERS.map(() => makeSpark(root, 12, '182,100,255'));
      // shipPackage's result and the Workflow's completion, flying back as sparks
      s.results = [0, 1].map(() => makeSpark(root, 14, '219,255,75'));
      // the close-up: one result, in clear, then encrypted
      s.secret = E(root, SECRET, 'mono', {
        fontSize: '20px', padding: '6px 14px', background: C.uvTint, color: '#141414', borderRadius: 'var(--rs)',
        whiteSpace: 'nowrap',
      });
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      const routePoint = (k, p) => s.routes[k].getPointAtLength(s.routes[k]._L * clamp(p));

      // c[0]: both zones, your Workers and their code, the Data Converter and the connection out; each Worker
      // polls Temporal Cloud; the captions: your code runs here, none on Temporal's side
      rise(s.yours, YOURS.x, YOURS.y, P(t, c[0] + 0.2, 0.6));
      rise(s.cloud, CLOUD.x, CLOUD.y, P(t, c[0] + 0.5, 0.6));
      // each Worker polls in turn, a distinct beat each
      const pollAt = k => c[0] + 3.2 + k * 1.4;
      s.workers.forEach((w, k) => rise(w, WORKER.x, workerY(k), P(t, c[0] + 0.8 + k * 0.2, 0.5), 16));
      rise(s.conv, CONV.x, CONV.y, P(t, c[0] + 1.6, 0.5), 12);
      s.wires.forEach((wire, k) => draw(wire, P(t, c[0] + 1.6 + k * 0.1, 0.4), 0.8));
      draw(s.line, P(t, c[0] + 1.9, 0.6));
      place(s.dot, DOT.x, DOT.y, P(t, c[0] + 2.3, 0.3, backOut), P(t, c[0] + 2.3, 0.2));
      // the labels clear of the payload that crosses on the connection in the close-up
      place(s.outbound, LINE_X, CONV.y - 46, 1, P(t, c[0] + 2.6, 0.4));
      place(s.mtls, LINE_X, CONV.y + 58, 1, P(t, c[0] + 2.8, 0.4));
      s.polls.forEach((e, k) => {
        const p = P(t, pollAt(k), 1.2, x => x);
        if (p <= 0 || p >= 1) {
          place(e, 0, 0, 1, 0);
          return;
        }
        const pt = routePoint(k, p);
        place(e, pt.x, pt.y, 1, Math.min(1, p * 6, (1 - p) * 6));
      });
      s.yours.cap.style.opacity = P(t, c[0] + 7.6, 0.4);
      s.cloud.cap.style.opacity = P(t, c[0] + 8.3, 0.4);
      s.yours.cap.style.transform = `scale(${swell(t, c[0] + 7.7, 0.08)})`;
      s.cloud.cap.style.transform = `scale(${swell(t, c[0] + 8.4, 0.08)})`;

      // c[1] on: Temporal orchestrates the Workflow, one task at a time in its queue. Its two blocks are there with
      // the zone, the queue holding the first Workflow task, the history empty; each poll lights the orchestration
      // block as it arrives
      rise(s.orch, BLOCK.x, ORCH.top + ORCH.h / 2, P(t, c[0] + 0.9, 0.5), 16);
      rise(s.pers, BLOCK.x, PERS.top + PERS.h / 2, P(t, c[0] + 1.1, 0.5), 16);
      const polled = Math.max(0, ...WORKERS.map((_, k) => win(t, pollAt(k) + 1.15, pollAt(k) + 1.6, 0.1)));
      s.orch.style.borderColor = polled > 0.5 ? C.violet : 'rgba(68,76,231,.6)';
      // the close-up of c[2], slowly: chargeCard's result comes out of WORKER 2, goes to the Data Converter's gate,
      // just above it, and holds there in clear; the lock opens, the key glows and the lock snaps shut, the text
      // scrambling in place; then it leaves encrypted, crosses over and lands in its row
      const out = c[2] + 0.8, leaveAt = c[2] + 1.2, atGate = c[2] + 2.0, openAt = c[2] + 3.1, snap = c[2] + 3.6;
      const crossAt = c[2] + 4.6, atDot = c[2] + 6.6, landed = c[2] + 7.4;
      // the beats, one after the other: each task is queued (q), dispatched (d) 0.8 s later and reaches its Worker
      // (a); the Workflow pauses on an await (p) and its schedule request travels to the queue, where the Activity
      // task appears; an Activity's result is persisted, and a new Workflow task is queued
      const toQueue = TRIP.back + TRIP.toQueue, toRow = TRIP.back + TRIP.toRow;
      const d0 = c[1] + 0.8, a0 = arriveAt(d0), p0 = a0 + 2 * TRIP.step;
      const q1 = p0 + toQueue, d1 = q1 + 0.8, a1 = arriveAt(d1);
      const q2 = landed + 0.6, d2 = q2 + 0.8, a2 = arriveAt(d2), p2 = a2 + 2 * TRIP.step;
      const q3 = p2 + toQueue, d3 = q3 + 0.8, a3 = arriveAt(d3), r3 = a3 + 2 * TRIP.step;
      const q4 = r3 + toRow + 0.6, d4 = q4 + 0.8, a4 = arriveAt(d4), done = a4 + TRIP.step + 0.3;
      const queued = [c[0] + 1.5, q1, q2, q3, q4], dispatch = [d0, d1, d2, d3, d4];
      const rowAt = [c[1] + 0.3, landed, r3 + toRow, done + toRow];
      // each task waits at the queue's head, then flies out and on to its Worker
      s.tasks.forEach((e, i) => {
        const k = TASKS[i][1], pop = popIn(t, queued[i]);
        const toDot = P(t, dispatch[i], TRIP.toDot, ease), along = P(t, dispatch[i] + TRIP.toDot, TRIP.route);
        let [x, y] = QUEUE, scale = pop.s;
        if (along > 0) {
          // back along the connection, over the Data Converter's gate (never across its box), then to its Worker
          [x, y] = pointOnLegs([[DOT.x, DOT.y], LINE_START, GATE, workerEdge(k)], along);
          scale = 0.8;
        } else if (toDot > 0) {
          x = lerp(QUEUE[0], DOT.x, toDot); y = lerp(QUEUE[1], DOT.y, toDot); scale = lerp(1, 0.8, toDot);
        }
        const o = t < queued[i] || along >= 1 ? 0 : pop.o;
        place(e, Math.round(x * 100) / 100, Math.round(y * 100) / 100, scale, o);
      });
      // the Workflow's schedule requests: out of WORKER 1 as it pauses, from just right of it, over the gate, along
      // the connection, then into the queue, where the Activity task takes their place
      s.schedules.forEach((e, j) => {
        const at = [p0, p2][j];
        const start = [WORKER.x + WORKER.w / 2 + 130, workerY(0)];
        const f = P(t, at, TRIP.back, x => x), g = P(t, at + TRIP.back, TRIP.toQueue, ease);
        let [x, y] = pointOnLegs([start, GATE, LINE_START, [DOT.x, DOT.y]], f);
        if (g > 0) { x = lerp(DOT.x, QUEUE[0], g); y = lerp(DOT.y, QUEUE[1], g); }
        const o = t < at ? 0 : P(t, at, 0.3) * (1 - P(t, at + toQueue - 0.15, 0.2));
        place(e, Math.round(x), Math.round(y), 1, o);
      });
      // The Workers. WORKER 1 runs the Workflow a line at a time: from the top to `await chargeCard`, where it waits;
      // resumed, on to `await shipPackage`, where it waits again; resumed, past the last line: it returns, DONE. The
      // line it waits on stays faintly lit. WORKERs 2 and 3 run their Activity, a line at a time
      const lineOf = (at, first, n) => (t >= at && t < at + n * TRIP.step ? first + Math.floor((t - at) / TRIP.step)
        : -1);
      const w1 = s.workers[0];
      let lit = -1, paused = -1;
      if (t < a0) setAppStatus(w1, t >= pollAt(0) ? 'POLLING' : '', 'idle');
      else if (t < p0) { setAppStatus(w1, 'RUNNING', 'running'); lit = lineOf(a0, 0, 2); }
      else if (t < a2) { setAppStatus(w1, 'WAITING', 'waiting'); paused = 1; }
      else if (t < p2) { setAppStatus(w1, 'RUNNING', 'running'); lit = lineOf(a2, 1, 2); }
      else if (t < a4) { setAppStatus(w1, 'WAITING', 'waiting'); paused = 2; }
      else if (t < done) { setAppStatus(w1, 'RUNNING', 'running'); lit = lineOf(a4, 2, 1); }
      else setAppStatus(w1, 'DONE', 'idle');
      w1.code.style.borderColor = lit >= 0 || (t >= a4 && t < done) ? C.violet : t >= done ? C.neon : C.line;
      w1.lines.forEach((e, j) => {
        e.style.background = j === lit ? 'rgba(182,100,255,.28)' : j === paused ? 'rgba(182,100,255,.12)' : '';
      });
      [[1, a1, leaveAt], [2, a3, r3]].forEach(([k, at, until]) => {
        const w = s.workers[k], running = t >= at && t < until;
        setAppStatus(w, running ? 'RUNNING' : t >= pollAt(k) ? 'POLLING' : '', running ? 'running' : 'idle');
        w.code.style.borderColor = running ? C.violet : C.line;
        const line = running ? Math.min(1, Math.floor((t - at) / TRIP.step)) : -1;
        w.lines.forEach((e, j) => { e.style.background = j === line ? 'rgba(182,100,255,.28)' : ''; });
      });
      // shipPackage's result and the Workflow's completion run back as sparks, over the gate, into their rows
      [[r3, 2, 2], [done, 0, 3]].forEach(([at, k, row], j) => {
        const e = s.results[j];
        const back = P(t, at, TRIP.back, x => x), into = P(t, at + TRIP.back, TRIP.toRow);
        if (back <= 0 || into >= 1) {
          place(e, 0, 0, 1, 0);
          return;
        }
        if (into <= 0) {
          const [x, y] = pointOnLegs([workerEdge(k), GATE, LINE_START, [DOT.x, DOT.y]], back);
          place(e, x, y, 1, Math.min(1, back * 6));
        } else {
          place(e, lerp(DOT.x, PAYLOAD_X, into), lerp(DOT.y, rowY(row), into), 1, 1 - into * 0.5);
        }
      });
      // each row slides in as its result lands (the first as the Workflow starts), its payload glowing a moment
      s.rows.forEach((e, i) => {
        const rp = P(t, rowAt[i] - 0.05, 0.3);
        place(e, BLOCK.x + Math.round((1 - rp) * 26), rowY(i), 1, rp);
        e.pl.style.boxShadow = win(t, rowAt[i], rowAt[i] + 0.5, 0.15) > 0.5 ? '0 0 16px rgba(182,100,255,.6)' : '';
      });

      // the close-up of c[2]: the rest dims while the payload makes its journey
      const sp = P(t, c[2] + 0.3, 0.4) * (1 - P(t, c[2] + 8.3, 0.4));
      const dim = e => { e.style.opacity = (parseFloat(e.style.opacity || 1) * (1 - 0.6 * sp)).toFixed(3); };
      [s.workers[0], s.workers[2], s.orch, ...s.tasks, ...s.schedules, s.yours.cap, s.cloud.cap].forEach(dim);
      s.rows.forEach((e, i) => { if (i !== 1) dim(e); });
      // the payload's position, always on top of what it passes: out of WORKER 2's edge, up to the gate above the
      // Data Converter (the converter's lock and key in full view under it), down to the connection's start, along
      // it to the dot, then onto its row's payload
      const pop = P(t, out, 0.4, backOut);
      const wireStart = [WORKER.x + WORKER.w / 2, workerY(1)];
      const gate = GATE;
      const lineStart = LINE_START;
      const legs = [[leaveAt, wireStart, gate, atGate - leaveAt],
        [crossAt, gate, lineStart, 0.5], [crossAt + 0.5, lineStart, [DOT.x, DOT.y], atDot - crossAt - 0.5],
        [atDot, [DOT.x, DOT.y], [PAYLOAD_X, rowY(1)], landed - atDot]];
      let [sx, sy] = wireStart;
      legs.forEach(([at, from, to, d]) => {
        if (t < at) return;
        const f = ease(P(t, at, d));
        sx = lerp(from[0], to[0], f); sy = lerp(from[1], to[1], f);
      });
      const drop = P(t, atDot, landed - atDot);
      // encrypted at the gate as the lock snaps shut: the text scrambles in place
      const encrypted = P(t, snap, 0.6);
      const frame = Math.floor((G - this.start) * 20);
      const text = encrypted > 0 ? scrambleHex(SECRET, Math.round(encrypted * SECRET.length), frame) : SECRET;
      if (s.secret.textContent !== text) s.secret.textContent = text;
      s.secret.style.background = encrypted > 0.5 ? C.violetTint : C.uvTint;
      const k3 = 1.1 * pop * (1 - 0.2 * drop);
      place(s.secret, Math.round(sx), Math.round(sy), k3, clamp(pop * 2) * (1 - P(t, landed - 0.15, 0.2)));
      // the lock opens as the payload arrives, snaps shut on it, and glows each time data goes through
      const open = P(t, openAt, 0.25) * (1 - P(t, snap, 0.15, easeIn));
      s.conv.shackle.setAttribute('transform', `translate(0 ${(-4 * open).toFixed(2)})`);
      s.conv.key.style.transform = `scale(${swell(t, snap - 0.25, 0.5)})`;
      // (as tasks come in over it, and schedule requests and results go out over it)
      const through = [...dispatch.map(d => d + TRIP.toDot + TRIP.route * 0.55),
        ...[p0, p2, r3, done].map(at => at + TRIP.back * 0.3), snap];
      const glow = Math.max(0, ...through.map(at => win(t, at - 0.1, at + 0.3, 0.1)));
      s.conv.style.boxShadow = glow > 0 ? `0 0 ${Math.round(24 * glow)}px rgba(219,255,75,${(0.45 * glow).toFixed(3)})`
        : '';
      // Temporal Cloud never sees your payloads, held
      setStatus(s.never, 'NEVER SEES YOUR PAYLOADS', 'ok');
      const np = popIn(t, c[2] + 7.9);
      s.never.style.opacity = np.o;
      s.never.style.transform = `scale(${np.s})`;
    }
  });
}
