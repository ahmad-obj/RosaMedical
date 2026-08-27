# Foundation Fixture Source Correction

Date: 2026-08-27
Branch: `wordpress/medicashop-migration`

## Finding

The parsed text extracted from the supplied Scissors catalogue can misleadingly associate `04-0901` and `04-0911` with Iris Scissors because headings and table rows are flattened out of their visual columns.

The rendered catalogue page is authoritative for this fixture. On page 2 of the supplied Scissors catalogue:

- `04-0901` = Stevens Scissors, Regular, 10.5 cm, Straight, Sharp;
- `04-0911` = Stevens Scissors, Regular, 10.5 cm, Curved, Sharp.

The same rendered page places regular Iris Scissors in the `04-0800` / `04-0810` / `04-0802` / `04-0812` group.

## Decision

The Free Foundation Gate fixture is corrected to **Stevens Scissors, Regular** with exactly two real configurations:

1. `04-0901` — 10.5 cm — Straight — Sharp;
2. `04-0911` — 10.5 cm — Curved — Sharp.

No extra size, direction or variant combination may be created for this fixture.

This correction applies only to the foundation fixture and to any future migration logic that would otherwise reproduce the same parsed-text misassociation. The full deterministic catalogue migration must validate visually ambiguous extracted rows against the rendered source catalogue before import.
