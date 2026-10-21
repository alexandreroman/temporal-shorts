// ===================== 8. WHAT YOU GET
// The recap: one tile per guardrail of chapters 2 to 7, in a 3 x 2 grid. Each tile lands as the subtitle names its
// guardrail: it drops onto the stage from in front of the camera, and its border lights up (UV, with a soft glow)
// until the next one lands. The camera zoom-through (setCamera) brings the scene in and plays into chapter 9.
// The block keeps every name declared in this file local to this scene.
{
  // [icon, label, what it means] of each tile, in reading order: left to right, then top to bottom
  const GUARDRAILS = [
    ['shield', 'Rules in code', 'checked before every step'],
    ['user', 'A person says yes', "for steps that can't be undone"],
    ['key', 'Keys stay home', 'on your Workers, never in the model'],
    ['sandbox', 'Sandboxed work', 'risky code in a sealed box'],
    ['stop', 'A real stop', 'cancel, then undo'],
    ['book', 'Every step on record', 'the full story, in order'],
  ];
  // the grid: tiles of w x h px, gap px apart both ways, filling x 120-1800 and centered on (960, 515) (y 195-835)
  const GRID = { w: 528, h: 296, gap: 48 };
  // the tiles' type: the use cases' label size (USE_CASE_TYPE) with a smaller icon, which fits the shorter tiles
  const TILE_TYPE = { size: 80, stroke: 1.6, font: 26, gap: 24 };
  // seconds after c[0] when each tile lands: as the subtitle names its guardrail, at its position at 16 characters
  // per second plus 0.3 s; the first one 0.05 s later, so that its drop starts at c[0]
  const LAND_AT = [0.35, 1.24, 2.24, 3.11, 3.8, 4.8];
  // the drop: the tile falls from DROP.scale to its resting size over DROP.d seconds, ending as it lands, and fades
  // in over the first `fade` of it; at DROP.scale it still clears its neighbors, which sit GRID.gap px away
  const DROP = { scale: 1.15, d: 0.35, fade: 0.6 };
  // seconds the last tile stays lit (each other one stays lit until the next one lands)
  const LAST_LIT = 1.2;

  // The center [x, y] of tile i of the grid (3 columns, 2 rows)
  const gridSlot = i => {
    const col = i % 3, row = Math.floor(i / 3);
    return [960 + (col - 1) * (GRID.w + GRID.gap), 515 + (row - 0.5) * (GRID.h + GRID.gap)];
  };
  // A recap tile: its icon and uppercase label (iconTile), then what the guardrail means in one lowercase slate line
  const makeGuardrailTile = (root, [icon, label, meaning]) => {
    const tile = iconTile(root, icon, label, GRID.w, GRID.h, C.ink, TILE_TYPE);
    tile.insertAdjacentHTML('beforeend',
      '<div class="mono" style="font-size:20px;color:var(--slate);white-space:nowrap;margin-top:16px">'
      + `${meaning}</div>`);
    return tile;
  };

  scene({
    chapter: 8, title: 'What you get',
    subs: [
      {
        text: "Rules in code, a person's yes, keys at home, sandboxes, a real stop and a full record.",
        // the last tile is lit until c[0] + 6.0; the full grid then holds about 0.9 s before the fade
        after: 1.0,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.tiles = GUARDRAILS.map(guardrail => makeGuardrailTile(root, guardrail));
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      s.tiles.forEach((tile, i) => {
        const [x, y] = gridSlot(i);
        const landAt = c[0] + LAND_AT[i];
        const fall = P(t, landAt - DROP.d, DROP.d, easeIn);
        const opacity = P(t, landAt - DROP.d, DROP.d * DROP.fade, linear);
        // exactly 1 once landed, so the tile rests on whole pixels
        place(tile, x, y, 1 + (DROP.scale - 1) * (1 - fall), opacity);
        const litUntil = i + 1 < LAND_AT.length ? c[0] + LAND_AT[i + 1] : landAt + LAST_LIT;
        const lit = t >= landAt && t < litUntil;
        tile.style.borderColor = lit ? C.uv : C.line;
        tile.style.boxShadow = lit ? glowShadow(RGB.uv, 1, { blur: 30, alpha: 0.5 }) : '';
      });
    }
  });
}
