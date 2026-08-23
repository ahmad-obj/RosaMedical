# Public Hero + Homepage Catalogue/Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all five main-page banners geometrically identical to Home, repair the third mobile hero asset, route Homepage catalogue covers directly to real PDFs, and align/enlarge the Plastic Surgery lead visual on the shared 80rem content rail.

**Architecture:** `PublicHeroCarousel` becomes the only hero geometry source. Homepage cover navigation consumes `CATALOGUE_DOCUMENTS` instead of family routes. The Comprehensive Plans lead and supporting rows share one 80rem geometry contract.

**Tech Stack:** Next.js, React, CSS, Motion React, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-23-products-pricing-navigation-polish-design.md`

## Global Constraints

- Preserve the existing four-slide media/copy architecture and interactions.
- Do not re-add hero CTA buttons.
- Do not degrade desktop hero imagery to mobile derivatives.
- Mobile slide 3 must be repaired, not hidden.
- Homepage catalogue covers open existing PDFs; Product Detail routes are unaffected.
- Comprehensive Plans images retain `object-fit`/focal handling with no distortion.

---

### Task 1: Lock shared-hero geometry parity with failing tests

**Files:**
- Create: `apps/web/src/test/public-hero-geometry-contract.test.ts`
- Create/modify: `apps/web/tests/e2e/public-hero-geometry.spec.ts`
- Modify later: `apps/web/src/styles/public-hero.css`
- Modify later: `apps/web/src/styles/home-client-redesign.css`
- Modify later: `apps/web/src/features/public-hero/public-hero-carousel.tsx`

**Interfaces:**
- Consumes: `PublicHeroCarousel({ page, locale, headingId })`.
- Produces: one CSS geometry contract with no required Home-only hero sizing override.

- [ ] **Step 1: Write static regression assertions**

The test must assert:

```ts
expect(publicHeroCss).toContain("min-height: clamp(23.5rem, 44vw, 31rem)")
expect(publicHeroCss).toContain("height: min(57svh, 31rem)")
expect(publicHeroCss).toContain("height: min(71svh, 35rem)")
expect(homeCss).not.toMatch(/public-page--home[^}]*home-hero[^}]*height:/s)
```

Also assert `PublicHeroCarousel` no longer needs legacy `home-hero` classes for sizing.

- [ ] **Step 2: Write browser geometry parity test**

For each viewport and route:

```ts
const routes = ["/", "/about", "/products", "/inquiry", "/contact"];
```

Measure:

```ts
const box = await page.locator(".public-hero-carousel").boundingBox();
```

At one viewport, compare every non-Home route to Home within <= 1 CSS pixel for width/height.

Use at least 390x844, 768x1024, 1366x768, 1920x1080.

- [ ] **Step 3: Run tests and verify RED**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-geometry-contract.test.ts
pnpm --filter @rosa/web exec playwright test tests/e2e/public-hero-geometry.spec.ts
```

Expected: current Home-only style coupling causes at least static/browser parity failure.

- [ ] **Step 4: Move all hero sizing to `public-hero.css`**

Keep exact canonical rules there, including short-height desktop and <=40rem phone behavior.

Remove only hero-sizing rules from `home-client-redesign.css`; retain unrelated Home styles.

In `public-hero-carousel.tsx`, normalize class names to public hero classes. If compatibility classes are retained temporarily for unrelated descendant rules, they must not be required for sizing and a cleanup note/test must prove the public classes own geometry.

- [ ] **Step 5: Re-run focused tests**

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/features/public-hero apps/web/src/styles/public-hero.css apps/web/src/styles/home-client-redesign.css apps/web/src/test/public-hero-geometry-contract.test.ts apps/web/tests/e2e/public-hero-geometry.spec.ts
git commit -m "fix(hero): unify main page banner geometry"
```

---

### Task 2: Repair and validate third mobile hero asset

**Files:**
- Replace: `apps/web/public/media/editorial/home-hero/client-v5/hero-03-mobile.webp`
- Test: `apps/web/src/test/public-hero-mobile-assets.test.ts`
- Test: `apps/web/tests/e2e/public-hero-mobile-media.spec.ts`
- Inspect/source: `hero-03-desktop.avif`, `hero-03-desktop.webp`

**Interfaces:**
- Produces: structurally valid portrait/mobile WebP at the existing path; no component path change needed.

- [ ] **Step 1: Write RIFF/WebP integrity test for all four mobile assets**

Pseudo-contract:

```ts
const image = readFileSync(path)
expect(image.subarray(0, 4).toString("ascii")).toBe("RIFF")
expect(image.subarray(8, 12).toString("ascii")).toBe("WEBP")
expect(image.readUInt32LE(4) + 8).toBe(image.length)
```

The test loops `hero-01-mobile.webp` through `hero-04-mobile.webp`.

- [ ] **Step 2: Run test and prove current slide 3 fails**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-mobile-assets.test.ts
```

Expected: FAIL on `hero-03-mobile.webp` declared-vs-actual length.

- [ ] **Step 3: Generate a replacement mobile derivative from a valid source**

Use a local image tool available in the repo/runtime to decode the valid desktop/master source and produce a portrait crop. Preserve subject/gloved-hand visibility. Keep file at the exact existing mobile path.

Target:

- portrait-oriented crop appropriate to <=40rem;
- quality high enough for hero use;
- reasonably compressed;
- WebP integrity exact.

Do not regenerate all desktop assets.

- [ ] **Step 4: Add browser decode test**

At 390px:

```ts
await page.goto("/products")
// navigate carousel to slide 3
const img = page.locator('.public-hero-carousel img')
await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
```

Also assert the picture's active source/request uses `hero-03-mobile.webp` under the phone breakpoint.

- [ ] **Step 5: Run asset + browser tests**

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/public/media/editorial/home-hero/client-v5/hero-03-mobile.webp apps/web/src/test/public-hero-mobile-assets.test.ts apps/web/tests/e2e/public-hero-mobile-media.spec.ts
git commit -m "fix(hero): repair third mobile banner asset"
```

---

### Task 3: Change Homepage catalogue covers to authoritative PDFs

**Files:**
- Modify: `apps/web/src/features/homepage/sections/home-family-gallery.tsx`
- Reuse: `apps/web/src/features/catalogues/*` export providing `CATALOGUE_DOCUMENTS`
- Test: `apps/web/src/test/home-family-gallery.test.tsx` or create `home-family-catalogue-links.test.tsx`
- Browser: `apps/web/tests/e2e/home-catalogue-links.spec.ts`

**Interfaces:**
- Consumes: `CATALOGUE_DOCUMENTS` records `{ familySlug, pdfPath, ... }`.
- Produces: `cataloguePdfByFamilySlug` mapping used by Home gallery.

- [ ] **Step 1: Write failing component test**

For each family slug, assert the rendered cover anchor uses that document's `pdfPath`, not `familyHref(slug)`.

Expected labels:

```text
Open Scissors catalogue
Open Cutters catalogue
...
```

- [ ] **Step 2: Run test and verify RED**

Current component links to family pages.

- [ ] **Step 3: Replace family-route dependency**

Remove `familyHref` import from `home-family-gallery.tsx`.

Create a deterministic mapping from `CATALOGUE_DOCUMENTS`, then render:

```tsx
<a
  className="home-family-gallery__link"
  href={document.pdfPath}
  target="_blank"
  rel="noreferrer"
  aria-label={...}
>
```

Do not change gallery ordering or visual treatment.

- [ ] **Step 4: Browser link acceptance**

Check all five anchors on Home resolve to the same PDF paths used by Products catalogue cards.

- [ ] **Step 5: Run focused tests and commit**

```bash
git add apps/web/src/features/homepage/sections/home-family-gallery.tsx apps/web/src/test apps/web/tests/e2e/home-catalogue-links.spec.ts
git commit -m "feat(home): open catalogue PDFs from family covers"
```

---

### Task 4: Align/enlarge Plastic Surgery lead to the 80rem rail

**Files:**
- Modify: `apps/web/src/styles/client-review-final-polish.css`
- Possibly modify: `apps/web/src/styles/home-client-redesign.css` only if source rule must be normalized rather than overridden
- Test: `apps/web/src/test/client-review-round-2026-08-22.test.ts`
- Browser: `apps/web/tests/e2e/home-comprehensive-alignment.spec.ts`

**Interfaces:**
- Produces: lead and supporting rows with same max visual rail.

- [ ] **Step 1: Write failing static geometry contract**

Assert final-loaded CSS makes both:

```css
.home-comprehensive__lead
.home-comprehensive__specialties
```

resolve to `width: 100%; max-width: 80rem; margin-inline: auto`.

Also lock a larger lead media proportion at desktop, e.g. a grid near:

```css
grid-template-columns: minmax(16rem, 0.95fr) minmax(0, 1.75fr);
```

The exact ratio may be tuned visually but must be committed to one explicit final value, not multiple conflicting overrides.

- [ ] **Step 2: Add browser rail test**

At 1366 and 1920 widths, compare the left x-coordinate of:

- `.home-specialty--lead .home-clinical-media`
- first `.home-comprehensive__specialties .home-clinical-media`

Acceptance tolerance: <= 2px after accounting for intended grid gap/figure structure. If the first card itself does not share exact x because of a deliberate card grid, compare the containing lead/supporting row boundaries and assert they match; use screenshots for final visual sign-off.

- [ ] **Step 3: Implement one final-loaded geometry rule**

Prefer consolidating into `client-review-final-polish.css` because it is intentionally the latest review override.

Mobile <=40rem remains single-column and full-width.

- [ ] **Step 4: Run focused tests/screenshots**

Expected: PASS and visibly aligned left boundary.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/styles/client-review-final-polish.css apps/web/src/test/client-review-round-2026-08-22.test.ts apps/web/tests/e2e/home-comprehensive-alignment.spec.ts
git commit -m "fix(home): align comprehensive plan visual rail"
```

---

### Task 5: Gate A verification

- [ ] **Step 1: Run focused unit tests**

```bash
pnpm --filter @rosa/web test -- \
  src/test/public-hero-geometry-contract.test.ts \
  src/test/public-hero-mobile-assets.test.ts \
  src/test/client-review-round-2026-08-22.test.ts
```

- [ ] **Step 2: Run focused Playwright**

```bash
pnpm --filter @rosa/web exec playwright test \
  tests/e2e/public-hero-geometry.spec.ts \
  tests/e2e/public-hero-mobile-media.spec.ts \
  tests/e2e/home-catalogue-links.spec.ts \
  tests/e2e/home-comprehensive-alignment.spec.ts
```

- [ ] **Step 3: Run strict TypeScript**

```bash
pnpm --filter @rosa/web typecheck
```

- [ ] **Step 4: Review no unintended shell regression**

Check shared red Contact strip and black footer still render once on each main page.

- [ ] **Step 5: Record Gate A commit range before moving to Gate B**
