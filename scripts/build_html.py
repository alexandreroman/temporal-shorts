"""Build every page of src/ into a self-contained file: output/themes/<theme>/index.html and output/index.html.

Each theme page becomes a standalone HTML player, and src/index.html the home page that links to them. The
stylesheets, scripts, fonts and logo of each page are inlined so it opens offline; a single player file plays
with no other file, while the home page links to the players below it: output/ mirrors src/, so the
relative links stay the same. Standard library only.

  python scripts/build_html.py
"""
import base64
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import OUTPUT, SRC, built_page, page_sources

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


def check_self_contained(html):
    # Strip the data URIs first: a base64 payload could contain "fonts/" by pure chance.
    leftover = DATA_URI.sub("", html)
    for marker in ("fonts/", "assets/", "<script src=", 'rel="stylesheet"'):
        if marker in leftover:
            sys.exit(f"ERROR: the output still references {marker!r}")


def build_page(source):
    """Write the self-contained build of a page of src/ to the same relative path under output/."""
    html = read_source(source)
    html = inline_assets(html)
    html = inline_stylesheets(html, source.parent)
    html = inline_scripts(html, source.parent)
    check_self_contained(html)

    out = built_page(source)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"{out} ({out.stat().st_size / 1024:.0f} KB)")


def main():
    # page_sources() lists the home page last, on purpose: the Makefile uses output/index.html as the target of
    # the whole build, so it must be written only once every theme page is, and never be older than any of them.
    for source in page_sources():
        build_page(source)


if __name__ == "__main__":
    main()
