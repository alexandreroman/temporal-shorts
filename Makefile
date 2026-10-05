PY := .venv/bin/python

VIDEO := output/ai-agents-temporal-en.mp4
SRT   := output/ai-agents-temporal-en.srt

# Inputs shared by the video and the subtitles. Fonts are downloaded by
# `make setup`, so $(wildcard) simply expands to nothing when they are absent.
ANIMATION_SOURCES := src/index.html src/engine.js src/scenes.js \
                     $(wildcard src/assets/*) $(wildcard src/fonts/*) \
                     scripts/common.py

# Never keep a partial MP4 or SRT from an interrupted or failed run:
# its fresh timestamp would make Make treat it as up to date.
.DELETE_ON_ERROR:

.PHONY: setup timeline preview render srt open

setup:            ## venv + Playwright Chromium + brand stand-in fonts
	bash scripts/setup.sh

timeline:         ## print scenes and subtitle timings
	$(PY) scripts/timeline.py

preview:          ## contact sheet: make preview T="12 40 136"
	$(PY) scripts/preview.py $(T)

render: $(VIDEO)  ## full MP4 -> output/ai-agents-temporal-en.mp4

srt: $(SRT)       ## subtitles -> output/ai-agents-temporal-en.srt

open:             ## play the animation live in the browser (loops)
	open src/index.html

$(VIDEO): $(ANIMATION_SOURCES) scripts/render_video.py
	$(PY) scripts/render_video.py

$(SRT): $(ANIMATION_SOURCES) scripts/export_srt.py
	$(PY) scripts/export_srt.py
