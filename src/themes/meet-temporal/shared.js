// ===================== Meet Temporal helpers (shared by the scenes of this theme)
// Extra stroke icons (24 grid), in the hand-drawn style of engine.js
Object.assign(ICONS, {
  // a car seen from the front: roof, body, headlights and wheels
  car: '<path d="M3 17v-5l2.5-5.5h13L21 12v5z"/><path d="M3 12h18M5.5 17v2.5M18.5 17v2.5M6.5 14.5h2M15.5 14.5h2"/>',
  // a four-pointed spark and a small plus: AI
  sparkle: '<path d="M11 3l1.8 6.2L19 11l-6.2 1.8L11 19l-1.8-6.2L3 11l6.2-1.8z"/><path d="M19 16.5v5M16.5 19h5"/>',
});

// The two founders, in the order the scenes introduce them; `initial` marks them on the timelines
const FOUNDERS = [
  { name: 'Maxim Fateev', initial: 'M' },
  { name: 'Samar Abbas', initial: 'S' },
];

// Small round marker of a founder: the initial in a violet ring, size px wide; place() centers it
function makeFounderMark(p, initial, size) {
  return E(p, initial, '', {
    width: size + 'px', height: size + 'px', borderRadius: '50%', border: '2px solid ' + C.violet,
    background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: Math.round(size * 0.45) + 'px', fontWeight: 700, lineHeight: 1,
  });
}
