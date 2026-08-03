import { KNIVES_BATCH_01_MEDIA } from "@/features/catalogue-media";
import type { CatalogueProductRecord } from "../types";
import { KNIVES_BATCH_01_CONFIGURATIONS } from "./knives-batch-01";

const MEDIA_BY_ID = new Map(
  KNIVES_BATCH_01_MEDIA.map((asset) => [asset.id, asset] as const)
);

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values)];
}

export const KNIVES_BATCH_01_PRODUCTS = KNIVES_BATCH_01_CONFIGURATIONS.map(
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

    const directions =
      configuration.variant === "Straight" || configuration.variant === "Curved"
        ? [configuration.variant]
        : configuration.variant === "Long curved"
          ? ["Curved"]
          : [];

    return {
      id: configuration.id,
      familySlug: "knives",
      slug: configuration.slug,
      name: configuration.name,
      code: primaryCode.code,
      description: `Catalogue-listed ${configuration.name}. Codes remain grouped only where the catalogue presents one unchanged visible configuration with size or listed code variants.`,
      sizes: unique(catalogueCodes.map((option) => option.size)),
      variants: [configuration.variant],
      directions,
      primaryOption: configuration.variant,
      catalogueReference: {
        family: "Knives",
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

const ESTABLISHED_KNIFE_PRODUCTS = [
  {
    id: "product_scalpel_handle_3",
    familySlug: "knives",
    slug: "scalpel-handle-no-3",
    name: "Scalpel Handle No. 3",
    code: "18-0644",
    description:
      "Catalogue-listed Scalpel Handle No. 3 presented with the stated dimensions and option for quotation review.",
    sizes: ["14.5 cm"],
    variants: ["Standard"],
    directions: [],
    primaryOption: "14.5 cm",
    catalogueReference: { family: "Knives", page: "6" },
    mediaLabel: "Scalpel Handle No. 3 placeholder"
  },
  {
    id: "product_bard_parker_handle",
    familySlug: "knives",
    slug: "bard-parker-handle",
    name: "Bard Parker Handle",
    code: "18-0650",
    description:
      "Catalogue-listed Bard Parker Handle presented with the stated dimensions and option for quotation review.",
    sizes: ["14.5 cm"],
    variants: ["Standard"],
    directions: [],
    primaryOption: "14.5 cm",
    catalogueReference: { family: "Knives" },
    mediaLabel: "Bard Parker Handle placeholder"
  },
  {
    id: "product_amputation_knife",
    familySlug: "knives",
    slug: "amputation-knife",
    name: "Amputation Knife",
    code: "18-1202",
    description:
      "Catalogue-listed Amputation Knife presented with the stated dimensions and option for quotation review.",
    sizes: ["14.5 cm"],
    variants: ["Standard"],
    directions: [],
    primaryOption: "14.5 cm",
    catalogueReference: { family: "Knives" },
    mediaLabel: "Amputation Knife placeholder"
  },
  {
    id: "product_resection_knife",
    familySlug: "knives",
    slug: "resection-knife",
    name: "Resection Knife",
    code: "18-1404",
    description:
      "Catalogue-listed Resection Knife presented with the stated dimensions and option for quotation review.",
    sizes: ["14.5 cm"],
    variants: ["Standard"],
    directions: [],
    primaryOption: "14.5 cm",
    catalogueReference: { family: "Knives" },
    mediaLabel: "Resection Knife placeholder"
  }
] as const satisfies readonly CatalogueProductRecord[];

export const KNIFE_PRODUCTS = [
  ...KNIVES_BATCH_01_PRODUCTS,
  ...ESTABLISHED_KNIFE_PRODUCTS
] as const satisfies readonly CatalogueProductRecord[];
