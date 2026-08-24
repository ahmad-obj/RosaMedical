import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("quotation checkout integrity", () => {
  it("loads authoritative product/variant pricing and creates parent + lines through one RPC", () => {
    const route = source("src/app/api/checkout/route.ts");
    expect(route).toContain("resolveAuthoritativeQuoteLines");
    expect(route).toContain('from("products")');
    expect(route).toContain('from("product_variants")');
    expect(route).toContain('rpc("create_quote_request_with_items"');
    expect(route).toContain("quotationLinesForRpc");
    expect(route).not.toMatch(/\.from\("quote_requests"\)[\s\S]*?\.insert\(/);
  });

  it("translates the unique cart hash race into the existing duplicate response", () => {
    const route = source("src/app/api/checkout/route.ts");
    expect(route).toContain('error.code === "23505"');
    expect(route).toContain("This exact quotation request has already been submitted.");
  });
});
