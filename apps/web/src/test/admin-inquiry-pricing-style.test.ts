import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Admin inquiry pricing layout", () => {
  it("loads a dedicated responsive quotation snapshot stylesheet", () => {
    const globals = source("src/app/globals.css");
    expect(globals).toContain('@import "../styles/admin-inquiry-pricing.css";');
  });

  it("keeps structured lines horizontally safe and totals visually distinct", () => {
    const css = source("src/styles/admin-inquiry-pricing.css");
    expect(css).toContain("overflow-x: auto");
    expect(css).toContain("font-variant-numeric: tabular-nums");
    expect(css).toContain(".admin-inquiry-pricing__summary");
    expect(css).toContain("@media (max-width: 48rem)");
  });
});
