# Rosa Free Foundation Execution-Order Amendment

Date: 2026-08-27
Status: execution correction; no architecture change
Applies to: `docs/superpowers/plans/2026-08-27-rosa-wordpress-free-foundation-gate-implementation.md`

The implementation plan contains a dependency inversion: Task 2 activates the Rosa child theme and `rosa-medical-core`, while Tasks 3 and 4 are the tasks that create those source packages.

The authoritative execution order is therefore:

1. Task 1 — replace the obsolete paid/template preflight;
2. Task 3 — create the Rosa child-theme shell;
3. Task 4 — create `rosa-medical-core` and centralized business settings;
4. Task 2 — mount and activate the now-existing Rosa source in the disposable WordPress runtime;
5. Task 5 — seed one verified WooCommerce variable-product fixture and shared Product Detail prototype;
6. Task 6 — verify Elementor Free editing, RTL and representative responsive behavior;
7. Task 7 — record the foundation-gate decision.

No requirements, acceptance criteria, paid-dependency policy, Hostinger boundary, catalogue rules, or business architecture are changed by this amendment.
