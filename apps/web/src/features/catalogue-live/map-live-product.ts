import type { CatalogueProductRecord, CatalogueProductConfiguration } from "@/features/catalogue-registry";
import type { CatalogueMetadataManifestEntry } from "@/features/catalogue-migration/catalogue-metadata-manifest";
import { FAMILY_SLUGS, type FamilySlug } from "@/features/public-catalogue/models";
import { normalizeSarAmount } from "@/features/pricing";
import type {
  LiveCatalogueSnapshot,
  LiveCategoryRow,
  LiveImageRow,
  LiveProductRow,
  LiveVariantRow
} from "./catalogue-live.types";

type CatalogueCodeOption = { code: string; size: string };

function isFamilySlug(value: string): value is FamilySlug {
  return (FAMILY_SLUGS as readonly string[]).includes(value);
}

function byCreatedAt(left: LiveVariantRow, right: LiveVariantRow): number {
  return left.created_at.localeCompare(right.created_at);
}

function categoryFor(
  product: LiveProductRow,
  categoriesById: ReadonlyMap<string, LiveCategoryRow>
): LiveCategoryRow {
  if (!product.category_id) {
    throw new Error(`[catalogue-migration] product ${product.slug} has no category`);
  }

  const category = categoriesById.get(product.category_id);
  if (!category || !category.is_active || category.deleted_at !== null) {
    throw new Error(`[catalogue-migration] product ${product.slug} has no active family`);
  }
  if (!isFamilySlug(category.slug)) {
    throw new Error(
      `[catalogue-migration] product ${product.slug} references unknown family ${category.slug}`
    );
  }

  return category;
}

function primaryImageFor(
  product: LiveProductRow,
  images: readonly LiveImageRow[]
): string {
  const primaryImages = images.filter(
    (image) => image.product_id === product.id && image.sort_order === 0
  );

  if (primaryImages.length !== 1) {
    throw new Error(
      `[catalogue-migration] primary image mismatch for ${product.slug}: expected exactly one, found ${primaryImages.length}`
    );
  }

  const path = primaryImages[0]!.image_path.trim();
  if (!path) {
    throw new Error(
      `[catalogue-migration] primary image mismatch for ${product.slug}: empty image path`
    );
  }
  return path;
}

function primaryImageForOptional(
  product: LiveProductRow,
  images: readonly LiveImageRow[]
): string | undefined {
  const primaryImages = images.filter(
    (image) => image.product_id === product.id && image.sort_order === 0
  );

  if (primaryImages.length === 0) return undefined;
  if (primaryImages.length > 1) {
    throw new Error(
      `[catalogue-migration] primary image mismatch for ${product.slug}: expected exactly one, found ${primaryImages.length}`
    );
  }

  const path = primaryImages[0]!.image_path.trim();
  return path || undefined;
}

function configurationsFor(
  productId: string,
  variants: readonly LiveVariantRow[]
): readonly CatalogueProductConfiguration[] {
  return variants
    .filter((variant) => variant.product_id === productId)
    .slice()
    .sort(byCreatedAt)
    .map((variant) => ({
      id: variant.id,
      sku: variant.sku?.trim() ?? "",
      size: variant.size?.trim() ?? "",
      variantType: variant.variant_type?.trim() ?? "",
      priceOverrideSar: normalizeSarAmount(variant.price_override)
    }));
}

function liveCatalogueCodesFor(
  productId: string,
  variants: readonly LiveVariantRow[]
): readonly CatalogueCodeOption[] {
  return variants
    .filter((variant) => variant.product_id === productId)
    .slice()
    .sort(byCreatedAt)
    .flatMap((variant) => {
      const code = variant.sku?.trim();
      const size = variant.size?.trim();
      return code && size ? [{ code, size }] : [];
    });
}

function normalizedCodeOptions(
  options: readonly CatalogueCodeOption[]
): readonly string[] {
  return options
    .map(({ code, size }) => `${code}\u0000${size}`)
    .slice()
    .sort();
}

function codeOptionsMatch(
  live: readonly CatalogueCodeOption[],
  expected: readonly CatalogueCodeOption[]
): boolean {
  const left = normalizedCodeOptions(live);
  const right = normalizedCodeOptions(expected);
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function catalogueCodesFor(
  product: LiveProductRow,
  variants: readonly LiveVariantRow[],
  manifest: CatalogueMetadataManifestEntry
): readonly CatalogueCodeOption[] {
  const live = liveCatalogueCodesFor(product.id, variants);
  const expected = manifest.expectedCatalogueCodes;

  if (expected && !codeOptionsMatch(live, expected)) {
    throw new Error(
      `[catalogue-migration] code option mismatch for ${manifest.dbSlug}`
    );
  }

  return expected ?? live;
}

function mapManifestProduct(
  product: LiveProductRow,
  entry: CatalogueMetadataManifestEntry,
  categoriesById: ReadonlyMap<string, LiveCategoryRow>,
  snapshot: LiveCatalogueSnapshot
): CatalogueProductRecord {
  const category = categoryFor(product, categoriesById);

  const description = product.description_en?.trim();
  const descriptionAr = product.description_ar?.trim();
  const nameAr = product.name_ar?.trim();
  const mediaPath = primaryImageFor(product, snapshot.images);
  const catalogueCodes = catalogueCodesFor(product, snapshot.variants, entry);

  return {
    id: product.id,
    familySlug: entry.familySlug,
    slug: entry.publicSlug,
    name: product.name_en,
    ...(nameAr ? { nameAr } : {}),
    code: product.item_code!,
    ...(description ? { description } : {}),
    ...(descriptionAr ? { descriptionAr } : {}),
    sizes: entry.metadata.sizes,
    variants: entry.metadata.variants,
    directions: entry.metadata.directions,
    ...(entry.metadata.primaryOption
      ? { primaryOption: entry.metadata.primaryOption }
      : {}),
    catalogueReference: {
      family: category.name_en,
      ...(entry.metadata.cataloguePage
        ? { page: entry.metadata.cataloguePage }
        : {})
    },
    mediaLabel: entry.metadata.mediaLabel,
    ...(catalogueCodes.length ? { catalogueCodes } : {}),
    mediaPath,
    isActive: product.is_active,
    basePriceSar: normalizeSarAmount(product.price),
    configurations: configurationsFor(product.id, snapshot.variants)
  };
}

function mapLiveOnlyProduct(
  product: LiveProductRow,
  categoriesById: ReadonlyMap<string, LiveCategoryRow>,
  snapshot: LiveCatalogueSnapshot,
  allowMissingImage: boolean
): CatalogueProductRecord | null {
  try {
    const category = categoryFor(product, categoriesById);
    const description = product.description_en?.trim();
    const descriptionAr = product.description_ar?.trim();
    const nameAr = product.name_ar?.trim();
    const mediaPath = allowMissingImage
      ? primaryImageForOptional(product, snapshot.images)
      : primaryImageFor(product, snapshot.images);
    const catalogueCodes = liveCatalogueCodesFor(product.id, snapshot.variants);
    const sizes = Array.from(
      new Set(catalogueCodes.map((option) => option.size).filter(Boolean))
    );

    const familyPrefix = `${category.slug}-`;
    const bareSlug = product.slug.startsWith(familyPrefix)
      ? product.slug.slice(familyPrefix.length)
      : product.slug;
    return {
      id: product.id,
      familySlug: category.slug as FamilySlug,
      slug: bareSlug,
      name: product.name_en,
      ...(nameAr ? { nameAr } : {}),
      code: product.item_code ?? "",
      ...(description ? { description } : {}),
      ...(descriptionAr ? { descriptionAr } : {}),
      sizes,
      variants: [],
      directions: [],
      catalogueReference: {
        family: category.name_en
      },
      mediaLabel: product.name_en,
      ...(catalogueCodes.length ? { catalogueCodes } : {}),
      ...(mediaPath ? { mediaPath } : {}),
      isActive: product.is_active,
      basePriceSar: normalizeSarAmount(product.price),
      configurations: configurationsFor(product.id, snapshot.variants)
    };
  } catch (error) {
    console.warn(
      `[catalogue-live] skipping live-only product ${product.slug}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return null;
  }
}

export function mapLiveCatalogue(
  snapshot: LiveCatalogueSnapshot,
  manifest: readonly CatalogueMetadataManifestEntry[],
  options?: { includeInactive?: boolean }
): readonly CatalogueProductRecord[] {
  const includeInactive = options?.includeInactive ?? false;
  const eligibleProducts = includeInactive
    ? snapshot.products
    : snapshot.products.filter((product) => product.is_active);

  const productsBySlug = new Map(eligibleProducts.map((product) => [product.slug, product] as const));
  if (productsBySlug.size !== eligibleProducts.length) {
    throw new Error("[catalogue-migration] duplicate live product slug detected");
  }

  const manifestBySlug = new Map(manifest.map((entry) => [entry.dbSlug, entry] as const));
  if (manifestBySlug.size !== manifest.length) {
    throw new Error("[catalogue-migration] duplicate manifest product slug detected");
  }

  const categoriesById = new Map(
    snapshot.categories.map((category) => [category.id, category] as const)
  );

  const manifestResults = manifest.flatMap((entry): CatalogueProductRecord[] => {
    const product = productsBySlug.get(entry.dbSlug);
    return product ? [mapManifestProduct(product, entry, categoriesById, snapshot)] : [];
  });

  const liveOnlyResults = eligibleProducts
    .filter((product) => !manifestBySlug.has(product.slug))
    .map((product) => mapLiveOnlyProduct(product, categoriesById, snapshot, includeInactive))
    .filter((record): record is CatalogueProductRecord => record !== null);

  return [...manifestResults, ...liveOnlyResults];
}
