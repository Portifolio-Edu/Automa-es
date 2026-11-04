#!/usr/bin/env python3
"""Inline index.html into a single-file artifact for Artifact publishing.

Inlines scrollcraft.css/scrollcraft.js as <style>/<script> and every local
image reference as a base64 data: URI, since the Artifact CSP blocks
loading any of those from a relative path. Regenerate after any change to
index.html, scrollcraft.css, scrollcraft.js, or assets/*.
"""
import base64
import mimetypes
import re
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "index.html"
OUT = ROOT / "produtora-voy-artifact.html"

html = SRC.read_text(encoding="utf-8")

css = (ROOT / "scrollcraft.css").read_text(encoding="utf-8")
html = html.replace(
    '<link rel="stylesheet" href="scrollcraft.css">',
    f"<style>\n{css}\n</style>",
)

js = (ROOT / "scrollcraft.js").read_text(encoding="utf-8")
html = html.replace(
    '<script src="scrollcraft.js"></script>',
    f"<script>\n{js}\n</script>",
)


def inline_asset(match):
    path = match.group(1)
    file_path = ROOT / path
    mime, _ = mimetypes.guess_type(str(file_path))
    data = base64.b64encode(file_path.read_bytes()).decode("ascii")
    return f'src="data:{mime};base64,{data}"'


html = re.sub(r'src="(assets/[^"]+)"', inline_asset, html)

OUT.write_text(html, encoding="utf-8")
print(f"Wrote {OUT} ({OUT.stat().st_size / 1024 / 1024:.3f} MB)")
