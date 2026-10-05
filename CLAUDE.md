# Temporal Shorts

Temporal Shorts: short silent explainer videos about Temporal, each rendered
from a deterministic HTML animation. Each video is a theme:

- `durable-execution`: Introduction to Durable Execution, the principles of
  Durable Execution with Temporal Workflows, outside any AI context
  (placeholder)
- `human-in-the-loop`: Human-in-the-Loop, how a Temporal Workflow waits
  durably for a person's decision, such as an approval, then resumes where
  it left off (placeholder)
- `durable-ai-agents`: Durable AI Agents, a video that shows a
  non-technical audience how AI agents work and why they need Durable
  Execution with Temporal
- `agent-harness`: Temporal Agent Harness, a presentation of the
  experimental project of the same name (placeholder)

No theme is the default: make targets cover every theme unless `THEME=<theme>`
narrows them, and the scripts require `--theme`. A home page
(`src/index.html`) lets viewers pick a theme.

See [README.md](README.md) for full documentation.

## Tech stack

- HTML, CSS and vanilla JavaScript (1920x1080 animated pages, `renderAt(t)`)
- Python with Playwright (headless Chromium frame capture)
- ffmpeg (H.264 encoding, segment concatenation)
- Make

## Build & run

```bash
make setup                   # venv, Playwright Chromium, stand-in fonts
make timeline                # every theme: scenes, timings, TOTAL duration
make preview THEME=<theme> T="12 40 136"  # contact sheet -> output/preview.png
make render                  # output/<theme>.mp4 for every out-of-date theme
make srt                     # output/<theme>.srt for every out-of-date theme
make html                    # home page + one HTML player per theme
make serve                   # hot-reload home page on CASPER_PORT, else 8000
make clean                   # delete output/ (every generated file)
```

`timeline`, `render` and `srt` cover every theme; `THEME=<theme>` restricts
them to one, e.g. `make render THEME=durable-execution`. `preview` requires
`THEME`. An unknown `THEME` fails with the list of themes. Each MP4 or SRT
depends on the shared sources and its own theme only: editing a scene
rebuilds that theme alone, editing the home page rebuilds no video. Use
`-B` to force a rebuild.

In Casper (`.casper.json`), Run (`casper run`) serves the home page and the
HTML players on `CASPER_PORT` (8000 in the primary workspace), Render
(`casper run render`) renders every theme into `output/<theme>.mp4`; new
workspaces run `make setup` automatically.

## Modules

- `src/`: the animations, one file per concern so parallel edits rarely
  conflict:
  - `index.html`, `home.css`: home page, one card per theme, linking to
    `themes/<theme>/`
  - `styles.css`: brand styles and live-player CSS
  - `engine.js`: timeline, helpers, components; chapter titles come from
    the scenes
  - `shared.js`: brand helpers shared by every theme (`C`, `LOGO`,
    `iconTile`, `makeStep`, `fly`)
  - `player.js`: live-mode player (`startPlayer()`), with a button back to
    the home page
  - `themes/<theme>/index.html`: theme page, stage skeleton and the
    ordered `<link>` / `<script>` list: shared files as `../../<file>`,
    the theme's own scripts relative to its folder
  - `themes/<theme>/`: the theme's own scripts, e.g.
    `themes/durable-ai-agents/shared.js` (`STEPS`, memory, bill)
  - `themes/<theme>/scenes/`: one file per scene (subtitles and
    animations), wrapped in a `{ ... }` block so its helpers stay local;
    the first scene of a chapter sets `chapter` and `title`; `shift`
    (`[dx, dy]` or `(t, c) => [dx, dy]`, see `pan()`) centers the
    composition at (960, 522)
- `scripts/`: setup, frame preview, parallel render, timeline, SRT export,
  standalone HTML build and server; `--theme` (required, no default)
  selects the theme
- `docs/<theme>/script.md`: full script of a theme: subtitles, timings,
  visuals
- `output/`: generated `<theme>.srt`, `<theme>.mp4`, and the HTML pages
  at the same paths as in `src/`: `index.html`,
  `themes/<theme>/index.html`

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
- Keep each video ≤ 3:00 (`make timeline THEME=<theme>`). Key every
  animation to `c[i]` (subtitle start) so timings follow text changes.
- Keep rendering deterministic (no `Math.random`): parallel workers render
  segments independently.
- Use classic `<script src>` tags, not ES modules: Playwright opens
  `src/themes/<theme>/index.html` over `file://`, where Chromium blocks
  `type="module"`.
- New scene: add a file in `src/themes/<theme>/scenes/` and one `<script>`
  line in `src/themes/<theme>/index.html`, in playing order.
- New theme: folder `src/themes/<theme>/` with its page `index.html` and
  its scenes, a card linking to `themes/<theme>/` in `src/index.html` and
  `docs/<theme>/script.md`.
- Relative URLs must work from `src/` and `output/` alike: theme pages
  live two folders below the home page. Link to folders
  (`themes/<theme>/`): `make serve` is the only way to view the HTML pages.
  Resolve asset URLs built in JS against the script
  (`document.currentScript.src`, see `LOGO`), not the page: Playwright
  opens theme pages over `file://` to render frames.
- Live-mode player code (`startPlayer()`, `.live` CSS) must never affect the
  frozen `?t=` mode: rendered frames must stay pixel-identical.
- Check frames with `make preview` before `make render`; after a text change,
  run `make srt` and update `docs/<theme>/script.md`.
