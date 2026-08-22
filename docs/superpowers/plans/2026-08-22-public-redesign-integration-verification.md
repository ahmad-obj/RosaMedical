# Public Redesign Integration + Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove the client redesign works coherently across all five public pages, all required breakpoints, Arabic/RTL, reduced motion, and the exact Cloudflare/OpenNext production build contract before the transfer branch is moved into `roseMedicalFinal/main`.

**Architecture:** This plan adds cross-route regression coverage and records deployment evidence; it does not introduce a new product feature. Fix only issues reproduced by the integration matrix. The final transfer branch must retain the current Cloudflare workflow and deployment files unchanged unless a concrete production-build defect proves a minimal compatibility edit is necessary.

**Tech Stack:** Vitest, Playwright, Next.js build, OpenNext Cloudflare, Wrangler, existing deployment workflow.

**Spec:** `docs/superpowers/specs/2026-08-22-client-products-site-shell-redesign-design.md`

## Global Constraints

- Five main routes: `/`, `/about`, `/products`, `/inquiry`, `/contact`.
- Same five-link header on all five.
- Same four-slide shared banner implementation on all five.
- Same red contact/social strip followed by same black footer on all five.
- No hero CTA buttons.
- No unsupported YouTube/social link.
- Products includes search/filter/grid, direct contact band, five catalogues, quotation CTA.
- Inquiry remains quotation-only.
- No fake numeric prices.
- Responsive widths: 390, 768, 1024, 1366, 1920, ~2560.
- No horizontal overflow.
- Arabic/RTL and reduced motion must remain functional.
- Cloudflare workflow remains `Deploy to Cloudflare Workers` and uses `npx opennextjs-cloudflare build` followed by `npx wrangler deploy`.

---

### Task 1: Add cross-route static integration contracts

**Files:**
- Create: `apps/web/src/test/client-public-redesign-integration.test.tsx`

- [ ] **Step 1: Write shell/page composition assertions**

```ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("client public redesign integration", () => {
  it("keeps exactly five primary navigation routes", () => {
    const shell = source("src/components/layout/public-shell.tsx");
    const primary = shell.slice(shell.indexOf("const primaryLinks"), shell.indexOf("const utilityLinks"));
    for (const href of ["/", "/about", "/products", "/inquiry", "/contact"]) {
      expect(primary).toContain(`"${href}"`);
    }
    expect(primary).not.toContain("/catalogues");
    expect(primary).not.toContain("/search");
  });

  it("renders one shared contact strip before one black footer", () => {
    const shell = source("src/components/layout/public-shell.tsx");
    expect(shell.match(/<PublicContactStrip \/>/g)?.length).toBe(1);
    expect(shell.indexOf("<PublicContactStrip />")).toBeGreaterThan(shell.indexOf("</main>"));
    expect(shell.indexOf("<footer")).toBeGreaterThan(shell.indexOf("<PublicContactStrip />"));
  });
});
```

- [ ] **Step 2: Add page-specific composition assertions**

Require:

- Home uses `PublicHeroCarousel page="home"`;
- About uses `page="about"`;
- Products uses `page="products"`;
- Inquiry uses `page="inquiry"`;
- Contact uses `page="contact"`;
- no page renders a local `PublicContactStrip` or `site-footer`.

- [ ] **Step 3: Assert no hero CTA rendering**

```ts
const carousel = source("src/features/public-hero/public-hero-carousel.tsx");
expect(carousel).not.toContain("ctas.map");
expect(carousel).not.toContain("hero__actions");
```

- [ ] **Step 4: Assert no fabricated price literals in redesigned product UI**

Scan only redesigned Products/Product Detail files for `SAR` numeric literals. The phrase `Price on request` is allowed.

- [ ] **Step 5: Run RED/GREEN as integration work lands**

```bash
pnpm --filter @rosa/web test -- src/test/client-public-redesign-integration.test.tsx
```

### Task 2: Add the six-width browser matrix

**Files:**
- Create: `apps/web/tests/e2e/client-public-redesign-integration.spec.ts`

**Interfaces:**

Use:

```ts
const widths = [390, 768, 1024, 1366, 1920, 2560] as const;
const routes = ["/", "/about", "/products", "/inquiry", "/contact"] as const;
```

- [ ] **Step 1: Add a reusable overflow assertion**

```ts
async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
}
```

- [ ] **Step 2: For every route/width, assert shared shell landmarks**

Each case must verify:

- ROSA header visible;
- five primary navigation links available on desktop or represented in mobile navigation;
- one shared hero carousel section;
- four hero dot controls;
- one red contact strip;
- one black footer;
- no horizontal overflow.

Do not multiply expensive full interaction tests across all 30 route×width combinations; use one smoke assertion per combination and keep deeper interaction tests in focused specs.

- [ ] **Step 3: Assert footer order using DOM positions**

```ts
const contactBox = await page.locator(".public-contact-strip").boundingBox();
const footerBox = await page.locator(".site-footer").boundingBox();
expect(contactBox).not.toBeNull();
expect(footerBox).not.toBeNull();
expect(contactBox!.y).toBeLessThan(footerBox!.y);
```

- [ ] **Step 4: Assert Products-specific sections at representative widths**

At 1366 and 390 verify:

- search input;
- family filter UI;
- products result region;
- direct contact band;
- five catalogue document cards;
- quotation CTA.

- [ ] **Step 5: Assert About approved geometry is not regressed**

At 1366:

- Business Growth text column is wider than image column;
- the three About story images retain hover zoom affordance through CSS class presence;
- compliance/document sections remain in their approved responsive structures.

- [ ] **Step 6: Run the matrix**

```bash
pnpm --filter @rosa/web test:e2e -- tests/e2e/client-public-redesign-integration.spec.ts
```

### Task 3: Verify Arabic/RTL integration

**Files:**
- Modify: `apps/web/tests/e2e/client-public-redesign-integration.spec.ts`
- Modify only if broken: `apps/web/src/styles/rtl.css`

- [ ] **Step 1: Add Arabic route smoke cases**

Test at minimum:

```text
/ar
/ar/about
/ar/products
/ar/inquiry
/ar/contact
```

At 390 and 1366 verify:

- `<html>` or locale boundary uses `dir="rtl"`;
- localized banner copy renders;
- Products search/filter labels render Arabic;
- Inquiry/Contact page copy does not overflow;
- no horizontal page overflow.

- [ ] **Step 2: Verify logical layout rather than forcing mirrored imagery**

Do not change hero focal points merely because RTL is active. Only text/layout direction should respond unless a concrete clipping issue is reproduced.

- [ ] **Step 3: Run focused Arabic cases**

Use Playwright `--grep` if the spec separates them by title.

### Task 4: Verify reduced-motion behavior

**Files:**
- Modify: `apps/web/tests/e2e/client-public-redesign-integration.spec.ts`
- Modify only if broken: `apps/web/src/styles/public-hero.css`, `products-client-redesign.css`, `client-inquiry-cart.css`, existing reduced-motion stylesheet.

- [ ] **Step 1: Emulate reduced motion**

```ts
await page.emulateMedia({ reducedMotion: "reduce" });
```

Verify:

- shared hero does not autoplay while reduced motion is active;
- active slide remains stable during a wait longer than `HERO_AUTOPLAY_MS`;
- interactive navigation by dot still works;
- product/catalogue/About hover transforms are disabled or non-animated as specified;
- no content remains hidden waiting for animation.

- [ ] **Step 2: Run focused reduced-motion test**

### Task 5: Run complete frontend verification

**Files:**
- No production modification unless a command reproduces a defect.

- [ ] **Step 1: Install exactly from lockfile**

```bash
pnpm install --frozen-lockfile
```

- [ ] **Step 2: Run focused redesign unit tests**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
pnpm --filter @rosa/web test -- src/test/products-catalogue-access.test.tsx
pnpm --filter @rosa/web test -- src/test/client-public-redesign-integration.test.tsx
```

- [ ] **Step 3: Run the full web unit suite**

```bash
pnpm --filter @rosa/web test
```

Expected: exit 0. Existing intentional skips may remain only if already documented; no new skip may be introduced to bypass redesign failures.

- [ ] **Step 4: Run lint**

```bash
pnpm --filter @rosa/web lint
```

Expected: exit 0.

- [ ] **Step 5: Run TypeScript**

```bash
pnpm --filter @rosa/web typecheck
```

Expected: exit 0.

- [ ] **Step 6: Run normal Next.js production build**

```bash
pnpm --filter @rosa/web build
```

Expected: exit 0.

- [ ] **Step 7: Run focused browser suites**

```bash
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-client-redesign.spec.ts
pnpm --filter @rosa/web test:e2e -- tests/e2e/client-inquiry-cart-redesign.spec.ts
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-catalogue-access.spec.ts
pnpm --filter @rosa/web test:e2e -- tests/e2e/client-public-redesign-integration.spec.ts
```

Expected: exit 0.

### Task 6: Reproduce the exact Cloudflare production build contract

**Files:**
- Reference only: `.github/workflows/deploy.yml`
- Reference only: `apps/web/open-next.config.ts`
- Reference only: `apps/web/wrangler.jsonc`
- Reference only: workspace lockfile/package files.

The current workflow uses Node 22, pnpm 8, frozen install, then from `apps/web`:

```bash
npx opennextjs-cloudflare build
npx wrangler deploy
```

Do not run `wrangler deploy` against production from a local verification environment unless explicit deployment credentials/approval are provided. The mandatory pre-transfer proof is the OpenNext build; actual deploy is proven by the destination repository workflow after main is updated.

- [ ] **Step 1: Verify workflow/config files have no redesign diff**

```bash
git diff <pre-redesign-sha>...HEAD -- .github/workflows/deploy.yml apps/web/open-next.config.ts apps/web/wrangler.jsonc package.json pnpm-lock.yaml pnpm-workspace.yaml
```

Expected: no unintended deployment-contract changes.

- [ ] **Step 2: Run OpenNext build exactly from `apps/web`**

```bash
cd apps/web
npx opennextjs-cloudflare build
```

Use the same required environment variables as the workflow. If local secrets are unavailable, run this in the repository CI environment with the same secret set rather than substituting fake values that change build behavior.

Expected: exit 0.

- [ ] **Step 3: Do not claim deployment success yet**

A successful OpenNext build proves deployability of the bundle, not the destination Cloudflare deployment. Final deployment status is checked after the prepared branch is moved into `Ahmad-Ali-Shah/roseMedicalFinal` `main` and its `Deploy to Cloudflare Workers` workflow completes.

### Task 7: Record verification and transfer state

**Files:**
- Create: `docs/review/2026-08-22-client-products-redesign-verification.md`

- [ ] **Step 1: Record immutable SHAs**

Include:

- pre-redesign transfer branch SHA;
- final redesign SHA;
- current destination `roseMedicalFinal/main` SHA at transfer time;
- backup branch name created before replacement.

- [ ] **Step 2: Record every command and actual result**

Use a table:

```markdown
| Gate | Command | Result |
| --- | --- | --- |
| Unit | `pnpm --filter @rosa/web test` | `PASS: ...` |
| TypeScript | `pnpm --filter @rosa/web typecheck` | `PASS` |
| Lint | `pnpm --filter @rosa/web lint` | `PASS` |
| Next build | `pnpm --filter @rosa/web build` | `PASS` |
| OpenNext | `cd apps/web && npx opennextjs-cloudflare build` | `PASS` |
| Browser | focused Playwright commands | `PASS: ...` |
```

Do not pre-fill PASS. Write the actual observed result after running each command.

- [ ] **Step 3: Record known intentional limitations**

Explicitly state:

- numeric product price remains unavailable until a real data contract exists;
- Products therefore displays `Price on request`;
- payment checkout is intentionally absent;
- standalone `/catalogues` remains supporting, not primary navigation.

- [ ] **Step 4: Commit the verification record only after fresh evidence exists**

```bash
git add docs/review/2026-08-22-client-products-redesign-verification.md
git commit -m "docs: record client products redesign verification"
```

### Task 8: Destination transfer/deployment check

This step happens only after the final branch is manually transferred to `Ahmad-Ali-Shah/roseMedicalFinal/main`.

- [ ] **Step 1: Create a backup of destination main before replacement**

```bash
git fetch final main
git push final refs/remotes/final/main:refs/heads/backup/pre-client-products-redesign-2026-08-22
```

- [ ] **Step 2: Replace destination main with force-with-lease**

Use the freshly fetched destination SHA, not a stale SHA from an earlier chat:

```bash
git push final HEAD:refs/heads/main --force-with-lease=refs/heads/main:<FRESH_DESTINATION_MAIN_SHA>
```

`<FRESH_DESTINATION_MAIN_SHA>` is a command-time value, not a plan placeholder to guess; obtain it with `git rev-parse refs/remotes/final/main` immediately before the push.

- [ ] **Step 3: Check destination GitHub Actions**

Verify the `Deploy to Cloudflare Workers` run created by the new `main` commit.

- [ ] **Step 4: If deployment fails, inspect the failed job step/log before editing code**

Classify the failure as install, OpenNext build, environment, or Wrangler deploy. Do not randomly alter Cloudflare config.

- [ ] **Step 5: Smoke the deployed public routes only after workflow success**

Check:

```text
/
/about
/products
/inquiry
/contact
```

Then verify one Product Detail route and one catalogue PDF URL.

## Final Exit Gate

The redesign is eligible for client review only when fresh evidence supports all of these statements:

- shared shell/banner/footer behavior is consistent;
- Products discovery works with real public catalogue data;
- Product Detail adds to the quotation inquiry with quantity/notes;
- Inquiry review works;
- all five catalogue PDFs open/download from Products;
- no fake prices/data were introduced;
- 390/768/1024/1366/1920/2560 layouts have no page overflow;
- Arabic/RTL and reduced-motion focused tests pass;
- unit/lint/typecheck/Next build pass;
- OpenNext Cloudflare build passes;
- destination deployment workflow passes after transfer.
