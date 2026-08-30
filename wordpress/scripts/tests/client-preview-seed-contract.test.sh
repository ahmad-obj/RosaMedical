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
grep -Fq '../../apps/web/public/media:/rosa-reference-media:ro' "$COMPOSE" || fail 'WP-CLI Rosa media bind mount missing'
grep -Fq '/rosa-reference-media' "$SEED" || fail 'seed does not import through container-visible Rosa media path'
printf 'PASS: client preview seed source contract\n'
