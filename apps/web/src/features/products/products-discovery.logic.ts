import type {
  ProductsDiscoveryItem,
  ProductsDiscoveryResult,
  ProductsDiscoveryState
} from "./products-discovery.types";

function searchableText(product: ProductsDiscoveryItem): string {
  return product.searchTerms.join(" ").toLocaleLowerCase();
}

export function filterProducts(
  products: readonly ProductsDiscoveryItem[],
  state: ProductsDiscoveryState
): ProductsDiscoveryResult {
  const query = state.query.trim().toLocaleLowerCase();
  let next = products.filter((product) =>
    (state.family === "all" || product.familySlug === state.family) &&
    (!query || searchableText(product).includes(query))
  );

  if (state.sort === "name-asc") {
    next = [...next].sort((a, b) => a.name.localeCompare(b.name));
  }

  return {
    products: next,
    total: next.length
  };
}
