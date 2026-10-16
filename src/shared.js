// ===================== shared helpers (brand style, used by two or more themes)
// Brand colors as RGB triplets, for translucent tints and glows: `rgba(${RGB.violet},.2)`
const RGB = { ink: '248,250,252', uv: '68,76,231', violet: '182,100,255', neon: '219,255,75', red: '255,90,95' };
// Brand colors; those that src/styles.css also declares share the name of its CSS variable (--bg: C.bg)
const C = {
  uv: '#444CE7', violet: '#B664FF', neon: '#DBFF4B', red: '#FF5A5F', ink: '#F8FAFC', slate: '#94A3B8', line: '#3A4150',
  // Space Black: the stage background, and the text on white cards
  bg: '#141414',
  // a dark slate for labels on white cards, a lighter rule for pill borders and dashed frames on the stage
  slateDark: '#5B6475', lineLight: '#4B5363',
  // on white cards: light UV and neon tints (model and tool results), a darker neon for lines, the violet highlight,
  // a light violet tint (a Workflow handed to a new instance)
  uvTint: '#E6E7FC', neonTint: '#F3FBD2', neonDark: '#9DB82A', highlight: `rgba(${RGB.violet},.28)`,
  violetTint: '#F2E6FF',
  // TEMPORAL's surface: the fill of Temporal's tiles and zones on the stage
  temporalSurface: '#17182A',
  // the grey of the official logo's wordmark (LOGO), for words set with it
  wordmark: '#F2F2F2',
};
// Temporal Web UI colors, sampled from the real UI in dark mode: the page background, and the panels (sidebar, top
// bar, cards) and window title bars
const WEB_UI = { page: '#111111', panel: '#191919' };
// Border width of .tile (styles.css) and of the other bordered boxes, px: whole, as Chromium rounds a border width
// down to whole device pixels (a 1.5px border lays out and draws 1 px wide in the 1920 x 1080 frames). What a box
// holds is placed from its padding edge, TILE_BORDER inside its outer edge.
const TILE_BORDER = 1;
// URL of this script, in src/: asset URLs resolve against it, not against the page, as theme pages live in
// subfolders. Read while the script loads, the only time document.currentScript is set.
const SRC_BASE = document.currentScript.src || document.baseURI;
// URL of an asset file from its path relative to src/, written out in full as a string literal: scripts/build_html.py
// finds that literal and swaps it for a data: URI in a built page, where the script has no src, and new URL() keeps
// a data: URI as is.
const assetUrl = path => new URL(path, SRC_BASE).href;
// Official Temporal logo (white horizontal lockup)
const LOGO = assetUrl('assets/temporal-logo-horizontal-light-cropped.svg');
// LOGO's geometry in its viewBox units (405 395 1570 410): the image's left edge and size, its symbol's left and right
// edges, the wordmark's left edge, the wordmark's capitals from capTop to the baseline, the image's bottom; capEm: the
// height of Instrument Sans capitals, em
const LOCKUP = {
  x: 405, w: 1570, h: 410, symbolLeft: 414, symbolRight: 804, wordLeft: 915,
  capTop: 519, baseline: 684.7, bottom: 805, capEm: 0.72,
};
// A word in the brand font beside LOGO drawn h px high, its capitals as tall as the wordmark's and on its baseline:
// unit, px per viewBox unit; rise, how far the baseline sits above the image's bottom, whole px; font, its size, px
const lockupWord = h => {
  const unit = h / LOCKUP.h;
  return {
    unit,
    rise: Math.round((LOCKUP.bottom - LOCKUP.baseline) * unit),
    font: (LOCKUP.baseline - LOCKUP.capTop) * unit / LOCKUP.capEm,
  };
};
// A zone's heading: how far it sits from the zone's left edge and under its top edge, and its height, px
const ZONE_HEAD = { left: 24, top: 20, h: 34 };
// A Temporal Cloud zone: a tile in TEMPORAL's look, titled with Temporal Cloud at ZONE_HEAD. The title is LOGO, then
// "Cloud" in the wordmark's color, set as lockupWord() with its font rounded to 1/100 px, a word space (0.2 em of that
// font) after the wordmark's last letter, which ends at the image's right edge. The scene sizes and places the zone.
function makeCloudZone(root) {
  const word = lockupWord(ZONE_HEAD.h);
  const font = +word.font.toFixed(2);
  const gap = Math.round(0.2 * font);
  const title = `<img src="${LOGO}" style="height:${ZONE_HEAD.h}px;vertical-align:-${word.rise}px">`
    + `<span style="font-size:${font}px;margin-left:${gap}px;color:${C.wordmark}">Cloud</span>`;
  return E(root,
    `<div style="position:absolute;left:${ZONE_HEAD.left}px;top:${ZONE_HEAD.top}px;height:${ZONE_HEAD.h}px;`
    + `line-height:0;white-space:nowrap">${title}</div>`,
    'tile', { borderColor: C.uv, background: C.temporalSurface });
}
// The SVG filter that paints a monochrome logo in ink, its shape untouched: it floods the logo's opaque parts with
// the ink color. An <img> uses it with filter:url(#INK_FILTER_ID); addInkFilter() adds it to the stage once.
const INK_FILTER_ID = 'logo-ink';
function addInkFilter() {
  if (document.getElementById(INK_FILTER_ID)) return;
  const svg = document.createElementNS(SVGNS, 'svg');
  Object.assign(svg.style, { position: 'absolute', width: 0, height: 0 });
  svg.innerHTML = `<filter id="${INK_FILTER_ID}" color-interpolation-filters="sRGB"><feFlood flood-color="${C.ink}"/>`
    + '<feComposite in2="SourceAlpha" operator="in"/></filter>';
  stage.appendChild(svg);
}
const tag = (p, html, cls = '') => E(p, html, 'pill ' + cls);
// A tag of a fixed even width w (and height h if given), its label centered in it. The .1em letter spacing gives
// fractional natural widths: with an even size, a tag centered on a whole pixel rests on whole pixels. gap: an icon
// and a label side by side, gap px apart, centered in the tag. w null: the tag's natural width rounded up to an even
// number of pixels, set by fitTag(), which update() calls.
function fixedTag(p, html, cls, w, { h = null, gap = null } = {}) {
  const e = tag(p, html, cls);
  e.style.textAlign = 'center';
  if (w) e.style.width = w + 'px';
  if (h) e.style.height = h + 'px';
  if (gap !== null) {
    Object.assign(e.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: gap + 'px' });
  }
  return e;
}
// Rounds the width of e, an element of fractional natural width, up to an even number of pixels, so that its edges
// land on whole pixels whether it is centered or anchored by an edge. Returns false while e is not laid out (its
// scene hidden): call it again later.
function roundUpWidth(e) {
  e.style.width = '';
  const width = parseFloat(getComputedStyle(e).width);
  if (Number.isNaN(width)) return false;
  e.style.width = 2 * Math.ceil(width / 2) + 'px';
  return true;
}
// Sizes a fixedTag() built with no width (see roundUpWidth) on the first frame it is laid out; in the live player, a
// width measured before the fonts load is measured again on the next call
function fitTag(e) {
  if (e._fitted) return;
  if (roundUpWidth(e) && document.fonts.status === 'loaded') e._fitted = true;
}
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
// The row of 4 tiles of the use cases ("What you can build", see useCaseScene) of every theme, which some recaps
// match: tiles of w x h px, 48 px apart (x 120..1800), centered on y 515, the content frame's middle. Tile i is
// centered at x = useCaseX(i).
const USE_CASE_ROW = { y: 515, w: 384, h: 460, pitch: 432 };
// Type scale of the tiles of that row, as iconTile options: icon size and stroke, label font and gap above it
const USE_CASE_TYPE = { size: 96, stroke: 1.6, font: 26, gap: 30 };
// Line height of a tile label padded by padTileLabel(), in units of its font size
const TILE_LABEL_LINE = 1.3;
// Pads the label of an iconTile to the height of `lines` lines, its own lines (split by <br>) centered in that
// height, so that the tiles of one row keep their icons and example lines aligned when only some labels take two
// lines. Whole pixels, so the tile's content keeps the same pixel grid.
function padTileLabel(tile, lines) {
  const label = tile.children[1];
  const lineHeight = Math.round(parseFloat(label.style.fontSize) * TILE_LABEL_LINE);
  const pad = (lines - label.innerHTML.split('<br>').length) * lineHeight / 2;
  Object.assign(label.style, { lineHeight: lineHeight + 'px', paddingTop: pad + 'px', paddingBottom: pad + 'px' });
}
// Use-case tile ("What you can build"): an iconTile with one short example line under its label, in smaller
// lowercase slate mono ("charge, refund, transfer"), which sets it apart from the recap's benefit tiles. labelLines:
// the label height in lines (padTileLabel), for a row where a label takes two lines (a <br> in it); 1 leaves the
// label as iconTile sets it.
function useCaseTile(p, icon, label, example, w, h, labelLines = 1) {
  const tile = iconTile(p, icon, label, w, h, C.ink, USE_CASE_TYPE);
  if (labelLines > 1) padTileLabel(tile, labelLines);
  tile.insertAdjacentHTML('beforeend',
    '<div class="mono" style="font-size:20px;color:var(--slate);white-space:nowrap;margin-top:16px">'
    + `${example}</div>`);
  return tile;
}
// x of the center of tile i (0 to 3) of a row of 4 tiles spaced like USE_CASE_ROW, centered on x 960
const useCaseX = i => 960 + (i - 1.5) * USE_CASE_ROW.pitch;
// Perspective (px) and duration (s) of the 3D flip of useCaseScene's `front` option
const USE_CASE_FLIP = { perspective: 1600, d: 0.7 };
// Seconds the last use-case tile named by useCaseScene stays lit
const USE_CASE_LAST_LIT = 1.2;
// 3D flip (rotateY) of a tile in its slot (x, y), from its front face to its back face (two elements of one size), as
// turn goes from 0 to 1: the tile lifts a little as it turns, and each face shows for its own half turn. At rest (turn
// 0 or 1), the face shown has place()'s transform alone, so it rests on the same pixels as a tile that never flips.
function flipTile(frontFace, backFace, x, y, turn) {
  const turning = turn > 0 && turn < 1;
  const lift = turning ? 1 + 0.06 * Math.sin(Math.PI * turn) : 1;
  const backShown = turn >= 0.5;
  place(frontFace, x, y, lift, backShown ? 0 : 1);
  place(backFace, x, y, lift, backShown ? 1 : 0);
  if (turning) {
    const rotateY = deg => ` perspective(${USE_CASE_FLIP.perspective}px) rotateY(${deg.toFixed(2)}deg)`;
    frontFace.style.transform += rotateY(180 * turn);
    backFace.style.transform += rotateY(180 * turn - 180);
  }
}
// A recap row ("What you get"): one iconTile per [icon, label] of benefits, h px high, at the width and type scale
// of USE_CASE_ROW; placeRecapRow() shows it
function makeRecapRow(root, benefits, h) {
  return benefits.map(([icon, label]) => iconTile(root, icon, label, USE_CASE_ROW.w, h, C.ink, USE_CASE_TYPE));
}
// A recap row's tiles in the slots of USE_CASE_ROW, on line y: tile i pops in at at[i]; litFor: how long each tile
// lights up (UV border) once it lands, s (0: never lit)
function placeRecapRow(tiles, t, at, y, litFor = 0) {
  tiles.forEach((e, i) => {
    const p = backPop(t, at[i]);
    place(e, useCaseX(i), y, p.s, p.o);
    if (litFor) e.style.borderColor = t >= at[i] && t < at[i] + litFor ? C.uv : C.line;
  });
}
// The "What you can build" chapter of an explainer, its scene before the outro: chapter, its number; uses, the
// [icon, label, example] of each of the 4 useCaseTiles of USE_CASE_ROW; subs, its 2 subtitles. The tiles pop in
// one at a time, 0.8 s apart from c[0] + firstAt, while subtitle 1 reads; subtitle 2 names them in order, and each
// lights up (UV border) as it is named, namedAt[i] seconds after c[1], until the next one is named (the last one
// stays lit for USE_CASE_LAST_LIT seconds). Options, which leave the scene as above when unset:
// - labelLines: the label height of every tile, in lines (see useCaseTile);
// - front: (root, i) => the element that tile i shows first, in its slot at rest (the recap tile that the previous
//   scene ends on, for a match cut): instead of popping in, each tile flips over in 3D (rotateY) from that face to
//   its use-case tile, at the same times;
// - camera: setCamera() options; the tiles then live in a camera layer (makeCamera) that zooms through as the scene
//   fades in and out;
// - fadeIn: the scene's fade-in (0 for a match cut).
function useCaseScene({
  chapter, uses, namedAt, subs, firstAt = 1.6, labelLines = 1, front = null, camera = null, fadeIn,
}) {
  scene({
    chapter, title: 'What you can build', subs, fadeIn,
    build(root, s) {
      const { w, h } = USE_CASE_ROW;
      if (camera) root = s.cam = makeCamera(root);
      s.uses = uses.map(([icon, label, example]) => useCaseTile(root, icon, label, example, w, h, labelLines));
      if (front) s.fronts = uses.map((_, i) => front(root, i));
    },
    update(t, c, s) {
      if (camera) setCamera(s.cam, t, this.dur, camera);
      s.uses.forEach((e, i) => {
        const at = c[0] + firstAt + i * 0.8;
        if (front) {
          flipTile(s.fronts[i], e, useCaseX(i), USE_CASE_ROW.y, P(t, at, USE_CASE_FLIP.d));
        } else {
          const p = backPop(t, at);
          place(e, useCaseX(i), USE_CASE_ROW.y, p.s, p.o);
        }
        const litFrom = c[1] + namedAt[i];
        const litUntil = i + 1 < namedAt.length ? c[1] + namedAt[i + 1] : litFrom + USE_CASE_LAST_LIT;
        e.style.borderColor = t >= litFrom && t < litUntil ? C.uv : C.line;
      });
    },
  });
}
// Mono label with a 22 px slate icon, at the top left corner of a panel; css: its position (left, top, ...)
const panelLabel = (icon, text, css) => '<div class="lbl" style="position:absolute;display:flex;gap:10px;'
  + `align-items:center;${css}">${ICON(icon, 22, C.slate, 1.8)} ${text}</div>`;
// Violet spinner ring of size px, its track at alpha; css: extra styles (position, opacity). Spin it with a
// rotate() transform.
const spinnerRing = (size, alpha = 0.3, css = '') => `<div class="spin" style="${css}width:${size}px;`
  + `height:${size}px;border:3px solid rgba(${RGB.violet},${alpha});border-top-color:${C.violet};border-radius:50%">`
  + '</div>';

// ---------- DOM writes that skip unchanged values: update() runs every frame, and rewriting the same HTML or text
// costs a relayout for nothing
// Sets an element's HTML, rewritten only when it changes
function setHtml(e, html) {
  if (e._html !== html) {
    e.innerHTML = html;
    e._html = html;
  }
}
// Sets an element's text, rewritten only when it changes
function setText(e, text) {
  if (e._text !== text) {
    e.textContent = text;
    e._text = text;
  }
}
// A count with thousands separators, the same whatever the locale: 2400 -> '2,400'
const withCommas = n => Math.round(n).toLocaleString('en-US');

// ---------- title and end cards
// Intro title block: the official logo, a slate kicker, the big title (HTML) and a violet tagline, left-aligned.
// sizes: logo height, font sizes and gaps in px, defaulting to the intro of most themes; box: [w, h], a fixed size
// in even numbers round the block's fractional natural size, so that the block centered on a whole pixel rests on
// whole pixels (null: its natural size).
function makeTitleBlock(root, kicker, titleHtml, tagline, sizes = {}) {
  const {
    logoH = 58, logoGap = 46, kickerFont = 22, titleFont = 116, titleLineHeight = 1.02, titleGap = 22,
    taglineFont = 24, taglineGap = 34, box = null,
  } = sizes;
  const block = E(root,
    `<img src="${LOGO}" style="height:${logoH}px;display:block;margin-bottom:${logoGap}px">`
    + `<div class="mono" style="font-size:${kickerFont}px;letter-spacing:.14em;color:var(--slate)">${kicker}</div>`
    + `<div style="font-size:${titleFont}px;line-height:${titleLineHeight};letter-spacing:-3px;`
    + `margin-top:${titleGap}px">${titleHtml}</div>`
    + `<div class="mono" style="font-size:${taglineFont}px;letter-spacing:.12em;color:var(--violet);`
    + `margin-top:${taglineGap}px">${tagline}</div>`);
  if (box) Object.assign(block.style, { width: box[0] + 'px', height: box[1] + 'px' });
  return block;
}
// Where icon i of n orbiting an intro's theme visual is: evenly spaced on an ellipse, they turn on the ambient clock
// G. orbit: { x, y, rx, ry, speed }, the ellipse's center and radii, and the angular speed in radians per second;
// lag: how far behind the icon, in radians (a trail). Returns { x, y, depth }: depth, an opacity factor, goes from
// 0.45 at the top of the ellipse (the back) to 1 at its bottom (the front).
function orbitAt(i, n, { x, y, rx, ry, speed }, lag = 0) {
  const a = G * speed + i * (Math.PI * 2 / n) - lag;
  return { x: x + Math.cos(a) * rx, y: y + Math.sin(a) * ry, depth: 0.45 + 0.55 * (Math.sin(a) + 1) / 2 };
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
// The end card fades in from `at` within d seconds, centered on (960, 560): the theme visual sits above it
function placeEndCard(card, t, at = 0.3, d = 0.8) {
  place(card, 960, 560, 1, P(t, at, d));
}
// Glow of a brand color round an element (box-shadow) or its text (text-shadow), of strength k from 0 to 1: blur
// px wide at opacity alpha, and spread px wider than the element (box-shadow only); all three grow with k. '' for
// none (k <= 0).
function glowShadow(rgb, k, { blur, alpha = 1, spread = 0 }) {
  if (k <= 0) return '';
  const spreadPx = spread ? ` ${Math.round(spread * k)}px` : '';
  return `0 0 ${Math.round(blur * k)}px${spreadPx} rgba(${rgb},${(alpha * k).toFixed(3)})`;
}
// Glowing dot of light, size px wide, in a brand color (an RGB triplet); place() centers it. Options: radius, its CSS
// border radius (round by default); blur (default: size), spread and alpha, its glow (see glowShadow)
function makeGlowDot(p, size, rgb, { radius = '50%', blur = size, spread = 0, alpha = 1 } = {}) {
  return E(p, '', '', {
    width: size + 'px', height: size + 'px', borderRadius: radius, background: `rgb(${rgb})`,
    boxShadow: glowShadow(rgb, 1, { blur, alpha, spread }),
  });
}
// Spark: a makeGlowDot with a wide soft halo, size px wide, in a color (an RGB triplet, e.g. RGB.neon)
function makeSpark(p, size, rgb) {
  return makeGlowDot(p, size, rgb, { spread: Math.round(size / 2), alpha: 0.55 });
}
// CSS background of a round halo: violet at its core (opacity core), UV at midAt % of its radius (opacity mid),
// faded out at end %
const haloBackground = (core, mid, midAt, end) => `radial-gradient(circle, rgba(${RGB.violet},${core}) 0%, `
  + `rgba(${RGB.uv},${mid}) ${midAt}%, rgba(${RGB.uv},0) ${end}%)`;
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
// steps: { icon, label } of each tile (more fields are ignored); the tiles sit on the line y, from x0 every gap px,
// joined by thin links
function makeStepRow(root, svg, steps, x0, gap, y, w, h) {
  const xs = steps.map((_, i) => x0 + i * gap);
  const links = stepLinks(svg, xs, y, w);
  const tiles = steps.map(({ icon, label }) => makeStep(root, icon, label, w, h));
  return { xs, y, tiles, links };
}
// states: one setState value per tile; tiles pop in from a, links draw just after; (dx, dy): shake; o: opacity
function placeStepRow(row, t, a, states, dx = 0, dy = 0, o = 1, setState = stepState) {
  row.tiles.forEach((e, i) => {
    setState(e, states[i]);
    const p = backPop(t, a + i * 0.12);
    place(e, row.xs[i] + dx, row.y + dy, p.s, p.o * o);
  });
  row.links.forEach((l, i) => draw(l, P(t, a + 0.4 + i * 0.12, 0.35), o));
}

// fly: appear at (x0,y0) at a, travel to (x1,y1) during [b, b+d], absorbed (shrink+fade) at k if given
function fly(e, t, a, x0, y0, b, d, x1, y1, k = null, kx = 0, ky = 0) {
  const ap = backPop(t, a), f = P(t, b, d), ab = k === null ? 0 : P(t, k, 0.4, easeIn);
  const x = lerp(lerp(x0, x1, f), kx, ab), y = lerp(lerp(y0, y1, f), ky, ab);
  place(e, x, y, ap.s * (1 - 0.65 * ab), ap.o * (1 - ab));
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
// Appearance at `at` of a larger element (tile, card, panel), as { s, o } for place(): it grows from nothing to a
// little over its native size and settles back (backOut) over d seconds, fully opaque halfway through its growth
function backPop(t, at, d = 0.45) {
  const s = P(t, at, d, backOut);
  return { s, o: clamp(s * 2) };
}
// Pops in an element laid out by its CSS rather than by place() (a pill in a row, a badge on a card): the scale and
// opacity of a popIn() or a backPop()
function popScale(e, pop) {
  e.style.transform = `scale(${pop.s})`;
  e.style.opacity = pop.o;
}
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
// Turns the hands of a clock in root, the SVG paths .hh (hour) and .mh (minute) of a viewBox centered on
// (center, center), from where they are drawn: hours is the clock time, the minute hand turns once per hour, the
// hour hand once per 12 hours
function setClockHands(root, hours, center) {
  root.querySelector('.hh').setAttribute('transform', `rotate(${(hours * 30) % 360} ${center} ${center})`);
  root.querySelector('.mh').setAttribute('transform', `rotate(${(hours * 360) % 360} ${center} ${center})`);
}
// Neon token that runs round an agentic loop
const makeToken = root => makeGlowDot(root, 22, RGB.neon, { radius: '5px', spread: 6, alpha: 0.45 });

// ---------- agentic loop: think, act, observe
// Angle of each node on the loop circle, in degrees from the x axis (clockwise on screen)
const LOOP_DEG = { think: -90, act: 30, observe: 150 };
// The agentic loop on a circle of radius r centered on (cx, cy): THINK (the LLM orb) on top, ACT (neon play tile)
// and OBSERVE (eye tile, UV border) below, slate arcs with arrow heads between them, the node labels, an
// "Agentic loop" label in the middle and the neon token with its comet tail. The arcs go in svg. Returns the loop,
// with pos(deg), the point at an angle on the circle, and nodePos(deg), where a node and its label sit: pos on whole
// pixels, as ACT and OBSERVE sit at fractional points of the circle. Options: `seed`, the blink phase of the THINK
// orb (see makeLLM()); `node`, the size of the nodes in px; `comet`, the number of sparks trailing the token (0 for
// none).
function makeAgentLoop(root, svg, cx, cy, r = 220, { seed, node = 130, comet = 6 } = {}) {
  const loop = { cx, cy, node };
  loop.pos = deg => {
    const a = deg * Math.PI / 180;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  loop.nodePos = deg => loop.pos(deg).map(Math.round);
  const arcD = (d0, d1) => {
    const [x0, y0] = loop.pos(d0), [x1, y1] = loop.pos(d1);
    return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  // each arc stops 27 degrees short of the nodes it joins
  const { think, act, observe } = LOOP_DEG;
  const arcPaths = [arcD(think + 27, act - 27), arcD(act + 27, observe - 27), arcD(observe + 27, think + 360 - 27)];
  loop.arcs = arcPaths.map(d => path(svg, d, C.slate, 2.5));
  // built before the nodes, so the token and its comet pass under them, THINK's face included; each spark smaller
  // than the one before
  loop.token = makeToken(root);
  loop.comet = Array.from({ length: comet }, (_, k) => makeSpark(root, 16 - 2 * k, RGB.neon));
  loop.think = makeLLM(root, node, '', { seed });
  loop.act = iconTile(root, 'play', '', node, node, C.neon); loop.act.style.borderColor = C.neon;
  loop.observe = iconTile(root, 'eye', '', node, node, C.ink); loop.observe.style.borderColor = C.uv;
  loop.labels = ['Think', 'Act', 'Observe'].map(text => E(root, text, 'lbl', { color: 'var(--ink)' }));
  loop.center = E(root, 'Agentic<br>loop', 'lbl', {
    textAlign: 'center', color: 'var(--ink)', fontSize: '24px', lineHeight: 1.4,
  });
  return loop;
}
// Places the loop at time t: its nodes pop in from `a`, 0.2 s apart, then their labels and the arcs. Options:
// - deg: angle of the token on the loop (null hides it and its comet); the node it passes swells by 12%, the LLM
//   thinks near it
// - thinkIn: when THINK pops in (default `a`); before the start of the scene to show it from the first frame
// - centerAt: when the "Agentic loop" label fades in; centerO: its opacity (0 to 1), e.g. while another label shows
// - o: opacity of the whole loop
// - dx, dy: offset of the nodes and labels (a shake)
function placeAgentLoop(loop, t, a, opts = {}) {
  const { deg = null, centerAt, centerO = 1, o = 1, dx = 0, dy = 0, thinkIn = a } = opts;
  const near = d => deg === null ? 0 : Math.max(0, 1 - Math.abs((((deg - d) % 360) + 540) % 360 - 180) / 30);
  const nodes = [[loop.think.root, LOOP_DEG.think], [loop.act, LOOP_DEG.act], [loop.observe, LOOP_DEG.observe]];
  nodes.forEach(([e, d], i) => {
    const [x, y] = loop.nodePos(d), p = backPop(t, i === 0 ? thinkIn : a + i * 0.2, 0.5);
    place(e, x + dx, y + dy, p.s * (1 + 0.12 * near(d)), p.o * o);
  });
  llmState(loop.think, { think: near(LOOP_DEG.think) > 0.2 ? 1 : 0, look: 0.5 });
  // THINK's label sits left of the orb, the others under their tiles, centered 33 px below their bottom edge
  const [tx, ty] = loop.nodePos(LOOP_DEG.think), [ax, ay] = loop.nodePos(LOOP_DEG.act);
  const [ox, oy] = loop.nodePos(LOOP_DEG.observe);
  const below = loop.node / 2 + 33;
  const labelAt = [[tx - loop.node, ty], [ax, ay + below], [ox, oy + below]];
  loop.labels.forEach((e, i) => place(e, labelAt[i][0] + dx, labelAt[i][1] + dy, 1, P(t, a + 0.3 + i * 0.2, 0.4) * o));
  loop.arcs.forEach((arc, i) => draw(arc, P(t, a + 0.7 + i * 0.3, 0.45), o));
  place(loop.center, loop.cx + dx, loop.cy + dy, 1, P(t, centerAt, 0.5) * centerO * o);
  if (deg === null) {
    place(loop.token, 0, 0, 1, 0);
  } else {
    const [x, y] = loop.pos(deg);
    place(loop.token, x, y, 1, o);
  }
  // the comet: each spark 6 degrees further behind the token and fainter, none behind THINK, where every run starts
  loop.comet.forEach((e, k) => {
    const tailDeg = deg === null ? null : deg - (k + 1) * 6;
    if (tailDeg === null || tailDeg < LOOP_DEG.think) {
      place(e, 0, 0, 1, 0);
      return;
    }
    const [x, y] = loop.pos(tailDeg);
    place(e, x, y, 1, (0.55 - 0.08 * k) * o);
  });
}

// The agent's example task, lunch with Marie: each step's tile icon and label, its action in the step list, then
// the tool it calls and that tool's result
const LUNCH_STEPS = [
  { icon: 'cal', label: 'Calendar', action: 'Check the calendar', tool: 'Calendar', result: 'Thu 12:30 is free' },
  { icon: 'search', label: 'Restaurant', action: 'Find a restaurant', tool: 'Search', result: 'Chez Paulette' },
  { icon: 'food', label: 'Booking', action: 'Book a table', tool: 'Booking', result: 'table for 2, confirmed' },
  { icon: 'mail', label: 'Invite', action: 'Invite Marie', tool: 'Email', result: 'invite sent' },
];
// The agent's Event History of the lunch: the LLM call of each step (its action, lowercase), then its tool result
const LUNCH_HISTORY = LUNCH_STEPS.flatMap(step => [
  `LLM call: ${step.action[0].toLowerCase()}${step.action.slice(1)}`, `${step.tool}: ${step.result}`,
]);
// Whether row i of LUNCH_HISTORY (or context block i, see makeMemBlocks) holds an LLM call; the others hold a tool
// result
const isLLMRow = i => i % 2 === 0;
// Red note, e.g. EMPTY, centered across a panel or a card that a crash empties, its top `top` px from the box's;
// hidden until its opacity is set (class empty)
const emptyNote = (top, text = 'EMPTY', font = 30) => '<div class="empty mono" style="position:absolute;left:0;'
  + `right:0;top:${top}px;text-align:center;font-size:${font}px;letter-spacing:.14em;padding-left:.14em;`
  + `color:var(--red);opacity:0">${text}</div>`;
// A line or chip falls out of its panel when the app crashes: as fall goes from 0 to 1, it drops 260 px, tilts by
// `tilt` degrees and fades out; o: its opacity before the fall
function fallOut(e, fall, tilt, o = 1) {
  e.style.opacity = o * (1 - fall);
  e.style.transform = `translateY(${fall * 260}px) rotate(${fall * tilt}deg)`;
}
// CONTEXT panel: the agent's context, held in the app's memory, with a red note (EMPTY by default) for when a
// crash wipes it. Its icon is a page, as durable-ai-agents chapter 3 draws the context window. Options: label, the
// panel's label, its top left corner at labelAt ([left, top], px); emptyText, the note
function makeMemory(p, w, h, { label = 'Context', labelAt = [22, 16], emptyText = 'EMPTY' } = {}) {
  const e = E(p,
    panelLabel('book', label, `left:${labelAt[0]}px;top:${labelAt[1]}px`) + emptyNote(h / 2 - 8, emptyText, 26),
    'tile', { width: w + 'px', height: h + 'px', textAlign: 'left' });
  e.empty = e.querySelector('.empty');
  return e;
}
// context blocks held by the app, one per row of LUNCH_HISTORY: LLM results and tool results alternate, each
// centring the icon of its step (same colours as the Event History rows)
function makeMemBlocks(p, n, w, h) {
  return Array.from({ length: n }, (_, i) => {
    const isTool = !isLLMRow(i);
    const icon = ICON(LUNCH_STEPS[Math.floor(i / 2)].icon, Math.round(h / 2), isTool ? C.bg : C.uv, 1.8);
    const b = E(p, icon, '', {
      width: w + 'px', height: h + 'px', background: isTool ? C.neonTint : C.uvTint, borderRadius: 'var(--rs)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    });
    b.tilt = isTool ? 40 : -35;
    return b;
  });
}
// grow: pop-in progress; fall: crash progress (the block drops `drop` px, tilts and fades). (dx, dy): an offset
// (a shake, the panel's slide); o: opacity
function placeMemBlock(b, x, y, grow, fall, { dx = 0, dy = 0, o = 1, drop = 300 } = {}) {
  place(b, x + dx, y + fall * drop + dy, grow, clamp(grow * 2) * (1 - fall) * o, fall * b.tilt);
}
// x of the center of context block i, the blocks left-aligned in a context panel whose left edge is at panelLeft:
// each w px wide, gap px apart, the first one margin px from the edge
function memSlotX(panelLeft, i, { w, gap, margin }) {
  return panelLeft + margin + w / 2 + i * (w + gap);
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
// The red flicker of a crashGlitch() on an app panel: its border and status text turn red on the red steps. Call it
// after setAppStatus.
function glitchPanel(panel, glitch) {
  if (!glitch.red) return;
  panel.style.borderColor = C.red;
  panel.st.style.color = C.red;
}
// Crash marks on a crashed panel: a red bolt (bolt: { x, y, size }) and a solid red fixedTag, e.g. 'App crash'
// (crashTag: { x, y, w, h }, h optional); solid, so nothing under it shows through.
function makeCrashMarks(root, label, bolt, crashTag) {
  return {
    bolt: E(root, ICON('bolt', bolt.size, C.red, 1.6)),
    tag: fixedTag(root, label, 'red big solid', crashTag.w, { h: crashTag.h }),
    boltSpot: bolt, tagSpot: crashTag,
  };
}
// The bolt strikes at crashAt, the tag pops in at tagAt once it has landed; both leave from outAt. (dx, dy): the
// shake of the crashed side.
function placeCrashMarks(marks, t, crashAt, tagAt, outAt, dx = 0, dy = 0) {
  const { boltSpot, tagSpot } = marks;
  place(marks.bolt, boltSpot.x + dx, boltSpot.y + dy, P(t, crashAt, 0.35, backOut), win(t, crashAt, outAt, 0.2));
  const tagOn = P(t, tagAt, 0.1) * (1 - P(t, outAt, 0.25));
  place(marks.tag, tagSpot.x + dx, tagSpot.y + dy, P(t, tagAt, 0.35, backOut), tagOn);
}

// Arrow back to the first step when a run starts over: an arc (d, the SVG path, drawn in svg) in color, C.red when
// the work is done again, C.violet for a replay, with its label (HTML; css: its extra styles, e.g. a fixed width)
function makeRestartArc(root, svg, d, label, color, css = {}) {
  return { arc: path(svg, d, color, 3), label: E(root, label, 'lbl', { color, ...css }) };
}
// The arc draws from `at` within d seconds, its label at (x, y) fades in labelDelay seconds later; o: the opacity of
// both
function placeRestartArc(restart, t, at, x, y, { d = 0.8, labelDelay = 0.5, o = 1 } = {}) {
  draw(restart.arc, P(t, at, d), o);
  place(restart.label, x, y, 1, P(t, at + labelDelay, 0.35) * o);
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
// What rides with the instance on screen during a takeover (its context panel, its code card): the old instance's
// shake [sx, sy], drop, fade and grey filter until the new one arrives at bIn, then the new one's slide and fade in;
// both instances are gone when it switches. Returns { dx, dy, o, grey, onB }, onB: the new instance is on screen.
function takeoverRider(t, aDrop, bIn, [sx, sy] = [0, 0]) {
  if (t >= bIn) {
    const arrive = arrivingInstance(t, bIn);
    return { dx: arrive.dx, dy: 0, o: arrive.o, grey: '', onB: true };
  }
  const leave = leavingInstance(t, aDrop);
  return { dx: sx, dy: sy + leave.dy, o: leave.o, grey: leave.grey, onB: false };
}
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
  panel.style.boxShadow = `0 0 ${blur}px ${spread}px rgba(${RGB.violet},${(0.6 * k).toFixed(3)})`;
  panel.style.borderColor = C.violet;
}
// "New Worker" or "New instance" fixedTag on the new instance, violet and solid (the panel border does not show
// through)
const makeNewTag = (root, label, w, h = null) => fixedTag(root, label, 'violet solid', w, { h });
// The tag pops in at `at` and fades out from `out` within 0.3 s, at (x, y): add the arriving panel's dx to x so it
// slides in with it
function placeNewTag(e, t, at, out, x, y) {
  const pop = popIn(t, at);
  place(e, x, y, pop.s, pop.o * (1 - P(t, out, 0.3)));
}
// The Workflow (or agent) that Temporal hands to the new instance: a result card in violet, labelled with its
// name; fly it with flyChip from the history to the panel's status
function makeHandOffCard(root, label) {
  const e = makeResultCard(root, true, label);
  Object.assign(e.style, { background: C.violetTint, borderLeftColor: C.violet });
  return e;
}

// ---------- padlock
// How far the shackle of an open padlock rises above the body, in units of its 24 grid
const LOCK_LIFT = 4;
// Stroke padlock in a size px box (24 grid, like ICON('lock')), its shackle a path of its own (.shackle) that
// liftShackle() raises. stroke: the stroke width; color: the stroke color (none: set later on the <svg>); fill: the
// body's fill. A filled body is drawn over the shackle, so it hides the shackle's legs as it snaps shut; a hollow
// body under it.
function lockSvg(size, { stroke = 1.8, color = '', fill = 'none' } = {}) {
  const shackle = '<path class="shackle" d="M8 11V7a4 4 0 0 1 8 0v4"/>';
  const body = `<rect x="5" y="11" width="14" height="10" fill="${fill}"/><path d="M12 15v2"/>`;
  const parts = fill === 'none' ? body + shackle : shackle + body;
  const strokeColor = color ? ` stroke="${color}"` : '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"${strokeColor} stroke-width="${stroke}"`
    + ` stroke-linecap="square" stroke-linejoin="miter" style="display:block;overflow:visible">${parts}</svg>`;
}
// Raises the shackle of a lockSvg() (svg: its <svg> element) lift units of its 24 grid above the body
const liftShackle = (svg, lift) => svg.querySelector('.shackle').setAttribute('transform', `translate(0 ${-lift})`);

// ---------- status tags
// Small status label (e.g. on an Event History row); its text and colors are set by setStatus(). font sizes the
// text; padX and padY: its side and top and bottom padding, px; icon: size of the leading icon of the checked kinds;
// border: a 1 px border, transparent for the filled kinds, so every kind keeps the same size.
function statusTag(p, { font = 15, padX = 10, padY = 4, icon = 16, border = true } = {}) {
  const e = E(p, '', 'mono', {
    fontSize: font + 'px', letterSpacing: '.1em', padding: `${padY}px ${padX}px`, borderRadius: '4px',
    whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
  });
  if (border) e.style.border = '1px solid';
  e.iconSize = icon;
  e.padX = padX;
  return e;
}
// Looks of the statusTag kinds, each with an optional leading icon as [name, color, stroke width]:
// saved (neon on black, for white panels), ok (neon outline, for the dark stage), denied (red outline, with a
// cross), reused (white on UV), wait (violet outline), waiting (white on violet, with an hourglass) and closed
// (slate outline)
const STATUS_KINDS = {
  saved: { background: C.bg, color: C.neon, borderColor: 'transparent', icon: ['check', C.neon, 2.6] },
  ok: { background: `rgba(${RGB.neon},.08)`, color: C.neon, borderColor: C.neon, icon: ['check', C.neon, 2.6] },
  denied: { background: `rgba(${RGB.red},.1)`, color: C.red, borderColor: C.red, icon: ['x', C.red, 2.6] },
  reused: { background: C.uv, color: '#FFFFFF', borderColor: 'transparent' },
  wait: { background: `rgba(${RGB.violet},.14)`, color: C.violet, borderColor: C.violet },
  waiting: { background: C.violet, color: '#FFFFFF', borderColor: 'transparent', icon: ['hourglass', '#FFFFFF', 2.2] },
  closed: { background: 'transparent', color: C.slate, borderColor: C.slate },
};
// kind: a key of STATUS_KINDS; the DOM is only rewritten when label or kind changes.
// The letter spacing also trails the last letter: a label alone gets as much extra left padding, so its ink sits
// centered, while the margin round a leading icon's stroke inside its viewBox already offsets it.
// The .1em letter spacing gives fractional widths, and a tag anchored by its right edge or centered then has
// half-pixel edges, which rasterize differently depending on the frames drawn before. So the width is rounded up
// to an even number of pixels: the edges land on whole pixels whichever way the tag is anchored, and the label stays
// centered in the 1-2 px extra.
function setStatus(e, label, kind) {
  const key = kind + ':' + label;
  if (e._l === key) return;
  const { icon, ...colors } = STATUS_KINDS[kind];
  e.innerHTML = icon ? ICON(icon[0], e.iconSize, icon[1], icon[2]) + label : label;
  Object.assign(e.style, colors);
  e.style.paddingLeft = icon ? e.padX + 'px' : `calc(${e.padX}px + .1em)`;
  // in the live player, a width measured before the fonts load, or while the scene is hidden, is measured again on
  // the next call
  if (roundUpWidth(e) && document.fonts.status === 'loaded') e._l = key;
}
// A status tag at time t: its label and kind (see setStatus) and its opacity o; it swells briefly when its label
// changes at `at`
function placeStatusTag(e, t, label, kind, o, at) {
  setStatus(e, label, kind);
  e.style.opacity = o;
  e.style.transform = `scale(${swell(t, at, 0.14)})`;
}
// Tag of an Event History row whose saved result is handed back on a replay: a model (LLM) call is not billed
// again, a tool call is not run again
const reusedLabel = isModelCall => isModelCall ? 'REUSED, NOT RE-BILLED' : 'REUSED, NOT RE-RUN';

// ---------- app and Temporal panels
// Options of an app panel (makeAppPanel) with a larger name and status
const APP_TEXT_LARGE = { font: 22, statusFont: 18, statusTop: 25 };
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
// App instance panel (APP_TEXT_LARGE) holding a card of numbered lines in plain English, the steps the app runs,
// each with a neon check once done (see setCardLine), and EMPTY for when a crash wipes them. The card sits cardTop
// px from the panel top and 24 px from its other edges; it is part of the panel's HTML, so it never moves, and
// only its lines are animated elements. Options:
// - label: the card's label; emptyTop: top of EMPTY in the card
// - line: { top, gap, h }, the first line's top in the card, the line spacing and height; font: the text size;
//   inset: where the text starts in its line
// - check: { size, right }, the check icon's size and right margin, centered on its line
// - tilts: [even, odd], the tilt of the even and odd lines as they fall out on a crash
// Returns the panel with card, empty and lines (each with tx, its text, and ok, its check).
function makeLinesApp(p, name, w, h, lines, opts) {
  const { label, cardTop, emptyTop, line: L, font, inset, check, tilts } = opts;
  const app = makeAppPanel(p, name, w, h, APP_TEXT_LARGE);
  const cardW = w - 48, cardH = h - cardTop - 24;
  app.insertAdjacentHTML('beforeend',
    `<div style="position:absolute;left:24px;top:${cardTop}px;width:${cardW}px;height:${cardH}px;`
    + `background:rgba(${RGB.ink},.03);border:1px solid ${C.line};border-radius:var(--r)">`
    + panelLabel('code', label, 'left:20px;top:16px;padding-left:0') + emptyNote(emptyTop) + '</div>');
  app.card = app.lastElementChild;
  app.empty = app.card.querySelector('.empty');
  app.lines = lines.map((text, i) => {
    const line = E(app.card,
      `<span style="color:#6B7385;display:inline-block;width:38px">${i + 1}</span><span class="tx">${text}</span>`
      + `<div class="ok" style="position:absolute;right:${check.right}px;top:${(L.h - check.size) / 2}px">`
      + `${ICON('check', check.size, C.neon, 2.6)}</div>`,
      'mono', {
        left: '20px', top: (L.top + i * L.gap) + 'px', width: (cardW - 40) + 'px', height: L.h + 'px',
        lineHeight: L.h + 'px', fontSize: font + 'px', whiteSpace: 'nowrap', paddingLeft: (inset - 4) + 'px',
        // shows as a violet bar while the line runs
        borderRadius: 'var(--rs)', borderLeft: '4px solid transparent',
      });
    line.tx = line.querySelector('.tx'); line.ok = line.querySelector('.ok');
    line.tilt = tilts[i % 2];
    return line;
  });
  return app;
}
// Line state: 'todo' (dim), 'running' (violet bar), 'done' (check) or another state, bright with no mark (e.g. the
// line under a cursor); fall (0 to 1) drops the line out of the card when the app crashes (see fallOut)
function setCardLine(app, i, state, fall = 0) {
  const line = app.lines[i];
  const running = state === 'running';
  line.tx.style.color = state === 'todo' ? C.slate : C.ink;
  line.style.background = running ? `rgba(${RGB.violet},.2)` : 'transparent';
  line.style.borderLeftColor = running ? C.violet : 'transparent';
  line.ok.style.opacity = state === 'done' ? 1 : 0;
  fallOut(line, fall, line.tilt);
}
// Options of a TEMPORAL panel (makeTemporalPanel) with the logo in its header and a larger note
const TEMPORAL_HEADER_LARGE = { logoAt: [24, 20], noteAt: [24, 25], font: 18 };
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
// The Event History card in a TEMPORAL panel: under its 70 px header, 20 px from its other edges. panel and the
// result: { x, y, w, h }, the center and size of each
const historyInset = ({ x, y, w, h }) => ({ x, y: y + 25, w: w - 40, h: h - 90 });

// ---------- Event History card
// White card with an EVENT HISTORY header (headerFont, its icon 4 px larger, headerTop px from the card top),
// numbered rows and one status tag per row. rowsHtml: HTML of each row, after its number. Options:
// - uvRow(i): whether row i reads in UV (a model call, a Signal), the others in black
// - w, h: card size; rowTop(i): top of row i; font: row text size; rowH: row height with its text centered (null:
//   the height of the text); padY: vertical padding of a row
// - tagTop(i): top of the tag of row i; tagRight: its right margin; tag: statusTag options
// - crash: { keptTop, keptH, cutTop, label, labelX, labelFont }, the tinted block over the rows that survive a
//   crash and the dashed line under them, labelled at labelX (a CSS left); null for none (see markCrash)
// - scanH: height of the row highlight (see scanRow), null for none; scanDy: its top, from the top of its row
//   (default: centered on rows of height rowH, else level with them)
// Returns the card with rows, tags, kept and cut (crash), scan, rowTop and scanDy.
function makeHistoryCard(p, rowsHtml, opts) {
  const {
    w, h, headerFont = 18, headerTop = headerFont + 2, uvRow = () => false, rowTop, font = 22, rowH = null,
    padY = 4, tagTop, tagRight = 36, tag = {}, crash = null, scanH = null, scanDy = rowH ? (rowH - scanH) / 2 : 0,
  } = opts;
  const card = E(p,
    `<div class="mono" style="position:absolute;left:26px;top:${headerTop}px;font-size:${headerFont}px;`
    + `letter-spacing:.14em;color:${C.bg};display:flex;gap:10px;align-items:center">`
    + `${ICON('book', headerFont + 4, C.bg, 1.8)} EVENT HISTORY</div>`,
    'paper', { width: w + 'px', height: h + 'px' });
  if (crash) {
    card.kept = E(card, '', '', {
      left: '14px', top: crash.keptTop + 'px', width: (w - 28) + 'px', height: crash.keptH + 'px',
      background: `rgba(${RGB.uv},.08)`, borderLeft: '4px solid ' + C.uv, borderRadius: 'var(--rs)',
    });
    card.cut = E(card,
      `<span class="mono" style="position:absolute;left:${crash.labelX};top:-10px;transform:translateX(-50%);`
      + `background:${C.ink};padding:0 10px;font-size:${crash.labelFont}px;line-height:18px;letter-spacing:.12em;`
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
    const text = uvRow(i) ? `<span style="color:${C.uv}">${html}</span>` : html;
    const row = E(card, `<span style="color:#8A93A6;display:inline-block;width:34px">${i + 1}</span>${text}`,
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
  card.rowTop = rowTop;
  card.scanDy = scanDy;
  return card;
}
// Highlights row i of an Event History card with opacity o; i null or negative hides the highlight, parked on row 1
// so that a frame never depends on the frames drawn before it
function scanRow(card, i, o = 1) {
  const shown = i !== null && i >= 0;
  card.scan.style.top = (card.rowTop(shown ? i : 0) + card.scanDy) + 'px';
  card.scan.style.opacity = shown ? clamp(o) : 0;
}
// Crash marks of an Event History card after a crash at crashAt: the crash line shows first, then the tinted block
// over the rows that survive it
function markCrash(card, t, crashAt) {
  card.kept.style.opacity = P(t, crashAt + 0.7, 0.4);
  card.cut.style.opacity = P(t, crashAt + 0.3, 0.3);
}
// Neon chip with a check, e.g. WORKFLOW COMPLETE, centered in an Event History card with its top at `top` px; css adds
// to or overrides its style (a fixed size, the padding). Returns the chip, also kept as card.done.
function addHistoryDone(card, label, top, css = {}) {
  card.done = E(card, `${ICON('check', 24, C.neon, 2.6)} ${label}`, 'mono', {
    left: '50%', top: top + 'px', fontSize: '20px', letterSpacing: '.12em', color: C.neon, background: C.bg,
    padding: '10px 18px 10px 16px', borderRadius: 'var(--rs)', display: 'flex', gap: '10px', alignItems: 'center',
    ...css,
  });
  return card.done;
}
// Pops the chip of addHistoryDone() in at `at`
function placeHistoryDone(card, t, at) {
  const pop = backPop(t, at);
  card.done.style.opacity = pop.o;
  card.done.style.transform = `translateX(-50%) scale(${pop.s})`;
}
// Small card carrying one step result between the app and Temporal: UV for a model call or an Activity, green
// for a tool result; label: the card text, e.g. the kind of call the result comes from
function makeResultCard(p, uv = true, label = 'RESULT') {
  const text = `<span class="mono" style="font-size:15px;letter-spacing:.12em;padding-left:.12em">${label}</span>`;
  return E(p, text, '', {
    background: uv ? C.uvTint : C.neonTint, color: C.bg, padding: '6px 14px',
    borderLeft: `5px solid ${uv ? C.uv : C.neonDark}`, borderRadius: 'var(--rs)', whiteSpace: 'nowrap',
  });
}
// Result card of a model call (UV, labelled modelLabel) or of a tool call (green, TOOL CALL); w: a fixed width, the
// label centered in it (null: as wide as the label)
function makeCallCard(p, isModelCall, { modelLabel = 'LLM CALL', w = null } = {}) {
  const e = makeResultCard(p, isModelCall, isModelCall ? modelLabel : 'TOOL CALL');
  if (w) Object.assign(e.style, { width: w + 'px', textAlign: 'center' });
  return e;
}

// ---------- code card: white card showing a few lines of TypeScript, one div per line
// Default text metrics and tab height. Card height = 2 * padY + lines * lineH (256 px for 6 lines).
const CODE_CARD = { w: 680, font: 24, lineH: 36, padY: 20, padX: 20, gutter: 40, tabH: 34 };
// Light syntax coloring of one plain TypeScript line (no HTML): keywords UV, strings violet, called function names
// bold, comments and punctuation slate (angle brackets escaped), everything else (names, types) default ink
function highlightJs(line) {
  const token =
    /('[^']*')|(\/\/.*)|\b(export|async|function|await|const|typeof)\b|([A-Za-z_]\w*)(?=[(<])|([(){}<>:;,.=])/g;
  const escaped = { '<': '&lt;', '>': '&gt;' };
  return line.replace(token, (m, str, comment, kw, fn, punct) => {
    if (str) return `<span style="color:${C.violet}">${str}</span>`;
    if (comment) return `<span style="color:#7C8698">${comment}</span>`;
    if (kw) return `<span style="color:${C.uv}">${kw}</span>`;
    if (fn) return `<span style="font-weight:700">${fn}</span>`;
    return `<span style="color:#7C8698">${escaped[punct] || punct}</span>`;
  });
}
// opts.lines: plain TypeScript lines (required); opts.header: label of the tab on top of the card and opts.file: file
// name shown next to it (both hidden until card.hdr.style.opacity is set); opts.font, opts.lineH, opts.padY,
// opts.padX, opts.gutter: text metrics (default: CODE_CARD).
// Returns the card element with: w, h, lineH, padY, lines (one div per line), bar (highlight, see setCodeLine),
// hdr (tab or null) and lineY(i): y of the middle of line i relative to the card center.
function makeCodeCard(parent, opts) {
  const {
    lines, header = null, file = null, w = CODE_CARD.w, font = CODE_CARD.font, lineH = CODE_CARD.lineH,
    padY = CODE_CARD.padY, padX = CODE_CARD.padX, gutter = CODE_CARD.gutter,
  } = opts;
  const h = padY * 2 + lines.length * lineH;
  const card = E(parent, '', 'paper', { width: w + 'px', height: h + 'px' });
  card.w = w; card.h = h; card.lineH = lineH; card.padY = padY;
  // the highlight sits under the text, so it is created first
  card.bar = E(card, '', '', {
    left: '8px', width: (w - 16) + 'px', height: lineH + 'px', borderRadius: 'var(--rs)',
  });
  card.lines = lines.map((src, i) => E(card,
    `<span style="display:inline-block;width:${gutter}px;color:#B4BCCB">${i + 1}</span>${highlightJs(src)}`,
    'mono', {
      left: padX + 'px', top: (padY + i * lineH) + 'px', height: lineH + 'px',
      lineHeight: lineH + 'px', fontSize: font + 'px', whiteSpace: 'pre', opacity: 1,
    }));
  card.hdr = null;
  if (header) {
    // a tab standing on the top edge, so showing it never moves the code; the file name follows it, in slate
    const fileLabel = file
      ? `<span style="font-size:16px;letter-spacing:.04em;color:${C.slate}">${file}</span>` : '';
    card.hdr = E(card,
      `<div style="height:${CODE_CARD.tabH}px;padding:0 14px 0 12px;display:flex;align-items:center;gap:8px;`
      + `background:${C.uv};color:#FFFFFF;font-size:15px;letter-spacing:.12em;text-transform:uppercase;`
      + `border-radius:var(--rs) var(--rs) 0 0">${ICON('code', 18, '#FFFFFF', 2)}<span>${header}</span></div>`
      + fileLabel,
      'mono', {
        left: '18px', top: -CODE_CARD.tabH + 'px', height: CODE_CARD.tabH + 'px', display: 'flex', alignItems: 'center',
        gap: '16px', whiteSpace: 'nowrap',
      });
  }
  card.lineY = i => -h / 2 + padY + (i + 0.5) * lineH;
  return card;
}
// Highlight n lines from line i (0-based; a fractional i slides between lines) with opacity o
function setCodeLine(card, i, o, color = C.highlight, n = 1) {
  card.bar.style.top = (card.padY + i * card.lineH) + 'px';
  card.bar.style.height = (n * card.lineH) + 'px';
  card.bar.style.background = color;
  card.bar.style.opacity = clamp(o);
}

// ---------- counter tile
// Counter tile: a small label, a big number and a short mono note (e.g. MODEL CALLS BILLED: 3 NOT RE-BILLED); w:
// its width in px. Options:
// - icon: a slate icon before the label
// - noteBelow: the note on its own line under the number (by default it sits next to the number, on its baseline)
// - h: a fixed height in px (null: the height of the content)
// - center: the label, the number and the note centered (by default left-aligned)
function makeCounter(p, label, w, { icon = null, noteBelow = false, h = null, center = false } = {}) {
  const justify = center ? ';justify-content:center' : '';
  let html = icon
    ? `<div class="lbl" style="font-size:16px;display:flex;gap:10px;align-items:center${justify}">`
      + `${ICON(icon, 22, C.slate, 1.8)} ${label}</div>`
    : `<div class="lbl" style="font-size:16px">${label}</div>`;
  if (noteBelow) {
    // padding-left offsets the trailing letter spacing of a centered note
    html += '<div class="n" style="font-size:84px;line-height:1;margin-top:10px">0</div>'
      + '<div class="note mono" style="font-size:18px;letter-spacing:.1em;margin-top:12px;white-space:nowrap'
      + `${center ? ';padding-left:.1em' : ''}"></div>`;
  } else {
    html += `<div style="display:flex;align-items:baseline;gap:14px;margin-top:6px${justify}">`
      + '<div class="n" style="font-size:84px;line-height:1">0</div>'
      + '<div class="note mono" style="font-size:20px;letter-spacing:.08em;white-space:nowrap"></div></div>';
  }
  const e = E(p, html, 'tile', {
    width: w + 'px', textAlign: center ? 'center' : 'left', padding: noteBelow ? '20px 24px' : '18px 24px',
  });
  if (h) e.style.height = h + 'px';
  e.n = e.querySelector('.n'); e.note = e.querySelector('.note');
  return e;
}
// n: the number (or its text, e.g. '$42'); note: the note, '' for none
function setCounter(e, n, note = '', { noteColor = C.neon, numColor = C.ink } = {}) {
  e.n.textContent = n; e.n.style.color = numColor;
  e.note.textContent = note; e.note.style.color = noteColor;
}

// ===================== camera and motion helpers (camera moves, trails, sparks, ripples)
// Deterministic pseudo-random number in [0, 1) for an integer n: the same n gives the same value on every page and
// render worker, so scattered particles and glitches render identically in parallel
function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Camera of a scene: a full-stage layer that holds the scene's elements, so the whole composition can be scaled and
// moved around the stage center. Build the scene's elements in it.
function makeCamera(root) {
  return E(root, '', 'cam', { width: '1920px', height: '1080px', transformOrigin: '960px 540px', opacity: 1 });
}
// Zoom-through between scenes: the composition grows from `enter` (0.94; 1 for none) to 1 over enterD seconds as
// the scene fades in, and on to 1.06 as it fades out (dur: the scene duration). scale, dx, dy: an extra camera move
// of the scene, at rest 1, 0, 0 so that a resting frame sits on whole pixels.
// The exit zoom runs over the scene's default fade-out (SCENE_FADE): the presenter's end-of-scene stop, at the start
// of that fade, falls just before it, and the zoom plays with the fade into the next scene.
function setCamera(cam, t, dur, { scale = 1, dx = 0, dy = 0, enter = 0.94, enterD = 0.6, exit = 1.06 } = {}) {
  const zoom = lerp(enter, 1, P(t, 0, enterD)) * lerp(1, exit, P(t, dur - SCENE_FADE, SCENE_FADE, easeIn));
  cam.style.transform = `translate(${dx}px,${dy}px) scale(${scale * zoom})`;
}

// Puts a spark on the head of a path drawn to prog (0 to 1): it shows only while the path draws, its opacity times
// the optional factor o
function sparkOnPath(spark, pathEl, prog, o) {
  if (prog <= 0 || prog >= 1) {
    place(spark, 0, 0, 1, 0);
    return;
  }
  const point = pathEl.getPointAtLength(pathEl._L * prog);
  const opacity = Math.min(1, prog * 6, (1 - prog) * 6);
  // with a factor, the opacity is rounded to 3 decimals, which keeps the security scenes' flowing sparks on the same
  // color levels
  place(spark, point.x, point.y, 1, o === undefined ? opacity : +(opacity * o).toFixed(3));
}

// SVG path through the points of an orthogonal line, its corners rounded with radius r (less where a segment is too
// short); repeated points are skipped
function roundedPath(points, r) {
  const pts = points.filter((p, i) => i === 0 || p[0] !== points[i - 1][0] || p[1] !== points[i - 1][1]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1], [x, y] = pts[i], [nx, ny] = pts[i + 1];
    const inLen = Math.hypot(x - px, y - py), outLen = Math.hypot(nx - x, ny - y);
    const corner = Math.min(r, inLen / 2, outLen / 2);
    const from = [x - (x - px) / inLen * corner, y - (y - py) / inLen * corner];
    const to = [x + (nx - x) / outLen * corner, y + (ny - y) / outLen * corner];
    d += ` L ${from[0]} ${from[1]} Q ${x} ${y} ${to[0]} ${to[1]}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L ${last[0]} ${last[1]}`;
}
// The point at fraction u (0 to 1) of a line through points (straight segments), at constant speed: a chip or a
// card moving along a connector
function pointAlong(points, u) {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  let rest = clamp(u) * lengths.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lengths.length; i++) {
    if (rest <= lengths[i] || i === lengths.length - 1) {
      const p = lengths[i] > 0 ? clamp(rest / lengths[i]) : 1;
      return [lerp(points[i][0], points[i + 1][0], p), lerp(points[i][1], points[i + 1][1], p)];
    }
    rest -= lengths[i];
  }
  return points[points.length - 1];
}

// Ripple rings: n circles of a color growing from size0 to size1 px and fading, one after the other, from `at`
function makeRipples(p, n, rgb) {
  return Array.from({ length: n }, () => E(p, '', '', { borderRadius: '50%', border: `3px solid rgb(${rgb})` }));
}
// Each ring grows over d seconds, step seconds after the one before it
function placeRipples(rings, t, at, x, y, size0, size1, { d = 1.2, step = 0.25 } = {}) {
  rings.forEach((e, i) => {
    const p = P(t, at + i * step, d, x => 1 - Math.pow(1 - x, 2));
    // sized, not scaled, so the ring keeps its 3 px line
    const size = Math.round(lerp(size0, size1, p) / 2) * 2;
    e.style.width = e.style.height = size + 'px';
    place(e, x, y, 1, p > 0 && p < 1 ? (1 - p) * 0.9 : 0);
  });
}
