// ===================== OUTRO
// The block keeps every name declared in this file local to this scene.
{
  scene({
    pre: 0.4, post: 2.6,
    shift: [0, 60],
    subs: [
      { text: "Temporal Workflows wait for people as long as it takes, and pick up right where they left off." },
    ],
    build(root, s) {
      s.t = E(root,
        '<div style="font-size:104px;letter-spacing:-3px;line-height:1.04">Human-in-the-Loop</div>'
        + '<div class="mono" style="font-size:24px;letter-spacing:.14em;color:var(--violet);margin-top:30px">'
        + 'WAITS AS LONG AS IT TAKES</div>'
        + `<img src="${LOGO}" style="height:70px;display:block;margin:76px auto 0">`,
        '', { textAlign: 'center' });
      s.person = makeAvatar(root, '', 120);
      // neon check badge on the person: the decision is in
      s.badge = E(root, ICON('check', 26, '#141414', 3), '', {
        width: '44px', height: '44px', background: C.neon, borderRadius: '50%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      });
    },
    update(t, c, s) {
      place(s.t, 960, 560, 1, P(t, 0.3, 0.8));
      const p = P(t, 0.1, 0.7, backOut);
      // the same 76 px from the person to the title as from the tagline to the logo
      place(s.person, 960, 266, p, clamp(p * 2));
      const bp = P(t, 0.8, 0.45, backOut);
      place(s.badge, 1003, 309, bp, clamp(bp * 2));
    }
  });
}
