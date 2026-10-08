// ===================== 9. WHAT YOU CAN BUILD
// What durable agents are used for: one tile per kind of agent, each with examples, lit as the subtitle names it.
// The block keeps every name declared in this file local to this scene.
{
  // The row of 4 use-case tiles shared by every theme (USE_CASE_ROW)
  const USES = [
    ['search', 'Deep research', 'hours of reading, one report'],
    ['agentTeam', 'Multi-agent', 'a lead agent and its helpers'],
    ['bot', 'Chatbots', 'acts once a person approves'],
    ['clock', 'Background agents', 'watch for days, then act'],
  ];
  // Seconds after c[1] when subtitle 2 names each tile; a tile stays lit until the next one is named
  const NAMED_AT = [0.3, 1.3, 2.4, 4.3];
  const LAST_LIT = 1.2;

  scene({
    chapter: 9, title: 'What you can build',
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
    build(root, s) {
      const { w, h } = USE_CASE_ROW;
      s.uses = USES.map(([icon, label, example]) => useCaseTile(root, icon, label, example, w, h));
    },
    update(t, c, s) {
      // one tile at a time while "any agent that works through many steps" reads, then each lights up as it is named
      s.uses.forEach((e, i) => {
        const p = P(t, c[0] + 1.6 + i * 0.8, 0.45, backOut);
        place(e, 960 + (i - 1.5) * USE_CASE_ROW.pitch, USE_CASE_ROW.y, p, clamp(p * 2));
        const litFrom = c[1] + NAMED_AT[i];
        const litUntil = i + 1 < NAMED_AT.length ? c[1] + NAMED_AT[i + 1] : litFrom + LAST_LIT;
        e.style.borderColor = t >= litFrom && t < litUntil ? C.uv : C.line;
      });
    }
  });
}
