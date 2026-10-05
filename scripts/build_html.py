"""Build a single self-contained HTML player: output/<name>.html.

Inlines the stylesheets, scripts, fonts and logo of src/index.html so the file plays offline, with no other file.
Standard library only.

  python scripts/build_html.py
"""
import base64
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import OUTPUT, ROOT, VIDEO_NAME

SRC = ROOT / "src"
MIME_TYPES = {
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
}

FONT_FACE_SRC = re.compile(r"(@font-face\s*\{[^}]*?src:)([^;}]+)")
FONT_URL = re.compile(r"url\(fonts/([^)]+)\)")
# Paths are relative to src/ and may contain a subdirectory, e.g. scenes/01-llm-call.js.
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


def inline_fonts(css):
    """Turn each @font-face src entry into a data URI; drop the entries whose file is absent."""
    def replace_src(match):
        prefix, src_list = match.groups()
        kept = []
        # Split before any data URI is inserted: their base64 payload contains commas.
        for entry in src_list.split(","):
            font = FONT_URL.search(entry)
            if font is None:
                kept.append(entry)
                continue
            path = SRC / "fonts" / font.group(1)
            if path.is_file():
                kept.append(FONT_URL.sub(f"url({data_uri(path)})", entry))
        if not kept:
            sys.exit(f"ERROR: no font file found for: {src_list.strip()}\nRun `make setup` to download the fonts.")
        return prefix + ",".join(kept)

    return FONT_FACE_SRC.sub(replace_src, css)


def read_source(relative_path):
    path = SRC / relative_path
    if not path.is_file():
        sys.exit(f"ERROR: missing source file {path}")
    return path.read_text(encoding="utf-8")


def inline_stylesheets(html):
    """Replace each <link rel="stylesheet"> with an inline <style> block, its fonts and assets inlined.

    Font URLs stay valid because every stylesheet lives in src/, like index.html.
    """
    def replace(match):
        css = inline_fonts(inline_assets(read_source(match.group(1))))
        return f"<style>\n{css}\n</style>"

    return STYLESHEET_TAG.sub(replace, html)


def inline_scripts(html):
    """Replace each <script src="..."> with an inline <script> block holding the file content."""
    def replace(match):
        js = inline_assets(read_source(match.group(1)))
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


def main():
    html = (SRC / "index.html").read_text(encoding="utf-8")
    html = inline_assets(html)
    html = inline_stylesheets(html)
    html = inline_scripts(html)
    check_self_contained(html)

    OUTPUT.mkdir(exist_ok=True)
    out = OUTPUT / f"{VIDEO_NAME}.html"
    out.write_text(html, encoding="utf-8")
    print(f"{out} ({out.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
