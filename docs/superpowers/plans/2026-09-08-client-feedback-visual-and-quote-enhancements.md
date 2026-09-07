# Client Feedback Visual & Quote Enhancements Implementation Plan

> **For Codex/ChatGPT:** REQUIRED SUB-SKILL: use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply the client-requested footer, signup-banner, Contact typography, branding, placeholder, and global contrast refinements, then add a bilingual quotation-only multi-item inquiry flow without introducing ecommerce checkout or breaking Elementor/Woo ownership.

**Architecture:** Preserve the current ownership model: Elementor Free owns editable page-body content for Home/About/Contact; WooCommerce remains the source of truth for products, families, SKUs, configurations, product media/descriptions and future pricing while public prices remain hidden; Rosa settings own shared business contact data; the child theme owns the shared shell, footer, signup banner, header/logo presentation, responsive/RTL CSS, shared JS, Woo public presentation and the new dynamic quotation flow. The quotation system must reference Woo products/configurations without using Woo Cart, Checkout, Orders, payment, shipping, ratings or public inventory. The client-requested Pages/Team/Blog/FAQ expansion is explicitly deferred.

**Tech Stack:** WordPress, WooCommerce, Elementor Free, PHP, CSS, vanilla JavaScript, WordPress REST/admin-post facilities as appropriate, `wp_mail()` for the recommended email path, WP-CLI/shell contracts, and Playwright browser tests.

**Starting point:** `wordpress/client-content-controls` at accepted Phase 3B baseline `661e7dc23b5cc5f20b669331903f9bc73c727312`. Work remains inline on this existing branch. Do not deploy to Hostinger/production, mutate production Woo data, change DNS, merge branches, or weaken existing ownership/protective contracts.

---

## Task 0: Baseline and bounded input gates

Before each affected batch, pull with fast-forward only and confirm the working tree is clean/aligned. Preserve existing Phase 3B acceptance. If baseline verification fails before a production change, diagnose rather than masking it.

Three inputs gate only their respective future batches:

1. **Logo asset:** use the exact clean logo supplied by the client. Do not crop/reconstruct branding from screenshots.
2. **Newsletter destination/provider:** successful subscription feedback must correspond to a real destination/provider; no fake success state.
3. **Quote email semantics:** preferred implementation is a nonce-protected server-side WordPress submission using `wp_mail()`. If a mail-client handoff is chosen instead, never claim the inquiry was received.

The current immediate Batch 1 work is not blocked by any of these.

---

## Task 1 / Batch 1: Footer density and remove footer quote CTA

**Files:**
- Create: `wordpress/scripts/tests/client-handoff-footer-rhythm.test.mjs`
- Modify after observed RED only: `wordpress/wp-content/themes/rosa-medical-child/footer.php`
- Modify after observed RED only: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`

**Intent:** Recover the denser footer rhythm the client highlighted in the reference while preserving Rosa content, responsive behavior, bilingual behavior, contact data, family links, copyright and location. Remove only the final footer `Request a quote` CTA.

### RED

Create a focused Playwright contract covering `/` and `/ar/` at the canonical handoff viewports:
- 1440x900
- 1024x768
- 768x1024
- 431x932
- 390x844

The contract must assert real rendered behavior:
- footer exists and remains visible;
- Company and Support link stacks are compact sequential stacks with bounded inter-link gaps;
- section heading-to-first-link rhythm is controlled;
- business contact information remains present;
- footer CTA count for `.rosa-preview-footer .rosa-preview-button` is zero;
- copyright and bottom location remain present;
- no horizontal overflow.

Do not encode the Medicashop screenshot as pixel-perfect geometry. Encode a reasonable maximum vertical rhythm that the current footer violates and the intended compact result satisfies.

Commit RED only as:
`test(wordpress): define compact footer handoff rhythm`

The local runtime must observe the expected failure before any production edit.

### GREEN

After RED is confirmed, make the smallest production change:
- remove only the footer Request Quote anchor from `footer.php`;
- reduce excessive footer column/link spacing in the existing shared footer CSS owner;
- preserve minimum tap-target behavior and legibility;
- avoid broad shell redesign or unrelated typography changes.

Commit as:
`fix(wordpress): tighten footer rhythm and remove footer quote CTA`

Run the focused footer contract plus health/accessibility regressions and perform EN/AR standalone footer recaptures at all five viewports.

---

## Task 2 / Batch 2: Contact typography hierarchy

**Files:**
- Create: `wordpress/scripts/tests/client-handoff-contact-typography.test.mjs`
- Modify minimally: `wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css`

### RED

Across Contact EN/AR and all five handoff viewports, assert:
- left Contact headline has strong emphasis;
- `Send us a message` has strong emphasis;
- form labels Name/Phone/Subject/Email/Message use a clearly stronger font weight;
- input/textarea placeholder and entered text remain regular rather than bold;
- numbered 01/02/03 contact channels remain present;
- no horizontal overflow.

Commit:
`test(wordpress): define Contact type hierarchy`

### GREEN

Apply the narrowest Contact-specific CSS correction. Target approximately strong headings/labels and regular form values without changing the accepted Contact topology, cards, form layout or channel information.

Commit:
`fix(wordpress): strengthen Contact heading and label hierarchy`

Run Contact rhythm/fidelity, Elementor authoring, accessibility and health-flow regressions.

---

## Task 3 / Batch 3: Global interactive contrast and hover-state cleanup

**Files:**
- Create: `wordpress/scripts/tests/client-handoff-interactive-contrast.test.mjs`
- Modify minimally: shared Rosa button/link rules in `assets/css/client-preview.css`; use page-specific overrides only when proven necessary.

### RED

Probe representative filled Rosa-red CTAs and links across Home, About, Contact, Shop and Product Detail in EN/AR. Assert normal, hover, focus-visible and active states keep intentional foreground/background combinations and accessible contrast. Red buttons must not transition to dark text on dark red. Keyboard focus must remain visibly distinguishable.

Commit:
`test(wordpress): define shared interactive contrast states`

### GREEN

Normalize the shared interactive state cascade at the lowest correct CSS owner. Do not solve with widespread `!important`; remove the actual specificity/cascade conflict. Change muted text only where a demonstrable contrast defect exists.

Commit:
`fix(wordpress): normalize Rosa interactive contrast`

---

## Task 4 / Batch 4: Solid hero/media placeholders

**Files:**
- Create: `wordpress/scripts/tests/client-handoff-hero-placeholder.test.mjs`
- Modify only proven hero/media-placeholder selectors in `home-live-visual-recovery.css`, `live-visual-recovery.css`, and/or `about-live-visual-recovery.css`.

### RED

For actual future-image hero/banner surfaces on Home, About and Contact, assert that an unfilled media placeholder uses a solid Rosa red treatment rather than an arbitrary image-simulating gradient, retains readable foreground contrast and preserves accepted geometry.

Commit:
`test(wordpress): define solid media-placeholder hero treatment`

### GREEN

Replace only those placeholder gradients with a solid brand-red fallback. Do not flatten unrelated decorative gradients or evidence/feature treatments. Keep the structure ready for later real image replacement.

Commit:
`fix(wordpress): use solid brand hero placeholders`

Recapture Home/About/Contact across all canonical viewports and both locales.

---

## Task 5 / Batch 5: Replace global quote prefooter with newsletter banner

**Files:**
- Create: `wordpress/scripts/tests/client-handoff-newsletter-banner.test.mjs`
- Modify the child-theme helper that currently renders the shared prefooter and update `footer.php` callsite if needed.
- Modify shared responsive CSS for the new component.

### RED

Across primary EN/AR routes, assert exactly one shared newsletter banner with:
- localized headline;
- Name field;
- Email field;
- Sign Up action;
- accessible labels and correct email input semantics;
- responsive desktop/mobile structure;
- RTL alignment/order;
- absence of the old `Choose a family / Add a reference / Request a quote` prefooter controls.

Commit:
`test(wordpress): define shared signup banner contract`

### GREEN

Replace the current quotation prefooter with the newsletter component. Use the Medicashop screenshot as layout intent only. Do not copy its nurse image automatically; use a client-supplied/licensed image later or a restrained branded/neutral media surface. Do not expose fake subscription success. Wire actual submission only once the provider/destination is resolved.

Commit:
`feat(wordpress): replace quote prefooter with signup banner`

Provider integration, if required, receives its own RED/GREEN pair.

---

## Task 6 / Batch 6: Apply supplied Rosa logo

**Blocked only until the exact clean logo asset is available.**

Create a focused contract verifying one correct header logo, appropriate footer branding, meaningful alt text, intrinsic sizing/no stretching, responsive bounds and RTL stability. Update the shared logo/wordmark renderer rather than duplicating branding across templates.

Commits:
- `test(wordpress): define Rosa logo placement contract`
- `feat(wordpress): apply supplied Rosa logo`

---

## Task 7 / Batch 7: Quotation basket, independent of Woo cart

**Files:**
- Create focused source/browser contracts for quote state.
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/js/quote-basket.js`
- Modify: enqueue code in `functions.php` or the existing shared enqueue owner.

Create a versioned browser-state schema such as `rosa_quote_basket_v1` containing source identifiers such as product ID, variation/configuration ID, SKU and quantity. Woo remains authoritative; names/descriptions may be cached only for display convenience.

Required behavior:
- add one configuration;
- add multiple products/configurations;
- re-adding same configuration updates quantity rather than duplicating entries accidentally;
- remove item;
- change quantity;
- clear basket;
- persist during navigation and locale changes;
- gracefully drop invalid/unpublished selections after canonical revalidation;
- never store or display prices.

The contract must also prove that Woo Cart/Checkout/Orders are not used.

Commits:
- `test(wordpress): define multi-item quote basket behavior`
- `feat(wordpress): add quotation-only item basket`

---

## Task 8 / Batch 8: Add-to-Quote catalogue surfaces

Add quote actions to Shop product cards, Product Detail and configuration/variation choices where a product has distinct SKUs. Preserve exact configuration identity. Add a restrained shared quote count/indicator if useful, but do not imply ecommerce checkout.

Tests must prove Shop → Product → Quote Review persistence, exact SKU/configuration identity, EN/AR labels and continued absence of prices/Woo Add to Cart/Checkout UI.

Commits:
- `test(wordpress): define catalogue quote-selection surfaces`
- `feat(wordpress): add catalogue Add to Quote controls`

---

## Task 9 / Batch 9: Dedicated bilingual Quote Review routes

Create dynamic child-theme-owned routes:
- `/quote-request/`
- `/ar/quote-request/`

The review page must resolve current canonical catalogue data from Woo and present selected instrument, family, configuration, SKU, quantity, remove/edit controls, contact fields, notes, Email Inquiry and WhatsApp Inquiry. Empty state must route users back to Products. No subtotal, tax, checkout, stock, shipping or payment vocabulary/UI.

Commits:
- `test(wordpress): define bilingual quote review route`
- `feat(wordpress): add bilingual quote review experience`

---

## Task 10 / Batch 10: Protected email inquiry submission

Recommended implementation: nonce-protected WordPress server-side handler using `wp_mail()`.

Server responsibilities:
1. validate nonce;
2. sanitize visitor data;
3. validate bounded quantities;
4. resolve product/variation IDs from Woo;
5. reconstruct canonical product names, SKUs and configurations server-side;
6. reject invalid/unpublished selections;
7. compose a readable procurement inquiry;
8. send to the configured Rosa email;
9. return/redirect to success only when submission genuinely succeeds.

Add modest abuse protection such as honeypot plus bounded rate limiting without a heavy dependency. Do not create Woo Orders.

Commits:
- `test(wordpress): define protected quote email submission`
- `feat(wordpress): add protected quote email submission`

---

## Task 11 / Batch 11: WhatsApp quote handoff

Generate a structured WhatsApp message from canonical quote content and the configured Rosa WhatsApp number. Open WhatsApp only from an explicit user gesture. The site must say the inquiry was prepared/opened and instruct the visitor to complete sending in WhatsApp; never claim receipt without Business API confirmation. Do not clear the basket automatically merely because WhatsApp opened.

Commits:
- `test(wordpress): define WhatsApp quote handoff semantics`
- `feat(wordpress): add WhatsApp quotation handoff`

---

## Task 12 / Batch 12: Confirmation experience

Provide bilingual confirmation states with distinct semantics:
- email success may state that the inquiry was sent/received for processing only after actual successful server submission;
- WhatsApp handoff states that WhatsApp was opened/prepared and sending must be completed there.

Include return-to-products and start-new-inquiry actions. Avoid all ecommerce language such as order confirmed, purchase complete or checkout successful.

---

## Task 13: Final standalone graphic-design audit

After all functional batches, recapture and review the affected/shared surfaces at:
- 1440x900
- 1024x768
- 768x1024
- 431x932
- 390x844

for EN and AR.

Review:
- footer density;
- newsletter;
- header/logo;
- Contact hierarchy;
- hero placeholders;
- Shop/Product quote actions;
- Quote Review;
- email/WhatsApp confirmation states;
- spacing rhythm;
- typography hierarchy;
- red/white contrast;
- hover/focus states;
- RTL mirroring;
- mobile tapability;
- no ecommerce terminology;
- no duplicate/orphan CTAs;
- no horizontal overflow or dead bands;
- truthful submission states.

Client annotations are intent evidence, not pixel specifications.

---

## Task 14: Full regression gate before handoff

Run every new focused contract plus the protected existing suite, including at minimum:

```bash
node wordpress/scripts/tests/client-handoff-health-flow.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-about-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-contact-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-handoff-contact-rhythm.test.mjs http://localhost:8088/
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-product-detail-layout.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-product-detail-visual-contract.test.mjs http://localhost:8088/
bash wordpress/scripts/foundation-product-verify.sh
bash wordpress/scripts/tests/client-preview-content-zero-drift.test.sh
bash wordpress/scripts/tests/client-preview-seed-contract.test.sh
bash wordpress/scripts/tests/client-handoff-neutral-media-slot.test.sh
```

Then inspect final state:

```bash
git status --short
git log --oneline --decorate -20
```

Do not claim completion without fresh verification evidence. Do not perform production deployment or branch integration as part of this plan.

---

## Execution order

Footer → Contact typography → contrast/hover → hero placeholders → newsletter → logo → quote basket → Add to Quote → Quote Review → protected email submission → WhatsApp handoff → confirmation → final visual audit → full regression.

For each behavior-changing batch, follow strict TDD: define the smallest focused real-behavior contract, observe the intended RED, make the minimum production change, observe GREEN, run neighboring regressions, then proceed.
