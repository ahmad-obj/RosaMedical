import type {
  CatalogueMediaAsset,
  CatalogueMediaMatchGrade
} from "./types";

const SOURCE_LEDGER_BASE_URL =
  "https://github.com/manbtd0-cloud/RosaMedical/blob/preview/scissors-image-batch-01/docs/review/catalogue-media/scissors-batch-01-sources.md";

function pageOneCatalogueCandidate(
  id: string,
  direction: "straight" | "curved",
  reuseScope: string
): CatalogueMediaAsset {
  const matchGrade: CatalogueMediaMatchGrade =
    direction === "straight" ? "strong-match" : "acceptable-similar";

  return {
    id,
    familySlug: "scissors",
    configurationKey: id,
    avifPath: `/media/catalogue-preview/scissors/${id}.avif`,
    webpPath: `/media/catalogue-preview/scissors/${id}.webp`,
    sourcePageUrl: `${SOURCE_LEDGER_BASE_URL}#client-catalogue-page-1`,
    matchGrade,
    rightsMode: "preferred-safe",
    background: "transparent",
    processingNotes:
      "Client-supplied Scissors catalogue page 1. The finish-specific full instrument was combined with the catalogue's direction-specific tip inset. No instrument geometry was generated, stretched, or reshaped.",
    orientationNotes:
      "The full instrument and tip inset were rotated so the working end points toward the upper-right. Scaling remained proportional and the complete instrument stays inside the 1440 px safe region.",
    reuseScope,
    reviewStatus: "candidate"
  };
}

function waveTwoCatalogueCandidate(
  id: string,
  direction: "straight" | "curved",
  reuseScope: string
): CatalogueMediaAsset {
  const matchGrade: CatalogueMediaMatchGrade =
    direction === "straight" ? "strong-match" : "acceptable-similar";

  return {
    id,
    familySlug: "scissors",
    configurationKey: id,
    avifPath: `/media/catalogue-preview/scissors/${id}.avif`,
    webpPath: `/media/catalogue-preview/scissors/${id}.webp`,
    sourcePageUrl: `${SOURCE_LEDGER_BASE_URL}#client-catalogue-pages-2-and-3`,
    matchGrade,
    rightsMode: "preferred-safe",
    background: "transparent",
    processingNotes:
      "Client-supplied Scissors catalogue page 2 for Mayo or page 3 for Metzenbaum. The exact finish-specific instrument body was isolated from the catalogue, cleaned, rotated, and proportionally scaled. The catalogue does not provide a separate full-body photograph for every listed direction, so curved configurations remain explicit review candidates.",
    orientationNotes:
      "The extracted instrument was rotated so the working end points toward the upper-right, then centered on a transparent 1800 px canvas without non-uniform scaling or geometry changes.",
    reuseScope,
    reviewStatus: "candidate"
  };
}

export const SCISSORS_BATCH_01_MEDIA = [
  pageOneCatalogueCandidate(
    "scissors-iris-regular-straight",
    "straight",
    "Iris Regular Straight, catalogue code 04-0901, size 10.5 cm."
  ),
  pageOneCatalogueCandidate(
    "scissors-iris-regular-curved",
    "curved",
    "Iris Regular Curved, catalogue code 04-0911, size 10.5 cm."
  ),
  pageOneCatalogueCandidate(
    "scissors-iris-super-cut-straight",
    "straight",
    "Iris Super Cut Straight, catalogue code 05-0901, size 10.5 cm."
  ),
  pageOneCatalogueCandidate(
    "scissors-iris-super-cut-curved",
    "curved",
    "Iris Super Cut Curved, catalogue code 05-0911, size 10.5 cm."
  ),
  pageOneCatalogueCandidate(
    "scissors-iris-tungsten-carbide-straight",
    "straight",
    "Iris Tungsten Carbide Straight, catalogue code 06-0901, size 10.5 cm."
  ),
  pageOneCatalogueCandidate(
    "scissors-iris-tungsten-carbide-curved",
    "curved",
    "Iris Tungsten Carbide Curved, catalogue code 06-0911, size 10.5 cm."
  ),
  pageOneCatalogueCandidate(
    "scissors-stevens-regular-straight",
    "straight",
    "Stevens Regular Straight, catalogue codes 04-0800 and 04-0802, sizes 9.5 cm and 11.5 cm."
  ),
  pageOneCatalogueCandidate(
    "scissors-stevens-regular-curved",
    "curved",
    "Stevens Regular Curved, catalogue codes 04-0810 and 04-0812, sizes 9.5 cm and 11.5 cm."
  ),
  pageOneCatalogueCandidate(
    "scissors-stevens-super-cut-straight",
    "straight",
    "Stevens Super Cut Straight, catalogue codes 05-0800 and 05-0802, sizes 9.5 cm and 11.5 cm."
  ),
  pageOneCatalogueCandidate(
    "scissors-stevens-super-cut-curved",
    "curved",
    "Stevens Super Cut Curved, catalogue codes 05-0810 and 05-0812, sizes 9.5 cm and 11.5 cm."
  ),
  pageOneCatalogueCandidate(
    "scissors-stevens-tungsten-carbide-straight",
    "straight",
    "Stevens Tungsten Carbide Straight, catalogue codes 06-0800 and 06-0802, sizes 9.5 cm and 11.5 cm."
  ),
  pageOneCatalogueCandidate(
    "scissors-stevens-tungsten-carbide-curved",
    "curved",
    "Stevens Tungsten Carbide Curved, catalogue codes 06-0810 and 06-0812, sizes 9.5 cm and 11.5 cm."
  ),
  waveTwoCatalogueCandidate(
    "scissors-mayo-regular-straight",
    "straight",
    "Mayo Regular Straight, catalogue codes 04-0401, 04-0402, 04-0403, and 04-0404, sizes 14.5 cm, 17 cm, 20 cm, and 23 cm."
  ),
  waveTwoCatalogueCandidate(
    "scissors-mayo-regular-curved",
    "curved",
    "Mayo Regular Curved, catalogue codes 04-0411, 04-0412, 04-0413, and 04-0414, sizes 14.5 cm, 17 cm, 20 cm, and 23 cm."
  ),
  waveTwoCatalogueCandidate(
    "scissors-mayo-super-cut-straight",
    "straight",
    "Mayo Super Cut Straight, catalogue codes 05-0401, 05-0402, 05-0403, and 05-0404, sizes 14.5 cm, 17 cm, 20 cm, and 23 cm."
  ),
  waveTwoCatalogueCandidate(
    "scissors-mayo-super-cut-curved",
    "curved",
    "Mayo Super Cut Curved, catalogue codes 05-0411, 05-0412, 05-0413, and 05-0414, sizes 14.5 cm, 17 cm, 20 cm, and 23 cm."
  ),
  waveTwoCatalogueCandidate(
    "scissors-mayo-tungsten-carbide-straight",
    "straight",
    "Mayo Tungsten Carbide Straight, catalogue codes 06-0401, 06-0402, 06-0403, and 06-0404, sizes 14.5 cm, 17 cm, 20 cm, and 23 cm."
  ),
  waveTwoCatalogueCandidate(
    "scissors-mayo-tungsten-carbide-curved",
    "curved",
    "Mayo Tungsten Carbide Curved, catalogue codes 06-0411, 06-0412, 06-0413, and 06-0414, sizes 14.5 cm, 17 cm, 20 cm, and 23 cm."
  ),
  waveTwoCatalogueCandidate(
    "scissors-metzenbaum-regular-straight",
    "straight",
    "Metzenbaum Regular Straight, catalogue codes 04-1901, 04-1902, 04-1909, 04-1903, 04-1904, and 04-1905, sizes 11 cm, 14 cm, 16 cm, 18 cm, 20 cm, and 23 cm."
  ),
  waveTwoCatalogueCandidate(
    "scissors-metzenbaum-regular-curved",
    "curved",
    "Metzenbaum Regular Curved, catalogue codes 04-1911, 04-1912, 04-1919, 04-1913, 04-1914, and 04-1915, sizes 11 cm, 14 cm, 16 cm, 18 cm, 20 cm, and 23 cm."
  ),
  waveTwoCatalogueCandidate(
    "scissors-metzenbaum-super-cut-straight",
    "straight",
    "Metzenbaum Super Cut Straight, catalogue codes 05-1901, 05-1902, 05-1909, 05-1903, 05-1904, and 05-1905, sizes 11 cm, 14 cm, 16 cm, 18 cm, 20 cm, and 23 cm."
  ),
  waveTwoCatalogueCandidate(
    "scissors-metzenbaum-super-cut-curved",
    "curved",
    "Metzenbaum Super Cut Curved, catalogue codes 05-1911, 05-1912, 05-1919, 05-1913, 05-1914, and 05-1915, sizes 11 cm, 14 cm, 16 cm, 18 cm, 20 cm, and 23 cm."
  ),
  waveTwoCatalogueCandidate(
    "scissors-metzenbaum-tungsten-carbide-straight",
    "straight",
    "Metzenbaum Tungsten Carbide Straight, catalogue codes 06-1901, 06-1902, 06-1909, 06-1903, 06-1904, and 06-1905, sizes 11 cm, 14 cm, 16 cm, 18 cm, 20 cm, and 23 cm."
  ),
  waveTwoCatalogueCandidate(
    "scissors-metzenbaum-tungsten-carbide-curved",
    "curved",
    "Metzenbaum Tungsten Carbide Curved, catalogue codes 06-1911, 06-1912, 06-1919, 06-1913, 06-1914, and 06-1915, sizes 11 cm, 14 cm, 16 cm, 18 cm, 20 cm, and 23 cm."
  )
] as const satisfies readonly CatalogueMediaAsset[];
