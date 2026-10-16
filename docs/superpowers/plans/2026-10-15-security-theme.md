# Security theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking. In this repository every code task
> goes to the `skillbox:code-writer` agent and every review to
> `skillbox:code-reviewer` (CLAUDE.md, Agents).

**Goal:** Add the `security` theme: a cinematic explainer for security teams
that follows one payload from the Worker to the Event History, then shows
Temporal Proxy taking credentials and encryption out of the Workers.

**Architecture:** One scene file per chapter in `src/themes/security/scenes/`,
like every theme. The theme is built as one continuous film: chapters hand
off to each other through match cuts (the last frame of a chapter is the
first frame of the next, `fadeOut: 0` / `fadeIn: 0`), on a shared stage
geometry (`LANE`) and a camera that frames, pushes in and whips between the
stages of the payload's journey. The camera and motion helpers that
meet-temporal already has move to `src/shared.js`, as two themes now use
them.

**Tech Stack:** HTML, CSS, vanilla JavaScript (classic scripts, `renderAt(t)`),
Python with Playwright for the checks, Make.

**Spec:** `docs/security/script.md` (subtitles, visuals, sources). Read it
in full before any task; every subtitle is copied from it word for word.

## Global Constraints

- Everything on screen and in the code is in English; no em dash in
  subtitles or labels; straight quotes and apostrophes.
- Subtitles: 30 px, one line, at most 1760 px wide (measure the rendered
  `#sub`; rephrase only if it wraps, and report the new text so the script
  follows); `<b>` on each key term at its first mention (Worker, TLS,
  Namespace, Event History, Data Converter, Search Attributes, Codec Server,
  Temporal Proxy, KMS).
- Rendering is deterministic: no `Math.random`, no `Date`; scatter and
  glitches use `hash(n)`.
- Story animations key to `c[i]` (subtitle starts) and fit their subtitle
  window plus `after`; endless loops read the ambient clock, never `t`.
  Elements carried across a match cut read the global `G` for their loops
  (not `ambientTime(this)`, which restarts at each scene), so their phase
  does not jump at the cut.
- Classic `<script src>` tags, no ES modules; asset URLs through
  `assetUrl()`.
- Every resting composition stays inside the content frame y 150-880,
  centered on y 515 when shorter, spanning at least 440 px
  (`make layout THEME=security`). In a zoomed shot, elements that the shot
  pushes off the frame fade below 50 % opacity while the shot holds, so
  the check measures only what the shot shows. Only brief one-off effects
  (flash, shake, glitch, a pop's overshoot) leave the frame.
- Live-player code never changes frozen `?t=` frames.
- Brand and series anatomy: `.claude/project-memory/references/`
  (`project_brand.md`, `project_theme-anatomy.md`, `reference_logo.md`,
  `project_frame-noise.md`, `feedback_home-page.md`). Use the shared
  components of `src/shared.js` (title block, end card, history card,
  status tags, `useCaseScene`, crash effects) before writing new ones.
- Pacing: intro `pre: 1.0`; outro `pre: 0.4, post: 2.6`; chapters use the
  engine defaults, with `after` grown where a dramatic beat needs to land.
- Running example, exactly: Nora sends €25,000 to Leo; payload fields
  `from: FR76 3000 6000 0112 3456 7890 189`,
  `to: DE89 3704 0044 0532 0130 00`, `name: Leo Martin`,
  `amount: €25,000`.
- Lines: code 120 columns, Markdown 80 columns.

## Motion direction

The user asked for dynamic shots, dramatic animations and smart transitions
between scenes. This theme follows meet-temporal's motion level
(`project_theme-anatomy.md`, meet-temporal: "cinematic, creative animations
… at least one strong moment per chapter, still on-brand and
deterministic"), with three tools:

1. **Shots.** A scene's content lives in a camera layer (`makeCamera`).
   `shot(t, stops)` (Task 2) eases the camera between framings
   `[at, x, y, scale]`: a push-in on the wire, a whip pan to the history, a
   pull-back that reveals six Workers. Framings key to `c[i]`.
2. **Match cuts.** Each chapter boundary in the table below hands one
   element across: the outgoing scene ends on the incoming scene's first
   frame (same elements, same stage coordinates, same camera framing), with
   `fadeOut: 0` on the outgoing scene and `fadeIn: 0` on the incoming one.
   The hand-off state is a named constant in the theme's `shared.js`, read
   by both scenes, as meet-temporal does with `AGENT_HANDOFF`. The chapter
   header fades out and in across the cut (engine behavior), so the cut
   reads as a chapter change with no visual jump.
3. **Dramatic beats.** One strong moment per chapter, listed per task:
   ciphertext scrambles, lock snaps with ripples, red alarms with a camera
   shake, a flash, a rewind. They are short and keyed to `c[i]`.

| Boundary | Hand-off |
| --- | --- |
| Intro → 01 | The intro's payload card shrinks and flies into the Worker slot of the lane; 01 opens on the card in the Worker |
| 01 → 02 | 01 ends pushing in on the wire's start; 02 opens on that framing |
| 02 → 03 | The card rides the TLS tube into Temporal, the camera whips with it; 03 opens on the card arriving at the Event History |
| 03 → 04 | Red READABLE alarm, then a rewind: the card streaks back along the wire to the Worker (camera whips left); 04 opens on the card in the Worker |
| 04 → 05 | Pull-back from the Worker; 05 opens on the wide framing where the Worker is the first of six |
| 05 → 06 | Red IN CLEAR alarm, a shake; the chips of all six Workers fall; 06 opens on the bare Workers |
| 06 → 07 | Push-in through the TEMPORAL PROXY box; 07 opens inside the proxy |
| 07 → 08 | Pull-back out of the proxy to the full lane; 08 opens on the full lane with the two upstreams |
| 08 → 09 | Engine zoom-through (`setCamera` enter and exit), no match cut |
| 09 → 10 | The four recap tiles flip in 3D into the four use-case tiles, same slots (`USE_CASE_ROW`) |
| 10 → Outro | Engine zoom-through |

## Review Focus

1. **A visible jump at a match cut.** A viewer expects the cut to be
   invisible apart from the header. Each task that owns a cut runs the cut
   check (Task 2, Step 4) on it.
2. **A subtitle that wraps to two lines** once its scene runs. Each scene
   task measures every subtitle of its scene (Task 2, Step 5).
3. **A presenter hold or a 0.5x play mid-shot.** The presenter mode holds at
   cue starts and before fade-outs (`project_player-presenter-mode.md`);
   frames held there must be at rest: no camera move or scramble frozen
   halfway at a cue start, loops on the ambient clock. Each scene task
   checks the frames at `c[i]` and at `dur - 0.5`.
4. **Content leaving the frame during a zoomed shot.** `make layout` must
   pass for every scene (Global Constraints).
5. **Two render workers splitting a segment mid-transition.** Each frame
   is computed from `t` alone: no state carried from one `update()` to the
   next (no counters, no `if (!started)` flags).

---

### Task 1: Move the camera and motion helpers to `src/shared.js`

A refactor with no visible effect: meet-temporal frames stay identical.

**Files:**
- Modify: `src/themes/meet-temporal/shared.js:58-106` (remove the helpers)
- Modify: `src/shared.js` (add them)
- Modify: `CLAUDE.md` and `README.md` only where they list what
  `src/shared.js` holds (add "camera and motion helpers (`makeCamera`,
  `setCamera`, `hash`, ripples, sparks on paths)")

**Interfaces:**
- Produces, in `src/shared.js`, unchanged signatures: `hash(n)`,
  `makeCamera(root)`, `setCamera(cam, t, dur, { scale, dx, dy, enter,
  enterD, exit })`, `sparkOnPath(spark, pathEl, prog, dx, dy)`,
  `makeRipples(p, n, rgb)`, `placeRipples(rings, t, at, x, y, size0, size1,
  { d, step })`.

- [ ] **Step 1: Capture reference frames before the move**

```bash
make timeline THEME=meet-temporal   # pick 12 times, two per chapter, a second inside a subtitle
.venv/bin/python scripts/preview.py --theme meet-temporal <12 times> --full
mkdir -p /tmp/security-ref && mv output/frame_*.png /tmp/security-ref/
```

- [ ] **Step 2: Move the six helpers** with their comments, word for word,
  into a `// ===================== camera and motion helpers` section of
  `src/shared.js`; adapt the section header comment in meet-temporal's
  `shared.js` (it keeps its own helpers: `makeDrawnSymbol`, the hand-off
  constants). Check with `grep -rn "function hash\|function makeCamera"
  src/` that each is defined once.

- [ ] **Step 3: Compare the frames**

```bash
.venv/bin/python scripts/preview.py --theme meet-temporal <same 12 times> --full
.venv/bin/python - <<'EOF'
from pathlib import Path
from PIL import Image, ImageChops
for ref in sorted(Path('/tmp/security-ref').glob('frame_*.png')):
    new = Image.open(Path('output') / ref.name).convert('RGB')
    diff = ImageChops.difference(Image.open(ref).convert('RGB'), new)
    print(ref.name, max(hi for lo, hi in diff.getextrema()))
EOF
```

Expected: every maximum is 0, or at most 2 on curves
(`project_frame-noise.md`).

- [ ] **Step 4: Commit**

```bash
git add src/shared.js src/themes/meet-temporal/shared.js CLAUDE.md README.md
git commit -m "Share the camera and motion helpers between themes"
```

### Task 2: Theme scaffold, theme helpers, intro and outro

**Files:**
- Create: `src/themes/security/index.html` (copy of
  `src/themes/durable-execution/index.html`, same skeleton and viewport)
- Create: `src/themes/security/shared.js`
- Create: `src/themes/security/scenes/00-intro.js`,
  `src/themes/security/scenes/99-outro.js`
- Modify: `scripts/build_html.py` (`THEME_TOPICS`)
- Modify: `src/index.html` (card, last), `src/home.css` (hover animation),
  the home page `<meta name="description">`
- Modify: `README.md` and `CLAUDE.md` (theme lists at the top)

**Interfaces:**
- Consumes: Task 1 helpers.
- Produces, in `src/themes/security/shared.js`:
  - `TRANSFER`: `[['from', 'FR76 3000 6000 0112 3456 7890 189'], ['to',
    'DE89 3704 0044 0532 0130 00'], ['name', 'Leo Martin'], ['amount',
    '€25,000']]`.
  - `makePayload(p, { w = 420 } = {})` → element with `.rows[i].value`, a
    `.lock` (open/closed), returns the card; `setPayload(card, { seal = 0,
    scramble = 0, red = 0 })`: `seal` 0-1 closes the lock (snap with
    `backOut`), `scramble` 0-1 replaces each value's characters left to
    right with ciphertext glyphs from `hash(row * 97 + col)` (spaces kept,
    width fixed: monospace), `red` tints the card for the alarms. At
    `scramble = 1` the text is the fixed ciphertext, the same in every
    scene.
  - `LANE`: stage coordinates shared by every lane scene, at camera rest
    (scale 1): `{ env: { x: 120, y: 190, w: 700, h: 650 }, worker: { x: 300,
    y: 515 }, wire: { x0: 820, x1: 1100, y: 515 }, temporal: { x: 1100, y:
    190, w: 700, h: 650 }, history: { x: 1450, y: 470 }, ui: { x: 1450, y:
    760 }, proxy: { x: 760, y: 515 } }`. Tasks 3-7 may adjust the numbers
    once, here, if the compositions need it; every scene reads them.
  - `shot(t, from, stops)` → `{ scale, dx, dy }`: like `pan()`, stops are
    `[at, x, y, scale, d = 0.9]`, `x, y` the stage point to center on
    (960, 515) at that scale; passed to `setCamera(cam, t, dur, { ...shot,
    enter: 1, exit: 1 })` in match-cut scenes. Whole pixels at rest.
  - `shake(t, at, amp, d = 0.4)` → `[dx, dy]`: a decaying deterministic
    shake from `hash`, zero outside `[at, at + d]`.
  - Theme icons (`Object.assign(ICONS, { … })`): shield, door, badge, key,
    server, kms; icons another theme already defines are reused from
    `ICONS`.

```js
// shot(): camera framing eased between stops, each [at, x, y, scale, d]: the stage point (x, y) is centered on
// (960, 515) at that scale. Returns the setCamera() offsets.
function shot(t, from, stops) {
  let [x, y, scale] = from;
  for (const [at, sx, sy, ss, d = 0.9] of stops) {
    const p = P(t, at, d);
    x = lerp(x, sx, p); y = lerp(y, sy, p); scale = lerp(scale, ss, p);
  }
  return { scale, dx: Math.round((960 - x) * scale), dy: Math.round((515 - y) * scale) };
}
```

`setCamera` scales around (960, 540): keep its `transformOrigin` and
compensate in `shot()` if the framing is off by the 25 px between 540 and
515; check on a frame.

- [ ] **Step 1: Page and home card.** Head of `index.html`:

```html
<title>Security with Temporal: your code, your keys, your data</title>
<meta name="description" content="Where your code runs, what Temporal stores, who holds the keys, and how Temporal Proxy keeps credentials and encryption out of your Workers.">
<meta name="audience" content="Developers and security teams">
<meta name="markdown-title" content="Security with Temporal">
```

The card's `.theme-text` is the description word for word; card title
"Security"; icon a 24x24 stroke shield with a keyhole, whose hover
animation snaps a lock shut (~0.6 s, pure CSS, off under
`prefers-reduced-motion`). `THEME_TOPICS["security"] = ["Security",
"Temporal Proxy"]`. Add the theme to the lists at the top of `README.md`
and `CLAUDE.md`, with the CLAUDE.md wording: "`security`: Security with
Temporal, a video for security teams that follows a payload from the
Worker to the Event History: where the code runs, TLS and identity, what
Temporal stores, encryption with your keys, then Temporal Proxy, which
keeps credentials and encryption out of the Workers".

- [ ] **Step 2: Intro and outro** per the spec (Intro, Outro). Intro:
  `makeTitleBlock`, the large payload card on the right whose lock snaps
  and whose IBANs scramble and unscramble on a slow loop on the ambient
  clock; at its end (`fadeOut: 0`) the card shrinks and flies to
  `LANE.worker` at its lane size (hand-off constant `PAYLOAD_IN_WORKER =
  { x, y, w }`). Until Task 3 lands, the intro ends with the default fade:
  switch to `fadeOut: 0` in Task 3. Outro: `makeEndCard(root, 'Security',
  'YOUR CODE, YOUR KEYS, YOUR DATA')` with a shield and a neon lock above
  the title.

- [ ] **Step 3: Checks**

```bash
make timeline THEME=security && make layout THEME=security
make preview THEME=security T="<intro +3> <intro end -1> <outro +2>"
```

Expected: layout ok for both scenes; the contact sheet matches the spec.

- [ ] **Step 4: Cut check helper** (used by every later task; not
  committed). For a cut at scene boundary `T` (from `make timeline`):

```bash
.venv/bin/python scripts/preview.py --theme security <T - 0.034> <T + 0.001> --full
.venv/bin/python - <<'EOF'
from pathlib import Path
from PIL import Image, ImageChops
a, b = sorted(Path('output').glob('frame_*.png'))[-2:]
box = (0, 100, 1920, 940)  # leaves out the header and the subtitles, which change at a chapter cut
d = ImageChops.difference(Image.open(a).convert('RGB').crop(box), Image.open(b).convert('RGB').crop(box))
print(a.name, b.name, 'max', max(hi for lo, hi in d.getextrema()), 'bbox', d.getbbox())
EOF
```

Expected: max at most 2 (`bbox` None or a few specks). At Intro → 01 the
corner symbol (`#mark`) starts fading in with the first chapter: a
difference inside its box only is expected. Delete the
`output/frame_*.png` files after reading.

- [ ] **Step 5: Subtitle width check** (used by every later task). In the
  page, at a time inside each subtitle:

```js
renderAt(T); const r = document.getElementById('sub').getBoundingClientRect(); [r.width, r.height]
```

run through `page.evaluate` (Playwright, `scripts/common.py` `open_page`).
Expected: width at most 1760 and the height of one line.

- [ ] **Step 6: Commit**

```bash
git add src/themes/security src/index.html src/home.css scripts/build_html.py README.md CLAUDE.md
git commit -m "Add the security theme: page, home card, intro and outro"
```

### Task 3: Chapters 01 and 02 (where the data starts, on the wire)

**Files:**
- Create: `src/themes/security/scenes/01-start.js`,
  `src/themes/security/scenes/02-wire.js`
- Modify: `src/themes/security/index.html` (two `<script>` lines, in
  order), `src/themes/security/scenes/00-intro.js` (`fadeOut: 0`)

**Interfaces:**
- Consumes: `LANE`, `makePayload`, `setPayload`, `shot`, `shake`,
  `PAYLOAD_IN_WORKER`, `makeCamera`, `setCamera`.
- Produces: `WIRE_SHOT = [x, y, scale]`, the framing 01 ends on and 02
  starts on; `TUBE` geometry (the TLS tube along the wire) for 02 and 03.

- [ ] **Step 1: 01** per the spec: the lane draws in around the card,
  stroke by stroke (zones, wire, history frame); poll pulses run outward
  only. Dramatic beat: a probe from outside hits the environment's closed
  door and bounces off with ripples, NO INBOUND PORTS slamming in.
  Ends (`fadeOut: 0`) pushing in to `WIRE_SHOT`.
- [ ] **Step 2: 02** per the spec, opening on `WIRE_SHOT` (`fadeIn: 0`).
  Dramatic beat: the EAVESDROPPER's scan beam sweeps the tube and reads
  only scrambled glyphs; an unknown client is REJECTED with a red flash
  and a short shake. Namespaces split with a light sweep. Ends
  (`fadeOut: 0`) as the card enters the tube toward Temporal, the camera
  starting its whip right (state constant `TUBE_HANDOFF`).
- [ ] **Step 3: Checks.** `make timeline` and `make layout THEME=security`;
  preview at each subtitle + 1 s and at each `c[i]`; cut checks for
  Intro → 01 and 01 → 02; subtitle widths.
- [ ] **Step 4: Commit** `git commit -m "Add chapters 1 and 2 of the
  security theme"`.

### Task 4: Chapters 03 and 04 (in the Event History, encrypted with your keys)

**Files:**
- Create: `src/themes/security/scenes/03-history.js`,
  `src/themes/security/scenes/04-your-keys.js`
- Modify: `src/themes/security/index.html`,
  `src/themes/security/scenes/02-wire.js` (`fadeOut: 0` if not yet)

**Interfaces:**
- Consumes: `TUBE_HANDOFF`, `LANE`, payload helpers, `makeHistoryCard`
  (or a theme variant with a payload chip column), `statusTag`.
- Produces: `REWIND_HANDOFF` (card back in the Worker, framing) for 04;
  `CONVERTER` geometry; `WIDE_SHOT` (the pull-back framing 04 ends on and
  05 starts on).

- [ ] **Step 1: 03** per the spec, opening on `TUBE_HANDOFF`: the whip
  lands on the history, the card docks as row 2. Dramatic beat: READABLE
  hits in red, the clear IBAN magnified under a scan line, OPERATOR and
  WEB UI USER eyes on it; then the rewind: frames stutter (a short
  `crashGlitch`-style chroma split), the card streaks back along the wire
  to the Worker as the camera whips left; ends on `REWIND_HANDOFF`.
- [ ] **Step 2: 04** per the spec, opening on `REWIND_HANDOFF`. Dramatic
  beat: the Data Converter seal: the key turns, the lock snaps with violet
  ripples and the fields scramble once in a burst (glyph rain), then hold
  fixed; the sealed card flies to the history and turns row 2's chip into
  ciphertext, READABLE flipping into NEVER SEES YOUR PAYLOADS. Search
  Attributes strip, then the Codec Server round trip. Ends on `WIDE_SHOT`.
- [ ] **Step 3: Checks** as in Task 3 Step 3, with the cuts 02 → 03,
  03 → 04.
- [ ] **Step 4: Commit** `git commit -m "Add chapters 3 and 4 of the
  security theme"`.

### Task 5: Chapters 05 and 06 (the same work in every Worker, meet Temporal Proxy)

**Files:**
- Create: `src/themes/security/scenes/05-every-worker.js`,
  `src/themes/security/scenes/06-proxy.js`
- Modify: `src/themes/security/index.html`, `04-your-keys.js`
  (`fadeOut: 0`)

**Interfaces:**
- Consumes: `WIDE_SHOT`, `LANE`, payload helpers, `shake`.
- Produces: `WORKERS` (the six Worker slots, three languages: Go, Java,
  TypeScript, two each) shared by 05-08; `BARE_WORKERS_HANDOFF`;
  `PROXY_SHOT` (the push-in 06 ends on).

- [ ] **Step 1: 05** per the spec, opening on `WIDE_SHOT`: the Worker
  duplicates into six with a cascade, each stacking its four chips
  (ADDRESS, CERTIFICATE, API KEY, CODEC). The ROTATE sweep flashes them
  one by one. Dramatic beat: one CODEC chip is missing, its card leaves in
  clear, a red IN CLEAR alarm, a flash and a shake; then every chip drops
  off every Worker (gravity, staggered by `hash`); ends on
  `BARE_WORKERS_HANDOFF`.
- [ ] **Step 2: 06** per the spec, opening on `BARE_WORKERS_HANDOFF`: the
  TEMPORAL PROXY box slides in with a violet glow; connections from the
  six Workers, an SDK client and the Web UI converge on it. Dramatic beat:
  the card leaves a Worker bare and gains, one at a time at the proxy, the
  TLS tube, the API KEY badge and the Namespace rewrite (`payments` typed
  over into `payments.a1b2c`), each with a click and a swell. Ends pushing
  into the proxy box (`PROXY_SHOT`).
- [ ] **Step 3: Checks** as in Task 3 Step 3, with the cuts 04 → 05,
  05 → 06.
- [ ] **Step 4: Commit** `git commit -m "Add chapters 5 and 6 of the
  security theme"`.

### Task 6: Chapters 07 and 08 (encryption without code changes, change Temporal)

**Files:**
- Create: `src/themes/security/scenes/07-proxy-encryption.js`,
  `src/themes/security/scenes/08-upstreams.js`
- Modify: `src/themes/security/index.html`, `06-proxy.js` (`fadeOut: 0`)

**Interfaces:**
- Consumes: `PROXY_SHOT`, `WORKERS`, `LANE`, payload helpers, `shake`,
  the official lockup (`LOGO`) for "Cloud".
- Produces: `FULL_LANE_SHOT` (07 ends on it, 08 starts on it).

- [ ] **Step 1: 07** per the spec, opening inside the proxy
  (`PROXY_SHOT`): DATA KEY, AES-256-GCM, YOUR KMS (AWS KMS · AZURE KEY
  VAULT · GCP KMS) wrapping the data key; the data key ticks 1, 2, 3, old
  payloads keeping theirs. Dramatic beat: the KMS link snaps with red
  sparks, the next card slams into a closed gate at the proxy, CALL
  FAILED, FAIL CLOSED stamps in; then the link heals and the Web UI and
  CLI show the IBAN in clear while the history keeps ciphertext. Ends
  pulling back to `FULL_LANE_SHOT`.
- [ ] **Step 2: 08** per the spec, opening on `FULL_LANE_SHOT`. Dramatic
  beat: the ROUTING switch flips, the outbound connection tears off
  SELF-HOSTED and redraws to Temporal Cloud with a spark running along
  it, while the Workers stay perfectly still (WORKERS UNCHANGED). Default
  fade-out with the engine zoom-through (`setCamera` exit).
- [ ] **Step 3: Checks** as in Task 3 Step 3, with the cuts 06 → 07,
  07 → 08.
- [ ] **Step 4: Commit** `git commit -m "Add chapters 7 and 8 of the
  security theme"`.

### Task 7: Chapters 09 and 10 (what you get, what you can build), outro hand-off

**Files:**
- Create: `src/themes/security/scenes/09-recap.js`,
  `src/themes/security/scenes/10-use-cases.js`
- Modify: `src/themes/security/index.html`, `src/shared.js` only if
  `useCaseScene` needs an opt-in option for the flip-in (default behavior
  unchanged for the other themes)

**Interfaces:**
- Consumes: `USE_CASE_ROW`, `USE_CASE_TYPE`, `useCaseScene({ chapter,
  uses, namedAt, subs })`, `useCaseTile`, `iconTile`.

- [ ] **Step 1: 09** per the spec: four recap tiles in the
  `USE_CASE_ROW` slots, landing one at a time with a lock-snap each.
  `fadeOut: 0`.
- [ ] **Step 2: 10** per the spec: the tiles flip in 3D (rotateY, the back
  face being the use-case tile) into HEALTH CLAIMS, KYC ONBOARDING,
  PAYROLL RUNS, AI AGENTS ON CUSTOMER DATA, with the spec's examples;
  `namedAt` from the second subtitle at 16 characters per second + 0.3 s.
  If AI AGENTS ON CUSTOMER DATA does not fit the tile on one line, set it
  on two lines; report it.
- [ ] **Step 3: Checks** as in Task 3 Step 3, with the cut 09 → 10, and a
  render of meet-temporal, durable-execution and human-in-the-loop
  use-case frames compared as in Task 1 Step 3 if `src/shared.js` changed.
- [ ] **Step 4: Commit** `git commit -m "Add chapters 9 and 10 of the
  security theme"`.

### Task 8: Generated files, docs and memory

**Files:**
- Modify: `docs/security/script.md` (start times from `make timeline`,
  any reworded subtitle, the visuals as built)
- Create: `src/themes/security.md` (`make markdown`),
  `src/themes/security/social.png` (`make social`)
- Modify: `.claude/project-memory/references/project_theme-anatomy.md`
  (a `### security` section: audience, running example, the journey lane,
  the match-cut table, out-of-scope topics, no pre-release mention) and
  `feedback_home-page.md` (card order), through the project-memory skill

- [ ] **Step 1: Full checks**

```bash
make timeline THEME=security
make layout
make srt THEME=security && make markdown THEME=security && make social
make html
```

Expected: layout ok for every scene of every theme; the other themes'
generated files unchanged (`git status` shows only security files and
`src/apple-touch-icon.png` untouched).

- [ ] **Step 2: Full review frames**: a contact sheet per chapter at each
  `c[i]` + 1 s and at each dramatic beat; every cut check passes.
- [ ] **Step 3: Update the script** with the times and the visuals as
  built; commit with the generated files.

```bash
git add docs/security/script.md src/themes/security.md src/themes/security/social.png .claude/project-memory
git commit -m "Add the generated files and docs of the security theme"
```

- [ ] **Step 4: Whole-branch review** by `skillbox:code-reviewer`, then the
  report to the user ends with one timecode link per chapter and per
  dramatic beat (`http://localhost:<port>/themes/security/#t=<s>`) and the
  home page link.
