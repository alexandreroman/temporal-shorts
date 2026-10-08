// ===================== shared helpers (brand style, used by two or more themes)
const C = {
  uv: '#444CE7', violet: '#B664FF', neon: '#DBFF4B', red: '#FF5A5F', ink: '#F8FAFC', slate: '#94A3B8', line: '#3A4150',
  // on white cards: light UV and neon tints (model and tool results), a darker neon for lines, the violet highlight,
  // a light violet tint (a Workflow handed to a new instance)
  uvTint: '#E6E7FC', neonTint: '#F3FBD2', neonDark: '#9DB82A', highlight: 'rgba(182,100,255,.28)',
  violetTint: '#F2E6FF',
};
// Official Temporal logo (white horizontal lockup). Resolved against this script, not the page: theme pages
// live in subfolders. Inlined in a built page, the script has no src and the path is already a data: URI.
const LOGO = new URL('assets/temporal-logo-horizontal-light-cropped.svg',
  document.currentScript.src || document.baseURI).href;
// Official Temporal symbol alone (white), resolved like LOGO
const SYMBOL = new URL('assets/temporal-symbol-light-cropped.svg',
  document.currentScript.src || document.baseURI).href;
// Extra stroke icons used by two or more themes (24 grid), in the hand-drawn style of engine.js
Object.assign(ICONS, {
  cart: '<path d="M2 4h3l2.5 11h11L21 7H6.2"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
  card: '<rect x="2.5" y="5" width="19" height="14"/><path d="M2.5 9.5h19M6 15h5"/>',
  box: '<path d="M12 3l8.5 4.5v9L12 21l-8.5-4.5v-9z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9M7.8 5.3l8.5 4.5"/>',
  lock: '<rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2"/>',
  food: '<path d="M7 3v18M4 3v5a3 3 0 0 0 6 0V3M17 21V3c-2.5 2-3 6-1 9h1"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M15 9.2c-.6-.9-1.7-1.4-3-1.4-1.7 0-3 .9-3 2.1 0 2.8 6 1.5 6 4.3'
    + ' 0 1.2-1.3 2.1-3 2.1-1.4 0-2.6-.6-3.1-1.6M12 6v1.8M12 16.3V18"/>',
});
const tag = (p, html, cls = '') => E(p, html, 'pill ' + cls);
// icon + label centred in the tile (label null for an icon alone); padding-left offsets the trailing
// letter-spacing. Options: size and stroke of the icon, font of the label and gap above it; a tile over 130 px
// high gets a larger icon and label by default.
function iconTile(p, icon, label, w, h, col = C.ink, opts = {}) {
  const big = h > 130;
  const { size = big ? 52 : 42, stroke = 1.8, font = big ? 20 : 18, gap = 12 } = opts;
  const labelHtml = label
    ? `<div class="mono" style="font-size:${font}px;letter-spacing:.1em;padding-left:.1em;`
      + `text-transform:uppercase;margin-top:${gap}px">${label}</div>`
    : '';
  return E(p, `${ICON(icon, size, col, stroke)}${labelHtml}`, 'tile', {
    width: w + 'px', height: h + 'px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
  });
}
// The row of 4 tiles of the use cases ("What you can build") of every theme, which some recaps match: tiles of
// w x h px, 48 px apart (x 120..1800), centered on y 515, the content frame's middle. Tile i is centered at
// x = 960 + (i - 1.5) * pitch.
const USE_CASE_ROW = { y: 515, w: 384, h: 460, pitch: 432 };
// Type scale of the tiles of that row, as iconTile options: icon size and stroke, label font and gap above it
const USE_CASE_TYPE = { size: 96, stroke: 1.6, font: 26, gap: 30 };
// Use-case tile ("What you can build"): an iconTile with one short example line under its label, in smaller
// lowercase slate mono ("charge, refund, transfer"), which sets it apart from the recap's benefit tiles.
function useCaseTile(p, icon, label, example, w, h) {
  const tile = iconTile(p, icon, label, w, h, C.ink, USE_CASE_TYPE);
  tile.insertAdjacentHTML('beforeend',
    '<div class="mono" style="font-size:20px;color:var(--slate);white-space:nowrap;margin-top:16px">'
    + `${example}</div>`);
  return tile;
}
// Mono label with a 22 px slate icon, at the top left corner of a panel; css: its position (left, top, ...)
const panelLabel = (icon, text, css) => '<div class="lbl" style="position:absolute;display:flex;gap:10px;'
  + `align-items:center;${css}">${ICON(icon, 22, C.slate, 1.8)} ${text}</div>`;
// Violet spinner ring of size px, its track at alpha; css: extra styles (position, opacity). Spin it with a
// rotate() transform.
const spinnerRing = (size, alpha = 0.3, css = '') => `<div class="spin" style="${css}width:${size}px;`
  + `height:${size}px;border:3px solid rgba(182,100,255,${alpha});border-top-color:${C.violet};border-radius:50%">`
  + '</div>';

// ---------- title and end cards
// Intro title block: the official logo, a slate kicker, the big title (HTML) and a violet tagline, left-aligned.
// sizes: logo height, font sizes and gaps in px, defaulting to the intro of most themes.
function makeTitleBlock(root, kicker, titleHtml, tagline, sizes = {}) {
  const {
    logoH = 58, logoGap = 46, kickerFont = 22, titleFont = 116, titleLineHeight = 1.02, titleGap = 22,
    taglineFont = 24, taglineGap = 34,
  } = sizes;
  return E(root,
    `<img src="${LOGO}" style="height:${logoH}px;display:block;margin-bottom:${logoGap}px">`
    + `<div class="mono" style="font-size:${kickerFont}px;letter-spacing:.14em;color:var(--slate)">${kicker}</div>`
    + `<div style="font-size:${titleFont}px;line-height:${titleLineHeight};letter-spacing:-3px;`
    + `margin-top:${titleGap}px">${titleHtml}</div>`
    + `<div class="mono" style="font-size:${taglineFont}px;letter-spacing:.12em;color:var(--violet);`
    + `margin-top:${taglineGap}px">${tagline}</div>`);
}
// End card: the title, a violet tagline, an optional violet pill and the official logo, centered.
// opts.pill: text of the pill shown under the tagline, e.g. 'Experimental'.
function makeEndCard(root, title, tagline, opts = {}) {
  const { pill } = opts;
  let html = `<div style="font-size:104px;letter-spacing:-3px;line-height:1.04">${title}</div>`
    + '<div class="mono" style="font-size:24px;letter-spacing:.14em;padding-left:.14em;color:var(--violet);'
    + 'margin-top:30px">'
    + `${tagline}</div>`;
  // The tagline's line box ends about 8 px below its letters, the pill at its border: 84 px under the pill
  // leaves the same visible gap to the logo as 76 px under the tagline.
  let logoGap = 76;
  if (pill) {
    html += '<span class="pill violet" style="display:inline-block;margin-top:30px;font-size:18px;line-height:23px">'
      + `${pill}</span>`;
    logoGap = 84;
  }
  html += `<img src="${LOGO}" style="height:70px;display:block;margin:${logoGap}px auto 0">`;
  return E(root, html, '', { textAlign: 'center' });
}
// Round avatar of a person: a person icon in a circle of size px with a ring, and a label under it (null or ''
// for none); place() centers the circle
function makeAvatar(p, label, size, ring = C.violet) {
  return E(p,
    `<div style="width:${size}px;height:${size}px;border-radius:50%;border:2px solid ${ring};`
    + 'background:var(--surface);display:flex;align-items:center;justify-content:center">'
    + `${ICON('user', Math.round(size / 2), C.ink, 1.6)}</div>`
    + (label ? `<div class="lbl" style="position:absolute;left:50%;top:calc(100% + 16px);transform:translateX(-50%);`
      + `color:var(--ink)">${label}</div>` : ''),
    '', { width: size + 'px', height: size + 'px' });
}
// Fades e in at (x, y) with p (0 to 1) as it rises d px into place
function rise(e, x, y, p, d = 24) {
  place(e, x, y, 1, p);
  e.style.transform += ` translateY(${(1 - p) * d}px)`;
}

// ---------- step tiles
// Spinner, tick and cross of a status tile, on its top right corner (see stepState)
function addStatusMarks(e) {
  e.insertAdjacentHTML('beforeend',
    spinnerRing(26, 0.25, 'position:absolute;right:12px;top:12px;opacity:0;')
    + `<div class="ok" style="position:absolute;right:8px;top:8px;opacity:0">${ICON('check', 32, C.neon, 2.6)}</div>`
    + `<div class="ko" style="position:absolute;right:8px;top:8px;opacity:0">${ICON('x', 32, C.red, 2.6)}</div>`);
  e.spin = e.querySelector('.spin'); e.ok = e.querySelector('.ok'); e.ko = e.querySelector('.ko');
  return e;
}
const makeStep = (p, icon, label, w, h) => addStatusMarks(iconTile(p, icon, label, w, h));
// Border color of each step state: 0 pending, 1 running, 2 done, 3 failed
const STEP_COLORS = [C.line, C.violet, C.neon, C.red];
function stepState(e, st) {
  e.style.borderColor = STEP_COLORS[st];
  e.spin.style.opacity = st === 1 ? 1 : 0; e.spin.style.transform = `rotate(${G * 400}deg)`;
  e.ok.style.opacity = st === 2 ? 1 : 0; e.ko.style.opacity = st === 3 ? 1 : 0;
}
// Thin links between tiles of width w centered on xs, along the line y
function stepLinks(svg, xs, y, w) {
  return xs.slice(1).map((x, i) => path(svg, `M ${xs[i] + w / 2 + 2} ${y} L ${x - w / 2 - 2} ${y}`, C.line, 2, false));
}
// steps: [icon, label] of each tile; the tiles sit on the line y, from x0 every gap px, joined by thin links
function makeStepRow(root, svg, steps, x0, gap, y, w, h) {
  const xs = steps.map((_, i) => x0 + i * gap);
  const links = stepLinks(svg, xs, y, w);
  const tiles = steps.map(([icon, label]) => makeStep(root, icon, label, w, h));
  return { xs, y, tiles, links };
}
// states: one setState value per tile; tiles pop in from a, links draw just after; (dx, dy): shake; o: opacity
function placeStepRow(row, t, a, states, dx = 0, dy = 0, o = 1, setState = stepState) {
  row.tiles.forEach((e, i) => {
    setState(e, states[i]);
    const p = P(t, a + i * 0.12, 0.45, backOut);
    place(e, row.xs[i] + dx, row.y + dy, p, clamp(p * 2) * o);
  });
  row.links.forEach((l, i) => draw(l, P(t, a + 0.4 + i * 0.12, 0.35), o));
}

// fly: appear at (x0,y0) at a, travel to (x1,y1) during [b, b+d], absorbed (shrink+fade) at k if given
function fly(e, t, a, x0, y0, b, d, x1, y1, k = null, kx = 0, ky = 0) {
  const ap = P(t, a, 0.45, backOut), f = P(t, b, d), ab = k === null ? 0 : P(t, k, 0.4, easeIn);
  const x = lerp(lerp(x0, x1, f), kx, ab), y = lerp(lerp(y0, y1, f), ky, ab);
  place(e, x, y, ap * (1 - 0.65 * ab), clamp(ap * 2) * (1 - ab));
}
// Chip flight: it pops in at (x0, y0) at `at`, travels to (x1, y1) during [at + 0.1, at + 0.55], then is absorbed
// there (shrinks and fades)
function flyChip(chip, t, at, x0, y0, x1, y1) {
  fly(chip, t, at, x0, y0, at + 0.1, 0.45, x1, y1, at + 0.55, x1, y1);
}
// Brief bump (0 to 1 and back to 0) for a pop on a change or an appearance at `at`
const bumpAt = (t, at) => win(t, at, at + 0.15, 0.15);
// Appearance at `at` of a small element (badge, icon, tag), as { o, s } for place(): it fades in while it
// bumps briefly above its native size (k: height of the bump, 0 for none)
const popIn = (t, at, k = 0.14) => ({ o: P(t, at, 0.2), s: 1 + k * bumpAt(t, at) });
// Damped shake of an element hit at `at`: `swings` half swings of amp px, fading out linearly over d seconds.
// Exactly 0 outside them, so the element rests on the same pixels as before the hit.
function dampedShake(t, at, amp, d, swings) {
  const u = (t - at) / d;
  if (u <= 0 || u >= 1) return 0;
  return Math.sin(u * Math.PI * swings) * amp * (1 - u);
}
// Recoil of an element pushed at `at`, from 1 at the hit down to 0 within d seconds (ease-out); multiply it by the
// push in px. Exactly 0 outside it, so the element rests on whole pixels.
function recoil(t, at, d = 0.3) {
  const u = (t - at) / d;
  if (u < 0 || u >= 1) return 0;
  return (1 - u) * (1 - u);
}
// A list row fades in as it slides into place from dx px to its right (p from 0 to 1); round keeps it on whole
// pixels, so its text always rasters the same way
function showRow(e, p, dx = 26, round = false) {
  const x = (1 - clamp(p)) * dx;
  e.style.opacity = clamp(p);
  e.style.transform = `translateX(${round ? Math.round(x) : x}px)`;
}
// Neon token that runs round an agentic loop
const makeToken = root => E(root, '', '', {
  width: '22px', height: '22px', background: C.neon, boxShadow: '0 0 22px 6px rgba(219,255,75,.45)',
  borderRadius: '5px',
});

// ---------- agentic loop: think, act, observe
// Angle of each node on the loop circle, in degrees from the x axis (clockwise on screen)
const LOOP_DEG = { think: -90, act: 30, observe: 150 };
// The agentic loop on a circle of radius r centered on (cx, cy): THINK (the LLM orb) on top, ACT (neon play tile)
// and OBSERVE (eye tile, UV border) below, slate arcs with arrow heads between them, the node labels, an
// "Agentic loop" label in the middle and the neon token. The arcs go in svg. Returns the loop, with pos(deg), the
// point at an angle on the circle, and arcPaths, the d of each arc (to draw them again in another color).
function makeAgentLoop(root, svg, cx, cy, r = 220) {
  const loop = { cx, cy, r };
  loop.pos = deg => {
    const a = deg * Math.PI / 180;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  const arcD = (d0, d1) => {
    const [x0, y0] = loop.pos(d0), [x1, y1] = loop.pos(d1);
    return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  // each arc stops 27 degrees short of the nodes it joins
  const { think, act, observe } = LOOP_DEG;
  loop.arcPaths = [arcD(think + 27, act - 27), arcD(act + 27, observe - 27), arcD(observe + 27, think + 360 - 27)];
  loop.arcs = loop.arcPaths.map(d => path(svg, d, C.slate, 2.5));
  loop.think = makeLLM(root, 130, '');
  loop.act = iconTile(root, 'play', '', 130, 130, C.neon); loop.act.style.borderColor = C.neon;
  loop.observe = iconTile(root, 'eye', '', 130, 130, C.ink); loop.observe.style.borderColor = C.uv;
  loop.labels = ['Think', 'Act', 'Observe'].map(text => E(root, text, 'lbl', { color: 'var(--ink)' }));
  loop.center = E(root, 'Agentic<br>loop', 'lbl', {
    textAlign: 'center', color: 'var(--ink)', fontSize: '24px', lineHeight: 1.4,
  });
  loop.token = makeToken(root);
  return loop;
}
// Places the loop at time t: its nodes pop in from `a`, 0.2 s apart, then their labels and the arcs. Options:
// - deg: angle of the token on the loop (null hides it); the node it passes swells by 12%, the LLM thinks near it
// - thinkIn: when THINK pops in (default `a`); before the start of the scene to show it from the first frame
// - centerAt: when the "Agentic loop" label fades in; centerO: its opacity (0 to 1), e.g. while another label shows
// - o: opacity of the whole loop; arcO: opacity of the arcs; q: the LLM's question mark (0 to 1)
// - dx, dy: offset of the nodes and labels (a shake)
function placeAgentLoop(loop, t, a, opts = {}) {
  const { deg = null, centerAt, centerO = 1, o = 1, arcO = 1, q = 0, dx = 0, dy = 0, thinkIn = a } = opts;
  const near = d => deg === null ? 0 : Math.max(0, 1 - Math.abs((((deg - d) % 360) + 540) % 360 - 180) / 30);
  const nodes = [[loop.think.root, LOOP_DEG.think], [loop.act, LOOP_DEG.act], [loop.observe, LOOP_DEG.observe]];
  nodes.forEach(([e, d], i) => {
    const [x, y] = loop.pos(d), p = P(t, i === 0 ? thinkIn : a + i * 0.2, 0.5, backOut);
    place(e, x + dx, y + dy, p * (1 + 0.12 * near(d)), clamp(p * 2) * o);
  });
  llmState(loop.think, { think: near(LOOP_DEG.think) > 0.2 ? 1 : 0, look: 0.5, q });
  // THINK's label sits left of the orb, the others under their tiles
  const [tx, ty] = loop.pos(LOOP_DEG.think), [ax, ay] = loop.pos(LOOP_DEG.act), [ox, oy] = loop.pos(LOOP_DEG.observe);
  const labelAt = [[tx - 130, ty], [ax, ay + 98], [ox, oy + 98]];
  loop.labels.forEach((e, i) => place(e, labelAt[i][0] + dx, labelAt[i][1] + dy, 1, P(t, a + 0.3 + i * 0.2, 0.4) * o));
  loop.arcs.forEach((arc, i) => draw(arc, P(t, a + 0.7 + i * 0.3, 0.45), arcO * o));
  place(loop.center, loop.cx + dx, loop.cy + dy, 1, P(t, centerAt, 0.5) * centerO * o);
  if (deg === null) {
    place(loop.token, 0, 0, 1, 0);
  } else {
    const [x, y] = loop.pos(deg);
    place(loop.token, x, y, 1, o);
  }
}

// The agent's example task, lunch with Marie: each step's tile icon and label, its action in the step list, then
// the tool it calls and that tool's result
const LUNCH_STEPS = [
  { icon: 'cal', label: 'Calendar', action: 'Check the calendar', tool: 'Calendar', result: 'Thu 12:30 is free' },
  { icon: 'search', label: 'Restaurant', action: 'Find a restaurant', tool: 'Search', result: 'Chez Paulette' },
  { icon: 'food', label: 'Booking', action: 'Book a table', tool: 'Booking', result: 'table for 2, confirmed' },
  { icon: 'mail', label: 'Invite', action: 'Invite Marie', tool: 'Email', result: 'invite sent' },
];
// The agent's goal and its steps: the user's goal card (YOU), then one row per step (icon, action, a neon result
// line and a check, both hidden until the step is done); w: their width
function makeStepList(root, goalText, steps, w = 640) {
  const goal = makeCard(root, goalText, 'user', null, w);
  const rows = steps.map(step => {
    const row = E(root,
      `${ICON(step.icon, 36, C.ink, 1.6)}<div style="flex:1;margin-left:18px">`
      + `<div style="font-size:27px">${step.action}</div>`
      + `<div class="res mono" style="font-size:18px;color:var(--neon);opacity:0">${step.result}</div></div>`
      + `<div class="ck" style="opacity:0">${ICON('check', 32, C.neon, 2.6)}</div>`,
      'tile', {
        width: w + 'px', height: '88px', display: 'flex', alignItems: 'center', padding: '0 22px', textAlign: 'left',
      });
    row.res = row.querySelector('.res'); row.ck = row.querySelector('.ck'); return row;
  });
  return { goal, rows };
}
// Places the goal card at (x, goalY), popping in at goalAt, and the rows from rowY, `gap` apart. Row i slides in
// half a second into its turn (turnStarts[i]), shows its result and its check at the end of the turn, and has a
// violet border while its turn runs (`turn` seconds); o: opacity of the whole list
function placeStepList(list, t, { x, goalY, rowY, gap = 104, goalAt, turnStarts, turn = 1.5, o = 1 }) {
  place(list.goal, x, goalY, P(t, goalAt, 0.45, backOut), P(t, goalAt, 0.4) * o);
  list.rows.forEach((r, i) => {
    const a = turnStarts[i], pr = P(t, a + 0.5, 0.35);
    place(r, x, rowY + i * gap, 1, pr * o);
    r.style.transform += ` translateX(${(1 - pr) * 40}px)`;
    r.res.style.opacity = P(t, a + 1.05, 0.3); r.ck.style.opacity = P(t, a + 1.15, 0.25);
    r.style.borderColor = (t > a && t < a + turn) ? C.violet : C.line;
  });
}

// ---------- crash and takeover effects
// screen shake around a crash, as [dx, dy]
function shakeAt(t, crashAt) {
  const k = Math.max(0, 1 - Math.abs(t - crashAt - 0.2) / 0.4);
  return [Math.sin(G * 90) * 12 * k, Math.cos(G * 77) * 8 * k];
}
// Red flash over the stage, oversized so it still covers it once the scene is shifted (see placeFlash)
const makeFlash = root => E(root, '', '', { width: '2400px', height: '1400px', background: C.red });
// The flash peaks at the crash time `at` with opacity k, and fades out within 0.28 s on either side
function placeFlash(e, t, at, k = 0.4) {
  const intensity = Math.max(0, 1 - Math.abs(t - at) / 0.28);
  place(e, 960, 540, 1, intensity * k);
}
// Horizontal jitter of the running element in the glitch before a crash, in whole pixels: one offset every 0.05 s
const GLITCH_JITTER = [3, -4, 5, -5, 6, -7, 7];
// The failure builds up in the 0.35 s before a crash at crashAt: the running element jitters (dx, see
// GLITCH_JITTER) and the panel flickers red on every other step (red). Returns { red, dx }: false and 0 outside.
function crashGlitch(t, crashAt) {
  const glitchAt = crashAt - 0.35;
  if (t < glitchAt || t >= crashAt) return { red: false, dx: 0 };
  const step = Math.min(Math.floor((t - glitchAt) / 0.05), GLITCH_JITTER.length - 1);
  return { red: step % 2 === 0, dx: GLITCH_JITTER[step] };
}
// Crash marks on a crashed panel: a red bolt (bolt: { x, y, size }) and a solid red tag, e.g. 'App crash'
// (crashTag: { x, y, w, h }, h optional). Even sizes keep the tag on whole pixels once centered (the .1em letter
// spacing gives fractional widths); solid, so nothing under it shows through.
function makeCrashMarks(root, label, bolt, crashTag) {
  const marks = {
    bolt: E(root, ICON('bolt', bolt.size, C.red, 1.6)), tag: tag(root, label, 'red big solid'),
    boltSpot: bolt, tagSpot: crashTag,
  };
  Object.assign(marks.tag.style, { width: crashTag.w + 'px', textAlign: 'center' });
  if (crashTag.h) marks.tag.style.height = crashTag.h + 'px';
  return marks;
}
// The bolt strikes at crashAt, the tag pops in at tagAt once it has landed; both leave from outAt. (dx, dy): the
// shake of the crashed side.
function placeCrashMarks(marks, t, crashAt, tagAt, outAt, dx = 0, dy = 0) {
  const { boltSpot, tagSpot } = marks;
  place(marks.bolt, boltSpot.x + dx, boltSpot.y + dy, P(t, crashAt, 0.35, backOut), win(t, crashAt, outAt, 0.2));
  const tagOn = P(t, tagAt, 0.1) * (1 - P(t, outAt, 0.25));
  place(marks.tag, tagSpot.x + dx, tagSpot.y + dy, P(t, tagAt, 0.35, backOut), tagOn);
}

// Takeover: a dead (or retired) app instance or Worker leaves, and a new one slides in to its place. Offsets in
// whole pixels: the old one drops 40 px, the new one arrives from 160 px to the left of its resting place.
const TAKEOVER = { drop: 40, arrive: -160 };
// The old instance leaves from `at`: it drops and fades out within 0.6 s. A dead one also greys within 0.3 s:
// grey is its CSS filter ('' before `at`). Returns { dy, o, grey }.
function leavingInstance(t, at) {
  const g = P(t, at, 0.3);
  return {
    dy: Math.round(TAKEOVER.drop * P(t, at, 0.6, easeIn)),
    o: 1 - P(t, at, 0.6),
    grey: g > 0 ? `grayscale(${g.toFixed(3)}) brightness(${(1 - 0.35 * g).toFixed(3)})` : '',
  };
}
// The new instance arrives at `at`: it slides in (0.7 s, backOut) and fades in within 0.25 s. Returns { dx, o }.
const arrivingInstance = (t, at) => ({
  dx: Math.round(TAKEOVER.arrive * (1 - P(t, at, 0.7, backOut))), o: P(t, at, 0.25),
});
// Violet glow round the new instance's panel from `at` until `out` (0.3 s fades), pulsing on G as an ambient loop.
// Call it after setAppStatus: it turns the border violet while it shows.
function setArrivalGlow(panel, t, at, out) {
  const k = P(t, at, 0.3) * (1 - P(t, out, 0.3));
  if (k <= 0) {
    panel.style.boxShadow = '';
    return;
  }
  const pulse = 0.5 + 0.5 * Math.sin(G * Math.PI * 2.4);
  const blur = Math.round(20 + 16 * pulse), spread = Math.round(2 + 4 * pulse);
  panel.style.boxShadow = `0 0 ${blur}px ${spread}px rgba(182,100,255,${(0.6 * k).toFixed(3)})`;
  panel.style.borderColor = C.violet;
}
// "New Worker" or "New instance" tag on the new instance, violet and solid (the panel border does not show
// through); fixed even width w (and height h if given), so it rests on whole pixels once centered
function makeNewTag(root, label, w, h = null) {
  const e = tag(root, label, 'violet solid');
  Object.assign(e.style, { width: w + 'px', textAlign: 'center' });
  if (h) e.style.height = h + 'px';
  return e;
}
// The tag pops in at `at` and fades out from `out` within 0.3 s, at (x, y): add the arriving panel's dx to x so it
// slides in with it. s: its scale, popIn's bump by default
function placeNewTag(e, t, at, out, x, y, s = null) {
  const pop = popIn(t, at);
  place(e, x, y, s ?? pop.s, pop.o * (1 - P(t, out, 0.3)));
}
// The Workflow (or agent) that Temporal hands to the new instance: a result card in violet, labelled with its
// name; fly it with flyChip from the history to the panel's status
function makeHandOffCard(root, label) {
  const e = makeResultCard(root, true, label);
  Object.assign(e.style, { background: C.violetTint, borderLeftColor: C.violet });
  return e;
}

// ---------- status tags
// Small status label (e.g. on an Event History row); its text and colors are set by setStatus(). font and pad
// size the text; icon: size of the leading icon of the checked kinds; border: a 1.5 px border, transparent for
// the filled kinds, so every kind keeps the same size.
function statusTag(p, { font = 15, pad = '4px 10px', icon = 16, border = true } = {}) {
  const e = E(p, '', 'mono', {
    fontSize: font + 'px', letterSpacing: '.1em', padding: pad, borderRadius: '4px', whiteSpace: 'nowrap',
    display: 'flex', alignItems: 'center', gap: '6px',
  });
  if (border) e.style.border = '1.5px solid';
  e.iconSize = icon;
  return e;
}
// Looks of the statusTag kinds, each with an optional leading icon as [name, color, stroke width]:
// saved (neon on black, for white panels), ok (neon outline, for the dark stage), denied (red outline, with a
// cross), reused (white on UV), wait (violet outline), waiting (white on violet, with an hourglass) and closed
// (slate outline)
const STATUS_KINDS = {
  saved: { background: '#141414', color: C.neon, borderColor: 'transparent', icon: ['check', C.neon, 2.6] },
  ok: { background: 'rgba(219,255,75,.08)', color: C.neon, borderColor: C.neon, icon: ['check', C.neon, 2.6] },
  denied: { background: 'rgba(255,90,95,.1)', color: C.red, borderColor: C.red, icon: ['x', C.red, 2.6] },
  reused: { background: C.uv, color: '#FFFFFF', borderColor: 'transparent' },
  wait: { background: 'rgba(182,100,255,.14)', color: C.violet, borderColor: C.violet },
  waiting: { background: C.violet, color: '#FFFFFF', borderColor: 'transparent', icon: ['hourglass', '#FFFFFF', 2.2] },
  closed: { background: 'transparent', color: C.slate, borderColor: C.slate },
};
// kind: a key of STATUS_KINDS; the DOM is only rewritten when label or kind changes.
// The .1em letter spacing gives fractional widths, and a tag anchored by its right edge or centered then has
// half-pixel edges, which rasterize differently depending on the frames drawn before. So the width is rounded up
// to an even number of pixels: the edges land on whole pixels whichever way the tag is anchored. The text keeps
// its left padding (the 1-2 px extra goes to the right), so it starts on a whole pixel too.
function setStatus(e, label, kind) {
  const key = kind + ':' + label;
  if (e._l === key) return;
  const { icon, ...colors } = STATUS_KINDS[kind];
  e.innerHTML = icon ? ICON(icon[0], e.iconSize, icon[1], icon[2]) + label : label;
  Object.assign(e.style, colors);
  e.style.width = '';
  const width = parseFloat(getComputedStyle(e).width);
  // no width while the scene is hidden: measured again on the next call
  if (Number.isNaN(width)) return;
  e.style.width = 2 * Math.ceil(width / 2) + 'px';
  // in the live player, a width measured before the fonts load is measured again on the next call
  if (document.fonts.status === 'loaded') e._l = key;
}

// ---------- app and Temporal panels
// App (or Worker) instance panel: gear + name at the top left, status text at the top right (see setAppStatus).
// font: name size; statusFont and statusTop: size and top of the status text.
function makeAppPanel(p, name, w, h, { font = 20, statusFont = 16, statusTop = 26 } = {}) {
  const e = E(p,
    '<div style="position:absolute;left:24px;top:20px;display:flex;align-items:center;gap:12px">'
    + `<div class="gear">${ICON('gear', 30, C.ink, 1.8)}</div>`
    + `<span class="mono" style="font-size:${font}px;letter-spacing:.1em">${name}</span></div>`
    + `<div class="st mono" style="position:absolute;right:24px;top:${statusTop}px;font-size:${statusFont}px;`
    + 'letter-spacing:.08em;color:var(--slate)"></div>',
    'tile', { width: w + 'px', height: h + 'px', textAlign: 'left' });
  e.gear = e.querySelector('.gear'); e.st = e.querySelector('.st');
  return e;
}
// state: 'running' (the gear spins), 'idle', 'waiting' (violet text), 'stopped' (grey border) or 'crashed' (red);
// the border is violet unless stopped or crashed. 'stopped' is the grey look, also used for idle Workers.
function setAppStatus(panel, text, state) {
  panel.st.textContent = text;
  panel.st.style.color = { crashed: C.red, waiting: C.violet }[state] || C.slate;
  panel.style.borderColor = { crashed: C.red, stopped: C.line }[state] || C.violet;
  gearSpin(panel, state === 'running' ? 1 : 0);
}
// TEMPORAL panel, UV border: the official logo at native size with its top left corner at logoAt ([left, top];
// null for none, when a logo flies in) and a note whose top right corner is at noteAt ([right, top]); e.out is
// the note
function makeTemporalPanel(p, w, h, { logoAt = null, noteAt, font = 16, note = 'Outside the app' }) {
  const logo = logoAt
    ? `<img src="${LOGO}" style="position:absolute;left:${logoAt[0]}px;top:${logoAt[1]}px;height:34px;display:block">`
    : '';
  const e = E(p,
    logo + `<div class="out lbl" style="position:absolute;right:${noteAt[0]}px;top:${noteAt[1]}px;`
    + `font-size:${font}px">${note}</div>`,
    'tile', { width: w + 'px', height: h + 'px', borderColor: C.uv });
  e.out = e.querySelector('.out');
  return e;
}

// ---------- Event History card
// White card with an EVENT HISTORY header (headerFont, its icon 4 px larger), numbered rows and one status tag per
// row. rowsHtml: HTML of each row, after its number. Options:
// - w, h: card size; rowTop(i): top of row i; font: row text size; rowH: row height with its text centered (null:
//   the height of the text); padY: vertical padding of a row
// - tagTop(i): top of the tag of row i; tagRight: its right margin; tag: statusTag options
// - crash: { keptTop, keptH, cutTop, label, labelX, labelFont }, the tinted block over the rows that survive a
//   crash and the dashed line under them, labelled at labelX (a CSS left); null for none (see markCrash)
// - scanH: height of the row highlight (see setScan), null for none
// Returns the card with rows, tags, kept and cut (crash) and scan.
function makeHistoryCard(p, rowsHtml, opts) {
  const {
    w, h, headerFont = 18, rowTop, font = 22, rowH = null, padY = 4, tagTop, tagRight = 36, tag = {},
    crash = null, scanH = null,
  } = opts;
  const card = E(p,
    `<div class="mono" style="position:absolute;left:26px;top:${headerFont + 2}px;font-size:${headerFont}px;`
    + 'letter-spacing:.14em;color:#141414;display:flex;gap:10px;align-items:center">'
    + `${ICON('book', headerFont + 4, '#141414', 1.8)} EVENT HISTORY</div>`,
    'paper', { width: w + 'px', height: h + 'px' });
  if (crash) {
    card.kept = E(card, '', '', {
      left: '14px', top: crash.keptTop + 'px', width: (w - 28) + 'px', height: crash.keptH + 'px',
      background: 'rgba(68,76,231,.08)', borderLeft: '4px solid ' + C.uv, borderRadius: 'var(--rs)',
    });
    card.cut = E(card,
      `<span class="mono" style="position:absolute;left:${crash.labelX};top:-10px;transform:translateX(-50%);`
      + `background:#F8FAFC;padding:0 10px;font-size:${crash.labelFont}px;line-height:18px;letter-spacing:.12em;`
      + `color:${C.red};white-space:nowrap">${crash.label}</span>`,
      '', {
        left: '26px', top: crash.cutTop + 'px', width: (w - 52) + 'px', height: '0',
        borderTop: '2px dashed ' + C.red,
      });
  }
  // under the rows, so the highlighted row stays sharp
  if (scanH) {
    card.scan = E(card, '', '', {
      left: '18px', width: (w - 36) + 'px', height: scanH + 'px', background: C.highlight, borderRadius: 'var(--rs)',
    });
  }
  card.rows = rowsHtml.map((html, i) => {
    const row = E(card, `<span style="color:#8A93A6;display:inline-block;width:34px">${i + 1}</span>${html}`,
      'mono', {
        left: '26px', top: rowTop(i) + 'px', width: (w - 52) + 'px', fontSize: font + 'px', whiteSpace: 'nowrap',
        padding: `${padY}px 10px`,
      });
    if (rowH) Object.assign(row.style, { height: rowH + 'px', lineHeight: (rowH - 2 * padY) + 'px' });
    return row;
  });
  card.tags = rowsHtml.map((_, i) => {
    const e = statusTag(card, tag);
    Object.assign(e.style, {
      left: 'auto', right: tagRight + 'px', top: tagTop(i) + 'px', transformOrigin: 'right center',
    });
    return e;
  });
  return card;
}
// Moves the row highlight of an Event History card to `top` (px from the card top), with opacity o
function setScan(card, top, o) {
  card.scan.style.top = top + 'px';
  card.scan.style.opacity = clamp(o);
}
// Crash marks of an Event History card: the tinted kept rows (oKept) and the crash line (oCut)
function markCrash(card, oKept, oCut) {
  card.kept.style.opacity = clamp(oKept);
  card.cut.style.opacity = clamp(oCut);
}
// Small card carrying one step result between the app and Temporal: UV for a model call or an Activity, green
// for a tool result; label: the card text, e.g. the kind of call the result comes from
function makeResultCard(p, uv = true, label = 'RESULT') {
  const text = `<span class="mono" style="font-size:15px;letter-spacing:.12em;padding-left:.12em">${label}</span>`;
  return E(p, text, '', {
    background: uv ? C.uvTint : C.neonTint, color: '#141414', padding: '6px 14px',
    borderLeft: `5px solid ${uv ? C.uv : C.neonDark}`, borderRadius: 'var(--rs)', whiteSpace: 'nowrap',
  });
}

// ---------- counter tile
// Small label, big number and a short mono note next to it (e.g. MODEL CALLS BILLED: 3); w: width in px
function makeCounter(p, label, w) {
  const e = E(p,
    `<div class="lbl" style="font-size:16px">${label}</div>`
    + '<div style="display:flex;align-items:baseline;gap:14px;margin-top:6px">'
    + '<div class="n" style="font-size:84px;line-height:1">0</div>'
    + '<div class="note mono" style="font-size:20px;letter-spacing:.08em;white-space:nowrap"></div></div>',
    'tile', { width: w + 'px', textAlign: 'left', padding: '18px 24px' });
  e.n = e.querySelector('.n'); e.note = e.querySelector('.note');
  return e;
}
// note: neon line next to the number, '' for none
function setCounter(e, n, note = '') {
  e.n.textContent = n;
  e.note.textContent = note; e.note.style.color = C.neon;
}
