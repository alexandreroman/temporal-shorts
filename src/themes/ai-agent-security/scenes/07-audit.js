// ===================== 7. WHAT WENT WRONG?
// No case file: a survey, not an incident. A large red 95% counts up beside a crowd of 100 figures, each standing for
// 6 of the 600 security chiefs, which turn red as it climbs. Three questions follow, READ? DECIDED? DID?, then fly
// into the header of the Event History card, which grows to fill the frame: a Web UI-like list (number, time, type,
// event, details, result) labelled OUTSIDE THE AGENT, whose rows fill in order, from the shared document the agent
// read to the emails put back. The dramatic beat: the camera pushes in on the latest rows and travels back up the
// history with a magnifier, which stops at each outcome of the earlier chapters (the cancel, the sandbox, Maya's no,
// the blocked link) while a red thread links their results one to the next, up to the document at the top, which
// lights as THE CAUSE with a red flash and a jolt.
// The block keeps every name declared in this file local to this scene.
{
  // ---------- 95%: the stat block on the left, the crowd of figures on the right, centered on y 515
  // the stat block: its center and size (source line 24 + 18, number 230, 10 + caption 2 x 50)
  const STAT = { x: 570, y: 515, w: 760, h: 382 };
  // the crowd: 10 x 10 figures (icon px, pitch px), the first `hit` of them red, and a legend under them; its center
  const CROWD = { x: 1450, y: 515, icon: 40, pitch: 52, cols: 10, count: 100, hit: 95, legendGap: 26, legendH: 20 };
  CROWD.gridW = (CROWD.cols - 1) * CROWD.pitch + CROWD.icon;
  CROWD.h = CROWD.gridW + CROWD.legendGap + CROWD.legendH;
  // the beats from c[0]: the source line, the number and the crowd come in; the count runs from `count` for countD
  // seconds, ending as "95%" is read (16 characters per second + 0.3 s); the caption rises; the number swells at 95
  const T0 = { stat: -0.3, crowd: 0, count: 0.4, countD: 2.9, caption: 0.5, swell: 3.45 };

  // ---------- the three questions
  // their tiles: size, row pitch and line; each one's icon, word, short note, and the header chip it becomes
  const QUESTION = { w: 400, h: 440, pitch: 480, y: 515, icon: 112 };
  const QUESTIONS = [
    { icon: 'eye', word: 'READ?', note: 'what came in', chip: 'READ' },
    { icon: 'face', word: 'DECIDED?', note: 'what the model chose', chip: 'DECIDED' },
    { icon: 'bolt', word: 'DID?', note: 'what it ran', chip: 'DID' },
  ];
  // the beats from c[1]: the 95% slides out (out, outD); the tiles pop in one after the other (tiles, tileStep) and
  // swell as their word is read ("read", "decide", "do"); as "Temporal has it written down" is read, the card grows
  // from the middle (grow, growD, from CARD.from of its size) and the tiles fly into its header (fly, flyStep, flyD),
  // where the chips pop in
  const T1 = {
    out: 0, outD: 0.6, tiles: 0.7, tileStep: 0.25, named: [3.05, 3.43, 4.11],
    grow: 4.4, growD: 1.0, fly: 4.5, flyStep: 0.08, flyD: 0.9,
  };

  // ---------- the Event History card
  // Its center and width; the header (title row, then the column heads band), the rows and the bottom padding, px.
  // The card is a stack of white segments (header, one per row, footer), so each segment dims on its own where the
  // pushed-in camera crops it (frameDim): a cropped edge then never shows at full opacity.
  const CARD = { x: 960, y: 515, w: 1360, headH: 120, bandTop: 80, rowH: 48, footH: 24, from: 0.35 };
  // the columns, from the card's left edge: number, time, type chip, event, details; the result tag ends `result`
  // px from the right edge; the type chip's size
  const COL = { num: 44, time: 92, type: 214, event: 364, detail: 610, result: 40, typeW: 116, typeH: 28 };
  // the header: title on the left, the three chips after it (x0, w, gap, h), OUTSIDE THE AGENT on the right
  const HEAD = { titleLeft: 32, titleH: 80, chipX0: 300, chipW: 132, chipGap: 12, chipH: 32, labelRight: 32 };
  // the look of each type chip: background and text color
  const TYPE_LOOK = {
    READ: ['#E2E8F0', C.slateDark],
    DECIDED: [C.uvTint, C.uv],
    DID: [C.bg, C.ink],
    MAYA: [C.violet, C.bg],
  };
  // The history of the agent, in order: each row's time, type, event (code: a tool name, in bold), details and
  // result tag (tone 'red' for a refused step, 'neon' for a safe outcome). The rows of chapters 2, 3, 5 and 6 carry
  // the thread (LENS_WALK).
  const ROWS = [
    { time: '09:14:02', type: 'READ', event: 'document read', detail: 'a shared document' },
    { time: '09:14:03', type: 'DECIDED', event: 'model call', detail: 'next: open_url' },
    { time: '09:14:04', type: 'DID', event: 'open_url', code: true, detail: 'an outside address',
      tag: 'BLOCKED', tone: 'red' },
    { time: '09:14:06', type: 'DECIDED', event: 'model call', detail: 'next: delete_database' },
    { time: '09:52:31', type: 'DID', event: 'delete_database', code: true, detail: 'the live database',
      tag: 'REJECTED BY MAYA', tone: 'red' },
    { time: '09:52:33', type: 'DECIDED', event: 'model call', detail: 'next: run_code' },
    { time: '09:52:35', type: 'DID', event: 'run_code', code: true, detail: 'code the AI wrote',
      tag: 'SANDBOX', tone: 'neon' },
    { time: '09:52:36', type: 'DECIDED', event: 'model call', detail: 'next: delete_email' },
    { time: '09:52:37', type: 'DID', event: 'delete_email', code: true, detail: 'emails in the inbox' },
    { time: '09:52:40', type: 'MAYA', event: 'Workflow canceled', detail: 'a command to Temporal',
      tag: 'CANCELED BY MAYA', tone: 'red' },
    { time: '09:52:41', type: 'DID', event: 'restore_email', code: true, detail: 'the deleted emails',
      tag: 'RESTORED', tone: 'neon' },
  ];
  CARD.h = CARD.headH + ROWS.length * CARD.rowH + CARD.footH;
  // the beats from c[2]: the rows slide in one after the other (rows, step), each tag 0.3 s after its row; OUTSIDE
  // THE AGENT pops in as "outside the agent" is read
  const T2 = { rows: 0.4, step: 0.4, tag: 0.3, outside: 5.5 };

  // ---------- the dramatic beat
  // The camera, from rest (the stage point (960, 515) at scale 1): it pushes in on the latest rows (pushY, from c[3]
  // + push), then travels back up the history with the magnifier (to endY, from c[3] + travel): one push-in, then the
  // rewind, the one way back the scene allows (a story beat)
  const REST = [960, 515, 1];
  const SHOT = { zoom: 1.25, pushY: 600, endY: 420 };
  const T3 = { push: 0, pushD: 1.1, travel: 1.3, travelD: 2.9, lens: 0.6 };
  // The magnifier's walk back in time, rows by index (0 is #1 on screen): it appears on the latest row, then each move
  // (from c[3] + at, d long) ends on an outcome, where a pin lands and the thread draws from the previous pin; the last
  // move ends on the document, THE CAUSE
  const LENS_WALK = {
    from: 10,
    moves: [
      { to: 9, at: 0.9, d: 0.35 },
      { to: 6, at: 1.45, d: 0.6 },
      { to: 4, at: 2.25, d: 0.45 },
      { to: 2, at: 2.9, d: 0.45 },
      { to: 0, at: 3.55, d: 0.55 },
    ],
  };
  // the magnifier: its radius, ring width, zoom and center x (the start of the event names, inside the glass)
  const LENS = { r: 90, ring: 5, zoom: 1.5, x: CARD.x - CARD.w / 2 + COL.event + 58 };
  // the thread: its pins (diameter), x, just right of the result tags, and how far each arc bulges to the right
  const THREAD = { pin: 16, x: CARD.x + CARD.w / 2 - COL.result + 14, bulge: 80, width: 4 };
  // THE CAUSE tag's approximate width, to center the ripples on it
  const CAUSE_TAG_W = 164;
  // Where the pushed-in camera crops the card, its segments fade out over a band this many px on screen inside the
  // content frame's edges: a soft vignette rather than security's OFF_SHOT dim, as a dimmed white segment would show
  // as a grey bar behind the header and the subtitles
  const EDGE_FADE = 60;
  const FRAME = { top: 150, bottom: 880 };

  // The top of row i in the card (0 at the card's center) and its center on the stage at camera rest
  const rowTop = i => -CARD.h / 2 + CARD.headH + i * CARD.rowH;
  const rowCenterY = i => CARD.y + rowTop(i) + CARD.rowH / 2;
  // The center of header chip i in the card (0 at the card's center)
  const chipCenter = i => [
    -CARD.w / 2 + HEAD.chipX0 + i * (HEAD.chipW + HEAD.chipGap) + HEAD.chipW / 2,
    -CARD.h / 2 + HEAD.titleH / 2,
  ];

  // A face in a circle, the AI model orb as a stroke icon (24 grid, the style of ICONS)
  const FACE = '<circle cx="12" cy="12" r="9"/><path d="M9 10v3.5M15 10v3.5"/>';
  const questionIcon = (name, size) => name === 'face'
    ? `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${C.ink}" stroke-width="1.6"`
      + ` stroke-linecap="square" style="display:block">${FACE}</svg>`
    : ICON(name, size, C.ink, 1.6);

  // A type chip (READ, DECIDED, DID, MAYA) of w x h px with font px text, at (left, top) in its parent
  const typeChip = (type, left, top, w, h, font) => {
    const [background, color] = TYPE_LOOK[type];
    return `<div class="mono" style="position:absolute;left:${left}px;top:${top}px;width:${w}px;height:${h}px;`
      + `line-height:${h}px;font-size:${font}px;font-weight:700;letter-spacing:.1em;padding-left:.1em;`
      + `text-align:center;border-radius:4px;background:${background};color:${color}">${type}</div>`;
  };
  // The HTML of a row's event, font px high: tool names in bold, model calls in UV
  const eventHtml = (row, font) => {
    const color = row.type === 'DECIDED' ? C.uv : C.bg;
    return `<span class="mono" style="font-size:${font}px;color:${color};font-weight:${row.code ? 700 : 400}">`
      + `${row.event}</span>`;
  };

  // The stat block: the source line, the large red number (stat.num holds its digits) and the caption
  const makeStat = root => {
    const stat = E(root,
      `<div class="mono" style="display:flex;align-items:center;gap:12px;height:24px;font-size:20px;`
      + `letter-spacing:.14em;color:${C.slate}">${ICON('file', 22, C.slate, 1.8)}SURVEY, OCTOBER 2026</div>`
      + `<div class="big" style="margin-top:18px;height:230px;font-size:240px;line-height:230px;font-weight:700;`
      + `letter-spacing:-6px;color:${C.red};transform-origin:left center"><span class="n">0</span>%</div>`
      + '<div class="cap" style="margin-top:10px;font-size:40px;line-height:50px">'
      + 'of 600 security chiefs reported<br>an incident tied to an AI agent</div>',
      '', { width: STAT.w + 'px', height: STAT.h + 'px' });
    stat.big = stat.querySelector('.big');
    stat.num = stat.querySelector('.n');
    stat.cap = stat.querySelector('.cap');
    return stat;
  };
  // The crowd: CROWD.count figures in a grid, and the legend under them; crowd.icons: each figure's <svg>
  const makeCrowd = root => {
    const { icon, pitch, cols, count, gridW, legendGap, legendH } = CROWD;
    let html = '';
    for (let k = 0; k < count; k++) {
      html += `<div style="position:absolute;left:${(k % cols) * pitch}px;top:${Math.floor(k / cols) * pitch}px">`
        + `${ICON('user', icon, C.line, 2)}</div>`;
    }
    html += `<div class="mono" style="position:absolute;left:0;top:${gridW + legendGap}px;width:${gridW}px;`
      + `height:${legendH}px;line-height:${legendH}px;font-size:16px;letter-spacing:.12em;padding-left:.12em;`
      + `text-align:center;color:${C.slate}">EACH FIGURE: 6 SECURITY CHIEFS</div>`;
    const crowd = E(root, html, '', { width: gridW + 'px', height: CROWD.h + 'px' });
    crowd.icons = [...crowd.querySelectorAll('svg')].slice(0, count);
    return crowd;
  };
  // A question tile: its icon, its word and its note, centered
  const makeQuestion = (root, { icon, word, note }) => E(root,
    '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%">'
    + questionIcon(icon, QUESTION.icon)
    + `<div style="margin-top:34px;font-size:60px;line-height:64px;font-weight:700">${word}</div>`
    + `<div class="mono" style="margin-top:14px;font-size:20px;line-height:24px;color:${C.slate}">${note}</div>`
    + '</div>',
    'tile', { width: QUESTION.w + 'px', height: QUESTION.h + 'px' });

  // A white segment of the card, h px high, its top at `top` (0 at the card's center), with the corners `radius`
  const makeSegment = (card, top, h, radius, html = '') => E(card, html, 'paper', {
    left: -CARD.w / 2 + 'px', top: top + 'px', width: CARD.w + 'px', height: h + 'px', borderRadius: radius,
    opacity: 1,
  });
  // The header segment: the title, the three chips (head.chips, hidden until they land), OUTSIDE THE AGENT
  // (head.outside) and the column heads band
  const makeHeader = card => {
    const { titleLeft, titleH, chipW, chipH, labelRight } = HEAD;
    const columnHead = (text, css) => `<div class="mono" style="position:absolute;top:${CARD.bandTop}px;`
      + `height:${CARD.headH - CARD.bandTop}px;line-height:${CARD.headH - CARD.bandTop}px;font-size:14px;`
      + `letter-spacing:.14em;color:${C.slateDark};${css}">${text}</div>`;
    const head = makeSegment(card, -CARD.h / 2, CARD.headH, 'var(--r) var(--r) 0 0',
      `<div class="mono" style="position:absolute;left:${titleLeft}px;top:0;height:${titleH}px;display:flex;`
      + `align-items:center;gap:10px;font-size:20px;letter-spacing:.14em;color:${C.bg}">`
      + `${ICON('book', 24, C.bg, 1.8)}EVENT HISTORY</div>`
      + `<div style="position:absolute;left:0;top:${CARD.bandTop}px;width:100%;`
      + `height:${CARD.headH - CARD.bandTop}px;background:#EEF1F5"></div>`
      + columnHead('#', `left:${COL.num}px`) + columnHead('TIME', `left:${COL.time}px`)
      + columnHead('TYPE', `left:${COL.type}px`) + columnHead('EVENT', `left:${COL.event}px`)
      + columnHead('DETAILS', `left:${COL.detail}px`) + columnHead('RESULT', `right:${COL.result}px`));
    head.chips = QUESTIONS.map((q, i) => {
      const [x, y] = chipCenter(i);
      const left = x + CARD.w / 2 - chipW / 2, top = y + CARD.h / 2 - chipH / 2;
      head.insertAdjacentHTML('beforeend', typeChip(q.chip, left, top, chipW, chipH, 16));
      const chip = head.lastElementChild;
      chip.style.opacity = 0;
      return chip;
    });
    head.outside = E(head, 'OUTSIDE THE AGENT', 'mono', {
      left: 'auto', right: labelRight + 'px', top: (titleH - 36) / 2 + 'px', height: '36px', lineHeight: '32px',
      padding: '0 16px 0 calc(16px + .14em)', fontSize: '16px', letterSpacing: '.14em', color: C.uv,
      border: `2px solid ${C.uv}`, borderRadius: 'var(--rs)', whiteSpace: 'nowrap',
    });
    return head;
  };
  // A row segment: its highlight band (seg.band, the magnifier's), its red tint (seg.tint, a linked outcome), its
  // cells (seg.content, which slides in) and its result tag (seg.tag, or null); the document's row also holds a hidden
  // "HIDDEN ORDER" note (seg.order) and THE CAUSE tag (seg.cause)
  const makeRow = (card, row, i) => {
    const { rowH } = CARD;
    const seg = makeSegment(card, rowTop(i), rowH, '0');
    seg.band = E(seg, '', '', { left: 0, top: 0, width: '100%', height: rowH + 'px', background: C.highlight });
    seg.tint = E(seg, '', '', {
      left: 0, top: 0, width: '100%', height: rowH + 'px', background: `rgba(${RGB.red},.12)`,
      borderLeft: `4px solid ${C.red}`,
    });
    if (i < ROWS.length - 1) {
      E(seg, '', '', { left: 0, top: (rowH - 1) + 'px', width: '100%', height: '1px', background: '#E2E8F0',
        opacity: 1 });
    }
    const cell = (left, font, color, html) => `<div class="mono" style="position:absolute;left:${left}px;top:0;`
      + `height:${rowH}px;line-height:${rowH}px;font-size:${font}px;color:${color};white-space:nowrap">${html}</div>`;
    const detailColor = row.type === 'DECIDED' ? C.uv : C.slateDark;
    const hidden = i === 0
      ? `<span class="order" style="color:${C.red};font-weight:700;letter-spacing:.06em;opacity:0">`
        + '&nbsp;&nbsp;HIDDEN ORDER</span>'
      : '';
    seg.content = E(seg,
      cell(COL.num, 18, '#8A93A6', i + 1) + cell(COL.time, 18, C.slateDark, row.time)
      + typeChip(row.type, COL.type, (rowH - COL.typeH) / 2, COL.typeW, COL.typeH, 14)
      + cell(COL.event, 20, C.bg, eventHtml(row, 20)) + cell(COL.detail, 18, detailColor, row.detail + hidden),
      '', { left: 0, top: 0, width: '100%', height: rowH + 'px' });
    seg.order = seg.content.querySelector('.order');
    // the result tag sits in a row-high box at the right, which centers it
    const tagBox = (font, padY) => {
      const box = E(seg.content, '', '', {
        left: 'auto', right: COL.result + 'px', top: 0, height: rowH + 'px', display: 'flex', alignItems: 'center',
        opacity: 1,
      });
      const e = statusTag(box, { font, padX: font === 18 ? 12 : 10, padY, icon: font });
      Object.assign(e.style, { position: 'relative', lineHeight: (font + 4) + 'px', fontWeight: 700 });
      return e;
    };
    seg.tag = null;
    if (row.tag) {
      seg.tag = tagBox(16, 4);
      seg.tag.style.transformOrigin = 'right center';
      setStatus(seg.tag, row.tag, row.tone === 'red' ? 'alarm' : 'safe');
    }
    if (i === 0) {
      seg.cause = tagBox(18, 5);
      setStatus(seg.cause, 'THE CAUSE', 'alarm');
    }
    return seg;
  };
  // The magnifier: a dark ring round a glass that shows the event names under it lens.zoom times larger (lens.lines,
  // one per row, placed by placeLens()), and a handle at its bottom right
  const makeLens = root => {
    const { r, ring, zoom } = LENS;
    const lens = E(root, '', '', { width: 2 * r + 'px', height: 2 * r + 'px' });
    const glass = E(lens, '', '', {
      left: 0, top: 0, width: 2 * r + 'px', height: 2 * r + 'px', borderRadius: '50%', overflow: 'hidden',
      border: `${ring}px solid ${C.bg}`, background: `linear-gradient(${C.highlight}, ${C.highlight}), ${C.ink}`,
      boxShadow: '0 12px 30px rgba(0,0,0,.4)', opacity: 1,
    });
    lens.lines = ROWS.map(row => E(glass, eventHtml(row, 20 * zoom), '', {
      height: CARD.rowH * zoom + 'px', lineHeight: CARD.rowH * zoom + 'px', whiteSpace: 'nowrap',
    }));
    // the handle leaves the ring at 45 degrees, down and to the right
    const corner = Math.round(r + r * Math.SQRT1_2);
    E(lens, '', '', {
      left: (corner - 9) + 'px', top: (corner - 6) + 'px', width: '18px', height: '74px', background: C.bg,
      borderRadius: '9px', transformOrigin: '9px 6px', transform: 'rotate(-45deg)', opacity: 1,
    });
    return lens;
  };
  // Places the magnifier with its center at (LENS.x, y), and the event lines in its glass so that the line under its
  // center matches the row under it; the lines more than two rows away hide
  const placeLens = (lens, y, pop) => {
    const { r, ring, zoom, x } = LENS;
    place(lens, x, y, pop.s, pop.o);
    const inner = r - ring;
    const eventLeft = CARD.x - CARD.w / 2 + COL.event;
    lens.lines.forEach((line, i) => {
      const top = CARD.y + rowTop(i);
      const near = Math.abs(rowCenterY(i) - y) < 2 * CARD.rowH;
      line.style.left = (inner + zoom * (eventLeft - x)).toFixed(2) + 'px';
      line.style.top = (inner + zoom * (top - y)).toFixed(2) + 'px';
      line.style.opacity = near ? 1 : 0;
      line.style.visibility = near ? 'visible' : 'hidden';
    });
  };
  // The magnifier's row (a fractional index) at time t, from c3 = c[3]
  const lensRowAt = (t, c3) => LENS_WALK.moves.reduce(
    (row, move) => lerp(row, move.to, P(t, c3 + move.at, move.d)), LENS_WALK.from);
  // The arc of the thread from the pin of row `from` up to the pin of row `to`, bulging to the right
  const threadD = (from, to) => {
    const { x, bulge } = THREAD;
    const y0 = rowCenterY(from), y1 = rowCenterY(to);
    return `M ${x} ${y0} C ${x + bulge} ${y0} ${x + bulge} ${y1} ${x} ${y1}`;
  };

  scene({
    chapter: 7, title: 'What went wrong?',
    subs: [
      {
        text: "October 2026: in a survey of 600 security chiefs, 95% reported an incident tied to an AI agent "
          + "that year.",
      },
      {
        text: "Then comes the question: what did the agent read, decide and do? Temporal has it written down.",
      },
      {
        text: "The <b>Event History</b> records each model call, each tool call, each approval, in order, "
          + "outside the agent.",
      },
      // a hold on THE CAUSE before the zoom-through into the recap
      {
        text: "Follow it back to the cause: the document that started it, the blocked step, Maya's no, the cancel.",
        after: 1.0,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.stat = makeStat(root);
      s.crowd = makeCrowd(root);

      // the card: a point at its center (class cam, as makeCaseFile's: the layout check measures the segments as
      // its growth shows them), holding the segments
      s.card = E(root, '', 'cam', { width: 0, height: 0 });
      s.head = makeHeader(s.card);
      s.rows = ROWS.map((row, i) => makeRow(s.card, row, i));
      s.foot = makeSegment(s.card, CARD.h / 2 - CARD.footH, CARD.footH, '0 0 var(--r) var(--r)');

      // the thread over the card: one arc per move after the first, and a pin on each row the magnifier stops at
      s.svg = svgLayer(root);
      const { moves } = LENS_WALK;
      s.arcs = moves.slice(1).map((move, k) => path(s.svg, threadD(moves[k].to, move.to), C.red, THREAD.width, false));
      s.pins = moves.map(() => E(root, '', '', {
        width: THREAD.pin + 'px', height: THREAD.pin + 'px', borderRadius: '50%', background: C.red,
        border: `3px solid ${C.ink}`, boxShadow: `0 0 10px rgba(${RGB.red},.7)`,
      }));
      s.ripples = makeRipples(root, 2, RGB.red);
      s.lens = makeLens(root);
      s.questions = QUESTIONS.map(q => makeQuestion(root, q));
      // the flash covers the stage, outside the camera
      s.flash = makeFlash(stage);
    },
    update(t, c, s) {
      const { moves } = LENS_WALK;
      const lastMove = moves[moves.length - 1];
      const causeAt = c[3] + lastMove.at + lastMove.d;
      const hitAt = causeAt + 0.16;

      // the camera: the zoom-through in and out, at rest until the push-in, then the travel back up with the
      // magnifier; THE CAUSE's landing jolts it
      const cam = shot(t, REST, [
        [c[3] + T3.push, CARD.x, SHOT.pushY, SHOT.zoom, T3.pushD],
        [c[3] + T3.travel, CARD.x, SHOT.endY, SHOT.zoom, T3.travelD],
      ]);
      const [jx, jy] = shake(t, hitAt, 10, 0.4);
      setCamera(s.cam, t, this.dur, { scale: cam.scale, dx: cam.dx + jx, dy: cam.dy + jy });
      placeFlash(s.flash, t, hitAt, 0.2);
      // The opacity of a part spanning stage y top to bottom: 1 at least EDGE_FADE px inside the content frame, 0 where
      // the shot crops it. It applies with the push-in only, so the whole card shows at rest. (setCamera scales round
      // y 540; its brief zooms in and out at the scene's ends are left out.)
      const pushed = clamp((cam.scale - 1) / (SHOT.zoom - 1));
      const frameDim = (top, bottom) => {
        const toScreen = y => 540 + cam.dy + (y - 540) * cam.scale;
        const inside = Math.min(toScreen(top) - FRAME.top, FRAME.bottom - toScreen(bottom));
        return lerp(1, clamp(inside / EDGE_FADE), pushed);
      };

      // 95%: the source line and the number come in, the count climbs as the crowd turns red, the number swells at
      // 95; all of it slides out to the sides as the questions come
      const out = P(t, c[1] + T1.out, T1.outD);
      const statIn = P(t, c[0] + T0.stat, 0.7);
      place(s.stat, STAT.x - 80 * out, STAT.y + Math.round((1 - statIn) * 24), 1, statIn * (1 - out));
      s.stat.cap.style.opacity = P(t, c[0] + T0.caption, 0.6);
      const count = Math.round(CROWD.hit * P(t, c[0] + T0.count, T0.countD, easeOut));
      setText(s.stat.num, String(count));
      s.stat.big.style.transform = `scale(${swell(t, c[0] + T0.swell, 0.05)})`;
      place(s.crowd, CROWD.x + 80 * out, CROWD.y, 1, P(t, c[0] + T0.crowd, 0.6) * (1 - out));
      s.crowd.icons.forEach((icon, k) => {
        const color = k < count ? C.red : C.line;
        if (icon._color !== color) {
          icon.setAttribute('stroke', color);
          icon._color = color;
        }
      });

      // the card grows from the middle; the questions pop in, swell as they are read, then fly into its header,
      // where their chips pop in
      const grow = P(t, c[1] + T1.grow, T1.growD, easeOut);
      const cardK = lerp(CARD.from, 1, grow);
      place(s.card, CARD.x, CARD.y, cardK, clamp(grow * 3));
      s.questions.forEach((tile, i) => {
        const pop = backPop(t, c[1] + T1.tiles + i * T1.tileStep, 0.5);
        const named = swell(t, c[1] + T1.named[i], 0.06);
        const flyAt = c[1] + T1.fly + i * T1.flyStep;
        const f = P(t, flyAt, T1.flyD);
        const [chipX, chipY] = chipCenter(i);
        const x = lerp(CARD.x + (i - 1) * QUESTION.pitch, CARD.x + chipX * cardK, f);
        const y = lerp(QUESTION.y, CARD.y + chipY * cardK, f);
        const fade = 1 - P(t, flyAt + T1.flyD * 0.6, T1.flyD * 0.4);
        place(tile, x, y, pop.s * named * lerp(1, 0.3, f), pop.o * fade);
        popScale(s.head.chips[i], popIn(t, flyAt + T1.flyD * 0.85));
      });

      // each segment dims where the shot crops it
      const stageY = local => CARD.y + local * cardK;
      s.head.style.opacity = frameDim(stageY(-CARD.h / 2), stageY(-CARD.h / 2 + CARD.headH));
      s.foot.style.opacity = frameDim(stageY(CARD.h / 2 - CARD.footH), stageY(CARD.h / 2));
      const outside = popIn(t, c[2] + T2.outside, 0.2);
      popScale(s.head.outside, outside);

      // the rows slide in, in order, their tags just after; the magnifier's band lights the row under it, a linked
      // outcome keeps a red tint and its tag swells as the magnifier lands on it
      const lensRow = lensRowAt(t, c[3]);
      const lensPop = backPop(t, c[3] + T3.lens, 0.4);
      const arrivals = new Map(moves.map(move => [move.to, c[3] + move.at + move.d]));
      s.rows.forEach((seg, i) => {
        seg.style.opacity = frameDim(stageY(rowTop(i)), stageY(rowTop(i) + CARD.rowH));
        const at = c[2] + T2.rows + i * T2.step;
        showRow(seg.content, P(t, at, 0.35), 26, true);
        seg.band.style.opacity = (lensPop.o * clamp(1 - Math.abs(lensRow - i))).toFixed(3);
        const arrival = arrivals.get(i);
        seg.tint.style.opacity = arrival === undefined ? 0 : P(t, arrival, 0.3);
        if (seg.tag) {
          const pop = popIn(t, at + T2.tag);
          const visited = arrival === undefined ? 1 : swell(t, arrival, 0.12);
          popScale(seg.tag, { o: pop.o, s: pop.s * visited });
        }
      });

      // the dramatic beat: THE CAUSE slams onto the document's row, red rings spread from it, the hidden order shows
      const first = s.rows[0];
      const slam = P(t, causeAt, 0.16, easeIn);
      first.cause.style.opacity = P(t, causeAt, 0.08, linear);
      first.cause.style.transform = `scale(${lerp(1.8, 1, slam).toFixed(4)})`;
      first.order.style.opacity = P(t, causeAt + 0.3, 0.3);
      const tagX = CARD.x + CARD.w / 2 - COL.result - CAUSE_TAG_W / 2;
      placeRipples(s.ripples, t, hitAt, tagX, rowCenterY(0), 60, 360, { d: 0.8, step: 0.16 });

      // the magnifier walks back up the rows; a pin lands on each outcome it stops at, and the thread draws from the
      // previous pin as it moves, then glows once the cause is found
      placeLens(s.lens, rowCenterY(0) + lensRow * CARD.rowH, lensPop);
      moves.forEach((move, k) => {
        const rowDim = frameDim(rowCenterY(move.to) - CARD.rowH / 2, rowCenterY(move.to) + CARD.rowH / 2);
        const pin = popIn(t, c[3] + move.at + move.d, 0.4);
        place(s.pins[k], THREAD.x, rowCenterY(move.to), pin.s, pin.o * rowDim);
        if (k === 0) return;
        const from = moves[k - 1].to;
        draw(s.arcs[k - 1], P(t, c[3] + move.at, move.d, linear),
          frameDim(rowCenterY(move.to), rowCenterY(from)));
      });
      const glow = P(t, hitAt, 0.3);
      s.svg.style.filter = glow > 0 ? `drop-shadow(0 0 6px rgba(${RGB.red},${(0.8 * glow).toFixed(3)}))` : 'none';
    }
  });
}
