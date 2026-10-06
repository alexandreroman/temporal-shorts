#!/usr/bin/env bash
# One-time setup on macOS: Python venv, Playwright Chromium, fonts.
set -euo pipefail
cd "$(dirname "$0")/.."

command -v ffmpeg >/dev/null || { echo "ffmpeg missing: brew install ffmpeg"; exit 1; }
command -v python3 >/dev/null || { echo "python3 missing: brew install python"; exit 1; }

python3 -m venv .venv
# pip runs through python -m: the shebangs of .venv/bin/pip* keep the path the venv was created at, so they break
# once the checkout is moved or renamed.
.venv/bin/python -m pip install -q --upgrade pip
.venv/bin/python -m pip install -q -r requirements.txt
.venv/bin/python -m playwright install chromium

bash scripts/fonts.sh
# VENV_STAMP in the Makefile: while it is newer than requirements.txt and this script, the Playwright targets
# do not rerun the setup.
touch .venv/.requirements
echo "Setup OK. Try: make timeline && make preview THEME=durable-ai-agents T=\"3 140\""
