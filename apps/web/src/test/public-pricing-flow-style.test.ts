import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("public pricing flow layout", () => {
  it("loads pricing flow styles after the product/client redesign layers", () => {
    const globals = source("src/app/globals.css");
    expect(globals).toContain('@import "../styles/public-pricing-flow.css";');
  });

  it("styles configuration selection, live price state and inquiry line pricing responsively", () => {
    const css = source("src/styles/public-pricing-flow.css");
    expect(css).toContain(".product-configuration-selector");
    expect(css).toContain(".product-price-state");
    expect(css).toContain(".inquiry-preview-line__pricing");
    expect(css).toContain("font-variant-numeric: tabular-nums");
    expect(css).toContain("@media (max-width: 48rem)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
