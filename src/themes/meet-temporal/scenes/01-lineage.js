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
  // the heading: large in the middle first, then at the top of the composition
  const HEADING = { big: { y: 322, font: 140 }, top: { y: 228, font: 64 } };
  // while only the heading and the founders show, the composition sits this much lower, centered on the stage;
  // it rises into place as the timeline draws in
  const INTRO_DY = 200;
  // the founders' introduction, between the heading and the line: each face with its name and role beside it, on
  // the outer side (Maxim's on the left, Samar's on the right)
  const INTRO = { y: 380, size: 140, x: [760, 1160] };
  const NAME = { w: 340, gap: 24 };
  // as the timeline comes in, the faces and names move up out of its way, the faces shrinking: they then sit
  // halfway between the heading's descenders and the years, about 32 px from each
  const LIFTED = { y: 339, size: 78 };
  const nameX = (i, size) => INTRO.x[i] + (i === 0 ? -1 : 1) * (size / 2 + NAME.gap + NAME.w / 2);
  // company (null for the Temporal logo), name, detail and year of each milestone
  const MILESTONES = [
    { company: 'Amazon', name: 'Simple Queue<br>Service', detail: 'Tech lead: Maxim', year: '2004' },
    { company: 'Amazon', name: 'Simple Workflow<br>Service', detail: 'AWS workflow service', year: '2009' },
    { company: 'Microsoft', name: 'Durable Task<br>Framework', detail: 'Azure Durable Functions', year: '2014' },
    { company: 'Uber', name: 'Cadence', detail: 'Uber\'s workflow engine', year: '2015' },
    { company: null, name: null, detail: 'Open source, MIT license', year: '2019' },
  ];
  const LAST = MILESTONES.length - 1;
  // the fork's arch, from Cadence's year to Temporal's, over the line, clear of the faces on it
  const FORK = { x0: NODE_X[3] + 52, x1: NODE_X[4] - 52, y: YEAR_Y, top: YEAR_Y - 64 };
  const FLY_D = 1.2; // duration of a face's flight onto the line, in seconds
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
    holdBeforeEnd: CAMERA_EXIT, // presenter mode holds before the exit zoom
    // the heading plays before the first subtitle
    pre: 2.0,
    // the heading and the founders centered, then the whole timeline (laid out centered at (960, 524)), raised
    // 9 px so it centers on 515
    shift: (t, c) => pan(t, [0, INTRO_DY - 9], [[c[1], 0, -9]], 0.9),
    subs: [
      // the founders' introduction, then Maxim flies to 2004
      { text: "Meet Maxim Fateev and Samar Abbas, the creators of Temporal." },
      // the timeline draws in with its five milestones, dim: the journey ahead. Then, without subtitles, Maxim
      // flies to 2004, Samar joins him at 2009, and travels on to 2014, each tile lighting up as they reach it
      {
        text: "Temporal's ideas come from projects they built at Amazon, Microsoft and Uber.",
        after: 3.8,
      },
      { text: "2015: at Uber, they create Cadence. It becomes the standard for Uber's critical processes." },
      {
        // a FORK link draws from Cadence's tile to Temporal's before it lights
        text: "2019: they found Temporal, a fork of Cadence, to bring it to every company.",
        after: 1.0, // Temporal's bloom and ripples settle before the exit zoom
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // Temporal's arrival: a bloom of light behind its tile (under everything else)
      s.bloom = E(root, '', '', {
        width: '700px', height: '700px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(182,100,255,.45) 0%, rgba(68,76,231,.18) 40%, rgba(68,76,231,0) 70%)',
      });
      // "20 years" is put forward while the heading is large: a light runs through its letters (a copy of the words
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
      // the fork: a thin arch from Cadence's milestone to Temporal's, labelled FORK at its top
      s.fork = path(s.svg, `M ${FORK.x0} ${FORK.y} Q ${(FORK.x0 + FORK.x1) / 2} ${FORK.top} ${FORK.x1} ${FORK.y}`,
        C.violet, 2, true);
      s.forkLabel = E(root, 'Fork', 'mono', {
        fontSize: '18px', lineHeight: '24px', color: C.violet, letterSpacing: '.14em', paddingLeft: '.14em',
        textTransform: 'uppercase',
      });
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
      const enter = P(t, 0.1, 0.8);
      const settle = P(t, 1.75, 0.6);
      const font = lerp(HEADING.big.font, HEADING.top.font, settle);
      s.heading.style.fontSize = font.toFixed(2) + 'px';
      s.heading.style.letterSpacing = (lerp(0.35, -0.02, ease(enter))).toFixed(4) + 'em';
      s.heading.style.filter = enter < 1 ? `blur(${((1 - enter) * 8).toFixed(2)}px)` : 'none';
      const glow = win(t, 0.45, 1.0, 0.25);
      s.heading.style.textShadow = glow > 0 ? `0 0 ${Math.round(30 * glow)}px rgba(182,100,255,${(0.7 * glow)
        .toFixed(3)})` : 'none';
      place(s.heading, 960, Math.round(lerp(HEADING.big.y, HEADING.top.y, settle)), 1, clamp(enter * 1.5));
      // while the heading is large, right after its entrance and before it shrinks, "20 years" is put forward: a
      // light sweeps through its letters, a glow blooms and settles to a faint lasting one, the words pop (anchored
      // on their right, clear of "in the making") and sparkles burst out and fade
      const highlight = 0.9;
      const sweep = P(t, highlight, 0.6, x => x);
      s.key.shine.style.opacity = sweep > 0 && sweep < 1 ? 1 : 0;
      s.key.shine.style.backgroundPosition = `${lerp(100, 0, sweep).toFixed(2)}% 0`;
      const bloom = Math.max(win(t, highlight, highlight + 0.5, 0.25), 0.35 * P(t, highlight + 0.3, 0.5));
      s.key.txt.style.textShadow = bloom > 0
        ? `0 0 ${Math.round(28 * bloom)}px rgba(182,100,255,${(0.9 * bloom).toFixed(3)})` : '';
      s.key.style.transform = `scale(${swell(t, highlight + 0.2, 0.06)})`;
      const cx = s.key.offsetWidth / 2, cy = s.key.offsetHeight / 2;
      s.sparkles.forEach(e => {
        const b = P(t, highlight + 0.2, 0.55, x => 1 - Math.pow(1 - x, 2));
        const o = b > 0 && b < 1 ? Math.min(1, (1 - b) * 1.6) : 0;
        // the burst is sized for the large heading (its distances are given for a 64 px font)
        const k = font / HEADING.top.font;
        place(e, cx + Math.cos(e.angle) * e.dist * k * b, cy + Math.sin(e.angle) * e.dist * 0.6 * k * b, k, o);
      });

      // when each milestone lights up, as the founders reach it, then its tile rises
      const tileIn = [c[1] + 3.9, c[1] + 6.0, c[1] + 8.2, c[2] + 1.5, c[3] + 2.2];
      // the milestones' slots, dim, one after the other as the timeline draws in
      const slotIn = k => c[1] + 0.8 + k * 0.25;
      // each founder: the face shows with its name at `show`, leaves at `fly` and lands FLY_D seconds later on its
      // first milestone, then travels the line. Every place is [milestone, slot]: slot 0 is centered on the node, for a
      // face alone there for the beat; -1 and 1 are the paired slots, left of the node for Maxim and right for Samar,
      // taken straight away when the other founder joins that milestone in the same beat
      const founders = [
        {
          show: c[0] + 0.1, fly: c[1] + 2.6, first: [0, 0],
          // 2009 with Samar, then alone there once Samar leaves for 2014, then 2015 and 2019 together
          route: [[c[1] + 4.6, 1, -1], [c[1] + 7.0, 1, 0], [c[2] + 0.3, 3, -1], [c[3] + 0.1, 4, -1]],
        },
        {
          show: c[0] + 0.3, fly: c[1] + 4.6, first: [1, 1],
          route: [[c[1] + 7.0, 2, 0], [c[2] + 0.3, 3, 1], [c[3] + 0.1, 4, 1]],
        },
      ];
      const slotX = ([k, slot]) => NODE_X[k] + slot * PAIR_DX;
      // a gentle sine ease in and out, so a face neither snaps away nor arrives with a jolt
      const sine = x => (1 - Math.cos(Math.PI * clamp(x))) / 2;
      // where a face is at a time, and its size: the flight is one smooth arc (a quadratic curve through the corner
      // above its landing) that heads sideways at the face's height, then curves down onto the line, under the
      // heading, shrinking all the way; on the line the face moves from place to place
      // the faces' lift, done before the milestones' years appear
      const lift = at => ease(P(at, c[1], 0.6));
      const introY = at => lerp(INTRO.y, LIFTED.y, lift(at));
      const introSize = at => lerp(INTRO.size, LIFTED.size, lift(at));
      const facePos = (i, at) => {
        const { fly, first, route } = founders[i];
        const from = [INTRO.x[i], introY(Math.min(at, fly))];
        const fromSize = introSize(Math.min(at, fly));
        const landing = [slotX(first), LINE.y];
        if (at < fly + FLY_D) {
          const p = sine((at - fly) / FLY_D);
          const bend = [landing[0], from[1]];
          return {
            x: lerp(lerp(from[0], bend[0], p), lerp(bend[0], landing[0], p), p),
            y: lerp(lerp(from[1], bend[1], p), lerp(bend[1], landing[1], p), p),
            size: lerp(fromSize, MARK_SIZE, p),
          };
        }
        let x = landing[0];
        route.forEach(([when, k, slot]) => {
          x = lerp(x, slotX([k, slot]), sine((at - when) / 1.1));
        });
        return { x, y: LINE.y, size: MARK_SIZE };
      };
      // the milestone a face has reached on the line, as an x: where the travelled part of the line ends
      const nodeX = (i, at) => {
        let x = NODE_X[founders[i].first[0]];
        founders[i].route.forEach(([when, k]) => {
          x = lerp(x, NODE_X[k], sine((at - when) / 1.1));
        });
        return x;
      };
      const marks = founders.map((_, i) => facePos(i, t));
      const landed = i => t >= founders[i].fly + FLY_D;

      s.faces.forEach((e, i) => {
        const { show } = founders[i];
        const m = marks[i];
        const pop = P(t, show, 0.5, backOut);
        // the large face is the one shown until it lands; then the small one takes over on the line
        place(e, Math.round(m.x), Math.round(m.y), pop * m.size / INTRO.size, landed(i) ? 0 : clamp(pop * 2));
        place(s.marks[i], Math.round(m.x), Math.round(m.y), 1, landed(i) ? 1 : 0);
        rise(s.names[i], Math.round(nameX(i, introSize(t))), Math.round(introY(t)),
          P(t, show + 0.2, 0.5) * (1 - P(t, founders[i].fly, 0.6)), 12);
        // the trail shows with the speed of the face
        const before = facePos(i, t - 0.1);
        const speed = t > founders[i].fly ? clamp(Math.hypot(m.x - before.x, m.y - before.y) / 30) : 0;
        s.ghosts[i].forEach((g, k) => {
          const ghost = facePos(i, t - TRAIL[k]);
          place(g, ghost.x, ghost.y, ghost.size / MARK_SIZE * (1 - 0.15 * (k + 1)), speed * (0.35 - 0.1 * k));
        });
      });

      // the timeline draws in below with the second subtitle
      const timelineIn = c[1] + 0.2;
      draw(s.line, P(t, timelineIn, 0.8));
      // the travelled part reaches the founder furthest along
      const onLine = i => (landed(i) ? nodeX(i, t) : NODE_X[0]);
      s.progress.style.width = Math.round(Math.max(onLine(0), onLine(1)) - LINE.x0) + 'px';
      s.progress.style.opacity = P(t, founders[0].fly + FLY_D, 0.4);

      // Temporal arrives: bloom and ripples around its tile
      const arrive = tileIn[LAST];
      const tileCenter = [NODE_X[LAST], TILE_Y];
      // a short bloom that settles to a faint lasting glow, and quick ripples, both done before the subtitle ends
      place(s.bloom, ...tileCenter, 0.6 + 0.5 * P(t, arrive, 0.7), win(t, arrive, arrive + 0.5, 0.3) * 0.9
        + P(t, arrive + 0.5, 0.5) * 0.35);
      s.ripples.forEach((e, i) => {
        const p = P(t, arrive + i * 0.15, 0.7, x => 1 - Math.pow(1 - x, 2));
        const size = Math.round(lerp(320, 560, p) / 2) * 2;
        e.style.width = e.style.height = size + 'px';
        place(e, ...tileCenter, 1, p > 0 && p < 1 ? (1 - p) * 0.9 : 0);
      });
      // the fork, drawn once the founders reach 2019, just before Temporal's tile lights
      draw(s.fork, P(t, c[3] + 1.3, 0.7));
      // on top of the arch's apex (halfway to its control point), 10 px clear of it
      place(s.forkLabel, (FORK.x0 + FORK.x1) / 2, (FORK.y + FORK.top) / 2 - 22, 1, P(t, c[3] + 1.4, 0.3));
      NODE_X.forEach((x, k) => {
        const lit = t >= tileIn[k] - 0.4;
        s.nodes[k].style.background = lit ? C.violet : '#141414';
        s.nodes[k].style.borderColor = lit ? C.violet : C.slate;
        place(s.nodes[k], x, LINE.y, swell(t, tileIn[k] - 0.4, 0.4), P(t, timelineIn + 0.2 + k * 0.12, 0.3));
        draw(s.ticks[k], P(t, tileIn[k] - 0.2, 0.3));
        // a dim slot first, rising in with the timeline, then lit as the founders reach it
        const slot = P(t, slotIn(k), 0.5), shown = P(t, tileIn[k], 0.6);
        place(s.tiles[k], x, TILE_Y + Math.round((1 - slot) * 24), swell(t, tileIn[k], 0.04),
          lerp(0.28 * slot, 1, shown));
        place(s.years[k], x, YEAR_Y + Math.round((1 - slot) * 12), 1, lerp(0.4 * slot, 1, P(t, tileIn[k] + 0.1, 0.5)));
      });
    }
  });
}
