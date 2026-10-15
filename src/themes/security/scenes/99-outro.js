// ===================== OUTRO
// End card; above the title, a shield draws itself, then a padlock in it snaps shut, neon, with ripples.
// The block keeps every name declared in this file local to this scene.
{
  // the shield's center and size (its 24 grid box, px); the padlock's size, centered in the shield
  const SHIELD = { x: 960, y: 276, size: 168 };
  const LOCK = { size: 64, dy: 4 };
  // the outline of the engine's `shield` icon, without its check
  const SHIELD_PATH = 'M12 3l8 3v6c0 4.5-3.4 7.7-8 9-4.6-1.3-8-4.5-8-9V6z';
  const STROKE_PX = 3.5;
  const SNAP_AT = 1.3;

  scene({
    pre: 0.4, post: 2.6,
    // shield and end card, measured: y 192-718, centered on y 515 once shifted
    shift: [0, 60],
    subs: [
      { text: "With Temporal, your code, your keys and your data stay yours." },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // pathLength 1: the outline draws as its dash offset goes from 1 to 0
      s.shield = E(root,
        `<svg width="${SHIELD.size}" height="${SHIELD.size}" viewBox="0 0 24 24" style="display:block">`
        + `<path d="${SHIELD_PATH}" pathLength="1" fill="rgba(${RGB.uv},.16)" stroke="${C.violet}"`
        + ` stroke-width="${(STROKE_PX * 24 / SHIELD.size).toFixed(3)}" stroke-linejoin="miter"`
        + ' stroke-dasharray="1 2"/></svg>',
        '', { width: SHIELD.size + 'px', height: SHIELD.size + 'px' });
      s.outline = s.shield.querySelector('path');
      s.lock = makeLock(root, LOCK.size, 1.7);
      s.ripples = makeRipples(root, 2, RGB.neon);
      s.t = makeEndCard(root, 'Security', 'YOUR CODE, YOUR KEYS, YOUR DATA');
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      placeEndCard(s.t, t);
      // the outline draws, then its UV tint fills in
      const drawn = P(t, 0.15, 0.8);
      place(s.shield, SHIELD.x, SHIELD.y, 1, drawn > 0 ? 1 : 0);
      s.outline.setAttribute('stroke-dashoffset', (1 - drawn).toFixed(4));
      // no dash once drawn, so the outline closes with a clean miter at its top point
      s.outline.setAttribute('stroke-dasharray', drawn < 1 ? '1 2' : 'none');
      const fill = P(t, 0.7, 0.5);
      s.outline.setAttribute('fill-opacity', fill.toFixed(3));
      // a violet glow round the shield, a drop shadow: it follows the outline and stays off the layout measure
      s.shield.style.filter = fill > 0
        ? `drop-shadow(0 0 ${Math.round(28 * fill)}px rgba(${RGB.violet},${(0.55 * fill).toFixed(3)}))` : 'none';
      // the padlock pops in open, then snaps shut with a ripple
      const pop = backPop(t, 0.75, 0.45);
      place(s.lock, SHIELD.x, SHIELD.y + LOCK.dy, pop.s, pop.o);
      setLock(s.lock, P(t, SNAP_AT, 0.35, linear));
      placeRipples(s.ripples, t, SNAP_AT + LOCK_SHUT * 0.35, SHIELD.x, SHIELD.y, 120, 340);
    }
  });
}
