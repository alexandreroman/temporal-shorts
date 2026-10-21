// ===================== 3. A DELETED DATABASE
// The case file slams in (APRIL 2026, 9 SECONDS) and gets its INCIDENT stamp. It pins to the top left corner and the
// incident replays in red: a coding agent sits under its task (fix a staging issue), an empty dashed slot marks where
// nobody approves, and an unrelated key with full account access lies in the top row. A red key token flies from it
// into the agent, which turns red and fires `delete_database` through that slot into the production database: the
// database shatters, then its backups (the dramatic beat: red flashes, camera shakes) while the stopwatch in the top
// right corner stops at 0:09. Then the replay gives way to the board: the agent becomes the AI model, the empty slot
// grows into the WORKFLOW checkpoint, which holds the same card (NEEDS APPROVAL) and sends an approval request to
// Maya's phone, while the model steps up and aside, smaller, above it. The hours tick by, the Workers crash and come
// back while the step keeps waiting, then Maya taps Reject: REJECTED BY MAYA, the checkpoint shuts, the Event History
// records it and the database stays whole (SAFE). The camera zoom-through (setCamera) brings the scene in and plays
// into the next one; the hits shake it.
// The block keeps every name declared in this file local to this scene.
{
  // ---------- the replay stage, at camera rest. The lane LANE_Y runs from the agent on the left (x 330, the board's
  // model column) through the empty approval slot (x 960, the checkpoint's column) to the production database (x
  // 1590, the Workers' column), its backups under it. The top row lines up on the pinned case file's center: the case
  // file (left), the unrelated key (middle), the stopwatch (right, over the database's column). The task card sits
  // above the agent, left-aligned with the pinned case file (x 120).
  const LANE_Y = 600;
  const TOP_ROW_Y = CASE_FILE.pin.y;
  const AGENT = { x: BOARD.model.x, y: LANE_Y };
  const TASK = { x: 330, y: 424, w: 420, h: 96 };
  const KEY = { x: 960, y: TOP_ROW_Y, w: 440, h: 96 };
  const SLOT = { x: BOARD.checkpoint.x, y: LANE_Y, w: CHECKPOINT.w, h: 260 };
  const DB = { x: BOARD.tools.x, y: LANE_Y, w: 320, h: 150 };
  const BACKUPS = { x: DB.x, y: DB.y + DB.h + 20, w: DB.w, h: DB.h };
  const TIMER = { x: DB.x, y: TOP_ROW_Y, w: DB.w, h: 116, seconds: 9 };
  // the key token that flies from the key card into the agent: its size, and its route (a curve that clears the
  // task card's bottom right corner), from the key card's icon to the agent's upper right edge
  const TOKEN = { size: 52 };
  const KEY_ICON_X = KEY.x - KEY.w / 2 + 6 + 22 + 18;
  const TOKEN_ROUTE = [[KEY_ICON_X, KEY.y], [760, 414], [600, 534], [AGENT.x + 70, LANE_Y - 70]];
  // the shards of a shattered tile: a grid of cells, each cut into two triangles, its inner corners jittered
  const SHARDS = { cols: 4, rows: 3, jitter: 0.45, gravity: 1300 };

  // ---------- the board phase: where the held card waits, in front of the checkpoint (far enough left for its
  // widest verdict tag to clear the checkpoint), its tags 20 px above it, the waiting clock 44 px under it, as wide
  // as the card; Maya's phone on the left, its bottom on the Event History's bottom edge; the model, stepped aside
  // above the phone at 2/3 of its size, its AI MODEL label 40 px clear of the phone's top
  const HOLD = { x: 660, y: BOARD.laneY };
  const TAG_Y = BOARD.laneY - ACTION_CARD.h / 2 - 20 - AGENT_TAG.h / 2;
  const CLOCK = { x: HOLD.x, y: BOARD.laneY + ACTION_CARD.h / 2 + 44 + 28, w: 240, h: 56 };
  const PHONE = { x: 300, y: BOARD.history.y + BOARD.history.h / 2 - APPROVAL_CARD.h / 2 };
  const ORB_ASIDE = { x: PHONE.x, y: 226, scale: 2 / 3 };
  // the Database tool tile on the board, and its SAFE tag, inside the tile, 20 px from its right edge
  const DB_TOOL = 1;
  const [dbToolX, dbToolY] = toolSlot(DB_TOOL);
  // An agentTag's width (see agentTag)
  const agentTagW = text => 2 * AGENT_TAG.padX + AGENT_TAG.icon + AGENT_TAG.gap + text.length * 14;
  const SAFE_X = dbToolX + TOOL_TILE.w / 2 - 20 - agentTagW('SAFE') / 2;
  // the clock's start (Wednesday 10:00) and the time Maya answers, in minutes from it (Thursday 16:20)
  const WAIT = { startMin: 10 * 60, answerMin: 30 * 60 + 20, days: ['WED', 'THU', 'FRI'] };

  // the beats, in seconds from each cue: c[0], the case file slams in
  const T0 = { file: 0.2 };
  // from c[1]: the case file pins to its corner; the replay stage comes in; the key card glows as "found a key" is
  // read and turns red on "too much power"; the key token flies into the agent ("and used it"), which turns red; the
  // card grows out of it and races (easeIn) to the database, which it hits; the backups shatter `chain` s later, as
  // the stopwatch stops; the outlines of what was lost fade in
  const T1 = {
    pin: 0, pinD: 0.8, agent: 0.3, task: 0.5, key: 0.6, slot: 0.7, db: 0.5, backups: 0.6, timer: 0.7, lane: 0.6,
    found: 1.0, power: 1.6, pick: 1.9, pickD: 0.7, red: 2.7, card: 2.9, go: 3.1, goD: 1.0, chain: 0.25, lost: 0.6,
  };
  // from c[2]: the replay gives way to the board (out, the replay leaves; move, the agent and the slot travel to
  // their board places; zone, history and lanes come in); the card goes to the checkpoint, which holds it; the model
  // steps up and aside for Maya's phone, which a violet spark reaches; the request slides up on its screen
  const T2 = {
    out: 0, outD: 0.6, move: 0, moveD: 0.9, cp: 0.6, zone: 0.2, history: 0.4, lanes: 0.6,
    card: 1.5, go: 1.7, goD: 0.8, rowHeld: 2.7, aside: 3.0, asideD: 0.7, phone: 3.3, spark: 3.6, sparkD: 0.5,
    screen: 4.0, rowAsked: 4.2,
  };
  // from c[3]: the waiting clock pops in and runs; the Workers crash and come back; the deadline line lights; Maya
  // taps Reject and a red spark carries it to the checkpoint, which shuts; the history row, then SAFE
  const T3 = {
    clock: 0, run: 0.2, crash: 2.0, crashD: 0.9, deadline: 3.9, reject: 4.6, spark: 4.7, sparkD: 0.4,
    row: 5.5, safe: 6.1,
  };

  // A storage tile of the replay (box.w x box.h): its icon over its label, in color
  const storageHtml = (icon, label, color) => `${ICON(icon, 56, color, 1.6)}`
    + `<div class="lbl" style="margin-top:14px;color:${color}">${label}</div>`;
  const DB_HTML = color => storageHtml('database', 'Production database', color);
  const BACKUPS_HTML = color => storageHtml('box', 'Backups', color);
  const tileCss = box => ({
    width: box.w + 'px', height: box.h + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center',
  });

  // The shards of a tile (box, its content html(color)): copies of the red tile clipped to triangles of a jittered
  // grid. Each one keeps its centroid (its rotation origin) and a velocity away from the point of impact `hit` ([x,
  // y] in the tile), with an upward kick.
  const makeShards = (root, box, html, hit) => {
    const { cols, rows, jitter } = SHARDS;
    const cellW = box.w / cols, cellH = box.h / rows;
    const corner = (col, row) => {
      const inner = col > 0 && col < cols && row > 0 && row < rows;
      const n = row * (cols + 1) + col;
      const jx = inner ? (hash(n * 2 + 41) - 0.5) * cellW * jitter : 0;
      const jy = inner ? (hash(n * 2 + 42) - 0.5) * cellH * jitter : 0;
      return [col * cellW + jx, row * cellH + jy];
    };
    const triangles = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const a = corner(col, row), b = corner(col + 1, row), c = corner(col + 1, row + 1), d = corner(col, row + 1);
        // the diagonal alternates, so the cracks zigzag
        if ((row + col) % 2 === 0) triangles.push([a, b, c], [a, c, d]);
        else triangles.push([a, b, d], [b, c, d]);
      }
    }
    return triangles.map((points, i) => {
      const shard = E(root, html(C.red), 'tile', {
        ...tileCss(box), borderColor: C.red, background: 'var(--red-solid)',
        clipPath: `polygon(${points.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`,
      });
      const cx = (points[0][0] + points[1][0] + points[2][0]) / 3;
      const cy = (points[0][1] + points[1][1] + points[2][1]) / 3;
      const dx = cx - hit[0], dy = cy - hit[1];
      const len = Math.hypot(dx, dy) || 1;
      const speed = 380 + 460 * hash(i * 3 + 7 + box.y);
      shard.style.transformOrigin = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
      shard.motion = {
        vx: dx / len * speed, vy: dy / len * speed - 240, spin: (hash(i * 3 + 8 + box.y) - 0.5) * 620,
      };
      return shard;
    });
  };
  // The shards of the tile at box fly apart from the hit at `at`, fall and fade out within 0.85 s; hidden otherwise
  const placeShards = (shards, t, at, box) => {
    const u = t - at;
    const left = box.x - box.w / 2, top = box.y - box.h / 2;
    shards.forEach(shard => {
      const o = u < 0 ? 0 : 1 - P(t, at + 0.35, 0.5, linear);
      shard.style.opacity = o;
      shard.style.visibility = o > 0 ? 'visible' : 'hidden';
      if (o <= 0) return;
      const { vx, vy, spin } = shard.motion;
      const x = left + vx * u, y = top + vy * u + 0.5 * SHARDS.gravity * u * u;
      shard.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(spin * u).toFixed(1)}deg)`;
    });
  };

  // The outline left where a tile was: a red dashed rectangle of its size round its label in red
  const makeLost = (root, box, label) => E(root,
    `<svg width="${box.w}" height="${box.h}" style="position:absolute;left:0;top:0">`
    + `<rect x="1" y="1" width="${box.w - 2}" height="${box.h - 2}" rx="10" fill="none" stroke="${C.red}"`
    + ' stroke-width="2" stroke-dasharray="10 8"/></svg>'
    + `<div class="lbl" style="position:relative;color:${C.red}">${label}</div>`,
    '', tileCss(box));

  // The empty approval slot of the replay: a slate dashed outline, SLOT.w px wide, h px high (it grows into the
  // checkpoint's height as it travels to the board), with a person and NO APPROVAL in its upper part, above the card's
  // path. setSlot(slot, h, red) sizes it and tints it red (0 to 1) as the card goes through.
  const makeSlot = root => {
    const slot = E(root,
      '<svg style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible">'
      + `<rect x="1" y="1" rx="10" fill="rgba(148,163,184,.04)" stroke="${C.slate}" stroke-width="2"`
      + ' stroke-dasharray="10 8"/></svg>'
      + '<div class="note" style="position:absolute;left:0;right:0;top:18px;display:flex;flex-direction:column;'
      + `align-items:center;gap:8px">${ICON('user', 28, C.slate, 1.8)}`
      + '<span class="lbl" style="font-size:16px">No approval</span></div>',
      '', { width: SLOT.w + 'px' });
    slot.rect = slot.querySelector('rect');
    slot.icon = slot.querySelector('.note svg');
    slot.label = slot.querySelector('.lbl');
    return slot;
  };
  const setSlot = (slot, h, red) => {
    slot.style.height = h + 'px';
    slot.rect.setAttribute('width', SLOT.w - 2);
    slot.rect.setAttribute('height', h - 2);
    const color = red > 0.5 ? C.red : C.slate;
    slot.rect.setAttribute('stroke', color);
    slot.label.style.color = color;
    slot.icon.setAttribute('stroke', color);
  };

  // The unrelated key: a white card (slate left edge) with a key icon, UNRELATED KEY over "Full account access";
  // keyCard.txt is that line, keyCard.icon the icon's <svg>
  const makeKeyCard = root => {
    const card = E(root,
      `<div style="display:flex;align-items:center;gap:18px">${ICON('key', 36, C.bg, 1.9)}`
      + '<div style="text-align:left"><div class="who">UNRELATED KEY</div>'
      + '<div class="txt">Full account access</div></div></div>',
      'card', {
        width: KEY.w + 'px', height: KEY.h + 'px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        borderLeftColor: C.slate,
      });
    card.txt = card.querySelector('.txt');
    card.icon = card.querySelector('svg');
    return card;
  };

  // The stopwatch: ELAPSED over the time (0:00 to 0:09), in a tile; timer.n holds the time
  const makeTimer = root => {
    const timer = E(root,
      '<div class="lbl" style="font-size:16px">Elapsed</div>'
      + '<div class="n" style="font-size:56px;line-height:60px;margin-top:6px">0:00</div>',
      'tile', { ...tileCss(TIMER) });
    timer.n = timer.querySelector('.n');
    return timer;
  };

  // The waiting clock: a violet tile with a clock whose hands turn, WAITING over the day and time; setClock(clock,
  // minutes) shows WAIT.startMin + minutes
  const makeClock = root => {
    const clock = E(root,
      '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke="' + C.violet + '"'
      + ' stroke-width="1.8" style="display:block;flex:none"><circle cx="12" cy="12" r="10"/>'
      + '<path class="hh" d="M12 12V7.5" stroke-width="2.2"/><path class="mh" d="M12 12V4.5"/></svg>'
      + '<div style="text-align:left"><div class="lbl" style="font-size:14px;line-height:18px">Waiting</div>'
      + '<div class="time mono" style="font-size:22px;line-height:26px;letter-spacing:.06em">WED 10:00</div></div>',
      'tile', {
        width: CLOCK.w + 'px', height: CLOCK.h + 'px', display: 'flex', alignItems: 'center', gap: '16px',
        paddingLeft: '20px', borderColor: C.violet,
      });
    clock.time = clock.querySelector('.time');
    return clock;
  };
  const setClock = (clock, minutes) => {
    const total = WAIT.startMin + Math.floor(minutes / 10) * 10;
    const day = WAIT.days[Math.floor(total / 1440)];
    const hh = String(Math.floor(total % 1440 / 60)).padStart(2, '0');
    const mm = String(total % 60).padStart(2, '0');
    setText(clock.time, `${day} ${hh}:${mm}`);
    setClockHands(clock, total / 60, 12);
  };

  scene({
    chapter: 3, title: 'A deleted database',
    sources: [
      { label: 'Hackread, April 2026', url: 'https://hackread.com/cursor-ai-agent-wipes-pocketos-database-backups/' },
      { label: 'AI Incident Database', url: 'https://incidentdatabase.ai/cite/1469/' },
    ],
    subs: [
      { text: "April 2026: a coding agent deleted a company's production database and its backups, in 9 seconds." },
      // the backups shatter, then a short hold on the loss
      { text: "It found a key with too much power and used it. Nobody had to approve a step that could not be undone.",
        after: 0.4 },
      { text: "With Temporal, risky steps wait for a person: the Workflow holds the step until Maya says yes or no." },
      // Maya's no, the history row and SAFE, then a hold
      { text: "The wait can last days, survives crashes and costs nothing. No answer by the deadline means no.",
        after: 1.4 },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // the board, under the replay; its history rows: the held step (a model call), the request to Maya, the verdict
      s.board = makeBoard(root, {
        historyRows: ['<b>delete_database</b> proposed', 'approval sent to Maya', '<b>delete_database</b>'],
        uvRow: i => i === 0,
      });
      // the orb rides a zero-size mount (a camera for the layout check, as the pinned case file), which scales it
      // when it steps aside; the mount takes the orb's place in the stacking order
      const orbEl = s.board.orb.el;
      s.orbMount = E(root, '', 'cam', { width: 0, height: 0, opacity: 1 });
      orbEl.parentNode.insertBefore(s.orbMount, orbEl);
      s.orbMount.appendChild(orbEl);
      s.safe = agentTag('SAFE', 'neon', root);
      s.safeRipples = makeRipples(root, 2, RGB.neon);
      s.crashTag = agentTag('CRASH', 'red', root);

      // the replay stage
      s.svg = svgLayer(root);
      s.lane = path(s.svg, `M ${AGENT.x + BOARD.model.size / 2 + 16} ${LANE_Y} H ${DB.x - DB.w / 2}`, C.line, 2, false);
      s.slot = makeSlot(root);
      s.task = makeCard(root, 'Fix a staging issue', 'user', 'TASK', TASK.w);
      Object.assign(s.task.style, {
        height: TASK.h + 'px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      });
      s.task.txt.style.fontSize = '26px';
      s.key = makeKeyCard(root);
      s.timer = makeTimer(root);
      s.db = E(root, DB_HTML(C.ink), 'tile', tileCss(DB));
      s.backups = E(root, BACKUPS_HTML(C.ink), 'tile', tileCss(BACKUPS));
      s.dbLost = makeLost(root, DB, 'Database deleted');
      s.backupsLost = makeLost(root, BACKUPS, 'Backups deleted');
      // the card hits the database in the middle of its left edge; the crack reaches the backups from above
      s.dbShards = makeShards(root, DB, DB_HTML, [0, DB.h / 2]);
      s.backupsShards = makeShards(root, BACKUPS, BACKUPS_HTML, [BACKUPS.w / 2, 0]);

      // the cards: the replay's, then the board's
      s.replayCard = makeActionCard(root, { tool: 'delete_database', arg: 'the production database' });
      s.replayCard.setTone('red');
      s.card = makeActionCard(root, { tool: 'delete_database', arg: 'the production database' });
      s.needs = agentTag('NEEDS APPROVAL', 'violet', root);
      s.rejected = agentTag('REJECTED BY MAYA', 'red', root);
      s.clock = makeClock(root);
      // the key token, over the cards
      s.token = E(root, ICON('key', 28, C.bg, 2.2), '', {
        width: TOKEN.size + 'px', height: TOKEN.size + 'px', borderRadius: '50%', background: C.red,
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: glowShadow(RGB.red, 1, {
          blur: 24, alpha: 0.7,
        }),
      });

      // Maya's phone and the sparks between it and the checkpoint
      s.phone = makeApprovalCard(root, {
        who: 'Maya', question: 'Delete the production database?', deadline: 'Answer by Friday 18:00',
      });
      s.deadline = s.phone.el.querySelector('.deadline');
      s.toPhone = makeSpark(root, 18, RGB.violet);
      s.toCheckpoint = makeSpark(root, 18, RGB.red);
      s.phoneRipples = makeRipples(root, 2, RGB.violet);
      s.shutRipples = makeRipples(root, 2, RGB.red);

      // the case file, on top of everything
      s.file = makeCaseFile(root, {
        date: 'APRIL 2026', tag: '9 SECONDS', headline: 'A coding agent wipes a database and its backups',
        source: 'HACKREAD, APR 2026',
      });
      // the flash covers the stage, outside the camera
      s.flash = makeFlash(stage);
    },
    update(t, c, s) {
      const goAt = c[1] + T1.go;
      const hitAt = goAt + T1.goD;
      const backupsAt = hitAt + T1.chain;
      const crashAt = c[3] + T3.crash;
      const rejectAt = c[3] + T3.reject;
      const shutAt = c[3] + T3.spark + T3.sparkD;
      const holdAt = c[2] + T2.go + T2.goD;

      // the camera: the zoom-through in and out; the two shatterings and the crash shake it
      const [hitX, hitY] = shake(t, hitAt, 16, 0.5);
      const [chainX, chainY] = shake(t, backupsAt, 12, 0.45);
      const [crashX, crashY] = shake(t, crashAt, 6, 0.35);
      setCamera(s.cam, t, this.dur, { dx: hitX + chainX + crashX, dy: hitY + chainY + crashY });
      // a red flash with each: strong ones as the database and its backups shatter, a faint one for the crash; the
      // nearest one shows
      const flashes = [[hitAt + 0.03, 0.32], [backupsAt + 0.03, 0.28], [crashAt, 0.16]];
      const [flashAt, flashK] = flashes.reduce((a, b) => (Math.abs(t - b[0]) < Math.abs(t - a[0]) ? b : a));
      placeFlash(s.flash, t, flashAt, flashK);

      // ---------- c[0] and c[1]: the case file slams in, then pins to its corner; it rises away as the board comes
      s.file.set(t, c[0] + T0.file);
      const pinned = P(t, c[1] + T1.pin, T1.pinD);
      const fileAway = P(t, c[2] + T2.out, T2.outD);
      s.file.pin(pinned, {
        o: 1 - fileAway, to: { ...CASE_FILE.pin, y: CASE_FILE.pin.y - Math.round(40 * fileAway) },
      });

      // the replay leaves by sliding down as it fades (out), while the agent and the slot travel to the board (move)
      const out = P(t, c[2] + T2.out, T2.outD);
      const outDy = Math.round(40 * out);
      const move = P(t, c[2] + T2.move, T2.moveD);

      // the task card: it dims, its edge red, once the agent strays from it
      const taskPop = backPop(t, c[1] + T1.task);
      const strayed = P(t, c[1] + T1.card, 0.4);
      place(s.task, TASK.x, TASK.y + outDy, taskPop.s, taskPop.o * lerp(1, 0.7, strayed) * (1 - out));
      s.task.style.borderLeftColor = strayed > 0.5 ? C.red : C.violet;

      // the unrelated key: it glows as "found a key" is read, its line and edge turn red on "too much power"
      const keyPop = backPop(t, c[1] + T1.key);
      place(s.key, KEY.x, KEY.y + outDy, keyPop.s, keyPop.o * (1 - out));
      const found = Math.max(0, 1 - Math.abs(t - c[1] - T1.found - 0.3) / 0.5);
      const power = t >= c[1] + T1.power;
      s.key.style.boxShadow = power
        ? glowShadow(RGB.red, P(t, c[1] + T1.power, 0.3), { blur: 30, alpha: 0.6 })
        : glowShadow(RGB.violet, found, { blur: 30, alpha: 0.7 });
      s.key.style.borderLeftColor = power ? C.red : C.slate;
      s.key.txt.style.color = power ? C.red : '';
      // its icon dims once the token has left it
      s.key.icon.style.opacity = t >= c[1] + T1.pick ? 0.3 : 1;

      // the key token lifts off the key card and flies into the agent, then sinks into it
      const flight = P(t, c[1] + T1.pick, T1.pickD);
      const sinkAt = c[1] + T1.pick + T1.pickD;
      const sink = P(t, sinkAt, 0.15, linear);
      const [tokenX, tokenY] = bezier(TOKEN_ROUTE, flight);
      const tokenLift = P(t, c[1] + T1.pick, 0.15, linear);
      place(s.token, tokenX, tokenY, lerp(1, 0.4, sink), tokenLift * (1 - sink));

      // the lane from the agent to the database
      draw(s.lane, P(t, c[1] + T1.lane, 0.6), 1 - out);

      // the empty slot: the card turns it red as it goes through; then it travels up to the checkpoint's place,
      // growing to its height, and hands over to the checkpoint
      const cardRoute = [AGENT.x, DB.x - DB.w / 2 - s.replayCard.w / 2];
      const throughAt = goAt + T1.goD * Math.cbrt((SLOT.x - cardRoute[0]) / (cardRoute[1] - cardRoute[0]));
      const slotRed = win(t, throughAt - 0.05, throughAt + 0.35, 0.05);
      const slotH = Math.round(lerp(SLOT.h, BOARD.checkpoint.h, move) / 2) * 2;
      setSlot(s.slot, slotH, slotRed);
      const slotIn = P(t, c[1] + T1.slot, 0.5);
      const cpIn = P(t, c[2] + T2.cp, 0.3);
      place(s.slot, SLOT.x, Math.round(lerp(SLOT.y, BOARD.checkpoint.y, move)), 1, slotIn * (1 - cpIn));

      // the database and its backups: the card hits the database at hitAt, which shatters, then the backups at
      // backupsAt; the outlines of what was lost fade in
      const storage = [
        [s.db, DB, s.dbShards, s.dbLost, T1.db, hitAt],
        [s.backups, BACKUPS, s.backupsShards, s.backupsLost, T1.backups, backupsAt],
      ];
      storage.forEach(([tile, box, shards, lost, popAt, breakAt]) => {
        const pop = backPop(t, c[1] + popAt);
        tile.style.borderColor = t >= breakAt - 0.06 ? C.red : C.line;
        place(tile, box.x, box.y, pop.s, t < breakAt ? pop.o : 0);
        placeShards(shards, t, breakAt, box);
        place(lost, box.x, box.y + outDy, 1, P(t, breakAt + T1.lost, 0.5) * (1 - out));
      });

      // the stopwatch runs from the call to the last shattering, and stops at 0:09 in red
      const timerPop = backPop(t, c[1] + T1.timer);
      place(s.timer, TIMER.x, TIMER.y + outDy, timerPop.s, timerPop.o * (1 - out));
      const elapsed = Math.floor(TIMER.seconds * P(t, goAt, backupsAt - goAt, linear));
      setText(s.timer.n, `0:${String(elapsed).padStart(2, '0')}`);
      s.timer.n.style.color = t >= backupsAt ? C.red : C.ink;
      s.timer.style.borderColor = t >= backupsAt ? C.red : C.line;

      // the replay card grows out of the agent and races to the database (easeIn), then sinks into it
      const replayGrow = P(t, c[1] + T1.card, 0.3);
      const race = P(t, goAt, T1.goD, easeIn);
      const sunk = P(t, hitAt, 0.12, linear);
      s.replayCard.place(lerp(cardRoute[0], cardRoute[1], race), LANE_Y, lerp(0.4, 1, replayGrow) * (1 - 0.3 * sunk),
        replayGrow * (1 - sunk));

      // ---------- the board comes in: zone and tools from the right, the history from below, then the lanes; the
      // checkpoint takes over from the slot
      const zoneIn = P(t, c[2] + T2.zone, 0.7);
      const historyIn = P(t, c[2] + T2.history, 0.6);
      const aside = P(t, c[2] + T2.aside, T2.asideD);
      placeBoard(s.board, {
        model: 0, checkpoint: cpIn, tools: zoneIn, history: historyIn, lanes: 0,
      });
      const zoneDx = Math.round(80 * (1 - zoneIn));
      place(s.board.zone, BOARD.tools.x + zoneDx, BOARD.tools.y, 1, zoneIn);
      place(s.board.history, BOARD.history.x, BOARD.history.y + Math.round(60 * (1 - historyIn)), 1, historyIn);
      const lanesIn = P(t, c[2] + T2.lanes, 0.5);
      draw(s.board.lanes[0], lanesIn, 1 - aside);
      draw(s.board.lanes[1], lanesIn, 1);

      // the Workers crash: their tiles jitter and flicker red, go dark under a CRASH tag, then come back
      const glitch = crashGlitch(t, crashAt);
      const down = t >= crashAt ? 1 - P(t, crashAt + T3.crashD - 0.3, 0.4) : 0;
      const safeAt = c[3] + T3.safe;
      s.board.tools.forEach((tile, i) => {
        const [x, y] = toolSlot(i);
        place(tile, x + zoneDx + glitch.dx, y, 1, zoneIn * lerp(1, 0.35, down));
        const safe = i === DB_TOOL && t >= safeAt;
        let border = C.line;
        if (glitch.red || down > 0.5) border = C.red;
        else if (safe) border = C.neon;
        tile.style.borderColor = border;
        tile.icon.setAttribute('stroke', safe ? C.neon : C.ink);
        tile.style.boxShadow = safe ? glowShadow(RGB.neon, P(t, safeAt, 0.4), { blur: 30, alpha: 0.5 }) : '';
      });
      s.board.zone.style.transform += glitch.dx ? ` translateX(${glitch.dx}px)` : '';
      const crashTagX = BOARD.tools.x + BOARD.tools.w / 2 - 20 - agentTagW('CRASH') / 2;
      placeAgentTag(s.crashTag, t, crashAt, crashTagX, BOARD.tools.y - BOARD.tools.h / 2 + 37,
        crashAt + T3.crashD);

      // the agent: it pops in on the replay lane, turns red as it acts, then travels to the board's model place,
      // calming down, as its label turns from CODING AGENT to AI MODEL; it then steps up and aside, shrinking to 2/3,
      // to wait above Maya's phone, its eyes on the held card
      const agentPop = backPop(t, c[1] + T1.agent);
      const red = P(t, c[1] + T1.red, 0.3) * (1 - P(t, c[2] + T2.move, 0.6));
      const orb = s.board.orb;
      const orbX = Math.round(lerp(AGENT.x, ORB_ASIDE.x, aside));
      const orbY = Math.round(lerp(lerp(AGENT.y, BOARD.model.y, move), ORB_ASIDE.y, aside));
      place(s.orbMount, orbX, orbY, lerp(1, ORB_ASIDE.scale, aside), 1);
      place(orb.el, 0, 0, agentPop.s, agentPop.o);
      let look = Math.sin(G * 0.8) * 0.4;
      if (red > 0) look = 0.6;
      else if (aside > 0) look = lerp(look, 0.7, aside);
      orb.set(red > 0 ? 'hijacked' : 'idle', { mix: red, look });
      setText(orb.label, move < 0.5 ? 'CODING AGENT' : 'AI MODEL');
      orb.label.style.opacity = Math.abs(1 - 2 * move) ** 2;

      // ---------- the card goes to the checkpoint, which holds it (violet), then shuts once Maya says no
      const grow = P(t, c[2] + T2.card, 0.3);
      const go = P(t, c[2] + T2.go, T2.goD);
      s.card.place(Math.round(lerp(BOARD.model.x, HOLD.x, go)), HOLD.y, lerp(0.4, 1, grow), grow);
      if (t >= shutAt) s.card.setTone('red');
      else if (t >= holdAt) s.card.setTone('violet');
      else s.card.setTone(null);
      if (t >= shutAt) s.board.checkpoint.check(t, shutAt, 'block');
      else s.board.checkpoint.check(t, holdAt, 'hold');
      placeAgentTag(s.needs, t, holdAt + 0.1, HOLD.x, TAG_Y, shutAt - 0.15);
      placeAgentTag(s.rejected, t, shutAt, HOLD.x, TAG_Y);
      placeRipples(s.shutRipples, t, shutAt, BOARD.checkpoint.x, BOARD.laneY, 120, 460, { d: 0.8, step: 0.16 });

      // Maya's phone rises in under the model; a violet spark carries the request to it, and the request slides up
      // on its screen. The deadline line lights as "the deadline" is read. Maya taps Reject: a red spark carries her
      // no back to the checkpoint.
      const phoneIn = P(t, c[2] + T2.phone, 0.7);
      place(s.phone.el, PHONE.x, PHONE.y + Math.round(80 * (1 - phoneIn)), 1, phoneIn);
      s.phone.set(t, c[2] + T2.screen, 'reject', rejectAt);
      const lit = P(t, c[3] + T3.deadline, 0.3);
      s.deadline.style.color = lit > 0.5 ? C.ink : C.slate;
      s.deadline.style.textShadow = glowShadow(RGB.violet, lit, { blur: 14, alpha: 0.9 });
      const phoneTop = PHONE.y - APPROVAL_CARD.h / 2;
      const cpTop = [BOARD.checkpoint.x - CHECKPOINT.w / 2, BOARD.checkpoint.y - 132];
      const phoneEdge = [PHONE.x + APPROVAL_CARD.w / 2, phoneTop + 60];
      const arc = [cpTop, [cpTop[0] - 160, 200], [phoneEdge[0] + 120, 210], phoneEdge];
      const toPhone = P(t, c[2] + T2.spark, T2.sparkD);
      const [ax, ay] = bezier(arc, toPhone);
      place(s.toPhone, ax, ay, 1, toPhone > 0 && toPhone < 1 ? 1 : 0);
      placeRipples(s.phoneRipples, t, c[2] + T2.spark + T2.sparkD, phoneEdge[0], phoneEdge[1], 40, 220,
        { d: 0.7, step: 0.15 });
      const back = P(t, c[3] + T3.spark, T3.sparkD);
      const [bx, by] = bezier([...arc].reverse(), back);
      place(s.toCheckpoint, bx, by, 1, back > 0 && back < 1 ? 1 : 0);

      // the waiting clock runs from WED 10:00 to Maya's answer, through the crash, then leaves with the verdict
      const clockPop = popIn(t, c[3] + T3.clock);
      place(s.clock, CLOCK.x, CLOCK.y, clockPop.s, clockPop.o * (1 - P(t, shutAt, 0.3)));
      setClock(s.clock, WAIT.answerMin * P(t, c[3] + T3.run, rejectAt - c[3] - T3.run, linear));

      // the Event History: the held step, the request to Maya, then Maya's no
      fillHistoryStrip(s.board.history, t, [
        { at: c[2] + T2.rowHeld, tag: 'NEEDS APPROVAL', tone: 'violet' },
        { at: c[2] + T2.rowAsked, tag: 'WAITING', tone: 'violet' },
        { at: c[3] + T3.row, tag: 'REJECTED BY MAYA', tone: 'red' },
      ]);

      // the database stays whole: SAFE, inside its tile
      placeAgentTag(s.safe, t, safeAt, SAFE_X, dbToolY);
      placeRipples(s.safeRipples, t, safeAt, dbToolX, dbToolY, 120, 520, { d: 0.9, step: 0.18 });
    }
  });
}
