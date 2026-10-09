---
name: "Home page design"
description: "Theme picker cards: equal size, flexible grid for future videos, no duration, no 'silent', small text"
type: feedback
---

# Home page design

The theme picker (`src/index.html`, `src/home.css`) follows these rules:

- Every card has the same width and height, whatever its text length.
- Cards sit in a flexible grid (auto-fit columns, equal row heights) that
  takes any number of videos: adding a card needs no CSS change.
- Card size is responsive: columns are at least 260 px wide and stretch to
  share the available width. With 5 cards: 5 in a row from a ~1530 px
  window (so at 1920 px), 4+1 from ~1220 px (so at 1280 px), 3+2 from
  ~910 px, 2 columns from ~590 px, 1 column on phones. Padding and icon
  scale with `clamp()`.
- Card order: Meet Temporal (the entry point for newcomers, with a
  handshake icon), Introduction to Durable Execution, Human-in-the-Loop,
  Durable AI Agents, Temporal Agent Harness.
- A theme is unlisted by adding the standard `hidden` attribute to its card
  in `src/index.html`: `make html` (`scripts/build_html.py`) drops the card
  from the built home page, so the page holds no link to the theme, and the
  other cards fill the row. The theme is still built, rendered, deployed and
  reachable at `themes/<theme>/`. The home page `<meta name="description">`
  names the themes and is edited by hand.
- Cards show no video duration.
- The page text never calls the videos "silent" and never mentions sound or
  audio.
- Card titles and descriptions use small text (24 px titles, 16 px
  descriptions) so the cards stay light.
- Every video player has a home button, first in the control bar, back to
  the home page.
- The header is only the "Temporal shorts" lockup, the page's `<h1>`: the
  official logo image, untouched, then the word "shorts", lowercase, in the
  Brand font and the slate gray `#64748B`, on the wordmark's baseline and at
  its x-height, a bit more than a word space after it. No other title or
  lead text.
- Each theme icon plays a short thematic animation (~0.6 s) once on card
  hover or focus, in pure CSS; the resting icon stays pixel-identical, and
  `prefers-reduced-motion: reduce` turns the animations off.

**Why:** the home page lists a growing set of videos; uniform, light cards
keep it calm, and durations or "silent" wording add noise for viewers.

**How to apply:** when adding a theme or editing the home page, keep the
cards uniform and the grid count-agnostic; check screenshots at a wide and a
narrow window.
