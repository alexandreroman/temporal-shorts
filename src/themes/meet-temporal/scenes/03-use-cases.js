// ===================== 3. WHERE TEMPORAL IS USED
// The block keeps every name declared in this file local to this scene.
{
  // A hub-and-spoke map: the Temporal symbol in the middle, four spokes out to four category hubs, each hub with
  // its three examples as icon bubbles fanned out on its outer side
  const CENTER = { x: 960, y: 515 };
  const SYMBOL_SIZE = 210;
  const HUB_SIZE = 170;
  const BUBBLE = { size: 100, r: 200, icon: 46, font: 18 }; // bubble size, distance from its hub, icon and label sizes
  const FLOAT = 4; // how far a bubble floats around its place, in px
  // hubs at the four diagonals, 360 px left or right of the symbol and 153 px above or under it; `angles`:
  // directions of the hub's three bubbles, fanned 36 degrees apart on the hub's outer side, all within 52 degrees
  // of the horizontal, so every label sits beside its bubble (degrees, clockwise from the x axis). The map spans
  // x 190 to 1752, y 150 to 880 (each bubble floats 4 px)
  const HUBS = [
    { name: 'Process', x: 600, y: 362, angles: [160, 196, 232] },
    { name: 'Lifecycle', x: 1320, y: 362, angles: [308, 344, 20] },
    { name: 'Operational', x: 600, y: 668, angles: [200, 164, 128] },
    { name: 'AI', x: 1320, y: 668, angles: [52, 16, 340] },
  ];
  // the examples of each hub, [icon, label], in the order of its angles
  const EXAMPLES = [
    [['card', 'Payments'], ['cart', 'Orders'], ['ticket', 'Bookings']],
    [['retry', 'Subscriptions'], ['user', 'User accounts'], ['box', 'Inventory']],
    [['code', 'CI/CD'], ['server', 'Provisioning'], ['pipeline', 'Data pipelines']],
    [['sparkle', 'Agents'], ['search', 'RAG flows'], ['chip', 'Model training']],
  ];
  const AI = HUBS.length - 1;
  const SWELL_AT = 5.9; // when AI swells, after the start of the last subtitle (c[1])
  const FULL_SCREEN = 2300; // the AI hub's diameter when it fills the stage (its diagonal is 2203 px)

  const bubbleAt = (hub, k) => {
    const a = hub.angles[k] * Math.PI / 180;
    return [hub.x + Math.cos(a) * BUBBLE.r, hub.y + Math.sin(a) * BUBBLE.r];
  };
  // the spoke from the symbol's edge to the hub's edge
  function spokeD(hub) {
    const dx = hub.x - CENTER.x, dy = hub.y - CENTER.y, d = Math.hypot(dx, dy);
    const from = SYMBOL_SIZE / 2 + 16, to = d - HUB_SIZE / 2 - 8;
    return `M ${CENTER.x + dx / d * from} ${CENTER.y + dy / d * from} L ${CENTER.x + dx / d * to} `
      + `${CENTER.y + dy / d * to}`;
  }

  // Round category hub: the category in bold, then WORKFLOWS lighter, on UV
  const makeHub = (root, name) => E(root,
    `<b>${name}</b><span style="opacity:.75;font-size:14px;margin-top:5px">Workflows</span>`, 'mono', {
      width: HUB_SIZE + 'px', height: HUB_SIZE + 'px', borderRadius: '50%', background: C.uv, color: '#FFFFFF',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontSize: '17px', letterSpacing: '.08em', paddingLeft: '.08em', textTransform: 'uppercase',
    });
  // Example bubble: a round tile with a stroke icon, its mono label on its outer side, away from the link to its
  // hub: beside it when the bubble sits mostly left or right of the hub (angle in degrees), else above or under it
  function makeBubble(root, [icon, label], angle) {
    const a = angle * Math.PI / 180;
    let labelAt;
    if (Math.abs(Math.cos(a)) >= 0.6) {
      labelAt = Math.cos(a) < 0 ? 'right:calc(100% + 14px);top:50%;transform:translateY(-50%)'
        : 'left:calc(100% + 14px);top:50%;transform:translateY(-50%)';
    } else {
      labelAt = (Math.sin(a) < 0 ? 'bottom' : 'top') + ':calc(100% + 12px);left:50%;transform:translateX(-50%)';
    }
    return E(root,
      `<div style="width:${BUBBLE.size}px;height:${BUBBLE.size}px;border-radius:50%;`
      + `background:var(--surface);border:1.5px solid ${C.line};display:flex;align-items:center;`
      + `justify-content:center">${ICON(icon, BUBBLE.icon, C.ink, 1.7)}</div>`
      + `<div class="lbl" style="position:absolute;${labelAt};font-size:${BUBBLE.font}px">`
      + `${label}</div>`,
      '', { width: BUBBLE.size + 'px', height: BUBBLE.size + 'px' });
  }

  scene({
    chapter: 3, title: 'Where Temporal is used',
    // a hard cut: the AI hub turns into the next chapter's first frame
    fadeOut: 0,
    // presenter mode holds on the settled map just before AI invades the screen, then plays the swell, the morph
    // and the cut in one go
    holdBeforeEnd: (c, dur) => dur - (c[1] + SWELL_AT),
    // the chapter header fades out as AI invades the screen: the swell and the morph play with no header
    headerOutAt: c => c[1] + SWELL_AT,
    // laid out centered at (960, 522) on the free band
    subs: [
      {
        text: "A <b>Workflow</b> is any process that must finish correctly: payments, orders, bookings, subscriptions.",
        after: 0.4,
      },
      // the pause holds the zoom into the AI hub, which leads into the next chapter
      { text: "Teams also run infrastructure, data pipelines and, more and more, AI on Temporal.", after: 3.0 },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.glow = E(root, '', '', {
        width: '620px', height: '620px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(182,100,255,.35) 0%, rgba(68,76,231,.12) 45%, rgba(68,76,231,0) 70%)',
      });
      // the AI hub's halo, which travels with it at the end
      s.halo = E(root, '', '', {
        width: HANDOFF_HALO.size + 'px', height: HANDOFF_HALO.size + 'px', borderRadius: '50%',
        background: HALO_BACKGROUND,
      });
      s.svg = svgLayer(root);
      s.spokes = HUBS.map(hub => path(s.svg, spokeD(hub), C.violet, 2.5, false));
      // hub to bubble links, redrawn every frame as the bubbles float
      s.links = HUBS.map(() => [0, 1, 2].map(() => path(s.svg, 'M 0 0 L 1 1', C.line, 1.5, false)));
      s.symbol = E(root, `<img src="${SYMBOL}" style="width:${SYMBOL_SIZE}px;height:${SYMBOL_SIZE}px;display:block">`);
      s.pulses = HUBS.map(() => makeSpark(root, 16, '182,100,255'));
      s.hubs = HUBS.map(hub => makeHub(root, hub.name));
      // the AI hub's two words: WORKFLOWS fades as AI invades the screen, AI alone re-centering in the disc
      s.aiWord = s.hubs[AI].querySelector('b');
      s.aiRest = s.hubs[AI].querySelector('span');
      s.bubbles = EXAMPLES.map((examples, i) => examples.map((example, k) => makeBubble(root, example,
        HUBS[i].angles[k])));
      // the LLM orb the AI hub turns into: the next chapter's LLM node, same size and blink
      s.llm = makeLLM(root, AGENT_LLM.size, '', { seed: AGENT_LLM.seed });
    },
    update(t, c, s) {
      // at the end AI invades the screen, then turns into the next chapter's LLM node: the rest of the map fades
      // while the AI hub, with its halo and its text, swells from its place to fill the whole stage and holds there;
      // then it contracts to where that node shows when the next chapter starts (AGENT_HANDOFF), at its size, its
      // text and UV fill giving way to the violet orb and its eyes. No camera move, no zoom-out at the end: the
      // stage here is the stage there.
      setCamera(s.cam, t, this.dur, { exit: 1 });
      const morphAt = c[1] + SWELL_AT;
      const swellP = P(t, morphAt, 1.0);
      const contract = P(t, morphAt + 1.7, 1.3);
      const rest = 1 - P(t, morphAt, 0.6);
      const ai = HUBS[AI];
      const llmSize = AGENT_HANDOFF.size;
      const x = lerp(lerp(ai.x, 960, swellP), AGENT_HANDOFF.x, contract);
      const y = lerp(lerp(ai.y, 540, swellP), AGENT_HANDOFF.y, contract);
      const size = lerp(lerp(HUB_SIZE, FULL_SCREEN, swellP), llmSize, contract);
      const orb = P(t, morphAt + 2.4, 0.6);
      place(s.llm.root, x, y, size / AGENT_LLM.size, orb);
      llmState(s.llm, { look: 0.5 });
      // the halo grows with the hub (HANDOFF_HALO.size at the LLM's size), washing the stage violet
      place(s.halo, x, y, size / llmSize, P(t, morphAt, 0.5) * HANDOFF_HALO.o);

      // the symbol glows in the middle, the spokes draw out with a pulse of light, each hub pops as its pulse lands
      place(s.symbol, CENTER.x, CENTER.y, P(t, c[0] + 0.1, 0.5, backOut), P(t, c[0] + 0.1, 0.3) * rest);
      place(s.glow, CENTER.x, CENTER.y, 1 + 0.05 * Math.sin(G * 1.5), P(t, c[0] + 0.2, 0.6) * rest);
      const spokeAt = i => c[0] + 0.5 + i * 0.18;
      HUBS.forEach((hub, i) => {
        // everything but the AI hub fades as the camera zooms in
        const o = i === AI ? 1 : rest;
        const prog = P(t, spokeAt(i), 0.5);
        draw(s.spokes[i], prog, rest);
        sparkOnPath(s.pulses[i], s.spokes[i], prog);
        const hp = P(t, spokeAt(i) + 0.45, 0.5, backOut);
        if (i === AI) {
          // the hub follows the morph, fading as the orb takes over; its text fades before the orb's eyes come in,
          // and a violet light glows in it while it fills the stage
          const hub = s.hubs[i];
          place(hub, x, y, hp * size / HUB_SIZE, clamp(hp * 2) * (1 - orb));
          // WORKFLOWS fades out as the hub swells, and AI slides down to the disc's center
          const alone = ease(P(t, morphAt, 0.8));
          const drop = Math.round((s.aiRest.offsetHeight + 4) / 2 * alone * 100) / 100;
          s.aiWord.style.transform = `translateY(${drop}px)`;
          s.aiRest.style.transform = `translateY(${drop}px)`;
          s.aiRest.style.opacity = (0.75 * (1 - alone)).toFixed(3);
          hub.style.color = `rgba(255,255,255,${(1 - P(t, morphAt + 1.8, 0.5)).toFixed(3)})`;
          const light = swellP * (1 - contract) * 0.55;
          hub.style.background = light > 0
            ? `radial-gradient(circle at 50% 42%, rgba(182,100,255,${light.toFixed(3)}), ${C.uv} 70%)` : C.uv;
        } else {
          place(s.hubs[i], hub.x, hub.y, hp, clamp(hp * 2) * o);
        }
        s.bubbles[i].forEach((b, k) => {
          const [bx, by] = bubbleAt(hub, k);
          // a gentle float around its place (ambient, driven by G), each bubble on its own phase
          const phase = (i * 3 + k) * 1.9;
          const x = bx + FLOAT * Math.sin(G * 0.9 + phase), y = by + FLOAT * Math.cos(G * 0.7 + phase);
          const bp = P(t, spokeAt(i) + 0.8 + k * 0.12, 0.45, backOut);
          place(b, x, y, bp, clamp(bp * 2) * rest);
          // the link from the hub's edge to the bubble's edge
          const d = Math.hypot(x - hub.x, y - hub.y);
          const ux = (x - hub.x) / d, uy = (y - hub.y) / d;
          const link = s.links[i][k];
          link.setAttribute('d', `M ${hub.x + ux * (HUB_SIZE / 2 + 6)} ${hub.y + uy * (HUB_SIZE / 2 + 6)} `
            + `L ${x - ux * (BUBBLE.size / 2 + 6)} ${y - uy * (BUBBLE.size / 2 + 6)}`);
          link.style.opacity = clamp(bp * 2) * rest;
        });
      });
    }
  });
}
