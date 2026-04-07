#!/usr/bin/env python3
"""
Remove outer backdrop via edge flood-fill, resize to Chrome extension icon sizes.

Supports:
  - white surround (typical on white background; excludes cyan/blue edge pixels where R is low)
  - blue surround (L∞ tolerance from a reference blue)

Requires: Pillow (pip install pillow)

Usage:
  python3 scripts/build-extension-icons.py [source.png] [white|blue|auto]
  Default source: public/icons/source-original.png
  Default mode: auto (from corner luminance)
"""
from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image

# Blue-surround reference (previous BrandStudio artwork)
BLUE_REF = (39, 160, 238)
BLUE_TOL = 42


def is_bg_blue(r: int, g: int, b: int) -> bool:
    return max(abs(r - BLUE_REF[0]), abs(g - BLUE_REF[1]), abs(b - BLUE_REF[2])) <= BLUE_TOL


def is_bg_white(r: int, g: int, b: int) -> bool:
    """Outer white; reject cyan/blue rim pixels on the image boundary (low R, high B)."""
    if r < 215:
        return False
    return min(r, g, b) >= 210 and (r + g + b) >= 680


def detect_mode(im: Image.Image) -> str:
    w, h = im.size
    px = im.load()
    corners = (px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1])
    lum = sum(sum(p[:3]) for p in corners) / (len(corners) * 3)
    return "white" if lum > 220 else "blue"


def mask_outer_rgba(im: Image.Image, mode: str) -> Image.Image:
    is_bg = is_bg_white if mode == "white" else is_bg_blue
    w, h = im.size
    px = im.load()
    vis = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def try_push(x: int, y: int) -> None:
        if x < 0 or x >= w or y < 0 or y >= h or vis[y][x]:
            return
        r, g, b, _a = px[x, y]
        if not is_bg(r, g, b):
            return
        vis[y][x] = True
        q.append((x, y))

    for x in range(w):
        try_push(x, 0)
        try_push(x, h - 1)
    for y in range(h):
        try_push(0, y)
        try_push(w - 1, y)

    while q:
        x, y = q.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            try_push(nx, ny)

    out = im.copy()
    opx = out.load()
    for y in range(h):
        for x in range(w):
            if vis[y][x]:
                r, g, b, _ = opx[x, y]
                opx[x, y] = (r, g, b, 0)
    return out


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    default_src = root / "public" / "icons" / "source-original.png"
    src = default_src
    mode_override: str | None = None
    for a in sys.argv[1:]:
        if a in ("white", "blue", "auto"):
            mode_override = a
            continue
        p = Path(a)
        if p.is_file():
            src = p
        else:
            print("Not a file:", a, file=sys.stderr)
            return 1

    if not src.is_file():
        print("Source not found:", src, file=sys.stderr)
        return 1

    out_dir = root / "public" / "icons"
    out_dir.mkdir(parents=True, exist_ok=True)

    im = Image.open(src).convert("RGBA")
    if mode_override in ("white", "blue"):
        mode = mode_override
    elif mode_override in (None, "auto"):
        mode = detect_mode(im)
    else:
        print("Mode must be white, blue, or auto", file=sys.stderr)
        return 1

    cleared = mask_outer_rgba(im, mode)
    print("Mode:", mode, "source:", src)

    sizes = (16, 32, 48, 128)
    for sz in sizes:
        resized = cleared.resize((sz, sz), Image.Resampling.LANCZOS)
        resized.save(out_dir / f"icon-{sz}.png")

    print("Wrote", out_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
