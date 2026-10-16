// ===================== 10. AUDITED AND CERTIFIED
// Temporal Cloud's compliance, on TEMPORAL's side: a wide Temporal Cloud zone (the official lockup followed by
// "Cloud") holds four empty seal slots. The dramatic beat: as the first subtitle names them, four seals stamp onto
// their slots one at a time, SOC 2 TYPE 2 (certified), then HIPAA, GDPR and CCPA (compliant), each slamming down
// with a press, neon ripples and a jolt. For the second subtitle the zone moves up and a TRUST CENTER card rises in
// under it, listing the SOC 2 Type 2 report over an empty slot; an ANNUAL AUDIT and an ANNUAL PEN TEST tag pop in
// on its sides, each under a THIRD PARTY caption. The audit tag sends its results along a dashed line into the empty
// slot, and the card lights up as the Trust Center is named. The camera holds; the engine's zoom-through brings the
// scene in and plays into the recap.
// The block keeps every name declared in this file local to this scene.
{
  // seconds after c[0] when each seal lands: as the subtitle names it, at its position at 16 characters per second
  // plus 0.3 s
  const STAMP_AT = [1.43, 4.05, 4.49, 5.05];
  // the stamp: the seal falls from STAMP.from times its size, tilted STAMP.tilt degrees, over STAMP.d seconds and
  // lands flat; the press squashes it to 1 - STAMP.press, back to its size in STAMP.pressD seconds; the frame jolts
  const STAMP = { from: 2.0, tilt: -10, d: 0.18, press: 0.06, pressD: 0.22, shake: 4, shakeD: 0.25 };
  // from c[1]: the zone moves up (rise, riseD) as the TRUST CENTER card comes in (card); the tags pop in as the
  // subtitle names them (audit, penTest); both swell at "every year" (yearly); the audit results leave for the card
  // as "audit results" is read (results, resultsD); the card lights up at "Temporal Trust Center" (lit)
  const T1 = {
    rise: 0, riseD: 0.8, card: 0.4, audit: 1.18, penTest: 1.8, yearly: 2.55, results: 3.3, resultsD: 0.5, lit: 4.86,
  };

  // The Temporal Cloud zone, left and top, size: held through the stamps, then moved up for the Trust Center row
  // (both centered on x 960; the first on y 515, the second with the row under it)
  const ZONE_STAMPS = { x: 120, y: 285, w: 1680, h: 460 };
  const ZONE_REPORTS = { x: 120, y: 175, w: 1680, h: 400 };
  // the room the heading takes at the zone's top: its inset and the lockup's height; the seals center in the rest
  const HEAD = { inset: ZONE_LABEL_INSET.head, logo: ZONE_LOGO_H };
  const sealY = zone => zone.y + HEAD.inset + HEAD.logo + (zone.h - HEAD.inset - HEAD.logo) / 2;

  // The seals, one per column of the use cases' row (useCaseX): [name lines, status]. Each is a round badge of
  // SEAL.size px, a dashed inner ring SEAL.ring px inside its edge, a neon check, its name in two lines' room (so the
  // checks and statuses line up) and its status
  const SEALS = [
    [['SOC 2', 'TYPE 2'], 'Certified'], [['HIPAA'], 'Compliant'], [['GDPR'], 'Compliant'], [['CCPA'], 'Compliant'],
  ];
  const SEAL = { size: 256, ring: 11, check: 34, name: 32, nameLine: 38, status: 17 };
  // the neon ripples of a stamp, from the seal's edge outward
  const RIPPLE = { to: 430, d: 0.6, step: 0.12 };

  // The Trust Center row, under the moved-up zone: the card in the middle, on x 960, and the tags centered under the
  // first and last seals, their pills level with the middle of the card's two rows. pillDy: how far the pill's
  // middle sits below the tag's, its caption line (22 px) and the 16 px gap above it
  const CARD = { x: 960, y: 735, w: 560, h: 240, pad: 24, slotTop: 102, slotH: 52, slotGap: 10 };
  const TAG = { w: 300, xs: [useCaseX(0), useCaseX(3)], font: 20, pillDy: 19 };
  // the tags, [icon, label]: the audit, then the pen test
  const AUDITS = [['search', 'Annual audit'], ['target', 'Annual pen test']];
  // the card's rows: the SOC 2 Type 2 report, listed from the start, and the audit results, which the audit tag
  // delivers into the row's empty slot (RESULTS_ROW)
  const CARD_ROWS = ['SOC 2 Type 2 report', 'Audit results'];
  const RESULTS_ROW = 1;
  // the results that travel from the audit tag to their row: a small document tile
  const REPORT = { w: 40, h: 48, icon: 26 };
  // the dashed line they ride: from the audit tag's inner edge, LINK.gap px out, to LINK.gap px short of the card
  const LINK = { gap: 16 };

  // Stage y of the middle of the card's row i
  const slotY = i => CARD.y - CARD.h / 2 + CARD.slotTop + i * (CARD.slotH + CARD.slotGap) + CARD.slotH / 2;
  const PILL_Y = (slotY(0) + slotY(1)) / 2;
  TAG.y = PILL_Y - TAG.pillDy;
  // SVG path from the audit tag's inner edge to the card's left edge, level with the results row: a smooth S
  function linkD() {
    const x0 = TAG.xs[0] + TAG.w / 2 + LINK.gap, x1 = CARD.x - CARD.w / 2 - LINK.gap;
    const y0 = PILL_Y, y1 = slotY(RESULTS_ROW), xm = (x0 + x1) / 2;
    return `M ${x0} ${y0} C ${xm} ${y0} ${xm} ${y1} ${x1} ${y1}`;
  }

  // A seal: its ring, its dashed inner ring, a neon check, its name and status
  function makeSeal(root, [lines, status]) {
    const nameBlock = SEAL.nameLine * 2;
    const inner = SEAL.size - 2 * SEAL.ring;
    return E(root,
      `<div style="position:absolute;left:${SEAL.ring - 3}px;top:${SEAL.ring - 3}px;width:${inner}px;`
      + `height:${inner}px;border-radius:50%;border:1.5px dashed rgba(${RGB.violet},.55)"></div>`
      + ICON('check', SEAL.check, C.neon, 2.6)
      + `<div class="mono" style="height:${nameBlock}px;display:flex;flex-direction:column;justify-content:center;`
      + `margin-top:6px;font-size:${SEAL.name}px;line-height:${SEAL.nameLine}px;font-weight:700;color:${C.ink}">`
      + lines.map(line => `<div>${line}</div>`).join('') + '</div>'
      + `<div class="lbl" style="margin-top:6px;font-size:${SEAL.status}px;line-height:22px;color:${C.neon}">`
      + `${status}</div>`,
      '', {
        width: SEAL.size + 'px', height: SEAL.size + 'px', borderRadius: '50%', border: `3px solid ${C.violet}`,
        background: '#221A33', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
      });
  }
  // An empty seal slot: a faint dashed circle where a seal lands
  const makeSlot = root => E(root, '', '', {
    width: SEAL.size + 'px', height: SEAL.size + 'px', borderRadius: '50%',
    border: `2px dashed rgba(${RGB.ink},.22)`,
  });
  // A tag of a third-party check, under its THIRD PARTY caption: one element, centered on its pill and caption
  function makeAuditTag(root, [icon, label]) {
    return E(root,
      '<div class="lbl" style="font-size:16px;line-height:22px">Third party</div>'
      + `<div class="mono" style="margin-top:16px;width:${TAG.w}px;height:52px;display:flex;align-items:center;`
      + `justify-content:center;gap:10px;font-size:${TAG.font}px;letter-spacing:.1em;text-transform:uppercase;`
      + `color:${C.ink};border:2px solid ${C.violet};border-radius:var(--rs);background:var(--violet-solid)">`
      + `${ICON(icon, 22, C.violet, 2)}${label}</div>`,
      '', { display: 'flex', flexDirection: 'column', alignItems: 'center' });
  }
  // The TRUST CENTER card: its heading and address, then one slot per row of CARD_ROWS, dashed while empty
  // (card.slots[i], with .fill, the filled row, hidden until a scene shows it)
  function makeTrustCard(root) {
    const slots = CARD_ROWS.map((row, i) => {
      const top = CARD.slotTop + i * (CARD.slotH + CARD.slotGap);
      return `<div class="slot" style="position:absolute;left:${CARD.pad}px;right:${CARD.pad}px;top:${top}px;`
        + `height:${CARD.slotH}px;border:1.5px dashed ${C.line};border-radius:var(--rs)">`
        + '<div class="fill" style="position:absolute;inset:-1.5px;display:flex;align-items:center;gap:12px;'
        + `padding-left:16px;border:1.5px solid rgba(${RGB.violet},.45);border-left:3px solid ${C.violet};`
        + 'border-radius:var(--rs);'
        + `background:rgba(${RGB.violet},.12);opacity:0">`
        + `${ICON('book', 24, C.violet, 1.8)}<span class="mono" style="font-size:19px;color:${C.ink}">${row}`
        + '</span></div></div>';
    }).join('');
    const card = E(root,
      `<div style="position:absolute;left:${CARD.pad}px;top:${CARD.pad - 2}px;display:flex;align-items:center;`
      + `gap:10px">${ICON('shield', 26, C.violet, 1.8)}<span class="lbl" style="padding-left:0;font-size:18px;`
      + 'line-height:30px;color:var(--ink)">Trust Center</span></div>'
      + `<div class="mono" style="position:absolute;left:${CARD.pad}px;top:${CARD.pad + 36}px;font-size:20px;`
      + `line-height:28px;color:${C.slate}">trust.temporal.io</div>`
      + slots,
      'tile', { width: CARD.w + 'px', height: CARD.h + 'px', textAlign: 'left', background: C.bg });
    card.slots = [...card.querySelectorAll('.slot')].map(slot => ({ slot, fill: slot.querySelector('.fill') }));
    return card;
  }

  scene({
    chapter: 10, title: 'Audited and certified',
    subs: [
      {
        text: 'Temporal Cloud is <b>SOC 2 Type 2</b> certified and compliant with HIPAA, GDPR and CCPA.',
        // the last stamp's ripples end at c[0] + 5.8: the four seals then hold about 1.1 s
        after: 1.0,
      },
      {
        text: 'Third parties audit and pen test it every year: audit results are in the <b>Temporal Trust Center</b>.',
        // the card lights up at c[1] + 4.86: the full composition then holds about 2.7 s before the fade
        after: 1.0,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.zone = makeCloudZone(root);
      s.slots = SEALS.map(() => makeSlot(root));
      s.seals = SEALS.map(seal => makeSeal(root, seal));
      s.ripples = SEALS.map(() => makeRipples(root, 2, RGB.neon));

      s.svg = svgLayer(root);
      s.link = path(s.svg, linkD(), C.violet, 2, true, '8 8');
      s.card = makeTrustCard(root);
      // the SOC 2 Type 2 report is listed from the start
      s.card.slots[0].fill.style.opacity = 1;
      s.tags = AUDITS.map(audit => makeAuditTag(root, audit));
      s.results = E(root, ICON('book', REPORT.icon, C.violet, 1.8), '', {
        width: REPORT.w + 'px', height: REPORT.h + 'px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: C.bg, border: `1.5px solid ${C.violet}`, borderRadius: 'var(--rs)',
      });
      s.landing = makeRipples(root, 2, RGB.violet);
    },
    update(t, c, s) {
      const hits = STAMP_AT.map(at => c[0] + at);

      // the camera holds; each stamp jolts the frame. The engine's zoom-through in and out.
      const jolt = hits.map(hit => shake(t, hit, STAMP.shake, STAMP.shakeD));
      const dx = jolt.reduce((sum, [x]) => sum + x, 0), dy = jolt.reduce((sum, [, y]) => sum + y, 0);
      setCamera(s.cam, t, this.dur, { dx, dy });

      // the Temporal Cloud zone moves up to make room for the Trust Center row, the seals with it
      const moveUp = P(t, c[1] + T1.rise, T1.riseD);
      const zone = lerpZone(ZONE_STAMPS, ZONE_REPORTS, moveUp);
      s.zone.style.width = zone.w + 'px';
      s.zone.style.height = zone.h + 'px';
      place(s.zone, zone.x + zone.w / 2, zone.y + zone.h / 2, 1, 1);
      const y = Math.round(sealY(zone));

      // The dramatic beat: each seal slams down onto its slot as the subtitle names it, presses into it, throws
      // neon ripples, and the frame jolts
      s.seals.forEach((seal, i) => {
        const x = useCaseX(i), hit = hits[i];
        const fall = P(t, hit - STAMP.d, STAMP.d, easeIn);
        const shown = P(t, hit - STAMP.d, 0.08, linear);
        const scale = lerp(STAMP.from, 1, fall) * (1 - STAMP.press * recoil(t, hit, STAMP.pressD));
        place(seal, x, y, scale, shown, lerp(STAMP.tilt, 0, fall));
        const glow = Math.max(0, 1 - Math.abs(t - hit - 0.1) / 0.4);
        seal.style.boxShadow = glowShadow(RGB.violet, glow, { blur: 50, alpha: 0.6 });
        place(s.slots[i], x, y, 1, t < hit ? 1 : 0);
        placeRipples(s.ripples[i], t, hit, x, y, SEAL.size, RIPPLE.to, { d: RIPPLE.d, step: RIPPLE.step });
      });

      // the TRUST CENTER card rises in under the zone, the SOC 2 Type 2 report listed over an empty slot
      rise(s.card, CARD.x, CARD.y, P(t, c[1] + T1.card, 0.5));
      // the tags pop in as the subtitle names them, and swell at "every year"
      s.tags.forEach((tag, i) => {
        const pop = backPop(t, c[1] + (i === 0 ? T1.audit : T1.penTest));
        place(tag, TAG.xs[i], TAG.y, pop.s * swell(t, c[1] + T1.yearly + 0.1 * i, 0.08), pop.o);
      });

      // the audit tag sends its results along a dashed line into the empty slot, which fills as they land; the pen
      // test tag stays a fact on its own
      const leave = c[1] + T1.results;
      draw(s.link, P(t, leave - 0.3, 0.3));
      const ride = P(t, leave, T1.resultsD);
      const point = s.link.getPointAtLength(s.link._L * ride);
      place(s.results, point.x, point.y, 1, ride > 0 && ride < 1 ? 1 : 0);
      const landAt = leave + T1.resultsD;
      s.card.slots[RESULTS_ROW].fill.style.opacity = P(t, landAt, 0.25);
      placeRipples(s.landing, t, landAt, point.x, slotY(RESULTS_ROW), 40, 160, { d: 0.6, step: 0.14 });

      // the card lights up as the Temporal Trust Center is named
      const litAt = c[1] + T1.lit;
      s.card.style.borderColor = t >= litAt ? C.violet : C.line;
      const cardGlow = Math.max(0, 1 - Math.abs(t - litAt - 0.15) / 0.5);
      s.card.style.boxShadow = glowShadow(RGB.violet, Math.max(cardGlow, P(t, litAt, 0.3) * 0.35),
        { blur: 40, alpha: 0.5 });
    }
  });
}
