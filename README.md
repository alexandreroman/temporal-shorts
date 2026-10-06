# Temporal Shorts

[![CI](https://github.com/alexandreroman/temporal-shorts/actions/workflows/pages.yml/badge.svg)](https://github.com/alexandreroman/temporal-shorts/actions/workflows/pages.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

Temporal Shorts: short explainer videos (English, no sound, burned-in
subtitles) about Temporal. Each video is a theme:

- **Introduction to Durable Execution** (`durable-execution`): for
  everyone, the principles of Durable Execution with Temporal Workflows,
  outside any AI context: Workflows, Activities, retries, the Event
  History, replay and the Temporal web UI.
- **Human-in-the-Loop** (`human-in-the-loop`): how a Temporal
  Workflow waits durably for a person's decision, such as an approval, for
  minutes or days, then resumes where it left off.
- **Durable AI Agents** (`durable-ai-agents`): for a non-technical
  audience, how an AI agent works, and why it needs Durable Execution with
  Temporal.
- **Temporal Agent Harness** (`agent-harness`): for developers, the
  experimental project of the same name: AI agents that run as durable
  Temporal Workflows while you keep your AI SDK, with human approvals, one
  event stream, typed subagents and Code Mode.

A home page lists the themes and opens their players.

No theme is the default: the make targets cover every theme unless
`THEME=<theme>` narrows them to one, and the per-theme scripts require
`--theme`.

The videos are not edited in a video editor: each one is an HTML page
animated deterministically (`renderAt(t)`), captured frame by frame by
headless Chromium (Playwright), then encoded to H.264 by ffmpeg.

## Contents

```text
src/index.html         home page: one card per theme (styles in home.css)
src/styles.css         Temporal brand styles and the live player's CSS
src/engine.js          timeline, easing, placement, SVG icons, components,
                       page start (boot)
src/shared.js          brand helpers shared by the themes (colors, tiles,
                       title and end cards, step rows, crash effects,
                       status tags, app and Temporal panels, Event History
                       card, counters)
src/player.js          live player: controls, fit-to-window, shortcuts
src/themes/<theme>/    one folder per theme: index.html, the 1920x1080
                       theme page (background, subtitles, header, script
                       list); scenes/ (one file per scene: subtitle text +
                       animations) and theme-only helpers
src/assets/            official Temporal logo (white horizontal lockup)
src/fonts/             brand fonts (make setup), see src/fonts/README.md
scripts/               setup, fonts, render, preview, timeline, SRT
                       export, HTML build and server
docs/<theme>/script.md full script: subtitles, timings, animations
output/                generated .srt, .mp4 and standalone .html (the HTML
                       pages mirror src/: index.html, themes/<theme>/)
.github/workflows/     pages.yml: deploys the HTML pages to GitHub Pages
CLAUDE.md              conventions for Claude sessions working on the project
```

## Regenerate a video (macOS)

Requirements: Python 3.10+ and ffmpeg (`brew install python ffmpeg`).

```bash
make setup                   # venv + Playwright Chromium + fonts (once)
make timeline                # checks that everything loads, prints timings
make preview THEME=durable-ai-agents T="3 140 160"  # -> output/preview.png
make render                  # videos -> output/<theme>.mp4
make srt                     # subtitles -> output/<theme>.srt
make html                    # home page + players -> output/**/index.html
make serve                   # hot-reloading home page on http://localhost:8000
make clean                   # delete output/ (every generated file)
```

`timeline`, `render` and `srt` cover every theme; `timeline` prints each one
under a `== <theme> ==` header. Set the `THEME` variable to restrict them to
one theme. `preview` needs a theme, as its timestamps belong to one video.
Outputs are named after the theme:

```bash
make timeline THEME=durable-execution
make render THEME=durable-execution   # -> output/durable-execution.mp4
make srt THEME=agent-harness          # -> output/agent-harness.srt
```

An unknown `THEME` stops make with the list of valid themes.

`make render` and `make srt` only rebuild the outputs that are out of date:
each `output/<theme>.mp4` or `.srt` depends on its theme's own sources
(`src/themes/<theme>/`: its page and its scripts), the shared sources
(`src/*.js`, `src/*.css`, assets, fonts, `scripts/common.py`) and the
render or export script. Editing a scene rebuilds its theme only; editing
the home page (`src/index.html`, `src/home.css`) or the live player
(`src/player.js`) rebuilds no video. `make html` rebuilds when any source
of any page or `scripts/build_html.py` changes. Use `make -B render` to
force a full render.

`make clean` deletes `output/`: videos, subtitles, HTML pages, previews and
render leftovers. It leaves the virtualenv and the fonts in place.

Without make:

```bash
.venv/bin/python scripts/render_video.py --theme <theme> \
  [--start 130 --end 140] [--workers 4] [--fps 30]
```

The full render takes a few minutes on a recent Mac with several workers.

To check a single frame, run `make preview THEME=durable-ai-agents T=140`:
it writes the frame at 140 s to `output/preview.png`.

## Home page and standalone HTML players

`make html` builds `output/index.html`, the home page, and one player per
theme, `output/themes/<theme>/index.html`: `output/` mirrors `src/`, so the
links between the pages are the same in both. The home page links to each
theme folder, `themes/<theme>/`, which only an HTTP server resolves to its
`index.html`: `make serve` is the only way to view the home page and the
players. Each player has its scripts, fonts and logo inlined, so it needs
no other file. The animation fits the window and plays once, unless loop
is enabled (it is off by default); the controls (home, play/pause, seek
bar, time, speed, loop, subtitles, fullscreen) hide after a few seconds of
playback and come back when the mouse moves. The home button goes back to
the home page (`/`). Playback runs at 1x by default; the speed button
switches between 1x and 0.5x. At 0.5x, only the still moments between
animations stretch, which leaves time to explain the screen; the
animations keep their normal speed. Subtitles are shown by default; the CC
button hides or shows them. Shortcuts: Space = play/pause, Left/Right =
previous/next section (Left first restarts the current section if more
than 2 s in), S = speed 1x/0.5x, L = loop on/off, C = subtitles on/off,
F = fullscreen.

`make serve` serves the home page on `/` and each player on
`/themes/<theme>/`, over HTTP on `127.0.0.1` (rebuilding them first if
needed), on port 8000 by default (`CASPER_PORT` in a Casper workspace);
override it with `make serve PORT=9000`.

`make serve` hot-reloads: edit a file in `src/` and the server rebuilds the
pages, then every open tab reloads by itself and a player resumes at the
same position (a manual reload resumes too; each page keeps its own
position). A failed build prints its error and keeps the last good pages.
The reload script is added to the served pages only, never to the built
files.

## Deployment

The `.github/workflows/pages.yml` workflow publishes the home page and the
players to GitHub Pages on every push to `main`, or on demand from the
Actions tab (`workflow_dispatch`). It downloads the fonts
(`scripts/fonts.sh`, the font step of `make setup`), runs `make html` with
the runner's Python, then deploys `output/`. It builds no video and no
subtitle file, so it needs neither Playwright nor ffmpeg.

Pull requests to `main` run the same build without deploying: the pages are
attached to the run as the `github-pages` artifact, a tar archive of
`output/` that reviewers can download from the run's summary page.

Before the first run, set the repository's Pages source to "GitHub
Actions" in Settings > Pages.

The site must be served at the root of a domain, a custom domain or a
`<user>.github.io` repository: the player's home button links to `/`,
which a project site under `<user>.github.io/<repository>/` breaks.

## Editing

Each scene lives in its own file in `src/themes/<theme>/scenes/`, so people
editing different scenes never touch the same file.

- Subtitle text: `subs` of the relevant scene. The duration adapts to the
  text length and shifts everything after it; check with
  `make timeline THEME=<theme>`, then `make preview THEME=<theme>`.
- Animation: the scene's `update(t, c, s)` function, where `t` is the scene's
  local time and `c[i]` the moment subtitle `i` starts. Every animation is
  keyed to these cues.
- Centering: the scene's optional `shift`, `[dx, dy]` or `(t, c) => [dx, dy]`,
  translates the whole scene so its composition is centered at (960, 522),
  between the header and the subtitles. `pan(t, from, stops)` eases between
  offsets when the layout changes between phases.
- Chapter title: `title` next to `chapter` on the first scene of the chapter.
  The header and the progress segments are derived from it; a theme without
  chapters shows neither.
- New scene: create a file in `src/themes/<theme>/scenes/` that calls
  `scene({...})` inside a `{ ... }` block, so its helpers stay local to the
  file. Then add one `<script src="scenes/...">` line to
  `src/themes/<theme>/index.html`, in playing order. Scripts are classic
  `<script src>` tags, not ES modules: Chromium blocks modules on
  `file://`, which the renderer uses.
- Helpers: brand helpers for every theme go in `src/shared.js`; helpers used
  by one theme only go in `src/themes/<theme>/` (for example
  `src/themes/durable-ai-agents/shared.js`), loaded right after
  `../../shared.js`.
- Paths: a theme page loads the shared files with explicit relative paths
  (`../../styles.css`, `../../engine.js`) and its own scripts from its
  folder (`shared.js`, `scenes/...`). A script that builds an asset URL
  resolves it against itself, not against the page, like `LOGO` in
  `src/shared.js`.
- Colors, fonts, styles: `:root` and the CSS in `src/styles.css`, constant `C`
  in `src/shared.js`.

## Add a theme

1. Copy a theme page, for example `src/themes/durable-execution/index.html`,
   to `src/themes/<theme>/index.html`; set its `<title>` and its list of
   scene scripts. The new folder is a theme as soon as its page exists:
   `--theme` and `THEME=<theme>` accept it, and `make html` builds it.
2. Create `src/themes/<theme>/scenes/` with the scene files.
3. Add a card linking to `themes/<theme>/` in `src/index.html`; the cards
   wrap and keep the same size, with no CSS change.
4. Write the script in `docs/<theme>/script.md`.

Videos have no maximum length; `make timeline THEME=<theme>` reports it.

Conventions: see `CLAUDE.md`. Brand rules and decision history: see the
project memory in `.claude/project-memory/`.
