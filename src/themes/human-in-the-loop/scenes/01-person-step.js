// ===================== 1. A STEP THAT NEEDS A PERSON
// The block keeps every name declared in this file local to this scene.
{
  // Three bands on the content frame, 40 px apart: the step row, a label band under APPROVAL (the approval rule,
  // then WAITING), and the people band. In the people band the clock's left edge is CHECK's left edge, the approval
  // card sits under APPROVAL, where it comes from, the reasons' right edge is NOTIFY's right edge, and Maria sits
  // halfway between the card and the reasons.
  const ROW_Y = 299, LABEL_Y = 431, BAND_Y = 654;
  const APPROVAL_X = ROW.x0 + ROW.gap;
  const CLOCK_X = FRAME.x0 + WAIT_CLOCK_W / 2;
  const WHY_W = 230, WHY_X = FRAME.x1 - WHY_W / 2;
  const MARIA_X = (APPROVAL_X + APPROVAL_CARD.w / 2 + FRAME.x1 - WHY_W) / 2;
  const AVATAR_Y = BAND_Y - AVATAR.dy; // the avatar and its label, centered on the band
  // Sam and the request card, 40 px apart, form one group centered on the frame; the request card has the size of
  // the approval card that later takes its band, so both phases fill the same box
  const CARD_H = 322;
  const SAM_LEFT = 960 - (AVATAR.size + FRAME.gap + APPROVAL_CARD.w) / 2;
  const SAM_X = SAM_LEFT + AVATAR.size / 2, REQ_X = SAM_LEFT + AVATAR.size + FRAME.gap + APPROVAL_CARD.w / 2;
  // White purchase request card, in the style of the approval card, without buttons
  const makeRequestCard = p => E(p,
    `<div class="mono" style="font-size:19px;letter-spacing:.12em;color:${C.slateDark}">PURCHASE REQUEST</div>`
    + '<div><div style="font-size:36px">New laptop for Sam</div>'
    + '<div style="font-size:65px;line-height:1.1;font-weight:700;letter-spacing:-1px">$2,400</div></div>'
    + `<div class="mono" style="display:flex;align-items:center;gap:12px;font-size:19px;`
    + `letter-spacing:.1em;color:${C.slateDark}">${ICON('user', 24, C.slateDark, 1.8)} SENT BY SAM</div>`,
    'paper', {
      width: APPROVAL_CARD.w + 'px', height: CARD_H + 'px', padding: '24px 31px 28px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '7px solid ' + C.violet,
    });
  scene({
    chapter: 1, title: 'A step that needs a person',
    // laid out in the content frame (y 150-880), centered at (960, 522): within the centering tolerance of its
    // middle, y 515
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
      s.steps = makeLaptopRow(root, s.svg, ROW_Y);
      const linkD = `M ${APPROVAL_X} ${ROW_Y + ROW.h / 2 + 2} L ${APPROVAL_X} ${LABEL_Y - 24}`;
      s.ruleLink = path(s.svg, linkD, C.violet, 2, false);
      s.rule = tag(root, 'Over $1,000: manager approval', 'violet');
      s.sam = makeAvatar(root, 'Sam', AVATAR.size, C.slate);
      s.req = makeRequestCard(root);
      s.waitL = E(root, 'Waiting', 'lbl', { color: C.violet, fontSize: '22px' });
      s.maria = makeAvatar(root, 'Maria, manager', AVATAR.size);
      s.card = makeApprovalCard(root, APPROVAL_CARD.k);
      s.clock = makeWaitClock(root, 'Waiting for Maria');
      // equal widths, so the column of reasons has straight edges
      s.why = ['In meetings', 'Traveling', 'On vacation'].map(l => fixedTag(root, l, '', WHY_W));
    },
    update(t, c, s) {
      const checkOn = c[1] + 0.6, checked = c[1] + 1.5, askOn = c[1] + 1.6, waitOn = c[1] + 4.6;
      const states = [
        t >= checked ? 2 : t >= checkOn ? 1 : 0,
        t >= waitOn ? 4 : t >= askOn ? 1 : 0,
        0, 0,
      ];
      placeLaptopRow(s.steps, t, c[0] + 0.1, states);

      // Sam's request: avatar and card under the steps, then the card enters the process at CHECK
      const out1 = P(t, c[1], 0.4);
      const sp = P(t, c[0] + 0.7, 0.5, backOut);
      place(s.sam, SAM_X, AVATAR_Y, sp, clamp(sp * 2) * (1 - out1));
      fly(s.req, t, c[0] + 1.1, REQ_X, BAND_Y, c[1] + 0.1, 0.6, ROW.x0, ROW_Y, c[1] + 0.45, ROW.x0, ROW_Y);
      const rp = P(t, c[0] + 3.8, 0.45, backOut);
      place(s.rule, APPROVAL_X, LABEL_Y, rp, clamp(rp * 2) * (1 - out1));
      draw(s.ruleLink, P(t, c[0] + 3.6, 0.3), 1 - out1);

      // the approval request flies from the APPROVAL step to Maria
      const mp = P(t, c[1] + 1.4, 0.5, backOut);
      place(s.maria, MARIA_X, AVATAR_Y, mp, clamp(mp * 2));
      fly(s.card, t, c[1] + 2.4, APPROVAL_X, ROW_Y, c[1] + 2.45, 0.9, APPROVAL_X, BAND_Y);
      place(s.waitL, APPROVAL_X, LABEL_Y, 1, P(t, waitOn, 0.4));

      // days go by: the clock spins up to DAY 3, then rests; Maria is busy
      const cp = P(t, c[2] + 0.2, 0.5, backOut);
      const spinFrom = c[2] + 1.0, spinTo = c[2] + 5.6;
      const elapsed = waitHours(t, spinFrom, spinTo, DAY3_MORNING);
      const blur = win(t, spinFrom, spinTo, 0.3);
      setWaitClock(s.clock, elapsed, blur);
      setClock(s.card.clk, REQUEST_HOUR + elapsed, blur);
      place(s.clock, CLOCK_X, BAND_Y, cp, clamp(cp * 2));
      s.why.forEach((e, i) => {
        const p = P(t, c[2] + 2.0 + i * 1.0, 0.45, backOut);
        place(e, WHY_X, BAND_Y + (i - 1) * 72, p, clamp(p * 2));
      });
    }
  });
}
