#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
PREFLIGHT="$ROOT/wordpress/scripts/hostinger-migration-preflight.sh"
EXPORT="$ROOT/wordpress/scripts/hostinger-export.sh"
POSTDEPLOY="$ROOT/wordpress/scripts/hostinger-postdeploy-verify.sh"
RUNBOOK="$ROOT/docs/runbooks/hostinger-wordpress-migration.md"
CHECKLIST="$ROOT/docs/runbooks/hostinger-wordpress-migration-checklist.md"
IGNORE="$ROOT/.gitignore"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

for file in "$PREFLIGHT" "$EXPORT" "$POSTDEPLOY" "$RUNBOOK" "$CHECKLIST"; do
  [[ -f "$file" ]] || fail "missing migration deliverable: ${file#$ROOT/}"
done

for script in "$PREFLIGHT" "$EXPORT" "$POSTDEPLOY"; do
  bash -n "$script" || fail "shell syntax error: ${script#$ROOT/}"
  grep -Fq 'set -euo pipefail' "$script" || fail "strict mode missing: ${script#$ROOT/}"
done

grep -Fq 'wordpress/.hostinger-migration/' "$IGNORE" || fail 'migration artifact directory is not ignored'

for token in \
  'rosa-medical-child' \
  'rosa-medical-core' \
  'woocommerce' \
  'elementor' \
  'wp db check' \
  'wp-content/uploads' \
  'localhost' \
  '127.0.0.1' \
  '/rosa-reference-media' \
  'MIGRATION STATUS:'; do
  grep -Fq "$token" "$PREFLIGHT" || fail "preflight missing audit token: $token"
done

grep -Fq 'preflight-report.txt' "$PREFLIGHT" || fail 'preflight report artifact missing'
grep -Fq 'wp db export -' "$PREFLIGHT" || fail 'preflight must inspect an exported SQL stream without mutating serialized data'
grep -Fq 'get_attached_file' "$PREFLIGHT" || fail 'preflight must verify attachment files'

for token in \
  'rosa-medical-wordpress-files.tar.gz' \
  'rosa-medical-db.sql' \
  'rosa-medical-db.sql.gz' \
  'migration-manifest.txt' \
  'preflight-report.txt' \
  'SHA256SUMS' \
  'wp-config.php' \
  '.htaccess'; do
  grep -Fq "$token" "$EXPORT" || fail "export script missing artifact/packaging token: $token"
done

grep -Fq 'hostinger-migration-preflight.sh' "$EXPORT" || fail 'export must gate on migration preflight'
grep -Fq '/var/www/html' "$EXPORT" || fail 'export must package the running WordPress document root rather than only repository files'
grep -Fq 'wp db export -' "$EXPORT" || fail 'export must generate a real database dump'
grep -Fq 'sha256sum' "$EXPORT" || fail 'export must checksum migration artifacts'
grep -Fq 'wp-content/debug.log' "$EXPORT" || fail 'export must exclude local debug logs from the migration package'

for token in \
  'TARGET_URL' \
  '/about/' \
  '/contact/' \
  '/shop/' \
  '/ar/' \
  '/ar/about/' \
  '/ar/contact/' \
  '/ar/shop/' \
  '/product/rosa-foundation-stevens-scissors-regular/' \
  'localhost' \
  '127.0.0.1' \
  'lang="ar"' \
  'dir="rtl"'; do
  grep -Fq "$token" "$POSTDEPLOY" || fail "post-deploy verifier missing token: $token"
done

grep -Fq 'Upload Backup Files' "$RUNBOOK" || fail 'runbook must document Hostinger backup-upload migration'
grep -Fq 'File Manager' "$RUNBOOK" || fail 'runbook must document manual File Manager migration'
grep -Fq 'phpMyAdmin' "$RUNBOOK" || fail 'runbook must document database import'
grep -Fq 'wp search-replace' "$RUNBOOK" || fail 'runbook must document WordPress-aware URL replacement'
grep -Fq -- '--skip-columns=guid' "$RUNBOOK" || fail 'runbook must preserve GUIDs during URL replacement'
grep -Fq '256 MB' "$RUNBOOK" || fail 'runbook must explain phpMyAdmin size limit/SSH fallback'
grep -Fq 'Permalinks' "$RUNBOOK" || fail 'runbook must include permalink regeneration'
grep -Fq 'HTTPS' "$RUNBOOK" || fail 'runbook must include HTTPS verification'

grep -Fq 'BEFORE HOSTINGER' "$CHECKLIST" || fail 'checklist missing pre-migration phase'
grep -Fq 'IN HOSTINGER' "$CHECKLIST" || fail 'checklist missing Hostinger phase'
grep -Fq 'AFTER MIGRATION' "$CHECKLIST" || fail 'checklist missing post-migration phase'

printf 'PASS: Hostinger migration readiness tooling contract\n'
