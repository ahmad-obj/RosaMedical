#!/usr/bin/env python3
"""Normalize catalogue instrument images without altering their geometry."""

from __future__ import annotations

import argparse
from pathlib import Path
import sys

from PIL import Image, ImageOps

CANVAS_SIZE = 1800
SAFE_SIZE = 1440
AVIF_QUALITY = 82
WEBP_QUALITY = 88


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Rotate, crop transparent margins, proportionally scale, and center a "
            "catalogue image on an 1800 x 1800 canvas."
        )
    )
    parser.add_argument("input", type=Path)
    parser.add_argument("--output-stem", required=True, type=Path)
    parser.add_argument("--rotation", required=True, type=float)
    parser.add_argument(
        "--background",
        required=True,
        choices=("transparent", "white"),
    )
    parser.add_argument("--force", action="store_true")
    return parser.parse_args()


def has_trustworthy_alpha(image: Image.Image) -> bool:
    if "A" not in image.getbands():
        return False
    minimum, maximum = image.getchannel("A").getextrema()
    return minimum < 255 and maximum > 0


def crop_transparent_edges(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError("Source image is fully transparent")
    return image.crop(bbox)


def normalize(
    source: Path,
    output_stem: Path,
    rotation: float,
    background: str,
    force: bool,
) -> tuple[Path, Path]:
    if not source.is_file():
        raise FileNotFoundError(f"Input image does not exist: {source}")

    avif_path = output_stem.with_suffix(".avif")
    webp_path = output_stem.with_suffix(".webp")
    for output in (avif_path, webp_path):
        if output.exists() and not force:
            raise FileExistsError(
                f"Refusing to overwrite {output}; pass --force to replace it"
            )

    with Image.open(source) as opened:
        oriented = ImageOps.exif_transpose(opened)
        source_size = oriented.size
        trustworthy_alpha = has_trustworthy_alpha(oriented)
        if background == "transparent" and not trustworthy_alpha:
            raise ValueError(
                "Transparent output requires source pixels with trustworthy alpha; "
                "use --background white when the source is opaque"
            )
        rgba = oriented.convert("RGBA")

    rotated = rgba.rotate(
        rotation,
        resample=Image.Resampling.BICUBIC,
        expand=True,
        fillcolor=(0, 0, 0, 0),
    )
    trimmed = crop_transparent_edges(rotated)

    scale = min(SAFE_SIZE / trimmed.width, SAFE_SIZE / trimmed.height, 1.0)
    resized_size = (
        max(1, round(trimmed.width * scale)),
        max(1, round(trimmed.height * scale)),
    )
    resized = trimmed.resize(resized_size, Image.Resampling.LANCZOS)

    canvas_color = (
        (0, 0, 0, 0) if background == "transparent" else (255, 255, 255, 255)
    )
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), canvas_color)
    offset = (
        (CANVAS_SIZE - resized.width) // 2,
        (CANVAS_SIZE - resized.height) // 2,
    )
    canvas.alpha_composite(resized, offset)

    output_stem.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(avif_path, format="AVIF", quality=AVIF_QUALITY)
    canvas.save(webp_path, format="WEBP", quality=WEBP_QUALITY, method=6)

    print(
        "source_size="
        f"{source_size[0]}x{source_size[1]} "
        f"trimmed_size={trimmed.width}x{trimmed.height} "
        f"output_size={CANVAS_SIZE}x{CANVAS_SIZE} "
        f"rotation={rotation:g} background={background}"
    )
    return avif_path, webp_path


def main() -> int:
    args = parse_args()
    try:
        normalize(
            args.input,
            args.output_stem,
            args.rotation,
            args.background,
            args.force,
        )
    except (FileNotFoundError, FileExistsError, OSError, ValueError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
