// ===================== 4. DURABLE EXECUTION WITH TEMPORAL
// Temporal logo and the code card alone: it runs to completion. The card becomes a Workflow (a workflows.ts excerpt
// with the TypeScript SDK), its Activities declaration lights up and each await line links to an Activity tile
// calling its service; then Ship package fails and Temporal retries it, with growing delays, until it succeeds.
// The block keeps every name declared in this file local to this scene.
{
  // Layout: the Temporal logo stays on top, centered on x=960. Alone, the code card (the workflows.ts excerpt) and
  // the badge stand under it, about 94 px apart; then the card and the badge slide left to make room for a column
  // of 4 Activity tiles (one row per step, 48 px apart) and, on the right, the services they call, each centered on
  // its row. Next to the Activities, the card's top is level with the column's top (its await lines face the
  // middle of the column) and the badge's bottom with the column's bottom; the composition spans x 120..1800 and
  // y 142..902 in both phases.
  const ROW = { y0: 574, pitch: 176 }; // middle of the 4 rows, distance between rows
  const rowY = i => ROW.y0 + (i - 1.5) * ROW.pitch;
  // code card: 20 px text on 38 px lines (its 62-character first line fits), 820 x 458; centered alone at
  // (x0, y0), then at (x, y): x 120..940, y 246..704
  const CARD = {
    w: 820, font: 20, lineH: 38, padY: 20, padX: 18, gutter: 36, x0: 960, y0: 529, x: 530, y: 475,
  };
  const CARD_H = CARD.padY * 2 + WORKFLOWS_TS.length * CARD.lineH; // 458
  const LOGO_BOX = { h: 64, w: 245, top: 142 }; // the logo's height, width and top edge
  const BADGE_Y = CARD.y0 + CARD_H / 2 + 95 + 24.5; // badge (49 px high) center, 95 px under the card alone
  // lines of the card: the Activities declaration on top, then the Workflow function
  const DECLARATION_LINES = WORKFLOWS_TS.indexOf('');
  const FUNCTION_LINE = WORKFLOWS_TS.indexOf(WORKFLOW_CODE[0]);
  const LAST_LINE = WORKFLOWS_TS.length - 1;
  const TILE = { x: 1139, w: 190, h: 128 }; // x 1044..1234, 104 px right of the card
  const SERVICE = { x: 1706, w: 188, h: 64 }; // x 1612..1800
  // Ship package retry line: attempt markers on its link to the Carrier, the gaps grow with the delays; the first
  // and last markers sit 27 px from the tile and the chip
  const SHIP = 2;
  const ATTEMPT_X = [1278, 1398, 1568];
  const MARK = 34;
  const RUNNING = C.highlight; // the code highlight, as in setCodeLine

  // Activity tile: icon, ACTIVITY kicker and label stacked in the middle, with the makeStep status marks
  // (see stepState)
  const makeActivity = (p, step) => addStatusMarks(E(p,
    '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%">'
    + `${ICON(step.icon, 36, C.ink)}<div class="lbl" style="font-size:14px;margin-top:10px">Activity</div>`
    + `<div style="font-size:24px;margin-top:4px;white-space:nowrap">${step.label}</div></div>`,
    'tile', { width: TILE.w + 'px', height: TILE.h + 'px' }));
  const makeService = (p, name) => E(p,
    `${ICON('server', 24, C.slate, 1.8)}<span class="mono" style="font-size:18px;letter-spacing:.1em;`
    + `text-transform:uppercase;color:var(--slate)">${name}</span>`,
    '', {
      width: SERVICE.w + 'px', height: SERVICE.h + 'px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '12px', border: '1.5px solid #4B5363', borderRadius: 'var(--rs)',
    });
  // attempt marker: the attempt number while it runs, then a red x or a neon check
  const makeAttempt = (p, n) => {
    const e = E(p,
      `<span class="n mono" style="position:absolute;font-size:17px;color:${C.violet}">${n}</span>`
      + `<span class="ko" style="position:absolute">${ICON('x', 20, C.red, 2.6)}</span>`
      + `<span class="ok" style="position:absolute">${ICON('check', 20, C.neon, 2.6)}</span>`,
      '', {
        width: MARK + 'px', height: MARK + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#141414', border: '2px solid ' + C.violet, borderRadius: '50%',
      });
    e.n = e.querySelector('.n'); e.ko = e.querySelector('.ko'); e.ok = e.querySelector('.ok');
    return e;
  };
  // state: 1 running, 2 succeeded, 3 failed (as in stepState)
  const attemptState = (e, st) => {
    e.style.borderColor = STEP_COLORS[st];
    e.n.style.opacity = st === 1 ? 1 : 0;
    e.ok.style.opacity = st === 2 ? 1 : 0;
    e.ko.style.opacity = st === 3 ? 1 : 0;
  };

  scene({
    chapter: 4, title: 'Durable Execution with Temporal',
    // laid out around (960, 522): the card-alone phase and the Activities phase are both centered on it
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
      // native-size logo on whole pixels (never scaled), at its place on top of both phases
      s.logo = E(root, `<img src="${LOGO}" style="height:${LOGO_BOX.h}px;display:block">`, '', {
        left: (960 - Math.round(LOGO_BOX.w / 2)) + 'px', top: LOGO_BOX.top + 'px',
      });
      const { w, font, lineH, padY, padX, gutter } = CARD;
      s.card = makeCodeCard(root, {
        lines: WORKFLOWS_TS, header: 'Workflow', file: 'workflows.ts', w, font, lineH, padY, padX, gutter,
      });
      s.badge = tag(root, `${ICON('check', 22, C.neon, 2.6)}Runs to completion`, 'neon');
      // whole-pixel size (content: 349.4 x 49), so the badge centered under the card rests on whole pixels
      Object.assign(s.badge.style, {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '350px',
      });
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
        const y0 = CARD.y + s.card.lineY(awaitLine(WORKFLOWS_TS, i)), y1 = rowY(i);
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
      s.waitL = ['Retry in 1s', 'Retry in 2s'].map(txt => E(root, txt, 'lbl', { fontSize: '15px' }));
      s.attempts = ATTEMPT_X.map((_, k) => makeAttempt(root, k + 1));
      s.timeout = E(root, 'Carrier timeout', 'lbl', { fontSize: '15px', color: C.red });
      s.retries = tag(root, 'Automatic retries', 'uv');
      s.retries.style.fontSize = '18px';
    },
    update(t, c, s) {
      // ---- c[0]: the logo, then the code card alone, running to completion; at c[1] the card and its badge slide
      // left
      const lp = P(t, c[0] + 0.1, 0.6);
      const slide = P(t, c[1] + 0.2, 0.9);
      const cardX = lerp(CARD.x0, CARD.x, slide), cardY = lerp(CARD.y0, CARD.y, slide);
      s.logo.style.opacity = lp;
      s.logo.style.transform = `translateY(${(1 - lp) * 16}px)`;
      const cp = P(t, c[0] + 0.5, 0.6, backOut);
      place(s.card, cardX, cardY, cp, clamp(cp * 2));
      s.card.hdr.style.opacity = P(t, c[1] + 1.4, 0.4);
      const bp = popIn(t, c[0] + 2.9, 0.08);
      place(s.badge, cardX, BADGE_Y, bp.s, bp.o);

      // a failure bolt hits the card and bounces off
      const hit = c[0] + 4.6;
      const cardRight = CARD.x0 + s.card.w / 2;
      const inP = P(t, hit - 0.4, 0.4, easeIn), outP = P(t, hit, 0.6);
      const bx = lerp(lerp(cardRight + 300, cardRight + 34, inP), cardRight + 170, outP);
      const by = lerp(lerp(CARD.y0 - 190, CARD.y0 - 60, inP), CARD.y0 - 150, outP);
      place(s.bolt, bx, by, 1, P(t, hit - 0.4, 0.15) * (1 - P(t, hit + 0.25, 0.35)), outP * 40);
      place(s.ring, CARD.x0, CARD.y0, 1, win(t, hit - 0.05, hit + 0.3, 0.15) * 0.9);

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
        // c[0]: the highlight walks the whole Workflow function, top to bottom
        const walk = lerp(FUNCTION_LINE, LAST_LINE, P(t, c[0] + 1.2, 1.6));
        setCodeLine(s.card, walk, win(t, c[0] + 1.1, c[0] + 3.0, 0.25));
      } else if (t < c[2]) {
        // c[1]: the Activities declaration lights up while the Activity tiles appear
        setCodeLine(s.card, 0, win(t, c[1] + 2.3, c[1] + 6.0, 0.3), RUNNING, DECLARATION_LINES);
      } else {
        const waiting = active === SHIP && stepStates[SHIP] === 3;
        const color = waiting ? 'rgba(255,90,95,.3)' : RUNNING;
        const line = awaitLine(WORKFLOWS_TS, Math.max(active, 0));
        setCodeLine(s.card, line, win(t, run[0], run[3] + 0.8, 0.25), color);
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
        // the pop ends before the outcome shows, so the marker changes look at native size
        const ap = popIn(t, tries[k][0]);
        const outcome = k === tries.length - 1 ? 2 : 3; // only the last attempt succeeds
        attemptState(e, t >= tries[k][1] ? outcome : 1);
        place(e, ATTEMPT_X[k], y, ap.s, ap.o);
      });
      s.waits.forEach((w, k) => draw(w, P(t, waits[k][0], waits[k][1], x => x)));
      s.waitL.forEach((e, k) => {
        place(e, (ATTEMPT_X[k] + ATTEMPT_X[k + 1]) / 2, y - 40, 1, P(t, waits[k][0], 0.3));
      });
      const closeAt = shipDone + 0.2;
      place(s.timeout, (ATTEMPT_X[0] + ATTEMPT_X[1]) / 2, y + 40, 1,
        P(t, tries[0][1] + 0.05, 0.3) * (1 - P(t, closeAt, 0.25)));
      const rp = popIn(t, closeAt + 0.1, 0.08);
      place(s.retries, (ATTEMPT_X[0] + ATTEMPT_X[2]) / 2, y + 64.5, rp.s, rp.o);
    }
  });
}
