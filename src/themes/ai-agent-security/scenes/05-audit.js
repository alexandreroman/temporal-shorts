// ===================== 5. WHAT WENT WRONG?
// No case file: a survey, not an incident. A large red 95% counts up beside a crowd of 100 figures, each standing for
// 6 of the 600 security chiefs, which turn red as it climbs. Three questions follow, READ? DECIDED? DID?, put to the
// agent, whose own answer ("All good, nothing sent.") gets an UNRELIABLE stamp. The questions fly into the header of
// the Event History card, labelled OUT OF THE AGENT'S REACH, whose rows tell chapters 2 to 4 in order: the shared
// document read and FLAGGED, the add-on step in a sandbox, the box replaced, the deleted volume and the ticket to an
// outside project, both REJECTED BY MAYA. A magnifier walks back up the rows, a red thread linking the outcomes, to
// the document: THE CAUSE. Then the camera whips right, one way, to a Workflows list in the look of the Temporal Web
// UI, where a search on a custom Search Attribute, ReadDocument = "Q3 plan", filters the runs to four: this one and
// three others, which light up red, FLAGGED, as the dramatic beat (a flash and a jolt): "every run that read it".
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

  // ---------- the three questions, put to the agent
  // their tiles: size, the first one's center x, the pitch and line; each one's icon, word, short note, and the
  // header chip it becomes (x 140-1220, y 315-715)
  const QUESTION = { w: 320, h: 400, x0: 300, pitch: 380, y: 515, icon: 104 };
  const QUESTIONS = [
    { icon: 'eye', word: 'READ?', note: 'what came in', chip: 'READ' },
    { icon: 'face', word: 'DECIDED?', note: 'what the model chose', chip: 'DECIDED' },
    { icon: 'bolt', word: 'DID?', note: 'what it ran', chip: 'DID' },
  ];
  // the agent on the right: the orb (x 1450-1630, y 520-700, its label under it) and its speech bubble above it, its
  // top level with the tiles' (y 315-485), the tail pointing down at the orb; the stamp in the bubble's lower half
  const AGENT = { x: 1540, y: 610, size: 180, look: -0.6 };
  const BUBBLE = { x: 1540, y: 400, w: 440, h: 170, tail: 22, stampTop: 92 };
  // the beats from c[1]: the 95% slides out (out, outD) and the orb pops in (agent); the tiles pop in one after the
  // other (tiles, tileStep) and swell as their word is read ("read", "decide", "do"); the bubble pops in as "Its own
  // account" is read (bubble) and the stamp slams onto it as "wrong" is read (stamp)
  const T1 = { out: 0, outD: 0.6, agent: 0.5, tiles: 0.7, tileStep: 0.25, named: [3.05, 3.43, 4.11], bubble: 4.3,
    stamp: 5.65 };

  // ---------- the Event History card
  // Its center and width; the header (title row, then the column heads band), the rows and the bottom padding, px
  // (x 280-1640, y 227-803 at rest)
  const CARD = { x: 960, y: 515, w: 1360, headH: 120, bandTop: 80, rowH: 48, footH: 24, from: 0.35 };
  // the columns, from the card's left edge: number, time, type chip, event, details; the result tags end `result`
  // px from the right edge; the type chip's size
  const COL = { num: 44, time: 92, type: 214, event: 360, detail: 640, result: 48, typeW: 116, typeH: 28 };
  // the header: title on the left, the three chips after it (x0, w, gap, h), OUT OF THE AGENT'S REACH on the right
  const HEAD = { titleLeft: 32, titleH: 80, chipX0: 300, chipW: 132, chipGap: 12, chipH: 32, labelRight: 32 };
  // the look of each type chip: background and text color; WORKFLOW, in Temporal's UV, marks what the Workflow did
  const TYPE_LOOK = {
    READ: ['#E2E8F0', C.slateDark],
    DECIDED: [C.uvTint, C.uv],
    DID: [C.bg, C.ink],
    WORKFLOW: [C.uv, '#FFFFFF'],
    MAYA: [C.violet, C.bg],
  };
  // the result tags: text, fill, icon, and text color (dark by default)
  const TAGS = {
    flagged: { text: 'FLAGGED', fill: C.red, icon: 'flag' },
    sandbox: { text: 'SANDBOX', fill: C.neon, icon: 'sandbox' },
    held: { text: 'HELD', fill: C.violet, icon: 'hourglass' },
    rejected: { text: 'REJECTED BY MAYA', fill: C.red, icon: 'x' },
    cause: { text: 'THE CAUSE', fill: C.red, icon: 'alert' },
    thisRun: { text: 'THIS RUN', fill: C.uv, icon: 'search', color: '#FFFFFF' },
  };
  // One run of the agent, as chapters 2 to 4 told it, in order: each row's time, type, event (tool: a tool call, in
  // bold), details and result tag. The shared document at the top is the cause the magnifier walks back to.
  const ROWS = [
    { time: '09:14:02', type: 'READ', event: 'outside content read', detail: '"Q3 plan", a shared document',
      tag: TAGS.flagged },
    { time: '09:14:03', type: 'DECIDED', event: 'model call', detail: 'next: add-on step' },
    { time: '09:14:05', type: 'DID', event: 'add-on step', tool: true, detail: 'wallet-helper, in a sandbox',
      tag: TAGS.sandbox },
    { time: '09:14:09', type: 'WORKFLOW', event: 'box replaced', detail: 'a fresh sandbox, progress kept' },
    { time: '09:14:10', type: 'DECIDED', event: 'model call', detail: 'next: delete volume' },
    { time: '09:31:47', type: 'MAYA', event: 'delete volume prod-db', tool: true, detail: 'cannot be undone',
      tag: TAGS.rejected },
    { time: '09:31:48', type: 'DECIDED', event: 'model call', detail: 'next: create ticket' },
    { time: '09:31:50', type: 'WORKFLOW', event: 'create ticket', tool: true, detail: 'to an outside project',
      tag: TAGS.held },
    { time: '10:02:15', type: 'MAYA', event: 'create ticket', tool: true, detail: 'to an outside project',
      tag: TAGS.rejected },
  ];
  CARD.h = CARD.headH + ROWS.length * CARD.rowH + CARD.footH;
  // the beats from c[2]: the orb and its bubble slide out (out, outD); as the card grows from the middle (grow,
  // growD, from CARD.from of its size) the tiles fly into its header (fly, flyStep, flyD), where the chips pop in;
  // the rows slide in one after the other (rows, step), each tag 0.3 s after its row; OUT OF THE AGENT'S REACH pops
  // in as "out of the agent's reach" is read
  const T2 = { out: 0, outD: 0.5, grow: 0, growD: 1.0, fly: 0.1, flyStep: 0.08, flyD: 0.9, rows: 0.7, step: 0.36,
    tag: 0.3, outside: 5.2 };

  // ---------- the walk back to the cause
  // The magnifier's walk back in time, rows by index (0 is #1 on screen), from c[3]: it pops in on the latest row
  // (lens), then each move (from `at`, d long) ends on an outcome, where a pin lands and the thread draws from the
  // previous pin; the last move ends on the document, THE CAUSE, as "the cause" is read
  const LENS_WALK = {
    from: 8,
    moves: [
      { to: 8, at: 0, d: 0 },
      { to: 7, at: 0.3, d: 0.3 },
      { to: 5, at: 0.75, d: 0.4 },
      { to: 0, at: 1.3, d: 0.55 },
    ],
  };
  // the magnifier: its radius, ring width, zoom and center x (the start of the event names, inside the glass)
  const LENS = { r: 90, ring: 5, zoom: 1.5, x: CARD.x - CARD.w / 2 + COL.event + 58 };
  // the thread: its pins (diameter), x, just right of the result tags, and how far each arc bulges to the right
  const THREAD = { pin: 16, x: CARD.x + CARD.w / 2 - 22, bulge: 80, width: 4 };

  // ---------- the Workflows list, in the look of the Temporal Web UI (dark mode), one screen to the right
  // Colors sampled from the real Web UI (see the project memory note on it)
  const UI = {
    ...WEB_UI, head: '#222222', rule: '#343332', cardEdge: '#2E2D2C', fieldEdge: '#43403F', text: '#FBFBFA',
    dim: '#C3C2BB', link: '#8DA4EF', navActive: '#1C202D', primary: '#3A5BC7',
  };
  // Status badges: small, fully rounded, mono uppercase, a thin border
  const STATUS = {
    running: { text: '#8EC8F6', bg: '#113264', edge: '#0574D1' },
    completed: { text: '#8ECEAA', bg: '#193B2D', edge: '#298459' },
    failed: { text: '#F4A9AA', bg: '#641723', edge: '#BF3940' },
  };
  // The window: its center on the stage (the camera lands on it, 1920 px right of rest), its size, the sidebar's
  // width and the page's padding; it spans x 260-1660, y 191-839 on screen
  const WIN = { x: CARD.x + 1920, y: 515, w: 1400, h: 648, side: 220, pad: 36 };
  WIN.pageW = WIN.w - WIN.side;
  WIN.contentW = WIN.pageW - 2 * WIN.pad;
  // the page: the heading, the search row (field, then the Search button) and the table (head band, rows), tops in
  // the page; the table's columns from its left edge, and the badge width
  const LIST = { headTop: 26, searchTop: 94, searchH: 56, buttonW: 150, tableTop: 172, headH: 48, rowH: 56 };
  const LIST_COL = { status: 24, id: 190, type: 430, start: 640, tag: 24, badgeW: 130 };
  // the search: a custom Search Attribute the developer sets when the agent reads a document
  const QUERY = 'ReadDocument = "Q3 plan"';
  const TOTAL_RUNS = 214;
  // the latest runs, newest first: Workflow ID, status, start (Oct 20, 2026), whether it read the document, and
  // whether it is the run of the Event History
  const RUNS = [
    { id: 'assistant-4825', status: 'running', start: '9:52 AM', read: false },
    { id: 'assistant-4824', status: 'running', start: '9:47 AM', read: true },
    { id: 'assistant-4821', status: 'completed', start: '9:31 AM', read: false },
    { id: 'assistant-4819', status: 'completed', start: '9:22 AM', read: true },
    { id: 'assistant-4817', status: 'completed', start: '9:14 AM', read: true, current: true },
    { id: 'assistant-4816', status: 'failed', start: '9:08 AM', read: false },
    { id: 'assistant-4812', status: 'completed', start: '8:55 AM', read: true },
  ];
  // each run's row once filtered: the matching runs close up in order
  RUNS.filter(run => run.read).forEach((run, k) => run.to = k);
  const OTHERS = RUNS.filter(run => run.read && !run.current);
  // the beats from c[3]: the camera whips to the list (whip, whipD), the query types in (type, typeD), Search is
  // pressed (press), the other rows fade (filter) and the matching ones close up (close, closeD); THIS RUN marks the
  // run of the Event History (thisRun); the three others light up red one after the other (others, otherStep), the
  // first one the dramatic beat; the caption rises (caption)
  const T3 = {
    lens: 0, whip: 2.6, whipD: 0.75, type: 3.4, typeD: 0.6, press: 4.05, filter: 4.1, close: 4.25, closeD: 0.4,
    thisRun: 4.65, others: 4.85, otherStep: 0.15, caption: 5.45,
  };

  // The top of row i in the card (0 at the card's top) and its center on the stage at camera rest
  const rowTop = i => CARD.headH + i * CARD.rowH;
  const rowCenterY = i => CARD.y - CARD.h / 2 + rowTop(i) + CARD.rowH / 2;
  // The center of header chip i, from the card's center
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

  // A type chip (READ, DECIDED, DID, WORKFLOW, MAYA) of w x h px with font px text, at (left, top) in its parent
  const typeChip = (type, left, top, w, h, font) => {
    const [background, color] = TYPE_LOOK[type];
    return `<div class="mono" style="position:absolute;left:${left}px;top:${top}px;width:${w}px;height:${h}px;`
      + `line-height:${h}px;font-size:${font}px;font-weight:700;letter-spacing:.1em;padding-left:.1em;`
      + `text-align:center;border-radius:4px;background:${background};color:${color}">${type}</div>`;
  };
  // The HTML of a row's event, font px high: tool calls in bold, model calls in UV
  const eventHtml = (row, font) => {
    const color = row.type === 'DECIDED' ? C.uv : C.bg;
    return `<span class="mono" style="font-size:${font}px;color:${color};font-weight:${row.tool ? 700 : 400}">`
      + `${row.event}</span>`;
  };
  // A result tag (one of TAGS), font px text: bold uppercase text after an icon on a solid fill, the look of the
  // theme's verdict tags. Its width is computed, not measured (Mono advances 0.7 em per character with the .1em
  // spacing), and even, as its height, so it rests on whole pixels however it is anchored. Hidden until shown.
  const makeResultTag = (parent, { text, fill, icon, color = C.bg }, font, css = {}) => {
    const padX = Math.round(font * 0.6), gap = 6;
    const w = 2 * Math.ceil((2 * padX + font + gap + text.length * font * 0.7) / 2);
    return E(parent, ICON(icon, font, color, 2.6) + `<span>${text}</span>`, 'mono', {
      width: w + 'px', height: (font + 12) + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: gap + 'px', fontSize: font + 'px', fontWeight: 700, letterSpacing: '.1em', whiteSpace: 'nowrap',
      background: fill, color, borderRadius: '4px', ...css,
    });
  };

  // The stat block: the source line, the large red number (stat.num holds its digits) and the caption
  const makeStat = root => {
    const stat = E(root,
      `<div class="mono" style="display:flex;align-items:center;gap:12px;height:24px;font-size:20px;`
      + `letter-spacing:.14em;color:${C.slate}">${ICON('file', 22, C.slate, 1.8)}TRELLIX SURVEY, OCTOBER 2026</div>`
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
    + `<div style="margin-top:34px;font-size:52px;line-height:64px;font-weight:700">${word}</div>`
    + `<div class="mono" style="margin-top:14px;font-size:20px;line-height:24px;color:${C.slate}">${note}</div>`
    + '</div>',
    'tile', { width: QUESTION.w + 'px', height: QUESTION.h + 'px' });
  // The agent's speech bubble: a white card with its answer, a tail under it pointing down at the orb, and the
  // UNRELIABLE stamp (bubble.stamp) in its lower half
  const makeBubble = root => {
    const { w, h, tail, stampTop } = BUBBLE;
    const bubble = E(root,
      `<div style="position:absolute;left:0;top:30px;width:100%;text-align:center;font-size:32px;line-height:40px;`
      + 'font-weight:600">“All good, nothing sent.”</div>'
      + `<svg width="40" height="${tail}" viewBox="0 0 40 ${tail}" style="position:absolute;left:${w / 2 - 20}px;`
      + `top:${h - 1}px;display:block"><path d="M0 0H40L20 ${tail}Z" fill="${C.ink}"/></svg>`,
      'paper', { width: w + 'px', height: h + 'px' });
    // a full-width row centers the stamp, which then scales and turns about its own center
    const stampRow = E(bubble, '', '', {
      left: 0, top: stampTop + 'px', width: '100%', display: 'flex', justifyContent: 'center', opacity: 1,
    });
    bubble.stamp = E(stampRow, 'UNRELIABLE', 'mono', {
      position: 'relative', height: '56px', lineHeight: '48px', fontSize: '30px', fontWeight: 700,
      letterSpacing: '.18em', padding: '0 18px 0 calc(18px + .18em)', color: C.red, border: `4px solid ${C.red}`,
      borderRadius: '8px', outline: `2px solid ${C.red}`, outlineOffset: '-10px', whiteSpace: 'nowrap',
    });
    return bubble;
  };

  // The Event History card: a white card, its header (the title, the three chips, card.chips, hidden until they land;
  // OUT OF THE AGENT'S REACH, card.outside) and its column heads band, then one row per event (card.rows)
  const makeCard = root => {
    const { w, h, headH, bandTop } = CARD;
    const { titleLeft, titleH, chipW, chipH, labelRight } = HEAD;
    const columnHead = (text, css) => `<div class="mono" style="position:absolute;top:${bandTop}px;`
      + `height:${headH - bandTop}px;line-height:${headH - bandTop}px;font-size:14px;letter-spacing:.14em;`
      + `color:${C.slateDark};${css}">${text}</div>`;
    const card = E(root,
      `<div class="mono" style="position:absolute;left:${titleLeft}px;top:0;height:${titleH}px;display:flex;`
      + `align-items:center;gap:10px;font-size:20px;letter-spacing:.14em;color:${C.bg}">`
      + `${ICON('book', 24, C.bg, 1.8)}EVENT HISTORY</div>`
      + `<div style="position:absolute;left:0;top:${bandTop}px;width:100%;height:${headH - bandTop}px;`
      + 'background:#EEF1F5"></div>'
      + columnHead('#', `left:${COL.num}px`) + columnHead('TIME', `left:${COL.time}px`)
      + columnHead('TYPE', `left:${COL.type}px`) + columnHead('EVENT', `left:${COL.event}px`)
      + columnHead('DETAILS', `left:${COL.detail}px`) + columnHead('RESULT', `right:${COL.result}px`),
      'paper', { width: w + 'px', height: h + 'px' });
    card.chips = QUESTIONS.map((q, i) => {
      const [x, y] = chipCenter(i);
      const left = x + w / 2 - chipW / 2, top = y + h / 2 - chipH / 2;
      card.insertAdjacentHTML('beforeend', typeChip(q.chip, left, top, chipW, chipH, 16));
      const chip = card.lastElementChild;
      chip.style.opacity = 0;
      return chip;
    });
    card.outside = E(card, "OUT OF THE AGENT'S REACH", 'mono', {
      left: 'auto', right: labelRight + 'px', top: (titleH - 36) / 2 + 'px', height: '36px', lineHeight: '32px',
      padding: '0 16px 0 calc(16px + .14em)', fontSize: '16px', letterSpacing: '.14em', color: C.uv,
      border: `2px solid ${C.uv}`, borderRadius: 'var(--rs)', whiteSpace: 'nowrap',
    });
    card.rows = ROWS.map((row, i) => makeRow(card, row, i));
    return card;
  };
  // A row of the card: its highlight band (row.band, the magnifier's), its red tint (row.tint, a linked outcome), its
  // cells (row.content, which slides in) and its result tag (row.tag, or null); the document's row also holds THE
  // CAUSE tag (row.cause), left of its FLAGGED tag
  const makeRow = (card, data, i) => {
    const { rowH } = CARD;
    const row = E(card, '', '', { left: 0, top: rowTop(i) + 'px', width: '100%', height: rowH + 'px', opacity: 1 });
    row.band = E(row, '', '', { left: 0, top: 0, width: '100%', height: rowH + 'px', background: C.highlight });
    row.tint = E(row, '', '', {
      left: 0, top: 0, width: '100%', height: rowH + 'px', background: `rgba(${RGB.red},.12)`,
      borderLeft: `4px solid ${C.red}`,
    });
    if (i < ROWS.length - 1) {
      E(row, '', '', { left: 0, top: (rowH - 1) + 'px', width: '100%', height: '1px', background: '#E2E8F0',
        opacity: 1 });
    }
    const cell = (left, font, color, html) => `<div class="mono" style="position:absolute;left:${left}px;top:0;`
      + `height:${rowH}px;line-height:${rowH}px;font-size:${font}px;color:${color};white-space:nowrap">${html}</div>`;
    const detailColor = data.type === 'DECIDED' ? C.uv : C.slateDark;
    row.content = E(row,
      cell(COL.num, 18, '#8A93A6', i + 1) + cell(COL.time, 18, C.slateDark, data.time)
      + typeChip(data.type, COL.type, (rowH - COL.typeH) / 2, COL.typeW, COL.typeH, 14)
      + cell(COL.event, 20, C.bg, eventHtml(data, 20)) + cell(COL.detail, 18, detailColor, data.detail),
      '', { left: 0, top: 0, width: '100%', height: rowH + 'px' });
    // a tag of font px, centered on the row, its right edge `right` px from the card's
    const tagAt = (tag, font, right) => makeResultTag(row.content, tag, font, {
      left: 'auto', right: right + 'px', top: (rowH - font - 12) / 2 + 'px', transformOrigin: 'right center',
    });
    row.tag = data.tag ? tagAt(data.tag, 16, COL.result) : null;
    if (i === 0) {
      const flaggedW = parseInt(row.tag.style.width, 10);
      row.cause = tagAt(TAGS.cause, 18, COL.result + flaggedW + 16);
    }
    return row;
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
      const top = rowCenterY(i) - CARD.rowH / 2;
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

  // The Workflows list window: the sidebar (official logo, menu with Workflows active) and the page: the heading (its
  // count, win.count), the search field (its placeholder, win.placeholder; the query, win.query, and the caret,
  // win.caret), the Search button (win.button), the table with one row per run (win.rows) and the caption
  // (win.caption) in the space the filter frees
  const makeWindow = root => {
    const { w, h, side, pad, pageW, contentW } = WIN;
    const at = (left, top) => `position:absolute;left:${left}px;top:${top}px;`;
    const navItem = (name, i) => {
      const active = name === 'Workflows';
      return `<div style="${at(12, 92 + i * 50)}width:${side - 24}px;height:42px;display:flex;align-items:center;`
        + `padding-left:16px;border-radius:6px;font-size:19px;background:${active ? UI.navActive : 'none'};`
        + `color:${active ? UI.link : UI.dim}">${name}</div>`;
    };
    const sidebar = `<div style="${at(0, 0)}width:${side}px;height:${h}px;background:${UI.panel};`
      + `box-shadow:inset -1px 0 0 ${UI.rule}"><img src="${LOGO}" style="${at(24, 26)}height:28px;display:block">`
      + ['Namespaces', 'Workflows', 'Schedules', 'Workers'].map(navItem).join('') + '</div>';
    const fieldW = contentW - LIST.buttonW - 16;
    const tableH = LIST.headH + RUNS.length * LIST.rowH;
    const columnHead = (left, text) => `<div style="${at(left, 0)}height:${LIST.headH}px;display:flex;`
      + `align-items:center;font-size:18px;font-weight:700">${text}</div>`;
    const win = E(root, sidebar
      + `<div class="page" style="${at(side, 0)}width:${pageW}px;height:${h}px">`
      + `<div style="${at(pad, LIST.headTop)}height:48px;display:flex;align-items:center;font-size:34px;`
      + 'font-weight:700"><span class="count"></span>&nbsp;Workflows</div>'
      + `<div style="${at(pad, LIST.searchTop)}width:${fieldW}px;height:${LIST.searchH}px;display:flex;`
      + `align-items:center;gap:14px;padding-left:18px;border-radius:4px;background:${UI.page};`
      + `box-shadow:inset 0 0 0 1px ${UI.fieldEdge}">${ICON('search', 22, UI.dim, 2)}`
      + `<span class="placeholder" style="font-size:20px;color:${UI.dim}">Filter Workflows</span>`
      + `<span class="mono query" style="font-size:22px;color:${UI.text};white-space:pre"></span>`
      + `<span class="caret" style="width:2px;height:28px;margin-left:-12px;background:${UI.link}"></span></div>`
      + `<div class="button" style="${at(pad + fieldW + 16, LIST.searchTop)}width:${LIST.buttonW}px;`
      + `height:${LIST.searchH}px;display:flex;align-items:center;justify-content:center;font-size:20px;`
      + `color:#FFFFFF;border-radius:4px;background:${UI.primary}">Search</div>`
      + `<div class="table" style="${at(pad, LIST.tableTop)}width:${contentW}px;height:${tableH}px;`
      + `background:${UI.panel};border-radius:6px;box-shadow:inset 0 0 0 1px ${UI.cardEdge};overflow:hidden">`
      + `<div style="${at(0, 0)}width:${contentW}px;height:${LIST.headH}px;background:${UI.head};`
      + `box-shadow:inset 0 -1px 0 ${UI.cardEdge}"></div>`
      + columnHead(LIST_COL.status, 'Status') + columnHead(LIST_COL.id, 'Workflow ID')
      + columnHead(LIST_COL.type, 'Type') + columnHead(LIST_COL.start, 'Start') + '</div></div>'
      // the window's edge, over its parts
      + `<div style="${at(0, 0)}width:${w}px;height:${h}px;border-radius:var(--r);`
      + `box-shadow:inset 0 0 0 1px ${C.line}"></div>`,
      '', { width: w + 'px', height: h + 'px', background: UI.page, borderRadius: 'var(--r)', overflow: 'hidden' });
    win.count = win.querySelector('.count');
    win.placeholder = win.querySelector('.placeholder');
    win.query = win.querySelector('.query');
    win.caret = win.querySelector('.caret');
    win.button = win.querySelector('.button');
    const table = win.querySelector('.table');
    win.rows = RUNS.map(run => makeRunRow(table, run));
    // the caption, centered in the three row slots the filter frees
    const freeTop = LIST.tableTop + LIST.headH + OTHERS.length * LIST.rowH + LIST.rowH;
    win.caption = E(win.querySelector('.page'),
      `${ICON('flag', 30, C.red, 2.2)}<span>every run that read it</span>`, '', {
        left: pad + 'px', top: (freeTop + (RUNS.length - OTHERS.length - 1) * LIST.rowH / 2 - 20) + 'px',
        width: contentW + 'px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '14px', fontSize: '30px', lineHeight: '40px', fontWeight: 600,
      });
    return win;
  };
  // A run's row in the table: its status badge, Workflow ID, type and start, a rule under it, a red tint (row.tint)
  // and its tag (row.tag: FLAGGED for another run that read the document, THIS RUN for the run of the Event History)
  const makeRunRow = (table, run) => {
    const { rowH } = LIST;
    const st = STATUS[run.status];
    const cell = (left, html, color = UI.text) => `<div style="position:absolute;left:${left}px;top:0;`
      + `height:${rowH}px;display:flex;align-items:center;font-size:20px;color:${color}">${html}</div>`;
    const link = text => `<span style="text-decoration:underline;text-underline-offset:4px;`
      + `text-decoration-thickness:1px">${text}</span>`;
    const row = E(table, '', '', { left: 0, top: 0, width: WIN.contentW + 'px', height: rowH + 'px',
      background: UI.panel });
    // at rest at half opacity: it flares to full as the run lights up
    row.tint = E(row, '', '', {
      left: 0, top: 0, width: '100%', height: rowH + 'px', background: `rgba(${RGB.red},.32)`,
      boxShadow: `inset 8px 0 0 ${C.red}`,
    });
    row.thisTint = E(row, '', '', {
      left: 0, top: 0, width: '100%', height: rowH + 'px', background: `rgba(${RGB.uv},.22)`,
      boxShadow: `inset 4px 0 0 ${C.uv}`,
    });
    E(row,
      `<div class="mono" style="position:absolute;left:${LIST_COL.status}px;top:${(rowH - 30) / 2}px;`
      + `width:${LIST_COL.badgeW}px;height:30px;line-height:30px;border-radius:15px;text-align:center;`
      + `font-size:15px;letter-spacing:.06em;text-transform:uppercase;color:${st.text};background:${st.bg};`
      + `box-shadow:inset 0 0 0 1.5px ${st.edge}">${run.status}</div>`
      + cell(LIST_COL.id, link(run.id), UI.link) + cell(LIST_COL.type, link('WorkAssistant'), UI.link)
      + cell(LIST_COL.start, `Oct 20, 2026, ${run.start}`)
      + `<div style="position:absolute;left:0;top:${rowH - 1}px;width:100%;height:1px;background:${UI.rule}"></div>`,
      '', { left: 0, top: 0, width: '100%', height: rowH + 'px', opacity: 1 });
    row.tag = null;
    if (run.read) {
      row.tag = makeResultTag(row, run.current ? TAGS.thisRun : TAGS.flagged, 18, {
        left: 'auto', right: LIST_COL.tag + 'px', top: (rowH - 30) / 2 + 'px', transformOrigin: 'right center',
      });
    }
    return row;
  };

  // The Workflows list at time t: the query types in, Search is pressed, the runs that did not read the document fade
  // and the others close up; THIS RUN marks the run of the Event History, the three others light up red as their
  // FLAGGED tag slams in (from 1.6x its size in 0.16 s), and the caption rises
  const placeWindow = (win, t, c) => {
    const c3 = c[3];
    place(win, WIN.x, WIN.y, 1, P(t, c3 + T3.whip, 0, linear));
    const typed = Math.round(QUERY.length * P(t, c3 + T3.type, T3.typeD, linear));
    setText(win.query, QUERY.slice(0, typed));
    win.placeholder.style.display = typed > 0 ? 'none' : '';
    // the caret blinks on the ambient clock while the field has focus, from the landing to the search
    const focused = t >= c3 + T3.whip + T3.whipD && t < c3 + T3.press;
    win.caret.style.opacity = focused && G % 1 < 0.6 ? 1 : 0;
    win.button.style.filter = `brightness(${(1 + 0.35 * bumpAt(t, c3 + T3.press)).toFixed(3)})`;
    const filtered = P(t, c3 + T3.filter, 0, linear);
    setText(win.count, String(filtered ? OTHERS.length + 1 : TOTAL_RUNS));
    const fade = P(t, c3 + T3.filter, 0.3);
    const close = P(t, c3 + T3.close, T3.closeD);
    RUNS.forEach((run, i) => {
      const row = win.rows[i];
      const slot = run.read ? lerp(i, run.to, close) : i;
      const top = LIST.headH + Math.round(slot * LIST.rowH);
      row.style.transform = `translateY(${top}px)`;
      row.style.opacity = run.read ? 1 : 1 - fade;
      row.style.visibility = run.read || fade < 1 ? 'visible' : 'hidden';
      if (!run.read) return;
      const litAt = run.current ? c3 + T3.thisRun : c3 + T3.others + OTHERS.indexOf(run) * T3.otherStep;
      if (run.current) {
        row.thisTint.style.opacity = P(t, litAt, 0.25);
        popScale(row.tag, popIn(t, litAt, 0.18));
        return;
      }
      // the red tint flares as the tag lands, then settles
      row.tint.style.opacity = (0.5 * P(t, litAt, 0.1) + 0.5 * bumpAt(t, litAt + 0.1)).toFixed(3);
      popScale(row.tag, { o: P(t, litAt, 0.08, linear), s: lerp(1.6, 1, P(t, litAt, 0.16, easeIn)) });
    });
    const caption = P(t, c3 + T3.caption, 0.5);
    win.caption.style.opacity = caption;
    win.caption.style.transform = `translateY(${Math.round((1 - caption) * 16)}px)`;
  };

  scene({
    chapter: 5, title: 'What went wrong?',
    sources: [
      {
        label: 'Help Net Security, October 2026',
        url: 'https://www.helpnetsecurity.com/2026/10/14/ciso-ai-agent-insider-risk/',
      },
      { label: 'Temporal docs', url: 'https://docs.temporal.io/search-attribute' },
    ],
    subs: [
      {
        text: "October 2026: in a survey of 600 security chiefs, 95% reported an incident tied to an AI agent "
          + "that year.",
      },
      {
        text: "Then come the questions: what did the agent read, decide and do? Its own account may be wrong.",
      },
      {
        text: "The <b>Event History</b> records each model call, tool call and approval, in order, "
          + "out of the agent's reach.",
      },
      // a hold on the four runs before the zoom-through into the recap
      {
        text: "Follow it back to the cause, then find every other run that read the same document.",
        after: 1.8,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      s.stat = makeStat(root);
      s.crowd = makeCrowd(root);
      s.agent = makeModelOrb(root, { x: AGENT.x, y: AGENT.y, size: AGENT.size, label: 'THE AGENT', seed: 2.1 });
      s.bubble = makeBubble(root);
      s.card = makeCard(root);
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
      s.win = makeWindow(root);
      // the flash covers the stage, outside the camera
      s.flash = makeFlash(stage);
    },
    update(t, c, s) {
      const { moves } = LENS_WALK;
      const lastMove = moves[moves.length - 1];
      const causeAt = c[3] + lastMove.at + lastMove.d;
      const beatAt = c[3] + T3.others;

      // the camera: the zoom-through in and out, at rest until the whip right to the Workflows list; THE CAUSE's
      // landing jolts it a little, the beat more
      const cam = shot(t, [CARD.x, 515, 1], [[c[3] + T3.whip, WIN.x, WIN.y, 1, T3.whipD]]);
      const [cx, cy] = shake(t, causeAt + 0.16, 6, 0.3);
      const [bx, by] = shake(t, beatAt, 10, 0.4);
      setCamera(s.cam, t, this.dur, { scale: cam.scale, dx: cam.dx + cx + bx, dy: cam.dy + cy + by });
      placeFlash(s.flash, t, beatAt, 0.22);

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

      // the agent pops in on the right, looking at the questions; its answer pops in above it, and the stamp slams
      // onto it with a jolt of the bubble; both slide out to the right as the card grows
      const agentOut = P(t, c[2] + T2.out, T2.outD);
      const agentPop = backPop(t, c[1] + T1.agent, 0.5);
      const agentDx = Math.round(80 * agentOut);
      place(s.agent.el, AGENT.x + agentDx, AGENT.y, agentPop.s, agentPop.o * (1 - agentOut));
      s.agent.set('idle', { look: AGENT.look });
      const bubblePop = backPop(t, c[1] + T1.bubble, 0.45);
      const stampAt = c[1] + T1.stamp;
      const jolt = Math.round(dampedShake(t, stampAt + 0.14, 8, 0.3, 4));
      place(s.bubble, BUBBLE.x + agentDx + jolt, BUBBLE.y, bubblePop.s, bubblePop.o * (1 - agentOut));
      const stampLand = P(t, stampAt, 0.14, easeIn);
      s.bubble.stamp.style.opacity = (0.92 * P(t, stampAt, 0.06, linear)).toFixed(3);
      s.bubble.stamp.style.transform = `rotate(-6deg) scale(${lerp(2.4, 1, stampLand).toFixed(4)})`;

      // the card grows from the middle; the questions pop in, swell as they are read, then fly into its header,
      // where their chips pop in
      const grow = P(t, c[2] + T2.grow, T2.growD, easeOut);
      const cardK = lerp(CARD.from, 1, grow);
      const whipped = P(t, c[3] + T3.whip + T3.whipD, 0, linear);
      place(s.card, CARD.x, CARD.y, cardK, clamp(grow * 3) * (1 - whipped));
      s.questions.forEach((tile, i) => {
        const pop = backPop(t, c[1] + T1.tiles + i * T1.tileStep, 0.5);
        const named = swell(t, c[1] + T1.named[i], 0.06);
        const flyAt = c[2] + T2.fly + i * T2.flyStep;
        const f = P(t, flyAt, T2.flyD);
        const [chipX, chipY] = chipCenter(i);
        const x = lerp(QUESTION.x0 + i * QUESTION.pitch, CARD.x + chipX * cardK, f);
        const y = lerp(QUESTION.y, CARD.y + chipY * cardK, f);
        const fade = 1 - P(t, flyAt + T2.flyD * 0.6, T2.flyD * 0.4);
        place(tile, x, y, pop.s * named * lerp(1, 0.3, f), pop.o * fade);
        popScale(s.card.chips[i], popIn(t, flyAt + T2.flyD * 0.85));
      });
      popScale(s.card.outside, popIn(t, c[2] + T2.outside, 0.2));

      // the rows slide in, in order, their tags just after; the magnifier's band lights the row under it, a linked
      // outcome keeps a red tint and its tag swells as the magnifier lands on it
      const lensRow = lensRowAt(t, c[3]);
      const lensPop = backPop(t, c[3] + T3.lens, 0.35);
      const lensOn = lensPop.o * (1 - whipped);
      const arrivals = new Map(moves.map(move => [move.to, c[3] + move.at + move.d]));
      s.card.rows.forEach((row, i) => {
        const at = c[2] + T2.rows + i * T2.step;
        showRow(row.content, P(t, at, 0.35), 26, true);
        row.band.style.opacity = (lensOn * clamp(1 - Math.abs(lensRow - i))).toFixed(3);
        const arrival = arrivals.get(i);
        row.tint.style.opacity = arrival === undefined ? 0 : P(t, arrival, 0.3);
        if (row.tag) {
          const pop = popIn(t, at + T2.tag);
          const visited = arrival === undefined ? 1 : swell(t, arrival, 0.12);
          popScale(row.tag, { o: pop.o, s: pop.s * visited });
        }
      });

      // THE CAUSE slams onto the document's row and red rings spread from it
      const cause = s.card.rows[0].cause;
      cause.style.opacity = P(t, causeAt, 0.08, linear);
      cause.style.transform = `scale(${lerp(1.8, 1, P(t, causeAt, 0.16, easeIn)).toFixed(4)})`;
      const causeRight = CARD.x + CARD.w / 2 - parseInt(cause.style.right, 10);
      const causeX = causeRight - parseInt(cause.style.width, 10) / 2;
      placeRipples(s.ripples, t, causeAt + 0.16, causeX, rowCenterY(0), 60, 320, { d: 0.8, step: 0.16 });

      // the magnifier walks back up the rows; a pin lands on each outcome it stops at, and the thread draws from the
      // previous pin as it moves, then glows once the cause is found
      placeLens(s.lens, rowCenterY(0) + lensRow * CARD.rowH, { s: lensPop.s, o: lensOn });
      moves.forEach((move, k) => {
        const pin = popIn(t, c[3] + move.at + move.d, 0.4);
        place(s.pins[k], THREAD.x, rowCenterY(move.to), pin.s, pin.o * (1 - whipped));
        if (k === 0) return;
        draw(s.arcs[k - 1], P(t, c[3] + move.at, move.d, linear), 1 - whipped);
      });
      const glow = P(t, causeAt + 0.16, 0.3);
      s.svg.style.filter = glow > 0 ? `drop-shadow(0 0 6px rgba(${RGB.red},${(0.8 * glow).toFixed(3)}))` : 'none';

      // the Workflows list, one screen to the right, shows as the whip starts
      placeWindow(s.win, t, c);
    },
  });
}
