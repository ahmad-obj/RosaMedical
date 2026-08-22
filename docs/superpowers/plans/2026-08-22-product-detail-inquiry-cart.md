# Product Detail + Inquiry Cart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Product Detail → Add to Inquiry → Inquiry review read like the client-requested cart flow while retaining the existing quotation-only architecture and storage behavior.

**Architecture:** Keep `InquiryItem`, `inquiry-store.ts`, `ProductInquiryControls`, `AddToInquiryButton`, `InquiryPage`, and `/request-quotation` as the single functional path. Refine the UI and add optional display media metadata to the inquiry item so the Inquiry page can show product imagery without a second network/catalogue lookup. Keep storage backward-compatible by making the new display fields optional.

**Tech Stack:** React client components, TypeScript, Motion, localStorage, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-22-client-products-site-shell-redesign-design.md`

## Global Constraints

- Inquiry is a quotation basket, not payment checkout.
- No price fabrication; use `Price on request` / `السعر عند الطلب`.
- Keep existing duplicate merge, quantity cap 999, line notes, remove, clear, and quotation navigation.
- Do not create another cart/inquiry store.
- Existing v1 localStorage payloads must continue to parse.
- Product Detail remains the canonical add action.
- Preserve keyboard/focus handling on Inquiry remove/empty transitions.
- Preserve reduced-motion behavior.

---

### Task 1: Extend InquiryItem with optional display-only media fields

**Files:**
- Modify: `apps/web/src/features/inquiry/inquiry-store.ts`
- Modify: `apps/web/src/features/product-detail/product-detail-page.tsx`
- Test: `apps/web/src/test/client-inquiry-cart-redesign.test.tsx`

**Interfaces:**

Extend, without changing required existing fields:

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

- [ ] **Step 1: Write backward-compatibility tests**

Test that an old payload without media fields still reads successfully:

```ts
localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify([{
  id: "p1",
  familySlug: "scissors",
  slug: "mayo-scissors",
  name: "Mayo Scissors",
  code: "S-1",
  size: "14 cm",
  variant: "Straight",
  quantity: 2,
  notes: ""
}]));
expect(readInquiry()[0]?.name).toBe("Mayo Scissors");
```

Test that a new payload preserves optional `mediaPath`, `mediaFallbackPath`, and `imageLabel`.

- [ ] **Step 2: Run RED for media preservation assertion**

```bash
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
```

- [ ] **Step 3: Update `isInquiryItem` and `normalizeItem`**

Optional fields must validate only when present:

```ts
const optionalString = (value: unknown) => value === undefined || typeof value === "string";
```

Then include:

```ts
optionalString(item.mediaPath) &&
optionalString(item.mediaFallbackPath) &&
optionalString(item.imageLabel)
```

`normalizeItem` should spread existing optional fields unchanged; do not synthesize paths.

- [ ] **Step 4: Populate display metadata in Product Detail**

When constructing `inquiryItem`:

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

- [ ] **Step 5: Run GREEN**

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/features/inquiry/inquiry-store.ts apps/web/src/features/product-detail/product-detail-page.tsx apps/web/src/test/client-inquiry-cart-redesign.test.tsx
git commit -m "feat(web): preserve inquiry product media metadata"
```

### Task 2: Refine Product Detail summary around client cart expectations

**Files:**
- Modify: `apps/web/src/features/product-detail/product-procurement-summary.tsx`
- Modify: `apps/web/src/features/product-detail/product-inquiry-controls.tsx`
- Modify: `apps/web/src/features/inquiry/add-to-inquiry-button.tsx`
- Create: `apps/web/src/features/product-detail/product-price-state.tsx`
- Modify: `apps/web/src/test/client-inquiry-cart-redesign.test.tsx`

**Interfaces:**

```tsx
export function ProductPriceState({ locale }: { locale: PublicLocale }): ReactElement
```

- [ ] **Step 1: Add failing summary contract tests**

Require the Product Detail summary to contain:

- family;
- product name;
- code;
- size;
- variant;
- `ProductPriceState`;
- quantity selector;
- requirement note;
- Add to Inquiry;
- catalogue reference;
- no numeric SAR literal copied from the JPG.

Example source contract:

```ts
expect(summary).toContain("ProductPriceState");
expect(summary).toContain("ProductInquiryControls");
expect(summary).not.toMatch(/\b(?:20|25|200|300)\s*SAR\b/);
```

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Implement `ProductPriceState`**

```tsx
export function ProductPriceState({ locale }: { locale: PublicLocale }) {
  return (
    <div className="product-price-state" aria-label={locale === "ar" ? "السعر" : "Price"}>
      <span>{locale === "ar" ? "السعر" : "Price"}</span>
      <strong>{locale === "ar" ? "عند الطلب" : "On request"}</strong>
    </div>
  );
}
```

Do not add a numeric prop until a verified backend price field exists.

- [ ] **Step 4: Place price before inquiry controls**

Product identity → code → description → options → price → quantity/note/add action → catalogue reference.

- [ ] **Step 5: Make Add confirmation durable enough to be obvious**

Keep the existing `added` confirmation transition, but ensure the visible result is `Added · View inquiry` and remains a link to localized `/inquiry` until route/navigation changes. Do not auto-reset it after a timer.

- [ ] **Step 6: Preserve quantity/note data path**

`ProductInquiryControls` already owns:

```ts
const [quantity, setQuantity] = useState(item.quantity);
const [notes, setNotes] = useState(item.notes);
```

Continue passing `{ ...item, quantity, notes }` to `AddToInquiryButton`; do not reintroduce a fixed quantity of 1.

- [ ] **Step 7: Run GREEN and commit**

```bash
git add apps/web/src/features/product-detail apps/web/src/features/inquiry/add-to-inquiry-button.tsx apps/web/src/test/client-inquiry-cart-redesign.test.tsx
git commit -m "feat(web): refine product detail inquiry controls"
```

### Task 3: Align the mobile sticky action with selected quantity

**Files:**
- Modify: `apps/web/src/features/product-detail/mobile-inquiry-bar.tsx`
- Modify: `apps/web/src/features/product-detail/product-detail-page.tsx`
- Modify: `apps/web/src/test/client-inquiry-cart-redesign.test.tsx`

Current risk: desktop `ProductInquiryControls` manages quantity/notes locally while `MobileInquiryBar` receives the original item, so a mobile sticky add can bypass the chosen quantity/note.

**Design decision:** On mobile, the sticky bar should navigate/focus the main Product Inquiry controls rather than maintain a second independent add state.

- [ ] **Step 1: Write a failing source test requiring the mobile bar to target the canonical controls rather than directly call `AddToInquiryButton`**

```ts
const mobile = source("src/features/product-detail/mobile-inquiry-bar.tsx");
expect(mobile).not.toContain("AddToInquiryButton");
expect(mobile).toContain("#product-inquiry-controls");
```

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Give the canonical controls a stable ID**

```tsx
<div className="product-inquiry-controls" id="product-inquiry-controls">
```

- [ ] **Step 4: Turn mobile sticky CTA into an anchor/link**

```tsx
<a className="button button--primary button--standard" href="#product-inquiry-controls">
  <LocalizedText en="Choose quantity" ar="اختر الكمية" />
</a>
```

This prevents two independent cart-control states while retaining the useful sticky mobile affordance.

- [ ] **Step 5: Run GREEN and commit**

```bash
git add apps/web/src/features/product-detail apps/web/src/test/client-inquiry-cart-redesign.test.tsx
git commit -m "fix(web): unify mobile and desktop inquiry controls"
```

### Task 4: Redesign Inquiry rows to include product media and clearer cart semantics

**Files:**
- Modify: `apps/web/src/features/inquiry/inquiry-page.tsx`
- Create: `apps/web/src/styles/client-inquiry-cart.css`
- Modify: `apps/web/src/app/globals.css`
- Modify: `apps/web/src/test/client-inquiry-cart-redesign.test.tsx`

- [ ] **Step 1: Add failing Inquiry composition assertions**

Require:

- `Quotation inquiry` / localized equivalent;
- explicit basket semantics such as `Selected products` or `Inquiry items`;
- product media rendering when `mediaPath` exists;
- quantity +/- buttons;
- line note;
- remove;
- clear inquiry;
- Continue browsing;
- Request quotation progression;
- no Checkout/Pay/Card/Shipping labels.

- [ ] **Step 2: Run RED for media semantics**

- [ ] **Step 3: Render optional media safely**

Add a media cell before identity:

```tsx
<div className="inquiry-preview-line__media">
  {item.mediaPath ? (
    <img
      src={item.mediaPath}
      alt={item.imageLabel || item.name}
      loading="lazy"
      decoding="async"
    />
  ) : (
    <span aria-hidden="true" className="inquiry-preview-line__media-placeholder" />
  )}
</div>
```

If the application already has a reusable product-media renderer that correctly handles fallback paths, use it rather than duplicating `<img>` logic. The final implementation must support `mediaFallbackPath` if the primary path fails through an existing helper/component.

- [ ] **Step 4: Improve summary CTA wording**

Use `Request quotation` instead of generic `Proceed to request` to remove checkout ambiguity.

- [ ] **Step 5: Keep current focus management untouched**

Do not remove:

- `pendingFocusTarget`;
- remove-button refs;
- focus restoration to next row;
- empty-state focus transfer.

- [ ] **Step 6: Add responsive CSS**

Desktop inquiry line:

```css
.inquiry-preview-line {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr) minmax(15rem, 20rem);
  gap: 1.25rem;
}
```

Mobile collapses to one column; media becomes a compact top thumbnail. Quantity controls retain minimum target sizes and notes remain full-width.

- [ ] **Step 7: Add reduced-motion rule for any new interaction class**

No new layout animation beyond the existing Motion layout behavior.

- [ ] **Step 8: Run GREEN and commit**

```bash
git add apps/web/src/features/inquiry/inquiry-page.tsx apps/web/src/styles/client-inquiry-cart.css apps/web/src/app/globals.css apps/web/src/test/client-inquiry-cart-redesign.test.tsx
git commit -m "feat(web): redesign inquiry as quotation cart"
```

### Task 5: Preserve empty Inquiry state inside the shared banner/page structure

**Files:**
- Modify: `apps/web/src/features/inquiry/inquiry-page.tsx`
- Inspect/modify only if needed: `apps/web/src/features/inquiry-preview/empty-inquiry-page.tsx` or actual exported empty-state component path.
- Modify: `apps/web/src/test/client-inquiry-cart-redesign.test.tsx`

- [ ] **Step 1: Add a test that empty and populated states both occur below `PublicHeroCarousel page="inquiry"`**

The banner must not disappear merely because `items.length === 0`.

- [ ] **Step 2: Refactor Inquiry page into outer page + inner state**

Recommended structure:

```tsx
return (
  <div className="public-page public-page--inquiry">
    <PublicHeroCarousel page="inquiry" locale={ar ? "ar" : "en"} headingId="inquiry-public-hero-title" />
    {renderInquiryState()}
  </div>
);
```

Move loading/empty/populated returns into `renderInquiryState()` or a small internal component so the common page banner remains stable.

- [ ] **Step 3: Run focused tests and commit**

```bash
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
git add apps/web/src/features/inquiry apps/web/src/test/client-inquiry-cart-redesign.test.tsx
git commit -m "fix(web): keep inquiry shell stable across cart states"
```

### Task 6: Add browser-level cart journey coverage

**Files:**
- Create: `apps/web/tests/e2e/client-inquiry-cart-redesign.spec.ts`

- [ ] **Step 1: Write a full journey test**

Use a known fixture-backed product route that is present in fallback/static catalogue data.

Test:

1. open Product Detail;
2. set quantity to 2;
3. enter a short line note;
4. click Add to Inquiry;
5. assert `Added · View inquiry`;
6. navigate to Inquiry;
7. assert product name/code and quantity 2;
8. increment to 3;
9. remove item;
10. assert empty state focus target becomes available.

- [ ] **Step 2: Add duplicate merge test**

Add the same product twice with quantity 2 and then 1; Inquiry should contain one line with quantity 3 because `addInquiryItem` merges by family+slug.

- [ ] **Step 3: Add mobile sticky behavior test**

At 390px, clicking the sticky control should navigate/focus to `#product-inquiry-controls` and must not add an item by itself.

- [ ] **Step 4: Run focused Playwright**

```bash
pnpm --filter @rosa/web test:e2e -- tests/e2e/client-inquiry-cart-redesign.spec.ts
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/tests/e2e/client-inquiry-cart-redesign.spec.ts
git commit -m "test(web): cover quotation cart journey"
```

## Subplan Exit Gate

```bash
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
pnpm --filter @rosa/web test:e2e -- tests/e2e/client-inquiry-cart-redesign.spec.ts
pnpm --filter @rosa/web typecheck
```

The result must remain a quotation workflow. Any appearance of payment, checkout, card entry, shipping calculation, or fabricated public price is a plan violation.
