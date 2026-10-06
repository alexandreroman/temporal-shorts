---
name: "HTML links and viewing"
description: "make serve is the only way to view the HTML pages: no make open, no file:// fallback"
type: project
---

# HTML links and viewing

The HTML pages (home page and players) are viewed only through
`make serve`: the project has no `make open` target and no `file://`
fallback for the pages. The link rules live in `CLAUDE.md` (Conventions).

**Why:** serving over HTTP is the one supported way to view the pages and
keeps clean folder URLs (`themes/<theme>/`) on the home page.

**How to apply:** reject `make open` targets, `index.html` suffixes in
links and `file://` workarounds for the pages.
