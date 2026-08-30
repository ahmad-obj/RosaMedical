#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
TOKENS="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css"
BASE="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css"
FUNCTIONS="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/functions.php"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

grep -Fq -- '--color-rosa-red: #e00815' "$TOKENS" || fail 'Rosa red missing'
grep -Fq -- '--color-rosa-red-dark: #b9000b' "$TOKENS" || fail 'dark red missing'
grep -Fq -- '--color-ink: #191917' "$TOKENS" || fail 'ink missing'
grep -Fq -- '--color-warm-white: #f9f7f2' "$TOKENS" || fail 'warm white missing'
grep -Fq -- '--container-reading: 46rem' "$TOKENS" || fail 'reading rail missing'
grep -Fq -- '--container-standard: 72rem' "$TOKENS" || fail 'standard rail missing'
grep -Fq -- '--container-wide: 80rem' "$TOKENS" || fail 'wide rail missing'
grep -Fq -- '--container-archive: 90rem' "$TOKENS" || fail 'archive rail missing'
grep -Fq -- '--radius-control: 0.25rem' "$TOKENS" || fail 'control radius missing'
grep -Fq -- '--radius-surface: 0.125rem' "$TOKENS" || fail 'surface radius missing'
grep -Fq -- '--motion-micro: 160ms' "$TOKENS" || fail 'micro motion missing'
grep -Fq -- '--motion-component: 280ms' "$TOKENS" || fail 'component motion missing'
grep -Fq 'font-family: var(--font-interface)' "$BASE" || fail 'body interface font missing'
grep -Fq "rosa-medical-fonts" "$FUNCTIONS" || fail 'font enqueue missing'
printf 'PASS: Phase 2A token contract\n'
