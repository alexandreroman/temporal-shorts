// ===================== Meet Temporal helpers (shared by the scenes of this theme)
// Extra stroke icons (24 grid), in the hand-drawn style of engine.js
Object.assign(ICONS, {
  // a car seen from the front: roof, body, headlights and wheels
  car: '<path d="M3 17v-5l2.5-5.5h13L21 12v5z"/><path d="M3 12h18M5.5 17v2.5M18.5 17v2.5M6.5 14.5h2M15.5 14.5h2"/>',
  // a four-pointed spark and a small plus: AI
  sparkle: '<path d="M11 3l1.8 6.2L19 11l-6.2 1.8L11 19l-1.8-6.2L3 11l6.2-1.8z"/><path d="M19 16.5v5M16.5 19h5"/>',
  // two stages joined by a pipe: a data pipeline
  pipeline: '<rect x="2.5" y="4.5" width="7" height="6"/><rect x="14.5" y="13.5" width="7" height="6"/>'
    + '<path d="M9.5 7.5h3.5v9h1.5"/>',
  // a chip with its pins: model training
  chip: '<rect x="6" y="6" width="12" height="12"/><rect x="10" y="10" width="4" height="4"/>'
    + '<path d="M9 2.5v3.5M15 2.5v3.5M9 18v3.5M15 18v3.5M2.5 9h3.5M2.5 15h3.5M18 9h3.5M18 15h3.5"/>',
  // a key: its bow and its bit
  key: '<circle cx="7.5" cy="12" r="4"/><path d="M11.5 12H21M17.5 12v3.5M20.5 12v2.5"/>',
});

// Official photo of the two founders (https://temporal.io/about), 900x929 px. Resolved against src/, as LOGO:
// this script lives two folders below it. In a built page the asset path is already a data: URI, which new URL()
// keeps as is.
const PHOTO = {
  url: new URL('assets/temporal-founders.jpg', new URL('../../', document.currentScript.src || document.baseURI)).href,
  w: 900, h: 929,
};

// The two founders, in the order the scenes introduce them; `face` is the center of the face in the photo (Samar
// stands on the left, Maxim on the right)
const FOUNDERS = [
  { name: 'Maxim Fateev', role: 'Co-founder, CTO', face: { x: 638, y: 165 } },
  { name: 'Samar Abbas', role: 'Co-founder, CEO', face: { x: 230, y: 140 } },
];
// Side of the square of the photo, around a face, that a face avatar shows
const FACE_CROP = 240;

// Round avatar of a founder: the face cropped from the photo, size px wide, in a violet ring; place() centers it
function makeFace(p, founder, size) {
  const k = size / FACE_CROP;
  const x = Math.round(size / 2 - founder.face.x * k), y = Math.round(size / 2 - founder.face.y * k);
  return E(p, '', '', {
    width: size + 'px', height: size + 'px', borderRadius: '50%', border: '2px solid ' + C.violet,
    backgroundImage: `url("${PHOTO.url}")`, backgroundSize: `${Math.round(PHOTO.w * k)}px auto`,
    backgroundPosition: `${x}px ${y}px`, backgroundOrigin: 'border-box', backgroundRepeat: 'no-repeat',
  });
}

// ===================== motion helpers (this theme is livelier than the others: camera moves, trails, sparks)
// Deterministic pseudo-random number in [0, 1) for an integer n: the same n gives the same value on every page and
// render worker, so scattered particles and glitches render identically in parallel
function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Camera of a scene: a full-stage layer that holds the scene's elements, so the whole composition can be scaled and
// moved around the stage center. Build the scene's elements in it.
function makeCamera(root) {
  const cam = E(root, '', 'cam', { width: '1920px', height: '1080px', transformOrigin: '960px 540px' });
  cam.style.opacity = 1;
  return cam;
}
// Zoom-through between scenes: the composition grows from `enter` (0.94; 1 for none) to 1 over enterD seconds as
// the scene fades in, and on to 1.06 as it fades out (dur: the scene duration). scale, dx, dy: an extra camera move
// of the scene, at rest 1, 0, 0 so that a resting frame sits on whole pixels.
// The exit zoom runs over the scene's last CAMERA_EXIT seconds: scenes set `holdBeforeEnd: CAMERA_EXIT`, so the
// presenter's end-of-scene stop falls just before it and the zoom plays with the fade into the next scene.
const CAMERA_EXIT = 0.6;
function setCamera(cam, t, dur, { scale = 1, dx = 0, dy = 0, enter = 0.94, enterD = 0.6, exit = 1.06 } = {}) {
  const zoom = lerp(enter, 1, P(t, 0, enterD)) * lerp(1, exit, P(t, dur - CAMERA_EXIT, CAMERA_EXIT, easeIn));
  cam.style.transform = `translate(${dx}px,${dy}px) scale(${scale * zoom})`;
}

// Glowing dot of light, size px wide, in a color (an rgb triplet such as '219,255,75'); place() centers it
const makeSpark = (p, size = 14, rgb = '248,250,252') => E(p, '', '', {
  width: size + 'px', height: size + 'px', borderRadius: '50%', background: `rgb(${rgb})`,
  boxShadow: `0 0 ${size}px ${Math.round(size / 2)}px rgba(${rgb},.55)`,
});
// Puts a spark on the head of a path drawn to prog (0 to 1): it shows only while the path draws
function sparkOnPath(spark, pathEl, prog, dx = 0, dy = 0) {
  if (prog <= 0 || prog >= 1) {
    place(spark, 0, 0, 1, 0);
    return;
  }
  const point = pathEl.getPointAtLength(pathEl._L * prog);
  place(spark, point.x + dx, point.y + dy, 1, Math.min(1, prog * 6, (1 - prog) * 6));
}

// Ripple rings: n circles of a color growing from size0 to size1 px and fading, one after the other, from `at`
function makeRipples(p, n, rgb) {
  return Array.from({ length: n }, () => E(p, '', '', { borderRadius: '50%', border: `3px solid rgb(${rgb})` }));
}
function placeRipples(rings, t, at, x, y, size0, size1, d = 1.2) {
  rings.forEach((e, i) => {
    const p = P(t, at + i * 0.25, d, x => 1 - Math.pow(1 - x, 2));
    // sized, not scaled, so the ring keeps its 3 px line
    const size = Math.round(lerp(size0, size1, p) / 2) * 2;
    e.style.width = e.style.height = size + 'px';
    place(e, x, y, 1, p > 0 && p < 1 ? (1 - p) * 0.9 : 0);
  });
}

// The official symbol's outline (the path of src/assets/temporal-symbol-light-cropped.svg, same viewBox), drawn
// stroke by stroke before the official file itself fades in over it
const SYMBOL_PATH = {
  viewBox: '390.49 392 386 386',
  d: 'M651.14,517.35C642.02,449.03,618.94,392,583.49,392s-58.53,57.03-67.65,125.35'
    + 'c-68.32,9.12-125.35,32.2-125.35,67.65s57.04,58.53,125.35,67.65c9.12,68.31,32.2,125.35,67.65,125.35'
    + 's58.53-57.04,67.65-125.35c68.32-9.12,125.35-32.2,125.35-67.65S719.45,526.47,651.14,517.35z'
    + 'M513.61,632.75c-65.43-9.45-103.59-31.08-103.59-47.75s38.16-38.3,103.59-47.75'
    + 'c-1.44,15.75-2.19,31.83-2.19,47.75C511.42,600.92,512.17,617.01,513.61,632.75z'
    + 'M583.49,411.53c16.67,0,38.3,38.16,47.75,103.59c-15.74-1.44-31.83-2.19-47.75-2.19'
    + 's-32.01,0.75-47.75,2.19C545.19,449.69,566.82,411.53,583.49,411.53z'
    + 'M653.37,632.75c-3.22,0.47-16.43,2.02-19.77,2.35c-0.33,3.35-1.89,16.55-2.35,19.77'
    + 'c-9.45,65.43-31.08,103.59-47.75,103.59s-38.3-38.16-47.75-103.59c-0.46-3.22-2.02-16.43-2.35-19.77'
    + 'c-1.52-15.51-2.44-32.17-2.44-50.1s0.92-34.59,2.44-50.11c15.51-1.52,32.17-2.44,50.1-2.44'
    + 's34.59,0.92,50.1,2.44c3.35,0.33,16.55,1.89,19.77,2.35c65.43,9.45,103.6,31.09,103.6,47.75'
    + 'S718.8,623.3,653.37,632.75z',
};
// The symbol, size px wide, as an outline that draws (setSymbolDraw) under the official file, which fades in
function makeDrawnSymbol(p, size) {
  const e = E(p,
    `<svg width="${size}" height="${size}" viewBox="${SYMBOL_PATH.viewBox}" style="position:absolute;left:0;top:0">`
    + `<path d="${SYMBOL_PATH.d}" fill="none" stroke="${C.ink}" stroke-width="3"/></svg>`
    + `<img src="${SYMBOL}" style="position:absolute;left:0;top:0;width:${size}px;height:${size}px">`,
    '', { width: size + 'px', height: size + 'px' });
  e.outline = e.querySelector('path');
  e.img = e.querySelector('img');
  e.outlineL = e.outline.getTotalLength();
  return e;
}
// draw: 0 to 1, the outline drawing; fill: 0 to 1, the official symbol fading in while the outline fades out
function setSymbolDraw(e, draw, fill) {
  e.outline.setAttribute('stroke-dasharray', `${e.outlineL} ${e.outlineL}`);
  e.outline.setAttribute('stroke-dashoffset', e.outlineL * (1 - draw));
  e.outline.style.opacity = draw > 0 ? 1 - fill : 0;
  e.img.style.opacity = fill;
}

// ===================== hand-off from chapter 3 (the AI hub) to chapter 4 (the agentic loop)
// Chapter 4's agentic loop: the geometry it is built with, and where it shows for the whole chapter (`place`: its
// center on the stage and its scale, so it never moves, from the cut to the end), and the chapter's camera shift.
// The scale gives the LLM node an even whole size (112 px), so it rests on whole pixels
const AGENT_LOOP = { cx: 560, cy: 540, r: 220 };
const AGENT_PLACE = { x: 520, y: 489, k: 112 / 130 };
const AGENT_START = { shift: [0, 0] };
// the LLM node's size as built in chapter 4, and the blink phase of both orbs
const AGENT_LLM = { size: 130, seed: 0.37 };
// The stage point where chapter 4's LLM node (THINK, on top of the loop) shows, and its size there: chapter 3's AI
// hub turns into that LLM node, so the same bubble carries across the cut. Rounded, as chapter 4 snaps its nodes to
// whole pixels
const AGENT_HANDOFF = {
  x: Math.round(AGENT_PLACE.x + AGENT_START.shift[0]),
  y: Math.round(AGENT_PLACE.y - AGENT_LOOP.r * AGENT_PLACE.k + AGENT_START.shift[1]),
  size: AGENT_LLM.size * AGENT_PLACE.k,
};
// The halo around the bubble at the cut: its size on screen (diameter, px) and opacity, the same on both sides
const HANDOFF_HALO = { size: 300, o: 0.8 };
const HALO_BACKGROUND = 'radial-gradient(circle, rgba(182,100,255,.4) 0%, rgba(68,76,231,.15) 45%, '
  + 'rgba(68,76,231,0) 70%)';
