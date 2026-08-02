import { describe, expect, it } from "vitest";
import { CATALOGUE_FAMILIES, CATALOGUE_PRODUCTS } from "@/features/catalogue-registry";
import {
  AdminManagementRouteView,
  isAdminManagementRoot,
  resolveAdminManagementRoute
} from "@/features/admin-management-routing";
import { renderServerComponent } from "@/test/render-server-component";

describe("F3E-B management routing", () => {
  it("resolves every approved list and detail shape", () => {
    expect(resolveAdminManagementRoute(["products"]).kind).toBe("products");
    expect(resolveAdminManagementRoute(["families"]).kind).toBe("families");
    expect(resolveAdminManagementRoute(["catalogues"]).kind).toBe("catalogues");
    expect(resolveAdminManagementRoute(["media"]).kind).toBe("media");

    for (const product of CATALOGUE_PRODUCTS) {
      expect(resolveAdminManagementRoute(["products", product.familySlug, product.slug]).kind).toBe("product");
    }
    for (const family of CATALOGUE_FAMILIES) {
      expect(resolveAdminManagementRoute(["families", family.slug]).kind).toBe("family");
      expect(resolveAdminManagementRoute(["catalogues", family.slug]).kind).toBe("catalogue");
    }
  });

  it.each([
    { segments: [] },
    { segments: ["products", "knives"] },
    { segments: ["products", "knives", "scalpel-handle-no-3", "extra"] },
    { segments: ["families", "knives", "extra"] },
    { segments: ["catalogues", "knives", "extra"] },
    { segments: ["media", "extra"] },
    { segments: ["products", "scissors", "scalpel-handle-no-3"] },
    { segments: ["unknown"] }
  ] as const)("returns not-found for unsupported shape $segments", ({ segments }) => {
    expect(resolveAdminManagementRoute(segments).kind).toBe("not-found");
  });

  it("identifies only the four F3E-B roots", () => {
    expect(["products", "families", "catalogues", "media"].every(isAdminManagementRoot)).toBe(true);
    expect(isAdminManagementRoot("inquiries")).toBe(false);
  });

  it("renders normal routes without preview-only states", async () => {
    const result = resolveAdminManagementRoute(["products"]);
    const html = await renderServerComponent(<AdminManagementRouteView result={result} />);
    expect(html).not.toContain("data-preview-only");
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
  });
});
