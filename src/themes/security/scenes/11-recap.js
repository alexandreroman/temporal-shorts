// ===================== 11. WHAT YOU GET
// The recap: one tile per benefit, in the use cases' row (USE_CASE_ROW). Each tile lands as the subtitle names its
// benefit: it drops onto the stage from in front of the camera, its border lights up, and the padlock on its top edge
// snaps shut with neon ripples. The engine's zoom-through brings the scene in; it ends on the full row at rest,
// padlocks shut, which is chapter 12's first frame (a match cut: no fade-out, no exit zoom).
// The block keeps every name declared in this file local to this scene.
{
  // seconds after c[0] when each tile lands: as the subtitle names its benefit, at its position at 16 characters per
  // second plus 0.3 s; the first one 0.05 s later, so that its drop starts at c[0]
  const LAND_AT = [0.35, 1.68, 3.55, 5.11];
  // the drop: the tile falls from DROP.scale to its resting size over DROP.d seconds, ending as it lands, and fades
  // in over the first `fade` of it
  const DROP = { scale: 1.3, d: 0.35, fade: 0.6 };
  // from the landing: the tile stays lit for LIT seconds; its padlock snaps shut over SNAP seconds (setLock's linear
  // progress), throwing neon ripples from the badge, RIPPLE.from to RIPPLE.to px wide
  const LIT = 1.0;
  const SNAP = 0.35;
  const RIPPLE = { from: RECAP_BADGE.size, to: 240 };
  const BADGE_Y = USE_CASE_ROW.y - USE_CASE_ROW.h / 2;

  scene({
    chapter: 11, title: 'What you get',
    fadeOut: 0,
    // the presenter holds on the full row before the header fades out, long after the last ripple
    holdBeforeEnd: 0.6,
    subs: [
      {
        text: 'Your code stays home, every connection is verified, payloads stay encrypted, Workers hold no secrets.',
        // the last padlock's ripples end at c[0] + 6.7: the full row then holds about 1.4 s before the cut
        after: 0.6,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.tiles = BENEFITS.map(benefit => makeRecapTile(root, benefit));
      s.ripples = BENEFITS.map(() => makeRipples(root, 2, RGB.neon));
    },
    update(t, c, s) {
      // the engine's zoom-through in; no exit zoom, as chapter 12 opens on the last frame
      setCamera(s.cam, t, this.dur, { exit: 1 });
      s.tiles.forEach((tile, i) => {
        const x = useCaseX(i);
        const landAt = c[0] + LAND_AT[i];
        const fall = P(t, landAt - DROP.d, DROP.d, easeIn);
        const opacity = P(t, landAt - DROP.d, DROP.d * DROP.fade, linear);
        // exactly 1 once landed, so the tile rests on whole pixels
        place(tile, x, USE_CASE_ROW.y, 1 + (DROP.scale - 1) * (1 - fall), opacity);
        setRecapTile(tile, { seal: P(t, landAt, SNAP, linear), lit: t >= landAt && t < landAt + LIT });
        placeRipples(s.ripples[i], t, landAt + LOCK_SHUT * SNAP, x, BADGE_Y, RIPPLE.from, RIPPLE.to);
      });
    }
  });
}
