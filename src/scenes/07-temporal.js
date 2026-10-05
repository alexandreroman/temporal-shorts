// ===================== 7. TEMPORAL
// The block keeps every name declared in this file local to this scene.
{
  const JR = ['LLM call: check the calendar', 'Calendar: Thu 12:30 is free', 'LLM call: find a restaurant', 'Search: Chez Paulette', 'LLM call: book a table', 'Booking: table for 2, confirmed', 'LLM call: invite Marie', 'Email: invite sent'];
  const makeWorker = (p, name) => {
    const e = E(p, `${ICON('server', 48, C.ink, 1.6)}<div class="mono" style="font-size:20px;letter-spacing:.1em;padding-left:.1em;margin-top:12px">${name}</div><div class="st mono" style="font-size:16px;letter-spacing:.08em;padding-left:.08em;color:var(--slate);margin-top:6px"></div>`, 'tile', { width: '270px', height: '170px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' });
    e.st = e.querySelector('.st'); return e;
  };
  scene({
    chapter: 7, title: 'Durable Execution with Temporal',
    subs: [
      { text: "<b>Durable Execution</b> with Temporal fixes this. Every completed step is recorded in an Event History.", after: 1.6 },
      { text: "If the app crashes, another copy of it takes over, replays the history, and resumes exactly where it stopped.", after: 1.2 },
      { text: "Previous LLM calls aren't lost: their results come straight from the history. Nothing is re-run, no token is paid twice.", after: 0.8 },
      { text: "No duplicate booking either. Plus automatic retries, waiting days for a human, and full visibility.", after: 1.2 },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.title = E(root, `<img src="assets/temporal-logo-horizontal-light-cropped.svg" style="height:150px;display:block">`);
      s.A = makeWorker(root, 'APP INSTANCE A'); s.B = makeWorker(root, 'APP INSTANCE B');
      s.steps = STEPS.map(([i, l]) => makeStep(root, i, l, 240, 112));
      s.jr = E(root, `<div class="mono" style="position:absolute;left:26px;top:20px;font-size:18px;letter-spacing:.14em;color:#141414;display:flex;gap:10px;align-items:center">${ICON('book', 22, '#141414', 1.8)} EVENT HISTORY</div><div class="mono" style="position:absolute;right:26px;top:22px;font-size:14px;letter-spacing:.1em;color:#5B6475">STORED OUTSIDE THE APP</div>`, '', { width: '1040px', height: '440px', background: '#F8FAFC', color: '#141414', borderRadius: 'var(--r)' });
      // rows 1-6 survive the crash: tinted block + crash line under them
      s.kept = E(s.jr, '', '', { left: '14px', top: '64px', width: '1012px', height: '262px', background: 'rgba(68,76,231,.08)', borderLeft: '4px solid ' + C.uv, borderRadius: 'var(--rs)', transform: 'none' });
      s.cut = E(s.jr, `<span class="mono" style="position:absolute;left:62%;top:-10px;transform:translateX(-50%);background:#F8FAFC;padding:0 10px;font-size:13px;line-height:18px;letter-spacing:.12em;color:${C.red};white-space:nowrap">APP CRASHED HERE</span>`, '', { left: '26px', top: '330px', width: '988px', height: '0', borderTop: '2px dashed ' + C.red, transform: 'none' });
      s.rows = JR.map((txt, i) => {
        const llm = txt.startsWith('LLM');
        return E(s.jr, `<span style="color:#8A93A6;display:inline-block;width:34px">${i + 1}</span><span style="color:${llm ? C.uv : '#141414'}">${txt}</span>`, 'mono', { left: '26px', top: (70 + i * 44) + 'px', fontSize: '21px', whiteSpace: 'nowrap', padding: '4px 10px', transform: 'none', width: '988px' });
      });
      s.tags = JR.map((_, i) => E(s.jr, '', 'mono', { left: 'auto', right: '36px', top: (74 + i * 44) + 'px', fontSize: '15px', letterSpacing: '.1em', padding: '4px 10px', borderRadius: '4px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px', transformOrigin: 'right center' }));
      s.scan = E(s.jr, '', '', { left: '18px', width: '1004px', height: '42px', background: 'rgba(182,100,255,.28)', transform: 'none', borderRadius: 'var(--rs)' });
      s.wA = path(s.svg, 'M 370 330 L 650 430', C.violet, 2.5, true, '10,8');
      s.wB = path(s.svg, 'M 650 690 L 370 655', C.neon, 2.5, true, '10,8');
      s.wAL = E(root, 'writes', 'lbl'); s.wBL = E(root, 'replays', 'lbl');
      s.flash = E(root, '', '', { width: '1920px', height: '1080px', background: C.red });
      s.done = tag(root, 'Agent complete', 'neon');
      // budget comparison
      const bar = (n, wasted, col) => Array.from({ length: n }, (_, i) => `<i style="display:block;width:86px;height:46px;background:${i >= n - wasted ? C.red : col};border-radius:var(--rs)"></i>`).join('');
      s.cmp = E(root, `
      <div class="lbl" style="font-size:18px">Without Durable Execution</div>
      <div style="display:flex;align-items:center;gap:22px;margin-top:12px"><div style="display:flex;gap:8px">${bar(7, 3, '#5B6475')}</div><div class="mono" style="font-size:26px;white-space:nowrap">7 LLM calls <span style="color:var(--red)">(3 wasted)</span></div></div>
      <div class="lbl" style="font-size:18px;margin-top:46px;color:var(--violet)">With Temporal</div>
      <div style="display:flex;align-items:center;gap:22px;margin-top:12px"><div style="display:flex;gap:8px">${bar(4, 0, C.uv)}</div><div class="mono" style="font-size:26px;white-space:nowrap">4 LLM calls <span style="color:var(--neon)">(0 wasted)</span></div></div>
      <div style="display:flex;align-items:center;gap:18px;margin-top:56px">${ICON('coin', 56, C.neon, 1.6)}<div style="font-size:46px">43% less LLM spend <span class="lbl" style="font-size:18px">in this example</span></div></div>`, '');
      s.ben = [['ticket', 'One booking only'], ['retry', 'Automatic retries'], ['user', 'Waits for humans'], ['eye', 'Full visibility']].map(([i, l]) => iconTile(root, i, l, 330, 230, i === 'ticket' ? C.neon : C.ink));
    },
    update(t, c, s) {
      const tp = P(t, c[0] + 0.1, 0.7, backOut);
      place(s.title, 960, 540, tp * (1 + 0.06 * P(t, c[0] + 1.6, 0.6)), clamp(tp * 2) * (1 - P(t, c[0] + 1.8, 0.5)));
      const rowT = [0, 1, 2, 3, 4, 5].map(i => c[0] + 3.2 + i * 0.55).concat([c[1] + 4.6, c[1] + 5.4]);
      const crashAt = c[1] + 0.3, bOn = c[1] + 1.2;
      const sceneOut = P(t, c[2] + 3.4, 0.5);
      s.kept.style.opacity = P(t, crashAt + 0.6, 0.4);
      s.cut.style.opacity = P(t, crashAt + 0.2, 0.3);
      const L = P(t, c[0] + 2.3, 0.5) * (1 - sceneOut);
      place(s.jr, 1180, 570, 1, L);
      s.rows.forEach((r, i) => { const p = P(t, rowT[i], 0.3); r.style.opacity = p; r.style.transform = `translateX(${(1 - p) * 26}px)`; });
      const sp = clamp((t - (c[1] + 2.0)) / 1.4);
      // per-row status: SAVED when written, REUSED once replayed, then why it matters
      s.tags.forEach((e, i) => {
        const llm = JR[i].startsWith('LLM'), scanned = c[1] + 2.0 + (i + 1) * 1.4 / 6, told = c[2] + 0.3 + i * 0.15;
        const reused = i < 6 && t >= scanned, full = i < 6 && t >= told;
        const label = !reused ? 'SAVED' : !full ? 'REUSED' : llm ? 'REUSED, NOT RE-BILLED' : 'REUSED, NOT RE-RUN';
        if (e._l !== label) {
          e._l = label;
          e.innerHTML = reused ? label : ICON('check', 16, C.neon, 2.6) + label;
          e.style.background = reused ? C.uv : '#141414'; e.style.color = reused ? '#FFFFFF' : C.neon;
        }
        const sw = full ? told : reused ? scanned : rowT[i] + 0.25;
        e.style.opacity = P(t, rowT[i] + 0.25, 0.25);
        e.style.transform = `scale(${1 + 0.14 * Math.max(0, 1 - Math.abs(t - sw - 0.1) / 0.25)})`;
      });
      s.scan.style.opacity = sp > 0 && sp < 1 ? 1 : 0;
      s.scan.style.top = (68 + Math.min(5, Math.floor(sp * 6)) * 44) + 'px';
      // workers
      const a = P(t, c[0] + 2.3, 0.5, backOut);
      const fA = Math.max(0, 1 - Math.abs(t - crashAt) / 0.28);
      place(s.A, 230 + Math.sin(G * 90) * 10 * fA, 330, a, clamp(a * 2) * (1 - sceneOut));
      const dead = t >= crashAt;
      s.A.style.borderColor = dead ? C.red : C.violet;
      s.A.st.textContent = dead ? 'CRASHED' : 'RUNNING THE AGENT'; s.A.st.style.color = dead ? C.red : C.slate;
      const b = P(t, bOn, 0.5, backOut);
      place(s.B, 230, 655, b, clamp(b * 2) * (1 - sceneOut));
      s.B.style.borderColor = C.neon;
      s.B.st.textContent = t < c[1] + 2.0 ? 'TAKING OVER' : t < c[1] + 3.4 ? 'REPLAYING…' : 'RUNNING THE AGENT';
      draw(s.wA, P(t, c[0] + 3.0, 0.4), (1 - P(t, crashAt, 0.3)) * (1 - sceneOut));
      place(s.wAL, 520, 350, 1, P(t, c[0] + 3.2, 0.3) * (1 - P(t, crashAt, 0.3)));
      draw(s.wB, P(t, c[1] + 1.8, 0.4), 1 - sceneOut);
      place(s.wBL, 510, 705, 1, P(t, c[1] + 1.9, 0.3) * (1 - sceneOut));
      place(s.flash, 960, 540, 1, fA * 0.38);
      s.steps.forEach((e, i) => {
        let st = 0;
        if (i < 3) { if (t >= rowT[2 * i] - 0.25) st = 1; if (t >= rowT[2 * i + 1] + 0.15) st = 2; }
        else { if (t >= rowT[5] + 0.6 && t < crashAt) st = 1; if (t >= c[1] + 3.8) st = 1; if (t >= rowT[7] + 0.15) st = 2; }
        stepState(e, st);
        const p = P(t, c[0] + 2.5 + i * 0.12, 0.45, backOut);
        place(e, 740 + i * 290, 200, p, clamp(p * 2) * (1 - sceneOut));
      });
      place(s.done, 1180, 852, P(t, rowT[7] + 0.5, 0.45, backOut), P(t, rowT[7] + 0.5, 0.35) * (1 - P(t, c[2], 0.3)));
      // budget comparison
      const cp = P(t, c[2] + 3.7, 0.6);
      place(s.cmp, 960, 470, 1, cp * (1 - P(t, c[3], 0.4)));
      s.cmp.style.transform += ` translateY(${(1 - cp) * 20}px)`;
      // benefits
      const at = [c[3] + 0.4, c[3] + 2.7, c[3] + 4.0, c[3] + 5.5];
      s.ben.forEach((e, i) => { const p = P(t, at[i], 0.45, backOut); place(e, 435 + i * 350, 470, p, clamp(p * 2)); e.style.borderColor = i === 0 ? C.neon : '#3A4150'; });
    }
  });
}
