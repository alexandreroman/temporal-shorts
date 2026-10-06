// ===================== 5. THE EVENT HISTORY
// Worker A (code card inside) on the left, Temporal (Event History inside) on the right: the shot chapter 6
// continues. Each Activity result travels to the history and is saved before the highlight moves on.
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 5, title: 'The Event History',
    shift: EH.shift,
    subs: [
      {
        text: "Your code runs on your own servers, called <b>Workers</b>. "
          + "Temporal keeps an <b>Event History</b>, outside the Workers.",
        after: 0.3,
      },
      {
        text: "Each Activity result is saved in the history before the Workflow moves on to the next step.",
        after: 0.5,
      },
    ],
    build(root, s) {
      s.shot = makeEventHistoryShot(root, ['WORKER A']);
      s.chips = [0, 1].map(() => makeResultCard(root));
    },
    update(t, c, s) {
      const { shot } = s;
      const [worker] = shot.workers;
      // first run: chargeCard and reserveItem (steps 0 and 1) are saved, then shipPackage runs
      const go = c[1] + 0.2, started = c[1] + 0.5;
      const run = [0, 1, 2].map(i => c[1] + 1.0 + i * 1.3);
      // only the first two finish before the crash of chapter 6
      const res = run.slice(0, 2).map(r => r + RESULT_LAG), saved = res.map(r => r + SAVE_LAG);

      // Worker first, then Temporal and its Event History
      const wp = P(t, c[0] + 1.1, 0.5, backOut);
      place(worker, EH.worker.x, EH.worker.y, wp, clamp(wp * 2));
      setAppStatus(worker, t >= go ? 'RUNNING' : 'IDLE', t >= go ? 'running' : 'stopped');
      const chargePop = bumpAt(t, saved[0]);
      placeEventHistoryShot(shot, {
        code: P(t, c[0] + 1.4, 0.45), charge: P(t, c[0] + 1.7, 0.45), order: P(t, c[0] + 1.9, 0.45),
        temporal: P(t, c[0] + 2.8, 0.5), hist: P(t, c[0] + 3.1, 0.5), chargePop,
      });
      setCharge(shot.charge, t >= saved[0] ? 42 : 0);
      setOrderStatus(shot.order, 'PENDING');

      // code highlight: the function header, then each await line once the previous result is saved
      let line = 0;
      run.forEach((r, i) => { line = lerp(line, ehStepLine(i), P(t, r, 0.25)); });
      setCodeLine(shot.code, line, P(t, go, 0.3));
      const spinning = runningSpin(t, run[0]) + runningSpin(t, run[1]) + P(t, run[2] + 0.2, 0.15);
      setCodeSpinner(shot, line, spinning);

      // RESULT chips: from the line end to the history row, absorbed as the row is written
      s.chips.forEach((e, i) => flyResultToHistory(e, t, res[i], i));

      // Event History: "Workflow started", then one row per saved result, each tagged SAVED
      const written = [started, saved[0], saved[1]];
      shot.hist.rows.forEach((_, i) => showHistoryRow(shot.hist, i, i < 3 ? P(t, written[i] - 0.1, 0.3) : 0));
      shot.hist.tags.forEach((_, i) => {
        const at = i < 3 ? written[i] : Infinity;
        setHistoryTag(shot.hist, i, 'SAVED', 'saved', P(t, at, 0.25), bumpAt(t, at));
      });
      markCrash(shot.hist, 0, 0);
      setHistoryScan(shot.hist, 0, 0);
    }
  });
}
