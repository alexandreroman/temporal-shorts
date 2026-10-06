// ===================== 6. WHEN A WORKER CRASHES
// Opens on the last frame of chapter 5 (same shot): Worker A crashes while shipPackage runs, and Worker B takes
// over the Workflow. Worker B first runs the Workflow code from the start, and Temporal hands back the two saved
// results, chargeCard and reserveItem (no second charge). Then the Workflow carries on: shipPackage runs again
// (its second attempt; in a real run, once the first attempt's Start-To-Close timeout fires), its result is saved,
// then emailReceipt runs and the Workflow completes.
// The block keeps every name declared in this file local to this scene.
{
  // the two replayed steps, saved before the crash: chargeCard and reserveItem (steps 0 and 1)
  const REUSED_LABELS = ['REUSED, NOT RE-CHARGED', 'REUSED, NOT RE-RUN'];
  const SHIP = 2; // the step running when Worker A crashes, run again on Worker B once the replay is done
  const EMAIL = 3; // the last step, run on Worker B once shipPackage is saved
  // the second attempt of shipPackage runs longer than a plain Activity (RESULT_LAG), so its spinner has time to
  // read
  const RETRY_LAG = 1.0;
  // "From the start": arrow in the gap right of the Worker panel, from the shipPackage line back to line 1, under
  // its label (two lines, centered in the gap)
  const workerRight = EH.worker.x + EH.worker.w / 2;
  const temporalLeft = EH.temporal.x - EH.temporal.w / 2;
  const ARC = { x0: workerRight + 14, x1: workerRight + 22, bulge: workerRight + 105 };
  scene({
    chapter: 6, title: 'When a Worker crashes',
    subs: [
      {
        text: "Now the Worker crashes mid-order, during <b>shipPackage</b>. "
          + "Another Worker takes over the Workflow.",
        after: 0.4,
      },
      {
        text: "It first runs the Workflow from the start, "
          + "and Temporal hands back every saved result: no second charge.",
        after: 0.4,
      },
      {
        text: "Then the Workflow carries on where it stopped: shipPackage runs again, and the order completes.",
        after: 1.0,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      const y1 = ehLineY(0), yShip = ehLineY(ehStepLine(SHIP));
      s.restart = path(s.svg, `M ${ARC.x0} ${yShip} C ${ARC.bulge} ${yShip}, ${ARC.bulge} ${y1}, ${ARC.x1} ${y1}`,
        C.violet, 3);
      s.restartL = E(root, 'From the<br>start', 'lbl', {
        color: C.violet, fontSize: '16px', lineHeight: '22px', textAlign: 'center',
      });
      s.shot = makeEventHistoryShot(root, ['WORKER A', 'WORKER B']);
      // the retry travels like a RESULT chip, from Temporal to the Worker, labelled RETRY
      s.retryChip = makeResultCard(root);
      s.retryChip.firstChild.textContent = 'RETRY';
      s.reuseChips = REUSED_LABELS.map(() => makeResultCard(root));
      s.saveChips = [SHIP, EMAIL].map(() => makeResultCard(root));
      s.done = tag(root, 'Workflow complete', 'neon');
      // dark like the SAVED tags, as it sits on the light history card
      s.done.style.background = '#141414';
      s.flash = makeFlash(root);
    },
    update(t, c, s) {
      const { shot } = s;
      const [workerA, workerB] = shot.workers;
      // c[0]: the crash, then Worker B appears and takes over the Workflow
      const crashAt = c[0] + 1.2, bOn = crashAt + 1.6, takeOver = bOn + 0.9;
      // c[1]: the highlight jumps back to line 1, then each replayed await line gets its saved result back from its
      // history row (handed: the chip leaves the history; back: it reaches the code line; told: the tag says why it
      // matters)
      const jump = c[1] + 0.3;
      const replay = REUSED_LABELS.map((_, i) => c[1] + 2.0 + i * 1.3);
      const handed = replay.map(q => q + 0.3), back = handed.map(h => h + 0.6), told = back.map(b => b + 0.15);
      // c[2]: the highlight reaches the shipPackage line at shipLine, Temporal sends its second attempt (the RETRY
      // chip leaves the history at retryAt), which runs from retryRun; its RESULT leaves at retryRes and is saved at
      // retrySaved. Then emailReceipt runs for real, then "}" and "Workflow completed".
      const shipLine = c[2] + 0.3, retryAt = shipLine + 0.3, retryRun = retryAt + 0.6;
      const retryRes = retryRun + RETRY_LAG, retrySaved = retryRes + SAVE_LAG;
      const run = retrySaved + 0.2, res = run + RESULT_LAG, saved = res + SAVE_LAG;
      const finish = run + 1.3, completed = finish + 0.3;
      const [sx, sy] = shakeAt(t, crashAt);
      const dead = t >= crashAt;

      // Worker A runs, crashes and fades; Worker B takes over in the same place
      // cross-fade, so the code card never floats without a panel
      place(workerA, EH.worker.x + sx, EH.worker.y + sy, 1, 1 - P(t, bOn - 0.2, 0.4));
      if (dead) setAppStatus(workerA, 'CRASHED', 'crashed');
      else setAppStatus(workerA, 'RUNNING', 'running');
      place(workerB, EH.worker.x, EH.worker.y, 1, P(t, bOn - 0.2, 0.4));
      if (t < takeOver) setAppStatus(workerB, 'IDLE', 'stopped');
      else if (t < c[1] + 0.2) setAppStatus(workerB, 'TAKING OVER', 'running');
      else if (t < c[2] + 0.2) setAppStatus(workerB, 'REPLAYING…', 'running');
      else if (t < completed) setAppStatus(workerB, 'RUNNING', 'running');
      else setAppStatus(workerB, 'DONE', 'stopped');
      // the status texts swap without overlapping: CRASHED leaves before the panels cross-fade, IDLE after
      workerA.st.style.opacity = 1 - P(t, bOn - 0.45, 0.25);
      workerB.st.style.opacity = P(t, bOn + 0.2, 0.25);

      // CARD CHARGED: $42 all along; the replay charges nothing, the order completes with one charge (each note pops)
      const chargePop = bumpAt(t, back[0]) + bumpAt(t, completed);
      placeEventHistoryShot(shot, { code: 1, charge: 1, order: 1, temporal: 1, hist: 1, chargePop }, sx, sy);
      const note = t >= completed ? 'CHARGED ONCE' : t >= back[0] ? 'NOT RE-CHARGED' : '';
      setCharge(shot.charge, 42, note, C.neon);
      shot.charge.style.borderColor = note ? C.neon : C.line;
      if (t >= completed) setOrderStatus(shot.order, 'COMPLETE', C.neon);
      else setOrderStatus(shot.order, 'PENDING');

      // code highlight: the shipPackage line until the crash, then off until Worker B jumps back to line 1; then
      // each replayed await line, the shipPackage line again, the emailReceipt line and the closing brace
      let line = ehStepLine(SHIP);
      line = lerp(line, 0, P(t, jump + 0.2, 0.6));
      replay.forEach((q, i) => { line = lerp(line, ehStepLine(i), P(t, q, 0.25)); });
      line = lerp(line, ehStepLine(SHIP), P(t, shipLine, 0.25));
      line = lerp(line, ehStepLine(EMAIL), P(t, run, 0.25));
      line = lerp(line, WORKFLOW_CODE.length - 1, P(t, finish, 0.25));
      const barOn = dead ? P(t, jump, 0.2) * (1 - P(t, completed + 0.3, 0.4)) : 1;
      const lineSx = dead ? 0 : sx, lineSy = dead ? 0 : sy;
      setCodeLine(shot.code, line, barOn);
      const retrySpin = win(t, retryRun + 0.2, retryRes, 0.15);
      const spinning = (1 - P(t, crashAt, 0.05)) + retrySpin + runningSpin(t, run);
      setCodeSpinner(shot, line, spinning, lineSx, lineSy);
      // "From the start": drawn as the highlight jumps back, gone once the replay starts
      const arcOut = 1 - P(t, replay[0] - 0.3, 0.3);
      draw(s.restart, P(t, jump, 0.6), arcOut);
      place(s.restartL, (workerRight + temporalLeft) / 2, ehLineY(0) - 56, 1, P(t, jump + 0.4, 0.35) * arcOut);

      // chips: the RETRY from the empty shipPackage row to its line; RESULT chips back from the history to the code
      // when replaying, to the history when running for real
      const shipRowY = ehRowY(ehStepRow(SHIP)), shipLineY = ehLineY(ehStepLine(SHIP));
      flyChip(s.retryChip, t, retryAt, EH.rowStartX, shipRowY, EH.lineEndX, shipLineY);
      s.reuseChips.forEach((e, i) => flyResultToCode(e, t, handed[i], i));
      flyResultToHistory(s.saveChips[0], t, retryRes, SHIP);
      flyResultToHistory(s.saveChips[1], t, res, EMAIL);

      // Event History: rows 1-3 kept through the crash, replayed rows 2 and 3 lit and re-tagged, then row 4 written
      // by the second attempt below the crash line, then rows 5 and 6
      const hist = shot.hist;
      markCrash(hist, P(t, crashAt + 0.7, 0.4), P(t, crashAt + 0.3, 0.3));
      const written = [-Infinity, -Infinity, -Infinity, retrySaved, saved, completed];
      hist.rows.forEach((_, i) => showHistoryRow(hist, i, P(t, written[i] - 0.1, 0.3)));
      hist.tags.forEach((_, i) => {
        let label = 'SAVED', kind = 'saved', at = written[i];
        const step = i - 1;
        if (step >= 0 && step < REUSED_LABELS.length) {
          if (t >= told[step]) { label = REUSED_LABELS[step]; kind = 'reused'; at = told[step]; }
          else if (t >= handed[step]) { label = 'REUSED'; kind = 'reused'; at = handed[step]; }
        }
        setHistoryTag(hist, i, label, kind, P(t, written[i], 0.25), bumpAt(t, at));
      });
      // the replayed row lights up while its result goes back (the windows never overlap)
      const scans = replay.map((q, i) => win(t, q + 0.15, back[i], 0.15));
      const lit = Math.max(0, scans.findIndex(o => o > 0));
      setHistoryScan(hist, ehStepRow(lit), Math.max(...scans));

      const dp = popIn(t, completed + 0.4, 0.08);
      place(s.done, EH.temporal.x, EH.doneY, dp.s, dp.o);
      placeFlash(s.flash, t, crashAt);
    }
  });
}
