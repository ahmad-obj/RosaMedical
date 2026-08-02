import { access } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SCISSOR_PRODUCTS } from "@/features/catalogue-registry/products/scissors";

const expectedCodes = [
  "04-0800", "05-0802", "06-0802",
  "04-0901", "05-0901", "06-0901",
  "04-0101", "05-0101", "06-0101",
  "04-0401", "05-0401", "06-0401",
  "04-1901", "05-1901", "06-1901"
] as const;

const spritePath = "/media/scissors-preview/scissors-batch-01.webp";

describe("Scissors image batch 01", () => {
  it("publishes exactly the 15 review records with exact codes and sprite positions", () => {
    expect(SCISSOR_PRODUCTS).toHaveLength(15);
    expect(SCISSOR_PRODUCTS.map((product) => product.code)).toEqual(expectedCodes);
    expect(SCISSOR_PRODUCTS.map((product) => product.mediaPath)).toEqual(
      Array.from({ length: 15 }, () => spritePath)
    );
    expect(SCISSOR_PRODUCTS.map((product) => product.mediaIndex)).toEqual(
      Array.from({ length: 15 }, (_, index) => index)
    );
  });

  it("stores the review sprite in the public media directory", async () => {
    await access(path.resolve(process.cwd(), "public/media/scissors-preview/scissors-batch-01.webp"));
  });
});
