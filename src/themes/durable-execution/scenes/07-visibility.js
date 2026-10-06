// ===================== 7. FULL VISIBILITY
// The Temporal Web UI in dark mode, as it shows the placeOrder Workflows: the Workflows list (running, completed,
// failed), the order-1042 page and its Timeline (every Activity, how long it took, the retry and, as a video
// annotation, the crash before it), then the order-1045 page, running, whose Pending Activities tab shows
// shipPackage retrying live until it completes. Structure, wording and colors follow the real Web UI (2.54.1), with
// fewer columns, fields and menu items so the text stays readable on video.
// The block keeps every name declared in this file local to this scene.
{
  // Window: 1560 x 770, centered at (960, 522) (x 180..1740, y 137..907). As in the real UI, a full-height sidebar
  // on the left and a top bar over the page area, where the pages swap like a navigation. Every part is laid out on
  // whole pixels inside its parent, so the text rests sharp.
  const WIN = { x: 960, y: 522, w: 1560, h: 770, side: 240, bar: 64 };
  const PAGE = { w: WIN.w - WIN.side, h: WIN.h - WIN.bar, pad: 44 }; // 1320 x 706
  const CONTENT_W = PAGE.w - 2 * PAGE.pad; // 1232: headers, tables and cards span x 44..1276 of the page

  // Colors sampled from the real Web UI (dark mode)
  const UI = {
    page: '#111111', panel: '#191919', head: '#222222', altRow: '#1D1D1D', hover: '#272727',
    rule: '#343332', cardEdge: '#2E2D2C', fieldEdge: '#43403F',
    text: '#FBFBFA', dim: '#C3C2BB', link: '#8DA4EF', navActive: '#1C202D',
    primary: '#3A5BC7', outline: '#334CA2', tabLine: '#3952A8',
    chip: '#2A2A2A', chipEdge: '#504D4C', json: '#1E1E1E', jsonEdge: '#4A4746',
    green: '#30A46C', greenEdge: '#218358', startIcon: '#84A7F0', startEdge: '#4E6084', retryIcon: '#EDF2FE',
  };
  // Status badges: small, fully rounded, mono uppercase, a thin border
  const STATUS = {
    running: { text: '#8EC8F6', bg: '#113264', edge: '#0574D1' },
    completed: { text: '#8ECEAA', bg: '#193B2D', edge: '#298459' },
    failed: { text: '#F4A9AA', bg: '#641723', edge: '#BF3940' },
    scheduled: { text: UI.text, bg: UI.chip, edge: UI.chipEdge },
  };
  STATUS.started = STATUS.running;

  // Web UI line icons (24 grid, round joins like the real ones)
  const UI_ICONS = {
    namespaces: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
    workflows: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/>'
      + '<path d="M9 6h5a2 2 0 0 1 2 2v7M3 13v6a2 2 0 0 0 2 2h6"/>',
    schedules: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2.5"/>',
    batch: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    workers: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1'
      + 'M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    nexus: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/>',
    archive: '<rect x="3" y="4" width="18" height="5" rx="1"/>'
      + '<path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4"/>',
    docs: '<path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3zM21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"/>',
    feedback: '<path d="M12 20s-8-4.7-8-10.2A4.3 4.3 0 0 1 12 7.5a4.3 4.3 0 0 1 8 2.3C20 15.3 12 20 12 20z"/>',
    namespace: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 3.5v5"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    chevronDown: '<path d="M6 9l6 6 6-6"/>',
    chevronLeft: '<path d="M15 5l-7 7 7 7"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v5h5"/>',
    all: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>'
      + '<path d="M14 6.5h7M14 17.5h7"/>',
    failures: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
    running: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    today: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    sort: '<path d="M4 6h9M4 12h6M4 18h3M17 5v14M14 16l3 3 3-3"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
    pause: '<path d="M9 5v14M15 5v14"/>',
    pencil: '<path d="M4 20l4-1 11-11-3-3L5 16z"/>',
    // glyph of the small squares at the ends of the timeline bars
    activity: '<path d="M6 17c0-5 4-5 6-5s6 0 6-5"/><circle cx="6" cy="17" r="1.5"/><circle cx="18" cy="7" r="1.5"/>',
  };
  const uiIcon = (name, size, color, width = 1.8) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" `
    + `fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" `
    + `style="display:block;flex:none">${UI_ICONS[name]}</svg>`;

  // The data: six placeOrder Workflows, as the list sorts them; times are seconds of the day on Oct 5, 2026
  const WORKFLOWS = [
    { id: 'order-1045', status: 'running', run: '01a10e5e-6e11-75dc…', start: 14 * 3600 + 6 * 60 + 48 },
    { id: 'order-1044', status: 'completed', run: '01a10e5e-38b7-7e73…', start: 14 * 3600 + 5 * 60 + 30 },
    { id: 'order-1043', status: 'completed', run: '01a10e5e-32d7-7d4a…', start: 14 * 3600 + 4 * 60 + 2 },
    { id: 'order-1042', status: 'completed', run: '01a10e5d-c32e-7b79…', start: 14 * 3600 + 2 * 60 + 11 },
    { id: 'order-1040', status: 'completed', run: '01a10e5d-9f65-77eb…', start: 14 * 3600 + 37 },
    { id: 'order-1041', status: 'failed', run: '01a10e5d-a545-7f0b…', start: 13 * 3600 + 59 * 60 + 20 },
  ];
  const workflow = id => WORKFLOWS.find(row => row.id === id);
  const OPENED_ROW = WORKFLOWS.findIndex(row => row.id === 'order-1042');
  const COUNTED = ['running', 'completed', 'failed']; // order of the count pills next to the heading

  // "Oct 5, 2026, 2:06:48 PM" for a second of the day
  const dateTime = daySeconds => {
    const s = Math.floor(daySeconds);
    const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, sec = s % 60;
    const pad = n => String(n).padStart(2, '0');
    return `Oct 5, 2026, ${(h + 11) % 12 + 1}:${pad(m)}:${pad(sec)} ${h < 12 ? 'AM' : 'PM'}`;
  };
  // "10/5/26, 2:02:11 PM", the short form on the timeline's start and end lines
  const shortDateTime = daySeconds => dateTime(daySeconds).replace('Oct 5, 2026,', '10/5/26,');
  // "14s 612ms", the Web UI's duration format
  const duration = seconds => {
    const ms = Math.round(seconds * 1000);
    return `${Math.floor(ms / 1000)}s ${ms % 1000}ms`;
  };

  // Order #1042, as in chapter 6: Worker A crashes while shipPackage runs; attempt 1 times out after the
  // 10 seconds of its startToCloseTimeout (chapter 4) and attempt 2 starts on worker-b after the 1 s retry
  // interval, then emailReceipt runs. Seconds from the Workflow start; the Activities in step order (chargeCard
  // first).
  const ORDER_1042 = {
    ...workflow('order-1042'), runtime: 16.112, historySize: '3.01 KB', transitions: 17,
    activities: [
      { from: 0.2, to: 1.4 },
      { from: 1.5, to: 2.3 },
      { from: 2.4, retryAt: 13.4, to: 15.5, attempts: 2 },
      { from: 15.6, to: 16.0 },
    ],
  };
  // Order #1045, running: shipPackage times out against the carrier twice and is retried after 1s, then 2s (the
  // default retry policy of chapter 4); attempt 3 succeeds, then emailReceipt runs and the Workflow completes
  const ORDER_1045 = {
    ...workflow('order-1045'), historySize: '1.79 KB', transitions: 19,
    attempts: [{ from: 2.3, to: 3.3 }, { from: 4.3, to: 5.3 }, { from: 7.3, to: 9.4 }], // the last one succeeds
    finishedAt: 10.04,
  };
  // c[2] plays order #1045 live, in real time, from second 2.3 of its run (chargeCard and reserveItem done)
  const LIVE_FROM = 2.3;

  // inline style of an absolutely positioned static part (plain div in its parent's HTML)
  const at = (left, top) => `position:absolute;left:${left}px;top:${top}px;`;
  // a part that update() changes, positioned on whole pixels inside its parent and visible
  const part = (parent, html, css = {}, cls = '') => {
    const e = E(parent, html, cls, css);
    e.style.opacity = 1;
    return e;
  };
  const link = text => `<span style="text-decoration:underline;text-underline-offset:4px;`
    + `text-decoration-thickness:1px">${text}</span>`;
  // a small rounded count next to a tab name, e.g. Event History (29)
  const countChip = n => `<span class="mono n" style="display:inline-flex;align-items:center;justify-content:center;`
    + `min-width:28px;height:26px;padding:0 8px;border-radius:13px;background:${UI.chip};font-size:15px;`
    + `color:${UI.text}">${n}</span>`;
  // a button: primary (filled) or outlined, with an icon before its text and/or one after it (a dropdown chevron)
  const button = (text, { icon = null, after = null, primary = false } = {}) => {
    const color = primary ? '#FFFFFF' : UI.link;
    const look = primary ? `background:${UI.primary}`
      : `background:${UI.panel};box-shadow:inset 0 0 0 1.5px ${UI.outline}`;
    return `<div style="height:46px;display:flex;align-items:center;gap:10px;padding:0 20px;font-size:19px;`
      + `border-radius:4px;white-space:nowrap;color:${color};${look}">`
      + (icon ? uiIcon(icon, 20, color, 2) : '') + `<span>${text}</span>` + (after ? uiIcon(after, 20, color, 2) : '')
      + '</div>';
  };

  // ---------- status badge: a fixed width (centered text) keeps the edges, and the title next to it, in place
  // when the status changes; innerHTML only changes with the status (pop: a bumpAt() bump)
  const BADGE_H = 30;
  const badgeCss = width => ({
    position: 'relative', height: BADGE_H + 'px', display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', padding: '0 13px', borderRadius: BADGE_H / 2 + 'px', fontSize: '15px',
    letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', flex: 'none',
    ...(width ? { width: width + 'px' } : {}),
  });
  const makeBadge = (parent, status = null, width = null, css = {}) => {
    const e = part(parent, '', { ...badgeCss(width), ...css }, 'mono');
    if (status) setBadge(e, status);
    return e;
  };
  const setBadge = (e, status, pop = 0) => {
    if (e._status !== status) {
      e._status = status;
      const st = STATUS[status];
      e.textContent = status;
      e.style.color = st.text;
      e.style.background = st.bg;
      e.style.boxShadow = `inset 0 0 0 1.5px ${st.edge}`;
    }
    e.style.transform = `scale(${1 + 0.12 * pop})`;
  };

  // ---------- window chrome: sidebar (official logo, menu, Feedback) and top bar (namespace, cluster, avatar)
  const NAV = ['Namespaces', 'Workflows', 'Schedules', 'Batch', 'Workers', 'Nexus', 'Archive', 'Docs'];
  const NAV_TOP = 108, NAV_PITCH = 50;
  const makeWindow = root => {
    const navItem = (name, top, active = false) => `<div style="${at(12, top)}width:${WIN.side - 24}px;height:42px;`
      + `display:flex;align-items:center;gap:14px;padding-left:14px;border-radius:6px;font-size:20px;`
      + `background:${active ? UI.navActive : 'none'};color:${active ? UI.link : UI.dim}">`
      + `${uiIcon(name.toLowerCase(), 22, active ? UI.link : UI.dim)}${name}</div>`;
    const navRule = top => `<div style="${at(12, top)}width:${WIN.side - 24}px;height:1px;`
      + `background:${UI.rule}"></div>`;
    // the real menu sets Archive and Docs apart between two rules
    const archiveAt = NAV.indexOf('Archive');
    const navTop = i => NAV_TOP + i * NAV_PITCH + (i >= archiveAt ? 12 : 0);
    const nav = NAV.map((name, i) => navItem(name, navTop(i), name === 'Workflows')).join('')
      + navRule(navTop(archiveAt) - 10) + navRule(navTop(NAV.length - 1) + NAV_PITCH + 2);
    const sidebar = `<div style="${at(0, 0)}width:${WIN.side}px;height:${WIN.h}px;background:${UI.panel};`
      + `box-shadow:inset -1px 0 0 ${UI.rule}">`
      + `<img src="${LOGO}" style="${at(22, 24)}height:32px;display:block">`
      + `<div style="${at(158, 24)}height:32px;display:flex;align-items:center;font-size:17px;font-weight:700">`
      + 'Web UI</div>'
      + nav + navItem('Feedback', WIN.h - 72) + '</div>';
    const topBar = `<div style="${at(WIN.side, 0)}width:${PAGE.w}px;height:${WIN.bar}px;background:${UI.panel};`
      + `box-shadow:inset 0 -1px 0 ${UI.rule}">`
      + `<div style="${at(PAGE.pad, 10)}width:320px;height:44px;display:flex;align-items:center;border-radius:4px;`
      + `box-shadow:inset 0 0 0 1px ${UI.fieldEdge}">`
      + `<div style="flex:1;display:flex;align-items:center;gap:12px;padding-left:14px;font-size:20px">`
      + `${uiIcon('namespace', 20, UI.text)}default</div>`
      + `<div style="width:48px;height:44px;display:flex;align-items:center;justify-content:center;`
      + `box-shadow:inset 1px 0 0 ${UI.fieldEdge}">${uiIcon('external', 16, UI.dim)}</div></div>`
      + `<div style="position:absolute;right:${PAGE.pad}px;top:10px;height:44px;display:flex;align-items:center;`
      + `gap:34px;font-size:20px;color:${UI.dim}">`
      + `<div style="display:flex;align-items:center;gap:10px">${uiIcon('schedules', 22, UI.dim)}local`
      + `${uiIcon('chevronDown', 20, UI.dim)}</div>`
      + `<div style="width:36px;height:36px;border-radius:50%;background:radial-gradient(circle at 35% 30%,`
      + `#E4E7F5,#9AA3D0 45%,#5A63A8)"></div></div></div>`;
    return E(root, sidebar + topBar, '', {
      width: WIN.w + 'px', height: WIN.h + 'px', background: UI.page, borderRadius: 'var(--r)', overflow: 'hidden',
    });
  };
  // the window's edge, drawn over its pages (a border on the window would shift its parts off whole pixels)
  const makeFrame = win => part(win, '', {
    width: WIN.w + 'px', height: WIN.h + 'px', borderRadius: 'var(--r)', boxShadow: `inset 0 0 0 1.5px ${C.line}`,
  });
  // a page of the window, right of the sidebar and under the top bar (hidden until update shows it)
  const makePage = win => E(win, '', '', {
    left: WIN.side + 'px', top: WIN.bar + 'px', width: PAGE.w + 'px', height: PAGE.h + 'px',
  });

  // ---------- Workflows list page: heading, count pills and Start Workflow, then one card holding the filter tabs,
  // the table and its footer
  const LIST = { headTop: 26, cardTop: 104, tabsH: 60, headH: 50, rowH: 66, footH: 56 };
  const COL = { status: 24, id: 220, run: 420, type: 700, start: 920 }; // left edge of each column, in the card
  const ROWS_TOP = LIST.tabsH + LIST.headH;
  const makeListPage = win => {
    const page = makePage(win);
    const cardH = ROWS_TOP + WORKFLOWS.length * LIST.rowH + LIST.footH;
    const filters = [['all', 'All'], ['failures', 'Failures'], ['running', 'Running'], ['today', 'Today'],
      ['schedules', 'Last 1h']].map(([icon, text], i) => `<div style="height:40px;display:flex;align-items:center;`
      + `gap:10px;padding:0 14px;border-radius:4px;${i === 0 ? `background:${UI.head};` : ''}">`
      + `${uiIcon(icon, 20, UI.dim)}${text}</div>`).join('');
    const heads = [['status', 'Status'], ['id', 'Workflow ID'], ['run', 'Run ID'], ['type', 'Type'],
      ['start', 'Start']].map(([col, text]) => `<div style="${at(COL[col], LIST.tabsH)}height:${LIST.headH}px;`
      + `display:flex;align-items:center;font-size:18px;font-weight:700">${text}</div>`).join('');
    page.innerHTML =
      `<div class="head" style="${at(PAGE.pad, LIST.headTop)}height:52px;display:flex;align-items:center;gap:24px">`
      + `<span style="font-size:36px;font-weight:700">${WORKFLOWS.length} Workflows</span>`
      + `<span style="display:flex;align-items:center;gap:8px;font-size:18px;color:${UI.dim}">`
      + `${uiIcon('refresh', 18, UI.dim, 2)}Refresh</span></div>`
      + `<div style="position:absolute;right:${PAGE.pad}px;top:${LIST.headTop + 3}px">`
      + `${button('Start Workflow', { primary: true })}</div>`
      + `<div class="table" style="${at(PAGE.pad, LIST.cardTop)}width:${CONTENT_W}px;height:${cardH}px;`
      + `background:${UI.panel};border-radius:6px;box-shadow:inset 0 0 0 1px ${UI.cardEdge};overflow:hidden">`
      + `<div style="${at(10, 10)}display:flex;gap:6px;font-size:18px;color:${UI.dim}">${filters}</div>`
      + `<div style="${at(0, LIST.tabsH)}width:${CONTENT_W}px;height:${LIST.headH}px;background:${UI.head};`
      + `box-shadow:inset 0 1px 0 ${UI.cardEdge},inset 0 -1px 0 ${UI.cardEdge}"></div>${heads}`
      + `<div style="${at(0, cardH - LIST.footH)}width:${CONTENT_W}px;height:${LIST.footH}px;display:flex;`
      + `align-items:center;justify-content:flex-end;padding-right:24px;font-size:18px;`
      + `box-shadow:inset 0 1px 0 ${UI.rule}">1–${WORKFLOWS.length} of ${WORKFLOWS.length}</div></div>`;
    // count pills, bumped as the subtitle names each status
    const head = page.querySelector('.head');
    page.counts = Object.fromEntries(COUNTED.map(status => {
      const n = WORKFLOWS.filter(row => row.status === status).length;
      const st = STATUS[status];
      return [status, part(head, `${n} ${status}`, {
        position: 'relative', height: '30px', display: 'flex', alignItems: 'center', padding: '0 10px',
        fontSize: '16px', letterSpacing: '.04em', textTransform: 'uppercase', color: st.text, background: st.bg,
        boxShadow: `inset 0 0 0 1.5px ${st.edge}`, borderRadius: '4px', whiteSpace: 'nowrap',
      }, 'mono')];
    }));
    const card = page.querySelector('.table');
    page.rows = WORKFLOWS.map((row, i) => {
      const cell = (col, html) => `<div style="${at(COL[col], 0)}height:${LIST.rowH}px;display:flex;`
        + `align-items:center">${html}</div>`;
      const e = part(card,
        cell('id', `<span class="id">${link(row.id)}</span>`) + cell('run', link(row.run))
        + cell('type', link('placeOrder')) + cell('start', dateTime(row.start)),
        { top: (ROWS_TOP + i * LIST.rowH) + 'px', width: CONTENT_W + 'px', height: LIST.rowH + 'px',
          fontSize: '20px' });
      e.base = i % 2 ? UI.altRow : UI.panel;
      e.idCell = e.querySelector('.id');
      e.badge = makeBadge(e, row.status, null, {
        position: 'absolute', left: COL.status + 'px', top: (LIST.rowH - BADGE_H) / 2 + 'px',
      });
      e.status = row.status;
      return e;
    });
    return page;
  };

  // ---------- Workflow page: Back to Workflows, badge + title + actions, summary, tabs; then the tab content
  const DETAILS = { backTop: 24, titleTop: 66, summaryTop: 140, summaryPitch: 34, tabsTop: 252, contentTop: 318 };
  const TITLE_BADGE_W = 136; // fits COMPLETED, so RUNNING and COMPLETED badges share their edges
  const SUMMARY_COLS = [{ label: 0, value: 110 }, { label: 440, value: 590 }, { label: 870, value: 1032 }];
  const ACTION = { running: 'Request Cancellation', completed: 'Reset' }; // the primary action, by status
  const TABS = ['Timeline', 'Event History', 'Workers', 'Pending Activities'];
  const makeDetailsPage = (win, order, activeTab, counts) => {
    const page = makePage(win);
    const field = (col, row, label, value, cls = '') => {
      const top = DETAILS.summaryTop + row * DETAILS.summaryPitch;
      return `<div style="${at(PAGE.pad + SUMMARY_COLS[col].label, top)}height:28px;display:flex;align-items:center;`
        + `font-size:18px;color:${UI.dim}">${label}</div>`
        + `<div class="${cls}" style="${at(PAGE.pad + SUMMARY_COLS[col].value, top)}height:28px;display:flex;`
        + `align-items:center;font-size:20px;white-space:nowrap">${value}</div>`;
    };
    const mono = text => `<span class="mono">${text}</span>`;
    const tabs = TABS.map(name => {
      const active = name === activeTab;
      const count = name in counts ? countChip(counts[name]) : '';
      return `<div class="tab" style="position:relative;height:44px;display:flex;align-items:center;gap:10px;`
        + `color:${active ? UI.text : UI.dim};${active ? `box-shadow:inset 0 -3px 0 ${UI.tabLine}` : ''}">`
        + `${name}${count}</div>`;
    }).join('');
    page.innerHTML =
      `<div style="${at(PAGE.pad, DETAILS.backTop)}height:26px;display:flex;align-items:center;gap:10px;`
      + `font-size:18px">${uiIcon('chevronLeft', 18, UI.text, 2)}${link('Back to Workflows')}</div>`
      + `<div class="title" style="${at(PAGE.pad, DETAILS.titleTop)}height:52px;display:flex;align-items:center;`
      + `gap:18px"><span style="font-size:36px;font-weight:700">${order.id}</span></div>`
      + `<div class="actions" style="position:absolute;right:${PAGE.pad}px;top:${DETAILS.titleTop + 3}px;`
      + 'display:flex;gap:12px">' + button(ACTION[order.status], { primary: true })
      + button('More Actions', { after: 'chevronDown' }) + '</div>'
      + field(0, 0, 'Start', mono(dateTime(order.start))) + field(0, 1, 'End', '', 'end mono')
      + field(0, 2, 'Duration', '', 'duration mono')
      + field(1, 0, 'Run ID', mono(order.run)) + field(1, 1, 'Workflow Type', link('placeOrder'))
      + field(1, 2, 'Task Queue', link('orders'))
      + field(2, 0, 'History Size', mono(order.historySize)) + field(2, 1, 'State Transitions', mono(order.transitions))
      + field(2, 2, 'Workflow SDK', 'TypeScript')
      + `<div style="${at(PAGE.pad, DETAILS.tabsTop)}width:${CONTENT_W}px;height:46px;display:flex;gap:34px;`
      + `font-size:20px;box-shadow:inset 0 -1px 0 ${UI.cardEdge}">${tabs}</div>`;
    page.badge = makeBadge(page.querySelector('.title'), order.status, TITLE_BADGE_W, { order: '-1' });
    page.action = page.querySelector('.actions span');
    page.end = page.querySelector('.end');
    page.duration = page.querySelector('.duration');
    page.tabCount = name => page.querySelectorAll('.tab')[TABS.indexOf(name)].querySelector('.n');
    return page;
  };

  // ---------- Timeline tab of order #1042: heading and buttons, then the chart card. As in the real chart: a
  // white start line and end line (with their date, vertical), a time axis, the Workflow bar on top, then one lane
  // per Activity, the latest on top; each bar has a small square at each end and its name beside it.
  const CHART = { top: DETAILS.contentTop + 56, h: 300, line: 52, wfTop: 22, barH: 22, laneTop: 72, lanePitch: 42,
    axisY: 240, tickTop: 254, tick: 2 };
  const chartX0 = CHART.line + 4, chartX1 = CONTENT_W - CHART.line - 4;
  const secX = s => Math.round(chartX0 + s * (chartX1 - chartX0) / ORDER_1042.runtime);
  const laneTop = step => CHART.laneTop + (ORDER_STEPS.length - 1 - step) * CHART.lanePitch;
  const SQUARE = 22;
  const LABEL_ROOM = 220; // room right of a bar for its label, else the label goes left of the bar
  const CRASH_MARK = 6.8; // second of the retried band where the crash leader ends, just past the band's label
  // the small square at a bar end: blue at a start, green at a completion, white at a retried start
  const SQUARES = {
    start: { bg: UI.startIcon, edge: UI.startEdge, glyph: '#141924' },
    end: { bg: UI.green, edge: UI.greenEdge, glyph: '#0E2A1C' },
    retry: { bg: UI.retryIcon, edge: '#83858B', glyph: '#141924' },
  };
  const makeSquare = (chart, kind, left, top, glyph = 'activity') => part(chart,
    uiIcon(glyph, 14, SQUARES[kind].glyph, 2), {
    left: left + 'px', top: top + 'px', width: SQUARE + 'px', height: SQUARE + 'px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', borderRadius: '4px', background: SQUARES[kind].bg,
    boxShadow: `inset 0 0 0 1.5px ${SQUARES[kind].edge}`,
  });
  // a bar from second `from`, grown by setBar; its background keeps its full width, so a gradient never stretches
  const makeBar = (chart, top, from, to, background) => {
    const full = secX(to) - secX(from);
    const e = part(chart, '', {
      left: secX(from) + 'px', top: top + 'px', height: CHART.barH + 'px', width: '0', background,
      backgroundSize: `${full}px 100%`, backgroundRepeat: 'no-repeat',
    });
    e.full = full;
    return e;
  };
  const setBar = (bar, p) => {
    bar.style.width = Math.round(clamp(p) * bar.full) + 'px';
    bar.style.opacity = p > 0 ? 1 : 0;
  };
  const activityLabel = (name, seconds) => `<span>${name}</span><span class="mono" style="font-size:17px;`
    + `color:${UI.dim}">${seconds.toFixed(1)}s</span>`;
  const labelCss = (left, top) => ({
    left: left + 'px', top: top + 'px', height: CHART.barH + 'px', display: 'flex', alignItems: 'center', gap: '10px',
    fontSize: '20px', whiteSpace: 'nowrap',
  });

  const makeTimelineTab = page => {
    const order = ORDER_1042;
    const head = `<div style="${at(PAGE.pad, DETAILS.contentTop)}height:40px;display:flex;align-items:center;`
      + `gap:12px"><span style="font-size:28px;font-weight:700">Timeline</span>${uiIcon('info', 22, UI.dim)}</div>`
      + `<div style="position:absolute;right:${PAGE.pad}px;top:${DETAILS.contentTop - 2}px;height:44px;display:flex;`
      + `border-radius:4px;box-shadow:inset 0 0 0 1px ${UI.fieldEdge};font-size:18px">`
      + [['sort', 'Descending'], ['filter', 'Filter'], ['download', 'Download']].map(([icon, text], i) =>
        `<div style="display:flex;align-items:center;gap:10px;padding:0 18px;`
        + `${i ? `box-shadow:inset 1px 0 0 ${UI.fieldEdge}` : ''}">${uiIcon(icon, 20, UI.text)}${text}</div>`).join('')
      + '</div>';
    page.insertAdjacentHTML('beforeend', head);

    // static frame of the chart: grid lines and tick labels, start and end lines with their date, the axis
    let html = '';
    for (let s = CHART.tick; s < order.runtime; s += CHART.tick) {
      html += `<div style="${at(secX(s), 12)}width:1px;height:${CHART.axisY - 12}px;background:${UI.head}"></div>`
        + `<div class="mono" style="${at(secX(s) - 30, CHART.tickTop)}width:60px;text-align:center;font-size:16px;`
        + `line-height:20px;color:${UI.dim}">${s}s</div>`;
    }
    const endLine = (left, daySeconds) => `<div style="${at(left, 12)}width:4px;height:${CHART.axisY - 8}px;`
      + `background:${UI.text}"></div>`
      + `<div style="${at(left < CONTENT_W / 2 ? 14 : CONTENT_W - 38, 16)}writing-mode:vertical-rl;font-size:15px;`
      + `line-height:24px;white-space:nowrap">${shortDateTime(daySeconds)}</div>`;
    html += endLine(CHART.line, order.start) + endLine(chartX1, order.start + order.runtime)
      + `<div style="${at(CHART.line, CHART.axisY)}width:${chartX1 + 4 - CHART.line}px;height:4px;`
      + `background:${UI.text}"></div>`;
    const chart = part(page, html, {
      left: PAGE.pad + 'px', top: CHART.top + 'px', width: CONTENT_W + 'px', height: CHART.h + 'px',
      background: UI.panel, borderRadius: '6px', boxShadow: `inset 0 0 0 1px ${UI.rule}`,
    });

    // the Workflow bar, then each Activity: bar, squares, label
    const tl = { chart };
    tl.workflow = {
      bar: makeBar(chart, CHART.wfTop, 0, order.runtime, UI.green),
      start: makeSquare(chart, 'end', chartX0 - SQUARE / 2, CHART.wfTop, 'workflows'),
      end: makeSquare(chart, 'end', chartX1 - SQUARE / 2, CHART.wfTop, 'workflows'),
    };
    tl.activities = order.activities.map((act, step) => {
      const top = laneTop(step);
      const fn = ORDER_STEPS[step].fn;
      const lane = { act };
      // bars first, then their squares over them
      const endSquare = () => makeSquare(chart, 'end', secX(act.to) - SQUARE, top);
      if (act.retryAt === undefined) {
        lane.bar = makeBar(chart, top, act.from, act.to, UI.green);
        lane.start = makeSquare(chart, 'start', secX(act.from), top);
        lane.end = endSquare();
        // the label sits right of the bar, or left of it near the end line (emailReceipt)
        const fits = secX(act.to) + LABEL_ROOM < chartX1;
        const side = fits ? { left: secX(act.to) + 14 + 'px' }
          : { left: 'auto', right: CONTENT_W - secX(act.from) + 14 + 'px' };
        lane.label = part(chart, activityLabel(fn, act.to - act.from), { ...labelCss(0, top), ...side });
        return lane;
      }
      // a retried Activity: a faded band from the first start (red where the failed attempt ran) to the start of
      // the last attempt, then that attempt, bright, from red to green; the label sits on the band's start
      lane.band = makeBar(chart, top, act.from, act.retryAt,
        'linear-gradient(90deg,#6E2E2E,#62302E 45%,#3A3C31 78%,#254735)');
      lane.bar = makeBar(chart, top, act.retryAt, act.to, 'linear-gradient(90deg,#CA5551,#87785D 40%,#449A68 75%,'
        + `${UI.green})`);
      lane.start = makeSquare(chart, 'retry', secX(act.from), top);
      lane.restart = makeSquare(chart, 'start', secX(act.retryAt), top);
      lane.end = endSquare();
      lane.label = part(chart,
        `${uiIcon('refresh', 18, UI.text, 2.2)}<span>${act.attempts} • ${fn}</span>`
        + `<span class="mono" style="font-size:17px;color:${UI.dim}">${(act.to - act.from).toFixed(1)}s</span>`,
        { ...labelCss(secX(act.from) + SQUARE + 4, top), gap: '8px', padding: '0 10px 0 6px',
          background: UI.panel, borderRadius: CHART.barH / 2 + 'px' });
      return lane;
    });

    // the crash, a video annotation outside the UI style: a brand red pill in the free room under the band, its
    // leader line ending on the band's red start, just past the label
    const target = { x: secX(CRASH_MARK), y: laneTop(2) + CHART.barH };
    const pill = { left: target.x + 64, top: laneTop(1) + 12 };
    tl.crashPill = part(chart, 'Worker A crashed · retried on Worker B', {
      left: pill.left + 'px', top: pill.top + 'px', height: '40px', display: 'flex', alignItems: 'center',
      padding: '0 16px 0 calc(16px + .1em)', fontSize: '17px', letterSpacing: '.1em', textTransform: 'uppercase',
      color: C.red, background: '#331D1E', boxShadow: `inset 0 0 0 1.5px ${C.red}`, borderRadius: 'var(--rs)',
      whiteSpace: 'nowrap', transformOrigin: 'left center',
    }, 'mono');
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('width', CONTENT_W);
    svg.setAttribute('height', CHART.h);
    svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
    const lineY = pill.top + 20;
    svg.innerHTML = `<circle cx="${target.x}" cy="${target.y}" r="4" fill="${C.red}"/>`
      + `<path d="M ${target.x} ${target.y} L ${target.x} ${lineY} L ${pill.left} ${lineY}" fill="none" `
      + `stroke="${C.red}" stroke-width="2"/>`;
    tl.leader = part(chart, '', { width: CONTENT_W + 'px', height: CHART.h + 'px' });
    tl.leader.appendChild(svg);
    tl.leaderPath = svg.querySelector('path');
    tl.leaderLen = (lineY - target.y) + (pill.left - target.x);
    tl.leaderPath.setAttribute('stroke-dasharray', `${tl.leaderLen} ${tl.leaderLen}`);
    return tl;
  };
  // Draws the chart once its sweep reaches second `now` of the run: each bar shows its part before `now`, its
  // squares and label show as it starts and ends
  const setTimeline = (tl, now) => {
    const shown = (e, on) => { e.style.opacity = on ? 1 : 0; };
    const wf = tl.workflow;
    setBar(wf.bar, now / ORDER_1042.runtime);
    shown(wf.start, now > 0);
    shown(wf.end, now >= ORDER_1042.runtime);
    tl.activities.forEach(lane => {
      const { act } = lane;
      if (lane.band) {
        setBar(lane.band, (now - act.from) / (act.retryAt - act.from));
        setBar(lane.bar, (now - act.retryAt) / (act.to - act.retryAt));
        shown(lane.restart, now >= act.retryAt);
      } else {
        setBar(lane.bar, (now - act.from) / (act.to - act.from));
      }
      shown(lane.start, now >= act.from);
      shown(lane.end, now >= act.to);
      shown(lane.label, now >= act.to);
    });
  };

  // ---------- Pending Activities tab of order #1045: the pending shipPackage card (state, Activity ID, attempt,
  // last started time, last worker, Last Failure), then "No pending activities" once it completes
  const PENDING = { h: 362, fieldTop: 86, fieldPitch: 44, valueX: 300, failureX: 640 };
  const FAILURE_JSON = [
    ['{', 0], ['"message": "Carrier timeout",', 1], ['"source": "TypeScriptSDK",', 1],
    ['"applicationFailureInfo": {', 1], ['"type": "CarrierTimeout"', 2], ['}', 1], ['}', 0],
  ];
  // keys in the UI's link blue, the rest in white
  const jsonLine = ([text, depth]) => `<div style="padding-left:${depth * 24}px;white-space:pre">`
    + text.replace(/^("[^"]+")(:)/, `<span style="color:${UI.link}">$1</span>$2`) + '</div>';
  const makePendingTab = page => {
    const w = CONTENT_W;
    const fieldRow = (i, label) => `<div style="${at(24, PENDING.fieldTop + i * PENDING.fieldPitch)}height:32px;`
      + `display:flex;align-items:center;font-size:18px;color:${UI.dim}">${label}</div>`;
    const value = i => ({
      left: PENDING.valueX + 'px', top: PENDING.fieldTop + i * PENDING.fieldPitch + 'px', height: '32px',
      display: 'flex', alignItems: 'center', fontSize: '20px', whiteSpace: 'nowrap',
    });
    const card = part(page,
      `<div style="${at(0, 24)}width:100%;height:36px"></div>`
      + `<div style="position:absolute;right:24px;top:18px;display:flex;gap:12px">`
      + button('Pause', { icon: 'pause' }) + button('Update', { icon: 'pencil' })
      + button('Reset', { icon: 'reset' }) + '</div>'
      + ['Activity ID', 'Attempt', 'Last Started Time', 'Last Worker Identity'].map((l, i) => fieldRow(i, l)).join('')
      + `<div style="${at(PENDING.valueX, PENDING.fieldTop)}height:32px;display:flex;align-items:center;`
      + 'font-size:20px">3</div>'
      + `<div style="${at(PENDING.valueX, PENDING.fieldTop + 3 * PENDING.fieldPitch)}height:32px;display:flex;`
      + 'align-items:center;font-size:20px">worker-b</div>',
      { left: PAGE.pad + 'px', top: DETAILS.contentTop + 'px', width: w + 'px', height: PENDING.h + 'px',
        background: UI.panel, boxShadow: `inset 0 -1px 0 ${UI.rule}` });
    card.badge = makeBadge(card, 'started', 124, { position: 'absolute', left: '24px', top: '22px' });
    part(card, 'shipPackage', { left: '164px', top: '20px', height: '34px', display: 'flex', alignItems: 'center',
      fontSize: '26px', fontWeight: '700' });
    card.attempt = part(card, '', {
      ...value(1), height: '30px', top: PENDING.fieldTop + PENDING.fieldPitch + 1 + 'px', padding: '0 12px',
      fontSize: '17px', letterSpacing: '.04em', borderRadius: '15px', background: UI.chip,
      boxShadow: `inset 0 0 0 1.5px ${UI.chipEdge}`, transformOrigin: 'left center',
    }, 'mono');
    card.started = part(card, '', value(2));
    card.failure = part(card,
      `<div style="font-size:18px;color:${UI.dim};height:24px;display:flex;align-items:center">Last Failure</div>`
      + `<div class="mono" style="margin-top:12px;padding:14px 20px;font-size:19px;line-height:26px;`
      + `background:${UI.json};border-radius:4px;box-shadow:inset 0 0 0 1px ${UI.jsonEdge}">`
      + FAILURE_JSON.map(jsonLine).join('') + '</div>',
      { left: PENDING.failureX + 'px', top: PENDING.fieldTop + 4 + 'px', width: (w - PENDING.failureX - 24) + 'px' });
    page.none = part(page, 'No pending activities', {
      left: PAGE.pad + 'px', top: DETAILS.contentTop + 'px', width: w + 'px', height: '120px', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: UI.dim,
      background: UI.panel, boxShadow: `inset 0 -1px 0 ${UI.rule}`,
    });
    return card;
  };

  // ---------- mouse pointer (its tip at the top left corner of the element) and its click ring
  const makePointer = win => E(win,
    '<svg width="30" height="36" viewBox="0 0 20 24" style="display:block"><path d="M2 2v17l4.5-4 3 7 3-1.3-2.9-6.7'
    + `h5.9z" fill="${C.ink}" stroke="#141414" stroke-width="1.4" stroke-linejoin="round"/></svg>`);
  const makeClickRing = win => part(win, '', { border: `2px solid ${C.ink}`, borderRadius: '50%' });

  scene({
    chapter: 7, title: 'Full visibility',
    // the window is laid out centered at (960, 522)
    subs: [
      {
        text: "Temporal also shows every Workflow in its <b>web UI</b>: which ones are running, completed or failed.",
        after: 1.0,
      },
      {
        text: "Open order #1042: its timeline shows every Activity, how long it took, and the retry after the crash.",
        after: 1.2,
        stopLead: 0.4, // just before the click on order #1042, at c[1] - 0.35
      },
      {
        text: "While a Workflow runs, you see an Activity retrying, its attempt count and its last error, live.",
        after: 3.0,
      },
    ],
    build(root, s) {
      s.win = makeWindow(root);
      s.list = makeListPage(s.win);
      // 29 events, as for order-1045: the retried shipPackage writes one ActivityTaskStarted, for its last attempt
      s.order1042 = makeDetailsPage(s.win, ORDER_1042, 'Timeline',
        { 'Event History': 29, Workers: 1, 'Pending Activities': 0 });
      s.order1045 = makeDetailsPage(s.win, ORDER_1045, 'Pending Activities',
        { 'Event History': 17, Workers: 1, 'Pending Activities': 1 });
      s.frame = makeFrame(s.win);
      s.pointer = makePointer(s.win);
      s.ring = makeClickRing(s.win);
      s.timeline = makeTimelineTab(s.order1042);
      s.pending = makePendingTab(s.order1045);
    },
    update(t, c, s) {
      // the window fades in and rises onto whole pixels
      const wp = P(t, c[0] - 0.3, 0.5);
      place(s.win, WIN.x, WIN.y + Math.round((1 - wp) * 20), 1, wp);
      // pages swap like a navigation: the old page fades out, the new one fades in and rises 12 px
      const showPage = (page, inAt, outAt) => {
        const p = P(t, inAt, 0.35);
        page.style.opacity = p * (1 - P(t, outAt, 0.3));
        page.style.transform = `translateY(${Math.round((1 - p) * 12)}px)`;
        page.style.visibility = page.style.opacity > 0.001 ? 'visible' : 'hidden';
      };
      const clickAt = c[1] - 0.35;
      showPage(s.list, -Infinity, clickAt + 0.2);
      showPage(s.order1042, clickAt + 0.4, c[2]);
      showPage(s.order1045, c[2] + 0.25, Infinity);

      // ---- c[0]: the rows come in quickly; the count pill and the badges of each status bump as the subtitle
      // names it, then the pointer hovers order-1042 and clicks it
      const named = { running: c[0] + 4.06, completed: c[0] + 4.63, failed: c[0] + 5.44 };
      COUNTED.forEach(status => {
        s.list.counts[status].style.transform = `scale(${1 + 0.12 * bumpAt(t, named[status])})`;
      });
      const hover = P(t, c[0] + 6.3, 0.2);
      s.list.rows.forEach((row, i) => {
        const p = P(t, c[0] + 0.4 + i * 0.08, 0.35);
        row.style.opacity = p;
        row.style.transform = `translateY(${Math.round((1 - p) * 10)}px)`;
        setBadge(row.badge, row.status, bumpAt(t, named[row.status]));
        const hovered = i === OPENED_ROW && hover > 0.5;
        row.style.background = hovered ? UI.hover : row.base;
        row.idCell.style.color = hovered ? UI.link : UI.text;
      });
      // pointer: glides from the lower right of the table onto the order-1042 ID, clicks it
      const rowY = WIN.bar + LIST.cardTop + ROWS_TOP + (OPENED_ROW + 0.5) * LIST.rowH;
      const idX = WIN.side + PAGE.pad + COL.id + 44;
      const glide = P(t, c[0] + 5.7, 0.6);
      const px = Math.round(lerp(idX + 560, idX, glide)), py = Math.round(lerp(rowY + 150, rowY + 6, glide));
      s.pointer.style.transform = `translate(${px - 3}px,${py - 3}px)`;
      s.pointer.style.opacity = P(t, c[0] + 5.6, 0.2) * (1 - P(t, clickAt + 0.3, 0.25));
      // click ring: grows from the pointer tip by its size (never by scale) and fades
      const ring = P(t, clickAt, 0.4);
      const ringSize = Math.round(lerp(8, 44, ring));
      s.ring.style.width = s.ring.style.height = ringSize + 'px';
      s.ring.style.transform = `translate(${px - ringSize / 2}px,${py - ringSize / 2}px)`;
      s.ring.style.opacity = t >= clickAt ? 0.9 * (1 - ring) : 0;

      // ---- c[1]: order-1042: the chart sweeps through the run in time order on "every Activity" (each label,
      // with its duration, shows as its bar ends), then the crash annotation on "the retry after the crash"
      const tl = s.timeline;
      setTimeline(tl, ORDER_1042.runtime * P(t, c[1] + 1.8, 2.2, x => x));
      s.order1042.end.textContent = dateTime(ORDER_1042.start + ORDER_1042.runtime);
      s.order1042.duration.textContent = duration(ORDER_1042.runtime);
      const crashAt = c[1] + 4.9;
      const lead = P(t, crashAt, 0.35);
      tl.leader.style.opacity = t >= crashAt ? 1 : 0;
      tl.leaderPath.setAttribute('stroke-dashoffset', String(tl.leaderLen * (1 - lead)));
      const crashPill = popIn(t, crashAt + 0.3);
      tl.crashPill.style.opacity = crashPill.o;
      tl.crashPill.style.transform = `scale(${crashPill.s})`;

      // ---- c[2]: order-1045 live: shipPackage fails twice, waits 1s then 2s, attempt 3 succeeds, then the Workflow
      // completes
      const o45 = ORDER_1045, p45 = s.order1045, card = s.pending;
      const liveAt = c[2] + 0.7;
      const videoAt = sec => liveAt + (sec - LIVE_FROM); // video time of second `sec` of the run
      const now = clamp(LIVE_FROM + t - liveAt, LIVE_FROM, o45.finishedAt);
      const finished = now >= o45.finishedAt;
      const last = o45.attempts[o45.attempts.length - 1];
      const shipped = now >= last.to;
      const status45 = finished ? 'completed' : 'running';
      setBadge(p45.badge, status45, bumpAt(t, videoAt(o45.finishedAt)));
      p45.action.textContent = ACTION[status45];
      p45.duration.textContent = duration(now);
      p45.end.textContent = finished ? dateTime(o45.start + o45.finishedAt) : '–';
      p45.end.style.color = finished ? UI.text : UI.dim;
      // the tab counts follow the history: 17 while shipPackage retries (a retry writes no event), 23 once it
      // completes (ActivityTaskStarted, ActivityTaskCompleted, a Workflow Task, emailReceipt scheduled), then the
      // Workflow complete (29)
      p45.tabCount('Event History').textContent = finished ? 29 : shipped ? 23 : 17;
      p45.tabCount('Pending Activities').textContent = shipped ? 0 : 1;
      // pending card: each failure raises the attempt count (it bumps) and shows the last failure; between attempts
      // the Activity waits, SCHEDULED, for its retry
      const failures = o45.attempts.filter(a => a !== last && now >= a.to);
      const attempt = failures.length + 1;
      const running = o45.attempts.some(a => now >= a.from && now < a.to);
      const lastStart = o45.attempts.filter(a => now >= a.from).pop();
      setBadge(card.badge, running || shipped ? 'started' : 'scheduled');
      card.attempt.textContent = `${attempt} / UNLIMITED`;
      const lastFailure = failures[failures.length - 1];
      card.attempt.style.transform = `scale(${1 + 0.14 * (lastFailure ? bumpAt(t, videoAt(lastFailure.to)) : 0)})`;
      card.started.textContent = dateTime(o45.start + lastStart.from);
      card.failure.style.opacity = P(t, videoAt(o45.attempts[0].to), 0.25);
      card.style.opacity = 1 - P(t, videoAt(last.to) + 0.1, 0.3);
      p45.none.style.opacity = P(t, videoAt(last.to) + 0.4, 0.3);
    }
  });
}
