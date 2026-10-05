"""Shared helpers: locate the project, open the animation page in headless Chromium."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX_URL = (ROOT / "src" / "index.html").as_uri()
OUTPUT = ROOT / "output"
WIDTH, HEIGHT = 1920, 1080
VIDEO_NAME = "ai-agents-temporal-en"

PRELOAD_FONTS = """Promise.all([
  document.fonts.load('400 40px Brand'), document.fonts.load('700 40px Brand'),
  document.fonts.load('400 20px Mono'), document.fonts.load('700 20px Mono')
]).then(() => document.fonts.ready).then(() => [...document.fonts].filter(f => f.status === 'loaded').length)"""


def open_page(pw):
    """Return (browser, page, errors). The page is frozen at t=0; call renderAt(t) to move."""
    browser = pw.chromium.launch(args=["--force-color-profile=srgb", "--disable-gpu"])
    page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(INDEX_URL + "?t=0")
    loaded = page.evaluate(PRELOAD_FONTS)
    if loaded < 4:
        print(f"WARNING: only {loaded}/4 brand fonts loaded. Run scripts/setup.sh (fonts go in src/fonts/).")
    # warm up every scene once so images and fonts are decoded before capture
    total = page.evaluate("TOTAL")
    for t in range(0, int(total) + 1, 4):
        page.evaluate(f"renderAt({t})")
    return browser, page, errors
