// ===================== 9. WHAT YOU CAN BUILD
// Where the same guardrails fit: one tile per kind of agent that acts on real systems, each with an example, lit as
// the subtitle names it.
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
