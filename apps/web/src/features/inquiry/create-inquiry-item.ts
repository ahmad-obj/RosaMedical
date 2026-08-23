import type { CatalogueProductRecord } from "@/features/catalogue-registry";
import { createInquiryLineId, type InquiryItem } from "./inquiry-store";

export function createInquiryItemFromProduct(
  product: CatalogueProductRecord,
  overrides: Partial<Pick<InquiryItem, "size" | "variant" | "quantity" | "notes">> = {}
): InquiryItem {
  const configurationId = `product:${product.id}`;
  return {
    lineId: createInquiryLineId(product.id, configurationId),
    id: product.id,
    familySlug: product.familySlug,
    slug: product.slug,
    name: product.name,
    code: product.code,
    configurationId,
    sku: product.code,
    size: overrides.size ?? product.primaryOption ?? "Standard",
    variant: overrides.variant ?? product.primaryOption ?? "Standard",
    quantity: overrides.quantity ?? 1,
    notes: overrides.notes ?? "",
    unitPriceSar: product.basePriceSar ?? null,
    currency: "SAR",
    ...(product.mediaPath ? { mediaPath: product.mediaPath } : {}),
    ...(product.mediaFallbackPath ? { mediaFallbackPath: product.mediaFallbackPath } : {}),
    ...(product.mediaLabel ? { imageLabel: product.mediaLabel } : {})
  };
}
