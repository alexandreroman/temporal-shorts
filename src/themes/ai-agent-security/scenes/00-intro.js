// ===================== INTRO
// Title on the left; on the right, the AI model orb with four tool badges orbiting it (email, database, payments,
// keys), each swelling as the subtitle names what agents touch. As it asks what happens when one goes wrong, the orb
// is hijacked (red, glitching) and three badges flash red, with a red flash and a jolt of the camera. Then a ring of
// checkpoints, each with the Temporal symbol, spirals in and closes round them: the orb and the badges calm down.
// At the end the ring and the badges collapse into the orb, which flies to its place on chapter 1's board
// (INTRO_ORB): chapter 1 opens on that frame.
// The block keeps every name declared in this file local to this scene.
{
  // the title block (titleFont 100, as human-in-the-loop, for this longer title: x 120-1122, y 297-733) and the
  // visual's center; the ring with its nodes spans y 221-809, so both center on y 515
  const TITLE = { x: 621, y: 515 };
  const VISUAL = { x: 1500, y: 515 };
  // the orb at its intro size: INTRO_ORB.size (180 px) at this scale
  const ORB_SCALE = 1.2;
  // the badges' orbit: wide enough to clear the orb at its top and bottom, inside the ring at its sides
  const ORBIT = { x: VISUAL.x, y: VISUAL.y, rx: 205, ry: 160, speed: 0.5 };
  const BADGE = { size: 72, icon: 36 };
  // the tool badges, in orbit order; red: whether it flashes red when the agent goes wrong
  const BADGES = [
    { icon: 'mail', red: true },
    { icon: 'database', red: false },
    { icon: 'card', red: true },
    { icon: 'key', red: true },
  ];
  // the ring of checkpoints: its radius, its nodes (how many, their size, their symbol's size) and how many degrees
  // each arc stops short of a node; the first node sits 22.5 degrees past the top, so none stands at the sides, where
  // the badges pass closest
  const RING = { r: 270, n: 8, node: 48, symbol: 24, gap: 9, first: -67.5 };
  // the beats, in seconds from c[0]: the orb and the badges pop in (orb, badges); each badge swells as its word is
  // read, at 16 characters per second plus 0.3 s ("emails", "data", "money"; the key with "money"); the agent goes
  // wrong as "goes" is read (hijack), the red badges flash one after the other (redStep); the ring's nodes spiral in
  // (ring, ringStep, ringD), its arcs draw (arcs, arcsD) and close it (closed): the orb and the badges calm down
  const T0 = {
    orb: -0.6, badges: -0.1, named: [1.8, 3.1, 4.4, 4.6], hijack: 5.95, redStep: 0.15,
    ring: 6.9, ringStep: 0.06, ringD: 0.55, arcs: 7.35, arcsD: 0.5, closed: 7.9,
  };
  // the ending, in seconds before the end of the scene: the ring and the badges collapse into the orb (collapse,
  // collapseD), then the orb flies to INTRO_ORB (fly, flyD), landing 0.1 s before the cut
  const END = { collapse: 1.65, collapseD: 0.45, fly: 1.2, flyD: 1.1 };
  // how far each spark trailing the flying orb lags behind it, in progress
  const TRAIL = [0.05, 0.1, 0.15, 0.2];

  // The angle of ring node k, degrees from the x axis (clockwise on screen)
  const nodeDeg = k => RING.first + k * 360 / RING.n;
  // The point at angle deg on a circle of radius r round the ring's center, in the ring box (2 * size px wide)
  const ringPoint = (deg, r, size) => {
    const a = deg * Math.PI / 180;
    return [size + Math.cos(a) * r, size + Math.sin(a) * r];
  };

  scene({
    pre: 1.0,
    // a hard cut: the orb lands on chapter 1's board, where chapter 1 opens on it
    fadeOut: 0,
    // presenter mode holds on the closed ring, then plays the collapse and the flight into chapter 1 in one go
    holdBeforeEnd: END.collapse + 0.1,
    subs: [
      {
        text: "AI agents now read our emails, change our data and spend our money. What happens when one goes wrong?",
        // the ring closes at c[0] + 7.9, then holds before the collapse and the flight
        after: 2.4,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // soft halos behind the visual, violet and red (the hijack), inside the content frame
      s.halo = E(root, '', '', { width: '600px', height: '600px', borderRadius: '50%',
        background: haloBackground(0.2, 0.09, 40, 68) });
      s.redHalo = E(root, '', '', { width: '600px', height: '600px', borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${RGB.red},.26) 0%, rgba(${RGB.red},.1) 40%, rgba(${RGB.red},0) 68%)` });
      s.t = makeTitleBlock(root, 'AN EXPLAINER FOR EVERYONE', 'Who keeps an AI agent<br>in check?',
        'REAL INCIDENTS, AND HOW TEMPORAL HELPS', { titleFont: 100, titleLineHeight: 1.04 });

      // the ring's arcs, in a box of their own round the ring's center, which the collapse shrinks
      const box = RING.r + 40;
      s.ringBox = E(root, `<svg width="${2 * box}" height="${2 * box}" style="display:block;overflow:visible">`
        + '<defs></defs></svg>', '', { width: 2 * box + 'px', height: 2 * box + 'px' });
      s.ringBox.style.filter = `drop-shadow(0 0 8px rgba(${RGB.violet},.6))`;
      const svg = s.ringBox.querySelector('svg');
      s.arcs = Array.from({ length: RING.n }, (_, k) => {
        const [x0, y0] = ringPoint(nodeDeg(k) + RING.gap, RING.r, box);
        const [x1, y1] = ringPoint(nodeDeg(k + 1) - RING.gap, RING.r, box);
        return path(svg, `M ${x0} ${y0} A ${RING.r} ${RING.r} 0 0 1 ${x1} ${y1}`, C.uv, 3, false);
      });
      s.ripples = makeRipples(root, 2, RGB.violet);

      s.orb = makeModelOrb(root, INTRO_ORB);
      s.orb.label.style.opacity = 0;
      s.trail = TRAIL.map((_, i) => makeSpark(root, 16 - 2 * i, RGB.violet));
      s.badges = BADGES.map(({ icon }) => {
        const badge = E(root, ICON(icon, BADGE.icon, C.ink, 1.7), 'tile', {
          width: BADGE.size + 'px', height: BADGE.size + 'px', borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        });
        badge.icon = badge.querySelector('svg');
        return badge;
      });
      s.nodes = Array.from({ length: RING.n }, () => E(root,
        `<img src="${TEMPORAL_SYMBOL}" style="width:${RING.symbol}px;height:${RING.symbol}px;display:block">`,
        'tile', {
          width: RING.node + 'px', height: RING.node + 'px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', borderColor: C.uv, background: C.temporalSurface,
        }));
      // the flash covers the stage, outside the camera
      s.flash = makeFlash(stage);
    },
    update(t, c, s) {
      const hijackAt = c[0] + T0.hijack;
      const closedAt = c[0] + T0.closed;
      const collapseAt = this.dur - END.collapse;
      const flyAt = this.dur - END.fly;

      // the camera zooms in with the fade-in and rests at the end (the match cut); the hijack jolts it
      const [jx, jy] = shake(t, hijackAt, 10, 0.45);
      setCamera(s.cam, t, this.dur, { exit: 1, dx: jx, dy: jy });
      placeFlash(s.flash, t, hijackAt + 0.05, 0.22);

      // the title rises in, and fades out in place as the orb takes off
      rise(s.t, TITLE.x, TITLE.y, P(t, 0.15, 0.9));
      s.t.style.opacity = P(t, 0.15, 0.9) * (1 - P(t, flyAt - 0.2, 0.5));

      // the agent goes wrong, then the closed ring calms it
      const hijack = P(t, hijackAt - 0.1, 0.25) * (1 - P(t, closedAt, 0.4));
      const collapse = P(t, collapseAt, END.collapseD, easeIn);
      const visualO = P(t, c[0] + T0.orb, 0.9) * (1 - collapse);
      place(s.halo, VISUAL.x, VISUAL.y, 1 + 0.04 * Math.sin(G * 1.4), visualO * (1 - hijack));
      place(s.redHalo, VISUAL.x, VISUAL.y, 1 + 0.04 * Math.sin(G * 1.4), visualO * hijack);

      // the orb: it pops in, looks round while idle, glitches red when hijacked; it ends idle, looking ahead
      // (look 0), then flies along a low arc to chapter 1's board, shrinking to its board size
      const pop = backPop(t, c[0] + T0.orb, 0.9);
      const fly = P(t, flyAt, END.flyD);
      const route = [[VISUAL.x, VISUAL.y], [VISUAL.x - 230, VISUAL.y - 185], [620, 300], [INTRO_ORB.x, INTRO_ORB.y]];
      const flightAt = p => ({ xy: bezier(route, p), k: lerp(ORB_SCALE, 1, p) });
      const now = flightAt(fly);
      place(s.orb.el, now.xy[0], now.xy[1], pop.s * now.k, pop.o);
      const look = Math.sin(G * 0.8) * 0.6 * (1 - P(t, collapseAt - 0.4, 0.4));
      s.orb.set(hijack > 0 ? 'hijacked' : 'idle', { mix: hijack, look });
      // violet sparks trail the orb while it flies
      s.trail.forEach((spark, i) => {
        const lag = flightAt(Math.max(0, fly - TRAIL[i]));
        const o = fly > 0 && fly < 1 ? (0.6 - 0.12 * i) * Math.min(1, fly * 5, (1 - fly) * 5) : 0;
        place(spark, lag.xy[0], lag.xy[1], 1, o);
      });

      // the badges orbit on G, swell as they are named, flash red when the agent goes wrong, and collapse into the
      // orb at the end
      let redIndex = 0;
      s.badges.forEach((badge, i) => {
        const at = orbitAt(i, s.badges.length, ORBIT);
        const badgePop = backPop(t, c[0] + T0.badges + i * 0.15, 0.6);
        const named = swell(t, c[0] + T0.named[i], 0.18);
        let red = 0;
        if (BADGES[i].red) {
          const redAt = hijackAt + redIndex * T0.redStep;
          red = P(t, redAt, 0.08) * (1 - P(t, closedAt + redIndex * 0.08, 0.3));
          redIndex += 1;
        }
        const x = lerp(at.x, VISUAL.x, collapse), y = lerp(at.y, VISUAL.y, collapse);
        place(badge, x, y, badgePop.s * named * (1 - 0.7 * collapse), badgePop.o * at.depth * (1 - collapse));
        badge.style.borderColor = red > 0.5 ? C.red : C.line;
        badge.icon.setAttribute('stroke', red > 0.5 ? C.red : C.ink);
        badge.style.boxShadow = glowShadow(RGB.red, red, { blur: 28, alpha: 0.7 });
      });

      // the ring: its nodes spiral in from outside, its arcs draw between them, and it swells as it closes
      const closing = swell(t, closedAt, 0.03);
      const ringScale = closing * (1 - collapse);
      s.nodes.forEach((node, k) => {
        const p = P(t, c[0] + T0.ring + k * T0.ringStep, T0.ringD, easeOut);
        const deg = nodeDeg(k) + 40 * (1 - p);
        const r = (RING.r + 140 * (1 - p)) * ringScale;
        const a = deg * Math.PI / 180;
        place(node, VISUAL.x + Math.cos(a) * r, VISUAL.y + Math.sin(a) * r, 1 - 0.6 * collapse,
          P(t, c[0] + T0.ring + k * T0.ringStep, 0.2) * (1 - collapse));
        node.style.boxShadow = glowShadow(RGB.violet, Math.max(0, 1 - Math.abs(t - closedAt - 0.1) / 0.5),
          { blur: 24, alpha: 0.8 });
      });
      place(s.ringBox, VISUAL.x, VISUAL.y, ringScale, 1 - collapse);
      s.arcs.forEach((arc, k) => draw(arc, P(t, c[0] + T0.arcs + k * 0.03, T0.arcsD)));
      placeRipples(s.ripples, t, closedAt, VISUAL.x, VISUAL.y, 2 * RING.r, 2 * RING.r + 220, { d: 0.9, step: 0.2 });
    }
  });
}
