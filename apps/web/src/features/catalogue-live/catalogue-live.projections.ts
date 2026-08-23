import type {
  LiveCatalogueSnapshot,
  LiveCategoryRow,
  LiveImageRow,
  LiveProductProjectionRow,
  LiveProductRow,
  LiveVariantRow
} from "./catalogue-live.types";

function embeddedCategory(
  value: LiveProductProjectionRow["category"]
): LiveCategoryRow | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value as LiveCategoryRow | null;
}

export function projectionRowsToSnapshot(
  rows: readonly LiveProductProjectionRow[]
): LiveCatalogueSnapshot {
  const categoriesById = new Map<string, LiveCategoryRow>();
  const products: LiveProductRow[] = [];
  const variants: LiveVariantRow[] = [];
  const images: LiveImageRow[] = [];

  for (const row of rows) {
    const category = embeddedCategory(row.category);
    if (category) categoriesById.set(category.id, category);

    products.push({
      id: row.id,
      category_id: row.category_id,
      item_code: row.item_code,
      name_en: row.name_en,
      ...(row.name_ar !== undefined ? { name_ar: row.name_ar } : {}),
      description_en: row.description_en,
      ...(row.description_ar !== undefined ? { description_ar: row.description_ar } : {}),
      is_active: row.is_active,
      slug: row.slug,
      created_at: row.created_at,
      price: row.price
    });

    variants.push(...(row.variants ?? []));
    images.push(...(row.images ?? []));
  }

  variants.sort((left, right) => left.created_at.localeCompare(right.created_at));
  images.sort((left, right) => left.sort_order - right.sort_order);

  return {
    products,
    categories: [...categoriesById.values()],
    variants,
    images
  };
}
