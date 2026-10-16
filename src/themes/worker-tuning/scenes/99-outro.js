// ===================== OUTRO
// Starts on chapter 7's last frame (a hard cut): the mini Worker that the recap's Slot grid part has grown into
// (OUTRO_WORKER), above the end card, which builds under it.
// The block keeps every name declared in this file local to this scene.
{
  scene({
    // the end card stays on screen well after the subtitle
    pre: 1.0, post: 3.0,
    // a hard cut: chapter 7 ends on this scene's first frame; the video still fades out at its end
    fadeIn: 0,
    // the Worker and the end card, measured: centered on the content frame's middle, y 515
    shift: OUTRO_SHIFT,
    subs: [
      {
        text: "Tune one bottleneck at a time, and your Temporal Workers keep up when traffic spikes.",
        after: 1.5,
      },
    ],
    build(root, s) {
      s.t = makeEndCard(root, 'Tuning Temporal Workers', 'WORKERS THAT KEEP UP WITH YOUR TRAFFIC');
      s.worker = makeOutroWorker(root);
    },
    update(t, c, s) {
      placeEndCard(s.t, t, 0.4, 0.9);
      place(s.worker, OUTRO_WORKER.x, OUTRO_WORKER.y, 1, 1);
      setOutroWorker(s.worker);
    },
  });
}
