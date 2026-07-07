#!/usr/bin/env python3
from __future__ import annotations

from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[3]
SITE_DIR = REPO_ROOT / "_site_goaltest"


class AuditSiteHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE_DIR), **kwargs)

    def do_POST(self) -> None:
        if self.path != "/mock-form":
            self.send_error(HTTPStatus.NOT_FOUND, "Unknown POST target")
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length:
            self.rfile.read(content_length)

        self.send_response(HTTPStatus.SEE_OTHER)
        self.send_header("Location", "/contact-success/")
        self.end_headers()


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 4010), AuditSiteHandler)
    print(f"Serving audit site from {SITE_DIR} on http://127.0.0.1:4010")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
