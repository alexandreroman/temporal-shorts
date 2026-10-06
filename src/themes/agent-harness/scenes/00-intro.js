// ===================== INTRO
// The block keeps every name declared in this file local to this scene.
{
  // the harness: a dashed ring around the model, carrying the capabilities it adds
  const RING = { x: 1420, y: 470, r: 240 };
  // draw() slides the dashes 40 px/s along the ring; the icons turn at the same speed so they ride with them
  const RING_SPEED = 40 / RING.r;
  const RING_ICONS = ['retry', 'user', 'eye', 'layers'];
  scene({
    // the title settles before the subtitle; after it, the title page holds about 2 s, then fades (post)
    pre: 1.5, post: 0.5,
    shift: [39, 52],
    subs: [
      {
        text: "Meet Temporal Agent Harness: an experimental project to build durable AI agents on Temporal.",
        after: 2.0,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      const { x, y, r } = RING;
      // 48 dash periods fit the circumference exactly, so the dashes never show a seam where the path starts
      const seg = Math.PI * r / 48;
      s.ring = path(s.svg, `M ${x + r} ${y} A ${r} ${r} 0 1 1 ${x - r} ${y} A ${r} ${r} 0 1 1 ${x + r} ${y}`,
        C.uv, 3, false, `${seg},${seg}`);
      s.t = E(root,
        `<img src="${LOGO}" style="height:58px;display:block;margin-bottom:46px">`
        + '<div class="mono" style="font-size:22px;letter-spacing:.14em;color:var(--slate)">'
        + 'AN EXPERIMENTAL PROJECT</div>'
        + '<div style="font-size:116px;line-height:1.02;letter-spacing:-3px;margin-top:22px">'
        + 'Temporal<br>Agent Harness</div>'
        + '<div class="mono" style="font-size:24px;letter-spacing:.12em;color:var(--violet);margin-top:34px">'
        + 'DURABLE AI AGENTS, WITH THE SDKS YOU ALREADY USE</div>');
      s.llm = makeLLM(root, 230, '');
      // opaque tiles: the ring passes behind the icons
      s.icons = RING_ICONS.map(n => E(root, ICON(n, 38, C.ink, 1.7), 'tile', {
        width: '76px', height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderColor: C.uv,
      }));
    },
    update(t, c, s) {
      // a calm entrance: the title rises, then the model; its ring and the four capabilities follow the subtitle
      const titleIn = P(t, 0.3, 1.2);
      place(s.t, 560, 440, 1, titleIn);
      s.t.style.transform += ` translateY(${(1 - titleIn) * 24}px)`;
      const p = P(t, 1.0, 0.9, backOut);
      place(s.llm.root, RING.x, RING.y, p, clamp(p * 2));
      llmState(s.llm, { look: Math.sin(G * 0.8) * 0.6 });
      draw(s.ring, P(t, c[0] + 0.1, 1.0));
      s.icons.forEach((e, i) => {
        const a = G * RING_SPEED + i * (Math.PI / 2) - Math.PI / 4;
        const pp = P(t, c[0] + 0.9 + i * 0.35, 0.6, backOut);
        place(e, RING.x + Math.cos(a) * RING.r, RING.y + Math.sin(a) * RING.r, pp, clamp(pp * 2));
      });
    }
  });
}
