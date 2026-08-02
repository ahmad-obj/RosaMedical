import { describe, expect, it } from "vitest";
import { SCISSOR_PRODUCTS } from "@/features/catalogue-registry/products/scissors";
import { config as middlewareConfig } from "@/middleware";

const expected = [
  ["04-0800", "scissors-iris-regular.svg"],
  ["05-0802", "scissors-iris-super-cut.svg"],
  ["06-0802", "scissors-iris-tc.svg"],
  ["04-0901", "scissors-stevens-regular.svg"],
  ["05-0901", "scissors-stevens-super-cut.svg"],
  ["06-0901", "scissors-stevens-tc.svg"],
  ["04-0101", "scissors-operating-regular.svg"],
  ["05-0101", "scissors-operating-super-cut.svg"],
  ["06-0101", "scissors-operating-tc.svg"],
  ["04-0401", "scissors-mayo-regular.svg"],
  ["05-0401", "scissors-mayo-super-cut.svg"],
  ["06-0401", "scissors-mayo-tc.svg"],
  ["04-1901", "scissors-metzenbaum-regular.svg"],
  ["05-1901", "scissors-metzenbaum-super-cut.svg"],
  ["06-1901", "scissors-metzenbaum-tc.svg"]
] as const;

const mediaBase = "https://raw.githubusercontent.com/mrman-ahm/Thorhi-tools/preview/scissors-image-batch-01/public/media/scissors-preview";

describe("Scissors image batch 01", () => {
  it("publishes exactly the 15 review records with exact codes and review media", () => {
    expect(SCISSOR_PRODUCTS).toHaveLength(15);
    expect(SCISSOR_PRODUCTS.map((product) => [product.code, product.mediaPath])).toEqual(
      expected.map(([code, file]) => [code, `${mediaBase}/${file}`])
    );
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
