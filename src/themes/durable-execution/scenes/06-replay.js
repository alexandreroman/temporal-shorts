// ===================== 6. WHEN A WORKER CRASHES
// Opens on the last frame of chapter 5 (same shot): Worker A crashes while shipPackage runs, Worker B replays the
// code from the start, Temporal hands back the saved results (no second charge), then the Workflow carries on.
// The block keeps every name declared in this file local to this scene.
{
  // the two replayed steps: chargeCard (line 2, row 2) and reserveItem (line 3, row 3)
  const REUSED_LABELS = ['REUSED, NOT RE-CHARGED', 'REUSED, NOT RE-RUN'];
  // "From the start": arrow in the gap right of the Worker panel, from line 4 back to line 1
  const workerRight = EH.worker.x + EH.worker.w / 2;
  const ARC = { x0: workerRight + 14, x1: workerRight + 22, bulge: workerRight + 105 };
  scene({
    chapter: 6, title: 'When a Worker crashes',
    shift: EH.shift,
    subs: [
      {
        text: "Now the Worker crashes mid-order. "
          + "Another Worker picks up the Workflow and runs its code from the start.",
        after: 0.4,
      },
      {
        text: "For every step already in the history, Temporal hands back the saved result: no second charge.",
        after: 0.4,
      },
      { text: "Then the Workflow carries on exactly where it stopped, as if nothing had happened.", after: 1.0 },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      const y1 = ehLineY(0), y4 = ehLineY(3);
      s.restart = arrow(s.svg, `M ${ARC.x0} ${y4} C ${ARC.bulge} ${y4}, ${ARC.bulge} ${y1}, ${ARC.x1} ${y1}`,
        C.violet, 3);
      s.restartL = E(root, 'From the start', 'lbl', { color: C.violet, fontSize: '16px' });
      s.shot = makeEventHistoryShot(root, ['WORKER A', 'WORKER B']);
      s.reuseChips = [0, 1].map(() => makeResultCard(root));
      s.saveChips = [0, 1].map(() => makeResultCard(root));
      s.done = tag(root, 'Workflow complete', 'neon');
      // an even height (29 px line + 9 px padding + 1.5 px border, twice), so the centered tag rests on whole
      // pixels, level with the counter row; dark like the SAVED tags, as it sits on the light history card
      Object.assign(s.done.style, { height: '50px', lineHeight: '29px', background: '#141414' });
      // oversized so it still covers the whole stage once the scene is shifted
      s.flash = E(root, '', '', { width: '2400px', height: '1400px', background: C.red });
    },
    update(t, c, s) {
      const { shot } = s;
      const [workerA, workerB] = shot.workers;
      const crashAt = c[0] + 1.2, bOn = crashAt + 1.6, jump = bOn + 0.7;
      // replay: line 2 then line 3 get their saved result back from rows 2 and 3
      // (handed: the chip leaves the history; back: it reaches the code line; told: the tag says why it matters)
      const replay = [0, 1].map(i => c[1] + 0.6 + i * 1.3);
      const handed = replay.map(q => q + 0.3), back = handed.map(h => h + 0.6), told = back.map(b => b + 0.15);
      // carry on: shipPackage (line 4, row 4), emailReceipt (line 5, row 5), then "}" and "Workflow completed"
      const run = [0, 1].map(i => c[2] + 0.3 + i * 1.3);
      const res = run.map(r => r + RESULT_LAG), saved = res.map(r => r + SAVE_LAG);
      const finish = run[1] + 1.3, completed = finish + 0.3;
      const [sx, sy] = shakeAt(t, crashAt);
      const dead = t >= crashAt;

      // Worker A runs, crashes and fades; Worker B takes over in the same place
      // cross-fade, so the code card never floats without a panel
      place(workerA, EH.worker.x + sx, EH.worker.y + sy, 1, 1 - P(t, bOn - 0.2, 0.4));
      if (dead) setWorkerStatus(workerA, 'CRASHED', 'crashed');
      else setWorkerStatus(workerA, 'RUNNING', 'running');
      place(workerB, EH.worker.x, EH.worker.y, 1, P(t, bOn - 0.2, 0.4));
      if (t < replay[0] - 0.4) setWorkerStatus(workerB, 'TAKING OVER', t >= jump ? 'running' : 'idle');
      else if (t < c[2] + 0.2) setWorkerStatus(workerB, 'REPLAYING…', 'running');
      else if (t < completed) setWorkerStatus(workerB, 'RUNNING', 'running');
      else setWorkerStatus(workerB, 'DONE', 'idle');
      // the status texts swap without overlapping: CRASHED leaves before the panels cross-fade, TAKING OVER after
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

      // code highlight: line 4 until the crash; back to line 1 for Worker B, then lines 2 to 6
      let line = 3;
      line = lerp(line, 0, P(t, jump + 0.2, 0.6));
      replay.forEach((q, i) => { line = lerp(line, i + 1, P(t, q, 0.25)); });
      run.forEach((r, i) => { line = lerp(line, i + 3, P(t, r, 0.25)); });
      line = lerp(line, 5, P(t, finish, 0.25));
      const barOn = dead ? P(t, jump, 0.2) * (1 - P(t, completed + 0.3, 0.4)) : 1;
      const lineSx = dead ? 0 : sx, lineSy = dead ? 0 : sy;
      setCodeLine(shot.code, line, barOn);
      const spinning = (1 - P(t, crashAt, 0.05)) + runningSpin(t, run[0]) + runningSpin(t, run[1]);
      setCodeSpinner(shot, line, spinning, lineSx, lineSy);
      // "From the start": drawn as the highlight jumps back, gone once the replay starts
      const arcOut = 1 - P(t, replay[0] - 0.3, 0.3);
      draw(s.restart, P(t, jump, 0.6), arcOut);
      place(s.restartL, ARC.x1 + 85, ehLineY(0) - 44, 1, P(t, jump + 0.4, 0.35) * arcOut);

      // RESULT chips: back from the history to the code when replaying, to the history when running for real
      s.reuseChips.forEach((e, i) => flyResultToCode(e, t, handed[i], i + 1));
      s.saveChips.forEach((e, i) => flyResultToHistory(e, t, res[i], i + 3));

      // Event History: rows 1-3 kept through the crash, replayed rows lit and re-tagged, then rows 4-6 written
      const hist = shot.hist;
      markEventHistoryCrash(hist, P(t, crashAt + 0.7, 0.4), P(t, crashAt + 0.3, 0.3));
      const written = [-Infinity, -Infinity, -Infinity, saved[0], saved[1], completed];
      hist.rows.forEach((_, i) => showHistoryRow(hist, i, P(t, written[i] - 0.1, 0.3)));
      hist.tags.forEach((_, i) => {
        let label = 'SAVED', at = written[i];
        const step = i - 1;
        if (step === 0 || step === 1) {
          if (t >= told[step]) { label = REUSED_LABELS[step]; at = told[step]; }
          else if (t >= handed[step]) { label = 'REUSED'; at = handed[step]; }
        }
        setHistoryTag(hist, i, label, P(t, written[i], 0.25), bumpAt(t, at));
      });
      // the replayed row lights up while its result goes back (the two windows never overlap)
      const scans = replay.map((q, i) => win(t, q + 0.15, back[i], 0.15));
      setHistoryScan(hist, scans[1] > 0 ? 2 : 1, Math.max(...scans));

      const dp = popIn(t, completed + 0.4, 0.08);
      place(s.done, EH.temporal.x, EH.doneY, dp.s, dp.o);
      place(s.flash, 960, 540, 1, flashAt(t, crashAt) * 0.4);
    }
  });
}
