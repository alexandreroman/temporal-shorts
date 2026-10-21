// ===================== 1. SECURITY IN EVERY TEAM
// Opens on the bare fleet that the intro ends on (placeBareFleet), in WIDE_SHOT, and holds that framing (the alarm
// shakes it). A light sweeps over the Workers as the subtitle reads "every Worker"; then each Worker stacks the same
// four chips (ADDRESS, CERTIFICATE, API KEY, CODEC) in step with the words and opens a connection of its own to
// Temporal, which lists the six connections. Then the Workers get their teams (PAYMENTS, ORDERS, FRAUD, a column of
// two Workers each) and their chips diverge as each team wires its own: a codec version per Worker, certificates
// expiring, API keys in env vars, until no two Workers match. A red NO CENTRAL CONTROL verdict slams in under the
// Workers with a flash, a shake and rings. Then every chip drops off every Worker and the teams, the verdict, the
// connections and the list go, leaving the bare fleet that chapter 2 opens on.
// The block keeps every name declared in this file local to this scene.
{
  // from c[0]: the light sweeps over the Workers (every, everyStep from one column to the next, everyD); each chip
  // drops into its slot as the subtitle names it (chips, chipStep from one Worker to the next, chipD); each Worker's
  // connection draws once its address is in (link, linkD); then light flows along the connections (flow)
  const T0 = {
    every: 0.9, everyStep: 0.12, everyD: 0.4, chips: [2.5, 3.1, 3.45, 4.1], chipStep: 0.07, chipD: 0.35, link: 0.2,
    linkD: 0.6, flow: 4.6,
  };
  // from c[1]: the team tags pop in, one column after the other, on "With many teams" (teams, teamStep); every
  // Worker's codec flips to its own on "each wires its own" (codecs, codecStep from one Worker to the next); the risky
  // chips flip on "security varies from one Worker to the next" (risks, riskStep); a chip flips over flipD; NO CENTRAL
  // CONTROL slams in (slam, slamD)
  const T1 = {
    teams: 0.3, teamStep: 0.15, codecs: 1.3, codecStep: 0.1, risks: 2.6, riskStep: 0.3, flipD: 0.35, slam: 4.5,
    slamD: 0.16,
  };
  // the ending, in seconds before the end: the chips fall off (fall), each after a hashed delay (up to spread), over
  // fallD; the team tags, the verdict and the connections clear (clear). Everything has gone 0.4 s before the cut.
  const END = { fall: 1.6, spread: 0.5, fallD: 0.7, clear: 0.45 };
  // the chips that diverge (slots of WORKER_CHIPS)
  const CERTIFICATE = 1;
  const API_KEY = 2;
  const CODEC = 3;
  // each Worker's team (in WORKERS order: a team per column) and the codec it wires; no two Workers end up alike
  const TEAMS = ['Payments', 'Orders', 'Fraud'];
  const CODEC_LABELS = ['Codec v1', 'Codec v2', 'Custom codec', 'Codec v2', 'Codec v1', 'Custom codec'];
  // the risky chips, in playing order (a sweep from one Worker to the next): the Worker, the slot, the new label;
  // they turn red
  const RISKS = [
    { worker: 1, chip: CERTIFICATE, label: 'Cert expiring' },
    { worker: 4, chip: API_KEY, label: 'Key in env var' },
    { worker: 2, chip: API_KEY, label: 'Key in env var' },
    { worker: 5, chip: CERTIFICATE, label: 'Cert expiring' },
  ];
  // the order the codecs flip in: down each column, from left to right
  const CODEC_ORDER = [0, 3, 1, 4, 2, 5];
  // a team tag: its size and font, px (16 px: 14 px on screen at 0.88), in the top right corner of its Worker tile,
  // centered on the gear's row (y from the tile's top), 20 px clear of WORKER on its left (on screen)
  const TEAM_TAG = { w: 104, h: 28, font: 16, y: 31 };
  // the verdict under the Workers (UNDER_WORKERS): its font, px, 19.4 px on screen at 0.88; 20 px clear of the bottom
  // row and of the environment's bottom edge
  const VERDICT_FONT = 22;
  // TEMPORAL's list of the six connections, under its logo, as far under it as the Workers are under their zone's
  // heading (its label's top level with theirs): its center x, its label's top and line height, the rows' top, pitch,
  // height, width (45 px inside TEMPORAL's sides) and font
  const LIST = {
    x: FLEET.temporal.x + FLEET.temporal.w / 2, label: FLEET.rows[0] - WORKER_TILE.h / 2, labelH: 22, pitch: 50, h: 36,
    w: FLEET.temporal.w - 90, font: 20,
  };
  LIST.top = LIST.label + 44;

  // A team tag (TEAM_TAG): the team's name in violet capitals, in a violet outline. It stays hidden until placed.
  const makeTeamTag = (root, team) => E(root, team.toUpperCase(), 'mono', {
    width: TEAM_TAG.w + 'px', height: TEAM_TAG.h + 'px', lineHeight: (TEAM_TAG.h - 2) + 'px', textAlign: 'center',
    fontSize: TEAM_TAG.font + 'px', letterSpacing: '.1em', paddingLeft: '.1em', color: C.violet,
    border: `1px solid ${C.violet}`, borderRadius: 'var(--rs)', background: `rgba(${RGB.violet},.14)`,
  });
  // The label a chip shows at time t, and whether it reads as a risk: its own label until its flip (at, or never
  // with no variant) is halfway through, then the variant's
  const chipLabel = (t, k, variant, at) => {
    if (variant && t >= at + T1.flipD / 2) return variant;
    return { label: WORKER_CHIPS[k][1], risky: false };
  };
  // Sets a chip's label and look: red text, icon and outline for a risk, the chip's own look otherwise (its text in
  // the tile's color); the neon outline while it flips
  const setChipLook = (chip, { label, risky }, flipping) => {
    setText(chip.label, label.toUpperCase());
    chip.label.style.color = risky ? C.red : '';
    chip.icon.setAttribute('stroke', risky ? C.red : C.violet);
    chip.style.borderColor = flipping ? C.neon : risky ? C.red : C.lineLight;
  };

  scene({
    chapter: 1, title: 'Security in every team',
    // hard cuts: the intro ends on this chapter's first frame, this chapter on the next one's (placeBareFleet)
    fadeIn: 0, fadeOut: 0,
    // presenter mode holds on the verdict, then plays the fall and the cut in one go
    holdBeforeEnd: END.fall + 0.1,
    subs: [
      { text: "Without it, every Worker carries an address, credentials and encryption code.", after: 0.3 },
      // the verdict, then a hold on it before the fall
      { text: "With many teams, each wires its own: security varies from one Worker to the next.", after: 1.2 },
    ],
    build(stage, s) {
      // the bare fleet first, in the intro's order, so the cut shows the same stack
      const root = s.cam = makeCamera(stage);
      s.fleet = makeFleet(root, TEMPORAL_LINK_END);
      s.fleet.tiles.forEach(tile => tile.chips.forEach(chip => {
        chip.label = chip.querySelector('span');
        chip.icon = chip.querySelector('svg');
      }));
      s.listLabel = E(root, 'Connections', 'lbl', {
        fontSize: '17px', lineHeight: LIST.labelH + 'px', width: LIST.w + 'px', paddingLeft: '0',
      });
      s.rows = WORKERS.map((w, i) => makeConnectionRow(root, `worker-${i + 1}`, w.lang, LIST));
      s.teams = WORKERS.map(w => makeTeamTag(root, TEAMS[w.col]));
      s.sparks = WORKERS.map(() => makeSpark(root, 12, RGB.violet));
      s.alarm = makeRipples(root, 2, RGB.red);
      // the theme's red verdict look, as tall as the tags under the Workers
      s.verdict = statusTag(root, { font: VERDICT_FONT, icon: VERDICT_FONT });
      s.verdict.style.height = UNDER_WORKERS.h + 'px';
      // the flash covers the stage, outside the camera
      s.flash = makeFlash(stage);
      // each Worker's variants, by slot: { label, risky }, and when each starts to flip, from c[1]
      s.variants = WORKERS.map(() => []);
      s.flipAt = WORKERS.map(() => []);
      CODEC_ORDER.forEach((w, i) => {
        s.variants[w][CODEC] = { label: CODEC_LABELS[w], risky: false };
        s.flipAt[w][CODEC] = T1.codecs + i * T1.codecStep;
      });
      RISKS.forEach(({ worker, chip, label }, i) => {
        s.variants[worker][chip] = { label, risky: true };
        s.flipAt[worker][chip] = T1.risks + i * T1.riskStep;
      });
    },
    update(t, c, s) {
      const hitAt = c[1] + T1.slam + T1.slamD;
      const fallAt = this.dur - END.fall;
      const cleared = 1 - P(t, fallAt, END.clear);

      // the camera holds the wide shot; the verdict shakes it
      const cam = shot(t, WIDE_SHOT, []);
      const [shakeX, shakeY] = shake(t, hitAt, 10, 0.4);
      setCamera(s.cam, t, this.dur, { ...cam, dx: cam.dx + shakeX, dy: cam.dy + shakeY, enter: 1, exit: 1 });
      placeFlash(s.flash, t, hitAt, 0.3);

      // the bare fleet, as the intro left it; this chapter's chips, tags, connections and borders go over it
      placeBareFleet(s.fleet, cam);

      // the Workers: the light sweeps over them, then each gets its chips, one at a time, as the subtitle names them
      // (all six get all four); some chips flip to the Worker's own variant; every chip falls off at the end, each
      // after a hashed delay
      s.fleet.tiles.forEach((tile, w) => {
        const slot = WORKERS[w];
        tile.chips.forEach((chip, k) => {
          const at = c[0] + T0.chips[k] + w * T0.chipStep;
          const fall = P(t, fallAt + chipFallDelay(w, k, END.spread), END.fallD, linear);
          if (t < at || fall >= 1) return;
          // it turns edge-on and back as it flips, and shows its variant from halfway
          const variant = s.variants[w][k];
          const flipAt = c[1] + (s.flipAt[w][k] ?? Infinity);
          const flip = P(t, flipAt, T1.flipD, linear);
          const flipping = flip > 0 && flip < 1;
          setChipLook(chip, chipLabel(t, k, variant, flipAt), flipping);
          // it drops into its slot with a little bounce
          const drop = P(t, at, T0.chipD, backOut);
          const squash = flipping ? ` scaleY(${Math.abs(Math.cos(Math.PI * flip)).toFixed(3)})` : '';
          chip.style.opacity = P(t, at, 0.15) * (1 - fall);
          chip.style.transform = chipDropTransform(w, k, drop, fall) + squash;
        });
        const everyAt = c[0] + T0.every + slot.col * T0.everyStep;
        const sweeping = t >= everyAt && t < everyAt + T0.everyD;
        tile.style.borderColor = sweeping ? C.neon : C.violet;

        // its team tag pops in with its column, top right on the tile
        const team = popIn(t, c[1] + T1.teams + slot.col * T1.teamStep);
        const tagX = slot.x + WORKER_TILE.w / 2 - WORKER_TILE.inset - TEAM_TAG.w / 2;
        place(s.teams[w], tagX, slot.y - WORKER_TILE.h / 2 + TEAM_TAG.y, team.s, team.o * cleared);
      });

      // each Worker's own connection to Temporal draws once its address is in; light runs along it on the ambient
      // clock. They go with the chips.
      const linksO = 1 - P(t, fallAt + 0.2, 0.5);
      const flow = P(t, c[0] + T0.flow, 0.5) * linksO;
      s.fleet.links.forEach((link, w) => {
        const drawAt = c[0] + T0.chips[0] + w * T0.chipStep + T0.link;
        draw(link, P(t, drawAt, T0.linkD), linksO);
        sparkOnPath(s.sparks[w], link, (G / WORKER_FLOW_PERIOD + w / WORKERS.length) % 1, flow);
        // its row in TEMPORAL's list rises in as the connection arrives
        const arrived = P(t, drawAt + T0.linkD - 0.1, 0.4);
        rise(s.rows[w], LIST.x, LIST.top + w * LIST.pitch + LIST.h / 2, arrived * linksO, 16);
      });
      const listLabel = P(t, c[0] + T0.chips[0] + T0.link + T0.linkD - 0.3, 0.4) * linksO;
      place(s.listLabel, LIST.x, LIST.label + LIST.labelH / 2, 1, listLabel);

      // the dramatic beat: NO CENTRAL CONTROL slams in under the Workers from above its size, with red rings, a red
      // flash and a shake
      setAlarmTag(s.verdict, 'NO CENTRAL CONTROL');
      const slam = P(t, c[1] + T1.slam, T1.slamD, easeIn);
      place(s.verdict, UNDER_WORKERS.x, UNDER_WORKERS.y, lerp(1.7, 1, slam),
        P(t, c[1] + T1.slam, 0.08, linear) * cleared);
      placeRipples(s.alarm, t, hitAt, UNDER_WORKERS.x, UNDER_WORKERS.y, 120, 440, { d: 0.8, step: 0.16 });
    }
  });
}
