---
name: "Live follow-up of a theme in progress"
description: "While a theme is built, its HTML player stays served and rebuilt so the user follows progress"
type: feedback
---

# Live follow-up of a theme in progress

While a theme is being built, its HTML player stays served and rebuilt as
each piece of work lands, so the user can watch progress in the browser at
`http://localhost:<port>/themes/<theme>/` (`make serve` or `casper run`,
on `CASPER_PORT`; the server rebuilds `output/` when `src/` changes).

**Why:** the user reviews the animations as they come, frame by frame,
rather than only at the end of the work.

**How to apply:** for a new theme, the HTML build needs
`src/themes/<theme>.md` and `src/themes/<theme>/social.png`: write them
early with `make markdown THEME=<theme>` and `make social` (see
[Frame capture noise](project_frame-noise.md) for the other themes'
images), and leave them uncommitted until the final regeneration. Give
the user the player link with the times of each new piece of work.
