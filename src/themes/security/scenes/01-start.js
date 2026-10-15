// ===================== 1. WHERE THE DATA STARTS
// The journey lane draws in, stroke by stroke, around the payload card the intro flew into the Worker: YOUR
// ENVIRONMENT with the Worker, the wire, TEMPORAL with an empty Event History. The camera visits your environment,
// then pulls back as the Worker polls Temporal, outward only, and a probe from outside bounces off the environment's
// closed door. The chapter ends pushing in on the wire's start (WIRE_SHOT), the first frame of chapter 2.
// The block keeps every name declared in this file local to this scene.
{
  // camera framings, [x, y, scale] for shot(): the whole lane, then your environment
  const REST = [960, 515, 1];
  const ENV_SHOT = [440, 515, 1.1];
  // the push-in on the wire's start that ends the chapter: it starts PUSH_BEFORE_END seconds before the end and
  // lands 0.15 s before the cut
  const PUSH_BEFORE_END = 1.3;
  const PUSH_D = 1.15;
  // when each stroke of the lane starts to draw, in seconds from c[0] (the scene opens 0.6 s before it): the Worker
  // panel's outline round the card, the environment's dashed edge, the wire, TEMPORAL's outline, the Event History's
  // frame. Each panel fills in as its outline closes.
  const DRAW = { worker: -0.5, env: -0.25, wire: 0.5, temporal: 0.8, history: 1.4 };
  // the poll pulses on the wire: POLLS of them in flight, each crossing in POLL_PERIOD seconds
  const POLLS = 2;
  const POLL_PERIOD = 1.6;
  const POLL_X = [TUBE.x0 + 10, LANE.temporal.x - 10];
  // the inbound probe, in seconds from c[1]: from outside, between the two zones, it flies to the closed door, hits
  // it and bounces off; the NO INBOUND PORTS tag slams in just after
  const PROBE = { at: 4.0, d: 0.5, slam: 0.2, slamD: 0.16 };
  const PROBE_PATH = `M 1080 860 Q 960 770 ${LANE.door.x + 32} ${LANE.door.y + 2}`;
  // the annotations: OUTBOUND ONLY above the wire, NO INBOUND PORTS beside the door, both centered between the zones
  const TAG_X = (LANE.wire.x0 + LANE.wire.x1) / 2;
  const OUTBOUND = { y: LANE.wire.y - 46, w: 240 };
  const NO_INBOUND = { y: LANE.door.y, w: 282 };

  scene({
    chapter: 1, title: 'Where the data starts',
    // hard cuts: the intro ends on this chapter's first frame, this chapter on the next one's
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the whole lane, then plays the push-in and the cut into chapter 2 in one go
    holdBeforeEnd: PUSH_BEFORE_END,
    subs: [
      { text: "Nora sends €25,000 to Leo. The transfer Workflow runs in a <b>Worker</b>, in your own environment." },
      // the probe and the slam, then a hold to read the tags before the push-in
      {
        text: "Temporal never runs your code: the Worker calls out to Temporal, with no inbound port open.",
        after: 1.4,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.lane = makeLane(root);
      // the outlines the panels draw in with, under them in the lane's SVG layer
      const outline = ({ x, y, w, h }, color) => path(s.lane.svg, roundRectD(x - w / 2, y - h / 2, w, h, 10), color, 2,
        false);
      s.outlines = {
        worker: outline(LANE.worker, C.violet),
        temporal: outline({ ...LANE.temporal, x: LANE.temporal.x + LANE.temporal.w / 2,
          y: LANE.temporal.y + LANE.temporal.h / 2 }, C.uv),
        history: outline(LANE.history, C.ink),
      };
      s.probe = path(s.lane.svg, PROBE_PATH, C.red, 3, false);
      s.polls = Array.from({ length: POLLS }, () => makeSpark(root, 12, RGB.violet));
      s.probeHead = makeSpark(root, 14, RGB.red);
      s.bounce = makeSpark(root, 14, RGB.red);
      s.ripples = makeRipples(root, 3, RGB.red);
      s.outbound = fixedTag(root, 'Outbound only', 'violet solid', OUTBOUND.w);
      s.noInbound = fixedTag(root, 'No inbound ports', '', NO_INBOUND.w);
      // opaque, over the probe's path
      s.noInbound.style.background = C.bg;
      s.card = makePayload(root, { w: PAYLOAD_IN_WORKER.w });
    },
    update(t, c, s) {
      const pushAt = this.dur - PUSH_BEFORE_END;
      const hitAt = c[1] + PROBE.at + PROBE.d;
      const slamAt = hitAt + PROBE.slam;
      const landed = slamAt + PROBE.slamD;

      // the camera: the whole lane while it draws in, your environment, the whole lane again as the Worker calls
      // out, then the push-in on the wire; the slam shakes it
      const cam = shot(t, REST, [
        [c[0] + 2.8, ...ENV_SHOT, 1.1], [c[1] + 0.2, ...REST, 1.0], [pushAt, ...WIRE_SHOT, PUSH_D],
      ]);
      const [shakeX, shakeY] = shake(t, landed, 9, 0.35);
      setCamera(s.cam, t, this.dur, { ...cam, dx: cam.dx + shakeX, dy: cam.dy + shakeY, enter: 1, exit: 1 });

      // the push-in dims what it pushes off the frame (WIRE_LANE) and clears the annotations
      const push = P(t, pushAt, PUSH_D);
      const clear = 1 - P(t, pushAt, 0.4);
      const dim = k => lerp(1, k, push);

      // the lane draws in, stroke by stroke; each panel fills in as its outline closes, the outline fading under it
      const strokeAt = part => c[0] + DRAW[part];
      const fill = (part, d) => P(t, strokeAt(part) + d - 0.15, 0.3);
      placeLane(s.lane, {
        env: P(t, strokeAt('env') + 0.8, 0.4) * dim(WIRE_LANE.env),
        temporal: fill('temporal', 0.7) * dim(WIRE_LANE.temporal),
        worker: fill('worker', 0.6),
        history: fill('history', 0.5) * dim(WIRE_LANE.history),
        door: P(t, c[1] + 3.4, 0.25),
        heads: dim(WIRE_LANE.heads),
      });
      s.lane.envEdges.forEach(edge => drawDashed(edge, P(t, strokeAt('env'), 1.1), dim(WIRE_LANE.env)));
      draw(s.lane.wire, P(t, strokeAt('wire'), 0.5));
      draw(s.outlines.worker, P(t, strokeAt('worker'), 0.6), 1 - P(t, strokeAt('worker') + 0.6, 0.3));
      draw(s.outlines.temporal, P(t, strokeAt('temporal'), 0.7), 1 - P(t, strokeAt('temporal') + 0.7, 0.3));
      draw(s.outlines.history, P(t, strokeAt('history'), 0.5), 1 - P(t, strokeAt('history') + 0.5, 0.3));
      // the card stays in the Worker, in clear, where the intro landed it
      place(s.card, PAYLOAD_IN_WORKER.x, PAYLOAD_IN_WORKER.y);

      // the captions, each as its subtitle names it: your code runs in your environment, never in Temporal
      s.lane.env.cap.style.opacity = P(t, c[0] + 4.0, 0.4) * clear;
      s.lane.env.cap.style.transform = `scale(${swell(t, c[0] + 4.1, 0.08)})`;
      s.lane.temporal.cap.style.opacity = P(t, c[1] + 1.4, 0.4) * clear;
      s.lane.temporal.cap.style.transform = `scale(${swell(t, c[1] + 1.5, 0.08)})`;

      // the Worker calls out: poll pulses run to TEMPORAL, outward only, on the ambient clock; OUTBOUND ONLY
      const polling = P(t, c[1] + 2.2, 0.4) * clear;
      s.polls.forEach((spark, k) => {
        const p = (G / POLL_PERIOD + k / POLLS) % 1;
        place(spark, lerp(POLL_X[0], POLL_X[1], p), LANE.wire.y, 1, polling * Math.min(1, p * 6, (1 - p) * 6));
      });
      const outPop = backPop(t, c[1] + 2.6);
      place(s.outbound, TAG_X, OUTBOUND.y, outPop.s, outPop.o * clear);

      // the probe: it speeds to the door and hits it, red ripples ring out, the door flashes red, and the probe
      // bounces back a little way as it fades
      const probe = P(t, c[1] + PROBE.at, PROBE.d, easeIn);
      draw(s.probe, probe, 1 - P(t, hitAt, 0.35));
      sparkOnPath(s.probeHead, s.probe, probe);
      const bounced = P(t, hitAt, 0.45, easeOut);
      sparkOnPath(s.bounce, s.probe, t >= hitAt ? 1 - 0.22 * bounced : 0);
      if (t >= hitAt) s.bounce.style.opacity = 1 - bounced;
      placeRipples(s.ripples, t, hitAt, LANE.door.x, LANE.door.y, 56, 260, { d: 0.9, step: 0.18 });
      if (t >= hitAt && t < hitAt + 0.45) {
        s.lane.door.style.borderColor = C.red;
        s.lane.door.icon.setAttribute('stroke', C.red);
      }
      // NO INBOUND PORTS slams in from above its size, and the landing shakes the camera
      const slam = P(t, slamAt, PROBE.slamD, easeIn);
      place(s.noInbound, TAG_X, NO_INBOUND.y, lerp(1.7, 1, slam), P(t, slamAt, 0.08, linear) * clear);
    }
  });
}
