// ===================== 9. WHAT YOU CAN BUILD
// What durable agents are used for: one tile per kind of agent, each with examples, lit as the subtitle names it.
// The block keeps every name declared in this file local to this scene.
{
  // one tile at a time while "any agent that works through many steps" reads, then each lights up as it is named
  useCaseScene({
    chapter: 9,
    uses: [
      ['search', 'Deep research', 'hours of reading, one report'],
      ['agentTeam', 'Multi-agent', 'a lead agent and its helpers'],
      ['bot', 'Chatbots', 'acts once a person approves'],
      ['clock', 'Background agents', 'watch for days, then act'],
    ],
    // seconds after c[1] when subtitle 2 names each tile
    namedAt: [0.3, 1.3, 2.4, 4.3],
    subs: [
      {
        text: "Lunch with Marie is one example: any agent that works through many steps needs Durable Execution.",
        // the last tile lands at c[0] + 4.45, within the subtitle
      },
      {
        text: "Deep research, multi-agent teams, chatbots with human approval, background agents: "
          + "all survive crashes.",
        // the last tile is lit until c[1] + 5.5; the full row then holds through the end of the subtitle and
        // this pause until the fade
        after: 0.6,
      },
    ],
  });
}
