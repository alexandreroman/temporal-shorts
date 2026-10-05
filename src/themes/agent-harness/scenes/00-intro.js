// ===================== INTRO (placeholder until the script of this theme is written)
// The block keeps every name declared in this file local to this scene.
{
  scene({
    pre: 1.0, post: 2.0,
    // laid out around the stage center (960, 540), lifted to the center of the free band (960, 522)
    shift: [0, -18],
    subs: [{ text: "Temporal Agent Harness: this video is coming soon." }],
    build(root, s) {
      s.t = E(root,
        `<img src="${LOGO}" style="height:58px;display:block;margin:0 auto 56px">`
        + '<div class="mono" style="font-size:22px;letter-spacing:.14em;padding-left:.14em;color:var(--slate)">'
        + 'COMING SOON</div>'
        + '<div style="font-size:104px;line-height:1.04;letter-spacing:-3px;margin-top:22px">'
        + 'Temporal<br>Agent Harness</div>',
        '', { textAlign: 'center' });
    },
    update(t, c, s) {
      place(s.t, 960, 540, 1, P(t, 0.15, 0.9));
      s.t.style.transform += ` translateY(${(1 - P(t, 0.15, 0.9)) * 24}px)`;
    }
  });
}
