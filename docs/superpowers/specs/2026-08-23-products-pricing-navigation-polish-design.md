# Rosa Medical — Products, Pricing, Navigation + Public Polish Design

Date: 2026-08-23
Branch: `transfer/rose-medical-final-main-ready-2026-08-17`
Status: approved architecture; supersedes conflicting parts of the 2026-08-22 Products redesign spec

## 1. Purpose

This specification consolidates the client's latest visual review and Ahmad's approved architecture into one source of truth for the next implementation pass.

It specifically covers:

- exact Home-equivalent shared banner geometry on all five main pages;
- repair of the broken third mobile hero image;
- Products search crash;
- deterministic ROSA-red filter controls;
- advanced contextual product facets;
- progressive `See more products` result disclosure;
- retirement of redundant family landing pages into filtered Products redirects;
- homepage catalogue covers opening the real PDFs;
- removal of Related Products from Product Detail;
- full SAR pricing through Supabase, admin, public cards, Product Detail, Inquiry, quotation submission and admin inquiry review;
- structured quotation-line price snapshots;
- Homepage Comprehensive Plans / Plastic Surgery alignment correction;
- regression, browser, responsive, accessibility and Cloudflare verification.

This work remains quotation-led. It does not add payment checkout, online ordering, stock reservation, tax, shipping calculation or a payment gateway.

## 2. Source-of-truth precedence

For this round, precedence is:

1. Ahmad's latest explicit instructions in the 2026-08-23 client-review conversation;
2. this specification;
3. the client-supplied redesign image and transcribed voice message;
4. the 2026-08-22 client Products/site-shell redesign spec where it does not conflict;
5. current branch implementation and tests;
6. older project decisions.

The root README currently contains an older decision that the public website has no public prices. That decision is superseded by the owner's latest explicit instruction to implement real SAR pricing. The implementation must append a superseding decision to the README rather than deleting historical decisions.

## 3. Locked public information architecture

Primary navigation remains exactly:

1. Home
2. About Us
3. Products
4. Inquiry
5. Contact Us

Canonical main routes:

- `/`
- `/about`
- `/products`
- `/inquiry`
- `/contact`

Arabic equivalents remain under existing locale routing.

Supporting Product Detail routes remain canonical:

- `/products/[family]/[product]`

The old family listing routes are retired as page experiences:

- `/products/knives`
- `/products/scissors`
- `/products/cutters`
- `/products/chisels`
- `/products/punches`

They must remain valid as redirects to the authoritative Products workspace:

- `/products/knives` -> `/products?family=knives`
- `/products/scissors` -> `/products?family=scissors`
- `/products/cutters` -> `/products?family=cutters`
- `/products/chisels` -> `/products?family=chisels`
- `/products/punches` -> `/products?family=punches`

Arabic family URLs redirect to `/ar/products?family=<slug>`.

Do not 404 old family URLs and do not maintain a second family-listing UI.

## 4. One canonical shared banner geometry

### 4.1 Problem

The current shared `PublicHeroCarousel` carries both public and legacy Home carousel classes, while Home also has page-scoped overrides. This creates a fragile situation where other main pages can appear larger even though they reuse the same component.

### 4.2 Decision

`PublicHeroCarousel` becomes the sole geometry authority for Home, About, Products, Inquiry and Contact.

All five pages must use the exact same:

- desktop min/max height behavior;
- viewport-height cap;
- short-laptop adjustment;
- mobile height behavior;
- content rail width;
- copy width;
- image `object-fit: cover` behavior;
- desktop/mobile focal-point mechanism;
- overlay behavior;
- dots positioning;
- autoplay timing;
- focus pause;
- visibility pause;
- pointer swipe behavior;
- keyboard dot navigation;
- reduced-motion behavior.

Page differences are copy only.

Home-specific CSS may style unrelated Home sections, but must no longer be required to make the hero the correct size.

### 4.3 Responsive target

The final hero must be visually checked at at least:

- 390 x 844
- 430 x 932
- 768 x 1024
- 1024 x 768
- 1366 x 768
- 1440 x 900
- 1920 x 1080
- 2560 x 1440

No main page may produce a taller banner than Home at the same viewport.

## 5. Broken third mobile hero asset

The third mobile hero image currently exists but is structurally truncated/corrupt. This is an asset-integrity defect, not only a focal-point issue.

Required correction:

- regenerate/replace `hero-03-mobile.webp` from the valid third desktop/master source;
- use a deliberate portrait/mobile crop suitable for the gloved-hand composition;
- keep the desktop source unchanged;
- validate RIFF/WebP declared length against actual bytes;
- browser-decode the mobile asset and assert non-zero dimensions;
- visually verify it at narrow phone widths;
- audit the other three mobile hero assets for the same integrity condition.

Do not hide the broken slide on mobile.

## 6. Products is the single discovery hub

`/products` is the authoritative product browsing surface.

It owns:

- search;
- family selection;
- faceted filters;
- sort;
- grid/list presentation;
- progressive result disclosure;
- product card pricing;
- Product Detail navigation;
- catalogue PDF access.

Family-specific product discovery must not be duplicated elsewhere.

## 7. Products search bug

### 7.1 Current defect

The current controlled search input reads `event.currentTarget.value` inside a React state-updater callback. The browser event/currentTarget must not be relied on later inside that deferred callback.

### 7.2 Required behavior

Capture the input value synchronously:

```ts
const query = event.currentTarget.value;
setState((current) => ({ ...current, query }));
```

Typing arbitrary characters must not route to the app error boundary.

Search remains client-side over the already loaded catalogue and must index:

- localized product name;
- English product name;
- item code;
- family;
- every size;
- every variant/type;
- every direction/shape;
- every catalogue SKU/code;
- every catalogue code/size pair.

Search normalization must be case-insensitive and whitespace tolerant.

## 8. Faceted filtering architecture

### 8.1 Facets

Desktop left sidebar must support:

- Product family;
- Size;
- Direction / shape;
- Variant / type;
- Code group;
- Clear filters.

Price filtering is not required in the first pricing pass. Price sorting may be added after the pricing projection is stable, but must not block the core facets.

### 8.2 Selection semantics

Family is single-select.

Size, Direction, Variant and Code group are multi-select.

Boolean behavior:

- values selected within one facet use OR;
- different facets combine with AND;
- free-text search combines with all selected facets using AND.

Example:

`family=scissors` + sizes `[14 cm, 16 cm]` + direction `[straight]`

means:

`Scissors AND (14 cm OR 16 cm) AND Straight`.

### 8.3 Contextual facet values

Facet options must be derived from real result data, not hard-coded.

There are currently many live values (including dozens of distinct sizes and code prefixes), so the sidebar must not dump every possible value permanently.

For each facet:

- derive available options from the catalogue;
- recompute availability against the active filter context;
- preserve currently selected values even if counts drop to zero so the user can remove them;
- show counts where useful;
- order values deterministically;
- use compact initial disclosure for long lists;
- provide `Show more` / `Show less` for long facets;
- optionally expose a small within-facet search when option count crosses the defined threshold;
- do not create dead controls backed by invented metadata.

### 8.4 Size ordering

Do not sort size strings lexicographically (`1.0, 10.0, 2.0`).

Implement a stable size comparator that:

1. extracts a leading numeric value when present;
2. compares numeric values first;
3. compares normalized units next;
4. falls back to locale-aware string comparison.

### 8.5 Code groups

Code group is derived from real SKU/item-code prefixes, not from a fixed list.

For Rosa's current codes, use the stable semantic prefix before the final item-specific portion. The exact grouping helper must be unit-tested against representative `18-`, `21-`, etc. codes and must never mutate the underlying product code.

### 8.6 URL persistence

Products discovery state must be shareable and refresh-safe.

Supported query keys:

- `q`
- `family`
- `size` (repeatable or deterministic comma encoding)
- `direction`
- `variant`
- `codeGroup`
- `sort`
- `view`

State rules:

- initial state hydrates from URL;
- invalid values are ignored safely;
- changing filters updates the URL without full navigation;
- Back/Forward restores state;
- family redirects hydrate the correct radio selection;
- Arabic routing preserves `/ar/products` while using the same query semantics.

## 9. Filter control design

Do not rely only on browser `accent-color`.

Use real native radio/checkbox inputs for semantics and keyboard behavior, but draw the visible controls deterministically.

Selected radio:

- ROSA-red outer border;
- ROSA-red inner dot;
- selected text emphasis.

Selected checkbox:

- ROSA-red filled box;
- clear white check mark;
- selected text emphasis.

Also implement:

- hover state;
- focus-visible state;
- disabled/unavailable state;
- minimum comfortable hit area;
- no layout shift when selected;
- RTL-safe alignment.

Colour must not be the only indication of selected state.

## 10. Progressive product disclosure

The Products page must not render the entire matching catalogue as one visually enormous wall.

### 10.1 Initial visible count

Use a deterministic viewport-aware batch policy:

- desktop/wide: 12 visible products initially;
- tablet/mobile: 8 visible products initially.

The internal filtered result set remains complete.

### 10.2 See More behavior

When more matches exist, render a centered premium control below the results:

`See more products`

Include remaining count where it improves clarity.

Each activation appends one additional batch.

Rules:

- do not replace existing cards;
- no scroll jump;
- newly revealed cards use the existing restrained Stagger/Reveal language;
- reduced-motion users receive immediate appearance;
- search/filter changes reset visible count to the first batch;
- sort changes reset visible count to the first batch;
- grid/list view changes preserve or safely normalize the current reveal count;
- once all results are visible, the button disappears;
- zero-result state remains separate.

## 11. Homepage catalogue covers

The Home Product Range catalogue covers currently navigate to family listing pages. That behavior is retired.

Each cover must use the same `CATALOGUE_DOCUMENTS` source as the Products catalogue section and open the corresponding real PDF.

Behavior:

- click cover -> open PDF in a new browser tab;
- use `rel="noreferrer"`;
- accessible label states that a catalogue is opening;
- no duplicate family landing navigation;
- Home retains its existing visual cover treatment and horizontal mobile behavior.

The explicit `Download catalogue` link remains on the Products catalogue cards.

## 12. Product Detail simplification

Remove the Related Products / `More from ...` section entirely.

Do not replace it with another recommendation rail.

The Product Detail progression becomes:

1. breadcrumbs;
2. product media;
3. product identity;
4. valid configuration selection;
5. effective SAR price / Price on request;
6. quantity + note;
7. Add to Inquiry;
8. specification/procurement context;
9. final inquiry CTA;
10. global contact/footer shell.

The data loader must stop fetching related products when they are no longer used.

Breadcrumb family links should resolve to `/products?family=<slug>` rather than a retired family landing page.

## 13. Pricing data model

### 13.1 Existing live schema

The live Supabase schema already contains:

- `products.price numeric nullable`;
- `product_variants.price_override numeric nullable`.

Current live records have no values populated yet.

### 13.2 Currency

Rosa pricing is SAR only for this implementation.

Use ISO currency code `SAR` internally.

Presentation uses `Intl.NumberFormat` with the current locale.

English example:

`SAR 120.00`

Arabic formatting uses the locale formatter and existing RTL infrastructure.

### 13.3 Base/override semantics

Effective unit price:

```text
variant.price_override ?? product.price ?? null
```

Rules:

- base product price is the default;
- variant override replaces base price only for that variant;
- `NULL` means no numeric price is supplied;
- zero is a real numeric value and must not be used to represent missing pricing;
- no negative price;
- maximum two decimal places at UI validation boundary;
- server validates again.

### 13.4 Public price states

Product card:

- no prices anywhere -> `Price on request`;
- one effective price for all configurations -> `SAR X.XX`;
- multiple effective numeric prices -> `From SAR X.XX`;
- mixed numeric + unpriced configurations -> `From SAR X.XX · some options on request` or the approved compact equivalent.

Product Detail:

- selected priced configuration -> exact SAR price;
- selected unpriced configuration -> `Price on request`.

Do not invent prices.

## 14. Pricing must flow through live catalogue projections

Extend the live types/projection so public and admin product models receive:

- `product.price`;
- variant database identity;
- variant SKU;
- variant size;
- variant type;
- variant `price_override`.

Do not flatten away variant identity before Product Detail because correct price selection depends on a real configuration record.

The legacy/static fallback may leave price undefined/null; it must never fabricate values.

## 15. Product configuration model

The existing Product Detail effectively displays static first-option values. Pricing requires a real selectable configuration model.

Each public selectable configuration must contain at least:

```ts
interface ProductConfiguration {
  id: string;
  sku: string;
  size: string;
  variantType: string;
  unitPriceSar: string | null;
}
```

Use decimal strings at the application boundary for price arithmetic/storage safety.

Do not allow impossible combinations by independently combining arbitrary Size and Variant values that do not exist together in the database.

If a product has only one configuration, render the value without unnecessary choice UI.

If a product has multiple configurations, provide a clear native/selectable control with current SKU/size/type context and live price update.

## 16. Admin Product pricing

### 16.1 Product editor

Add a dedicated `Pricing` section beside/near the existing editable product details.

Fields:

- Base price (SAR), optional;
- clear explanation: blank = Price on request;
- live formatted preview;
- validation messaging.

Save through the existing protected admin product action.

After save:

- clear catalogue projection cache;
- revalidate public Products;
- revalidate the Product Detail route;
- revalidate admin product routes.

### 16.2 Variant pricing

The existing `AdminProductOptions` read-only presentation is not sufficient for price overrides.

Add a focused variant-pricing table using actual live variant rows:

Columns:

- SKU;
- Size;
- Type/Direction;
- Price override (SAR);
- Effective price.

Admin can edit/clear each override.

Blank override inherits the base price.

If both override and base are blank, Effective price shows `Price on request`.

### 16.3 Create Product

The Add Product form gains optional Base price (SAR).

New products remain drafts until explicitly activated.

### 16.4 Admin product list/completeness

Admin product rows gain pricing status:

- exact SAR;
- From SAR;
- Price on request.

Completeness gains a `pricing` item so the owner can see whether a product has configured commercial data.

Pricing being absent does not prevent activation because `Price on request` is a valid business state.

## 17. Inquiry pricing behavior

### 17.1 Inquiry item snapshot

When adding a configured product to the inquiry, persist:

- product ID;
- family/slug;
- product name/code;
- variant/configuration ID;
- SKU;
- size;
- variant/type;
- quantity;
- notes;
- media metadata;
- displayed unit price snapshot or null;
- currency `SAR`.

The client-side price is display state only and must not be trusted by the server.

### 17.2 Duplicate identity

Two lines are the same inquiry line only when product + selected configuration are the same.

Different configurations of the same product must remain separate lines.

### 17.3 Line totals

For a priced line:

`line subtotal = authoritative unit price * quantity`

For an unpriced line:

`Price on request`.

### 17.4 Basket summary

All lines priced:

- show `Estimated total` with SAR amount.

Mixed priced/unpriced:

- show `Priced items subtotal`;
- show number of unpriced lines/items;
- show `Complete quotation total — Pending`.

All lines unpriced:

- no fake zero total;
- show `All selected items require quotation pricing` / localized equivalent.

Quantity edits update line and basket totals immediately.

## 18. Server-authoritative quotation pricing

The `/api/checkout` request must not trust client-supplied money.

At submission:

1. normalize and validate customer/cart payload;
2. collect requested product/configuration IDs;
3. read authoritative current `products.price` and `product_variants.price_override` from Supabase;
4. verify each configuration belongs to the submitted product;
5. calculate effective unit price on the server;
6. calculate line subtotals using decimal-safe arithmetic;
7. calculate priced subtotal and completeness state;
8. create the quote request and immutable line snapshots transactionally where possible;
9. return the reference ID.

Tampered client prices must have no effect on stored quotation pricing.

## 19. Structured quotation line snapshots

The current database has `quote_requests` but no structured line table. Human-readable `message` alone is not sufficient for reliable pricing/history.

Add a versioned Supabase migration for a child table conceptually equivalent to:

```sql
quote_request_items (
  id uuid primary key,
  quote_request_id uuid not null references quote_requests(id) on delete cascade,
  product_id uuid null,
  product_variant_id uuid null,
  product_name text not null,
  product_code text not null,
  sku text null,
  size text null,
  variant_type text null,
  quantity integer not null,
  unit_price numeric null,
  currency text not null default 'SAR',
  line_subtotal numeric null,
  notes text null,
  created_at timestamptz not null default now()
)
```

Migration requirements:

- quantity check > 0;
- unit price/subtotal non-negative when present;
- currency constrained to `SAR` for this version;
- index `quote_request_id`;
- access policy aligned with existing service/admin behavior;
- anonymous public clients must not gain direct read access;
- server/service role writes only through the app submission path;
- verify Supabase security advisor after applying.

The exact migration file location must follow the repository's chosen migration convention. If the repository still has no versioned migration directory at execution time, establish one explicitly and record the command/process in the completion note rather than applying an undocumented dashboard-only schema change.

The existing `quote_requests.message` remains as a readable snapshot for backward compatibility.

## 20. Admin Inquiry pricing review

`/admin/inquiries` must stop relying only on a free-form message to explain a priced cart.

For each new inquiry render structured line items:

- product;
- code/SKU;
- size/type;
- quantity;
- unit price or Price on request;
- line subtotal or Pending;
- notes.

Summary:

- priced subtotal;
- unpriced count;
- complete Estimated total only when all lines are priced.

Existing historical inquiries without child rows must continue to render their old `message` safely.

Status/private-note/delete behavior remains intact.

## 21. Homepage Comprehensive Plans alignment

### 21.1 Problem

The lead row containing Plastic Surgery remains max-width 70rem while the four supporting specialties have been widened to 80rem.

### 21.2 Decision

Use one apparent left/right content rail for the visual sequence.

Desktop/tablet goals:

- lead row max-width = same 80rem wide rail as supporting specialties;
- Plastic Surgery image starts at the same apparent left margin as the first supporting specialty/catalogue-aligned imagery;
- enlarge the Plastic Surgery media column meaningfully rather than stretching the bitmap;
- keep editorial text readable;
- do not distort image aspect ratio;
- mobile remains one-column and naturally full-width.

Visual acceptance must use screenshots rather than only CSS-string tests.

## 22. Accessibility and interaction rules

- filters use real form controls;
- selected state is not conveyed by colour only;
- focus-visible states remain obvious;
- `Show more`/`Show less` controls announce state;
- Products result count uses an appropriate status/live behavior without excessive announcements;
- See More is a button, not a fake anchor;
- catalogue PDF links describe document opening/downloading;
- configuration selection exposes SKU/size/type context;
- price updates are understandable to screen-reader users;
- no hover-only essential behavior;
- reduced-motion is respected;
- RTL uses logical properties.

## 23. Performance rules

- no per-product animation loops;
- no rendering of the whole result set before See More requires it;
- facet calculation uses memoized pure selectors;
- URL updates use shallow client navigation and must not refetch the catalogue on every checkbox click;
- no large filter library dependency;
- no second search engine;
- no second cart store;
- use existing motion primitives only;
- hero asset repair should keep mobile filesize reasonable and not replace all hero formats unnecessarily.

## 24. Testing and acceptance matrix

### 24.1 Hero

- exact geometry parity across all five main pages at the same viewport;
- all four slides advance;
- mobile source chosen below breakpoint;
- third mobile image decodes;
- keyboard/swipe/dots;
- reduced motion.

### 24.2 Products search

- type normal text without crash;
- search by product name;
- exact code;
- non-primary SKU;
- size;
- variant;
- direction.

### 24.3 Facets

- family radio visibly checks red;
- multi-select boxes visibly check red;
- each facet filters correctly in isolation;
- OR within facet;
- AND across facets;
- counts/context recompute;
- Clear filters;
- URL hydration;
- Back/Forward;
- Arabic route persistence.

### 24.4 Progressive disclosure

- initial result cap;
- See More appends exactly one batch;
- button disappears at end;
- filter/search reset to first batch;
- no scroll jump;
- reduced-motion behavior.

### 24.5 Routing/catalogues

- five family routes redirect to `/products?family=`;
- Arabic equivalents redirect correctly;
- Product Detail remains canonical;
- Home five covers open correct PDFs;
- Products five cover/download actions remain correct.

### 24.6 Product Detail

- no Related Products heading/cards;
- configuration choices map to real rows;
- price updates with selected configuration;
- different configurations of same product produce separate inquiry lines.

### 24.7 Admin pricing

- create product with blank price;
- create product with valid SAR price;
- reject negative/malformed precision;
- edit base price;
- clear base price;
- set/clear variant override;
- effective price preview correct;
- public projection reflects admin save after revalidation.

### 24.8 Inquiry/quotation pricing

- priced line subtotal;
- quantity recalculation;
- mixed priced/unpriced basket;
- all-priced total;
- all-unpriced state;
- client price tampering ignored by server;
- persisted child snapshots use server prices;
- admin reads structured lines;
- legacy message-only inquiry still renders.

### 24.9 Homepage alignment

At desktop/tablet widths, screenshot asserts or geometry assertions verify Plastic Surgery lead rail starts at the same content boundary as the supporting specialty row.

### 24.10 Full verification

Required before deployment claim:

```bash
pnpm verify
pnpm test:e2e
cd apps/web
npx opennextjs-cloudflare build
```

Also run focused unit/browser tests during each task rather than waiting for the final pass.

## 25. Explicit non-goals

Not included:

- payments;
- order placement;
- taxes;
- shipping prices;
- inventory reservation;
- discounts/coupons;
- customer accounts for purchase history;
- recommendations/Related Products;
- fabricated country of origin;
- fabricated delivery methods;
- fabricated prices;
- maintaining duplicate family-listing experiences;
- a separate Downloads main page.

## 26. Final target experience

A user lands on a coherent Rosa site where every main page has the same correctly sized responsive banner. Products is the single powerful discovery hub, with reliable search, professional contextual filters and controlled progressive disclosure. Catalogue artwork opens real documents. Product Detail is focused and configuration-aware rather than cluttered by suggestions. Real SAR prices can be administered centrally, variant overrides behave predictably, the inquiry cart totals what is actually priced without lying about missing prices, and submitted quotations preserve server-authoritative commercial snapshots for the owner. The Homepage visual rails align cleanly and no legacy route or visual inconsistency undermines the client's intended professional presentation.
