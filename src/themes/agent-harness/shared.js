// ===================== Temporal Agent Harness helpers (shared by the scenes of this theme)

// Extra icons, same style as the engine set: 24 grid, stroke only, square caps.
// This file is loaded by this theme only, so the other themes keep the engine set as is.
Object.assign(ICONS, {
  plane: '<path d="M12 2.5c.9 0 1.4.9 1.4 2.2v4.6l7.6 4.4v2.1l-7.6-2.3v4.2l2.4 1.8v1.8L12 20.3l-3.8 1v-1.8'
    + 'l2.4-1.8v-4.2L3 15.8v-2.1l7.6-4.4V4.7c0-1.3.5-2.2 1.4-2.2z"/>',
  bed: '<path d="M3 5v15M3 16h18v4M11 16v-5h8a2 2 0 0 1 2 2v3"/><circle cx="7" cy="13" r="2"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 7.7-8 9-4.6-1.3-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  pause: '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>',
  laptop: '<rect x="5" y="5" width="14" height="10"/><path d="M5 15l-2 4h18l-2-4"/>',
  layers: '<path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5"/>',
  stream: '<path d="M3 7h11M3 12h17M3 17h11M17 9l3 3-3 3"/>',
  cloud: '<path d="M7 19h10.5a4.5 4.5 0 0 0 .4-9A6 6 0 0 0 6.3 11.6 3.8 3.8 0 0 0 7 19z"/>',
  // a clock whose two hands turn, the minute hand up and the hour hand at 3 o'clock at rest (see setClockHands)
  clockHands: '<circle cx="12" cy="12" r="9"/><path class="mh" d="M12 12V5.5"/><path class="hh" d="M12 12h4"/>',
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

// Pops in an element laid out by its CSS rather than by place() (a pill in a row, a badge on a card): the scale and
// opacity of a backPop()
function popScale(e, pop) {
  e.style.transform = `scale(${pop.s})`;
  e.style.opacity = pop.o;
}
// Turns the hands of the clockHands icon in e: the hour hand by `turns` full turns, the minute hand twelve times as
// fast
function setClockHands(e, turns) {
  e.querySelector('.mh').setAttribute('transform', `rotate(${turns * 360 * 12} 12 12)`);
  e.querySelector('.hh').setAttribute('transform', `rotate(${turns * 360} 12 12)`);
}
