import { productFixtures } from "@rosa/contracts/fixtures";
import type { CatalogueProductRecord } from "@/features/catalogue-registry";
import { CATALOGUE_PRODUCTS } from "@/features/catalogue-registry";
import {
  CATALOGUE_METADATA_MANIFEST,
  type CatalogueMetadataManifestEntry
} from "@/features/catalogue-migration/catalogue-metadata-manifest";
import {
  FAMILY_SLUGS,
  type FamilySlug
} from "@/features/public-catalogue/models";
import { createClient } from "@/lib/supabase/server";
import { createPublicReadClient } from "@/lib/supabase/public-read";
import { getCachedCatalogueProjection } from "./catalogue-live.cache";
import { projectionRowsToSnapshot } from "./catalogue-live.projections";
import { mapLiveCatalogue } from "./map-live-product";
import type {
  LiveCatalogueSnapshot,
  LiveCategoryRow,
  LiveImageRow,
  LiveProductProjectionRow,
  LiveProductRow,
  LiveVariantRow
} from "./catalogue-live.types";

const PUBLIC_PRODUCT_SELECT = `
  id,category_id,item_code,name_en,name_ar,description_en,description_ar,is_active,slug,created_at,price,
  category:categories!inner(id,slug,name_en,name_ar,is_active,deleted_at),
  variants:product_variants(id,product_id,sku,size,variant_type,price_override,created_at),
  images:product_images(product_id,image_path,sort_order)
`;

export class CatalogueLiveReadError extends Error {
  constructor(
    public readonly source: string,
    message: string,
    options?: ErrorOptions
  ) {
    super(`[catalogue-live:${source}] ${message}`, options);
    this.name = "CatalogueLiveReadError";
  }
}

export class CatalogueLiveParityError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(`[catalogue-live:parity] ${message}`, options);
    this.name = "CatalogueLiveParityError";
  }
}

export interface CatalogueSnapshotReader {
  read(): Promise<LiveCatalogueSnapshot>;
}

interface ProjectionReadResult {
  data: readonly LiveProductProjectionRow[] | null;
  error: { message?: string } | null;
}

function messageFrom(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function isFamilySlug(value: string): value is FamilySlug {
  return (FAMILY_SLUGS as readonly string[]).includes(value);
}

function requireSuccessfulRead<T>(
  source: string,
  result: { data: T[] | null; error: { message?: string } | null }
): T[] {
  if (result.error) {
    throw new CatalogueLiveReadError(
      source,
      result.error.message || "Supabase read failed"
    );
  }
  if (!result.data) {
    throw new CatalogueLiveReadError(source, "Supabase returned no data payload");
  }
  return result.data;
}

function staticProductsForManifest(
  manifest: readonly CatalogueMetadataManifestEntry[]
): readonly CatalogueProductRecord[] {
  const routes = new Set(
    manifest.map((entry) => `${entry.familySlug}/${entry.publicSlug}`)
  );
  return CATALOGUE_PRODUCTS.filter((product) =>
    routes.has(`${product.familySlug}/${product.slug}`)
  );
}

function familyManifest(
  familySlug: FamilySlug
): readonly CatalogueMetadataManifestEntry[] {
  return CATALOGUE_METADATA_MANIFEST.filter(
    (entry) => entry.familySlug === familySlug
  );
}

const FEATURED_MANIFEST: readonly CatalogueMetadataManifestEntry[] =
  productFixtures.map((selection) => {
    const entry = CATALOGUE_METADATA_MANIFEST.find(
      (candidate) =>
        candidate.familySlug === selection.familySlug &&
        candidate.publicSlug === selection.slug
    );
    if (!entry) {
      throw new Error(
        `[catalogue-migration] featured route missing from manifest: ${selection.familySlug}/${selection.slug}`
      );
    }
    return entry;
  });

export async function loadCatalogueProducts(
  reader: CatalogueSnapshotReader,
  manifest: readonly CatalogueMetadataManifestEntry[] = CATALOGUE_METADATA_MANIFEST,
  options?: { includeInactive?: boolean }
): Promise<readonly CatalogueProductRecord[]> {
  let snapshot: LiveCatalogueSnapshot;
  try {
    snapshot = await reader.read();
  } catch (error) {
    if (error instanceof CatalogueLiveReadError) throw error;
    throw new CatalogueLiveReadError("snapshot", messageFrom(error), { cause: error });
  }

  try {
    return mapLiveCatalogue(snapshot, manifest, options);
  } catch (error) {
    throw new CatalogueLiveParityError(messageFrom(error), { cause: error });
  }
}

async function loadProjectedCatalogue(
  source: string,
  read: () => Promise<ProjectionReadResult>,
  manifest: readonly CatalogueMetadataManifestEntry[]
): Promise<readonly CatalogueProductRecord[]> {
  let result: ProjectionReadResult;
  try {
    result = await read();
  } catch (error) {
    throw new CatalogueLiveReadError(source, messageFrom(error), { cause: error });
  }

  if (result.error) {
    throw new CatalogueLiveReadError(
      source,
      result.error.message || "Supabase read failed"
    );
  }
  if (!result.data) {
    throw new CatalogueLiveReadError(source, "Supabase returned no data payload");
  }

  try {
    return mapLiveCatalogue(projectionRowsToSnapshot(result.data), manifest);
  } catch (error) {
    throw new CatalogueLiveParityError(messageFrom(error), { cause: error });
  }
}

async function withInfrastructureFallback(
  source: string,
  live: () => Promise<readonly CatalogueProductRecord[]>,
  fallback: readonly CatalogueProductRecord[]
): Promise<readonly CatalogueProductRecord[]> {
  try {
    return await live();
  } catch (error) {
    if (error instanceof CatalogueLiveParityError) {
      console.error(
        `[catalogue-migration] ${source} parity check failed; refusing stale fallback`,
        error
      );
      throw error;
    }
    if (!(error instanceof CatalogueLiveReadError)) throw error;

    console.warn(
      `[catalogue-migration] ${source} unavailable; using temporary static fallback`,
      error
    );
    return fallback;
  }
}

const supabaseCatalogueReader: CatalogueSnapshotReader = {
  async read(): Promise<LiveCatalogueSnapshot> {
    const supabase = await createClient();
    const [productsResult, categoriesResult, variantsResult, imagesResult] =
      await Promise.all([
        supabase
          .from("products")
          .select(
            "id,category_id,item_code,name_en,name_ar,description_en,description_ar,is_active,slug,created_at,price"
          )
          .eq("is_active", true),
        supabase
          .from("categories")
          .select("id,slug,name_en,name_ar,is_active,deleted_at")
          .eq("is_active", true)
          .is("deleted_at", null),
        supabase
          .from("product_variants")
          .select("id,product_id,sku,size,variant_type,price_override,created_at")
          .order("created_at", { ascending: true }),
        supabase
          .from("product_images")
          .select("product_id,image_path,sort_order")
          .order("sort_order", { ascending: true })
      ]);

    return {
      products: requireSuccessfulRead(
        "products",
        productsResult as {
          data: LiveProductRow[] | null;
          error: { message?: string } | null;
        }
      ),
      categories: requireSuccessfulRead(
        "categories",
        categoriesResult as {
          data: LiveCategoryRow[] | null;
          error: { message?: string } | null;
        }
      ),
      variants: requireSuccessfulRead(
        "product_variants",
        variantsResult as {
          data: LiveVariantRow[] | null;
          error: { message?: string } | null;
        }
      ),
      images: requireSuccessfulRead(
        "product_images",
        imagesResult as {
          data: LiveImageRow[] | null;
          error: { message?: string } | null;
        }
      )
    };
  }
};

export async function getLiveCatalogueProducts(): Promise<
  readonly CatalogueProductRecord[]
> {
  return loadCatalogueProducts(supabaseCatalogueReader);
}

const adminCatalogueReader: CatalogueSnapshotReader = {
  async read(): Promise<LiveCatalogueSnapshot> {
    const supabase = await createClient();
    const [productsResult, categoriesResult, variantsResult, imagesResult] =
      await Promise.all([
        supabase
          .from("products")
          .select(
            "id,category_id,item_code,name_en,name_ar,description_en,description_ar,is_active,slug,created_at,price"
          ),
        supabase
          .from("categories")
          .select("id,slug,name_en,name_ar,is_active,deleted_at")
          .eq("is_active", true)
          .is("deleted_at", null),
        supabase
          .from("product_variants")
          .select("id,product_id,sku,size,variant_type,price_override,created_at")
          .order("created_at", { ascending: true }),
        supabase
          .from("product_images")
          .select("product_id,image_path,sort_order")
          .order("sort_order", { ascending: true })
      ]);

    return {
      products: requireSuccessfulRead(
        "products",
        productsResult as {
          data: LiveProductRow[] | null;
          error: { message?: string } | null;
        }
      ),
      categories: requireSuccessfulRead(
        "categories",
        categoriesResult as {
          data: LiveCategoryRow[] | null;
          error: { message?: string } | null;
        }
      ),
      variants: requireSuccessfulRead(
        "product_variants",
        variantsResult as {
          data: LiveVariantRow[] | null;
          error: { message?: string } | null;
        }
      ),
      images: requireSuccessfulRead(
        "product_images",
        imagesResult as {
          data: LiveImageRow[] | null;
          error: { message?: string } | null;
        }
      )
    };
  }
};

/**
 * Admin-only: includes inactive (draft) products, so a freshly created
 * product's editor page can be found and rendered before it's activated.
 * Never used on public-facing routes.
 */
export async function getAdminCatalogueProducts(): Promise<
  readonly CatalogueProductRecord[]
> {
  return loadCatalogueProducts(
    adminCatalogueReader,
    CATALOGUE_METADATA_MANIFEST,
    { includeInactive: true }
  );
}

export async function getFeaturedCatalogueProducts(): Promise<
  readonly CatalogueProductRecord[]
> {
  return withInfrastructureFallback(
    "featured products",
    () =>
      getCachedCatalogueProjection("catalogue:featured", async () => {
        const supabase = createPublicReadClient();
        return loadProjectedCatalogue(
          "featured products",
          async () => {
            const { data, error } = await supabase
              .from("products")
              .select(PUBLIC_PRODUCT_SELECT)
              .eq("is_active", true)
              .eq("category.is_active", true)
              .is("category.deleted_at", null)
              .in(
                "slug",
                FEATURED_MANIFEST.map((entry) => entry.dbSlug)
              );
            return {
              data: data as unknown as readonly LiveProductProjectionRow[] | null,
              error
            };
          },
          FEATURED_MANIFEST
        );
      }),
    staticProductsForManifest(FEATURED_MANIFEST)
  );
}

export async function getFamilyCatalogueProducts(
  familySlug: string
): Promise<readonly CatalogueProductRecord[]> {
  if (!isFamilySlug(familySlug)) return [];
  const manifest = familyManifest(familySlug);

  return withInfrastructureFallback(
    `family ${familySlug}`,
    () =>
      getCachedCatalogueProjection(`catalogue:family:${familySlug}`, async () => {
        const supabase = createPublicReadClient();
        return loadProjectedCatalogue(
          `family ${familySlug}`,
          async () => {
            const { data, error } = await supabase
              .from("products")
              .select(PUBLIC_PRODUCT_SELECT)
              .eq("is_active", true)
              .eq("category.is_active", true)
              .is("category.deleted_at", null)
              .eq("category.slug", familySlug);
            return {
              data: data as unknown as readonly LiveProductProjectionRow[] | null,
              error
            };
          },
          manifest
        );
      }),
    staticProductsForManifest(manifest)
  );
}

export async function getProductCatalogueContext(
  familySlug: string,
  productSlug: string
): Promise<readonly CatalogueProductRecord[]> {
  if (!isFamilySlug(familySlug) || !productSlug.trim()) return [];
  const familyProducts = await getFamilyCatalogueProducts(familySlug);
  return selectProductCatalogueContext(familyProducts, productSlug);
}

export function selectProductCatalogueContext(
  familyProducts: readonly CatalogueProductRecord[],
  productSlug: string
): readonly CatalogueProductRecord[] {
  const product = familyProducts.find(
    (candidate) => candidate.slug === productSlug.trim()
  );
  return product ? [product] : [];
}

export async function getSearchCatalogueProducts(): Promise<
  readonly CatalogueProductRecord[]
> {
  return withInfrastructureFallback(
    "search catalogue",
    () =>
      getCachedCatalogueProjection("catalogue:search", async () => {
        const supabase = createPublicReadClient();
        return loadProjectedCatalogue(
          "search catalogue",
          async () => {
            const { data, error } = await supabase
              .from("products")
              .select(PUBLIC_PRODUCT_SELECT)
              .eq("is_active", true)
              .eq("category.is_active", true)
              .is("category.deleted_at", null);
            return {
              data: data as unknown as readonly LiveProductProjectionRow[] | null,
              error
            };
          },
          CATALOGUE_METADATA_MANIFEST
        );
      }),
    CATALOGUE_PRODUCTS
  );
}

export async function getPublicCatalogueProducts(): Promise<
  readonly CatalogueProductRecord[]
> {
  return getSearchCatalogueProducts();
}
