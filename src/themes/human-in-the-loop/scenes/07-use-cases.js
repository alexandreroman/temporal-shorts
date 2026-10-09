// ===================== 7. WHAT YOU CAN BUILD
// The use cases the pattern fits: one tile per kind of decision, each with an example, lit as the subtitle names it.
// The block keeps every name declared in this file local to this scene.
{
  // one tile at a time while "any step where a person decides" reads, then each lights up as it is named; the
  // tiles match the recap's
  useCaseScene({
    chapter: 7,
    uses: [
      ['flag', 'Fraud reviews', 'a flagged payment waits'],
      ['idCard', 'Identity checks', 'an analyst verifies an ID'],
      ['upload', 'Deploy approvals', 'a release waits for a go'],
      ['bot', 'AI agent approvals', 'actions, tool calls'],
    ],
    // seconds after c[1] when subtitle 2 names each tile
    namedAt: [0.3, 1.25, 2.3, 3.4],
    firstAt: 1.4,
    subs: [
      {
        text: "Sam's laptop is one case: any step where a person decides fits the same pattern.",
        // the last tile lands at c[0] + 4.25, within the subtitle
      },
      {
        text: "Fraud reviews, identity checks, deploy approvals, an AI agent's tool calls: "
          + "the Workflow waits for a person.",
        // the last tile is lit until c[1] + 4.6; the full row then holds through the end of the subtitle and
        // this pause until the fade
        after: 0.6,
      },
    ],
  });
}
