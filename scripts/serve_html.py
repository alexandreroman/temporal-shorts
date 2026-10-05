"""Serve the standalone HTML player (output/<name>.html) on http://localhost:PORT, and nothing else.

  python scripts/serve_html.py --port 8000

The page is read on every request, so a `make html` rebuild is served without a restart. In a Casper
workspace, the player URL is published to the workspace info panel while the server runs.
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
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import OUTPUT, VIDEO_NAME

PAGE = OUTPUT / f"{VIDEO_NAME}.html"
PAGE_PATHS = {"/", "/index.html"}


class PlayerHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_page(include_body=True)

    def do_HEAD(self):
        self.send_page(include_body=False)

    def send_page(self, include_body):
        # Ignore the query string so that /?t=40 (frozen frame) works too.
        if urlsplit(self.path).path not in PAGE_PATHS:
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        try:
            body = PAGE.read_bytes()
        except FileNotFoundError:
            self.send_error(HTTPStatus.NOT_FOUND, f"{PAGE.name} not found: run `make html`")
            return
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        if include_body:
            self.wfile.write(body)

    def log_request(self, code="-", size="-"):
        status = code.value if isinstance(code, HTTPStatus) else code
        print(f"{self.command} {self.path} {status}", flush=True)

    def log_message(self, format, *args):
        pass  # log_request above prints one concise line per request


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
    document = f"# Durable AI Agents with Temporal\n\nPlayer: <{url}>\n\nRestart with `casper run`.\n"
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
