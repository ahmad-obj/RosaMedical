#!/usr/bin/env python3
"""Prepare Chisels Batch 01 AVIF/WebP review assets from client catalogue renders."""

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
    box: tuple[int, int, int, int]


CROPS: tuple[CropSpec, ...] = (
    CropSpec("chisels-osteotomes-13-5cm", "page-02.png", (275, 250, 395, 850)),
    CropSpec("chisels-chisels-13-5cm", "page-02.png", (710, 250, 850, 850)),
    CropSpec("chisels-gouges-13-5cm", "page-02.png", (1210, 250, 1335, 850)),
    CropSpec(
        "chisels-hoke-osteotomes-straight",
        "page-02.png",
        (260, 1250, 430, 1950),
    ),
    CropSpec(
        "chisels-hoke-osteotomes-curved",
        "page-02.png",
        (730, 1240, 900, 1950),
    ),
    CropSpec(
        "chisels-round-handle-gouges",
        "page-02.png",
        (1215, 1250, 1375, 1870),
    ),
    CropSpec("chisels-west-chisel", "page-03.png", (220, 210, 330, 1160)),
    CropSpec("chisels-west-gouge", "page-03.png", (735, 205, 855, 1160)),
    CropSpec("chisels-andrews-gouge", "page-03.png", (1320, 190, 1445, 980)),
    CropSpec(
        "chisels-alexander-osteotome",
        "page-03-alexander.png",
        (0, 0, 110, 817),
    ),
    CropSpec(
        "chisels-alexander-gouge",
        "page-03-alexander.png",
        (575, 0, 700, 817),
    ),
    CropSpec(
        "chisels-alexander-chisel",
        "page-03-alexander.png",
        (1120, 0, 1245, 817),
    ),
    CropSpec(
        "chisels-stille-osteotomes-straight",
        "page-04.png",
        (495, 220, 625, 980),
    ),
    CropSpec(
        "chisels-stille-osteotomes-curved",
        "page-04.png",
        (495, 220, 625, 980),
    ),
    CropSpec(
        "chisels-stille-gouges-straight",
        "page-04.png",
        (275, 1230, 415, 2050),
    ),
    CropSpec(
        "chisels-stille-chisels-straight",
        "page-04.png",
        (1120, 1160, 1265, 1980),
    ),
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


def normalize(image: Image.Image) -> Image.Image:
    instrument = trim_alpha(white_to_alpha(image))
    instrument = trim_alpha(
        instrument.rotate(
            ROTATION_DEGREES,
            resample=Image.Resampling.BICUBIC,
            expand=True,
        )
    )

    scale = min(SAFE_REGION / instrument.width, SAFE_REGION / instrument.height)
    instrument = instrument.resize(
        (
            max(1, round(instrument.width * scale)),
            max(1, round(instrument.height * scale)),
        ),
        Image.Resampling.LANCZOS,
    )

    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (255, 255, 255, 0))
    canvas.alpha_composite(
        instrument,
        (
            (CANVAS_SIZE - instrument.width) // 2,
            (CANVAS_SIZE - instrument.height) // 2,
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
            f"Missing source {source_path}. Extract the Chisels source-page package at the repository root."
        )

    avif_path = output_dir / f"{spec.asset_id}.avif"
    webp_path = output_dir / f"{spec.asset_id}.webp"
    ensure_writable((avif_path, webp_path), force)

    with Image.open(source_path) as source:
        crop = source.convert("RGB").crop(spec.box)
    asset = normalize(crop)
    asset.save(webp_path, "WEBP", quality=88, method=6)
    asset.save(avif_path, "AVIF", quality=82)

    return {
        "assetId": spec.asset_id,
        "source": spec.source_name,
        "crop": spec.box,
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
            spec.asset_id.removeprefix("chisels-"),
            fill="black",
        )
        tiles.append(tile)

    columns = 4
    rows = (len(tiles) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * 340, rows * 360), (225, 225, 225))
    for index, tile in enumerate(tiles):
        sheet.paste(tile, ((index % columns) * 340, (index // columns) * 360))

    review_dir.mkdir(parents=True, exist_ok=True)
    path = review_dir / "chisels-batch-01-contact.png"
    sheet.save(path)
    return path


def run_self_test() -> None:
    source = Image.new("RGB", (220, 720), "white")
    draw = ImageDraw.Draw(source)
    draw.rounded_rectangle((90, 70, 130, 650), radius=12, fill=(92, 97, 101))
    draw.polygon(((90, 70), (130, 70), (145, 15), (105, 15)), fill=(160, 165, 170))
    asset = normalize(source)

    assert asset.size == (CANVAS_SIZE, CANVAS_SIZE)
    assert asset.getchannel("A").getbbox() is not None
    print("Chisels Batch 01 offline self-test passed")


def main() -> int:
    args = parse_args()
    if args.self_test:
        run_self_test()
        return 0

    repo_root = args.repo_root.resolve()
    source_dir = repo_root / "apps/web/local-data/catalogue-pages/chisels"
    output_dir = (
        repo_root
        / "apps/web/public/media/catalogue-preview/chisels"
    )
    review_dir = repo_root / "apps/web/local-data/catalogue-review/chisels-batch-01"
    output_dir.mkdir(parents=True, exist_ok=True)
    review_dir.mkdir(parents=True, exist_ok=True)

    workers = max(1, min(args.workers, len(CROPS)))
    records: list[dict[str, object]] = []
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [
            executor.submit(
                encode_one,
                spec,
                source_dir,
                output_dir,
                args.force,
            )
            for spec in CROPS
        ]
        for future in as_completed(futures):
            records.append(future.result())

    records.sort(key=lambda record: str(record["assetId"]))
    contact_sheet = write_contact_sheet(output_dir, review_dir)
    report_path = review_dir / "chisels-batch-01-report.json"
    report_path.write_text(
        json.dumps(
            {
                "configurationCount": len(records),
                "derivativeCount": len(records) * 2,
                "canvas": [CANVAS_SIZE, CANVAS_SIZE],
                "records": records,
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"Generated {len(records)} Chisels Batch 01 configurations")
    print(f"Derivatives: {len(records) * 2} files")
    print(f"Output: {output_dir}")
    print(f"Contact sheet: {contact_sheet}")
    print(f"Report: {report_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
