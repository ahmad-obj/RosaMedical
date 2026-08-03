import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CATALOGUE_FAMILIES, CATALOGUE_PRODUCTS } from "@/features/catalogue-registry";
import { CATALOGUE_DOCUMENTS } from "@/features/catalogues";
import {
  AdminMediaImageInUsePreview,
  AdminMediaPage,
  AdminMediaPossibleDuplicatePreview,
  AdminMediaProtectedAssetPreview,
  AdminMediaUnsupportedFormatPreview,
  AdminMediaUploadSelectionPreview,
  getAdminMediaRequirements
} from "@/features/admin-media";
import { renderServerComponent } from "@/test/render-server-component";

describe("F3E-B media requirements", () => {
  it("derives transient requirements from the current catalogue source", () => {
    const requirements = getAdminMediaRequirements();
    expect(requirements).toHaveLength(
      CATALOGUE_PRODUCTS.length + CATALOGUE_DOCUMENTS.length + CATALOGUE_FAMILIES.length
    );
    expect(requirements.filter((item) => item.kind === "product")).toHaveLength(
      CATALOGUE_PRODUCTS.length
    );
    expect(requirements.filter((item) => item.kind === "catalogue-cover")).toHaveLength(5);
    expect(requirements.filter((item) => item.kind === "family-imagery")).toHaveLength(5);
  });

  it("keeps family imagery explicitly derived and excludes ROSA identity", () => {
    const requirements = getAdminMediaRequirements();
    for (const item of requirements.filter((candidate) => candidate.kind === "family-imagery")) {
      expect(item.sourceLabel).toBe("No managed asset registered");
      expect(item.label).toContain("family imagery requirement");
    }
    expect(requirements.some((item) => /ROSA/i.test(item.label))).toBe(false);
  });

  it("renders live media requirements without fabricated assets", async () => {
    const html = await renderServerComponent(<AdminMediaPage />);
    const normalizedHtml = html.replaceAll("<!-- -->", "");
    expect(html).toContain("Purpose-led media requirements.");
    expect(normalizedHtml).toContain("0 live products and 0 live categories in Supabase");
    expect(html).toContain("Protected ROSA identity");
    expect(html).not.toContain("data-admin-media-requirement");
    expect(html).not.toContain("data-preview-only");
    expect(html).not.toMatch(/\.jpg|\.png|\.svg|\.tif|\bKB\b|\bMB\b|\d+ × \d+/i);
  });

  it("keeps media operational states isolated", () => {
    const html = renderToStaticMarkup(
      <>
        <AdminMediaUploadSelectionPreview />
        <AdminMediaUnsupportedFormatPreview />
        <AdminMediaPossibleDuplicatePreview />
        <AdminMediaProtectedAssetPreview />
        <AdminMediaImageInUsePreview />
      </>
    );
    expect((html.match(/data-preview-only=/g) ?? [])).toHaveLength(5);
    expect(html).toContain("No upload, validation or replacement occurred");
  });
});
