#!/usr/bin/env bash
set -euo pipefail

WORDPRESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE="$WORDPRESS_DIR/dev/compose.yaml"
BOOTSTRAP="$WORDPRESS_DIR/scripts/foundation-bootstrap.sh"
REPORT="$WORDPRESS_DIR/scripts/foundation-version-report.sh"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

grep -q '../wp-content/plugins/rosa-medical-core:/var/www/html/wp-content/plugins/rosa-medical-core' "$COMPOSE" || fail 'plugin source mount missing'
grep -q '../wp-content/themes/rosa-medical-child:/var/www/html/wp-content/themes/rosa-medical-child' "$COMPOSE" || fail 'theme source mount missing'
[[ -f "$BOOTSTRAP" ]] || fail 'foundation-bootstrap.sh missing'
[[ -f "$REPORT" ]] || fail 'foundation-version-report.sh missing'
! grep -Eqi 'medicashop|elementor-pro|elementor_pro|wpml|elementskit|skyboot|hostinger' "$BOOTSTRAP" || fail 'bootstrap contains prohibited dependency/infrastructure reference'
for token in hello-elementor elementor woocommerce rosa-medical-child rosa-medical-core; do
  grep -q "$token" "$BOOTSTRAP" || fail "bootstrap missing $token"
done
for token in elementor woocommerce rosa-medical-core rosa-medical-child; do
  grep -q "$token" "$REPORT" || fail "version report missing $token"
done

printf 'PASS: free foundation compose/bootstrap contract\n'
