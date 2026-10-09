// ===================== Durable AI Agents helpers (shared by the scenes of this theme)
// Extra icons, same style as the engine set: 24 grid, stroke only, square caps.
Object.assign(ICONS, {
  sun: '<circle cx="12" cy="12" r="4"/>'
    + '<path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  // a lead bot (antenna, eyes) linked to two helper boxes below it: several agents working together
  agentTeam: '<rect x="7" y="4" width="10" height="7"/><path d="M12 1.5V4M10 7.5h.01M14 7.5h.01'
    + 'M12 11v2.5M6 16v-2.5h12V16"/><rect x="2.5" y="16" width="7" height="5.5"/>'
    + '<rect x="14.5" y="16" width="7" height="5.5"/>',
});
// The agent's goal and its steps: the user's goal card (YOU), then one row per step (icon, action, a neon result
// line and a check, both hidden until the step is done); w: their width
function makeStepList(root, goalText, steps, w = 640) {
  const goal = makeCard(root, goalText, 'user', null, w);
  const rows = steps.map(step => {
    const row = E(root,
      `${ICON(step.icon, 36, C.ink, 1.6)}<div style="flex:1;margin-left:18px">`
      + `<div style="font-size:27px">${step.action}</div>`
      + `<div class="res mono" style="font-size:18px;color:var(--neon);opacity:0">${step.result}</div></div>`
      + `<div class="ck" style="opacity:0">${ICON('check', 32, C.neon, 2.6)}</div>`,
      'tile', {
        width: w + 'px', height: '88px', display: 'flex', alignItems: 'center', padding: '0 22px', textAlign: 'left',
      });
    row.res = row.querySelector('.res'); row.ck = row.querySelector('.ck'); return row;
  });
  return { goal, rows };
}
// Places the goal card at (x, goalY), popping in at goalAt, and the rows from rowY, `gap` apart. Row i slides in
// half a second into its turn (turnStarts[i]), shows its result and its check at the end of the turn, and has a
// violet border while its turn runs (`turn` seconds); o: opacity of the whole list
function placeStepList(list, t, { x, goalY, rowY, gap = 104, goalAt, turnStarts, turn = 1.5, o = 1 }) {
  place(list.goal, x, goalY, P(t, goalAt, 0.45, backOut), P(t, goalAt, 0.4) * o);
  list.rows.forEach((r, i) => {
    const a = turnStarts[i], pr = P(t, a + 0.5, 0.35);
    place(r, x, rowY + i * gap, 1, pr * o);
    r.style.transform += ` translateX(${(1 - pr) * 40}px)`;
    r.res.style.opacity = P(t, a + 1.05, 0.3); r.ck.style.opacity = P(t, a + 1.15, 0.25);
    r.style.borderColor = (t > a && t < a + turn) ? C.violet : C.line;
  });
}

// The app of chapters 1, 2 and 4: a window with a gear that gearSpin() turns while the app works.
// Its .app* styles are in this theme's index.html; its APP label is an .under-label (src/styles.css).
function makeApp(parent) {
  const root = E(parent, `
   <div class="app-win">
     <div class="app-bar"><i></i><i></i><i></i></div>
     <div class="app-lines"><b style="width:70%"></b><b style="width:45%"></b><b style="width:60%"></b></div>
     <div class="app-gear">${ICON('gear', 46, '#F8FAFC')}</div>
   </div>
   <div class="under-label">APP</div>`, 'app');
  root.gear = root.querySelector('.app-gear');
  return root;
}

// ===================== shared by chapters 6 and 7 (crash vs Durable Execution)
// LLM calls billed: a counter tile with a strip of 8 cells, one per call; w: width in px, 330 or more for the strip
// to fit
function makeBill(p, w = 380) {
  const e = makeCounter(p, 'LLM calls billed', w, { h: 200 });
  const cell = `<i style="display:block;width:30px;height:16px;background:rgba(${RGB.ink},.08);`
    + 'border-radius:3px"></i>';
  e.insertAdjacentHTML('beforeend',
    `<div class="sq" style="display:flex;gap:6px;margin-top:10px">${cell.repeat(8)}</div>`);
  e.cells = e.querySelectorAll('.sq i');
  return e;
}
// n calls billed, the last `wasted` of them in red; note: the text next to the number, red while calls are wasted,
// else neon
function setBill(b, n, wasted, note = wasted ? `+${wasted} wasted` : '') {
  setCounter(b, n, note, { noteColor: wasted ? C.red : C.neon, numColor: wasted ? C.red : C.ink });
  b.cells.forEach((q, i) => q.style.background = i < n ? (i >= n - wasted ? C.red : C.uv) : `rgba(${RGB.ink},.08)`);
}
// The crash and the takeover of chapters 6 and 7. App instance A runs the agent from runAt, crashes at crashAt
// (CRASHED, a red context panel, EMPTY from emptyAt), shaken by [sx, sy], then leaves like a dead machine from aDrop:
// it greys, drops and fades out with its context panel. A new copy, instance B, slides in to the same place at bIn,
// the panel with it. The scene sets B's status.
// s: the scene's instance panels A and B, its context panel mem and blocks mblocks. app, mem: the centers of the
// instance and context panels, mem.slotY the line of the blocks and memSlot(i) the x of block i. aIn: A's pop-in
// (a backPop); memIn: the context panel's fade-in; blockA(i): [grow, fall] of A's block i; blockB(i): the grow of B's.
// Returns B's arrivingInstance: its dx moves what slides in with it.
function placeTakeover(s, t, opts) {
  const { app, mem, memSlot, shake: [sx, sy], aIn, runAt, crashAt, emptyAt, aDrop, bIn, memIn, blockA, blockB } = opts;
  const dead = t >= crashAt;
  const leave = leavingInstance(t, aDrop);
  place(s.A, app.x + sx, app.y + sy + leave.dy, aIn.s, aIn.o * leave.o);
  if (dead) setAppStatus(s.A, 'CRASHED', 'crashed');
  else setAppStatus(s.A, 'RUNNING THE AGENT', t >= runAt ? 'running' : 'idle');
  const arrive = arrivingInstance(t, bIn);
  place(s.B, app.x + arrive.dx, app.y, 1, arrive.o);
  // the context panel moves with the instance on screen (A, then B), so it never floats without its app
  const rider = takeoverRider(t, aDrop, bIn, [sx, sy]);
  place(s.mem, mem.x + rider.dx, mem.y + rider.dy, 1, memIn * rider.o);
  s.mem.style.borderColor = dead && !rider.onB ? C.red : C.line;
  s.mem.empty.style.opacity = rider.onB ? 0 : P(t, emptyAt, 0.4);
  s.A.style.filter = rider.grey;
  s.mem.style.filter = rider.grey;
  // the blocks of A have all fallen before A leaves
  s.mblocks.forEach((b, i) => {
    if (rider.onB) {
      placeMemBlock(b, memSlot(i), mem.slotY, blockB(i), 0);
    } else {
      const [grow, fall] = blockA(i);
      placeMemBlock(b, memSlot(i), mem.slotY, grow, fall, { dx: sx, dy: sy });
    }
  });
  return arrive;
}
function makeTicket(p) {
  const e = E(p,
    `<div style="display:flex;align-items:center;gap:12px">${ICON('ticket', 34, C.ink, 1.6)}`
    + '<span class="n mono" style="font-size:20px;letter-spacing:.08em">1 BOOKING</span></div>',
    '', { padding: '10px 16px', border: '1.5px solid ' + C.slate, borderRadius: 'var(--rs)' });
  e.n = e.querySelector('.n');
  return e;
}
