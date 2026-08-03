#!/usr/bin/env python3
"""Prepare Cutters Batch 01 AVIF/WebP review assets from client catalogue renders."""

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
    inset_box: tuple[int, int, int, int] | None = None


CROPS: tuple[CropSpec, ...] = (
    CropSpec("cutters-liston-straight", "page-02.png", (525, 280, 810, 875)),
    CropSpec("cutters-liston-curved", "page-02.png", (525, 280, 810, 875)),
    CropSpec("cutters-cleveland", "page-02.png", (225, 1245, 510, 1775)),
    CropSpec("cutters-bohler-straight", "page-02.png", (820, 1245, 1120, 1775)),
    CropSpec(
        "cutters-bohler-curved",
        "page-02.png",
        (820, 1245, 1120, 1775),
        (1045, 1235, 1145, 1445),
    ),
    CropSpec("cutters-mc-indoe", "page-03.png", (280, 215, 625, 825)),
    CropSpec(
        "cutters-ruskin-liston-straight",
        "page-03.png",
        (765, 195, 1135, 850),
        (1050, 210, 1135, 455),
    ),
    CropSpec(
        "cutters-ruskin-liston-curved",
        "page-03.png",
        (765, 195, 1135, 850),
        (1135, 210, 1240, 465),
    ),
    CropSpec(
        "cutters-ruskin-rowland-straight",
        "page-03.png",
        (510, 1245, 875, 1910),
        (840, 1240, 970, 1505),
    ),
    CropSpec(
        "cutters-ruskin-rowland-angled-to-side",
        "page-03.png",
        (510, 1245, 875, 1910),
        (1030, 1240, 1165, 1505),
    ),
    CropSpec(
        "cutters-stille-liston-straight",
        "page-04.png",
        (215, 195, 690, 1175),
        (690, 200, 805, 535),
    ),
    CropSpec(
        "cutters-stille-liston-curved",
        "page-04.png",
        (215, 195, 690, 1175),
        (845, 200, 1020, 540),
    ),
    CropSpec(
        "cutters-stille-liston-36-6000",
        "page-04.png",
        (815, 925, 1230, 1885),
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


def compose(body: Image.Image, inset: Image.Image | None) -> Image.Image:
    canvas = Image.new(
        "RGBA", (CANVAS_SIZE, CANVAS_SIZE), (255, 255, 255, 0)
    )

    if inset is None:
        body = fit(body, SAFE_REGION, SAFE_REGION)
        canvas.alpha_composite(
            body,
            (
                (CANVAS_SIZE - body.width) // 2,
                (CANVAS_SIZE - body.height) // 2,
            ),
        )
        return canvas

    body = fit(body, 1120, SAFE_REGION)
    inset = fit(inset, 400, 480)
    body_x = max(120, (CANVAS_SIZE - body.width) // 2 - 130)
    body_y = (CANVAS_SIZE - body.height) // 2
    canvas.alpha_composite(body, (body_x, body_y))

    inset_x = min(CANVAS_SIZE - inset.width - 120, body_x + body.width - 40)
    canvas.alpha_composite(inset, (inset_x, 150))
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
            f"Missing source {source_path}. Extract the Cutters source-page package at the repository root."
        )

    avif_path = output_dir / f"{spec.asset_id}.avif"
    webp_path = output_dir / f"{spec.asset_id}.webp"
    ensure_writable((avif_path, webp_path), force)

    with Image.open(source_path) as source:
        rgb = source.convert("RGB")
        body = prepare_crop(rgb.crop(spec.body_box), rotate=True)
        inset = (
            prepare_crop(rgb.crop(spec.inset_box), rotate=False)
            if spec.inset_box
            else None
        )

    asset = compose(body, inset)
    asset.save(webp_path, "WEBP", quality=88, method=6)
    asset.save(avif_path, "AVIF", quality=82)

    return {
        "assetId": spec.asset_id,
        "source": spec.source_name,
        "bodyCrop": spec.body_box,
        "insetCrop": spec.inset_box,
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
            spec.asset_id.removeprefix("cutters-"),
            fill="black",
        )
        tiles.append(tile)

    columns = 4
    rows = (len(tiles) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * 340, rows * 360), (225, 225, 225))
    for index, tile in enumerate(tiles):
        sheet.paste(tile, ((index % columns) * 340, (index // columns) * 360))

    review_dir.mkdir(parents=True, exist_ok=True)
    path = review_dir / "cutters-batch-01-contact.png"
    sheet.save(path)
    return path


def run_self_test() -> None:
    source = Image.new("RGB", (280, 720), "white")
    draw = ImageDraw.Draw(source)
    draw.line((95, 650, 130, 290), fill=(80, 85, 90), width=24)
    draw.line((185, 650, 150, 290), fill=(80, 85, 90), width=24)
    draw.polygon(((125, 300), (155, 300), (175, 80), (145, 20)), fill=(145, 150, 155))
    body = prepare_crop(source, rotate=True)
    asset = compose(body, None)

    assert asset.size == (CANVAS_SIZE, CANVAS_SIZE)
    assert asset.getchannel("A").getbbox() is not None
    print("Cutters Batch 01 offline self-test passed")


def main() -> int:
    args = parse_args()
    if args.self_test:
        run_self_test()
        return 0

    repo_root = args.repo_root.resolve()
    source_dir = repo_root / "apps/web/local-data/catalogue-pages/cutters"
    output_dir = repo_root / "apps/web/public/media/catalogue-preview/cutters"
    review_dir = repo_root / "apps/web/local-data/catalogue-review/cutters-batch-01"
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
    report_path = review_dir / "cutters-batch-01-report.json"
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

    print(f"Generated {len(records)} Cutters Batch 01 configurations")
    print(f"Derivatives: {len(records) * 2} files")
    print(f"Output: {output_dir}")
    print(f"Contact sheet: {contact_sheet}")
    print(f"Report: {report_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
