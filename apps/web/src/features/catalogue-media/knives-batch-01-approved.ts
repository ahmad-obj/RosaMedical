import type { CatalogueMediaAsset } from "./types";
import { KNIVES_BATCH_01_MEDIA as KNIVES_BATCH_01_CANDIDATES } from "./knives-batch-01";

export const KNIVES_BATCH_01_APPROVED_MEDIA = KNIVES_BATCH_01_CANDIDATES.map(
  (asset): CatalogueMediaAsset => ({
    ...asset,
    reviewStatus: "approved"
  })
) as readonly CatalogueMediaAsset[];
