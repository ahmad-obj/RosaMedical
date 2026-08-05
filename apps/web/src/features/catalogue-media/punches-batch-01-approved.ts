import type { CatalogueMediaAsset } from "./types";
import { PUNCHES_BATCH_01_MEDIA as PUNCHES_BATCH_01_CANDIDATES } from "./punches-batch-01";

export const PUNCHES_BATCH_01_APPROVED_MEDIA = PUNCHES_BATCH_01_CANDIDATES.map(
  (asset): CatalogueMediaAsset => ({
    ...asset,
    reviewStatus: "approved"
  })
) as readonly CatalogueMediaAsset[];
