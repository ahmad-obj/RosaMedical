import { access } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SCISSOR_PRODUCTS } from "@/features/catalogue-registry/products/scissors";

const expected = [
  ["04-0800", "scissors-iris-regular.avif"],
  ["05-0802", "scissors-iris-super-cut.avif"],
  ["06-0802", "scissors-iris-tc.avif"],
  ["04-0901", "scissors-stevens-regular.avif"],
  ["05-0901", "scissors-stevens-super-cut.avif"],
  ["06-0901", "scissors-stevens-tc.avif"],
  ["04-0101", "scissors-operating-regular.avif"],
  ["05-0101", "scissors-operating-super-cut.avif"],
  ["06-0101", "scissors-operating-tc.avif"],
  ["04-0401", "scissors-mayo-regular.avif"],
  ["05-0401", "scissors-mayo-super-cut.avif"],
  ["06-0401", "scissors-mayo-tc.avif"],
  ["04-1901", "scissors-metzenbaum-regular.avif"],
  ["05-1901", "scissors-metzenbaum-super-cut.avif"],
  ["06-1901", "scissors-metzenbaum-tc.avif"]
] as const;

describe("Scissors image batch 01", () => {
  it("publishes exactly the 15 review records with exact codes and media paths", () => {
    expect(SCISSOR_PRODUCTS).toHaveLength(15);
    expect(SCISSOR_PRODUCTS.map((product) => [product.code, product.mediaPath])).toEqual(
      expected.map(([code, file]) => [code, `/media/scissors-preview/${file}`])
    );
  });

  it("stores every referenced AVIF in the public media directory", async () => {
    for (const [, file] of expected) {
      await access(path.resolve(process.cwd(), "public/media/scissors-preview", file));
    }
  });
});
