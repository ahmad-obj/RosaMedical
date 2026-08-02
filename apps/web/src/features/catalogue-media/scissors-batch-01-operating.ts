import type { CatalogueMediaAsset } from "./types";

const OPERATING_SOURCE_PAGE =
  "https://www.mpmmedicalsupply.com/products/operating-scissors";
const OPERATING_LEDGER_PAGE =
  "https://github.com/manbtd0-cloud/RosaMedical/blob/preview/scissors-image-batch-01/docs/review/catalogue-media/scissors-batch-01-wave3-operating.md#client-catalogue-page-2--operating";

const DIRECTIONS = ["straight", "curved"] as const;
const POINT_STYLES = ["sharp-sharp", "sharp-blunt", "blunt-blunt"] as const;
const FINISHES = [
  { key: "regular", prefix: "04", label: "Regular" },
  { key: "super-cut", prefix: "05", label: "Super Cut" },
  { key: "tungsten-carbide", prefix: "06", label: "Tungsten Carbide" }
] as const;

type OperatingDirection = (typeof DIRECTIONS)[number];
type OperatingPointStyle = (typeof POINT_STYLES)[number];
type OperatingFinish = (typeof FINISHES)[number];

const POINT_LABELS: Record<OperatingPointStyle, string> = {
  "sharp-sharp": "Sharp/Sharp",
  "sharp-blunt": "Sharp/Blunt",
  "blunt-blunt": "Blunt/Blunt"
};

const SOURCE_IMAGES: Record<
  `${OperatingDirection}-${OperatingPointStyle}`,
  string
> = {
  "straight-blunt-blunt":
    "https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-straight-blunt-blunt_700x700.jpg?v=1537150721",
  "straight-sharp-blunt":
    "https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-straight-sharp-blunt_700x700.jpg?v=1537150736",
  "straight-sharp-sharp":
    "https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-straight-sharp-sharp_700x700.jpg?v=1537150751",
  "curved-blunt-blunt":
    "https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-curved-blunt-blunt_700x700.jpg?v=1537150765",
  "curved-sharp-blunt":
    "https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-curved-sharp-blunt_700x700.jpg?v=1537150810",
  "curved-sharp-sharp":
    "https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-curved-sharp-sharp_700x700.jpg?v=1537150798"
};

const CODE_SUFFIXES: Record<
  OperatingPointStyle,
  Record<OperatingDirection, readonly string[]>
> = {
  "sharp-sharp": {
    straight: ["0121", "0101", "0102"],
    curved: ["0131", "0111", "0112"]
  },
  "sharp-blunt": {
    straight: ["0221", "0201", "0202"],
    curved: ["0231", "0211", "0212"]
  },
  "blunt-blunt": {
    straight: ["0321", "0301", "0302"],
    curved: ["0331", "0311", "0312"]
  }
};

const SIZES = ["12 cm", "14 cm", "17 cm"] as const;

function operatingAsset(
  finish: OperatingFinish,
  direction: OperatingDirection,
  pointStyle: OperatingPointStyle
): CatalogueMediaAsset {
  const id = `scissors-operating-${finish.key}-${direction}-${pointStyle}`;
  const sourceImage = SOURCE_IMAGES[`${direction}-${pointStyle}`];
  const codes = CODE_SUFFIXES[pointStyle][direction].map(
    (suffix) => `${finish.prefix}-${suffix}`
  );
  const reuseScope = `Operating Scissors ${finish.label} ${
    direction === "straight" ? "Straight" : "Curved"
  } ${POINT_LABELS[pointStyle]}, catalogue codes ${codes.join(", ")}, sizes ${SIZES.join(", ")}.`;

  if (finish.key === "regular") {
    return {
      id,
      familySlug: "scissors",
      configurationKey: id,
      avifPath: `/media/catalogue-preview/scissors/${id}.avif`,
      webpPath: `/media/catalogue-preview/scissors/${id}.webp`,
      sourcePageUrl: OPERATING_SOURCE_PAGE,
      originalImageUrl: sourceImage,
      matchGrade: "strong-match",
      rightsMode: "supplier-fallback",
      background: "transparent",
      processingNotes:
        "Exact supplier photograph for the Operating Scissors direction and tip configuration. The white background is removed, then the complete instrument is rotated and proportionally scaled without changing blade, point, shank, joint, or handle geometry.",
      orientationNotes:
        "The working end points toward the upper-right and the complete instrument remains inside the 1440 px safe region on a transparent 1800 px canvas.",
      reuseScope,
      reviewStatus: "candidate"
    };
  }

  return {
    id,
    familySlug: "scissors",
    configurationKey: id,
    avifPath: `/media/catalogue-preview/scissors/${id}.avif`,
    webpPath: `/media/catalogue-preview/scissors/${id}.webp`,
    sourcePageUrl: OPERATING_LEDGER_PAGE,
    originalImageUrl: sourceImage,
    matchGrade: "acceptable-similar",
    rightsMode: "preferred-safe",
    background: "transparent",
    processingNotes:
      "Client-supplied catalogue page 2 provides the exact finish-specific Operating Scissors body. The supplier photograph provides the exact direction and point-style tip detail. They are presented as a non-generative review montage; no blade, point, shank, joint, or handle geometry is fabricated or reshaped.",
    orientationNotes:
      "The finish-specific full body is centered with its working end toward the upper-right. A separate exact tip-detail inset identifies straight or curved and Sharp/Sharp, Sharp/Blunt, or Blunt/Blunt geometry.",
    reuseScope,
    reviewStatus: "candidate"
  };
}

export const SCISSORS_BATCH_01_OPERATING_MEDIA = FINISHES.flatMap((finish) =>
  POINT_STYLES.flatMap((pointStyle) =>
    DIRECTIONS.map((direction) =>
      operatingAsset(finish, direction, pointStyle)
    )
  )
) as readonly CatalogueMediaAsset[];
