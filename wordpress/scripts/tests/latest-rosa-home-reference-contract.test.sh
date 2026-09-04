#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SOURCE_HOME="$ROOT/apps/web/src/features/homepage/homepage.tsx"
SOURCE_STATE="$ROOT/apps/web/src/features/homepage/hero-carousel-state.ts"
SOURCE_TOKENS="$ROOT/apps/web/src/styles/tokens.css"
SOURCE_HERO_CSS="$ROOT/apps/web/src/styles/public-hero.css"
SOURCE_HOME_CSS="$ROOT/apps/web/src/styles/home-client-redesign.css"
SOURCE_HOME_POLISH="$ROOT/apps/web/src/styles/home-client-redesign-polish.css"
SOURCE_HOME_INTERACTIONS="$ROOT/apps/web/src/styles/home-client-interaction-fixes.css"
SOURCE_FAMILY_CSS="$ROOT/apps/web/src/styles/public-feedback-fixes.css"
WP_TOKENS="$ROOT/wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css"
WP_HOME_CSS="$ROOT/wordpress/wp-content/themes/rosa-medical-child/assets/css/latest-rosa-home.css"
WP_SEED="$ROOT/wordpress/scripts/client-preview-seed.sh"
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

[[ -f "$WP_HOME_CSS" ]] || fail 'latest Rosa WordPress Home CSS is missing'
for literal in \
  'min-height: clamp(23.5rem, 44vw, 31rem)' \
  'height: min(57svh, 31rem)' \
  'font-size: clamp(2.05rem, 3.35vw, 3.05rem)' \
  'grid-template-columns: repeat(5, minmax(0, 1fr))' \
  'grid-template-columns: repeat(4, minmax(0, 1fr))' \
  'min-height: 5.6rem' \
  'aspect-ratio: 1.6 / 1' \
  'aspect-ratio: 5 / 6' \
  'transform: scale(1.14)' \
  '@media (max-width: 64rem)' \
  '@media (max-width: 40rem)' \
  '@media (prefers-reduced-motion: reduce)'; do
  grep -Fq -- "$literal" "$WP_HOME_CSS" || fail "WordPress latest Home CSS contract missing: $literal"
done

for source_check in \
  "$SOURCE_HERO_CSS:min-height: clamp(23.5rem, 44vw, 31rem)" \
  "$SOURCE_HOME_CSS:grid-template-columns: repeat(4, minmax(0, 1fr))" \
  "$SOURCE_HOME_POLISH:min-height: 5.6rem" \
  "$SOURCE_HOME_INTERACTIONS:transform: scale(1.14)" \
  "$SOURCE_FAMILY_CSS:grid-template-columns: repeat(5, minmax(0, 1fr))"; do
  file="${source_check%%:*}"
  literal="${source_check#*:}"
  grep -Fq -- "$literal" "$file" || fail "latest source CSS drifted: $literal"
done

for cover in \
  'scissors-family-cover-full.svg' \
  'cutters-family-cover-full.svg' \
  'punches-family-cover.webp' \
  'chisels-family-cover-full.svg' \
  'knives-family-cover-full.svg'; do
  grep -Fq -- "$cover" "$WP_SEED" || fail "exact family cover seed missing: $cover"
done

grep -Fq 'rosa-reference/homepage-covers' "$WP_SEED" || fail 'family covers must be copied to deterministic WordPress uploads path'

printf 'PASS: latest Rosa Homepage source order, hero timing, design tokens and parity CSS are pinned\n'