// ===================== Temporal Proxy 1.0 helpers (shared by the scenes of this theme)
// The components (payload card, zones, TLS tube, verdict tags, Worker tiles, proxy box, YOUR KMS, shot()) come from
// src/shared.js; this file holds the theme's layout, in stage px, and the hand-offs of its match cuts.

// ---------- the layout
// The wire's line, stage y: the channel between the two rows of Workers, where their connections run, the proxy
// sits and its TLS tube goes out
const WIRE_Y = 515;
// The wide shot, [x, y, scale] for shot(): the whole fleet, a little smaller than at rest. The intro's ending, chapter
// 1 and chapter 2's opening hold it; the fleet layout (FLEET) fills it: it frames stage x 5-1915 and y 100-930 as the
// content frame, so the zones (y 117-917) show at y 165-869 on screen, and the composition at x 125-1795.
const WIDE_SHOT = [960, 515, 0.88];
// The fleet layout, in stage px (on screen, 0.88 of it in WIDE_SHOT). env and temporal: the zones' left edge and width
// without the proxy (the intro's ending and chapter 1: YOUR ENVIRONMENT holding the six Workers, TEMPORAL wide enough
// for the list of connections, 136 px apart); proxyEnv and proxyTemporal: with the proxy (chapter 2 on), the
// environment wider, its right edge on the proxy box (PROXY), and TEMPORAL narrower, its right edge kept, wide enough
// for a Namespace band or a list of stored payloads, 150 px clear of the box for the TLS tube and its label. y and h:
// both zones' top and height. The Worker tiles (WORKER_TILE, 296 x 262) sit in two rows (rows: their center y) of three
// columns (cols: their center x), 48 px apart, 44 px inside the environment's sides and 46 px under its heading;
// between the rows runs a 72 px channel, on the wire's line, where each Worker's connection has a track of its own,
// `track` px from the next (fleetLinkD); under them, 104 px for a tag (UNDER_WORKERS). The zones' widths are even
// (lerpZone).
const FLEET = {
  y: 117, h: 800,
  env: { x: 11, w: 1072 }, temporal: { x: 1219, w: 690 },
  proxyEnv: { x: 11, w: 1248 }, proxyTemporal: { x: 1509, w: 400 },
  rows: [348, 682],
  cols: [203, 547, 891],
  track: 6,
};
// The zone rectangles for placeZones(): without the proxy (FLEET_ZONES) and with it (PROXY_ZONES)
const fleetZone = ({ x, w }) => ({ x, y: FLEET.y, w, h: FLEET.h });
const FLEET_ZONES = { env: fleetZone(FLEET.env), temporal: fleetZone(FLEET.temporal) };
const PROXY_ZONES = { env: fleetZone(FLEET.proxyEnv), temporal: fleetZone(FLEET.proxyTemporal) };
// The Worker tile at column col and row row: its center (x, y) and the y of its connection's track in the channel. A
// tile's track lies closer to the channel's middle the further left its column, so no connection crosses another
// tile's link down to its track.
function fleetSlot(col, row) {
  const offset = (col + 0.5) * FLEET.track;
  return { col, row, x: FLEET.cols[col], y: FLEET.rows[row], trackY: WIRE_Y + (row ? offset : -offset) };
}
// The six Workers, two in each language: lang, the language of its code (a key of LANGUAGE_LOGOS), and its slot
// (fleetSlot)
const WORKERS = [
  ['Go', 0, 0], ['Java', 1, 0], ['TypeScript', 2, 0], ['Java', 0, 1], ['TypeScript', 1, 1], ['Go', 2, 1],
].map(([lang, col, row]) => ({ lang, ...fleetSlot(col, row) }));
// SVG path of a Worker's connection, up to x1: from the middle of the tile's edge on the channel side, along its
// track (a rounded corner between them)
function fleetLinkD({ x, row, trackY }, x1) {
  const edgeY = row ? FLEET.rows[1] - WORKER_TILE.h / 2 : FLEET.rows[0] + WORKER_TILE.h / 2;
  return roundedPath([[x, edgeY], [x, trackY], [x1, trackY]], 4);
}
// Where a Worker's connection ends on TEMPORAL's left edge without the proxy, 4 px short of it, so its round cap
// stays off the border
const TEMPORAL_LINK_END = FLEET.temporal.x - 4;
// Where a tag about the Workers sits, centered under them, between their bottom row and the environment's bottom
// edge (NO SECRETS): its center and height
const UNDER_WORKERS = {
  x: (WORKERS[0].x + WORKERS[2].x) / 2, y: (FLEET.rows[1] + WORKER_TILE.h / 2 + FLEET.y + FLEET.h) / 2, h: 32,
};

// ---------- Temporal Proxy
// The TEMPORAL PROXY box (makeProxy): centered on the right edge of the widened environment (PROXY_ZONES.env), on the
// wire's line, 120 px clear of the Workers' right column; its size and head as PROXY_BOX's (200 x 300)
const PROXY = { x: FLEET.proxyEnv.x + FLEET.proxyEnv.w, y: WIRE_Y, ...PROXY_BOX };
// Where the Workers' connections end on the box's left, 4 px short of its edge, so their round caps stay off it
PROXY.linkEnd = PROXY.x - PROXY.w / 2 - 4;
// The proxy's connection to TEMPORAL, from the box's right edge to TEMPORAL's left edge with the proxy
const PROXY_WIRE = { x0: PROXY.x + PROXY.w / 2, x1: FLEET.proxyTemporal.x, y: WIRE_Y };
// The TLS tube that the proxy adds on the way out (makeTube, placeTube): from the box's right edge to 12 px inside
// TEMPORAL, on the wire's line, high enough to hold a card and its tags; its label above it, centered between the box
// and TEMPORAL, 19 px clear of both
const PROXY_TUBE = { x0: PROXY_WIRE.x0, x1: PROXY_WIRE.x1 + 12, y: WIRE_Y, h: 176 };
PROXY_TUBE.label = { x: (PROXY_WIRE.x0 + PROXY_WIRE.x1) / 2, y: PROXY_TUBE.y - PROXY_TUBE.h / 2 - 36 };
// The payments Namespace inside TEMPORAL with the proxy that chapter 2's card goes into (makeProxyBand): its center,
// in the middle of TEMPORAL, and size; card: where the card (PROXY_CARD) rests in it, under its name, its padlock clear
// of the name, its tags under it. In PROXY_SHOT it shows whole, at x 1320-1680 and y 305-725 on screen.
const PROXY_BAND = { x: FLEET.proxyTemporal.x + FLEET.proxyTemporal.w / 2, y: WIRE_Y, w: 240, h: 280 };
PROXY_BAND.card = { x: PROXY_BAND.x, y: PROXY_BAND.y - PROXY_BAND.h / 2 + 78 + PROXY_CARD.h / 2 };
// The proxy box at PROXY moved by (dx, dy), at scale s, with opacity o and a violet glow of strength glow (0 to 1)
function placeProxy(box, { dx = 0, dy = 0, s = 1, o = 1, glow = 0 } = {}) {
  place(box, PROXY.x + dx, PROXY.y + dy, s, o);
  setProxyGlow(box, glow);
}
// The neon 1.0 badge of the release: dark bold figures on solid neon, its size and font, px; dy: from the proxy box's
// center to the badge's, which centers it in the room under the box's name
const VERSION_BADGE = { w: 112, h: 56, font: 34, dy: PROXY_BOX.head.bottom / 2 };
// The 1.0 badge (VERSION_BADGE), with a neon glow; place() shows it. The intro pops it onto the proxy box, chapter 5
// lights the version up, and the outro opens on the box wearing it.
function makeVersionBadge(root) {
  return E(root, '1.0', 'mono', {
    width: VERSION_BADGE.w + 'px', height: VERSION_BADGE.h + 'px', lineHeight: VERSION_BADGE.h + 'px',
    textAlign: 'center', fontSize: VERSION_BADGE.font + 'px', fontWeight: '700', color: C.bg, background: C.neon,
    borderRadius: 'var(--rs)', boxShadow: `0 0 28px rgba(${RGB.neon},.55)`,
  });
}
// The two lines each Worker knows behind the proxy (WORKER_LINES: proxy:7233 and payments) and FULL_NS
// (payments.a1b2c) come from src/shared.js, with namespaceHtml() to type the full name over the short one.

// ---------- the fleet, built in one order by every scene that shows it
// The fleet: the zones (makeZones, its dashed edge split on the wire's line), one connection per Worker up to linkEnd
// (links, under the tiles: TEMPORAL_LINK_END without the proxy, PROXY.linkEnd with it), then the six Worker tiles
// (tiles, WORKERS). Build it first, in the scene's camera layer, so every match cut shows the same stack.
function makeFleet(root, linkEnd) {
  const lane = makeZones(root, { env: FLEET_ZONES.env, temporal: FLEET_ZONES.temporal, edgeY: WIRE_Y });
  const links = WORKERS.map(worker => path(lane.svg, fleetLinkD(worker, linkEnd), C.slate, 2, false));
  const tiles = WORKERS.map(worker => makeWorkerTile(root, worker));
  return { lane, links, tiles };
}
// SVG path of the proxy's connection to TEMPORAL, from the box's right edge to 4 px short of TEMPORAL's left edge at
// x1, so its arrow head stays off the border
const proxyOutD = x1 => `M ${PROXY_WIRE.x0} ${PROXY_WIRE.y} L ${x1 - 4} ${PROXY_WIRE.y}`;
// The fleet with the proxy (chapter 2 on): makeFleet() up to PROXY.linkEnd, the proxy's connection to TEMPORAL (out,
// a violet arrow), the TLS tube round it (tube), with out lifted into an SVG layer of its own over the tube's opaque
// body, the proxy box (proxy), over the connection's start, then the light that runs along the Workers' connections
// (sparks, one per Worker) and along the proxy's (outSparks, two).
function makeProxyFleet(root) {
  const fleet = makeFleet(root, PROXY.linkEnd);
  fleet.out = path(fleet.lane.svg, proxyOutD(PROXY_WIRE.x1), C.violet, 3);
  fleet.tube = makeTube(root, PROXY_TUBE);
  svgLayer(root).appendChild(fleet.out);
  fleet.proxy = makeProxy(root);
  fleet.sparks = WORKERS.map(() => makeSpark(root, 10, RGB.violet));
  fleet.outSparks = [0, 1].map(() => makeSpark(root, 12, RGB.violet));
  return fleet;
}
// The light on the proxy fleet's connections: on the Workers' at strength o, on the proxy's at strength outO. It runs
// on the ambient clock G, a lap every PROXY_FLOW_PERIOD seconds (twice as fast on the proxy's), so it flows on across
// a cut.
function flowFleetLight(fleet, o = 1, outO = o) {
  fleet.links.forEach((link, i) => {
    sparkOnPath(fleet.sparks[i], link, (G / PROXY_FLOW_PERIOD + i / WORKERS.length) % 1, o);
  });
  fleet.outSparks.forEach((spark, k) => {
    sparkOnPath(spark, fleet.out, (G / (PROXY_FLOW_PERIOD / 2) + k / 2) % 1, outO);
  });
}

// ---------- hand-offs (match cuts: a scene ends on the next one's first frame; both sides produce the same frame)
// Intro to chapter 1, and chapter 1 to chapter 2: the bare fleet in WIDE_SHOT. The intro ends on it once the proxy
// has gone; chapter 1 opens on it, and ends on it again once every chip has fallen off every Worker and its
// connections, card and tags have gone; chapter 2 opens on it. Shown: the zones in the fleet layout without the proxy
// (FLEET_ZONES, headings shown, captions hidden), the six Worker tiles at their slots, bare (gear turning, language
// tag shown, violet border, no chip, no code line); every connection hidden. Nothing else shows. Call it with the
// scene's camera at WIDE_SHOT (setCamera with shot(t, WIDE_SHOT, ...), enter and exit 1); a scene that animates
// these parts must reach exactly this state at the cut.
function placeBareFleet(fleet, cam) {
  placeZones(fleet.lane, { envZone: FLEET_ZONES.env, temporalZone: FLEET_ZONES.temporal });
  frameLaneEdges(fleet.lane, cam);
  fleet.links.forEach(link => draw(link, 0));
  fleet.tiles.forEach((tile, i) => placeBareWorker(tile, WORKERS[i]));
}
// A Worker tile of the bare fleet (placeBareFleet) at its slot, with opacity o
function placeBareWorker(tile, worker, o = 1) {
  gearSpin(tile, 1);
  place(tile, worker.x, worker.y, 1, o);
  tile.style.borderColor = C.violet;
  popScale(tile.langTag, { s: 1, o: 1 });
  tile.chips.forEach(chip => {
    chip.style.opacity = 0;
    chip.style.transform = '';
  });
  tile.lines.forEach(line => setText(line, ''));
}
// A Worker tile's heading row (the gear and WORKER): its top and height in the tile, px
const WORKER_HEAD = { top: 16, h: 30 };
// Frames a Worker tile placed at center y and scale k for the shot cam, as frameLaneEdges() frames the zones: the tile
// clips to the content frame (see contentBand), so a close shot never runs it under the chapter header or the
// subtitles, and its heading row fades out as the frame's top edge moves from the tile's top edge down to it, so the
// clip never cuts a label. In WIDE_SHOT the tiles lie inside the frame and show whole. tileH: the tile's height, px
// (the shared service makes it shorter). Call it after placing the tile.
function frameWorker(tile, y, k, cam, tileH = WORKER_TILE.h) {
  const band = contentBand(cam);
  const h = tileH * k, top = y - h / 2;
  // the clip is in the tile's own px, before its scale
  const cutTop = Math.max(0, band.top - top) / k, cutBottom = Math.max(0, top + h - band.bottom) / k;
  tile.style.clipPath = cutTop > 0 || cutBottom > 0
    ? `inset(${cutTop.toFixed(2)}px -60px ${cutBottom.toFixed(2)}px -60px)` : 'none';
  tile.gear.parentElement.style.opacity = clamp((top + WORKER_HEAD.top * k - band.top) / (WORKER_HEAD.top * k));
}
// Chapter 2 to 3, and chapter 3 to 4: the close shot on the proxy, [x, y, scale] for shot(), and the proxy fleet at
// rest in it. Chapter 2's camera pushes right and in to PROXY_SHOT, where its card goes through the proxy; chapter 3
// holds it (the content comes to the camera); chapter 4 pulls back from it. On screen it frames stage x 789-1909 and
// y 272-758: the proxy box at x 675-975 (y 290-740), the TLS tube, TEMPORAL with the proxy (x 1200-1800) cropped at
// the top and bottom; the Workers and their connections come in from the left, cropped. Room for YOUR KMS: on the
// proxy's left, over the dimmed Workers (on screen x 120-561, 114 px clear of the box).
const PROXY_SHOT = [1349, 515, 1.5];
// The proxy fleet at rest in PROXY_SHOT (makeProxyFleet), the state at both cuts: the zones with the proxy
// (PROXY_ZONES), dimmed to OFF_SHOT as the shot crops them (their headings faded by frameLaneEdges); the six Workers,
// each with its two lines (WORKER_LINES, the Namespace in violet), and their connections drawn, with their light, all
// dimmed to OFF_SHOT; the proxy's connection to TEMPORAL with its light, inside the TLS tube (PROXY_TUBE, drawn,
// its TLS label shown); the proxy box with its resting glow. The shot crops the Workers at the content frame's edges:
// they clip to it, their top row's heading faded (frameWorker). Nothing else: each chapter's own parts (a card and
// its tags, a Namespace band, NO SECRETS, CREDENTIALS IN ONE PLACE, YOUR KMS, the stored payloads, a verdict) leave
// before its cut, or enter after it. Call it with the scene's camera at PROXY_SHOT.
function placeProxyStage(fleet, cam) {
  placeZones(fleet.lane, {
    envZone: PROXY_ZONES.env, temporalZone: PROXY_ZONES.temporal, env: OFF_SHOT, temporal: OFF_SHOT,
  });
  frameLaneEdges(fleet.lane, cam);
  fleet.tiles.forEach((tile, i) => {
    placeBareWorker(tile, WORKERS[i], OFF_SHOT);
    tile.lines.forEach((line, k) => setText(line, WORKER_LINES[k]));
    tile.lines[1].style.color = C.violet;
    frameWorker(tile, WORKERS[i].y, 1, cam);
  });
  fleet.links.forEach(link => draw(link, 1, OFF_SHOT));
  draw(fleet.out, 1);
  flowFleetLight(fleet, OFF_SHOT, 1);
  placeTube(fleet.tube, PROXY_TUBE);
  placeProxy(fleet.proxy);
}
// ---------- the proxy as a shared service (chapter 4, and chapter 5's opening)
// The teams of the fleet, one per column of WORKERS, as chapter 1 tags them: their name, and the short Namespace name
// their Workers type behind the proxy
const SERVICE_TEAMS = [
  { name: 'Payments', ns: 'payments' }, { name: 'Orders', ns: 'orders' }, { name: 'Fraud', ns: 'fraud' },
];
// The framing of the shared service, [x, y, scale] for shot(): chapter 4's camera pulls back to it from PROXY_SHOT,
// left and out, and chapter 5's pulls back on from it to OUTRO_SHOT, left and out again. At its scale of 1, a stage
// point shows 329 px to its left and 64 px higher.
const SERVICE_SHOT = [1289, 579, 1];
// The layout of the shared service, stage px (on screen: 329 px to the left, 64 px higher). The zones: env, YOUR
// ENVIRONMENT, with the proxy inside it (x 120-1172 on screen), and temporal, TEMPORAL (x 1324-1800), both filling the
// content frame's height, 152 px apart for the TLS tube's label. Inside the environment, 36 px from its sides and under
// its heading: the three team zones stacked on the left, 40 px apart (teams: their left edge, size, the first one's
// top, the pitch), each with its two Workers side by side at scale k (SERVICE_TILE); 120 px on their right, the
// PLATFORM TEAM zone round the proxy box, as high as the team zones' stack, with the POLICY panel docked 36 px under
// the box (platform, policy). Each team's connection to the proxy, from its zone's right edge to the box, runs down or
// up in a lane of its own, `laneGap` px from the next one round linkX, midway between the zones: the lower the team,
// the nearer the box its lane, so the two that run up (ORDERS and FRAUD) nest without crossing. It ends `linkGap` px
// from the next one on the box. TEMPORAL's Namespace bands, one per team, level with the team zones (bands: their
// center x and size). tube: where the TLS tube ends, 12 px inside TEMPORAL, and its label's center x, midway between
// the environment and TEMPORAL.
const SERVICE = {
  env: { x: 449, y: 214, w: 1052, h: 730 },
  temporal: { x: 1653, y: 214, w: 476, h: 730 },
  platform: { x: PROXY.x - 206, y: 305, w: 412, h: 602 },
  policy: { x: PROXY.x, y: 787, w: 344, h: 172 },
  teams: { x: 485, w: 448, h: 174, top: 305, pitch: 214 },
  k: 0.9,
  linkX: 993,
  laneGap: 30,
  linkGap: 40,
  bands: { x: 1891, w: 396, h: 84 },
};
SERVICE.tube = { x1: SERVICE.temporal.x + 12, labelX: (SERVICE.env.x + SERVICE.env.w + SERVICE.temporal.x) / 2 };
// A Worker tile in the shared service, px before its scale (SERVICE.k): narrower and shorter than WORKER_TILE, it
// keeps its heading row (the gear and WORKER) and its Namespace line, raised to lineTop px from its top, while its
// language tag and the proxy's address, the same in every team, fade out
const SERVICE_TILE = { w: 200, h: 100, lineTop: 52 };
// A team zone's look: where its label sits (left, top, line height) and its verdict (right), and the top of its
// Workers, px from its edges; the gap between its two Workers. The PLATFORM TEAM zone shares it: the proxy box's top
// lies tilesTop px under the zone's.
const TEAM_ZONE = { label: { left: 24, top: 16, line: 24 }, verdictRight: 16, tilesTop: 60, gap: 40 };
// The rectangle of team zone i (SERVICE_TEAMS)
const teamZone = i => ({
  x: SERVICE.teams.x, y: SERVICE.teams.top + i * SERVICE.teams.pitch, w: SERVICE.teams.w, h: SERVICE.teams.h,
});
// A Worker's slot in its team zone (its column's team, its row's side): its center
function serviceSlot(worker) {
  const zone = teamZone(worker.col);
  const half = (SERVICE_TILE.w * SERVICE.k + TEAM_ZONE.gap) / 2;
  return {
    x: zone.x + zone.w / 2 + (worker.row ? half : -half),
    y: zone.y + TEAM_ZONE.tilesTop + SERVICE_TILE.h * SERVICE.k / 2,
  };
}
// SVG path of team i's connection to the proxy, from the middle of its zone's right edge to the box's left edge, a
// rounded corner at each turn; reversed: from the box to the zone
function teamLinkD(i, reversed = false) {
  const zone = teamZone(i);
  const fromY = zone.y + zone.h / 2, toY = PROXY.y + (i - 1) * SERVICE.linkGap;
  const laneX = SERVICE.linkX + (i - 1) * SERVICE.laneGap;
  const points = [[zone.x + zone.w, fromY], [laneX, fromY], [laneX, toY], [PROXY.linkEnd, toY]];
  return roundedPath(reversed ? points.reverse() : points, 8);
}
// A team zone, w x h px: a violet outline round its Workers, its name at its top left in violet capitals, as chapter
// 1's team tags; under the name's row, room for its Workers; zone.covered: a neon verdict in its heading row, hidden
// until a scene pops it
function makeTeamZone(root, name, { w, h }) {
  const { left, top, line } = TEAM_ZONE.label;
  const zone = E(root,
    `<div class="mono" style="position:absolute;left:${left - TILE_BORDER}px;top:${top - TILE_BORDER}px;`
    + `font-size:16px;line-height:${line}px;letter-spacing:.1em;color:${C.violet}">${name.toUpperCase()}</div>`,
    '', {
      width: w + 'px', height: h + 'px', border: `1px solid rgba(${RGB.violet},.45)`, borderRadius: 'var(--r)',
      background: `rgba(${RGB.violet},.04)`,
    });
  zone.covered = makeHeadingVerdict(zone, {
    font: 14, h: line, right: TEAM_ZONE.verdictRight - TILE_BORDER, top: top - TILE_BORDER,
  });
  return zone;
}
// The rules of the platform team's policy, as the POLICY panel lists them
const POLICY_RULES = ['Per-Namespace encryption', 'Client authentication', 'Encryption required', 'Metrics'];
// The POLICY panel's inside, px: its padding on the left, the top of its heading row (the shield and POLICY), then the
// rules' rows (the first one's top, their pitch and height); the panel (SERVICE.policy) ends `pad` px under the last
const POLICY_PANEL = { pad: 20, headTop: 14, rulesTop: 50, pitch: 28, rowH: 24 };
// The POLICY panel (SERVICE.policy): a shield and POLICY, then one row per rule (panel.rules), each an empty box that a
// neon check fills as the rule ticks on (setRule)
function makePolicyPanel(root) {
  const { w, h } = SERVICE.policy;
  const { pad, headTop, rulesTop, pitch, rowH } = POLICY_PANEL;
  const rule = (label, i) => `<div class="rule" style="position:absolute;left:${pad}px;top:${rulesTop + i * pitch}px;`
    + `height:${rowH}px;display:flex;align-items:center;gap:10px">`
    + '<span class="mark" style="position:relative;width:18px;height:18px">'
    + `<span class="box" style="position:absolute;inset:0;border:1.5px solid ${C.slate};border-radius:4px"></span>`
    + `<span class="check" style="position:absolute;inset:0;opacity:0">${ICON('check', 18, C.neon, 2.6)}</span></span>`
    + `<span class="mono text" style="font-size:17px;letter-spacing:.06em">${label.toUpperCase()}</span></div>`;
  const panel = E(root,
    `<div style="position:absolute;left:${pad}px;top:${headTop}px;display:flex;align-items:center;gap:8px">`
    + `${ICON('shield', 20, C.violet, 1.8)}<span class="mono" style="font-size:16px;letter-spacing:.14em;`
    + `color:${C.slate}">POLICY</span></div>${POLICY_RULES.map(rule).join('')}`,
    'tile', { width: w + 'px', height: h + 'px', textAlign: 'left', borderColor: C.violet });
  panel.rules = [...panel.querySelectorAll('.rule')].map(e => ({
    e, mark: e.querySelector('.mark'), box: e.querySelector('.box'), check: e.querySelector('.check'),
    text: e.querySelector('.text'),
  }));
  return panel;
}
// A rule of the POLICY panel ticked on to `on` (0 to 1): the check fills its box, its label turns from slate to white;
// s scales its mark (a swell as it ticks)
function setRule(rule, on, s = 1) {
  rule.check.style.opacity = clamp(on);
  rule.box.style.opacity = 1 - clamp(on);
  rule.text.style.color = on >= 0.5 ? C.ink : C.slate;
  rule.mark.style.transform = `scale(${s})`;
}
// text typed over: `from` erased character by character, then `to` typed in, as p goes from 0 to 1
function retyped(from, to, p) {
  if (from === to) return to;
  const n = Math.round(clamp(p) * (from.length + to.length));
  return n <= from.length ? from.slice(0, from.length - n) : to.slice(0, n - from.length);
}
// The shared service (chapters 4 and 5): the team zones and the PLATFORM TEAM zone, under everything, with the teams'
// connections; the proxy fleet (makeProxyFleet), which chapter 3 ends on, its Worker tiles moved into a camera layer
// of their own at their place in the stack (workerCam), which shrinks them together into their team zones; then
// TEMPORAL's Namespace bands, the POLICY panel and the light on the teams' connections. Build it first, in the scene's
// camera layer, so both cuts show the same stack.
function makeServiceStage(root) {
  const teams = SERVICE_TEAMS.map(team => makeTeamZone(root, team.name, SERVICE.teams));
  const platform = makeTeamZone(root, 'Platform team', SERVICE.platform);
  const svg = svgLayer(root);
  const teamLinks = SERVICE_TEAMS.map((_, i) => path(svg, teamLinkD(i), C.slate, 2, false));
  const fleet = makeProxyFleet(root);
  // a camera, not a scale on each tile: the layout check measures a tile resting at its smaller size through it. The
  // layer has no size of its own, so the check never takes it for content; its tiles show all the same.
  const workerCam = makeCamera(root);
  Object.assign(workerCam.style, { width: '0px', height: '0px' });
  root.insertBefore(workerCam, fleet.tiles[0]);
  fleet.tiles.forEach(tile => workerCam.appendChild(tile));
  // one Namespace band per team, its full name larger than the payments band's, its NAMESPACE label 14 px
  const bands = SERVICE_TEAMS.map(team => makeProxyBand(root, SERVICE.bands, {
    name: `${team.ns}.a1b2c`, font: 20, labelFont: 14,
  }));
  const policy = makePolicyPanel(root);
  const teamSparks = SERVICE_TEAMS.map(() => makeSpark(root, 10, RGB.violet));
  return { ...fleet, workerCam, teams, platform, teamLinks, bands, policy, teamSparks };
}
// The shared service at rest, where chapter 4 ends and chapter 5 opens (SERVICE_REST for placeServiceStage)
const SERVICE_REST = {
  regroup: 1, platform: 1, teams: [1, 1, 1], retype: 1, links: [1, 1, 1], flow: 1, bands: [1, 1, 1], policy: 1,
  ticks: [1, 1, 1, 1], covered: [1, 1, 1].map(() => ({ s: 1, o: 1 })), glow: 0, fade: 0,
};
// A Worker tile of the shared service at regroup p (0 to 1): from the fleet's tile (WORKER_TILE) to the shared
// service's (SERVICE_TILE). Its language tag and its first line (the proxy's address) fade out over the first half,
// as its second line (the Namespace) rises to its new place. Returns its height, px.
function shapeServiceWorker(tile, p) {
  const w = lerp(WORKER_TILE.w, SERVICE_TILE.w, p), h = lerp(WORKER_TILE.h, SERVICE_TILE.h, p);
  tile.style.width = w + 'px';
  tile.style.height = h + 'px';
  const redundant = 1 - clamp(p * 2);
  tile.langTag.style.opacity = redundant;
  tile.lines[0].style.opacity = redundant;
  tile.lines[1].style.transform = `translateY(${lerp(0, SERVICE_TILE.lineTop - workerSlotTop(1), p)}px)`;
  return h;
}
// The shared service in state p, for the shot cam (chapter 4 builds it from the proxy stage; chapter 5 opens on it at
// rest, SERVICE_REST, and fades it out):
// - regroup (0 to 1, eased by the scene): from the proxy stage (placeProxyStage, at 0) to the shared service: the zones
//   move from PROXY_ZONES to SERVICE's and come into focus, the TLS tube stretches to TEMPORAL's new edge, the Workers
//   travel from their fleet slots to their team zones (serviceSlot), shrinking to SERVICE.k as their tiles take the
//   shared service's shape (shapeServiceWorker), and the fleet's connections fade out;
// - platform, teams[i], bands[i], policy: the opacity of the PLATFORM TEAM zone, of team zone i and of its Namespace
//   band (each rising in), and of the POLICY panel (docking up under the box);
// - retype: the Workers of ORDERS and FRAUD type their team's Namespace over payments; links[i], flow: team i's
//   connection drawn, and the light on the teams' connections; ticks[k]: rule k of the policy ticked on (setRule);
// - covered[i]: { s, o }, team i covered: its COVERED verdict popped in and its outline neon;
// - glow: the proxy's glow; fade: everything but the proxy box fades out with it (chapter 5).
function placeServiceStage(st, cam, p) {
  const keep = 1 - p.fade;
  const focus = lerp(OFF_SHOT, 1, p.regroup);
  placeZones(st.lane, {
    envZone: lerpZone(PROXY_ZONES.env, SERVICE.env, p.regroup),
    temporalZone: lerpZone(PROXY_ZONES.temporal, SERVICE.temporal, p.regroup),
    env: focus * keep, temporal: focus * keep,
  });
  frameLaneEdges(st.lane, cam);

  // the Workers' camera scales them round the stage's center (960, 540): a tile shows at (x, y) at scale k from its
  // place in the layer
  const k = lerp(1, SERVICE.k, p.regroup);
  st.workerCam.style.transform = `scale(${k})`;
  st.tiles.forEach((tile, i) => {
    const worker = WORKERS[i];
    const slot = serviceSlot(worker);
    const x = lerp(worker.x, slot.x, p.regroup), y = lerp(worker.y, slot.y, p.regroup);
    placeBareWorker(tile, worker, focus * keep);
    place(tile, 960 + (x - 960) / k, 540 + (y - 540) / k, 1, focus * keep);
    setText(tile.lines[0], WORKER_LINES[0]);
    setText(tile.lines[1], retyped(WORKER_LINES[1], SERVICE_TEAMS[worker.col].ns, p.retype));
    tile.lines[1].style.color = C.violet;
    const tileH = shapeServiceWorker(tile, p.regroup);
    frameWorker(tile, y, k, cam, tileH);
  });
  const fleetLinks = OFF_SHOT * (1 - clamp(p.regroup * 2));
  st.links.forEach(link => draw(link, 1, fleetLinks));
  // the proxy's connection and its tube reach TEMPORAL's edge as it moves
  const tubeX1 = lerp(PROXY_TUBE.x1, SERVICE.tube.x1, p.regroup);
  setD(st.out, proxyOutD(tubeX1 - (PROXY_TUBE.x1 - PROXY_WIRE.x1)));
  draw(st.out, 1, keep);
  flowFleetLight(st, fleetLinks, keep);
  const label = { x: lerp(PROXY_TUBE.label.x, SERVICE.tube.labelX, p.regroup), y: PROXY_TUBE.label.y };
  placeTube(st.tube, { ...PROXY_TUBE, x1: tubeX1, label }, { o: keep });
  placeProxy(st.proxy, { glow: p.glow });

  const center = zone => [zone.x + zone.w / 2, zone.y + zone.h / 2];
  const riseBy = 16;
  const [platformX, platformY] = center(SERVICE.platform);
  place(st.platform, platformX, platformY + (1 - p.platform) * riseBy, 1, p.platform * keep);
  SERVICE_TEAMS.forEach((_, i) => {
    const [zoneX, zoneY] = center(teamZone(i));
    const zone = st.teams[i];
    place(zone, zoneX, zoneY + (1 - p.teams[i]) * riseBy, 1, p.teams[i] * keep);
    const covered = p.covered[i];
    setVerdict(zone.covered, 'COVERED', 'ok');
    popScale(zone.covered, covered);
    zone.style.borderColor = covered.o >= 0.5 ? C.neon : `rgba(${RGB.violet},.45)`;
    draw(st.teamLinks[i], p.links[i], keep);
    sparkOnPath(st.teamSparks[i], st.teamLinks[i], (G / PROXY_FLOW_PERIOD + i / SERVICE_TEAMS.length) % 1,
      p.flow * keep);
    place(st.bands[i], SERVICE.bands.x, zoneY + (1 - p.bands[i]) * riseBy, 1, p.bands[i] * keep);
  });
  const { policy } = SERVICE;
  place(st.policy, policy.x, policy.y + (1 - p.policy) * 2 * riseBy, 1, p.policy * keep);
  st.policy.rules.forEach((rule, k) => setRule(rule, p.ticks[k]));
}
// Chapter 5 to the outro: the proxy box alone, wearing its 1.0 badge, small above the end card. OUTRO_BOX: where the
// box shows on screen (its center y, centered on x 960 horizontally by its stage x) and at what scale; OUTRO_SHOT, the
// framing, [x, y, scale] for shot(), that puts the box (PROXY) there. Chapter 5 ends on it, every other part gone (the
// zones, the Workers, the tube, its own tiles): the box at PROXY with its resting glow (placeProxy) and the badge
// (makeVersionBadge) at (PROXY.x, PROXY.y + VERSION_BADGE.dy), both at scale 1 and full opacity in the camera layer.
// The outro opens on it and keeps it while the end card fades in under it.
const OUTRO_BOX = { y: 320, k: 0.7 };
const OUTRO_SHOT = [PROXY.x, PROXY.y - (OUTRO_BOX.y - 515) / OUTRO_BOX.k, OUTRO_BOX.k];
