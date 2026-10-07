"""Render a theme page (src/themes/<theme>/index.html) frame by frame into an MP4 (no audio, subtitles burned in
unless --no-subtitles is set).

Usage:
  python scripts/render_video.py --theme durable-ai-agents   # full video, 30 fps -> output/durable-ai-agents.mp4
  python scripts/render_video.py --theme durable-ai-agents --no-subtitles   # -> output/durable-ai-agents-nosubs.mp4
  python scripts/render_video.py --theme durable-ai-agents --start 130 --end 140 --out output/test.mp4
"""
import argparse, os, shutil, subprocess, sys, tempfile, time
from multiprocessing import Pool
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import OUTPUT, add_theme_argument, open_page, warm_up
from playwright.sync_api import sync_playwright


def render_chunk(job):
    idx, theme, n0, n1, fps, crf, subtitles, seg_path = job
    with sync_playwright() as pw:
        browser, page = open_page(pw, theme)
        if not subtitles:
            # Hides the subtitle box without touching the page sources: renderAt() still drives its opacity,
            # every other pixel stays identical to the subtitled video.
            page.add_style_tag(content="#subw{visibility:hidden}")
        warm_up(page)
        # Web streaming: a keyframe every 2 s for fast seeking, High@4.1 for broad player support,
        # CRF capped at 8 Mbit/s (YouTube's 1080p30 rate) so bitrate peaks stay streamable.
        gop = str(2 * fps)
        ff = subprocess.Popen(
            ["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(fps), "-c:v", "mjpeg",
             "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", str(crf), "-pix_fmt", "yuv420p",
             "-profile:v", "high", "-level:v", "4.1", "-maxrate", "8M", "-bufsize", "16M",
             "-g", gop, "-keyint_min", gop, "-sc_threshold", "0",
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
    ap.add_argument("--no-subtitles", dest="subtitles", action="store_false",
                    help="hide the burned-in subtitles, e.g. to ship the SRT of `make srt` alongside")
    ap.add_argument("--out", default=None,
                    help="default: output/<theme>.mp4, or output/<theme>-nosubs.mp4 with --no-subtitles")
    add_theme_argument(ap)
    a = ap.parse_args()
    suffix = "" if a.subtitles else "-nosubs"
    out = a.out or str(OUTPUT / f"{a.theme}{suffix}.mp4")

    with sync_playwright() as pw:
        browser, page = open_page(pw, a.theme)
        total = page.evaluate("TOTAL"); browser.close()
    end = total if a.end is None else min(a.end, total)
    n0, n1 = round(a.start * a.fps), round(end * a.fps)
    OUTPUT.mkdir(exist_ok=True)
    # One folder per run: `make -j render` runs one render per theme at the same time.
    segdir = Path(tempfile.mkdtemp(prefix=".segments-", dir=OUTPUT))
    k = max(1, min(a.workers, (n1 - n0) // 60))
    bounds = [n0 + (n1 - n0) * i // k for i in range(k + 1)]
    jobs = [(i, a.theme, bounds[i], bounds[i + 1], a.fps, a.crf, a.subtitles, segdir / f"seg_{i:02d}.mp4")
            for i in range(k)]
    print(f"Rendering {n1 - n0} frames ({(n1 - n0) / a.fps:.1f}s of {total:.1f}s) with {k} worker(s)…")
    t0 = time.time()
    with Pool(k) as pool:
        segs = pool.map(render_chunk, jobs)
    lst = segdir / "list.txt"
    lst.write_text("".join(f"file '{s.name}'\n" for s in segs))
    # faststart moves the index (moov atom) to the front, so playback starts before the download ends.
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst),
                    "-c", "copy", "-movflags", "+faststart", out], check=True)
    shutil.rmtree(segdir)
    print(f"Done in {time.time() - t0:.0f}s -> {out}")


if __name__ == "__main__":
    main()
