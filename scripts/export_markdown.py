"""Write src/themes/<theme>.md, the Markdown version of a theme, for coding agents.

The text comes from the built page only, so it cannot drift from the video: the title from the theme page's
<meta name="markdown-title">, the name of the video, which the search-oriented <title> of the page may extend, and
the summary from its <meta name="description">, then one section per chapter of the scenes
(src/themes/<theme>/scenes/), its subtitles joined into one paragraph. Each section links to the player at the
chapter start. The links are absolute paths from the site root, /themes/<theme>/#t=<seconds>, as the site is served
at a domain root (the player's home button links to /). The file is committed, like social.png: CI has no
Playwright, so `make html` only copies it to output/themes/<theme>.md.

  python scripts/export_markdown.py --theme <theme>
"""
import argparse
import json
import math
import re
import sys
import textwrap
from html import unescape
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import ROOT, add_theme_argument, open_page, theme_markdown
from playwright.sync_api import sync_playwright

LINE_WIDTH = 80
# A scene without a chapter after the chapters, the closing scene, gets its own section under this heading.
OUTRO_HEADING = "Outro"

# Everything the page knows of its text: the scenes in playing order, with their chapters and subtitles.
READ_PAGE = """JSON.stringify({
  title: document.querySelector('meta[name="markdown-title"]')?.content ?? null,
  summary: document.querySelector('meta[name="description"]').content,
  scenes: scenes.map(s => ({chapter: s.chapter || null, title: s.title || null, start: s.start,
                            subs: s.subs.map(x => x.text)})),
})"""

HTML_TAG = re.compile(r"<[^>]+>")
# Characters that would start emphasis, code, a link or an HTML tag anywhere in a line.
INLINE_MARKUP = re.compile(r"([\\`*_\[\]<])")
# Line starts that would turn a wrapped line of prose into a heading, a quote, a list item or a setext underline.
HEADING_START = re.compile(r"^#{1,6}(?=\s|$)")
MARKER_START = re.compile(r"^>|^[+-](?=\s|$)")
ORDERED_LIST_START = re.compile(r"^(\d{1,9})([.)])(?=\s|$)")
SETEXT_UNDERLINE = re.compile(r"^=+\s*$")


def read_page(theme):
    """The title, summary and scenes of the theme, read from its page in headless Chromium."""
    with sync_playwright() as pw:
        browser, page = open_page(pw, theme)
        data = json.loads(page.evaluate(READ_PAGE))
        browser.close()
    if not data["title"]:
        sys.exit(f'ERROR: src/themes/{theme}/index.html has no <meta name="markdown-title" content="...">, the '
                 "title of its Markdown version")
    return data


def plain_text(text):
    """Collapse whitespace and escape the characters Markdown would read as inline markup."""
    return INLINE_MARKUP.sub(r"\\\1", " ".join(text.split()))


def subtitle_text(html):
    """The plain text of a subtitle: its HTML tags stripped, as in the SRT export, and its entities decoded."""
    return plain_text(unescape(HTML_TAG.sub("", html)))


def escape_line_start(line):
    """Escape the first character of a line that Markdown would read as the start of a block."""
    if HEADING_START.match(line) or MARKER_START.match(line) or SETEXT_UNDERLINE.match(line):
        return "\\" + line
    return ORDERED_LIST_START.sub(r"\1\\\2", line)


def paragraph(text):
    """Wrap a paragraph at LINE_WIDTH columns, never splitting a word."""
    lines = textwrap.wrap(text, width=LINE_WIDTH, break_long_words=False, break_on_hyphens=False)
    return "\n".join(escape_line_start(line) for line in lines)


def time_label(seconds):
    """m:ss, as in the player's time label."""
    return f"{seconds // 60}:{seconds % 60:02}"


def sections(scenes):
    """Group the subtitles into sections: the lead (scenes before the first chapter), one per chapter, then the outro.

    Each section is a dict with its heading (None for the lead), its start in seconds and its subtitles.
    """
    lead = {"heading": None, "start": 0, "subs": []}
    result = [lead]
    for scene in scenes:
        current = result[-1]
        if scene["chapter"]:
            heading = f"Chapter {scene['chapter']}: {plain_text(scene['title'])}"
            current = {"heading": heading, "start": scene["start"], "subs": []}
            result.append(current)
        elif current["heading"] not in (None, OUTRO_HEADING):
            current = {"heading": OUTRO_HEADING, "start": scene["start"], "subs": []}
            result.append(current)
        current["subs"] += [subtitle_text(sub) for sub in scene["subs"]]
    return result


def player_seconds(start):
    """The whole second to open the player at for a section start.

    Rounded up: one frame before its start, the player still shows the previous scene and its chapter header.
    """
    return math.ceil(start)


def markdown(theme, data):
    """The Markdown document of the theme."""
    player = f"/themes/{theme}/"
    blocks = [
        f"# {plain_text(data['title'])}",
        paragraph(plain_text(data["summary"])),
        f"[Watch the video]({player})",
    ]
    for section in sections(data["scenes"]):
        if section["heading"] is not None:
            seconds = player_seconds(section["start"])
            blocks.append(f"## {section['heading']}")
            blocks.append(f"[Watch from {time_label(seconds)}]({player}#t={seconds})")
        if section["subs"]:
            blocks.append(paragraph(" ".join(section["subs"])))
    return "\n\n".join(blocks) + "\n"


def main():
    parser = argparse.ArgumentParser(description="Write the Markdown version of a theme, for coding agents.")
    add_theme_argument(parser)
    args = parser.parse_args()
    data = read_page(args.theme)
    out = theme_markdown(args.theme)
    out.write_text(markdown(args.theme, data), encoding="utf-8")
    print(out.relative_to(ROOT))


if __name__ == "__main__":
    main()
