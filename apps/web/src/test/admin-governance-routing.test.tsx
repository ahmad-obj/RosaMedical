import { describe, expect, it } from "vitest";
import {
  AdminGovernanceRouteView,
  isAdminGovernanceRoot,
  resolveAdminGovernanceRoute
} from "@/features/admin-governance-routing";
import { renderServerComponent } from "@/test/render-server-component";

describe("F3E-D governance routing", () => {
  it.each([
    { segments: ["content"], expected: "content" },
    { segments: ["contact-details"], expected: "contact-details" },
    { segments: ["publishing"], expected: "publishing" },
    { segments: ["revisions"], expected: "revisions" },
    { segments: ["settings"], expected: "settings" }
  ] as const)("resolves exact route $segments", ({ segments, expected }) => {
    expect(resolveAdminGovernanceRoute(segments).kind).toBe(expected);
  });

  it.each([
    { segments: [] },
    { segments: ["content", "example"] },
    { segments: ["contact-details", "example"] },
    { segments: ["publishing", "example"] },
    { segments: ["revisions", "example"] },
    { segments: ["settings", "example"] },
    { segments: ["unknown"] }
  ] as const)("rejects unsupported shape $segments", ({ segments }) => {
    expect(resolveAdminGovernanceRoute(segments).kind).toBe("not-found");
  });

  it("renders normal route views without preview-only states", async () => {
    const html = await renderServerComponent(
      <AdminGovernanceRouteView result={{ kind: "content" }} />
    );
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect(html).not.toContain("data-preview-only");
  });

  it("owns only the five governance roots", () => {
    expect(isAdminGovernanceRoot("content")).toBe(true);
    expect(isAdminGovernanceRoot("products")).toBe(false);
  });
});
