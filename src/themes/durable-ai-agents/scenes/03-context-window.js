// ===================== 3. THE CONTEXT WINDOW
// The block keeps every name declared in this file local to this scene.
{
  // the conversation in the HISTORY block: chat lines, then the question; APPENDED arrives during c[1]
  const CHAT = [
    'Model: Hello, how can I help?', 'You: I need a phone plan.', 'Model: Mostly for calls?',
    'You: Yes, and some travel.', 'Model: The Pro plan fits.',
  ];
  const QUESTION = 'You: How much is the Pro plan?';
  const APPENDED = [
    "Model: It's $25 a month.", 'You: What about roaming?', 'Model: Included in Europe.', "You: Great, I'll take it.",
  ];
  const ROW = 40;
  scene({
    chapter: 3, title: 'The context window',
    // one fixed offset fits both the cone phase and the bill phase
    shift: [-113, 42],
    subs: [
      {
        text: "Everything sent to the model fits on one page: the <b>context window</b>. "
          + "Instructions, history, documents, the new question.",
        after: 0.4,
      },
      {
        text: "It's the only thing the model sees. It has a size limit, and every word on it is billed, at every call.",
        after: 0.6,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.cone = document.createElementNS(SVGNS, 'polygon');
      s.cone.setAttribute('points', '1480,445 1085,185 1085,775');
      s.cone.setAttribute('fill', 'rgba(182,100,255,0.13)');
      s.svg.appendChild(s.cone);
      s.sheet = E(root, '', 'paper', { width: '640px', height: '600px', overflow: 'hidden' });
      s.sheetT = E(root, 'Context window', 'lbl', { color: 'var(--ink)', fontSize: '22px' });
      const mk = (who, html, col, bar) => {
        const b = document.createElement('div');
        Object.assign(b.style, {
          position: 'absolute', left: '20px', width: '600px', background: col, borderLeft: `6px solid ${bar}`,
          padding: '8px 16px', overflow: 'hidden', color: '#141414', borderRadius: 'var(--rs)',
        });
        b.innerHTML = `<div class="mono" style="font-size:14px;letter-spacing:.12em;color:#5B6475">${who}</div>`
          + `<div class="mono" style="font-size:21px;line-height:1.45">${html}</div>`;
        s.sheet.appendChild(b); return b;
      };
      s.instr = mk('INSTRUCTIONS', "You are the shop's helpful assistant.", C.uvTint, C.uv);
      s.hist = mk('HISTORY', '', '#EDEFF3', C.slate);
      // one 40 px row per message; the chat lines show in c[0] as one part, the rest one by one after them
      const docChip = '<span style="display:inline-block;line-height:30px;padding:0 10px;margin-left:12px;'
        + `background:${C.neonTint};border:1px solid ${C.neonDark};border-radius:var(--rs)">price-list.pdf</span>`;
      const messages = [
        ...CHAT.map(text => ({ text })),
        { text: 'You:' + docChip },
        { text: QUESTION, question: true },
        ...APPENDED.map(text => ({ text, question: text.startsWith('You:') })),
      ];
      s.rows = messages.map(m => {
        const row = document.createElement('div');
        Object.assign(row.style, {
          position: 'absolute', left: '16px', width: '562px', height: ROW + 'px',
          display: 'flex', alignItems: 'center', fontSize: '21px',
        });
        row.className = 'mono';
        if (m.question) {
          // the NEW highlight sits behind the text, its violet bar in the block's left padding
          row.innerHTML = `<div class="hl" style="position:absolute;left:-10px;right:-6px;top:0;bottom:0;`
            + `background:#F2E6FF;border-left:4px solid ${C.violet};border-radius:var(--rs)">`
            + '<div style="position:absolute;right:12px;top:0;bottom:0;display:flex;align-items:center;'
            + 'font-size:14px;letter-spacing:.12em;color:#5B6475">NEW</div></div>';
        }
        const text = document.createElement('div');
        text.style.position = 'relative';
        text.innerHTML = m.text;
        row.appendChild(text);
        s.hist.appendChild(row);
        return { row, hl: row.querySelector('.hl') };
      });
      s.gauge = E(root, '<div class="f" style="position:absolute;left:0;right:0;bottom:0"></div>', '', {
        width: '22px', height: '600px', background: 'rgba(248,250,252,.08)', border: '1.5px solid ' + C.line,
        overflow: 'hidden', borderRadius: 'var(--rs)',
      });
      s.gf = s.gauge.querySelector('.f');
      s.gaugeL = E(root, 'Size', 'lbl');
      s.full = tag(root, 'Full', 'red');
      s.llm = makeLLM(root, 200);
      s.g1 = E(root,
        `<div class="mono" style="font-size:22px">Yesterday's email</div>`
        + '<div class="lbl" style="font-size:15px;margin-top:4px">not in context</div>',
        '', { border: '1.5px dashed #4B5363', padding: '10px 18px', color: 'var(--slate)', borderRadius: 'var(--r)' });
      s.bill = E(root,
        `<div style="display:flex;align-items:center;gap:16px">${ICON('coin', 46, C.neon, 1.6)}<div>`
        + '<div class="tok" style="font-size:44px;line-height:1">0 tokens</div>'
        + '<div class="lbl" style="font-size:16px;margin-top:6px;color:var(--neon)">billed at every call</div>'
        + '</div></div>',
        '', {
          padding: '16px 22px', border: '1.5px solid ' + C.neon, background: 'rgba(219,255,75,.06)',
          borderRadius: 'var(--r)',
        });
      s.tok = s.bill.querySelector('.tok');
    },
    update(t, c, s) {
      const sp = P(t, c[0] + 0.1, 0.7, backOut);
      place(s.sheet, 760, 480, sp, clamp(sp * 2));
      place(s.sheetT, 760, 150, 1, P(t, c[0] + 0.6, 0.4));
      place(s.llm.root, 1560, 445, P(t, c[0] + 0.4, 0.6, backOut), P(t, c[0] + 0.4, 0.4));
      llmState(s.llm, { look: -1 });
      // c[0]: instructions, chat lines, document, question; c[1]: the conversation goes on, one message at a time
      const partAt = [0, 1, 2, 3].map(i => c[0] + 2.2 + i * 1.2)
        .concat(APPENDED.map((_, i) => c[1] + 2.4 + i * 0.55));
      const app = partAt.map(at => P(t, at, 0.5));
      // the chat lines share part 1; the document, the question and each appended message take the next parts
      const rowApp = s.rows.map((_, i) => app[Math.max(1, i - CHAT.length + 2)]);
      const slideIn = (el, a) => {
        el.style.opacity = a; el.style.transform = `translateX(${(1 - a) * 80}px)`;
      };
      // grown, the 74 px instructions, the 10 px gap and the history (36 px of label and padding, then 11 rows)
      // fill the 560 px gauge, and the history keeps the 20 px bottom margin of the 600 px sheet
      Object.assign(s.instr.style, { top: '20px', height: '74px' });
      slideIn(s.instr, app[0]);
      slideIn(s.hist, app[1]);
      // the chat lines keep their rows while they fade in; each later message pushes the block's bottom down
      let y = 28, used = 74 * app[0] + (10 + 36 + CHAT.length * ROW) * app[1];
      s.rows.forEach((r, i) => {
        r.row.style.top = y + 'px';
        if (i < CHAT.length) {
          y += ROW;
        } else {
          slideIn(r.row, rowApp[i]);
          y += ROW * rowApp[i]; used += ROW * rowApp[i];
        }
      });
      s.hist.style.top = '104px'; s.hist.style.height = (y + 8) + 'px';
      // the highlight moves to the latest user message: each one fades as the next question comes in
      const questions = s.rows.map((r, i) => ({ hl: r.hl, a: rowApp[i] })).filter(q => q.hl);
      questions.forEach((q, i) => {
        const next = questions[i + 1];
        q.hl.style.opacity = next ? 1 - next.a : 1;
      });
      const fill = used / 560;
      s.gf.style.height = (clamp(fill) * 100) + '%';
      s.gf.style.background = fill > 0.98 ? C.red : `linear-gradient(0deg, ${C.uv}, ${C.violet})`;
      place(s.gauge, 1130, 480, 1, P(t, c[0] + 1.6, 0.5));
      place(s.gaugeL, 1130, 810, 1, P(t, c[0] + 1.6, 0.5));
      // pops as the last message fills the gauge
      place(s.full, 1130, 136, P(t, c[1] + 4.4, 0.4, backOut), P(t, c[1] + 4.4, 0.3));
      s.cone.style.opacity = win(t, c[1] + 0.2, c[1] + 2.6, 0.4);
      place(s.g1, 1560, 205, 1, win(t, c[1] + 0.8, c[1] + 2.8, 0.4));
      const bp = P(t, c[1] + 3.0, 0.5, backOut);
      place(s.bill, 1560, 740, bp, clamp(bp * 2));
      s.tok.textContent = Math.round(lerp(4200, 12400, P(t, c[1] + 3.0, 2.0))).toLocaleString('en-US') + ' tokens';
    }
  });
}
