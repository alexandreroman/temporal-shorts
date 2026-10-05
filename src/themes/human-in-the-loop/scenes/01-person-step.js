// ===================== 1. A STEP THAT NEEDS A PERSON
// The block keeps every name declared in this file local to this scene.
{
  const ROW_Y = 380;
  // where the approval request lands, next to Maria
  const CARD = { x: 900, y: 640 };
  const MARIA = { x: 1220, y: 620 };
  scene({
    chapter: 1, title: 'A step that needs a person',
    // one fixed offset fits both Sam's request under the steps and the approval phase
    shift: [0, -8],
    subs: [
      {
        text: "Take a simple process: Sam orders a new laptop for $2,400. Above $1,000, a manager must approve it.",
        after: 1.0,
      },
      {
        text: "The app checks the request, then asks Maria, the manager, to approve it. Now it waits for an answer.",
        after: 1.4,
      },
      {
        text: "Maria may answer in two minutes, or in three days: busy in meetings, traveling, or on vacation.",
        after: 1.6,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.steps = makeStepRow(root, s.svg, ROW_Y);
      s.ruleLink = path(s.svg, `M 795 ${ROW_Y + 54} L 795 ${ROW_Y + 86}`, C.violet, 2, false);
      s.rule = tag(root, 'Over $1,000: manager approval', 'violet');
      s.sam = makeAvatar(root, 'Sam', 96, C.slate);
      s.req = makeCard(root, 'New laptop, $2,400', 'user', 'PURCHASE REQUEST');
      s.waitL = E(root, 'Waiting', 'lbl', { color: C.violet });
      s.maria = makeAvatar(root, 'Maria, manager');
      s.card = makeApprovalCard(root);
      s.clock = makeWaitClock(root, 'Waiting for Maria');
      s.why = ['In meetings', 'Traveling', 'On vacation'].map(l => tag(root, l));
    },
    update(t, c, s) {
      const checkOn = c[1] + 0.6, checked = c[1] + 1.5, askOn = c[1] + 1.6, waitOn = c[1] + 4.6;
      const states = [
        t >= checked ? 2 : t >= checkOn ? 1 : 0,
        t >= waitOn ? 4 : t >= askOn ? 1 : 0,
        0, 0,
      ];
      placeStepRow(s.steps, t, c[0] + 0.1, states);

      // Sam's request: avatar and card under the steps, then the card enters the process at CHECK
      const out1 = P(t, c[1], 0.4);
      const sp = P(t, c[0] + 0.7, 0.5, backOut);
      place(s.sam, 760, 640, sp, clamp(sp * 2) * (1 - out1));
      fly(s.req, t, c[0] + 1.1, 1040, 640, c[1] + 0.1, 0.6, ROW.x0, ROW_Y, c[1] + 0.45, ROW.x0, ROW_Y);
      const rp = P(t, c[0] + 3.8, 0.45, backOut);
      place(s.rule, 795, ROW_Y + 110, rp, clamp(rp * 2) * (1 - out1));
      draw(s.ruleLink, P(t, c[0] + 3.6, 0.3), 1 - out1);

      // the approval request flies from the APPROVAL step to Maria
      const mp = P(t, c[1] + 1.4, 0.5, backOut);
      place(s.maria, MARIA.x, MARIA.y, mp, clamp(mp * 2));
      fly(s.card, t, c[1] + 2.4, s.steps.xs[1], ROW_Y, c[1] + 2.45, 0.9, CARD.x, CARD.y);
      place(s.waitL, s.steps.xs[1], ROW_Y + 82, 1, P(t, waitOn, 0.4));

      // days go by: the clock spins up to DAY 3, then ticks on at an idle pace; Maria is busy
      const cp = P(t, c[2] + 0.2, 0.5, backOut);
      const spinFrom = c[2] + 1.0, spinTo = c[2] + 5.6;
      const elapsed = waitHours(t, spinFrom, spinTo, DAY3_MORNING / (spinTo - spinFrom));
      const blur = win(t, spinFrom, spinTo, 0.3);
      setWaitClock(s.clock, elapsed, blur);
      setClock(s.card.clk, REQUEST_HOUR + elapsed, blur);
      place(s.clock, 490, 630, cp, clamp(cp * 2));
      s.why.forEach((e, i) => {
        const p = P(t, c[2] + 2.0 + i * 1.0, 0.45, backOut);
        place(e, 1500, 560 + i * 70, p, clamp(p * 2));
      });
    }
  });
}
