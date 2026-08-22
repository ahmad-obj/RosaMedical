# Public Redesign Integration + Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove the client redesign works coherently across all five public pages, all required breakpoints, Arabic/RTL, reduced motion, and the exact Cloudflare/OpenNext production build contract before transfer to `roseMedicalFinal/main`.

**Architecture:** Add cross-route regression coverage and a final deployment evidence record. Fix only defects reproduced by the integration matrix. Preserve the existing Cloudflare workflow, OpenNext config, Wrangler config, package-manager contract, and public routing unless a concrete build failure proves a minimal compatibility edit is necessary.

**Tech Stack:** Vitest, Playwright, Next.js 16.2.11, OpenNext Cloudflare, Wrangler 4.118.

**Spec:** `docs/superpowers/specs/2026-08-22-client-products-site-shell-redesign-design.md`

## Global Constraints

- Main routes: `/`, `/about`, `/products`, `/inquiry`, `/contact`.
- Same five-link header on all five.
- Same reusable four-slide banner implementation on all five.
- Same red contact/social strip followed by the same black footer on all five.
- No hero CTA buttons.
- No unsupported YouTube/social link.
- Products includes search/filter/grid, direct contact band, five catalogues, quotation CTA.
- Inquiry remains quotation-only.
- No fabricated numeric prices or unsupported product metadata.
- Responsive widths: 390, 768, 1024, 1366, 1920, 2560.
- No horizontal page overflow.
- Arabic/RTL and reduced motion remain functional.
- Current Cloudflare workflow uses `npx opennextjs-cloudflare build` then `npx wrangler deploy` from `apps/web`.

---

### Task 0: Establish an immutable pre-implementation checkpoint

**Files:**
- No source files.

- [ ] **Step 1: Create a checkpoint branch before the first implementation commit**

```bash
git switch transfer/rose-medical-final-main-ready-2026-08-17
git branch checkpoint/pre-client-products-redesign-2026-08-22
```

- [ ] **Step 2: Record the checkpoint SHA**

```bash
git rev-parse checkpoint/pre-client-products-redesign-2026-08-22
```

This branch is the stable baseline used for final deployment-config diffing and rollback.

### Task 1: Add cross-route static integration contracts

**Files:**
- Create: `apps/web/src/test/client-public-redesign-integration.test.tsx`

- [ ] **Step 1: Write shell composition tests**

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

  it("renders one contact strip before one black footer", () => {
    const shell = source("src/components/layout/public-shell.tsx");
    expect(shell.match(/<PublicContactStrip \/>/g)?.length).toBe(1);
    expect(shell.indexOf("<PublicContactStrip />")).toBeGreaterThan(shell.indexOf("</main>"));
    expect(shell.indexOf("<footer")).toBeGreaterThan(shell.indexOf("<PublicContactStrip />"));
  });
});
```

- [ ] **Step 2: Add page hero assertions**

Require:

```text
Home     -> PublicHeroCarousel page="home"
About    -> PublicHeroCarousel page="about"
Products -> PublicHeroCarousel page="products"
Inquiry  -> PublicHeroCarousel page="inquiry"
Contact  -> PublicHeroCarousel page="contact"
```

Also assert none of these page components renders its own `PublicContactStrip` or `site-footer`.

- [ ] **Step 3: Assert no hero CTA rendering**

```ts
const carousel = source("src/features/public-hero/public-hero-carousel.tsx");
expect(carousel).not.toContain("ctas.map");
expect(carousel).not.toContain("hero__actions");
```

- [ ] **Step 4: Assert no fabricated price literals in redesigned product UI**

Scan redesigned Products/Product Detail source files for numeric `SAR` literals. `Price on request` is allowed.

- [ ] **Step 5: Run the integration contract**

```bash
pnpm --filter @rosa/web test -- src/test/client-public-redesign-integration.test.tsx
```

Expected after implementation: PASS.

### Task 2: Add the six-width browser matrix

**Files:**
- Create: `apps/web/tests/e2e/client-public-redesign-integration.spec.ts`

**Interfaces:**

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

- [ ] **Step 2: Smoke every route at every width**

For each of the 30 route×width cases assert:

- ROSA header exists;
- shared public hero exists;
- four hero dots exist;
- red `.public-contact-strip` exists once;
- `.site-footer` exists once;
- no horizontal overflow.

Keep deep behavior testing in focused specs rather than repeating it across all 30 smoke cases.

- [ ] **Step 3: Assert footer vertical order**

```ts
const contactBox = await page.locator(".public-contact-strip").boundingBox();
const footerBox = await page.locator(".site-footer").boundingBox();
expect(contactBox).not.toBeNull();
expect(footerBox).not.toBeNull();
expect(contactBox!.y).toBeLessThan(footerBox!.y);
```

- [ ] **Step 4: Assert Products sections at 390 and 1366**

Verify search, family filter control, result region, direct contact band, five catalogue cards, and quotation CTA.

- [ ] **Step 5: Guard approved About geometry**

At 1366 verify Business Growth text area is wider than its image area and all three story media frames remain present.

- [ ] **Step 6: Run**

```bash
pnpm --filter @rosa/web test:e2e -- tests/e2e/client-public-redesign-integration.spec.ts
```

Expected after implementation: PASS.

### Task 3: Verify Arabic/RTL

**Files:**
- Modify: `apps/web/tests/e2e/client-public-redesign-integration.spec.ts`
- Modify only if a test reproduces a defect: `apps/web/src/styles/rtl.css`

- [ ] **Step 1: Test `/ar`, `/ar/about`, `/ar/products`, `/ar/inquiry`, `/ar/contact` at 390 and 1366**

Verify:

- locale boundary uses `dir="rtl"`;
- banner copy is Arabic;
- Products search/filter labels are Arabic;
- Inquiry/Contact copy does not overflow;
- no horizontal page overflow.

- [ ] **Step 2: Keep hero media focal points unchanged unless an actual clipping defect is reproduced**

RTL changes text/layout direction, not the meaning of the source photography.

### Task 4: Verify reduced motion

**Files:**
- Modify: `apps/web/tests/e2e/client-public-redesign-integration.spec.ts`
- Modify only if a defect is reproduced: `apps/web/src/styles/public-hero.css`, `apps/web/src/styles/products-client-redesign.css`, `apps/web/src/styles/client-inquiry-cart.css`, existing reduced-motion stylesheet.

- [ ] **Step 1: Emulate reduced motion**

```ts
await page.emulateMedia({ reducedMotion: "reduce" });
```

- [ ] **Step 2: Assert the active hero slide does not autoplay**

Capture `data-active-slide`, wait longer than `HERO_AUTOPLAY_MS`, assert it is unchanged, then click a dot and assert manual navigation still works.

- [ ] **Step 3: Assert newly added hover/entry treatments do not hide content or require animation to reach final state**

### Task 5: Run complete frontend verification

**Files:**
- No production files unless a command reproduces a real defect.

- [ ] **Step 1: Frozen install**

```bash
pnpm install --frozen-lockfile
```

- [ ] **Step 2: Focused unit tests**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
pnpm --filter @rosa/web test -- src/test/products-catalogue-access.test.tsx
pnpm --filter @rosa/web test -- src/test/client-public-redesign-integration.test.tsx
```

- [ ] **Step 3: Full unit suite**

```bash
pnpm --filter @rosa/web test
```

Expected: exit 0; no new skip used to bypass redesign failures.

- [ ] **Step 4: Lint**

```bash
pnpm --filter @rosa/web lint
```

Expected: exit 0.

- [ ] **Step 5: TypeScript**

```bash
pnpm --filter @rosa/web typecheck
```

Expected: exit 0.

- [ ] **Step 6: Next production build**

```bash
pnpm --filter @rosa/web build
```

Expected: exit 0.

- [ ] **Step 7: Focused Playwright**

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
- Reference only: root/workspace package and lock files.

The current GitHub workflow uses Node 22, pnpm 8, `pnpm install --frozen-lockfile`, then from `apps/web`:

```bash
npx opennextjs-cloudflare build
npx wrangler deploy
```

- [ ] **Step 1: Verify deployment files did not drift from the checkpoint**

```bash
git diff checkpoint/pre-client-products-redesign-2026-08-22...HEAD -- \
  .github/workflows/deploy.yml \
  apps/web/open-next.config.ts \
  apps/web/wrangler.jsonc \
  package.json \
  pnpm-lock.yaml \
  pnpm-workspace.yaml
```

Expected: no unintended deployment-contract changes.

- [ ] **Step 2: Run OpenNext build from `apps/web` with the same required environment variables as CI**

```bash
cd apps/web
npx opennextjs-cloudflare build
```

Expected: exit 0.

If required secrets are unavailable locally, execute this build in the repository CI environment with the real secret set; do not substitute fabricated values that alter runtime configuration.

- [ ] **Step 3: Do not locally run production `wrangler deploy` without explicit deployment approval/credentials**

The destination GitHub Actions run is the production deployment proof.

### Task 7: Record verification evidence

**Files:**
- Create: `docs/review/2026-08-22-client-products-redesign-verification.md`

- [ ] **Step 1: Record immutable SHAs**

Run and copy the outputs into the review document:

```bash
git rev-parse checkpoint/pre-client-products-redesign-2026-08-22
git rev-parse HEAD
```

At transfer time also run:

```bash
git fetch final main
git rev-parse refs/remotes/final/main
```

- [ ] **Step 2: Record command outputs without pre-filling success**

Use:

```markdown
| Gate | Command | Actual result |
| --- | --- | --- |
| Unit | `pnpm --filter @rosa/web test` | copy observed output |
| TypeScript | `pnpm --filter @rosa/web typecheck` | copy observed output |
| Lint | `pnpm --filter @rosa/web lint` | copy observed output |
| Next build | `pnpm --filter @rosa/web build` | copy observed output |
| OpenNext | `cd apps/web && npx opennextjs-cloudflare build` | copy observed output |
| Browser | focused Playwright commands | copy observed output |
```

- [ ] **Step 3: Record intentional limitations**

State explicitly:

- numeric product price is unavailable in the current data contract;
- Products therefore uses `Price on request`;
- payment checkout is intentionally absent;
- `/catalogues` remains a supporting route, not a primary navigation item.

- [ ] **Step 4: Commit only after evidence exists**

```bash
git add docs/review/2026-08-22-client-products-redesign-verification.md
git commit -m "docs: record client products redesign verification"
```

### Task 8: Transfer to `Ahmad-Ali-Shah/roseMedicalFinal/main`

This task happens only after all pre-transfer gates above are green.

- [ ] **Step 1: Fetch current destination main and save its SHA**

```bash
git fetch final main
DESTINATION_MAIN_SHA=$(git rev-parse refs/remotes/final/main)
printf '%s\n' "$DESTINATION_MAIN_SHA"
```

- [ ] **Step 2: Create destination backup branch**

```bash
git push final refs/remotes/final/main:refs/heads/backup/pre-client-products-redesign-2026-08-22
```

- [ ] **Step 3: Replace destination main with a fresh force-with-lease**

```bash
git push final HEAD:refs/heads/main --force-with-lease=refs/heads/main:$DESTINATION_MAIN_SHA
```

This refuses the replacement if destination `main` changed after the fetch.

- [ ] **Step 4: Verify the destination `Deploy to Cloudflare Workers` run for the pushed commit**

If it fails, inspect the exact failed job step/log before changing source or deployment configuration.

- [ ] **Step 5: Smoke deployed routes after workflow success**

Check:

```text
/
/about
/products
/inquiry
/contact
```

Then check one canonical Product Detail route and one catalogue PDF URL.

## Final Exit Gate

Client review is allowed only when fresh evidence supports all of these:

- shared shell/banner/footer consistency;
- real catalogue-backed Products discovery;
- Product Detail quantity/note Add to Inquiry;
- functional quotation basket review;
- five catalogue open/download paths;
- no fake product data/prices;
- no overflow at 390/768/1024/1366/1920/2560;
- Arabic/RTL and reduced-motion focused tests pass;
- unit/lint/typecheck/Next build pass;
- OpenNext Cloudflare build passes;
- destination Cloudflare workflow passes after transfer.
