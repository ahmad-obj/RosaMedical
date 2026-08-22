# Products Catalogue Access Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the five Product Categories covers on `/products` into direct catalogue document entry points with both browser-open and download actions using the existing authoritative PDFs.

**Architecture:** Reuse `CATALOGUE_DOCUMENTS`, `CatalogueCover`, localized family names, and the five existing PDF paths. Add one Products-specific document-card section because the client wants the cover itself to open the PDF, while the standalone Catalogues page keeps its existing document/explore semantics. Desktop is five columns, tablet is three columns, and mobile is a horizontal snap rail.

**Tech Stack:** React/Next.js, TypeScript, existing catalogues/public-media modules, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-22-client-products-site-shell-redesign-design.md`

## Global Constraints

- Exactly five documents: Knives, Scissors, Punches, Chisels, Cutters.
- Existing PDF paths in `catalogue-document-model.ts` remain authoritative.
- Cover click opens the PDF in a new browser tab.
- Separate visible Download Catalogue action downloads the same PDF.
- No Downloads main page.
- No duplicated PDF-path constants.
- Use existing approved catalogue-cover artwork.
- Desktop: five columns.
- Tablet: three columns, naturally yielding a 3+2 second row.
- Mobile: horizontal snap rail, not a two-column alternative.

---

### Task 1: Add `ProductsCatalogueCards`

**Files:**
- Create: `apps/web/src/features/products/sections/products-catalogue-cards.tsx`
- Modify if exports are missing: `apps/web/src/features/catalogues/index.ts`
- Create: `apps/web/src/test/products-catalogue-access.test.tsx`

**Interface:**

```tsx
export function ProductsCatalogueCards({
  locale = "en"
}: {
  locale?: PublicLocale;
}): ReactElement
```

- [ ] **Step 1: Write RED contract**

```ts
it("uses authoritative catalogue documents with open and download actions", () => {
  const component = source("src/features/products/sections/products-catalogue-cards.tsx");
  expect(component).toContain("CATALOGUE_DOCUMENTS");
  expect(component).toContain("CatalogueCover");
  expect(component).toContain("document.pdfPath");
  expect(component).toContain('target="_blank"');
  expect(component).toContain("download=");
  expect(component).not.toContain("/downloads");
});
```

- [ ] **Step 2: Run RED**

```bash
pnpm --filter @rosa/web test -- src/test/products-catalogue-access.test.tsx
```

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Export existing catalogue primitives through the feature index**

If missing, add:

```ts
export { CatalogueCover } from "./catalogue-cover";
export { CATALOGUE_DOCUMENTS } from "./catalogue-document-model";
export type { CatalogueDocument } from "./catalogue-document-model";
```

Do not move or duplicate `PDF_PATH_BY_FAMILY`.

- [ ] **Step 4: Implement the exact Products section**

```tsx
import { CATALOGUE_DOCUMENTS, CatalogueCover } from "@/features/catalogues";
import { Container, Section } from "@/components/layout";
import { FAMILY_NAMES_AR } from "@/features/localization/public-copy";
import type { PublicLocale } from "@/features/localization/locales";

export function ProductsCatalogueCards({ locale = "en" }: { locale?: PublicLocale }) {
  const ar = locale === "ar";

  return (
    <Section tone="paper" className="products-catalogue-section" data-section="products-catalogues">
      <Container size="wide">
        <header className="products-catalogue-section__heading">
          <p className="public-eyebrow">{ar ? "الكتالوجات" : "Technical catalogues"}</p>
          <h2>{ar ? "فئات المنتجات" : "Product Categories"}</h2>
        </header>
        <ul className="products-catalogue-grid">
          {CATALOGUE_DOCUMENTS.map((document) => (
            <li key={document.familySlug} data-products-catalogue={document.familySlug}>
              <article className="products-catalogue-card">
                <a
                  className="products-catalogue-card__cover-link"
                  href={document.pdfPath}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={ar
                    ? `فتح كتالوج ${FAMILY_NAMES_AR[document.familySlug]}`
                    : `Open ${document.name} catalogue`}
                >
                  <CatalogueCover document={document} locale={locale} />
                </a>
                <div className="products-catalogue-card__actions">
                  <strong>{ar ? FAMILY_NAMES_AR[document.familySlug] : document.name}</strong>
                  <a
                    className="products-catalogue-card__download"
                    href={document.pdfPath}
                    download={`rosa-${document.familySlug}-catalogue.pdf`}
                  >
                    {ar ? "تنزيل الكتالوج" : "Download catalogue"}
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
```

The cover and download links are siblings; never nest interactive elements.

- [ ] **Step 5: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/products-catalogue-access.test.tsx
git add apps/web/src/features/catalogues/index.ts apps/web/src/features/products/sections/products-catalogue-cards.tsx apps/web/src/test/products-catalogue-access.test.tsx
git commit -m "feat(web): add direct Products catalogue access"
```

### Task 2: Replace temporary `CatalogueSupport` in Products composition

**Files:**
- Modify: `apps/web/src/features/products/products-overview.tsx`
- Modify: `apps/web/src/test/products-catalogue-access.test.tsx`

- [ ] **Step 1: Add RED source-order test**

```ts
const page = source("src/features/products/products-overview.tsx");
expect(page.indexOf("ProductsCatalogueCards")).toBeGreaterThan(page.indexOf("ProductsDirectContactBand"));
expect(page.indexOf("ProductsCatalogueCards")).toBeLessThan(page.indexOf("ProductsProcurementCta"));
expect(page).not.toContain("<CatalogueSupport");
```

- [ ] **Step 2: Replace render**

```tsx
<ProductsDirectContactBand locale={locale} />
<ProductsCatalogueCards locale={locale} />
<ProductsProcurementCta model={model.procurement} />
```

Keep `/catalogues` route and its standalone `CatalogueCard` implementation intact.

- [ ] **Step 3: Grep before deleting the old Products-only support component**

```bash
git grep -n "CatalogueSupport" -- apps/web/src
```

Delete `apps/web/src/features/products/sections/catalogue-support.tsx` only when no other import/test uses it.

- [ ] **Step 4: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/products-catalogue-access.test.tsx
git add apps/web/src/features/products apps/web/src/test/products-catalogue-access.test.tsx
git commit -m "feat(web): place catalogue covers in Products journey"
```

### Task 3: Lock responsive catalogue geometry

**Files:**
- Modify: `apps/web/src/styles/products-client-redesign.css`
- Modify: `apps/web/src/test/products-catalogue-access.test.tsx`

- [ ] **Step 1: Add CSS contract**

Require exact structural rules:

```ts
expect(css).toMatch(/\.products-catalogue-grid[\s\S]*grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/);
expect(css).toMatch(/@media \(max-width: 63\.99rem\)[\s\S]*\.products-catalogue-grid[\s\S]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
expect(css).toMatch(/@media \(max-width: 40rem\)[\s\S]*grid-auto-flow:\s*column[\s\S]*scroll-snap-type:\s*x mandatory/);
```

- [ ] **Step 2: Implement desktop five-column grid**

```css
.products-catalogue-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
  list-style: none;
  margin: 0;
  padding: 0;
}
```

- [ ] **Step 3: Implement tablet 3+2**

```css
@media (max-width: 63.99rem) {
  .products-catalogue-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

- [ ] **Step 4: Implement mobile snap rail**

```css
@media (max-width: 40rem) {
  .products-catalogue-grid {
    grid-template-columns: none;
    grid-auto-flow: column;
    grid-auto-columns: minmax(10rem, 72vw);
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scroll-snap-type: x mandatory;
    scrollbar-width: thin;
    padding-block-end: 0.5rem;
  }

  .products-catalogue-grid > li {
    scroll-snap-align: start;
  }
}
```

- [ ] **Step 5: Add restrained cover interaction**

```css
.products-catalogue-card__cover-link {
  display: block;
  overflow: hidden;
}

.products-catalogue-card__cover-link > * {
  transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (hover: hover) and (pointer: fine) {
  .products-catalogue-card__cover-link:hover > *,
  .products-catalogue-card__cover-link:focus-visible > * {
    transform: scale(1.035);
  }
}

@media (prefers-reduced-motion: reduce) {
  .products-catalogue-card__cover-link > * {
    transition: none;
    transform: none;
  }
}
```

- [ ] **Step 6: Run unit test and commit**

```bash
pnpm --filter @rosa/web test -- src/test/products-catalogue-access.test.tsx
git add apps/web/src/styles/products-client-redesign.css apps/web/src/test/products-catalogue-access.test.tsx
git commit -m "feat(web): lock responsive Products catalogue rail"
```

### Task 4: Add browser open/download/PDF verification

**Files:**
- Create: `apps/web/tests/e2e/products-catalogue-access.spec.ts`

**Exact expected paths:**

```ts
const expected = {
  knives: "/media/catalogues/pdf/rosa-knives-catalogue.pdf",
  scissors: "/media/catalogues/pdf/rosa-scissors-catalogue.pdf",
  punches: "/media/catalogues/pdf/rosa-punches-catalogue.pdf",
  chisels: "/media/catalogues/pdf/rosa-chisels-catalogue.pdf",
  cutters: "/media/catalogues/pdf/rosa-cutters-catalogue.pdf"
} as const;
```

- [ ] **Step 1: Assert five stable card selectors**

```ts
for (const family of Object.keys(expected)) {
  await expect(page.locator(`[data-products-catalogue="${family}"]`)).toHaveCount(1);
}
```

- [ ] **Step 2: Assert open/download href equality**

For each family:

- cover link href ends with the expected PDF;
- cover link target is `_blank`;
- download link href ends with the same PDF;
- download attribute equals `rosa-${family}-catalogue.pdf`.

- [ ] **Step 3: Verify each static PDF is actually served**

```ts
const response = await page.request.get(path);
expect(response.ok()).toBe(true);
const bytes = await response.body();
expect(bytes.subarray(0, 4).toString("ascii")).toBe("%PDF");
```

Use the PDF signature rather than relying on a specific server `content-type` header.

- [ ] **Step 4: Verify responsive layout**

At 1366: five cards fit one row without page overflow.

At 768: three columns are computed.

At 390: the catalogue grid has horizontal overflow of its own, page document does not overflow, and scrolling/snap can reveal the fifth card.

- [ ] **Step 5: Run and commit**

```bash
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-catalogue-access.spec.ts
git add apps/web/tests/e2e/products-catalogue-access.spec.ts
git commit -m "test(web): verify Products catalogue open and download flow"
```

## Subplan Exit Gate

```bash
pnpm --filter @rosa/web test -- src/test/products-catalogue-access.test.tsx
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-catalogue-access.spec.ts
pnpm --filter @rosa/web typecheck
```

The standalone `/catalogues` route remains a supporting route and must not become a sixth primary navigation item.