// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  scene({
    // the end card stays on screen well after the subtitle
    pre: 1.0, post: 3.0,
    shift: [0, 40],
    subs: [
      {
        text: "Temporal Agent Harness is experimental and open source. Try the examples and build your own agents.",
        after: 1.5,
      },
    ],
    build(root, s) {
      s.t = E(root,
        '<div style="font-size:104px;letter-spacing:-3px;line-height:108px">Your agent, harnessed</div>'
        + '<div class="mono" style="font-size:24px;letter-spacing:.14em;padding-left:.14em;color:var(--violet);'
        + 'margin-top:30px">YOUR LOOP AND YOUR SDKS, RUN DURABLY BY TEMPORAL</div>'
        + '<span class="pill violet" style="display:inline-block;margin-top:30px;font-size:18px">Experimental</span>'
        + `<img src="${LOGO}" style="height:70px;display:block;margin:84px auto 0">`,
        // a fixed, even width keeps the centered block on whole pixels whatever the text widths
        '', { textAlign: 'center', width: '1140px' });
      s.llm = makeLLM(root, 120, '');
    },
    update(t, c, s) {
      place(s.t, 960, 577, 1, P(t, 0.4, 0.9));
      const p = P(t, 0.2, 0.8, backOut);
      place(s.llm.root, 960, 249, p, clamp(p * 2));
      llmState(s.llm, { lookY: 0.4 });
    }
  });
}
