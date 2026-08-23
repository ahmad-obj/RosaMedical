import type { FamilySlug, ProductPreviewModel } from "@/features/public-catalogue";
import type { ProductPriceSummary } from "@/features/pricing";

export interface ProductsFacetValues {
  sizes: readonly string[];
  directions: readonly string[];
  variants: readonly string[];
  codeGroups: readonly string[];
}

export interface ProductsDiscoveryItem extends ProductPreviewModel {
  searchTerms: readonly string[];
  facetValues: ProductsFacetValues;
  priceSummary: ProductPriceSummary;
}

export type ProductsSort = "recommended" | "name-asc";
export type ProductsView = "grid" | "list";

export interface ProductsDiscoveryState {
  query: string;
  family: FamilySlug | "all";
  sizes: readonly string[];
  directions: readonly string[];
  variants: readonly string[];
  codeGroups: readonly string[];
  sort: ProductsSort;
  view: ProductsView;
}

export interface ProductsDiscoveryResult {
  products: readonly ProductsDiscoveryItem[];
  total: number;
}

export interface ProductsFacetOption {
  value: string;
  count: number;
  selected: boolean;
  available: boolean;
}

export interface ProductsFacetModel {
  sizes: readonly ProductsFacetOption[];
  directions: readonly ProductsFacetOption[];
  variants: readonly ProductsFacetOption[];
  codeGroups: readonly ProductsFacetOption[];
}
