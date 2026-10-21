// ===================== 1. AGENTS THAT ACT
// Opens on the intro's last frame (a match cut, see INTRO_ORB): the orb glides on from there to its place on the
// board, held lower by the camera (CAMERA) while the loop fills the frame. Its AI MODEL label fades in, the four
// general tools pop in on the right (TERMINAL, BROWSER, CODE, ADD-ONS), and the
// agent loops: it reads (a spark runs back from a tool to the orb), decides (the orb thinks) and acts (a spark runs
// out to the next tool), the READS, DECIDES and ACTS labels lighting in turn. In c[1] the loop clears, each tool
// lights as it is named, then the tools' reach fans out in red lines to what they can touch, FILES, KEYS, THE
// INTERNET and DATABASES, the camera rising to the row as it comes in, and the red beat lands on "the bad
// included": the targets flare red, ripples and a jolt.
// In c[2] the reach pulls back and the WORKFLOW checkpoint drops in between the orb and the tools: the lanes shoot
// out of it, YOUR WORKERS draws round the tools and the Event History strip rises under it, the board every later
// chapter uses. The first step starts: the orb thinks, an action card grows out of it and stops at the checkpoint,
// which records the model's pick in the Event History. In c[3] each part gets its role: the orb THINKS; the card
// passes the checkpoint (your code, where the agent's state lives) and lands on its tool, which ACTS on the servers
// you choose (YOUR WORKERS lights up); the checkpoint KEEPS STATE and the Event History RECORDS the step. The camera
// holds from c[1] on; the default fade-out plays the camera zoom-through (setCamera) into chapter 2.
// The block keeps every name declared in this file local to this scene.
{
  // the beats of c[0], in seconds from c[0]: the orb glides from the intro's spot to its place on the board as the
  // scene opens (settle, over settleD); the AI MODEL label fades in as "AI model" is read (label); the tools pop in
  // one after the other as "tools" is read (tools, toolStep); the loop's labels fade in (loop) and its first cycle
  // starts as "reads" is read (cycles)
  const T0 = { settle: -0.6, settleD: 1.6, label: 0.9, tools: 1.9, toolStep: 0.1, loop: 2.4, cycles: 2.7 };
  // one cycle of the agent loop, in seconds from its start: it reads (a spark from a tool to the orb, 0 to read),
  // decides (the orb thinks, read to act) and acts (a spark from the orb to the next tool, act to hit); each line
  // fades out over fade seconds before it is drawn again for the next cycle
  const CYCLE = { d: 1.9, read: 0.6, act: 1.2, hit: 1.8, fade: 0.3 };
  // the tool each read comes from: the first one reads the terminal, every next one the tool the agent just acted
  // on; the tools the agent acts on, in turn
  const FIRST_READ = 0;
  const ACT_ON = [1, 2, 3, 0, 1, 2];
  // the beats of c[1], from c[1]: the loop clears (loopOut); each tool lights as it is named (named, add-ons right
  // after code); the camera rises to the targets' row (pan, over panD), easing out as the reach fans out of the tools
  // (reach) and the row comes in; the red beat lands on "the bad included" (beat)
  const T1 = { loopOut: 0.9, named: [1.4, 2.1, 2.8, 3.0], pan: 2.4, panD: 1.8, reach: 3.3, beat: 5.0 };
  // the beats of c[2], from c[2]: the reach pulls back into the tools and its targets sink away (out, over outD);
  // the checkpoint drops in (drop, dropD, landing at drop + dropD), the lanes shoot out of it (lanes), YOUR WORKERS
  // draws round the tools (zone), the Event History strip rises in (history); the checkpoint glows as "your code" is
  // read (yourCode). Once the board stands, the first step starts: the orb thinks (think), the action card grows out
  // of it and travels to the checkpoint (emerge, emergeD), where it waits; the Event History writes the model's pick
  // as "records" is read (row)
  const T2 = {
    out: 0, outD: 0.45, drop: 0.5, dropD: 0.45, lanes: 1.0, zone: 1.5, history: 2.1, yourCode: 3.2,
    think: 3.2, emerge: 3.7, emergeD: 0.8, row: 4.8,
  };
  // the beats of c[3], from c[3]: THINKS lights (think); the card passes the checkpoint (through, throughD) and lands
  // on its tool (toTool, toToolD); ACTS lights as "the tools act" is read (acts) and YOUR WORKERS glows on "each
  // where you choose" (zone); the Event History writes the step (row); KEEPS STATE lights with the checkpoint's glow
  // on "keeps the state" (keeps), RECORDS with the strip's glow on "the record" (records)
  const T3 = {
    think: 0.2, through: 1.4, throughD: 0.5, toTool: 1.95, toToolD: 0.8, acts: 1.4, zone: 2.1, row: 3.0, keeps: 3.9,
    records: 5.2,
  };

  // the camera: the board shifts 60 px left all along, so the board (x 240-1800) centers on x 960; in c[0], the loop
  // (y 201-641 on the board) sits dy px lower, centered in the frame, then the camera rises to the board as the
  // targets' row comes in (T1.pan) and holds there, the row and later the Event History filling the frame's bottom.
  // The scene opens on the intro's last frame: the orb starts at the intro's spot, (INTRO_ORB.x, INTRO_ORB.y) on
  // screen, and glides to its place on the board (T0.settle)
  const CAMERA = { dx: -60, dy: 80 };

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

  // what the tools can reach, a row of tiles under the board's orb and tools: equal tiles, `gap` px apart, the row's
  // left edge on the orb's left edge (x 240), its last tile, DATABASES, right under the tool tiles (x 1410-1770, as
  // wide), and its center line on the Event History strip's, which rises there after them
  const TARGETS = [
    { icon: 'file', label: 'Files' },
    { icon: 'key', label: 'Keys' },
    { icon: 'cloud', label: 'The internet' },
    { icon: 'database', label: 'Databases' },
  ];
  const TARGET = { w: TOOL_TILE.w, h: 64, gap: 30, left: BOARD.model.x - BOARD.model.size / 2, y: BOARD.history.y };
  const targetX = j => TARGET.left + TARGET.w / 2 + j * (TARGET.w + TARGET.gap);
  const targetTop = TARGET.y - TARGET.h / 2;
  // how much a target swells at the beat: 8 %, 14 px on either side, inside half the gap between two targets
  const SWELL = 0.08;
  // the reach lines: each tool's lines leave its left edge at LOOP.toolX, head left, then bend down into the targets'
  // top edges, tool i entering every target spread px right of the tool before it (centered on the target); each line
  // draws over d seconds, the lines of tool i step * i after the first ones, those to target j stepJ * j after.
  // The lines to DATABASES, under the tools, go round them: tool i's line turns down at x downX + i * downStep (the
  // top tool's outermost, so the lines nest without crossing), runs down to turnY, under the tool column, then
  // curves right into the tile
  const REACH = { spread: 24, d: 0.7, step: 0.12, stepJ: 0.05, downX: 1300, downStep: 16, turnY: 650 };
  const reachAt = (c, i, j) => c[1] + T1.reach + i * REACH.step + j * REACH.stepJ;

  // the roles of c[3]: THINKS above the orb, KEEPS STATE above the checkpoint and ACTS above the YOUR WORKERS zone,
  // on one line (y 160-186), 24 px above the checkpoint's and the zone's tops (y 210); RECORDS left of the Event
  // History strip, its right edge 24 px clear of the strip. LABEL_H: a label's height (Mono 20 px on its line)
  const LABEL_H = 26;
  const ROLE_Y = BOARD.checkpoint.y - BOARD.checkpoint.h / 2 - 24 - LABEL_H / 2;
  const ROLES = {
    thinks: { text: 'Thinks', x: BOARD.model.x, y: ROLE_Y },
    acts: { text: 'Acts', x: BOARD.tools.x, y: ROLE_Y },
    keeps: { text: 'Keeps state', x: BOARD.checkpoint.x, y: ROLE_Y },
    records: { text: 'Records', right: BOARD.history.x - BOARD.history.w / 2 - 24, y: BOARD.history.y },
  };
  // where the checkpoint drops in from: above the frame
  const DROP_FROM = -120;
  // the action card and the rows it leaves in the Event History
  const ACTION = { tool: 'open_page', arg: 'a supplier price list', toolIndex: 1 };
  const HISTORY_ROWS = [
    'model picks <b>open_page</b>',
    '<b>open_page</b> supplier price list',
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
  // SVG path of the reach line from tool i to target j; its first control point stays 60 px right of the target, so a
  // line to a target near the tools bends straight down without a hook. A target under the tools (DATABASES) gets a
  // line round them, see REACH
  const reachD = (i, j) => {
    const y = toolSlot(i)[1];
    const x = targetX(j) + (i - 1.5) * REACH.spread;
    const underTools = targetX(j) - TARGET.w / 2 > LOOP.toolX;
    if (underTools) {
      const downX = REACH.downX + i * REACH.downStep;
      const midY = (REACH.turnY + targetTop) / 2;
      return `M ${LOOP.toolX} ${y} C ${downX} ${y} ${downX} ${y} ${downX} ${y + 40} L ${downX} ${REACH.turnY}`
        + ` C ${downX} ${midY} ${x} ${midY} ${x} ${targetTop}`;
    }
    const bendX = Math.max(LOOP.toolX - 160, x + 60);
    return `M ${LOOP.toolX} ${y} C ${bendX} ${y} ${x} ${targetTop - 200} ${x} ${targetTop}`;
  };
  // The width of a label of this text, px: Mono 20 px with .12em spacing advances 14.4 px per character, plus its
  // padding-left of .12em; even, so the label rests on whole pixels at a whole center
  const labelWidth = text => 2 * Math.ceil((text.length * 14.4 + 2.4) / 2) + 2;
  // A label of fixed even width (see labelWidth), its text centered
  const makeLabel = (root, text) => E(root, text, 'lbl', { width: labelWidth(text) + 'px', textAlign: 'center' });
  // A target tile (TARGET.w x h): its icon and its label, centered side by side. tile.icon: its <svg>.
  const makeTargetTile = (root, { icon, label }) => {
    const tile = E(root,
      `${ICON(icon, 28, C.slate, 1.8)}<span class="lbl" style="color:var(--ink)">${label}</span>`,
      'tile', {
        width: TARGET.w + 'px', height: TARGET.h + 'px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '14px',
      });
    tile.icon = tile.querySelector('svg');
    return tile;
  };
  // A red outline round a target tile, which grows out of it and fades at the beat (see placePulse)
  const makePulse = root => E(root, '', '', { border: `3px solid ${C.red}`, borderRadius: 'var(--r)' });
  // The pulse grows from the tile's size to `grow` px wider and higher over d seconds from `at`, fading out; sized,
  // not scaled, so it keeps its 3 px line, and in even sizes, so it stays centered on whole pixels
  const placePulse = (e, t, at, x, y, { grow = 64, d = 0.8 } = {}) => {
    const p = P(t, at, d, easeOut);
    const extra = 2 * Math.round(grow * p / 2);
    e.style.width = (TARGET.w + extra) + 'px';
    e.style.height = (TARGET.h + extra) + 'px';
    place(e, x, y, 1, p > 0 && p < 1 ? 0.9 * (1 - p) : 0);
  };
  // A glow that peaks at `at` and fades in and out over `half` seconds on either side; 0 outside
  const peak = (t, at, half) => Math.max(0, 1 - Math.abs(t - at) / half);

  scene({
    chapter: 1, title: 'Agents that act',
    // a hard cut: the intro ends on this chapter's first frame; the default fade-out to the next scene
    fadeIn: 0,
    subs: [
      { text: "An <b>AI agent</b> is an AI model with tools: it reads, decides, then acts, one step after another." },
      { text: "Its tools are often a terminal, a browser or code: almost anything is possible, the bad included." },
      {
        text: "With <b>Temporal</b>, the agent runs as a <b>Workflow</b>: your code, "
          + "which runs and records every step.",
      },
      // the strip's glow on "the record", then a hold before the zoom-through
      {
        text: "The model thinks, the tools act, each where you choose. Temporal keeps the state and the record.",
        after: 0.6,
      },
    ],
    build(stage, s) {
      const root = s.cam = makeCamera(stage);
      // the checkpoint's halo as it lands, under the board
      s.halo = E(root, '', '', { width: '560px', height: '560px', borderRadius: '50%',
        background: haloBackground(0.24, 0.12, 40, 68) });
      // the targets of the tools' reach, under the board (the strip rises where they were)
      s.targets = TARGETS.map(target => makeTargetTile(root, target));
      s.targetPulses = TARGETS.map(() => [makePulse(root), makePulse(root)]);
      // the board, its orb with the intro's seed, so its blink matches across the cut
      s.board = makeBoard(root, { historyRows: HISTORY_ROWS, uvRow: i => i === 0, seed: INTRO_ORB.seed });
      s.board.orb.label.style.opacity = 0;
      s.zoneRect = s.board.zone.querySelector('rect');
      // the loop's two lines and the sparks that run along them, in the board's SVG layer, under the checkpoint and
      // the orb
      s.acts = path(s.board.svg, actsD(0), C.slate, 2.5);
      s.reads = path(s.board.svg, readsD(0), C.slate, 2.5);
      s.actSpark = makeSpark(root, 16, RGB.violet);
      s.readSpark = makeSpark(root, 16, RGB.violet);
      s.loopLabels = LOOP_LABELS.map(({ text }) => makeLabel(root, text));
      // the reach: one red line from each tool to each target, a red spark on the head of each while it draws
      s.reach = TOOLS.map((_, i) => TARGETS.map((__, j) => path(s.board.svg, reachD(i, j), C.red, 2, false)));
      s.reachSparks = TOOLS.map(() => TARGETS.map(() => makeSpark(root, 10, RGB.red)));
      s.ripples = makeRipples(root, 2, RGB.violet);

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
      const loopOutAt = c[1] + T1.loopOut;
      const beatAt = c[1] + T1.beat;
      const outAt = c[2] + T2.out;
      const landAt = c[2] + T2.drop + T2.dropD;

      // the camera holds the loop lower in c[0], rises to the board in c[1] and holds; the red beat and the
      // checkpoint's landing jolt it; the default fade-out zooms through to chapter 2
      const [bx, by] = shake(t, beatAt, 10, 0.45);
      const [jx, jy] = shake(t, landAt, 8, 0.35);
      const camDy = Math.round(CAMERA.dy * (1 - P(t, c[1] + T1.pan, T1.panD)));
      setCamera(s.cam, t, this.dur, { dx: CAMERA.dx + bx + jx, dy: camDy + by + jy, enter: 1 });

      // ---- c[0]: the agent loop
      // the cycles whose act lands before c[1] starts, then one last read of its result, after which the orb decides
      // until the loop clears; the cycle k running at t and how far into it (phase)
      const actLandsAt = i => cyclesAt + i * CYCLE.d + CYCLE.hit;
      const cycleCount = Math.min(ACT_ON.length, Math.floor((c[1] - actLandsAt(0)) / CYCLE.d) + 1);
      const k = Math.floor((t - cyclesAt) / CYCLE.d);
      const phase = t - cyclesAt - k * CYCLE.d;
      const reading = k >= 0 && k <= cycleCount && phase < CYCLE.read;
      const deciding = k >= 0 && (k < cycleCount
        ? phase >= CYCLE.read && phase < CYCLE.act
        : (k > cycleCount || phase >= CYCLE.read) && t < loopOutAt + 0.3);
      const acting = k >= 0 && k < cycleCount && phase >= CYCLE.act;
      const readFrom = i => i === 0 ? FIRST_READ : ACT_ON[i - 1];
      const loopO = P(t, c[0] + T0.loop, 0.5) * (1 - P(t, loopOutAt, 0.4));

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
      // the line out: drawn from the orb to the tool as the spark runs it, faded before the next cycle's act
      const actK = Math.min(acting ? k : k - 1, cycleCount - 1);
      if (actK >= 0) {
        setD(s.acts, actsD(ACT_ON[actK]));
        const prog = acting ? clamp((phase - CYCLE.act) / (CYCLE.hit - CYCLE.act)) : 1;
        const fade = !acting && k < cycleCount ? P(phase, CYCLE.act - CYCLE.fade, CYCLE.fade, linear) : 0;
        draw(s.acts, prog, loopO * (1 - fade));
        sparkOnPath(s.actSpark, s.acts, acting ? prog : 0, loopO);
      } else {
        draw(s.acts, 0);
        sparkOnPath(s.actSpark, s.acts, 0);
      }
      // the labels: each one lights while its part of the cycle runs
      const lit = [reading, deciding, acting && phase < CYCLE.hit + 0.1];
      s.loopLabels.forEach((label, i) => {
        const { x, y } = LOOP_LABELS[i];
        place(label, x, y, 1, loopO * P(t, c[0] + T0.loop + i * 0.15, 0.4));
        label.style.color = lit[i] ? C.ink : C.slate;
      });

      // ---- the orb: it glides from the intro's spot on screen to its place; its label fades in; it thinks while it
      // decides, looks toward the tools once the loop runs, and thinks again before its step in c[2]
      const settle = P(t, c[0] + T0.settle, T0.settleD);
      const orbX = Math.round(lerp(INTRO_ORB.x - CAMERA.dx, model.x, settle));
      const orbY = Math.round(lerp(INTRO_ORB.y - CAMERA.dy, model.y, settle));
      place(board.orb.el, orbX, orbY, 1, 1);
      board.orb.label.style.opacity = P(t, c[0] + T0.label, 0.5);
      const thinkingInC2 = t >= c[2] + T2.think && t < c[2] + T2.emerge;
      const look = 0.5 * P(t, c[0] + T0.loop, 0.6);
      board.orb.set(deciding || thinkingInC2 ? 'thinking' : 'idle', { look });

      // ---- c[1]: the reach. Each line draws out of its tool into its target, then pulls back into the tool as
      // c[2] starts; the lines flare at the beat
      const pullBack = 1 - P(t, outAt, T2.outD, easeIn);
      const beatGlow = t >= beatAt ? 1 - P(t, beatAt, 0.9) : 0;
      s.reach.forEach((lines, i) => lines.forEach((line, j) => {
        const prog = P(t, reachAt(c, i, j), REACH.d, easeOut);
        draw(line, prog * pullBack, lerp(0.55, 1, beatGlow));
        sparkOnPath(s.reachSparks[i][j], line, prog < 1 ? prog : 0);
      }));
      // the targets: each pops in as its first line reaches it, flares red at the beat (a swell, pulses), keeps a red
      // border, and sinks away as c[2] starts
      const sink = P(t, outAt, T2.outD, easeIn);
      s.targets.forEach((tile, j) => {
        const reachedAt = reachAt(c, 0, j) + REACH.d * 0.8;
        const pop = backPop(t, reachedAt, 0.45);
        const flare = t >= beatAt + j * 0.04 ? 1 - P(t, beatAt + j * 0.04, 1.2) : 0;
        const x = targetX(j), y = TARGET.y + Math.round(30 * sink);
        place(tile, x, y, pop.s * swell(t, beatAt + j * 0.04, SWELL), pop.o * (1 - sink));
        const red = t >= reachedAt;
        tile.style.borderColor = red ? C.red : C.line;
        tile.icon.setAttribute('stroke', red ? C.red : C.slate);
        tile.style.background = t >= beatAt ? `rgba(${RGB.red},.14)` : '';
        tile.style.boxShadow = red ? glowShadow(RGB.red, Math.max(0.35, flare), { blur: 30, alpha: 0.7 }) : '';
        s.targetPulses[j].forEach((pulse, n) => placePulse(pulse, t, beatAt + j * 0.04 + n * 0.18, x, TARGET.y));
      });

      // ---- the tools: they pop in; each one the loop reaches lights violet; in c[1] each lights violet as it is
      // named, then turns red as its reach fans out, flares at the beat and calms as c[2] starts; the card's tool
      // lights neon as it lands in c[3]
      const cardLandsAt = c[3] + T3.toTool + T3.toToolD;
      board.tools.forEach((tile, i) => {
        const pop = backPop(t, c[0] + T0.tools + i * T0.toolStep, 0.5);
        const [x, y] = toolSlot(i);
        place(tile, x, y, pop.s, pop.o);
        let violet = 0;
        for (let j = 0; j < cycleCount; j++) {
          const since = t - actLandsAt(j);
          if (ACT_ON[j] === i && since >= 0 && since < 0.6) violet = Math.max(violet, 1 - since / 0.6);
        }
        // named, it glows violet until its reach turns it red
        const namedAt = c[1] + T1.named[i];
        const redAt = reachAt(c, i, 0);
        if (t >= namedAt && t < redAt) violet = Math.max(violet, 1 - 0.4 * P(t, namedAt, 0.6));
        const red = t >= redAt ? Math.max(0.45, beatGlow) * (1 - P(t, outAt, T2.outD)) : 0;
        const neon = i === ACTION.toolIndex && t >= cardLandsAt ? 1 - 0.6 * P(t, cardLandsAt + 0.2, 0.8) : 0;
        let color = C.line, rgb = null, glow = 0;
        if (red > 0) [color, rgb, glow] = [C.red, RGB.red, red];
        else if (neon > 0) [color, rgb, glow] = [C.neon, RGB.neon, neon];
        else if (violet > 0) [color, rgb, glow] = [C.violet, RGB.violet, violet];
        tile.style.borderColor = glow > 0.3 ? color : C.line;
        tile.icon.setAttribute('stroke', red > 0.3 ? C.red : C.ink);
        tile.style.boxShadow = rgb ? glowShadow(rgb, glow, { blur: 26, alpha: 0.6 }) : '';
      });

      // ---- c[2]: the checkpoint drops in from above the frame and lands between the orb and the tools; the lanes
      // shoot out of it, YOUR WORKERS draws round the tools, the Event History strip rises in.
      const drop = P(t, c[2] + T2.drop, T2.dropD, easeIn);
      const cpY = Math.round(lerp(DROP_FROM, checkpoint.y, drop));
      place(board.checkpoint.el, checkpoint.x, cpY, 1, P(t, c[2] + T2.drop, 0.1, linear));
      placeRipples(s.ripples, t, landAt, checkpoint.x, laneY, 200, 640, { d: 0.9, step: 0.2 });
      const yourCodeGlow = peak(t, c[2] + T2.yourCode + 0.3, 0.6);
      const keepsGlow = peak(t, c[3] + T3.keeps + 0.4, 0.7);
      const landGlow = t >= landAt ? 1 - P(t, landAt, 1.0) : 0;
      place(s.halo, checkpoint.x, checkpoint.y, 1, Math.max(landGlow, 0.8 * yourCodeGlow, 0.8 * keepsGlow));
      board.lanes.forEach((lane, i) => draw(lane, P(t, c[2] + T2.lanes + i * 0.15, 0.5, easeOut)));
      const zone = P(t, c[2] + T2.zone, 0.6);
      place(board.zone, tools.x, tools.y, lerp(1.04, 1, zone), zone);
      rise(board.history, history.x, history.y, P(t, c[2] + T2.history, 0.6), 30);

      // ---- the step: the model thinks it up in c[2] and it waits at the checkpoint; in c[3] it passes the Workflow
      // and lands on its tool, and each part gets its role
      const emergeAt = c[2] + T2.emerge;
      const throughAt = c[3] + T3.through;
      // the card reaches the beam halfway through its pass (the pass eases in and out)
      const passAt = throughAt + T3.throughD / 2;
      const toToolAt = c[3] + T3.toTool;
      const stops = actionStops(s.card, ACTION.toolIndex);
      const emerge = P(t, emergeAt, T2.emergeD);
      const through = P(t, throughAt, T3.throughD);
      const toTool = P(t, toToolAt, T3.toToolD);
      let [cx, cy] = [lerp(stops.from[0], stops.gate[0], emerge), laneY];
      if (through > 0) cx = lerp(stops.gate[0], stops.past[0], through);
      if (toTool > 0) [cx, cy] = lerp2(stops.past, stops.tool, toTool);
      const cardScale = lerp(0.3, 1, emerge) * lerp(1, 0.5, P(t, toToolAt + T3.toToolD * 0.6, T3.toToolD * 0.4));
      const cardO = P(t, emergeAt, 0.25) * (1 - P(t, toToolAt + T3.toToolD * 0.7, T3.toToolD * 0.3));
      s.card.place(cx, cy, cardScale, cardO);
      s.card.setTone(t >= passAt ? 'neon' : null);
      board.checkpoint.check(t, passAt, 'pass');

      // YOUR WORKERS glows on "each where you choose": its outline turns violet, a soft glow round it
      const zoneGlow = peak(t, c[3] + T3.zone + 0.5, 0.8);
      s.zoneRect.setAttribute('stroke', zoneGlow > 0.3 ? C.violet : C.slate);
      board.zone.style.filter = zoneGlow > 0 ? `drop-shadow(0 0 ${Math.round(14 * zoneGlow)}px `
        + `rgba(${RGB.violet},${(0.8 * zoneGlow).toFixed(3)}))` : '';
      // the Event History glows on "the record"
      const recordGlow = peak(t, c[3] + T3.records + 0.5, 0.8);
      board.history.style.boxShadow = glowShadow(RGB.violet, recordGlow, { blur: 40, alpha: 0.7 });

      // the roles, each rising as its part is read
      const roleAt = { thinks: T3.think, acts: T3.acts, keeps: T3.keeps, records: T3.records };
      Object.entries(s.roles).forEach(([name, label]) => {
        const { x, right, y } = ROLES[name];
        const centerX = x === undefined ? right - labelWidth(ROLES[name].text) / 2 : x;
        rise(label, centerX, y, P(t, c[3] + roleAt[name], 0.4), 12);
        label.style.color = C.ink;
      });

      // the Event History: a spark drops from the checkpoint to the strip, then the row slides in; the model's pick
      // in c[2], the step in c[3]
      const rowsAt = [c[2] + T2.row, c[3] + T3.row];
      fillHistoryStrip(board.history, t, [
        { at: rowsAt[0], tag: 'SAVED', tone: 'saved' },
        { at: rowsAt[1], tag: 'DONE', tone: 'neon' },
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
