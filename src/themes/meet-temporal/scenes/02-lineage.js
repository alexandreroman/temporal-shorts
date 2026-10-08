// ===================== 2. 20 YEARS IN THE MAKING
// The block keeps every name declared in this file local to this scene.
{
  // A heading over a horizontal timeline: five milestones on a line across the free band, each with its year above
  // and its tile below; the founders' faces ride the line from one milestone to the next
  const LINE = { x0: 120, x1: 1800, y: 425 };
  const TILE = { top: 485, w: 300, h: 300, gap: 45 }; // five tiles span the band, 45 px apart
  const NODE_X = [0, 1, 2, 3, 4].map(i => LINE.x0 + TILE.w / 2 + i * (TILE.w + TILE.gap));
  const TILE_Y = TILE.top + TILE.h / 2;
  const YEAR_Y = LINE.y - 70; // 18 px above the founders' faces
  const HEADING_Y = YEAR_Y - 86;
  const MARK_SIZE = 56;
  const MARK_DX = [-32, 32]; // Maxim left of the milestone, Samar right of it, 8 px apart
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
  const DIGIT_H = 34; // height of one digit of the year odometer

  // Year odometer: four digit columns (0 to 9, then 0 again for the wrap) behind a window one digit high
  function makeOdometer(root) {
    const column = '<div class="col" style="display:flex;flex-direction:column">'
      + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => `<span style="height:${DIGIT_H}px;line-height:${DIGIT_H}px">${d}`
        + '</span>').join('') + '</div>';
    const e = E(root, `<div style="display:flex;height:${DIGIT_H}px;overflow:hidden">${column.repeat(4)}</div>`,
      'mono', { fontSize: '30px', color: C.ink, letterSpacing: '.04em' });
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
    chapter: 2, title: '20 years in the making',
    // laid out centered at (960, 522) on the free band
    subs: [
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
      s.heading = E(root, '20 years in the making', 'lbl', { fontSize: '26px', color: 'var(--violet)' });
      s.odometer = makeOdometer(root);
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
      // faint violet discs trailing each face while it travels
      s.ghosts = FOUNDERS.map(() => TRAIL.map(() => E(root, '', '', {
        width: MARK_SIZE + 'px', height: MARK_SIZE + 'px', borderRadius: '50%', background: C.violet,
      })));
      s.marks = FOUNDERS.map(f => makeFace(root, f, MARK_SIZE));
      // Temporal's arrival: a bloom of light behind its tile and ripples around it
      s.bloom = E(root, '', '', {
        width: '700px', height: '700px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(182,100,255,.45) 0%, rgba(68,76,231,.18) 40%, rgba(68,76,231,0) 70%)',
      });
      root.insertBefore(s.bloom, root.firstChild);
      s.ripples = makeRipples(root, 3, '182,100,255');
    },
    update(t, c, s) {
      // the camera starts close on the origin, Simple Queue Service, then pulls back to the whole timeline
      const pull = P(t, 0.3, 2.6);
      const zoom = lerp(1.5, 1, pull);
      const focus = [NODE_X[0], 560];
      setCamera(s.cam, t, this.dur, {
        scale: zoom, dx: -(focus[0] - 960) * zoom * (1 - pull), dy: -(focus[1] - 540) * zoom * (1 - pull),
      });
      // when each milestone lights up: Simple Queue Service, the origin, from the start; the others as the founders
      // reach them, then their tile rises
      const tileIn = [0.2, c[0] + 1.3, c[1] + 1.3, c[2] + 1.8, c[3] + 1.8];
      // each founder: the milestone where the face first shows, when, then where it travels ([at, milestone]).
      // Maxim starts on Simple Queue Service; Samar joins on Simple Workflow Service.
      const founders = [
        { from: 0, showAt: 0.4, route: [[c[0] + 0.3, 1], [c[2] + 0.5, 3], [c[3] + 0.6, 4]] },
        { from: 1, showAt: c[0] + 1.0, route: [[c[1] + 0.3, 2], [c[2] + 0.5, 3], [c[3] + 0.6, 4]] },
      ];
      const faceX = (i, at) => {
        const { from, route } = founders[i];
        const stops = route.map(([when, k]) => [when, NODE_X[k] + MARK_DX[i], LINE.y]);
        return pan(at, [NODE_X[from] + MARK_DX[i], LINE.y], stops, 1.1)[0];
      };
      const markX = founders.map((_, i) => faceX(i, t));

      // the heading as the camera settles, then the odometer, which rolls with Maxim during the first subtitle, then
      // with the founder furthest along
      const headingIn = P(t, 1.8, 0.6);
      rise(s.heading, 960 - 60, HEADING_Y, headingIn, 12);
      rise(s.odometer, 960 + 230, HEADING_Y, headingIn, 12);
      const front = t < c[1] ? markX[0] - MARK_DX[0] : Math.max(markX[0] - MARK_DX[0], markX[1] - MARK_DX[1]);
      setOdometer(s.odometer, yearAt(front));
      draw(s.line, P(t, 0.1, 0.8));
      // the travelled part reaches the founder furthest along
      const reach = Math.max(...markX) - LINE.x0;
      s.progress.style.width = Math.round(reach) + 'px';
      s.progress.style.opacity = P(t, 0.4, 0.4);

      s.marks.forEach((e, i) => {
        const p = P(t, founders[i].showAt, 0.45, backOut);
        place(e, Math.round(markX[i]), LINE.y, p, clamp(p * 2));
        // the trail shows with the speed of the face
        const speed = clamp(Math.abs(markX[i] - faceX(i, t - 0.1)) / 30);
        s.ghosts[i].forEach((g, k) => {
          place(g, faceX(i, t - TRAIL[k]), LINE.y, 1 - 0.15 * (k + 1), speed * (0.35 - 0.1 * k));
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
        place(s.nodes[k], x, LINE.y, swell(t, tileIn[k] - 0.4, 0.4), P(t, 0.3 + k * 0.12, 0.3));
        draw(s.ticks[k], P(t, tileIn[k] - 0.2, 0.3));
        rise(s.tiles[k], x, TILE_Y, P(t, tileIn[k], 0.6));
        rise(s.years[k], x, YEAR_Y, P(t, tileIn[k] + 0.1, 0.5), 12);
      });
    }
  });
}
