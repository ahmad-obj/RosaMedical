# Rosa Medical WordPress Visual Authority Correction

**Date:** 2026-09-04
**Status:** Authoritative correction to the 2026-09-03 parity design
**Working branch:** `wordpress/client-content-controls`

## Correction

The WordPress migration must copy the approved custom Rosa template, not the currently deployed `rosamedical.org` site.

The sole visual/template authority for parity work is:

- branch: `transfer/rose-medical-final-main-ready-2026-08-17`
- pinned commit: `57f2df01916ec1d7de65196994913711e9fb3039`

The current production URL `https://rosamedical.org/` is a deployment destination and may contain an older WordPress/Stevens state. It MUST NOT be used as the visual reference for implementation or screenshot parity before the approved template has been deployed there.

This correction overrides any earlier source hierarchy that placed the live production URL above the pinned custom template.

## Required parity workflow

1. Render/serve the pinned custom template from the transfer branch in an isolated local worktree or equivalent read-only reference runtime.
2. Render the WordPress implementation separately.
3. Capture matched template-vs-WordPress screenshots at the required EN/AR viewports.
4. Compare composition, shell, typography, spacing, media, crop, grids, CTA treatment, breakpoints and RTL against the template runtime.
5. Do not use the legacy/current live `rosamedical.org` output as a parity oracle.

## Scope consequence

Passing structural/runtime tests does not establish exact visual parity. Home body parity and full-page parity are different gates. The old WordPress header/footer/shared shell cannot be considered accepted merely because the seven latest Home body sections pass runtime tests.

Before Homepage parity is called complete, the WordPress page must be compared against the pinned custom template including the visible shared shell at all required viewports.

No Hostinger or production deployment is authorized by this correction.
