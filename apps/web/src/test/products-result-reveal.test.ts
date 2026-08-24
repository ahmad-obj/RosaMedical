import { describe, expect, it } from "vitest";
import {
  alignProductsVisibleCount,
  initialProductsVisibleCount,
  nextProductsVisibleCount
} from "@/features/products/products-result-reveal";

describe("Products result reveal", () => {
  it("uses complete initial rows for grid layouts", () => {
    expect(initialProductsVisibleCount(5, "grid")).toBe(15);
    expect(initialProductsVisibleCount(4, "grid")).toBe(12);
    expect(initialProductsVisibleCount(3, "grid")).toBe(9);
    expect(initialProductsVisibleCount(2, "grid")).toBe(8);
    expect(initialProductsVisibleCount(1, "grid")).toBe(6);
  });

  it("reveals two additional complete grid rows", () => {
    expect(nextProductsVisibleCount(15, 80, 5, "grid")).toBe(25);
    expect(nextProductsVisibleCount(12, 80, 4, "grid")).toBe(20);
    expect(nextProductsVisibleCount(9, 80, 3, "grid")).toBe(15);
    expect(nextProductsVisibleCount(8, 80, 2, "grid")).toBe(12);
  });

  it("allows a partial row only when it is the real end of the result set", () => {
    expect(nextProductsVisibleCount(20, 22, 4, "grid")).toBe(22);
    expect(nextProductsVisibleCount(22, 22, 4, "grid")).toBe(22);
  });

  it("rounds upward after a column-count change without hiding revealed products", () => {
    expect(alignProductsVisibleCount(20, 80, 3, "grid")).toBe(21);
    expect(alignProductsVisibleCount(20, 80, 5, "grid")).toBe(20);
    expect(alignProductsVisibleCount(20, 20, 3, "grid")).toBe(20);
  });

  it("keeps list mode independent from grid row arithmetic", () => {
    expect(initialProductsVisibleCount(4, "list")).toBe(8);
    expect(nextProductsVisibleCount(8, 40, 4, "list")).toBe(16);
    expect(alignProductsVisibleCount(13, 40, 4, "list")).toBe(13);
  });
});
