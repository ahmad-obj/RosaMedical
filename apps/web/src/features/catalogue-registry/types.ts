import type { FamilySlug } from "@/features/public-catalogue";

export interface CatalogueReference {
  family: string;
  page?: string;
}

export interface CatalogueFamilyRecord {
  slug: FamilySlug;
  sequence: "01" | "02" | "03" | "04" | "05";
  name: string;
  introduction: string;
  catalogueLabel: string;
}

export interface CatalogueProductCode {
  code: string;
  size: string;
}

export interface CatalogueProductRecord {
  id: string;
  familySlug: FamilySlug;
  slug: string;
  name: string;
  code: string;
  description?: string;
  sizes: readonly string[];
  variants: readonly string[];
  directions: readonly string[];
  primaryOption?: string;
  catalogueReference: CatalogueReference;
  mediaLabel: string;
  catalogueCodes?: readonly CatalogueProductCode[];
  mediaAssetId?: string;
  mediaPath?: string;
  mediaFallbackPath?: string;
  mediaIndex?: number;
  mediaSourceUrl?: string;
  mediaReviewNote?: string;
}

export type CatalogueRouteResult =
  | {
      kind: "family";
      family: CatalogueFamilyRecord;
      products: readonly CatalogueProductRecord[];
    }
  | {
      kind: "product";
      family: CatalogueFamilyRecord;
      product: CatalogueProductRecord;
      related: readonly CatalogueProductRecord[];
    }
  | { kind: "not-found" };
