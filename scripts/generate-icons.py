"""Generate Lambda prism icons from vector paths (matches assets/favicon.svg)."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "icons"
SVG_REF = ROOT / "assets" / "favicon.svg"

BG = "#090b10"
CYAN = "#45d2ff"
STROKE_OPACITY = 0.85

# Normalized to 24x24 viewBox (favicon.svg)
OUTER = [(12, 5), (19.5, 19), (4.5, 19)]
INNER = [(12, 10.5), (15.4, 16), (8.6, 16)]


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def scale_point(x: float, y: float, size: int, pad: float, inner_scale: float) -> tuple[float, float]:
    usable = size - pad * 2
    sx = pad + (x / 24.0) * usable * inner_scale + (usable * (1 - inner_scale)) / 2
    sy = pad + (y / 24.0) * usable * inner_scale + (usable * (1 - inner_scale)) / 2
    return sx, sy


def rounded_rect_mask(size: int, radius_ratio: float = 5 / 24) -> Image.Image:
    """Alpha mask for rounded square icon."""
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    r = max(2, int(size * radius_ratio))
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=r, fill=255)
    return mask


def render_icon(size: int, *, maskable: bool = False) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if maskable:
        # Android maskable safe zone: logo ~66% of canvas
        pad = size * 0.17
        inner_scale = 0.66
    else:
        pad = size * 0.04
        inner_scale = 1.0

    bg_rgb = hex_to_rgb(BG)
    draw.rounded_rectangle(
        (0, 0, size - 1, size - 1),
        radius=max(2, int(size * 5 / 24)),
        fill=bg_rgb + (255,),
    )

    outer = [scale_point(x, y, size, pad, inner_scale) for x, y in OUTER]
    inner = [scale_point(x, y, size, pad, inner_scale) for x, y in INNER]

    stroke_w = max(1, size / 20)
    cyan = hex_to_rgb(CYAN)
    stroke_color = cyan + (int(255 * STROKE_OPACITY),)
    fill_color = cyan + (255,)

    draw.polygon(outer, outline=stroke_color, width=int(stroke_w))
    draw.polygon(inner, fill=fill_color)

    return img


def save_png(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG", optimize=True)
    print(f"  {path.relative_to(ROOT)}")


def main() -> None:
    sizes = [16, 32, 48, 72, 96, 128, 152, 180, 192, 256, 384, 512]
    print("Generating icons...")
    for s in sizes:
        save_png(render_icon(s), OUT / f"icon-{s}x{s}.png")

    save_png(render_icon(180), OUT / "apple-touch-icon.png")
    save_png(render_icon(512, maskable=True), OUT / "icon-512-maskable.png")

    # favicon.ico at repo root (multi-size)
    ico_sizes = [16, 32, 48]
    ico_images = [render_icon(s).convert("RGBA") for s in ico_sizes]
    ico_path = ROOT / "favicon.ico"
    ico_images[0].save(
        ico_path,
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
        append_images=ico_images[1:],
    )
    print(f"  favicon.ico")

    # OG / social preview (optional standard)
    save_png(render_icon(512), OUT / "og-image.png")

    print("Done.")


if __name__ == "__main__":
    main()
