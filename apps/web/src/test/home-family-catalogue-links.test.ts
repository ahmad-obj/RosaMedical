import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CATALOGUE_DOCUMENTS } from "@/features/catalogues";

const source = readFileSync(
  resolve(process.cwd(), "src/features/homepage/sections/home-family-gallery.tsx"),
  "utf8"
);

describe("Home catalogue cover navigation", () => {
  it("keeps one real PDF document for every Rosa product family", () => {
    expect(CATALOGUE_DOCUMENTS).toHaveLength(5);
    expect(new Set(CATALOGUE_DOCUMENTS.map((document) => document.familySlug)).size).toBe(5);
    expect(CATALOGUE_DOCUMENTS.every((document) => document.pdfPath.endsWith(".pdf"))).toBe(true);
  });

  it("uses catalogue PDF paths rather than family-page hrefs", () => {
    expect(source).toContain("getCatalogueDocument");
    expect(source).toContain("document.pdfPath");
    expect(source).not.toContain("familyHref(");
  });
});
