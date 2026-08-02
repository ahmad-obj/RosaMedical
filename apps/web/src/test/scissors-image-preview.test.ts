import { describe, expect, it } from "vitest";
import { SCISSOR_PRODUCTS } from "@/features/catalogue-registry/products/scissors";
import { config as middlewareConfig } from "@/middleware";

const expectedCodes = [
  "04-0800",
  "05-0802",
  "06-0802",
  "04-0901",
  "05-0901",
  "06-0901",
  "04-0101",
  "05-0101",
  "06-0101",
  "04-0401",
  "05-0401",
  "06-0401",
  "04-1901",
  "05-1901",
  "06-1901"
] as const;

describe("Scissors image batch 01", () => {
  it("keeps all 15 exact catalogue codes", () => {
    expect(SCISSOR_PRODUCTS).toHaveLength(15);
    expect(SCISSOR_PRODUCTS.map((product) => product.code)).toEqual(expectedCodes);
  });

  it("uses one clean external reference per instrument family", () => {
    const media = SCISSOR_PRODUCTS.map((product) => product.mediaPath);

    expect(new Set(media).size).toBe(5);
    expect(media.every((value) => value?.startsWith("https://"))).toBe(true);
    expect(media.some((value) => value?.includes("Thorhi-tools"))).toBe(false);
  });

  it("keeps external imagery visibly review-only in the data contract", () => {
    for (const product of SCISSOR_PRODUCTS) {
      expect(product.mediaSourceUrl?.startsWith("https://")).toBe(true);
      expect(product.mediaReviewNote).toContain("External reference");
      expect(product.mediaReviewNote).toContain("review only");
    }
  });

  it("preserves the established Mayo product route used by inquiry previews", () => {
    expect(SCISSOR_PRODUCTS.find((product) => product.code === "04-0401")?.slug).toBe(
      "mayo-scissors"
    );
  });

  it("does not require Supabase middleware for public catalogue routes", () => {
    expect(middlewareConfig.matcher).toEqual(["/admin/:path*"]);
  });
});
