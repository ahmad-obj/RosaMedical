import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { metadata as adminMetadata } from "@/app/admin/layout";
import {
  AdminLoginPage,
  AdminRecoveryPage
} from "@/features/admin-auth-preview";
import { AdminDashboardPage } from "@/features/admin-dashboard";
import { AdminDeferredRoutePage } from "@/features/admin-routing";
import { renderServerComponent } from "@/test/render-server-component";

describe("F3E-A route composition", () => {
  it("marks the complete admin tree noindex and nofollow", () => {
    expect(adminMetadata.robots).toEqual({
      index: false,
      follow: false
    });
  });

  it("renders a truthful deferred route without management controls", () => {
    const html = renderToStaticMarkup(<AdminDeferredRoutePage routeKey="products" />);
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect(html).toContain("Products management composition is scheduled for the next admin catalogue milestone.");
    expect(html).not.toMatch(/Create product|Save|Delete|Publish now/i);
    expect(html).not.toContain("<form");
  });

  it("renders live login and dashboard boundaries without preview-only states", async () => {
    const html = await renderServerComponent(
      <>
        <AdminLoginPage />
        <AdminRecoveryPage />
        <AdminDashboardPage />
      </>
    );
    expect(html).not.toContain("data-preview-only");
    expect((html.match(/<form/g) ?? [])).toHaveLength(1);
    expect(html).toContain("Sign in to the Rosa workspace.");
    expect(html).toContain("Rosa workspace overview.");
    expect(html).not.toMatch(/Recovery-sent preview|Invalid-credentials preview|Saved successfully/i);
  });
});
