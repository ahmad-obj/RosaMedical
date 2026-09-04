#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT"
TARGET=d0726eed34b4fc14267570853ade8b74df49ae9e
TOKENS=wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css
FUNCTIONS=wordpress/wp-content/themes/rosa-medical-child/functions.php
AUTHORING=wordpress/wp-content/themes/rosa-medical-child/page-templates/rosa-elementor-authoring.php
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

git cat-file -e "$TARGET^{commit}" 2>/dev/null || fail "pinned MedicaShop target commit unavailable"
[[ "$(git show "$TARGET:wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css" | sha1sum | awk '{print $1}')" == "$(sha1sum wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css | awk '{print $1}')" ]] || fail "client-preview.css drifted from target"

for literal in \
  '--rosa-red: #e00815' \
  '--rosa-red-strong: #b90a14' \
  '--rosa-ink: #111214' \
  '--rosa-ink-soft: #2c2e33' \
  '--rosa-surface: #f7f7f8' \
  '--rosa-surface-strong: #eceef1' \
  '--rosa-text: #18191c' \
  '--rosa-muted: #686c74' \
  '--rosa-border: #d9dce1' \
  '--rosa-shell: 90rem' \
  '--rosa-gutter: clamp(1rem, 2.5vw, 2.5rem)'; do
  grep -Fq -- "$literal" "$TOKENS" || fail "target token missing: $literal"
done

! grep -Fq 'latest-rosa-home.css' "$FUNCTIONS" || fail "latest custom Home CSS still enqueued"
! grep -Fq 'latest-rosa-home-fidelity.css' "$FUNCTIONS" || fail "latest custom Home fidelity CSS still enqueued"
! grep -Fq 'latest-rosa-home.js' "$FUNCTIONS" || fail "latest custom Home JS still enqueued"
grep -Fq "get_template_part('template-parts/client-preview/cta-banner'" "$AUTHORING" || fail "shared CTA missing from authoring template"
! grep -Fq 'rosa_is_latest_home_page' "$AUTHORING" || fail "Home still suppresses the target shared CTA"

printf 'PASS: finished MedicaShop-derived Rosa style authority is restored\n'
