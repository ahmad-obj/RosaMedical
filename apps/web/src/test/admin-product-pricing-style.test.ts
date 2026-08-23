import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Admin product pricing layout", () => {
  it("imports a focused responsive pricing stylesheet after the legacy admin foundation", () => {
    const globals = source("src/app/globals.css");
    expect(globals).toContain('@import "../styles/admin-product-pricing.css";');
  });

  it("keeps variant price editing compact, focus-visible and mobile-safe", () => {
    const css = source("src/styles/admin-product-pricing.css");
    expect(css).toContain(".admin-variant-price-form");
    expect(css).toContain(":focus-visible");
    expect(css).toContain("minmax(7.5rem, 1fr)");
    expect(css).toContain("@media (max-width: 48rem)");
  });
});
