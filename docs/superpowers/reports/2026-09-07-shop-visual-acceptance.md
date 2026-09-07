# Shop visual acceptance — 2026-09-07

## Scope

Public Shop pages:

- `/shop/`
- `/ar/shop/`

Frozen visual authority remains the approved `rosamedical.org` baseline captured on 2026-09-06.

## Accepted implementation

Accepted branch state is based on Shop recovery pass 4 at commit:

`2df89726c0a0e6a6b4fadd8e6f4154781c9ad00f`

The Shop topology regression is GREEN for EN/AR across desktop/tablet/mobile. The page now uses the approved Find Product hero, a populated Woo/family catalogue surface, procurement workflow, procurement-support section, family navigation, and the shared quotation CTA while preserving WooCommerce ownership of product truth.

## Visual verification status

The strict automated visual verifier still reports differences above its 3% pixel threshold. This is not being represented as pixel-perfect automated parity.

The user manually reviewed the generated side-by-side screenshots for EN/AR at 1440×900, 1024×768, and 390×844 and accepted the current Shop appearance as sufficiently close and professional for this project stage. Total page-height rhythm is also close to the frozen reference at the principal reviewed widths, including examples such as 1440 EN 4875px versus 4844px reference and 390 EN 5963px versus 5930px reference.

## Post-Shop live-sync checkpoint

The required fresh-live sync could not complete because the current production edge (`hcdn`) returned HTTP 403 to automated headless navigation for every Shop route/viewport. The tool therefore emitted `TARGET_DRIFT`, but no fresh production screenshot or comparable DOM evidence was obtained.

This checkpoint is classified as **LIVE_SYNC_UNAVAILABLE / EDGE_403**, not as evidence that the approved live target materially changed.

- The frozen 2026-09-06 baseline remains intact and unchanged.
- All Shop Pass 1–4 visual work was compared against that frozen baseline.
- Do not refresh or replace the frozen target from the failed 403 run.
- If automated live access later becomes available, rerun the Shop sync before any future target refresh.

## Freeze decision

- Treat Shop EN/AR presentation as accepted/frozen unless the user explicitly reopens it.
- Do not continue Shop tuning solely to satisfy the strict pixel threshold.
- Preserve WooCommerce ownership and the shared shell/CTA architecture.
- Continue the recovery workflow with representative Product Detail / product-family recovery.
