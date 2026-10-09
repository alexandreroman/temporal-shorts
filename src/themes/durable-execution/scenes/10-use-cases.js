// ===================== 10. WHAT YOU CAN BUILD
// What Workflows are used for: one tile per use case, each with an example, lit as the subtitle names it.
// The block keeps every name declared in this file local to this scene.
{
  // one tile at a time while "any process that must run to the end" reads, then each lights up as it is named
  useCaseScene({
    chapter: 10,
    uses: [
      ['coin', 'Money transfers', 'debit, credit, never twice'],
      ['cal', 'Subscriptions', 'bill every month, for years'],
      ['table', 'Data pipelines', 'a nightly batch resumes'],
      ['bot', 'AI agents', 'a long task survives crashes'],
    ],
    // seconds after c[1] when subtitle 2 names each tile
    namedAt: [0.3, 1.35, 2.3, 3.3],
    subs: [
      {
        text: "Order #1042 is one example: any process that must run to the end fits a Workflow.",
        // the last tile lands at c[0] + 4.45, within the subtitle
      },
      {
        text: "Money transfers, subscriptions, data pipelines, AI agents: "
          + "a crash never leaves any of them half done.",
        // the last tile is lit until c[1] + 4.5; the full row then holds through the end of the subtitle and
        // this pause until the fade
        after: 0.6,
      },
    ],
  });
}
