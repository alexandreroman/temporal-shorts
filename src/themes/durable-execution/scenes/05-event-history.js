// ===================== 5. THE EVENT HISTORY
// Stub: the subtitles are final; build() and update() show the theme helpers at rest until the scene is animated.
// The block keeps every name declared in this file local to this scene.
{
  // Worker on the left (code card inside), Temporal on the right (Event History inside)
  const WK = { x: 450, y: 470 };
  const TP = { x: 1370, y: 520, w: 860, h: 450, histDy: 25 };
  scene({
    chapter: 5, title: 'The Event History',
    shift: [10, -63],
    subs: [
      {
        text: "Your code runs on your own servers, called <b>Workers</b>. "
          + "Temporal keeps an <b>Event History</b>, outside the Workers.",
        after: 0.5,
      },
      {
        text: "Each Activity result is saved in the history before the Workflow moves on to the next step.",
        after: 1.0,
      },
    ],
    build(root, s) {
      s.worker = makeWorkerPanel(root, 'WORKER A');
      s.code = makeCodeCard(root, { header: 'Workflow' });
      s.charge = makeCharge(root);
      s.order = makeOrderStatus(root);
      s.temporal = makeTemporalPanel(root, TP.w, TP.h);
      s.hist = makeHistory(root);
      s.result = makeResultCard(root);
    },
    update(t, c, s) {
      const o = P(t, 0.15, 0.6);
      place(s.worker, WK.x, WK.y, 1, o);
      setWorkerStatus(s.worker, 'RUNNING placeOrder', 'running');
      place(s.code, WK.x, WK.y + WORKER.codeDy, 1, o);
      s.code.hdr.style.opacity = 1;
      setCodeLine(s.code, 3, 1);
      place(s.charge, 270, 800, 1, o);
      setCharge(s.charge, 42, 'CHARGED ONCE', C.neon);
      place(s.order, 650, 800, 1, o);
      setOrderStatus(s.order, 'PAID, NOT SHIPPED', C.red);
      place(s.temporal, TP.x, TP.y, 1, o);
      place(s.hist, TP.x, TP.y + TP.histDy, 1, o);
      s.hist.rows.forEach((_, i) => showHistoryRow(s.hist, i, 1));
      const labels = ['SAVED', 'REUSED, NOT RE-CHARGED', 'REUSED, NOT RE-RUN', 'SAVED', 'SAVED', 'SAVED'];
      labels.forEach((label, i) => setHistoryTag(s.hist, i, label, 1));
      markHistoryCrash(s.hist, 3, 1, 1);
      setHistoryScan(s.hist, 4, 1);
      place(s.result, 870, WK.y + WORKER.codeDy + s.code.lineY(3), 1, o);
    }
  });
}
