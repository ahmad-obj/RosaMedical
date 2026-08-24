import {
  effectiveConfigurationPrice,
  formatSar,
  multiplySar,
  normalizeSarAmount,
  type SarAmount
} from "@/features/pricing";
import type { InquiryItem } from "./inquiry-store";

export interface AuthoritativePricingProduct {
  id: string;
  routeKey?: string;
  name: string;
  code: string;
  priceSar: SarAmount | null;
  isActive: boolean;
}

export interface AuthoritativePricingVariant {
  id: string;
  productId: string;
  sku: string;
  size: string;
  variantType: string;
  priceOverrideSar: SarAmount | null;
}

export interface AuthoritativeQuoteLine {
  sortOrder: number;
  productId: string;
  productVariantId: string | null;
  productName: string;
  productCode: string;
  sku: string;
  size: string;
  variantType: string;
  quantity: number;
  unitPriceSar: SarAmount | null;
  lineSubtotalSar: SarAmount | null;
  notes: string;
}

export interface QuotationRpcItem {
  productId: string;
  productVariantId: string | null;
  productName: string;
  productCode: string;
  sku: string;
  size: string;
  variantType: string;
  quantity: number;
  unitPriceSar: SarAmount | null;
  lineSubtotalSar: SarAmount | null;
  notes: string;
}

export class AuthoritativeQuotationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthoritativeQuotationError";
  }
}

export function resolveAuthoritativeQuoteLines(
  items: readonly InquiryItem[],
  products: readonly AuthoritativePricingProduct[],
  variants: readonly AuthoritativePricingVariant[]
): readonly AuthoritativeQuoteLine[] {
  const productsById = new Map(products.map((product) => [product.id, product] as const));
  const productsByRoute = new Map(
    products.flatMap((product) => product.routeKey ? [[product.routeKey, product] as const] : [])
  );
  const variantsById = new Map(variants.map((variant) => [variant.id, variant] as const));
  const variantCountByProduct = new Map<string, number>();
  for (const variant of variants) {
    variantCountByProduct.set(variant.productId, (variantCountByProduct.get(variant.productId) ?? 0) + 1);
  }

  return items.map((item, sortOrder): AuthoritativeQuoteLine => {
    const requestedRoute = `${item.familySlug}/${item.slug}`;
    const product = productsById.get(item.id) ?? productsByRoute.get(requestedRoute);
    if (!product || !product.isActive || product.routeKey !== requestedRoute) {
      throw new AuthoritativeQuotationError("One or more selected products are unavailable.");
    }

    const productOnlyConfiguration = item.configurationId.startsWith("product:");
    if (productOnlyConfiguration && (variantCountByProduct.get(product.id) ?? 0) > 0) {
      throw new AuthoritativeQuotationError("One or more selected product configurations are unavailable.");
    }

    const variant = productOnlyConfiguration ? undefined : variantsById.get(item.configurationId);
    if (!productOnlyConfiguration && (!variant || variant.productId !== product.id)) {
      throw new AuthoritativeQuotationError("One or more selected product configurations are unavailable.");
    }

    const unitPriceSar = effectiveConfigurationPrice(product.priceSar, variant?.priceOverrideSar);

    return {
      sortOrder,
      productId: product.id,
      productVariantId: variant?.id ?? null,
      productName: product.name,
      productCode: product.code,
      sku: variant?.sku || product.code,
      size: variant?.size || item.size,
      variantType: variant?.variantType || item.variant,
      quantity: item.quantity,
      unitPriceSar,
      lineSubtotalSar: unitPriceSar ? multiplySar(unitPriceSar, item.quantity) : null,
      notes: item.notes
    };
  });
}

export function quotationLinesForRpc(
  lines: readonly AuthoritativeQuoteLine[]
): readonly QuotationRpcItem[] {
  return lines.map(({ sortOrder: _sortOrder, ...line }) => line);
}

export function formatAuthoritativeQuotationMessage(
  context: { company: string; country: string; notes: string },
  lines: readonly AuthoritativeQuoteLine[]
): string {
  const productLines = lines.map((line, index) => [
    `${index + 1}. ${line.productName}`,
    `Code: ${line.productCode}`,
    `SKU: ${line.sku || line.productCode}`,
    `Size: ${line.size || "Not specified"}`,
    `Variant: ${line.variantType || "Not specified"}`,
    `Quantity: ${line.quantity}`,
    `Unit price: ${line.unitPriceSar ? formatSar(line.unitPriceSar, "en") : "Price on request"}`,
    `Line subtotal: ${line.lineSubtotalSar ? formatSar(line.lineSubtotalSar, "en") : "Price on request"}`,
    line.notes ? `Line note: ${line.notes}` : null
  ].filter((value): value is string => value !== null).join(" | "));

  return [
    "Quotation request",
    context.company ? `Company: ${context.company}` : null,
    context.country ? `Country: ${context.country}` : null,
    "",
    "Selected products:",
    ...productLines,
    context.notes ? "" : null,
    context.notes ? `General notes: ${context.notes}` : null
  ].filter((value): value is string => value !== null).join("\n");
}

export function mapAuthoritativeProductRow(row: {
  id: string;
  name_en: string;
  item_code: string | null;
  price: string | number | null;
  is_active: boolean;
}, routeKey?: string): AuthoritativePricingProduct {
  return {
    id: row.id,
    ...(routeKey ? { routeKey } : {}),
    name: row.name_en,
    code: row.item_code ?? "",
    priceSar: normalizeSarAmount(row.price),
    isActive: row.is_active
  };
}

export function mapAuthoritativeVariantRow(row: {
  id: string;
  product_id: string;
  sku: string | null;
  size: string | null;
  variant_type: string | null;
  price_override: string | number | null;
}): AuthoritativePricingVariant {
  return {
    id: row.id,
    productId: row.product_id,
    sku: row.sku?.trim() ?? "",
    size: row.size?.trim() ?? "",
    variantType: row.variant_type?.trim() ?? "",
    priceOverrideSar: normalizeSarAmount(row.price_override)
  };
}
