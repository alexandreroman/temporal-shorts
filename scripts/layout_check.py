"""Check that every scene of a theme keeps its content inside the common content frame (y 150 to 880).

For each scene, renders a few resting moments (inside each subtitle and just before the scene ends), measures the
bounding box of the visible content, scene `shift` included, and prints one line per scene with a verdict:

  ok          inside the frame, centered, tall enough
  OUT         above y 150 or below y 880, by more than 2 px: also prints the element that leaves the frame and when
  THIN        spans less than 440 px, 60 % of the frame height (warning)
  OFF-CENTER  shorter than the frame and its middle more than 25 px from y 515 (warning)

Exits with status 1 when a scene is OUT: THIN and OFF-CENTER are warnings, as some scenes have legitimate exceptions.

The measure counts elements at least half opaque, at their resting size: an HTML element whose own transform scales it
(a pop while it overshoots or grows) counts with its untransformed size around its rendered center, and its
descendants count through it. Its limits:
  - an SVG path counts with its full geometry, whatever its draw progress (a line still drawing, a dashed arc);
  - overflow:hidden is ignored: a clipped element counts with its whole box;
  - content that shows only between the sample times is not seen;
  - an element resting at a scale other than 1 counts at scale 1, a scaled SVG element with its rendered box, and
    the descendants of a scaled element that overflow it are not seen.

  python scripts/layout_check.py --theme <theme>
"""
import argparse, math, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import add_theme_argument, open_page
from playwright.sync_api import sync_playwright

# The layout rule shared by every theme: each scene (intro, chapters, outro) keeps its resting content inside the
# content frame, y 150 to 880, which leaves 66 px under the header (bottom at y 84) and 80 px above the subtitle box
# (top at y 960). Only brief one-off effects (flashes, glitches, flying coins) may leave it. A scene shorter than the
# frame is centered on its middle, y 515, within 25 px, and no scene spans less than 60 % of the frame height.
FRAME_TOP = 150
FRAME_BOTTOM = 880
FRAME_MIDDLE = (FRAME_TOP + FRAME_BOTTOM) / 2
# Bounding boxes include sub-pixel borders and strokes (a 1.5 px border, a 2.5 px stroke centered on its path), which
# round past a whole-pixel edge: an element resting exactly on the frame edge may measure up to 2 px beyond it.
OUT_TOLERANCE = 2
CENTER_TOLERANCE = 25
MIN_HEIGHT = 440

# Sample times inside each subtitle window, as a fraction of it and as seconds before its end, and before the scene
# end (its fade-out takes the last 0.5 s).
SUBTITLE_FRACTION = 0.3
BEFORE_SUBTITLE_END = 0.1
BEFORE_SCENE_END = 0.6

# Renders the frame at `t`, then measures the visible content of scene `index`: returns its top and bottom (stage
# pixels, after the scene `shift`) and a description of the elements that reach them, or null when nothing shows.
MEASURE = r"""({index, t}) => {
  renderAt(t);
  const root = scenes[index].root;

  // Product of the computed opacities from the element up to the scene root, 0 when hidden on the way.
  const effectiveOpacity = (element) => {
    let opacity = 1;
    for (let node = element; node !== root.parentElement; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') return 0;
      opacity *= parseFloat(style.opacity);
    }
    return opacity;
  };

  // True when the element's own transform scales it: a pop that overshoots or grows.
  const isScaled = (element) => {
    const transform = getComputedStyle(element).transform;
    if (transform === 'none') return false;
    const matrix = new DOMMatrixReadOnly(transform);
    const scaleX = Math.hypot(matrix.a, matrix.b), scaleY = Math.hypot(matrix.c, matrix.d);
    return Math.abs(scaleX - 1) > 1e-3 || Math.abs(scaleY - 1) > 1e-3;
  };

  // True when an ancestor below the scene root is scaled: the element is counted through that ancestor's resting box.
  const hasScaledAncestor = (element) => {
    for (let node = element.parentElement; node !== root; node = node.parentElement) {
      if (isScaled(node)) return true;
    }
    return false;
  };

  // The element's box at rest. place() scales about the element's center, so a scaled HTML element is measured at its
  // untransformed size around its rendered center, which gives its resting box whatever the pop's overshoot or
  // growth. SVG elements have no untransformed size: they keep their rendered box.
  const restingBox = (element) => {
    const box = element.getBoundingClientRect();
    if (!isScaled(element) || !(element instanceof HTMLElement)) return box;
    const centerY = (box.top + box.bottom) / 2;
    const width = element.offsetWidth, height = element.offsetHeight;
    return {top: centerY - height / 2, bottom: centerY + height / 2, width, height};
  };

  const isContent = (element, box) => {
    // Full-stage SVG overlays: their shapes are measured one by one.
    if (element.matches('svg.layer')) return false;
    if (element.classList.contains('llm-glow')) return false;
    if (element.closest('defs, marker')) return false;
    if (box.width < 1 || box.height < 1) return false;
    // Full-screen flashes.
    if (box.width > 1800 && box.height > 900) return false;
    return effectiveOpacity(element) >= 0.5;
  };

  const describe = (element) => {
    const classes = (element.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean);
    const text = element.textContent.replace(/\s+/g, ' ').trim().slice(0, 30);
    let description = element.tagName.toLowerCase();
    if (classes.length) description += '.' + classes.join('.');
    if (text) description += ` "${text}"`;
    return description;
  };

  let top = Infinity, bottom = -Infinity, highest = null, lowest = null;
  for (const element of root.querySelectorAll('*')) {
    if (hasScaledAncestor(element)) continue;
    const box = restingBox(element);
    if (!isContent(element, box)) continue;
    if (box.top < top) { top = box.top; highest = element; }
    if (box.bottom > bottom) { bottom = box.bottom; lowest = element; }
  }
  if (!highest) return null;
  return {top, bottom, highest: describe(highest), lowest: describe(lowest)};
}"""

SCENES = """scenes.map(s => ({
  chapter: s.chapter || 0, title: s.title || '',
  end: s.end, subs: s.subs.map(x => [x.start, x.end])}))"""


def sample_times(scene):
    """The resting moments to measure in a scene: inside each subtitle window, then just before the scene ends."""
    times = []
    for start, end in scene["subs"]:
        times.append(start + SUBTITLE_FRACTION * (end - start))
        times.append(end - BEFORE_SUBTITLE_END)
    times.append(scene["end"] - BEFORE_SCENE_END)
    return times


def measure_scene(page, index, scene):
    """The union of the content boxes of a scene over its sample times, with the element and time that reach its
    top and its bottom; None when nothing is visible at any of them."""
    result = {"top": math.inf, "top_at": None, "bottom": -math.inf, "bottom_at": None}
    for t in sample_times(scene):
        box = page.evaluate(MEASURE, {"index": index, "t": t})
        if box is None:
            continue
        if box["top"] < result["top"]:
            result["top"] = box["top"]
            result["top_at"] = (t, box["highest"])
        if box["bottom"] > result["bottom"]:
            result["bottom"] = box["bottom"]
            result["bottom_at"] = (t, box["lowest"])
    if result["top_at"] is None:
        return None
    return result


def chapter_label(index, scene, scene_count):
    """The chapter number, or INTRO / OUTRO for the first and last scenes without a chapter."""
    if scene["chapter"]:
        return f"{scene['chapter']:02d}"
    if index == 0:
        return "INTRO"
    if index == scene_count - 1:
        return "OUTRO"
    return "-"


def verdicts(top, bottom):
    """Check a content box against the rule: returns (found, top_out, bottom_out), the rules it breaks (an empty list
    when it follows them all) and whether its top and its bottom leave the frame."""
    height = bottom - top
    middle = (top + bottom) / 2
    top_out = top < FRAME_TOP - OUT_TOLERANCE
    bottom_out = bottom > FRAME_BOTTOM + OUT_TOLERANCE
    is_out = top_out or bottom_out
    found = []
    if is_out:
        found.append("OUT")
    if height < MIN_HEIGHT:
        found.append("THIN")
    if not is_out and abs(middle - FRAME_MIDDLE) > CENTER_TOLERANCE:
        found.append("OFF-CENTER")
    return found, top_out, bottom_out


def main():
    ap = argparse.ArgumentParser()
    add_theme_argument(ap)
    a = ap.parse_args()
    with sync_playwright() as pw:
        browser, page = open_page(pw, a.theme)
        scenes = page.evaluate(SCENES)
        boxes = [measure_scene(page, index, scene) for index, scene in enumerate(scenes)]
        browser.close()

    print(f"Content frame: y {FRAME_TOP}-{FRAME_BOTTOM}, middle {FRAME_MIDDLE:g}, min height {MIN_HEIGHT}")
    print(f"{'#':>2}  {'chapter':7}  {'title':34}  {'top':>4}  {'bottom':>6}  {'height':>6}  {'middle':>6}  verdict")
    any_out = False
    for index, (scene, box) in enumerate(zip(scenes, boxes)):
        label = chapter_label(index, scene, len(scenes))
        title = scene["title"][:34]
        if box is None:
            print(f"{index:2d}  {label:7}  {title:34}  no visible content")
            continue
        top, bottom = box["top"], box["bottom"]
        found, top_out, bottom_out = verdicts(top, bottom)
        verdict = " ".join(found) if found else "ok"
        print(f"{index:2d}  {label:7}  {title:34}  {top:4.0f}  {bottom:6.0f}  {bottom - top:6.0f}  "
              f"{(top + bottom) / 2:6.0f}  {verdict}")
        if top_out:
            t, element = box["top_at"]
            print(f"      top {top:.0f} above {FRAME_TOP} at {t:.1f}s: {element}")
        if bottom_out:
            t, element = box["bottom_at"]
            print(f"      bottom {bottom:.0f} below {FRAME_BOTTOM} at {t:.1f}s: {element}")
        any_out = any_out or top_out or bottom_out
    sys.exit(1 if any_out else 0)


if __name__ == "__main__":
    main()
