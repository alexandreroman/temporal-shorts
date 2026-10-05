"""Print the computed timeline: scenes, chapters, subtitle start/end (absolute seconds) and cue indexes.
Use it to pick timestamps for preview.py and to see how a text edit shifted the timing.

  python scripts/timeline.py --theme <theme>
"""
import argparse, json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import add_theme_argument, open_page
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
add_theme_argument(ap)
a = ap.parse_args()
with sync_playwright() as pw:
    browser, page = open_page(pw, a.theme)
    data = json.loads(page.evaluate("""JSON.stringify({total: TOTAL, scenes: scenes.map(s => ({
        chapter: s.chapter || null, start: s.start, end: s.end,
        subs: s.subs.map(x => [x.start, x.end, x.text.replace(/<[^>]+>/g, '')])}))})"""))
    browser.close()
for i, s in enumerate(data["scenes"]):
    print(f"\nScene {i}  chapter={s['chapter']}  {s['start']:.1f}s -> {s['end']:.1f}s")
    for k, (a, b, txt) in enumerate(s["subs"]):
        print(f"  c[{k}] {a:6.1f}-{b:6.1f}  (local {a - s['start']:.1f})  {txt}")
print(f"\nTOTAL {data['total']:.1f}s ({int(data['total'] // 60)}:{int(data['total'] % 60):02d})")
