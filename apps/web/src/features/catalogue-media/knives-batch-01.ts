import type { CatalogueMediaAsset } from "./types";

const SOURCE_LEDGER_BASE_URL =
  "https://github.com/manbtd0-cloud/RosaMedical/blob/preview/knives-image-batch-01/docs/review/catalogue-media/knives-batch-01-sources.md";

function catalogueCandidate({
  id,
  cataloguePage,
  reuseScope,
  processingNotes
}: {
  id: string;
  cataloguePage: "1" | "2" | "3";
  reuseScope: string;
  processingNotes: string;
}): CatalogueMediaAsset {
  return {
    id,
    familySlug: "knives",
    configurationKey: id,
    avifPath: `/media/catalogue-preview/knives/${id}.avif`,
    webpPath: `/media/catalogue-preview/knives/${id}.webp`,
    sourcePageUrl: `${SOURCE_LEDGER_BASE_URL}#client-catalogue-page-${cataloguePage}`,
    matchGrade: "strong-match",
    rightsMode: "preferred-safe",
    background: "transparent",
    processingNotes,
    orientationNotes:
      "The complete catalogue instrument or printed instrument set is isolated without fabricated geometry and centered on a transparent 1800 px canvas. Single instruments are rotated proportionally so the working end points toward the upper-right where practical. Multi-part catalogue presentations retain their printed relative arrangement so size and interchangeable-tip distinctions remain visible.",
    reuseScope,
    reviewStatus: "candidate"
  };
}

export const KNIVES_BATCH_01_MEDIA = [
  catalogueCandidate({
    id: "knives-number-3",
    cataloguePage: "1",
    reuseScope:
      "Scalpel Handle No. 3, catalogue codes 18-0103 and 18-0103S, length 12.0 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 1. The complete No. 3 handle illustration was isolated, cleaned, rotated, and proportionally scaled without changing the blade fitting or handle geometry."
  }),
  catalogueCandidate({
    id: "knives-number-4",
    cataloguePage: "1",
    reuseScope:
      "Scalpel Handle No. 4, catalogue codes 18-0104 and 18-0104S, length 13.0 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 1. The complete No. 4 handle illustration was isolated, cleaned, rotated, and proportionally scaled without changing the blade fitting or handle geometry."
  }),
  catalogueCandidate({
    id: "knives-number-7",
    cataloguePage: "1",
    reuseScope: "Scalpel Handle No. 7, catalogue code 18-0107, length 16.0 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 1. The complete No. 7 handle illustration was isolated, cleaned, rotated, and proportionally scaled without generating or reshaping geometry."
  }),
  catalogueCandidate({
    id: "knives-micro-surgery-handle",
    cataloguePage: "1",
    reuseScope:
      "Micro Surgery Handle, catalogue code 18-0202, length 15.5 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 1. The complete micro-surgery handle illustration was isolated, cleaned, rotated, and proportionally scaled without changing the threaded end or grip geometry."
  }),
  catalogueCandidate({
    id: "knives-number-3-long",
    cataloguePage: "1",
    reuseScope:
      "Scalpel Handle No. 3 Long, catalogue code 18-0103L, length 21.0 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 1. The complete long No. 3 handle was isolated and proportionally composed without shortening, stretching, or altering its straight body."
  }),
  catalogueCandidate({
    id: "knives-number-3-long-curved",
    cataloguePage: "1",
    reuseScope:
      "Scalpel Handle No. 3 Long Curved, catalogue code 18-0113L, length 20.5 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 1. The complete long curved No. 3 handle was isolated and proportionally composed without fabricating or exaggerating its listed curvature."
  }),
  catalogueCandidate({
    id: "knives-number-4-long",
    cataloguePage: "1",
    reuseScope:
      "Scalpel Handle No. 4 Long, catalogue code 18-0104L, length 21.0 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 1. The complete long No. 4 handle was isolated and proportionally composed without shortening, stretching, or changing its fitting geometry."
  }),
  catalogueCandidate({
    id: "knives-liston",
    cataloguePage: "1",
    reuseScope:
      "Liston Knife, catalogue codes 18-0401 through 18-0404, lengths 13.0 cm through 21.5 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 1. The visible Liston configuration represents the four listed size-only codes. The complete catalogue illustration was isolated without altering blade or handle geometry."
  }),
  catalogueCandidate({
    id: "knives-number-9",
    cataloguePage: "2",
    reuseScope: "Scalpel Handle No. 9, catalogue code 18-0109, length 12.0 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 2. The complete No. 9 handle illustration was isolated, cleaned, rotated, and proportionally scaled without generating or reshaping geometry."
  }),
  catalogueCandidate({
    id: "knives-hexagonal",
    cataloguePage: "2",
    reuseScope:
      "Hexagonal Scalpel Handle, catalogue code 18-0646, length 16.0 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 2. The complete hexagonal handle illustration was isolated, cleaned, rotated, and proportionally scaled without changing its grip or fitting geometry."
  }),
  catalogueCandidate({
    id: "knives-round-straight",
    cataloguePage: "2",
    reuseScope:
      "Round Straight Scalpel Handle, catalogue code 18-0644, length 14.5 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 2. The complete straight round handle illustration was isolated and proportionally composed without changing direction or geometry."
  }),
  catalogueCandidate({
    id: "knives-round-curved",
    cataloguePage: "2",
    reuseScope:
      "Round Curved Scalpel Handle, catalogue code 18-0645, length 14.5 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 2. The complete curved round handle illustration was isolated and proportionally composed without generating, straightening, or exaggerating curvature."
  }),
  catalogueCandidate({
    id: "knives-long-handle",
    cataloguePage: "2",
    reuseScope:
      "Adjustable Long Handle, catalogue code 18-0647, length 16.0 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 2. The complete long adjustable handle presentation, including its printed detachable head, was isolated without altering component geometry or relative identity."
  }),
  catalogueCandidate({
    id: "knives-short-handle",
    cataloguePage: "2",
    reuseScope:
      "Adjustable Short Handle, catalogue code 18-0648, length 10.0 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 2. The complete short adjustable handle presentation, including its printed detachable head, was isolated without altering component geometry or relative identity."
  }),
  catalogueCandidate({
    id: "knives-saalfeld-comedo-extractor",
    cataloguePage: "3",
    reuseScope:
      "Saalfeld Comedo Extractor, catalogue code 19-0400, length 14.0 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 3. The Saalfeld full-body illustration and printed working-end details were isolated together without replacing or reshaping either end."
  }),
  catalogueCandidate({
    id: "knives-fox-lupus-curettes",
    cataloguePage: "3",
    reuseScope:
      "Fox Lupus Curettes, catalogue codes 19-0503 through 19-0506, working-end sizes 3 mm through 6 mm, length 14.0 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 3. The Fox full-body illustration and all four exact catalogue working-end sizes were retained as one grouped size-only configuration."
  }),
  catalogueCandidate({
    id: "knives-keyes-dermal-punches",
    cataloguePage: "3",
    reuseScope:
      "Keyes Dermal Punches, catalogue codes 19-0702 through 19-0708, diameters 2 mm through 8 mm, length 10.0 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 3. The Keyes punch body and all seven exact printed diameter references were retained as one grouped size-only configuration."
  }),
  catalogueCandidate({
    id: "knives-keyes-dermal-punch-set",
    cataloguePage: "3",
    reuseScope:
      "Keyes Dermal Punch Set with six interchangeable tips, handle, and rack, catalogue code 19-0800, length 19.0 cm.",
    processingNotes:
      "Client-supplied Knives catalogue page 3. The complete photographed Keyes set was isolated as printed without inventing missing components, rearranging tips, or changing the rack geometry."
  })
] as const satisfies readonly CatalogueMediaAsset[];
