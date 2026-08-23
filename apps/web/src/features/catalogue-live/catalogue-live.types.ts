export interface LiveProductRow {
  id: string;
  category_id: string | null;
  item_code: string | null;
  name_en: string;
  name_ar?: string | null;
  description_en: string | null;
  description_ar?: string | null;
  is_active: boolean;
  slug: string;
  created_at: string;
  price: number | string | null;
}

export interface LiveCategoryRow {
  id: string;
  slug: string;
  name_en: string;
  name_ar?: string | null;
  is_active: boolean;
  deleted_at: string | null;
}

export interface LiveVariantRow {
  id: string;
  product_id: string;
  sku: string | null;
  size: string | null;
  variant_type: string | null;
  price_override: number | string | null;
  created_at: string;
}

export interface LiveImageRow {
  product_id: string;
  image_path: string;
  sort_order: number;
}

export interface LiveProductProjectionRow extends LiveProductRow {
  category: LiveCategoryRow | readonly LiveCategoryRow[] | null;
  variants: readonly LiveVariantRow[] | null;
  images: readonly LiveImageRow[] | null;
}

export interface LiveCatalogueSnapshot {
  products: readonly LiveProductRow[];
  categories: readonly LiveCategoryRow[];
  variants: readonly LiveVariantRow[];
  images: readonly LiveImageRow[];
}
