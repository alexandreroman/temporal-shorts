// ===================== 2. STATELESS
// The block keeps every name declared in this file local to this scene.
{
  // slide horizontally from x0 to x1 at height y, starting at a; `out` fades it away
  const slideIn = (e, t, a, x0, x1, y, out = 0) => {
    const p = P(t, a, 0.8);
    place(e, lerp(x0, x1, p), y, 1, P(t, a, 0.3) * (1 - out));
  };
  scene({
    chapter: 2, title: 'Stateless by design',
    shift: [30, 115],
    subs: [
      { text: "Surprise: the model has no memory. Tell it your name…", after: 1.4 },
      { text: "…then ask again in the next call. It has already forgotten.", after: 0.8 },
      {
        text: "That's by design: LLMs are <b>stateless</b>. So the app resends the whole conversation with every call.",
        after: 0.8,
      },
    ],
    build(root, s) {
      s.app = makeApp(root); s.llm = makeLLM(root, 220);
      s.u1 = makeCard(root, "Hi, I'm Alex.", 'user'); s.r1 = makeCard(root, "Nice to meet you, Alex!", 'llm');
      s.u2 = makeCard(root, "What's my name?", 'user');
      s.r2 = makeCard(root, "I don't know. You haven't told me.", 'bad');
      s.tag1 = tag(root, 'Call 1'); s.tag2 = tag(root, 'Call 2');
      const bubble = '<span class="mono" style="font-size:26px;color:#141414">Alex</span><div class="wipe"></div>';
      s.bub = E(root, bubble, '', {
        background: '#F8FAFC', padding: '10px 24px', overflow: 'hidden', borderRadius: 'var(--rs)',
      });
      s.wipe = s.bub.querySelector('.wipe');
      Object.assign(s.wipe.style, { position: 'absolute', left: 0, top: 0, bottom: 0, width: '0%', background: C.uv });
      s.bubT = E(root, 'memory wiped', 'lbl', { color: C.red });
      s.sl = tag(root, 'Stateless', 'violet big');
      const who = name => `<span style='color:#5B6475'>${name}</span>`;
      const history = `${who('YOU')}&nbsp;&nbsp;&nbsp;Hi, I'm Alex.<br>${who('MODEL')} Nice to meet you, Alex!<br>`
        + `${who('YOU')}&nbsp;&nbsp;&nbsp;What's my name?`;
      s.hist = makeCard(root, history, 'user', 'FULL HISTORY', 560);
      s.hist.querySelector('.txt').style.fontSize = '23px';
      s.r3 = makeCard(root, "You're Alex!", 'ok');
    },
    update(t, c, s) {
      const ap = P(t, c[0] + 0.1, 0.6, backOut);
      place(s.app, 250, 430, ap, clamp(ap * 2)); gearSpin(s.app, 0);
      place(s.llm.root, 1650, 430, P(t, c[0] + 0.3, 0.6, backOut), P(t, c[0] + 0.3, 0.4));
      const think = win(t, c[0] + 1.8, c[0] + 2.5, 0.2) + win(t, c[1] + 1.6, c[1] + 2.4, 0.2)
        + win(t, c[2] + 4.3, c[2] + 5.3, 0.2);
      llmState(s.llm, { think, q: win(t, c[1] + 2.6, c[2], 0.3), look: -1 });
      const chatOut = P(t, c[2], 0.5);
      slideIn(s.u1, t, c[0] + 1.0, 520, 820, 240, chatOut);
      slideIn(s.r1, t, c[0] + 2.5, 1420, 1150, 340, chatOut);
      place(s.tag1, 500, 290, 1, P(t, c[0] + 1.0, 0.4) * (1 - chatOut));
      const bo = P(t, c[0] + 3.4, 0.5, backOut);
      place(s.bub, 1650, 210, bo, clamp(bo * 2) * (1 - P(t, c[1] + 0.9, 0.4)));
      s.wipe.style.width = (P(t, c[1] + 0.1, 0.7) * 100) + '%';
      place(s.bubT, 1650, 150, 1, win(t, c[1] + 0.4, c[1] + 2.0, 0.3));
      slideIn(s.u2, t, c[1] + 0.8, 520, 820, 500, chatOut);
      place(s.tag2, 500, 550, 1, P(t, c[1] + 0.8, 0.4) * (1 - chatOut));
      slideIn(s.r2, t, c[1] + 2.3, 1420, 1150, 610, chatOut);
      const sp = P(t, c[2] + 0.4, 0.5, backOut);
      place(s.sl, 960, 210, sp, clamp(sp * 2));
      fly(s.hist, t, c[2] + 0.8, 600, 450, c[2] + 1.2, 0.8, 1180, 450, c[2] + 4.2, 1650, 430);
      const rp = P(t, c[2] + 5.3, 0.5, backOut), rf = P(t, c[2] + 5.6, 0.9);
      place(s.r3, lerp(1420, 900, rf), 620, rp, clamp(rp * 2));
    }
  });
}
