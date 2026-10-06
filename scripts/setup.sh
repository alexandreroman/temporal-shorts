#!/usr/bin/env bash
# One-time setup on macOS: Python venv, Playwright Chromium, fonts.
set -euo pipefail
cd "$(dirname "$0")/.."

command -v ffmpeg >/dev/null || { echo "ffmpeg missing: brew install ffmpeg"; exit 1; }
command -v python3 >/dev/null || { echo "python3 missing: brew install python"; exit 1; }

python3 -m venv .venv
.venv/bin/pip install -q --upgrade pip
.venv/bin/pip install -q -r requirements.txt
.venv/bin/python -m playwright install chromium

# Fonts (SIL OFL): Noto Sans Mono is the brand mono; Instrument Sans stands in for Aeonik only.
# The @font-face rules in src/styles.css load these Fontsource woff2 files.
F=src/fonts
for spec in "instrument-sans 400" "instrument-sans 700" "noto-sans-mono 400" "noto-sans-mono 700"; do
  set -- $spec
  f="$1-latin-$2-normal.woff2"
  if [ ! -s "$F/$f" ]; then
    echo "Downloading $f"
    # Download to a .part file first: an interrupted curl must not leave a partial font that passes -s.
    # The pinned version keeps glyphs and widths, hence the layout, identical on every machine.
    curl -fsSL -o "$F/$f.part" "https://cdn.jsdelivr.net/npm/@fontsource/$1@5.3.0/files/$f"
    mv "$F/$f.part" "$F/$f"
  fi
done
echo "Setup OK. Try: make timeline && make preview THEME=durable-ai-agents T=\"3 140\""
