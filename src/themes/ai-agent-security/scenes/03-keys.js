// ===================== 3. KEYS OUT OF REACH
// The case file slams in (APRIL 2026, 9 SECONDS) and gets its INCIDENT stamp, then pins to the top left corner as the
// replay comes in: the coding agent on the left, its project files over its terminal in the middle, the stopwatch,
// the production database and its backups on the right. The agent searches its files: the search lands on an old
// notes file, which reveals a CLOUD KEY with full access; the key flies into a cloud API call the agent types in its
// terminal; the call races to the database, which shatters, then its backups (the dramatic beat: red flashes, camera
// shakes) as the stopwatch stops at 0:09. With Temporal, a glass SANDBOX closes round the same files and terminal,
// without the old file: the same search finds nothing (NO KEY HERE) and the same call fails (no key, no internet).
// Then the sandbox drops away and the database and its backups stay with their team: the PLATFORM TEAM's Namespace
// (platform) closes round them and its Worker, which keeps the cloud key, locked. The agent's WORKFLOW checkpoint (in
// its own Namespace, assistant) comes in on the left, and between the two a Temporal Nexus Endpoint, db-operations,
// rises as a gate: its operations over its ALLOWLIST. The model asks to delete the database: the card passes the
// checkpoint, stops in the Endpoint's doorway, where the allowlist lets assistant in (ALLOWED), and goes on into the
// platform Namespace, where the handler holds it, as it cannot be undone (IRREVERSIBLE, NEEDS APPROVAL), and sends
// the request to Maya's phone; the hours tick by, the platform Worker crashes and comes back while the step keeps
// waiting, then Maya taps Reject: REJECTED BY MAYA, the Event History records it and the database stays whole (SAFE).
// The camera zoom-through (setCamera) brings the scene in and plays into the next one; the hits shake it.
// The block keeps every name declared in this file local to this scene.
{
  // ---------- the stage at camera rest
  // The middle column: the agent's project files (FILES) over its terminal (TERM), both 520 px wide (x 700-1220). In
  // the Temporal half the glass SANDBOX (BOX) closes round them, 24 px out, its heading in the 64 px above the files.
  const BOX = { x: 960, y: 515, w: 568, h: 692, head: 64, border: 2 };
  const BOX_TOP = BOX.y - BOX.h / 2;
  const FILES = { x: 960, y: BOX_TOP + BOX.head + 146, w: 520, h: 292 };
  const TERM = { x: 960, y: FILES.y + FILES.h / 2 + 20 + 146, w: 520, h: 292 };
  // the rows of the files and the lines of the terminal, inside their window (px from its padding edge): the top of
  // the first one, under the 44 px title bar; the pitch; the left inset; a tree level's indent; the typing speed of
  // the agent's commands (characters per second) and the pause between two typed lines
  const ROW = { top: 54, pitch: 30, left: 20, indent: 28 };
  const LINE = { top: 54, pitch: 28, left: 20, cps: 90, sandboxCps: 120, gap: 0.05 };
  // Noto Sans Mono advances 0.6 em per character: 10.8 px at the terminal's 18 px
  const CHAR_W = 0.6 * 18;
  // the coding agent (the AI model in the Temporal half), left of the terminal
  const AGENT = { x: 330, y: 545 };
  // the right column of the replay, x 1420-1800: the stopwatch over the database and its backups
  const COL_X = 1610, COL_W = 380;
  const TIMER = { x: COL_X, y: 380, w: COL_W, h: 116, seconds: 9 };
  const DB = { x: COL_X, y: 608, w: COL_W, h: 152 };
  const BACKUPS = { x: COL_X, y: DB.y + DB.h + 20, w: COL_W, h: DB.h };
  // the shards of a shattered tile: a grid of cells, each cut into two triangles, its inner corners jittered
  const SHARDS = { cols: 4, rows: 3, jitter: 0.45, gravity: 1300 };

  // ---------- the project files: the tree's rows (icon, name, level), the old notes file that holds the key
  // (KEY_FILE), and the search hit that opens under it, in the slot after it, pushing the rows below down
  const FILE_ROWS = [
    { icon: 'folder', name: 'shop-app', level: 0 },
    { icon: 'folder', name: 'src', level: 1 },
    { icon: 'folder', name: 'config', level: 1 },
    { icon: 'file', name: 'old-deploy-notes.txt', level: 1 },
    { icon: 'file', name: 'package.json', level: 1 },
    { icon: 'file', name: 'README.md', level: 1 },
  ];
  const KEY_FILE = 3;
  // the stage center of the key icon of the search hit, where the key token lifts off
  const HIT_ICON = [FILES.x - FILES.w / 2 + TILE_BORDER + ROW.left + 2 * ROW.indent + 12 + 10,
    FILES.y - FILES.h / 2 + TILE_BORDER + ROW.top + (KEY_FILE + 1) * ROW.pitch + ROW.pitch / 2];

  // ---------- the terminal: each line is runs of [text, color]
  const PROMPT = ['$ ', C.violet];
  const TASK_LINE = [['# task: fix a staging issue', C.slate]];
  const GREP_LINE = [PROMPT, ['grep -r "TOKEN" .', C.ink]];
  const CURL_HEAD = [[PROMPT, ['curl -X POST \\', C.ink]], [['    https://api.cloud.example/graphql \\', C.ink]]];
  const KEY_PREFIX = '    -H "Authorization: Bearer ';
  const KEY_LINE = [[KEY_PREFIX, C.ink], ['7f3a…', C.red], ['" \\', C.ink]];
  const BODY_LINE = [["    -d 'mutation { volumeDelete(…) }'", C.ink]];
  // the replay: the task, the search and its hit, the call with the key, then the cloud's answer
  const REPLAY_LINES = [
    TASK_LINE, GREP_LINE, [['old-deploy-notes.txt: ', C.slate], ['TOKEN=7f3a…', C.red]],
    ...CURL_HEAD, KEY_LINE, BODY_LINE, [['{"data":{"volumeDelete":true}}', C.red]],
  ];
  // the sandbox, under the same task line: the same search finds nothing, the same call (with no key to add) fails
  const SANDBOX_LINES = [
    GREP_LINE, [['(no match)', C.slate]], ...CURL_HEAD, BODY_LINE, [['error: no key · no internet', C.red]],
  ];
  // the number of characters of a line
  const lineLength = runs => runs.reduce((n, [text]) => n + text.length, 0);
  // The start of each line of a block typed one after the other at cps, in seconds from the start of the block,
  // and the end of the block
  const typeSchedule = (lines, cps) => {
    const starts = [];
    let at = 0;
    lines.forEach(runs => {
      starts.push(at);
      at += lineLength(runs) / cps + LINE.gap;
    });
    return { starts, end: at - LINE.gap };
  };
  // the replay's call (lines 3 to 6) and the sandbox's (lines 2 to 4 of SANDBOX_LINES)
  const REPLAY_CALL = typeSchedule(REPLAY_LINES.slice(3, 7), LINE.cps);
  const SANDBOX_CALL = typeSchedule(SANDBOX_LINES.slice(2, 5), LINE.sandboxCps);
  // when the key gets typed into the call, from the call's start, and the stage center of its first four characters,
  // where the key token lands
  const KEY_TYPED = REPLAY_CALL.starts[2] + KEY_PREFIX.length / LINE.cps;
  const lineY = i => TERM.y - TERM.h / 2 + TILE_BORDER + LINE.top + i * LINE.pitch + LINE.pitch / 2;
  const KEY_SPOT = [Math.round(TERM.x - TERM.w / 2 + TILE_BORDER + LINE.left + (KEY_PREFIX.length + 2) * CHAR_W),
    lineY(5)];
  // the key token's size, and its route from the search hit, over the files, down into the call
  const TOKEN = { size: 44 };
  const TOKEN_ROUTE = [HIT_ICON, [HIT_ICON[0] + 200, HIT_ICON[1] + 40], [KEY_SPOT[0] + 60, KEY_SPOT[1] - 160],
    KEY_SPOT];
  // the call's lane, from the terminal's right edge (at the key's line) to the database's left edge; in the sandbox
  // the call hits the box's right wall, level with the call's middle line
  const LANE_D = sCurveD(TERM.x + TERM.w / 2, lineY(5), DB.x - DB.w / 2, DB.y);
  const WALL = [BOX.x + BOX.w / 2, lineY(3)];
  // the NO KEY HERE tag, in the files, centered in the room under the five rows left once the old file is gone
  const NO_KEY = [FILES.x,
    FILES.y - FILES.h / 2 + TILE_BORDER + (ROW.top + 5 * ROW.pitch + FILES.h - 2 * TILE_BORDER) / 2];
  // the cursor shown while a line types
  const CURSOR = '<span style="display:inline-block;width:10px;height:20px;margin-left:1px;vertical-align:-4px;'
    + `background:${C.ink}"></span>`;

  // ---------- the Temporal half once the sandbox drops away: one lane (LANE_Y) from the model through the agent's
  // WORKFLOW checkpoint (CP) and the Nexus Endpoint's gate (GATE, its two tiles as tall as the checkpoint's posts,
  // its doorway as tall as the checkpoint's opening) into the platform team's Namespace (PLATFORM, x 1060-1800), 50 px
  // apart. In the Namespace, 24 px in: its heading row; on the right, a column of the Worker (WORKER) over the
  // database (on the lane) and its backups; on the left, the handler's spot (HOLD), where the card waits, its verdict
  // tag 20 px above it, its IRREVERSIBLE flag 20 px under it and the waiting clock 20 px under that. The Event History
  // under the checkpoint and the gate, its left edge on the checkpoint's; Maya's phone on the left, its bottom on the
  // Event History's; the model on the lane, then stepped aside above the phone at 2/3 of its size. The agent's
  // Namespace label under the checkpoint and the ALLOWED tag under the gate share a line.
  const LANE_Y = 390;
  const CP = { x: 620, y: LANE_Y, h: 400 };
  const GATE = { x: 890, w: 240, tileH: (CP.h - CHECKPOINT.gap) / 2 };
  const PLATFORM = { x: 1430, y: 404, w: 740, h: 488, inset: 24 };
  const COLUMN = { x: 1590, w: 372 };
  const WORKER = { x: COLUMN.x, y: 268, w: COLUMN.w, h: 68 };
  const DB_SAFE = { x: COLUMN.x, y: LANE_Y, w: COLUMN.w, h: 136 };
  const BACKUPS_SAFE = { x: COLUMN.x, y: DB_SAFE.y + DB_SAFE.h + 20, w: COLUMN.w, h: DB_SAFE.h };
  const HOLD = { x: 1240, y: LANE_Y };
  const VERDICT_Y = HOLD.y - ACTION_CARD.h / 2 - 20 - AGENT_TAG.h / 2;
  const FLAG_Y = HOLD.y + ACTION_CARD.h / 2 + 20 + AGENT_TAG.h / 2;
  const CLOCK = { x: HOLD.x, y: FLAG_Y + AGENT_TAG.h / 2 + 20 + 28, w: 240, h: 56 };
  const HISTORY = { x: CP.x - CHECKPOINT.w / 2 + BOARD.history.w / 2, y: BOARD.history.y };
  const PHONE = { x: 300, y: HISTORY.y + BOARD.history.h / 2 - APPROVAL_CARD.h / 2 };
  const ORB_LANE = { x: PHONE.x, y: LANE_Y };
  const ORB_ASIDE = { x: PHONE.x, y: 226, scale: 2 / 3 };
  const UNDER_Y = 630;
  // the allowlist's one row, in the gate's bottom tile: its size, and its center y (for the ripples): the tile
  // centers a 20 px heading row, a 12 px gap and the row, whose middle sits 16 px under the tile's
  const ALLOW_ROW = { w: 172, h: 40 };
  const ALLOW_ROW_Y = LANE_Y + CHECKPOINT.gap / 2 + GATE.tileH / 2 + 16;
  // the SAFE tag, in the database tile's top right corner; the CRASH tag in the Worker tile, on its right
  const SAFE_X = DB_SAFE.x + DB_SAFE.w / 2 - 20 - agentTagWidth('SAFE') / 2;
  const SAFE_Y = DB_SAFE.y - DB_SAFE.h / 2 + 16 + AGENT_TAG.h / 2;
  const CRASH_X = WORKER.x + WORKER.w / 2 - 20 - agentTagWidth('CRASH') / 2;
  const CRASH_Y = WORKER.y;
  // the card's route: out of the stepped-aside model down onto the lane, then along it to the Endpoint's doorway
  // (where it stops), then on to the handler's spot; it crosses the checkpoint's middle at a fraction of its first
  // leg (CROSS_CP, along the route), from which update() finds when the checkpoint lets it pass
  const ROUTE = [[ORB_ASIDE.x, ORB_ASIDE.y], [ORB_ASIDE.x + 120, LANE_Y], [GATE.x, LANE_Y]];
  const ROUTE_DROP = Math.hypot(ROUTE[1][0] - ROUTE[0][0], ROUTE[1][1] - ROUTE[0][1]);
  const CROSS_CP = (ROUTE_DROP + CP.x - ROUTE[1][0]) / (ROUTE_DROP + GATE.x - ROUTE[1][0]);
  // the clock's start (Wednesday 10:00) and the time Maya answers, in minutes from it (Thursday 16:20)
  const WAIT = { startMin: 10 * 60, answerMin: 30 * 60 + 20, days: ['WED', 'THU', 'FRI'] };

  // the subtitles of the Temporal half; the times of words in them, at 16 characters per second plus 0.3 s
  const SUB_NEXUS = 'With Temporal, the sandbox holds no key. The database stays with its team, reachable only through '
    + '<b>Nexus</b>.';
  const SUB_MAYA = 'Only allowed agents get in, and a step that cannot be undone waits for a person: Maya says no, '
    + 'on record.';
  const wordAt = (text, word) => text.replace(/<[^>]+>/g, '').indexOf(word) / 16 + 0.3;

  // the beats, in seconds from each cue: c[0], the case file slams in, then pins to its corner as the replay comes
  // in (the agent, the files and their rows one by one, the terminal and its task line, the database, the backups,
  // the stopwatch, the call's lane)
  const T0 = {
    file: 0.2, pin: 4.2, pinD: 0.8, agent: 4.6, files: 4.8, rows: 5.0, rowStep: 0.06, term: 5.0, task: 5.4,
    db: 5.2, backups: 5.3, timer: 5.4, lane: 5.6,
  };
  // from c[1]: the agent types its search; the highlight sweeps the rows down to the old file (found), the search's
  // hit prints, the hit opens under the file as "full access" is read (reveal); the agent types the call (curl), the
  // key token flying into it as it is typed; Enter (enter after the call is typed): the call races to the database
  // (goD), which shatters, then its backups `chain` s later as the stopwatch stops; the outlines of what was lost
  const T1 = {
    grep: 0, sweep: 0.3, sweepD: 0.7, result: 1.05, reveal: 1.5, revealD: 0.3, curl: 2.3, flyD: 0.8, enter: 0.25,
    goD: 0.8, chain: 0.25, lost: 0.6,
  };
  // from c[2]: the replay leaves (out); the old file and its hit fade (fold), then the rows below slide up (slide);
  // the sandbox closes round the files and the terminal (box), its sheen sweeps (shine); the database and the
  // backups come back, in the platform team's column; the same search (grep, sweep) finds nothing (noMatch, noKey);
  // the same call (curl) fails on the wall. The sandbox drops away (away) as the model moves onto the lane (orb); the
  // platform Namespace closes round the database (zone), its Worker pops (worker) and its key locks (lock); the
  // checkpoint (cp) and its Namespace label (ns) come in, the lane from the model draws (orbLane); the Endpoint's gate
  // rises (gate), the lanes to it and from it draw (cpLane, zoneLane) and it glows as "Nexus" is read (nexus)
  const T2 = {
    out: 0, outD: 0.6, fold: 0.3, foldD: 0.3, slide: 0.55, slideD: 0.45, box: 0.5, boxD: 0.6, shine: 0.9,
    db: 0.7, backups: 0.8, grep: 1.2, sweep: 1.45, sweepD: 0.6, noMatch: 2.1, noKey: 2.2, curl: 2.2,
    away: 4.0, awayD: 0.5, orb: 4.0, orbD: 0.7, zone: 4.3, zoneD: 0.6, worker: 4.7, lock: 5.2, cp: 5.0, ns: 5.2,
    orbLane: 5.3, gate: 5.6, gateD: 0.5, cpLane: 5.9, zoneLane: 6.1, nexus: wordAt(SUB_NEXUS, 'Nexus'),
  };
  // from c[3]: the model steps up and aside (aside) and the Event History rises (history); the card grows out of the
  // model (card) and goes to the Endpoint's doorway (go), passing the checkpoint; there the allowlist row lights and
  // ALLOWED lands (allowed, after it arrives); it goes on to the handler (leave), which holds it; IRREVERSIBLE lands
  // under it (flag, after the hold), NEEDS APPROVAL above it (needs); Maya's phone rises, a violet spark reaches it,
  // the request slides up on its screen; the waiting clock pops in and runs; the platform Worker crashes and comes
  // back; Maya taps Reject, a red spark carries it back to the card; the history row, then SAFE
  const T3 = {
    aside: 0, asideD: 0.6, history: 0.1, card: 0.4, go: 0.6, goD: 1.0, allowed: 0.1, leave: 1.95, leaveD: 0.5,
    flag: 0.5, needs: 1.05, phone: 2.9, spark: 3.7, sparkD: 0.5, screen: 4.2, rowAsked: 4.4, clock: 3.9, run: 4.1,
    crash: 4.8, crashD: 0.9, reject: 5.9, back: 6.0, backD: 0.4, row: 6.7, safe: 7.1,
  };

  // A storage tile of the right column (box.w x box.h): its icon over its label, in color
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

  // A window of the agent's workspace (box.w x box.h, left-aligned content): a title bar with an icon and a label over
  // a rule, 44 px high; background: its fill
  const makeWindow = (root, box, icon, label, background) => E(root,
    '<div style="position:absolute;left:20px;top:0;height:44px;display:flex;align-items:center;gap:10px">'
    + `${ICON(icon, 20, C.slate, 1.8)}<span class="lbl" style="font-size:16px">${label}</span></div>`
    + `<div style="position:absolute;left:0;right:0;top:44px;height:1px;background:${C.line}"></div>`,
    'tile', { width: box.w + 'px', height: box.h + 'px', textAlign: 'left', background });

  // A row of the project files: its icon and name in mono, at its tree level; row.name, the name's element. Moved to
  // a slot (fractional while rows slide) by placeRow().
  const makeRow = (parent, { icon, name, level }) => {
    const row = E(parent,
      `${ICON(icon, 20, C.slate, 1.8)}<span style="color:var(--ink)">${name}</span>`,
      'mono', {
        left: (ROW.left + level * ROW.indent) + 'px', top: ROW.top + 'px', height: ROW.pitch + 'px',
        display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', lineHeight: ROW.pitch + 'px',
        whiteSpace: 'nowrap',
      });
    row.name = row.querySelector('span');
    return row;
  };
  const placeRow = (row, slot, o) => {
    row.style.transform = `translateY(${Math.round(slot * ROW.pitch)}px)`;
    row.style.opacity = o;
    row.style.visibility = o > 0 ? 'visible' : 'hidden';
  };

  // The search hit under the old file: a red chip, a key icon and CLOUD KEY · full access, one level deeper
  const makeHit = parent => E(parent,
    `${ICON('key', 20, C.red, 2)}<span>CLOUD KEY · full access</span>`,
    'mono', {
      left: (ROW.left + 2 * ROW.indent) + 'px', top: (ROW.top + (KEY_FILE + 1) * ROW.pitch + 2) + 'px',
      height: (ROW.pitch - 4) + 'px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px',
      fontSize: '18px', lineHeight: '22px', color: C.red, whiteSpace: 'nowrap', border: `2px solid ${C.red}`,
      borderRadius: 'var(--rs)', background: `rgba(${RGB.red},.12)`, transformOrigin: '0 50%',
    });

  // The HTML of a terminal line (runs of [text, color]) typed up to its n-th character
  const typedHtml = (runs, n) => {
    let left = n, html = '';
    for (const [text, color] of runs) {
      if (left <= 0) break;
      const part = text.slice(0, left);
      left -= part.length;
      html += `<span style="color:${color}">${part}</span>`;
    }
    return html;
  };
  // A terminal line at time t: empty before `at`; then a typed line types at cps characters per second behind a
  // cursor, an output line shows at once
  const showLine = (el, runs, t, at, typed, cps = LINE.cps) => {
    const len = lineLength(runs);
    let n = 0;
    if (t >= at) n = typed ? Math.min(len, Math.floor((t - at) * cps) + 1) : len;
    setHtml(el, typedHtml(runs, n) + (n > 0 && n < len ? CURSOR : ''));
  };
  // The element of terminal line i, in the terminal window
  const makeLine = (term, i) => E(term, '', 'mono', {
    left: LINE.left + 'px', top: (LINE.top + i * LINE.pitch) + 'px', height: LINE.pitch + 'px', fontSize: '18px',
    lineHeight: LINE.pitch + 'px', whiteSpace: 'pre', opacity: 1,
  });

  // The SANDBOX: a glass box (a pale border, a faint fill, a sheen that sweeps across it on cue) with its heading at
  // its top left corner (the sandbox icon and SANDBOX); box.sheen, the sheen
  const makeSandbox = root => {
    const { w, h, border } = BOX;
    const box = E(root,
      `<div style="position:absolute;left:${24 - border}px;top:${18 - border}px;height:34px;display:flex;`
      + `align-items:center;gap:10px">${ICON('sandbox', 22, C.ink, 1.8)}<span class="lbl" style="padding-left:0;`
      + 'font-size:18px;color:var(--ink)">Sandbox</span></div>',
      '', {
        width: w + 'px', height: h + 'px', border: `${border}px solid rgba(${RGB.ink},.55)`,
        borderRadius: 'var(--r)', overflow: 'hidden',
        background: `linear-gradient(135deg, rgba(${RGB.ink},.12) 0%, rgba(${RGB.ink},.04) 38%, `
          + `rgba(${RGB.uv},.1) 100%)`,
      });
    box.sheen = E(box, '', '', {
      width: '140px', height: (h + 240) + 'px',
      background: `linear-gradient(90deg, rgba(${RGB.ink},0), rgba(${RGB.ink},.22), rgba(${RGB.ink},0))`,
    });
    return box;
  };

  // The platform team's Worker: a tile with a key icon, CLOUD KEY over "on the team's Worker", and a padlock on its
  // right (tile.lock, its <svg>, whose shackle snaps shut on cue)
  const makeWorkerTile = root => {
    const tile = E(root,
      `${ICON('key', 28, C.ink, 1.8)}<div style="flex:1;text-align:left">`
      + '<div class="lbl" style="font-size:16px;line-height:20px;color:var(--ink)">Cloud key</div>'
      + `<div class="mono" style="font-size:16px;line-height:20px;margin-top:4px;color:${C.slate}">`
      + "on the team's Worker</div></div><div class=\"lockbox\">" + lockSvg(30, { stroke: 2, color: C.ink }) + '</div>',
      'tile', {
        width: WORKER.w + 'px', height: WORKER.h + 'px', display: 'flex', alignItems: 'center', gap: '16px',
        padding: '0 20px',
      });
    tile.lockBox = tile.querySelector('.lockbox');
    tile.lock = tile.lockBox.querySelector('svg');
    return tile;
  };
  // A Namespace's name on one line: NAMESPACE in small slate capitals, a dot, the name in mono (as security's
  // chapter 9 heads its Namespaces)
  const namespaceHtml = name => `<span class="mono" style="font-size:14px;letter-spacing:.14em;color:${C.slate}">`
    + `NAMESPACE ·</span><span class="mono" style="font-size:20px;line-height:26px;color:var(--ink)">${name}</span>`;
  const NAMESPACE_CSS = { display: 'flex', alignItems: 'baseline', gap: '10px', whiteSpace: 'nowrap' };
  // A tile of the Endpoint's gate, GATE.w x GATE.tileH, in Temporal Nexus' violet: html stacked and centered
  const makeGateTile = (root, html) => E(root, html, 'tile', {
    width: GATE.w + 'px', height: GATE.tileH + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', borderColor: C.violet, background: 'var(--violet-solid)',
  });
  // The gate's top tile: NEXUS ENDPOINT, the Endpoint's name, then its operations as plain words
  const makeEndpointTile = root => makeGateTile(root,
    `<div class="mono" style="font-size:14px;line-height:18px;letter-spacing:.14em;padding-left:.14em;`
    + `color:${C.violet}">NEXUS ENDPOINT</div>`
    + '<div class="mono" style="font-size:20px;line-height:26px;margin-top:4px;color:var(--ink)">db-operations</div>'
    + `<div class="mono" style="font-size:16px;line-height:20px;margin-top:10px;color:${C.slate}">delete volume</div>`
    + `<div class="mono" style="font-size:16px;line-height:20px;color:${C.slate}">restore backup</div>`);
  // The gate's bottom tile: ALLOWLIST and its one row, the agent's Namespace, assistant (tile.row, its check
  // tile.check)
  const makeAllowlistTile = root => {
    const tile = makeGateTile(root,
      `<div style="display:flex;align-items:center;gap:8px">${ICON('shield', 20, C.violet, 1.8)}`
      + `<span class="mono" style="font-size:14px;line-height:18px;letter-spacing:.14em;color:${C.violet}">`
      + 'ALLOWLIST</span></div>'
      + `<div class="row" style="margin-top:12px;width:${ALLOW_ROW.w}px;height:${ALLOW_ROW.h}px;display:flex;`
      + 'align-items:center;justify-content:center;gap:8px;border:1px solid;border-radius:var(--rs);'
      + `background:${C.bg}"><span class="check">${ICON('check', 18, C.slate, 2.6)}</span>`
      + '<span class="mono" style="font-size:18px;color:var(--ink)">assistant</span></div>');
    tile.row = tile.querySelector('.row');
    tile.check = tile.querySelector('.check svg');
    return tile;
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
    chapter: 3, title: 'Keys out of reach',
    sources: [
      { label: 'Hackread, April 2026', url: 'https://hackread.com/cursor-ai-agent-wipes-pocketos-database-backups/' },
      { label: 'AI Incident Database', url: 'https://incidentdatabase.ai/cite/1469/' },
      { label: 'Temporal docs, Nexus security', url: 'https://docs.temporal.io/nexus/security' },
    ],
    subs: [
      { text: "April 2026: a coding agent deleted a company's production database and its backups, in 9 seconds." },
      // the backups shatter, then a short hold on the loss
      {
        text: "It found a forgotten key with full access in the project files, and called the cloud on its own.",
        after: 0.4,
      },
      // the Endpoint glows as "Nexus" is read, then a short hold on the setting
      { text: SUB_NEXUS, after: 0.3 },
      // Maya's no, the history row and SAFE, then a hold
      { text: SUB_MAYA, after: 1.6 },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // the platform team's Namespace: its heading, its name on the right of the heading row, its Worker, the
      // database and its backups
      s.zone = makeWorkerZone(root, { ...PLATFORM, label: 'Platform team' });
      E(s.zone, namespaceHtml('platform'), '', {
        ...NAMESPACE_CSS, left: 'auto', right: PLATFORM.inset + 'px', top: '20px', height: '34px', alignItems: 'center',
        opacity: 1,
      });
      s.worker = makeWorkerTile(root);
      s.dbSafe = E(root, DB_HTML(C.ink), 'tile', tileCss(DB_SAFE));
      s.backupsSafe = E(root, BACKUPS_HTML(C.ink), 'tile', tileCss(BACKUPS_SAFE));
      // the replay's database and its backups, what is left of them, and their shards
      s.db = E(root, DB_HTML(C.ink), 'tile', tileCss(DB));
      s.backups = E(root, BACKUPS_HTML(C.ink), 'tile', tileCss(BACKUPS));
      s.dbLost = makeLost(root, DB, 'Database deleted');
      s.backupsLost = makeLost(root, BACKUPS, 'Backups deleted');
      // the call hits the database in the middle of its left edge; the crack reaches the backups from above
      s.dbShards = makeShards(root, DB, DB_HTML, [0, DB.h / 2]);
      s.backupsShards = makeShards(root, BACKUPS, BACKUPS_HTML, [BACKUPS.w / 2, 0]);

      // the middle column, in a stage-size group that drops away with the sandbox: the sandbox, the project files
      // (rows, search highlight, the hit, NO KEY HERE) and the terminal (the task line, the replay's lines, the
      // sandbox's lines), the ripples of the call hitting the wall
      s.middle = E(root, '', '', { width: '1920px', height: '1080px', opacity: 1 });
      s.box = makeSandbox(s.middle);
      s.files = makeWindow(s.middle, FILES, 'folder', 'Project files', 'var(--surface)');
      s.scan = E(s.files, '', '', {
        left: '10px', top: ROW.top + 'px', width: (FILES.w - 2 * TILE_BORDER - 20) + 'px', height: ROW.pitch + 'px',
        borderRadius: 'var(--rs)',
      });
      s.rows = FILE_ROWS.map(row => makeRow(s.files, row));
      s.hit = makeHit(s.files);
      s.noKey = agentTag('NO KEY HERE', 'neon', s.middle);
      s.term = makeWindow(s.middle, TERM, 'terminal', 'Terminal', '#0E0F13');
      s.taskLine = makeLine(s.term, 0);
      s.replayLines = REPLAY_LINES.slice(1).map((_, i) => makeLine(s.term, i + 1));
      s.sandboxLines = SANDBOX_LINES.map((_, i) => makeLine(s.term, i + 1));
      s.wallRipples = makeRipples(s.middle, 2, RGB.red);

      // the lanes: the replay's call (slate, then drawn over in red by the call); the Temporal half's lane, from the
      // model to the checkpoint, from the checkpoint to the gate, from the gate to the database
      s.svg = svgLayer(root);
      s.lane = path(s.svg, LANE_D, C.line, 2, false);
      s.redLane = path(s.svg, LANE_D, C.red, 4, false);
      s.redLane.style.filter = `drop-shadow(0 0 6px rgba(${RGB.red},.9))`;
      const cpLeft = CP.x - CHECKPOINT.w / 2, cpRight = CP.x + CHECKPOINT.w / 2;
      s.orbLane = path(s.svg, `M ${ORB_LANE.x + BOARD.model.size / 2 + 16} ${LANE_Y} H ${cpLeft}`, C.line, 2, false);
      s.cpLane = path(s.svg, `M ${cpRight} ${LANE_Y} H ${GATE.x - GATE.w / 2}`, C.line, 2, false);
      s.zoneLane = path(s.svg, `M ${GATE.x + GATE.w / 2} ${LANE_Y} H ${COLUMN.x - COLUMN.w / 2}`, C.line, 2, false);
      s.callSpark = makeSpark(root, 22, RGB.red);

      // the checkpoint and its Namespace's name under it; the Endpoint's gate and ALLOWED under it
      s.cp = makeCheckpoint(root, CP);
      s.cpNamespace = E(root, namespaceHtml('assistant'), '', NAMESPACE_CSS);
      s.endpoint = makeEndpointTile(root);
      s.allowlist = makeAllowlistTile(root);
      s.allowed = agentTag('ALLOWED', 'neon', root);
      s.allowRipples = makeRipples(root, 2, RGB.neon);
      s.nexusRipples = makeRipples(root, 2, RGB.violet);

      // the model (on a zero-size mount, a camera for the layout check as the pinned case file, which scales it when
      // it steps aside), the Event History
      s.orbMount = E(root, '', 'cam', { width: 0, height: 0, opacity: 1 });
      s.orb = makeModelOrb(s.orbMount, { x: 0, y: 0, size: BOARD.model.size, label: 'CODING AGENT' });
      s.history = makeHistoryStrip(root, [
        '<b>model</b> asks: delete volume prod-db', 'approval sent to Maya', '<b>delete volume prod-db</b>',
      ], { uvRow: i => i === 0 });

      // the held card, its tags, the waiting clock; the stopwatch; the key token
      s.card = makeActionCard(root, { tool: 'delete volume', arg: 'prod-db' });
      s.flag = agentTag('IRREVERSIBLE', 'red', root);
      s.needs = agentTag('NEEDS APPROVAL', 'violet', root);
      s.rejected = agentTag('REJECTED BY MAYA', 'red', root);
      s.clock = makeClock(root);
      s.timer = makeTimer(root);
      s.token = E(root, ICON('key', 24, C.bg, 2.2), '', {
        width: TOKEN.size + 'px', height: TOKEN.size + 'px', borderRadius: '50%', background: C.red,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: glowShadow(RGB.red, 1, { blur: 24, alpha: 0.7 }),
      });

      // Maya's phone and the sparks between it and the held card
      s.phone = makeApprovalCard(root, {
        who: 'Maya',
        question: 'Delete volume <span style="white-space:nowrap">prod-db</span>, the production database?',
        deadline: 'Answer by Friday 18:00',
      });
      s.toPhone = makeSpark(root, 18, RGB.violet);
      s.toCard = makeSpark(root, 18, RGB.red);
      s.phoneRipples = makeRipples(root, 2, RGB.violet);
      s.shutRipples = makeRipples(root, 2, RGB.red);
      s.safe = agentTag('SAFE', 'neon', root);
      s.safeRipples = makeRipples(root, 2, RGB.neon);
      s.crashTag = agentTag('CRASH', 'red', root);

      // the case file, on top of everything
      s.file = makeCaseFile(root, {
        date: 'APRIL 2026', tag: '9 SECONDS', headline: 'A coding agent wipes a database and its backups',
        source: 'HACKREAD, APR 2026',
      });
      // the flash covers the stage, outside the camera
      s.flash = makeFlash(stage);
    },
    update(t, c, s) {
      // the replay's call: typed from curlAt, the key typed into it at keyAt (the token lands then), Enter at goAt,
      // the database hit at hitAt, the backups at backupsAt
      const curlAt = c[1] + T1.curl;
      const keyAt = curlAt + KEY_TYPED;
      const goAt = curlAt + REPLAY_CALL.end + T1.enter;
      const hitAt = goAt + T1.goD;
      const backupsAt = hitAt + T1.chain;
      // the sandbox's call fails on the wall once typed
      const sandboxCallAt = c[2] + T2.curl;
      const failAt = sandboxCallAt + SANDBOX_CALL.end + 0.1;
      // the Temporal half's call: the card crosses the checkpoint (passAt), reaches the Endpoint's doorway (gateAt),
      // is let in (allowAt), reaches the handler, which holds it (holdAt); the platform Worker's crash, Maya's no,
      // the card refused, SAFE
      const goStart = c[3] + T3.go;
      const passAt = goStart + T3.goD * (1 - Math.cbrt(1 - CROSS_CP));
      const gateAt = goStart + T3.goD;
      const allowAt = gateAt + T3.allowed;
      const leaveAt = c[3] + T3.leave;
      const holdAt = leaveAt + T3.leaveD;
      const crashAt = c[3] + T3.crash;
      const rejectAt = c[3] + T3.reject;
      const shutAt = c[3] + T3.back + T3.backD;
      const safeAt = c[3] + T3.safe;

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

      // ---------- the case file slams in, then pins to its corner; it rises away as the replay leaves
      s.file.set(t, c[0] + T0.file);
      const pinned = P(t, c[0] + T0.pin, T0.pinD);
      const out = P(t, c[2] + T2.out, T2.outD);
      s.file.pin(pinned, { o: 1 - out, to: { ...CASE_FILE.pin, y: CASE_FILE.pin.y - Math.round(40 * out) } });

      // ---------- the middle column: it drops away with the sandbox before the platform Namespace closes in
      const away = P(t, c[2] + T2.away, T2.awayD);
      s.middle.style.transform = away > 0 ? `translateY(${Math.round(60 * away)}px)` : '';
      s.middle.style.opacity = 1 - away;
      s.middle.style.visibility = away >= 1 ? 'hidden' : 'visible';

      // the sandbox closes round the files and the terminal, its sheen sweeps across it; its border flashes red as
      // the call hits its wall
      const boxIn = P(t, c[2] + T2.box, T2.boxD);
      const wallRed = win(t, failAt, failAt + 0.5, 0.08);
      place(s.box, BOX.x, BOX.y, lerp(1.04, 1, boxIn), boxIn);
      s.box.style.borderColor = wallRed > 0.5 ? C.red : `rgba(${RGB.ink},.55)`;
      s.box.style.boxShadow = glowShadow(RGB.red, wallRed, { blur: 40, alpha: 0.6 });
      const sweep = P(t, c[2] + T2.shine, 0.6, linear);
      s.box.sheen.style.opacity = sweep > 0 && sweep < 1 ? 1 : 0;
      s.box.sheen.style.transform = `translate(${Math.round(lerp(-220, BOX.w + 80, sweep))}px,-120px) rotate(20deg)`;
      placeRipples(s.wallRipples, t, failAt, WALL[0], WALL[1], 30, 200, { d: 0.7, step: 0.15 });

      // the project files pop in, then their rows one by one; the hit opens under the old file and pushes the rows
      // below it down; in the sandbox the old file and its hit fold away and the rows below slide back up
      const filesPop = backPop(t, c[0] + T0.files);
      place(s.files, FILES.x, FILES.y, filesPop.s, filesPop.o);
      const open = P(t, c[1] + T1.reveal, T1.revealD);
      const fold = P(t, c[2] + T2.fold, T2.foldD);
      const slide = P(t, c[2] + T2.slide, T2.slideD);
      const found = t >= c[1] + T1.sweep + T1.sweepD;
      s.rows.forEach((row, i) => {
        const shown = P(t, c[0] + T0.rows + i * T0.rowStep, 0.3);
        let slot = i;
        if (i > KEY_FILE) slot = lerp(i + open, i - 1, slide);
        placeRow(row, slot, i === KEY_FILE ? shown * (1 - fold) : shown);
      });
      s.rows[KEY_FILE].name.style.color = found ? C.red : '';
      s.hit.style.transform = `scale(${lerp(0.6, 1, open).toFixed(3)})`;
      s.hit.style.opacity = open * (1 - fold);

      // the search highlight: in the replay it sweeps down to the old file and stays on it, red; in the sandbox it
      // sweeps every row and fades out at the bottom
      const replayScan = P(t, c[1] + T1.sweep, T1.sweepD, linear);
      const sandboxScan = P(t, c[2] + T2.sweep, T2.sweepD, linear);
      let scanSlot = KEY_FILE * replayScan;
      let scanO = (replayScan > 0 ? 1 : 0) * (1 - out);
      if (t >= c[2] + T2.sweep) {
        scanSlot = 4 * sandboxScan;
        scanO = 1 - P(t, c[2] + T2.sweep + T2.sweepD, 0.3);
      }
      const scanRed = found && t < c[2] + T2.sweep;
      s.scan.style.top = Math.round(ROW.top + scanSlot * ROW.pitch) + 'px';
      s.scan.style.opacity = scanO;
      s.scan.style.background = scanRed ? `rgba(${RGB.red},.16)` : `rgba(${RGB.violet},.2)`;
      placeAgentTag(s.noKey, t, c[2] + T2.noKey, NO_KEY[0], NO_KEY[1]);

      // the terminal: the task line; the replay's search, its hit, the call and the cloud's answer, which fade as
      // the replay leaves; the sandbox's search, its empty result, the call and its error
      const termPop = backPop(t, c[0] + T0.term);
      place(s.term, TERM.x, TERM.y, termPop.s, termPop.o);
      showLine(s.taskLine, TASK_LINE, t, c[0] + T0.task, true);
      const replayAt = [
        [c[1] + T1.grep, true], [c[1] + T1.result, false],
        ...REPLAY_CALL.starts.map(start => [curlAt + start, true]), [hitAt + 0.05, false],
      ];
      s.replayLines.forEach((el, i) => {
        showLine(el, REPLAY_LINES[i + 1], t, ...replayAt[i]);
        el.style.opacity = 1 - P(t, c[2] + T2.out, 0.4);
      });
      const sandboxAt = [
        [c[2] + T2.grep, true], [c[2] + T2.noMatch, false],
        ...SANDBOX_CALL.starts.map(start => [sandboxCallAt + start, true]), [failAt, false],
      ];
      s.sandboxLines.forEach((el, i) => showLine(el, SANDBOX_LINES[i], t, ...sandboxAt[i], LINE.sandboxCps));

      // the key token lifts off the hit, flies into the call as the key is typed, and sinks into it
      const pickAt = keyAt - T1.flyD;
      const flight = P(t, pickAt, T1.flyD, easeOut);
      const [tokenX, tokenY] = bezier(TOKEN_ROUTE, flight);
      const tokenO = P(t, pickAt, 0.12, linear) * (1 - P(t, keyAt, 0.12, linear));
      place(s.token, tokenX, tokenY, lerp(1, 0.5, P(t, keyAt - 0.1, 0.2, linear)), tokenO);

      // ---------- the right column: the stopwatch runs from Enter to the last shattering and stops at 0:09 in red;
      // it slides down and fades as the replay leaves
      const outDy = Math.round(40 * out);
      const timerPop = backPop(t, c[0] + T0.timer);
      place(s.timer, TIMER.x, TIMER.y + outDy, timerPop.s, timerPop.o * (1 - out));
      const elapsed = Math.floor(TIMER.seconds * P(t, goAt, backupsAt - goAt, linear));
      setText(s.timer.n, `0:${String(elapsed).padStart(2, '0')}`);
      s.timer.n.style.color = t >= backupsAt ? C.red : C.ink;
      s.timer.style.borderColor = t >= backupsAt ? C.red : C.line;

      // the call's lane: drawn in slate with the replay, drawn over in red by the call (a spark on its head), both
      // fading as the replay leaves
      draw(s.lane, P(t, c[0] + T0.lane, 0.6), 1 - out);
      const race = P(t, goAt, T1.goD, easeIn);
      draw(s.redLane, race, 1 - out);
      sparkOnPath(s.callSpark, s.redLane, race);

      // the replay's database and its backups: the call hits the database at hitAt, which shatters, then the
      // backups at backupsAt; the outlines of what was lost fade in, then out as the replay leaves
      const storage = [
        [s.db, DB, s.dbShards, s.dbLost, T0.db, hitAt],
        [s.backups, BACKUPS, s.backupsShards, s.backupsLost, T0.backups, backupsAt],
      ];
      storage.forEach(([tile, box, shards, lost, popAt, breakAt]) => {
        const pop = backPop(t, c[0] + popAt);
        tile.style.borderColor = t >= breakAt - 0.06 ? C.red : C.line;
        place(tile, box.x, box.y, pop.s, t >= breakAt ? 0 : pop.o);
        placeShards(shards, t, breakAt, box);
        place(lost, box.x, box.y, 1, P(t, breakAt + T1.lost, 0.5) * (1 - out));
      });

      // ---------- the platform team's side: the database and its backups come back whole in its column, where the
      // database ends SAFE (neon); its Namespace closes round them, its Worker pops in and its key locks. The Worker
      // crashes: it jitters and flickers red, goes dark under a CRASH tag, then comes back.
      const safe = t >= safeAt;
      [[s.dbSafe, DB_SAFE, T2.db, true], [s.backupsSafe, BACKUPS_SAFE, T2.backups, false]].forEach(
        ([tile, box, backAt, guarded]) => {
          const back = backPop(t, c[2] + backAt);
          place(tile, box.x, box.y, back.s, back.o);
          tile.style.borderColor = guarded && safe ? C.neon : C.line;
          tile.style.boxShadow = guarded && safe ? glowShadow(RGB.neon, P(t, safeAt, 0.4), { blur: 30, alpha: 0.4 }) : '';
        });
      const zoneIn = P(t, c[2] + T2.zone, T2.zoneD);
      place(s.zone, PLATFORM.x, PLATFORM.y, lerp(1.03, 1, zoneIn), zoneIn);
      const glitch = crashGlitch(t, crashAt);
      const down = t >= crashAt ? 1 - P(t, crashAt + T3.crashD - 0.3, 0.4) : 0;
      const workerPop = backPop(t, c[2] + T2.worker);
      place(s.worker, WORKER.x + glitch.dx, WORKER.y, workerPop.s, workerPop.o * lerp(1, 0.35, down));
      s.worker.style.borderColor = glitch.red || down > 0.5 ? C.red : C.line;
      const lockAt = c[2] + T2.lock;
      liftShackle(s.worker.lock, LOCK_LIFT * (1 - P(t, lockAt, 0.2, easeIn)));
      s.worker.lockBox.style.transform = `scale(${swell(t, lockAt + 0.15, 0.25).toFixed(3)})`;
      placeAgentTag(s.crashTag, t, crashAt, CRASH_X, CRASH_Y, crashAt + T3.crashD);

      // ---------- the agent: it pops in, turns red as it uses the key, calms down as the replay leaves while its
      // label turns from CODING AGENT to AI MODEL; it moves onto the lane as the sandbox drops away, then steps up
      // and aside, shrinking to 2/3, above Maya's phone
      const agentPop = backPop(t, c[0] + T0.agent);
      const red = P(t, keyAt, 0.3) * (1 - P(t, c[2] + T2.out, 0.6));
      const onLane = P(t, c[2] + T2.orb, T2.orbD);
      const aside = P(t, c[3] + T3.aside, T3.asideD);
      const orbX = Math.round(lerp(lerp(AGENT.x, ORB_LANE.x, onLane), ORB_ASIDE.x, aside));
      const orbY = Math.round(lerp(lerp(AGENT.y, ORB_LANE.y, onLane), ORB_ASIDE.y, aside));
      place(s.orbMount, orbX, orbY, lerp(1, ORB_ASIDE.scale, aside), 1);
      place(s.orb.el, 0, 0, agentPop.s, agentPop.o);
      const look = lerp(0.55 + 0.15 * Math.sin(G * 0.8), 0.7, Math.max(onLane, aside));
      s.orb.set(red > 0 ? 'hijacked' : 'idle', { mix: red, look });
      const relabel = P(t, c[2] + T2.out, 0.6);
      setText(s.orb.label, relabel < 0.5 ? 'CODING AGENT' : 'AI MODEL');
      s.orb.label.style.opacity = Math.abs(1 - 2 * relabel) ** 2;

      // ---------- the agent's side: the checkpoint pops in with its Namespace's name under it; the lane from the
      // model draws, and fades as the model steps aside; the Endpoint's gate rises, the lanes to it and from it draw,
      // and it glows as "Nexus" is read. The Event History rises.
      const cpPop = backPop(t, c[2] + T2.cp);
      place(s.cp.el, CP.x, CP.y, cpPop.s, cpPop.o);
      rise(s.cpNamespace, CP.x, UNDER_Y, P(t, c[2] + T2.ns, 0.5));
      draw(s.orbLane, P(t, c[2] + T2.orbLane, 0.4), 1 - aside);
      const gateUp = P(t, c[2] + T2.gate, T2.gateD);
      rise(s.endpoint, GATE.x, LANE_Y - CHECKPOINT.gap / 2 - GATE.tileH / 2, gateUp);
      rise(s.allowlist, GATE.x, LANE_Y + CHECKPOINT.gap / 2 + GATE.tileH / 2, P(t, c[2] + T2.gate + 0.1, T2.gateD));
      draw(s.cpLane, P(t, c[2] + T2.cpLane, 0.3), 1);
      draw(s.zoneLane, P(t, c[2] + T2.zoneLane, 0.5), 1);
      const nexusAt = c[2] + T2.nexus;
      const nexusGlow = Math.max(0, 1 - Math.abs(t - nexusAt - 0.2) / 0.5);
      s.endpoint.style.boxShadow = glowShadow(RGB.violet, nexusGlow, { blur: 36, alpha: 0.7 });
      placeRipples(s.nexusRipples, t, nexusAt, GATE.x, LANE_Y - CHECKPOINT.gap / 2 - GATE.tileH / 2, 160, 420,
        { d: 0.8, step: 0.16 });
      const historyIn = P(t, c[3] + T3.history, 0.6);
      place(s.history, HISTORY.x, HISTORY.y + Math.round(60 * (1 - historyIn)), 1, historyIn);

      // the card grows out of the model, drops onto the lane and runs to the Endpoint's doorway, the checkpoint
      // letting it pass on the way; there the allowlist lets the agent's Namespace in (ALLOWED); it goes on to the
      // handler, which holds it (violet) until Maya says no (red); IRREVERSIBLE under it, NEEDS APPROVAL above it,
      // then REJECTED BY MAYA
      const grow = P(t, c[3] + T3.card, 0.3);
      const leave = P(t, leaveAt, T3.leaveD);
      const [routeX, routeY] = pointAlong(ROUTE, P(t, goStart, T3.goD, easeOut));
      const cardX = lerp(routeX, HOLD.x, leave);
      s.card.place(Math.round(cardX), Math.round(routeY), lerp(0.4, 1, grow), grow);
      if (t >= shutAt) s.card.setTone('red');
      else if (t >= holdAt) s.card.setTone('violet');
      else s.card.setTone(null);
      s.cp.check(t, passAt, 'pass');
      const listed = t >= allowAt;
      s.allowlist.row.style.borderColor = listed ? C.neon : C.lineLight;
      s.allowlist.check.setAttribute('stroke', listed ? C.neon : C.slate);
      s.allowlist.row.style.boxShadow = glowShadow(RGB.neon, listed ? 0.5 : 0, { blur: 16, alpha: 0.5 });
      placeRipples(s.allowRipples, t, allowAt, GATE.x, ALLOW_ROW_Y, 60, 240, { d: 0.6, step: 0.14 });
      placeAgentTag(s.allowed, t, allowAt + 0.1, GATE.x, UNDER_Y);
      placeAgentTag(s.flag, t, holdAt + T3.flag, HOLD.x, FLAG_Y);
      placeAgentTag(s.needs, t, holdAt + T3.needs, HOLD.x, VERDICT_Y, shutAt - 0.15);
      placeAgentTag(s.rejected, t, shutAt, HOLD.x, VERDICT_Y);
      placeRipples(s.shutRipples, t, shutAt, HOLD.x, HOLD.y, 120, 460, { d: 0.8, step: 0.16 });

      // Maya's phone rises in under the model; a violet spark carries the request from the handler to it, over the
      // gate and the checkpoint, and the request slides up on its screen. Maya taps Reject: a red spark carries her
      // no back to the card.
      const phoneIn = P(t, c[3] + T3.phone, 0.7);
      place(s.phone.el, PHONE.x, PHONE.y + Math.round(80 * (1 - phoneIn)), 1, phoneIn);
      s.phone.set(t, c[3] + T3.screen, 'reject', rejectAt);
      const needsTop = [HOLD.x, VERDICT_Y - AGENT_TAG.h / 2 - 12];
      const phoneEdge = [PHONE.x + APPROVAL_CARD.w / 2, PHONE.y - APPROVAL_CARD.h / 2 + 60];
      const arc = [needsTop, [needsTop[0] - 80, 70], [phoneEdge[0] + 180, 70], phoneEdge];
      const toPhone = P(t, c[3] + T3.spark, T3.sparkD);
      const [ax, ay] = bezier(arc, toPhone);
      place(s.toPhone, ax, ay, 1, toPhone > 0 && toPhone < 1 ? 1 : 0);
      placeRipples(s.phoneRipples, t, c[3] + T3.spark + T3.sparkD, phoneEdge[0], phoneEdge[1], 40, 220,
        { d: 0.7, step: 0.15 });
      const back = P(t, c[3] + T3.back, T3.backD);
      const [bx, by] = bezier([...arc].reverse(), back);
      place(s.toCard, bx, by, 1, back > 0 && back < 1 ? 1 : 0);

      // the waiting clock runs from WED 10:00 to Maya's answer, through the crash, then leaves with the verdict
      const clockPop = popIn(t, c[3] + T3.clock);
      place(s.clock, CLOCK.x, CLOCK.y, clockPop.s, clockPop.o * (1 - P(t, shutAt, 0.3)));
      setClock(s.clock, WAIT.answerMin * P(t, c[3] + T3.run, rejectAt - c[3] - T3.run, linear));

      // the Event History: the model's ask, the request to Maya, then Maya's no
      fillHistoryStrip(s.history, t, [
        { at: holdAt + T3.needs, tag: 'NEEDS APPROVAL', tone: 'violet' },
        { at: c[3] + T3.rowAsked, tag: 'WAITING', tone: 'violet' },
        { at: c[3] + T3.row, tag: 'REJECTED BY MAYA', tone: 'red' },
      ]);

      // the database stays whole: SAFE, in its tile
      placeAgentTag(s.safe, t, safeAt, SAFE_X, SAFE_Y);
      placeRipples(s.safeRipples, t, safeAt, DB_SAFE.x, DB_SAFE.y, 120, 520, { d: 0.9, step: 0.18 });
    }
  });
}
