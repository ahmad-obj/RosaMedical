# Rosa Medical WordPress — Client-Preview MedicaShop Recreation Completion Record

Date: 2026-08-31
Branch: `wordpress/client-preview-medicashop-recreation`
Base commit: `6744207b97507f07761b30dd2d9ff505bff82fa1` (on `wordpress/medicashop-migration`)
Approved Spec: `docs/superpowers/specs/2026-08-30-rosa-wordpress-client-preview-medicashop-recreation-design.md`
Approved Plan: `docs/superpowers/plans/2026-08-30-rosa-wordpress-client-preview-medicashop-recreation-implementation.md`
Visual Acceptance Runbook: `docs/runbooks/wordpress-client-preview-visual-acceptance.md`

---

## 1. Summary of Execution & Results

This branch implements the client-preview lane recreating the public MedicaShop visual composition using Rosa-owned code, Rosa branding/content, verified business settings, and Rosa-owned media from the repository. It provides paired English and Arabic/RTL preview routes, responsive support across 8 viewports, full automated runtime verification, and visual captures.

### Key Verification Results
- **Unit & Contract Suite:** 17 tests passed (15 bash test contracts, 2 PHP test contracts).
- **Runtime Verification:** `wordpress/scripts/client-preview-runtime-verify.sh` passed cleanly with exit code 0.
- **Screenshot Matrix:** 64 responsive captures produced across 8 viewports (390×844, 430×932, 768×1024, 1024×768, 1366×768, 1440×900, 1920×1080, 2560×1440) for 8 pages (English Home, About, Contact, Shop; Arabic Home, About, Contact, Shop).
- **Video Capture:** `wordpress/scripts/client-preview-video-capture.sh` produced `wordpress/.client-preview-artifacts/video/rosa-client-preview.webm`.
- **Stevens Foundation Fixture:** Stevens Scissors Regular fixture (`04-0901`, `04-0911`) verified and preserved.

---

## 2. Issues Diagnosed & Repaired with TDD

### Bug 1: Strict-mode variable initialization in `client-preview-seed.sh`
- **Symptom:** `rel: unbound variable` when executing `import_media` under `set -euo pipefail`.
- **Root Cause:** Compound `local key="$1" rel="$2" host_src="$ROOT_DIR/$rel" ...` expanded `$rel` before the assignment was established during the single `local` builtin command evaluation.
- **TDD:** Added strict-mode subshell execution test to `wordpress/scripts/tests/client-preview-seed-contract.test.sh` (observed RED), declared `local` assignments on separate lines (observed GREEN).

### Bug 2: Regex escaping in `assert_single_main` in `client-preview-runtime-verify.sh`
- **Symptom:** `English Home expected exactly one <main>, found 0`.
- **Root Cause:** Double backslash in python raw string literal `r"<main(?:\\s|>)"` matched literal `\s` instead of whitespace, causing regex match to fail on `<main id="main">`.
- **TDD:** Added single-main assertion test to `wordpress/scripts/tests/client-preview-runtime-tooling.test.sh` (observed RED), corrected regex to `r"<main(?:\s|>)"` (observed GREEN).

---

## 3. Reference Boundary & Media Provenance

- **Reference Material:** Saved ThemeForest archives (`preview.themeforest.net*.zip`) were used exclusively as visual analysis evidence. No proprietary MedicaShop source code, Elementor Pro templates, or third-party assets were copied or committed.
- **Rosa-Owned Media Imported:**
  - `apps/web/public/media/brand/rosa-header-logo-v1.webp` -> Media Library attachment `logo`
  - `apps/web/public/media/editorial/home-hero-surgical-instruments.jpg` -> Media Library attachment `hero`
  - `apps/web/public/media/editorial/about-procurement.jpg` -> Media Library attachment `about_procurement`
  - `apps/web/public/media/editorial/about-hospitals.jpg` -> Media Library attachment `about_hospitals`
  - `apps/web/public/media/editorial/about-international-buyers.webp` -> Media Library attachment `about_international`
  - `apps/web/public/media/editorial/procurement-support.jpg` -> Media Library attachment `procurement_support`

---

## 4. Business Settings & Truthfulness

- **Verified Business Information:**
  - Phone: `+966 59 720 4394`
  - Email: `info@rosamedical.org`
  - Address: `King Fahd Road, Al Olaya, Riyadh 12214, Saudi Arabia`
  - Arabic Address: `طريق الملك فهد، العليا، الرياض 12214، المملكة العربية السعودية`
- Centralized through `rosa_business_settings` option.
- No fabricated testimonials, customer reviews, certifications, shipping guarantees, or return policies.

---

## 5. Route Architecture & Arabic/RTL Presentation

### Route Pairs:
- English Home (`/`) <-> Arabic Home (`/ar/`)
- English About (`/about/`) <-> Arabic About (`/ar/about/`)
- English Contact (`/contact/`) <-> Arabic Contact (`/ar/contact/`)
- English Shop (`/shop/`) <-> Arabic Shop (`/ar/shop/`)

### RTL & Accessibility:
- Arabic pages output `<html lang="ar" dir="rtl">`.
- Typography and alignment mirror correctly with logical CSS properties.
- Keyboard navigation: drawer opens, traps focus, closes on Escape/overlay click, and restores focus to trigger.
- Viewports 390px to 2560px render without horizontal scrolling or UI collisions.

---

## 6. Known Intentional Limitations

1. **Shop Archive Reference:** The saved ThemeForest shop archive was an asset/style reference only (saved HTML was a no-content stub); shop layout follows the visual language rather than a pixel-perfect HTML copy.
2. **Single Product Fidelity:** No MedicaShop Single Product reference was provided; canonical Stevens Scissors foundation fixture detail page remains functional with shared preview shell.
3. **Quotation / Procurement Semantics:** Consumer retail e-commerce UX (cart, checkout, customer accounts, payment gateways, reviews) is intentionally omitted in favor of quotation/inquiry actions.

---

## 7. Explicit Non-Actions & Environment Safety

- **Phase 2A Branch:** Preserved at `4f7fb7bf721b143c02f140c187e3c41d85b98276` on `wordpress/phase-2a-balanced-visual-foundation`; not merged or modified.
- **Production / Hostinger:** No changes to production hosting, DNS, Cloudflare, or remote deployment.
- **Unrelated Local File:** `apps/web/next-env.d.ts` remained unstaged and unmodified.
