import {
  CATALOGUE_FAMILIES,
  type CatalogueFamilyRecord,
  type CatalogueProductRecord
} from "@/features/catalogue-registry";
import { familyHref, productHref } from "@/features/public-catalogue";
import {
  effectiveConfigurationPrice,
  summarizeProductPrice,
  type ProductPriceSummary,
  type SarAmount
} from "@/features/pricing";
import {
  adminCatalogueHref,
  adminProductHref
} from "@/features/admin-management-routing/admin-management-hrefs";

export interface AdminProductRow {
  id: string;
  name: string;
  code: string;
  familySlug: CatalogueProductRecord["familySlug"];
  familyName: string;
  optionSummary: readonly string[];
  catalogueReference: string;
  mediaLabel: string;
  mediaPath?: string;
  isActive: boolean;
  priceSummary: ProductPriceSummary;
  publicHref: ReturnType<typeof productHref>;
  familyHref: ReturnType<typeof familyHref>;
  adminHref: ReturnType<typeof adminProductHref>;
}

export interface AdminProductCompletenessItem {
  key:
    | "name"
    | "code"
    | "family"
    | "description"
    | "options"
    | "catalogue"
    | "arabic"
    | "media"
    | "pricing";
  label: string;
  state: "Present" | "Not supplied" | "Not registered";
}

export interface AdminVariantPricingRow {
  id: string;
  sku: string;
  size: string;
  variantType: string;
  priceOverrideSar: SarAmount | null;
  effectivePriceSar: SarAmount | null;
}

export interface AdminProductEditorModel {
  family: CatalogueFamilyRecord;
  product: CatalogueProductRecord;
  isActive: boolean;
  publicHref: ReturnType<typeof productHref>;
  publicFamilyHref: ReturnType<typeof familyHref>;
  adminCatalogueHref: ReturnType<typeof adminCatalogueHref>;
  priceSummary: ProductPriceSummary;
  variantPricing: readonly AdminVariantPricingRow[];
  optionGroups: readonly {
    key: "sizes" | "variants" | "directions" | "primary";
    label: string;
    values: readonly string[];
  }[];
  completeness: readonly AdminProductCompletenessItem[];
}

const familyBySlug = new Map(
  CATALOGUE_FAMILIES.map((family) => [family.slug, family] as const)
);

export function getDocumentedOptionSummary(
  product: CatalogueProductRecord
): readonly string[] {
  const values = [
    ...product.sizes,
    ...product.variants,
    ...product.directions,
    product.primaryOption
  ].filter((value): value is string => Boolean(value?.trim()));

  const unique = [...new Set(values)];
  return unique.length > 0 ? unique : ["Not documented in source"];
}

function formatCatalogueReference(product: CatalogueProductRecord): string {
  const page = product.catalogueReference.page?.trim();
  return page
    ? `${product.catalogueReference.family} · Page ${page}`
    : product.catalogueReference.family;
}

function hasDocumentedOptions(product: CatalogueProductRecord): boolean {
  return Boolean(
    product.sizes.length ||
      product.variants.length ||
      product.directions.length ||
      product.primaryOption?.trim()
  );
}

function hasNumericPricing(product: CatalogueProductRecord): boolean {
  if (product.basePriceSar !== null && product.basePriceSar !== undefined) return true;
  return (product.configurations ?? []).some(
    (configuration) => configuration.priceOverrideSar !== null
  );
}

function completenessFor(
  product: CatalogueProductRecord
): readonly AdminProductCompletenessItem[] {
  return [
    { key: "name", label: "English product name", state: "Present" },
    { key: "code", label: "Product code", state: "Present" },
    { key: "family", label: "Instrument family", state: "Present" },
    {
      key: "description",
      label: "English description",
      state: product.description?.trim() ? "Present" : "Not supplied"
    },
    {
      key: "options",
      label: "Documented options",
      state: hasDocumentedOptions(product) ? "Present" : "Not supplied"
    },
    { key: "catalogue", label: "Catalogue reference", state: "Present" },
    {
      key: "arabic",
      label: "Arabic content",
      state: product.nameAr?.trim() || product.descriptionAr?.trim() ? "Present" : "Not supplied"
    },
    {
      key: "media",
      label: "Primary product media",
      state: product.mediaPath ? "Present" : "Not registered"
    },
    {
      key: "pricing",
      label: "SAR pricing",
      state: hasNumericPricing(product) ? "Present" : "Not supplied"
    }
  ];
}

function variantPricingFor(product: CatalogueProductRecord): readonly AdminVariantPricingRow[] {
  return (product.configurations ?? []).map((configuration) => ({
    id: configuration.id,
    sku: configuration.sku,
    size: configuration.size,
    variantType: configuration.variantType,
    priceOverrideSar: configuration.priceOverrideSar,
    effectivePriceSar: effectiveConfigurationPrice(
      product.basePriceSar,
      configuration.priceOverrideSar
    )
  }));
}

export function getAdminProductRows(
  products: readonly CatalogueProductRecord[]
): readonly AdminProductRow[] {
  return products.map((product): AdminProductRow => {
    const family = familyBySlug.get(product.familySlug);
    if (!family) throw new Error(`Unknown catalogue family: ${product.familySlug}`);

    return {
      id: product.id,
      name: product.name,
      code: product.code,
      familySlug: product.familySlug,
      familyName: family.name,
      optionSummary: getDocumentedOptionSummary(product),
      catalogueReference: formatCatalogueReference(product),
      mediaLabel: product.mediaLabel,
      ...(product.mediaPath ? { mediaPath: product.mediaPath } : {}),
      isActive: product.isActive ?? true,
      priceSummary: summarizeProductPrice(product),
      publicHref: productHref(product),
      familyHref: familyHref(product.familySlug),
      adminHref: adminProductHref(product)
    };
  });
}

export function getAdminProductEditor(
  product: CatalogueProductRecord
): AdminProductEditorModel | undefined {
  const family = familyBySlug.get(product.familySlug);
  if (!family) return undefined;

  return {
    family,
    product,
    isActive: product.isActive ?? true,
    publicHref: productHref(product),
    publicFamilyHref: familyHref(family.slug),
    adminCatalogueHref: adminCatalogueHref(family.slug),
    priceSummary: summarizeProductPrice(product),
    variantPricing: variantPricingFor(product),
    optionGroups: [
      { key: "sizes", label: "Sizes", values: product.sizes },
      { key: "variants", label: "Variants", values: product.variants },
      { key: "directions", label: "Directions or shapes", values: product.directions },
      {
        key: "primary",
        label: "Primary option",
        values: product.primaryOption ? [product.primaryOption] : []
      }
    ],
    completeness: completenessFor(product)
  };
}
