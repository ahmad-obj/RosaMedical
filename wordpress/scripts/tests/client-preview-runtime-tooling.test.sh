#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
RUNTIME="$ROOT/wordpress/scripts/client-preview-runtime-verify.sh"
CAPTURE="$ROOT/wordpress/scripts/client-preview-responsive-capture.sh"
VIDEO="$ROOT/wordpress/scripts/client-preview-video-capture.sh"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$RUNTIME" ]] || fail 'client preview runtime verifier missing'
[[ -f "$CAPTURE" ]] || fail 'client preview responsive capture missing'
[[ -f "$VIDEO" ]] || fail 'client preview video capture missing'
grep -Fq 'client-preview-seed.sh' "$RUNTIME" || fail 'runtime verifier does not seed client preview'
grep -Fq '390,844' "$CAPTURE" || fail '390x844 capture missing'
grep -Fq '2560,1440' "$CAPTURE" || fail '2560x1440 capture missing'
grep -Fq '/ar/' "$CAPTURE" || fail 'Arabic capture routes missing'
grep -Fq 'recordVideo' "$VIDEO" || fail 'Playwright video recording missing'
grep -Fq 'client-preview-artifacts' "$CAPTURE" || fail 'ignored artifact directory missing from capture tooling'
printf 'PASS: client preview runtime tooling contract\n'
