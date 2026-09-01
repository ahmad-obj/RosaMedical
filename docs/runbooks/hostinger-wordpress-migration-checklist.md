# Rosa Medical → Hostinger Migration Checklist

Use this while performing the actual migration. For explanations and recovery steps, use `docs/runbooks/hostinger-wordpress-migration.md`.

## BEFORE HOSTINGER

- [ ] `git status --short` reviewed; unrelated work is not part of migration.
- [ ] `bash wordpress/scripts/hostinger-migration-preflight.sh` passes.
- [ ] `preflight-report.txt` ends with `MIGRATION STATUS: GO`.
- [ ] `bash wordpress/scripts/hostinger-export.sh` completes.
- [ ] `rosa-medical-wordpress-files.tar.gz` exists.
- [ ] `rosa-medical-db.sql` exists.
- [ ] `rosa-medical-db.sql.gz` exists.
- [ ] `migration-manifest.txt` reviewed.
- [ ] `sha256sum -c wordpress/.hostinger-migration/SHA256SUMS` passes.
- [ ] Local site still works.
- [ ] Destination domain/temporary domain is known.
- [ ] Any existing Hostinger destination site has been backed up.

## IN HOSTINGER

### Preferred managed migration

- [ ] Open **Websites → Migrations → Migrate website**.
- [ ] Choose **Upload Backup Files**.
- [ ] Upload `rosa-medical-wordpress-files.tar.gz`.
- [ ] Upload standalone `rosa-medical-db.sql`.
- [ ] Select the correct destination.
- [ ] Submit and wait for migration completion.

### If manual migration is required

- [ ] Open destination **File Manager**.
- [ ] Confirm correct `public_html`.
- [ ] Upload and extract `rosa-medical-wordpress-files.tar.gz` directly into `public_html`.
- [ ] Confirm there is no accidental extra nested directory.
- [ ] Go to **Databases → Management**.
- [ ] Create database + user.
- [ ] Record DB name.
- [ ] Record DB username.
- [ ] Record DB password securely.
- [ ] Confirm DB host (normally `localhost`).
- [ ] Edit `public_html/wp-config.php`.
- [ ] Replace all `CHANGE_ME_HOSTINGER_*` values.
- [ ] Open **phpMyAdmin**.
- [ ] Import `rosa-medical-db.sql`.
- [ ] If SQL is over 256 MB, use SSH import instead of phpMyAdmin.

## URL CONVERSION

- [ ] Read the exact old source URL from `migration-manifest.txt`.
- [ ] Run `wp search-replace` with `--all-tables-with-prefix --precise --skip-columns=guid`.
- [ ] Do not perform a raw SQL-wide text replacement.
- [ ] `wp option get home` shows the production URL.
- [ ] `wp option get siteurl` shows the production URL.

## WORDPRESS

- [ ] `/wp-admin/` opens.
- [ ] Active theme is Rosa Medical Child.
- [ ] Hello Elementor parent theme exists.
- [ ] Elementor active.
- [ ] WooCommerce active.
- [ ] rosa-medical-core active.
- [ ] WooCommerce Coming Soon mode is disabled.
- [ ] **Settings → Permalinks → Save Changes** completed.

## HTTPS

- [ ] Hostinger SSL is active.
- [ ] Final site loads using HTTPS.
- [ ] No browser mixed-content warning.
- [ ] No redirect to localhost.

## AFTER MIGRATION

- [ ] `/`
- [ ] `/about/`
- [ ] `/contact/`
- [ ] `/shop/`
- [ ] `/ar/`
- [ ] `/ar/about/`
- [ ] `/ar/contact/`
- [ ] `/ar/shop/`
- [ ] `/product/rosa-foundation-stevens-scissors-regular/`
- [ ] Arabic pages are RTL.
- [ ] Rosa logo loads.
- [ ] Product/media images load.
- [ ] Stevens variations/codes are present.
- [ ] Phone is `+966 59 720 4394`.
- [ ] Email is `info@rosamedical.org`.
- [ ] Riyadh address is correct.
- [ ] Desktop layout visually checked.
- [ ] 390–430px mobile layout visually checked.
- [ ] Menu works.
- [ ] Footer works.
- [ ] No `localhost` / `127.0.0.1` references.
- [ ] No `/rosa-reference-media` references.
- [ ] No WooCommerce “Coming Soon” page.

## AUTOMATED FINAL CHECK

```bash
TARGET_URL='https://YOUR-DOMAIN.EXAMPLE' \
bash wordpress/scripts/hostinger-postdeploy-verify.sh
```

- [ ] Post-deploy verifier passes.

## ONLY AFTER EVERYTHING PASSES

- [ ] Final DNS is pointed/confirmed if a temporary domain was used.
- [ ] Post-deploy verifier rerun against final production domain.
- [ ] Hostinger cache cleared.
- [ ] Final private/incognito browser check completed.
- [ ] Local Docker site retained until client confirmation.
- [ ] Migration package retained until client confirmation.
