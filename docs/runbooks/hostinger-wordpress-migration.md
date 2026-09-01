# Rosa Medical WordPress → Hostinger Migration Runbook

Date: 2026-09-01  
Scope: `wordpress/client-preview-medicashop-recreation`

## Purpose

This runbook moves the verified local Docker WordPress site to Hostinger without rebuilding the site inside hPanel. The migration transfers the complete WordPress document root and database, then replaces local URLs safely and verifies the deployed English, Arabic, WooCommerce and media surfaces.

Do not delete the local Docker site, the migration package, or any existing destination backup until production verification passes.

## What the repository prepares

Run these from the repository root:

```bash
bash wordpress/scripts/hostinger-migration-preflight.sh
bash wordpress/scripts/hostinger-export.sh
```

A successful export creates an ignored directory:

```text
wordpress/.hostinger-migration/
├── rosa-medical-wordpress-files.tar.gz
├── rosa-medical-db.sql
├── rosa-medical-db.sql.gz
├── migration-manifest.txt
├── preflight-report.txt
└── SHA256SUMS
```

Validate the package before uploading:

```bash
cd wordpress/.hostinger-migration
sha256sum -c SHA256SUMS
cd ../..
```

Only continue when the preflight report ends with:

```text
MIGRATION STATUS: GO
```

## Production values you will need

Before migrating, know:

- the destination domain or Hostinger temporary domain;
- Hostinger database name;
- Hostinger database username;
- Hostinger database password;
- database host (Hostinger web hosting normally uses `localhost`);
- the old local WordPress URL reported in `migration-manifest.txt`.

Never commit Hostinger credentials to Git.

## Recommended path — Hostinger “Upload Backup Files”

This is the first method to try because the source is an offline/local WordPress site and the export script already creates the two things Hostinger asks for: one compressed site-root archive and a standalone `.sql` database.

1. Sign in to Hostinger hPanel.
2. Open **Websites → Migrations**.
3. Choose **Migrate website**.
4. Choose the option for an offline site / **Upload Backup Files**.
5. Select the destination hosting plan/domain.
6. Upload:
   - `rosa-medical-wordpress-files.tar.gz`
   - `rosa-medical-db.sql`
7. Confirm the migration request and let Hostinger finish processing it.
8. Open the migrated site using the destination domain or temporary domain.
9. Do not assume the URL conversion is complete. Inspect the site and run the post-deploy checks below.
10. If Hostinger reports that the packaged `wp-config.php` still contains `CHANGE_ME_HOSTINGER_*`, edit it in hPanel File Manager using the database values shown in **Databases → Management**.

The package contains a conventional WordPress `wp-config.php` instead of the Docker image’s environment-driven config. Its database constants are intentionally placeholders, `DB_HOST` is `localhost`, and the security salts are freshly generated during export.

## Manual fallback — File Manager + phpMyAdmin

Use this path if the managed migration request is unavailable or rejects the offline package.

### 1. Prepare the destination

1. In hPanel, add/select the destination website.
2. If Hostinger asks which type of site to create before manual upload, use a blank/custom PHP site rather than building a new design.
3. If anything already exists at the destination, create/download a backup before overwriting it.

### 2. Create the database

1. Go to **Websites → Dashboard → Databases → Management**.
2. Create a new MySQL database and database user.
3. Record:
   - database name;
   - database username;
   - database password;
   - database host.
4. For standard Hostinger web hosting the database host is normally `localhost`; use the exact value shown by hPanel if it differs.

### 3. Upload WordPress files

1. Open **File Manager** for the destination website.
2. Open `public_html`.
3. Remove only files you intentionally intend to replace. Do not delete a backup.
4. Upload `rosa-medical-wordpress-files.tar.gz`.
5. Extract it directly into `public_html`.
6. Confirm that `public_html/wp-load.php`, `public_html/wp-content/`, `public_html/.htaccess`, and `public_html/wp-config.php` exist.
7. Make sure the archive was not extracted into an extra nested directory such as `public_html/rosa-medical-wordpress-files/`.

### 4. Configure `wp-config.php`

Open `public_html/wp-config.php` in File Manager and replace:

```php
define('DB_NAME', 'CHANGE_ME_HOSTINGER_DB_NAME');
define('DB_USER', 'CHANGE_ME_HOSTINGER_DB_USER');
define('DB_PASSWORD', 'CHANGE_ME_HOSTINGER_DB_PASSWORD');
define('DB_HOST', 'localhost');
```

with the exact values from hPanel.

Do not change `$table_prefix` unless the imported database uses a different prefix.

### 5. Import the database

1. Go to **Databases → phpMyAdmin**.
2. Open the database created for Rosa.
3. Prefer an empty destination database before import.
4. Choose **Import**.
5. Upload `rosa-medical-db.sql`.
6. Start the import and wait for success.

Hostinger’s current phpMyAdmin upload limit is 256 MB. If the `.sql` file is larger than 256 MB, use Hostinger SSH/database import instead of repeatedly retrying the browser upload.

### 6. Point WordPress at the new URL safely

The database will normally still contain the local source URL such as:

```text
http://localhost:8088
```

Do **not** open the SQL file in a text editor and globally replace strings. WordPress stores serialized values, and raw replacement can corrupt them.

Preferred method from Hostinger SSH/WP-CLI:

```bash
cd /path/to/public_html

wp search-replace \
  'http://localhost:8088' \
  'https://YOUR-DOMAIN.EXAMPLE' \
  --all-tables-with-prefix \
  --precise \
  --skip-columns=guid
```

Replace both URLs with the actual values from `migration-manifest.txt` and your Hostinger site.

Then verify:

```bash
wp option get home
wp option get siteurl
```

Both should show the production HTTPS URL.

If SSH/WP-CLI is not available on the hosting plan, first update only the `home` and `siteurl` rows through phpMyAdmin so `/wp-admin/` becomes reachable, then use a reputable WordPress serialized-data search/replace tool from inside WordPress. Do not use a plain SQL-wide text replacement.

### 7. Refresh WordPress routing

After the new URL is set:

1. Open `https://YOUR-DOMAIN/wp-admin/`.
2. Go to **Settings → Permalinks**.
3. Click **Save Changes** without needing to change the structure.
4. Confirm `/about/`, `/contact/`, `/shop/`, `/ar/`, and a product detail page no longer return 404.

This rebuilds WordPress rewrite rules and is the normal first fix for post-migration internal 404s.

## HTTPS

Before final acceptance:

1. Enable/confirm the Hostinger SSL certificate for the domain.
2. Make sure both **WordPress Address** and **Site Address** resolve to `https://`.
3. Load the homepage in a private browser window.
4. Confirm the browser does not report mixed-content warnings.
5. Inspect important images/styles/scripts for `http://localhost`, `127.0.0.1`, or the old development URL.

Do not force random `.htaccess` HTTPS rules before Hostinger SSL is active.

## WordPress-aware URL replacement check

From SSH, a dry run is useful before the real replacement:

```bash
wp search-replace \
  'http://localhost:8088' \
  'https://YOUR-DOMAIN.EXAMPLE' \
  --all-tables-with-prefix \
  --precise \
  --skip-columns=guid \
  --dry-run
```

Review the tables/counts, then rerun without `--dry-run`.

If the manifest reports a different local URL, use that exact source URL.

## Post-deploy automated verification

From the local repository, after the destination URL is publicly reachable:

```bash
TARGET_URL='https://YOUR-DOMAIN.EXAMPLE' \
bash wordpress/scripts/hostinger-postdeploy-verify.sh
```

The verifier checks:

- English Home;
- About;
- Contact;
- Shop;
- Arabic Home;
- Arabic About;
- Arabic Contact;
- Arabic Shop;
- the canonical Stevens product detail;
- Rosa branding;
- Arabic `lang="ar"` / `dir="rtl"`;
- verified business contact values;
- no localhost/loopback/reference-mount leakage;
- no WooCommerce Coming Soon interception;
- same-origin homepage assets.

Do not point/finalize DNS or delete the local source solely because the homepage opens. Run the complete verification.

## Manual visual verification

After the script passes, inspect at minimum:

- desktop homepage;
- 390–430px mobile homepage;
- menu;
- all four major English pages;
- all four Arabic/RTL pages;
- Shop;
- one product detail with variations;
- contact details;
- logo/media;
- forms;
- footer;
- WordPress admin login.

Also confirm WooCommerce products and variations still exist.

## Cache cleanup

After URL replacement and permalink refresh:

1. clear any Hostinger cache available for the website;
2. clear WordPress/plugin cache if enabled;
3. hard-refresh the browser;
4. retest from a private/incognito window.

Do not migrate old local cache directories; the export deliberately removes `wp-content/cache`, `wp-content/debug.log`, and backup-plugin artifact folders.

## DNS cutover

If the site is being verified on a Hostinger temporary domain, keep the current public domain untouched until acceptance is complete.

When ready:

1. point the domain using the exact DNS/nameserver instructions shown in hPanel;
2. wait for propagation;
3. verify HTTPS again;
4. run `hostinger-postdeploy-verify.sh` against the final domain;
5. keep the local backup and export package until the client has confirmed the site.

DNS propagation can take time; do not treat temporary regional differences immediately after cutover as a WordPress database failure.

## Rollback

If the Hostinger copy fails:

1. do not destroy the local Docker installation;
2. do not delete the migration package;
3. restore the destination from its Hostinger backup if it previously contained a working site;
4. correct the package/config/database issue;
5. repeat migration and verification.

## Final acceptance

Migration is complete only when all are true:

- Hostinger site responds over HTTPS;
- homepage, About, Contact, Shop and product detail work;
- Arabic routes render RTL;
- no `localhost`, `127.0.0.1`, `/rosa-reference-media`, or repository paths are visible;
- images/styles/scripts load;
- WooCommerce products/variations are intact;
- verified Rosa phone/email/address render;
- wp-admin works;
- permalinks work;
- post-deploy verifier passes;
- mobile and desktop visual checks pass.

Keep the source and migration artifacts until after final client confirmation.
