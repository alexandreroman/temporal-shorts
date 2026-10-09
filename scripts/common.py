"""Shared helpers: locate the project and its themes, open a theme page in headless Chromium."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
OUTPUT = ROOT / "output"
WIDTH, HEIGHT = 1920, 1080

# Each theme is one video: its page is src/themes/<theme>/index.html, next to its scripts; src/index.html is the
# home page that links to them. output/ mirrors this layout, so the relative links work in both trees.
HOME_PAGE = SRC / "index.html"
THEMES_DIR = SRC / "themes"


def theme_names():
    """The themes, sorted: the folders of src/themes/ that hold an index.html page."""
    return sorted(path.parent.name for path in THEMES_DIR.glob("*/index.html"))


def theme_page(theme):
    """The source page of a theme."""
    return THEMES_DIR / theme / "index.html"


def page_sources():
    """The source path of every page: the theme pages, then the home page last."""
    return [*(theme_page(theme) for theme in theme_names()), HOME_PAGE]


def built_page(source):
    """The output path of a page: output/ mirrors src/, e.g. output/themes/<theme>/index.html."""
    return OUTPUT / source.relative_to(SRC)


THEMES = theme_names()

# Resolves to the number of loaded font faces. A missing font file rejects its load: catch it so that
# check_fonts() can report the count instead of a bare network error.
PRELOAD_FONTS = """Promise.all(
  ['400 40px Brand', '700 40px Brand', '400 20px Mono', '700 20px Mono']
    .map(f => document.fonts.load(f).catch(() => []))
).then(() => document.fonts.ready).then(() => [...document.fonts].filter(f => f.status === 'loaded').length)"""

# Resolves to true once the Temporal symbol (#mark, a CSS background) is loaded and decoded, false if it fails.
# It stays hidden until the first chapter, so nothing else guarantees it is ready for the first capture.
PRELOAD_MARK = """(() => {
  const image = new Image();
  image.src = getComputedStyle(document.getElementById('mark')).backgroundImage.slice(5, -2);
  return image.decode().then(() => true, () => false);
})()"""


def add_theme_argument(parser):
    """Add the required --theme option to an argparse parser: no theme is the default."""
    parser.add_argument("--theme", choices=THEMES, required=True, help="video to work on")


def page_url(theme):
    """The file:// URL of the theme page."""
    return theme_page(theme).as_uri()


def launch_browser(pw):
    """Headless Chromium with the settings of every capture: sRGB colors and no GPU, for identical pixels."""
    return pw.chromium.launch(args=["--force-color-profile=srgb", "--disable-gpu"])


def check_fonts(page):
    """Wait for the four brand fonts of the page; exit with an error if any of them is missing."""
    loaded = page.evaluate(PRELOAD_FONTS)
    if loaded < 4:
        sys.exit(f"ERROR: only {loaded}/4 brand fonts loaded. Run `make setup` (fonts go in src/fonts/).")


def open_page(pw, theme):
    """Return (browser, page) for the theme, frozen at t=0; call renderAt(t) to move.

    Exit with an error if the page throws while loading, or the brand fonts or the Temporal symbol are
    missing. Errors thrown later by renderAt(t) surface as exceptions from page.evaluate().
    """
    browser = launch_browser(pw)
    page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(page_url(theme) + "?t=0")
    # goto() returns once the page has loaded, so every error thrown by its scripts is already reported.
    if errors:
        sys.exit("ERROR: JavaScript errors while loading the page:\n" + "\n".join(errors))
    check_fonts(page)
    if not page.evaluate(PRELOAD_MARK):
        sys.exit("ERROR: the Temporal symbol (#mark in src/styles.css) did not load.")
    return browser, page


def warm_up(page):
    """Render every scene once so that images and fonts are decoded before the first capture."""
    total = page.evaluate("TOTAL")
    for t in range(0, int(total) + 1, 4):
        page.evaluate(f"renderAt({t})")
