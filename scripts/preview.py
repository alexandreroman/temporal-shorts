"""Grab still frames to check the layout without rendering the video.

  python scripts/preview.py 12 40.5 133          # contact sheet -> output/preview.png
  python scripts/preview.py 133 --full           # one full-size PNG per timestamp
"""
import argparse, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import OUTPUT, open_page
from playwright.sync_api import sync_playwright
from PIL import Image

ap = argparse.ArgumentParser(); ap.add_argument("times", nargs="+", type=float); ap.add_argument("--full", action="store_true")
a = ap.parse_args()
OUTPUT.mkdir(exist_ok=True)
shots = []
with sync_playwright() as pw:
    browser, page, errors = open_page(pw)
    for t in a.times:
        page.evaluate(f"renderAt({t})")
        p = OUTPUT / f"frame_{t:07.2f}.png"
        page.screenshot(path=str(p)); shots.append(p)
    browser.close()
if errors: print("JS errors:", errors)
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
