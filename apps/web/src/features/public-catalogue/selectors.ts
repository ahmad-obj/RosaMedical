import { familyFixtures, productFixtures } from "@rosa/contracts/fixtures";
import type { CatalogueProductRecord } from "@/features/catalogue-registry";
import {
  FAMILY_CARD_DISPLAY_ORDER,
  FAMILY_SLUGS,
  type FamilyCardModel,
  type FamilySlug,
  type ProductPreviewModel
} from "./models";
import { FAMILY_MEDIA_BY_SLUG } from "@/features/public-media";

function isFamilySlug(value: string): value is FamilySlug {
  return FAMILY_SLUGS.some((slug) => slug === value);
}

function uniqueNonEmpty(values: readonly (string | undefined)[]): readonly string[] {
  const result: string[] = [];
  for (const value of values) {
    const normalized = value?.trim();
    if (normalized && !result.includes(normalized)) result.push(normalized);
  }
  return result;
}

export function familyNameBySlug(slug: FamilySlug): string {
  const fixture = familyFixtures.find((family) => family.slug === slug);
  if (!fixture) throw new Error(`Unknown Rosa family slug: ${slug}`);
  return fixture.name.en;
}

export function selectFamilyCards(): readonly FamilyCardModel[] {
  return FAMILY_CARD_DISPLAY_ORDER.map((slug, index): FamilyCardModel => {
    const fixture = familyFixtures.find((family) => family.slug === slug);
    if (!fixture) throw new Error(`Missing Rosa family fixture: ${slug}`);
    const description = fixture.introduction.en;

    return {
      id: fixture.id,
      slug,
      name: fixture.name.en,
      sequence: String(index + 1).padStart(2, "0"),
      ...(description ? { description } : {}),
      imageLabel: `${fixture.name.en} instruments`,
      media: FAMILY_MEDIA_BY_SLUG[slug]
    };
  });
}

function toProductPreview(product: CatalogueProductRecord): ProductPreviewModel {
  const optionSummary = uniqueNonEmpty([
    product.sizes[0],
    product.variants[0] ?? product.directions[0]
  ]);

  return {
    id: product.id,
    slug: product.slug,
    familySlug: product.familySlug,
    familyName: familyNameBySlug(product.familySlug),
    name: product.name,
    code: product.code,
    optionSummary,
    ...(product.description ? { description: product.description } : {}),
    imageLabel: product.mediaLabel,
    ...(product.mediaPath ? { mediaPath: product.mediaPath } : {}),
    ...(product.mediaFallbackPath
      ? { mediaFallbackPath: product.mediaFallbackPath }
      : {}),
    ...(typeof product.mediaIndex === "number"
      ? { mediaIndex: product.mediaIndex }
      : {})
  };
}

export function selectProductPreviews(
  products: readonly CatalogueProductRecord[]
): readonly ProductPreviewModel[] {
  return products.map(toProductPreview);
}

export function selectFeaturedProducts(
  products: readonly CatalogueProductRecord[]
): readonly ProductPreviewModel[] {
  return productFixtures.map((selection): ProductPreviewModel => {
    if (!isFamilySlug(selection.familySlug)) {
      throw new Error(`Unknown Rosa family slug: ${selection.familySlug}`);
    }

    const product = products.find(
      (candidate) =>
        candidate.familySlug === selection.familySlug &&
        candidate.slug === selection.slug
    );

    if (!product) {
      throw new Error(
        `Missing canonical catalogue product for featured route: ${selection.familySlug}/${selection.slug}`
      );
    }

    return toProductPreview(product);
  });
}
