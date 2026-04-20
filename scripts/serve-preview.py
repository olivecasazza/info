#!/usr/bin/env python3
"""Minimal SPA-aware static server for .output/public previews.

Serves files as-is; falls back to /index.html only for paths that look like
client-side routes (/lib/**, /src/**, /projects/**, bare / tail) when no real
file exists. Leaves /bird-nix-playground/** and other real static trees alone.
"""
import os
import posixpath
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".output", "public"))
SPA_PREFIXES = ("/lib/", "/src/", "/projects/")


class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:
        clean = unquote(path.split("?", 1)[0].split("#", 1)[0])
        fs_path = os.path.join(ROOT, clean.lstrip("/"))
        if os.path.isfile(fs_path):
            return fs_path
        if os.path.isdir(fs_path):
            index = os.path.join(fs_path, "index.html")
            if os.path.isfile(index):
                return index
        if any(clean.startswith(p) for p in SPA_PREFIXES):
            return os.path.join(ROOT, "index.html")
        return fs_path

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    os.chdir(ROOT)
    port = int(os.environ.get("PORT", "4173"))
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"preview: http://127.0.0.1:{port}/  (serving {ROOT})")
    httpd.serve_forever()
