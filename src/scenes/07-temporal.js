// ===================== 7. TEMPORAL
// The block keeps every name declared in this file local to this scene.
{
  const JR = ['LLM call: check the calendar', 'Calendar: Thu 12:30 is free', 'LLM call: find a restaurant', 'Search: Chez Paulette', 'LLM call: book a table', 'Booking: table for 2, confirmed', 'LLM call: invite Marie', 'Email: invite sent'];
  const isLLM = i => JR[i].startsWith('LLM');
  // Chapter 7 layout: app on the left, Temporal on the right, both under the step tiles
  const APP = { x: 470, y: 445 };
  const MEM = { x: 470, y: 469, slot0: 162, slotGap: 88, slotY: 484 }; // memory panel and its block slots
  const HIST = { x: 1380, y: 580, cardX: 1050, row0: 447, rowGap: 44 }; // Event History card and its rows
  const memSlot = i => MEM.slot0 + i * MEM.slotGap;
  const rowY = i => HIST.row0 + i * HIST.rowGap;
  // the big intro logo flies into the TEMPORAL panel header from c[0] + FLIGHT.at, for FLIGHT.d seconds
  const FLIGHT = { at: 1.9, d: 0.8 };
  const makeAppPanel = (p, name) => {
    const e = E(p, `<div style="position:absolute;left:24px;top:20px;display:flex;align-items:center;gap:12px"><div class="gear">${ICON('gear', 30, C.ink, 1.8)}</div><span class="mono" style="font-size:20px;letter-spacing:.1em">${name}</span></div><div class="st mono" style="position:absolute;right:24px;top:26px;font-size:16px;letter-spacing:.08em;color:var(--slate)"></div>`, 'tile', { width: '780px', height: '310px', textAlign: 'left' });
    e.gear = e.querySelector('.gear'); e.st = e.querySelector('.st');
    return e;
  };
  // state: 'idle', 'running' (the gear spins) or 'crashed' (red)
  const setAppStatus = (app, text, state) => {
    const crashed = state === 'crashed';
    app.st.textContent = text;
    app.st.style.color = crashed ? C.red : C.slate;
    app.style.borderColor = crashed ? C.red : C.violet;
    gearSpin(app, state === 'running' ? 1 : 0);
  };
  // small card carrying one step result between the app and Temporal (same colors as the memory blocks)
  const makeResultCard = (p, llm) => {
    return E(p, `<span class="mono" style="font-size:15px;letter-spacing:.12em;padding-left:.12em">RESULT</span>`, '', { background: llm ? '#E6E7FC' : '#F3FBD2', color: '#141414', padding: '6px 14px', borderLeft: `5px solid ${llm ? C.uv : '#9DB82A'}`, borderRadius: 'var(--rs)' });
  };
  scene({
    chapter: 7, title: 'Durable Execution with Temporal',
    // logo, then the app and Temporal panels, then the budget and benefits as the panels fade.
    // The first pan runs with the logo flight and ends on whole pixels as it lands, so the
    // native-size header logo that takes over stays pixel-aligned.
    shift: (t, c) => pan(t, [0, -18], [[c[0] + FLIGHT.at, 0, 32], [c[4], 0, -10]], FLIGHT.d),
    subs: [
      { text: "<b>Durable Execution</b> with Temporal fixes this. Temporal keeps an Event History of the agent, outside the app.", after: 0.3 },
      { text: "After each LLM call or tool call, Temporal saves the result in the history before the agent moves on.", after: 0.2 },
      { text: "If the app crashes, another copy runs the agent again from the start. For every step already saved…" },
      { text: "…Temporal hands back the result from the history. The LLM isn't called again: the context is rebuilt for free.", after: 0.3 },
      { text: "No token is paid twice, and the booking happens only once. Plus retries, human waits and full visibility.", after: 0.7 },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.steps = makeStepRow(root, s.svg, 465, 330, 200, 260, 104);
      s.restart = path(s.svg, 'M 1440 140 Q 960 40 480 140', C.violet, 3);
      s.restartL = E(root, 'From the start', 'lbl', { color: C.violet });
      // app side, mirroring chapter 6: instance panel, its memory, the LLM bill and the booking
      s.A = makeAppPanel(root, 'APP INSTANCE A'); s.B = makeAppPanel(root, 'APP INSTANCE B');
      s.mem = makeMemory(root, 732, 210);
      s.mblocks = makeMemBlocks(root, 8, 76, 56);
      s.bill = makeBill(root);
      s.bill.w.style.color = C.neon;
      s.ticket = makeTicket(root);
      // Temporal side: the Event History lives in Temporal, outside the app (the logo flies into the header)
      s.temporal = E(root, `<div class="lbl" style="position:absolute;right:24px;top:24px;font-size:16px">Outside the app</div>`, 'tile', { width: '920px', height: '530px', borderColor: C.uv });
      s.jr = E(root, `<div class="mono" style="position:absolute;left:26px;top:20px;font-size:18px;letter-spacing:.14em;color:#141414;display:flex;gap:10px;align-items:center">${ICON('book', 22, '#141414', 1.8)} EVENT HISTORY</div>`, '', { width: '880px', height: '440px', background: '#F8FAFC', color: '#141414', borderRadius: 'var(--r)' });
      // rows 1-6 survive the crash: tinted block + crash line under them
      s.kept = E(s.jr, '', '', { left: '14px', top: '64px', width: '852px', height: '262px', background: 'rgba(68,76,231,.08)', borderLeft: '4px solid ' + C.uv, borderRadius: 'var(--rs)', transform: 'none' });
      s.cut = E(s.jr, `<span class="mono" style="position:absolute;left:66%;top:-10px;transform:translateX(-50%);background:#F8FAFC;padding:0 10px;font-size:13px;line-height:18px;letter-spacing:.12em;color:${C.red};white-space:nowrap">APP CRASHED HERE</span>`, '', { left: '26px', top: '330px', width: '828px', height: '0', borderTop: '2px dashed ' + C.red, transform: 'none' });
      s.scan = E(s.jr, '', '', { left: '18px', width: '844px', height: '42px', background: 'rgba(182,100,255,.28)', transform: 'none', borderRadius: 'var(--rs)' });
      s.rows = JR.map((txt, i) => E(s.jr, `<span style="color:#8A93A6;display:inline-block;width:34px">${i + 1}</span><span style="color:${isLLM(i) ? C.uv : '#141414'}">${txt}</span>`, 'mono', { left: '26px', top: (70 + i * 44) + 'px', fontSize: '21px', whiteSpace: 'nowrap', padding: '4px 10px', transform: 'none', width: '828px' }));
      s.tags = JR.map((_, i) => E(s.jr, '', 'mono', { left: 'auto', right: '36px', top: (74 + i * 44) + 'px', fontSize: '15px', letterSpacing: '.1em', padding: '4px 10px', borderRadius: '4px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px', transformOrigin: 'right center' }));
      s.saveCards = JR.map((_, i) => makeResultCard(root, isLLM(i)));
      s.reuseCards = JR.slice(0, 6).map((_, i) => makeResultCard(root, isLLM(i)));
      // oversized so it still covers the whole stage once the scene is shifted
      s.flash = E(root, '', '', { width: '2400px', height: '1400px', background: C.red });
      s.done = tag(root, 'Agent complete', 'neon');
      s.logo = E(root, `<img src="assets/temporal-logo-horizontal-light-cropped.svg" style="height:150px;display:block">`);
      // native-size copy of the landed logo, on whole pixels where the flying logo lands (centered on 1005, 325)
      s.headerLogo = E(root, `<img src="assets/temporal-logo-horizontal-light-cropped.svg" style="height:34px;display:block">`,
        '', { left: '940px', top: '308px', transform: 'none' });
      // payoff: budget line, then the other benefits
      s.budget = E(root, `<div style="display:flex;align-items:center;gap:22px">${ICON('coin', 64, C.neon, 1.6)}<div><div style="font-size:52px;line-height:1.1">43% less LLM spend <span class="lbl" style="font-size:18px">in this example</span></div><div class="mono" style="font-size:26px;letter-spacing:.06em;color:var(--slate);margin-top:8px"><span style="color:var(--neon)">4</span> vs 7 LLM calls</div></div></div>`);
      s.ben = [['ticket', 'One booking only'], ['retry', 'Automatic retries'], ['user', 'Waits for humans'], ['eye', 'Full visibility']].map(([i, l]) => iconTile(root, i, l, 330, 230, i === 'ticket' ? C.neon : C.ink));
    },
    update(t, c, s) {
      // first run: each row is worked on, then saved, and only then the agent moves on
      const write = [0, 1, 2, 3, 4, 5].map(i => c[1] + 0.3 + i * 1.05).concat([c[3] + 2.9, c[3] + 3.95]);
      const saved = write.map(w => w + 0.85);
      const crashAt = c[2] + 0.8, bOn = crashAt + 1.8, reset = bOn + 0.3, rerun = bOn + 1.3;
      // replay: saved rows 1-6 are handed back one by one, then their tags explain why it matters
      const replay = [0, 1, 2, 3, 4, 5].map(i => c[3] + 0.2 + i * 0.4);
      const reused = replay.map(q => q + 0.05), told = replay.map((_, i) => c[3] + 2.6 + i * 0.1);
      const replayEnd = c[3] + 2.6;
      const out = P(t, c[4], 0.5);
      const [sx, sy] = shakeAt(t, crashAt);
      const dead = t >= crashAt;

      // Temporal logo: big intro, then it flies into the header of the Temporal panel.
      // Once landed, the native-size header logo takes over (hard swap, never both): Chromium rasterizes a
      // scaled-down image differently depending on the frames rendered before, which breaks parallel rendering.
      const lp = P(t, c[0] + 0.1, 0.7, backOut), fl = P(t, c[0] + FLIGHT.at, FLIGHT.d);
      const landed = fl >= 1;
      const logoOpacity = landed ? 0 : clamp(lp * 2) * (1 - out);
      place(s.logo, lerp(960, 1005, fl), lerp(540, 325, fl), lp * lerp(1 + 0.06 * P(t, c[0] + 1.2, 0.6), 34 / 150, fl), logoOpacity);
      s.headerLogo.style.opacity = landed ? 1 - out : 0;
      place(s.temporal, 1380, 555, 1, P(t, c[0] + 2.4, 0.5) * (1 - out));
      place(s.jr, HIST.x, HIST.y, 1, P(t, c[0] + 2.6, 0.5) * (1 - out));

      // steps
      const states = [0, 1, 2, 3].map(i => {
        if (t < reset) {
          if (i === 3) return dead ? 3 : t >= c[2] + 0.2 ? 1 : 0;
          return t >= saved[2 * i + 1] + 0.1 ? 2 : t >= write[2 * i] ? 1 : 0;
        }
        if (i === 3) return t >= saved[7] + 0.1 ? 2 : t >= c[3] + 2.8 ? 1 : 0;
        const start = i === 0 ? rerun : replay[2 * i];
        return t >= replay[2 * i + 1] + 0.35 ? 2 : t >= start ? 1 : 0;
      });
      placeStepRow(s.steps, t, c[0] + 2.5, states, sx, sy, 1 - out);
      draw(s.restart, P(t, bOn + 0.5, 0.8), 1 - P(t, c[3] + 0.3, 0.4));
      place(s.restartL, 960, 115, 1, P(t, bOn + 0.9, 0.35) * (1 - P(t, c[3] + 0.3, 0.4)));

      // app instances: A runs then crashes, B takes over in the same place
      const aIn = P(t, c[0] + 2.3, 0.5, backOut);
      place(s.A, APP.x + sx, APP.y + sy, aIn, clamp(aIn * 2) * (1 - P(t, bOn, 0.3)) * (1 - out));
      if (dead) setAppStatus(s.A, 'CRASHED', 'crashed');
      else setAppStatus(s.A, 'RUNNING THE AGENT', t >= write[0] ? 'running' : 'idle');
      place(s.B, APP.x, APP.y, 1, P(t, bOn + 0.3, 0.35) * (1 - out));
      if (t < replay[0]) setAppStatus(s.B, 'TAKING OVER', t >= rerun ? 'running' : 'idle');
      else if (t < replayEnd) setAppStatus(s.B, 'REPLAYING…', 'running');
      else setAppStatus(s.B, 'RUNNING THE AGENT', 'running');

      // app memory: filled as results are saved, emptied by the crash, refilled from the history
      place(s.mem, MEM.x + sx, MEM.y + sy, 1, P(t, c[0] + 2.5, 0.45) * (1 - out));
      s.mem.style.borderColor = t > crashAt && t < bOn ? C.red : '#3A4150';
      s.mem.vide.style.opacity = P(t, crashAt + 1.1, 0.4) * (1 - P(t, bOn, 0.3));
      s.mblocks.forEach((b, i) => {
        if (t < bOn) {
          const grow = i < 6 ? P(t, saved[i], 0.35, backOut) : 0;
          placeMemBlock(b, memSlot(i), MEM.slotY, grow, P(t, crashAt + 0.3 + i * 0.08, 0.8, easeIn), sx, sy, 1 - out);
        } else {
          const back = i < 6 ? replay[i] + 0.33 : saved[i];
          placeMemBlock(b, memSlot(i), MEM.slotY, P(t, back, 0.35, backOut), 0, 0, 0, 1 - out);
        }
      });

      // LLM call counter: only the 4 real calls are billed; the replay costs nothing
      const calls = [0, 2, 4, 6].filter(i => t >= write[i]).length;
      setBill(s.bill, calls, 0);
      const notBilled = win(t, replay[0], c[3] + 2.8, 0.3);
      s.bill.w.textContent = 'NOT RE-BILLED'; s.bill.w.style.opacity = notBilled;
      s.bill.style.borderColor = notBilled > 0.5 ? C.neon : '#3A4150';
      place(s.bill, 270 + sx, 720 + sy, P(t, c[0] + 2.7, 0.45, backOut), P(t, c[0] + 2.7, 0.4) * (1 - out));
      // the booking is made once and never repeated
      const tp = P(t, saved[5], 0.45, backOut);
      place(s.ticket, 660, 720, tp * (1 + 0.15 * win(t, reused[5], reused[5] + 0.5, 0.2)), clamp(tp * 2) * (1 - out));

      // result cards: app -> Temporal when saving, Temporal -> app when replaying
      s.saveCards.forEach((e, i) => {
        const w = write[i];
        fly(e, t, w + 0.35, memSlot(i), MEM.slotY, w + 0.4, 0.4, HIST.cardX, rowY(i), w + 0.8, HIST.cardX, rowY(i));
      });
      s.reuseCards.forEach((e, i) => {
        const q = replay[i];
        fly(e, t, q, HIST.cardX, rowY(i), q + 0.05, 0.28, memSlot(i), MEM.slotY, q + 0.33, memSlot(i), MEM.slotY);
      });

      // Event History rows and their status tags
      s.kept.style.opacity = P(t, crashAt + 0.7, 0.4);
      s.cut.style.opacity = P(t, crashAt + 0.3, 0.3);
      s.rows.forEach((r, i) => { const p = P(t, saved[i] - 0.1, 0.3); r.style.opacity = p; r.style.transform = `translateX(${(1 - p) * 26}px)`; });
      s.tags.forEach((e, i) => {
        const isReused = i < 6 && t >= reused[i], isTold = i < 6 && t >= told[i];
        let label = 'SAVED';
        if (isTold) label = isLLM(i) ? 'REUSED, NOT RE-BILLED' : 'REUSED, NOT RE-RUN';
        else if (isReused) label = 'REUSED';
        if (e._l !== label) {
          e._l = label;
          e.innerHTML = isReused ? label : ICON('check', 16, C.neon, 2.6) + label;
          e.style.background = isReused ? C.uv : '#141414'; e.style.color = isReused ? '#FFFFFF' : C.neon;
        }
        const switchedAt = isTold ? told[i] : isReused ? reused[i] : saved[i];
        e.style.opacity = P(t, saved[i], 0.25);
        e.style.transform = `scale(${1 + 0.14 * Math.max(0, 1 - Math.abs(t - switchedAt - 0.1) / 0.25)})`;
      });
      const scanning = replay.findIndex(q => t >= q && t < q + 0.4);
      s.scan.style.opacity = scanning >= 0 ? 1 : 0;
      s.scan.style.top = (68 + Math.max(0, scanning) * 44) + 'px';
      place(s.done, 1380, 872, P(t, saved[7] + 0.5, 0.45, backOut), P(t, saved[7] + 0.5, 0.35) * (1 - out));
      place(s.flash, 960, 540, 1, flashAt(t, crashAt) * 0.4);

      // payoff
      const bp = P(t, c[4] + 0.5, 0.6);
      place(s.budget, 960, 360, 1, bp);
      s.budget.style.transform += ` translateY(${(1 - bp) * 20}px)`;
      const at = [c[4] + 2.2, c[4] + 3.4, c[4] + 4.3, c[4] + 5.2];
      s.ben.forEach((e, i) => { const p = P(t, at[i], 0.45, backOut); place(e, 435 + i * 350, 630, p, clamp(p * 2)); e.style.borderColor = i === 0 ? C.neon : '#3A4150'; });
    }
  });
}
