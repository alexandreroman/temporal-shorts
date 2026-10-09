# Temporal Shorts

[![CI](https://img.shields.io/github/actions/workflow/status/alexandreroman/temporal-shorts/pages.yml?branch=main&label=ci)](https://github.com/alexandreroman/temporal-shorts/actions/workflows/pages.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

Temporal Shorts: short explainer videos (English, no sound, burned-in
subtitles) about [Temporal](https://temporal.io).

Each video is a theme:

- **Meet Temporal** (`meet-temporal`): for everyone who has never heard of
  Temporal, its creators, Maxim Fateev and Samar Abbas, and its lineage,
  from Amazon Simple Workflow Service to the Microsoft Durable Task
  Framework, Uber Cadence and Temporal, founded in 2019; then what Temporal
  does, where it is used, why it matters for AI, how Temporal Cloud works
  and where Temporal stands today.
- **Introduction to Durable Execution** (`durable-execution`): for
  everyone, the principles of Durable Execution with Temporal Workflows:
  [Workflows](https://docs.temporal.io/workflows),
  [Activities](https://docs.temporal.io/activities), retries, the
  [Event History](https://docs.temporal.io/encyclopedia/event-history),
  replay and the Temporal web UI.
- **Human-in-the-Loop** (`human-in-the-loop`): how a Temporal
  Workflow waits durably for a person's decision, such as an approval, for
  minutes or days, then resumes where it left off.
- **Durable AI Agents** (`durable-ai-agents`): for a non-technical
  audience, how an AI agent works, and why it needs Durable Execution with
  Temporal.
- **Temporal Agent Harness** (`agent-harness`): for developers, the
  experimental [project of the same name][agent-harness]: AI agents that
  run as durable Temporal Workflows while you keep your AI SDK, with human
  approvals, one event stream, typed subagents and Code Mode.

![Durable AI Agents at 2:40: after a crash, the agent resumes on another
app instance and Temporal hands back the saved results from the Event
History](preview.png)

[agent-harness]: https://github.com/temporal-community/temporal-agent-harness

## Getting started

To watch the videos in a browser, you only need Python 3.10+:

```bash
git clone https://github.com/alexandreroman/temporal-shorts.git
cd temporal-shorts
make serve                   # home page on http://localhost:8000
```

Open <http://localhost:8000> and pick a theme. The first run downloads the
brand fonts. The pages need only the Python standard library, so no
virtualenv is required. To render the MP4 files, run `make setup` first
(see the [Developer guide](#developer-guide)).

## Developer guide

This guide explains how the project is organized, how to render the
videos and subtitles, how to edit a scene, add a theme and deploy the
HTML pages.

### Project layout

```text
src/index.html         home page: one card per theme (styles in home.css)
src/styles.css         Temporal brand styles and the live player's CSS
src/engine.js          timeline, easing, placement, SVG icons, components,
                       page start (boot)
src/shared.js          brand helpers shared by the themes (colors, tiles,
                       title and end cards, step rows, crash and takeover
                       effects, status tags, app and Temporal panels, Event
                       History card, counters, small animation helpers)
src/player.js          live player: controls, fit-to-window, shortcuts
src/themes/<theme>/    one folder per theme: index.html, the 1920x1080
                       theme page (background, subtitles, header, script
                       list); scenes/ (one file per scene: subtitle text +
                       animations), theme-only helpers and social.png
src/home.css, home.js  home page styles and star field
src/social.html        home link preview card, captured by make social
src/social.png         link preview image of the home page (make social)
src/assets/            Temporal lockup and symbol, founders' photo, language
                       logos (see src/assets/languages/README.md)
src/fonts/             brand fonts (downloaded by make), see
                       src/fonts/README.md
scripts/               setup, fonts, render, preview, timeline, layout
                       check, SRT export, social images, HTML build and
                       server
docs/<theme>/script.md full script: subtitles, timings, animations
output/                generated .srt, .mp4 and standalone .html (the HTML
                       pages mirror src/: index.html, themes/<theme>/)
.github/workflows/     pages.yml: deploys the HTML pages to GitHub Pages
CLAUDE.md              conventions for Claude sessions working on the project
preview.png            README screenshot (Durable AI Agents at 2:40)
```

### Regenerate a video (macOS)

Requirements: Python 3.10+ and [ffmpeg](https://ffmpeg.org/)
(`brew install python ffmpeg` with [Homebrew](https://brew.sh/)).
`make setup` installs [Playwright](https://playwright.dev/python/) and its
Chromium.

```bash
make setup                   # venv + Playwright Chromium + fonts (once)
make timeline                # checks that everything loads, prints timings
make layout                  # checks every scene stays inside y 150-880
make preview THEME=durable-ai-agents T="3 140 160"  # -> output/preview.png
make render                  # videos -> output/<theme>.mp4
make render SUBS=off         # same, no subtitles -> output/<theme>-nosubs.mp4
make srt                     # subtitles -> output/<theme>.srt
make social                  # link preview images -> src/**/social.png
make html                    # home page + players -> output/**/index.html
make serve                   # hot-reloading home page on http://localhost:8000
make clean                   # delete output/ (every generated file)
```

The targets run on `.venv/bin/python` once `make setup` has created it,
otherwise on the system `python3`: enough for `html` and `serve`, which need
only the standard library. `timeline`, `layout`, `preview`, `render`, `srt`
and `social` need Playwright and stop with a hint to run `make setup` when
it is missing. Once the virtualenv exists, these six targets rerun
`make setup` by themselves when `requirements.txt` or `scripts/setup.sh`
changes, so that a pinned Playwright upgrade also brings its Chromium build;
this alone does not rebuild an up-to-date MP4 or SRT. Override the
interpreter with `PY`, for example `make html PY=python`: no automatic setup
then. Every target that needs the brand fonts downloads them first when
they are missing.

`timeline`, `layout`, `render` and `srt` cover every theme; `timeline` and
`layout` print each one under a `== <theme> ==` header. Set the `THEME`
variable to restrict them to one theme. `preview` needs a theme, as its
timestamps belong to one video. Outputs are named after the theme:

```bash
make timeline THEME=durable-execution
make render THEME=durable-execution   # -> output/durable-execution.mp4
make srt THEME=agent-harness          # -> output/agent-harness.srt
```

An unknown `THEME` stops make with the list of valid themes.

The videos have the subtitles burned in. `make render SUBS=off` renders
them without, for instance to upload a clean video with the SRT file of
`make srt`: each one goes to `output/<theme>-nosubs.mp4`, its own file, so
that both versions keep their own up-to-date check. `SUBS` accepts `on`
(the default) and `off`; any other value stops make.

`make render` and `make srt` only rebuild the outputs that are out of date:
each `output/<theme>.mp4`, `-nosubs.mp4` or `.srt` depends on its theme's
own sources (`src/themes/<theme>/`: its page and its scripts), the shared
sources (`src/*.js`, `src/*.css`, assets, fonts, `scripts/common.py`) and
the render or export script. Editing a scene rebuilds its theme only; editing
the home page (`src/index.html`, `src/home.css`) or the live player
(`src/player.js`) rebuilds no video. `make html` rebuilds when any source
of any page, a `social.png` image or `scripts/build_html.py` changes. Use
`make -B render` to force a full render.

`make clean` deletes `output/`: videos, subtitles, HTML pages, previews and
render leftovers. It leaves the virtualenv and the fonts in place.

Without make:

```bash
.venv/bin/python scripts/render_video.py --theme <theme> \
  [--start 130 --end 140] [--workers 4] [--fps 30] [--no-subtitles]
```

`--no-subtitles` hides the subtitles and, without `--out`, writes
`output/<theme>-nosubs.mp4` instead of `output/<theme>.mp4`.

The full render takes a few minutes on a recent Mac with several workers.
The MP4 is H.264 ready for web streaming: its index sits at the start of the
file (faststart), with a keyframe every 2 seconds and a bitrate capped at
8 Mbit/s.

`make preview THEME=<theme> T="<times>"` writes a contact sheet of those
moments to `output/preview.png`. To check a single frame at full size, add
`--full` to the times: `make preview THEME=durable-ai-agents T="140 --full"`
writes the frame at 140 s to `output/frame_0140.00.png`, one file per
timestamp.

`make layout` (`scripts/layout_check.py`) checks the vertical layout rule
shared by every theme. Each scene keeps its resting content inside the
content frame, y 150 to 880: 66 px under the header and 80 px above the
subtitles. Only brief one-off effects, such as flashes, glitches or flying
coins, may leave it. A scene shorter than the frame is centered on y 515
within 25 px, and every scene spans at least 440 px, 60 % of the frame. The
check renders each scene inside each subtitle and just before its end,
measures the visible content at its resting size (an element a pop is
still scaling counts at its unscaled size), scene `shift` included, and
prints one line per scene: its top, bottom, height, middle and a verdict,
`ok`, `OUT`, `THIN` or `OFF-CENTER`. `OUT` allows 2 px past the frame, as
sub-pixel borders and strokes (a 1.5 px border) round past a whole-pixel
edge; an `OUT` scene also names the element that leaves the frame and
when. `OUT` fails the check; `THIN` and `OFF-CENTER` are warnings, as some
scenes have legitimate exceptions. The check goes on over every theme and
fails at the end if any scene is `OUT`.

### Home page and standalone HTML players

`make html` builds `output/index.html`, the home page, and one player per
theme, `output/themes/<theme>/index.html`: `output/` mirrors `src/`, so the
links between the pages are the same in both. The home page links to each
theme folder, `themes/<theme>/`, which only an HTTP server resolves to its
`index.html`: `make serve` is the only way to view the home page and the
players. Each player has its styles, scripts, fonts and images inlined, so
it needs no other file. The animation fits the window, its starry
background and glow filling the window whatever its shape, and plays once,
unless loop is enabled (it is off by default); the controls (home,
play/pause, seek bar, time, speed, loop, subtitles, presenter mode,
fullscreen) hide after a few seconds of playback and come back when the
mouse moves. Each control shows its name and shortcut on hover. The home
button goes back to the home page (`/`). Playback runs at 1x by default; the
speed button switches between 1x and 0.5x. At 0.5x, only the still moments
between animations stretch, which leaves time to explain the screen; the
animations keep their normal speed. Subtitles are shown by default; the CC
button hides or shows them. Presenter mode hides the subtitles, plays at
0.5x and holds at each subtitle cue after the first of a scene, before that
cue's animations begin, and again just before each scene fades out, with a
faint pause mark in the top-right corner while it holds; once the picture
stands still until the next hold, it jumps straight to it. Space, Right,
PageDown or the play button resumes. In presenter mode, a step runs from one
pause to the next. Right releases a pause, so the transition plays, or else
jumps to the next pause and holds there. Left plays the previous step, which
ends at the current pause, or restarts the current step if more than 2 s in;
it lands playing, so the step plays and holds again at its end.
PageUp/PageDown act as Left/Right. These keys leave the controls hidden, so
a clicker keeps the screen clean. Shortcuts: Space = play/pause, Left/Right
or PageUp/PageDown = previous/next section (Left first restarts the current
section if more than 2 s in), or previous/next step in presenter mode,
S = speed 1x/0.5x, L = loop on/off, C = subtitles on/off, P = presenter
mode on/off, F = fullscreen.

`make serve` serves the home page on `/` and each player on
`/themes/<theme>/`, over HTTP on `127.0.0.1` (rebuilding them first if
needed), on port 8000 by default (`CASPER_PORT` in a Casper workspace);
override it with `make serve PORT=9000`.

A `#t=<time>` fragment opens a player paused at that time, in seconds
(`70`, `70.5`) or `m:ss` as in the time label (`1:10`, `1:10.5`), for
example `http://localhost:8000/themes/human-in-the-loop/#t=70`; Space plays
on. Editing the fragment in an open tab jumps there, paused. An invalid
value is ignored, and a reload keeps the current position over the
fragment. While paused, the player writes its position into the URL in
whole seconds (`#t=70`), so copying the URL shares that moment; playing
clears the fragment. Not to be confused with `?t=<seconds>`, the frozen
frame of frame capture, without the player.

`make serve` hot-reloads: edit a file in `src/` and the server rebuilds the
pages, then every open tab reloads by itself and a player resumes at the
same position (a manual reload resumes too; each page keeps its own
position). A failed build prints its error and keeps the last good pages.
The reload script is added to the served pages only, never to the built
files.

### Social link previews

The deployed pages carry link preview tags, so a shared link shows a card
on social networks: Open Graph (`og:title`, `og:description`, `og:url`,
`og:image` and its size), an X `summary_large_image` card and a canonical
link. The title and description come from the page's `<title>` and
`<meta name="description">`; the build stops if either is missing, with or
without the tags. The tags sit at the top of `<head>`, right after the
description, ahead of the inlined fonts and scripts: crawlers such as
Slack's read only the start of a page, and the build stops if `og:image`
comes after the first inline style or script.

These tags need the absolute root URL of the site, which `make html` reads
from the `SITE_URL` variable. The Pages workflow sets it to the URL given
by GitHub Pages (see [Deployment](#deployment)). Local builds leave it
empty and print that they skipped the tags. To check them locally, set it
and force the rebuild, as an up-to-date build ignores a new value:

```bash
make -B html SITE_URL=https://example.com
```

Each page's image is a 1200x630 `social.png` in its folder:
`src/social.png` for the home page, `src/themes/<theme>/social.png` for a
theme, which shows the title card of the intro without its subtitle. The
home image is the card of `src/social.html`, a page made for the capture
alone (the build skips it): the "Temporal shorts" lockup of the home page
header (`.brand` in `home.css`) scaled up, above the order steps of the
Durable Execution intro, on the home page background (`home.css`,
`home.js`). `make social` writes the images with Playwright; they are
committed, so `make html` and CI only copy them next to the built pages.
Nothing in the build detects a stale image, so any change to what an image
shows comes with a `make social` run and the updated PNGs, in the same
commit:

- an intro scene (`scenes/00-intro.js`): its title card, texts, layout or
  the timing of its first subtitle (the capture time is the end of that
  subtitle)
- a shared visual drawn on a title card: `makeTitleBlock`, the logo, the
  star field, the brand colors in `src/styles.css` or `src/shared.js`, the
  fonts
- the home card: `src/social.html` (its texts and layout) and what it
  shares with the home page: the "Temporal shorts" lockup (`.home .brand`
  in `src/home.css`, which the card scales with `--logo`), the background
  (`src/home.css`, the star field of `src/home.js`), the brand styles,
  fonts and logo; the markup and theme cards of `src/index.html` do not
  appear in the image
- an icon of the order steps (`card`, `box`, `truck`, `mail`) or of the
  `check` and `retry` badges: `src/social.html` holds inline copies of
  their paths, to update with their source (`ICONS` in `src/engine.js`,
  `src/themes/durable-execution/shared.js`)
- a page `<title>` or `<meta name="description">`: check that the image
  still matches the text
- a new theme: `make html` fails without its `social.png`

Look at each changed PNG before committing it.

### Editing

Each scene lives in its own file in `src/themes/<theme>/scenes/`, so people
editing different scenes never touch the same file.

- Subtitle text: `subs` of the relevant scene. The duration adapts to the
  text length and shifts everything after it; check with
  `make timeline THEME=<theme>`, then
  `make preview THEME=<theme> T="<times>"`.
- Animation: the scene's `update(t, c, s)` function, where `t` is the scene's
  local time and `c[i]` the moment subtitle `i` starts. Every animation is
  keyed to these cues. Continuous ambient loops (spinners, blinks, dashed
  flows) read the ambient clock `G`, never `t`: 0.5x slows `t` only.
- Presenter stops: presenter mode holds at each cue but the first of a
  scene, and at the end of each scene, just before its fade-out (`fadeOut`,
  0.5 s by default). If a cue's animation starts a little before its cue,
  set `stopLead` on that subtitle to move its stop that many seconds
  earlier, just before the animation (`stopLead: 0.4` for an animation at
  `c[1] - 0.35`). A scene whose ending animation should play straight into
  the next scene sets `holdBeforeEnd` (seconds before its end, or
  `(c, dur) => seconds` from its cues and duration) to hold there instead,
  before that animation starts. A step whose picture stays
  still from one stop to the next is empty: the player plays through it
  rather than holding the same picture twice, and Left steps back over
  it. Only the live player reads these: rendered frames do not change.
- Centering: the scene's optional `shift`, `[dx, dy]` or `(t, c) => [dx, dy]`,
  translates the whole scene so its composition is centered at (960, 515),
  inside the content frame y 150-880 between the header and the subtitles
  (`make layout` checks it). `pan(t, from, stops)` eases between
  offsets when the layout changes between phases.
- Fades: every scene fades in and out over 0.5 s; the optional `fadeIn` and
  `fadeOut` set other durations, for a cut that continues one motion across
  two scenes (meet-temporal zooms into the AI hub this way). A chapter scene's
  header fades with the scene; the optional `headerOutAt` (scene time, or
  `(c, dur) => time`) fades it out earlier, over 0.4 s, for an ending that
  plays without it.
- Chapter title: `title` next to `chapter` on the chapter's scene: each
  chapter is one scene, numbered 1, 2, 3... in playing order. The header
  and the progress segments are derived from them; a theme without chapters
  shows neither.
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
  folder (`shared.js`, `scenes/...`). Asset URLs built in JavaScript come
  from `assetUrl('assets/...')` in `src/shared.js`: it resolves them against
  that script, not against the page, and the literal path lets the HTML
  build inline the file.
- Colors, fonts, styles: `:root` and the CSS in `src/styles.css`, constant `C`
  in `src/shared.js`.

### Add a theme

1. Copy a theme page, for example `src/themes/durable-execution/index.html`,
   to `src/themes/<theme>/index.html`; set its `<title>`, its
   `<meta name="description">` and its list of scene scripts. The new
   folder is a theme as soon as its page exists: `--theme` and
   `THEME=<theme>` accept it, and `make html` builds it.
2. Create `src/themes/<theme>/scenes/` with the scene files, and
   `src/themes/<theme>/shared.js` for the helpers of the theme alone,
   loaded right after `../../shared.js`.
3. Add a card linking to `themes/<theme>/` in `src/index.html`; the cards
   wrap and keep the same size, with no CSS change. Its icon animates on
   hover: give it an animation in `src/home.css`, next to those of the
   other cards. To keep the theme
   unlisted, add the `hidden` attribute to its card
   (`<a class="theme" href="themes/<theme>/" hidden>`): `make html` drops
   the card from the built home page, so the page holds no link to the
   theme, but the theme is still built, rendered, deployed and reachable at
   `themes/<theme>/`. The home page `<meta name="description">` names the
   themes: edit it by hand.
4. Write the script in `docs/<theme>/script.md`.
5. Add the theme to the theme lists at the top of `README.md` and
   `CLAUDE.md`.
6. Run `make social` and commit `src/themes/<theme>/social.png`: the HTML
   build needs it.

Videos have no maximum length; `make timeline THEME=<theme>` reports it.

Conventions: see `CLAUDE.md`. Brand rules and decision history: see the
project memory in `.claude/project-memory/`.

### Deployment

The `.github/workflows/pages.yml` workflow publishes the home page and the
players to [GitHub Pages](https://docs.github.com/en/pages) on every push to
`main`, or on demand from the Actions tab (`workflow_dispatch`). It runs
`make html` with the runner's Python (make downloads the fonts first with
`scripts/fonts.sh`, the font step of `make setup`), then deploys `output/`.
It builds no video and no subtitle file, so it needs neither Playwright nor
ffmpeg.

Pull requests to `main` run the same build without deploying: the pages are
attached to the run as the `github-pages` artifact, a tar archive of
`output/` that reviewers can download from the run's summary page.

Before the first run, set the repository's Pages source to "GitHub
Actions" in Settings > Pages.

The site must be served at the root of a domain, a custom domain or a
`<user>.github.io` repository: the player's home button links to `/`,
which a project site under `<user>.github.io/<repository>/` breaks.

The link preview tags hold absolute URLs, as social networks require. The
workflow takes the site URL from the Pages configuration
(`actions/configure-pages`, custom domain included) and passes it to the
build as `SITE_URL`, so no domain is written in the build or the
workflow. Pull request builds skip that step: their pages have no link
preview tags.

## Contributing

Contributions are welcome: a fix, a clearer subtitle, a new scene or a
whole new theme. Open an
[issue](https://github.com/alexandreroman/temporal-shorts/issues) to
report a problem or discuss an idea, or send a pull request to `main`.
Each pull request builds the HTML pages and attaches them to the run (see
[Deployment](#deployment)), so reviewers can watch the change.

By contributing, you agree that your work is licensed under the
[Apache License 2.0](LICENSE).
