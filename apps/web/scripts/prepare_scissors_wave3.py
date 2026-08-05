#!/usr/bin/env python3
"""Prepare Operating Scissors Wave 3 preview media.

This script creates 18 AVIF + 18 WebP derivatives for the Operating Scissors
configurations in Scissors Batch 01.

- Six Regular files use exact supplier photographs for direction and tip style.
- Twelve Super Cut / Tungsten Carbide files use the client catalogue's exact
  finish-specific full body plus an inset from the exact supplier photograph.
- No instrument geometry is generated, stretched, or reshaped.
"""

from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from datetime import datetime, timezone
import json
import math
from pathlib import Path
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageOps

try:  # Registers AVIF support when the optional plugin is installed.
    import pillow_avif  # type: ignore[import-not-found]  # noqa: F401
except ImportError:
    try:
        import pillow_avif_plugin  # type: ignore[import-not-found]  # noqa: F401
    except ImportError:
        pass

CANVAS_SIZE = 1800
SAFE_SIZE = 1440
AVIF_QUALITY = 82
WEBP_QUALITY = 88
TARGET_AXIS_DEGREES = -35.0
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0 Safari/537.36"
)

SUPPLIER_PAGE = "https://www.mpmmedicalsupply.com/products/operating-scissors"


@dataclass(frozen=True)
class ExactSource:
    direction: str
    point_style: str
    image_url: str

    @property
    def key(self) -> str:
        return f"{self.direction}-{self.point_style}"


EXACT_SOURCES: tuple[ExactSource, ...] = (
    ExactSource(
        "straight",
        "blunt-blunt",
        "https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-straight-blunt-blunt_700x700.jpg?v=1537150721",
    ),
    ExactSource(
        "straight",
        "sharp-blunt",
        "https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-straight-sharp-blunt_700x700.jpg?v=1537150736",
    ),
    ExactSource(
        "straight",
        "sharp-sharp",
        "https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-straight-sharp-sharp_700x700.jpg?v=1537150751",
    ),
    ExactSource(
        "curved",
        "blunt-blunt",
        "https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-curved-blunt-blunt_700x700.jpg?v=1537150765",
    ),
    ExactSource(
        "curved",
        "sharp-blunt",
        "https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-curved-sharp-blunt_700x700.jpg?v=1537150810",
    ),
    ExactSource(
        "curved",
        "sharp-sharp",
        "https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-curved-sharp-sharp_700x700.jpg?v=1537150798",
    ),
)

FINISHES = (
    ("regular", "Regular", "04"),
    ("super-cut", "Super Cut", "05"),
    ("tungsten-carbide", "Tungsten Carbide", "06"),
)

POINT_SUFFIXES: dict[str, dict[str, tuple[str, ...]]] = {
    "sharp-sharp": {
        "straight": ("0121", "0101", "0102"),
        "curved": ("0131", "0111", "0112"),
    },
    "sharp-blunt": {
        "straight": ("0221", "0201", "0202"),
        "curved": ("0231", "0211", "0212"),
    },
    "blunt-blunt": {
        "straight": ("0321", "0301", "0302"),
        "curved": ("0331", "0311", "0312"),
    },
}

POINT_LABELS = {
    "sharp-sharp": "Sharp/Sharp",
    "sharp-blunt": "Sharp/Blunt",
    "blunt-blunt": "Blunt/Blunt",
}

# Pixel coordinates for the 2550 x 3575 render of Scissors catalogue PDF page 3
# (printed page 2). Crops contain only the finish-specific full instrument.
CATALOGUE_BODY_BOXES = {
    "regular": (300, 260, 760, 1120),
    "super-cut": (1030, 260, 1480, 1120),
    "tungsten-carbide": (1800, 260, 2280, 1120),
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--repo-root",
        type=Path,
        default=Path.cwd(),
        help="RosaMedical repository root. Defaults to the current directory.",
    )
    parser.add_argument(
        "--catalogue-page",
        type=Path,
        default=None,
        help=(
            "Rendered Scissors PDF page containing Operating Scissors. Defaults "
            "to apps/web/local-data/catalogue-pages/scissors-op-page.png."
        ),
    )
    parser.add_argument("--force", action="store_true", help="Overwrite existing outputs.")
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="Run offline image-pipeline checks without downloading sources.",
    )
    return parser.parse_args()


def fetch_bytes(url: str, attempts: int = 4) -> tuple[bytes, str]:
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        request = Request(
            url,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.8",
                "Referer": SUPPLIER_PAGE,
            },
        )
        try:
            with urlopen(request, timeout=45) as response:
                return response.read(), response.geturl()
        except (HTTPError, URLError, TimeoutError, OSError) as error:
            last_error = error
            if attempt < attempts:
                time.sleep(1.5 * attempt)
    raise RuntimeError(f"Failed to download {url}: {last_error}")


def white_to_alpha(image: Image.Image) -> Image.Image:
    """Remove a near-white background while retaining anti-aliased steel edges."""
    rgb = ImageOps.exif_transpose(image).convert("RGB")
    difference = ImageChops.difference(rgb, Image.new("RGB", rgb.size, "white"))
    red, green, blue = difference.split()
    distance = ImageChops.lighter(ImageChops.lighter(red, green), blue)
    alpha = distance.point(
        lambda value: 0
        if value <= 6
        else 255
        if value >= 44
        else round((value - 6) / 38 * 255)
    )
    rgba = rgb.convert("RGBA")
    rgba.putalpha(alpha)
    return rgba


def crop_alpha(image: Image.Image, padding: int = 18) -> Image.Image:
    rgba = image.convert("RGBA")
    bbox = rgba.getchannel("A").getbbox()
    if bbox is None:
        raise ValueError("Image contains no visible non-transparent pixels")
    left, top, right, bottom = bbox
    return rgba.crop(
        (
            max(0, left - padding),
            max(0, top - padding),
            min(rgba.width, right + padding),
            min(rgba.height, bottom + padding),
        )
    )


def alpha_points(
    image: Image.Image, maximum: int = 900
) -> tuple[list[tuple[float, float]], tuple[int, int]]:
    alpha = image.convert("RGBA").getchannel("A")
    alpha.thumbnail((maximum, maximum), Image.Resampling.NEAREST)
    pixels = alpha.load()
    points: list[tuple[float, float]] = []
    for y in range(alpha.height):
        for x in range(alpha.width):
            if pixels[x, y] >= 50:
                points.append((float(x), float(y)))
    return points, alpha.size


def principal_axis_rotation(image: Image.Image) -> float:
    points, _ = alpha_points(image)
    if len(points) < 100:
        return 0.0

    mean_x = sum(x for x, _ in points) / len(points)
    mean_y = sum(y for _, y in points) / len(points)
    xx = sum((x - mean_x) ** 2 for x, _ in points) / len(points)
    yy = sum((y - mean_y) ** 2 for _, y in points) / len(points)
    xy = sum((x - mean_x) * (y - mean_y) for x, y in points) / len(points)

    angle = 0.5 * math.atan2(2.0 * xy, xx - yy)
    axis_x, axis_y = math.cos(angle), math.sin(angle)
    projections = [
        (x - mean_x) * axis_x + (y - mean_y) * axis_y for x, y in points
    ]
    low, high = min(projections), max(projections)
    span = high - low
    if span <= 1.0:
        return 0.0

    # The ring-handle end contains more pixels than the blade end. Orient the
    # lighter blade end toward the target upper-right axis.
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


def orient_and_trim(image: Image.Image) -> Image.Image:
    rgba = crop_alpha(image)
    rotation = principal_axis_rotation(rgba)
    rotated = rgba.rotate(
        rotation,
        resample=Image.Resampling.BICUBIC,
        expand=True,
        fillcolor=(255, 255, 255, 0),
    )
    return crop_alpha(rotated)


def fit_inside(image: Image.Image, width: int, height: int) -> Image.Image:
    scale = min(width / image.width, height / image.height)
    return image.resize(
        (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
        Image.Resampling.LANCZOS,
    )


def normalize_exact_photo(image: Image.Image) -> Image.Image:
    instrument = orient_and_trim(white_to_alpha(image))
    instrument = fit_inside(instrument, SAFE_SIZE, SAFE_SIZE)
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (255, 255, 255, 0))
    position = (
        (CANVAS_SIZE - instrument.width) // 2,
        (CANVAS_SIZE - instrument.height) // 2,
    )
    canvas.alpha_composite(instrument, position)
    return canvas


def extract_tip_detail(normalized: Image.Image) -> Image.Image:
    bbox = normalized.getchannel("A").getbbox()
    if bbox is None:
        raise ValueError("Normalized supplier image has no visible instrument")
    left, top, right, bottom = bbox
    width = right - left
    height = bottom - top
    crop = normalized.crop(
        (
            left + round(width * 0.43),
            top,
            right,
            top + round(height * 0.48),
        )
    )
    return crop_alpha(crop, padding=10)


def catalogue_body(page: Image.Image, finish_key: str) -> Image.Image:
    expected = (2550, 3575)
    if page.size != expected:
        scale_x = page.width / expected[0]
        scale_y = page.height / expected[1]
        box = CATALOGUE_BODY_BOXES[finish_key]
        box = tuple(
            round(value * (scale_x if index % 2 == 0 else scale_y))
            for index, value in enumerate(box)
        )
    else:
        box = CATALOGUE_BODY_BOXES[finish_key]
    body = page.crop(box)
    return orient_and_trim(white_to_alpha(body))


def make_montage(body: Image.Image, tip: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (255, 255, 255, 0))
    body_scaled = fit_inside(body, 1220, 1400)
    tip_scaled = fit_inside(tip, 470, 470)

    body_x = 120 + max(0, (1180 - body_scaled.width) // 2)
    body_y = (CANVAS_SIZE - body_scaled.height) // 2 + 80
    tip_x = CANVAS_SIZE - tip_scaled.width - 105
    tip_y = 105

    canvas.alpha_composite(body_scaled, (body_x, body_y))
    canvas.alpha_composite(tip_scaled, (tip_x, tip_y))
    return canvas


def save_derivatives(image: Image.Image, stem: Path, force: bool) -> dict[str, int]:
    avif = stem.with_suffix(".avif")
    webp = stem.with_suffix(".webp")
    for output in (avif, webp):
        if output.exists() and not force:
            raise FileExistsError(f"Refusing to overwrite {output}; pass --force")
    stem.parent.mkdir(parents=True, exist_ok=True)

    try:
        image.save(avif, format="AVIF", quality=AVIF_QUALITY, speed=10)
    except (KeyError, OSError) as error:
        raise RuntimeError(
            "AVIF writing is unavailable. Run: python -m pip install Pillow pillow-avif-plugin"
        ) from error
    image.save(webp, format="WEBP", quality=WEBP_QUALITY, method=6)
    return {"avifBytes": avif.stat().st_size, "webpBytes": webp.stat().st_size}


def make_contact_sheet(output_dir: Path, destination: Path) -> None:
    ids = [
        f"scissors-operating-{finish_key}-{source.direction}-{source.point_style}"
        for finish_key, _, _ in FINISHES
        for source in EXACT_SOURCES
    ]
    columns = 3
    thumb = 430
    label_height = 72
    rows = math.ceil(len(ids) / columns)
    sheet = Image.new(
        "RGB",
        (columns * thumb, rows * (thumb + label_height)),
        (232, 235, 238),
    )
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for index, asset_id in enumerate(ids):
        row, column = divmod(index, columns)
        with Image.open(output_dir / f"{asset_id}.webp") as opened:
            preview = opened.convert("RGBA")
        background = Image.new("RGBA", preview.size, "white")
        background.alpha_composite(preview)
        background.thumbnail((thumb - 24, thumb - 24), Image.Resampling.LANCZOS)
        x = column * thumb + (thumb - background.width) // 2
        y = row * (thumb + label_height) + (thumb - background.height) // 2
        sheet.paste(background.convert("RGB"), (x, y))
        label = asset_id.removeprefix("scissors-operating-")
        draw.text(
            (column * thumb + 12, row * (thumb + label_height) + thumb + 12),
            label,
            fill="black",
            font=font,
        )
    destination.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(destination, format="PNG")


def run_self_test() -> None:
    source = Image.new("RGB", (700, 700), "white")
    draw = ImageDraw.Draw(source)
    draw.ellipse((80, 450, 250, 620), outline=(65, 65, 65), width=25)
    draw.ellipse((260, 450, 430, 620), outline=(65, 65, 65), width=25)
    draw.line((165, 470, 430, 160), fill=(80, 80, 80), width=28)
    draw.line((345, 470, 520, 115), fill=(80, 80, 80), width=28)
    normalized = normalize_exact_photo(source)
    assert normalized.size == (CANVAS_SIZE, CANVAS_SIZE)
    assert normalized.getchannel("A").getbbox() is not None
    tip = extract_tip_detail(normalized)
    montage = make_montage(orient_and_trim(white_to_alpha(source)), tip)
    assert montage.size == (CANVAS_SIZE, CANVAS_SIZE)
    assert montage.getchannel("A").getbbox() is not None
    print("Wave 3 offline self-test passed")


def main() -> int:
    args = parse_args()
    if args.self_test:
        run_self_test()
        return 0

    repo_root = args.repo_root.resolve()
    web_root = repo_root / "apps" / "web"
    catalogue_page_path = (
        args.catalogue_page.resolve()
        if args.catalogue_page is not None
        else web_root / "local-data" / "catalogue-pages" / "scissors-op-page.png"
    )
    if not catalogue_page_path.is_file():
        raise FileNotFoundError(
            f"Missing catalogue page: {catalogue_page_path}. Extract the supplied Wave 3 source-page ZIP at the repository root."
        )

    originals_dir = web_root / "local-data" / "catalogue-originals" / "scissors-wave3"
    review_dir = web_root / "local-data" / "catalogue-review" / "scissors-wave3"
    output_dir = web_root / "public" / "media" / "catalogue-preview" / "scissors"
    originals_dir.mkdir(parents=True, exist_ok=True)
    review_dir.mkdir(parents=True, exist_ok=True)
    output_dir.mkdir(parents=True, exist_ok=True)

    with Image.open(catalogue_page_path) as opened:
        page = ImageOps.exif_transpose(opened).convert("RGB")
    bodies = {
        finish_key: catalogue_body(page, finish_key)
        for finish_key in ("super-cut", "tungsten-carbide")
    }

    records: list[dict[str, object]] = []
    normalized_sources: dict[str, Image.Image] = {}
    for source in EXACT_SOURCES:
        original_path = originals_dir / f"{source.key}.jpg"
        resolved_url = source.image_url
        if not original_path.exists() or args.force:
            payload, resolved_url = fetch_bytes(source.image_url)
            original_path.write_bytes(payload)
        with Image.open(original_path) as opened:
            supplier = ImageOps.exif_transpose(opened).convert("RGB")
        normalized_sources[source.key] = normalize_exact_photo(supplier)
        records.append(
            {
                "direction": source.direction,
                "pointStyle": source.point_style,
                "sourcePageUrl": SUPPLIER_PAGE,
                "requestedImageUrl": source.image_url,
                "resolvedImageUrl": resolved_url,
                "originalPath": str(original_path.relative_to(repo_root)).replace("\\", "/"),
            }
        )

    prepared: list[tuple[dict[str, object], Image.Image, Path]] = []
    for finish_key, finish_label, prefix in FINISHES:
        for source in EXACT_SOURCES:
            asset_id = (
                f"scissors-operating-{finish_key}-{source.direction}-{source.point_style}"
            )
            exact = normalized_sources[source.key]
            if finish_key == "regular":
                image = exact
                method = "exact supplier photograph"
            else:
                tip = extract_tip_detail(exact)
                image = make_montage(bodies[finish_key], tip)
                method = "client catalogue finish body plus exact supplier tip inset"

            sizes = ("12 cm", "14 cm", "17 cm")
            codes = [
                f"{prefix}-{suffix}"
                for suffix in POINT_SUFFIXES[source.point_style][source.direction]
            ]
            sizes_and_codes = [f"{code} ({size})" for code, size in zip(codes, sizes)]
            prepared.append(
                (
                    {
                        "assetId": asset_id,
                        "finish": finish_label,
                        "direction": source.direction,
                        "pointStyle": POINT_LABELS[source.point_style],
                        "codes": sizes_and_codes,
                        "method": method,
                    },
                    image,
                    output_dir / asset_id,
                )
            )

    generated: list[dict[str, object]] = []
    workers = min(8, max(1, len(prepared)))
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [
            executor.submit(save_derivatives, image, stem, args.force)
            for _, image, stem in prepared
        ]
        for (record, _, _), future in zip(prepared, futures):
            generated.append({**record, **future.result()})

    contact_sheet = review_dir / "scissors-wave3-operating-contact.png"
    make_contact_sheet(output_dir, contact_sheet)
    report = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "cataloguePage": str(catalogue_page_path.relative_to(repo_root)).replace("\\", "/"),
        "supplierPage": SUPPLIER_PAGE,
        "sources": records,
        "generated": generated,
        "contactSheet": str(contact_sheet.relative_to(repo_root)).replace("\\", "/"),
    }
    report_path = review_dir / "scissors-wave3-operating-report.json"
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(f"Generated {len(generated)} Operating Scissors configurations")
    print(f"Derivatives: {len(generated) * 2} files")
    print(f"Output: {output_dir}")
    print(f"Contact sheet: {contact_sheet}")
    print(f"Report: {report_path}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)
