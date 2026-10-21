// ===================== AI Agent Security helpers (shared by the scenes of this theme)
//
// Conventions for every scene of this theme (read them before building a chapter):
// - Story: each incident chapter (2 to 6) has three beats. 1. The case file (makeCaseFile) slams in and gets its red
//   INCIDENT stamp. 2. The incident replays in red on a small stage, the chapter's one dramatic beat (glitch,
//   shatter, leak, flood), the case file pinned in a corner as evidence (caseFile.pin). 3. The same move meets the
//   Temporal control on the board (BOARD, makeBoard) and ends on an agentTag: neon for a safe outcome (SAFE,
//   CONTAINED, RESTORED, NO KEYS HERE), red for a refused step (BLOCKED, REJECTED BY MAYA), violet while a person
//   decides (NEEDS APPROVAL).
// - Camera: build each scene in a camera layer (makeCamera) and frame it with setCamera(): its zoom-through brings
//   every chapter in and plays into the next one. The one exception is chapter 1, which opens on the intro's last
//   frame (a match cut, see INTRO_ORB). Within a scene the camera moves one way only (shot() in src/shared.js, see
//   the project memory note on camera moves); shake() jolts it on a hit.
// - Colors: the incident replay is red (C.red, RGB.red); Temporal is UV (the checkpoint); the model is the violet
//   orb; neon is for status only (a step that passes, a safe outcome).
// - Maya is the agent's owner: she says no in chapter 3, cancels in chapter 6 and shows in chapter 7's history. Name
//   her; never use a pronoun for her.
// - Ambient loops (the orb's blink and glitch, the checkpoint's violet pulse) read G; story animations read t, keyed
//   to the subtitle starts c[i].
// - Deterministic: hash(n) for anything scattered, never Math.random.
// - Verdict tags (agentTag) read at about 20 px, sit fully inside or fully outside a box (never across a border) and
//   keep about 20 px of clear space from their neighbors.
// - Every element rests on whole pixels: even sizes, whole centers, shakes rounded (see project_frame-noise.md).

// ---------- extra icons (stroke, 24 grid, same style as ICONS in engine.js). The engine set already has: mail, eye,
// key, shield, card, laptop, box, lock, user, clock, hourglass, bot, code, search (a magnifier), server, check, x.
Object.assign(ICONS, {
  // a database: a cylinder of two stacked disks
  database: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13"/>'
    + '<path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  // a trash can: its lid, its handle and two slats
  trash: '<path d="M4 6.5h16M9.5 6.5v-3h5v3M6 6.5l1 14h10l1-14M10 10.5v6M14 10.5v6"/>',
  // undo: an arrow that turns back on itself
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  // a folder, its tab on the left
  folder: '<path d="M3 5h6.5l2 2.5H21V19H3z"/>',
  // a sheet of paper, its corner folded
  file: '<path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14 3v5h5"/>',
  // an inbox tray
  inbox: '<path d="M3 13.5L5.5 5h13l2.5 8.5V20H3z"/><path d="M3 13.5h5l1.5 2.5h5l1.5-2.5h5"/>',
  // a warning: an exclamation mark in a triangle
  alert: '<path d="M12 3.5L21.5 20h-19z"/><path d="M12 9.5v5M12 17.5h.01"/>',
  // a stop sign: an octagon with an exclamation mark
  stop: '<path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3z"/><path d="M12 7.5v5.5M12 16.5h.01"/>',
  // a sandbox: code brackets inside a dashed box
  sandbox: '<rect x="3" y="3" width="18" height="18" stroke-dasharray="3 2.2"/>'
    + '<path d="M9.5 9l-3 3 3 3M14.5 9l3 3-3 3"/>',
  // a saved password: a field of masked characters
  password: '<rect x="2.5" y="7" width="19" height="10"/>'
    + '<path d="M7 10v4M5.3 11l3.4 2M5.3 13l3.4-2M12 10v4M10.3 11l3.4 2M10.3 13l3.4-2M15.5 14h3"/>',
  // a key struck through: no key held
  keyOff: '<circle cx="5.5" cy="18.5" r="3.5"/><path d="M8 16l2-2M14 10l6.5-6.5M17 7l2 2M19.5 4.5l1.5 1.5"/>'
    + '<path d="M3.5 3.5l17 17"/>',
  // a globe: the public internet, an outside address
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/>'
    + '<path d="M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3z"/>',
  // a network struck through: no internet
  wifiOff: '<path d="M2 9a14.5 14.5 0 0 1 20 0M5.5 12.5a9.5 9.5 0 0 1 13 0M9 16a4.5 4.5 0 0 1 6 0M12 19.5h.01"/>'
    + '<path d="M3.5 3.5l17 17"/>',
});

// Official Temporal symbol alone (white): the checkpoint's emblem
const TEMPORAL_SYMBOL = assetUrl('assets/temporal-symbol-light-cropped.svg');

// ---------- statusTag kinds of this theme (for the Event History rows, see fillHistoryStrip): solid fills under
// bold dark text, the agentTag looks at row size
STATUS_KINDS.alarm = { background: C.red, color: C.bg, borderColor: C.red, icon: ['x', C.bg, 2.8] };
STATUS_KINDS.safe = { background: C.neon, color: C.bg, borderColor: C.neon, icon: ['check', C.bg, 2.8] };
STATUS_KINDS.approval = { background: C.violet, color: C.bg, borderColor: C.violet, icon: ['hourglass', C.bg, 2.4] };

// ---------- the board: the shared stage of the Temporal half of each chapter
// Stage positions at camera rest, centered on (960, 515) within x 120-1800, y 180-856. Every box gives its center
// (x, y) and its size; every scene reads them, so adjust them here, never in a scene.
// - laneY: the line the action cards travel along, from the model through the checkpoint's opening to the tools
// - model: the AI model orb (makeModelOrb), on the left; size, its diameter; its AI MODEL label hangs under it
// - checkpoint: the WORKFLOW checkpoint (makeCheckpoint), in the middle, its opening on laneY; h, its height (its
//   width is CHECKPOINT.w)
// - tools: the YOUR WORKERS zone (makeWorkerZone) on the right, holding the column of tool tiles (TOOLS, toolSlot)
// - history: the Event History strip (makeHistoryStrip) under the checkpoint, three rows
const BOARD = {
  laneY: 410,
  model: { x: 330, y: 410, size: 180 },
  checkpoint: { x: 960, y: 410, h: 400 },
  tools: { x: 1590, y: 410, w: 420, h: 456 },
  history: { x: 960, y: 768, w: 800, h: 176 },
};

// The tools on the board, top to bottom in the YOUR WORKERS zone: each one's icon, label and the tool name its
// action cards carry
const TOOLS = [
  { icon: 'mail', label: 'Email', tool: 'send_email' },
  { icon: 'database', label: 'Database', tool: 'delete_database' },
  { icon: 'card', label: 'Payments', tool: 'pay_invoice' },
  { icon: 'folder', label: 'Files', tool: 'read_file' },
];
// A tool tile: its size, and the pitch between the centers of two tiles of the column, px. The column starts 78 px
// under the zone's top edge, below the zone's heading.
const TOOL_TILE = { w: 360, h: 72, pitch: 94, top: 78 };
// The center [x, y] of tool tile i (0 to 3) in the zone BOARD.tools
const toolSlot = i => [BOARD.tools.x, BOARD.tools.y - BOARD.tools.h / 2 + TOOL_TILE.top + TOOL_TILE.h / 2
  + i * TOOL_TILE.pitch];
// A tool tile (TOOL_TILE.w x h): its icon and its label, left-aligned. Hidden until placed (placeBoard places the
// board's). tile.icon: its <svg>, whose stroke a scene may tint.
function makeToolTile(root, { icon, label }) {
  const tile = E(root,
    `${ICON(icon, 32, C.ink, 1.8)}<span class="lbl" style="color:var(--ink)">${label}</span>`,
    'tile', {
      width: TOOL_TILE.w + 'px', height: TOOL_TILE.h + 'px', display: 'flex', alignItems: 'center', gap: '18px',
      paddingLeft: '24px',
    });
  tile.icon = tile.querySelector('svg');
  return tile;
}

// ---------- the AI model orb
// The intro's hand-off to chapter 1: the intro ends on its orb here, at scale 1, idle (look 0), its label hidden,
// the camera at rest. Chapter 1 opens on that frame: `fadeIn: 0`, setCamera() with `enter: 1`, its orb built with
// makeModelOrb(root, INTRO_ORB) (same seed, so the blink matches across the cut) and its label (orb.label) at
// opacity 0 on the first frame; the rest of the board comes in after.
const INTRO_ORB = { x: BOARD.model.x, y: BOARD.model.y, size: BOARD.model.size, seed: 1.3 };

// The AI model: the series' violet LLM orb (makeLLM) with an AI MODEL label under it (label: '' for none), built
// size px wide and placed at (x, y), shown. Move or fade it with place(orb.el, x, y, scale, opacity); its label
// moves with it, and orb.label is that label's element (fade it with its style.opacity). seed: the blink phase (see
// makeLLM). Returns { el, set, label, size }.
// orb.set(state, { mix, look }) every frame, after any place():
// - 'idle': it blinks on G
// - 'thinking': the thinking dots bob over it (on G)
// - 'hijacked': it turns red, its eyes narrow, and on G it glitches in short bursts (jumps sideways in whole pixels,
//   splits into red and UV copies); mix (0 to 1, default 1) blends the red in and out, so a scene eases it with
//   P(t, at, d); outside the bursts it rests on whole pixels
// - look: where its pupils look, -1 (left) to 1 (right)
function makeModelOrb(root, { x, y, size, label = 'AI MODEL', seed }) {
  const el = E(root, '', '', { width: size + 'px', height: size + 'px' });
  // the part that glitches; the label stays still under it
  const inner = E(el, '', '', { width: size + 'px', height: size + 'px', opacity: 1 });
  const llm = makeLLM(inner, size, '', { seed });
  llm.root.style.opacity = 1;
  // red copies of the glow and the body, over the violet ones and under the eyes
  const redGlow = document.createElement('div');
  Object.assign(redGlow.style, {
    position: 'absolute', inset: '-40%', borderRadius: '50%', opacity: 0,
    background: `radial-gradient(circle, rgba(${RGB.red},.45) 0%, rgba(${RGB.red},.14) 40%, rgba(${RGB.red},0) 68%)`,
  });
  const redBody = document.createElement('div');
  Object.assign(redBody.style, {
    position: 'absolute', inset: 0, borderRadius: '50%', opacity: 0,
    background: 'radial-gradient(circle at 32% 28%, #FFC2C4 0%, #FF5A5F 32%, #D63A48 64%, #8F1F35 100%)',
  });
  llm.root.insertBefore(redGlow, llm.root.children[1]);
  llm.root.insertBefore(redBody, llm.eyes[0]);
  const labelEl = label ? E(el, label, 'under-label', { opacity: 1 }) : null;

  const set = (state, { mix = 1, look = 0 } = {}) => {
    const hijack = state === 'hijacked' ? clamp(mix) : 0;
    llmState(llm, { think: state === 'thinking' ? 1 : 0, look });
    redGlow.style.opacity = hijack;
    redBody.style.opacity = hijack;
    if (hijack > 0) {
      // narrowed eyes that still blink, red pupils
      const blink = (G + llm.seed) % 4.3 < 0.16 ? 0.12 : 1;
      const narrow = 1 - 0.45 * hijack;
      llm.eyes.forEach(e => e.style.transform = `scaleY(${(blink * narrow).toFixed(3)})`);
    }
    llm.pupils.forEach(p => p.style.background = hijack > 0.5 ? C.red : '');
    // a burst of glitch during about a fifth of each 1.1 s cycle
    const burst = hijack > 0 && (G * 0.9 + llm.seed) % 1 < 0.22;
    if (burst) {
      const step = Math.floor(G * 30);
      const dx = Math.round((hash(step * 3 + 1) * 2 - 1) * 9 * hijack);
      const split = 3 + Math.round(hash(step * 3 + 2) * 4);
      inner.style.transform = `translateX(${dx}px)`;
      inner.style.filter = `drop-shadow(${-split}px 0 0 rgba(${RGB.red},.85)) `
        + `drop-shadow(${split}px 0 0 rgba(${RGB.uv},.85))`;
    } else {
      inner.style.transform = '';
      inner.style.filter = '';
    }
  };
  place(el, x, y, 1, 1);
  set('idle');
  return { el, set, label: labelEl, size };
}

// ---------- the WORKFLOW checkpoint
// A checkpoint's width, and the height of its opening, px (the action cards, ACTION_CARD.h high, pass through it)
const CHECKPOINT = { w: 200, gap: 130 };
// The WORKFLOW checkpoint: a gate of two posts in Temporal's look (UV border, Temporal surface) with an opening
// between them, centered on (x, y), so the opening sits on the line y (BOARD.laneY on the board), h px high in all
// (default 400; the opening is CHECKPOINT.gap px, each post (h - gap) / 2). The top post holds the official Temporal
// symbol, WORKFLOW and "your code"; the bottom post a status icon (an eye while it watches). A dashed beam spans the
// opening. It is placed and shown: move or fade it with place(cp.el, x, y, scale, opacity). Build it before the
// action cards, which pass over its beam. tagSpot: [x, y] at rest, where a verdict tag centers above it (20 px clear
// of its top). Returns { el, check, tagSpot, w, h }.
// cp.check(t, t0, verdict) every frame: idle before t0 (or with verdict null), then from t0, when the card reaches
// the beam:
// - 'pass': a neon flash (0.6 s) through the beam and the posts; the status shows a neon check
// - 'block': a red bar slams down across the opening in 0.14 s, the gate shakes, the posts turn red and stay shut
// - 'hold': the posts turn violet and the beam pulses violet on G (a person decides); the status shows an hourglass
// For several cards in turn, pass the t0 and verdict of the latest one.
function makeCheckpoint(root, { x, y, h = 400 }) {
  const { w, gap } = CHECKPOINT;
  const postH = (h - gap) / 2;
  const el = E(root, '', '', { width: w + 'px', height: h + 'px' });
  const inner = E(el, '', '', { width: w + 'px', height: h + 'px', opacity: 1 });
  const post = (top, html) => E(inner, html, 'tile', {
    left: 0, top: top + 'px', width: w + 'px', height: postH + 'px', borderColor: C.uv,
    background: C.temporalSurface, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', opacity: 1,
  });
  const topPost = post(0,
    `<img src="${TEMPORAL_SYMBOL}" style="width:36px;height:36px;display:block">`
    + '<div class="mono" style="font-size:20px;line-height:24px;letter-spacing:.14em;padding-left:.14em;'
    + 'margin-top:12px">WORKFLOW</div>'
    + `<div class="mono" style="font-size:16px;line-height:20px;color:${C.slate};margin-top:4px">your code</div>`);
  // the status icons, stacked; check() shows one
  const statusIcons = [['idle', 'eye', C.slate], ['pass', 'check', C.neon], ['block', 'x', C.red],
    ['hold', 'hourglass', C.violet]];
  const bottomPost = post(postH + gap, statusIcons.map(([kind, icon, color]) =>
    `<div class="st-${kind}" style="position:absolute;left:${w / 2 - 18 - TILE_BORDER}px;`
    + `top:${postH / 2 - 18 - TILE_BORDER}px;opacity:0">${ICON(icon, 36, color, 2.2)}</div>`).join(''));
  const status = Object.fromEntries(statusIcons.map(([kind]) => [kind, bottomPost.querySelector('.st-' + kind)]));
  const beam = E(inner, '', '', { left: (w / 2 - 2) + 'px', top: postH + 'px', width: '4px', height: gap + 'px' });
  // the red bar grows down from the top post
  const bar = E(inner, '', '', {
    left: (w / 2 - 9) + 'px', top: postH + 'px', width: '18px', height: gap + 'px', background: C.red,
    borderRadius: '3px', transformOrigin: '50% 0', boxShadow: `0 0 18px rgba(${RGB.red},.7)`,
  });
  const dashed = `repeating-linear-gradient(to bottom, rgba(${RGB.ink},.45) 0 8px, rgba(${RGB.ink},0) 8px 14px)`;

  const check = (t, t0, verdict) => {
    const kind = verdict && t >= t0 ? verdict : 'idle';
    const flash = kind === 'pass' ? Math.max(0, 1 - (t - t0) / 0.6) : 0;
    const pulse = 0.5 + 0.5 * Math.sin(G * Math.PI * 1.6);
    const postColor = { block: C.red, hold: C.violet }[kind] || (flash > 0.3 ? C.neon : C.uv);
    [topPost, bottomPost].forEach(p => {
      p.style.borderColor = postColor;
      if (kind === 'block') p.style.boxShadow = glowShadow(RGB.red, 0.6, { blur: 30, alpha: 0.5 });
      else if (kind === 'hold') p.style.boxShadow = glowShadow(RGB.violet, 0.4 + 0.4 * pulse, { blur: 30, alpha: 0.6 });
      else p.style.boxShadow = glowShadow(RGB.neon, flash, { blur: 36, alpha: 0.6 });
    });
    Object.entries(status).forEach(([name, icon]) => icon.style.opacity = name === kind ? 1 : 0);
    // the beam: dashed while idle, a neon flash on a pass, a pulsing violet line while it holds
    if (kind === 'hold') {
      beam.style.background = C.violet;
      beam.style.boxShadow = glowShadow(RGB.violet, 0.5 + 0.5 * pulse, { blur: 18, alpha: 0.9, spread: 2 });
      beam.style.opacity = 1;
    } else if (flash > 0) {
      beam.style.background = C.neon;
      beam.style.boxShadow = glowShadow(RGB.neon, flash, { blur: 26, alpha: 0.9, spread: 4 });
      beam.style.opacity = 1;
    } else {
      beam.style.background = dashed;
      beam.style.boxShadow = '';
      beam.style.opacity = kind === 'block' ? 0 : 1;
    }
    const drop = kind === 'block' ? P(t, t0, 0.14, easeIn) : 0;
    bar.style.transform = `scaleY(${drop.toFixed(3)})`;
    bar.style.opacity = drop > 0 ? 1 : 0;
    const dx = verdict === 'block' ? Math.round(dampedShake(t, t0 + 0.14, 7, 0.4, 5)) : 0;
    inner.style.transform = dx ? `translateX(${dx}px)` : '';
  };
  place(el, x, y, 1, 1);
  check(0, 0, null);
  return { el, check, tagSpot: [x, y - h / 2 - 40], w, h };
}

// ---------- the action card: a step the model proposes, the moving element of the theme
// An action card's height, px, and its text sizes
const ACTION_CARD = { h: 76, toolFont: 22, argFont: 17, padX: 18, edge: 6 };
// A proposed step: a white card with a colored left edge (UV, the model's), the tool name in bold mono (`send_email`)
// over a short argument line in slate mono ("to: an outside address"); icon: an optional icon before them. Its width
// follows its longest line (Mono advances 0.6 em per character), rounded up to an even number of px, so it rests on
// whole pixels at a whole center. Hidden until placed. Returns { el, w, h, place, setTone }:
// - card.place(x, y, scale = 1, opacity = 1): centers it there (use pointAlong() or actionStops() for its route)
// - card.setTone(tone): its edge and glow, 'red' (blocked, harmful), 'neon' (passed), 'violet' (waiting) or null (UV)
function makeActionCard(root, { tool, arg, icon = null }) {
  const { h, toolFont, argFont, padX, edge } = ACTION_CARD;
  const iconW = icon ? 32 + 14 : 0;
  const textW = Math.max(tool.length * 0.6 * toolFont, arg.length * 0.6 * argFont);
  const w = 2 * Math.ceil((textW + iconW + 2 * padX + edge) / 2);
  const iconHtml = icon ? `<div style="margin-right:14px">${ICON(icon, 32, C.bg, 1.9)}</div>` : '';
  const el = E(root,
    iconHtml
    + `<div><div class="mono" style="font-size:${toolFont}px;line-height:28px;font-weight:700">${tool}</div>`
    + `<div class="mono" style="font-size:${argFont}px;line-height:22px;color:${C.slateDark};margin-top:4px">`
    + `${arg}</div></div>`,
    'paper', {
      width: w + 'px', height: h + 'px', display: 'flex', alignItems: 'center', padding: `0 ${padX}px`,
      borderLeft: `${edge}px solid ${C.uv}`, whiteSpace: 'nowrap',
    });
  const tones = { red: [C.red, RGB.red], neon: [C.neonDark, RGB.neon], violet: [C.violet, RGB.violet] };
  return {
    el, w, h,
    place: (x, y, scale = 1, opacity = 1) => place(el, x, y, scale, opacity),
    setTone: tone => {
      const [color, rgb] = tones[tone] || [C.uv, null];
      el.style.borderLeftColor = color;
      el.style.boxShadow = rgb ? glowShadow(rgb, 1, { blur: 26, alpha: 0.55 }) : '';
    },
  };
}
// The point at p (0 to 1) between two points a and b, each [x, y]
const lerp2 = (a, b, p) => [lerp(a[0], b[0], p), lerp(a[1], b[1], p)];
// The stops of an action card on the board, each [x, y]: from, the orb's center (the card grows out of it); gate,
// in front of the checkpoint, 20 px clear of it (where it waits or is blocked); past, just behind it, 20 px clear;
// tool, the center of tool tile i (where it lands, shrinking into the tile). Ease between them with lerp2() or
// pointAlong([from, gate, past, tool], u).
function actionStops(card, i) {
  const { model, checkpoint, laneY } = BOARD;
  const clear = CHECKPOINT.w / 2 + 20 + card.w / 2;
  return {
    from: [model.x, laneY], gate: [checkpoint.x - clear, laneY], past: [checkpoint.x + clear, laneY],
    tool: toolSlot(i),
  };
}

// ---------- verdict tags
// An agentTag's text size, height, side padding, icon size and gap between icon and text, px
const AGENT_TAG = { font: 20, h: 40, padX: 14, icon: 20, gap: 8 };
// The fill and icon of each tone: red, a refused or harmful step; neon, a safe outcome; violet, waiting for a person
const AGENT_TONES = { red: [C.red, 'x'], neon: [C.neon, 'check'], violet: [C.violet, 'hourglass'] };
// The width of a verdict tag of this text, px: its padding, icon and gap, then its text (Mono with .1em spacing
// advances 14 px per character), always even
const agentTagWidth = text => 2 * AGENT_TAG.padX + AGENT_TAG.icon + AGENT_TAG.gap + text.length * 14;
// A verdict tag, e.g. BLOCKED, SAFE, NEEDS APPROVAL, CONTAINED, RESTORED, NO KEYS HERE: bold dark uppercase text and
// an icon on a solid fill in tone ('red' | 'neon' | 'violet'), AGENT_TAG.h px high, agentTagWidth(text) px wide, so
// it rests on whole pixels at a whole center. Appended to parent when given; hidden until placed (placeAgentTag, or
// place()). Pass the text in capitals.
function agentTag(text, tone, parent = null) {
  const { font, h, icon, gap } = AGENT_TAG;
  const [fill, iconName] = AGENT_TONES[tone];
  const e = document.createElement('div');
  e.className = 'abs mono';
  e.innerHTML = ICON(iconName, icon, C.bg, tone === 'violet' ? 2.4 : 2.8) + `<span>${text}</span>`;
  Object.assign(e.style, {
    width: agentTagWidth(text) + 'px', height: h + 'px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: gap + 'px', paddingLeft: '2px', background: fill,
    color: C.bg, fontSize: font + 'px', lineHeight: '24px', letterSpacing: '.1em', fontWeight: 700,
    borderRadius: 'var(--rs)', whiteSpace: 'nowrap', opacity: 0, visibility: 'hidden',
  });
  if (parent) parent.appendChild(e);
  return e;
}
// A verdict tag slams in at `at` (it lands from 1.5x its size in 0.16 s) at (x, y), and fades out from `out` over
// 0.3 s (never by default)
function placeAgentTag(e, t, at, x, y, out = Infinity) {
  const land = P(t, at, 0.16, easeIn);
  place(e, x, y, lerp(1.5, 1, land), P(t, at, 0.08, linear) * (1 - P(t, out, 0.3)));
}

// ---------- the case file: the incident dossier that opens chapters 2 to 6
// Its body's size and folder tab (px); at: its center at rest, mid-frame (body and tab together); pin: the "pinned
// evidence" corner, top left of the content frame, while the replay plays: the label's center, and the scale the
// full card shrinks to as it hands over to the label (the label's width over the card's, so both share a width);
// label: the pinned evidence label's size and folder tab (px), its box from (120, 150) to (540, 338), with room for
// a source line under the headline
const CASE_FILE = {
  w: 900, h: 380, tab: { w: 230, h: 40 },
  at: { x: 960, y: 515 }, pin: { x: 330, y: 244, scale: 420 / 900 },
  label: { w: 420, h: 188, tab: { w: 140, h: 24 } },
};
// The incident dossier: a white folder (a CASE FILE tab on its top left), a date line (e.g. 'AUGUST 2026') and a red
// tag ('HIDDEN TEXT') side by side, a large headline on up to two lines (HTML, e.g. 'A shared document takes
// over<br>a work assistant'), an optional source line under it (source, in capitals, e.g. 'PROMPTARMOR, AUG 2026',
// shown as "SOURCE · PROMPTARMOR, AUG 2026" in dark slate mono: it shows in the video too, where the scene's
// `sources` cannot be clicked), and a red INCIDENT stamp in its bottom right corner. Hidden until set.
// Pinned, it becomes a compact evidence label at its own size (the full card shrunk that far would be unreadable):
// the same tab, date and tag on one line, the headline on two lines below, the source line, a smaller stamp.
// Returns { el, set, pin }:
// - caseFile.set(t, t0): it slams in from t0 (from 1.3x its size in 0.22 s, a shake as it lands), then the stamp
//   lands about 0.6 s after t0 (from 2.4x, 0.14 s) with a smaller shake; hidden before t0
// - caseFile.pin(p, { o = 1, to = CASE_FILE.pin }): places it, from CASE_FILE.at (p = 0) to the pinned corner (p =
//   1): the full card shrinks toward to.scale and, over the end of the move, dissolves into the label; opacity o;
//   pass an eased p, e.g. P(t, c[1], 0.8). Call both every frame.
function makeCaseFile(root, { date, tag, headline, source = null }) {
  const { w, h, tab, label } = CASE_FILE;
  // the source line of the full card and of the pinned label, at their own sizes; none without a source
  const sourceLine = (font, lineH, top) => source === null ? ''
    : `<div class="mono" style="font-size:${font}px;line-height:${lineH}px;letter-spacing:.08em;`
      + `color:${C.slateDark};margin-top:${top}px;white-space:nowrap">SOURCE · ${source}</div>`;
  // el moves the dossier and stays unscaled, so the label rests at its own size. The full card scales inside cardCam,
  // a zero-size point at the card's center, as a camera framing the card (class cam): the layout check then measures
  // the card as the pin shows it, where it would count a scaled element at its full size
  const el = E(root, '', '', { width: 0, height: 0 });
  const cardCam = E(el, '', 'cam', { width: 0, height: 0 });
  const inner = E(cardCam, '', '', {
    left: -w / 2 + 'px', top: -(h + tab.h) / 2 + 'px', width: w + 'px', height: (h + tab.h) + 'px', opacity: 1,
  });
  E(inner,
    `${ICON('folder', 20, C.slateDark, 2)}<span class="mono" style="font-size:16px;letter-spacing:.14em;`
    + `color:${C.slateDark}">CASE FILE</span>`,
    'paper', {
      left: 0, top: 0, width: tab.w + 'px', height: (tab.h + 12) + 'px', display: 'flex', gap: '10px',
      alignItems: 'flex-start', paddingTop: '10px', paddingLeft: '24px', borderRadius: 'var(--r) var(--r) 0 0',
      opacity: 1,
    });
  const body = E(inner,
    '<div style="display:flex;align-items:center;gap:20px">'
    + `<span class="mono" style="font-size:22px;line-height:30px;letter-spacing:.14em;color:${C.slateDark}">`
    + `${date}</span>`
    + `<span class="mono" style="font-size:18px;line-height:24px;letter-spacing:.12em;color:${C.red};`
    + `border:2px solid ${C.red};border-radius:var(--rs);padding:2px 12px 2px calc(12px + .12em)">${tag}</span></div>`
    + `<div style="font-size:56px;line-height:62px;letter-spacing:-1.5px;margin-top:26px;width:${w - 96}px">`
    + `${headline}</div>`
    + sourceLine(20, 26, 22),
    'paper', {
      left: 0, top: tab.h + 'px', width: w + 'px', height: h + 'px', padding: '44px 48px',
      borderRadius: '0 var(--r) var(--r) var(--r)', opacity: 1,
    });
  const stamp = E(body, 'INCIDENT', 'mono', {
    left: 'auto', top: 'auto', right: '48px', bottom: '40px', fontSize: '36px', lineHeight: '48px', fontWeight: 700,
    letterSpacing: '.18em', paddingLeft: 'calc(20px + .18em)', paddingRight: '20px', color: C.red,
    border: `4px solid ${C.red}`, borderRadius: '8px', outline: `2px solid ${C.red}`, outlineOffset: '-10px',
  });

  // the pinned evidence label: the full card's layout at a readable size (date, tag and source 14 px, headline 22 px)
  const pinned = E(el, '', '', {
    left: -label.w / 2 + 'px', top: -label.h / 2 + 'px', width: label.w + 'px', height: label.h + 'px',
  });
  E(pinned,
    `${ICON('folder', 14, C.slateDark, 2)}<span class="mono" style="font-size:14px;line-height:16px;`
    + `letter-spacing:.12em;color:${C.slateDark}">CASE FILE</span>`,
    'paper', {
      left: 0, top: 0, width: label.tab.w + 'px', height: (label.tab.h + 8) + 'px', display: 'flex', gap: '6px',
      alignItems: 'flex-start', paddingTop: '5px', paddingLeft: '14px', borderRadius: 'var(--rs) var(--rs) 0 0',
      opacity: 1,
    });
  E(pinned,
    '<div style="display:flex;align-items:center;gap:10px">'
    + `<span class="mono" style="font-size:14px;line-height:20px;letter-spacing:.12em;color:${C.slateDark}">`
    + `${date}</span>`
    + `<span class="mono" style="font-size:14px;line-height:18px;letter-spacing:.1em;color:${C.red};`
    + `border:2px solid ${C.red};border-radius:var(--rs);padding:0 8px 0 calc(8px + .1em)">${tag}</span></div>`
    + `<div style="font-size:22px;line-height:26px;letter-spacing:-.3px;margin-top:8px">${headline}</div>`
    + sourceLine(14, 18, 8)
    + '<div class="mono" style="position:absolute;right:18px;bottom:12px;font-size:14px;line-height:18px;'
    + `font-weight:700;letter-spacing:.16em;padding:2px 8px 2px calc(8px + .16em);color:${C.red};`
    + `border:2px solid ${C.red};border-radius:4px;opacity:.92;transform:rotate(-5deg)">INCIDENT</div>`,
    'paper', {
      left: 0, top: label.tab.h + 'px', width: label.w + 'px', height: (label.h - label.tab.h) + 'px',
      padding: '12px 18px', borderRadius: '0 var(--rs) var(--rs) var(--rs)', opacity: 1,
    });

  const set = (t, t0) => {
    const land = P(t, t0, 0.22, easeIn);
    const stampAt = t0 + 0.6;
    const stampLand = P(t, stampAt, 0.14, easeIn);
    const dx = Math.round(dampedShake(t, t0 + 0.22, 10, 0.35, 5) + dampedShake(t, stampAt + 0.14, 6, 0.3, 4));
    inner.style.opacity = P(t, t0, 0.08, linear);
    inner.style.transform = `translateX(${dx}px) scale(${lerp(1.3, 1, land).toFixed(4)})`;
    stamp.style.opacity = (0.92 * P(t, stampAt, 0.06, linear)).toFixed(3);
    stamp.style.transform = `rotate(-8deg) scale(${lerp(2.4, 1, stampLand).toFixed(4)})`;
  };
  const pin = (p, { o = 1, to = CASE_FILE.pin } = {}) => {
    const { at } = CASE_FILE;
    // over the end of the move the card dissolves into the label, scaled to the card's width: it reaches its own
    // size, at rest, as the card reaches to.scale
    const handover = P(p, 0.7, 0.3, linear);
    const cardScale = lerp(1, to.scale, p);
    place(el, lerp(at.x, to.x, p), lerp(at.y, to.y, p), 1, o);
    place(cardCam, 0, 0, cardScale, 1 - handover);
    pinned.style.opacity = handover;
    pinned.style.transform = handover > 0 && handover < 1 ? `scale(${(cardScale / to.scale).toFixed(4)})` : '';
  };
  return { el, set, pin };
}

// ---------- the approval card: a request on Maya's phone
// The phone's size, px
const APPROVAL_CARD = { w: 320, h: 500 };
// A phone that asks a person (who, e.g. 'Maya') to decide on a step: a header with the person and APPROVAL NEEDED,
// the question (HTML, e.g. 'Delete the production database?'), a deadline line with a clock (e.g. 'Answer by Friday
// 18:00'), then Approve (neon) and Reject (red) buttons. Hidden until placed: place(card.el, x, y, scale, opacity).
// Returns { el, set, deadline }:
// - card.set(t, t0, decision, decidedAt): the screen slides up into the phone from t0 (0.6 s); decision 'approve' |
//   'reject' | null: at decidedAt the chosen button presses (a dip and a tap ring) and fills, the other one dims, and
//   the header reads APPROVED (neon) or REJECTED (red)
// - card.deadline: the deadline line's text element, which a scene may light up
function makeApprovalCard(root, { who, question, deadline }) {
  const { w, h } = APPROVAL_CARD;
  const button = (kind, label, color) => `<div class="btn-${kind} mono" style="width:124px;height:52px;`
    + `display:flex;align-items:center;justify-content:center;font-size:18px;letter-spacing:.08em;`
    + `padding-left:.08em;border:2px solid ${color};border-radius:var(--rs);color:${color}">${label}</div>`;
  const el = E(root, '', '', {
    width: w + 'px', height: h + 'px', background: '#101114', border: `2px solid ${C.lineLight}`,
    borderRadius: '36px', overflow: 'hidden',
  });
  const screen = E(el,
    `<div style="position:absolute;left:${w / 2 - 37}px;top:14px;width:70px;height:8px;border-radius:4px;`
    + `background:${C.line}"></div>`
    + '<div style="position:absolute;left:24px;top:46px;display:flex;align-items:center;gap:14px">'
    + `<div style="width:48px;height:48px;border-radius:50%;border:2px solid ${C.violet};display:flex;`
    + `align-items:center;justify-content:center">${ICON('user', 26, C.ink, 1.8)}</div>`
    + `<div><div style="font-size:24px;line-height:28px">${who}</div>`
    + `<div class="status mono" style="font-size:14px;line-height:18px;letter-spacing:.12em;color:${C.violet}">`
    + 'APPROVAL NEEDED</div></div></div>'
    + `<div style="position:absolute;left:24px;right:24px;top:120px;height:1px;background:${C.line}"></div>`
    + '<div style="position:absolute;left:24px;right:24px;top:144px;font-size:28px;line-height:36px">'
    + `${question}</div>`
    + `<div style="position:absolute;left:24px;bottom:112px;display:flex;align-items:center;gap:10px">`
    + `${ICON('clock', 20, C.slate, 2)}<span class="deadline mono" style="font-size:16px;line-height:20px;`
    + `color:${C.slate}">${deadline}</span></div>`
    + '<div style="position:absolute;left:24px;right:24px;bottom:32px;display:flex;justify-content:space-between">'
    + button('approve', 'APPROVE', C.neon) + button('reject', 'REJECT', C.red) + '</div>',
    '', { left: '-2px', top: '-2px', width: w + 'px', height: h + 'px', opacity: 1 });
  const buttons = { approve: screen.querySelector('.btn-approve'), reject: screen.querySelector('.btn-reject') };
  const colors = { approve: C.neon, reject: C.red };
  const deadlineEl = screen.querySelector('.deadline');
  // the header's status, which reports the decision once the chosen button fills
  const statusEl = screen.querySelector('.status');
  const statusTexts = { approve: 'APPROVED', reject: 'REJECTED' };
  // the tap ring, centered on the chosen button by set()
  const ring = E(screen, '', '', { width: '56px', height: '56px', borderRadius: '50%', border: `3px solid ${C.ink}` });

  const set = (t, t0, decision, decidedAt) => {
    const rise = P(t, t0, 0.6, easeOut);
    screen.style.opacity = P(t, t0, 0.3);
    screen.style.transform = `translateY(${Math.round((1 - rise) * 60)}px)`;
    Object.entries(buttons).forEach(([kind, btn]) => {
      const chosen = decision === kind;
      const decided = decision !== null && t >= decidedAt;
      const filled = chosen && t >= decidedAt + 0.08;
      btn.style.background = filled ? colors[kind] : 'transparent';
      btn.style.color = filled ? C.bg : colors[kind];
      btn.style.fontWeight = filled ? 700 : 400;
      btn.style.opacity = decided && !chosen ? 0.3 : 1;
      btn.style.transform = chosen ? `scale(${(1 - 0.08 * bumpAt(t, decidedAt)).toFixed(3)})` : '';
    });
    const reported = decision !== null && t >= decidedAt + 0.08;
    setText(statusEl, reported ? statusTexts[decision] : 'APPROVAL NEEDED');
    statusEl.style.color = reported ? colors[decision] : C.violet;
    if (decision === null) {
      place(ring, 0, 0, 1, 0);
      return;
    }
    const tap = P(t, decidedAt, 0.5, easeOut);
    // each button's center in the screen: 24 px insets, 124 x 52 buttons, 32 px from the bottom
    const ringX = decision === 'approve' ? 24 + 62 : w - 24 - 62;
    place(ring, ringX, h - 32 - 26, lerp(0.6, 1.8, tap), tap > 0 && tap < 1 ? 0.8 * (1 - tap) : 0);
  };
  return { el, set, deadline: deadlineEl };
}

// ---------- the YOUR WORKERS zone
// A dashed zone, the boundary look of the series (security's YOUR ENVIRONMENT): a slate dashed outline (2 px, dashes
// of 10 px, 8 px apart) round a faint fill, w x h px centered on (x, y), with its heading (label, default 'Your
// workers', shown in capitals with a server icon) at its top left corner, 24 px in and 20 px down. Placed and shown;
// move or fade it with place(). Pass even sizes, so it rests on whole pixels.
function makeWorkerZone(root, { x, y, w, h, label = 'Your workers' }) {
  const zone = E(root,
    `<svg width="${w}" height="${h}" style="position:absolute;left:0;top:0;display:block">`
    + `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="10" fill="rgba(148,163,184,.04)"`
    + ` stroke="${C.slate}" stroke-width="2" stroke-dasharray="10 8"/></svg>`
    + '<div class="lbl" style="position:absolute;left:24px;top:20px;height:34px;display:flex;align-items:center;'
    + `gap:10px;padding-left:0;font-size:18px;color:var(--ink)">${ICON('server', 22, C.slate, 1.8)}${label}</div>`,
    '', { width: w + 'px', height: h + 'px' });
  place(zone, x, y, 1, 1);
  return zone;
}

// ---------- the Event History strip
// Rows of the strip at BOARD.history: the top of the first one, the pitch, a row's height and text size
const HISTORY_STRIP = { rowTop: 52, pitch: 38, rowH: 32, font: 19 };
// The board's Event History: the series' white Event History card (makeHistoryCard) at BOARD.history's size, with
// three rows at most (rowsHtml: each row's HTML after its number, e.g. '<b>send_email</b> outside
// address') and a status tag on the right of each. uvRow(i): whether row i reads in UV (a model call). Hidden until
// placed; fill it with fillHistoryStrip().
function makeHistoryStrip(root, rowsHtml, { uvRow } = {}) {
  const { w, h } = BOARD.history;
  const { rowTop, pitch, rowH, font } = HISTORY_STRIP;
  return makeHistoryCard(root, rowsHtml, {
    w, h, uvRow, headerFont: 16, rowTop: i => rowTop + i * pitch, font, rowH, padY: 2,
    tagTop: i => rowTop + i * pitch + 3, tagRight: 30, tag: { font: 14, padY: 3, icon: 14 },
  });
}
// Fills the strip: rows[i] = { at, tag, tone } for row i: it slides in at `at`, and its tag pops in 0.3 s later,
// tone 'red' (alarm), 'neon' (safe), 'violet' (approval) or 'saved' (the series' SAVED look); tag null for none. Rows
// with no entry stay hidden.
function fillHistoryStrip(card, t, rows) {
  const kinds = { red: 'alarm', neon: 'safe', violet: 'approval', saved: 'saved' };
  card.rows.forEach((row, i) => {
    const entry = rows[i];
    showRow(row, entry ? P(t, entry.at, 0.35) : 0, 26, true);
    const tagEl = card.tags[i];
    if (!entry || !entry.tag) {
      tagEl.style.opacity = 0;
      return;
    }
    tagEl.style.fontWeight = entry.tone === 'saved' ? '' : '700';
    setStatus(tagEl, entry.tag, kinds[entry.tone]);
    popScale(tagEl, popIn(t, entry.at + 0.3));
  });
}

// ---------- the whole board
// Builds the board in stacking order: the YOUR WORKERS zone with its tool tiles (TOOLS), the lanes (an SVG layer:
// the line from the orb to the checkpoint and from the checkpoint to the zone, under everything else; a scene may
// draw its own strokes in board.svg), the checkpoint, the orb, then the Event History strip (historyRows, see
// makeHistoryStrip). Build the action cards after it. Returns { zone, tools, svg, lanes, checkpoint, orb, history }.
function makeBoard(root, { historyRows = [], uvRow, seed } = {}) {
  const { model, checkpoint, tools, laneY } = BOARD;
  const board = {};
  board.zone = makeWorkerZone(root, tools);
  board.tools = TOOLS.map(tool => makeToolTile(root, tool));
  board.svg = svgLayer(root);
  const gateLeft = checkpoint.x - CHECKPOINT.w / 2, gateRight = checkpoint.x + CHECKPOINT.w / 2;
  board.lanes = [
    path(board.svg, `M ${model.x + model.size / 2 + 16} ${laneY} H ${gateLeft}`, C.line, 2, false),
    path(board.svg, `M ${gateRight} ${laneY} H ${tools.x - tools.w / 2}`, C.line, 2, false),
  ];
  board.checkpoint = makeCheckpoint(root, checkpoint);
  board.orb = makeModelOrb(root, { ...model, seed });
  board.history = makeHistoryStrip(root, historyRows, { uvRow });
  return board;
}
// The opacity of each part of the board that placeBoard() shows: all of them, unless a scene says otherwise
const BOARD_SHOWN = { model: 1, checkpoint: 1, tools: 1, history: 1, lanes: 1 };
// Shows the board's parts at rest, each with its opacity in o (BOARD_SHOWN by default): model (the orb and its
// label), checkpoint, tools (the zone and its tiles), history, lanes. A scene that animates a part (a pop, a slide)
// places it itself after this call. The orb's and the checkpoint's states stay the scene's (orb.set, cp.check).
function placeBoard(board, o = {}) {
  const shown = { ...BOARD_SHOWN, ...o };
  const { model, checkpoint, tools, history } = BOARD;
  place(board.orb.el, model.x, model.y, 1, shown.model);
  place(board.checkpoint.el, checkpoint.x, checkpoint.y, 1, shown.checkpoint);
  place(board.zone, tools.x, tools.y, 1, shown.tools);
  board.tools.forEach((tile, i) => place(tile, ...toolSlot(i), 1, shown.tools));
  place(board.history, history.x, history.y, 1, shown.history);
  board.lanes.forEach(lane => draw(lane, 1, shown.lanes));
}
