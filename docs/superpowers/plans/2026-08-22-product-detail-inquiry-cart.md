# Product Detail + Inquiry Cart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Product Detail → Add to Inquiry → Inquiry review read like the client-requested cart flow while retaining Rosa's existing quotation-only architecture and storage behavior.

**Architecture:** Keep `InquiryItem`, `inquiry-store.ts`, `ProductInquiryControls`, `AddToInquiryButton`, `InquiryPage`, and `/request-quotation` as the single functional path. Add optional display-only media fields to persisted inquiry items so the basket can show product imagery without a second catalogue lookup. Add a focused `InquiryLineMedia` client component for primary→fallback→placeholder behavior. The mobile sticky Product Detail action scrolls to the canonical quantity/note controls instead of owning a second add state.

**Tech Stack:** React client components, TypeScript, Motion, localStorage, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-22-client-products-site-shell-redesign-design.md`

## Global Constraints

- Inquiry is a quotation basket, never a payment checkout.
- No fabricated numeric price; use `Price on request` / `السعر عند الطلب`.
- Keep duplicate merge, quantity cap 999, notes max 500, remove, clear, and quotation navigation.
- No second cart/inquiry store.
- Existing `rosa-medical-inquiry-v1` payloads without media fields remain readable.
- Product Detail is the canonical add action.
- Preserve current remove/empty focus management.
- Respect reduced motion.

---

### Task 1: Extend `InquiryItem` with backward-compatible media metadata

**Files:**
- Modify: `apps/web/src/features/inquiry/inquiry-store.ts`
- Modify: `apps/web/src/features/product-detail/product-detail-page.tsx`
- Create: `apps/web/src/test/client-inquiry-cart-redesign.test.tsx`

**Interface:**

```ts
export interface InquiryItem {
  id: string;
  familySlug: string;
  slug: string;
  name: string;
  code: string;
  size: string;
  variant: string;
  quantity: number;
  notes: string;
  mediaPath?: string;
  mediaFallbackPath?: string;
  imageLabel?: string;
}
```

- [ ] **Step 1: Write backward-compatibility RED tests**

Use a mocked `localStorage`/test DOM environment consistent with existing inquiry-store tests.

Old payload:

```ts
const oldItem = {
  id: "p1",
  familySlug: "scissors",
  slug: "mayo-scissors",
  name: "Mayo Scissors",
  code: "S-1",
  size: "14 cm",
  variant: "Straight",
  quantity: 2,
  notes: ""
};
localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify([oldItem]));
expect(readInquiry()).toEqual([oldItem]);
```

New payload additionally includes:

```ts
mediaPath: "/media/products/mayo.webp",
mediaFallbackPath: "/media/products/mayo-fallback.webp",
imageLabel: "Mayo scissors"
```

Assert all three are preserved.

- [ ] **Step 2: Run RED**

```bash
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
```

- [ ] **Step 3: Make optional-string validation explicit**

```ts
function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}
```

Extend `isInquiryItem` with:

```ts
isOptionalString(item.mediaPath) &&
isOptionalString(item.mediaFallbackPath) &&
isOptionalString(item.imageLabel)
```

Leave `normalizeItem` spread-based so optional media metadata survives while quantity/notes continue to be clamped.

- [ ] **Step 4: Populate media fields from the resolved Product Detail record**

```ts
const inquiryItem: InquiryItem = {
  id: product.id,
  familySlug: product.familySlug,
  slug: product.slug,
  name: product.name,
  code: product.code,
  size: data.sizeValue,
  variant: data.variantValue,
  quantity: 1,
  notes: "",
  ...(product.mediaPath ? { mediaPath: product.mediaPath } : {}),
  ...(product.mediaFallbackPath ? { mediaFallbackPath: product.mediaFallbackPath } : {}),
  ...(product.mediaLabel ? { imageLabel: product.mediaLabel } : {})
};
```

- [ ] **Step 5: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
git add apps/web/src/features/inquiry/inquiry-store.ts apps/web/src/features/product-detail/product-detail-page.tsx apps/web/src/test/client-inquiry-cart-redesign.test.tsx
git commit -m "feat(web): preserve inquiry product media metadata"
```

### Task 2: Add explicit Product Detail price-on-request state

**Files:**
- Create: `apps/web/src/features/product-detail/product-price-state.tsx`
- Modify: `apps/web/src/features/product-detail/product-procurement-summary.tsx`
- Modify: `apps/web/src/test/client-inquiry-cart-redesign.test.tsx`

**Interface:**

```tsx
export function ProductPriceState({
  locale
}: {
  locale: PublicLocale;
}): ReactElement
```

- [ ] **Step 1: Write RED source contract**

```ts
const summary = source("src/features/product-detail/product-procurement-summary.tsx");
expect(summary).toContain("ProductPriceState");
expect(summary).toContain("ProductInquiryControls");
expect(summary).not.toMatch(/\b(?:20|25|200|300)\s*SAR\b/);
```

- [ ] **Step 2: Implement exact display**

```tsx
import type { ReactElement } from "react";
import type { PublicLocale } from "@/features/localization/locales";

export function ProductPriceState({ locale }: { locale: PublicLocale }): ReactElement {
  const ar = locale === "ar";
  return (
    <div className="product-price-state" aria-label={ar ? "السعر" : "Price"}>
      <span>{ar ? "السعر" : "Price"}</span>
      <strong>{ar ? "عند الطلب" : "On request"}</strong>
    </div>
  );
}
```

- [ ] **Step 3: Position summary content in this order**

```text
family eyebrow
product name
code
description
size + variant
ProductPriceState
ProductInquiryControls
controls note
catalogue reference
```

Remove the older duplicated `No public price · Quotation required` paragraph after `ProductPriceState` becomes authoritative.

- [ ] **Step 4: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
git add apps/web/src/features/product-detail apps/web/src/test/client-inquiry-cart-redesign.test.tsx
git commit -m "feat(web): add explicit price-on-request product state"
```

### Task 3: Preserve one canonical quantity/note/add control

**Files:**
- Modify: `apps/web/src/features/product-detail/product-inquiry-controls.tsx`
- Modify if needed for copy/accessibility only: `apps/web/src/features/inquiry/add-to-inquiry-button.tsx`
- Modify: `apps/web/src/features/product-detail/mobile-inquiry-bar.tsx`
- Modify: `apps/web/src/test/client-inquiry-cart-redesign.test.tsx`

- [ ] **Step 1: Lock current desktop data path**

Test the canonical control retains:

```ts
const [quantity, setQuantity] = useState(item.quantity);
const [notes, setNotes] = useState(item.notes);
```

and:

```tsx
<AddToInquiryButton item={{ ...item, quantity, notes }} />
```

- [ ] **Step 2: Give canonical controls a stable ID**

```tsx
<div className="product-inquiry-controls" id="product-inquiry-controls">
```

- [ ] **Step 3: Replace mobile sticky duplicate add control**

RED test:

```ts
const mobile = source("src/features/product-detail/mobile-inquiry-bar.tsx");
expect(mobile).not.toContain("AddToInquiryButton");
expect(mobile).toContain('href="#product-inquiry-controls"');
```

Implementation:

```tsx
<aside className="mobile-inquiry-bar" aria-label="Inquiry action">
  <span><LocalizedText en="Price on request" ar="السعر عند الطلب" /></span>
  <a className="button button--primary button--standard" href="#product-inquiry-controls">
    <LocalizedText en="Choose quantity" ar="اختر الكمية" />
  </a>
</aside>
```

This prevents a sticky action from adding quantity 1 while the user selected another quantity in the canonical form.

- [ ] **Step 4: Keep Add confirmation durable**

`AddToInquiryButton` continues to show localized `Added · View inquiry` as a link to `/inquiry` after add. Do not auto-reset it on a timer.

- [ ] **Step 5: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
git add apps/web/src/features/product-detail apps/web/src/features/inquiry/add-to-inquiry-button.tsx apps/web/src/test/client-inquiry-cart-redesign.test.tsx
git commit -m "fix(web): unify Product Detail inquiry controls"
```

### Task 4: Add exact inquiry-line media fallback component

**Files:**
- Create: `apps/web/src/features/inquiry/inquiry-line-media.tsx`
- Modify: `apps/web/src/features/inquiry/index.ts`
- Modify: `apps/web/src/test/client-inquiry-cart-redesign.test.tsx`

**Interface:**

```tsx
export function InquiryLineMedia({
  mediaPath,
  mediaFallbackPath,
  alt
}: {
  mediaPath?: string;
  mediaFallbackPath?: string;
  alt: string;
}): ReactElement
```

- [ ] **Step 1: Write RED behavior test**

Test three states:

1. primary path exists → image source is primary;
2. first image error with fallback → source switches to fallback exactly once;
3. fallback error or no paths → neutral placeholder renders and broken image is removed.

- [ ] **Step 2: Implement deterministic fallback state**

```tsx
"use client";

import { useState, type ReactElement } from "react";

export function InquiryLineMedia({ mediaPath, mediaFallbackPath, alt }: Props): ReactElement {
  const [src, setSrc] = useState(mediaPath || mediaFallbackPath || "");
  const [usedFallback, setUsedFallback] = useState(!mediaPath && Boolean(mediaFallbackPath));

  if (!src) {
    return <span className="inquiry-line-media__placeholder" aria-hidden="true" />;
  }

  return (
    <img
      className="inquiry-line-media__image"
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (!usedFallback && mediaFallbackPath && src !== mediaFallbackPath) {
          setUsedFallback(true);
          setSrc(mediaFallbackPath);
          return;
        }
        setSrc("");
      }}
    />
  );
}
```

Use a named `Props` interface/type in the actual file; the snippet shows the state logic.

- [ ] **Step 3: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
git add apps/web/src/features/inquiry apps/web/src/test/client-inquiry-cart-redesign.test.tsx
git commit -m "feat(web): add inquiry product media fallback"
```

### Task 5: Redesign populated Inquiry as quotation basket

**Files:**
- Modify: `apps/web/src/features/inquiry/inquiry-page.tsx`
- Create: `apps/web/src/styles/client-inquiry-cart.css`
- Modify: `apps/web/src/app/globals.css`
- Modify: `apps/web/src/test/client-inquiry-cart-redesign.test.tsx`

- [ ] **Step 1: Write RED composition contract**

Require:

- `Quotation inquiry`;
- selected-product count and total quantity;
- `InquiryLineMedia` for each item;
- name/code/size/variant;
- quantity decrement/output/increment;
- line note;
- remove;
- clear inquiry;
- Continue browsing;
- `Request quotation` link to `/request-quotation`;
- no Checkout/Pay/Card/Shipping wording.

- [ ] **Step 2: Render `InquiryLineMedia` before identity**

```tsx
<InquiryLineMedia
  mediaPath={item.mediaPath}
  mediaFallbackPath={item.mediaFallbackPath}
  alt={item.imageLabel || item.name}
/>
```

- [ ] **Step 3: Preserve current accessibility/focus machinery unchanged**

Do not remove or weaken:

- `pendingFocusTarget`;
- `removeButtonRefs`;
- next-row focus after removal;
- empty-state focus transfer;
- `aria-live` result outputs;
- quantity button disabled states at 1 and 999.

- [ ] **Step 4: Change summary progression wording**

```tsx
<LocaleLink href="/request-quotation" className="button button--primary button--standard">
  {ar ? "طلب عرض سعر" : "Request quotation"}
</LocaleLink>
```

- [ ] **Step 5: Add exact responsive row geometry**

```css
.inquiry-preview-line {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr) minmax(15rem, 20rem);
  gap: 1.25rem;
  align-items: start;
}

.inquiry-line-media__image,
.inquiry-line-media__placeholder {
  display: block;
  inline-size: 100%;
  aspect-ratio: 1;
  object-fit: contain;
}

@media (max-width: 49.99rem) {
  .inquiry-preview-line {
    grid-template-columns: 1fr;
  }

  .inquiry-line-media__image,
  .inquiry-line-media__placeholder {
    max-inline-size: 8rem;
  }
}
```

Use existing color/border tokens for placeholder styling.

- [ ] **Step 6: Keep new transitions reduced-motion safe**

Do not add a new continuous animation. Existing Motion layout transitions may remain; any added CSS transition receives `prefers-reduced-motion: reduce { transition: none; }`.

- [ ] **Step 7: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
git add apps/web/src/features/inquiry apps/web/src/styles/client-inquiry-cart.css apps/web/src/app/globals.css apps/web/src/test/client-inquiry-cart-redesign.test.tsx
git commit -m "feat(web): redesign inquiry as quotation cart"
```

### Task 6: Keep the shared Inquiry banner stable for loading/empty/populated states

**Files:**
- Modify: `apps/web/src/features/inquiry/inquiry-page.tsx`
- Modify only if needed for middle-content copy: `apps/web/src/features/inquiry-preview/empty-inquiry-page.tsx`
- Modify: `apps/web/src/test/client-inquiry-cart-redesign.test.tsx`

Current `InquiryPage` returns early for loading and empty states. After the shared hero is introduced, those early returns must not remove the page banner.

- [ ] **Step 1: Add RED source contract**

Require `PublicHeroCarousel page="inquiry"` to be outside the state-specific rendering function/component.

- [ ] **Step 2: Refactor into a stable outer page**

```tsx
export function InquiryPage() {
  // existing state/effects
  return (
    <div className="public-page public-page--inquiry">
      <PublicHeroCarousel
        page="inquiry"
        locale={ar ? "ar" : "en"}
        headingId="inquiry-public-hero-title"
      />
      {renderInquiryState()}
    </div>
  );
}
```

`renderInquiryState()` returns exactly one of:

- loading section;
- `<EmptyInquiryPage />`;
- populated inquiry sections.

- [ ] **Step 3: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
git add apps/web/src/features/inquiry apps/web/src/features/inquiry-preview/empty-inquiry-page.tsx apps/web/src/test/client-inquiry-cart-redesign.test.tsx
git commit -m "fix(web): keep inquiry banner stable across cart states"
```

### Task 7: Add browser-level Product Detail → Inquiry coverage

**Files:**
- Create: `apps/web/tests/e2e/client-inquiry-cart-redesign.spec.ts`

- [ ] **Step 1: Select a stable fixture-backed Product Detail route at test setup**

Use an existing route from the current catalogue fixture/manifest rather than hard-coding a name that might not exist. Resolve the first active fixture-backed product route from test data or use an already-stable product route helper used by existing E2E specs.

- [ ] **Step 2: Full journey**

1. clear `rosa-medical-inquiry-v1`;
2. open Product Detail;
3. set quantity to 2;
4. enter `Sterile packing requested` as line note;
5. click Add to Inquiry;
6. assert `Added · View inquiry`;
7. navigate via that link;
8. assert product name/code and quantity 2;
9. assert note is preserved;
10. increment quantity to 3;
11. remove the item;
12. assert the empty-state focus target receives/accepts focus.

- [ ] **Step 3: Duplicate merge journey**

Add the same product with quantity 2, return to Product Detail, add quantity 1, then assert Inquiry contains one line with quantity 3. This proves `addInquiryItem` still merges by family+slug.

- [ ] **Step 4: Mobile sticky action**

At 390px click the sticky `Choose quantity` action; assert URL hash or focused/visible canonical control corresponds to `#product-inquiry-controls`; assert localStorage remains unchanged until the canonical Add button is clicked.

- [ ] **Step 5: Run and commit**

```bash
pnpm --filter @rosa/web test:e2e -- tests/e2e/client-inquiry-cart-redesign.spec.ts
git add apps/web/tests/e2e/client-inquiry-cart-redesign.spec.ts
git commit -m "test(web): cover quotation cart journey"
```

## Subplan Exit Gate

```bash
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
pnpm --filter @rosa/web test:e2e -- tests/e2e/client-inquiry-cart-redesign.spec.ts
pnpm --filter @rosa/web typecheck
```

Any payment, checkout, shipping, card-entry, tax, or fabricated numeric price UI is a plan violation.