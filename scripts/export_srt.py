"""Write output/<name>.srt from the subtitle timings computed in src/scenes.js."""
import json, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import OUTPUT, VIDEO_NAME, open_page
from playwright.sync_api import sync_playwright

def ts(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"

with sync_playwright() as pw:
    browser, page, _ = open_page(pw)
    subs = json.loads(page.evaluate("JSON.stringify(scenes.flatMap(s => s.subs.map(x => [x.start, x.end, x.text])))"))
    browser.close()
OUTPUT.mkdir(exist_ok=True)
out = OUTPUT / f"{VIDEO_NAME}.srt"
out.write_text("".join(f"{i}\n{ts(a)} --> {ts(b)}\n{re.sub('<[^>]+>', '', t)}\n\n" for i, (a, b, t) in enumerate(subs, 1)), encoding="utf-8")
print(out)
