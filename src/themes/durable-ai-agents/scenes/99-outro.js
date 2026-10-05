// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  scene({
    pre: 0.4, post: 2.6,
    shift: [0, 51],
    subs: [{ text: "Durable AI agents never lose their progress, or your budget." }],
    build(root, s) {
      s.t = E(root,
        '<div style="font-size:104px;letter-spacing:-3px;line-height:1.04">Durable AI agents</div>'
        + '<div class="mono" style="font-size:24px;letter-spacing:.14em;color:var(--violet);margin-top:30px">'
        + 'NEVER LOSE THEIR PROGRESS, OR YOUR BUDGET</div>'
        + `<img src="${LOGO}" style="height:70px;display:block;margin:76px auto 0">`,
        '', { textAlign: 'center' });
      s.llm = makeLLM(root, 120, '');
    },
    update(t, c, s) {
      place(s.t, 960, 560, 1, P(t, 0.3, 0.8));
      const p = P(t, 0.1, 0.7, backOut);
      place(s.llm.root, 960, 286, p, clamp(p * 2));
      llmState(s.llm, { lookY: 0.4 });
    }
  });
}
