// ===================== 6. WHAT YOU GET
// The recap, the last chapter before the outro: one tile per answer of chapters 2 to 5, on the row of USE_CASE_ROW.
// Each tile pops in as the subtitle names its answer, and its border lights up (UV) until the next one lands. The
// camera zoom-through (setCamera) brings the scene in and plays into the outro.
// The block keeps every name declared in this file local to this scene.
{
  // [icon, label, what it means] of each tile, left to right; every label takes two lines, so the icons and the
  // lines under the labels stay aligned across the row
  const ANSWERS = [
    ['sandbox', 'Sandboxed<br>tools', 'throwaway, no keys, no internet'],
    ['key', 'Keys kept<br>apart', 'power on separate Workers'],
    ['flag', 'Outside content<br>flagged', 'a person approves what leaves'],
    ['book', 'Every step<br>on record', 'and searchable across runs'],
  ];
  const LABEL_LINES = 2;
  // the line under each label: 18 px mono (about 11 px per character), so the longest one fits the 384 px tiles
  const MEANING_FONT = 18;
  // seconds after c[0] when each tile lands: as the subtitle names its answer, at its position at 16 characters per
  // second plus 0.3 s
  const LAND_AT = [0.3, 1.6, 2.7, 4.85];

  // A recap tile: its icon and two-line uppercase label, then what it means in one lowercase slate line
  const makeAnswerTile = (root, [icon, label, meaning]) => {
    const tile = iconTile(root, icon, label, USE_CASE_ROW.w, USE_CASE_ROW.h, C.ink, USE_CASE_TYPE);
    padTileLabel(tile, LABEL_LINES);
    tile.insertAdjacentHTML('beforeend',
      `<div class="mono" style="font-size:${MEANING_FONT}px;color:var(--slate);white-space:nowrap;`
      + `margin-top:16px">${meaning}</div>`);
    return tile;
  };

  scene({
    chapter: 6, title: 'What you get',
    subs: [
      {
        text: "Throwaway sandboxes, keys kept apart, a person's yes when it counts, and a record of every step.",
        // the full row holds before the zoom-through into the outro
        after: 1.0,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.tiles = ANSWERS.map(answer => makeAnswerTile(root, answer));
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      const landAt = LAND_AT.map(at => c[0] + at);
      placeRecapRow(s.tiles, t, landAt, USE_CASE_ROW.y);
      // each tile stays lit until the next one lands; the last one for USE_CASE_LAST_LIT seconds
      s.tiles.forEach((tile, i) => {
        const litUntil = i + 1 < landAt.length ? landAt[i + 1] : landAt[i] + USE_CASE_LAST_LIT;
        const lit = t >= landAt[i] && t < litUntil;
        tile.style.borderColor = lit ? C.uv : C.line;
        tile.style.boxShadow = lit ? glowShadow(RGB.uv, 1, { blur: 30, alpha: 0.5 }) : '';
      });
    }
  });
}
