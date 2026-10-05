// ===================== shared helpers (brand style)
const C = { uv: '#444CE7', violet: '#B664FF', neon: '#DBFF4B', red: '#FF5A5F', ink: '#F8FAFC', slate: '#94A3B8', line: '#3A4150' };
const tag = (p, html, cls = '') => E(p, html, 'pill ' + cls);
// icon + label centred in the tile; padding-left offsets the trailing letter-spacing
function iconTile(p, icon, label, w = 200, h = 150, col = C.ink) {
  const big = h > 130;
  return E(p, `${ICON(icon, big ? 52 : 42, col)}${label ? `<div class="mono" style="font-size:${big ? 20 : 18}px;letter-spacing:.1em;padding-left:.1em;text-transform:uppercase;margin-top:12px">${label}</div>` : ''}`, 'tile', { width: w + 'px', height: h + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' });
}
function makeStep(p, icon, label, w = 280, h = 140) {
  const e = iconTile(p, icon, label, w, h);
  e.insertAdjacentHTML('beforeend', `<div class="spin" style="position:absolute;right:12px;top:12px;width:26px;height:26px;border:3px solid rgba(182,100,255,.25);border-top-color:${C.violet};border-radius:50%;opacity:0"></div><div class="ok" style="position:absolute;right:8px;top:8px;opacity:0">${ICON('check', 32, C.neon, 2.6)}</div><div class="ko" style="position:absolute;right:8px;top:8px;opacity:0">${ICON('x', 32, C.red, 2.6)}</div>`);
  e.spin = e.querySelector('.spin'); e.ok = e.querySelector('.ok'); e.ko = e.querySelector('.ko');
  return e;
}
// 0 pending, 1 running, 2 done, 3 failed
function stepState(e, st) {
  e.style.borderColor = ['#3A4150', C.violet, C.neon, C.red][st];
  e.spin.style.opacity = st === 1 ? 1 : 0; e.spin.style.transform = `rotate(${G * 400}deg)`;
  e.ok.style.opacity = st === 2 ? 1 : 0; e.ko.style.opacity = st === 3 ? 1 : 0;
}
function slideIn(e, t, a, x0, x1, y, out = 0) { const p = P(t, a, 0.8); place(e, lerp(x0, x1, p), y, 1, P(t, a, 0.3) * (1 - out)); }
// fly: appear at (x0,y0) at a, travel to (x1,y1) during [b, b+d], absorbed (shrink+fade) at k if given
function fly(e, t, a, x0, y0, b, d, x1, y1, k = null, kx = 0, ky = 0) {
  const ap = P(t, a, 0.45, backOut), f = P(t, b, d), ab = k === null ? 0 : P(t, k, 0.4, easeIn);
  place(e, lerp(lerp(x0, x1, f), kx, ab), lerp(lerp(y0, y1, f), ky, ab), ap * (1 - 0.65 * ab), clamp(ap * 2) * (1 - ab));
}
const STEPS = [['cal', 'Calendar'], ['search', 'Restaurant'], ['food', 'Booking'], ['mail', 'Invite']];

// ===================== INTRO
scene({
  pre: 1.0,
  subs: [{ text: "AI agents search, book and send emails for us. But how do they actually work?", after: 0.3 }],
  build(root, s) {
    s.t = E(root, `<img src="assets/temporal-logo-horizontal-light-cropped.svg" style="height:58px;display:block;margin-bottom:46px"><div class="mono" style="font-size:22px;letter-spacing:.14em;color:var(--slate)">AN EXPLAINER FOR EVERYONE</div>
      <div style="font-size:116px;line-height:1.02;letter-spacing:-3px;margin-top:22px">How does an<br>AI agent work?</div>
      <div class="t2 mono" style="font-size:24px;letter-spacing:.12em;color:var(--violet);margin-top:34px">AND WHY IT NEEDS DURABLE EXECUTION</div>`, 'big-t');
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
      place(e, 1460 + Math.cos(a) * 260, 460 + Math.sin(a) * 175, pp, clamp(pp * 2) * (0.45 + 0.55 * (Math.sin(a) + 1) / 2));
    });
  }
});

// ===================== 1. LLM CALL
scene({
  chapter: 1,
  subs: [
    { text: "At the heart of every AI agent is an LLM: a large language model, like those from OpenAI, Anthropic or Google." },
    { text: "An app sends it some text. The model reads it, then writes a reply, word by word.", after: 0.8 },
    { text: "That's an LLM call: text in, text out. Nothing more.", after: 0.4 },
  ],
  build(root, s) {
    s.svg = svgLayer(root);
    s.llm = makeLLM(root, 240);
    s.chips = ['OpenAI', 'Anthropic', 'Google'].map(n => tag(root, n));
    s.app = makeApp(root);
    s.arrow = path(s.svg, 'M 600 430 L 1310 430', C.slate, 2.5);
    s.arrowL = E(root, 'LLM call', 'lbl', { color: 'var(--ink)' });
    s.q = makeCard(root, "Write one line about the sea.", 'user');
    s.a = makeCard(root, "The sea whispers its secrets to the pebbles.", 'llm', null, 560);
    s.inP = tag(root, 'Text in', 'violet big'); s.outP = tag(root, 'Text out', 'uv big');
    s.ar1 = path(s.svg, 'M 610 430 L 815 430', C.violet, 3); s.ar2 = path(s.svg, 'M 1105 430 L 1300 430', C.uv, 3);
  },
  update(t, c, s) {
    const mv1 = P(t, c[1], 0.9), mv2 = P(t, c[2], 0.9);
    const pop = P(t, c[0], 0.8, backOut);
    place(s.llm.root, 960 + 490 * mv1 - 490 * mv2, 430, pop, clamp(pop * 2));
    llmState(s.llm, { think: win(t, c[1] + 2.3, c[1] + 3.0, 0.2), look: -mv1 * (1 - mv2) });
    s.chips.forEach((ch, i) => { const p = P(t, c[0] + 2.4 + i * 0.25, 0.45, backOut); place(ch, 960 + (i - 1) * 230, 650, p, clamp(p * 2) * (1 - P(t, c[1], 0.4))); });
    const out = P(t, c[2], 0.5);
    const ap = P(t, c[1] + 0.2, 0.6, backOut);
    place(s.app, 420, 430, ap, clamp(ap * 2) * (1 - out)); gearSpin(s.app, 0);
    draw(s.arrow, P(t, c[1] + 0.5, 0.6), 1 - out);
    place(s.arrowL, 955, 398, 1, P(t, c[1] + 0.8, 0.4) * (1 - out));
    fly(s.q, t, c[1] + 0.6, 420, 260, c[1] + 1.0, 1.0, 1180, 260, c[1] + 2.0, 1450, 430);
    const aa = P(t, c[1] + 3.0, 0.4, backOut), af = P(t, c[1] + 5.2, 0.9);
    place(s.a, lerp(1250, 560, af), lerp(690, 720, af), aa, clamp(aa * 2) * (1 - out));
    typeWords(s.a, clamp((t - (c[1] + 3.1)) / 2.0));
    place(s.inP, 480, 430, P(t, c[2] + 0.5, 0.5, backOut), P(t, c[2] + 0.5, 0.4));
    place(s.outP, 1440, 430, P(t, c[2] + 1.3, 0.5, backOut), P(t, c[2] + 1.3, 0.4));
    draw(s.ar1, P(t, c[2] + 0.8, 0.4)); draw(s.ar2, P(t, c[2] + 1.1, 0.4));
  }
});

// ===================== 2. STATELESS
scene({
  chapter: 2,
  subs: [
    { text: "Surprise: the model has no memory. Tell it your name…", after: 1.4 },
    { text: "…then ask again in the next call. It has already forgotten.", after: 0.8 },
    { text: "That's by design: LLMs are <b>stateless</b>. So the app resends the whole conversation with every call.", after: 1.8 },
  ],
  build(root, s) {
    s.app = makeApp(root); s.llm = makeLLM(root, 220);
    s.u1 = makeCard(root, "Hi, I'm Alex.", 'user'); s.r1 = makeCard(root, "Nice to meet you, Alex!", 'llm');
    s.u2 = makeCard(root, "What's my name?", 'user'); s.r2 = makeCard(root, "I don't know. You haven't told me.", 'bad');
    s.tag1 = tag(root, 'Call 1'); s.tag2 = tag(root, 'Call 2');
    s.bub = E(root, '<span class="mono" style="font-size:26px;color:#141414">Alex</span><div class="wipe"></div>', '', { background: '#F8FAFC', padding: '10px 24px', overflow: 'hidden', borderRadius: 'var(--rs)' });
    s.wipe = s.bub.querySelector('.wipe'); Object.assign(s.wipe.style, { position: 'absolute', left: 0, top: 0, bottom: 0, width: '0%', background: C.uv });
    s.bubT = E(root, 'memory wiped', 'lbl', { color: C.red });
    s.sl = tag(root, 'Stateless', 'violet big');
    s.hist = makeCard(root, "<span style='color:#5B6475'>YOU</span>&nbsp;&nbsp;&nbsp;Hi, I'm Alex.<br><span style='color:#5B6475'>MODEL</span> Nice to meet you, Alex!<br><span style='color:#5B6475'>YOU</span>&nbsp;&nbsp;&nbsp;What's my name?", 'user', 'FULL HISTORY', 560);
    s.hist.querySelector('.txt').style.fontSize = '23px';
    s.r3 = makeCard(root, "You're Alex!", 'ok');
  },
  update(t, c, s) {
    const ap = P(t, c[0] + 0.1, 0.6, backOut);
    place(s.app, 250, 430, ap, clamp(ap * 2)); gearSpin(s.app, 0);
    place(s.llm.root, 1650, 430, P(t, c[0] + 0.3, 0.6, backOut), P(t, c[0] + 0.3, 0.4));
    llmState(s.llm, { think: win(t, c[0] + 1.8, c[0] + 2.5, 0.2) + win(t, c[1] + 1.6, c[1] + 2.4, 0.2) + win(t, c[2] + 3.6, c[2] + 4.8, 0.2), q: win(t, c[1] + 2.6, c[2], 0.3), look: -1 });
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
    fly(s.hist, t, c[2] + 1.6, 600, 450, c[2] + 2.4, 1.0, 1180, 450, c[2] + 3.4, 1650, 430);
    const rp = P(t, c[2] + 5.0, 0.5, backOut), rf = P(t, c[2] + 5.3, 0.9);
    place(s.r3, lerp(1420, 900, rf), 620, rp, clamp(rp * 2));
  }
});

// ===================== 3. CONTEXT WINDOW
scene({
  chapter: 3,
  subs: [
    { text: "Everything sent to the model fits on one page: the <b>context window</b>. Instructions, history, documents, the new question.", after: 0.4 },
    { text: "It's the only thing the model sees. It has a size limit, and every word on it is billed, at every call.", after: 1.2 },
  ],
  build(root, s) {
    s.svg = svgLayer(root);
    s.cone = document.createElementNS(SVGNS, 'polygon');
    s.cone.setAttribute('points', '1480,445 1085,185 1085,775'); s.cone.setAttribute('fill', 'rgba(182,100,255,0.13)');
    s.svg.appendChild(s.cone);
    s.sheet = E(root, '', '', { width: '640px', height: '600px', background: '#F8FAFC', overflow: 'hidden', borderRadius: 'var(--r)' });
    s.sheetT = E(root, 'Context window', 'lbl', { color: 'var(--ink)', fontSize: '22px' });
    const mk = (who, html, col, bar) => {
      const b = document.createElement('div');
      Object.assign(b.style, { position: 'absolute', left: '20px', width: '600px', background: col, borderLeft: `6px solid ${bar}`, padding: '8px 16px', overflow: 'hidden', color: '#141414', borderRadius: 'var(--rs)' });
      b.innerHTML = `<div class="mono" style="font-size:14px;letter-spacing:.12em;color:#5B6475">${who}</div><div class="mono" style="font-size:21px;line-height:1.45">${html}</div>`;
      s.sheet.appendChild(b); return b;
    };
    s.blocks = [
      mk('INSTRUCTIONS', "You are the shop's helpful assistant.", '#E6E7FC', C.uv),
      mk('HISTORY', "You: Hi!<br>Model: Hello, how can I help?<br>You: I need a phone plan.<br>Model: Mostly for calls?<br>You: Yes, and some travel.<br>Model: The Pro plan fits.<br>You: What about roaming?", '#EDEFF3', C.slate),
      mk('DOCUMENT', 'price-list.pdf', '#F3FBD2', '#9DB82A'),
      mk('NEW QUESTION', 'How much is the Pro plan?', '#F2E6FF', C.violet),
    ];
    s.gauge = E(root, '<div class="f" style="position:absolute;left:0;right:0;bottom:0"></div>', '', { width: '22px', height: '600px', background: 'rgba(248,250,252,.08)', border: '1.5px solid #3A4150', overflow: 'hidden', borderRadius: 'var(--rs)' });
    s.gf = s.gauge.querySelector('.f');
    s.gaugeL = E(root, 'Size', 'lbl');
    s.full = tag(root, 'Full', 'red');
    s.llm = makeLLM(root, 200);
    s.g1 = E(root, `<div class="mono" style="font-size:22px">Yesterday's email</div><div class="lbl" style="font-size:15px;margin-top:4px">not in context</div>`, '', { border: '1.5px dashed #4B5363', padding: '10px 18px', color: 'var(--slate)', borderRadius: 'var(--r)' });
    s.bill = E(root, `<div style="display:flex;align-items:center;gap:16px">${ICON('coin', 46, C.neon, 1.6)}<div><div class="tok" style="font-size:44px;line-height:1">0 tokens</div><div class="lbl" style="font-size:16px;margin-top:6px;color:var(--neon)">billed at every call</div></div></div>`, '', { padding: '16px 22px', border: '1.5px solid ' + C.neon, background: 'rgba(219,255,75,.06)', borderRadius: 'var(--r)' });
    s.tok = s.bill.querySelector('.tok');
  },
  update(t, c, s) {
    const sp = P(t, c[0] + 0.1, 0.7, backOut);
    place(s.sheet, 760, 480, sp, clamp(sp * 2));
    place(s.sheetT, 760, 150, 1, P(t, c[0] + 0.6, 0.4));
    place(s.llm.root, 1560, 445, P(t, c[0] + 0.4, 0.6, backOut), P(t, c[0] + 0.4, 0.4));
    llmState(s.llm, { look: -1 });
    const app = [0, 1, 2, 3].map(i => P(t, c[0] + 2.2 + i * 1.2, 0.5));
    const grow = P(t, c[1] + 2.4, 1.8);
    const hs = [74, lerp(122, 330, grow), 74, 74];
    let y = 20, used = 0;
    s.blocks.forEach((b, i) => {
      b.style.top = y + 'px'; b.style.height = hs[i] + 'px';
      b.style.opacity = app[i]; b.style.transform = `translateX(${(1 - app[i]) * 80}px)`;
      y += hs[i] + 10; used += (hs[i] + (i ? 10 : 0)) * app[i];
    });
    const fill = used / 560;
    s.gf.style.height = (clamp(fill) * 100) + '%';
    s.gf.style.background = fill > 0.98 ? C.red : `linear-gradient(0deg, ${C.uv}, ${C.violet})`;
    place(s.gauge, 1130, 480, 1, P(t, c[0] + 1.6, 0.5));
    place(s.gaugeL, 1130, 810, 1, P(t, c[0] + 1.6, 0.5));
    place(s.full, 1130, 150, P(t, c[1] + 4.0, 0.4, backOut), P(t, c[1] + 4.0, 0.3));
    s.cone.style.opacity = win(t, c[1] + 0.2, c[1] + 2.6, 0.4);
    place(s.g1, 1560, 205, 1, win(t, c[1] + 0.8, c[1] + 2.8, 0.4));
    const bp = P(t, c[1] + 3.0, 0.5, backOut);
    place(s.bill, 1560, 740, bp, clamp(bp * 2));
    s.tok.textContent = Math.round(lerp(4200, 12400, P(t, c[1] + 3.0, 2.0))).toLocaleString('en-US') + ' tokens';
  }
});

// ===================== 4. TOOLS
scene({
  chapter: 4,
  subs: [
    { text: "The model can't check the weather or send an email. So we give it <b>tools</b>.", after: 0.6 },
    { text: "When it needs one, the model writes a request: “use the Weather tool, for Paris”. The app runs it…", after: 1.2 },
    { text: "…adds the result to the context, and calls the model again.", after: 2.2 },
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

// ===================== 5. AGENTIC LOOP
const LOOP = { cx: 560, cy: 500, r: 220 };
function loopPos(deg) { const a = deg * Math.PI / 180; return [LOOP.cx + Math.cos(a) * LOOP.r, LOOP.cy + Math.sin(a) * LOOP.r]; }
function arcD(d0, d1) { const [x0, y0] = loopPos(d0), [x1, y1] = loopPos(d1); return `M ${x0} ${y0} A ${LOOP.r} ${LOOP.r} 0 0 1 ${x1} ${y1}`; }
scene({
  chapter: 5,
  subs: [
    { text: "Repeat until the goal is reached: think, act, observe. That's the <b>agentic loop</b>.", after: 0.6 },
    { text: "“Book lunch with Marie on Thursday”: check the calendar, find a restaurant, book a table, send the invite.", after: 1.0 },
    { text: "An AI agent is a model, plus tools, plus a loop, working toward a goal.", after: 1.0 },
  ],
  build(root, s) {
    s.svg = svgLayer(root);
    s.arcs = [arcD(-90 + 27, 30 - 27), arcD(30 + 27, 150 - 27), arcD(150 + 27, 270 - 27)].map(d => path(s.svg, d, C.slate, 2.5));
    s.nThink = makeLLM(root, 130, '');
    s.nAct = iconTile(root, 'play', '', 130, 130, C.neon); s.nAct.style.borderColor = C.neon;
    s.nObs = iconTile(root, 'eye', '', 130, 130, C.ink); s.nObs.style.borderColor = C.uv;
    s.lThink = E(root, 'Think', 'lbl', { color: 'var(--ink)' }); s.lAct = E(root, 'Act', 'lbl', { color: 'var(--ink)' }); s.lObs = E(root, 'Observe', 'lbl', { color: 'var(--ink)' });
    s.center = E(root, 'Agentic<br>loop', 'lbl', { textAlign: 'center', color: 'var(--ink)', fontSize: '24px', lineHeight: 1.4 });
    s.token = E(root, '', '', { width: '22px', height: '22px', background: C.neon, boxShadow: '0 0 22px 6px rgba(219,255,75,.45)', borderRadius: '5px' });
    s.goal = makeCard(root, "Book lunch with Marie on Thursday.", 'user', null, 640);
    const steps = [['cal', 'Check the calendar', 'Thu 12:30 is free'], ['search', 'Find a restaurant', 'Chez Paulette'], ['food', 'Book a table', 'table for 2, confirmed'], ['mail', 'Invite Marie', 'invite sent']];
    s.rows = steps.map(([i, a, r]) => {
      const row = E(root, `${ICON(i, 36, C.ink, 1.6)}<div style="flex:1;margin-left:18px"><div style="font-size:27px">${a}</div><div class="res mono" style="font-size:18px;color:var(--neon);opacity:0">${r}</div></div><div class="ck" style="opacity:0">${ICON('check', 32, C.neon, 2.6)}</div>`, 'tile', { width: '640px', height: '88px', display: 'flex', alignItems: 'center', padding: '0 22px', textAlign: 'left' });
      row.res = row.querySelector('.res'); row.ck = row.querySelector('.ck'); return row;
    });
    s.exit = tag(root, 'Goal reached', 'neon');
    s.formula = E(root, `<div style="display:flex;align-items:center;gap:22px;font-size:40px">
      <span class="pill violet big" style="position:static">Model</span><span>+</span><span class="pill big" style="position:static">Tools</span><span>+</span>
      <span class="pill big" style="position:static">Loop</span><span>=</span><span class="pill uv big" style="position:static">AI agent</span></div>`);
    s.goalF = E(root, 'working toward a goal', 'lbl', { fontSize: '24px' });
  },
  update(t, c, s) {
    const out = P(t, c[2], 0.6);
    const pT = P(t, c[0] + 0.1, 0.5, backOut), pA = P(t, c[0] + 0.3, 0.5, backOut), pO = P(t, c[0] + 0.5, 0.5, backOut);
    const turns = [[c[0] + 2.0, 2.6]].concat([0, 1, 2, 3].map(i => [c[1] + 0.8 + i * 1.5, 1.5]));
    let deg = null;
    turns.forEach(([a, d]) => { if (t >= a && t < a + d) deg = -90 + 360 * ease((t - a) / d); });
    const near = d => deg === null ? 0 : Math.max(0, 1 - Math.abs((((deg - d) % 360) + 540) % 360 - 180) / 30);
    const [tx, ty] = loopPos(-90), [ax, ay] = loopPos(30), [ox, oy] = loopPos(150);
    place(s.nThink.root, tx, ty, pT * (1 + 0.12 * near(-90)), clamp(pT * 2) * (1 - out));
    llmState(s.nThink, { think: near(-90) > 0.2 ? 1 : 0, look: 0.5 });
    place(s.nAct, ax, ay, pA * (1 + 0.12 * near(30)), clamp(pA * 2) * (1 - out));
    place(s.nObs, ox, oy, pO * (1 + 0.12 * near(150)), clamp(pO * 2) * (1 - out));
    place(s.lThink, tx - 130, ty, 1, P(t, c[0] + 0.4, 0.4) * (1 - out));
    place(s.lAct, ax, ay + 98, 1, P(t, c[0] + 0.6, 0.4) * (1 - out));
    place(s.lObs, ox, oy + 98, 1, P(t, c[0] + 0.8, 0.4) * (1 - out));
    s.arcs.forEach((a, i) => draw(a, P(t, c[0] + 0.8 + i * 0.3, 0.45), 1 - out));
    place(s.center, LOOP.cx, LOOP.cy, 1, P(t, c[0] + 3.0, 0.5) * (1 - out));
    if (deg !== null) { const [x, y] = loopPos(deg); place(s.token, x, y, 1, 1 - out); } else place(s.token, 0, 0, 1, 0);
    place(s.goal, 1440, 210, P(t, c[1] + 0.1, 0.45, backOut), P(t, c[1] + 0.1, 0.4) * (1 - out));
    s.rows.forEach((r, i) => {
      const a = c[1] + 0.8 + i * 1.5, pr = P(t, a + 0.5, 0.35);
      place(r, 1440, 335 + i * 104, 1, pr * (1 - out));
      r.style.transform += ` translateX(${(1 - pr) * 40}px)`;
      r.res.style.opacity = P(t, a + 1.05, 0.3); r.ck.style.opacity = P(t, a + 1.15, 0.25);
      r.style.borderColor = (t > a && t < a + 1.5) ? C.violet : '#3A4150';
    });
    const ep = P(t, c[1] + 7.0, 0.45, backOut);
    place(s.exit, 1440, 790, ep, clamp(ep * 2) * (1 - out));
    place(s.formula, 960, 410, 1.15 * P(t, c[2] + 0.4, 0.6, backOut), P(t, c[2] + 0.4, 0.5));
    place(s.goalF, 960, 530, 1, P(t, c[2] + 2.6, 0.5));
  }
});

// ===================== 6. CRASH
function makeBill(p) {
  const e = E(p, `<div class="lbl" style="font-size:16px">LLM calls billed</div><div style="display:flex;align-items:baseline;gap:14px;margin-top:6px"><div class="n" style="font-size:84px;line-height:1">0</div><div class="w mono" style="font-size:20px;color:var(--red);letter-spacing:.08em"></div></div><div class="sq" style="display:flex;gap:6px;margin-top:10px"></div>`, 'tile', { width: '380px', height: '200px', textAlign: 'left', padding: '18px 24px' });
  e.n = e.querySelector('.n'); e.w = e.querySelector('.w'); e.sq = e.querySelector('.sq');
  e.sq.innerHTML = Array.from({ length: 8 }, () => `<i style="display:block;width:30px;height:16px;background:rgba(248,250,252,.08);border-radius:3px"></i>`).join('');
  e.cells = e.sq.querySelectorAll('i');
  return e;
}
function setBill(b, n, wasted) {
  b.n.textContent = n; b.n.style.color = wasted ? C.red : C.ink;
  b.w.textContent = wasted ? `+${wasted} wasted` : '';
  b.cells.forEach((q, i) => q.style.background = i < n ? (i >= n - wasted ? C.red : C.uv) : 'rgba(248,250,252,.08)');
}
scene({
  chapter: 6,
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

// ===================== 7. TEMPORAL
const JR = ['LLM call: check the calendar', 'Calendar: Thu 12:30 is free', 'LLM call: find a restaurant', 'Search: Chez Paulette', 'LLM call: book a table', 'Booking: table for 2, confirmed', 'LLM call: invite Marie', 'Email: invite sent'];
function makeWorker(p, name) {
  const e = E(p, `${ICON('server', 48, C.ink, 1.6)}<div class="mono" style="font-size:20px;letter-spacing:.1em;padding-left:.1em;margin-top:12px">${name}</div><div class="st mono" style="font-size:16px;letter-spacing:.08em;padding-left:.08em;color:var(--slate);margin-top:6px"></div>`, 'tile', { width: '270px', height: '170px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' });
  e.st = e.querySelector('.st'); return e;
}
scene({
  chapter: 7,
  subs: [
    { text: "<b>Durable Execution</b> with Temporal fixes this. Every completed step is recorded in an Event History.", after: 1.6 },
    { text: "If the app crashes, another copy of it takes over, replays the history, and resumes exactly where it stopped.", after: 1.2 },
    { text: "Previous LLM calls aren't lost: their results come straight from the history. Nothing is re-run, no token is paid twice.", after: 0.8 },
    { text: "No duplicate booking either. Plus automatic retries, waiting days for a human, and full visibility.", after: 1.2 },
  ],
  build(root, s) {
    s.svg = svgLayer(root);
    s.title = E(root, `<img src="assets/temporal-logo-horizontal-light-cropped.svg" style="height:150px;display:block;margin:0 auto"><div class="mono" style="font-size:26px;letter-spacing:.16em;color:var(--violet);margin-top:40px">DURABLE EXECUTION</div>`, '', { textAlign: 'center' });
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
    place(s.title, 960, 420, tp * (1 + 0.06 * P(t, c[0] + 1.6, 0.6)), clamp(tp * 2) * (1 - P(t, c[0] + 1.8, 0.5)));
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

// ===================== OUTRO
scene({
  pre: 0.4, post: 2.6,
  subs: [{ text: "Durable AI agents never lose their progress, or your budget." }],
  build(root, s) {
    s.t = E(root, `<div style="font-size:104px;letter-spacing:-3px;line-height:1.04">Durable AI agents</div><div class="mono" style="font-size:24px;letter-spacing:.14em;color:var(--violet);margin-top:30px">NEVER LOSE THEIR PROGRESS, OR YOUR BUDGET</div><img src="assets/temporal-logo-horizontal-light-cropped.svg" style="height:70px;display:block;margin:76px auto 0">`, '', { textAlign: 'center' });
    s.llm = makeLLM(root, 120, '');
  },
  update(t, c, s) {
    place(s.t, 960, 560, 1, P(t, 0.3, 0.8));
    const p = P(t, 0.1, 0.7, backOut); place(s.llm.root, 960, 190, p, clamp(p * 2)); llmState(s.llm, { lookY: 0.4 });
  }
});
