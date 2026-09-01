#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
ARTIFACT_DIR="${ROSA_HOSTINGER_ARTIFACT_DIR:-$ROOT_DIR/wordpress/.hostinger-migration}"
FILES_ARCHIVE="$ARTIFACT_DIR/rosa-medical-wordpress-files.tar.gz"
DB_SQL="$ARTIFACT_DIR/rosa-medical-db.sql"
DB_GZ="$ARTIFACT_DIR/rosa-medical-db.sql.gz"
MANIFEST="$ARTIFACT_DIR/migration-manifest.txt"
CHECKSUMS="$ARTIFACT_DIR/SHA256SUMS"
PREFLIGHT_REPORT="$ARTIFACT_DIR/preflight-report.txt"

compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then
  compose+=(--env-file "$ENV_FILE")
fi
wp(){ "${compose[@]}" run --rm wpcli "$@"; }
fail(){ printf 'Hostinger export failed: %s\n' "$1" >&2; exit 1; }

mkdir -p "$ARTIFACT_DIR"

printf '==> running migration preflight\n'
ROSA_HOSTINGER_ARTIFACT_DIR="$ARTIFACT_DIR" bash "$SCRIPT_DIR/hostinger-migration-preflight.sh"

rm -f "$FILES_ARCHIVE" "$DB_SQL" "$DB_GZ" "$MANIFEST" "$CHECKSUMS"
stage="$(mktemp -d "$ARTIFACT_DIR/.stage.XXXXXX")"
cleanup(){ rm -rf "$stage"; }
trap cleanup EXIT
site_stage="$stage/site-root"
mkdir -p "$site_stage"

printf '==> exporting WordPress database\n'
wp db export - --quiet >"$DB_SQL" || fail 'wp db export failed'
[[ -s "$DB_SQL" ]] || fail 'database dump is empty'
grep -Fq 'CREATE TABLE' "$DB_SQL" || fail 'database dump does not contain CREATE TABLE statements'
gzip -c "$DB_SQL" >"$DB_GZ"
gzip -t "$DB_GZ" || fail 'compressed database dump failed integrity check'

printf '==> copying running WordPress document root\n'
"${compose[@]}" exec -T wordpress tar -C /var/www/html -cf - . | tar -C "$site_stage" -xf -

[[ -f "$site_stage/wp-load.php" ]] || fail 'WordPress core files were not copied'
[[ -d "$site_stage/wp-content/themes/rosa-medical-child" ]] || fail 'Rosa child theme missing from staged site'
[[ -d "$site_stage/wp-content/plugins/rosa-medical-core" ]] || fail 'Rosa core plugin missing from staged site'
[[ -d "$site_stage/wp-content/plugins/woocommerce" ]] || fail 'WooCommerce plugin missing from staged site'
[[ -d "$site_stage/wp-content/plugins/elementor" ]] || fail 'Elementor plugin missing from staged site'

# Remove local-only/generated material that is not part of the production runtime.
rm -f "$site_stage/wp-content/debug.log"
rm -rf \
  "$site_stage/wp-content/cache" \
  "$site_stage/wp-content/upgrade" \
  "$site_stage/wp-content/backups-dup-lite" \
  "$site_stage/wp-content/updraft"
find "$site_stage" -type f \( -name '.DS_Store' -o -name '*.log' \) -delete 2>/dev/null || true

# The Docker image generates wp-config.php from environment variables. Replace it
# in the exported package with a conventional Hostinger-editable configuration.
prefix="$(wp db prefix 2>/dev/null || true)"
[[ "$prefix" =~ ^[A-Za-z0-9_]+$ ]] || prefix='wp_'

salts="$(wp eval 'for($i=0;$i<8;$i++){echo bin2hex(random_bytes(32))."\n";}' 2>/dev/null || true)"
mapfile -t salt_lines <<<"$salts"
(( ${#salt_lines[@]} >= 8 )) || fail 'could not generate WordPress security salts'

cat >"$site_stage/wp-config.php" <<PHP
<?php
/**
 * Rosa Medical production migration configuration.
 *
 * Replace the CHANGE_ME_* values with the database values shown in Hostinger
 * hPanel before using the manual migration path. Hostinger's managed migration
 * may rewrite these values automatically.
 */
define('DB_NAME', 'CHANGE_ME_HOSTINGER_DB_NAME');
define('DB_USER', 'CHANGE_ME_HOSTINGER_DB_USER');
define('DB_PASSWORD', 'CHANGE_ME_HOSTINGER_DB_PASSWORD');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

define('AUTH_KEY',         '${salt_lines[0]}');
define('SECURE_AUTH_KEY',  '${salt_lines[1]}');
define('LOGGED_IN_KEY',    '${salt_lines[2]}');
define('NONCE_KEY',        '${salt_lines[3]}');
define('AUTH_SALT',        '${salt_lines[4]}');
define('SECURE_AUTH_SALT', '${salt_lines[5]}');
define('LOGGED_IN_SALT',   '${salt_lines[6]}');
define('NONCE_SALT',       '${salt_lines[7]}');

\$table_prefix = '${prefix}';
define('WP_DEBUG', false);

if (! defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}
require_once ABSPATH . 'wp-settings.php';
PHP

if [[ ! -s "$site_stage/.htaccess" ]]; then
  cat >"$site_stage/.htaccess" <<'HTACCESS'
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
HTACCESS
fi

printf '==> creating WordPress files archive\n'
tar -C "$site_stage" -czf "$FILES_ARCHIVE" .
[[ -s "$FILES_ARCHIVE" ]] || fail 'WordPress archive is empty'

archive_list="$stage/archive-list.txt"
tar -tzf "$FILES_ARCHIVE" >"$archive_list"
for required in \
  './wp-config.php' \
  './.htaccess' \
  './wp-load.php' \
  './wp-content/themes/rosa-medical-child/' \
  './wp-content/plugins/rosa-medical-core/' \
  './wp-content/plugins/woocommerce/' \
  './wp-content/plugins/elementor/'; do
  grep -Fq "$required" "$archive_list" || fail "required archive path missing: $required"
done

if grep -Fq './wp-content/debug.log' "$archive_list"; then
  fail 'wp-content/debug.log leaked into migration archive'
fi

source_url="$(wp option get home 2>/dev/null || true)"
wordpress_version="$(wp core version 2>/dev/null || true)"
php_version="$("${compose[@]}" exec -T wordpress php -r 'echo PHP_VERSION;' 2>/dev/null || true)"
attachment_count="$(wp post list --post_type=attachment --post_status=inherit --format=count 2>/dev/null || true)"
active_theme="$(wp theme list --status=active --field=name 2>/dev/null | head -n1 || true)"
active_plugins="$(wp plugin list --status=active --field=name 2>/dev/null | paste -sd, - || true)"
branch="$(git -C "$ROOT_DIR" branch --show-current 2>/dev/null || true)"
head="$(git -C "$ROOT_DIR" rev-parse HEAD 2>/dev/null || true)"
files_bytes="$(stat -c '%s' "$FILES_ARCHIVE" 2>/dev/null || wc -c <"$FILES_ARCHIVE")"
db_bytes="$(stat -c '%s' "$DB_SQL" 2>/dev/null || wc -c <"$DB_SQL")"
db_gz_bytes="$(stat -c '%s' "$DB_GZ" 2>/dev/null || wc -c <"$DB_GZ")"
uploads_kb="$("${compose[@]}" exec -T wordpress sh -lc "du -sk /var/www/html/wp-content/uploads 2>/dev/null | awk '{print \$1}'" 2>/dev/null || true)"

cat >"$MANIFEST" <<EOF
Rosa Medical Hostinger Migration Manifest
generated_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)
branch=${branch:-unknown}
head=${head:-unknown}
source_url=${source_url:-unknown}
wordpress_version=${wordpress_version:-unknown}
php_version=${php_version:-unknown}
active_theme=${active_theme:-unknown}
active_plugins=${active_plugins:-unknown}
attachment_count=${attachment_count:-unknown}
uploads_kb=${uploads_kb:-unknown}
files_archive=rosa-medical-wordpress-files.tar.gz
files_archive_bytes=$files_bytes
database_sql=rosa-medical-db.sql
database_sql_bytes=$db_bytes
database_gzip=rosa-medical-db.sql.gz
database_gzip_bytes=$db_gz_bytes
preflight_report=preflight-report.txt
wp_config_note=wp-config.php contains CHANGE_ME_HOSTINGER_* database placeholders and DB_HOST=localhost
recommended_primary_method=Hostinger Websites -> Migrations -> Upload Backup Files (archive + standalone .sql)
manual_fallback=File Manager public_html + phpMyAdmin + edit wp-config.php + WordPress-aware URL replacement
EOF

(
  cd "$ARTIFACT_DIR"
  sha256sum \
    rosa-medical-wordpress-files.tar.gz \
    rosa-medical-db.sql \
    rosa-medical-db.sql.gz \
    migration-manifest.txt \
    preflight-report.txt > SHA256SUMS
)

printf '==> validating checksums\n'
(
  cd "$ARTIFACT_DIR"
  sha256sum -c SHA256SUMS
)

printf '\nHostinger migration package is ready:\n'
printf '  %s\n' "$FILES_ARCHIVE"
printf '  %s\n' "$DB_SQL"
printf '  %s\n' "$DB_GZ"
printf '  %s\n' "$MANIFEST"
printf '  %s\n' "$PREFLIGHT_REPORT"
printf '  %s\n' "$CHECKSUMS"
printf '\nNext: follow docs/runbooks/hostinger-wordpress-migration.md. Do not delete the local site until production verification passes.\n'
