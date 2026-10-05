"""Shared helpers: locate the project, open the animation page in headless Chromium."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX_URL = (ROOT / "src" / "index.html").as_uri()
OUTPUT = ROOT / "output"
WIDTH, HEIGHT = 1920, 1080
VIDEO_NAME = "ai-agents-temporal-en"

# Resolves to the number of loaded font faces. A missing font file rejects its load: catch it so that
# open_page() can report the count instead of a bare network error.
PRELOAD_FONTS = """Promise.all(
  ['400 40px Brand', '700 40px Brand', '400 20px Mono', '700 20px Mono']
    .map(f => document.fonts.load(f).catch(() => []))
).then(() => document.fonts.ready).then(() => [...document.fonts].filter(f => f.status === 'loaded').length)"""


def open_page(pw):
    """Return (browser, page), frozen at t=0; call renderAt(t) to move.

    Exit with an error if the page throws while loading or the brand fonts are missing. Errors thrown
    later by renderAt(t) surface as exceptions from page.evaluate().
    """
    browser = pw.chromium.launch(args=["--force-color-profile=srgb", "--disable-gpu"])
    page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(INDEX_URL + "?t=0")
    loaded = page.evaluate(PRELOAD_FONTS)
    if errors:
        sys.exit("ERROR: JavaScript errors while loading the page:\n" + "\n".join(errors))
    if loaded < 4:
        sys.exit(f"ERROR: only {loaded}/4 brand fonts loaded. Run `make setup` (fonts go in src/fonts/).")
    # warm up every scene once so images and fonts are decoded before capture
    total = page.evaluate("TOTAL")
    for t in range(0, int(total) + 1, 4):
        page.evaluate(f"renderAt({t})")
    return browser, page
