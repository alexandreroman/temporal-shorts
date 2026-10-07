---
name: "Official Temporal logo"
description: "The video uses only official Temporal logo files, lockup and symbol, each with a cropped viewBox"
type: reference
---

# Official Temporal logo

The video uses two official Temporal logo files, both light (white). The only
change to each is a viewBox cropped to remove the margin.

- `src/assets/temporal-logo-horizontal-light-cropped.svg`: the horizontal
  lockup (symbol + wordmark), published with the brand assets at
  https://temporal.io/brand. viewBox cropped from `0 0 2400 1200` to
  `405 395 1570 410`. Used on title cards, end cards and in scenes.
- `src/assets/temporal-symbol-light-cropped.svg`: the symbol alone,
  `Temporal_Symbol_light.svg` from
  https://images.ctfassets.net/0uuz8ydxyd9p/6h19hCTYqrDacnDV8havze/58f49e40aa15d91f34654290ddc91e75/Temporal_Symbol_light.svg.
  viewBox cropped from `0 0 1200 1200` to `390.49 392 386 386`, the exact
  bounds of its path. It is the `#mark` corner logo, 32x32 px, bottom-left
  of the stage: left edge on the chapter number (`left:80px`, as `#hdr`),
  vertically centered on the subtitle box (`bottom:69px`), and lifted
  with it in the live player while the controls show (`--sub-lift`). The
  subtitle box sits above it: the widest subtitles (three in
  durable-ai-agents) cover part of it, an accepted overlap. It stays fully
  visible across chapter scene changes, fades in with the first chapter
  scene and out with the last one (the scene fade); intro and outro show
  no corner logo.

**Why:** the video is published under the Temporal brand; a redrawn or
approximated logo is off-brand.

**How to access:** take the light files from the Temporal brand assets and
re-apply the viewBox crop if a file must be refreshed.
