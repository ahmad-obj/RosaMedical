import type {
  CatalogueMediaAsset,
  CatalogueMediaMatchGrade
} from "./types";

const SOURCE_LEDGER_BASE_URL =
  "https://github.com/manbtd0-cloud/RosaMedical/blob/preview/chisels-image-batch-01/docs/review/catalogue-media/chisels-batch-01-sources.md";

function catalogueCandidate(
  id: string,
  cataloguePage: "1" | "2" | "3",
  reuseScope: string,
  matchGrade: CatalogueMediaMatchGrade = "strong-match"
): CatalogueMediaAsset {
  const curvedStilleFallback = id === "chisels-stille-osteotomes-curved";

  return {
    id,
    familySlug: "chisels",
    configurationKey: id,
    avifPath: `/media/catalogue-preview/chisels/${id}.avif`,
    webpPath: `/media/catalogue-preview/chisels/${id}.webp`,
    sourcePageUrl: `${SOURCE_LEDGER_BASE_URL}#client-catalogue-page-${cataloguePage}`,
    matchGrade,
    rightsMode: "preferred-safe",
    background: "transparent",
    processingNotes: curvedStilleFallback
      ? "Client-supplied Chisels catalogue page 3. The catalogue provides one Stille osteotome full-body illustration for both straight and curved code groups. The body was isolated, cleaned, rotated, and proportionally scaled without fabricating a curved blade or changing geometry."
      : `Client-supplied Chisels catalogue page ${cataloguePage}. The exact catalogue illustration for this visible instrument configuration was isolated, cleaned, rotated, and proportionally scaled without generating, stretching, or reshaping instrument geometry.`,
    orientationNotes:
      "The complete instrument is centered on a transparent 1800 px canvas with its working end pointing toward the upper-right. Scaling remains proportional and the instrument stays inside the 1440 px safe region.",
    reuseScope,
    reviewStatus: "approved"
  };
}

export const CHISELS_BATCH_01_MEDIA = [
  catalogueCandidate(
    "chisels-osteotomes-13-5cm",
    "1",
    "Osteotomes 13.5 cm, catalogue codes 36-6301 through 36-6305, widths 4 mm through 12 mm."
  ),
  catalogueCandidate(
    "chisels-chisels-13-5cm",
    "1",
    "Chisels 13.5 cm, catalogue codes 36-6321 through 36-6325, widths 4 mm through 12 mm."
  ),
  catalogueCandidate(
    "chisels-gouges-13-5cm",
    "1",
    "Gouges 13.5 cm, catalogue codes 36-6331 through 36-6335, widths 4 mm through 12 mm."
  ),
  catalogueCandidate(
    "chisels-hoke-osteotomes-straight",
    "1",
    "Hoke Osteotomes 14 cm Straight, catalogue codes 36-6401 through 36-6407, widths 2 mm through 8 mm."
  ),
  catalogueCandidate(
    "chisels-hoke-osteotomes-curved",
    "1",
    "Hoke Osteotomes 14 cm Curved, catalogue codes 36-6411 through 36-6417, widths 2 mm through 8 mm."
  ),
  catalogueCandidate(
    "chisels-round-handle-gouges",
    "1",
    "Round Handle Gouges 14 cm, catalogue code 36-6500, width 6 mm."
  ),
  catalogueCandidate(
    "chisels-west-chisel",
    "2",
    "West Chisel 19 cm, catalogue code 36-6601, width 6 mm."
  ),
  catalogueCandidate(
    "chisels-west-gouge",
    "2",
    "West Gouge 19 cm, catalogue code 36-6621, width 6 mm."
  ),
  catalogueCandidate(
    "chisels-andrews-gouge",
    "2",
    "Andrews Gouge 16 cm, catalogue codes 36-6701 through 36-6705, widths 4 mm through 12 mm."
  ),
  catalogueCandidate(
    "chisels-alexander-osteotome",
    "2",
    "Alexander Osteotome 17.5 cm, catalogue codes 36-6801 through 36-6806, widths 4 mm through 14 mm."
  ),
  catalogueCandidate(
    "chisels-alexander-gouge",
    "2",
    "Alexander Gouge 17.5 cm, catalogue codes 36-6821 through 36-6826, widths 4 mm through 14 mm."
  ),
  catalogueCandidate(
    "chisels-alexander-chisel",
    "2",
    "Alexander Chisel 17.5 cm, catalogue codes 36-6831 through 36-6836, widths 4 mm through 14 mm."
  ),
  catalogueCandidate(
    "chisels-stille-osteotomes-straight",
    "3",
    "Stille Osteotomes Straight, catalogue codes 36-6901 through 36-6905 and 36-6940 through 36-6949, lengths 20 cm and 23 cm, widths 4 mm through 40 mm."
  ),
  catalogueCandidate(
    "chisels-stille-osteotomes-curved",
    "3",
    "Stille Osteotomes Curved, catalogue codes 36-6911 through 36-6915, length 20 cm, widths 10 mm through 25 mm.",
    "acceptable-similar"
  ),
  catalogueCandidate(
    "chisels-stille-gouges-straight",
    "3",
    "Stille Gouges Straight, catalogue codes 36-6921 through 36-6925 and 36-6950 through 36-6959, lengths 20 cm and 23 cm, widths 4 mm through 40 mm."
  ),
  catalogueCandidate(
    "chisels-stille-chisels-straight",
    "3",
    "Stille Chisels Straight, catalogue codes 36-6931 through 36-6935, length 20 cm, widths 10 mm through 25 mm."
  )
] as const satisfies readonly CatalogueMediaAsset[];
