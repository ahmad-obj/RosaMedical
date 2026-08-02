import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  AdminCatalogueDetailPage,
  AdminCatalogueProcessingPreview,
  AdminCatalogueReplacementFailurePreview,
  AdminCatalogueReplacementPendingPreview,
  AdminCatalogueSafeReplacementPreview,
  AdminCataloguesPage,
  AdminCatalogueUploadSelectionPreview,
  getAdminCatalogueEditor
} from "@/features/admin-catalogues";
import { renderServerComponent } from "@/test/render-server-component";

describe("F3E-B catalogue pages", () => {
  it("renders the live catalogue collection boundary without fake file metadata", async () => {
    const html = await renderServerComponent(<AdminCataloguesPage />);
    const normalizedHtml = html.replaceAll("<!-- -->", "");
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect(html).toContain("Maintain technical document records.");
    expect(normalizedHtml).toContain("Showing 0 live catalogue records from Supabase.");
    expect(html).not.toMatch(/href="[^"]+\.pdf"/i);
    expect(html).not.toMatch(/\b\d+(?:\.\d+)?\s*(?:KB|MB)\b/i);
    expect(html).not.toContain("data-preview-only");
  });

  it("renders a truthful catalogue detail", () => {
    const model = getAdminCatalogueEditor("knives")!;
    const html = renderToStaticMarkup(<AdminCatalogueDetailPage model={model} />);
    expect(html).toContain(model.document.name);
    expect(html).toContain(model.availability);
    expect(html).toContain("No upload or replacement operation is active");
    expect(html).not.toContain("<form");
    expect((html.match(/disabled/g) ?? []).length).toBeGreaterThanOrEqual(5);
  });

  it("keeps upload and replacement states isolated", () => {
    const html = renderToStaticMarkup(<><AdminCatalogueUploadSelectionPreview /><AdminCatalogueProcessingPreview /><AdminCatalogueReplacementPendingPreview /><AdminCatalogueReplacementFailurePreview /><AdminCatalogueSafeReplacementPreview /></>);
    expect((html.match(/data-preview-only=/g) ?? [])).toHaveLength(5);
    expect(html).toContain("No upload or replacement occurred");
  });
});
