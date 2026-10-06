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
  share the available width. With 4 cards: 4 in a row from a ~1220 px
  window (so at 1280 and 1920 px), 3+1 from ~910 px, 2x2 from ~590 px,
  1 column on phones. Padding and icon scale with `clamp()`.
- Card order: Introduction to Durable Execution, Human-in-the-Loop, Durable
  AI Agents, Temporal Agent Harness.
- Cards show no video duration.
- The page text never calls the videos "silent" and never mentions sound or
  audio.
- Card titles and descriptions use small text (24 px titles, 16 px
  descriptions) so the cards stay light.
- Every video player has a home button, first in the control bar, back to
  the home page.

**Why:** the home page lists a growing set of videos; uniform, light cards
keep it calm, and durations or "silent" wording add noise for viewers.

**How to apply:** when adding a theme or editing the home page, keep the
cards uniform and the grid count-agnostic; check screenshots at a wide and a
narrow window.
