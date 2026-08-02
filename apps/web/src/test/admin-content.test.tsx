import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CATALOGUE_FAMILIES } from "@/features/catalogue-registry";
import {
  AdminContentPage,
  getAdminContentBlocks,
  getAdminHomepageComposition
} from "@/features/admin-content";
import {
  AdminContentBlockEditorPreview,
  AdminContentLocaleEditingPreview,
  AdminContentPublicComparisonPreview,
  AdminContentReviewConfirmationPreview,
  AdminContentSaveConfirmationPreview,
  AdminContentSaveFailurePreview,
  AdminContentSaveLoadingPreview,
  AdminContentSensitiveCopyWarningPreview,
  AdminContentValidationWarningPreview
} from "@/features/admin-content/admin-content-preview-states";
import { selectFeaturedProducts } from "@/features/public-catalogue";
import { renderServerComponent } from "@/test/render-server-component";

describe("F3E-D Admin Content", () => {
  it("derives six blocks and current homepage composition", () => {
    expect(getAdminContentBlocks()).toHaveLength(6);
    const composition = getAdminHomepageComposition();
    expect(composition.families).toHaveLength(CATALOGUE_FAMILIES.length);
    expect(composition.products).toEqual(selectFeaturedProducts());
  });

  it("renders approved content blocks through the live settings boundary", async () => {
    const html = await renderServerComponent(<AdminContentPage />);
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect((html.match(/data-admin-content-block=/g) ?? [])).toHaveLength(6);
    expect(html).toContain("Edit approved content, not the design.");
    expect(html).toContain("Content values are pulled dynamically from the site_settings table in Supabase.");
    expect(html).toContain("Current frontend composition");
    expect(html).not.toContain("data-preview-only");
    expect(html).not.toContain("<form");
    expect(html).not.toMatch(/Last saved|Revision \d+|Published today|Needs review/i);
  });

  it("keeps all nine operational examples preview-only", () => {
    const html = renderToStaticMarkup(<>
      <AdminContentBlockEditorPreview />
      <AdminContentLocaleEditingPreview />
      <AdminContentValidationWarningPreview />
      <AdminContentSensitiveCopyWarningPreview />
      <AdminContentSaveLoadingPreview />
      <AdminContentSaveFailurePreview />
      <AdminContentSaveConfirmationPreview />
      <AdminContentReviewConfirmationPreview />
      <AdminContentPublicComparisonPreview />
    </>);
    expect((html.match(/data-preview-only=/g) ?? [])).toHaveLength(9);
    expect(html).toContain("No content, contact, publishing, revision or setting operation occurred");
  });
});
