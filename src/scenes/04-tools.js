// ===================== 4. TOOLS
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 4, title: 'Tools',
    // pans down as the question card fades out
    shift: (t, c) => pan(t, [25, 57], [[c[2] + 0.4, 25, 20]]),
    subs: [
      { text: "The model can't check the weather or send an email. So we give it <b>tools</b>.", after: 0.6 },
      { text: "When it needs one, the model writes a request: “use the Weather tool, for Paris”. The app runs it…", after: 1.2 },
      { text: "…adds the result to the context, and calls the model again.", after: 1.0 },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.app = makeApp(root); s.llm = makeLLM(root, 200);
      s.q = makeCard(root, "What's the weather in Paris?", 'user');
      s.no = ['sun', 'mail'].map(n => E(root, `${ICON(n, 54, C.slate, 1.6)}<div style="position:absolute;left:-6px;right:-6px;top:50%;height:4px;background:${C.red};transform:rotate(-35deg)"></div>`));
      s.box = E(root, '', '', { width: '1000px', height: '210px', border: '1.5px dashed #4B5363', borderRadius: 'var(--r)' });
      s.boxL = E(root, 'Available tools', 'lbl');
      s.tiles = [['sun', 'Weather'], ['cal', 'Calendar'], ['mail', 'Email'], ['search', 'Web search']].map(([i, n]) => iconTile(root, i, n, 210, 150));
      s.req = makeCard(root, "tool: weather<br>city: Paris", 'tool', 'REQUEST FROM THE MODEL');
      s.res = makeCard(root, "18°C, sunny", 'tool', 'TOOL RESULT');
      s.run = path(s.svg, 'M 330 450 Q 360 600 480 640', C.neon, 3, true, '10,10');
      s.bundle = E(root, `<div class="mono" style="font-size:15px;letter-spacing:.12em;color:#5B6475;margin-bottom:8px">FULL CONTEXT</div>
      <div style="height:12px;background:#E6E7FC;margin:6px 0;width:260px;border-radius:3px"></div><div style="height:12px;background:#F2E6FF;margin:6px 0;width:200px;border-radius:3px"></div><div style="height:12px;background:#E4F78F;margin:6px 0;width:230px;border-radius:3px"></div>`, '', { background: '#F8FAFC', padding: '12px 20px', borderLeft: '6px solid ' + C.uv, borderRadius: 'var(--r)' });
      s.tag = tag(root, 'Call 2');
      s.ans = makeCard(root, "It's 18°C and sunny in Paris!", 'ok');
    },
    update(t, c, s) {
      place(s.app, 280, 330, P(t, c[0], 0.6, backOut), P(t, c[0], 0.4));
      gearSpin(s.app, win(t, c[1] + 3.8, c[2] + 0.4, 0.3));
      place(s.llm.root, 1640, 330, P(t, c[0] + 0.2, 0.6, backOut), P(t, c[0] + 0.2, 0.4));
      llmState(s.llm, { think: win(t, c[1] + 0.1, c[1] + 1.2, 0.2) + win(t, c[2] + 2.0, c[2] + 2.8, 0.2), q: win(t, c[0] + 1.4, c[0] + 3.4, 0.3), look: -1 });
      fly(s.q, t, c[0] + 0.3, 420, 190, c[0] + 0.6, 1.0, 960, 190);
      s.q.style.opacity *= 1 - P(t, c[2] + 0.4, 0.4);
      s.no.forEach((n, i) => { const p = P(t, c[0] + 1.6 + i * 0.25, 0.45, backOut); place(n, 1580 + i * 120, 570, p, clamp(p * 2) * (1 - P(t, c[0] + 3.4, 0.4))); });
      place(s.box, 960, 680, 1, P(t, c[0] + 2.8, 0.5)); place(s.boxL, 960, 552, 1, P(t, c[0] + 2.8, 0.5));
      const hl = win(t, c[1] + 1.2, c[2] + 0.2, 0.2);
      s.tiles.forEach((e, i) => {
        const p = P(t, c[0] + 3.0 + i * 0.2, 0.45, backOut);
        e.style.borderColor = (i === 0 && hl > 0.5) ? C.neon : '#3A4150';
        place(e, 600 + i * 240, 680, p, clamp(p * 2));
      });
      fly(s.req, t, c[1] + 1.2, 1330, 330, c[1] + 3.0, 0.8, 650, 330, c[2] + 0.0, 300, 330);
      draw(s.run, P(t, c[1] + 4.0, 0.5), 1 - P(t, c[2] + 0.2, 0.3));
      fly(s.res, t, c[1] + 4.8, 600, 620, c[1] + 5.2, 0.8, 660, 470, c[2] + 0.1, 300, 330);
      fly(s.bundle, t, c[2] + 0.5, 470, 330, c[2] + 0.9, 1.0, 1350, 330, c[2] + 1.8, 1640, 330);
      place(s.tag, lerp(470, 1350, P(t, c[2] + 0.9, 1.0)), 250, 1, win(t, c[2] + 0.5, c[2] + 1.9, 0.25));
      const aa = P(t, c[2] + 3.0, 0.5, backOut);
      place(s.ans, lerp(1350, 920, P(t, c[2] + 3.2, 0.9)), 330, aa, clamp(aa * 2));
    }
  });
}
