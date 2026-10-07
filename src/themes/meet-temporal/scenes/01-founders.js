// ===================== 1. TWO ENGINEERS
// The block keeps every name declared in this file local to this scene.
{
  // Two columns, one per founder: the founder card, then the journey as chips joined by arrows, both journeys
  // ending on one AMAZON tile between the columns
  const COL_X = [520, 1400];
  const CARD = { y: 250, w: 480, h: 160 };
  const CHIP_Y = [440, 570];
  const CHIP_H = 66; // big pills
  const AMAZON = { x: 960, y: 790, w: 460, h: 130 };
  const AVATAR_SIZE = 104;
  const JOURNEYS = [['Soviet Union', 'Brazil'], ['Pakistan', 'Microsoft']];
  const ROLES = ['Co-founder, CTO', 'Co-founder, CEO'];
  // founder markers inside the AMAZON tile, right of its text: M, then S
  const SLOT_X = [AMAZON.x + 112, AMAZON.x + 172]; // S 34 px from the right edge
  const MARK_SIZE = 48;

  // Card of a founder: avatar on the left, name and role on the right
  function makeFounderCard(root, founder, role) {
    const card = E(root,
      `<div style="position:absolute;left:${28 + AVATAR_SIZE + 26}px;top:50%;transform:translateY(-50%);`
      + 'text-align:left">'
      + `<div class="mono" style="font-size:26px;letter-spacing:.1em;text-transform:uppercase">${founder.name}</div>`
      + `<div class="lbl" style="font-size:18px;margin-top:10px;padding-left:0">${role}</div></div>`,
      'tile', { width: CARD.w + 'px', height: CARD.h + 'px' });
    const avatar = makeAvatar(card, '', AVATAR_SIZE);
    place(avatar, 28 + AVATAR_SIZE / 2, CARD.h / 2);
    return card;
  }
  // From the bottom of chip i (or of the card, i = -1) to the top of the next chip, in column x
  const linkDown = (x, fromBottom, toTop) => `M ${x} ${fromBottom + 6} L ${x} ${toTop - 8}`;
  // From the bottom of the last chip in column x, curving into the side of the AMAZON tile
  function linkToAmazon(x) {
    const y0 = CHIP_Y[1] + CHIP_H / 2 + 6;
    const side = x < AMAZON.x ? AMAZON.x - AMAZON.w / 2 - 8 : AMAZON.x + AMAZON.w / 2 + 8;
    const bend = lerp(x, side, 0.4);
    return `M ${x} ${y0} C ${x} ${y0 + 110}, ${bend} ${AMAZON.y}, ${side} ${AMAZON.y}`;
  }

  scene({
    chapter: 1, title: 'Two engineers',
    shift: [0, 10],
    subs: [
      { text: "Meet Maxim Fateev and Samar Abbas, the two engineers who created Temporal.", after: 0.4 },
      {
        text: "Maxim grew up in the Soviet Union, studied in Brazil, then joined Amazon in Seattle in 2002.",
        after: 0.6,
      },
      { text: "Samar grew up in Pakistan, started at Microsoft, then joined Maxim's team at Amazon.", after: 0.8 },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.cards = FOUNDERS.map((f, i) => makeFounderCard(root, f, ROLES[i]));
      s.chips = JOURNEYS.map(places => places.map(text => tag(root, text, 'big')));
      s.links = COL_X.map(x => [
        path(s.svg, linkDown(x, CARD.y + CARD.h / 2, CHIP_Y[0] - CHIP_H / 2), C.slate, 2),
        path(s.svg, linkDown(x, CHIP_Y[0] + CHIP_H / 2, CHIP_Y[1] - CHIP_H / 2), C.slate, 2),
        path(s.svg, linkToAmazon(x), C.slate, 2),
      ]);
      s.amazon = E(root,
        `<div style="position:absolute;left:34px;top:50%;transform:translateY(-50%);text-align:left">`
        + '<div class="mono" style="font-size:32px;letter-spacing:.14em">AMAZON</div>'
        + '<div class="lbl" style="font-size:18px;margin-top:8px;padding-left:0">Seattle</div></div>',
        'tile', { width: AMAZON.w + 'px', height: AMAZON.h + 'px' });
      // solid: the year sits on the middle of Maxim's link to Amazon
      s.year = tag(root, '2002', 'violet solid');
      const link = s.links[0][2], mid = link.getPointAtLength(link._L / 2);
      s.yearAt = [Math.round(mid.x), Math.round(mid.y)];
      s.marks = FOUNDERS.map(f => makeFounderMark(root, f.initial, MARK_SIZE));
    },
    update(t, c, s) {
      // when each step of a journey shows: [link from the card, first chip, link, second chip, link to Amazon]
      const steps = [
        [c[1] + 0.5, c[1] + 0.8, c[1] + 1.9, c[1] + 2.2, c[1] + 3.1],
        [c[2] + 0.4, c[2] + 0.7, c[2] + 1.6, c[2] + 1.9, c[2] + 2.9],
      ];
      const amazonIn = c[1] + 3.6;
      const arrived = [c[1] + 4.3, c[2] + 3.6];

      s.cards.forEach((card, i) => {
        const p = P(t, c[0] + 0.2 + i * 0.3, 0.5, backOut);
        place(card, COL_X[i], CARD.y, p, clamp(p * 2));
      });
      COL_X.forEach((x, i) => {
        const [link0, chip0, link1, chip1, link2] = steps[i];
        draw(s.links[i][0], P(t, link0, 0.35));
        draw(s.links[i][1], P(t, link1, 0.35));
        draw(s.links[i][2], P(t, link2, 0.6));
        [chip0, chip1].forEach((at, k) => {
          const p = P(t, at, 0.45, backOut);
          place(s.chips[i][k], x, CHIP_Y[k], p, clamp(p * 2));
        });
      });

      // the AMAZON tile swells as each founder arrives
      const ap = P(t, amazonIn, 0.5, backOut);
      const swellK = swell(t, arrived[0], 0.05) * swell(t, arrived[1], 0.05);
      place(s.amazon, AMAZON.x, AMAZON.y, ap * swellK, clamp(ap * 2));
      s.amazon.style.borderColor = t >= arrived[1] ? C.violet : C.line;
      const yp = P(t, amazonIn + 0.4, 0.45, backOut);
      place(s.year, s.yearAt[0], s.yearAt[1], yp, clamp(yp * 2));
      s.marks.forEach((e, i) => {
        const p = P(t, arrived[i], 0.45, backOut);
        place(e, SLOT_X[i], AMAZON.y, p, clamp(p * 2));
      });
    }
  });
}
