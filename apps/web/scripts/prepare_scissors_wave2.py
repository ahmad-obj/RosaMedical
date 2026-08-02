#!/usr/bin/env python3
"""Download and normalize Mayo and Metzenbaum supplier images for Scissors Batch 01.

The script uses only official product pages from KLS Martin. It resolves the page's
original product-image link, keeps the source original under ignored local-data,
and creates one clean-white 1800x1800 AVIF and WebP derivative per visible
configuration. Geometry is never stretched or generated.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from datetime import date
from html import unescape
from http.client import HTTPResponse
import json
import math
from pathlib import Path
import re
import sys
import tempfile
import time
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin
from urllib.request import Request, urlopen

from PIL import Image, ImageDraw, ImageFont, ImageOps

CANVAS_SIZE = 1800
SAFE_SIZE = 1440
TARGET_AXIS_DEGREES = -25.0
AVIF_QUALITY = 82
WEBP_QUALITY = 88
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0 Safari/537.36"
)


@dataclass(frozen=True)
class SourceTarget:
    asset_id: str
    family: str
    finish: str
    direction: str
    page_url: str
    catalogue_codes: tuple[str, ...]
    sizes: tuple[str, ...]


TARGETS: tuple[SourceTarget, ...] = (
    SourceTarget(
        "scissors-mayo-regular-straight",
        "Mayo",
        "Regular",
        "Straight",
        "https://www.klsmartin.com/shop/en/products/product/11-170-17-07/",
        ("04-0401", "04-0402", "04-0403", "04-0404"),
        ("14.5 cm", "17 cm", "20 cm", "23 cm"),
    ),
    SourceTarget(
        "scissors-mayo-regular-curved",
        "Mayo",
        "Regular",
        "Curved",
        "https://www.klsmartin.com/shop/en/products/product/11-171-17-07/",
        ("04-0411", "04-0412", "04-0413", "04-0414"),
        ("14.5 cm", "17 cm", "20 cm", "23 cm"),
    ),
    SourceTarget(
        "scissors-mayo-super-cut-straight",
        "Mayo",
        "Super Cut",
        "Straight",
        "https://www.klsmartin.com/shop/en/products/product/11-652-17-07/",
        ("05-0401", "05-0402", "05-0403", "05-0404"),
        ("14.5 cm", "17 cm", "20 cm", "23 cm"),
    ),
    SourceTarget(
        "scissors-mayo-super-cut-curved",
        "Mayo",
        "Super Cut",
        "Curved",
        "https://www.klsmartin.com/shop/en/products/product/11-653-17-07/",
        ("05-0411", "05-0412", "05-0413", "05-0414"),
        ("14.5 cm", "17 cm", "20 cm", "23 cm"),
    ),
    SourceTarget(
        "scissors-mayo-tungsten-carbide-straight",
        "Mayo",
        "Tungsten Carbide",
        "Straight",
        "https://www.klsmartin.com/shop/en/products/product/11-910-17-07/",
        ("06-0401", "06-0402", "06-0403", "06-0404"),
        ("14.5 cm", "17 cm", "20 cm", "23 cm"),
    ),
    SourceTarget(
        "scissors-mayo-tungsten-carbide-curved",
        "Mayo",
        "Tungsten Carbide",
        "Curved",
        "https://www.klsmartin.com/shop/en/products/product/11-911-17-07/",
        ("06-0411", "06-0412", "06-0413", "06-0414"),
        ("14.5 cm", "17 cm", "20 cm", "23 cm"),
    ),
    SourceTarget(
        "scissors-metzenbaum-regular-straight",
        "Metzenbaum",
        "Regular",
        "Straight",
        "https://www.klsmartin.com/shop/en/products/product/11-280-18-07/",
        ("04-1901", "04-1902", "04-1909", "04-1903", "04-1904", "04-1905"),
        ("11 cm", "14 cm", "16 cm", "18 cm", "20 cm", "23 cm"),
    ),
    SourceTarget(
        "scissors-metzenbaum-regular-curved",
        "Metzenbaum",
        "Regular",
        "Curved",
        "https://www.klsmartin.com/shop/en/products/product/11-285-18-07/",
        ("04-1911", "04-1912", "04-1919", "04-1913", "04-1914", "04-1915"),
        ("11 cm", "14 cm", "16 cm", "18 cm", "20 cm", "23 cm"),
    ),
    SourceTarget(
        "scissors-metzenbaum-super-cut-straight",
        "Metzenbaum",
        "Super Cut",
        "Straight",
        "https://www.klsmartin.com/shop/en/products/product/11-660-18-07/",
        ("05-1901", "05-1902", "05-1909", "05-1903", "05-1904", "05-1905"),
        ("11 cm", "14 cm", "16 cm", "18 cm", "20 cm", "23 cm"),
    ),
    SourceTarget(
        "scissors-metzenbaum-super-cut-curved",
        "Metzenbaum",
        "Super Cut",
        "Curved",
        "https://www.klsmartin.com/shop/en/products/product/11-661-18-07/",
        ("05-1911", "05-1912", "05-1919", "05-1913", "05-1914", "05-1915"),
        ("11 cm", "14 cm", "16 cm", "18 cm", "20 cm", "23 cm"),
    ),
    SourceTarget(
        "scissors-metzenbaum-tungsten-carbide-straight",
        "Metzenbaum",
        "Tungsten Carbide",
        "Straight",
        "https://www.klsmartin.com/shop/en/products/product/11-942-18-07/",
        ("06-1901", "06-1902", "06-1909", "06-1903", "06-1904", "06-1905"),
        ("11 cm", "14 cm", "16 cm", "18 cm", "20 cm", "23 cm"),
    ),
    SourceTarget(
        "scissors-metzenbaum-tungsten-carbide-curved",
        "Metzenbaum",
        "Tungsten Carbide",
        "Curved",
        "https://www.klsmartin.com/shop/en/products/product/11-943-18-07/",
        ("06-1911", "06-1912", "06-1919", "06-1913", "06-1914", "06-1915"),
        ("11 cm", "14 cm", "16 cm", "18 cm", "20 cm", "23 cm"),
    ),
)

ASSET_RE = re.compile(
    r"(?:href|src)=[\"']([^\"']*(?:eID=akeneo-asset|mediaCode=)[^\"']+?\.(?:tif|tiff|png|jpe?g|webp)(?:[^\"']*)?)[\"']",
    re.IGNORECASE,
)
FALLBACK_ASSET_RE = re.compile(
    r"((?:https?:)?//[^\"'<> ]+?\.(?:tif|tiff|png|jpe?g|webp)(?:\?[^\"'<> ]*)?)",
    re.IGNORECASE,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--repo-root",
        type=Path,
        default=Path.cwd(),
        help="RosaMedical repository root; defaults to the current directory.",
    )
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--only", choices=("mayo", "metzenbaum"))
    return parser.parse_args()


def fetch_bytes(url: str, *, attempts: int = 3) -> tuple[bytes, str]:
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        request = Request(
            url,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "text/html,image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.8",
            },
        )
        try:
            with urlopen(request, timeout=45) as response:
                assert isinstance(response, HTTPResponse)
                return response.read(), response.geturl()
        except (HTTPError, URLError, TimeoutError, OSError) as error:
            last_error = error
            if attempt < attempts:
                time.sleep(attempt * 1.5)
    raise RuntimeError(f"Failed to download {url}: {last_error}")


def resolve_product_image(page_html: str, page_url: str) -> str:
    decoded = unescape(page_html).replace("\\/", "/")
    candidates = [match.group(1) for match in ASSET_RE.finditer(decoded)]
    if not candidates:
        candidates = [match.group(1) for match in FALLBACK_ASSET_RE.finditer(decoded)]

    normalized: list[str] = []
    for candidate in candidates:
        candidate = unescape(candidate)
        if candidate.startswith("//"):
            candidate = "https:" + candidate
        normalized.append(urljoin(page_url, candidate))

    preferred = [
        value
        for value in normalized
        if "akeneo-asset" in value and re.search(r"_h_\d+\.(?:tif|tiff)", value, re.I)
    ]
    pool = preferred or [value for value in normalized if "akeneo-asset" in value] or normalized
    if not pool:
        raise ValueError(f"No product image link found on {page_url}")
    return pool[0]


def nonwhite_mask(image: Image.Image, threshold: int = 246) -> Image.Image:
    rgb = image.convert("RGB")
    return rgb.point(lambda value: 255 if value < threshold else 0).convert("1")


def principal_axis_rotation(image: Image.Image) -> float:
    mask = nonwhite_mask(image)
    if mask.getbbox() is None:
        return 0.0

    sample = mask.copy()
    sample.thumbnail((900, 900), Image.Resampling.NEAREST)
    points: list[tuple[float, float]] = []
    pixels = sample.load()
    for y in range(sample.height):
        for x in range(sample.width):
            if pixels[x, y]:
                points.append((float(x), float(y)))
    if len(points) < 100:
        return 0.0

    mean_x = sum(x for x, _ in points) / len(points)
    mean_y = sum(y for _, y in points) / len(points)
    xx = sum((x - mean_x) ** 2 for x, _ in points) / len(points)
    yy = sum((y - mean_y) ** 2 for _, y in points) / len(points)
    xy = sum((x - mean_x) * (y - mean_y) for x, y in points) / len(points)

    angle = 0.5 * math.atan2(2.0 * xy, xx - yy)
    axis_x, axis_y = math.cos(angle), math.sin(angle)
    projections = [(x - mean_x) * axis_x + (y - mean_y) * axis_y for x, y in points]
    low, high = min(projections), max(projections)
    span = high - low
    if span <= 1.0:
        return 0.0

    end_fraction = 0.18
    low_count = sum(value <= low + span * end_fraction for value in projections)
    high_count = sum(value >= high - span * end_fraction for value in projections)
    if high_count > low_count:
        axis_x, axis_y = -axis_x, -axis_y

    current_degrees = math.degrees(math.atan2(axis_y, axis_x))
    rotation = current_degrees - TARGET_AXIS_DEGREES
    while rotation > 180:
        rotation -= 360
    while rotation <= -180:
        rotation += 360
    return rotation


def crop_near_white(image: Image.Image) -> Image.Image:
    mask = nonwhite_mask(image)
    bbox = mask.getbbox()
    if bbox is None:
        raise ValueError("Downloaded image contains no visible non-white instrument pixels")
    padding = max(12, round(max(image.size) * 0.015))
    return image.crop(
        (
            max(0, bbox[0] - padding),
            max(0, bbox[1] - padding),
            min(image.width, bbox[2] + padding),
            min(image.height, bbox[3] + padding),
        )
    )


def normalize_supplier_image(source: Path, output_stem: Path, *, force: bool) -> dict[str, object]:
    avif_path = output_stem.with_suffix(".avif")
    webp_path = output_stem.with_suffix(".webp")
    for output in (avif_path, webp_path):
        if output.exists() and not force:
            raise FileExistsError(f"Refusing to overwrite {output}; pass --force")

    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        original_size = image.size

    rotation = principal_axis_rotation(image)
    rotated = image.rotate(
        rotation,
        resample=Image.Resampling.BICUBIC,
        expand=True,
        fillcolor=(255, 255, 255),
    )
    trimmed = crop_near_white(rotated)
    scale = min(SAFE_SIZE / trimmed.width, SAFE_SIZE / trimmed.height, 1.0)
    resized = trimmed.resize(
        (max(1, round(trimmed.width * scale)), max(1, round(trimmed.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGB", (CANVAS_SIZE, CANVAS_SIZE), "white")
    offset = ((CANVAS_SIZE - resized.width) // 2, (CANVAS_SIZE - resized.height) // 2)
    canvas.paste(resized, offset)

    output_stem.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(avif_path, format="AVIF", quality=AVIF_QUALITY)
    canvas.save(webp_path, format="WEBP", quality=WEBP_QUALITY, method=6)
    return {
        "sourceSize": list(original_size),
        "rotationDegrees": round(rotation, 2),
        "outputSize": [CANVAS_SIZE, CANVAS_SIZE],
        "background": "clean-white",
    }


def make_contact_sheet(output_dir: Path, assets: Iterable[SourceTarget], destination: Path) -> None:
    assets = list(assets)
    thumb_size = 420
    label_height = 80
    columns = 3
    rows = math.ceil(len(assets) / columns)
    sheet = Image.new("RGB", (columns * thumb_size, rows * (thumb_size + label_height)), "#e9ecef")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for index, target in enumerate(assets):
        row, column = divmod(index, columns)
        x = column * thumb_size
        y = row * (thumb_size + label_height)
        with Image.open(output_dir / f"{target.asset_id}.webp") as image:
            preview = image.convert("RGB")
            preview.thumbnail((thumb_size - 24, thumb_size - 24), Image.Resampling.LANCZOS)
        sheet.paste(
            preview,
            (x + (thumb_size - preview.width) // 2, y + (thumb_size - preview.height) // 2),
        )
        draw.text((x + 12, y + thumb_size + 8), target.asset_id, fill="black", font=font)
        draw.text(
            (x + 12, y + thumb_size + 28),
            f"{target.family} · {target.finish} · {target.direction}",
            fill="black",
            font=font,
        )
    destination.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(destination, format="PNG", optimize=True)


def write_markdown(records: list[dict[str, object]], path: Path) -> None:
    lines = [
        "# Scissors Batch 01 Wave 2 Download Record",
        "",
        f"Generated: {date.today().isoformat()}",
        "",
        "The pages below are official supplier product records. Runtime images are local derivatives; no third-party hotlinks are used.",
        "",
        "| Asset ID | Supplier page | Resolved original | Rotation | Background |",
        "|---|---|---|---:|---|",
    ]
    for record in records:
        processing = record["processing"]
        assert isinstance(processing, dict)
        lines.append(
            f"| `{record['assetId']}` | {record['sourcePageUrl']} | {record['originalImageUrl']} | "
            f"{processing['rotationDegrees']}° | clean-white |"
        )
    lines.append("")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines), encoding="utf-8")


def selected_targets(only: str | None) -> tuple[SourceTarget, ...]:
    if only is None:
        return TARGETS
    family = "Mayo" if only == "mayo" else "Metzenbaum"
    return tuple(target for target in TARGETS if target.family == family)


def run(repo_root: Path, *, force: bool, only: str | None) -> int:
    repo_root = repo_root.resolve()
    if not (repo_root / "apps" / "web").is_dir():
        raise RuntimeError(f"Not a RosaMedical repository root: {repo_root}")

    output_dir = repo_root / "apps/web/public/media/catalogue-preview/scissors"
    source_root = repo_root / "local-data/catalogue-sources/scissors-batch-01/wave2"
    report_path = source_root / "wave2-download-report.json"
    contact_path = source_root / "wave2-contact.png"
    markdown_path = repo_root / "docs/review/catalogue-media/scissors-batch-01-wave2-downloads.md"

    targets = selected_targets(only)
    records: list[dict[str, object]] = []
    for index, target in enumerate(targets, start=1):
        print(f"[{index}/{len(targets)}] {target.asset_id}")
        page_bytes, final_page_url = fetch_bytes(target.page_url)
        image_url = resolve_product_image(
            page_bytes.decode("utf-8", errors="replace"), final_page_url
        )
        image_bytes, final_image_url = fetch_bytes(image_url)

        family_dir = source_root / target.family.lower()
        family_dir.mkdir(parents=True, exist_ok=True)
        extension_match = re.search(r"\.(tiff?|png|jpe?g|webp)(?:\?|$)", final_image_url, re.I)
        extension = "." + (extension_match.group(1).lower() if extension_match else "tif")
        source_path = family_dir / f"{target.asset_id}{extension}"
        if source_path.exists() and not force:
            raise FileExistsError(f"Refusing to overwrite {source_path}; pass --force")
        source_path.write_bytes(image_bytes)

        processing = normalize_supplier_image(
            source_path, output_dir / target.asset_id, force=force
        )
        records.append(
            {
                "assetId": target.asset_id,
                "family": target.family,
                "finish": target.finish,
                "direction": target.direction,
                "catalogueCodes": list(target.catalogue_codes),
                "sizes": list(target.sizes),
                "sourcePageUrl": final_page_url,
                "originalImageUrl": final_image_url,
                "processing": processing,
            }
        )

    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(records, indent=2), encoding="utf-8")
    write_markdown(records, markdown_path)
    make_contact_sheet(output_dir, targets, contact_path)
    print(f"Created {len(targets) * 2} derivatives in {output_dir}")
    print(f"Contact sheet: {contact_path}")
    print(f"Download record: {markdown_path}")
    return 0


def self_test() -> int:
    sample_html = (
        '<a href="/shop/?eID=akeneo-asset&amp;mediaCode=a%2Fb%2Fc_11_170_14_07_h_50.tif">Image</a>'
    )
    resolved = resolve_product_image(sample_html, "https://www.klsmartin.com/example")
    assert resolved == (
        "https://www.klsmartin.com/shop/?eID=akeneo-asset&mediaCode="
        "a%2Fb%2Fc_11_170_14_07_h_50.tif"
    ), resolved

    with tempfile.TemporaryDirectory() as temporary:
        root = Path(temporary)
        source = root / "source.png"
        image = Image.new("RGB", (1000, 500), "white")
        draw = ImageDraw.Draw(image)
        draw.ellipse((70, 150, 240, 320), outline="black", width=22)
        draw.ellipse((170, 220, 340, 390), outline="black", width=22)
        draw.line((240, 235, 860, 130), fill="black", width=30)
        draw.line((285, 295, 870, 170), fill="black", width=22)
        image.save(source)
        details = normalize_supplier_image(source, root / "normalized", force=False)
        assert details["outputSize"] == [1800, 1800]
        for suffix in (".avif", ".webp"):
            output = root / f"normalized{suffix}"
            assert output.is_file() and output.stat().st_size > 0
            with Image.open(output) as opened:
                assert opened.size == (1800, 1800)
    print("Wave 2 preparation self-test passed")
    return 0


def main() -> int:
    args = parse_args()
    try:
        if args.self_test:
            return self_test()
        return run(args.repo_root, force=args.force, only=args.only)
    except (AssertionError, FileExistsError, OSError, RuntimeError, ValueError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
