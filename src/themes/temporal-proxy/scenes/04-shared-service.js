// ===================== 4. SECURITY AS A SHARED SERVICE
// Opens on the proxy stage that chapter 3 ends on (placeProxyStage), in PROXY_SHOT, and pulls back once, left and
// out, to SERVICE_SHOT as the fleet regroups into the shared service (placeServiceStage): YOUR ENVIRONMENT moves to
// hold the proxy inside it, a PLATFORM TEAM zone forms round the proxy, the Workers travel into their team zones
// (PAYMENTS, ORDERS, FRAUD, two Workers each) and type their team's Namespace, each team's connection draws into the
// proxy, and TEMPORAL shows a Namespace band per team. Then a POLICY panel docks under the proxy and its four rules
// tick on as the subtitle reads them. The dramatic beat: the policy sweeps out from the proxy along every team's
// connection in neon, and each team zone lights up, COVERED. It ends on the shared service at rest (SERVICE_REST),
// which chapter 5 opens on.
// The block keeps every name declared in this file local to this scene.
{
  // from c[0]: the camera pulls back (pull, pullD) as the fleet regroups (regroup, regroupD); the PLATFORM TEAM zone
  // (platform); the team zones, one after the other (teams, teamStep); ORDERS and FRAUD type their Namespace (retype,
  // retypeD); the teams' connections draw (links, linkStep, linkD), then light flows along them (flow); the Namespace
  // bands rise in TEMPORAL (bands, bandStep)
  const T0 = {
    pull: -0.4, pullD: 1.7, regroup: -0.3, regroupD: 1.6, platform: 0.8, teams: 1.4, teamStep: 0.15, retype: 2.2,
    retypeD: 0.6, links: 2.6, linkStep: 0.15, linkD: 0.5, flow: 3.2, bands: 3.6, bandStep: 0.12,
  };
  // from c[1]: the POLICY panel docks under the proxy (policy, policyD); each rule ticks on as the subtitle names it
  // (ticks: its name's place at 16 characters per second, plus 0.3 s); the policy sweeps out along the teams'
  // connections (sweep, sweepStep from one team to the next, sweepD), each team covered as it arrives
  const T1 = { policy: 0.2, policyD: 0.5, ticks: [1.55, 3.2, 4.6, 6.0], sweep: 6.3, sweepStep: 0.12, sweepD: 0.6 };

  scene({
    chapter: 4, title: 'Security as a shared service',
    // hard cuts: chapter 3 ends on this chapter's first frame (placeProxyStage), this chapter on the next one's
    // (SERVICE_REST)
    fadeIn: 0, fadeOut: 0,
    subs: [
      { text: "A central <b>platform team</b> can run the proxy as a shared service for every team." },
      // the sweep, then a hold on every team covered
      {
        text: "One policy for all: per-Namespace encryption, client authentication, encryption required, metrics.",
        after: 1.2,
      },
    ],
    build(stage, s) {
      // the shared service first (the proxy fleet inside it, in chapter 3's order), so both cuts show the same stack
      const root = s.cam = makeCamera(stage);
      s.service = makeServiceStage(root);
      // the sweep: a neon trail along each team's connection, from the proxy to the team, with a spark at its head,
      // and neon rings where it arrives
      const svg = svgLayer(root);
      s.trails = SERVICE_TEAMS.map((_, i) => path(svg, teamLinkD(i, true), C.neon, 3, false));
      s.heads = SERVICE_TEAMS.map(() => makeSpark(root, 16, RGB.neon));
      s.rings = SERVICE_TEAMS.map(() => makeRipples(root, 2, RGB.neon));
    },
    update(t, c, s) {
      // the camera: the close shot on the proxy, then one pull-back, left and out, to the shared service
      const cam = shot(t, PROXY_SHOT, [[c[0] + T0.pull, ...SERVICE_SHOT, T0.pullD]]);
      setCamera(s.cam, t, this.dur, { ...cam, enter: 1, exit: 1 });

      const sweepAt = i => c[1] + T1.sweep + i * T1.sweepStep;
      const arriveAt = i => sweepAt(i) + T1.sweepD;
      const sweepPulse = Math.max(0, 1 - Math.abs(t - c[1] - T1.sweep - 0.1) / 0.5);
      const tickAt = k => c[1] + T1.ticks[k];
      const teamsI = [0, 1, 2];
      placeServiceStage(s.service, cam, {
        regroup: P(t, c[0] + T0.regroup, T0.regroupD),
        platform: P(t, c[0] + T0.platform, 0.5),
        teams: teamsI.map(i => P(t, c[0] + T0.teams + i * T0.teamStep, 0.5)),
        retype: P(t, c[0] + T0.retype, T0.retypeD, linear),
        links: teamsI.map(i => P(t, c[0] + T0.links + i * T0.linkStep, T0.linkD)),
        flow: P(t, c[0] + T0.flow, 0.5),
        bands: teamsI.map(i => P(t, c[0] + T0.bands + i * T0.bandStep, 0.5)),
        policy: P(t, c[1] + T1.policy, T1.policyD, backOut),
        ticks: T1.ticks.map((_, k) => P(t, tickAt(k), 0.2)),
        covered: teamsI.map(i => popIn(t, arriveAt(i))),
        glow: sweepPulse,
        fade: 0,
      });
      // each rule's mark swells as it ticks on
      s.service.policy.rules.forEach((rule, k) => setRule(rule, P(t, tickAt(k), 0.2), swell(t, tickAt(k), 0.3)));

      // the dramatic beat: the policy sweeps out from the proxy along every team's connection, a neon trail with a
      // spark at its head; it fades once it reaches the team, which lights up with neon rings
      SERVICE_TEAMS.forEach((_, i) => {
        const p = P(t, sweepAt(i), T1.sweepD);
        draw(s.trails[i], p, 1 - P(t, arriveAt(i) + 0.2, 0.6));
        sparkOnPath(s.heads[i], s.trails[i], p, 1);
        const zone = teamZone(i);
        placeRipples(s.rings[i], t, arriveAt(i), zone.x + zone.w, zone.y + zone.h / 2, 30, 200, { d: 0.8, step: 0.15 });
      });
    }
  });
}
