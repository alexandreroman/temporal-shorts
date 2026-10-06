"""Grab still frames to check the layout without rendering the video.

  python scripts/preview.py --theme durable-ai-agents 12 40.5 133   # contact sheet -> output/preview.png
  python scripts/preview.py --theme durable-ai-agents 133 --full    # one full-size PNG per timestamp
"""
import argparse, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import OUTPUT, add_theme_argument, open_page, warm_up
from playwright.sync_api import sync_playwright
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("times", nargs="+", type=float)
ap.add_argument("--full", action="store_true")
add_theme_argument(ap)
a = ap.parse_args()
OUTPUT.mkdir(exist_ok=True)
shots = []
with sync_playwright() as pw:
    browser, page = open_page(pw, a.theme)
    warm_up(page)
    for t in a.times:
        page.evaluate(f"renderAt({t})")
        p = OUTPUT / f"frame_{t:07.2f}.png"
        page.screenshot(path=str(p)); shots.append(p)
    browser.close()
if a.full:
    print("\n".join(map(str, shots)))
else:
    ims = [Image.open(p).convert("RGB").resize((960, 540)) for p in shots]
    rows = (len(ims) + 1) // 2
    sheet = Image.new("RGB", (1920, 540 * rows), "white")
    for i, im in enumerate(ims): sheet.paste(im, ((i % 2) * 960, (i // 2) * 540))
    sheet.save(OUTPUT / "preview.png")
    for p in shots: p.unlink()
    print(OUTPUT / "preview.png")
