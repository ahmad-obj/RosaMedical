import { SCISSORS_BATCH_01_MEDIA } from "@/features/catalogue-media";
import type { CatalogueProductRecord } from "../types";
import { SCISSORS_BATCH_01_CONFIGURATIONS } from "./scissors-batch-01";

const MEDIA_BY_ID = new Map(
  SCISSORS_BATCH_01_MEDIA.map((asset) => [asset.id, asset] as const)
);

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values)];
}

export const SCISSOR_PRODUCTS = SCISSORS_BATCH_01_CONFIGURATIONS.map(
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

    return {
      id: configuration.id,
      familySlug: "scissors",
      slug: configuration.slug,
      name: configuration.name,
      code: primaryCode.code,
      description: `Catalogue-listed ${configuration.name} in ${configuration.finish}, ${configuration.direction.toLowerCase()}, ${configuration.pointStyle.toLowerCase()} configuration. Sizes are grouped only where the visible instrument configuration remains the same.`,
      sizes: unique(catalogueCodes.map((option) => option.size)),
      variants: [configuration.finish, configuration.pointStyle],
      directions: [configuration.direction],
      primaryOption: `${configuration.finish} · ${configuration.direction} · ${configuration.pointStyle}`,
      catalogueReference: {
        family: "Scissors",
        page: configuration.cataloguePage
      },
      mediaLabel: `${configuration.name}, ${configuration.finish}, ${configuration.direction}, ${configuration.pointStyle}`,
      catalogueCodes,
      mediaAssetId: configuration.mediaAssetId,
      mediaPath: media.avifPath,
      mediaFallbackPath: media.webpPath,
      mediaSourceUrl: media.sourcePageUrl,
      mediaReviewNote: `${media.matchGrade} · ${media.rightsMode} · ${media.background} · ${media.reviewStatus}`
    };
  }
) as readonly CatalogueProductRecord[];
