// ===================== 1. WHERE IT COMES FROM
// The block keeps every name declared in this file local to this scene.
{
  // The chapter opens on its heading, very large in the middle; it shrinks up to the top. The founders' faces
  // appear with their names, then fly onto a horizontal timeline: five milestones across the free band, each with
  // its year above and its tile below. The faces ride the line from one milestone to the next.
  const LINE = { x0: 120, x1: 1800, y: 500 };
  const TILE = { top: 560, w: 300, h: 300, gap: 45 }; // five tiles span the band, 45 px apart
  const NODE_X = [0, 1, 2, 3, 4].map(i => LINE.x0 + TILE.w / 2 + i * (TILE.w + TILE.gap));
  const TILE_Y = TILE.top + TILE.h / 2;
  const YEAR_Y = LINE.y - 70; // 18 px above the founders' faces
  const MARK_SIZE = 56;
  // a face alone sits centered on its milestone; two faces together sit either side of it (Maxim left, Samar
  // right), 44 px apart, so the milestone's dot shows isolated between them
  const PAIR_DX = MARK_SIZE / 2 + 22;
  const PAIR_SIDE = [-1, 1];
  const PAIR_RANGE = 160; // how close (px) the faces must be to start making room for each other
  // the heading: large in the middle first, then at the top of the composition
  const HEADING = { big: { y: 322, font: 140 }, top: { y: 228, font: 64 } };
  // while only the heading and the founders show, the composition sits this much lower, centered on the stage;
  // it rises into place as the timeline draws in
  const INTRO_DY = 200;
  // the founders' introduction, between the heading and the line: each face with its name and role beside it, on
  // the outer side (Maxim's on the left, Samar's on the right)
  const INTRO = { y: 380, size: 140, x: [760, 1160] };
  const NAME = { w: 340, gap: 24 };
  const nameX = i => INTRO.x[i] + (i === 0 ? -1 : 1) * (INTRO.size / 2 + NAME.gap + NAME.w / 2);
  // company (null for the Temporal logo), name, detail and year of each milestone
  const MILESTONES = [
    { company: 'Amazon', name: 'Simple Queue<br>Service', detail: 'Tech lead: Maxim', year: '2004' },
    { company: 'Amazon', name: 'Simple Workflow<br>Service', detail: 'Long-running processes', year: '2009' },
    { company: 'Microsoft', name: 'Durable Task<br>Framework', detail: 'Azure Durable Functions', year: '2014' },
    { company: 'Uber', name: 'Cadence', detail: 'Open source, Uber Eats', year: '2015' },
    { company: null, name: null, detail: 'Open source, MIT license', year: '2019' },
  ];
  const LAST = MILESTONES.length - 1;
  const TRAIL = [0.06, 0.12, 0.18]; // how far each ghost of a travelling face lags behind it, in seconds

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
  // Name and role of a founder, aligned toward the face (align: 'right' or 'left')
  const makeNameLabel = (root, founder, align) => E(root,
    `<div class="mono" style="font-size:24px;letter-spacing:.1em;text-transform:uppercase">`
    + `${founder.name}</div>`
    + `<div class="lbl" style="font-size:16px;margin-top:8px;padding-left:0">${founder.role}</div>`,
    '', { width: NAME.w + 'px', textAlign: align, whiteSpace: 'nowrap' });

  scene({
    chapter: 1, title: 'Where it comes from',
    // the heading plays before the first subtitle
    pre: 2.0,
    // the heading and the founders centered, then the whole timeline, laid out centered at (960, 522)
    shift: (t, c) => pan(t, [0, INTRO_DY], [[c[0] + 1.1, 0, 0]], 0.9),
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
      // "20 years" is put forward once the heading settles: a light runs through its letters (a copy of the words
      // filled with a moving gradient), a glow blooms around them, they pop, and sparkles burst out
      s.heading = E(root,
        '<span class="key" style="position:relative;display:inline-block;color:var(--violet);'
        + 'transform-origin:100% 55%">'
        + '<span class="txt">20 years</span>'
        + '<span class="shine" style="position:absolute;left:0;top:0;color:transparent;'
        + '-webkit-background-clip:text;background-clip:text;background-size:300% 100%;'
        + `background-image:linear-gradient(100deg, rgba(182,100,255,0) 38%, ${C.violet} 44%, #FFFFFF 50%, `
        + `${C.violet} 56%, rgba(182,100,255,0) 62%)">20 years</span></span> in the making`, '', {
        whiteSpace: 'nowrap', lineHeight: 1,
      });
      s.key = s.heading.querySelector('.key');
      s.key.txt = s.key.querySelector('.txt');
      s.key.shine = s.key.querySelector('.shine');
      // the sparkles of the burst, each with a seeded direction, distance and size
      s.sparkles = Array.from({ length: 10 }, (_, i) => {
        const e = makeSpark(s.key, 7 + Math.round(hash(i * 5 + 3) * 5), i % 2 ? '182,100,255' : '248,250,252');
        e.angle = (i / 10) * Math.PI * 2 + (hash(i * 5 + 1) - 0.5) * 0.5;
        e.dist = 130 + hash(i * 5 + 2) * 80;
        return e;
      });
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
      s.names = FOUNDERS.map((f, i) => makeNameLabel(root, f, i === 0 ? 'right' : 'left'));
      // faint violet discs trailing each face while it travels
      s.ghosts = FOUNDERS.map(() => TRAIL.map(() => E(root, '', '', {
        width: MARK_SIZE + 'px', height: MARK_SIZE + 'px', borderRadius: '50%', background: C.violet,
      })));
      // each founder's face: large for the introduction and the flight, small on the line
      s.faces = FOUNDERS.map(f => makeFace(root, f, INTRO.size));
      s.marks = FOUNDERS.map(f => makeFace(root, f, MARK_SIZE));
    },
    update(t, c, s) {
      setCamera(s.cam, t, this.dur);

      // the heading: large in the middle, its letters closing in from wide apart, sharpening and glowing as they
      // land; it holds, then shrinks up to the top as the founders come in
      const enter = P(t, 0.15, 1.0);
      const settle = P(t, 1.7, 0.8);
      const font = lerp(HEADING.big.font, HEADING.top.font, settle);
      s.heading.style.fontSize = font.toFixed(2) + 'px';
      s.heading.style.letterSpacing = (lerp(0.35, -0.02, ease(enter))).toFixed(4) + 'em';
      s.heading.style.filter = enter < 1 ? `blur(${((1 - enter) * 8).toFixed(2)}px)` : 'none';
      const glow = win(t, 0.6, 1.8, 0.4);
      s.heading.style.textShadow = glow > 0 ? `0 0 ${Math.round(30 * glow)}px rgba(182,100,255,${(0.7 * glow)
        .toFixed(3)})` : 'none';
      place(s.heading, 960, Math.round(lerp(HEADING.big.y, HEADING.top.y, settle)), 1, clamp(enter * 1.5));
      // once the heading has settled, "20 years" is put forward: a light sweeps through its letters, a glow blooms
      // and settles to a faint lasting one, the words pop (anchored on their right, clear of "in the making") and
      // sparkles burst out and fade
      const highlight = c[0] + 2.9;
      const sweep = P(t, highlight, 0.7, x => x);
      s.key.shine.style.opacity = sweep > 0 && sweep < 1 ? 1 : 0;
      s.key.shine.style.backgroundPosition = `${lerp(100, 0, sweep).toFixed(2)}% 0`;
      const bloom = Math.max(win(t, highlight, highlight + 0.6, 0.3), 0.35 * P(t, highlight + 0.3, 0.6));
      s.key.txt.style.textShadow = bloom > 0
        ? `0 0 ${Math.round(28 * bloom)}px rgba(182,100,255,${(0.9 * bloom).toFixed(3)})` : '';
      s.key.style.transform = `scale(${swell(t, highlight + 0.2, 0.06)})`;
      const cx = s.key.offsetWidth / 2, cy = s.key.offsetHeight / 2;
      s.sparkles.forEach(e => {
        const b = P(t, highlight + 0.25, 0.6, x => 1 - Math.pow(1 - x, 2));
        const o = b > 0 && b < 1 ? Math.min(1, (1 - b) * 1.6) : 0;
        place(e, cx + Math.cos(e.angle) * e.dist * b, cy + Math.sin(e.angle) * e.dist * 0.6 * b, 1, o);
      });

      // when each milestone lights up, as the founders reach it, then its tile rises
      const tileIn = [c[0] + 3.6, c[1] + 1.6, c[2] + 1.3, c[3] + 1.8, c[4] + 1.8];
      // each founder: the face shows with its name at `show`, leaves at `fly` (the name fading), lands on its first
      // milestone one second later, then travels the line ([at, milestone]). Maxim lands on 2004, Samar on 2009.
      const founders = [
        { show: c[0] + 0.1, fly: c[0] + 2.5, first: 0, route: [[c[1] + 0.3, 1], [c[3] + 0.5, 3], [c[4] + 0.6, 4]] },
        { show: c[0] + 0.3, fly: c[1] + 0.5, first: 1, route: [[c[2] + 0.3, 2], [c[3] + 0.5, 3], [c[4] + 0.6, 4]] },
      ];
      // where a face's center of travel is at a time, and its size: the flight curves sideways at the face's height
      // first, then down onto the line, under the heading; on the line it rides from milestone to milestone
      const travelPos = (i, at) => {
        const { fly, first, route } = founders[i];
        const from = [INTRO.x[i], INTRO.y];
        const landing = [NODE_X[first], LINE.y];
        if (at < fly + 1) {
          const p = ease(clamp(at - fly));
          const bend = [landing[0], from[1]];
          return {
            x: lerp(lerp(from[0], bend[0], p), lerp(bend[0], landing[0], p), p),
            y: lerp(lerp(from[1], bend[1], p), lerp(bend[1], landing[1], p), p),
            size: lerp(INTRO.size, MARK_SIZE, p),
          };
        }
        const stops = route.map(([when, k]) => [when, NODE_X[k], LINE.y]);
        return { x: pan(at, landing, stops, 1.1)[0], y: LINE.y, size: MARK_SIZE };
      };
      // where a face shows: its center of travel, moved aside as the other face comes near (eased with distance)
      const facePos = (i, at) => {
        const own = travelPos(i, at), other = travelPos(1 - i, at);
        const near = ease(clamp(1 - Math.hypot(own.x - other.x, own.y - other.y) / PAIR_RANGE));
        return { ...own, x: own.x + PAIR_SIDE[i] * PAIR_DX * near };
      };
      const marks = founders.map((_, i) => facePos(i, t));
      const landed = i => t >= founders[i].fly + 1;

      s.faces.forEach((e, i) => {
        const { show } = founders[i];
        const m = marks[i];
        const pop = P(t, show, 0.5, backOut);
        // the large face is the one shown until it lands; then the small one takes over on the line
        place(e, Math.round(m.x), Math.round(m.y), pop * m.size / INTRO.size, landed(i) ? 0 : clamp(pop * 2));
        place(s.marks[i], Math.round(m.x), Math.round(m.y), 1, landed(i) ? 1 : 0);
        rise(s.names[i], nameX(i), INTRO.y, P(t, show + 0.2, 0.5) * (1 - P(t, founders[i].fly - 0.1, 0.3)), 12);
        // the trail shows with the speed of the face
        const before = facePos(i, t - 0.1);
        const speed = t > founders[i].fly ? clamp(Math.hypot(m.x - before.x, m.y - before.y) / 30) : 0;
        s.ghosts[i].forEach((g, k) => {
          const ghost = facePos(i, t - TRAIL[k]);
          place(g, ghost.x, ghost.y, ghost.size / MARK_SIZE * (1 - 0.15 * (k + 1)), speed * (0.35 - 0.1 * k));
        });
      });

      // the timeline draws in below as the names show
      const timelineIn = c[0] + 1.2;
      draw(s.line, P(t, timelineIn, 0.8));
      // the travelled part reaches the founder furthest along
      const onLine = i => (landed(i) ? travelPos(i, t).x : NODE_X[0]);
      s.progress.style.width = Math.round(Math.max(onLine(0), onLine(1)) - LINE.x0) + 'px';
      s.progress.style.opacity = P(t, founders[0].fly + 1, 0.4);

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
