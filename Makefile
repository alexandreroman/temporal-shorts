# The HTML pages need only the standard library: `make html` and `make serve` run on the system python3 right after a
# clone. Frames need Playwright, which `make setup` installs in the virtualenv: used as soon as it exists.
# Override with: make html PY=python
PY := $(if $(wildcard .venv/bin/python),.venv/bin/python,python3)

# Recipe line that stops with a hint, not a Python traceback, when $(PY) cannot import the modules $(1) (before
# `make setup`). Inside a recipe, it runs only when the target is rebuilt: an up-to-date MP4 or SRT stays so.
require = @$(PY) -c "$(foreach module,$(1),import $(module);)" 2>/dev/null || \
	{ echo "$(PY) cannot import $(1): run make setup first, or pass PY=<python with $(1)>" >&2; exit 1; }

# One video per theme: src/themes/<theme>/index.html plays the scenes of its folder; src/index.html is the home page.
ALL_THEMES := $(patsubst src/themes/%/index.html,%,$(wildcard src/themes/*/index.html))

# timeline, render and srt cover every theme; THEME=<theme> restricts them to one. preview needs one.
THEME ?=
ifeq ($(THEME),)
THEMES := $(ALL_THEMES)
else ifeq ($(filter $(THEME),$(ALL_THEMES)),)
$(error Unknown THEME=$(THEME). Valid themes: $(ALL_THEMES))
else
THEMES := $(THEME)
endif

VIDEOS    := $(THEMES:%=output/%.mp4)
SUBTITLES := $(THEMES:%=output/%.srt)
# The HTML build writes every page, the home page (output/index.html) last: it stands for the whole build.
HTML      := output/index.html

# Casper injects a unique CASPER_PORT per worktree workspace; the primary
# workspace and plain checkouts have none. Override with: make serve PORT=9000
PORT ?= $(if $(CASPER_PORT),$(CASPER_PORT),8000)

# The home page is not part of any video: editing it must not invalidate an MP4 or an SRT.
HOME_SOURCES := src/index.html src/home.css
# The fonts are git-ignored: their version stamp, written by fonts.sh, stands for them. As a prerequisite, it
# downloads them on the first build after a clone, even without `make setup`, and again when fonts.sh pins a new one.
FONTS := src/fonts/.version
# Inputs shared by every theme. The wildcards pick up new scripts, stylesheets and assets.
SHARED_SOURCES := $(filter-out $(HOME_SOURCES),$(wildcard src/*.js src/*.css src/assets/*)) \
                  $(FONTS) scripts/common.py
# The live player never changes a frame or a subtitle: editing it must not invalidate an MP4 or an SRT.
VIDEO_SOURCES := $(filter-out src/player.js,$(SHARED_SOURCES))
# Inputs of one theme: its page and every script of its folder (helpers and scenes).
theme_sources = src/themes/$(1)/index.html $(wildcard src/themes/$(1)/*.js src/themes/$(1)/*/*.js)
# The HTML build depends on every page, the home page and the live player included.
ALL_SOURCES := $(SHARED_SOURCES) $(HOME_SOURCES) $(foreach theme,$(ALL_THEMES),$(call theme_sources,$(theme)))

# Never keep a partial MP4, SRT or HTML from an interrupted or failed run:
# its fresh timestamp would make Make treat it as up to date.
.DELETE_ON_ERROR:

.PHONY: setup timeline preview render srt html serve clean

setup:            ## venv + Playwright Chromium + fonts
	bash scripts/setup.sh

timeline: $(FONTS)  ## print scenes and subtitle timings of every theme [THEME=<theme>]
	$(call require,playwright)
	@for theme in $(THEMES); do \
		echo "== $$theme =="; \
		$(PY) scripts/timeline.py --theme $$theme || exit 1; \
		echo; \
	done

preview: $(FONTS)   ## contact sheet of one theme: make preview THEME=<theme> T="12 40 136"
	$(if $(THEME),,$(error preview needs a theme: make preview THEME=<theme> T="...". Themes: $(ALL_THEMES)))
	$(call require,playwright PIL)
	$(PY) scripts/preview.py --theme $(THEME) $(T)

render: $(VIDEOS)       ## one MP4 per theme -> output/<theme>.mp4 [THEME=<theme>]

srt: $(SUBTITLES)       ## one SRT per theme -> output/<theme>.srt [THEME=<theme>]

html: $(HTML)     ## home page + one standalone HTML player per theme -> output/index.html, output/themes/

serve: $(HTML)    ## home page and players on http://localhost:PORT (CASPER_PORT, else 8000)
	$(PY) scripts/serve_html.py --port $(PORT)

clean:            ## delete every generated file: output/ (MP4, SRT, HTML, previews, render leftovers)
	rm -rf output

# One rule per theme: output/<theme>.mp4 and output/<theme>.srt depend on the
# shared inputs (the player aside) and on that theme's own inputs only, so
# editing a scene rebuilds the outputs of its theme alone. $$* is the theme
# (the stem).
.SECONDEXPANSION:

$(ALL_THEMES:%=output/%.mp4): output/%.mp4: $(VIDEO_SOURCES) $$(call theme_sources,$$*) scripts/render_video.py
	$(call require,playwright)
	$(PY) scripts/render_video.py --theme $*

$(ALL_THEMES:%=output/%.srt): output/%.srt: $(VIDEO_SOURCES) $$(call theme_sources,$$*) scripts/export_srt.py
	$(call require,playwright)
	$(PY) scripts/export_srt.py --theme $*

$(HTML): $(ALL_SOURCES) scripts/build_html.py
	$(PY) scripts/build_html.py

# fonts.sh rewrites the stamp only when the pinned version changes; touch it anyway, or any other edit of fonts.sh
# would leave the stamp older than the script and rerun this rule on every make.
$(FONTS): scripts/fonts.sh
	bash scripts/fonts.sh
	touch $@
