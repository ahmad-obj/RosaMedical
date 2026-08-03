import type {
  CatalogueMediaAsset,
  CatalogueMediaMatchGrade
} from "./types";

const SOURCE_LEDGER_BASE_URL =
  "https://github.com/manbtd0-cloud/RosaMedical/blob/preview/cutters-image-batch-01/docs/review/catalogue-media/cutters-batch-01-sources.md";

function catalogueCandidate({
  id,
  cataloguePage,
  reuseScope,
  processingNotes,
  matchGrade = "strong-match"
}: {
  id: string;
  cataloguePage: "1" | "2" | "3";
  reuseScope: string;
  processingNotes: string;
  matchGrade?: CatalogueMediaMatchGrade;
}): CatalogueMediaAsset {
  return {
    id,
    familySlug: "cutters",
    configurationKey: id,
    avifPath: `/media/catalogue-preview/cutters/${id}.avif`,
    webpPath: `/media/catalogue-preview/cutters/${id}.webp`,
    sourcePageUrl: `${SOURCE_LEDGER_BASE_URL}#client-catalogue-page-${cataloguePage}`,
    matchGrade,
    rightsMode: "preferred-safe",
    background: "transparent",
    processingNotes,
    orientationNotes:
      "The complete instrument is centered on a transparent 1800 px canvas with its working end pointing toward the upper-right. Scaling remains proportional and the instrument stays inside the 1420 px safe region. Catalogue working-end schematics are retained as secondary insets only when needed to distinguish listed directions.",
    reuseScope,
    reviewStatus: "candidate"
  };
}

export const CUTTERS_BATCH_01_MEDIA = [
  catalogueCandidate({
    id: "cutters-liston-straight",
    cataloguePage: "1",
    reuseScope:
      "Liston Straight, catalogue codes 36-5101 through 36-5104, lengths 14.0 cm through 22.0 cm.",
    matchGrade: "acceptable-similar",
    processingNotes:
      "Client-supplied Cutters catalogue page 1 provides one full-body Liston illustration for both Straight and Curved code groups without separate labelled full-body direction images. The catalogue body was isolated and reused without generating or reshaping the cutting end."
  }),
  catalogueCandidate({
    id: "cutters-liston-curved",
    cataloguePage: "1",
    reuseScope:
      "Liston Curved, catalogue codes 36-5111 through 36-5114, lengths 14.0 cm through 22.0 cm.",
    matchGrade: "acceptable-similar",
    processingNotes:
      "Client-supplied Cutters catalogue page 1 provides one full-body Liston illustration for both Straight and Curved code groups without separate labelled full-body direction images. The catalogue body was isolated and reused without fabricating curvature or changing geometry."
  }),
  catalogueCandidate({
    id: "cutters-cleveland",
    cataloguePage: "1",
    reuseScope:
      "Cleveland, catalogue codes 36-5401 and 36-5402, lengths 15.0 cm and 17.0 cm.",
    processingNotes:
      "Client-supplied Cutters catalogue page 1. The Cleveland full-body illustration and working-end schematic were isolated, cleaned, rotated, and proportionally scaled without generating, stretching, or reshaping instrument geometry."
  }),
  catalogueCandidate({
    id: "cutters-bohler-straight",
    cataloguePage: "1",
    reuseScope: "Bohler Straight, catalogue code 36-5501, length 15.0 cm.",
    processingNotes:
      "Client-supplied Cutters catalogue page 1. The Bohler full-body illustration was isolated, cleaned, rotated, and proportionally scaled without generating, stretching, or reshaping instrument geometry."
  }),
  catalogueCandidate({
    id: "cutters-bohler-curved",
    cataloguePage: "1",
    reuseScope: "Bohler Curved, catalogue code 36-5511, length 15.0 cm.",
    matchGrade: "acceptable-similar",
    processingNotes:
      "Client-supplied Cutters catalogue page 1. The shared Bohler full-body illustration is paired with the catalogue curved working-end schematic. No curved full body was generated and no instrument geometry was reshaped."
  }),
  catalogueCandidate({
    id: "cutters-mc-indoe",
    cataloguePage: "2",
    reuseScope: "Mc Indoe, catalogue code 36-5600, length 17.5 cm.",
    processingNotes:
      "Client-supplied Cutters catalogue page 2. The Mc Indoe full-body illustration was isolated, cleaned, rotated, and proportionally scaled without generating, stretching, or reshaping instrument geometry."
  }),
  catalogueCandidate({
    id: "cutters-ruskin-liston-straight",
    cataloguePage: "2",
    reuseScope:
      "Ruskin-Liston Straight, catalogue code 36-5701, length 18.5 cm.",
    processingNotes:
      "Client-supplied Cutters catalogue page 2. The shared Ruskin-Liston full-body illustration is paired with the catalogue straight working-end schematic. No instrument geometry was generated or reshaped."
  }),
  catalogueCandidate({
    id: "cutters-ruskin-liston-curved",
    cataloguePage: "2",
    reuseScope:
      "Ruskin-Liston Curved, catalogue code 36-5711, length 18.5 cm.",
    matchGrade: "acceptable-similar",
    processingNotes:
      "Client-supplied Cutters catalogue page 2. The shared Ruskin-Liston full-body illustration is paired with the catalogue curved working-end schematic. No curved full body was generated and no instrument geometry was reshaped."
  }),
  catalogueCandidate({
    id: "cutters-ruskin-rowland-straight",
    cataloguePage: "2",
    reuseScope:
      "Ruskin-Rowland Straight, catalogue code 36-5801, length 17.0 cm.",
    processingNotes:
      "Client-supplied Cutters catalogue page 2. The shared Ruskin-Rowland full-body illustration is paired with the catalogue straight working-end schematic. No instrument geometry was generated or reshaped."
  }),
  catalogueCandidate({
    id: "cutters-ruskin-rowland-angled-to-side",
    cataloguePage: "2",
    reuseScope:
      "Ruskin-Rowland Angled to side, catalogue code 36-5811, length 17.0 cm.",
    matchGrade: "acceptable-similar",
    processingNotes:
      "Client-supplied Cutters catalogue page 2. The shared Ruskin-Rowland full-body illustration is paired with the catalogue angled-to-side working-end schematic. No angled full body was generated and no instrument geometry was reshaped."
  }),
  catalogueCandidate({
    id: "cutters-stille-liston-straight",
    cataloguePage: "3",
    reuseScope:
      "Stille-Liston Straight, catalogue codes 36-5901 and 36-5902, lengths 23.0 cm and 27.0 cm.",
    processingNotes:
      "Client-supplied Cutters catalogue page 3. The shared Stille-Liston full-body illustration is paired with the catalogue straight working-end schematic. No instrument geometry was generated or reshaped."
  }),
  catalogueCandidate({
    id: "cutters-stille-liston-curved",
    cataloguePage: "3",
    reuseScope:
      "Stille-Liston Curved, catalogue codes 36-5911 and 36-5912, lengths 23.0 cm and 27.0 cm.",
    matchGrade: "acceptable-similar",
    processingNotes:
      "Client-supplied Cutters catalogue page 3. The shared Stille-Liston full-body illustration is paired with the catalogue curved working-end schematic. No curved full body was generated and no instrument geometry was reshaped."
  }),
  catalogueCandidate({
    id: "cutters-stille-liston-36-6000",
    cataloguePage: "3",
    reuseScope: "Stille-Liston, catalogue code 36-6000, length 27.0 cm.",
    processingNotes:
      "Client-supplied Cutters catalogue page 3. The distinct 36-6000 Stille-Liston full-body illustration was isolated, cleaned, rotated, and proportionally scaled without generating, stretching, or reshaping instrument geometry."
  })
] as const satisfies readonly CatalogueMediaAsset[];
