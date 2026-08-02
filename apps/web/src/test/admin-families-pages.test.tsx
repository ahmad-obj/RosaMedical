import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  AdminFamiliesPage,
  AdminFamilyEditorPage,
  getAdminFamilyEditor
} from "@/features/admin-families";
import { renderServerComponent } from "@/test/render-server-component";

describe("F3E-B family pages", () => {
  it("renders the live family collection boundary without fabricated records", async () => {
    const html = await renderServerComponent(<AdminFamiliesPage />);
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect(html).toContain("Organise the five instrument families.");
    expect(html).toContain("Showing 0 live families from Supabase.");
    expect(html).not.toContain("data-admin-family-card");
    expect(html).not.toContain("data-preview-only");
  });

  it("renders a read-only family editor", () => {
    const model = getAdminFamilyEditor("knives")!;
    const html = renderToStaticMarkup(<AdminFamilyEditorPage model={model} />);
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect(html).toContain(model.family.name);
    expect(html).toContain("Not supplied");
    expect(html).toContain("No family content, imagery, featured assignment or catalogue file can be changed here.");
    expect(html).toContain("Awaiting publication");
    expect(html).not.toContain("<form");
    expect(html).not.toMatch(/Last updated:\s*\S|Published on|data-published-status/i);
  });
});
