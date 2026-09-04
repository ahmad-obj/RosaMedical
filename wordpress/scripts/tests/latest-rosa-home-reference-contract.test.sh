#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SOURCE_HOME="$ROOT/apps/web/src/features/homepage/homepage.tsx"
SOURCE_STATE="$ROOT/apps/web/src/features/homepage/hero-carousel-state.ts"
SOURCE_TOKENS="$ROOT/apps/web/src/styles/tokens.css"
WP_TOKENS="$ROOT/wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

expected=(PublicHeroCarousel FamilyDiscovery ComprehensivePlans SecuringConfidence HomeContactBand ClientSuccessAssurance QuotationCta)
last=0
for symbol in "${expected[@]}"; do
  line="$(grep -n "<$symbol\\|$symbol model=\\|$symbol intro=" "$SOURCE_HOME" | tail -n1 | cut -d: -f1)"
  [[ "$line" =~ ^[0-9]+$ && "$line" -gt "$last" ]] || fail "latest Homepage order drifted at $symbol"
  last="$line"
done

grep -Fq 'HERO_AUTOPLAY_MS = 4_750' "$SOURCE_STATE" || fail 'source hero autoplay changed'
for literal in '#e00815' '#b9000b' '#191917' '#2d2d2a' '#f9f7f2' '#ffffff' '#f1f1ee' '#646b70' '#d7d7d1' '80rem' '72rem' 'clamp(1.25rem, 4vw, 5rem)' 'cubic-bezier(0.22, 1, 0.36, 1)'; do
  grep -Fq -- "$literal" "$SOURCE_TOKENS" || fail "source token missing: $literal"
  grep -Fq -- "$literal" "$WP_TOKENS" || fail "WordPress token parity missing: $literal"
done

printf 'PASS: latest Rosa Homepage source order, hero timing and design tokens are pinned\n'
