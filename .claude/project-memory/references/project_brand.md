---
name: "Temporal brand rules"
description: "Colors, style, fonts and icon rules applied to the video, with their source"
type: project
---

# Temporal brand rules

Source: https://temporal.io/brand (official colors) plus the temporal.io site.

- Official colors: UV `#444CE7` (main accent), Space Black `#141414`
  (background, dark mode preferred), Off White `#F8FAFC` (text).
- Site additions: violet `#B664FF` (violet to UV gradient), neon `#DBFF4B`
  for status only ("done/saved" and the budget argument), red `#FF5A5F` for
  failures (as in the Temporal UI), slate `#94A3B8` for secondary text,
  dark slate `#5B6475` for labels on white cards, `#4B5363` for pill
  borders.
- Style: slightly rounded corners on rectangular shapes (`--r` 10 px for
  surfaces, `--rs` 6 px for pills and small blocks, 2 to 5 px for
  micro-elements), thin rules `#3A4150`, flat surfaces, spaced-out uppercase
  monospace labels, subtle starry sky, gradient glow anchored to the bottom
  edge with no hard edge (the background runs continuously behind the
  subtitles).
- Fonts: Noto Sans Mono (`Mono`, open source, from Fontsource) is the brand
  mono; Aeonik is unavailable, so Instrument Sans (`Brand`) stands in for
  it.
- Icons: hand-drawn stroke SVG set in `engine.js`; no emoji (off-brand).

**Why:** the video is published under the Temporal brand.

**How to apply:** reuse the CSS variables, the `C` constants and the `RGB`
triplets (tints and glows); use neon only as a status signal; swap in
Aeonik if it becomes available.
