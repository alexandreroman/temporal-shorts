// ===================== 1. 20 YEARS IN THE MAKING
// The block keeps every name declared in this file local to this scene.
{
  // First the founders' photo, large; then, as in the deck, the photo settles top left next to the heading, and a
  // horizontal timeline runs below: five milestones across the free band, each with its year above and its tile
  // below. The founders' faces lift off the photo and ride the line from one milestone to the next.
  const LINE = { x0: 120, x1: 1800, y: 500 };
  const TILE = { top: 560, w: 300, h: 300, gap: 45 }; // five tiles span the band, 45 px apart
  const NODE_X = [0, 1, 2, 3, 4].map(i => LINE.x0 + TILE.w / 2 + i * (TILE.w + TILE.gap));
  const TILE_Y = TILE.top + TILE.h / 2;
  const YEAR_Y = LINE.y - 70; // 18 px above the founders' faces
  const MARK_SIZE = 56;
  const MARK_DX = [-32, 32]; // Maxim left of the milestone, Samar right of it, 8 px apart
  // the photo: large and centered first (HERO), then compact at the top left (PHOTO_AT, scale PHOTO_K)
  const HERO = { x: 960, y: 470, w: 760, h: 560 };
  const HERO_K = HERO.w / PHOTO.w;
  const HERO_LABEL_Y = HERO.y + HERO.h / 2 + 54; // 24 px under the photo
  const PHOTO_K = 0.36;
  const PHOTO_AT = { x: Math.round(LINE.x0 + HERO.w * PHOTO_K / 2), y: Math.round(180 + HERO.h * PHOTO_K / 2) };
  // the heading, then the odometer, left-aligned 40 px right of the compact photo and centered on it
  const HEADING = { left: Math.round(LINE.x0 + HERO.w * PHOTO_K + 40), w: 660, odometerW: 130, gap: 24 };
  // Ken Burns on the photo: it zooms in slowly around this point (in hero pixels) while it is large
  const KB = { ox: HERO.w / 2, oy: HERO.h * 0.3, zoom: 0.07 };
  // company (null for the Temporal logo), name, detail and year of each milestone
  const MILESTONES = [
    { company: 'Amazon', name: 'Simple Queue<br>Service', detail: 'Tech lead: Maxim', year: '2004' },
    { company: 'Amazon', name: 'Simple Workflow<br>Service', detail: 'Long-running processes', year: '2009' },
    { company: 'Microsoft', name: 'Durable Task<br>Framework', detail: 'Azure Durable Functions', year: '2014' },
    { company: 'Uber', name: 'Cadence', detail: 'Open source, Uber Eats', year: '2015' },
    { company: null, name: null, detail: 'Open source, MIT license', year: '2019' },
  ];
  const LAST = MILESTONES.length - 1;
  const YEARS = MILESTONES.map(m => Number(m.year));
  const TRAIL = [0.06, 0.12, 0.18]; // how far each ghost of a travelling face lags behind it, in seconds
  const DIGIT_H = 52; // height of one digit of the year odometer

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
  // Name and role of a founder, centered under the person in the photo
  const makeHeroLabel = (root, founder) => E(root,
    `<div class="mono" style="font-size:24px;letter-spacing:.1em;padding-left:.1em;text-transform:uppercase">`
    + `${founder.name}</div><div class="lbl" style="font-size:16px;margin-top:8px">${founder.role}</div>`,
    '', { textAlign: 'center', whiteSpace: 'nowrap' });
  // Stage point and size of a founder's face in the photo, the photo centered on (x, y) at scale k, zoomed by kb
  function photoFace(founder, x, y, k, kb) {
    const fx = founder.face.x * HERO_K, fy = founder.face.y * HERO_K;
    return {
      x: x + (KB.ox + (fx - KB.ox) * kb - HERO.w / 2) * k,
      y: y + (KB.oy + (fy - KB.oy) * kb - HERO.h / 2) * k,
      size: FACE_CROP * HERO_K * kb * k,
    };
  }

  // Year odometer: four digit columns (0 to 9, then 0 again for the wrap) behind a window one digit high
  function makeOdometer(root) {
    const column = '<div class="col" style="display:flex;flex-direction:column">'
      + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => `<span style="height:${DIGIT_H}px;line-height:${DIGIT_H}px">${d}`
        + '</span>').join('') + '</div>';
    const e = E(root, `<div style="display:flex;height:${DIGIT_H}px;overflow:hidden">${column.repeat(4)}</div>`,
      'mono', { fontSize: '44px', color: C.ink, letterSpacing: '.04em' });
    e.cols = [...e.querySelectorAll('.col')];
    return e;
  }
  // Rolls the odometer to a (fractional) year: each digit turns as the one to its right wraps from 9 to 0
  function setOdometer(e, year) {
    e.cols.forEach((col, i) => {
      const unit = Math.pow(10, 3 - i);
      const lower = year % unit;
      const position = Math.floor(year / unit) % 10 + Math.max(0, lower - (unit - 1));
      col.style.transform = `translateY(${-Math.round(position * DIGIT_H * 100) / 100}px)`;
    });
  }
  // Year at a point of the line: linear between the milestones' years
  function yearAt(x) {
    if (x <= NODE_X[0]) return YEARS[0];
    for (let k = 1; k < NODE_X.length; k++) {
      if (x <= NODE_X[k]) return lerp(YEARS[k - 1], YEARS[k], (x - NODE_X[k - 1]) / (NODE_X[k] - NODE_X[k - 1]));
    }
    return YEARS[LAST];
  }

  // Milestone tile: company on top, name in a two-line box (or the official logo), a rule, the detail at the bottom
  function makeMilestone(root, { company, name, detail }) {
    const head = `<div class="lbl" style="font-size:17px">${company ?? 'Their own company'}</div>`;
    const body = name
      ? `<div style="font-size:32px;line-height:1.12;letter-spacing:-.5px">${name}</div>`
      : `<img src="${LOGO}" style="height:52px;display:block">`;
    return E(root,
      `<div style="position:absolute;left:0;right:0;top:32px">${head}</div>`
      + '<div style="position:absolute;left:16px;right:16px;top:72px;height:96px;display:flex;align-items:center;'
      + `justify-content:center">${body}</div>`
      + `<div style="position:absolute;left:32px;right:32px;top:204px;border-top:1.5px solid ${C.line}"></div>`
      + `<div class="lbl" style="position:absolute;left:0;right:0;top:234px;font-size:15px;color:var(--ink)">`
      + `${detail}</div>`,
      'tile', { width: TILE.w + 'px', height: TILE.h + 'px' });
  }

  scene({
    chapter: 1, title: '20 years in the making',
    // laid out centered at (960, 522) on the free band
    subs: [
      {
        text: "Meet Maxim Fateev and Samar Abbas. In 2004, Maxim was tech lead of Simple Queue Service at Amazon.",
        after: 0.4,
      },
      {
        text: "In 2009 at Amazon, they led the launch of Simple Workflow Service, to run long processes reliably.",
        after: 0.4,
      },
      {
        text: "In 2014 at Microsoft, Samar co-created the Durable Task Framework, the base of Azure Durable Functions.",
        after: 0.4,
      },
      {
        text: "In 2015, both reunited at Uber to create Cadence. Open source since 2017, it ran Uber Eats orders.",
        after: 0.4,
      },
      {
        text: "In October 2019, they left Uber to found Temporal: Cadence's successor, open source under MIT.",
        after: 1.0,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // Temporal's arrival: a bloom of light behind its tile (under everything else)
      s.bloom = E(root, '', '', {
        width: '700px', height: '700px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(182,100,255,.45) 0%, rgba(68,76,231,.18) 40%, rgba(68,76,231,0) 70%)',
      });
      s.heading = E(root, '20 years in the making', 'lbl', {
        fontSize: '40px', color: 'var(--violet)', width: HEADING.w + 'px', textAlign: 'left', paddingLeft: 0,
      });
      s.odometer = makeOdometer(root);
      s.odometer.style.width = HEADING.odometerW + 'px';
      s.svg = svgLayer(root);
      s.line = path(s.svg, `M ${LINE.x0} ${LINE.y} L ${LINE.x1} ${LINE.y}`, C.line, 3, false);
      // the part of the line the founders have travelled, violet to UV
      s.progress = E(root, '', '', {
        height: '3px', top: (LINE.y - 1.5) + 'px', left: LINE.x0 + 'px', borderRadius: '2px',
        background: `linear-gradient(90deg, ${C.violet}, ${C.uv})`,
      });
      s.ticks = NODE_X.map(x => path(s.svg, `M ${x} ${LINE.y + 12} L ${x} ${TILE.top - 2}`, C.line, 2, false));
      s.nodes = NODE_X.map(() => E(root, '', '', {
        width: '16px', height: '16px', borderRadius: '50%', border: '2px solid ' + C.slate, background: '#141414',
      }));
      s.years = MILESTONES.map(m => E(root, m.year, 'mono', {
        fontSize: '30px', lineHeight: '40px', letterSpacing: '.06em',
      }));
      s.years[LAST].style.color = C.violet;
      s.tiles = MILESTONES.map(m => makeMilestone(root, m));
      // Temporal stands out: UV border, a UV tint and a soft glow
      Object.assign(s.tiles[LAST].style, {
        borderColor: C.uv, background: '#1D1E3A', boxShadow: '0 0 48px rgba(68,76,231,.35)',
      });
      s.ripples = makeRipples(root, 3, '182,100,255');
      s.hero = makeHero(root);
      s.heroLabels = FOUNDERS.map(f => makeHeroLabel(root, f));
      // faint violet discs trailing each face while it travels; the faces fly over everything
      s.ghosts = FOUNDERS.map(() => TRAIL.map(() => E(root, '', '', {
        width: MARK_SIZE + 'px', height: MARK_SIZE + 'px', borderRadius: '50%', background: C.violet,
      })));
      s.marks = FOUNDERS.map(f => makeFace(root, f, MARK_SIZE));
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);
      // the photo: large, zooming in slowly with a band of light across it, then it settles at the top left
      const kbAt = at => 1 + KB.zoom * P(at, 0.1, c[0] + 2.3, x => x);
      const settle = P(t, c[0] + 2.4, 1.0);
      const heroK = lerp(1, PHOTO_K, settle);
      const heroX = lerp(HERO.x, PHOTO_AT.x, settle), heroY = lerp(HERO.y, PHOTO_AT.y, settle);
      const hp = P(t, 0.1, 0.7);
      place(s.hero, heroX, heroY + (1 - hp) * 24, heroK, hp);
      s.hero.kb.style.transform = `scale(${kbAt(t)})`;
      s.hero.sweep.style.transform = `translateX(${lerp(-120, 420, P(t, c[0] + 0.8, 1.3))}%) skewX(-12deg)`;
      s.heroLabels.forEach((e, i) => {
        const face = photoFace(FOUNDERS[i], HERO.x, HERO.y, 1, 1);
        rise(e, Math.round(face.x), HERO_LABEL_Y, P(t, c[0] + 0.6 + i * 0.15, 0.5) * (1 - P(t, c[0] + 2.1, 0.3)), 12);
      });

      // when each milestone lights up: Simple Queue Service once the timeline is in, the others as the founders
      // reach them, then their tile rises
      const tileIn = [c[0] + 3.8, c[1] + 1.3, c[2] + 1.3, c[3] + 1.8, c[4] + 1.8];
      // each founder: the face lifts off the photo (a violet ring) at `lift`, flies from `from` (the face in the
      // photo then) to its first milestone during [fly, fly + 1], then travels the line ([at, milestone]).
      // Maxim lifts off the large photo onto 2004; Samar off the compact photo onto 2009.
      const founders = [
        {
          lift: c[0] + 1.9, fly: c[0] + 2.2, first: 0,
          from: photoFace(FOUNDERS[0], HERO.x, HERO.y, 1, kbAt(c[0] + 2.2)),
          // down from the large photo first, then left along the line, away from the photo settling top left
          bend: from => [from.x, LINE.y - 20],
          route: [[c[1] + 0.3, 1], [c[3] + 0.5, 3], [c[4] + 0.6, 4]],
        },
        {
          lift: c[1] + 0.2, fly: c[1] + 0.5, first: 1, from: photoFace(FOUNDERS[1], PHOTO_AT.x, PHOTO_AT.y, PHOTO_K,
            kbAt(c[1])),
          route: [[c[2] + 0.3, 2], [c[3] + 0.5, 3], [c[4] + 0.6, 4]],
          // down and right under the heading, then down onto 2009: it never crosses the heading
          bend: () => [NODE_X[1] + MARK_DX[1], 460],
        },
      ];
      // where a face is at a time, and its size
      const facePos = (i, at) => {
        const { fly, first, from, route, bend: bendOf } = founders[i];
        const landing = [NODE_X[first] + MARK_DX[i], LINE.y];
        if (at < fly + 1) {
          const p = ease(clamp(at - fly));
          const bend = bendOf(from);
          return {
            x: lerp(lerp(from.x, bend[0], p), lerp(bend[0], landing[0], p), p),
            y: lerp(lerp(from.y, bend[1], p), lerp(bend[1], landing[1], p), p),
            size: lerp(from.size, MARK_SIZE, p),
          };
        }
        const stops = route.map(([when, k]) => [when, NODE_X[k] + MARK_DX[i], LINE.y]);
        return { x: pan(at, landing, stops, 1.1)[0], y: LINE.y, size: MARK_SIZE };
      };
      const marks = founders.map((_, i) => facePos(i, t));

      // the timeline comes in as the photo settles: the line, the nodes, the heading and its odometer, which rolls
      // with Maxim until Samar joins, then with the founder furthest along
      const timelineIn = c[0] + 2.6;
      const headingIn = P(t, c[0] + 3.0, 0.6);
      rise(s.heading, HEADING.left + HEADING.w / 2, PHOTO_AT.y, headingIn, 12);
      rise(s.odometer, HEADING.left + HEADING.w + HEADING.gap + HEADING.odometerW / 2, PHOTO_AT.y, headingIn, 12);
      const onLine = i => (t >= founders[i].fly + 1 ? marks[i].x - MARK_DX[i] : NODE_X[0]);
      const front = t < c[2] ? onLine(0) : Math.max(onLine(0), onLine(1));
      setOdometer(s.odometer, yearAt(front));
      draw(s.line, P(t, timelineIn, 0.8));
      // the travelled part reaches the founder furthest along
      s.progress.style.width = Math.round(Math.max(onLine(0) + MARK_DX[0], onLine(1)) - LINE.x0) + 'px';
      s.progress.style.opacity = P(t, founders[0].fly + 1, 0.4);

      s.marks.forEach((e, i) => {
        const { lift } = founders[i];
        const m = marks[i];
        place(e, Math.round(m.x), Math.round(m.y), m.size / MARK_SIZE, P(t, lift, 0.25));
        // the trail shows with the speed of the face
        const before = facePos(i, t - 0.1);
        const speed = t > lift ? clamp(Math.hypot(m.x - before.x, m.y - before.y) / 30) : 0;
        s.ghosts[i].forEach((g, k) => {
          const ghost = facePos(i, t - TRAIL[k]);
          place(g, ghost.x, ghost.y, ghost.size / MARK_SIZE * (1 - 0.15 * (k + 1)), speed * (0.35 - 0.1 * k));
        });
      });
      // Temporal arrives: bloom and ripples around its tile
      const arrive = tileIn[LAST];
      const tileCenter = [NODE_X[LAST], TILE_Y];
      place(s.bloom, ...tileCenter, 0.6 + 0.5 * P(t, arrive, 0.8), win(t, arrive, arrive + 2.0, 0.3) * 0.9
        + P(t, arrive + 2.0, 0.6) * 0.35);
      placeRipples(s.ripples, t, arrive + 0.2, ...tileCenter, 320, 560, 1.4);
      NODE_X.forEach((x, k) => {
        const lit = t >= tileIn[k] - 0.4;
        s.nodes[k].style.background = lit ? C.violet : '#141414';
        s.nodes[k].style.borderColor = lit ? C.violet : C.slate;
        place(s.nodes[k], x, LINE.y, swell(t, tileIn[k] - 0.4, 0.4), P(t, timelineIn + 0.2 + k * 0.12, 0.3));
        draw(s.ticks[k], P(t, tileIn[k] - 0.2, 0.3));
        rise(s.tiles[k], x, TILE_Y, P(t, tileIn[k], 0.6));
        rise(s.years[k], x, YEAR_Y, P(t, tileIn[k] + 0.1, 0.5), 12);
      });
    }
  });
}
