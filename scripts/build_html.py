"""Build every page of src/ into a self-contained file: output/themes/<theme>/index.html and output/index.html.

Each theme page becomes a standalone HTML player, and src/index.html the home page that links to them. The
stylesheets, scripts, fonts and logo of each page are inlined so it opens offline; a single player file plays
with no other file, while the home page links to the players below it: output/ mirrors src/, so the
relative links stay the same. Each page's social.png, written by `make social`, is copied next to it.

Link previews on social networks need absolute URLs: when the SITE_URL environment variable holds the root URL of
the deployed site, set by the Pages workflow, each page also gets a canonical link and the link preview tags of
social networks (Open Graph, X card). Without it, the pages are built with neither. Standard library only.

  python scripts/build_html.py
  SITE_URL=https://example.com python scripts/build_html.py
"""
import base64
import os
import re
import shutil
import sys
from html import escape, unescape
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import OUTPUT, SRC, built_page, page_sources

SITE_NAME = "Temporal Shorts"
# The preview image of a page lives next to it, in src/ and output/ alike, so its URL is the page URL + this name.
SOCIAL_IMAGE = "social.png"
SOCIAL_IMAGE_WIDTH, SOCIAL_IMAGE_HEIGHT = 1200, 630

MIME_TYPES = {
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
}

# Relative to the stylesheet, as the browser resolves them.
FONT_URL = re.compile(r"url\((fonts/[^)]+)\)")
# Paths are relative to the page, e.g. ../../engine.js or scenes/01-llm-call.js in a theme page.
SCRIPT_TAG = re.compile(r'<script src="([^"]+)"></script>')
STYLESHEET_TAG = re.compile(r'<link rel="stylesheet" href="([^"]+)">')
ASSET_REF = re.compile(r"assets/[\w.-]+")
DATA_URI = re.compile(r"data:[^\"')\s]+")
TITLE_TAG = re.compile(r"<title>(.*?)</title>", re.DOTALL)
DESCRIPTION_TAG = re.compile(r'<meta name="description" content="([^"]*)">')


def data_uri(path):
    mime = MIME_TYPES.get(path.suffix)
    if mime is None:
        sys.exit(f"ERROR: no MIME type known for {path.name}")
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def inline_assets(text):
    """Replace every assets/<file> reference with a data URI."""
    def replace(match):
        path = SRC / match.group(0)
        if not path.is_file():
            sys.exit(f"ERROR: missing asset {path}")
        return data_uri(path)

    return ASSET_REF.sub(replace, text)


def source_path(base_dir, relative_path):
    """Resolve a reference found in a file of base_dir; exit if it points outside src/."""
    path = (base_dir / relative_path).resolve()
    if not path.is_relative_to(SRC):
        sys.exit(f"ERROR: {relative_path} (from {base_dir}) points outside {SRC}")
    return path


def inline_fonts(css, css_dir):
    """Replace each fonts/<file> URL with a data URI."""
    def replace(match):
        path = source_path(css_dir, match.group(1))
        if not path.is_file():
            sys.exit(f"ERROR: missing font file {path}\nRun `bash scripts/fonts.sh` to download the fonts.")
        return f"url({data_uri(path)})"

    return FONT_URL.sub(replace, css)


def read_source(path):
    if not path.is_file():
        sys.exit(f"ERROR: missing source file {path}")
    return path.read_text(encoding="utf-8")


def inline_stylesheets(html, page_dir):
    """Replace each <link rel="stylesheet"> with an inline <style> block, its fonts and assets inlined."""
    def replace(match):
        stylesheet = source_path(page_dir, match.group(1))
        css = inline_fonts(inline_assets(read_source(stylesheet)), stylesheet.parent)
        return f"<style>\n{css}\n</style>"

    return STYLESHEET_TAG.sub(replace, html)


def inline_scripts(html, page_dir):
    """Replace each <script src="..."> with an inline <script> block holding the file content."""
    def replace(match):
        js = inline_assets(read_source(source_path(page_dir, match.group(1))))
        # A literal "</script" would close the inline block early; "<\/" means the same inside JS.
        js = js.replace("</script", "<\\/script")
        return f"<script>\n{js}\n</script>"

    return SCRIPT_TAG.sub(replace, html)


def site_url():
    """The root URL of the deployed site, from SITE_URL, without a trailing slash; empty when unset."""
    return os.environ.get("SITE_URL", "").strip().rstrip("/")


def public_url(source, site):
    """The URL of a page on the site: its folder, e.g. <site>/themes/<theme>/, never index.html."""
    folder = source.parent.relative_to(SRC)
    path = "".join(f"{part}/" for part in folder.parts)
    return f"{site}/{path}"


def attribute_value(html, source, pattern, what):
    """The text matched by pattern in the page, whitespace collapsed, escaped for a double-quoted attribute."""
    match = pattern.search(html)
    if match is None:
        sys.exit(f"ERROR: {source} has no {what}")
    # The page text is HTML already: unescape it first, so that an entity such as &amp; is not escaped twice.
    text = " ".join(unescape(match.group(1)).split())
    # Inside double quotes, only " needs escaping on top of &, < and >: an apostrophe stays readable.
    return escape(text, quote=False).replace('"', "&quot;")


def add_social_tags(html, source, site):
    """Add the canonical link and the link preview tags of social networks after the description; none without a site.

    The tags go at the top of <head>, ahead of the inlined fonts and scripts: link preview crawlers, such as Slack's,
    read only the start of a page. The page is checked either way, so that a page missing its title or description
    fails on pull requests too.
    """
    title = attribute_value(html, source, TITLE_TAG, "<title>")
    description = attribute_value(html, source, DESCRIPTION_TAG, '<meta name="description" content="...">')
    if not site:
        return html
    url = public_url(source, site)
    # Starts with a line break and ends without one, to sit on its own lines right after the description.
    tags = f"""
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{SITE_NAME}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{url}{SOCIAL_IMAGE}">
<meta property="og:image:width" content="{SOCIAL_IMAGE_WIDTH}">
<meta property="og:image:height" content="{SOCIAL_IMAGE_HEIGHT}">
<meta property="og:image:alt" content="{title}">
<meta name="twitter:card" content="summary_large_image">"""
    description_end = DESCRIPTION_TAG.search(html).end()
    return html[:description_end] + tags + html[description_end:]


def copy_social_image(source, out):
    """Copy the preview image of a page next to its build: it is linked by URL, never inlined."""
    image = source.parent / SOCIAL_IMAGE
    if not image.is_file():
        sys.exit(f"ERROR: missing social preview image {image}\nRun `make social` to write it, then commit it.")
    shutil.copyfile(image, out.parent / SOCIAL_IMAGE)


def check_self_contained(html):
    # Strip the data URIs first: a base64 payload could contain "fonts/" by pure chance.
    leftover = DATA_URI.sub("", html)
    for marker in ("fonts/", "assets/", "<script src=", 'rel="stylesheet"'):
        if marker in leftover:
            sys.exit(f"ERROR: the output still references {marker!r}")


def check_social_tags_first(html):
    """Exit unless og:image comes before the first inline style or script, within reach of link preview crawlers."""
    image_tag = html.find('<meta property="og:image"')
    if image_tag == -1:
        sys.exit("ERROR: the output has no og:image tag")
    for block in ("<style", "<script"):
        block_start = html.find(block)
        if block_start != -1 and block_start < image_tag:
            sys.exit(f"ERROR: the og:image tag comes after the first {block}: link preview crawlers would miss it")


def build_page(source, site):
    """Write the self-contained build of a page of src/ to the same relative path under output/."""
    html = read_source(source)
    html = add_social_tags(html, source, site)
    html = inline_assets(html)
    html = inline_stylesheets(html, source.parent)
    html = inline_scripts(html, source.parent)
    check_self_contained(html)
    if site:
        check_social_tags_first(html)

    out = built_page(source)
    out.parent.mkdir(parents=True, exist_ok=True)
    copy_social_image(source, out)
    out.write_text(html, encoding="utf-8")
    print(f"{out} ({out.stat().st_size / 1024:.0f} KB)")


def main():
    site = site_url()
    if not site:
        print("Skipped the social tags and canonical links: SITE_URL is unset")
    # page_sources() lists the home page last, on purpose: the Makefile uses output/index.html as the target of
    # the whole build, so it must be written only once every theme page is, and never be older than any of them.
    for source in page_sources():
        build_page(source, site)


if __name__ == "__main__":
    main()
