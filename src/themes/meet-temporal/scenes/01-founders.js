// ===================== 1. TWO ENGINEERS
// The block keeps every name declared in this file local to this scene.
{
  // First the photo of the founders, large, with a name under each person. Then two columns, one per founder: the
  // founder card, then the career as steps joined by arrows. Both careers end side by side, bottoms aligned, then
  // curve into one shared tile between the columns: where they met.
  const HERO = { x: 960, y: 480, w: 760, h: 560 }; // the photo at the hero's width, its bottom cropped
  const HERO_K = HERO.w / PHOTO.w;
  const HERO_LABEL_Y = HERO.y + HERO.h / 2 + 54; // 24 px under the photo
  // x of each founder in the hero photo, under the face: Samar stands on the left, Maxim on the right
  const heroX = founder => Math.round(HERO.x - HERO.w / 2 + founder.face.x * HERO_K);
  const COL_X = [520, 1400];
  const CARD = { y: 250, w: 480, h: 160 };
  const STEP = { w: 400, h: 110 };
  const STEP_Y = [455, 625]; // Maxim's two steps; Samar's single step sits on the second line
  const CAREERS = [
    [{ title: 'Amazon · 2002', caption: 'Seattle' }, { title: 'Simple Queue Service', caption: 'Tech lead · 2004' }],
    [{ title: 'Microsoft', caption: null }],
  ];
  const TEAM = { x: 960, y: 810, w: 460, h: 130 };
  const AVATAR_SIZE = 104;
  // the founders' faces inside the shared tile, right of its text: Maxim, then Samar 34 px from the right edge
  const MARK_SIZE = 56;
  const SLOT_X = [TEAM.x + TEAM.w / 2 - 34 - MARK_SIZE * 1.5 - 8, TEAM.x + TEAM.w / 2 - 34 - MARK_SIZE / 2];
  // line of each step of a career: Samar's single step lines up with Maxim's last one
  const stepY = (career, k) => STEP_Y[STEP_Y.length - career.length + k];

  // Ken Burns on the photo: it zooms in slowly around this point (in hero pixels) while the first subtitle reads
  const KB = { ox: HERO.w / 2, oy: HERO.h * 0.3, zoom: 0.07 };
  const AVATAR_AT = i => [COL_X[i] - CARD.w / 2 + 28 + AVATAR_SIZE / 2, CARD.y]; // the face in founder card i

  // The founders' photo, framed: UV border and glow, the photo itself on an inner layer (for the Ken Burns zoom), a
  // dark vignette that blends it into the stage and a band of light that sweeps across it once
  function makeHero(root) {
    const hero = E(root,
      '<div class="kb" style="position:absolute;inset:0;'
      + `background:url(&quot;${PHOTO.url}&quot;) center top / ${HERO.w}px auto no-repeat;`
      + `transform-origin:${KB.ox}px ${KB.oy}px"></div>`
      + '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%, rgba(20,20,20,0) 58%, '
      + 'rgba(20,20,20,.5) 100%), linear-gradient(180deg, rgba(20,20,20,0) 72%, rgba(20,20,20,.45) 100%)"></div>'
      + '<div class="sweep" style="position:absolute;top:-20%;bottom:-20%;left:0;width:30%;'
      + 'background:linear-gradient(100deg, rgba(248,250,252,0), rgba(248,250,252,.22), rgba(248,250,252,0))">'
      + '</div>',
      '', {
        width: HERO.w + 'px', height: HERO.h + 'px', overflow: 'hidden', borderRadius: 'var(--r)',
        border: '1.5px solid ' + C.uv, boxShadow: '0 0 60px rgba(68,76,231,.35)',
      });
    hero.kb = hero.querySelector('.kb');
    hero.sweep = hero.querySelector('.sweep');
    return hero;
  }
  // Stage point and size of a founder's face in the hero photo, zoomed by k (Ken Burns)
  function heroFace(founder, k) {
    const x = founder.face.x * HERO_K, y = founder.face.y * HERO_K;
    return {
      x: HERO.x - HERO.w / 2 + KB.ox + (x - KB.ox) * k,
      y: HERO.y - HERO.h / 2 + KB.oy + (y - KB.oy) * k,
      size: FACE_CROP * HERO_K * k,
    };
  }
  // Name and role of a founder, centered under the person in the photo
  const makeHeroLabel = (root, founder) => E(root,
    `<div class="mono" style="font-size:24px;letter-spacing:.1em;padding-left:.1em;text-transform:uppercase">`
    + `${founder.name}</div><div class="lbl" style="font-size:16px;margin-top:8px">${founder.role}</div>`,
    '', { textAlign: 'center', whiteSpace: 'nowrap' });
  // Card of a founder: the face on the left, name and role on the right
  function makeFounderCard(root, founder) {
    const card = E(root,
      `<div style="position:absolute;left:${28 + AVATAR_SIZE + 26}px;top:50%;transform:translateY(-50%);`
      + 'text-align:left">'
      + `<div class="mono" style="font-size:26px;letter-spacing:.1em;text-transform:uppercase">${founder.name}</div>`
      + `<div class="lbl" style="font-size:18px;margin-top:10px;padding-left:0">${founder.role}</div></div>`,
      'tile', { width: CARD.w + 'px', height: CARD.h + 'px' });
    card.avatar = makeFace(card, founder, AVATAR_SIZE);
    place(card.avatar, 28 + AVATAR_SIZE / 2, CARD.h / 2);
    return card;
  }
  // Career step: a title and an optional caption under it, centered
  function makeCareerStep(root, { title, caption }) {
    return E(root,
      `<div class="mono" style="font-size:26px;letter-spacing:.1em;padding-left:.1em;text-transform:uppercase">`
      + `${title}</div>${caption ? `<div class="lbl" style="font-size:18px;margin-top:10px">${caption}</div>` : ''}`,
      'tile', {
        width: STEP.w + 'px', height: STEP.h + 'px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      });
  }
  // Straight arrow down column x, between two bottom and top edges
  const linkDown = (x, fromBottom, toTop) => `M ${x} ${fromBottom + 6} L ${x} ${toTop - 8}`;
  // From the bottom of the last step in column x, curving into the side of the shared tile
  function linkToTeam(x) {
    const y0 = STEP_Y[STEP_Y.length - 1] + STEP.h / 2 + 6;
    const side = x < TEAM.x ? TEAM.x - TEAM.w / 2 - 8 : TEAM.x + TEAM.w / 2 + 8;
    const bend = lerp(x, side, 0.4);
    return `M ${x} ${y0} C ${x} ${y0 + 100}, ${bend} ${TEAM.y}, ${side} ${TEAM.y}`;
  }

  scene({
    chapter: 1, title: 'Two engineers',
    // laid out centered at (960, 522) on the free band
    subs: [
      { text: "Meet Maxim Fateev and Samar Abbas, the two engineers who created Temporal.", after: 0.4 },
      {
        text: "Maxim joined Amazon in Seattle in 2002 and became tech lead of Simple Queue Service in 2004.",
        after: 0.6,
      },
      { text: "Samar started at Microsoft, then joined Maxim's team at Amazon: that is where they met.", after: 0.8 },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.svg = svgLayer(root);
      s.hero = makeHero(root);
      s.heroLabels = FOUNDERS.map(f => makeHeroLabel(root, f));
      s.cards = FOUNDERS.map(f => makeFounderCard(root, f));
      s.steps = CAREERS.map(career => career.map(step => makeCareerStep(root, step)));
      // per column: the arrows from the card down through its steps, then the curve into the shared tile
      s.links = CAREERS.map((career, i) => {
        const tops = career.map((_, k) => stepY(career, k) - STEP.h / 2);
        const bottoms = [CARD.y + CARD.h / 2, ...career.map((_, k) => stepY(career, k) + STEP.h / 2)];
        const down = tops.map((top, k) => path(s.svg, linkDown(COL_X[i], bottoms[k], top), C.slate, 2));
        return { down, curve: path(s.svg, linkToTeam(COL_X[i]), C.slate, 2) };
      });
      s.team = E(root,
        `<div style="position:absolute;left:34px;top:50%;transform:translateY(-50%);text-align:left">`
        + '<div class="mono" style="font-size:32px;letter-spacing:.14em">SAME TEAM</div>'
        + '<div class="lbl" style="font-size:18px;margin-top:8px;padding-left:0">Amazon</div></div>',
        'tile', { width: TEAM.w + 'px', height: TEAM.h + 'px' });
      s.marks = FOUNDERS.map(f => makeFace(root, f, MARK_SIZE));
      // a spark of light runs at the head of every link as it draws
      s.sparks = s.links.flatMap(l => [...l.down, l.curve]).map(() => makeSpark(root, 12, '182,100,255'));
      // the faces that leave the photo and fly into the founder cards
      s.flyers = FOUNDERS.map(f => makeFace(root, f, AVATAR_SIZE));
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      // when each step of a career shows, its arrow drawing just before; then both careers curve into the shared
      // tile, where the founders meet
      const stepIn = [[c[1] + 1.2, c[1] + 3.4], [c[2] + 0.8]];
      const curves = c[2] + 2.4, teamIn = c[2] + 2.9;
      const arrived = [c[2] + 3.5, c[2] + 3.8];

      // the photo holds through the first subtitle, then gives way to the founder cards
      const heroOut = P(t, c[1] - 0.1, 0.4);
      const hp = P(t, c[0] + 0.1, 0.7);
      place(s.hero, HERO.x, HERO.y + (1 - hp) * 24, 1 - 0.06 * heroOut, hp * (1 - heroOut));
      const kb = 1 + KB.zoom * P(t, c[0] + 0.1, c[1] - c[0], x => x);
      s.hero.kb.style.transform = `scale(${kb})`;
      s.hero.sweep.style.transform = `translateX(${lerp(-120, 420, P(t, c[0] + 0.9, 1.3))}%) skewX(-12deg)`;

      // continuity from the photo to the cards: each face lifts off the photo in a violet ring, then flies along a
      // curve into its card (Samar, on the left in the photo, crosses over to the right card)
      const fly = [c[1] - 0.2, c[1] + 0.1];
      s.flyers.forEach((e, i) => {
        const from = heroFace(FOUNDERS[i], 1 + KB.zoom);
        const [x1, y1] = AVATAR_AT(i);
        const p = P(t, fly[1] + i * 0.12, 1.0);
        const bend = { x: (from.x + x1) / 2, y: Math.min(from.y, y1) - 140 };
        const x = lerp(lerp(from.x, bend.x, p), lerp(bend.x, x1, p), p);
        const y = lerp(lerp(from.y, bend.y, p), lerp(bend.y, y1, p), p);
        const size = lerp(from.size, AVATAR_SIZE, p);
        const o = P(t, fly[0], 0.25) * (p < 1 ? 1 : 0);
        place(e, x, y, size / AVATAR_SIZE, o);
      });
      s.heroLabels.forEach((e, i) => {
        rise(e, heroX(FOUNDERS[i]), HERO_LABEL_Y, P(t, c[0] + 0.6 + i * 0.15, 0.5) * (1 - heroOut), 12);
      });
      s.cards.forEach((card, i) => {
        const p = P(t, c[1] + 0.2 + i * 0.2, 0.5, backOut);
        place(card, COL_X[i], CARD.y, p, clamp(p * 2));
        card.avatar.style.opacity = t >= fly[1] + i * 0.12 + 1.0 ? 1 : 0;
      });
      let spark = 0;
      CAREERS.forEach((career, i) => {
        career.forEach((_, k) => {
          const at = stepIn[i][k];
          const prog = P(t, at - 0.35, 0.35);
          draw(s.links[i].down[k], prog);
          sparkOnPath(s.sparks[spark++], s.links[i].down[k], prog);
          const p = P(t, at, 0.45, backOut);
          place(s.steps[i][k], COL_X[i], stepY(career, k), p, clamp(p * 2));
        });
        const prog = P(t, curves, 0.6);
        draw(s.links[i].curve, prog);
        sparkOnPath(s.sparks[spark++], s.links[i].curve, prog);
      });

      // the shared tile swells as each founder arrives, and turns violet once both are in
      const tp = P(t, teamIn, 0.5, backOut);
      const swellK = swell(t, arrived[0], 0.05) * swell(t, arrived[1], 0.05);
      place(s.team, TEAM.x, TEAM.y, tp * swellK, clamp(tp * 2));
      s.team.style.borderColor = t >= arrived[1] ? C.violet : C.line;
      s.marks.forEach((e, i) => {
        const p = P(t, arrived[i], 0.45, backOut);
        place(e, SLOT_X[i], TEAM.y, p, clamp(p * 2));
      });
    }
  });
}
