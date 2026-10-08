// ===================== 6. WHEN THE AGENT CRASHES
// App instance A runs the lunch booking with the context in its memory, then crashes before the invite: the memory
// empties, and the dead instance greys, drops and fades with its context panel. A new copy, instance B, slides in to
// the same place with an empty memory: with nothing to resume from, the agent starts over. The rerun pays for every
// LLM call again, each one hitting the bill (swell, jolt, red glow, a "+1 call" chip floating up), and books the
// table a second time: the ticket flies to the middle of the stage and slams to "2 BOOKINGS!".
// The block keeps every name declared in this file local to this scene.
{
  // Layout grid, in whole pixels, laid out on the stage itself (no shift): the composition spans x 160-1760 around
  // x 960, and y 137-900 ("Start over" label to panel bottom) around y 518, 60 px above the subtitles.
  // Columns: the 4 step tiles, 340 wide and 80 apart. The instance panel spans the first three, from the Calendar
  // tile's left edge to the Booking tile's right edge; the right column (APP CRASH, the bill, the tickets) is
  // exactly as wide as the Invite tile, under it.
  // Rows, 72 px apart: the step tiles (240-380), the tags (452-518: a cause centered under each of the first three
  // tiles, APP CRASH in the right column), the panels (590-900: the instance panel; the bill on its top edge, the
  // ticket on its bottom edge, until it flies to the middle of the tags row). The "Start over" arc and its label use
  // the 103 px above the tiles.
  const TILE = { w: 340, h: 140, gap: 80 };
  const PITCH = TILE.w + TILE.gap;
  const ROW_GAP = 72;
  const GRID_LEFT = 960 - (4 * TILE.w + 3 * TILE.gap) / 2; // 160
  const colX = i => GRID_LEFT + TILE.w / 2 + i * PITCH; // column centers: 330, 750, 1170, 1590
  const STEPS_Y = 310;
  const STEPS_TOP = STEPS_Y - TILE.h / 2;
  const TAGS_H = 66; // the APP CRASH tag (big pill); the causes are 50 high, on the same center line
  const TAGS_Y = STEPS_Y + TILE.h / 2 + ROW_GAP + TAGS_H / 2; // 485
  const APP = { x: colX(1), w: 3 * TILE.w + 2 * TILE.gap, h: 310 };
  APP.y = TAGS_Y + TAGS_H / 2 + ROW_GAP + APP.h / 2; // 745
  const APP_TOP = APP.y - APP.h / 2, APP_BOTTOM = APP.y + APP.h / 2;
  // context panel, 24 px inside the instance panel (as in chapter 7)
  const MEM = { x: APP.x, y: APP.y + 24, w: APP.w - 48, h: 210 };
  MEM.slotY = MEM.y + 15;
  // right column: the bill's top edge on the instance panel's, the ticket's bottom edge on the instance panel's
  const COL = { x: colX(3), w: TILE.w };
  const BILL = { x: COL.x, y: APP_TOP + 100 }; // 200 high (makeBill)
  const TICKET = { x: COL.x, y: APP_BOTTOM - 30, h: 60 };
  // the double booking: the ticket flies in TICKET_FLIGHT seconds to the middle of the tags row, empty by then,
  // growing to 1.5 times its size: 510x90, on whole pixels (705-1215, 452-542). 12 px below the row's center line,
  // so the pair, with the second ticket stacked 24 px up behind it (428-518), sits 48 px from the tiles and the
  // panels
  const TICKET_CENTER = { x: 960, y: TAGS_Y + 12, scale: 1.5 };
  const TICKET_FLIGHT = 0.4;
  // "+1 call" chips: fixed even width, right edge on the column's; each starts centered on the bill's top edge
  const CHIP_W = 160;
  const CHIP = { w: CHIP_W, x: COL.x + COL.w / 2 - CHIP_W / 2, y: APP_TOP, rise: 85 };
  const CAUSE_W = 180;
  // the bolt strikes the Invite tile's top right corner, inside the right column's edge
  const BOLT = { x: COL.x + COL.w / 2 - 20, y: STEPS_TOP - 36 };
  // "Start over": from the Invite tile's top back to the Calendar tile's, peaking 60 px above the tiles, its label
  // above the peak
  const REDO = { from: [colX(3), STEPS_TOP - 10], ctrl: [960, STEPS_TOP - 108], to: [colX(0), STEPS_TOP - 15] };
  const REDO_LABEL_Y = STEPS_TOP - 90;
  // memory blocks left-aligned like chapter 7's slots: 20 px panel margin, then 76 px blocks every 88 px (12 px gaps)
  const memSlot = i => MEM.x - MEM.w / 2 + 20 + 76 / 2 + i * 88;
  // NEW INSTANCE: centered on the top edge of instance B's panel (the Restaurant column's axis), well clear of its
  // name and its STARTING OVER status. Fixed even width: it rests on whole pixels (solid: the panel border does not
  // show through).
  const NEW_TAG = { x: APP.x, y: APP_TOP, w: 240 };
  // Red glow around a tile, k from 0 (none) to 1
  const redGlow = (e, k, blur) => {
    const glow = `0 0 ${Math.round(blur * k)}px ${Math.round(4 * k)}px rgba(255,90,95,${(0.5 * k).toFixed(3)})`;
    e.style.boxShadow = k > 0 ? glow : '';
  };
  scene({
    chapter: 6, title: 'When the agent crashes',
    subs: [
      {
        text: "Now the app running the agent crashes just before the invite goes out. "
          + "Restarts, deploys, outages: it happens every day.",
        after: 0.4,
      },
      {
        text: "The context lived in the app's memory, not in the LLM. It's gone, so the agent has to start over.",
        after: 0.4,
      },
      {
        text: "Every LLM call is made, and paid for, a second time, just to rebuild the context. "
          + "And the table gets booked twice.",
        after: 1.2,
      },
    ],
    build(root, s) {
      s.svg = svgLayer(root);
      s.steps = makeStepRow(root, s.svg, STEP_TILES, colX(0), PITCH, STEPS_Y, TILE.w, TILE.h);
      // the app instance holding the memory, then the new copy that takes its place after the crash
      s.A = makeAppPanel(root, 'APP INSTANCE A', APP.w, APP.h);
      s.B = makeAppPanel(root, 'APP INSTANCE B', APP.w, APP.h);
      s.mem = makeMemory(root, MEM.w, MEM.h);
      s.mblocks = makeMemBlocks(root, 6, 76, 56);
      s.newTag = makeNewTag(root, 'New instance', NEW_TAG.w);
      s.bill = makeBill(root, COL.w);
      s.bill.n.style.transformOrigin = '50% 60%';
      // one chip per wasted LLM call, rising out of the bill: the money spent again
      s.chips = [0, 1, 2].map(() => E(root, `${ICON('coin', 24, C.red, 1.8)}+1 call`, 'mono', {
        width: CHIP.w + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        padding: '6px 14px 6px 12px', fontSize: '20px', lineHeight: '28px', letterSpacing: '.08em',
        textTransform: 'uppercase', whiteSpace: 'nowrap', color: C.red,
        border: '1.5px solid ' + C.red, background: 'var(--red-solid)', borderRadius: 'var(--rs)',
      }));
      // tickets as wide as the right column, their content centered: the text changes, the box does not. Built
      // after the panels and the bill: the ticket flies over them to the middle of the stage
      const ticketBox = { width: COL.w + 'px', height: TICKET.h + 'px', display: 'flex', alignItems: 'center',
        justifyContent: 'center' };
      // the second booking: a blank copy of the ticket, stacked behind it once the table is booked twice
      s.ticketBack = makeTicket(root);
      s.ticketBack.n.textContent = '2 BOOKINGS!';
      s.ticketBack.firstChild.style.visibility = 'hidden';
      Object.assign(s.ticketBack.style, ticketBox, { borderColor: C.red, background: 'var(--red-solid)' });
      s.ticket = makeTicket(root);
      Object.assign(s.ticket.style, ticketBox);
      s.bolt = E(root, ICON('bolt', 150, C.red, 1.6));
      s.flash = makeFlash(root);
      // APP CRASH as wide as the right column; the causes share one even width, centered under their tiles
      s.crash = tag(root, 'App crash', 'red big');
      Object.assign(s.crash.style, { width: COL.w + 'px', textAlign: 'center' });
      s.causes = ['Restart', 'Deploy', 'Outage'].map(l => tag(root, l));
      s.causes.forEach(e => Object.assign(e.style, { width: CAUSE_W + 'px', textAlign: 'center' }));
      s.redo = path(s.svg, `M ${REDO.from} Q ${REDO.ctrl} ${REDO.to}`, C.red, 3);
      // fixed even width: centered, the label rests on whole pixels
      s.redoL = E(root, 'Start over', 'lbl', { color: C.red, width: '148px', textAlign: 'center' });
    },
    update(t, c, s) {
      const crashAt = c[0] + 3.9;
      // once the memory blocks have fallen and EMPTY has shown, instance A leaves (aDrop), instance B arrives (bIn)
      // and the steps reset; NEW INSTANCE pops as B settles (newAt), and the "Start over" arc draws once it has
      // landed (startOver)
      const aDrop = c[1] + 2.4, bIn = aDrop + 0.6, newAt = bIn + 0.5, startOver = bIn + 0.7;
      const dead = t >= crashAt, bHere = t >= bIn;
      const [sx, sy] = shakeAt(t, crashAt);
      // first run: steps 1 to 3 complete (3 LLM calls, booking included), then step 4 starts and the app
      // crashes before its LLM call, at the same point as chapter 7
      const r1 = [[c[0] + 0.3, c[0] + 1.3], [c[0] + 1.4, c[0] + 2.4], [c[0] + 2.5, c[0] + 3.5], [c[0] + 3.6, 1e9]];
      const r2 = [[c[2] + 0.2, c[2] + 0.9], [c[2] + 1.0, c[2] + 1.7], [c[2] + 1.8, c[2] + 2.6], [1e9, 1e9]];
      // the rerun's LLM calls, billed a second time, then the second booking
      const wastedAt = [c[2] + 0.2, c[2] + 1.0, c[2] + 1.8];
      const bookedTwiceAt = c[2] + 2.6;
      const states = [0, 1, 2, 3].map(i => {
        let st = 0;
        const [a, b] = bHere ? r2[i] : r1[i];
        if (t >= a) st = t >= b ? 2 : 1;
        if (!bHere && i === 3 && dead) st = 3;
        return st;
      });
      placeStepRow(s.steps, t, 0.1, states, sx, sy);
      // LLM call counter
      const calls = [c[0] + 0.3, c[0] + 1.4, c[0] + 2.5, ...wastedAt].filter(x => t >= x).length;
      setBill(s.bill, calls, Math.max(0, calls - 3));
      // each wasted call hits the bill: the number swells, the tile jolts (two fast swings) and flashes red; after
      // the third one, its border stays red
      const billJolt = wastedAt.reduce((sum, at) => sum + dampedShake(t, at, 8, 0.35, 4), 0);
      place(s.bill, BILL.x + sx + billJolt, BILL.y + sy, P(t, 0.3, 0.45, backOut), P(t, 0.3, 0.4));
      const numberSwell = Math.max(...wastedAt.map(at => swell(t, at + 0.15, 0.3)));
      s.bill.n.style.transform = numberSwell > 1 ? `scale(${numberSwell.toFixed(3)})` : '';
      const billGlow = Math.max(...wastedAt.map(at => P(t, at, 0.08) * (1 - P(t, at + 0.15, 0.5))));
      redGlow(s.bill, billGlow, 36);
      s.bill.style.borderColor = billGlow > 0.1 || t >= wastedAt[2] ? C.red : '';
      // a "+1 call" chip pops out of the bill's top edge, on its right, floats up and fades before the next one
      s.chips.forEach((chip, i) => {
        const at = wastedAt[i];
        const y = CHIP.y - CHIP.rise * P(t, at, 0.9, easeOut);
        place(chip, CHIP.x + billJolt, y, P(t, at, 0.3, backOut), P(t, at, 0.1) * (1 - P(t, at + 0.4, 0.4)));
      });
      // ticket: at the second booking (as the last "+1 call" chip is gone) it flies to the middle of the stage,
      // growing; x leads, so it leaves the column over the empty right part of the context panel, not over the
      // bill. Once there it slams (strong swell, jolt, red glow) and a second ticket stacks behind it
      const slamAt = bookedTwiceAt + TICKET_FLIGHT;
      const two = t >= slamAt;
      s.ticket.n.textContent = two ? '2 BOOKINGS!' : '1 BOOKING';
      s.ticket.style.borderColor = two ? C.red : C.slate; s.ticket.n.style.color = two ? C.red : C.ink;
      s.ticket.style.background = two ? 'var(--red-solid)' : '';
      const tp = P(t, c[0] + 3.5, 0.45, backOut);
      // up to 1.4 within 0.08 s, then back to 1 with a small bounce below it
      const slam = 0.4 * P(t, slamAt, 0.08) * (1 - P(t, slamAt + 0.08, 0.5, backOut));
      const flightX = P(t, bookedTwiceAt, TICKET_FLIGHT, easeOut);
      const flightY = P(t, bookedTwiceAt, TICKET_FLIGHT, easeIn);
      const grow = lerp(1, TICKET_CENTER.scale, P(t, bookedTwiceAt, TICKET_FLIGHT));
      const ticketX = lerp(TICKET.x, TICKET_CENTER.x, flightX) + sx + dampedShake(t, slamAt, 10, 0.4, 4);
      const ticketY = lerp(TICKET.y, TICKET_CENTER.y, flightY);
      place(s.ticket, ticketX, ticketY, tp * grow * (1 + slam), clamp(tp * 2));
      redGlow(s.ticket, P(t, slamAt, 0.08) * (1 - P(t, slamAt + 0.2, 0.8)), 30);
      const stack = P(t, slamAt + 0.15, 0.4, backOut);
      const stackOffset = 16 * TICKET_CENTER.scale * stack;
      place(s.ticketBack, ticketX + stackOffset, ticketY - stackOffset, TICKET_CENTER.scale * (1 + slam),
        clamp(stack * 3));

      // app instance A runs, crashes, then leaves like a dead machine: it greys, drops and fades out
      const aIn = P(t, 0.3, 0.45, backOut);
      const leave = leavingInstance(t, aDrop);
      place(s.A, APP.x + sx, APP.y + sy + leave.dy, aIn, clamp(aIn * 2) * leave.o);
      if (dead) setAppStatus(s.A, 'CRASHED', 'crashed');
      else setAppStatus(s.A, 'RUNNING THE AGENT', t >= c[0] + 0.3 ? 'running' : 'idle');
      // a new copy, instance B, slides in from the left once A is gone, its border glowing violet while it arrives,
      // gone as the rerun starts. No Event History hands it anything: it starts over from scratch, idle until the
      // rerun
      const arrive = arrivingInstance(t, bIn);
      place(s.B, APP.x + arrive.dx, APP.y, 1, arrive.o);
      if (t < c[2] + 0.2) setAppStatus(s.B, 'STARTING OVER', 'idle');
      else setAppStatus(s.B, 'RUNNING THE AGENT', 'running');
      setArrivalGlow(s.B, t, bIn, c[2] - 0.1);
      // NEW INSTANCE pops on B once it is almost in place and is gone as the rerun starts
      placeNewTag(s.newTag, t, newAt, c[2] - 0.2, NEW_TAG.x + arrive.dx, NEW_TAG.y, swell(t, newAt, 0.14));

      // context: filled by the first run, emptied by the crash, refilled by the rerun. The panel moves with the
      // instance on screen (A, then B), so it never floats without its app; both are gone when it switches.
      const memDx = bHere ? arrive.dx : sx, memDy = bHere ? 0 : sy + leave.dy;
      const memOn = bHere ? arrive.o : leave.o;
      place(s.mem, MEM.x + memDx, MEM.y + memDy, 1, P(t, 0.5, 0.45) * memOn);
      s.mem.style.borderColor = dead && !bHere ? C.red : C.line;
      s.mem.empty.style.opacity = bHere ? 0 : P(t, c[1] + 1.2, 0.4);
      const greyed = bHere ? '' : leave.grey;
      s.A.style.filter = greyed;
      s.mem.style.filter = greyed;
      // the blocks of A have all fallen before A leaves; B's stay empty until the rerun
      const add1 = [0.8, 1.3, 1.9, 2.4, 3.0, 3.5].map(x => c[0] + x);
      const add2 = [0.6, 0.9, 1.4, 1.7, 2.3, 2.6].map(x => c[2] + x);
      s.mblocks.forEach((b, i) => {
        if (!bHere) {
          const fall = P(t, c[1] + 0.3 + i * 0.1, 0.8, easeIn);
          placeMemBlock(b, memSlot(i), MEM.slotY, P(t, add1[i], 0.35, backOut), fall, sx, sy);
        } else {
          placeMemBlock(b, memSlot(i), MEM.slotY, P(t, add2[i], 0.35, backOut), 0);
        }
      });

      placeFlash(s.flash, t, crashAt);
      const bp = P(t, crashAt, 0.35, backOut);
      place(s.bolt, BOLT.x, BOLT.y, bp, win(t, crashAt, crashAt + 1.5, 0.2));
      place(s.crash, COL.x, TAGS_Y, bp, win(t, crashAt + 0.1, c[1] + 0.3, 0.25));
      s.causes.forEach((e, i) => {
        const p = P(t, c[0] + 4.8 + i * 0.3, 0.4, backOut);
        place(e, colX(i), TAGS_Y, p, clamp(p * 2) * (1 - P(t, c[1], 0.35)));
      });
      draw(s.redo, P(t, startOver, 0.8), 1 - P(t, c[2] + 3.0, 0.4));
      place(s.redoL, 960, REDO_LABEL_Y, 1, P(t, startOver + 0.5, 0.35) * (1 - P(t, c[2] + 3.0, 0.4)));
    }
  });
}
