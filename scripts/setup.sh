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

# Fonts (SIL OFL): Instrument Sans stands in for Aeonik, JetBrains Mono for Noto Sans Mono.
# index.html uses src/fonts/*.ttf when present, otherwise these Fontsource woff2 files.
F=src/fonts
for spec in "instrument-sans 400" "instrument-sans 700" "jetbrains-mono 400" "jetbrains-mono 700"; do
  set -- $spec
  f="$1-latin-$2-normal.woff2"
  if [ ! -s "$F/$f" ]; then
    echo "Downloading $f"
    curl -fsSL -o "$F/$f" "https://cdn.jsdelivr.net/npm/@fontsource/$1/files/$f"
  fi
done
echo "Setup OK. Try: make timeline && make preview T=\"3 140\""
