import { FAMILY_SLUGS, type FamilySlug } from "@/features/public-catalogue";
import type { ProductsDiscoveryState, ProductsSort, ProductsView } from "./products-discovery.types";

const FAMILY_SET = new Set<string>(FAMILY_SLUGS);
const SORTS = new Set<ProductsSort>(["recommended", "name-asc"]);
const VIEWS = new Set<ProductsView>(["grid", "list"]);

const cleanList = (values: readonly string[]): readonly string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) continue;
    const key = normalized.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }
  return result;
};

export const DEFAULT_PRODUCTS_DISCOVERY_STATE: ProductsDiscoveryState = {
  query: "",
  family: "all",
  sizes: [],
  directions: [],
  variants: [],
  codeGroups: [],
  sort: "recommended",
  view: "grid"
};

export function discoveryStateFromSearchParams(params: URLSearchParams): ProductsDiscoveryState {
  const familyValue = params.get("family") ?? "all";
  const sortValue = params.get("sort") ?? "recommended";
  const viewValue = params.get("view") ?? "grid";

  return {
    query: (params.get("q") ?? "").trim(),
    family: FAMILY_SET.has(familyValue) ? familyValue as FamilySlug : "all",
    sizes: cleanList(params.getAll("size")),
    directions: cleanList(params.getAll("direction")),
    variants: cleanList(params.getAll("variant")),
    codeGroups: cleanList(params.getAll("code")),
    sort: SORTS.has(sortValue as ProductsSort) ? sortValue as ProductsSort : "recommended",
    view: VIEWS.has(viewValue as ProductsView) ? viewValue as ProductsView : "grid"
  };
}

export function discoveryStateToSearchParams(state: ProductsDiscoveryState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.query.trim()) params.set("q", state.query.trim());
  if (state.family !== "all") params.set("family", state.family);
  for (const value of state.sizes) params.append("size", value);
  for (const value of state.directions) params.append("direction", value);
  for (const value of state.variants) params.append("variant", value);
  for (const value of state.codeGroups) params.append("code", value);
  if (state.sort !== "recommended") params.set("sort", state.sort);
  if (state.view !== "grid") params.set("view", state.view);
  return params;
}
