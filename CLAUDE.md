# Durable AI Agents with Temporal

A 3-minute silent explainer video, rendered from a deterministic HTML
animation, that shows a non-technical audience how AI agents work and why
they need Durable Execution with Temporal.

See [README.md](README.md) for full documentation.

## Tech stack

- HTML, CSS and vanilla JavaScript (1920x1080 animated page, `renderAt(t)`)
- Python with Playwright (headless Chromium frame capture)
- ffmpeg (H.264 encoding, segment concatenation)
- Make

## Build & run

```bash
make setup                   # venv, Playwright Chromium, stand-in fonts
make timeline                # scenes, subtitle timings and TOTAL duration
make preview T="12 40 136"   # contact sheet -> output/preview.png
make render                  # MP4, only if sources changed (-B to force)
make srt                     # SRT, only if sources changed
make html                    # standalone HTML player, only if sources changed
make serve                   # hot-reload HTML player on CASPER_PORT, else 8000
```

In Casper (`.casper.json`), Run (`casper run`) serves the HTML player on
`CASPER_PORT` (8000 in the primary workspace), Render (`casper run render`)
renders and opens the MP4; new workspaces run `make setup` automatically.

## Modules

- `src/`: the animation: `index.html` (stage, CSS), `engine.js` (timeline,
  helpers, components), `scenes.js` (subtitles and animations of 9 scenes)
- `scripts/`: setup, frame preview, parallel render, timeline, SRT export,
  standalone HTML build and server
- `docs/script.md`: full script: subtitles, timings, visuals
- `output/`: generated `.srt`, `.mp4` and standalone `.html`

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
- Keep the video ≤ 3:00 (`make timeline`). Key every animation to `c[i]`
  (subtitle start) so timings follow text changes.
- Keep rendering deterministic (no `Math.random`): parallel workers render
  segments independently.
- Live-mode player code (`startPlayer()`, `.live` CSS) must never affect the
  frozen `?t=` mode: rendered frames must stay pixel-identical.
- Check frames with `make preview` before `make render`; after a text change,
  run `make srt` and update `docs/script.md`.
