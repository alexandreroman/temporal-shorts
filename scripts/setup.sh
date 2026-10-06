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

bash scripts/fonts.sh
echo "Setup OK. Try: make timeline && make preview THEME=durable-ai-agents T=\"3 140\""
