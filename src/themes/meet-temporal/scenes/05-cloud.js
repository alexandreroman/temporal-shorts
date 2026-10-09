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
    ['workflow OrderWorkflow(o)', '  await ChargeCard(o)', '  await ShipPackage(o)'],
    ['activity ChargeCard(o)', '  return charge(o.card)'],
    ['activity ShipPackage(o)', '  return ship(o.address)'],
  ];
  // the Data Converter, 60 px right of the Workers (the wires' run), level with WORKER 2, where all data leaves and
  // comes back: 24 px from the zone's right border, so its name fits on one line
  const CONV = { x: 754, y: workerY(1), w: 164, h: 100 };
  // the connection: from the Data Converter out to a connector dot on Temporal Cloud's edge
  const DOT = { x: CLOUD.x - CLOUD.w / 2, y: CONV.y, size: 18 };
  // the connection's labels, centered between your zone's edge and Temporal Cloud's
  const LINE_X = (YOURS.x + YOURS.w / 2 + DOT.x) / 2;
  // Inside Temporal Cloud, 24 px from its sides under its logo: ORCHESTRATION in one row, its label on the left and
  // its task queue on the right, holding one task at a time (12 px inside the block); then PERSISTENCE, its history
  // events, those carrying data with an encrypted payload; 20 px between the two blocks, the last one 24 px above
  // the caption's clear space (y 798)
  const BLOCK = { x: CLOUD.x, w: CLOUD.w - 48 };
  const ORCH = { top: 222, h: 80 };
  const LANE = { w: 220, h: 56 };
  LANE.left = BLOCK.w - 12 - LANE.w;
  LANE.top = (ORCH.h - LANE.h) / 2;
  const PERS = { top: ORCH.top + ORCH.h + 20 };
  PERS.h = 798 - PERS.top;
  const TASK = { w: 192, h: 40 };
  // the queue's head, in the middle of its lane, where each task waits to be dispatched
  const QUEUE = [BLOCK.x - BLOCK.w / 2 + LANE.left + LANE.w / 2, ORCH.top + LANE.top + LANE.h / 2];
  // The history shows its last five events in a viewport under its label, 24 px from the block's sides and 26 px
  // above its bottom; its top 20 px, between the label and the first row, fade the rows scrolling out. The rows sit
  // in it 16 px apart (PITCH from one to the next); a sixth event scrolls the list up one row
  const VIEW = { left: 24, top: 46, w: BLOCK.w - 48, h: PERS.h - 46 - 26, first: 20 };
  const ROW = { h: 64, gap: 16 };
  const PITCH = ROW.h + ROW.gap;
  const VISIBLE = 5;
  // the middle of row i in the viewport, unscrolled
  const rowInView = i => VIEW.first + ROW.h / 2 + i * PITCH;
  // the middle of a row's payload chip (210 px wide), 20 px inside the row's right border
  const PAYLOAD_X = BLOCK.x + BLOCK.w / 2 - 24 - 1.5 - 20 - 105;
  // The tasks, in the order Temporal queues them, and the Worker each goes to: the Workflow task starts the
  // Workflow, which runs until it awaits ChargeCard; the ChargeCard task runs; a new Workflow task resumes the
  // Workflow until it awaits ShipPackage; the ShipPackage task runs; a last Workflow task resumes it to its end
  const TASKS = [['OrderWorkflow', 0], ['ChargeCard', 1], ['OrderWorkflow', 0], ['ShipPackage', 2],
    ['OrderWorkflow', 0]];
  // the Workflow's requests to schedule its Activities, as it pauses on each await
  const SCHEDULES = ['schedule ChargeCard', 'schedule ShipPackage'];
  // the payload of the close-up, in clear, then encrypted
  const SECRET = 'card: $42';
  // its ciphertext, as ChargeCard's completed event shows it (as long as SECRET, so the card keeps its width)
  const CIPHER = '9f3a…c21e';
  // the Event History: each event, with its payload if it carries data (the Workflow's input, an Activity's input
  // or result), encrypted; an Activity's start carries none
  const HISTORY = [['OrderWorkflow', 'started', '4be1…07da'], ['ChargeCard', 'scheduled', 'c08d…5b17'],
    ['ChargeCard', 'started', null], ['ChargeCard', 'completed', CIPHER],
    ['ShipPackage', 'scheduled', 'e6a2…3f90'], ['ShipPackage', 'started', null],
    ['ShipPackage', 'completed', '2d7c…a913'], ['OrderWorkflow', 'completed', '71b0…e5f4']];
  // a task's trip, slow enough to follow: it flies from the queue to the connector dot, then along the connection,
  // over the Data Converter and down to its Worker; the Worker runs it a code line (step) at a time; what it sends
  // back (a schedule request or a result) goes the other way, then on to the queue or to its history row
  const TRIP = { toDot: 0.8, route: 1.6, step: 0.9, back: 1.5, toQueue: 0.6, toRow: 0.8 };
  const arriveAt = d => d + TRIP.toDot + TRIP.route;
  // a Worker's edge, where data leaves it and tasks reach it
  const workerEdge = k => [WORKER.x + WORKER.w / 2, workerY(k)];
  // the gate just above the Data Converter, where the close-up's payload pauses over it in full view, and the
  // connection's start, where it goes on
  const GATE = [CONV.x, CONV.y - CONV.h / 2 - 34];
  const LINE_START = [CONV.x + CONV.w / 2 + 40, CONV.y];
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
      + `background:rgba(${RGB.ink},.03);border:1.5px solid ${C.line};border-radius:var(--rs)">${code}</div>`);
    w.code = w.querySelector('.code');
    w.lines = [...w.code.children];
    return w;
  }
  // The Data Converter: a lock (its shackle its own path, so it can open and snap shut) and its name on one row,
  // then a key and YOUR KEYS: the encryption keys are yours
  function makeConverter(root) {
    const e = E(root,
      '<div style="display:flex;align-items:center">'
      + `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${C.neon}" stroke-width="2"`
      + ' stroke-linecap="square" style="display:block;overflow:visible"><rect x="5" y="11" width="14" height="10"/>'
      + '<path d="M12 15v2"/><path class="shackle" d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
      + '<div style="margin-left:6px;line-height:18px">Data converter</div></div>'
      + '<div style="display:flex;align-items:center;margin-top:12px;font-size:12px;line-height:16px;'
      + `color:${C.neon}"><div class="key" style="flex:none">${ICON('key', 18, C.neon, 1.8)}</div>`
      + '<div style="margin-left:6px">Your keys</div></div>',
      'mono', {
        width: CONV.w + 'px', height: CONV.h + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', fontSize: '13px', letterSpacing: '.03em', paddingLeft: '.03em',
        textTransform: 'uppercase', textAlign: 'center', background: '#1E2418', border: '1.5px solid ' + C.neon,
        borderRadius: 'var(--rs)',
      });
    e.shackle = e.querySelector('.shackle');
    e.key = e.querySelector('.key');
    e.lock = e.querySelector('svg');
    // the scan line that sweeps across the tile as data goes through it, behind the tile's text
    e.scan = E(e, '', '', {
      width: '3px', height: (CONV.h - 3) + 'px', zIndex: -1, background: C.neon,
      boxShadow: `0 0 12px 3px rgba(${RGB.neon},.45)`,
    });
    return e;
  }
  // A block of Temporal Cloud: its label (an icon and a name) at its top left, top px from its top
  const makeBlock = (root, icon, name, h, top = 20) => E(root,
    panelLabel(icon, name, `left:22px;top:${top}px`), 'tile', {
      width: BLOCK.w + 'px', height: h + 'px', textAlign: 'left', background: `rgba(${RGB.uv},.12)`,
      borderColor: `rgba(${RGB.uv},.6)`,
    });
  // A history row: its number, its name on the left, then two fixed columns on the right: its state, a quiet slate
  // label right-aligned 20 px left of the payload column, and its payload, encrypted (an empty slot for an event
  // without data)
  function makeRow(root, i, [name, state, payload]) {
    const chip = payload === null ? '<span style="flex:none;width:210px"></span>'
      : '<span class="pl" style="flex:none;display:flex;align-items:center;justify-content:center;gap:8px;'
        + 'width:210px;height:40px;'
        + `background:rgba(${RGB.violet},.16);color:${C.violet};border-radius:var(--rs);font-size:18px">`
        + `${ICON('lock', 18, C.violet, 2)}${payload}</span>`;
    // the state's trailing letter spacing is pulled back, so its last letter ends on the column's edge
    const label = `<span style="flex:none;width:130px;margin-right:20px;text-align:right;font-size:16px;`
      + `letter-spacing:.12em;text-transform:uppercase;color:${C.slate}">`
      + `<span style="margin-right:-.12em">${state}</span></span>`;
    const e = E(root,
      `<span style="color:#6B7385;display:inline-block;width:34px">${i + 1}</span><span style="flex:1">${name}</span>`
      + label + chip,
      'mono', {
        width: VIEW.w + 'px', height: ROW.h + 'px', display: 'flex', alignItems: 'center',
        padding: '0 20px 0 20px', fontSize: '22px', whiteSpace: 'nowrap', background: `rgba(${RGB.ink},.03)`,
        border: '1.5px solid ' + C.line, borderRadius: 'var(--rs)',
      });
    e.pl = e.querySelector('.pl');
    return e;
  }

  scene({
    chapter: 5, title: 'How Temporal Cloud works',
    subs: [
      {
        text: "With <b>Temporal Cloud</b>, your <b>Workers</b> run your Workflow and Activity code "
          + "in your own environment.",
        // the three polls, one after the other, then the two captions
        after: 2.9,
      },
      // the first task runs and its result is persisted, then the second reaches its Worker and runs
      { text: "Temporal Cloud orchestrates your Workflows and Activities, and persists their history.", after: 7.6 },
      // the close-up of the second task's result, then the last two tasks run and persist
      {
        text: "You can encrypt data with your own keys before it leaves: Temporal never sees your payloads.",
        // the close-up, then the Workflow resumes, schedules ShipPackage, which runs, and completes
        after: 25.7,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.yours = makeZone(root, YOURS, 'Your code runs here', true);
      s.cloud = makeZone(root, CLOUD, 'Only Workflow & Activity data, never your code', false);
      s.workers = WORKERS.map((lines, k) => makeWorker(root, k, lines));
      s.conv = makeConverter(root);
      s.orch = makeBlock(root, 'clock', 'Orchestration · task queue', ORCH.h, (ORCH.h - 26) / 2);
      s.orch.insertAdjacentHTML('beforeend', `<div style="position:absolute;left:${LANE.left}px;`
        + `top:${LANE.top}px;width:${LANE.w}px;height:${LANE.h}px;border:1.5px dashed rgba(148,163,184,.5);`
        + 'border-radius:var(--rs)"></div>');
      // its payloads show locked; NEVER SEES YOUR PAYLOADS takes the label row's right
      s.pers = makeBlock(root, 'book', 'Persistence', PERS.h);
      s.never = statusTag(s.pers);
      Object.assign(s.never.style, { left: 'auto', right: '20px', top: '18px', transformOrigin: 'right center' });
      // the history's viewport, clipped, its top edge fading
      s.view = E(s.pers, '', '', {
        left: VIEW.left + 'px', top: VIEW.top + 'px', width: VIEW.w + 'px', height: VIEW.h + 'px',
        overflow: 'hidden', maskImage: `linear-gradient(to bottom, transparent 0, #000 ${VIEW.first}px)`,
        webkitMaskImage: `linear-gradient(to bottom, transparent 0, #000 ${VIEW.first}px)`, opacity: 1,
      });
      s.rows = HISTORY.map((row, i) => makeRow(s.view, i, row));
      s.svg = svgLayer(root);
      // the wires from each Worker to the Data Converter, the connection out, and the routes the data takes: from
      // a Worker's edge, through the converter, to the connector dot
      const wire = k => {
        const [x, y] = workerEdge(k);
        return `M ${x} ${y} C ${x + 30} ${y}, ${CONV.x - CONV.w / 2 - 30} ${CONV.y}, ${CONV.x - CONV.w / 2} ${CONV.y}`;
      };
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
      s.polls = WORKERS.map(() => makeSpark(root, 12, RGB.violet));
      // on a Worker's wire, a task or a schedule request travels as a violet spark, so no card ever covers the
      // Workers' text: the cards only travel on the connection, and pass under the Data Converter
      s.taskSparks = TASKS.map(() => makeSpark(root, 12, RGB.violet));
      s.scheduleSparks = SCHEDULES.map(() => makeSpark(root, 12, RGB.violet));
      // ShipPackage's result and the Workflow's completion, flying back as sparks
      s.results = [0, 1].map(() => makeSpark(root, 14, RGB.neon));
      // the close-up: one result, in clear, then encrypted
      s.secret = E(root, SECRET, 'mono', {
        fontSize: '20px', padding: '6px 14px', background: C.uvTint, color: C.bg, borderRadius: 'var(--rs)',
        whiteSpace: 'nowrap',
      });
      // the Data Converter over everything that goes through it but the close-up's payload, which pauses over it
      root.insertBefore(s.conv, s.secret);
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      const routePoint = (k, p) => s.routes[k].getPointAtLength(s.routes[k]._L * clamp(p));
      // A card on the connection only shows right of the Data Converter tile: it emerges from the tile's right edge
      // and disappears into it, never overlapping it (x: its center, k: its scale)
      const clipRightOfConverter = (e, x, k) => {
        const hidden = (CONV.x + CONV.w / 2 - (x - e.offsetWidth * k / 2)) / k;
        e.style.clipPath = hidden > 0 ? `inset(0 0 0 ${Math.min(hidden, e.offsetWidth).toFixed(2)}px)` : '';
      };
      // whether progress p of route k is still on its Worker's wire, before the Data Converter's left edge
      const onWirePart = (k, p) => routePoint(k, p).x < CONV.x - CONV.w / 2;
      // When something on route k is in the middle of the Data Converter: its route runs along the wire, then
      // straight through the tile to the dot, so the tile's middle is at a known share of the route; pass.map turns
      // the progress of its trip (0 to 1 from pass.start, over pass.d) into progress along the route, monotonic
      // either way, so the moment is found by bisection
      const passMid = ({ k, start, d, map }) => {
        const L = s.routes[k]._L, middle = (L - (DOT.x - CONV.x)) / L;
        let lo = 0, hi = 1;
        const rising = map(1) > map(0);
        for (let n = 0; n < 24; n++) {
          const u = (lo + hi) / 2;
          if ((map(u) < middle) === rising) lo = u; else hi = u;
        }
        return start + (lo + hi) / 2 * d;
      };

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
        const p = P(t, pollAt(k), 1.2, linear);
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
      s.orch.style.borderColor = polled > 0.5 ? C.violet : `rgba(${RGB.uv},.6)`;
      // the close-up of c[2], slowly: ChargeCard's result comes out of WORKER 2, goes to the Data Converter's gate,
      // just above it, and holds there in clear; the lock opens, the key glows and the lock snaps shut, the text
      // scrambling in place; then it leaves encrypted, crosses over and lands in its row
      const out = c[2] + 0.8, leaveAt = c[2] + 1.2, atGate = c[2] + 2.0, openAt = c[2] + 3.1, snap = c[2] + 3.6;
      const crossAt = c[2] + 4.6, atDot = c[2] + 6.6, landed = c[2] + 7.4;
      // the beats, one after the other: each task is queued (q), dispatched (d) 0.8 s later and reaches its Worker
      // (a); the Workflow pauses on an await (p) and its schedule request travels to the queue, where the Activity
      // task appears; an Activity's result is persisted, and a new Workflow task is queued
      const toQueue = TRIP.back + TRIP.toQueue, toRow = TRIP.back + TRIP.toRow;
      const d0 = c[1] + 0.8, a0 = arriveAt(d0), p0 = a0 + 2 * TRIP.step;
      // an Activity task waits 1.2 s in the queue, a readable beat after its scheduled event
      const q1 = p0 + toQueue, d1 = q1 + 1.2, a1 = arriveAt(d1);
      const q2 = landed + 0.6, d2 = q2 + 0.8, a2 = arriveAt(d2), p2 = a2 + 2 * TRIP.step;
      const q3 = p2 + toQueue, d3 = q3 + 1.2, a3 = arriveAt(d3), r3 = a3 + 2 * TRIP.step;
      const q4 = r3 + toRow + 0.6, d4 = q4 + 0.8, a4 = arriveAt(d4), done = a4 + TRIP.step + 0.3;
      const queued = [c[0] + 1.5, q1, q2, q3, q4], dispatch = [d0, d1, d2, d3, d4];
      // each event at the moment Temporal writes it: an Activity's STARTED event only once its result reaches
      // Temporal Cloud (at the connector dot), as Temporal records an Activity's start when the Activity closes,
      // then its COMPLETED event as the result lands in its row
      const rowAt = [c[1] + 0.3, q1, atDot, landed, q3, r3 + TRIP.back, r3 + toRow, done + toRow];
      // the history scrolls up one row, eased, before each event beyond the fifth lands: it rests on whole rows
      const scroll = PITCH * rowAt.slice(VISIBLE).map(at => P(t, at - 0.6, 0.45, ease)).reduce((a, b) => a + b, 0);
      const rowY = i => PERS.top + VIEW.top + rowInView(i) - scroll;
      // each task waits at the queue's head, then flies out and on to its Worker
      s.tasks.forEach((e, i) => {
        const k = TASKS[i][1], pop = popIn(t, queued[i]);
        const toDot = P(t, dispatch[i], TRIP.toDot, ease), along = P(t, dispatch[i] + TRIP.toDot, TRIP.route);
        let [x, y] = QUEUE, scale = pop.s;
        // back along the connection, straight under the Data Converter, then on along its Worker's wire as a spark
        const onWire = along > 0 && onWirePart(k, 1 - ease(along));
        if (along > 0) {
          const pt = routePoint(k, 1 - ease(along));
          x = pt.x; y = pt.y; scale = 0.8;
        } else if (toDot > 0) {
          x = lerp(QUEUE[0], DOT.x, toDot); y = lerp(QUEUE[1], DOT.y, toDot); scale = lerp(1, 0.8, toDot);
        }
        const o = t < queued[i] || along >= 1 || onWire ? 0 : pop.o;
        place(e, Math.round(x * 100) / 100, Math.round(y * 100) / 100, scale, o);
        clipRightOfConverter(e, x, scale);
        place(s.taskSparks[i], x, y, 1, onWire && along < 1 ? 1 : 0);
      });
      // the Workflow's schedule requests: out of WORKER 1 as it pauses, a spark along its wire, a card from under the
      // Data Converter on along the connection, then into the queue, where the Activity task takes their place
      s.schedules.forEach((e, j) => {
        const at = [p0, p2][j];
        const f = P(t, at, TRIP.back, ease), g = P(t, at + TRIP.back, TRIP.toQueue, ease);
        const pt = routePoint(0, f), onWire = onWirePart(0, f);
        let [x, y] = [pt.x, pt.y];
        if (g > 0) { x = lerp(DOT.x, QUEUE[0], g); y = lerp(DOT.y, QUEUE[1], g); }
        place(s.scheduleSparks[j], x, y, 1, t >= at && f < 1 && onWire ? 1 : 0);
        const o = t < at || onWire ? 0 : 1 - P(t, at + toQueue - 0.15, 0.2);
        place(e, Math.round(x), Math.round(y), 1, o);
        clipRightOfConverter(e, Math.round(x), 1);
      });
      // The Workers. WORKER 1 runs the Workflow a line at a time: from the top to `await ChargeCard`, where it waits;
      // resumed, on to `await ShipPackage`, where it waits again; resumed, past the last line: it returns, DONE. The
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
        e.style.background = j === lit ? `rgba(${RGB.violet},.28)` : j === paused ? `rgba(${RGB.violet},.12)` : '';
      });
      [[1, a1, leaveAt], [2, a3, r3]].forEach(([k, at, until]) => {
        const w = s.workers[k], running = t >= at && t < until;
        setAppStatus(w, running ? 'RUNNING' : t >= pollAt(k) ? 'POLLING' : '', running ? 'running' : 'idle');
        w.code.style.borderColor = running ? C.violet : C.line;
        const line = running ? Math.min(1, Math.floor((t - at) / TRIP.step)) : -1;
        w.lines.forEach((e, j) => { e.style.background = j === line ? `rgba(${RGB.violet},.28)` : ''; });
      });
      // ShipPackage's result and the Workflow's completion run back as sparks, over the gate, into their rows
      [[r3, 2, 6], [done, 0, 7]].forEach(([at, k, row], j) => {
        const e = s.results[j];
        const back = P(t, at, TRIP.back, linear), into = P(t, at + TRIP.back, TRIP.toRow);
        if (back <= 0 || into >= 1) {
          place(e, 0, 0, 1, 0);
          return;
        }
        if (into <= 0) {
          const pt = routePoint(k, back);
          place(e, pt.x, pt.y, 1, Math.min(1, back * 6));
        } else {
          place(e, lerp(DOT.x, PAYLOAD_X, into), lerp(DOT.y, rowY(row), into), 1, 1 - into * 0.5);
        }
      });
      // each event slides in as it happens, the row and its payload glowing a moment
      s.rows.forEach((e, i) => {
        const rp = P(t, rowAt[i] - 0.05, 0.3);
        place(e, VIEW.w / 2 + Math.round((1 - rp) * 26), Math.round((rowInView(i) - scroll) * 100) / 100, 1, rp);
        const lit = win(t, rowAt[i], rowAt[i] + 0.7, 0.15) > 0.5;
        e.style.borderColor = lit ? C.violet : C.line;
        if (e.pl) e.pl.style.boxShadow = lit ? `0 0 16px rgba(${RGB.violet},.6)` : '';
      });

      // the close-up of c[2]: the rest dims while the payload makes its journey
      const sp = P(t, c[2] + 0.3, 0.4) * (1 - P(t, c[2] + 8.3, 0.4));
      const dim = e => { e.style.opacity = (parseFloat(e.style.opacity || 1) * (1 - 0.6 * sp)).toFixed(3); };
      [s.workers[0], s.workers[2], s.orch, ...s.tasks, ...s.schedules, s.yours.cap, s.cloud.cap].forEach(dim);
      s.rows.forEach((e, i) => { if (i !== 3) dim(e); });
      // the payload's position, always on top of what it passes: out of WORKER 2's edge, up to the gate above the
      // Data Converter (the converter's lock and key in full view under it), down to the connection's start, along
      // it to the dot, then onto its row's payload
      const pop = backPop(t, out, 0.4);
      const wireStart = workerEdge(1);
      const legs = [[leaveAt, wireStart, GATE, atGate - leaveAt],
        [crossAt, GATE, LINE_START, 0.5], [crossAt + 0.5, LINE_START, [DOT.x, DOT.y], atDot - crossAt - 0.5],
        [atDot, [DOT.x, DOT.y], [PAYLOAD_X, rowY(3)], landed - atDot]];
      let [sx, sy] = wireStart;
      legs.forEach(([at, from, to, d]) => {
        if (t < at) return;
        const f = ease(P(t, at, d));
        sx = lerp(from[0], to[0], f); sy = lerp(from[1], to[1], f);
      });
      const drop = P(t, atDot, landed - atDot);
      // encrypted once, there: the text scrambles while the lock snaps, then freezes as the ciphertext that row 4's
      // chip shows; it stays the same as it crosses and lands
      const encrypted = P(t, snap, 0.6);
      const frame = Math.floor(t * 20);
      let text = SECRET;
      if (encrypted >= 1) text = CIPHER;
      else if (encrypted > 0) text = scrambleHex(SECRET, Math.round(encrypted * SECRET.length), frame);
      if (s.secret.textContent !== text) s.secret.textContent = text;
      s.secret.style.background = encrypted > 0.5 ? C.violetTint : C.uvTint;
      const k3 = 1.1 * pop.s * (1 - 0.2 * drop);
      place(s.secret, Math.round(sx), Math.round(sy), k3, pop.o * (1 - P(t, landed - 0.15, 0.2)));
      // The Data Converter reacts to everything that goes through it, for 0.44 s centered on the moment it is
      // inside the tile: its glow pulses, a scan line sweeps across it in the direction of travel, and its lock
      // clicks: outbound data is encrypted (the lock bumps), inbound data decrypted (the lock opens, then closes).
      // The close-up's payload gets the strongest reaction: the lock opens as it arrives, snaps shut on it, the
      // key glows
      const passes = [
        ...dispatch.map((d, i) => ({ k: TASKS[i][1], start: d + TRIP.toDot, d: TRIP.route, map: u => 1 - ease(u),
          out: false })),
        ...[p0, p2].map(at => ({ k: 0, start: at, d: TRIP.back, map: ease, out: true })),
        ...[[r3, 2], [done, 0]].map(([at, k]) => ({ k, start: at, d: TRIP.back, map: linear, out: true })),
      ].map(pass => ({ ...pass, mid: passMid(pass) }));
      const active = passes.find(pass => Math.abs(t - pass.mid) < 0.22);
      const pulse = active ? win(t, active.mid - 0.22, active.mid + 0.22, 0.12) : 0;
      const sweep = active ? P(t, active.mid - 0.22, 0.44, linear) : 0;
      place(s.conv.scan, (active && active.out ? sweep : 1 - sweep) * (CONV.w - 6) + 1.5, (CONV.h - 3) / 2, 1,
        active ? pulse * 0.8 : 0);
      const decrypt = active && !active.out ? win(t, active.mid - 0.2, active.mid + 0.15, 0.1) : 0;
      const click = active && active.out ? swell(t, active.mid - 0.1, 0.25) : 1;
      s.conv.lock.style.transform = `scale(${click})`;
      const open = Math.max(P(t, openAt, 0.25) * (1 - P(t, snap, 0.15, easeIn)), decrypt);
      s.conv.shackle.setAttribute('transform', `translate(0 ${(-4 * open).toFixed(2)})`);
      s.conv.key.style.transform = `scale(${swell(t, snap - 0.25, 0.5)})`;
      const glow = Math.max(pulse * 0.7, win(t, snap - 0.1, snap + 0.5, 0.15));
      s.conv.style.boxShadow = glowShadow(RGB.neon, glow, { blur: 24, alpha: 0.45 });
      // Temporal Cloud never sees your payloads, held
      setStatus(s.never, 'NEVER SEES YOUR PAYLOADS', 'ok');
      const np = popIn(t, c[2] + 7.9);
      s.never.style.opacity = np.o;
      s.never.style.transform = `scale(${np.s})`;
    }
  });
}
