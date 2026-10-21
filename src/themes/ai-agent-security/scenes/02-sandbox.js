// ===================== 2. LOCKED IN A SANDBOX
// The case file (February 2026, malicious add-ons) slams in, then pins to the corner as an add-on store and a user's
// computer rise in: folders, files, saved passwords and the network round the AI assistant. An add-on,
// wallet-helper, leaves the store for the assistant; its fake setup step, "install prerequisites", runs and turns out
// to install a password thief: the add-on turns red, and a few more add-ons of the store with it (341 malicious). Its
// red tendrils reach every item as the subtitle names them (FULL ACCESS), then three of them fly off to the attacker's
// server, which rose in on the right as the thief showed.
// With Temporal, the board comes in: the model, the WORKFLOW checkpoint, a Worker on the right and the Event History.
// The agent's tools (terminal, code, add-ons) pop in beside the Worker and a glass SANDBOX box forms round them as
// "sandbox" is read: the box is not the Worker, which stays outside it and sends it commands. The model's `run_addon`
// card passes the checkpoint into the Worker, whose command runs the add-on in the box. The sandbox providers pop in
// under the box as the subtitle names them, as plain text tags.
// The dramatic beat: the add-on in the box turns red and reaches for the saved passwords (there are none: NO KEYS)
// and for the internet (its tendril hits the glass: NO INTERNET); the glass cracks, the box is thrown away (it drops
// out of the frame) and a fresh one pops in (CONTAINED). The Event History keeps its rows and records the new box
// (NOTHING LOST), and the agent carries on: the model's next step runs in SANDBOX 2 ("a fresh box for every step"),
// which is thrown away in turn once that step ends, and SANDBOX 3 pops in for the next one; the Event History scrolls
// up as it records them. The camera zoom-through (setCamera) brings the scene in and plays into the next one; in
// between, the camera holds.
// The block keeps every name declared in this file local to this scene.
{
  // ---------- the replay: an add-on store on the left, centered under the pinned case file (x 120-540, y 150-338), a
  // user's computer in the middle and the attacker's server on the right; with them, the composition spans x 120-1800,
  // y 150-836
  // the laptop: its screen (bar: the height of its title bar) and its base, centered under it
  const SCREEN = { x: 940, y: 570, w: 720, h: 460, bar: 44 };
  const BASE = { x: 940, y: 818, w: 820, h: 36 };
  // the red halo behind the laptop once the password thief strikes, inside the content frame
  const HALO = { x: 940, y: 560, w: 1100, h: 620 };
  // the AI assistant high in the middle of the screen, its label above it
  const ASSISTANT = { x: 940, y: 504, size: 100, labelY: 424 };
  // the add-on under the assistant, plugged into it: its card (name, then its fake setup step on one line of text
  // px, over a progress bar of bar px)
  const ADDON = { x: 940, y: 686, w: 260, h: 112, text: 236, bar: 200 };
  // the items on the screen, in two columns round the add-on; grab: when the add-on's tendril reaches it, seconds
  // after c[1], as the subtitle names it ("every file", "every saved password", "the whole network")
  const ITEM = { w: 140, h: 96, icon: 36 };
  const ITEMS = [
    { icon: 'folder', label: 'Projects', x: 676, y: 470, grab: 2.55 },
    { icon: 'folder', label: 'Documents', x: 676, y: 592, grab: 2.65 },
    { icon: 'file', label: 'notes.txt', x: 676, y: 714, grab: 2.75 },
    { icon: 'file', label: 'keys.txt', x: 1204, y: 470, grab: 2.85 },
    { icon: 'password', label: 'Passwords', x: 1204, y: 592, grab: 3.4 },
    { icon: 'globe', label: 'Network', x: 1204, y: 714, grab: 4.75 },
  ];
  // how long a tendril takes to reach its item, s
  const REACH_D = 0.35;
  // the FULL ACCESS tag, centered above the screen, 20 px clear of it
  const FULL_ACCESS = [940, 300];
  // the add-on store on the left, centered under the pinned case file: its heading, then a grid of add-ons (cols x
  // rows tiles of size px, pitch px apart, the first row's top at top px inside the store) and, under it, the red
  // count of the malicious ones (its center readout px inside the store)
  const STORE = { x: CASE_FILE.pin.x, y: 576, w: 320, h: 364, readout: 328 };
  const GRID = { cols: 4, rows: 3, size: 56, icon: 26, pitch: 70, top: 100 };
  // the grid slot of wallet-helper, the add-on that leaves for the computer, and of the other malicious add-ons the
  // researchers found (row-major indexes)
  const WALLET_SLOT = 7;
  const RED_SLOTS = [1, 10];
  // the stage center of grid slot i
  const storeSlot = i => [STORE.x + (i % GRID.cols - (GRID.cols - 1) / 2) * GRID.pitch,
    STORE.y - STORE.h / 2 + GRID.top + GRID.size / 2 + Math.floor(i / GRID.cols) * GRID.pitch];
  // the add-on's flight from the store to the computer: Bezier control points, over the screen's title bar
  const FLIGHT_CONTROLS = [[560, 260], [860, 260]];
  // the attacker's server on the right, its top level with the screen's: its rows (top of the first, pitch, height,
  // side inset) list what the add-on stole
  const PAGE = { x: 1630, y: 488, w: 340, h: 296, rowTop: 104, pitch: 60, rowH: 48, inset: 20 };
  // what flies to the page, in row order: the item (index in ITEMS) and when it leaves, seconds after c[1]; each
  // flight lasts LEAK_D seconds; the flying chip is CHIP px square
  const LEAKS = [{ item: 3, at: 5.1 }, { item: 4, at: 5.35 }, { item: 2, at: 5.6 }];
  const LEAK_D = 0.55;
  const CHIP = 48;

  // ---------- the board: the model, the checkpoint and the Event History strip at BOARD's places; on the right, the
  // Worker beside the SANDBOX box, and the sandbox providers under the box. With them, the composition spans
  // x 120-1800, y 184-856.
  // the Worker, on the lane, centered between the checkpoint (right edge x 1060) and the box (left edge x 1400)
  const WORKER = { x: 1230, y: BOARD.laneY, w: 180, h: 180 };
  // the box: glass, x 1400-1800, y 184-740, its border px wide
  const BOX = { x: 1600, y: 462, w: 400, h: 556, border: 2 };
  const BOX_LEFT = BOX.x - BOX.w / 2, BOX_TOP = BOX.y - BOX.h / 2;
  // the agent's tools in the box, top to bottom (the board's tool tiles, TOOL_TILE in size), and the center of each
  // in the box's coordinates (from its top left corner): under the box's heading, 20 px in from its sides
  const BOX_TOOLS = [TOOLS[0], TOOLS[2], TOOLS[3]];
  const boxToolSpot = i => [BOX.w / 2, 100 + TOOL_TILE.h / 2 + i * 88];
  // the tool of each step: the add-on (wallet-helper, then the step that misbehaves), the code (the next step)
  const ADDON_TOOL = 2;
  const CODE_TOOL = 1;
  // the box's badges, side by side at its bottom, as wide as the tiles above them: size, icon size, centers in the
  // box's coordinates; [icon, label] of each
  const BADGE = { w: 172, h: 80, icon: 32, xs: [106, 294], y: BOX.h - 20 - 40 };
  // (the sandbox still reaches the Worker, hence no internet rather than no network)
  const BADGES = [['keyOff', 'No keys'], ['wifiOff', 'No internet']];
  // the run line of the step in the box, between the tiles and the badges (its center in the box's coordinates), and
  // its progress bar's width and how long the bar takes to fill, s
  const RUN = { y: 402, bar: 240, d: 3 };
  // the providers, in the subtitle's order, in two rows under the box, left-aligned with it, the last row's bottom
  // level with the Event History's (y 856); at: when each pops in, seconds after c[2], as the subtitle names it
  const PROVIDER = { h: 36, gap: 12, rowGap: 12, font: 16 };
  const PROVIDERS = [
    { name: 'Amazon Bedrock AgentCore', row: 0, at: 4.0 },
    { name: 'Modal', row: 1, at: 5.8 },
    { name: 'E2B', row: 1, at: 6.25 },
    { name: 'Daytona', row: 1, at: 6.7 },
  ];
  // the top of each row of providers
  const PROVIDERS_BOTTOM = BOARD.history.y + BOARD.history.h / 2;
  const PROVIDER_ROWS_TOP = [PROVIDERS_BOTTOM - 2 * PROVIDER.h - PROVIDER.rowGap, PROVIDERS_BOTTOM - PROVIDER.h];
  // a provider tag's width: its side padding and text (Mono 16 px with .1em spacing advances 11.2 px per character),
  // rounded up to an even number of px
  const providerWidth = name => 2 * Math.ceil((28 + name.length * 11.2) / 2);
  // the verdict tags: CONTAINED under the Worker, as wide as it, halfway between it and the Event History; NOTHING
  // LOST on the Event History's top left corner, left-aligned with it and 20 px over it
  const CONTAINED = [WORKER.x, 590];
  const NOTHING_LOST = [BOARD.history.x - BOARD.history.w / 2 + agentTagWidth('NOTHING LOST') / 2,
    BOARD.history.y - BOARD.history.h / 2 - 20 - AGENT_TAG.h / 2];
  // the lanes: the orb to the checkpoint, the checkpoint to the Worker, and the Worker's commands into the box
  const LANE_IN = [BOARD.model.x + BOARD.model.size / 2 + 16, BOARD.checkpoint.x - CHECKPOINT.w / 2];
  const LANE_WORKER = [BOARD.checkpoint.x + CHECKPOINT.w / 2, WORKER.x - WORKER.w / 2];
  const LANE_COMMANDS = [WORKER.x + WORKER.w / 2 + 2, BOX_LEFT - 4];

  // ---------- the beat, in the box's coordinates: the add-on's two reaches. from: where the tendril leaves the add-on
  // tile; to: where it ends, on the NO KEYS badge's top edge (keys) or on the glass of the right wall (internet);
  // badge: the badge that shows when it gets there (index in BADGES)
  const REACHES = [
    { from: [146, 350], to: [106, 454], badge: 0 },
    { from: [334, 350], to: [396, 424], badge: 1 },
  ];
  // the wall the internet reach hits: its outward direction
  const WALL_NORMAL = [1, 0];
  // sparks thrown back into the box by the hit: how many, their size, how far they fly, for how long
  const SPARKS = { n: 7, size: 8, dist: [36, 80], d: 0.45 };

  // ---------- the beats, in seconds after each subtitle start
  // c[0]: the case file slams in (file), pins to the corner (pin, pinD) as the store (store) and the laptop (laptop)
  // rise in, the laptop's items pop in one after the other (items, itemStep) round the assistant (assistant); the
  // add-on leaves the store (leave) and flies to the assistant (flyD); its setup step runs (install) and turns out to
  // install a password thief as "a password thief" is read (hijack); the store's other malicious add-ons turn red
  // (found) and the attacker's server rises in on the right (page)
  const T0 = {
    file: 0.1, pin: 2.8, pinD: 0.8, store: 2.9, laptop: 3.0, items: 3.3, itemStep: 0.06, assistant: 3.4, leave: 4.1,
    flyD: 0.6, install: 4.9, hijack: 5.5, found: 5.9, page: 6.2,
  };
  // c[1]: FULL ACCESS lands as "full access" is read (full); the tendrils reach the items (ITEMS.grab), then the
  // leaks fly (LEAKS)
  const T1 = { full: 1.7 };
  // c[2]: the replay sinks away (away, awayD) as the board pops in (orb, checkpoint, worker, lanes, history); the
  // tools pop in as "tools" is read (tools, toolStep) and the glass forms round them at "sandbox" (box), its sheen
  // sweeping across it (shine), the Worker's command line drawing to it (commands); the orb thinks (think), its card
  // grows out of it (card), reaches the gate (gate), passes it (pass) and rides into the Worker (ride, rideD), which
  // sends the command into the box (command, commandD): the add-on runs; the history records the model's call (row1)
  // and the add-on's step (row2); the providers pop in as they are named (PROVIDERS.at)
  const T2 = {
    away: -0.05, awayD: 0.5, orb: 0.3, checkpoint: 0.45, worker: 0.6, lanes: 0.7, history: 0.6, tools: 1.6,
    toolStep: 0.1, box: 2.85, shine: 3.15, commands: 3.0, think: 0.9, card: 1.6, gate: 2.35, pass: 2.45, ride: 2.55,
    rideD: 0.6, command: 3.25, commandD: 0.3, row1: 1.7, row2: 3.6,
  };
  // c[3]: the add-on turns red (red) and reaches for the keys, then for the internet: each tendril grows (reaches,
  // over reach seconds) and its badge shows as it gets there, then it pulls back (retract); the glass cracks
  // (crack), the box drops out (drop, dropD) as "thrown away" is read and fades (fade), CONTAINED lands (contained),
  // SANDBOX 2 pops in (fresh) and the history records it (row3); the history glows as "the agent's progress" is
  // read (kept) and NOTHING LOST lands (lost); the orb thinks (think), its next card grows out of it (card), passes
  // the gate (gate, pass), rides into the Worker (ride) and the Worker's command runs the code in SANDBOX 2
  // (command), its run line filling over runD seconds; the history records the step (row4), SANDBOX 2 is thrown
  // away in turn (drop2, fade2), SANDBOX 3 pops in (fresh3) and the history records it (row5)
  const T3 = {
    red: 0, reaches: [0.4, 0.95], reach: 0.3, retract: 0.15, crack: 1.3, drop: 1.65, dropD: 0.6, fade: 1.85,
    contained: 1.9, fresh: 2.3, row3: 2.5, kept: 3.3, lost: 3.6, think: 2.2, card: 2.8, gate: 3.3, pass: 3.4,
    ride: 3.5, command: 4.1, runD: 1.0, row4: 5.4, drop2: 5.6, fade2: 5.8, fresh3: 6.1, row5: 6.3,
  };

  // The Event History rows of the board: the model's call, the add-on's step in the first box, the new box, the code's
  // step in it and the box after it. The strip shows three rows: it scrolls up one row before the fourth and the
  // fifth slide in (HISTORY_SCROLL: how long the top row takes to fade out, then the others to move up, s).
  const HISTORY_ROWS = [
    '<b>model</b> suggests run_addon', '<b>add-on step</b> · sandbox 1', '<b>box replaced</b> · sandbox 2',
    '<b>run_code</b> · sandbox 2', '<b>box replaced</b> · sandbox 3',
  ];
  const isModelRow = i => i === 0;
  const HISTORY_VISIBLE = 3;
  const HISTORY_SCROLL = { fade: 0.2, move: 0.35 };

  // ---------- helpers
  // The point where the line from the center of a box { x, y, w, h } toward (x, y) leaves it, 2 px out
  const edgeToward = (box, x, y) => {
    const dx = x - box.x, dy = y - box.y;
    const k = Math.min((box.w / 2 + 2) / Math.abs(dx), (box.h / 2 + 2) / Math.abs(dy));
    return [box.x + dx * k, box.y + dy * k];
  };
  // A wavy tendril from (x0, y0) to (x1, y1): a smooth SVG path through segments + 1 points, each one pushed sideways
  // by up to amp px (hashed from seed), none at both ends
  const tendrilD = (x0, y0, x1, y1, seed, amp, segments = 6) => {
    const len = Math.hypot(x1 - x0, y1 - y0);
    const nx = -(y1 - y0) / len, ny = (x1 - x0) / len;
    const points = Array.from({ length: segments + 1 }, (_, i) => {
      const u = i / segments;
      const off = amp * Math.sin(Math.PI * u) * (hash(seed * 17 + i) * 2 - 1);
      return [(x0 + (x1 - x0) * u + nx * off).toFixed(1), (y0 + (y1 - y0) * u + ny * off).toFixed(1)];
    });
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < segments; i++) {
      const [x, y] = points[i], [xNext, yNext] = points[i + 1];
      d += ` Q ${x} ${y} ${((+x + +xNext) / 2).toFixed(1)} ${((+y + +yNext) / 2).toFixed(1)}`;
    }
    return d + ` L ${points[segments][0]} ${points[segments][1]}`;
  };
  // A crack in the glass from (x, y), heading into the box, away from the wall's outward normal (nx, ny): a jagged
  // line of three segments and a branch off its first bend, hashed from seed
  const crackD = (x, y, [nx, ny], seed) => {
    let angle = Math.atan2(-ny, -nx) + (hash(seed) - 0.5) * 1.2;
    let px = x, py = y;
    let d = `M ${x} ${y}`;
    let branch = '';
    for (let i = 0; i < 3; i++) {
      const len = 34 + hash(seed + i + 1) * 30;
      px += Math.cos(angle) * len;
      py += Math.sin(angle) * len;
      d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
      if (i === 0) {
        const side = angle + 0.9, sideLen = 26 + hash(seed + 9) * 16;
        branch = ` M ${px.toFixed(1)} ${py.toFixed(1)}`
          + ` L ${(px + Math.cos(side) * sideLen).toFixed(1)} ${(py + Math.sin(side) * sideLen).toFixed(1)}`;
      }
      angle += (hash(seed + i + 5) - 0.5) * 1.1;
    }
    return d + branch;
  };
  // An SVG layer w x h px at the top left of parent
  const sizedSvg = (parent, w, h, css = {}) => {
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    Object.assign(svg.style, { position: 'absolute', left: 0, top: 0, overflow: 'visible', ...css });
    parent.appendChild(svg);
    return svg;
  };


  // An item on the laptop's screen: its icon over its label; e.icon, its <svg>, which turns red when grabbed
  const makeItem = (parent, { icon, label }) => {
    const e = E(parent,
      ICON(icon, ITEM.icon, C.ink, 1.8)
      + `<div class="mono" style="font-size:16px;line-height:20px;margin-top:10px;color:${C.ink}">${label}</div>`,
      'tile', {
        width: ITEM.w + 'px', height: ITEM.h + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center',
      });
    e.icon = e.querySelector('svg');
    return e;
  };
  // The laptop: its screen, with a title bar (laptop icon, DEVELOPER'S COMPUTER), and its base, a trapezoid
  const makeLaptop = parent => {
    const screen = E(parent,
      `<div style="position:absolute;left:0;right:0;top:0;height:${SCREEN.bar}px;display:flex;align-items:center;`
      + `gap:10px;padding-left:20px;border-bottom:1px solid ${C.line}">${ICON('laptop', 20, C.slate, 1.8)}`
      + `<span class="lbl" style="font-size:16px;line-height:20px">A user's computer</span></div>`,
      '', {
        width: SCREEN.w + 'px', height: SCREEN.h + 'px', background: '#101114',
        border: `2px solid ${C.lineLight}`, borderRadius: '14px',
      });
    const inset = (BASE.w - SCREEN.w) / 2 / BASE.w * 100;
    const base = E(parent, '', '', {
      width: BASE.w + 'px', height: BASE.h + 'px', background: C.lineLight,
      clipPath: `polygon(${inset}% 0, ${100 - inset}% 0, 100% 78%, 99% 100%, 1% 100%, 0 78%)`,
    });
    return { screen, base };
  };
  // The add-on store: a cart and ADD-ON STORE, "2,857 add-ons", and under the grid (its tiles are separate, see
  // makeStoreTile), the red count of the malicious ones, hidden until found (store.found)
  const makeStore = parent => {
    const store = E(parent,
      `<div style="position:absolute;left:20px;top:18px;height:30px;display:flex;align-items:center;gap:10px">`
      + `${ICON('cart', 24, C.ink, 1.8)}<span class="lbl" style="padding-left:0;font-size:18px;color:var(--ink)">`
      + 'Add-on store</span></div>'
      + `<div class="mono" style="position:absolute;left:20px;top:58px;font-size:16px;line-height:20px;`
      + `color:${C.slate}">2,857 add-ons</div>`,
      'tile', { width: STORE.w + 'px', height: STORE.h + 'px', textAlign: 'left' });
    store.found = E(store,
      `${ICON('alert', 20, C.red, 2)}<span class="mono" style="font-size:18px;line-height:24px;font-weight:700;`
      + `color:${C.red}">341 malicious</span>`,
      '', {
        left: -TILE_BORDER + 'px', top: (STORE.readout - 12 - TILE_BORDER) + 'px', width: STORE.w + 'px',
        height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
      });
    return store;
  };
  // An add-on of the store: a puzzle piece on a small tile; e.icon, its <svg>, which turns red when found malicious
  const makeStoreTile = parent => {
    const e = E(parent, ICON('puzzle', GRID.icon, C.slate), 'tile', {
      width: GRID.size + 'px', height: GRID.size + 'px', display: 'flex', alignItems: 'center',
      justifyContent: 'center',
    });
    e.icon = e.querySelector('svg');
    return e;
  };
  // The add-on on the computer: its puzzle piece and name, then its fake setup step, "install prerequisites", over the
  // progress bar of that step. Once the step has run, it shows what it really installed: a password thief.
  // e.icon, e.step, e.thief and e.bar (the bar's fill) are set by the update.
  const makeAddOn = parent => {
    const e = E(parent,
      `<div style="display:flex;align-items:center;gap:10px">${ICON('puzzle', 24, C.ink)}`
      + `<span class="mono" style="font-size:18px;line-height:24px;color:${C.ink}">wallet-helper</span></div>`
      + `<div style="position:relative;width:${ADDON.text}px;height:20px;margin-top:12px;white-space:nowrap">`
      + `<div class="step mono" style="position:absolute;left:0;top:0;width:100%;font-size:16px;line-height:20px;`
      + `color:${C.slate}">install prerequisites</div>`
      + `<div class="thief mono" style="position:absolute;left:0;top:0;width:100%;height:20px;display:flex;`
      + `align-items:center;justify-content:center;gap:8px;font-size:16px;line-height:20px;font-weight:700;`
      + `color:${C.red};opacity:0">${ICON('alert', 18, C.red, 2)}password thief</div></div>`
      + `<div style="width:${ADDON.bar}px;height:4px;margin-top:14px;border-radius:2px;background:${C.line};`
      + `overflow:hidden"><div class="bar" style="width:0;height:4px;background:${C.slate}"></div></div>`,
      'tile', {
        width: ADDON.w + 'px', height: ADDON.h + 'px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      });
    e.icon = e.querySelector('svg');
    e.step = e.querySelector('.step');
    e.thief = e.querySelector('.thief');
    e.bar = e.querySelector('.bar');
    return e;
  };
  // The attacker's server: a red server and ATTACKER SERVER, "somewhere online", then one row per leak, hidden until
  // it lands (page.rows)
  const makeAttackerServer = parent => {
    const page = E(parent,
      `<div style="position:absolute;left:${PAGE.inset}px;top:18px;height:30px;display:flex;align-items:center;`
      + `gap:10px">${ICON('server', 24, C.red, 1.8)}<span class="lbl" style="padding-left:0;font-size:18px;`
      + `color:var(--ink)">Attacker server</span></div>`
      + `<div class="mono" style="position:absolute;left:${PAGE.inset}px;top:58px;font-size:16px;line-height:20px;`
      + `color:${C.slate}">somewhere online</div>`,
      'tile', { width: PAGE.w + 'px', height: PAGE.h + 'px', textAlign: 'left', borderColor: C.red });
    page.rows = LEAKS.map(({ item }, i) => E(page,
      `${ICON(ITEMS[item].icon, 22, C.red, 1.8)}<span class="mono" style="font-size:18px;color:${C.ink}">`
      + `${ITEMS[item].label}</span>`,
      '', {
        left: (PAGE.inset - TILE_BORDER) + 'px', top: (PAGE.rowTop + i * PAGE.pitch - TILE_BORDER) + 'px',
        width: (PAGE.w - 2 * PAGE.inset) + 'px', height: PAGE.rowH + 'px', display: 'flex', alignItems: 'center',
        gap: '12px', paddingLeft: '14px', background: `rgba(${RGB.red},.12)`, borderLeft: `4px solid ${C.red}`,
        borderRadius: 'var(--rs)',
      }));
    return page;
  };
  // Stage center of the icon of the page's row i, where its leak lands
  const pageRowIcon = i => [PAGE.x - PAGE.w / 2 + PAGE.inset + 4 + 14 + 11,
    PAGE.y - PAGE.h / 2 + PAGE.rowTop + i * PAGE.pitch + PAGE.rowH / 2];

  // The Worker: a server icon, WORKER and "sends commands" on a tile; it drives the box from outside it
  const makeWorker = root => E(root,
    ICON('server', 40, C.ink, 1.8)
    + '<div class="mono" style="font-size:20px;line-height:24px;letter-spacing:.14em;padding-left:.14em;'
    + 'margin-top:14px">WORKER</div>'
    + `<div class="mono" style="font-size:16px;line-height:20px;color:${C.slate};margin-top:6px">sends commands</div>`,
    'tile', {
      width: WORKER.w + 'px', height: WORKER.h + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center',
    });
  // A sandbox provider: its name in capitals on a plain pill (no logo)
  const makeProviderTag = (root, name) => E(root, name, 'mono', {
    width: providerWidth(name) + 'px', height: PROVIDER.h + 'px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', paddingLeft: '.1em', fontSize: PROVIDER.font + 'px', lineHeight: '20px',
    letterSpacing: '.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: C.ink,
    border: `2px solid ${C.lineLight}`, borderRadius: 'var(--rs)',
  });
  // The stage center of provider tag i: its row's tags side by side from the box's left edge, PROVIDER.gap apart
  const providerSpot = i => {
    const { row } = PROVIDERS[i];
    let left = BOX_LEFT;
    for (let k = 0; k < i; k++) {
      if (PROVIDERS[k].row === row) left += providerWidth(PROVIDERS[k].name) + PROVIDER.gap;
    }
    return [left + providerWidth(PROVIDERS[i].name) / 2, PROVIDER_ROWS_TOP[row] + PROVIDER.h / 2];
  };

  // The SANDBOX box number n, whose step's run line reads `running: <step>`: an unstyled holder that moves the whole
  // box (box.el), and in it, the glass (box.glass: a pale border, a faint fill, the sandbox icon with SANDBOX n and
  // its note under it, "sealed, throwaway" by default, a red tint for the hits
  // (box.tint), a sheen that sweeps across it on cue (box.sheen)), the agent's tools (box.tiles, the board's tool
  // tiles; tile.label, its label, and tile.name, the tool's), the badges at the bottom (box.badges, hidden until
  // shown), a layer for the cracks (box.crackSvg) and one for the add-on's tendrils (box.tendrilSvg, glowing red). The
  // tiles sit outside the glass, so they can show before it forms.
  const makeSandbox = (root, n, step, note = 'sealed, throwaway') => {
    const { w, h, border } = BOX;
    const box = { el: E(root, '', '', { width: w + 'px', height: h + 'px' }) };
    box.glass = E(box.el,
      `<div style="position:absolute;left:${24 - border}px;top:${20 - border}px;height:34px;display:flex;`
      + `align-items:center;gap:10px">${ICON('sandbox', 22, C.ink, 1.8)}<span class="lbl" style="padding-left:0;`
      + `font-size:18px;color:var(--ink)">Sandbox ${n}</span></div>`
      + `<div class="mono" style="position:absolute;left:${24 - border}px;top:${58 - border}px;font-size:16px;`
      + `line-height:20px;color:${C.slate}">${note}</div>`,
      '', {
        width: w + 'px', height: h + 'px', border: `${border}px solid rgba(${RGB.ink},.55)`,
        borderRadius: 'var(--r)', overflow: 'hidden',
        background: `linear-gradient(135deg, rgba(${RGB.ink},.12) 0%, rgba(${RGB.ink},.04) 38%, `
          + `rgba(${RGB.uv},.1) 100%)`,
      });
    box.tint = E(box.glass, '', '', {
      left: -border + 'px', top: -border + 'px', width: w + 'px', height: h + 'px',
      background: `radial-gradient(closest-side, rgba(${RGB.red},.1), rgba(${RGB.red},.26))`,
    });
    box.sheen = E(box.glass, '', '', {
      width: '140px', height: (h + 240) + 'px',
      background: `linear-gradient(90deg, rgba(${RGB.ink},0), rgba(${RGB.ink},.22), rgba(${RGB.ink},0))`,
    });
    box.tiles = BOX_TOOLS.map(tool => {
      const tile = makeToolTile(box.el, tool);
      tile.label = tile.querySelector('.lbl');
      tile.name = tool.label;
      return tile;
    });
    box.badges = BADGES.map(([icon, label]) => E(box.el,
      ICON(icon, BADGE.icon, C.ink, 1.8)
      + `<div class="lbl" style="font-size:16px;line-height:20px;margin-top:10px;color:var(--ink)">${label}</div>`,
      'tile', {
        width: BADGE.w + 'px', height: BADGE.h + 'px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: C.bg,
      }));
    box.run = E(box.el,
      `<div class="mono" style="font-size:16px;line-height:20px;color:${C.slate};white-space:nowrap">`
      + `running: ${step}</div>`
      + `<div style="width:${RUN.bar}px;height:4px;margin-top:12px;border-radius:2px;background:${C.line};`
      + `overflow:hidden"><div class="bar" style="width:0;height:4px;background:${C.uv}"></div></div>`,
      '', { width: (RUN.bar + 40) + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center' });
    box.run.bar = box.run.querySelector('.bar');
    box.crackSvg = sizedSvg(box.el, w, h);
    box.tendrilSvg = sizedSvg(box.el, w, h, { filter: `drop-shadow(0 0 6px rgba(${RGB.red},.8))` });
    return box;
  };
  // A tool tile's look: 'run' (UV, the step runs there), 'red' (the add-on misbehaves: it shows its name,
  // wallet-helper, as in the replay) or null (idle); k, the strength of its glow (0 to 1)
  const setToolTone = (tile, tone, k = 1) => {
    const color = { run: C.uv, red: C.red }[tone];
    const rgb = { run: RGB.uv, red: RGB.red }[tone];
    tile.style.borderColor = color || C.line;
    tile.style.boxShadow = rgb ? glowShadow(rgb, k, { blur: 28, alpha: 0.55 }) : '';
    tile.icon.setAttribute('stroke', tone === 'red' ? C.red : C.ink);
    tile.label.style.color = tone === 'red' ? C.red : C.ink;
    setText(tile.label, tone === 'red' ? 'wallet-helper' : tile.name);
  };
  // Places a sandbox at its spot, moved by (dx, dy) and turned by rot degrees, at scale s and opacity o, every frame.
  // glass: the glass's opacity and its scale as it forms ({ s, o }); tiles and badges: the pop of each ({ s, o }), and
  // tileDx, a sideways jitter of each tile (whole px); shineAt: when its sheen sweeps across it (0.6 s); glow: the
  // white glow of its rim (0 to 1); red: the red flash of a hit (0 to 1); run: the run line's opacity and its bar's
  // progress ({ o, p }, hidden by default)
  const placeSandbox = (box, {
    dx = 0, dy = 0, rot = 0, s = 1, o = 1, glass, tiles, tileDx = [0, 0, 0], badges, t = 0, shineAt = -1, glow = 0,
    red = 0, run = { o: 0, p: 0 },
  }) => {
    place(box.el, BOX.x + dx, BOX.y + dy, s, o, rot);
    place(box.glass, BOX.w / 2, BOX.h / 2, glass.s, glass.o);
    box.tiles.forEach((tile, i) => {
      const [x, y] = boxToolSpot(i);
      place(tile, x + tileDx[i], y, tiles[i].s, tiles[i].o);
    });
    box.badges.forEach((badge, i) => place(badge, BADGE.xs[i], BADGE.y, badges[i].s, badges[i].o));
    place(box.run, BOX.w / 2, RUN.y, 1, run.o);
    box.run.bar.style.width = Math.round(run.p * RUN.bar) + 'px';
    const sweep = P(t, shineAt, 0.6, linear);
    box.sheen.style.opacity = sweep > 0 && sweep < 1 ? 1 : 0;
    box.sheen.style.transform = `translate(${Math.round(lerp(-220, BOX.w + 80, sweep))}px,-120px) rotate(20deg)`;
    box.tint.style.opacity = red.toFixed(3);
    box.glass.style.borderColor = red > 0.5 ? C.red : `rgba(${RGB.ink},${(0.55 + 0.45 * glow).toFixed(3)})`;
    box.glass.style.boxShadow = red > 0 ? glowShadow(RGB.red, red, { blur: 40, alpha: 0.7 })
      : glowShadow(RGB.ink, glow, { blur: 36, alpha: 0.45 });
  };
  // An action card's place, every frame: it grows out of the orb from `card` and reaches the gate at `gate`, waits,
  // then from `ride` travels through the checkpoint's opening into the Worker over rideD seconds, shrinking and fading
  // into it; hidden before `card` and once in the Worker
  const placeCard = (card, t, { card: cardAt, gate, ride, rideD }) => {
    const stops = actionStops(card, 0);
    if (t < ride) {
      const grow = P(t, cardAt, gate - cardAt);
      const [x, y] = lerp2(stops.from, stops.gate, grow);
      card.place(Math.round(x), Math.round(y), lerp(0.3, 1, grow), P(t, cardAt, 0.2));
      return;
    }
    const u = P(t, ride, rideD);
    const absorb = P(u, 0.6, 0.4, linear);
    const x = lerp(stops.gate[0], WORKER.x, u);
    card.place(Math.round(x), BOARD.laneY, lerp(1, 0.4, absorb), 1 - absorb);
  };
  // Scrolls the Event History strip (call it after fillHistoryStrip, every frame): before row k slides in at
  // rowAts[k], beyond the HISTORY_VISIBLE rows the strip shows, the top row fades out, then the rows move up one pitch
  const scrollHistory = (card, t, rowAts) => {
    const { fade, move } = HISTORY_SCROLL;
    const scrolled = rowAts.slice(HISTORY_VISIBLE)
      .reduce((sum, at) => sum + P(t, at - move, move), 0);
    card.rows.forEach((row, i) => {
      const slot = i - scrolled;
      row.style.top = Math.round(card.rowTop(slot)) + 'px';
      card.tags[i].style.top = Math.round(card.rowTop(slot) + 3) + 'px';
      // row i leaves the top once row i + HISTORY_VISIBLE comes in
      const nextAt = rowAts[i + HISTORY_VISIBLE];
      if (nextAt === undefined) return;
      const stay = 1 - P(t, nextAt - move - fade, fade);
      row.style.opacity = (+row.style.opacity * stay).toFixed(3);
      card.tags[i].style.opacity = (+card.tags[i].style.opacity * stay).toFixed(3);
    });
  };

  scene({
    chapter: 2, title: 'Locked in a sandbox',
    sources: [
      {
        label: 'The Hacker News, February 2026',
        url: 'https://thehackernews.com/2026/02/researchers-find-341-malicious-clawhub.html',
      },
      {
        label: 'Temporal blog, April 2026',
        url: 'https://temporal.io/blog/introducing-temporal-and-agentic-sandboxes-openai-agents-sdk',
      },
      {
        label: 'Temporal blog, September 2026',
        url: 'https://temporal.io/blog/amazon-bedrock-agentcore-with-temporal-serverless-workers',
      },
    ],
    subs: [
      {
        text: 'February 2026: 341 malicious add-ons for an AI assistant were found, most installing a password '
          + 'thief.',
        // the attacker's server is up at c[0] + 6.7: the infected computer then holds about 1.3 s
        after: 0.8,
      },
      {
        text: "They ran on the user's computer, with full access: every file, every saved password, "
          + "the whole network.",
        // the last leak lands at c[1] + 6.15: the attacker's server then holds about 1.2 s
        after: 1.0,
      },
      {
        text: "With Temporal, the agent's tools run in a <b>sandbox</b>, such as Amazon Bedrock AgentCore, "
          + "Modal, E2B or Daytona.",
        // the last provider pops in at c[2] + 6.7: the board then holds about 1.2 s
        after: 0.6,
      },
      {
        text: "No keys, no internet, thrown away at every step: the agent's progress lives in Temporal, "
          + "not in the box.",
        // SANDBOX 3 is up at c[3] + 6.6 and its history row at about c[3] + 7: the board then holds about 1.6 s
        after: 1.0,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);

      // the replay, in a layer of its own that sinks away when the board comes in
      s.replay = E(root, '', '', { width: '1920px', height: '1080px', opacity: 1 });
      s.redHalo = E(s.replay, '', '', {
        width: HALO.w + 'px', height: HALO.h + 'px', borderRadius: '50%',
        background: `radial-gradient(closest-side, rgba(${RGB.red},.22) 0%, rgba(${RGB.red},.08) 55%, `
          + `rgba(${RGB.red},0) 100%)`,
      });
      s.caseFile = makeCaseFile(s.replay, {
        date: 'FEBRUARY 2026', tag: 'MALICIOUS ADD-ONS', headline: '341 malicious assistant add-ons',
        source: 'THE HACKER NEWS, FEB 2026',
      });
      s.store = makeStore(s.replay);
      s.laptop = makeLaptop(s.replay);
      // the plug from the assistant down to the add-on, then the add-on's tendrils, glowing red
      s.plugSvg = svgLayer(s.replay);
      const plugTop = ASSISTANT.y + ASSISTANT.size / 2 + 4, plugBottom = ADDON.y - ADDON.h / 2 - 2;
      s.plug = path(s.plugSvg, `M ${ASSISTANT.x} ${plugTop} V ${plugBottom}`, C.lineLight, 2, false);
      s.replaySvg = svgLayer(s.replay);
      s.replaySvg.style.filter = `drop-shadow(0 0 6px rgba(${RGB.red},.8))`;
      s.reach = ITEMS.map((item, i) => {
        const left = item.x < ADDON.x;
        const edgeX = item.x + (left ? ITEM.w / 2 : -ITEM.w / 2);
        const [x0, y0] = edgeToward(ADDON, edgeX, item.y);
        return path(s.replaySvg, tendrilD(x0, y0, edgeX, item.y, i + 1, 14), C.red, 4, false);
      });
      s.items = ITEMS.map(item => makeItem(s.replay, item));
      s.assistant = makeModelOrb(s.replay, { x: ASSISTANT.x, y: ASSISTANT.y, size: ASSISTANT.size, label: '' });
      s.assistantLabel = E(s.replay, 'AI assistant', 'lbl', { fontSize: '16px', lineHeight: '20px' });
      s.addOn = makeAddOn(s.replay);
      // the store's add-ons, after the laptop: wallet-helper flies over it
      s.storeTiles = Array.from({ length: GRID.cols * GRID.rows }, () => makeStoreTile(s.replay));
      // one spark per tendril: on its tip while it grows, then flowing back to the add-on along it
      s.reachSparks = ITEMS.map(() => makeSpark(s.replay, 10, RGB.red));
      s.fullAccess = agentTag('FULL ACCESS', 'red', s.replay);
      s.page = makeAttackerServer(s.replay);
      s.chips = LEAKS.map(({ item }) => E(s.replay, ICON(ITEMS[item].icon, 26, C.red, 1.8), 'tile', {
        width: CHIP + 'px', height: CHIP + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderColor: C.red, background: C.bg, boxShadow: glowShadow(RGB.red, 1, { blur: 20, alpha: 0.6 }),
      }));

      // the board, in stacking order: the lanes, the checkpoint, the orb, the Worker, the history, the boxes and the
      // providers, then the cards, the command spark, the effects of the beat and the tags
      s.boardSvg = svgLayer(root);
      const { laneY } = BOARD;
      s.lanes = [LANE_IN, LANE_WORKER].map(([x0, x1]) => path(s.boardSvg, `M ${x0} ${laneY} H ${x1}`, C.line, 2,
        false));
      // the Worker's commands flow into the box along a dashed line (on G)
      s.commands = path(s.boardSvg, `M ${LANE_COMMANDS[0]} ${laneY} H ${LANE_COMMANDS[1]}`, C.slate, 2, true,
        '8 8');
      s.checkpoint = makeCheckpoint(root, BOARD.checkpoint);
      s.orb = makeModelOrb(root, BOARD.model);
      s.worker = makeWorker(root);
      s.history = makeHistoryStrip(root, HISTORY_ROWS, { uvRow: isModelRow });

      s.box = makeSandbox(root, 1, 'wallet-helper');
      s.tendrils = REACHES.map(({ from, to }, i) => path(s.box.tendrilSvg, tendrilD(...from, ...to, 20 + i, 12),
        C.red, 4, false));
      // the glass cracks from the internet reach's hit, three ways
      s.cracks = [0, 1, 2].map(i => path(s.box.crackSvg, crackD(...REACHES[1].to, WALL_NORMAL, 40 + 7 * i),
        `rgba(${RGB.ink},.85)`, 2, false));
      // the boxes after it, one per step
      s.box2 = makeSandbox(root, 2, 'make a report', 'a fresh box for every step');
      s.box3 = makeSandbox(root, 3, 'next step', 'a fresh box for every step');
      s.providers = PROVIDERS.map(({ name }) => makeProviderTag(root, name));

      s.cards = [
        makeActionCard(root, { tool: 'run_addon', arg: 'wallet-helper' }),
        makeActionCard(root, { tool: 'run_code', arg: 'make a report' }),
      ];
      s.commandSpark = makeSpark(root, 12, RGB.uv);
      s.tips = REACHES.map(() => makeSpark(root, 10, RGB.red));
      s.probeRings = REACHES.map(() => makeRipples(root, 1, RGB.red));
      s.wallFlash = E(root, '', '', {
        width: '6px', height: '120px', borderRadius: '3px', background: C.red,
        boxShadow: glowShadow(RGB.red, 1, { blur: 18, alpha: 0.9, spread: 2 }),
      });
      s.sparks = Array.from({ length: SPARKS.n }, () => makeSpark(root, SPARKS.size, RGB.red));
      s.contained = agentTag('CONTAINED', 'neon', root);
      s.nothingLost = agentTag('NOTHING LOST', 'neon', root);
    },
    update(t, c, s) {
      const hijackAt = c[0] + T0.hijack;
      const wallHitAt = c[3] + T3.reaches[1];
      // the camera holds; the hijack and the hit on the glass jolt it. The camera zoom-through (setCamera) in and out.
      const [hx, hy] = shake(t, hijackAt, 6, 0.4);
      const [wx, wy] = shake(t, wallHitAt, 5, 0.3);
      setCamera(s.cam, t, this.dur, { dx: hx + wx, dy: hy + wy });

      // ---------- the replay
      // it sinks away as the board comes in
      const away = P(t, c[2] + T2.away, T2.awayD);
      s.replay.style.opacity = 1 - away;
      s.replay.style.transform = `translateY(${Math.round(40 * away)}px)`;

      // the case file slams in, then pins to the corner as the laptop rises in
      s.caseFile.set(t, c[0] + T0.file);
      s.caseFile.pin(P(t, c[0] + T0.pin, T0.pinD));

      const laptopIn = P(t, c[0] + T0.laptop, 0.6);
      rise(s.laptop.screen, SCREEN.x, SCREEN.y, laptopIn);
      rise(s.laptop.base, BASE.x, BASE.y, laptopIn);
      // the password thief strikes: the screen's rim and a halo behind the laptop turn red with the add-on
      const hijack = P(t, hijackAt, 0.3);
      s.laptop.screen.style.borderColor = hijack > 0.5 ? C.red : C.lineLight;
      s.laptop.screen.style.boxShadow = glowShadow(RGB.red, hijack, { blur: 40, alpha: 0.45 });
      place(s.redHalo, HALO.x, HALO.y, 1, hijack * (0.85 + 0.15 * Math.sin(G * 2)) * laptopIn);

      const assistantPop = backPop(t, c[0] + T0.assistant, 0.6);
      place(s.assistant.el, ASSISTANT.x, ASSISTANT.y, assistantPop.s, assistantPop.o);
      s.assistant.set('idle');
      place(s.assistantLabel, ASSISTANT.x, ASSISTANT.labelY, 1, P(t, c[0] + T0.assistant + 0.2, 0.4));

      // the store rises in, its add-ons pop in one after the other; wallet-helper leaves it for the assistant, and
      // the other malicious ones turn red once found
      rise(s.store, STORE.x, STORE.y, P(t, c[0] + T0.store, 0.6));
      const flyAt = c[0] + T0.leave, landAt = flyAt + T0.flyD;
      const foundAt = c[0] + T0.found;
      s.store.found.style.opacity = P(t, foundAt, 0.3);
      s.storeTiles.forEach((tile, i) => {
        const [x, y] = storeSlot(i);
        const tilePop = backPop(t, c[0] + T0.store + 0.3 + i * 0.03);
        if (i === WALLET_SLOT) {
          const flight = P(t, flyAt, T0.flyD, ease);
          const [fx, fy] = bezier([[x, y], ...FLIGHT_CONTROLS, [ADDON.x, ADDON.y]], flight);
          place(tile, Math.round(fx), Math.round(fy), tilePop.s, t < landAt ? tilePop.o : 0);
          return;
        }
        place(tile, x, y, tilePop.s, tilePop.o);
        const found = RED_SLOTS.includes(i) && t >= foundAt;
        tile.style.borderColor = found ? C.red : C.line;
        tile.icon.setAttribute('stroke', found ? C.red : C.slate);
        tile.style.boxShadow = found ? glowShadow(RGB.red, P(t, foundAt, 0.2), { blur: 18, alpha: 0.5 }) : '';
      });

      // the add-on lands under the assistant and plugs in; its setup step runs, then shows the password thief
      const addOnPop = backPop(t, landAt);
      place(s.addOn, ADDON.x, ADDON.y, addOnPop.s, addOnPop.o);
      draw(s.plug, P(t, landAt + 0.1, 0.3));
      s.plug.setAttribute('stroke', hijack > 0.5 ? C.red : C.lineLight);
      const install = P(t, c[0] + T0.install, T0.hijack - T0.install, linear);
      s.addOn.bar.style.width = Math.round(install * ADDON.bar) + 'px';
      s.addOn.bar.style.background = hijack > 0.5 ? C.red : C.slate;
      s.addOn.step.style.opacity = (1 - hijack).toFixed(3);
      s.addOn.thief.style.opacity = hijack.toFixed(3);
      s.addOn.style.borderColor = hijack > 0.5 ? C.red : C.line;
      s.addOn.icon.setAttribute('stroke', hijack > 0.5 ? C.red : C.ink);
      s.addOn.style.boxShadow = glowShadow(RGB.red, hijack, { blur: 28, alpha: 0.55 });

      // its tendrils reach every item as the subtitle names it; each item turns red when reached, and a spark
      // carries what it holds back to the add-on, round and round
      ITEMS.forEach((item, i) => {
        const pop = backPop(t, c[0] + T0.items + i * T0.itemStep);
        place(s.items[i], item.x, item.y, pop.s, pop.o);
        const grabAt = c[1] + item.grab;
        const reach = P(t, grabAt - REACH_D, REACH_D, easeOut);
        draw(s.reach[i], reach);
        const grabbed = t >= grabAt;
        s.items[i].style.borderColor = grabbed ? C.red : C.line;
        s.items[i].icon.setAttribute('stroke', grabbed ? C.red : C.ink);
        s.items[i].style.boxShadow = glowShadow(RGB.red, P(t, grabAt, 0.2), { blur: 24, alpha: 0.5 });
        if (!grabbed) {
          sparkOnPath(s.reachSparks[i], s.reach[i], reach);
        } else {
          sparkOnPath(s.reachSparks[i], s.reach[i], 1 - ((G * 0.7 + i * 0.37) % 1), P(t, grabAt, 0.3));
        }
      });
      placeAgentTag(s.fullAccess, t, c[1] + T1.full, ...FULL_ACCESS);

      // the attacker's server rises in as the thief shows; three of the items fly off to it, landing as its rows
      rise(s.page, PAGE.x, PAGE.y, P(t, c[0] + T0.page, 0.5));
      LEAKS.forEach(({ item, at }, i) => {
        const leaveAt = c[1] + at;
        const flight = P(t, leaveAt, LEAK_D);
        const from = [ITEMS[item].x, ITEMS[item].y], to = pageRowIcon(i);
        const [x, y] = bezier([from, [from[0] + 120, from[1] - 220], [to[0] - 140, to[1] - 160], to], flight);
        place(s.chips[i], x, y, 1, flight > 0 && flight < 1 ? 1 : 0);
        showRow(s.page.rows[i], P(t, leaveAt + LEAK_D, 0.3), 26, true);
      });

      // ---------- the board pops in
      const pop = at => backPop(t, c[2] + at);
      const { model, checkpoint, history } = BOARD;
      const orbPop = pop(T2.orb);
      place(s.orb.el, model.x, model.y, orbPop.s, orbPop.o);
      const cpPop = pop(T2.checkpoint);
      place(s.checkpoint.el, checkpoint.x, checkpoint.y, cpPop.s, cpPop.o);
      const passAt = t >= c[3] + T3.pass ? c[3] + T3.pass : c[2] + T2.pass;
      s.checkpoint.check(t, passAt, 'pass');
      s.lanes.forEach((lane, i) => draw(lane, P(t, c[2] + T2.lanes + 0.3 * i, 0.4)));
      draw(s.commands, P(t, c[2] + T2.commands, 0.4));
      rise(s.history, history.x, history.y, P(t, c[2] + T2.history, 0.6));

      // the Worker pops in; it flashes UV as each card reaches it
      const workerPop = pop(T2.worker);
      place(s.worker, WORKER.x, WORKER.y, workerPop.s, workerPop.o);
      const received = [c[2] + T2.ride + T2.rideD, c[3] + T3.ride + T2.rideD];
      const workerFlash = Math.max(...received.map(at => t >= at - 0.15 ? Math.max(0, 1 - (t - at + 0.15) / 0.6) : 0));
      s.worker.style.borderColor = workerFlash > 0.3 ? C.uv : C.line;
      s.worker.style.boxShadow = glowShadow(RGB.uv, workerFlash, { blur: 30, alpha: 0.6 });

      // the orb thinks before each step it proposes
      const thinking = (t >= c[2] + T2.think && t < c[2] + T2.card) || (t >= c[3] + T3.think && t < c[3] + T3.card);
      const look = t >= c[3] + T3.think ? 0.5 * P(t, c[3] + T3.card, 0.4) : 0.5 * P(t, c[2] + T2.card, 0.4);
      s.orb.set(thinking ? 'thinking' : 'idle', { look });

      // ---------- the cards: each one grows out of the orb, passes the gate and rides into the Worker, which sends
      // its command into the box: a spark along the dashed line
      placeCard(s.cards[0], t, { card: c[2] + T2.card, gate: c[2] + T2.gate, ride: c[2] + T2.ride, rideD: T2.rideD });
      placeCard(s.cards[1], t, { card: c[3] + T3.card, gate: c[3] + T3.gate, ride: c[3] + T3.ride, rideD: T2.rideD });
      const commandAt = t >= c[3] + T3.command ? c[3] + T3.command : c[2] + T2.command;
      sparkOnPath(s.commandSpark, s.commands, P(t, commandAt, T2.commandD, linear));
      const addOnRunsAt = c[2] + T2.command + T2.commandD;
      const codeRunsAt = c[3] + T3.command + T2.commandD;

      // ---------- the first box: the tools pop in, the glass forms round them; the add-on runs, then misbehaves
      const toolPops = BOX_TOOLS.map((_, i) => pop(T2.tools + i * T2.toolStep));
      const glassIn = P(t, c[2] + T2.box, 0.45, easeOut);
      const formed = Math.max(0, 1 - Math.abs(t - c[2] - T2.box - 0.35) / 0.45);
      const redAt = c[3] + T3.red;
      const reachAts = T3.reaches.map(at => c[3] + at);
      const misbehaving = t >= redAt && t < c[3] + T3.drop;
      // the misbehaving add-on jitters sideways, a new hashed offset every frame
      const jitter = misbehaving ? Math.round((hash(Math.floor(t * 30)) * 2 - 1) * 3) : 0;
      s.box.tiles.forEach((tile, i) => {
        if (i !== ADDON_TOOL) setToolTone(tile, null);
        else if (t >= redAt) setToolTone(tile, 'red', P(t, redAt, 0.2));
        else setToolTone(tile, t >= addOnRunsAt ? 'run' : null, P(t, addOnRunsAt, 0.2));
      });
      // the internet reach shakes the box along the wall it strikes; the box then drops out, turning, and fades
      const shakeX = Math.round(dampedShake(t, wallHitAt, 10, 0.4, 5));
      const drop = P(t, c[3] + T3.drop, T3.dropD, easeIn);
      const boxO = 1 - P(t, c[3] + T3.fade, 0.3);
      // a red flash at each reach's end, the hit on the glass the stronger
      const redFlash = Math.max(0, ...reachAts.map((at, i) => {
        if (t < at) return 0;
        return (i === 1 ? 1 : 0.5) * (1 - (t - at) / 0.4);
      }));
      // each badge shows as its reach gets to it
      const badgePops = reachAts.map(at => popIn(t, at, 0.2));
      placeSandbox(s.box, {
        dx: shakeX, dy: Math.round(380 * drop), rot: 9 * drop, o: boxO,
        glass: { s: lerp(1.06, 1, glassIn), o: P(t, c[2] + T2.box, 0.3) }, tiles: toolPops,
        tileDx: BOX_TOOLS.map((_, i) => i === ADDON_TOOL ? jitter : 0), badges: badgePops, t,
        shineAt: c[2] + T2.shine, glow: formed, red: redFlash,
        // the add-on's run line, until it misbehaves
        run: { o: P(t, addOnRunsAt, 0.3) * (1 - P(t, redAt, 0.2)), p: P(t, addOnRunsAt, RUN.d, linear) },
      });

      // The dramatic beat: the add-on reaches for the saved passwords, finds none (NO KEYS), then for the internet,
      // and hits the glass (NO INTERNET); each tendril pulls back once it gets there
      REACHES.forEach((reach, i) => {
        const at = reachAts[i];
        const grow = P(t, at - T3.reach, T3.reach, easeIn);
        const back = P(t, at + T3.retract, 0.3);
        draw(s.tendrils[i], grow * (1 - back));
        // the spark on the growing tendril's tip (the tendril is drawn in the box's coordinates)
        if (t < at && grow > 0) {
          const tip = s.tendrils[i].getPointAtLength(s.tendrils[i]._L * grow);
          place(s.tips[i], BOX_LEFT + tip.x + shakeX, BOX_TOP + tip.y, 1, Math.min(1, grow * 6));
        } else {
          place(s.tips[i], 0, 0, 1, 0);
        }
        placeRipples(s.probeRings[i], t, at, BOX_LEFT + reach.to[0] + shakeX, BOX_TOP + reach.to[1], 12, 110,
          { d: 0.5 });
      });
      // the hit on the glass: the wall flashes red and sparks fly back into the box
      const hit = REACHES[1].to;
      const [hitX, hitY] = [BOX_LEFT + hit[0] + shakeX, BOX_TOP + hit[1]];
      place(s.wallFlash, hitX, hitY, 1, t >= wallHitAt ? Math.max(0, 1 - (t - wallHitAt) / 0.5) : 0);
      s.sparks.forEach((spark, k) => {
        const u = (t - wallHitAt) / SPARKS.d;
        if (u < 0 || u >= 1) {
          place(spark, 0, 0, 1, 0);
          return;
        }
        const inward = Math.atan2(-WALL_NORMAL[1], -WALL_NORMAL[0]);
        const angle = inward + (hash(31 + k) - 0.5) * 2.4;
        const dist = lerp(SPARKS.dist[0], SPARKS.dist[1], hash(38 + k)) * easeOut(u);
        place(spark, hitX + Math.cos(angle) * dist, hitY + Math.sin(angle) * dist, 1, 1 - u);
      });
      // the glass cracks from the hit before the box is thrown away
      s.cracks.forEach((crack, i) => draw(crack, P(t, c[3] + T3.crack + i * 0.06, 0.3)));

      // ---------- SANDBOX 2 pops in, glass and badges ready, and shines once; the next step's code runs in it, then
      // it is thrown away in turn, and SANDBOX 3 pops in for the step after
      const shown = { s: 1, o: 1 };
      const readyBox = { glass: shown, tiles: BOX_TOOLS.map(() => shown), badges: [shown, shown], t };
      const box2Pop = backPop(t, c[3] + T3.fresh, 0.5);
      const drop2 = P(t, c[3] + T3.drop2, T3.dropD, easeIn);
      placeSandbox(s.box2, {
        ...readyBox, dy: Math.round(380 * drop2), rot: 9 * drop2, s: box2Pop.s,
        o: box2Pop.o * (1 - P(t, c[3] + T3.fade2, 0.3)), shineAt: c[3] + T3.fresh + 0.3,
        run: { o: P(t, codeRunsAt, 0.3), p: P(t, codeRunsAt, T3.runD, linear) },
      });
      s.box2.tiles.forEach((tile, i) => {
        const runs = i === CODE_TOOL && t >= codeRunsAt;
        setToolTone(tile, runs ? 'run' : null, P(t, codeRunsAt, 0.2));
      });
      const box3Pop = backPop(t, c[3] + T3.fresh3, 0.5);
      // its sheen sweeps early, done before the layout check samples the end of the subtitle: the check counts the
      // sheen at full size, though the glass clips it
      placeSandbox(s.box3, { ...readyBox, s: box3Pop.s, o: box3Pop.o, shineAt: c[3] + T3.fresh3 + 0.1 });
      s.box3.tiles.forEach(tile => setToolTone(tile, null));

      // the providers pop in as the subtitle names them
      PROVIDERS.forEach(({ at }, i) => {
        const providerPop = popIn(t, c[2] + at);
        place(s.providers[i], ...providerSpot(i), providerPop.s, providerPop.o);
      });

      // ---------- the outcome: CONTAINED; the Event History keeps its rows and records the new box, NOTHING LOST
      placeAgentTag(s.contained, t, c[3] + T3.contained, ...CONTAINED);
      const rowAts = [c[2] + T2.row1, c[2] + T2.row2, c[3] + T3.row3, c[3] + T3.row4, c[3] + T3.row5];
      fillHistoryStrip(s.history, t, rowAts.map(at => ({ at, tag: 'SAVED', tone: 'saved' })));
      scrollHistory(s.history, t, rowAts);
      const keptAt = c[3] + T3.kept;
      const kept = P(t, keptAt, 0.3) * (1 - P(t, keptAt + 1.4, 0.6));
      s.history.style.boxShadow = glowShadow(RGB.neon, kept, { blur: 40, alpha: 0.55, spread: 2 });
      placeAgentTag(s.nothingLost, t, c[3] + T3.lost, ...NOTHING_LOST);
    }
  });
}
