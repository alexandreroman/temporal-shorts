// ===================== Temporal Agent Harness helpers (shared by the scenes of this theme)

// Extra icons, same style as the engine set: 24 grid, stroke only, square caps.
// This file is loaded by this theme only, so the other themes keep the engine set as is.
Object.assign(ICONS, {
  plane: '<path d="M12 2.5c.9 0 1.4.9 1.4 2.2v4.6l7.6 4.4v2.1l-7.6-2.3v4.2l2.4 1.8v1.8L12 20.3l-3.8 1v-1.8'
    + 'l2.4-1.8v-4.2L3 15.8v-2.1l7.6-4.4V4.7c0-1.3.5-2.2 1.4-2.2z"/>',
  bed: '<path d="M3 5v15M3 16h18v4M11 16v-5h8a2 2 0 0 1 2 2v3"/><circle cx="7" cy="13" r="2"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  lock: '<rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 7.7-8 9-4.6-1.3-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  pause: '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>',
  laptop: '<rect x="5" y="5" width="14" height="10"/><path d="M5 15l-2 4h18l-2-4"/>',
  layers: '<path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5"/>',
  stream: '<path d="M3 7h11M3 12h17M3 17h11M17 9l3 3-3 3"/>',
  cloud: '<path d="M7 19h10.5a4.5 4.5 0 0 0 .4-9A6 6 0 0 0 6.3 11.6 3.8 3.8 0 0 0 7 19z"/>',
  agent: '<rect x="4" y="8" width="16" height="12" rx="3"/><circle cx="12" cy="3.8" r="1.3"/>'
    + '<path d="M12 5.1V8M9 12.5v2M15 12.5v2"/>',
});

// Tool-call chip: the tool name (e.g. book_flight) followed by a slate argument (e.g. $480).
// A .pill in normal case; cls adds pill colors (uv, violet, neon, red). e.arg holds the argument.
function callCard(p, name, arg = '', cls = '') {
  const e = E(p, `${name}<span class="arg" style="color:var(--slate)">${arg ? ' ' + arg : ''}</span>`, 'pill ' + cls, {
    textTransform: 'none', letterSpacing: '.02em', fontSize: '22px', padding: '9px 18px 9px calc(18px + .02em)',
  });
  e.arg = e.querySelector('.arg');
  return e;
}

// Opaque equivalents of the .pill.uv and .pill.violet tints on the Space Black stage: a pill that sits on
// a line (a lane, a frame, a connector) needs a solid background, or the line shows through it.
const OPAQUE = { uv: '#1D1E3A', violet: '#2B1F35' };

// Ambient clock of a scene: G counted from the scene's start, so it equals the scene time t in frozen frames.
// Endless loops (a pulse, a flow, a breathing slot) read it: in the live player G keeps real time while t
// slows down at 0.5x, and the player only counts the story moving on t as motion. Call it from update()
// as ambientTime(this). Story animations stay on t.
function ambientTime(sc) {
  return G - sc.start;
}
