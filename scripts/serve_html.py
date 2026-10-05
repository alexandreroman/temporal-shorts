"""Serve the standalone HTML player (output/<name>.html) on http://localhost:PORT, with hot reload.

  python scripts/serve_html.py --port 8000

A watcher thread rebuilds the page (scripts/build_html.py) when a file under src/ or a build script
changes. Every open tab follows the page version over Server-Sent Events (/events) and reloads when
the page is rebuilt, by the watcher or by `make html`; the player then resumes at the same position.
The reload script is added to the served bytes only: the built file stays a clean standalone page.
In a Casper workspace, the player URL is published to the workspace info panel while the server runs.
Standard library only.
"""
import argparse
import errno
import os
import shutil
import signal
import subprocess
import sys
import tempfile
import threading
import time
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import OUTPUT, ROOT, VIDEO_NAME

PAGE = OUTPUT / f"{VIDEO_NAME}.html"
PAGE_PATHS = {"/", "/index.html"}
BUILD_SCRIPT = ROOT / "scripts" / "build_html.py"
# Mirror the Makefile inputs of the HTML player: everything under src/ plus the build scripts.
SOURCE_DIR = ROOT / "src"
SOURCE_SCRIPTS = (BUILD_SCRIPT, ROOT / "scripts" / "common.py")
POLL_SECONDS = 0.5
HEARTBEAT_SECONDS = 15

# Added before </body> of the served page. It only listens: no DOM change, so ?t= frames stay identical.
# EventSource reconnects by itself after a server restart; any version other than the one this page was
# served with (including a rebuild that lands before the connection opens) means a newer page.
RELOAD_SCRIPT = """<script>
new EventSource('/events').onmessage = event => {{
  if (event.data !== '{version}') location.reload();
}};
</script>
"""


def read_page_version():
    """The page's modification time in nanoseconds, as a string; None while the page does not exist."""
    try:
        return str(PAGE.stat().st_mtime_ns)
    except FileNotFoundError:
        return None


class PageVersion:
    """The current page version, shared by the watcher thread and the /events streams."""

    def __init__(self):
        self._condition = threading.Condition()
        self._value = read_page_version()

    def set(self, value):
        with self._condition:
            if value != self._value:
                self._value = value
                self._condition.notify_all()

    def wait_for_change(self, seen, timeout):
        """Return the version as soon as it differs from `seen`, or after `timeout` seconds at most."""
        with self._condition:
            self._condition.wait_for(lambda: self._value != seen, timeout)
            return self._value


def inject_reload_script(body, version):
    snippet = RELOAD_SCRIPT.format(version=version).encode("utf-8")
    head, closing_tag, tail = body.rpartition(b"</body>")
    if not closing_tag:
        return body + snippet
    return head + snippet + closing_tag + tail


class PlayerHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if urlsplit(self.path).path == "/events":
            self.send_events()
        else:
            self.send_page(include_body=True)

    def do_HEAD(self):
        self.send_page(include_body=False)

    def send_page(self, include_body):
        # Ignore the query string so that /?t=40 (frozen frame) works too.
        if urlsplit(self.path).path not in PAGE_PATHS:
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        try:
            # Stat before reading: if a rebuild lands in between, the tab gets one extra reload, never a stale page.
            version = str(PAGE.stat().st_mtime_ns)
            body = PAGE.read_bytes()
        except FileNotFoundError:
            self.send_error(HTTPStatus.NOT_FOUND, f"{PAGE.name} not found: run `make html`")
            return
        body = inject_reload_script(body, version)
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        if include_body:
            self.wfile.write(body)

    def send_events(self):
        """Stream the page version: once now, then on each change, with a heartbeat to detect dead tabs."""
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        seen = None
        try:
            while True:
                version = self.server.page_version.wait_for_change(seen, HEARTBEAT_SECONDS)
                if version != seen:
                    self.wfile.write(f"data: {version}\n\n".encode("utf-8"))
                    seen = version
                else:
                    self.wfile.write(b": heartbeat\n\n")
        except (BrokenPipeError, ConnectionResetError):
            pass  # the tab was closed or reloaded

    def log_request(self, code="-", size="-"):
        status = code.value if isinstance(code, HTTPStatus) else code
        print(f"{self.command} {self.path} {status}", flush=True)

    def log_message(self, format, *args):
        pass  # log_request above prints one concise line per request


def source_snapshot():
    """Map each watched source file to its modification time."""
    # Skip hidden files: editor swap files and .DS_Store change without any source change.
    paths = [path for path in SOURCE_DIR.rglob("*") if path.is_file() and not path.name.startswith(".")]
    paths += SOURCE_SCRIPTS
    snapshot = {}
    for path in paths:
        try:
            snapshot[path] = path.stat().st_mtime_ns
        except FileNotFoundError:
            pass  # deleted between the listing and the stat
    return snapshot


def rebuild_page():
    """Run the build script; on failure, print its error and leave the last good page in place."""
    started = time.monotonic()
    result = subprocess.run([sys.executable, str(BUILD_SCRIPT)], capture_output=True, text=True)
    if result.returncode == 0:
        print(f"Rebuilt {PAGE.name} in {time.monotonic() - started:.1f} s", flush=True)
    else:
        error = (result.stderr or result.stdout).strip()
        print(f"Build failed, still serving the last good page:\n{error}", flush=True)


def watch(page_version):
    """Poll forever: rebuild the page when the sources change, publish the page version when it changes."""
    built = source_snapshot()  # `make serve` builds the page before starting the server
    previous = built
    while True:
        time.sleep(POLL_SECONDS)
        snapshot = source_snapshot()
        # Wait until the sources stay unchanged for one poll: an editor may write several files in a row.
        if snapshot == previous and snapshot != built:
            rebuild_page()
            built = snapshot
        previous = snapshot
        # Watched on its own, so an external `make html` reloads the tabs too.
        version = read_page_version()
        if version is not None:
            page_version.set(version)


def casper_available():
    """True inside a Casper workspace terminal with the casper CLI on PATH."""
    return bool(os.environ.get("CASPER_WORKSPACE_ID")) and shutil.which("casper") is not None


def run_casper(*args):
    """Run a casper command, ignoring any failure: Casper must never affect serving."""
    try:
        subprocess.run(["casper", *args], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=10)
    except (OSError, subprocess.SubprocessError):
        pass


def publish_info_panel(url):
    document = (
        f"# Durable AI Agents with Temporal\n\nPlayer: <{url}>\n\n"
        "Edits in `src/` rebuild the page and reload open tabs.\n\nRestart with `casper run`.\n"
    )
    with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as info_file:
        info_file.write(document)
    try:
        run_casper("info", "set", "--file", info_file.name)
    finally:
        os.unlink(info_file.name)


def stop(signum, frame):
    # Turn SIGTERM / SIGHUP into a normal exit so the `finally` cleanup below runs.
    sys.exit(0)


def main():
    parser = argparse.ArgumentParser(description="Serve the standalone HTML player.")
    parser.add_argument("--port", type=int, required=True)
    args = parser.parse_args()
    if not 0 < args.port < 65536:
        parser.error(f"invalid port: {args.port}")

    try:
        server = ThreadingHTTPServer(("127.0.0.1", args.port), PlayerHandler)
    except OSError as error:
        if error.errno == errno.EADDRINUSE:
            sys.exit(f"ERROR: port {args.port} is already in use. Pick another one: make serve PORT=<port>")
        raise
    server.page_version = PageVersion()
    # A daemon thread, like the request threads: it never delays the exit on Ctrl-C or SIGTERM.
    threading.Thread(target=watch, args=(server.page_version,), daemon=True).start()

    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGHUP, stop)
    url = f"http://localhost:{args.port}"
    print(f"Serving {url}", flush=True)
    use_casper = casper_available()
    try:
        if use_casper:
            publish_info_panel(url)
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        if use_casper:
            run_casper("info", "clear")
        server.server_close()
        print("Stopped", flush=True)


if __name__ == "__main__":
    main()
