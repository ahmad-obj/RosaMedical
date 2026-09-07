# Home visual acceptance — 2026-09-07

## Scope

Public Home pages:

- `/`
- `/ar/`

Frozen visual authority remains the approved `rosamedical.org` browser baseline captured on 2026-09-06.

## Recheck result

The dedicated Home frozen-live recheck at `artifacts/live-visual-recovery/20-home-recheck` completed all 16 EN/AR route/viewport comparisons.

The manifest reported no full-page-height or measured structural/geometry differences. Remaining differences were pixel-comparison-only:

- desktop: approximately 4.1%–7.2% at 1024–1920 widths;
- 768: approximately 3.2%;
- mobile 360–431: approximately 1.1%–1.3%.

These residual pixel differences are retained as diagnostic evidence; they are not being represented as strict 3% pixel parity at every desktop width.

## Acceptance basis

Home had already received the finished-template Elementor restoration before the corrective frozen-live recovery plan. The subsequent frozen-live recheck shows the expected page geometry and full-page rhythm remain intact across the full matrix, and the project acceptance standard is professional/convincingly close rather than pixel-perfect.

No additional Home production code change is justified by the current evidence.

## Freeze decision

- Treat Home EN/AR presentation as accepted/frozen unless explicitly reopened.
- Do not tune Home solely to eliminate residual pixel-comparison noise/content-state differences.
- Preserve Elementor Free ownership of the Home body and the existing shared-shell architecture.
- Continue recovery on About, which remains the material visual outlier.
