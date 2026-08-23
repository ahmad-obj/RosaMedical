import { filterProducts } from "./products-discovery.logic";
import type {
  ProductsDiscoveryItem,
  ProductsDiscoveryState,
  ProductsFacetModel,
  ProductsFacetOption
} from "./products-discovery.types";
import { PRODUCTS_FACET_KEYS, type ProductsFacetKey } from "./products-facets";

function stateWithoutFacet(
  state: ProductsDiscoveryState,
  facet: ProductsFacetKey
): ProductsDiscoveryState {
  return {
    ...state,
    [facet]: []
  };
}

function compareFacetValues(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function buildFacetOptions(
  products: readonly ProductsDiscoveryItem[],
  state: ProductsDiscoveryState,
  facet: ProductsFacetKey
): readonly ProductsFacetOption[] {
  const selectedValues = state[facet];
  const contextualProducts = filterProducts(products, stateWithoutFacet(state, facet)).products;
  const counts = new Map<string, number>();
  const displayValues = new Map<string, string>();

  for (const product of contextualProducts) {
    const seenForProduct = new Set<string>();
    for (const value of product.facetValues[facet]) {
      const normalized = value.trim();
      if (!normalized) continue;
      const key = normalized.toLocaleLowerCase();
      if (seenForProduct.has(key)) continue;
      seenForProduct.add(key);
      displayValues.set(key, displayValues.get(key) ?? normalized);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  for (const value of selectedValues) {
    const normalized = value.trim();
    if (!normalized) continue;
    const key = normalized.toLocaleLowerCase();
    displayValues.set(key, displayValues.get(key) ?? normalized);
    counts.set(key, counts.get(key) ?? 0);
  }

  const selectedKeys = new Set(selectedValues.map((value) => value.toLocaleLowerCase()));

  return [...displayValues.entries()]
    .map(([key, value]) => {
      const count = counts.get(key) ?? 0;
      return {
        value,
        count,
        selected: selectedKeys.has(key),
        available: count > 0
      };
    })
    .sort((a, b) => compareFacetValues(a.value, b.value));
}

export function buildFacetModel(
  products: readonly ProductsDiscoveryItem[],
  state: ProductsDiscoveryState
): ProductsFacetModel {
  return Object.fromEntries(
    PRODUCTS_FACET_KEYS.map((facet) => [facet, buildFacetOptions(products, state, facet)])
  ) as unknown as ProductsFacetModel;
}
