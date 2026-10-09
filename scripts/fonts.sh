#!/usr/bin/env bash
# Download the brand fonts into src/fonts/. Run by setup.sh, and by make before any target that needs the fonts.
set -euo pipefail
cd "$(dirname "$0")/.."

# Fonts (SIL OFL): Noto Sans Mono is the brand mono; Instrument Sans stands in for Aeonik only.
# The @font-face rules in src/styles.css load these Fontsource woff2 files.
# The pinned version keeps glyphs and widths, hence the layout, identical on every machine. The stamp file
# records the version on disk: when it differs or is missing, every file is downloaded again.
F=src/fonts
FONT_VERSION=5.3.0
stale=false
[ "$(cat "$F/.version" 2>/dev/null)" = "$FONT_VERSION" ] || stale=true
for spec in "instrument-sans 400" "instrument-sans 700" "noto-sans-mono 400" "noto-sans-mono 700"; do
  set -- $spec
  f="$1-latin-$2-normal.woff2"
  if $stale || [ ! -s "$F/$f" ]; then
    echo "Downloading $f"
    # Download to a .part file first: an interrupted curl must not leave a partial font that passes -s.
    curl -fsSL -o "$F/$f.part" "https://cdn.jsdelivr.net/npm/@fontsource/$1@$FONT_VERSION/files/$f"
    mv "$F/$f.part" "$F/$f"
  fi
done
# Rewrite the stamp only when the version changes: the Makefile rebuilds every output when the stamp is newer.
if $stale; then
  echo "$FONT_VERSION" > "$F/.version"
fi
