"""Write the social preview images (Open Graph, X card) of every page, at 1200x630, and the touch icon of the site.

  python scripts/social_images.py   # -> src/social.png, src/themes/<theme>/social.png, src/apple-touch-icon.png

A theme image is the title card of its intro, without the subtitle; the home image is the card of src/social.html,
a page made for it alone. The touch icon, the image a phone shows for a page saved to its home screen, is the site
icon, src/favicon.svg, at 180x180. The images are committed: the HTML build (build_html.py) copies them and needs no
Playwright.
"""
import io
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import HEIGHT, SRC, WIDTH, check_fonts, launch_browser, open_page, theme_names, theme_page, warm_up
from playwright.sync_api import sync_playwright
from PIL import Image

# 1.91:1, the size Open Graph and X cards display without cropping.
SOCIAL_SIZE = (1200, 630)
# The card of the home image, laid out at SOCIAL_SIZE: captured as is, with no resize.
HOME_CARD = SRC / "social.html"
# The same ratio in stage pixels: the centered 1920x1008 band of the 1920x1080 stage.
BAND_HEIGHT = 1008
BAND_TOP = (HEIGHT - BAND_HEIGHT) // 2
# Hides the subtitle for the capture only: styles.css stays untouched, so video frames do not change.
HIDE_SUBTITLES = "#subw{visibility:hidden !important}"
# The site icon and its PNG version for the home screens of phones, at the size of current iPhones.
SITE_ICON = SRC / "favicon.svg"
TOUCH_ICON = SRC / "apple-touch-icon.png"
TOUCH_ICON_SIZE = (180, 180)
# The background square of the site icon, Space Black (C.bg in shared.js).
TOUCH_ICON_BACKGROUND = "#141414"


def save_social_image(png, path):
    """Resize a screenshot with the 1.91:1 ratio to SOCIAL_SIZE (a copy if already that size), write it as a PNG."""
    image = Image.open(io.BytesIO(png)).convert("RGB")
    image.resize(SOCIAL_SIZE, Image.Resampling.LANCZOS).save(path, optimize=True)
    print(path)


def write_theme_image(pw, theme):
    """Capture the intro title card of a theme, once the first subtitle ends and the title is in place."""
    browser, page = open_page(pw, theme)
    warm_up(page)
    page.add_style_tag(content=HIDE_SUBTITLES)
    page.evaluate("renderAt(scenes[0].subs[0].end)")
    png = page.screenshot(clip={"x": 0, "y": BAND_TOP, "width": WIDTH, "height": BAND_HEIGHT})
    browser.close()
    save_social_image(png, theme_page(theme).parent / "social.png")


def write_home_image(pw):
    """Capture the home card in a window of its own size: its star field is deterministic."""
    width, height = SOCIAL_SIZE
    browser = launch_browser(pw)
    page = browser.new_page(viewport={"width": width, "height": height})
    page.goto(HOME_CARD.as_uri())
    check_fonts(page)
    png = page.screenshot()
    browser.close()
    save_social_image(png, SRC / "social.png")


def write_touch_icon(pw):
    """Capture the site icon at TOUCH_ICON_SIZE, its transparent rounded corners filled with its background color.

    Touch icons must be opaque: phones round the corners themselves, and fill transparent pixels with black.
    """
    width, height = TOUCH_ICON_SIZE
    browser = launch_browser(pw)
    page = browser.new_page(viewport={"width": width, "height": height})
    page.goto(SITE_ICON.as_uri())
    png = page.screenshot(omit_background=True)
    browser.close()
    icon = Image.open(io.BytesIO(png)).convert("RGBA")
    opaque = Image.new("RGBA", icon.size, TOUCH_ICON_BACKGROUND)
    opaque.alpha_composite(icon)
    opaque.convert("RGB").save(TOUCH_ICON, optimize=True)
    print(TOUCH_ICON)


def main():
    with sync_playwright() as pw:
        for theme in theme_names():
            write_theme_image(pw, theme)
        write_home_image(pw)
        write_touch_icon(pw)


if __name__ == "__main__":
    main()
