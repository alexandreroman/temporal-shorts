# Durable AI Agents with Temporal

Explainer video (2 min 59, English, no sound, burned-in subtitles) for a
non-technical audience: how an AI agent works, and why it needs Durable
Execution with Temporal.

The video is not edited in a video editor: it is an HTML page animated
deterministically (`renderAt(t)`), captured frame by frame by headless Chromium
(Playwright), then encoded to H.264 by ffmpeg.

## Contents

```text
src/index.html     1920x1080 page: background, subtitles, header, script list
src/styles.css     Temporal brand styles and the live player's CSS
src/engine.js      timeline, easing, placement, SVG icons, components
src/shared.js      brand helpers shared by the scenes (colors, tiles, steps)
src/scenes/        the 9 scenes, one file each (subtitle text + animations)
src/player.js      live player: controls, fit-to-window, shortcuts
src/assets/        official Temporal logo (white horizontal lockup)
src/fonts/         stand-in fonts (make setup), see src/fonts/README.md
scripts/           setup, render, preview, timeline, SRT export, HTML player
docs/script.md     full script: subtitles, timings, animations
output/            generated .srt, .mp4 and standalone .html
CLAUDE.md          conventions for Claude sessions working on the project
```

## Regenerate the video (macOS)

Requirements: Python 3.10+ and ffmpeg (`brew install python ffmpeg`).

```bash
make setup                   # venv + Playwright Chromium + fonts (once)
make timeline                # checks that everything loads, prints timings
make preview T="3 140 160"   # contact sheet -> output/preview.png
make render                  # video -> output/ai-agents-temporal-en.mp4
make srt                     # subtitles -> output/ai-agents-temporal-en.srt
make html                    # player -> output/ai-agents-temporal-en.html
make serve                   # hot-reloading player on http://localhost:8000
```

`make render`, `make srt` and `make html` only rebuild when a source file
(`src/`, `scripts/common.py`, the render, export or build script) is newer
than the output; use `make -B render` to force a full render.

Without make:

```bash
.venv/bin/python scripts/render_video.py \
  [--start 130 --end 140] [--workers 4] [--fps 30]
```

The full render takes a few minutes on a recent Mac with several workers.

To check a single frame, open `src/index.html?t=140` to freeze the animation
at 140 s.

## Standalone HTML player

`make html` builds `output/ai-agents-temporal-en.html`, a single file with the
scripts, fonts and logo inlined: send it by email or open it in any browser,
offline, with nothing else. The animation fits the window and plays once,
unless loop is enabled (it is off by default); the controls (play/pause, seek
bar, time, loop, subtitles, fullscreen) hide after a few seconds of playback
and come back when the mouse moves. Subtitles are shown by default; the CC
button hides or shows them. Shortcuts: Space = play/pause, Left/Right =
previous/next section (Left first restarts the current section if more than
2 s in), L = loop on/off, C = subtitles on/off, F = fullscreen. `make open`
plays `src/index.html` with the same player.

`make serve` serves only that page over HTTP on `127.0.0.1` (rebuilding it
first if needed), on port 8000 by default; override it with
`make serve PORT=9000`.

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
- Centering: the scene's optional `shift`, `[dx, dy]` or `(t, c) => [dx, dy]`,
  translates the whole scene so its composition is centered at (960, 522),
  between the header and the subtitles. `pan(t, from, stops)` eases between
  offsets when the layout changes between phases.
- Chapter title: `title` next to `chapter` on the first scene of the chapter.
  The header and the progress segments are derived from it.
- New scene: create a file in `src/scenes/` that calls `scene({...})` inside a
  `{ ... }` block, so its helpers stay local to the file. Then add one
  `<script src="scenes/...">` line to `src/index.html`, in playing order.
  Scripts are classic `<script src>` tags, not ES modules: Chromium blocks
  modules on `file://`, which the renderer uses.
- Colors, fonts, styles: `:root` and the CSS in `src/styles.css`, constant `C`
  in `src/shared.js`.

Conventions: see `CLAUDE.md`. Brand rules and decision history: see the
project memory in `.claude/project-memory/`.
