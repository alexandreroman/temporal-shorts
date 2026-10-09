// ---------- helpers
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const linear = p => p;
const ease = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const easeIn = p => p * p * p;
const easeOut = p => 1 - (1 - p) ** 3;
const backOut = p => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};
// Progress from 0 to 1 over the d seconds after `a`, eased by f; with d <= 0, a step at `a` (a hard cut)
function P(t, a, d, f = ease) {
  if (d <= 0) return f(t >= a ? 1 : 0);
  return f(clamp((t - a) / d));
}
const lerp = (a, b, p) => a + (b - a) * p;
const win = (t, a, b, f = 0.4) => P(t, a, f) * (1 - P(t, b, f)); // visible between a and b
// Scale of a short swell when a value or status changes at `at`: 1 + amp at its peak, 1 outside it
const swell = (t, at, amp) => 1 + amp * Math.max(0, 1 - Math.abs(t - at - 0.1) / 0.25);
// Position that starts at `from`, then eases to each [at, x, y] stop in turn, over d seconds or the stop's own
// duration ([at, x, y, d]); stops may overlap. Used for a scene camera offset (`shift`) or a route.
function pan(t, from, stops, d) {
  let [x, y] = from;
  for (const [a, sx, sy, sd = d] of stops) { const p = P(t, a, sd); x = lerp(x, sx, p); y = lerp(y, sy, p); }
  return [x, y];
}
// Point at u (0 to 1) of the cubic Bezier curve of control points [p0, p1, p2, p3], each one [x, y]
function bezier([p0, p1, p2, p3], u) {
  const v = 1 - u;
  const at = k => v * v * v * p0[k] + 3 * v * v * u * p1[k] + 3 * v * u * u * p2[k] + u * u * u * p3[k];
  return [at(0), at(1)];
}
let G = 0; // global time
// Ambient clock of a scene: G counted from the scene's start, so it equals the scene time t in frozen frames.
// Endless loops (a pulse, a flow, a breathing slot) read it: in the live player G keeps real time while t
// slows down at 0.5x, and the player only counts the story moving on t as motion. Call it from update()
// as ambientTime(this). Story animations stay on t.
function ambientTime(sc) {
  return G - sc.start;
}

const stage = document.getElementById('stage');

// Deterministic star field: a fixed-seed generator, so every page and every render worker draws the same sky.
// Draws 110 stars over a 1920x1080 area of `sky`; the live player draws extra tiles with other seeds.
function drawStars(sky, seed) {
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 110; i++) {
    const star = document.createElement('i');
    star.style.left = (random() * 1920) + 'px';
    star.style.top = (random() * 1080) + 'px';
    star.style.opacity = (0.08 + random() * 0.35).toFixed(2);
    if (random() > .85) star.style.width = star.style.height = '3px';
    sky.appendChild(star);
  }
}
drawStars(document.getElementById('sky'), 7);

function E(parent, html = '', cls = '', css = {}) {
  const e = document.createElement('div');
  e.className = 'abs ' + cls;
  e.innerHTML = html;
  Object.assign(e.style, css);
  e.style.opacity = 0;
  parent.appendChild(e);
  return e;
}
function place(e, x, y, s = 1, o = 1, r = 0) {
  e.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) rotate(${r}deg) scale(${s})`;
  e.style.opacity = clamp(o);
  e.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
}
const SVGNS = 'http://www.w3.org/2000/svg';
function svgLayer(parent) {
  const s = document.createElementNS(SVGNS, 'svg');
  s.setAttribute('width', 1920); s.setAttribute('height', 1080);
  s.setAttribute('viewBox', '0 0 1920 1080');
  s.classList.add('layer');
  s.innerHTML = '<defs></defs>';
  parent.appendChild(s);
  return s;
}
// Number of arrow head markers created so far: it makes each marker id unique in the document
let arrowHeadCount = 0;
// Arrow head marker of `color` in an SVG layer, created on first use and cached on the layer by color (no id is
// built from the color). Its fill is explicit: WebKit (Safari) does not render fill="context-stroke".
function arrowHead(svg, color) {
  svg._heads ??= new Map();
  if (!svg._heads.has(color)) {
    arrowHeadCount += 1;
    const id = `ah${arrowHeadCount}`;
    const marker = document.createElementNS(SVGNS, 'marker');
    const attrs = { id, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 5, markerHeight: 5,
      orient: 'auto-start-reverse' };
    for (const [name, value] of Object.entries(attrs)) marker.setAttribute(name, value);
    const head = document.createElementNS(SVGNS, 'path');
    head.setAttribute('d', 'M0,0 L10,5 L0,10 z');
    head.setAttribute('fill', color);
    marker.appendChild(head);
    svg.querySelector('defs').appendChild(marker);
    svg._heads.set(color, `url(#${id})`);
  }
  return svg._heads.get(color);
}
function path(svg, d, color, w, arrow = true, dash = null) {
  const p = document.createElementNS(SVGNS, 'path');
  p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', color);
  p.setAttribute('stroke-width', w); p.setAttribute('stroke-linecap', 'round');
  // draw() shows the arrow head only once the stroke is nearly drawn
  p._marker = arrow ? arrowHead(svg, color) : null;
  svg.appendChild(p);
  const L = p.getTotalLength();
  p._L = L; p._dash = dash;
  p.style.opacity = 0;
  return p;
}
// draw: progress p of stroke drawing, o opacity
function draw(p, prog, o = 1) {
  if (p._dash) {
    p.setAttribute('stroke-dasharray', p._dash);
    p.setAttribute('stroke-dashoffset', -G * 40);
    p.style.opacity = o * clamp(prog);
  } else {
    p.setAttribute('stroke-dasharray', `${p._L} ${p._L}`);
    p.setAttribute('stroke-dashoffset', p._L * (1 - prog));
    p.style.opacity = prog > 0.001 ? o : 0;
  }
  // hide arrow head until nearly drawn; set on every call so the frame never depends on earlier ones
  if (p._marker) p.setAttribute('marker-end', prog > 0.92 ? p._marker : '');
}

// ---------- icons (stroke, 24 grid)
const ICONS = {
  cal: '<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  mail: '<rect x="3" y="6" width="18" height="13"/><path d="M3 7l9 6 9-6"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/>',
  server: '<rect x="4" y="4" width="16" height="7"/><rect x="4" y="13" width="16" height="7"/>'
    + '<path d="M8 7.5h.01M8 16.5h.01"/>',
  book: '<rect x="5" y="3" width="14" height="18"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  ticket: '<path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"/><path d="M15 7v10" stroke-dasharray="2 2"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 10-13h-7z"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2.5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  eye: '<path d="M2 12c3-6 17-6 20 0-3 6-17 6-20 0z"/><circle cx="12" cy="12" r="3"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
  retry: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  upload: '<path d="M12 15V4M7 9l5-5 5 5"/><path d="M4 14v6h16v-6"/>',
  bot: '<rect x="4" y="8" width="16" height="12"/><path d="M12 4.5V8M9 13h.01M15 13h.01M9.5 16.5h5"/>'
    + '<circle cx="12" cy="3.5" r="1"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M15 9.2c-.6-.9-1.7-1.4-3-1.4-1.7 0-3 .9-3 2.1 0 2.8 6 1.5 6 4.3'
    + ' 0 1.2-1.3 2.1-3 2.1-1.4 0-2.6-.6-3.1-1.6M12 6v1.8M12 16.3V18"/>',
  cloud: '<path d="M7 19h10.5a4.5 4.5 0 0 0 .4-9A6 6 0 0 0 6.3 11.6 3.8 3.8 0 0 0 7 19z"/>',
  hourglass: '<path d="M6 3h12M6 21h12"/><path d="M8 3v3.5l4 5.5-4 5.5V21M16 3v3.5L12 12l4 5.5V21"/>'
    + '<path d="M10 18.5h4"/>',
  // 8 trapezoidal teeth (tips at r 10, root circle r 7) around a center hole; centered on (12, 12) for gearSpin()
  gear: '<path d="M11.09 5.06L11.13 2.04L12.87 2.04L12.91 5.06'
    + 'A7 7 0 0 1 16.26 6.45L18.43 4.34L19.66 5.57L17.55 7.74'
    + 'A7 7 0 0 1 18.94 11.09L21.96 11.13L21.96 12.87L18.94 12.91'
    + 'A7 7 0 0 1 17.55 16.26L19.66 18.43L18.43 19.66L16.26 17.55'
    + 'A7 7 0 0 1 12.91 18.94L12.87 21.96L11.13 21.96L11.09 18.94'
    + 'A7 7 0 0 1 7.74 17.55L5.57 19.66L4.34 18.43L6.45 16.26'
    + 'A7 7 0 0 1 5.06 12.91L2.04 12.87L2.04 11.13L5.06 11.09'
    + 'A7 7 0 0 1 6.45 7.74L4.34 5.57L5.57 4.34L7.74 6.45'
    + 'A7 7 0 0 1 11.09 5.06z"/><circle cx="12" cy="12" r="3"/>',
};
function ICON(n, size, col, w = 1.8) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${col}"`
    + ` stroke-width="${w}" stroke-linecap="square" stroke-linejoin="miter" style="display:block">${ICONS[n]}</svg>`;
}

// ---------- components
// Options: `seed`, the phase of the blink (0 to 4.3 s), to give two orbs the same blink; by default each orb
// gets its own from a counter of the orbs built so far.
function makeLLM(parent, size, label = 'LLM', { seed } = {}) {
  const root = E(parent, `
    <div class="llm-glow"></div>
    <div class="llm-body"></div>
    <div class="llm-eye l"><div class="pupil"></div></div>
    <div class="llm-eye r"><div class="pupil"></div></div>
    <div class="llm-dots"><i></i><i></i><i></i></div>
    <div class="llm-q">?</div>
    ${label ? `<div class="llm-label">${label}</div>` : ''}`, 'llm');
  root.style.width = size + 'px'; root.style.height = size + 'px'; root.style.fontSize = (size / 10) + 'px';
  // counted even with a `seed`, so the default seeds of the other orbs never depend on it
  makeLLM.n = (makeLLM.n || 0) + 1;
  const o = {
    root,
    eyes: root.querySelectorAll('.llm-eye'),
    pupils: root.querySelectorAll('.pupil'),
    dots: root.querySelector('.llm-dots'),
    dotI: root.querySelectorAll('.llm-dots i'),
    q: root.querySelector('.llm-q'),
    seed: seed ?? (makeLLM.n * 1.37) % 3,
  };
  return o;
}
function llmState(L, { think = 0, q = 0, look = 0, lookY = 0 } = {}) {
  const ph = (G + L.seed) % 4.3;
  const blink = ph < 0.16 ? 0.12 : 1;
  L.eyes.forEach(e => e.style.transform = `scaleY(${blink})`);
  L.pupils.forEach(p => p.style.transform = `translate(${look * 0.35}em, ${lookY * 0.35}em)`);
  L.dots.style.opacity = think;
  L.dotI.forEach((d, i) => d.style.transform = `translateY(${-Math.max(0, Math.sin(G * 6 - i * 0.9)) * 0.35}em)`);
  L.q.style.opacity = q; L.q.style.transform = `scale(${0.6 + 0.4 * q}) rotate(${Math.sin(G * 3) * 8}deg)`;
}
function gearSpin(app, on) {
  // the gear turns with the clock whenever it shows as on, so it never races while `on` fades
  app.gear.style.transform = `rotate(${on > 0 ? G * 220 : 0}deg)`;
  app.gear.style.opacity = 0.35 + 0.65 * on;
}

// kind: 'user', 'llm', 'tool' or 'bad'; a 'tool' card has no default label, pass `who`
function makeCard(parent, text, kind, who = null, width = null) {
  const labels = { user: 'YOU', llm: 'MODEL', bad: 'MODEL' };
  const w = who === null ? labels[kind] : who;
  const e = E(parent, `${w ? `<div class="who">${w}</div>` : ''}<div class="txt">${text}</div>`, 'card k-' + kind);
  if (width) e.style.width = width + 'px';
  e.txt = e.querySelector('.txt'); e.full = text;
  return e;
}
// Types a makeCard's text word by word, p from 0 to 1
function typeWords(card, p) {
  const words = card.full.split(' ');
  const n = Math.round(words.length * clamp(p));
  card.txt.innerHTML = words.map((w, i) => `<span style="opacity:${i < n ? 1 : 0}">${w}</span>`).join(' ');
}

// ---------- timeline
const scenes = [];
function scene(def) { scenes.push(def); }
// Default duration of a scene's fade-in and fade-out, in seconds: a scene's `fadeIn` and `fadeOut` override it
const SCENE_FADE = 0.5;
function autoDur(text) { return clamp(text.replace(/<[^>]+>/g,'').length / 16 + 0.6, 2.4, 8); }

// The chapter scenes, in playing order: each chapter is one scene, which sets `chapter` (its number) and `title`.
// Filled by buildAll(); the intro and the outro have no chapter.
let chapterScenes = [];

function collectChapters() {
  chapterScenes = scenes.filter(sc => sc.chapter);
  chapterScenes.forEach((sc, i) => {
    if (sc.chapter !== i + 1) {
      throw new Error(`Chapter ${sc.chapter} plays as chapter ${i + 1}: number the chapter scenes 1, 2, 3... in order`);
    }
    if (!sc.title) throw new Error(`Chapter ${sc.chapter} has no title: set \`title\` next to \`chapter\``);
  });
}

function buildAll() {
  collectChapters();
  // inserted before #hdr so the header, progress segments and subtitles stay on top of every scene
  const hdr = document.getElementById('hdr');
  let T = 0;
  for (const sc of scenes) {
    sc.start = T; let t = T + (sc.pre ?? 0.6);
    sc.cues = [];
    for (const s of sc.subs) {
      s.start = t; s.end = t + autoDur(s.text);
      sc.cues.push(t - sc.start);
      t = s.end + 0.25 + (s.after ?? 0);
    }
    sc.end = t + (sc.post ?? 0.35); sc.dur = sc.end - sc.start; T = sc.end;
    // `holdBeforeEnd` (see player.js) and `headerOutAt` (see renderAt()) are seconds, or (c, dur) => seconds when
    // they follow the scene's cues c: resolved here, once the timings are known
    for (const name of ['holdBeforeEnd', 'headerOutAt']) {
      if (typeof sc[name] === 'function') sc[name] = sc[name](sc.cues, sc.dur);
    }
    sc.root = document.createElement('div'); sc.root.className = 'scene';
    stage.insertBefore(sc.root, hdr);
    sc.el = {};
    sc.build(sc.root, sc.el);
  }
  window.TOTAL = T;
  // header
  const segs = document.getElementById('segs');
  segs.innerHTML = chapterScenes.map(() => '<i><b></b></i>').join('');
}

// `g` is the ambient clock (G) driving continuous loops such as spinners and blinks; scenes animate on `t`.
function renderAt(t, g = t) {
  G = g;
  let cur = null;
  for (const sc of scenes) {
    const vis = t >= sc.start && t < sc.end;
    if (!vis) { sc.root.style.display = 'none'; continue; }
    cur = sc;
    sc.root.style.display = 'block';
    const lt = t - sc.start;
    const fadeIn = sc.fadeIn ?? SCENE_FADE, fadeOut = sc.fadeOut ?? SCENE_FADE;
    const o = P(lt, 0, fadeIn) * (1 - P(lt, sc.dur - fadeOut, fadeOut));
    sc.root.style.opacity = o;
    // optional `shift`: [dx, dy] or (t, c) => [dx, dy], centers the composition in the content frame (y 150-880,
    // middle 515)
    const sh = typeof sc.shift === 'function' ? sc.shift(lt, sc.cues) : sc.shift;
    sc.root.style.transform = sh ? `translate(${sh[0]}px,${sh[1]}px)` : '';
    sc.update(lt, sc.cues, sc.el);
  }
  // subtitles
  const sub = document.getElementById('sub');
  let st = null;
  for (const sc of scenes) for (const s of sc.subs) if (t >= s.start && t < s.end) st = s;
  if (st) {
    sub.innerHTML = st.text;
    const so = P(t, st.start, 0.18, linear) * (1 - P(t, st.end - 0.18, 0.18, linear));
    sub.parentNode.style.opacity = so;
  } else sub.parentNode.style.opacity = 0;
  // header, which fades in and out with each chapter, and the Temporal symbol, which stays fully visible across
  // chapter changes: it fades in with the first chapter and out with the last one, with the same fades as their
  // scene roots
  const hdr = document.getElementById('hdr');
  const mark = document.getElementById('mark');
  if (cur && cur.chapter) {
    const lt = t - cur.start;
    // optional `headerOutAt`: the scene time at which the header fades out early, over 0.4 s (see buildAll())
    const headerOut = cur.headerOutAt === undefined ? 1 : 1 - P(lt, cur.headerOutAt, 0.4);
    hdr.style.opacity = P(lt, 0.2, 0.5) * (1 - P(lt, cur.dur - 0.5, 0.4)) * headerOut;
    const firstStart = chapterScenes[0].start;
    const lastEnd = chapterScenes[chapterScenes.length - 1].end;
    mark.style.opacity = P(t, firstStart, 0.5) * (1 - P(t, lastEnd - 0.5, 0.5));
    hdr.querySelector('.num').textContent = String(cur.chapter).padStart(2, '0');
    hdr.querySelector('.ttl').textContent = cur.title;
  } else {
    hdr.style.opacity = 0;
    mark.style.opacity = 0;
  }
  const segs = document.querySelectorAll('#segs i b');
  const chap = cur?.chapter || 0;
  segs.forEach((b, i) => {
    let f = 0;
    if (i + 1 < chap) f = 1;
    else if (i + 1 === chap) f = clamp((t - cur.start) / cur.dur);
    // whole pixels of the 56 px segment (#segs i in styles.css): a fractional edge varies from run to run
    b.style.width = Math.round(f * 56) + 'px';
  });
  document.getElementById('segs').style.opacity = chap ? 1 : 0;
}

// Start a theme page, called by its last script: build every scene, then freeze on ?t=<seconds> (frame capture)
// or start the live player (startPlayer() comes from player.js, loaded after the scenes).
function boot() {
  buildAll();
  const query = new URLSearchParams(location.search);
  if (query.has('t')) renderAt(parseFloat(query.get('t')));
  else startPlayer();
}
