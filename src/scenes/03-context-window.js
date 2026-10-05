// ===================== 3. CONTEXT WINDOW
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 3, title: 'The context window',
    // pans left as the cone fades, to make room for the bill
    shift: (t, c) => pan(t, [-90, 42], [[c[1] + 2.6, -136, 42]]),
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
}
