# Rosa WordPress Catalogue, Banner, and Secondary Hero Restoration Design

**Date:** 2026-09-14  
**Target branch:** `wordpress/curated-grey-imagery-2026-09-14`

## Purpose

Restore four client-facing visual behaviors from the approved non-WordPress Rosa frontend into the current WordPress site without disturbing the current WooCommerce, quotation, Elementor, multilingual, or product-detail architecture.

The non-WordPress frontend under `apps/web/**` is the visual and interaction authority for this work. The WordPress implementation must reproduce those specific approved behaviors rather than reinterpret them.

## Scope

This design covers:

1. Homepage catalogue presentation.
2. Homepage four-banner hero carousel and its original imagery.
3. Removal of reddish photographic overlays on the affected public surfaces.
4. About page photographic top hero.
5. Contact page photographic top hero.
6. Responsive and accessibility verification for those surfaces.

It explicitly excludes Product Detail behavior, WooCommerce data modeling, quote-flow behavior, global navigation redesign, footer redesign, production deployment, DNS, and Hostinger/Cloudflare production changes.

## Reference Authority

The implementation must use the previous non-WordPress frontend as the source of truth.

Primary reference files include:

- `apps/web/src/features/homepage/sections/home-hero-carousel.tsx`
- `apps/web/src/features/homepage/home-hero-slides.ts`
- `apps/web/src/features/homepage/hero-carousel-state.ts`
- `apps/web/src/features/homepage/sections/home-family-gallery.tsx`
- `apps/web/src/styles/home-client-redesign.css`
- `apps/web/src/styles/home-client-redesign-polish.css`
- `apps/web/src/styles/home-client-interaction-fixes.css`
- `apps/web/public/media/editorial/home-hero/v1/`

The current WordPress implementation remains the architecture authority for ownership, authoring, data, EN/AR, RTL, and quote behavior.

## 1. Homepage Catalogue Section

### Required appearance

The homepage catalogue section must visually match the previous non-WordPress catalogue presentation.

The five catalogue families are shown in this order:

1. Scissors
2. Cutters
3. Punches
4. Chisels
5. Knives

On desktop and tablet widths, all five catalogue covers remain in a single horizontal row with equal visual weight. The implementation must not regress to a 3+2, 2+2+1, accordion, or expanding-gallery composition.

The catalogue covers must use the existing Rosa catalogue-cover assets and preserve their real colors. Catalogue cover images must not receive grayscale, desaturation, sepia, reddish tinting, or any global curated-media filter.

Hover and keyboard-focus behavior should follow the previous frontend: restrained image scale, border emphasis, and shadow refinement without changing the card geometry.

### Mobile behavior

On narrow mobile widths, the five covers must not be compressed into unusably narrow columns. Preserve the previous compact horizontal gallery/scroll/navigation behavior, including accessible controls where present.

### Interaction

Each catalogue cover continues to open its corresponding catalogue/PDF destination. This work does not change catalogue ownership or PDF administration.

## 2. Homepage Four-Banner Hero

### Imagery

Restore the exact four approved banner sets from:

`apps/web/public/media/editorial/home-hero/v1/`

Required files:

- `home-hero-01-desktop.webp`
- `home-hero-01-mobile.webp`
- `home-hero-02-desktop.webp`
- `home-hero-02-mobile.webp`
- `home-hero-03-desktop.webp`
- `home-hero-03-mobile.webp`
- `home-hero-04-desktop.webp`
- `home-hero-04-mobile.webp`

These become the default homepage hero media. Newly generated grey-tone hero images are not the default source for the carousel after this restoration.

Existing WordPress/Elementor media override behavior must remain intact where the current authoring contract permits client-selected media.

### Behavior

Reproduce the previous frontend interaction contract:

- exactly four slides;
- autoplay interval approximately 4750 ms, matching the old source constant;
- smooth crossfade/settle transition;
- dot navigation;
- manual slide selection;
- pause autoplay while the carousel is focused or actively manipulated;
- pause while the document is hidden;
- reduced-motion users do not receive autoplay animation;
- correct desktop/mobile source selection;
- preserve approved focal points and copy-side placement;
- RTL-safe behavior.

No abrupt cuts or unrelated animation system is introduced.

## 3. Photographic Overlay Cleanup

Reddish, pink, or Rosa-red gradient washes must be removed from photographic imagery on the affected Home, About, and Contact surfaces.

This includes reddish pseudo-elements, color washes, and red-tinted gradients currently layered over photographs.

The rule is not “remove every overlay.” Where white text is rendered over a photograph, a subtle neutral charcoal/black readability scrim may remain or be introduced. Its purpose is contrast only and it must not recolor the image.

Catalogue cover imagery receives no readability scrim, no grayscale filter, and no red tint.

Decorative non-photographic red brand elements such as buttons, small accents, rules, badges, or CTA backgrounds are outside this removal requirement.

## 4. About Top Hero

Replace the current gradient-only About hero background with a fixed photographic hero.

Use the old homepage **Hero 2** banner image as the About hero default:

- desktop: `home-hero-02-desktop.webp`
- mobile: `home-hero-02-mobile.webp`

The existing About eyebrow, title, body copy, page structure, and authoring contract remain unchanged.

The hero receives only a neutral readability layer as required for text contrast. No reddish gradient may be placed over the image.

Desktop, tablet, and mobile focal positioning must be tuned independently so the relevant instrument subject remains visible without sacrificing title readability.

## 5. Contact Top Hero

Replace the current gradient-only Contact hero background with a fixed photographic hero.

Use the old homepage **Hero 4** banner image as the Contact hero default:

- desktop: `home-hero-04-desktop.webp`
- mobile: `home-hero-04-mobile.webp`

The existing Contact eyebrow, title, body copy, page structure, and authoring contract remain unchanged.

Use only a neutral readability layer where required. No reddish gradient may recolor the image.

Responsive focal positioning must be tuned independently for desktop, tablet, and mobile.

## 6. Ownership and Compatibility

The implementation must preserve these boundaries:

- WooCommerce remains authoritative for products, families, SKUs, variations, and product data.
- Elementor Free remains the appropriate authoring layer for editable page body content/media.
- The child theme owns the presentation CSS, shared public shell, and page-level media fallbacks.
- Existing EN/AR and RTL behavior must remain valid.
- Existing client-selected WordPress/Elementor media should override fallback assets where that contract already exists.
- Product Detail remains the sole quote/configuration/quantity surface.
- Catalogue cards remain navigation-only.
- No production deployment is authorized by this design.

## 7. Implementation Architecture

Use a reference-port approach rather than a new redesign.

The WordPress implementation should:

1. Reuse or copy the exact old hero assets into a stable child-theme/reference-media location or seed them through the existing media-import mechanism.
2. Keep the current WordPress four-slide hero template but restore its default media, timing, focal points, and interaction behavior from the old source.
3. Adjust the homepage catalogue markup/CSS only as necessary to enforce the five-across desktop/tablet presentation and mobile horizontal interaction.
4. Scope full-color catalogue treatment to catalogue covers rather than disabling curated grayscale globally.
5. Replace About/Contact gradient-only page hero backgrounds with explicit responsive picture/background media while preserving current page text and geometry.
6. Remove red photographic overlays through narrowly scoped CSS changes rather than broad global color resets.
7. Preserve editable media precedence.

No unrelated refactor is part of this work.

## 8. Testing Strategy

Implementation follows TDD.

### Source/reference contract

Add or extend a source-reference test that pins:

- the five-family catalogue order;
- one-row desktop/tablet catalogue contract;
- the four `v1` hero desktop/mobile asset pairs;
- the 4750 ms hero autoplay value;
- About default = Hero 2;
- Contact default = Hero 4.

### WordPress structural contract

Add focused tests asserting:

- five homepage catalogue entries are present in the required order;
- catalogue covers do not inherit grayscale/filter classes;
- the homepage hero resolves the four old banner assets when no client override exists;
- About and Contact heroes resolve their required fixed banner images;
- affected photographic selectors do not use a Rosa-red overlay gradient;
- client-selected attachment IDs still take precedence.

### Browser verification

Verify at:

- 1440 px
- 1024 px
- 768 px
- 431 px
- 390 px

Confirm:

- five catalogue covers remain one row on desktop/tablet;
- mobile catalogue navigation remains usable;
- catalogue covers are visibly full color;
- all four homepage banners rotate correctly;
- no broken image sources;
- no red wash remains over photographs;
- About and Contact top heroes use the intended images;
- copy remains readable;
- no horizontal overflow;
- no collisions;
- minimum 44 px touch targets remain valid;
- EN/AR and RTL remain coherent;
- reduced-motion behavior remains valid.

### Regression verification

Run the existing focused WordPress homepage, accessibility, Elementor-authoring, and link contracts that cover these surfaces. Do not weaken tests merely to accommodate the visual change.

## 9. Success Criteria

The change is complete only when:

- the homepage catalogue visually reproduces the previous five-across catalogue treatment;
- catalogue covers retain their original colors;
- the homepage uses the exact previous four rotating banner sets;
- reddish photographic washes are absent from the affected surfaces;
- About uses old Hero 2 as a fixed responsive hero;
- Contact uses old Hero 4 as a fixed responsive hero;
- existing page copy, WooCommerce behavior, quote architecture, EN/AR, RTL, and Elementor override behavior remain intact;
- focused and browser verification are green at all required viewports.

