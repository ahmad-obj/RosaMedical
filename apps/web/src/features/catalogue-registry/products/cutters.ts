import { CUTTERS_BATCH_01_MEDIA } from "@/features/catalogue-media";
import type { CatalogueProductRecord } from "../types";
import { CUTTERS_BATCH_01_CONFIGURATIONS } from "./cutters-batch-01";

const MEDIA_BY_ID = new Map(
  CUTTERS_BATCH_01_MEDIA.map((asset) => [asset.id, asset] as const)
);

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values)];
}

export const CUTTERS_BATCH_01_PRODUCTS = CUTTERS_BATCH_01_CONFIGURATIONS.map(
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

    const directionLabel =
      configuration.direction === "Not specified"
        ? ""
        : ` in ${configuration.direction.toLowerCase()} form`;

    return {
      id: configuration.id,
      familySlug: "cutters",
      slug: configuration.slug,
      name: configuration.name,
      code: primaryCode.code,
      description: `Catalogue-listed ${configuration.name}${directionLabel}. Size-only code variants remain grouped where the visible instrument configuration is unchanged.`,
      sizes: unique(catalogueCodes.map((option) => option.size)),
      variants: [],
      directions:
        configuration.direction === "Not specified"
          ? []
          : [configuration.direction],
      primaryOption:
        configuration.direction === "Not specified"
          ? primaryCode.size
          : configuration.direction,
      catalogueReference: {
        family: "Cutters",
        page: configuration.cataloguePage
      },
      mediaLabel:
        configuration.direction === "Not specified"
          ? configuration.name
          : `${configuration.name}, ${configuration.direction}`,
      catalogueCodes,
      mediaAssetId: configuration.mediaAssetId,
      mediaPath: media.avifPath,
      mediaFallbackPath: media.webpPath,
      mediaSourceUrl: media.sourcePageUrl,
      mediaReviewNote: `${media.matchGrade} · ${media.rightsMode} · ${media.background} · ${media.reviewStatus}`
    };
  }
) as readonly CatalogueProductRecord[];

const ESTABLISHED_CUTTER_PRODUCTS = [
  {
    id: "product_sc_01t",
    familySlug: "cutters",
    slug: "sc-01t",
    name: "SC-01T",
    code: "SC-01T",
    description:
      "Catalogue-listed SC-01T pattern presented with the stated length, point and direction.",
    sizes: ["12.5 cm"],
    variants: ["Fine point"],
    directions: ["Straight"],
    primaryOption: "12.5 cm",
    catalogueReference: { family: "Cutters", page: "10" },
    mediaLabel: "SC-01T placeholder"
  }
] as const satisfies readonly CatalogueProductRecord[];

export const CUTTER_PRODUCTS = [
  ...CUTTERS_BATCH_01_PRODUCTS,
  ...ESTABLISHED_CUTTER_PRODUCTS
] as const satisfies readonly CatalogueProductRecord[];
