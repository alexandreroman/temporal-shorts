// ===================== 5. LOCKED IN A SANDBOX
// The case file (August 2025, supply chain) slams in, then pins to the corner as a developer's computer rises in:
// folders, files, saved passwords and the network round the AI assistant, which the malware turns red. Red tendrils
// reach every one of them as the subtitle names them (FULL ACCESS), then three of them fly off to a public page.
// With Temporal, the board comes in: the model's `run_code` card passes the WORKFLOW checkpoint, which routes it down
// a fork, away from YOUR WORKERS, into a glass SANDBOX box: a sealed Worker, with no keys and no network.
// The dramatic beat: the code turns red and lashes out at the walls of the box, four hits with sparks, each one
// shaking the box alone; the glass cracks, the box drops out of the frame, a fresh one pops in, and the Workflow
// carries on: CONTAINED, the `run_code · SANDBOX` row of the Event History gets its tag and the model's next step
// follows. The camera zoom-through (setCamera) brings the scene in and plays into the next one; in between, the
// camera holds.
// The block keeps every name declared in this file local to this scene.
{
  // ---------- the replay: a developer's computer and a public page, under the pinned case file (x 120-480,
  // y 150-318); with it, the composition spans y 150-836
  // the laptop: its screen (bar: the height of its title bar) and its base, centered under it
  const SCREEN = { x: 940, y: 570, w: 720, h: 460, bar: 44 };
  const BASE = { x: 940, y: 818, w: 820, h: 36 };
  // the red halo behind the laptop once the malware strikes, inside the content frame
  const HALO = { x: 940, y: 560, w: 1100, h: 620 };
  // the AI assistant in the middle of the screen, its label above it
  const ASSISTANT = { x: 940, y: 592, size: 120, labelY: 500 };
  // the items on the screen, in two columns round the assistant; grab: when the assistant's tendril reaches it,
  // seconds after c[1], as the subtitle names it ("every file", "every saved password", "the whole network")
  const ITEM = { w: 140, h: 96, icon: 36 };
  const ITEMS = [
    { icon: 'folder', label: 'Projects', x: 690, y: 470, grab: 2.75 },
    { icon: 'folder', label: 'Documents', x: 690, y: 592, grab: 2.85 },
    { icon: 'file', label: 'notes.txt', x: 690, y: 714, grab: 2.95 },
    { icon: 'file', label: 'keys.txt', x: 1190, y: 470, grab: 3.05 },
    { icon: 'password', label: 'Passwords', x: 1190, y: 592, grab: 3.6 },
    { icon: 'globe', label: 'Network', x: 1190, y: 714, grab: 4.95 },
  ];
  // how long a tendril takes to reach its item, s
  const REACH_D = 0.35;
  // the FULL ACCESS tag, centered above the screen, 20 px clear of it
  const FULL_ACCESS = [940, 300];
  // the public page on the right, its top level with the screen's: its rows (top of the first, pitch, height, side
  // inset) list what the assistant published
  const PAGE = { x: 1630, y: 488, w: 340, h: 296, rowTop: 104, pitch: 60, rowH: 48, inset: 20 };
  // what flies to the page, in row order: the item (index in ITEMS) and when it leaves, seconds after c[1]; each
  // flight lasts LEAK_D seconds; the flying chip is CHIP px square
  const LEAKS = [{ item: 3, at: 5.3 }, { item: 4, at: 5.55 }, { item: 2, at: 5.8 }];
  const LEAK_D = 0.55;
  const CHIP = 48;

  // ---------- the board: the model and the checkpoint at BOARD's places, the Event History strip at BOARD.history; on
  // the right, a compact YOUR WORKERS zone over the SANDBOX box, both in the column x 1420-1800
  const ZONE = { x: 1610, y: 263, w: 380, h: 162 };
  // the zone's tool tiles, in a row: their icons, size, icon size, pitch and center line
  const TOOL_ICONS = ['mail', 'database', 'card', 'folder'];
  const TOOL = { size: 64, icon: 30, pitch: 84, y: 288 };
  // the sandbox: a glass box, its bottom level with the Event History's (y 856), 60 px right of it
  const BOX = { x: 1610, y: 640, w: 380, h: 432, border: 2 };
  const BOX_LEFT = BOX.x - BOX.w / 2, BOX_TOP = BOX.y - BOX.h / 2;
  // its badges, side by side at its bottom: size, icon size, distance of each center from the box's middle, bottom
  // inset; [icon, label] of each
  const BADGE = { w: 150, h: 88, icon: 32, dx: 85, bottom: 24 };
  const BADGES = [['keyOff', 'No keys'], ['wifiOff', 'No network']];
  // the action card at rest in the box, centered between the box's heading and its badges
  const CARD_REST = [1610, 623];
  // the CONTAINED tag, between the zone and the box, 20 px clear of each
  const CONTAINED = [1610, 384];
  // the lanes: the orb to the checkpoint, then a fork from the checkpoint's right edge to the zone and to the card's
  // place in the box (the card rides that lower branch)
  const LANE_IN = [BOARD.model.x + BOARD.model.size / 2 + 16, BOARD.checkpoint.x - CHECKPOINT.w / 2];
  const GATE_RIGHT = BOARD.checkpoint.x + CHECKPOINT.w / 2;
  const FORK_UP = sCurveD(GATE_RIGHT, BOARD.laneY, ZONE.x - ZONE.w / 2, ZONE.y);
  const FORK_DOWN = sCurveD(GATE_RIGHT, BOARD.laneY, BOX_LEFT, CARD_REST[1]);
  // the same lower branch as Bezier control points (see sCurveD), for the card's route
  const FORK_MID = (GATE_RIGHT + BOX_LEFT) / 2;
  const FORK_DOWN_CURVE = [[GATE_RIGHT, BOARD.laneY], [FORK_MID, BOARD.laneY], [FORK_MID, CARD_REST[1]],
    [BOX_LEFT, CARD_REST[1]]];
  // the card's route past the gate: points along the lower branch, then into the box
  const ROUTE = [...Array.from({ length: 17 }, (_, k) => bezier(FORK_DOWN_CURVE, k / 16)), CARD_REST];

  // ---------- the beat, in the box's own coordinates (from its outer top left corner): the code's four hits on the
  // walls, in order. from: where the tendril leaves the card; to: where it hits the wall (2 px inside, on the glass);
  // normal: the wall's outward direction; badge: the badge that swells at the hit (index in BADGES), or null
  const HITS = [
    { from: [298, 190], to: [376, 150], normal: [1, 0], badge: 1 },
    { from: [250, 161], to: [290, 4], normal: [0, -1], badge: 0 },
    { from: [82, 205], to: [4, 175], normal: [-1, 0], badge: null },
    { from: [110, 237], to: [4, 300], normal: [-1, 0], badge: null },
  ];
  // sparks thrown back into the box at each hit: how many, their size, how far they fly, for how long
  const SPARKS = { n: 6, size: 8, dist: [36, 80], d: 0.45 };

  // ---------- the beats, in seconds after each subtitle start
  // c[0]: the case file slams in (file), pins to the corner (pin, pinD) as the laptop rises in (laptop), its items
  // pop in one after the other (items, itemStep) round the assistant (assistant); the malware turns the assistant
  // red as "key and password thieves" is read (hijack)
  const T0 = { file: 0.1, pin: 3.6, pinD: 0.8, laptop: 3.9, items: 4.2, itemStep: 0.06, assistant: 4.3, hijack: 5.0 };
  // c[1]: FULL ACCESS lands as "full access" is read (full); the tendrils reach the items (ITEMS.grab); the public
  // page rises in (page), then the leaks fly (LEAKS)
  const T1 = { full: 1.9, page: 4.9 };
  // c[2]: the replay sinks away (away, awayD) as the board pops in (orb, checkpoint, lanes, zone, tools, box, history);
  // the orb thinks (think), the card grows out of it (card) and reaches the gate (gate), which lets it pass (pass);
  // it rides the lower branch (ride, rideD), which lights up, into the box; the history records the model call
  // (row1) and the routed step (row2); the box shines as "sandbox" is read (shine), glows at "sealed" (sealed), and
  // its badges pop in at "no keys" (badges, badgeStep)
  const T2 = {
    away: -0.05, awayD: 0.5, orb: 0.3, checkpoint: 0.45, lanes: 0.7, zone: 0.6, tools: 0.7, box: 0.75, history: 0.6,
    think: 0.9, card: 1.6, gate: 2.35, pass: 2.45, ride: 2.6, rideD: 1.4, row1: 1.7, row2: 3.3, shine: 4.1,
    sealed: 4.8, badges: 5.95, badgeStep: 0.3,
  };
  // c[3]: the code turns red at "misbehaves" (red) and lashes out (hits, the last one at "stays in the box"); each
  // tendril grows over reach seconds and pulls back after retract; the glass cracks (crack), the box drops out
  // (drop, dropD) at "thrown away", a fresh one pops in (fresh); CONTAINED lands (contained), the routed step's row
  // gets its tag at "the Workflow carries on" (rowTag), the orb thinks again (think) and its next step is recorded
  // (row3)
  const T3 = {
    red: 0.9, hits: [1.4, 1.8, 2.2, 2.6], reach: 0.25, retract: 0.1, crack: 3.5, drop: 4.0, dropD: 0.6, fresh: 4.5,
    contained: 5.0, rowTag: 5.3, think: 5.5, row3: 5.8,
  };

  // The Event History rows of the board: the model's call, the routed step, the model's next step
  const HISTORY_ROWS = ['<b>model</b> suggests run_code', '<b>run_code</b> · SANDBOX', '<b>model</b> next step'];
  const isModelRow = i => i !== 1;

  // ---------- helpers
  // The point at p (0 to 1) between two points [x, y]
  const lerp2 = (a, b, p) => [lerp(a[0], b[0], p), lerp(a[1], b[1], p)];
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
  // An SVG layer w x h px inside a box with a border of `border` px, in the box's outer coordinates
  const boxSvg = (parent, w, h, border, css = {}) => {
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = '<defs></defs>';
    Object.assign(svg.style, { position: 'absolute', left: -border + 'px', top: -border + 'px', ...css });
    parent.appendChild(svg);
    return svg;
  };
  // Places a child of a bordered box at (x, y) in the box's outer coordinates (children sit in its padding box)
  const placeInBox = (e, x, y, border, s = 1, o = 1) => place(e, x - border, y - border, s, o);
  // A stage point (x, y) of something inside the box, once the box is moved by (dx, dy) and turned by rot degrees
  // round its center
  const boxPoint = (x, y, dx, dy, rot) => {
    const a = rot * Math.PI / 180, ox = x - BOX.x, oy = y - BOX.y;
    return [BOX.x + dx + ox * Math.cos(a) - oy * Math.sin(a), BOX.y + dy + ox * Math.sin(a) + oy * Math.cos(a)];
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
      + `<span class="lbl" style="font-size:16px;line-height:20px">Developer's computer</span></div>`,
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
  // The public page: an eye and PUBLIC PAGE, "anyone can read it", then one row per leak, hidden until it lands
  // (page.rows)
  const makePublicPage = parent => {
    const page = E(parent,
      `<div style="position:absolute;left:${PAGE.inset}px;top:18px;height:30px;display:flex;align-items:center;`
      + `gap:10px">${ICON('eye', 24, C.ink, 1.8)}<span class="lbl" style="padding-left:0;font-size:18px;`
      + `color:var(--ink)">Public page</span></div>`
      + `<div class="mono" style="position:absolute;left:${PAGE.inset}px;top:58px;font-size:16px;line-height:20px;`
      + `color:${C.slate}">anyone can read it</div>`,
      'tile', { width: PAGE.w + 'px', height: PAGE.h + 'px', textAlign: 'left' });
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

  // The SANDBOX box: glass (a pale border, a faint fill, a sheen that sweeps across it on cue), its heading (the
  // sandbox icon, SANDBOX, "a sealed Worker"), a red tint for the hits (box.tint), its badges at the bottom
  // (box.badges, hidden until popped), a layer for the code's tendrils (box.tendrilSvg, glowing red) and one for the
  // cracks (box.crackSvg)
  const makeSandbox = root => {
    const { w, h, border } = BOX;
    const box = E(root,
      `<div style="position:absolute;left:${24 - border}px;top:${20 - border}px;height:34px;display:flex;`
      + `align-items:center;gap:10px">${ICON('sandbox', 22, C.ink, 1.8)}<span class="lbl" style="padding-left:0;`
      + 'font-size:18px;color:var(--ink)">Sandbox</span></div>'
      + `<div class="mono" style="position:absolute;left:${24 - border}px;top:${58 - border}px;font-size:16px;`
      + `line-height:20px;color:${C.slate}">a sealed Worker</div>`,
      '', {
        width: w + 'px', height: h + 'px', border: `${border}px solid rgba(${RGB.ink},.55)`,
        borderRadius: 'var(--r)', overflow: 'hidden',
        background: `linear-gradient(135deg, rgba(${RGB.ink},.12) 0%, rgba(${RGB.ink},.04) 38%, `
          + `rgba(${RGB.uv},.1) 100%)`,
      });
    // the red tint of a hit, under the badges
    box.tint = E(box, '', '', {
      left: -border + 'px', top: -border + 'px', width: w + 'px', height: h + 'px',
      background: `radial-gradient(closest-side, rgba(${RGB.red},.1), rgba(${RGB.red},.26))`,
    });
    box.sheen = E(box, '', '', {
      width: '140px', height: (h + 240) + 'px',
      background: `linear-gradient(90deg, rgba(${RGB.ink},0), rgba(${RGB.ink},.22), rgba(${RGB.ink},0))`,
    });
    box.badges = BADGES.map(([icon, label]) => E(box,
      ICON(icon, BADGE.icon, C.ink, 1.8)
      + `<div class="lbl" style="font-size:16px;line-height:20px;margin-top:10px;color:var(--ink)">${label}</div>`,
      'tile', {
        width: BADGE.w + 'px', height: BADGE.h + 'px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: C.bg,
      }));
    box.crackSvg = boxSvg(box, w, h, border);
    box.tendrilSvg = boxSvg(box, w, h, border, { filter: `drop-shadow(0 0 6px rgba(${RGB.red},.8))` });
    return box;
  };
  // Places a sandbox at its spot, moved by (dx, dy), turned by rot degrees, at scale s and opacity o; its sheen sweeps
  // across it from shineAt (0.6 s); badges: the pop of each badge ({ s, o }); glow: the white glow of its rim (0 to
  // 1), red: the red flash of a hit (0 to 1)
  const placeSandbox = (box, { dx = 0, dy = 0, rot = 0, s = 1, o = 1, shineAt = -1, t = 0, badges, glow = 0,
    red = 0 }) => {
    place(box, BOX.x + dx, BOX.y + dy, s, o, rot);
    const sweep = P(t, shineAt, 0.6, linear);
    box.sheen.style.opacity = sweep > 0 && sweep < 1 ? 1 : 0;
    box.sheen.style.transform = `translate(${Math.round(lerp(-220, BOX.w + 80, sweep))}px,-120px) rotate(20deg)`;
    box.badges.forEach((badge, i) => {
      const x = BOX.w / 2 + (i === 0 ? -BADGE.dx : BADGE.dx);
      const y = BOX.h - BADGE.bottom - BADGE.h / 2;
      placeInBox(badge, x, y, BOX.border, badges[i].s, badges[i].o);
    });
    box.tint.style.opacity = red.toFixed(3);
    box.style.borderColor = red > 0.5 ? C.red : `rgba(${RGB.ink},${(0.55 + 0.45 * glow).toFixed(3)})`;
    box.style.boxShadow = red > 0 ? glowShadow(RGB.red, red, { blur: 40, alpha: 0.7 })
      : glowShadow(RGB.ink, glow, { blur: 36, alpha: 0.45 });
  };

  scene({
    chapter: 5, title: 'Locked in a sandbox',
    subs: [
      {
        text: "August 2025: malware turned the AI assistants on developers' computers into key and password thieves.",
      },
      {
        text: "Those assistants ran with full access: every file, every saved password, the whole network.",
        // the last leak lands at c[1] + 6.35: the published page then holds about 1.2 s
        after: 1.0,
      },
      {
        text: "With Temporal, risky work, like code the AI wrote, goes to a <b>sandbox</b>: "
          + "a sealed Worker with no keys.",
        // the badges pop in at c[2] + 6.25: the sealed box then holds about 1.2 s
        after: 0.5,
      },
      {
        text: "If the code misbehaves, the damage stays in the box. The box is thrown away; the Workflow carries on.",
        // the model's next step is recorded at c[3] + 6.1: the board then holds about 2 s before the fade
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
        date: 'AUGUST 2025', tag: 'SUPPLY CHAIN', headline: 'Malware turns AI assistants into thieves',
      });
      s.laptop = makeLaptop(s.replay);
      s.replaySvg = svgLayer(s.replay);
      s.replaySvg.style.filter = `drop-shadow(0 0 6px rgba(${RGB.red},.8))`;
      s.reach = ITEMS.map((item, i) => {
        const left = item.x < ASSISTANT.x;
        const edgeX = item.x + (left ? ITEM.w / 2 : -ITEM.w / 2);
        const angle = Math.atan2(item.y - ASSISTANT.y, edgeX - ASSISTANT.x);
        const r = ASSISTANT.size / 2 + 2;
        const x0 = ASSISTANT.x + Math.cos(angle) * r, y0 = ASSISTANT.y + Math.sin(angle) * r;
        return path(s.replaySvg, tendrilD(x0, y0, edgeX, item.y, i + 1, 18), C.red, 4, false);
      });
      s.items = ITEMS.map(item => makeItem(s.replay, item));
      s.assistant = makeModelOrb(s.replay, { x: ASSISTANT.x, y: ASSISTANT.y, size: ASSISTANT.size, label: '' });
      s.assistantLabel = E(s.replay, 'AI assistant', 'lbl', { fontSize: '16px', lineHeight: '20px' });
      // one spark per tendril: on its tip while it grows, then flowing back to the assistant along it
      s.reachSparks = ITEMS.map(() => makeSpark(s.replay, 10, RGB.red));
      s.fullAccess = agentTag('FULL ACCESS', 'red', s.replay);
      s.page = makePublicPage(s.replay);
      s.chips = LEAKS.map(({ item }) => E(s.replay, ICON(ITEMS[item].icon, 26, C.red, 1.8), 'tile', {
        width: CHIP + 'px', height: CHIP + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderColor: C.red, background: C.bg, boxShadow: glowShadow(RGB.red, 1, { blur: 20, alpha: 0.6 }),
      }));

      // the board, in stacking order: the zone and its tools, the lanes, the checkpoint, the orb, the history, the
      // sandboxes, then the card, the sparks of the beat and the tag
      s.zone = makeWorkerZone(root, ZONE);
      s.tools = TOOL_ICONS.map(icon => E(root, ICON(icon, TOOL.icon, C.ink, 1.8), 'tile', {
        width: TOOL.size + 'px', height: TOOL.size + 'px', display: 'flex', alignItems: 'center',
        justifyContent: 'center',
      }));
      s.boardSvg = svgLayer(root);
      const { laneY } = BOARD;
      s.lanes = [
        path(s.boardSvg, `M ${LANE_IN[0]} ${laneY} H ${LANE_IN[1]}`, C.line, 2, false),
        path(s.boardSvg, FORK_UP, C.line, 2, false),
        path(s.boardSvg, FORK_DOWN, C.line, 2, false),
      ];
      // the lower branch lights up in UV as the card rides it
      s.route = path(s.boardSvg, FORK_DOWN, C.uv, 3, false);
      s.checkpoint = makeCheckpoint(root, BOARD.checkpoint);
      s.orb = makeModelOrb(root, BOARD.model);
      s.history = makeHistoryStrip(root, HISTORY_ROWS, { uvRow: isModelRow });

      s.box = makeSandbox(root);
      s.tendrils = HITS.map(({ from, to }, i) => path(s.box.tendrilSvg, tendrilD(...from, ...to, 20 + i, 12), C.red,
        4, false));
      s.cracks = HITS.map(({ to, normal }, i) => path(s.box.crackSvg, crackD(...to, normal, 40 + 7 * i),
        `rgba(${RGB.ink},.85)`, 2, false));
      s.freshBox = makeSandbox(root);

      s.card = makeActionCard(root, { tool: 'run_code', arg: 'code the AI wrote' });
      s.tips = HITS.map(() => makeSpark(root, 10, RGB.red));
      s.wallFlashes = HITS.map(({ normal }) => E(root, '', '', {
        width: (normal[0] ? 6 : 120) + 'px', height: (normal[0] ? 120 : 6) + 'px', borderRadius: '3px',
        background: C.red, boxShadow: glowShadow(RGB.red, 1, { blur: 18, alpha: 0.9, spread: 2 }),
      }));
      s.impactRings = HITS.map(() => makeRipples(root, 1, RGB.red));
      s.sparks = HITS.map(() => Array.from({ length: SPARKS.n }, () => makeSpark(root, SPARKS.size, RGB.red)));
      s.contained = agentTag('CONTAINED', 'neon', root);
    },
    update(t, c, s) {
      const hijackAt = c[0] + T0.hijack;
      // the camera holds; the hijack jolts it. The camera zoom-through (setCamera) in and out.
      const [jx, jy] = shake(t, hijackAt, 6, 0.4);
      setCamera(s.cam, t, this.dur, { dx: jx, dy: jy });

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
      // the malware turns the assistant red: its screen's rim and a halo behind the laptop turn red with it
      const hijack = P(t, hijackAt, 0.3);
      s.laptop.screen.style.borderColor = hijack > 0.5 ? C.red : C.lineLight;
      s.laptop.screen.style.boxShadow = glowShadow(RGB.red, hijack, { blur: 40, alpha: 0.45 });
      place(s.redHalo, HALO.x, HALO.y, 1, hijack * (0.85 + 0.15 * Math.sin(G * 2)) * laptopIn);

      const assistantPop = backPop(t, c[0] + T0.assistant, 0.6);
      place(s.assistant.el, ASSISTANT.x, ASSISTANT.y, assistantPop.s, assistantPop.o);
      s.assistant.set(hijack > 0 ? 'hijacked' : 'idle', { mix: hijack });
      place(s.assistantLabel, ASSISTANT.x, ASSISTANT.labelY, 1, P(t, c[0] + T0.assistant + 0.2, 0.4));

      // its tendrils reach every item as the subtitle names it; each item turns red when reached, and a spark
      // carries what it holds back to the assistant, round and round
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

      // three of them fly off to the public page, landing as its rows
      rise(s.page, PAGE.x, PAGE.y, P(t, c[1] + T1.page, 0.5));
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
      const { model, checkpoint, history, laneY } = BOARD;
      const orbPop = pop(T2.orb);
      place(s.orb.el, model.x, model.y, orbPop.s, orbPop.o);
      const cpPop = pop(T2.checkpoint);
      place(s.checkpoint.el, checkpoint.x, checkpoint.y, cpPop.s, cpPop.o);
      s.checkpoint.check(t, c[2] + T2.pass, 'pass');
      draw(s.lanes[0], P(t, c[2] + T2.lanes, 0.4));
      s.lanes.slice(1).forEach(lane => draw(lane, P(t, c[2] + T2.lanes + 0.3, 0.4)));
      const zonePop = pop(T2.zone);
      place(s.zone, ZONE.x, ZONE.y, zonePop.s, zonePop.o);
      s.tools.forEach((tool, i) => {
        const toolPop = pop(T2.tools + i * 0.06);
        place(tool, ZONE.x + (i - 1.5) * TOOL.pitch, TOOL.y, toolPop.s, toolPop.o);
      });
      rise(s.history, history.x, history.y, P(t, c[2] + T2.history, 0.6));

      // the orb thinks, then proposes the step; it thinks again when the Workflow carries on
      const thinking = (t >= c[2] + T2.think && t < c[2] + T2.card) || t >= c[3] + T3.think;
      s.orb.set(thinking ? 'thinking' : 'idle', { look: 0.5 * P(t, c[2] + T2.card, 0.4) });

      // ---------- the card: it grows out of the orb, passes the gate, rides the lower branch into the box
      const stops = actionStops(s.card, 0);
      const grow = P(t, c[2] + T2.card, T2.gate - T2.card);
      const ride = P(t, c[2] + T2.ride, T2.rideD);
      const routeAt = pointAlong([stops.gate, ...ROUTE], ride);
      draw(s.route, P(t, c[2] + T2.ride + 0.2, T2.rideD - 0.4), 1 - P(t, c[3] + T3.drop, 0.5));

      // ---------- the sandbox and the beat
      const hits = T3.hits.map(at => c[3] + at);
      // each hit shakes the box alone, along the wall it strikes
      let shakeX = 0, shakeY = 0;
      HITS.forEach(({ normal }, i) => {
        const push = dampedShake(t, hits[i], 12, 0.4, 5);
        shakeX += push * normal[0];
        shakeY += push * normal[1];
      });
      // the box drops out, turning, and fades
      const dropAt = c[3] + T3.drop;
      const drop = P(t, dropAt, T3.dropD, easeIn);
      const dx = Math.round(shakeX), dy = Math.round(shakeY + 360 * drop);
      const rot = 9 * drop;
      const boxPop = pop(T2.box);
      const boxO = boxPop.o * (1 - P(t, dropAt + 0.3, 0.3));
      const redFlash = Math.max(0, ...hits.map(hit => t >= hit ? 1 - (t - hit) / 0.35 : 0));
      const badgePop = i => {
        const shown = popIn(t, c[2] + T2.badges + i * T2.badgeStep, 0.2);
        const swellAt = HITS.findIndex(hit => hit.badge === i);
        return { s: shown.s * (swellAt < 0 ? 1 : swell(t, hits[swellAt], 0.14)), o: shown.o };
      };
      const sealed = Math.max(0, 1 - Math.abs(t - c[2] - T2.sealed - 0.15) / 0.45);
      placeSandbox(s.box, {
        dx, dy, rot, s: boxPop.s, o: boxO, t, shineAt: c[2] + T2.shine, badges: [badgePop(0), badgePop(1)],
        glow: sealed, red: redFlash,
      });

      // the fresh box pops in, glass and badges ready, and shines once
      const freshPop = backPop(t, c[3] + T3.fresh, 0.5);
      placeSandbox(s.freshBox, {
        s: freshPop.s, o: freshPop.o, t, shineAt: c[3] + T3.fresh + 0.3, badges: [{ s: 1, o: 1 }, { s: 1, o: 1 }],
      });

      // the card: on the way, then in the box, where it misbehaves (red, jittering) and falls with it
      const misbehaving = t >= c[3] + T3.red && t < c[3] + T3.hits[3] + 0.4;
      const jitter = misbehaving ? Math.round((hash(Math.floor(t * 30)) * 2 - 1) * 3) : 0;
      s.card.setTone(t >= c[3] + T3.red ? 'red' : null);
      if (t < c[2] + T2.ride) {
        const [x, y] = lerp2(stops.from, stops.gate, grow);
        s.card.place(Math.round(x), Math.round(y), lerp(0.3, 1, grow), P(t, c[2] + T2.card, 0.2));
      } else if (ride < 1) {
        s.card.place(routeAt[0], routeAt[1]);
      } else {
        const [x, y] = boxPoint(CARD_REST[0] + jitter, CARD_REST[1], dx, dy, rot);
        place(s.card.el, Math.round(x), Math.round(y), 1, boxO, rot);
      }

      // The dramatic beat: the code lashes out at the walls; each tendril strikes, the wall flashes red, sparks fly
      // back into the box, then the tendril pulls back
      HITS.forEach((hit, i) => {
        const at = hits[i];
        const reach = P(t, at - T3.reach, T3.reach, easeIn);
        const back = P(t, at + T3.retract, 0.3);
        draw(s.tendrils[i], reach * (1 - back));
        const [tipX, tipY] = [BOX_LEFT + hit.to[0] + dx, BOX_TOP + hit.to[1] + dy];
        // the spark on the growing tendril's tip (sparkOnPath() reads stage coordinates; the tendril is the box's)
        if (t < at && reach > 0) {
          const tip = s.tendrils[i].getPointAtLength(s.tendrils[i]._L * reach);
          place(s.tips[i], BOX_LEFT + tip.x + dx, BOX_TOP + tip.y + dy, 1, Math.min(1, reach * 6));
        } else {
          place(s.tips[i], 0, 0, 1, 0);
        }
        const flash = t >= at ? Math.max(0, 1 - (t - at) / 0.5) : 0;
        place(s.wallFlashes[i], tipX, tipY, 1, flash);
        placeRipples(s.impactRings[i], t, at, tipX, tipY, 12, 120, { d: 0.5 });
        s.sparks[i].forEach((spark, k) => {
          const u = (t - at) / SPARKS.d;
          if (u < 0 || u >= 1) {
            place(spark, 0, 0, 1, 0);
            return;
          }
          const inward = Math.atan2(-hit.normal[1], -hit.normal[0]);
          const angle = inward + (hash(i * 31 + k) - 0.5) * 2.4;
          const dist = lerp(SPARKS.dist[0], SPARKS.dist[1], hash(i * 31 + k + 7)) * easeOut(u);
          place(spark, tipX + Math.cos(angle) * dist, tipY + Math.sin(angle) * dist, 1, 1 - u);
        });
      });
      // the glass cracks from every hit before the box is thrown away
      s.cracks.forEach((crack, i) => draw(crack, P(t, c[3] + T3.crack + i * 0.05, 0.3)));

      // ---------- the outcome: CONTAINED, and the Workflow carries on in the history
      placeAgentTag(s.contained, t, c[3] + T3.contained, ...CONTAINED);
      fillHistoryStrip(s.history, t, [
        { at: c[2] + T2.row1, tag: 'SAVED', tone: 'saved' },
        { at: c[2] + T2.row2, tag: null },
        { at: c[3] + T3.row3, tag: 'SAVED', tone: 'saved' },
      ]);
      // the routed step's tag lands only once the box is thrown away
      const routedTag = s.history.tags[1];
      setStatus(routedTag, 'CONTAINED', 'safe');
      routedTag.style.fontWeight = '700';
      popScale(routedTag, popIn(t, c[3] + T3.rowTag));
    }
  });
}
