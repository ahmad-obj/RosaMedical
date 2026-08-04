import { PUNCHES_BATCH_01_MEDIA } from "@/features/catalogue-media";
import type { CatalogueProductRecord } from "../types";
import { PUNCHES_BATCH_01_CONFIGURATIONS } from "./punches-batch-01";

const MEDIA_BY_ID = new Map(
  PUNCHES_BATCH_01_MEDIA.map((asset) => [asset.id, asset] as const)
);

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values)];
}

export const PUNCHES_BATCH_01_PRODUCTS = PUNCHES_BATCH_01_CONFIGURATIONS.map(
  (configuration): CatalogueProductRecord => {
    const catalogueCodes = configuration.codeOptions.map(({ code, size }) => ({
      code,
      size
    }));
    const primaryCode = catalogueCodes[0];
    const media = MEDIA_BY_ID.get(configuration.mediaAssetId);

    if (!primaryCode) {
      throw new Error(`Missing catalogue code for ${configuration.id}`);
    }

    if (!media) {
      throw new Error(
        `Missing catalogue media for ${configuration.id}: ${configuration.mediaAssetId}`
      );
    }

    const directions = configuration.variant.toLowerCase().includes("straight")
      ? ["Straight"]
      : [];

    return {
      id: configuration.id,
      familySlug: "punches",
      slug: configuration.slug,
      name: configuration.name,
      code: primaryCode.code,
      description: `Catalogue-listed ${configuration.name}. Codes remain grouped only where the catalogue presents one unchanged visible configuration with shaft-length or opening-size variants.`,
      sizes: unique(catalogueCodes.map((option) => option.size)),
      variants: [configuration.variant],
      directions,
      primaryOption: configuration.variant,
      catalogueReference: {
        family: "Punches",
        page: configuration.cataloguePage
      },
      mediaLabel: `${configuration.name}, ${configuration.variant}`,
      catalogueCodes,
      mediaAssetId: configuration.mediaAssetId,
      mediaPath: media.avifPath,
      mediaFallbackPath: media.webpPath,
      mediaSourceUrl: media.sourcePageUrl,
      mediaReviewNote: `${media.matchGrade} · ${media.rightsMode} · ${media.background} · ${media.reviewStatus}`
    };
  }
) as readonly CatalogueProductRecord[];

const PRESERVED_PUNCH_PRODUCTS = [
  {
    id: "product_biopsy_punch",
    familySlug: "punches",
    slug: "biopsy-punch",
    name: "Biopsy Punch",
    code: "23-1204",
    description:
      "Catalogue-listed Biopsy Punch presented with the stated diameter.",
    sizes: ["4 mm"],
    variants: [],
    directions: [],
    primaryOption: "4 mm",
    catalogueReference: { family: "Punches" },
    mediaLabel: "Biopsy Punch placeholder"
  }
] as const satisfies readonly CatalogueProductRecord[];

export const PUNCH_PRODUCTS: readonly CatalogueProductRecord[] = [
  ...PUNCHES_BATCH_01_PRODUCTS,
  ...PRESERVED_PUNCH_PRODUCTS
];
