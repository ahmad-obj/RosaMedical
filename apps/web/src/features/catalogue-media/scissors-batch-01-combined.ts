import type { CatalogueMediaAsset } from "./types";
import { SCISSORS_BATCH_01_MEDIA as SCISSORS_BATCH_01_BASE_MEDIA } from "./scissors-batch-01";
import { SCISSORS_BATCH_01_OPERATING_MEDIA } from "./scissors-batch-01-operating";

export const SCISSORS_BATCH_01_MEDIA = [
  ...SCISSORS_BATCH_01_BASE_MEDIA,
  ...SCISSORS_BATCH_01_OPERATING_MEDIA
] as const satisfies readonly CatalogueMediaAsset[];
