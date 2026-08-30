#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
MANIFEST="$ROOT/docs/superpowers/reports/2026-08-30-client-preview-reference-manifest.md"
PRODUCTION="$ROOT/wordpress/wp-content"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$MANIFEST" ]] || fail 'client preview reference manifest missing'
grep -Fq 'Homepage: 23 captured Elementor sections' "$MANIFEST" || fail 'homepage reference count missing'
grep -Fq 'About: 19 captured Elementor sections' "$MANIFEST" || fail 'about reference count missing'
grep -Fq 'Contact: 13 captured Elementor sections' "$MANIFEST" || fail 'contact reference count missing'
grep -Fq 'Shop: asset/style evidence; saved shop HTML is not authoritative' "$MANIFEST" || fail 'shop evidence limitation missing'
if grep -RIlE 'fullkit\.moxcreative\.com|preview\.themeforest\.net|wp-content/plugins/elementor-pro|elements-kit-lite|skyboot-custom-icons' "$PRODUCTION" >/tmp/rosa-preview-proprietary-hits.txt; then
  cat /tmp/rosa-preview-proprietary-hits.txt >&2
  fail 'proprietary/demo source reference found under wordpress/wp-content'
fi
printf 'PASS: client preview reference/source boundary\n'
