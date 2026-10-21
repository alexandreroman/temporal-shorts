// ===================== INTRO
// Title on the left; on the right, the TEMPORAL PROXY box, with three Workers (Go, Java, TypeScript) whose lines
// converge into it and one violet connection leaving it, light flowing along them. A neon 1.0 badge slams onto the
// box, with rings. At the end the proxy goes: its lines pull back into the Workers, the box shrinks away, and the
// Workers fly out into the six slots of the bare fleet as YOUR ENVIRONMENT and TEMPORAL fade in round them: chapter
// 1 opens on that frame (placeBareFleet). The visual lives in a camera layer held at WIDE_SHOT, chapter 1's framing.
// The block keeps every name declared in this file local to this scene.
{
  // the title block, on the stage (outside the camera): its center
  const TITLE = { x: 560, y: 515 };
  // the visual, in stage px seen through WIDE_SHOT: the proxy box, drawn larger (k), with its glow; the three Workers
  // on its left (x, the y of each, a tile's size), the first row of the fleet (WORKERS 0 to 2), in that order; the
  // lines converge from the Workers' right edges to the box's left edge, ending `spread` px apart; the violet
  // connection leaves the box's right edge for x1
  const BOX = { x: 1520, y: WIRE_Y, k: 1.3 };
  const MINI = { x: 1150, ys: [WIRE_Y - 175, WIRE_Y, WIRE_Y + 175], w: 160, h: 68 };
  const LINES = { x0: MINI.x + MINI.w / 2 + 4, x1: BOX.x - BOX.k * PROXY.w / 2 - 4, spread: 48 };
  const OUT = { x0: BOX.x + BOX.k * PROXY.w / 2, x1: 1880 };
  // from the start: the box pops in (box), the Workers pop in one after the other (minis, miniStep), their lines draw
  // (lines, lineStep, lineD), then the connection out (out, outD); the light flows from `flow`
  const T = { box: 0.5, minis: 0.9, miniStep: 0.12, lines: 1.4, lineStep: 0.12, lineD: 0.6, out: 2.0, outD: 0.5,
    flow: 2.4 };
  // from c[0]: the 1.0 badge slams onto the box as the subtitle reads "1.0" (slam, slamD)
  const BADGE = { slam: 1.55, slamD: 0.16 };
  // the ending, from END_BEFORE seconds before the end of the scene: the title fades (title), the lines and the
  // connection pull back (retract, retractD), the box shrinks away (box, boxD), the zones fade in (zones, zonesD), the
  // Workers fly to their slots (fly, flyD; the full tile takes over from the small one while it flies, over swap) and
  // the copies peel off them down to the second row (copies, copyStep, copyD). Every move lands 0.1 s before the cut.
  const END_BEFORE = 1.4;
  const END = {
    title: -0.1, retract: 0, retractD: 0.4, box: 0.05, boxD: 0.5, zones: 0.3, zonesD: 0.7, fly: 0.15, flyD: 0.9,
    swap: [0.35, 0.65], copies: 0.6, copyStep: 0.08, copyD: 0.54,
  };

  // A small Worker tile: its gear and its language's logo, larger than in a fleet tile (gearSpin turns the gear)
  const makeMini = (root, worker) => {
    const logo = LANGUAGE_LOGOS[worker.lang];
    const tile = E(root,
      `<div class="gear">${ICON('gear', 30, C.ink, 1.8)}</div>`
      + `<img src="${logo.url}" alt="" width="${logo.w * 1.4}" height="${logo.h * 1.4}" style="display:block;`
      + `filter:url(#${INK_FILTER_ID})">`,
      'tile', {
        width: MINI.w + 'px', height: MINI.h + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '18px', borderColor: C.violet,
      });
    tile.gear = tile.querySelector('.gear');
    return tile;
  };

  scene({
    pre: 1.0,
    // a hard cut: the bare fleet that the visual opens into is chapter 1's first frame
    fadeOut: 0,
    // presenter mode holds on the box with its badge, then plays the ending into chapter 1 in one go
    holdBeforeEnd: END_BEFORE,
    subs: [
      // a hold on the badge before the ending
      { text: "Meet <b>Temporal Proxy</b> 1.0: released on October 16, 2026, and ready for production.", after: 1.5 },
    ],
    build(stage, s) {
      // the bare fleet first, in chapter 1's order, so the cut shows the same stack; the visual over it
      const root = s.cam = makeCamera(stage);
      s.fleet = makeFleet(root, TEMPORAL_LINK_END);
      // a soft glow behind the box, sized to stay inside the content frame: the layout check counts it
      s.glow = E(root, '', '', {
        width: '600px', height: '600px', borderRadius: '50%', background: haloBackground(0.2, 0.08, 40, 68),
      });
      s.svg = svgLayer(root);
      s.lines = MINI.ys.map((y, i) => {
        const endY = BOX.y + (i - 1) * LINES.spread;
        return path(s.svg, sCurveD(LINES.x0, y, LINES.x1, endY), C.slate, 2.5, false);
      });
      s.out = path(s.svg, `M ${OUT.x0} ${BOX.y} L ${OUT.x1} ${BOX.y}`, C.violet, 3);
      s.minis = MINI.ys.map((_, i) => makeMini(root, WORKERS[i]));
      s.sparks = s.lines.map(() => makeSpark(root, 10, RGB.violet));
      s.outSparks = [0, 1].map(() => makeSpark(root, 12, RGB.violet));
      s.box = makeProxy(root);
      s.badge = makeVersionBadge(root);
      s.rings = makeRipples(root, 2, RGB.neon);
      s.title = makeTitleBlock(stage, 'PRODUCT NEWS, OCTOBER 2026', 'Temporal Proxy<br>1.0',
        'SECURITY MOVES OUT OF YOUR WORKERS');
    },
    update(t, c, s) {
      const endAt = this.dur - END_BEFORE;
      const end = (key, d) => P(t, endAt + END[key], d);

      // the camera holds chapter 1's wide shot
      const cam = shot(t, WIDE_SHOT, []);
      setCamera(s.cam, t, this.dur, { ...cam, enter: 1, exit: 1 });

      // the title rises in, and fades out in place as the ending starts
      rise(s.title, TITLE.x, TITLE.y, P(t, 0.15, 0.9));
      s.title.style.opacity = P(t, 0.15, 0.9) * (1 - end('title', 0.5));

      // the bare fleet, as chapter 1 opens on it; until the ending, only its parts that fly in show
      placeBareFleet(s.fleet, cam);
      const zonesO = end('zones', END.zonesD);
      placeZones(s.fleet.lane, {
        envZone: FLEET_ZONES.env, temporalZone: FLEET_ZONES.temporal, env: zonesO, temporal: zonesO,
      });

      // the Workers: each small tile pops in, then flies to its slot as it grows into the fleet's tile, which takes
      // over halfway; the copies peel off them down to the second row
      const fly = end('fly', END.flyD);
      const swap = clamp((fly - END.swap[0]) / (END.swap[1] - END.swap[0]));
      const miniK = MINI.w / WORKER_TILE.w;
      s.minis.forEach((mini, i) => {
        const slot = WORKERS[i];
        const pop = backPop(t, T.minis + i * T.miniStep);
        const x = lerp(MINI.x, slot.x, fly), y = lerp(MINI.ys[i], slot.y, fly);
        // at the same size on screen as the fleet tile it turns into
        const k = lerp(1, 1 / miniK, fly);
        gearSpin(mini, 1);
        place(mini, x, y, pop.s * k, pop.o * (1 - swap));
        place(s.fleet.tiles[i], x, y, lerp(miniK, 1, fly), swap);
      });
      s.fleet.tiles.slice(3).forEach((tile, i) => {
        const from = WORKERS[i], slot = WORKERS[i + 3];
        const copy = P(t, endAt + END.copies + i * END.copyStep, END.copyD);
        place(tile, lerp(from.x, slot.x, copy), lerp(from.y, slot.y, copy), lerp(0.92, 1, copy), clamp(copy * 6));
      });

      // the lines converge into the box, then pull back into the Workers; the light flows along them
      const retract = 1 - end('retract', END.retractD);
      const flow = P(t, T.flow, 0.5) * retract;
      s.lines.forEach((line, i) => {
        draw(line, P(t, T.lines + i * T.lineStep, T.lineD) * retract);
        sparkOnPath(s.sparks[i], line, (G / PROXY_FLOW_PERIOD + i / s.lines.length) % 1, flow);
      });
      draw(s.out, P(t, T.out, T.outD) * retract);
      s.outSparks.forEach((spark, k) => sparkOnPath(spark, s.out, (G / (PROXY_FLOW_PERIOD / 2) + k / 2) % 1, flow));

      // the box pops in; at the ending, it shrinks away with its badge and glow
      const boxPop = backPop(t, T.box, 0.6);
      const gone = end('box', END.boxD);
      const boxK = BOX.k * boxPop.s * (1 - 0.45 * gone);
      const slamAt = c[0] + BADGE.slam;
      const hitAt = slamAt + BADGE.slamD;
      const hitGlow = Math.max(0, 1 - Math.abs(t - hitAt) / 0.6);
      place(s.box, BOX.x, BOX.y, boxK, boxPop.o * (1 - gone));
      setProxyGlow(s.box, hitGlow);
      place(s.glow, BOX.x, BOX.y, 1 + 0.04 * Math.sin(G * 1.4), P(t, T.box, 0.9) * (0.75 + 0.25 * hitGlow) * (1 - gone));

      // the dramatic beat: the 1.0 badge slams onto the box from above its size, with neon rings and a swell of the
      // box's glow
      const slam = P(t, slamAt, BADGE.slamD, easeIn);
      const badgeY = BOX.y + boxK * VERSION_BADGE.dy;
      place(s.badge, BOX.x, badgeY, boxK * lerp(1.8, 1, slam), P(t, slamAt, 0.08, linear) * (1 - gone));
      placeRipples(s.rings, t, hitAt, BOX.x, badgeY, 120, 420, { d: 0.9, step: 0.18 });
    }
  });
}
