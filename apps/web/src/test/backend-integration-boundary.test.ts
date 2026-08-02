import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const webRoot = process.cwd();
const source = (path: string) => readFileSync(join(webRoot, path), "utf8");

describe("main-first backend integration boundary", () => {
  it("preserves the main-owned Supabase authentication infrastructure", () => {
    for (const path of [
      "src/lib/supabase/client.ts",
      "src/lib/supabase/server.ts",
      "src/lib/supabase/middleware.ts",
      "src/lib/supabase/auth-guard.ts",
      "src/middleware.ts",
      "src/app/admin/(auth)/login/action.ts",
      "src/app/admin/(workspace)/logout-action.ts"
    ]) {
      expect(existsSync(join(webRoot, path)), path).toBe(true);
    }
  });

  it("protects the existing workspace with the main-owned guard", () => {
    const layout = source("src/app/admin/(workspace)/layout.tsx");
    expect(layout).toContain('import { requireAdmin } from "@/lib/supabase/auth-guard"');
    expect(layout).toContain("await requireAdmin()");
  });

  it("preserves current main public and data-management implementations", () => {
    for (const path of [
      "src/app/(public)/checkout/page.tsx",
      "src/app/(public)/checkout/checkout-client.tsx",
      "src/app/(public)/order-success/page.tsx",
      "src/app/login/page.tsx",
      "src/app/api/checkout/route.ts",
      "src/lib/cart/cart-context.tsx",
      "src/lib/supabase/queries.ts",
      "src/lib/supabase/types.ts",
      "src/app/admin/(workspace)/categories/action.ts",
      "src/app/admin/(workspace)/products/action.ts",
      "src/app/admin/(workspace)/messages/action.ts",
      "src/app/admin/(workspace)/site-content/action.ts",
      "src/app/api/contact/route.ts"
    ]) {
      expect(existsSync(join(webRoot, path)), path).toBe(true);
    }
  });

  it("keeps the transferred frontend verification corrections present", () => {
    expect(existsSync(join(webRoot, "src/styles/f3d-safety.css"))).toBe(true);
    expect(existsSync(join(webRoot, "src/test/design-foundations.static.test.mjs"))).toBe(true);
    expect(existsSync(join(webRoot, "src/test/f3e-d-policy.static.test.mjs"))).toBe(true);
  });
});
