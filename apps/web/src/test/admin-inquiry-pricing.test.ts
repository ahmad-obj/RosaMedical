import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { summarizeAdminInquiryPricing } from "@/features/admin-inquiries/admin-inquiry-pricing";
import type { QuoteRequestItem } from "@/lib/supabase/types";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

const line = (patch: Partial<QuoteRequestItem> = {}): QuoteRequestItem => ({
  id: "line-1",
  quote_request_id: "quote-1",
  sort_order: 0,
  product_id: "product-1",
  product_variant_id: "variant-1",
  product_name: "Iris Scissors",
  product_code: "04-0901",
  sku: "04-0901-14",
  size: "14 cm",
  variant_type: "Straight",
  quantity: 2,
  unit_price: 120,
  currency: "SAR",
  line_subtotal: 240,
  notes: null,
  created_at: "2026-08-24T00:00:00.000Z",
  ...patch
});

describe("Admin inquiry pricing snapshots", () => {
  it("summarizes complete and mixed snapshot totals without inventing missing prices", () => {
    expect(summarizeAdminInquiryPricing([line(), line({ id: "line-2", sort_order: 1, unit_price: 25.5, line_subtotal: 25.5, quantity: 1 })])).toEqual({
      pricedSubtotalSar: "265.50",
      unpricedLineCount: 0,
      totalSar: "265.50",
      allPriced: true
    });

    expect(summarizeAdminInquiryPricing([line(), line({ id: "line-2", sort_order: 1, unit_price: null, line_subtotal: null, quantity: 3 })])).toEqual({
      pricedSubtotalSar: "240.00",
      unpricedLineCount: 1,
      totalSar: null,
      allPriced: false
    });
  });

  it("loads child snapshots only for owner/admin inquiry reads", () => {
    const route = source("src/app/api/inquiries/route.ts");
    expect(route).toContain("quote_request_items");
    expect(route).toContain("sort_order");
    expect(route).toContain('scope === "mine"');
  });

  it("renders structured pricing when child rows exist and retains legacy message fallback", () => {
    const page = source("src/features/admin-inquiries/admin-inquiries-page.tsx");
    expect(page).toContain("AdminInquiryPricing");
    expect(page).toContain("record.quote_request_items?.length");
    expect(page).toContain("admin-queue-record__message");
  });
});
