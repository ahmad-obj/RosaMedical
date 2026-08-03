#!/usr/bin/env python3
"""Prepare Knives Batch 01 AVIF/WebP review assets from client catalogue renders."""

from __future__ import annotations

import argparse
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageChops, ImageDraw, ImageFilter

CANVAS_SIZE = 1800
SAFE_REGION = 1420
ROTATION_DEGREES = -38


@dataclass(frozen=True)
class CropSpec:
    asset_id: str
    source_name: str
    body_box: tuple[int, int, int, int]
    rotate: bool = True


CROPS: tuple[CropSpec, ...] = (
    CropSpec("knives-number-3", "page-02.png", (250, 390, 340, 850)),
    CropSpec("knives-number-4", "page-02.png", (520, 340, 620, 850)),
    CropSpec("knives-number-7", "page-02.png", (795, 245, 885, 850)),
    CropSpec("knives-micro-surgery-handle", "page-02.png", (1070, 235, 1155, 850)),
    CropSpec("knives-number-3-long", "page-02.png", (260, 1060, 355, 1780)),
    CropSpec("knives-number-3-long-curved", "page-02.png", (520, 1060, 620, 1780)),
    CropSpec("knives-number-4-long", "page-02.png", (795, 1060, 890, 1780)),
    CropSpec("knives-liston", "page-02.png", (1090, 1030, 1215, 1790)),
    CropSpec("knives-number-9", "page-03.png", (250, 320, 335, 875)),
    CropSpec("knives-hexagonal", "page-03.png", (565, 190, 690, 875)),
    CropSpec("knives-round-straight", "page-03.png", (930, 235, 1005, 875)),
    CropSpec("knives-round-curved", "page-03.png", (1110, 225, 1205, 875)),
    CropSpec("knives-long-handle", "page-03.png", (285, 1230, 485, 1825), False),
    CropSpec("knives-short-handle", "page-03.png", (590, 1230, 775, 1665), False),
    CropSpec("knives-saalfeld-comedo-extractor", "page-04.png", (285, 235, 510, 785), False),
    CropSpec("knives-fox-lupus-curettes", "page-04.png", (885, 245, 1235, 790), False),
    CropSpec("knives-keyes-dermal-punches", "page-04.png", (270, 1120, 610, 1710), False),
    CropSpec("knives-keyes-dermal-punch-set", "page-04.png", (825, 1180, 1265, 1575), False),
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--repo-root",
        type=Path,
        default=Path.cwd(),
        help="RosaMedical repository root (default: current directory)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing derivatives",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=4,
        help="Parallel encoding workers (default: 4)",
    )
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="Run an offline image-processing self-test and exit",
    )
    return parser.parse_args()


def trim_alpha(image: Image.Image) -> Image.Image:
    box = image.getchannel("A").getbbox()
    if box is None:
        raise ValueError("The selected crop contains no visible instrument pixels")
    return image.crop(box)


def white_to_alpha(image: Image.Image) -> Image.Image:
    """Remove only near-white page background using Pillow-native operations."""

    rgb = image.convert("RGB")
    difference = ImageChops.difference(rgb, Image.new("RGB", rgb.size, "white"))
    alpha = difference.convert("L").point(
        lambda value: 0 if value <= 4 else min(255, value * 10)
    )
    alpha = alpha.filter(ImageFilter.MedianFilter(3))
    rgba = rgb.convert("RGBA")
    rgba.putalpha(alpha)
    return rgba


def prepare_crop(image: Image.Image, *, rotate: bool) -> Image.Image:
    prepared = trim_alpha(white_to_alpha(image))
    if rotate:
        prepared = trim_alpha(
            prepared.rotate(
                ROTATION_DEGREES,
                resample=Image.Resampling.BICUBIC,
                expand=True,
            )
        )
    return prepared


def fit(image: Image.Image, max_width: int, max_height: int) -> Image.Image:
    scale = min(max_width / image.width, max_height / image.height)
    return image.resize(
        (
            max(1, round(image.width * scale)),
            max(1, round(image.height * scale)),
        ),
        Image.Resampling.LANCZOS,
    )


def compose(body: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (255, 255, 255, 0))
    body = fit(body, SAFE_REGION, SAFE_REGION)
    canvas.alpha_composite(
        body,
        (
            (CANVAS_SIZE - body.width) // 2,
            (CANVAS_SIZE - body.height) // 2,
        ),
    )
    return canvas


def ensure_writable(paths: Iterable[Path], force: bool) -> None:
    if force:
        return
    for path in paths:
        if path.exists():
            raise FileExistsError(f"Refusing to overwrite {path}; pass --force")


def encode_one(
    spec: CropSpec,
    source_dir: Path,
    output_dir: Path,
    force: bool,
) -> dict[str, object]:
    source_path = source_dir / spec.source_name
    if not source_path.is_file():
        raise FileNotFoundError(
            f"Missing source {source_path}. Extract the Knives source-page package at the repository root."
        )

    avif_path = output_dir / f"{spec.asset_id}.avif"
    webp_path = output_dir / f"{spec.asset_id}.webp"
    ensure_writable((avif_path, webp_path), force)

    with Image.open(source_path) as source:
        body = prepare_crop(
            source.convert("RGB").crop(spec.body_box), rotate=spec.rotate
        )
    asset = compose(body)
    asset.save(webp_path, "WEBP", quality=88, method=6)
    asset.save(avif_path, "AVIF", quality=82)

    return {
        "assetId": spec.asset_id,
        "source": spec.source_name,
        "bodyCrop": spec.body_box,
        "rotate": spec.rotate,
        "avif": str(avif_path),
        "webp": str(webp_path),
        "width": asset.width,
        "height": asset.height,
    }


def write_contact_sheet(output_dir: Path, review_dir: Path) -> Path:
    tiles: list[Image.Image] = []
    for spec in CROPS:
        with Image.open(output_dir / f"{spec.asset_id}.webp") as source:
            rgba = source.convert("RGBA")
        background = Image.new("RGBA", rgba.size, (245, 245, 245, 255))
        background.alpha_composite(rgba)
        preview = background.convert("RGB")
        preview.thumbnail((300, 300))

        tile = Image.new("RGB", (340, 360), "white")
        tile.paste(preview, ((340 - preview.width) // 2, 10))
        ImageDraw.Draw(tile).text(
            (12, 325),
            spec.asset_id.removeprefix("knives-"),
            fill="black",
        )
        tiles.append(tile)

    columns = 4
    rows = (len(tiles) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * 340, rows * 360), (225, 225, 225))
    for index, tile in enumerate(tiles):
        sheet.paste(tile, ((index % columns) * 340, (index // columns) * 360))

    review_dir.mkdir(parents=True, exist_ok=True)
    path = review_dir / "knives-batch-01-contact.png"
    sheet.save(path)
    return path


def run_self_test() -> None:
    if len(CROPS) != 18:
        raise AssertionError("Expected exactly 18 Knives Batch 01 crop specifications")
    ids = [spec.asset_id for spec in CROPS]
    if len(set(ids)) != len(ids):
        raise AssertionError("Knives Batch 01 crop IDs must be unique")

    test = Image.new("RGB", (240, 420), "white")
    draw = ImageDraw.Draw(test)
    draw.rounded_rectangle((100, 40, 140, 380), radius=12, fill=(115, 120, 125))
    prepared = prepare_crop(test, rotate=True)
    asset = compose(prepared)
    if asset.size != (CANVAS_SIZE, CANVAS_SIZE):
        raise AssertionError("Self-test canvas size mismatch")
    if asset.getchannel("A").getbbox() is None:
        raise AssertionError("Self-test produced an empty asset")

    print("Knives Batch 01 offline self-test passed")


def main() -> int:
    args = parse_args()
    if args.self_test:
        run_self_test()
        return 0

    repo_root = args.repo_root.resolve()
    source_dir = repo_root / "apps/web/local-data/catalogue-pages/knives"
    output_dir = repo_root / "apps/web/public/media/catalogue-preview/knives"
    review_dir = repo_root / "apps/web/local-data/catalogue-review/knives-batch-01"
    output_dir.mkdir(parents=True, exist_ok=True)
    review_dir.mkdir(parents=True, exist_ok=True)

    generated: list[dict[str, object]] = []
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as executor:
        futures = {
            executor.submit(encode_one, spec, source_dir, output_dir, args.force): spec
            for spec in CROPS
        }
        for future in as_completed(futures):
            generated.append(future.result())

    generated.sort(key=lambda record: str(record["assetId"]))
    contact_sheet = write_contact_sheet(output_dir, review_dir)
    report_path = review_dir / "knives-batch-01-report.json"
    report_path.write_text(json.dumps(generated, indent=2), encoding="utf-8")

    print(f"Generated {len(CROPS)} Knives Batch 01 configurations")
    print(f"Derivatives: {len(CROPS) * 2} files")
    print(f"Output: {output_dir}")
    print(f"Contact sheet: {contact_sheet}")
    print(f"Report: {report_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
