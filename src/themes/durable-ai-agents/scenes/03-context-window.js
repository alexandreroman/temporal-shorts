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
  // height each part adds to the page: the instructions, the gap and the HISTORY label, then one row per message
  const PART_PX = [74, 10 + 36, ...Array(CHAT.length + 2 + APPENDED.length).fill(ROW)];
  // grown, the parts make the 560 px of a full page. The gauge and the tokens billed so far (12,400 on a full page)
  // grow as the square of the page fill: every call resends the whole page, so each new message costs more
  const PAGE = 560, TOKENS_FULL = 12400;
  const gaugeFill = pagePx => (pagePx / PAGE) ** 2;
  const tokensFor = pagePx => Math.round(TOKENS_FULL * clamp(gaugeFill(pagePx)));
  // flight of the coin paid out at each part: degrees from straight up (negative: left) and px of travel, cycled so
  // consecutive coins differ; a narrow fan around straight up, never downward, at most 5° right to clear the number
  const COIN_PATHS = [[-20, 100], [5, 95], [-40, 105], [-8, 90], [-30, 110], [5, 105], [-45, 95]];
  scene({
    chapter: 3, title: 'The context window',
    // one fixed offset fits the page with its token box in c[0] and the cone, then FULL, in c[1]
    shift: [-138, 42],
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
      s.cone.setAttribute('fill', `rgba(${RGB.violet},0.13)`);
      s.svg.appendChild(s.cone);
      s.sheet = E(root, '', 'paper', { width: '640px', height: '600px', overflow: 'hidden' });
      s.sheetT = E(root, 'Context window', 'lbl', { color: 'var(--ink)', fontSize: '22px' });
      const mk = (who, html, col, bar) => {
        const b = document.createElement('div');
        Object.assign(b.style, {
          position: 'absolute', left: '20px', width: '600px', background: col, borderLeft: `6px solid ${bar}`,
          padding: '8px 16px', overflow: 'hidden', color: C.bg, borderRadius: 'var(--rs)',
        });
        b.innerHTML = `<div class="mono" style="font-size:14px;letter-spacing:.12em;color:${C.slateDark}">${who}</div>`
          + `<div class="mono" style="font-size:21px;line-height:1.45">${html}</div>`;
        s.sheet.appendChild(b); return b;
      };
      s.instr = mk('INSTRUCTIONS', "You are the shop's helpful assistant.", C.uvTint, C.uv);
      s.hist = mk('HISTORY', '', '#EDEFF3', C.slate);
      // one 40 px row per message, each sliding in on its own part
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
            + `font-size:14px;letter-spacing:.12em;color:${C.slateDark}">NEW</div></div>`;
        }
        const text = document.createElement('div');
        text.style.position = 'relative';
        text.innerHTML = m.text;
        row.appendChild(text);
        s.hist.appendChild(row);
        return { row, hl: row.querySelector('.hl') };
      });
      s.gauge = E(root, '<div class="f" style="position:absolute;left:0;right:0;bottom:0"></div>', '', {
        width: '22px', height: '600px', background: `rgba(${RGB.ink},.08)`, border: '1.5px solid ' + C.line,
        overflow: 'hidden', borderRadius: 'var(--rs)',
      });
      s.gf = s.gauge.querySelector('.f');
      s.gaugeL = E(root, 'Size', 'lbl');
      s.full = tag(root, 'Full', 'red');
      s.llm = makeLLM(root, 200);
      s.g1 = E(root,
        `<div class="mono" style="font-size:22px">Yesterday's email</div>`
        + '<div class="lbl" style="font-size:15px;margin-top:4px">not in context</div>',
        '', {
          border: `1.5px dashed ${C.lineLight}`, padding: '10px 18px', color: 'var(--slate)', borderRadius: 'var(--r)',
        });
      s.bill = E(root,
        '<div style="display:flex;align-items:center;gap:16px">'
        + `<div class="coin">${ICON('coin', 46, C.neon, 1.6)}</div><div>`
        // fixed width, sized for "12,400 tokens" in tabular figures, so the box and "+N" never move
        + '<div class="tok" style="width:288px;font-size:44px;line-height:1;font-variant-numeric:tabular-nums">'
        + '0 tokens</div>'
        + '<div class="lbl" style="font-size:16px;margin-top:6px;color:var(--neon)">billed so far</div>'
        + '</div></div>',
        '', {
          padding: '16px 22px', border: '1.5px solid ' + C.neon, background: `rgba(${RGB.neon},.06)`,
          borderRadius: 'var(--r)',
        });
      s.tok = s.bill.querySelector('.tok');
      s.coin = s.bill.querySelector('.coin');
      // each part spends tokens: a coin leaves the box from the big one and "+N" rises beside the number
      let pagePx = 0;
      s.spends = PART_PX.map(px => {
        const gain = tokensFor(pagePx + px) - tokensFor(pagePx);
        pagePx += px;
        // 36 px icon, a 27 px coin, centered on the big coin (1.5 px border + 22 px padding + 23 px)
        const coin = E(s.bill, ICON('coin', 36, C.neon, 1.8), '', { left: '28.5px', top: 'calc(50% - 18px)' });
        coin.querySelector('circle').setAttribute('fill', `rgba(${RGB.neon},.2)`);
        const plus = E(s.bill, '+' + gain.toLocaleString('en-US'), 'mono', {
          left: 'calc(100% + 20px)', top: '14px', fontSize: '22px', color: C.neon, whiteSpace: 'nowrap',
        });
        return { coin, plus };
      });
    },
    update(t, c, s) {
      const sp = backPop(t, c[0] + 0.1, 0.7);
      place(s.sheet, 760, 480, sp.s, sp.o);
      place(s.sheetT, 760, 150, 1, P(t, c[0] + 0.6, 0.4));
      place(s.llm.root, 1560, 445, P(t, c[0] + 0.4, 0.6, backOut), P(t, c[0] + 0.4, 0.4));
      llmState(s.llm, { look: -1 });
      // c[0]: instructions, the empty HISTORY block, each chat line, document, question;
      // c[1]: the conversation goes on, one message at a time
      const partAt = [
        c[0] + 2.2,
        c[0] + 2.9,
        ...CHAT.map((_, i) => c[0] + 3.3 + i * 0.45),
        c[0] + 5.9,
        c[0] + 6.6,
        ...APPENDED.map((_, i) => c[1] + 2.4 + i * 0.55),
      ];
      const app = partAt.map(at => P(t, at, 0.5));
      // parts 0 and 1 are the two blocks, then one part per message row
      const rowApp = app.slice(2);
      // grown, the history keeps the 20 px bottom margin of the 600 px sheet
      Object.assign(s.instr.style, { top: '20px', height: '74px' });
      showRow(s.instr, app[0], 80);
      showRow(s.hist, app[1], 80);
      // the HISTORY block arrives with its label only; each message pushes its bottom down
      let y = 28;
      s.rows.forEach((r, i) => {
        r.row.style.top = y + 'px';
        showRow(r.row, rowApp[i], 80);
        y += ROW * rowApp[i];
      });
      s.hist.style.top = '104px'; s.hist.style.height = (y + 8) + 'px';
      // the highlight moves to the latest user message: each one fades as the next question comes in
      const questions = s.rows.map((r, i) => ({ hl: r.hl, a: rowApp[i] })).filter(q => q.hl);
      questions.forEach((q, i) => {
        const next = questions[i + 1];
        q.hl.style.opacity = next ? 1 - next.a : 1;
      });
      // the gauge and the token count rise with each part as it slides in
      const used = PART_PX.reduce((sum, px, k) => sum + px * app[k], 0);
      const fill = gaugeFill(used);
      s.gf.style.height = (clamp(fill) * 100) + '%';
      s.gf.style.background = fill > 0.98 ? C.red : `linear-gradient(0deg, ${C.uv}, ${C.violet})`;
      place(s.gauge, 1130, 480, 1, P(t, c[0] + 1.6, 0.5));
      place(s.gaugeL, 1130, 810, 1, P(t, c[0] + 1.6, 0.5));
      // the token count arrives with the gauge and follows it part by part
      const bp = backPop(t, c[0] + 1.6, 0.5);
      // the 105 px box ends on the sheet's bottom edge (480 + 300)
      place(s.bill, 1560, 727.5, bp.s, bp.o);
      s.tok.textContent = tokensFor(used).toLocaleString('en-US') + ' tokens';
      // money spent at each part, mid-slide: the big coin swells, a small coin flies off, "+N" rises and fades
      const spendAt = partAt.map(at => at + 0.1);
      s.coin.style.transform = `scale(${Math.max(...spendAt.map(at => swell(t, at, 0.25)))})`;
      s.spends.forEach(({ coin, plus }, k) => {
        const at = spendAt[k];
        // the coin shoots out of the box fast, then drifts on, turning slightly, as it fades
        const fly = P(t, at, 0.7, easeOut);
        const [angle, travel] = COIN_PATHS[k % COIN_PATHS.length];
        const rad = angle * Math.PI / 180;
        const dx = Math.sin(rad) * travel * fly, dy = -Math.cos(rad) * travel * fly;
        coin.style.opacity = P(t, at, 0.08) * (1 - P(t, at + 0.25, 0.45));
        coin.style.transform = `translate(${dx}px,${dy}px) rotate(${0.4 * angle * fly}deg) scale(${1 - 0.1 * fly})`;
        plus.style.opacity = P(t, at, 0.1) * (1 - P(t, at + 0.25, 0.25));
        plus.style.transform = `translateY(${-36 * P(t, at, 0.6)}px)`;
      });
      // pops as the last message fills the gauge
      place(s.full, 1130, 136, P(t, c[1] + 4.4, 0.4, backOut), P(t, c[1] + 4.4, 0.3));
      s.cone.style.opacity = win(t, c[1] + 0.2, c[1] + 2.6, 0.4);
      place(s.g1, 1560, 205, 1, win(t, c[1] + 0.8, c[1] + 2.8, 0.4));
    }
  });
}
