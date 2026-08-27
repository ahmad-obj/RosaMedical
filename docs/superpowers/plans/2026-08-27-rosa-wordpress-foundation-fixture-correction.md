# Rosa WordPress Foundation Fixture Correction

Date: 2026-08-27
Status: execution correction to Task 5 of `2026-08-27-rosa-wordpress-free-foundation-gate-implementation.md`

## Correction

The Task 5 prose named the representative `04-0901` / `04-0911` fixture as Iris Scissors. Visual review of the rendered supplied Scissors catalogue shows those codes under **Stevens Scissors, Regular**, 10.5 cm, with Straight and Curved directions.

The foundation fixture is therefore locked as:

- Product: Stevens Scissors — Regular
- Family: Scissors
- Size: 10.5 cm
- Variant: Regular
- Straight SKU: `04-0901`
- Curved SKU: `04-0911`

The seed and verification scripts must create exactly those two configurations and no extras.

This correction prevents a parsed-text ordering ambiguity and older custom-site metadata from being propagated into the WordPress migration. The rendered catalogue remains authoritative for this fixture.
