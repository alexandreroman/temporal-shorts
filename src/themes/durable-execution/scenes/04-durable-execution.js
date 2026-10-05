// ===================== 4. DURABLE EXECUTION WITH TEMPORAL
// Temporal logo and the code card alone: it runs to completion. The card becomes a Workflow, each await line
// links to an Activity tile calling its service; then Ship package fails and Temporal retries it, with
// growing delays, until it succeeds.
// The block keeps every name declared in this file local to this scene.
{
  // Layout: the logo on top; below it the code card, then a column of 4 Activity tiles (one row per step)
  // and their services. The card starts alone in the middle and slides left to make room.
  const ROW = { y0: 575, pitch: 116 }; // middle of the 4 rows, distance between rows
  const rowY = i => ROW.y0 + (i - 1.5) * ROW.pitch;
  const CARD = { x0: 960, x: 485, y: ROW.y0 };
  const LOGO_Y = ROW.y0 - 287;
  const TILE = { x: 1080, w: 260, h: 88 };
  const SERVICE = { x: 1675, w: 160, h: 44 };
  // Ship package retry line: attempt markers on its link to the Carrier, the gaps grow with the delays
  const SHIP = 2;
  const ATTEMPT_X = [1265, 1375, 1535];
  const MARK = 30;

  // Activity tile: icon, ACTIVITY kicker and label, with the makeStep status marks (see stepState)
  const makeActivity = (p, step) => {
    const e = E(p,
      '<div style="display:flex;align-items:center;gap:16px;height:100%;padding-left:20px">'
      + `${ICON(step.icon, 36, C.ink)}<div style="text-align:left">`
      + '<div class="lbl" style="font-size:13px;padding-left:0">Activity</div>'
      + `<div style="font-size:21px;margin-top:4px;white-space:nowrap">${step.label}</div></div></div>`
      + '<div class="spin" style="position:absolute;right:12px;top:12px;width:26px;height:26px;'
      + `border:3px solid rgba(182,100,255,.25);border-top-color:${C.violet};border-radius:50%;opacity:0"></div>`
      + `<div class="ok" style="position:absolute;right:8px;top:8px;opacity:0">${ICON('check', 32, C.neon, 2.6)}</div>`
      + `<div class="ko" style="position:absolute;right:8px;top:8px;opacity:0">${ICON('x', 32, C.red, 2.6)}</div>`,
      'tile', { width: TILE.w + 'px', height: TILE.h + 'px' });
    e.spin = e.querySelector('.spin'); e.ok = e.querySelector('.ok'); e.ko = e.querySelector('.ko');
    return e;
  };
  const makeService = (p, name) => E(p,
    `${ICON('server', 20, C.slate, 1.8)}<span class="mono" style="font-size:16px;letter-spacing:.1em;`
    + `text-transform:uppercase;color:var(--slate)">${name}</span>`,
    '', {
      width: SERVICE.w + 'px', height: SERVICE.h + 'px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '10px', border: '1.5px solid #4B5363', borderRadius: 'var(--rs)',
    });
  // attempt marker: the attempt number while it runs, then a red x or a neon check
  const makeAttempt = (p, n) => {
    const e = E(p,
      `<span class="n mono" style="position:absolute;font-size:15px;color:${C.violet}">${n}</span>`
      + `<span class="ko" style="position:absolute">${ICON('x', 18, C.red, 2.6)}</span>`
      + `<span class="ok" style="position:absolute">${ICON('check', 18, C.neon, 2.6)}</span>`,
      '', {
        width: MARK + 'px', height: MARK + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#141414', border: '2px solid ' + C.violet, borderRadius: '50%',
      });
    e.n = e.querySelector('.n'); e.ko = e.querySelector('.ko'); e.ok = e.querySelector('.ok');
    return e;
  };
  // state: 1 running, 2 succeeded, 3 failed (as in stepState)
  const attemptState = (e, st) => {
    e.style.borderColor = [C.line, C.violet, C.neon, C.red][st];
    e.n.style.opacity = st === 1 ? 1 : 0;
    e.ok.style.opacity = st === 2 ? 1 : 0;
    e.ko.style.opacity = st === 3 ? 1 : 0;
  };

  scene({
    chapter: 4, title: 'Durable Execution with Temporal',
    // laid out around (960, 522): the card-alone phase and the Activities phase both sit within 10 px of it
    shift: [0, 0],
    subs: [
      {
        text: "<b>Durable Execution</b> takes another path: your code runs to completion, even when servers fail.",
        after: 0.5,
      },
      {
        text: "With Temporal, you write the process as a <b>Workflow</b>, "
          + "and each step that calls a service as an <b>Activity</b>.",
        after: 0.6,
      },
      {
        text: "If an Activity fails, Temporal retries it automatically, with growing delays, until it succeeds.",
        after: 1.2,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      // native-size logo on whole pixels (never scaled)
      s.logo = E(root, `<img src="${LOGO}" style="height:58px;display:block">`, '', {
        left: (960 - 111) + 'px', top: (LOGO_Y - 29) + 'px',
      });
      s.card = makeCodeCard(root, { header: 'Workflow' });
      s.badge = tag(root, `${ICON('check', 22, C.neon, 2.6)}Runs to completion`, 'neon');
      Object.assign(s.badge.style, { display: 'flex', alignItems: 'center', gap: '10px' });
      // a neon ring around the card when the bolt bounces off it
      s.ring = E(root, '', '', {
        width: (s.card.w + 20) + 'px', height: (s.card.h + 20) + 'px', border: '2px solid ' + C.neon,
        borderRadius: '14px',
      });
      s.bolt = E(root, ICON('bolt', 48, C.red, 2));

      // calls: await line -> Activity tile (from the card's right edge), Activity -> its service
      const cardRight = CARD.x + s.card.w / 2 + 4, tileLeft = TILE.x - TILE.w / 2 - 4;
      const mx = (cardRight + tileLeft) / 2;
      s.calls = ORDER_STEPS.map((_, i) => {
        const y0 = CARD.y + s.card.lineY(i + 1), y1 = rowY(i);
        return path(s.svg, `M ${cardRight} ${y0} C ${mx} ${y0} ${mx} ${y1} ${tileLeft} ${y1}`, C.uv, 2.5, false);
      });
      s.links = ORDER_STEPS.map((_, i) => path(s.svg,
        `M ${TILE.x + TILE.w / 2 + 4} ${rowY(i)} L ${SERVICE.x - SERVICE.w / 2 - 4} ${rowY(i)}`, C.line, 2, false));
      s.tiles = ORDER_STEPS.map(step => makeActivity(root, step));
      s.services = ORDER_STEPS.map(step => makeService(root, step.service));

      // retry line of Ship package: the waits between attempts, drawn as they pass
      const y = rowY(SHIP), r = MARK / 2 + 2;
      s.waits = [0, 1].map(k => path(s.svg,
        `M ${ATTEMPT_X[k] + r} ${y} L ${ATTEMPT_X[k + 1] - r} ${y}`, C.slate, 3, false));
      s.waitL = ['Retry in 1s', 'Retry in 2s'].map(txt => E(root, txt, 'lbl', { fontSize: '14px' }));
      s.attempts = ATTEMPT_X.map((_, k) => makeAttempt(root, k + 1));
      s.timeout = E(root, 'Carrier timeout', 'lbl', { fontSize: '14px', color: C.red });
      s.retries = tag(root, 'Automatic retries', 'uv');
      s.retries.style.fontSize = '18px';
    },
    update(t, c, s) {
      // ---- c[0]: the logo, then the code card alone, running to completion
      const lp = P(t, c[0] + 0.1, 0.6);
      s.logo.style.opacity = lp;
      s.logo.style.transform = `translateY(${(1 - lp) * 16}px)`;
      const cp = P(t, c[0] + 0.5, 0.6, backOut);
      const cardX = lerp(CARD.x0, CARD.x, P(t, c[1] + 0.2, 0.9));
      place(s.card, cardX, CARD.y, cp, clamp(cp * 2));
      s.card.hdr.style.opacity = P(t, c[1] + 1.4, 0.4);
      const bp = P(t, c[0] + 2.9, 0.45, backOut);
      place(s.badge, CARD.x0, CARD.y + s.card.h / 2 + 50, bp, clamp(bp * 2) * (1 - P(t, c[1], 0.3)));

      // a failure bolt hits the card and bounces off
      const hit = c[0] + 4.6;
      const cardRight = CARD.x0 + s.card.w / 2;
      const inP = P(t, hit - 0.4, 0.4, easeIn), outP = P(t, hit, 0.6);
      const bx = lerp(lerp(cardRight + 300, cardRight + 34, inP), cardRight + 170, outP);
      const by = lerp(lerp(CARD.y - 190, CARD.y - 60, inP), CARD.y - 150, outP);
      place(s.bolt, bx, by, 1, P(t, hit - 0.4, 0.15) * (1 - P(t, hit + 0.25, 0.35)), outP * 40);
      place(s.ring, CARD.x0, CARD.y, 1, win(t, hit - 0.05, hit + 0.3, 0.15) * 0.9);

      // ---- c[2]: each Activity runs in turn; Ship package fails twice and is retried after 1s, then 2s
      const run = [c[2] + 0.2, c[2] + 0.75, c[2] + 1.3, c[2] + 5.9]; // when each Activity starts
      const tries = [[run[2], run[2] + 0.6], [c[2] + 2.9, c[2] + 3.4], [c[2] + 4.9, c[2] + 5.4]]; // ship attempts
      const waits = [[c[2] + 2.1, 0.8], [c[2] + 3.6, 1.3]]; // [start, duration] of the drawn waits
      const shipDone = tries[2][1];
      const stepStates = ORDER_STEPS.map((_, i) => {
        if (i === SHIP) {
          if (t >= shipDone) return 2;
          const k = tries.findLastIndex(([a]) => t >= a);
          if (k < 0) return 0;
          return t >= tries[k][1] ? 3 : 1;
        }
        const done = i < SHIP ? run[i + 1] : run[i] + 0.55;
        return t >= done ? 2 : t >= run[i] ? 1 : 0;
      });
      // the highlight follows the await line of the running Activity, red while Ship package waits to retry
      const active = run.findLastIndex(a => t >= a);
      if (t < c[1]) {
        // c[0]: the highlight walks the whole function, top to bottom
        setCodeLine(s.card, lerp(0, 5, P(t, c[0] + 1.2, 1.6)), win(t, c[0] + 1.1, c[0] + 3.0, 0.25));
      } else {
        const waiting = active === SHIP && stepStates[SHIP] === 3;
        const color = waiting ? 'rgba(255,90,95,.3)' : 'rgba(182,100,255,.28)';
        setCodeLine(s.card, Math.max(active, 0) + 1, win(t, run[0], run[3] + 0.8, 0.25), color);
      }

      // ---- c[1]: each await line links to its Activity tile, then each Activity to the service it calls
      ORDER_STEPS.forEach((_, i) => {
        const at = c[1] + 2.6 + i * 0.4;
        draw(s.calls[i], P(t, at, 0.35));
        const tp = P(t, at + 0.2, 0.45, backOut);
        place(s.tiles[i], TILE.x, rowY(i), tp, clamp(tp * 2));
        stepState(s.tiles[i], stepStates[i]);
        const sv = c[1] + 4.6 + i * 0.15;
        draw(s.links[i], P(t, sv, 0.35));
        s.links[i].setAttribute('stroke', stepStates[i] === 1 ? C.violet : C.line);
        place(s.services[i], SERVICE.x, rowY(i), 1, P(t, sv + 0.2, 0.35));
      });

      // ---- c[2]: the retry line of Ship package
      const y = rowY(SHIP);
      s.attempts.forEach((e, k) => {
        const ap = P(t, tries[k][0], 0.35, backOut);
        const outcome = k === tries.length - 1 ? 2 : 3; // only the last attempt succeeds
        attemptState(e, t >= tries[k][1] ? outcome : 1);
        place(e, ATTEMPT_X[k], y, ap, clamp(ap * 2));
      });
      s.waits.forEach((w, k) => draw(w, P(t, waits[k][0], waits[k][1], x => x)));
      s.waitL.forEach((e, k) => {
        place(e, (ATTEMPT_X[k] + ATTEMPT_X[k + 1]) / 2, y - 36, 1, P(t, waits[k][0], 0.3));
      });
      const closeAt = shipDone + 0.2;
      place(s.timeout, (ATTEMPT_X[0] + ATTEMPT_X[1]) / 2, y + 36, 1,
        P(t, tries[0][1] + 0.05, 0.3) * (1 - P(t, closeAt, 0.25)));
      const rp = P(t, closeAt + 0.1, 0.45, backOut);
      place(s.retries, (ATTEMPT_X[0] + ATTEMPT_X[2]) / 2, y + 56, rp, clamp(rp * 2));
    }
  });
}
