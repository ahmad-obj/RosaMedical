#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SEED="$ROOT/wordpress/scripts/client-preview-seed.sh"
COMPOSE="$ROOT/wordpress/dev/compose.yaml"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$SEED" ]] || fail 'client preview seed script missing'
grep -Fq 'rosa-header-logo-v1.webp' "$SEED" || fail 'Rosa logo import missing'
grep -Fq 'home-hero-surgical-instruments.jpg' "$SEED" || fail 'Rosa hero import missing'
grep -Fq '_rosa_preview_locale' "$SEED" || fail 'locale metadata missing'
grep -Fq '_rosa_preview_pair_id' "$SEED" || fail 'page-pair metadata missing'
grep -Fq 'rosa_preview_media' "$SEED" || fail 'preview media option missing'
grep -Fq 'client-preview-home.php' "$SEED" || fail 'home template assignment missing'
grep -Fq 'client-preview-about.php' "$SEED" || fail 'about template assignment missing'
grep -Fq 'client-preview-contact.php' "$SEED" || fail 'contact template assignment missing'
grep -Fq 'client-preview-shop.php' "$SEED" || fail 'Arabic shop template assignment missing'
grep -Fq 'rosa_business_settings' "$SEED" || fail 'business settings guard missing'
grep -Fq 'ROSA_PREVIEW_ADDRESS_AR' "$SEED" || fail 'Arabic business address does not cross the seed boundary'
grep -Fq '../../apps/web/public/media:/rosa-reference-media:ro' "$COMPOSE" || fail 'WP-CLI Rosa media bind mount missing'
grep -Fq '/rosa-reference-media' "$SEED" || fail 'seed does not import through container-visible Rosa media path'
grep -Fq 'base64_decode' "$SEED" || fail 'preview values must cross the container boundary deterministically'
! grep -Fq 'getenv("ROSA_PREVIEW_PHONE")' "$SEED" || fail 'preview phone incorrectly depends on an unpassed container environment variable'
grep -Fq 'media_lines_b64' "$SEED" || fail 'preview media map boundary encoding missing'

# Verify import_media does not trigger unbound variable errors in strict mode
env -i PATH="$PATH" bash -euo pipefail -c '
ROOT_DIR="'"$ROOT"'"
REFERENCE_MEDIA_ROOT="/test-media"
fail(){ printf "mock fail: %s\n" "$1" >&2; exit 1; }
wp(){ if [[ "$1" == "post" ]]; then echo "99"; else echo "99"; fi; }
'"$(sed -n '/^import_media(){/,/^}/p' "$SEED")"'
import_media logo apps/web/public/media/brand/rosa-header-logo-v1.webp >/dev/null
' || fail 'import_media failed strict-mode execution test (e.g. unbound local variable)'

printf 'PASS: client preview seed source contract\n'
