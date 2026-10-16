---
name: "Search engine optimization of the site"
description: "Search decisions: hidden link-free transcript, search titles apart from video names, personal author, own-content lastmod"
type: project
---

# Search engine optimization of the site

The HTML build (`scripts/build_html.py`) makes the theme pages readable by
search engines (mechanics: README.md, Search engines). The decisions:

- Nothing is added to the visible page: each built theme page carries a
  transcript of its Markdown version that stays visually hidden, with no
  button to show it and no links; `src/` pages stay free of it.
- The page `<title>` and description are written for search results; the
  video name, heading of the Markdown version, comes from
  `<meta name="markdown-title">`, a separate source.
- The site is a personal project of Alexandre Roman, a person, author and
  publisher in the structured data, never presented as Temporal's own.
- A `<lastmod>` reflects a change of the page's own content
  (`src/index.html`, or the theme folder and its Markdown version), never
  of shared code, and comes from git.

**Why:** theme text lives in JavaScript scenes, invisible to crawlers;
the user wants nothing added to the visible page, and the Markdown
versions keep the video names for coding agents. File times in CI are
checkout times, so dates come from git; `<lastmod>` tells of a change of
the page's own content, not of shared code.

**How to apply:** keep the transcript hidden and link-free; edit a page
title without touching the Markdown headings; never present the site as
Temporal's own in metadata.
