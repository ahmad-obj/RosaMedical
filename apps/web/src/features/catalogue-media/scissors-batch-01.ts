import type {
  CatalogueMediaAsset,
  CatalogueMediaMatchGrade
} from "./types";

const SOURCE_LEDGER_URL =
  "https://github.com/manbtd0-cloud/RosaMedical/blob/preview/scissors-image-batch-01/docs/review/catalogue-media/scissors-batch-01-sources.md#client-catalogue-page-1";

function catalogueCandidate(
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
    sourcePageUrl: SOURCE_LEDGER_URL,
    matchGrade,
    rightsMode: "preferred-safe",
    background: "transparent",
    processingNotes:
      "Client-supplied Scissors catalogue page 1. The finish-specific full instrument was combined with the catalogue's exact direction-specific tip inset. No instrument geometry was generated, stretched, or reshaped.",
    orientationNotes:
      "The full instrument and tip inset were rotated 180 degrees so the working end points right. Scaling remained proportional and the complete instrument stays inside the 1440 px safe region.",
    reuseScope,
    reviewStatus: "candidate"
  };
}

export const SCISSORS_BATCH_01_MEDIA = [
  catalogueCandidate(
    "scissors-iris-regular-straight",
    "straight",
    "Iris Regular Straight, catalogue codes 04-0800 and 04-0802, sizes 9.5 cm and 11.5 cm."
  ),
  catalogueCandidate(
    "scissors-iris-regular-curved",
    "curved",
    "Iris Regular Curved, catalogue codes 04-0810 and 04-0812, sizes 9.5 cm and 11.5 cm."
  ),
  catalogueCandidate(
    "scissors-iris-super-cut-straight",
    "straight",
    "Iris Super Cut Straight, catalogue codes 05-0800 and 05-0802, sizes 9.5 cm and 11.5 cm."
  ),
  catalogueCandidate(
    "scissors-iris-super-cut-curved",
    "curved",
    "Iris Super Cut Curved, catalogue codes 05-0810 and 05-0812, sizes 9.5 cm and 11.5 cm."
  ),
  catalogueCandidate(
    "scissors-iris-tungsten-carbide-straight",
    "straight",
    "Iris Tungsten Carbide Straight, catalogue codes 06-0800 and 06-0802, sizes 9.5 cm and 11.5 cm."
  ),
  catalogueCandidate(
    "scissors-iris-tungsten-carbide-curved",
    "curved",
    "Iris Tungsten Carbide Curved, catalogue codes 06-0810 and 06-0812, sizes 9.5 cm and 11.5 cm."
  ),
  catalogueCandidate(
    "scissors-stevens-regular-straight",
    "straight",
    "Stevens Regular Straight, catalogue code 04-0901, size 10.5 cm."
  ),
  catalogueCandidate(
    "scissors-stevens-regular-curved",
    "curved",
    "Stevens Regular Curved, catalogue code 04-0911, size 10.5 cm."
  ),
  catalogueCandidate(
    "scissors-stevens-super-cut-straight",
    "straight",
    "Stevens Super Cut Straight, catalogue code 05-0901, size 10.5 cm."
  ),
  catalogueCandidate(
    "scissors-stevens-super-cut-curved",
    "curved",
    "Stevens Super Cut Curved, catalogue code 05-0911, size 10.5 cm."
  ),
  catalogueCandidate(
    "scissors-stevens-tungsten-carbide-straight",
    "straight",
    "Stevens Tungsten Carbide Straight, catalogue code 06-0901, size 10.5 cm."
  ),
  catalogueCandidate(
    "scissors-stevens-tungsten-carbide-curved",
    "curved",
    "Stevens Tungsten Carbide Curved, catalogue code 06-0911, size 10.5 cm."
  )
] as const satisfies readonly CatalogueMediaAsset[];
