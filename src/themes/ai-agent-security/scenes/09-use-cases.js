// ===================== 9. WHAT YOU CAN BUILD
// Where the same guardrails fit: one tile per kind of agent that acts on real systems, each with an example, lit as
// the subtitle names it. The camera zoom-through (setCamera) brings the scene in from chapter 8 and plays into the
// outro.
// The block keeps every name declared in this file local to this scene.
{
  // examples stay within about 340 px (28 characters at 20 px mono), inside the 384 px tiles
  useCaseScene({
    chapter: 9,
    uses: [
      ['coin', 'Support refunds', 'refunds over $500 need a yes'],
      ['code', 'Coding agents', 'AI code runs in a sandbox'],
      ['card', 'Invoice payments', 'pays approved suppliers only'],
      ['laptop', 'IT help desks', 'account resets, keys at home'],
    ],
    // seconds after c[1] when subtitle 2 names each tile: its position at 16 characters per second, plus 0.3 s
    namedAt: [0.3, 1.36, 2.3, 3.42],
    // the first tile pops in as "any agent" is read (its position at 16 characters per second, plus 0.3 s); the last
    // one at c[0] + 5.0, within the subtitle
    firstAt: 2.6,
    // the tiles in a camera layer, for the zoom-through in and out
    camera: {},
    subs: [
      {
        text: "These incidents are real and recent: any agent that acts on real systems needs the same guardrails.",
      },
      {
        text: "Support refunds, coding agents, invoice payments, IT help desks: powerful agents, kept in check.",
        // the last tile is lit until c[1] + 4.62; the full row then holds through the end of the subtitle and
        // this pause until the fade
        after: 0.6,
      },
    ],
  });
}
