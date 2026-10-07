// ===================== 2. FROM AMAZON TO UBER
// The block keeps every name declared in this file local to this scene.
{
  // A horizontal timeline: four milestones on a line, each with its year above and its tile below; the founder
  // faces ride the line from one milestone to the next
  const LINE = { x0: 150, x1: 1770, y: 380 };
  const NODE_X = [330, 750, 1170, 1590];
  const TILE = { top: 440, w: 360, h: 300 };
  const TILE_Y = TILE.top + TILE.h / 2;
  const YEAR_Y = LINE.y - 70; // 18 px above the founders' faces
  const MARK_SIZE = 56;
  const MARK_DX = [-32, 32]; // Maxim left of the milestone, Samar right of it, 8 px apart
  // company (null for the Temporal logo), name, detail and year (null for none) of each milestone
  const MILESTONES = [
    { company: 'Amazon', name: 'Simple Workflow<br>Service', detail: 'Long-running processes', year: '2012' },
    { company: 'Microsoft', name: 'Durable Task<br>Framework', detail: 'Azure Durable Functions', year: null },
    { company: 'Uber', name: 'Cadence', detail: 'Open source, Uber Eats', year: '2017' },
    { company: null, name: null, detail: 'Open source, MIT license', year: '2019' },
  ];
  const LAST = MILESTONES.length - 1;

  // Milestone tile: company on top, name in a two-line box (or the official logo), a rule, the detail at the bottom
  function makeMilestone(root, { company, name, detail }) {
    const head = company
      ? `<div class="lbl" style="font-size:18px">${company}</div>`
      : '<div class="lbl" style="font-size:18px">Their own company</div>';
    const body = name
      ? `<div style="font-size:36px;line-height:1.12;letter-spacing:-.5px">${name}</div>`
      : `<img src="${LOGO}" style="height:56px;display:block">`;
    return E(root,
      `<div style="position:absolute;left:0;right:0;top:32px">${head}</div>`
      + '<div style="position:absolute;left:20px;right:20px;top:72px;height:96px;display:flex;align-items:center;'
      + `justify-content:center">${body}</div>`
      + `<div style="position:absolute;left:40px;right:40px;top:204px;border-top:1.5px solid ${C.line}"></div>`
      + `<div class="lbl" style="position:absolute;left:0;right:0;top:232px;font-size:17px;color:var(--ink)">`
      + `${detail}</div>`,
      'tile', { width: TILE.w + 'px', height: TILE.h + 'px' });
  }

  scene({
    chapter: 2, title: 'From Amazon to Uber',
    shift: [0, 7],
    subs: [
      {
        text: "At Amazon, they built Simple Workflow Service, launched in 2012, to run long processes reliably.",
        after: 0.4,
      },
      {
        text: "Back at Microsoft, Samar co-created the Durable Task Framework, the base of Azure Durable Functions.",
        after: 0.4,
      },
      {
        text: "In 2015, both joined Uber and built Cadence. Open source since 2017, it ran Uber Eats orders.",
        after: 0.4,
      },
      {
        text: "In October 2019, they left Uber to found Temporal: Cadence's successor, open source under MIT.",
        after: 1.0,
      },
    ],
    build(root, s) {
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
      s.years = MILESTONES.map(m => E(root, m.year ?? '', 'mono', {
        fontSize: '30px', lineHeight: '40px', letterSpacing: '.06em',
      }));
      s.years[LAST].style.color = C.violet;
      s.tiles = MILESTONES.map(m => makeMilestone(root, m));
      // Temporal stands out: UV border, a UV tint and a soft glow
      Object.assign(s.tiles[LAST].style, {
        borderColor: C.uv, background: '#1D1E3A', boxShadow: '0 0 48px rgba(68,76,231,.35)',
      });
      s.marks = FOUNDERS.map(f => makeFace(root, f, MARK_SIZE));
    },
    update(t, c, s) {
      // when each milestone lights up: the founders reach it, then its tile rises
      const tileIn = [c[0] + 0.9, c[1] + 1.3, c[2] + 1.8, c[3] + 1.8];
      // where each founder travels: [at, milestone index]; both start on Amazon
      const routes = [
        [[c[2] + 0.5, 2], [c[3] + 0.6, 3]],
        [[c[1] + 0.3, 1], [c[2] + 0.5, 2], [c[3] + 0.6, 3]],
      ];
      const markX = s.marks.map((_, i) => {
        const stops = routes[i].map(([at, k]) => [at, NODE_X[k] + MARK_DX[i], LINE.y]);
        return pan(t, [NODE_X[0] + MARK_DX[i], LINE.y], stops, 1.1)[0];
      });

      draw(s.line, P(t, c[0] + 0.1, 0.8));
      // the travelled part reaches the founder furthest along, from the first milestone on
      const reach = Math.max(...markX) - LINE.x0;
      s.progress.style.width = Math.round(reach) + 'px';
      s.progress.style.opacity = P(t, c[0] + 0.6, 0.4);

      s.marks.forEach((e, i) => {
        const p = P(t, c[0] + 0.5 + i * 0.15, 0.45, backOut);
        place(e, Math.round(markX[i]), LINE.y, p, clamp(p * 2));
      });
      NODE_X.forEach((x, k) => {
        const lit = t >= tileIn[k] - 0.4;
        s.nodes[k].style.background = lit ? C.violet : '#141414';
        s.nodes[k].style.borderColor = lit ? C.violet : C.slate;
        place(s.nodes[k], x, LINE.y, swell(t, tileIn[k] - 0.4, 0.4), P(t, c[0] + 0.3 + k * 0.12, 0.3));
        draw(s.ticks[k], P(t, tileIn[k] - 0.2, 0.3));
        rise(s.tiles[k], x, TILE_Y, P(t, tileIn[k], 0.6));
        rise(s.years[k], x, YEAR_Y, P(t, tileIn[k] + 0.1, 0.5), 12);
      });
    }
  });
}
