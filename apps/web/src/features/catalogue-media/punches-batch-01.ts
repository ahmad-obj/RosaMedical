import type { CatalogueMediaAsset } from "./types";

const SOURCE_LEDGER_BASE_URL =
  "https://github.com/manbtd0-cloud/RosaMedical/blob/preview/punches-image-batch-01/docs/review/catalogue-media/punches-batch-01-sources.md";

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
    familySlug: "punches",
    configurationKey: id,
    avifPath: `/media/catalogue-preview/punches/${id}.avif`,
    webpPath: `/media/catalogue-preview/punches/${id}.webp`,
    sourcePageUrl: `${SOURCE_LEDGER_BASE_URL}#client-catalogue-page-${cataloguePage}`,
    matchGrade: "strong-match",
    rightsMode: "preferred-safe",
    background: "transparent",
    processingNotes,
    orientationNotes:
      "The complete catalogue instrument body and exact printed working-end detail are isolated without fabricated geometry and arranged on a transparent 1800 px canvas. Full-body instruments are scaled proportionally. Printed working-end details retain their catalogue direction and are not redrawn, straightened, curved, or combined across code groups.",
    reuseScope,
    reviewStatus: "candidate"
  };
}

export const PUNCHES_BATCH_01_MEDIA = [
  catalogueCandidate({
    id: "punches-yeoman-21-10",
    cataloguePage: "1",
    reuseScope:
      "Yeoman code group 21-10xx: 21-1001, 21-1002, and 21-1003 at 28.0 cm, 35.0 cm, and 42.0 cm.",
    processingNotes:
      "Client-supplied Punches catalogue page 1. The common Yeoman body and exact printed 21-10xx working-end presentation are retained together. The code-group label is conservative because the catalogue does not print a separate morphology name."
  }),
  catalogueCandidate({
    id: "punches-yeoman-21-11",
    cataloguePage: "1",
    reuseScope:
      "Yeoman code group 21-11xx: 21-1101, 21-1102, and 21-1103 at 28.0 cm, 35.0 cm, and 42.0 cm.",
    processingNotes:
      "Client-supplied Punches catalogue page 1. The common Yeoman body and exact printed 21-11xx working-end presentation are retained together without borrowing details from another code group."
  }),
  catalogueCandidate({
    id: "punches-yeoman-21-12",
    cataloguePage: "1",
    reuseScope:
      "Yeoman code group 21-12xx: 21-1201, 21-1202, and 21-1203 at 28.0 cm, 35.0 cm, and 42.0 cm.",
    processingNotes:
      "Client-supplied Punches catalogue page 1. The common Yeoman body and exact printed 21-12xx working-end presentation are retained together without changing its rectangular opening geometry."
  }),
  catalogueCandidate({
    id: "punches-yeoman-21-13",
    cataloguePage: "1",
    reuseScope:
      "Yeoman code group 21-13xx: 21-1301, 21-1302, and 21-1303 at 28.0 cm, 35.0 cm, and 42.0 cm.",
    processingNotes:
      "Client-supplied Punches catalogue page 1. The common Yeoman body and exact printed 21-13xx working-end presentation are retained together without generating missing jaw detail."
  }),
  catalogueCandidate({
    id: "punches-yeoman-21-14",
    cataloguePage: "2",
    reuseScope:
      "360-degree turnable Yeoman code group 21-14xx: 21-1401, 21-1402, and 21-1403 at 28.0 cm, 35.0 cm, and 40.0 cm.",
    processingNotes:
      "Client-supplied Punches catalogue page 2. The common turnable body and exact printed 21-14xx working-end detail are retained together."
  }),
  catalogueCandidate({
    id: "punches-yeoman-21-15",
    cataloguePage: "2",
    reuseScope:
      "360-degree turnable Yeoman code group 21-15xx: 21-1501, 21-1502, and 21-1503 at 28.0 cm, 35.0 cm, and 40.0 cm.",
    processingNotes:
      "Client-supplied Punches catalogue page 2. The common turnable body and exact printed 21-15xx working-end detail are retained together without changing its jaw direction."
  }),
  catalogueCandidate({
    id: "punches-turrel-21-16",
    cataloguePage: "2",
    reuseScope:
      "360-degree turnable Turrel code group 21-16xx: 21-1601, 21-1602, and 21-1603 at 28.0 cm, 35.0 cm, and 40.0 cm.",
    processingNotes:
      "Client-supplied Punches catalogue page 2. The common turnable body and exact printed Turrel 21-16xx working-end detail are retained together."
  }),
  catalogueCandidate({
    id: "punches-turrel-21-17",
    cataloguePage: "2",
    reuseScope:
      "360-degree turnable Turrel code group 21-17xx: 21-1701, 21-1702, and 21-1703 at 28.0 cm, 35.0 cm, and 40.0 cm.",
    processingNotes:
      "Client-supplied Punches catalogue page 2. The common turnable body and exact printed Turrel 21-17xx working-end detail are retained together without borrowing the 21-16xx tip."
  }),
  catalogueCandidate({
    id: "punches-fahlbusch",
    cataloguePage: "3",
    reuseScope:
      "Fahlbusch Micro Scissors, horizontal cutting, catalogue code 38-2401, shown with the 16.5 cm Nicola instrument context.",
    processingNotes:
      "Client-supplied Punches catalogue page 3. The complete Nicola body context and exact Fahlbusch horizontal-cutting tip presentation are retained without reshaping the working end."
  }),
  catalogueCandidate({
    id: "punches-nicola-spoon-shaped",
    cataloguePage: "3",
    reuseScope:
      "Nicola Forceps, spoon-shaped, catalogue code 38-2410, shown with the 16.5 cm Nicola instrument context.",
    processingNotes:
      "Client-supplied Punches catalogue page 3. The complete Nicola body context and exact spoon-shaped tip presentation are retained together."
  }),
  catalogueCandidate({
    id: "punches-nicola-biopsy-straight",
    cataloguePage: "3",
    reuseScope:
      "Nicola Forceps Scissors, biopsy straight, catalogue code 38-2402, shown with the 16.5 cm Nicola instrument context.",
    processingNotes:
      "Client-supplied Punches catalogue page 3. The complete Nicola body context and exact straight biopsy-scissors tip presentation are retained without fabricating serrations or curvature."
  }),
  catalogueCandidate({
    id: "punches-yasargil-nicola",
    cataloguePage: "3",
    reuseScope:
      "Yasargil-Nicola Forceps, catalogue code 038-2420, shown with the 16.5 cm Nicola instrument context.",
    processingNotes:
      "Client-supplied Punches catalogue page 3. The complete Nicola body context and exact Yasargil-Nicola tip presentation are retained without changing the printed working-end geometry."
  }),
  catalogueCandidate({
    id: "punches-citelly",
    cataloguePage: "3",
    reuseScope:
      "Citelly Laminectomy Punches, catalogue codes 38-2501 through 38-2503, opening sizes 1.0 mm through 3.0 mm, 8.0 cm shaft.",
    processingNotes:
      "Client-supplied Punches catalogue page 3. The complete Citelly body and all three exact printed opening-size references are retained as one size-only grouped configuration."
  }),
  catalogueCandidate({
    id: "punches-beyer",
    cataloguePage: "3",
    reuseScope:
      "Beyer Laminectomy Punch, catalogue code 38-2510, 9.5 cm shaft and 1.5 mm opening.",
    processingNotes:
      "Client-supplied Punches catalogue page 3. The complete Beyer body and printed 1.5 mm opening reference are retained without replacing or exaggerating its jaw geometry."
  })
] as const satisfies readonly CatalogueMediaAsset[];
