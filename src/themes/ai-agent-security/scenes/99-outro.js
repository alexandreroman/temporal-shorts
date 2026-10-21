// ===================== OUTRO
// End card; above the title, a shield draws itself round the AI model orb, which pops in inside it, then the shield
// closes with a soft violet glow and ripples: the agent, kept in check. The camera zoom-through (setCamera) brings
// the scene in.
// The block keeps every name declared in this file local to this scene.
{
  // the shield's center and size (its 24 grid box, px); the orb's size, centered in the shield's body (its widest
  // part sits a little above the box's middle)
  const SHIELD = { x: 960, y: 276, size: 168 };
  const ORB = { size: 64, dy: -2 };
  const STROKE_PX = 3.5;
  // when the shield closes: its tint has filled, the ripples start
  const CLOSED_AT = 1.3;

  scene({
    pre: 0.4, post: 2.6,
    // shield and end card, centered on y 515 (measured with the layout check)
    shift: [0, 60],
    subs: [
      { text: "With Temporal, your agents act within your rules, and every step stays on the record." },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // pathLength 1: the outline draws as its dash offset goes from 1 to 0
      s.shield = E(root,
        `<svg width="${SHIELD.size}" height="${SHIELD.size}" viewBox="0 0 24 24" style="display:block">`
        + `<path d="${SHIELD_OUTLINE}" pathLength="1" fill="rgba(${RGB.uv},.16)" stroke="${C.violet}"`
        + ` stroke-width="${(STROKE_PX * 24 / SHIELD.size).toFixed(3)}" stroke-linejoin="miter"`
        + ' stroke-dasharray="1 2"/></svg>',
        '', { width: SHIELD.size + 'px', height: SHIELD.size + 'px' });
      s.outline = s.shield.querySelector('path');
      s.orb = makeModelOrb(root, { x: SHIELD.x, y: SHIELD.y + ORB.dy, size: ORB.size, label: '' });
      s.ripples = makeRipples(root, 2, RGB.violet);
      s.t = makeEndCard(root, 'AI Agent Security', 'POWERFUL AGENTS, KEPT IN CHECK');
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
      const fill = P(t, CLOSED_AT - 0.5, 0.5);
      s.outline.setAttribute('fill-opacity', fill.toFixed(3));
      // a violet glow round the shield, a drop shadow: it follows the outline and stays off the layout measure
      s.shield.style.filter = fill > 0
        ? `drop-shadow(0 0 ${Math.round(28 * fill)}px rgba(${RGB.violet},${(0.55 * fill).toFixed(3)}))` : 'none';
      // the orb pops in inside the shield and blinks on G, looking ahead
      const pop = backPop(t, 0.6, 0.5);
      place(s.orb.el, SHIELD.x, SHIELD.y + ORB.dy, pop.s, pop.o);
      s.orb.set('idle');
      placeRipples(s.ripples, t, CLOSED_AT, SHIELD.x, SHIELD.y, 140, 360);
    }
  });
}
