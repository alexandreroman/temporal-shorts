---
name: "HTML links and viewing"
description: "Home page links to theme folders (themes/<theme>/), the home button to /; make serve is the only way to view the HTML pages"
type: project
---

# HTML links and viewing

The home page links to each theme as a folder, `themes/<theme>/`, with no
`index.html` in the URL; the player's home button links to `/`, the one
absolute link. `make serve` is the only way to view the HTML version (home
page and players): folder links need an HTTP server, so the pages are not
browsed over `file://`.

**Why:** clean folder URLs on the home page; serving over HTTP is the one
supported way to view the HTML pages.

**How to apply:** new theme cards link to `themes/<theme>/`; other links
between pages stay relative; do not add a `make open` target or `file://`
fallbacks for the pages. Rendering is separate: Playwright opens theme pages
directly over `file://` for `?t=` frames, so asset URLs built in JS still
resolve against the script.
