// ===================== Meet Temporal helpers (shared by the scenes of this theme)
// Extra stroke icons (24 grid), in the hand-drawn style of engine.js
Object.assign(ICONS, {
  // a car seen from the front: roof, body, headlights and wheels
  car: '<path d="M3 17v-5l2.5-5.5h13L21 12v5z"/><path d="M3 12h18M5.5 17v2.5M18.5 17v2.5M6.5 14.5h2M15.5 14.5h2"/>',
  // a four-pointed spark and a small plus: AI
  sparkle: '<path d="M11 3l1.8 6.2L19 11l-6.2 1.8L11 19l-1.8-6.2L3 11l6.2-1.8z"/><path d="M19 16.5v5M16.5 19h5"/>',
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
