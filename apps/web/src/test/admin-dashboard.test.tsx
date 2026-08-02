import { describe, expect, it } from "vitest";
import {
  CATALOGUE_FAMILIES,
  CATALOGUE_PRODUCTS
} from "@/features/catalogue-registry";
import { CATALOGUE_DOCUMENTS } from "@/features/catalogues";
import {
  AdminDashboardPage,
  getAdminDashboardModel
} from "@/features/admin-dashboard";
import { renderServerComponent } from "@/test/render-server-component";

describe("F3E-A dashboard", () => {
  it("derives catalogue metrics from existing registries", () => {
    const model = getAdminDashboardModel();
    expect(model.catalogueMetrics).toEqual([
      { key: "families", label: "Product families", value: CATALOGUE_FAMILIES.length, href: "/admin/families" },
      { key: "products", label: "Registered products", value: CATALOGUE_PRODUCTS.length, href: "/admin/products" },
      { key: "catalogues", label: "Catalogue documents", value: CATALOGUE_DOCUMENTS.length, href: "/admin/catalogues" }
    ]);
  });

  it("keeps the static model free of invented operational counts", () => {
    const model = getAdminDashboardModel();
    expect(model.operationalMetrics).toEqual([
      { key: "inquiries", label: "Quotation inquiries" },
      { key: "messages", label: "General messages" }
    ]);
    expect(JSON.stringify(model.operationalMetrics)).not.toMatch(/value|count|total/);
  });

  it("contains the five approved readiness dependencies", () => {
    expect(getAdminDashboardModel().readinessItems).toHaveLength(5);
  });

  it("renders catalogue metrics and live operational count boundaries without fake analytics", async () => {
    const html = await renderServerComponent(<AdminDashboardPage />);
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect(html).toContain("Rosa workspace overview.");
    expect(html).toContain("Product families");
    expect(html).toContain(">5<");
    expect(html).toContain(">20<");
    expect((html.match(/>0</g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(html).not.toMatch(/revenue|orders|sales|growth|conversion|uptime/i);
    expect(html).not.toContain("data-preview-only");
  });
});
