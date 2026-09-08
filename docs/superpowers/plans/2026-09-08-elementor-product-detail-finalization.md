# Elementor Product Detail Finalization Plan

**Goal:** Replace the fixed WooCommerce product-detail body with a polished MedicaShop-inspired Rosa layout whose global body composition is editable in Elementor Free while WooCommerce remains the canonical product-data source.

## Architecture

- Keep the Rosa theme header, newsletter/footer, language routing, quote basket and Woo identity untouched.
- Create one reusable `elementor_library` Product Detail template, seeded with Rosa dynamic product widgets and opened from **Rosa Medical → Product Page**.
- Resolve live Woo product context at render time; use one real published product only as the Elementor editor preview fixture.
- Render the Elementor template on every Woo product route. Fall back to the existing PHP product prototype if Elementor or the seeded template is unavailable.
- Keep all pricing transactional UI disabled; only quotation workflow controls are exposed.

## TDD / implementation tasks

1. Add a source contract that fails until the Product Detail template service, widgets, admin shortcut, renderer and gallery behavior exist.
2. Add `ProductTemplate` lifecycle/context/rendering and deterministic seed topology.
3. Add independent Elementor widgets: Breadcrumb, Gallery, Summary, Details, Configurations, Procurement Support and Related Instruments.
4. Add the Product Page admin shortcut and bootstrap/registry wiring.
5. Route Woo single-product requests through the Elementor renderer with the legacy prototype as fail-safe fallback.
6. Replace the product visual recovery stylesheet with the finalized Rosa/MedicaShop composition and add lightweight gallery behavior.
7. Enqueue product assets for both live product routes and the Elementor template preview.
8. Run PHP lint and the focused source contract locally; provide browser/runtime verification commands for the project Docker environment.

## Design gates

- Desktop: gallery + information split, 1240px rail, generous white space, clear Rosa-red quote action.
- Product data: exact Woo title, family, SKU, description, gallery and variation identities only.
- Configuration selector and per-configuration quote controls remain compatible with the shared Rosa quote basket.
- No reviews, star ratings, checkout/cart, invented stock claims or fake trust badges.
- Mobile touch targets ≥44px; strong focus-visible states; logical-property CSS and mirrored RTL behavior.
