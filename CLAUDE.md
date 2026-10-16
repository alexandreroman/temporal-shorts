# Temporal Shorts

Temporal Shorts: short silent explainer videos about Temporal, each rendered
from a deterministic HTML animation. Each video is a theme:

- `meet-temporal`: Meet Temporal, a video that introduces Temporal to
  everyone who has never heard of it: its creators, Maxim Fateev and Samar
  Abbas, and its lineage from Amazon Simple Workflow Service through the
  Microsoft Durable Task Framework and Uber Cadence, then what it does,
  where it is used, why it matters for AI, Temporal Cloud and Temporal
  today
- `durable-execution`: Introduction to Durable Execution, a video that
  shows everyone the principles of Durable Execution with Temporal
  Workflows
- `human-in-the-loop`: Human-in-the-Loop, how a Temporal Workflow waits
  durably for a person's decision, such as an approval, then resumes where
  it left off
- `durable-ai-agents`: Durable AI Agents, a video that shows a
  non-technical audience how AI agents work and why they need Durable
  Execution with Temporal
- `agent-harness`: Temporal Agent Harness, a presentation of the
  experimental project of the same name for developers: durable agents
  built with the AI SDKs they already use, turns, human approvals, one
  event stream, typed subagents and Code Mode
- `worker-tuning`: Tuning Temporal Workers, a guide for developers and
  SREs: how a Worker takes work, and how to find and fix the bottleneck
  behind a growing Task Queue backlog: Slots, Pollers, the Workflow
  cache, CPU
- `security`: Security with Temporal, a video for security teams that
  follows a payload from the Worker to the Event History: where the code
  runs, TLS, private connectivity and identity, what Temporal stores,
  encryption with your keys, then Temporal Proxy, which keeps credentials
  and encryption out of the Workers, calls across Namespaces with Temporal
  Nexus, and Temporal Cloud's compliance: certifications, yearly
  third-party audits, the Trust Center

No theme is the default: make targets cover every theme unless `THEME=<theme>`
narrows them, and the per-theme scripts require `--theme`. A home page
(`src/index.html`) lets viewers pick a theme.

See [README.md](README.md) for full documentation.

## Tech stack

- HTML, CSS and vanilla JavaScript (1920x1080 animated pages, `renderAt(t)`)
- Python with Playwright (headless Chromium frame capture)
- ffmpeg (H.264 encoding, segment concatenation)
- Make

## Build & run

```bash
make setup                   # venv, Playwright Chromium, fonts
make timeline                # every theme: scenes, timings, TOTAL duration
make layout                  # every theme: content inside the frame y 150-880
make preview THEME=<theme> T="12 40 136"  # contact sheet -> output/preview.png
make render                  # output/<theme>.mp4 for every out-of-date theme
make render SUBS=off         # same, no subtitles: output/<theme>-nosubs.mp4
make srt                     # output/<theme>.srt for every out-of-date theme
make markdown                # Markdown for agents, committed: src/themes/*.md
make social                  # link preview images + touch icon, committed
make html                    # home page + one HTML player per theme
make serve                   # hot-reload home page on CASPER_PORT, else 8000
make clean                   # delete output/ (every generated file)
```

To show any moment of a theme, use
`http://localhost:<port>/themes/<theme>/#t=<time>`, `<port>` being the
`make serve` port and `<time>` seconds or `m:ss` (scene and cue starts from
`make timeline THEME=<theme>`); start `make serve` first if it is not
running, and open the link in a browser when one is available. The player
opens paused there. A reload keeps the viewer's position over the
fragment: change `#t=` to jump. Pausing writes the position into the URL
in whole seconds (`#t=70`), so a paused viewer can share it; playing
clears it. `?t=` is the frozen capture frame, without the player.

**Every report of a change to a page ends with its timecode links**, with
no exception: one link per changed moment (a scene, a subtitle, a label,
a transient effect), grouped by theme, the time a second or more inside
the changed subtitle window or at the exact moment of a brief effect;
`http://localhost:<port>/` for the home page. This holds for work done by
subagents: ask them for the times, and give the links in the answer. A
change with no visible effect (a refactor that keeps frames identical)
gets no link, and the report says so.

`preview` requires `THEME`. Each MP4, SRT or Markdown file rebuilds only
when the shared sources or its own theme change (see README.md); `-B`
forces a rebuild.

In Casper (`.casper.json`), Run (`casper run`) serves the home page and the
HTML players on `CASPER_PORT` (8000 where it is unset), Render
(`casper run render`) renders every theme into `output/<theme>.mp4`; new
workspaces run `make setup` automatically.

## Modules

- `src/`: the animations, one file per concern so parallel edits rarely
  conflict:
  - `index.html`, `home.css`, `home.js`: home page, one card per theme,
    linking to `themes/<theme>/`; `make html` drops a card with the
    `hidden` attribute from the built page, so the theme is unlisted but
    still built and reachable by its URL; `home.js` draws its star field
  - `social.html`: link preview card of the home page: the home page
    lockup (`.brand` in `home.css`) at a larger `--logo`, above a still
    step chain of the durable-execution intro, on the home page
    background; captured by `make social` only, not a site page; its icons
    are copies, see the comment above the chain
  - `styles.css`: brand styles and live-player CSS
  - `engine.js`: timeline, easing and layout helpers, icons, components,
    star field and `boot()`, called last by every theme page (builds the
    scenes, then freezes on `?t=` or starts the player); chapter titles come
    from the scenes
  - `shared.js`: brand constants and components used by two or more
    themes (`C` and `RGB` colors, `assetUrl()` and `LOGO`, tiles, tags,
    glows, step rows, the agentic loop (`makeAgentLoop()`), the lunch
    example (`LUNCH_STEPS`, `LUNCH_HISTORY`) with its CONTEXT panel and
    blocks (`makeMemory()`, `makeMemBlocks()`), app and TEMPORAL panels,
    the app panel of numbered step lines (`makeLinesApp()`), the Event
    History card, the code card of TypeScript lines (`makeCodeCard()`,
    `highlightJs()`, `setCodeLine()`), status tags, counters, crash and
    takeover effects, small animation helpers such as `backPop()`, camera
    and motion helpers (`makeCamera`, `setCamera`, `hash`, ripples, sparks
    on paths), title and end cards) and the whole "What you can build"
    chapter, `useCaseScene()`; icons used by two or more themes are in
    `ICONS` in `engine.js`, the others in their theme's `shared.js`
  - `player.js`: live-mode player (`startPlayer()`), with a button back to
    the home page; opens paused at a `#t=<time>` URL fragment
  - `themes/<theme>/index.html`: theme page, stage skeleton and the
    ordered `<link>` / `<script>` list: shared files as `../../<file>`,
    the theme's own scripts relative to its folder, then `boot()`; its
    head holds the viewport meta, the `<title>` (written for search
    results), `<meta name="description">`, `<meta name="audience">` (who
    the video is for, for the structured data) and
    `<meta name="markdown-title">` (the name of the video, heading of its
    Markdown version)
  - `themes/<theme>/`: the theme's own scripts, e.g.
    `themes/durable-ai-agents/shared.js` (extra icons, the step list,
    `makeApp`, the context block size `MEM_BLOCK`, the bill, the takeover
    of chapters 6 and 7, the booking ticket) or
    `themes/worker-tuning/shared.js` (the Worker diagram shared by its
    chapters, `makeWorkerDiagram()` and `placeWorkerDiagram()`: Task Queue
    lanes, Pollers, Slots, Workflow cache, readouts, meters, the
    `Worker.create()` code card and the bottleneck markers, driven by one
    state object per frame; the mini Worker of its intro and outro)
  - `social.png`, `themes/<theme>/social.png`: 1200x630 link preview
    image of each page (`social.html`, or the intro title card), written by
    `make social` and committed
  - `favicon.svg`: site icon, the official Temporal symbol (path and fill
    untouched) on a Space Black rounded square; `apple-touch-icon.png`:
    its 180x180 opaque PNG for phones, written by `make social` and
    committed; the HTML build copies both to the root of `output/`
  - `themes/<theme>.md`: Markdown version of a theme for coding agents,
    next to its folder: the page `markdown-title` and description, then one
    section per chapter with an absolute link to the player at its start
    (`/themes/<theme>/#t=<s>`) and its subtitles as prose; written by
    `make markdown` from the scenes and committed, never edited by hand.
    The HTML build copies it to `output/themes/<theme>.md` and links each
    theme page to it (`<link rel="alternate" type="text/markdown"
    href="/themes/<theme>.md">`)
  - `themes/<theme>/scenes/`: one file per scene (subtitles and
    animations), wrapped in a `{ ... }` block so its helpers stay local
    (declare them with `const`: a function declaration inside the block
    leaks to the global scope); each chapter is one scene, which sets
    `chapter` and `title`; `shift` (`[dx, dy]` or `(t, c) => [dx, dy]`,
    see `pan()`) centers the composition at (960, 515)
- `scripts/`: setup, font download (`fonts.sh`, run by `setup.sh` and
  any make target when the fonts are missing), frame preview, parallel
  render, timeline, layout check (`layout_check.py`), SRT export, Markdown
  export (`export_markdown.py`), social preview images
  (`social_images.py`, which also writes the touch icon), standalone HTML
  build and server (which also serves `/themes/<theme>.md` as
  `text/markdown`, the site icons, and `/sitemap.xml` and `/robots.txt`
  when built); the per-theme scripts require `--theme` (no default). The
  HTML build links every page to the site icons and gives each theme page
  a visually hidden transcript of its Markdown version (after the stage,
  for screen readers and search engines; `src/` pages never hold it, so
  frames are unaffected) and the ` | Temporal Shorts` suffix to its
  `<title>`. It adds the Open Graph and X card tags, a canonical link and
  JSON-LD structured data (author and publisher Alexandre Roman, a person:
  the site is no official Temporal site; topics in `THEME_TOPICS`), and
  writes `output/sitemap.xml` (home page and listed themes, each with the
  git date of the last commit that changed its own content as `<lastmod>`:
  `src/index.html`, or the theme folder and its Markdown version; none in
  a shallow clone or without git) and
  `output/robots.txt`, only when the `SITE_URL` environment variable (or
  make variable) holds the site's root URL: local builds have none, and
  delete those of an earlier build
- `.github/workflows/pages.yml`: on push to `main`, checks out the full
  history (blobless, for the sitemap dates), runs `make html`
  (which downloads the fonts) with `SITE_URL` set to the Pages URL given by
  `actions/configure-pages` (no domain in the build or the workflow) and
  deploys `output/` to GitHub Pages (pages, images, the Markdown
  versions of the themes, the site icons, `sitemap.xml` and `robots.txt`;
  no video, no SRT); served at a domain root, as the player's home button
  links to `/`. Pull requests to `main` run the build only, without the
  Pages step, so with no social tags, structured data, sitemap or
  `robots.txt`, and no deploy: the pages are attached to the run as an
  artifact
- `docs/<theme>/script.md`: full script of a theme: subtitles, timings,
  visuals
- `output/`: generated `<theme>.srt`, `<theme>.mp4`, and the HTML pages
  at the same paths as in `src/`: `index.html`,
  `themes/<theme>/index.html`, with the copied `themes/<theme>.md`

## Agents

Use the following agents (from the
[skillbox](https://github.com/alexandreroman/skillbox)
plugin) for all code tasks:

- **code-writer** — for ANY task that writes,
  modifies, or refactors code. This includes
  one-line fixes, import changes, visibility
  tweaks, and adding assertions. Never edit
  source files directly — always delegate to
  this agent.
- **code-reviewer** — for read-only code review
  before merging or when investigating issues.

## Memory

At the start of every conversation, read
`.claude/project-memory/MEMORY.md` to load
project context from previous conversations.

Use the **project-memory** skill (from the
[skillbox](https://github.com/alexandreroman/skillbox)
plugin) proactively — without being asked — whenever
the conversation reveals project decisions, deadlines,
team context, external references, workflow preferences,
or corrective feedback worth persisting across
conversations.

**Important:** Always use the **project-memory**
skill to persist information. Never use the built-in
auto-memory system (`~/.claude/projects/.../memory/`)
for project decisions or context — it is local and
not shared with the team.

## Conventions

- Line length limits for readability:
  - Text / Markdown: 80 columns max
  - Code: 120 columns max
- Follow standard Markdown conventions: blank line
  before and after headings, blank line before and
  after lists, fenced code blocks with a language tag
- Always use the latest LTS or stable version of
  languages, frameworks, and libraries. Check the
  official documentation or use available tools
  (e.g. context7) to verify current versions before
  choosing a dependency.
- Everything in this repository is in English: video text, docs, code
  comments, commit messages. No em dash in subtitles or on-screen labels.
- Videos have no maximum length (`make timeline THEME=<theme>` reports
  it). Key every animation to `c[i]` (subtitle start) so timings follow
  text changes. Continuous ambient loops (spinners, blinks, dashed flows)
  read the ambient clock `G`, never `t`: 0.5x slows `t` only.
- Keep rendering deterministic (no `Math.random`): parallel workers render
  segments independently.
- Use classic `<script src>` tags, not ES modules: Playwright opens
  `src/themes/<theme>/index.html` over `file://`, where Chromium blocks
  `type="module"`.
- New scene: add a file in `src/themes/<theme>/scenes/` and one `<script>`
  line in `src/themes/<theme>/index.html`, in playing order.
- New theme: follow the checklist in README.md, "Add a theme".
- Relative URLs must work from `src/` and `output/` alike: theme pages
  live two folders below the home page. Link to folders
  (`themes/<theme>/`): `make serve` is the only way to view the HTML pages.
  The absolute links are the player's home button, `/`, the player
  links of the Markdown versions, `/themes/<theme>/`, and the theme
  pages' link to their Markdown version, `/themes/<theme>.md`, and the
  site icons, `/favicon.svg` and `/apple-touch-icon.png`: the site is
  served at a domain root.
  Build asset URLs in JS with `assetUrl('assets/...')` (`src/shared.js`),
  which resolves them against the script, not the page: Playwright opens
  theme pages over `file://` to render frames.
- Live-mode player code (`startPlayer()`, `.live` CSS) must never affect the
  frozen `?t=` mode: rendered frames must stay pixel-identical.
- After changing an intro scene, a page title, `src/social.html`, the
  home page lockup or background, or `src/favicon.svg`, run `make social`
  and commit the `social.png` images and `src/apple-touch-icon.png`: CI
  only copies them.
- Check frames with `make preview` before `make render`; after a text change
  (a subtitle, a chapter title, a page `markdown-title` or description), run
  `make srt` and `make markdown`, update `docs/<theme>/script.md`, and commit
  the `src/themes/<theme>.md` files: CI only copies them.
- Compositions stay inside the content frame y 150-880 (scene `shift`
  included), centered on y 515 when shorter, spanning at least 440 px;
  `make layout` checks every scene.
