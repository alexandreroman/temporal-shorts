---
name: "Search engine optimization of the site"
description: "Hidden transcript, title suffix, Markdown titles, structured data author, sitemap and site icon rules"
type: project
---

# Search engine optimization of the site

The HTML build (`scripts/build_html.py`) makes the theme pages readable by
search engines:

- Each built theme page holds a transcript of its Markdown version, an
  `<article class="transcript">` that is visually hidden (1px clipped
  pattern), never displayed and with no button to show it, and holds no
  links. Only `output/` pages carry it; `src/` pages stay free of it.
- A built theme page's `<title>` ends with ` | Temporal Shorts`; the
  `src/` title, the link preview tags and the JSON-LD use the bare title.
- The page `<title>` is written for search results. The Markdown version
  heading is the video name, from `<meta name="markdown-title">`, a
  separate source.
- JSON-LD names Alexandre Roman, a person, as author and publisher: the
  site is a personal project, not an official Temporal site.
- `sitemap.xml` lists the home page and the listed themes only (hidden
  cards excluded). Each `<lastmod>` is the git committer date of the last
  commit touching the page's own content: `src/index.html`, or
  `src/themes/<theme>/` and `src/themes/<theme>.md`. Shared sources do not
  count. A shallow clone or a tree without git gets no `<lastmod>`, so the
  Pages workflow checks out the full history (`fetch-depth: 0`, blobless).

**Why:** theme text lives in JavaScript scenes, invisible to crawlers;
the user wants nothing added to the visible page, and the Markdown
versions keep the video names for coding agents. File times in CI are
checkout times, so dates come from git; `<lastmod>` tells of a change of
the page's own content, not of shared code.

**How to apply:** keep the transcript hidden and link-free; edit a page
title without touching the Markdown headings; never present the site as
Temporal's own in metadata.
