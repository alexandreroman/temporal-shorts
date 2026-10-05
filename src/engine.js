// ---------- helpers
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const easeIn = p => p * p * p;
const backOut = p => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};
const P = (t, a, d = 0.6, f = ease) => f(clamp((t - a) / d));
const lerp = (a, b, p) => a + (b - a) * p;
const win = (t, a, b, f = 0.4) => P(t, a, f) * (1 - P(t, b, f)); // visible between a and b
// Scene camera offset for `shift`: starts at `from`, then eases to each [at, dx, dy] stop in turn.
function pan(t, from, stops, d = 0.8) {
  let [x, y] = from;
  for (const [a, dx, dy] of stops) { const p = P(t, a, d); x = lerp(x, dx, p); y = lerp(y, dy, p); }
  return [x, y];
}
let G = 0; // global time

const stage = document.getElementById('stage');

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
  s.innerHTML = `<defs>
   <marker id="ah${parent.dataset.k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5"`
    + ` orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>`;
  parent.appendChild(s);
  return s;
}
function path(svg, d, color, w, arrow = true, dash = null) {
  const p = document.createElementNS(SVGNS, 'path');
  p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', color);
  p.setAttribute('stroke-width', w); p.setAttribute('stroke-linecap', 'round');
  // draw() shows the arrow head only once the stroke is nearly drawn
  p._marker = arrow ? `url(#ah${svg.parentNode.dataset.k})` : null;
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
  sun: '<circle cx="12" cy="12" r="4"/>'
    + '<path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  cal: '<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  mail: '<rect x="3" y="6" width="18" height="13"/><path d="M3 7l9 6 9-6"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/>',
  food: '<path d="M7 3v18M4 3v5a3 3 0 0 0 6 0V3M17 21V3c-2.5 2-3 6-1 9h1"/>',
  server: '<rect x="4" y="4" width="16" height="7"/><rect x="4" y="13" width="16" height="7"/>'
    + '<path d="M8 7.5h.01M8 16.5h.01"/>',
  book: '<rect x="5" y="3" width="14" height="18"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  ticket: '<path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"/><path d="M15 7v10" stroke-dasharray="2 2"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M15 9.2c-.6-.9-1.7-1.4-3-1.4-1.7 0-3 .9-3 2.1 0 2.8 6 1.5 6 4.3'
    + ' 0 1.2-1.3 2.1-3 2.1-1.4 0-2.6-.6-3.1-1.6M12 6v1.8M12 16.3V18"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 10-13h-7z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  eye: '<path d="M2 12c3-6 17-6 20 0-3 6-17 6-20 0z"/><circle cx="12" cy="12" r="3"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
  retry: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3'
    + 'M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
};
function ICON(n, size = 48, col = '#F8FAFC', w = 1.8) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${col}"`
    + ` stroke-width="${w}" stroke-linecap="square" stroke-linejoin="miter" style="display:block">${ICONS[n]}</svg>`;
}

// ---------- components
function makeLLM(parent, size = 220, label = 'LLM') {
  const root = E(parent, `
    <div class="llm-glow"></div>
    <div class="llm-body"></div>
    <div class="llm-eye l"><div class="pupil"></div></div>
    <div class="llm-eye r"><div class="pupil"></div></div>
    <div class="llm-dots"><i></i><i></i><i></i></div>
    <div class="llm-q">?</div>
    ${label ? `<div class="llm-label">${label}</div>` : ''}`, 'llm');
  root.style.width = size + 'px'; root.style.height = size + 'px'; root.style.fontSize = (size / 10) + 'px';
  const o = {
    root,
    eyes: root.querySelectorAll('.llm-eye'),
    pupils: root.querySelectorAll('.pupil'),
    dots: root.querySelector('.llm-dots'),
    dotI: root.querySelectorAll('.llm-dots i'),
    q: root.querySelector('.llm-q'),
    seed: ((makeLLM.n = (makeLLM.n || 0) + 1) * 1.37) % 3,
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
function makeApp(parent) {
  const root = E(parent, `
   <div class="app-win">
     <div class="app-bar"><i></i><i></i><i></i></div>
     <div class="app-lines"><b style="width:70%"></b><b style="width:45%"></b><b style="width:60%"></b></div>
     <div class="app-gear">${ICON('gear', 46, '#F8FAFC')}</div>
   </div>
   <div class="app-label">APP</div>`, 'app');
  root.gear = root.querySelector('.app-gear');
  return root;
}
function gearSpin(app, on) {
  app.gear.style.transform = `rotate(${G * 220 * on}deg)`;
  app.gear.style.opacity = 0.35 + 0.65 * on;
}

function makeCard(parent, text, kind = 'user', who = null, width = null) {
  const labels = { user: 'YOU', llm: 'MODEL', tool: 'TOOL', ok: 'MODEL', bad: 'MODEL' };
  const w = who === null ? labels[kind] : who;
  const e = E(parent, `${w ? `<div class="who">${w}</div>` : ''}<div class="txt">${text}</div>`, 'card k-' + kind);
  if (width) e.style.width = width + 'px';
  e.txt = e.querySelector('.txt'); e.full = text;
  return e;
}

// ---------- timeline
const scenes = [];
function scene(def) { scenes.push(def); }
function autoDur(text) { return clamp(text.replace(/<[^>]+>/g,'').length / 16 + 0.6, 2.4, 8); }

// CHAPTERS[n - 1] is the title of chapter n, filled by buildAll() from the `title` of the chapter's first scene.
const CHAPTERS = [];

function collectChapters() {
  for (const sc of scenes) {
    if (sc.chapter && sc.title) CHAPTERS[sc.chapter - 1] = sc.title;
  }
  for (const sc of scenes) {
    if (sc.chapter && !CHAPTERS[sc.chapter - 1]) {
      throw new Error(`Chapter ${sc.chapter} has no title: set \`title\` on its first scene`);
    }
  }
}

function buildAll() {
  collectChapters();
  // inserted before #hdr so the header, progress segments and subtitles stay on top of every scene
  const hdr = document.getElementById('hdr');
  let T = 0, k = 0;
  for (const sc of scenes) {
    sc.start = T; let t = T + (sc.pre ?? 0.6);
    sc.cues = [];
    for (const s of sc.subs) {
      s.start = t; s.end = t + autoDur(s.text);
      sc.cues.push(t - sc.start);
      t = s.end + 0.25 + (s.after ?? 0);
    }
    sc.end = t + (sc.post ?? 0.35); sc.dur = sc.end - sc.start; T = sc.end;
    sc.root = document.createElement('div'); sc.root.className = 'scene'; sc.root.dataset.k = k++;
    stage.insertBefore(sc.root, hdr);
    sc.el = {};
    sc.build(sc.root, sc.el);
  }
  window.TOTAL = T;
  // header
  const segs = document.getElementById('segs');
  segs.innerHTML = CHAPTERS.map(() => '<i><b></b></i>').join('');
}

function renderAt(t) {
  G = t;
  let cur = null;
  for (const sc of scenes) {
    const vis = t >= sc.start && t < sc.end;
    if (!vis) { sc.root.style.display = 'none'; continue; }
    cur = sc;
    sc.root.style.display = 'block';
    const lt = t - sc.start;
    const o = P(lt, 0, 0.5) * (1 - P(lt, sc.dur - 0.5, 0.5));
    sc.root.style.opacity = o;
    // optional `shift`: [dx, dy] or (t, c) => [dx, dy], centers the composition in the free band
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
    const so = P(t, st.start, 0.18, x => x) * (1 - P(t, st.end - 0.18, 0.18, x => x));
    sub.parentNode.style.opacity = so;
  } else sub.parentNode.style.opacity = 0;
  // header
  const hdr = document.getElementById('hdr');
  if (cur && cur.chapter) {
    const lt = t - cur.start;
    const o = P(lt, 0.2, 0.5) * (1 - P(lt, cur.dur - 0.5, 0.4));
    hdr.style.opacity = o;
    hdr.querySelector('.num').textContent = String(cur.chapter).padStart(2, '0');
    hdr.querySelector('.ttl').textContent = CHAPTERS[cur.chapter - 1];
  } else hdr.style.opacity = 0;
  const segs = document.querySelectorAll('#segs i b');
  const chap = cur?.chapter || 0;
  segs.forEach((b, i) => {
    let f = 0;
    if (i + 1 < chap) f = 1;
    else if (i + 1 === chap) {
      // progress inside chapter (may span multiple scenes)
      const cs = scenes.filter(s => s.chapter === chap);
      const a = cs[0].start, z = cs[cs.length - 1].end;
      f = clamp((t - a) / (z - a));
    }
    b.style.width = (f * 100) + '%';
  });
  document.getElementById('segs').style.opacity = chap ? 1 : 0;
}
