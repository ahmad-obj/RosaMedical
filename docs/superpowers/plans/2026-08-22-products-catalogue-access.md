# Products Catalogue Access Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the five Product Categories covers on `/products` into direct catalogue document entry points with both browser-open and download actions using the existing authoritative PDFs.

**Architecture:** Reuse `CATALOGUE_DOCUMENTS`, `CatalogueCover`, localized family names, and the existing five PDF paths. Add a Products-specific document card surface because the client wants the cover itself to open the PDF, while the existing Catalogues page card has different semantics (download + Explore products). Do not add a Downloads main page and do not duplicate PDF path constants.

**Tech Stack:** React/Next.js, TypeScript, existing catalogues/public-media modules, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-22-client-products-site-shell-redesign-design.md`

## Global Constraints

- Exactly five catalogue documents: Knives, Scissors, Punches, Chisels, Cutters.
- Existing PDF paths in `catalogue-document-model.ts` remain authoritative.
- Clicking the Products category cover opens the PDF document.
- A distinct visible Download Catalogue action downloads the same PDF.
- Do not create a separate Downloads primary page.
- The card is document-oriented; family product browsing remains available via product discovery/filtering and canonical family routes.
- Use approved existing catalogue-cover artwork.

---

### Task 1: Add a Products-specific catalogue card component

**Files:**
- Create: `apps/web/src/features/products/sections/products-catalogue-cards.tsx`
- Modify: `apps/web/src/test/products-catalogue-access.test.tsx`
- Reference: `apps/web/src/features/catalogues/catalogue-cover.tsx`
- Reference: `apps/web/src/features/catalogues/catalogue-document-model.ts`

**Interfaces:**

```tsx
export function ProductsCatalogueCards({
  locale = "en"
}: {
  locale?: PublicLocale;
}): ReactElement
```

- [ ] **Step 1: Write the failing contract test**

```ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Products catalogue access", () => {
  it("uses the authoritative catalogue document model and provides open plus download actions", () => {
    const component = source("src/features/products/sections/products-catalogue-cards.tsx");
    expect(component).toContain("CATALOGUE_DOCUMENTS");
    expect(component).toContain("CatalogueCover");
    expect(component).toContain("document.pdfPath");
    expect(component).toContain("download=");
    expect(component).toContain('target="_blank"');
    expect(component).not.toContain("/downloads");
  });
});
```

- [ ] **Step 2: Run RED**

```bash
pnpm --filter @rosa/web test -- src/test/products-catalogue-access.test.tsx
```

Expected: FAIL because the Products catalogue component does not exist.

- [ ] **Step 3: Implement the section using existing model records**

Recommended structure:

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
            <li key={document.familySlug}>
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

Do not duplicate `PDF_PATH_BY_FAMILY` in Products.

- [ ] **Step 4: Export any currently non-exported catalogue primitives cleanly**

If `CatalogueCover` or `CATALOGUE_DOCUMENTS` is not exported by `@/features/catalogues/index.ts`, add explicit exports there rather than importing deep private paths from Products.

- [ ] **Step 5: Run GREEN**

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/features/products/sections/products-catalogue-cards.tsx apps/web/src/features/catalogues/index.ts apps/web/src/test/products-catalogue-access.test.tsx
git commit -m "feat(web): add direct Products catalogue access"
```

### Task 2: Compose catalogue cards into the client Products hierarchy

**Files:**
- Modify: `apps/web/src/features/products/products-overview.tsx`
- Modify: `apps/web/src/test/products-catalogue-access.test.tsx`

- [ ] **Step 1: Add source-order test**

Require `ProductsCatalogueCards` to appear after `ProductsDirectContactBand` and before `ProductsProcurementCta`.

```ts
const page = source("src/features/products/products-overview.tsx");
expect(page.indexOf("ProductsCatalogueCards")).toBeGreaterThan(page.indexOf("ProductsDirectContactBand"));
expect(page.indexOf("ProductsCatalogueCards")).toBeLessThan(page.indexOf("ProductsProcurementCta"));
```

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Insert the section**

```tsx
<ProductsDirectContactBand locale={locale} />
<ProductsCatalogueCards locale={locale} />
<ProductsProcurementCta model={model.procurement} />
```

- [ ] **Step 4: Remove the old Products `CatalogueSupport` render**

The new catalogue section replaces the old text-led support section on `/products`. Keep the standalone `/catalogues` route intact.

- [ ] **Step 5: Run GREEN and commit**

```bash
git add apps/web/src/features/products/products-overview.tsx apps/web/src/test/products-catalogue-access.test.tsx
git commit -m "feat(web): place catalogue covers in Products journey"
```

### Task 3: Style the five covers as a responsive document row

**Files:**
- Modify: `apps/web/src/styles/products-client-redesign.css`
- Modify: `apps/web/src/test/products-catalogue-access.test.tsx`

- [ ] **Step 1: Add CSS contract assertions**

Require:

- five-column desktop grid when space allows;
- 3+2 or adaptive tablet arrangement;
- mobile horizontal snap rail or responsive 2-column layout, choosing whichever preserves cover legibility better in browser review;
- visible open affordance on cover hover/focus;
- download link remains outside the cover link to avoid nested interactive elements;
- reduced-motion-safe hover transform.

- [ ] **Step 2: Implement desktop grid**

```css
.products-catalogue-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
  list-style: none;
  margin: 0;
  padding: 0;
}

.products-catalogue-card__cover-link {
  display: block;
  overflow: hidden;
}

.products-catalogue-card__cover-link > * {
  transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (hover: hover) and (pointer: fine) {
  .products-catalogue-card__cover-link:hover > * {
    transform: scale(1.035);
  }
}
```

Use existing CSS tokens where available instead of hard-coding duplicate colors.

- [ ] **Step 3: Implement responsive fallback**

At tablet widths reduce columns adaptively. At ~390px either:

```css
.products-catalogue-grid {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(10rem, 72vw);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
```

or a two-column grid if visual browser review shows better cover readability. Lock the chosen behavior in the test after review; do not maintain two competing mobile modes.

- [ ] **Step 4: Run focused unit test**

### Task 4: Add browser tests for open/download behavior

**Files:**
- Create: `apps/web/tests/e2e/products-catalogue-access.spec.ts`

- [ ] **Step 1: Verify all five cards render**

Use `data-catalogue-document` or add `data-products-catalogue={document.familySlug}` for stable selectors.

Expected family set:

```ts
["knives", "scissors", "punches", "chisels", "cutters"]
```

- [ ] **Step 2: Verify each cover href targets the correct existing PDF**

Expected paths:

```ts
const expected = {
  knives: "/media/catalogues/pdf/rosa-knives-catalogue.pdf",
  scissors: "/media/catalogues/pdf/rosa-scissors-catalogue.pdf",
  punches: "/media/catalogues/pdf/rosa-punches-catalogue.pdf",
  chisels: "/media/catalogues/pdf/rosa-chisels-catalogue.pdf",
  cutters: "/media/catalogues/pdf/rosa-cutters-catalogue.pdf"
};
```

For each card assert:

- cover `href` equals expected PDF;
- cover `target="_blank"`;
- download link `href` equals same PDF;
- download attribute is present.

- [ ] **Step 3: Verify the PDFs are served successfully in the test environment**

For each PDF:

```ts
const response = await page.request.get(path);
expect(response.ok()).toBe(true);
expect(response.headers()["content-type"]).toContain("application/pdf");
```

If the dev server uses an octet-stream content type for static PDFs, assert success + `%PDF` file signature instead of weakening the check to URL presence only.

- [ ] **Step 4: Run Playwright**

```bash
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-catalogue-access.spec.ts
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/styles/products-client-redesign.css apps/web/src/test/products-catalogue-access.test.tsx apps/web/tests/e2e/products-catalogue-access.spec.ts
git commit -m "test(web): verify Products catalogue open and download flow"
```

## Subplan Exit Gate

```bash
pnpm --filter @rosa/web test -- src/test/products-catalogue-access.test.tsx
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-catalogue-access.spec.ts
pnpm --filter @rosa/web typecheck
```

The standalone `/catalogues` page may remain as a supporting route, but it must not become a sixth primary navigation item.
