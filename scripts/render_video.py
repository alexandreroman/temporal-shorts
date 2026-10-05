"""Render a theme page (src/themes/<theme>/index.html) frame by frame into an MP4 (no audio, subtitles burned in).

Usage:
  python scripts/render_video.py                  # default theme, full video, 30 fps, parallel workers
  python scripts/render_video.py --theme durable-execution    # -> output/durable-execution.mp4
  python scripts/render_video.py --start 130 --end 140 --out output/test.mp4
"""
import argparse, os, shutil, subprocess, sys, time
from multiprocessing import Pool
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import OUTPUT, add_theme_argument, open_page
from playwright.sync_api import sync_playwright


def render_chunk(job):
    idx, theme, n0, n1, fps, crf, seg_path = job
    with sync_playwright() as pw:
        browser, page = open_page(pw, theme)
        ff = subprocess.Popen(
            ["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(fps), "-c:v", "mjpeg",
             "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", str(crf), "-pix_fmt", "yuv420p",
             "-r", str(fps), str(seg_path)],
            stdin=subprocess.PIPE)
        t0 = time.time()
        for n in range(n0, n1):
            page.evaluate(f"renderAt({n / fps})")
            ff.stdin.write(page.screenshot(type="jpeg", quality=93))
            if (n - n0) % 300 == 0:
                print(f"  worker {idx}: frame {n - n0}/{n1 - n0} ({time.time() - t0:.0f}s)", flush=True)
        ff.stdin.close()
        if ff.wait() != 0:
            raise RuntimeError(f"ffmpeg failed to encode {seg_path.name}")
        browser.close()
    return seg_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--start", type=float, default=0.0)
    ap.add_argument("--end", type=float, default=None, help="seconds; default = full length")
    ap.add_argument("--workers", type=int, default=max(1, min(6, (os.cpu_count() or 2) // 2)))
    ap.add_argument("--crf", type=int, default=20)
    ap.add_argument("--out", default=None, help="default: output/<theme>.mp4")
    add_theme_argument(ap)
    a = ap.parse_args()
    out = a.out or str(OUTPUT / f"{a.theme}.mp4")

    with sync_playwright() as pw:
        browser, page = open_page(pw, a.theme)
        total = page.evaluate("TOTAL"); browser.close()
    end = total if a.end is None else min(a.end, total)
    n0, n1 = round(a.start * a.fps), round(end * a.fps)
    segdir = OUTPUT / ".segments"; segdir.mkdir(parents=True, exist_ok=True)
    for f in segdir.glob("*"): f.unlink()
    k = max(1, min(a.workers, (n1 - n0) // 60))
    bounds = [n0 + (n1 - n0) * i // k for i in range(k + 1)]
    jobs = [(i, a.theme, bounds[i], bounds[i + 1], a.fps, a.crf, segdir / f"seg_{i:02d}.mp4") for i in range(k)]
    print(f"Rendering {n1 - n0} frames ({(n1 - n0) / a.fps:.1f}s of {total:.1f}s) with {k} worker(s)…")
    t0 = time.time()
    with Pool(k) as pool:
        segs = pool.map(render_chunk, jobs)
    lst = segdir / "list.txt"
    lst.write_text("".join(f"file '{s.name}'\n" for s in segs))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst),
                    "-c", "copy", out], check=True)
    shutil.rmtree(segdir)
    print(f"Done in {time.time() - t0:.0f}s -> {out}")


if __name__ == "__main__":
    main()
