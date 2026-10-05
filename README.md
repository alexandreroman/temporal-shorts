# Durable AI Agents with Temporal

Explainer video (2 min 59, English, no sound, burned-in subtitles) for a non-technical audience:
how an AI agent works, and why it needs Durable Execution with Temporal.

The video is not edited in a video editor: it is an HTML page animated deterministically
(`renderAt(t)`), captured frame by frame by headless Chromium (Playwright), then encoded to H.264
by ffmpeg.

## Contents

```
src/index.html        1920x1080 page: starry background, subtitles, header, ordered script list
src/styles.css        Temporal brand styles and the live player's CSS
src/engine.js         engine: timeline, easing, placement, SVG icons, components (LLM orb, app, cards)
src/shared.js         brand helpers shared by the scenes (colors, tiles, steps)
src/scenes/           the 9 scenes, one file each (subtitle text + animations)
src/player.js         live player: controls, fit-to-window, shortcuts
src/assets/           official Temporal logo (white horizontal lockup, cropped viewBox)
src/fonts/            stand-in fonts, downloaded by make setup (see src/fonts/README.md)
scripts/              setup, render, preview, timeline, SRT export, HTML build and server
docs/script.md        full script: subtitles, timings, description of the animations
output/               generated .srt subtitles, .mp4 video and standalone .html player
CLAUDE.md             full context to pick the work up in another Claude session
```

## Regenerate the video (macOS)

Requirements: Python 3.10+ and ffmpeg (`brew install python ffmpeg`).

```bash
cd ~/Projects/temporal-agent-101
make setup                   # venv + Playwright Chromium + fonts (once)
make timeline                # checks that everything loads and prints the timeline
make preview T="3 140 160"   # contact sheet -> output/preview.png
make render                  # full video -> output/ai-agents-temporal-en.mp4
make srt                     # subtitles -> output/ai-agents-temporal-en.srt
make html                    # standalone player -> output/ai-agents-temporal-en.html
make serve                   # hot-reloading player on http://localhost:8000
```

`make render`, `make srt` and `make html` only rebuild when a source file (`src/`,
`scripts/common.py`, the render, export or build script) is newer than the output; use
`make -B render` to force a full render.

Without make: `.venv/bin/python scripts/render_video.py [--start 130 --end 140] [--workers 4] [--fps 30]`.

The full render is 5,370 frames. In the Claude sandbox (1 CPU) it took about 8 min; on a recent Mac
with several workers, expect a few minutes.

To watch the animation live: `make open`, or open `src/index.html?t=140` to freeze the frame at
140 s.

## Standalone HTML player

`make html` builds `output/ai-agents-temporal-en.html`, a single file with the
scripts, fonts and logo inlined: send it by email or open it in any browser,
offline, with nothing else. The animation fits the window and plays once, unless
loop is enabled (it is off by default); the controls (play/pause, seek bar,
time, loop, subtitles, fullscreen) hide after a few seconds of playback and come
back when the mouse moves. Subtitles are shown by default; the CC button hides
or shows them. Shortcuts: Space = play/pause, Left/Right = -5 s/+5 s, L = loop
on/off, C = subtitles on/off, F = fullscreen. `make open` plays `src/index.html`
with the same player.

`make serve` serves only that page over HTTP on `127.0.0.1` (rebuilding it first if needed), on
port 8000 by default; override it with `make serve PORT=9000`.

`make serve` hot-reloads: edit a file in `src/` and the server rebuilds the
page, then every open tab reloads by itself and resumes at the same position
(a manual reload resumes too). A failed build prints its error and keeps the
last good page. The reload script is added to the served page only, never to
the built file.

## Editing

Each scene lives in its own file in `src/scenes/`, so people editing different
scenes never touch the same file.

- Subtitle text: `subs` of the relevant scene in `src/scenes/`. The duration
  adapts to the text length and shifts everything after it; check with
  `make timeline`, then `make preview`.
- Animation: the scene's `update(t, c, s)` function, where `t` is the scene's
  local time and `c[i]` the moment subtitle `i` starts. Every animation is
  keyed to these cues.
- Chapter title: `title` next to `chapter` on the first scene of the chapter.
  The header and the progress segments are derived from it.
- New scene: create a file in `src/scenes/` that calls `scene({...})` inside a
  `{ ... }` block, so its helpers stay local to the file. Then add one
  `<script src="scenes/...">` line to `src/index.html`, in playing order.
  Scripts are classic `<script src>` tags, not ES modules: Chromium blocks
  modules on `file://`, which the renderer uses.
- Colors, fonts, styles: `:root` and the CSS in `src/styles.css`, constant `C`
  in `src/shared.js`.

Architecture details, brand rules and decision history: see `CLAUDE.md`.
