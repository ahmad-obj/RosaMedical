import { CHISELS_BATCH_01_MEDIA } from "@/features/catalogue-media";
import type { CatalogueProductRecord } from "../types";
import { CHISELS_BATCH_01_CONFIGURATIONS } from "./chisels-batch-01";

const MEDIA_BY_ID = new Map(
  CHISELS_BATCH_01_MEDIA.map((asset) => [asset.id, asset] as const)
);

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values)];
}

export const CHISELS_BATCH_01_PRODUCTS = CHISELS_BATCH_01_CONFIGURATIONS.map(
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
      familySlug: "chisels",
      slug: configuration.slug,
      name: configuration.name,
      code: primaryCode.code,
      description: `Catalogue-listed ${configuration.name}${directionLabel}. Size-only code variants remain grouped where the visible instrument configuration is unchanged.`,
      sizes: unique(catalogueCodes.map((option) => option.size)),
      variants: [configuration.instrumentKind],
      directions:
        configuration.direction === "Not specified"
          ? []
          : [configuration.direction],
      primaryOption:
        configuration.direction === "Not specified"
          ? configuration.instrumentKind
          : `${configuration.instrumentKind} · ${configuration.direction}`,
      catalogueReference: {
        family: "Chisels",
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

const ESTABLISHED_CHISEL_PRODUCTS = [
  {
    id: "product_codman",
    familySlug: "chisels",
    slug: "codman",
    name: "Codman",
    code: "36-7101",
    description:
      "Catalogue-listed Codman pattern presented with the stated length and direction.",
    sizes: ["28 cm"],
    variants: [],
    directions: ["Straight"],
    primaryOption: "28 cm",
    catalogueReference: { family: "Chisels", page: "5" },
    mediaLabel: "Codman placeholder"
  },
  {
    id: "product_lambotte",
    familySlug: "chisels",
    slug: "lambotte",
    name: "Lambotte",
    code: "36-7201",
    description:
      "Catalogue-listed Lambotte pattern presented with the stated length, width and direction.",
    sizes: ["25.0 cm", "4 mm"],
    variants: [],
    directions: ["Straight"],
    primaryOption: "4 mm",
    catalogueReference: { family: "Chisels", page: "5" },
    mediaLabel: "Lambotte placeholder"
  },
  {
    id: "product_mini_lambotte",
    familySlug: "chisels",
    slug: "mini-lambotte",
    name: "Mini Lambotte",
    code: "36-7214",
    description:
      "Catalogue-listed Mini Lambotte pattern presented with the stated length, width and direction.",
    sizes: ["12.5 cm", "2 mm"],
    variants: [],
    directions: ["Straight"],
    primaryOption: "2 mm",
    catalogueReference: { family: "Chisels", page: "6" },
    mediaLabel: "Mini Lambotte placeholder"
  },
  {
    id: "product_farabeuf",
    familySlug: "chisels",
    slug: "farabeuf",
    name: "Farabeuf",
    code: "37-0701",
    description:
      "Catalogue-listed Farabeuf pattern presented with the stated length and direction.",
    sizes: ["15.0 cm"],
    variants: [],
    directions: ["Straight"],
    primaryOption: "15.0 cm",
    catalogueReference: { family: "Chisels", page: "10" },
    mediaLabel: "Farabeuf placeholder"
  }
] as const satisfies readonly CatalogueProductRecord[];

export const CHISEL_PRODUCTS = [
  ...CHISELS_BATCH_01_PRODUCTS,
  ...ESTABLISHED_CHISEL_PRODUCTS
] as const satisfies readonly CatalogueProductRecord[];
