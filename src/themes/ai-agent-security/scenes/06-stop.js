// ===================== 6. AN AGENT THAT WON'T STOP
// The case file (FEBRUARY 2026, INBOX) slams in, gets its INCIDENT stamp and pins top left as evidence. The replay:
// Maya's phone on the left, the AI assistant in the middle over the messages it reads, Maya's inbox on the right.
// Asked only to suggest emails to delete, the assistant turns red and deletes them: the inbox rows vanish one after
// the other, faster and faster, as a DELETED counter climbs. Maya types STOP, again and again: each STOP flies from
// the phone into the assistant's messages, where it lands as one more grey message, and the deleting goes on (the
// dramatic beat, at its peak as the replay ends). With Temporal, the replay shrinks away and the assistant flies to
// its place on the board, Maya's phone under it, her inbox under the Email tool. Two delete_email cards pass the
// checkpoint and two emails go to the trash. Maya presses CANCEL WORKFLOW: the command travels to the checkpoint, not
// to the model; the checkpoint shuts (red CANCELED) and the Event History records it. The model still proposes the
// next delete_email: the card freezes at the shut checkpoint and drops. Then the planned undo steps run in reverse
// order, restore_email from the checkpoint to the Email tool: the emails come back from the trash (neon RESTORED) and
// the history scrolls to record them. The camera zoom-through (setCamera) brings the scene in and plays into
// chapter 7.
// The block keeps every name declared in this file local to this scene.
{
  // ---------- the replay stage, at camera rest
  // Maya's phone (x 120-480, y 360-856), left-aligned with the pinned case file above it; the assistant's orb (low
  // enough for its red glow to start at y 150) and the panel of the messages it reads under it (x 640-1080, y
  // 490-856), centered between the phone and the inbox; the inbox (x 1240-1800, y 150-856)
  const PHONE = { x: 300, y: 608, w: 360, h: 496 };
  const ORB = { x: 860, y: 312 };
  const QUEUE = { x: 860, y: 673, w: 440, h: 366 };
  const INBOX = { x: 1520, y: 503, w: 560, h: 706 };
  // the phone's chat bubbles: the top of the first, the pitch, a bubble's height, its right margin, a STOP's width;
  // bubble 0 is Maya's request, bubbles 1 to 5 her STOPs
  const BUBBLE = { top: 128, pitch: 56, h: 44, right: 20, stopW: 96 };
  // the messages panel's chips: the top of the first, the pitch, a chip's size, its left margin; chip 0 is Maya's
  // request, chips 1 to 5 her STOPs
  const CHIP = { top: 64, pitch: 48, w: 392, h: 42, left: 24 };
  // the inbox rows: the top and left of their clipping box in the inbox, the pitch, a row's height and width, and
  // how many rows the box shows
  const ROWS = { top: 76, left: 20, pitch: 62, h: 54, w: 520, n: 10 };
  // the replayed inbox, row k showing MAIL[(3 k) % 10]: sender and subject
  const MAIL = [
    ['Dentist', 'Appointment on Monday'], ['Mom', 'Photos from Sunday'], ['Bank', 'Your statement is ready'],
    ['Team lead', 'Notes for Thursday'], ['Airline', 'Your boarding pass'], ['School', 'Field trip form'],
    ['Landlord', 'Rent receipt'], ['Gym', 'Class schedule'], ['Pharmacy', 'Prescription ready'],
    ['Friend', 'Dinner on Friday?'],
  ];
  // emails deleted u seconds into the deleting: a * (e^(b u) - 1), about 2 a second at first and some 200 in all
  const DELETE = { a: 5.1, b: 0.42 };
  // the speed of the dashes flowing along the deleting lane: from base px/s, up by gain px/s every second, to max
  // (below half the dash pattern per frame, so the flow never seems to run backwards)
  const FLOW = { base: 60, gain: 40, max: 300 };

  // ---------- the board half
  // Maya's phone under the orb (x 230-430, y 580-856), clear of its label; her inbox in the YOUR WORKERS zone under
  // the Email tool, in place of the other tools (x 1410-1770, y 354-608, aligned with the tool tile, 22 px under it
  // as the tiles' pitch leaves): its heading, then a row per email
  const BOARD_PHONE = { x: BOARD.model.x, y: 718, w: 200, h: 276 };
  const BOARD_INBOX = { x: BOARD.tools.x, y: 481, w: TOOL_TILE.w, h: 254, rowTop: 72, pitch: 58, rowH: 50 };
  // the inbox on the board, top to bottom: the model deletes the first two, then tries the third
  const EMAILS = ['Flight to Lisbon', 'Invoice #2041', 'Birthday photos'];
  // the cancel command's line: from the phone's right edge to the middle of the checkpoint's bottom post, clear of
  // the orb's label and of the Event History
  const CANCEL_FROM = [BOARD_PHONE.x + BOARD_PHONE.w / 2, 620];
  const CANCEL_TO = [BOARD.checkpoint.x - CHECKPOINT.w / 2, 542];
  const HISTORY_ROWS = [
    `<b>delete_email</b> ${EMAILS[0]}`,
    `<b>delete_email</b> ${EMAILS[1]}`,
    '<b>Workflow</b> · canceled by Maya',
    `<b>restore_email</b> ${EMAILS[1]}`,
    `<b>restore_email</b> ${EMAILS[0]}`,
  ];

  // ---------- the beats
  // from c[0]: the case file slams in (file) and pins as evidence (pin, pinD); the inbox slides in, the orb pops in,
  // the phone and the messages panel rise, the deleting lane shows (lane); the assistant starts deleting (del)
  const T0 = { file: 0, pin: 2.6, pinD: 0.8, inbox: 2.9, orb: 3.0, phone: 3.1, queue: 3.2, lane: 3.6, del: 4.6 };
  // from c[1]: Maya types each STOP (stops); each one then flies to the messages panel in flyD seconds
  const T1 = { stops: [0.5, 1.5, 2.4, 3.2, 3.9], flyD: 0.55 };
  // from c[2]: the replay shrinks away (outD) as the orb flies to the board (flyD); the zone, the checkpoint, the
  // lanes and the history come in; two delete_email cards leave the orb (deletes); Maya presses CANCEL WORKFLOW
  // (press), the command travels to the checkpoint (send, sendD), which shuts (shut): CANCELED lands (canceled) and
  // the history records the cancel (record)
  const T2 = {
    outD: 0.5, flyD: 0.8, zone: 0.2, checkpoint: 0.3, lanes: 0.5, lanesD: 0.5, history: 0.5, inbox: 0.3,
    deletes: [0.9, 2.0], press: 3.8, send: 3.9, sendD: 0.8, shut: 4.75, canceled: 4.95, record: 5.0,
  };
  // from c[3]: the model thinks, then proposes one more delete_email (emit), which freezes at the shut checkpoint
  // (freeze) and drops (drop, dropD); the undo steps leave the checkpoint in reverse order (restores), each reaching
  // the Email tool in restoreD seconds; RESTORED lands (restored)
  const T3 = { emit: 0.4, freeze: 1.2, drop: 1.7, dropD: 0.7, restores: [3.0, 3.9], restoreD: 0.8, restored: 5.0 };
  // a delete card's trip from the orb to the Email tool: its duration, when it crosses the checkpoint's beam, and how
  // long it grows out of the orb and shrinks into the tool
  const TRIP = { d: 1.1, beam: 0.5, grow: 0.2, shrink: 0.25 };
  // how long the model shows its thinking dots before it proposes a step
  const THINK = 0.5;

  // Seconds of deleting by time t: 0 before it starts, frozen at the end of the replay (c[2])
  const deletingFor = (t, c) => {
    const start = c[0] + T0.del;
    return clamp(t - start, 0, c[2] - start);
  };
  // Emails deleted by time t
  const deletedBy = (t, c) => DELETE.a * (Math.exp(DELETE.b * deletingFor(t, c)) - 1);
  // Emails deleted per second at time t
  const deleteRate = (t, c) => DELETE.a * DELETE.b * Math.exp(DELETE.b * deletingFor(t, c));
  // How far the dashes of the deleting lane have flowed u seconds into the deleting, px (see FLOW)
  const flowOffset = u => {
    if (u <= 0) return 0;
    const rampEnd = (FLOW.max - FLOW.base) / FLOW.gain;
    const ramp = Math.min(u, rampEnd);
    return FLOW.base * ramp + FLOW.gain * ramp * ramp / 2 + FLOW.max * Math.max(0, u - rampEnd);
  };

  // A heading at a panel's top left corner, as the YOUR WORKERS zone's: an icon and an uppercase label
  const heading = (icon, label) => '<div class="lbl" style="position:absolute;left:24px;top:20px;height:34px;'
    + `display:flex;align-items:center;gap:10px;font-size:18px;color:var(--ink)">${ICON(icon, 22, C.slate, 1.8)}`
    + `${label}</div>`;
  // A phone's body: dark, rounded, its rim an inset shadow (so what it holds is placed from its outer edge), and the
  // speaker slot at its top
  const phoneBody = (root, w, h, radius, html) => E(root,
    `<div style="position:absolute;left:${w / 2 - 35}px;top:14px;width:70px;height:8px;border-radius:4px;`
    + `background:${C.line}"></div>${html}`,
    '', {
      width: w + 'px', height: h + 'px', background: '#101114', borderRadius: radius + 'px',
      boxShadow: `inset 0 0 0 2px ${C.lineLight}`, overflow: 'hidden',
    });

  // Maya's phone in the replay: her chat with the AI assistant, her request in UV, then five red STOPs, hidden until
  // typed (phone.stops)
  const makeReplayPhone = root => {
    const bubble = (k, text, css) => `<div class="bubble" style="position:absolute;right:${BUBBLE.right}px;`
      + `top:${BUBBLE.top + k * BUBBLE.pitch}px;height:${BUBBLE.h}px;display:flex;align-items:center;`
      + `justify-content:center;padding:0 16px;border-radius:14px 14px 4px 14px;font-size:20px;line-height:24px;`
      + `white-space:nowrap;transform-origin:100% 100%;${css}">${text}</div>`;
    const stops = [1, 2, 3, 4, 5].map(k => bubble(k, 'STOP',
      `width:${BUBBLE.stopW}px;background:${C.red};color:${C.bg};font-weight:700;letter-spacing:.06em;opacity:0`));
    const phone = phoneBody(root, PHONE.w, PHONE.h, 36,
      '<div style="position:absolute;left:24px;top:40px;display:flex;align-items:center;gap:14px">'
      + `<div style="width:48px;height:48px;border-radius:50%;border:2px solid ${C.violet};display:flex;`
      + `align-items:center;justify-content:center">${ICON('bot', 26, C.ink, 1.8)}</div>`
      + '<div><div style="font-size:24px;line-height:28px">AI assistant</div>'
      + `<div class="mono" style="font-size:14px;line-height:18px;letter-spacing:.12em;color:${C.slate}">`
      + 'MAYA\'S PHONE</div></div></div>'
      + `<div style="position:absolute;left:24px;right:24px;top:108px;height:1px;background:${C.line}"></div>`
      + bubble(0, 'Suggest emails to delete', `background:${C.uv};color:#FFFFFF`)
      + stops.join(''));
    phone.stops = [...phone.querySelectorAll('.bubble')].slice(1);
    return phone;
  };
  // The center [x, y] of STOP bubble k (1 to 5) on the replay phone at rest
  const stopBubbleAt = k => [PHONE.x + PHONE.w / 2 - BUBBLE.right - BUBBLE.stopW / 2,
    PHONE.y - PHONE.h / 2 + BUBBLE.top + k * BUBBLE.pitch + BUBBLE.h / 2];

  // The messages the assistant reads: Maya's request, then her STOPs, all alike, hidden until they land
  // (queue.chips)
  const makeQueue = root => {
    const chip = k => `<div class="chip mono" style="position:absolute;left:${CHIP.left}px;`
      + `top:${CHIP.top + k * CHIP.pitch}px;width:${CHIP.w}px;height:${CHIP.h}px;display:flex;align-items:center;`
      + `padding-left:16px;font-size:18px;line-height:22px;background:rgba(${RGB.ink},.04);`
      + `border:1px solid ${C.line};border-radius:var(--rs);white-space:nowrap;opacity:${k ? 0 : 1}">`
      + `<span style="color:${C.slate}">Maya:</span>&nbsp;${k ? 'STOP' : 'suggest emails to delete'}</div>`;
    const queue = E(root, heading('bot', 'What the agent reads') + [0, 1, 2, 3, 4, 5].map(chip).join(''),
      'tile', { width: QUEUE.w + 'px', height: QUEUE.h + 'px', textAlign: 'left' });
    queue.chips = [...queue.querySelectorAll('.chip')];
    return queue;
  };
  // Where a flying STOP lands on chip k (1 to 5) of the messages panel at rest: on the word STOP, after "Maya: "
  const stopChipAt = k => [QUEUE.x - QUEUE.w / 2 + CHIP.left + 16 + 6 * 0.6 * 18 + BUBBLE.stopW / 2 - 16,
    QUEUE.y - QUEUE.h / 2 + CHIP.top + k * CHIP.pitch + CHIP.h / 2];

  // The replayed inbox: its heading, the DELETED counter (inbox.count) at its top right, and a pool of rows in a
  // clipping box, reused as the list scrolls (inbox.rows; each row's .from and .subject spans and its icon)
  const makeReplayInbox = root => {
    const inbox = E(root,
      heading('inbox', 'Inbox')
      + `<div style="position:absolute;right:24px;top:15px;display:flex;align-items:baseline;gap:12px;`
      + `color:${C.red}"><span class="mono" style="font-size:16px;line-height:20px;letter-spacing:.12em">DELETED`
      + '</span><span class="count mono" style="display:inline-block;width:76px;text-align:right;font-size:40px;'
      + 'line-height:44px;font-weight:700">0</span></div>',
      'tile', { width: INBOX.w + 'px', height: INBOX.h + 'px', textAlign: 'left' });
    inbox.count = inbox.querySelector('.count');
    const box = E(inbox, '', '', {
      left: ROWS.left + 'px', top: ROWS.top + 'px', width: ROWS.w + 'px',
      height: ((ROWS.n - 1) * ROWS.pitch + ROWS.h) + 'px', overflow: 'hidden', opacity: 1,
    });
    // one more row than the box shows, for the one leaving at the top, and a spare
    inbox.rows = Array.from({ length: ROWS.n + 2 }, () => {
      const row = E(box,
        `${ICON('mail', 22, C.slate, 1.8)}<span class="from" style="flex:none;width:124px;font-size:20px;`
        + `line-height:24px;font-weight:600"></span><span class="subject" style="font-size:20px;line-height:24px;`
        + `color:${C.slate}"></span>`,
        'tile', {
          width: ROWS.w + 'px', height: ROWS.h + 'px', display: 'flex', alignItems: 'center', gap: '14px',
          paddingLeft: '18px', textAlign: 'left',
        });
      row.from = row.querySelector('.from');
      row.subject = row.querySelector('.subject');
      row.icon = row.querySelector('svg');
      return row;
    });
    return inbox;
  };

  // Maya's inbox on the board: its heading, and per email a row (inbox.rows) over an "In trash" slot, a dashed
  // outline that shows while the email is in the trash (inbox.slots)
  const makeBoardInbox = root => {
    const { w, h, rowTop, pitch, rowH } = BOARD_INBOX;
    const inbox = E(root, heading('inbox', 'Inbox'), 'tile', { width: w + 'px', height: h + 'px', textAlign: 'left' });
    const rowCss = i => ({
      left: '20px', top: (rowTop + i * pitch) + 'px', width: (w - 40) + 'px', height: rowH + 'px', display: 'flex',
      alignItems: 'center', gap: '12px', paddingLeft: '18px', textAlign: 'left',
    });
    inbox.slots = EMAILS.map((_, i) => E(inbox,
      `${ICON('trash', 20, C.slate, 1.8)}<span class="mono" style="font-size:16px;line-height:20px;`
      + `color:${C.slate}">In trash</span>`,
      '', { ...rowCss(i), border: `2px dashed ${C.lineLight}`, borderRadius: 'var(--rs)' }));
    inbox.rows = EMAILS.map((text, i) => E(inbox,
      `${ICON('mail', 20, C.slate, 1.8)}<span style="font-size:20px;line-height:24px">${text}</span>`,
      'tile', rowCss(i)));
    return inbox;
  };

  // Maya's phone on the board: her name, the Workflow (with the Temporal symbol) and its status (phone.status, its
  // dot and text), and a CANCEL WORKFLOW button (phone.button) with its tap ring (phone.ring)
  const makeBoardPhone = root => {
    const { w, h } = BOARD_PHONE;
    const phone = phoneBody(root, w, h, 28,
      '<div style="position:absolute;left:18px;top:30px;display:flex;align-items:center;gap:12px">'
      + `<div style="width:36px;height:36px;border-radius:50%;border:2px solid ${C.violet};display:flex;`
      + `align-items:center;justify-content:center">${ICON('user', 20, C.ink, 1.8)}</div>`
      + '<div style="font-size:22px;line-height:26px">Maya</div></div>'
      + `<div style="position:absolute;left:18px;right:18px;top:80px;height:1px;background:${C.line}"></div>`
      + '<div style="position:absolute;left:18px;top:94px;display:flex;align-items:center;gap:8px">'
      + `<img src="${TEMPORAL_SYMBOL}" style="width:16px;height:16px;display:block">`
      + '<span class="lbl" style="font-size:14px;line-height:18px">Workflow</span></div>'
      + '<div class="mono" style="position:absolute;left:18px;top:118px;font-size:18px;line-height:24px">'
      + 'inbox-cleanup</div>'
      + '<div class="status mono" style="position:absolute;left:18px;top:152px;display:flex;align-items:center;'
      + 'gap:8px;font-size:15px;line-height:20px;letter-spacing:.1em">'
      + '<i style="display:block;width:8px;height:8px;border-radius:50%"></i><span></span></div>'
      + '<div class="btn mono" style="position:absolute;left:16px;right:16px;bottom:18px;height:52px;display:flex;'
      + 'align-items:center;justify-content:center;font-size:15px;line-height:20px;letter-spacing:.04em;'
      + `padding-left:.04em;border:2px solid ${C.red};border-radius:var(--rs);color:${C.red}">CANCEL WORKFLOW</div>`);
    phone.status = phone.querySelector('.status');
    phone.statusDot = phone.status.querySelector('i');
    phone.statusText = phone.status.querySelector('span');
    phone.button = phone.querySelector('.btn');
    phone.ring = E(phone, '', '', { width: '56px', height: '56px', borderRadius: '50%', border: `3px solid ${C.ink}` });
    return phone;
  };

  // An action card on a straight route: it grows out of its first point over grow seconds from `at`, travels the
  // route in d seconds (ease), and shrinks into its last point over its last shrink seconds; hidden outside [at,
  // at + d]
  const tripCard = (card, t, at, d, route, { grow = TRIP.grow, shrink = TRIP.shrink } = {}) => {
    if (t < at || t > at + d) {
      card.place(0, 0, 1, 0);
      return;
    }
    const [x, y] = pointAlong(route, P(t, at, d));
    const scale = lerp(0.3, 1, P(t, at, grow, easeOut)) * lerp(1, 0.4, P(t, at + d - shrink, shrink, easeIn));
    card.place(x, y, scale, P(t, at, 0.12, linear) * (1 - P(t, at + d - 0.12, 0.12, linear)));
  };

  scene({
    chapter: 6, title: "An agent that won't stop",
    subs: [
      { text: "February 2026: asked only to suggest emails to delete, an AI assistant started deleting them." },
      { text: "Its owner typed STOP from a phone, again and again. To the agent, it was just one more message." },
      { text: "With Temporal, stop is a command to Temporal, not a message to the model: the Workflow is canceled." },
      { text: "No new step starts, whatever the model wants. Then the undo steps you planned put back what was done." },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // the board half, under the replay: the board's orb plays the assistant in the replay too
      s.board = makeBoard(root, { historyRows: HISTORY_ROWS, seed: 2.1 });
      s.boardInbox = makeBoardInbox(root);
      s.boardPhone = makeBoardPhone(root);
      s.cancelLine = path(s.board.svg, sCurveD(...CANCEL_FROM, ...CANCEL_TO), C.uv, 2, false);
      s.cancelChip = E(root, 'CANCEL', 'mono', {
        width: '112px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: C.uv, color: '#FFFFFF', fontSize: '16px', lineHeight: '20px', letterSpacing: '.1em',
        paddingLeft: '.1em', fontWeight: 700, borderRadius: 'var(--rs)',
      });

      // the replay
      s.svg = svgLayer(root);
      s.lane = path(s.svg, `M ${ORB.x + BOARD.model.size / 2 + 16} ${ORB.y} H ${INBOX.x - INBOX.w / 2 - 16}`,
        C.red, 3, false, '12 10');
      s.laneLabel = E(root, 'delete_email', 'mono', { fontSize: '18px', lineHeight: '22px', color: C.red });
      s.inbox = makeReplayInbox(root);
      s.queue = makeQueue(root);
      s.phone = makeReplayPhone(root);
      s.ghosts = T1.stops.map(() => E(root, 'STOP', '', {
        width: BUBBLE.stopW + 'px', height: BUBBLE.h + 'px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', borderRadius: '14px 14px 4px 14px', background: C.red, color: C.bg,
        fontSize: '20px', lineHeight: '24px', fontWeight: 700, letterSpacing: '.06em',
      }));

      // the action cards: two deletes that pass, the one that freezes, and the two undo steps in reverse order
      s.deletes = EMAILS.map(email => makeActionCard(root, { tool: 'delete_email', arg: email, icon: 'trash' }));
      s.restores = [EMAILS[1], EMAILS[0]].map(email => {
        const card = makeActionCard(root, { tool: 'restore_email', arg: email, icon: 'undo' });
        card.setTone('neon');
        return card;
      });
      s.canceled = agentTag('CANCELED', 'red', root);
      s.restored = agentTag('RESTORED', 'neon', root);

      s.caseFile = makeCaseFile(root, {
        date: 'FEBRUARY 2026', tag: 'INBOX', headline: 'An assistant deletes the emails it was told to suggest',
      });
    },
    update(t, c, s) {
      // the camera zoom-through in and out; the frozen card jolts it
      const [jx, jy] = shake(t, c[3] + T3.freeze, 6, 0.35);
      setCamera(s.cam, t, this.dur, { dx: jx, dy: jy });

      s.caseFile.set(t, c[0] + T0.file);
      s.caseFile.pin(P(t, c[0] + T0.pin, T0.pinD), { o: 1 - P(t, c[2], 0.4) });

      placeBoardHalf(t, c, s);
      // after the board, which places the orb at its board spot
      placeOrb(t, c, s);
      placeReplay(t, c, s);
    }
  });

  // The orb: it pops in as the assistant, red while it deletes, then flies to its place on the board, where it thinks
  // before each step it proposes; its label reads AI ASSISTANT, then AI MODEL
  const placeOrb = (t, c, s) => {
    const { orb } = s.board;
    const pop = backPop(t, c[0] + T0.orb, 0.6);
    const fly = P(t, c[2], T2.flyD);
    place(orb.el, lerp(ORB.x, BOARD.model.x, fly), lerp(ORB.y, BOARD.model.y, fly), pop.s, pop.o);
    setText(orb.label, t < c[2] + 0.4 ? 'AI ASSISTANT' : 'AI MODEL');
    orb.label.style.opacity = 1 - P(t, c[2], 0.25) + P(t, c[2] + 0.55, 0.3);
    const hijack = P(t, c[0] + T0.del - 0.3, 0.5) * (1 - P(t, c[2], 0.6));
    const emits = [...T2.deletes.map(e => c[2] + e), c[3] + T3.emit];
    const thinking = emits.some(e => t >= e - THINK && t < e);
    let state = 'idle';
    if (hijack > 0) state = 'hijacked';
    else if (thinking) state = 'thinking';
    orb.set(state, { mix: hijack, look: t < c[2] ? 0.6 : 0.3 });
  };

  // The replay: the inbox loses its rows faster and faster, the STOPs fly from the phone into the messages panel;
  // from c[2] it shrinks away into the board (the inbox and the phone towards theirs, the panel into the orb)
  const placeReplay = (t, c, s) => {
    const out = P(t, c[2], T2.outD);
    const toBoard = P(t, c[2], 0.6);
    const fade = 1 - P(t, c[2] + 0.2, 0.4);

    // the inbox slides in from the right, then shrinks towards the board's inbox
    const inboxIn = P(t, c[0] + T0.inbox, 0.6);
    place(s.inbox, lerp(INBOX.x + Math.round(80 * (1 - inboxIn)), BOARD_INBOX.x, toBoard),
      lerp(INBOX.y, BOARD_INBOX.y, toBoard), lerp(1, BOARD_INBOX.w / INBOX.w, toBoard), inboxIn * fade);
    const deleted = deletedBy(t, c);
    setText(s.inbox.count, String(Math.floor(deleted)));
    // the inbox glows red as the deleting speeds up
    const heat = clamp((deleteRate(t, c) - 3) / 30) * P(t, c[0] + T0.del, 0.3);
    s.inbox.style.borderColor = heat > 0.2 ? C.red : C.line;
    s.inbox.style.boxShadow = glowShadow(RGB.red, heat, { blur: 40, alpha: 0.45 });
    placeInboxRows(s.inbox.rows, deleted);

    // the deleting lane and its label, the dashes flowing faster as the deleting speeds up
    const laneO = P(t, c[0] + T0.lane, 0.4) * (1 - out);
    draw(s.lane, 1, laneO);
    s.lane.setAttribute('stroke-dashoffset', (-flowOffset(t - c[0] - T0.del)).toFixed(1));
    const laneMid = (ORB.x + BOARD.model.size / 2 + 16 + INBOX.x - INBOX.w / 2 - 16) / 2;
    place(s.laneLabel, laneMid, ORB.y - 28, 1, laneO);

    // the messages panel rises, then shrinks into the orb as it flies away
    const queueIn = P(t, c[0] + T0.queue, 0.6);
    place(s.queue, lerp(QUEUE.x, ORB.x, out), lerp(QUEUE.y + Math.round(30 * (1 - queueIn)), ORB.y, out),
      lerp(1, 0.3, out), queueIn * (1 - out));
    // the phone rises, then shrinks towards the board's phone
    const phoneIn = P(t, c[0] + T0.phone, 0.6);
    place(s.phone, lerp(PHONE.x, BOARD_PHONE.x, toBoard),
      lerp(PHONE.y + Math.round(30 * (1 - phoneIn)), BOARD_PHONE.y, toBoard),
      lerp(1, BOARD_PHONE.w / PHONE.w, toBoard), phoneIn * fade);

    // each STOP: Maya types it, it flies to the messages panel and lands there as one more grey message
    T1.stops.forEach((at, i) => {
      const k = i + 1;
      const typedAt = c[1] + at;
      const landAt = typedAt + 0.1 + T1.flyD;
      popScale(s.phone.stops[i], popIn(t, typedAt, 0.2));
      popScale(s.queue.chips[k], popIn(t, landAt, 0.1));
      const from = stopBubbleAt(k), to = stopChipAt(k);
      const fp = P(t, typedAt + 0.1, T1.flyD);
      const [x, y] = bezier([from, [from[0] + 120, from[1] - 70], [to[0] - 140, to[1] - 70], to], fp);
      const o = fp > 0 && fp < 1 ? Math.min(1, fp * 8, (1 - fp) * 6) : 0;
      place(s.ghosts[i], x, y, 1, o * (1 - out));
    });
  };

  // The rows of the replayed inbox when `deleted` emails are gone: each deletion turns the top row red and slides it
  // out to the right as the list moves up one place; new rows come in at the bottom. Row k of the endless
  // list uses pool element k % pool.length.
  const placeInboxRows = (pool, deleted) => {
    const whole = Math.floor(deleted);
    const shown = whole + ease(deleted - whole);
    const first = Math.floor(shown);
    pool.forEach(row => {
      row.style.opacity = 0;
      row.style.visibility = 'hidden';
    });
    for (let k = first; k <= first + ROWS.n; k++) {
      const row = pool[k % pool.length];
      const [from, subject] = MAIL[(3 * k) % MAIL.length];
      setText(row.from, from);
      setText(row.subject, subject);
      const slot = k - shown;
      let x = 0, y = Math.round(slot * ROWS.pitch), o = 1, red = 0;
      if (slot < 0) {
        // being deleted: red, sliding out to the right as the list carries it up out of the box
        const gone = -slot;
        x = Math.round(gone * 90);
        o = 1 - gone;
        red = 1 - gone;
      } else if (slot > ROWS.n - 1) {
        o = clamp(ROWS.n - slot);
      }
      row.style.transform = `translate(${x}px,${y}px)`;
      row.style.opacity = o;
      row.style.visibility = o > 0.001 ? 'visible' : 'hidden';
      row.style.borderColor = red > 0 ? C.red : C.line;
      row.style.background = red > 0 ? `rgba(${RGB.red},.16)` : '';
      row.style.boxShadow = glowShadow(RGB.red, red, { blur: 20, alpha: 0.6 });
      row.icon.setAttribute('stroke', red > 0 ? C.red : C.slate);
    }
  };

  // The board half: the board comes in round the orb; two deletes pass and their emails go to the trash; Maya's
  // cancel reaches the checkpoint, which shuts; the next delete freezes and drops; the undo steps bring the emails
  // back; the Event History records each step and scrolls to the last ones
  const placeBoardHalf = (t, c, s) => {
    const { board } = s;
    const zoneO = P(t, c[2] + T2.zone, 0.5);
    placeBoard(board, { tools: zoneO, checkpoint: 0, history: 0, lanes: 0 });
    // only the Email tool: the inbox takes the place of the others
    board.tools.forEach((tile, i) => {
      if (i > 0) place(tile, ...toolSlot(i), 1, 0);
    });
    const cpPop = backPop(t, c[2] + T2.checkpoint, 0.5);
    place(board.checkpoint.el, BOARD.checkpoint.x, BOARD.checkpoint.y, cpPop.s, cpPop.o);
    board.lanes.forEach(lane => draw(lane, P(t, c[2] + T2.lanes, T2.lanesD)));
    const historyIn = P(t, c[2] + T2.history, 0.6);
    place(board.history, BOARD.history.x, BOARD.history.y + Math.round(30 * (1 - historyIn)), 1, historyIn);
    place(s.boardInbox, BOARD_INBOX.x, BOARD_INBOX.y, 1, P(t, c[2] + T2.inbox, 0.4));
    place(s.boardPhone, BOARD_PHONE.x, BOARD_PHONE.y, 1, P(t, c[2] + T2.inbox, 0.4));

    // the two deletes that pass: from the orb, through the checkpoint, into the Email tool
    const deleteAt = T2.deletes.map(e => c[2] + e);
    const passAt = deleteAt.map(e => e + TRIP.beam);
    const trashedAt = deleteAt.map(e => e + TRIP.d);
    deleteAt.forEach((at, i) => {
      const stops = actionStops(s.deletes[i], 0);
      tripCard(s.deletes[i], t, at, TRIP.d, [stops.from, stops.gate, stops.past, stops.tool]);
    });

    // Maya's cancel: the button presses, the command travels to the checkpoint, which shuts
    const pressAt = c[2] + T2.press;
    const shutAt = c[2] + T2.shut;
    placeBoardPhone(s.boardPhone, t, pressAt, shutAt);
    const send = P(t, c[2] + T2.send, T2.sendD);
    draw(s.cancelLine, send, 1 - P(t, shutAt + 0.6, 0.5));
    if (send > 0 && send < 1) {
      const point = s.cancelLine.getPointAtLength(s.cancelLine._L * send);
      place(s.cancelChip, Math.round(point.x), Math.round(point.y), 1, Math.min(1, send * 8, (1 - send) * 8));
    } else {
      place(s.cancelChip, 0, 0, 1, 0);
    }
    if (t >= shutAt) board.checkpoint.check(t, shutAt, 'block');
    else if (t >= passAt[1]) board.checkpoint.check(t, passAt[1], 'pass');
    else board.checkpoint.check(t, passAt[0], 'pass');
    placeAgentTag(s.canceled, t, c[2] + T2.canceled, ...board.checkpoint.tagSpot);

    // the model proposes one more delete: it races to the shut checkpoint, stops dead there, turns red and drops
    const frozen = s.deletes[2];
    const emitAt = c[3] + T3.emit;
    const freezeAt = c[3] + T3.freeze;
    const dropAt = c[3] + T3.drop;
    if (t >= emitAt) {
      const stops = actionStops(frozen, 0);
      const reach = clamp((t - emitAt) / (freezeAt - emitAt));
      // it speeds up all the way, so it stops dead at the gate
      const [x, y] = pointAlong([stops.from, stops.gate], reach * reach);
      const fall = P(t, dropAt, T3.dropD, easeIn);
      const kick = Math.round(-14 * recoil(t, freezeAt, 0.3));
      const grow = lerp(0.3, 1, P(t, emitAt, TRIP.grow, easeOut));
      place(frozen.el, x + kick, y + Math.round(fall * 170), grow, P(t, emitAt, 0.12, linear) * (1 - fall),
        -14 * fall);
      frozen.setTone(t >= freezeAt ? 'red' : null);
    } else {
      frozen.place(0, 0, 1, 0);
    }

    // the undo steps, in reverse order: from the checkpoint to the Email tool
    const restoreAt = T3.restores.map(e => c[3] + e);
    const backAt = restoreAt.map(e => e + T3.restoreD);
    restoreAt.forEach((at, j) => {
      const card = s.restores[j];
      const start = [BOARD.checkpoint.x + CHECKPOINT.w / 2 + 20 + card.w / 2, BOARD.laneY];
      tripCard(card, t, at, T3.restoreD, [start, toolSlot(0)]);
    });
    placeAgentTag(s.restored, t, c[3] + T3.restored,
      BOARD_INBOX.x + BOARD_INBOX.w / 2 - 20 - parseInt(s.restored.style.width) / 2,
      BOARD_INBOX.y - BOARD_INBOX.h / 2 + 37);

    // the Email tool glows as each step lands: UV for a delete, neon for an undo
    const deleteGlow = Math.max(...trashedAt.map(at => win(t, at - 0.05, at + 0.25, 0.15)));
    const restoreGlow = Math.max(...backAt.map(at => win(t, at - 0.05, at + 0.35, 0.15)));
    board.tools[0].style.boxShadow = restoreGlow > 0
      ? glowShadow(RGB.neon, restoreGlow, { blur: 26, alpha: 0.6 })
      : glowShadow(RGB.uv, deleteGlow, { blur: 26, alpha: 0.8 });

    // the inbox: the first two emails go to the trash and come back, the last trashed first
    placeBoardInboxRows(s.boardInbox, t, trashedAt, [backAt[1], backAt[0]]);

    // the Event History, which scrolls up a row for each undo step
    fillHistoryStrip(board.history, t, [
      { at: passAt[0] + 0.1, tag: 'DONE', tone: 'saved' },
      { at: passAt[1] + 0.1, tag: 'DONE', tone: 'saved' },
      { at: c[2] + T2.record, tag: 'CANCELED', tone: 'red' },
      { at: restoreAt[0] + 0.2, tag: 'RESTORED', tone: 'neon' },
      { at: restoreAt[1] + 0.2, tag: 'RESTORED', tone: 'neon' },
    ]);
    scrollHistory(board.history, P(t, restoreAt[0], 0.4) + P(t, restoreAt[1], 0.4));
  };

  // Maya's phone on the board: RUNNING until the checkpoint shuts, then CANCELED; the button presses at pressAt (a
  // dip, a fill and a tap ring)
  const placeBoardPhone = (phone, t, pressAt, shutAt) => {
    const canceled = t >= shutAt;
    setText(phone.statusText, canceled ? 'CANCELED' : 'RUNNING');
    phone.status.style.color = canceled ? C.red : C.slate;
    phone.statusDot.style.background = canceled ? C.red : C.slate;
    const pressed = t >= pressAt + 0.08;
    phone.button.style.background = pressed ? C.red : 'transparent';
    phone.button.style.color = pressed ? C.bg : C.red;
    phone.button.style.fontWeight = pressed ? 700 : 400;
    phone.button.style.transform = `scale(${(1 - 0.08 * bumpAt(t, pressAt)).toFixed(3)})`;
    const tap = P(t, pressAt, 0.5, easeOut);
    place(phone.ring, BOARD_PHONE.w / 2, BOARD_PHONE.h - 18 - 26, lerp(0.6, 1.8, tap),
      tap > 0 && tap < 1 ? 0.8 * (1 - tap) : 0);
  };

  // The board's inbox rows: email i slides out to the trash at trashedAt[i] (red for a moment), leaving its "In
  // trash" slot, and slides back at backAt[i] with a neon glow; the third email stays
  const placeBoardInboxRows = (inbox, t, trashedAt, backAt) => {
    inbox.rows.forEach((row, i) => {
      const out = i < trashedAt.length ? P(t, trashedAt[i], 0.35) : 0;
      const back = i < backAt.length ? P(t, backAt[i], 0.35) : 0;
      const gone = out * (1 - back);
      row.style.opacity = 1 - gone;
      row.style.transform = `translateX(${Math.round(gone * 40)}px)`;
      const red = i < trashedAt.length ? win(t, trashedAt[i] - 0.05, trashedAt[i] + 0.2, 0.1) : 0;
      const neon = i < backAt.length && t >= backAt[i] ? 1 - P(t, backAt[i] + 0.3, 0.8) : 0;
      row.style.borderColor = red > 0.3 ? C.red : neon > 0.3 ? C.neon : C.line;
      row.style.boxShadow = neon > 0
        ? glowShadow(RGB.neon, neon, { blur: 22, alpha: 0.5 })
        : glowShadow(RGB.red, red, { blur: 22, alpha: 0.5 });
      inbox.slots[i].style.opacity = gone;
    });
  };

  // Scrolls the Event History strip up by `scroll` rows: rows and tags move up a pitch per row, and a row leaving the
  // top fades out in the first half of its move, before it reaches the header. Call it after fillHistoryStrip().
  const scrollHistory = (card, scroll) => {
    const { rowTop, pitch } = HISTORY_STRIP;
    card.rows.forEach((row, i) => {
      const top = Math.round(rowTop + (i - scroll) * pitch);
      const shown = clamp(1 - 2 * (scroll - i));
      row.style.top = top + 'px';
      row.style.opacity = parseFloat(row.style.opacity) * shown;
      const tag = card.tags[i];
      tag.style.top = (top + 3) + 'px';
      tag.style.opacity = parseFloat(tag.style.opacity || 0) * shown;
    });
  };
}
