// ===================== INTRO
// The block keeps every name declared in this file local to this scene.
{
  scene({
    pre: 1.0,
    shift: [-54, 82],
    subs: [
      { text: "AI agents search, book and send emails for us. But how do they actually work?", after: 0.3 },
    ],
    build(root, s) {
      s.t = E(root,
        `<img src="${LOGO}" style="height:58px;display:block;margin-bottom:46px">`
        + '<div class="mono" style="font-size:22px;letter-spacing:.14em;color:var(--slate)">'
        + 'AN EXPLAINER FOR EVERYONE</div>'
        + '<div style="font-size:116px;line-height:1.02;letter-spacing:-3px;margin-top:22px">'
        + 'How does an<br>AI agent work?</div>'
        + '<div class="mono" style="font-size:24px;letter-spacing:.12em;color:var(--violet);margin-top:34px">'
        + 'AND WHY IT NEEDS DURABLE EXECUTION</div>');
      s.llm = makeLLM(root, 250, '');
      s.orb = ['sun', 'cal', 'mail', 'search', 'food'].map(n => E(root, ICON(n, 50, C.ink, 1.6)));
    },
    update(t, c, s) {
      place(s.t, 700, 440, 1, P(t, 0.15, 0.9));
      s.t.style.transform += ` translateY(${(1 - P(t, 0.15, 0.9)) * 24}px)`;
      const p = P(t, 0.4, 0.9, backOut);
      place(s.llm.root, 1460, 460, p, clamp(p * 2));
      llmState(s.llm, { look: Math.sin(G * 0.8) * 0.6 });
      s.orb.forEach((e, i) => {
        const a = G * 0.45 + i * (Math.PI * 2 / 5), pp = P(t, 0.9 + i * 0.15, 0.6, backOut);
        const depth = 0.45 + 0.55 * (Math.sin(a) + 1) / 2;
        place(e, 1460 + Math.cos(a) * 260, 460 + Math.sin(a) * 175, pp, clamp(pp * 2) * depth);
      });
    }
  });
}
