---
name: "GitHub Pages deployment"
description: "HTML pages only, deployed to GitHub Pages at the root of a dedicated domain so the home link / holds"
type: project
---

# GitHub Pages deployment

The public site is the `make html` output only (home page and one player
per theme), deployed to GitHub Pages by `.github/workflows/pages.yml` on
every push to `main`. Pull requests to `main` run the build job only, with
no deploy: the pages are attached to the run as the `github-pages`
artifact. MP4 and SRT files are not built in CI. The site is
served at the root of a dedicated domain (a custom domain or a
`<user>.github.io` repository), never under a `/<repo>/` subpath.

**Why:** the player's home button is the absolute link `/`; at a domain
root it reaches the home page, under a subpath it would leave the site.
The HTML build needs only Python and the fonts, which keeps CI fast.

**How to apply:** keep the home link `/`; do not add render or SRT steps
to the Pages workflow. See [[project_html-links]].
