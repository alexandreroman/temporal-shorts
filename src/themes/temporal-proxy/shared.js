// ===================== Temporal Proxy 1.0 helpers (shared by the scenes of this theme)
// The components (payload card, zones, TLS tube, verdict tags, Worker tiles, proxy box, YOUR KMS, shot()) come from
// src/shared.js; this file holds the theme's layout, in stage px, and the hand-offs of its match cuts.

// ---------- the layout
// The wire's line, stage y: the channel between the two rows of Workers, where their connections run, the proxy
// sits and its TLS tube goes out
const WIRE_Y = 515;
// The wide shot, [x, y, scale] for shot(): the whole fleet, a little smaller than at rest, with room round it. The
// intro's ending, chapter 1 and chapter 2's opening hold it; the fleet layout (FLEET) fills it: it frames stage
// x 5-1915 and y 100-930 as the content frame, so the zones (y 150-880) show at y 193-836 on screen.
const WIDE_SHOT = [960, 515, 0.88];
// The fleet layout, in stage px. env and temporal: the zones' left edge and width without the proxy (the intro's
// ending and chapter 1: YOUR ENVIRONMENT holding the six Workers, TEMPORAL wide enough for a card and a list);
// proxyEnv and proxyTemporal: with the proxy (chapter 2 on), the environment wider, its right edge on the proxy box
// (PROXY), and TEMPORAL narrower, at the right end, still wide enough for a Namespace band or a list of stored
// payloads. y and h: both zones' top and height. The Worker tiles (WORKER_TILE, 296 x 262) sit in two rows (rows:
// their center y) of three columns (cols: their center x), 24 px apart; between the rows runs the channel, on the
// wire's line, where each Worker's connection has a track of its own, `track` px from the next (fleetLinkD). The
// environment leaves the Workers as much room on their left as on their right without the proxy (27 px); the zones'
// widths are even (lerpZone).
const FLEET = {
  y: 150, h: 730,
  env: { x: 17, w: 990 }, temporal: { x: 1240, w: 660 },
  proxyEnv: { x: 17, w: 1164 }, proxyTemporal: { x: 1460, w: 440 },
  rows: [353, 677],
  cols: [192, 512, 832],
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
// wire's line, 100 px clear of the Workers' right column; its size and head as PROXY_BOX's (200 x 300)
const PROXY = { x: FLEET.proxyEnv.x + FLEET.proxyEnv.w, y: WIRE_Y, ...PROXY_BOX };
// Where the Workers' connections end on the box's left, 4 px short of its edge, so their round caps stay off it
PROXY.linkEnd = PROXY.x - PROXY.w / 2 - 4;
// The proxy's connection to TEMPORAL, from the box's right edge to TEMPORAL's left edge with the proxy
const PROXY_WIRE = { x0: PROXY.x + PROXY.w / 2, x1: FLEET.proxyTemporal.x, y: WIRE_Y };
// The TLS tube that the proxy adds on the way out (makeTube, placeTube): from the box's right edge to 12 px inside
// TEMPORAL, on the wire's line, high enough to hold a card and its tags; its label above it
const PROXY_TUBE = { x0: PROXY_WIRE.x0, x1: PROXY_WIRE.x1 + 12, y: WIRE_Y, h: 176 };
PROXY_TUBE.label = { x: (PROXY_TUBE.x0 + PROXY_TUBE.x1) / 2, y: PROXY_TUBE.y - PROXY_TUBE.h / 2 - 36 };
// The proxy box at PROXY moved by (dx, dy), at scale s, with opacity o and a violet glow of strength glow (0 to 1)
function placeProxy(box, { dx = 0, dy = 0, s = 1, o = 1, glow = 0 } = {}) {
  place(box, PROXY.x + dx, PROXY.y + dy, s, o);
  setProxyGlow(box, glow);
}
// The neon 1.0 badge of the release: dark bold figures on solid neon, its size and font, px; dy: from the proxy box's
// center to the badge's, which centers it in the room under the box's name
const VERSION_BADGE = { w: 112, h: 56, font: 34, dy: PROXY_BOX.head.bottom / 2 };
// The 1.0 badge (VERSION_BADGE), with a neon glow; place() shows it. The intro pops it onto the proxy box, chapter 4
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
// The fleet with the proxy (chapter 2 on): makeFleet() up to PROXY.linkEnd, the proxy's connection to TEMPORAL (out,
// a violet arrow), the TLS tube round it (tube), with out lifted into an SVG layer of its own over the tube's opaque
// body, the proxy box (proxy), over the connection's start, then the light that runs along the Workers' connections
// (sparks, one per Worker) and along the proxy's (outSparks, two).
function makeProxyFleet(root) {
  const fleet = makeFleet(root, PROXY.linkEnd);
  const { x0, x1, y } = PROXY_WIRE;
  fleet.out = path(fleet.lane.svg, `M ${x0} ${y} L ${x1 - 4} ${y}`, C.violet, 3);
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
// Chapter 2 to 3, and chapter 3 to 4: the close shot on the proxy, [x, y, scale] for shot(), and the proxy fleet at
// rest in it. Chapter 2's camera pushes right and in to PROXY_SHOT, where its card goes through the proxy; chapter 3
// holds it (the content comes to the camera); chapter 4 pulls back from it. On screen it frames stage x 770-1890 and
// y 272-758: the proxy box at x 737 (y 290-740), the TLS tube, TEMPORAL with the proxy (x 1155-1815) cropped at the
// top and bottom; the Workers and their connections come in from the left, cropped. Room for YOUR KMS: on the proxy's
// left, over the dimmed Workers (stage x 780-1060, y 280-480).
const PROXY_SHOT = [1330, 515, 1.5];
// The proxy fleet at rest in PROXY_SHOT (makeProxyFleet), the state at both cuts: the zones with the proxy
// (PROXY_ZONES), dimmed to OFF_SHOT as the shot crops them (their headings faded by frameLaneEdges); the six Workers,
// each with its two lines (WORKER_LINES, the Namespace in violet), and their connections drawn, with their light, all
// dimmed to OFF_SHOT; the proxy's connection to TEMPORAL with its light, inside the TLS tube (PROXY_TUBE, drawn,
// its TLS label shown); the proxy box with its resting glow. Nothing else: each chapter's own parts (a card and its
// tags, a Namespace band, NO SECRETS, CREDENTIALS IN ONE PLACE, YOUR KMS, the stored payloads, a verdict) leave
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
  });
  fleet.links.forEach(link => draw(link, 1, OFF_SHOT));
  draw(fleet.out, 1);
  flowFleetLight(fleet, OFF_SHOT, 1);
  placeTube(fleet.tube, PROXY_TUBE);
  placeProxy(fleet.proxy);
}
// Chapter 4 to the outro: the proxy box alone, wearing its 1.0 badge, small above the end card. OUTRO_BOX: where the
// box shows on screen (its center y, centered on x 960 horizontally by its stage x) and at what scale; OUTRO_SHOT, the
// framing, [x, y, scale] for shot(), that puts the box (PROXY) there. Chapter 4 ends on it, every other part gone (the
// zones, the Workers, the tube, its own tiles): the box at PROXY with its resting glow (placeProxy) and the badge
// (makeVersionBadge) at (PROXY.x, PROXY.y + VERSION_BADGE.dy), both at scale 1 and full opacity in the camera layer.
// The outro opens on it and keeps it while the end card fades in under it.
const OUTRO_BOX = { y: 320, k: 0.7 };
const OUTRO_SHOT = [PROXY.x, PROXY.y - (OUTRO_BOX.y - 515) / OUTRO_BOX.k, OUTRO_BOX.k];
