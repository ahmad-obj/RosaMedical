import { describe, expect, it } from "vitest";
import { SCISSOR_PRODUCTS } from "@/features/catalogue-registry/products/scissors";
import { config as middlewareConfig } from "@/middleware";

describe("Scissors image batch 01", () => {
  it("groups the catalogue into 42 visible configurations", () => {
    expect(SCISSOR_PRODUCTS).toHaveLength(42);
    expect(
      SCISSOR_PRODUCTS.flatMap((product) => product.catalogueCodes ?? [])
    ).toHaveLength(132);
  });

  it("keeps every Scissors configuration linked to a unique media asset ID", () => {
    const mediaAssetIds = SCISSOR_PRODUCTS.map((product) => product.mediaAssetId);

    expect(mediaAssetIds.every((value) => Boolean(value))).toBe(true);
    expect(new Set(mediaAssetIds).size).toBe(42);
  });

  it("does not retain temporary external runtime images", () => {
    for (const product of SCISSOR_PRODUCTS) {
      expect(product.mediaPath).toBeUndefined();
      expect(product.mediaFallbackPath).toBeUndefined();
      expect(product.mediaSourceUrl).toBeUndefined();
      expect(product.mediaReviewNote).toBeUndefined();
    }
  });

  it("preserves the established Mayo product route used by inquiry previews", () => {
    const mayo = SCISSOR_PRODUCTS.find((product) => product.slug === "mayo-scissors");

    expect(mayo?.code).toBe("04-0401");
    expect(mayo?.catalogueCodes?.[0]).toEqual({
      code: "04-0401",
      size: "14.5 cm"
    });
  });

  it("does not require Supabase middleware for public catalogue routes", () => {
    expect(middlewareConfig.matcher).toEqual(["/admin/:path*"]);
  });
});
