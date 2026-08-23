import type {
  ProductsDiscoveryItem,
  ProductsDiscoveryResult,
  ProductsDiscoveryState
} from "./products-discovery.types";

function searchableText(product: ProductsDiscoveryItem): string {
  return product.searchTerms.join(" ").toLocaleLowerCase();
}

function matchesAny(productValues: readonly string[], selected: readonly string[]): boolean {
  if (selected.length === 0) return true;
  const normalized = new Set(productValues.map((value) => value.toLocaleLowerCase()));
  return selected.some((value) => normalized.has(value.toLocaleLowerCase()));
}

export function matchesProductsDiscoveryState(
  product: ProductsDiscoveryItem,
  state: ProductsDiscoveryState
): boolean {
  const query = state.query.trim().toLocaleLowerCase();

  return (
    (state.family === "all" || product.familySlug === state.family) &&
    (!query || searchableText(product).includes(query)) &&
    matchesAny(product.facetValues.sizes, state.sizes) &&
    matchesAny(product.facetValues.directions, state.directions) &&
    matchesAny(product.facetValues.variants, state.variants) &&
    matchesAny(product.facetValues.codeGroups, state.codeGroups)
  );
}

export function filterProducts(
  products: readonly ProductsDiscoveryItem[],
  state: ProductsDiscoveryState
): ProductsDiscoveryResult {
  let next = products.filter((product) => matchesProductsDiscoveryState(product, state));

  if (state.sort === "name-asc") {
    next = [...next].sort((a, b) => a.name.localeCompare(b.name));
  }

  return {
    products: next,
    total: next.length
  };
}
