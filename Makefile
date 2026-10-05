PY := .venv/bin/python

VIDEO := output/ai-agents-temporal-en.mp4
SRT   := output/ai-agents-temporal-en.srt
HTML  := output/ai-agents-temporal-en.html

# Casper injects a unique CASPER_PORT per worktree workspace; the primary
# workspace and plain checkouts have none. Override with: make serve PORT=9000
PORT ?= $(if $(CASPER_PORT),$(CASPER_PORT),8000)

# Inputs shared by the video, the subtitles and the HTML player. Fonts are
# downloaded by `make setup`, so $(wildcard) expands to nothing when absent.
ANIMATION_SOURCES := src/index.html src/engine.js src/scenes.js \
                     $(wildcard src/assets/*) $(wildcard src/fonts/*) \
                     scripts/common.py

# Never keep a partial MP4, SRT or HTML from an interrupted or failed run:
# its fresh timestamp would make Make treat it as up to date.
.DELETE_ON_ERROR:

.PHONY: setup timeline preview render srt html serve open

setup:            ## venv + Playwright Chromium + brand stand-in fonts
	bash scripts/setup.sh

timeline:         ## print scenes and subtitle timings
	$(PY) scripts/timeline.py

preview:          ## contact sheet: make preview T="12 40 136"
	$(PY) scripts/preview.py $(T)

render: $(VIDEO)  ## full MP4 -> output/ai-agents-temporal-en.mp4

srt: $(SRT)       ## subtitles -> output/ai-agents-temporal-en.srt

html: $(HTML)     ## standalone HTML player -> output/ai-agents-temporal-en.html

serve: $(HTML)    ## HTML player on http://localhost:PORT (CASPER_PORT, else 8000)
	$(PY) scripts/serve_html.py --port $(PORT)

open:             ## play the animation live in the browser
	open src/index.html

$(VIDEO): $(ANIMATION_SOURCES) scripts/render_video.py
	$(PY) scripts/render_video.py

$(SRT): $(ANIMATION_SOURCES) scripts/export_srt.py
	$(PY) scripts/export_srt.py

$(HTML): $(ANIMATION_SOURCES) scripts/build_html.py
	$(PY) scripts/build_html.py
