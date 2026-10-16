// ===================== 12. WHAT YOU CAN BUILD
// What else the same protection fits: one tile per kind of sensitive data, each with an example, lit as the subtitle
// names it. Opens on chapter 11's last frame, the recap tiles at rest with their padlocks shut (a match cut), and flips
// them over in 3D, one at a time and in the same slots, into the use cases. The default fade-out plays the camera
// zoom-through (setCamera) into the outro.
// The block keeps every name declared in this file local to this scene.
{
  useCaseScene({
    chapter: 12,
    uses: [
      ['medical', 'Health claims', 'a diagnosis stays sealed'],
      ['idCard', 'KYC onboarding', 'passport scans, encrypted'],
      ['cal', 'Payroll runs', 'salaries never in clear'],
      ['bot', 'AI agents on<br>customer data', 'prompts and replies sealed'],
    ],
    // seconds after c[1] when subtitle 2 names each tile: its position at 16 characters per second, plus 0.3 s
    namedAt: [0.3, 1.24, 2.24, 3.11],
    // the first tile flips as "any Workflow" is read
    firstAt: 2.0,
    // the last label takes two lines: every label gets the room of two, so the icons stay aligned
    labelLines: TILE_LABEL_LINES,
    front: (root, i) => {
      const tile = makeRecapTile(root, BENEFITS[i]);
      setRecapTile(tile, { seal: 1 });
      return tile;
    },
    // no zoom in, for the match cut, and chapter 11's row offset (RECAP_DY); the exit zoom plays with the fade-out
    camera: { enter: 1, dy: RECAP_DY },
    fadeIn: 0,
    subs: [
      {
        text: 'A bank transfer is one example: any Workflow that handles sensitive data fits.',
        // the last tile has flipped by c[0] + 5.1, within the subtitle
      },
      {
        text: 'Health claims, KYC onboarding, payroll runs, AI agents on customer data: the data stays yours.',
        // the last tile is lit until c[1] + 4.31; the full row then holds through the end of the subtitle and
        // this pause until the fade
        after: 0.6,
      },
    ],
  });
}
