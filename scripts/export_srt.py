"""Write output/<theme>.srt from the subtitle timings of the theme's scenes (src/themes/<theme>/scenes/).

  python scripts/export_srt.py [--theme durable-execution]
"""
import argparse, json, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import OUTPUT, add_theme_argument, open_page
from playwright.sync_api import sync_playwright

def ts(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"

ap = argparse.ArgumentParser()
add_theme_argument(ap)
args = ap.parse_args()
with sync_playwright() as pw:
    browser, page = open_page(pw, args.theme)
    subs = json.loads(page.evaluate("JSON.stringify(scenes.flatMap(s => s.subs.map(x => [x.start, x.end, x.text])))"))
    browser.close()
OUTPUT.mkdir(exist_ok=True)
out = OUTPUT / f"{args.theme}.srt"
cues = [f"{i}\n{ts(a)} --> {ts(b)}\n{re.sub('<[^>]+>', '', t)}\n\n" for i, (a, b, t) in enumerate(subs, 1)]
out.write_text("".join(cues), encoding="utf-8")
print(out)
