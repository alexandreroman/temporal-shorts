// ===================== 6. WHAT YOU GET
// The recap, the last chapter before the outro: one tile per answer of chapters 2 to 5, on the row of USE_CASE_ROW.
// Each tile pops in as the subtitle names its answer, and its border lights up (UV) until the next one lands; then a
// small red case-file stamp thumps onto it, dated with the incident that answer meets. The row holds after the
// subtitle so the four tiles read, and the camera zoom-through (setCamera) brings the scene in and plays into the
// outro.
// The block keeps every name declared in this file local to this scene.
{
  // [icon, label, what it means, date of the incident it answers] of each tile, left to right; every label takes
  // two lines, so the icons and the lines under the labels stay aligned across the row
  const ANSWERS = [
    ['sandbox', 'Sandboxed<br>tools', 'throwaway, no keys, no internet', 'FEB 2026'],
    ['key', 'Keys kept<br>apart', 'power on separate Workers', 'APR 2026'],
    ['flag', 'Outside content<br>flagged', 'a person approves what leaves', 'AUG 2026'],
    ['book', 'Every step<br>on record', 'and searchable across runs', 'OCT 2026'],
  ];
  const SUBTITLE = "Throwaway sandboxes, keys kept apart, a person's yes when it counts, and a record of every step.";
  // the words of the subtitle that name each tile, in the order of ANSWERS
  const NAMES = ['Throwaway', 'keys', "a person's", 'a record'];
  // seconds after c[0] when each tile lands: as the subtitle names its answer, at its position at 16 characters per
  // second plus 0.3 s
  const LAND_AT = NAMES.map(name => SUBTITLE.indexOf(name) / 16 + 0.3);
  const LABEL_LINES = 2;
  // the line under each label: 18 px mono (about 11 px per character), so the longest one fits the 384 px tiles
  const MEANING_FONT = 18;
  // the stamp: how long after its tile lands it thumps on (the tile's pop has settled), the scale it drops from, the
  // time it takes to land, its tilt at rest, the jolt it gives its tile (px, whole pixels), and how far the rest of
  // the tile's content rises to make room for it (px)
  const STAMP = { after: 0.55, from: 2.4, d: 0.14, tilt: -6, jolt: 5, lift: 28 };

  // A recap tile: its icon and two-line uppercase label, then what it means in one lowercase slate line, and the
  // case-file stamp in its bottom right corner (tile.stamp), as on the case files of chapters 2 to 4
  const makeAnswerTile = (root, [icon, label, meaning, date]) => {
    const tile = iconTile(root, icon, label, USE_CASE_ROW.w, USE_CASE_ROW.h, C.ink, USE_CASE_TYPE);
    padTileLabel(tile, LABEL_LINES);
    // the icon, label and line sit a little above the tile's middle, so that with the stamp under them the tile's
    // content stays balanced
    tile.style.paddingBottom = STAMP.lift * 2 + 'px';
    tile.insertAdjacentHTML('beforeend',
      `<div class="mono" style="font-size:${MEANING_FONT}px;color:var(--slate);white-space:nowrap;`
      + `margin-top:16px">${meaning}</div>`);
    // the stamp's double rule (a border and an inset outline) matches the case file's INCIDENT stamp
    tile.stamp = E(tile, `${ICON('folder', 20, C.red, 2.2)}<span>${date}</span>`, 'mono', {
      left: 'auto', top: 'auto', right: '28px', bottom: '28px', display: 'flex', alignItems: 'center', gap: '10px',
      fontSize: '20px', lineHeight: '26px', fontWeight: 700, letterSpacing: '.14em', color: C.red,
      padding: '8px calc(16px - .14em) 8px 16px', border: `3px solid ${C.red}`, borderRadius: '6px',
      outline: `1.5px solid ${C.red}`, outlineOffset: '-7px', opacity: 0,
    });
    return tile;
  };

  scene({
    chapter: 6, title: 'What you get',
    subs: [
      {
        text: SUBTITLE,
        // the full row, stamps included, holds before the zoom-through into the outro
        after: 1.6,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.tiles = ANSWERS.map(answer => makeAnswerTile(root, answer));
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      const landAt = LAND_AT.map(at => c[0] + at);
      s.tiles.forEach((tile, i) => {
        // the tile pops into its slot, and jolts sideways as its stamp hits
        const stampAt = landAt[i] + STAMP.after;
        const pop = backPop(t, landAt[i]);
        const jolt = Math.round(dampedShake(t, stampAt + STAMP.d, STAMP.jolt, 0.3, 4));
        place(tile, useCaseX(i) + jolt, USE_CASE_ROW.y, pop.s, pop.o);

        // it stays lit until the next one lands; the last one for USE_CASE_LAST_LIT seconds
        const litUntil = i + 1 < landAt.length ? landAt[i + 1] : landAt[i] + USE_CASE_LAST_LIT;
        const lit = t >= landAt[i] && t < litUntil;
        tile.style.borderColor = lit ? C.uv : C.line;
        tile.style.boxShadow = lit ? glowShadow(RGB.uv, 1, { blur: 30, alpha: 0.5 }) : '';

        // the stamp drops onto the tile, from large to its size, as an ink stamp hits paper
        const stampLand = P(t, stampAt, STAMP.d, easeIn);
        tile.stamp.style.opacity = (0.92 * P(t, stampAt, 0.06, linear)).toFixed(3);
        tile.stamp.style.transform = `rotate(${STAMP.tilt}deg) scale(${lerp(STAMP.from, 1, stampLand).toFixed(4)})`;
      });
    }
  });
}
