# Rosa Medical WordPress Client Preview — Visual Acceptance Runbook

Date: 2026-08-30
Scope: `wordpress/client-preview-medicashop-recreation`

## Purpose

Use this runbook before the Hassan/client preview is recorded or shared. The goal is to confirm that the independently authored Rosa implementation remains recognizably MedicaShop-like in composition while using truthful Rosa content, free-stack code, responsive behavior and real Arabic/RTL presentation.

The supplied ThemeForest browser captures are visual-analysis evidence only. Do not copy or ship their proprietary source or assets.

## Required pages

Review all of these surfaces:

- English Home
- English About
- English Contact
- English Shop
- Arabic Home
- Arabic About
- Arabic Contact
- Arabic Shop

The minimum reference-role comparison set is English Home/About/Contact/Shop plus Arabic Home and at least one Arabic interior page. The automated screenshot matrix captures all eight pages.

## Required viewport matrix

Capture and inspect each required page at:

- 390×844
- 430×932
- 768×1024
- 1024×768
- 1366×768
- 1440×900
- 1920×1080
- 2560×1440

## Per-screenshot acceptance record

For every required screenshot record:

```text
Page / viewport:
reference silhouette/composition: PASS/FAIL + concrete observation
Rosa content substitution: PASS/FAIL + concrete observation
banner crop: PASS/FAIL + concrete observation
header/footer fidelity: PASS/FAIL + concrete observation
horizontal overflow: PASS/FAIL
RTL geometry where applicable: PASS/FAIL
unsupported retail/proprietary content: PASS/FAIL
```

A script exit code is not visual acceptance. Open and inspect every required capture.

## Home checks

- Header silhouette, announcement strip, hero proportion and section rhythm remain recognizably aligned with the saved MedicaShop homepage reference.
- Hero uses Rosa-owned surgical/medical imagery rather than pharmacy/pill imagery.
- Who-we-are, stat strip, product rows, three-column value strip, feature banner, paired promo roles, why-us block, proof/value role and final contact CTA preserve their intended positions.
- No fabricated testimonial/customer/partner claims.
- No newsletter-subscription role remains; the closing block is Rosa inquiry/contact oriented.
- Product images use contained presentation where cards represent instruments.

## About checks

- Title hero, split media/content, stat strip, three-card role block, feature banner, why-us, proof/value role, family strip and final CTA remain in the saved reference order.
- Opening-hours claims are not invented.
- Pharmacy/store language is removed without redesigning the page structure.

## Contact checks

- Title hero, contact-information/form split, map/location role and closing CTA retain the reference composition.
- Address, phone and email match centralized Rosa business settings.
- No ThemeForest/demo contact values remain.
- If precise map coordinates are not verified, the page must not fabricate them.

## Shop checks

- Treat the supplied Shop capture only as asset/style evidence; its saved HTML is not authoritative complete markup.
- Hero/title, search/grid rhythm, product-card proportion and footer remain template-like.
- Use real WooCommerce products only; no invented SKU/product configuration.
- Unknown price state is `Price on request` / Arabic equivalent.
- No Add to Cart, Checkout, My Account, ratings, wishlist, shipping, return, payment or sale-badge UX.
- Product imagery is contained rather than destructively cropped.
- Do not claim Single Product visual fidelity; no complete reference was supplied.

## Responsive expectations

### 390×844

- Compact header and drawer.
- Home/split sections stacked.
- Product grid uses two columns only where readable; fall back to one when content width requires it.
- No clipped Arabic text or controls.
- No horizontal scrolling.

### 430×932

- Same mobile structure with stable two-card capability where readable.
- Promo, CTA and form controls remain usable.

### 768×1024

- Tablet/drawer navigation.
- Two-column product grid.
- Promos/value blocks may remain paired when readable.

### 1024×768

- Compact crossover layout.
- Three-column Shop is acceptable.
- Short-height rule prevents oversized hero/section gaps.

### 1366×768

- Full navigation.
- Four-column Shop/Home product row where content permits.
- Feature and hero areas remain short-height friendly.

### 1440×900

- Full desktop MedicaShop-like rhythm and section hierarchy.

### 1920×1080 and 2560×1440

- Content rails remain bounded.
- Typography/cards do not scale endlessly.
- Page does not become sparse due to excessive horizontal stretching.

## Mobile drawer / keyboard acceptance

Verify on a mobile-width page:

1. Menu trigger is reachable by keyboard.
2. Enter/Space activation works naturally through the button element.
3. `aria-expanded` changes to `true` on open and `false` on close.
4. Announcement/header background, main content and footer are inert while drawer is open; the drawer remains interactive.
5. Initial focus moves inside the drawer.
6. Tab wraps from the last drawer control to the first.
7. Shift+Tab wraps from the first control to the last.
8. Escape closes the drawer.
9. Overlay click closes the drawer.
10. Close button closes the drawer.
11. Normal close restores focus to the trigger.
12. Navigation-link activation closes without forcing focus restoration before navigation.
13. Scroll lock is removed after close.

## Accessibility acceptance

### Focus

Verify visible focus on:

- primary navigation
- language switch
- inquiry CTA
- menu trigger/close control
- product media/title/action links
- Contact form fields/button
- Shop search
- pagination
- footer links

Interactive controls should provide practical 44px minimum target size where appropriate.

### 200% zoom

At 200% browser zoom:

- normal content reflows without horizontal scrolling;
- navigation changes mode rather than clipping;
- form controls and cards remain operable;
- Arabic text is not cut off.

### Text spacing

Apply a WCAG-style text-spacing override and check that headings, buttons, nav links, cards and forms do not clip or overlap.

### Reduced motion

Enable `prefers-reduced-motion: reduce` and verify non-essential transitions/animations are removed or effectively instantaneous.

### RTL

For Arabic pages verify:

- `<html lang="ar" dir="rtl">`;
- Tajawal/Noto Sans Arabic-capable stack;
- inline-start/end geometry behaves correctly;
- drawer originates from inline-end;
- contact details, cards, hero copy and footer follow RTL reading flow;
- directional affordances are not incorrectly mirrored if their meaning is non-directional.

## Browser console / network checks

Inspect console on at least:

- English Home desktop
- English Shop mobile
- Arabic Home desktop
- Arabic Contact or Shop mobile

No uncaught JavaScript exception attributable to the client-preview implementation is acceptable.

Inspect page/network/source paths and confirm no production dependency or visible asset comes from:

- `preview.themeforest.net`
- `fullkit.moxcreative.com`
- Elementor Pro
- ElementsKit
- Skyboot
- MedicaShop proprietary asset paths

## Truthfulness / content checks

Verify visible pages contain no unsupported:

- certification claims
- customer testimonials
- partner/customer-logo claims
- shipping guarantees
- return/refund promises
- secure-payment/payment-method claims
- operating hours
- fabricated address, phone or email

Contact information must resolve from Rosa business settings. If required business values are empty, runtime verification must fail rather than invent values.

## Known reference limitations

- The saved Shop HTML is not authoritative complete source markup; Shop fidelity is judged against the supplied visual assets/style evidence and overall MedicaShop language, not a pixel-perfect source comparison.
- No complete MedicaShop Single Product capture was supplied. This preview does not claim Single Product fidelity.

## Video acceptance

Before sharing the video, confirm the walkthrough shows:

1. English Home — hero, who-we-are, product/value sections, feature and CTA.
2. About — key reference-role sections.
3. Contact — Rosa business details and form/location role.
4. Shop — product grid.
5. Language switch to Arabic.
6. Arabic Home — major sections and RTL geometry.
7. Arabic About or Contact.
8. 390×844 mobile Home and mobile drawer briefly.

Do not include speculative redesign work or unfinished developer/debug UI in the client video.
