import type { CatalogueProductRecord } from "@/features/catalogue-registry";
import { CATALOGUE_FAMILIES } from "@/features/catalogue-registry/families";
import { getProductByPublicRoute } from "@/features/catalogue-live";
import { effectiveConfigurationPrice, type SarAmount } from "@/features/pricing";

export type ProductSpecificationRow = readonly [label: string, value: string];

export interface ProductConfigurationOption {
  id: string;
  sku: string;
  size: string;
  variantType: string;
  effectivePriceSar: SarAmount | null;
}

function configurationOptionsFor(product: CatalogueProductRecord): readonly ProductConfigurationOption[] {
  const configurations = product.configurations ?? [];
  if (configurations.length) {
    return configurations.map((configuration) => ({
      id: configuration.id,
      sku: configuration.sku || product.code,
      size: configuration.size,
      variantType: configuration.variantType,
      effectivePriceSar: effectiveConfigurationPrice(
        product.basePriceSar,
        configuration.priceOverrideSar
      )
    }));
  }

  return [
    {
      id: `product:${product.id}`,
      sku: product.code,
      size: product.primaryOption ?? "",
      variantType: "",
      effectivePriceSar: product.basePriceSar ?? null
    }
  ];
}

export function createProductDetailData(
  familySlug: string,
  productSlug: string,
  products: readonly CatalogueProductRecord[]
) {
  const family = CATALOGUE_FAMILIES.find(
    (candidate) => candidate.slug === familySlug
  );
  const product = getProductByPublicRoute(products, familySlug, productSlug);
  if (!family || !product) return null;

  const catalogueReference = `${product.catalogueReference.family}${
    product.catalogueReference.page
      ? ` · Page ${product.catalogueReference.page}`
      : ""
  }`;

  const specifications: ProductSpecificationRow[] = [
    ["Product code", product.code],
    ["Instrument family", family.name]
  ];

  if (product.sizes.length) {
    specifications.push(["Available size", product.sizes.join(", ")]);
  }
  if (product.variants.length) {
    specifications.push(["Listed options", product.variants.join(", ")]);
  }
  if (product.directions.length) {
    specifications.push(["Direction / shape", product.directions.join(", ")]);
  }
  specifications.push(["Catalogue reference", catalogueReference]);

  return {
    family,
    product,
    catalogueReference,
    specifications,
    configurationOptions: configurationOptionsFor(product),
    sizeValue: product.sizes[0] ?? product.primaryOption ?? "As listed",
    variantValue:
      product.variants[0] ?? product.directions[0] ?? "As listed"
  } as const;
}
