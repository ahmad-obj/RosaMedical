import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  AdminProductArchiveConfirmationPreview,
  AdminProductDuplicateCodePreview,
  AdminProductEditorPage,
  AdminProductListLoadingPreview,
  AdminProductMissingImagePreview,
  AdminProductNoMatchesPreview,
  AdminProductPublishConfirmationPreview,
  AdminProductSensitiveClaimPreview,
  AdminProductsListPage,
  AdminProductsLoadFailurePreview,
  AdminProductTitleWarningPreview,
  getAdminProductEditor
} from "@/features/admin-products";
import { renderServerComponent } from "@/test/render-server-component";

describe("F3E-B product pages", () => {
  it("renders the live product collection boundary without fabricated records", async () => {
    const html = await renderServerComponent(<AdminProductsListPage />);
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect(html).toContain("Manage the instrument catalogue.");
    expect(html).toContain("Showing 0 live products from Supabase.");
    expect(html).toContain("0 live products");
    expect(html).not.toContain("data-preview-only");
  });

  it("keeps unimplemented collection mutations disabled", async () => {
    const html = await renderServerComponent(<AdminProductsListPage />);
    expect(html).not.toContain("<form");
    expect(html).toContain("readonly");
    expect((html.match(/disabled/g) ?? []).length).toBeGreaterThanOrEqual(4);
    expect(html).not.toContain("data-preview-only");
    expect(html).not.toMatch(/126 products|Duplicate Code Record|Blocking error|Today|Yesterday|Featured:/i);
  });

  it("renders a source-backed product editor without mutation behavior", () => {
    const model = getAdminProductEditor("knives", "scalpel-handle-no-3");
    expect(model).toBeDefined();
    const html = renderToStaticMarkup(<AdminProductEditorPage model={model!} />);
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect(html).toContain(model!.product.name);
    expect(html).toContain(model!.product.code);
    expect(html).toContain("Not supplied");
    expect(html).toContain("No managed media file is registered");
    expect(html).toContain("current source-backed public composition");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("data-preview-only");
    expect(html).not.toMatch(/Last saved|Draft differs|Needs review|Publishable|Approved|Complete record/i);
  });

  it("disables every future product mutation", () => {
    const model = getAdminProductEditor("knives", "scalpel-handle-no-3")!;
    const html = renderToStaticMarkup(<AdminProductEditorPage model={model} />);
    for (const label of [
      "Save draft",
      "Submit for review",
      "Publish",
      "Archive",
      "Delete",
      "Add option",
      "Upload media",
      "Replace media"
    ]) {
      expect(html).toContain(label);
    }
    expect((html.match(/disabled/g) ?? []).length).toBeGreaterThanOrEqual(8);
  });

  it("marks every product operational state as preview-only and truthful", () => {
    const html = renderToStaticMarkup(
      <>
        <AdminProductListLoadingPreview />
        <AdminProductNoMatchesPreview />
        <AdminProductsLoadFailurePreview />
        <AdminProductDuplicateCodePreview />
        <AdminProductMissingImagePreview />
        <AdminProductTitleWarningPreview />
        <AdminProductSensitiveClaimPreview />
        <AdminProductArchiveConfirmationPreview />
        <AdminProductPublishConfirmationPreview />
      </>
    );
    expect((html.match(/data-preview-only=/g) ?? [])).toHaveLength(9);
    expect(html).toContain("No validation or operation occurred");
    expect(html).not.toMatch(/Saved successfully|Published successfully|Deleted successfully/i);
  });
});
