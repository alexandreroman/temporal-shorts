// ===================== 1. AGENTS THAT ACT
// Opens on the intro's last frame (a match cut, see INTRO_ORB): the orb already sits at its place on the board. Its
// AI MODEL label fades in, the four tools pop in on the right, and the agent loops: it reads (a spark runs back from
// a tool to the orb), decides (the orb thinks) and acts (a spark runs out to the next tool), the READS, DECIDES and
// ACTS labels lighting in turn. The survey's 80% counts up under the loop, while each tool the agent reaches flickers
// red. Then the dramatic beat: the loop clears and the WORKFLOW checkpoint drops in between the orb and the tools,
// the lanes shoot out of it, YOUR WORKERS draws round the tools and the Event History strip rises into the stat's
// place: the board every later chapter uses. Last, an action card grows out of the orb (SUGGESTS), waits at the
// checkpoint, passes it in a neon flash (DECIDES), lands on its tool, and two rows are written into the Event History
// (RECORDS). The camera holds; the default fade-out plays the camera zoom-through (setCamera) into chapter 2.
// The block keeps every name declared in this file local to this scene.
{
  // the beats of c[0], in seconds from c[0]: the AI MODEL label fades in as "AI model" is read (label); the tools pop
  // in one after the other as "tools" is read (tools, toolStep); the loop's labels fade in (loop) and its first cycle
  // starts as "reads" is read (cycles)
  const T0 = { label: 0.9, tools: 1.9, toolStep: 0.1, loop: 2.4, cycles: 2.7 };
  // one cycle of the agent loop, in seconds from its start: it reads (a spark from a tool to the orb, 0 to read),
  // decides (the orb thinks, read to act) and acts (a spark from the orb to the next tool, act to hit); each line
  // fades out over fade seconds before it is drawn again for the next cycle
  const CYCLE = { d: 1.9, read: 0.6, act: 1.2, hit: 1.8, fade: 0.3 };
  // the tool each read comes from: the first one reads an email, every next one the tool the agent just acted on;
  // the tools the agent acts on, in turn
  const FIRST_READ = 0;
  const ACT_ON = [1, 2, 3, 0, 1, 2];
  // the beats of c[1], from c[1]: the stat rises in (stat) and its number counts up to 80 (count, countD)
  const T1 = { stat: 0.2, count: 0.5, countD: 1.3, value: 80 };
  // the beats of c[2], from c[2]: the loop and the stat clear (out); the checkpoint drops in (drop, dropD, landing at
  // drop + dropD), the lanes shoot out of it (lanes), YOUR WORKERS draws round the tools (zone), the Event History
  // strip rises in (history); the checkpoint glows as "your code" is read (yourCode)
  const T2 = { out: 0, drop: 0.5, dropD: 0.45, lanes: 1.0, zone: 1.5, history: 2.1, yourCode: 3.2 };
  // the beats of c[3], from c[3]: the orb thinks (think), then the action card grows out of it and travels to the
  // checkpoint (emerge, emergeD) as SUGGESTS lights (suggests); it passes the checkpoint (through, throughD) as
  // DECIDES lights; the Event History records the suggestion (rows[0], with RECORDS), and the step once the card has
  // landed on its tool (toTool, toToolD, then rows[1])
  const T3 = {
    think: 0.2, emerge: 0.7, emergeD: 0.9, suggests: 0.9, through: 2.6, throughD: 0.5, toTool: 3.2, toToolD: 0.8,
    rows: [3.1, 4.2],
  };

  // the loop between the orb and the tools: it leaves the orb at (x0, actsY) and comes back to it at (x0, readsY),
  // runs along its top at y top and its bottom at y bottom, level through x mid, and fans out to the tools' left edges
  // at x toolX, the line out (ACTS) split px above a tile's middle, the line back (READS) split px below it
  const LOOP = { x0: 434, actsY: 380, readsY: 440, top: 250, bottom: 570, mid: 960, toolX: 1396, split: 14 };
  // the loop's labels: ACTS above its top and READS under its bottom, 36 px from their line; DECIDES above the orb,
  // clear of its thinking dots
  const LOOP_LABELS = [
    { text: 'Reads', x: LOOP.mid, y: LOOP.bottom + 36 },
    { text: 'Decides', x: BOARD.model.x, y: BOARD.model.y - BOARD.model.size / 2 - 64 },
    { text: 'Acts', x: LOOP.mid, y: LOOP.top - 36 },
  ];
  // the roles of c[3]: SUGGESTS above the orb, where DECIDES was, DECIDES above the checkpoint, RECORDS left of the
  // Event History strip, its right edge 24 px clear of the strip
  const ROLE_W = 136;
  const ROLES = {
    suggests: { text: 'Suggests', x: BOARD.model.x, y: LOOP_LABELS[1].y },
    decides: { text: 'Decides', x: BOARD.checkpoint.x, y: BOARD.checkpoint.y - BOARD.checkpoint.h / 2 - 30 },
    records: {
      text: 'Records', x: BOARD.history.x - BOARD.history.w / 2 - 24 - ROLE_W / 2, y: BOARD.history.y,
    },
  };
  // the survey stat, in the Event History strip's place: its box, the number's box (right-aligned in it, so the
  // count-up keeps its right edge) and the caption's width
  const STAT = { x: BOARD.history.x, y: BOARD.history.y, w: 800, h: 176, numW: 300, numFont: 150, captionW: 440 };
  // where the checkpoint drops in from: above the frame
  const DROP_FROM = -120;
  // the action card and the rows it leaves in the Event History
  const ACTION = { tool: 'send_email', arg: 'to: the sales team', toolIndex: 0 };
  const HISTORY_ROWS = [
    'model suggests <b>send_email</b>',
    '<b>send_email</b> to the sales team',
  ];
  // a spark drops from the checkpoint's bottom to the strip's top as each row is written, over WRITE_D seconds
  const WRITE_D = 0.3;

  // SVG path of the loop's line out, from the orb to tool i, and of its line back, from tool i to the orb
  const actsD = i => {
    const y = toolSlot(i)[1] - LOOP.split;
    return `M ${LOOP.x0} ${LOOP.actsY} C 600 ${LOOP.top} 800 ${LOOP.top} ${LOOP.mid} ${LOOP.top}`
      + ` C 1200 ${LOOP.top} 1250 ${y} ${LOOP.toolX} ${y}`;
  };
  const readsD = i => {
    const y = toolSlot(i)[1] + LOOP.split;
    return `M ${LOOP.toolX} ${y} C 1250 ${y} 1200 ${LOOP.bottom} ${LOOP.mid} ${LOOP.bottom}`
      + ` C 800 ${LOOP.bottom} 600 ${LOOP.readsY} ${LOOP.x0} ${LOOP.readsY}`;
  };
  // A label of fixed even width, so it rests on whole pixels at a whole center
  const makeLabel = (root, text) => E(root, text, 'lbl', { width: ROLE_W + 'px', textAlign: 'center' });
  // A flicker of a tool hit at `at`: 1 or a dim 0.25, changing every frame (1/30 s) for 0.5 s, from hash(); 0 outside
  const flicker = (t, at, seed) => {
    const age = t - at;
    if (age < 0 || age >= 0.5) return 0;
    return hash(seed * 31 + Math.floor(age * 30)) > 0.35 ? 1 : 0.25;
  };

  scene({
    chapter: 1, title: 'Agents that act',
    sources: [
      {
        label: 'SailPoint survey, May 2025',
        url: 'https://www.hpcwire.com/aiwire/2025/06/04/sailpoint-research-reveals-ai-agents-as-enterprise-security-blind-spot/',
      },
    ],
    // a hard cut: the intro ends on this chapter's first frame; the default fade-out to the next scene
    fadeIn: 0,
    subs: [
      { text: "An <b>AI agent</b> is an AI model with tools: it reads, decides, then acts, one step after another." },
      { text: "In a 2025 survey, 80% of companies said their agents had already done things nobody asked for." },
      {
        text: "With <b>Temporal</b>, the agent runs as a <b>Workflow</b>: your code, "
          + "which checks and records every step.",
      },
      // the card's journey ends on the second row, then a hold before the zoom-through
      { text: "The model suggests the next step. The Workflow decides if it runs, then writes it down.", after: 0.6 },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // the checkpoint's halo as it lands, under the board
      s.halo = E(root, '', '', { width: '560px', height: '560px', borderRadius: '50%',
        background: haloBackground(0.24, 0.12, 40, 68) });
      // the board, its orb with the intro's seed, so its blink matches across the cut
      s.board = makeBoard(root, { historyRows: HISTORY_ROWS, uvRow: i => i === 0, seed: INTRO_ORB.seed });
      s.board.orb.label.style.opacity = 0;
      // the loop's two lines and the sparks that run along them (violet; red once the agent goes astray), in the
      // board's SVG layer, under the checkpoint and the orb
      s.acts = path(s.board.svg, actsD(0), C.slate, 2.5);
      s.actsHeads = { slate: s.acts._marker, red: arrowHead(s.board.svg, C.red) };
      s.reads = path(s.board.svg, readsD(0), C.slate, 2.5);
      s.actSpark = makeSpark(root, 16, RGB.violet);
      s.actRedSpark = makeSpark(root, 16, RGB.red);
      s.readSpark = makeSpark(root, 16, RGB.violet);
      s.loopLabels = LOOP_LABELS.map(({ text }) => makeLabel(root, text));
      s.ripples = makeRipples(root, 2, RGB.violet);

      // the survey stat: the count, its caption and its source
      s.stat = E(root,
        `<div class="num" style="width:${STAT.numW}px;text-align:right;font-size:${STAT.numFont}px;`
        + `line-height:${STAT.numFont}px;letter-spacing:-4px;color:${C.red}">0%</div>`
        + `<div style="width:${STAT.captionW}px;margin-left:40px">`
        + '<div style="font-size:32px;line-height:40px">of companies saw agents do things nobody asked for</div>'
        + `<div class="mono" style="font-size:16px;line-height:20px;letter-spacing:.14em;color:${C.slate};`
        + 'margin-top:14px">SAILPOINT SURVEY, 2025</div></div>',
        '', {
          width: STAT.w + 'px', height: STAT.h + 'px', display: 'flex', alignItems: 'center',
          justifyContent: 'center',
        });
      s.statNum = s.stat.querySelector('.num');

      s.card = makeActionCard(root, ACTION);
      s.roles = Object.fromEntries(Object.entries(ROLES).map(([name, { text }]) => [name, makeLabel(root, text)]));
      // RECORDS reads toward the strip: its text keeps the 24 px gap to it
      s.roles.records.style.textAlign = 'right';
      s.writeSpark = makeSpark(root, 12, RGB.violet);
    },
    update(t, c, s) {
      const { board } = s;
      const { model, checkpoint, tools, history, laneY } = BOARD;
      const cyclesAt = c[0] + T0.cycles;
      const outAt = c[2] + T2.out;
      const landAt = c[2] + T2.drop + T2.dropD;

      // the camera holds; the checkpoint's landing jolts it; the default fade-out zooms through to chapter 2
      const [jx, jy] = shake(t, landAt, 8, 0.35);
      setCamera(s.cam, t, this.dur, { dx: jx, dy: jy, enter: 1 });

      // ---- c[0] and c[1]: the agent loop
      // the cycles whose act lands before the loop clears, then one last read of its result, after which the orb
      // decides until the checkpoint drops in; the cycle k running at t and how far into it (phase)
      const cycleCount = Math.min(ACT_ON.length, Math.floor((outAt - cyclesAt - CYCLE.hit) / CYCLE.d) + 1);
      const k = Math.floor((t - cyclesAt) / CYCLE.d);
      const phase = t - cyclesAt - k * CYCLE.d;
      const reading = k >= 0 && k <= cycleCount && phase < CYCLE.read;
      const deciding = k >= 0 && (k < cycleCount
        ? phase >= CYCLE.read && phase < CYCLE.act
        : (k > cycleCount || phase >= CYCLE.read) && t < outAt + 0.3);
      const acting = k >= 0 && k < cycleCount && phase >= CYCLE.act;
      const readFrom = i => i === 0 ? FIRST_READ : ACT_ON[i - 1];
      const loopO = P(t, c[0] + T0.loop, 0.5) * (1 - P(t, outAt, 0.4));
      // a red act: one that lands after c[1] starts, when the agent does things nobody asked for
      const actLandsAt = i => cyclesAt + i * CYCLE.d + CYCLE.hit;
      const isRed = i => actLandsAt(i) >= c[1];

      // the line back: drawn from the tool to the orb as the spark runs it, faded before the next cycle's read
      const readK = Math.min(k, cycleCount);
      if (readK >= 0) {
        setD(s.reads, readsD(readFrom(readK)));
        const prog = reading ? clamp(phase / CYCLE.read) : 1;
        const fade = readK < cycleCount ? P(phase, CYCLE.d - CYCLE.fade, CYCLE.fade, linear) : 0;
        draw(s.reads, prog, loopO * (1 - fade));
        sparkOnPath(s.readSpark, s.reads, reading ? prog : 0, loopO);
      } else {
        draw(s.reads, 0);
        sparkOnPath(s.readSpark, s.reads, 0);
      }
      // the line out: drawn from the orb to the tool as the spark runs it, faded before the next cycle's act; red
      // once the agent goes astray
      const actK = Math.min(acting ? k : k - 1, cycleCount - 1);
      if (actK >= 0) {
        setD(s.acts, actsD(ACT_ON[actK]));
        const red = isRed(actK);
        s.acts.setAttribute('stroke', red ? C.red : C.slate);
        s.acts._marker = red ? s.actsHeads.red : s.actsHeads.slate;
        const prog = acting ? clamp((phase - CYCLE.act) / (CYCLE.hit - CYCLE.act)) : 1;
        const fade = !acting && k < cycleCount ? P(phase, CYCLE.act - CYCLE.fade, CYCLE.fade, linear) : 0;
        draw(s.acts, prog, loopO * (1 - fade));
        sparkOnPath(s.actSpark, s.acts, acting && !red ? prog : 0, loopO);
        sparkOnPath(s.actRedSpark, s.acts, acting && red ? prog : 0, loopO);
      } else {
        draw(s.acts, 0);
        sparkOnPath(s.actSpark, s.acts, 0);
        sparkOnPath(s.actRedSpark, s.acts, 0);
      }
      // the labels: each one lights while its part of the cycle runs
      const lit = [reading, deciding, acting && phase < CYCLE.hit + 0.1];
      s.loopLabels.forEach((label, i) => {
        const { x, y } = LOOP_LABELS[i];
        place(label, x, y, 1, loopO * P(t, c[0] + T0.loop + i * 0.15, 0.4));
        label.style.color = lit[i] ? C.ink : C.slate;
      });

      // ---- the orb: its label fades in; it thinks while it decides, looks toward the tools while the loop runs, and
      // thinks again before it suggests the next step in c[3]
      place(board.orb.el, model.x, model.y, 1, 1);
      board.orb.label.style.opacity = P(t, c[0] + T0.label, 0.5);
      const thinkingInC3 = t >= c[3] + T3.think && t < c[3] + T3.emerge;
      const look = 0.5 * P(t, c[0] + T0.loop, 0.6);
      board.orb.set(deciding || thinkingInC3 ? 'thinking' : 'idle', { look });

      // ---- the tools: they pop in; each one the loop reaches lights violet, or flickers red after c[1] starts; the
      // card's tool lights neon as it lands
      const cardLandsAt = c[3] + T3.toTool + T3.toToolD;
      board.tools.forEach((tile, i) => {
        const pop = backPop(t, c[0] + T0.tools + i * T0.toolStep, 0.5);
        const [x, y] = toolSlot(i);
        place(tile, x, y, pop.s, pop.o);
        let violet = 0, red = 0;
        for (let j = 0; j < cycleCount; j++) {
          if (ACT_ON[j] !== i) continue;
          const since = t - actLandsAt(j);
          if (isRed(j)) red = Math.max(red, flicker(t, actLandsAt(j), j + 1));
          else if (since >= 0 && since < 0.6) violet = Math.max(violet, 1 - since / 0.6);
        }
        const neon = i === ACTION.toolIndex && t >= cardLandsAt ? 1 - 0.6 * P(t, cardLandsAt + 0.2, 0.8) : 0;
        let color = C.line, rgb = null, glow = 0;
        if (red > 0) [color, rgb, glow] = [C.red, RGB.red, red];
        else if (neon > 0) [color, rgb, glow] = [C.neon, RGB.neon, neon];
        else if (violet > 0) [color, rgb, glow] = [C.violet, RGB.violet, violet];
        tile.style.borderColor = glow > 0.3 ? color : C.line;
        tile.icon.setAttribute('stroke', red > 0.5 ? C.red : C.ink);
        tile.style.boxShadow = rgb ? glowShadow(rgb, glow, { blur: 26, alpha: 0.6 }) : '';
      });

      // ---- c[1]: the survey stat rises into the strip's place, counts up, and clears for the strip
      const statO = P(t, c[1] + T1.stat, 0.5) * (1 - P(t, outAt, 0.5));
      rise(s.stat, STAT.x, STAT.y, statO);
      if (t >= outAt) s.stat.style.transform += ` translateY(${Math.round(P(t, outAt, 0.5) * 30)}px)`;
      const count = Math.round(T1.value * P(t, c[1] + T1.count, T1.countD, easeOut));
      setText(s.statNum, count + '%');

      // ---- c[2]: the dramatic beat. The checkpoint drops in from above the frame and lands between the orb and the
      // tools; the lanes shoot out of it, YOUR WORKERS draws round the tools, the Event History strip rises in.
      const drop = P(t, c[2] + T2.drop, T2.dropD, easeIn);
      const cpY = Math.round(lerp(DROP_FROM, checkpoint.y, drop));
      place(board.checkpoint.el, checkpoint.x, cpY, 1, P(t, c[2] + T2.drop, 0.1, linear));
      placeRipples(s.ripples, t, landAt, checkpoint.x, laneY, 200, 640, { d: 0.9, step: 0.2 });
      const yourCodeGlow = Math.max(0, 1 - Math.abs(t - c[2] - T2.yourCode - 0.3) / 0.6);
      const landGlow = t >= landAt ? 1 - P(t, landAt, 1.0) : 0;
      place(s.halo, checkpoint.x, checkpoint.y, 1, Math.max(landGlow, 0.8 * yourCodeGlow));
      board.lanes.forEach((lane, i) => draw(lane, P(t, c[2] + T2.lanes + i * 0.15, 0.5, easeOut)));
      const zone = P(t, c[2] + T2.zone, 0.6);
      place(board.zone, tools.x, tools.y, lerp(1.04, 1, zone), zone);
      rise(board.history, history.x, history.y, P(t, c[2] + T2.history, 0.6), 30);

      // ---- c[3]: the model suggests a step; the Workflow decides, then writes it down
      const emergeAt = c[3] + T3.emerge;
      const throughAt = c[3] + T3.through;
      // the card reaches the beam halfway through its pass (the pass eases in and out)
      const passAt = throughAt + T3.throughD / 2;
      const toToolAt = c[3] + T3.toTool;
      const stops = actionStops(s.card, ACTION.toolIndex);
      const emerge = P(t, emergeAt, T3.emergeD);
      const through = P(t, throughAt, T3.throughD);
      const toTool = P(t, toToolAt, T3.toToolD);
      let [cx, cy] = [lerp(stops.from[0], stops.gate[0], emerge), laneY];
      if (through > 0) cx = lerp(stops.gate[0], stops.past[0], through);
      if (toTool > 0) [cx, cy] = [lerp(stops.past[0], stops.tool[0], toTool), lerp(stops.past[1], stops.tool[1], toTool)];
      const cardScale = lerp(0.3, 1, emerge) * lerp(1, 0.5, P(t, toToolAt + T3.toToolD * 0.6, T3.toToolD * 0.4));
      const cardO = P(t, emergeAt, 0.25) * (1 - P(t, toToolAt + T3.toToolD * 0.7, T3.toToolD * 0.3));
      s.card.place(cx, cy, cardScale, cardO);
      s.card.setTone(t >= passAt ? 'neon' : null);
      board.checkpoint.check(t, passAt, 'pass');

      // the roles: SUGGESTS as the card grows out of the orb, DECIDES as it passes, RECORDS with the first row
      const rowsAt = T3.rows.map(at => c[3] + at);
      const roleAt = { suggests: c[3] + T3.suggests, decides: passAt - 0.1, records: rowsAt[0] - WRITE_D };
      Object.entries(s.roles).forEach(([name, label]) => {
        const { x, y } = ROLES[name];
        rise(label, x, y, P(t, roleAt[name], 0.4), 12);
        label.style.color = C.ink;
      });

      // the Event History: a spark drops from the checkpoint to the strip, then the row slides in
      fillHistoryStrip(board.history, t, [
        { at: rowsAt[0], tag: 'SAVED', tone: 'saved' },
        { at: rowsAt[1], tag: 'ALLOWED', tone: 'neon' },
      ]);
      const writing = rowsAt.map(at => (t - (at - WRITE_D)) / WRITE_D).find(u => u > 0 && u < 1);
      const cpBottom = checkpoint.y + checkpoint.h / 2;
      const stripTop = history.y - history.h / 2;
      if (writing === undefined) {
        place(s.writeSpark, 0, 0, 1, 0);
      } else {
        place(s.writeSpark, checkpoint.x, lerp(cpBottom, stripTop, writing), 1, Math.min(1, (1 - writing) * 4));
      }
    }
  });
}
