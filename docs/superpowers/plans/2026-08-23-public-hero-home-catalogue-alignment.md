# Public Hero + Homepage Catalogue/Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all five main-page banners geometrically identical to Home, repair the third mobile hero asset, route Homepage catalogue covers directly to real PDFs, and align/enlarge the Plastic Surgery lead visual on the shared 80rem content rail.

**Architecture:** `PublicHeroCarousel` becomes the only hero geometry source. Homepage cover navigation consumes `CATALOGUE_DOCUMENTS` instead of family routes. The Comprehensive Plans lead and supporting rows share one 80rem geometry contract, with the lead grid locked to a larger Plastic Surgery column.

**Tech Stack:** Next.js, React, CSS, Motion React, Vitest, Playwright, Python/Pillow for one deterministic image derivative.

**Spec:** `docs/superpowers/specs/2026-08-23-products-pricing-navigation-polish-design.md`

## Global Constraints

- Preserve the existing four-slide media/copy architecture and interactions.
- Do not re-add hero CTA buttons.
- Do not degrade desktop hero imagery to mobile derivatives.
- Mobile slide 3 must be repaired, not hidden.
- Homepage catalogue covers open existing PDFs; Product Detail routes are unaffected.
- Comprehensive Plans images retain `object-fit`/focal handling with no distortion.
- Final desktop Comprehensive lead grid is exactly `minmax(16rem, 0.95fr) minmax(0, 1.75fr)`.

---

### Task 1: Lock shared-hero geometry parity with failing tests

**Files:**
- Create: `apps/web/src/test/public-hero-geometry-contract.test.ts`
- Create/modify: `apps/web/tests/e2e/public-hero-geometry.spec.ts`
- Modify: `apps/web/src/styles/public-hero.css`
- Modify: `apps/web/src/styles/home-client-redesign.css`
- Modify: `apps/web/src/features/public-hero/public-hero-carousel.tsx`

**Interfaces:**
- Consumes: `PublicHeroCarousel({ page, locale, headingId })`.
- Produces: one CSS geometry contract with no required Home-only hero sizing override.

- [ ] **Step 1: Write static regression assertions**

```ts
expect(publicHeroCss).toContain("min-height: clamp(23.5rem, 44vw, 31rem)");
expect(publicHeroCss).toContain("height: min(57svh, 31rem)");
expect(publicHeroCss).toContain("height: min(71svh, 35rem)");
expect(homeCss).not.toMatch(/public-page--home[^}]*home-hero[^}]*height:/s);
```

Also assert `PublicHeroCarousel` does not rely on a Home-only selector for sizing.

- [ ] **Step 2: Write browser geometry parity test**

```ts
const routes = ["/", "/about", "/products", "/inquiry", "/contact"];
```

For 390x844, 768x1024, 1366x768 and 1920x1080, measure `.public-hero-carousel` bounding boxes. At each viewport every non-Home page must match Home width/height within 1 CSS pixel.

- [ ] **Step 3: Run tests and verify RED**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-geometry-contract.test.ts
pnpm --filter @rosa/web exec playwright test tests/e2e/public-hero-geometry.spec.ts
```

- [ ] **Step 4: Move all hero sizing to `public-hero.css`**

Canonical rules remain:

```css
.public-hero-carousel {
  min-height: clamp(23.5rem, 44vw, 31rem);
  height: min(57svh, 31rem);
}

@media (max-height: 800px) and (min-width: 64.001rem) {
  .public-hero-carousel {
    min-height: 22.5rem;
    height: min(55svh, 27rem);
  }
}

@media (max-width: 40rem) {
  .public-hero-carousel {
    min-height: 31rem;
    height: min(71svh, 35rem);
  }
}
```

Remove only duplicate Home-scoped hero dimensions from `home-client-redesign.css`; keep unrelated Home styling.

- [ ] **Step 5: Normalize carousel classes**

Use public classes as the authoritative component classes. If a legacy `home-hero-*` class is temporarily retained because unrelated CSS still selects a descendant, remove the Home-specific geometry dependency in the same task and add a regression assertion proving public classes alone define dimensions.

- [ ] **Step 6: Re-run focused tests and commit**

```bash
git add apps/web/src/features/public-hero apps/web/src/styles/public-hero.css apps/web/src/styles/home-client-redesign.css apps/web/src/test/public-hero-geometry-contract.test.ts apps/web/tests/e2e/public-hero-geometry.spec.ts
git commit -m "fix(hero): unify main page banner geometry"
```

---

### Task 2: Repair and validate the third mobile hero asset

**Files:**
- Replace: `apps/web/public/media/editorial/home-hero/client-v5/hero-03-mobile.webp`
- Test: `apps/web/src/test/public-hero-mobile-assets.test.ts`
- Test: `apps/web/tests/e2e/public-hero-mobile-media.spec.ts`
- Source: `apps/web/public/media/editorial/home-hero/client-v5/hero-03-desktop.webp`

**Interfaces:**
- Produces a valid 900x1200 WebP at the existing mobile path.

- [ ] **Step 1: Write RIFF/WebP integrity test for all four mobile assets**

```ts
const image = readFileSync(path);
expect(image.subarray(0, 4).toString("ascii")).toBe("RIFF");
expect(image.subarray(8, 12).toString("ascii")).toBe("WEBP");
expect(image.readUInt32LE(4) + 8).toBe(image.length);
```

Loop `hero-01-mobile.webp` through `hero-04-mobile.webp`.

- [ ] **Step 2: Run and prove current slide 3 fails**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-mobile-assets.test.ts
```

- [ ] **Step 3: Generate the replacement deterministically**

Preflight:

```bash
python3 -c "from PIL import Image, ImageOps; print('Pillow ready')"
```

Generate from the valid desktop WebP using a focal-aware portrait crop centered at the existing mobile focal approximately 54% x / 48% y, target 900x1200, high-quality Lanczos resize and WebP quality 88.

The execution task must use a short reproducible Python/Pillow script saved temporarily under `/tmp` or `tools/` during generation, inspect the result, then keep only the generated asset unless the project decides the generator itself is useful long-term.

- [ ] **Step 4: Add browser decode test**

At 390px navigate carousel to slide 3 and assert active image `naturalWidth > 0`, `naturalHeight > 0`, and the phone source resolves to `hero-03-mobile.webp`.

- [ ] **Step 5: Run asset/browser tests and commit**

```bash
git add apps/web/public/media/editorial/home-hero/client-v5/hero-03-mobile.webp apps/web/src/test/public-hero-mobile-assets.test.ts apps/web/tests/e2e/public-hero-mobile-media.spec.ts
git commit -m "fix(hero): repair third mobile banner asset"
```

---

### Task 3: Change Homepage catalogue covers to authoritative PDFs

**Files:**
- Modify: `apps/web/src/features/homepage/sections/home-family-gallery.tsx`
- Reuse: `CATALOGUE_DOCUMENTS` from `apps/web/src/features/catalogues/`
- Test: create/update `apps/web/src/test/home-family-catalogue-links.test.tsx`
- Browser: `apps/web/tests/e2e/home-catalogue-links.spec.ts`

**Interfaces:**
- Produces a `cataloguePdfByFamilySlug` mapping derived from `CATALOGUE_DOCUMENTS`.

- [ ] **Step 1: Write failing component test**

Every family cover href must equal its document `pdfPath`, not `familyHref(slug)`.

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Replace family-route dependency**

Remove `familyHref` from `home-family-gallery.tsx`. Build mapping once from `CATALOGUE_DOCUMENTS`, then render:

```tsx
<a
  className="home-family-gallery__link"
  href={document.pdfPath}
  target="_blank"
  rel="noreferrer"
  aria-label={locale === "ar" ? `فتح كتالوج ${family.name}` : `Open ${family.name} catalogue`}
>
```

Keep existing order, artwork, scrolling and hover behavior.

- [ ] **Step 4: Browser verify all five links**

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/homepage/sections/home-family-gallery.tsx apps/web/src/test/home-family-catalogue-links.test.tsx apps/web/tests/e2e/home-catalogue-links.spec.ts
git commit -m "feat(home): open catalogue PDFs from family covers"
```

---

### Task 4: Align and enlarge Plastic Surgery on the common 80rem rail

**Files:**
- Modify: `apps/web/src/styles/client-review-final-polish.css`
- Modify: `apps/web/src/styles/home-client-redesign.css` only to remove a conflicting old 70rem source rule if cleanup is cleaner than override
- Test: `apps/web/src/test/client-review-round-2026-08-22.test.ts`
- Browser: `apps/web/tests/e2e/home-comprehensive-alignment.spec.ts`

**Interfaces:**
- Produces exact final geometry:

```css
.home-comprehensive__lead,
.home-comprehensive__specialties {
  width: 100%;
  max-width: 80rem;
  margin-inline: auto;
}

@media (min-width: 64.001rem) {
  .home-comprehensive__lead {
    grid-template-columns: minmax(16rem, 0.95fr) minmax(0, 1.75fr);
  }
}
```

Tablet keeps the existing two-column responsive intent but the same 80rem outer rail. <=40rem remains one column.

- [ ] **Step 1: Write failing static geometry contract**

Assert both lead/supporting rows resolve to 80rem and the desktop lead ratio is the exact locked value above.

- [ ] **Step 2: Add browser rail test**

At 1366 and 1920 compare `getBoundingClientRect().left/right` of `.home-comprehensive__lead` and `.home-comprehensive__specialties`; both outer bounds must match within 2px.

Also assert the lead image width is greater than its pre-change/reference threshold established by the test fixture/screenshot.

- [ ] **Step 3: Implement one final-loaded geometry rule**

Prefer `client-review-final-polish.css` as the final review override and delete conflicting obsolete 70rem declarations where safe.

- [ ] **Step 4: Run focused tests + screenshots**

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/styles/client-review-final-polish.css apps/web/src/styles/home-client-redesign.css apps/web/src/test/client-review-round-2026-08-22.test.ts apps/web/tests/e2e/home-comprehensive-alignment.spec.ts
git commit -m "fix(home): align comprehensive plan visual rail"
```

---

### Task 5: Gate A verification

- [ ] **Step 1: Run focused unit tests**

```bash
pnpm --filter @rosa/web test -- \
  src/test/public-hero-geometry-contract.test.ts \
  src/test/public-hero-mobile-assets.test.ts \
  src/test/home-family-catalogue-links.test.tsx \
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

- [ ] **Step 4: Confirm shared red Contact strip and black footer still render exactly once on each main page**

- [ ] **Step 5: Record Gate A commit range before Gate B**
