import type { FamilySlug, ProductPreviewModel } from "@/features/public-catalogue";

export interface ProductsDiscoveryItem extends ProductPreviewModel {
  searchTerms: readonly string[];
}

export type ProductsSort = "recommended" | "name-asc";
export type ProductsView = "grid" | "list";

export interface ProductsDiscoveryState {
  query: string;
  family: FamilySlug | "all";
  sort: ProductsSort;
  view: ProductsView;
}

export interface ProductsDiscoveryResult {
  products: readonly ProductsDiscoveryItem[];
  total: number;
}
