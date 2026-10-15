// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  // a small Worker above the end card, its Slots busy with the five steps of an order and a few free: a Worker that
  // keeps up
  const WORKER = { x: 960, y: 238, cols: 4, rows: 2 };
  const FREE = [3, 6];

  scene({
    // the end card stays on screen well after the subtitle
    pre: 1.0, post: 3.0,
    // the Worker and the end card, measured: centered on the content frame's middle, y 515
    shift: [0, 80],
    subs: [
      {
        text: "Tune one bottleneck at a time, and your Temporal Workers keep up when traffic spikes.",
        after: 1.5,
      },
    ],
    build(root, s) {
      s.t = makeEndCard(root, 'Tuning Temporal Workers', 'WORKERS THAT KEEP UP WITH YOUR TRAFFIC');
      s.worker = makeMiniWorker(root, 'WORKER', WORKER.cols, WORKER.rows);
    },
    update(t, c, s) {
      placeEndCard(s.t, t, 0.4, 0.9);
      const p = backPop(t, 0.2, 0.8);
      place(s.worker, WORKER.x, WORKER.y, p.s, p.o);
      setAppStatus(s.worker, '', 'running');
      s.worker.cells.forEach((cell, i) => setSlot(cell, FREE.includes(i) ? 'free' : 'busy', activityIcon(i)));
    },
  });
}
