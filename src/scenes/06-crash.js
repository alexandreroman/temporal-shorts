// ===================== 6. CRASH
// The block keeps every name declared in this file local to this scene.
{
  const makeBill = p => {
    const e = E(p, `<div class="lbl" style="font-size:16px">LLM calls billed</div><div style="display:flex;align-items:baseline;gap:14px;margin-top:6px"><div class="n" style="font-size:84px;line-height:1">0</div><div class="w mono" style="font-size:20px;color:var(--red);letter-spacing:.08em"></div></div><div class="sq" style="display:flex;gap:6px;margin-top:10px"></div>`, 'tile', { width: '380px', height: '200px', textAlign: 'left', padding: '18px 24px' });
    e.n = e.querySelector('.n'); e.w = e.querySelector('.w'); e.sq = e.querySelector('.sq');
    e.sq.innerHTML = Array.from({ length: 8 }, () => `<i style="display:block;width:30px;height:16px;background:rgba(248,250,252,.08);border-radius:3px"></i>`).join('');
    e.cells = e.sq.querySelectorAll('i');
    return e;
  };
  const setBill = (b, n, wasted) => {
    b.n.textContent = n; b.n.style.color = wasted ? C.red : C.ink;
    b.w.textContent = wasted ? `+${wasted} wasted` : '';
    b.cells.forEach((q, i) => q.style.background = i < n ? (i >= n - wasted ? C.red : C.uv) : 'rgba(248,250,252,.08)');
  };
  scene({
    chapter: 6, title: 'When the agent crashes',
    subs: [
      { text: "Now the app running the agent crashes in the middle of the booking. Restarts, deploys, network cuts: it happens every day.", after: 0.4 },
      { text: "The context lived in the app's memory, not in the LLM. It's gone, so the agent has to start over.", after: 0.4 },
      { text: "Every LLM call is made, and paid for, a second time, just to rebuild the context. And the table gets booked twice.", after: 1.2 },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.links = [0, 1, 2].map(i => path(s.svg, `M ${420 + i * 360 + 142} 290 L ${420 + (i + 1) * 360 - 142} 290`, '#3A4150', 2, false));
      s.steps = STEPS.map(([i, l]) => makeStep(root, i, l));
      s.ticket = E(root, `<div style="display:flex;align-items:center;gap:12px">${ICON('ticket', 34, C.ink, 1.6)}<span class="n mono" style="font-size:20px;letter-spacing:.08em">1 BOOKING</span></div>`, '', { padding: '10px 16px', border: '1.5px solid ' + C.slate, borderRadius: 'var(--rs)' });
      s.ticketN = s.ticket.querySelector('.n');
      s.mem = E(root, `<div class="lbl" style="position:absolute;left:22px;top:16px;display:flex;gap:10px;align-items:center">${ICON('server', 22, C.slate, 1.8)} App memory</div><div class="vide mono" style="position:absolute;left:0;right:0;top:92px;text-align:center;font-size:26px;letter-spacing:.14em;color:var(--red);opacity:0">EMPTY</div>`, 'tile', { width: '860px', height: '200px', textAlign: 'left' });
      s.vide = s.mem.querySelector('.vide');
      s.mblocks = ['#E6E7FC', '#F3FBD2', '#E6E7FC', '#F3FBD2', '#E6E7FC'].map(col => E(root, '', '', { width: '130px', height: '60px', background: col, borderRadius: 'var(--rs)' }));
      s.bill = makeBill(root);
      s.bolt = E(root, ICON('bolt', 150, C.red, 1.6));
      s.flash = E(root, '', '', { width: '1920px', height: '1080px', background: C.red });
      s.crash = tag(root, 'App crash', 'red big');
      s.causes = ['Restart', 'Deploy', 'Network cut'].map(l => tag(root, l));
      s.redo = path(s.svg, 'M 1140 210 Q 780 80 430 205', C.red, 3);
      s.redoL = E(root, 'Start over', 'lbl', { color: C.red });
    },
    update(t, c, s) {
      const crashAt = c[0] + 3.9, restart = c[1] + 2.2;
      const shake = Math.max(0, 1 - Math.abs(t - crashAt - 0.2) / 0.4);
      const sx = Math.sin(G * 90) * 12 * shake, sy = Math.cos(G * 77) * 8 * shake;
      const r1 = [[c[0] + 0.3, c[0] + 1.3], [c[0] + 1.4, c[0] + 2.4], [c[0] + 2.5, 1e9], [1e9, 1e9]];
      const r2 = [[c[2] + 0.2, c[2] + 0.9], [c[2] + 1.0, c[2] + 1.7], [c[2] + 1.8, c[2] + 2.6], [1e9, 1e9]];
      s.steps.forEach((e, i) => {
        let st = 0;
        const [a, b] = t < restart ? r1[i] : r2[i];
        if (t >= a) st = t >= b ? 2 : 1;
        if (t < restart && i === 2 && t >= crashAt) st = 3;
        stepState(e, st);
        const p = P(t, 0.1 + i * 0.12, 0.45, backOut);
        place(e, 420 + i * 360 + sx, 290 + sy, p, clamp(p * 2));
      });
      s.links.forEach((l, i) => draw(l, P(t, 0.5 + i * 0.12, 0.35)));
      // LLM call counter
      const calls = [c[0] + 0.3, c[0] + 1.4, c[0] + 2.5, c[2] + 0.2, c[2] + 1.0, c[2] + 1.8].filter(x => t >= x).length;
      setBill(s.bill, calls, Math.max(0, calls - 3));
      place(s.bill, 1560 + sx, 630 + sy, P(t, 0.3, 0.45, backOut), P(t, 0.3, 0.4));
      // ticket
      const two = t >= c[2] + 2.6;
      s.ticketN.textContent = two ? '2 BOOKINGS!' : '1 BOOKING';
      s.ticket.style.borderColor = two ? C.red : C.slate; s.ticketN.style.color = two ? C.red : C.ink;
      const tp = P(t, c[0] + 3.2, 0.45, backOut);
      place(s.ticket, 1140 + sx, 435, tp * (1 + 0.2 * win(t, c[2] + 2.6, c[2] + 3.2, 0.2)), clamp(tp * 2));
      // memory
      place(s.mem, 720 + sx, 630 + sy, 1, P(t, 0.3, 0.45));
      s.mem.style.borderColor = t > crashAt && t < restart ? C.red : '#3A4150';
      s.vide.style.opacity = P(t, c[1] + 1.2, 0.4) * (1 - P(t, restart, 0.3));
      const add1 = [0.8, 1.3, 1.9, 2.4, 3.0].map(x => c[0] + x), add2 = [0.6, 0.9, 1.4, 1.7, 2.3].map(x => c[2] + x);
      s.mblocks.forEach((b, i) => {
        const x = 720 - 300 + i * 150, y = 650;
        const a = P(t, add1[i], 0.35, backOut), fall = P(t, c[1] + 0.3 + i * 0.1, 0.8, easeIn);
        let o = clamp(a * 2) * (1 - fall), yy = y + fall * 300, r = fall * (i % 2 ? 40 : -35), sc = a;
        if (t >= restart) { const a2 = P(t, add2[i], 0.35, backOut); o = clamp(a2 * 2); yy = y; r = 0; sc = a2; }
        place(b, x + sx, yy + sy, sc, o, r);
      });
      const f = Math.max(0, 1 - Math.abs(t - crashAt) / 0.28);
      place(s.flash, 960, 540, 1, f * 0.4);
      const bp = P(t, crashAt, 0.35, backOut);
      place(s.bolt, 1290, 190, bp, win(t, crashAt, crashAt + 1.5, 0.2));
      place(s.crash, 1560, 440, bp, win(t, crashAt + 0.1, c[1] + 0.3, 0.25));
      s.causes.forEach((e, i) => { const p = P(t, c[0] + 4.8 + i * 0.3, 0.4, backOut); place(e, 330 + i * 230, 440, p, clamp(p * 2) * (1 - P(t, c[1], 0.35))); });
      draw(s.redo, P(t, c[1] + 2.4, 0.8), 1 - P(t, c[2] + 3.0, 0.4));
      place(s.redoL, 785, 122, 1, P(t, c[1] + 2.9, 0.35) * (1 - P(t, c[2] + 3.0, 0.4)));
    }
  });
}
