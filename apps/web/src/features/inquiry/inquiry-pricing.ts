import {
  halalasToSar,
  multiplySar,
  sarToHalalas,
  type SarAmount
} from "@/features/pricing";
import type { InquiryItem } from "./inquiry-store";

export interface InquiryPricingSummary {
  pricedSubtotalSar: SarAmount | null;
  unpricedLineCount: number;
  unpricedQuantity: number;
  totalSar: SarAmount | null;
  allPriced: boolean;
  allUnpriced: boolean;
}

export function inquiryLineSubtotal(item: InquiryItem): SarAmount | null {
  return item.unitPriceSar === null
    ? null
    : multiplySar(item.unitPriceSar, item.quantity);
}

export function summarizeInquiryPricing(
  items: readonly InquiryItem[]
): InquiryPricingSummary {
  let pricedSubtotalHalalas = 0n;
  let pricedLineCount = 0;
  let unpricedLineCount = 0;
  let unpricedQuantity = 0;

  for (const item of items) {
    const subtotal = inquiryLineSubtotal(item);
    if (subtotal === null) {
      unpricedLineCount += 1;
      unpricedQuantity += item.quantity;
      continue;
    }
    pricedLineCount += 1;
    pricedSubtotalHalalas += sarToHalalas(subtotal);
  }

  const pricedSubtotalSar = pricedLineCount > 0
    ? halalasToSar(pricedSubtotalHalalas)
    : null;
  const allPriced = items.length > 0 && unpricedLineCount === 0;
  const allUnpriced = items.length > 0 && pricedLineCount === 0;

  return {
    pricedSubtotalSar,
    unpricedLineCount,
    unpricedQuantity,
    totalSar: allPriced ? pricedSubtotalSar : null,
    allPriced,
    allUnpriced
  };
}
